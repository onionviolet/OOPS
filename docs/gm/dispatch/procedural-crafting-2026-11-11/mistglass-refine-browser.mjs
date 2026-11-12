import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {Session} from '../../../../scripts/playtest/lib.mjs';
import {serve} from '../../../../scripts/perf/lib.mjs';
import {address,drawU32} from '../../../../src/gen_kit.js';

const [root,fixturePath] = process.argv.slice(2);
const file=await readFile(fixturePath,'utf8');
const baseline=JSON.parse(Buffer.from(file.trim().split(':')[1],'base64'));
const sha=value=>createHash('sha256').update(value).digest('hex');
const sword=JSON.stringify({components:{head:'Iron long blade',handle:'Simple wooden short handle'},quality:100});
const resource='p23.mistglass.condensate';
const server=await serve(root);
const session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:60000}).start();
const stock=save=>save.inventories.person.main_character;
const reserve=save=>save.expansion.simulation.energies.player[resource].reserve;
const work=save=>save.expansion.mistglassRealm.refinement;
const outputs=save=>Object.keys(stock(save)).filter(key=>JSON.parse(key).id==='Mist-bound sword');
async function projectsAction(selector) {
    await session.page.evaluate(()=>document.querySelector('[data-panel-path="projects"]')?.click());
    const button=session.page.locator(selector).first();
    await button.evaluate(el=>{for(let node=el.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;});
    await button.waitFor({state:'visible',timeout:10000});
    assert.equal(await button.isEnabled(),true);
    await button.press('Enter');
}
async function importCurrent() {
    const page=session.page, encoded=await page.evaluate(()=>save_to_file());
    await page.evaluate(encoded=>load_progress(encoded),encoded);
    await page.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility());
    await page.evaluate(()=>simulationTestHooks.pause());
    await page.locator('#loading_screen_play_button').click();
}
async function start(seed) {
    const fixture=structuredClone(baseline);
    fixture.expansion.rng=seed;
    fixture.expansion.simulation.energies.player[resource].reserve=6000;
    fixture.locations['Infested field']={...fixture.locations['Infested field'],is_unlocked:true};
    fixture.traders={...fixture.traders,'village trader':{is_unlocked:true}};
    stock(fixture)[sword]={count:1};
    await session.open(fixture);
    console.log('Loaded Mistglass fixture',seed);
    await projectsAction('#p23_mistglass_panel [data-mistglass-action^="method:refine:"]');
    const saved=await session.save();
    assert.equal(reserve(saved),4000);
    assert.equal(stock(saved)[sword],undefined);
    assert.ok(work(saved).pending);
    return saved;
}
try {
    const seedFor=success=>{
        for(let seed=1;seed<100;seed++){
            const draw=drawU32(seed,address('artifact.refining@1','p23.mistglass',baseline.expansion.mistglassRealm.instance.id,
                'mistglass.refine.1',baseline.expansion.clock,sword));
            if(success ? draw/0x100000000<0.7 : draw/0x100000000>0.95)return seed;
        }
        throw Error('Missing seeded branch');
    };
    const started=await start(seedFor(true));
    await importCurrent();
    assert.deepEqual(work(await session.save()).pending,work(started).pending);
    console.log('Paid start and pending literal import passed');
    await session.step(work(started).pending.due-started.expansion.clock);
    const done=await session.save();
    assert.equal(work(done).last.status,'success');
    assert.equal(outputs(done).length,1);
    const [product]=outputs(done);
    assert.equal(JSON.parse(product).lineage.history.at(-1).inputs[0].item_key,sword);
    await session.page.evaluate(key=>equip_item(key),product);
    assert.equal((await session.save()).character.equipment.weapon.inventory_key,product);
    await importCurrent();
    assert.equal((await session.save()).character.equipment.weapon.inventory_key,product);
    console.log('Refined weapon equipped and imported');
    await projectsAction('[data-mistglass-action="exit"]');
    assert.equal((await session.save())['current location'],'Village');
    await session.page.evaluate(()=>change_location({location_id:'Infested field'}));
    const combat=session.page.locator('#message_box_div').getByText(/wolf rat was hit.*metal damage/i).first();
    for(let i=0;i<50&&!await combat.count();i++)await session.page.evaluate(()=>advanceTicks(30,{render:true}));
    assert.ok(await combat.count(),'native combat did not log a landed metal strike');
    const hit=await combat.textContent();
    assert.ok((await session.save()).total_hits_done>done.total_hits_done);
    console.log('Landed native strike',hit);

    const failedStart=await start(seedFor(false));
    await session.step(work(failedStart).pending.due-failedStart.expansion.clock);
    const failed=await session.save();
    assert.equal(work(failed).last.status,'failure');
    assert.equal(stock(failed)[sword],undefined);
    assert.deepEqual(outputs(failed),[]);
    let purchased;
    if(process.env.NATIVE_PURCHASE==='1'){
        await projectsAction('[data-mistglass-action="exit"]');
        const money=(await session.save()).character.money;
        await session.page.evaluate(()=>window.startTrade('villageTrader'));
        const offer=session.page.locator('#trader_inventory_div .item_name').getByText(/iron sword/i).first()
            .locator('xpath=ancestor::*[contains(@class,"inventory_item_control")][1]');
        await offer.click({timeout:10000});
        await session.page.locator('#accept_trade_button').click();
        await session.page.evaluate(()=>{window.exitTrade();advanceTicks(1,{render:true});});
        const bought=await session.save();
        assert.ok(bought.character.money<money);
        purchased=Object.keys(stock(bought)).find(key=>['Iron long blade','Cheap iron long blade'].includes(JSON.parse(key).components?.head));
        assert.ok(purchased);
        console.log('Bought a native sword',purchased);
        await projectsAction('[data-mistglass-action="enter"]');
        await projectsAction('#p23_mistglass_panel [data-mistglass-action^="method:refine:"]');
        const admitted=await session.save();
        assert.equal(work(admitted).pending.request.piece.key,purchased);
        assert.equal(stock(admitted)[purchased],undefined);
        console.log('Bought a native sword and committed its exact key to refinement');
    }
    assert.deepEqual(session.errors.filter(row=>row.kind==='pageerror'),[]);
    await writeFile(join(root,'refine-result.json'),JSON.stringify({status:'PASS',fixture:sha(file),
        bundle:sha(await readFile(join(root,'dist/bundle.js'))),viewport:session.page.viewportSize(),
        pendingImported:true,equippedImported:true,paidLoss:true,hit,purchased
    },null,2));
    console.log('PASS native paid success and failure, pending and equipped imports');
} finally {
    await session.close();
    await server.close();
}
