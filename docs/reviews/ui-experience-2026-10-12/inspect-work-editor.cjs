const fs=require('fs'),{chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='/Users/weiwei/code/yet-another-idle-rpg/docs/reviews/ui-experience-2026-10-12';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),records=[];
try{for(const [kind,url] of [['workspace','http://127.0.0.1:18571/'],['customization','http://127.0.0.1:18582/']]){
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));const result={kind,url,errors};records.push(result);
 await page.goto(url);await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();await page.locator('#location_actions_div').waitFor({state:'visible'});await page.waitForTimeout(1000);
 const measure=async()=>page.evaluate(()=>{const selectors=['#location_actions_div','#customization_host','#character_div','#inventory_combat_switch_selection','.customization-actions','#work_ledger_author'];return selectors.map(s=>document.querySelector(s)).filter(n=>n?.getClientRects().length).map(n=>{const r=n.getBoundingClientRect();return {id:n.id||n.className,x:r.x,y:r.y,width:r.width,height:r.height,scrollHeight:n.scrollHeight,clientHeight:n.clientHeight,text:n.innerText.slice(0,160)};});});
 if(kind==='customization'){
  result.editorSummaries=await page.locator('#customization_host summary').allTextContents();
  await page.locator('#customization_host').evaluate(n=>n.querySelectorAll('details').forEach(d=>d.open=true));
  await page.locator('#customization_host').scrollIntoViewIfNeeded();result.editor=await measure();await page.screenshot({path:out+'/customization-1440-editor-expanded.png'});
  const apply=page.getByRole('button',{name:'Apply and save',exact:true});await apply.scrollIntoViewIfNeeded();result.apply=await measure();await page.screenshot({path:out+'/customization-1440-editor-apply.png'});
 }
 await page.getByText('Find work',{exact:false}).first().click();result.workChoices=await page.locator('#location_actions_div').innerText();await page.screenshot({path:out+'/'+kind+'-1440-work-choices.png'});
 const work=page.getByText('Take a loaned kit and patrol with Tessa',{exact:false}).first();if(await work.count()){await work.click();await page.waitForTimeout(1700);result.busy=await measure();result.busyText=await page.locator('#location_actions_div').innerText();await page.screenshot({path:out+'/'+kind+'-1440-busy.png'});}
 await context.close();console.log(JSON.stringify({kind,editorSummaries:result.editorSummaries,choices:result.workChoices.slice(0,400),busy:!!result.busy,errors}));
}fs.writeFileSync(out+'/FOLLOWUP.json',JSON.stringify({scope:'Fresh hero editor inspection and native paid patrol start, no save import or full-shift completion',records},null,2));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
