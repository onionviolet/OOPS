import {oldestFirst} from './spoilage.js';
import {detachVitalityLeaf, growVitalityLeaf} from './gu_vitality_grass.js';
import {abilityModifiers, resolveGuActivation} from './gu_activation.js';
import {fixedImmortalTravel as fixedTravel, fixedImmortalTravelAbility} from './gu_fixed_immortal_travel.js';
import {littleLightMoonblade, littleLightSupport, lightSourceSupport, moonglowBlade, moonlightBlade} from './gu_ability_profiles.js';
import {bindGuMove} from './gu_move_roles.js';
import {resolveThreeHeadsSixArms} from './gu_coordination.js';
import {searchGuMoves} from './gu_move_search.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {beginGuProjection, borrowGuMilestone, invokeProjectedGu, recordGuMilestone} from './gu_projection.js';
import {restoreCreatureLifecycle} from './creature_lifecycle.js';
import {discoverLiquorWorm, liquorWormApproachable, liquorWormConversion, liquorWormFamiliarity, lureLiquorWorm, moveLiquorWorm} from './gu_liquor_worm.js';
import {address, drawFraction} from './gen_kit.js';
import {guColonyView, openGuColony, settleGuColonyAction, starFireflyFarm} from './gu_colony.js';

const kinds = new Map([
    ['moonlight', {price: 3, feed: 'petals', meal: 4, ability: moonlightBlade}],
    ['little-light', {price: 2, feed: 'petals', meal: 2, ability: littleLightSupport}],
    ['light-source', {price: 3, feed: 'petals', meal: 2, ability: lightSourceSupport}],
    ['moonglow', {feed: 'petals', meal: 5, ability: moonglowBlade}],
    ['vitality-grass', {price: 6, producer: true}],
    ['liquor-worm', {wild: true, feed: 'wine', meal: 1, lure: 'wine', refuge: 'hidden cave',
        conversion: liquorWormConversion}],
    ['starlight-firefly', {}],
    [fixedTravel, {}],
]);
const PETAL_LIFE = 5;
const fuelSources = {
    aperture: {pool: 'primeval', family: 'primeval', rank: 1, source: 'aperture'},
    stored: {pool: 'red-steel', family: 'primeval', rank: 2, source: 'stored'},
};
const refinements = {
    moonglow: {
        id: 'moonglow-fusion', revision: 1, kind: 'moonglow', rank: 2,
        ingredients: {core: 'moonlight', firstLight: 'little-light', secondLight: 'little-light'},
        failure: {core: 'injure', firstLight: 'injure', secondLight: 'destroy'},
        attempts: {steady: {cost: 3, controlFailed: false}, rushed: {cost: 2, controlFailed: true}},
    },
};
// This alternate world has an escaped Moonlight specimen. The canonical
// workshop has no wild Moonlight trail, as stated in chapter 8.
const escapedMoonlight = {
    kind: 'moonlight', origin: 'escaped clan stock', traits: {bladeForce: 1},
};
const futureProfile = {
    rank: 7,
    capabilities: [{kind: fixedTravel, rank: 7, ability: fixedImmortalTravelAbility}],
    reserves: {immortal: 2},
};

function addGu(state, kind, origin, traits, holder = 'keeper') {
    const gu = {id: state.nextId++, kind, origin, fedThrough: state.day, injured: false, alive: true, holder};
    if (traits) gu.traits = {...traits};
    if (kinds.get(kind).producer) gu.leaves = 0;
    state.gu.push(gu);
    return gu;
}

function kindOf(gu) {
    return kinds.get(gu.kind);
}

const creatureOf = (state, gu) => state.encounterCreatures.individuals[gu.creatureId];
const holderOf = (state, gu) => gu.creatureId ? creatureOf(state, gu).keeper : gu.holder;
const familiarity = (state, gu) => liquorWormFamiliarity(creatureOf(state, gu), 'keeper');

function createWildWorm(state, gu) {
    const acquired = discoverLiquorWorm(state.encounterCreatures, {site: 'village-border',
        seed: state.seed, source: 'gu-workshop', identity: gu.id, clock: state.day});
    state.encounterCreatures = acquired.state;
    gu.creatureId = acquired.id;
    delete gu.holder;
}

function moveWorm(state, gu, keeper, destination) {
    state.encounterCreatures = moveLiquorWorm(state.encounterCreatures, gu.creatureId,
        {keeper, site: destination, clock: state.day});
}

