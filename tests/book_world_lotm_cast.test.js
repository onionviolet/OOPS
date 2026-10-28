import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLotmCast,lotmAnchorProbes} from '../src/book_world_lotm_cast.js';
import {lintAnchors,whereabouts} from '../src/cast_schedule.js';
import {resolveBeats,newBeatState} from '../src/beat_records.js';
const evidence={label:'I',locator:'invented source p1'};
const fixture=()=>({schema:'lotm-cast/1',people:[{id:'fixture.person.arden',name:'Arden Vale',tier:'principal',...evidence,knows:[{fact:'Knows the way home.',since:{locator:'invented source p1',window:[1,2]},...evidence}]}],references:[],
 places:[{id:'fixture.place.home',name:'Willow flat',openingHours:[],...evidence},{id:'fixture.place.remote',name:'Remote house',openingHours:[],anchorOnly:true,...evidence}],
 schedule:[{id:'fixture.shift.1',actor:'fixture.person.arden',place:'fixture.place.home',recurrence:'daily',from:0,to:60,until:2,label:'fill',basis:'Invented morning routine.'}],
 beats:[{id:'fixture.beat.1',actor:'fixture.person.arden',place:'fixture.place.home',dayIndex:1,until:2,needs:{fact:'fixture.window',value:true},window:{label:'U'},effects:[{fact:'fixture.event',value:true}],...evidence}],
 anchors:[],remoteWhereabouts:[],placeAliases:[],clockClaims:[]});
const at=day=>({calendar:{year:0,month:1,day,day_count:day,hour:0,minute:0}});
test('synthetic daily fill ends at its boundary and undated beats wait for their gate',()=>{
 const p=fixture();assert.deepEqual(validateLotmCast(p),[]);
 assert.equal(whereabouts(p.schedule,p.people[0].id,at(2)).place,p.places[0].id);
 assert.equal(whereabouts(p.schedule,p.people[0].id,at(3)).place,null);
 assert.equal(resolveBeats(p.beats,newBeatState(),1).state.done[p.beats[0].id].status,'deferred');
 assert.equal(resolveBeats(p.beats,newBeatState({'fixture.window':true}),1).state.done[p.beats[0].id].status,'carried');
 p.anchors.push({actor:p.people[0].id,place:p.places[1].id,dayWindow:[1,2],...evidence});
 assert.ok(lintAnchors(p.schedule,lotmAnchorProbes(p)).length);assert.ok(validateLotmCast(p).includes('Forward anchor conflict'));
});
test('validator preserves provenance, reference, address, date and string protections',()=>{
 for(const mutate of [p=>p.schedule[0].basis='',p=>p.schedule[0].from=1440,p=>p.beats[0].actor='absent',
 p=>p.beats[0].place=p.places[1].id,p=>delete p.beats[0].needs,p=>p.people[0].knows[0].since=null,p=>p.people[0].name='x'.repeat(201)]){
  const p=fixture();mutate(p);assert.ok(validateLotmCast(p).length);
 }
});
