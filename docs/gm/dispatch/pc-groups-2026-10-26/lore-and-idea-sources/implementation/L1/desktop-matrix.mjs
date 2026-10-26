import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {serve} from '../../../../../../../scripts/perf/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../../../../../../../scripts/ui_helpers.cjs');
const out=path.dirname(new URL(import.meta.url).pathname),root='/Users/weiwei/.codex/research/g7-lore-2026-10-26/L1-build';
const saved=JSON.parse(await fs.readFile(path.join(out,'completed-saved.json'),'utf8'));
const server=await serve(root),browser=await launchChrome(),result={bundleHash:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),checks:[]};
try{for(const [width,height,font] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
 const f=structuredClone(saved);f.saved_at=Date.now();f.customization.profiles[f.customization.active].settings.typography.size=font;
 const c=await browser.newContext({viewport:{width,height}});await c.addInitScript(s=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',JSON.stringify(s));sessionStorage.setItem('seeded','1');}},f);
 const p=await c.newPage();p.setDefaultTimeout(20000);await p.goto(server.url+'?test_hooks=1');await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(150);
 if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click();if(await p.locator('#hero_creation_panel_confirmation').isVisible())await p.locator('#hero_creation_panel_confirmation').click();
 await p.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await p.locator('[data-notebook-view="here"]').click();await p.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});
 const line=p.locator('#feature_expansion_panel li').filter({hasText:'The actual formula-ink unit made'}).first();await line.scrollIntoViewIfNeeded();const metrics=await p.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,inventoryFont:getComputedStyle(document.querySelector('#inventory_div')).fontSize}));assert.equal(metrics.inventoryFont,font+'px');assert.ok(metrics.width<=width);await p.screenshot({path:path.join(out,`verified-desktop-${width}-${font}.png`)});result.checks.push({width,height,font,metrics});await c.close();console.log('PASS',width,font);
 }await fs.writeFile(path.join(out,'desktop-result.json'),JSON.stringify(result,null,2)+'\n');
}finally{await browser.close();await server.close();}
