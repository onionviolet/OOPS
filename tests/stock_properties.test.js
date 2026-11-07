// W10-C / FD3+ (AD51): stock kinds carry properties as data; the fight applies them by a dial; the kind picked is the kind spent.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,tempoView,validateTempoBattle} from '../src/tempo_fight.js';
import {STOCK_KINDS,STOCK_PROPERTY_DIALS,stockEdge,stockKindLabel} from '../src/stock_kinds.js';
import {tempoOpener} from '../src/tempo_starters.js';
import {lotmFightQuote} from '../src/book_world_lotm_fight.js';
import {beFirearmKeys,BE_REVOLVER_FACT} from '../src/book_world_lotm_be_firearm.js';
import {LOTM_IDS as I} from '../src/book_world_lotm_ids.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const stockOf=(kind,keys,over={})=>({kind,loaded:6,carried:0,capacity:6,batch:3,keys,start:{loaded:6,carried:0},vs:{foe1:{chance:1,downIn:4}},...over});
const spec=(kind,tags,keys)=>({id:'fx-props',title:'Properties',floor:1,conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:100,hp:300,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard','withdraw','shoot','reload'],stock:stockOf(kind,keys)},
    {id:'foe1',name:'Thing',side:'b',speed:60,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard'],...(tags?{tags}:{})}]});
const fight=plan=>plan.state.simulation.sessions.player?.nativeBattle;
function fresh(res){
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;Object.assign(p.state.actors.player.resources,res);
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
// Shoots until the fight ends; returns the number of shots the player fired and the final plan.
function shootOut(plan,context){
    let shots=0;
    for(let i=0;i<40&&fight(plan);i++){
        if(!tempoView(fight(plan)).yourTurn)throw Error('not my turn');
        plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});shots++;
    }
    assert.equal(fight(plan),undefined,'the fight ended');return {shots,plan};
}
const KEYS={loaded:'fx.loaded.silver',carried:'fx.carried.silver'};

test('kinds are data: ordinary has no property, silver is against the unnatural, unknown kinds change nothing',()=>{
    assert.deepEqual(STOCK_KINDS.ordinary.properties,[]);
    const base={chance:.6,downIn:4};
    assert.deepEqual(stockEdge('ordinary',['unnatural'],base),{...base,notes:[]});
    assert.deepEqual(stockEdge('silver',['person','living'],base),{...base,notes:[]},'silver does nothing special to a person');
    assert.deepEqual(stockEdge('silver',undefined,base),{...base,notes:[]});
    assert.deepEqual(stockEdge('mystery',['unnatural'],base),{...base,notes:[]});
    const e=stockEdge('silver',['unnatural'],base);
    assert.equal(e.downIn,4*STOCK_PROPERTY_DIALS.silverVsUnnatural.value);assert.equal(e.chance,.6);assert.deepEqual(e.notes,['the silver bites']);
    assert.equal(stockEdge('silver',['unnatural'],{chance:.5,downIn:1}).downIn,1,'never below one hit');
    assert.equal(stockKindLabel('silver'),'silver round');assert.equal(stockKindLabel('odd'),'odd');
});
test('silver downs an unnatural foe in fewer shots than ordinary by the dial; ordinary and silver are equal against a person',()=>{
    const {p,context}=fresh({[KEYS.loaded]:6});
    const run=(kind,tags)=>shootOut(beginTempoFight(p.state,registry,context,spec(kind,tags,KEYS)),context).shots;
    const half=STOCK_PROPERTY_DIALS.silverVsUnnatural.value;
    assert.equal(run('ordinary',['unnatural']),4);
    assert.equal(run('silver',['unnatural']),Math.ceil(4*half));
    assert.equal(run('silver',['living','person']),4,'ordinary people are unchanged by silver');
    assert.equal(run('ordinary',undefined),4);
});
test('the log names the property only when it applied, and the view names the kind loaded',()=>{
    const {p,context}=fresh({[KEYS.loaded]:6});
    let plan=beginTempoFight(p.state,registry,context,spec('silver',['unnatural'],KEYS));
    const shoot=tempoView(fight(plan)).moves.find(m=>m.id==='shoot');
    assert.match(shoot.text,/6 of 6 loaded, 0 carried \(silver round\)\./);
    assert.equal(tempoView(fight(plan)).you.stock.kind,'silver');
    plan=commitTempoMove(plan.state,registry,context,{moveId:'shoot'});
    assert.match(fight(plan).log.join(' '),/hit Thing\. ?\(the silver bites\)|hit Thing\.\s*\(the silver bites\)/);
    const q=fresh({[KEYS.loaded]:6}),plain=beginTempoFight(q.p.state,registry,q.context,spec('silver',undefined,KEYS));
    assert.doesNotMatch(commitTempoMove(plain.state,registry,q.context,{moveId:'shoot'}).state.simulation.sessions.player.nativeBattle.log.join(' '),/silver bites/);
});
test('tags are validated and survive save shape',()=>{
    const {p,context}=fresh({[KEYS.loaded]:6});
    const plan=beginTempoFight(p.state,registry,context,spec('silver',['unnatural'],KEYS));
    assert.deepEqual(fight(plan).fighters.foe1.tags,['unnatural']);assert.equal(fight(plan).fighters.player.tags,undefined);
    const b=structuredClone(fight(plan));b.fighters.foe1.tags=[7];
    assert.throws(()=>validateTempoBattle(b,plan.state.simulation.sessions.player,plan.state));
});
test('LOTM: the kind the player picked is the kind spent and written back; the other kind is untouched',()=>{
    const opener=tempoOpener('lotm.proof.street');assert.ok(opener);
    const sil=beFirearmKeys.loaded('silver'),ord=beFirearmKeys.loaded('ordinary'),sc=beFirearmKeys.carried('silver');
    const {p,context}=fresh({[sil]:3,[ord]:5,[sc]:1});
    const world0=p.state.actors.player.worldId;p.state.actors.player.worldId=I.world;p.state.lotm={initializedAt:0};p.state.actors.player.facts[BE_REVOLVER_FACT]=true;
    const helpers={me:profile,vitals:{health:30,max_health:30,stamina:30,max_stamina:30},parts:{},enemyProfile:body=>({stats:body,attackPower:3,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5})};
    // Default: the kind with more rounds loaded is ordinary.
    assert.equal(opener.spec(p.state,context,helpers).fighters[0].stock.kind,'ordinary');
    assert.match(lotmFightQuote(p.state).reason,/^5 ordinary rounds loaded/);
    p.state.actors.player.facts['lotm.beFirearm.pickKind']='silver';
    assert.match(lotmFightQuote(p.state).reason,/^3 silver rounds loaded, 1 carried/);
    const s=opener.spec(p.state,context,helpers);
    assert.equal(s.fighters[0].stock.kind,'silver');assert.deepEqual(s.fighters[0].stock.keys,{loaded:sil,carried:sc});
    // A pick of an empty kind falls back instead of loading nothing.
    p.state.actors.player.facts['lotm.beFirearm.pickKind']='silver';p.state.actors.player.resources[sil]=0;
    assert.equal(opener.spec(p.state,context,helpers).fighters[0].stock.kind,'ordinary');
    p.state.actors.player.resources[sil]=3;
    // Test fixture only: the proof robber is made unnatural so the silver edge shows; LOTM content itself sets no such flag.
    s.fighters[1].tags=['unnatural'];s.fighters[1].hp=s.fighters[1].maxHp=40;
    // The fake LOTM slice only feeds the opener. The field state rejects Tingen resource keys, so the fight runs on the same counts under fixture keys.
    delete p.state.lotm;p.state.actors.player.worldId=world0;
    const fx={loaded:'fx.loaded.silver',carried:'fx.carried.silver'},fo='fx.loaded.ordinary';
    for(const k of [sil,ord,sc])delete p.state.actors.player.resources[k];
    delete p.state.actors.player.facts[BE_REVOLVER_FACT];delete p.state.actors.player.facts['lotm.beFirearm.pickKind'];
    Object.assign(p.state.actors.player.resources,{[fx.loaded]:3,[fx.carried]:1,[fo]:5});
    s.fighters[0].stock.keys=fx;
    const plan=beginTempoFight(p.state,registry,context,s);
    const {shots,plan:done}=shootOut(plan,context);
    const r=done.state.actors.player.resources;
    // A stumble can waste a move without spending a round, so spent rounds are read from the counts, not from the attempts.
    const spent=3+1-(r[fx.loaded]+r[fx.carried]);
    assert.ok(spent>=1&&spent<=shots,'silver rounds were spent and written back');
    assert.equal(r[fx.carried],1,'carried silver untouched');
    assert.equal(r[fo],5,'ordinary rounds untouched');
});
