// PC95 engine fixture, proposed under AD32. The host quotes meals and spends
// supplies. W owns the clock and appetite; L projects the hunger consequence.
import {guCatalogue} from '../gu_catalogue.js';
import {adaptGuBody, guBodyHolder} from '../gu_living_body.js';
import {guLivingRows, livingKindRegistry} from '../living_kinds.js';
import {acquireCreature, restoreCreatureLifecycle, settleCohortStock} from '../creature_lifecycle.js';
import {readLivingBody} from '../living_body.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

const kinds = Object.fromEntries(guLivingRows(guCatalogue).map(row => [row.id, row]));
// Structured quantities already stated in the catalogue's diet paraphrases.
const mealEvidence = {
    'white-jade': {chapters: [100], value: {amount: 8, unit: 'liang'}},
    moonlight: {chapters: [23], value: {amount: 2, unit: 'petals'}},
    'fixed-immortal-travel': {chapters: [410, 672], value: {amount: 1, unit: 'bead'}},
};
const together = new Set(['vitality-grass', 'love', 'photo-audio']);
// A meal for After represents nutrients already delivered by its ants. The
// case does not settle the ants' processing or generate river or ambient inputs.
const calibration = {rationMinutes: 12, mealAmount: 1, growthMinutes: 0, minutesPerDay: 1440};

export function guBodyRow(id) {
    return adaptGuBody(kinds[id], guCatalogue[id].body, {minutesPerDay: calibration.minutesPerDay, mealEvidence: mealEvidence[id]});
}

const stockKey = food => 'stock:' + food.toLowerCase().replaceAll(' ', '-');
const pack = 'l.living_body';
const place = 'feeding-site';

export function guBodyCase(id) {
    const {row, durationMinutes} = guBodyRow(id);
    const foods = row.diet.food;
    if (!foods) throw new Error(`Gu body case ${id}: diet unknown.`);
    const runtimeDuration = durationMinutes.basis === 'chapter' ? durationMinutes
        : {basis: 'authored', value: calibration.rationMinutes};
    const ration = runtimeDuration.value;
    const statedAmount = row.bodyFields.mealAmount;
    const mealAmount = statedAmount.basis === 'chapter' ? statedAmount.value.amount : calibration.mealAmount;
    const supplyFood = id === 'liquor-worm' ? [statedAmount.value.unit] : foods;
    const recipes = together.has(id) ? [supplyFood] : supplyFood.map(food => [food]);
    const recipeAccounts = recipes.map(recipe => recipe.map(stockKey));
    const knownStock = recipeAccounts[0];
    const wrongStock = stockKey('unrelated forage');
    const stock = accounts => Object.fromEntries(accounts.map(account => [account, mealAmount * 4]));
    const habitat = {id: place, capacity: 3, supportedSpecies: [id]};
    let lifecycle = restoreCreatureLifecycle();
    lifecycle = settleCohortStock(lifecycle, {revision: lifecycle.revision, id: 'cohort', species: id, habitat, delta: 3});
    const ids = {};
    for (const trial of ['fed', 'unfed', 'wrong']) {
        const acquired = acquireCreature(lifecycle, {revision: lifecycle.revision, cohortId: 'cohort', destination: habitat,
            keeper: null, growthMinutes: calibration.growthMinutes});
        lifecycle = acquired.state;
        ids[trial] = acquired.id;
    }
    const registry = livingKindRegistry({extra: [row]});

    return {
        basis: 'authored', row, ration, ids, knownStock, wrongStock, mealAmount,
        calibration: {growthMinutes: {basis: 'authored', value: calibration.growthMinutes},
            mealAmount: statedAmount.basis === 'chapter' ? statedAmount : {basis: 'authored', value: mealAmount},
            rationMinutes: runtimeDuration},
        engine: {packs: [pack], shared: {quantities: [WORLD_QUANTITIES.stock]},
            holders: [{id: place, kind: 'place'},
                ...Object.values(ids).map(body => guBodyHolder(row, {id: body, place, satiety: ration})),
                {id: 'matching-supply', kind: 'thing', place, quantities: stock(knownStock)},
                {id: 'wrong-supply', kind: 'thing', place, quantities: stock([wrongStock])}]},
        mealOps(world, body, supply) {
            const source = world.holders[supply], target = world.holders[body];
            if (!source || !target || source.place !== target.place || target.state[pack]?.species !== id) return [];
            const matching = recipeAccounts.find(recipe => recipe.every(account => (source.quantities[account] ?? 0) >= mealAmount));
            const refill = ration - target.quantities.satiety;
            return matching && refill > 0 ? [
                ...matching.map(quantity => ({op: 'add', holder: supply, quantity, amount: -mealAmount})),
                {op: 'add', holder: body, quantity: 'satiety', amount: refill},
            ] : [];
        },
        read(world, body) {
            const holder = world.holders[body];
            return readLivingBody({lifecycle, registry, id: body, clock: world.clock, ration,
                satiety: {amount: holder.quantities.satiety, emptySince: holder.state[pack].emptySince}});
        },
    };
}
