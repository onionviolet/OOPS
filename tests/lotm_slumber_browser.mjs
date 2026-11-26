// Rebuilt desktop proof for Slumber or, with --soothing, the workshop alarm.
// The synthetic cast provides the setting and prerequisites. Charm actions use game buttons.
import assert from 'node:assert/strict';
import {readFile, mkdtemp, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildBundle,serve,Session} from '../scripts/playtest/lib.mjs';
import {conversationKnowledgeFixture,CONVERSATION_FIXTURE_IDS as I} from './helpers/conversation_knowledge_fixture.mjs';
import {beSeerDrinkEffects,beSeerSteadyEffects,beSeerCogitateEffects,BE_SEER_ENERGY_ID} from '../src/book_world_lotm_be_seer.js';
import {tingenSilverWorkshop} from '../src/lotm_amulet_crafting.js';
import {SLUMBER_ROW,SLUMBER_ORDER,SLUMBER_USE,SLUMBER_SLEEP,SOOTHING_ROW,SOOTHING_CALM} from '../src/lotm_silver_charms.js';
import {bellClerk,bellClerkCommands,bellRinging,bellRopeClear} from '../src/lotm_soothing_bell.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
import {validateLotmCast} from '../src/book_world_lotm_cast.js';

const setup='book.lotm.fixture_slumber_workshop.setup';
const recover='book.lotm.fixture_slumber_workshop.recover';
const order=SLUMBER_ORDER+'.prepare', inscribe=SLUMBER_ROW+'.inscribe', activate=SLUMBER_USE+'.activate';
const pack=JSON.parse(JSON.stringify(conversationKnowledgeFixture()).replaceAll(I.room,tingenSilverWorkshop.place));
pack.leadLife.profile.cash=200;
for(const rows of [pack.schedule,pack.bindings.schedule]) rows.find(row=>row.actor===I.away).to=55;
pack.householdActs={acts:[{
    id:setup,place:tingenSilverWorkshop.place,operation:'use',minutes:1,label:'Set up the Slumber workshop fixture',
    description:'Prepare the engraving desk and the workshop account.',report:'The desk is ready.',
    knowledgeKey:'fixture.slumber.workshop',effects:[
        ...beSeerDrinkEffects(),...beSeerSteadyEffects(),
        ...tingenSilverWorkshop.support.all.map(rule=>({type:'fact',scope:'actor',actor:'player',key:rule.fact.slice(6),value:true}))
    ]
},{
    id:recover,place:tingenSilverWorkshop.place,operation:'sit',minutes:10,label:'Recover spirituality for the second trial',
    description:'Take a quiet moment before working again.',report:'Your spirituality returns.',
    knowledgeKey:'fixture.slumber.recovery',effects:beSeerCogitateEffects()
}]};
assert.deepEqual(validateLotmCast(pack),[]);
const soothing=process.argv.includes('--soothing');
const externalBuild=process.argv.slice(2).find(arg=>arg!=='--soothing');
const bundle=externalBuild?{dir:externalBuild,dispose:async()=>{}}:await buildBundle();
const output=await mkdtemp(join(tmpdir(),'oops-slumber-proof-'));
const server=await serve(bundle.dir);
const session=await new Session({url:server.url,seed:37,wall:Date.UTC(2026,10,24,15),opTimeout:15000,hooks:{beforeOpen:context=>
    context.route('**/private_packs/**',route=>{
        const path=new URL(route.request().url()).pathname;
        const data=path.endsWith('/manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}
            :path.endsWith('/lotm-cast/cast.json')?pack:null;
        return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
    })
}}).start();
const snapshot=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
const button=id=>session.page.locator(`[data-lotm="${id}"]`).first();
const panel=()=>session.page.locator('#lotm_panel');
const openDetails=()=>panel().evaluate(n=>n.querySelectorAll('details').forEach(d=>{d.open=true;}));
const show=async()=>{
    await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
    await panel().getByRole('tab',{name:'Here',exact:true}).click();
    await openDetails();
};
const step=async minutes=>{
    const elapsed=await session.page.evaluate(minutes=>{
        const before=window.simulationTestHooks.clock();
        window.advanceTicks(minutes,{render:true});
        return window.simulationTestHooks.clock()-before;
    },minutes);
    if(elapsed!==minutes){
        const saveStatus=await session.page.evaluate(()=>window.simulationTestHooks.saveStatus());
        throw Error(`Expected ${minutes} game minutes, advanced ${elapsed}. ${JSON.stringify(saveStatus)}. ${await panel().locator('[role="status"]').allTextContents()}`);
    }
    await openDetails();
};
const click=async id=>{
    const target=button(id);
    await target.waitFor({state:'attached'});
    await target.evaluate(node=>{for(let a=node.parentElement;a;a=a.parentElement) if(a.tagName==='DETAILS') a.open=true;});
    assert.equal(await target.isEnabled(),true,await target.getAttribute('title')||id);
    await target.click();
};
const count=(save,id)=>save.inventories.person.main_character[JSON.stringify({id:'book.lotm.'+id})]?.count??0;
const reserve=save=>save.expansion.simulation.energies.player[BE_SEER_ENERGY_ID].reserve;
const sleep=(save,id)=>save.expansion.simulation.conditions[id]?.[SLUMBER_SLEEP];
const report=save=>Object.entries(save.expansion.simulation.knowledge.player)
    .findLast(([key])=>/^book\.lotm\.history\.slumber\.\d+$/.test(key))?.[1]?.value;
const persistence=save=>({money:save.character.money,charm:count(save,'slumber_charm'),reserve:reserve(save),
    asleep:sleep(save,I.person),report:report(save)});
const boot=async()=>{
    const p=session.page;
    await p.waitForFunction(()=>!!window.simulationTestHooks);
    await p.evaluate(()=>window.simulationTestHooks.pause());
    await p.waitForFunction(()=>document.getElementById('loading_screen_play_button')?.checkVisibility()||
        document.getElementById('loading_screen')?.style.visibility==='hidden');
    const play=p.locator('#loading_screen_play_button');
    if(await play.isVisible()) await play.click();
    await p.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');
};

async function proveSoothing() {
    const p=session.page;
    const throwId=SOOTHING_ROW+'-use.activate';
    const clerk=bellClerk.id;
    const [pull,stepBack]=bellClerkCommands.map(command=>command.id);
    const facts=save=>save.expansion.worlds[LOTM_IDS.world].facts;
    const condition=(save,id)=>save.expansion.simulation.conditions[id]?.[SOOTHING_CALM];
    const actions=save=>save.expansion.actors[clerk].completed;
    const muffle='lotm.workshop-bell.muffle.muffle';
    assert.equal(await button(throwId).isDisabled(),true);
    assert.match(await button(throwId).getAttribute('title'),/need a finished Soothing charm/);

    await click('lotm.workshop-bell.answer.answer');
    await step(2);
    const frightened=await snapshot();
    assert.equal(actions(frightened)[pull],1);
    assert.equal(facts(frightened)[bellRinging],true);
    assert.equal(facts(frightened)[bellRopeClear],false);
    assert.equal(await button(muffle).isDisabled(),true);
    assert.match(await panel().innerText(),/The clerk keeps yanking the rope/);
    console.log('PASS the ringing bell makes the clerk pull the rope and blocks the player');

    const before=await snapshot();
    await click(SOOTHING_ROW+'-supplies.prepare');
    await step(35);
    const supplies=await snapshot();
    assert.equal(supplies.character.money,before.character.money-96);
    assert.equal(count(supplies,'soothing_silver'),1);
    assert.equal(count(supplies,'soothing_supplies'),1);
    await click(SOOTHING_ROW+'.inscribe');
    await step(12);
    const held=await snapshot();
    assert.equal(count(held,'soothing_silver')+count(held,'soothing_supplies'),0);
    assert.equal(count(held,'soothing_charm'),1);
    assert.equal(reserve(held),reserve(before)-1);
    assert.match(await panel().innerText(),/One Soothing charm and one point of spirituality/);

    await click(throwId);
    await step(1);
    const calmed=await snapshot();
    assert.equal(count(calmed,'soothing_charm'),0);
    assert.equal(reserve(calmed),reserve(held)-1);
    assert.ok(condition(calmed,clerk));
    assert.ok(condition(calmed,'player'));
    assert.equal(condition(calmed,I.away),undefined);
    assert.equal(actions(calmed)[stepBack],1);
    assert.equal(actions(calmed)[pull],1);
    assert.equal(facts(calmed)[bellRinging],true);
    assert.equal(facts(calmed)[bellRopeClear],true);
    assert.equal(await button(muffle).isEnabled(),true);
    assert.match(await panel().innerText(),/The bell is still ringing. The clerk has stepped back/);
    await panel().locator('[data-tab="notebook"]').click();
    await panel().getByText(/The workshop clerk grows calmer/).waitFor({state:'visible'});
    console.log('PASS Soothing spends the held charm and the clerk steps back while the bell keeps ringing');

    const saved=save=>({bell:facts(save)[bellRinging],rope:facts(save)[bellRopeClear],calm:condition(save,clerk),
        actions:actions(save),charm:count(save,'soothing_charm'),reserve:reserve(save)});
    await p.locator('#save_button').click();
    await p.reload();
    await boot();
    await show();
    assert.deepEqual(saved(await snapshot()),saved(calmed));
    const download=p.waitForEvent('download');
    await p.locator('#save_to_file_button').click();
    const file=join(output,'soothing-export.txt');
    await (await download).saveAs(file);

    await step(5);
    const wornOff=await snapshot();
    assert.equal(condition(wornOff,clerk),undefined);
    assert.equal(actions(wornOff)[pull],2);
    assert.equal(facts(wornOff)[bellRinging],true);
    assert.equal(await button(muffle).isDisabled(),true);

    await p.evaluate(()=>localStorage.clear());
    await p.reload();
    await boot();
    const imported=p.waitForEvent('domcontentloaded');
    await p.locator('#saved_file_input').setInputFiles(file);
    await imported;
    await boot();
    await show();
    assert.deepEqual(saved(await snapshot()),saved(calmed));
    await click(muffle);
    await step(1);
    assert.equal(facts(await snapshot())[bellRinging],false);
    await step(5);
    const resolved=await snapshot();
    assert.equal(condition(resolved,clerk),undefined);
    assert.equal(actions(resolved)[pull],1);
    await panel().locator('[data-tab="notebook"]').click();
    await panel().getByText('You wrap the clapper. The workshop falls quiet.',{exact:true}).waitFor({state:'visible'});
    console.log('PASS Save, reload, Export, Import, expiry and physically stopping the bell');
}

async function proveSlumber() {
    const p=session.page;
    const before=await snapshot();
    assert.equal(await button(activate).isDisabled(),true);
    assert.match(await button(activate).getAttribute('title'),/need a finished Slumber charm/);
    assert.equal(await button(inscribe).isDisabled(),true);
    assert.equal(count(before,'slumber_charm'),0);
    assert.match(await panel().innerText(),/8 soli/);
    console.log('PASS missing supplies and missing charm are visible before spending');

    await click(order);
    await step(35);
    const supplied=await snapshot();
    assert.equal(supplied.character.money,before.character.money-96);
    assert.equal(count(supplied,'slumber_silver'),1);
    assert.equal(count(supplied,'slumber_supplies'),1);
    await click(inscribe);
    await step(12);
    const held=await snapshot();
    assert.equal(count(held,'slumber_silver')+count(held,'slumber_supplies'),0);
    assert.equal(count(held,'slumber_charm'),1);
    assert.equal(reserve(held),reserve(before)-1);
    assert.equal(sleep(held,I.person),undefined);
    assert.equal(await button(I.offer).isEnabled(),true);
    assert.match(await panel().innerText(),/One Slumber charm and one point of spirituality/);
    console.log('PASS paid order and inscription put a quiet, unused charm in inventory');

    await click(activate);
    await step(1);
    const used=await snapshot();
    assert.equal(count(used,'slumber_charm'),0);
    assert.equal(reserve(used),reserve(held)-1);
    assert.equal(sleep(used,I.person)?.expiresAt,used.expansion.clock+5);
    assert.equal(sleep(used,I.away),undefined);
    assert.equal(sleep(used,'player'),undefined);
    assert.match(report(used),/You feel drowsy.*Fixture neighbour falls asleep/);
    assert.doesNotMatch(report(used),/Absent neighbour/);
    assert.equal(await button(I.offer).isDisabled(),true);
    assert.match(await button(I.offer).getAttribute('title'),/fell asleep/);
    await panel().locator('[data-tab="notebook"]').click();
    await panel().getByText(report(used),{exact:true}).waitFor({state:'visible'});
    console.log('PASS the throw spends the held charm, sleeps only the nearby person and blocks conversation');

    await p.locator('#save_button').click();
    await p.reload();
    await boot();
    await show();
    assert.deepEqual(persistence(await snapshot()),persistence(used));
    const download=p.waitForEvent('download');
    await p.locator('#save_to_file_button').click();
    const file=join(output,'slumber-export.txt');
    await (await download).saveAs(file);
    // Load with empty storage so the imported state cannot be supplied by a prior save.
    await p.evaluate(()=>localStorage.clear());
    await p.reload();
    await boot();
    const imported=p.waitForEvent('domcontentloaded');
    await p.locator('#saved_file_input').setInputFiles(file);
    await imported;
    await boot();
    await show();
    assert.deepEqual(persistence(await snapshot()),persistence(used));
    assert.equal(await button(I.offer).isDisabled(),true);
    await step(5);
    assert.equal(sleep(await snapshot(),I.person),undefined);
    assert.equal(await button(I.offer).isEnabled(),true);
    await click(I.offer);
    await step(2);
    assert.ok((await snapshot()).expansion.simulation.knowledge[I.person]?.[I.privateKey]);
    console.log('PASS Save, reload, Export, Import, wake and completed conversation');

    await click(recover);
    await step(10);
    await click(order);
    await step(35);
    await click(inscribe);
    await step(12);
    await p.locator('#save_button').click();
    await p.reload();
    await boot();
    await show();
    assert.equal(count(await snapshot(),'slumber_charm'),1);
    await panel().getByRole('button',{name:/Walk to Other fixture room/}).click();
    await step(2);
    const empty=await snapshot();
    assert.equal(empty.expansion.simulation.people.player.location,I.other);
    assert.equal(empty.expansion.simulation.people[I.away].location,I.other,'last saved place is stale after the presence window');
    await click(activate);
    await step(1);
    const wasted=await snapshot();
    assert.equal(count(wasted,'slumber_charm'),0);
    assert.equal(reserve(wasted),reserve(empty)-1);
    assert.match(report(wasted),/No one else is in reach/);
    assert.equal(sleep(wasted,I.away),undefined);
    console.log('PASS a held charm survives reload and burns in a different room after its occupant has left');
}

try {
    await session.open();
    console.log('Opened the rebuilt game');
    const p=session.page;
    await p.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
    await panel().getByText('Fixture life',{exact:false}).first().waitFor({state:'visible'});
    await p.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));
    console.log('Enrolled the synthetic Tingen life');
    await show();
    await click(setup);
    console.log('Started the fixture workshop setup');
    await step(1);
    await (soothing?proveSoothing():proveSlumber());
    assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
    assert.equal((await session.uiCheck()).pageOverflow,0);
    const hash=createHash('sha256').update(await readFile(join(bundle.dir,'bundle.js'))).digest('hex');
    console.log('PASS 1920×1080 desktop. Bundle SHA-256 '+hash);
} catch(error) {
    console.error(session.errors.filter(e=>!e.text.includes('404')).slice(-5));
    throw error;
} finally {
    await session.close();
    server.close();
    await bundle.dispose();
    await rm(output,{recursive:true,force:true});
}
