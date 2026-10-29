// L1 / CL55, CL57, CL77. Local only; no API or runtime mutation.
// node scripts/lead_run/build_crosswalk.mjs <mergedDir> --world lotm|mol
//   --from <locator> --to <locator> [--review <private.json>] [--report]
// Writes crosswalk.json and consumer_fitness.json beside the private merged inputs.
// Review shape: {entities:{indexId:runtimeId|new:id|skip:reason}, places:{text:registryPlaceId}}.
// Uncertain identities receive distinct deterministic proposals, never fuzzy matches.
import {readFileSync, writeFileSync, realpathSync} from 'node:fs';
import {resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parseLocator} from './world_profiles.mjs';
import {compareLocators} from './merge_shards.mjs';
import {LOTM_IDS, LOTM_LOCATIONS, LOTM_KEYS} from '../../src/book_world_lotm_ids.js';
import {MOL_IDS, MOL_LOCATIONS, MOL_KEYS} from '../../src/book_world_mol_ids.js';
import molPack from '../../src/world_packs/book_mol_pack.js';

const KINDS = new Set(['person', 'place', 'organization', 'item']);
const norm = s => String(s ?? '').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
const hash = s => createHash('sha256').update(s).digest('hex');
const list = v => Array.isArray(v) ? v : [];
const nonempty = v => typeof v === 'string' ? !!v.trim() : typeof v === 'number' ? Number.isFinite(v) : false;
const fields = row => [row?.locator, row?.firstMention, ...list(row?.evidence).map(e => e.locator)].filter(Boolean);
const key = loc => { const p = parseLocator(loc); return p ? [p.lang, p.book, p.ch, p.p] : null; };

// X2 joins reader identities to the selected private pack using explicit IDs,
// redirects, and authored aliases only. It never guesses from similar names.
export function buildPackJoin({crosswalk, registry, pack}) {
    const byReaderId = new Map(registry.map(row => [row.id, row]));
    const peopleByIndex = new Map((pack.people || []).map(row => [row.indexId, row.id]));
    const placesByIndex = new Map((pack.places || []).map(row => [row.indexId, row.id]));
    const placeRedirects = new Map((pack.placeAliases || []).map(row => [row.indexId, row.place]));
    const idMap = pack.idMap || {};
    const redirect = id => {
        const seen = new Set();
        while (idMap[id] && !seen.has(id)) { seen.add(id); id = idMap[id]; }
        return id;
    };
    const placeNames = new Map();
    const addPlaceName = (name, id) => {
        if (!nonempty(name)) return;
        const k = norm(name), values = placeNames.get(k) || new Set(); values.add(id); placeNames.set(k, values);
    };
    for (const row of registry.filter(row => row.kind === 'place')) {
        const target = placesByIndex.get(redirect(row.id)) || placesByIndex.get(row.id) || placeRedirects.get(row.id);
        if (!target) continue;
        for (const name of [row.id, row.label, row.zh, ...list(row.aliases)]) addPlaceName(name, target);
    }
    for (const row of pack.places || []) for (const name of [row.id, row.indexId, row.name, row.label]) addPlaceName(name, row.id);
    for (const row of pack.placeAliases || []) {
        const target = placesByIndex.get(row.place) || row.place;
        for (const name of [row.id, row.indexId, row.label]) addPlaceName(name, target);
    }
    const resolvePerson = readerId => {
        const row = byReaderId.get(readerId);
        if (row?.kind !== 'person') return null;
        const target = peopleByIndex.get(redirect(readerId)) || peopleByIndex.get(readerId);
        return target || null;
    };
    const resolvePlace = readerText => {
        if (!nonempty(readerText)) return {id:null, rule:'unresolved'};
        const direct = crosswalk.places?.[readerText];
        const directId = placesByIndex.get(redirect(direct)) || placesByIndex.get(direct) || placeRedirects.get(direct);
        if (directId) return {id:directId, rule:'crosswalk-id'};
        const exact = placeNames.get(norm(readerText));
        if (exact?.size === 1) return {id:[...exact][0], rule:'exact-alias'};
        // M4 uses comma/semicolon-separated nested place descriptions. Resolve
        // only an explicit component present in registry/pack alias data.
        const parts = String(readerText).split(/[,;，；]/).map(part => part.trim()).filter(Boolean).reverse();
        for (const part of parts) {
            const matches = placeNames.get(norm(part));
            if (matches?.size === 1) return {id:[...matches][0], rule:'contained-component'};
        }
        return {id:null, rule:'unresolved'};
    };
    return {resolvePerson, resolvePlace};
}
export function inSlice(row, {from, to} = {}) {
    const lo = key(from), hi = key(to);
    if (!lo || !hi || lo[0] !== hi[0] || compareLocators(from, to) > 0) throw new Error('Provide ordered --from and --to locators in the same source language');
    const locs = fields(row).filter(loc => key(loc)).sort(compareLocators);
    // Assign a scene by its earliest evidence, not any late mention in a spanning row.
    return !!locs.length && key(locs[0])[0] === lo[0] && compareLocators(locs[0], from) >= 0 && compareLocators(locs[0], to) <= 0;
}

