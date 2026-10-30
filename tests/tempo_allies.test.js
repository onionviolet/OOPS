import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,driveTempoFight,tempoView,nextActor} from '../src/tempo_fight.js';
import {allyFear,orderChance,coverChance} from '../src/tempo_allies.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const ally=(over={})=>({goals:{survive:.5,protect:.6,aim:.3,pay:.2},bond:.7,discipline:.5,protectId:'player',order:null,...over});
const spec=(over={})=>({id:'fx2',title:'Alley scuffle',conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:24,maxHp:30,stamina:30,profile,perception:20,stealth:20},
    {id:'friend',name:'Neil',side:'a',speed:100,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','tend','withdraw'],ally:ally(over.ally),...over.friend},
    {id:'foe1',name:'Thug',side:'b',speed:100,hp:30,stamina:30,profile,perception:20,stealth:20,...over.foe}]});
function fresh(seed=7){
    const p=joinField(createFieldFixture());p.state.simulation.seed=seed;
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);
const openB=plan=>plan.state.simulation.sessions.player.nativeBattle;

test('an ally with no orders acts from their own goals on the same clock',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    for(let i=0;i<6&&plan.state.simulation.sessions.player;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const lines=(openB(plan)?.log||plan.state.simulation.log.map(l=>l.text)).join(' ');
    assert.match(lines,/Neil/);
});
test('a frightened ally with weak ties leaves; a bonded, disciplined one stays',()=>{
    const {p,context}=fresh(5);
    const scared={goals:{survive:.9,protect:.1,aim:.1,pay:0},bond:.1,discipline:.1};
    let plan=beginTempoFight(p.state,registry,context,spec({ally:scared,friend:{hp:10,maxHp:30}}));
    for(let i=0;i<4&&plan.state.simulation.sessions.player;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const b=openB(plan);
    assert.equal(b.fighters.friend.status,'left');assert.match(b.log.join(' '),/hangs back, pale/);
    const {p:p2,context:c2}=fresh(5);
    let steady=beginTempoFight(p2.state,registry,c2,spec({ally:{goals:{survive:.4,protect:.8,aim:.4,pay:.5},bond:.9,discipline:.9},friend:{hp:12,maxHp:30}}));
    for(let i=0;i<4&&steady.state.simulation.sessions.player;i++)steady=commitTempoMove(steady.state,registry,c2,{moveId:'guard'});
    assert.notEqual(openB(steady)?.fighters.friend.status,'left');
});
test('orders cost tempo, are heard by keyed chance on real factors, and edit the ally',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    const v=tempoView(openB(plan));
    assert.ok(v.orders.length===3&&v.orders[0].odds&&v.allies[0].name==='Neil');
    const b0=openB(plan),near=orderChance(b0,b0.fighters.friend);
    b0.conditions.noise=1;b0.conditions.distance=1;
    assert.ok(orderChance(b0,b0.fighters.friend)<near);b0.conditions={light:'day',footing:'firm',weather:'clear'};
    const ready=b0.fighters.player.ready;
    const a=commitTempoMove(plan.state,registry,context,{moveId:'order',allyId:'friend',orderId:'cover'}),
          c=commitTempoMove(plan.state,registry,context,{moveId:'order',allyId:'friend',orderId:'cover'});
    assert.deepEqual(a.state.simulation,c.state.simulation,'same situation, same answer');
    const after=openB(a);assert.ok(after.fighters.player.ready>ready);
    assert.match(after.log.join(' '),/You tell Neil: "Cover me\."/);
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'order',allyId:'foe1',orderId:'cover'}),/No such ally/);
});
test('a followed cover order can put the ally in front of a blow, and fall back removes them',()=>{
    let covered=false;
    for(let seed=1;seed<40&&!covered;seed++){
        const {p,context}=fresh(seed);
        let plan=beginTempoFight(p.state,registry,context,spec({ally:{bond:1,discipline:1}}));
        for(let i=0;i<8&&plan.state.simulation.sessions.player;i++){
            const live=openB(plan).fighters.friend.status==='active';
            plan=commitTempoMove(plan.state,registry,context,live&&i%3===0?{moveId:'order',allyId:'friend',orderId:'cover'}:{moveId:'guard'});
            if(openB(plan)?.log.some(l=>/steps into the blow/.test(l))){covered=true;break;}
        }
    }
    assert.ok(covered,'cover substitution happens for some situations');
    let left=false;
    for(let seed=1;seed<30&&!left;seed++){
        const {p,context}=fresh(seed);
        const plan=commitTempoMove(beginTempoFight(p.state,registry,context,spec({ally:{bond:1,discipline:1}})).state,registry,context,{moveId:'order',allyId:'friend',orderId:'fall_back'});
        left=openB(plan)?.fighters.friend.status==='left'&&/falls back, as asked/.test(openB(plan).log.join(' '));
    }
    assert.ok(left);
});
test('a fight with an ally saved mid-tempo resumes exactly, and only a standing player ends it',()=>{
    const {p,context}=fresh(3);
    let plan=beginTempoFight(p.state,registry,context,spec());
    plan=commitTempoMove(plan.state,registry,context,{moveId:'order',allyId:'friend',orderId:'focus'});
    const loaded=reload(plan.state);
    assert.deepEqual(openB({state:loaded}),openB(plan));
    validateNativeBattle(openB({state:loaded}),loaded.simulation.sessions.player,loaded);
    const a=commitTempoMove(plan.state,registry,context,{moveId:'jab'}),b=commitTempoMove(loaded,registry,context,{moveId:'jab'});
    assert.deepEqual(a.state.simulation,b.state.simulation);
    const run=driveTempoFight(plan.state,registry,context,'aggressive');
    assert.ok(['won','lost'].includes(run.state.actors.player.facts['tempo.lastResult']));
});
test('fear is derived from what is happening, not stored',()=>{
    const {p,context}=fresh();
    const b=openB(beginTempoFight(p.state,registry,context,spec()));
    const f=b.fighters.friend,calm=allyFear(b,f);
    f.hp=5;assert.ok(allyFear(b,f)>calm);f.hp=30;
    b.fighters.player.status='down';assert.ok(allyFear(b,f)>calm);
    assert.ok(coverChance(b,f)>0);
});

