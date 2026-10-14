const fs=require('fs'),path=require('path'),crypto=require('crypto'),http=require('http');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const routes=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root=process.cwd(),out=__dirname,url='http://127.0.0.1:18824/';
const get=u=>new Promise((resolve,reject)=>http.get(u,{agent:false},r=>{let b=[];r.on('data',c=>b.push(c));r.on('end',()=>resolve(Buffer.concat(b)));}).on('error',reject));
(async()=>{
 const b=await chromium.launch({headless:true,channel:'chrome'});
 try {
 const ctx=await b.newContext({viewport:{width:1366,height:768}}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url,{waitUntil:'networkidle'});await routes.startFresh(p);
 const served=await get(url+'dist/bundle.js'),local=fs.readFileSync(path.join(root,'dist/bundle.js'));
 if(!served.equals(local))throw Error('Served bundle differs.');
 const hash=crypto.createHash('sha256').update(served).digest('hex');
 const map=JSON.parse(fs.readFileSync(path.join(root,'dist/bundle.js.map')));
 const linked=map.sources.some(s=>s.includes('absorb_p23/reading/'));
 const body=await p.locator('body').innerText();
 await p.screenshot({path:path.join(out,'desktop-baseline.png')});
 const probe=await p.evaluate(async()=>{
  const m=await import('/src/absorb_p23/reading/runtime.js');
  const c={clock:0,worldId:'base.frontier',nativeBody:true,alive:true,safe:true,available:true,ownedAnthology:true,readProgressPerMinute:1};
  const pending=m.planReadingCommand(undefined,{type:'startRead',draw:9},c).state;
  const restored=JSON.parse(JSON.stringify(pending));m.validateReadingState(restored,0);
  const done=m.observeReadingClock(restored,{...c,clock:restored.current.outcome.duration});
  const reloaded=JSON.parse(JSON.stringify(done.state));m.validateReadingState(reloaded,30);
  return {sourceOnly:true,pendingExact:JSON.stringify(pending)===JSON.stringify(restored),
   completedExact:JSON.stringify(done.state)===JSON.stringify(reloaded),receiptId:reloaded.receipts[0].id,
   replayEffects:m.observeReadingClock(reloaded,{...c,clock:30}).effects.length};
 });
 const evidence={viewport:{width:1366,height:768},url,servedBundleSha256:hash,servedBytes:served.length,
  servedEqualsBuilt:true,pageErrors:errors,baselineVillage:body.includes('Village'),featureLinked:linked,sourceModuleProbe:probe,
  nativeChangedLoop:'OPEN: P00 joins and wave-1 reading/view dependency absent',nativePersistence:'NOT RUN: module JSON roundtrip is not Save/export/literal import'};
 fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify(evidence));
 if(errors.length||linked||!probe.pendingExact||!probe.completedExact||probe.replayEffects)throw Error('Baseline/source smoke failed.');
 await ctx.close();
 } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
