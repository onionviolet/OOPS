import test from 'node:test';
import assert from 'node:assert/strict';
import {compileStructuredAbilities} from '../src/structured_ability_runtime.js';
import {createExpansionState, createContentRegistry, advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation, previewSimulationCommand, commitSimulationCommand} from '../src/simulation.js';
const eq = (fact,value=true) => ({fact,op:'eq',value});
const worn = JSON.stringify({id:'work.worn'}), fixed = JSON.stringify({id:'work.fixed'});
function raw() {
    return {id:'work', world:{id:'work.world'}, sources:['method','carrier'].map(id=>({id:'work.'+id,revision:1,kind:'technique',label:id,grants:[]})),
        abilities:[{id:'work.ability',commandId:'work.repair',sourceId:'work.method',powerId:'work.pattern',function:'craft',acquisition:'learned',executionKind:'permanent-imprint',control:eq('actor.control'),target:eq('target.resource.compatible',1),counters:[eq('target.resource.blocked',1)],carriers:[{sourceId:'work.carrier',requires:eq('actor.carrierFit')}]}],
        simulation:{powers:[{id:'work.pattern',revision:1,label:'Repair pattern',model:'practice',capacity:1}],commands:[{id:'work.repair',revision:1,label:'Repair strap',worldId:'work.world',actorId:'player',targetId:'work.target',coLocated:true,participants:['$target'],audience:['$actor'],powerId:'work.pattern',duration:0,costs:[{type:'resource',scope:'actor',key:'fuel',amount:-2},{type:'item',actor:'$target',key:worn,amount:-1}],effects:[{type:'item',actor:'$target',key:fixed,amount:1}]}]}};
}
function setup(change=()=>{}) {
    const d=raw();change(d);const compiled=compileStructuredAbilities(d);
    const commands=[...compiled.commands,{id:'work.learn',revision:1,label:'Practice pattern',worldId:'work.world',effects:[{type:'power',powerId:'work.pattern',operation:'learn'}],costs:[]}];
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'},{id:'work.world',label:'Synthetic workshop'}],sources:d.sources,simulation:{commands,powers:compiled.powers,people:[{id:'work.target',revision:1,label:'Recipient',worldId:'work.world',location:'work.room',inventory:'simulation',resources:{compatible:1,blocked:0}}],onEnroll:[{type:'source',sourceId:'work.method',operation:'grant',awakened:true,active:true},{type:'item',actor:'work.target',key:worn,amount:1}]}});
    const state=createExpansionState();state.actors.player.worldId='work.world';state.worlds['work.world']={facts:{},resources:{},completed:{}};state.actors.player.resources.fuel=3;state.actors.player.facts.control=true;state.actors.player.facts.carrierFit=false;
    const context={actorId:'player',targetId:'work.target',worldId:'work.world',facts:{location:'work.room'},gameplay:{player:{inventory:{},skills:{},reputation:{}}},external:{}};
    const plan=enrollSimulation(state,registry,context);
    return {d,registry,context,plan};
}
function learn(f) {f.plan=commitSimulationCommand(f.plan.state,f.registry,{id:'work.learn'},{...f.context,gameplay:f.plan.gameplay,targetId:null});return f;}
const preview = f => previewSimulationCommand(f.plan.state,f.registry,'work.repair',{...f.context,gameplay:f.plan.gameplay});
const use = f => commitSimulationCommand(f.plan.state,f.registry,{id:'work.repair'},{...f.context,gameplay:f.plan.gameplay});

test('reading, learned pattern and held active method are distinct; native transaction pays and transforms actual target stock',()=>{
    const f=setup();f.plan.state.simulation.knowledge.player={'work.pattern':{stage:'understood',value:'A remembered pattern.',at:0,cause:'synthetic.read'}};
    assert.equal(preview(f).eligible,false);
    learn(f);assert.equal(preview(f).eligible,true);
    const before=structuredClone(f.plan.state), result=use(f);
    assert.deepEqual(f.plan.state,before);
    assert.equal(result.state.actors.player.resources.fuel,1);
    assert.equal(result.state.simulation.owners['work.target'][worn],undefined);
    assert.equal(result.state.simulation.owners['work.target'][fixed],1);
    assert.equal(result.state.simulation.powers.player['work.pattern'].executions,1);
    delete f.plan.state.actors.player.sources['work.method'];delete f.plan.state.simulation.faculties.player['work.method'];assert.equal(preview(f).eligible,false);
});

test('counter, control, fuel, local world and explicit carrier compatibility refuse without spending or leaking predicates',()=>{
    for(const change of [f=>f.plan.state.actors.player.facts.control=false,f=>f.plan.state.actors.player.resources.fuel=1,f=>f.plan.state.actors['work.target'].resources.blocked=1,f=>f.plan.state.actors['work.target'].resources.compatible=0,f=>{f.plan.state.actors.player.worldId='base.frontier';}]) {
        const f=learn(setup());change(f);const before=structuredClone(f.plan.state);assert.equal(preview(f).eligible,false);assert.throws(()=>use(f));assert.deepEqual(f.plan.state,before);
    }
    const f=learn(setup());delete f.plan.state.actors.player.sources['work.method'];delete f.plan.state.simulation.faculties.player['work.method'];
    f.plan.state.actors.player.sources['work.carrier']={acquiredAt:0,expiresAt:null,receiptId:'synthetic',worldId:'work.world',revision:1};
    f.plan.state.simulation.faculties.player['work.carrier']={awakened:true,active:true,suppressed:false,development:0};
    assert.equal(preview(f).eligible,false);f.plan.state.actors.player.facts.carrierFit=true;assert.equal(preview(f).eligible,true);
    f.plan.state.actors['work.target'].resources.blocked=1;
    const q=preview(f);assert.equal(q.eligible,false);assert.ok(q.reasons.every(r=>!r.includes('blocked')&&!r.includes('carrierFit')));
});

