const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),p=await context.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(20000);
 await p.goto('http://127.0.0.1:18586');await p.waitForFunction(()=>typeof window.saveProgress==='function');await p.getByText('PLAY',{exact:true}).click();await p.locator('#hero_creation_panel_confirmation').click();await p.waitForTimeout(500);
 await p.evaluate(()=>window.saveProgress());let input=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync('evidence/generated-opening.json',JSON.stringify(input,null,2));
 await p.getByText('Presentation profiles',{exact:true}).click();const ui=p.locator('.customization-editor');
 const apply=async()=>{await ui.getByLabel('Spacing',{exact:true}).press('Tab');await p.waitForTimeout(120);await ui.getByRole('button',{name:'Apply and save',exact:true}).click();await p.waitForTimeout(160);assert.match(await ui.locator('[role=status]').innerText(),/Saved/);};
 const metrics=async()=>p.evaluate(()=>{
  const ids=['inventory_combat_switch_selection','character_control_div','inventory_control_div','location_related_div','character_div'];const states={};
  for(const id of ids){const n=document.getElementById(id),s=getComputedStyle(n);states[id]={font:s.fontSize,bg:s.backgroundColor,color:s.color,height:n.getBoundingClientRect().height,scroll:n.scrollHeight,client:n.clientHeight,theme:n.closest('.customization-module')?.dataset.componentTheme,buttons:[...n.querySelectorAll('button,[role=button],.activable_buttons > div')].map(b=>({text:b.innerText,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,scroll:b.scrollHeight,client:b.clientHeight,bg:getComputedStyle(b).backgroundColor}))};}
  return {pageOverflow:document.documentElement.scrollWidth>innerWidth,states,preview:document.querySelector('.theme-preview').innerText};
 });
 const results=[];
 for(const theme of ['neutral','arcane','workshop']) {
  await ui.getByLabel('Component theme',{exact:true}).selectOption(theme);
  assert.equal(await p.locator('#character_div').getAttribute('data-component-theme'),'neutral'); // before first Apply or previous theme updated below
  break;
 }
 for(const theme of ['neutral','arcane','workshop']) {
  await ui.getByLabel('Component theme',{exact:true}).selectOption(theme);
  const before=await p.locator('#character_div').getAttribute('data-component-theme');assert.equal(await ui.locator('.theme-preview .customization-module').getAttribute('data-component-theme'),theme);
  await apply();assert.equal(await p.locator('#character_div').getAttribute('data-component-theme'),theme);
  const m=await metrics();results.push({theme,before,...m});assert.equal(m.pageOverflow,false);
  await p.screenshot({path:`evidence/${theme}-1440.png`});
 }
 // A large-font profile and long native labels must grow, not truncate.
 await ui.getByLabel('Font size',{exact:true}).fill('20');await ui.getByLabel('Spacing',{exact:true}).fill('16');await apply();
 for(const size of [{width:1440,height:900},{width:1512,height:982},{width:1920,height:1080}]){
  await p.setViewportSize(size);const m=await metrics();assert.equal(m.pageOverflow,false);for(const id of ['character_control_div','inventory_combat_switch_selection'])for(const b of m.states[id].buttons)assert.ok(b.scroll<=b.client+1,`${id} clipping ${b.text}`);
  results.push({viewport:size,textSize:20,...m});await p.screenshot({path:`evidence/large-${size.width}.png`});
 }
 await ui.getByLabel('Background',{exact:true}).fill('#ffffff');await ui.getByLabel('Text',{exact:true}).fill('#ffffff');await ui.getByLabel('Accent',{exact:true}).fill('#ffffff');await apply();
 assert.equal(await p.locator('#character_div').getAttribute('data-contrast-recovered'),'1');assert.match(await ui.locator('.theme-preview').innerText(),/Low contrast palette/);results.push({contrastRecovery:await p.locator('#character_div').evaluate(n=>getComputedStyle(n).color)});
 await ui.getByRole('button',{name:'Reset draft',exact:true}).click();await apply();
 await p.evaluate(()=>window.saveProgress());const final=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync('evidence/generated-final.json',JSON.stringify(final,null,2));
 await p.reload();await p.waitForFunction(()=>typeof window.saveProgress==='function');await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(400);assert.equal(await p.locator('#character_div').getAttribute('data-component-theme'),'neutral');
 const encoded=Buffer.from(JSON.stringify(final)).toString('base64');await p.evaluate(s=>window.load_progress(s),encoded);await p.waitForTimeout(1600);await p.waitForFunction(()=>typeof window.saveProgress==='function');if(await p.getByText('PLAY',{exact:true}).isVisible())await p.getByText('PLAY',{exact:true}).click();
 await p.evaluate(()=>window.saveProgress());assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).customization),final.customization);
 assert.deepEqual(errors,[]);fs.writeFileSync('evidence/THEME_RESULT.json',JSON.stringify({results,errors,persistence:'generated opening/save/reload/import',bundle:fs.readFileSync('index.html','utf8').match(/dist\/bundle.js\?version=[^&"]+/)[0]},null,2));await browser.close();console.log('PASS theme browser',results.length);
})().catch(e=>{console.error(e);process.exit(1)});
