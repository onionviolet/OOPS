// PC95 / RIG24. Formation supplies the spare qi that cocoons the precursors
// and lets them resonate on the common world clock.
import {resolveGuActivation} from '../gu_activation.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {stableId} from '../simulation_ids.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';
import {MORTAL_APERTURE_RELEASE, MORTAL_APERTURE_RELEASED} from '../world_substrate_packs/gu_aperture.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const ASCENSION_PACK = 'g.ascension';
export const HEAVEN_QI = 'energy:heaven-qi';
export const EARTH_QI = 'energy:earth-qi';
export const GREEN_GRAPE = 'energy:immortal.green-grape';
const forming = 'gu.aperture-forming';
const formed = 'gu.aperture-formed';
const formationRefused = 'gu.aperture-formation-refused';
const reforming = 'gu.aperture-reforming';
const rerouting = 'gu.aperture-rerouting';
const intakeResult = 'gu.aperture-intake-result';
const landscape = 'landscape-as-before';
const claim = 'gu.unique.landscape';
const qi = [[HEAVEN_QI, 2], [EARTH_QI, 2]];
const eligible = (view, id, place, owner, kind) => view.placeOf(id) === place && view.property(id, 'alive') === true &&
    view.property(id, 'gu_kind') === kind && view.property(id, 'gu_keeper') === owner && view.property(id, 'gu_controller') === owner;
const formationInputs = [[HEAVEN_QI, 5], [EARTH_QI, 5]];
const spareQi = 3;
const formationWindow = 2;
const recoveryInputs = [[HEAVEN_QI, 5], [EARTH_QI, 6]];
const outsideCalamity = 'gu_outside_calamity';
const scattersOutsideQi = 'gu_scatters_outside_qi';
const strikeLead = 'gu_outside_strike_lead';
const scatterQi = (source, quantity) => ({op: 'add', holder: source, quantity, amount: -1});
const sourceFor = (state, quantity) => quantity === HEAVEN_QI ? state.heavenSource ?? state.source : state.source;

function exposure(state) {
    return Number.isSafeInteger(state.exposureMinutes) && state.exposureMinutes >= 2
        ? state.exposureMinutes : formationWindow;
}

function outsideThreats(view, source) {
    const named = view.property(source, outsideCalamity);
    const local = view.present(source).filter(id => view.property(id, scattersOutsideQi) === true);
    return named && !local.includes(named) ? [named, ...local] : local;
}

function outsideStrikes(view, place, state) {
    const {source, sealAt, outsidePulseSettled, outsideAttempts = [], exposedAt = sealAt - formationWindow} = state;
    const intakes = [];
    if (intakeSources(view, place, state, EARTH_QI).includes(source)) intakes.push([source, EARTH_QI]);
    if (state.heavenSource && state.heavenSource !== source &&
        intakeSources(view, place, state, HEAVEN_QI).includes(state.heavenSource)) intakes.push([state.heavenSource, HEAVEN_QI]);
    if (state.pooledIntakes) {
        for (const quantity of [EARTH_QI, HEAVEN_QI]) {
            for (const intake of intakeSources(view, place, state, quantity)) {
                if (!intakes.some(([id]) => id === intake) && view.has(intake, quantity)) intakes.push([intake, quantity]);
            }
        }
    }
    return intakes.flatMap(([intake, quantity]) => outsideThreats(view, intake).flatMap(threat => {
        const lead = view.property(threat, strikeLead) ?? 1;
        const at = sealAt - lead;
        return at > exposedAt && !outsideAttempts.includes(threat) && !(lead === 1 && outsidePulseSettled)
            ? [{threat, at, intake, quantity}] : [];
    }));
}

