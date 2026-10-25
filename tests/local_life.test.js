import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeLocalLife, advanceLocalLife as advanceWithStream, localLifeAction, localLifeView, localLifeQuestView, LOCAL_LIFE_BALANCE, MEAL_SCHEDULE, localSearchMethod, recordLocalPurchases} from '../src/absorb_c2/local_life.js';
import {createLocalLifePanel} from '../src/absorb_c2/panel.js';
import {grantEarnedTitles, titleView} from '../src/titles.js';
import {createDiscoveryCuePolicy} from '../src/native_discovery_policy.js';

// absorb_c2: original fixture scope retained.
{
// Procgen requires a saved stream; calls that roll nothing get a fixed no-hit draw.
const advanceLocalLife=(raw,c,rng=()=>.999)=>advanceWithStream(raw,c,rng);
const frame=(overrides={})=>({worldId:'base.frontier',location:'Village',alive:true,idle:true,clock:0,calendarMinute:720,
    perception:0,money:20,foodPoisonRemaining:0,...overrides});
test('C2 compatibility: absent saves default empty; unsupported or malformed containers reject',()=>{
    const s=normalizeLocalLife();assert.equal(s.mealClaim,null);assert.equal(s.poisonMinutes,0);assert.equal(s.hubDay,null);
    assert.equal(s.searches.Village.found,false);
    assert.deepEqual(normalizeLocalLife(undefined),s);
    assert.throws(()=>normalizeLocalLife({schema:99,meals:8}),/Unsupported/);
    for(const malformed of [null,[],false,3,'saved']) assert.throws(()=>normalizeLocalLife(malformed),/Invalid/);
    assert.equal(normalizeLocalLife({mealClaim:-1,searches:{Village:{misses:1e8}}}).searches.Village.misses,100);
});
test('C2 source balance and readable documentation remain in agreement',()=>{
    const baseline=JSON.parse(readFileSync(new URL('../src/absorb_c2/balance.json',import.meta.url)));
    assert.deepEqual(baseline.searchAndExposure,LOCAL_LIFE_BALANCE);assert.deepEqual(baseline.meal,MEAL_SCHEDULE);
    const doc=readFileSync(new URL('../docs/gm/dispatch/absorb-2026-10-11/W-C2.md',import.meta.url),'utf8');
    for(const text of ['40%','0.25','12:00–14:00','15 played minutes','5 coins'])assert.ok(doc.includes(text),text);
});
test('C2 exposure is played, bounded by actual remaining poison and replay resistant',()=>{
    let s=advanceLocalLife(undefined,frame({foodPoisonRemaining:20})).state;
    let p=advanceLocalLife(s,frame({clock:3,foodPoisonRemaining:2}));
    assert.equal(p.native.skillXp['Poison resistance'],.5);assert.equal(p.state.poisonMinutes,2);
    assert.deepEqual(advanceLocalLife(p.state,frame({clock:3,foodPoisonRemaining:20})).native.skillXp,{});
    assert.deepEqual(advanceLocalLife(p.state,frame({clock:5,worldId:'elsewhere',foodPoisonRemaining:20})).native.skillXp,{});
    assert.equal(s.poisonMinutes,0,'planning must not mutate the prior live state');
});
test('C2 five-minute searches persist misses, cap chance, and award a finite native item once',()=>{
    let s=localLifeAction(undefined,frame(),'look').state;
    let p=advanceLocalLife(s,frame({clock:4}),()=>.999);assert.equal(p.state.searches.Village.misses,0);
    p=advanceLocalLife(p.state,frame({clock:5}),()=>.999);assert.equal(p.state.searches.Village.misses,1);
    s=JSON.parse(JSON.stringify(p.state));assert.match(localLifeView(s,frame()).summary,/15%/);
    s.searches.Village.misses=100;
    assert.match(localLifeView(s,frame({perception:1e5})).summary,/40%/);
    p=advanceLocalLife(s,frame({clock:10}),()=>.39);assert.deepEqual(p.native.items,[{item_id:'Linen cloth',count:1}]);
    assert.equal(p.state.looking,false);assert.equal(localLifeAction(p.state,frame(),'look').ok,false);
    assert.deepEqual(advanceLocalLife(p.state,frame({clock:11})).native.items,[]);
});
test('C2 interruptions and clock jumps never replay unbounded idle searches',()=>{
    let s=localLifeAction(undefined,frame(),'look').state;
    let p=advanceLocalLife(s,frame({clock:1000,idle:false}));assert.equal(p.state.looking,false);assert.deepEqual(p.native.items,[]);
    s=localLifeAction(undefined,frame(),'look').state;
    p=advanceLocalLife(s,frame({clock:1000}),()=>.999);assert.equal(p.state.searches.Village.misses,1);
    p=advanceLocalLife(p.state,frame({clock:1001,location:'Shack'}));assert.equal(p.state.looking,false);
    s=localLifeAction(undefined,frame({location:'Shack'}),'look').state;
    p=advanceLocalLife(s,frame({location:'Shack',clock:5}),()=>0);assert.deepEqual(p.native.items,[{item_id:'Stale bread',count:1}]);
});
test('C2 hub contact has common-clock cadence, saved misses and one daily occurrence',()=>{
    let s=advanceLocalLife(undefined,frame()).state;
    let p=advanceLocalLife(s,frame({clock:14}),()=>0);assert.equal(p.state.encounter,null);
    p=advanceLocalLife(p.state,frame({clock:15}),()=>.999);assert.equal(p.state.hubMisses,1);
    p=advanceLocalLife(JSON.parse(JSON.stringify(p.state)),frame({clock:30}),()=>.25);assert.equal(p.state.encounter,'runner');
    assert.equal(localLifeAction(p.state,frame({clock:30,money:4}),'help').ok,false);
    const before=structuredClone(p.state),help=localLifeAction(p.state,frame({clock:30}),'help');
    assert.deepEqual(p.state,before);assert.equal(help.native.money,-5);assert.equal(help.native.skillXp.Perception,2);
    assert.equal(advanceLocalLife(help.state,frame({clock:100}),()=>0).state.encounter,null);
    const decline=localLifeAction(p.state,frame({clock:30}),'decline');assert.equal(decline.native.money,0);
    p=advanceLocalLife(decline.state,frame({clock:110,calendarMinute:2160}),()=>0);assert.equal(p.state.encounter,'runner');
});
test('C2 free meal derives from native calendar, persists claim, and skips missed days',()=>{
    assert.equal(localLifeAction(undefined,frame({calendarMinute:719}),'meal').ok,false);
    assert.equal(localLifeAction(undefined,frame({calendarMinute:840}),'meal').ok,false);
    const p=localLifeAction(undefined,frame(),'meal');assert.equal(p.ok,true);assert.equal(p.state.mealClaim,0);
    assert.deepEqual(p.native.items,[{item_id:'Stale bread',count:1}]);
    const reload=JSON.parse(JSON.stringify(p.state));assert.equal(localLifeAction(reload,frame(),'meal').ok,false);
    const later=localLifeAction(reload,frame({calendarMinute:720+1440*10}),'meal');
    assert.equal(later.state.meals,2);assert.equal(later.native.items[0].count,1);
});
test('C2 no random rolls on rendering or invalid actions; rollback keeps claims and money unchanged',()=>{
    const s=normalizeLocalLife(),copy=structuredClone(s);
    assert.equal(localLifeView(s,frame({idle:false})).rows.every(r=>r.disabled),true);
    assert.equal(localLifeAction(s,frame({worldId:'elsewhere'}),'meal').ok,false);
    localLifeView(s,frame());localLifeAction(s,frame(),'meal');assert.deepEqual(s,copy);
    const retry=localLifeAction(s,frame(),'meal');assert.equal(retry.ok,true,'discarding a failed save plan does not consume a claim');
    const old={...s,lastClock:30,lastHubAttempt:0};
    assert.equal(advanceLocalLife(old,frame({clock:30}),()=>{throw new Error('load must not roll');}).state.encounter,null);
});
test('C2 panel reattaches after native location menu clears unchanged view',()=>{
    class Element {
        constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.parentElement=null;}
        append(...children){for(const child of children){child.remove();this.children.push(child);child.parentElement=this;}}
        remove(){if(this.parentElement){const list=this.parentElement.children;list.splice(list.indexOf(this),1);this.parentElement=null;}}
        replaceChildren(...children){for(const child of [...this.children])child.remove();this.append(...children);}
        setAttribute(){}
        addEventListener(){}
        querySelector(){return null;}
    }
    const prior=globalThis.document;
    globalThis.document={createElement:tag=>new Element(tag),activeElement:null};
    try {
        const container=new Element('div'),p=createLocalLifePanel({container,
            read:()=>({state:normalizeLocalLife(),context:frame()}),act:()=>{}});
        assert.equal(p.panel.parentElement,container);
        const body=p.panel.children[1],before=[...body.children];
        container.replaceChildren();assert.equal(p.panel.parentElement,null);
        p.render();assert.equal(p.panel.parentElement,container);
        assert.deepEqual(body.children,before,'unchanged view should reattach without rebuilding content');
        assert.equal(container.children.filter(n=>n===p.panel).length,1);
        p.render();assert.equal(container.children.length,1);p.destroy();
    } finally {if(prior===undefined)delete globalThis.document;else globalThis.document=prior;}
});

