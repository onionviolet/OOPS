import test from 'node:test';
import assert from 'node:assert/strict';
import {admitFoundationInteraction,applyFoundationInteractionEffect,resolveFoundationDelivery,recordFoundationDelivery,advanceFoundationInteractions,foundationInteractionView,validateFoundationInteractionEffect,validateFoundationInteractionState,freezeFoundationInteractionActivation,nextFoundationInteractionBoundary,FOUNDATION_INTERACTION_INSTANCE_BUDGET} from '../src/foundation_interaction_policy.js';
import {foundationInteractionDefinitions,foundationInteractionProbeGuard,foundationInteractionProbeContext,FOUNDATION_PROBE_ACTORS} from '../src/foundation_interaction_content.js';
import {expeditionRegistry,initializeExpedition} from '../src/expedition_content.js';
import {createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation,commitSimulationCommand,answerSimulationEncounter} from '../src/simulation.js';

function fixture() {
    const state = {clock:0,actors:{},simulation:{people:{},faculties:{}}};
    for (const actor of ['alice','bob','carol']) {
        state.actors[actor]={worldId:'test.world',resources:{fuel:10},sources:{magic:{expiresAt:null}}};
        state.simulation.people[actor]={life:'alive',location:'room',body:{id:`${actor}.body`,ownerId:actor,controllerId:actor,mobile:true,form:'humanoid',hands:2,handsUsable:true}};
        state.simulation.faculties[actor]={magic:{awakened:true,active:true,suppressed:false}};
    }
    applyFoundationInteractionEffect(state,{type:'foundationInteraction',operation:'enroll'},{actorId:'alice'},'enrollment'); return state;
}
const context = {actorId:'alice',targetId:'bob'};
const create = (id,kind='barrier',extra={}) => ({type:'foundationInteraction',operation:'create',id,kind,policy:'P-A',actor:'bob',target:'bob',bodyId:'bob.body',targetBodyId:'bob.body',sourceId:'magic',support:'admission',duration:10,...extra});
const delivery = (extra={}) => ({type:'vital',actor:'bob',key:'health',amount:extra.intent==='aid'?4:-4,delivery:{id:'hit',actorId:'alice',targetId:'bob',bodyId:'alice.body',targetBodyId:'bob.body',sourceId:'magic',channel:'magic',intent:'injury',support:'admission',fuel:{key:'fuel',amount:2},...extra}});
const add = (s,e) => applyFoundationInteractionEffect(s,e,context,`cause.${e.id}`);

