const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
process.env.URL='http://127.0.0.1:18820/';
const R=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root=process.cwd(),out=__dirname;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const errors=[],checks=[];let servedHash;
 const context=await browser.newContext({viewport:{width:1366,height:768},acceptDownloads:true});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 page.on('response',async r=>{if(r.url().includes('/dist/bundle.js?')&&r.status()===200){try{servedHash=crypto.createHash('sha256').update(await r.body()).digest('hex');}catch(e){errors.push(e.message);}}});
 try {
  await page.goto(process.env.URL,{waitUntil:'domcontentloaded'});await R.startFresh(page);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/bundle.js'))).digest('hex');
  checks.push({id:'B1',label:'fresh-origin native desktop loads rebuilt bundle',ok:servedHash===hash,hash});
  const text=await R.saveText(page),saved=JSON.parse(text);
  checks.push({id:'B2',label:'native old-save defaults preserve optional absence',ok:!Object.hasOwn(saved.character,'long_life_worn')});
  await page.reload({waitUntil:'domcontentloaded'});await R.startFresh(page);
  const reloaded=JSON.parse(await R.saveText(page));
  checks.push({id:'B3',label:'native reload retains held title state',ok:JSON.stringify(saved.character.titles)===JSON.stringify(reloaded.character.titles)});
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
  const exported=path.join(out,'native-fresh-export.txt');await download.saveAs(exported);
  const second=await browser.newContext({viewport:{width:1366,height:768}}),importPage=await second.newPage();
  importPage.on('pageerror',e=>errors.push(e.message));
  await importPage.goto(process.env.URL,{waitUntil:'domcontentloaded'});await R.startFresh(importPage);
  await Promise.all([importPage.waitForEvent('framenavigated'),importPage.locator('#saved_file_input').setInputFiles(exported)]);
  await R.startFresh(importPage);
  const imported=JSON.parse(await R.saveText(importPage));
  checks.push({id:'B4',label:'native literal-file import preserves old held titles and optional absence',ok:JSON.stringify(saved.character.titles)===JSON.stringify(imported.character.titles)&&!Object.hasOwn(imported.character,'long_life_worn')});
  await page.screenshot({path:path.join(out,'native-desktop.png')});
  await second.close();
  // Supplemental module projection only. This is not coupled native gameplay.
  const fixture=await page.evaluate(async()=>{
   const {grantEarnedTitles,titleView}=await import('/src/titles.js');
   const {wornTitleView,selectWornTitle,longLifeTitleBonuses}=await import('/src/absorb_p23/long_life/worn.js');
   const {createTitlesPanel}=await import('/src/titles_ui.js');
   document.getElementById('titles_panel')?.remove();
   const titles={hunter:{at:1},reader:{at:1}},counters={home_minutes:60};grantEarnedTitles(titles,counters,60);
   let state;const panel=createTitlesPanel({read:()=>titleView(titles,counters,{knownOnly:true}),readWorn:()=>wornTitleView(titles,state),selectWorn:(id,enabled)=>{state=selectWornTitle(titles,state,id,enabled);},readTraining:()=>({text:'Cooking level 3: +5% Alchemy XP (active).'})});
   panel.render();document.getElementById('titles_panel').open=true;
   const box=document.querySelector('#titles_panel input');box.click();
   const select=document.querySelector('#titles_panel select');select.value='quiet_hour';select.dispatchEvent(new Event('change'));
   const result={sleeping:longLifeTitleBonuses(titles,state).xp_multipliers.Sleeping,combat:longLifeTitleBonuses(titles,state).xp_multipliers.Combat};
   panel.destroy();return result;
  });
  checks.push({id:'B5',label:'SUPPLEMENTAL uncoupled worn UI callbacks',ok:fixture.sleeping===1.02&&fixture.combat===1.02,fixture});
  const evidence={viewport:{width:1366,height:768},servedHash,checks,errors,nativeChangedLoop:'OPEN: P00 host joins required',positivePersistence:'OPEN: P00 host joins required'};
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
  if(errors.length||checks.some(c=>!c.ok))process.exitCode=1;
 } finally {await context.close();await browser.close();}
})().catch(e=>{fs.writeFileSync(path.join(out,'browser-error.txt'),e.stack);console.error(e);process.exitCode=1;});
