// Proposal (WPL3): per-pack save sections {packId, packRevision, schema, delta}.
// Pure functions over a proposed `world_packs` save key that nothing writes yet.
// Store only what play changed or revealed (P9Y30); never delete what a save holds.
import {check, object} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {stableId, jsonData} from './simulation_contracts.js';
import {EXCEPTION_PRIORITY, PARENT_LAYERS} from './world_pack_manifest.js';
import {edgeKey} from './world_pack_population.js';

export const WORLD_PACK_SAVES_SCHEMA = 1;
export const RUNGS = Object.freeze(['met', 'known', 'authored']);
const byId = (a, b) => compareCodePoints(a, b);
const only = (v, allowed) => object(v) && Object.keys(v).every(k => allowed.includes(k));

export const emptyWorldPackSaves = () => ({schema: WORLD_PACK_SAVES_SCHEMA, sections: {}});
// P9M5b: each instance freezes the profile id@rev and axes it was played under.
export const emptyInstanceDelta = pin => ({pin: structuredClone(pin), people: {}, edges: {}, exceptions: [], facts: {}});
const samePin = (a, b) => object(a) && a.profile === b.profile && a.axes === b.axes;
export const createSection = loaded => ({packId: loaded.id, packRevision: loaded.revision, schema: loaded.saveSchema, delta: {instances: {}, retired: {}}});

// Defined in this revision, active or dormant. Dormant records are kept in
// place (they may return); only IDs the pack no longer defines are retired.
export function definesPerson(loaded, id) {
    const r = loaded.records.get(id);
    if (r) return r.family === 'people';
    const m = /^(.*)\.m(\d+)$/.exec(id), c = m && loaded.records.get(m[1]);
    return c?.family === 'cohorts' && Number(m[2]) < c.record.count;
}
const definesArea = (loaded, id) => loaded.records.get(id)?.family === 'areas';

// WP8: a validator derived from the definition, not an exact whole-save schema.
export function validateSection(section, loaded) {
    jsonData(section);
    check(only(section, ['packId', 'packRevision', 'schema', 'delta']) && section.packId === loaded.id && section.packRevision === loaded.revision && section.schema === loaded.saveSchema, 'Section header disagrees with its pack.');
    const d = section.delta;
    check(only(d, ['instances', 'retired']) && object(d.instances) && object(d.retired), 'Invalid section delta.');
    for (const [instanceId, inst] of Object.entries(d.instances)) {
        check(stableId(instanceId) && only(inst, ['pin', 'people', 'edges', 'exceptions', 'facts']) && only(inst.pin, ['profile', 'axes']) &&
            (inst.pin.profile === null || typeof inst.pin.profile === 'string') && typeof inst.pin.axes === 'string' && object(inst.people) && object(inst.edges) && Array.isArray(inst.exceptions) && object(inst.facts), 'Invalid instance delta.');
        for (const [id, row] of Object.entries(inst.people)) check(definesPerson(loaded, id) && only(row, ['rung', 'frozen']) && RUNGS.includes(row.rung) && object(row.frozen), `Invalid person delta ${id}.`);
        for (const [key, e] of Object.entries(inst.edges)) check(only(e, ['a', 'b', 'kind', 'source']) && edgeKey(e.a, e.b) === key && definesPerson(loaded, e.a) && definesPerson(loaded, e.b) && ['play', 'frozen'].includes(e.source), `Invalid edge ${key}.`);
        for (const e of inst.exceptions) check(only(e, ['id', 'kind', 'personId', 'placeId', 'start', 'end']) && stableId(e.id) && Object.hasOwn(EXCEPTION_PRIORITY, e.kind) && definesPerson(loaded, e.personId) &&
            (e.placeId === null || definesArea(loaded, e.placeId)) && Number.isSafeInteger(e.start) && Number.isSafeInteger(e.end) && e.end > e.start, `Invalid exception ${e.id}.`);
        check(Object.keys(inst.facts).every(k => k.startsWith(loaded.id + '.')) && Object.values(inst.facts).every(v => ['string', 'number', 'boolean'].includes(typeof v)), 'Invalid fact delta.');
    }
    for (const [key, r] of Object.entries(d.retired)) check(object(r) && Number.isSafeInteger(r.since) && typeof r.reason === 'string' && Object.hasOwn(r, 'value') && typeof key === 'string', 'Invalid retired entry.');
    return section;
}

// Migration registry: one step per (pack, from revision). Steps are pure,
// receive (section, loaded) and return the next section, including any new
// instance pins; they are the only sanctioned way to change frozen
// values (CG9 retcon).
export function createMigrationRegistry() {
    const steps = new Map();
    return Object.freeze({
        register({packId, from, to, migrate}) {
            check(stableId(packId) && Number.isSafeInteger(from) && Number.isSafeInteger(to) && to > from && typeof migrate === 'function', 'Invalid migration step.');
            const key = `${packId}@${from}`;
            check(!steps.has(key), 'Duplicate migration step.');
            steps.set(key, {packId, from, to, migrate});
        },
        step: (packId, from) => steps.get(`${packId}@${from}`) || null,
    });
}

