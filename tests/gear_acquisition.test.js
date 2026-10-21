import test from 'node:test';
import assert from 'node:assert/strict';
import {affixedStockEntries, recoveredEquipmentLoot, acquiredLootKeys} from '../src/gear_acquisition.js';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

const native = () => loadNative(`
export {getItem, getItemFromKey, item_templates} from './src/items.js';
export {Enemy} from './src/enemies.js';
export {TraderComponent} from './src/components/trader_component.js';
export {default as templates} from './src/data/inventory_templates.js';
export {bindGameStreams,createStreams} from './src/seeded_streams.js';
export {current_game_time} from './src/game_time.js';`, {stubs: STANCE_LOCATION_STUBS});

test('native stock resolves every piece once, conserves counts and reloads exact saved keys', async () => {
    const m = await native();
    const armor = m.getItem({...m.item_templates['Steel chainmail armor'], quality: 170});
    const options = {item: armor, count: 3,
        partsOf: c => Object.fromEntries(Object.entries(c).map(([slot,id]) => [slot,m.item_templates[id]])),
        random: n => (n + 1) / 5};
    const entries = affixedStockEntries(options);
    assert.equal(entries.reduce((sum,row) => sum + row.count, 0), 3);
    assert.ok(entries.length > 1, 'different pieces retain different rolls');
    for (const {item_key} of entries) {
        const loaded = m.getItemFromKey(item_key);
        assert.ok(loaded.affixes.length > 0);
        assert.equal(loaded.getInventoryKey(), item_key);
    }
    const resolved = m.getItemFromKey(entries[0].item_key);
    assert.deepEqual(affixedStockEntries({...options,item:resolved,random:()=>{throw Error('reroll');}}),
        [{item_key: entries[0].item_key, count: 3}]);
    assert.deepEqual(affixedStockEntries({...options,plain:true}), [{item_key: armor.getInventoryKey(), count:3}]);
});

test('shop restocks replay by saved epoch and keep independent identities through sale stock', async () => {
    const m = await native(), state = {streams:m.createStreams(72),actors:{player:{worldId:'base.frontier'}}};
    m.bindGameStreams(() => state);
    m.templates.acquisition = [{canBeStarted:()=>true,items:[{canBeStarted:()=>true,item_name:'Wolf leather armor',
        quality:[170,170],count:[3],chance:1}]}];
    const shop = new m.TraderComponent({name:'native acquisition test',inventory_template:'acquisition'});
    shop.fillInventoryFromTemplate({});
    const stock = Object.fromEntries(Object.entries(shop.getTradeInventory()).map(([key,row])=>[key,row.count]));
    assert.equal(Object.values(stock).reduce((a,b)=>a+b,0),3);
    assert.ok(Object.keys(stock).every(key=>JSON.parse(key).affixes?.length));
    shop.emptyInventory(); shop.fillInventoryFromTemplate({});
    assert.deepEqual(Object.fromEntries(Object.entries(shop.getTradeInventory()).map(([key,row])=>[key,row.count])),stock);
    const [key] = Object.keys(stock);
    shop.removeFromInventory([{item_key:key,count:1}]);
    shop.addToInventory([{item_key:key,count:1}]);
    assert.equal(shop.getTradeInventory()[key].item.getInventoryKey(),key);
    assert.deepEqual(Object.fromEntries(Object.entries(shop.getTradeInventory()).map(([key,row])=>[key,row.count])),stock);
    m.current_game_time.day_count += 8;
    shop.emptyInventory(); shop.fillInventoryFromTemplate({});
    assert.notDeepEqual(Object.keys(shop.getTradeInventory()),Object.keys(stock),'new epoch produces new resolved stock');
});

test('victory recovers the worn affixed key without rerolling or replacing normal loot keys', async () => {
    const m = await native();
    m.bindGameStreams(()=>({streams:m.createStreams(17),actors:{player:{worldId:'base.frontier'}}}));
    const key=JSON.stringify({components:{internal:'Leather vest',external:'Steel chainmail vest'},quality:170,
        affixes:[{id:'armor.padded',v:.04,s:'mechanism'},{id:'armor.vital',v:.05,s:'roll'}]});
    const enemy=new m.Enemy({name:'equipped fixture',stats:{health:20,attack:4,agility:4,dexterity:4,intuition:4,defense:0},
        equipment_keys:{torso:key},equipment_drop_chance:1,loot_list:[{item_name:'Rat tail',chance:1}]});
    enemy.rngKey='fixed-acquisition-encounter'; enemy.init();
    const loot=enemy.get_loot();
    assert.ok(loot.some(row=>row.item_key===key&&row.count===1));
    assert.ok(loot.some(row=>row.item_id==='Rat tail'&&row.count===1));
    assert.deepEqual(enemy.get_loot(),loot,'same encounter keeps the same loot decision');
    const acquired=acquiredLootKeys(loot,m.item_templates);
    assert.ok(acquired.some(row=>row.item_key===key));
    assert.deepEqual(m.getItemFromKey(key).affixes,enemy.getEquipment().torso.affixes);
    assert.deepEqual(recoveredEquipmentLoot(enemy.getEquipment(),()=>.9,0),[]);
});
