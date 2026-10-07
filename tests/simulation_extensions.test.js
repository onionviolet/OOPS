import test from "node:test";
import assert from "node:assert/strict";
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from "../src/expansion_engine.js";
import {enrollSimulation,commitSimulationCommand,previewSimulationCommand,previewSimulationResponse,answerSimulationEncounter,withdrawSimulationEncounter} from "../src/simulation.js";
import {expeditionRegistry,initializeExpedition} from "../src/expedition_content.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";

const wood = JSON.stringify({id:"Rough wood log"}), kit = JSON.stringify({id:"Prepared survey kit"});
const req = (fact,value) => ({fact,op:"eq",value});
const cmd = d => ({revision:1,label:d.id,costs:[],effects:[],...d});
const template = {id:"helper",revision:1,label:"Helper",provision:false,inventory:"simulation",worldId:"base.frontier",location:"Village",resources:{fuel:3},vitals:{health:10,max_health:10,stamina:5,max_stamina:5}};
const ctx = (p,extra={}) => ({actorId:"player",external:p.external,gameplay:p.gameplay,facts:{location:"Village","village.craftsmanMet":true},...extra});
const begin = r => enrollSimulation(createExpansionState(51),r,{actorId:"player",external:{money:30},gameplay:{player:{inventory:{[wood]:8},skills:{},reputation:{}}},facts:{location:"Village"}});
const command = (p,r,id,extra={}) => commitSimulationCommand(p.state,r,{id},ctx(p,extra));
const advance = (p,r,n) => advanceSimulation(p.state,r,n,p.external,p.gameplay);
const reload = (p,r) => ({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),r)});
const registry = d => createContentRegistry({worlds:[{id:"base.frontier"}],simulation:{people:[template],...d}});
const summon = cmd({id:"hire",effects:[{type:"spawn",definitionId:"helper",instanceKey:"new"},{type:"transfer",from:"$actor",to:"$spawn.new",key:wood,count:1}]});

test("repeatable actor creation binds distinct owners, freezes a delayed template and resumes birth once", () => {
    const r=registry({commands:[{...summon,duration:2}]});let p=command(begin(r),r,"hire");
    const job=p.state.simulation.jobs[0], id=job.effects[0].personId;
    assert.equal(p.state.simulation.people[id],undefined);
    assert.equal(job.effects[1].to,id);
    const newer=registry({people:[{...template,revision:2,resources:{fuel:999}}],commands:[{...summon,duration:2}]});
    p=advance(reload(p,newer),newer,2);assert.equal(p.state.actors[id].resources.fuel,3);assert.equal(p.state.simulation.owners[id][wood],1);
    p=command(p,newer,"hire");const second=p.state.simulation.jobs[0].effects[0].personId;assert.notEqual(second,id);
    p=advance(reload(p,newer),newer,2);assert.equal(p.state.actors[second].resources.fuel,999);assert.equal(p.gameplay.player.inventory[wood],6);
    p=advance(reload(p,newer),newer,5);assert.equal(Object.keys(p.state.simulation.owners).length,2);
});

test("unknown aliases and insufficient supplies reject the whole hire without a debit or actor", () => {
    const r=registry({commands:[{...summon,costs:[{type:"resource",native:true,key:"money",amount:-3}]},cmd({id:"bad",effects:[{type:"party",target:"$spawn.missing",operation:"join"}]})]});
    const p=begin(r);p.gameplay.player.inventory={};const before=structuredClone(p);
    assert.equal(previewSimulationCommand(p.state,r,"hire",ctx(p)).eligible,false);
    assert.throws(()=>command(p,r,"hire"),/Insufficient/);assert.deepEqual(p,before);
    assert.throws(()=>command(p,r,"bad"),/before referring/);assert.deepEqual(p,before);
});

test("NPC responses use real means, skip unaffordable priorities and persist a turn across reload", () => {
    const r=registry({people:[{...template,provision:true}],commands:[cmd({id:"scene",actorDefinitionId:"helper",once:true,encounterId:"crossing"})],
        encounters:[{id:"crossing",revision:1,label:"Crossing",lethal:false,turns:[{cue:"Pick footing",responses:[{id:"waste",costs:[{type:"resource",key:"fuel",amount:-99}]},{id:"care",costs:[{type:"resource",key:"fuel",amount:-1}]}]},
            {cue:"Continue",responses:[{id:"finish",costs:[{type:"vital",key:"stamina",amount:-1}]}]}],settlement:[{type:"resource",key:"proof",amount:1}]}],
        controllers:[{id:"control",revision:1,label:"Plan",actorId:"helper",interval:1,actions:[{kind:"encounter",encounterId:"crossing",responseId:"waste",priority:4},
            {kind:"encounter",encounterId:"crossing",responseId:"care",priority:3},{kind:"encounter",encounterId:"crossing",responseId:"finish",priority:2},{commandId:"scene",priority:1}]}]});
    let p=advance(begin(r),r,2);assert.equal(p.state.simulation.sessions.helper.turn,1);assert.equal(p.state.actors.helper.resources.fuel,2);
    const snapshot=structuredClone(p);const preview=previewSimulationResponse(p.state,r,{kind:"encounter",responseId:"finish"},ctx(p,{actorId:"helper"}));assert.equal(preview.eligible,true);assert.deepEqual(p,snapshot);
    p=advance(reload(p,r),r,3);assert.equal(p.state.simulation.sessions.helper,undefined);assert.equal(p.state.actors.helper.resources.proof,1);assert.equal(p.state.simulation.people.helper.vitals.stamina,4);
    assert.equal(p.state.actors.helper.completed.scene,1);assert.equal(p.state.simulation.controllers.control.lastAction.kind,"encounter");
});

