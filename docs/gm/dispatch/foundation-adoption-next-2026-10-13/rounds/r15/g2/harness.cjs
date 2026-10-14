// R15 G2 native harness. Serves the rebuilt worktree bundle on 127.0.0.1:19120,
// drives headless Chrome (1600x1100) with a disposable profile under /private/tmp,
// and accepts step scripts on 127.0.0.1:19121 (POST body = async JS run in this scope).
// Usage: node harness.cjs <profile-suffix>
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../../../..'),out=path.join(__dirname,'evidence'),PORT=19120;
fs.mkdirSync(out,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mime={'.js':'application/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)||name.startsWith('/private_packs/')||name.startsWith('/docs/research/novels/')){res.writeHead(404);return res.end();}
 fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(b);});});
let ctx,page;const log={errors:[],console:[],loaded:[]};
const built=()=>sha(fs.readFileSync(path.join(root,'dist/bundle.js')));
const P='feature_society.';
const raw=async()=>page.evaluate(()=>localStorage.getItem('save data'));
async function save(label){await page.locator('#save_button').click();await page.waitForTimeout(150);const s=JSON.parse(await raw());if(label)fs.writeFileSync(path.join(out,label+'.json'),JSON.stringify(s));return s;}
const peek=async()=>JSON.parse(await raw());
async function play(){const b=page.locator('#loading_screen_play_button');await b.waitFor({state:'visible',timeout:30000});await page.waitForTimeout(300);await b.click();if(await page.locator('#hero_creation_panel_confirmation').isVisible().catch(()=>false))await page.locator('#hero_creation_panel_confirmation').click();await page.waitForTimeout(400);}
async function exportFile(label){const d=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const file=path.join(out,label+'.txt');await(await d).saveAs(file);return file;}
async function importFile(file){await Promise.all([page.waitForEvent('domcontentloaded',{timeout:30000}),page.locator('#saved_file_input').setInputFiles(file)]);await play();}
async function reload(){await page.reload({waitUntil:'domcontentloaded'});await play();}
async function panels(){if(!await page.locator('#notebook_box_div').isVisible())await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="here"]').click();const panel=page.locator('#feature_expansion_panel');if(await panel.count()&&!await panel.evaluate(n=>n.open))await panel.locator(':scope > summary').click();}
async function row(id){await panels();const r=page.locator(`[data-action-legibility-key="action:${id}"]`).first();await r.waitFor({state:'attached',timeout:8000});const d=r.locator('xpath=ancestor::details[1]');if(await d.count()&&!await d.evaluate(n=>n.open))await d.locator(':scope > summary').click();return r;}
async function act(id,{keyboard=false}={}){const r=await row(id);const pr=r.locator('.action-legibility__primary');const b=await pr.count()?pr.first():r.locator('button').first();
 if(await b.isDisabled())throw Error('disabled '+id+': '+(await r.innerText()));if(keyboard){await b.focus();await b.press('Enter');}else await b.click();await page.waitForTimeout(200);return (await peek()).expansion.clock;}
