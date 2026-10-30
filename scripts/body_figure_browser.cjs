// Body figure evidence at 1920x1080 (docs/representations/BODY_AND_CONDITIONS.md): a fresh life meets the elder,
// begins a body record, finishes one grip drill, then captures Effects reduced, full and off through the save-level
// Settings control. Usage: npm run build && npm run build:figures && node scripts/body_figure_browser.cjs
const root=require('node:path').resolve(__dirname,'..');
const {launchChrome,advanceGameMinutes}=require('./ui_helpers.cjs');
const {spawn}=require('node:child_process'),fs=require('node:fs');
const out=process.env.YAIRPG_PROOF_DIR||root+'/docs/representations/evidence/body';fs.mkdirSync(out,{recursive:true});
const port=Number(process.env.YAIRPG_PROOF_PORT)||18531,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
const step=process.argv[2]||'all';
(async()=>{await new Promise(r=>setTimeout(r,800));const browser=await launchChrome(),errors=[];try{
 const context=await browser.newContext({viewport:{width:1920,height:1080}});const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(`http://localhost:${port}/?test_hooks=1`);await page.getByText('PLAY',{exact:true}).click();
 // The talk view covers the native text lines, so choose through its own options.
 for(const sel of ['.choice_dialogue','[data-dialogue="villageElder"]','#talk_view_host button[data-topic-id="hello"]','#talk_view_host button[data-topic-id="where am i"]','#center_mode_back'])await page.locator(sel).first().click();
 await advanceGameMinutes(page,15);
 const info=await page.evaluate(()=>{const p=document.getElementById('body_panel');const chain=[];for(let n=p;n;n=n.parentElement)chain.push(n.id||n.className||n.tagName);return {exists:!!p,hidden:p?.hidden,chain:chain.slice(0,8),routes:[...document.querySelectorAll('[data-route-id]')].map(b=>b.dataset.routeId+':'+(b.offsetParent?'v':'h')+':'+b.textContent.trim().slice(0,20)),nb:document.getElementById('adventure_notebook')?.offsetParent!=null,mod:document.querySelector('.workspace-module:has(#adventure_notebook)')?.dataset.moduleId,views:[...document.querySelectorAll('[data-notebook-view]')].map(b=>b.dataset.notebookView+':'+(b.offsetParent?'v':'h')),};});
 console.log(JSON.stringify(info));
 if(step==='probe')return;
 const reveal=async()=>{await page.locator('[data-route-id="records:notebook"]').first().click();await page.locator('[data-notebook-view="practice"]').click();if(!await page.locator('#body_panel').evaluate(n=>n.open))await page.locator('#body_panel > summary').click();await page.evaluate(()=>{const p=document.getElementById('body_panel');p.querySelector('.body-figure').open=true;document.documentElement.style.fontSize='';p.scrollIntoView({block:'start'});});};
 await reveal();await page.locator('[data-body-command="body.begin"]').click();
 await page.locator('[data-body-command="body.grip_drill"]').click();await advanceGameMinutes(page,4);await page.evaluate(()=>simulationTestHooks.pause());await reveal(); // paused: the shots compare one moment across settings
 const text=await page.locator('#body_panel .body-figure').evaluate(n=>n.innerText);fs.writeFileSync(out+'/body-figure-text.txt',text+'\n');console.log(text);
 for(const fx of ['reduced','full','off']){
  // The save-level Settings › Effects control and its Apply and save button (the route is hidden this early, so driven by DOM).
  await page.evaluate(async fx=>{const sel=document.querySelector('select[aria-label="Effects"]');sel.value=fx;sel.dispatchEvent(new Event('change',{bubbles:true}));
   [...document.querySelectorAll('button[data-write]')].find(b=>b.textContent==='Apply and save').click();},fx);
  await page.waitForFunction(fx=>document.documentElement.dataset.effects===fx,fx);await reveal();await page.waitForTimeout(400);
  await page.screenshot({path:`${out}/body-panel-1920-effects-${fx}.png`});
  await page.locator('#body_panel').screenshot({path:`${out}/body-panel-crop-effects-${fx}.png`});
  console.log(fx,await page.evaluate(()=>{const h=document.querySelector('#body_panel .body-chip');const cs=h&&getComputedStyle(h);return cs&&{chipShadow:cs.boxShadow,chip:h.textContent,fx:document.documentElement.dataset.effects};}),
   await page.evaluate(()=>(()=>{const b=document.querySelector('[data-body-command="body.grip_drill"]').getBoundingClientRect(),p=document.getElementById('body_panel').getBoundingClientRect();return {buttonOffsetInPanel:b.top-p.top,left:b.left,panelHeight:p.height};})()));
 }
 // 21 px text through Settings › Font size (item 7 of the round 2 brief).
 await page.evaluate(()=>{const i=document.querySelector('input[aria-label="Font size"]');i.value='21';i.dispatchEvent(new Event('change',{bubbles:true}));[...document.querySelectorAll('button[data-write]')].find(b=>b.textContent==='Apply and save').click();});
 await page.waitForTimeout(500);await reveal();await page.locator('#body_panel').screenshot({path:`${out}/body-panel-crop-21px.png`});
 console.log('21px',await page.evaluate(()=>getComputedStyle(document.querySelector('#body_panel .body-view-parts td')).fontSize));
 // Gallery
 for(const fx of ['full','off']){const g=await context.newPage();await g.goto(`http://localhost:${port}/figure-gallery.html?effects=${fx}`);await g.locator('[data-fixture="body-record"]').scrollIntoViewIfNeeded();
  await g.locator('[data-fixture="body-record"]').screenshot({path:`${out}/gallery-body-record-effects-${fx}.png`});
  if(fx==='full')for(const id of ['body-channels','body-second'])await g.locator(`[data-fixture="${id}"]`).screenshot({path:`${out}/gallery-${id}.png`});await g.close();}
}finally{console.log('errors',JSON.stringify(errors.slice(0,5)));await browser.close();server.kill();}})().catch(e=>{console.error(e);server.kill();process.exit(1);});
