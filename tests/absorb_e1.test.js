import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePacing,setPacingOption,advancePacing,prepareFood,pacingEffects,pacedTemperature,nourishmentFor,getPacingState,setPacingState,weatherDuration} from '../src/absorb_e1/pacing.js';
import {pacingStatus,foodPacingDescription,mountPacingPanel} from '../src/absorb_e1/panel.js';
const home={homeWorld:true,outdoors:true,season:'Spring'};
const food={tags:{food:true},effects:[{effect:'Basic meal',duration:60}]};
const enabled=()=>({...normalizePacing(),hungerEnabled:true,weatherEnabled:true});
test('legacy saves default both options off without invented debt or elapsed history',()=>{
    const state=normalizePacing();assert.deepEqual(state,{schema:1,hungerEnabled:false,weatherEnabled:false,fullness:100,weather:{phase:0,remaining:120}});
    assert.deepEqual(advancePacing(state,500,home),state);assert.equal(pacingEffects(state,home).efficiency,1);
});
test('normalization bounds persisted meters and rejects future schema',()=>{
    const state=normalizePacing({fullness:-100,weather:{phase:100,remaining:Infinity},hungerEnabled:'true'});
    assert.equal(state.fullness,0);assert.equal(state.hungerEnabled,false);assert.equal(state.weather.phase,5);assert.equal(state.weather.remaining,120);
    assert.throws(()=>normalizePacing({schema:2}),/schema/);assert.throws(()=>setPacingOption(state,'unknown',true));
});
test('hunger uses common played minutes, caps floor, and has actual XP effect',()=>{
    const half=advancePacing(enabled(),240,home);assert.equal(half.fullness,50);assert.equal(pacingEffects(half,{...home,outdoors:false}).efficiency,0.9);
    const empty=advancePacing(half,999999,home);assert.equal(empty.fullness,0);assert.equal(pacingEffects(empty,{...home,outdoors:false}).efficiency,0.8);
});
test('off options freeze existing state; absence of explicit home context cannot penalize worlds',()=>{
    const state=enabled();assert.deepEqual(advancePacing(state,100,{}),state);
    assert.deepEqual(advancePacing(state,100,{homeWorld:false}),state);
    assert.equal(pacingEffects({...state,fullness:0,weather:{phase:2,remaining:90}},{outdoors:true}).efficiency,1);
    const disabled=setPacingOption(setPacingOption(state,'hungerEnabled',false),'weatherEnabled',false);
    assert.deepEqual(advancePacing(disabled,100,home),disabled);
});
test('native food replenishes even if native meal buff already lasts longer',()=>{
    const hungry={...enabled(),fullness:50};const plan=prepareFood(hungry,food,home);
    assert.equal(plan.restored,15);assert.equal(plan.state.fullness,65);assert.equal(hungry.fullness,50);
    assert.equal(nourishmentFor({...food,effects:[{duration:150}]}),22.5);
    assert.equal(nourishmentFor({...food,effects:[{duration:10000}]}),40);
    assert.equal(prepareFood({...hungry,fullness:98},food,home).restored,2);
    assert.equal(prepareFood(hungry,{tags:{medicine:true}},home).restored,0);
    assert.equal(prepareFood(hungry,food,{homeWorld:false}).restored,0);
});
test('weather duration actually expires, fog affects outdoors XP, shelter preserves hunger only',()=>{
    const state=advancePacing(enabled(),210,home);assert.equal(state.weather.phase,2);assert.equal(state.weather.remaining,105);
    const e=pacingEffects({...state,fullness:100},home);assert.equal(e.efficiency,0.95);
    assert.equal(pacingEffects({...state,fullness:100},{...home,outdoors:false}).efficiency,1);
    assert.equal(advancePacing(state,105,home).weather.phase,3);
});
test('optional rain adds native wet route without suppressing the native rain cycle',()=>{
    for(let phase=0;phase<6;phase++) assert.equal(pacingEffects({...enabled(),weather:{phase,remaining:30}},{...home,nativeRain:true}).raining,true);
    const rain={...enabled(),weather:{phase:3,remaining:30}};
    assert.equal(pacingEffects(rain,home).raining,true);assert.equal(pacingEffects(rain,{...home,outdoors:false}).raining,false);
    assert.equal(pacingEffects(rain,{...home,season:'Winter'}).weatherLabel,'Flurries');
});
test('weather offsets native temperature and respects disabled/sheltered/external worlds',()=>{
    const rain={...enabled(),weather:{phase:3,remaining:30}};
    assert.equal(pacedTemperature(rain,-4,home),-5);
    assert.equal(pacedTemperature(rain,-4,{...home,outdoors:false}),-4);
    assert.equal(pacedTemperature(rain,-4,{...home,homeWorld:false}),-4);
    assert.equal(pacedTemperature({...rain,weatherEnabled:false},-4,home),-4);
});
test('season changes new durations and long common-clock steps equal segmented progression',()=>{
    assert.equal(weatherDuration(3,'Winter'),150);assert.equal(weatherDuration(3,'Summer'),90);
    const big=advancePacing(enabled(),123456,home);let small=enabled();for(let i=0;i<10288;i++)small=advancePacing(small,12,home);
    assert.deepEqual(big,small);assert.ok(big.weather.remaining>0 && big.weather.remaining<=240);
    const fractional=advancePacing(enabled(),119.5,home);assert.equal(advancePacing(fractional,0.25,home).weather.remaining,0.25);
});
test('saved JSON roundtrip restores disabled retained state, phase and next transition without a second clock',()=>{
    const original=advancePacing(enabled(),237,home);const reloaded=normalizePacing(JSON.parse(JSON.stringify(original)));
    assert.deepEqual(advancePacing(reloaded,100,home),advancePacing(original,100,home));
    setPacingState(reloaded);const copy=getPacingState();copy.fullness=0;assert.equal(getPacingState().fullness,reloaded.fullness);setPacingState();
});
test('readable status and food description explain defaults, effects and scope',()=>{
    assert.match(pacingStatus(normalizePacing(),home),/native pacing/);
    assert.match(pacingStatus(enabled(),{homeWorld:false}),/paused outside/);
    assert.match(foodPacingDescription(food),/15\/100/);
    assert.equal(foodPacingDescription({tags:{medicine:true}}),'');
});
test('panel toggles call integrator and roll back visual checkbox on rejected save',()=>{
    function element(tag){return {tag,children:[],dataset:{},checked:false,append(...children){this.children.push(...children);},addEventListener(_name,fn){this.change=fn;},remove(){}};}
    const doc={createElement:element,createTextNode:text=>({text})};const host={...element('host'),ownerDocument:doc};let state=normalizePacing();let fail=false;
    const panel=mountPacingPanel({host,getState:()=>state,getContext:()=>home,onChange:next=>{if(fail)throw Error('save blocked');state=next;}});
    const controls=host.children[0].children.filter(el=>el.tag==='label').map(row=>row.children[0]);
    controls[0].checked=true;controls[0].change();assert.equal(state.hungerEnabled,true);
    fail=true;controls[1].checked=true;controls[1].change();assert.equal(controls[1].checked,false);assert.equal(state.weatherEnabled,false);
    panel.render();panel.destroy();
});
