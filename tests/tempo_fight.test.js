import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,driveTempoFight,handOverTempoFight,tempoView,mishapChance,recordTempoHold,TEMPO_MOVES} from '../src/tempo_fight.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const spec=(over={})=>({id:'fx1',title:'Alley scuffle',conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:30,stamina:30,profile,perception:6,stealth:6,...over.player},
    {id:'foe1',name:'Thug',side:'b',speed:100,hp:30,stamina:30,profile,perception:6,stealth:6,...over.foe}],...over.top});
function fresh(seed=7){
    const p=joinField(createFieldFixture());p.state.simulation.seed=seed;
    const context=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    return {p,context};
}
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);

test('a waiting fight saved mid-tempo resumes exactly after reload',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<3&&plan.state.simulation.sessions.player;i++){
        const v=tempoView(plan.state.simulation.sessions.player.nativeBattle);
        assert.ok(v.yourTurn&&v.next.length&&v.moves.length);
        plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
    }
    assert.ok(plan.state.simulation.sessions.player,'fight still open');
    const loaded=reload(plan.state);
    assert.deepEqual(loaded.simulation.sessions.player.nativeBattle,plan.state.simulation.sessions.player.nativeBattle);
    validateNativeBattle(loaded.simulation.sessions.player.nativeBattle,loaded.simulation.sessions.player,loaded);
    const a=commitTempoMove(plan.state,registry,context,{moveId:'guard'}),b=commitTempoMove(loaded,registry,context,{moveId:'guard'});
    assert.deepEqual(a.state.simulation,b.state.simulation);
});
test('earliest-ready acts: a fast fighter acts more often than a slow one',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec({player:{speed:200,perception:20,stealth:20},foe:{speed:100,perception:20,stealth:20}}));
    assert.equal(plan.state.simulation.sessions.player.nativeBattle.surprised,null);
    for(let i=0;i<6&&plan.state.simulation.sessions.player;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const b=plan.state.simulation.sessions.player.nativeBattle;
    assert.ok(b.fighters.player.ready<=b.fighters.foe1.ready+4);
});
test('the same seed gives the same fight; a headless driver names its policy',()=>{
    const run=()=>{const {p,context}=fresh(11);return driveTempoFight(beginTempoFight(p.state,registry,context,spec()).state,registry,context,'aggressive');};
    const a=run(),b=run();
    assert.deepEqual(a.state.simulation.log,b.state.simulation.log);
    assert.equal(a.state.simulation.sessions.player,undefined);
    assert.ok(['won','lost'].includes(a.state.actors.player.facts['tempo.lastResult']));
    const {p,context}=fresh();assert.throws(()=>driveTempoFight(p.state,registry,context,'whatever'),/policy/);
});
test('hand-over picks only safe moves and never attacks',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<20&&plan.state.simulation.sessions.player;i++)plan=handOverTempoFight(plan.state,registry,context);
    const open=plan.state.simulation.sessions.player?.nativeBattle;
    if(open)assert.ok(!open.log.some(l=>/^You (hit|miss|meet)/.test(l)),'no attack was made for the player');
    for(const id of ['jab','swing'])assert.equal(TEMPO_MOVES[id].safe,false);
});
test('surprise delays the unaware side and mishaps rise with conditions',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec({player:{perception:1,stealth:1},foe:{perception:30,stealth:30}}));
    const b=plan.state.simulation.sessions.player.nativeBattle;
    assert.equal(b.surprised,'a');assert.match(b.log[0],/caught off guard/);
    const f=b.fighters.player,calm=mishapChance(b,f);
    b.conditions={light:'dark',footing:'bad',weather:'rain'};
    assert.ok(mishapChance(b,f)>calm);assert.equal(calm,0);
});
test('away minutes are kept and handed to the world after the fight',()=>{
    const {p,context}=fresh(3);
    let plan=beginTempoFight(p.state,registry,context,spec());
    recordTempoHold(90);
    plan=commitTempoMove(plan.state,registry,context,{moveId:'jab'});
    assert.equal(plan.state.simulation.sessions.player.nativeBattle.held,90);
    plan=driveTempoFight(plan.state,registry,context,'aggressive');
    assert.equal(plan.state.actors.player.facts['tempo.held_minutes'],90);
});
test('stale and wrong-turn commands are rejected',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec());
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'jab'},plan.state.sequence-1),/stale/);
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'swing',actorId:'foe1'}),/turn|cannot/);
});

import {commitSimulationCommand} from '../src/simulation.js';
import {fieldCommand,fieldAdvance} from '../scripts/field_fixtures.mjs';
test('a tempo contest closes the road rivalry exactly as the native duel does',()=>{
    let p=joinField(createFieldFixture());p.state.simulation.seed=5;
    p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const ctx=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    const requestId=p.state.simulation.pursuits['frontier.road_rival'].request.id;
    const adopt=commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId},{...ctx,targetId:'roadRival'});
    const rival=adopt.state.simulation.people.roadRival;
    let plan=beginTempoFight(adopt.state,registry,ctx,{adopt,id:'rival',title:"Mara's road contest",floor:1,fighters:[
        {id:'player',name:'You',side:'a',hp:30,stamina:30,profile},
        {id:'roadRival',name:'Mara',side:'b',hp:rival.vitals.health,stamina:rival.vitals.stamina,profile}]});
    assert.equal(plan.state.simulation.sessions.player.definitionId,'rival.native_duel');
    plan=driveTempoFight(plan.state,registry,ctx,'aggressive');
    assert.equal(plan.state.simulation.sessions.player,undefined);
    const result=plan.state.actors.player.facts['rival.lastResult'];
    assert.ok(['won','lost','withdrawn'].includes(result));
    assert.notEqual(plan.state.simulation.pursuits['frontier.road_rival'].status,'encounter');
    assert.ok(plan.native);
});

test('a damaging public strike leaves a witnessed memory effect with a severity rung',()=>{
    const {p,context}=fresh(11);
    const plan=driveTempoFight(beginTempoFight(p.state,registry,context,spec()).state,registry,context,'aggressive');
    assert.ok(plan.memoryEffects?.length>0);
    const e=plan.memoryEffects[0];
    assert.ok(e.scene.severity>=1&&e.scene.severity<=4&&e.cause.startsWith('battle:fx1:'));
});

test('away minutes recorded against the open fight survive a reload',()=>{
    const {p,context}=fresh(3);
    const plan=beginTempoFight(p.state,registry,context,spec());
    recordTempoHold(45,plan.state.simulation.sessions.player.nativeBattle);
    const loaded=reload(JSON.parse(JSON.stringify(plan.state)));
    assert.equal(loaded.simulation.sessions.player.nativeBattle.held,45);
});
