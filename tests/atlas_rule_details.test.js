import test from 'node:test';
import assert from 'node:assert/strict';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {acquisitionDetails, resetDetails} from '../prototypes/world-atlas/rule-details.mjs';

test('materials retain shown and stated locators through joins and duplicate workings', () => {
    const item = 'lotm.item.fixture-sheet';
    const a = {item, label: 'S', locator: 'en b2 c1 p3', qty: 1};
    const b = {...a, label: 'T', locator: 'en b2 c1 p4'};
    const row = inputs => ({id: 'lotm.rule.fixture-stamp', kind: 'craft', inputs, products: [b]});
    const d = digestWorld({world: 'lotm', shards: [{prefix: 'a', census: [{id: item, label: 'Fixture sheet', kind: 'item'}],
        rules: [row([a, {item: 'Sealed ingredient', sealed: ['withhold'], label: 'S', locator: 'en b2 c1 p5'}])]},
    {prefix: 'b', rules: [row([b, a])]}]});
    assert.equal(d.rules[0].inputs.length, 1);
    assert.equal(d.rules[0].inputs[0].label, 'Fixture sheet', 'name remains separate from source label');
    assert.deepEqual(d.rules[0].inputs[0].sources, [{label: 'S', locator: a.locator}, {label: 'T', locator: b.locator}]);
    assert.deepEqual(d.rules[0].products[0].sources, [{label: 'T', locator: b.locator}]);
    assert.doesNotMatch(JSON.stringify(d), /Sealed ingredient/);
});

test('learning keeps prerequisite arrays and older scalar values without admitting sealed fields', () => {
    const row = {teacher: 'lotm.person.fixture-guide', prerequisites: ['A steady flame', 'Read the symbols'], label: 'T', locator: 'en b2 c1 p3'};
    const d = digestWorld({world: 'lotm', shards: [{prefix: 'a', rules: [{id: 'lotm.ability.fixture-light', kind: 'ability', acquire: row}]}]});
    assert.deepEqual(d.rules[0].acquisition, [row]);
    assert.equal(acquisitionDetails({...row, prerequisites: 'A steady flame'}).prerequisites, 'A steady flame');
    assert.equal(acquisitionDetails({...row, prerequisites: []}).prerequisites, undefined);
    assert.equal(acquisitionDetails({...row, sealed: ['withhold']}), null);
    assert.equal(acquisitionDetails(null), null);
});

test('qualified reset facts merge while private memories, sealed and unqualified details stay out', () => {
    const reset = {trigger: 'The bell strikes midnight', span: 'One day', resets: ['The market stalls'], keeps: ['The held ticket'],
        remembers: ['PRIVATE_KNOWLEDGE_HOLDER'], ends: 'The ticket is returned', label: 'T', locator: 'en b2 c1 p5'};
    const row = {id: 'lotm.rule.fixture-reset', kind: 'reset', reset};
    const d = digestWorld({world: 'lotm', shards: [{prefix: 'a', rules: [row,
        {id: 'lotm.rule.fixture-empty-reset', kind: 'reset', reset: {label: 'U'}},
        {id: 'lotm.rule.fixture-sealed-reset', kind: 'reset', reset: {...reset, trigger: 'SEALED_TRIGGER', sealed: ['withhold']}}]},
    {prefix: 'b', rules: [row]}]});
    assert.deepEqual(d.rules[0].resets, [{trigger: reset.trigger, label: 'T', locator: reset.locator, span: reset.span,
        ends: reset.ends, resets: reset.resets, keeps: reset.keeps}]);
    assert.equal(d.rules.find(r => r.id.endsWith('empty-reset')).resets.length, 0);
    assert.equal(d.rules.find(r => r.id.endsWith('sealed-reset')).resets.length, 0);
    assert.doesNotMatch(JSON.stringify(d), /PRIVATE_KNOWLEDGE_HOLDER|SEALED_TRIGGER/);
    assert.deepEqual(resetDetails({...reset, locator: 'invalid'}), []);
    assert.deepEqual(resetDetails({}), []);
});

test('rule evidence letters survive independently and merged evidence does not promote an inference', () => {
    const rule={id:'lotm.craft.fixture-correction',name:'Fixture correction',kind:'craft',label:'I',locator:'zh 第127章 p25',
        limits:['The recipe is not supplied here'],acquire:{teacher:'lotm.person.fixture-guide',progressSign:'The guide checks the attempt',label:'T',locator:'zh 第127章 p25'}};
    const d=digestWorld({world:'lotm',shards:[{prefix:'a',rules:[rule,
        {id:'lotm.ability.fixture-observation',kind:'ability',label:'S',locator:'zh 第127章 p26'},
        {id:'lotm.rule.fixture-private',kind:'craft',private:true,label:'T',limits:['PRIVATE_RULE_DETAIL']},
        {id:'lotm.craft.fixture-private-lesson',kind:'craft',acquire:{private:true,teacher:'PRIVATE_TEACHER',progressSign:'PRIVATE_PROGRESS'}}]},
        {prefix:'b',rules:[{...rule,label:'T',locator:'zh 第127章 p27'},rule]}]});
    const r=d.rules.find(row=>row.id===rule.id);
    assert.equal(r.label,'I','the first inference remains an inference, with later evidence separately retained');
    assert.deepEqual(r.sources,[{label:'I',locator:rule.locator},{label:'T',locator:'zh 第127章 p27'}]);
    assert.deepEqual(r.limits,rule.limits);assert.deepEqual(r.acquisition,[rule.acquire]);
    assert.equal(d.rules.find(row=>row.id.endsWith('fixture-observation')).label,'S');
    assert.equal(d.rules.some(row=>row.id==='lotm.rule.fixture-private'),false);
    assert.doesNotMatch(JSON.stringify(d),/PRIVATE_RULE_DETAIL|PRIVATE_TEACHER|PRIVATE_PROGRESS/);
});

test('a public learning result cannot reveal a teacher withheld by another admitted row', () => {
    const d=digestWorld({world:'lotm',shards:[{prefix:'a',census:[{id:'lotm.person.hidden-guide',kind:'person',sealed:['withheld']}],
        rules:[{id:'lotm.craft.fixture-public-result',kind:'craft',label:'T',acquire:{teacher:'lotm.person.hidden-guide',
            progressSign:'The attempt is checked',label:'T',locator:'zh 第127章 p25'}}]}]});
    assert.equal(d.rules[0].acquisition[0].progressSign,'The attempt is checked');
    assert.doesNotMatch(JSON.stringify(d),/hidden-guide/);
});
