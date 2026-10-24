// Headless fresh-origin LOTM browser run (never a visible window, never a personal save).
//   node docs/gm/dispatch/lotm-lives-regions-2026-10-23/lotm_browser.cjs <scenario> [width height]
// Serves the repo on a never-used port, opens ?lotm_probe=1&test_hooks=1, plays the scenario with real button clicks and
// dev-stepped game time, then saves, reloads and re-imports. Scenarios live in lotm_scenarios.cjs.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {launchChrome}=require('../../../../scripts/ui_helpers.cjs');
const scenarios=require('./lotm_scenarios.cjs');
const root=path.resolve(__dirname,'../../../..'),name=process.argv[2]||'q2',w=+process.argv[3]||1920,h=+process.argv[4]||1080;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u==='/'?'index.html':u);
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port,out=path.join(root,'docs/gm/dispatch/lotm-lives-regions-2026-10-23/evidence');fs.mkdirSync(out,{recursive:true});
 const browser=await launchChrome(),errors=[];
 try{
  const context=await browser.newContext({viewport:{width:w,height:h}}),page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack||String(e)));
  await page.goto(`http://127.0.0.1:${port}/?lotm_probe=1&test_hooks=1`);await page.getByText('PLAY',{exact:true}).click();
  const log=await scenarios[name]({page,port,out,w,h,context,url:`http://127.0.0.1:${port}/?lotm_probe=1&test_hooks=1`});
  console.log(JSON.stringify({scenario:name,viewport:`${w}x${h}`,port,errors,log},null,1));
  if(errors.length)process.exitCode=1;
 }finally{await browser.close().catch(()=>{});server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
