import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {commitRemainderCombatFitCommand} from '../src/audit_remainder_combat_fit_host.js';
import {advanceAuditRemainder,auditRemainderNonceWindow,enterAuditRemainderMinute} from '../src/audit_remainder_runtime.js';

// F1 (simfuzz 2026-10-14): with the audit remainder open, the per-minute nonce
// must not depend on how played time is split into advanceSimulation calls.
const file=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-combat.txt',import.meta.url);
function setup(withJob){
 const raw=JSON.parse(Buffer.from(fs.readFileSync(file,'utf8').split(':')[1],'base64')),state=raw.expansion;
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,stock])=>[id==='main_character'?'player':id,{inventory:Object.fromEntries(Object.entries(stock).map(([k,e])=>[k,e.count])),skills:{},reputation:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:51,max_stamina:51}]));
 const context={actorId:'player',nativeAlive:true,nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals,gameplay,external:{money:raw.character.money},equipment:{player:{}},facts:{location:'Village'}};
 if(!withJob) return {plan:{state,external:context.external,gameplay},context};
 const terms=commitRemainderCombatFitCommand(state,registry,{type:'audit_remainder',id:'remainder_combat_fit.terms'},context);
 const plan=commitRemainderCombatFitCommand(terms.state,registry,{type:'audit_remainder',id:'remainder_combat_fit.grip_practice'},{...context,...terms});
 return {plan,context};
}
const step=(plan,context,minutes)=>{
 const out=advanceSimulation(plan.state,registry,minutes,plan.external,plan.gameplay,{player:{...context,vitals:plan.vitals?.player||context.vitals.player,gameplay:plan.gameplay}});
 return {...out,vitals:out.vitals||plan.vitals};
};
const durable=p=>JSON.stringify({state:p.state,external:p.external,gameplay:p.gameplay});
function compare(withJob,minutes){
 const {plan,context}=setup(withJob);
 assert.equal(plan.state.auditRemainder?.schema,1,'fixture has the audit remainder open');
 const jump=step(plan,context,minutes);
 let split=plan;for(let i=0;i<minutes;i++)split=step(split,context,1);
 assert.equal(split.state.clock,plan.state.clock+minutes);
 assert.equal(jump.state.sequence,split.state.sequence,`advance ${minutes} vs ${minutes} x advance 1`);
 assert.equal(durable(jump),durable(split));
 return {plan,jump,split};
}

test('event-free minutes bump the nonce once each, however they are split',()=>{
 const {plan,jump}=compare(false,7);
 assert.equal(jump.state.sequence,plan.state.sequence+7);
 const one=step(plan,setup(false).context,1);
 assert.equal(one.state.sequence,plan.state.sequence+1,'a one-minute tick keeps its single bump');
});

test('a window with a finished paid job matches minute stepping',()=>{
 const {plan}=setup(true),job=plan.state.simulation.jobs[0];
 const minutes=job.due-plan.state.clock+3;
 assert.ok(minutes>1&&minutes<=60);
 const {jump}=compare(true,minutes);
 assert.equal(jump.state.actors.player.completed[job.commandId],1);
});

// Played boundaries can also bump the sequence themselves (routines, causal
// story, consequence reconciliation), before or after the nonce check. Drive
// the runtime rule the way advanceSimulation does and compare minute stepping.
test('other bumps in the window give the same sequence split or jumped',()=>{
 const {plan}=setup(false),start=plan.state,minutes=9;
 const bumps={2:{before:1,after:0},3:{before:0,after:2},6:{before:2,after:1},7:{before:0,after:0}};
 const split=structuredClone(start);
 for(let t=start.clock+1;t<=start.clock+minutes;t++){
  const before=structuredClone(split),b=bumps[t-start.clock];split.clock=t;
  if(b)split.sequence+=b.before;
  advanceAuditRemainder(before,{state:split},registry);
  if(b)split.sequence+=b.after;
 }
 const jump=structuredClone(start),window=auditRemainderNonceWindow(jump);
 for(const [offset,b] of Object.entries(bumps)){
  const t=start.clock+Number(offset);enterAuditRemainderMinute(jump,window,t);jump.clock=t;
  jump.sequence+=b.before;advanceAuditRemainder(start,{state:jump},registry,{},window);jump.sequence+=b.after;
 }
 enterAuditRemainderMinute(jump,window,start.clock+minutes);jump.clock=start.clock+minutes;
 advanceAuditRemainder(start,{state:jump},registry,{},window);
 // Minutes 1,4,5,8,9 and 7 (no bump) get one nonce each; 2 already moved before
 // its check; 3 and 6 get the nonce only when nothing preceded the check.
 assert.equal(split.sequence-start.sequence,6+1+(1+2)+(2+1));
 assert.equal(jump.sequence,split.sequence);
});
