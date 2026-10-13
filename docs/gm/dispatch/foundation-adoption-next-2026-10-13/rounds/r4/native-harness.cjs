const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),http=require('http'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=process.cwd(),out=__dirname,port=18729,fixture=process.argv[2];

const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bundle=sha(fs.readFileSync('dist/bundle.js'));
const mime={'.js':'application/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],file=path.resolve(root,'.'+(name==='/'?'/index.html':decodeURIComponent(name)));if(!file.startsWith(root+path.sep)||name.startsWith('/private_packs/')||name.startsWith('/docs/research/novels/')){res.writeHead(404);return res.end();}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b);});});
const secondary=false;
const priorProof=secondary?JSON.parse(fs.readFileSync(out+'/attempts/primary-with-cancel-selector-error.json','utf8')):null;
if(priorProof)assert.equal(priorProof.bundle,bundle);
const result={status:'RUNNING',bundle,base:'dd3efe3383f12f0aac22e4f390aae90fae2e7fc4',fixture,fixtureHash:null,checks:priorProof?.checks||{},events:[],errors:[],timePolicy:'Normal native browser timers; no resource/history/clock fields injected',console:[]};
let browser,activePage;
const P='feature_society.',O=P+'orr',H=P+'hessa',key=n=>JSON.stringify({id:n});
const LOG=key('Rough wood log'),KIT=key('Prepared survey kit');
async function save(p,label){await p.locator('#save_button').click();const s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));fs.writeFileSync(out+'/'+label+'.json',JSON.stringify(s));return s;}
async function exportFile(p,label){const pending=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=out+'/'+label+'.txt';await(await pending).saveAs(file);return file;}
async function play(p){await p.locator('#loading_screen_play_button:not(.none_display)').click();if(await p.locator('#hero_creation_panel_confirmation').isVisible())await p.locator('#hero_creation_panel_confirmation').click();}
async function importFile(p,file){await Promise.all([p.waitForEvent('domcontentloaded'),p.locator('#saved_file_input').setInputFiles(file)]);await play(p);}
async function panels(p){if(!await p.locator('#notebook_box_div').isVisible())await p.locator('#journal_show_notebook').click();await p.locator('[data-notebook-view="here"]').click();const panel=p.locator('#feature_expansion_panel');if(!await panel.evaluate(n=>n.open))await panel.locator(':scope > summary').click();}
async function action(p,id,keyboard=false){await panels(p);const row=p.locator(`[data-action-legibility-key="action:${id}"]`);await row.waitFor({state:'attached'});const detail=row.locator('xpath=ancestor::details[1]');if(!await detail.evaluate(n=>n.open))await detail.locator(':scope > summary').click();const primary=row.locator('.action-legibility__primary');const b=await primary.count()?primary:row.locator('button.action-legibility__button').first();if(keyboard){await b.focus();assert(await b.evaluate(n=>n===document.activeElement));await b.press('Enter');}else await b.click();result.events.push({id,clock:(await save(p,'latest')).expansion.clock});}
async function complete(p,id){let s=await save(p,'latest');const job=s.expansion.simulation.jobs.find(j=>j.commandId===id);assert(job,'actual pending '+id);const due=job.due;await p.waitForFunction(due=>JSON.parse(localStorage.getItem('save data')).expansion.clock>=due,due,{timeout:20000});s=await save(p,'latest');assert(!s.expansion.simulation.jobs.some(j=>j.commandId===id));return s;}
async function ticks(p,n){
 const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.clock),target=before+n;
 await p.waitForFunction(target=>JSON.parse(localStorage.getItem('save data')).expansion.clock>=target,target,{timeout:n*1500+15000});
}
async function open(file){const ctx=browser,p=ctx.pages()[0] || await ctx.newPage();activePage=p;await p.addInitScript(()=>{window.__r4Writes=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){const result=original.call(this,k,v);if(k==='save data'){window.__r4Writes.push(v);if(window.__r4Writes.length>60)window.__r4Writes.shift();}return result;};});p.setDefaultTimeout(15000);p.on('pageerror',e=>result.errors.push(e.stack));p.on('console',m=>{if(['error','warning'].includes(m.type()))result.console.push(m.text());});const response=p.waitForResponse(r=>r.url().includes('/dist/bundle.js'));await p.goto('http://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});assert.equal(sha(await(await response).body()),bundle);await play(p);if(file)await importFile(p,file);await panels(p);return {p,ctx};}
function outcome(s){return JSON.parse(s.expansion.simulation.knowledge.player[P+'duty.result'].value).status;}
function count(s,a,k){return a==='player'?s.inventories.person.main_character[k]?.count||0:s.expansion.simulation.owners[a]?.[k]||0;}
function coherent(a,b){assert.equal(b.character.money,a.character.money);assert.deepEqual(b.inventories,a.inventories);assert.deepEqual(b.expansion.actors,a.expansion.actors);assert.deepEqual(b.expansion.worlds,a.expansion.worlds);for(const f of ['workPlans','programs','seed','owners','people','jobs','knowledge','claims','faculties','powers','conditions','sites','equipment','custody','sessions','causes','situations'])assert.deepEqual(b.expansion.simulation[f],a.expansion.simulation[f],f);assert.equal(b.expansion.rng,a.expansion.rng);assert.equal(b.expansion.clock,a.expansion.clock);for(const f of ['hp_to_full','stamina_to_full','race','gender'])assert.deepEqual(b.character[f],a.character[f],f);assert.deepEqual(b.active_effects,a.active_effects,'native effects');assert.deepEqual(b['current time'],a['current time'],'native calendar');}
async function restoration(p,label){const file=await exportFile(p,label),before=await save(p,label+'-exported');await p.reload({waitUntil:'domcontentloaded'});await play(p);coherent(before,await save(p,label+'-reloaded'));await importFile(p,file);coherent(before,await save(p,label+'-imported'));return file;}


module.exports={save,exportFile,play,importFile,panels,action,complete,ticks,count,coherent,restoration,result,
 boot:async(file)=>{await new Promise(r=>server.listen(port,'127.0.0.1',r));browser=await chromium.launchPersistentContext('/Users/weiwei/.codex/tmp/yairpg-r4-native',{headless:true,viewport:{width:1600,height:1100},acceptDownloads:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});return open(file);},
 close:async()=>{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));}};
