import test from 'node:test';import assert from 'node:assert/strict';
import {charmLenderStockActs,withLenderStockParticipants,retainLenderStockJob,CHARM_LENDER_MAKE} from '../src/lotm_charm_lender_stock.js';
import {CHARM_MENTOR_ID} from '../src/lotm_charm_upkeep.js';
import {charmLoanActs,CHARM_LOAN_REPLACE,CHARM_LOAN_KEY,CHARM_REPLACEMENT_KEY} from '../src/lotm_charm_loan.js';
import {defineLotmActs} from '../src/lotm_act_engine.js';
const opts={worldId:'book.lotm.tingen',actorId:'player',group:'book_lotm',situationId:'book.lotm.tingen.canon_beside'};
test('mentor stock reserves existing materials and native fee, occupies the real mentor, and grants stock at completion',()=>{
 const data=charmLenderStockActs(),compiled=withLenderStockParticipants(defineLotmActs(data.rows,data.bindings,opts));assert.deepEqual(compiled.unbound,[]);
 const command=compiled.commands.find(command=>command.id===CHARM_LENDER_MAKE+'.make');
 assert.equal(command.duration,12);assert.deepEqual(command.participants,[CHARM_MENTOR_ID]);assert.equal(command.participantsCoLocated,true);assert.equal(command.completionCoLocated,true);assert.equal(command.cancellation,'refund');
 assert.deepEqual(command.costs.filter(effect=>effect.type==='item').map(effect=>[JSON.parse(effect.key).id,effect.amount]),[['book.lotm.slumber_silver',-1],['book.lotm.slumber_supplies',-1]]);
 assert.equal(command.costs.find(effect=>effect.native).amount,-12);assert.ok(!command.costs.some(effect=>effect.type==='energy'));
 const output=command.effects.find(effect=>effect.type==='item');assert.equal(output.actor,CHARM_MENTOR_ID);assert.equal(output.key,CHARM_LOAN_KEY);assert.equal(output.amount,1);
 assert.equal(command.effects.find(effect=>effect.type==='resource').actor,CHARM_MENTOR_ID);
});
test('repayment classifies one actual equivalent as lendable without duplicating the returned item',()=>{
 const data=charmLoanActs(),effects=data.bindings[CHARM_LOAN_REPLACE].steps.replace.effects;
 assert.equal(effects[0].type,'custody');assert.equal(effects[0].replacementKey,CHARM_REPLACEMENT_KEY);
 assert.deepEqual(effects.slice(1).map(effect=>[effect.key,effect.amount]),[[CHARM_REPLACEMENT_KEY,-1],[CHARM_LOAN_KEY,1]]);
});
test('a pending public mentor job validates before a private cast arrives, without accepting arbitrary saved commands',()=>{
 const registry={simulation:{commands:new Map()}},state={simulation:{jobs:[{commandId:CHARM_LENDER_MAKE+'.make',effects:[{type:'item',amount:999}]}]}};
 assert.equal(retainLenderStockJob(state,registry),true);
 const def=registry.simulation.commands.get(CHARM_LENDER_MAKE+'.make');assert.equal(def.effects.find(effect=>effect.type==='item').amount,1);assert.deepEqual(def.participants,[CHARM_MENTOR_ID]);
 assert.equal(retainLenderStockJob(state,registry),false);
 const unknown={simulation:{commands:new Map()}};assert.equal(retainLenderStockJob({simulation:{jobs:[{commandId:'unsupported.job'}]}},unknown),false);assert.equal(unknown.simulation.commands.size,0);
});
