const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),crypto=require('node:crypto');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:49873/',{waitUntil:'load'});await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(500);
if(await page.locator('#hero_creation_panel_confirmation').isVisible()){await page.locator('[data-race_id=human]').click();await page.locator('#hero_creation_name_field').fill('ER11 Audit');await page.locator('[data-gender=female]').click();await page.locator('#hero_creation_panel_confirmation').click();}
await page.waitForTimeout(1000);const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
const before=await cdp.send('Performance.getMetrics');await page.waitForTimeout(5000);const after=await cdp.send('Performance.getMetrics');const delta={};for(const m of after.metrics){const b=before.metrics.find(x=>x.name===m.name);if(b&&['LayoutCount','LayoutDuration','RecalcStyleCount','RecalcStyleDuration','TaskDuration'].includes(m.name))delta[m.name]=m.value-b.value;}
const opening=await page.evaluate(()=>({name:document.getElementById('character_name_field').value,localText:document.getElementById('location_related_div').innerText,counters:['money_div','time_div','character_health_value','character_stamina_value'].map(id=>{const e=document.getElementById(id);return {id,exists:!!e,font:e&&getComputedStyle(e).fontFamily,numeric:e&&getComputedStyle(e).fontVariantNumeric};})}));
await page.screenshot({path:__dirname+'/opening.png'});
const response=await page.request.get('http://127.0.0.1:49873/dist/bundle.js');const servedHash=crypto.createHash('sha256').update(await response.body()).digest('hex');
const fixture=await context.newPage();await fixture.goto('http://127.0.0.1:49873/micro-probe.html');
const component=await fixture.evaluate(async()=>{
 const {createVillageCareerControls}=await import('/src/village_career_ui.js');const {createVillageCareer}=await import('/src/village_career.js');
 const state=createVillageCareer();Object.assign(state,{rank:1,shifts:2,completed:2,returned:2});
 state.watchcraft.issued=true;const view={visible:true,state,study:{known:true,practiced:false,executable:false},canWrite:true,busy:false,canTeach:false,recruitAlive:true,hasNotes:false};
 const noop=()=>{};const career=createVillageCareerControls({read:()=>view,resolve:noop,promote:noop,notes:noop,readNotes:noop,practice:noop,mentor:noop,tutor:noop});
 const original=document.getElementById('village_watchcraft_practice');original.focus();state.watchcraft.practiceMinutes=1;career.render();
 const focus={originalConnected:original.isConnected,activeId:document.activeElement.id,activeTag:document.activeElement.tagName,replacementExists:!!document.getElementById('village_watchcraft_practice')};career.destroy();
 const {createTitlesPanel}=await import('/src/titles_ui.js');const rows=[{id:'audit',family:'life',name:'Audit title',text:'Fixture',held:false,progress:1,at:100}];const titles=createTitlesPanel({read:()=>rows});
 document.getElementById('titles_panel').open=true;document.getElementById('character_bio_div').style.cssText='display:block;user-select:text';const text=document.querySelector('#titles_panel b').firstChild,range=document.createRange();range.selectNodeContents(text);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);const selectedBefore=sel.toString();rows[0].progress=2;titles.render();const selection={before:selectedBefore,after:sel.toString(),originalConnected:text.isConnected};titles.destroy();
 const {renderCraftingDetail}=await import('/src/crafting_detail.js');const root=document.getElementById('craft-test');let commits=0;const model={title:'Synthetic paid recipe',available:true,requirements:[],output:{name:'Fixture',count:1},chance:100,station:'Fixture',xp:'1'};
 const render=()=>renderCraftingDetail(root,model,{onCommit:()=>{commits++;render();},onBlocked:noop});render();root.style.position='fixed';root.style.top='0';root.style.left='0';root.style.zIndex='9999';
 window.componentProbe={focus,selection,get commits(){return commits;}};
 return {focus,selection};
});
await fixture.locator('[data-craft-commit]').dblclick();component.craftDoubleClickCommits=await fixture.evaluate(()=>window.componentProbe.commits);
const misc=fs.readFileSync('/tmp/yairpg-er11-mg8hxm66/src/misc.js','utf8');const pick=(start,end)=>misc.slice(misc.indexOf('function '+start),misc.indexOf('function '+end));
const formatting=await fixture.evaluate(code=>{const game_options={expo_threshold:6};eval(code+';window.er11fmt={expo,format_reading_time,format_working_time}');return {expo:[0,0.001,-0.001,-1000000,1200].map(number=>({input:number,output:window.er11fmt.expo({number})})),reading:[0,1,59.6,60,120].map(input=>({input,output:window.er11fmt.format_reading_time(input)})),working:[0,1,1.5,61].map(input=>({input,output:window.er11fmt.format_working_time(input)}))};},pick('expo','round_item_price')+pick('format_reading_time','compare_game_version'));
const result={viewport:{width:1366,height:768},durationMs:5000,delta,opening,servedHash,component,formatting,errors};fs.writeFileSync(__dirname+'/browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