function viewGu(state, gu) {
    if (!gu.creatureId) return {...gu};
    return {...gu, holder: holderOf(state, gu), temperament: creatureOf(state, gu).traits.temperament,
        familiarity: familiarity(state, gu)};
}

function requireGu(state, id) {
    const gu = state.gu.find(held => held.id === id && held.alive && holderOf(state, held) === 'keeper');
    if (!gu) throw Error(`You do not hold Gu ${id}.`);
    return gu;
}

function acquire(state, kind) {
    const spec = kinds.get(kind);
    if (spec?.price === undefined) throw Error('This Gu is not sold at the workshop stall.');
    if (state.stones < spec.price) throw Error('You need more primeval stones.');
    state.stones -= spec.price;
    const gu = addGu(state, kind, 'stall');
    return {action: 'buy', gu: {...gu}, stonesSpent: spec.price};
}

function cultivate(state, action) {
    if (action === 'plant') {
        if (!state.seeds) throw Error('You have no moon orchid seeds.');
        state.seeds--;
        state.beds.push(state.day + 1);
        return {action, readyOn: state.day + 1};
    }
    const ready = state.beds.filter(day => day <= state.day);
    if (!ready.length) throw Error('No moon orchids are ready to harvest.');
    state.beds = state.beds.filter(day => day > state.day);
    state.petalLots.push({pickedOn: state.day, count: ready.length * 12});
    state.seeds += ready.length;
    return {action, petals: ready.length * 12, seeds: ready.length};
}

function feed(state, id) {
    const gu = requireGu(state, id);
    const {feed: food, meal, producer} = kindOf(gu);
    if (producer) throw Error('This Gu grows with water and sunlight. Choose grow.');
    if (!food) throw Error('This Gu has no feeding procedure in the workshop.');
    if (food !== 'petals') {
        if (state.food[food] < meal) throw Error(`Feeding Gu ${id} takes ${meal} ${food}.`);
        state.food[food] -= meal;
    } else {
        spendPetals(state, id, meal);
    }
    gu.fedThrough = Math.max(gu.fedThrough, state.day) + 1;
    return {action: 'feed', id, food, spent: meal, fedThrough: gu.fedThrough};
}

function spendPetals(state, id, meal) {
    if (state.petalLots.reduce((sum, lot) => sum + lot.count, 0) < meal) throw Error(`Feeding Gu ${id} takes ${meal} fresh petals.`);
    let remaining = meal;
    for (const lot of oldestFirst(state.petalLots, lot => state.day - lot.pickedOn)) {
        const taken = Math.min(remaining, lot.count);
        lot.count -= taken;
        remaining -= taken;
    }
    state.petalLots = state.petalLots.filter(lot => lot.count);
}

function stockWine(state) {
    if (!state.stones) throw Error('A portion of wine costs one primeval stone.');
    state.stones--;
    state.food.wine++;
    return {action: 'buy-wine', stonesSpent: 1};
}

function convertEssence(state, id) {
    const gu = requireGu(state, id);
    if (gu.wildWill) throw Error('Refine control of the Gu before using it.');
    const conversion = kindOf(gu).conversion;
    if (!conversion || gu.injured || gu.fedThrough < state.day) throw Error('Choose a fed, healthy essence-converting Gu.');
    if (state.essence < conversion.cost) throw Error('There is too little essence to convert.');
    state.essence -= conversion.cost;
    state.refinedEssence += conversion.yield;
    return {action: 'convert-essence', id, essenceSpent: conversion.cost, refinedEssence: conversion.yield};
}

function startColony(state, habitat) {
    if (habitat !== starFireflyFarm.id || state.colony) throw Error('Choose an unoccupied colony habitat.');
    const setupCost = 4;
    if (state.stones < setupCost) throw Error('You need primeval stones for the ordinary insects, grass and cloud soil.');
    state.colony = openGuColony(starFireflyFarm, {clock: state.day, interval: 3});
    state.stones -= setupCost;
    return {action: 'start-colony', habitat, stonesSpent: setupCost, ordinary: starFireflyFarm.starterStock};
}

function changeColonyLight(state, light) {
    if (!state.colony) throw Error('Start a colony first.');
    state.colony = settleGuColonyAction(state.colony, starFireflyFarm, state.day, {kind: 'light', light}).colony;
    return {action: 'colony-light', light};
}

