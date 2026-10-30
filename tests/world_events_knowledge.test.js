import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEventBook} from '../src/world_events.js';
import {eventKnowledgeWrites} from '../src/world_events_knowledge.js';

const book = buildEventBook([{id: 'e1', key: 'k.e1', kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', when: {day: 5}, place: 'hall',
    spread: [{route: 'newspaper', delayDays: 1}]}]);
const textFor = e => `line for ${e.id}`;

test('heard news becomes a knowledge write on its learned day, with the route as basis', () => {
    const ctx = {presence: () => null, channels: () => new Set(['newspaper'])};
    assert.deepEqual(eventKnowledgeWrites(book, 'ann', 0, 5, ctx, {textFor}), []);
    assert.deepEqual(eventKnowledgeWrites(book, 'ann', 5, 6, ctx, {textFor}), [{at: 6, cause: 'event:e1',
        effect: {type: 'knowledge', actor: 'ann', key: 'book.news.e1', stage: 'seen', value: 'line for e1', basis: {kind: 'reported', route: 'newspaper'}}}]);
});
test('a witness gets an observation basis; an event with no pack line writes nothing', () => {
    const ctx = {presence: (p, d) => d === 5 ? 'hall' : null, channels: () => new Set()};
    assert.equal(eventKnowledgeWrites(book, 'bo', 4, 5, ctx, {textFor})[0].effect.basis.kind, 'observation');
    assert.deepEqual(eventKnowledgeWrites(book, 'bo', 4, 5, ctx, {textFor: () => null}), []);
});
