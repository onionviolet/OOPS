// Adapted from surfaces/cs4/render_mockups.cjs. Static files only; no game libraries/storage.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{pathToFileURL}=require('url');
const dir=__dirname, sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const spec=JSON.parse(fs.readFileSync(path.join(dir,'scenes.json'))), filters=process.argv.slice(2);
 const selected=spec.scenes.filter(s=>!filters.length||filters.some(f=>s.id.includes(f)));
 const old=filters.length?JSON.parse(fs.readFileSync(path.join(dir,'render-receipt.json'))).results:[];
 const results=old.filter(r=>!selected.some(s=>s.id===r.id));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{for(const scene of selected){
  const context=await browser.newContext({viewport:{width:scene.viewport[0],height:scene.viewport[1]},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https?:/,r=>r.abort());await page.goto(pathToFileURL(path.join(dir,scene.html)).href);
  await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
  const observed=await page.evaluate(()=>{
   const bounds=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   const foreign=document.querySelector('.foreign'),css=getComputedStyle(foreign),f=bounds(foreign);
   const reading=foreign.querySelector('.reading'),rr=reading?bounds(reading):f;
   const rects=[],walker=document.createTreeWalker(foreign,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden=true]'))continue;
    const range=document.createRange();range.selectNodeContents(n);
    for(const r of range.getClientRects()){
     const clip={x:Math.max(r.x,rr.x),y:Math.max(r.y,rr.y),right:Math.min(r.right,rr.right),bottom:Math.min(r.bottom,rr.bottom)};
     if(clip.right>clip.x&&clip.bottom>clip.y)rects.push({...clip,text:n.textContent.trim(),color:getComputedStyle(n.parentElement).color,font:getComputedStyle(n.parentElement).fontSize});
    }
   }
   const lh=parseFloat(document.body.style.getPropertyValue('--lx'))-12;
   const overflowing=[...foreign.querySelectorAll('*')].filter(n=>n.clientWidth>0&&n.scrollWidth>n.clientWidth+2&&getComputedStyle(n).overflowX!=='auto'&&!n.closest('svg')&&!n.classList.contains('ornament')).map(n=>n.className);
   return {page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],foreign:f,font:css.fontSize,fontFamily:css.fontFamily,
    foreignClearOfReports:f.right<=lh,reportLeft:lh,animations:foreign.getAnimations({subtree:true}).length,
    reading:reading?{client:reading.clientHeight,scroll:reading.scrollHeight,overflow:getComputedStyle(reading).overflowY}:null,
    horizontalOverflow:overflowing,foreignOverflowX:foreign.scrollWidth>foreign.clientWidth+2,
    noticeClipped:!!foreign.closest('.notice-host')&&(foreign.scrollHeight>foreign.clientHeight+2||f.bottom>bounds(foreign.closest('.notice-host')).bottom),
    awakeningActionsVisible:[...document.querySelectorAll('.awakening-dismiss .foreign-control')].every(n=>{const b=bounds(n);return b.y>=f.y&&b.bottom<=f.bottom&&b.bottom<=innerHeight}),rects,scripts:document.scripts.length,frameLoaded:document.querySelector('.frame').naturalWidth,logMirror:document.querySelector('.log-mirror').textContent};
  });
  await page.screenshot({path:path.join(dir,scene.png)});
  // Preserve every background/ornament; only make text glyph fills transparent for pixel contrast sampling.
  await page.addStyleTag({content:'.foreign,.foreign *{-webkit-text-fill-color:transparent!important}'});
  await page.screenshot({path:path.join(dir,scene.id+'-background.png')});
  results.push({...scene,observed,errors,pngSha256:sha(path.join(dir,scene.png)),htmlSha256:sha(path.join(dir,scene.html))});await context.close();
 }}finally{await browser.close()}
 results.sort((a,b)=>spec.scenes.findIndex(s=>s.id===a.id)-spec.scenes.findIndex(s=>s.id===b.id));
 const summary={scope:'Static layout and screenshot evidence only. CS2 behavior remains unimplemented.',count:results.length,
  allTargetSize:results.every(r=>r.observed.page.join()===r.viewport.join()),allForeignClearOfReports:results.every(r=>r.observed.foreignClearOfReports),
  allAwakeningActionsVisible:results.every(r=>r.observed.awakeningActionsVisible!==false),allNoScripts:results.every(r=>r.observed.scripts===0),allMotionless:results.every(r=>r.observed.animations===0),
  errors:results.flatMap(r=>r.errors),clipping:results.filter(r=>r.observed.awakeningActionsVisible===false||r.observed.noticeClipped||r.observed.foreignOverflowX||r.observed.horizontalOverflow.length).map(r=>({id:r.id,notice:r.observed.noticeClipped,x:r.observed.horizontalOverflow})),results};
 fs.writeFileSync(path.join(dir,'render-receipt.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify(Object.fromEntries(Object.entries(summary).filter(([k])=>k!=='results')),null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
