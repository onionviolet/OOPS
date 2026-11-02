import test from 'node:test';
import assert from 'node:assert/strict';
import {castLocalClock} from '../src/book_world_lotm_cast_host.js';
import {waitUntilOptions} from '../src/wait_until.js';
import {canonPullVisible} from '../src/canon_pull_panel.js';
import {BE_PROFILE_ID,seatAllowsPanel} from '../src/seat_profiles.js';
import {registerLocalClockSource,readLocalClock,todayDigestView} from '../src/today_strip.js';
import {notebookAttention,registerOwnedWorkPanel} from '../src/adventure_notebook.js';

const state=(entryProfile=BE_PROFILE_ID,worldId='book.lotm.tingen')=>({clock:100,lotm:{entryProfile,initializedAt:100},
 actors:{player:{worldId}},simulation:{people:{player:{location:'fixture.room'}}}});
test('the local clock and wait quote share elapsed minutes and leave other worlds alone',()=>{
 const s=state();assert.equal(castLocalClock(s).clock,'Day 1, night · 00:00');
 assert.match(waitUntilOptions(s.clock,{epoch:s.lotm.initializedAt})[0].label,/360 min/);
 s.clock+=2;assert.equal(castLocalClock(s).clock,'Day 1, night · 00:02');
 assert.match(waitUntilOptions(s.clock,{epoch:s.lotm.initializedAt})[0].label,/358 min/);
 s.clock=s.lotm.initializedAt+360;assert.equal(castLocalClock(s).clock,'Day 1, dawn · 06:00');
 assert.match(waitUntilOptions(s.clock,{epoch:s.lotm.initializedAt})[0].label,/morning · 120 min/);
 s.clock=s.lotm.initializedAt+720;assert.equal(castLocalClock(s).clock,'Day 1, noon · 12:00');
 assert.equal(castLocalClock(state(BE_PROFILE_ID,'fixture.other')),null);
 assert.equal(castLocalClock(state('ordinary')),null);
 assert.equal(castLocalClock(null),null);
});
test('the active story remains available to local seats but not an inactive slice or another world',()=>{
 const s=state(),active={beats:{day:1},records:[]},inactive={beats:{day:0},records:[]};
 assert.equal(canonPullVisible(s,active),true);assert.equal(canonPullVisible(s,inactive),false);
 assert.equal(canonPullVisible(state(BE_PROFILE_ID,'fixture.other'),active),false);
 assert.equal(canonPullVisible(state('lotm.early_tingen.canon_beside@1'),active),true);
 assert.equal(canonPullVisible(state('ordinary'),active),true);
 const panel={id:'canon-pull',perspective:'book.lotm.tingen'};
 assert.equal(seatAllowsPanel(s,panel),true);assert.equal(seatAllowsPanel(state(BE_PROFILE_ID,'fixture.other'),panel),false);
});
test('scoped clock readers follow world changes and fall back when unavailable',()=>{
 let world=null,loading=true;
 const unready=registerLocalClockSource(()=>{if(loading)throw Error('not ready');return null;});
 const a=registerLocalClockSource(()=>world==='a'?{clock:'A time',date:''}:null);
 const b=registerLocalClockSource(()=>world==='b'?{clock:'B time',date:''}:null);
 try{assert.equal(readLocalClock(),null);world='a';assert.equal(readLocalClock().clock,'A time');
  loading=false;world='b';assert.equal(readLocalClock().clock,'B time');world=null;assert.equal(readLocalClock(),null);
 }finally{unready();a();b();}
});
test('compact Today does not present another clock\'s activity hours as local',()=>{
 const v={clock:'Local time',place:'Here',rows:[{name:'Workshop',open:true}],work:{count:0,nextIn:null}};
 assert.deepEqual(todayDigestView({...v,usesLocalClock:true}).open,[]);
 assert.deepEqual(todayDigestView({...v,usesLocalClock:false}).open,['Workshop']);
});
test('local timed work stays in its own panel while unrelated work retains Notebook attention',()=>{
 const commands=new Map([['fixture.local',{group:'book_lotm'}],['fixture.other',{group:'body'}]]);
 const registry={simulation:{commands},actions:new Map()};
 const s={clock:10,actors:{player:{facts:{},techniques:{}}},pending:[],simulation:{sessions:{},jobs:[{id:'job',actorId:'player',commandId:'fixture.local',label:'Local work',due:12}],events:{}}};
 const unregister=registerOwnedWorkPanel((_work,definition)=>definition?.group==='book_lotm'?'lotm_panel':null);
 try{assert.deepEqual(notebookAttention(s,registry),{id:'job',view:'here',panel:'lotm_panel',ownPanel:true,text:'Local work · 2 min remaining'});
  s.simulation.jobs[0].commandId='fixture.other';const other=notebookAttention(s,registry);
  assert.equal(other.panel,'body_panel');assert.equal(other.ownPanel,undefined);
 }finally{unregister();}
});

test('the lead view obtains one native context snapshot per read, without retaining it across renders',async()=>{
 const {fresh,hostOver,ctx}=await import('./lotm_helpers.js');const p=fresh();p.state.lotm.entryProfile='book.lead.be@1';p.state.lotm.runMode='canon';let calls=0;
 const {host}=hostOver(p,{context:()=>{calls++;return ctx(p);}});
 host.view();assert.equal(calls,1);host.view();assert.equal(calls,2);
});