function plantStarGrass(state) {
    if (!state.colony || state.stones < 1) throw Error('Planting star fragment grass requires a colony and one primeval stone.');
    state.colony = settleGuColonyAction(state.colony, starFireflyFarm, state.day, {kind: 'plant'}).colony;
    state.stones--;
    return {action: 'plant-star-grass', starGrass: state.colony.starGrass, stonesSpent: 1};
}

function collectColonyGu(state) {
    if (!state.colony) throw Error('No Gu has emerged from the colony.');
    const {colony, collected} = settleGuColonyAction(state.colony, starFireflyFarm, state.day, {kind: 'collect'});
    const gu = addGu(state, collected, 'colony emergence');
    state.colony = colony;
    return {action: 'collect-colony-gu', gu: {...gu}};
}

function growLeaves(state, id) {
    const gu = requireGu(state, id);
    const growth = growVitalityLeaf(gu, {operator: 'keeper', daylight: true, water: state.water,
        essence: state.essence, clock: state.day});
    state.water -= growth.waterSpent;
    state.essence -= growth.essenceSpent;
    gu.leaves = growth.plant.leaves;
    return {action: 'grow', id, leavesOnGu: gu.leaves, waterSpent: growth.waterSpent, essenceSpent: growth.essenceSpent};
}

function sellLeaf(state, id) {
    const gu = requireGu(state, id);
    gu.leaves = detachVitalityLeaf(gu, 'keeper').leaves;
    state.stones += 2;
    return {action: 'sell-leaf', id, leavesOnGu: gu.leaves, stonesEarned: 2};
}

function findWild(state, kind = 'liquor-worm') {
    if (state.wildSighting !== null || state.day < state.nextWildDay) throw Error('No new Gu trail is available.');
    let gu = state.gu.find(row => row.alive && holderOf(state, row) === null && row.kind === kind);
    if (!gu) {
        const seed = state.localWild?.kind === kind ? state.localWild
            : kinds.get(kind)?.wild ? {origin: 'wild capture'} : null;
        if (!seed) throw Error('This Gu has no known wild trail in the workshop.');
        gu = addGu(state, kind, seed.origin, seed.traits, null);
        if (kind === 'liquor-worm') createWildWorm(state, gu);
        gu.wildWill = true;
        gu.wildPosition = 'trail';
        if (seed === state.localWild) state.localWild = null;
    }
    state.wildSighting = {id: gu.id, kind, day: state.day};
    return {action: 'find', sighting: {...state.wildSighting},
        ...(gu.creatureId && {temperament: creatureOf(state, gu).traits.temperament})};
}

function sightedGu(state) {
    if (!state.wildSighting) throw Error('Find a fresh Gu trail first.');
    return state.gu.find(gu => gu.id === state.wildSighting.id);
}

function lureWild(state) {
    const gu = sightedGu(state);
    const bait = kindOf(gu).lure;
    if (!bait || gu.wildPosition === 'lured') throw Error('This Gu will not take a new lure now.');
    if (!state.food[bait]) throw Error(`Luring the Gu takes one portion of ${bait}.`);
    state.encounterCreatures = lureLiquorWorm(state.encounterCreatures, gu.creatureId, 'keeper', state.day, 1);
    state.food[bait]--;
    gu.wildPosition = 'lured';
    return {action: 'lure', id: gu.id, bait, outcome: 'approached', familiarity: familiarity(state, gu)};
}

function followWild(state) {
    const gu = sightedGu(state);
    if (gu.wildPosition !== 'sheltered') throw Error('Wait for the Gu to leave a trail to its refuge.');
    const refuge = kindOf(gu).refuge;
    if (!state.discoveredRefuges.includes(refuge)) state.discoveredRefuges.push(refuge);
    return {action: 'follow', id: gu.id, refuge};
}

function capture(state) {
    const gu = sightedGu(state);
    const creature = creatureOf(state, gu);
    const familiar = creature && liquorWormApproachable(creature, 'keeper');
    if (kindOf(gu).refuge && gu.wildPosition !== 'lured' && !familiar) {
        gu.wildPosition = 'sheltered';
        return {action: 'capture', id: gu.id, outcome: 'fled'};
    }
    if (state.essence < 2) throw Error('You need two workshop units of essence to capture the Gu.');
    if (gu.creatureId) moveWorm(state, gu, 'keeper', 'workshop');
    else gu.holder = 'keeper';
    state.essence -= 2;
    gu.fedThrough = state.day;
    delete gu.wildPosition;
    state.wildSighting = null;
    state.nextWildDay = state.day + 2;
    return {action: 'capture', gu: viewGu(state, gu), essenceSpent: 2};
}