function outsidePulse(view, place, strikes) {
    const spent = new Map();
    const ops = [];
    for (const {threat, intake, quantity} of strikes) {
        const used = spent.get(intake) ?? 0;
        if (!view.has(intake, quantity) || view.amount(intake, quantity) <= used ||
            view.placeOf(threat) !== intake || view.property(threat, 'alive') !== true ||
            (view.has(threat, 'vitality') && view.amount(threat, 'vitality') <= 0) ||
            !view.has(threat, GREEN_GRAPE) || view.amount(threat, GREEN_GRAPE) < 1) continue;
        spent.set(intake, used + 1);
        ops.push({op: 'add', holder: threat, quantity: GREEN_GRAPE, amount: -1}, scatterQi(intake, quantity),
            {op: 'publish', kind: 'gu.outside-qi-scattered', place: intake, by: threat, detail: {aperture: place, quantity}});
    }
    return ops;
}

const disruptionRoles = {attacker: 'creature', source: 'place'};
export const GU_ASCENSION_DISRUPTION_LAW = defineWorkingLaw({id: 'gu.ascension-disruption', revision: 1, operations: {
    scatter: {roles: disruptionRoles, minutes: 1, settle({bound: {attacker, source}}) {
        if (attacker.properties.alive !== true || attacker.place !== source.holder ||
            !(attacker.quantities[GREEN_GRAPE] >= 1) || !(source.quantities[EARTH_QI] >= 1)) {
            return {ok: false, reason: 'Scattering qi needs a living attacker at the source, essence and earth qi.'};
        }
        return {ok: true, costs: [{quantity: GREEN_GRAPE, payer: attacker.holder, amount: 1}],
            effects: [scatterQi(source.holder, EARTH_QI)]};
    }},
}});
export const guAscensionDisruptionWorking = {id: 'gu.scatter-formation-qi', revision: 1, law: GU_ASCENSION_DISRUPTION_LAW.ref,
    roles: disruptionRoles, steps: [{op: 'scatter', bindings: {attacker: 'attacker', source: 'source'}}]};

const formationRoles = {operator: 'operator', aperture: 'place', source: 'place'};
const splitRoles = {...formationRoles, heavenSource: 'place'};
const rerouteRoles = {operator: 'operator', aperture: 'place', backup: 'place'};
function splitFormation(kind, inputs) {
    return {roles: splitRoles, minutes: 2, settle({bound: {operator, aperture, source, heavenSource}}) {
        if (operator.properties.alive !== true || operator.place !== aperture.holder ||
            [source, heavenSource].some(intake => intake.holder === aperture.holder) ||
            !inputs.every(([key, amount]) => (key === HEAVEN_QI ? heavenSource : source).quantities[key] >= amount &&
                aperture.quantities[key] === 0)) return {ok: false, reason: 'Formation needs both outside qi intakes.'};
        return {ok: true, effects: [{op: 'publish', kind, place: aperture.holder, by: operator.holder,
            detail: {source: source.holder, heavenSource: heavenSource.holder}}]};
    }};
}
export const GU_APERTURE_FORMATION_LAW = defineWorkingLaw({id: 'gu.aperture-formation', revision: 1, operations: {
    'form-pooled': {roles: formationRoles, minutes: 2, settle({bound: {operator, aperture, source}}) {
        if (operator.properties.alive !== true || operator.place !== aperture.holder || source.holder === aperture.holder)
            return {ok: false, reason: 'Formation needs the living cultivator at the aperture and an outside source.'};
        return {ok: true, effects: [{op: 'publish', kind: forming, place: aperture.holder, by: operator.holder,
            detail: {source: source.holder, pooledIntakes: true}}]};
    }},
    reroute: {roles: rerouteRoles, minutes: 1, settle({bound: {operator, aperture, backup}, options: {quantity}}) {
        if (operator.properties.alive !== true || operator.place !== aperture.holder ||
            ![HEAVEN_QI, EARTH_QI].includes(quantity) || backup.holder === aperture.holder)
            return {ok: false, reason: 'Rerouting needs the living cultivator at the aperture and an outside intake.'};
        return {ok: true, effects: [{op: 'publish', kind: rerouting, place: aperture.holder, by: operator.holder,
            detail: {quantity, backup: backup.holder}}]};
    }},
    'form-split': splitFormation(forming, formationInputs),
    'reform-split': splitFormation(reforming, recoveryInputs),
    form: {roles: formationRoles, minutes: 2, settle({bound: {operator, aperture, source}}) {
        if (operator.properties.alive !== true || operator.place !== aperture.holder || source.holder === aperture.holder) {
            return {ok: false, reason: 'Formation needs the living cultivator at the aperture and an outside source.'};
        }
        if (!formationInputs.every(([key, amount]) => source.quantities[key] >= amount && aperture.quantities[key] === 0)) {
            return {ok: false, reason: 'Formation needs balanced outside qi and empty aperture reserves.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: forming, place: aperture.holder, by: operator.holder,
            detail: {source: source.holder}}]};
    }},
    reform: {roles: formationRoles, minutes: 2, settle({bound: {operator, aperture, source}}) {
        if (operator.properties.alive !== true || operator.place !== aperture.holder || source.holder === aperture.holder ||
            !recoveryInputs.every(([key, amount]) => source.quantities[key] >= amount && aperture.quantities[key] === 0)) {
            return {ok: false, reason: 'Reforming needs the cultivator, empty aperture reserves and extra earth qi.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: reforming, place: aperture.holder, by: operator.holder,
            detail: {source: source.holder}}]};
    }},
}});
export const guApertureFormationWorking = {id: 'gu.form-immortal-aperture', revision: 1, law: GU_APERTURE_FORMATION_LAW.ref,
    roles: formationRoles, steps: [{op: 'form', bindings: {operator: 'operator', aperture: 'aperture', source: 'source'}}]};
