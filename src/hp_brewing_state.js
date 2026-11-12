// Polyjuice slice (book.hp pack): pure state and rules. No DOM, no clock, no storage.
// Truth (lot provenance, sample species, grade) is stored apart from knowledge (claims,
// witnessed facts, assay results); view() is the only projection and never reads truth for
// an unassayed, unwitnessed thing (MR1, MR31). Preview consumes nothing: quote() runs the
// real action on a copy (MR4). Draws are keyed by a saved root and a saved serial (GR, MR2).
import {packNative} from './world_pack_registry.js';
import {drawU32} from './gen_kit.js';
import {HP_PROCESS} from './hp_brewing_formula.js';
import {planHpPreparation, validateHpPreparationReceipt, projectHpPreparation} from './hp_preparation.js';
import {HP_ABRASIVE_PROCESS as ABRASIVE, planHpAbrasiveMixture} from './hp_ingredient_substitution.js';
import {createExperimentLog, recordTrial, validateExperimentLog} from './craft_experiment_log.js';
import {afflict, advance} from './affliction_track.js';
import {ANIMAL_FEATURES, HOSPITAL_CARE, BODY_SAVE_MODIFIER} from './hp_animal_features.js';
import {createDemonstratedMethod, validateDemonstratedMethod, planDemonstratedRepeat, MAX_DEMONSTRATED_METHODS} from './craft_reference.js';
import {readSpoilage, wordsFor} from './spoilage.js';
import {bindAntidoteMethod, brewWorkshopAntidote, brewWorkshopDraught} from './hp_potion_reactions.js';
import {applyCompanionPotionAction, isCompanionPotionAction, settleCompanionPotions, validateCompanionPotions, viewCompanionPotions} from './hp_companion_potions.js';
import {planPolyjuiceFinish} from './hp_polyjuice_duration.js';
import {applyPotionWorking, settlePotionWorkings, validatePotionWorkings, viewPotionWorkings} from './potion_workings.js';

const PACK = packNative('book.hp');
export const HP = Object.freeze({rules: PACK.rules, formula: PACK.formula, outcomes: PACK.outcomes, routes: PACK.routes, ingredients: PACK.ingredients, variants: PACK.variants, evidence: PACK.evidence});
const R = PACK.rules, F = PACK.formula;
const ING = Object.fromEntries(PACK.ingredients.map(i => [i.id, i]));
const ROUTE = Object.fromEntries(PACK.routes.map(r => [r.id, r]));
const VARIANT = Object.fromEntries(PACK.variants.map(v => [v.id, v]));
const FLUXWEED = 'book.hp.ing.fluxweed';
const BED = ROUTE['book.hp.route.bed'];
const DRAUGHT_CLASS_FEE = 3;
const DRAUGHT_LAW = 'book.hp.draught.class@1';
const ANTIDOTE_LAW = 'book.hp.antidote.assay@1';
const FRESH_PHIAL = Object.freeze({a: 2, b: 2, blend: 2});
const ANTIDOTE_BINDERS = [0, 1, 2, 3, 4];
const ANTIDOTE_METHODS = {
    warm: {}, heated: {hot: true}, cool: {cool: true}, catalysed: {cool: true, catalyst: true},
};
const antidoteCost = binder => 2 + binder;
function resolveAntidoteTrial(trial, burden = FRESH_PHIAL) {
    if(trial.method === 'composed') {
        need(ANTIDOTE_BINDERS.includes(trial.binder) && typeof trial.catalyst === 'boolean' && Array.isArray(trial.steps), 'Choose a binder amount, catalyst setting and steps.');
        return brewWorkshopAntidote({binder: trial.binder, steps: trial.steps, catalyst: trial.catalyst, burden});
    }
    need(ANTIDOTE_BINDERS.includes(trial.binder) && Object.hasOwn(ANTIDOTE_METHODS, trial.method), 'Choose a binder amount and a mixing method.');
    return brewWorkshopAntidote({binder: trial.binder, ...ANTIDOTE_METHODS[trial.method], burden});
}
function antidoteSetup(trial, result) {
    const inputs = result.spent.map(({material, qty}) => ({key: `class.${material}`, material, qty}));
    const process = trial.method === 'composed' ? bindAntidoteMethod(trial.steps).map(op => [op.id, 1]) : [...(trial.method === 'heated' ? [['heat', 1]] : []),
        [trial.method === 'cool' || trial.method === 'catalysed' ? 'cool mixing' : 'warm mixing', 1]];
    return {revision: 1, law: ANTIDOTE_LAW, inputs, process,
        conditions: {apparatus: 'class cauldron', catalyst: trial.method === 'catalysed' || trial.catalyst === true}};
}
const antidoteRequest = ({binder, method, steps, catalyst}) => ({
    type: 'mixAntidote', binder, method, ...(method === 'composed' ? {steps: clone(steps), catalyst} : {}),
});
const freshnessOf = (lot, now) => lot?.harvestedAt == null ? null
    : readSpoilage({id: lot.ingredient}, now - lot.harvestedAt);
export const HP_SLICE_ID = 'hp_brewing';
export const SCHEMA = 1;
const LEDGER_CAP = 64;
const fail = message => { throw new Error(message); };
const clone = value => structuredClone(value);
const int = n => Number.isSafeInteger(n);
const label = id => ING[id]?.label ?? id;
const draw = (s, key) => drawU32(s.root, `hp:${key}`);
const chance = (s, key, permille) => draw(s, key) % 1000 < permille;
const pick = (s, key, list) => list[draw(s, key) % list.length];

export function begin({seed, now}) {
    if(!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff || !int(now)) fail('A slice starts from a saved seed and the played clock.');
    const s = {schema: SCHEMA, packRevision: 1, root: seed, begunAt: now, now, purse: R.startPurse, serial: 0, seq: 0,
        store: Object.fromEntries(PACK.ingredients.filter(i => i.store === 'student').map(i => [i.id, R.storeStock])),
        lots: {}, samples: {}, donors: {}, debts: [], notices: [], master: {standing: 0},
        cauldron: {condition: R.cauldronStart, brew: null}, batches: {}, effect: null, condition: null, harvestAt: null, ledger: []};
    const used = new Set();
    for(let i = 0; i < R.donors; i++) {
        let name;
        for(let n = 0; ; n++) {
            name = `${pick(s, `donor:${i}:${n}:g`, PACK.donorNames.given)} ${pick(s, `donor:${i}:${n}:f`, PACK.donorNames.family)}`;
            if(!used.has(name)) break;
        }
        used.add(name);
        s.donors[`d${i + 1}`] = {id: `d${i + 1}`, name, standing: 0, askedAt: null};
    }
    return s;
}

const log = (s, now, kind, text) => { s.ledger.push({id: ++s.seq, at: now, kind, text}); if(s.ledger.length > LEDGER_CAP) s.ledger.splice(0, s.ledger.length - LEDGER_CAP); };
const nextLot = (s, prefix) => `${prefix}${++s.serial}`;

