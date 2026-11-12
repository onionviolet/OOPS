import {moonlightBlade} from './gu_ability_profiles.js';
import {borrowGuMilestone, invokeProjectedGu, recordGuMilestone} from './gu_projection.js';

const prefix = 'book.ri.keeper';
export const keeperTime = `${prefix}.past_moonblade`;
export const keeperTimeWorld = `${prefix}.world`;
const moon = `${prefix}.moon`;
const practice = `${prefix}.moonblade`;
const markKey = `${keeperTime}.cast_at`;
const openedKey = `${keeperTime}.opened_at`;
export const keeperEchoMinutes = 30;

export function isKeeperTimeEffect(effect) {
    return effect.type === 'guTime' && effect.actor === 'player' && ['open', 'cast'].includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

function hasPin(record, id) {
    return record?.extensions?.some(pin => pin.id === id);
}

function readEcho(state) {
    const facts = state.worlds[keeperTimeWorld]?.facts;
    const castAt = facts?.[markKey], openedAt = facts?.[openedKey];
    if (castAt === undefined && openedAt === undefined) return null;
    if (!Number.isSafeInteger(castAt) || castAt < 0 || !Number.isSafeInteger(openedAt) ||
        castAt >= openedAt || openedAt > state.clock) throw Error('The Moonblade seal’s times disagree.');
    return {castAt, openedAt};
}

function completed(state, command) {
    return state.actors.player.completed[command] ?? 0;
}

function witnessedCast(state) {
    const receipt = state.simulation.knowledge.player?.[`${practice}.practice`];
    if (completed(state, `${practice}.cut_target`) && !state.actors.player.facts[`${practice}.target_ready`] &&
        receipt?.at < state.clock) return receipt.at;
    return null;
}

export function validateKeeperTime(state, record) {
    const echo = readEcho(state);
    const opened = completed(state, `${keeperTime}.open`);
    const cast = completed(state, `${keeperTime}.cast`);
    if (!echo && !opened && !cast) return;
    if (!echo || echo.castAt < record.initializedAt || opened !== 1 || cast > 1 ||
        !hasPin(record, keeperTime) || !hasPin(record, practice) || !completed(state, `${practice}.cut_target`)) {
        throw Error('The Moonblade seal needs its practice and preparation receipts.');
    }
}

export function keeperTimeFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperTimeWorld) return {};
    const echo = readEcho(state);
    return {
        [`${keeperTime}.witnessed`]: witnessedCast(state) !== null,
        [`${keeperTime}.ready`]: !!echo && state.clock - echo.openedAt < keeperEchoMinutes &&
            !completed(state, `${keeperTime}.cast`),
    };
}

export function applyKeeperTimeEffect(state, effect, context) {
    if (!isKeeperTimeEffect(effect) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperTimeWorld ||
        state.simulation.people.player.location !== `${prefix}.annex` ||
        !hasPin(context.structuredNative, keeperTime) || !hasPin(context.structuredNative, practice)) {
        throw Error('Prepare the Moonblade seal at the Gu house.');
    }
    const facts = state.worlds[keeperTimeWorld].facts;
    const echo = readEcho(state);
    if (effect.operation === 'open') {
        const castAt = witnessedCast(state);
        if (echo || castAt === null) throw Error('The seal needs an earlier Moonblade cast.');
        facts[markKey] = castAt;
        facts[openedKey] = state.clock;
        return;
    }
    if (!echo || completed(state, `${keeperTime}.cast`) || !state.actors.player.facts[`${practice}.target_ready`]) {
        throw Error('Prepare a fresh straw target and an unused seal.');
    }
    // The successful practice command establishes the ready rank-one specimen
    // and the four units that powered that earlier cast.
    const milestone = recordGuMilestone({
        id: keeperTime, operator: 'player', at: echo.castAt, ability: moonlightBlade,
        gu: {id: moon, kind: 'moonlight', rank: 1, holder: 'player', alive: true, fedThrough: echo.castAt},
        reserves: {primeval: moonlightBlade.cost},
    });
    const projection = borrowGuMilestone({milestone, anchor: keeperTime, operator: 'player',
        now: echo.openedAt, duration: keeperEchoMinutes, rankLimit: 1});
    const result = invokeProjectedGu({projection, anchor: keeperTime, operator: 'player', now: state.clock, kind: 'moonlight'});
    if (result.outcome !== 'complete' || !result.effects.some(row => row.kind === 'damage' && row.magnitude > 0)) {
        throw Error('The borrowed Moonblade failed to reach the straw target.');
    }
    state.actors.player.facts[`${practice}.target_ready`] = false;
}