test('parcel first row and quest disclose the mill prerequisite until it is open',()=>{
 const s={pamphletRead:true};
 assert.match(localLifeView(s,frame({millUnlocked:false})).rows.find(r=>r.id==='parcel').label,/Cave room.*report/);
 assert.match(localLifeQuestView(s,{millUnlocked:false}).find(q=>q.id==='village.parcel').objective,/Cave room.*report/);
 assert.doesNotMatch(localLifeQuestView(s,{millUnlocked:true}).find(q=>q.id==='village.parcel').objective,/Before collecting/);
});

test('ongoing local search changes method as light/means change and retains completed work',()=>{
 let s=advanceLocalLife(undefined,frame({location:'Shack',illumination:60})).state;
 s=localLifeAction(s,frame({location:'Shack',illumination:60}),'look').state;
 s=advanceLocalLife(s,frame({location:'Shack',illumination:60,clock:2})).state;assert.equal(s.searchProgress,2);
 s=advanceLocalLife(s,frame({location:'Shack',illumination:0,clock:4})).state;assert.equal(s.searchProgress,3);
 const before=structuredClone(s),view=localLifeView(s,frame({location:'Shack',illumination:0,clock:4}));
 assert.match(view.readiness,/feel nearby surfaces/);assert.match(view.rows[0].label,/3\/5 search work/);assert.deepEqual(s,before);
 s=normalizeLocalLife(JSON.parse(JSON.stringify(s)));assert.equal(s.searchProgress,3);
 const done=advanceLocalLife(s,frame({location:'Shack',illumination:0,nightVisionRatio:.5,clock:6}),()=>0);
 assert.equal(done.state.searches.Shack.found,true);assert.equal(done.native.items.length,1);
 assert.equal(localSearchMethod({illumination:0,nightVisionRatio:.5}).id,'visual');
 assert.equal(localSearchMethod({illumination:0}).id,'touch');
 assert.equal(localSearchMethod({illumination:80}).id,'visual');
 assert.equal(advanceLocalLife(done.state,frame({location:'Shack',illumination:0,clock:30}),()=>0).native.items.length,0);
});

}

// p23_life_loops: original fixture scope retained.
{
// Procgen requires a saved stream; calls that roll nothing get a fixed no-hit draw.
const advanceLocalLife=(raw,c,rng=()=>.999)=>advanceWithStream(raw,c,rng);
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
    assert.deepEqual(grantEarnedTitles({}, {home_minutes:p.homeMinutes,items_bought:p.itemsBought},0),['homebody','local_customer','quiet_hour','pantry_keeper']);
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

}

