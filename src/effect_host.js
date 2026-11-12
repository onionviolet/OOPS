// The one effect host (PC8, KW11): the joint between a settled kernel working
// and the shared world. A K law publishes an effect that carries a sentence
// (`{sentence, details}`); this lands it through `lowerEffect` and
// `applySentence`. It names no world and no domain: the world's rules, keys
// and place come from the caller. Objects that lower to no W act (force,
// lifespan, mind, information, memory, working) wait as publishes for their
// owner; no placeholder act stands in for them. A publish counts as answered
// only when a loaded reactor hears its kind and the details name a place.
// One vocabulary (PC81): a sentence in a domain's own words is read through the
// reader its caller passes (`read`, for spells `sharedEffect` in spell_effects.js)
// before lowering. The host imports no domain; a word with no reading is named.
import {lowerEffect, applySentence, EFFECT_VERBS, EFFECT_OBJECTS} from './effect_grammar.js';

const empty = world => ({world, status: null, word: null, changed: false, acts: [], outcomes: [], published: [], waiting: [], needs: [], reason: null});
const answers = (rules, kind) => rules.reactors.some(r => r.reactor.on.includes(kind));

// effect: {sentence, details?}. Returns {world, status, changed, acts, outcomes, published, waiting, needs, reason}.
// status: landed (state changed), idle (acts ran, nothing changed), published (an owner's answer ran),
// waiting (publishes only, no owner answers), needs-key (a keyed family has no key), unmapped (the
// sentence uses a word with no P reading; `word` and the reason name it), label-only (the effect carries no sentence).
export function landEffect(rules, world, effect, {cause, by, keys = {}, read = null} = {}) {
    const out = empty(world);
    if (!effect?.sentence) return {...out, status: 'label-only', reason: `effect ${effect?.kind ?? '(none)'} carries no sentence, so nothing can land it`};
    const details = effect.details ?? {};
    let sentence = effect.sentence;
    if (!EFFECT_VERBS.includes(sentence.verb) || !(sentence.object in EFFECT_OBJECTS)) {
        if (!read) return {...out, status: 'unmapped', word: `${sentence.verb} ${sentence.object}`, reason: `${sentence.verb} ${sentence.object} is outside the shared vocabulary and the caller passed no reader`};
        const shared = read(sentence);
        if (shared.gap) return {...out, status: 'unmapped', word: shared.gap, reason: `${shared.gap} has no P reading yet: ${shared.reason}`};
        sentence = {...sentence, ...shared};
    }
    let lowered;
    try { lowered = lowerEffect(sentence, {keys, key: details.key ?? null}); }
    catch (error) { return {...out, status: 'unmapped', reason: error.message}; }
    if (lowered.needs.length) return {...out, status: 'needs-key', needs: lowered.needs, reason: `needs a world key: ${lowered.needs.join(', ')}`};
    const delivered = new Set(lowered.publish.filter(p => details.place && answers(rules, p.kind)).map(p => p.kind));
    const run = applySentence(rules, world, sentence, details, {keys, cause, by, publishIf: kind => delivered.has(kind)});
    const waiting = lowered.publish.filter(p => !delivered.has(p.kind));
    const changed = run.outcomes.some(o => o.applied.length > 0) || run.published.length > 0;
    const status = changed ? (lowered.acts.length ? 'landed' : 'published') : waiting.length && !lowered.acts.length ? 'waiting' : 'idle';
    return {world: run.world, status, changed, acts: lowered.acts, outcomes: run.outcomes, published: run.published, waiting, needs: [],
        reason: status === 'waiting' ? `waiting for an owner: ${waiting.map(p => `${p.kind} (${p.owner ?? 'none'})`).join(', ')}` : null};
}
