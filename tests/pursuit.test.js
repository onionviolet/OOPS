import test from "node:test";
import assert from "node:assert/strict";
import {createContentRegistry,advanceSimulation,loadExpansionState} from "../src/expansion_engine.js";
import {expeditionRegistry as registry} from "../src/expedition_content.js";
import {commitSimulationCommand,answerSimulationEncounter,withdrawSimulationEncounter,previewSimulationCommand,simulationOccupiesActor} from "../src/simulation.js";
import {recordPursuitDeparture,pursuitView} from "../src/pursuit.js";
import {eventFeed} from "../src/event_feed.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
import {joinField,fieldCommand,fieldContext,fieldReload,completeFieldProject} from "../scripts/field_fixtures.mjs";
const trail="village.trail_test",marked="village.ink_test",writ="village.heavenly_summons",review="village.workshop_review";
const advance=(p,n,location="Village",busy=false)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{facts:{location},busy,vitals:fieldContext(p).vitals.player}});
const started=(command="pursuit.begin")=>fieldCommand(joinField(),command);
test("previews of unintroduced encounter participants stay unavailable without throwing or enrolling them",()=>{
    const p=joinField(),before=structuredClone(p.state);
    for(const [command,targetId] of [["pursuit.spar","routeApprentice"],["marked.accept","inkTracker"],["writ.accept","writEnvoy"]])assert.equal(previewSimulationCommand(p.state,registry,command,fieldContext(p,"Village",{targetId})).eligible,false);
    assert.deepEqual(p.state,before);
});
const accept=(p,id=trail,location="Village",extra={})=>{const d=p.state.simulation.pursuits[id];return commitSimulationCommand(p.state,registry,{id:d.policy.encounterCommand,requestId:d.request.id},fieldContext(p,location,{targetId:d.actorId,...extra}));};
test("optional pursuit upgrades only enrolled opt-in saves; old records load without pursuers or rewards",()=>{
    const p=joinField(),before=structuredClone(p.state);assert.equal(p.state.simulation.schema,1);assert.equal(p.state.simulation.pursuits,undefined);
    assert.deepEqual(fieldReload(p).state,before);const begun=fieldCommand(p,"pursuit.begin");assert.equal(begun.state.simulation.schema,2);assert.equal(p.state.simulation.schema,1);
    assert.equal(begun.state.actors.routeApprentice.resources.provisions,4);assert.equal(begun.state.simulation.pursuits[trail].spent,1);assert.equal(begun.external.money,p.external.money);
    assert.throws(()=>fieldCommand(begun,"pursuit.begin"),/already/);
    const downgraded=structuredClone(begun.state);downgraded.simulation.schema=1;assert.throws(()=>loadExpansionState(downgraded,registry),/schema2/);
});
test("witnesses supply specific leads; unobserved positions and unsupported routes do not direct a search",()=>{
    let p=started();const before=structuredClone(p.state);assert.equal(recordPursuitDeparture(p.state,"Elsewhere","Shack").changed,false);assert.deepEqual(p.state,before);
    p=advance(p,8,"Shack");assert.equal(p.state.simulation.pursuits[trail].status,"lost");assert.equal(p.state.simulation.people.routeApprentice.location,"Village");assert.equal(p.state.simulation.pursuits[trail].spent,2);
    assert.equal(pursuitView(p.state).status,"following");assert.doesNotMatch(eventFeed(p.state,registry,{location:"Shack"}).news.map(n=>n.text).join(" "),/trail went cold/);
    p=fieldCommand(p,"pursuit.report");assert.equal(pursuitView(p.state).status,"closed");assert.match(pursuitView(p.state).text,/trail went cold/);
});
test("paid movement freezes its destination; direct witnessed departure and sanctuary are meaningful",()=>{
    let p=started();p.state=recordPursuitDeparture(p.state,"Village","Shack").state;p=advance(p,3,"Shack");
    assert.equal(p.state.simulation.pursuits[trail].status,"moving");assert.equal(p.state.simulation.pursuits[trail].destination,"Shack");
    p=advance(fieldReload(p),4,"Shack");assert.equal(p.state.simulation.people.routeApprentice.location,"Shack");assert.equal(p.state.simulation.pursuits[trail].status,"sheltered");assert.equal(p.state.simulation.pursuits[trail].spent,3);assert.equal(p.state.simulation.pursuits[trail].request,undefined);
    p.state=recordPursuitDeparture(p.state,"Shack","Village").state;p=advance(p,6,"Village");assert.equal(p.state.simulation.pursuits[trail].status,"waiting");assert.equal(p.state.actors.routeApprentice.resources.provisions,0);
});
test("concealment consumes real stamina and paid time; the pursuer finishes the reserved leg then loses the trail",()=>{
    let p=fieldCommand(started(),"pursuit.conceal");assert.equal(p.native.staminaToFull,2);p=advance(p,4);assert.equal(p.state.simulation.pursuits[trail].status,"lost");
    assert.equal(recordPursuitDeparture(p.state,"Village","Shack").changed,false);assert.equal(p.state.actors.player.sources["frontier.trailcraft"],undefined);
});
test("split/reloaded advancement equals a single jump with frozen policy and supplies",()=>{
    const p=started();p.state=recordPursuitDeparture(p.state,"Village","Shack").state;
    const whole=advance(p,9,"Shack"),split=advance(fieldReload(advance(fieldReload(advance(p,2,"Shack")),3,"Shack")),4,"Shack");
    assert.deepEqual(split.state,whole.state);assert.deepEqual(split.gameplay,whole.gameplay);
    const simulation=Object.fromEntries(Object.entries(registry.simulation).filter(([,v])=>v instanceof Map).map(([k,v])=>[k,[...v.values()]]));simulation.onEnroll=registry.simulation.onEnroll;
    simulation.pursuits=simulation.pursuits.map(d=>({...d,revision:2,movementSupply:9}));
    const changed=createContentRegistry({worlds:[...registry.worlds.values()],sources:[...registry.sources.values()],capabilities:[...registry.capabilities.values()],simulation});
    const loaded=loadExpansionState(JSON.parse(JSON.stringify(p.state)),changed);assert.equal(loaded.simulation.pursuits[trail].policy.revision,1);assert.equal(loaded.simulation.pursuits[trail].policy.movementSupply,1);
});
test("a waiting request does not freeze native work; acceptance reserves both participants and blocks competing work",()=>{
    let p=advance(started(),4,"Village",true);assert.equal(p.state.simulation.pursuits[trail].status,"waiting");assert.equal(simulationOccupiesActor(p.state),false);assert.equal(simulationOccupiesActor(p.state,"routeApprentice"),true);
    assert.throws(()=>accept(p,trail,"Village",{busy:true}),/activity/);p=accept(p);assert.deepEqual(p.state.simulation.sessions.player.participants,["player","routeApprentice"]);assert.equal(simulationOccupiesActor(p.state),true);
    assert.equal(advance(p,20).state.clock,p.state.clock);assert.equal(previewSimulationCommand(p.state,registry,"field.learn_focus",fieldContext(p)).eligible,false);
    p=answerSimulationEncounter(fieldReload(p).state,registry,"ordinary",fieldContext(p));assert.equal(p.native.staminaToFull,3);assert.equal(p.state.simulation.pursuits[trail].status,"tested");assert.ok(p.state.actors.player.sources["frontier.trailcraft"]);assert.equal(simulationOccupiesActor(p.state),false);
    assert.throws(()=>answerSimulationEncounter(p.state,registry,"ordinary",fieldContext(p)),/No active/);
});
test("stale, remote and competing interception requests reject without costs; withdrawal closes once",()=>{
    let p=advance(started(),4);assert.throws(()=>commitSimulationCommand(p.state,registry,{id:"pursuit.spar",requestId:"old"},fieldContext(p,"Village",{targetId:"routeApprentice"})),/stale/);assert.throws(()=>accept(p,trail,"Shack"),/location|missing/);
    p=accept(p);p=withdrawSimulationEncounter(fieldReload(p).state,fieldContext(p));assert.equal(p.state.simulation.pursuits[trail].status,"withdrawn");assert.equal(p.state.actors.player.sources["frontier.trailcraft"],undefined);assert.equal(p.state.simulation.sessions.player,undefined);
});
test("a marked hunter uses an active faculty and specific target mark, not ordinary witness rules",()=>{
    let p=started("marked.begin");p=advance(p,4,"Shack");assert.equal(p.state.simulation.pursuits[marked].lead.location,"Shack");assert.equal(p.state.simulation.pursuits[marked].lead.source,"Sensed the agreed ink mark");
    p=advance(p,3,"Shack");assert.equal(p.state.simulation.pursuits[marked].status,"sheltered");
    p=fieldCommand(p,"marked.remove","Shack");p=advance(p,2,"Shack");assert.equal(p.state.simulation.faculties.player["frontier.ink_mark"].suppressed,true);
    const observation=p.state.simulation.pursuits[marked].lead.observedAt;p=advance(fieldReload(p),3,"Village");assert.equal(p.state.simulation.pursuits[marked].lead.location,"Shack");assert.equal(p.state.simulation.pursuits[marked].lead.observedAt,observation);
});
test("a fresh unchanged signature lead does not charge every polling tick",()=>{
    let p=advance(started("marked.begin"),7,"Shack");assert.equal(p.state.simulation.pursuits[marked].status,"sheltered");const spent=p.state.simulation.pursuits[marked].spent;
    p=advance(fieldReload(p),5,"Shack");assert.equal(p.state.simulation.pursuits[marked].status,"sheltered");assert.equal(p.state.simulation.pursuits[marked].spent,spent);
});
test("timed heavenly authority ignores cover, reaches any same-realm location and keeps its request until answered",()=>{
    let p=started("writ.begin");assert.equal(p.state.simulation.pursuits,undefined);p=advance(fieldReload(p),3,"Shack");assert.equal(p.state.simulation.pursuits,undefined);
    p=advance(p,3,"Shack",true);const d=p.state.simulation.pursuits[writ];assert.equal(d.status,"waiting");assert.equal(d.request.expiresAt,null);assert.equal(p.state.simulation.people.writEnvoy.location,"Shack");
    const request=d.request.id;p=advance(fieldReload(p),30,"Forest road",true);assert.equal(p.state.simulation.pursuits[writ].request.id,request);assert.equal(p.state.simulation.pursuits[writ].request.location,"Forest road");assert.equal(p.state.simulation.pursuits[writ].status,"waiting");
    assert.throws(()=>accept(p,writ,"Forest road",{busy:true}),/activity/);p=accept(p,writ,"Forest road");p=answerSimulationEncounter(p.state,registry,"explain",fieldContext(p,"Forest road"));assert.equal(p.state.simulation.pursuits[writ].status,"tested");assert.equal(p.state.actors.player.sources["frontier.trailcraft"],undefined);
});
test("scripted review waits for the actual workshop result, then starts once and survives reload",()=>{
    let p=started("review.begin");p=advance(p,10);assert.equal(p.state.simulation.pursuits,undefined);
    p=completeFieldProject(p);p=advance(fieldReload(p),3,"Shack");assert.equal(p.state.simulation.pursuits[review].status,"waiting");const id=p.state.simulation.pursuits[review].id;
    p=advance(fieldReload(p),10,"Shack");assert.equal(p.state.simulation.pursuits[review].id,id);assert.equal(Object.values(p.state.simulation.events).filter(e=>e.definitionId === "review.trigger").length,1);
});
test("two contacts can coexist, but only one encounter may reserve the player",()=>{
    let p=fieldCommand(started(),"marked.begin");p=advance(p,4);p=accept(p,trail);assert.throws(()=>accept(p,marked),/activity/);assert.equal(p.state.simulation.sessions.player.pursuitId,trail);
});
test("save failure preserves durable bytes and rejects schema downgrade and corrupt overlap",()=>{
    const before=started(),p=accept(advance(before,4)),envelope={character:{money:100},expansion:before.state,inventories:{person:{main_character:{},oldCraftsman:{}}},levels:{person:{main_character:{skill_xp:{}},oldCraftsman:{skill_xp:{}}}}};const bytes=JSON.stringify(envelope);let writes=0;
    assert.throws(()=>persistExpansionPlan(p,{createSave:()=>JSON.stringify(envelope),bindings:{player:{category:"person",id:"main_character"},oldCraftsman:{category:"person",id:"oldCraftsman"}},storage:{setItem(){writes++;throw Error("quota");}},key:"test"}),/quota/);assert.equal(writes,1);assert.equal(bytes,JSON.stringify(envelope));assert.equal(before.state.simulation.sessions.player,undefined);
    for(const mutate of [s=>s.simulation.pursuits[trail].due=-1,s=>s.simulation.pursuits[trail].lead.observedAt=s.clock+1,s=>s.simulation.pursuits[trail].policy.movementSupply=-1,s=>s.simulation.pursuits[trail].actorId="player"]){const bad=structuredClone(before.state);mutate(bad);assert.throws(()=>loadExpansionState(bad,registry));}
});

