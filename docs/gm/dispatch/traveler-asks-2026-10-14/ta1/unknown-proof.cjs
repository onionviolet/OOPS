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
(async()=>{
 let unknown=null;
 for(let n=1;n<=8&&!unknown;n++){
  const {b,p,dir}=await profile(`unknown-${n}`);try{
   await p.getByText('Talk to someone',{exact:false}).click();await p.locator('[data-dialogue="villageElder"]').click();await p.locator('[data-textline="hello"]').click();await p.locator('.end_dialogue_button').click();
   await p.locator('#journal_show_notebook').click();await p.locator('[data-notebook-view="people"]').click();await p.locator('[data-storylet="begin"]').click();await p.locator('#generated_people_panel').evaluate(n=>n.open=true);await p.locator('[data-generated-action="enroll"]').click();
   for(const id of ['traveler_2','traveler_1']){const row=p.locator(`[data-generated-person="${id}"]`);await row.evaluate(n=>n.open=true);await row.locator('[data-generated-action="meet"]').click();const s=await save(p),person=s.generated_people.people.find(x=>x.id===id);if(person.goal.band!=='unknown')continue;
    await p.locator('[data-story-request="enable"]').click();await p.locator('[data-story-request="raise"]').click();const offered=await save(p),r=offered.generated_people.storyRequests.requests[0];assert.equal(r.issuer,id);
    const hint=p.locator(`[data-request-source="${r.id}"]`),line=await hint.innerText();assert.ok(line.startsWith('Supply reach: unknown. '+person.goal.clue));assert.ok(!line.includes('Known source:'));
    await p.locator(`[data-request-id="${r.id}"][data-story-request="take"]`).click();const pending=await save(p);await reloadExact(p,pending);await p.locator(`[data-request-id="${r.id}"][data-story-request="deliver"]`).click();const refused=await save(p);assert.equal(refused.generated_people.storyRequests.requests[0].status,'accepted');assert.equal(refused.character.money,pending.character.money);assert.equal(refused.generated_people.storyRequests.requests[0].held,r.reward);assert.deepEqual(refused.inventories.person.main_character,pending.inventories.person.main_character);
    for(const [width,height]of [[1366,768],[1600,1000]]){await p.setViewportSize({width,height});await hint.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(proof,`unknown-${width}.png`)});}
    unknown={label:'natural',profile:dir,seed:pending.generated_people.seed,item:r.item,quantity:r.quantity,band:person.goal.band,reward:r.reward,clue:person.goal.clue,hint:line,noHiddenSource:true,pendingReloadExact:true,missingStockRefusalKeepsEscrow:true};break;
   }
  }finally{await b.close();}
 }
 assert.ok(unknown,'Need a naturally discovered unknown ask');assert.deepEqual(errors,[]);fs.writeFileSync(path.join(proof,'UNKNOWN_EVIDENCE.json'),JSON.stringify(unknown,null,2));console.log(JSON.stringify(unknown));
 const evidence=JSON.parse(fs.readFileSync(path.join(proof,'BROWSER_EVIDENCE.json'),'utf8'));
 const context=await chromium.launchPersistentContext(evidence.natural[1].profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768}});try{const p=context.pages()[0];await p.goto(url);await p.locator('#loading_screen_play_button').click();await p.locator('#generated_people_panel').evaluate(n=>n.open=true);const r=(await saved(p)).generated_people.storyRequests.requests.find(r=>r.status==='delivered');for(const[width,height]of [[1366,768],[1600,1000]]){await p.setViewportSize({width,height});await p.locator(`[data-request-source="${r.id}"]`).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(proof,`known-source-${width}.png`)});}}finally{await context.close();}
})().catch(e=>{console.error(e);process.exit(1)});
