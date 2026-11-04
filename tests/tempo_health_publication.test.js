import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture, joinField, fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight, commitTempoMove} from '../src/tempo_fight.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {publishNativeVitals} from '../src/native_gameplay_adapter.js';
import {tempoSituation} from '../src/ui/combat_situation.js';

const stats = {attack_points:45, agility:5, intuition:5, defense:1, attack_count:1, crit_rate:.3, crit_multiplier:1.5, stamina_efficiency:1};
const profile = {stats, attackPower:8, shield:0, shieldSkill:0, emptyStaminaMultiplier:.5};
const spec = (hp = 30, speed = 100, foeSpeed = 100) => ({id:'health-fixture', fighters:[
    {id:'player', name:'You', side:'a', speed, hp, maxHp:30, stamina:30, maxStamina:30, profile, perception:20, stealth:20},
    {id:'foe1', name:'Foe', side:'b', speed:foeSpeed, hp:100, maxHp:100, stamina:30, profile, perception:20, stealth:20}
]});
function setup(hp = 30) {
    const p = joinField(createFieldFixture()); p.state.simulation.seed = 4;
    const native = {health:hp, max_health:30, stamina:30, max_stamina:30}, player = {getFullStats:()=>native};
    let state = p.state;
    let bytes = JSON.stringify({character:{money:p.external.money, hp_to_full:30-hp, stamina_to_full:0}, expansion:state,
        inventories:{person:{main_character:{}, oldCraftsman:{}}}, levels:{person:{main_character:{skill_xp:{}}, oldCraftsman:{skill_xp:{}}}}});
    const context = () => fieldContext({...p,state}, 'Village', {vitals:{player:{...native}}});
    const options = {createSave:()=>bytes, key:'fixture', bindings:{player:{category:'person',id:'main_character'}, oldCraftsman:{category:'person',id:'oldCraftsman'}}};
    const commit = (plan, fail = false) => {
        persistExpansionPlan(plan, {...options, storage:{setItem(_key, value) {if(fail) throw Error('rejected write'); bytes=value;}}});
        state=plan.state; publishNativeVitals(plan.native, player);
    };
    return {p,native,context,commit, state:()=>state, bytes:()=>bytes};
}
function close(a,b) {assert.ok(Math.abs(a-b)<1e-9, `${a} != ${b}`);}
function assertCurrent(f,plan) {
    const fighter=plan.state.simulation.sessions.player?.nativeBattle?.fighters.player;
    if(fighter) close(fighter.hp,plan.vitals.player.health);
    close(f.native.health,plan.vitals.player.health);
    const save=JSON.parse(f.bytes()); close(30-save.character.hp_to_full,f.native.health);
    if(fighter) close(save.expansion.simulation.sessions.player.nativeBattle.fighters.player.hp,f.native.health);
}

test('damage publishes the open fight and native health at the durable boundary; a rejected write changes neither',()=>{
    const f=setup(); let plan=beginTempoFight(f.state(),registry,f.context(),spec()); f.commit(plan);
    for(let i=0;i<12 && f.native.health===30;i++) {
        plan=commitTempoMove(f.state(),registry,f.context(),{moveId:'guard'});
        const before={state:structuredClone(f.state()),native:{...f.native},bytes:f.bytes()};
        assert.throws(()=>f.commit(plan,true),/rejected write/);
        assert.deepEqual(f.state(),before.state); assert.deepEqual(f.native,before.native); assert.equal(f.bytes(),before.bytes);
        f.commit(plan); assertCurrent(f,plan);
    }
    assert.ok(f.native.health<30,'the opponent actually damaged the player');
});

test('tending publishes the capped healing and settlement keeps the same native health',()=>{
    const f=setup(28); let plan=beginTempoFight(f.state(),registry,f.context(),spec(28,200,1));
    // Labelled fixture: delay the foe so the cap is observable before another hit.
    plan.state.simulation.sessions.player.nativeBattle.fighters.foe1.ready=99; f.commit(plan);
    plan=commitTempoMove(f.state(),registry,f.context(),{moveId:'tend'}); f.commit(plan); assertCurrent(f,plan);
    assert.equal(f.native.health,30); assert.equal(plan.native.hpToFull,0); assert.equal(f.native.stamina,28);
    // The player's much faster fixture can finish through an actual withdrawal attempt.
    for(let i=0;i<50 && f.state().simulation.sessions.player;i++) {
        plan=commitTempoMove(f.state(),registry,f.context(),{moveId:'withdraw'}); f.commit(plan); assertCurrent(f,plan);
    }
    assert.equal(f.state().simulation.sessions.player,undefined,'the fight settled');
});

test('tempo HP text uses native rounding while the meter retains precise health',()=>{
    const view={fight:{you:{hp:58.4,maxHp:60},foes:[{id:'foe',name:'Foe',hurt:'fresh',learned:{}}],allies:[],next:[],moves:[],lines:[]}};
    const hp=tempoSituation(view).versus.you.hp;
    assert.equal(hp.text,'59/60 hp'); assert.equal(hp.current,58.4); assert.equal(hp.max,60);
});
