// R16b/R16c: density and idle/combat compositions in the default (parity) shell.
// Synthetic fixtures only, fresh browser context (fresh origin storage) per case.
// Usage: R4_URL=http://127.0.0.1:19271 node check-r16.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/r16');fs.mkdirSync(E,{recursive:true});
const COMBAT=fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8');
const TARGETS=[[1366,768,14],[1366,768,21],[1920,1080,21]];
const LAYOUT_KEY='yairpg.workspace.v1.desktop.proto23-parity';
const geo=p=>p.evaluate(()=>{const box=s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect();return r.height?[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]:null;};
    const m=document.getElementById('main_content');const mod=id=>document.querySelector(`[data-region] > .workspace-module[data-module="${id}"]`);const shown=id=>{const n=mod(id);return !!n&&!n.hidden&&getComputedStyle(n).display!=='none'&&n.getBoundingClientRect().height>0;};
    const rb=box('[data-region] > .workspace-module[data-module=records]'),sb=box('[data-region] > .workspace-module[data-module=skills]');
    return{overlap:!!(rb&&sb&&rb[1]<sb[1]+sb[3]&&sb[1]<rb[1]+rb[3]&&rb[0]<sb[0]+sb[2]&&sb[0]<rb[0]+rb[2]),rows:getComputedStyle(document.querySelector('.workspace-board')).gridTemplateRows,fit:m.dataset.shellFit||'',combat:m.dataset.parityCombat,
        records:shown('records'),skills:shown('skills'),recordsRegion:mod('records')?.parentElement?.dataset.region||null,recordsTitle:mod('records')?.querySelector('.workspace-module-header > strong')?.textContent||'',
        actionsOrder:[...document.querySelectorAll('[data-region=actions] > .workspace-module')].filter(n=>!n.hidden&&getComputedStyle(n).display!=='none').map(n=>n.dataset.module),
        log:box('[data-region=log]'),invRow:box('#inventory_content_div > .inventory_item_control'),action:box('#location_actions_div > :is(.location_choice_dropdown,.location_choices)'),paneTab:box('#workspace_pane_navigation > button'),
        page:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,vw:innerWidth,vh:innerHeight}};});
