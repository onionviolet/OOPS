// Companion-book practice on the HP bench. HPPE171–174, HPPE183–184 supply
// the relationships. The exercise's fees, amounts and clocks are original.
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';
import {applyAgitation, createAgitationState, frontierAgitationLaw, settleAgitation} from './craft_agitation.js';
import {advance, afflict, defineAffliction} from './affliction_track.js';
import {cancelOutputs, defineDoseRules} from './craft_dose_rules.js';

const catalogue = defineCatalogue({
    id: 'book.hp.companion.materials', revision: 1, tags: [],
    axes: [{id: 'thickener', kind: 'fraction'}, {id: 'grit', kind: 'fraction'}],
    materials: [
        {id: 'water', revision: 1},
        {id: 'chalk', revision: 1, properties: {grit: 1000}},
        {id: 'flobberworm_mucus', revision: 1, properties: {thickener: 1000}},
    ],
});
const suspensionLaw = defineCraftLaw({id: 'book.hp.companion.suspension', revision: 1, catalogue,
    outputs: [{id: 'thickening', route: 'batch', effect: 'viscosity', axis: 'thickener', per: 40}]});
const suspensionMix = {verb: 'stir', seconds: 30, intensity: 'gentle', direction: 'clockwise', rhythm: 'steady'};
const paddle = {tools: ['paddle'], drive: 'manual', stamina: 100, energy: 0, toolCondition: 1, reach: 1, maxLoad: 10};
const material = (id, qty) => ({material: catalogue.materials[id], qty});

function mixSuspension(mucus) {
    // Replace one portion of water with mucus so total mass and chalk stay fixed.
    const inputs = [material('water', 3 - mucus), material('chalk', 1)];
    if(mucus) inputs.push(material('flobberworm_mucus', mucus));
    const {product} = resolveBatch(suspensionLaw, {inputs});
    const viscosity = product.outputs.batch?.viscosity ?? 0;
    const batch = {mass: product.mass / catalogue.basis, viscosity, fragility: 0};
    const stirred = applyAgitation(frontierAgitationLaw, createAgitationState(frontierAgitationLaw), batch, suspensionMix, paddle);
    return {batch, stirred};
}
const suspensionControls = [0, 1].map(mixSuspension);

function suspensionReading(at, mucus, now) {
    const {batch, stirred} = suspensionControls[mucus];
    const settled = settleAgitation(frontierAgitationLaw, stirred.state, batch, (now - at) * 60);
    return {suspended: Math.round(100 * settled.suspension), viscosity: batch.viscosity, stirEffort: stirred.costs.stamina};
}

const fireLead = 15;
const layingDelay = 10;
const ashwinderLife = 60; // Fantastic Beasts, Ashwinder entry
const hotWindow = 20;
const symptoms = {
    hysteria: defineAffliction({id: 'book.hp.assay.alihotsy', kind: 'poison', dc: 10,
        stages: [{duration: 120, text: 'Hysteria after eating Alihotsy leaves'}]}),
    ague: defineAffliction({id: 'book.hp.assay.ague', dc: 10,
        stages: [{duration: 120, text: 'Ague'}]}),
};
const remedies = {
    treacle: {label: 'Glumbumble treacle', cost: 2, counters: 'hysteria'},
    egg: {label: 'Frozen Ashwinder egg', cost: 0, counters: 'ague', stock: 'egg'},
};
const doseLaw = defineDoseRules({id: 'book.hp.companion.treatment', revision: 1,
    pairs: Object.entries(remedies).map(([id, row]) => ({a: row.counters, b: id, reason: `${row.label} treats this condition.`}))});
const need = (ok, text) => { if(!ok) throw Error(text); };
const stamp = (n, now) => Number.isSafeInteger(n) && n >= 0 && n <= now;
const has = (rows, key) => Object.hasOwn(rows, key);
const hasServing = (remedy, trial, now) => !remedy.stock || trial?.[remedy.stock] && ashwinderEggStage(trial[remedy.stock], now) === 'frozen';

export function ashwinderEggStage(egg, now) {
    const appearsAt = egg.fireAt + fireLead;
    const laidAt = appearsAt + layingDelay;
    if(egg.frozenAt != null) return 'frozen';
    if(egg.takenAt != null) return now < laidAt + hotWindow ? 'hot' : 'scorched';
    if(now < appearsAt) return 'fire';
    if(now < laidAt) return 'nesting';
    return now < laidAt + hotWindow ? 'nest' : 'missed';
}

