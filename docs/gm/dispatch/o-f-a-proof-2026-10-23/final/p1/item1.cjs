// Item 1: D1/D2 real pointer clicks (page.mouse.click at bbox centre). Usage: node item1.cjs  (from worktree root)
// Entry: localhost ?structured_candidate=warmhand (existing local authoring-preview switch) so a Begin button + action buttons exist; ?test_hooks=1 only for advanceGameMinutes.
const fs=require('node:fs'),path=require('node:path');
const {run,out,realClick,root}=require('./lib.cjs');
const {advanceGameMinutes}=require(path.join(root,'scripts/ui_helpers.cjs'));
const results={};
run('i1',async({page,url,say,shot,port})=>{
 await page.goto(url+'&structured_candidate=warmhand');
 await page.waitForFunction(()=>window.simulationTestHooks);
 await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(1500);
 const openBeginning=async()=>{if(!await page.locator('#structured_pack_panel').isVisible()){await realClick(page,page.locator('button:text-is("Beginning")').first(),say,'nav Beginning');await page.waitForTimeout(600);}};
 results.notebookNavBeforeBegin=await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.offsetParent&&b.textContent.trim().startsWith('Notebook')));say('top-nav Notebook visible at fresh start (before Begin):',results.notebookNavBeforeBegin);
 await openBeginning();await shot('1-offer');
 // Begin
 const begin=page.locator('[data-structured-begin]');
 results.begin=await realClick(page,begin,say,'Begin');await page.waitForTimeout(1000);
 results.beginEffect=await page.evaluate(()=>({beginStillThere:!!document.querySelector('[data-structured-begin]')?.offsetParent,actionButtons:[...document.querySelectorAll('[data-structured-action]')].map(b=>b.dataset.structuredAction)}));
 say('begin effect',results.beginEffect);await shot('2-begun');
 // Action
 await advanceGameMinutes(page,22);await page.waitForTimeout(300);
 const invBefore=await page.locator('#structured_pack_panel').innerText();
 const act=page.locator('[data-structured-action="warmhand.warm"]');say('action disabled?',await act.isDisabled());
 results.action=await realClick(page,act,say,'action warmhand.warm');await page.waitForTimeout(800);
 for(let i=0;i<12&&await page.locator('[data-structured-cancel]:visible').count();i++){await advanceGameMinutes(page,1);await page.waitForTimeout(200);}
 const invAfter=await page.locator('#structured_pack_panel').innerText();
 results.actionEffectChanged=invBefore!==invAfter;say('action effect: panel text changed',results.actionEffectChanged,'| after:',invAfter.slice(0,700));await shot('3-action');
 // Bio summaries
 const stats=page.locator('nav button:text-is("Stats"), button:text-is("Stats")').first();
 if(!await page.locator('#character_show_bio').isVisible())await realClick(page,stats,say,'nav Stats');
 await page.waitForTimeout(500);
 await realClick(page,page.locator('#character_show_bio'),say,'Bio tab');await page.waitForTimeout(500);
 results.bio=[];
 for(const s of ['description','conditions','influences','heritage','learned','faded']){
  const d=page.locator(`[data-bio-section="${s}"]`);if(!await d.isVisible())continue;
  const before=await d.evaluate(n=>n.open);const hit=await realClick(page,d.locator('summary'),say,'Bio summary '+s);await page.waitForTimeout(250);
  const after=await d.evaluate(n=>n.open);results.bio.push({s,hit,before,after});say('bio',s,{before,after});
 }
 await shot('4-bio');
 // Notebook: top-nav button (unlocked after Begin: report 'Notes, practice & people is now available in navigation.')
 const inv=await page.locator('#inventory_div, body').first().innerText();results.warmLoafInInventory=/Warm loaf/.test(inv);say('Warm loaf in inventory after action:',results.warmLoafInInventory);
 const navNb=page.locator('button:text-is("Notebook"), button:has-text("Notebook")').first();
 results.notebookNav=await realClick(page,navNb,say,'top-nav Notebook');await page.waitForTimeout(800);
 results.notebookState=await page.evaluate(()=>{const v=id=>{const e=document.getElementById(id);return e?{visible:!!e.offsetParent,hidden:e.hidden}:null};
  const tabs=[...document.querySelectorAll('[data-notebook-view]')].filter(b=>b.offsetParent).map(b=>b.dataset.notebookView+(b.getAttribute('aria-selected')==='true'?'*':''));
  return {notebook_box_div:v('notebook_box_div'),notebook_empty:v('notebook_empty'),notebook_empty_text:document.getElementById('notebook_empty')?.textContent,visibleNotebookTabs:tabs,journalVisible:!!document.getElementById('journal_div')?.offsetParent,
   notebookRootsVisible:[...document.querySelectorAll('#notebook_box_div, .adventure_notebook, #adventure_notebook')].filter(e=>e.offsetParent).map(e=>e.id||e.className)}});
 say('notebook state',results.notebookState);await shot('5-notebook');
 fs.writeFileSync(path.join(out,'i1-results.json'),JSON.stringify(results,null,1));
});
