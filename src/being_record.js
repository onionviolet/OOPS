// One being record, three grains (CPR1, CPR10; proposal under AD32). A creature is counted in a herd, held as a living item
// that must be fed, or tied as a bonded being with a mind. It moves between grains and keeps its id.
// Pure and read-only: no clock, no randomness, no save slice. The record is READ from facts other owners already keep
// (completed acts, claims, condition, larder), so there is one authority per fact (AR3). Only identity is authored here:
// id, species, family row (egg, young, adult from one row, CPR24), origin, mind and the steps that say what each fact means.
// Life stages are creature_layers layers over a body (CPR21). Custody is an ordered list kept across grain changes (CPR7,
// ITM4): it is ordered, not dated, because the facts it reads carry counts, not a clock.
// Dials (authored, with reason): `grains` per world says which grains exist (CPR1); tie levels and temper are authored
// calibration from the scene, not canon tables; Hogwarts Legacy and Rune Factory numbers are calibration hints only.
import {defineLayer, applyLayer, removeLayer} from './creature_layers.js';
import {bondStage} from './companion_stage.js';

export const GRAINS = Object.freeze(['counted', 'held', 'tied']);
export const BEING_SCHEMA = 1;
const fail = m => { throw new Error(m); };
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);

// A family row names its stages once; each stage is a removable layer over the body (set the stage word, tag it, say whether it eats).
export function defineFamily(f) {
    idLike(f?.id) && f.label && Array.isArray(f.stages) && f.stages.length || fail('A family needs an id, a label and stages.');
    const seen = new Set();
    const stages = f.stages.map(s => {
        idLike(s.id) && s.label || fail(`${f.id}: every stage needs an id and a label.`);
        seen.has(s.id) && fail(`${f.id}: duplicate stage ${s.id}.`); seen.add(s.id);
        const layer = defineLayer({id: `${f.id}.stage.${s.id}`, label: s.label, source: f.source ?? 'authored',
            changes: [{path: 'stage', op: 'set', value: s.id}, {path: 'tags', op: 'tag', value: `stage:${s.id}`},
                {path: 'eats', op: 'set', value: s.eats !== false}, ...(s.changes ?? [])]});
        return Object.freeze({id: s.id, label: s.label, layer});
    });
    return Object.freeze({id: f.id, label: f.label, source: f.source ?? 'authored', stages: Object.freeze(stages)});
}

// Move a body to a stage: the previous stage layer comes off, the new one goes on, everything else stays (CPR21).
export function bodyAtStage(family, stageId, extraLayers = []) {
    const stage = family.stages.find(s => s.id === stageId) ?? fail(`${family.id} has no stage ${stageId}.`);
    let body = {tags: [], stage: null, eats: true};
    body = applyLayer(body, stage.layer);
    for (const l of extraLayers) body = applyLayer(body, l);
    return body;
}
export function advanceStage(body, family, from, to) {
    const next = family.stages.find(s => s.id === to) ?? fail(`${family.id} has no stage ${to}.`);
    const prior = family.stages.find(s => s.id === from) ?? fail(`${family.id} has no stage ${from}.`);
    const out = removeLayer(body, prior.layer.id);
    if (!out.ok) return out;
    return {ok: true, creature: applyLayer(out.creature, next.layer)};
}

// def: {id, name, species, family, origin, mind: {traits[], temper?}, grains?: [...], layers?: (facts) => layer[],
//   steps: [{id, when: facts => bool, holder, grain, stage, why}], ties: (facts, stage) => [{who, level}]}
// Steps are read in order; every satisfied step is a custody entry and the last satisfied one is the present state.
export function readBeing(def, facts) {
    idLike(def?.id) && def.family && Array.isArray(def.steps) && def.steps.length || fail('A being needs an id, a family and steps.');
    const allowed = def.grains ?? GRAINS;
    const done = def.steps.filter(s => s.when(facts));
    if (!done.length) return null;
    for (const s of done) {
        GRAINS.includes(s.grain) || fail(`${def.id}: unknown grain ${s.grain}.`);
        allowed.includes(s.grain) || fail(`${def.id}: this world has no ${s.grain} grain.`);
    }
    const now = done.at(-1);
    const family = def.family;
    const layers = def.layers?.(facts) ?? [];
    const body = bodyAtStage(family, now.stage, layers);
    return {
        schema: BEING_SCHEMA, id: def.id, name: def.name, species: def.species, family: family.id,
        grain: now.grain, stage: now.stage, stageLabel: family.stages.find(s => s.id === now.stage).label, holder: now.holder,
        origin: def.origin, mind: structuredClone(def.mind ?? {traits: []}), body: {stage: body.stage, tags: [...body.tags], eats: body.eats, ...extraBody(body)},
        layers: body.layers ?? [],
        custody: done.map(s => ({step: s.id, holder: s.holder, grain: s.grain, stage: s.stage, why: s.why})),
        ties: now.grain === 'tied' ? (def.ties?.(facts, now.stage) ?? []).map(t => ({who: t.who, level: t.level})) : []
    };
}
const extraBody = body => { const b = {}; for (const [k, v] of Object.entries(body)) if (!['tags', 'stage', 'eats', 'base', 'layers', 'layerDefs', 'layerLog'].includes(k)) b[k] = structuredClone(v); return b; };

