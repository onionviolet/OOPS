import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState,advanceSimulation,loadExpansionState,validateExpansionState} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry as registry} from "../src/expedition_content.js";
import {beginPromiseVisitor,promiseView,promiseId,visitorId,promiseDefinitions} from "../src/promise_content.js";
import {commitSimulationCommand,previewSimulationCommand,enrollSimulation,cancelSimulationJob} from "../src/simulation.js";
import {knownPeopleView} from "../src/people_knowledge.js";
import {eventFeed} from "../src/event_feed.js";
import {persistExpansionPlan} from "../src/expansion_persistence.js";
const wood=JSON.stringify({id:"Rough wood log"});
const fixture=()=>({state:initializeExpedition(createExpansionState(73)),external:{money:10},gameplay:{player:{inventory:{[wood]:3},skills:{},reputation:{}}}});
const context=p=>({actorId:"player",targetId:visitorId,facts:{location:"Village","village.elderMet":true,strength:12},external:p.external,gameplay:p.gameplay,
    vitals:{player:{health:30,max_health:30,stamina:30-(p.native?.staminaToFull || 0),max_stamina:30}}});
const begin=(p=fixture())=>beginPromiseVisitor(p.state,registry,context(p));
const command=(p,id,extra={})=>commitSimulationCommand(p.state,registry,{id}, {...context(p),targetId:registry.simulation.commands.get(id).targetId || null,...extra});
const advance=(p,n)=>advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:context(p)});
const reload=p=>({...structuredClone(p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry))});
const situation=p=>p.state.simulation.situations[promiseId];

test("introduction separates private truth, recollection and each observer, with read-only menus",()=>{
    const old=fixture(),p=begin(old),before=structuredClone(p);
    assert.equal(old.state.simulation,null);assert.equal(p.state.simulation.schema,3);
    assert.deepEqual(situation(p).privateTruth,{explanation:"identification_mistake",actualPromisor:"Rowan",playerMadePromise:false});
    assert.equal(p.state.simulation.knowledge.player["promise.claim"].basis.kind,"recollection");
    assert.equal(p.state.simulation.knowledge[visitorId]["promise.belief"].basis.kind,"inference");
    for(let i=0;i<3;i++){promiseView(p.state);knownPeopleView(p.state);eventFeed(p.state,registry,{location:"Village"});previewSimulationCommand(p.state,registry,"promise.help",context(p));}
    assert.deepEqual(p,before);
    const shown=JSON.stringify([promiseView(p.state),knownPeopleView(p.state),eventFeed(p.state,registry,{location:"Village"})]);
    assert.doesNotMatch(shown,/Rowan|identification_mistake|playerMadePromise|frontier\.branch|frontier\.present/);
    assert.deepEqual(p.state.simulation.claims,{});assert.equal(p.external.money,10);
});

test("inspection reveals a discrepancy, revises the NPC's plan through paid evidence and preserves the old memory",()=>{
    let p=begin(),id=p.state.simulation.people[visitorId].bornAt;
    p=command(p,"promise.investigate");assert.deepEqual(p.state.simulation.jobs[0].participants,["player",visitorId]);
    p=reload(p);p=advance(p,2);assert.equal(situation(p).phase,"investigated");
    assert.match(p.state.simulation.knowledge.player["promise.slip"].value,/Rowan/);
    assert.equal(p.state.actors[visitorId].resources.coins,1);
    assert.doesNotMatch(JSON.stringify(promiseView(p.state)),/keeper confirmed|mistook you/);
    p=advance(reload(p),3);assert.equal(situation(p).phase,"evidence_ready");
    assert.equal(eventFeed(p.state,registry,{location:"Village"}).leads.some(e=>e.id === "promise:meeting"),true);
    p=command(p,"promise.meet_evidence");p=reload(p);
    assert.equal(situation(p).phase,"met_evidence");assert.match(p.state.simulation.knowledge.player["promise.later"].value,/mistook you/);
    assert.match(p.state.simulation.knowledge[visitorId]["promise.memory"].value,/remember/);
    assert.equal(p.state.simulation.people[visitorId].bornAt,id);assert.equal(p.gameplay.player.inventory[wood],3);
    assert.equal(p.external.money,10);assert.deepEqual(p.state.simulation.claims,{});
});

