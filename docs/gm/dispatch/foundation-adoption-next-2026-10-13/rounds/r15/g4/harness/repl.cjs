// R15 G4 interactive browser driver. Serves nothing itself: the rebuilt
// worktree is served separately on 127.0.0.1:19140. This process opens a
// headless Chrome (1600x1100) on a fresh profile and exposes an eval endpoint on
// 19141 so steps can be driven one at a time and retried. Usage:
//   node repl.cjs <profileDir>
//   curl -s --data-binary @step.js http://127.0.0.1:19141/
// Step bodies run with `page`, `ctx`, `h` (helpers below) and `fs` in scope.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),crypto=require('node:crypto');
const profile=process.argv[2]||'/private/tmp/r15-g4-profile';
const evidence=process.argv[3]?path.resolve(process.argv[3],'evidence'):path.resolve(__dirname,'../evidence');
fs.mkdirSync(evidence,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let ctx,page;let queue=Promise.resolve();const errors=[],loaded=[],logs=[];
const h={
  hash,evidence,errors,loaded,logs,
  saved:()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dev save data')||localStorage.getItem('save data')||'null')),
  key:()=>page.evaluate(()=>localStorage.getItem('dev save data')?'dev save data':localStorage.getItem('save data')?'save data':null),
  playVisible:()=>page.locator('#loading_screen_play_button').isVisible(),
  async play(){if(await h.playVisible())await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(500);},
  async waitPlay(){for(let i=0;i<60;i++){if(await h.playVisible())return;await page.clock.fastForward(500);await page.waitForTimeout(250);}throw Error('PLAY never visible');},
  async reload(){await page.reload({waitUntil:'domcontentloaded'});await h.waitPlay();},
  async importFile(file){await page.locator('#saved_file_input').evaluate(e=>e.value='');const nav=page.waitForEvent('domcontentloaded',{timeout:60000});await page.locator('#saved_file_input').setInputFiles(file);await nav;await h.waitPlay();await h.reload();},
  async save(){const start=logs.length;await page.locator('#save_button').click();await page.waitForTimeout(300);if(logs.slice(start).some(m=>m.type==='error'&&/saving|save file|saving disabled/i.test(m.text)))throw Error('Save failed: '+JSON.stringify(logs.slice(start)));const s=await h.saved();if(!s)throw Error('No durable save');return s;},
  async exportFile(name){const down=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const d=await down;const file=path.join(evidence,name);await d.saveAs(file);return {file,sha256:hash(fs.readFileSync(file))};},
  groups:s=>({character:s.character,inventories:s.inventories,expansion:s.expansion,time:s['current time'],location:s['current location'],npcs:s.npcs,npc_equipment:s.npc_equipment}),
  same:(a,b)=>JSON.stringify(h.groups(a))===JSON.stringify(h.groups(b)),
  diff(a,b){const out=[];for(const k of Object.keys(h.groups(a)))if(JSON.stringify(h.groups(a)[k])!==JSON.stringify(h.groups(b)[k]))out.push(k);return out;},
  // Clicks a visible button whose accessible name contains `text`.
  async click(text,{exact=false,nth=0}={}){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));const b=page.getByRole('button',{name:text,exact}).filter({visible:true});const n=await b.count();if(n<=nth)throw Error(`No visible button "${text}" (${n})`);if(!await b.nth(nth).isEnabled())throw Error('Disabled button: '+text);await b.nth(nth).scrollIntoViewIfNeeded();await b.nth(nth).evaluate(el=>el.click());await page.waitForTimeout(250);},
  buttons:async(filter='')=>page.evaluate(f=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.innerText.toLowerCase().includes(f.toLowerCase())).map(b=>(b.disabled?'[x] ':'')+b.innerText.replace(/\s+/g,' ').trim()+(b.title?' |'+b.title.slice(0,160):'')),filter),
  text:async(sel='body')=>page.locator(sel).innerText(),
  shot:async name=>page.screenshot({path:path.join(evidence,name)}),
  // Runs the real game loop for about `minutes` played minutes (1 tick/second).
  async advance(minutes){for(let i=0;i<minutes;i++){await page.clock.fastForward(1000);}await page.waitForTimeout(200);},
  clock:async()=>(await h.save()).expansion.clock,
  async tap(t,{exact=true,nth=0}={}){const l=page.getByText(t,{exact}).filter({visible:true});const n=await l.count();if(n<=nth)throw Error('No visible text '+t+' ('+n+')');await l.nth(nth).click();await page.waitForTimeout(300);},
  async section(title,n=60){const t=await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);return document.body.innerText});const lines=t.split('\n').filter(l=>l.trim());const i=lines.findIndex(l=>l.includes(title));return i<0?null:lines.slice(i,i+n);},
  // Compact state digest for evidence rows.
  digest(s,actors=[]){const e=s.expansion,inv=s.inventories.person.main_character,c=k=>inv[JSON.stringify({id:k})]?.count||0;
    return {clock:e.clock,time:s['current time'],money:s.character.money,logs:c('Rough wood log'),kits:c('Prepared survey kit'),sap:c('Tree sap'),herbs:c('Cooking herbs'),
      jobs:e.simulation.jobs.map(j=>({id:j.id,cmd:j.commandId,actor:j.actorId,due:j.due})),
      actors:Object.fromEntries(actors.map(a=>[a,{resources:e.actors[a]?.resources,owners:e.simulation.owners[a],stamina:e.simulation.people[a]?.vitals?.stamina,completed:e.actors[a]?.completed}]))};},
  write:(name,data)=>fs.writeFileSync(path.join(evidence,name),typeof data==='string'?data:JSON.stringify(data,null,2)),
};
(async()=>{
  ctx=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1600,height:1100},acceptDownloads:true});
  page=ctx.pages()[0]||await ctx.newPage();page.setDefaultTimeout(15000);
  await (await ctx.newCDPSession(page)).send('Network.setCacheDisabled',{cacheDisabled:true});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>logs.push({type:m.type(),text:m.text()}));page.on('dialog',d=>d.accept());
  page.on('response',async r=>{if(r.status()===200&&r.url().includes('/dist/bundle.js'))loaded.push({url:r.url(),sha256:hash(await r.body())});});
  // HackTimer moves setTimeout into a Worker (a background-tab throttling
  // workaround). Serving it empty leaves the page's own timers in place so
  // Playwright's fake clock can pause the game loop and run its real ticks
  // faster (h.advance). Game code and the tick function are unchanged.
  await page.route('**/HackTimer.min.js*',r=>r.fulfill({status:200,contentType:'text/javascript',body:'/* R15 G4 harness: HackTimer disabled */'}));
  await page.clock.install();
  await page.goto('http://127.0.0.1:19140/',{waitUntil:'domcontentloaded'});
  await page.clock.pauseAt(Date.now()+1000);
  http.createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;
    const task=queue.then(()=>eval('(async()=>{'+body+'})()'));queue=task.catch(()=>{});try{const value=await task;res.end(JSON.stringify({ok:true,value:value??null},null,1));}
    catch(e){res.end(JSON.stringify({ok:false,error:String(e.stack||e).slice(0,3000)}));}}).listen(19141,'127.0.0.1');
  console.log('READY',profile);
})();
