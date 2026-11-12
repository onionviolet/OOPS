import test from 'node:test';
import assert from 'node:assert/strict';
import {spellDictionary} from '../src/spell_dictionary.js';
import {compileSpellWorking,nativeSpellSteps} from '../src/spell_working.js';
import {hogwartsSpellRules,cyoriaSpellRules} from '../src/spell_world_rules.js';
import {hpLeadBenchCommands} from '../src/hp_lead_spells.js';
import {molLightCommands} from '../src/mol_light_research.js';
import {commitSpellbookWorking,readSpellbookWorkings,settleSpellbookReceipt} from '../src/spellbook_workings.js';

const targets = new Map([
    ['board', {id:'board', type:'object'}],
    ['weight', {id:'weight', type:'object'}],
    ['rail', {id:'rail', type:'place'}],
]);
const rules = (world, operations) => ({
    world, target: id => targets.get(id), operations: Object.fromEntries(operations.map(id=>[id, {}])),
});

test('world rules bind player ordering to existing native command definitions', () => {
    const hp = [
        step('hp.levitation',{target:'board'}),
        step('hp.summoning',{target:'weight',destination:'rail'}),
        step('hp.release',{target:'board'}),
    ];
    const mol = [
        step('mol.torch',{area:'slate'}),
        step('mol.direct_light',{area:'slate'}),
        step('mol.oblique',{area:'slate'}),
        step('mol.oblique',{area:'slate'}),
    ];
    for(const [draft,world,definitions,expected] of [
        [hp,hogwartsSpellRules,hpLeadBenchCommands,['lift_board','summon_weight','release_board']],
        [mol,cyoriaSpellRules,molLightCommands,['torch','shaped','oblique','oblique']],
    ]){
        const native = nativeSpellSteps(compileSpellWorking(draft,spellDictionary,world),world);
        assert.deepEqual(native.map(({command})=>command.id.split('.').at(-1)),expected);
        assert.ok(native.every(({command})=>definitions.some(definition=>definition.id===command.id)));
    }
    const unreachable = compileSpellWorking([step('hp.levitation',{target:'weight'})],spellDictionary,hogwartsSpellRules);
    assert.throws(()=>nativeSpellSteps(unreachable,hogwartsSpellRules),/cannot reach/);
});
const step = (method, bindings) => ({method, revision:1, bindings});

test('a working binds ordered dictionary methods without a row for the combination', () => {
    const hp = rules('hogwarts', ['lift', 'support', 'move']);
    const draft = [step('hp.levitation', {target:'board'}), step('hp.summoning', {target:'weight', destination:'rail'})];
    const plan = compileSpellWorking(draft, spellDictionary, hp);
    assert.deepEqual(plan.map(x=>x.operation), ['lift','support','move']);
    assert.deepEqual(plan.at(-1).bindings, {target:'weight', destination:'rail'});
    assert.deepEqual(plan.at(-1).expression.map(part=>part.text??part.target), ['Accio','weight']);
    assert.equal(plan.at(-1).expression[1].optional,true);
    assert.deepEqual(plan[0].expression.map(part=>part.role), ['incantation','incantation','gesture']);
    for(const part of plan[0].expression.slice(0,2)){
        assert.equal(part.analysis.morphology.map(segment=>segment.text).join(''),part.text);
        assert.ok(part.analysis.morphology.every(segment=>segment.evidence.kind==='inference'));
        assert.equal(part.analysis.speech.kind,'observed');
    }
    assert.throws(()=>compileSpellWorking([step('hp.levitation', {target:'rail'})],spellDictionary,hp), /expects target/);
    assert.throws(()=>compileSpellWorking(draft,spellDictionary,rules('hogwarts',['lift','support'])), /unavailable operation: move/);
});

test('structured and direct light share an operation while preserving distinct local methods', () => {
    const mol = rules('cyoria', ['illuminate']);
    const plan = compileSpellWorking([
        step('mol.torch', {area:'rail'}), step('mol.direct_light', {area:'rail'}),
    ],spellDictionary,mol);
    assert.deepEqual(plan.map(x=>x.operation), ['illuminate','illuminate']);
    assert.deepEqual(plan.map(x=>x.method), ['mol.torch','mol.direct_light']);
    assert.throws(()=>compileSpellWorking([step('hp.levitation',{target:'board'})],spellDictionary,mol),/does not have/);
});

test('a saved working advances after its own timed cast and recalls its tested revision', () => {
    const rules={...cyoriaSpellRules,worked:(state,id,cause)=>state.observed===cause};
    let state={clock:4,sequence:0,actors:{player:{facts:{},completed:{}}},simulation:{jobs:[]}};
    const id='book.mol.zorian.light.shaped';
    const edit=()=>({state:structuredClone(state)});
    const cast=command=>{
        assert.equal(command.id,id);
        const plan=edit();
        plan.state.sequence++;
        plan.commitment={id:'simulation:'+plan.state.sequence};
        plan.state.simulation.jobs.push(plan.commitment);
        return plan;
    };
    const commit=(action,request={})=>{state=commitSpellbookWorking(state,rules,{action,...request},{edit,cast}).state;};
    const append=()=>commit('append',{step:step('mol.direct_light',{area:'slate'})});
    append();append();
    commit('test');
    assert.equal(readSpellbookWorkings(state,rules).status,'pending');
    assert.throws(()=>commit('remove',{index:0}),/Wait/);
    state=JSON.parse(JSON.stringify(state));
    state.simulation.jobs=[];
    state.actors.player.completed[id]=1;
    state.observed='simulation:1';
    assert.equal(readSpellbookWorkings(state,rules).status,'ready');
    commit('continue');
    state.simulation.jobs=[];
    state.actors.player.completed[id]=2;
    assert.equal(readSpellbookWorkings(state,rules).status,'failed');
    assert.throws(()=>commit('record'),/successful/);
    state.observed='simulation:2';
    commit('record');
    commit('remove',{index:0});
    state=JSON.parse(JSON.stringify(state));
    commit('recall',{index:0});
    assert.equal(readSpellbookWorkings(state,rules).draft.length,2);

    const key='spellbook.cyoria.workings';
    state.actors.player.facts[key]='{';
    settleSpellbookReceipt(state,rules);
    assert.equal(state.actors.player.facts[key],'{');
    assert.match(readSpellbookWorkings(state,rules).error,/could not be read/);
    assert.throws(()=>commit('append',{step:step('mol.torch',{area:'slate'})}),/could not be read/);
});
