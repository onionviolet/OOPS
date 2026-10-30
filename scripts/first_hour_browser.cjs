// First-hour evidence (docs/representations/FIRST_HOUR.md): fresh life at 1920x1080, next-step line on or off.
// Usage: YAIRPG_PROOF_URL=http://127.0.0.1:PORT/ YAIRPG_NEXT_STEP=on|off node scripts/first_hour_browser.cjs
const assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path');
const {launchChrome}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18511/', mode=process.env.YAIRPG_NEXT_STEP||'on';
const out=process.env.YAIRPG_PROOF_DIR||'docs/representations/evidence/first-hour'; fs.mkdirSync(out,{recursive:true});
const tag=mode==='on'?'after':'before';
(async()=>{const browser=await launchChrome();try{
  const context=await browser.newContext({viewport:{width:1920,height:1080}});
  await context.addInitScript(m=>{try{localStorage.setItem('yairpg.display.v1',JSON.stringify({nextStep:m}));}catch{}},mode);
  const page=await context.newPage(),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();await page.waitForTimeout(1500);
  const text=async()=>page.evaluate(()=>document.getElementById('next_step')?.hidden===false?document.getElementById('next_step').textContent:'');
  const shot=async n=>page.screenshot({path:path.join(out,`${tag}-${n}.png`)});
  const log=[];const note=async n=>{const t=await text();log.push({stage:n,nextStep:t});await shot(n);};
  await note('minute0');
  if(mode==='on')assert.match(await text(),/Talk to the village elder/);
  await page.locator('[data-native-choice="location"]',{hasText:'Talk to someone'}).first().click();await page.locator('[data-dialogue="villageElder"]').click();
  await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(300);
  await page.locator('[data-textline="what happened"]').click();await page.waitForTimeout(1300);
  if(mode==='on')assert.match(await text(),/say you want to leave/);
  await note('after-first-answer');
  await page.locator('[data-textline="ask to leave 1"]').click();await page.locator('[data-textline="need to"]').click();await page.waitForTimeout(1300);
  if(mode==='on')assert.match(await text(),/spare weapon/);
  await note('sent-to-the-field');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,`${tag}-log.json`),JSON.stringify(log,null,1));
  console.log(JSON.stringify(log));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
