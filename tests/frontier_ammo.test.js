// W10-C second world (AD51): Frontier bow ammunition through the same ready-stock seam as the revolver. TEST-LEVEL: the Frontier has no bow item, recipe or
// opener yet (the road duel's spec lives in tempo_fight_domain.js), so arrows here are actor resources under the bow's declared keys.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,tempoView} from '../src/tempo_fight.js';
import {STOCK_PROPERTY_DIALS,frontierBowKeys,frontierBowStock} from '../src/stock_kinds.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
// Certain hits so the count of shots is the dial's arithmetic; the real dial (a bit better than a coin flip) is checked separately.
const SURE={...STOCK_PROPERTY_DIALS,frontierBowChance:{value:1}};
const bowFight=(p,kind,dials)=>({id:'fx-bow',title:'Road shots',floor:1,conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:300,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','withdraw','shoot','reload'],
        stock:frontierBowStock(p.state.actors.player.resources,kind,['mara'],{dials})},
    {id:'mara',name:'Mara',side:'b',speed:60,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard'],tags:['living','person']}]});
function fresh(res){
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;Object.assign(p.state.actors.player.resources,res);
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
const fight=plan=>plan.state.simulation.sessions.player?.nativeBattle;
// Nocks and looses until the fight ends; returns the plan.
function loose(plan,context){
    for(let i=0;i<60&&fight(plan);i++){
        const v=tempoView(fight(plan));if(!v.yourTurn)throw Error('not my turn');
        const m=v.moves.find(x=>x.id==='shoot'&&x.usable)?'shoot':'reload';
        plan=commitTempoMove(plan.state,registry,context,{moveId:m});
    }
    assert.equal(fight(plan),undefined,'the fight ended');return plan;
}
const A=frontierBowKeys('arrow'),P=frontierBowKeys('poisoned_arrow');

test('the bow is a one-arrow ready slot: one nocked, the rest in the quiver, keys per arrow kind',()=>{
    assert.notDeepEqual(A,P);assert.throws(()=>frontierBowKeys('silver'),/Unknown arrow kind/);
    const {p}=fresh({[A.loaded]:1,[A.carried]:7});
    const st=frontierBowStock(p.state.actors.player.resources,'arrow',['mara']);
    assert.deepEqual([st.kind,st.loaded,st.carried,st.capacity,st.batch],['arrow',1,7,1,1]);
    assert.deepEqual(st.start,{loaded:1,carried:7});
    assert.equal(st.vs.mara.chance,STOCK_PROPERTY_DIALS.frontierBowChance.value);assert.equal(st.vs.mara.downIn,STOCK_PROPERTY_DIALS.frontierBowDownIn.value);
});
test('arrows are spent in a Frontier tempo fight and written back once; nothing changes while it is open',()=>{
    const {p,context}=fresh({[A.loaded]:1,[A.carried]:7,[P.carried]:2});
    let plan=beginTempoFight(p.state,registry,context,bowFight(p,'arrow',SURE));
    const open=plan.state.actors.player.resources;
    assert.equal(open[A.loaded],1);assert.equal(open[A.carried],7,'begin does not touch the actor');
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.equal(plan.state.actors.player.resources[A.loaded],1,'no write while the fight is open');
    plan=loose(plan,context);
    const r=plan.state.actors.player.resources,spent=8-((r[A.loaded]||0)+(r[A.carried]||0));
    assert.equal(spent,4,'four certain arrows drop a scout (downIn 4); plain arrows spend once each');
    assert.equal(plan.state.actors.player.facts['tempo.lastResult'],'won');
    assert.equal(r[P.carried],2,'the other arrow kind is untouched');
    // Saved and reloaded, the written-back counts are the same (no second write).
    const again=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);
    assert.equal(again.actors.player.resources[A.carried],r[A.carried]);assert.equal(again.actors.player.resources[A.loaded]||0,r[A.loaded]||0);
});
test('poisoned arrows drop a living foe in fewer arrows than plain ones; the kind picked is the kind spent',()=>{
    const {p,context}=fresh({[A.carried]:6,[P.loaded]:1,[P.carried]:5});
    const plain=fresh({[A.loaded]:1,[A.carried]:5,[P.carried]:5});
    const used=(kind,q)=>{
        const r=loose(beginTempoFight(q.p.state,registry,q.context,bowFight(q.p,kind,SURE)),q.context).state.actors.player.resources,k=frontierBowKeys(kind);
        return {spent:6-((r[k.loaded]||0)+(r[k.carried]||0)),r};
    };
    const poison=used('poisoned_arrow',{p,context}),ord=used('arrow',plain);
    assert.equal(ord.spent,4);
    assert.equal(poison.spent,Math.ceil(4*STOCK_PROPERTY_DIALS.poisonVsLiving.value));
    assert.equal(poison.r[A.carried],6,'plain arrows untouched while poisoned ones were loosed');
    assert.equal(ord.r[P.carried],5,'poisoned arrows untouched while plain ones were loosed');
});
test('a miss still spends the arrow, and an empty bow cannot loose until the next arrow is nocked',()=>{
    const {p,context}=fresh({[A.loaded]:1,[A.carried]:9});
    let plan=beginTempoFight(p.state,registry,context,bowFight(p,'arrow',{...STOCK_PROPERTY_DIALS,frontierBowChance:{value:0}}));
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.equal(fight(plan).fighters.player.stock.loaded,0);assert.match(fight(plan).log.join(' '),/You fire and miss\./);
    assert.equal(tempoView(fight(plan)).moves.find(m=>m.id==='shoot').usable,false,'the bow is empty until you nock another');
});
