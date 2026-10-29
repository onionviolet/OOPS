import test from 'node:test';
import assert from 'node:assert/strict';
import {compileCastSchedule,whereabouts} from '../src/cast_schedule.js';
import {createWakeQueue} from '../src/wake_queue.js';
const at=minute=>({calendar:{year:Math.floor(minute/(360*1440)),month:Math.floor(minute/1440%360/30)+1,day:Math.floor(minute/1440)%30+1,day_count:Math.floor(minute/1440)+1,hour:Math.floor(minute%1440/60),minute:minute%60}});
test('compiled schedule preserves projection and skips all supported recurrence gaps',()=>{
 const rows=['once','daily','weekdays','weekly','monthly','term','seasonal','yearly','irregular'].flatMap((recurrence,i)=>[
  {actor:`fixture.person.${i}`,place:'fixture.place.home',day:2,from:'morning',to:'noon',recurrence,source:'routine',termDays:9,until:400},
  {actor:`fixture.person.${i}`,place:'fixture.place.visit',day:3,from:550,to:600,recurrence:'once',source:'canon'},
 ]);
 const index=compileCastSchedule(rows);
 for(let i=0;i<9;i++){
  const actor=`fixture.person.${i}`;let wake=0,projected;
  for(let minute=0;minute<400*1440;minute+=113){
   if(minute>=wake){projected=index.whereabouts(actor,at(minute)).place;wake=index.nextBoundary(actor,at(minute))??Infinity;assert.ok(wake>minute);}
   assert.deepEqual(index.whereabouts(actor,at(minute)),whereabouts(rows,actor,at(minute)));
   assert.equal(projected,whereabouts(rows,actor,at(minute)).place,`${i} minute ${minute}`);
  }
 }
});
test('overlap start and end wake even when a lower-ranked row was already active',()=>{
 const rows=[{actor:'fixture.person.a',place:'fixture.place.a',day:1,from:0,to:100,source:'routine'},{actor:'fixture.person.a',place:'fixture.place.b',day:1,from:20,to:30,source:'canon'}];
 const index=compileCastSchedule(rows);
 assert.equal(index.nextBoundary('fixture.person.a',at(1)),20);
 assert.equal(index.nextBoundary('fixture.person.a',at(20)),30);
 assert.equal(index.whereabouts('fixture.person.a',at(30)).place,'fixture.place.a');
});
test('per-actor due reads retain wakes and replacement/cancel semantics',()=>{
 const q=createWakeQueue();q.register('fixture.a',20);q.register('fixture.b',10);
 assert.equal(q.hasDue('fixture.a',10),false);assert.equal(q.hasDue('fixture.b',10),true);
 q.register('fixture.b',30);assert.equal(q.hasDue('fixture.b',10),false);
 q.cancel('fixture.a');assert.equal(q.hasDue('fixture.a',100),false);
 assert.deepEqual(q.due(30),[{id:'fixture.b',at:30}]);assert.equal(q.hasDue('fixture.b',30),false);
});

test('expired windows cannot leave a wake queued at the current minute',()=>{
 const rows=[{actor:'fixture.person.a',place:'fixture.place.a',day:1,until:1,from:20,to:30,recurrence:'daily'}];
 assert.equal(compileCastSchedule(rows).nextBoundary('fixture.person.a',at(1440+20)),null);
});
