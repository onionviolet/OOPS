// Native baseline smoke ONLY. No injected feature fixture or gameplay claim.
const fs=require('fs'),crypto=require('crypto'),path=require('path');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dir=__dirname, browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
  const context=await browser.newContext({viewport:{width:1366,height:768}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const responsePromise=page.waitForResponse(r=>new URL(r.url()).pathname==='/dist/bundle.js');
  await page.goto('http://127.0.0.1:18829/',{waitUntil:'load'});
  const response=await responsePromise;const served=await response.body();
  const local=fs.readFileSync(path.resolve(dir,'../../../../../../dist/bundle.js'));
  if(!served.equals(local))throw Error('served bundle mismatch');
  const play=page.getByText('PLAY',{exact:true});
  if(await play.count())await play.first().click();
  const confirm=page.locator('#hero_creation_panel_confirmation');
  if(await confirm.isVisible())await confirm.click();
  await page.waitForTimeout(1500);
  await page.screenshot({path:path.join(dir,'native-baseline.png')});
  const featureHookVisible=await page.getByText('Target dice',{exact:true}).count();
  const evidence={url:page.url(),viewport:{width:1366,height:768},servedBundleSha256:crypto.createHash('sha256').update(served).digest('hex'),servedBytes:served.length,errors,featureHookVisible,
   scope:'baseline only; feature not registered; changed native loop and persistence OPEN'};
  fs.writeFileSync(path.join(dir,'browser-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
  if(errors.length||featureHookVisible)throw Error('unexpected baseline state: '+JSON.stringify(evidence));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
