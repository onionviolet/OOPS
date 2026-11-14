#!/usr/bin/env node
// Coverage ledgers (plan CV1-CV4, PFP25; tooling by chat P for MS1).
//   node scripts/coverage_report.mjs           rewrite docs/coverage/README.md
//   node scripts/coverage_report.mjs --check   validate rows only; exit 1 on malformed rows
// A ledger is docs/coverage/<corpus>.jsonl, one JSON object per line:
//   {"id": "...", "source": "...", "state": "...", "mechanisms": ["G", ...], "test": "tests/x.test.js" | null, "note": "..."}
// Coverage percent is a report, never a gate (CV4): only malformed rows and the three case
// checks below fail (PC10): a typed state that disagrees with the computed one, a case module that
// is missing or lacks `coverageCase`, and a case that throws.
//
// Cases (PC5, PC9, PC10, PC51 P1.1). A row may carry `"case": {"module": "<repo-relative js>", "id": "<case id>"}`.
// The module exports `coverageCase(id)`, returning plain data:
//   {basis?: 'canon'|'authored',            // else taken from the typed state, else 'authored'
//    world: {clock?, holders: [...], lawFields?},
//    engine?: {packs?, settings?, shared?, dials?,   // plain createEngineWorld config
//              host?: {things?, costs?, keys?}},     // plain host data for workings: bound things, the price list, world keys
//    sentence: {verb, object, target?, time?, carrier?, cost?, limits?},   // run through landEffect
//    working?: {family, id?, payer?, ...},  // one kernel working started in the engine host (E9); families below
//    details?: {target, amount, minutes, place, ...},  keys?: {light: 'moon', ...},  by?: string,
//    timeline?: [{id, sentence, details?, keys?, by?, cause?, expect?}
//                | {id, ops, cause?, expect?} | {id, advanceTo, expect?} | {id, restore: true}
//                | {id, working, expect?}                       // start a kernel working; steps due now settle now
//                | {id, store: <stored spec>, by?, expect?}     // lay a stored working under the step's id
//                | {id, fire: <stored id>, stimulus?, expect?}],  // replaces the top-level sentence or working
// A failed pour can be expected with {id, advanceTo, interruption: {working, reason}, expect?}.
// A subsequent {id, resumeBrewPour: {from, flask?}, expect?} continues its remaining steps.
// {id, resumeBrewStir: {from}, expect?} retries an interrupted operator stir and its remaining steps.
// {id, sealVowClause: <ritual inputs>, refusal?, expect?} tests a Hogwarts binding action.
// {id, awakenLanternHusk: <parent, huskHolder, offspring>, refusal?, expect?} tests the Lantern offspring action.
// A working names its law family in plain data: {family: 'spell', spells: [...]} (spell_law.js spellEffectMethod)
// or {family: 'process', method: <processMethod input>, bindings} (process_law.js).
// `gu-coupled` takes a versioned beat row and its bindings.
// `brew`, `brew-dose` and `brew-assay` take a compiled method and bindings.
// `brew-from-assays` takes a request for the live observer's saved assays and stock.
// `brew-dose-from-identification` binds a stocked remedy using a saved composition reading.
// The host settles the resulting working on the
// world clock, debits its costs and lands its effects; a later advanceTo settles the steps that take time.
//    expect: [{holder, quantity | property | belief | position: true | exists: true | creationParents: true, direction, amount?, to?}
//             | {lawField, direction, to?}]}
// `expect` is in world terms only. Quantities support up|down|changed|unchanged and an exact
// change `amount`. Other terms support changed|unchanged. `to` matches the final value.
// A law field reads as {scope, kind, params, until?} or null if absent. A new holder must be
// named by an exists observation with changed and to: true before other observations can name it.
// Unknown keys are rejected, and at least one entry must expect an actual change.
// A named step's optional expect compares immediately before and after that step.
// A step may also check saved working output with expectObserved: {working, step, to}.
// `step` is the zero-based method step and `to` matches named observed fields.
// The required case expect still compares the initial and final world.
// Computed states: expressed-<basis> when the world changed as `expect` says; runs-<basis> when the
// case module is also reachable from src/main.js (scripts/reachable.mjs). A case under tests/ is never reachable.
// Other states: blocked:runner-expect-mismatch, blocked:runner-needs (missing world key),
// blocked:runner-unmapped, blocked:runner-waiting, blocked:runner-working-case (the working names no
// family the runner knows) or blocked:runner-working-interrupted (a step failed; the detail has its reason).
import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {reachableFrom, walkFrom, srcFiles} from './reachable.mjs';
import {recordsOf} from '../src/knowledge_record.js';
import {readLineage} from '../src/world_substrate.js';
import {MECHANISMS, SPLIT_RULE, splitLabelled, fitMechanisms, scoreHeldOut} from '../src/brew_heldout.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const COVERAGE_DIR = 'docs/coverage';
// CV3 denominators, for the expected column. A ledger not listed still reports.
export const DENOMINATORS = {
    gu_kinds: {expected: 1466, owner: 'G', what: 'Gu kinds, held review index records'},
    gu_moves: {expected: 776, owner: 'G', what: 'killer moves: 23 records plus 753 leads'},
    hp_potions: {expected: 316, owner: 'B', what: 'potion-related catalogue entries'},
    hp_ingredients: {expected: 409, owner: 'B', what: 'ingredient-related catalogue entries'},
    lotm_potions: {expected: null, owner: 'B', what: 'pathway sequence and named potions, built first'},
    hp_spells: {expected: 117, owner: 'S', what: 'spellbook records'},
    creatures: {expected: null, owner: 'L', what: "G's catalogue plus L's inventory"},
};
const STATE = /^(runs-canon|runs-authored|expressed-canon|expressed-authored|catalogued|unclassified|blocked:[a-z0-9][\w.:-]*|not-a-thing:[a-z0-9][\w.:-]*)$/i;
const FIELDS = new Set(['id', 'source', 'state', 'mechanisms', 'test', 'note', 'case']);

