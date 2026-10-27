// Local integration proof, using a rebuilt bundle and a disposable browser origin.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
await fs.mkdir(out,{recursive:true});
const server=await serve(root),errors=[];
const s=await new Session({url:server.url+'?test_hooks=1',opTimeout:20000,seed:7,wall:Date.UTC(2026,9,26),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const receipt={bundleSha256:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),route:'fresh Village notice → Tingen life pick → nine entry answers → confirm → resume Village → resume Tingen → native Save/reload/Export/literal Import',matrix:[],checks:[]};
try{
 await s.open();let p=s.page;
 assert(!(new URL(p.url()).searchParams.has('lotm_probe')));
 const door=p.locator('#location_actions_div [data-lotm-door]'),panel=p.locator('#lotm_panel');
 assert(await door.isVisible());assert(!(await panel.isVisible()));await door.click();
 assert.match(await panel.innerText(),/Year: 1349, early Tingen/);assert.match(await panel.innerText(),/Not written yet/);assert.match(await panel.innerText(),/The money you held before crossing stays behind/);
 assert.equal(await panel.locator('[data-lotm="enroll"]').count(),0,'no life commits before its entry answers are shown');
 await p.screenshot({path:path.join(out,'tingen-choice-1920.png')});
 const held=(await s.save()).character?.money;
 await panel.locator('[data-lotm="pick_probationer"]').click();
 assert.equal(await panel.locator('[data-lotm-answer]').count(),9);assert.match(await panel.innerText(),/the clerk's own purse, 2 pounds, is yours/);
 await p.screenshot({path:path.join(out,'tingen-confirm-1920.png')});
 await panel.locator('[data-lotm="entry_back"]').click();assert.equal(await panel.locator('[data-lotm-answer]').count(),0,'Back returns to the lives without enrolling');
 await panel.locator('[data-lotm="pick_probationer"]').click();
 await panel.locator('[data-lotm="enroll"]').click();await p.waitForFunction(()=>/Tingen/.test(document.querySelector('#location_name_span')?.textContent||''),null,{timeout:30000});await p.waitForTimeout(350);
 const before=await s.save(),loc=await p.locator('#location_name_span').innerText();assert.match(loc,/Tingen/);
 assert.equal(before.expansion.lotm.entry.method,'crossing');assert.equal(before.character.money,480,'the clerk purse replaces the Village money');
 if(typeof held==='number')assert.equal(before.expansion.lotm.entry.leftBehind.money,held);
 receipt.checks.push(`entry answers shown before commit; purse 480 pence; Village money ${held} recorded as left behind`);
 const lotm=JSON.stringify(before.expansion.lotm);assert.notEqual(lotm,undefined);
 await p.reload();await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();
 assert.equal(JSON.stringify((await s.save()).expansion.lotm),lotm);
 const literal=await p.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');
 await Promise.all([p.waitForEvent('load'),p.evaluate(text=>load_progress(text),literal)]);await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();
 assert.equal(JSON.stringify((await s.save()).expansion.lotm),lotm);assert.equal(await p.locator('#location_name_span').innerText(),loc);
 receipt.checks.push('ordinary enrollment and exact LOTM slice/location persist through native reload and literal Import');
 // RET3/RET4: the Village life paused at the crossing; resume it, then resume Tingen, through the ordinary connection panel.
 const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();};
 const hop=async id=>{
  if(!await p.locator('#continuation_open').isVisible())await p.locator('#workspace_navigation select').first().selectOption('continuation');
  await p.locator('#continuation_open').click();await p.locator('[data-connection-tab=return]').click();
  await p.locator(`[data-continuation-action="${id}"]`).first().click();
  await Promise.all([p.waitForEvent('load',{timeout:60000}),p.locator(`[data-continuation-action="${id}"]`).filter({hasText:/^Confirm /}).click()]);
  await play();
  if(!await p.locator('[data-continuation-action="continue"]').isVisible()){await p.locator('#workspace_navigation select').first().selectOption('continuation');await p.locator('#continuation_open').click();}
  // The harness seeds crypto.randomUUID per page load, so the first id after a reload repeats the last transition's token; burn one (harness only).
  await p.evaluate(()=>crypto.randomUUID());
  await p.locator('[data-continuation-action="continue"]').click();await p.waitForFunction(()=>!document.querySelector('[data-continuation-action="continue"]'),null,{timeout:30000});
  for(let i=0;i<4&&await p.locator('#center_mode_back').isVisible()&&!await p.locator('#location_actions_div').isVisible();i++){await p.locator('#center_mode_back').click();await p.waitForTimeout(300);}
 };
 const crossed=await s.save();
 assert.equal(crossed.continuation.lives[crossed.continuation.active].tether,'life-1');assert.equal(crossed.continuation.lives['life-1'].paused.character.money,held,'the paused Village life keeps its money');
 await p.locator('#workspace_navigation select').first().selectOption('lotm');assert(await p.locator('#lotm_panel [data-lotm-paused-life]').isVisible(),'Tingen names the paused Village life');
 await p.screenshot({path:path.join(out,'tingen-paused-village-1920.png')});
 await hop('resume:life-1');
 let village=await s.save();assert.equal(await p.locator('#location_name_span').innerText(),'Village');assert.equal(village.character.money,held);assert.equal(village.expansion.lotm,undefined,'the Village life holds no Tingen branch');
 assert(await p.locator('#location_actions_div [data-lotm-door]').isVisible(),'the Village life can see the Tingen door again');
 await p.screenshot({path:path.join(out,'village-resumed-1920.png')});
 await hop(`resume:${crossed.continuation.active}`);
 const tingen=await s.save();assert.equal(await p.locator('#location_name_span').innerText(),loc);assert.equal(tingen.character.money,480);assert.equal(JSON.stringify(tingen.expansion.lotm),lotm);
 receipt.saveBytes={whole:JSON.stringify(tingen).length,pausedVillage:JSON.stringify(tingen.continuation.lives['life-1'].paused).length,continuation:JSON.stringify(tingen.continuation).length,expansion:JSON.stringify(tingen.expansion).length};
 const literal2=await p.evaluate(()=>save_to_file());await Promise.all([p.waitForEvent('load'),p.evaluate(text=>load_progress(text),literal2)]);await play();
 assert.equal(JSON.stringify((await s.save()).continuation.lives['life-1'].paused.character.money),String(held));
 receipt.checks.push(`Village resumed with ${held} money and no Tingen branch; Tingen resumed with 480 pence and its exact slice; paused lives survive literal Import`);
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await p.setViewportSize({width,height});await p.locator('#workspace_navigation select').first().selectOption('customization');await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();
  // Return through the existing Tingen workroom route.
  await p.locator('#workspace_navigation select').first().selectOption('lotm');await p.locator('#lotm_panel').waitFor({state:'visible',timeout:60000});
  const g=await p.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));assert(g.width<=width,'no horizontal overflow');
  await p.screenshot({path:path.join(out,`tingen-${width}-${size}.png`)});receipt.matrix.push({width,height,size,geometry:g});
 }
 assert.deepEqual(s.errors,[]);receipt.status='PASS';
}catch(e){receipt.status='FAIL';receipt.error=e.stack;await s.page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});throw e;}
finally{receipt.errors=s.errors;await fs.writeFile(path.join(out,'result.json'),JSON.stringify(receipt,null,2));await s.close();await server.close();}
console.log(JSON.stringify({status:receipt.status,matrix:receipt.matrix.length,checks:receipt.checks}));
