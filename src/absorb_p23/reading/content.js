// Original proposals. Proto23's repeatable books and long sleep inspired the
// mechanisms only; no source code, prose or assets were copied.
export const ANTHOLOGY = 'Tales of the Lantern Road';
export const REST_MEAL = 'Packed long-rest meal';
export const ANTHOLOGY_KEY = JSON.stringify({id: ANTHOLOGY});
export const REST_KEY = JSON.stringify({id: REST_MEAL});
export const STORIES = Object.freeze([
    'A ferryman leaves a lantern for travelers who cannot pay. Years later, strangers rebuild his landing after a flood.',
    'An apprentice labels every crooked board. The marks become a map of how the workshop learned to make a straight door.',
    'Two neighbors share a kettle through a winter argument. Spring finds them still arguing, but planting the same garden.',
    'A lost courier follows repaired mileposts home and starts leaving spare nails at every inn.',
]);
export const LONG_REST_MINUTES = 18 * 60;
export const REST_BATCH_MINUTES = 5;
export const REGISTRATIONS = Object.freeze({
    anthology: {id: ANTHOLOGY, item_type: 'BOOK', value: 5, required_time: 12,
        literacy_xp_rate: 0, repeatable: true, source: 'Village trader stock, 1 physical owned copy'},
    rest: {id: REST_MEAL, item_type: 'OTHER', value: 4,
        description: 'Consume at a sleeping place after Sleeping level 5. Rest for up to eighteen played hours; cancel freely, with no meal refund.'},
    preparation: {id: 'p23.reading.pack_rest', duration: 4, skill: 'Cooking', level: 1,
        location: 'Village', costs: [{key: JSON.stringify({id:'Stale bread'}), count:2},
            {key: JSON.stringify({id:'Cooking herbs'}), count:2}], output: {key:REST_KEY,count:1}},
});
export function anthologyOutcome(draw) {
    if(!Number.isInteger(draw) || draw < 0 || draw > 0xffffffff) throw Error('Bind one saved uint32 reward draw.');
    return {draw, story: draw % STORIES.length, duration: 12 + ((draw >>> 2) % 13),
        literacyXp: 8 + ((draw >>> 6) % 9)};
}
