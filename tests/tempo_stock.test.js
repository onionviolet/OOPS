// AT15 / FD3 / FD17: ready stock inside a tempo fight (shoot, reload, write-back once) and fog as a fight condition.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,tempoView,mishapChance} from '../src/tempo_fight.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';
import {lotmShot} from '../src/book_world_lotm_fight.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const KEYS={loaded:'fx.loaded.ordinary',carried:'fx.carried.ordinary'};
const stock=(over={})=>({kind:'ordinary',loaded:3,carried:4,capacity:6,batch:3,keys:KEYS,start:{loaded:3,carried:4},vs:{foe1:{chance:1,downIn:2}},...over});
const spec=(over={})=>({id:'fx-gun',title:'Street shots',floor:1,conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','withdraw','shoot','reload'],stock:stock(over.stock),...over.player},
    {id:'foe1',name:'Thug',side:'b',speed:60,hp:30,stamina:30,profile,perception:20,stealth:20,...over.foe}],...over.top});
function fresh(res={[KEYS.loaded]:3,[KEYS.carried]:4}){
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;Object.assign(p.state.actors.player.resources,res);
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
const fight=plan=>plan.state.simulation.sessions.player?.nativeBattle;
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);

test('stock moves need stock: a fighter without it never gets shoot or reload, and old default moves are unchanged',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec({player:{stock:undefined}}));
    assert.deepEqual(fight(plan).fighters.player.moves,['jab','guard','withdraw']);
    assert.deepEqual(fight(plan).fighters.foe1.moves,['jab','swing','guard','tend','withdraw','yield']);
});
test('each shot spends one loaded round; downIn hits drop the foe; the spend is written back once at the end',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    assert.equal(p.state.actors.player.resources[KEYS.loaded],3,'begin does not touch the actor');
    const v=tempoView(fight(plan));
    assert.match(v.moves.find(m=>m.id==='shoot').text,/3 of 6 loaded, 4 carried/);
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.equal(fight(plan).fighters.player.stock.loaded,2);
    assert.equal(plan.state.actors.player.resources[KEYS.loaded],3,'no write while the fight is open');
    for(let i=0;i<4&&fight(plan);i++)if(tempoView(fight(plan)).yourTurn)plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.equal(fight(plan),undefined);
    assert.equal(plan.state.actors.player.facts['tempo.lastResult'],'won');
    assert.equal(plan.state.actors.player.resources[KEYS.loaded],1);
    assert.equal(plan.state.actors.player.resources[KEYS.carried],4);
});
test('a miss still spends; an empty chamber refuses with a reason; reload moves at most the batch',()=>{
    const {p,context}=fresh({[KEYS.loaded]:1,[KEYS.carried]:5});
    let plan=beginTempoFight(p.state,registry,context,spec({stock:{loaded:1,carried:5,start:{loaded:1,carried:5},vs:{foe1:{chance:0,downIn:2}}}}));
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.match(fight(plan).log.join(' '),/You fire and miss\./);
    const v=tempoView(fight(plan)),shoot=v.moves.find(m=>m.id==='shoot');
    assert.equal(shoot.usable,false);assert.equal(shoot.why,'The chamber is empty.');
    assert.throws(()=>commitTempoMove(plan.state,registry,context,{moveId:'shoot'}),/chamber is empty/);
    plan=commitTempoMove(plan.state,registry,context,{moveId:'reload'});
    assert.deepEqual([fight(plan).fighters.player.stock.loaded,fight(plan).fighters.player.stock.carried],[3,2]);
});
test('an open fight with stock survives save and reload and continues identically',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec({stock:{vs:{foe1:{chance:.5,downIn:3}}}}));
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    const loaded=reload(plan.state);
    assert.deepEqual(loaded.simulation.sessions.player.nativeBattle,fight(plan));
    validateNativeBattle(loaded.simulation.sessions.player.nativeBattle,loaded.simulation.sessions.player,loaded);
    const a=commitTempoMove(plan.state,registry,context,{moveId:'shoot'}),b=commitTempoMove(loaded,registry,context,{moveId:'shoot'});
    assert.deepEqual(a.state.simulation,b.state.simulation);
});
test('fog is an optional condition: absent changes nothing, present adds a mishap chance',()=>{
    const f={hp:30,maxHp:30,stamina:30,maxStamina:30,adrenalineUntil:0,tool:'familiar'},b=c=>({now:0,conditions:{light:'day',footing:'firm',weather:'clear',...c}});
    assert.equal(mishapChance(b({}),f),0);
    assert.ok(mishapChance(b({visibility:'fog'}),f)>0);
});
test('LOTM shot odds read the world clock: night fog lowers the chance against the same foe',()=>{
    const at=minute=>({clock:minute,lotm:{initializedAt:0}});
    const noon=lotmShot(at(12*60),{kind:'ordinary',fired:0}),fog=lotmShot(at(22*60),{kind:'ordinary',fired:0});
    assert.equal(noon.fog,null);assert.ok(fog.fog);
    assert.ok(fog.chance<noon.chance);
    assert.equal(fog.downIn,noon.downIn);
});
