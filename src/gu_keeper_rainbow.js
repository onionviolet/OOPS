import {beginSustainedGu, renewSustainedGu} from './gu_sustain.js';
import {lightSourceSupport} from './gu_ability_profiles.js';

export const keeperRainbow = 'book.ri.keeper.rainbow_light';
export const keeperRainbowWorld = 'book.ri.keeper.world';
export const rainbowInterval = 10;
export const rainbowFlightMinutes = 16;
export const rainbowDose = 12;
const factKey = `${keeperRainbow}.reserve`;
const coreId = `${keeperRainbow}.loan`;
const supportId = 'book.ri.keeper.move_trial.light_source';
const pool = 'white-silver';
const supply = {pool, family: 'primeval', rank: 3, source: 'stored'};
const rainbowAbility = {fuel: 'primeval', cost: 6, path: 'light'};
const effect = {kind: 'movement', method: 'rainbow-light'};
const pins = record => record?.extensions?.some(pin => pin.id === keeperRainbow);

function hasCore(state) {
    return state.actors.player.facts[coreId] === true;
}

function hasSupport(state) {
    return state.actors.player.facts[supportId] === true;
}

function stages(supported, clock, coreHeld = true, supportHeld = true) {
    const stage = (id, kind, rank, ability, held) => ({
        gu: {id, kind, rank, holder: held ? 'player' : 'steward', fedThrough: clock},
        operator: 'player', ability, supply,
    });
    const core = stage(coreId, 'rainbow-light', 3, rainbowAbility, coreHeld);
    return supported ? [stage(supportId, 'light-source', 1, lightSourceSupport, supportHeld), core] : [core];
}

const reserves = amount => ({player: {[pool]: amount}});
const empty = () => ({reserve: 0, active: null, reason: null, spent: 0});

export function quoteRainbow(supported) {
    const request = {stages: stages(supported, 0), reserves: reserves(rainbowDose),
        day: 0, now: 0, interval: rainbowInterval, effect};
    return rainbowDose - beginSustainedGu(request).remaining.player[pool];
}

function read(state) {
    const raw = state.worlds[keeperRainbowWorld]?.facts?.[factKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 512) throw Error('Invalid Rainbow Light record.');
    const row = JSON.parse(raw);
    if (!Number.isSafeInteger(row.reserve) || row.reserve < 0 || !Number.isSafeInteger(row.spent) || row.spent < 0 ||
        ![null, 'stopped', 'Gu unavailable', 'needs more essence'].includes(row.reason) ||
        (row.active !== null && (!row.active || typeof row.active.supported !== 'boolean' || row.reason !== null ||
            !Number.isSafeInteger(row.active.due) || row.active.due < state.clock || row.active.due - state.clock > rainbowInterval))) {
        throw Error('The Rainbow Light clock and reserve disagree.');
    }
    return row;
}

export function validateKeeperRainbow(state, record) {
    const row = read(state);
    const completed = state.actors.player.completed;
    const bought = completed[`${keeperRainbow}.buy`] ?? 0;
    const starts = (completed[`${keeperRainbow}.start_solo`] ?? 0) + (completed[`${keeperRainbow}.start_supported`] ?? 0);
    if (!!row !== (bought > 0) || (row && (!pins(record) || row.reserve + row.spent !== bought * rainbowDose ||
        (starts > 0) !== (row.spent > 0) || (row.active && !hasCore(state))))) {
        throw Error('Rainbow Light needs its matching loan, fuel and movement receipts.');
    }
}

export function keeperRainbowFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperRainbowWorld) return {};
    const row = read(state) ?? empty();
    return {
        [`${keeperRainbow}.active`]: !!row.active,
        [`${keeperRainbow}.loaned`]: hasCore(state),
        [`${keeperRainbow}.supported`]: hasSupport(state),
        [`${keeperRainbow}.reserve`]: row.reserve,
    };
}

export function keeperRainbowView(state, record) {
    if (!pins(record)) return null;
    const row = read(state) ?? empty();
    return {...row, remaining: row.active ? row.active.due - state.clock : null};
}

export function isKeeperRainbowEffect(effect) {
    return effect.type === 'guRainbow' && effect.actor === 'player' &&
        ['buy', 'start_solo', 'start_supported', 'stop'].includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

export function applyKeeperRainbowEffect(state, effectRow, context) {
    if (!isKeeperRainbowEffect(effectRow) || context.actorId !== 'player' || !pins(context.structuredNative) ||
        state.actors.player?.worldId !== keeperRainbowWorld) throw Error('Use the Rainbow Light trial here.');
    const row = read(state) ?? empty();
    const {operation} = effectRow;
    if (operation === 'buy') {
        if (!Number.isSafeInteger(row.reserve + rainbowDose)) throw Error('The reserve is full.');
        row.reserve += rainbowDose;
    } else if (operation === 'stop') {
        if (!row.active) throw Error('No Rainbow Light move is running.');
        row.active = null;
        row.reason = 'stopped';
    } else {
        const supported = operation === 'start_supported';
        if (row.active || !hasCore(state) || supported && !hasSupport(state)) throw Error('The bound Gu are unavailable.');
        const result = beginSustainedGu({stages: stages(supported, state.clock), reserves: reserves(row.reserve),
            day: state.clock, now: state.clock, interval: rainbowInterval, effect});
        if (!result.session) throw Error('There is not enough white-silver essence to start.');
        const remaining = result.remaining.player[pool];
        row.spent += row.reserve - remaining;
        row.reserve = remaining;
        row.active = {supported, due: result.session.due};
        row.reason = null;
    }
    state.worlds[keeperRainbowWorld].facts[factKey] = JSON.stringify(row);
}

export function nextKeeperRainbowBoundary(state) {
    return read(state)?.active?.due ?? Infinity;
}

export function advanceKeeperRainbow(state) {
    const row = read(state);
    if (!row?.active || row.active.due !== state.clock) return 0;
    const {supported, due} = row.active;
    const prepared = beginSustainedGu({stages: stages(supported, due - rainbowInterval),
        reserves: reserves(rainbowDose), day: due - rainbowInterval, now: due - rainbowInterval,
        interval: rainbowInterval, effect});
    const gu = stages(supported, due, hasCore(state) && state.simulation.people.player.life === 'alive', hasSupport(state)).map(row => row.gu);
    const result = renewSustainedGu({session: prepared.session, gu, reserves: reserves(row.reserve), day: due, now: due});
    const remaining = result.remaining.player[pool];
    row.spent += row.reserve - remaining;
    row.reserve = remaining;
    row.active = result.session ? {supported, due: result.session.due} : null;
    row.reason = result.reason ?? null;
    state.worlds[keeperRainbowWorld].facts[factKey] = JSON.stringify(row);
    return 1;
}
