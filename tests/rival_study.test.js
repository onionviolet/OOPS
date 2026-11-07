import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/native_battle.js';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {loadExpansionState} from '../src/expansion_engine.js';
import {createFieldFixture,joinField,fieldContext,fieldAdvance,fieldCommand} from '../scripts/field_fixtures.mjs';
import {configureTempoFight} from '../src/tempo_fight_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {rivalBrief,rivalCombatant,RIVAL_DIALS,RIVAL_OBSERVATION_KEY,rivalStudyQuote} from '../src/rival_memory.js';
import {knownTargetFacts} from '../src/known_target_facts.js';

// A field life where Mara has arrived (rival.begin), wired to the tempo host with plan/commit ports like main.js.
function host(){
    let p=joinField(createFieldFixture());p.state.simulation.seed=5;
    p=fieldAdvance(fieldCommand(p,'rival.begin'),3);
    const h={p,commits:0};
    configureTempoFight({root:()=>h.p.state,campaignContext:()=>fieldContext(h.p),writable:()=>true,registry,
        plan:m=>m?fieldAdvance(h.p,m):structuredClone(h.p),commit:plan=>{h.p=plan;h.commits++;}});
    return h;
}
const brief=h=>domainRegistry.project('tempo_fight').rival;
const study=()=>domainRegistry.command('tempo_fight','study')();
const body={attack:5,agility:5,intuition:5};

test('studying records the observation and the brief changes from unread to appraised',()=>{
    const h=host();
    assert.equal(brief(h).appraised,false);
    study();
    const known=knownTargetFacts(h.p.state,'player','roadRival')[RIVAL_OBSERVATION_KEY];
    assert.ok(known&&known.stage==='seen'&&/^rival\.study:/.test(known.cause)&&known.at===h.p.state.clock);
    assert.equal(brief(h).appraised,true);
    assert.deepEqual(brief(h).means,['observed-her-strength']);
    assert.match(brief(h).appraisal,/taken her measure/);
    assert.match(brief(h).appraisal,/30% harder/);
});
test('the hidden margin is identical before and after studying (only the telling changes)',()=>{
    const h=host(),before=rivalCombatant(body,h.p.state.actors.player.facts);
    study();
    assert.deepEqual(rivalCombatant(body,h.p.state.actors.player.facts),before);
    assert.ok(before.body.attack>body.attack);
});
test('studying is refused when she is not present, and costs nothing',()=>{
    const h=host(),clock=h.p.state.clock;
    h.p.state.simulation.people.roadRival.location='Shack';
    assert.throws(()=>study(),/not here/);
    h.p.state.simulation.people.roadRival.location='Village';h.p.state.simulation.people.roadRival.life='dead';
    assert.throws(()=>study(),/not here/);
    assert.equal(h.p.state.clock,clock);assert.equal(h.commits,0);
    assert.equal(rivalStudyQuote({simulation:{people:{},knowledge:{},sessions:{}}},'Village').eligible,false);
});
test('study minutes advance the clock exactly once, and studying twice does not stack',()=>{
    const h=host(),clock=h.p.state.clock;
    study();
    assert.equal(h.p.state.clock-clock,RIVAL_DIALS.studyMinutes.value);
    const after=h.p.state.clock,record=structuredClone(h.p.state.simulation.knowledge.player[RIVAL_OBSERVATION_KEY]);
    assert.throws(()=>study(),/already taken her measure/);
    assert.equal(h.p.state.clock,after);assert.equal(h.commits,1);
    assert.deepEqual(h.p.state.simulation.knowledge.player[RIVAL_OBSERVATION_KEY],record);
});
test('an untouched life writes no observation key, and the observation survives save and reload',()=>{
    const h=host();
    assert.equal(h.p.state.simulation.knowledge.player?.[RIVAL_OBSERVATION_KEY],undefined);
    study();
    const reloaded=loadExpansionState(JSON.parse(JSON.stringify(h.p.state)),registry);
    assert.deepEqual(knownTargetFacts(reloaded,'player','roadRival'),knownTargetFacts(h.p.state,'player','roadRival'));
    assert.equal(rivalBrief(reloaded.actors.player.facts,knownTargetFacts(reloaded,'player','roadRival')).appraised,true);
});
