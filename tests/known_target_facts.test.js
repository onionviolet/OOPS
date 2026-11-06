import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {createFieldFixture,joinField,fieldContext} from '../scripts/field_fixtures.mjs';
import {simulationFacts,applySimulationEffects,cloneData} from '../src/simulation_effects.js';
import {meets} from '../src/simulation_contracts.js';
import {knownTargetFacts,knownTargetFactValues,requiresObservation} from '../src/known_target_facts.js';
import {rivalBrief,rivalCombatant,RIVAL_OBSERVATION_KEY} from '../src/rival_memory.js';

const T='oldCraftsman', KEY=`person.${T}.fever`, RULE={fact:KEY,op:'eq',value:'feverish'};
function fixture() {
    const p=joinField(createFieldFixture()), state=p.state;
    state.simulation.conditions[T]={...(state.simulation.conditions[T]||{}),'hidden.fever':{intensity:2,expiresAt:null}};
    return {p,state,ctx:{...fieldContext(p),targetId:T}};
}
const observe=(state,ctx,key,value)=>{
    const plan={state:cloneData(state),external:{},gameplay:ctx.gameplay,vitals:{},equipment:{},acquisitions:[],unlocks:[],gameplayBefore:ctx.gameplay};
    applySimulationEffects(plan,[{type:'knowledge',key,stage:'seen',value}],ctx,registry,'test.sight');
    return plan.state;
};

test('a hidden condition on another actor cannot satisfy a person.<id> rule until an observation is recorded',()=>{
    const {state,ctx}=fixture();
    assert.ok(requiresObservation(KEY)&&!requiresObservation('target.condition.hidden.fever'));
    const before=simulationFacts(state,ctx,registry);
    assert.equal(before['target.condition.hidden.fever'],2,'raw truth is still there for rules that already read it');
    assert.equal(meets(RULE,before),false);
    assert.deepEqual(knownTargetFacts(state.simulation,'player',T),{});
    const after=observe(state,ctx,KEY,'feverish');
    assert.equal(meets(RULE,simulationFacts(after,ctx,registry)),true);
    const known=knownTargetFacts(after,'player',T)[KEY];
    assert.equal(known.value,'feverish');assert.equal(known.cause,'test.sight');assert.equal(known.stage,'seen');
    assert.deepEqual(knownTargetFactValues(after.simulation,'player',T),{[KEY]:'feverish'});
    assert.deepEqual(knownTargetFacts(after,'player','someoneElse'),{},'an observation of one person says nothing about another');
});
test('raw-state fact keys and values are unchanged for existing callers',()=>{
    const {state,ctx}=fixture(), facts=simulationFacts(state,ctx,registry);
    const raw=Object.keys(facts).filter(k=>k.startsWith('target.')||k.startsWith('person.'));
    assert.ok(raw.includes('target.life')&&raw.includes('target.location'));
    assert.equal(KEY in facts,false,'the fever key is absent without a recorded observation');
    const withSight=simulationFacts(observe(state,ctx,KEY,'feverish'),ctx,registry);
    for(const k of Object.keys(facts))if(k!==KEY)assert.deepEqual(withSight[k],facts[k],k);
    assert.deepEqual(Object.keys(withSight).filter(k=>!(k in facts)).sort(),[KEY,`knowledge.${KEY}.seen`,`knowledge.${KEY}.understood`,`knowledge.${KEY}.value`].sort());
});
test('reading known facts writes no save key and leaves the state byte-identical',()=>{
    const {state,ctx}=fixture(), snapshot=JSON.stringify(state);
    knownTargetFacts(state,'player',T);simulationFacts(state,ctx,registry);
    assert.equal(JSON.stringify(state),snapshot);
});
test("Mara's hidden margin applies in the fight whether or not it was observed; only the telling is gated",()=>{
    const body={attack:5,agility:5,intuition:5}, unseen=knownTargetFacts({knowledge:{player:{}}},'player','roadRival');
    const seen=knownTargetFacts({knowledge:{player:{[RIVAL_OBSERVATION_KEY]:{stage:'seen',value:1.3,at:1,cause:'sight'}}}},'player','roadRival');
    assert.equal(rivalBrief({},unseen).appraised,false);
    assert.doesNotMatch(rivalBrief({},unseen).appraisal,/harder/);
    const told=rivalBrief({},seen);
    assert.equal(told.appraised,true);assert.match(told.appraisal,/30% harder/);
    assert.equal(rivalCombatant(body,{}).body.attack,Math.ceil(5*1.3),'truth is the same either way');
    assert.deepEqual(rivalBrief({'rival.duels':1}),rivalBrief({'rival.duels':1},{}),'callers without observations read as before');
});
