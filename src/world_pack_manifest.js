// Proposal (WPL2): world pack manifest and record validation. Pure; nothing is
// registered, ticked or saved here. See
// docs/gm/dispatch/world-pack-loader-2026-10-16/DESIGN.md.
import {address, hash64, compareCodePoints} from './gen_kit.js';
import {stableId, jsonData} from './simulation_contracts.js';

export const WORLD_PACK_FORMAT = 'yairpg.world-pack';
export const WORLD_PACK_FORMAT_VERSION = 1;
// Source provenance (where content comes from). Structure is `role` (P9S1).
export const PACK_KINDS = Object.freeze(['canon', 'generated', 'hybrid', 'original']);
export const PACK_ROLES = Object.freeze(['world', 'series', 'cosmology', 'multiverse', 'cluster', 'universe', 'rulebook']);
// Loader composition ladder above a world, outermost first (P9M2, P9S1d-e).
export const PARENT_LAYERS = Object.freeze(['cosmology', 'multiverse', 'cluster', 'series', 'universe']);
// P9M1a-m: independent world axes. A preset only fills overridable defaults.
export const WORLD_AXES = Object.freeze(['cosmology', 'law', 'resolution', 'progression', 'scale', 'time', 'lifeDeath', 'metaphysics', 'canonCourse', 'persistence', 'tone', 'society', 'being']);
// P9M3: whose rules apply when worlds meet.
export const AUTHORITY_MODELS = Object.freeze(['place', 'traveler', 'raw', 'equalized', 'dominant']);
// MC5-3/MC5-6: licence tiers that may ship; private research never loads.
export const LICENCE_TIERS = Object.freeze(['original', 'canon-reference', 'srd-cc-by', 'orc', 'fanwork-private']);
export const REFUSED_LICENCES = Object.freeze(['private-research']);
export const COVERAGE = Object.freeze(['background', 'inspectable', 'playable']);
export const RULINGS = Object.freeze(['supported', 'needs_ruling', 'unsupported']);
export const SLOT_KINDS = Object.freeze(['cohort_members', 'minor_site', 'material_variant', 'recipe', 'storylet', 'micro_detail']);
// Only these have a reader in this slice (GR12); the rest load dormant.
export const ACTIVE_SLOT_KINDS = Object.freeze(['cohort_members']);
// Draws one generated cohort member uses (given, family, trait, club).
export const MEMBER_DRAWS = 4;
export const EXCEPTION_PRIORITY = Object.freeze({canon_event: 50, quest: 40, illness: 30, detention: 20, club: 10});
export const RULE_LAYERS = Object.freeze(['core', 'world', 'region', 'actor', 'director']);
export const FAMILIES = Object.freeze(['catalog', 'areas', 'institutions', 'cohorts', 'people', 'relationships', 'exceptions', 'slots', 'secrets', 'crossings']);
// Display text: excluded from the fingerprint (P9P2c) and linted for sealed terms (IS7).
export const TEXT_KEYS = Object.freeze(['label', 'title', 'name', 'description', 'notice', 'text', 'summary']);

const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = v => typeof v === 'string' && v.length > 0;
const positive = n => Number.isSafeInteger(n) && n > 0;
const natural = n => Number.isSafeInteger(n) && n >= 0;
const axisMap = v => object(v) && Object.keys(v).every(k => WORLD_AXES.includes(k)) &&
    Object.values(v).every(x => text(x) || Array.isArray(x) && x.every(text) || object(x));
const ids = v => Array.isArray(v) && v.every(stableId) && new Set(v).size === v.length;
const weighted = v => Array.isArray(v) && v.length > 0 && v.every(x => object(x) && text(x.id) && natural(x.weight)) && new Set(v.map(x => x.id)).size === v.length;
const only = (v, allowed) => object(v) && Object.keys(v).every(k => allowed.includes(k));

export function diagnostic(severity, code, packId, subjectId, message) {
    // Author-only (P9P2e). Messages name IDs and codes, never sealed truth.
    return {severity, code, packId: packId ?? null, subjectId: subjectId ?? null, message};
}
export const inNamespace = (packId, id) => stableId(id) && id.startsWith(packId + '.');
// Two pack IDs may not nest ("a.b" and "a.b.c"): an ID's owner must be unique.
export const namespacesOverlap = (a, b) => a !== b && (a.startsWith(b + '.') || b.startsWith(a + '.'));

