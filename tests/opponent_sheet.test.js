import test from 'node:test';
import assert from 'node:assert/strict';
import {opponentFacts, statRowsFromFacts, statRowsAt, COMBAT_READ} from '../src/opponent_sheet.js';
import {projectNativeOpponents, fromCombatOpponentsProjection, factText} from '../src/opponent_board.js';
import {characterSheetView} from '../src/character_sheet.js';
import {subjectFromKnownPerson} from '../src/character_sheet_people.js';
import {observerView} from '../src/observer_view.js';

const observer = observerView({});
const FACTS = [{label: 'Attack', value: '5 dmg x2'}, {label: 'Speed', value: '1.2 /s'}, {label: 'Hit you', value: '70%'},
    {label: 'Attack rating', value: '31.623'}, {label: 'Defense', value: '3'}];
const asFacts = list => list.map(f => ({...f, knowledge: 'native'}));
const rowsOf = view => view.sections.find(s => s.id === 'stats').rows.map(r => [r.label, r.text, r.state]);

test('a combat target and the same person met elsewhere read identical rows at the same means', () => {
    const stats = statRowsFromFacts(FACTS);
    const card = projectNativeOpponents([{id: 'a', name: 'Field rat', hp: '10/10 hp', facts: FACTS}]).opponents[0].facts;
    // The person met elsewhere: the same stats on a subject, read by the same means through the sheet.
    const met = {...subjectFromKnownPerson({id: 'rat', name: 'Field rat', location: '', details: [], memories: []}), stats};
    const sheet = rowsOf(characterSheetView(met, observer, [COMBAT_READ]));
    assert.deepEqual(card.map(f => [f.label, factText(f), f.knowledge === 'native' ? 'known' : 'guessed']), sheet);
    // The numbers the native text already showed are unchanged.
    assert.deepEqual(card.map(f => f.value), ['5 dmg x2', '1.2 /s', '70%', '31.623', '3']);
});

test('a rougher means bands both surfaces alike, and the card marks banded values as estimates', () => {
    const rough = {means: 'glance', label: 'A glance', level: 3, precision: 0, scope: ['stats']};
    const card = opponentFacts(asFacts(FACTS), observer, [rough]);
    const sheet = statRowsAt(statRowsFromFacts(FACTS), observer, [rough]);
    assert.deepEqual(card.map(f => f.value), sheet.map(r => r.text));
    assert.equal(card.every(f => f.knowledge === 'partial'), true);
    assert.match(card[1].value, /^0 to 9 \/s$/);
});

test('facts the sheet cannot read pass through as the source gave them', () => {
    const facts = [{label: 'Attack', value: '4 dmg', knowledge: 'native'}, {label: 'Hit you', value: null, knowledge: 'unknown'}, {label: 'Guard', value: 'Shielded', knowledge: 'native'}];
    assert.deepEqual(opponentFacts(facts, observer).map(f => [f.label, f.value, f.knowledge]),
        [['Attack', '4 dmg', 'native'], ['Hit you', null, 'unknown'], ['Guard', 'Shielded', 'native']]);
    const registry = fromCombatOpponentsProjection({schema: 1, active: true, disclosure: 'native-legacy', opponents: [
        {index: 0, name: 'Rat', health: {current: 4, max: 4, fraction: 1}, facts: [{label: 'Attack', known: true, value: '2 dmg'}, {label: 'Block', known: false}]}]});
    assert.deepEqual(registry.opponents[0].facts.map(f => [f.value, f.knowledge]), [['2 dmg', 'native'], [null, 'unknown']]);
});
