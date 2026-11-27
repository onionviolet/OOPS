import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const root=resolve('.'),out=resolve(process.argv[2]||'docs/representations/evidence/atlas-native-evidence-2026-11-25');
await mkdir(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),bundleBefore=sha(await readFile(join(root,'dist/bundle.js')));
const env={...process.env,ATLAS_PORT:'0'};delete env.ATLAS_REBUILD;delete env.ATLAS_SNAPSHOT;
let server,browser,base;const errors=[],roundTrips=[];
try{
 server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});
 base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));let log='';server.stderr.on('data',b=>log+=b);server.stdout.on('data',b=>{const match=String(b).match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});setTimeout(()=>fail(Error('Atlas startup timeout: '+log.slice(-500))),60000).unref();});
 browser=await launchChrome();const page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('button',{name:'Workbench',exact:true}).click();await page.getByRole('button',{name:'Native play evidence',exact:true}).click();
 await page.getByRole('heading',{name:'Native play evidence',exact:true}).waitFor();await page.locator('[data-native-evidence]').last().waitFor();assert.equal(await page.locator('[data-native-evidence]').count(),5);
 const payload=await(await page.request.get(base+'/native-play-evidence')).json();assert.equal(payload.currentBundleSha256,bundleBefore);assert.ok(payload.entries.every(e=>e.status==='verified'));assert.doesNotMatch(JSON.stringify(payload),/privateSave|\.json|\/private\/|[A-Z]:\\/);
 await page.locator('[data-native-evidence="village-watch-relay"] summary').first().click();await page.screenshot({path:join(out,'workbench-native-evidence-1920.png')});
 for(const [id,heading]of [['loaded-dice','Loaded Dice'],['starting-insight','+1 starting insight']]){
  const card=page.locator(`[data-native-evidence="${id}"]`);await card.getByRole('link',{name:'Open related Atlas record',exact:true}).click();await page.getByRole('link',{name:'Where to play',exact:true}).click();
  await page.waitForURL('**/#workbench/play-evidence/'+id);await page.locator(`[data-native-evidence="${id}"]`).waitFor();await page.waitForFunction(id=>document.activeElement?.closest('[data-native-evidence]')?.dataset.nativeEvidence===id,id);
  assert.equal(await page.locator(`[data-native-evidence="${id}"]`).getByRole('heading',{name:heading,exact:true}).count(),1);
  await page.locator(`[data-native-evidence="${id}"] summary`).first().click();await page.screenshot({path:join(out,id+'-where-to-play-1920.png')});roundTrips.push({card:id,via:'Open related Atlas record → Where to play',focused:true});
 }
 await page.getByRole('button',{name:'Compare checkout build',exact:true}).click();await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Compare checkout build')?.disabled);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);assert.equal(sha(await readFile(join(root,'dist/bundle.js'))),bundleBefore);
 const result={schema:'atlas-native-evidence-desktop/1',status:'agent-verified-not-human-reviewed',viewport:{width:1920,height:1080},route:'Workbench → Native play evidence; card → related cheat record → Where to play',normalDefaultSnapshot:true,currentBundleSha256:bundleBefore,roundTrips,cards:payload.entries.map(e=>({id:e.id,status:e.status,receipts:e.receipts.map(r=>({id:r.id,status:r.status,buildComparison:r.buildComparison,testedBundleSha256:r.testedBundleSha256,sha256:r.actualSha256}))})),pageErrors:[],horizontalOverflow:false,gameBundleUnchanged:true};
 await writeFile(join(out,'proof.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}catch(error){if(browser){const contexts=browser.contexts();await contexts[0]?.pages()[0]?.screenshot({path:join(out,'failed.png')}).catch(()=>{});}await writeFile(join(out,'failure.txt'),String(error.stack||error));throw error;}
finally{await browser?.close();if(server){server.kill();await new Promise(ok=>{if(server.exitCode!==null)ok();else server.once('exit',ok);});}}
