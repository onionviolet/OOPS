// Shadow Slave rank ladder as a path descriptor (second world on the shared ASC seam, after Mistglass;
// no LOTM code). Rungs follow the registry row ss.law.rank-system (Unwoken to Unbound) and the crossings follow
// ss.law.rank-advancement (Second Trial survived: Risen; Third Trial conquered: Crowned).
// Rows past Crowned state only a name, so their crossings are recognition placeholders owned by no
// system yet. Wording is original; no book text. The creature ladder is a separate path (company pack).
import {definePath} from './ascension_paths.js';

const rung = (id, label, crossing, grants = []) => ({id, label, grants, crossings: crossing ? [crossing] : []});
const trial = (id, label, fact, irreversible = true) => ({id, type: 'trial', label, fact, need: true, irreversible});
const unowned = (id, label, fact) => ({id, type: 'recognition', label, fact, need: true, irreversible: true});

export const ssRankPath = definePath({id: 'ss.rank', world: 'book.ss', label: 'Rank', shape: 'ladder', stages: [
    rung('unwoken', 'Unwoken'),
    rung('woken', 'Woken', trial('first_trial', 'Survive the First Trial', 'firstTrial'), ['Woken gifts']),
    rung('risen', 'Risen', trial('second_trial', 'Survive the Second Trial', 'secondTrial'), ['Enter and leave the Far Reach at will']),
    rung('crowned', 'Crowned', trial('third_trial', 'Conquer the Third Trial', 'thirdTrial'), ['Cross between waking world and Far Reach bodies']),
    rung('radiant', 'Radiant', unowned('supreme_recognition', 'Rank not yet modelled', 'supremeReached')),
    rung('hallowed', 'Hallowed', unowned('sacred_recognition', 'Rank not yet modelled', 'sacredReached')),
    rung('unbound', 'Unbound', unowned('divine_recognition', 'Rank not yet modelled', 'divineReached')),
]});
// Names the player can read at the start of a life: the first four rungs. Higher names show as ???.
export const SS_KNOWN_RUNGS = 4;
