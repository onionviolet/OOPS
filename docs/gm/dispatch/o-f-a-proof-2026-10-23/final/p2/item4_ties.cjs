// Item 4. FIXTURE (labelled): b/pre-boundary.save.txt (owner's age-boundary save) with life age moved to the boundary and a relative recorded
// in Chronicle relationships.bram.ties {kinRelation:'spouse',kinName:'Bram',kinAge:60} (no UI path writes ties). Everything after is native:
// ended-life modal estate preview, Begin heir, Family panel, Save, reload, Export (download), file Import (setInputFiles).
const fs=require('node:fs'),path=require('node:path');
const {run,out}=require('./lib.cjs');
run('i4-ties','',async({page,url,shot,say})=>{
 const norm=t=>t.replace(/\s+/g,' ').trim(), results={};
 const play=async()=>{await page.locator('#loading_screen_play_button:not(.none_display)').click({noWaitAfter:true});await page.evaluate(()=>{simulationTestHooks.pause();advanceTicks(1);});};
 const rd=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const fam=async tag=>{await page.evaluate(()=>{simulationTestHooks.pause();advanceTicks(1);const n=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.textContent==='Family'));n.value=[...n.options].find(o=>o.textContent==='Family').value;n.dispatchEvent(new Event('change',{bubbles:true}));});
  const panel=page.locator('#family_tree_panel');await panel.waitFor({state:'visible'});const t=await panel.innerText();await panel.scrollIntoViewIfNeeded();await panel.screenshot({path:path.join(out,`i4-family-${tag}.png`)});await shot('family-page-'+tag);
  results['family_'+tag]=t;say('FAMILY '+tag,norm(t));return t;};
 const s=JSON.parse(Buffer.from(fs.readFileSync(path.join(__dirname,'../../b/pre-boundary.save.txt'),'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64'));
 s.expansion.chronicle.life.initialAge=79.99999807098766;
 s.expansion.chronicle.relationships.bram={axes:{},ties:{kinRelation:'spouse',kinName:'Bram',kinAge:60},memories:[]};
 const file=path.join(out,'i4-fixture.save.txt');fs.writeFileSync(file,'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(s)).toString('base64'));
 await page.goto(url);
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(file)]);await play();
 const modal=page.locator('#chronicle_life_end');await modal.waitFor({state:'visible'});
 const est=await page.locator('#chronicle_heir_leftovers').innerText();results.estate_preview=est;say('ESTATE PREVIEW (ended-life modal)',est);say('modal full text',norm(await modal.innerText()));
 await modal.screenshot({path:path.join(out,'i4-estate-modal.png')});
 results.preview_mentions_Bram=/Bram/.test(await modal.innerText());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),modal.locator('[data-life="begin-heir"]').press('Enter')]);await play();
 const heir0=await rd();say('heir lineage',heir0.expansion.chronicle.life.experience.lineage,'rel ties kept',heir0.expansion.chronicle.relationships&&Object.keys(heir0.expansion.chronicle.relationships));
 const t1=await fam('1-native-heir');
 const proj=x=>JSON.stringify(x.expansion.chronicle.life.experience.lineage);
 await page.evaluate(()=>window.saveProgress());const saved=await rd();
 await page.reload({waitUntil:'domcontentloaded'});const reloaded=await rd();say('lineage equal after reload',proj(saved)===proj(reloaded));await play();
 const t2=await fam('2-after-reload');
 const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const f2=path.join(out,'i4-export.save.txt');await(await dl).saveAs(f2);
 const lit=JSON.parse(Buffer.from(fs.readFileSync(f2,'utf8').trim().replace(/^YAIR-UTF8-1:/,''),'base64').toString());say('exported lineage',lit.expansion.chronicle.life.experience.lineage);
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(f2)]);await play();
 const imp=await rd();say('lineage equal after import',proj(imp)===proj(lit));
 const t3=await fam('3-after-import');
 results.ok={family1:/Bram/.test(t1)&&/spouse of Hero/.test(t1),reload:norm(t2)===norm(t1),import:norm(t3)===norm(t1)};say('RESULTS',results.ok,'preview mentions Bram',results.preview_mentions_Bram);
 fs.writeFileSync(path.join(out,'i4-results.json'),JSON.stringify(results,null,1));
});
