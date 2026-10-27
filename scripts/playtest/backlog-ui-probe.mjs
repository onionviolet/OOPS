// Backlog UI probe (Q18 P02/P08/P09): Village teaching terms (DRC11) and carcass processing (DRC12) show each
// disabled reason without hover and Tab reaches it; motion tokens go static under reduced motion or Effects
// reduced (P08), and Drink one names observed effects (P09). The mentor career and the drink are earned from a
// fresh life; the carcass job is seeded on that save. Temp rebuilt bundle, fresh origin, headless,
// 1920x1080 and 1536x864 at text 14 and 21.
// Usage: node scripts/playtest/backlog-ui-probe.mjs <out-dir>
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session} from './lib.mjs';
import {createHarvest,drawSpecimen,addCarcass,beginHarvest} from '../../src/harvest.js';
import {calendarMinutes} from '../../src/world_rhythm.js';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
const s=await new Session({url:server.url,opTimeout:30000,seed:7,wall:Date.UTC(2026,9,27)}).start();
const pause=(ms=350)=>s.page.waitForTimeout(ms);
// Same audit as uiv1-probe: visible reason through aria-describedby, and Tab from the previous stop lands on it.
const audit=sel=>s.page.evaluate(sel=>{
 const shown=n=>!!n&&n.checkVisibility({contentVisibilityAuto:true,visibilityProperty:true});
 return [...document.querySelectorAll(sel+' button:disabled')].filter(shown).map((b,i)=>{
  const desc=(b.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean).map(id=>document.getElementById(id)).filter(shown);
  const reason=b.dataset.disabledReason||b.title||'';const visible=desc.find(n=>reason&&n.innerText.includes(reason));
  if(visible&&!visible.dataset.probe)visible.dataset.probe=String(i);
  return {i:visible?Number(visible.dataset.probe):i,label:b.innerText.trim().slice(0,50),reason:reason.slice(0,90),visible:!!visible,tabStop:!!visible&&visible.tabIndex===0};});},sel);
// A real Tab walk from the panel's first stop, as a keyboard player moves (focusing a mid-panel control can redraw it).
const tabReaches=async(sel,i)=>{
 const ok=await s.page.evaluate(sel=>{const first=[...document.querySelectorAll(`${sel} :is(summary,button:not(:disabled),[tabindex="0"],select:not(:disabled),input:not(:disabled))`)].find(n=>n.checkVisibility());first?.focus();return !!first;},sel);
 if(!ok)return false;
 for(let n=0;n<60;n++){if(await s.page.evaluate(([sel,i])=>!!document.activeElement?.matches(`${sel} [data-probe="${i}"]`),[sel,i]))return true;await s.page.keyboard.press('Tab');}
 return false;};
