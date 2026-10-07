import test from "node:test";
import assert from "node:assert/strict";
import {eventFeed} from "../src/event_feed.js";
import {createExpansionState, commitAction, advanceSimulation} from "../src/expansion_engine.js";
import {initializeExpedition, expeditionRegistry as registry} from "../src/expedition_content.js";
import {createChronicle, advanceChronicle, commandChronicle} from "../src/chronicle.js";

const fresh = () => initializeExpedition(createExpansionState(7));
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};

test("Events does not enroll a fresh game or expose frozen results", () => {
    const state=fresh();
    assert.deepEqual(eventFeed(state,registry),{leads:[],news:[]});
    const plan=commitAction(state,registry,"village.waypost",{actorId:"player",worldId:"base.frontier",external:{money:10},
        facts:{location:"Village","village.elderMet":true,perception:0},gameplay:{player:{inventory:{},
            skills:{Perception:{xp:0,parent:null,enabled:true}},reputation:{Village:0}}}});
    const before=structuredClone(plan.state);
    assert.equal(eventFeed(plan.state,registry).news.length,0);
    assert.deepEqual(plan.state,before);
    const done=advanceSimulation(plan.state,registry,3,plan.external,plan.gameplay).state;
    assert.ok(eventFeed(done,registry).news.some(m=>m.text.includes("waypost")));
});

test("invitations open on their deadlines; missed details require actually hearing the report", () => {
    let state=fresh(); state.chronicle=createChronicle(0,calendar);
    assert.equal(eventFeed(state,registry).leads.find(e=>e.id==="chronicle:cartographer").available,false);
    state.clock=10; state.chronicle=advanceChronicle(state.chronicle,10);
    assert.equal(eventFeed(state,registry).leads.find(e=>e.id==="chronicle:cartographer").control,"attend");
    state.clock=47; state.chronicle=advanceChronicle(state.chronicle,47);
    assert.ok(!eventFeed(state,registry).leads.some(e=>e.id==="chronicle:reports"));
    state.clock=48; state.chronicle=advanceChronicle(state.chronicle,48);
    const feed=eventFeed(state,registry);
    assert.ok(feed.leads.some(e=>e.id==="chronicle:reports"));
    assert.ok(!JSON.stringify(feed).includes("visiting group has already departed"));
    state=commandChronicle(state,{type:"hear"},{location:"Village"}).state;
    assert.ok(eventFeed(state,registry).news.some(m=>m.text.includes("visiting group has already departed")));
    assert.ok(!eventFeed(state,registry).leads.some(e=>e.id==="chronicle:reports"));
});

test("only discovered local occurrences and agreed commissions reach Events", () => {
    const state=fresh();
    state.actors.peer={worldId:"base.frontier",facts:{"helper.ready":true}};
    state.actors.remote={worldId:"other",facts:{}};
    const occurrence=(id,actorId,discoveredBy)=>({id,actorId,discoveredBy,at:0,status:"open",mode:"offer",expiresAt:10,label:id,responses:[{id:"wait"}]});
    state.simulation={events:{hidden:occurrence("hidden","peer",["peer"]),known:occurrence("known","player",["player"]),
        remote:occurrence("remote","remote",["player"])},log:[{at:0,text:"Secret NPC aftermath"}],people:{
        peer:{createdBy:"someoneElse",life:"alive",location:"Village"}}};
    let feed=eventFeed(state,registry);
    assert.deepEqual(feed.leads.map(e=>e.id),["simulation:known"]);
    assert.ok(!JSON.stringify(feed).includes("Secret NPC"));
    state.simulation.people.peer.createdBy="player";
    assert.ok(!eventFeed(state,registry,{location:"Forest road"}).leads.some(e=>e.id==="work:peer"));
    feed=eventFeed(state,registry,{location:"Village"});
    assert.ok(feed.leads.some(e=>e.id==="work:peer"));
    state.simulation.people.peer.life="departed";
    assert.ok(!eventFeed(state,registry,{location:"Village"}).leads.some(e=>e.id==="work:peer"));
});

test("departure and recent news are bounded, read-only projections of saved records", () => {
    const state=fresh();state.clock=20;
    state.opportunities.departure={definitionId:"frontier.departure",context:{actorId:"player",worldId:"base.frontier"},status:"available",due:15,expires:25};
    state.history=Array.from({length:20},(_,i)=>({id:`event:${i}`,actionId:"frontier.inspect",actorId:"player",at:i,label:`Observed ${i}`}));
    const before=structuredClone(state), feed=eventFeed(state,registry);
    assert.equal(feed.leads[0].control,"frontier.depart");assert.equal(feed.news.length,8);assert.equal(feed.news[0].text,"Observed 19");
    assert.deepEqual(state,before);
    assert.deepEqual(eventFeed(structuredClone(state),registry),feed);
    state.opportunities.departure.status="expired";
    assert.ok(eventFeed(state,registry).news.some(m=>m.text.includes("earlier survey rewards remain")));
});
