// PC95. Run catalogue Gu moves on the contest clock and read live bodies and
// protective fields from the common world at each meeting.
import {defaultChoice, entrantView, stepContest} from '../contest.js';
import {GU_CONTEST} from '../contest_packs/gu_world.js';
import {advanceEngineWorld, startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw, nextWorkingDeadline} from '../kernel_working.js';

const guardKind = 'gu.slashing-guard';
const guardCost = 2;
const roles = {operator: 'operator', guard: 'gu'};
const available = (gu, operator, kind) => !!operator?.place && gu?.place === operator.place && gu.properties.alive === true &&
    gu.properties.gu_kind === kind && gu.properties.gu_keeper === operator.id &&
    gu.properties.gu_controller === operator.id && gu.quantities.satiety > 0 && !gu.properties.injured;

// Authored calibration for the timing and Jade Skin match-up in ch. 83–85.
export const GU_MOONBLADE_GUARD = defineWorkingLaw({id: 'gu.moonblade-guard', revision: 1, operations: {
    raise: {roles, minutes: 1, settle({bound: {operator, guard}, address, at}) {
        if (!available(guard, operator, 'jade-skin')) return {ok: false, reason: 'Jade Skin Gu is unavailable.'};
        if ((operator.quantities.primeval_essence ?? 0) < guardCost)
            return {ok: false, reason: 'There is not enough essence to raise Jade Skin.'};
        return {ok: true, costs: [{quantity: 'primeval_essence', payer: operator.id, amount: guardCost}],
            effects: [{op: 'law_add', field: {id: address.replaceAll('/', '.'), scope: operator.id,
                kind: guardKind, params: {capacity: 28}, until: at + 2}}]};
    }},
}});

export function raiseJadeSkin(engine, {id, operator, guard}) {
    return startEngineWorking(engine, {id, law: GU_MOONBLADE_GUARD, method: {id: 'gu.jade-skin.raise', revision: 1,
        law: GU_MOONBLADE_GUARD.ref, roles, steps: [{op: 'raise', bindings: {operator: 'operator', guard: 'guard'}}]},
    bindings: {operator: {kind: 'operator', id: operator}, guard: {kind: 'gu', id: guard}}});
}

function liveProfile(view, _record, world) {
    const operator = world.holders[view.body];
    const gu = (view.profile.gu ?? []).filter(specimen => available(world.holders[specimen.id], operator, specimen.kind))
        .map(specimen => ({...specimen, fedThrough: 0}));
    const layers = world.laws.filter(field => field.scope === view.body && field.kind === guardKind)
        .map(field => ({id: field.id, type: 'slashing', capacity: field.params.capacity}));
    return {...view.profile, gu, layers: [...layers, ...(view.profile.layers ?? [])]};
}

function choose(law, record, world, id) {
    const view = entrantView(law, record, world, id);
    const refreshed = {...record, entrants: {...record.entrants, [id]: {...record.entrants[id],
        profile: liveProfile(view, record, world)}}};
    return defaultChoice(law, refreshed, world, id);
}

export function stepMoonbladeContest(record, engine, {startedAt, ticksPerMinute}) {
    if (record.result) return {record, engine};
    if (!Number.isSafeInteger(startedAt) || startedAt < 0 || !Number.isSafeInteger(ticksPerMinute) || ticksPerMinute < 1)
        throw Error('The Moonblade contest needs a world start minute and a tick rate.');
    const next = Math.min(...Object.values(record.entrants).filter(entrant => entrant.status === 'in')
        .map(entrant => entrant.working?.status === 'running' ? nextWorkingDeadline(entrant.working) : entrant.ready));
    const tick = Math.max(record.clock, Number.isFinite(next) ? next : record.clock);
    const minute = startedAt + Math.floor((tick - record.startedAt) / ticksPerMinute);
    const {engine: current, pending} = advanceEngineWorld(engine, minute);
    if (pending) return {record, engine: current, pending};
    const settled = stepContest(GU_CONTEST, record, current.rules, current.world, {choose, profile: liveProfile});
    return {record: settled.record, engine: {...current, world: settled.world}};
}