// The composition re-measures for 2 s after the start screen closes (first content); tick checks start after it.
async function openShell(b,{w,h,font,data,storage}){const {ctx,p}=await L.open(b,{w,h,data,storage});if(font!==14)await L.textSize(p,font);await p.waitForTimeout(2500);return{ctx,p};}
// Pane tabs: a discovered pane button (for example Skills) narrows its neighbours. That is inherited
// from R15 (same on the frozen build); this check compares their vertical position only.
const vertical=box=>box&&[box[1],box[3]];
// Own launcher: r11-lib's closes the browser after 120 s, shorter than this check under load.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const results=[];const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const run=async(name,fn)=>{try{const r=await fn();results.push({name,...r});console.log('PASS',name);}catch(e){results.push({name,fail:e.message});console.log('FAIL',name,e.message.split('\n')[0]);}};
try{for(const [w,h,font] of TARGETS){const tag=`${w}x${h}-${font}`;
    await run(`${tag} idle: companions beside actions, ticks move nothing, no overflow`,async()=>{const {ctx,p}=await openShell(b,{w,h,font});
        const g=await geo(p);assert.equal(g.fit,'true','shell fit inactive');// R21 (Weibao 2026-10-17, "We dont need skills always be seen"): idle shows Journal only.
        assert.ok(g.records&&!g.skills,'Journal companion missing, or Skills still shown idle');assert.equal(g.recordsRegion,'actions');assert.equal(g.recordsTitle,'Journal');assert.equal(g.overlap,false,'Journal and Skills overlap');
        // PX10: companions follow the actions in reading order.
        assert.ok(g.actionsOrder.indexOf('records')>g.actionsOrder.indexOf('local-actions'),`order ${g.actionsOrder}`);
        assert.ok(g.page.w<=g.page.vw&&g.page.h<=g.page.vh,`page overflow ${JSON.stringify(g.page)}`);
        // WX4/UR52: hovering an action (a pending target) and running 30 rendered ticks moves no target.
        await p.locator('#location_actions_div > .location_choice_dropdown').first().hover();
        await p.evaluate(()=>advanceTicks(30,{render:true}));await p.waitForTimeout(400);const after=await geo(p);
        for(const k of ['rows','invRow','action','log'])assert.deepEqual(after[k],g[k],`${k} moved on ticks`);assert.deepEqual(vertical(after.paneTab),vertical(g.paneTab),'pane tabs moved vertically');
        assert.deepEqual(p.errors,[]);await p.screenshot({path:path.join(E,`check-idle-${tag}.png`)});await ctx.close();return{g};});
    await run(`${tag} combat: Journal yields, top row fits, ticks move nothing`,async()=>{const {ctx,p}=await openShell(b,{w,h,font,data:COMBAT});
        const g=await geo(p);assert.equal(g.combat,'true');assert.equal(g.fit,'true');assert.equal(g.records,false,'Journal shown in a fight');
        assert.ok(g.page.w<=g.page.vw&&g.page.h<=g.page.vh,'page overflow');
        await p.evaluate(()=>advanceTicks(30,{render:true}));await p.waitForTimeout(400);const after=await geo(p);
        for(const k of ['rows','invRow','log'])assert.deepEqual(after[k],g[k],`${k} moved on ticks`);assert.deepEqual(vertical(after.paneTab),vertical(g.paneTab),'pane tabs moved vertically');assert.equal(after.skills,g.skills,'a companion appeared or left on a tick');
        assert.deepEqual(p.errors,[]);await ctx.close();return{g};});
    await run(`${tag} NX33: every known panel has a route; Herbal experiments opens from More panels`,async()=>{const {ctx,p}=await openShell(b,{w,h,font});
        const more=p.getByRole('combobox',{name:'Other known panels'});assert.ok(await more.isVisible(),'More panels select not visible in the shell');
        const box=await more.boundingBox();assert.ok(box.y+box.height<=h&&box.x+box.width<=w,'More panels off screen');
        const g=await geo(p);assert.ok(g.page.w<=g.page.vw&&g.page.h<=g.page.vh,'nav wrap made the page scroll');
        await more.selectOption('herbal-experiments');await p.locator('#crafting_engine_home').waitFor({state:'visible'});
        await p.keyboard.press('Escape');await p.waitForTimeout(300);assert.equal(await p.locator('#crafting_engine_home').isVisible(),false,'Esc did not close Herbal experiments');
        assert.deepEqual(p.errors,[]);await ctx.close();return{box};});
    await run(`${tag} GU2: a composition measure stays within one frame with 500 inventory rows (DOM proxy)`,async()=>{const {ctx,p}=await openShell(b,{w,h,font});
        const r=await p.evaluate(async()=>{const list=document.getElementById('inventory_content_div'),row=list.firstElementChild;for(let i=list.children.length;i<500;i++)list.append(row.cloneNode(true));
            performance.clearMeasures('shell-composition');for(let i=0;i<5;i++){window.dispatchEvent(new Event('resize'));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}
            const d=performance.getEntriesByName('shell-composition').map(e=>e.duration);return{rows:list.children.length,count:d.length,max:Math.max(...d),mean:d.reduce((a,b)=>a+b,0)/d.length};});
        assert.ok(r.count>=1,'no measure ran');assert.ok(r.max<16.7,`measure took ${r.max.toFixed(1)} ms`);await ctx.close();return{timing:r};});
}
    await run('Journal nav opens the companion in the center and Back returns it (CZ7)',async()=>{const {ctx,p}=await openShell(b,{w:1366,h:768,font:14});
        await L.nav(p,'records');await p.waitForTimeout(400);const open=await p.evaluate(()=>!!document.querySelector('#center_mode_content #journal_div'));
        await L.back(p);await p.waitForTimeout(400);const g=await geo(p);assert.ok(open,'Journal did not open in the center');assert.ok(g.records&&g.recordsRegion==='actions','Journal did not return to its companion slot');
        assert.deepEqual(p.errors,[]);await ctx.close();return{open,g};});
    await run('manual hide of the Journal companion survives reload (WX11, CZ6)',async()=>{const {ctx,p}=await openShell(b,{w:1366,h:768,font:14});
        await p.evaluate(()=>document.querySelector('[data-workspace-action=hide][data-module=records]').click());await p.waitForTimeout(300);
        const saved=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),LAYOUT_KEY);assert.ok(saved?.spec>=1,'spec not saved'); // R21c raised the layout spec to 2
        await p.reload({waitUntil:'domcontentloaded'});await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p);await p.waitForTimeout(500);
        const g=await geo(p);assert.equal(g.records,false,'hidden Journal came back');assert.equal(g.skills,false,'R21: Skills is not an idle companion');assert.deepEqual(p.errors,[]);await ctx.close();return{g};});
    await run('an older saved parity layout gains the companions once (CZ6)',async()=>{
        const old=JSON.stringify({version:1,mode:'dock',columns:[.263,.435,.302],density:'comfortable',modules:[{id:'records',hidden:true},{id:'skills',hidden:true}]});
        const {ctx,p}=await openShell(b,{w:1366,h:768,font:14,storage:{[LAYOUT_KEY]:old}});const g=await geo(p);assert.ok(g.records,'older layout kept the Journal hidden');assert.deepEqual(p.errors,[]);await ctx.close();return{g};});
    await run('a fresh character with no journal yet shows no Journal companion (CZ5)',async()=>{const {ctx,p}=await openShell(b,{w:1366,h:768,font:14,data:null});
        const g=await geo(p);assert.equal(g.records,false);const named=await p.evaluate(()=>[...document.querySelectorAll('[data-region] .workspace-module-header > strong')].some(n=>n.textContent==='Journal'&&n.getClientRects().length));
        assert.equal(named,false,'undiscovered Journal named');assert.deepEqual(p.errors,[]);await ctx.close();return{g};});
}finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r16.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