// Validate one ledger's text. Returns {rows, problems}; a problem names its line.
export function parseLedger(text, {name = 'ledger', exists = file => fs.existsSync(path.join(root, file))} = {}) {
    const rows = [], problems = [], ids = new Set();
    text.split('\n').forEach((line, i) => {
        if (!line.trim()) return;
        const at = `${name}:${i + 1}`;
        let row;
        try { row = JSON.parse(line); } catch { problems.push(`${at}: not JSON`); return; }
        if (!row || typeof row !== 'object' || Array.isArray(row)) { problems.push(`${at}: not an object`); return; }
        for (const k of Object.keys(row)) if (!FIELDS.has(k)) problems.push(`${at}: unknown field ${k}`);
        if (typeof row.id !== 'string' || !row.id) problems.push(`${at}: id must be a nonempty string`);
        else if (ids.has(row.id)) problems.push(`${at}: duplicate id ${row.id}`);
        else ids.add(row.id);
        if (typeof row.source !== 'string' || !row.source) problems.push(`${at}: source must be a nonempty locator`);
        if (typeof row.state !== 'string' || !STATE.test(row.state)) problems.push(`${at}: state must be runs-canon, runs-authored, expressed-canon, expressed-authored, catalogued, blocked:<rule>, not-a-thing:<reason> or unclassified`);
        if (!Array.isArray(row.mechanisms) || row.mechanisms.some(m => typeof m !== 'string' || !m)) problems.push(`${at}: mechanisms must be an array of owner names`);
        if (row.test !== undefined && row.test !== null && typeof row.test !== 'string') problems.push(`${at}: test must be a string or null`);
        if (/^runs-/.test(row.state ?? '')) {
            const file = typeof row.test === 'string' ? row.test.split('#')[0] : '';
            if (!file) problems.push(`${at}: a runs-* row names the test that runs it`);
            else if (!exists(file)) problems.push(`${at}: test file ${file} does not exist`);
        }
        if (row.case !== undefined) {
            const k = row.case;
            if (!k || typeof k !== 'object' || Array.isArray(k) || typeof k.module !== 'string' || !k.module || typeof k.id !== 'string' || !k.id
                || Object.keys(k).some(x => x !== 'module' && x !== 'id')) problems.push(`${at}: case must be {"module": "<repo path>", "id": "<case id>"}`);
        }
        if (/^expressed-/.test(row.state ?? '') && row.case === undefined) problems.push(`${at}: an expressed-* row names its case; the runner computes expressed`);
        if (row.note !== undefined && typeof row.note !== 'string') problems.push(`${at}: note must be a string`);
        rows.push(row);
    });
    return {rows, problems};
}

// Counts per ledger: states, the runs share (runs over things, excluding not-a-thing) and top blocking rules.
export function countLedger(rows) {
    const c = {total: rows.length, 'runs-canon': 0, 'runs-authored': 0, blocked: 0, 'not-a-thing': 0, unclassified: 0, catalogued: 0, 'expressed-canon': 0, 'expressed-authored': 0, rules: {}};
    for (const r of rows) {
        const [head, detail] = [r.state.split(':')[0], r.state.split(':').slice(1).join(':')];
        if (head in c) c[head]++;
        if (head === 'blocked') c.rules[detail] = (c.rules[detail] ?? 0) + 1;
    }
    const things = c.total - c['not-a-thing'];
    c.runsShare = things ? Math.round((c['runs-canon'] + c['runs-authored']) / things * 1000) / 10 : 0;
    c.classifiedShare = c.total ? Math.round((c.total - c.unclassified) / c.total * 1000) / 10 : 0;
    return c;
}

// ---- The generic case runner (PC9, PC10) ----
const FLAGS = ['position', 'exists', 'creationParents'];
const TERMS = ['quantity', 'property', 'lawField', 'belief', ...FLAGS];
const EXPECT_KEYS = new Set(['holder', ...TERMS, 'direction', 'amount', 'to']);
const CHANGE = ['changed', 'unchanged'];
const QUANTITY_CHANGE = ['up', 'down', ...CHANGE];
const named = value => typeof value === 'string' && value.length > 0;
const createsHolder = e => e?.exists === true && e.direction === 'changed' && e.to === true;

function checkExpect(world, expect, id, requireChange = true) {
    const bad = m => { throw new Error(`case ${id}: ${m}`); };
    if (!Array.isArray(expect) || !expect.length) bad('expect must be a nonempty array of world outcomes');
    const created = new Set(expect.filter(createsHolder).map(e => e.holder));
    for (const e of expect) {
        if (!e || typeof e !== 'object') bad('an expect entry must be an object');
        for (const k of Object.keys(e)) if (!EXPECT_KEYS.has(k)) bad(`expect key ${k} is not a world term`);
        const kinds = TERMS.filter(k => e[k] !== undefined);
        if (kinds.length !== 1) bad('an expect entry names exactly one world term');
        const [kind] = kinds;
        if (!(FLAGS.includes(kind) ? e[kind] === true : named(e[kind]))) bad(`invalid ${kind} observation`);
        if (kind === 'creationParents' && e.to !== undefined && e.to !== null &&
            (!Array.isArray(e.to) || !e.to.every(named))) bad('creation parents must be an array of holder IDs or null');
        const directions = kind === 'quantity' ? QUANTITY_CHANGE : CHANGE;
        if (!directions.includes(e.direction)) bad(`direction for ${kind} is one of ${directions.join(', ')}`);
        if (e.amount !== undefined && (kind !== 'quantity' || !Number.isFinite(e.amount) || e.amount < 0))
            bad('amount must be a nonnegative number on a quantity observation');
        if (kind === 'lawField') {
            if (e.holder !== undefined) bad('a law field is named by its id');
        } else if (!named(e.holder) || !(Object.hasOwn(world.holders, e.holder) || created.has(e.holder))) {
            bad(`expect names holder ${e.holder}, which the case world does not define or expect to create`);
        }
        if (createsHolder(e) && Object.hasOwn(world.holders, e.holder)) bad(`expected new holder ${e.holder} already exists`);
    }
    if (requireChange && !expect.some(e => e.direction !== 'unchanged')) bad('expect must name at least one change');
}

const readTerm = (world, e) => {
    if (e.lawField !== undefined) {
        const field = world.laws.find(f => f.id === e.lawField);
        if (!field) return null;
        const {scope, kind, params, until} = field;
        return {scope, kind, params, ...(until === undefined ? {} : {until})};
    }
    if (e.exists) return Object.hasOwn(world.holders, e.holder);
    if (e.creationParents) return readLineage(world, e.holder)
        .find(row => row.act === 'create' && row.parents !== undefined)?.parents ?? null;
    const h = world.holders[e.holder];
    if (e.quantity !== undefined) return h?.quantities?.[e.quantity] ?? 0;
    if (e.property !== undefined) return h?.properties?.[e.property] ?? null;
    if (e.belief !== undefined) {
        const records = recordsOf(world, e.holder);
        return Object.hasOwn(records, e.belief) ? records[e.belief].believed.value ?? null : null;
    }
    return h?.place ?? null;
};

