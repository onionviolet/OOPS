// Normal adopted Atlas, read-only. The drift display is an explicit response fixture.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const output=resolve(process.argv[2]||'docs/representations/evidence/atlas-campaign-sequencing-2026-11-25');mkdirSync(output,{recursive:true});
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
let browser,page;const errors=[],requests=[];
try{
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));server.stdout.setEncoding('utf8').on('data',text=>{const m=text.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();page=await browser.newPage({viewport:{width:1366,height:768}});page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/campaign-sequencing?'))requests.push(r.url());});
 await page.goto(base);assert.equal(requests.length,0,'no campaign digest scan from unrelated routes');
 const cold=Date.now();await page.goto(base+'/#library/campaigns');await page.getByRole('heading',{name:'Recovered historical connected route',exact:true}).waitFor();
 await page.getByText(/chapter 163 P082/).waitFor();const coldUiMs=Date.now()-cold;
 assert.match(await page.locator('main').innerText(),/No reviewed current-build uninterrupted/);await page.screenshot({path:join(output,'klein-1366.png')});
 const klein=await(await page.request.get(base+'/campaign-sequencing?world=lotm')).json();assert.equal(klein.connected[0].status,'historical-chain-validated');assert.equal(klein.mechanics[0].status,'owner-evidence-matches');
 const local=klein.connected.find(claim=>claim.status==='tested-local-segment');assert.ok(local);assert.equal(local.testedBundleSha256,'85eaa1cbdfef5da02674fdc83def168c7c4b484d4a8ee77fae5b89e274a37623');assert.match(local.note,/later rebuild/);
 await page.getByRole('heading',{name:'Tested local KJ3BB segment · 2026-11-25',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'klein-local-segment-1366.png')});
 const bc=klein.connected.find(claim=>claim.episode==='KJ3BC');assert.equal(bc.status,'tested-local-segment');assert.equal(bc.followsEpisode,'KJ3BB');assert.equal(bc.testedBundleSha256,'a6863a9d600d192a9c50102a1f0762472172c9f003f747f20807e640dd43c8ca');assert.equal(bc.entryCheckpointSha256,local.terminalCheckpointSha256);assert.match(bc.note,/different builds/);
 await page.getByRole('heading',{name:'Tested local KJ3BC segment · 2026-11-25',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:join(output,'klein-linked-bc-1366.png')});
 await page.getByRole('link',{name:'Open related record or work',exact:true}).click();await page.locator('[data-handoff-id="4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03"]').waitFor();
 await page.goto(base+'/#library/campaigns');await page.getByRole('combobox',{name:'Protagonist'}).waitFor();
 await page.getByRole('combobox',{name:'Protagonist'}).selectOption('mol');await page.getByRole('heading',{name:'Historical printed Arc 1 endpoint',exact:true}).waitFor();await page.getByText(/printed chapter 26 P287/).waitFor();await page.screenshot({path:join(output,'zorian-1366.png')});
 const zorian=await(await page.request.get(base+'/campaign-sequencing?world=mol')).json();assert.equal(zorian.connected[0].status,'owner-evidence-matches');assert.equal(zorian.mechanics[0].status,'owner-evidence-matches');
 await page.getByRole('link',{name:'Open this world’s reading records'}).click();assert.ok(page.url().includes('#world/mol/reading'));await page.locator('.box-canvas').waitFor();
 await page.goto(base+'/#library/campaigns');await page.getByRole('link',{name:'Open implementation reports'}).waitFor();await page.getByRole('link',{name:'Open implementation reports'}).click();await page.getByRole('heading',{name:'Implementation handoffs',exact:true}).waitFor();
 const drift=structuredClone(zorian);drift.connected[0]={...drift.connected[0],status:'unknown',statement:undefined,note:'Defining owner evidence changed (isolated display fixture).'};
 await page.route('**/campaign-sequencing?world=mol',route=>route.fulfill({json:drift}));await page.goto(base+'/#library/campaigns');await page.getByRole('combobox',{name:'Protagonist'}).selectOption('mol');await page.getByText(/Unknown: Defining owner evidence changed/).waitFor();
 assert.doesNotMatch(await page.locator('main').innerText(),/printed chapter 26 P287/);await page.screenshot({path:join(output,'drift-fixture-1366.png')});
 await page.setViewportSize({width:1920,height:1080});await page.getByRole('combobox',{name:'Protagonist'}).selectOption('lotm');await page.getByText(/chapter 163 P082/).waitFor();await page.getByText('Observed chapter-locator spans',{exact:true}).click();await page.screenshot({path:join(output,'klein-index-spans-1920.png')});
 assert.equal((await page.request.get(base+'/campaign-sequencing?world=unknown')).status(),404);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 writeFileSync(join(output,'result.json'),JSON.stringify({viewport:'1366x768 and1920x1080',coldUiMs,checks:['on-demand selected world','validated historical chain','current replay unknown','dated local segment bound to served bytes','later rebuild remains separate','independent mechanic scope','alternate historical endpoint','reading and exact Workbench navigation','drift fixture hides stale endpoint','expanded index spans at desktop'],klein,zorian,pageErrors:errors},null,2));
}catch(error){await page?.screenshot({path:join(output,'failed.png')});console.error(JSON.stringify({message:error.message,pageErrors:errors}));throw error;}
finally{await browser?.close();if(server.exitCode===null&&server.signalCode===null){const ended=once(server,'exit');server.kill();await ended;}}