// Lazy settlement from the played clock: stews, brews, effects, debts and notices.
export function settle(s, now) {
    if(!int(now)) fail('Settlement needs the played clock.');
    if(now < s.now) return s;
    if(s.cauldron.brew) checkPending(s.cauldron.brew, s);
    for(const lot of Object.values(s.lots)) if(lot.stew && now - lot.stew.startedAt >= F.slots[0].minStewMinutes) {
        const doneAt = lot.stew.startedAt + F.slots[0].minStewMinutes;
        lot.form = 'stewed'; lot.stew = null; lot.truth.stewedMinutes = F.slots[0].minStewMinutes; lot.known.stewed = true;
        log(s, doneAt, 'stew', 'A pot of lacewing flies has stewed the full twenty-one days.');
    }
    const brew = s.cauldron.brew;
    if(brew && now >= brew.readyAt) {
        const id = `b${brew.id}`;
        s.batches[id] = {id, cohortId: id, custody: 'carried', readyAt: brew.readyAt, grade: brew.grade, history: clone(brew.history), doses: brew.history.producedDoses, dosesLeft: brew.history.producedDoses, known: {identified: false, assayed: false}};
        s.cauldron.brew = null;
        log(s, brew.readyAt, 'brew', brew.history.process === ABRASIVE.id ? 'The original suspension has finished settling.' : 'The cauldron has finished simmering.');
    }
    const fx = s.effect;
    if(fx && now >= fx.endsAt) {
        if(fx.discovered) {
            s.donors[fx.donorId].standing -= R.discoverStandingLoss;
            log(s, fx.endsAt, 'aftermath', `Word got back to ${s.donors[fx.donorId].name} that someone wore their face. They trust you less.`);
        } else if(fx.kind === 'transform' || fx.kind === 'thin') log(s, fx.endsAt, 'aftermath', 'The change wore off. Nobody connected it to you.');
        s.effect = null;
    }
    if(s.condition?.track) settleFeatures(s, now);
    else if(s.condition && now >= s.condition.until) { log(s, s.condition.until, 'aftermath', 'The animal features cleared at last.'); s.condition = null; }
    for(const d of s.debts) if(d.status === 'open' && now >= d.dueAt) {
        d.status = 'overdue'; s.master.standing -= R.overdueStandingLoss;
        log(s, d.dueAt, 'debt', `The loan of ${label(d.ingredient)} was not repaid in time. The Potions master remembers.`);
    }
    for(const n of s.notices) if(!n.done && now >= n.at) {
        n.done = true;
        if(n.noticed) { s.master.standing -= R.noticeStandingLoss; log(s, n.at, 'notice', `The Potions master noticed ${label(n.ingredient)} missing from the private stores and has marked you down.`); }
    }
    settleCompanionPotions(s.companionPotions, now);
    settlePotionWorkings(s.potionWorkings, now);
    s.now = now;
    return s;
}

// Weekly recovery checks on the shared affliction seam. Each check's d20 is keyed by the
// track's start and the check time, so reloading or settling in pieces draws the same.
function settleFeatures(s, now) {
    const c = s.condition;
    const {track, events} = advance(ANIMAL_FEATURES, c.track, {at: now, treatment: c.care ? HOSPITAL_CARE : null,
        draw: t => { const natural = draw(s, `features:${t.since}:${t.nextAt}`) % 20 + 1; return {total: natural + BODY_SAVE_MODIFIER, natural}; }});
    for(const e of events) if(e.type === 'save' && e.to < e.from && e.to > 0) log(s, e.at, 'aftermath', ANIMAL_FEATURES.stages[e.to - 1].text);
    const done = events.find(e => e.type === 'recovered');
    if(done) { log(s, done.at, 'aftermath', 'The animal features cleared at last.'); s.condition = null; }
    else c.track = track;
}

const slotGrade = (slot, lot, now) => {
    if(!lot || lot.ingredient !== slot.ingredient || lot.form !== slot.form) return 'bad';
    if(slot.id === 'lacewing') return lot.truth.stewedMinutes >= slot.minStewMinutes ? 'ok' : lot.truth.stewedMinutes >= slot.nearStewMinutes ? 'near' : 'bad';
    if(slot.provenance) {
        if(lot.truth.provenance !== slot.provenance) return 'bad';
        return freshnessOf(lot, now)?.state === 'spoiled' ? 'near' : 'ok';
    }
    if(lot.variant) return VARIANT[lot.variant].gradePermille >= 1000 ? 'ok' : 'near';
    return 'ok';
};
// MR7, MR35: exact formula is the canon product, a near miss is degraded, anything else is original.
export function resolveBrew(lots, condition, now = 0) {
    const rows = F.slots.map(slot => ({slot: slot.id, grade: slotGrade(slot, lots[slot.id], now)}));
    const bad = rows.filter(r => r.grade === 'bad').length, near = rows.filter(r => r.grade === 'near').length;
    const wear = condition >= R.cauldronOkFrom ? 0 : condition >= R.cauldronBadBelow ? 1 : 2;
    const grade = bad === 0 && near + wear === 0 ? 'canon' : bad === 0 && near + wear <= 2 ? 'degraded' : 'original';
    return {grade, rows, wear};
}

const need = (ok, why) => { if(!ok) fail(why); };
const lotOf = (s, id) => s.lots[id] ?? fail('Choose a lot you hold.');
const spend = (s, n) => { need(n <= s.purse, `That costs ${n} ${n === 1 ? 'coin' : 'coins'}. You have ${s.purse}.`); s.purse -= n; };
function checkFluxweedGrowth(growth, now) {
    need(/^L[1-9][0-9]*$/.test(growth.parentLotId) && int(growth.plantedAt) && growth.plantedAt >= 0 &&
        growth.plantedAt <= now && growth.readyAt === growth.plantedAt + BED.growMinutes, 'Malformed fluxweed bed record.');
}
function checkFluxweedLot(lot) {
    if(lot.harvestedAt == null && !lot.growth) return;
    need(lot.ingredient === FLUXWEED && lot.harvestedAt === lot.acquiredAt &&
        (lot.growth ? lot.route === BED.id : lot.route === 'book.hp.route.harvest'), 'Malformed fluxweed harvest.');
    if(lot.growth) {
        checkFluxweedGrowth(lot.growth, lot.harvestedAt);
        need(lot.id !== lot.growth.parentLotId && lot.harvestedAt >= lot.growth.readyAt, 'Fluxweed was picked before maturity.');
    }
}
// Retained paid terms, not a second clock or native lot authority. Legacy completed
// batches stay usable; unknown consumed history is never reconstructed from grade.
function polyjuiceFinish(mode, resolution, inputs) {
    return planPolyjuiceFinish({mode, resolution, inputs, standardMinutes: F.transformMinutes, standardDoses: R.doses,
        brewMinutes: HP_PROCESS.minutes, lacewingSlot: F.slots.find(slot => slot.id === 'lacewing')});
}