export function discoverLeadPersonas(extras, {leadId, review = {}} = {}) {
    if (!leadId) return {leadPovIds: [], unresolved: []};
    const resolve = id => {
        const seen = new Set();
        while (review.redirect?.[id] && !seen.has(id)) { seen.add(id); id = review.redirect[id]; }
        return id;
    };
    const reviewed = new Set(Object.keys(review.redirect || {}).filter(id => resolve(id) === leadId));
    const leadPovIds = new Set([leadId]);
    const unresolved = new Map();
    for (const row of extras.filter(r => ['people', 'people_other'].includes(r.extra))) {
        for (const reveal of list(row.reveals)) {
            const from = resolve(row.id), to = resolve(reveal.same_as);
            if (from !== leadId && to !== leadId) continue;
            const candidate = from === leadId ? reveal.same_as : row.id;
            if (!nonempty(candidate) || candidate === leadId) continue;
            leadPovIds.add(candidate);
            if (!reviewed.has(candidate) && resolve(candidate) !== leadId) {
                const key = `${candidate}\0${reveal.locator || row.locator || ''}`;
                unresolved.set(key, {id: candidate, locator: reveal.locator || row.locator || null});
            }
        }
    }
    return {leadPovIds: [...leadPovIds].sort(), unresolved: [...unresolved.values()].sort((a, b) => a.id.localeCompare(b.id) || String(a.locator).localeCompare(String(b.locator)))};
}

// WA25 classes. First matching expression wins; no catch-all `other` inflation.
// These are keyword hits, not validated reaction grammar (CL60 remains separate).
const TRIGGERS = [
    ['fight', /\b(attack\w*|fight\w*|combat|duel\w*|ambush\w*|threat\w*|punch\w*|wrestl\w*|strangl\w*|assault\w*|shot|shoot\w*|weapon\w*|spell aimed|pounce|charging|hostile|aggress\w*)\b/],
    ['trade', /\b(buy\w*|bought|sell\w*|sold|pay\w*|paid|pric\w*|rent|money|coin\w*|bargain\w*|purchas\w*)\b/],
    ['care', /\b(help\w*|heal\w*|injur\w*|wound\w*|sick\w*|medic\w*|crying|rescu\w*|care|caring|comfort\w*|apolog\w*|reassur\w*|sooth\w*|clinging|sobbing|headache\w*|illness|tears)\b/],
    ['ritual', /\b(ritual\w*|pray\w*|prayer\w*|worship\w*|divin\w*|summon\w*)\b/],
    ['craft', /\b(craft\w*|brew\w*|cook\w*|repair\w*|build\w*|forg(?:e|es|ed|ing)|manufactur\w*|make\w*|making|bake\w*|spell forge|broken|stopping|failing|break\w*)\b/],
    ['practice', /\b(practic\w*|training|trained|trains|drill\w*|exercis\w*)\b/],
    ['study', /\b(stud\w*|teach\w*|taught|learn\w*|lesson\w*|classroom|lecture\w*|exam\w*|reading|read|mentor\w*|homework|assignment|primer|notebook|book|knowledge|formula|decod\w*|question on|master\w*|class|school|student|teacher|homework)\b/],
    ['research', /\b(research\w*|experiment\w*|investigat\w*|test\w*|discover\w*|evidence|mysteries|interview|case|search\w*|probe\w*|inspect\w*|check\w*|finding|identify\w*)\b/],
    ['appraise', /\b(apprais\w*|inspect\w*|assess\w*|evaluat\w*|examin\w*)\b/],
    ['travel', /\b(travel\w*|arriv\w*|depart\w*|journey\w*|walk\w*|enter\w*|visit\w*|leav\w*|left|return\w*|transfer\w*|moving|flight|flees|flee\w*|route|trip|goes to|going out|go out|come home|new tenant)\b/],
    ['rest', /\b(rest\w*|sleep\w*|slept|wake\w*|waking|woken|breakfast|meal\w*|eat\w*|ate|fatigue|tired|break|nap\w*|dinner|lunch)\b/],
    ['work', /\b(work\w*|job\w*|employ\w*|shift\w*|duty|duties|hired|payroll|overtime|layoff\w*|contract|business|office|interview|assignment|promotion|expelled|disciplin\w*)\b/],
    ['socialize', /\b(ask\w*|talk\w*|told|tell\w*|speak\w*|said|say\w*|greet\w*|gift\w*|insult\w*|lie|lies|lied|lying|ignore\w*|refus\w*|question\w*|pester\w*|argu\w*|invit\w*|request\w*|convers\w*|teas\w*|protest\w*|demand\w*|gossip|remark|jib\w*|comparison|probing look|questions|asking|pleading|warn\w*|offer\w*|request\w*|nickname|conversation|crowd\w*|cheer\w*|applaus\w*|praise|gathering|oath|greeting|explain\w*|speech|asking|declin\w*|approval|argument|invitation)\b/],
];
export function classifyAction(trigger) {
    if (typeof trigger !== 'string' || !trigger.trim()) return null;
    return TRIGGERS.find(([, re]) => re.test(norm(trigger)))?.[0] ?? null;
}

