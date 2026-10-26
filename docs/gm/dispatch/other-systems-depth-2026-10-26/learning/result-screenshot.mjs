// Reopen the literal completed QA export for an observation-only result capture.
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {serve} from '../../../../../scripts/perf/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../../../../../scripts/ui_helpers.cjs');
const out=new URL('./evidence/browser/',import.meta.url),raw=await fs.readFile(new URL('completed-export.txt',out),'utf8');
const fixture=JSON.parse(Buffer.from(raw.split(':')[1],'base64'));
const server=await serve('/tmp/oops-learning-20261026'),browser=await launchChrome();
try{const context=await browser.newContext({viewport:{width:1920,height:1080}});await context.addInitScript(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);const page=await context.newPage();page.setDefaultTimeout(20000);await page.goto(server.url+'?test_hooks=1');await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});const record=page.locator('#feature_expansion_panel li').filter({hasText:/Your retained keyed lamp supported one agreed household reading interval/}).first();await record.scrollIntoViewIfNeeded();await page.screenshot({path:new URL('household-result-1920.png',out).pathname});await fs.writeFile(new URL('household-result-visible.txt',out),await record.innerText());}
finally{await browser.close();await server.close();}
