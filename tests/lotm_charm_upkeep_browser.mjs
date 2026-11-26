// Named workshop fixture: two already-aged unused charms and an initially sleeping Old Neil.
// All upkeep, weakening, burn and persistence assertions use ordinary native controls after setup.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildBundle,serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as I} from './helpers/conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects,BE_SEER_ENERGY_ID} from '../src/book_world_lotm_be_seer.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {SLUMBER_UPKEEP,SLUMBER_USE,SLUMBER_SLEEP} from '../src/lotm_silver_charms.js';
import {CHARM_MENTOR_ID,CHARM_REVIEW_MINUTES,charmLedgerKey} from '../src/lotm_charm_upkeep.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';

const setup='book.lotm.fixture_charm_upkeep.setup',renew=SLUMBER_UPKEEP+'.renew',activate=SLUMBER_USE+'.activate';
const key=JSON.stringify({id:'book.lotm.slumber_charm'}),ledgerKey=charmLedgerKey('slumber');
const pack=JSON.parse(JSON.stringify(conversationKnowledgeFixture()).replaceAll(I.room,tingenSilverWorkshop.place));
const mentor={...pack.people.find(person=>person.id===I.person),id:CHARM_MENTOR_ID,indexId:'lotm.person.old-neil',name:'Old Neil'};
pack.people.push(mentor); pack.leadLife.relations.push({person:CHARM_MENTOR_ID,kind:'colleague',date:'before start',locator:'en b1 c1 p1'});
for(const schedule of [pack.schedule,pack.bindings.schedule]) schedule.push({...schedule[0],id:'fixture.neil.upkeep',actor:CHARM_MENTOR_ID});
pack.householdActs={acts:[{id:setup,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up the aged charm fixture',
    description:'Begin with two held charms whose inscriptions have faded; Old Neil is napping nearby.',report:'You have two faded unused charms.',knowledgeKey:'fixture.upkeep',
    effects:[...beSeerDrinkEffects(),...beSeerSteadyEffects(),
        ...tingenSilverWorkshop.support.all.map(rule=>({type:'fact',scope:'actor',actor:'player',key:rule.fact.slice(6),value:true})),
        {type:'item',actor:'player',key,amount:2},
        {type:'fact',scope:'actor',actor:'player',key:ledgerKey,value:JSON.stringify([{id:'fixture-old-one',at:-CHARM_REVIEW_MINUTES},{id:'fixture-old-two',at:-CHARM_REVIEW_MINUTES+1}])},
        {type:'condition',actor:CHARM_MENTOR_ID,id:SLUMBER_SLEEP,operation:'apply',duration:5}]}]};
assert.deepEqual(validateLotmCast(pack),[]);
const captureOnly=process.argv.includes('--capture-unmet-only');
const externalBuild=process.argv.slice(2).find(arg=>arg!=='--capture-unmet-only');
const bundle=externalBuild?{dir:externalBuild,dispose:async()=>{}}:await buildBundle();
const output=await mkdtemp(join(tmpdir(),'oops-charm-upkeep-'));
const evidence=join(process.cwd(),'docs/representations/evidence/lotm-charm-upkeep-2026-11-25');
const server=await serve(bundle.dir);
const session=await new Session({url:server.url,seed:37,wall:Date.UTC(2026,10,25,15),opTimeout:45000,hooks:{beforeOpen:context=>{
    context.on('page',page=>page.on('pageerror',error=>console.error(error.stack)));
    return context.route('**/private_packs/**',route=>{
        const path=new URL(route.request().url()).pathname;
        const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:path.endsWith('/lotm-cast/cast.json')?pack:null;
        return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
    });}}});
