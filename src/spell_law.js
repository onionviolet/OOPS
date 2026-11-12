// Spell effect law on the kernel (chat S): any effect sentence, canon or new,
// runs as a K working (PFP16, KW1). One operation per verb and target kind; a
// composed spell (SC6) is a K method with several steps over the same law.
// Settlement reads the bound thing at the step's time (KW3) and lets properties
// decide (PFP22): a ward or counter on the target blocks the verbs it names, a
// mass limit stops a move. World hosts lower the published effects onto their
// own owners (KB7); this law publishes intents only (KW11).
import {defineWorkingLaw, quoteWorking} from './kernel_working.js';
import {EFFECT_VERBS, EFFECT_TARGETS} from './spell_effects.js';

const operations = {};
for (const verb of EFFECT_VERBS) for (const target of EFFECT_TARGETS) operations[`${verb}.${target}`] = {
    roles: {target}, minutes: 0,
    settle: ({bound, options, step}) => {
        const thing = bound.target, sentence = options.sentence;
        // EF3: counterplay comes free. A thing that carries a block for this verb or object refuses it.
        const blocker = (thing.blocks ?? []).find(b => b === verb || b === sentence.object || b === 'magic');
        if (blocker) return {ok: false, reason: `${thing.id} is protected against ${blocker}.`, observed: {step, seen: 'the spell met resistance'}};
        // Limits as properties: a move reads mass against the spell's limit (dial per spell, default none).
        if (verb === 'move' && Number.isFinite(options.massLimit) && Number.isFinite(thing.mass) && thing.mass > options.massLimit)
            return {ok: false, reason: `${thing.id} is too heavy for this working.`, observed: {step, seen: 'it strains and does not move'}};
        return {ok: true, effects: [{kind: `spell.${sentence.verb}.${sentence.object}`, target: thing.id, sentence, name: options.name ?? null}],
            observed: {step, seen: options.explain ?? null}};
    },
};
export const SPELL_EFFECT_LAW = defineWorkingLaw({id: 'spell.effect', revision: 1, operations});

// spells: [{sentence, target: {id, kind?}, name?, massLimit?, explain?, minutes?}] -> K method and bindings.
export function spellEffectMethod(spells, {id = 'spell.composed', revision = 1} = {}) {
    if (!Array.isArray(spells) || !spells.length) throw Error('Choose at least one spell.');
    const roles = {}, bindings = {};
    const steps = spells.map((spell, i) => {
        const role = `t${i}`;
        roles[role] = spell.sentence.target;
        bindings[role] = {kind: spell.sentence.target, id: spell.target.id};
        return {op: `${spell.sentence.verb}.${spell.sentence.target}`, bindings: {target: role}, minutes: spell.minutes,
            options: {sentence: spell.sentence, name: spell.name ?? null, massLimit: spell.massLimit, explain: spell.explain ?? null}};
    });
    return {law: SPELL_EFFECT_LAW, method: {id, revision, law: SPELL_EFFECT_LAW.ref, roles, steps}, bindings};
}

// Check 1 of the five (it runs): the same quote canon spells take.
export function quoteSpells(spells, {at = 0, ports = {}, id = 'spell.quote'} = {}) {
    const {law, method, bindings} = spellEffectMethod(spells);
    return quoteWorking(law, method, {bindings, at, ports, id});
}
