const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),http=require('http'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=process.cwd(),out=__dirname,port=18727,fixture=process.argv[2];
assert(fixture&&fs.existsSync(fixture),'Pass actual naturally earned exported prerequisite file');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bundle=sha(fs.readFileSync('dist/bundle.js'));
const mime={'.js':'application/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0],file=path.resolve(root,'.'+(name==='/'?'/index.html':decodeURIComponent(name)));if(!file.startsWith(root+path.sep)||name.startsWith('/private_packs/')||name.startsWith('/docs/research/novels/')){res.writeHead(404);return res.end();}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b);});});
const secondary=false;
const priorProof=secondary?JSON.parse(fs.readFileSync(out+'/attempts/primary-with-cancel-selector-error.json','utf8')):null;
if(priorProof)assert.equal(priorProof.bundle,bundle);
const result={status:'RUNNING',bundle,base:'dd3efe3383f12f0aac22e4f390aae90fae2e7fc4',fixture,fixtureHash:sha(fs.readFileSync(fixture)),checks:priorProof?.checks||{},events:[],errors:[],timePolicy:'Normal native browser timers; no resource/history/clock fields injected',console:[]};
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
async function open(file){const ctx=await browser.newContext({viewport:{width:1600,height:1100}}),p=await ctx.newPage();activePage=p;await p.addInitScript(()=>{window.__r3Writes=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){const result=original.call(this,k,v);if(k==='save data'){window.__r3Writes.push(v);if(window.__r3Writes.length>60)window.__r3Writes.shift();}return result;};});p.setDefaultTimeout(15000);p.on('pageerror',e=>result.errors.push(e.stack));p.on('console',m=>{if(['error','warning'].includes(m.type()))result.console.push(m.text());});const response=p.waitForResponse(r=>r.url().includes('/dist/bundle.js'));await p.goto('http://127.0.0.1:'+port,{waitUntil:'domcontentloaded'});assert.equal(sha(await(await response).body()),bundle);await play(p);await importFile(p,file);await panels(p);return {p,ctx};}
function outcome(s){return JSON.parse(s.expansion.simulation.knowledge.player[P+'duty.result'].value).status;}
function count(s,a,k){return a==='player'?s.inventories.person.main_character[k]?.count||0:s.expansion.simulation.owners[a]?.[k]||0;}
function coherent(a,b){assert.equal(b.character.money,a.character.money);assert.deepEqual(b.inventories,a.inventories);assert.deepEqual(b.expansion.actors,a.expansion.actors);assert.deepEqual(b.expansion.worlds,a.expansion.worlds);for(const f of ['seed','owners','people','jobs','knowledge','claims','faculties','powers','conditions','sites','equipment','custody','sessions','causes','situations'])assert.deepEqual(b.expansion.simulation[f],a.expansion.simulation[f],f);assert.equal(b.expansion.rng,a.expansion.rng);assert.equal(b.expansion.clock,a.expansion.clock);for(const f of ['hp_to_full','stamina_to_full','race','gender'])assert.deepEqual(b.character[f],a.character[f],f);assert.deepEqual(b.active_effects,a.active_effects,'native effects');assert.deepEqual(b['current time'],a['current time'],'native calendar');}
async function restoration(p,label){const file=await exportFile(p,label),before=await save(p,label+'-exported');await p.reload({waitUntil:'domcontentloaded'});await play(p);coherent(before,await save(p,label+'-reloaded'));await importFile(p,file);coherent(before,await save(p,label+'-imported'));return file;}

const RF='reference.coolingRefinement.',E='feature_objects.miri',C=key('Charged cooling sleeve'),S=key('Cooling salt packet'),EMPTY=key('Empty cooling sleeve'),HOOK='featureBattleHook',FIELD='reference_gameplay.hook_cooled';
const facts=s=>s.expansion.actors.player.facts;
const receipt=s=>JSON.parse(facts(s)[RF+'lastAttempt']);
function decode(file){const text=fs.readFileSync(file,'utf8').trim();return JSON.parse(Buffer.from(text.replace(/^YAIR-UTF8-1:/,''),'base64').toString('utf8'));}
async function failedWrite(p,id,label){
 const before=await save(p,label+'-before'),bytes=await p.evaluate(()=>localStorage.getItem('save data'));
 await p.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Injected quota','QuotaExceededError');};});
 await action(p,id);assert.equal(await p.evaluate(()=>localStorage.getItem('save data')),bytes);
 const after=decode(await exportFile(p,label+'-failed-export'));coherent(before,after);
 await p.reload({waitUntil:'domcontentloaded'});await play(p);coherent(before,await save(p,label+'-reloaded'));result.checks[label]=true;
}
(async()=>{
 await new Promise(r=>server.listen(port,'127.0.0.1',r));browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const {p,ctx}=await open(fixture);let s=await save(p,'refine-entry');assert.equal(count(s,'player',S),4);assert.equal(count(s,'player',C),1);assert.equal(count(s,E,S),0);assert.equal(s.expansion.simulation.powers.player['reference_gameplay.cooling'].mastery,3);assert(s.expansion.actors.player.facts['feature.battle.seen']);
 assert(s.expansion.simulation.jobs.some(j=>j.commandId==='reference_gameplay.refine_first'),'resume exact already-earned pending attempt');result.checks.earnedPendingPreservedAfterHarnessFailure=true;
 let success=false,attempts=[];
 for(let n=0;n<5;n++){
 s=await save(p,'before-attempt-'+(n+1));const failed=facts(s)[RF+'failedAttempts']||0,id='reference_gameplay.refine_'+(['first','second','third'][failed]||'later');const salts=count(s,'player',S);if(!salts&&!s.expansion.simulation.jobs.some(j=>j.commandId===id))break;
 // Soreness after an actual failed result must expire through ordinary native time before another paid handling operation.
 const sore=s.expansion.simulation.conditions.player?.['body.sore_hands'];if(sore){await ticks(p,Math.max(0,sore.expiresAt-s.expansion.clock));s=await save(p,'soreness-expired-'+n);assert(!s.expansion.simulation.conditions.player?.['body.sore_hands']);}
 const old=s;let reserved=s; j=s.expansion.simulation.jobs.find(x=>x.commandId===id);
 if(!j){await action(p,id,true);s=await save(p,'attempt-'+(n+1)+'-pending');j=s.expansion.simulation.jobs.find(x=>x.commandId===id);assert(j);
 const traced=await p.evaluate(commandId=>window.__r3Writes.map(v=>JSON.parse(v)).findLast(v=>v.expansion.simulation.jobs.some(j=>j.commandId===commandId)&&v.expansion.clock===v.expansion.simulation.jobs.find(j=>j.commandId===commandId).due-3),id);assert(traced,'durable reservation write');reserved=traced;fs.writeFileSync(out+'/attempt-'+(n+1)+'-durable-reservation.json',JSON.stringify(reserved));assert.equal(reserved.character.stamina_to_full,old.character.stamina_to_full+2);assert.equal(count(reserved,'player',S),salts-1);result.checks.exactDurablePaidStaminaReservation=true;
 } else {reserved=JSON.parse(fs.readFileSync(out+'/attempt-1-pending.json'));}
 const frozen=JSON.parse(j.effects.find(e=>e.key===RF+'lastAttempt').value);const remainingAfter=count(s,'player',S);assert.equal(j.due,frozen.acceptedAt+3);assert.equal(frozen.retryCountBefore,failed);assert.equal(frozen.successProbability,(frozen.prepared?.7:.5)+Math.min(failed,3)*.05);
 await restoration(p,'attempt-'+(n+1)+'-pending');result.checks.frozenPendingLiteralRestoration=true;
 let restored=await save(p,'attempt-'+(n+1)+'-restored');assert.deepEqual(restored.expansion.simulation.jobs.find(x=>x.id===j.id),j);
 s=await complete(p,id);const r=receipt(s);assert.deepEqual(r,frozen);assert.equal(s.expansion.simulation.knowledge.player[RF+r.result].at,j.due);assert.equal(count(s,'player',S),remainingAfter);attempts.push(r);fs.writeFileSync(out+'/NATIVE_ATTEMPTS.json',JSON.stringify(attempts,null,2));
 await restoration(p,'attempt-'+(n+1)+'-completed');result.checks.completedLiteralRestoration=true;
 if(r.result==='success'){success=true;assert(facts(s)[RF+'applicationAvailable']);break;}
 const condition=s.expansion.simulation.conditions.player['body.sore_hands'];assert.equal(condition.expiresAt,j.due+5);assert.equal(facts(s)[RF+'failedAttempts'],failed+1);assert(!facts(s)[RF+'applicationAvailable']);result.checks.actualPaidFailureSorenessAndRetry=true;
 }
 result.checks.finiteRngAttempts=true;result.attempts=attempts;result.successEarned=success;
 if(success){
 await failedWrite(p,'reference_gameplay.steady_hook','applicationFailedWrite');
 const old=await save(p,'before-application');await action(p,'reference_gameplay.steady_hook',true);s=await save(p,'applied');assert.equal(count(s,'player',C),0);assert.equal(count(s,'player',EMPTY),1);const appliedWrite=await p.evaluate(()=>window.__r3Writes.map(v=>JSON.parse(v)).findLast(v=>v.expansion.actors.player.facts['reference.coolingRefinement.applicationAvailable']===false&&v.expansion.simulation.conditions.featureBattleHook?.['reference_gameplay.hook_cooled']?.expiresAt===v.expansion.clock+5));assert(appliedWrite);assert.equal(appliedWrite.character.stamina_to_full,old.character.stamina_to_full+2);assert.equal(facts(s)[RF+'applicationAvailable'],false);const field=s.expansion.simulation.conditions[HOOK][FIELD];assert.equal(field.expiresAt,s.expansion.clock+5);assert.equal(s.expansion.simulation.knowledge.player[RF+'steady_hook'].cause,field.cause);await restoration(p,'applied-native');result.checks.earnedApplicationSleeveConservationAndLiteralRestoration=true;
 await panels(p);fs.writeFileSync(out+'/application-ui.txt',await p.locator('#feature_expansion_panel').innerText());await p.screenshot({path:out+'/application-native.png',fullPage:true});
 // Native Combat retains its actual cadence. Cooling blocks the special pull; Oren can brace and jab.
 await action(p,'feature_battle.start');let first=await save(p,'cooled-battle-start');assert.equal(first.expansion.simulation.sessions.player.nativeBattle.schema,4);const logStart=first.expansion.simulation.log.length;
 await p.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('save data')).expansion;return s.simulation.sessions.player?.nativeBattle?.actions>=3;},null,{timeout:10000});
 s=await save(p,'cooled-battle-actions');fs.writeFileSync(out+'/cooled-battle-ui.txt',await p.locator('#feature_expansion_panel').innerText());result.battleLogs=s.expansion.simulation.log.slice(logStart);
 const b=s.expansion.simulation.sessions.player.nativeBattle;assert(b.fighters[HOOK].moves>0);assert(b.fighters.player.moves>0);assert(b.last);result.checks.nativeCombatOrdinaryActionsContinue=true;await action(p,'withdraw:');s=await save(p,'withdrawn');assert(!s.expansion.simulation.sessions.player);
 const expiry=field.expiresAt;if(s.expansion.clock<expiry)await ticks(p,expiry-s.expansion.clock);s=await save(p,'five-minute-expired');assert(!s.expansion.simulation.conditions[HOOK]?.[FIELD]);result.checks.exactFiveMinuteExpiry=true;
 // Buy the second actual stocked sleeve for the legacy direct four-minute command.
 const stockBefore=count(s,E,C);assert.equal(stockBefore,1);await action(p,'reference_gameplay.buy_sleeve');s=await save(p,'second-sleeve');assert.equal(count(s,E,C),0);assert.equal(count(s,'player',C),1);
 await action(p,'reference_gameplay.cool_hook');s=await save(p,'legacy-four-minute-applied');const legacy=s.expansion.simulation.conditions[HOOK][FIELD];assert.equal(legacy.expiresAt,s.expansion.clock+4);assert.equal(count(s,'player',C),0);assert.equal(count(s,'player',EMPTY),2);await restoration(p,'legacy-four-minute');result.checks.actualLegacyFourMinuteCompatibilityAndRestoration=true;
 const due=legacy.expiresAt;await ticks(p,Math.max(0,due-(await save(p,'legacy-time')).expansion.clock));s=await save(p,'legacy-expired');assert(!s.expansion.simulation.conditions[HOOK]?.[FIELD]);result.checks.legacyExpiry=true;
 }
 await exportFile(p,'final-earned-native');assert.equal(sha(fs.readFileSync('dist/bundle.js')),bundle);result.status=success?'NATIVE_POSITIVE_OBSERVED':'NATIVE_POSITIVE_OPEN';await ctx.close();
})().catch(async e=>{result.status='FAIL';result.failure=e.stack;console.error(e);if(activePage&&!activePage.isClosed()){fs.writeFileSync(out+'/refine-failure-ui.txt',await activePage.locator('body').innerText());await activePage.screenshot({path:out+'/refine-failure.png',fullPage:true});await exportFile(activePage,'refine-earned-harness-failure').catch(()=>{});fs.writeFileSync(out+'/refine-failure-state.json',await activePage.evaluate(()=>localStorage.getItem('save data'))||'null');}}).finally(async()=>{fs.writeFileSync(out+'/REFINE_NATIVE_RESULT.json',JSON.stringify(result,null,2));if(browser)await browser.close();server.closeAllConnections();server.close();console.log(JSON.stringify({status:result.status,checks:result.checks,failure:result.failure}));});
