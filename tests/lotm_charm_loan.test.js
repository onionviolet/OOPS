import test from 'node:test';import assert from 'node:assert/strict';
import {charmLoanActs,charmLoanFacts,charmLoanView,CHARM_LOAN_ID,CHARM_LOAN_KEY,CHARM_REPLACEMENT_KEY,CHARM_LOAN_USE} from '../src/lotm_charm_loan.js';
import {defineLotmActs} from '../src/lotm_act_engine.js';import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
test('loan uses existing native custody with agreed equivalent; burning reserves the distinct original cohort',()=>{
 const data=charmLoanActs(),compiled=defineLotmActs(data.rows,data.bindings,{worldId:LOTM_IDS.world,actorId:'player',group:'book_lotm',situationId:LOTM_IDS.situation});assert.deepEqual(compiled.unbound,[]);
 const effects=compiled.commands.flatMap(command=>command.effects).filter(effect=>effect.type==='custody');assert.equal(effects.length,3);
 assert.equal(effects[0].equivalentKey,CHARM_REPLACEMENT_KEY);assert.equal(effects[1].replacementKey,undefined);assert.equal(effects[2].replacementKey,CHARM_REPLACEMENT_KEY);
 const use=compiled.commands.find(command=>command.id===CHARM_LOAN_USE+'.activate');assert.equal(use.costs[0].key,CHARM_LOAN_KEY);assert.equal(use.costs[0].breakCustody,true);
 assert.ok(!compiled.commands.flatMap(command=>[...command.costs,...command.effects]).some(effect=>effect.type==='resource'));
});
test('absence is legacy compatible; the native loan stays owed after its actual item is consumed',()=>{
 assert.equal(charmLoanFacts({})['charm.slumber.loan.active'],false);
 const state={simulation:{custody:{[CHARM_LOAN_ID]:{owner:'neil',holder:'player',key:CHARM_LOAN_KEY}},jobs:[]}};
 assert.equal(charmLoanView(state).owes,'replacement in kind');
 assert.equal(charmLoanView(state,{gameplay:{player:{inventory:{[CHARM_LOAN_KEY]:1}}}}).owes,'return or replacement');
});
