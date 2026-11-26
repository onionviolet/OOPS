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
import {CHARM_MENTOR_ID} from '../src/lotm_charm_upkeep.js';
import {CHARM_LOAN_ID,CHARM_LOAN_KEY,CHARM_REPLACEMENT_KEY,CHARM_LOAN_BORROW,CHARM_LOAN_RETURN,CHARM_LOAN_REPLACE,CHARM_LOAN_USE} from '../src/lotm_charm_loan.js';
import {SLUMBER_SLEEP} from '../src/lotm_silver_charms.js';
import {COMMISSION_EARMARK} from '../src/lotm_personal_earmark.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';

const setup='book.lotm.fixture_charm_loan.setup',approve=CHARM_MATERIAL_APPROVAL+'.approve',collect=CHARM_MATERIAL_ISSUE+'.collect';
const key=id=>JSON.stringify({id:'book.lotm.'+id}),inscribe=SLUMBER_ROW+'.inscribe',purchase=SLUMBER_ORDER+'.prepare';
const pack=JSON.parse(JSON.stringify(conversationKnowledgeFixture()).replaceAll(I.room,tingenSilverWorkshop.place));
pack.places.find(place=>place.id===I.other).name='Fixture Blackthorn reception';
pack.places.find(place=>place.id===tingenSilverWorkshop.place).name='Fixture silver workshop';
pack.placeAliases.push({id:'lotm.place.night-watch-reception',indexId:'lotm.place.night-watch-reception',place:I.other,label:'I',locator:'synthetic material fixture'});
pack.leadLife.profile.start=tingenSilverWorkshop.place;pack.leadLife.profile.cash=1000;
const mentor={...pack.people.find(person=>person.id===I.person),id:CHARM_MENTOR_ID,indexId:'lotm.person.old-neil',name:'Old Neil'};
pack.people.push(mentor);pack.leadLife.relations.push({person:CHARM_MENTOR_ID,kind:'colleague',date:'before start',locator:'synthetic loan fixture'});
for(const schedule of [pack.schedule,pack.bindings.schedule])schedule.push({...schedule[0],id:'fixture.neil.loan',actor:CHARM_MENTOR_ID});
pack.householdActs={acts:[{id:setup,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up the material comparison fixture',
    description:'Begin as an eligible workshop maker at reception, without materials or signed orders.',report:'Your workshop record is ready; you hold no materials or order.',knowledgeKey:'fixture.materials',
    effects:[...beSeerDrinkEffects(),...beSeerSteadyEffects(),{type:'item',actor:CHARM_MENTOR_ID,key:CHARM_LOAN_KEY,amount:1},
        ...tingenSilverWorkshop.support.all.map(rule=>({type:'fact',scope:'actor',actor:'player',key:rule.fact.slice(6),value:true}))]}]};
