// Disposable fresh Village service / crafting route, on an isolated rebuilt snapshot.
const fs=require('node:fs'),path=require('node:path'),net=require('node:net'),{spawn}=require('node:child_process'),assert=require('node:assert/strict');
const [snapshot,out]=process.argv.slice(2);const {launchChrome}=require(path.join(snapshot,'scripts/ui_helpers.cjs'));
const portOf=()=>new Promise((r,j)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{let p=s.address().port;s.close(()=>r(p));});s.on('error',j);});
(async()=>{const port=await portOf(),srv=spawn('python3',['-u','-m','http.server',String(port),'--bind','127.0.0.1','--directory',path.join(snapshot,'out')],{stdio:'ignore'});let browser;
 const result={route:'fresh native Village; inspect service; open herb verge from Around you; gather and try one batch',viewport:'1920x1080',cases:[],errors:[]};
 try{browser=await launchChrome();for(const size of [14,21]){
 const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage(),c={size};result.cases.push(c);page.setDefaultTimeout(12000);page.on('pageerror',e=>result.errors.push({size,message:e.message}));
 await page.goto(`http://127.0.0.1:${port}/`);await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await page.locator('#loading_screen_play_button').click();
 if(await page.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await page.getByText('Confirm',{exact:true}).click();
 if(size===21){await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill('21');await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await page.locator('#workspace_navigation select').first().selectOption('local-actions');}
 await page.locator('[data-inspect-nearby="waypost-clerk"]').click();
 c.clerkDetail=(await page.locator('.nearby-context-detail').innerText()).trim();c.clerkActionCount=await page.locator('.nearby-context-detail [data-focus-action]').count();
 await page.screenshot({path:path.join(out,`native-clerk-${size}.png`)});
 await page.locator('[data-inspect-nearby="herbal-experiments"]').click();c.herbDetail=(await page.locator('.nearby-context-detail').innerText()).trim();
 await page.locator('[data-focus-action="herbal-experiments"]').click();await page.locator('#crafting_engine_home').waitFor({state:'visible'});
 c.craftFont=await page.locator('#crafting_engine_home').evaluate(n=>parseFloat(getComputedStyle(n).fontSize));assert.equal(c.craftFont,size);
 c.gatherEnabled=await page.locator('#crafting_gather').isEnabled();assert.equal(c.gatherEnabled,true);await page.locator('#crafting_gather').click();
 await page.locator('#crafting_engine_home [data-craft-material]').first().check();
 c.glance=await page.locator('#crafting_engine_home [data-craft-glance]').innerText();c.commitEnabled=await page.locator('#crafting_engine_home [data-craft-commit]').isEnabled();
 await page.locator('#crafting_engine_home [data-craft-glance]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`native-craft-quote-${size}.png`)});
 if(c.commitEnabled){await page.locator('#crafting_engine_home [data-craft-commit]').click();c.afterText=(await page.locator('#crafting_engine_home').innerText()).slice(-700);}
 c.pageGeometry=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth}));
 await page.keyboard.press('Escape');c.visibleAfterEscape=await page.locator('#crafting_engine_home').isVisible();c.focusAfterEscape=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id||null}));
 await context.close();}
 assert.deepEqual(result.errors,[]);
 }catch(e){result.failure={message:e.message,stack:e.stack};process.exitCode=1;}
 finally{if(browser)await browser.close().catch(()=>{});srv.kill();fs.writeFileSync(path.join(out,'native-service-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
})();
