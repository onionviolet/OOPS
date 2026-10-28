import test from 'node:test';
import assert from 'node:assert/strict';
import {waitUntilOptions,runWaitUntil} from '../src/wait_until.js';
import {beatKnowledgeWrites,applyBeatKnowledge} from '../src/beat_knowledge.js';
import {planLotmCastBeats,LOTM_BESIDE_PROFILE,castSettledPeople,nextCastBeatTime} from '../src/book_world_lotm_cast_host.js';
import {newBeatState} from '../src/beat_records.js';
import {applySimulationEffects} from '../src/simulation_effects.js';
import {fresh,registry,I} from './lotm_helpers.js';

test('wait quotes next band and known service appointment on the supplied clock',()=>{
 const q=waitUntilOptions(121,{epoch:100,appointments:[{label:'teacher window',known:true,at:150},{label:'unknown service',at:130}]});
 assert.deepEqual(q.map(x=>x.duration),[339,29]);
 assert.match(q[0].label,/dawn.*339 min/);
 assert.equal(waitUntilOptions(460,{epoch:100})[0].duration,120);
 assert.equal(waitUntilOptions(1500,{epoch:100})[0].duration,40);
});
test('wait uses ordinary minute steps and stops for a local decision, occupation or movement',()=>{
 for(const stop of ['paused','busy','moved','none']){
  let clock=358,place='fixture.home',calls=0;
  const result=runWaitUntil('wait.until.360',{read:()=>({clock,place}),options:r=>waitUntilOptions(r.clock),
   blocked:()=>stop==='busy'&&calls?'A decision needs you.':'',
   advance:()=>{calls++;if(stop!=='paused')clock++;if(stop==='moved')place='fixture.road';}});
  assert.equal(result.interrupted,stop!=='none');
  assert.equal(clock,stop==='paused'?358:stop==='none'?360:359);
 }
 assert.throws(()=>runWaitUntil('wait.until.360',{read:()=>({clock:358}),options:()=>[{id:'wait.until.360',eligible:false,reasons:['Wake first.']}]}),/Wake first/);
 assert.throws(()=>runWaitUntil('wait.until.1',{read:()=>({clock:358}),options:r=>waitUntilOptions(r.clock)}),/no longer offered/);
});
test('a 349 minute wait lands on every due beat in fewer than 20 clock calls',()=>{
 const p=fresh();p.state.lotm.entryProfile=LOTM_BESIDE_PROFILE;
 const epoch=p.state.lotm.initializedAt;p.state.clock=epoch+11;
 const beats=[90,180,350,360];
 const pack={bindings:{days:beats.map((from,i)=>({scene:`fixture.scene.${i}`,day:1,from})),
  beats:beats.map((_,i)=>({id:`fixture.beat.${i}`,scene:`fixture.scene.${i}`}))}};
 const visits=[],requests=[];
 const result=runWaitUntil(`wait.until.${epoch+360}`,{
  read:()=>({clock:p.state.clock,place:'fixture.home',state:p.state}),
  options:()=>[{id:`wait.until.${epoch+360}`,at:epoch+360,eligible:true}],
  nextBoundary:(r,target)=>nextCastBeatTime(r.state,target,{done:{}},pack),
  advance:n=>{requests.push(n);p.state.clock+=n;visits.push(p.state.clock-epoch);}
 });
 assert.equal(result.minutes,349);assert.equal(result.interrupted,false);
 assert.deepEqual(visits,beats);assert.ok(requests.length<20);
});
test('a clock owner that clips a step falls back to single minutes and rechecks interruption',()=>{
 let clock=0;const calls=[];
 const result=runWaitUntil('wait.until.10',{read:()=>({clock,place:'fixture.home'}),
  options:()=>[{id:'wait.until.10',at:10,eligible:true}],blocked:()=>clock>=5?'A decision needs you.':'',
  advance:n=>{calls.push(n);clock+=calls.length===1?3:n;}});
 assert.deepEqual(calls,[10,1,1]);assert.equal(result.minutes,5);assert.equal(result.interrupted,true);
});
const beat={id:'fixture.beat.lesson',actor:'fixture.teacher',knows:[
 {key:'fixture.private',value:'A private recollection.'},
 {key:'fixture.lesson',value:'The lesson teaches a route.',audience:'present'},
 {key:'fixture.witness',value:'You heard the route.',actor:'player',witnesses:['present','heard']} ]};
