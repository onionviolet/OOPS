import {attitudeAbility, attitudeGu, assessGuDemeanor, useAttitudeGu} from './gu_attitude.js';
import {livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';

const prefix = 'book.ri.keeper';
export const keeperAttitude = `${prefix}.attitude_trial`;
export const keeperAttitudeWorld = `${prefix}.world`;
export const attitudeMinutes = 30;
export const mentalEnergy = Object.freeze({id: `${keeperAttitude}.mental`, revision: 1, label: 'Mental energy',
    capacity: 2, output: 2, control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0});
const steward = `${prefix}.steward`;
const annex = `${prefix}.annex`;
const fact = `${keeperAttitude}.encounter`;
const specimen = `${keeperAttitude}.mask`;
const operations = ['borrow', 'return_loan', 'wear', 'remove', 'ask'];
const hasPin = record => record?.extensions?.some(pin => pin.id === keeperAttitude);
const done = (state, operation) => state.actors.player.completed[`${keeperAttitude}.${operation}`] ?? 0;

export function isKeeperAttitudeEffect(effect) {
    return effect.type === 'guAttitude' && effect.actor === 'player' && operations.includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

function readEncounter(state) {
    const raw = state.worlds[keeperAttitudeWorld]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid Attitude Gu encounter.');
    const {world, worn, response, approved} = JSON.parse(raw);
    validateGuClaims(world);
    const gu = livingGuClaim(world, attitudeGu);
    if (world.gu.length !== 1 || world.attempts.length || Object.keys(world.stocks).length ||
        gu?.id !== specimen || gu.kind !== attitudeGu || gu.rank !== 8 || ![steward, 'player'].includes(gu.holder) ||
        (worn !== null && (gu.holder !== 'player' || !Number.isSafeInteger(worn?.at) || worn.at < 0 ||
            worn.at > state.clock || worn.impression !== attitudeAbility.effect.magnitude)) ||
        (response !== null && !['reassured', 'wary'].includes(response)) ||
        typeof approved !== 'boolean' || response === 'reassured' && !approved) {
        throw Error('The Attitude Gu loan and the steward’s response disagree.');
    }
    return {world, worn, response, approved};
}

function impression(encounter, clock) {
    return encounter?.worn && clock < encounter.worn.at + attitudeMinutes ? encounter.worn.impression : 0;
}

function options(state, encounter) {
    const p = state.simulation.people[steward];
    const here = p?.life === 'alive' && p.location === annex;
    const held = encounter && livingGuClaim(encounter.world, attitudeGu).holder === 'player';
    const wearing = !!impression(encounter, state.clock);
    return {borrow: here && !held, return_loan: here && held, wear: held && !wearing,
        center: !state.simulation.energies?.player?.[mentalEnergy.id],
        remove: wearing, ask: here && !!encounter, collect: here && encounter?.approved && !done(state, 'collect')};
}

export function keeperAttitudeFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperAttitudeWorld) return {};
    return Object.fromEntries(Object.entries(options(state, readEncounter(state)))
        .map(([operation, allowed]) => [`${keeperAttitude}.can_${operation}`, !!allowed]));
}

export function validateKeeperAttitude(state, record) {
    const encounter = readEncounter(state);
    const mental = state.simulation.energies?.player?.[mentalEnergy.id];
    const borrows = done(state, 'borrow'), returns = done(state, 'return_loan');
    if (!!encounter !== (borrows > 0) || done(state, 'center') !== Number(!!mental) ||
        (mental && Object.keys(mentalEnergy).some(key => mental.policy[key] !== mentalEnergy[key])) ||
        (encounter || mental) && !hasPin(record) ||
        (encounter && (borrows - returns !== Number(livingGuClaim(encounter.world, attitudeGu).holder === 'player') ||
            (encounter.response !== null) !== (done(state, 'ask') > 0) ||
            (encounter.worn !== null || encounter.approved) && !(mental && done(state, 'wear')))) ||
        done(state, 'collect') > Number(!!encounter?.approved)) {
        throw Error('Attitude Gu needs its loan, mental reserve and response receipts.');
    }
}

export function keeperAttitudeView(state, record) {
    if (!hasPin(record)) return null;
    const encounter = readEncounter(state);
    const held = !!encounter && livingGuClaim(encounter.world, attitudeGu).holder === 'player';
    return {held, remaining: impression(encounter, state.clock) ? encounter.worn.at + attitudeMinutes - state.clock : 0,
        response: encounter?.response, approved: encounter?.approved, collected: done(state, 'collect') > 0,
        mental: state.simulation.energies?.player?.[mentalEnergy.id]?.reserve};
}

export function applyKeeperAttitudeEffect(state, effect, context) {
    const {operation} = effect;
    const encounter = readEncounter(state);
    if (!isKeeperAttitudeEffect(effect) || !hasPin(context.structuredNative) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperAttitudeWorld || state.simulation.people.player.location !== annex ||
        !options(state, encounter)[operation]) throw Error('The Attitude Gu or its trial is unavailable.');
    const next = encounter ?? {world: {gu: [{id: specimen, kind: attitudeGu, rank: 8,
        uniqueKey: attitudeGu, alive: true, holder: steward}], attempts: [], stocks: {}}, worn: null, response: null, approved: false};
    if (operation === 'borrow' || operation === 'return_loan') {
        const [from, to] = operation === 'borrow' ? [steward, 'player'] : ['player', steward];
        next.world = transferGuClaim(next.world, {key: attitudeGu, from, to});
        next.worn = null;
    } else if (operation === 'wear') {
        const gu = livingGuClaim(next.world, attitudeGu);
        const use = useAttitudeGu({gu: {...gu, fedThrough: state.clock}, operator: 'player', now: state.clock,
            mental: attitudeAbility.cost});
        const effect = use?.effects.find(row => row.kind === attitudeAbility.effect.kind);
        if (!effect) throw Error('Attitude Gu could not take on the intended demeanor.');
        next.worn = {at: state.clock, impression: effect.magnitude};
    } else if (operation === 'remove') {
        next.worn = null;
    } else {
        next.response = assessGuDemeanor({suspicion: 1, impression: impression(next, state.clock)});
        next.approved ||= next.response === 'reassured';
    }
    state.worlds[keeperAttitudeWorld].facts[fact] = JSON.stringify(next);
}
