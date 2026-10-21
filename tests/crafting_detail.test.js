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