export const guApertureReformationWorking = {...guApertureFormationWorking, id: 'gu.reform-immortal-aperture',
    steps: [{...guApertureFormationWorking.steps[0], op: 'reform'}]};
export const guPooledApertureWorking = {...guApertureFormationWorking, id: 'gu.form-pooled-aperture',
    steps: [{...guApertureFormationWorking.steps[0], op: 'form-pooled'}]};

export function guSplitApertureWorking({recovering = false} = {}) {
    const op = recovering ? 'reform-split' : 'form-split';
    return {id: 'gu.aperture.' + op, revision: 1, law: GU_APERTURE_FORMATION_LAW.ref, roles: splitRoles,
        steps: [{op, bindings: Object.fromEntries(Object.keys(splitRoles).map(role => [role, role]))}]};
}

export function guRerouteApertureWorking(quantity) {
    return {id: 'gu.aperture.reroute', revision: 1, law: GU_APERTURE_FORMATION_LAW.ref, roles: rerouteRoles,
        steps: [{op: 'reroute', bindings: {operator: 'operator', aperture: 'aperture', backup: 'backup'}, options: {quantity}}]};
}

// Of five units of each outside qi, two go into forming the aperture. The
// remaining three can be used by either cocoon, from the same world accounts.
const intakeOpen = (view, place, intake) =>
    view.exits(place, {kinds: ['qi-intake']}).some(exit => exit.to === intake);

function intakeSources(view, place, state, quantity) {
    const primary = sourceFor(state, quantity);
    const sources = !state.reroutedIntakes?.includes(quantity) || intakeOpen(view, place, primary) ? [primary] : [];
    if (state.pooledIntakes) sources.push(...view.exits(place, {kinds: ['qi-intake']}).map(exit => exit.to));
    return [...new Set(sources)].filter(source => source !== place && view.holder(source)?.kind === 'place');
}

function drawIntakes(view, place, state, inputs) {
    const draw = [];
    for (const [quantity, need] of inputs) {
        if (!view.has(place, quantity) || view.amount(place, quantity) !== 0) return null;
        let remaining = need;
        for (const holder of intakeSources(view, place, state, quantity)) {
            if (!remaining) break;
            const amount = view.has(holder, quantity) ? Math.min(remaining, view.amount(holder, quantity)) : 0;
            if (amount > 0) draw.push({op: 'add', holder, quantity, amount: -amount});
            remaining -= amount;
        }
        if (remaining) return null;
    }
    return draw;
}