// Does the world, before to after, change as `expect` says?
export function expectHolds(before, after, expect) {
    return expect.every(e => {
        const a = readTerm(before, e), b = readTerm(after, e);
        const same = isDeepStrictEqual(a, b);
        if (same !== (e.direction === 'unchanged')) return false;
        if (e.direction === 'up' && !(b > a)) return false;
        if (e.direction === 'down' && !(b < a)) return false;
        if (e.amount !== undefined && Math.abs(b - a) !== e.amount) return false;
        if (e.to !== undefined && !isDeepStrictEqual(b, e.to)) return false;
        return true;
    });
}

// Law families a working case may name. Each turns plain case data into {law, method, bindings}.
const WORKING_FAMILIES = {
    'lantern-fleece': async w => {
        const {LANTERN_EVOLUTION, LANTERN_FLEECE_LAW, LANTERN_FLASH, LANTERN_MOONBEAM, LANTERN_WISP_GLOW} =
            await import('../src/world_packs/meadow_lantern_fleece.js');
        const ability = {'flash': LANTERN_FLASH, 'moonbeam': LANTERN_MOONBEAM, 'wisp-glow': LANTERN_WISP_GLOW};
        const evolution = Object.hasOwn(LANTERN_EVOLUTION.methods, w.method) && LANTERN_EVOLUTION.methods[w.method];
        const method = evolution || (Object.hasOwn(ability, w.method) && ability[w.method]);
        if (!method) return {blocked: 'unknown Lantern Fleece working'};
        return {law: evolution ? LANTERN_EVOLUTION.law : LANTERN_FLEECE_LAW, method, bindings: w.bindings};
    },
    'gu-coupled': async w => {
        const {compileGuCoupledBeat} = await import('../src/gu_coupled_working.js');
        return {...compileGuCoupledBeat(w.beat), bindings: w.bindings};
    },
    'gu-moonblade-contact': async w => {
        const {GU_MOONBLADE_CONTACT_LAW, moonbladeContactWorking} = await import('../src/world_packs/gu_moonblade_contact.js');
        return {law: GU_MOONBLADE_CONTACT_LAW, method: moonbladeContactWorking({supported: w.supported === true}), bindings: w.bindings};
    },
    'gu-formation-plate': async w => {
        const {GU_FORMATION_PLATE_LAW, guFormationPlateMethod} = await import('../src/world_packs/gu_formation_plate.js');
        return {law: GU_FORMATION_PLATE_LAW, method: guFormationPlateMethod(w.options), bindings: w.bindings};
    },
    'gu-teleport-array': async w => {
        const {GU_FORMATION_PLATE_LAW, guTeleportArrayMethod} = await import('../src/world_packs/gu_formation_plate.js');
        return {law: GU_FORMATION_PLATE_LAW, method: guTeleportArrayMethod(w.options), bindings: w.bindings};
    },
    'gu-three-heads': async w => {
        const {GU_THREE_HEADS_LAW, threeHeadsWorking} = await import('../src/world_packs/gu_three_heads_working.js');
        return {law: GU_THREE_HEADS_LAW, method: threeHeadsWorking(w.operation), bindings: w.bindings};
    },
    'gu-fixed-travel': async w => {
        const {GU_FIXED_TRAVEL_LAW, fixedTravelWorking} = await import('../src/world_packs/gu_fixed_travel_working.js');
        return {law: GU_FIXED_TRAVEL_LAW, method: fixedTravelWorking(w.options), bindings: w.bindings};
    },
    'gu-revised-giant-hand': async w => {
        const {GU_GIANT_HAND_LAW, revisedGiantHandWorking, prepareGiantHandWorking, releaseGiantHandWorking} =
            await import('../src/world_packs/gu_giant_hand_working.js');
        const methods = {revised: revisedGiantHandWorking, prepare: prepareGiantHandWorking, release: releaseGiantHandWorking};
        const name = w.method ?? 'revised';
        if (!Object.hasOwn(methods, name)) return {blocked: 'unknown Giant Hand working'};
        return {law: GU_GIANT_HAND_LAW, method: methods[name], bindings: w.bindings};
    },
    spell: async w => (await import('../src/spell_law.js')).spellEffectMethod(w.spells, w.method ? {id: w.method} : {}),
    occlumency: async w => (await import('../src/world_packs/hp_occlumency.js')).occlumencyMethod(w),
    process: async w => {
        const {PROCESS_LAW, processMethod} = await import('../src/process_law.js');
        return {law: PROCESS_LAW, method: processMethod(w.method), bindings: w.bindings};
    },
    brew: async w => ({law: (await import('../src/brew_law.js')).BREW_LAW, method: w.method, bindings: w.bindings}),
    'brew-from-identification': async (w, engine) => {
        const {selectIdentifiedBrewRecipe} = await import('../src/brew_dose_delivery.js');
        const recipe = selectIdentifiedBrewRecipe(engine, w.request);
        if (!recipe) return {blocked: 'no known recipe matches the observer’s full sample reading'};
        return {law: (await import('../src/brew_law.js')).BREW_LAW, method: recipe.method, bindings: recipe.bindings};
    },
    'brew-dose': async w => ({law: (await import('../src/brew_dose_delivery.js')).BREW_DOSE_LAW, method: w.method, bindings: w.bindings}),
    knowledge: async w => ({law: (await import('../src/knowledge_record.js')).KNOWLEDGE_LAW, method: w.method, bindings: w.bindings}),
    evolution: async w => {
        const {defineCreatureEvolution} = await import('../src/creature_evolution.js');
        const {law, methods} = defineCreatureEvolution(w.definition);
        return {law, method: methods[w.method], bindings: w.bindings};
    },
    'age-line': async w => (await import('../src/world_packs/hp_age_line.js')).ageLineWorking(w.bindings),
    'body-haul': async w => (await import('../src/body_haul.js')).bodyHaulWorking(w.bindings, w.minutes),
    gillyweed: async w => (await import('../src/world_packs/hp_gillyweed.js')).gillyweedWorking(w.bindings),
    bubotuber: async w => (await import('../src/world_packs/hp_bubotuber.js')).bubotuberWorking(w.bindings),
    'brew-dose-from-identification': async (w, engine) => {
        const {BREW_DOSE_LAW, bindIdentifiedBrewRemedy} = await import('../src/brew_dose_delivery.js');
        const remedy = bindIdentifiedBrewRemedy(engine, w.request, w.method);
        if (!remedy) return {blocked: 'no stocked remedy and serving match the observer’s identification'};
        return {law: BREW_DOSE_LAW,
            method: remedy.method, bindings: {...w.bindings, flask: {kind: 'flask', id: remedy.flask}}};
    },
    'brew-assay': async w => ({law: (await import('../src/brew_assay.js')).BREW_ASSAY_LAW, method: w.method, bindings: w.bindings}),
    'brew-from-assays': async (w, engine) => {
        const {generateObservedBrewWorking} = await import('../src/brew_generation.js');
        const plan = generateObservedBrewWorking(engine, w.request);
        if (!plan) return {blocked: 'current assays and stock cannot supply the requested brew'};
        return {law: (await import('../src/brew_law.js')).BREW_LAW, ...plan};
    },
};