function integersOnly(value) {
    if (typeof value === 'number') return Number.isSafeInteger(value);
    if (Array.isArray(value)) return value.every(integersOnly);
    if (object(value)) return Object.values(value).every(integersOnly);
    return true;
}
function stripText(value) {
    if (Array.isArray(value)) return value.map(stripText);
    if (!object(value)) return value;
    return Object.fromEntries(Object.entries(value).filter(([k]) => !TEXT_KEYS.includes(k)).map(([k, v]) => [k, stripText(v)]));
}
// Hash of what matters: rules, slots, budgets, structure. Not display text.
export function fingerprintWorldPack(pack) {
    const {lo, hi} = hash64('world-pack@1', address(stripText(pack)));
    return `wp1:${hi.toString(16).padStart(8, '0')}${lo.toString(16).padStart(8, '0')}`;
}
// Every player-facing string (TEXT_KEYS) anywhere in a record.
export function playerTexts(value, out = []) {
    if (Array.isArray(value)) value.forEach(v => playerTexts(v, out));
    else if (object(value)) for (const [k, v] of Object.entries(value)) {
        if (TEXT_KEYS.includes(k) && typeof v === 'string') out.push(v); else playerTexts(v, out);
    }
    return out;
}
// IS7: lint compiled text, not cards. Terms come from sealed secret records,
// which are author data and never player text themselves.
export function sealedTermsIn(texts, secrets) {
    const hits = [];
    for (const s of secrets) for (const term of s.sealedTerms || [])
        if (texts.some(t => t.toLowerCase().includes(term.toLowerCase()))) hits.push(s.id);
    return [...new Set(hits)].sort(compareCodePoints);
}

