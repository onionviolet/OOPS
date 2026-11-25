// Divination is a paid reading of a world fact, not a grant of hidden truth to the UI.
// The target's property supplies truth at settlement; N owns the observer's belief.
// This engine law is a working default (AD56). A world supplies the signal property,
// price, time and reliability. An absent signal gives an unanswered receipt.
import {defineWorkingLaw} from './kernel_working.js';
import {KNOWLEDGE_KINDS} from './knowledge_record.js';

export const DIVINATION_CASE_MODULE = 'src/divination_law.js';
export const DIVINATION_DIALS = Object.freeze({minutes: 1, cost: 1, quantity: 'energy:spirituality',
    property: 'reading_signal', reliability: 'supported'});
export const DIVINATION_RELIABILITY = Object.freeze(['supported', 'uncertain']);
export const divinationCaseId = ({verb, object, target = 'self', time = 'instant'}) =>
    `divination:${verb}.${object}.${target}.${time}`;

export function divinationBlocker(sentence) {
    if (!sentence || sentence.verb !== 'sense' || sentence.object !== 'information')
        return 'the sentence is not a reading of information';
    if (!['self', 'touched', 'bound', 'line', 'area', 'marked'].includes(sentence.target))
        return 'the reading has no supported target shape';
    if (!['instant', 'sustained', 'lasting', 'delayed', 'triggered'].includes(sentence.time))
        return 'the reading has no supported time shape';
    return null;
}
export const canRunDivination = sentence => divinationBlocker(sentence) === null;

export const DIVINATION_LAW = defineWorkingLaw({id: 'divination.reading', revision: 1, operations: {
    read: {roles: {reader: 'body', subject: 'thing'}, settle({bound: {reader, subject}, options, at}) {
        const {property, record, reliability, cost, quantity} = options;
        if (!reader.holder || !subject.holder || !reader.place || !subject.place)
            return {ok: false, reason: 'The reader and subject need a place.'};
        if (!DIVINATION_RELIABILITY.includes(reliability))
            return {ok: false, reason: 'The reading needs a stated reliability.'};
        const price = [{quantity, amount: cost, payer: reader.holder}];
        const value = subject.properties?.[property];
        if (value === undefined || value === null)
            return {ok: true, costs: price, observed: {status: 'unanswered', reliability, record: null}};
        const fact = {id: record, subject: {kind: 'fact', id: record},
            true: {holder: subject.holder, property}, believed: {value},
            source: {kind: 'observation', by: reader.holder, at},
            doubts: reliability === 'uncertain' ? ['uncertain'] : []};
        return {ok: true, costs: price, observed: {status: 'signal', reliability, record},
            effects: [{op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: reader.place,
                by: reader.holder, detail: {owner: 'N', knowledge: {to: reader.holder, record: fact}}}]};
    }},
}});

export function divinationMethod({id, property = DIVINATION_DIALS.property,
    reliability = DIVINATION_DIALS.reliability, minutes = DIVINATION_DIALS.minutes,
    quantity = DIVINATION_DIALS.quantity, cost = DIVINATION_DIALS.cost}) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9_.:-]*$/i.test(id) ||
        typeof property !== 'string' || !property || !Number.isSafeInteger(minutes) || minutes < 0 ||
        !Number.isSafeInteger(cost) || cost < 0 || !DIVINATION_RELIABILITY.includes(reliability))
        throw Error('A divination method needs a record, fact property, reliability, time and price.');
    return {id, revision: 1, law: DIVINATION_LAW.ref, roles: {reader: 'body', subject: 'thing'},
        steps: [{op: 'read', bindings: {reader: 'reader', subject: 'subject'}, minutes,
            options: {property, record: id, reliability, quantity, cost}}]};
}

// The case runner needs a divination working-family adapter before these cases
// can claim expressed coverage. Until then runCase returns runner-working-case.
export function divinationCase(id) {
    const match = /^divination:([a-z]+)\.([a-z]+)\.([a-z]+)\.([a-z]+)$/.exec(id);
    const sentence = match && {verb: match[1], object: match[2], target: match[3], time: match[4]};
    const blocked = divinationBlocker(sentence);
    if (blocked) throw Error(`no divination case for ${id}: ${blocked}`);
    return {basis: 'authored', engine: {packs: ['n.knowledge'], shared: {
        properties: [{id: 'reading_signal', type: 'label', askedBy: ['divination']}]}},
        world: {holders: [{id: 'room', kind: 'place'},
            {id: 'reader', kind: 'body', place: 'room', quantities: {'energy:spirituality': 2}},
            {id: 'subject', kind: 'thing', place: 'room', properties: {reading_signal: 'warning'}}]},
        timeline: [{id: 'begin', working: {family: 'divination', id: 'case.divination',
            method: divinationMethod({id: 'reading.warning'}),
            bindings: {reader: {kind: 'body', id: 'reader'}, subject: {kind: 'thing', id: 'subject'}}}},
        {id: 'save', restore: true}, {id: 'result', advanceTo: 1}],
        expect: [{holder: 'reader', belief: 'reading.warning', direction: 'changed', to: 'warning'}]};
}
export const coverageCase = divinationCase;
