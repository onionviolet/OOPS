// Full-game differential, deliberately separate from the ordinary unit glob.
// Baseline is a frozen pre-P6 checkout; candidate uses current owned files plus
// the prepared composition-root patch. Private pack copies stay in temp dirs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readdir,symlink,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {compileCastSchedule,whereabouts} from '../../src/cast_schedule.js';
const exec=promisify(execFile),root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const at=minute=>({calendar:{year:Math.floor(minute/(360*1440)),month:Math.floor(minute/1440%360/30)+1,day:Math.floor(minute/1440)%30+1,day_count:Math.floor(minute/1440)+1,hour:Math.floor(minute%1440/60),minute:minute%60}});
async function snapshot(source,dir,pack){
 for(const name of ['src','scripts','tests','private_packs'])await cp(join(source,name),join(dir,name),{recursive:true});
 for(const e of await readdir(root,{withFileTypes:true}))if(!['.git','src','scripts','tests','private_packs'].includes(e.name))await symlink(join(root,e.name),join(dir,e.name),e.isDirectory()?'dir':'file');
 if(pack)await cp(pack,join(dir,'private_packs/lotm-cast/cast.json'));
 // A supplied diagnostic baseline may already expose these harness ports.
 let main=await readFile(join(dir,'src/main.js'),'utf8');
 if(!main.includes('as p5CastReady'))main+="\nexport {whenCastLoaded as p5CastReady} from './book_world_lotm_cast_days.js';\n";
 if(!main.includes('export {openStepperBatch}'))main+='\nexport {openStepperBatch};\n';
 if(!main.includes('export {setClockSpanModeForTests}'))main+="\nexport {setClockSpanModeForTests} from './clock_owner.js';\n";
 if(!main.includes('export const p5EnrollBe'))main+="\nexport const p5EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\n";
 await writeFile(join(dir,'src/main.js'),main);
}
test('candidate role projections equal always-update path at sampled minutes',async t=>{
 const path=process.env.YAIRPG_TIER_PACK||join(root,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-candidate-2026-10-29.json');
 let pack;try{pack=JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT'){t.skip('Private candidate fixture absent');return;}throw e;}
 const actors=new Map(pack.people.map(p=>[p.id,p.sameActorAs||p.id]));
 const aliases=new Map(pack.placeAliases.flatMap(a=>[[a.id,a.place],[a.indexId,a.place]]));
 const rows=pack.bindings.schedule.map(r=>({...r,actor:actors.get(r.actor)||r.actor,place:aliases.get(r.place)||r.place}));
 const index=compileCastSchedule(rows),samples=[0,1,19,20,59,60,99,100,299,300,349,350,719,720,1439,1440,1441,2879,2880,10080,34559];
 for(const p of pack.people.filter(p=>p.tier==='role'&&!p.sameActorAs)){
  let wake=0,place;
  for(const minute of samples){
   if(minute>=wake){place=index.whereabouts(p.id,at(minute)).place;wake=index.nextBoundary(p.id,at(minute))??Infinity;}
   assert.equal(place,whereabouts(rows,p.id,at(minute)).place);
  }
 }
 t.diagnostic(`${pack.people.filter(p=>p.tier==='role'&&!p.sameActorAs).length} role people, ${samples.length} sampled minutes`);
});
test('candidate host role bodies match always-update locations across schedule edges',async t=>{
 const path=process.env.YAIRPG_TIER_PACK||join(root,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-candidate-2026-10-29.json');
 let pack;try{pack=JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT'){t.skip('Private candidate fixture absent');return;}throw e;}
 const fetch=globalThis.fetch;
 globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(pack)});
 let host;
 try{host=await import('../../src/book_world_lotm_cast_host.js');const days=await import('../../src/book_world_lotm_cast_days.js');await days.whenCastLoaded();}
 finally{globalThis.fetch=fetch;}
 const {LOTM_IDS:I}=await import('../../src/book_world_lotm_ids.js');
 const state={clock:0,lotm:{entryProfile:host.LOTM_BESIDE_PROFILE,initializedAt:0},worlds:{[I.world]:{facts:{}}},
  simulation:{people:{player:{location:pack.host.profile.start},...Object.fromEntries(host.castPeople.map(p=>[p.id,{location:p.location}]))}}};
 const roles=pack.people.filter(p=>p.tier==='role'&&!p.sameActorAs&&p.status!=='historical-reference').map(p=>p.id);
 const expected=new Map(roles.map(id=>[id,state.simulation.people[id].location]));
 const samples=new Set([0,1,349,350,1439,1440,34559]);
 for(const row of host.castSchedule){
  if(row.recurrence==='irregular')continue;
  for(let day=1;day<=24;day++){
   if(row.recurrence!=='daily'&&day!==row.day)continue;
   for(const edge of [row.from,row.to])if(typeof edge==='number')for(const offset of [-1,0,1]){const minute=(day-1)*1440+edge+offset;if(minute>=0&&minute<34560)samples.add(minute);}
  }
 }
 for(const minute of [...samples].sort((a,b)=>a-b)){
  state.clock=minute;host.syncLotmCast(state);
  for(const id of roles){const place=whereabouts(host.castSchedule,id,at(minute)).place;if(place!=null)expected.set(id,place);assert.equal(state.simulation.people[id].location,expected.get(id));}
 }
 t.diagnostic(`${roles.length} role bodies, ${samples.size} boundary/adjacent sampled minutes`);
});

test('frozen before/after preserve full-game state and exact saves for both packs',async t=>{
 if(!process.env.YAIRPG_TIER_BASELINE){t.skip('Set YAIRPG_TIER_BASELINE to a frozen pre-P6 source root');return;}
 const temp=await mkdtemp(join(tmpdir(),'yairpg-tier-equivalence-'));
 const candidatePack=process.env.YAIRPG_TIER_PACK||join(root,'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/cast-r1r2-candidate-2026-10-29.json');
 const receipts=[];
 for(const pack of ['live','candidate'])await t.test(pack,async()=>{
  const outputs=[];
  for(const phase of ['before','after']){
   const dir=join(temp,`${phase}-${pack}`);await snapshot(phase==='before'?process.env.YAIRPG_TIER_BASELINE:root,dir,pack==='candidate'?candidatePack:null);
   const out=join(temp,`${phase}-${pack}.json`);
   await exec(process.execPath,[join(root,'tests/headless/cast_tier_fixture.mjs'),dir,'beside',out],{timeout:240000,maxBuffer:1024*1024});
   outputs.push(JSON.parse(await readFile(out,'utf8')));
  }
  assert.equal(outputs[0].state,outputs[1].state);assert.equal(outputs[0].save,outputs[1].save);
  receipts.push({pack,equalState:true,equalSaveBytes:true,before:{minuteMs:outputs[0].minuteMs,waitMs:outputs[0].ms},after:{minuteMs:outputs[1].minuteMs,waitMs:outputs[1].ms}});
  await writeFile(join(temp,'receipt.json'),JSON.stringify(receipts,null,2));
  t.diagnostic(JSON.stringify(receipts.at(-1)));
 });
 t.diagnostic(`Frozen inputs and private exact outputs: ${temp}`);
});
