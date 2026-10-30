// Shadow Slave rank ladder as a path descriptor (second world on the shared ASC seam, after Mistglass;
// no LOTM code). Rungs follow the registry row ss.law.rank-system (Dormant to Divine) and the crossings follow
// ss.law.rank-advancement (Second Nightmare survived: Ascended; Third Nightmare conquered: Transcendent).
// Rows past Transcendent state only a name, so their crossings are recognition placeholders owned by no
// system yet. Wording is original; no book text. The creature ladder is a separate path (company pack).
import {definePath} from './ascension_paths.js';

const rung = (id, label, crossing, grants = []) => ({id, label, grants, crossings: crossing ? [crossing] : []});
const trial = (id, label, fact, irreversible = true) => ({id, type: 'trial', label, fact, need: true, irreversible});
const unowned = (id, label, fact) => ({id, type: 'recognition', label, fact, need: true, irreversible: true});

export const ssRankPath = definePath({id: 'ss.rank', world: 'book.ss', label: 'Aspect rank', shape: 'ladder', stages: [
    rung('dormant', 'Dormant'),
    rung('awakened', 'Awakened', trial('first_nightmare', 'Survive the First Nightmare', 'firstNightmare'), ['Awakened Aspect and Abilities']),
    rung('ascended', 'Ascended', trial('second_nightmare', 'Survive the Second Nightmare', 'secondNightmare'), ['Enter and leave the Dream Realm at will']),
    rung('transcendent', 'Transcendent', trial('third_nightmare', 'Conquer the Third Nightmare', 'thirdNightmare'), ['Cross between waking world and Dream Realm bodies']),
    rung('supreme', 'Supreme', unowned('supreme_recognition', 'Rank not yet modelled', 'supremeReached')),
    rung('sacred', 'Sacred', unowned('sacred_recognition', 'Rank not yet modelled', 'sacredReached')),
    rung('divine', 'Divine', unowned('divine_recognition', 'Rank not yet modelled', 'divineReached')),
]});
// Names the player can read at the start of a life: the first four rungs. Higher names show as ???.
export const SS_KNOWN_RUNGS = 4;