function checkHistory(h) {
    need(h && h.revision === 1 && [HP_PROCESS.id, ABRASIVE.id].includes(h.process) && h.clock === 'played-calendar', 'Unsupported retained HP process terms. Keep the saved brew for supported recovery.');
    need(int(h.startedAt) && h.startedAt >= 0 && int(h.minutes) && h.minutes > 0 && int(h.readyAt) && h.readyAt === h.startedAt + h.minutes, 'Malformed retained HP deadline.');
    need(int(h.producedDoses) && h.producedDoses > 0 && int(h.cauldronCondition) && h.cauldronCondition >= 0 && h.cauldronCondition <= R.cauldronStart, 'Malformed retained HP yield or apparatus.');
    need(h.resolution && ['canon', 'degraded', 'original'].includes(h.resolution.grade), 'Missing retained HP resolution.');
    need(Array.isArray(h.inputs) && (h.inputs.length > 0 || h.process === ABRASIVE.id && h.externalMaterials?.length > 0) && h.inputs.length <= F.slots.length, 'Missing paid HP input history.');
    const slots = new Set(), ids = new Set();
    for(const {slot, lot} of h.inputs) {
        need(F.slots.some(x => x.id === slot) && !slots.has(slot) && lot && typeof lot.id === 'string' && !ids.has(lot.id), 'Duplicate or malformed paid HP input.');
        slots.add(slot); ids.add(lot.id);
        need(ING[lot.ingredient]?.forms.includes(lot.form) && int(lot.acquiredAt) && lot.acquiredAt >= 0 && lot.acquiredAt <= h.startedAt && !lot.stew && lot.truth && lot.known, 'Malformed paid HP lot history.');
        if(lot.preparation) validateHpPreparationReceipt(lot.preparation, lot, h.startedAt);
        checkFluxweedLot(lot);
    }
    if(h.process === ABRASIVE.id) {
        const expected = planHpAbrasiveMixture({localInputs: h.inputs, externalMaterials: h.externalMaterials,
            process: h.abrasivePlan?.process?.steps, apparatus: {station: 'cauldron', carrier: 'water-suspension', application: 'manual-scour'}});
        need(h.resolution.grade === 'original' && h.minutes === h.abrasivePlan.process.minutes && h.producedDoses === h.abrasivePlan.process.producedDoses &&
            JSON.stringify(expected) === JSON.stringify(h.abrasivePlan), 'Unsupported or inconsistent retained suspension terms. Keep the paid contents for supported recovery.');
    } else need(!h.externalMaterials && !h.abrasivePlan, 'External solids cannot silently change a pinned potion.');
    if(Object.hasOwn(h, 'finish')) {
        need(h.process === HP_PROCESS.id && h.finish?.revision === 1, 'Unsupported retained Polyjuice finish.');
        const lots = Object.fromEntries(h.inputs.map(({slot, lot}) => [slot, lot]));
        const resolution = resolveBrew(lots, h.cauldronCondition, h.startedAt);
        const expected = polyjuiceFinish(h.finish.mode, resolution, h.inputs);
        need(JSON.stringify(resolution) === JSON.stringify(h.resolution)
            && Object.keys(h.finish).length === 3 && h.finish.doseMinutes === expected.doseMinutes
            && h.producedDoses === expected.doses, 'Inconsistent retained Polyjuice finish.');
    }
    return h;
}
function checkPending(b, s) {
    const h = checkHistory(b.history);
    need(int(b.id) && b.id > 0 && b.startedAt === h.startedAt && b.readyAt === h.readyAt && b.grade === h.resolution.grade, 'Pending HP brew disagrees with retained terms.');
    need(!s.batches[`b${b.id}`] && h.inputs.every(({lot}) => !s.lots[lot.id]), 'Pending HP custody duplicates paid contents.');
}
const batchOf = (s, id) => s.batches[id] ?? fail('Choose a batch you hold.');
// Original bench tuning: after an hour, a top pour carries half its even share.
// The grit left in the vessel is available to later pours or to stirring.
const SUSPENSION_SETTLE_MINUTES = 60;
const suspensionOf = b => b.history?.process === ABRASIVE.id
    ? b.suspension ?? {work: b.history.abrasivePlan.strength * b.dosesLeft, mixedAt: b.readyAt}
    : null;
const settledSuspension = (suspension, now) => now - suspension.mixedAt >= SUSPENSION_SETTLE_MINUTES;
function pourSuspension(batch, doses, now, stir = false) {
    const suspension = suspensionOf(batch);
    if(!suspension) return null;
    const mixedAt = stir ? now : suspension.mixedAt;
    const work = doses === batch.dosesLeft ? suspension.work
        : Math.floor(suspension.work * doses / batch.dosesLeft / (settledSuspension({mixedAt}, now) ? 2 : 1));
    batch.suspension = {work: suspension.work - work, mixedAt};
    return {work, mixedAt};
}
const carried = b => need((b.custody ?? 'carried') === 'carried', 'Retrieve this portion from the bench before using it.');
const retained = b => { need(b.cohortId && b.history, 'This older batch can\'t be poured. Its brewing record is missing.'); checkHistory(b.history); };


const conditionWord = n => n >= R.cauldronOkFrom ? 'clean' : n >= R.cauldronBadBelow ? 'sooty' : 'badly fouled';
const residueWord = n => n === R.cauldronStart ? 'no residue' : n >= R.cauldronOkFrom ? 'traces of residue' : 'visible residue';
const programFor = h => ({type: 'brew', method: h.process === ABRASIVE.id ? ABRASIVE.ref : HP_PROCESS.id,
    ...(h.finish?.mode === 'concentrated' ? {finish: 'concentrated'} : {})});
// A method describes observed inputs; exact custody bindings remain in paid history
// and the current command. Neither receipts nor these notes expose lot truth.
function knownSetup(h) {
    const conditions = {cauldron: conditionWord(h.cauldronCondition), residue: residueWord(h.cauldronCondition), playedMinutes: h.minutes};
    const preparation = {}, sources = [];
    const inputs = h.inputs.map(({slot, lot}) => {
        const service = lot.preparation ? projectHpPreparation(lot.preparation) : null;
        if(service) {delete service.at; delete service.lotId;}
        preparation[slot] = {form: lot.form, variant: lot.variant, service};
        const formulaSlot = F.slots.find(x => x.id === slot);
        if(h.process === HP_PROCESS.id && formulaSlot?.provenance) conditions[`${slot}Picking`] = lot.known.provenance === 'unknown' ? null : lot.known.provenance;
        if(h.process === HP_PROCESS.id && formulaSlot?.minStewMinutes) conditions[`${slot}Stew`] = lot.known.stewed ? (lot.truth.stewedMinutes >= formulaSlot.minStewMinutes ? 'twenty-one days' : 'short of twenty-one days') : null;
        sources.push({slot, lotId: lot.id, acquiredAt: lot.acquiredAt, route: lot.route, custody: lot.custody, claim: lot.claim,
            preparation: lot.preparation ? projectHpPreparation(lot.preparation) : null});
        return {key: `hp-slot:${slot}`, material: lot.ingredient, qty: 1};
    });
    for(const x of h.externalMaterials ?? []) inputs.push({key: x.key, material: x.material.id, qty: x.qty});
    return {revision: 1, law: h.process === ABRASIVE.id ? ABRASIVE.ref : `${HP_PROCESS.id}@1`, inputs,
        process: h.process === ABRASIVE.id ? h.abrasivePlan.process.steps.map(x => [x.op, x.level]) : [['simmer', h.minutes]],
        conditions, preparation, sources};
}
function noteObservation(s, batch, {route, seen, response, baseline, confounders = [], target, viable = false}) {
    if(!batch.history) return; // Historical missing receipts stay unknown.
    const setup = knownSetup(batch.history);
    const trialSetup = target ? {...setup, conditions: {...setup.conditions, targetCondition: target.condition, targetResidue: target.residue}} : setup;
    const observation = {route, response, confounders, ...(route === 'oral' ? {recipient: 'you', baseline} : {})};
    s.experiments = recordTrial(s.experiments ?? createExperimentLog(), {materials: setup.inputs.map(x => x.material), process: setup.process,
        seen, at: s.now, setup: trialSetup, observation});
    if(viable) rememberMethod(s, `hp.method.${batch.cohortId}`, setup, programFor(batch.history));
}
function rememberMethod(s, id, setup, request) {
    if((s.methods ?? []).some(m => m.id === id)) return;
    const method = createDemonstratedMethod({id, setup, request, at: s.now, success: true});
    s.methods = [...(s.methods ?? []), method].slice(-MAX_DEMONSTRATED_METHODS);
}

function newLot(s, now, ingredient, route, extra) {
    const id = nextLot(s, 'L');
    s.lots[id] = {id, ingredient, form: ING[ingredient].forms[0], variant: null, route: route.id, custody: route.custody === 'school' ? 'owned' : route.custody, acquiredAt: now,
        claim: null, truth: {provenance: null, stewedMinutes: 0}, known: {provenance: 'unknown', assayed: false, stewed: false}, stew: null, ...extra};
    return s.lots[id];
}

function pickFluxweed(s, now, route, moon, growth) {
    need(typeof moon === 'string', 'You can\'t tell the moon\'s phase right now.');
    const lot = newLot(s, now, FLUXWEED, route, growth ? {harvestedAt: now, growth} : {});
    lot.truth.provenance = moon === R.moonFull ? 'full_moon' : 'other';
    lot.known.provenance = lot.truth.provenance;
    lot.claim = `Gathered by you under the ${moon.toLowerCase()} moon.`;
    return lot;
}

