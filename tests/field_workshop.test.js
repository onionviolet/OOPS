import test from "node:test";
import assert from "node:assert/strict";
import {createContentRegistry,createExpansionState,loadExpansionState,advanceSimulation} from "../src/expansion_engine.js";
import {expeditionRegistry,initializeExpedition} from "../src/expedition_content.js";
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand,previewSimulationResponse,cancelSimulationJob,simulationOccupiesActor,respondSimulationEvent,answerSimulationEncounter} from "../src/simulation.js";
import {fieldDefinitions,fieldProject,fieldWorkshopView,fieldQuestView,beginFieldWorkshop} from "../src/field_workshop.js";
import {compileSiteProject} from "../src/site_projects.js";
import {compileSituation} from "../src/scene_definitions.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {energyView} from "../src/energy_resources.js";
import {eventFeed} from "../src/event_feed.js";
import {createFieldFixture,fieldContext,fieldCommand,fieldAdvance,fieldReload,joinField,completeFieldProject,wood,kit} from "../scripts/field_fixtures.mjs";
const focus="field.focus",drive="field.drive",method="field.load_step";
const learn=(p,name)=>fieldAdvance(fieldCommand(p,`field.learn_${name}`),name === "focus" ? 2 : 3);
const recover=(p,name)=>fieldAdvance(fieldCommand(p,`field.recover_${name}`,"Shack"),name === "focus" ? 2 : 4);
const taught=p=>fieldAdvance(fieldCommand(p,"field.teach_step","Village",{targetId:"oldCraftsman"}),2);

test("a completed useful packing application teaches load control; cancellation and unrelated work do not",()=>{
    let p=completeFieldProject(taught(recover(recover(learn(learn(joinField(),"focus"),"drive"),"focus"),"drive")));
    const mastery=p=>p.state.simulation.powers.player[method].mastery;
    const preview=(p,id)=>previewSimulationCommand(p.state,expeditionRegistry,id,fieldContext(p,"Shack"));
    assert.equal(mastery(p),1);
    assert.equal(preview(p,"field.pack_drive").eligible,false);
    const before=structuredClone(p);
    assert.equal(preview(p,"field.pack_applied_focus").eligible,true);
    assert.deepEqual(p,before,"a free preview teaches nothing and consumes nothing");
    const pending=fieldCommand(p,"field.pack_applied_focus","Shack");
    assert.equal(mastery(pending),1);
    assert.equal(pending.external.money,p.external.money-1);
    assert.equal(pending.gameplay.player.inventory[wood],p.gameplay.player.inventory[wood]-1);
    assert.equal(pending.state.simulation.energies.player[focus].reserve,2);
    const cancelled=cancelSimulationJob(fieldReload(pending).state,expeditionRegistry,pending.state.simulation.jobs[0].id,fieldContext(pending,"Shack"));
    assert.equal(mastery(cancelled),1);
    assert.equal(cancelled.external.money,p.external.money);
    assert.deepEqual(cancelled.gameplay.player.inventory,p.gameplay.player.inventory);
    assert.deepEqual(cancelled.state.simulation.energies.player[focus],p.state.simulation.energies.player[focus]);
    p=fieldAdvance(fieldReload(fieldCommand(cancelled,"field.pack_applied_focus","Shack")),1);
    assert.equal(mastery(p),1,"an unfinished job grants no partial lesson");
    p=fieldAdvance(fieldReload(p),1);
    assert.equal(mastery(p),2);
    assert.equal(p.gameplay.player.inventory[kit],1);
    assert.equal(preview(p,"field.pack_drive").eligible,true,"earned mastery changes an existing consumer");
    assert.equal(preview(p,"field.pack_applied_focus").eligible,false);
    assert.throws(()=>fieldCommand(p,"field.pack_applied_focus","Shack"));
    const ready=fieldReload(p);
    p=fieldAdvance(fieldCommand(ready,"field.pack_drive","Shack"),1);
    assert.equal(p.gameplay.player.inventory[kit],2);
    assert.equal(mastery(p),2);
    assert.equal(p.state.simulation.energies.player[drive].reserve,3);
    const unrelated=fieldAdvance(fieldCommand(before,"field.pack_focus","Shack"),2);
    assert.equal(mastery(unrelated),1,"ordinary repetition is not the new loaded lesson");
    assert.equal(fieldReload(p).state.actors.player.completed["field.pack_applied_focus"],1);
});

