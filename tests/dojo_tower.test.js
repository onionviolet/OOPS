import test from 'node:test';
import assert from 'node:assert/strict';
import {freshTower,quoteTower,beginTower,settleTower,validateTower,towerDrawEligible} from '../src/dojo_tower.js';
import {beginAttempt,enemySpecification,readProfileState,PROFILE_ID,AREA_ID,WORLD_ID} from '../src/absorb_p23/encounter_profiles/profile.js';
const profile=(tower,seed=5)=>beginAttempt(undefined,{seed,tower,worldId:WORLD_ID,locationId:AREA_ID,nativeEligible:true});
test('tower wager reserves an affordable payout and conserves native purse plus sponsor plus escrow through every outcome',()=>{
 for(const outcome of ['won','lost','withdrew','draw']){let money=20;const started=beginTower(undefined,{floor:1,stake:5,money,attempt:1});money+=started.coins;assert.equal(money+started.state.fund+started.state.pending.payout,60);const done=settleTower(started.state,{attempt:1,outcome});money+=done.coins;assert.equal(money+done.state.fund,60);assert.equal(done.state.best,outcome==='won'?1:0);assert.equal(done.state.pending,null);assert.equal(settleTower(done.state,{attempt:1,outcome}).coins,0);validateTower(JSON.parse(JSON.stringify(done.state)));}
 assert.equal(quoteTower(freshTower(),{floor:2,stake:1,money:20,attempt:1}).eligible,false);assert.throws(()=>beginTower({...freshTower(),fund:0},{floor:1,stake:5,money:20,attempt:1}),/sponsor/);assert.throws(()=>beginTower(undefined,{floor:1,stake:5,money:4,attempt:1}),/coins/);
});
test('same saved training seed keeps original stats; earned floor/repeats strengthen actual native enemy and diminish extra payout',()=>{
 const regular=enemySpecification(profile(undefined)),first=enemySpecification(profile({floor:1,repeat:0})),hard=enemySpecification(profile({floor:3,repeat:2}));assert.deepEqual(first.stats,regular.stats);assert.ok(hard.stats.health>regular.stats.health);assert.ok(hard.stats.attack>regular.stats.attack);assert.equal(hard.id,regular.id);assert.deepEqual(readProfileState(JSON.parse(JSON.stringify(profile({floor:3,repeat:2})))),profile({floor:3,repeat:2}));
 let t=settleTower(beginTower(undefined,{floor:1,stake:0,money:20,attempt:1}).state,{attempt:1,outcome:'won'}).state;const q=quoteTower(t,{floor:1,stake:0,money:20,attempt:2});assert.equal(q.bonus,1);assert.ok(q.scale>1);assert.equal(t.best,1);
 const bad=profile({floor:1,repeat:0});bad.pending.tower.repeat=-1;assert.throws(()=>readProfileState(bad),/tower/);
});
test('safe draw needs an actual exchanged blow and close surviving health shares',()=>{
 const combat={attackers:[{getFullStats:()=>({health:70,max_health:100})}],defenders:[{getFullStats:()=>({health:15,max_health:20})}]},p=profile({floor:1,repeat:0});assert.equal(towerDrawEligible(combat,p),false);p.pending.exchange=1;assert.equal(towerDrawEligible(combat,p),true);combat.defenders[0].getFullStats=()=>({health:1,max_health:20});assert.equal(towerDrawEligible(combat,p),false);
});

import {configureTowerRoutine,quoteTowerRoutine,stageTowerRoutineEntry,towerRoutineBody} from '../src/dojo_tower_routine.js';
const earnedTower=()=>settleTower(beginTower(undefined,{floor:1,stake:0,money:30,attempt:1}).state,{attempt:1,outcome:'won'}).state;
const routineFrame=()=>({world:WORLD_ID,location:'Proto23 Dojo lobby',body:'life-1:b:player:player:human',ready:true,money:30,health:80,maxHealth:100,stamina:6,maxStamina:10});
test('opted repeat admission freezes earned terms, preserves reserves, pauses on body/place/work/injury changes and waits for the real fight',()=>{
 const c=routineFrame(),t=configureTowerRoutine(earnedTower(),{enabled:true,stake:5,count:3,reserve:5,body:c.body});assert.equal(quoteTowerRoutine(t,c).eligible,true);for(const change of [{world:'base.frontier'},{location:'Village'},{body:'different'},{ready:false},{money:9},{health:74},{stamina:4}])assert.equal(quoteTowerRoutine(t,{...c,...change}).eligible,false);
 const started=beginTower(t,{floor:1,stake:5,money:c.money,attempt:2});stageTowerRoutineEntry(started.state,1,5);assert.equal(started.state.routine.remaining,2);assert.equal(quoteTowerRoutine(started.state,{...c,location:AREA_ID}).waiting,true);assert.equal(t.routine.remaining,3,'staging cannot debit the live admission count');assert.throws(()=>stageTowerRoutineEntry(started.state,1,1),/agreement/);
 for(const outcome of ['draw','lost','withdrew']){const end=settleTower(started.state,{attempt:2,outcome,at:123});assert.equal(end.state.routine.enabled,false);assert.equal(end.state.routine.last.at,123);assert.equal(end.state.routine.remaining,2);validateTower(end.state);}
 const won=settleTower(started.state,{attempt:2,outcome:'won',at:123});assert.equal(won.state.routine.enabled,true);assert.equal(won.state.routine.floor,1);assert.equal(quoteTowerRoutine(won.state,c).eligible,true);assert.equal(won.state.wins[1],2);assert.equal(won.state.routine.remaining,2);
 assert.throws(()=>configureTowerRoutine(freshTower(),{enabled:true,body:c.body}),/Earn/);const bad=structuredClone(t);bad.routine.floor=2;assert.throws(()=>validateTower(bad),/earned/);assert.equal(towerRoutineBody({id:'b',ownerId:'player',controllerId:'player',form:'human'},'life-1'),c.body);
});
test('three repeat admissions spend three real stakes and finite sponsor payouts; count exhaustion cannot make a fourth fight',()=>{
 let t=configureTowerRoutine(earnedTower(),{enabled:true,stake:0,count:3,reserve:5,body:routineFrame().body}),money=30;const total=t.fund+money;
 for(let attempt=2;attempt<=4;attempt++){const q=quoteTowerRoutine(t,{...routineFrame(),money});assert.equal(q.eligible,true);const p=beginTower(t,{floor:q.floor,stake:q.stake,money,attempt});stageTowerRoutineEntry(p.state,q.floor,q.stake);money+=p.coins;const r=settleTower(p.state,{attempt,outcome:'won',at:attempt});money+=r.coins;t=r.state;assert.equal(t.fund+money,total);}
 assert.equal(t.routine.remaining,0);assert.equal(t.routine.enabled,false);assert.equal(quoteTowerRoutine(t,{...routineFrame(),money}).eligible,false);validateTower(JSON.parse(JSON.stringify(t)));assert.equal(t.wins[1],4);
});