/** Run one case's plain data. Returns {state, detail}; hard failures throw. */
export async function runCaseData(data, {id = 'case', typedState = '', moduleReachable = false} = {}) {
    if (!data || typeof data !== 'object') throw new Error(`case ${id}: coverageCase must return an object`);
    const suffix = data.basis ?? (/-(canon|authored)$/.exec(typedState)?.[1]) ?? 'authored';
    const timeline = data.timeline;
    if (timeline === undefined) {
        if (data.working === undefined && (!data.sentence || typeof data.sentence !== 'object')) throw new Error(`case ${id}: a case carries a sentence or a working or a timeline`);
        if (data.working !== undefined && data.sentence !== undefined) throw new Error(`case ${id}: a case carries a sentence or a working, not both`);
    } else if (!Array.isArray(timeline) || !timeline.length || data.sentence !== undefined || data.working !== undefined) {
        throw new Error(`case ${id}: a timeline is a nonempty array and replaces the sentence or working`);
    }
    const {createEngineWorld, applyEngineOps, advanceEngineWorld, startEngineWorking, storeEngineWorking, fireEngineStored,
        serializeEngineWorld, restoreEngineWorld} = await import('../src/engine_world.js');
    const {WORLD_QUANTITIES, WORLD_PROPERTIES} = await import('../src/world_quantities.js');
    const {landEffect} = await import('../src/effect_host.js');
    const config = data.engine ?? {};
    if (typeof config !== 'object' || Array.isArray(config) || !isDeepStrictEqual(config, JSON.parse(JSON.stringify(config))))
        throw new Error(`case ${id}: engine must be a plain JSON configuration object`);
    const {packs = ['w.sky'], settings, shared, dials, host = {}} = config;
    // The reader maps a domain's own words (spell words) onto the shared vocabulary; it is asked for no other sentence.
    const {sharedEffect} = await import('../src/spell_effects.js');
    // The sky pack needs no caller settings and runs no clock laws in these
    // instant probes. Keep the legacy vocabulary unless a case declares its own.
    const ownPacks = packs.includes('l.creature_form')
        ? [(await import('../src/creature_evolution.js')).CREATURE_FORM_PACK] : [];
    if (packs.includes('l.lantern_coat') || packs.includes('l.lantern_moon_cycle')) {
        const {LANTERN_COAT_PACK, LANTERN_MOON_CYCLE_PACK} = await import('../src/world_packs/meadow_lantern_fleece.js');
        if (packs.includes('l.lantern_coat')) ownPacks.push(LANTERN_COAT_PACK);
        if (packs.includes('l.lantern_moon_cycle')) ownPacks.push(LANTERN_MOON_CYCLE_PACK);
    }
    if (packs.includes('b.splash'))
        ownPacks.push((await import('../src/world_substrate_packs/brew_splash.js')).createBrewSplashPack(settings?.['b.splash']));
    if (packs.includes('b.body_steam'))
        ownPacks.push((await import('../src/world_substrate_packs/brew_vapor.js')).BREW_BODY_STEAM);
    if (packs.includes('b.cloud'))
        ownPacks.push((await import('../src/world_substrate_packs/brew_vapor.js')).createBrewCloudPack(settings?.['b.cloud']));
    if (packs.includes('hp.descent')) ownPacks.push((await import('../src/world_packs/hp_effect_pack.js')).HP_DESCENT);
    if (packs.includes('hp.camp-warning')) ownPacks.push((await import('../src/world_packs/hp_effect_pack.js')).HP_CAMP_WARNING);
    if (packs.includes('l.breathing')) {
        const {BREATHING_PACK, GILLED_BREATHING_PACK} = await import('../src/world_substrate_packs/breathing.js');
        ownPacks.push(settings?.['l.breathing']?.gills ? GILLED_BREATHING_PACK : BREATHING_PACK);
    }
    if (packs.includes('s.focus')) ownPacks.push((await import('../src/world_substrate_packs/spell_sustain.js')).SPELL_SUSTAIN_PACK);
    if (packs.includes('hp.fiendfyre')) ownPacks.push((await import('../src/world_substrate_packs/fiendfyre.js')).FIENDFYRE_PACK);
    if (packs.includes('hp.accidental-lift')) ownPacks.push((await import('../src/world_packs/hp_accidental_magic.js')).HP_ACCIDENTAL_LIFT);
    if (packs.includes('hp.protean_coins'))
        ownPacks.push((await import('../src/world_packs/hp_effect_pack.js')).HP_PROTEAN_COINS);
    if (packs.includes('hp.taboo'))
        ownPacks.push((await import('../src/world_packs/hp_effect_pack.js')).HP_TABOO);
    if (packs.includes('hp.trace'))
        ownPacks.push((await import('../src/world_packs/hp_effect_pack.js')).HP_TRACE);
    if (packs.includes('g.travel-carry'))
        ownPacks.push((await import('../src/world_packs/gu_fixed_travel_working.js')).guTravelCarryPack);
    if (packs.includes('gu.self-cleansing'))
        ownPacks.push((await import('../src/world_packs/gu_formation_plate.js')).guCleansingArrayPack);
    if (packs.includes('g.three-heads'))
        ownPacks.push((await import('../src/world_packs/gu_three_heads_working.js')).guThreeHeadsPack);
    const engineConfig = {packs, ownPacks, settings, dials, shared: {
        quantities: Object.values(WORLD_QUANTITIES), properties: Object.values(WORLD_PROPERTIES), ...shared,
    }, host: {things: host.things ?? {}, costs: host.costs ?? null, effects: {keys: host.keys ?? {}, read: sharedEffect}}};
    let engine = createEngineWorld({...data.world, ...engineConfig});
    // What the host could not land or settle since the last look, as the runner's blocked states.
    const seen = {};
    const acknowledged = new Set();
    const hostProblem = (step) => {
        const expected = step.interruption;
        let matched = false;
        for (const [wid, entry] of Object.entries(engine.records.workings)) {
            const fresh = entry.landed.slice(seen[wid] ?? 0);
            seen[wid] = entry.landed.length;
            const failed = entry.record.status === 'interrupted' && entry.record.receipts.at(-1);
            if (failed && !acknowledged.has(wid)) {
                if (expected?.working !== wid || expected.reason !== failed.reason)
                    return {state: 'blocked:runner-working-interrupted', detail: `${wid} step ${failed.step}: ${failed.reason}`};
                acknowledged.add(wid);
                matched = true;
            }
            for (const [status, state] of [['needs-key', 'needs'], ['waiting', 'waiting'], ['unmapped', 'unmapped'], ['label-only', 'unmapped']]) {
                const row = fresh.find(l => l.status === status);
                if (row) return {state: `blocked:runner-${state}`, detail: `${wid} step ${row.step}: ${row.reason}`};
            }
        }
        if (expected && !matched) return {state: 'blocked:runner-expect-mismatch',
            detail: `${step.id}: the expected working interruption did not occur`};
        return null;
    };
    const before = engine.world;
    checkExpect(before, data.expect, id);
    const names = new Set();
    for (const step of timeline ?? [data]) {
        let action = data.working !== undefined ? 'working' : 'sentence';
        if (timeline) {
            if (!named(step?.id) || names.has(step.id)) throw new Error(`case ${id}: timeline steps need distinct names`);
            names.add(step.id);
            const actions = ['sentence', 'ops', 'advanceTo', 'working', 'store', 'fire', 'restore', 'resumeBrewPour', 'resumeBrewStir',
                'sealVowClause', 'awakenLanternHusk']
                .filter(key => Object.hasOwn(step, key));
            if (actions.length !== 1) throw new Error(`case ${id} step ${step.id}: expected one action`);
            [action] = actions;
        }
        const stepBefore = engine.world;
        const at = timeline ? ` step ${step.id}` : '';
        const cause = step.cause ?? `coverage:${id}${at}`;
        if (action === 'advanceTo') {
            const advanced = advanceEngineWorld(engine, step.advanceTo);
            if (advanced.pending !== false) return {state: 'blocked:runner-clock-advance',
                detail: `${step.id}: advance to ${step.advanceTo} is pending at ${advanced.engine.world.clock}`};
            engine = advanced.engine;
        } else if (action === 'restore') {
            if (step.restore !== true) throw new Error(`case ${id}${at}: restore must be true`);
            const saved = serializeEngineWorld(engine);
            engine = restoreEngineWorld(JSON.parse(JSON.stringify(saved)), {
                ...engineConfig, host: {...engineConfig.host, laws: engine.host.laws},
            });
            if (!isDeepStrictEqual(serializeEngineWorld(engine), saved))
                return {state: 'blocked:runner-restore', detail: `${step.id}: restored engine save differs`};
        } else if (action === 'ops') {
            engine = applyEngineOps(engine, step.ops, cause);
        } else if (action === 'working') {
            const bound = await WORKING_FAMILIES[step.working?.family]?.(step.working, engine);
            if (!bound) return {state: 'blocked:runner-working-case', detail: `no law family named ${step.working?.family ?? '(none)'} is known to the runner`};
            if (bound.blocked) return {state: 'blocked:runner-working-inputs', detail: `${step.id}: ${bound.blocked}`};
            engine = startEngineWorking(engine, {...bound, id: step.working.id ?? `case.${timeline ? step.id : 'working'}`, payer: step.working.payer ?? null});
        } else if (action === 'resumeBrewPour') {
            const {resumeBrewPour} = await import('../src/engine_brew_resume.js');
            engine = resumeBrewPour(engine, {...step.resumeBrewPour, id: `case.${step.id}`});
        } else if (action === 'resumeBrewStir') {
            const {resumeBrewStir} = await import('../src/engine_brew_resume.js');
            engine = resumeBrewStir(engine, {...step.resumeBrewStir, id: `case.${step.id}`});
        } else if (action === 'sealVowClause') {
            const {sealVowClause} = await import('../src/world_packs/hp_unbreakable_vow.js');
            const result = sealVowClause(engine, step.sealVowClause);
            if (result.ok !== (step.refusal === undefined) || result.reason !== step.refusal)
                return {state: 'blocked:runner-expect-mismatch', detail: `${step.id}: unexpected Vow response`};
            engine = result.engine;
        } else if (action === 'awakenLanternHusk') {
            const {awakenLanternHusk} = await import('../src/world_packs/meadow_lantern_fleece.js');
            const result = awakenLanternHusk(engine, step.awakenLanternHusk);
            if (result.ok !== (step.refusal === undefined) || result.reason !== step.refusal)
                return {state: 'blocked:runner-expect-mismatch', detail: `${step.id}: unexpected husk awakening response`};
            engine = result.engine;
        } else if (action === 'store') {
            engine = storeEngineWorking(engine, step.store, {id: step.id, by: step.by ?? cause});
        } else if (action === 'fire') {
            engine = fireEngineStored(engine, step.fire, {stimulus: step.stimulus});
        } else {
            const run = landEffect(engine.rules, stepBefore, {sentence: step.sentence, details: step.details},
                {keys: step.keys ?? {}, cause, by: step.by});
            if (run.needs.length) return {state: 'blocked:runner-needs', detail: `needs ${run.needs.join(', ')}`};
            if (run.waiting.length) return {state: 'blocked:runner-waiting',
                detail: `waiting for an owner: ${run.waiting.map(effect => effect.kind).join(', ')}`};
            if (run.status === 'unmapped') return {state: 'blocked:runner-unmapped', detail: run.reason};
            engine = {...engine, world: run.world};
        }
        const problem = hostProblem(step);
        if (problem) return problem;
        if (timeline && step.expectObserved !== undefined) {
            const {working, step: index, to} = step.expectObserved ?? {};
            if (!named(working) || !Number.isSafeInteger(index) || index < 0 || !to ||
                typeof to !== 'object' || Array.isArray(to) || !Object.keys(to).length)
                throw new Error(`case ${id}${at}: expectObserved needs a working, step index and observed fields`);
            const entry = Object.hasOwn(engine.records.workings, working) ? engine.records.workings[working] : undefined;
            const receipt = entry?.record.receipts.find(row => row.step === index && row.ok);
            if (!receipt?.observed || Object.entries(to).some(([key, value]) =>
                !Object.hasOwn(receipt.observed, key) || !isDeepStrictEqual(receipt.observed[key], value)))
                return {state: 'blocked:runner-expect-mismatch', detail: `${step.id}: working observation did not match`};
        }
        if (timeline && step.expect !== undefined) {
            checkExpect(stepBefore, step.expect, id + at, false);
            if (!expectHolds(stepBefore, engine.world, step.expect)) return {state: 'blocked:runner-expect-mismatch',
                detail: `${step.id}: the world did not change as step expect says`};
        }
    }
    if (!expectHolds(before, engine.world, data.expect)) return {state: 'blocked:runner-expect-mismatch', detail: 'the world did not change as expect says'};
    return {state: `${moduleReachable ? 'runs' : 'expressed'}-${suffix}`, detail: moduleReachable ? 'case module reachable from src/main.js' : 'case module is library or test only'};
}

