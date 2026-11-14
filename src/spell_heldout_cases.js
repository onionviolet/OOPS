// Engine execution of held-out spell rows (PC72), the stronger test beside the diagnostic in
// spell_heldout.js. The rule's PREDICTED sentence drives the action; the evidence LABEL, read in world
// terms, is the `expect`. A row matches only when the engine, running the predicted sentence on a probe
// built from fixed dials shared by every row, changes the world as the label says. Nothing here reads
// HP_CASE_SCENES: those scenes were authored against each row and run the row's own truth, so they cannot
// test a prediction. Targeting is not an engine distinction (the target is a bound holder), so only the
// outcome is run. Classes: position (move), vitality (remove), form (transform form or size), mark-add
// (bind a motion, relation or mark), mark-drop (release a relation). Any other label object is reported per
// row as a missing mechanism, never forced.
import {sharedEffect} from './spell_effects.js';

export const DIALS = Object.freeze({amount: 5, vitality: 12, destination: 'b', mark: 'probe-mark', form: 'altered', start: 'original'});
const KEYS = Object.freeze({light: 'wand', essence: 'mana'});

/** The world-term class of a spell sentence in the shared vocabulary, or null when no generic probe exists. */
export function classOf(sentence) {
    const s = sharedEffect(sentence);
    if (s.gap) return null;
    if (s.verb === 'move' && s.object === 'position') return 'position';
    if (s.verb === 'remove' && s.object === 'vitality') return 'vitality';
    if (s.verb === 'transform' && s.object === 'form') return 'form';
    if (s.verb === 'bind' && ['position', 'relation'].includes(s.object)) return 'mark-add';
    if (s.verb === 'release' && s.object === 'relation') return 'mark-drop';
    return null;
}

const at = id => ({shape: 'holder', id});
const detailsOf = cls => ({position: {to: DIALS.destination}, vitality: {amount: DIALS.amount}, form: {value: DIALS.form},
    'mark-add': {mark: DIALS.mark}, 'mark-drop': {mark: DIALS.mark}})[cls];
const expectOf = cls => ({
    position: {position: true, direction: 'changed', to: DIALS.destination},
    vitality: {quantity: 'vitality', direction: 'down'},
    form: {property: 'form', direction: 'changed', to: DIALS.form},
    'mark-add': {property: 'marks', direction: 'changed', to: [DIALS.mark]},
    'mark-drop': {property: 'marks', direction: 'changed', to: []},
})[cls];

/** One outcome case: {data} or {cannot, missing}. predicted and label are spell sentences (verb, object, time). */
export function outcomeCase(predicted, label) {
    if (!predicted) return {cannot: 'no prediction (no identity evidence named an intent)', missing: 'data'};
    const want = classOf(label);
    if (!want) return {cannot: `the engine has no generic world term for ${label.verb} ${label.object}`, missing: 'mechanism'};
    const did = classOf(predicted);
    if (!did) return {cannot: `no generic probe for the predicted ${predicted.verb} ${predicted.object}`, missing: 'probe'};
    const shared = sharedEffect(predicted);
    const holder = {id: 'subject', kind: 'body', place: 'a', quantities: {vitality: DIALS.vitality},
        properties: {form: DIALS.start, marks: want === 'mark-drop' ? [DIALS.mark] : []}};
    return {data: {basis: 'authored',
        world: {clock: 0, holders: [{id: 'a', kind: 'place'}, {id: DIALS.destination, kind: 'place'}, holder]},
        sentence: {verb: shared.verb, object: shared.object, target: 'bound', time: shared.time, carrier: 'spoken-spell', cost: 'stamina', limits: []},
        details: {target: at('subject'), ...detailsOf(did)}, keys: {...KEYS}, cause: 'spell-held-out',
        expect: [{holder: 'subject', ...expectOf(want)}]}};
}

/** Run each row's outcome case through `run` (the generic case runner, passed in so src imports no script).
 * sentences: Map id -> predicted sentence or null. Entry: {id, outcome: 'match' | 'mismatch' | 'cannot: <why>', missing}. */
export async function executeSpellRows(rows, sentences, run) {
    const results = [];
    for (const r of rows) {
        const built = outcomeCase(sentences.get(r.id) ?? null, r.truth);
        let outcome;
        if (built.cannot) outcome = `cannot: ${built.cannot}`;
        else {
            try {
                const out = await run(built.data);
                outcome = out.state.startsWith('expressed-') || out.state.startsWith('runs-') ? 'match'
                    : out.state === 'blocked:runner-expect-mismatch' ? 'mismatch' : `cannot: ${out.state} ${out.detail ?? ''}`.trim();
            } catch (error) { outcome = `cannot: ${error.message}`; }
        }
        results.push({id: r.id, outcome, missing: built.missing ?? null});
    }
    return results;
}
