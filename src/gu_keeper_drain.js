import {resolveGuActivation} from './gu_activation.js';
import {applyEnergyEffect} from './energy_resources.js';
import {keeperMoonbladeStages} from './gu_keeper_move_trial.js';
import {detonatePotatoBuyer, potatoBuyerPlot, potatoMarketStore} from './gu_keeper_potato_market.js';
import {impactOfRollingLoad, seversTether, tetherFailureDelay} from './rolling_impact.js';

const prefix = 'book.ri.keeper';
export const keeperDrain = `${prefix}.drain_rig`;
export const keeperDrainWear = `${keeperDrain}_wear`;
export const drainOperations = ['rig_light', 'rig_heavy', 'cut_tether'];
export const wearOperations = ['rig_worn_light', 'rig_worn_heavy'];
const aperture = `${prefix}.primeval`;
const track = {start: 'head of the track', end: potatoBuyerPlot.id};
const logs = {light: 1, heavy: 2};
const done = (state, op, pack = keeperDrain) => state.actors.player.completed[`${pack}.${op}`] ?? 0;
export const drainPin = record => record?.extensions?.some(pin => pin.id === keeperDrain);
export const drainWearPin = record => record?.extensions?.some(pin => pin.id === keeperDrainWear);
const bladeFor = state => keeperMoonbladeStages(state).find(stage => stage.gu.kind === 'moonlight' && stage.gu.alive);
const reserveFor = state => state.simulation.energies.player[aperture].reserve;

export function drainOptions(state, row) {
    const ready = !!row && row.rig?.phase !== 'rolling';
    const blade = ready && row.rig?.phase === 'tethered' && bladeFor(state);
    return {rig_light: ready, rig_heavy: ready, rig_worn_light: ready, rig_worn_heavy: ready,
        cut_tether: !!blade && reserveFor(state) >= blade.ability.cost,
        mill: !!row?.buyerCleared, grain: !!row?.buyerCleared && !done(state, 'grain')};
}

export function validateKeeperDrain(state, record, row) {
    const rig = row?.rig;
    const worn = wearOperations.reduce((total, op) => total + done(state, op, keeperDrainWear), 0);
    const rigged = done(state, 'rig_light') + done(state, 'rig_heavy') + worn;
    const cuts = done(state, 'cut_tether');
    const tests = row?.rollTests ?? 0;
    const snapped = row?.wearReleases ?? 0;
    const releaseCount = cuts + snapped;
    if (!!rig !== (rigged > 0) || rigged && !drainPin(record) || worn && !drainWearPin(record) || releaseCount > rigged ||
        !Number.isSafeInteger(snapped) || snapped < 0 || snapped > worn ||
        !Number.isSafeInteger(tests) || tests < 0 || tests > releaseCount ||
        rig && (!Object.hasOwn(logs, rig.size) || !['tethered', 'rolling', 'landed'].includes(rig.phase) ||
            ![undefined, true].includes(rig.worn) || ![undefined, 'wear'].includes(rig.release) ||
            !done(state, rig.worn ? `rig_worn_${rig.size}` : `rig_${rig.size}`, rig.worn ? keeperDrainWear : keeperDrain) ||
            (rig.release === 'wear' && (!rig.worn || !snapped || rig.phase === 'tethered')) ||
            rig.phase === 'tethered' && (rig.due !== undefined || rig.impact !== undefined ||
                (rig.worn && rig.size === 'heavy' ? !Number.isSafeInteger(rig.failAt) || rig.failAt <= state.clock || rig.failAt > state.clock + 2 : rig.failAt !== undefined)) ||
            rig.phase !== 'tethered' && rig.failAt !== undefined ||
            rig.phase === 'rolling' && (!releaseCount || rig.due !== state.clock + 1 || rig.impact !== undefined) ||
            rig.phase === 'landed' && (!releaseCount || !Number.isSafeInteger(rig.due) || rig.due > state.clock || rig.due < 1 ||
                rig.impact?.at !== track.end || rig.impact?.vibration !== logs[rig.size] || typeof rig.triggered !== 'boolean')) ||
        done(state, 'mill') && (!row?.buyerCleared || !drainPin(record)) ||
        done(state, 'grain') && (!row?.buyerCleared || !drainPin(record)) ||
        state.simulation.people.player.location === potatoMarketStore && !row?.buyerCleared) {
        throw Error('The rolling rig needs its construction, cut and impact receipts.');
    }
}

export function applyDrainOperation(state, row, op, registry) {
    if (!drainOptions(state, row)[op]) throw Error('Set up a rig and bring a ready blade.');
    if (op !== 'cut_tether') {
        const worn = wearOperations.includes(op);
        const size = op.split('_').at(-1);
        const delay = worn ? tetherFailureDelay({load: logs[size], capacity: 1, strainBudget: 2}) : null;
        return {...row, rig: {size, phase: 'tethered', ...(worn ? {worn: true} : {}),
            ...(delay !== null ? {failAt: state.clock + delay} : {})}};
    }
    const before = reserveFor(state);
    const result = resolveGuActivation({stages: [bladeFor(state)], reserves: {player: {primeval: before}}, day: state.clock});
    if (result.outcome !== 'complete') throw Error('The blade could not reach the cord.');
    const spent = before - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId: aperture, operation: 'use', output: 1, control: 1}, registry);
    }
    const cut = seversTether(result.effects, 1);
    return cut ? {...row, rig: releaseRig(row.rig, state.clock)} : row;
}

function releaseRig({failAt, ...rig}, at) {
    return {...rig, phase: 'rolling', due: at + 1};
}

export function drainWake(row) {
    return row?.rig?.phase === 'rolling' ? row.rig.due : row?.rig?.failAt;
}

export function settleDrainArrival(row, clock) {
    if (row?.rig?.phase === 'tethered' && row.rig.failAt <= clock) {
        return {...row, wearReleases: (row.wearReleases ?? 0) + 1,
            rig: {...releaseRig(row.rig, row.rig.failAt), release: 'wear'}};
    }
    if (row?.rig?.phase !== 'rolling' || row.rig.due > clock) return null;
    const rig = row.rig;
    const impact = impactOfRollingLoad({mass: logs[rig.size], drop: 1, loss: 0, track});
    const blast = detonatePotatoBuyer(row, rig.due, impact.at === track.end ? impact.vibration : 0);
    return {...blast.row, rollTests: (row.rollTests ?? 0) + Number(!!blast.spent),
        rig: {...rig, phase: 'landed', impact, triggered: !!blast.spent}};
}
