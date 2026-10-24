// Shared headless harness for proof A: static server on port 0, fresh context, 1920x1080, generated state only.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {launchChrome}=require('../../../../../../scripts/ui_helpers.cjs');
const root=path.resolve(__dirname,'../../../../../..'),out=path.join(__dirname,'evidence');fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json'};
async function run(name,query,fn){
 const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u==='/'?'index.html':u);
  if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 let pg0;const browser=await launchChrome(),errors=[],log=[];
 try{
  const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();pg0=page;page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.stack||String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  const url=`http://127.0.0.1:${port}/?test_hooks=1${query?'&'+query:''}`;
  const shot=async n=>{const p=path.join(out,`${name}-${n}.png`);await page.screenshot({path:p});log.push('shot '+p);};
  const say=(...a)=>{log.push(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));};
  await fn({page,context,url,port,shot,say,out,browser});
  console.log(JSON.stringify({name,port,viewport:'1920x1080',errors,log},null,1));if(errors.length)process.exitCode=1;
 }catch(e){try{await pg0.screenshot({path:path.join(out,name+'-FAIL.png')});}catch{}console.log(JSON.stringify({name,port,errors,log},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close().catch(()=>{});server.close();}
}
module.exports={run,out};
