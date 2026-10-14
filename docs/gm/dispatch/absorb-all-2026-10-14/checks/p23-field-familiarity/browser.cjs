const { chromium } = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const crypto=require('node:crypto');
(async()=>{
 const out=__dirname;const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const response=await page.goto('http://127.0.0.1:18826/',{waitUntil:'networkidle'});
 const bundle=await page.evaluate(async()=>{
  const script=[...document.querySelectorAll('script[src]')].find(s=>s.src.includes('dist/bundle.js'));
  const r=await fetch(script.src);return {url:script.src,text:await r.text(),status:r.status};
 });
 await page.screenshot({path:out+'/desktop-baseline.png'});
 const result={scope:'baseline native build smoke only; P07 unregistered and native acceptance OPEN',
  origin:'http://127.0.0.1:18826',freshContext:true,viewport:{width:1366,height:768},httpStatus:response.status(),
  servedBundleSha256:crypto.createHash('sha256').update(bundle.text).digest('hex'),bundleUrl:bundle.url,
  bundleStatus:bundle.status,errors,bodyExcerpt:(await page.locator('body').innerText()).slice(0,500),
  changedLoop:'NOT RUN: P00 registrations, clock callbacks and save joins absent',
  persistence:'NOT RUN: no native P07 save/reload/export/literal-file import integration'};
 fs.writeFileSync(out+'/browser-baseline.json',JSON.stringify(result,null,2)+'\n');
 await browser.close();if(errors.length||response.status()!==200||bundle.status!==200)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
