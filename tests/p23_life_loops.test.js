import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeLocalLife,advanceLocalLife as advanceWithStream,localLifeAction,localLifeView,localLifeQuestView,recordLocalPurchases} from '../src/absorb_c2/local_life.js';
// Procgen requires a saved stream; calls that roll nothing get a fixed no-hit draw.
const advanceLocalLife=(raw,c,rng=()=>.999)=>advanceWithStream(raw,c,rng);
import {grantEarnedTitles,titleView} from '../src/titles.js';
import {createDiscoveryCuePolicy} from '../src/native_discovery_policy.js';
const c=(x={})=>({worldId:'base.frontier',alive:true,idle:true,location:'Village',clock:420,calendarMinute:420,money:20,perception:0,millUnlocked:true,...x});
test('life-loop schema upgrades old accounts without inventing historical time or purchases',()=>{
    for(const raw of [undefined,{schema:1},{schema:2,helped:1,runnerMealsIssued:1,runnerMealsUsed:0}]){
        const s=normalizeLocalLife(raw);assert.equal(s.schema,3);assert.equal(s.homeMinutes,0);assert.equal(s.itemsBought,0);
        assert.deepEqual(normalizeLocalLife(JSON.parse(JSON.stringify(s))),s);
    }
    assert.throws(()=>normalizeLocalLife({...normalizeLocalLife(),schema:4}),/Unsupported/);
    assert.throws(()=>normalizeLocalLife({...normalizeLocalLife(),itemsBought:-1}),/Invalid/);
    assert.throws(()=>normalizeLocalLife({...normalizeLocalLife(),parcelStep:4}),/Invalid/);
});
test('home minutes count only observed home steps and settled purchase quantities feed public titles',()=>{
    let s=advanceLocalLife(undefined,c({location:'Shack'})).state;
    s=advanceLocalLife(s,c({location:'Shack',clock:1860,calendarMinute:1860})).state;
    assert.equal(s.homeMinutes,1440);
    assert.equal(advanceLocalLife(s,c({clock:1870})).state.homeMinutes,1440);
    const p=recordLocalPurchases(s,25);assert.equal(s.itemsBought,0);assert.equal(p.itemsBought,25);
    assert.throws(()=>recordLocalPurchases(s,NaN));
    assert.deepEqual(grantEarnedTitles({}, {home_minutes:p.homeMinutes,items_bought:p.itemsBought},0),['homebody','local_customer']);
    assert.equal(titleView({}, {items_bought:7}).find(r=>r.id==='local_customer').progress,7);
});
test('watch gates accept window, pays once at evening and permits later days without catch-up pay',()=>{
    assert.equal(localLifeAction(undefined,c({calendarMinute:419}),'watch').ok,false);
    assert.equal(localLifeAction(undefined,c({calendarMinute:600}),'watch').ok,false);
    const start=localLifeAction(undefined,c(),'watch');assert.equal(start.ok,true);
    let p=advanceLocalLife(start.state,c({clock:1199,calendarMinute:1199}),()=>.999);assert.equal(p.native.money,0);
    p=advanceLocalLife(p.state,c({clock:1200,calendarMinute:1200}),()=>.999);
    assert.equal(p.native.money,12);assert.equal(p.native.skillXp.Perception,3);assert.equal(p.state.watchShifts,1);
    assert.equal(advanceLocalLife(p.state,c({clock:1201,calendarMinute:1201}),()=>.999).native.money,0);
    assert.equal(localLifeAction(p.state,c({clock:1860,calendarMinute:1860}),'watch').ok,true);
    const missed=advanceLocalLife(start.state,c({clock:420+1440*7,calendarMinute:420+1440*7}),()=>.999);
    assert.equal(missed.state.watching,false);assert.equal(missed.native.money,0);
});
test('watch interrupted by work or travel never pays; saved active state resumes without replay',()=>{
    const start=localLifeAction(undefined,c(),'watch').state;
    for(const patch of [{idle:false},{location:'Shack'},{worldId:'other'},{alive:false}]){
        const p=advanceLocalLife(start,c({clock:421,...patch}));assert.equal(p.state.watching,false);assert.equal(p.native.money,0);
    }
    const reload=normalizeLocalLife(JSON.parse(JSON.stringify(start)));
    assert.deepEqual(advanceLocalLife(reload,c()).native.skillXp,{});
    assert.equal(localLifeAction(reload,c(),'stop_watch').state.watching,false);
});
test('weekly restock uses saved calendar claim, next opening and no stockpiling missed weeks',()=>{
    const at=c({calendarMinute:540});
    const p=localLifeAction(undefined,at,'market');assert.equal(p.ok,true);assert.equal(p.native.items[0].count,1);
    assert.equal(localLifeAction(JSON.parse(JSON.stringify(p.state)),at,'market').ok,false);
    const later=localLifeAction(p.state,c({calendarMinute:540+10080*10}),'market');assert.equal(later.native.items[0].count,1);
    assert.match(localLifeView(p.state,at).rows.find(r=>r.id==='market').label,/next opening in 10080/);
});
test('chance visitor is rolled only on arrival, retained on meeting and pamphlet unlocks ordered relay',()=>{
    let s=advanceLocalLife(undefined,c()).state;
    s=advanceLocalLife(s,c({location:'Shack',clock:421}),()=>.999).state;
    const meet=advanceLocalLife(s,c({clock:422}),()=>0);assert.equal(meet.state.visitorMet,true);
    s=meet.state;assert.equal(localLifeAction(s,c(),'parcel').ok,false);
    s=localLifeAction(s,c(),'pamphlet').state;
    assert.equal(localLifeAction(s,c({millUnlocked:false}),'parcel').ok,false);
    s=localLifeAction(s,c(),'parcel').state;assert.match(localLifeQuestView(s).find(q=>q.id==='village.parcel').objective,/Eastern mill/);
    assert.equal(localLifeAction(s,c(),'parcel').ok,false);
    s=localLifeAction(s,c({location:'Eastern mill'}),'parcel').state;
    const finish=localLifeAction(s,c(),'parcel');assert.equal(finish.native.money,8);assert.equal(finish.state.parcelStep,3);
    assert.equal(localLifeAction(finish.state,c(),'parcel').ok,false);
    assert.match(localLifeAction(finish.state,c(),'mentor').messages[0],/relay is finished/);
    assert.equal(localLifeQuestView(finish.state).find(q=>q.id==='village.parcel').completed,true);
    assert.equal(advanceLocalLife(meet.state,c({clock:422}),()=>{throw Error('repeat clock');}).state.visitorMet,true);
});
test('search reports remaining finds and exhaustion; bleeding exposure trains Iron skin only on played ticks',()=>{
    const empty=normalizeLocalLife();assert.match(localLifeView(empty,c()).summary,/1 find remains/);
    empty.searches.Village.found=true;assert.match(localLifeView(empty,c()).summary,/0 finds remain/);
    assert.equal(localLifeView(empty,c()).rows.find(r=>r.id==='look').disabled,true);
    empty.lastClock=420;
    const p=advanceLocalLife(empty,c({clock:425,bleedingRemaining:2}),()=>.999);
    assert.equal(p.native.skillXp['Iron skin'],.5);
    assert.equal(advanceLocalLife(p.state,c({clock:425,bleedingRemaining:2})).native.skillXp['Iron skin'],undefined);
});
test('title cue shares discovery policy but never responds to restored rows or duplicates',()=>{
    const policy=createDiscoveryCuePolicy({eventType:'native-title-discovery',singular:'Title earned',plural:'titles'});
    assert.equal(policy.take([{id:'homebody',known:true,label:'Homebody'}]),null);
    const e={type:'native-title-discovery',id:'homebody',known:true,label:'Homebody',settled:true};
    assert.equal(policy.take([e]).text,'Title earned: Homebody');assert.equal(policy.take([e]),null);
});

test('parcel relays remain repeatable with explicit restart and three handoffs per pay',()=>{
    let s={...normalizeLocalLife(),pamphletRead:true};
    for(let run=0;run<2;run++) {
        s=localLifeAction(s,c(),'parcel').state;
        s=localLifeAction(s,c({location:'Eastern mill'}),'parcel').state;
        const finish=localLifeAction(s,c(),'parcel');assert.equal(finish.native.money,8);s=finish.state;
        assert.equal(s.parcelRuns,run+1);assert.equal(localLifeAction(s,c(),'parcel').ok,false);
        const again=localLifeAction(s,c(),'parcel_again');assert.equal(again.ok,true);assert.equal(again.native.money,0);s=again.state;
    }
});