test('P-A blocks hostile and allied external magic; physical and self work remain lawful',()=>{
    const s=fixture(); add(s,create('barrier'));
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,false);
    assert.equal(resolveFoundationDelivery(s,delivery({intent:'aid'}),context).allowed,false);
    assert.equal(resolveFoundationDelivery(s,delivery({channel:'physical'}),context).allowed,true);
    assert.equal(resolveFoundationDelivery(s,delivery({actorId:'bob',bodyId:'bob.body',intent:'aid'}),context).allowed,true);
});
test('P-B admits only explicit aid recipients and preserves hostile block',()=>{
    const s=fixture(); add(s,create('barrier','barrier',{policy:'P-B',aidActors:['alice'],support:'sustained'}));
    assert.equal(resolveFoundationDelivery(s,delivery({intent:'aid'}),context).allowed,true);
    assert.equal(resolveFoundationDelivery(s,delivery({actorId:'carol',bodyId:'carol.body',intent:'aid'}),context).allowed,false);
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,false);
});
test('overlapping suppressors preserve original barrier identity, cause and expiry',()=>{
    const s=fixture(); add(s,create('barrier'));
    const before=structuredClone(s.simulation.foundationInteraction.instances.barrier);
    for (const id of ['s1','s2']) add(s,create(id,'suppressor',{actor:'alice',bodyId:'alice.body',channel:'magic',stage:'sustained',targetInstanceId:'barrier',duration:5}));
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,true);
    assert.equal(foundationInteractionView(s,'bob',context).instances.find(i=>i.id==='barrier').status,'suppressed');
    applyFoundationInteractionEffect(s,{type:'foundationInteraction',operation:'remove',id:'s1',actor:'alice'},context,'remove.s1');
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,true);
    applyFoundationInteractionEffect(s,{type:'foundationInteraction',operation:'remove',id:'s2',actor:'alice'},context,'remove.s2');
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,false);
    assert.deepEqual(s.simulation.foundationInteraction.instances.barrier,before);
    validateFoundationInteractionState(s);
});
test('exact clock boundary resumes unexpired barrier; expiry and removal never revive it',()=>{
    const s=fixture(); add(s,create('barrier')); add(s,create('s1','suppressor',{channel:'magic',stage:'sustained',duration:5}));
    s.clock=5; assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,false);
    assert.equal(advanceFoundationInteractions(s),1);
    s.clock=10; assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,true);
    advanceFoundationInteractions(s); assert.equal(s.simulation.foundationInteraction.instances.barrier.status,'expired');
    assert.throws(()=>add(s,create('barrier')),/Duplicate/);
    const t=fixture(); add(t,create('barrier')); applyFoundationInteractionEffect(t,{type:'foundationInteraction',operation:'remove',id:'barrier',actor:'bob'},context,'remove.barrier');
    assert.equal(resolveFoundationDelivery(t,delivery(),context).allowed,true);
});
test('sustained support loss ends construct; released physical instance survives source loss',()=>{
    const s=fixture(); add(s,create('barrier','barrier',{policy:'P-B',support:'sustained'}));
    add(s,create('arrow','projectile',{actor:'alice',target:'bob',bodyId:'alice.body',support:'released'}));
    delete s.actors.bob.sources.magic; delete s.actors.alice.sources.magic;
    assert.equal(resolveFoundationDelivery(s,delivery({support:'sustained'}),context).reason,'support-lost');
    assert.equal(resolveFoundationDelivery(s,delivery({channel:'physical',support:'released',projectileId:'arrow'}),context).allowed,true);
    advanceFoundationInteractions(s); assert.equal(s.simulation.foundationInteraction.instances.barrier.status,'support-lost');
    s.actors.bob.sources.magic={expiresAt:null}; assert.equal(s.simulation.foundationInteraction.instances.barrier.status,'support-lost');
    assert.throws(()=>resolveFoundationDelivery(s,delivery({channel:'physical',support:'released',projectileId:'missing'}),context),/exact released/);
});
test('admission rejects absent body, source, faculty, fuel or contact without mutating',()=>{
    for (const change of [s=>s.simulation.people.alice.body.controllerId='carol',s=>s.simulation.people.alice.body.mobile=false,s=>s.simulation.people.alice.body.form='mist',s=>s.simulation.people.alice.body.hands=0,s=>s.simulation.people.alice.body.handsUsable=false,s=>delete s.actors.alice.sources.magic,s=>s.simulation.faculties.alice.magic.suppressed=true,s=>s.actors.alice.resources.fuel=1,s=>s.simulation.people.bob.location='away']) {
        const s=fixture(); change(s); const before=structuredClone(s);
        assert.throws(()=>admitFoundationInteraction(s,[delivery()],context),/actual body/); assert.deepEqual(s,before);
    }
    const s=fixture(); const e=create('barrier','barrier',{fuel:{key:'fuel',amount:2}}); admitFoundationInteraction(s,[e],context);
    s.actors.bob.resources.fuel=0; add(s,e); assert.equal(s.simulation.foundationInteraction.instances.barrier.status,'present');
});
test('same rules follow exchanged actors; target-body changes cannot redirect impact',()=>{
    const s=fixture(); add(s,create('barrier','barrier',{actor:'alice',target:'alice',bodyId:'alice.body',targetBodyId:'alice.body'}));
    const e={...delivery({actorId:'bob',targetId:'alice',bodyId:'bob.body',targetBodyId:'alice.body'}),actor:'alice'};
    assert.equal(resolveFoundationDelivery(s,e,{actorId:'bob',targetId:'alice'}).allowed,false);
    s.simulation.people.alice.body.id='replacement.body';
    assert.equal(resolveFoundationDelivery(s,e,context).reason,'target-lost');
});
test('delivery/activation counter stages stay distinct and cycles fail bounded validation',()=>{
    const s=fixture(); add(s,create('gate','suppressor',{actor:'carol',target:'alice',bodyId:'carol.body',targetBodyId:'alice.body',channel:'magic',stage:'delivery'}));
    assert.deepEqual(resolveFoundationDelivery(s,delivery(),context).blockedBy,['gate']);
    assert.throws(()=>validateFoundationInteractionEffect(create('loop','barrier',{reflect:'loop'})),/cyclic/);
    assert.throws(()=>validateFoundationInteractionEffect(create('unknown','barrier',{policy:'strongest'})),/Unknown/);
    assert.throws(()=>validateFoundationInteractionEffect(create('chain','suppressor',{channel:'magic',stage:'result',next:'chain'})),/stage/);
});
test('activation-only counter is frozen for completion even after its removal',()=>{
    const s=fixture(); add(s,create('gate','suppressor',{actor:'carol',target:'alice',bodyId:'carol.body',targetBodyId:'alice.body',channel:'magic',stage:'activation'}));
    admitFoundationInteraction(s,[delivery()],context);
    const [accepted]=freezeFoundationInteractionActivation(s,[delivery()],context);
    applyFoundationInteractionEffect(s,{type:'foundationInteraction',operation:'remove',id:'gate',actor:'carol'},context,'remove.gate');
    assert.equal(resolveFoundationDelivery(s,accepted,context).reason,'activation-blocked');
    assert.equal(resolveFoundationDelivery(s,delivery(),context).allowed,true);
    assert.throws(()=>admitFoundationInteraction(s,[{...delivery({intent:'aid'}),amount:-4}],context),/intent/);
    assert.throws(()=>admitFoundationInteraction(s,[{...delivery(),actor:'carol'}],context),/recipient/);
});
test('preview is pure; delivered aftermath and mid-suppression lifecycle survive JSON reload',()=>{
    const s=fixture(); add(s,create('barrier')); add(s,create('s1','suppressor',{channel:'magic',stage:'sustained'}));
    const before=structuredClone(s), result=resolveFoundationDelivery(s,delivery(),context); assert.deepEqual(s,before);
    recordFoundationDelivery(s,delivery(),context,'impact',result);
    const restored=JSON.parse(JSON.stringify(s)); validateFoundationInteractionState(restored);
    assert.equal(resolveFoundationDelivery(restored,delivery(),context).allowed,true);
    applyFoundationInteractionEffect(restored,{type:'foundationInteraction',operation:'remove',id:'s1',actor:'bob'},context,'remove.s1');
    assert.equal(restored.simulation.foundationInteraction.history.find(h=>h.cause==='impact').operation,'delivered');
    assert.throws(()=>recordFoundationDelivery(restored,delivery(),context,'impact',result),/Duplicate/);
    assert.deepEqual(resolveFoundationDelivery({simulation:{}},{type:'vital'}),{allowed:true,legacy:true,blockedBy:[]});
});
test('finite identity slots and exact boundary prevent reset or unbounded instance creation',()=>{
    const s=fixture();assert.equal(nextFoundationInteractionBoundary(s),Infinity);
    for(let i=0;i<FOUNDATION_INTERACTION_INSTANCE_BUDGET;i++)add(s,create(`barrier.${i}`));
    assert.equal(nextFoundationInteractionBoundary(s),10);
    assert.throws(()=>add(s,create('overflow')),/budget/);
    s.clock=10;advanceFoundationInteractions(s);assert.equal(nextFoundationInteractionBoundary(s),Infinity);
    assert.throws(()=>add(s,create('replacement')),/budget/);
    validateFoundationInteractionState(s);
});
test('blocked create has observed actor receipt without inventing an active instance',()=>{
    const s=fixture();add(s,create('gate','suppressor',{actor:'carol',target:'alice',bodyId:'carol.body',targetBodyId:'alice.body',channel:'magic',stage:'activation'}));
    add(s,create('blocked','barrier',{actor:'alice',target:'alice',bodyId:'alice.body',targetBodyId:'alice.body'}));
    assert.equal(s.simulation.foundationInteraction.instances.blocked,undefined);
    assert.equal(foundationInteractionView(s,'alice',context).history.find(h=>h.id==='blocked').operation,'blocked-activation');
    const t=fixture();add(t,create('arrow','projectile',{actor:'alice',bodyId:'alice.body',support:'released'}));
    t.actors.bob.worldId='another.world';assert.equal(resolveFoundationDelivery(t,delivery({channel:'physical',support:'released',projectileId:'arrow'}),context).reason,'target-lost');
});
test('concrete arena remains optional and names identified owned bodies and separate release/flight',()=>{
    assert.equal(foundationInteractionDefinitions.people.length,3);
    assert.ok(foundationInteractionDefinitions.people.every(p=>p.provision===false&&p.body.ownerId===p.id&&p.body.controllerId===p.id));
    assert.equal(foundationInteractionDefinitions.onEnroll,undefined);
    const commands=foundationInteractionDefinitions.commands;
    for(const actor of FOUNDATION_PROBE_ACTORS.slice(0,2)) {
        const launch=commands.find(c=>c.id===`${actor}.launch`),flight=commands.find(c=>c.id===`${actor}.flight`);
        assert.equal(launch.duration,undefined);assert.equal(flight.duration,2);
        assert.equal(launch.effects[0].id,flight.effects[0].delivery.projectileId);
        for(const c of commands.filter(c=>c.actorId===actor))for(const e of c.effects)if(e.type==='foundationInteraction')validateFoundationInteractionEffect(e);
    }
    assert.throws(()=>foundationInteractionProbeGuard({},commands[0],{actorId:'player'}),/opt-in/);
});

