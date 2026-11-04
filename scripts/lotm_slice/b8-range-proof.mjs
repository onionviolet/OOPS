// B8 proof runner (headless, fresh origin): from a saved checkpoint at the range, play the proof acts (hire, load six, two practice shots),
// then export, reload and check the counts persist. Usage: node scripts/lotm_slice/b8-range-proof.mjs <bundle-root> <origin-checkpoint.json> <out.json>
// The bundle must be built from this tree, with its cast.json carrying the book.lotm.b8.* proof acts (not committed; fixture only).
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const [root,originPath,outPath]=process.argv.slice(2).map(p=>resolve(p));
const imp=p=>import(pathToFileURL(resolve(p))),{Session}=await imp('scripts/playtest/lib.mjs'),{NativeContinuation}=await imp('scripts/playtest/native-continuation.mjs'),{serve}=await imp('scripts/perf/lib.mjs');
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,2),opTimeout:300000}).start(),route=new NativeContinuation(session);
const R=s=>s.expansion.actors.player.resources,K='book.lotm.be.',result={steps:[]};
try{
 await route.load(JSON.parse(await fs.readFile(originPath,'utf8')));
 const ids=['issue','load','fire','fire2'];
 for(const sfx of ids){
  const v=await route.view();assert.equal(v.arc.next?.id,'book.lotm.b8.'+sfx,'arc offers '+sfx+', got '+v.arc.next?.id);
  await route.startCurrent({exact:false});await route.settle();const s=await route.snapshot(),r=R(s);
  result.steps.push({sfx,carried:r[K+'carried.ordinary']||0,loaded:r[K+'loaded.ordinary']||0,fired:r[K+'practice_fired']||0,clock:s.expansion.clock});
 }
 const want=[[20,0,0],[14,6,0],[14,5,1],[14,4,2]];
 result.steps.forEach((x,i)=>assert.deepEqual([x.carried,x.loaded,x.fired],want[i],'counts after '+x.sfx));
 const s=await route.snapshot();assert.equal(s.expansion.actors.player.facts['book.lotm.be.revolver'],true);
 // Persist: literal save, fresh session, reload.
 const saved=JSON.stringify(s);await session.close?.();
 const s2=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,2),opTimeout:300000}).start(),r2=new NativeContinuation(s2);
 await r2.load(JSON.parse(saved));const back=await r2.snapshot(),rr=R(back);
 assert.deepEqual([rr[K+'carried.ordinary'],rr[K+'loaded.ordinary'],rr[K+'practice_fired']],[14,4,2],'persisted counts after reload');
 result.reload=[rr[K+'carried.ordinary'],rr[K+'loaded.ordinary'],rr[K+'practice_fired']];result.ok=true;
 await s2.close?.();
}catch(e){result.error=String(e.stack||e);result.ok=false;}
finally{await session.close?.();await server.close?.();}
await fs.writeFile(outPath,JSON.stringify(result,null,1));console.log(JSON.stringify(result));process.exit(result.ok?0:1);
