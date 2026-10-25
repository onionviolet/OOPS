const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root=process.cwd(),dir=root+'/docs/gm/dispatch/lotm-q6-2026-10-25/evidence',baselines=JSON.parse(fs.readFileSync(dir+'/baseline-inputs.json'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url='http://127.0.0.1:5111/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,url);if(u.pathname==='/'){
 let s=fs.readFileSync(root+'/index.html','utf8');if(u.searchParams.has('baseline'))s=s.replace(/dist\/bundle\.js\?version=[^"&]+/,`baseline-${u.searchParams.get('baseline')}.js`);res.setHeader('content-type','text/html');return res.end(s);}
 const baseline=baselines.find(b=>u.pathname===`/baseline-${b.name}.js`),file=baseline?.bundle||path.join(root,decodeURIComponent(u.pathname));
 if((!baseline&&!file.startsWith(root+'/'))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const project=s=>({owner:s.expansion.lotm,actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`);
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:true}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}
async function captureMatrix(f){const {p}=f;const matrix=[];
 for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await p.setViewportSize({width,height});await p.evaluate(px=>{for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])document.documentElement.style.setProperty(k,px+'px');const panel=document.querySelector('#lotm_panel');for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])panel.style.setProperty(k,px+'px');panel.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
  await p.locator('[data-lotm-path]').scrollIntoViewIfNeeded();const geometry=await p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),b=n.getBoundingClientRect();return {pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,viewportWidth:innerWidth,viewportHeight:innerHeight,panelWidth:n.clientWidth,panelContentWidth:n.scrollWidth,actualFont:getComputedStyle(n).fontSize,paragraphFont:getComputedStyle(n.querySelector('p')).fontSize,back:[...document.querySelectorAll('button,a')].some(n=>n.textContent.includes('Tingen university area')&&n.getBoundingClientRect().height>0)}});
  assert.ok(geometry.pageWidth<=width+2);assert.ok(geometry.pageHeight<=height+2);assert.ok(geometry.panelContentWidth<=geometry.panelWidth+1);assert.equal(geometry.back,true);assert.equal(geometry.actualFont,px+'px');assert.equal(geometry.paragraphFont,px+'px');await p.screenshot({path:`${dir}/savant-${width}x${height}-${px}px.png`});matrix.push({width,height,px,...geometry});
 }
 return matrix;
}
module.exports={server,fixture,dir,sha,captureMatrix};
if(require.main===module)(async()=>{await new Promise((resolve,reject)=>server.listen(5111,'127.0.0.1',resolve).once('error',reject));const browser=await chromium.launch({headless:true,channel:'chrome'}),receipt={bundleSha256:sha(fs.readFileSync('dist/bundle.js')),oldSaves:process.argv.includes('--candidate-only')?JSON.parse(fs.readFileSync(dir+'/partial.json')).oldSaves:[],matrix:[],steps:[]};try{
 for(const baseline of process.argv.includes('--candidate-only')?[]:baselines){
  const old=await fixture(browser,baseline.name);await old.click('enroll');await old.click('book.lotm.report_in');await old.click('book.lotm.accept_allocation_cc');await old.click('book.lotm.ingest_cc');await old.click('book.lotm.act_laying_out');await old.ticks(10);
  const encoded=await old.p.evaluate(()=>save_to_file()),expected=project(await old.snap());const file=path.join(path.dirname(baseline.bundle),baseline.name+'-save.txt');fs.writeFileSync(file,encoded);assert.deepEqual(old.errors,[]);await old.c.close();
  const current=await fixture(browser);await current.importLiteral(encoded);assert.deepEqual(project(await current.snap()),expected,'committed old save import, ignoring empty registry inventory holders');assert.equal((await current.snap()).expansion.actors['book.lotm.evernight_deacon'],undefined,'no examiner backfill');await current.ticks(15);assert.equal((await current.snap()).expansion.actors.player.resources['book.lotm.cc.acting'],1,'old timed job finishes');
  assert.deepEqual(current.errors,[]);receipt.oldSaves.push({name:baseline.name,ref:baseline.ref,inputBundleSha256:baseline.sha256,literalSavePath:file,literalSaveSha256:sha(encoded),projectSha256:sha(JSON.stringify(expected)),unchangedOnImport:true,oldJobCompleted:true,noBackfill:true});await current.c.close();fs.writeFileSync(dir+'/partial.json',JSON.stringify(receipt,null,2)+'\n');
 }
 const f=await fixture(browser),{p,click,ticks,snap,button}=f;
 await click('enroll_machinery');await click('book.lotm.report_in_machinery');assert.match(await p.locator('#lotm_panel').innerText(),/Savant pathway/);
 await click('book.lotm.accept_allocation_sv');await click('book.lotm.ingest_sv');for(let n=0;n<3;n++){await click('book.lotm.act_study');await ticks(30);}await click('book.lotm.act_apply');await ticks(45);await click('book.lotm.request_prescreen_sv');
 const exam='book.lotm.request_exam_sv_role',key=JSON.stringify({id:'Tingen prepared Archaeologist dose'}),held=s=>s.inventories.person.main_character?.[key]?.count||0;
 assert.equal(held(await snap()),0);assert.equal(await button(exam).isDisabled(),false);assert.equal(await button('book.lotm.request_exam_sv').count(),0);
 fs.writeFileSync('/tmp/lotm-e1-preexam.txt',await p.evaluate(()=>save_to_file()));
 receipt.preExam=await f.roundtrip(()=>click(exam));
 // Literal synthetic reassignment models a role change after an eligible quote. All play remains via the native panel.
 const good=await p.evaluate(()=>save_to_file()),changed=await snap();changed.expansion.actors['book.lotm.senior_deacon'].facts['book.lotm.role']='captain';
 const encoded='YAIR-UTF8-1:'+Buffer.from(JSON.stringify(changed),'utf8').toString('base64');await f.importLiteral(encoded);assert.equal(await button(exam).isDisabled(),true);assert.match(await button(exam).getAttribute('title'),/senior deacon|supported/);
 await button(exam).scrollIntoViewIfNeeded();await p.screenshot({path:dir+'/stale-role-refusal.png'});receipt.refusal={fixture:'literal synthetic reassignment from senior_deacon to captain',inputSha256:sha(encoded),disabled:true,noDose:held(await snap())===0};
 await f.importLiteral(good);await click(exam);assert.equal(held(await snap()),0);fs.writeFileSync('/tmp/lotm-e1-pending.txt',await p.evaluate(()=>save_to_file()));receipt.pending=await f.roundtrip(()=>ticks(60));await ticks(60);fs.writeFileSync('/tmp/lotm-e1-after-exam.json',JSON.stringify(await snap()));assert.equal(held(await snap()),1);await click('book.lotm.ingest_archaeologist');assert.equal(held(await snap()),0);assert.match(await p.locator('#lotm_panel').innerText(),/Sequence 8 · Archaeologist/);
 receipt.promoted=await f.roundtrip(async()=>{await click('lotm.move.lodging');await ticks(15);});
 receipt.matrix=await captureMatrix(f);
 assert.deepEqual(f.errors,[]);receipt.errors=f.errors;receipt.steps=['native Machinery start and Savant allocation/ingestion','three study acts and one applied act','pre-screen gives no promotion dose','wrong examiner role refused in native UI','eligible exam reserved attention; pending job persists','senior-deacon examination releases one dose','native Archaeologist ingestion and persisted Sequence 8 ladder','exact master and C1 old-save literal import and old timed-job completion'];await f.c.close();
 // Nighthawk correction on a second connected native journey.
 const n=await fixture(browser);await n.click('enroll');await n.click('book.lotm.report_in');await n.click('book.lotm.accept_allocation_cc');await n.click('book.lotm.ingest_cc');for(let i=0;i<3;i++){await n.click('book.lotm.act_laying_out');await n.ticks(25);}await n.click('book.lotm.act_vigil');await n.ticks(60);await n.click('book.lotm.request_assessment_cc');
 const ccKey=JSON.stringify({id:'Tingen prepared Gravedigger dose'});assert.equal((await n.snap()).inventories.person.main_character?.[ccKey]?.count||0,0);assert.equal(await n.button('book.lotm.ingest_gravedigger').count(),0);await n.click('book.lotm.request_exam_cc');await n.ticks(60);await n.click('book.lotm.ingest_gravedigger');assert.match(await n.p.locator('#lotm_panel').innerText(),/Sequence 8 · Gravedigger/);receipt.nighthawk=await n.roundtrip(async()=>{await n.click('lotm.move.lodging');await n.ticks(10);});await n.p.screenshot({path:dir+'/nighthawk-promoted.png'});assert.deepEqual(n.errors,[]);await n.c.close();
 fs.writeFileSync(dir+'/result.json',JSON.stringify(receipt,null,2)+'\n');console.log('Q6 browser PASS');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
