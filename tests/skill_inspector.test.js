import test from "node:test";
import assert from "node:assert/strict";
import {createExpansionState} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry} from "../src/expedition_content.js";
import {skillInspectorView} from "../src/skill_inspector.js";
import {FRAIL_FRAME,STEADY_FRAME} from "../src/body_progression.js";

test("inspector lists layers and sources for two native skills and one method, and mutates nothing",()=>{
    const state=initializeExpedition(createExpansionState(5));
    state.simulation={powers:{player:{"p.demo":{owned:true,mastery:1.25,executions:3,fragments:[1,2],donor:"npc",cause:"effect:x",lineage:["a","b"]}}}};
    state.actors.player.sources[STEADY_FRAME]={receiptId:"e:1",revision:1,acquiredAt:0,expiresAt:null,origin:"trained"};
    state.actors.player.sources[FRAIL_FRAME]={receiptId:"e:0",revision:1,acquiredAt:0,expiresAt:null,origin:"acquired"};
    const before=structuredClone(state);
    const nativeSkills=[{skill:{skill_id:"Climbing",category:"Movement",max_level:60,parent_skill:null,milestones:{5:{stats:{}},10:{xp_multipliers:{}}}},progress:{level:7,totalXp:310.4}},
        {skill:{skill_id:"Running",category:"Movement",max_level:60,parent_skill:"Climbing",parent_multiplier:1.1,milestones:{}},progress:{level:2,totalXp:50}}];
    const v=skillInspectorView({state,registry:expeditionRegistry,nativeSkills});
    assert.equal(v.native.length,2);assert.match(v.native[0].layers[2].detail,/reached 5.*at 10/);assert.match(v.native[1].layers[1].detail,/Climbing/);
    assert.equal(v.methods.length,1);assert.match(v.methods[0].layers[0].source,/copied from npc/);assert.match(v.methods[0].layers[2].source,/a, b/);
    assert.deepEqual(v.sources.map(s=>s.id).sort(),[FRAIL_FRAME,STEADY_FRAME].sort());
    assert.equal(v.sources.find(s=>s.id===STEADY_FRAME).carry,"stays with this body");
    assert.deepEqual(state,before);
});

test("inspector shows a held faculty's development and switches beside its source, and omits it when no faculty record exists",()=>{
    const state=initializeExpedition(createExpansionState(5));
    state.simulation={powers:{},faculties:{player:{[STEADY_FRAME]:{awakened:true,active:false,suppressed:false,development:2.5}}}};
    state.actors.player.sources[STEADY_FRAME]={receiptId:"e:1",revision:1,acquiredAt:0,expiresAt:null,origin:"trained"};
    state.actors.player.sources[FRAIL_FRAME]={receiptId:"e:0",revision:1,acquiredAt:0,expiresAt:null,origin:"acquired"};
    const before=JSON.stringify(state),v=skillInspectorView({state,registry:expeditionRegistry,nativeSkills:[]});
    assert.deepEqual(v.sources.find(x=>x.id===STEADY_FRAME).faculty,{development:2.5,awakened:true,active:false,suppressed:false});
    assert.equal(v.sources.find(x=>x.id===FRAIL_FRAME).faculty,undefined);
    assert.equal(JSON.stringify(state),before);
});

