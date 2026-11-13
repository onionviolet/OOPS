import {guGarden} from '../gu_garden_host.js';

export const keeperVitality = 'book.ri.keeper.vitality_garden';
export const keeperVitalityLeaf = JSON.stringify({id: `${keeperVitality}.leaf`});
export const leafGrowthMinutes = 15;
export const vitalityGarden = Object.freeze({
    id: keeperVitality, world: 'book.ri.keeper.world', place: 'book.ri.keeper.annex',
    custodian: 'book.ri.keeper.steward', plantId: `${keeperVitality}.plant`, key: `${keeperVitality}.bed`,
    producerKind: 'vitality-grass', productKind: 'vitality-leaf', productId: `${keeperVitality}.leaf`,
    item: keeperVitalityLeaf, pool: 'red-steel',
    // Authored: fifteen-minute stem recovery, native daylight window and bounded record size.
    growthMinutes: leafGrowthMinutes, daylight: {start: 360, end: 1080}, dayMinutes: 1440, maxRecordLength: 512,
    ops: {borrow: 'borrow_grass', return: 'return_grass', grow: 'grow_leaf', harvest: 'harvest_leaf',
        treat: 'treat_leaf', sell: 'sell_leaf'},
});
export const vitalityOperations = Object.values(vitalityGarden.ops).filter(op => op !== vitalityGarden.ops.sell);
export const {facts: keeperVitalityFacts, view: keeperVitalityView, validate: validateKeeperVitality,
    apply: applyKeeperVitalityEffect} = guGarden(vitalityGarden);