assert.deepEqual(validateLotmCast(pack),[]);
const external=process.argv[2],bundle=external?{dir:external,dispose:async()=>{}}:await buildBundle();
const output=await mkdtemp(join(tmpdir(),'oops-charm-loan-'));
const evidence=join(process.cwd(),'docs/representations/evidence/lotm-charm-loan-2026-11-25');
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
    loan:save.expansion.simulation.custody[CHARM_LOAN_ID]||null,lenderOriginal:save.expansion.simulation.owners[CHARM_MENTOR_ID]?.[CHARM_LOAN_KEY]||0,lenderReplacement:save.expansion.simulation.owners[CHARM_MENTOR_ID]?.[CHARM_REPLACEMENT_KEY]||0,borrowed:count(save,CHARM_LOAN_KEY),earmark:save.expansion.actors.player.facts[COMMISSION_EARMARK],order:count(save,CHARM_MATERIAL_ORDER),charms:count(save,key('slumber_charm')),approvals:save.expansion.actors.player.completed[approve]});
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
    console.log('Opening the rebuilt borrowed charm fixture');await session.start();await session.open();const page=session.page;
    await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().getByText('Fixture life',{exact:false}).first().waitFor();
    await page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();await click(setup);await step(1);
    const shopping=()=>panel().locator('[data-lotm-personal-shopping]'),loanPanel=()=>panel().locator('[data-lotm-charm-loan]');
    const borrow=CHARM_LOAN_BORROW+'.borrow',returnUnused=CHARM_LOAN_RETURN+'.return',replace=CHARM_LOAN_REPLACE+'.replace',use=CHARM_LOAN_USE+'.activate';
    const initial=await snapshot();assert.equal(initial.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_LOAN_KEY],1);assert.equal(count(initial,CHARM_LOAN_KEY),0);
    await click(borrow);await step(1);let held=await snapshot();assert.equal(count(held,CHARM_LOAN_KEY),1);assert.equal(held.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_LOAN_KEY]||0,0);assert.equal(held.expansion.simulation.custody[CHARM_LOAN_ID].owner,CHARM_MENTOR_ID);assert.equal(await button(borrow).isDisabled(),true);
    await roundTrip('borrowed-original');
    await click(returnUnused);await step(1);const returned=await snapshot();assert.equal(count(returned,CHARM_LOAN_KEY),0);assert.equal(returned.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_LOAN_KEY],1);assert.equal(returned.expansion.simulation.custody[CHARM_LOAN_ID],undefined);
    await click(borrow);await step(1);await click(use);await step(1);const burned=await snapshot();assert.equal(count(burned,CHARM_LOAN_KEY),0);assert.ok(burned.expansion.simulation.custody[CHARM_LOAN_ID]);assert.ok(burned.expansion.simulation.conditions[CHARM_MENTOR_ID][SLUMBER_SLEEP].expiresAt>burned.expansion.clock);
    assert.equal(await button(use).isDisabled(),true);assert.equal(await button(replace).isDisabled(),true);await loanPanel().getByText(/replacement in kind/).waitFor();
    await mkdir(evidence,{recursive:true});await loanPanel().screenshot({path:join(evidence,'consumed-still-owed.png')});await roundTrip('consumed-debt');
    await shopping().getByRole('button',{name:'Set aside four pounds',exact:true}).click({force:true});assert.equal((await snapshot()).character.money,1000);
    await shopping().getByRole('button',{name:'Buy supplies using intended commission money',exact:true}).click({force:true});await step(35);
    const bought=await snapshot();assert.equal(bought.character.money,904);assert.equal(bought.expansion.actors.player.facts[COMMISSION_EARMARK],960);assert.equal(count(bought,key('slumber_silver')),1);assert.equal(count(bought,key('slumber_supplies')),1);
    await shopping().getByRole('spinbutton').fill('800');await shopping().getByRole('button',{name:'Revise intended remainder',exact:true}).click({force:true});await shopping().getByText(/Available after that intention: 104 pence/).waitFor();
    await click(inscribe);await step(12);assert.equal(count(await snapshot(),CHARM_REPLACEMENT_KEY),1);await roundTrip('crafted-replacement');
    await click(replace);await step(1);const settled=await snapshot();assert.equal(settled.expansion.simulation.custody[CHARM_LOAN_ID],undefined);assert.equal(count(settled,CHARM_REPLACEMENT_KEY),0);assert.equal(count(settled,CHARM_LOAN_KEY),0);assert.equal((settled.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_REPLACEMENT_KEY]||0)+(settled.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_LOAN_KEY]||0),1);assert.equal(settled.character.money,904);
    await roundTrip('settled-loan');assert.equal(await button(borrow).isEnabled(),(settled.expansion.simulation.owners[CHARM_MENTOR_ID][CHARM_LOAN_KEY]||0)>0);await loanPanel().getByText(/No Slumber charm is currently owed/).waitFor();
    await loanPanel().screenshot({path:join(evidence,'replacement-returned.png')});
    await panel().locator('[data-tab="notebook"]').click({force:true});await open();await panel().getByText(/loan is settled in kind/).waitFor();
    assert.deepEqual(session.errors.filter(error=>error.kind==='pageerror'),[]);assert.equal((await session.uiCheck()).pageOverflow,0);
    const bundleHash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
    const proof={proposalId:'d36ab6955de9976f57e6204e1cecd183e12acdc64f322f694b686582aecdb773',bundleHash,viewport:'1920x1080',route:'named prerequisite fixture with one actual Old Neil charm, ordinary borrow/return/burn/craft/replacement controls',
        lenderStockBefore:1,borrowedStockAfterBurn:0,obligationAfterBurn:true,lenderReplacementAfterSettlement:1,obligationAfterSettlement:false,
        earmarkRecheck:{cashBefore:1000,cashAfter:904,intended:960,revised:800,availableAfterRevision:104},
        keptAfter:'save/reload/Export/literal Import while borrowed, after burn, after craft, and after replacement',state:'agent-verified, not human-reviewed'};
    await writeFile(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
} catch(error) {console.error(error.stack);console.error(session.errors.slice(-5));throw error;}
finally {await session.browser?.close().catch(()=>{});server.close();await bundle.dispose();await rm(output,{recursive:true,force:true});}
