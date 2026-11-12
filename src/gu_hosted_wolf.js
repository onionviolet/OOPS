import {acquireCreature, creatureHealth, injureCreature, restoreCreatureLifecycle, settleCohortStock,
    startCreatureCare, transferCreature} from './creature_lifecycle.js';
import {resolveGuActivation} from './gu_activation.js';
import {separateHostedGu} from './gu_host_custody.js';
import {applyWolfRidge, controlledRidgeEye, ridgeFacts, ridgeOperations, ridgeView, validateWolfRidge, wolfRidge} from './gu_wolf_ridge.js';
import {applySmokePassage, smokeFacts, smokeOperations, smokeOperationSite, smokePassage, smokeView,
    validateSmokePassage} from './gu_smoke_passage.js';
import {applyStealth, keeperScaleArmor, keeperStealth, scaleArmorOperations, stealthFacts, stealthOperations, stealthPlace,
    stealthView, validateStealth} from './gu_keeper_stealth.js';
import {atRavine, wolfRavine, wolfScoutOperations, wolfScouting} from './gu_wolf_scouting.js';
import {crownFlight, flightOperations, flightSites} from './gu_crown_flight.js';
import {guCatalogue} from './gu_catalogue.js';
import {applyKeeperDefense, applyKeeperDefenseResearch, defenseFacts, defenseResearchOperations, defenseTrials,
    keeperDefense, keeperDefenseResearch, keeperDefenseResearchFacts, keeperDefenseView, validateKeeperDefense} from './gu_keeper_defense.js';

export const hostedWolf = 'book.ri.keeper.hosted_wolf';
export const hostedWolfWorld = 'book.ri.keeper.world';
export const hostedWolfGlade = `${hostedWolf}.glade`;
const fact = `${hostedWolf}.encounter`;
const species = 'lightning-wolf';
const cohort = `${hostedWolf}.wolves`;
const guId = `${hostedWolf}.thunderclap`;
const field = {id: hostedWolfGlade, capacity: 1, supportedSpecies: [species]};
const shelter = {...field, id: `${hostedWolf}.shelter`};
const retired = {...field, id: `${hostedWolf}.dead`};
const operations = ['find', 'inspect', 'shelter', 'care', 'extract', 'extract_sound', 'release', 'hunt', 'refine', 'cast'];
const charge = 'white-silver';
const stored = {pool: charge, family: 'primeval', rank: 3, source: 'stored'};
const thunderclap = guCatalogue.thunderclap.ability.value;
export const wolfExtractionCost = {extract: 2, extract_sound: 4};
const pin = record => record?.extensions?.some(row => row.id === hostedWolf);

function read(state) {
    const raw = state.worlds[hostedWolfWorld]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid hosted Gu record.');
    const row = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(row.lifecycle);
    const wolf = lifecycle.individuals[row.host];
    const target = row.gu;
    if (!wolf || Object.keys(lifecycle.individuals).length !== 1 || wolf.species !== species || wolf.origin !== cohort ||
        typeof row.dead !== 'boolean' || typeof row.observed !== 'boolean' || ![false, true].includes(row.struck) ||
        !['host', 'keeper', 'lost'].includes(target?.custody) || target.id !== guId || target.originalHost !== row.host ||
        typeof target.controlled !== 'boolean' || target.controlled && target.custody !== 'keeper' ||
        row.struck && !target.controlled || row.dead !== (target.custody === 'lost') ||
        ![null, 'player'].includes(wolf.keeper) ||
        wolf.habitat !== (row.dead ? retired.id : wolf.keeper ? shelter.id : field.id) ||
        (row.dead && wolf.keeper !== null) || wolf.bornAt > state.clock || wolf.health.lastAt > state.clock) {
        throw Error('The wolf and its Thunderclap Gu records disagree.');
    }
    return {...row, lifecycle};
}

