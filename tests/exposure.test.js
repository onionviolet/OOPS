import test from 'node:test';
import assert from 'node:assert/strict';
import {createExposure,validateExposure,setHazardousMode,stageExposure,exposureEffects,famineEfficiency} from '../src/absorb_p23/exposure/exposure.js';
import {exposureStatus,mountExposurePanel} from '../src/absorb_p23/exposure/panel.js';
import {normalizePacing,advancePacing} from '../src/absorb_e1/pacing.js';
const pacing={...normalizePacing(),hungerEnabled:true,weatherEnabled:true,fullness:0};
const ctx={played:true,homeWorld:true,needsFood:true,exposureEligible:true,outdoors:true,sheltered:false,pacing};
const interval=(start,end)=>({start,end});
const hazard=()=>setHazardousMode(createExposure(),true);
test('old saves remain absent; defaults have no new weather cost',()=>{
    assert.equal(validateExposure(undefined),undefined);
    const result=stageExposure(undefined,interval(0,30),{...ctx,pacing:normalizePacing()});
    assert.deepEqual(result.skillXp,{});assert.equal(result.staminaCost,0);assert.equal(result.state.hazardousEnabled,false);
    assert.deepEqual(exposureEffects(undefined,ctx),{active:false,exposed:false,phase:'gust',remaining:6,temperatureOffset:0});
});
test('idle underfed played time earns fractional native Famine XP without activity',()=>{
    const result=stageExposure(undefined,interval(0,2.5),ctx);
    assert.equal(result.skillXp.Famine,0.02);assert.equal(result.state.famineRemainder,0.005);assert.equal(result.underfedMinutes,2.5);
});
test('tiny ticks retain positive progress rather than rounding it away',()=>{
    let state=createExposure(),xp=0;
    for(let i=0;i<100;i++){const r=stageExposure(state,interval(i/100,(i+1)/100),ctx);state=r.state;xp+=r.skillXp.Famine??0;}
    assert.equal(xp,0.01);assert.equal(state.famineRemainder,0);
});
test('fed, nonfeeding, absent body, offline, outside home and hunger-off controls award none',()=>{
    for(const context of [{...ctx,pacing:{...pacing,fullness:100}}, {...ctx,needsFood:false},{...ctx,needsFood:undefined},
        {...ctx,played:false},{...ctx,homeWorld:false},{...ctx,pacing:{...pacing,hungerEnabled:false}}]) {
        const r=stageExposure(undefined,interval(0,5),context);assert.equal(r.skillXp.Famine,undefined);assert.equal(r.state.famineRemainder,0);
    }
});
test('threshold crossing integrates only actual underfed suffix and matches split E1 clock',()=>{
    const context={...ctx,pacing:{...pacing,fullness:21}};
    const big=stageExposure(undefined,interval(0,10),context);
    const first=stageExposure(undefined,interval(0,3),context);
    const nextPacing=advancePacing(context.pacing,3,{homeWorld:true});
    const second=stageExposure(first.state,interval(3,10),{...ctx,pacing:nextPacing});
    assert.ok(Math.abs(big.underfedMinutes-5.2)<1e-9);
    assert.deepEqual(big.state,second.state);assert.equal(big.skillXp.Famine,(first.skillXp.Famine??0)+(second.skillXp.Famine??0));
});
test('event replay after reload is idempotent; later real events keep awarding',()=>{
    const first=stageExposure(hazard(),interval(5,10),ctx);
    const saved=JSON.parse(JSON.stringify(first.state));const replay=stageExposure(saved,interval(5,10),ctx);
    assert.equal(replay.replayed,true);assert.deepEqual(replay.skillXp,{});assert.equal(replay.staminaCost,0);assert.deepEqual(replay.state,saved);
    assert.equal(stageExposure(saved,interval(10,15),ctx).skillXp.Famine,0.05);
});
test('overlaps and gaps reject before any source mutation',()=>{
    const state=stageExposure(hazard(),interval(0,5),ctx).state, before=structuredClone(state);
    for(const event of [interval(4,7),interval(6,7),{start:5,end:Infinity},{start:5,end:4}]) assert.throws(()=>stageExposure(state,event,ctx));
    assert.deepEqual(state,before);
});
test('gust and rest have distinct visible temperature and native-resource costs',()=>{
    const first=stageExposure(hazard(),interval(0,6),ctx);
    assert.ok(Math.abs(first.staminaCost-1.2)<1e-9);assert.equal(first.skillXp['Cold resistance'],0.12);
    assert.equal(first.state.phase,'rest');assert.equal(exposureEffects(first.state,ctx).temperatureOffset,0);
    const rest=stageExposure(first.state,interval(6,18),ctx);assert.equal(rest.staminaCost,0);assert.equal(rest.state.phase,'gust');
    assert.equal(exposureEffects(rest.state,ctx).temperatureOffset,-3);
});
test('shelter blocks exposure, still advances the same weather phase; resistance reduces cost',()=>{
    const outside=stageExposure(hazard(),interval(0,3),ctx);
    const sheltered=stageExposure(hazard(),interval(0,3),{...ctx,sheltered:true});
    assert.equal(sheltered.staminaCost,0);assert.equal(sheltered.skillXp['Cold resistance'],undefined);
    assert.equal(sheltered.state.remaining,outside.state.remaining);assert.equal(exposureEffects(sheltered.state,{...ctx,sheltered:true}).temperatureOffset,0);
    assert.ok(stageExposure(hazard(),interval(0,3),{...ctx,coldResistanceLevel:20}).staminaCost<outside.staminaCost);
});
test('mode off and unavailable weather/body/world freeze phase without added penalties',()=>{
    const state=stageExposure(hazard(),interval(0,2),ctx).state;
    for(const [raw,context] of [[setHazardousMode(state,false),ctx],[state,{...ctx,pacing:{...pacing,weatherEnabled:false}}],
        [state,{...ctx,exposureEligible:false}],[state,{...ctx,homeWorld:false}],[state,{...ctx,played:false}]]) {
        const r=stageExposure(raw,interval(2,20),context);assert.equal(r.staminaCost,0);assert.equal(r.state.remaining,4);
        assert.equal(exposureEffects(r.state,context).temperatureOffset,0);
    }
});
test('long common-clock step matches segmented gust costs and saved remainder',()=>{
    const big=stageExposure(hazard(),interval(0,10000.25),ctx);let state=hazard(),xp=0,cold=0,cost=0;
    for(let start=0;start<10000.25;start+=0.25){const r=stageExposure(state,interval(start,start+0.25),ctx);state=r.state;xp+=r.skillXp.Famine??0;cold+=r.skillXp['Cold resistance']??0;cost+=r.staminaCost;}
    assert.deepEqual(state,big.state);assert.ok(Math.abs(cost-big.staminaCost)<1e-8);assert.ok(Math.abs(xp-big.skillXp.Famine)<1e-8);assert.ok(Math.abs(cold-big.skillXp['Cold resistance'])<1e-8);
});
test('pending phase and XP remainder survive JSON literal payload preflight and resume',()=>{
    const pending=stageExposure(hazard(),interval(0,0.25),ctx).state;
    const restored=validateExposure(JSON.parse(JSON.stringify(pending)));
    assert.deepEqual(restored,pending);assert.deepEqual(stageExposure(restored,interval(0.25,19),ctx),stageExposure(pending,interval(0.25,19),ctx));
    assert.deepEqual(setHazardousMode(restored,false),{...restored,hazardousEnabled:false});
});
test('unsupported/malformed save states reject without mutation',()=>{
    const state=createExposure();
    for(const raw of [null,[],{...state,schema:2},{...state,remaining:0},{...state,phase:'lightning'},{...state,famineRemainder:0.01},
        {...state,cursor:NaN},{...state,hazardousEnabled:'true'},{...state,coldRemainder:-1}]) {const before=structuredClone(raw);assert.throws(()=>validateExposure(raw));assert.deepEqual(raw,before);}
});
test('Famine projects a bounded benefit over existing optional penalty only',()=>{
    const context={homeWorld:true,needsFood:true,hungerEnabled:true};assert.ok(Math.abs(famineEfficiency(0.8,40,context)-0.85)<1e-12);
    assert.equal(famineEfficiency(1,40,context),1);assert.ok(Math.abs(famineEfficiency(0.8,999,context)-0.85)<1e-12);
    assert.equal(famineEfficiency(0.8,40,{...context,needsFood:false}),0.8);assert.equal(famineEfficiency(0.8,40,{}),0.8);
});
test('status reveals only known skill names and explains risk without effects',()=>{
    assert.doesNotMatch(exposureStatus(undefined,ctx),/Famine/);assert.match(exposureStatus(undefined,ctx,['Famine']),/0.01 XP/);
    assert.match(exposureStatus(hazard(),ctx),/0.2 stamina/);assert.match(exposureStatus(hazard(),ctx),/No health damage/);
});
test('panel rollback respects failed native commit and does not alter source state',()=>{
    function el(tag){return {tag,children:[],dataset:{},append(...xs){this.children.push(...xs);},addEventListener(_event,fn){this.change=fn;},remove(){}};}
    const doc={createElement:el,createTextNode:text=>({text})},host={...el('host'),ownerDocument:doc};let state=createExposure(),blocked=false;
    const panel=mountExposurePanel({host,getState:()=>state,getContext:()=>ctx,onChange:next=>{if(blocked)throw Error('custody blocked');state=next;}});
    const input=host.children[0].children[0].children[0];input.checked=true;input.change();assert.equal(state.hazardousEnabled,true);
    blocked=true;input.checked=false;input.change();assert.equal(input.checked,true);assert.equal(state.hazardousEnabled,true);panel.destroy();
});
