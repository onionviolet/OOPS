// PT1: powers as targets. Mara copies a learned power on a landed hit; delivery and payload are separate; a negate resolves; it all saves.
import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {initializeNativeBattle,commitNativeBattleStrike,withdrawNativeBattle} from '../src/native_battle.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {RIVAL_PURSUIT,ROAD_RIVAL} from '../src/frontier_campaign.js';
import {PT_POWER,PT_KNOWLEDGE,attemptTaking,negatePower,settleTakenPowers,recallTaken,powerSheet,storedKit,takingWhy,takenUseReason,ensurePowerTaking} from '../src/power_taking.js';
import {validateSimulationState} from '../src/simulation_contracts.js';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,fieldContext,fieldReload} from '../scripts/field_fixtures.mjs';
const TRAIL='frontier.trail_reading',BRACE='frontier.brace_control';
const fighter={attackPower:5,stats:{attack_points:10000,attack_count:1,crit_rate:0,crit_multiplier:1,stamina_efficiency:1},shield:0,shieldSkill:0};
const target={stats:{agility:5,intuition:5,defense:1,crit_rate:0},shield:0,shieldSkill:0};
const context=p=>fieldContext(p,'Village');
const row=(mastery=2)=>({revision:1,owned:true,mastery,fragments:[],executions:0});
const accept=p=>initializeNativeBattle(commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId:p.state.simulation.pursuits[RIVAL_PURSUIT].request.id},{...context(p),targetId:ROAD_RIVAL}));
const begin=(powers={[TRAIL]:row()})=>{const p=fieldAdvance(fieldCommand(joinField(createFieldFixture()),'rival.begin'),3);p.state.simulation.powers.player=powers;return accept(p);};
const maraHit=(p,t=target)=>commitNativeBattleStrike(p.state,registry,{actorId:ROAD_RIVAL,targetId:'player',attacker:fighter,target:t},context(p));
const sim=p=>p.state.simulation;

test('Mara copies the power you know best on her first landed hit, on lease terms, and you see it',()=>{
 let p=begin({[TRAIL]:row(3),[BRACE]:row(1)});
 p=maraHit(p);
 const mine=sim(p).powers[ROAD_RIVAL];
 assert.equal(mine[TRAIL].taken.terms,'lease');assert.equal(mine[TRAIL].taken.from,'player');assert.equal(mine[BRACE],undefined,'one per duel');
 assert.equal(sim(p).powers.player[TRAIL].owned,true,'a copy leaves the source whole');
 assert.equal(sim(p).powers.player[TRAIL].takenBy[0].by,ROAD_RIVAL);
 assert.match(sim(p).knowledge.player[PT_KNOWLEDGE].value,/copied your/);
 assert.match(takingWhy(p.state,ROAD_RIVAL),/Delivered, then taken/);
 assert.equal(storedKit(p.state,registry,ROAD_RIVAL,'player')[0].label.length>0,true);
 const again=maraHit(p);assert.equal(Object.keys(sim(again).powers[ROAD_RIVAL]).filter(k=>!k.startsWith('cheat.')).length,1,'second hit, same duel: no second take');
 assert.deepEqual(powerSheet(p.state,registry,'player').map(r=>r.id).sort(),[BRACE,TRAIL]);
 validateSimulationState(sim(p),p.state,registry.simulation);
});

test('nothing to take is said, not silent',()=>{
 const p=begin({});ensurePowerTaking(p.state,ROAD_RIVAL);const q=maraHit(p);
 assert.match(takingWhy(q.state,ROAD_RIVAL),/no learned power to take/);
});

test('delivery and payload fail separately: a ward stops delivery, a full kit stops payload',()=>{
 const p=begin();ensurePowerTaking(p.state,ROAD_RIVAL);const ward={id:'test.ward',revision:1,label:'Test ward',model:'practice',capacity:1,taking:{ward:['copy','block']}};
 registry.simulation.powers.set(ward.id,ward);
 try{
  p.state.simulation.powers.player[ward.id]=row();
  const a=attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'a'});
  assert.equal(a.ok,false);assert.match(a.text,/Delivery stopped.*intercepted/);assert.equal(sim(p).powers[ROAD_RIVAL][TRAIL],undefined);
  delete p.state.simulation.powers.player[ward.id];
  const rec=sim(p).powers[ROAD_RIVAL][PT_POWER];rec.card.state.intake.capacity=0;
  const b=attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'b'});
  assert.match(b.text,/kit is full/);assert.equal(sim(p).powers[ROAD_RIVAL][TRAIL],undefined);
  rec.card.state.intake.capacity=2;
  sim(p).powers.player[TRAIL].taken={from:'x',mode:'copy',terms:'gift',at:0,until:null};
  assert.match(attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'c'}).text,/borrowed/);
 }finally{registry.simulation.powers.delete(ward.id);}
});

