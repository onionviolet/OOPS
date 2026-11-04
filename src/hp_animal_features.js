// Polyjuice with animal hair (book.hp): the lasting features as a staged
// recovery on the shared affliction seam (AD51 consumer, proposal 2026-11-03).
// Canon fixed point (AD49): the features took several weeks in the hospital
// wing to clear (book.hp.ev.long_recovery). Stage wording, the weekly check,
// the DC and the care bonus are original dials calibrated to that: about five
// weeks with hospital care, about eight without.
import {defineAffliction, WEEK} from './affliction_track.js';

export const ANIMAL_FEATURES = defineAffliction({id: 'animal_features', label: 'Animal features', kind: 'transformation mishap', dc: 15,
    // A mishap that is wearing off does not spread: a failed check means no change yet.
    shift: [0, 0, -1, -2],
    source: 'book.hp.ev.animal_sample, book.hp.ev.long_recovery; stages and numbers original',
    stages: [
        {duration: WEEK, text: 'A few stray whiskers are all that is left.'},
        {duration: WEEK, text: 'The fur is thinning and the tail has shrunk.'},
        {duration: WEEK, text: 'Fur on your face, a tail and animal eyes.'},
    ]});
export const HOSPITAL_CARE = Object.freeze({kind: 'hospital_wing', bonus: 5});
// The body's own check: a child pupil with no special resistance.
export const BODY_SAVE_MODIFIER = 0;