// One entry point; returns a summary. Mutates s (callers pass a copy to preview).
export function act(s, ctx, req) {
    settle(s, ctx.now);
    const now = ctx.now;
    if(req?.type === 'potionWorking') {
        const summary = applyPotionWorking(s, ctx, req, n => spend(s, n));
        log(s, now, 'making', summary);
        return summary;
    }
    if(isCompanionPotionAction(req?.type)) {
        const summary = applyCompanionPotionAction(s, req, n => spend(s, n));
        log(s, now, 'practice', summary);
        return summary;
    }
    switch(req?.type) {
    case 'mixAntidote': {
        need(!s.cauldron.brew && !s.draughtTrial && !s.antidoteTrial, 'Finish the current cauldron work first.');
        const known = req.repeatMethodId == null ? null : (s.methods ?? []).find(m => m.id === req.repeatMethodId && m.request.type === 'mixAntidote');
        need(req.repeatMethodId == null || known, 'Choose an antidote method you demonstrated.');
        const {type, ...working} = antidoteRequest(known?.request ?? req);
        const trial = {...working, startedAt: now};
        const result = resolveAntidoteTrial(trial);
        if(known) {
            const repeat = planDemonstratedRepeat(known, {setup: antidoteSetup(trial, result), request: antidoteRequest(trial)});
            need(repeat.ok, repeat.reason);
        }
        spend(s, antidoteCost(trial.binder));
        s.antidoteTrial = trial;
        return 'Mixed one test dose. Apply it to a fresh assay phial to see what remains.';
    }
    case 'assayAntidote': {
        const trial = s.antidoteTrial;
        need(trial, 'Mix a test dose first.');
        need(!req.reusePhial || s.antidotePhial, 'There is no treated phial to test again.');
        const baseline = req.reusePhial ? s.antidotePhial : FRESH_PHIAL;
        const result = resolveAntidoteTrial(trial, baseline);
        const response = `Phial after one dose: first burden ${result.remaining.a}, second ${result.remaining.b}, blended ${result.remaining.blend}.`;
        const setup = antidoteSetup(trial, result);
        s.experiments = recordTrial(s.experiments ?? createExperimentLog(), {
            materials: setup.inputs.map(x => x.material), process: setup.process, at: now,
            seen: Object.entries(result.remaining).filter(([burden, amount]) => baseline[burden] > 0 && amount === 0)
                .map(([burden]) => `assay.cleared.${burden}`),
            setup,
            observation: {route: 'phial assay', baseline, response},
        });
        if(Object.values(result.remaining).every(amount => amount === 0)) {
            delete s.antidotePhial;
            const {binder, method, steps, catalyst} = trial;
            const suffix = method === 'composed' ? `.${steps.join('.')}.stone-${catalyst ? 'yes' : 'no'}` : '';
            if(!req.reusePhial) rememberMethod(s, `hp.antidote.${method}.${binder}${suffix}`, setup, antidoteRequest(trial));
        } else s.antidotePhial = result.remaining;
        delete s.antidoteTrial;
        log(s, now, 'antidote', response);
        return response;
    }
    case 'startDraught': {
        need(!s.cauldron.brew && !s.draughtTrial && !s.antidoteTrial, 'Finish the current cauldron work first.');
        need(['crush', 'slice'].includes(req.preparation), 'Choose how to prepare the bean.');
        const trial = {preparation: req.preparation, strokes: '', startedAt: now};
        const result = brewWorkshopDraught(trial);
        spend(s, DRAUGHT_CLASS_FEE);
        s.draughtTrial = trial;
        return `Juice added. ${result.observations.afterAddition}.`;
    }
    case 'stirDraught': {
        const trial = s.draughtTrial;
        need(trial, 'Prepare a Draught flask first.');
        need(req.direction === 'L' || req.direction === 'R', 'Choose a stirring direction.');
        const next = {...trial, strokes: trial.strokes + req.direction};
        const result = brewWorkshopDraught(next);
        s.draughtTrial = next;
        return `${result.observations.afterStirring}.`;
    }
    case 'submitDraught': {
        const trial = s.draughtTrial;
        need(trial, 'Prepare a Draught flask first.');
        const result = brewWorkshopDraught(trial);
        const accepted = result.observations.afterStirring === 'Pale pink';
        const response = accepted ? 'The teacher accepts the pale-pink sample.' : 'The teacher returns the flask. It missed the pale-pink checkpoint.';
        const materials = ['prepared base', 'sopophorous bean'];
        const process = [['admit', 1], ...Array.from(trial.strokes, stroke => [stroke === 'L' ? 'counterclockwise' : 'clockwise', 1])];
        s.experiments = recordTrial(s.experiments ?? createExperimentLog(), {
            materials, process,
            at: now, seen: [result.observations.afterAddition, result.observations.afterStirring],
            setup: {revision: 1, law: DRAUGHT_LAW, inputs: [{key: 'class.base', material: materials[0], qty: 1},
                {key: 'class.bean', material: materials[1], qty: 1}], process, preparation: {bean: trial.preparation},
                conditions: {apparatus: 'class cauldron'}},
            observation: {route: 'examination', response},
        });
        delete s.draughtTrial;
        log(s, now, 'draught', response);
        return response;
    }
    case 'plantFluxweed': {
        need(!s.fluxweedBed, 'Pick the current plant before filling the bed again.');
        const lot = lotOf(s, req.lotId);
        need(lot.ingredient === FLUXWEED && lot.form === 'raw' && !lot.stew, 'Choose a raw fluxweed clipping.');
        need(freshnessOf(lot, now)?.state !== 'spoiled', 'That wilted clipping will not take root.');
        s.fluxweedBed = {parentLotId: lot.id, plantedAt: now, readyAt: now + BED.growMinutes};
        delete s.lots[lot.id];
        return 'Planted one fluxweed clipping. New growth can be picked in one played day.';
    }
    case 'pickFluxweed': {
        const growth = s.fluxweedBed;
        need(growth && now >= growth.readyAt, 'The fluxweed bed is not ready to pick.');
        pickFluxweed(s, now, BED, ctx.moon, growth);
        delete s.fluxweedBed;
        return 'Picked a new fluxweed clipping from your bed.';
    }
    case 'acquire': {
        const route = ROUTE[req.route] ?? fail('Choose a route.'), ing = req.ingredient;
        need(ING[ing] && Object.hasOwn(route.cost, ing), `This route does not offer ${label(ing)}.`);
        let lot;
        if(route.kind === 'store') {
            need(s.store[ing] > 0, `The cupboard has no more ${label(ing)}.`);
            s.store[ing]--;
            lot = newLot(s, now, ing, route);
            if(ing === 'book.hp.ing.fluxweed') lot.truth.provenance = chance(s, `lot:${s.serial}:prov`, R.storeFluxweedOkPermille) ? 'full_moon' : 'other';
            lot.claim = 'Taken from the student store-cupboard.';
        } else if(route.kind === 'supplier') {
            const prepared = req.prepared === true;
            need(!prepared || ing === 'book.hp.ing.lacewing_flies' && route.preparedStewedLacewing, 'This supplier has no ready-prepared lot of that.');
            spend(s, prepared ? route.preparedStewedLacewing : route.cost[ing]);
            lot = newLot(s, now, ing, route);
            if(ing === 'book.hp.ing.fluxweed') { lot.truth.provenance = chance(s, `lot:${s.serial}:prov`, route.fluxweedOkPermille) ? 'full_moon' : 'other'; lot.claim = 'Sold as picked at the full moon.'; }
            if(prepared) { lot.form = 'stewed'; lot.truth.stewedMinutes = chance(s, `lot:${s.serial}:stew`, R.preparedStewOkPermille) ? F.slots[0].minStewMinutes : F.slots[0].nearStewMinutes; lot.claim = 'Sold as stewed twenty-one days.'; }
        } else if(route.kind === 'loan') {
            need(s.master.standing >= -1, 'The Potions master won\'t lend to you while your standing is this low.');
            need(s.debts.filter(d => d.status === 'open').length < 2, 'Settle an open loan before asking again.');
            lot = newLot(s, now, ing, route);
            s.debts.push({id: lot.id, ingredient: ing, dueAt: now + R.loanDueMinutes, repay: R.loanRepay[ing], status: 'open'});
            lot.claim = 'On loan from the private stores.';
        } else if(route.kind === 'unlicensed') {
            lot = newLot(s, now, ing, route);
            s.notices.push({id: lot.id, ingredient: ing, at: now + R.noticeAfterMinutes, noticed: chance(s, `lot:${s.serial}:notice`, R.noticePermille), done: false});
            lot.claim = 'Taken from the private stores without leave.';
        } else if(route.kind === 'harvest') {
            need(ing === 'book.hp.ing.fluxweed', 'Only fluxweed grows here.');
            need(s.harvestAt === null || now - s.harvestAt >= R.harvestCooldownMinutes, 'The patch hasn\'t grown back yet.');
            lot = pickFluxweed(s, now, route, ctx.moon);
            s.harvestAt = now;
        } else fail('Unsupported route.');
        return `Obtained ${label(ing)}${req.prepared ? ' (ready-stewed)' : ''}.`;
    }
    case 'prepare': {
        const lot = lotOf(s, req.lotId);
        const plan = planHpPreparation({lot, variantId: req.variant, now, purse: s.purse, apparatusAvailable: ctx.preparationAvailable !== false});
        spend(s, plan.cost.coins); s.lots[lot.id] = plan.lot;
        return plan.summary;
    }
    case 'stew': {
        const lot = lotOf(s, req.lotId);
        need(lot.ingredient === 'book.hp.ing.lacewing_flies' && lot.form === 'raw' && !lot.stew, 'Only raw lacewing flies are stewed.');
        need(Object.values(s.lots).filter(l => l.stew).length < R.stewPotCapacity, 'The stew pot is full.');
        lot.stew = {startedAt: now};
        return 'Lacewing flies are on to stew. The source asks for twenty-one days.';
    }
    case 'removeStew': {
        const lot = lotOf(s, req.lotId);
        need(lot.stew, 'That lot isn\'t stewing.');
        const spent = now - lot.stew.startedAt;
        lot.stew = null; lot.truth.stewedMinutes = spent; lot.known.stewed = spent >= F.slots[0].nearStewMinutes;
        if(spent >= F.slots[0].nearStewMinutes) lot.form = 'stewed';
        return spent >= F.slots[0].nearStewMinutes ? 'Taken off early: stewed, but short of twenty-one days.' : 'Taken off far too early: still raw.';
    }
    case 'sample': {
        const donor = s.donors[req.donorId] ?? fail('Choose a donor.');
        need(req.route === 'ask' || req.route === 'brush', 'Choose how to get the sample.');
        if(req.route === 'ask') {
            need(donor.standing >= R.donorAskMinStanding, `${donor.name} won't help you right now.`);
            need(donor.askedAt === null || now - donor.askedAt >= R.donorAskCooldownMinutes, `${donor.name} has already helped you recently.`);
            donor.askedAt = now;
        }
        const id = nextLot(s, 'S'), others = Object.keys(s.donors).filter(k => k !== donor.id);
        const mixed = req.route === 'brush' && chance(s, `sample:${s.serial}:mixed`, R.brushMixPermille);
        s.samples[id] = {id, donorId: mixed ? pick(s, `sample:${s.serial}:other`, others) : donor.id, claimDonorId: donor.id, route: req.route, acquiredAt: now,
            truth: {species: req.route === 'brush' && chance(s, `sample:${s.serial}:species`, R.brushCatPermille) ? 'cat' : 'human'},
            known: {assayed: false}, claim: req.route === 'ask' ? `Given freely by ${donor.name}.` : `Hair from ${donor.name}'s brush.`};
        return `Sample obtained: ${s.samples[id].claim}`;
    }
    case 'brew': {
        need(!s.draughtTrial && !s.antidoteTrial, 'Finish the class flask before starting another brew.');
        need(!s.cauldron.brew, 'The cauldron is already simmering or settling.');
        need(!req.method || [HP_PROCESS.id, ABRASIVE.ref].includes(req.method), 'Choose a supported making method.');
        const suspension = req.method === ABRASIVE.ref;
        need(req.finish == null || !suspension && ['standard', 'concentrated'].includes(req.finish), 'Choose a supported Polyjuice finish.');
        if(suspension && req.materialInputs?.length) need(ctx.externalMaterials?.length === req.materialInputs.length, 'The host must validate every selected native input before admission.');
        const picked = {}, seen = new Set();
        for(const slot of F.slots) {
            const id = req.slots?.[slot.id];
            if(!id) continue;
            need(!seen.has(id), 'Each lot goes in once.');
            const lot = lotOf(s, id); need(!lot.stew, 'That lot is still stewing.');
            seen.add(id); picked[slot.id] = lot;
        }
        const inputs = Object.entries(picked).map(([slot, lot]) => ({slot, lot: clone(lot)}));
        const externalMaterials = suspension ? clone(ctx.externalMaterials ?? []) : [];
        need(seen.size > 0 || suspension && externalMaterials.length > 0, 'Add at least one lot, or a portion you\'re carrying.');
        const out = resolveBrew(picked, s.cauldron.condition, now);
        let minutes, producedDoses, abrasivePlan, finish;
        if(suspension) {
            abrasivePlan = planHpAbrasiveMixture({localInputs: inputs, externalMaterials, process: ABRASIVE.steps,
                apparatus: {station: 'cauldron', carrier: 'water-suspension', application: 'manual-scour'}});
            if(ctx.abrasivePlan) need(JSON.stringify(ctx.abrasivePlan) === JSON.stringify(abrasivePlan), 'The suspension you picked has changed. Check the portions again.');
            minutes = abrasivePlan.process.minutes; producedDoses = abrasivePlan.process.producedDoses; out.grade = 'original';
        } else {
            need(!req.materialInputs?.length && !ctx.externalMaterials?.length, 'Solids from other worlds only go in with the suspension method.');
            const plan = polyjuiceFinish(req.finish ?? 'standard', out, inputs);
            finish = {revision: plan.revision, mode: plan.mode, doseMinutes: plan.doseMinutes};
            minutes = plan.brewMinutes;
            producedDoses = plan.doses;
        }
        const history = {revision: 1, process: suspension ? ABRASIVE.id : HP_PROCESS.id, clock: 'played-calendar', startedAt: now, minutes, readyAt: now + minutes,
            producedDoses, cauldronCondition: s.cauldron.condition, inputs, resolution: clone(out),
            ...(suspension ? {externalMaterials, abrasivePlan: clone(abrasivePlan)} : {finish})};
        checkHistory(history);
        let repeatAssurance = '';
        if(req.repeatMethodId) {
            const method = (s.methods ?? []).find(m => m.id === req.repeatMethodId && m.request.type === 'brew') ?? fail('Choose a brewing method you actually demonstrated.');
            const repeat = planDemonstratedRepeat(method, {mode: req.repeatMode ?? 'quick', setup: knownSetup(history), request: programFor(history)});
            need(repeat.ok, repeat.reason); repeatAssurance = repeat.assurance;
        }
        if(suspension) spend(s, abrasivePlan.cost.coins);
        for(const id of seen) delete s.lots[id];
        s.cauldron.brew = {id: ++s.seq, startedAt: now, readyAt: history.readyAt, grade: out.grade, history};
        s.cauldron.condition = Math.max(0, s.cauldron.condition - R.cauldronWearPerBrew);
        const summary = suspension ? 'Water service paid: 1 coin. The original suspension will settle for 20 played minutes into three doses; its cleaning effect is untested.'
            : finish.mode === 'concentrated' ? 'The cauldron will simmer for two days and one hour into two doses. Add the sample at the glass.'
                : 'The cauldron is simmering for two days. Add the sample at the glass.';
        return repeatAssurance ? `${summary} ${repeatAssurance}` : summary;
    }
    case 'treatCauldron': {
        const batch = batchOf(s, req.batchId); carried(batch); retained(batch);
        need(batch.dosesLeft > 0, 'That portion is used up.');
        need(!s.cauldron.brew, 'Wait for the current cauldron work to finish.');
        need(s.cauldron.condition < R.cauldronStart, 'The cauldron has no residue to treat.');
        const before = s.cauldron.condition, target = {condition: conditionWord(before), residue: residueWord(before)};
        need(!req.stir || suspensionOf(batch), 'Choose a suspension to stir.');
        const strength = pourSuspension(batch, 1, now, req.stir)?.work ?? 0;
        batch.dosesLeft--; s.cauldron.condition = Math.min(R.cauldronStart, before + strength);
        const removed = s.cauldron.condition - before;
        const response = removed ? `The dose lifted residue; the cauldron now has ${residueWord(s.cauldron.condition)}.` : 'The dose was spent, but it lifted no residue.';
        batch.known.treatmentObserved = response;
        log(s, now, 'treatment', response);
        noteObservation(s, batch, {route: 'examination', seen: [removed ? 'examination.cleaned' : 'examination.no-change'], response, target, viable: removed > 0});
        return response;
    }

    // ORIGINAL local portion custody. These are existing HP doses, not new
    // bottle items, native chest stock or an inferred recipient inventory.
    case 'splitBatch': {
        const b = batchOf(s, req.batchId); carried(b); retained(b);
        need(int(req.doses) && req.doses > 0 && req.doses <= b.dosesLeft, 'Choose a positive number of remaining doses.');
        const id = nextLot(s, 'a'), suspension = pourSuspension(b, req.doses, now);
        s.batches[id] = {...clone(b), id, doses: req.doses, dosesLeft: req.doses, ...(suspension ? {suspension} : {})};
        b.doses -= req.doses; b.dosesLeft -= req.doses;
        return `Set aside ${req.doses} dose${req.doses === 1 ? '' : 's'} as a separate portion of the same batch.`;
    }
    case 'mergeBatch': {
        const b = batchOf(s, req.batchId), source = batchOf(s, req.sourceId);
        carried(b); carried(source); retained(b); retained(source);
        need(b.id !== source.id && source.dosesLeft > 0, 'Choose another remaining portion.');
        need(b.cohortId === source.cohortId && b.grade === source.grade && b.readyAt === source.readyAt && JSON.stringify(b.history) === JSON.stringify(source.history), 'These are different batches. Keep their portions separate.');
        const left = suspensionOf(b), right = suspensionOf(source);
        if(left && right) b.suspension = {work: left.work + right.work, mixedAt: now};
        b.doses += source.doses; b.dosesLeft += source.dosesLeft;
        b.known.identified ||= source.known.identified; b.known.assayed ||= source.known.assayed;
        if(source.known.treatmentObserved && !b.known.treatmentObserved) b.known.treatmentObserved = source.known.treatmentObserved;
        delete s.batches[source.id];
        return 'Recombined portions of the same batch; no spent dose was restored.';
    }
    case 'transferBatch': {
        const b = batchOf(s, req.batchId); retained(b);
        need(['carried', 'bench'].includes(req.custody), 'You can carry portions or keep them on your bench. Giving them away or moving them to a chest isn\'t possible yet.');
        need(req.custody !== b.custody, 'That portion is already there.');
        b.custody = req.custody;
        return req.custody === 'bench' ? 'The portion is set aside at your bench. Retrieve it before use.' : 'Retrieved the same portion from your bench.';
    }
    case 'scour': {
        need(!s.cauldron.brew, 'Wait for the cauldron to finish.');
        need(s.cauldron.condition < R.cauldronStart, 'The cauldron is already clean.');
        spend(s, R.scourCost); s.cauldron.condition = R.cauldronStart;
        return 'The cauldron is scoured.';
    }
    case 'assay': {
        spend(s, R.assayCost);
        if(req.sampleId) { const x = s.samples[req.sampleId] ?? fail('Choose a sample.'); x.known.assayed = true; return `Assay: ${x.truth.species} hair, from ${s.donors[x.donorId].name}.`; }
        if(req.batchId) {
            const b = batchOf(s, req.batchId); carried(b); need(b.dosesLeft > 0, 'No dose remains to assay.'); b.known.assayed = true; b.known.identified = true;
            const suspension = b.history?.process === ABRASIVE.id, abrasive = (b.history?.abrasivePlan?.strength ?? 0) > 0;
            const response = suspension ? (abrasive ? 'Original suspension: the assay found abrasive particles; actual cleaning still depends on the target residue.' : 'Original suspension: no abrasive contribution found by the assay.') : `Assay: ${HP.outcomes[b.grade].label}.`;
            noteObservation(s, b, {route: 'assay', seen: [suspension ? abrasive ? 'assay.abrasive' : 'assay.no-abrasion' : `assay.${b.grade}`], response,
                viable: suspension ? abrasive : b.grade !== 'original'});
            return response;
        }
        const lot = lotOf(s, req.lotId); lot.known.assayed = true;
        if(lot.ingredient === 'book.hp.ing.fluxweed') lot.known.provenance = lot.truth.provenance;
        if(lot.truth.stewedMinutes && lot.form === 'stewed') lot.known.stewed = true;
        return `Assay done on ${label(lot.ingredient)}.`;
    }
    case 'repay': {
        const d = s.debts.find(x => x.id === req.debtId && x.status !== 'repaid') ?? fail('Choose an open loan.');
        spend(s, d.repay); d.status = 'repaid';
        return `Repaid the loan of ${label(d.ingredient)}.`;
    }
    case 'seekCare': {
        need(s.condition, 'Nothing here needs the hospital wing.');
        need(s.condition.track, 'These features fade on the old fixed schedule. Care won\'t speed them up.');
        need(!s.condition.care, 'You\'re already in the hospital wing.');
        s.condition.care = true; s.condition.careSince = now;
        log(s, now, 'care', 'You checked into the hospital wing. The features will be looked after until they clear.');
        return 'Admitted to the hospital wing. Weekly checks now get the healer\'s help.';
    }
    case 'drink': {
        const batch = s.batches[req.batchId] ?? fail('Choose a batch.'), sample = s.samples[req.sampleId] ?? fail('Choose a sample.');
        carried(batch);
        need(batch.dosesLeft > 0, 'That batch is used up.');
        need(!s.effect && !s.condition, 'Wait until the last change and its after-effects are over.');
        const donor = s.donors[sample.donorId];
        const baseline = {condition: s.condition?.id ?? 'clear', effect: s.effect?.kind ?? 'none', sampleSpecies: sample.known.assayed ? sample.truth.species : 'unknown'};
        const observeDrink = (response, effect, viable) => noteObservation(s, batch, {route: 'oral', seen: [effect], response, baseline,
            confounders: sample.known.assayed ? [] : ['Sample species was not assayed before use'], viable});
        pourSuspension(batch, 1, now);
        batch.dosesLeft--; delete s.samples[sample.id]; batch.known.identified = true;
        if(batch.grade === 'original') { s.effect = {kind: 'nothing', startedAt: now, endsAt: now, donorId: donor.id, discovered: false}; log(s, now, 'drink', 'You drank it. Nothing changed, and the sample was wasted.'); observeDrink('Nothing happened.', 'oral.no-change', false); return 'Nothing happened.'; }
        if(sample.truth.species !== 'human') {
            s.condition = {id: 'animal_features', track: afflict(ANIMAL_FEATURES, {at: now, stage: ANIMAL_FEATURES.stages.length}), care: false};
            s.effect = {kind: 'animal', startedAt: now, endsAt: now, donorId: donor.id, discovered: false};
            log(s, now, 'drink', 'Wrong kind of hair. You came out part animal, and the features will take weeks to clear.');
            observeDrink('Animal features appeared.', 'oral.animal-features', true);
            return 'The potion took the wrong kind of hair.';
        }
        const kind = batch.grade === 'canon' ? 'transform' : 'thin';
        const legacyMinutes = kind === 'transform' ? F.transformMinutes : Math.floor(F.transformMinutes * R.degradedPermille / 1000);
        const minutes = batch.history?.finish?.doseMinutes ?? legacyMinutes;
        const discovered = sample.route === 'brush' && chance(s, `drink:${s.seq}:found`, R.discoverPermille);
        s.effect = {kind, startedAt: now, endsAt: now + minutes, donorId: donor.id, discovered};
        log(s, now, 'drink', `You became ${donor.name} for ${minutes} minutes.`);
        observeDrink(`You look and sound like ${donor.name}.`, `oral.${kind}`, true);
        return `You look and sound like ${donor.name}.`;
    }
    default: fail('Unknown action.');
    }
}