const RECORD_FIELDS = {
    catalog: ['id', 'label', 'kind', 'locator', 'era', 'canonWeight', 'containedIn', 'licence', 'counterpartOf'],
    areas: ['id', 'label', 'coverage', 'routes', 'activities', 'people', 'slots', 'institution', 'requiresFeatures', 'tags'],
    institutions: ['id', 'label', 'houses', 'blocks', 'calendar', 'commons', 'clubs'],
    cohorts: ['id', 'label', 'institution', 'house', 'entryYear', 'count', 'timetable', 'slot'],
    people: ['id', 'name', 'cohort', 'canonWeight', 'locator', 'club', 'tags', 'counterpartOf'],
    relationships: ['id', 'a', 'b', 'kind', 'source'],
    exceptions: ['id', 'kind', 'personId', 'cohortId', 'placeId', 'start', 'end'],
    slots: ['id', 'kind', 'generator', 'table', 'budget', 'requiresFeature'],
    secrets: ['id', 'sealed', 'route', 'status', 'sealedTerms'],
    crossings: ['id', 'to', 'authority', 'conversion', 'cause', 'rule', 'scaleRule'],
};
// Shape only; references are checked by the loader once all packs are known.
const RECORD_CHECKS = {
    catalog: r => text(r.kind) && (r.counterpartOf == null || stableId(r.counterpartOf)) && (r.canonWeight == null || ['W0', 'W1', 'W2', 'W3'].includes(r.canonWeight)),
    areas: r => COVERAGE.includes(r.coverage) && Array.isArray(r.routes) &&
        r.routes.every(x => only(x, ['to', 'method', 'minutes']) && stableId(x.to) && text(x.method) && positive(x.minutes)) &&
        (r.activities == null || ids(r.activities)) && (r.people == null || ids(r.people)) && (r.slots == null || ids(r.slots)) &&
        (r.requiresFeatures == null || Array.isArray(r.requiresFeatures) && r.requiresFeatures.every(text)),
    institutions: r => Array.isArray(r.houses) && r.houses.length > 0 && r.houses.every(h => only(h, ['id', 'label', 'dorm']) && stableId(h.id) && stableId(h.dorm)) &&
        Array.isArray(r.blocks) && r.blocks.every(b => only(b, ['id', 'start', 'end']) && stableId(b.id) && natural(b.start) && b.end > b.start && b.end <= 1440) &&
        object(r.calendar) && positive(r.calendar.weekLength) && Array.isArray(r.calendar.terms) &&
        r.calendar.terms.every(t => Array.isArray(t) && t.length === 2 && natural(t[0]) && t[1] > t[0]) && stableId(r.commons) &&
        (r.clubs == null || Array.isArray(r.clubs) && r.clubs.every(c => only(c, ['id', 'label', 'weekday', 'block', 'place']) && stableId(c.id) && natural(c.weekday) && stableId(c.block) && stableId(c.place))),
    cohorts: r => stableId(r.institution) && stableId(r.house) && natural(r.entryYear) && natural(r.count) && object(r.timetable) &&
        Object.entries(r.timetable).every(([day, row]) => /^\d+$/.test(day) && object(row) && Object.values(row).every(stableId)) && (r.slot == null || stableId(r.slot)),
    people: r => text(r.name) && (r.counterpartOf == null || stableId(r.counterpartOf)) && (r.cohort == null || stableId(r.cohort)) && (r.club == null || stableId(r.club)) &&
        (r.canonWeight == null || ['W0', 'W1', 'W2', 'W3'].includes(r.canonWeight)),
    relationships: r => stableId(r.a) && stableId(r.b) && r.a !== r.b && text(r.kind) && ['canon', 'play'].includes(r.source),
    exceptions: r => Object.hasOwn(EXCEPTION_PRIORITY, r.kind) && (stableId(r.personId) !== stableId(r.cohortId)) &&
        (r.placeId === null || stableId(r.placeId)) && natural(r.start) && Number.isSafeInteger(r.end) && r.end > r.start,
    slots: r => SLOT_KINDS.includes(r.kind) && text(r.generator) && object(r.table) && positive(r.table.revision) &&
        object(r.budget) && positive(r.budget.maxEntities) && positive(r.budget.maxDrawsPerEntity) &&
        (r.kind !== 'cohort_members' || r.budget.maxDrawsPerEntity >= MEMBER_DRAWS && ['given', 'family', 'traits'].every(k => weighted(r.table[k])) &&
            natural(r.table.noClubWeight) && natural(r.table.clubWeight)),
    secrets: r => r.sealed === true && text(r.route) && text(r.status) && (r.sealedTerms == null || Array.isArray(r.sealedTerms) && r.sealedTerms.every(text)),
    // A missing or incomplete authority model is a loader code, not a shape error, so it is reported by name.
    crossings: r => stableId(r.to) && (r.authority == null || text(r.authority)) && ['conversion', 'cause', 'rule', 'scaleRule'].every(k => r[k] == null || stableId(r[k])),
};
function validateProfile(p, packId) {
    if (!only(p, ['id', 'revision', 'extends', 'resolver', 'growthUnit', 'scaleClass', 'directorPolicy', 'modules', 'rulings', 'label']) ||
        !inNamespace(packId, p.id) || !positive(p.revision) || (p.extends != null && !stableId(p.extends)) || !text(p.resolver) || !text(p.growthUnit) ||
        !text(p.scaleClass) || !text(p.directorPolicy) || !Array.isArray(p.modules) || !object(p.rulings)) return 'Invalid rule profile shape.';
    for (const m of p.modules) {
        if (!object(m) || !stableId(m.id) || !object(m.priority) || !RULE_LAYERS.includes(m.priority.layer)) return 'Invalid rule module reference.';
        if (!RULINGS.includes(p.rulings[m.id])) return `Rule module ${m.id} has no ruling status.`;
    }
    return null;
}

