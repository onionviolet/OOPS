import {fightCharge, fightKind, tryFightingSpirit} from './gu_fighting_spirit.js';
import {applyEnergyEffect} from './energy_resources.js';
import {livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';

const prefix = 'book.ri.keeper';
export const keeperSpirit = `${prefix}.fighting_spirit`;
export const keeperSpiritWorld = `${prefix}.world`;
const fact = `${keeperSpirit}.encounter`;
const core = `${keeperSpirit}.fight`;
const steward = `${prefix}.steward`;
const annex = `${prefix}.annex`;
const aperture = `${prefix}.primeval`;
const kinds = ['thought-support', 'will-support'];
const modes = ['abort', 'rush', 'steady'];
const operations = ['borrow', 'return_loan', 'buy_supports', ...modes];
const policy = (aspect, label) => ({id: `${keeperSpirit}.${aspect}`, revision: 1, label, capacity: 2,
    output: 2, control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0});
export const spiritHealth = {mind: policy('mind', 'Mental steadiness'), soul: policy('soul', 'Soul steadiness')};
const hasPin = record => record?.extensions?.some(pin => pin.id === keeperSpirit);
const done = (state, operation) => state.actors.player.completed[`${keeperSpirit}.${operation}`] ?? 0;

export function isKeeperSpiritEffect(effect) {
    return effect.type === 'guSpirit' && effect.actor === 'player' && operations.includes(effect.operation) &&
        Object.keys(effect).every(field => ['type', 'actor', 'operation'].includes(field));
}

function readTrial(state) {
    const raw = state.worlds[keeperSpiritWorld]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Fighting Spirit record.');
    const {world, last} = JSON.parse(raw);
    validateGuClaims(world);
    const fight = livingGuClaim(world, fightKind);
    if (world.attempts.length || Object.keys(world.stocks).length ||
        fight?.id !== core || fight.kind !== fightKind || fight.rank !== 7 || ![steward, 'player'].includes(fight.holder) ||
        world.gu.some(gu => gu.id !== core && (!kinds.includes(gu.kind) || gu.rank !== 1 || gu.holder !== 'player' ||
            gu.uniqueKey !== undefined || (!gu.alive && gu.fate !== 'destroyed'))) ||
        (last !== null && !modes.includes(last))) throw Error('Fight Gu and its supports disagree.');
    return {world, last};
}

const reserve = (state, id) => state.simulation.energies.player?.[id]?.reserve;
function options(state, trial) {
    const p = state.simulation.people[steward];
    const here = p?.life === 'alive' && p.location === annex;
    const held = trial && livingGuClaim(trial.world, fightKind).holder === 'player';
    const supports = trial?.world.gu.filter(gu => gu.id !== core && gu.alive) ?? [];
    const steady = Object.values(spiritHealth).every(row => reserve(state, row.id) === row.capacity);
    return {borrow: here && !held, return_loan: here && held, buy_supports: here && !!trial && supports.length === 0,
        prepare: reserve(state, spiritHealth.mind.id) === undefined,
        attempt: held && steady && supports.length === 2 && reserve(state, aperture) >= 2,
        supplies: done(state, 'steady') > 0 && !done(state, 'supplies')};
}

export function keeperSpiritFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperSpiritWorld) return {};
    return Object.fromEntries(Object.entries(options(state, readTrial(state)))
        .map(([operation, allowed]) => [`${keeperSpirit}.can_${operation}`, !!allowed]));
}

export function validateKeeperSpirit(state, record) {
    const trial = readTrial(state);
    const policies = Object.values(spiritHealth);
    const pools = policies.map(row => state.simulation.energies.player?.[row.id]);
    if (!!trial !== (done(state, 'borrow') > 0) || pools.some((pool, index) => Number(!!pool) !== done(state, 'prepare') ||
        pool && Object.keys(policies[index]).some(key => pool.policy[key] !== policies[index][key])) ||
        (trial || pools.some(Boolean)) && !hasPin(record) ||
        (trial && (done(state, 'borrow') - done(state, 'return_loan') !== Number(livingGuClaim(trial.world, fightKind).holder === 'player') ||
            trial.world.gu.length !== 1 + 2 * done(state, 'buy_supports') ||
            trial.world.gu.filter(gu => !gu.alive).length !== 2 * done(state, 'rush') ||
            (trial.last === null) !== modes.every(mode => !done(state, mode)) || trial.last && !done(state, trial.last))) ||
        done(state, 'supplies') > Number(done(state, 'steady') > 0)) throw Error('The Fighting Spirit trial needs its exact receipts.');
}

export function keeperSpiritView(state, record) {
    if (!hasPin(record)) return null;
    const trial = readTrial(state);
    return {held: !!trial && livingGuClaim(trial.world, fightKind).holder === 'player', last: trial?.last,
        alive: trial?.world.gu.filter(gu => gu.id !== core && gu.alive).length ?? 0,
        mind: reserve(state, spiritHealth.mind.id), soul: reserve(state, spiritHealth.soul.id)};
}

export function applyKeeperSpiritEffect(state, effect, context, registry) {
    const {operation} = effect;
    const trial = readTrial(state);
    const option = modes.includes(operation) ? 'attempt' : operation;
    if (!isKeeperSpiritEffect(effect) || !hasPin(context.structuredNative) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperSpiritWorld || state.simulation.people.player.location !== annex ||
        !options(state, trial)[option]) throw Error('The Fighting Spirit rehearsal is unavailable.');
    const next = trial ?? {world: {gu: [{id: core, kind: fightKind, rank: 7, uniqueKey: fightKind,
        holder: steward, alive: true}], attempts: [], stocks: {}}, last: null};
    if (operation === 'borrow' || operation === 'return_loan') {
        const [from, to] = operation === 'borrow' ? [steward, 'player'] : ['player', steward];
        next.world = transferGuClaim(next.world, {key: fightKind, from, to});
    } else if (operation === 'buy_supports') {
        const batch = done(state, 'buy_supports') + 1;
        for (const kind of kinds) next.world.gu.push({id: `${kind}-${batch}`, kind, rank: 1, holder: 'player', alive: true});
    } else {
        const before = reserve(state, aperture);
        const result = tryFightingSpirit({mode: operation, gu: next.world.gu, operator: 'player',
            now: state.clock, primeval: before, immortal: operation === 'abort' ? 0 : fightCharge});
        for (let used = result.remaining.player.primeval; used < before; used++) {
            applyEnergyEffect(state, 'player', {energyId: aperture, operation: 'use', output: 1, control: 1}, registry);
        }
        for (const effect of result.backlash ?? []) {
            if (effect.kind === 'destroy-gu') {
                Object.assign(next.world.gu.find(gu => gu.id === effect.target), {alive: false, fate: 'destroyed'});
            } else if (effect.kind === 'injure-operator') {
                applyEnergyEffect(state, effect.target, {energyId: spiritHealth[effect.aspect].id,
                    operation: 'use', output: effect.amount, control: 1}, registry);
            }
        }
        if (operation === 'steady' && !result.effects.some(effect => effect.kind === 'raise-fighting-spirit')) {
            throw Error('The steady rehearsal did not complete.');
        }
        next.last = operation;
    }
    state.worlds[keeperSpiritWorld].facts[fact] = JSON.stringify(next);
}