// Walk the chain one revision at a time (P9P2b). Returns {section} or {code, message}.
export function migrateSection(section, loaded, migrations) {
    if (section.packRevision > loaded.revision) return {code: 'save-newer', message: 'This save comes from a newer version of this world. It is kept unchanged.'};
    let work = structuredClone(section);
    while (work.packRevision < loaded.revision) {
        const step = migrations?.step(loaded.id, work.packRevision);
        if (step && step.to <= loaded.revision) {
            try {work = step.migrate(structuredClone(work), loaded);} catch (error) {return {code: 'migration-failed', message: error.message};}
            if (!object(work) || work.packRevision !== step.to) return {code: 'migration-failed', message: `Step from ${step.from} did not reach ${step.to}.`};
        } else if (work.packRevision >= loaded.saveCompatibleFrom) work.packRevision++;
        else return {code: 'migration-gap', message: `No migration from revision ${work.packRevision}.`};
    }
    if (work.schema !== loaded.saveSchema) return {code: 'schema-mismatch', message: `Section schema ${work.schema} needs a migration to ${loaded.saveSchema}.`};
    // A rulebook or parent update never silently changes a lived-in world (MV12):
    // only a migration may move an instance's pin.
    for (const [instanceId, inst] of Object.entries(work.delta?.instances || {}))
        if (!samePin(inst.pin, loaded.pin)) return {code: 'profile-changed', message: `Instance ${instanceId} was played under other world rules; it needs a migration.`};
    return {section: work};
}

// P9P2g: entries naming IDs the pack no longer defines move to retired storage.
function retireUnknown(section, loaded) {
    const d = section.delta, retiredIds = new Set((loaded.pack.retired || []).map(x => x.id));
    const park = (key, value, ids) => {d.retired[key] = {value, since: loaded.revision, reason: ids.some(id => retiredIds.has(id)) ? 'retired' : 'missing'};};
    for (const instanceId of Object.keys(d.instances).sort(byId)) {
        const inst = d.instances[instanceId];
        for (const id of Object.keys(inst.people).sort(byId)) if (!definesPerson(loaded, id)) {park(`person:${instanceId}:${id}`, inst.people[id], [id]); delete inst.people[id];}
        for (const key of Object.keys(inst.edges).sort(byId)) {const e = inst.edges[key];
            if (!definesPerson(loaded, e.a) || !definesPerson(loaded, e.b)) {park(`edge:${instanceId}:${key}`, e, [e.a, e.b]); delete inst.edges[key];}}
        inst.exceptions = inst.exceptions.filter(e => {
            if (definesPerson(loaded, e.personId) && (e.placeId === null || definesArea(loaded, e.placeId))) return true;
            park(`exception:${instanceId}:${e.id}`, e, [e.personId, e.placeId]); return false;
        });
    }
    return section;
}

// IS8 + WP8 + WP9. Every section is either reconciled to its loaded pack or
// carried verbatim as dormant. Nothing is dropped.
export function reconcileWorldPackSaves(saves, registry, migrations = null) {
    const state = saves ?? emptyWorldPackSaves();
    check(object(state) && state.schema === WORLD_PACK_SAVES_SCHEMA && object(state.sections) && (state.clusters == null || object(state.clusters)) &&
        Object.keys(state).every(k => ['schema', 'sections', 'clusters'].includes(k)), 'Unsupported world pack save schema; the save is preserved for a matching reader.');
    const sections = {}, dormant = [];
    for (const packId of Object.keys(state.sections).sort(byId)) {
        const original = state.sections[packId], loaded = registry.packs.get(packId);
        const keep = (code, message) => {sections[packId] = structuredClone(original); dormant.push({packId, code, message});};
        if (!object(original) || original.packId !== packId) {keep('invalid-section', 'Section header is invalid.'); continue;}
        if (!loaded) {keep('pack-missing', registry.dormantPacks.has(packId) ? 'This world could not load in this version.' : 'This world is not installed in this version.'); continue;}
        const migrated = migrateSection(original, loaded, migrations);
        if (!migrated.section) {keep(migrated.code, migrated.message); continue;}
        try {sections[packId] = validateSection(retireUnknown(migrated.section, loaded), loaded);}
        catch (error) {keep('invalid-section', error.message);}
    }
    const clusters = {};
    for (const packId of Object.keys(state.clusters || {}).sort(byId)) {
        const original = state.clusters[packId], parent = registry.packs.get(packId);
        const keep = (code, message) => {clusters[packId] = structuredClone(original); dormant.push({packId, code, message, cluster: true});};
        if (!parent) {keep('pack-missing', 'This multiverse is not available in this version.'); continue;}
        const migrated = migrateSection(original, parent, migrations);
        if (!migrated.section) {keep(migrated.code, migrated.message); continue;}
        try {clusters[packId] = validateClusterSection(migrated.section, parent, registry);} catch (error) {keep('invalid-section', error.message);}
    }
    return {saves: {schema: WORLD_PACK_SAVES_SCHEMA, sections, ...(state.clusters != null ? {clusters} : {})}, dormant};
}