function releaseWorm(state, id) {
    const gu = requireGu(state, id);
    if (!gu.creatureId) throw Error('Choose a Liquor Worm to return to the village border.');
    moveWorm(state, gu, null, 'village-border');
    gu.wildWill = true;
    gu.wildPosition = 'trail';
    return {action: 'release-worm', gu: viewGu(state, gu)};
}

function refineControl(state, id) {
    const gu = requireGu(state, id);
    if (!gu.wildWill) throw Error('This Gu is already under your control.');
    if (state.essence < 1) throw Error('Refining control takes one workshop unit of essence.');
    state.essence--;
    gu.wildWill = false;
    return {action: 'refine-control', id, essenceSpent: 1};
}

function openFutureSelf(state) {
    if (!state.riverAnchor || state.projection || state.futureSelfUsed) throw Error('This Future Self preparation is unavailable.');
    state.projection = beginGuProjection({
        anchor: state.riverAnchor, operator: 'keeper', now: state.day, duration: 2, rankLimit: 7,
        profile: futureProfile,
    });
    state.futureSelfUsed = true;
    return {action: 'future-self', expiresAt: state.projection.expiresAt};
}

function travelWithFutureSelf(state, destination) {
    if (!['northern-plains', 'southern-border'].includes(destination) || state.location === destination) {
        throw Error('Choose a different known destination.');
    }
    const result = invokeProjectedGu({
        projection: state.projection, anchor: state.riverAnchor, operator: 'keeper', now: state.day, kind: fixedTravel,
    });
    state.projection = result.projection;
    if (result.effects.some(effect => effect.kind === 'travel')) state.location = destination;
    return {action: 'projected-travel', outcome: result.outcome, location: state.location, activations: result.activations};
}

function markMoonblade(state, id) {
    if (state.moonbladeMilestone) throw Error('The workshop seal already bears a mark.');
    const gu = requireGu(state, id);
    if (gu.kind !== 'moonlight') throw Error('The workshop seal takes a Moonblade mark.');
    state.moonbladeMilestone = recordGuMilestone({id: 'moonblade-seal', operator: 'keeper', at: state.day,
        gu: {...gu, rank: 1, holder: holderOf(state, gu)}, ability: moonlightBlade, reserves: {primeval: state.essence}});
    return {action: 'mark-moonblade', specimen: id, at: state.day};
}

function openPastMoonblade(state) {
    if (state.projection || state.pastMoonbladeUsed) throw Error('The Moonblade seal is unavailable.');
    state.projection = borrowGuMilestone({milestone: state.moonbladeMilestone, anchor: state.moonbladeMilestone?.id,
        operator: 'keeper', now: state.day, duration: 2, rankLimit: 1});
    state.pastMoonbladeUsed = true;
    return {action: 'past-moonblade', expiresAt: state.projection.expiresAt};
}

function castPastMoonblade(state) {
    const result = invokeProjectedGu({projection: state.projection, anchor: state.moonbladeMilestone?.id,
        operator: 'keeper', now: state.day, kind: 'moonlight'});
    state.projection = result.projection;
    const power = result.effects[0]?.magnitude ?? 0;
    state.targetDamage += power;
    return {action: 'projected-moonblade', outcome: result.outcome, power, activations: result.activations};
}

function care(state, id) {
    const gu = requireGu(state, id);
    if (!gu.injured) throw Error('This Gu has no injury to treat.');
    if (gu.fedThrough < state.day) throw Error('Feed the Gu before treating it.');
    if (state.stones < 2) throw Error('Treatment costs two primeval stones.');
    state.stones -= 2;
    gu.injured = false;
    return {action: 'care', id, stonesSpent: 2, outcome: 'recovered'};
}

function activationStage(gu, source = 'aperture') {
    if (!Object.hasOwn(fuelSources, source) || (source === 'stored' && !gu.rank)) {
        throw Error('Choose an available essence source of a known grade.');
    }
    return {gu, operator: 'keeper', ability: kindOf(gu).ability,
        ...(gu.rank && {supply: fuelSources[source]})};
}

const activationContext = state => ({reserves: {keeper: {primeval: state.essence, 'red-steel': state.storedEssence}}, day: state.day});

