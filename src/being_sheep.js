// The meadow pen's fleece sheep as a being record (CPR10, FRC56). Read-only over the pen owner (habitat_care.js): the sheep is
// held once bought, and tied once your hand has brushed it. Its tie level is the keeper tie that fleece_from_care.js reads in
// Stardew friendship points, shown here on the shared bond ladder (one formula, two readers; no friendship store).
import {defineFamily, readBeing} from './being_record.js';
import {bondStage} from './companion_stage.js';
import {keeperTie, SHEEP_HOLDER} from './fleece_from_care.js';

export const SHEEP_FAMILY = defineFamily({id: 'family.fleece_sheep', label: 'Fleece sheep', source: 'authored; Village meadow pen',
    stages: [{id: 'grown', label: 'Grown ewe'}]});
export const SHEEP_DEF = Object.freeze({
    id: SHEEP_HOLDER, name: 'Your fleece sheep', species: 'fleece sheep', family: SHEEP_FAMILY,
    origin: 'Bought into your sheltered Village pen.', mind: {traits: ['placid'], temper: 'mild'}, grains: ['held', 'tied'],
    steps: [
        {id: 'bought', when: f => !!f?.animal, holder: 'you', grain: 'held', stage: 'grown', why: 'Bought into your pen: it eats your hay.'},
        {id: 'knows_you', when: f => !!f?.animal && f.attentions > 0, holder: 'you', grain: 'tied', stage: 'grown', why: 'Brushed by your hand, it has come to know you.'}],
    // Ten levels across 0..1000 points; the ladder word comes from companion_stage.
    ties: f => [{who: 'you', level: Math.floor(keeperTie(f) / 100)}]
});
export const readSheep = owner => readBeing(SHEEP_DEF, owner);
// One line for the pen panel: grain, ladder word and the points under it.
export function sheepTieLine(owner) {
    const b = owner?.animal ? readSheep(owner) : null;
    if(!b) return 'No sheep.';
    if(b.grain !== 'tied') return 'Held, not yet tied: brush it and it will come to know you.';
    const t = b.ties[0];
    return `Tie to you: ${bondStage(t.level).word} (${keeperTie(owner)} of 1000 from brushing and meals).`;
}
