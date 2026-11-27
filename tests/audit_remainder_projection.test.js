import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditRemainderCombinedFacts} from '../src/audit_remainder_facts.js';
import {auditRemainderFacts} from '../src/audit_remainder_state.js';
import {remainderLivelihoodFacts} from '../src/audit_remainder_livelihood_facts.js';
import {remainderHomeFacts} from '../src/audit_remainder_home_facts.js';
import {remainderOffersFacts} from '../src/audit_remainder_offers_state.js';
import {remainderConsequencesFacts} from '../src/audit_remainder_consequences_facts.js';
import {remainderCombatFitFacts} from '../src/audit_remainder_combat_fit_facts.js';
import {remainderCombatObjectivesFacts} from '../src/audit_remainder_combat_objectives_content.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';

const readers=[remainderLivelihoodFacts,remainderHomeFacts,remainderOffersFacts,
 remainderConsequencesFacts,remainderCombatFitFacts,remainderCombatObjectivesFacts];
function reference(state,context){
 const facts=auditRemainderFacts(state);
 for(const read of readers){
  const next=read(state,{...context,facts:{...context.facts,...facts}},registry);
  delete next['auditRemainder.enrolled'];Object.assign(facts,next);
 }
 return facts;
}
const file=new URL('../docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/fixture/TEST-FIXTURE-R15-G4-combat.txt',import.meta.url);
const raw=JSON.parse(Buffer.from(readFileSync(file,'utf8').split(':')[1],'base64'));
function setup(){
 const state=structuredClone(raw.expansion);
 const gameplay=Object.fromEntries(Object.entries(raw.inventories.person).map(([id,stock])=>[id==='main_character'?'player':id,
  {inventory:Object.fromEntries(Object.entries(stock).map(([key,row])=>[key,row.count])),skills:{},reputation:{}}]));
 const vitals=Object.fromEntries(Object.entries(state.simulation.people).map(([id,p])=>[id,p.vitals||{health:80,max_health:80,stamina:51,max_stamina:51}]));
 return {state,context:{actorId:'player',nativeAlive:true,nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true},
  vitals,gameplay,external:{money:raw.character.money},equipment:{player:{}},facts:{location:'Village'}}};
}
function freeze(value){
 if(!value||typeof value!=='object'||Object.isFrozen(value))return value;
 for(const child of Object.values(value))freeze(child);
 return Object.freeze(value);
}

test('ordered local dependency reuse preserves fact bytes, root precedence and read-only inputs',()=>{
 for(const kind of ['local','hurt','away','older']){
  const {state,context}=setup();
  if(kind==='hurt')context.vitals.player.health=0;
  if(kind==='away')context.facts.location='fixture.elsewhere';
  if(kind==='older')delete state.auditRemainder;
  context.facts['auditRemainder.enrolled']=!auditRemainderFacts(state)['auditRemainder.enrolled'];
  context.facts['remainder.combatFit.workSupported']='untrusted inherited value';
  const before=JSON.stringify({state,context}),expected=reference(state,context);
  freeze(state);freeze(context);
  const actual=auditRemainderCombinedFacts(state,context,registry);
  assert.equal(JSON.stringify(actual),JSON.stringify(expected),kind+' preserves values and key order');
  assert.equal(actual['auditRemainder.enrolled'],auditRemainderFacts(state)['auditRemainder.enrolled']);
  assert.equal(JSON.stringify({state,context}),before,kind+' leaves serialized inputs untouched');
 }
});

test('large inherited facts are enumerated once rather than once per projection',()=>{
 const {state,context}=setup();let enumerations=0;
 context.facts=new Proxy({...context.facts,...Object.fromEntries(Array.from({length:1500},(_,i)=>['fixture.'+i,i]))},
  {ownKeys(target){enumerations++;return Reflect.ownKeys(target);}});
 const expected=reference(state,context);assert.equal(enumerations,6);
 enumerations=0;const actual=auditRemainderCombinedFacts(state,context,registry);
 assert.equal(enumerations,1,'one caller-owned dependency dictionary per combined read');
 assert.equal(JSON.stringify(actual),JSON.stringify(expected));
});