test("spatial cover (O2b): the Village well wall changes the footwork test's cost and leaves a position record; natural per-minute clock matches one jump",()=>{
    const natural=(p,n)=>{for(let i=0;i<n;i++)p=advance(p,1);return p;};
    const jump=advance(started(),4),stepped=natural(started(),4);
    assert.equal(stepped.state.simulation.pursuits[trail].status,"waiting");assert.equal(stepped.state.clock,jump.state.clock);
    assert.deepEqual(stepped.state.simulation.pursuits[trail].request,jump.state.simulation.pursuits[trail].request);
    // pacing envelope at the natural clock: request opens within 4 minutes of arranging and lapses 12 minutes after, with no input
    const reqAt=stepped.state.simulation.pursuits[trail].request.at,begun=stepped.state.simulation.pursuits[trail].startedAt;
    assert.ok(reqAt-begun<=4);assert.equal(natural(stepped,11).state.simulation.pursuits[trail].status,"waiting");assert.equal(natural(stepped,12).state.simulation.pursuits[trail].status,"declined");
    const open=answerSimulationEncounter(fieldReload(accept(stepped)).state,registry,"ordinary",fieldContext(accept(stepped)));
    const cover=answerSimulationEncounter(fieldReload(accept(stepped)).state,registry,"cover",fieldContext(accept(stepped)));
    assert.equal(open.native.staminaToFull,3);assert.equal(cover.native.staminaToFull,1);
    assert.equal(cover.state.simulation.pursuits[trail].status,"tested");assert.match(cover.state.simulation.knowledge.player["pursuit.position"].value,/well wall/);
    assert.equal(open.state.simulation.knowledge.player["pursuit.position"],undefined);
});