test('timed ability rechecks source support and refunds reservation on method loss',()=>{
    const f=learn(setup(d=>{d.simulation.commands[0].duration=2;d.simulation.commands[0].cancellation='refund';}));
    const started=use(f);assert.equal(started.state.actors.player.resources.fuel,1);
    delete started.state.actors.player.sources['work.method'];delete started.state.simulation.faculties.player['work.method'];
    const result=advanceSimulation(started.state,f.registry,2,started.external,started.gameplay);
    assert.equal(result.state.actors.player.resources.fuel,3);
    assert.equal(result.state.simulation.owners['work.target'][worn],1);
    assert.equal(result.state.simulation.owners['work.target'][fixed],undefined);
});

test('authoring rejects unowned methods, metadata-only effects and unsupported borrowed routes before any mutation',()=>{
    for(const change of [d=>d.abilities[0].sourceId='foreign.method',d=>d.abilities[0].function='cosmetic',d=>d.simulation.commands[0].effects=[{type:'fact',key:'pretend',value:true}],d=>d.abilities[0].carriers=[{sourceId:'work.carrier'}],d=>d.abilities.push({...d.abilities[0],id:'work.other'}),d=>delete d.abilities[0].powerId,d=>{d.simulation.commands[0].duration=2;d.simulation.commands[0].cancellation='forfeit';}]) {
        const d=raw();change(d);const before=structuredClone(d);assert.throws(()=>compileStructuredAbilities(d));assert.deepEqual(d,before);
    }
    const d=raw(), before=structuredClone(d);compileStructuredAbilities(d);assert.deepEqual(d,before);
});

// Full compiler/registry bypass coverage uses an original public fixture.
import {abilityPack} from './fixtures/air-wider/ability_pack.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
function nativeSetup(){
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const compiled=compileStructuredPack(abilityPack(),registry);mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:'sha256:'+'a'.repeat(64)};
 const context={registry,actorId:'player',worldId:'base.frontier',external:{money:10},gameplay:{player:{inventory:{},skills:{Crafting:{xp:0,enabled:true}},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},facts:{location:'airproof.room'},nativeBody:{id:'native.player.body',form:'human'},busy:false};
 const {plan,record}=beginStructuredCampaign(createExpansionState(),d,context,null);return {registry,d,plan,record,context:{...context,worldId:d.world.id}};
}
test('registered commands enforce metadata even through direct commit and failed publication preserves old bytes',()=>{
 const f=nativeSetup(),ctx={...f.context,gameplay:f.plan.gameplay,external:f.plan.external};
 assert.throws(()=>commitSimulationCommand(f.plan.state,f.registry,{id:'airproof.repair.jig'},ctx));
 const result=commitSimulationCommand(f.plan.state,f.registry,{id:'airproof.repair.hand'},ctx);
 assert.equal(result.external.money,8);assert.equal(result.gameplay.player.inventory['{"id":"airproof.fixed"}'],1);assert.equal(result.gameplay.player.skills.Crafting.xp,1);
 const before=structuredClone(f.plan),bytes=JSON.stringify({character:{money:10},expansion:f.plan.state,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}});
 assert.throws(()=>persistExpansionPlan(result,{createSave:()=>bytes,key:'synthetic',bindings:{player:{category:'person',id:'main_character'}},storage:{setItem(){throw Error('quota');}}}),/quota/);assert.deepEqual(f.plan,before);
 f.plan.state.simulation.faculties.player['airproof.hand'].suppressed=true;assert.throws(()=>commitSimulationCommand(f.plan.state,f.registry,{id:'airproof.repair.hand'},ctx));assert.equal(f.plan.external.money,10);
});
test('full pack compiler rejects unsupported ability fields and absent metadata remains byte-identical',()=>{
 const d=abilityPack();d.abilities[0].pretend=true;assert.throws(()=>compileStructuredPack(d));
 delete d.abilities;assert.equal(JSON.stringify(compileStructuredPack(d).definition),JSON.stringify(d));
 const malformed=abilityPack();malformed.abilities=null;assert.throws(()=>compileStructuredPack(malformed));
});

test('declared target cannot be replaced through direct command context',()=>{
 const f=learn(setup());const before=structuredClone(f.plan);assert.throws(()=>commitSimulationCommand(f.plan.state,f.registry,{id:'work.repair'},{...f.context,gameplay:f.plan.gameplay,targetId:'player'}),/participant|target|support/);assert.deepEqual(f.plan,before);
});
