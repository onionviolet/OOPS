// R17 Step 0 preview checks (PV3, PV4, PV8, NX40). Usage: R4_URL=http://127.0.0.1:19271 node check-r17-preview.cjs
// Requires `npm run build:preview`. Synthetic fixtures only; fresh browser contexts.
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const E=path.join(__dirname,'evidence/r17');fs.mkdirSync(E,{recursive:true});
const BASE=process.env.R4_URL||'http://127.0.0.1:19271';
const TARGETS=[[1366,768,14],[1366,768,21],[1920,1080,21]];
const shot=async(p,name)=>{const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}};
async function preview(ctx,size){const p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.on('console',m=>{if(m.type()==='error')p.errors.push(m.text());});
    await p.goto(`${BASE}/ui-preview.html?fixture=village&size=${size}`);await p.waitForFunction(()=>window.__preview?.ready,null,{timeout:20000});await p.waitForTimeout(1600);return p;}
// Content geometry of the real panels: widths and the heights of content, not of stretched frames.
const panelGeo=p=>p.evaluate(()=>{const r=s=>{const n=document.querySelector(s);if(!n)return null;const b=n.getBoundingClientRect();return[Math.round(b.width),Math.round(b.height)];};
    const all=s=>[...document.querySelectorAll(s)].map(n=>{const b=n.getBoundingClientRect();return[Math.round(b.width),Math.round(b.height)];});
    return{font:getComputedStyle(document.getElementById('current_focus')).fontSize,focusRegion:r('[data-region=focus]')?.[0],actionsRegion:r('[data-region=actions]')?.[0],
        sceneHeader:r('#village_scene'),nearby:all('.shell-nearby > button'),prose:r('.shell-place-overview > p'),placeName:document.querySelector('#village_scene strong')?.textContent,
        calendar:document.querySelector('.scene-calendar')?.textContent,heading:document.querySelector('[data-module=focus] .workspace-module-header > strong')?.textContent};});
(async()=>{const results=[];const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const run=async(name,fn)=>{try{const r=await fn();results.push({name,...r});console.log('PASS',name);}catch(e){results.push({name,fail:e.message.split('\n')[0]});console.log('FAIL',name,e.message.split('\n')[0]);}};
try{
for(const [w,h,size] of TARGETS){const tag=`${w}x${h}-${size}`;
    await run(`${tag} preview boots: real panels, placeholders labelled, zero import-time timers and storage writes (PV4)`,async()=>{
        const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await preview(ctx,size);
        const rep=await p.evaluate(()=>window.__preview.report);
        assert.deepEqual(p.errors,[]);assert.equal(rep.importTimers,0,'import-time timers');assert.equal(rep.importWrites,0,'import-time storage writes');
        const vis=await p.evaluate(()=>({scene:!!document.querySelector('#village_scene')?.checkVisibility(),focus:!!document.querySelector('#current_focus')?.checkVisibility(),work:!!document.querySelector('#workspace_current_work')?.checkVisibility(),
            parity:document.getElementById('main_content').dataset.parity,companions:document.getElementById('main_content').dataset.shellCompanions,placeholders:[...document.querySelectorAll('[data-preview-placeholder] .preview-placeholder-label')].filter(n=>n.checkVisibility()).length,
            page:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}}));
        assert.ok(vis.scene&&vis.focus&&vis.work,'real panels not visible');assert.equal(vis.parity,'r3');assert.equal(vis.companions,'records skills');assert.ok(vis.placeholders>=8,'placeholders not labelled');
        assert.ok(vis.page.w<=w&&vis.page.h<=h,'preview page scrolls');await shot(p,`preview-${tag}`);await ctx.close();return{report:rep,vis};});
    await run(`${tag} PV8: real panels match the native shell's geometry at the same text size`,async()=>{
        const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await preview(ctx,size);const pv=await panelGeo(p);await ctx.close();
        const {ctx:gctx,p:g}=await L.open(b,{w,h});if(size!==14)await L.textSize(g,size);await g.waitForTimeout(2500);const native=await panelGeo(g);await gctx.close();
        // Region widths come from the shared board; content heights from text size and width alone.
        for(const k of ['font','focusRegion','actionsRegion','sceneHeader','nearby','prose','placeName','calendar','heading'])assert.deepEqual(pv[k],native[k],`${k}: preview ${JSON.stringify(pv[k])} native ${JSON.stringify(native[k])}`);
        return{preview:pv,native};});
}
    await run('PV3: a preview session leaves the game\'s storage on this origin byte-identical',async()=>{
        const ctx=await b.newContext({viewport:{width:1366,height:768}});const s=await ctx.newPage();await s.goto(BASE+'/style.css');
        const seeded={'save data':L.save,'yairpg.presentation.proto23-parity.v1':'off','yairpg.presentation.proto23-shell.v1':'off','yairpg.workspace.v1.desktop':'{"version":1,"mode":"dock","modules":[]}','r17-sentinel':'untouched'};
        await s.evaluate(d=>{localStorage.clear();for(const[k,v]of Object.entries(d))localStorage.setItem(k,v);},seeded);const before=await s.evaluate(()=>JSON.stringify(Object.entries(localStorage).sort()));
        const p=await preview(ctx,14);
        // Writes inside the preview: hide a companion, switch presentation, change density.
        await p.evaluate(()=>{document.querySelector('[data-workspace-action=hide][data-module=records]')?.click();document.querySelector('[data-workspace-action=toggle-density]')?.click();const sel=document.querySelector('[data-workspace-action=presentation]');sel.value='existing';sel.dispatchEvent(new Event('change',{bubbles:true}));});
        await p.waitForTimeout(300);const writes=await p.evaluate(()=>window.__preview.writes);assert.ok(writes>0,'the preview made no writes, so the check proves nothing');
        await p.selectOption('[aria-label="Text size"]','21');await p.waitForFunction(()=>window.__preview?.ready);
        const after=await s.evaluate(()=>JSON.stringify(Object.entries(localStorage).sort()));assert.equal(after,before,'game storage changed');
        assert.deepEqual(p.errors,[]);await ctx.close();return{previewWrites:writes,keys:Object.keys(seeded).length};});
}finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r17-preview.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
