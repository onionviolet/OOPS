// Settings text, draft controls and keyboard return on the rebuilt desktop game.
// node tests/settings_return_browser.mjs <BUILD_OUT> <evidence directory> [--probe]
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/perf/lib.mjs';
import {Session} from '../scripts/playtest/lib.mjs';
import {defaultCustomizationState} from '../src/customization_profiles.js';
const buildDir=resolve(process.argv[2]||'.lane-builds/player-ui');
const evidence=resolve(process.argv[3]||'.lane-builds/settings-evidence');
const probe=process.argv.includes('--probe');
await mkdir(evidence,{recursive:true});
const server=await serve(buildDir),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,9,26,15),
 hooks:{beforeOpen:async context=>context.route('**/private_packs/manifest.json',route=>route.fulfill({json:{schema:1,packs:[]}}))}});
try {
 await session.start();
 const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 seed.customization=defaultCustomizationState();
 delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
 await session.open(seed);
 const page=session.page;
 const screen=()=>page.evaluate(()=>{
  const vis=e=>!!e.offsetParent,modules=[...document.querySelectorAll('#main_content .workspace-module:not([hidden])')].filter(vis);
  const center=document.getElementById('center_mode_content');
  const view=(center&&vis(center)?center.innerText:modules.filter(m=>m.dataset.region==='center'||m.closest('[data-region="center"]')).map(m=>m.innerText).join('\n')).slice(0,160);
  return [modules.map(m=>m.dataset.module).join(','),view,modules.filter(m=>m.dataset.expanded==='true'||m.classList.contains('expanded')).map(m=>m.dataset.module).join(',')].join('|');
 });
 const home=await screen(),checks=[];
 if(!probe){
  await page.locator('#workspace_navigation [data-route-id="continuation"]').click();
  assert.equal(await page.evaluate(()=>document.getElementById('main_content').dataset.centerTask),'continuation','Connection skips its intermediate launcher');
  assert.doesNotMatch(await page.locator('#continuation_view').innerText(),/\bbaseline\b/i);
  await page.screenshot({path:join(evidence,'connection.png')});
  await page.keyboard.press('Escape');
  assert.equal(await screen(),home,'Connection returns to the complete home view with one Escape');
  assert.ok(await page.locator('[data-route-id="continuation"]').evaluate(n=>n===document.activeElement));
  checks.push('Connection single-step Escape and focus return; starting-point wording');
 }
 const state=()=>page.evaluate(()=>({mode:document.getElementById('main_content').dataset.centerTask||'local',context:document.getElementById('main_content').dataset.workspaceContext,
  focus:document.activeElement?.outerHTML.slice(0,300),intro:document.querySelector('#customization_host .customization-explanation')?.textContent,
  target:document.querySelector('#customization_host select[aria-label="Panel"],#customization_host select[aria-label="Native module"]')?.getAttribute('aria-label')}));
 const route=page.locator('#workspace_navigation [data-route-id="customization"]');
 const panelOptions=()=>page.locator('#customization_host select[aria-label="Panel"]').evaluate(n=>[...n.options].map(o=>o.value));
 const originalOptions=probe?[]:await panelOptions();
 const before=await state();
 await route.click();
 await page.locator('#customization_host').waitFor({state:'visible'});
 const opened=await state();
 if(!probe){
  const name=page.locator('#customization_host input[aria-label="New profile name"]');
  await name.fill('Unapplied draft');
  await name.evaluate(n=>n.addEventListener('keydown',e=>{if(e.key==='Escape')e.preventDefault();},{once:true}));
  await page.keyboard.press('Escape');
  assert.equal((await state()).mode,opened.mode,'an editing control can consume Escape');
  assert.equal(await name.inputValue(),'Unapplied draft');
  await page.locator('#customization_host h3').click();await page.keyboard.press('?');
  await page.locator('#workspace_shortcuts').waitFor({state:'visible'});await page.keyboard.press('Escape');
  assert.equal((await state()).mode,opened.mode,'Escape closes the shortcut dialog before navigating');
  await page.locator('#customization_host h3').click();
  checks.push('Editing control and shortcut dialog retain Escape priority');
 }
 await page.screenshot({path:join(evidence,probe?'before-settings.png':'settings.png')});
 await page.keyboard.press('Escape');
 const returned=await state();
 const report={viewport:'1920x1080',fixture:'tests/fixtures/perf/mid.json',before,opened,returned,checks,
  bundleSha256:createHash('sha256').update(await readFile(join(buildDir,'dist/bundle.js'))).digest('hex'),errors:session.errors};
 if(!probe){
  assert.equal(returned.mode,before.mode,'Escape returns to the previous play view');
  assert.ok(returned.focus.includes('data-route-id="customization"'),'focus returns to Settings navigation');
  assert.equal(opened.target,'Panel');assert.ok(!opened.intro.includes('native'));
  assert.equal(await screen(),home,'Settings after Connection also returns to the complete home view');
  await route.click();assert.equal(await page.locator('#customization_host input[aria-label="New profile name"]').inputValue(),'Unapplied draft','return leaves the draft intact');
  assert.deepEqual(await panelOptions(),originalOptions,'all available panel settings remain selectable');
  await page.locator('#center_mode_back').click();assert.equal(await screen(),home,'named Back follows the same route');
  assert.equal(session.errors.filter(e=>e.kind==='pageerror').length,0);
 }
 await writeFile(join(evidence,probe?'before.json':'result.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
} finally {await session.close();await server.close();}