// P9S3f: state spanning a series or multiverse lives with the parent pack, not
// inside one world. Shape only in this slice; nothing writes it at runtime.
export const createClusterSection = parent => {
    check(PARENT_LAYERS.includes(parent.role), 'Only a parent pack holds a cluster section.');
    return {packId: parent.id, packRevision: parent.revision, schema: parent.saveSchema, delta: {members: [], facts: {}, events: {}}};
};
export function validateClusterSection(section, parent, registry) {
    jsonData(section);
    check(PARENT_LAYERS.includes(parent.role) && only(section, ['packId', 'packRevision', 'schema', 'delta']) && section.packId === parent.id &&
        section.packRevision === parent.revision && section.schema === parent.saveSchema, 'Cluster section header disagrees with its parent pack.');
    const d = section.delta;
    check(only(d, ['members', 'facts', 'events']) && Array.isArray(d.members) && object(d.facts) && object(d.events), 'Invalid cluster delta.');
    // Members are child packs that declare this parent; a cluster never writes a child's state (INV10).
    check(new Set(d.members).size === d.members.length && d.members.every(id => {const child = registry.packs.get(id);
        return !child || (child.pack.memberships || []).some(m => m.parent === parent.id);}), 'Cluster members must be children of the parent.');
    check(Object.keys(d.facts).every(k => k.startsWith(parent.id + '.')) && Object.values(d.facts).every(v => ['string', 'number', 'boolean'].includes(typeof v)), 'Invalid cluster facts.');
    for (const [id, e] of Object.entries(d.events)) check(id.startsWith(parent.id + '.') && only(e, ['status', 'touches', 'since']) && typeof e.status === 'string' &&
        Array.isArray(e.touches) && e.touches.every(stableId) && Number.isSafeInteger(e.since), `Invalid cluster event ${id}.`);
    return section;
}

const instance = (section, population) => {
    check(stableId(population.instanceId) && section.packId === population.packId, 'Section and population belong to different packs (INV10).');
    return section.delta.instances[population.instanceId] ??= emptyInstanceDelta(population.pin);
};
export const FROZEN_FIELDS = Object.freeze(['name', 'house', 'club', 'tags', 'entryYear']);
// GR3: on reveal, the shown fields are saved as values; later revisions of an
// unseen field do not change what the player already saw (WP9).
export function revealPerson(section, population, personId, {rung = 'met', fields = FROZEN_FIELDS} = {}) {
    const next = structuredClone(section), base = population.person(personId);
    check(base && RUNGS.includes(rung), 'Unknown person or rung.');
    const row = instance(next, population).people[personId] ??= {rung, frozen: {}};
    if (RUNGS.indexOf(rung) > RUNGS.indexOf(row.rung)) row.rung = rung;
    for (const f of fields) if (!Object.hasOwn(row.frozen, f)) row.frozen[f] = structuredClone(base[f]);
    return next;
}
export function personView(population, section, personId) {
    const base = population.person(personId);
    if (!base) return null;
    const row = section?.delta.instances[population.instanceId]?.people[personId];
    return row ? {...base, ...structuredClone(row.frozen), rung: row.rung} : {...base, rung: null};
}
// P9Q4: a derived edge the player relied on becomes a saved value.
export function freezeEdge(section, population, a, b) {
    const rel = population.relation(a, b);
    check(rel, 'No relationship to freeze.');
    const next = structuredClone(section);
    instance(next, population).edges[edgeKey(a, b)] = {a: [a, b].sort(byId)[0], b: [a, b].sort(byId)[1], kind: rel.kind, source: rel.source === 'derived' ? 'frozen' : 'play'};
    return next;
}
export function addException(section, population, exception) {
    const next = structuredClone(section);
    instance(next, population).exceptions.push(structuredClone(exception));
    instance(next, population).exceptions.sort((x, y) => byId(x.id, y.id));
    return next;
}
// Save exceptions feed presence queries through the population's own index.
export const savedExceptions = (section, population) => population.indexExceptions(section?.delta.instances[population.instanceId]?.exceptions || []);
// localStorage counts UTF-16 units (P9Q10): two bytes per character.
export const sectionBytes = section => JSON.stringify(section).length * 2;