async function rowText(id){try{return (await (await row(id)).innerText()).replace(/\s+/g,' ');}catch{return null;}}
async function exists(id){await panels();return await page.locator(`[data-action-legibility-key="action:${id}"]`).count()>0;}
async function clockAtLeast(target,timeout=120000){await page.waitForFunction(t=>{try{return JSON.parse(localStorage.getItem('save data')).expansion.clock>=t;}catch{return false;}},target,{timeout,polling:250});return (await peek()).expansion.clock;}
async function ticks(n){const c=(await peek()).expansion.clock;return clockAtLeast(c+n,n*4000+20000);}
const inv=(s,id)=>s.inventories.person.main_character[JSON.stringify({id})]?.count||0;
const cursor=s=>s.expansion.simulation.workPlans?.cursors?.player||null;
const pjobs=s=>s.expansion.simulation.jobs.filter(j=>j.actorId==='player').map(j=>({id:j.id,commandId:j.commandId,startedAt:j.startedAt,due:j.due}));
function summary(s,ids=[]){return {clock:s.expansion.clock,money:s.character.money,stamina_to_full:s.character.stamina_to_full,hp_to_full:s.character.hp_to_full,location:s['current location'],
 items:Object.fromEntries(ids.map(i=>[i,inv(s,i)])),jobs:pjobs(s),cursor:cursor(s)&&{definitionId:cursor(s).definitionId,status:cursor(s).status,index:cursor(s).index,reason:cursor(s).reason,accepted:cursor(s).accepted&&{commandId:cursor(s).accepted.commandId,due:cursor(s).accepted.due},stockHold:cursor(s).stockHold,stockAcceptedBatches:cursor(s).stockAcceptedBatches},
 program:s.expansion.simulation.programs?.player||null};}
// Same comparison owner as R4 coherent(): stock, money, body, actors, RNG, clock, jobs, plans, sites, calendar.
function coherent(a,b){const d=[];const eq=(x,y,f)=>{try{assert.deepEqual(x,y);}catch{d.push(f);}};
 eq(b.character.money,a.character.money,'money');eq(b.inventories,a.inventories,'inventories');eq(b.expansion.actors,a.expansion.actors,'actors');
 for(const f of ['workPlans','programs','owners','people','jobs','knowledge','claims','powers','conditions','sites','equipment','custody','sessions','situations'])eq(b.expansion.simulation[f],a.expansion.simulation[f],'simulation.'+f);
 eq(b.expansion.rng,a.expansion.rng,'rng');eq(b.expansion.clock,a.expansion.clock,'clock');eq(b.expansion.referenceGameplay,a.expansion.referenceGameplay,'referenceGameplay');
 for(const f of ['hp_to_full','stamina_to_full','name'])eq(b.character[f],a.character[f],'character.'+f);eq(b['current time'],a['current time'],'calendar');eq(b['current location'],a['current location'],'location');return d;}
// Save, Export, reload compare, literal-file Import compare. Clock-frozen states only (paused/held/no jobs) compare exactly;
// for live states the harness pauses time first via the native pause if available.
async function restoration(label){const before=await save(label+'-saved');const file=await exportFile(label);await reload();const reloaded=await save(label+'-reloaded');
 await importFile(file);const imported=await save(label+'-imported');const r={label,file:path.basename(file),fileSha:sha(fs.readFileSync(file)),reloadDiff:coherent(before,reloaded),importDiff:coherent(before,imported),clocks:[before.expansion.clock,reloaded.expansion.clock,imported.expansion.clock]};
 const all=JSON.parse(fs.existsSync(path.join(out,'RESTORATIONS.json'))?fs.readFileSync(path.join(out,'RESTORATIONS.json'),'utf8'):'[]');all.push(r);fs.writeFileSync(path.join(out,'RESTORATIONS.json'),JSON.stringify(all,null,1));return r;}