test("bounded help spends native stock/stamina once and produces a different next meeting without solving identity",()=>{
    let p=begin();p=command(p,"promise.help");
    assert.equal(p.gameplay.player.inventory[wood],2);assert.equal(p.native.staminaToFull,4);
    assert.equal(p.state.simulation.owners[visitorId][wood],1);
    p=advance(reload(p),3);assert.equal(p.state.simulation.owners[visitorId][wood],undefined);
    p=advance(p,3);assert.equal(situation(p).phase,"help_ready");assert.equal(p.state.simulation.people[visitorId].vitals.stamina,8);
    p=command(p,"promise.meet_help");
    assert.match(p.state.simulation.knowledge.player["promise.later"].value,/brace held/);
    assert.doesNotMatch(JSON.stringify(promiseView(p.state)),/Rowan|mistook you/);
    assert.equal(p.state.actors[visitorId].resources.coins,2);
    const before=structuredClone(p);assert.throws(()=>command(p,"promise.meet_help"),/missing|hidden|completed/i);assert.deepEqual(p,before);
    assert.throws(()=>begin(p),/completed|duplicate|already/i);
});

test("silence and refusal create no obligation; the visitor pays from her own purse",()=>{
    for(const route of ["declined","unanswered"]){
        let p=begin();if(route === "declined")p=command(p,"promise.decline");
        p=advance(reload(p),route === "declined" ? 4 : 11);
        assert.equal(situation(p).phase,route+"_ready");assert.equal(p.state.actors[visitorId].resources.coins,1);
        assert.equal(p.external.money,10);assert.equal(p.gameplay.player.inventory[wood],3);
        assert.deepEqual(p.state.simulation.claims,{});assert.equal(p.state.simulation.knowledge.player["promise.repair"],undefined);
        assert.equal(p.state.simulation.log.filter(e=>e.text.includes("Tamsin pays")).every(e=>e.audience?.includes(visitorId)),true);
        p=command(p,"promise.meet_"+route);assert.match(p.state.simulation.knowledge.player["promise.later"].value,/no agreement|no promise/i);
    }
});

test("native attention, body, stock, custody, stale sequence and NPC means gate real actions",()=>{
    const p=begin(),before=structuredClone(p);
    for(const extra of [{busy:true},{vitals:{player:{health:1,max_health:30,stamina:30,max_stamina:30}}},{vitals:{player:{health:30,max_health:30,stamina:3,max_stamina:30}}}])
        assert.throws(()=>command(p,"promise.help",extra),/activity|missing|Insufficient/i);
    const empty=structuredClone(p);empty.gameplay.player.inventory={};assert.throws(()=>command(empty,"promise.help"),/Insufficient|enough|Missing/i);
    const loan=structuredClone(p);loan.state.simulation.custody.loan={owner:visitorId,holder:"player",key:wood,count:1,at:0,cause:"test:loan"};
    assert.throws(()=>command(loan,"promise.help"),/Borrowed|custody/i);
    assert.throws(()=>commitSimulationCommand(p.state,registry,{id:"promise.help"},context(p),0),/stale/i);
    assert.deepEqual(p,before);
    let broke=command(p,"promise.investigate");broke.state.actors[visitorId].resources.coins=0;broke=advance(broke,8);
    assert.equal(situation(broke).phase,"investigated");assert.equal(broke.state.simulation.jobs.length,0);
    let late=advance(begin(),7);late=command(late,"promise.help");late=advance(late,6);assert.equal(situation(late).phase,"help_ready");
});

test("legacy opt-in, frozen context, reload timing and invalid records preserve compatibility",()=>{
    let legacy=fixture();legacy=enrollSimulation(legacy.state,registry,{...context(legacy),targetId:null});
    for(const schema of [1,2]){const s=structuredClone(legacy);s.state.simulation.schema=schema;const loaded=reload(s);assert.equal(loaded.state.simulation.situations,undefined);assert.equal(loaded.state.simulation.people[visitorId],undefined);assert.equal(loaded.state.simulation.schema,schema);}
    let p=command(begin(legacy),"promise.help"),long=advance(p,7),split=p;
    for(let i=0;i<7;i++)split=advance(reload(split),1);
    assert.deepEqual(long.state,split.state);assert.deepEqual(long.gameplay,split.gameplay);
    const revised=structuredClone(promiseDefinitions);revised.situations[0].privateTruth.explanation="different";revised.situations[0].context.eraId="other.era";
    const r={...registry,simulation:{...registry.simulation,situations:new Map([[promiseId,revised.situations[0]]])}};
    assert.deepEqual(loadExpansionState(p.state,r).simulation.situations[promiseId],situation(p));
    for(const mutate of [s=>s.simulation.schema=2,s=>s.simulation.situations[promiseId].phase="met_help",s=>s.simulation.knowledge.player["promise.claim"].basis.attributedTo="absent",s=>s.simulation.situations[promiseId].receipts[0].cause="wrong"]){
        const bad=structuredClone(p.state);mutate(bad);assert.throws(()=>validateExpansionState(bad,registry));
    }
});

