import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-home-system-proof');await mkdir(out,{recursive:true});
const server=await serve(root),missing=[],session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000,
    hooks:{beforeOpen:c=>c.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);})}});
const receipt={checks:[],setup:'Fresh disposable origins and rebuilt candidate. Starts, supplier purchases, residence acquisition, paid improvements, native travel, household actions, sleep and persistence use native controls. Only the final legacy-Shack check seeds its historical unlock prerequisite.'};let page;
const key=id=>JSON.stringify({id});
async function home(){await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');await page.waitForTimeout(50);}
const button=id=>page.locator('[data-home-action]').and(page.locator(`[data-home-action=${JSON.stringify(id)}]`));
async function reveal(node){await node.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await node.scrollIntoViewIfNeeded();}
async function click(id){const b=button(id);await reveal(b);assert.equal(await b.isEnabled(),true,`${id}: ${await page.locator('#home_panel').innerText()}`);await b.click();await page.waitForTimeout(40);const error=await page.locator('#home_panel > p[role=status]').innerText();assert.ok(!/Progress paused|Could not|Invalid |Home terms changed|Finish the pending/.test(error),error);}
async function open(seed){await session.open(seed);page=session.page;await home();}
async function travel(id){await page.evaluate(id=>change_location({location_id:id}),id);await home();}
async function buy(id,n=1){for(let i=0;i<n;i++){await page.locator('select[aria-label="Furnishing to buy"]').evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await page.getByRole('combobox',{name:'Furnishing to buy',exact:true}).selectOption(id);await click('buy');}}
async function replay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(200);await home();}
async function persist(label){
    const before=await session.save();await page.reload();await replay();let after=await session.save();assert.deepEqual(after.homes,before.homes);assert.deepEqual(after.inventories.person.main_character,before.inventories.person.main_character);assert.equal(after.character.money,before.character.money);assert.equal(after.character.bio.race,before.character.bio.race);
    const literal=await page.evaluate(()=>save_to_file());await writeFile(join(out,label+'-export.txt'),literal);
    const saved=await session.save();await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),literal)]);await replay();after=await session.save();assert.deepEqual(after.homes,saved.homes);assert.equal(after.character.money,saved.character.money);assert.equal(after.character.bio.race,saved.character.bio.race);assert.deepEqual(after.expansion.simulation?.people.player?.body,saved.expansion.simulation?.people.player?.body);
    receipt.checks.push(label+': actual Save/reload/Export/literal Import preserves homes, custody, body and money');console.log('PASS '+label+' persistence');
}
try{
    await session.start();await open();const original=await session.save();assert.deepEqual(original.homes.properties,{});
    // Ordinary unchanged Village start can purchase an actual home and furnishing.
    await click('acquire:cottage');let s=await session.save();assert.equal(s.character.money,original.character.money-80);assert.equal(s.homes.properties.cottage.owner,'player');assert.equal(await button('start:homeowner').count(),0);
    const shop=page.locator('select[aria-label="Furnishing to buy"]');await reveal(shop);await shop.selectOption('Home plain bed');assert.equal(await button('buy').isEnabled(),false);
    receipt.checks.push('Ordinary Village route purchases a cottage for 80 real coins; insufficient furniture funds disable the quote and no start grants replay');
    await open();await click('start:homeowner');s=await session.save();assert.equal(s.homes.start.profile,'homeowner');assert.equal(s['current location'],'Hearthside cottage');
    const name=page.getByRole('textbox',{name:'Home name'});await name.fill('Willow House');await name.evaluate(n=>n.setSelectionRange(2,5));await session.step(1);assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Home name');assert.equal(await name.inputValue(),'Willow House');assert.deepEqual(await name.evaluate(n=>[n.selectionStart,n.selectionEnd]),[2,5]);await page.locator('[data-home-rename]').click();const beforeRepair=await session.save();assert.equal(beforeRepair.homes.properties.cottage.name,'Willow House');
    await click('improve:restore');s=await session.save();assert.ok(s.homes.properties.cottage.improvements.includes('restore'));assert.equal(s.expansion.clock-beforeRepair.expansion.clock,30);assert.equal(s.inventories.person.main_character[key('Rough wood log')],undefined);
    await travel('Village');await buy('Rough wood log',4);await buy('Home yarn ball');await buy('Home straw pillow');await buy('Home wooden tableware');await buy('Home incense holder');
    await travel('Hearthside cottage');await click('improve:guestroom');await click('invite');s=await session.save();assert.equal(s.homes.lodger.coins,18);assert.equal(s.homes.lodger.home,'cottage');
    for(const id of ['Home yarn ball','Home straw pillow','Home wooden tableware','Home incense holder'])await click('install:cottage:'+key(id));
    s=await session.save();assert.equal(s.homes.properties.cottage.fixtures.pillow.key,key('Home straw pillow'));assert.equal(s.availabilities.location['Hearthside cottage:crafting']===1,true);
    receipt.checks.push('Homeowner restoration, guest-room fit-out, paid native supplies, furnishings and kitchen/practice capability consume real money/materials/played time; Reed pays from his finite purse');
    await click('meet:cottage');await session.step(5);await click('household:cottage:play');s=await session.save();assert.equal(s.homes.properties.cottage.household.animal.playVisits,1);assert.equal(s.inventories.person.main_character[key('Home yarn ball')],undefined);
    await click('remove:cottage:pillow');s=await session.save();assert.equal(s.inventories.person.main_character[key('Home straw pillow')].count,1);await click('install:cottage:'+key('Home straw pillow'));
    await persist('homeowner');
    for(const size of [14,21]){const seed=await session.save();seed.customization.profiles.Default.settings.typography={font:'gothic',size};await open(seed);await page.locator('#home_panel details').filter({has:page.locator('summary:text-is("Hearth and companion")')}).evaluate(n=>n.open=true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(out,`homeowner-${size}.png`)});}
    // All other starts are admitted from genuinely fresh contexts, never seeded homes.
    for(const [profile,id,form,location]of [['lodger','rental','human','Riverside rented room'],['shared','family','human','Family longhouse room'],['fox','burrow','fox','Willow burrow'],['bird','nest','bird','Canopy nest']]){
        await open();await click('start:'+profile);s=await session.save();assert.equal(s.homes.start.profile,profile);assert.equal(s['current location'],location);assert.equal(s.character.bio.race,form);assert.equal(s.expansion.simulation.people.player.body.form,form);assert.doesNotMatch(await page.locator('body').innerText(),/text not found, id:.*(?:Bird|Fox|home bird|home fox)/);if(form==='bird')assert.equal(s.expansion.simulation.people.player.body.flying,true);
        if(profile==='lodger'||profile==='shared'){await reveal(button('remove:'+id+':bed'));assert.equal(await button('remove:'+id+':bed').isEnabled(),false);}
        // Storage uses physical local custody for every body, including beak/paws.
        const carried=Object.keys(s.inventories.person.main_character)[0];const deposit=page.locator('select[aria-label="Carried item to store"]');await reveal(deposit);await deposit.selectOption(carried);await click('deposit:'+id);s=await session.save();assert.equal(s.homes.properties[id].stock[carried],1);await click('withdraw:'+id+':'+carried);
        await page.evaluate(()=>start_sleeping());await session.step(1);assert.equal((await session.save()).is_sleeping,true);await page.evaluate(()=>end_sleeping());await home();
        if(profile==='lodger'){
            await session.step((await session.save()).homes.properties.rental.paidUntil-(await session.save()).expansion.clock-1);await page.evaluate(()=>start_sleeping());await session.step(1);await home();s=await session.save();assert.ok(s.expansion.clock>=1440);assert.equal(s.is_sleeping,false);assert.equal(s.availabilities.location[location+':housing']===1,false);
            const coins=s.character.money,expiredAt=s.expansion.clock;await click('renew:rental');s=await session.save();assert.equal(s.character.money,coins-12);assert.equal(s.homes.properties.rental.paidUntil,expiredAt+1440);
        }
        await persist(profile);await page.screenshot({path:join(out,profile+'.png')});receipt.checks.push(profile+': native admission, body-appropriate sleep and local storage; title/expiry permissions enforced');
    }
    // Legacy source prerequisites only: no residence, companion or furnishings seeded.
    const legacy=structuredClone(original);delete legacy.homes;legacy['current location']='Shack';legacy.availabilities.location.Shack=1;legacy.locations.Shack={...legacy.locations.Shack,housing_unlocked:true};
    await open(legacy);await click('register:shack');await click('deed:shack');s=await session.save();assert.equal(s.homes.properties.shack.owner,'player');assert.equal(s.household,undefined);await persist('legacy-shack');
    receipt.checks.push('Legacy Shack unlock fixture registers real access and purchases title without creating, copying or replacing its native household/chest');
    // Move the actual legacy companion through paid local travel, without re-meeting a copy.
    await page.locator('#center_mode_back').click();await page.locator('button[data-place-tab="options"]').click();
    await page.locator('#p23_household_panel').evaluate(n=>n.open=true);await page.locator('[data-household-action="meet"]').click();
    await travel('Village');await click('acquire:rental');await travel('Riverside rented room');await page.getByRole('combobox',{name:'Inspect residence'}).selectOption('rental');
    const beforeMove=await session.save();await click('move_native_cat:rental');s=await session.save();assert.equal(s.expansion.clock-beforeMove.expansion.clock,30);assert.equal(s.household.animal,null);assert.equal(s.homes.properties.rental.household.animal.id,'household.moss');
    await persist('relocated-moss');receipt.checks.push('Existing native Moss moves to a new residence through 30 paid travel minutes, with one companion and retained source household/fire state');
    // Pointer-down quotes cannot rebind to changed clock/resource terms.
    const renew=button('renew:rental');await reveal(renew);await renew.dispatchEvent('pointerdown');await session.step(1);const staleBefore=await session.save();await renew.evaluate(n=>n.click());s=await session.save();assert.equal(s.character.money,staleBefore.character.money);assert.equal(s.homes.properties.rental.paidUntil,staleBefore.homes.properties.rental.paidUntil);assert.match(await page.locator('#home_panel > p[role=status]').innerText(),/terms changed/);
    receipt.checks.push('Stale native pointer quote rejects without extending a term or charging coins');
    const errors=session.errors.filter(e=>!(e.kind==='console'&&e.text==='Failed to load resource: the server responded with a status of 404 (Not Found)'));assert.deepEqual(errors,[]);
    assert.deepEqual([...new Set(missing)].filter(p=>p!=='/private_packs/manifest.json'),[]);receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}catch(error){receipt.status='failed';receipt.failure=error.stack;receipt.errors=session.errors;if(page){receipt.screen=(await page.locator('body').innerText()).slice(-10000);await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw error;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
console.log(JSON.stringify(receipt,null,2));