export function runtimeCatalogue(world) {
    if (!['lotm', 'mol'].includes(world)) throw new Error('world must be lotm or mol');
    const ids = world === 'mol' ? MOL_IDS : LOTM_IDS;
    const locations = world === 'mol' ? MOL_LOCATIONS : LOTM_LOCATIONS;
    const keys = world === 'mol' ? MOL_KEYS : LOTM_KEYS;
    const people = world === 'mol' ? molPack.content.people : [];
    // LOTM people are original roles, not canon cast identities; no name mapping.
    return {ids: new Set([...Object.values(ids), ...Object.values(locations), ...Object.values(keys), ...people.map(p => p.id)]), people};
}

function indexNames(registry) {
    const by = new Map();
    for (const row of registry) for (const name of [row.id, row.label, row.zh, ...list(row.aliases)]) {
        if (!nonempty(name)) continue;
        const k = `${row.kind}:${norm(name)}`;
        if (!by.has(k)) by.set(k, new Set());
        by.get(k).add(row.id);
    }
    return by;
}
const proposed = (world, kind, id) => `new:${world}.${kind}.cast-${hash(`${kind}:${id}`).slice(0, 20)}`;

export function buildCrosswalk({registry, scenes, extras, world, slice, runtime = runtimeCatalogue(world), review = {}, leadPovIds = []}) {
    const byId = new Map(registry.map(r => [r.id, r])), names = indexNames(registry);
    const leadPovs = new Set(['lead', ...leadPovIds]);
    const selected = scenes.filter(s => leadPovs.has(s.pov) && inSlice(s, slice));
    const mapping = {}, entities = {}, places = {}, ambiguousPlaces = new Set();
    const find = (value, kind) => {
        if (byId.get(value)?.kind === kind) return value;
        const candidates = names.get(`${kind}:${norm(value)}`);
        return candidates?.size === 1 ? [...candidates][0] : null;
    };
    function add(id, kind, locator = null, reason = 'lead-scene') {
        // The merged registry owns entity kind; POV/touched rows can disagree in source data.
        kind = byId.get(id)?.kind || kind;
        if (!nonempty(id) || !KINDS.has(kind)) return;
        if (entities[id] && entities[id].kind !== kind) throw new Error(`Conflicting entity kinds for ${id}`);
        if (!entities[id]) {
            const r = byId.get(id);
            let target = review.entities?.[id];
            if (target && !target.startsWith('new:') && !target.startsWith('skip:') && !runtime.ids.has(target)) throw new Error(`Unknown runtime target for ${id}`);
            // Only an exact pack name or exact runtime id is an automatic identity match.
            if (!target && kind === 'person') {
                const matches = runtime.people.filter(p => norm(p.name) === norm(r?.label || id));
                if (matches.length === 1 && names.get(`person:${norm(r?.label || id)}`)?.size === 1) target = matches[0].id;
            }
            if (!target) target = runtime.ids.has(id) ? id : proposed(world, kind, id);
            if (target.startsWith('new:') && !/^[a-z]+\.(person|place|organization|item)\.[a-z0-9_-]+$/.test(target.slice(4))) throw new Error(`Invalid new target for ${id}`);
            if (target === 'skip:') throw new Error(`Empty skip reason for ${id}`);
            mapping[id] = target;
            entities[id] = {kind, locators: [], reasons: []};
        }
        if (locator && !entities[id].locators.includes(locator)) entities[id].locators.push(locator);
        if (!entities[id].reasons.includes(reason)) entities[id].reasons.push(reason);
    }
    function place(value, locator, addRow = false) {
        if (!nonempty(value)) return null;
        let id = review.places?.[value];
        if (id && (byId.has(id) ? byId.get(id).kind !== 'place' : !new RegExp(`^${world}\\.place\\.[a-z0-9_-]+$`).test(id))) throw new Error(`Reviewed place is not a valid place id: ${id}`);
        id ||= find(value, 'place');
        const candidates = names.get(`place:${norm(value)}`);
        if (!id && candidates?.size > 1) ambiguousPlaces.add(value);
        // Missing or ambiguous text receives its OWN proposed place, never a guessed join.
        id ||= byId.has(value) && byId.get(value).kind !== 'place'
            ? `${world}.place.reference-${hash(value).slice(0, 20)}` : value;
        if (addRow) {
            add(id, 'place', locator, 'place-reference');
            places[value] = byId.get(id)?.kind === 'place' ? id : mapping[id].replace(/^new:/, '');
        }
        return {id, registry: byId.get(id)?.kind === 'place', ambiguous: ambiguousPlaces.has(value)};
    }
    for (const sc of selected) {
        const locator = fields(sc).filter(l => key(l)).sort(compareLocators)[0];
        if (sc.pov !== 'lead') add(sc.pov, byId.get(sc.pov)?.kind || /\.(person|place|organization|item)\./.exec(sc.pov)?.[1], locator, 'lead-persona-pov');
        for (const t of list(sc.touched)) if (['present', 'partial'].includes(t.status)) add(t.id, t.kind, locator);
        for (const id of list(sc.present)) add(id, byId.get(id)?.kind || (/\.(person|place|organization|item)\./.exec(id)?.[1]), locator);
        place(sc.place, locator, true);
    }
    // Routine locations supplement scene coverage. Only slots inside the selected source slice.
    for (const row of extras.filter(r => ['people', 'people_other'].includes(r.extra))) {
        for (const slot of list(row.routine)) if (inSlice({locator: slot.locator || row.locator}, slice)) place(slot.place, slot.locator || row.locator, true);
    }
    const metric = (usable, total) => ({usable, total, rate: total ? Math.round(10000 * usable / total) / 10000 : null});
    function fitness(scope) {
        const include = (item, row) => scope === 'all' || inSlice({locator: item?.locator || row?.locator}, slice);
        let relationTotal = 0, relationOk = 0, routineTotal = 0, routineOk = 0, routineRegistry = 0, routineOld = 0;
        let reactsTotal = 0, reactsOk = 0, rulesTotal = 0, rulesField = 0, rulesKnown = 0;
        let sceneTotal = 0, sceneOk = 0, sceneRegistry = 0;
        const classes = {};
        const hours = extras.filter(r => ['services', 'rules', 'rules_other'].includes(r.extra) && include(r, r));
        for (const row of extras) {
            if (['people', 'people_other'].includes(row.extra)) {
                for (const rel of list(row.relations)) if (include(rel, row)) { relationTotal++; if (find(rel.with, 'person')) relationOk++; }
                for (const slot of list(row.routine)) if (include(slot, row)) {
                    routineTotal++;
                    const p = place(slot.place, slot.locator || row.locator, scope === 'slice');
                    const time = hasTime(slot) || !!routineBand(slot) || hasRelativeTime(slot) || hours.some(r => matchesRoleHours(slot, row, r));
                    if (p?.registry && hasTime(slot)) routineOld++;
                    if (p && time) { routineOk++; if (p.registry) routineRegistry++; }
                }
                for (const react of list(row.reacts)) if (include(react, row)) {
                    reactsTotal++; const cls = classifyAction(react.to);
                    if (cls) { reactsOk++; classes[cls] = (classes[cls] || 0) + 1; }
                }
            }
            if (['rules', 'rules_other'].includes(row.extra) && include(row, row)) {
                rulesTotal++;
                if (['stated', 'stated-free', 'not-mentioned'].includes(row.costStated)) rulesField++;
                if (['stated', 'stated-free'].includes(row.costStated)) rulesKnown++;
            }
        }
        for (const sc of scenes) if (leadPovs.has(sc.pov) && (scope === 'all' || inSlice(sc, slice))) {
            sceneTotal++;
            const p = place(sc.place, fields(sc)[0], scope === 'slice');
            const outcome = list(sc.outcomes).some(o => nonempty(o.fact) && o.value != null && (typeof o.value !== 'string' || o.value.trim()));
            if (p && outcome) { sceneOk++; if (p.registry) sceneRegistry++; }
        }
        return {relations: metric(relationOk, relationTotal), routines: {...metric(routineOk, routineTotal), oldPlaceAndTime: metric(routineOld, routineTotal), timingBasis: 'band-or-order-or-role-hours', registryPlaceAndTime: routineRegistry, proposedPlaceAndTime: routineOk - routineRegistry},
            reacts: {...metric(reactsOk, reactsTotal), classes}, scenes: {...metric(sceneOk, sceneTotal), registryPlaceAndOutcome: sceneRegistry, proposedPlaceAndOutcome: sceneOk - sceneRegistry},
            rules: {...metric(rulesKnown, rulesTotal), costStatedField: rulesField}};
    }
    const sliceFitness = fitness('slice');
    const missingCoverage = [];
    for (const sc of selected) {
        for (const t of list(sc.touched)) if (KINDS.has(t.kind) && ['present', 'partial'].includes(t.status) && !mapping[t.id]) missingCoverage.push({id: t.id, beat: sc.beat});
        for (const id of list(sc.present)) if (KINDS.has(byId.get(id)?.kind || /\.(person|place|organization|item)\./.exec(id)?.[1]) && !mapping[id]) missingCoverage.push({id, beat: sc.beat});
    }
    // Proposed place addresses are useful crosswalk output, but are not confirmed joins.
    for (const [name, confirmed, proposedKey] of [['routines', 'registryPlaceAndTime', 'proposedPlaceAndTime'], ['scenes', 'registryPlaceAndOutcome', 'proposedPlaceAndOutcome']]) {
        sliceFitness[name].mappedIncludingProposals = sliceFitness[name].usable;
        sliceFitness[name].usable = sliceFitness[name][confirmed];
        sliceFitness[name].rate = metric(sliceFitness[name].usable, sliceFitness[name].total).rate;
    }
    // Whole-index counts count only registry-resolved places. Proposed mapping covers the slice only.
    const allFitness = fitness('all');
    allFitness.routines.usable = allFitness.routines.registryPlaceAndTime;
    allFitness.routines.rate = metric(allFitness.routines.usable, allFitness.routines.total).rate;
    allFitness.routines.unresolvedPlaceAndTime = allFitness.routines.proposedPlaceAndTime;
    delete allFitness.routines.proposedPlaceAndTime;
    allFitness.scenes.usable = allFitness.scenes.registryPlaceAndOutcome;
    allFitness.scenes.rate = metric(allFitness.scenes.usable, allFitness.scenes.total).rate;
    allFitness.scenes.unresolvedPlaceAndOutcome = allFitness.scenes.proposedPlaceAndOutcome;
    delete allFitness.scenes.proposedPlaceAndOutcome;
    const counts = {entities: Object.keys(mapping).length, runtime: 0, proposed: 0, skipped: 0, byKind: {}};
    for (const [id, target] of Object.entries(mapping)) {
        counts[target.startsWith('new:') ? 'proposed' : target.startsWith('skip:') ? 'skipped' : 'runtime']++;
        counts.byKind[entities[id].kind] = (counts.byKind[entities[id].kind] || 0) + 1;
    }
    return {crosswalk: {schema: 'cast-crosswalk/1.0', world, slice, leadPovIds: [...leadPovs].sort(), mapping, entities, places, ambiguousPlaces: [...ambiguousPlaces].sort(), counts},
        report: {schema: 'consumer-fitness/1.0', world, slice, leadScenes: selected.length, missingCoverage, counts, sliceFitness, allFitness}};
}

