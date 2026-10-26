const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const root=process.cwd(),dir=root+'/docs/gm/dispatch/master-reconciliation-2026-10-25/guidance-evidence',baselines=[];
let origin;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url='http://127.0.0.1:0/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,url);if(u.pathname==='/'){
 let s=fs.readFileSync(root+'/index.html','utf8');if(u.searchParams.has('baseline'))s=s.replace(/dist\/bundle\.js\?version=[^"&]+/,`baseline-${u.searchParams.get('baseline')}.js`);res.setHeader('content-type','text/html');return res.end(s);}
 const baseline=baselines.find(b=>u.pathname===`/baseline-${b.name}.js`),file=baseline?.bundle||path.join(root,decodeURIComponent(u.pathname));
 if((!baseline&&!file.startsWith(root+'/'))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const project=s=>({owner:s.expansion.lotm,actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),energies:s.expansion.simulation.energies,powers:s.expansion.simulation.powers,faculties:s.expansion.simulation.faculties,people:s.expansion.simulation.people,claims:s.expansion.simulation.claims,money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`);
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:false}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}
const expectedBundle='4987a62a2f3b22f1f31b574f2e5ef0f35379db11142873a6407c6ccfbd98ee8f';
const guidance=f=>f.p.locator('[data-lotm-acting-guidance]');
async function noSpendFind(f,find,target){
 const before=project(await f.snap());await f.click(find);
 assert.deepEqual(project(await f.snap()),before,'find changes no gameplay');
 const focused=await f.p.evaluate(id=>document.activeElement?.querySelector('[data-lotm]')?.dataset.lotm===id,target);
 assert.equal(focused,true,'existing command row receives focus');
}
async function sleep(f){await f.click('lotm.move.lodging');await f.ticks(10);await f.click('book.lotm.sleep');await f.ticks(120);await f.click('lotm.move.workroom');await f.ticks(10);}
async function matrix(f){const results=[];
 for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
  await guidance(f).scrollIntoViewIfNeeded();
  const geometry=await f.p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),g=n.querySelector('[data-lotm-acting-guidance]');const shown=e=>!!e&&e.getBoundingClientRect().height>0;return {pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,panelWidth:n.clientWidth,panelContentWidth:n.scrollWidth,font:getComputedStyle(g.querySelector('p')).fontSize,rowFont:getComputedStyle(g.querySelector('span')).fontSize,report:shown(document.querySelector('#message_log_div')),back:[...document.querySelectorAll('button,a')].filter(shown).map(n=>n.textContent).filter(s=>s.includes('Tingen supervised workroom')||s.includes('←'))};});
  assert.ok(geometry.pageWidth<=width+2);assert.ok(geometry.pageHeight<=height+2);assert.ok(geometry.panelContentWidth<=geometry.panelWidth+1);assert.equal(geometry.font,px+'px');assert.equal(geometry.rowFont,px+'px');assert.equal(geometry.report,true);assert.ok(geometry.back.length);
  const screenshot=`guidance-${width}x${height}-${px}px.png`;await f.p.screenshot({path:dir+'/'+screenshot});results.push({width,height,px,...geometry,screenshot,sha256:sha(fs.readFileSync(dir+'/'+screenshot))});
 }
 return results;
}
(async()=>{assert.equal(sha(fs.readFileSync('dist/bundle.js')),expectedBundle);await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;const browser=await chromium.launch({headless:true,channel:'chrome'}),result={bundleSha256:expectedBundle,indexSha256:sha(fs.readFileSync('index.html')),origin,sourceDigest:'combined reconciliation build; see CHECKPOINT.md',persistence:[]};
 try{
  if(process.argv.includes('--navigation-only')){
   const f=await fixture(browser);await f.importLiteral(fs.readFileSync(dir+'/pre-matrix-earned.txt','utf8'));
   const before=project(await f.snap()),find=f.button('find_book.lotm.act_reading');await find.focus();await find.press('Enter');
   assert.equal(await f.p.evaluate(()=>document.activeElement?.querySelector('[data-lotm]')?.dataset.lotm),'book.lotm.act_reading');
   await f.p.keyboard.press('Escape');assert.equal(await f.p.locator('#center_mode_navigation').isVisible(),false);assert.deepEqual(project(await f.snap()),before);
   await f.p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await guidance(f).waitFor({state:'visible'});
   await f.p.locator('#center_mode_back').click();assert.equal(await f.p.locator('#center_mode_navigation').isVisible(),false);assert.deepEqual(project(await f.snap()),before);
   assert.deepEqual(f.errors,[]);const saved=JSON.parse(fs.readFileSync(dir+'/result.json'));saved.navigation={keyboardFind:true,escape:true,bottomBack:true,noGameplayDelta:true,errors:f.errors};fs.writeFileSync(dir+'/result.json',JSON.stringify(saved,null,2)+'\n');await f.c.close();console.log('PASS keyboard Find, Esc and bottom Back on earned imported state');return;
  }
  const f=await fixture(browser);await f.click('enroll');assert.equal(await guidance(f).count(),0);await f.click('book.lotm.report_in');await f.click('book.lotm.accept_allocation');await f.click('book.lotm.ingest');assert.equal(await guidance(f).count(),0);await f.click('book.lotm.lesson');await f.ticks(5);
  assert.match(await guidance(f).innerText(),/hedged reading/);assert.match(await guidance(f).innerText(),/Refuse a ledger request/);assert.doesNotMatch(await guidance(f).innerText(),/Savant|Corpse Collector|university|docks/);
  await noSpendFind(f,'find_book.lotm.act_reading','book.lotm.act_reading');await f.click('book.lotm.act_reading');assert.match(await guidance(f).innerText(),/In progress; not counted yet/);
  const acting=async()=>((await f.snap()).expansion.actors.player.resources['book.lotm.acting']||0);assert.equal(await acting(),0);
  result.persistence.push({state:'pending',...await f.roundtrip(()=>f.click('cancel'))});assert.match(await guidance(f).innerText(),/In progress/);await f.click('cancel');assert.equal(await acting(),0);assert.doesNotMatch(await guidance(f).innerText(),/In progress/);
  await f.click('book.lotm.act_reading');await f.ticks(10);assert.equal(await acting(),1);
  result.persistence.push({state:'completed reading',...await f.roundtrip(()=>f.click('lotm.move.lodging'))});assert.equal(await acting(),1);
  await f.click('lotm.move.lodging');await f.ticks(10);assert.match(await guidance(f).innerText(),/hedged reading/);assert.doesNotMatch(await guidance(f).innerText(),/Refuse a ledger|university|docks/);await noSpendFind(f,'find_lotm.move.workroom_book.lotm.act_reading','lotm.move.workroom');
  await f.click('book.lotm.sleep');await f.ticks(120);await f.click('lotm.move.workroom');await f.ticks(10);
  fs.writeFileSync(dir+'/pre-matrix-earned.txt',await f.p.evaluate(()=>save_to_file()));fs.writeFileSync(dir+'/partial.json',JSON.stringify(result,null,2)+'\n');result.matrix=await matrix(f);
  for(let n=0;n<3;n++){await f.click('book.lotm.act_reading');await f.ticks(10);}assert.equal(await acting(),4);assert.equal(await f.button('book.lotm.act_reading').isDisabled(),true);await noSpendFind(f,'find_book.lotm.act_reading','book.lotm.act_reading');
  await f.click('book.lotm.act_refusal');assert.equal(await acting(),5);assert.match(await guidance(f).innerText(),/Already completed/);
  await sleep(f);await f.click('book.lotm.act_reading');await f.ticks(10);assert.equal(await acting(),6);assert.equal(await guidance(f).count(),0);assert.match(await f.p.locator('#lotm_panel').innerText(),/potion feels settled/);assert.equal(await f.button('book.lotm.request_assessment').isDisabled(),false);await f.click('book.lotm.request_assessment');
  result.seer={earned:true,inspectionNoSpend:true,focus:true,pendingCancelledCompleted:true,rememberedReturn:true,ineligible:true,settledAssessment:true,errors:f.errors};assert.deepEqual(f.errors,[]);await f.c.close();
  const sv=await fixture(browser);for(const id of ['enroll_machinery','book.lotm.report_in_machinery','book.lotm.accept_allocation_sv','book.lotm.ingest_sv'])await sv.click(id);
  assert.match(await guidance(sv).innerText(),/Study the team/);assert.match(await guidance(sv).innerText(),/Apply what you studied/);assert.doesNotMatch(await guidance(sv).innerText(),/hedged reading|Refuse a ledger|shroud/);await noSpendFind(sv,'find_book.lotm.act_study','book.lotm.act_study');await sv.click('book.lotm.act_study');await sv.ticks(30);assert.equal((await sv.snap()).expansion.actors.player.resources['book.lotm.sv.acting'],1);await sv.p.screenshot({path:dir+'/savant-known.png'});result.savant={earned:true,isolated:true,completed:1,errors:sv.errors};assert.deepEqual(sv.errors,[]);await sv.c.close();
  assert.equal(sha(fs.readFileSync('dist/bundle.js')),expectedBundle);fs.writeFileSync(dir+'/result.json',JSON.stringify(result,null,2)+'\n');console.log('PASS native guidance, two persistence checkpoints, four desktop/text cases, second pathway');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