const results=[];
try{
 // DRC11 earned from a fresh life: five full patrol rounds with the kit returned, two promotions, then Iona assigned.
 await s.open();
 const patrolClick=async sel=>{await s.page.keyboard.press('Escape');await s.page.locator('#workspace_navigation select').first().selectOption('patrol');await pause(250);await s.page.locator(sel).click();await pause(200);};
 for(const rounds of [2,3]){for(let i=0;i<rounds;i++){await s.page.keyboard.press('Escape');await s.page.locator('.choice_work').click();await s.page.locator('[data-activity="patrolling"]').click();await s.step(121);await patrolClick('#village_return_kit');}await patrolClick('#village_promotion');}
 await patrolClick('#village_assign_recruit');
 const seed=await s.save();assert.equal(seed.village_career.rank,2,'mentor rank earned');assert.ok(seed.village_career.recruit,'Iona assigned');
 // DRC12 stays on seeded state: a running carcass job and two waiting carcasses (an earned carcass needs a fight).
 const clock=calendarMinutes(seed['current time']);
 seed.global_flags.is_crafting_unlocked=true;seed.harvest=createHarvest();seed.availabilities.skill??={};seed.availabilities.skill.Butchering=1;seed.levels.person.main_character.skill_xp.Butchering=0;
 for(let i=0;i<3;i++)addCarcass(seed.harvest,drawSpecimen({species:'Wolf rat',key:`probe-${i}`,clock:clock-5},()=>.5),{clock});
 beginHarvest(seed.harvest,'Wolf rat','whole',{clock,skill:0});
  for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;
  await s.open(f);const p=s.page;await p.setViewportSize({width,height});await pause();await p.evaluate(()=>document.fonts.ready);
  const font=await p.evaluate(()=>getComputedStyle(document.querySelector('#inventory_div')).fontSize);assert.equal(font,`${size}px`);
  const tag=`${width}-${size}`,row={width,height,size,font,checks:[]};
  // DRC11: the teaching terms sit in the Village patrol controls; off a patrol round they wait on it.
  await p.keyboard.press('Escape');await p.locator('#workspace_navigation select').first().selectOption('patrol');await pause();await p.locator('#village_career_controls').waitFor({state:'attached'});
  await p.locator('#village_teach_paid').evaluate(b=>{for(let d=b.closest('details');d;d=d.parentElement?.closest('details'))d.open=true;b.scrollIntoView({block:'center'});});await pause();
  for(const r of await audit('#village_career_controls'))row.checks.push({where:'teaching',...r,tab:r.tabStop?await tabReaches('#village_career_controls',r.i):false});
  await p.screenshot({path:path.join(out,`teaching-${tag}.png`)});
  // DRC12: a carcass job holds the other starts.
  await p.keyboard.press('Escape');await p.locator('#workspace_navigation select').first().selectOption('carcass-processing');await p.locator('#harvest_panel').evaluate(el=>{el.open=true;el.scrollIntoView({block:'start'});});await pause();
  for(const r of await audit('#harvest_panel'))row.checks.push({where:'harvest',...r,tab:r.tabStop?await tabReaches('#harvest_panel',r.i):false});
  await p.screenshot({path:path.join(out,`harvest-${tag}.png`)});
  results.push(row);
 }
 // P09 (DRC9), earned route from a fresh life: gather, steep three times, drink one; only the drunk batch names its effect.
 await s.open();const fresh=await s.save();results.drink=[];
 for(const [width,height,size]of [[1920,1080,14],[1536,864,21]]){
  const f=structuredClone(fresh);f.customization.profiles.Default.settings.typography.size=size;
  await s.open(f);const p=s.page;await p.setViewportSize({width,height});await pause();
  await p.locator('[data-inspect-nearby="herbal-experiments"]').click();await p.getByRole('button',{name:'Open Village common herb verge',exact:true}).click();
  for(let k=0;k<3;k++){await p.locator('#crafting_gather').click();await s.step(5);await p.locator('[data-craft-material]').first().check();await p.locator('#crafting_engine_home [data-craft-detail] [data-craft-commit]').click();await s.step(30);}
  const before=await p.locator('[data-crafted-use]').allInnerTexts();
  await p.locator('[data-crafted-use]').first().click();await s.step(10);await pause();
  const after=await p.locator('[data-crafted-use]').allInnerTexts();
  await p.locator('[data-crafted-use]').first().scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`drink-${width}-${size}.png`)});
  results.drink.push({width,size,before,after});
 }
 // P08: one token switch. Ordinary motion, then Effects reduced, then the OS preference.
 const p=s.page;await p.setViewportSize({width:1920,height:1080});
 const timing=()=>p.evaluate(()=>{const b=document.querySelector('#main_content.workspace-active button:not([hidden])'),m=document.querySelector('#main_content .meter-bar-fill');
  return {button:getComputedStyle(b).transitionDuration,meter:m?getComputedStyle(m).transitionDuration:null,effects:document.documentElement.dataset.effects};});
 // The default Effects setting is reduced; full is the setting that moves.
 const effects=async e=>{await p.evaluate(e=>{document.documentElement.dataset.effects=e;},e);return timing();};
 const motion={defaultEffects:await timing(),full:await effects('full'),reduced:await effects('reduced'),off:await effects('off')};
 await effects('full');await p.emulateMedia({reducedMotion:'reduce'});motion.osReduced=await timing();
 results.push({motion});
}catch(e){await s.page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});console.log('errors',JSON.stringify(s.errors.slice(0,5)));throw e;}finally{await s.close();server.close();await bundle.dispose();}
await fs.writeFile(path.join(out,'backlog-ui.json'),JSON.stringify({cells:results,drink:results.drink},null,1));
let bad=0;
for(const r of results.filter(r=>r.checks)){console.log(`${r.width}x${r.height} text ${r.font}: ${r.checks.length} disabled controls`);
 for(const c of r.checks){const ok=c.visible&&c.tab;if(!ok)bad++;console.log(`  ${ok?'ok  ':'FAIL'} ${c.where} | ${c.label} | visible=${c.visible} tab=${c.tab} | ${c.reason}`);}}
const {motion}=results.at(-1);console.log('motion',JSON.stringify(motion));console.log('drink',JSON.stringify(results.drink));
for(const d of results.drink){assert.ok(d.before.length&&d.before.every(t=>t==='Drink one'),'untried batches stay plain');assert.ok(d.after.some(t=>/^Drink one · observed \w+ -?\d/.test(t)),'the drunk batch names what was seen');assert.ok(d.after.every(t=>t==='Drink one'||/^Drink one · observed /.test(t)));}
assert(results.filter(r=>r.checks).every(r=>r.checks.some(c=>c.where==='teaching')&&r.checks.some(c=>c.where==='harvest')),'both surfaces had blocked controls to check');
assert.equal(bad,0,'every blocked reason is visible and Tab-reachable');
assert.match(motion.full.button,/^0.12s(, 0.12s)*$/);assert.equal(motion.full.meter,'0.18s');for(const k of ['reduced','off'])assert.ok([motion[k].button,motion[k].meter].every(t=>/^0s(, 0s)*$/.test(t)),k);
assert.match(motion.osReduced.meter,/^(0s|1e-0\ds)(, (0s|1e-0\ds))*$/);assert.match(motion.osReduced.button,/^(0s|1e-0\ds)(, (0s|1e-0\ds))*$/,'OS reduced motion: token zero or the workspace kill switch');
console.log('Backlog UI probe PASS');
