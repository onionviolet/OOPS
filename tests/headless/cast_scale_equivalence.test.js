// Private whole-book fixture: sample the eager location contract without saving
// dormant roles. Full-game exact save comparison is opt-in with a frozen root.
import test from 'node:test';import assert from 'node:assert/strict';
import {readFile,mkdtemp,cp,readdir,symlink,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';import {promisify} from 'node:util';
import {whereabouts} from '../../src/cast_schedule.js';
const root=resolve(fileURLToPath(new URL('../..',import.meta.url))),exec=promisify(execFile);
const lane='docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/';
const packs='docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/pack-backups/';
const whole=process.env.YAIRPG_SCALE_PACK||join(root,packs,'cast-whole-book-candidate-2026-10-29.json');
test('150 whole-book people match eager locations through sampled boundaries',async t=>{
 let pack;try{pack=JSON.parse(await readFile(whole,'utf8'));}catch(e){if(e.code==='ENOENT'){t.skip('Private whole-book fixture absent');return;}throw e;}
 const fetch=globalThis.fetch;let host;
 try{globalThis.fetch=async path=>({ok:true,json:async()=>path.endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(pack)});
 host=await import('../../src/book_world_lotm_cast_host.js');await (await import('../../src/book_world_lotm_cast_days.js')).whenCastLoaded();}finally{globalThis.fetch=fetch;}
 const {LOTM_IDS:I}=await import('../../src/book_world_lotm_ids.js');
 const state={clock:0,actors:{},lotm:{entryProfile:host.LOTM_BESIDE_PROFILE,initializedAt:0},worlds:{[I.world]:{facts:{}}},simulation:{people:{player:{location:pack.host.profile.start}},owners:{},jobs:[]}};
 const defs=new Map(host.castPeople.map(p=>[p.id,p]));
 const scheduled=[...new Set(host.castSchedule.map(r=>r.actor))].filter(id=>defs.has(id));
 const ids=new Set(scheduled.slice(0,150));for(let n=0;ids.size<150&&n<host.castPeople.length;n++)ids.add(host.castPeople[Math.floor(n*host.castPeople.length/150)].id);
 assert.equal(ids.size,150);
 const expected=new Map([...ids].map(id=>[id,defs.get(id).location]));
 const samples=new Set([0,1,349,350,719,720,1439,1440,1441,2879,2880,10080,34559]);
 for(const r of host.castSchedule)if(r.recurrence!=='irregular')for(const edge of [r.from,r.to])if(typeof edge==='number')for(const d of [r.day,r.until??r.day])for(const offset of [-1,0,1]){const m=(d-1)*1440+edge+offset;if(m>=0)samples.add(m);}
 for(const minute of [...samples].sort((a,b)=>a-b)){
  state.clock=minute;host.syncLotmCast(state);const at=host.castCalendar(state);
  for(const id of ids){const place=whereabouts(host.castSchedule,id,at).place;if(place!=null)expected.set(id,place);assert.equal(state.simulation.people[id]?.location??defs.get(id).location,expected.get(id));}
 }
 const absent=host.castPeople.filter(p=>!state.simulation.people[p.id]);assert.ok(absent.length>1000);
 const saved=JSON.stringify(state);for(const p of absent)assert.ok(!saved.includes(p.id));
 t.diagnostic(`150 people including ${scheduled.length} scheduled IDs; ${samples.size} sampled minutes; ${absent.length} dormant IDs absent from state`);
});
async function snapshot(source,dir,pack){
 for(const name of ['src','scripts','tests','private_packs'])await cp(join(source,name),join(dir,name),{recursive:true});
 for(const e of await readdir(root,{withFileTypes:true}))if(!['.git','src','scripts','tests','private_packs'].includes(e.name))await symlink(join(root,e.name),join(dir,e.name),e.isDirectory()?'dir':'file');
 await cp(pack,join(dir,'private_packs/lotm-cast/cast.json'));
 let main=await readFile(join(dir,'src/main.js'),'utf8');
 if(!main.includes('as p5CastReady'))main+="\nexport {whenCastLoaded as p5CastReady} from './book_world_lotm_cast_days.js';\nexport {openStepperBatch};\nexport {setClockSpanModeForTests} from './clock_owner.js';\nexport const p5EnrollBe=()=>domainRegistry.command('lotm','enrollBeFresh')();\n";
 await writeFile(join(dir,'src/main.js'),main);
}
test('frozen small packs retain exact full-game state and save bytes',async t=>{
 const baseline=process.env.YAIRPG_SCALE_BASELINE;if(!baseline){t.skip('Set YAIRPG_SCALE_BASELINE to a frozen pre-P8 root');return;}
 const temp=await mkdtemp(join(tmpdir(),'yairpg-scale-equivalence-'));
 const inputs={live:process.env.YAIRPG_SCALE_LIVE||join(baseline,'private_packs/lotm-cast/cast.json'),candidate:join(root,packs,'cast-r1r2-candidate-2026-10-29.json')};
 for(const [kind,pack] of Object.entries(inputs))await t.test(kind,async()=>{
  const results=[];
  for(const phase of ['before','after']){
   const dir=join(temp,phase+'-'+kind);await snapshot(baseline,dir,pack);
   if(phase==='after'){
    await cp(join(root,'src/book_world_lotm_cast_host.js'),join(dir,'src/book_world_lotm_cast_host.js'));
    await exec('git',['apply',join(root,lane,'P8_INTEGRATION.patch')],{cwd:dir});
   }
   const out=join(temp,phase+'-'+kind+'.json');await exec(process.execPath,[join(root,'tests/headless/cast_scale_fixture.mjs'),dir,'beside',out],{timeout:300000,maxBuffer:1024*1024});
   results.push(JSON.parse(await readFile(out,'utf8')));
  }
  assert.equal(results[0].state,results[1].state);assert.equal(results[0].save,results[1].save);
 });
 t.diagnostic('Frozen private fixture outputs: '+temp);
});
