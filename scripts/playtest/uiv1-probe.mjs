// UIV1 probe: disabled controls on the Mistglass door and in the Tingen workroom show their
// reason without hover, and Tab reaches it. Temp rebuilt bundle, fresh origin, headless.
// Usage: node scripts/playtest/uiv1-probe.mjs <out-dir>   (screenshots stay in out-dir)
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session} from './lib.mjs';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
const s=await new Session({url:server.url,opTimeout:30000,seed:7,wall:Date.UTC(2026,9,27),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const pause=(ms=350)=>s.page.waitForTimeout(ms);
const nav=async id=>{await s.page.keyboard.press('Escape');await s.page.locator('#workspace_navigation select').first().selectOption(id);await pause();};
// Every visible disabled button: is its reason on screen (not title-only), and does Tab from the button's predecessor land on it?
const audit=sel=>s.page.evaluate(sel=>{
 const shown=n=>!!n&&n.checkVisibility({contentVisibilityAuto:true,visibilityProperty:true});
 return [...document.querySelectorAll(sel+' button:disabled')].filter(shown).map((b,i)=>{
  const ids=(b.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean),desc=ids.map(id=>document.getElementById(id)).filter(shown);
  const reason=b.dataset.disabledReason||b.title||'';const visible=desc.find(n=>reason&&n.innerText.includes(reason));
  if(visible&&!visible.dataset.uiv1Probe)visible.dataset.uiv1Probe=String(i);
  return {i:visible?Number(visible.dataset.uiv1Probe):i,label:b.innerText.trim().slice(0,60),reason:reason.slice(0,80),visible:!!visible,tabStop:!!visible&&visible.tabIndex===0};});},sel);
const tabReaches=async(sel,i)=>s.page.evaluate(([sel,i])=>{const target=document.querySelector(`${sel} [data-uiv1-probe="${i}"]`);if(!target)return false;
 const all=[...document.querySelectorAll('button:not(:disabled),[tabindex="0"],a[href],select,input,summary')].filter(n=>n.checkVisibility());
 const before=all[all.indexOf(target)-1];before?.focus();return {before:!!before,ok:true};},[sel,i]).then(async r=>{if(!r)return false;await s.page.keyboard.press('Tab');
 return s.page.evaluate(([sel,i])=>document.activeElement?.matches(`${sel} [data-uiv1-probe="${i}"]`)||false,[sel,i]);});
const results=[];
try{
 await s.open();const seed=await s.save();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;
  await s.open(f);const p=s.page;await p.setViewportSize({width,height});await pause();await p.evaluate(()=>document.fonts.ready);
  const font=await p.evaluate(()=>getComputedStyle(document.querySelector('#inventory_div')).fontSize);assert.equal(font,`${size}px`);
  const tag=`${width}-${size}`,row={width,height,size,font,checks:[]};
  await nav('projects');if(!(await p.locator('#projects_drawer').evaluate(d=>d.open)))await p.locator('#projects_drawer > summary').click();await pause();
  const enter=p.locator('#projects_drawer [data-mistglass-action="enter"]');await enter.evaluate(b=>{for(let d=b.closest('details');d;d=d.parentElement?.closest('details'))if(!d.open)d.querySelector(':scope > summary').click();});await pause();await enter.scrollIntoViewIfNeeded();
  assert(await enter.isDisabled());
  for(const r of await audit('#projects_drawer'))row.checks.push({where:'projects',...r,tab:r.tabStop?await tabReaches('#projects_drawer',r.i):false});
  await p.screenshot({path:path.join(out,`mistglass-${tag}.png`)});
  await nav('lotm');const panel=p.locator('#lotm_panel');
  await panel.locator('[data-lotm="pick_probationer"]').click();await pause();await panel.locator('[data-lotm="enroll"]').click();
  await p.waitForFunction(()=>/Tingen/.test(document.querySelector('#location_name_span')?.textContent||''),null,{timeout:30000});await pause();
  await nav('lotm');
  for(const r of await audit('#lotm_panel'))row.checks.push({where:'tingen',...r,tab:r.tabStop?await tabReaches('#lotm_panel',r.i):false});
  const first=p.locator('#lotm_panel [data-uiv1-probe]').first();if(await first.count())await first.scrollIntoViewIfNeeded();
  await p.screenshot({path:path.join(out,`tingen-${tag}.png`)});
  results.push(row);
 }
}finally{await s.close();server.close();await bundle.dispose();}
await fs.writeFile(path.join(out,'uiv1.json'),JSON.stringify(results,null,1));
let bad=0;
for(const r of results){console.log(`${r.width}x${r.height} text ${r.font}: ${r.checks.length} disabled controls`);
 for(const c of r.checks){const ok=c.visible&&c.tab;if(!ok)bad++;console.log(`  ${ok?'ok  ':'FAIL'} ${c.where} | ${c.label} | visible=${c.visible} tab=${c.tab} | ${c.reason}`);}}
assert(results.every(r=>r.checks.some(c=>c.where==='projects')&&r.checks.some(c=>c.where==='tingen')),'both surfaces had blocked controls to check');
assert.equal(bad,0,'every blocked reason is visible and Tab-reachable');
console.log('UIV1 probe PASS');
