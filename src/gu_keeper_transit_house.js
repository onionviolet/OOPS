import {fitGuHouse, quoteGuHouse, settleGuHouse, transitHouseBlueprint as blueprint} from './gu_house_assembly.js';
import {fixedTravelAnnex, fixedTravelHill, quoteKeeperFixedTravel} from './gu_keeper_immortal_travel.js';
import {keeperFixedSpecimen} from './gu_keeper_fixed_claim.js';
import {validateGuClaims} from './gu_world_claims.js';

export const keeperTransitHouse = 'book.ri.keeper.transit_house';
export const transitHouseMinutes = blueprint.minutes;
export const transitHouseActions = ['open_frame', 'fit_anchor', 'fit_glide', 'finish_frame', 'rush_frame', 'unseat',
    'anchor_cross', 'glide_cross', 'freight_cross'];
const supportIds = ['anchor', 'glide'];
export const transitHouseCost = Object.freeze(Object.fromEntries(Object.entries(blueprint.supports).map(([kind, {ability}]) =>
    [kind, ability.cost + blueprint.ability.cost * ability.modifier.factor])));
const done = (state, operation) => state.actors.player.completed[`${keeperTransitHouse}.${operation}`] ?? 0;
const boundCore = (world, assembly) => world?.gu.find(gu => gu.id === assembly?.core);
const boundSupport = (house, assembly) => house?.supports.find(gu => gu.id === assembly?.support);

export function transitHouseOptions(state, world) {
    const house = world?.house;
    const assembly = house?.assembly;
    const core = keeperFixedSpecimen(world);
    const bound = boundCore(world, assembly);
    const support = boundSupport(house, assembly);
    const setting = assembly?.phase === 'setting';
    const due = setting && state.clock >= assembly.fittedAt + transitHouseMinutes;
    const canFit = !!house && !setting && core?.holder === 'player' && core.rank === blueprint.rank && !core.injured;
    const ready = bound?.alive && support?.alive && setting;
    const landing = !!bound && quoteKeeperFixedTravel(state, bound, fixedTravelHill).spent > 0;
    const canCross = (brace, loaded = false) => landing && support?.kind === brace && !!quoteGuHouse(blueprint, assembly, {
        core: bound, support, clock: state.clock, operator: 'player', reserve: transitHouseCost[brace], loaded,
    });
    return {open_frame: !!world && !house,
        fit_anchor: canFit && house.supports.find(gu => gu.kind === 'anchor').alive,
        fit_glide: canFit && house.supports.find(gu => gu.kind === 'glide').alive,
        finish_frame: ready && due, rush_frame: ready && !due, unseat: !!assembly,
        anchor_cross: canCross('anchor'), glide_cross: canCross('glide'), freight_cross: canCross('anchor', true)};
}

export function validateTransitHouse(state, record, world) {
    const house = world?.house;
    const actions = transitHouseActions.some(op => done(state, op));
    if (!house && !actions) return;
    const assembly = house?.assembly;
    const support = boundSupport(house, assembly);
    const fits = done(state, 'fit_anchor') + done(state, 'fit_glide');
    if (!house || !record?.extensions?.some(pin => pin.id === keeperTransitHouse) || done(state, 'open_frame') !== 1 ||
        !Array.isArray(house.supports) || house.supports.length !== supportIds.length ||
        house.supports.some((gu, index) => gu.id !== `frame-${supportIds[index]}` || gu.kind !== supportIds[index] ||
            gu.uniqueKey !== `transit-${gu.kind}-reed` || gu.holder !== 'player' || gu.rank !== 6 ||
            typeof gu.alive !== 'boolean' || (!gu.alive && gu.fate !== 'destroyed')) ||
        house.supports.filter(gu => !gu.alive).length !== done(state, 'rush_frame') ||
        done(state, 'finish_frame') + done(state, 'rush_frame') > fits ||
        (assembly && (!boundCore(world, assembly) || !support || !fits ||
            !Number.isSafeInteger(assembly.fittedAt) || assembly.fittedAt < record.initializedAt || assembly.fittedAt > state.clock ||
            !['setting', 'damaged', 'ready'].includes(assembly.phase) || (assembly.phase === 'damaged') === support.alive))) {
        throw Error('The Gu House needs its matching component and assembly records.');
    }
    validateGuClaims({...world, gu: [...world.gu, ...house.supports]});
}

export function transitHouseView(state, world) {
    const house = world?.house;
    if (!house) return null;
    const assembly = house.assembly;
    const core = boundCore(world, assembly);
    const support = boundSupport(house, assembly);
    return {phase: assembly ? core.alive ? core.injured ? 'injured' : assembly.phase : 'core-lost' : 'empty',
        rank: core?.rank, brace: support?.kind, wait: assembly?.phase === 'setting' ? Math.max(0, assembly.fittedAt + transitHouseMinutes - state.clock) : 0,
        lost: house.supports.filter(gu => !gu.alive).map(gu => gu.kind), delivered: done(state, 'freight_cross')};
}

export function applyTransitHouse(state, world, operation) {
    const clock = state.clock;
    const house = world.house;
    if (operation === 'open_frame') {
        return {...world, house: {assembly: null, supports: supportIds.map(kind =>
            ({id: `frame-${kind}`, kind, uniqueKey: `transit-${kind}-reed`, holder: 'player', rank: 6, alive: true}))}};
    }
    const {assembly} = house;
    if (operation.endsWith('_cross')) return world;
    let next = {...house};
    if (operation === 'unseat') next.assembly = null;
    else if (operation.startsWith('fit_')) {
        const brace = operation.slice(4);
        next.assembly = fitGuHouse(blueprint, keeperFixedSpecimen(world), house.supports.find(gu => gu.kind === brace), clock);
    } else {
        const support = boundSupport(house, assembly);
        const settled = settleGuHouse(blueprint, assembly, boundCore(world, assembly), support, clock, operation === 'rush_frame');
        next = {assembly: settled.assembly, supports: house.supports.map(gu => gu.id === support.id ? settled.support : gu)};
    }
    return {...world, house: next};
}
