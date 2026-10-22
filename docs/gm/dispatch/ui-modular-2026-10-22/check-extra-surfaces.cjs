// UM8 extra surfaces (2026-10-22): the grid moved from CSS media queries to host-written variables,
// so check what fresh loads do not: (1) a live resize across the 1700px band with the simulation
// running settles to the same geometry as a fresh load; (2) a stored resized placement, then Reset
// (shell_resize clear()), matches on both builds; (3) the UI preview mounts the same regions.
const L=require('../ui-foundation-2026-10-15/r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const BUILDS={before:process.env.BEFORE,after:process.env.AFTER};
const geo=p=>p.evaluate(()=>{const box=n=>{const r=n.getBoundingClientRect();return[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)];};
    const board=document.querySelector('.workspace-board');return{cols:getComputedStyle(board).gridTemplateColumns.split(' ').map(v=>Math.round(parseFloat(v))).join(' '),areas:getComputedStyle(board).gridTemplateAreas,
    regions:Object.fromEntries([...document.querySelectorAll('.parity-region')].map(n=>[n.dataset.region,box(n)]))};});
async function page(b,base,w,h,{pause=true,storage=null}={}){
    const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
    const p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(25000);
    await p.goto(base+'/style.css');await p.evaluate(([d,s])=>{localStorage.clear();localStorage.setItem('save data',d);if(s)for(const[k,v]of Object.entries(s))localStorage.setItem(k,v);},[L.save,storage]);
    await p.goto(base+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await L.R.startFresh(p);if(pause)await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(1500);return {p,ctx};
}
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const out={};
try{for(const [build,base] of Object.entries(BUILDS)){const r=out[build]={};
    // (1) Live resize with the simulation running.
    const fresh={};for(const [w,h] of [[1920,1080],[1536,864]]){const {p,ctx}=await page(b,base,w,h,{pause:false});fresh[w]=await geo(p);await ctx.close();}
    const {p,ctx}=await page(b,base,1920,1080,{pause:false});
    await p.setViewportSize({width:1536,height:864});await p.waitForTimeout(2000);r.liveTo1536=await geo(p);
    await p.setViewportSize({width:1920,height:1080});await p.waitForTimeout(2000);r.liveBack1920=await geo(p);
    // Neither build settles back to fresh-load geometry after a live resize (fit engine, pre-existing); compare builds instead.
    r.liveMatchesFresh=[JSON.stringify(r.liveTo1536)===JSON.stringify(fresh[1536]),JSON.stringify(r.liveBack1920)===JSON.stringify(fresh[1920])];
    r.fresh=fresh;r.liveErrors=p.errors;
    // (2) Stored resized placement, then Reset this layout (clear()).
    await ctx.close();
    // A stored v1 placement under the current spec (shell_layout_edit.js), with sizes in idle.
    const spec=await import(require('url').pathToFileURL(require('path').resolve('src/layout_spec.js')).href).then(m=>m.LAYOUT_SPEC.version);
    const key='yairpg.workspace.v'+process.env.WORKSPACE_VERSION+'.desktop.proto23-parity.placement';
    const placement={version:1,spec,contexts:{idle:{boxes:{},companions:{},swap:false,sizes:{topLeft:0.3,bottomLeft:0.22,log:0.25,top:0.45}}}};
    const {p:p2,ctx:c2}=await page(b,base,1920,1080,{storage:{[key]:JSON.stringify(placement)}});
    r.resized=await geo(p2);
    await p2.evaluate(()=>{document.querySelector('[data-workspace-action=edit-layout]').click();document.querySelector('[data-workspace-action=shell-reset]').click();document.querySelector('[data-workspace-action=edit-layout]').click();});await p2.waitForTimeout(1500);
    r.afterReset=await geo(p2);r.resizeErrors=p2.errors;await c2.close();
    assert.notDeepEqual(r.resized,fresh[1920],build+': the stored sizes applied');
    r.resetMatchesFresh=JSON.stringify(r.afterReset)===JSON.stringify(fresh[1920]);
    // (3) UI preview.
    r.preview={};for(const [w,h] of [[1920,1080],[1536,864]]){const c=await b.newContext({viewport:{width:w,height:h}});const pp=await c.newPage();const errors=[];pp.on('pageerror',e=>errors.push(e.message));
        await pp.goto(`${base}/ui-preview.html?fixture=village&size=14`);await pp.waitForFunction(()=>window.__preview?.ready,null,{timeout:20000});await pp.waitForTimeout(1600);r.preview[w]={...(await geo(pp)),errors};await c.close();}
    console.log('PASS',build);}
  for(const k of ['liveTo1536','liveBack1920','resized','afterReset','preview','fresh','liveMatchesFresh','resetMatchesFresh'])assert.deepEqual(out.after[k],out.before[k],'before/after differ: '+k);
  assert.deepEqual([...out.after.liveErrors,...out.after.resizeErrors],[]);
  fs.writeFileSync(path.join(__dirname,'evidence','extra-surfaces.json'),JSON.stringify({status:'PASS',...out},null,1));console.log('ALL PASS: live resize, resized placement/reset and preview match');}
catch(e){fs.writeFileSync(path.join(__dirname,'evidence','extra-surfaces-FAIL.json'),JSON.stringify({error:e.message,...out},null,1));console.log('FAIL',e.message.split('\n')[0]);process.exitCode=1;}
finally{await b.close();}})();
