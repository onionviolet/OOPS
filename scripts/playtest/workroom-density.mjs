// Headless evidence for the Tingen workroom tabs: text and button density per tab vs the old single-scroll layout.
// Usage: node scripts/playtest/workroom-density.mjs <root> <outDir>
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
await fs.mkdir(out,{recursive:true});
const server=await serve(root);
const s=await new Session({url:server.url+'?test_hooks=1',opTimeout:20000,seed:7,wall:Date.UTC(2026,9,26),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const receipt={bundleSha256:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),route:'fresh game → Tingen door → pick_probationer → enroll → workroom tabs at 14 and 21 px text (effects off)',effects:'off via document.documentElement.dataset.effects (set after each Apply and save)',sizes:[]};
// Measured in page: clone the panel, drop [data-tab-off] and [hidden] subtrees, then read text and walk it in document order.
// Visibility is judged on the live node (a tab-off or hidden ancestor, display:none, or zero size hides it) and mirrored by the clone's pruning.
const measure=()=>{
 const panel=document.querySelector('#lotm_panel');
 const live=el=>{for(let n=el;n&&n!==panel.parentElement;n=n.parentElement){if(n.hasAttribute('data-tab-off')||n.hidden)return false;const cs=getComputedStyle(n);if(cs.display==='none'||cs.visibility==='hidden')return false;}const r=el.getBoundingClientRect();return r.width>0&&r.height>0;};
 // Tag live-visible nodes so the clone keeps only those, including the tab strip itself (it is visible text a player reads).
 const all=[panel,...panel.querySelectorAll('*')];all.forEach((n,i)=>n.setAttribute('data-m-i',i));
 const keep=new Set(all.filter(live).map(n=>n.getAttribute('data-m-i')));
 const clone=panel.cloneNode(true);
 clone.querySelectorAll('[data-tab-off],[hidden]').forEach(n=>n.remove());
 clone.querySelectorAll('*').forEach(n=>{if(!keep.has(n.getAttribute('data-m-i')))n.remove();});
 all.forEach(n=>n.removeAttribute('data-m-i'));
 // innerText needs layout, so measure on a detached clone via textContent-free walk: mount it off-screen with the same classes.
 const host=document.createElement('div');host.style.cssText='position:absolute;left:-99999px;top:0;width:'+panel.getBoundingClientRect().width+'px';
 host.append(clone);document.body.append(host);
 const text=clone.innerText;
 const buttons=[...clone.querySelectorAll('button')].filter(b=>!b.disabled&&b.getAttribute('aria-disabled')!=='true');
 const allButtons=clone.querySelectorAll('button').length;
 let before=text.length;
 const first=buttons.find(b=>!b.closest('[role="tablist"]')&&!b.closest('[data-workroom-moved]'));
 if(first){
  // Characters of text preceding the first non-tab action button in document order.
  const r=document.createRange();r.setStart(clone,0);r.setEndBefore(first);
  const frag=document.createElement('div');frag.style.cssText=host.style.cssText;
  frag.append(r.cloneContents());document.body.append(frag);before=frag.innerText.length;frag.remove();
 }
 host.remove();
 return {text,chars:text.length,charsBeforeFirstButton:before,buttons:allButtons};
};
const failShot=async()=>s.page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});
try{
 await s.open();const p=s.page;
 await p.locator('#location_actions_div [data-lotm-door]').click();
 await p.locator('#lotm_panel [data-lotm="pick_probationer"]').click();
 await p.locator('#lotm_panel [data-lotm="enroll"]').click();
 await p.waitForFunction(()=>/Tingen/.test(document.querySelector('#location_name_span')?.textContent||''),null,{timeout:30000});await p.waitForTimeout(350);
 for(const size of [14,21]){
  // Same text-size mechanism as reconcile-master: Customization → Font size → Apply and save, then back to the Tingen workroom.
  await p.locator('#workspace_navigation select').first().selectOption('customization');
  await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');
  await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();
  await p.locator('#workspace_navigation select').first().selectOption('lotm');
  await p.locator('#lotm_panel').waitFor({state:'visible',timeout:60000});
  await p.evaluate(()=>{document.documentElement.dataset.effects='off';});
  await p.waitForTimeout(350);
  const wrap=p.locator('#lotm_panel [data-workroom-tabs]');
  assert(await wrap.isVisible(),'workroom tab wrapper is visible');
  const here=wrap.locator('[role="tablist"] [role="tab"][data-tab="here"]');
  // The tab choice is kept in memory for the page, so only the first pass sees the default.
  if(size===14)assert.equal(await here.getAttribute('aria-selected'),'true','here tab is selected after enrollment');
  else await here.click();
  // Baseline: every tab forced visible stands for the old single-scroll layout.
  await p.evaluate(()=>document.querySelectorAll('#lotm_panel [data-tab-off]').forEach(n=>n.removeAttribute('data-tab-off')));
  const base=await p.evaluate(measure);
  await here.click();await p.waitForTimeout(150);
  const entry={size,baseline:{chars:base.chars,charsBeforeFirstButton:base.charsBeforeFirstButton,buttons:base.buttons},tabs:[]};
  await fs.writeFile(path.join(out,`text-baseline-${size}.txt`),base.text);
  const tabs=wrap.locator('[role="tablist"] [role="tab"]');
  const n=await tabs.count(),order=[];
  for(let i=0;i<n;i++){const t=tabs.nth(i);if(await t.isVisible())order.push({id:await t.getAttribute('data-tab'),index:i});}
  assert(order.length>0,'at least one visible tab');
  for(const {id,index} of order){
   const t=tabs.nth(index);const label=(await t.innerText()).trim();
   await t.click();await p.waitForTimeout(150);
   await p.screenshot({path:path.join(out,`workroom-${id}-1920-${size}.png`)});
   const m=await p.evaluate(measure);
   await fs.writeFile(path.join(out,`text-${id}-${size}.txt`),m.text);
   entry.tabs.push({id,label,chars:m.chars,charsBeforeFirstButton:m.charsBeforeFirstButton,buttons:m.buttons});
  }
  receipt.sizes.push(entry);
 }
 // Known noise: 404s for private fonts and packs, which a plain static server does not have. Real page errors still fail.
 assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'||!/404/.test(e.text)),[]);receipt.status='PASS';
}catch(e){receipt.status='FAIL';receipt.error=e.stack;await failShot();throw e;}
finally{receipt.errors=s.errors;await fs.writeFile(path.join(out,'result.json'),JSON.stringify(receipt,null,2));await s.close();await server.close();}
console.log(JSON.stringify({status:receipt.status,sizes:receipt.sizes.map(z=>({size:z.size,baseline:z.baseline,tabs:z.tabs.map(t=>[t.id,t.chars,t.charsBeforeFirstButton,t.buttons])}))}));