test('knowledge is per learner, offscreen outcomes teach actors without teaching the player',()=>{
 const out=beatKnowledgeWrites(beat,{status:'carried'},{at:12,present:['fixture.student','fixture.teacher','player']});
 assert.deepEqual(out.map(w=>[w.effect.actor,w.effect.key]),[['fixture.teacher','fixture.private'],['fixture.teacher','fixture.lesson'],['fixture.student','fixture.lesson']]);
 const heard=beatKnowledgeWrites(beat,{status:'carried'},{at:12,playerExposure:'heard'});
 assert.deepEqual(heard.filter(w=>w.effect.actor==='player').map(w=>w.effect.key),['fixture.witness']);
 assert.deepEqual(beatKnowledgeWrites(beat,{status:'blocked'},{at:12}),[]);
 assert.deepEqual(beatKnowledgeWrites(beat,{status:'altered',altered:0},{at:12}),[]);
 const changed={...beat,altered:[{knows:[{key:'fixture.change',value:'The changed outcome.'}]}]};
 assert.equal(beatKnowledgeWrites(changed,{status:'altered',altered:0},{at:12})[0].effect.key,'fixture.change');
});
test('existing knowledge owner keeps event dates, cause and stronger understanding through JSON roundtrip',()=>{
 const p=fresh();p.state.clock+=20;
 const b={...beat,actor:I.supervisor,knows:[{key:'fixture.lesson',value:'A useful route.',stage:'understood'}]};
 const writes=beatKnowledgeWrites(b,{status:'carried'},{at:p.state.clock-10});
 applyBeatKnowledge(p,writes,(p,e,c)=>applySimulationEffects(p,e,{actorId:'player'},registry,c));
 const before=structuredClone(p.state.simulation.knowledge[I.supervisor]);
 const restored=JSON.parse(JSON.stringify(p));
 assert.deepEqual(restored.state.simulation.knowledge[I.supervisor],before);
 assert.equal(before['fixture.lesson'].at,p.state.clock-10);
 assert.equal(before['fixture.lesson'].cause,beat.id);
 applyBeatKnowledge(p,[{...writes[0],effect:{...writes[0].effect,stage:'seen',value:'Less clear.'}}],(p,e,c)=>applySimulationEffects(p,e,{actorId:'player'},registry,c));
 assert.deepEqual(p.state.simulation.knowledge[I.supervisor],before);
 assert.equal(p.state.clock,restored.state.clock);
});
test('host catches up once, preserves private learning and offers only witnessed knowledge in person view',()=>{
 const p=fresh();p.state.lotm.entryProfile=LOTM_BESIDE_PROFILE;
 const at=p.state.lotm.initializedAt+10;p.state.clock=at;
 const b={id:'fixture.beat.host',scene:'fixture.scene',dayIndex:1,actor:I.supervisor,place:'fixture.home',effects:[],
  knows:[{key:'fixture.private',value:'Private lesson.'},{key:'fixture.public',value:'You saw the lesson.',actor:'player',witnesses:['present']}]};
 const pack={people:[{id:I.supervisor,name:'Arden'}],placeAliases:[],reports:{[b.id]:{present:{text:'A lesson takes place.',places:['fixture.home']}}},
  bindings:{days:[{scene:b.scene,day:1,from:10}],beats:[b],schedule:[]}};
 p.state.simulation.people.player.location='fixture.home';
 p.state.simulation.knowledge.player={['book.lotm.cast.met.'+I.supervisor]:{value:'Met'}};
 const out=planLotmCastBeats(p.state,newBeatState(),pack);
 assert.equal(out.knowledgeWrites.length,2);
 applyBeatKnowledge(p,out.knowledgeWrites,(p,e,c)=>applySimulationEffects(p,e,{actorId:'player'},registry,c));
 const view=castSettledPeople(p.state,out.ledger,pack);
 assert.deepEqual(view[0].details,['You saw the lesson.']);
 assert.equal(planLotmCastBeats(p.state,out.ledger,pack).knowledgeWrites.length,0);
 p.state.clock+=100;
 const catchup=planLotmCastBeats(p.state,newBeatState(),pack);
 assert.equal(catchup.knowledgeWrites.length,1);
 assert.equal(catchup.knowledgeWrites[0].at,at);
 assert.equal(catchup.knowledgeWrites[0].effect.actor,I.supervisor);
});
