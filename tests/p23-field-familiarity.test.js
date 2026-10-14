import test from 'node:test';
import assert from 'node:assert/strict';
import {Game_Time} from '../src/game_time.js';
import {normalizeLocalLife} from '../src/absorb_c2/local_life.js';
import {FIELD_SITE,normalizeFieldFamiliarity,validateFieldFamiliarity,validateFieldSnapshot,lunarWindow,
    fieldAction,advanceFieldFamiliarity,fieldView} from '../src/absorb_p23/field_familiarity/index.js';

const calendar=(day=15,hour=0,minute=0)=>({year:999,month:4,day:1,hour,minute,day_count:day});
const frame=(extra={})=>({worldId:'base.frontier',alive:true,idle:true,knownSite:true,
    location:'Village',calendar:calendar(),clock:0,fromClock:0,...extra});
const serial=s=>JSON.parse(JSON.stringify(s));
const tick=(s,clock,extra={})=>advanceFieldFamiliarity(s,frame({fromClock:s.lastClock??clock,
    clock,calendar:calendar(15,0,clock%60),...extra}));

test('P07 optional old-save defaults do not touch C2 or source objects',()=>{
    const old={money:12};const c2=normalizeLocalLife();
    assert.equal(validateFieldFamiliarity(undefined),true);
    assert.deepEqual(normalizeFieldFamiliarity(),{schema:1,minutes:0,lastClock:null,lastHarvestOccurrence:null,pending:null});
    fieldView(undefined,frame({knownSite:false}));
    assert.deepEqual(old,{money:12});assert.deepEqual(normalizeLocalLife(),c2);
});
test('P07 strict schema preflight rejects malformed records before mutation',()=>{
    for(const bad of [null,[],{},false,{schema:2}, {...normalizeFieldFamiliarity(),minutes:Infinity},
        {...normalizeFieldFamiliarity(),minutes:-1},{...normalizeFieldFamiliarity(),extra:1},
        {...normalizeFieldFamiliarity(),lastClock:1.5},
        {...normalizeFieldFamiliarity(),pending:{occurrence:15,startedClock:0,progress:0,requiredMinutes:6}}]) {
        const before=structuredClone(bad);assert.throws(()=>validateFieldFamiliarity(bad));assert.deepEqual(bad,before);
    }
    const p=fieldAction(undefined,frame(),'gather').state;
    assert.throws(()=>validateFieldFamiliarity({...p,pending:{...p.pending,progress:6}}));
    assert.throws(()=>validateFieldFamiliarity({...p,lastHarvestOccurrence:15}));
});
test('P07 window matches native New phase across 120 days and hour boundaries',()=>{
    for(let day=1;day<=120;day++) for(const minute of [0,239,240,1439]) {
        const c=calendar(day,Math.floor(minute/60),minute%60),t=new Game_Time(c);
        const w=lunarWindow(c);
        assert.equal(w.open,t.getMoonPhaseName(t.getMoonPhase())==='New' && minute<240);
        if(!w.open) {
            assert.ok(w.nextIn>0);const next=new Game_Time(c);next.goUp(w.nextIn);
            assert.equal(lunarWindow(next).open,true);assert.equal(next.hour,0);assert.equal(next.minute,0);
            assert.equal(next.day_count,w.next.day_count);
        }
    }
});
test('P07 next window preserves native month/year rollover and fractional lunar cycle',()=>{
    const c={year:999,month:12,day:30,hour:23,minute:59,day_count:29};
    const w=lunarWindow(c);const next=new Game_Time(c);next.goUp(w.nextIn);
    assert.equal(next.year,1000);assert.equal(next.month,1);assert.deepEqual(lunarWindow(next).next,w.next);
    assert.equal(lunarWindow(calendar(44)).open,false);assert.equal(lunarWindow(calendar(45)).open,true);
    assert.throws(()=>lunarWindow({...c,day_count:Infinity}));
});
test('P07 physical harvest settles once, reload/view never creates a claim',()=>{
    const start=fieldAction(undefined,frame(),'gather');assert.equal(start.ok,true);
    const before=serial(start.state);fieldView(start.state,frame());assert.deepEqual(start.state,before);
    let p=tick(serial(start.state),5,{activity:'lunar_gathering'});assert.deepEqual(p.native.items,[]);
    p=tick(serial(p.state),6,{activity:'lunar_gathering'});
    assert.deepEqual(p.native.items,[{item_id:'Golmoon leaf',count:1}]);assert.equal(p.state.lastHarvestOccurrence,15);
    assert.deepEqual(tick(serial(p.state),6,{activity:'lunar_gathering'}).native.items,[]);
    assert.equal(fieldAction(serial(p.state),frame({clock:6}),'gather').ok,false);
    assert.deepEqual(start.state,before);
});
test('P07 two distinct lunar cycles harvest and future occurrences remain reachable',()=>{
    let s=tick(fieldAction(undefined,frame(),'gather').state,6,{activity:'lunar_gathering'}).state;
    const depleted=lunarWindow(calendar(16),s.lastHarvestOccurrence);
    assert.equal(depleted.claimed,true);assert.equal(depleted.next.day_count,45);
    const c=frame({calendar:calendar(45),clock:500});
    const started=fieldAction(serial(s),c,'gather');assert.equal(started.ok,true);
    const p=advanceFieldFamiliarity(started.state,{...c,fromClock:500,clock:506,activity:'lunar_gathering',calendar:calendar(45,0,6)});
    assert.equal(p.state.lastHarvestOccurrence,45);assert.equal(p.native.items[0].count,1);
    assert.equal(lunarWindow(calendar(45),p.state.lastHarvestOccurrence).next.day_count,74);
});
test('P07 scouting and combat time unlock a faster real search without clear XP',()=>{
    let s=advanceFieldFamiliarity(undefined,frame({activity:'scouting'})).state;
    let p=tick(s,15,{activity:'scouting'});assert.equal(p.state.minutes,15);
    p=tick(p.state,30,{activity:'combat',location:'Infested field'});assert.equal(p.state.minutes,30);
    assert.deepEqual(p.native.skillXp,{});assert.deepEqual(p.native.items,[]);
    assert.equal(fieldView(p.state,frame()).rows[1].id,'familiar-search');
    const fast=fieldAction(p.state,frame({clock:30}),'familiar-search');assert.equal(fast.state.pending.requiredMinutes,3);
    const harvest=tick(fast.state,33,{activity:'lunar_gathering'});assert.equal(harvest.native.items[0].count,1);
    const more=tick(harvest.state,34,{activity:'scouting'});assert.equal(more.state.minutes,31);
});
test('P07 both learning sources can independently reach the useful threshold',()=>{
    for(const [activity,location] of [['scouting','Village'],['combat','Infested field']]) {
        let s=advanceFieldFamiliarity(undefined,frame({activity,location})).state;
        s=tick(s,30,{activity,location}).state;
        assert.equal(fieldAction(s,frame({clock:30}),'familiar-search').ok,true);
    }
    assert.equal(fieldAction(undefined,frame(),'familiar-search').ok,false);
});
test('P07 ineligible world/location/death and ordinary idle time do not learn',()=>{
    for(const extra of [{worldId:'other'},{alive:false},{location:'Shack'},{activity:'idle'}]) {
        const s=advanceFieldFamiliarity(undefined,frame()).state;
        assert.equal(tick(s,30,{activity:'scouting',...extra}).state.minutes,0);
    }
});
test('P07 duplicate/backward/gapped callbacks do not replay elapsed familiarity',()=>{
    let s=advanceFieldFamiliarity(undefined,frame({clock:100,fromClock:0,activity:'scouting'})).state;
    assert.equal(s.minutes,0);
    s=tick(s,101,{activity:'scouting'}).state;assert.equal(s.minutes,1);
    assert.equal(tick(s,101,{activity:'scouting'}).state.minutes,1);
    const backward=advanceFieldFamiliarity(s,frame({clock:50,fromClock:49,activity:'scouting'}));
    assert.deepEqual(backward.state,s);
    const gap=advanceFieldFamiliarity(s,frame({clock:200,fromClock:150,activity:'scouting'}));assert.equal(gap.state.minutes,1);
});
test('P07 interruption/closing/phase change stops unpaid search without stock claim',()=>{
    for(const extra of [{activity:'combat'},{worldId:'elsewhere'},{alive:false},{knownSite:false},
        {location:'Shack'},{calendar:calendar(15,4)},{calendar:calendar(45)}]) {
        const s=fieldAction(undefined,frame(),'gather').state;
        const p=tick(s,6,{activity:'lunar_gathering',...extra});
        assert.equal(p.state.pending,null);assert.equal(p.state.lastHarvestOccurrence,null);assert.deepEqual(p.native.items,[]);
    }
    assert.equal(fieldAction(undefined,frame({calendar:calendar(15,3,54)}),'gather').ok,false);
    const s=fieldAction(undefined,frame(),'gather').state;
    assert.equal(fieldAction(s,frame(),'stop').state.pending,null);
});
test('P07 pending and settled serialization stays exact without replaying rewards',()=>{
    const start=fieldAction(undefined,frame(),'gather').state;
    const pending=tick(start,2,{activity:'lunar_gathering'}).state;
    assert.deepEqual(normalizeFieldFamiliarity(serial(pending)),pending);
    const done=tick(serial(pending),6,{activity:'lunar_gathering'});
    assert.deepEqual(normalizeFieldFamiliarity(serial(done.state)),done.state);
    assert.deepEqual(tick(serial(done.state),7,{activity:'lunar_gathering'}).native.items,[]);
});
test('P07 known-only projection has no effects or undiscovered name leak',()=>{
    assert.deepEqual(fieldView(undefined,frame({knownSite:false})),{visible:false});
    assert.deepEqual(fieldView(undefined,frame({worldId:'other'})),{visible:false});
    assert.equal(fieldAction(undefined,frame({knownSite:false}),'gather').ok,false);
    const v=fieldView(undefined,frame({calendar:calendar(1)}));assert.match(v.summary,/Next window/);
    assert.equal(v.rows.length,1);assert.equal(v.rows[0].disabled,true);assert.equal(FIELD_SITE.item,'Golmoon leaf');
});
test('P07 whole-save preflight rejects impossible occurrence and clock bindings',()=>{
    const s=fieldAction(undefined,frame(),'gather').state;
    assert.equal(validateFieldSnapshot(s,frame()),true);
    assert.equal(validateFieldSnapshot(undefined,{}),true);
    assert.throws(()=>validateFieldSnapshot(s,frame({calendar:calendar(15,4)})));
    assert.throws(()=>validateFieldSnapshot(s,frame({clock:1})));
    const done=tick(s,6,{activity:'lunar_gathering'}).state;
    assert.equal(validateFieldSnapshot(done,frame({clock:6})),true);
    for(const lastHarvestOccurrence of [1,16,45]) assert.throws(()=>validateFieldSnapshot(
        {...done,lastHarvestOccurrence},frame({clock:6})));
    assert.throws(()=>validateFieldSnapshot(done,frame({clock:5})));
});