function canForm(view, place, owner, state, inputs = formationInputs) {
    return view.placeOf(owner) === place && view.property(owner, 'alive') === true && view.has(owner, GREEN_GRAPE) &&
        view.amount(owner, GREEN_GRAPE) <= WORLD_QUANTITIES.energy.max - 2 &&
        drawIntakes(view, place, state, inputs) !== null;
}

function formAperture(view, place, event) {
    let state = view.state(place);
    const {by: owner, detail: {source}} = event;
    const intakes = {source, heavenSource: event.detail.heavenSource ?? null};
    if (event.kind === reforming) {
        if (state?.phase !== 'failed' || state.reason !== 'formation-disrupted-after-release' ||
            !state.mortalOrigin || state.owner !== owner || !canForm(view, place, owner, {...state, ...intakes, reroutedIntakes: []}, recoveryInputs)) {
            return [{op: 'publish', kind: formationRefused, place, by: owner, detail: {source}}];
        }
        const {reason: _reason, ...remaining} = state;
        return [{op: 'state', holder: place, value: {...remaining, ...intakes, phase: 'exposed',
            recovering: true, exposedAt: view.clock, sealAt: view.clock + exposure(state),
            outsidePulseSettled: false, outsideAttempts: [], reroutedIntakes: []}}];
    }
    if (state?.phase !== 'forming' || state.owner !== owner || state.source !== source) return [];
    const released = event.kind === MORTAL_APERTURE_RELEASED;
    if (released && state.mortalTransition !== true) return [];
    if (!released && intakes.heavenSource) state = {...state, ...intakes};
    if (!released && event.detail.pooledIntakes === true) state = {...state, pooledIntakes: true};
    const origin = released ? {mortalOrigin: {rank: event.detail.rank, aptitude: event.detail.aptitude}} : {};
    if (!canForm(view, place, owner, state)) {
        if (released) return failFormation(place, {...state, ...origin});
        return [{op: 'publish', kind: formationRefused, place, by: owner, detail: {source}}];
    }
    if (state.mortalTransition === true && !released) {
        return [{op: 'state', holder: place, value: state},
            {op: 'publish', kind: MORTAL_APERTURE_RELEASE, place, by: owner, detail: {target: owner, source}}];
    }
    if (state.exposedFormation && released) {
        return [{op: 'state', holder: place, value: {...state, ...origin, phase: 'exposed', exposedAt: view.clock,
            sealAt: view.clock + exposure(state)}}];
    }
    return settleFormation(view, place, {...state, ...origin});
}

function failFormation(place, state) {
    return [{op: 'state', holder: place, value: {...state, phase: 'failed', reason: 'formation-disrupted-after-release'}},
        {op: 'publish', kind: formationRefused, place, by: state.owner, detail: {source: state.source, afterRelease: true}}];
}

function rerouteAperture(view, place, {by, detail: {quantity, backup}}) {
    const state = view.state(place);
    const inputs = state?.recovering ? recoveryInputs : formationInputs;
    const need = inputs.find(([key]) => key === quantity)?.[1];
    const report = result => ({op: 'publish', kind: intakeResult, place, by, detail: {quantity, backup, result}});
    if (!need || state?.phase !== 'exposed' || state.owner !== by || view.clock >= state.sealAt ||
        view.placeOf(by) !== place || view.property(by, 'alive') !== true || backup === sourceFor(state, quantity) ||
        !intakeOpen(view, place, backup) ||
        !view.has(backup, quantity) || view.amount(backup, quantity) <= need) return [report('refused')];
    // Resolve the other intake before switching earth away from a shared source.
    const intakes = {source: sourceFor(state, EARTH_QI), heavenSource: sourceFor(state, HEAVEN_QI)};
    intakes[quantity === HEAVEN_QI ? 'heavenSource' : 'source'] = backup;
    const reroutedIntakes = [...new Set([...(state.reroutedIntakes ?? []), quantity])];
    return [scatterQi(backup, quantity), {op: 'state', holder: place, value: {...state, ...intakes, reroutedIntakes}},
        report('rerouted')];
}

