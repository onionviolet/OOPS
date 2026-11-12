import {moonglowBlade} from './gu_ability_profiles.js';
import {resolveGuActivation} from './gu_activation.js';
import {fourFlavorsConversion as recipe} from './gu_liquor_worm.js';

export const keeperRedSteel = 'book.ri.keeper.red_steel_refinement';
export const keeperRankTrialId = 'book.ri.keeper.rank_trial';
export const keeperMoonglowLoan = JSON.stringify({id: `${keeperRankTrialId}.loan`});
const world = 'book.ri.keeper.world';
const mealKey = `${keeperRedSteel}.fed_at`;
const castKey = `${keeperRedSteel}.last_cut`;
const mealMinutes = 1440;
const spentPerCast = moonglowBlade.cost * moonglowBlade.stageFuel.upper.costFactor;
const expectedCut = moonglowBlade.effect.magnitude * moonglowBlade.stageFuel.upper.magnitudeFactor;

export function isRedSteelOperation(operation) {
    return ['feed_four', 'concentrate_red', 'cast_upper'].includes(operation);
}

export function redSteelView(state) {
    const facts = state.worlds[world]?.facts;
    const fedAt = facts?.[mealKey], lastCut = facts?.[castKey];
    const done = action => state.actors.player.completed[`${keeperRedSteel}.${action}`] ?? 0;
    const feeds = done('feed_four'), conversions = done('concentrate_red'), casts = done('cast_upper');
    const stock = conversions * recipe.yield - casts * spentPerCast;
    if ((fedAt !== undefined) !== (feeds > 0) ||
        (fedAt !== undefined && (!Number.isSafeInteger(fedAt) || fedAt < 0 || fedAt > state.clock)) ||
        ((lastCut !== undefined) !== (casts > 0)) || (lastCut !== undefined && lastCut !== expectedCut) ||
        !Number.isSafeInteger(stock) || stock < 0 || (conversions > 0 && feeds === 0)) {
        throw Error('The Four Flavors feeding and red-steel receipts disagree.');
    }
    return {fedAt, lastCut, stock, fed: fedAt !== undefined && state.clock - fedAt < mealMinutes};
}

export function keeperRedSteelActions(state, product, view) {
    const sound = state.actors.player.facts[`${keeperRankTrialId}.moonglow_sound`] === true;
    return {feed_four: !!product && !view.fed, concentrate_red: !!product && view.fed,
        cast_upper: sound && view.stock >= spentPerCast};
}

export function applyRedSteel(state, product, operation, nativeInventory) {
    const view = redSteelView(state);
    if (!keeperRedSteelActions(state, product, view)[operation]) throw Error('The Gu or its red-steel essence is no longer ready.');
    const facts = state.worlds[world].facts;
    if (operation === 'feed_four') facts[mealKey] = state.clock;
    if (operation === 'cast_upper') {
        if (!(nativeInventory?.[keeperMoonglowLoan] > 0)) throw Error('Borrow the Moonglow Gu before casting.');
        const pool = 'upper-red-steel';
        const result = resolveGuActivation({
            stages: [{gu: {id: `${keeperRankTrialId}.loan`, kind: 'moonglow', rank: 2, fedThrough: state.clock},
                operator: 'player', ability: moonglowBlade,
                supply: {pool, family: 'primeval', rank: recipe.rank, stage: recipe.stage, source: 'condensed'}}],
            reserves: {player: {[pool]: view.stock}}, day: state.clock,
        });
        if (result.outcome !== 'complete' || result.activations[0].cost !== spentPerCast) throw Error('The upper-stage Moonglow blade failed to form.');
        facts[castKey] = result.effects[0].magnitude;
    }
    // The native conversion command spends the sealed input. Successful
    // conversion and cast receipts are the balance of the refined reserve.
}
