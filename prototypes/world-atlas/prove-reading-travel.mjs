// Normal current Atlas page, existing adopted snapshot plus the registered-definition leaf.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const output=resolve(process.argv[2]||'docs/representations/evidence/atlas-reading-travel-2026-11-25');mkdirSync(output,{recursive:true});
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
let browser,page;const errors=[],results=[];
try{
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const m=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();page=await browser.newPage({viewport:{width:1366,height:768}});page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
 const data=await(await page.request.get(base+'/data')).json();assert.equal(data.registeredTravel.status,'measured');
 if(process.env.ATLAS_EXPECT_TRAVEL_SOURCE)assert.equal(data.registeredTravel.source,process.env.ATLAS_EXPECT_TRAVEL_SOURCE);
 for(const [world,edges]of [['hp',40],['ri',74],['mol',0]]){
  await page.goto(base+'/#world/'+world+'/reading');await page.locator('.canvas-box[data-id="walkable"]').waitFor();await page.locator('.canvas-box[data-id="walkable"]').click();
  const side=page.locator('[aria-label="Selection"]');const text=await side.innerText();
  if(edges)assert.match(text,new RegExp(edges+' registered directed movement edges'));else{assert.match(text,/No registered travel edges in the available projection/);assert.match(text,/cast-place projections/);}
  assert.match(text,/do not establish current access or a played travel proof/);assert.doesNotMatch(text,/Walked by its own host|places on a walk/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(output,world+'-1366.png')});results.push({world,edges,text});
 }
 const travelCounts=await page.evaluate(async data=>{const{libraryWorlds}=await import('/library-views.mjs');return libraryWorlds(data).filter(w=>w.reached.walkable).map(w=>({world:w.id,...w.travel}));},data);
 assert.ok(travelCounts.some(w=>w.world==='lotm'&&w.nativeEdges>0),'existing host walk quotes remain authoritative');assert.ok(!travelCounts.some(w=>w.world==='mol'),'cast presence alone does not count');
 assert.deepEqual(errors,[]);writeFileSync(join(output,'result.json'),JSON.stringify({viewport:'1366x768',snapshotSha256:data.registeredTravel.snapshotSha256,definitionProjection:data.registeredTravel,travelCounts,results,pageErrors:errors},null,2));
}catch(error){console.error(JSON.stringify({error:error.message,pageErrors:errors}));await page?.screenshot({path:join(output,'failed.png')});throw error;}
finally{await browser?.close();if(server.exitCode===null&&server.signalCode===null){const ended=once(server,'exit');server.kill();await ended;}}