function settleFormation(view, place, state) {
    const {owner, source} = state;
    const inputs = state.recovering ? recoveryInputs : formationInputs;
    return [
        ...drawIntakes(view, place, state, inputs),
        ...inputs.map(([quantity]) => ({op: 'add', holder: place, quantity, amount: spareQi})),
        {op: 'add', holder: owner, quantity: GREEN_GRAPE, amount: 2},
        {op: 'state', holder: place, value: {...state, phase: 'gathering', formedAt: view.clock}},
        {op: 'publish', kind: formed, place, by: owner, detail: {source}},
    ];
}

export const guAscensionPack = {
    id: ASCENSION_PACK, revision: 1,
    properties: [{id: 'gu_resonant', type: 'flag'}, {id: 'gu_pre_calamity_cover', type: 'level', min: 0, max: 100},
        {id: outsideCalamity, type: 'label'}, {id: scattersOutsideQi, type: 'flag'}, {id: strikeLead, type: 'level', min: 1}],
    reads: ['alive', 'vitality', 'gu_kind', 'gu_keeper', 'gu_controller', 'gu_resonant', outsideCalamity, scattersOutsideQi, strikeLead,
        HEAVEN_QI, EARTH_QI, GREEN_GRAPE],
    writes: [HEAVEN_QI, EARTH_QI, GREEN_GRAPE], lifecycle: {acts: ['merge']},
    publishes: [forming, reforming, formed, formationRefused, rerouting, intakeResult,
        MORTAL_APERTURE_RELEASE, 'gu.ascension-fusion', 'gu.outside-qi-scattered'],
    hears: [forming, reforming, MORTAL_APERTURE_RELEASED, rerouting],
    reactors: [{
        id: 'form-aperture', on: [forming, reforming, MORTAL_APERTURE_RELEASED], appliesTo: holder => holder.kind === 'place',
        react: (view, id, event) => event.place === id ? formAperture(view, id, event) : [],
    }, {
        id: 'reroute-aperture', on: [rerouting], appliesTo: holder => holder.kind === 'place',
        react: (view, id, event) => event.place === id ? rerouteAperture(view, id, event) : [],
    }],
    laws: [{
        id: 'seal-aperture', appliesTo: holder => holder.kind === 'place' && holder.state[ASCENSION_PACK]?.phase === 'exposed',
        horizon(view, place) {
            const state = view.state(place);
            const future = outsideStrikes(view, place, state).filter(row => row.at > view.clock);
            return Math.max(1, Math.min(state.sealAt, ...future.map(row => row.at)) - view.clock);
        },
        decide(view, place) {
            const state = view.state(place);
            if (view.clock < state.sealAt) {
                const strikes = outsideStrikes(view, place, state).filter(row => row.at === view.clock);
                if (!strikes.length) return [];
                const pulse = outsidePulse(view, place, strikes);
                return [{op: 'state', holder: place, value: {...state,
                    outsideAttempts: [...(state.outsideAttempts ?? []), ...new Set(strikes.map(row => row.threat))],
                    ...(view.clock === state.sealAt - 1 && {outsidePulseSettled: true})}}, ...pulse];
            }
            const inputs = state.recovering ? recoveryInputs : formationInputs;
            if (canForm(view, place, state.owner, state, inputs)) return settleFormation(view, place, state);
            return failFormation(place, state);
        },
    }, {
        id: 'spare-qi', appliesTo: holder => holder.kind === 'place' && ['gathering', 'cocooned'].includes(holder.state[ASCENSION_PACK]?.phase),
        decide(view, place) {
            const state = view.state(place);
            const {owner, river, mountain, product} = state;
            const change = patch => ({op: 'state', holder: place, value: {...state, ...patch}});
            const failed = reason => [change({phase: 'failed', reason})];
            if (view.placeOf(owner) !== place || view.property(owner, 'alive') !== true ||
                !eligible(view, river, place, owner, 'river-as-before') || !eligible(view, mountain, place, owner, 'mountain-as-before')) {
                return failed('precursor-or-owner-unavailable');
            }
            if (state.phase === 'gathering') {
                if (!qi.every(([key, amount]) => view.has(place, key) && view.amount(place, key) >= amount)) return [];
                return [...qi.map(([quantity, amount]) => ({op: 'add', holder: place, quantity, amount: -amount})),
                    change({phase: 'cocooned', readyAt: view.clock + 2})];
            }
            if (view.clock < state.readyAt) return [];
            if (view.property(place, 'gu_resonant') !== true) return failed('resonance-lost');
            const incumbent = view.lawFields(place, claim).find(field => field.scope === 'world');
            if (incumbent && view.property(incumbent.params.specimen, 'alive') === true) return failed('living-claim');
            if (!stableId(product) || view.holder(product) || view.lineage(product).length) return failed('product-identity-unavailable');
            return [
                {op: 'lifecycle', act: 'merge', holders: [river, mountain], value: {id: product, place,
                    properties: {alive: true, gu_kind: landscape, gu_rank: 6, gu_keeper: owner, gu_controller: owner},
                    state: {'l.living_body': livingBodyState({species: landscape, rate: 1})}}},
                ...(incumbent ? [{op: 'law_params', id: incumbent.id, params: {specimen: product}}]
                    : [{op: 'law_add', field: {id: claim, scope: 'world', kind: claim, params: {specimen: product}}}]),
                change({phase: 'fused'}),
                {op: 'publish', kind: 'gu.ascension-fusion', place, by: owner, detail: {product}},
            ];
        },
        horizon(view, place) {
            const {phase, readyAt} = view.state(place);
            return phase === 'cocooned' ? Math.max(1, readyAt - view.clock) : Infinity;
        },
        watches: (_view, place) => qi.map(([quantity, value]) => ({holder: place, quantity, op: 'gte', value})),
    }],
};