// A preview shows what the observer can already know (MR31): assay and drink would otherwise
// report the hidden result in their summaries before the player commits or pays.
const PREVIEW = {assay: `Pay ${R.assayCost} coins to learn what this really is.`, drink: 'Drink one dose with this sample.', treatCauldron: 'Spend one carried dose to test it against the current cauldron residue; it may do nothing.',
    startDraught: `Pay ${DRAUGHT_CLASS_FEE} coins for one prepared base and one bean. The class bench supplies the knife and cauldron.`,
    stirDraught: 'Stir once in this direction.', submitDraught: 'Hand in this flask for a colour assessment.',
    mixAntidote: 'Mix one paid test dose. The assay shows its result after use.', assayAntidote: 'Spend one test dose on the selected phial.',
    companionTreat: 'Give one serving and observe the response.', potionWorking: 'Carry out this work at the local station.'};
export function quote(s, ctx, req) {
    try { const copy = clone(s), summary = act(copy, ctx, req); return {eligible: true, summary: PREVIEW[req.type] ?? summary}; }
    catch(error) { return {eligible: false, reason: error.message}; }
}
export function commit(s, ctx, req) {
    const next = clone(s), summary = act(next, ctx, req);
    return {state: next, summary};
}

// Player-visible projection (MR31): claims and witnessed facts only.
const standingWord = n => n <= -3 ? 'hostile' : n < 0 ? 'cool' : n === 0 ? 'neutral' : 'warm';
export function view(s, ctx) {
    if(!s) return {begun: false, potionWorkings: viewPotionWorkings(undefined, ctx)};
    const t = clone(s); settle(t, ctx.now);
    const lotView = l => ({id: l.id, name: label(l.ingredient), ingredient: l.ingredient, form: l.form, variant: l.variant && VARIANT[l.variant].label, custody: l.custody, claim: l.claim, stewing: !!l.stew,
        preparation: l.preparation ? projectHpPreparation(l.preparation) : null,
        ...(l.harvestedAt != null ? {freshness: freshnessOf(l, t.now).state, freshnessText: wordsFor(freshnessOf(l, t.now))} : {}),
        stewDaysDone: l.stew ? Math.floor((t.now - l.stew.startedAt) / 1440) : null,
        provenance: l.ingredient === 'book.hp.ing.fluxweed' ? l.known.provenance : null, stewedKnown: l.known.stewed ? (l.form === 'stewed' ? (l.truth.stewedMinutes >= F.slots[0].minStewMinutes ? 'twenty-one days' : 'short of twenty-one days') : null) : null, assayed: l.known.assayed});
    const draught = t.draughtTrial && brewWorkshopDraught(t.draughtTrial);
    return {begun: true, purse: t.purse, store: t.store,
        companionPotions: viewCompanionPotions(t.companionPotions, t.now),
        potionWorkings: viewPotionWorkings(t.potionWorkings, ctx),
        draught: draught ? {...draught.observations, strokes: t.draughtTrial.strokes} : null, draughtFee: DRAUGHT_CLASS_FEE,
        antidote: t.antidoteTrial ? {binder: t.antidoteTrial.binder, method: t.antidoteTrial.method} : null,
        antidotePhial: t.antidotePhial ?? null,
        antidotePrices: ANTIDOTE_BINDERS.map(binder => [binder, antidoteCost(binder)]),
        lots: Object.values(t.lots).map(lotView),
        fluxweedBed: t.fluxweedBed ? {minutesLeft: Math.max(0, t.fluxweedBed.readyAt - t.now)} : null,
        samples: Object.values(t.samples).map(x => ({id: x.id, claim: x.claim, donorName: t.donors[x.known.assayed ? x.donorId : x.claimDonorId].name, species: x.known.assayed ? x.truth.species : 'unknown', assayed: x.known.assayed})),
        donors: Object.values(t.donors).map(d => ({id: d.id, name: d.name, mood: standingWord(d.standing), askReady: d.askedAt === null || t.now - d.askedAt >= R.donorAskCooldownMinutes})),
        master: standingWord(t.master.standing),
        cauldron: {condition: conditionWord(t.cauldron.condition), residue: residueWord(t.cauldron.condition), brewing: !!t.cauldron.brew,
            activity: t.cauldron.brew?.history.process === ABRASIVE.id ? 'settling suspension' : 'simmering',
            readyInMinutes: t.cauldron.brew ? Math.ceil(t.cauldron.brew.readyAt - t.now) : null,
            readyInHours: t.cauldron.brew ? Math.ceil((t.cauldron.brew.readyAt - t.now) / 60) : null},
        batches: Object.values(t.batches).map(b => {
            const suspension = b.history?.process === ABRASIVE.id;
            return {id: b.id, cohortId: b.cohortId ?? null, custody: b.custody ?? 'carried', readyAt: b.readyAt, retainedHistory: !!b.history, dosesLeft: b.dosesLeft,
                suspension, cue: suspension ? (settledSuspension(suspensionOf(b), t.now) ? 'The solids have settled.' : 'Suspended solids in water.') : b.known.assayed || b.known.identified ? HP.outcomes[b.grade].cue + ' ' + HP.outcomes[b.grade].label : HP.outcomes[b.grade === 'original' ? 'original' : 'canon'].cue,
                treatment: b.known.treatmentObserved ?? (b.known.assayed && suspension ? (b.history.abrasivePlan.strength > 0 ? 'Abrasive particles detected; test against actual residue.' : 'No abrasive contribution found.') : 'Cleaning effect untested.'),
                tested: !!b.known.treatmentObserved, identified: b.known.identified, label: suspension ? (b.known.identified ? 'Original suspension' : b.known.treatmentObserved ? 'Tested suspension (original)' : 'Untested suspension (original)') : b.known.identified ? HP.outcomes[b.grade].label : 'Unidentified brew'};
        }),
        experiments: clone(t.experiments ?? createExperimentLog()), methods: clone(t.methods ?? []),
        effect: t.effect && t.effect.endsAt > t.now ? {kind: t.effect.kind, donorName: t.donors[t.effect.donorId].name, minutesLeft: Math.ceil((t.effect.endsAt - t.now) / 5) * 5} : null,
        condition: !t.condition ? null : t.condition.track ? {id: t.condition.id, stage: t.condition.track.stage, stages: ANIMAL_FEATURES.stages.length,
            text: ANIMAL_FEATURES.stages[t.condition.track.stage - 1].text, care: t.condition.care, nextCheckDays: Math.ceil((t.condition.track.nextAt - t.now) / 1440)}
            : {id: t.condition.id, daysLeft: Math.ceil((t.condition.until - t.now) / 1440)},
        debts: t.debts.filter(d => d.status !== 'repaid').map(d => ({id: d.id, name: label(d.ingredient), status: d.status, dueInDays: Math.floor((d.dueAt - t.now) / 1440), repay: d.repay})),
        ledger: t.ledger.slice(-16).map(e => ({id: e.id, at: e.at, kind: e.kind, text: e.text})), moonReady: typeof ctx.moon === 'string', moon: ctx.moon ?? null,
        harvestReady: t.harvestAt === null || t.now - t.harvestAt >= R.harvestCooldownMinutes};
}

