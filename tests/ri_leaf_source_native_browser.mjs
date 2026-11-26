// Independent source-to-consumer proof. All setup and stepped-clock boundaries are explicit.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,rm,access} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {scenarioSave} from '../scripts/headless/scenarios.mjs';
import {serve} from '../scripts/playtest/lib.mjs';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadRankTwo} from '../src/world_packs/book_gu_lead_rank_two.js';
import {RI_LEAF_TREATMENT as LEAF,RI_LEAF_ITEM,RI_LEAF_NOTE} from '../src/ri_leaf_treatment.js';
import {RI_DAY_ITEMS as IT,RI_LEAD_DAY as DAY} from '../src/ri_lead_day_facts.js';
const {launchChrome}=createRequire(import.meta.url)('../scripts/ui_helpers.cjs');
const root=resolve('.'),out=resolve(process.argv[2]||'docs/representations/evidence/ri-leaf-source-native-2026-11-25');
const expected='4d14cb3c865682abdd1428d9ddd37b627cb0f2ace8db85f055009f1c78ced84c';
await assert.rejects(access(join(out,'proof.json')),'never overwrite a finished proof');await mkdir(out,{recursive:true});
const scratch=resolve('work/ri-leaf-source-native-20261125');await mkdir(scratch,{recursive:true});
const resumeHour=process.argv.includes('--resume-hour');
const fixture=resumeHour?null:JSON.parse(await scenarioSave('ri-fang-yuan-wild-gu'));
const sha=value=>createHash('sha256').update(value).digest('hex');
const pin=raw=>({id:raw.id,revision:raw.revision,contentHash:'sha256:'+sha(JSON.stringify(raw))});
if(fixture){
for(const raw of [guLeadRankTwo,guLeadDay])if(!fixture.content_packs.structured.extensions.some(row=>row.id===raw.id))fixture.content_packs.structured.extensions.push(pin(raw));
fixture.expansion.actors.player.facts[`${DAY}.wolf_at_wall`]=true;
(fixture.expansion.simulation.knowledge.player||={})[`${DAY}.fed.moonglow`]={at:fixture.expansion.clock||0,stage:'understood',value:'The Moonglow Gu has eaten.',cause:'fixture.setup'};
const inventory=fixture.inventories.person.main_character;
for(const id of [IT.tally,RI_LEAF_ITEM])delete inventory[JSON.stringify({id})];
for(const [id,count]of [[IT.stone,4],[IT.moonglow,1],[IT.petals,6]])inventory[JSON.stringify({id})]={count};
}
const server=await serve(join(root,'dist'));let browser;const errors=[],results={};
const snap=page=>page.evaluate(()=>simulationTestHooks.snapshot());
const count=(state,id)=>state.inventories.person.main_character[JSON.stringify({id})]?.count||0;
const action=(page,id)=>page.locator(`[data-structured-action="${id}"]`);
const click=async locator=>{await locator.evaluate(node=>{for(let a=node.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});await locator.click();};
const ready=async page=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:120000});await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();};
const show=page=>page.getByRole('combobox',{name:'Other known panels'}).selectOption('beginning');
const newPage=async()=>{const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',error=>errors.push(error.message));return page;};
const load=async(page,save)=>{await page.goto(server.url);await page.evaluate(text=>{localStorage.clear();localStorage.setItem('save data',text);},JSON.stringify(save));await page.reload();await ready(page);await show(page);};
const importFile=async(page,file)=>{await page.goto(server.url);await ready(page);const navigation=page.waitForEvent('domcontentloaded');await page.locator('#saved_file_input').setInputFiles(file);await navigation;await ready(page);await show(page);};
const exportedFile=join(scratch,'earned-treated-export.txt');
try{
    browser=await launchChrome();const page=await newPage();
    const response=page.waitForResponse(response=>new URL(response.url()).pathname==='/dist/bundle.js');
    await page.goto(server.url);const servedBundleSha256=sha(await(await response).body());assert.equal(servedBundleSha256,expected);
    if(resumeHour){Object.assign(results,JSON.parse(await readFile(join(out,'failure.json'),'utf8')).results);assert(results.main?.downstream.nativePatrolCompleted);}
    else{
    await load(page,fixture);console.log('Loaded explicit Fang composed fixture on '+servedBundleSha256);
    await click(action(page,`${DAY}.drive_off`));
    assert.equal((await snap(page)).expansion.actors.player.facts[`${DAY}.injured`],true);assert.equal(count(await snap(page),IT.tally),1);
    await click(page.locator(`[data-structured-extension="${LEAF}"]`));
    assert(await action(page,`${DAY}.patrol`).isDisabled());assert(await action(page,`${LEAF}.treat`).isDisabled());
    await click(action(page,`${LEAF}.buy`));await click(action(page,`${LEAF}.buy`));
    assert.equal(count(await snap(page),IT.stone),0);assert.equal(count(await snap(page),RI_LEAF_ITEM),2);
    await action(page,`${LEAF}.treat`).scrollIntoViewIfNeeded();await page.screenshot({path:join(out,'paid-leaves-wounded-1920.png')});
    await click(action(page,`${LEAF}.treat`));const treated=await snap(page),note=treated.expansion.simulation.knowledge.player[RI_LEAF_NOTE];
    assert.equal(count(treated,RI_LEAF_ITEM),1);assert.equal(treated.expansion.actors.player.facts[`${DAY}.injured`],false);
    assert(await action(page,`${LEAF}.treat`).isDisabled());assert(await action(page,`${DAY}.patrol`).isEnabled());
    await page.locator('#save_button').click();await page.reload();await ready(page);await show(page);
    let kept=await snap(page);assert.deepEqual(kept.expansion.simulation.knowledge.player[RI_LEAF_NOTE],note);assert.equal(count(kept,RI_LEAF_ITEM),1);assert.equal(count(kept,IT.stone),0);
    const downloading=page.waitForEvent('download');await page.locator('#save_to_file_button').click();await(await downloading).saveAs(exportedFile);
    const imported=await newPage();await importFile(imported,exportedFile);kept=await snap(imported);
    assert.deepEqual(kept.expansion.simulation.knowledge.player[RI_LEAF_NOTE],note);assert.equal(count(kept,RI_LEAF_ITEM),1);assert.equal(count(kept,IT.stone),0);assert.equal(kept.expansion.actors.player.facts[`${DAY}.injured`],false);
    await click(action(imported,`${DAY}.patrol`));await imported.evaluate(()=>advanceTicks(181,{render:true}));
    const patrolled=await snap(imported);assert.equal(patrolled.expansion.actors.player.facts[`${DAY}.patrol_out`],true);assert.equal(count(patrolled,RI_LEAF_ITEM),1);
    await action(imported,`${DAY}.patrol`).scrollIntoViewIfNeeded();await imported.screenshot({path:join(out,'imported-downstream-patrol-1920.png')});
    results.main={purchase:{stonesBefore:4,stonesAfter:0,leavesBought:2},nativeDriveOff:{tallies:1,injury:true},afterTreatment:{leaves:1,injury:false,treatedAt:note.at},persistence:'Save/reload/Export/literal Import retained paid stock, treatment note and healed wound',downstream:{nativePatrolCompleted:true,steppedMinutes:181,leafRetained:1}};
    }
    // Separate adverse branch: retained paid stock/treatment; add a waiting threat as setup, not a natural second patrol.
    const exportText=(await readFile(exportedFile,'utf8')).trim();
    const branch=JSON.parse(exportText.startsWith('YAIR-UTF8-1:')?Buffer.from(exportText.slice('YAIR-UTF8-1:'.length),'base64').toString('utf8'):exportText);
    const note=branch.expansion.simulation.knowledge.player[RI_LEAF_NOTE];
    assert.equal(note.at,results.main.afterTreatment.treatedAt);assert.equal(count(branch,RI_LEAF_ITEM),1);
    branch.expansion.actors.player.facts[`${DAY}.wolf_at_wall`]=true;
    const adverse=await newPage();await load(adverse,branch);await click(action(adverse,`${DAY}.drive_off`));
    const injuredAgain=await snap(adverse);assert.equal(injuredAgain.expansion.actors.player.facts[`${DAY}.injured`],true);assert.equal(count(injuredAgain,RI_LEAF_ITEM),1);
    assert(await action(adverse,`${LEAF}.treat`).isDisabled());assert(await action(adverse,`${DAY}.patrol`).isDisabled());
    await adverse.evaluate(()=>advanceTicks(59,{render:true}));assert(await action(adverse,`${LEAF}.treat`).isDisabled());assert.equal(count(await snap(adverse),RI_LEAF_ITEM),1);
    await action(adverse,`${LEAF}.treat`).scrollIntoViewIfNeeded();await adverse.screenshot({path:join(out,'second-wound-hour-block-1920.png')});
    await adverse.locator('#save_button').click();await adverse.reload();await ready(adverse);await show(adverse);assert(await action(adverse,`${LEAF}.treat`).isDisabled());
    await adverse.evaluate(()=>advanceTicks(1,{render:true}));assert(await action(adverse,`${LEAF}.treat`).isEnabled());await click(action(adverse,`${LEAF}.treat`));
    const second=await snap(adverse);assert.equal(count(second,RI_LEAF_ITEM),0);assert.equal(second.expansion.actors.player.facts[`${DAY}.injured`],false);assert.equal(second.expansion.simulation.knowledge.player[RI_LEAF_NOTE].at-note.at,60);
    await action(adverse,`${LEAF}.treat`).scrollIntoViewIfNeeded();await adverse.screenshot({path:join(out,'second-leaf-after-hour-1920.png')});
    results.cooldown={setup:'Independent branch from actual exported treated life; one waiting-wolf fact added, then native drive-off made the second injury. No leaf, wound or treatment timestamp granted.',blockedAtMinutes:[0,59],blockedStock:1,reloadAt59:true,admittedAt60:true,finalLeaves:0,finalInjury:false};
    assert.deepEqual(errors,[]);
    const proof={schema:'ri-leaf-native-proof/1',bundleSha256:servedBundleSha256,viewport:{width:1920,height:1080},
        route:'Named composed Fang wild-Gu/rank-two/day fixture; native watch drive-off -> buy two leaves for four stones -> treat -> duplicate block -> Save/reload/Export/literal Import -> native three-hour patrol. Independent retained-paid-leaf repeat-threat fixture proves wound/cooldown refusal through59 and treatment at60 stepped game minutes.',
        proposalId:'69772c5a2df1f201e9299ef2b923eb24fbe1093a99b4d79ad5ad8f4e27320724',reportId:'04931f697003fbcb3ff98ef4727eec33a6df681fcf8ccf9643af7a5cc07ae418',
        setup:'Existing ri-fang-yuan-wild-gu scenario plus rank-two/day pins, four stones, held fed Moonglow, petals and waiting wolf. No leaf grant. Early life and first patrol are not earned. Native clock stepper advances paid patrol and cooldown; no claim of natural elapsed time.',
        sourceBoundary:'Chapter102 leaf consumption/hour efficacy limit support this consumer. Rank-one plant/growing or detachment, arbitrary/combat-HP healing, personal travel carriage, source costs and a naturally earned second wound are not demonstrated. Two-stone sale and patrol wound are authored applications.',
        automation:resumeHour?'Main route passed; automation stopped parsing the native YAIR-UTF8-1 export as JSON. Corrected harness resumed the retained actual export for the independent hour branch.':'Single complete invocation.',results,errors};
    await writeFile(join(out,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));await rm(exportedFile);
}catch(error){await writeFile(join(out,'failure.json'),JSON.stringify({error:error.stack,errors,results},null,2));throw error;
}finally{if(browser)await browser.close();await new Promise(ok=>{server.close();ok();});}
