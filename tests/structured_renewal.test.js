import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,loadExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation,commitSimulationCommand} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {validateStructuredRenewalDefinition,previewStructuredRenewal,commitStructuredRenewal} from '../src/structured_renewal.js';

const eq=(fact,value)=>({fact,op:'eq',value});
const definition={id:'atelier',world:{id:'atelier.world'},renewal:{id:'atelier.renewal',label:'Renew applied practice',description:'Rebuild a learned control method.',methodKey:'atelier.method',reserveKey:'atelier.reserve',legacyKey:'atelier.legacy',masteryThreshold:2,requires:{all:[eq('actor.atelier.delivered',true),eq('claim.atelier.delivery.owner','player')]},visibleWhen:eq('actor.atelier.known',true),reset:['Applied mastery returns to 1.','Training reserve returns to 0.'],retain:['Body, source, belongings, people, world and history.'],reward:'One lasting contribution to later work.'}};
const command=(id,extra)=>({id:'atelier.'+id,revision:1,label:id,actorId:'player',worldId:'atelier.world',costs:[],effects:[],...extra});
function setup() {
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'},{id:'atelier.world',label:'Atelier'}],sources:[{id:'atelier.source',revision:1,label:'Workshop means',kind:'knowledge',grants:[]}],simulation:{commands:[
        command('practice',{requires:eq('actor.atelier.method',1),costs:[{type:'resource',key:'atelier.reserve',amount:-1}],effects:[{type:'fact',scope:'actor',key:'atelier.method',value:2}]}),
        command('refill',{effects:[{type:'resource',key:'atelier.reserve',amount:1}]}),
        command('work',{duration:1,cancellation:'refund',requires:{fact:'actor.atelier.method',op:'gte',value:2},effects:[{type:'resource',native:true,key:'money',amount:{fact:'actor.atelier.legacy',add:1}},{type:'xp',skill:'Crafting',amount:1}]})
    ]}});
    const c={actorId:'player',registry,external:{money:9},gameplay:{player:{inventory:{[JSON.stringify({id:'Rough wood log'})]:2},skills:{Crafting:{xp:3,enabled:true}},reputation:{}}},vitals:{player:{health:7,max_health:10,stamina:5,max_stamina:10}},facts:{location:'atelier.room'},nativeAlive:true,nativeBody:{form:'human',mobile:true},busy:false};
    const plan=enrollSimulation(createExpansionState(123),registry,c),state=plan.state,a=state.actors.player;
    a.worldId='atelier.world';state.worlds['atelier.world']={facts:{'atelier.weather':'rain'},resources:{},completed:{}};
    a.facts={'atelier.known':true,'atelier.delivered':true,'atelier.method':2,'atelier.legacy':0};a.resources={'atelier.reserve':3};a.completed={'atelier.delivery':1,'atelier.practice':1};
    a.sources['atelier.source']={origin:'trained',acquiredAt:0,receiptId:'setup'};
    state.simulation.faculties.player={'atelier.source':{awakened:true,active:true,suppressed:false,development:4}};
    state.simulation.people.player.body=structuredClone(c.nativeBody);state.simulation.people.player.location='atelier.room';
    state.simulation.claims['atelier.delivery']={owner:'player',status:'settled',cause:'setup'};
    state.simulation.knowledge.player={'atelier.note':{stage:'seen',value:'A witnessed consequence.',at:0,cause:'setup'}};
    return {registry,plan,context:{...c,worldId:'atelier.world'}};
}
const bindings={player:{category:'person',id:'main_character'}};
const envelope=p=>({character:{money:p.external.money},expansion:p.state,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}});
const context=(f,p)=>({...f.context,external:p.external,gameplay:p.gameplay,vitals:p.vitals});

test('renewal validates narrow author keys and hides unavailable presentation',()=>{
    assert.equal(validateStructuredRenewalDefinition({id:'atelier'}),null);
    for(const patch of [{methodKey:'foreign.method'},{masteryThreshold:1},{practiceCommandId:'atelier.practice'},{requires:null}])assert.throws(()=>validateStructuredRenewalDefinition({...definition,renewal:{...definition.renewal,...patch}}));
    const f=setup(),before=structuredClone(f.plan);
    const view=previewStructuredRenewal(f.plan.state,definition,f.context);
    assert.equal(view.eligible,true);assert.deepEqual(f.plan,before);assert.equal(view.mastery,2);
    f.plan.state.actors.player.facts['atelier.known']=false;
    assert.deepEqual(previewStructuredRenewal(f.plan.state,definition,f.context),{visible:false,eligible:false,reasons:[]});
});

