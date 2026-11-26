// Second persistent reading handoff: revise a personal intention, deliberately
// spend into it through the native supply purchase, retain and use its materials.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildBundle,serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as I} from './helpers/conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects} from '../src/book_world_lotm_be_seer.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {SLUMBER_ORDER,SLUMBER_ROW,SLUMBER_USE} from '../src/lotm_silver_charms.js';
import {CHARM_MATERIAL_APPROVAL,CHARM_MATERIAL_ISSUE,CHARM_MATERIAL_ORDER,CHARM_MATERIAL_PAYER} from '../src/lotm_charm_materials.js';
import {CHARM_LENDER_MAKE,CHARM_LENDER_ARMORY} from '../src/lotm_charm_lender_stock.js';
import {CHARM_MENTOR_ID} from '../src/lotm_charm_upkeep.js';
import {CHARM_LOAN_ID,CHARM_LOAN_KEY,CHARM_REPLACEMENT_KEY,CHARM_LOAN_BORROW,CHARM_LOAN_RETURN,CHARM_LOAN_REPLACE,CHARM_LOAN_USE} from '../src/lotm_charm_loan.js';
import {SLUMBER_SLEEP} from '../src/lotm_silver_charms.js';
import {COMMISSION_EARMARK} from '../src/lotm_personal_earmark.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';

const setup='book.lotm.fixture_lender_stock.setup',approve=CHARM_MATERIAL_APPROVAL+'.approve',collect=CHARM_MATERIAL_ISSUE+'.collect';
const key=id=>JSON.stringify({id:'book.lotm.'+id}),inscribe=SLUMBER_ROW+'.inscribe',purchase=SLUMBER_ORDER+'.prepare';
const pack=JSON.parse(JSON.stringify(conversationKnowledgeFixture()).replaceAll(I.room,tingenSilverWorkshop.place));
pack.places.find(place=>place.id===I.other).name='Fixture Blackthorn reception';
pack.places.find(place=>place.id===tingenSilverWorkshop.place).name='Fixture silver workshop';
pack.placeAliases.push({id:'lotm.place.night-watch-reception',indexId:'lotm.place.night-watch-reception',place:I.other,label:'I',locator:'synthetic material fixture'});
pack.leadLife.profile.start=tingenSilverWorkshop.place;pack.leadLife.profile.cash=1000;
const mentor={...pack.people.find(person=>person.id===I.person),id:CHARM_MENTOR_ID,indexId:'lotm.person.old-neil',name:'Old Neil'};
pack.people.push(mentor);pack.leadLife.relations.push({person:CHARM_MENTOR_ID,kind:'colleague',date:'before start',locator:'synthetic loan fixture'});
for(const schedule of [pack.schedule,pack.bindings.schedule])schedule.push({...schedule[0],id:'fixture.neil.loan',actor:CHARM_MENTOR_ID,place:I.other});
pack.places.find(place=>place.id===I.other).name='Fixture Blackthorn armory';
pack.placeAliases.push({id:CHARM_LENDER_ARMORY,indexId:CHARM_LENDER_ARMORY,place:I.other,label:'I',locator:'synthetic armory fixture'});
const learn='book.lotm.fixture_lender_stock.seer';
pack.householdActs={acts:[{id:setup,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up the material comparison fixture',
    description:'Begin as an eligible workshop maker at reception, without materials or signed orders.',report:'Your workshop record is ready; you hold no materials or order.',knowledgeKey:'fixture.materials',
    effects:[
        ...tingenSilverWorkshop.support.all.map(rule=>({type:'fact',scope:'actor',actor:'player',key:rule.fact.slice(6),value:true}))]}]};
