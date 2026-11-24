// One area-field law (PSA28 dry run). A place or moving carrier holds an
// effect sentence as a stored working. W resolves whom its place reaches;
// the stored-working owner handles charge, clock and stimuli.
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {ITEM_BOUND_DIALS, ITEM_BOUND_TERMS, ITEM_HOLDER, lawEffect, lawFixture} from './item_bound_law.js';

export const AREA_CASE_MODULE = 'src/area_field_law.js';
export const AREA_DIALS = Object.freeze({amount: 5, pulses: 2, start: ITEM_BOUND_DIALS.start,
    into: ITEM_BOUND_DIALS.into, mark: 'chosen', later: 600});
export const AREA_TERMS = ITEM_BOUND_TERMS;
export const AREA_TIMES = Object.freeze(['instant', 'sustained', 'lasting', 'delayed', 'triggered']);
export const AREA_ANCHORS = Object.freeze(['place', 'holder']);
export const AREA_WHO = Object.freeze(['everyone', 'marked']);

export const areaCaseId = ({verb, object, time = 'instant'}, anchor = 'place', who = 'everyone') => `area:${verb}.${object}.${time}.${anchor}.${who}`;
export function areaBlocker({verb, object, time = 'instant'}) {
    if (!AREA_TIMES.includes(time)) return `time ${time} has no pulse model`;
    const term = AREA_TERMS[`${verb}.${object}`];
    if (!term) return `${verb}.${object} has no world account`;
    if (time === 'sustained' && term.creates) return 'sustained creation needs a distinct identity per pulse';
    return null;
}
export const canRunArea = s => Boolean(s && !areaBlocker(s));

const eventTrigger = () => ({kind: 'event', event: 'arrived', where: {place: '$place'}});
const markedAt = mark => ({shape: 'marked', place: '$place', mark});
const thingMark = who => who === 'marked' ? 'thing:chosen' : 'thing:eligible';

export function areaSpec({verb, object, time = 'instant'}, anchor, who, {target, details, trigger = eventTrigger()} = {}) {
    const D = AREA_DIALS, term = AREA_TERMS[`${verb}.${object}`];
    const blocked = areaBlocker({verb, object, time});
    if (blocked) throw new Error(blocked);
    target ??= term.thing ? markedAt(thingMark(who))
        : who === 'marked' ? markedAt(D.mark)
        : term.creates ? {shape: 'holder', id: '$place'}
        : term.position ? {shape: 'present', place: '$place'}
        : {shape: 'place', place: '$place'};
    const effect = lawEffect({verb, object, time}, target, D.amount, details);
    if (time === 'triggered' && !(trigger.kind === 'event' && trigger.event || trigger.kind === 'word' && trigger.word))
        throw new Error('An area trigger needs a named event or word.');
    return {
        carrier: anchor === 'holder' ? 'caster' : 'room',
        effects: [effect],
        trigger: time === 'delayed' ? {kind: 'time', every: D.later} : time === 'triggered' ? trigger : {kind: 'touch'},
        pulse: time === 'delayed' ? D.later : 1,
        actsFor: 'storer',
        strangerFactor: 1,
        mode: time === 'sustained' ? 'repeating' : 'once',
        ...(time === 'sustained' && {charge: {now: D.pulses, max: D.pulses, per: 1}}),
    };
}