test('a lease ends at its time; a loan returns an absorbed power; digested stays; recall works on a loan',()=>{
 const p=begin();const rec=ensurePowerTaking(p.state,ROAD_RIVAL);
 rec.card.state.intake={...rec.card.state.intake,mode:'absorb',terms:'loan',minutes:30};
 const got=attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'a'});assert.equal(got.ok,true);
 assert.equal(sim(p).powers.player[TRAIL].owned,false,'absorbed: the source lost it');assert.equal(sim(p).powers[ROAD_RIVAL][TRAIL].owned,true);
 assert.match(powerSheet(p.state,registry,'player')[0].note.join(),/taken by Mara/);
 p.state.clock+=31;assert.equal(settleTakenPowers(p.state),1);
 assert.equal(sim(p).powers.player[TRAIL].owned,true,'the loan came back');assert.equal(sim(p).powers[ROAD_RIVAL][TRAIL],undefined);
 rec.card.state.intake={...rec.card.state.intake,mode:'copy',terms:'digested',minutes:undefined};delete rec.card.state.intake.minutes;
 attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'b'});p.state.clock+=99999;settleTakenPowers(p.state);
 assert.equal(sim(p).powers[ROAD_RIVAL][TRAIL].owned,true,'digested does not lapse');
});

test('negate: Mara holds the copied power shut after winning; the power command says why; it expires',()=>{
 let p=maraHit(begin());
 const ctx=context(p);ctx.vitals={player:{...ctx.vitals.player,health:2}};
 const q=commitNativeBattleStrike(p.state,registry,{actorId:ROAD_RIVAL,targetId:'player',attacker:fighter,target},ctx);
 assert.equal(sim(q).sessions.player,undefined,'the duel ended');
 const held=sim(q).powers.player[TRAIL].suppressed;
 assert.equal(held.by,ROAD_RIVAL);assert.equal(held.until-held.at,120);
 assert.match(takenUseReason(sim(q).powers.player[TRAIL],q.state.clock),/Mara is holding this power shut/);
 assert.match(sim(q).knowledge.player[PT_KNOWLEDGE].value,/held your .* shut/);
 q.state.clock=held.until;assert.equal(takenUseReason(sim(q).powers.player[TRAIL],q.state.clock),null);
});

test('negate refuses what is not held and a warded target; suppressing taking blocks a take',()=>{
 const p=begin();ensurePowerTaking(p.state,ROAD_RIVAL);
 assert.equal(negatePower(p.state,registry,{byId:ROAD_RIVAL,targetId:'player',powerId:BRACE,minutes:10}).ok,false);
 assert.equal(negatePower(p.state,registry,{byId:ROAD_RIVAL,targetId:'player',powerId:TRAIL,minutes:10,scope:'taking'}).ok,true);
 assert.match(attemptTaking(p.state,registry,{takerId:ROAD_RIVAL,targetId:'player',sessionId:'a'}).text,/held shut against taking/);
 assert.equal(recallTaken(p.state,{takerId:ROAD_RIVAL,powerId:TRAIL}),false);
});

test('taken rows, kits and suppression survive save, reload and a hostile record is refused',()=>{
 const p=maraHit(begin());const loaded=fieldReload(p);
 assert.deepEqual(sim(loaded).powers[ROAD_RIVAL],sim(p).powers[ROAD_RIVAL]);
 assert.deepEqual(sim(loaded).powers.player,sim(p).powers.player);
 const bad=structuredClone(p.state);bad.simulation.powers[ROAD_RIVAL][PT_POWER].card.state.kit[0].terms='forever';
 assert.throws(()=>validateSimulationState(bad.simulation,bad,registry.simulation));
 const bad2=structuredClone(p.state);bad2.simulation.powers.player[TRAIL].suppressed={by:'x',until:-1,at:0,scope:'use'};
 assert.throws(()=>validateSimulationState(bad2.simulation,bad2,registry.simulation));
});

// The played road duel is a tempo fight: the same intake and negate run there.
import {beginTempoFight,driveTempoFight} from '../src/tempo_fight.js';
test('in the tempo road duel Mara copies on a landed hit and, when she wins, holds the copy shut',()=>{
 const stats={attack_points:60,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.2,crit_multiplier:1.5,stamina_efficiency:1};
 const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
 let results=[];
 for(const seed of [5,6,7,8,9,10]){
  let p=joinField(createFieldFixture());p.state.simulation.seed=seed;
  p=fieldAdvance(fieldCommand(p,'rival.begin'),3);p.state.simulation.powers.player={[TRAIL]:row()};
  const ctx=fieldContext(p,'Village',{vitals:{player:{health:6,max_health:6,stamina:30,max_stamina:30}}});
  const adopt=commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId:p.state.simulation.pursuits[RIVAL_PURSUIT].request.id},{...ctx,targetId:ROAD_RIVAL});
  const rival=adopt.state.simulation.people[ROAD_RIVAL];
  let plan=beginTempoFight(adopt.state,registry,ctx,{adopt,id:'rival',title:"Mara's road contest",floor:1,fighters:[
   {id:'player',name:'You',side:'a',hp:6,maxHp:6,stamina:30,profile},{id:ROAD_RIVAL,name:'Mara',side:'b',hp:rival.vitals.health,stamina:rival.vitals.stamina,profile}]});
  plan=driveTempoFight(plan.state,registry,ctx,'aggressive');
  const s=sim(plan);results.push({result:plan.state.actors.player.facts['rival.lastResult'],took:!!s.powers[ROAD_RIVAL]?.[TRAIL],shut:!!s.powers.player[TRAIL].suppressed,seen:s.knowledge?.player?.[PT_KNOWLEDGE]?.value});
  if(results.at(-1).took&&results.at(-1).result==='lost')break;
 }
 const hit=results.find(r=>r.took&&r.result==='lost');
 assert.ok(hit,JSON.stringify(results));assert.equal(hit.shut,true);assert.match(hit.seen,/shut|copied/);
});
