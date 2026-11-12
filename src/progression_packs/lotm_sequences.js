// Lord of the Mysteries sequence steps as path rows (PRG1, PRG14, PRG15), with the two lore laws the plan
// routes to R as fixed points (LR1, LR3, LR4, AD49). The rows wrap the descriptors the LOTM owners already
// play (`seerPathway`, the pathway rows), so no second ladder is made. Digestion is the count track the live
// game already reads (book_world_lotm_digestion.js). Identities follow the proposed `lotm_potions` ledger ids
// (`lotm.<pathway>.seq<n>`); when B's ledger lands, `LOTM_POTION_IDS` is the one place to re-key.
//
// Locators: `chN PM` is chapter N, paragraph M of the official English edition, as in
// docs/gm/dispatch/refinement-audits-2026-10-31/L2_DIGESTION_ACTING_NOTE.md; `0209` is an EPUB member id as in
// docs/gm/dispatch/potion-pathways-2026-10-24/BREWING_AND_HIGHER_SEQUENCES.md. Paraphrase only.
import {definePathRow} from '../progression_path.js';
import {seerPathway} from '../book_world_lotm_path.js';
import {rowDescriptor} from '../book_world_lotm_pathways.js';
import {ccRow} from '../book_world_lotm_rows.js';
import {LOTM_DIGEST_ACTS} from '../book_world_lotm_ids.js';
import {DIGESTION_FELT} from '../book_world_lotm_digestion.js';

export const LOTM_LORE = Object.freeze([
    {code: 'LR3', law: 'Beyonder characteristics are conserved: never destroyed, they leave the dead and gather; a pathway\'s total is fixed',
        locators: ['0209', '0220'], label: 'stated', reads: 'PRG15 conserves on each ingest step; W conservation law and M claims take the released identity'},
    {code: 'LR3b', law: 'A higher characteristic holds the lower ones of its pathway',
        locators: ['C0295'], label: 'stated', reads: 'PRG15 releases the highest identity containing the rest'},
    {code: 'LR4', law: 'A potion digests by acting its role; the drinker senses completion',
        locators: ['ch21 P8', 'ch101 P29-30', 'ch93 P33-34', 'ch167 P55'], label: 'shown and told', reads: 'count track `acting` that only in-role acts raise; felt words, not a bar'},
    {code: 'LR4b', law: 'Advancing undigested is a route to loss of control; digestion lowers the risk without removing it',
        locators: ['ch295 P11', 'ch1380 P23', 'ch451 P48', 'ch168 P8'], label: 'inferred by characters', reads: 'PRG14 rush: pressure in proportion to what was undigested, residual when digested; A reads it as madness, L as harm'},
]);

// Proposed ledger ids for B's `lotm_potions` (shared notes, 2026-11-12).
export const LOTM_POTION_IDS = Object.freeze({
    seer: {seq9: 'lotm.seer.seq9', seq8: 'lotm.seer.seq8'},
    cc: {seq9: 'lotm.corpse_collector.seq9', seq8: 'lotm.corpse_collector.seq8'},
});

const dials = {
    rushPressure: {default: 2, reason: 'Pressure from drinking the next potion with the last one wholly undigested; matches the live `rushed` cause (EPUB 0018, 0106)'},
    residualPressure: {default: 0, reason: 'A digested Seq 9 to 8 step carries next to no residue; the text says risk stays non-zero (ch451 P48), set near zero at this rung and raised for higher ones'},
};
const sequenceRow = (path, digest, ids) => definePathRow({path, ceiling: 2, dials,
    tracks: {acting: {kind: 'count', need: digest, felt: [...DIGESTION_FELT]}},
    steps: {
        seq9: {open: 'working', conserves: ids.seq9, felt: 'The potion takes hold.'},
        seq8: {open: 'working', conserves: ids.seq8, felt: 'The new potion takes.',
            rush: {track: 'acting', pressure: 'rushPressure', residual: 'residualPressure', felt: 'The new potion takes, and something of the last one has not settled.'}},
    }});

export const lotmSeerRow = sequenceRow(seerPathway, LOTM_DIGEST_ACTS, LOTM_POTION_IDS.seer);
export const lotmCorpseCollectorRow = sequenceRow(rowDescriptor(ccRow), ccRow.digest, LOTM_POTION_IDS.cc);
