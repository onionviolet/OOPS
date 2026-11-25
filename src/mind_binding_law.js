// W23-M proposal: an opposed will meeting admits one directed order. The existing
// mind pack owns the leased influence; the stored-working owner owns its trigger
// and save. A failed meeting never lays the influence. No new mind state lives here.
import {CONTEST_RESOLVERS} from './contest_resolvers.js';

export const MIND_BINDING_CASE_MODULE = 'src/mind_binding_law.js';
export const MIND_BINDING_DIALS = Object.freeze({minutes: 3, casterNotch: 2, defenderResist: 0,
    order: 'doorway', working: 'mind-binding.command'});
export const MIND_BINDING_TIMES = Object.freeze(['instant', 'sustained', 'lasting', 'triggered']);
export const mindBindingCaseId = (time = 'sustained') => `mind-binding:command.${time}`;

export function mindBindingBlocker(sentence, note = '') {
    if (!sentence) return 'no stated effect sentence';
    if (sentence.verb !== 'bind' || sentence.object !== 'mind') return `${sentence.verb}.${sentence.object} is not a directed binding`;
    if (!MIND_BINDING_TIMES.includes(sentence.time)) return `time ${sentence.time ?? '(unstated)'} needs a stated application`; 
    if (!['touched', 'bound', 'marked'].includes(sentence.target)) return `target ${sentence.target ?? '(unstated)'} needs individual reach and resistance`;
    if (/possess|enslav|permanent|truthful|memory|dream|stun|fear|frighten|charm|allegiance|control of a body/i.test(note))
        return 'the stated effect needs a different faculty or control model';
    if (!/command|compel|order|direct|obey|summon|call|force.{0,30}(act|move|answer|follow)/i.test(note))
        return 'the row does not state a directed order';
    return null;
}
export const canRunMindBinding = (sentence, note = '') => !mindBindingBlocker(sentence, note);

// Uses the same notch resolver as physical contests. The caller supplies a
// keyed draw from its contest, so a quote and execution can share one meeting.
export function contestMindBinding({casterNotch, defenderResist, draw, guard = 0}) {
    if (![casterNotch, defenderResist, guard].every(Number.isFinite) || typeof draw !== 'function')
        throw new TypeError('a mind binding needs two will ratings and a keyed contest draw');
    const result = CONTEST_RESOLVERS.notch({actor: {profile: {notch: casterNotch}, impair: 1},
        target: {profile: {resist: defenderResist}, impair: 1, guard: {mind: guard}},
        move: {notch: 0, effects: [{verb: 'bind', object: 'mind', amount: 1}]}, draw, dials: {}});
    return {won: result.outcome === 'hit', chance: result.chance, outcome: result.outcome};
}

export function mindBindingCase(id) {
    const time = id.replace(/^mind-binding:command\./, '');
    if (!id.startsWith('mind-binding:command.') || !MIND_BINDING_TIMES.includes(time)) throw Error(`no mind binding case for ${id}`);
    const D = MIND_BINDING_DIALS;
    const hit = (direction, to) => ({holder: 'subject', property: 'mind_controller', direction, ...(to !== undefined ? {to} : {})});
    const effect = {sentence: {verb: 'bind', object: 'mind', time},
        details: {place: 'room', target: {shape: 'holder', id: 'subject'}, mind: {faculty: 'will', to: D.order},
            minutes: D.minutes, working: D.working}};
    return {basis: 'authored', engine: {packs: ['a.mind'], settings: {'a.mind': {routes: [{from: 'room', to: D.order}]}}}, world: {holders: [
        {id: 'room', kind: 'place'}, {id: D.order, kind: 'place'},
        {id: 'caster', kind: 'body', place: 'room', properties: {mind_awake: true}},
        {id: 'subject', kind: 'body', place: 'room', properties: {mind_awake: true}}]},
    timeline: [
        {id: 'lay', store: {carrier: 'caster', effects: [effect], trigger: {kind: 'touch'}, pulse: 1, mode: 'once'}},
        {id: 'take-hold', fire: 'lay', stimulus: {kind: 'touch', by: 'caster'}, expect: [hit('changed', 'caster')]},
        {id: 'restore', restore: true},
        {id: 'obey', advanceTo: 1, expect: [{holder: 'subject', position: true, direction: 'changed', to: D.order}]},
        {id: 'lapse', advanceTo: D.minutes, expect: [hit('changed', null)]},
    ], expect: [{holder: 'subject', position: true, direction: 'changed', to: D.order}]};
}
export const coverageCase = mindBindingCase;
