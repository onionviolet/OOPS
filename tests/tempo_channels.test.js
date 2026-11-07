// Lane W7-B (N3): a move that carries a channel effect writes its line to the fight log only for those who can perceive it.
import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,validateTempoBattle} from '../src/tempo_fight.js';
import {tempoOpener} from '../src/tempo_starters.js';
import '../src/book_world_lotm_fight.js';

const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const SECRET='A pale light gathers in his palm.',NEUTRAL='He pauses a breath.';
const spec=(foeChannel,player={})=>({id:'fx-chan',title:'Channels',floor:1,conditions:{},fighters:[
    {id:'player',name:'You',side:'a',speed:50,hp:30,stamina:30,profile,perception:0,stealth:0,moves:['jab','guard','withdraw'],...player},
    {id:'foe1',name:'Adept',side:'b',speed:200,hp:30,stamina:30,profile,perception:20,stealth:20,moves:['jab','guard'],channels:{jab:foeChannel}}]});
function fresh(){
    const p=joinField(createFieldFixture());p.state.simulation.seed=5;
    return {p,context:fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}})};
}
const fight=plan=>plan.state.simulation.sessions.player?.nativeBattle;
const everything=b=>[...b.log,b.last].join('|');

test('an effect in the open is always logged',()=>{
    const {p,context}=fresh();
    const b=fight(beginTempoFight(p.state,registry,context,spec({channel:'impose_condition',text:SECRET})));
    assert.match(everything(b),/pale light/);
});
test('a concealed effect shows nothing to an observer with no perceive value, in log and last, and uses no draw',()=>{
    const {p,context}=fresh();
    const b=fight(beginTempoFight(p.state,registry,context,spec({channel:'conceal',conceal:2,text:SECRET})));
    assert.doesNotMatch(everything(b),/pale light/);
    assert.equal(b.fighters.player.perceive,undefined);
    assert.doesNotMatch(JSON.stringify(b.log),/pale/);
});
test('a neutral line replaces the secret when one is given',()=>{
    const {p,context}=fresh();
    const b=fight(beginTempoFight(p.state,registry,context,spec({channel:'conceal',conceal:2,text:SECRET,neutral:NEUTRAL})));
    assert.match(everything(b),/pauses a breath/);assert.doesNotMatch(everything(b),/pale light/);
});
test('a concealed effect is seen by an observer with a large perceive edge and missed with a large deficit',()=>{
    const {p,context}=fresh();
    const hi=fight(beginTempoFight(p.state,registry,context,spec({channel:'conceal',conceal:1,text:SECRET},{perceive:12})));
    assert.match(everything(hi),/pale light/);
    const lo=fight(beginTempoFight(p.state,registry,context,spec({channel:'conceal',conceal:12,text:SECRET},{perceive:0})));
    assert.doesNotMatch(everything(lo),/pale light/);
});
test('the holder always sees their own concealed effect, and the choice is stable across save and reload',()=>{
    const {p,context}=fresh();
    const own=spec({channel:'conceal',conceal:2,text:SECRET});
    own.fighters[0].moves=['jab','guard','withdraw'];own.fighters[0].channels={guard:{channel:'conceal',conceal:9,text:'You hide a ward in your sleeve.'}};
    let plan=beginTempoFight(p.state,registry,context,own);
    plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
    assert.match(everything(fight(plan)),/ward in your sleeve/);
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);
    assert.deepEqual(fight({state:loaded}),fight(plan));
    const a=commitTempoMove(plan.state,registry,context,{moveId:'guard'}),c=commitTempoMove(loaded,registry,context,{moveId:'guard'});
    assert.deepEqual(a.state.simulation,c.state.simulation);
});
test('the contract refuses an unknown channel or a channel on a move the fighter lacks',()=>{
    const {p,context}=fresh();
    assert.throws(()=>beginTempoFight(p.state,registry,context,spec({channel:'nope',text:'x'})),/Invalid saved tempo fighter/);
    const s=spec({channel:'conceal',text:'x'});s.fighters[1].channels={swing:{channel:'conceal',text:'x'}};
    assert.throws(()=>beginTempoFight(p.state,registry,context,s),/Invalid saved tempo fighter/);
});
test('LOTM supplies the data: the armed robber conceals his pistol, the player is an ordinary noticer',()=>{
    const helpers={me:{stats:{intuition:5,agility:5}},vitals:{health:30,max_health:30,stamina:10,max_stamina:10},parts:{},enemyProfile:body=>({stats:body,attackPower:3,shield:0,shieldSkill:0})};
    const state={clock:12*60,lotm:{initializedAt:0},actors:{player:{resources:{},facts:{}}}};
    const a=tempoOpener('lotm.proof.street.armed').spec(state,{},helpers);
    assert.deepEqual([a.fighters[1].channels.shoot.channel,a.fighters[1].channels.shoot.conceal],['conceal',1]);
    assert.equal(a.fighters[0].perceive,0);
});
