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
import {COMMISSION_EARMARK} from '../src/lotm_personal_earmark.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';

const setup='book.lotm.fixture_personal_earmark.setup',approve=CHARM_MATERIAL_APPROVAL+'.approve',collect=CHARM_MATERIAL_ISSUE+'.collect';
const key=id=>JSON.stringify({id:'book.lotm.'+id}),inscribe=SLUMBER_ROW+'.inscribe',purchase=SLUMBER_ORDER+'.prepare';
const pack=JSON.parse(JSON.stringify(conversationKnowledgeFixture()).replaceAll(I.room,tingenSilverWorkshop.place));
pack.places.find(place=>place.id===I.other).name='Fixture Blackthorn reception';
pack.places.find(place=>place.id===tingenSilverWorkshop.place).name='Fixture silver workshop';
pack.placeAliases.push({id:'lotm.place.night-watch-reception',indexId:'lotm.place.night-watch-reception',place:I.other,label:'I',locator:'synthetic material fixture'});
pack.leadLife.profile.start=tingenSilverWorkshop.place;pack.leadLife.profile.cash=1000;
pack.householdActs={acts:[{id:setup,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up the material comparison fixture',
    description:'Begin as an eligible workshop maker at reception, without materials or signed orders.',report:'Your workshop record is ready; you hold no materials or order.',knowledgeKey:'fixture.materials',
    effects:[...beSeerDrinkEffects(),...beSeerSteadyEffects(),
        ...tingenSilverWorkshop.support.all.map(rule=>({type:'fact',scope:'actor',actor:'player',key:rule.fact.slice(6),value:true}))]}]};
assert.deepEqual(validateLotmCast(pack),[]);
const external=process.argv[2],bundle=external?{dir:external,dispose:async()=>{}}:await buildBundle();
const output=await mkdtemp(join(tmpdir(),'oops-personal-earmark-'));
const evidence=join(process.cwd(),'docs/representations/evidence/lotm-personal-earmark-2026-11-25');
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
    earmark:save.expansion.actors.player.facts[COMMISSION_EARMARK],order:count(save,CHARM_MATERIAL_ORDER),charms:count(save,key('slumber_charm')),approvals:save.expansion.actors.player.completed[approve]});
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
    console.log('Opening the rebuilt personal earmark fixture');await session.start();await session.open();const page=session.page;
    await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await panel().getByText('Fixture life',{exact:false}).first().waitFor();
    await page.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));await show();await click(setup);await step(1);
    const shopping=()=>panel().locator('[data-lotm-personal-shopping]');
    const initial=await snapshot();assert.equal(initial.character.money,1000);
    await shopping().getByRole('button',{name:'Set aside four pounds',exact:true}).click({force:true});
    assert.equal((await snapshot()).expansion.actors.player.facts[COMMISSION_EARMARK],960);
    assert.equal((await snapshot()).character.money,1000);
    await shopping().getByText(/short by 56 pence/).waitFor();
    await shopping().getByRole('spinbutton').fill('900');
    await shopping().getByRole('button',{name:'Revise intended remainder',exact:true}).click({force:true});
    await shopping().getByText(/4 pence available after that intention/).waitFor();
    await shopping().getByRole('button',{name:'Set aside four pounds',exact:true}).click({force:true});
    await mkdir(evidence,{recursive:true});await shopping().screenshot({path:join(evidence,'before-purchase.png')});
    await shopping().getByRole('button',{name:'Buy supplies using intended commission money',exact:true}).click({force:true});await step(35);
    const bought=await snapshot();assert.equal(bought.character.money,904);assert.equal(bought.expansion.actors.player.facts[COMMISSION_EARMARK],960);
    assert.equal(count(bought,key('slumber_silver')),1);assert.equal(count(bought,key('slumber_supplies')),1);
    await roundTrip('bought-materials');
    await shopping().getByText(/purse is 56 pence short/).waitFor();
    await shopping().getByRole('spinbutton').fill('800');await shopping().getByRole('button',{name:'Revise intended remainder',exact:true}).click({force:true});
    assert.equal((await snapshot()).character.money,904);
    await shopping().getByText(/Available after that intention: 104 pence/).waitFor();
    await shopping().screenshot({path:join(evidence,'revised-after-purchase.png')});
    await roundTrip('revised-intention');await click(inscribe);await step(12);
    const made=await snapshot();assert.equal(count(made,key('slumber_charm')),1);assert.equal(count(made,key('slumber_silver')),0);assert.equal(count(made,key('slumber_supplies')),0);assert.equal(made.character.money,904);
    await shopping().getByRole('button',{name:'Clear the intention',exact:true}).click({force:true});
    assert.equal((await snapshot()).expansion.actors.player.facts[COMMISSION_EARMARK],0);assert.equal((await snapshot()).character.money,904);
    assert.deepEqual(session.errors.filter(error=>error.kind==='pageerror'),[]);assert.equal((await session.uiCheck()).pageOverflow,0);
    const bundleHash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
    const proof={proposalId:'977a42730945b0ba79250e106e71c8f2c0518411248ee9067218820fc86d7715',bundleHash,viewport:'1920x1080',
        route:'named eligible workshop fixture, normal intention and purchase controls',nativePurseBefore:1000,nativePurseAfter:904,intentionAtPurchase:960,shortfall:56,revisedIntention:800,revisedAvailable:104,
        materials:'one existing silver blank and one ritual packet, consumed by existing Slumber inscription',
        keptAfter:'save/reload/Export/literal Import after purchase and revision',state:'agent-verified, not human-reviewed'};
    await writeFile(join(evidence,'proof.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof));
} catch(error) {console.error(error.stack);console.error(session.errors.slice(-5));throw error;}
finally {await session.browser?.close().catch(()=>{});server.close();await bundle.dispose();await rm(output,{recursive:true,force:true});}
