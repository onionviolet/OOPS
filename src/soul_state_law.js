// W23-S proposal: a soul is a distinct holder. Its place, body bond and form
// change through existing W effects; K owns the stored working and its clock.
// This does not equate bodily vitality or a spirituality cost pool with the soul.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';

export const SOUL_CASE_MODULE = 'src/soul_state_law.js';
export const SOUL_DIALS = Object.freeze({startForm: 'unshaped', changedForm: 'shaped', bond: 'body:person',
    delay: 60, triggerWord: 'release'});
export const SOUL_VERBS = Object.freeze(['move', 'bind', 'release', 'transform']);
export const SOUL_TIMES = Object.freeze(['instant', 'lasting', 'delayed', 'triggered']);
export const soulCaseId = (verb, time = 'instant') => `soul:${verb}.${time}`;

export function soulBlocker(sentence) {
    if (!sentence || sentence.object !== 'soul') return 'no stated soul sentence';
    if (!SOUL_VERBS.includes(sentence.verb)) return `${sentence.verb}.soul needs another soul mechanism`;
    if (!SOUL_TIMES.includes(sentence.time)) return sentence.time === 'sustained'
        ? 'sustained soul change needs upkeep and release'
        : `time ${sentence.time ?? '(missing)'} has no soul clock`;
    return null;
}
export const canRunSoul = sentence => !soulBlocker(sentence);

// Translation from a soul sentence to the particular property or position W
// changes. The holder is the soul itself; the mark names its body, not its owner.
export function soulEffect({verb, time}) {
    const D = SOUL_DIALS;
    const sentence = {
        move: {verb: 'move', object: 'position'},
        bind: {verb: 'bind', object: 'relation'},
        release: {verb: 'release', object: 'relation'},
        transform: {verb: 'transform', object: 'form'},
    }[verb];
    if (!sentence) throw Error(`no soul effect for ${verb}`);
    return {sentence: {...sentence, time}, details: {target: {shape: 'holder', id: 'soul'},
        ...(verb === 'move' ? {to: 'far'} : verb === 'transform' ? {value: D.changedForm} : {mark: D.bond})}};
}

export function soulCase(id) {
    const match = /^soul:([a-z]+)\.([a-z]+)$/.exec(id);
    const verb = match?.[1], time = match?.[2];
    if (soulBlocker({verb, object: 'soul', time})) throw Error(`no soul case for ${id}`);
    const D = SOUL_DIALS;
    const soul = {id: 'soul', kind: 'thing', place: 'room', properties: {form: D.startForm,
        marks: verb === 'release' ? [D.bond] : []}};
    const expected = verb === 'move' ? {holder: 'soul', position: true, direction: 'changed', to: 'far'}
        : verb === 'transform' ? {holder: 'soul', property: 'form', direction: 'changed', to: D.changedForm}
            : {holder: 'soul', property: 'marks', direction: 'changed', to: verb === 'bind' ? [D.bond] : []};
    const trigger = time === 'delayed' ? {kind: 'time', at: D.delay}
        : time === 'triggered' ? {kind: 'word', word: D.triggerWord} : {kind: 'touch'};
    const fire = time === 'delayed' ? {id: 'due', advanceTo: D.delay, expect: [expected]}
        : {id: 'fire', fire: 'lay', stimulus: time === 'triggered'
            ? {kind: 'word', word: D.triggerWord, by: 'person'} : {kind: 'touch', by: 'person'}, expect: [expected]};
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}},
        shared: {quantities: Object.values(WORLD_QUANTITIES), properties: Object.values(WORLD_PROPERTIES)}},
    world: {holders: [{id: 'room', kind: 'place'}, {id: 'far', kind: 'place'},
        {id: 'person', kind: 'body', place: 'room'}, soul]},
    timeline: [{id: 'lay', store: {carrier: 'person', effects: [soulEffect({verb, time})],
        trigger, pulse: 1, actsFor: 'storer', mode: 'once'}},
    ...(time === 'delayed' ? [{id: 'early', advanceTo: D.delay - 1,
        expect: [{...expected, direction: 'unchanged', to: undefined}]}] : []),
    {id: 'restore', restore: true}, fire], expect: [expected]};
}

export const coverageCase = soulCase;
