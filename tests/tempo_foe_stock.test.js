// N7 (lane W7-B): a foe carries its own stock and uses shoot/reload by the same rules; only the player's stock is ever written back.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,validateTempoBattle} from '../src/tempo_fight.js';
import {validateNativeBattle} from '../src/native_battle_contracts.js';
import {tempoOpener} from '../src/tempo_starters.js';
import '../src/book_world_lotm_fight.js';
import {lotmRobberShot} from '../src/book_world_lotm_fight.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const KEYS={loaded:'fx.loaded.ordinary',carried:'fx.carried.ordinary'};
const gun=(over={})=>({kind:'ordinary',loaded:2,carried:3,capacity:6,batch:3,vs:{player:{chance:1,downIn:100}},...over});
const spec=(foe={},player={})=>({id:'fx-foe-gun',title:'Armed foe',floor:1,conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:50,hp:30,stamina:30,profile,perception:0,stealth:0,moves:['jab','guard','withdraw'],...player},
    {id:'foe1',name:'Thug',side:'b',speed:200,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','shoot','reload'],stock:gun(),...foe}]});
function fresh(){
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;Object.assign(p.state.actors.player.resources,{[KEYS.loaded]:3,[KEYS.carried]:4});
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
const fight=plan=>plan.state.simulation.sessions.player?.nativeBattle;
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);

test('a foe shoots, spends only its own rounds, reloads when empty, and is never written to any actor',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec());
    const b=fight(plan);
    assert.equal(b.fighters.foe1.stock.holder,'foe1');
    assert.ok(b.fighters.foe1.stock.loaded<2,'the quicker foe has already fired');
    assert.match(b.log.join(' '),/Thug fires/);
    assert.equal(b.fighters.player.stock,undefined);
    const seen=new Set(b.log),rounds=[b.fighters.foe1.stock.loaded+b.fighters.foe1.stock.carried];
    for(let i=0;i<4&&fight(plan);i++){
        plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
        const nb=fight(plan);if(!nb)break;
        nb.log.forEach(l=>seen.add(l));rounds.push(nb.fighters.foe1.stock.loaded+nb.fighters.foe1.stock.carried);
    }
    assert.ok(rounds.at(-1)<rounds[0],'rounds were spent from its own stock: '+rounds);
    assert.match([...seen].join(' '),/Thug loads/,'it reloads once empty');
    assert.equal(p.state.actors.player.resources[KEYS.loaded],3,'player stock untouched');
    assert.equal(plan.state.actors.player.resources[KEYS.loaded],3,'no resource write for the foe');
});
test('a foe that is out of rounds and has none carried does not shoot; it reloads only with carried rounds',()=>{
    const {p,context}=fresh();
    const plan=beginTempoFight(p.state,registry,context,spec({stock:gun({loaded:0,carried:2})}));
    assert.match(fight(plan).log.join(' '),/Thug loads 2 rounds/);
});
test('foe stock never carries write-back keys: the contract refuses them, and refuses a holder that is not the carrier',()=>{
    const {p,context}=fresh();
    assert.throws(()=>beginTempoFight(p.state,registry,context,spec({stock:gun({keys:KEYS,start:{loaded:2,carried:3}})})),/Invalid saved tempo fighter/);
    const plan=beginTempoFight(p.state,registry,context,spec());
    const b=structuredClone(fight(plan));b.fighters.foe1.stock.holder='player';
    assert.throws(()=>validateTempoBattle(b,plan.state.simulation.sessions.player),/Invalid saved tempo fighter/);
    const old=structuredClone(fight(plan));delete old.fighters.foe1.stock.holder;
    validateTempoBattle(old,plan.state.simulation.sessions.player);
});
test('a fight saved mid-way with foe stock reloads identically and continues identically',()=>{
    const {p,context}=fresh();
    let plan=beginTempoFight(p.state,registry,context,spec({stock:gun({loaded:4,vs:{player:{chance:.5,downIn:100}}})}));
    plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    const loaded=reload(plan.state);
    assert.deepEqual(loaded.simulation.sessions.player.nativeBattle,fight(plan));
    validateNativeBattle(loaded.simulation.sessions.player.nativeBattle,loaded.simulation.sessions.player,loaded);
    const a=commitTempoMove(plan.state,registry,context,{moveId:'guard'}),c=commitTempoMove(loaded,registry,context,{moveId:'guard'});
    assert.deepEqual(a.state.simulation,c.state.simulation);
});
test('LOTM armed robber opener: the foe has a pistol by dial, the plain opener is unchanged',()=>{
    const armed=tempoOpener('lotm.proof.street.armed'),plain=tempoOpener('lotm.proof.street');
    assert.ok(armed&&plain);
    const helpers={me:{stats:{intuition:5,agility:5}},vitals:{health:30,max_health:30,stamina:10,max_stamina:10},parts:{},enemyProfile:(body)=>({stats:body,attackPower:3,shield:0,shieldSkill:0})};
    const state={clock:12*60,lotm:{initializedAt:0},actors:{player:{resources:{},facts:{}}}};
    const s=plain.spec(state,{},helpers),a=armed.spec(state,{},helpers);
    assert.equal(s.fighters[1].stock,undefined);assert.equal(s.fighters[1].channels,undefined);assert.equal(s.fighters[1].moves,undefined);
    const foe=a.fighters[1];
    assert.equal(foe.stock.loaded,2);assert.equal(foe.stock.carried,0);
    assert.ok(foe.stock.vs.player.chance>0&&foe.stock.vs.player.chance<1);
    assert.deepEqual(foe.stock.vs.player,lotmRobberShot(state));
    assert.equal(a.fighters[0].perceive,0);
});
