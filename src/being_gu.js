// A kept Gu as a being record (CPR10). Read-only over the keeper house view row, which reads living_upkeep and the claims.
// Held grain, no tie: a Gu of this rank has no will to bargain with (CPR1 says one that grows a will becomes tied).
import {defineFamily, readBeing, beingCard} from './being_record.js';
import {defineLayer} from './creature_layers.js';

export const GU_FAMILY = defineFamily({id: 'family.gu', label: 'Gu', source: 'authored; Reverend Insanity keeper life',
    stages: [{id: 'living', label: 'Living Gu'}]});
export const REFINED = defineLayer({id: 'refined', label: 'Refined', source: 'authored: the keeper’s steeped Gu eats less',
    changes: [{path: 'tags', op: 'tag', value: 'refined'}]});
export const guDef = row => ({
    id: `being.gu.${row.id}`, name: row.label, species: row.label, family: GU_FAMILY,
    origin: 'Issued by the clan steward.', mind: {traits: []},
    layers: () => row.refined ? [REFINED] : [],
    steps: [
        {id: 'issued', when: () => true, holder: 'the clan steward', grain: 'held', stage: 'living', why: 'The clan house issued it, held in the steward’s care.'},
        {id: 'taken', when: () => row.kept, holder: 'you', grain: 'held', stage: 'living', why: 'You took it in: it eats from its own larder.'}],
    ties: () => []
});
export const guBeing = row => readBeing(guDef(row), {});
export function guCard(row) {
    const b = guBeing(row);
    return beingCard(b, {kind: 'upkeep', alive: row.alive, kept: row.kept, condition: row.condition, max: row.maxCondition, willEat: row.willEat !== false, worked: row.worked, lethal: row.lethal});
}
