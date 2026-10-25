import test from 'node:test';
import assert from 'node:assert/strict';
import {planReadingCommand as command, observeReadingClock as observe, validateReadingState as validate, longRestClockRequest as request, planReadingCommand, observeReadingClock} from '../src/absorb_p23/reading/runtime.js';
import {REST_KEY, ANTHOLOGY_KEY, LONG_REST_MINUTES, ANTHOLOGY} from '../src/absorb_p23/reading/content.js';
import {readingPresentation} from '../src/absorb_p23/reading/presentation.js';
import {furnitureProjection} from '../src/absorb_b/furniture.js';
import {Game_Time} from '../src/game_time.js';
import {stageReadingResult, validateTrancheThreeEnvelope} from '../src/absorb_p23/host_joins/tranche_three.js';

// reading: original fixture scope retained.
{
const context = (clock=0,overrides={}) => ({clock,worldId:'base.frontier',nativeBody:true,alive:true,safe:true,available:true,
    ownedAnthology:true,ownedRestMeal:true,housingAccessible:true,sleepingLevel:5,readProgressPerMinute:1,...overrides});
const read = (draw=7) => command(undefined,{type:'startRead',draw},context()).state;
const rest = () => command(undefined,{type:'startRest'},context());
const roundtrip = state => JSON.parse(JSON.stringify(state));

test('old absence remains absent, explicit schema and null reject before mutation', () => {
    assert.equal(validate(undefined,0),true);
    assert.equal(observe(undefined,context()).state,undefined);
    for(const s of [null,{}, {schema:2,nextId:1,current:null,receipts:[]}]) assert.throws(()=>validate(s,0));
});
test('two rereads settle distinct real events once and keep native book ownership', () => {
    const first = read(); const a = observe(first,context(first.current.outcome.duration));
    assert.equal(a.effects.filter(e=>e.type==='skillXp').length,1);
    assert.equal(a.effects.find(e=>e.type==='finishOwnedBook').key,ANTHOLOGY_KEY);
    assert.equal(observe(a.state,context(50)).effects.length,0);
    const second = command(a.state,{type:'startRead',draw:100},context(50));
    const b = observe(second.state,context(50+second.state.current.outcome.duration));
    assert.deepEqual(b.state.receipts.map(r=>r.id),[1,2]);
    assert.notDeepEqual(b.state.receipts[0].outcome,b.state.receipts[1].outcome);
    assert.equal(b.effects.some(e=>e.type==='consume'),false);
});
test('stopped read survives JSON restore without redrawing or idle progress', () => {
    const a = observe(read(99),context(3)).state;
    const paused = command(a,{type:'stopRead'},context(3)).state;
    assert.deepEqual(observe(roundtrip(paused),context(100)).state,paused);
    const resumed = command(roundtrip(paused),{type:'resumeRead'},context(100)).state;
    assert.deepEqual(resumed.current.outcome,a.current.outcome);
    assert.equal(observe(resumed,context(102)).state.current.progress,5);
});
test('pending and completed source roundtrips are exact and settlement replay emits no XP', () => {
    const pending = observe(read(),context(2)).state;
    assert.deepEqual(roundtrip(pending),pending); validate(roundtrip(pending),2);
    const finished = observe(roundtrip(pending),context(40)).state;
    validate(roundtrip(finished),40); assert.deepEqual(roundtrip(finished),finished);
    assert.deepEqual(observe(roundtrip(finished),context(40)).effects,[]);
});
test('wave-1 speed input advances progress without a second speed formula', () => {
    const s = observe(read(),context(2,{readProgressPerMinute:2})).state;
    assert.equal(s.current.progress,4);
    for(const rate of [0,-1,Infinity,NaN]) assert.throws(()=>observe(read(),context(2,{readProgressPerMinute:rate})));
});
test('custody, combat, world, body and occupation controls block without changing inputs', () => {
    for(const override of [{ownedAnthology:false},{safe:false},{available:false},{nativeBody:false},{alive:false},{worldId:'other'}]) {
        const before = read(); const copy = roundtrip(before);
        assert.throws(()=>command(undefined,{type:'startRead',draw:1},context(0,override)));
        assert.deepEqual(before,copy);
    }
    assert.throws(()=>observe(read(),context(1,{ownedAnthology:false})));
    assert.throws(()=>observe(read(),context(1,{available:false})));
});
test('draws, malformed receipts and future/backwards clock reject', () => {
    for(const draw of [-1,2**32,1.2,undefined]) assert.throws(()=>read(draw === undefined ? null : draw));
    const s = observe(read(),context(2)).state;
    for(const mutate of [x=>x.current.outcome.literacyXp++,x=>x.current.progress=-1,x=>x.current.id=2,
        x=>x.extra=true,x=>x.current.extra=true,x=>x.current.status='finished']) {
        const invalid=roundtrip(s); mutate(invalid); assert.throws(()=>validate(invalid,2));
    }
    assert.throws(()=>validate(s,1));
    assert.throws(()=>command(s,{type:'stopRead'},context(3)));
});
test('rest requires earned progression and owned meal, consumes exactly at admission', () => {
    for(const override of [{sleepingLevel:4},{sleepingLevel:NaN},{housingAccessible:false},{ownedRestMeal:false},{safe:false}])
        assert.throws(()=>command(undefined,{type:'startRest'},context(0,override)));
    assert.deepEqual(rest().effects,[{type:'consume',key:REST_KEY,count:1,eventId:1}]);
    assert.throws(()=>command(rest().state,{type:'startRest'},context()));
});
test('cancelled rest keeps paid meal consumed and is repeatable with another meal', () => {
    const pending = observe(rest().state,context(5)).state;
    const cancelled = command(roundtrip(pending),{type:'cancelRest'},context(5));
    assert.deepEqual(cancelled.effects,[]); assert.equal(cancelled.state.receipts[0].status,'cancelled');
    validate(roundtrip(cancelled.state),5);
    const again = command(cancelled.state,{type:'startRest'},context(5));
    assert.equal(again.effects[0].eventId,2); assert.equal(again.effects[0].count,1);
});
test('rest accepts native five-minute batches, crosses calendar year correctly, no replay rewards', () => {
    let s = rest().state, clock=0;
    const calendar = new Game_Time({year:1,month:12,day:30,hour:23,minute:58});
    while(s.current) {
        const minutes = request(s,context(clock)); assert.ok(minutes<=5 && minutes>0);
        clock += minutes; calendar.goUp(minutes);
        const p = observe(s,context(clock)); assert.deepEqual(p.effects,[]); s = roundtrip(p.state); validate(s,clock);
    }
    assert.equal(clock,LONG_REST_MINUTES); assert.equal(s.receipts[0].status,'finished');
    assert.deepEqual([calendar.year,calendar.month,calendar.day,calendar.hour,calendar.minute],[2,1,1,17,58]);
    assert.equal(request(s,context(clock)),0);
});
test('rest refuses synchronous 1080-minute replay and unsafe requests', () => {
    assert.throws(()=>observe(rest().state,context(1080)));
    const corrupt=rest().state; corrupt.current.progress=1.5; assert.throws(()=>validate(corrupt,0));
    for(const override of [{safe:false},{alive:false},{available:false},{housingAccessible:false},{worldId:'other'},{nativeBody:false}])
        assert.throws(()=>request(rest().state,context(0,override)));
    assert.equal(observe(rest().state,context(2)).state.current.progress,2);
});
test('native collection remains distinct, finished and owned across rereads/copies/custody', () => {
    const key = ANTHOLOGY_KEY, other=JSON.stringify({id:'ABC for kids'});
    const input = {state:{actors:{player:{worldId:'base.frontier'}}},locationId:'Shack',housingAccessible:true,
        nativeInventory:{[key]:3,[other]:1},bookStats:{'Tales of the Lantern Road':{required_time:12,accumulated_time:12},
            'ABC for kids':{required_time:12,accumulated_time:1}}};
    assert.equal(furnitureProjection(input).readBooks,1);
    assert.equal(furnitureProjection({...input,nativeInventory:{[other]:1}}).readBooks,0);
    assert.equal(furnitureProjection({...input,nativeInventory:{[key]:1},state:{...input.state,
        simulation:{custody:{loan:{key,holder:'player',owner:'other',count:1}}}}}).readBooks,0);
});
test('presentation discloses only known title and actual settled stories', () => {
    assert.equal(readingPresentation(undefined,context()).visible,false);
    assert.equal(readingPresentation(undefined,context()).anthology,null);
    const s = read(); assert.equal(readingPresentation(s,context()).records.length,0);
    assert.equal(readingPresentation(undefined,context(0,{knownAnthology:true})).anthology,'Tales of the Lantern Road');
});

}

