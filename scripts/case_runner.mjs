// The one case runner (PC5, PC9, PC10, PSA26). A ledger row's `case` plus its `expect` run here, for canon, authored,
// derived and generated rows alike; coverage_report.mjs re-exports these names. Shape spec: docs/coverage/CASE_SHAPE.md; the
// case data shape is documented in the header of scripts/coverage_report.mjs.
import fs from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {reachableFrom} from './reachable.mjs';
import {recordsOf} from '../src/knowledge_record.js';
import {readLineage} from '../src/world_substrate.js';
import {confidenceOf} from './derivation_confidence.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
    // Wave 23 (2026-11-24): the divination law (src/divination_law.js); a reading publishes information to the observer.
    'divination': async w => {
        const {DIVINATION_LAW} = await import('../src/divination_law.js');
        return {law: DIVINATION_LAW, method: w.method, bindings: w.bindings};
    },
    // HW3 / B5 (2026-11-24): composed Gu investigation, sweep or probe (src/world_packs/gu_investigation_cases.js).
    'gu-investigation': async w => (await import('../src/world_packs/gu_investigation_cases.js')).investigationWorking(w),
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
    const suffix = data.basis ?? (/-(canon|authored|derived)$/.exec(typedState)?.[1]) ?? 'authored';
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

/**
 * The one entry for a ledger row (PSA26). `row.case` is {module, id} (a pack's `coverageCase(id)`) or {data} (the same plain
 * data inline, for rows a field-fill, derivation or generator pass writes without a module). Returns
 * {state, detail, basis, confidence}: `confidence` is the derivation rule's score (PSA28, derivation_rules.json) for a row
 * that carries `derived.rule`, else null. A row with no `case` throws; use `runRow` to treat that as catalogued.
 * Throws on a missing module, a missing export, an unscored rule or a throwing case.
 */
export async function runCase(row, {reachable = null, rootDir = root} = {}) {
    const spec = row.case;
    if (!spec || typeof spec !== 'object') throw new Error('a row to run carries a case');
    const id = spec.id ?? row.id;
    let data, file = null;
    if (spec.data !== undefined) {
        if (spec.module !== undefined) throw new Error(`case ${id}: carries a module or inline data, not both`);
        data = spec.data;
    } else {
        file = path.resolve(rootDir, spec.module);
        if (!fs.existsSync(file)) throw new Error(`case module ${spec.module} does not exist`);
        let m;
        try { m = await import(pathToFileURL(file).href); } catch (e) { throw new Error(`case module ${spec.module} failed to load: ${e.message}`); }
        if (typeof m.coverageCase !== 'function') throw new Error(`case module ${spec.module} does not export coverageCase`);
        try { data = m.coverageCase(id); } catch (e) { throw new Error(`case ${spec.module}#${id} threw: ${e.message}`); }
    }
    let out;
    try {
        out = await runCaseData(data, {id, typedState: row.state, moduleReachable: file !== null && (reachable ?? reachableFrom()).has(file)});
    } catch (e) { throw new Error(`case ${spec.module ?? 'inline'}#${id} threw: ${e.message}`); }
    const basis = data.basis ?? /-(canon|authored|derived)$/.exec(row.state ?? '')?.[1] ?? 'authored';
    return {...out, basis, confidence: row.derived?.rule ? confidenceOf(row.derived.rule) : null};
}

/** A row with no case is catalogued (no world change was run); a row with one goes through runCase. */
export const runRow = async (row, opts) => row.case ? runCase(row, opts) : {state: 'catalogued', detail: 'no case', basis: null, confidence: row.derived?.rule ? confidenceOf(row.derived.rule) : null};