const roles = {operator: 'operator', specimen: 'gu', terrain: 'place'};
const restoreTerrain = {fn: 'restore', fuel: 'immortal', cost: 1, effect: {kind: 'restore-terrain', magnitude: 30}};
export const GU_LANDSCAPE_LAW = defineWorkingLaw({id: 'gu.landscape', revision: 1, operations: {
    restore: {roles, minutes: 1, settle({bound: {operator, specimen, terrain}, at}) {
        const p = specimen.properties;
        if (operator.properties.alive !== true || operator.place !== terrain.holder || specimen.place !== terrain.holder ||
            p.gu_kind !== landscape || p.gu_keeper !== operator.id || p.gu_controller !== operator.id) {
            return {ok: false, reason: 'Landscape as Before must be here and under the caster’s control.'};
        }
        const missing = terrain.properties.gu_pre_calamity_cover - terrain.quantities.cover;
        if (!(missing > 0)) return {ok: false, reason: 'There is no lost cover here to restore.'};
        const gu = {id: specimen.holder, kind: p.gu_kind, alive: p.alive === true, injured: p.injured,
            fedThrough: specimen.quantities.satiety > 0 ? at : at - 1};
        const result = resolveGuActivation({stages: [{gu, operator: operator.id, ability: restoreTerrain}], day: at,
            reserves: {[operator.id]: {immortal: operator.quantities[GREEN_GRAPE] ?? 0}}});
        if (result.outcome !== 'complete') return {ok: false, reason: result.reason};
        const amount = Math.min(missing, result.effects[0].magnitude);
        return {ok: true, costs: [{quantity: GREEN_GRAPE, payer: operator.holder, amount: result.activations[0].cost}],
            observed: {restored: amount}, effects: [{op: 'add', holder: terrain.holder, quantity: 'cover', amount}]};
    }},
}});

export const guLandscapeWorking = {id: 'gu.landscape.restore', revision: 1, law: GU_LANDSCAPE_LAW.ref, roles,
    steps: [{op: 'restore', bindings: {operator: 'operator', specimen: 'specimen', terrain: 'terrain'}}]};