export function areaCase(id, {trigger = {...eventTrigger(), where: {place: '$place', by: 'visitor'}}} = {}) {
    const [verb, object, time, anchor, who] = id.replace(/^area:/, '').split('.');
    const sentence = {verb, object, time}, term = AREA_TERMS[`${verb}.${object}`], D = AREA_DIALS;
    if (!canRunArea(sentence) || !AREA_ANCHORS.includes(anchor) || !AREA_WHO.includes(who)) throw new Error(`no area case for ${id}`);
    const fixture = lawFixture(sentence), marked = who === 'marked';
    const zone = anchor === 'holder' ? 'yard' : 'room', other = zone === 'room' ? 'yard' : 'room';
    const targetMark = term.thing ? thingMark(who) : marked ? D.mark : 'eligible';
    const people = (name, place, chosen) => fixture.seed({
        id: name, kind: term.thing ? 'thing' : 'body', place,
        properties: {marks: [...new Set([...(term.thing ? [thingMark('everyone')] : []), ...(chosen ? [targetMark] : [])])]},
    });
    const places = ['room', 'yard', 'destination', 'approach'];
    const holders = [...places.map(place => fixture.seed({id: place, kind: 'place'})),
        fixture.seed({id: 'caster', kind: 'body', place: 'room'}),
        people('inside', zone, true), people('bystander', zone, false), people('outside', other, true)];
    if (time === 'triggered' && trigger.kind === 'event') holders.push({id: 'visitor', kind: 'body', place: 'approach'});
    // A physical object needs an eligible target. A named ward or creation
    // has a single authored subject or site, which must be within the area.
    const target = fixture.hasField ? markedAt(targetMark) : undefined;
    const at = time === 'delayed' ? D.later : time === 'triggered' && trigger.kind === 'event' ? 2 : 0;
    const hit = (holder, direction, minute = at) => fixture.hit(holder, direction, {at: minute});
    const created = hit('inside');
    const inside = term.creates ? [created, {holder: created.holder, position: true, direction: 'changed', to: zone}] : [created];
    const outside = term.creates ? [] : [hit('outside', 'unchanged')];
    const bystander = !term.creates && (marked || fixture.hasField) ? [hit('bystander', 'unchanged')] : [];
    const quiet = [hit('inside', 'unchanged')];
    const first = [...inside, ...outside, ...bystander];
    const use = (id, expect, stimulus = {kind: 'touch', by: 'caster'}) => ({id, fire: 'lay', stimulus, expect});
    const move = (id, holder, to) => ({id, ops: [{op: 'move', holder, to}]});
    const before = term.creates ? {} : {expect: quiet};
    const held = term.quantity ? inside : term.ward === 'block' ? [hit('inside', 'changed', 1)] : quiet;
    const steps = {
        instant: [use('cast', first), use('again', quiet)],
        lasting: [use('cast', first), {id: 'later', advanceTo: D.later, expect: quiet}],
        sustained: [use('cast', first), ...(term.ward === 'block' ? [{id: 'next-minute', advanceTo: 1}] : []),
            use('held', held), use('fallen', term.ward === 'block' ? [hit('inside', 'unchanged', 1)] : quiet)],
        delayed: [{id: 'early', advanceTo: D.later - 1, ...before}, {id: 'restore', restore: true},
            {id: 'due', advanceTo: D.later, expect: first}, {id: 'later', advanceTo: 2 * D.later, expect: quiet}],
        triggered: trigger.kind === 'word' ? [
            use('wrong-word', before.expect, {kind: 'word', word: `${trigger.word}!`, by: 'caster'}),
            use('spoken', first, {kind: 'word', word: trigger.word, by: 'caster'}),
            use('repeat-word', quiet, {kind: 'word', word: trigger.word, by: 'caster'}),
        ] : [
            move('away', 'visitor', other),
            {id: 'unmatched', advanceTo: 1, ...before}, {id: 'restore', restore: true},
            move('enter', 'visitor', zone), {id: 'matched', advanceTo: 2, expect: first},
            move('leave', 'visitor', other), move('reenter', 'visitor', zone),
            {id: 'repeat-event', advanceTo: 3, expect: quiet},
        ],
    }[time];
    const walk = anchor === 'holder' ? [move('walk', 'caster', 'yard')] : [];
    const quantities = Object.values(WORLD_QUANTITIES);
    const props = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks, WORLD_PROPERTIES.concealed, ITEM_HOLDER];
    return {basis: 'authored', engine: {packs: ['l.living_body'], host: {things: {}, ...(term.key && {keys: term.key})}, shared: {quantities, properties: props}},
        world: {holders, lawFields: fixture.fields(['inside', 'bystander', 'outside'])},
        timeline: [{id: 'lay', store: areaSpec(sentence, anchor, who, {target, details: fixture.details('inside'), trigger})}, ...walk, ...steps],
        expect: [...inside, ...outside]};
}

/** The case-module entry the coverage runner loads. */
export const coverageCase = areaCase;
