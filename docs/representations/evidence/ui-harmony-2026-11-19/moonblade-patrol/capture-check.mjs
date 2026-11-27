// Bounded engine reproduction, not an earned inventory or browser route.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import '../../../../../src/native_battle.js';
import {expeditionRegistry as registry} from '../../../../../src/expedition_content.js';
import {createFieldFixture,joinField,fieldContext} from '../../../../../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove,tempoView,TEMPO_MOVES,offered} from '../../../../../src/tempo_fight.js';
import {termsFor,canTakeAlive} from '../../../../../src/fight_terms.js';
const p=joinField(createFieldFixture());p.state.simulation.seed=7;
const context=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
const profile={stats:{attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:0,crit_multiplier:1.5,stamina_efficiency:1},attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const me={id:'player',name:'You',side:'a',speed:100,hp:30,stamina:30,profile,perception:6,stealth:6,means:{rope:1},moves:['jab','guard','yield','withdraw']};
const chosen=termsFor({'fight.terms.person':'take_alive'},{preset:'mugging'},'person',{player:me});assert.equal(chosen.terms,'take_alive');assert.ok(canTakeAlive(me));
let plan=beginTempoFight(p.state,registry,context,{id:'capture-check',title:'Capture diagnostic',floor:1,stakes:{preset:'mugging',lethal:true},terms:{person:chosen.terms},fighters:[me,{id:'foe',name:'Yielding person',side:'b',speed:100,hp:3,maxHp:30,stamina:30,profile,perception:6,stealth:6,tags:['person'],goals:{survive:1,aim:0},moves:['yield','jab']}]});
for(let i=0;i<3&&!plan.state.simulation.sessions.player.nativeBattle.fighters.foe.yielding;i++)plan=commitTempoMove(plan.state,registry,context,{moveId:'guard'});
const b=plan.state.simulation.sessions.player.nativeBattle,v=tempoView(b);assert.equal(b.fighters.foe.yielding,true);
const report={setup:'Engine fixture; one rope in player means; chosen person terms Take alive; human foe at 3/30 health with survive=1 and yield move',chosen,canTakeAlive:canTakeAlive(b.fighters.player),yielded:b.fighters.foe.yielding,fate:v.fateMoves,offered:offered(b,'player'),rules:{take_alive:!!TEMPO_MOVES.take_alive,bind:!!TEMPO_MOVES.bind}};
try{commitTempoMove(plan.state,registry,context,{moveId:'take_alive',targetId:'foe'});report.bindAttempt='unexpected success';}catch(e){report.bindAttempt=e.message;}
const accepted=commitTempoMove(plan.state,registry,context,{moveId:'spare',targetId:'foe'});report.acceptSettlement={result:accepted.state.actors.player.facts['tempo.lastResult'],lines:accepted.state.simulation.log.slice(-8)};
assert.ok(!v.fateMoves.some(m=>m.id==='take_alive'||m.id==='bind'));
await writeFile(new URL('./capture-report.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
