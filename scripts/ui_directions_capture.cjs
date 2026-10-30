// Captures each UI direction from ui-directions.html at 1920x1080 (14 px and 21 px, effects full and off) into the evidence folder.
// Usage: YAIRPG_PROOF_URL=http://127.0.0.1:PORT/ node scripts/ui_directions_capture.cjs
const fs=require('node:fs'), path=require('node:path');
const {launchChrome}=require('./ui_helpers.cjs');
const base=(process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18731/')+'ui-directions.html';
const out=process.env.YAIRPG_PROOF_DIR||'docs/audits/evidence/ui-directions-2026-10-30'; fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await launchChrome();try{
  const page=await (await browser.newContext({viewport:{width:1920,height:1080}})).newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const report=[];
  for(const dir of ['a','b','c','d'])for(const fixture of ['village','tingen'])for(const [size,effects] of [[14,'full'],[21,'full'],[14,'off']]){
    if(fixture==='tingen'&&(size===21||effects==='off')&&dir!=='d'&&dir!=='a')continue;
    await page.goto(`${base}?dir=${dir}&fixture=${fixture}&size=${size}&effects=${effects}`);await page.waitForSelector('.ud-screen');await page.waitForTimeout(250);
    const m=await page.evaluate(()=>{const s=document.querySelector('.ud-screen');const over=[...s.querySelectorAll('*')].filter(n=>n.scrollWidth>n.clientWidth+2&&getComputedStyle(n).overflow==='visible'&&n.children.length===0).length;
      return {fontPx:getComputedStyle(s.querySelector('.ud-root')).fontSize,scrollH:s.scrollHeight,clientH:s.clientHeight,leafOverflow:over,facts:['next-step','return-note'].map(k=>!!s.querySelector(`[data-${k}]`)),clickable:s.querySelectorAll('button').length,nodes:s.getElementsByTagName('*').length,chars:s.innerText.length};});
    const file=`${dir}-${fixture}-${size}px-fx-${effects}.png`;
    await page.locator('.ud-screen').screenshot({path:path.join(out,file)});report.push({file,...m});}
  fs.writeFileSync(path.join(out,'capture-report.json'),JSON.stringify({errors,report},null,1));
  console.log(JSON.stringify({errors,count:report.length,sample:report.slice(0,4)}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
