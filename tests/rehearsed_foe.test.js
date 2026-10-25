import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {initializeNativeBattle,commitNativeBattleStrike,withdrawNativeBattle} from '../src/native_battle.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {prepareRivalRematch,RIVAL_PURSUIT,ROAD_RIVAL} from '../src/frontier_campaign.js';
import {RF1_POWER,rehearsedFoeObservation,validateRehearsedRecord} from '../src/rehearsed_foe.js';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,fieldContext,fieldReload,kit} from '../scripts/field_fixtures.mjs';
const fighter={attackPower:5,stats:{attack_points:10000,attack_count:1,crit_rate:0,crit_multiplier:1,stamina_efficiency:1},shield:0,shieldSkill:0};
const target={stats:{agility:5,intuition:5,defense:1,crit_rate:0},shield:0,shieldSkill:0};
const context=p=>fieldContext(p,'Village');
const accept=p=>initializeNativeBattle(commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId:p.state.simulation.pursuits[RIVAL_PURSUIT].request.id},{...context(p),targetId:ROAD_RIVAL}));
const begin=()=>accept(fieldAdvance(fieldCommand(joinField(createFieldFixture()),'rival.begin'),3));
const hit=(p,attacker=fighter)=>commitNativeBattleStrike(p.state,registry,{actorId:'player',targetId:ROAD_RIVAL,attacker,target},context(p));
function rematch(p){
 p=withdrawNativeBattle(p.state,registry,context(p));p.gameplay.player.inventory[kit]=1;
 p=fieldAdvance(fieldCommand(p,'rival.recover','Village',{targetId:ROAD_RIVAL}),3);
 return accept(fieldAdvance(prepareRivalRematch(p.state,registry,context(p)),3));
}
test('RF1 learns an actual first opening, spends real stamina on a matching paid rematch, and reveals only its observed tell',()=>{
 const first=begin();assert.equal(rehearsedFoeObservation(first.state),'');
 const learned=hit(first);assert.equal(learned.state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,0);
 assert.equal(rehearsedFoeObservation(learned.state),'');
 const next=rematch(learned),stamina=next.state.simulation.people[ROAD_RIVAL].vitals.stamina,before=structuredClone(next);
 const predicted=hit(next);assert.equal(predicted.state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,1);
 assert.equal(predicted.state.simulation.people[ROAD_RIVAL].vitals.stamina,stamina-2);assert.match(rehearsedFoeObservation(predicted.state),/familiar opening/);
 assert.deepEqual(next,before,'planning leaves the original power and body unchanged');
 const changed=hit(next,{...fighter,attackPower:6});assert.equal(changed.state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,0);
 assert.equal(changed.state.simulation.people[ROAD_RIVAL].vitals.stamina,stamina);
});
test('RF1 reload preserves holder memory and seeded outcome; same-session follow-up cannot repay/replay the opening reaction',()=>{
 const second=rematch(hit(begin())),loaded=fieldReload(second),a=hit(second),b=hit(loaded);
 assert.deepEqual(a,b);assert.equal(a.state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,1);
 const again=hit(a);assert.equal(again.state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,1);
 assert.throws(()=>commitNativeBattleStrike(a.state,registry,{actorId:'player',targetId:ROAD_RIVAL,attacker:fighter,target},context(a),second.state.sequence),/stale/);
});
test('RF1 needs its holder and fuel; malformed holder records refuse before restore',()=>{
 const second=rematch(hit(begin()));second.state.simulation.people[ROAD_RIVAL].vitals.stamina=1;
 assert.equal(hit(second).state.simulation.powers[ROAD_RIVAL][RF1_POWER].executions,0);
 const record=structuredClone(second.state.simulation.powers[ROAD_RIVAL][RF1_POWER]);record.card.state.holderId='someone-else';
 assert.throws(()=>validateRehearsedRecord(record,ROAD_RIVAL),/RF1/);
 const hidden=structuredClone(second.state);delete hidden.simulation.knowledge.player['cheat.rf1.tell'];
 assert.equal(rehearsedFoeObservation(hidden),'');
});
