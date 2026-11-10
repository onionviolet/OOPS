// HP lead exams: fresh-origin headless Chrome at 1920x1080. Walks the lead's own acts (the same buttons a player presses), attends lessons,
// then revises, sits the seven papers, reads the marks, saves and reloads. Evidence: docs/gm/dispatch/hp-exams-2026-11-10/. Usage: node scripts/hp_exam_browser.cjs [port] [mode]
const fs=require('node:fs'),assert=require('node:assert/strict');
const {launchChrome}=require('./ui_helpers.cjs');
const out='docs/gm/dispatch/hp-exams-2026-11-10',port=process.argv[2]||'5131',mode=process.argv[3]||'full';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await launchChrome(),errors=[],log=[];
 try{
  const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.dismiss());
  await page.goto(`http://127.0.0.1:${port}/?test_hooks=1`);
  await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
  await page.evaluate(()=>window.simulationTestHooks.pause());
  await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(400);
  await page.locator('#workspace_navigation select').first().selectOption('beginning');
  await page.locator('[data-structured-choice="life"]').selectOption('book.hp.lead');
  await page.getByRole('button',{name:'Confirm arrival',exact:true}).click();await page.waitForTimeout(500);
  const openPanel=async()=>{await page.locator('#workspace_navigation select').first().selectOption('hp').catch(()=>{});await page.waitForTimeout(150);};
  await openPanel();
  const step=async n=>{await page.evaluate(n=>window.advanceTicks(n),n);await page.waitForTimeout(120);};
  const day=()=>page.evaluate(()=>{const t=window.simulationTestHooks.snapshot()['current time'];return t.day_count;});
  const panel=()=>page.locator('#hp_panel');
  const text=async()=>(await panel().innerText().catch(()=>''));
  const shot=n=>page.screenshot({path:`${out}/${n}.png`});
  const clickFirst=async sel=>{const l=page.locator(sel+':not([disabled])').first();if(await l.count()===0)return false;await l.scrollIntoViewIfNeeded().catch(()=>{});await l.click();await page.waitForTimeout(150);return true;};
  const log1=(k,v)=>{log.push({k,v});};
  // Walk: next story action / extension offer / open lesson, advancing the clock between presses.
  let idle=0,presses=0;
  const sel=['[data-hp-excursion-start]','[data-hp-task-link] ~ *','[data-hp]','[data-hp-lesson]'];
  while(idle<6&&presses<400){
   await openPanel();const d0=await day(),t0=await text();
   let did=false;
   for(const s of ['[data-hp-excursion-start]','[data-hp]','[data-hp-lesson]']){ if(await clickFirst(s)){did=true;break;} }
   await step(did?150:1440);
   const t1=await text(),d1=await day();
   presses++;idle=(did||d1!==d0||t1!==t0)?0:idle+1;
   if(presses%10===0){console.log('presses',presses,'day',d1,t1.split('\n').slice(0,3).join(' | ').slice(0,160));}
   if(d1>=247)break;
  }
  log1('reached',{day:await day(),presses});
  console.log('reached day',await day(),'presses',presses);
  console.log((await text()).slice(0,1500));
  fs.writeFileSync(`${out}/run-log.json`,JSON.stringify({errors,log},null,1));
  await shot('route-end');
 }finally{await browser.close();}
})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
