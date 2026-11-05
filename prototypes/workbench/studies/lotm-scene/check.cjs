const {launchChrome}=require('../../../../scripts/ui_helpers.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const base=process.argv[2];if(!base)throw Error('Pass workbench URL');
(async()=>{
 const browser=await launchChrome();
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'}),errors=[],checks=[];
 page.setDefaultTimeout(10000);
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('studies/lotm-scene/index.html',base).href);
 const command=async(command,value)=>page.evaluate(({command,value})=>new Promise((resolve,reject)=>{const id=crypto.randomUUID();const timeout=setTimeout(()=>reject(Error('protocol timeout')),3000);const handler=e=>{if(e.data?.type==='mockup:reply'&&e.data.id===id){window.removeEventListener('message',handler);clearTimeout(timeout);e.data.error?reject(Error(e.data.error)):resolve(e.data.snapshot);}};window.addEventListener('message',handler);window.postMessage({type:'mockup:command',id,command,value},location.origin);}),{command,value});
 const capture=()=>command('capture');
 const pick=async(mode,id)=>{const s=page.locator(`[data-mode=${mode}]`);if(mode==='walk'){const pt=await capture(),coords=pt.place==='home'?{desk:[4,3],purse:[13,3],table:[12,8],door:[18,9]}:{bakery:[14,3],home:[3,8]};const canvas=s.locator('canvas'),r=await canvas.boundingBox(),[x,y]=coords[id];await canvas.click({position:{x:(x+.5)/20*r.width,y:(y+.5)/12*r.height}});}else await s.locator(`[data-subject=${id}]`).click();};
 const act=async(mode,id,action)=>{await pick(mode,id);await page.locator(`[data-mode=${mode}] [data-act=${action}]`).click();};
 const results=[];
 for(const mode of ['panels','hybrid','walk']){
  await command('scenario','ready');await command('variant',mode);
  // Failure changes no resources, even before a prerequisite.
  await pick(mode,'table');const before=await capture();await page.locator(`[data-mode=${mode}] [data-act=serve]`).focus();await page.keyboard.press("Enter");const failed=await capture();assert.equal(failed.money,before.money);assert.equal(failed.minutes,before.minutes);assert(!failed.served);
  await act(mode,'desk','read');await act(mode,'purse','collect');
  // A render-only layout change retains exact domain state.
  const selected=await capture();await command('variant',mode==='panels'?'hybrid':'panels');assert.deepEqual(await capture(),selected);await command('variant',mode);
  await act(mode,'door','travel');await act(mode,'bakery','buy');await act(mode,'home','travel');await act(mode,'table','serve');
  const final=await capture();assert.equal(final.money,8);assert.equal(final.bread,0);assert.equal(final.minutes,14);assert.equal(final.served,true);assert.equal(final.stock,2);results.push({money:final.money,bread:final.bread,minutes:final.minutes,served:final.served,stock:final.stock});
  checks.push(`${mode}: complete errand, failure with no payment, identical state on view switch`);
  await command('scenario','ready');await command('variant',mode);await pick(mode,'desk');
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'evidence',`${mode}-1920.png`)});
  for(const [width,height]of [[1920,1080],[1800,1040],[1536,864],[1024,900]])for(const size of [14,21]){
   await page.setViewportSize({width,height});await command('text',size);
   const g=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,v:innerWidth,font:getComputedStyle(document.getElementById('lotm-study')).fontSize}));
   assert(g.w<=width,`${mode} horizontal overflow ${width}/${size}: ${g.w}`);assert.equal(parseFloat(g.font),size);
   checks.push({mode,width,height,size,scrollHeight:g.h});
  }
  await page.setViewportSize({width:1920,height:1080});await command('text',14);
  for(const scenario of ['short','closed']){
   await command('scenario',scenario);await act(mode,'purse','collect');await act(mode,'door','travel');await pick(mode,'bakery');const b=await capture();await page.locator(`[data-mode=${mode}] [data-act=buy]`).focus();await page.keyboard.press("Enter");const a=await capture();assert.equal(a.money,b.money);assert.equal(a.minutes,b.minutes);assert.equal(a.stock,b.stock);checks.push(`${mode}: ${scenario} refuses without charging`);
  }
 }
 assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);
 await command('scenario','ready');await command('variant','walk');
 await page.locator('[data-mode=walk] [data-move="1,0"]').focus();const a=await capture();await page.keyboard.press('ArrowRight');const b=await capture();assert.equal(b.positions.home[0],a.positions.home[0]+1);assert.equal(b.minutes,a.minutes);
 await pick('walk','desk');await page.keyboard.press('e');assert.equal((await capture()).selected,'desk');await page.keyboard.press('Escape');assert.equal((await capture()).selected,null);checks.push('walk: keyboard move/E/Esc, no movement time charge');
 // Workbench itself and simultaneous mirrored fixture protocol.
 await page.goto(new URL('?study=lotm-scene',base).href);await page.locator('#variant').selectOption('hybrid');await page.locator('iframe').contentFrame().locator('[data-mode=hybrid]').waitFor({state:'visible'});
 await page.locator('iframe').contentFrame().locator('[data-mode=hybrid] [data-subject=desk]').click();await page.locator('iframe').contentFrame().locator('[data-mode=hybrid] [data-act=read]').click();
 await page.locator('#compare').check();await page.waitForFunction(()=>document.querySelectorAll('iframe').length===3);
 for(const iframe of await page.locator('iframe').all())await iframe.contentFrame().locator('[data-mode]:not([hidden]) .task-title').filter({hasText:'Collect the household purse.'}).first().waitFor();
 checks.push('shared workbench: study loads and three mirrored variants preserve learned request');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(__dirname,'evidence','checks.json'),JSON.stringify({checks,errors,outcome:results[0],review:'agent-verified sketch; not native gameplay, not human-reviewed'},null,2));
 console.log(`Passed ${checks.length} checks; all three outcomes identical; zero page errors.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