// p23-host-joins-tranche3: original fixture scope retained.
{
const context=clock=>({clock,worldId:'base.frontier',nativeBody:true,alive:true,safe:true,available:true,ownedAnthology:true,readProgressPerMinute:1});
test('host settlement puts XP and finished book in one unpublished envelope and never mutates native books',()=>{
 const start=planReadingCommand(undefined,{type:'startRead',draw:0},context(0));
 const settled=observeReadingClock(start.state,context(12)),books={'ABC for kids':{accumulated_time:2}},gameplay={player:{inventory:{},reputation:{},skills:{Literacy:{enabled:true,xp:0}}}};
 const plan=stageReadingResult({state:{clock:12},gameplay},settled,{books});
 assert.equal(plan.gameplay.player.skills.Literacy.xp,8);assert.equal(plan.nativePatch.books[ANTHOLOGY].accumulated_time,12);assert.deepEqual(books,{'ABC for kids':{accumulated_time:2}});assert.equal(plan.p00ReadingNotices.length,1);
 assert.throws(()=>validateTrancheThreeEnvelope({expansion:plan.state}),/finished native book/);
 validateTrancheThreeEnvelope({expansion:plan.state,books:plan.nativePatch.books});
 const again=observeReadingClock(settled.state,context(12));assert.deepEqual(again.effects,[]);
});
test('host optional absence remains absent and unsupported reading schemas reject before publication',()=>{
 validateTrancheThreeEnvelope({});assert.throws(()=>validateTrancheThreeEnvelope({expansion:{clock:0,p23Reading:{schema:2}}}),/schema/);
 const plan={state:{clock:0},gameplay:{}};stageReadingResult(plan,{state:undefined,effects:[]},{books:{}});assert.equal(Object.hasOwn(plan.state,'p23Reading'),false);
});

}

