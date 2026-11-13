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
import {resolveReach, resolveTargets, spellContactBarrier} from './world_effects.js';

const empty = world => ({world, status: null, word: null, changed: false, acts: [], outcomes: [], published: [], waiting: [], needs: [], reason: null});
const answers = (rules, kind) => rules.reactors.some(r => r.reactor.on.includes(kind));

// An identity aim uses the current place of that holder. A custody effect can
// then resolve a held implement at that place without broadening the aim.
function contactDetails(world, details, contact, sentence) {
    const target = world.holders[details.target?.id];
    const place = target?.place ?? target?.id;
    const reach = target && resolveReach(world, contact);
    const leg = reach?.ids.includes(target.id) && reach.reached.find(row => row.place === place);
    if (!leg) return {reason: 'The spell has no clear path to its target.'};
    const barrier = spellContactBarrier(world, target.id, sentence.verb, sentence.object);
    if (barrier) {
        const turns = contact.turns;
        if (turns?.includes(barrier.id)) return {reason: `The attack returned to ${barrier.id} and was intercepted.`};
        const deflectedTo = contact.deflectable === true ? barrier.params.deflectedTo : undefined;
        const back = deflectedTo ?? contact.releasedBy;
        if (barrier.params.reflect === true && back && back !== target.id) {
            const {releasedBy, deflectable, ...path} = contact;
            const next = {...path, from: place};
            if (turns) Object.assign(next, {releasedBy, deflectable, turns: [...turns, barrier.id],
                ...(contact.cost != null && {cost: contact.cost - leg.cost}),
                links: (contact.links ?? 1) - leg.links});
            const reflected = contactDetails(world, {...details, target: {shape: 'holder', id: back}}, next, sentence);
            const reason = deflectedTo ? `The attack was deflected by ${barrier.id}.`
                : `The spell was reflected by ${barrier.id}.`;
            return reflected.details ? {...reflected, reflection: [reason, reflected.reflection].filter(Boolean).join(' ')}
                : {reason: `${reason} ${reflected.reason}`};
        }
        return {reason: `The spell was intercepted by ${barrier.id}.`};
    }
    if (!contact.held) return {details: {...details, place: target.place ?? target.id}};
    const mark = `grip:${target.id}`;
    const implementsHeld = resolveTargets(world, {shape: 'marked', place: target.place, mark})
        .filter(id => world.holders[id].kind === 'thing');
    if (implementsHeld.length !== 1) return {reason: 'The spell finds no single held implement at its target.'};
    return {details: {...details, mark, target: {shape: 'holder', id: implementsHeld[0]}}};
}

// effect: {sentence, details?}. Returns {world, status, changed, acts, outcomes, published, waiting, needs, reason}.
// status: landed (state changed), idle (nothing changed), published (an owner's answer ran),
// waiting (publishes only, no owner answers), needs-key (a keyed family has no key), unmapped (the
// sentence uses a word with no P reading; `word` and the reason name it), label-only (the effect carries no sentence).
// A vitality preview reports which removals would land and keeps the input world.
export function landEffect(rules, world, effect, {cause, by, keys = {}, read = null, previewVitality = false} = {}) {
    const out = empty(world);
    if (!effect?.sentence) return {...out, status: 'label-only', reason: `effect ${effect?.kind ?? '(none)'} carries no sentence, so nothing can land it`};
    const {contact, ...aim} = effect.details ?? {};
    const resolved = contact ? contactDetails(world, aim, contact, effect.sentence) : {details: aim};
    if (!resolved.details) return {...out, status: 'idle', reason: resolved.reason};
    const {details} = resolved;
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
    const run = applySentence(rules, world, sentence, details, {
        keys, cause, by, publishIf: kind => delivered.has(kind), previewVitality,
    });
    const waiting = lowered.publish.filter(p => !delivered.has(p.kind));
    const changed = run.outcomes.some(o => o.applied.length > 0) || run.published.length > 0;
    const status = changed ? (lowered.acts.length ? 'landed' : 'published') : waiting.length && !lowered.acts.length ? 'waiting' : 'idle';
    const blocker = run.outcomes.find(outcome => outcome.blocked.length)?.blocked[0];
    const blocked = status === 'idle' && blocker
        ? blocker.reason ?? (contact ? `The spell was intercepted by ${blocker.by}.` : null) : null;
    const reason = status === 'waiting' ? `waiting for an owner: ${waiting.map(p => `${p.kind} (${p.owner ?? 'none'})`).join(', ')}`
        : [resolved.reflection, blocked].filter(Boolean).join(' ') || null;
    return {world: run.world, status, changed, acts: lowered.acts, outcomes: run.outcomes, published: run.published, waiting, needs: [],
        reason};
}