const actions = {
    companionSuspend(s, trial, req, pay) {
        need(req.mucus === 0 || req.mucus === 1, 'Choose the plain or thickened glass.');
        need(!has(trial.glasses, req.mucus), 'Empty that glass before making another.');
        pay(1 + req.mucus);
        trial.glasses[req.mucus] = s.now;
        return 'The glass is stirred. Watch how the chalk settles.';
    },
    companionEmpty(_s, trial, req) {
        need((req.mucus === 0 || req.mucus === 1) && has(trial.glasses, req.mucus), 'Choose a filled glass.');
        delete trial.glasses[req.mucus];
        return 'You emptied the glass.';
    },
    companionFire(s, trial, _req, pay) {
        need(!trial.egg, 'Finish the current egg exercise first.');
        pay(2);
        trial.egg = {fireAt: s.now};
        return 'The supervised magical fire is lit. Watch for an Ashwinder.';
    },
    companionCollect(s, trial) {
        need(trial.egg && ashwinderEggStage(trial.egg, s.now) === 'nest', 'Collect the egg while it is still hot in the nest.');
        trial.egg.takenAt = s.now;
        return 'You lifted one hot egg with the bench tongs. Freeze it before it scorches.';
    },
    companionFreeze(s, trial) {
        need(trial.egg && ashwinderEggStage(trial.egg, s.now) === 'hot', 'Bring a hot egg to the freezing station first.');
        trial.egg.frozenAt = s.now;
        return 'The instructor froze the egg. It is ready to use.';
    },
    companionClear(s, trial) {
        need(trial.egg && ['missed', 'scorched', 'frozen'].includes(ashwinderEggStage(trial.egg, s.now)), 'There is nothing ready to clear.');
        const frozen = ashwinderEggStage(trial.egg, s.now) === 'frozen';
        delete trial.egg;
        return frozen ? 'You discarded the frozen egg.' : 'The instructor cleared the spent exercise.';
    },
    companionPatient(s, trial, req) {
        need(has(symptoms, req.condition), 'Choose the symptom to study.');
        need(!trial.patient, 'Finish observing the current teaching case first.');
        trial.patient = {condition: req.condition, track: afflict(symptoms[req.condition], {at: s.now})};
        return 'The instructor has prepared the teaching case.';
    },
    companionTreat(s, trial, req, pay) {
        need(has(remedies, req.remedy), 'Choose a remedy.');
        const remedy = remedies[req.remedy];
        need(hasServing(remedy, trial, s.now), `A serving of ${remedy.label.toLowerCase()} is needed for this dose.`);
        if(remedy.cost) pay(remedy.cost);
        if(remedy.stock) delete trial[remedy.stock];
        const condition = trial.patient?.condition;
        if(!condition) return 'The dose was used. There were no symptoms to treat.';
        const {outputs} = cancelOutputs(doseLaw, {oral: {[condition]: 1, [req.remedy]: 1}});
        if(outputs.oral?.[condition]) return 'The dose was used. The symptoms remain.';
        delete trial.patient;
        return 'The symptoms cleared after the dose.';
    },
};

export const isCompanionPotionAction = type => has(actions, type);

export function applyCompanionPotionAction(state, request, pay) {
    const trial = state.companionPotions ??= {revision: 1, glasses: {}};
    return actions[request.type](state, trial, request, pay);
}

export function settleCompanionPotions(trial, now) {
    const patient = trial?.patient;
    if(!patient || now < patient.track.nextAt) return;
    const {track} = advance(symptoms[patient.condition], patient.track, {at: now, draw: () => ({total: 20})});
    if(track) patient.track = track;
    else delete trial.patient;
}

export function viewCompanionPotions(trial, now) {
    const egg = trial?.egg;
    const stage = egg ? ashwinderEggStage(egg, now) : null;
    const laidAt = egg && egg.fireAt + fireLead + layingDelay;
    const ashwinderMinutes = egg && now >= egg.fireAt + fireLead ? Math.max(0, egg.fireAt + fireLead + ashwinderLife - now) : 0;
    return {
        glasses: Object.entries(trial?.glasses ?? {}).map(([mucus, at]) => ({mucus: Number(mucus), ...suspensionReading(at, Number(mucus), now)})),
        stage,
        minutes: stage === 'fire' ? egg.fireAt + fireLead - now : stage === 'nesting' ? laidAt - now
            : ['nest', 'hot'].includes(stage) ? laidAt + hotWindow - now : null,
        ashwinderMinutes,
        patient: trial?.patient ? symptoms[trial.patient.condition].stages[0].text : null,
        remedies: Object.entries(remedies).filter(([, remedy]) => hasServing(remedy, trial, now))
            .map(([id, {label, cost}]) => ({id, label, cost})),
    };
}

export function validateCompanionPotions(trial, now) {
    need(trial?.revision === 1 && trial.glasses && !Array.isArray(trial.glasses)
        && Object.keys(trial).every(key => ['revision', 'glasses', 'egg', 'patient'].includes(key))
        && Object.entries(trial.glasses).every(([key, at]) => ['0', '1'].includes(key) && stamp(at, now)), 'Malformed saved potion exercise.');
    if(trial.egg) {
        const {fireAt, takenAt, frozenAt} = trial.egg;
        const laidAt = fireAt + fireLead + layingDelay;
        need(Object.keys(trial.egg).every(key => ['fireAt', 'takenAt', 'frozenAt'].includes(key)) && stamp(fireAt, now)
            && (takenAt == null || stamp(takenAt, now) && takenAt >= laidAt && takenAt < laidAt + hotWindow)
            && (frozenAt == null || takenAt != null && stamp(frozenAt, now) && frozenAt >= takenAt && frozenAt < laidAt + hotWindow),
        'Malformed saved Ashwinder egg.');
    }
    if(trial.patient) {
        const {condition, track} = trial.patient;
        need(has(symptoms, condition) && stamp(track?.since, now) && track.nextAt > now
            && JSON.stringify(track) === JSON.stringify(afflict(symptoms[condition], {at: track.since})), 'Malformed saved teaching case.');
    }
}
