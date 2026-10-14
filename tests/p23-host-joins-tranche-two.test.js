import test from 'node:test';
import assert from 'node:assert/strict';
import {createLivingGear,LIVING_GEAR} from '../src/absorb_p23/living_gear/index.js';
import {createDurability} from '../src/absorb_e2/durability.js';
import {stageLivingEquip,validateTrancheTwoEnvelope} from '../src/absorb_p23/host_joins/tranche_two.js';
const key=JSON.stringify({id:LIVING_GEAR.collector});
const decode=k=>({id:JSON.parse(k).id,equip_slot:'ring',tags:{equippable:true},getInventoryKey(){return this.inventory_key||k;}});
function fixture(){return {state:{clock:0},gameplay:{player:{inventory:{[key]:2},skills:{},reputation:{}}},money:30,gear:createLivingGear(),wear:createDurability().serialize(),item:decode(key),key,equipment:{},getItem:decode,assertDisposition:()=>{}};}
function envelope(plan){const equipped=plan.equipment.player.ring;return {character:{equipment:{ring:{inventory_key:equipped}}},inventories:{person:{main_character:Object.fromEntries(Object.entries(plan.gameplay.player.inventory).map(([k,count])=>[k,{count}]))}},equipment_durability:plan.nativePatch.equipment_durability,p23_living_gear:plan.nativePatch.p23_living_gear};}
test('living equip pays one stack copy and allocates identity with wear off, without changing source owners',()=>{
 const input=fixture(),before=JSON.stringify({gameplay:input.gameplay,wear:input.wear});
 const plan=stageLivingEquip(input);assert.equal(plan.gameplay.player.inventory[key],1);
 assert.equal(JSON.parse(plan.equipment.player.ring).e2_instance,'e2.1');assert.equal(plan.nativePatch.equipment_durability.enabled,false);
 assert.equal(JSON.stringify({gameplay:input.gameplay,wear:input.wear}),before);validateTrancheTwoEnvelope(envelope(plan));
});
test('two native copies remain distinct after swapping and imported duplicate owners reject',()=>{
 const first=stageLivingEquip(fixture()),input=fixture();input.wear=first.nativePatch.equipment_durability;input.gameplay=first.gameplay;input.equipment=first.equipment.player;
 const second=stageLivingEquip(input);assert.notEqual(first.equipment.player.ring,second.equipment.player.ring);
 const save=envelope(second);validateTrancheTwoEnvelope(save);
 save.inventories.person.main_character[second.equipment.player.ring]={count:1};assert.throws(()=>validateTrancheTwoEnvelope(save),/physical owner/);
});
test('custody refusal leaves paid-copy and allocator plans untouched',()=>{
 const input=fixture(),before=JSON.stringify(input.wear);input.assertDisposition=()=>{throw Error('Held by another owner');};
 assert.throws(()=>stageLivingEquip(input),/another owner/);assert.equal(input.gameplay.player.inventory[key],2);assert.equal(JSON.stringify(input.wear),before);
});
test('staging an already allocated copy never rebinds the live inventory item to staged wear',()=>{
 const first=stageLivingEquip(fixture()),input=fixture(),allocated=first.equipment.player.ring;
 input.key=allocated;input.item=decode(allocated);input.item.getAttack=()=>10;input.wear=first.nativePatch.equipment_durability;input.gameplay.player.inventory={[allocated]:1};
 const method=input.item.getAttack;stageLivingEquip(input);
 assert.equal(input.item.getAttack,method);assert.equal(Object.hasOwn(input.item,'inventory_key'),false);
});
test('optional absence is inert and unknown fields, missing E2 allocation or stacked instance reject',()=>{
 validateTrancheTwoEnvelope({});const plan=stageLivingEquip(fixture()),save=envelope(plan);
 save.p23_living_gear.extra=true;assert.throws(()=>validateTrancheTwoEnvelope(save));delete save.p23_living_gear.extra;
 save.equipment_durability.condition={};assert.throws(()=>validateTrancheTwoEnvelope(save),/allocation/);
 const stacked=envelope(plan);stacked.character.equipment={};stacked.inventories.person.main_character[plan.equipment.player.ring]={count:2};assert.throws(()=>validateTrancheTwoEnvelope(stacked),/physical owner/);
});
test('paused combat state requires the same real encounter and survivor phase',()=>{
 const save={combatOptions:{schema:1,selected:null,breakRequested:false,lastEvent:2,phase:'encounter-break'}};
 assert.throws(()=>validateTrancheTwoEnvelope(save),/saved native encounter/);save.native_encounter={enemies:[{alive:true}]};assert.throws(()=>validateTrancheTwoEnvelope(save),/survivors/);
 save.native_encounter.enemies[0].alive=false;validateTrancheTwoEnvelope(save);
});
test('an equipped aura refuses a malformed native hour before projection or owner mutation',()=>{
 const save=envelope(stageLivingEquip(fixture())),aura=JSON.stringify({id:LIVING_GEAR.aura,e2_instance:'e2.2'});
 save.character.equipment.amulet={inventory_key:aura};save.equipment_durability.nextId=3;save.equipment_durability.condition[aura]=100;
 save['current time']={hour:20.5};assert.throws(()=>validateTrancheTwoEnvelope(save),/calendar hour/);
 save['current time'].hour=20;validateTrancheTwoEnvelope(save);
});
