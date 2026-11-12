import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {Session} from '../../../../scripts/playtest/lib.mjs';
import {serve} from '../../../../scripts/perf/lib.mjs';
import {drawU32,address} from '../../../../src/gen_kit.js';

const [root,fixturePath]=process.argv.slice(2);
const file=await readFile(fixturePath,'utf8');
const fixture=JSON.parse(Buffer.from(file.trim().split(':')[1],'base64'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const location of ['Forest road','Infested field']) fixture.locations[location]={...fixture.locations[location],is_unlocked:true};
fixture.character.money=50000;
// Select a normal keyed market shelf that stocks both alloys in the same quality band.
fixture.expansion.streams.root=2;
const server=await serve(root);
const session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,8),opTimeout:60000}).start();
const stock=save=>save.inventories.person.main_character;
const work=save=>save.expansion.mistglassRealm.refinement;
const reserve=save=>save.expansion.simulation.energies.player['p23.mistglass.condensate'].reserve;
const snapshot=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const travel=async to=>{
    await session.page.evaluate(to=>change_location({location_id:to}),to);
    assert.equal((await snapshot())['current location'],to);
};
async function projects(action) {
    const page=session.page;
    await page.evaluate(()=>document.querySelector('[data-panel-path="projects"]')?.click());
    const button=page.locator('#p23_mistglass_panel button').filter({hasText:action}).first();
    await button.evaluate(el=>{for(let node=el.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;});
    await button.waitFor({state:'visible',timeout:10000});
    assert.ok(await button.isEnabled());
    await button.press('Enter');
}
try {
    await session.open(fixture);
    await projects(/^Return to Village/);
    for(const to of ['Forest road','Town outskirts','Slums'])await travel(to);
    const money=(await snapshot()).character.money;
    await session.page.evaluate(()=>window.startTrade('suspiciousTrader'));
    const trader=session.page.locator('#trader_inventory_div [data-trader_item]');
    const offers=await trader.evaluateAll(rows=>rows.map(row=>{
        const raw=row.getAttribute('data-trader_item');
        return {raw,key:JSON.parse(raw)};
    })
        .filter(row=>['Iron long blade','Steel long blade'].includes(row.key.components?.head)));
    console.log('Actual sword shelf',JSON.stringify(offers));
    const irons=offers.filter(row=>row.key.components.head==='Iron long blade');
    const steels=offers.filter(row=>row.key.components.head==='Steel long blade');
    const iron=irons.find(row=>steels.some(other=>Math.floor(row.key.quality/100)===Math.floor(other.key.quality/100)));
    const steel=steels.find(row=>Math.floor(row.key.quality/100)===Math.floor(iron?.key.quality/100));
    assert.ok(iron&&steel,'expected both materials on the same quality band');
    for(const offer of [iron,steel]) {
        await session.page.locator('#trader_inventory_div [data-trader_item='+JSON.stringify(offer.raw)+']').click({timeout:10000});
    }
    await session.page.locator('#accept_trade_button').click();
    await session.page.evaluate(()=>{window.exitTrade();advanceTicks(1,{render:true});});
    const purchased=await session.save();
    assert.ok(purchased.character.money<money);
    const sources=['Iron','Steel'].map(material=>{
        const key=Object.keys(stock(purchased)).find(key=>JSON.parse(key).components?.head===material+' long blade');
        assert.ok(key,material+' purchase must reach player stock');
        return {material,key};
    });
    console.log('Purchased actual source swords',sources);
    for(const to of ['Town outskirts','Forest road','Village'])await travel(to);
    await projects(/^Enter Mistglass/);
    const carried=await session.save();
    const products=[];
    for(const {material,key} of sources){
        // Each branch starts from the same earned stock and method. Pick a
        // reproducible successful draw without changing the paid materials.
        await session.open(carried);
        for(let i=0;i<40&&reserve(await snapshot())<2000;i++)await session.step(1);
        const ready=await session.save();
        assert.ok(reserve(ready)>=2000);
        const state=ready.expansion;
        const drawAddress=address('artifact.refining@1','p23.mistglass',state.mistglassRealm.instance.id,'mistglass.refine.1',state.clock,key);
        for(let seed=1;seed<100;seed++){
            if(drawU32(seed,drawAddress)/0x100000000<.6){state.rng=seed;break;}
        }
        await session.open(ready);
        await projects(new RegExp('^Refine '+material+' long blade'));
        const admitted=await session.save();
        assert.equal(work(admitted).pending.request.piece.key,key);
        assert.equal(stock(admitted)[key],undefined);
        await session.step(work(admitted).pending.due-admitted.expansion.clock);
        const done=await session.save();
        assert.equal(work(done).last.status,'success');
        const product=Object.keys(stock(done)).find(key=>JSON.parse(key).id==='Mist-bound sword');
        const event=JSON.parse(product).lineage.history.at(-1);
        assert.equal(event.inputs[0].item_key,key);
        assert.equal(event.parameters.material,material.toLowerCase());
        await session.page.evaluate(key=>equip_item(key),product);
        const stats=await session.page.evaluate(()=>Object.fromEntries(['attack_power','attack_speed'].map(name=>
            [name,document.getElementById(name+'_slot').textContent])));
        await projects(/^Return to Village/);
        await travel('Infested field');
        const hit=session.page.locator('#message_box_div').getByText(/wolf rat was hit.*metal damage/i).first();
        for(let i=0;i<50&&!await hit.count();i++)await session.page.evaluate(()=>advanceTicks(30,{render:true}));
        assert.ok(await hit.count(),'expected a native metal hit for '+material);
        products.push({material,source:key,attack:event.parameters.attack,recovery:event.parameters.recovery,stats,hit:await hit.textContent()});
        console.log('Verified native strike',products.at(-1));
    }
    assert.ok(products[0].attack>products[1].attack);
    assert.ok(products[0].recovery>products[1].recovery);
    assert.notEqual(products[0].stats.attack_speed,products[1].stats.attack_speed);
    assert.deepEqual(session.errors.filter(row=>row.kind==='pageerror'),[]);
    await writeFile(join(root,'material-result.json'),JSON.stringify({status:'PASS',products,fixture:hash(file),
        bundle:hash(await readFile(join(root,'dist/bundle.js'))),viewport:session.page.viewportSize()},null,2));
} finally {
    await session.close();
    await server.close();
}
