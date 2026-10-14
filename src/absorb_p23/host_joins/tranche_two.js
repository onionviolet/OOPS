import {createLivingGear,LIVING_GEAR} from '../living_gear/index.js';
import {createDurability,canonicalDurabilityKey} from '../../absorb_e2/durability.js';
import {validateCombatOptions} from '../combat_options/runtime.js';
import {applyGameplayEffect} from '../../gameplay_transactions.js';

export function livingGearKind(item) {
    if(item?.equip_slot==='weapon'&&item.components?.head===LIVING_GEAR.blade)return 'weapon';
    if(item?.equip_slot==='ring'&&item.id===LIVING_GEAR.collector)return 'collector';
    if(item?.equip_slot==='amulet'&&item.id===LIVING_GEAR.aura)return 'aura';
    return null;
}

// Inspect physical owners, not the condition/growth metadata which references
// those owners. A retired/sold copy may retain its historical growth metadata.
export function validateTrancheTwoEnvelope(save) {
    validateCombatOptions(save.combatOptions);
    if(save.combatOptions?.phase==='escaped'&&save.native_encounter)throw Error('Escaped tactics cannot retain a live encounter.');
    if(save.combatOptions&&['exchange-break','encounter-break'].includes(save.combatOptions.phase)) {
        if(!save.native_encounter)throw Error('Paused tactics need their saved native encounter.');
        const survivors=save.native_encounter.enemies?.some(e=>e.alive);
        if(survivors!==(save.combatOptions.phase==='exchange-break'))throw Error('Paused tactics disagree with native survivors.');
    }
    if(!Object.hasOwn(save,'p23_living_gear'))return;
    const gear=createLivingGear(save.p23_living_gear).serialize(),wear=createDurability(save.equipment_durability).serialize();
    const seen=new Map();
    function physical(key,count,slot) {
        const data=JSON.parse(key),id=data.e2_instance;
        const kind=data.components?.head===LIVING_GEAR.blade?'weapon':data.id===LIVING_GEAR.collector?'collector':data.id===LIVING_GEAR.aura?'aura':null;
        if(kind&&slot&&id===undefined)throw Error('Equipped living gear lacks a native copy identity.');
        if(kind==='aura'&&slot==='amulet'&&(!Number.isInteger(save['current time']?.hour)||save['current time'].hour<0||save['current time'].hour>=24))throw Error('Living aura needs the native calendar hour.');
        if(id===undefined)return;
        if(count!==1||seen.has(id))throw Error('Equipment copy appears in more than one physical owner.');
        if(typeof id!=='string'||!/^e2\.[1-9]\d*$/.test(id)||!Number.isSafeInteger(Number(id.slice(3)))||Number(id.slice(3))>=wear.nextId||!Object.hasOwn(wear.condition,key))throw Error('Equipment copy lacks its native identity allocation.');
        if(kind&&slot&&slot!==({weapon:'weapon',collector:'ring',aura:'amulet'})[kind])throw Error('Living gear is in the wrong native slot.');
        seen.set(id,key);
    }
    for(const [slot,item]of Object.entries(save.character?.equipment||{}))if(item)physical(item.inventory_key||JSON.stringify(item.components?{components:item.components,quality:item.quality}:{id:item.id,quality:item.quality}),1,slot);
    for(const slots of Object.values(save.npc_equipment||{}))for(const [slot,key]of Object.entries(slots))physical(key,1,slot);
    const inventories=save.inventories||{person:{main_character:save.character?.inventory||{}}};
    for(const owners of Object.values(inventories))for(const stock of Object.values(owners))for(const [key,row]of Object.entries(stock))physical(key,typeof row==='number'?row:row.count);
    for(const key of Object.keys(gear.copies)) {
        const id=JSON.parse(key).e2_instance;
        if(!Object.hasOwn(wear.condition,key)||Number(id.slice(3))>=wear.nextId)throw Error('Living gear growth lacks its native identity allocation.');
        if(seen.has(id)&&canonicalDurabilityKey(seen.get(id))!==canonicalDurabilityKey(key))throw Error('Living gear identity has incompatible item keys.');
    }
}

export function stageLivingEquip({state,gameplay,money,gear,wear,item,key,equipment,getItem,assertDisposition}) {
    if(!livingGearKind(item))throw Error('Choose living gear.');
    assertDisposition(key);assertDisposition(canonicalDurabilityKey(key));
    const staged=createDurability(wear),copy=gear.prepareEquip(getItem(key),staged,getItem),nextKey=copy.getInventoryKey();
    const previous=equipment[item.equip_slot];
    if(previous){assertDisposition(previous);assertDisposition(canonicalDurabilityKey(previous));}
    const next=structuredClone(gameplay);
    applyGameplayEffect(next,{type:'item',key,amount:1},'player',true);
    if(previous)applyGameplayEffect(next,{type:'item',key:previous,amount:1},'player');
    return {state:structuredClone(state),gameplay:next,external:{money},equipment:{player:{...equipment,[item.equip_slot]:nextKey}},
        nativePatch:{equipment_durability:staged.serialize(),p23_living_gear:gear.serialize()}};
}
