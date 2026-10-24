// P1 harness: static server on port 0 serving the worktree root, fresh headless context, ?test_hooks=1.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../../../../..');
const {launchChrome}=require(path.join(root,'scripts/ui_helpers.cjs'));
const out=path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
async function run(name,fn,{width=1920,height=1080}={}){
 const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u==='/'?'index.html':u);
  if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const browser=await launchChrome(),errors=[],log=[];let page;
 try{
  const context=await browser.newContext({viewport:{width,height}});
  await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  page=await context.newPage();page.setDefaultTimeout(15000);
  page.on('response',r=>{if(r.status()===404)log.push('404 '+r.url());});page.on('pageerror',e=>errors.push('pageerror: '+(e.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  const url=`http://127.0.0.1:${port}/?test_hooks=1`;
  const shot=async n=>{const p=path.join(out,`${name}-${n}.png`);await page.screenshot({path:p});log.push('shot '+p);};
  const say=(...a)=>{log.push(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));};
  await fn({page,context,url,port,shot,say,out,browser});
  console.log(JSON.stringify({name,port,viewport:`${width}x${height}`,errors,log},null,1));if(errors.length)process.exitCode=1;
 }catch(e){try{await page.screenshot({path:path.join(out,name+'-FAIL.png')});}catch{}console.log(JSON.stringify({name,port,errors,log},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close().catch(()=>{});server.close();}
}
// Real pointer click at the element bounding-box centre; records elementFromPoint hit.
async function realClick(page,locator,say,label){
 await locator.scrollIntoViewIfNeeded();const b=await locator.boundingBox();if(!b)throw new Error('no box '+label);
 const x=b.x+b.width/2,y=b.y+b.height/2;
 const hit=await page.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?{tag:e.tagName,id:e.id,cls:String(e.className).slice(0,80),text:(e.textContent||'').trim().slice(0,40),resize:!!e.closest('[data-shell-resize]')}:null;},[x,y]);
 say('click',label,{x:Math.round(x),y:Math.round(y)},'hit',hit);
 await page.mouse.click(x,y);return hit;
}
module.exports={run,out,realClick,root};
