const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});const result=[];try{
for(const key of ['probationer','civil']){
const c=await browser.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:19873/?lotm_probe=1&test_hooks=1');await p.waitForFunction(()=>window.simulationTestHooks);await startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());
const snapshot=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const open=async()=>{await p.locator('[data-workspace-action="restore"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('[data-workspace-action="expand"][data-module="lotm"]').evaluate(n=>n.click());await p.locator('#lotm_panel').waitFor({state:'visible'});};
await open();console.log(key,'opened');
const click=async token=>{console.log(key,token);if(!await p.locator('#lotm_panel').isVisible())await open();const b=p.locator(`#lotm_panel [data-lotm="${token}"]`);assert.equal(await b.isDisabled(),false,token);await b.click();};
const ticks=async n=>p.evaluate(n=>advanceTicks(n,{render:true}),n);
const starting=(await snapshot()).character.money;
await click(key==='civil'?'enroll_civil':'enroll');let s=await snapshot();assert.equal(s.character.money,key==='civil'?1200:starting);
assert.match(s.expansion.simulation.knowledge.player['book.lotm.entry'].value,key==='civil'?/papers cost 8.*passage 4.*5 remain.*no money debt/:/own money carries over/);
await click('book.lotm.report_in');if(key==='civil'){assert.doesNotMatch(await p.locator('#lotm_panel').innerText(),/Seer pathway|Hold the allocated Seer dose/);assert.match(await p.locator('#lotm_panel').innerText(),/Civil staff/);await click('book.lotm.sign_contract');await click('book.lotm.collect_pay');assert.equal((await snapshot()).character.money,1920);assert.equal(await p.locator('[data-lotm="book.lotm.collect_pay"]').isDisabled(),true);}
const before=(await snapshot()).character.money;await click('book.lotm.errand_evernight');await ticks(20);assert.equal((await snapshot()).character.money,before+12);
await click('lotm.move.docks');await ticks(20);await click('book.lotm.endorse_storm');assert.equal((await snapshot()).character.money,before+12-24);
await click('book.lotm.errand_storm');await ticks(20);assert.equal((await snapshot()).character.money,before+12-24+18);
console.log(key,'earned/spent');
const project=s=>({money:s.character.money,profile:s.expansion.lotm.entryProfile,knowledge:s.expansion.simulation.knowledge.player,resources:s.expansion.actors.player.resources,facts:s.expansion.actors.player.facts,location:s['current location']});
await p.evaluate(()=>saveProgress());const saved=project(await snapshot());await p.reload();await p.waitForFunction(()=>window.simulationTestHooks);await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());assert.deepEqual(project(await snapshot()),saved);await open();console.log(key,'reload');
const encoded=await p.evaluate(()=>save_to_file());assert.ok(encoded?.length>1000);const exported=project(await snapshot());
await click('lotm.move.workroom');await ticks(20);assert.notEqual((await snapshot())['current location'],exported.location);
await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:'q3-disposable.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await p.waitForFunction(()=>window.simulationTestHooks);await p.getByText('PLAY',{exact:true}).click();await p.evaluate(()=>simulationTestHooks.pause());assert.deepEqual(project(await snapshot()),exported);await open();
await p.screenshot({path:`/tmp/lotm-q3-${key}.png`});
assert.deepEqual(errors,[]);result.push({key,startingMoney:starting,saved,exportChars:encoded.length,errors,steps:'visible panel enrollment, report, civil salary or probationer errand, timed walks, paid endorsement, docks errand, Save, reload, Export string, walk away, literal file Import'});await c.close();
}
fs.writeFileSync('/tmp/lotm-q3-browser-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.map(({saved,...r})=>({...r,money:saved.money,profile:saved.profile})),null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
