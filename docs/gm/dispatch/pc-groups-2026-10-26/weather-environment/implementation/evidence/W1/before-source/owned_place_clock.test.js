import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {hostPlaceClock} from '../src/owned_place_clock_host.js';
import {configurePlaceClock,quotePlaceClock,executePlaceClock,projectPlaceClock,placeClockState,settlePlace} from '../src/owned_place_clock.js';
const potato=JSON.stringify({id:'Cooked potato'}),DAY=1440;
function setup(extra={}){
    const c={clock:0,money:50,location:'Hearthside cottage',owned:['cottage'],inventory:{[potato]:3},observerMeans:[],fail:false,...extra};
    configurePlaceClock({read:()=>c,log:()=>{},settle:({money,items})=>{if(c.fail)throw Error('Storage failure');c.money+=money;for(const i of items)c.inventory[i.key]=(c.inventory[i.key]||0)+i.delta;}});
    domainRegistry.load({});return c;
}
const run=r=>executePlaceClock(quotePlaceClock(r));
test('a stilled hearth ages stored food at its own ratio and charges upkeep',()=>{
    const c=setup();run({type:'still',place:'cottage',days:2});assert.equal(c.money,46);
    run({type:'store',place:'cottage',key:potato});c.clock=DAY;
    const p=settlePlace(placeClockState().places.cottage,c.clock);assert.equal(p.age,DAY*.25);assert.equal(p.drift,DAY*.75);
    run({type:'take',place:'cottage',key:potato});assert.equal(c.inventory[potato],3,'still fresh after a world day');
});
test('lapsed upkeep closes the place, rushes the owed hours onto the shelf and refuses until reopened',()=>{
    const c=setup();run({type:'still',place:'cottage',days:1});run({type:'store',place:'cottage',key:potato});
    c.clock=3*DAY;
    assert.throws(()=>quotePlaceClock({type:'store',place:'cottage',key:potato}),/closed/);
    run({type:'take',place:'cottage',key:potato});assert.equal(c.inventory[potato],2,'spoiled by the rushed hours');
    assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/closed/);
    run({type:'reopen',place:'cottage'});assert.equal(placeClockState().places.cottage.status,'open');run({type:'still',place:'cottage',days:1});
});
test('orderly release pays the owed days instead of a rush',()=>{
    const c=setup();run({type:'still',place:'cottage',days:3});c.clock=DAY;const before=c.money;
    run({type:'release',place:'cottage'});assert.equal(before-c.money,1);assert.equal(placeClockState().places.cottage.drift,0);
});
test('only owned eligible places; money and storage failures change nothing',()=>{
    setup({owned:[]});assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/owned/);
    setup({money:1});assert.throws(()=>quotePlaceClock({type:'still',place:'cottage',days:1}),/coins/);
    const c=setup();const q=quotePlaceClock({type:'still',place:'cottage',days:1});c.fail=true;assert.throws(()=>executePlaceClock(q),/Storage/);assert.equal(c.money,50);assert.deepEqual(placeClockState(),{schema:1,places:{}});
    c.fail=false;c.clock++;assert.throws(()=>executePlaceClock(q),/terms changed/);
});
test('observer routes: nothing away from the place, qualitative present, numeric only with the timekeeping means',()=>{
    const c=setup();run({type:'still',place:'cottage',days:2});run({type:'store',place:'cottage',key:potato});c.clock=DAY/2;
    assert.equal(projectPlaceClock('cottage','present').lines.some(l=>/Ratio/.test(l)),false);
    assert.equal(projectPlaceClock('cottage','sandglass').visible,false);
    run({type:'sandglass',place:'cottage'});assert.equal(c.money,50-4-3);assert.throws(()=>quotePlaceClock({type:'sandglass',place:'cottage'}),/already/);
    assert.match(projectPlaceClock('cottage','sandglass').lines.join(' '),/Ratio 0.25/);
    c.location='Village';assert.equal(projectPlaceClock('cottage','present').visible,false);
});
test('save, reload and legacy save: slice round-trips and an envelope without it loads empty',()=>{
    setup();run({type:'still',place:'cottage',days:2});run({type:'store',place:'cottage',key:potato});
    const env=domainRegistry.save({});domainRegistry.validate(env);const copy=structuredClone(env);
    setup();assert.deepEqual(placeClockState(),{schema:1,places:{}});domainRegistry.load(copy);assert.deepEqual(placeClockState(),env.placeClocks);
    const legacy=structuredClone(env);delete legacy.placeClocks;domainRegistry.load(legacy);domainRegistry.validate(legacy);assert.deepEqual(placeClockState(),{schema:1,places:{}});
    assert.throws(()=>domainRegistry.validate({placeClocks:{schema:1,places:{cottage:{id:'cottage',status:'stilled',stilledUntil:null,at:0,age:0,drift:0,ratio:.25,larder:[]}}}}),/Place clocks/);
});
test('host settle stages the next slice into the same durable write and a failed commit leaves slice, money and items unchanged',()=>{
    const ch={money:50},gp={items:{}},exp={clock:0};let fail=false,seen;
    hostPlaceClock({homes:()=>({properties:{cottage:{tenure:'owned'}}}),expansion:()=>exp,character:()=>ch,locationId:()=>'Hearthside cottage',inventory:()=>({}),
        gameplaySnapshot:()=>gp,assertSpend:()=>{},log:()=>{},commit:plan=>{seen=plan;if(fail)throw Error('Storage failure');ch.money=plan.external.money;}});
    domainRegistry.load({});
    const q=quotePlaceClock({type:'still',place:'cottage',days:1});fail=true;assert.throws(()=>executePlaceClock(q),/Storage/);
    assert.deepEqual(placeClockState(),{schema:1,places:{}});assert.equal(ch.money,50);
    fail=false;executePlaceClock(q);
    assert.equal(seen.nativePatch.placeClocks.places.cottage.status,'stilled','staged for the durable envelope before publication');
    assert.deepEqual(seen.nativePatch.placeClocks,placeClockState());assert.equal(seen.state.clock,0,'no clock advance');
});