const KEYS = ['schema', 'packRevision', 'root', 'begunAt', 'now', 'purse', 'serial', 'seq', 'store', 'lots', 'samples', 'donors', 'debts', 'notices', 'master', 'cauldron', 'batches', 'effect', 'condition', 'harvestAt', 'ledger'];
export function validate(s) {
    need(s && typeof s === 'object' && !Array.isArray(s), 'Polyjuice slice is not an object.');
    need(s.schema === SCHEMA && s.packRevision === 1, 'Unsupported Polyjuice slice revision.');
    need(KEYS.every(k => Object.hasOwn(s, k)) && Object.keys(s).every(k => KEYS.includes(k) || ['experiments', 'methods', 'fluxweedBed', 'draughtTrial', 'antidoteTrial', 'antidotePhial', 'companionPotions', 'potionWorkings'].includes(k)), 'Polyjuice slice has missing or unknown fields.');
    need(Number.isInteger(s.root) && s.root >= 0 && s.root <= 0xffffffff, 'Bad slice seed.');
    for(const k of ['begunAt', 'now', 'purse', 'serial', 'seq']) need(int(s[k]) && s[k] >= 0, `Bad ${k}.`);
    need(s.now >= s.begunAt, 'Slice clock is behind its start.');
    if(Object.hasOwn(s, 'companionPotions')) validateCompanionPotions(s.companionPotions, s.now);
    if(Object.hasOwn(s, 'potionWorkings')) validatePotionWorkings(s.potionWorkings, s.now);
    if(Object.hasOwn(s, 'antidotePhial')) {
        const phial = s.antidotePhial;
        need(phial && Object.keys(phial).length === 3 && Object.entries(FRESH_PHIAL).every(([key, initial]) =>
            int(phial[key]) && phial[key] >= 0 && phial[key] <= initial) && Object.values(phial).some(amount => amount > 0), 'Malformed retained assay phial.');
    }
    if(s.antidoteTrial) {
        const a = s.antidoteTrial;
        const fields = ['binder', 'method', 'startedAt', ...(a.method === 'composed' ? ['steps', 'catalyst'] : [])];
        need(!s.cauldron.brew && !s.draughtTrial && Object.keys(a).length === fields.length && fields.every(k => Object.hasOwn(a, k)) &&
            int(a.startedAt) && a.startedAt >= s.begunAt && a.startedAt <= s.now, 'Malformed antidote flask.');
        resolveAntidoteTrial(a);
    }
    if(s.draughtTrial) {
        const d = s.draughtTrial;
        need(!s.cauldron.brew && Object.keys(d).length === 3 && ['preparation', 'strokes', 'startedAt'].every(k => Object.hasOwn(d, k)) &&
            int(d.startedAt) && d.startedAt >= s.begunAt && d.startedAt <= s.now && typeof d.strokes === 'string'
            && ['crush', 'slice'].includes(d.preparation), 'Malformed class flask.');
        brewWorkshopDraught(d);
    }
    if(s.fluxweedBed) {
        checkFluxweedGrowth(s.fluxweedBed, s.now);
        need(!s.lots[s.fluxweedBed.parentLotId], 'The planted clipping is already in the bed.');
    }
    for(const l of Object.values(s.lots)) {
        need(ING[l.ingredient] && ING[l.ingredient].forms.includes(l.form) && l.id in s.lots, 'A lot has an unknown ingredient or form.');
        need(!l.variant || VARIANT[l.variant]?.makes === l.form, 'A lot variant does not match its form.');
        need(l.acquiredAt <= s.now && (!l.stew || l.stew.startedAt <= s.now), 'A lot is dated after the slice clock.');
        if(l.preparation) validateHpPreparationReceipt(l.preparation, l, s.now);
        checkFluxweedLot(l);
        need(Object.hasOwn(l.truth, 'provenance') && int(l.truth.stewedMinutes) && ['full_moon', 'other', null].includes(l.truth.provenance), 'A lot lacks its truth record.');
    }
    for(const x of Object.values(s.samples)) need(s.donors[x.donorId] && s.donors[x.claimDonorId] && ['human', 'cat'].includes(x.truth.species), 'A sample lacks a donor or species.');
    if(s.experiments) {validateExperimentLog(s.experiments); need(s.experiments.entries.every(e => e.at <= s.now), 'Experiment record is ahead of the clock.');}
    if(s.methods) {
        need(Array.isArray(s.methods) && s.methods.length <= MAX_DEMONSTRATED_METHODS && new Set(s.methods.map(m => m.id)).size === s.methods.length, 'Malformed HP method records.');
        for(const m of s.methods) {validateDemonstratedMethod(m); need(m.at <= s.now, 'Method record is ahead of the clock.');}
    }
    const cohorts = new Map();
    for(const [id, b] of Object.entries(s.batches)) {
        need(b.id === id && ['canon', 'degraded', 'original'].includes(b.grade) && int(b.doses) && int(b.dosesLeft) && b.dosesLeft >= 0 && b.dosesLeft <= b.doses, 'A batch is malformed.');
        if(b.suspension) need(b.history?.process === ABRASIVE.id && int(b.suspension.work) && b.suspension.work >= 0
            && (b.dosesLeft > 0 || b.suspension.work === 0) && int(b.suspension.mixedAt) && b.suspension.mixedAt >= b.readyAt
            && b.suspension.mixedAt <= s.now, 'Malformed retained suspension.');
        if(b.history || b.cohortId || b.custody) {
            retained(b); need(typeof b.cohortId === 'string' && ['carried', 'bench'].includes(b.custody) && b.readyAt === b.history.readyAt && b.grade === b.history.resolution.grade, 'Malformed HP cohort custody.');
            const c = cohorts.get(b.cohortId) ?? {doses: 0, work: 0, history: JSON.stringify(b.history), yield: b.history.producedDoses,
                initialWork: (b.history.abrasivePlan?.strength ?? 0) * b.history.producedDoses};
            need(c.history === JSON.stringify(b.history), 'Cohort portions disagree about their paid history.');
            c.doses += b.doses; c.work += suspensionOf(b)?.work ?? 0; cohorts.set(b.cohortId, c);
        }
    }
    for(const c of cohorts.values()) {
        need(c.doses === c.yield, 'HP cohort portions do not conserve the produced doses.');
        need(c.work <= c.initialWork, 'HP cohort portions exceed the batch’s abrasive work.');
    }
    if(s.cauldron.brew) { checkPending(s.cauldron.brew, s); need(s.cauldron.brew.startedAt <= s.now, 'Pending HP brew is ahead of the slice clock.'); }
    need(int(s.cauldron.condition) && s.cauldron.condition >= 0 && s.cauldron.condition <= R.cauldronStart, 'Bad cauldron condition.');
    if(s.condition) {
        const c = s.condition, t = c.track;
        need(c.id === 'animal_features', 'Unknown HP condition.');
        // Compatibility: older saves keep their fixed `until`; new ones carry a staged track.
        need(t ? t.id === ANIMAL_FEATURES.id && Number.isInteger(t.stage) && t.stage >= 1 && t.stage <= ANIMAL_FEATURES.stages.length
            && int(t.since) && int(t.nextAt) && t.nextAt > t.since && t.since <= s.now && typeof c.care === 'boolean' && Array.isArray(t.treatments)
            && (!c.care || int(c.careSince) && c.careSince <= s.now) : int(c.until), 'Malformed animal-features record.');
    }
    need(int(s.purse) && Object.keys(s.donors).length === R.donors && s.ledger.length <= LEDGER_CAP, 'Bad purse, donors or ledger.');
    need(Object.values(s.lots).filter(l => l.stew).length <= R.stewPotCapacity, 'Too many lots in the stew pot.');
    return s;
}
