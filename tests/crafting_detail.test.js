import test from 'node:test';
import assert from 'node:assert/strict';
import {craftBatchProposal,craftReceiptText} from '../src/crafting_detail.js';

test('batch preview quotes maximum native input use without reserving it or promising outputs',()=>{
    const proposal=craftBatchProposal({requirements:[{label:'ore',need:2},{label:'wood',need:1}],available:3,requested:5});
    assert.match(proposal,/up to 3 attempts/);assert.match(proposal,/6 ore, 3 wood/);assert.match(proposal,/skill limits can stop earlier/);assert.match(proposal,/reserves nothing/);
    assert.equal(craftBatchProposal({requirements:[],available:0,requested:Infinity}),'No attempts are available. This preview reserves nothing.');
});

test('receipt reports measured attempt and success totals for immediate batches',()=>{
    const text=craftReceiptText({made:2,result_name:'ingots',used:[{name:'ore',count:3}],xp:0,skill_id:'Forging',skill_level:1,attempted:5,successful:2});
    assert.match(text,/2 of 5 native attempts succeeded/);
    assert.match(craftReceiptText({made:0,result_name:'ingots',used:[{name:'ore',count:1}],xp:0,attempted:1,successful:0}),/0 of 1 native attempts succeeded/);
});

import {craftGlance, chanceWord, glanceText, needChips} from '../src/ui/craft_glance.js';

const base = {title: 'Charm', requirements: [{label: 'Rat tail', need: 2, have: 3}, {label: 'Rat tail', need: 1, have: 3}], output: {name: 'Charm', count: 1},
    chance: 65, station: 'Bench, tier 1', available: true, attempts: 1};

test('glance states time, cost, result, quality and chance in words, with no invented numbers', () => {
    const g = craftGlance({...base, time: 'Instant', spendsOnFailure: true});
    const row = key => g.rows.find(r => r.key === key).value;
    assert.equal(g.status.state, 'ok');
    assert.match(g.status.text, /1 attempt possible now/);
    assert.equal(row('time'), 'Instant');
    assert.match(row('cost'), /^Spends 3 Rat tail per attempt, even when the attempt fails$/);
    assert.match(row('quality'), /Not graded/);
    assert.equal(row('chance'), '65% · likely');
    const bare = craftGlance({...base, chance: null});
    assert.equal(bare.rows.find(r => r.key === 'time').value, 'Not stated');
    assert.equal(bare.rows.find(r => r.key === 'chance').value, 'Unassessed');
});

test('blocked glance carries the one reason and marks each short input', () => {
    const model = {...base, available: false, blocked_reason: "Can't craft yet: missing 2 Rat tail.", attempts: 0, requirements: [{label: 'Rat tail', need: 2, have: 0}]};
    const g = craftGlance(model);
    assert.equal(g.status.state, 'blocked');
    assert.equal(g.status.text, model.blocked_reason);
    assert.deepEqual(needChips(model.requirements), [{state: 'blocked', text: 'Rat tail 0/2', note: 'short 2'}]);
    assert.match(glanceText(g), /^✕ Can't craft yet/);
});

test('a real quality range is shown as given and chance words follow the default bands', () => {
    const g = craftGlance({...base, quality: {range: [80, 110], note: 'cap 200'}});
    assert.equal(g.rows.find(r => r.key === 'quality').value, 'Quality 80–110 · cap 200');
    assert.deepEqual([95, 60, 59, 10, 9, null].map(chanceWord), ['reliable', 'likely', 'uncertain', 'unlikely', 'very unlikely', 'unassessed']);
});

test('known stock counts the unblocked amount and held-back groups read as reserved', () => {
    const [chip] = needChips([{label: 'Ore', need: 2, have: 5, stockKnown: true, usable: 2, held_back: true}]);
    assert.deepEqual(chip, {state: 'blocked', text: 'Ore 2/2', note: 'reserved'});
});

import {figureText} from '../src/ui/figure.js';
import {CRAFTING_FIXTURES} from '../src/ui/preview/fixtures/crafting.js';

test('crafting flow fixtures validate and keep every fact in the text form', () => {
    for (const spec of CRAFTING_FIXTURES) {
        const text = figureText(spec);
        assert.match(text, /Blade to|Workbench to Blade/);
        assert.match(text, /missing 1 Binding strip/);
    }
});

test('an input blocked only by heat reads blocked, not enough', () => {
    const [chip] = needChips([{label: 'Ore', need: 1, have: 3, heat_reason: 'needs a hotter fire'}]);
    assert.deepEqual(chip, {state: 'blocked', text: 'Ore 3/1', note: 'wrong heat'});
});
