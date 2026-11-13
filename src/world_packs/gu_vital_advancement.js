// PC95. The directed cocoon uses the ordinary precursor refinement rule.
import {resolveGuActivation} from '../gu_activation.js';
import {beginGuRefinement, stepGuRefinement} from '../gu_refinement.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {EARTH_QI, GREEN_GRAPE, HEAVEN_QI} from './gu_ascension_working.js';

const kind = 'man-as-before';
const pack = 'g.vital-advancement';
const quench = 'gu.vital-quench';
const result = 'gu.vital-advanced';
const claim = 'gu.unique.man-as-before';
const cocoonMinutes = 2;
const recipe = {id: 'directed-vital-cocoon', revision: 1, kind, precursorKind: kind, rank: 6, uniqueKey: kind,
    stages: [{id: 'cocoon', inputs: [{material: HEAVEN_QI, amount: 1}]},
        {id: 'quench', inputs: [{material: EARTH_QI, amount: 1}], onPrecursorControlFailure: 'destroy'}]};
const refineRoles = {operator: 'operator', specimen: 'gu', site: 'place'};
const castRoles = {operator: 'operator', specimen: 'gu', patient: 'creature'};
const refuse = reason => ({ok: false, reason});
const specimenOf = (id, p) => ({id, kind: p.gu_kind, rank: p.gu_rank, alive: p.alive === true,
    holder: p.gu_keeper, vitalMaster: p.gu_vital_master, injured: p.injured});
const hasBond = (gu, operator) => gu.alive && gu.holder === operator && gu.vitalMaster === operator;
const available = (bound, at) => {
    const {operator, specimen, site} = bound;
    return operator.properties.alive && operator.place === site.holder && specimen.place === site.holder &&
        hasBond(specimenOf(specimen.holder, specimen.properties), operator.id) && specimen.properties.gu_controller === operator.id &&
        !specimen.properties.gu_installed_in && !(specimen.properties.gu_furnace_job && specimen.properties.gu_furnace_until >= at);
};
const price = (quantity, payer) => ({quantity, payer, amount: 1});

export const GU_VITAL_ADVANCEMENT_LAW = defineWorkingLaw({id: pack, revision: 1, operations: {
    cocoon: {roles: refineRoles, minutes: 1, settle({bound, address, at}) {
        const {operator, specimen, site} = bound;
        const gu = specimenOf(specimen.holder, specimen.properties);
        if (!available(bound, at) || gu.kind !== kind || gu.rank !== 5 || gu.injured ||
            !(site.quantities[HEAVEN_QI] >= 1) || !(site.quantities[EARTH_QI] >= 1) ||
            (specimen.properties.gu_cocoon_until ?? -1) >= at) return refuse('The directed cocoon lacks a vital precursor or spare qi.');
        const snapshot = {gu: [gu], attempts: [], stocks: {[operator.id]: site.quantities}};
        const id = address.replaceAll('/', '.');
        const prepared = stepGuRefinement(beginGuRefinement(snapshot, {id, refiner: operator.id, precursor: gu.id, recipe}), id);
        const [job] = prepared.attempts;
        return {ok: true, facts: {job}, costs: [price(HEAVEN_QI, site.holder)], effects: [
            {op: 'property', holder: gu.id, property: 'gu_cocoon', value: job.id},
            {op: 'property', holder: gu.id, property: 'gu_cocoon_until', value: at + cocoonMinutes},
        ]};
    }},
    quench: {roles: refineRoles, minutes: cocoonMinutes, settle({bound, facts: {job}, at}) {
        const {operator, specimen, site} = bound;
        if (!job || !available(bound, at) || specimen.properties.gu_cocoon !== job.id || specimen.properties.gu_cocoon_until < at ||
            specimen.properties.gu_rank !== 5 || specimen.properties.gu_kind !== kind ||
            !(site.quantities[EARTH_QI] >= 1)) return refuse('The vital Gu or quenching qi is unavailable.');
        return {ok: true, costs: [price(EARTH_QI, site.holder)], effects: [
            {op: 'publish', kind: quench, place: site.holder, by: operator.id, detail: {job}},
        ]};
    }},
    restore: {roles: castRoles, minutes: 1, settle({bound: {operator, specimen, patient}, at}) {
        const gu = specimenOf(specimen.holder, specimen.properties);
        const missing = patient.properties.gu_prior_vitality - patient.quantities.vitality;
        if (!operator.place || specimen.place !== operator.place || patient.place !== operator.place ||
            !operator.properties.alive || !patient.properties.alive || !hasBond(gu, operator.id) ||
            specimen.properties.gu_controller !== operator.id || gu.kind !== kind || gu.rank !== 6 || !(missing > 0)) {
            return refuse('Restoration needs the advanced vital Gu and a living patient with vitality to restore.');
        }
        const ability = {fuel: 'immortal', cost: 1, effect: {kind: 'restore-vitality', magnitude: 4}};
        const cast = resolveGuActivation({stages: [{gu: {...gu, fedThrough: specimen.quantities.satiety > 0 ? at : at - 1},
            operator: operator.id, ability}], reserves: {[operator.id]: {immortal: operator.quantities[GREEN_GRAPE] ?? 0}}, day: at});
        if (cast.outcome !== 'complete') return refuse(cast.reason);
        return {ok: true, costs: [price(GREEN_GRAPE, operator.holder)], effects: [{
            sentence: {verb: 'add', object: 'vitality', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: patient.holder}, amount: Math.min(missing, cast.effects[0].magnitude)},
        }]};
    }},
}});

