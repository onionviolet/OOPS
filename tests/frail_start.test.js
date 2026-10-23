import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState,loadExpansionState,advanceSimulation,inspectCapabilities} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry} from "../src/expedition_content.js";
import {commitSimulationCommand,enrollSimulation} from "../src/simulation.js";
import {bodyFacts,FRAIL_FRAME,STEADY_FRAME} from "../src/body_progression.js";
import {characterBioView} from "../src/character_bio.js";

const bread=JSON.stringify({id:"Stale bread"});
const skill={xp:0,enabled:true,parent:null};
const actor=inventory=>({inventory,skills:{Running:{...skill},Climbing:{...skill}},reputation:{Village:0,Town:0}});
const base=()=>({state:initializeExpedition(createExpansionState(23)),external:{money:0},gameplay:{player:actor({[bread]:3})},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
const ctx=p=>({actorId:"player",worldId:"base.frontier",external:p.external,gameplay:p.gameplay,vitals:p.vitals,facts:{location:"Village",agility:8,strength:0,...bodyFacts(p.state)}});
const act=(p,id)=>{const c=ctx(p);return commitSimulationCommand(p.state,expeditionRegistry,{id},c);};
const merge=(p,plan)=>({...p,...plan,state:plan.state});
const advance=(p,m)=>({...advanceSimulation(p.state,expeditionRegistry,m,p.external,p.gameplay,{player:{vitals:p.vitals.player}}),vitals:structuredClone(p.vitals)});
const finish=p=>advance(p,p.state.simulation.jobs.find(j=>j.actorId==="player").due-p.state.clock);
const start=()=>{const p=base(),e=enrollSimulation(p.state,expeditionRegistry,ctx(p));
    const q={...p,state:e.state,external:e.external||p.external,gameplay:e.gameplay||p.gameplay};return act(q,"body.start_frail");};
const bio=p=>characterBioView({state:p.state,registry:expeditionRegistry,context:ctx(p)});

test("frail start is a stated acquired trait plus a food-gated Underfed condition, with a route to a first win",()=>{
    let p=start();assert.equal(p.state.actors.player.sources[FRAIL_FRAME].origin,"acquired");
    let b=bio(p);assert.deepEqual(b.learned.map(r=>r.id),[FRAIL_FRAME]);assert.match(b.learned[0].cause,/hungry winter/);assert.deepEqual(b.conditions.map(r=>r.id),["body.underfed"]);
    assert.throws(()=>act(p,"body.steady_walk"),/missing/);assert.throws(()=>act(p,"body.grip_drill"),/missing/);
    p=finish(act(p,"body.eat_meal"));assert.equal(bio(p).conditions.length,0);
    for(let i=0;i<3;i++)p=finish(act(p,"body.steady_walk"));
    assert.equal(inspectCapabilities(p.state,expeditionRegistry,ctx(p))["frontier.carry"]?.value??0,0);
    p=act(p,"body.settle_frame");
    assert.equal(inspectCapabilities(p.state,expeditionRegistry,ctx(p))["frontier.carry"].value,1);
    assert.ok(bio(p).learned.some(r=>r.id===STEADY_FRAME));
    const loaded={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry)};
    assert.deepEqual(bio(loaded),bio(p));
});

test("the self-description is derived from state: it changes with food and training and reload reproduces it",()=>{
    let p=start();const text=q=>bio(q).description.map(r=>r.detail).join("|");
    assert.match(text(p),/thin, narrow/);assert.match(text(p),/pinched/);
    const first=text(p);p=finish(act(p,"body.eat_meal"));assert.doesNotMatch(text(p),/pinched/);assert.notEqual(text(p),first);
    for(let i=0;i<3;i++)p=finish(act(p,"body.steady_walk"));p=act(p,"body.settle_frame");
    assert.match(text(p),/easy stride/);assert.doesNotMatch(text(p),/thin, narrow/);
    assert.equal(bio(p).description.filter(r=>r.id==="look.build").length,1);
    const before=structuredClone(p.state),loaded={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry)};
    assert.equal(text(loaded),text(p));assert.deepEqual(p.state,before);
});
test("an unawakened or absent source adds no description line",()=>{
    const p=base();assert.deepEqual(bio(p).description,[]);
    p.state.actors.player.sources["body.natural_balance"]={receiptId:"e:1",revision:1,acquiredAt:0,expiresAt:null,origin:"inherited"};
    assert.deepEqual(bio(p).description,[]);
});

test("a replaced trait fades with its reason stated, and a concealed look appears only when revealed",()=>{
    let p=start();p=finish(act(p,"body.eat_meal"));
    assert.deepEqual(bio(p).faded,[]);
    for(let i=0;i<3;i++)p=finish(act(p,"body.steady_walk"));p=act(p,"body.settle_frame");
    const b=bio(p);assert.deepEqual(b.faded.map(r=>r.id),[FRAIL_FRAME]);assert.match(b.faded[0].cause,/replaced by Steadier frame/);
    assert.equal(b.learned.some(r=>r.id===FRAIL_FRAME),false);assert.equal(b.learned.some(r=>r.id===STEADY_FRAME),true);
    const loaded={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry)};assert.deepEqual(bio(loaded).faded,b.faded);
    const registry={...expeditionRegistry,sources:new Map([...expeditionRegistry.sources].map(([k,v])=>[k,k===STEADY_FRAME?{...v,look:{...v.look,concealed:true}}:v]))};
    const show=r=>characterBioView({state:p.state,registry,context:ctx(p),reveal:r}).description.map(x=>x.detail).join("|");
    assert.doesNotMatch(show([]),/easy stride/);assert.match(show([STEADY_FRAME]),/easy stride/);
});
