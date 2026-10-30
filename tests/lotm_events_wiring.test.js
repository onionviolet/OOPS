import test from 'node:test';
import assert from 'node:assert/strict';
import {settleLotmEvents,setPrivateEvents,LOTM_EVENTS_SETTLED as KEY} from '../src/book_world_lotm_events.js';
const pack={schema:1,world:'lotm',lines:{'news.fire':'A warehouse fire in the docks was in the papers.','news.private':'Secret.'},events:[
 {id:'e.fire',key:'k.fire',kind:'public_event',placement:'ordinal',scope:'public',evidence:'S',lineKey:'news.fire',spread:[{route:'newspaper',delayDays:1}],ordinal:{beat:'b2'}},
 {id:'e.wit',key:'k.wit',kind:'canon_beat',placement:'ordinal',scope:'private',evidence:'S',lineKey:'news.private',witnessedByLead:true,spread:[],ordinal:{beat:'b2'}},
 {id:'e.tele',key:'k.tele',kind:'public_event',placement:'ordinal',scope:'public',evidence:'S',lineKey:'news.fire',spread:[{route:'telegram',delayDays:0}],ordinal:{beat:'b2'}}]};
const days=[{scene:'b1',day:1},{scene:'b2',day:2}];
const run=(ledger,day,reached)=>settleLotmEvents({pack,ledger,days,day,reached:new Set(reached)});
test('no pack means no change', () => {
 assert.deepEqual(settleLotmEvents({pack:null,ledger:{facts:{}},days,day:2,reached:new Set()}),{writes:[],reports:[],settledDay:undefined});
 setPrivateEvents(null);
});
test('first run only records the day; news is not backfilled', () => {
 assert.deepEqual(run({facts:{}},1,['b1']),{writes:[],reports:[],settledDay:1});
});
test('a witnessed beat lands on its day, a paper one a day later, and a missed route never', () => {
 const day2=run({facts:{[KEY]:1}},2,['b1','b2']);
 assert.deepEqual(day2.reports.map(r=>[r.id,r.kind]),[['event:e.wit','events']]);
 assert.equal(day2.settledDay,2);
 const day3=run({facts:{[KEY]:2}},3,['b1','b2']);
 assert.deepEqual(day3.reports.map(r=>[r.id,r.kind]),[['event:e.fire','background']]);
 assert.equal(day3.writes[0].effect.basis.route,'newspaper');
 assert.ok(!day3.reports.some(r=>r.id==='event:e.tele'),'telegram is not a lead channel');
 assert.equal(run({facts:{[KEY]:3}},3,['b1','b2']).reports.length,0,'a settled day writes nothing twice');
});
test('a beat not yet reached does not run', () => {
 assert.equal(run({facts:{[KEY]:1}},2,['b1']).reports.length,0);
});