export function hasTime(slot) {
    const validTime = v => (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && !!v.trim() && !/^(unknown|unstated|unspecified|none|null|u|\?)$/i.test(v.trim()));
    const explicit = [slot.time, slot.timeOfDay, slot.at, slot.start];
    if (explicit.some(v => validTime(v) || (v && typeof v === 'object' && ['value', 'from', 'to', 'start', 'end', 'hour', 'minute', 'band'].some(k => validTime(v[k]))))) return true;
    if (slot.window && ['from', 'to', 'start', 'end'].some(k => validTime(slot.window[k]))) return true;
    // A weekday/repeat interval alone is not an hour or time band.
    return /\b(mornings?|afternoons?|evenings?|nights?|dawn|dusk|noon|midnight|breakfast|lunchtime|dinner|\d{1,2}:\d{2}|\d{1,2}\s*(?:am|pm))\b/i.test(String(slot.days || ''));
}

// Metric helpers preserve source phrases; they do not invent clock hours or joins.
export function routineBand(slot) {
    const values = [slot.band, slot.timeOfDay?.value, slot.timeOfDay, slot.time, slot.days];
    for (const value of values) if (typeof value === 'string') {
        const match = /\b(morning|afternoon|evening|night|dawn|dusk|noon|midnight|daytime)s?\b/i.exec(value);
        if (match) return match[1].toLowerCase();
    }
    return null;
}
export function relativeTiming(slot) {
    for (const text of [slot.time, slot.timeOfDay, slot.days, slot.what].filter(v => typeof v === 'string')) {
        const match = /\b(after|before)\s+([^,;.]+)/i.exec(text);
        if (match) return {relation: match[1].toLowerCase(), target: match[2].trim()};
        if (/\b(?:the )?next morning\b/i.test(text)) return {relation: 'after', target: 'previous-day', offsetDays: 1, band: 'morning'};
    }
    return null;
}
export function hasRelativeTime(slot) { return !!relativeTiming(slot) || !!slot.orderEdge; }
export function matchesRoleHours(slot, person, row) {
    const hours = row.hours;
    if (typeof hours !== 'string' || !hours.trim() || /^(unknown|unstated|unspecified|not[- ](?:stated|mentioned|specified)|none|null|u|\?)$/i.test(hours.trim())) return false;
    return !!(slot.place && row.place === slot.place || person?.role && row.role === person.role);
}

