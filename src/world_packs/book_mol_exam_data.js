// Zorian's class tests as native Cyoria commands (GTR14: an exam is a check whose risk is in its outcomes; GTR26: attempts are visible).
// Built with windowKit; data over facts that mol_zorian_exams.js computes; the model is src/mol_exam_model.js.
//   revise_<subject>  repeatable revision before this run's paper; adds one soul-bound session (memory of the notes crosses the restart)
//                     up to the cap, summed over every run. Costs stamina.
//   exam_<subject>    one sitting per run on or after its day; the outcome is the band, rolled with the exact chances and saved as an
//                     actor fact that resets with the run (the world forgets the mark), beside a soul-bound note of it and of one more
//                     sitting (he remembers the questions). Formulas is the mark for Nora's placement test, which the pack already holds.
import {EXAM_SUBJECTS, BANDS, BAND_WORDS, REVISION_CAP} from '../mol_exam_model.js';
import {windowKit, all, eq} from '../window_chain.js';
const W = 'book.mol.cyoria', PLACEMENT = 'book.mol.zorian.s0.placement_test';
export const MOL_EXAM_KIT = windowKit({prefix: 'book.mol.zorian.exam'});
const K = MOL_EXAM_KIT;
export const MOL_EXAM_IDS = Object.freeze({revise: s => K.local(`revise_${s}`), paper: s => K.local(`exam_${s}`), placement: PLACEMENT,
    sessions: s => `book.mol.loop.exam.rev.${s}`, sat: s => `book.mol.loop.exam.sat.${s}`, band: s => `book.mol.zorian.exam.band.${s}`,
    last: s => `book.mol.loop.exam.last.${s}`});
// The ready gate every Zorian school command uses (the pack's placement test has the same three plus the seat).
const ready = all(eq('mol.nativeBound'), eq('mol.playerSupported'), eq(`mol.local.${W}`));
const act = K.chain({worldId: W, location: 'Cyoria academy guest library', admitted: eq('mol.zorianSeat'), ready,
    defaultReason: 'You need to be yourself in Cyoria, at the place the work is done.'});
const shown = eq('mol.exam.shown');
const resource = (key, amount = 1) => ({type: 'resource', actor: 'player', key, amount});
export const MOL_REVISE_STAMINA = 1;
const DURATION = Object.freeze({formulas: 10, mathematics: 60, warding: 90});
const sitting = s => s.id === 'formulas'
    ? `Nora hands back the 60-question placement test you sat. Everything you have learnt of her subject counts, in this run and the ones before.`
    : `${s.teacher === 'Nora' ? 'Nora’s' : 'The'} ${s.label} test. What you revised, what you studied and every earlier time you sat this same paper count.`;
export const molExamCommands = [
    ...EXAM_SUBJECTS.map(s => act(`revise_${s.id}`, `Revise ${s.label} · 90 min, ~${MOL_REVISE_STAMINA} stamina`, 90, shown,
        `Go over your ${s.label} notes in the library. What you go over stays with you when the month starts again; past ${REVISION_CAP} sessions in all the notes add nothing.`,
        [resource(MOL_EXAM_IDS.sessions(s.id)), K.note(`${s.id}.revised`, `You have gone over your ${s.label} notes until the order of things is clear.`)],
        {repeat: true, costs: [K.vital('stamina', -MOL_REVISE_STAMINA)], group: 'book_mol',
            needs: [eq(`mol.exam.revise.${s.id}`)], reason: `${s.label} revision helps until this run’s paper is sat, and stops adding after ${REVISION_CAP} sessions across every run.`})),
    ...EXAM_SUBJECTS.map(s => act(`exam_${s.id}`, s.id === 'formulas' ? `Get your placement test back from Nora · ${DURATION.formulas} min` : `Sit the ${s.label} test · ${DURATION[s.id]} min`,
        DURATION[s.id], shown, sitting(s), [resource(MOL_EXAM_IDS.sat(s.id))],
        {group: 'book_mol', location: s.location,
            needs: [eq(`mol.exam.open.${s.id}`)], reason: s.id === 'formulas' ? 'Sit Nora’s placement test first; she returns it from day 3, once a month.' : `The ${s.label} test is set on day ${s.day} of the month; you sit it once a month.`,
            outcomes: BANDS.map(b => ({id: b, weight: {fact: `mol.exam.p.${s.id}.${b}`},
                effects: [{type: 'fact', actor: 'player', scope: 'actor', key: MOL_EXAM_IDS.band(s.id), value: b},
                    {type: 'fact', actor: 'player', scope: 'actor', key: MOL_EXAM_IDS.last(s.id), value: b},
                    K.note(`${s.id}.mark`, `${s.label}: ${BAND_WORDS[b]}. You will remember the questions if the month comes round again.`)]}))}))];
