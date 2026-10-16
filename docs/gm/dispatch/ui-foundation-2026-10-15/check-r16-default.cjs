// R16a: the parity shell is the default presentation; a stored choice is kept; the Layout menu
// still switches and the switch survives reload. Fresh loopback origin per case, synthetic save.
// Usage: R4_URL=http://127.0.0.1:19271 node check-r16-default.cjs
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/r16');fs.mkdirSync(E,{recursive:true});
const BASE=process.env.R4_URL||'http://127.0.0.1:19271';
const P='yairpg.presentation.proto23-parity.v1',S='yairpg.presentation.proto23-shell.v1';
const ready=p=>p.waitForFunction(()=>!!window.simulationTestHooks&&!!document.getElementById('workspace_navigation'),null,{timeout:60000});
async function open(b,storage,{w=1366,h=768}={}){const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'}),p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(25000);await ctx.route('**/favicon.ico',r=>r.abort());
    await p.goto(BASE+'/style.css');await p.evaluate(({save,storage})=>{localStorage.clear();localStorage.setItem('save data',save);for(const[k,v]of Object.entries(storage))localStorage.setItem(k,v);},{save:L.save,storage});
    await p.goto(BASE+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await ready(p);await L.R.startFresh(p);await p.waitForTimeout(400);return{ctx,p};}
const state=p=>p.evaluate(({P,S})=>{const m=document.getElementById('main_content');return{presentation:m.dataset.presentation||'',parity:m.dataset.parity||'',menu:document.querySelector('[data-workspace-action=presentation]')?.value,keys:{parity:localStorage.getItem(P),shell:localStorage.getItem(S)}};},{P,S});
(async()=>{const results=[];const b=await L.launch();
const run=async(name,fn)=>{try{const r=await fn();results.push({name,...r});console.log('PASS',name,JSON.stringify(r));}catch(e){results.push({name,fail:e.message});console.log('FAIL',name,e.message);}};
try{
    await run('fresh origin opens the parity shell and writes nothing',async()=>{const {ctx,p}=await open(b,{});const s=await state(p);
        assert.equal(s.presentation,'proto23-shell');assert.equal(s.parity,'r3');assert.equal(s.menu,'proto23-parity');assert.deepEqual(s.keys,{parity:null,shell:null});assert.deepEqual(p.errors,[]);await ctx.close();return s;});
    await run('stored classic choice stays classic',async()=>{const {ctx,p}=await open(b,{[P]:'off',[S]:'off'});const s=await state(p);
        assert.equal(s.presentation,'');assert.equal(s.parity,'');assert.equal(s.menu,'existing');assert.deepEqual(p.errors,[]);await ctx.close();return s;});
    await run('stored plain shell choice stays plain shell',async()=>{const {ctx,p}=await open(b,{[P]:'off',[S]:'on'});const s=await state(p);
        assert.equal(s.presentation,'proto23-shell');assert.equal(s.parity,'');assert.equal(s.menu,'proto23-shell');await ctx.close();return s;});
    await run('stored parity choice stays parity',async()=>{const {ctx,p}=await open(b,{[P]:'on'});const s=await state(p);
        assert.equal(s.parity,'r3');assert.equal(s.menu,'proto23-parity');await ctx.close();return s;});
    await run('Layout menu switches default to classic and the choice survives reload',async()=>{const {ctx,p}=await open(b,{});
        await p.evaluate(()=>{const s=document.querySelector('[data-workspace-action=presentation]');s.value='existing';s.dispatchEvent(new Event('change',{bubbles:true}));});await p.waitForTimeout(400);
        const after=await state(p);assert.equal(after.presentation,'');assert.deepEqual(after.keys,{parity:'off',shell:'off'});
        await p.reload({waitUntil:'domcontentloaded'});await ready(p);await L.R.startFresh(p).catch(()=>{});await p.waitForTimeout(400);
        const reloaded=await state(p);assert.equal(reloaded.presentation,'');assert.equal(reloaded.menu,'existing');
        await p.evaluate(()=>{const s=document.querySelector('[data-workspace-action=presentation]');s.value='proto23-parity';s.dispatchEvent(new Event('change',{bubbles:true}));});await p.waitForTimeout(400);
        const back=await state(p);assert.equal(back.parity,'r3');assert.deepEqual(p.errors,[]);
        await p.screenshot({path:path.join(E,'default-fresh-1366x768-14.png')});await ctx.close();return{after,reloaded,back};});
    await run('narrow viewport (mobile deferred) opens without page errors',async()=>{const {ctx,p}=await open(b,{},{w:800,h:900});const s=await state(p);
        assert.equal(s.presentation,'proto23-shell');assert.deepEqual(p.errors,[]);await ctx.close();return s;});
}finally{await b.close();}
fs.writeFileSync(path.join(E,'check-r16-default.json'),JSON.stringify(results,null,1));
const failed=results.filter(r=>r.fail);console.log(failed.length?`FAILED ${failed.length}/${results.length}`:`ALL PASS ${results.length}/${results.length}`);process.exit(failed.length?1:0);})();
