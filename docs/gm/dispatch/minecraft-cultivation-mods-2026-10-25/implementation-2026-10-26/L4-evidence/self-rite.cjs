const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const repo=process.cwd(),root=process.env.ROOT,dir=__dirname,baselines=[];if(!root)throw Error('ROOT immutable build output required');
let origin;
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),url='http://127.0.0.1:0/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,url);if(u.pathname==='/'){
 let s=fs.readFileSync(root+'/index.html','utf8');if(u.searchParams.has('baseline'))s=s.replace(/dist\/bundle\.js\?version=[^"&]+/,`baseline-${u.searchParams.get('baseline')}.js`);res.setHeader('content-type','text/html');return res.end(s);}
 const baseline=baselines.find(b=>u.pathname===`/baseline-${b.name}.js`),file=baseline?.bundle||path.join(root,decodeURIComponent(u.pathname));
 if((!baseline&&!file.startsWith(root+'/'))||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const project=s=>({clock:s.expansion.clock,owner:s.expansion.lotm,actors:Object.fromEntries(Object.entries(s.expansion.actors).filter(([k])=>k==='player'||k.startsWith('book.lotm.'))),knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,inventory:Object.fromEntries(Object.entries(s.inventories.person).filter(([,v])=>Object.keys(v).length)),conditions:s.expansion.simulation.conditions,staminaToFull:s.character.stamina_to_full,energies:s.expansion.simulation.energies,powers:s.expansion.simulation.powers,faculties:s.expansion.simulation.faculties,people:s.expansion.simulation.people,claims:s.expansion.simulation.claims,money:s.character.money,location:s['current location']});
async function fixture(browser,baseline){
 const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.setDefaultNavigationTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'?lotm_probe=1&test_hooks=1'+(baseline?'&baseline='+baseline:''));await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
 const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
 const open=async()=>{if(await p.locator('#lotm_panel').isVisible())return;await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
 const button=id=>p.locator(`#lotm_panel [data-lotm="${id}"]`).first();
 const click=async id=>{await open();assert.equal(await button(id).isDisabled(),false,id);await button(id).click();console.log('clicked',id);};
 const ticks=n=>p.evaluate(n=>advanceTicks(n,{render:false}),n);
 const resume=async()=>{await p.waitForFunction(()=>window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());await open();};
 const importLiteral=async encoded=>{await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'e1-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await resume();};
 const roundtrip=async perturb=>{await p.evaluate(()=>saveProgress());const before=project(await snap());await p.reload();await resume();assert.deepEqual(project(await snap()),before,'Save/reload exact');const encoded=await p.evaluate(()=>save_to_file());const exported=project(await snap());await perturb();assert.notDeepEqual(project(await snap()),exported);await importLiteral(encoded);assert.deepEqual(project(await snap()),exported,'literal Import exact');return {exportChars:encoded.length,exportSha256:sha(encoded),projectSha256:sha(JSON.stringify(exported))};};
 await open();return {c,p,errors,snap,open,button,click,ticks,importLiteral,roundtrip};
}
// S5/A5 native proof: CC life -> rushed Sequence 8 (earned causes, purse-only fixture for the 12-pound dose) -> taught rite -> prepared unlit circle
// -> long pause -> pending lit rite (persistence) -> response -> completed (persistence) -> departure expiry refusal -> four desktop/font cases.
async function go(f,k){await f.click('lotm.move.'+k);await f.ticks(40);}
async function funded(f,pence){await f.p.evaluate(()=>saveProgress());await f.p.evaluate(n=>{const d=JSON.parse(localStorage.getItem('save data'));d.character.money=n;localStorage.setItem('save data',JSON.stringify(d));},pence);await f.p.reload();await f.p.waitForFunction(()=>window.simulationTestHooks);await f.p.evaluate(()=>simulationTestHooks.pause());await f.p.getByText('PLAY',{exact:true}).click();await f.p.evaluate(()=>simulationTestHooks.pause());await f.open();assert.equal((await f.snap()).character.money,pence);}
const PURSE=3000;
(async()=>{
 const privateDir=path.join(process.env.OUT||dir,'self-rite-proof');fs.mkdirSync(privateDir,{recursive:true});
 const result={bundleSha256:sha(fs.readFileSync(root+'/dist/bundle.js')),route:`Fresh Nighthawk Corpse Collector life; one named purse-only fixture (${PURSE} pence, no stock, knowledge, source, pressure or progress grants) pays the broker's posted 12-pound unmarked Sequence 8 dose. Every other step is a native click.`,persistence:[]};
 await new Promise((r,j)=>server.listen(0,'127.0.0.1',r).once('error',j));origin=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  const f=await fixture(browser),s=async()=>(await f.snap()).expansion,pressure=async()=>(await s()).actors.player.resources['book.lotm.pressure']||0;
  const att=async()=>(await s()).actors['book.lotm.supervisor'].resources['book.lotm.attention'];
  for(const id of ['enroll','book.lotm.report_in','book.lotm.accept_allocation_cc','book.lotm.ingest_cc'])await f.click(id);
  await funded(f,PURSE);await go(f,'docks');
  for(const t of ['pay','verify','settle'])await f.click(`book.lotm.lot_${t}_dose8_cc`);
  await f.click('book.lotm.drink_market_cc8');assert.equal(await pressure(),5);await go(f,'workroom');
  assert.match(await f.p.locator('#lotm_panel').textContent(),/Pre-signs/);
  const n=await att();await f.click('book.lotm.rit_self_learn');assert.equal(await att(),n-1);await f.ticks(5);assert.equal(await att(),n);
  const money0=(await f.snap()).character.money;await f.click('book.lotm.rit_self_prepare');await f.ticks(10);
  assert.equal((await f.snap()).character.money,money0-12);assert.equal(await att(),n);
  assert.equal(await f.button('book.lotm.rit_self_prepare').isDisabled(),true,'one unlit circle at a time');
  await f.ticks(600);assert.equal(await f.button('book.lotm.rit_self_light_body').isDisabled(),false,'the unlit pause has no deadline');
  const debt0=(await f.snap()).character.stamina_to_full;await f.click('book.lotm.rit_self_light_body');
  assert.equal((await f.snap()).character.stamina_to_full,debt0+3,'actual native body reservation');assert.equal(await att(),n-1);await f.ticks(2);assert.equal(await pressure(),5);
  result.persistence.push({state:'rite pending',...await f.roundtrip(()=>f.click('cancel'))});
  await f.ticks(3);assert.equal(await pressure(),4);assert.equal(await att(),n);
  const k=(await s()).simulation.knowledge.player;assert.ok(k['book.lotm.rit.self.response'].at>=k['book.lotm.rit.self.prepared'].at);
  assert.equal(await f.button('book.lotm.rit_self_light_body').isDisabled(),true,'no replay of the used circle');
  result.persistence.push({state:'rite completed',...await f.roundtrip(()=>f.click('lotm.move.lodging'))});
  assert.equal(await pressure(),4);
  await f.click('book.lotm.rit_self_prepare');await f.ticks(10);assert.equal(await f.button('book.lotm.rit_self_light_body').isDisabled(),false);
  await go(f,'lodging');await go(f,'workroom');
  assert.equal(await f.button('book.lotm.rit_self_light_body').isDisabled(),true,'a walk away ends the circle');
  const refusal=await f.p.locator('#lotm_panel').textContent();assert.match(refusal,/returning does not revive it/);
  const shots=[];
  for(const [width,height,px] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
   await f.p.setViewportSize({width,height});await f.p.evaluate(px=>{const n=document.querySelector('#lotm_panel');for(const el of [document.documentElement,n])for(const k of ['--ui-type-body','--ui-type-small','--ui-type-title','--custom-size','--custom-small-size'])el.style.setProperty(k,px+'px');n.style.fontSize=px+'px';document.body.style.fontSize=px+'px';},px);
   await f.button('book.lotm.rit_self_light_body').scrollIntoViewIfNeeded();
   const geometry=await f.p.evaluate(()=>{const n=document.querySelector('#lotm_panel'),b=n.querySelector('[data-lotm="book.lotm.rit_self_light_body"]');return {pageWidth:document.documentElement.scrollWidth,panelWidth:n.clientWidth,panelContentWidth:n.scrollWidth,font:getComputedStyle(b).fontSize};});
   assert.ok(geometry.pageWidth<=width+2);assert.ok(geometry.panelContentWidth<=geometry.panelWidth+1);assert.equal(geometry.font,px+'px');
   const file=`self-rite-${width}-${px}.png`;await f.p.screenshot({path:privateDir+'/'+file});shots.push({width,height,px,geometry,file});
  }
  result.matrix=shots;result.pressure={afterCauses:5,afterRite:4};result.errors=f.errors;assert.deepEqual(f.errors,[]);
  fs.writeFileSync(dir+'/self-rite-result.json',JSON.stringify(result,null,2)+'\n');
  await f.c.close();console.log('PASS self rite: earned causes, taught/prepared/paused/lit/expired, literal persistence pending+completed, four desktop/font cases');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