function cast(state, {core, supports = [], source = 'aperture'}) {
    if (!Array.isArray(supports)) throw Error('Choose a list of supporting Gu.');
    const stages = [...supports.map(id => activationStage(requireGu(state, id))), activationStage(requireGu(state, core), source)];
    if (stages.some(({gu}) => gu.wildWill)) throw Error('Refine control of each Gu before casting.');
    if (!stages.at(-1).ability?.effect || stages.slice(0, -1).some(stage => !stage.ability || !abilityModifiers(stage.ability).length)) {
        throw Error('Choose an attacking Gu and supporting Gu.');
    }
    let draws = state.controlDraws;
    const result = resolveGuActivation({stages, ...activationContext(state),
        controlDraw: ({id}) => drawFraction(state.seed, address('gu-workshop', 'cast-control', ++draws, id))});
    state.controlDraws = draws;
    state.essence = result.remaining.keeper.primeval;
    state.storedEssence = result.remaining.keeper['red-steel'];
    const activations = result.activations.map(({id, kind, cost, funding}) => ({id, kind, cost, ...(funding && {funding})}));
    if (result.outcome === 'interrupted') {
        for (const consequence of result.backlash ?? []) {
            if (consequence.kind === 'injure-gu') requireGu(state, consequence.target).injured = true;
        }
        return {action: 'cast', outcome: result.outcome, id: result.id, reason: result.reason, activations,
            ...(result.backlash && {backlash: result.backlash}),
            ...(result.attemptedFunding && {attemptedFunding: result.attemptedFunding})};
    }
    const power = result.effects[0].magnitude;
    state.targetDamage += power;
    return {action: 'cast', outcome: 'hit', power, activations};
}

function researchMove(state, effect = 'damage') {
    const available = state.gu.filter(gu => gu.alive && holderOf(state, gu) === 'keeper' && !gu.wildWill)
        .map(gu => activationStage(gu)).filter(stage => stage.ability);
    const result = searchGuMoves({available, ...activationContext(state), effect});
    const knownPairings = bindGuMove(littleLightMoonblade, available);
    const options = result.options.map(option => {
        const knownPair = option.supports.length === 1 && knownPairings.some(({roles}) =>
            roles.light.gu.id === option.supports[0] && roles.blade.gu.id === option.core);
        const soloMoonlight = option.activations.length === 1 && option.activations[0].kind === 'moonlight';
        const source = knownPair || soloMoonlight ? `chapter ${littleLightMoonblade.chapter}` : 'workshop proposal';
        return {...option, source};
    });
    return {action: 'research-move', ...result, options};
}

function refine(state, {parts, control = 'steady', recipe = 'moonglow'}) {
    const rule = Object.hasOwn(refinements, recipe) ? refinements[recipe] : null;
    if (!rule) throw Error('Choose a known refinement procedure.');
    const roles = Object.entries(rule.ingredients);
    if (!Array.isArray(parts) || parts.length !== roles.length || new Set(parts).size !== parts.length) {
        throw Error(`Choose ${roles.length} separate Gu to refine.`);
    }
    const held = parts.map(id => requireGu(state, id));
    if (held.some(gu => gu.wildWill)) throw Error('Refine control of each Gu before fusing them.');
    if (!Object.hasOwn(rule.attempts, control)) throw Error('Choose a supported refinement approach.');
    if (held.some(gu => gu.injured || gu.fedThrough < state.day)) throw Error('The Gu need feeding and recovery before refinement.');
    const unused = [...held];
    const ingredients = Object.fromEntries(roles.map(([role, kind]) => {
        const index = unused.findIndex(gu => gu.kind === kind);
        if (index === -1) throw Error(`This refinement needs ${Object.values(rule.ingredients).join(', ')}.`);
        return [role, unused.splice(index, 1)[0].id];
    }));
    const {cost, controlFailed} = rule.attempts[control];
    if (state.essence < cost) throw Error(`You need ${cost} workshop units of essence for this refinement.`);
    const {id: procedure, revision, kind, rank} = rule;
    // Light Source can leave half units in the workshop reserve.
    const definition = {id: procedure, revision, kind, rank, ingredients: rule.ingredients,
        stages: [{id: 'fuse', inputs: [{material: 'primeval', amount: cost * 2}], onControlFailure: rule.failure}]};
    const id = `fusion-${state.refinementAttempts.length + 1}`;
    const pending = beginGuRefinement({
        gu: state.gu, stocks: {keeper: {primeval: state.essence * 2}}, attempts: state.refinementAttempts,
    }, {id, refiner: 'keeper', recipe: definition, ingredients, productId: state.nextId});
    const resolved = stepGuRefinement(pending, id, {controlFailed});
    state.gu = resolved.gu;
    state.refinementAttempts = resolved.attempts;
    state.essence = resolved.stocks.keeper.primeval / 2;
    const attempt = resolved.attempts.at(-1);
    if (attempt.status === 'failed') {
        const participants = parts.map(part => state.gu.find(gu => gu.id === part));
        return {action: 'refine', outcome: 'failed', lost: participants.find(gu => !gu.alive)?.id,
            injured: participants.filter(gu => gu.alive && gu.injured).map(gu => gu.id), essenceSpent: cost};
    }
    const gu = requireGu(state, attempt.product);
    Object.assign(gu, {origin: 'refinement', fedThrough: state.day, injured: false});
    state.nextId++;
    return {action: 'refine', consumed: parts, gu: {...gu}, essenceSpent: cost};
}

