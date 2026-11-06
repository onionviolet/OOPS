// AT15 proof runner (headless, fresh origin, 1920x1080): from the kj3z range checkpoint, take the B8 proof acts (hire, load six), open the
// proof street fight from the tempo panel, play it by clicking the panel's own buttons, then check the spent rounds were written back once and
// survive a literal save reload and an Export/Import. Usage: node scripts/lotm_slice/at15-fight-proof.mjs <bundle-root> <origin.json> <out-dir>
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {resolve,join} from 'node:path';import {pathToFileURL} from 'node:url';
const [root,originPath,outDir]=process.argv.slice(2).map(p=>resolve(p));
const imp=p=>import(pathToFileURL(resolve(p))),{Session}=await imp('scripts/playtest/lib.mjs'),{NativeContinuation}=await imp('scripts/playtest/native-continuation.mjs'),{serve}=await imp('scripts/perf/lib.mjs');
await fs.mkdir(outDir,{recursive:true});
const opts={seed:7,wall:Date.UTC(2026,10,2),opTimeout:120000};
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',...opts}).start(),route=new NativeContinuation(session);
const R=s=>s.expansion.actors.player.resources,K='book.lotm.be.',result={steps:[],clicks:[],errors:[]};
const counts=s=>({carried:R(s)[K+'carried.ordinary']||0,loaded:R(s)[K+'loaded.ordinary']||0});
try{
 await route.load(JSON.parse(await fs.readFile(originPath,'utf8')));
 const page=route.page;page.on('pageerror',e=>result.errors.push(String(e)));
 for(const sfx of ['issue','load']){
  const v=await route.view();assert.equal(v.arc.next?.id,'book.lotm.b8.'+sfx,'arc offers '+sfx+', got '+v.arc.next?.id);
  const c=route.page.locator(`[data-lotm="book.lotm.b8.${sfx}"]`).first();if(await c.count())await c.click();else await route.startCurrent();await route.settle();result.steps.push({sfx,...counts(await route.snapshot())});
 }
 await page.setViewportSize({width:1920,height:1080});
 const before=counts(await route.snapshot());assert.deepEqual(before,{carried:14,loaded:6});
 const panel=page.locator('[data-shared-slot="encounter"] details').first();await panel.waitFor({state:'attached',timeout:20000});
 result.panelHidden=await panel.evaluate(n=>n.hidden||!n.checkVisibility());
 await panel.evaluate(n=>n.scrollIntoView());
 const opener=page.locator('[data-tempo="open:lotm.proof.street"]');await opener.waitFor({timeout:20000});
 result.openerText=await panel.innerText();
 await page.screenshot({path:join(outDir,'01-opener.png')});
 await opener.click();
 for(let i=0;i<60;i++){
  const open=await page.evaluate(()=>!!simulationTestHooks.snapshot().expansion.simulation.sessions.player);
  if(!open)break;
  if(i===0)await page.screenshot({path:join(outDir,'02-fight.png')});
  const pick=async id=>{const b=page.locator(`button[data-fight-option="${id}"], [data-shared-slot="encounter"] [data-tempo="${id}"]`);return (await b.count())&&!(await b.first().isDisabled())?b.first():null;};
  const b=(await pick('shoot'))||(await pick('reload'))||(await pick('jab'))||(await pick('guard'));
  if(!b){await page.waitForTimeout(300);continue;}
  const id=(await b.getAttribute('data-fight-option'))||(await b.getAttribute('data-tempo'));result.clicks.push(id);await b.click();await page.waitForTimeout(150);
 }
 const after=await route.snapshot();result.lastResult=after.expansion.actors.player.facts['tempo.lastResult'];
 result.log=after.expansion.simulation.log.slice(-3).map(x=>x.text);
 result.after=counts(after);await page.screenshot({path:join(outDir,'03-after.png')});
 result.panelAfter=await panel.innerText();
 const shots=result.clicks.filter(c=>c==='shoot').length,reloads=result.clicks.filter(c=>c==='reload').length;
 assert.ok(result.lastResult,'the fight ended');
 assert.equal(result.after.loaded+result.after.carried,before.loaded+before.carried-shots,'every shot spent exactly one round, nothing else lost');
 result.shots=shots;result.reloads=reloads;
 // Kept: literal save into a fresh session, then Export/Import.
 const saved=JSON.stringify(after);await session.close?.();
 const s2=await new Session({url:server.url+'?test_hooks=1',...opts}).start(),r2=new NativeContinuation(s2);
 await r2.load(JSON.parse(saved));result.reload=counts(await r2.snapshot());
 const exported=await r2.page.evaluate(()=>typeof save_to_file==='function'?save_to_file():null);
 if(exported){await r2.imported(exported);result.imported=counts(await r2.snapshot());assert.deepEqual(result.imported,result.after);}else result.imported='no export hook';
 assert.deepEqual(result.reload,result.after);
 await s2.close?.();result.ok=true;
}catch(e){result.error=String(e.stack||e);result.ok=false;}
finally{await session.close?.();await server.close?.();}
await fs.writeFile(join(outDir,'result.json'),JSON.stringify(result,null,1));console.log(JSON.stringify(result,null,1));process.exit(result.ok?0:1);