function integratedArena() {
    const native={inventory:{},skills:{},reputation:{Village:0}};
    const extra={actorId:'player',external:{money:10},gameplay:{player:native,oldCraftsman:structuredClone(native)},facts:{location:'Village','village.craftsmanMet':true,'village.shackUnlocked':true}};
    let plan=enrollSimulation(initializeExpedition(createExpansionState(17)),expeditionRegistry,extra);
    assert.ok(FOUNDATION_PROBE_ACTORS.every(a=>!plan.state.actors[a]));
    plan=commitSimulationCommand(plan.state,expeditionRegistry,{id:'foundation.probe.enroll'},foundationInteractionProbeContext(plan.state,'player',{...extra,external:plan.external,gameplay:plan.gameplay}));
    return {plan,extra};
}
function integratedCommand(p,id,extra) {
    const d=expeditionRegistry.simulation.commands.get(id),context=foundationInteractionProbeContext(p.state,d.actorId,{...extra,external:p.external,gameplay:p.gameplay,targetId:d.targetId});
    return commitSimulationCommand(p.state,expeditionRegistry,{id},context);
}
test('full integrated registry enrolls explicit arena and command/encounter use shared delivery gate',()=>{
    let {plan:p,extra}=integratedArena();const [a,b]=FOUNDATION_PROBE_ACTORS;
    assert.equal(p.external.money,10);
    p=integratedCommand(p,`${a}.barrier.p-a`,extra);
    p=integratedCommand(p,`${b}.attack`,extra);
    assert.equal(p.state.simulation.people[a].vitals.health,40);assert.equal(p.state.actors[b].resources.demonstrationFuel,29);
    assert.equal(p.state.simulation.foundationInteraction.history.at(-1).operation,'blocked');
    p=integratedCommand(p,`${b}.encounter`,extra);
    p=answerSimulationEncounter(p.state,expeditionRegistry,'attempt',foundationInteractionProbeContext(p.state,b,{...extra,external:p.external,gameplay:p.gameplay,targetId:a}));
    assert.equal(p.state.simulation.people[a].vitals.health,40);assert.equal(p.state.actors[b].resources.demonstrationFuel,28);
    p=integratedCommand(p,`${a}.remove.p-a`,extra);p=integratedCommand(p,`${b}.attack`,extra);
    assert.equal(p.state.simulation.people[a].vitals.health,35);
    const reloaded=loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry);
    assert.equal(reloaded.simulation.foundationInteraction.instances[`${a}.barrier.p-a`].status,'removed');
});
test('full integrated timer settles real released flight after source removal and forfeits unsupported magic',()=>{
    let {plan:p,extra}=integratedArena();const [a,b]=FOUNDATION_PROBE_ACTORS;
    p=integratedCommand(p,`${a}.launch`,extra);p=integratedCommand(p,`${a}.flight`,extra);
    p=integratedCommand(p,'foundation.probe.c.strip.a',extra);
    assert.equal(p.state.simulation.jobs.length,1);assert.equal(p.state.actors[a].sources['foundation.probe.control'],undefined);
    p=advanceSimulation(p.state,expeditionRegistry,2,p.external,p.gameplay,{});
    assert.equal(p.state.simulation.people[b].vitals.health,35);assert.equal(p.state.actors[a].resources.demonstrationFuel,28);
    p=integratedCommand(p,`${b}.construct`,extra);p=integratedCommand(p,'foundation.probe.c.strip.b',extra);
    p=advanceSimulation(p.state,expeditionRegistry,2,p.external,p.gameplay,{});
    assert.equal(p.state.simulation.people[a].vitals.health,40);assert.equal(p.state.actors[b].resources.demonstrationFuel,29);
    assert.equal(p.state.simulation.foundationInteraction.history.find(h=>h.id===`${b}.construct`).reason,'support-lost');
});

