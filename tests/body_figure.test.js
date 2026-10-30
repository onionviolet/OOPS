import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState,advanceSimulation} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry} from "../src/expedition_content.js";
import {commitSimulationCommand} from "../src/simulation.js";
import {beginBodyRecord,bodyFacts,bodyConditions} from "../src/body_progression.js";
import {bodyFigureSpec,channelFigureSpec,secondBodyFigureSpec} from "../src/body_figure.js";
import {figureText,validateFigureSpec} from "../src/ui/figure.js";
import {BODY_FIXTURES} from "../src/ui/preview/fixtures/body.js";
import {createDom} from "../scripts/headless/dom.mjs";

const actor=()=>({inventory:{},skills:{Climbing:{xp:0,enabled:true,parent:null}},reputation:{Village:0,Town:0}});
const fresh=()=>({state:initializeExpedition(createExpansionState(17)),external:{money:20},gameplay:{player:actor()},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}});
const context=(p,frail)=>({actorId:"player",worldId:"base.frontier",external:p.external,gameplay:p.gameplay,vitals:p.vitals,
    facts:{location:"Village","village.elderMet":true,...(p.state.simulation?bodyFacts(p.state):{})},frail});
const begin=(frail=false)=>{const p=fresh();return {...p,...beginBodyRecord(p.state,expeditionRegistry,context(p),frail)};};
const advance=(p,minutes)=>({...p,...advanceSimulation(p.state,expeditionRegistry,minutes,p.external,p.gameplay,{player:{vitals:p.vitals.player}})});
const drill=p=>{const q={...p,...commitSimulationCommand(p.state,expeditionRegistry,{id:"body.grip_drill"},context(p))};return advance(q,q.state.simulation.jobs[0].due-q.state.clock);};
const node=(spec,slot)=>spec.nodes.find(n=>n.id===`region-${slot}`);
const plain=spec=>JSON.parse(JSON.stringify(spec,(k,v)=>k==="effect"?undefined:v));

test("no body record means no figure; a fresh record shows a settled body",()=>{
    assert.equal(bodyFigureSpec(fresh().state),null);
    const spec=bodyFigureSpec(begin().state);validateFigureSpec(spec);
    assert.deepEqual(spec.nodes.map(n=>n.id),["region-bearing","region-build","region-hands","region-skin"]);
    assert.ok(spec.nodes.every(n=>!n.state&&!n.effect));assert.match(spec.summary,/Nothing is troubling/);assert.equal(spec.tracks.length,0);
});

test("a finished grip drill puts soreness on the hands with time left and the next milestone",()=>{
    let p=drill(begin());const spec=bodyFigureSpec(p.state);
    assert.equal(node(spec,"hands").state,"strained");assert.equal(node(spec,"hands").effect,"pulse");
    assert.match(figureText(spec),/Sore hands \(hands, 12 min left\)/);
    assert.deepEqual(spec.tracks[0].steps.map(s=>s.state),["done","current","pending"]);
    p=advance(p,12);const healed=bodyFigureSpec(p.state);
    assert.equal(node(healed,"hands").state,undefined);assert.doesNotMatch(figureText(healed),/Sore hands/);
});

test("a hidden condition stays off the figure until it is showable (BHR6)",()=>{
    const p=drill(begin()),hidden=bodyFigureSpec(p.state,{conditions:bodyConditions.map(c=>({...c,bioVisible:false}))});
    assert.equal(node(hidden,"hands").state,undefined);assert.doesNotMatch(figureText(hidden),/Sore hands/);
});

test("a frail start shows underfed on the bearing and the frail build as a lasting change",()=>{
    const spec=bodyFigureSpec(begin(true).state),text=figureText(spec);
    assert.equal(node(spec,"bearing").state,"strained");assert.equal(node(spec,"build").state,"filled");
    assert.match(text,/Underfed \(face and bearing, until treated\)/);assert.match(text,/Frail frame \(build, acquired\)/);
});

test("effects carry no facts: the text form is identical with every effect removed (UR38)",()=>{
    for(const spec of BODY_FIXTURES){validateFigureSpec(spec);assert.equal(figureText(plain(spec)),figureText(spec));}
});

test("channels stay unknown until measured; the second body appears only while a face is borrowed",()=>{
    const unknown=channelFigureSpec({flow:2,still:3,tested:false});
    assert.ok(unknown.slots.every(s=>s.state==="unknown"));assert.doesNotMatch(figureText(unknown),/Flow 2 of 4/);
    assert.match(figureText(channelFigureSpec({flow:2,still:3,tested:true})),/Flow 2 of 4, still 3 of 4/);
    assert.equal(secondBodyFigureSpec({effect:null,condition:null}),null);
    assert.equal(secondBodyFigureSpec({effect:{kind:"nothing",donorName:"A",minutesLeft:0},condition:null}),null);
    assert.match(figureText(secondBodyFigureSpec({effect:null,condition:{id:"animal_features",daysLeft:3}})),/Animal features \(strained\)[\s\S]*3 days to clear/);
});

test("the Body & recovery panel shows the figure with its text form and redraws only on change",async()=>{
    const dom=createDom();dom.loadHTML('<html><body><div id="location_actions_div"></div></body></html>');
    const saved={document:globalThis.document};globalThis.document=dom.document;
    try{
        const {createBodyPanel}=await import("../src/body_ui.js");
        let p=drill(begin());
        const read=()=>({state:p.state,context:context(p),enabled:true,error:"",inDialogue:false});
        const panel=createBodyPanel({registry:expeditionRegistry,read,command:()=>{}});
        const root=dom.document.getElementById("body_panel"),figure=root.querySelector(".body-figure");
        assert.equal(figure.hidden,false);assert.match(figure.querySelector(".fig-text").textContent,/Sore hands \(hands, 12 min left\)/);
        const svg=figure.querySelector("svg");panel.render();assert.equal(figure.querySelector("svg"),svg);
        p=advance(p,12);panel.render();assert.notEqual(figure.querySelector("svg"),svg);assert.doesNotMatch(figure.querySelector(".fig-text").textContent,/Sore hands/);
    }finally{globalThis.document=saved.document;}
});