async function shot(label){await page.screenshot({path:path.join(out,label+'.png')});}
const TRACE=()=>{window.__writes=[];window.__quota=0;const o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data'&&window.__quota>0){window.__quota--;window.__writes.push({at:Date.now(),rejected:true});throw new DOMException('Injected test quota','QuotaExceededError');}const r=o.call(this,k,v);if(k==='save data'){try{const s=JSON.parse(v);window.__writes.push({at:Date.now(),clock:s.expansion?.clock,stamina_to_full:s.character?.stamina_to_full,seq:s.expansion?.sequence,jobs:(s.expansion?.simulation?.jobs||[]).filter(j=>j.actorId==='player').map(j=>j.commandId+'@'+j.due),cursor:s.expansion?.simulation?.workPlans?.cursors?.player?.status+"/"+s.expansion?.simulation?.workPlans?.cursors?.player?.index,prog:s.expansion?.simulation?.programs?.player?.status+"/"+s.expansion?.simulation?.programs?.player?.remaining,money:s.character?.money,inv:s.inventories?.person?.main_character});}catch{}if(window.__writes.length>400)window.__writes.shift();}return r;};};
async function boot(suffix){
 await new Promise(r=>server.listen(PORT,'127.0.0.1',r));
 const dir='/private/tmp/r15-g2-profile-'+suffix;fs.rmSync(dir,{recursive:true,force:true});
 ctx=await chromium.launchPersistentContext(dir,{channel:'chrome',headless:true,viewport:{width:1600,height:1100},acceptDownloads:true});
 page=ctx.pages()[0]||await ctx.newPage();page.setDefaultTimeout(15000);
 await page.addInitScript(TRACE);
 page.on('pageerror',e=>log.errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))log.console.push(m.text().slice(0,300));});
 page.on('response',async r=>{if(r.url().includes('/dist/bundle.js')&&r.status()===200){try{log.loaded.push({url:r.url(),sha:sha(await r.body())});}catch{}}});
 page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:'+PORT+'/',{waitUntil:'domcontentloaded'});await play();
 return {built:built(),loaded:log.loaded.at(-1)};
}
async function close(){await ctx?.close();ctx=null;}
async function quit(){await close();setTimeout(()=>process.exit(0),200);return "bye";}
async function boot2(fix){await importFile(fixture(fix));}
async function reopen(suffix){ctx=await chromium.launchPersistentContext('/private/tmp/r15-g2-profile-'+suffix,{channel:'chrome',headless:true,viewport:{width:1600,height:1100},acceptDownloads:true});page=ctx.pages()[0]||await ctx.newPage();page.setDefaultTimeout(15000);await page.addInitScript(TRACE);
 page.on('pageerror',e=>log.errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto('http://127.0.0.1:'+PORT+'/',{waitUntil:'domcontentloaded'});await play();}
// Native travel row (same onclick a player triggers from the travel dropdown); waits for arrival.
async function travel(dest){await page.evaluate(d=>{const n=[...document.querySelectorAll('[data-travel]')].find(n=>n.dataset.travel===d);if(!n)throw Error('no travel row '+d);n.click();},dest);
 await page.waitForFunction(d=>JSON.parse(localStorage.getItem('save data'))['current location']===d,dest,{timeout:90000});await page.waitForTimeout(500);}
// Personal chest at a housing location: click the inventory row once per item moved (native storage transfer).
async function chest(id,count,direction='deposit'){await page.evaluate(()=>document.getElementById('open_storage_div').click());await page.waitForTimeout(400);
 const sel=direction==='deposit'?`[data-character_item='${JSON.stringify({id})}']`:`[data-storage_item='${JSON.stringify({id})}']`;
 for(let i=0;i<count;i++){await page.locator(sel).first().click();await page.waitForTimeout(300);}
 await page.locator('text=Exit').first().click().catch(()=>{});await page.waitForTimeout(300);}
const jobs={};function bg(name,fn){jobs[name]={done:false};fn().then(v=>{jobs[name]={done:true,value:v};},e=>{jobs[name]={done:true,error:String(e.stack).slice(0,1500)};});return 'started '+name;}
const record=(name,data)=>{fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(data,null,1));return data;};
const fixture=n=>path.join(__dirname,'fixture','TEST-FIXTURE-R15-G2-'+n+'.txt');
(async()=>{const info=await boot(process.argv[2]||'main');console.log('BOOT',JSON.stringify(info));
 http.createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;try{const value=await eval('(async()=>{'+body+'})()');res.end(JSON.stringify({ok:true,value:value??null},null,1));}catch(e){res.end(JSON.stringify({ok:false,error:String(e.stack).slice(0,2000)}));}}).listen(19121,'127.0.0.1',()=>console.log('READY'));})();
