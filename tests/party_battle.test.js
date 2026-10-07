import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {simulationOccupiesActor} from '../src/simulation.js';
import {initializePartyBattle,commitPartyBattleAction,withdrawPartyBattle,partyHelperReasons} from '../src/party_battle.js';
import {PARTY_HELPER,PARTY_METHOD,validateNativeBattle} from '../src/native_battle_contracts.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,fieldContext,kit} from '../scripts/field_fixtures.mjs';
const context=p=>fieldContext(p,'Village',{vitals:{player:{health:30-(p.native?.hpToFull||0),max_health:30,stamina:30-(p.native?.staminaToFull||0),max_stamina:30}}});
const setup=()=>{let p=joinField(createFieldFixture());p=fieldCommand(p,'party.meet');return fieldAdvance(fieldCommand(p,'rival.begin'),3);};
const begin=p=>initializePartyBattle(p.state,registry,{requestId:p.state.simulation.pursuits['frontier.road_rival'].request.id},context(p));
const fighter={attackPower:8,stats:{attack_points:10000,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:0,crit_multiplier:1,stamina_efficiency:1},shield:0,shieldSkill:0};
const fighters={player:fighter,roadRival:fighter,partyPartner:{...fighter,stats:{...fighter.stats,defense:3}}};
const action=(p,actorId,type='strike',extra={})=>{const session=p.state.simulation.sessions.player;return commitPartyBattleAction(p.state,registry,{actorId,type,targetId:actorId==='player'?'roadRival':'player',sessionId:session.id,sequence:p.state.sequence,action:session.nativeBattle.actions,fighters,...extra},context(p));};

