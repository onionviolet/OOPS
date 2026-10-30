// LP8 proposal: project existing committed work, never advance on inspection.
// The simulation's ordinary command receipts also own reward collection.
export const DRYING_REWARD_ID = 'feature_objects.collect_drying_sap';
export const DRYING_BATCH_IDS = Object.freeze(['shade', 'braced', 'shelf'].map(route => `feature_objects.dry_${route}`));
const count = (state, id) => state.actors?.player?.completed?.[id] || 0;

export function earnedDryingTracker(state) {
    if(state.actors?.player?.facts?.['feature_objects.introduced'] !== true) return null;
    const completed = DRYING_BATCH_IDS.reduce((sum, id) => sum + count(state, id), 0);
    const collected = count(state, DRYING_REWARD_ID);
    const progress = completed - collected * 2;
    return {completed, collected, progress, ready: progress >= 2,
        id: 'earned_drying', text: `Drying work (proposal): ${completed} batches completed. Next reward at ${(collected + 1) * 2} batches; ${collected} Tree sap collected. Each finished drying job counts once, after spending its wet stave, stamina and time. Collect one Tree sap from Eda’s available stock. This records local drying work.`};
}

export const dryingRewardDefinition = {
    id: DRYING_REWARD_ID,
    label: 'Collect earned drying reward · 1 Tree sap from Eda’s stock',
    targetId: 'feature_objects.miri', coLocated: true, participants: ['$target'],
    visibleWhen: {fact: 'actor.feature_objects.introduced', op: 'eq', value: true},
    requires: {all: [
        {fact: 'featureObjects.supported', op: 'eq', value: true, reason: 'Return to the Village with your supported living body.'},
        {fact: 'featureObjects.handsUsable', op: 'eq', value: true, reason: 'Recover your hands before collecting.'},
        {fact: 'vital.health', op: 'gte', value: 2},
        {fact: 'featureObjects.miriSupported', op: 'eq', value: true, reason: 'Eda must be present and willing.'},
        {fact: 'earnedDrying.ready', op: 'eq', value: true, reason: 'Complete two drying batches for each Tree sap reward. Inspection and cancelled work do not count.'},
    ]},
    costs: [{type: 'transfer', from: 'feature_objects.miri', to: 'player', key: JSON.stringify({id: 'Tree sap'}), count: 1}],
    effects: [],
    description: 'Every two completed drying batches earn one Tree sap from Eda’s finite stock, useful for edge repair or survey kits. Collection spends those two receipts toward this reward. Further rewards require further work and available stock.',
};