test("encounter success settles its claim once; withdrawal frees the claim while retaining spent means", () => {
    const r=registry({commands:[cmd({id:"scene",encounterId:"talk",claim:"appointment",once:true,costs:[{type:"resource",native:true,key:"money",amount:-1}]})],
        encounters:[{id:"talk",revision:1,label:"Talk",lethal:false,turns:[{cue:"Reply",responses:[{id:"yes"}]}],settlement:[]}]});
    let p=command(begin(r),r,"scene");p=withdrawSimulationEncounter(p.state,ctx(p));assert.equal(p.external.money,29);assert.equal(p.state.simulation.claims.appointment,undefined);
    p=command(p,r,"scene");p=answerSimulationEncounter(p.state,r,"yes",ctx(p));assert.equal(p.state.simulation.claims.appointment.status,"settled");
    assert.throws(()=>command(p,r,"scene"),/already/);
});

test("dynamic outcome weights and effects share the pre-cost snapshot; inspection never draws", () => {
    const r=registry({commands:[cmd({id:"resolve",costs:[{type:"resource",native:true,key:"money",amount:-5}],outcomes:[
        {id:"none",weight:0,effects:[{type:"resource",key:"impossible",amount:-999}]},
        {id:"paid",weight:{fact:"resource.focus"},effects:[{type:"resource",key:"credit",amount:{fact:"resource.focus"}}]}]})]});
    let p=begin(r);p.state.actors.player.resources.focus=3;const snapshot=structuredClone(p);
    for(let i=0;i<5;i++) assert.deepEqual(previewSimulationCommand(p.state,r,"resolve",ctx(p)).weights,[0,3]);assert.deepEqual(p,snapshot);
    p=command(p,r,"resolve");assert.equal(p.state.actors.player.resources.credit,3);assert.equal(p.external.money,25);
    const empty=begin(r);empty.state.actors.player.resources.focus=0;assert.throws(()=>command(empty,r,"resolve"),/No legal weighted/);
});

test("event guarantees count eligible misses; unmet conditions and open events do not consume attempts", () => {
    const r=registry({events:[{id:"find",revision:1,label:"Finding",automatic:true,public:true,interval:1,mode:"offer",lifetime:3,maxOccurrences:1,
        chance:{fact:"event.misses",scale:0,min:0,max:1},guaranteeAfter:3,requires:req("actor.ready",true),responses:[{id:"take",label:"Take"}]}]});
    let p=advance(begin(r),r,5);assert.equal(p.state.simulation.checks.find.attempts,undefined);
    p.state.actors.player.facts.ready=true;p=advance(p,r,2);assert.equal(p.state.simulation.checks.find.misses,2);
    assert.throws(()=>loadExpansionState({...p.state,simulation:{...p.state.simulation,checks:{find:{...p.state.simulation.checks.find,misses:-1}}}},r),/event check/);
    p=advance(reload(p,r),r,1);assert.equal(Object.keys(p.state.simulation.events).length,1);assert.equal(p.state.simulation.checks.find,undefined);
});

test("caused NPC occurrences bind independently and unknown events cannot be answered by controllers", () => {
    const schedule=cmd({id:"schedule",effects:[{type:"event",eventId:"offer",delay:1}]});
    const r=registry({people:[{...template,provision:true}],commands:[schedule],events:[{id:"offer",revision:1,label:"Hidden offer",interval:1,mode:"offer",lifetime:2,maxOccurrences:1,aware:false,chance:1,
        responses:[{id:"take",label:"Take",effects:[{type:"resource",key:"proof",amount:1}]}]}],
        controllers:[{id:"control",revision:1,label:"Plan",actorId:"helper",interval:1,actions:[{kind:"event",eventId:"offer",responseId:"take",priority:1}]}]});
    let p=command(begin(r),r,"schedule");p=command(p,r,"schedule",{actorId:"helper"});assert.equal(Object.keys(p.state.simulation.checks).length,2);
    assert.notEqual(...Object.values(p.state.simulation.checks).map(c=>c.rng));
    p=advance(p,r,3);assert.equal(Object.keys(p.state.simulation.events).length,2);assert.ok(Object.values(p.state.simulation.events).every(e=>e.status==="expired"));
    assert.equal(p.state.actors.helper.resources.proof,undefined);
});

