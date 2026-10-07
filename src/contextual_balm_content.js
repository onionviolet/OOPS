// Original contextual use of the existing native Healing balm. No new item,
// recipe, stock source, clock, condition identity, or publication owner.
export const CONTEXTUAL_BALM_IDS = Object.freeze({
    group: 'contextual_balm',
    prefix: 'contextual_balm.',
    dress: 'contextual_balm.dress_scraped_palms',
    receipt: 'contextual_balm.treatment',
    version: 'contextual_balm.version',
    itemId: 'Healing balm',
    effectId: 'Weak healing balm',
    location: 'base.frontier',
});

const key = id => JSON.stringify({id});
const eq = (fact,value=true) => ({fact,op:'eq',value});
const all = (...rules) => ({all:rules});
const I = CONTEXTUAL_BALM_IDS;
const scrape = eq('contextualBalm.scraped');
const supported = eq('contextualBalm.supportedBody');
const safePlace = eq('contextualBalm.safePlace');
const available = eq('contextualBalm.hasBalm');

export const CONTEXTUAL_BALM_DEFINITIONS = Object.freeze({
    commands: Object.freeze([{
        id: I.dress,
        revision: 1,
        actorId: 'player',
        group: I.group,
        label: 'Dress scraped palms · 1 Healing balm · 1 min',
        duration: 1,
        costs: [{type:'item',key:key(I.itemId),amount:-1}],
        effects: [
            {type:'condition',id:'body.scraped_hands',operation:'remove'},
            {type:'fact',scope:'actor',key:I.version,value:1},
            {type:'knowledge',key:I.receipt,stage:'understood',
                value:'One existing Healing balm was spent over one played minute to remove the current palm scrape. Soreness, permanent marks, learned grip, health and stamina were left to their existing owners.'},
        ],
        visibleWhen: all(supported,safePlace,scrape,available),
        requires: all(supported,safePlace,scrape,available),
        completionRequires: all(supported,safePlace,scrape),
        completionFailure: 'refund',
        cancellation: 'refund',
        reservationReturns: 1,
        description: 'Reserve one actually owned, unborrowed, unequipped Healing balm for one supported played minute in Village or Shack. Completion removes only the active scrape and stages its existing Weak healing balm effect. Lost support, cancellation, or natural scrape expiry returns this same balm without a treatment receipt or effect. Soreness, permanent marks, learned grip, health and stamina remain unchanged.',
    }]),
});

export const CONTEXTUAL_BALM_NATIVE_EFFECT_REQUEST = Object.freeze({
    schema: 1,
    operation: 'stage-existing-native-item-effect',
    itemId: I.itemId,
    itemTemplateEffect: I.effectId,
    activeEffectsKey: I.effectId,
    duration: 90,
    durationMerge: 'max-existing-remaining-and-remaining-new-duration',
    preserveOtherEffects: true,
    // ActiveEffect's existing serialized record shape. The constructor adds
    // bonus_skill_levels to effects and effect:true to tags.
    template: Object.freeze({
        name: I.effectId,
        description: null,
        effects: Object.freeze({
            stats: Object.freeze({
                health_regeneration_flat: Object.freeze({flat:5}),
                health_regeneration_percent: Object.freeze({flat:0.5}),
            }),
            bonus_skill_levels: Object.freeze({}),
        }),
        affected_by_travel: true,
        base_xp_value: 1,
        tags: Object.freeze({effect:true,buff:true,medicine:true}),
        group_tags: Object.freeze({}),
        potency: 0,
    }),
});
