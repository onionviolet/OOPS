// Read-only lookup microbenchmark. No browser or game/default build.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';

const output=resolve(process.argv[2]);
const exhaustive=process.argv[3]==='all-walks';
const hash=x=>createHash('sha256').update(x).digest('hex');
const sourceFile='src/book_world_lotm_districts.js';
const sourceBefore=hash(await readFile(sourceFile));
const nativeFetch=globalThis.fetch;
let release;
const ready=new Promise(resolve=>release=resolve);
globalThis.fetch=async url=>{
 await ready;
 const path=String(url);
 if(!path.startsWith('private_packs/'))return {ok:false};
 try{return {ok:true,json:async()=>JSON.parse(await readFile(path,'utf8'))};}
 catch{return {ok:false};}
};
const d=await import('../../src/book_world_lotm_districts.js');
const {LOTM_LOCATIONS}=await import('../../src/book_world_lotm_ids.js');
const {getPrivateLotmCast,whenCastLoaded}=await import('../../src/book_world_lotm_cast_days.js');
assert.equal(getPrivateLotmCast(),null);
assert.equal(d.districtOfPlace('fixture.not-yet-loaded'),null);
for(const place of Object.values(LOTM_LOCATIONS))assert.ok(d.districtOfPlace(place));
release();await whenCastLoaded();globalThis.fetch=nativeFetch;
const pack=getPrivateLotmCast();assert.ok(pack,'actual mounted cast loaded');
const reference=place=>d.LOTM_DISTRICTS.find(x=>x.places.includes(place))||
 d.LOTM_DISTRICTS.find(x=>x.id===pack.places.find(p=>p.id===place)?.travel?.district)||null;
const places=[...new Set([...Object.values(LOTM_LOCATIONS),...pack.places.map(p=>p.id),'fixture.unknown'])];
const expected=new Map(places.map(place=>[place,reference(place)]));
for(const place of places)assert.equal(d.districtOfPlace(place),expected.get(place),place);
const expectedWalk=(from,to)=>{
 const a=expected.get(from),b=expected.get(to);
 if(!a||!b||from===to)return null;
 return a.id===b.id?d.LOTM_SAME_DISTRICT_MINUTES:
  d.LOTM_LINKS[a.alias+'|'+b.alias]??d.LOTM_LINKS[b.alias+'|'+a.alias]??null;
};
let checkedWalks=0;
const targets=exhaustive?places:Object.values(LOTM_LOCATIONS);
for(const from of places)for(const to of targets){
 assert.equal(d.lotmWalkMinutes(from,to),expectedWalk(from,to),from+' -> '+to);checkedWalks++;
}
const samples=[];let checksum=0;
for(let sample=0;sample<5;sample++){
 const start=performance.now();
 for(let n=0;n<2;n++)for(const place of places)checksum+=d.districtOfPlace(place)?.id.length||0;
 samples.push(performance.now()-start);
}
assert.equal(hash(await readFile(sourceFile)),sourceBefore,'source changed during measurement');
const result={schema:1,sourceSha256:sourceBefore,packSha256:hash(await readFile('private_packs/lotm-cast/cast.json')),
 loadedPlaces:pack.places.length,workingSet:places.length,workingSetSha256:hash(JSON.stringify(places)),
 callsPerSample:places.length*2,samplesMs:samples,checksum,allLookupsEqual:true,checkedWalks,allComparedWalksEqual:true,
 qualification:'Lookup-only local microbenchmark; not a whole-view or desktop latency claim. Concurrent full suite may affect absolute times.'};
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
