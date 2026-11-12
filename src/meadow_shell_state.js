// Original Village shell animal. Care, work and combat consume the same
// projected condition. Local laws determine humidity response and capacity.
// The chamber's air, the shell and the inlet live on the world substrate (chat
// W, docs/WORLD_SUBSTRATE_CONTRACT.md): humidity is a quantity of the chamber
// place, the shell and the inlet run the l.shell_regulator pack. The terrapin's
// lifecycle (injury, care, keeper) stays here as before.
import {check, natural} from './basics.js';
import {acquireCreature, creatureHealth, injureCreature, restoreCreatureLifecycle,
    settleCohortStock, settleCreatureCare, startCreatureCare} from './creature_lifecycle.js';
import {measureCreatureCapability} from './creature_methods.js';
import {composeSubstrate, createWorld, advanceWorld, applyWorldOps, serializeWorld, restoreWorld, readQuantity} from './world_substrate.js';
import {createShellRegulatorPack, shellBodyState, shellInletState} from './world_substrate_packs/shell_regulator.js';

const chamber = {id: 'village.shell_chamber', capacity: 1, supportedSpecies: ['reed-terrapin']};
export const SHELL_LAW = Object.freeze({delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, careMinutes: 12});
const guard = {id: 'combat.shell-guard', unit: 'armor', combine: 'sum'};
// One look settles at most this many minutes; the rest waits for the next check.
const WINDOW_LIMIT = 64;
const PACK = 'l.shell_regulator', PLACE = chamber.id, BODY = 'village.shell_chamber.terrapin', INLET = 'village.shell_chamber.inlet';
// Small caps keep the chamber's save slice bounded (SPR30).
const CHAMBER_RULES = composeSubstrate({packs: [createShellRegulatorPack(SHELL_LAW)], dials: {chainCap: 16, ledgerCap: 8}});

function chamberWorld(clock, {humidity, shell = 'open', mode = 'open', position = mode === 'linked' ? 'open' : mode, pending = null}) {
    const world = createWorld(CHAMBER_RULES, {clock, holders: [
        {id: PLACE, kind: 'place', detail: 'near', quantities: {humidity}},
        {id: BODY, kind: 'body', place: PLACE, as: ['creature'], tags: ['shell.body'], state: {[PACK]: shellBodyState(shell)}},
        {id: INLET, kind: 'thing', place: PLACE, tags: ['shell.inlet'],
            state: {[PACK]: {...shellInletState({mode, position, wanted: shell, follows: BODY}), pending}}},
    ]});
    return serializeWorld(world);
}

// Saves from before the substrate kept `regulator`, `shell` and `mode` on the
// animal; they become the chamber world at the regulator's clock (MC4).
export function upgradeMeadowShell(state) {
    if (!state || state.chamber) return state;
    check(state.regulator && natural(state.regulator.clock), 'Invalid meadow shell animal.');
    const {regulator, shell, mode, ...rest} = state;
    return {...rest, chamber: chamberWorld(regulator.clock, {humidity: regulator.humidity, shell, mode, position: regulator.inlet, pending: regulator.pending})};
}

const loadChamber = state => restoreWorld(CHAMBER_RULES, state.chamber);

/** What the chamber looks like now: the reading the panel, care and combat use. */
export function meadowChamber(state) {
    const world = loadChamber(upgradeMeadowShell(state)), inlet = world.holders[INLET].state[PACK];
    return {clock: world.clock, humidity: readQuantity(world, PLACE, 'humidity'), shell: world.holders[BODY].state[PACK].shell,
        inlet: inlet.position, mode: inlet.mode, pending: inlet.pending};
}

export function enrollMeadowShell(clock) {
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'reed-terrapin',
        species: 'reed-terrapin', habitat: chamber, delta: 1});
    const found = acquireCreature(stock, {revision: stock.revision, cohortId: 'reed-terrapin',
        destination: chamber, keeper: 'player', clock});
    return {id: found.id, lifecycle: injureCreature(found.state, {revision: found.state.revision,
        id: found.id, clock, kind: 'sore-leg', recoveryMinutes: 4}),
    chamber: chamberWorld(clock, {humidity: 58}), fedUntil: clock, work: 0};
}

export function validateMeadowShell(saved, clock) {
    const state = upgradeMeadowShell(saved);
    const lifecycle = restoreCreatureLifecycle(state.lifecycle);
    const animal = lifecycle.individuals[state.id];
    const world = loadChamber(state);
    check(Object.keys(world.holders).sort().join() === [PLACE, BODY, INLET].sort().join(), 'Invalid meadow shell chamber.');
    const c = meadowChamber(state);
    check(animal?.habitat === chamber.id && animal.species === 'reed-terrapin' && animal.keeper === 'player' &&
        Object.keys(lifecycle.individuals).length === 1 && c.clock <= clock &&
        animal.health.lastAt <= c.clock && natural(state.fedUntil) &&
        state.fedUntil <= c.clock + SHELL_LAW.careMinutes &&
        ['open','closed'].includes(c.shell) && ['open','closed','linked'].includes(c.mode) &&
        natural(state.work) && state.work <= 4 && (state.fitting === undefined || state.fitting === cloth) &&
        (c.mode !== 'linked' ? c.pending === null : state.fitting === cloth),
        'Invalid meadow shell animal.');
    return state;
}

