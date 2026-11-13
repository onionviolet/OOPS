// PC95. The demonstration is measured by the world after the beam moves.
import {moonlightBlade} from '../gu_ability_profiles.js';
import {resolveGuActivation} from '../gu_activation.js';
import {beamCondensationMinutes, beamCondensationProfile, deriveGuCondensation, quietBeamCondensationProfile} from '../gu_condensation.js';
import {beginGuRefinement, stepGuRefinement} from '../gu_refinement.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {startEngineWorking} from '../engine_world.js';
import {guBodyHolder} from '../gu_living_body.js';

const pack = 'g.beam-condensation';
const finish = 'gu.beam.finish';
const beginTrial = 'gu.beam.trial';
const endTrial = 'gu.beam.trial-end';
const landedLowering = 'gu_beam_landed_lowering';
const witnessedMove = 'beam-lowering:';
const fuel = 'energy:primeval.rank1';
const accounts = {petals: 'stock:moon-orchid-petals', stone: 'stock:primeval_stone'};
const shape = {operator: 'operator', site: 'place'};
const beamRoles = {operator: 'operator', beam: 'thing', rest: 'place'};
const demo = {...beamRoles, brace: 'gu', blade: 'gu', catch: 'gu'};
const cast = {...beamRoles, specimen: 'gu'};
const reject = reason => ({ok: false, reason});
const carries = (holder, quantity, amount) => (holder.quantities[quantity] ?? 0) >= amount;
const price = (quantity, payer, amount) => ({quantity, payer, amount});
const controls = (held, operator, kind, at) => held.properties.gu_kind === kind &&
    !guWorldUseReason(held, operator.id, operator.place, at);