// Shape check for a record: used by tests and by a caller that keeps a record apart from the facts it came from.
export function validateBeing(b) {
    b?.schema === BEING_SCHEMA && idLike(b.id) && GRAINS.includes(b.grain) && typeof b.stage === 'string' && Array.isArray(b.custody) && b.custody.length || fail('Invalid being record.');
    b.custody.every(c => GRAINS.includes(c.grain)) || fail(`${b.id}: custody has an unknown grain.`);
    b.custody.at(-1).grain === b.grain && b.custody.at(-1).stage === b.stage || fail(`${b.id}: custody disagrees with the present grain.`);
    b.grain === 'tied' || b.ties.length === 0 || fail(`${b.id}: only a tied being has ties.`);
    return b;
}

// Care reader (CPR2, CPR9). `obs` comes from the owner of the hunger fact; this only names it.
//  {kind: 'upkeep', alive, kept, condition, max, willEat, worked, lethal, nextMealIn}  living_upkeep readings through the keeper house view
//  {kind: 'provisioned', by, stocked}                                               another person feeds it (Hagrid, a handler)
// Returns {state, fed, ability, line}. `fed` is true, false or null (not observable from the player's seat).
export function readCare(being, obs) {
    if (being.body.eats === false) return {state: 'no meals', fed: null, ability: null, line: `${being.stageLabel}: it needs warmth and time, not meals.`};
    if (obs?.kind === 'provisioned') {
        const line = obs.stocked ? `${obs.by} packed its food: it is provisioned.` : `${obs.by} feeds it; that is not yours to do.`;
        return {state: obs.stocked ? 'provisioned' : 'kept by another', fed: null, ability: null, line};
    }
    if (obs?.kind === 'upkeep') {
        if (!obs.alive) return {state: 'dead', fed: false, ability: null, line: 'Dead.'};
        if (!obs.kept) return {state: 'not in your care', fed: null, ability: null, line: 'Not in your care yet.'};
        const starved = obs.condition <= 1, short = !obs.willEat;
        const ability = obs.condition >= 3 ? (obs.worked ? 'worked this window' : 'sound') : obs.condition === 2 ? (obs.worked ? 'worked this window' : 'works through hunger at risk') : 'starved out';
        const state = starved ? 'starved out' : short ? 'hungry' : 'fed';
        const line = starved ? 'Starved out: feed it to recover.' : short ? 'Hungry: it will miss its next meal.' : `Fed: ${obs.condition} of ${obs.max}.`;
        return {state, fed: state === 'fed', ability, line};
    }
    return {state: 'unknown', fed: null, ability: null, line: 'Its care is not shown here.'};
}

// Tie reader (CPR3, TIE19, SPR18-SPR19). A held being has no tie to read. A tied one answers each person it knows with what it
// DOES (settles, follows, comes, warns, snaps, refuses); the word is the shared bond ladder. Warmth is the creature's own
// pace: a low level is not a flaw, it is a being that has not decided. Hunger makes it refuse handling (care reads the tie).
export function readTie(being, care = null) {
    if (being.grain !== 'tied') return {grain: being.grain, rows: [], line: being.grain === 'held' ? 'Held, not tied: nothing here has a mind of its own to answer you.' : 'Counted with the herd: no single tie.'};
    const temper = being.mind?.temper ?? 'mild', hungry = care && (care.state === 'hungry' || care.state === 'starved out');
    const rows = being.ties.map(t => {
        const stage = bondStage(t.level), behaviours = [];
        if (hungry) behaviours.push('refuses to be handled until it has eaten');
        if (t.level >= 6) behaviours.push(`settles with ${t.who}`, `follows ${t.who}`);
        else if (t.level >= 3) behaviours.push(`comes when ${t.who} calls`);
        else if (temper === 'bites' && t.level <= 0) behaviours.push(`snaps at ${t.who}`);
        else behaviours.push(`warns ${t.who} off`);
        return {who: t.who, level: t.level, word: stage.word, behaviours};
    });
    return {grain: 'tied', rows, line: rows.map(r => `${r.who} (${r.word}): ${r.behaviours.join(', ')}`).join('. ')};
}

// The card both worlds draw: grain, stage, holder, custody, care and tie lines, one text each (UR37: text is the whole form).
export function beingCard(being, obs) {
    const care = readCare(being, obs), tie = readTie(being, care);
    return {id: being.id, name: being.name, species: being.species, grain: being.grain, stage: being.stageLabel, holder: being.holder,
        origin: being.origin, custody: being.custody.map(c => c.why), care, tie};
}