// Returns {pack, fatal, diagnostics, dormant:Map(id->code), records:Map(id->{family, record})}.
// A fatal result means the whole pack is dormant (WP5); otherwise bad records
// are dormant individually (P9P2d) and the loader continues.
export function validateWorldPack(raw) {
    const diagnostics = [], dormant = new Map(), records = new Map();
    const id = object(raw) && stableId(raw.id) ? raw.id : null;
    const fail = (code, message) => ({pack: null, id, fatal: true, diagnostics: [...diagnostics, diagnostic('error', code, id, id, message)], dormant, records});
    try { jsonData(raw); } catch { return fail('not-json', 'Pack is not plain JSON data.'); }
    if (!object(raw) || raw.format !== WORLD_PACK_FORMAT) return fail('format', 'Not a world pack.');
    if (raw.formatVersion !== WORLD_PACK_FORMAT_VERSION) return fail('format-version', `Unsupported world pack format version ${raw.formatVersion}.`);
    if (!only(raw, ['format', 'formatVersion', 'id', 'revision', 'saveSchema', 'saveCompatibleFrom', 'kind', 'title', 'sourceSnapshot', 'generator', 'attribution', 'requires', 'provides', 'budgets', 'entryArea', 'retired', 'content', 'native',
        'role', 'preset', 'axes', 'lock', 'memberships']))
        return fail('header-fields', 'Unknown world pack header field.');
    if (!id || !positive(raw.revision) || !positive(raw.saveSchema) || !PACK_KINDS.includes(raw.kind) || !text(raw.title) ||
        (raw.saveCompatibleFrom != null && !(positive(raw.saveCompatibleFrom) && raw.saveCompatibleFrom <= raw.revision)))
        return fail('header', 'Invalid world pack header.');
    if (!integersOnly(raw)) return fail('non-integer', 'Pack numbers must be safe integers (IS2).');
    const role = raw.role ?? 'world';
    if (!PACK_ROLES.includes(role)) return fail('role', 'Unknown pack role.');
    if (raw.axes != null && !axisMap(raw.axes)) return fail('axes', 'Unknown world axis or value (P9M1).');
    if (raw.preset != null && !stableId(raw.preset)) return fail('axes', 'Invalid preset reference.');
    if (raw.lock != null && !(PARENT_LAYERS.includes(role) && Array.isArray(raw.lock) && raw.lock.every(x => WORLD_AXES.includes(x)) && new Set(raw.lock).size === raw.lock.length))
        return fail('lock', 'Only parent packs lock axes, and only known axes (P9M2b).');
    const ms = raw.memberships ?? [];
    if (!Array.isArray(ms) || !ms.every(m => only(m, ['parent', 'layer', 'scopes']) && stableId(m.parent) && m.parent !== raw.id && PARENT_LAYERS.includes(m.layer) &&
        Array.isArray(m.scopes) && m.scopes.length > 0 && m.scopes.every(x => WORLD_AXES.includes(x)) && new Set(m.scopes).size === m.scopes.length) ||
        new Set(ms.map(m => m.layer)).size !== ms.length || new Set(ms.map(m => m.parent)).size !== ms.length ||
        PARENT_LAYERS.includes(role) && ms.some(m => PARENT_LAYERS.indexOf(m.layer) >= PARENT_LAYERS.indexOf(role)))
        return fail('memberships', 'Memberships are a list of distinct outer parents, one per layer, with declared scopes (P9M2c).');
    const a = raw.attribution;
    if (!only(a, ['source', 'licence', 'notice']) || !text(a.source) || !text(a.notice)) return fail('attribution', 'Attribution with source and notice is required (MC5-3).');
    if (REFUSED_LICENCES.includes(a.licence)) return fail('licence-refused', 'Private research never ships in a pack (MC5-6).');
    if (!LICENCE_TIERS.includes(a.licence)) return fail('licence', 'Unknown licence tier.');
    if ((raw.kind === 'canon' || raw.kind === 'hybrid') && !(object(raw.sourceSnapshot) && text(raw.sourceSnapshot.hash)))
        return fail('source-snapshot', 'Canon packs pin a source snapshot.');
    if (raw.kind === 'generated' && !(object(raw.generator) && text(raw.generator.id) && positive(raw.generator.version) && object(raw.generator.receipt)))
        return fail('generator', 'Generated packs record generator id, version and receipt (P9P3c).');
    const b = raw.budgets;
    if (!only(b, ['entities', 'drawsPerEntity', 'saveBytes', 'presenceQueryMicros']) || !['entities', 'drawsPerEntity', 'saveBytes'].every(k => positive(b[k])))
        return fail('budgets', 'Declared budgets are required (CX5, GR11).');
    const r = raw.requires ?? {};
    if (!only(r, ['features', 'packs', 'ruleProfile']) || !(r.features == null || Array.isArray(r.features) && r.features.every(text)) ||
        !(r.packs == null || Array.isArray(r.packs) && r.packs.every(d => only(d, ['id', 'minRevision']) && stableId(d.id) && positive(d.minRevision))) ||
        !(r.ruleProfile == null || stableId(r.ruleProfile)))
        return fail('requires', 'Invalid requirements.');
    if (r.packs?.some(d => d.id === id)) return fail('self-dependency', 'A pack cannot require itself.');
    const retired = raw.retired ?? [];
    if (!Array.isArray(retired) || !retired.every(x => only(x, ['id', 'since']) && inNamespace(id, x.id) && positive(x.since) && x.since <= raw.revision))
        return fail('retired', 'Invalid retired ID list.');
    const retiredIds = new Set(retired.map(x => x.id));
    const content = raw.content;
    if (!object(content) || !Object.keys(content).every(k => FAMILIES.includes(k)) || !Object.values(content).every(Array.isArray))
        return fail('content', 'Invalid content families.');
    const provides = raw.provides ?? {};
    if (!only(provides, ['ruleProfiles', 'presets']) || !(provides.ruleProfiles == null || Array.isArray(provides.ruleProfiles)) ||
        !(provides.presets == null || Array.isArray(provides.presets) && provides.presets.every(x => only(x, ['id', 'label', 'axes']) && inNamespace(raw.id, x.id) && axisMap(x.axes))))
        return fail('provides', 'Invalid provides block.');
    const profileIds = new Set();
    for (const p of provides.ruleProfiles || []) {
        const problem = validateProfile(p, id);
        if (problem || profileIds.has(p.id)) return fail('rule-profile', problem || 'Duplicate rule profile.');
        profileIds.add(p.id);
    }
    if (raw.native != null && !(object(raw.native) && raw.native.schema === 2 && raw.native.id === id))
        return fail('native', 'A native block is a schema-2 structured pack with the same ID.');

    const secrets = [];
    for (const family of FAMILIES) for (const rec of content[family] || []) {
        const rid = object(rec) ? rec.id : null;
        const bad = (code, message) => {diagnostics.push(diagnostic('error', code, id, stableId(rid) ? rid : null, message)); if (stableId(rid)) dormant.set(rid, code);};
        if (!object(rec) || !stableId(rid)) {diagnostics.push(diagnostic('error', 'record-id', id, null, `A ${family} record has no valid ID.`)); continue;}
        if (records.has(rid) || dormant.has(rid)) {bad('duplicate-id', `Duplicate ID in ${family}.`); records.delete(rid); continue;}
        if (!inNamespace(id, rid)) {bad('namespace', `ID outside the ${id}. namespace (WP6).`); continue;}
        if (retiredIds.has(rid)) {bad('retired-reuse', 'A retired ID is never reused (IS1).'); continue;}
        if (!only(rec, RECORD_FIELDS[family]) || !RECORD_CHECKS[family](rec)) {bad('shape', `Invalid ${family} record.`); continue;}
        records.set(rid, {family, record: rec});
        if (family === 'secrets') secrets.push(rec);
    }
    // IS7: no player-facing text may carry a sealed term. Only the record
    // holding the text goes dormant; the diagnostic names the secret by ID.
    for (const [rid, {family, record}] of [...records]) {
        if (family === 'secrets') continue;
        const hits = sealedTermsIn(playerTexts(record), secrets);
        if (hits.length) {records.delete(rid); dormant.set(rid, 'sealed-text');
            diagnostics.push(diagnostic('error', 'sealed-text', id, rid, `Player text would disclose sealed ${hits.join(', ')}.`));}
    }
    const headerHits = sealedTermsIn([raw.title, a.notice], secrets);
    if (headerHits.length) return fail('sealed-text', `Pack header would disclose sealed ${headerHits.join(', ')}.`);
    if (raw.entryArea != null && !(inNamespace(id, raw.entryArea))) return fail('entry', 'Entry area is outside the namespace.');
    return {pack: structuredClone(raw), id, fatal: false, diagnostics, dormant, records, fingerprint: fingerprintWorldPack(raw)};
}
