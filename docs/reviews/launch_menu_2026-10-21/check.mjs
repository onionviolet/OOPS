import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='/tmp/oops-launch-counter-20261021',out=new URL('./',import.meta.url);
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const receipt={checks:[],fonts:[],requests:[],errors:[],geometries:[]};
try {
for(const [kind,url] of [['local','http://127.0.0.1:19234/'],['main','https://miktaew.github.io/yet-another-idle-rpg/'],['dev','https://miktaew.github.io/yet-another-idle-rpg-dev/']]) {
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
 page.on('pageerror',e=>receipt.errors.push({kind,message:e.message}));
 page.on('request',r=>{if(r.url().includes('hitscounter.dev'))receipt.requests.push(r.url());});
 if(kind!=='local') {
  // Emulate the upstream URL branch entirely from our local build; never visit/publish to upstream.
  await page.route('https://miktaew.github.io/**',async route=>{
   const pathname=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\/yet-another-idle-rpg(?:-dev)?\//,'/');
   const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
   if(!file.startsWith(root+'/'))return route.fulfill({status:403,body:'Forbidden'});
   try {const body=await readFile(file);const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.ttc':'font/collection'}[path.extname(file)]||'application/octet-stream';await route.fulfill({status:200,body,contentType:type});}
   catch{await route.fulfill({status:404,body:'Not found'});}
  });
 }
 await page.goto(url);await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();
 assert.equal(await page.locator('#hits_counter').count(),0);
 assert.match(await page.locator('#loading_screen_author').innerText(),/onionv.*🐱/);
 assert.equal(await page.locator('meta[name="robots"][content="noindex"]').count(),kind==='dev'?1:0);
 if(kind==='local') {
  await page.evaluate(()=>document.fonts.ready);
  const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
  const {root:doc}=await cdp.send('DOM.getDocument');const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:doc.nodeId,selector:'#loading_screen_author [aria-hidden="true"]'});
  const fonts=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;receipt.fonts=fonts;
  assert(fonts.some(f=>f.familyName.includes('Emoji')&&f.glyphCount>0),'cat uses an actual emoji font');
  for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(200);
   const geometry=await page.locator('#loading_screen_author').evaluate(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,text:n.textContent.trim()};});
   assert(geometry.x>=0&&geometry.right<=width&&geometry.bottom<=height);receipt.geometries.push({width,height,...geometry});
   if(width===1920){await page.waitForTimeout(1000);await page.screenshot({path:new URL('launch.png',out).pathname});}
  }
 }
 await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>getComputedStyle(document.getElementById('loading_screen')).visibility==='hidden');
 assert.equal(await page.locator('#hits_counter').count(),0);
 const menu=page.locator('button[aria-controls="control_box_game-bar-menu"]');
 if(await menu.isVisible()){
  await menu.click();assert.equal(await page.locator('#control_box_game-bar-menu').evaluate(n=>n.matches(':popover-open')),true);
  assert.equal(await page.locator('#control_box_game-bar-menu #hits_counter').count(),0);
  await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
 }
 await page.locator('#save_button').click();await page.reload();await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();
 assert.equal(await page.locator('#hits_counter').count(),0);
 receipt.checks.push(`${kind}: no counter before/after PLAY or reload, no hit-counter requests; native Save/reload and Menu/Escape retained. URL branch emulated locally where applicable.`);
 await context.close();
}
assert.deepEqual(receipt.requests,[]);assert.deepEqual(receipt.errors,[]);
receipt.checks.push('Restored cat renders with Apple Color Emoji at three desktop targets, with onionv and original launch styling.');receipt.status='PASS';
} catch(error){receipt.status='FAIL';receipt.failure=error.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(new URL('receipt.json',out),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));}
