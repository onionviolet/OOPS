// A kept Gu as a being record (CPR10). Read-only over the keeper house view row, which reads living_upkeep and the claims.
// A Gu is held, with no tie: it has no will to bargain with. A refined Gu is the exception (proposal, dial `bindsOnRefine`):
// refinement binds it to you and it becomes tied, keeping its id. A tied Gu remembers being pushed hungry (`resents`): the work
// command in the pack reads the same fact, so what the tie reader says (snaps, will not work) is what the verb does.
import {defineFamily, readBeing, beingCard} from './being_record.js';
import {defineLayer} from './creature_layers.js';

export const GU_FAMILY = defineFamily({id: 'family.gu', label: 'Gu', source: 'authored; Reverend Insanity keeper life',
    stages: [{id: 'living', label: 'Living Gu'}]});
export const REFINED = defineLayer({id: 'refined', label: 'Refined', source: 'authored: the keeper’s steeped Gu eats less',
    changes: [{path: 'tags', op: 'tag', value: 'refined'}]});
export const guDef = row => ({
    id: `being.gu.${row.id}`, name: row.label, species: row.label, family: GU_FAMILY,
    origin: 'Issued by the clan steward.', mind: !row.canRefine ? {traits: []} : {traits: ['restless'], temper: 'bites'},
    layers: () => row.refined ? [REFINED] : [],
    steps: [
        {id: 'issued', when: () => true, holder: 'the clan steward', grain: 'held', stage: 'living', why: 'The clan house issued it, held in the steward’s care.'},
        {id: 'taken', when: () => row.kept, holder: 'you', grain: 'held', stage: 'living', why: 'You took it in: it eats from its own larder.'},
        {id: 'bound', when: () => row.kept && row.refined && row.canRefine, holder: 'you', grain: 'tied', stage: 'living', why: 'The refinement bound it to you: it is no longer only held, it has a will of its own to answer you.'}],
    // Level is the Gu's own standing with you: settled until pushed hungry, then it will not answer.
    ties: () => [{who: 'you', level: row.resents ? 0 : 4}]
});
export const guBeing = row => readBeing(guDef(row), {});
export function guCard(row) {
    const b = guBeing(row);
    return beingCard(b, {kind: 'upkeep', alive: row.alive, kept: row.kept, condition: row.condition, max: row.maxCondition, willEat: row.willEat !== false, worked: row.worked, lethal: row.lethal});
}
