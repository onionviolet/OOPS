// Display reads share one build per pass without changing what they read (older 8 GB slice).
import test from 'node:test';
import assert from 'node:assert/strict';
import {createFieldFixture,joinField,completeFieldProject,fieldContext} from '../scripts/field_fixtures.mjs';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {advanceSimulation,createContentRegistry,createExpansionState} from '../src/expansion_engine.js';
import {commitSimulationCommand,enrollSimulation,simulationFacts,simulationRuleFacts} from '../src/simulation.js';
import {evaluateRule} from '../src/rules.js';
import {WORKS as I,WORKS_KEYS as K} from '../src/field_works_content.js';
import {previewFieldWorksCommand} from '../src/field_works_projection.js';
import {withFactsFrame,withDisplayFactsFrame} from '../src/facts_frame.js';
import {framedSimulationRead} from '../src/simulation_render.js';
import {worldCompletionContext,worldCompletionOwnedContext} from '../src/world_completion_facts.js';

const P=I.prefix;
const body={id:'native.person.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const context=p=>({...fieldContext(p,'Shack'),nativeBody:body,nativeAlive:true,nativeReady:true,worldId:I.world});
const run=(p,id)=>{
    let out=commitSimulationCommand(p.state,registry,{id:P+id},context(p));
    const job=out.state.simulation.jobs.find(j=>j.actorId==='player');
    if(job){const c=context(out);out=advanceSimulation(out.state,registry,job.due-out.state.clock,out.external,out.gameplay,{player:{...c,vitals:c.vitals.player}});}
    return out;
};
function stages(){
    let p=completeFieldProject(joinField(createFieldFixture()));p.external.money=200;
    for(const k of ['log','coal','ore','iron','belmart','golmoon'])p.gameplay.player.inventory[K[k]]=30;
    const out=[completeFieldProject(joinField(createFieldFixture())),p=run(p,'begin')];
    for(const id of ['gather_clay','shape','dry','fire'])out.push(p=run(p,id));
    return out;
}

test('field-works reasons read in a frame equal the full-copy reasons for every command',()=>{
    const ids=[...registry.simulation.commands.keys()].filter(id=>id.startsWith(P));
    assert.ok(ids.length>10);
    let blocked=0;
    for(const p of stages()){
        const c=context(p);
        const eager=ids.map(id=>previewFieldWorksCommand(p.state,registry,id,c));
        const framed=withFactsFrame(p.state,()=>ids.map(id=>previewFieldWorksCommand(p.state,registry,id,c)));
        assert.deepEqual(framed,eager);
        blocked+=eager.filter(q=>!q.eligible).length;
    }
    assert.ok(blocked>0,'the requirement path is exercised');
});

test('rule facts keep an absent item unknown, exactly as the full dictionary does',()=>{
    const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{}});
    const state=enrollSimulation(createExpansionState(81),registry,{actorId:'player',facts:{location:'Village'},external:{money:91},gameplay:{}}).state;
    const c={actorId:'player',targetId:null,facts:{location:'Village',other:3},gameplay:{player:{inventory:{}}}};
    const rule={all:[{not:{fact:'item.never_held',op:'eq',value:0}},{any:[{fact:'other',op:'gte',value:2},{fact:'missing',op:'eq',value:true}]}]};
    withFactsFrame(state,()=>{
        const picked=simulationRuleFacts(state,c,registry,rule),full=simulationFacts(state,c,registry);
        assert.deepEqual(Object.keys(picked).sort(),['other']);
        assert.deepEqual(evaluateRule(rule,picked),evaluateRule(rule,full));
        picked.other=0;assert.equal(simulationFacts(state,c,registry).other,3,'the shared row is not exposed');
    });
    assert.deepEqual(simulationRuleFacts(state,c,registry,rule),simulationFacts(state,c,registry),'outside a frame it is the full read');
});

test('an owned world-completion context equals the copied one and reuses only its own dictionary',()=>{
    const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{}});
    const state=enrollSimulation(createExpansionState(81),registry,{actorId:'player',facts:{location:'Village'},external:{money:91},gameplay:{}}).state;
    const facts=()=>({...Object.fromEntries(Array.from({length:300},(_,i)=>['unrelated.'+i,i])),location:'Village','worldCompletion.local':'stale'});
    const base={actorId:'player',vitals:{health:9},equipment:{},gameplay:{}};
    const copied=worldCompletionContext(state,{...base,facts:facts()});
    const mine=facts(),owned=worldCompletionOwnedContext(state,{...base,facts:mine});
    assert.equal(JSON.stringify(owned),JSON.stringify(copied),'same keys, values and order');
    assert.equal(owned.facts,mine);
});

test('a display pass joins an open pass over the same state and opens its own otherwise',()=>{
    const state={clock:1,sequence:1},other={clock:1,sequence:1};let builds=0;
    const read=key=>framedSimulationRead(key,'probe',()=>({n:++builds}),v=>({...v}));
    withDisplayFactsFrame(state,()=>{read(state);read(state);});
    assert.equal(builds,1);
    withFactsFrame(state,()=>{read(state);withDisplayFactsFrame(state,()=>read(state));withDisplayFactsFrame(other,()=>read(other));});
    assert.equal(builds,3,'same state joins; another state gets its own pass');
    read(state);assert.equal(builds,4,'no pass outlives its call');
});