function readRows(dir, name) { return readFileSync(resolve(dir, name), 'utf8').split('\n').filter(l => l.trim()).map(JSON.parse); }
export function run(argv) {
    const dir = argv[0], flag = name => { const i = argv.indexOf(name); return i < 0 ? null : argv[i + 1]; };
    if (!dir) throw new Error('Expected merged directory');
    // Private inputs and outputs only. realpath prevents symlink escapes from a private directory.
    const actual = realpathSync(dir), root = realpathSync(resolve(fileURLToPath(new URL('../../docs/research/novels/', import.meta.url))));
    const rel = relative(root, actual);
    if (rel.startsWith('..') || !rel.split(/[\\/]/).includes('private')) throw new Error('Output must be under a novel private directory');
    const reviewPath = flag('--review') ? resolve(flag('--review')) : null;
    const registry = readRows(actual, 'registry.jsonl'), scenes = readRows(actual, 'scenes.jsonl'), extras = readRows(actual, 'extras.jsonl');
    const world = flag('--world'), review = reviewPath ? JSON.parse(readFileSync(reviewPath, 'utf8')) : {};
    const personas = discoverLeadPersonas(extras, {leadId: world === 'lotm' ? 'lotm.person.klein-moretti' : null, review});
    const result = buildCrosswalk({registry, scenes, extras, world, slice: {from: flag('--from'), to: flag('--to')}, review, leadPovIds: personas.leadPovIds});
    result.crosswalk.personaReview = personas.unresolved;
    result.report.inputs = Object.fromEntries(['registry.jsonl', 'scenes.jsonl', 'extras.jsonl', ...(reviewPath ? [reviewPath] : [])].map(p => [p, hash(readFileSync(resolve(actual, p)))]));
    result.report.runtimeInputs = Object.fromEntries(['src/book_world_lotm_ids.js', 'src/book_world_mol_ids.js', 'src/world_packs/book_mol_pack.js', 'scripts/lead_run/build_crosswalk.mjs'].map(p => [p, hash(readFileSync(new URL(`../../${p}`, import.meta.url)))]));
    result.crosswalk.inputs = {...result.report.inputs, ...result.report.runtimeInputs};
    for (const [name, value] of [['crosswalk.json', result.crosswalk], ['consumer_fitness.json', result.report]]) writeFileSync(resolve(actual, name), JSON.stringify(value, null, 2) + '\n');
    writeFileSync(resolve(actual, 'persona_review.json'), JSON.stringify({schema: 'lead-persona-review/1.0', candidates: personas.unresolved}, null, 2) + '\n');
    if (argv.includes('--report')) console.log(JSON.stringify(result.report, null, 2));
    return result;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) run(process.argv.slice(2));
