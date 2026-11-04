import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand} from '../src/simulation.js';
import {createFieldFixture,joinField,fieldContext,fieldCommand,fieldAdvance} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,driveTempoFight} from '../src/tempo_fight.js';
import {rivalBrief,rivalCombatant,rivalMemoryEffects,appraisalMeans,hiddenMargin} from '../src/rival_memory.js';

const body={attack:5,agility:5,intuition:5};
const profile={stats:{attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:.3,crit_multiplier:1.5,stamina_efficiency:1},attackPower:8,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};

test('hidden strength is real but unread until a means appraises it',()=>{
    const fresh=rivalBrief({});
    assert.equal(fresh.appraised,false);
    assert.doesNotMatch(fresh.appraisal,/harder/);
    assert.ok(rivalCombatant(body,{}).body.attack>body.attack,'margin applies without appraisal');
    const felt=rivalBrief({'rival.duels':1,'rival.lastResult':'lost'});
    assert.equal(felt.appraised,true);
    assert.match(felt.appraisal,/30% harder/);
    assert.deepEqual(appraisalMeans({'rival.resolved':true}).map(m=>m.id),['rival-insight']);
    assert.equal(hiddenMargin(),1.3);
});
test('memory of past contests changes her goals and wits',()=>{
    const none=rivalCombatant(body,{}), beaten=rivalCombatant(body,{'rival.duels':2,'rival.wins':2,'rival.lastResult':'won'}), winner=rivalCombatant(body,{'rival.duels':1,'rival.losses':1});
    assert.ok(beaten.goals.revenge>none.goals.revenge&&beaten.goals.mercy<none.goals.mercy);
    assert.ok(winner.goals.revenge>none.goals.revenge);
    assert.equal(none.perceptionBonus,0);assert.equal(beaten.perceptionBonus,4);
    assert.match(rivalBrief({'rival.duels':1,'rival.wins':1,'rival.lastResult':'won'}).memory,/losing to you/);
    assert.deepEqual(rivalMemoryEffects({'rival.duels':1,'rival.wins':1},'lost').map(e=>[e.key,e.value]),[['rival.duels',2],['rival.losses',1]]);
});
test('a finished road contest writes her memory, and it survives save and reload',()=>{
    let p=joinField(createFieldFixture());p.state.simulation.seed=5;
    p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const ctx=fieldContext(p,'Village',{vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}});
    const requestId=p.state.simulation.pursuits['frontier.road_rival'].request.id;
    const adopt=commitSimulationCommand(p.state,registry,{id:'rival.confront',requestId},{...ctx,targetId:'roadRival'});
    const rival=adopt.state.simulation.people.roadRival;
    let plan=beginTempoFight(adopt.state,registry,ctx,{adopt,id:'rival',title:"Mara's road contest",floor:1,fighters:[
        {id:'player',name:'You',side:'a',hp:30,stamina:30,profile},
        {id:'roadRival',name:'Mara',side:'b',hp:rival.vitals.health,stamina:rival.vitals.stamina,profile,goals:rivalCombatant(body,{}).goals}]});
    plan=driveTempoFight(plan.state,registry,ctx,'aggressive');
    const facts=plan.state.actors.player.facts, result=facts['rival.lastResult'];
    assert.equal(facts['rival.duels'],1);
    assert.equal(facts[result==='won'?'rival.wins':result==='lost'?'rival.losses':'rival.withdrawn'],1);
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(plan.state)),registry);
    assert.equal(loaded.actors.player.facts['rival.duels'],1);
    const brief=rivalBrief(loaded.actors.player.facts);
    assert.equal(brief.appraised,true);assert.match(brief.memory,/Mara remembers/);
});