test("failed publication of introduction, paid commitment or aftermath keeps exact old bytes and live owners",()=>{
    const seed=fixture(),introduced=begin(seed),job=command(introduced,"promise.help"),ready=advance(job,6),met=command(ready,"promise.meet_help");
    for(const [old,plan] of [[seed,introduced],[introduced,job],[ready,met]]){
        const before=structuredClone(old),envelope={character:{money:old.external.money},inventories:{person:{main_character:{[wood]:{count:old.gameplay.player.inventory[wood]}}}},levels:{person:{main_character:{}}},retired_content:{keep:true},expansion:old.state};
        let bytes=JSON.stringify(envelope);const original=bytes;
        assert.throws(()=>persistExpansionPlan(plan,{createSave:()=>bytes,bindings:{player:{category:"person",id:"main_character"}},key:"test",storage:{setItem(){throw Error("quota");}}}),/quota/);
        assert.equal(bytes,original);assert.deepEqual(old,before);
        persistExpansionPlan(plan,{createSave:()=>bytes,bindings:{player:{category:"person",id:"main_character"}},key:"test",storage:{setItem(k,v){bytes=v;}}});
        const saved=JSON.parse(bytes);assert.deepEqual(saved.expansion,plan.state);assert.deepEqual(saved.retired_content,{keep:true});
    }
});


test("a recalled recipe cannot substitute for taught control, body capacity, fuel or owned stock",()=>{
    let p=command(advance(command(begin(),"promise.help"),6),"promise.meet_help");
    p=command(p,"promise.hear_bracing");assert.equal(p.state.simulation.knowledge.player["promise.bracing_report"].basis.kind,"recollection");
    assert.equal(p.state.actors.player.sources["promise.bracing_control"],undefined);assert.throws(()=>command(p,"promise.pack_brace"),/missing|hidden/i);
    p=advance(command(p,"promise.lesson"),2);p=reload(p);
    assert.equal(p.state.actors.player.sources["promise.bracing_control"].origin,"trained");assert.equal(p.state.simulation.knowledge.player["promise.bracing"].basis.kind,"instruction");
    const noSource=structuredClone(p);delete noSource.state.actors.player.sources["promise.bracing_control"];delete noSource.state.simulation.faculties.player["promise.bracing_control"];
    assert.throws(()=>command(noSource,"promise.pack_brace"),/missing/i);
    const recalled=structuredClone(p);recalled.state.simulation.knowledge.player["promise.bracing"].basis.kind="recollection";assert.throws(()=>command(recalled,"promise.pack_brace"),/missing/i);
    const suppressed=structuredClone(p);suppressed.state.simulation.faculties.player["promise.bracing_control"].suppressed=true;assert.throws(()=>command(suppressed,"promise.pack_brace"),/missing/i);
    assert.throws(()=>command(p,"promise.pack_brace",{facts:{...context(p).facts,strength:5}}),/missing/i);
    const reserved=command(p,"promise.pack_brace"),returned=cancelSimulationJob(reserved.state,registry,reserved.state.simulation.jobs.find(j=>j.actorId === "player").id,context(reserved));
    assert.deepEqual(returned.gameplay,p.gameplay);assert.equal(returned.native.staminaToFull,p.native?.staminaToFull || 0);
    const kit=JSON.stringify({id:"Prepared survey kit"});
    for(let i=0;i<2;i++){p=command(p,"promise.pack_brace");p=advance(reload(p),2);}
    assert.equal(p.gameplay.player.inventory[kit],2);assert.equal(p.gameplay.player.inventory[wood],undefined);
    assert.throws(()=>command(p,"promise.pack_brace"),/Insufficient|enough|Missing/i);
});
