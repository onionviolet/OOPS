import test from 'node:test';
import assert from 'node:assert/strict';
import {abilityInputs, parseAnswer, typeRows} from '../scripts/lead_run/ability_typing.mjs';

const extras = [
    {extra: 'rules', kind: 'ability', id: 'x.a', name: 'A', shard: 'lotm2c001m', locator: 'zh b2 1', conditions: ['Needs fire', 'Needs fire'], limits: [{what: 'Range 5 m', locator: 'zh b2 2'}], costs: [], consequences: []},
    {extra: 'rules', kind: 'ability', id: 'x.a', name: 'A', shard: 'lotm2c002m', locator: 'zh b2 3', conditions: ['Needs fire', 'Stunned user cannot use it'], limits: [], costs: [], consequences: []},
    {extra: 'rules', kind: 'ability', id: 'x.b', name: 'B', shard: 'lotm3c001m', locator: 'zh b3 1', conditions: ['Other volume'], limits: [], costs: [], consequences: []},
    {extra: 'rules', kind: 'potion', id: 'x.p', shard: 'lotm2c001m', conditions: ['not an ability']},
];

test('inputs hold unique ability ids of one volume with deduped, keyed, located items', () => {
    const inputs = abilityInputs(extras, 2);
    assert.deepEqual(inputs.map(i => i.id), ['x.a']);
    assert.deepEqual(inputs[0].items.map(i => i.t), ['Needs fire', 'Range 5 m', 'Stunned user cannot use it']);
    assert.equal(inputs[0].items[1].l, 'zh b2 2');
    assert.equal(new Set(inputs[0].items.map(i => i.k)).size, 3);
});

test('answers parse by role and reject malformed lines instead of guessing', () => {
    const {answers, ignored, malformed} = parseAnswer(['x.a\tc0\tCOND\tfire_at_hand\t\t', 'x.a\tl1\tRANGE\t\t5\tm', 'x.a\tc2\tBLOCK\tstunned\t\t', 'x.a\tc2\tNOTE\t\t\t', 'x.a\tc9\tCOND\tBad Slug\t\t', 'x.a\tc8\tRANGE\t\tfive\tm', 'x.a\tc7\tDUP:c0\t\t\t'].join('\n'));
    assert.equal(answers.size, 4);
    assert.equal(ignored, 1);
    assert.equal(malformed, 2);
    assert.equal(answers.get('x.a\tl1').number, 5);
    assert.equal(answers.get('x.a\tc7').role, 'DUP');
});

test('typed rows carry facts, blockers, stated numbers and locators; unanswered items are reported', () => {
    const inputs = abilityInputs(extras, 2);
    const {answers} = parseAnswer('x.a\tc0\tCOND\tfire_at_hand\t\t\nx.a\tl1\tRANGE\t\t5\tm');
    const {rows, missing} = typeRows(inputs, answers);
    assert.deepEqual(rows[0].conditions, [{label: 'Needs fire', fact: 'actor.lotm.fire_at_hand', locator: 'zh b2 1'}]);
    assert.deepEqual(rows[0].stated, [{kind: 'range', value: 5, unit: 'm', label: 'Range 5 m', locator: 'zh b2 2'}]);
    assert.deepEqual(missing, ['x.a\tc2']);
});