function perform(state, step) {
    switch (step?.action) {
        case 'buy': return acquire(state, step.kind);
        case 'find': return findWild(state, step.kind);
        case 'lure': return lureWild(state);
        case 'follow': return followWild(state);
        case 'capture': return capture(state);
        case 'release-worm': return releaseWorm(state, step.id);
        case 'refine-control': return refineControl(state, step.id);
        case 'future-self': return openFutureSelf(state);
        case 'projected-travel': return travelWithFutureSelf(state, step.destination);
        case 'mark-moonblade': return markMoonblade(state, step.id);
        case 'past-moonblade': return openPastMoonblade(state);
        case 'projected-moonblade': return castPastMoonblade(state);
        case 'buy-wine': return stockWine(state);
        case 'buy-red-steel':
            if (state.stones < 2) throw Error('Two stones buy five measures of stored red steel essence.');
            state.stones -= 2;
            state.storedEssence += 5;
            return {action: 'buy-red-steel', stonesSpent: 2, essenceStored: 5};
        case 'convert-essence': return convertEssence(state, step.id);
        case 'start-colony': return startColony(state, step.habitat);
        case 'colony-light': return changeColonyLight(state, step.light);
        case 'plant-star-grass': return plantStarGrass(state);
        case 'collect-colony-gu': return collectColonyGu(state);
        case 'plant':
        case 'harvest': return cultivate(state, step.action);
        case 'wait': {
            state.day++;
            if (state.projection && state.day >= state.projection.expiresAt) state.projection = null;
            if (state.colony) {
                state.colony = settleGuColonyAction(state.colony, starFireflyFarm, state.day, {kind: 'advance'}).colony;
            }
            state.essence = Math.min(12, state.essence + 4);
            if (state.wildSighting) {
                const gu = sightedGu(state);
                if (kindOf(gu).refuge) gu.wildPosition = 'sheltered';
            }
            state.wildSighting = null;
            const expired = state.petalLots.filter(lot => state.day - lot.pickedOn >= PETAL_LIFE);
            state.petalLots = state.petalLots.filter(lot => state.day - lot.pickedOn < PETAL_LIFE);
            return {action: 'wait', day: state.day, essence: state.essence, spoiledPetals: expired.reduce((sum, lot) => sum + lot.count, 0)};
        }
        case 'feed': return feed(state, step.id);
        case 'care': return care(state, step.id);
        case 'grow': return growLeaves(state, step.id);
        case 'sell-leaf': return sellLeaf(state, step.id);
        case 'cast': return cast(state, step);
        case 'research-move': return researchMove(state, step.effect);
        case 'refine': return refine(state, step);
        default: throw Error('Choose buy, find, lure, follow, capture, release-worm, refine-control, future-self, projected-travel, mark-moonblade, past-moonblade, projected-moonblade, buy-wine, buy-red-steel, convert-essence, start-colony, colony-light, plant-star-grass, collect-colony-gu, plant, wait, harvest, feed, care, grow, sell-leaf, cast, research-move or refine.');
    }
}

