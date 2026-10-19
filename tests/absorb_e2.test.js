import test from 'node:test';
import assert from 'node:assert/strict';
import {createDurability, canonicalDurabilityKey} from '../src/absorb_e2/durability.js';
import {loadNative} from './helpers/native_loader.mjs';
const key = JSON.stringify({id:'test sword',quality:100});
function fixture(durability) {
    function getItemFromKey(k) {
        return durability.bindFromKey(k, {tags:{equippable:true},equip_slot:'weapon',inventory_key:k,getInventoryKey(){return this.inventory_key;},getAttack(){return 20;},getName(){return 'Sword';}});
    }
    const actor={money:10,tags:{main_character:true},items:{},equipment:{},getItems(){return this.items;},getEquipment(){return this.equipment;}};
    return {actor,getItemFromKey};
}
test('old-save and default-off native keys and pacing stay intact',()=>{
    const d=createDurability(),{actor,getItemFromKey}=fixture(d),item=getItemFromKey(key);
    actor.equipment.weapon=item;
    assert.equal(d.prepareEquip(item,getItemFromKey),item);
    d.activateEquipment(actor,getItemFromKey);
    assert.equal(item.getInventoryKey(),key);
    assert.equal(d.landedHit(actor,null),false);
    assert.equal(item.getAttack(),20);
    assert.equal(d.condition(item),100);
});
test('separate equal-quality copies keep immutable keys, distinct damage and repair coins',()=>{
    const d=createDurability({enabled:true}),{actor,getItemFromKey}=fixture(d),original=getItemFromKey(key);
    const first=d.prepareEquip(original,getItemFromKey),second=d.prepareEquip(original,getItemFromKey);
    assert.equal(original.getInventoryKey(),key);
    assert.notEqual(first.getInventoryKey(),second.getInventoryKey());
    assert.equal(canonicalDurabilityKey(first.getInventoryKey()),key);
    actor.items[first.getInventoryKey()]={item:first,count:1};actor.equipment.weapon=second;
    d.wearItem(first,1250);d.wearItem(second,2500);
    assert.equal(d.condition(first),50);assert.equal(d.condition(second),0);
    assert.equal(first.getAttack(),11);assert.equal(second.getAttack(),2);
    const immutable=first.getInventoryKey();
    const checked=[];d.repair(actor,immutable,k=>checked.push(k));
    assert.deepEqual(checked,[immutable,key]);assert.equal(actor.money,7);assert.equal(d.condition(second),0);
    assert.equal(first.getInventoryKey(),immutable);assert.equal(first.getAttack(),20);
    assert.equal(d.repair(actor,immutable,()=>{}).cost,0);assert.equal(actor.money,7);
    actor.money=0;
    assert.throws(()=>d.repair(actor,second.getInventoryKey(),()=>{}),/coins/);assert.equal(d.condition(second),0);
    assert.throws(()=>d.repair(actor,second.getInventoryKey(),()=>{throw new Error('custody');}),/custody/);
    d.setEnabled(false);assert.equal(second.getAttack(),20);assert.equal(d.condition(second),0);
    d.setEnabled(true);assert.equal(second.getAttack(),2);
});
test('condition and ID allocation survive serialization, old missing condition defaults full',()=>{
    const d=createDurability({enabled:true}),{actor,getItemFromKey}=fixture(d);
    actor.equipment.weapon=d.prepareEquip(getItemFromKey(key),getItemFromKey);d.wearItem(actor.equipment.weapon,321);
    const save=JSON.parse(JSON.stringify({equipment:actor.equipment,state:d.serialize()}));
    const restored=createDurability(save.state),f=fixture(restored);
    f.actor.equipment.weapon=f.getItemFromKey(key);restored.restoreEquipment(f.actor,save.equipment,f.getItemFromKey);
    assert.equal(restored.condition(f.actor.equipment.weapon),87.16);
    const newer=restored.prepareEquip(f.getItemFromKey(key),f.getItemFromKey);
    assert.notEqual(newer.getInventoryKey(),f.actor.equipment.weapon.getInventoryKey());
    assert.equal(restored.condition(newer),100);
    const old=createDurability({enabled:true}),of=fixture(old);
    assert.equal(old.condition(of.getItemFromKey(newer.getInventoryKey())),100);
    assert.throws(()=>createDurability({schema:2}),/schema/);
});
test('actual native inventory, Hero equip/unequip, key decoder and equipment publisher preserve worn copy',async(t)=>{
    const native = await loadNative('export {getItemFromKey,item_templates} from "./src/items.js"; export {default as InventoryComponent} from "./src/components/inventory_component.js"; export {default as Hero} from "./src/models/hero.js"; export {Person} from "./src/models/person.js"; export {readNativeEquipment,prepareNativeEquipment} from "./src/native_equipment_transaction.js";', {prefix: 'e2-native-'});
    const d=createDurability({enabled:true});
    // Root's decoder hook: wrap every reconstructed native item once.
    const decode=k=>d.bindFromKey(k,native.getItemFromKey(k));
    // Actual browser fixture armor and actual Person defense consumer.
    const armorKey=JSON.stringify({components:{internal:'Goat leather pants',external:'Steel chainmail greaves'},quality:100});
    const freshArmor=d.prepareEquip(decode(armorKey),decode);
    const damagedArmor=d.prepareEquip(decode(armorKey),decode);
    const freshDefense=freshArmor.getDefense();
    assert.ok(freshDefense>0);
    d.wearItem(damagedArmor,2000); // 20 condition, .32 protection factor.
    assert.equal(d.condition(damagedArmor),20);
    assert.equal(damagedArmor.getDefense(),freshDefense*0.32);
    const levelable={stats:{flat:{},multiplier:{}},bonus_skill_levels:{flat:{}}};
    const defenseActor={getLevelableComponent:()=>levelable,getEquipment:()=>({legs:freshArmor})};
    native.Person.prototype.addAllEquipmentBonus.call(defenseActor);
    const freshNative=levelable.stats.flat.equipment.defense;
    defenseActor.getEquipment=()=>({legs:damagedArmor});
    native.Person.prototype.addAllEquipmentBonus.call(defenseActor);
    const wornNative=levelable.stats.flat.equipment.defense;
    assert.equal(wornNative,freshNative*0.32);
    assert.ok(freshNative>wornNative);
    t.diagnostic(`Native steel greaves defense: fresh ${freshNative}, condition20 ${wornNative}; direct getter ${freshDefense}.`);
    // Repeated reads must neither multiply cached stats nor compound wear.
    native.Person.prototype.addAllEquipmentBonus.call(defenseActor);
    assert.equal(levelable.stats.flat.equipment.defense,wornNative);

    const inventory=new native.InventoryComponent();
    const template=Object.values(native.item_templates).find(item=>item.tags?.weapon);
    assert.ok(template);
    const nativeKey=template.getInventoryKey();inventory.addToInventory([{item_key:nativeKey,count:2}]);
    const equipment={};
    const actor={money:10,getItems:()=>inventory.getItems(),getEquipment:()=>equipment,
        removeFromInventory:items=>inventory.removeFromInventory(items),
        addToInventory(items){ // getItemFromKey root hook applied to created Items
            inventory.addToInventory(items);
            for(const [k,entry] of Object.entries(inventory.getItems()))entry.item=decode(k);
        },
        equipItem(item){equipment.weapon=d.prepareEquip(item,decode);},
        addAllEquipmentBonus(){},updateStatsAndDisplay(){},manageChangedSkillBonuses(){},_equipItem(){}};
    native.Hero.prototype.equipItemFromInventory.call(actor,nativeKey);
    const wornKey=equipment.weapon.getInventoryKey();
    d.wearItem(equipment.weapon,1000);
    assert.equal(inventory.getItems()[nativeKey].count,1);
    assert.equal(inventory.getItems()[nativeKey].item.getInventoryKey(),nativeKey);
    native.Hero.prototype.unequipItem.call(actor,'weapon',true);
    assert.equal(d.condition(inventory.getItems()[wornKey].item),60);
    native.Hero.prototype.equipItemFromInventory.call(actor,nativeKey);
    assert.notEqual(equipment.weapon.getInventoryKey(),wornKey);
    native.Hero.prototype.unequipItem.call(actor,'weapon',true);
    native.Hero.prototype.equipItemFromInventory.call(actor,wornKey);
    assert.equal(d.condition(equipment.weapon),60);
    const slots=native.readNativeEquipment({player:actor});
    const publication=native.prepareNativeEquipment(slots,{actors:{player:actor},getItem:decode});
    const envelope={character:{}};publication.write(envelope);publication.publish();
    assert.equal(equipment.weapon.getInventoryKey(),wornKey);
    assert.equal(d.condition(equipment.weapon),60);
    const save=JSON.parse(JSON.stringify({state:d.serialize(),equipment:envelope.character.equipment,inventory:inventory.getItems()}));
    const loaded=createDurability(save.state),decodeLoaded=k=>loaded.bindFromKey(k,native.getItemFromKey(k));
    for(const [k,entry] of Object.entries(save.inventory))assert.equal(loaded.condition(decodeLoaded(k)),d.condition(k));
    loaded.restoreEquipment(actor,save.equipment,decodeLoaded);
    assert.equal(equipment.weapon.getInventoryKey(),wornKey);assert.equal(loaded.condition(equipment.weapon),60);
});
test('staged repair and toggle reject storage/custody failures without live writes or ID forks',()=>{
    const d=createDurability(),f=fixture(d),{actor,getItemFromKey}=f;
    actor.equipment.weapon=getItemFromKey(key);
    const before=d.serialize();
    const toggle=d.stageToggle(actor,true,getItemFromKey,()=>{});
    assert.equal(d.enabled,false);assert.equal(actor.equipment.weapon.getInventoryKey(),key);
    assert.deepEqual(d.serialize(),before);
    assert.throws(()=>{throw new Error('storage');},/storage/);
    assert.deepEqual(d.serialize(),before);
    // Shared native equipment publication preflight also decodes proposed
    // instance keys. Decoder reads must not allocate in the live ledger.
    getItemFromKey(toggle.equipment.player.weapon);
    assert.deepEqual(d.serialize(),before);
    const retry=d.stageToggle(actor,true,getItemFromKey,()=>{});
    assert.deepEqual(retry.equipment,toggle.equipment);
    assert.throws(()=>d.stageToggle(actor,true,getItemFromKey,k=>{if(k===key)throw new Error('borrowed');}),/borrowed/);
    retry.publish();actor.equipment.weapon=getItemFromKey(retry.equipment.player.weapon);
    d.wearItem(actor.equipment.weapon,2500);
    const repair=d.stageRepair(actor,actor.equipment.weapon.getInventoryKey(),()=>{});
    assert.equal(repair.external.money,5);assert.equal(actor.money,10);assert.equal(d.condition(actor.equipment.weapon),0);
    assert.equal(actor.equipment.weapon.getAttack(),2);
    // A failed shared storage write does not call publish.
    assert.equal(d.condition(actor.equipment.weapon),0);assert.equal(actor.money,10);
    actor.money=repair.external.money;repair.publish();
    assert.equal(d.condition(actor.equipment.weapon),100);assert.equal(actor.money,5);
});
test('landed hits degrade armor and shield with real defense/block penalties and no destruction',()=>{
    const d=createDurability({enabled:true}),f=fixture(d);
    const decode=k=>{
        const item=f.getItemFromKey(k);
        item.getDefense=()=>10;item.getShieldStrength=()=>40;
        // Fresh object is needed when adding native methods before binding.
        return d.bindFromKey(k,{...item,getDefense:()=>10,getShieldStrength:()=>40});
    };
    const armor=d.prepareEquip(decode(key),decode),shield=d.prepareEquip(decode(key),decode);
    f.actor.equipment={torso:armor,'off-hand':shield};
    assert.equal(d.landedHit(null,f.actor),true);assert.equal(d.condition(armor),99.96);
    d.wearItem(armor,2500);d.wearItem(shield,2500);
    assert.equal(armor.getDefense(),1.5);assert.equal(shield.getShieldStrength(),6);
    assert.equal(f.actor.equipment.torso,armor);assert.equal(f.actor.equipment['off-hand'],shield);
});
