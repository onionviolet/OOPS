const fs=require('node:fs');const assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [URL,FIX,SHOT]=process.argv.slice(2);const res={};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 if(FIX&&FIX!=='-'){const d=JSON.parse(fs.readFileSync(FIX,'utf8'));await context.addInitScript(d=>{if(!sessionStorage.getItem('fx')){localStorage.setItem('save data',JSON.stringify(d));sessionStorage.setItem('fx','1');}},d);}
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const play=async()=>{await page.getByText('PLAY',{exact:true}).click({noWaitAfter:true});const c=page.getByText('Confirm',{exact:true});if(await c.isVisible().catch(()=>false))await c.click({noWaitAfter:true});await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'&&!!localStorage.getItem('save data'),null,{polling:100,timeout:30000});await page.waitForTimeout(1500);};
 await page.goto(URL);await play();
 res.animation=await page.evaluate(()=>{const a=document.getElementById('loading_screen_author');return [a.style.animationPlayState,getComputedStyle(a).animationPlayState];});
 if(!process.env.BASE)assert.equal(res.animation[1],'paused');
 // Focus across ticks: a visible enabled button inside a docked module body.
 const fid=await page.evaluate(()=>{const b=[...document.querySelectorAll('.workspace-dock .workspace-module-body button:not(:disabled)')].find(b=>b.getClientRects().length);b.dataset.focusProbe='1';b.focus();return b.textContent.trim().slice(0,40);});
 await page.waitForTimeout(2000);res.focus={control:fid,kept:await page.evaluate(()=>document.activeElement?.dataset.focusProbe==='1')};assert.ok(res.focus.kept);
 // A select inside module options keeps focus too.
 res.selProbe=await page.evaluate(()=>{const s=[...document.querySelectorAll('.workspace-dock .workspace-module-body select:not(:disabled), .workspace-dock .workspace-module-body input:not(:disabled), .workspace-dock .workspace-module-header strong')].find(s=>s.getClientRects().length);s.dataset.focusProbe='2';s.focus();return [s.tagName,s.closest('.workspace-module').dataset.module,document.activeElement===s];});
 await page.waitForTimeout(1500);res.focusSelect=await page.evaluate(()=>document.activeElement?.dataset.focusProbe==='2');assert.ok(res.selProbe[2]&&res.focusSelect);
 await page.mouse.click(5,5);
 // Scroll position of a dock survives ticks.
 res.scroll=await page.evaluate(async()=>{const d=[...document.querySelectorAll('.workspace-dock')].find(d=>d.scrollHeight>d.clientHeight+50);if(!d)return 'no scrollable dock';d.scrollTop=40;const a=d.scrollTop;await new Promise(r=>setTimeout(r,1500));return {dock:d.dataset.dock,before:a,after:d.scrollTop};});
 if(typeof res.scroll==='object')assert.equal(res.scroll.after,res.scroll.before);
 // Resize reflow.
 const widths=()=>page.evaluate(()=>['left','center','right'].map(d=>Math.round(document.querySelector(`.workspace-dock[data-dock="${d}"]`).getBoundingClientRect().width)));
 res.w1366=await widths();await page.setViewportSize({width:1200,height:768});await page.waitForTimeout(600);res.w1200=await widths();
 await page.setViewportSize({width:1366,height:768});await page.waitForTimeout(600);res.wBack=await widths();
 assert.ok(res.w1200[0]<res.w1366[0]&&res.w1200[1]<res.w1366[1]);assert.deepEqual(res.wBack,res.w1366);
 // Edit layout on.
 await page.locator('.workspace-layout-menu > summary').click();await page.locator('[data-workspace-action="edit-layout"]').click();
 res.editing=await page.evaluate(()=>document.getElementById('main_content').dataset.layoutEditing);assert.equal(res.editing,'true');
 // Drag a left-dock module header into the right dock.
 const pick=await page.evaluate(()=>{const s=[...document.querySelectorAll('.workspace-dock[data-dock="left"] > .workspace-module')].find(s=>!s.hidden&&s.dataset.pinned!=='true'&&s.getClientRects().length);s.parentElement.scrollTop=0;const h=s.querySelector('.workspace-drag-handle').getBoundingClientRect();const r=document.querySelector('.workspace-dock[data-dock="right"]').getBoundingClientRect();return {id:s.dataset.module,hx:h.x+h.width/2,hy:h.y+h.height/2,rx:r.x+r.width/2,ry:r.y+Math.min(r.height-10,300)};});
 await page.mouse.move(pick.hx,pick.hy);await page.mouse.down();await page.mouse.move(pick.hx+30,pick.hy+10,{steps:3});await page.mouse.move(pick.rx,pick.ry,{steps:10});await page.mouse.up();await page.waitForTimeout(400);
 res.move=await page.evaluate(id=>({dock:document.querySelector(`.workspace-module[data-module="${id}"]`).parentElement.dataset.dock,saved:JSON.parse(Object.entries(localStorage).find(([k])=>k.startsWith('yairpg.workspace')||k.includes('layout'))?.[1]||'null')?.modules?.find(m=>m.id===id)?.dock,status:document.querySelector('.workspace-status').textContent}),pick.id);
 res.move.id=pick.id;assert.equal(res.move.dock,'right');
 // Shift+drag same module to float.
 const h2=await page.evaluate(id=>{const h=document.querySelector(`.workspace-module[data-module="${id}"] .workspace-drag-handle`).getBoundingClientRect();return {x:h.x+h.width/2,y:h.y+h.height/2};},pick.id);
 await page.mouse.move(h2.x,h2.y);await page.mouse.down();await page.keyboard.down('Shift');await page.mouse.move(h2.x-20,h2.y+10,{steps:3});await page.mouse.move(500,300,{steps:10});await page.mouse.up();await page.keyboard.up('Shift');await page.waitForTimeout(400);
 const fl=()=>page.evaluate(id=>{const s=document.querySelector(`.workspace-module[data-module="${id}"]`);const r=s.getBoundingClientRect();return {floating:s.classList.contains('workspace-floating'),left:s.style.left,top:s.style.top,maxH:s.style.getPropertyValue('--workspace-float-max-height'),w:Math.round(r.width),width:s.style.getPropertyValue('--workspace-width')};},pick.id);
 await page.screenshot({path:'/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg--claude-worktrees-engine-perf-layout-4d6570/fc231788-2988-49be-b2a2-f09310f39470/scratchpad/geom.png'});res.geom=await page.evaluate(()=>({menuOpen:document.querySelector('.workspace-layout-menu').open,tbTop:document.querySelector('.workspace-toolbar').getBoundingClientRect().top,scrollY,tb:document.querySelector('.workspace-toolbar').getBoundingClientRect().bottom,foot:document.getElementById('bottom_panel_div')?.getBoundingClientRect().top,ih:innerHeight}));res.float=await fl();assert.ok(res.float.floating&&res.float.left&&res.float.maxH);
 // Resize the floating panel via its east grip.
 const g=await page.evaluate(id=>{const r=document.querySelector(`.workspace-module[data-module="${id}"] [data-resize="e"]`).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};},pick.id);
 await page.mouse.move(g.x,g.y);await page.mouse.down();await page.mouse.move(g.x+60,g.y,{steps:8});await page.mouse.up();await page.waitForTimeout(400);
 res.floatResized=await fl();assert.ok(res.floatResized.w>res.float.w,'float grew');
 await page.waitForTimeout(1200);res.floatStable=await fl();assert.deepEqual(res.floatStable,res.floatResized);
 // Divider drag changes columns.
 const before=await widths();const dv=await page.evaluate(()=>{const r=document.querySelector('[data-divider="0"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+Math.min(200,r.height/2)};});
 await page.mouse.move(dv.x,dv.y);await page.mouse.down();await page.mouse.move(dv.x+80,dv.y,{steps:8});await page.mouse.up();await page.waitForTimeout(400);res.divider={before,after:await widths()};assert.ok(res.divider.after[0]>before[0]);
 // Done editing.
 await page.locator('.workspace-layout-menu > summary').click();await page.locator('[data-workspace-action="edit-layout"]').click();
 // Colors: Standard then Vivid persist across reload with layout.
 await page.locator('.workspace-layout-menu > summary').click();await page.locator('[data-workspace-action="colors"]').selectOption('standard');
 res.colors=await page.evaluate(()=>document.documentElement.dataset.colorScheme);assert.equal(res.colors,'standard');
 if(SHOT)await page.screenshot({path:SHOT});
 await page.reload();await play();
 res.afterReload=await page.evaluate(id=>({colors:document.documentElement.dataset.colorScheme,floating:document.querySelector(`.workspace-module[data-module="${id}"]`).classList.contains('workspace-floating'),left:document.querySelector(`.workspace-module[data-module="${id}"]`).style.left}),pick.id);
 assert.equal(res.afterReload.colors,'standard');assert.ok(res.afterReload.floating);
 await page.locator('.workspace-layout-menu > summary').click();await page.locator('[data-workspace-action="colors"]').selectOption('vivid');res.vivid=await page.evaluate(()=>document.documentElement.dataset.colorScheme);assert.equal(res.vivid,'vivid');
 res.errors=errors;assert.deepEqual(errors,[]);
 console.log(JSON.stringify(res,null,1));await browser.close();
})().catch(e=>{console.error(e);console.log(JSON.stringify(res,null,1));process.exit(1);});