pack.householdActs.acts.push({id:learn,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up later Seer fixture prerequisites',description:'Prepare only the later use and personal replacement prerequisites.',report:'The later fixture Seer prerequisites are ready.',knowledgeKey:'fixture.lender.seer',effects:[...beSeerDrinkEffects(),...beSeerSteadyEffects()]});
assert.deepEqual(validateLotmCast(pack),[]);
const external=process.argv[2],bundle=external?{dir:external,dispose:async()=>{}}:await buildBundle();
const output=await mkdtemp(join(tmpdir(),'oops-lender-stock-'));
const evidence=join(process.cwd(),'docs/representations/evidence/lotm-lender-stock-2026-11-25');
const server=await serve(bundle.dir);
const session=new Session({url:server.url,seed:37,wall:Date.UTC(2026,10,25,15),opTimeout:30000,hooks:{beforeOpen:context=>
    context.route('**/private_packs/**',route=>{
        const path=new URL(route.request().url()).pathname;
        const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:path.endsWith('/lotm-cast/cast.json')?pack:null;
        return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
    })}});
const snapshot=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const panel=()=>session.page.locator('#lotm_panel'),button=id=>panel().locator(`[data-lotm="${id}"]`).first();
const open=()=>panel().evaluate(node=>node.querySelectorAll('details').forEach(detail=>{detail.open=true;}));
const show=async()=>{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().locator('[data-tab="here"]').click({force:true});await open();};
const click=async id=>{await open();assert.equal(await button(id).isEnabled(),true,await button(id).getAttribute('title'));await button(id).click({force:true});};
const step=async minutes=>{await session.page.evaluate(minutes=>window.advanceTicks(minutes,{render:true}),minutes);await open();};
const count=(save,item)=>save.inventories.person.main_character[item]?.count||0;
const payer=save=>save.expansion.actors.player.facts[CHARM_MATERIAL_PAYER];
const kept=save=>({purse:save.character.money,payer:payer(save),silver:count(save,key('slumber_silver')),supplies:count(save,key('slumber_supplies')),
    mentorFee:save.expansion.actors[CHARM_MENTOR_ID]?.resources?.money||0,jobs:save.expansion.simulation.jobs.map(job=>({id:job.id,commandId:job.commandId,due:job.due,participants:job.participants,costs:job.costs})),loan:save.expansion.simulation.custody[CHARM_LOAN_ID]||null,lenderOriginal:save.expansion.simulation.owners[CHARM_MENTOR_ID]?.[CHARM_LOAN_KEY]||0,lenderReplacement:save.expansion.simulation.owners[CHARM_MENTOR_ID]?.[CHARM_REPLACEMENT_KEY]||0,borrowed:count(save,CHARM_LOAN_KEY),earmark:save.expansion.actors.player.facts[COMMISSION_EARMARK],order:count(save,CHARM_MATERIAL_ORDER),charms:count(save,key('slumber_charm')),approvals:save.expansion.actors.player.completed[approve]});
const boot=async()=>{const page=session.page;await page.waitForFunction(()=>!!window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());
    await page.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden');
    if(await page.locator('#loading_screen_play_button').isVisible())await page.locator('#loading_screen_play_button').click({force:true});
    await page.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');};
async function roundTrip(label) {
    const page=session.page,before=kept(await snapshot());await page.locator('#save_button').click();await page.reload();await boot();await show();assert.deepEqual(kept(await snapshot()),before);
    const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const file=join(output,label+'.txt');await(await download).saveAs(file);
    await page.evaluate(()=>localStorage.clear());await page.reload();await boot();const imported=page.waitForEvent('domcontentloaded');await page.locator('#saved_file_input').setInputFiles(file);await imported;await boot();await show();
    assert.deepEqual(kept(await snapshot()),before);
}
try {
    console.log('Opening the rebuilt zero-stock mentor fixture');await session.start();await session.open();const page=session.page;
    await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().getByText('Fixture life',{exact:false}).first().waitFor();
    await page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();await click(setup);await step(1);
    const make=CHARM_LENDER_MAKE+'.make',borrow=CHARM_LOAN_BORROW+'.borrow',returnUnused=CHARM_LOAN_RETURN+'.return',replace=CHARM_LOAN_REPLACE+'.replace',use=CHARM_LOAN_USE+'.activate';
    const stock=save=>save.expansion.simulation.owners[CHARM_MENTOR_ID]?.[CHARM_LOAN_KEY]||0,fee=save=>save.expansion.actors[CHARM_MENTOR_ID].resources.money||0;
    const walk=async name=>{await panel().getByRole('button',{name:new RegExp('Walk to '+name)}).click({force:true});await step(2);};
    const initial=await snapshot();assert.equal(stock(initial),0);assert.equal(count(initial,CHARM_LOAN_KEY),0);assert.equal(count(initial,CHARM_REPLACEMENT_KEY),0);
    await click(purchase);await step(35);const supplied=await snapshot();assert.equal(supplied.character.money,904);assert.equal(count(supplied,key('slumber_silver')),1);assert.equal(count(supplied,key('slumber_supplies')),1);assert.equal(await button(inscribe).isDisabled(),true);
    await walk('Fixture Blackthorn armory');assert.equal(await button(borrow).isDisabled(),true);await click(make);await step(6);const reserved=await snapshot();assert.equal(reserved.character.money,892);assert.equal(count(reserved,key('slumber_silver')),0);assert.equal(stock(reserved),0);assert.ok(reserved.expansion.simulation.jobs[0].participants.includes(CHARM_MENTOR_ID));
    await roundTrip('mentor-in-progress');await button('cancel').click({force:true});const stopped=await snapshot();assert.equal(stopped.character.money,904);assert.equal(count(stopped,key('slumber_silver')),1);assert.equal(count(stopped,key('slumber_supplies')),1);assert.equal(stock(stopped),0);assert.equal(fee(stopped),0);
    await click(make);await step(12);const made=await snapshot();assert.equal(made.character.money,892);assert.equal(count(made,key('slumber_silver')),0);assert.equal(count(made,key('slumber_supplies')),0);assert.equal(stock(made),1);assert.equal(fee(made),12);assert.equal(count(made,CHARM_LOAN_KEY),0);assert.equal(count(made,CHARM_REPLACEMENT_KEY),0);
    await mkdir(evidence,{recursive:true});await panel().locator(`[data-lotm-rite="${CHARM_LENDER_MAKE}"]`).screenshot({path:join(evidence,'mentor-stock-made.png')});await roundTrip('earned-source-stock');
    await click(borrow);await step(1);assert.equal(stock(await snapshot()),0);assert.equal(count(await snapshot(),CHARM_LOAN_KEY),1);await click(returnUnused);await step(1);assert.equal(stock(await snapshot()),1);
    await walk('Fixture silver workshop');await click(learn);await step(1);await walk('Fixture Blackthorn armory');await click(borrow);await step(1);await click(use);await step(1);assert.equal(stock(await snapshot()),0);assert.ok((await snapshot()).expansion.simulation.custody[CHARM_LOAN_ID]);
    await walk('Fixture silver workshop');await click(purchase);await step(35);await click(inscribe);await step(12);assert.equal(count(await snapshot(),CHARM_REPLACEMENT_KEY),1);await walk('Fixture Blackthorn armory');await click(replace);await step(1);
    const repaid=await snapshot();assert.equal(stock(repaid),1);assert.equal(repaid.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_REPLACEMENT_KEY]||0,0);assert.equal(repaid.expansion.simulation.custody[CHARM_LOAN_ID],undefined);assert.equal(count(repaid,CHARM_REPLACEMENT_KEY),0);assert.equal(repaid.character.money,796);
    assert.equal(await button(borrow).isEnabled(),true);await click(borrow);await step(1);assert.equal(stock(await snapshot()),0);assert.equal(count(await snapshot(),CHARM_LOAN_KEY),1);await click(returnUnused);await step(1);assert.equal(stock(await snapshot()),1);assert.equal((await snapshot()).expansion.simulation.custody[CHARM_LOAN_ID],undefined);
    await roundTrip('repaid-and-lendable');await panel().locator('[data-lotm-charm-loan]').screenshot({path:join(evidence,'repaid-stock-lendable.png')});
    assert.deepEqual(session.errors.filter(error=>error.kind==='pageerror'),[]);assert.equal((await session.uiCheck()).pageOverflow,0);
    const bundleHash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
    const proof={bundleHash,viewport:'1920x1080',route:'zero-charms native actor fixture, actual purchase, supplied paid mentor making, loan and earned replenishment',
        startingCharms:0,mentorFeePence:12,mentorMinutes:12,suppliesCostPence:96,cancelledMaking:'cash and both materials refunded, elapsed6minutes retained, no stock or mentor fee granted',
        feeReceivedByActualMentor:12,earnedSourceStock:1,playerCouldPersonallyInscribeInitially:false,repaymentBecomesLendable:true,secondLoanAndUnusedReturnConserved:1,
        endingCash:796,keptAfter:'save/reload/Export/literal Import mid-making, after earned stock, after repaid and reused stock',state:'agent-verified, not human-reviewed'};
    await writeFile(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
} catch(error) {console.error(error.stack);console.error(session.errors.slice(-5));throw error;}
finally {await session.browser?.close().catch(()=>{});server.close();await bundle.dispose();await rm(output,{recursive:true,force:true});}