test('renewal resets exactly three selected values and stages one permanent claim',()=>{
    const f=setup(),before=structuredClone(f.plan),p=commitStructuredRenewal(f.plan.state,definition,f.context);
    assert.deepEqual(f.plan,before);assert.deepEqual(p.external,before.external);assert.deepEqual(p.gameplay,before.gameplay);assert.deepEqual(p.vitals,before.vitals);
    const expected=structuredClone(before.state);expected.actors.player.facts['atelier.method']=1;expected.actors.player.resources['atelier.reserve']=0;expected.actors.player.facts['atelier.legacy']=1;
    expected.sequence++;expected.simulation.claims['atelier.renewal']={owner:'player',status:'settled',cause:`renewal:${expected.sequence}`,at:expected.clock};
    assert.deepEqual(p.state,expected);
    const reloaded=loadExpansionState(JSON.parse(JSON.stringify(p.state)),f.registry);
    assert.deepEqual(reloaded,p.state);
    assert.throws(()=>commitStructuredRenewal(reloaded,definition,context(f,p)),/already/);
    assert.throws(()=>commitStructuredRenewal(f.plan.state,definition,f.context,f.plan.state.sequence-1),/preview changed/);
});

test('failed durable publication preserves current bytes and all live domains',()=>{
    const f=setup(),before=structuredClone(f.plan),bytes=JSON.stringify(envelope(f.plan)),p=commitStructuredRenewal(f.plan.state,definition,f.context);
    assert.throws(()=>persistExpansionPlan(p,{createSave:()=>bytes,storage:{setItem(){throw Error('synthetic quota');}},key:'test',bindings}),/synthetic quota/);
    assert.deepEqual(f.plan,before);assert.equal(JSON.stringify(envelope(f.plan)),bytes);
    let durable;
    persistExpansionPlan(p,{createSave:()=>bytes,storage:{setItem(k,v){durable=v;}},key:'test',bindings});
    const restored=JSON.parse(durable);assert.deepEqual(loadExpansionState(restored.expansion,f.registry),p.state);
    assert.equal(restored.character.money,9);
});

test('renewal refuses incapacitation, native occupation, practice, jobs and missing consequence',()=>{
    const edits=[f=>{f.context.nativeAlive=false;},f=>{f.context.nativeBody.mobile=false;},f=>{f.context.busy=true;},f=>{f.context.activeTechniquePractice=true;},f=>{f.plan.state.simulation.people.player.life='incapacitated';},f=>{f.plan.state.actors.player.techniques.test={practice:{}};},f=>{f.plan.state.pending.push({context:{actorId:'player'}});},f=>{f.plan.state.simulation.jobs.push({actorId:'player',commandId:'atelier.work'});},f=>{f.plan.state.actors.player.facts['atelier.delivered']=false;},f=>{delete f.plan.state.simulation.claims['atelier.delivery'];}];
    for(const edit of edits){const f=setup();edit(f);assert.equal(previewStructuredRenewal(f.plan.state,definition,f.context).eligible,false);assert.throws(()=>commitStructuredRenewal(f.plan.state,definition,f.context));}
});

test('repeatable real practice and a timed work consumer combine relearned mastery with retained legacy',()=>{
    const f=setup();
    const run=(p,id)=>commitSimulationCommand(p.state,f.registry,{id:'atelier.'+id},context(f,p));
    const finish=p=>advanceSimulation(p.state,f.registry,1,p.external,p.gameplay,{player:context(f,p)});
    const ordinary=finish(run(f.plan,'work'));assert.equal(ordinary.external.money,10);
    let p=commitStructuredRenewal(ordinary.state,definition,context(f,ordinary));
    assert.throws(()=>run(p,'work'),/means|circumstances/);
    assert.throws(()=>run(p,'practice'),/Insufficient|resource|means|circumstances/);
    p=run(p,'refill');p=run(p,'practice');assert.equal(p.state.actors.player.facts['atelier.method'],2);
    assert.equal(p.state.actors.player.completed['atelier.practice'],2);
    p=finish(run(p,'work'));assert.equal(p.external.money,12);assert.equal(p.gameplay.player.skills.Crafting.xp,5);
    assert.equal(p.state.actors.player.facts['atelier.legacy'],1);assert.equal(p.state.simulation.faculties.player['atelier.source'].development,4);
});