test('named suppressors reject self cycles and absent, ended, wrong-body or non-barrier targets before spending',()=>{
    const s=fixture();add(s,create('barrier'));
    const effect=create('named','suppressor',{actor:'alice',bodyId:'alice.body',channel:'magic',stage:'sustained',targetInstanceId:'barrier'});
    const before=structuredClone(s);assert.doesNotThrow(()=>admitFoundationInteraction(s,[effect],context));assert.deepEqual(s,before);
    assert.throws(()=>validateFoundationInteractionEffect({...effect,targetInstanceId:'named'}),/cyclic/);
    assert.throws(()=>admitFoundationInteraction(s,[{...effect,targetInstanceId:'missing'}],context),/present barrier/);
    for(const patch of [{status:'removed',endedAt:0,endCause:'remove'},{targetBodyId:'other.body'},{kind:'projectile'},{expiresAt:0}]){
        const changed=structuredClone(s);Object.assign(changed.simulation.foundationInteraction.instances.barrier,patch);
        assert.throws(()=>admitFoundationInteraction(changed,[effect],context),/present barrier/);
        assert.equal(changed.actors.alice.resources.fuel,10);
    }
});

import {validateSimulationEffect} from '../src/simulation_contracts.js';
test('saved and authored scoped deliveries cannot attach to a non-vital owner effect',()=>{
 const effect=delivery();assert.doesNotThrow(()=>validateSimulationEffect(effect));
 assert.throws(()=>validateSimulationEffect({...effect,type:'resource',key:'fuel'}),/vital recipient/);
});
