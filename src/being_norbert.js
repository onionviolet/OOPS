// Norbert as a being record (CPR10, CPR24). Read-only over the HP window's own completed acts: no pack change, no save slice.
// Egg held at Hagrid's, then hatchling tied to Hagrid, carried in the crate by you and Hermione, then with Charlie's friends.
// One family row names egg, hatchling and adult (CPR24). Ties are authored calibration from the scene (Hagrid's own, a bite for Ron).
import {defineFamily, readBeing, beingCard} from './being_record.js';
import {HP_LEAD_NORBERT} from './book_world_hp_lead_norbert.js';

export const RIDGEBACK = defineFamily({id: 'family.norwegian_ridgeback', label: 'Norwegian Ridgeback', source: 'authored from the Book 1 scene; stage shape after the Hogwarts Legacy family row (CPR14)',
    stages: [{id: 'egg', label: 'Egg', eats: false}, {id: 'hatchling', label: 'Hatchling'}, {id: 'adult', label: 'Adult Ridgeback'}]});
const done = (f, act) => (f.completed?.[`${HP_LEAD_NORBERT}.${act}`] || 0) > 0;
export const NORBERT = {
    id: 'being.hp.norbert', name: 'Norbert', species: 'Norwegian Ridgeback', family: RIDGEBACK,
    origin: 'Won at cards by Hagrid from a hooded stranger.',
    mind: {traits: ['fierce', 'fond of Hagrid'], temper: 'bites'},
    steps: [
        {id: 'egg', when: f => done(f, 'hut'), holder: 'Hagrid', grain: 'held', stage: 'egg', why: 'Hagrid won the egg at cards and keeps it in his hut.'},
        {id: 'hatched', when: f => done(f, 'hatch'), holder: 'Hagrid', grain: 'tied', stage: 'hatchling', why: 'It hatched at Hagrid’s table and took to him: no longer an item to hold, a being with a mind.'},
        {id: 'crated', when: f => done(f, 'collect'), holder: 'you and Hermione', grain: 'tied', stage: 'hatchling', why: 'You and Hermione took charge of the crate for the night.'},
        {id: 'handed', when: f => done(f, 'handoff'), holder: 'Charlie’s friends', grain: 'tied', stage: 'hatchling', why: 'Charlie’s friends took custody at the tower.'}],
    ties: (f, stage) => done(f, 'handoff') ? [{who: 'Hagrid', level: 6}, {who: 'Charlie’s friends', level: 1}]
        : [{who: 'Hagrid', level: 6}, {who: 'you', level: 1}, {who: 'Ron', level: 0}]
};
export const norbertFacts = state => ({completed: state?.actors?.player?.completed || {}});
export function norbertBeing(state) { return readBeing(NORBERT, norbertFacts(state)); }
export function norbertCard(state) {
    const b = norbertBeing(state); if (!b) return null;
    const f = norbertFacts(state), handed = done(f, 'handoff');
    return beingCard(b, {kind: 'provisioned', by: handed ? 'Charlie’s friends' : 'Hagrid', stocked: b.custody.at(-1).step === 'crated'});
}