const moveBeam = (beam, rest, by) => ({
    sentence: {verb: 'move', object: 'position', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
    details: {target: {shape: 'holder', id: beam.holder}, to: rest.holder, by},
});
const quietBeam = (site, amount, by) => ({
    sentence: {verb: 'remove', object: 'sound', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
    details: {target: {shape: 'holder', id: site}, amount, by},
});
function stage(operator, held, ability, at) {
    return {operator: operator.id, ability, gu: {id: held.holder, kind: held.properties.gu_kind,
        alive: held.properties.alive === true, injured: held.properties.injured, fedThrough: held.quantities.satiety > 0 ? at : at - 1}};
}
const localBeam = ({operator, beam, rest}) => operator.properties.alive === true && !!operator.place &&
    operator.place === beam.place && rest.holder !== beam.place && beam.properties.gu_beam_load > 0;

export const GU_BEAM_LAW = defineWorkingLaw({id: pack, revision: 1, operations: {
    demonstrate: {roles: demo, minutes: 1, settle({bound, at, address, options}) {
        const {operator, beam, rest, brace, blade, catch: net} = bound;
        if (!localBeam(bound) || !controls(brace, operator, 'white-jade', at) ||
            !controls(blade, operator, 'moonlight', at) || !controls(net, operator, 'silk-catch', at))
            return reject('The demonstration needs the three controlled Gu and a local beam.');
        const activate = (held, ability) => stage(operator, held, ability, at);
        const result = resolveGuActivation({beats: [
            {stages: [activate(brace, {fuel: 'primeval', cost: 1})]},
            {stages: [activate(blade, moonlightBlade), activate(net, {fuel: 'primeval', cost: 1})]},
        ], reserves: {[operator.id]: {primeval: operator.quantities[fuel] ?? 0}}, day: at});
        if (result.outcome !== 'complete') return {ok: false, reason: result.reason,
            costs: result.activations.map(row => price(fuel, operator.holder, row.cost))};
        const costs = result.activations.map(row => price(fuel, operator.holder, row.cost));
        if (beam.properties.gu_beam_load > 1) return {ok: true, costs, observed: {result: 'load-too-heavy'}};
        const working = address.slice(0, address.lastIndexOf('/'));
        const witness = {working, beam: beam.holder, rest: rest.holder, load: beam.properties.gu_beam_load,
            specimens: [brace.holder, blade.holder, net.holder], ...(options.quiet && {quiet: true})};
        const notice = {op: 'publish', place: operator.place, by: operator.holder};
        return {ok: true, costs, effects: [
            {...notice, kind: beginTrial, detail: witness},
            moveBeam(beam, rest, 'beam-trial:' + working),
            ...(options.quiet ? [quietBeam(operator.place, 2, 'beam-trial:' + working)] : []),
            {...notice, kind: endTrial},
        ]};
    }},
    shape: {roles: shape, minutes: 1, settle({bound: {operator, site}, facts: {witness}, address}) {
        if (!witness || operator.place !== site.holder || operator.properties.alive !== true) return reject('A measured demonstration and a work site are needed.');
        if (witness.quiet && !(witness.noise > 0)) return reject('Both movement and quieting must be measured.');
        const profile = witness.quiet ? quietBeamCondensationProfile : beamCondensationProfile;
        const {recipe, ability} = deriveGuCondensation({profile, witness: {outcome: 'complete', effects: [
            {kind: 'lower-beam', load: witness.load}, {kind: 'quiet-beam', noise: witness.noise},
        ]}});
        const inputs = recipe.stages[0].inputs;
        if (inputs.some(({material, amount}) => !carries(operator, accounts[material], amount))) return reject('The shaping materials are missing.');
        const id = address.slice(0, address.lastIndexOf('/'));
        const stocks = {[operator.id]: Object.fromEntries(inputs.map(({material, amount}) => [material, amount]))};
        const begun = beginGuRefinement({gu: [], attempts: [], stocks}, {id, refiner: operator.id, recipe, productId: id + '.gu'});
        const [job] = stepGuRefinement(begun, id).attempts;
        return {ok: true, costs: inputs.map(({material, amount}) => price(accounts[material], operator.holder, amount)),
            facts: {job, ability}};
    }},
    finish: {roles: shape, minutes: beamCondensationMinutes, settle({bound: {operator, site}, facts}) {
        if (!facts.job || operator.place !== site.holder || operator.properties.alive !== true) return reject('The shaped Gu needs its refiner at the site.');
        return {ok: true, effects: [{op: 'publish', kind: finish, place: site.holder, by: operator.holder, detail: facts}]};
    }},
    lower: {roles: cast, minutes: 1, settle({bound, at, options, address}) {
        const {operator, specimen, beam, rest} = bound;
        if (!localBeam(bound) || !controls(specimen, operator, 'beam-catch', at)) return reject('The operator needs the living Beam Catch Gu and a local beam.');
        const {cost, fuel: family, effect} = beamCondensationProfile;
        const ability = {cost, fuel: family, effect: {kind: effect, magnitude: specimen.properties.gu_beam_capacity}};
        const result = resolveGuActivation({stages: [stage(operator, specimen, ability, at)],
            reserves: {[operator.id]: {primeval: operator.quantities[fuel] ?? 0}}, day: at});
        if (result.outcome !== 'complete') return reject(result.reason);
        const quiet = specimen.properties.gu_beam_quiet;
        const lowered = beam.properties.gu_beam_load <= ability.effect.magnitude;
        const receipt = options?.ownMovement ? witnessedMove + address : null;
        return {ok: true, costs: [price(fuel, operator.holder, ability.cost)], effects: [
            ...(lowered ? [moveBeam(beam, rest, receipt ?? operator.holder)] : []),
            ...(quiet > 0 && !options?.quietAfter ? [quietBeam(operator.place, quiet, operator.holder)] : []),
        ], ...(options?.quietAfter && {facts: {lowering: lowered, origin: beam.place, ...(receipt && {receipt})}}),
        observed: {capacity: ability.effect.magnitude}};
    }},
    quiet: {roles: cast, minutes: 1, settle({bound: {operator, specimen, beam, rest}, facts, at}) {
        if (!facts.lowering || beam.place !== rest.holder) return reject('The beam did not reach its rest.');
        if (facts.receipt && beam.properties[landedLowering] !== facts.receipt) {
            return reject('This cast did not lower the beam.');
        }
        const quiet = specimen.properties.gu_beam_quiet;
        if (operator.properties.alive !== true || operator.place !== facts.origin ||
            !controls(specimen, operator, 'beam-catch', at) || specimen.properties.alive !== true ||
            specimen.properties.injured || !carries(specimen, 'satiety', 1) ||
            !(quiet > 0) || !carries(operator, fuel, 1)) return reject('Quieting needs a fed Gu and one more essence at the site.');
        return {ok: true, costs: [price(fuel, operator.holder, 1)],
            effects: [quietBeam(facts.origin, quiet, operator.holder)]};
    }},
}});

function method(id, roles, ops) {
    const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    return {id, revision: 1, law: GU_BEAM_LAW.ref, roles, steps: ops.map(op => ({op, bindings}))};
}
export const beamDemonstration = method('gu.beam.demonstrate', demo, ['demonstrate']);
export const quietBeamDemonstration = {...beamDemonstration, id: 'gu.beam.demonstrate-quiet',
    steps: [{...beamDemonstration.steps[0], options: {quiet: true}}]};
const condensation = method('gu.beam.condense', shape, ['shape', 'finish']);
export const condensedBeamWorking = method('gu.beam.lower', cast, ['lower']);
const stagedBeam = method('gu.beam.lower-then-quiet', cast, ['lower', 'quiet']);
export const stagedQuietBeamWorking = {...stagedBeam, steps: [
    {...stagedBeam.steps[0], options: {quietAfter: true}}, stagedBeam.steps[1],
]};
export const witnessedQuietBeamWorking = {...stagedQuietBeamWorking, id: 'gu.beam.witnessed-lowering',
    steps: [{...stagedBeam.steps[0], options: {quietAfter: true, ownMovement: true}}, stagedBeam.steps[1]]};
export function startBeamCondensation(engine, {id, operator, site}) {
    const witness = engine.world.holders[operator]?.state[pack]?.witness;
    return startEngineWorking(engine, {id, law: GU_BEAM_LAW, method: condensation, facts: witness ? {witness} : {},
        bindings: {operator: {kind: 'operator', id: operator}, site: {kind: 'place', id: site}}});
}

export const guBeamCondensationPack = {
    id: pack, revision: 1, publishes: [finish, beginTrial, endTrial],
    hears: ['effect.move', 'effect.remove', finish, beginTrial, endTrial], lifecycle: {acts: ['create']},
    properties: [...['gu_beam_load', 'gu_beam_capacity', 'gu_beam_quiet'].map(id => ({id, type: 'level', min: 1})),
        {id: landedLowering, type: 'label'}],
    writes: [landedLowering],
    reactors: [{
        id: 'record-lowering', on: ['effect.move'], appliesTo: holder => holder.kind === 'place',
        react(view, id, event) {
            const beam = event.detail?.target;
            if (id !== event.place || typeof event.by !== 'string' || !event.by.startsWith(witnessedMove) || !beam ||
                view.placeOf(beam) !== event.detail.to || !(view.property(beam, 'gu_beam_load') > 0)) return [];
            return [{op: 'property', holder: beam, property: landedLowering, value: event.by}];
        },
    }, {
        id: 'trial', on: [beginTrial, endTrial], appliesTo: holder => holder.as.includes('operator'),
        react(view, id, event) {
            if (event.by !== id) return [];
            const {witness, pending} = view.state(id) ?? {};
            const measured = pending?.moved && (!pending.quiet || pending.noise > 0)
                ? {...pending, at: view.clock} : witness;
            return [{op: 'state', holder: id, value: {
                ...(measured && {witness: measured}), ...(event.kind === beginTrial && {pending: event.detail}),
            }}];
        },
    }, {
        id: 'measure', on: ['effect.move', 'effect.remove'], appliesTo: holder => !!holder.state[pack]?.pending,
        react(view, id, event) {
            const state = view.state(id), {pending} = state;
            if (event.by !== 'beam-trial:' + pending.working) return [];
            const movement = event.kind === 'effect.move' && event.detail.target === pending.beam && event.detail.to === pending.rest;
            const quieting = pending.quiet && event.kind === 'effect.remove' && event.detail.target === event.place &&
                event.detail.object === 'noise' && event.detail.amount < 0;
            if (!movement && !quieting) return [];
            return [{op: 'state', holder: id, value: {...state, pending: {...pending,
                ...(movement && {moved: true}), ...(quieting && {noise: -event.detail.amount})}}}];
        },
    }, {
        id: 'emerge', on: [finish], appliesTo: holder => holder.kind === 'place',
        react(view, site, event) {
            if (site !== event.place) return [];
            const {job, witness, ability} = event.detail;
            if (job.refiner !== event.by || view.placeOf(event.by) !== site || view.holder(job.productId) ||
                view.lineage(job.productId).length) return [];
            const [gu] = stepGuRefinement({gu: [], attempts: [job], stocks: {[job.refiner]: {}}}, job.id).gu;
            const outputs = ability.effects ?? [ability.effect];
            const lower = outputs.find(effect => effect.kind === 'lower-beam');
            const quiet = outputs.find(effect => effect.kind === 'quiet-beam');
            return [{op: 'lifecycle', act: 'create', note: 'Demonstration: ' + witness.working, value: {
                ...guBodyHolder({id: gu.kind, needs: 'gu'}, {id: gu.id, place: site, satiety: 12}),
                properties: {alive: true, gu_kind: gu.kind, gu_rank: gu.rank, gu_keeper: gu.holder, gu_controller: gu.holder,
                    gu_beam_capacity: lower.magnitude, ...(quiet && {gu_beam_quiet: quiet.magnitude})},
            }}];
        },
    }],
};
