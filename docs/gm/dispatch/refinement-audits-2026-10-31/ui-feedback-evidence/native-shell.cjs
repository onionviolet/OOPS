// Read-only review of a copied, rebuilt native shell. Browser contexts and localStorage are disposable.
// Run: node native-shell.cjs /absolute/snapshot/root /absolute/evidence/output
const fs=require('node:fs'), path=require('node:path'), net=require('node:net'), {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const [snapshot,out]=process.argv.slice(2);
if(!snapshot||!out)throw Error('Pass snapshot root and evidence output');
const {launchChrome}=require(path.join(snapshot,'scripts/ui_helpers.cjs'));
const waitPort=()=>new Promise((resolve,reject)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});s.on('error',reject);});
(async()=>{
 const port=await waitPort(), server=spawn('python3',['-u','-m','http.server',String(port),'--bind','127.0.0.1','--directory',path.join(snapshot,'out')],{stdio:'ignore'});
 const result={route:'fresh native Village, direct nearby elder greeting, Escape; no synthetic save payload',viewport:'1920x1080',bundle:null,cases:[],errors:[]};
 let browser;
 try{
  browser=await launchChrome();
  for(const size of [14,21]){
   const context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage(),observations={size,states:[]};result.cases.push(observations);
   page.setDefaultTimeout(12000);page.on('pageerror',e=>result.errors.push({size,message:e.message}));
   await page.goto(`http://127.0.0.1:${port}/`);await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await page.locator('#loading_screen_play_button').click();
   if(await page.getByText('Confirm',{exact:true}).isVisible().catch(()=>false))await page.getByText('Confirm',{exact:true}).click();
   if(size===21){
    await page.locator('#workspace_navigation select').first().selectOption('customization');
    await page.locator('[aria-label="Font size"]').fill('21');await page.locator('[aria-label="Font size"]').dispatchEvent('change');
    await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();
    await page.locator('#workspace_navigation select').first().selectOption('local-actions');
   }
   await page.waitForTimeout(400);
   const record=async stage=>{
    const details=await page.evaluate(()=>{
     const active=document.activeElement,region=(id)=>{const n=document.querySelector(`[data-region="${id}"]`);if(!n||!n.checkVisibility())return null;const r=n.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)};};
     const visible=n=>!!n&&n.checkVisibility();
     const elder=document.querySelector('[data-inspect-nearby="villageElder"]');
     const talk=document.querySelector('#location_actions_div .choice_dialogue');
     const sizeNode=document.querySelector('[data-region="focus"] .nearby-context-view');
     const pressed=elder?.getAttribute('aria-pressed');
     const desc=active=>({tag:active.tagName,id:active.id||null,nearby:active.dataset?.inspectNearby||null,action:active.dataset?.focusAction||null,topic:active.dataset?.topicId||null,text:(active.innerText||'').trim().slice(0,80)});
     return {active:desc(active),elderSelected:pressed,elderVisible:visible(elder),lowerTalkVisible:visible(talk),focusFont:sizeNode?parseFloat(getComputedStyle(sizeNode).fontSize):null,pageHeight:document.documentElement.scrollHeight,pageWidth:document.documentElement.scrollWidth,regions:Object.fromEntries(['player','focus','inventory','actions','log'].map(id=>[id,region(id)]))};
    });observations.states.push({stage,...details});return details;
   };
   const initial=await record('opening');
   assert.equal(initial.pageHeight,1080);assert.equal(initial.pageWidth,1920);
   assert.equal(initial.focusFont,size,'player text-size setting reached the actual nearby view');
   await page.screenshot({path:path.join(out,`native-opening-${size}.png`)});
   await page.locator('[data-inspect-nearby="villageElder"]').focus();await page.keyboard.press('Enter');
   observations.selectedDetail=(await page.locator('.nearby-context-detail').innerText()).trim();
   const selected=await record('elder selected');assert.equal(selected.elderSelected,'true');assert.equal(selected.lowerTalkVisible,true);
   await page.screenshot({path:path.join(out,`native-nearby-${size}.png`)});
   const direct=page.locator('[data-focus-action="talk:villageElder"]');await direct.focus();await page.keyboard.press('Enter');
   await page.locator('#talk_view_host .talk-view').waitFor({state:'visible'});
   await record('conversation opened');await page.screenshot({path:path.join(out,`native-talk-${size}.png`)});
   await page.keyboard.press('Tab');await record('Tab after opening');
   await page.locator('#talk_view_host button[data-topic-id="hello"]').focus();await page.keyboard.press('Enter');
   await page.waitForTimeout(200);await record('greeting answered');
   await page.keyboard.press('Tab');await record('Tab after greeting');
   await page.keyboard.press('Escape');await page.waitForTimeout(200);
   const returned=await record('Escape returned');assert.equal(returned.elderSelected,'true');assert.equal(returned.elderVisible,true);
   const detail=await page.locator('.nearby-context-detail').innerText();observations.afterGreetingDetail=detail.trim();
   await page.screenshot({path:path.join(out,`native-return-${size}.png`)});
   await page.waitForTimeout(1000);await record('return settled');
   const divider=page.locator('[data-shell-resize="topLeft"]');
   observations.resizeAvailable=await divider.isVisible();
   if(observations.resizeAvailable){
    const before=await record('before resize');await divider.focus();await page.keyboard.press('Shift+ArrowRight');await page.keyboard.press('Shift+ArrowRight');await page.waitForTimeout(200);
    const after=await record('after resize');observations.resizeDelta={player:after.regions.player.width-before.regions.player.width,inventory:after.regions.inventory.width-before.regions.inventory.width,focus:after.regions.focus.width-before.regions.focus.width};
    await page.screenshot({path:path.join(out,`native-resize-${size}.png`)});
    await page.keyboard.press('Shift+ArrowLeft');await page.keyboard.press('Shift+ArrowLeft');await page.keyboard.press('Shift+ArrowLeft');await page.waitForTimeout(200);
    const narrow=await record('after narrowing');observations.narrowDelta={player:narrow.regions.player.width-before.regions.player.width,inventory:narrow.regions.inventory.width-before.regions.inventory.width,focus:narrow.regions.focus.width-before.regions.focus.width};
   }
   result.bundle=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name.split('/').pop());
   await context.close();
  }
  assert.deepEqual(result.errors,[]);
 }catch(e){result.failure={message:e.message,stack:e.stack};process.exitCode=1;}
 finally{if(browser)await browser.close().catch(()=>{});server.kill();fs.writeFileSync(path.join(out,'native-shell-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
})();
