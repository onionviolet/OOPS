// Reverend Insanity Gu Master rank as a path row (PRG1, PRG11). World numbers only; the rule is
// progression_path.js. Written by chat R as the first Gu consumer; G takes it over with the rest of
// the Gu world pack (SC5). Rank One sub-stages stay recognition crossings that G's scenes supply
// until G moves them onto essence purity; Rank Two is a working that presses the aperture wall.
//
// Calibration (AD49) from volume one chapters 87-92, as the lead scene `book_gu_lead_rank_two.js`
// already plays it: 38 parts pressed alone fail and the cracks close; a full sea of 44 plus six
// primeval stones passes, spending 24 parts of the sea and all six stones, about 20 left. With one
// stone yielding y parts the wall takes 24 + 6y; the assessment scene shows a stone yields at least
// 15 (y >= 15), so any wall of 114 or more fits both outcomes. 114 (y = 15) is an authored proposal
// (WPR5), not a chapter number.
import {definePathRow} from '../progression_path.js';

export const RI_STONE_PARTS = 15;
const recognized = (id, label, fact) => ({id, type: 'recognition', label, fact, need: true, irreversible: true});

export const riGuMasterRow = definePathRow({
    revision: 1,
    path: {id: 'ri.gu_master', world: 'book.ri', label: 'Gu Master rank', shape: 'ladder', stages: [
        {id: 'rank1_initial', label: 'Rank One, initial stage', crossings: [], grants: ['An opened aperture with a sea of essence']},
        {id: 'rank1_middle', label: 'Rank One, middle stage', crossings: [recognized('middle', 'Middle-stage essence', 'rank1.middle')], grants: []},
        {id: 'rank1_upper', label: 'Rank One, upper stage', crossings: [recognized('upper', 'Upper-stage essence', 'rank1.upper')], grants: []},
        {id: 'rank1_peak', label: 'Rank One, peak stage', crossings: [recognized('peak', 'Peak-stage essence', 'rank1.peak')], grants: []},
        {id: 'rank2_initial', label: 'Rank Two, initial stage',
            crossings: [{id: 'aperture', type: 'structure', label: 'An active aperture behind an unbroken white crystal wall', fact: 'apertureActive', need: true}],
            grants: ['Rank Two essence mixing into the sea', 'Leave to drop one clan mission a year, with a penalty'],
            failure: {signs: 'Hairline cracks across the white crystal wall', outcome: 'The cracks knit shut when the sea runs low or the pressing lapses'}},
    ]},
    dials: {
        wallParts: {default: 24 + 6 * RI_STONE_PARTS, reason: 'Essence the Rank One peak wall takes to break, calibrated to the chapters 87-92 attempt'},
        wallMinutes: {default: 3 * 1440, reason: 'Three nights of unbroken pressing before the wall gives on the fourth day'},
    },
    steps: {
        rank1_middle: {open: 'auto'}, rank1_upper: {open: 'auto'}, rank1_peak: {open: 'auto'},
        rank2_initial: {open: 'working', minutes: 'wallMinutes', supply: {fact: 'pressable', need: 'wallParts'},
            felt: 'The white crystal wall gives way.',
            fail: {reason: 'Your sea ran too low to keep pressing; the cracks knit shut.', felt: 'Hairline cracks open, then close again.'}},
    },
});
