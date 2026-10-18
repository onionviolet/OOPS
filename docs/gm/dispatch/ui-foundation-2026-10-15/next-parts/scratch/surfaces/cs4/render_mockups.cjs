// Render static files only. Never load the game, game libraries, storage or saves.
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const {pathToFileURL} = require('url');
const dir = __dirname;
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 const spec=JSON.parse(fs.readFileSync(path.join(dir,'scenes.json'),'utf8'));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const results=[];
 try {
  for(const scene of spec.scenes){
   const context=await browser.newContext({viewport:{width:1366,height:768},deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route(/^https?:/,route=>route.abort());
   await page.goto(pathToFileURL(path.join(dir,scene.html)).href);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
   const observed=await page.evaluate(()=>{
    const bounds=n=>{const b=n.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};
    const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
    const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
    const foreign=[...document.querySelectorAll('.foreign')].map(n=>{
     const css=getComputedStyle(n),bg=css.backgroundColor;
     const text=[...n.querySelectorAll('header,p,.fact span,.foreign-control,.view-nav span,.view-nav b,h3')].filter(e=>e.textContent.trim()).map(e=>({text:e.textContent.trim(),ratio:ratio(getComputedStyle(e).color,bg)}));
     return {bounds:bounds(n),font:css.fontSize,fontFamily:css.fontFamily,text,edgeRatio:ratio(css.borderTopColor,bg),focusRatio:ratio(css.getPropertyValue('--cs4-ff-focus').trim()==='#ffe498'?'rgb(255,228,152)':css.borderTopColor,bg),animations:n.getAnimations({subtree:true}).length,scrollWidth:n.scrollWidth,clientWidth:n.clientWidth};
    });
    return {page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],foreign,
     task:bounds(document.querySelector('.task-home')),focus:bounds(document.querySelector('.focus-home')),
     foreignClearOfReports:foreign.every(f=>f.bounds.right<=951),
     mirror:{text:document.querySelector('.log-mirror').textContent,bounds:bounds(document.querySelector('.log-mirror'))},
     taskClipped:document.querySelector('.task-content').scrollHeight>document.querySelector('.task-content').clientHeight+1,
     reading:document.querySelector('.reading')?{client:document.querySelector('.reading').clientHeight,scroll:document.querySelector('.reading').scrollHeight,overflow:getComputedStyle(document.querySelector('.reading')).overflowY}:null,
     scripts:document.scripts.length};
   });
   await page.screenshot({path:path.join(dir,scene.png),fullPage:false});
   results.push({...scene,observed,errors,pngSha256:sha(path.join(dir,scene.png)),htmlSha256:sha(path.join(dir,scene.html))});
   await context.close();
  }
 } finally {await browser.close();}
 const summary={scope:'Static HTML render inspection only; no CS2 game behavior tested',count:results.length,
  frame:spec.frame,frameSha256:spec.frameSha256,
  all1366x768:results.every(r=>r.observed.page[0]===1366&&r.observed.page[1]===768),
  allForeignClearOfReports:results.every(r=>r.observed.foreignClearOfReports),
  minimumTextContrast:Math.min(...results.flatMap(r=>r.observed.foreign.flatMap(f=>f.text.map(t=>t.ratio)))),
  minimumEdgeContrast:Math.min(...results.flatMap(r=>r.observed.foreign.map(f=>f.edgeRatio))),
  allNoScripts:results.every(r=>r.observed.scripts===0),errors:results.flatMap(r=>r.errors),
  clipping:results.filter(r=>r.observed.taskClipped).map(r=>r.id),results};
 fs.writeFileSync(path.join(dir,'render-receipt.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify(Object.fromEntries(Object.entries(summary).filter(([k])=>k!=='results')),null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
