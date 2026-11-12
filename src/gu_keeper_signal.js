import {resolveGuActivation} from './gu_activation.js';
import {moonlightBlade} from './gu_ability_profiles.js';
import {heldMoonlightStockStage, moonlightStockMoveIds} from './gu_moonlight_stock.js';
import {borrowGuMilestone, invokeProjectedGu, recordGuMilestone} from './gu_projection.js';
import {readGuSignal} from './gu_signal.js';
import {applyEnergyEffect} from './energy_resources.js';

const prefix = 'book.ri.keeper';
export const keeperSignal = `${prefix}.signal_trial`;
export const keeperSignalBay = `${keeperSignal}.light_room`;
export const keeperAuthorityBay = `${keeperSignal}.keeper_room`;
export const keeperSignalOps = ['witness', 'record', 'open_echo', 'echo', 'replay', 'present'];
const world = `${prefix}.world`;
const key = `${keeperSignal}.notes`;
const energyId = `${prefix}.primeval`;
const duration = 30;
const reader = {pattern: 'moonblade-light', minForce: 1};
const methods = {echo: 'past', replay: 'recorded', present: 'live'};
const pin = record => record?.extensions?.some(row => row.id === keeperSignal);
const done = (state, op) => state.actors.player.completed[`${keeperSignal}.${op}`] ?? 0;
const reserve = state => state.simulation.energies.player[energyId].reserve;
const empty = () => ({specimen: null, witness: null, recorded: null, openedAt: null, signal: false, last: null});
const authority = specimen => ({...reader, authority: {operator: 'player', specimen}});
const currentGu = held => held && {specimen: held.gu.id, operator: held.operator};
const validForce = force => [1, 1.25, 1.5].includes(force);

function read(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid light reader notes.');
    const notes = JSON.parse(raw);
    const {specimen, witness, recorded, openedAt, signal, last} = notes;
    const validTime = time => Number.isSafeInteger(time) && time >= 0 && time <= state.clock;
    if (!moonlightStockMoveIds.includes(specimen) || (!witness && !recorded) ||
        witness !== null && (!validTime(witness?.at) || !validForce(witness.force)) ||
        recorded !== null && !validForce(recorded) ||
        openedAt !== null && (!witness || !validTime(openedAt) || openedAt <= witness.at) ||
        typeof signal !== 'boolean' || last !== null && (!last || !Object.hasOwn(methods, last.op) || !signal ||
            !moonlightStockMoveIds.includes(last.specimen) ||
            (last.op !== 'present' && last.specimen !== specimen) ||
            last.authorized !== (last.op === 'present' && last.specimen === specimen))) {
        throw Error('The light reader notes and signals disagree.');
    }
    return notes;
}

export function validateKeeperSignal(state, record) {
    const notes = read(state);
    const location = state.simulation.people.player.location;
    if (!!notes !== !!(done(state, 'witness') || done(state, 'record')) || notes && !pin(record) ||
        notes && (!!notes.witness !== !!done(state, 'witness') || !!notes.recorded !== !!done(state, 'record') ||
            (notes.openedAt !== null) !== !!done(state, 'open_echo') || !!notes.signal !== !!Object.keys(methods).some(op => done(state, op)) ||
            notes.last && !done(state, notes.last.op)) ||
        location === keeperSignalBay && !notes?.signal || location === keeperAuthorityBay && !notes?.last?.authorized) {
        throw Error('The light readers need their original signals and opening receipts.');
    }
}

function options(state, notes, held) {
    const funded = !!held && reserve(state) >= moonlightBlade.cost;
    const matched = funded && (!notes.specimen || notes.specimen === held.gu.id);
    const reachable = notes.openedAt !== null && state.clock - notes.openedAt < duration;
    return {witness: matched && !notes.witness, record: matched && !notes.recorded,
        open_echo: !!notes.witness && notes.witness.at < state.clock && !reachable && !done(state, 'echo'),
        echo: reachable && !done(state, 'echo'), replay: !!notes.recorded, present: funded && !!notes.specimen,
        enter_light: notes.signal, enter_keeper: !!notes.last?.authorized && held?.gu.id === notes.specimen};
}

export function keeperSignalFacts(state, record) {
    if (!pin(record)) return {};
    const flags = options(state, read(state) ?? empty(), heldMoonlightStockStage(state));
    return Object.fromEntries(Object.entries(flags).map(([op, value]) => [`${keeperSignal}.${op}`, value]));
}

export function keeperSignalView(state, record) {
    if (!pin(record)) return null;
    const notes = read(state);
    if (!notes) return null;
    return {last: notes.last, recorded: !!notes.recorded, witnessed: !!notes.witness, signal: notes.signal,
        remaining: notes.openedAt === null || done(state, 'echo') ? null : Math.max(0, notes.openedAt + duration - state.clock),
        specimen: notes.specimen === moonlightStockMoveIds[0] ? 'First tray Gu' : 'Second tray Gu'};
}

function castLive(state, held, registry) {
    const before = reserve(state);
    const result = resolveGuActivation({stages: [held], reserves: {player: {primeval: before}}, day: state.clock});
    if (result.outcome !== 'complete') throw Error('The tray Gu could not cast the light.');
    const spent = before - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
    return result.effects[0].magnitude;
}

export function applyKeeperSignal(state, effect, context, registry) {
    const op = effect.operation.replace(/^signal_/, '');
    if (!pin(context.structuredNative) || context.actorId !== 'player' || state.actors.player.worldId !== world ||
        state.simulation.people.player.location !== `${prefix}.annex`) throw Error('Work with the light readers at the Gu house.');
    const notes = read(state) ?? empty();
    const held = heldMoonlightStockStage(state);
    if (!options(state, notes, held)[op]) throw Error('The light reader needs a ready signal.');
    if (op === 'witness' || op === 'record') {
        const force = castLive(state, held, registry);
        notes.specimen = held.gu.id;
        if (op === 'witness') notes.witness = {at: state.clock, force};
        else notes.recorded = force;
    } else if (op === 'open_echo') {
        notes.openedAt = state.clock;
    } else {
        let force = notes.recorded;
        if (op === 'echo') {
            const {at, force: witnessedForce} = notes.witness;
            const milestone = recordGuMilestone({id: keeperSignal, operator: 'player', at, ability: moonlightBlade,
                gu: {id: notes.specimen, holder: 'player', kind: 'moonlight', alive: true, rank: 1, fedThrough: at,
                    traits: {bladeForce: witnessedForce - moonlightBlade.effect.magnitude}},
                reserves: {primeval: moonlightBlade.cost}});
            const projection = borrowGuMilestone({milestone, anchor: keeperSignal, operator: 'player',
                now: notes.openedAt, duration, rankLimit: 1});
            const result = invokeProjectedGu({projection, anchor: keeperSignal, operator: 'player', now: state.clock, kind: 'moonlight'});
            force = result.effects[0].magnitude;
        } else if (op === 'present') {
            force = castLive(state, held, registry);
        }
        const specimen = op === 'present' ? held.gu.id : notes.specimen;
        const emission = {method: methods[op], specimen, pattern: reader.pattern, force};
        notes.signal ||= readGuSignal({reader, emission}) === 'accepted';
        const authorized = readGuSignal({reader: authority(notes.specimen), emission, current: currentGu(held)}) === 'accepted';
        notes.last = {op, specimen, authorized};
    }
    state.worlds[world].facts[key] = JSON.stringify(notes);
}
