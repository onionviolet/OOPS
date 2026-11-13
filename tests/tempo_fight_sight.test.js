import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext,fieldCommand} from '../scripts/field_fixtures.mjs';
import {beginTempoFight,commitTempoMove} from '../src/tempo_fight.js';
import {recordFightSight,FIGHT_SIGHT_KEY} from '../src/tempo_fight_domain.js';
import {LOOK_KEY} from '../src/observed_look.js';
import {PARTY_HELPER} from '../src/native_battle_contracts.js';
import {knownTargetFacts} from '../src/known_target_facts.js';

// The fight's opposing fighters write what they saw of the player, if they are persistent actors (Neil stands in for a cast opponent).
const stats={attack_points:45,agility:5,intuition:5,defense:1,attack_count:1,crit_rate:0,crit_multiplier:1.5,stamina_efficiency:1};
const profile={stats,attackPower:3,shield:0,shieldSkill:0,emptyStaminaMultiplier:.5};
const foe=(id,name)=>({id,name,side:'b',speed:100,hp:200,maxHp:200,stamina:30,profile,perception:20,stealth:20,goals:{revenge:0,mercy:1}});
const spec=ids=>({id:'sight',title:'Alley scuffle',fighters:[{id:'player',name:'You',side:'a',speed:100,hp:200,maxHp:200,stamina:30,profile,perception:20,stealth:20},...ids.map(([id,n])=>foe(id,n))]});
const open=plan=>plan.state.simulation.sessions.player?.nativeBattle;
// Play one fight to its end by yielding to a merciful foe; returns {plan, before} as the host would hold them.
function played(ids){
    for(let seed=1;seed<60;seed++){
        const p=fieldCommand(joinField(createFieldFixture()),'party.meet');p.state.simulation.seed=seed;
        const context=fieldContext(p,'Village',{vitals:{player:{health:200,max_health:200,stamina:30,max_stamina:30}}});
        const begun=beginTempoFight(p.state,registry,context,spec(ids));
        if(!open(begun))continue;
        const before={sessionId:begun.state.simulation.sessions.player.id,battle:structuredClone(open(begun))};
        const plan=commitTempoMove(begun.state,registry,context,{moveId:'yield'});
        if(!open(plan)&&plan.state.actors.player.facts['tempo.lastResult']==='yielded')return {plan,before};
    }
    throw Error('no fight ended');
}
const reload=state=>loadExpansionState(JSON.parse(JSON.stringify(state)),registry);

test('a persistent opponent records one fact about the fight and it survives a save round trip',()=>{
    const {plan,before}=played([[PARTY_HELPER,'Neil']]);
    assert.deepEqual(recordFightSight(plan,registry,before),[PARTY_HELPER]);
    const facts=knownTargetFacts(plan.state,PARTY_HELPER,'player');
    assert.deepEqual(Object.keys(facts).sort(),[FIGHT_SIGHT_KEY,LOOK_KEY]); // the sight, and what he saw you wear
    assert.equal(facts[LOOK_KEY].value,'plain clothes');
    assert.equal(facts[FIGHT_SIGHT_KEY].value,'fought you, and you gave way');
    assert.equal(facts[FIGHT_SIGHT_KEY].at,plan.state.clock);
    const loaded=reload(plan.state);
    assert.equal(knownTargetFacts(loaded,PARTY_HELPER,'player')[FIGHT_SIGHT_KEY].value,'fought you, and you gave way');
});
test('a fighter who is not a persistent actor writes nothing and the save still loads',()=>{
    const {plan,before}=played([['nobody.thug','A thug']]);
    assert.deepEqual(recordFightSight(plan,registry,before),[]);
    assert.equal(plan.state.simulation.knowledge['nobody.thug'],undefined);
    reload(plan.state);
});
test('applying the same result twice writes nothing new; a fight still open writes nothing',()=>{
    const {plan,before}=played([[PARTY_HELPER,'Neil'],['nobody.thug','A thug']]);
    assert.deepEqual(recordFightSight(plan,registry,before),[PARTY_HELPER]);
    const once=JSON.stringify(plan.state.simulation.knowledge);
    plan.state.clock+=5;
    assert.deepEqual(recordFightSight(plan,registry,before),[]);
    assert.equal(JSON.stringify(plan.state.simulation.knowledge),once);
    const p=fieldCommand(joinField(createFieldFixture()),'party.meet'),context=fieldContext(p,'Village',{vitals:{player:{health:200,max_health:200,stamina:30,max_stamina:30}}});
    const live=beginTempoFight(p.state,registry,context,spec([[PARTY_HELPER,'Neil']]));
    assert.deepEqual(recordFightSight(live,registry,{sessionId:live.state.simulation.sessions.player.id,battle:open(live)}),[]);
});