function method(id, roles, ops) {
    const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    return {id, revision: 1, law: GU_VITAL_ADVANCEMENT_LAW.ref, roles, steps: ops.map(op => ({op, bindings}))};
}
export const vitalAdvancementWorking = method('gu.directed-cocoon', refineRoles, ['cocoon', 'quench']);
export const vitalRestorationWorking = method('gu.man-as-before', castRoles, ['restore']);

export const guVitalAdvancementPack = {
    id: pack, revision: 1, publishes: [quench, result], hears: [quench],
    properties: [{id: 'gu_vital_master', type: 'label'}, {id: 'gu_cocoon', type: 'label'},
        {id: 'gu_cocoon_until', type: 'level', min: 0}, {id: 'gu_quench_steady', type: 'flag'},
        {id: 'gu_prior_vitality', type: 'level', min: 0}],
    reads: ['gu_kind', 'gu_rank', 'alive', 'gu_keeper', 'gu_vital_master', 'injured', 'gu_quench_steady', 'gu_cocoon'],
    writes: ['gu_rank', 'injured', 'gu_cocoon', 'gu_cocoon_until'],
    reactors: [{
        id: 'vital-cocoon', on: [quench], appliesTo: holder => holder.kind === 'place',
        react(view, site, event) {
            const job = event.detail?.job;
            if (site !== event.place || job?.refiner !== event.by || view.property(job.precursor, 'gu_cocoon') !== job.id) return [];
            const id = job.precursor;
            const fields = ['gu_kind', 'gu_rank', 'alive', 'gu_keeper', 'gu_vital_master', 'injured'];
            const gu = specimenOf(id, Object.fromEntries(fields.map(key => [key, view.property(id, key)])));
            const incumbent = view.lawFields(site, claim).find(field => field.scope === 'world');
            const other = incumbent?.params.specimen;
            const live = other && other !== id && view.property(other, 'alive') === true;
            const resolved = stepGuRefinement({gu: live ? [gu, {id: other, alive: true, uniqueKey: kind}] : [gu],
                attempts: [job], stocks: {[job.refiner]: {}}}, job.id, {controlFailed: view.property(site, 'gu_quench_steady') !== true,
                isLivingMaster: master => view.property(master, 'alive') === true});
            const [advanced] = resolved.gu;
            const [settled] = resolved.attempts;
            const complete = settled.status === 'complete';
            return [
                ...Object.entries({gu_cocoon: null, gu_cocoon_until: null, ...(complete && {gu_rank: advanced.rank}),
                    ...(advanced.injured && {injured: true})}).map(([property, value]) => ({op: 'property', holder: id, property, value})),
                ...(complete ? [incumbent ? {op: 'law_params', id: incumbent.id, params: {specimen: id}}
                    : {op: 'law_add', field: {id: claim, kind: claim, scope: 'world', params: {specimen: id}}}] : []),
                {op: 'publish', kind: result, place: site, by: event.by,
                    detail: {specimen: id, status: settled.status, ...(settled.cause && {cause: settled.cause})}},
            ];
        },
    }],
};
