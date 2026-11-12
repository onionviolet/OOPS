import test from 'node:test';
import assert from 'node:assert/strict';
import {spellDictionary} from '../src/spell_dictionary.js';
import {spellDraftMethod,spellDraftCommands,spellWorkingLaw} from '../src/spell_working.js';
import {beginWorking,settleWorking,restoreWorking,serializeWorking,quoteWorking} from '../src/kernel_working.js';
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
        const native = spellDraftCommands(draft,spellDictionary,world);
        assert.deepEqual(native.map(({command})=>command.id.split('.').at(-1)),expected);
        assert.ok(native.every(({command})=>definitions.some(definition=>definition.id===command.id)));
    }
    assert.throws(()=>spellDraftCommands([step('hp.levitation',{target:'weight'})],spellDictionary,hogwartsSpellRules),/cannot reach/);
});
const step = (method, bindings) => ({method, revision:1, bindings});

test('a working binds ordered dictionary methods without a row for the combination', () => {
    const hp = rules('hogwarts', ['lift', 'support', 'move']);
    const draft = [step('hp.levitation', {target:'board'}), step('hp.summoning', {target:'weight', destination:'rail'})];
    const {method, bindings, expressions} = spellDraftMethod(draft, spellDictionary, hp);
    assert.deepEqual(method.steps.map(x=>x.op), ['lift','support','move']);
    assert.deepEqual(method.steps.at(-1).bindings, {target:'s1.target', destination:'s1.destination'});
    assert.deepEqual(bindings['s1.destination'], {kind:'place', id:'rail'});
    assert.deepEqual(expressions.at(-1).map(part=>part.text??part.target), ['Accio','weight']);
    assert.equal(expressions.at(-1)[1].optional,true);
    assert.deepEqual(expressions[0].map(part=>part.role), ['incantation','incantation','gesture']);
    for(const part of expressions[0].slice(0,2)){
        assert.equal(part.analysis.morphology.map(segment=>segment.text).join(''),part.text);
        assert.ok(part.analysis.morphology.every(segment=>segment.evidence.kind==='inference'));
        assert.equal(part.analysis.speech.kind,'observed');
    }
    assert.throws(()=>spellDraftMethod([step('hp.levitation', {target:'rail'})],spellDictionary,hp), /expects target/);
    assert.throws(()=>spellDraftMethod(draft,spellDictionary,rules('hogwarts',['lift','support'])), /unavailable operation: move/);
});

test('structured and direct light share an operation while preserving distinct local methods', () => {
    const mol = rules('cyoria', ['illuminate']);
    const {method} = spellDraftMethod([
        step('mol.torch', {area:'rail'}), step('mol.direct_light', {area:'rail'}),
    ],spellDictionary,mol);
    assert.deepEqual(method.steps.map(x=>x.op), ['illuminate','illuminate']);
    assert.deepEqual(method.steps.map(x=>x.options.method), ['mol.torch','mol.direct_light']);
    assert.throws(()=>spellDraftMethod([step('hp.levitation',{target:'board'})],spellDictionary,mol),/does not have/);
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

test('a spellbook draft runs as a kernel working: same commands in one jump or step by step, and survives a save', () => {
    const draft=[step('hp.levitation',{target:'board'}),step('hp.summoning',{target:'weight',destination:'rail'}),step('hp.release',{target:'board'})];
    const {law,method,bindings}=spellDraftMethod(draft,spellDictionary,hogwartsSpellRules);
    assert.equal(law.ref,spellWorkingLaw(hogwartsSpellRules,spellDictionary).ref);
    const minutes={...method,steps:method.steps.map((s,i)=>({...s,minutes:i+1}))};
    const begun=beginWorking(law,minutes,{id:'trial',bindings,at:10});
    const jump=settleWorking(law,begun,{now:100});
    let stepwise=begun,effects=[];
    for(let t=10;t<=100;t++){const out=settleWorking(law,restoreWorking(law,serializeWorking(stepwise)),{now:t});stepwise=out.record;effects.push(...out.effects);}
    assert.deepEqual(stepwise,jump.record);
    assert.deepEqual(effects,jump.effects);
    assert.equal(jump.record.status,'complete');
    assert.deepEqual(jump.effects.map(e=>e.effect.command.id.split('.').at(-1)),['lift_board','lift_board','summon_weight','release_board']);
    const gone=settleWorking(law,begun,{now:100,ports:{read:(ref)=>ref.id==='weight'?null:ref}});
    assert.equal(gone.record.status,'interrupted');
    assert.equal(gone.record.receipts.at(-1).op,'move');
    assert.equal(gone.record.receipts.filter(r=>r.ok).length,2);
    const quote=quoteWorking(law,method,{bindings,at:0,id:'q'});
    assert.equal(quote.ok,true);
});