/** Load a row's case module and run it. Throws on a missing module, a missing export or a throwing case. */
export async function runCase(row, {reachable = null, rootDir = root} = {}) {
    const {module: mod, id} = row.case;
    const file = path.resolve(rootDir, mod);
    if (!fs.existsSync(file)) throw new Error(`case module ${mod} does not exist`);
    let m;
    try { m = await import(pathToFileURL(file).href); } catch (e) { throw new Error(`case module ${mod} failed to load: ${e.message}`); }
    if (typeof m.coverageCase !== 'function') throw new Error(`case module ${mod} does not export coverageCase`);
    let out;
    try {
        out = await runCaseData(m.coverageCase(id), {id, typedState: row.state, moduleReachable: (reachable ?? reachableFrom()).has(file)});
    } catch (e) { throw new Error(`case ${mod}#${id} threw: ${e.message}`); }
    return out;
}

/** Compute every case row of every ledger. Returns {computed: Map ledger -> Map row id -> {state, detail}, problems}. */
export async function computeLedgers(ledgers, {reachable = null, rootDir = root} = {}) {
    const computed = new Map(), problems = [];
    let reach = reachable;
    for (const l of ledgers) {
        const rows = new Map();
        computed.set(l.name, rows);
        for (const [i, row] of l.rows.entries()) {
            if (!row.case || typeof row.case !== 'object' || typeof row.case.module !== 'string') continue;
            reach ??= reachableFrom();
            const at = `${l.file ?? l.name}:${row.id ?? i + 1}`;
            try {
                const out = await runCase(row, {reachable: reach, rootDir});
                rows.set(row.id, out);
                if (out.state !== row.state) problems.push(`${at}: typed state ${row.state} disagrees with computed ${out.state} (${out.detail})`);
            } catch (e) { problems.push(`${at}: ${e.message}`); }
        }
    }
    return {computed, problems};
}

