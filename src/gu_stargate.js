import {resolveGuActivation} from './gu_activation.js';
import {isRainingAtMinute} from './weather_calendar.js';

export const keeperGate = 'book.ri.keeper.stargate';
export const keeperGateSky = 'book.ri.keeper.stargate_sky';
const annex = 'book.ri.keeper.annex';
const observatory = `${keeperGate}.observatory`;
const sites = {
    [annex]: {peer: observatory, dusk: 21 * 60, dawn: 4 * 60},
    [observatory]: {peer: annex, dusk: 20 * 60, dawn: 5 * 60},
};

export function keeperStargateSky(state, context) {
    const frame = context.nativeWeatherClock;
    if (!Number.isSafeInteger(frame?.minute) || !Number.isSafeInteger(frame.clock)) return null;
    const minute = frame.minute + state.clock - frame.clock;
    const time = ((minute % 1440) + 1440) % 1440;
    const clear = !isRainingAtMinute(minute);
    const light = site => clear && (time >= site.dusk || time < site.dawn);
    return {clear, annex: light(sites[annex]), observatory: light(sites[observatory])};
}

export function keeperStargateFacts(state, context) {
    if (context.actorId !== 'player' || state.actors.player?.worldId !== 'book.ri.keeper.world' ||
        !context.structuredNative?.extensions?.some(pin => pin.id === keeperGateSky)) return {};
    const sky = keeperStargateSky(state, context);
    return {[`${keeperGateSky}.ready`]: !!sky?.annex && !!sky?.observatory};
}

export function quoteKeeperStargate(from, method) {
    const destination = sites[from]?.peer;
    if (!destination || !['firefly', 'sky'].includes(method)) throw Error('The Stargate pair cannot connect.');
    const fuel = method === 'sky' ? 'natural-starlight' : 'starlight-firefly';
    const ability = {fuel, cost: 1, effect: {kind: 'travel', magnitude: 1}};
    const activation = resolveGuActivation({
        stages: [{gu: {id: `${from}.gate`, kind: 'stargate', rank: 5, fedThrough: 0}, operator: 'player', ability}],
        reserves: {player: {[fuel]: 1}}, day: 0,
    });
    if (!activation.effects.some(effect => effect.kind === 'travel')) throw Error('The Stargate pair cannot connect.');
    return {destination, spent: activation.activations[0].cost};
}