test("old enrolled saves gain no energies, specialist, project or invented history",()=>{
    const p=createFieldFixture(),saved=structuredClone(p.state);delete saved.actors.player.facts["field.introduced"];delete saved.actors.player.completed["field.begin"];delete saved.simulation.powers.oldCraftsman;
    delete saved.simulation.sites["field.route"];delete saved.simulation.sites["field.assembly"];for(const key of Object.keys(saved.worlds["base.frontier"].facts))if(key.startsWith("project.field") || key.startsWith("situation.field"))delete saved.worlds["base.frontier"].facts[key];
    const loaded=initializeExpedition(loadExpansionState(saved,expeditionRegistry));assert.equal(loaded.simulation.energies,undefined);assert.equal(loaded.simulation.people.fieldSurveyor,undefined);assert.equal(loaded.actors.player.facts["field.introduced"],false);
    const before=structuredClone(loaded),begun=beginFieldWorkshop(loaded,expeditionRegistry,fieldContext({...p,state:loaded}));assert.deepEqual(loaded,before);assert.equal(begun.state.simulation.sites["field.assembly"].owner,"player");
});
test("field and craft admission use different evidence and exact refundable supplies",()=>{
    const fresh=createFieldFixture();assert.equal(previewSimulationCommand(fresh.state,expeditionRegistry,"field.join_survey",fieldContext(fresh)).eligible,false);
    const field=joinField();assert.equal(field.state.actors.player.facts["field.entry"],"survey");assert.equal(field.external.money,100);assert.equal(field.gameplay.player.inventory[wood],20);
    let craft=fieldCommand(fresh,"field.join_craft");assert.equal(craft.external.money,99);assert.equal(craft.gameplay.player.inventory[wood],18);
    craft=cancelSimulationJob(fieldReload(craft).state,expeditionRegistry,craft.state.simulation.jobs[0].id,fieldContext(craft));assert.equal(craft.external.money,100);assert.equal(craft.gameplay.player.inventory[wood],20);
    craft=fieldAdvance(fieldCommand(craft,"field.join_craft"),3);assert.equal(craft.state.actors.player.facts["field.entry"],"craft");assert.throws(()=>fieldCommand(craft,"field.join_survey"),/already|missing|hidden/);
});
test("teaching reserves both people; copying retains the donor and actual mastery",()=>{
    let p=fieldCommand(joinField(),"field.teach_step","Village",{targetId:"oldCraftsman"});assert.equal(simulationOccupiesActor(p.state,"oldCraftsman"),true);
    assert.equal(previewSimulationCommand(p.state,expeditionRegistry,"village.craftsman_work",{...fieldContext(p),actorId:"oldCraftsman",facts:{location:"Village"}}).eligible,false);
    p=fieldAdvance(fieldReload(p),2);assert.equal(simulationOccupiesActor(p.state,"oldCraftsman"),false);assert.equal(p.state.simulation.powers.player[method].mastery,1);
    let copy=recover(learn(joinField(),"focus"),"focus");copy=fieldAdvance(fieldCommand(copy,"field.discover_imprint"),3);copy=fieldCommand(copy,"field.copy_step","Village",{targetId:"oldCraftsman"});
    assert.equal(copy.state.simulation.powers.oldCraftsman[method].owned,true);assert.equal(copy.state.simulation.powers.oldCraftsman[method].mastery,2);assert.equal(copy.state.simulation.powers.player[method].mastery,2);
    assert.equal(copy.state.simulation.energies.player[focus].reserve,2);assert.equal(copy.state.actors.player.sources[method].origin,"acquired");
});
test("energy enforces output/control, real recovery, strain and saved capacity",()=>{
    let p=recover(recover(learn(learn(joinField(),"focus"),"drive"),"focus"),"drive");assert.deepEqual(energyView(p.state).map(e=>e.reserve),[4,6]);p.state.simulation.energies.player[focus].strain=2;
    const badRegistry=createContentRegistry({worlds:[{id:"base.frontier"}],simulation:{energies:fieldDefinitions.energies,commands:[{id:"bad",revision:1,label:"bad",costs:[{type:"energy",energyId:focus,operation:"use",output:2,control:1}]}]}});
    assert.equal(previewSimulationCommand(p.state,badRegistry,"bad",fieldContext(p)).eligible,false);
    p=fieldCommand(p,"field.recover_focus","Shack");const due=p.state.simulation.jobs[0].due;p=fieldAdvance(fieldReload(fieldAdvance(fieldReload(p),1)),1);assert.equal(p.state.simulation.energies.player[focus].strain,0);assert.equal(due,p.state.clock);
    const bad=structuredClone(p.state);bad.simulation.energies.player[focus].reserve=999;assert.throws(()=>loadExpansionState(bad,expeditionRegistry),/energy/);
});
test("a pending energy acquisition retains its committed policy through a registry revision",()=>{
    const p=fieldCommand(joinField(),"field.learn_focus"),simulation=Object.fromEntries(Object.entries(expeditionRegistry.simulation).filter(([,v])=>v instanceof Map).map(([k,v])=>[k,[...v.values()]]));
    simulation.energies=simulation.energies.map(d=>d.id === focus ? {...d,revision:2,capacity:1} : d);simulation.onEnroll=expeditionRegistry.simulation.onEnroll;
    const changed=createContentRegistry({worlds:[...expeditionRegistry.worlds.values()],sources:[...expeditionRegistry.sources.values()],capabilities:[...expeditionRegistry.capabilities.values()],simulation});
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(p.state)),changed),finished=advanceSimulation(loaded,changed,2,p.external,p.gameplay);
    assert.equal(finished.state.simulation.energies.player[focus].policy.revision,1);assert.equal(finished.state.simulation.energies.player[focus].policy.capacity,4);assert.equal(finished.state.simulation.energies.player[focus].reserve,0);
});
test("specialists spend owned supplies independently; reports differ from actual completion",()=>{
    let p=fieldCommand(joinField(),"field.project_start","Village",{targetId:"oldCraftsman"});assert.equal(p.external.money,96);assert.equal(p.gameplay.player.inventory[wood],17);assert.equal(p.gameplay.oldCraftsman.inventory[wood],2);assert.equal(p.state.simulation.owners.fieldSurveyor[wood],1);
    const before=structuredClone(p);for(let i=0;i<4;i++)fieldWorkshopView(p.state);assert.deepEqual(p,before);
    p=fieldAdvance(fieldReload(p),1);assert.equal(p.state.simulation.jobs.length,2);assert.equal(p.state.simulation.owners.fieldSurveyor[wood],undefined);
    const whole=fieldAdvance(fieldReload(p),6),split=fieldAdvance(fieldReload(fieldAdvance(fieldReload(p),2)),4);assert.deepEqual(split.state,whole.state);assert.deepEqual(split.gameplay,whole.gameplay);
    assert.equal(fieldWorkshopView(whole.state).project.phases[0].knownComplete,false);p=fieldCommand(whole,"field.inspect");assert.equal(fieldWorkshopView(p.state).project.phases[1].knownComplete,true);
    p=fieldCommand(p,"field.workshop.assembly","Shack");assert.equal(p.external.money,95);p=cancelSimulationJob(p.state,expeditionRegistry,p.state.simulation.jobs[0].id,fieldContext(p,"Shack"));assert.equal(p.external.money,96);
    p=fieldAdvance(fieldCommand(fieldReload(p),"field.workshop.assembly","Shack"),3);assert.equal(fieldQuestView(p.state).completed,true);assert.equal(fieldWorkshopView(p.state).project.phases[2].knownComplete,true);assert.throws(()=>fieldCommand(p,"field.project_start","Village",{targetId:"oldCraftsman"}),/already/);
});
test("mastery opens a useful application; cancellation refunds energy, strain, materials and money",()=>{
    let p=completeFieldProject(recover(learn(taught(joinField()),"drive"),"drive"));assert.equal(previewSimulationCommand(p.state,expeditionRegistry,"field.pack_drive",fieldContext(p,"Shack")).eligible,false);p=fieldAdvance(fieldCommand(p,"field.practice_step"),2);
    const before=structuredClone(p);p=fieldCommand(p,"field.pack_drive","Shack");assert.equal(p.state.simulation.energies.player[drive].reserve,3);assert.equal(p.state.simulation.energies.player[drive].strain,1);
    p=cancelSimulationJob(fieldReload(p).state,expeditionRegistry,p.state.simulation.jobs[0].id,fieldContext(p,"Shack"));assert.deepEqual(p.state.simulation.energies.player[drive],before.state.simulation.energies.player[drive]);assert.equal(p.external.money,before.external.money);assert.deepEqual(p.gameplay.player.inventory,before.gameplay.player.inventory);
    p=fieldAdvance(fieldCommand(p,"field.pack_drive","Shack"),1);assert.equal(p.gameplay.player.inventory[kit],1);
});
test("situations develop independently; help pays once and leaves a useful consequence",()=>{
    let p=fieldAdvance(completeFieldProject(taught(joinField())),7),e=Object.values(p.state.simulation.events).find(e=>e.definitionId === "field.road.window" && e.status === "open");assert.ok(e);assert.equal(fieldWorkshopView(p.state).road,"quiet");
    assert.equal(eventFeed(p.state,expeditionRegistry,{location:"Village"}).leads.find(l=>l.panel === "field_panel").view,"here");assert.equal(previewSimulationResponse(p.state,expeditionRegistry,{kind:"event",eventId:e.id,responseId:"focus"},fieldContext(p)).eligible,false);
    p.gameplay.player.inventory[kit]=1;p=respondSimulationEvent(p.state,expeditionRegistry,e.id,"kit",fieldContext(p));assert.equal(p.gameplay.player.inventory[kit],undefined);assert.equal(p.state.actors.player.facts["field.roadKnown"],"secured");assert.ok(p.state.actors.player.sources["field.road_support"]);
    assert.throws(()=>respondSimulationEvent(p.state,expeditionRegistry,e.id,"kit",fieldContext(p)),/unavailable/);assert.equal(fieldAdvance(fieldReload(p),30).state.worlds["base.frontier"].facts["situation.field.road.stage"],"secured");
});
test("new situation responses require idle participants while legacy incidental responses preserve their policy",()=>{
    const registry=createContentRegistry({worlds:[{id:"base.frontier"}],simulation:{commands:[{id:"work",revision:1,label:"Work",duration:5,costs:[],effects:[]}],events:[{id:"report",revision:1,label:"Report",mode:"offer",public:true,automatic:true,interval:1,lifetime:10,maxOccurrences:1,responses:[{id:"incidental",label:"Read"},{id:"intervene",label:"Intervene",requiresIdle:true}]}]}});
    let p=enrollSimulation(createExpansionState(73),registry,{actorId:"player",external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}},facts:{location:"Village"}});
    p=advanceSimulation(p.state,registry,1,p.external,p.gameplay);const event=Object.values(p.state.simulation.events).find(e=>e.definitionId === "report");
    p=commitSimulationCommand(p.state,registry,{id:"work"},fieldContext(p));
    assert.equal(previewSimulationResponse(p.state,registry,{kind:"event",eventId:event.id,responseId:"incidental"},fieldContext(p)).eligible,true);
    assert.equal(previewSimulationResponse(p.state,registry,{kind:"event",eventId:event.id,responseId:"intervene"},fieldContext(p)).eligible,false);
    assert.equal(previewSimulationResponse(p.state,registry,{kind:"event",eventId:event.id,responseId:"incidental"},{...fieldContext(p),busy:true}).eligible,false);
});
test("abstention creates no reward or debt; a later observed repair remains available",()=>{
    let p=fieldAdvance(completeFieldProject(joinField()),60);assert.equal(p.state.worlds["base.frontier"].facts["situation.field.road.stage"],"detour");assert.equal(p.state.actors.player.sources["field.road_support"],undefined);assert.equal(p.state.actors.player.facts["field.roadOutcome"],undefined);assert.equal(p.state.actors.player.facts["field.roadKnown"],"quiet");
    p=fieldCommand(p,"field.inspect");p=fieldAdvance(fieldCommand(p,"field.repair_later"),2);assert.equal(p.state.actors.player.facts["field.roadKnown"],"repaired");assert.ok(p.state.actors.player.sources["field.road_support"]);
});
test("encounter previews preserve state, pause time and release all participants at settlement",()=>{
    let p=fieldCommand(taught(joinField()),"field.assess","Village",{targetId:"oldCraftsman"});const before=structuredClone(p);assert.equal(previewSimulationResponse(p.state,expeditionRegistry,{kind:"encounter",responseId:"ordinary"},fieldContext(p)).eligible,true);assert.deepEqual(p,before);assert.equal(fieldAdvance(p,50).remaining,50);
    assert.equal(simulationOccupiesActor(p.state,"oldCraftsman"),true);p=answerSimulationEncounter(p.state,expeditionRegistry,"ordinary",fieldContext(p));assert.equal(simulationOccupiesActor(p.state,"oldCraftsman"),false);assert.equal(p.state.simulation.claims["field.assessment"].status,"settled");
});
test("authoring diagnostics and corrupt participant overlap reject",()=>{
    assert.throws(()=>compileSiteProject({...fieldProject,phases:[{...fieldProject.phases[0],after:["parts"]}]}),/cyclic/);assert.throws(()=>compileSituation({id:"bad",revision:1,phases:[{id:"offer",mode:"offer",delay:1}]}),/expiry/);
    assert.throws(()=>createContentRegistry({worlds:[{id:"base.frontier"}],simulation:{energies:[{...fieldDefinitions.energies[0],efficiencyDenominator:0}]}}),/energy/);
    const p=fieldCommand(joinField(),"field.teach_step","Village",{targetId:"oldCraftsman"}),bad=structuredClone(p.state);bad.simulation.jobs.push({...bad.simulation.jobs[0],id:"second",actorId:"oldCraftsman",participants:["oldCraftsman"]});assert.throws(()=>loadExpansionState(bad,expeditionRegistry),/job|participant/);
});
test("failed persistence publishes no partial commission or debit",()=>{
    const p=joinField(),before=structuredClone(p),plan=fieldCommand(p,"field.project_start","Village",{targetId:"oldCraftsman"});let writes=0;
    assert.throws(()=>persistExpansionPlan(plan,{createSave:()=>JSON.stringify({character:{money:100},inventories:{person:{main_character:{},oldCraftsman:{}}},levels:{person:{main_character:{skill_xp:{}},oldCraftsman:{skill_xp:{}}}},reputation:{Village:0},retired_content:{kept:true}}),
        bindings:{player:{category:"person",id:"main_character"},oldCraftsman:{category:"person",id:"oldCraftsman"}},storage:{setItem(){writes++;throw new Error("quota");}},key:"proof"}),/quota/);assert.equal(writes,1);assert.deepEqual(p,before);
});