export function validateHostedWolf(state, record) {
    const row = read(state);
    validateWolfRidge(state, record, row);
    validateSmokePassage(state, record, controlledRidgeEye(state));
    validateStealth(state, record);
    validateKeeperDefense(state, record);
    const complete = state.actors.player.completed;
    const done = name => (complete[`${hostedWolf}.${name}`] ?? 0) > 0;
    if (!!row !== done('find') || (row && (!pin(record) || row.observed !== done('inspect') ||
        row.dead !== done('hunt') || (row.gu.custody === 'keeper') !== (done('extract') || done('extract_sound')) ||
        row.gu.controlled !== done('refine') || row.struck !== (done('cast') ||
            (complete['book.ri.keeper.seven_fragrances.cast_seven'] ?? 0) > 0)))) {
        throw Error('The hosted Gu needs its observation, extraction and custody receipts.');
    }
}

export function hostedThunderclapReady(state) {
    return !!actions(describe(read(state), state.clock)).cast;
}

function thunderStrike(row, clock, stage, reserve) {
    const result = resolveGuActivation({stages: [{operator: 'player', ability: thunderclap, supply: {...stored, ...(stage && {stage})},
        gu: {id: row.gu.id, kind: 'thunderclap', rank: 3, fedThrough: clock}}],
        reserves: {player: {[charge]: reserve}}, day: clock});
    const hit = result.effects.find(effect => effect.kind === 'lightning');
    if (!hit) throw Error('Thunderclap failed to strike.');
    return hit.magnitude;
}

export function activateHostedThunderclap(state, record, {stage, reserve}) {
    if (!pin(record) || state.simulation.people.player.location !== hostedWolfGlade || !hostedThunderclapReady(state)) {
        throw Error('Bring a controlled Thunderclap to the glade.');
    }
    const row = read(state);
    const power = thunderStrike(row, state.clock, stage, reserve);
    row.struck = true;
    state.worlds[hostedWolfWorld].facts[fact] = JSON.stringify(row);
    return power;
}

function describe(row, clock) {
    if (!row) return null;
    const wolf = row.lifecycle.individuals[row.host];
    const health = creatureHealth(row.lifecycle, row.host, clock);
    return {held: wolf.keeper === 'player', wounded: (health.injury?.remaining ?? 0) > 0,
        careUntil: health.careUntil, dead: row.dead, observed: row.observed, struck: row.struck,
        gu: row.observed ? row.gu : null};
}

function actions(view) {
    if (!view) return {find: true};
    const hosted = view.gu?.custody === 'host';
    const recovered = view.gu?.custody === 'keeper';
    return {
        find: false, inspect: !view.observed, shelter: hosted && !view.held, care: view.held && view.wounded && !view.careUntil,
        extract: hosted && view.held && view.wounded, extract_sound: hosted && view.held && !view.wounded,
        release: view.held, hunt: hosted && !view.held, refine: recovered && !view.gu.controlled,
        cast: recovered && view.gu.controlled,
    };
}

export function hostedWolfFacts(state, actor, record) {
    if (actor !== 'player' || state.actors.player?.worldId !== hostedWolfWorld) return {};
    const row = read(state);
    const flags = actions(describe(row, state.clock));
    return {...Object.fromEntries(operations.map(name => [`${hostedWolf}.can_${name}`, !!flags[name]])),
        ...ridgeFacts(state, row), ...smokeFacts(state, controlledRidgeEye(state)), ...stealthFacts(state), ...defenseFacts(state, flags.cast),
        ...keeperDefenseResearchFacts(state, record)};
}

export function hostedWolfView(state, record) {
    const view = pin(record) && describe(read(state), state.clock);
    return view ? {...view, ridge: ridgeView(state, record), smoke: smokeView(state, record), stealth: stealthView(state, record),
        defense: keeperDefenseView(state, record)} : null;
}

function newEncounter(clock) {
    const empty = restoreCreatureLifecycle(null);
    const stocked = settleCohortStock(empty, {revision: empty.revision, id: cohort, species, habitat: field, delta: 1});
    const host = acquireCreature(stocked, {revision: stocked.revision, cohortId: cohort, destination: field, keeper: null, clock});
    const lifecycle = injureCreature(host.state, {revision: host.state.revision, id: host.id, clock,
        kind: 'hurt-leg', recoveryMinutes: 20});
    return {host: host.id, lifecycle, dead: false, observed: false, struck: false,
        gu: {id: guId, originalHost: host.id, custody: 'host', controlled: false}};
}

