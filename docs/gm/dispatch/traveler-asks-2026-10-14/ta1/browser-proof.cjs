const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const proof=path.join(process.cwd(),'docs/gm/dispatch/traveler-asks-2026-10-14/ta1'),url='http://127.0.0.1:22420/';
const errors=[],results=[],attempts=[];
const projection=s=>({people:s.generated_people,history:s.expansion.loreHistory,streams:s.expansion.streams,decks:s.expansion.simulation?.decks,inventory:s.inventories.person.main_character,money:s.character.money});
const saved=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const save=async p=>{await p.locator('#save_button').click();return saved(p);};
async function profile(tag,viewport={width:1366,height:768}) {
 const dir=`/private/tmp/ta-ta1-profile-${tag}-${Date.now()}`;
 const b=await chromium.launchPersistentContext(dir,{channel:'chrome',headless:true,viewport,acceptDownloads:true});const p=b.pages()[0]||await b.newPage();for(const other of b.pages())if(other!==p)await other.close();
 p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.locator('#loading_screen_play_button').click();await p.locator('#hero_creation_name_field').fill(`TEST FIXTURE TA TA1 ${tag}`);await p.locator('#hero_creation_panel_confirmation').click();return {b,p,dir};
}
async function reloadExact(p,s) {await p.reload();await p.locator('#loading_screen_play_button').waitFor();assert.deepEqual(projection(await saved(p)),projection(s));await p.locator('#loading_screen_play_button').click();await p.locator('#generated_people_panel').evaluate(n=>n.open=true);}
async function persistence(p,tag) {
 const settled=await save(p);await reloadExact(p,settled);
 const dl=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const literal=`/private/tmp/ta-ta1-${tag}-literal.txt`;await(await dl).saveAs(literal);
 const {decodeSaveFile}=await import(path.join(process.cwd(),'src/save_files.js')),exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');
 const {b,p:ip}=await profile(`import-${tag}`,{width:1600,height:1000});try {
  await Promise.all([ip.waitForNavigation({waitUntil:'domcontentloaded'}),ip.locator('#saved_file_input').setInputFiles(literal)]);
  assert.deepEqual(projection(await saved(ip)),projection(exported));await ip.locator('#loading_screen_play_button').click();await ip.locator('#generated_people_panel').evaluate(n=>n.open=true);
  const r=exported.generated_people.storyRequests.requests.find(r=>r.status==='delivered');await ip.locator(`[data-generated-person="${r.issuer}"]`).evaluate(n=>n.open=true);await ip.locator(`[data-story-request-row="${r.id}"]`).scrollIntoViewIfNeeded();await ip.screenshot({path:path.join(proof,`${tag}-import-1600.png`)});
 }finally{await b.close();}
 return {completedReloadExact:true,exportLiteralImportExact:true,literal};
}
async function shots(p,tag,r) {
 for(const [width,height] of [[1366,768],[1600,1000]]){await p.setViewportSize({width,height});await p.locator(`#generated_people_panel`).evaluate(n=>n.open=true);await p.locator(`[data-generated-person="${r.issuer}"]`).evaluate(n=>n.open=true);await p.locator(`[data-story-request-row="${r.id}"] [data-story-recap]`).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(proof,`${tag}-${width}.png`)});}
}
async function natural(number) {
 const {b,p,dir}=await profile(`natural-${number}`);try {
  await p.getByText('Talk to someone',{exact:false}).click();await p.locator('[data-dialogue="villageElder"]').click();
  for(const line of ['hello','what happened','ask to leave 1','need to','starting gear','dagger','equipment'])await p.locator(`[data-textline="${line}"]`).click();
  await p.locator('.end_dialogue_button').click();
  // Look at the actual ordinary market before enrollment. No injected stock/seed.
  await p.getByText('Visit a merchant',{exact:false}).click();await p.locator('[data-trader="villageTrader"]').click();const market=await p.locator('#trader_inventory_div [data-trader_item]').evaluateAll(ns=>ns.map(n=>({key:n.dataset.trader_item,count:Number(n.dataset.item_count)})));await p.locator('#exit_trade_button').click();
  await p.locator('#journal_show_notebook').click();await p.locator('[data-notebook-view="people"]').click();await p.locator('[data-storylet="begin"]').click();
  await p.locator('#generated_people_panel').evaluate(n=>n.open=true);await p.locator('[data-generated-action="enroll"]').click();
  let candidate,s;const already=new Set(results.map(r=>r.item));
  for(const id of ['traveler_2','traveler_1']) {
   const row=p.locator(`[data-generated-person="${id}"]`);await row.evaluate(n=>n.open=true);await row.locator('[data-generated-action="meet"]').click();s=await save(p);const known=s.generated_people.people.find(x=>x.id===id),key=JSON.stringify({id:known.goal.item}),stock=market.find(x=>x.key===key);
   const livePrice=known.goal.feeBasis.base; // same price basis for ordinary market goods, before premium
   if(stock&&stock.count>=known.goal.quantity&&livePrice<=s.character.money&&!already.has(known.goal.item)&&known.goal.item!=='Stale bread'){candidate=known;break;}
  }
  attempts.push({profile:dir,seed:s.generated_people.seed,known:s.generated_people.people.filter(x=>x.met).map(x=>({id:x.id,item:x.goal.item,quantity:x.goal.quantity,band:x.goal.band})),chosen:candidate?.id||null});
  if(!candidate)return false;
  await p.locator('[data-story-request="enable"]').click();await p.locator('[data-story-request="raise"]').click();s=await save(p);const r=s.generated_people.storyRequests.requests[0];assert.equal(r.issuer,candidate.id);assert.equal(r.revision,2);
  await p.locator(`[data-request-id="${r.id}"][data-story-request="take"]`).click();const pending=await save(p);await reloadExact(p,pending);
  const key=JSON.stringify({id:r.item}),before=await save(p);await p.getByText('Visit a merchant',{exact:false}).click();await p.locator('[data-trader="villageTrader"]').click();
  for(let i=0;i<r.quantity;i++){const item=p.locator('#trader_inventory_div [data-trader_item]').filter({has:p.locator('.item_name',{hasText:r.item})});assert.equal(await item.count(),1);await item.locator('.item_name').click();}
  await p.locator('#accept_trade_button').click();await p.locator('#exit_trade_button').click();const bought=await save(p);
  assert.equal((bought.inventories.person.main_character[key]?.count||0)-(before.inventories.person.main_character[key]?.count||0),r.quantity);assert.ok(bought.character.money<before.character.money);assert.ok(r.reward>before.character.money-bought.character.money);
  await p.locator(`[data-request-id="${r.id}"][data-story-request="deliver"]`).click();const delivered=await save(p);
  assert.equal((bought.inventories.person.main_character[key]?.count||0)-(delivered.inventories.person.main_character[key]?.count||0),r.quantity);assert.equal(delivered.character.money-bought.character.money,r.reward);assert.equal(delivered.generated_people.storyRequests.requests[0].status,'delivered');
  const recap=await p.locator(`[data-story-request-row="${r.id}"] [data-story-recap]`).innerText();assert.ok(recap.includes(r.item)&&recap.includes(String(r.reward)));const hint=await p.locator(`[data-request-source="${r.id}"]`).innerText();assert.match(hint,/Village market/);
  await shots(p,`natural-${number}`,r);const roundtrip=await persistence(p,`natural-${number}`);
  const served=await(await p.request.get(url+'dist/bundle.js')).body();assert.deepEqual(served,fs.readFileSync('dist/bundle.js'));
  const result={label:'natural',profile:dir,seed:delivered.generated_people.seed,item:r.item,quantity:r.quantity,band:candidate.goal.band,reward:r.reward,purchaseCost:before.character.money-bought.character.money,pendingReloadExact:true,nativePurchaseAndDelivery:true,recap,hint,...roundtrip};results.push(result);console.log(JSON.stringify(result));return true;
 }catch(e){await p.screenshot({path:path.join(proof,`attempt-${number}.png`)});console.log((await p.locator('#generated_people_panel').innerText()).slice(0,2500));throw e;}finally{await b.close();}
}
async function legacy() {
 const {b,p,dir}=await profile('rev1-load');try {
  const {decodeSaveFile}=await import(path.join(process.cwd(),'src/save_files.js'));const baseline=decodeSaveFile(fs.readFileSync('/private/tmp/ta1-rev1-baseline.txt','utf8'),'v0.6');
  await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles('/private/tmp/ta1-rev1-baseline.txt')]);
  assert.deepEqual(projection(await saved(p)),projection(baseline));await p.locator('#loading_screen_play_button').click();await p.locator('#generated_people_panel').evaluate(n=>n.open=true);
  const r=baseline.generated_people.storyRequests.requests[0];assert.equal(r.revision,1);assert.equal(r.quantity,1);assert.ok(r.reward>=3&&r.reward<=6);
  await p.locator(`[data-request-id="${r.id}"][data-story-request="take"]`).click();const pending=await save(p);await reloadExact(p,pending);const key=JSON.stringify({id:r.item}),before=await save(p);
  await p.locator(`[data-request-id="${r.id}"][data-story-request="deliver"]`).click();const after=await save(p);assert.equal(after.generated_people.storyRequests.requests[0].status,'delivered');assert.equal(after.character.money-before.character.money,r.reward);assert.equal(before.inventories.person.main_character[key].count-(after.inventories.person.main_character[key]?.count||0),1);
  assert.equal(after.generated_people.people.find(x=>x.id===r.issuer).goal.reward,baseline.generated_people.people.find(x=>x.id===r.issuer).goal.reward);
  await shots(p,'rev1',r);const roundtrip=await persistence(p,'rev1');return {label:'seeded-native, naturally earned rev1 baseline literal',profile:dir,revision:1,item:r.item,quantity:1,reward:r.reward,unchangedGoalAndTerms:true,settled:true,pendingReloadExact:true,...roundtrip};
 }finally{await b.close();}
}
(async()=>{for(let n=1;n<=12&&results.length<2;n++)await natural(n);assert.equal(results.length,2,'Need two different ordinary purchased asks');assert.notEqual(results[0].item,results[1].item);assert.notEqual(results[0].seed,results[1].seed);const rev1=await legacy();assert.deepEqual(errors,[]);
 const evidence={viewports:['1366x768','1600x1000'],bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex'),natural:results,rev1,attempts,pageErrors:errors};fs.writeFileSync(path.join(proof,'BROWSER_EVIDENCE.json'),JSON.stringify(evidence,null,2));console.log('BROWSER PROOF PASS');})().catch(e=>{console.error(e);process.exit(1);});