const upkeep = [
    {action: 'buy', kind: 'moonlight'}, {action: 'buy', kind: 'little-light'},
    {action: 'plant'}, {action: 'wait'}, {action: 'harvest'}, {action: 'feed', id: 1}, {action: 'feed', id: 2},
];
const moonglowPreparation = [...upkeep, {action: 'buy', kind: 'little-light'}, {action: 'refine', parts: [1, 2, 3]}];
const aboveRankCast = [...moonglowPreparation, {action: 'wait'}, {action: 'feed', id: 4}, {action: 'cast', core: 4}];
export const guWorkshopCases = Object.freeze({
    'gu-keeper': {method: 'gu', actions: [...upkeep, {action: 'cast', core: 1, supports: [2]}]},
    'gu-variation': {method: 'gu', actions: [...upkeep, {action: 'buy', kind: 'little-light'}, {action: 'cast', core: 1, supports: [2, 3]}]},
    'gu-experiment': {method: 'gu', actions: [...upkeep, {action: 'buy', kind: 'light-source'}, {action: 'cast', core: 1, supports: [2, 3]}]},
    'gu-move-research': {method: 'gu', actions: [...upkeep, {action: 'buy', kind: 'light-source'}, {action: 'research-move'}]},
    'gu-above-rank': {method: 'gu', actions: aboveRankCast},
    'gu-stored-essence': {method: 'gu', actions: [...moonglowPreparation, {action: 'buy-red-steel'}, {action: 'cast', core: 4, source: 'stored'}]},
    'gu-above-rank-recovery': {method: 'gu', seed: 1, actions: [...aboveRankCast,
        {action: 'care', id: 4}, {action: 'buy-red-steel'}, {action: 'cast', core: 4, source: 'stored'}]},
    'gu-recovery': {method: 'gu', actions: [
        ...upkeep,
        {action: 'buy', kind: 'little-light'}, {action: 'refine', parts: [1, 2, 3], control: 'rushed'},
        {action: 'cast', core: 1, supports: [2]}, {action: 'care', id: 1}, {action: 'care', id: 2},
        {action: 'cast', core: 1, supports: [2]},
    ]},
    'gu-cultivation': {method: 'gu', actions: [
        {action: 'buy', kind: 'vitality-grass'}, {action: 'grow', id: 1}, {action: 'sell-leaf', id: 1},
        {action: 'buy', kind: 'moonlight'}, {action: 'buy', kind: 'little-light'}, {action: 'buy', kind: 'light-source'},
        {action: 'cast', core: 2, supports: [3, 4]},
    ]},
    'gu-wild': {method: 'gu', actions: [
        {action: 'find'}, {action: 'capture'}, {action: 'wait'}, {action: 'find'}, {action: 'follow'},
        {action: 'buy-wine'}, {action: 'lure'}, {action: 'capture'}, {action: 'refine-control', id: 1},
        {action: 'buy-wine'}, {action: 'feed', id: 1},
        {action: 'wait'}, {action: 'convert-essence', id: 1},
    ]},
    'gu-familiar-worm': {method: 'gu', seed: 3, actions: [
        {action: 'find'}, {action: 'buy-wine'}, {action: 'lure'}, {action: 'capture'}, {action: 'refine-control', id: 1},
        {action: 'release-worm', id: 1}, {action: 'wait'}, {action: 'wait'}, {action: 'find'}, {action: 'capture'},
    ]},
    'gu-emergence': {method: 'gu', actions: [
        {action: 'start-colony', habitat: 'starlight-colony'},
        {action: 'wait'}, {action: 'wait'}, {action: 'wait'}, {action: 'collect-colony-gu'},
        {action: 'wait'}, {action: 'wait'}, {action: 'wait'}, {action: 'collect-colony-gu'},
    ]},
    'gu-colony-recovery': {method: 'gu', actions: [
        {action: 'start-colony', habitat: 'starlight-colony'},
        {action: 'colony-light', light: 'exposed'},
        ...Array.from({length: 9}, () => ({action: 'wait'})),
        {action: 'colony-light', light: 'shaded'}, {action: 'plant-star-grass'}, {action: 'plant-star-grass'},
        ...Array.from({length: 6}, () => ({action: 'wait'})),
        {action: 'collect-colony-gu'},
    ]},
    'gu-escaped-moonlight': {method: 'gu', setting: 'escaped-moonlight', actions: [
        {action: 'buy', kind: 'moonlight'}, {action: 'find', kind: 'moonlight'}, {action: 'capture'},
        {action: 'refine-control', id: 2}, {action: 'cast', core: 1}, {action: 'cast', core: 2},
    ]},
    'gu-future-self': {method: 'gu', setting: 'future-self', actions: [
        {action: 'future-self'}, {action: 'projected-travel', destination: 'southern-border'},
        {action: 'wait'}, {action: 'wait'},
    ]},
    'gu-past-moonblade': {method: 'gu', actions: [...upkeep, {action: 'mark-moonblade', id: 1},
        ...moonglowPreparation.slice(upkeep.length), {action: 'wait'}, {action: 'past-moonblade'},
        {action: 'projected-moonblade'}]},
    'gu-three-heads-six-arms': {method: 'gu-coordination', operators: [
        {id: 'liu-wen-wu', reserve: 12, ranks: [3, 3, 4, 4, 5, 5]},
        {id: 'ouyang-bi-sang', reserve: 12, ranks: [3, 3, 4, 4, 5, 5]},
        {id: 'mo-shi-kuang', reserve: 12, ranks: [3, 3, 4, 4, 5, 5]},
    ]},
});