// Per ledger: typed runs, computed expressed (expressed or runs), computed runs, typed runs-* rows with no case.
export function computedCounts(rows, computed = new Map()) {
    let typedRuns = 0, expressed = 0, runs = 0, noCase = 0;
    for (const r of rows) {
        if (/^runs-/.test(r.state)) { typedRuns++; if (!r.case) noCase++; }
        const c = computed.get(r.id);
        if (c && /^(expressed|runs)-/.test(c.state)) expressed++;
        if (c && /^runs-/.test(c.state)) runs++;
    }
    return {typedRuns, expressed, runs, noCase};
}

export function readLedgers(dir = path.join(root, COVERAGE_DIR)) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort().map(f => {
        const name = f.replace(/\.jsonl$/, '');
        return {name, file: `${COVERAGE_DIR}/${f}`, ...parseLedger(fs.readFileSync(path.join(dir, f), 'utf8'), {name: f})};
    });
}

// ---- Held-out scoring (RUN.md wave order; PC72) ----
// Per ledger: tuned on, held out, matched, plus sorted misses. A scored row never sits in its own
// fit set. Outcome and route are separate, and each is scored two ways: the diagnostic (a mechanism
// family's predicted sentence against the evidence-labelled one) and engine execution (the fitted
// mechanism run through the brew dose law and the generic case runner, compared with the label in
// world terms). Only hp_potions has a split so far; the other ledgers report "none yet".
const slugOf = t => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
// Families these three titles had before the wave-2 pattern fixes, to replay the "before" score.
const PRE_FIX_FAMILY = {mandrake_restorative_draught: 'plant-or-creature-target', skele_gro: 'body-door', dr_ubblys_oblivious_unction: 'mind-state'};
export async function heldOutScores(ledgers) {
    const out = new Map();
    const {HP_POTION_SENTENCES, predictionHolds} = await import('../src/world_packs/brew_effects_pack.js');
    const {potionFamily, HP_POTION_FAMILY_OVERRIDES} = await import('./b_coverage_ledgers.mjs');
    const {RULE_INFORMED} = await import('../src/brew_heldout.js');
    const {executeRows} = await import('../src/brew_heldout_cases.js');
    const ruleSawTitles = Object.keys(HP_POTION_FAMILY_OVERRIDES);
    const labelled = HP_POTION_SENTENCES.map(s => ({id: `hp.potion.${slugOf(s.title)}`, subject: s.subject, title: s.title, family: potionFamily(s.title), parts: s.parts, evidence: s.evidence}));
    const run = data => runCaseData(data, {id: 'held-out'});
    const scenario = async rows => {
        const split = splitLabelled(rows, {ruleSawTitles});
        const table = fitMechanisms(split.tuned);
        const diag = scoreHeldOut(split.heldOut, table, {beforeObject: predictionHolds});
        const engineHeld = await executeRows(split.heldOut, table, run);
        const engineTuned = await executeRows(split.tuned, table, run);
        return {split, table, diag, engineHeld, engineTuned};
    };
    const before = await scenario(labelled.map(r => PRE_FIX_FAMILY[r.subject] ? {...r, family: PRE_FIX_FAMILY[r.subject]} : r));
    const after = await scenario(labelled);
    const ledger = ledgers.find(l => l.name === 'hp_potions');
    const unlabelled = new Map();
    if (ledger) {
        const labelledIds = new Set(labelled.map(r => r.id));
        for (const r of ledger.rows) {
            const m = /^blocked:(.+)$/.exec(r.state);
            if (m && !labelledIds.has(r.id)) unlabelled.set(m[1], (unlabelled.get(m[1]) ?? 0) + 1);
        }
    }
    out.set('hp_potions', {before, after, unlabelled, ruleInformed: RULE_INFORMED});
    return out;
}

const countEngine = (results, key, skip = new Set()) => {
    const rows = results.filter(r => !skip.has(r.id));
    return {n: rows.length, match: rows.filter(r => r[key] === 'match').length, cannot: rows.filter(r => r[key].startsWith('cannot')).length};
};
const short = id => id.replace('hp.potion.', '');
const reasonOf = v => v.replace(/^cannot: /, '').replace(/\|/g, '/');