import {initializePartyBattle} from '../src/party_battle.js';
import {PARTY_HELPER} from '../src/native_battle_contracts.js';
import {fieldCommand,fieldAdvance} from '../scripts/field_fixtures.mjs';
test('Lio stands beside the player in the road contest under the party terms and the fight writes the bond',()=>{
    let p=joinField(createFieldFixture());p=fieldCommand(p,'party.meet');p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const ctx=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    const adopt=initializePartyBattle(p.state,registry,{requestId:p.state.simulation.pursuits['frontier.road_rival'].request.id},ctx);
    const lio=adopt.state.simulation.people[PARTY_HELPER],rival=adopt.state.simulation.people.roadRival;
    const pr={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
    let plan=beginTempoFight(adopt.state,registry,ctx,{adopt,id:'road',title:'Road contest',floor:1,fighters:[
        {id:'player',name:'You',side:'a',hp:30,stamina:30,profile:pr},
        {id:PARTY_HELPER,name:'Lio',side:'a',hp:lio.vitals.health,maxHp:lio.vitals.max_health,stamina:lio.vitals.stamina,profile:pr,moves:['guard','tend','jab','withdraw'],ally:ally()},
        {id:'roadRival',name:'Mara',side:'b',hp:rival.vitals.health,stamina:rival.vitals.stamina,profile:pr}]});
    assert.ok(plan.state.simulation.sessions.player.participants.includes(PARTY_HELPER));
    plan=driveTempoFight(plan.state,registry,ctx,'aggressive');
    assert.equal(plan.state.simulation.sessions.player,undefined);
    assert.ok(['won','lost','withdrawn'].includes(plan.state.actors.player.facts['party.lastResult']));
    assert.ok(plan.state.simulation.relationships.player[PARTY_HELPER].memories.some(m=>/road contest|left the contest/.test(m.text)));
});
