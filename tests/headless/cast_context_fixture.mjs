// P5/P6 timed journey plus untimed actor-read equivalence probes. Private scratch life only.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const [dir,kind,out]=process.argv.slice(2);
const {boot}=await import(pathToFileURL(dir+'/scripts/headless/runner.mjs').href);
const {simulationFacts}=await import(pathToFileURL(dir+'/src/simulation_effects.js').href);
const {syncLotmCast}=await import(pathToFileURL(dir+'/src/book_world_lotm_cast_host.js').href);
const pack=JSON.parse(await readFile(dir+'/private_packs/lotm-cast/cast.json','utf8'));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const g=await boot(null,{heroName:null,seed:37});let result;
try{
 await g.module.p5CastReady();await g.settle();
 assert.equal(kind,'beside');
 await g.fill('[aria-label="Other known panels"]','lotm');
 await g.click('[data-lotm="pick_beside"]');await g.click('[data-lotm="enroll_beside"]');await g.settle();
 const state=()=>g.internals.expansionState,registry=g.internals.expeditionRegistry;
 const roles=pack.people.filter(p=>p.tier==='role'&&!p.sameActorAs&&state().simulation.people[p.id]);
 const where=s=>Object.fromEntries(roles.map(p=>[p.id,s.simulation.people[p.id].location]));
 const samples=[],sample=()=>{
  const s=state(),contexts=g.module.p7Contexts(),facts={};
  for(const [id,c] of Object.entries(contexts))facts[id]=digest(simulationFacts(s,{...c,actorId:id},registry));
  samples.push({clock:s.clock,where:where(s),facts});
 };
 g.module.setClockSpanModeForTests('span');sample();
 const mt=performance.now();g.internals.update_timer(1);await g.settle();const minuteMs=performance.now()-mt;sample();
 const close=g.module.openStepperBatch(false),start=state().clock,t=performance.now();let consumed=0,calls=0;
 while(consumed<349){assert.ok(calls++<350);const n=g.internals.update_timer(349-consumed,'wait');assert.ok(n>0);consumed+=n;}
 close();await g.settle();const waitMs=performance.now()-t;sample();
 const journeyState=JSON.stringify(state()),journeySave=g.internals.create_save();
 // All role reads use the eager facts API. Sample boundary-adjacent clocks and
 // compare against the frozen source without saving these disposable projections.
 const base=g.module.p7Contexts().player,explicit=[];
 for(const minute of [0,1,99,100,349,350,1440]){
  const copy=structuredClone(state());copy.clock=minute;syncLotmCast(copy);
  explicit.push({minute,where:where(copy),facts:Object.fromEntries(roles.map(p=>[p.id,digest(simulationFacts(copy,
   {...base,actorId:p.id,targetId:'player',facts:{...base.facts,location:copy.simulation.people[p.id].location}},registry))]))});
 }
 // Same-clock observation and body changes promote an otherwise remote role.
 const first=roles[0]?.id;let promoted=null;
 if(first){
  const s=state();s.simulation.people[first].location=s.simulation.people.player.location;
  s.simulation.people[first].body={fixtureInput:2};const contexts=g.module.p7Contexts();assert.ok(contexts[first]);
  promoted=simulationFacts(s,contexts[first],registry);assert.equal(promoted['body.fixtureInput'],2);
 }
 assert.deepEqual(g.errors,[]);
 result={kind,minuteMs,ms:waitMs,consumed,delta:JSON.parse(journeyState).clock-start,calls,samples,explicit,promoted,state:journeyState,save:journeySave};
}finally{g.close();}
await writeFile(out,JSON.stringify(result));
console.log(JSON.stringify({minuteMs:result.minuteMs,waitMs:result.ms,samples:result.samples.length,explicit:result.explicit.length}));
