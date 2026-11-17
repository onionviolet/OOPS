import test from 'node:test';
import assert from 'node:assert/strict';
import {nounOf, noticedFromActs, registerPlaceNoticed, placeNoticed} from '../src/place_noticed.js';
import {projectNearbyContext, shortVerb, placeAccount} from '../src/nearby_context_view.js';

test('PS305: a plain verb-and-noun label reads; anything else is left to its own list', () => {
    assert.deepEqual(nounOf('Look over the table'), {verb: 'Look over', noun: 'table'});
    assert.deepEqual(nounOf('Light the tall lamp · 1 min · no stock spent'), {verb: 'Light', noun: 'tall lamp'});
    assert.equal(nounOf('Put the cup in the cupboard'), null, 'a preposition means two nouns; none is guessed');
    assert.equal(nounOf('Count, sort and stack the cards'), null);
    assert.equal(nounOf('Rest'), null);
});

test('PS305: acts on one noun share a row; an unavailable act stays a disabled verb with its reason', () => {
    const opened = [];
    const rows = noticedFromActs([
        {id: 'a', label: 'Look over the table · 1 min', eligible: true},
        {id: 'b', label: 'Clear the table', eligible: false, reasons: ['Not yet.', 'Not yet.']},
        {id: 'c', label: 'Wait for the kettle to boil', eligible: true},
        {id: 'd', label: 'Light the lamp', eligible: true},
    ], {open: id => opened.push(id)});
    assert.deepEqual(rows.map(r => r.name), ['Table', 'Lamp']);
    assert.deepEqual(rows[0].verbs.map(v => [v.short, v.disabled, v.reason]), [['Look over', false, ''], ['Clear', true, 'Not yet.']]);
    rows[0].verbs[0].run();
    assert.deepEqual(opened, ['a'], 'a verb goes to the owner’s own control');
});

test('PS305: sources add rows, a broken one adds nothing, and the list is capped', () => {
    const off = [registerPlaceNoticed({id: 't1', rows: () => Array.from({length: 6}, (_, i) => ({id: `n${i}`, name: `Thing ${i}`, verbs: []}))}),
        registerPlaceNoticed({id: 't2', rows: () => { throw Error('boom'); }})];
    assert.equal(placeNoticed({}).length, 4);
    off.forEach(f => f());
    assert.deepEqual(placeNoticed({}), []);
});

test('PS305, PS192: a noticed noun lists with the stations and carries its own verbs; the Here row names the short verb', () => {
    const verbs = [{id: 'a', label: 'Look over the table', short: 'Look over', run() {}}];
    const view = projectNearbyContext({place: 'Room', people: [], things: [], noticed: [{id: 'noticed:table', name: 'Table', verbs}]}, null, 'A room.');
    assert.deepEqual(view.services.map(s => s.id), ['noticed:table']);
    assert.equal(view.summary, '1 service / station');
    assert.equal(shortVerb(view.services[0], view.services[0].actions[0]), 'Look over');
    assert.equal(shortVerb({kind: 'person'}, {label: 'Talk with Old Hesk'}), 'Talk');
    assert.equal(shortVerb({kind: 'exit'}, {label: 'Enter the cave'}), 'Enter');
    assert.deepEqual(placeAccount('One. Two.'), {lead: 'One. Two.', rest: ''});
});
