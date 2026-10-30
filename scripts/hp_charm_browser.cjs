// bk-hp: fresh-origin HP school life -> charm status rows at each step. 1920x1080, headless, own port. Evidence: docs/gm/dispatch/book-ui-wave-2026-10-30/evidence/hp/
const fs=require('node:fs'),assert=require('node:assert/strict');
const {launchChrome}=require('./ui_helpers.cjs');
const out='docs/gm/dispatch/book-ui-wave-2026-10-30/evidence/hp',port=process.argv[2]||'5107';
(async()=>{
 const browser=await launchChrome(),errors=[],log=[];
 try{
  const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),page=await context.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror',e=>errors.push(e.message));
  const P='book.hp.school';
  await page.goto(`http://127.0.0.1:${port}/?test_hooks=1&structured_candidate=${P}`);
  await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
  await page.evaluate(()=>window.simulationTestHooks.pause());
  await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(350);
  await page.locator('#workspace_navigation select').first().selectOption('beginning');
  await page.locator('[data-structured-begin]').click();await page.waitForTimeout(400);
  const nav=()=>page.locator('#workspace_navigation select').first().selectOption('beginning');
  const act=async n=>{await nav();await page.waitForTimeout(150);await page.locator(`[data-structured-action="${P}.${n}"]`).click();await page.waitForTimeout(300);};
  const step=async n=>{await page.evaluate(n=>window.advanceTicks(n),n);await page.waitForTimeout(300);};
  const rows=async()=>{await nav();await page.waitForTimeout(250);return (await page.locator('#structured_pack_panel').innerText()).split('\n').filter(l=>/levitation|Reparo/i.test(l)&&/learned|Ready|Practised|Taught/.test(l));};
  const snap=async n=>{const r=await rows();log.push({step:n,rows:r});await page.screenshot({path:`${out}/${n}.png`});return r;};
  let r=await snap('1-fresh');assert.ok(r.some(l=>/Not learned yet.*Mara/.test(l)),r.join('|'));
  await act('lesson_charms');await step(30);
  r=await snap('2-taught');assert.ok(r.some(l=>/0 of 1 drills/.test(l)),r.join('|'));
  await act('practice_levitation');await step(3);
  r=await snap('3-practised');assert.ok(r.some(l=>/Ready to cast/.test(l)&&/not in effect/.test(l)),r.join('|'));
  await act('cast_levitation');
  r=await snap('4-cast');assert.ok(r.some(l=>/1 cast so far/.test(l)),r.join('|'));
  const reloadSave=await page.evaluate(()=>{window.saveProgress();return localStorage.getItem('save data');});
  await page.reload();await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>window.simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(500);
  await page.locator('#workspace_navigation select').first().selectOption('beginning');
  r=await snap('5-after-reload');assert.ok(r.some(l=>/1 cast so far/.test(l)),r.join('|'));
  assert.equal(errors.length,0,errors.join('|'));
  fs.writeFileSync(`${out}/run-log.json`,JSON.stringify({errors,log,saveBytes:reloadSave.length},null,1));
  console.log('OK',JSON.stringify(log.map(l=>l.rows[0]?.slice(0,90))));
 }finally{await browser.close();}
})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
