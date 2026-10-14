import test from 'node:test';
import assert from 'node:assert/strict';
import {dialogues} from '../src/data/dialogues.js';
const guard=dialogues['gate guard'];
const context=(money=0,Town=0)=>({character:{money,reputation:{Town},getFullStats:()=>({})}});
test('town fee requires full payment and carries an exact one-time debit',()=>{
 const fee=guard.actions['pay fee'],a=fee.getAvailabilityComponent();a.setStatus({is_unlocked:true});
 assert.equal(a.canBeDisplayed(context(14999)),0);assert.equal(a.canSucceed(context(14999)),0);
 assert.equal(a.canBeDisplayed(context(15000)),1);assert.equal(a.canSucceed(context(15000)),1);
 assert.equal(fee.rewards.money,-15000);assert.equal(a.isRepeatable(),false);
 a.setStatus({is_finished:true});assert.equal(a.canBeStarted(context(15000)),false);
});
test('reputation entry requires Town 15 and closes the alternate fee route',()=>{
 const line=guard.textlines['entry rep'];line.getAvailabilityComponent().setStatus({is_unlocked:true});
 assert.equal(line.getAvailabilityComponent().canBeDisplayed(context(0,14)),0);assert.equal(line.getAvailabilityComponent().canBeDisplayed(context(0,15)),1);
 assert.deepEqual(line.rewards.locations,[{location:'Town square'}]);
 assert.deepEqual(line.rewards.locks.actions,[{dialogue:'gate guard',action:'pay fee'}]);
});
test('old defeated saves have repeatable recovery dialogue routes to town entry',()=>{
 for(const id of ['defeated','boss','behave 2','behave 3']) {
 const rewards=dialogues['suspicious man'].textlines[id].rewards;
 assert.ok(rewards.textlines.some(r=>r.dialogue==='gate guard'&&r.lines.includes('enter 2')),id);
 assert.ok(rewards.locks.textlines['gate guard'].includes('enter'),id);
 }
});
