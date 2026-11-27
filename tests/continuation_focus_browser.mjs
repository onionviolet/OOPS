// Rebuilt desktop regression: Connection controls retain keyboard focus while its clock updates.
// Usage: node tests/continuation_focus_browser.mjs <BUILD_OUT directory> [evidence directory]
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
import {Session} from '../scripts/playtest/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';
const buildDir=resolve(process.argv[2]||'.lane-builds/player-ui');
const evidence=resolve(process.argv[3]||'.lane-builds/player-ui-evidence');
await mkdir(evidence,{recursive:true});
const server=await serve(buildDir),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,9,26,15),opTimeout:30000,
 hooks:{beforeOpen:async context=>context.route('**/private_packs/manifest.json',route=>route.fulfill({json:{schema:1,packs:[]}}))}});
const checks=[];
try {
 await session.start();
 const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 seed.customization=defaultCustomizationState();
 delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
 await session.open(seed);
 const page=session.page;
 await page.locator('#workspace_navigation [data-route-id="continuation"]').click();
 
 await page.locator('[data-continuation-action="enroll"]').click();
 const study=page.locator('[data-continuation-action="study"]');
 await study.waitFor();await study.focus();
 const focused=()=>page.evaluate(()=>document.activeElement?.dataset.continuationAction);
 await session.step(1);
 assert.equal(await focused(),'study','idle clock update retains focused investigation control');checks.push('Idle clock update retains investigation focus');
 await page.keyboard.press('Enter');
 await page.getByRole('button',{name:'Pause investigation',exact:true}).waitFor();
 await page.locator('#continuation_view:not([aria-busy])').waitFor();
 assert.equal(await focused(),'study','starting investigation retains the same operation');checks.push('Enter starts investigation and retains Pause focus');
 await session.step(1);
 assert.equal(await focused(),'study','research progress retains Pause focus');checks.push('Research progress retains Pause focus');
 await page.screenshot({path:join(evidence,'connection-focus.png')});
 await page.keyboard.press('Enter');
 await page.getByRole('button',{name:'Investigate · 10 min of available time',exact:true}).waitFor();
 await page.locator('#continuation_view:not([aria-busy])').waitFor();
 assert.equal(await focused(),'study','Enter pauses investigation without losing focus');checks.push('Enter pauses investigation and retains focus');
 assert.equal(session.errors.filter(e=>e.kind==='pageerror').length,0,'no runtime page errors');
 const bundle=await readFile(join(buildDir,'dist/bundle.js'));
 const report={viewport:'1920x1080',fixture:'tests/fixtures/perf/mid.json',route:'fixture setup, controls thereafter',bundleSha256:createHash('sha256').update(bundle).digest('hex'),checks,errors:session.errors};
 await writeFile(join(evidence,'result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} catch(error) {console.error(error);throw error;} finally {await session.close();await server.close();}

