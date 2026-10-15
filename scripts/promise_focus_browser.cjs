const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome,waitForPage}=require('./ui_helpers.cjs');const {openNotebook}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18625/',out=process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-promise-focus';fs.mkdirSync(out,{recursive:true});
const seedPath='/Users/weiwei/.codex/visualizations/2026/10/04/01a1051c-ed9f-7a92-81fb-53403489e007/promise-delivery-proof/generated-help-save.json';
(async()=>{
 const browser=await launchChrome();const errors=[],findings=[];let page;
 try{
  const seed=JSON.parse(fs.readFileSync(seedPath,'utf8'));
  for(const mode of ['cancel','completion','instant']){
   const context=await browser.newContext({viewport:{width:1500,height:1050}}),fixture=structuredClone(seed);if(mode==='instant')delete fixture.expansion;
   await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
   page=await context.newPage();page.on('pageerror',e=>errors.push(e.stack));await page.goto(url);await page.getByText('PLAY',{exact:true}).click();
   await openNotebook(page);await page.locator('[data-notebook-view="people"]').click();await page.locator('#promise_panel').evaluate(n=>n.open=true);
   if(mode==='instant'){
    await page.locator('[data-promise-command="promise.begin"]').click();assert.equal(await page.locator('#promise_panel [role="status"]').isVisible(),true);
    assert.match(await page.locator('#promise_panel [role="status"]').innerText(),/recorded/);findings.push('Instant successful reply exposes a concise status without new knowledge or rewards.');
   }else{
    await page.locator('[data-promise-command="promise.pack_brace"]').click();const cancel=page.locator('[data-promise-command="cancel"]');await cancel.focus();
    if(mode==='cancel')await page.keyboard.press('Enter');else await cancel.waitFor({state:'hidden'});
    const focus=await page.evaluate(()=>document.activeElement===document.querySelector('#promise_panel > summary'));
    findings.push({mode,focus,active:await page.evaluate(()=>document.activeElement?.outerHTML)});assert.equal(focus,true,'Focus must return to the visible traveler summary after '+mode);
    if(mode==='cancel')assert.match(await page.locator('#promise_panel [role="status"]').innerText(),/returned/);
   }
   await context.close();
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({url,findings,errors},null,2));console.log(JSON.stringify({findings,errors},null,2));
 }catch(e){fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({error:e.stack,findings,errors},null,2));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exit(1);});