export function runGuCoordination({operators}) {
    if (!Array.isArray(operators) || new Set(operators.map(row => row.id)).size !== operators.length ||
        operators.some(row => typeof row.id !== 'string' || !Array.isArray(row.ranks) ||
            !Number.isSafeInteger(row.reserve) || row.reserve < 0)) {
        throw Error('Provide distinct operators with primeval reserves and Gu ranks.');
    }
    const reserves = Object.fromEntries(operators.map(({id, reserve}) => [id, {primeval: reserve}]));
    const stages = operators.flatMap(({id, ranks}) => ranks.map((rank, index) => ({
        operator: id,
        gu: {id: `${id}:${index + 1}`, kind: 'unspecified', rank, fedThrough: 0},
        ability: {fuel: 'primeval', cost: 2},
    })));
    return {
        method: 'gu-coordination',
        basis: 'Chapter 536 supplies the simultaneous Gu count, rank range, three operators and merged body. Gu identities, allocation, costs and failed-beat accounting are workshop settings.',
        ...resolveThreeHeadsSixArms({reserves, day: 0, stages}),
    };
}

export function runGuWorkshop({actions, setting, seed = 0} = {}) {
    if (!Array.isArray(actions) || actions.length > 100) throw Error('Supply an array of up to 100 actions.');
    if (!Number.isInteger(seed) || seed < 0 || seed >= 2 ** 32) throw Error('Supply an unsigned 32-bit workshop seed.');
    if (setting !== undefined && !['escaped-moonlight', 'future-self'].includes(setting)) throw Error('Unknown Gu workshop setting.');
    const state = {day: 0, nextId: 1, seed, controlDraws: 0, essence: 12, stones: 12, water: 3, petalLots: [], seeds: 1, beds: [], gu: [],
        targetDamage: 0, wildSighting: null, nextWildDay: 0, discoveredRefuges: [], food: {wine: 0},
        refinedEssence: 0, storedEssence: 0, colony: null, refinementAttempts: [],
        encounterCreatures: restoreCreatureLifecycle(null),
        localWild: setting === 'escaped-moonlight' ? structuredClone(escapedMoonlight) : null};
    if (setting === 'future-self') {
        Object.assign(state, {location: 'northern-plains', riverAnchor: 'river-state-one',
            projection: null, futureSelfUsed: false});
        const real = addGu(state, fixedTravel, 'chapter 1754', undefined, 'feng-jiu-ge');
        Object.assign(real, {rank: 7, uniqueKey: fixedTravel});
    }
    const trace = [];
    for (const [index, step] of actions.entries()) {
        try {
            trace.push(perform(state, step));
        } catch (error) {
            trace.push({action: step?.action, outcome: 'stopped', step: index + 1, reason: error.message});
            break;
        }
    }
    return {
        method: 'gu', state: {...state, colony: state.colony && guColonyView(state.colony, starFireflyFarm),
            gu: state.gu.filter(gu => gu.alive && holderOf(state, gu) === 'keeper').map(gu => viewGu(state, gu)),
            wildGu: state.gu.filter(gu => gu.alive && holderOf(state, gu) === null).map(gu => viewGu(state, gu)),
            ...(setting === 'future-self' && {otherGu: state.gu.filter(gu => gu.alive && gu.holder === 'feng-jiu-ge')}),
            guHistory: state.gu.filter(gu => !gu.alive), petals: state.petalLots.reduce((sum, lot) => sum + lot.count, 0)}, trace,
        basis: 'Chapters 7, 8, 14, 23, 34, 70, 106, 183, 275, 466, 474 and 1754 anchor origins, wild behavior, control, upkeep, conversion, production, support, refinement, emergence and borrowed travel. Workshop prices, rates, capture, treatment, mixed-support eligibility and failure triggers are original settings.',
    };
}