const snapshot=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const button=id=>session.page.locator(`[data-lotm="${id}"]`).first();
const panel=()=>session.page.locator('#lotm_panel');
const details=()=>panel().evaluate(node=>node.querySelectorAll('details').forEach(detail=>{detail.open=true;}));
const show=async()=>{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().getByRole('tab',{name:'Here',exact:true}).click();await details();};
const boot=async()=>{const page=session.page;await page.waitForFunction(()=>!!window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());
    await page.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden');
    if(await page.locator('#loading_screen_play_button').isVisible())await page.locator('#loading_screen_play_button').click();
    await page.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');};
const step=async minutes=>{await session.page.evaluate(minutes=>window.advanceTicks(minutes,{render:true}),minutes);await details();};
const click=async id=>{await details();assert.equal(await button(id).isEnabled(),true,await button(id).getAttribute('title'));await button(id).click({force:true});};
const held=save=>save.inventories.person.main_character[key]?.count||0;
const reserve=save=>save.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve;
const ledger=save=>JSON.parse(save.expansion.actors.player.facts[ledgerKey]);
const sleep=save=>save.expansion.simulation.conditions[I.person]?.[SLUMBER_SLEEP];
const kept=save=>({held:held(save),reserve:reserve(save),ledger:ledger(save),clock:save.expansion.clock});
try {
    console.log('Launching the rebuilt upkeep fixture');
    await session.start();console.log('Browser started');await session.open();console.log('Native game opened');const page=session.page;
    await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
    await panel().getByText('Fixture life',{exact:false}).first().waitFor({state:'visible'});
    await page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));
    await show();console.log('Enrolled the upkeep fixture');await click(setup);await step(1);console.log('Aged stock prepared');
    const initial=await snapshot(); assert.equal(held(initial),2);
    assert.equal(await button(renew).isDisabled(),true);
    assert.match(await button(renew).getAttribute('title'),/Old Neil.*here and awake/);
    assert.match(await panel().innerText(),/oldest held Slumber charm is fading/);
    await mkdir(evidence,{recursive:true});await panel().locator(`[data-lotm-rite="${SLUMBER_UPKEEP}"]`).screenshot({path:join(evidence,'unmet-desktop.png')});
    if(captureOnly) console.log('Captured the native upkeep offer and unmet mentor feedback at 1920x1080.');
    else {
    await click(activate);await step(1);
    const faded=await snapshot();assert.equal(held(faded),1);assert.equal(reserve(faded),reserve(initial)-1);
    assert.equal(sleep(faded).expiresAt,faded.expansion.clock+2);
    assert.equal(ledger(faded)[0].id,'fixture-old-two');
    await step(5);const beforeRenew=await snapshot();await click(renew);
    const accepted=await snapshot();assert.equal(held(accepted),0,'the same unused silver is reserved with Neil');
    assert.equal(reserve(accepted),reserve(beforeRenew)-1,'the visit spends spirituality at admission');
    const visit=accepted.expansion.simulation.jobs.find(job=>job.commandId===renew);
    assert.ok(visit);const visitMinutes=visit.due-accepted.expansion.clock;
    console.log(JSON.stringify({phase:'visit',minutes:visitMinutes,requires:visit.completionSupport?.requires}));
    await step(visitMinutes);
    const renewed=await snapshot();console.log(JSON.stringify({phase:'settled',jobs:renewed.expansion.simulation.jobs.map(job=>job.commandId),log:renewed.expansion.simulation.log.slice(-2)}));assert.equal(held(renewed),1);
    assert.equal(renewed.expansion.clock,accepted.expansion.clock+visitMinutes);
    assert.deepEqual(ledger(renewed),[{id:'fixture-old-two',at:renewed.expansion.clock}]);
    assert.equal(await button(renew).isDisabled(),true);assert.match(await button(renew).getAttribute('title'),/fresh charge/);
    await panel().locator('[data-tab="notebook"]').click({force:true});
    await details();
    await panel().getByText(/returns the same charm, its charge renewed/).waitFor();
    await panel().screenshot({path:join(evidence,'renewed-desktop.png')});
    await page.locator('#save_button').click();await page.reload();await boot();await show();
    assert.deepEqual(kept(await snapshot()),kept(renewed));
    const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();
    const file=join(output,'charm-upkeep-export.txt');await(await download).saveAs(file);
    await page.evaluate(()=>localStorage.clear());await page.reload();await boot();
    const imported=page.waitForEvent('domcontentloaded');await page.locator('#saved_file_input').setInputFiles(file);await imported;await boot();await show();
    assert.deepEqual(kept(await snapshot()),kept(renewed));
    assert.equal(await button(renew).isDisabled(),true,'import cannot turn one finished visit into repeated upkeep reward');
    await click(activate);await step(1);
    const used=await snapshot();assert.equal(held(used),0);assert.deepEqual(ledger(used),[]);
    assert.equal(sleep(used).expiresAt,used.expansion.clock+5);
    assert.equal(await button(renew).isDisabled(),true);assert.match(await button(renew).getAttribute('title'),/finished Slumber charm/);
    assert.deepEqual(session.errors.filter(error=>error.kind==='pageerror'),[]);assert.equal((await session.uiCheck()).pageOverflow,0);
    const bundleHash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
    const proof={route:'synthetic aged Slumber workshop, normal native controls',viewport:'1920x1080',bundleHash,
        fadedMinutes:2,renewedMinutes:5,upkeepMinutes:visitMinutes,upkeepSpirituality:1,stockBefore:1,stockAfter:1,
        keptAfter:'save/reload/Export/literal Import',state:'agent-verified, not human-reviewed'};
    await writeFile(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
    }
} catch(error) {console.error(error.stack);console.error(session.errors.slice(-5));throw error;}
finally {await session.close();server.close();await bundle.dispose();await rm(output,{recursive:true,force:true});}
