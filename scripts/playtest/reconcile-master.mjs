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
const receipt={bundleSha256:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),route:'fresh Village notice → ordinary Tingen enrollment → native Save/reload/Export/literal Import',matrix:[],checks:[]};
try{
 await s.open();let p=s.page;
 assert(!(new URL(p.url()).searchParams.has('lotm_probe')));
 const door=p.locator('#location_actions_div [data-lotm-door]'),panel=p.locator('#lotm_panel');
 assert(await door.isVisible());assert(!(await panel.isVisible()));await door.click();
 assert.match(await panel.innerText(),/for good on this save/);assert.match(await panel.innerText(),/The money you held before crossing stays behind/);
 await p.screenshot({path:path.join(out,'tingen-choice-1920.png')});
 await panel.locator('[data-lotm="enroll"]').click();await p.waitForTimeout(350);
 const before=await s.save(),loc=await p.locator('#location_name_span').innerText();assert.match(loc,/Tingen/);
 const lotm=JSON.stringify(before.expansion.lotm);assert.notEqual(lotm,undefined);
 await p.reload();await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();
 assert.equal(JSON.stringify((await s.save()).expansion.lotm),lotm);
 const literal=await p.evaluate(()=>save_to_file());assert.equal(typeof literal,'string');
 await Promise.all([p.waitForEvent('load'),p.evaluate(text=>load_progress(text),literal)]);await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();
 assert.equal(JSON.stringify((await s.save()).expansion.lotm),lotm);assert.equal(await p.locator('#location_name_span').innerText(),loc);
 receipt.checks.push('ordinary enrollment and exact LOTM slice/location persist through native reload and literal Import');
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