function moveHost(row, keeper, habitat, clock) {
    const lifecycle = row.lifecycle;
    row.lifecycle = transferCreature(lifecycle, {revision: lifecycle.revision, id: row.host,
        fromKeeper: lifecycle.individuals[row.host].keeper, toKeeper: keeper, destination: habitat, clock});
}

export function isHostedWolfEffect(effect) {
    return effect.type === 'guHostedWolf' && effect.actor === 'player' && hostedWolfEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

export function hostedWolfEffectPack(operation) {
    return operations.includes(operation) ? hostedWolf : ridgeOperations.includes(operation) ? wolfRidge :
        wolfScoutOperations.includes(operation) ? wolfScouting : flightOperations.includes(operation) ? crownFlight :
            smokeOperations.includes(operation) ? smokePassage : stealthOperations.includes(operation) ? keeperStealth :
                scaleArmorOperations.includes(operation) ? keeperScaleArmor : Object.hasOwn(defenseTrials, operation) ? keeperDefense :
                    Object.hasOwn(defenseResearchOperations, operation) ? keeperDefenseResearch : null;
}

export function applyHostedWolfEffect(state, effect, context) {
    const {operation} = effect;
    const pack = hostedWolfEffectPack(operation);
    const place = pack === smokePassage ? smokeOperationSite(operation) : pack === keeperStealth ? stealthPlace(operation) :
        flightSites[operation] ?? (atRavine(operation) || operation === 'start_flight' ? wolfRavine : hostedWolfGlade);
    if (!isHostedWolfEffect(effect) || context.actorId !== 'player' || !pin(context.structuredNative) ||
        state.actors.player?.worldId !== hostedWolfWorld ||
        state.simulation.people.player.location !== place) {
        throw Error('Follow the lightning wolf trail from the glade.');
    }
    const clock = state.clock;
    let row = read(state);
    if (pack === smokePassage) {
        applySmokePassage(state, context.structuredNative, operation, controlledRidgeEye(state));
        return;
    }
    if (pack === keeperStealth || pack === keeperScaleArmor) {
        applyStealth(state, context.structuredNative, operation);
        return;
    }
    if (pack === keeperDefense || pack === keeperDefenseResearch) {
        if (!actions(describe(row, clock)).cast) throw Error('Bring the controlled Thunderclap to the glade.');
        const power = thunderStrike(row, clock, undefined, 2);
        if (pack === keeperDefense) {
            const damage = applyKeeperDefense(state, context.structuredNative, operation, power);
            return [{type: 'vital', actor: 'player', key: 'health', amount: -damage}];
        }
        const {cost, damage} = applyKeeperDefenseResearch(state, context.structuredNative, operation, power);
        return [...Array.from({length: cost}, () => ({type: 'energy', actor: 'player', energyId: 'book.ri.keeper.primeval',
            operation: 'use', output: 1, control: 1})), {type: 'vital', actor: 'player', key: 'health', amount: -damage}];
    }
    if (pack !== hostedWolf) {
        applyWolfRidge(state, context.structuredNative, operation, row);
        return;
    }
    if (!actions(describe(row, clock))[operation]) throw Error('The wolf or its Gu has changed.');
    if (operation === 'find') row = newEncounter(clock);
    else if (operation === 'inspect') row.observed = true;
    else if (operation === 'shelter') moveHost(row, 'player', shelter, clock);
    else if (operation === 'release') moveHost(row, null, field, clock);
    else if (operation === 'care') {
        row.lifecycle = startCreatureCare(row.lifecycle, {revision: row.lifecycle.revision, id: row.host,
            keeper: 'player', clock, duration: 20});
    } else if (operation === 'extract' || operation === 'extract_sound') {
        const cost = wolfExtractionCost[operation];
        separateHostedGu({id: `${hostedWolf}.plunder`, cost, clock});
        row.gu.custody = 'keeper';
    } else if (operation === 'hunt') {
        moveHost(row, null, retired, clock);
        row.dead = true;
        row.gu.custody = 'lost';
    } else if (operation === 'refine') {
        row.gu.controlled = true;
    } else {
        thunderStrike(row, clock, undefined, 2);
        row.struck = true;
    }
    state.worlds[hostedWolfWorld].facts[fact] = JSON.stringify(row);
}
