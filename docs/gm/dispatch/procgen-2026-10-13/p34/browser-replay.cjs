const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const proof=path.join(process.cwd(),'docs/gm/dispatch/procgen-2026-10-13/p34');
(async()=>{
 const {encodeSaveFile}=await import(path.join(process.cwd(),'src/save_files.js'));
 const original=JSON.parse(fs.readFileSync('/private/tmp/procgen-p34-natural-pending.json','utf8'));original.character.name='TEST FIXTURE PROCGEN P34 REPLAY';
 const literal='/private/tmp/procgen-p34-replay-literal.txt';fs.writeFileSync(literal,encodeSaveFile(JSON.stringify(original)));
 const contexts=[],errors=[];const projection=s=>({people:s.generated_people,history:s.expansion.loreHistory,streams:s.expansion.streams,decks:s.expansion.simulation.decks,events:Object.values(s.expansion.simulation.events).filter(e=>e.storylet),money:s.character.money,inventory:s.inventories.person.main_character});
 const setup=async index=>{const profile='/private/tmp/procgen-p34-profile-replay-'+Date.now()+'-'+index,ctx=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768}});contexts.push(ctx);const p=ctx.pages()[0];for(const other of ctx.pages())if(other!==p)await other.close();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:22400/');await p.locator('#loading_screen_play_button').click();await p.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN P34 REPLAY BOOT');await p.locator('#hero_creation_panel_confirmation').click();await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles(literal)]);assert.deepEqual(projection(await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),projection(original));return {p,profile};};
 try {
 const a=await setup(1),b=await setup(2),nextDue=Math.min(...Object.values(original.expansion.simulation.decks).map(d=>d.due));
 const save=async p=>{await p.locator('#save_button').click();return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 async function run(p){await p.locator('#loading_screen_play_button').click();await p.waitForFunction(target=>JSON.parse(localStorage.getItem('save data'))?.expansion.clock>=target,nextDue,{polling:10,timeout:45000});const s=await save(p);assert.equal(s.expansion.clock,nextDue);return s;}
 const uninterrupted=await run(a.p);
 // Reload second exact checkpoint before starting ordinary native timers.
 await b.p.reload();await b.p.locator('#loading_screen_play_button').waitFor();const restoredNext=await run(b.p);
 assert.deepEqual(projection(restoredNext),projection(uninterrupted));assert.notDeepEqual(restoredNext.expansion.streams,original.expansion.streams);
 const request=restoredNext.generated_people.storyRequests.requests[0],personBefore=restoredNext.generated_people.people.find(p=>p.id===request.issuer);
 await b.p.locator('#generated_people_panel').evaluate(n=>n.open=true);await b.p.locator(`[data-request-id="${request.id}"][data-story-request="decline"]`).click();const declined=await save(b.p),personAfter=declined.generated_people.people.find(p=>p.id===request.issuer);
 assert.equal(personAfter.possessions.coins,personBefore.possessions.coins+request.reward);assert.equal(declined.generated_people.storyRequests.requests[0].held,0);assert.equal(declined.character.money,restoredNext.character.money);assert.deepEqual(declined.inventories.person.main_character,restoredNext.inventories.person.main_character);assert.ok(declined.expansion.loreHistory.receipts.some(r=>r.action==='request.decline'));
 await b.p.locator('[data-story-request="raise"]').click();const reoffered=await save(b.p);assert.equal(reoffered.generated_people.storyRequests.requests.length,2);assert.equal(reoffered.generated_people.storyRequests.requests[1].issuer,request.issuer);
 for(const [width,height] of [[1366,768],[1600,1000]]){await b.p.setViewportSize({width,height});await b.p.locator('#generated_people_panel').scrollIntoViewIfNeeded();await b.p.screenshot({path:path.join(proof,`decline-reoffer-${width}.png`)});}
 const bundle=fs.readFileSync('dist/bundle.js');assert.deepEqual(await(await b.p.request.get('http://127.0.0.1:22400/dist/bundle.js')).body(),bundle);assert.deepEqual(errors,[]);
 const evidence={label:'seeded-native',fixture:'exact disposable natural pending checkpoint copied through literal-file import; no grants or fabricated time',profiles:[a.profile,b.profile],samePendingImportExact:true,reloadAtStart:true,nextClock:nextDue,nextDrawReceiptsAndPopulationAndStockExact:true,nativeDeclineReleasesFeeWithoutStockOrPlayerCost:true,sameNeedNewFundedReoffer:true,pageErrors:errors,bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex')};fs.writeFileSync(path.join(proof,'REPLAY_EVIDENCE.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
 }finally{for(const c of contexts)await c.close();}
})().catch(e=>{console.error(e);process.exit(1);});