function renderHeldOut(held, ledgers) {
    const lines = ['', '## Held-out canon scoring (PC72, tuned on / held out / matched)', '',
        '*Two scores per row, outcome and route kept apart. **Diagnostic**: a mechanism family predicts the effect sentence and delivery carrier, compared with the evidence-labelled sentence (`HP_POTION_SENTENCES`, each citing an evidence row; no label is derived from a title). Outcome = verb, object and target agree; route = carrier agrees. **Engine**: the fitted mechanism is built into a brew dose case (`src/brew_heldout_cases.js`) and run through the generic case runner; the label, read in world terms, is the `expect`. Engine outcome = the world term the label names changed (mind rows are checked on the mood faculty, a fixed dial) (vitality quantity up or down, form property, mind property) after an oral dose; engine route = the mechanism\'s route leaves the dose where the label\'s route needs it. Self versus touched is not an engine distinction (the target is a bound holder), so engine outcome does not test it. The tuning sample never counts as held out. The split rule lives in `src/brew_heldout.js`; this section is generated.*', '',
        '| Ledger | Tuned on | Held out | Diagnostic outcome | Diagnostic route | Engine outcome | Engine route | Split |', '| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |'];
    for (const l of ledgers) {
        const h = held.get(l.name);
        if (!h) { lines.push(`| ${l.name} | 0 | 0 | | | | | none yet |`); continue; }
        const a = h.after, eo = countEngine(a.engineHeld, 'outcome'), er = countEngine(a.engineHeld, 'route');
        lines.push(`| ${l.name} | ${a.split.tuned.length} | ${a.diag.n} | ${a.diag.outcome} of ${a.diag.n} | ${a.diag.route} of ${a.diag.n} | ${eo.match} of ${eo.n} | ${er.match} of ${er.n} | ${SPLIT_RULE} |`);
    }
    for (const [name, h] of held) {
        const a = h.after, b = h.before, skip = new Set(h.ruleInformed);
        const row = (label, sc) => {
            const eo = countEngine(sc.engineHeld, 'outcome'), er = countEngine(sc.engineHeld, 'route');
            return `| ${label} | ${sc.diag.n} | ${sc.diag.outcome} | ${sc.diag.route} | ${eo.match} (${eo.cannot} cannot run) | ${er.match} (${er.cannot} cannot run) |`;
        };
        const kept = a.diag.rows.filter(r => !skip.has(r.id));
        const untouched = {diag: {n: kept.length, outcome: kept.filter(r => r.outcome).length, route: kept.filter(r => r.route).length},
            engineHeld: a.engineHeld.filter(r => !skip.has(r.id))};
        lines.push('', `### ${name}`, '',
            '| Held-out matches | Held out | Diagnostic outcome | Diagnostic route | Engine outcome | Engine route |', '| --- | ---: | ---: | ---: | ---: | ---: |',
            row('Before the three title-pattern fixes', {diag: b.diag, engineHeld: b.engineHeld}),
            row('After the fixes (all held-out rows)', {diag: a.diag, engineHeld: a.engineHeld}),
            row('After, without the three rule-informed rows', untouched), '',
            `- **Read this carefully**: the three rows \`${[...skip].map(short).join('`, `')}\` were scored, found to be misses caused by a wrong title pattern, and then informed a rule (\`scripts/b_coverage_ledgers.mjs\`: the mandrake-restorative entry left the plant pattern, \`skele-gro\` moved to body-form, and dressing nouns such as unction and salve now precede the mind words). They stay in the held-out count but are not untouched; the next wave's held-out number must not be read as if they were. The last line above leaves them out.`,
            `- **Body-surface route (proposal, wave 3)**: the brew dose law gained \`apply\`, a preparation put on a named surface of a body for a contact time. The surface must exist on that body (a \`surface:<name>\` world mark); a fraction min(1000, uptake permille a minute x minutes) of the applied units reaches the body's dose account and the rest stays as surface residue in the account \`coat\` and splash already use. Defaults with their reasons: skin 40 a minute (a slow barrier), hair 100 (a large wet surface takes a treatment in about ten minutes), wound 250 (no barrier). A method's \`uptakePermille\` is the dial; the held-out route run uses 5 contact minutes for every row. Before it (wave 2): engine route 12 of 17 with 5 rows unable to run. Five rows now run the labelled route (\`Label route runs\`): four through \`apply\` on a body (swelling_solution, murtlap_essence and dr_ubbly_s_oblivious_unction on skin, sleekeazy_s_hair_potion on hair, surfaces read from evidence HPPE024, HPPE054, HPPE121 and HPPE062) and dragon_dung_fertiliser through \`coat\` on soil, a thing (HPPE124). Whether a potion is applied or drunk stays a design choice: the four body rows still miss on route because the fitted body-door and body-form defaults say potion.`,
            `- **Tuned on** (${a.split.tuned.length}): ${a.split.tuned.map(r => `${short(r.id)} (${r.family}, ${r.evidence})`).join('; ')}. Engine on the tuning rows, reported apart: outcome ${countEngine(a.engineTuned, 'outcome').match} of ${a.engineTuned.length}, route ${countEngine(a.engineTuned, 'route').match} of ${a.engineTuned.length}.`,
            `- **Fitted defaults**: ${Object.entries(a.table).map(([f, t]) => `${f}: ${t.verb} ${t.object} ${t.target} via ${t.carrier}`).join('; ')}. No default for ${MECHANISMS.filter(m => !a.table[m]).join(', ') || 'none'} (no evidence-labelled row).`,
            `- **Rule saw these rows** (title override set against evidence; not held out): ${a.split.ruleSaw.map(r => r.title).join(', ') || 'none'}. Out of the five mechanisms (not counted): ${a.split.outOfScope.map(r => `${r.title} (${r.family})`).join(', ') || 'none'}.`,
            `- **Held out** (${a.diag.n}): ${a.diag.rows.map(r => short(r.id)).join(', ')}.`,
            `- **Unscorable, missing data queued**: rows with no evidence-labelled sentence cannot be scored, since a title is the thing predicted. Per mechanism: ${[...h.unlabelled].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([f, n]) => `${f} ${n}`).join(', ')}. The wiki body of each (revision in its \`source\`) is the queued data; the wiki host refused automated reads on 2026-11-13.`,
            '', '**Per held-out row** (diagnostic predicted / actual; engine result, or why it cannot run):', '',
            '| Row | Family | Predicted | Actual | Diag outcome | Diag route | Engine outcome | Engine route | Label route runs |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
        const engineOf = new Map(a.engineHeld.map(r => [r.id, r]));
        for (const r of [...a.diag.rows].sort((x, y) => Number(x.outcome && x.route) - Number(y.outcome && y.route) || x.id.localeCompare(y.id))) {
            const e = engineOf.get(r.id), show = v => v === 'match' || v === 'mismatch' ? v : `cannot: ${reasonOf(v)}`;
            lines.push(`| ${short(r.id)} | ${r.family} | ${r.predicted} | ${r.actual} | ${r.outcome ? 'match' : 'miss'} | ${r.route ? 'match' : 'miss'} | ${show(e.outcome)} | ${show(e.route)} | ${e.labelRoute === 'match' ? 'runs' : show(e.labelRoute)} |`);
        }
    }
    return lines;
}

export function renderReadme(ledgers, {computed = new Map(), reach = null, held = new Map()} = {}) {
    const lines = ['# Coverage ledgers', '',
        '*Generated by `node scripts/coverage_report.mjs`; do not edit by hand. Format and states: [plan CV1-CV4](../PROCEDURAL_FOUNDATION_PLAN.md#coverage-ledgers-cv). Each corpus owner writes its own `<corpus>.jsonl`. `npm run check:coverage` fails only on malformed rows; the percentages are a report, not a gate.*', '',
        '## Counts', '',
        '| Ledger | Owner | Expected | Rows | runs-canon | runs-authored | blocked | not-a-thing | unclassified | Classified | Runs share |',
        '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
    const names = [...new Set([...Object.keys(DENOMINATORS), ...ledgers.map(l => l.name)])];
    for (const name of names) {
        const l = ledgers.find(x => x.name === name), d = DENOMINATORS[name] ?? {};
        if (!l) { lines.push(`| ${name} | ${d.owner ?? ''} | ${d.expected ?? 'to build'} | not started | | | | | | | |`); continue; }
        const c = countLedger(l.rows);
        lines.push(`| [${name}](${name}.jsonl) | ${d.owner ?? ''} | ${d.expected ?? 'to build'} | ${c.total} | ${c['runs-canon']} | ${c['runs-authored']} | ${c.blocked} | ${c['not-a-thing']} | ${c.unclassified} | ${c.classifiedShare}% | ${c.runsShare}% |`);
    }
    lines.push('', '## Typed and computed, side by side (PC9, PC10)', '',
        '*Typed states are the owners\' hand-typed values and are unchanged. Computed states come from the generic case runner (`case` field) and count only rows that carry a case. "Computed expressed" counts rows whose world changed as `expect` says, including those that run; "computed runs" are the part whose case module is reachable from `src/main.js`. "Typed runs, no case" counts `runs-*` rows that nothing computed. Whether headline numbers may fall is Weibao\'s call, so nothing is rewritten.*', '',
        '| Ledger | Typed runs | Computed expressed | Computed runs | Typed runs, no case |', '| --- | ---: | ---: | ---: | ---: |');
    for (const l of ledgers) {
        const k = computedCounts(l.rows, computed.get(l.name));
        lines.push(`| ${l.name} | ${k.typedRuns} | ${k.expressed} | ${k.runs} | ${k.noCase} |`);
    }
    if (reach) {
        lines.push('', '## Reachability from `src/main.js` (PC14)', '', `\`node scripts/reachable.mjs\`: ${reach.reachable} of ${reach.total} src files reachable. Imports with a computed path cannot be followed, so any pack loaded through one is a gap in this number, not a verdict:`, '');
        lines.push(...(reach.computedImports.length ? reach.computedImports.map(c => `- \`${c.file}\`: \`\` ${c.snippet} \`\``) : ['- none']));
    }
    lines.push(...renderHeldOut(held, ledgers));
    const blocked = ledgers.flatMap(l => Object.entries(countLedger(l.rows).rules).map(([rule, n]) => ({ledger: l.name, rule, n})))
        .sort((a, b) => b.n - a.n || a.rule.localeCompare(b.rule));
    lines.push('', '## Blocking rules', '', blocked.length ? '| Ledger | Missing rule | Rows |' : 'None yet.');
    if (blocked.length) lines.push('| --- | --- | ---: |', ...blocked.map(b => `| ${b.ledger} | ${b.rule} | ${b.n} |`));
    lines.push('', '## Row format', '', '```json',
        '{"id": "stealth-scales", "source": "gu-identity-evidence.json#stealth-scales; ch. 127", "state": "runs-canon", "mechanisms": ["G", "L"], "test": "tests/gu_catalogue.test.js", "note": ""}',
        '```', '',
        '- `state`: `runs-canon`, `runs-authored`, `blocked:<rule>`, `not-a-thing:<reason>` or `unclassified` (CV2). Rules and reasons are short slugs, such as `blocked:PGB2` or `not-a-thing:alias`.',
        '- A `runs-*` row names an existing test file in `test` (optionally `#test name`).',
        '- `catalogued` is a typed state for identity parts with a source and no executed effect. `expressed-*` is computed by the runner; a row carrying `case` is the one place it is typed, because the runner checks it there.',
        '- `case`: optional `{"module": "<repo-relative js>", "id": "<case id>"}`; the module exports `coverageCase(id)` (shape in the header of `scripts/coverage_report.mjs`). `check:coverage` fails when a typed state disagrees with the computed one, a case module is missing or lacks the export, or a case throws.',
        '- `mechanisms`: the owners the thing appears on (SC4), by chat letter or owner name.', '');
    return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const argv = process.argv.slice(2);
    const dirAt = argv.indexOf('--dir');
    const ledgers = dirAt >= 0 ? readLedgers(path.resolve(argv[dirAt + 1])) : readLedgers();
    const walk = walkFrom();
    const {computed, problems: caseProblems} = await computeLedgers(ledgers, {reachable: walk.reachable});
    const problems = [...ledgers.flatMap(l => l.problems), ...caseProblems];
    for (const l of ledgers) {
        const c = countLedger(l.rows), k = computedCounts(l.rows, computed.get(l.name));
        console.log(`${l.name}: ${c.total} rows, ${c.unclassified} unclassified, runs ${c.runsShare}%; computed expressed ${k.expressed}, runs ${k.runs}, typed runs without case ${k.noCase}`);
    }
    if (problems.length) { console.error(problems.join('\n')); console.error(`FAIL: ${problems.length} problems`); process.exit(1); }
    if (!argv.includes('--check')) {
        const files = srcFiles();
        const reach = {reachable: files.filter(f => walk.reachable.has(f)).length, total: files.length,
            computedImports: walk.computedImports.map(c => ({file: path.relative(root, c.file), snippet: c.snippet}))};
        fs.mkdirSync(path.join(root, COVERAGE_DIR), {recursive: true});
        fs.writeFileSync(path.join(root, COVERAGE_DIR, 'README.md'), renderReadme(ledgers, {computed, reach, held: await heldOutScores(ledgers)}));
        console.log(`wrote ${COVERAGE_DIR}/README.md (${ledgers.length} ledgers)`);
    } else console.log(`coverage rows: PASS (${ledgers.length} ledgers)`);
}
