const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),http=require('http');
const R=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root=process.cwd(),out=__dirname,url='http://127.0.0.1:18828/';
const get=u=>new Promise((resolve,reject)=>{http.get(u,{agent:false},r=>{let data=[];r.on('data',x=>data.push(x));r.on('end',()=>resolve(Buffer.concat(data)));}).on('error',reject);});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});let result={viewport:{width:1366,height:768},changedNativeLoop:'OPEN: P00 registration, native quote/save and life-loops receipt binding absent'};
 try{
  const ctx=await browser.newContext({viewport:result.viewport,acceptDownloads:true});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
  await p.goto(url,{waitUntil:'domcontentloaded'});await R.startFresh(p);
  result.servedBundleSha256=crypto.createHash('sha256').update(await get(url+'dist/bundle.js')).digest('hex');
  result.localBundleSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist/bundle.js'))).digest('hex');
  if(result.servedBundleSha256!==result.localBundleSha256)throw Error('served bundle mismatch');
  await p.screenshot({path:path.join(out,'desktop-opening.png')});
  const saved=await R.saveText(p);const parsed=JSON.parse(saved);
  result.nativeSaveHasMarketLife=Object.prototype.hasOwnProperty.call(parsed,'p23_market_life');
  await p.reload({waitUntil:'domcontentloaded'});await R.startFresh(p);
  result.nativeReload=await p.locator('#location_name_span').innerText();
  const downloadPromise=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const download=await downloadPromise;
  const file=path.join(out,'baseline-native-export.txt');await download.saveAs(file);
  const exportedNative=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
  const importContext=await browser.newContext({viewport:result.viewport});const q=await importContext.newPage();q.on('dialog',d=>d.accept());q.on('pageerror',e=>errors.push(e.message));
  await q.goto(url,{waitUntil:'domcontentloaded'});await R.startFresh(q);
  await Promise.all([q.waitForNavigation({waitUntil:'domcontentloaded'}),q.locator('#saved_file_input').setInputFiles(file)]);
  await R.startFresh(q);
  await q.waitForFunction(expected=>JSON.stringify(JSON.parse(localStorage.getItem('save data')))===expected,JSON.stringify(exportedNative));
  const importedNative=await q.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
  result.nativeImportExactStoredEnvelope=JSON.stringify(exportedNative)===JSON.stringify(importedNative);
  if(!result.nativeImportExactStoredEnvelope)throw Error('literal import did not retain exact exported native envelope');
  await q.waitForTimeout(1500);
  result.nativeLiteralFileImport=await q.locator('#location_name_span').innerText();
  result.moduleProbe=await p.evaluate(async()=>{
   const m=await import('/src/absorb_p23/market_life/market_life.js');
   const c={worldId:'base.frontier',location:'Village',traderId:'village trader',alive:true,clock:100,calendarMinute:100,marketKnown:true,effectsEnabled:false};
   const b={index:1,buyUnits:5,buySubtotal:100,breadSubtotal:100,useCoupon:false};
   let s=m.planMarketTrade(undefined,c,b).state;s=m.planMarketTrade(s,c,{...b,index:2,useCoupon:true}).state;
   s=m.planMarketDelivery(s,c,{index:1,kind:'parcel_delivery',completed:true,clock:100}).state;
   const restored=m.normalizeMarketLife(JSON.parse(JSON.stringify(s)));
   return {evidenceLayer:'uncoupled source-module browser probe, not native gameplay',stateExact:JSON.stringify(s)===JSON.stringify(restored),
    view:m.marketLifeView(restored,c),quote:m.quoteMarketPurchase(restored,c,{...b,useCoupon:true}),duplicate:m.planMarketTrade(restored,c,{...b,index:2}).ok};
  });
  if(!result.moduleProbe.stateExact || result.moduleProbe.duplicate!==false || result.moduleProbe.quote.total!==90)throw Error('module browser probe mismatch');
  result.pageErrors=errors;if(errors.length)throw Error(errors.join(';'));
  result.baselineCompatibility='native opening/Save/reload/Export/literal file Import exercised; market-life state not registered';
  fs.unlinkSync(file);await importContext.close();await ctx.close();
 }catch(e){result.error=e.stack;process.exitCode=1;}finally{fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));await browser.close();}
})();