export function meadowShellCondition(state) {
    const c = meadowChamber(state);
    const injury = creatureHealth(state.lifecycle, state.id, c.clock).injury;
    const fed = c.clock < state.fedUntil;
    const damp = c.humidity >= SHELL_LAW.closeBelow;
    const canWork = fed && damp && c.shell === 'open' && !injury?.remaining;
    const armor = measureCreatureCapability(guard, [
        {source: 'body.shell', unit: guard.unit, value: c.shell === 'closed' ? 6 : 1},
    ]);
    return {injury, fed, damp, canWork, armor};
}

export function projectMeadowShell(saved, clock) {
    if (!saved) return null;
    const next = {...upgradeMeadowShell(saved)};
    const {closeBelow} = SHELL_LAW;
    let world = loadChamber(next);
    const end = world.clock + Math.min(WINDOW_LIMIT, clock - world.clock);
    // The chamber is near the player: settle each minute, then let the
    // terrapin's body answer the air it actually had that minute.
    while (world.clock < end) {
        world = advanceWorld(CHAMBER_RULES, world, world.clock + 1).world;
        const minute = world.clock, humidity = readQuantity(world, PLACE, 'humidity'), shell = world.holders[BODY].state[PACK].shell;
        const health = creatureHealth(next.lifecycle, next.id, minute - 1);
        const supported = minute <= next.fedUntil && humidity >= closeBelow;
        if (supported && health.injury?.remaining > 0) {
            const started = startCreatureCare(next.lifecycle, {revision: next.lifecycle.revision, id: next.id,
                clock: minute - 1, keeper: 'player', duration: 1});
            next.lifecycle = settleCreatureCare(started, {revision: started.revision, id: next.id, clock: minute});
        }
        if (supported && !health.injury?.remaining && shell === 'open') next.work = Math.min(4, next.work + 1);
    }
    next.chamber = serializeWorld(world);
    return {state: next, pending: world.clock < clock, condition: meadowShellCondition(next), chamber: meadowChamber(next)};
}

// Player hands on the inlet: set its mode, clear any correction under way.
function setInlet(state, mode) {
    const world = loadChamber(state), inlet = world.holders[INLET].state[PACK];
    const value = {...inlet, mode, pending: null, ...(mode !== 'linked' ? {position: mode} : {})};
    return serializeWorld(applyWorldOps(CHAMBER_RULES, world, [{op: 'state', pack: PACK, holder: INLET, value}], `player.${mode}_inlet`));
}

export const SHELL_ACTIONS = Object.freeze([
    'rescue_shell', 'feed_shell', 'fit_inlet', 'open_inlet', 'close_inlet', 'link_inlet', 'collect_driftwood', 'check_shell',
]);

const hay = JSON.stringify({id: 'Meadow hay'});
const cloth = JSON.stringify({id: 'Wool cloth'});
const driftwood = JSON.stringify({id: 'Rough wood log'});

export function planMeadowShell(state, action, {clock, inventory}) {
    if (action === 'rescue_shell') {
        check(!state, 'The chamber already has its terrapin.');
        return {state: enrollMeadowShell(clock), cost: 5, items: []};
    }
    const view = projectMeadowShell(state, clock);
    check(view, 'Take in the injured terrapin first.');
    const next = view.state;
    if (action === 'check_shell') return {state: next, cost: 0, items: []};
    check(!view.pending, 'Check the chamber again to catch up.');
    let items = [];
    switch (action) {
    case 'feed_shell':
        check(!view.condition.fed, 'The terrapin still has food.');
        check((inventory[hay] ?? 0) >= 1, 'Bring one Meadow hay for the terrapin.');
        next.fedUntil = clock + SHELL_LAW.careMinutes;
        items = [{key: hay, amount: -1}];
        break;
    case 'fit_inlet':
        check(next.fitting === undefined, 'The inlet is already fitted.');
        check((inventory[cloth] ?? 0) >= 1, 'Bring one Wool cloth to fit the inlet.');
        next.fitting = cloth;
        next.chamber = setInlet(next, 'linked');
        items = [{key: cloth, amount: -1}];
        break;
    case 'open_inlet':
    case 'close_inlet':
    case 'link_inlet':
        check(action !== 'link_inlet' || next.fitting === cloth, 'Fit the inlet before linking it.');
        next.chamber = setInlet(next, {open_inlet: 'open', close_inlet: 'closed', link_inlet: 'linked'}[action]);
        break;
    case 'collect_driftwood':
        check(next.work === 4, 'The terrapin has not gathered a bundle yet.');
        next.work = 0;
        items = [{key: driftwood, amount: 1}];
        break;
    default:
        throw Error('Unknown chamber action.');
    }
    return {state: next, cost: 0, items};
}
