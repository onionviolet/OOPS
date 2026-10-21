import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();const result={errors:[],sizes:[]};page.on('pageerror',e=>result.errors.push(e.message));
try {
 await page.goto('http://127.0.0.1:19234/credits/');await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();await page.waitForTimeout(1100);
 const image=await page.locator('.loading_signature_pet').evaluate(n=>({loaded:n.complete,w:n.naturalWidth,h:n.naturalHeight,src:n.getAttribute('src')}));assert(image.loaded&&image.w>0&&image.src.endsWith('guinea-pig-transparent.png'));result.image=image;
 assert.equal(await page.locator('#loading_screen_author').evaluate(n=>getComputedStyle(n).rotate),'0deg');
 for(const credit of await page.locator('.loading_reference_credit').all())assert.equal(await credit.evaluate(n=>getComputedStyle(n).rotate),'-10deg');
 for(const [name,href] of [['Miktaew on Ko-fi','https://ko-fi.com/miktaew'],['Play Proto23 · by 23html','https://23html.github.io/']])assert.equal(await page.getByRole('link',{name,exact:true}).getAttribute('href'),href);
 const sources=await page.locator('.loading_support .loading_source_link').evaluateAll(ns=>ns.map(n=>n.href).sort());assert.deepEqual(sources,['https://github.com/23html/23html.github.io','https://github.com/miktaew/yet-another-idle-rpg'].sort());
 for(const link of await page.locator('.loading_support a').all()){assert.equal(await link.getAttribute('target'),'_blank');assert((await link.getAttribute('rel')).includes('noopener'));await link.focus();assert(await link.evaluate(n=>n===document.activeElement));}
 for(const [width,height] of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){
  await page.setViewportSize({width,height});await page.evaluate(size=>document.documentElement.style.setProperty('--ui-type-body',`${size}px`),size);
  const g=await page.evaluate(()=>{const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};return {signature:box('#loading_screen_author'),left:box('.loading_support_left'),right:box('.loading_support_right'),play:box('#loading_screen_play_button')};});
  for(const item of Object.values(g))assert(item.left>=0&&item.right<=width&&item.top>=0&&item.bottom<=height,'credit/action contained');
  assert(g.left.right<g.right.left,'corner links do not overlap');assert(g.left.top>g.play.bottom&&g.right.top>g.play.bottom,'support links stay below PLAY');result.sizes.push({width,height,size,...g});
  if(width===1920&&size===14)await page.screenshot({path:'docs/reviews/launch_menu_2026-10-21/final-credits.png'});
 }
 assert.equal(await page.locator('#hits_counter').count(),0);assert.equal(await page.locator('#new_game_beginning').isVisible(),false);
 await page.locator('#loading_screen_play_button').press('Enter');await page.waitForFunction(()=>getComputedStyle(document.getElementById('loading_screen')).visibility==='hidden');assert.equal(await page.locator('.loading_support_right').isVisible(),false);assert.deepEqual(result.errors,[]);result.status='PASS';
}catch(e){result.status='FAIL';result.error=e.stack;process.exitCode=1;}finally{await browser.close();await writeFile('docs/reviews/launch_menu_2026-10-21/final-credits-receipt.json',JSON.stringify(result,null,2)+'\n');console.log(result);}
