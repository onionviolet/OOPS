import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {launchChrome} from '../../scripts/perf/lib.mjs';
const output=resolve(process.argv[2]||'docs/representations/evidence/atlas-world-rules-2026-11-25');mkdirSync(output,{recursive:true});
const inputs=['prototypes/world-atlas/world-rules.mjs','prototypes/world-atlas/world-rules-view.mjs','prototypes/world-atlas/index.html','prototypes/world-atlas/serve.mjs','prototypes/world-atlas/cheat-catalogue.mjs','prototypes/world-atlas/cheat-catalogue-view.mjs'];
const identity=()=>Object.fromEntries(inputs.map(file=>[file,createHash('sha256').update(readFileSync(file)).digest('hex')]));const inputIdentity=identity();
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],windowsHide:true});
let browser,page;const errors=[];
try{
 const base=await new Promise((ok,fail)=>{server.once('error',fail);server.once('exit',n=>fail(Error('Atlas exited '+n)));server.stdout.setEncoding('utf8').on('data',s=>{const m=s.match(/http:\/\/127\.0\.0\.1:\d+/);if(m)ok(m[0]);});});
 browser=await launchChrome();page=await browser.newPage({viewport:{width:1920,height:1080}});page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('button',{name:'Browse world rules',exact:true}).click();await page.getByRole('heading',{name:'World rules',exact:true}).waitFor();await page.getByText('Showing 1–40 of 12042',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByText('Showing 41–80 of 12042',{exact:true}).waitFor();
 await page.getByRole('combobox',{name:'Rule world or edition'}).selectOption('dnd_srd');await page.getByRole('searchbox',{name:'Search world rules'}).fill('D20 test succeeds');await page.getByRole('button',{name:'Search',exact:true}).click();await page.locator('article[data-rule-key]').first().waitFor();
 assert.match(await page.locator('main').innerText(),/D&D 5\.2\.1 SRD/);assert.match(await page.locator('main').innerText(),/No implementation state recorded/);await page.screenshot({path:join(output,'dnd-521-1920.png')});
 const first=page.locator('article[data-rule-key]').first();await first.locator('h2 a').click();const direct=page.url();await page.reload();await page.getByText('Back to this world’s rules',{exact:true}).waitFor();await page.locator('details summary').first().click();
 const evidence=await page.locator('a',{hasText:'Open this public evidence record'}).first().getAttribute('href');const record=await(await page.request.get(base+evidence)).json();assert.equal(record.world,'dnd_srd');assert.match(record.sources.sha256,/^[a-f0-9]{64}$/);assert.equal(record.sources.pointer,'/rules/0');
 await page.goto(base+'/#library/rules/warhammer-40k');await page.getByRole('searchbox',{name:'Search world rules'}).fill('warp-dependent-travel');await page.getByRole('button',{name:'Search',exact:true}).click();await page.getByRole('heading',{name:'Warp-dependent travel and communication',exact:true}).waitFor();await page.getByText(/core9 p22;/).waitFor();await page.locator('details summary').first().click();assert.match(await page.locator('main').innerText(),/warhammer_40k_labels\.json/);assert.match(await page.locator('main').innerText(),/Ledger state: catalogued/);await page.screenshot({path:join(output,'warhammer-nested-1920.png')});
 await page.goto(base+'/#library/rules/book.hp');await page.getByRole('heading',{name:'Interpretation / proposal',exact:true}).waitFor();assert.match(await page.locator('main').innerText(),/not stated in a source/);await page.screenshot({path:join(output,'interpretation-1920.png')});
 await page.setViewportSize({width:1366,height:768});await page.goto(base+'/#world/lotm/rules');await page.getByRole('combobox',{name:'Rule world or edition'}).waitFor();await page.waitForFunction(()=>document.querySelector('select[aria-label="Rule world or edition"]')?.value==='lotm');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(output,'lotm-world-tab-1366.png')});
 await page.goto(base);await page.getByRole('button',{name:'Browse cheat catalogue',exact:true}).click();await page.getByRole('heading',{name:/Cheat catalogue/i}).first().waitFor();const cheats=await(await page.request.get(base+'/cheat-catalogue')).json();assert.ok(cheats);assert.equal((await page.request.get(base+'/cheat-catalogue-source')).status(),200);
 assert.equal((await page.request.get(base+'/world-rules?offset=-1')).status(),400);assert.equal((await page.request.get(base+'/world-rule-evidence?record=unknown')).status(),404);assert.deepEqual(errors,[]);
 assert.deepEqual(identity(),inputIdentity,'Atlas module inputs unchanged during proof');
 writeFileSync(join(output,'result.json'),JSON.stringify({viewport:'1920x1080 and1366x768',inputIdentity,directRuleRoute:direct.split('#')[1],record,checks:['normal Worlds navigation','40-row pagination','edition and search','exact record refresh','public evidence hash/pointer','nested Warhammer source sheet','interpretation separate from source','world-specific Rules tab','cheat catalogue integration','invalid queries','zero page errors'],pageErrors:errors},null,2));
}catch(error){await page?.screenshot({path:join(output,'failed.png')});console.error(error);throw error;}
finally{await browser?.close();if(server.exitCode===null&&server.signalCode===null){const ended=once(server,'exit');server.kill();await ended;}}