test('optional party enrollment owns its own kit/body/source and does not grant player support',()=>{
 const original=joinField(createFieldFixture());assert.equal(original.state.actors[PARTY_HELPER],undefined);
 const p=setup();assert.equal(p.state.simulation.owners[PARTY_HELPER][kit],1);assert.equal(p.state.actors[PARTY_HELPER].resources.brace_effort,4);
 assert.ok(p.state.actors[PARTY_HELPER].sources[PARTY_METHOD]);assert.equal(p.state.actors.player.sources[PARTY_METHOD],undefined);
});
test('joining spends one real fee, reserves the legal cast and survives supported reload',()=>{
 const p=setup(),before=structuredClone(p),b=begin(p);assert.deepEqual(p,before);assert.equal(b.external.money,p.external.money-1);assert.equal(b.state.actors[PARTY_HELPER].resources.coins,1);
 assert.deepEqual(b.state.simulation.sessions.player.participants,['player','roadRival',PARTY_HELPER]);assert.equal(simulationOccupiesActor(b.state,PARTY_HELPER),true);
 assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(b.state)),registry),b.state);
 assert.throws(()=>begin(b));
});
test('a held guard costs ally stamina/effort once and redirects actual damage to the ally',()=>{
 let p=begin(setup());const playerBefore=context(p).vitals.player,allyBefore=structuredClone(p.state.simulation.people[PARTY_HELPER].vitals);
 p=action(p,PARTY_HELPER,'guard');assert.equal(p.state.actors[PARTY_HELPER].resources.brace_effort,3);assert.equal(p.state.simulation.people[PARTY_HELPER].vitals.stamina,allyBefore.stamina-2);
 assert.deepEqual(context(p).vitals.player,playerBefore);assert.throws(()=>action(p,PARTY_HELPER,'guard'),/held/);
 p=action(p,'roadRival');assert.equal(p.state.simulation.sessions.player.nativeBattle.lastTarget,PARTY_HELPER);assert.equal(p.state.simulation.sessions.player.nativeBattle.guardsTaken,1);
 assert.ok(p.state.simulation.people[PARTY_HELPER].vitals.health<allyBefore.health);assert.equal(p.native.hpToFull,0);
});
test('unsupported, busy, wrong-target and stale packets reject without partial spend',()=>{
 for(const variant of ['busy','body','fuel','suppressed','borrowed','willing']){
  const p=setup();if(variant==='busy')p.state.pending.push({context:{actorId:PARTY_HELPER}});
  if(variant==='body')p.state.simulation.people[PARTY_HELPER].body.can_brace=false;
  if(variant==='fuel')p.state.actors[PARTY_HELPER].resources.brace_effort=0;
  if(variant==='suppressed')p.state.simulation.faculties[PARTY_HELPER][PARTY_METHOD].suppressed=true;
  if(variant==='borrowed')p.state.simulation.custody.loan={owner:'player',holder:PARTY_HELPER,key:kit,count:1,at:p.state.clock,cause:'fixture:loan'};
  if(variant==='willing')p.state.actors[PARTY_HELPER].facts['party.willing']=false;
  const before=structuredClone(p);assert.ok(partyHelperReasons(p.state,context(p)).length);assert.throws(()=>begin(p));assert.deepEqual(p,before);
 }
 const p=begin(setup()),session=p.state.simulation.sessions.player,packet={actorId:PARTY_HELPER,type:'guard',targetId:'player',sessionId:session.id,sequence:p.state.sequence,action:0};
 const guarded=commitPartyBattleAction(p.state,registry,packet,context(p));assert.throws(()=>commitPartyBattleAction(guarded.state,registry,packet,context(guarded)),/stale/);
 assert.throws(()=>action(p,PARTY_HELPER,'guard',{targetId:'roadRival'}),/guards/);
});
test('yield and release stop only the ally, retain wounds and preserve a legal solo continuation',()=>{
 let p=begin(setup());p=action(p,PARTY_HELPER,'guard');p=action(p,'roadRival','strike',{fighters:{...fighters,roadRival:{...fighter,attackPower:100}}});
 assert.equal(p.state.simulation.people[PARTY_HELPER].vitals.health,1);assert.equal(p.state.simulation.people[PARTY_HELPER].life,'alive');
 assert.equal(p.state.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].status,'yielded');assert.equal(simulationOccupiesActor(p.state,PARTY_HELPER),false);
 assert.throws(()=>action(p,PARTY_HELPER,'guard'),/left/);p=action(p,'player');assert.ok(p.state.simulation.sessions.player);
 const released=action(begin(setup()),PARTY_HELPER,'release');assert.equal(released.state.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].status,'released');
 assert.equal(released.state.simulation.people[PARTY_HELPER].vitals.health,28);
});
test('suppression before impact removes guard without refund or phantom protection',()=>{
 let p=action(begin(setup()),PARTY_HELPER,'guard');p.state.simulation.faculties[PARTY_HELPER][PARTY_METHOD].suppressed=true;
 p=action(p,'roadRival');assert.equal(p.state.simulation.sessions.player.nativeBattle.lastTarget,'player');assert.equal(p.state.actors[PARTY_HELPER].resources.brace_effort,3);
 assert.equal(p.state.simulation.people[PARTY_HELPER].vitals.health,28);assert.ok(p.native.hpToFull>0);assert.equal(p.state.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].status,'unsupported');
});
test('final victory/withdrawal retains actual costs and witnessed aftermath without repeat rewards',()=>{
 const p=begin(setup()),fee=p.external.money;
 const won=action(p,'player','strike',{fighters:{...fighters,player:{...fighter,attackPower:100}}});assert.equal(won.state.simulation.sessions.player,undefined);assert.equal(won.state.actors.player.facts['party.lastResult'],'won');assert.equal(won.external.money,fee);
 assert.equal(won.state.simulation.people.roadRival.vitals.health,1);assert.ok(won.state.actors.player.sources['frontier.rival_insight']);assert.throws(()=>action(won,'player'));
 const withdrawn=withdrawPartyBattle(p.state,registry,context(p));assert.equal(withdrawn.state.actors.player.facts['party.lastResult'],'withdrawn');assert.equal(withdrawn.external.money,fee);
 assert.throws(()=>withdrawPartyBattle(withdrawn.state,registry,context(withdrawn)));
});
test('failed persistence cannot publish independent stamina/fuel/HP, and saved action RNG roundtrips',()=>{
 const p=begin(setup()),before=structuredClone(p),g=action(p,PARTY_HELPER,'guard');
 const envelope={character:{money:p.external.money},levels:{person:{main_character:{},oldCraftsman:{}}},inventories:{person:{main_character:{},oldCraftsman:{}}},expansion:p.state};
 const bytes=JSON.stringify(envelope);let committed=bytes;
 assert.throws(()=>persistExpansionPlan(g,{createSave:()=>bytes,key:'fixture',storage:{setItem(){throw Error('quota');}},bindings:{player:{category:'person',id:'main_character'},oldCraftsman:{category:'person',id:'oldCraftsman'}}}),/quota/);
 assert.equal(committed,bytes);assert.deepEqual(p,before);
 const r={...g,state:loadExpansionState(JSON.parse(JSON.stringify(g.state)),registry)};assert.deepEqual(action(g,'roadRival'),action(r,'roadRival'));
 const bad=structuredClone(g.state);bad.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].side='defenders';assert.throws(()=>loadExpansionState(bad,registry),/role/);
});
test('solo kit work keeps helper independent and uses the existing peaceful settlement',()=>{
 const p=setup(),helper=structuredClone(p.state.simulation.people[PARTY_HELPER]);const prep=fieldCommand(p,'party.prepare');assert.equal(prep.state.simulation.jobs.find(j=>j.actorId==='player').participants.length,1);
 const ready=fieldAdvance(prep,3),settled=fieldCommand(ready,'rival.settle','Village',{targetId:'roadRival'});
 assert.equal(settled.state.actors.player.facts['rival.resolved'],true);assert.deepEqual(settled.state.simulation.people[PARTY_HELPER],helper);
 assert.equal(settled.state.actors[PARTY_HELPER].resources.brace_effort,4);assert.equal(settled.state.simulation.owners.roadRival[kit],1);
});
test('the final paid guard intercepts before exhaustion, and consent loss withdraws only the helper',()=>{
 let p=setup();p.state.actors[PARTY_HELPER].resources.brace_effort=1;p.state.simulation.people[PARTY_HELPER].vitals.stamina=2;
 p=action(begin(p),PARTY_HELPER,'guard');assert.equal(p.state.actors[PARTY_HELPER].resources.brace_effort,0);assert.equal(p.state.simulation.people[PARTY_HELPER].vitals.stamina,0);
 p=action(p,'roadRival');assert.equal(p.state.simulation.sessions.player.nativeBattle.lastTarget,PARTY_HELPER);assert.equal(p.state.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].status,'exhausted');assert.equal(p.native.hpToFull,0);
 let q=action(begin(setup()),PARTY_HELPER,'guard');q.state.actors[PARTY_HELPER].facts['party.willing']=false;q=action(q,'roadRival');assert.equal(q.state.simulation.sessions.player.nativeBattle.lastTarget,'player');assert.equal(q.state.simulation.sessions.player.nativeBattle.fighters[PARTY_HELPER].status,'unsupported');
 const r=setup();r.state.simulation.people.roadRival.vitals.health=1;const before=structuredClone(r);assert.throws(()=>begin(r),/Mara must recover/);assert.deepEqual(r,before);
});
test('native strike wrapper supplies the actual redirected helper binding',async()=>{
 const {commitNativeBattleStrike}=await import('../src/native_battle.js');const p=action(begin(setup()),PARTY_HELPER,'guard');
 const next=commitNativeBattleStrike(p.state,registry,{actorId:'roadRival',targetId:'player',attacker:fighter,target:fighter,fighters},context(p));
 assert.equal(next.state.simulation.sessions.player.nativeBattle.lastTarget,PARTY_HELPER);assert.ok(next.state.simulation.people[PARTY_HELPER].vitals.health<28);
});
