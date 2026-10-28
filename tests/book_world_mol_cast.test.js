import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMolCast,molAnchorProbes} from '../src/book_world_mol_cast.js';
import {whereabouts,lintAnchors} from '../src/cast_schedule.js';
import {defineBeats,resolveBeats,newBeatState} from '../src/beat_records.js';
const e={label:'I',locator:'en b1 c1 p24'};
const fixture=()=>({schema:'mol-cast/1',people:[{id:'fixture.person.arden',name:'Arden Vale',tier:'principal',...e,relations:[],knows:[],wants:[]}],references:[],
 places:[{id:'fixture.place.room',name:'Willow room',openingHours:[],...e},{id:'fixture.place.hall',name:'Copper hall',openingHours:[],...e}],
 days:[{scene:'fixture.scene.1',day:1,mark:'FIX-D1',...e},{scene:'fixture.scene.2',day:null,...e}],timing:{window:[1,3]},
 schedule:[{id:'fixture.row.1',actor:'fixture.person.arden',place:'fixture.place.room',scene:'fixture.scene.1',day:1,until:1,recurrence:'once',from:0,to:60,...e},
 {id:'fixture.row.2',actor:'fixture.person.arden',place:'fixture.place.hall',scene:'fixture.scene.1',day:1,until:1,recurrence:'once',from:60,to:120,...e},
 {id:'fixture.row.3',actor:'fixture.person.arden',place:'fixture.place.room',scene:'fixture.scene.2',recurrence:'irregular',from:120,to:180,...e}],
 beats:[{id:'fixture.beat.1',actor:'fixture.person.arden',place:'fixture.place.room',scene:'fixture.scene.1',dayIndex:1,until:1,scope:{footprint:['fixture.place.room'],modes:[]},effects:[{fact:'fixture.event.1',value:true}],...e}],
 anchors:[],remoteWhereabouts:[],clockClaims:[],placeAliases:[],resets:[]});
const at=(day,minute)=>({calendar:{year:0,month:1,day,day_count:day,hour:Math.floor(minute/60),minute:minute%60}});
test('invented cast exercises date-bound movement, irregular absence and deterministic beat consumer',()=>{
 const p=fixture();assert.deepEqual(validateMolCast(p),[]);assert.deepEqual(lintAnchors(p.schedule,molAnchorProbes(p)),[]);
 assert.equal(whereabouts(p.schedule,p.people[0].id,at(1,0)).place,p.places[0].id);
 assert.equal(whereabouts(p.schedule,p.people[0].id,at(1,60)).place,p.places[1].id);
 assert.equal(whereabouts(p.schedule,p.people[0].id,at(2,0)).place,null);
 assert.doesNotThrow(()=>defineBeats(p.beats));
 assert.deepEqual(resolveBeats(p.beats,newBeatState(),1),resolveBeats(p.beats,newBeatState(),1));
});
test('validator rejects excluded dates, missing references, unphased activation and other-loop anchors',()=>{
 const cases=[p=>p.days[0].day=2,p=>p.days[0].excluded=true,p=>p.schedule[0].actor='absent',p=>p.beats[0].place='absent',
 p=>p.schedule[2].recurrence='daily',p=>p.people[0].locator='en b1 c6 p1',p=>p.people[0].name='x'.repeat(201),
 p=>p.anchors.push({actor:p.people[0].id,place:p.places[0].id,day:1,loop:'later',...e})];
 for(const mutate of cases){const p=fixture();mutate(p);assert.ok(validateMolCast(p).length);}
});
