// SI adaptation of CY's isolated renderer. File URLs only; no game modules or saves.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{pathToFileURL}=require('url');
const dir=__dirname,sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const spec=JSON.parse(fs.readFileSync(path.join(dir,'scenes.json'))),filters=process.argv.slice(2);
 const selected=spec.scenes.filter(s=>!filters.length||filters.some(f=>s.id.includes(f)));
 const results=filters.length?JSON.parse(fs.readFileSync(path.join(dir,'render-receipt.json'))).results.filter(r=>!selected.some(s=>s.id===r.id)):[];
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{for(const scene of selected){
  const context=await browser.newContext({viewport:{width:scene.viewport[0],height:scene.viewport[1]},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https?:/,r=>r.abort());await page.goto(pathToFileURL(path.join(dir,scene.html)).href);
  await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
  const observed=await page.evaluate(()=>{
   const bounds=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   const foreign=document.querySelector('.foreign'),f=bounds(foreign),host=bounds(document.querySelector('.si-host'));
   const reading=document.querySelector('.si-body'),rr=bounds(reading),rects=[],walker=document.createTreeWalker(foreign,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
    const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden=true]'))continue;
    const range=document.createRange();range.selectNodeContents(n);
    const clip=n.parentElement.closest('.si-body')?rr:f;
    for(const r of range.getClientRects()){
     const clipped={x:Math.max(r.x,clip.x),y:Math.max(r.y,clip.y),right:Math.min(r.right,clip.right),bottom:Math.min(r.bottom,clip.bottom)};
     if(clipped.right>clipped.x&&clipped.bottom>clipped.y)rects.push({...clipped,text:n.textContent.trim(),color:getComputedStyle(n.parentElement).color,font:getComputedStyle(n.parentElement).fontSize});
    }
   }
   const reportsLeft=parseFloat(document.body.style.getPropertyValue('--lx'));
   const overflowing=[...foreign.querySelectorAll('*')].filter(n=>n.clientWidth>0&&n.scrollWidth>n.clientWidth+2&&!n.closest('svg')&&getComputedStyle(n).overflowX!=='auto').map(n=>n.className);
   return {page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],foreign:f,host,font:getComputedStyle(foreign).fontSize,
    foreignClearOfReports:host.right<reportsLeft,reading:{client:reading.clientHeight,scroll:reading.scrollHeight,overflow:getComputedStyle(reading).overflowY},
    actionsVisible:[...document.querySelectorAll('.si-actions .foreign-control,.si-back')].every(n=>{const r=bounds(n);return r.y>=host.y&&r.bottom<=host.bottom&&r.right<=host.right&&r.bottom<=innerHeight-42}),
    horizontalOverflow:overflowing,rects,scripts:document.scripts.length,animations:foreign.getAnimations({subtree:true}).length,
    frameLoaded:document.querySelector('.frame').naturalWidth,reportNote:document.querySelector('.si-report-note')?.textContent||null};
  });
  await page.screenshot({path:path.join(dir,scene.png)});
  await page.addStyleTag({content:'.foreign,.foreign *{-webkit-text-fill-color:transparent!important}'});
  await page.screenshot({path:path.join(dir,scene.id+'-background.png')});
  // Geometry check for every scrollable body at its end; not interaction proof.
  const scrollEnd=await page.evaluate(()=>{const n=document.querySelector('.si-body');n.scrollTop=n.scrollHeight;const end=n.lastElementChild.getBoundingClientRect(),r=n.getBoundingClientRect();return{reached:Math.abs(n.scrollHeight-n.clientHeight-n.scrollTop)<2,lastParagraphBottom:end.bottom,viewportBottom:r.bottom}});
  results.push({...scene,observed,scrollEnd,errors,pngSha256:sha(path.join(dir,scene.png)),htmlSha256:sha(path.join(dir,scene.html))});await context.close();
 }}finally{await browser.close()}
 results.sort((a,b)=>spec.scenes.findIndex(s=>s.id===a.id)-spec.scenes.findIndex(s=>s.id===b.id));
 const summary={scope:'Static geometry only; no input, simulation, save or human acceptance proof',count:results.length,
  allTargetSize:results.every(r=>r.observed.page.join()===r.viewport.join()),allForeignClearOfReports:results.every(r=>r.observed.foreignClearOfReports),
  allActionsVisible:results.every(r=>r.observed.actionsVisible),allScrollEndsReachable:results.every(r=>r.scrollEnd.reached),allNoScripts:results.every(r=>r.observed.scripts===0),allMotionless:results.every(r=>r.observed.animations===0),
  clipping:results.filter(r=>!r.observed.actionsVisible||r.observed.horizontalOverflow.length).map(r=>({id:r.id,x:r.observed.horizontalOverflow,actions:r.observed.actionsVisible})),errors:results.flatMap(r=>r.errors),results};
 fs.writeFileSync(path.join(dir,'render-receipt.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify(Object.fromEntries(Object.entries(summary).filter(([k])=>k!=='results')),null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
