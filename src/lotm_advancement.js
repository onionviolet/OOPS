// LOTM ladder above the first rung (GM25), on the world-neutral seams: crossings are ascension_paths rows (ASC), abilities are typed
// ability records (ability_records.js, GM26). The rung data is source-derived and private (private_packs/lotm-advancement/advancement.json,
// ids and locators cite the whole-book merge); this module only turns such a pack into a path and its ability records, so a missing
// pack leaves the ladder exactly as the Sequence 8 slice ends it. Spoilers: no later-rung names or effects live in tracked files.
// Backlash and loss of control are another owner's: a rung's `failure` text and each ability's `failure.hook` are passed through untouched.
import {definePath} from './ascension_paths.js';
import {defineAbilityRecords, abilityView} from './ability_records.js';

const PREFIX = 'book.lotm.adv';
const WORLD = 'book.lotm.tingen';

// path: a definePath descriptor whose last stage may be a stub. pack: the private pack (or null). Replaces the named stage's crossings,
// grants and failure from the pack and returns the new path, the ability records for every rung, and the effects a promotion applies.
export function advanceLadder(path, pack, {stageId = 'seq7', rungKey = stageId} = {}) {
    const rung = pack?.rungs?.[rungKey];
    if(!rung) return {path, abilities: null, promotionEffects: {}, conditions: []};
    const desc = structuredClone(path);
    let stage = desc.stages.find(s => s.id === stageId);
    if(!stage) {stage = {id: stageId, label: rung.label, crossings: [], grants: []}; desc.stages.push(stage);}
    stage.crossings = rung.crossings.map(({id, type, label, fact, need, irreversible}) => ({id, type, label, fact, need, ...(irreversible ? {irreversible} : {})}));
    stage.grants = [...rung.grants];
    if(rung.failure) stage.failure = {...rung.failure};
    const rows = rung.abilities.map(a => ({...a, sourceId: a.sourceId.replace(/^book\.lotm\./, PREFIX + '.')}));
    const set = defineAbilityRecords(rows, {prefix: PREFIX, world: {id: WORLD}});
    const conditions = [...new Set(rows.flatMap(a => a.effects).filter(e => e.type === 'condition').map(e => e.id))]
        .map(id => ({id, revision: 1, label: id.split('.').pop().replace(/_/g, ' '), stacking: 'max', bioVisible: false}));
    // Promotion grants the held source (the abilities' `held` requirement) and, for a cooldown limit, its learned power.
    const sources = [...new Set(rows.map(r => r.sourceId))];
    const promotionEffects = {[stageId]: [...sources.map(sourceId => ({type: 'source', sourceId, operation: 'grant', awakened: true, active: true})), ...Object.values(set.grants).flat()]};
    return {path: definePath(desc), abilities: set, promotionEffects, conditions};
}

// Read model for the abilities, combat and character-sheet panels: one entry per ability record, by rung, observer-safe.
// state: {facts, held (source ids), readyIn: {key: minutes}, charges: {key: n}}. Abilities of a rung not yet reached are not listed.
export function abilityViews(adv, {facts = {}, held = [], readyIn = {}, charges = {}} = {}) {
    if(!adv.abilities) return [];
    return Object.values(adv.abilities.cards).filter(c => held.includes(c.sourceId))
        .map(c => abilityView(c, {facts, readyIn: readyIn[c.key] ?? 0, charges: charges[c.key] ?? null}));
}

// Every rung in the pack, in order, on one path: stages are appended when the base path lacks them. Returns the path and, per rung,
// the ability records, the promotion effects and the conditions to register. advanceLadder (one rung) stays as it was.
export function advanceLadders(path, pack) {
    let current = path;
    const rungs = {};
    for(const key of Object.keys(pack?.rungs ?? {})) {
        const r = advanceLadder(current, pack, {stageId: key});
        current = r.path;
        rungs[key] = {abilities: r.abilities, promotionEffects: r.promotionEffects[key], conditions: r.conditions};
    }
    return {path: current, rungs};
}
