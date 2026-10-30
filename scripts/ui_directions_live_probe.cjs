// Structural probe of a fresh Village and a fresh Tingen life at 1920x1080 for the UI directions round.
// Usage: YAIRPG_PROOF_URL=http://127.0.0.1:PORT/ node scripts/ui_directions_live_probe.cjs
const fs=require('node:fs'), path=require('node:path');
const {launchChrome}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18731/';
const out=process.env.YAIRPG_PROOF_DIR||'docs/audits/evidence/ui-directions-2026-10-30'; fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await launchChrome();try{
  const context=await browser.newContext({viewport:{width:1920,height:1080}});
  const page=await context.newPage(),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();await page.waitForTimeout(1500);
  const measure=()=>page.evaluate(()=>{
    const mods=[...document.querySelectorAll('section.workspace-module')];
    const vis=mods.filter(m=>{const r=m.getBoundingClientRect();return r.width>40&&r.height>20&&getComputedStyle(m).visibility!=='hidden'});
    const clickable=[...document.querySelectorAll('button,select,summary,[data-native-choice],a')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0});
    const nav=[...document.querySelectorAll('nav button, [data-workspace-route]')].map(b=>b.textContent.trim()).filter(Boolean);
    const sel=[...document.querySelectorAll('select')].map(s=>s.options.length);
    return {modulesMounted:mods.length,modulesVisible:vis.length,visibleTitles:vis.map(m=>(m.querySelector('strong')||m).textContent.trim().slice(0,28)),
      rects:vis.map(m=>{const r=m.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}),
      clickableVisible:clickable.length,domNodes:document.getElementsByTagName('*').length,selectSizes:sel.slice(0,6),
      nextStep:document.getElementById('next_step')?.hidden===false?document.getElementById('next_step').textContent.replace(/\s+/g,' ').trim():null,
      fontPx:getComputedStyle(document.body).fontSize};});
  const res={};
  res.village_t0=await measure();await page.screenshot({path:path.join(out,'current-village-t0.png')});
  await page.locator('[data-native-choice="location"]',{hasText:'Talk to someone'}).first().click();await page.locator('[data-dialogue="villageElder"]').click();
  await page.locator('[data-textline="hello"]').click();await page.waitForTimeout(300);
  await page.locator('[data-textline="what happened"]').click();await page.waitForTimeout(1300);
  res.village_dialogue=await measure();await page.screenshot({path:path.join(out,'current-village-dialogue.png')});
  const w=await page.locator('.end_dialogue_button').count();if(w)await page.locator('.end_dialogue_button').first().click();
  await page.waitForTimeout(400);
  const cross=page.locator('button.location_choice_dropdown',{hasText:'Tingen'}).first();
  if(await cross.count()){await cross.click();await page.waitForTimeout(1500);
    res.tingen_after_cross_click=await measure();await page.screenshot({path:path.join(out,'current-tingen-cross.png')});
    res.tingen_buttons=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetWidth>0).map(b=>b.textContent.trim().slice(0,40)).filter(Boolean).slice(0,40));}
  res.errors=errors;
  fs.writeFileSync(path.join(out,'live-probe.json'),JSON.stringify(res,null,1));
  console.log(JSON.stringify(Object.fromEntries(Object.entries(res).filter(([k])=>k!=='errors'&&k!=='tingen_buttons').map(([k,v])=>[k,{mounted:v.modulesMounted,visible:v.modulesVisible,clickable:v.clickableVisible,dom:v.domNodes,next:v.nextStep}])),null,1),errors.length,res.tingen_buttons);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