test("simulated movement respects work occupancy and native travel stays bound to its host", () => {
    const r=registry({people:[{...template,provision:true}],commands:[cmd({id:"move",effects:[{type:"relocate",location:"Road"}]}),cmd({id:"work",duration:2})]});
    let p=command(begin(r),r,"move",{actorId:"helper"});assert.equal(p.state.simulation.people.helper.location,"Road");
    assert.throws(()=>command(p,r,"move"),/Native travel/);p=command(p,r,"work",{actorId:"helper"});assert.throws(()=>command(p,r,"move",{actorId:"helper"}),/Finish/);
});

test("two playable helpers finish independently and long advances match split/reloaded time", () => {
    const seed=begin(expeditionRegistry);seed.state=initializeExpedition(seed.state);seed.state.simulation.knowledge.player={workbench:{stage:"understood",value:"Measured work",at:0,cause:"test:known"}};
    let p=command(seed,expeditionRegistry,"village.hire_helper");p=command(p,expeditionRegistry,"village.hire_helper");
    const ids=Object.keys(p.state.simulation.people).filter(id=>id.startsWith("spawn:"));assert.equal(ids.length,2);
    const long=advance(p,expeditionRegistry,10);let split=p;for(let i=0;i<10;i++)split=advance(reload(split,expeditionRegistry),expeditionRegistry,1);
    assert.deepEqual(long.state,split.state);assert.deepEqual(long.gameplay,split.gameplay);
    for(const id of ids) {assert.equal(long.state.simulation.people[id].location,"Village");assert.equal(long.state.simulation.owners[id][kit],1);assert.equal(long.state.actors[id].resources.focus,1);assert.equal(long.state.simulation.people[id].vitals.stamina,2);}
    p=long;for(const id of ids)p=command(p,expeditionRegistry,"village.collect_helper",{targetId:id});
    assert.equal(p.gameplay.player.inventory[kit],2);assert.ok(ids.every(id=>p.state.simulation.people[id].life==="departed"));
    assert.throws(()=>command(p,expeditionRegistry,"village.collect_helper",{targetId:ids[0]}),/unavailable/);
});

test("a failed durable hire preserves native supplies and creates no live actor or debit", () => {
    const r=registry({commands:[{...summon,costs:[{type:"resource",native:true,key:"money",amount:-3}]}]});const old=begin(r),snapshot=structuredClone(old),p=command(old,r,"hire");
    const envelope={character:{money:30},inventories:{person:{main_character:{[wood]:{count:8}}}},levels:{person:{main_character:{}}},retired_content:{keep:true}};
    assert.throws(()=>persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),bindings:{player:{category:"person",id:"main_character"}},key:"test",storage:{setItem(){throw Error("quota");}}}),/quota/);assert.deepEqual(old,snapshot);
});

test("inactive actors retain their memories without empty clock work; explicit return resumes future decisions", () => {
    const r=registry({people:[{...template,provision:true}],commands:[cmd({id:"leave",effects:[{type:"life",actor:"helper",status:"departed",reason:"Contract finished"}]}),
        cmd({id:"return",effects:[{type:"life",actor:"helper",status:"alive",reason:"A new authored visit"}]})],controllers:[{id:"control",revision:1,label:"Idle plan",actorId:"helper",interval:1,actions:[]}]});
    let p=command(begin(r),r,"leave");p=advance(p,r,5000);assert.equal(p.remaining,0);assert.equal(p.budgetExhausted,false);assert.equal(p.state.clock,5000);
    p=reload(p,r);assert.equal(p.state.simulation.people.helper.life,"departed");p=command(p,r,"return");assert.equal(p.state.simulation.controllers.control.due,5001);
    p=advance(p,r,1);assert.equal(p.state.simulation.controllers.control.due,5002);
});

test("an NPC's private event response remains saved without disclosing its label to the player's history", () => {
    const r=registry({people:[{...template,provision:true}],commands:[cmd({id:"schedule",effects:[{type:"event",eventId:"private_offer"}]})],
        events:[{id:"private_offer",revision:1,label:"An undisclosed finding",interval:1,mode:"offer",lifetime:3,maxOccurrences:1,aware:true,chance:1,
            responses:[{id:"take",label:"Accept the finding",effects:[{type:"resource",key:"proof",amount:1}]}]}],
        controllers:[{id:"control",revision:1,label:"Plan",actorId:"helper",interval:1,actions:[{kind:"event",eventId:"private_offer",responseId:"take",priority:1}]}]});
    let p=command(begin(r),r,"schedule",{actorId:"helper"});p=advance(p,r,1);const e=Object.values(p.state.simulation.events)[0];
    assert.equal(e.status,"resolved");assert.equal(e.response.id,"take");assert.equal(p.state.actors.helper.resources.proof,1);
    assert.equal(p.state.simulation.log.some(e=>e.text.includes("undisclosed") || e.text.includes("Accept the finding")),false);
    p=reload(p,r);assert.deepEqual(Object.values(p.state.simulation.events)[0].response,e.response);
});
