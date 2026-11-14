import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyPackState,packSaveState,preparePackSave,validatePackState} from '../src/content_packs.js';
const d={id:'workshop',world:{id:'workshop.world'},locations:[{id:'workshop.room'}]}, definitions=new Map([[d.id,d]]);
function fixture(){return {content_packs:packSaveState(emptyPackState(),definitions),locations:{Village:{seen:1},'workshop.room':{seen:7},'unknown.room':{seen:9}},availabilities:{location:{'workshop.room':{is_unlocked:true},'unknown.room':{is_unlocked:true}}}};}
test('unvisited registration parks exact native records, retains unknowns and restores with no fabricated visit',()=>{
 const before=fixture(),gone=preparePackSave(before,new Map());assert.deepEqual(gone.content_packs.packs,{});
 assert(!gone.locations['workshop.room']);assert.deepEqual(gone.locations['unknown.room'],before.locations['unknown.room']);
 assert.deepEqual(gone.content_packs.registered.workshop.native.locations['workshop.room'],{seen:7});
 const again=preparePackSave(JSON.parse(JSON.stringify(gone)),new Map());assert.deepEqual(again,gone);
 const restored=preparePackSave(again,definitions);assert.deepEqual(restored.locations,before.locations);assert.deepEqual(restored.availabilities,before.availabilities);assert.deepEqual(restored.content_packs.packs,{});assert.equal(restored.content_packs.registered.workshop.native,undefined);assert.deepEqual(before,fixture());
});
test('same registration requires exact identity; dormant envelope cannot claim unrelated records',()=>{
 const gone=preparePackSave(fixture(),new Map());assert.throws(()=>preparePackSave(gone,new Map([[d.id,{...d,locations:[{id:'workshop.other'}]}]])),/migration/);
 gone.content_packs.registered.workshop.native.locations['unknown.room']={};assert.throws(()=>validatePackState(gone.content_packs),/Unowned/);
});
test('legacy unvisited unknown records without provenance remain protected, never guessed by prefix',()=>{
 const old=fixture();delete old.content_packs.registered;assert.deepEqual(preparePackSave(old,new Map()).locations,old.locations);
});

test('unvisited registered native non-person inventories park and restore exact records',()=>{
 const d={schema:2,id:'cargo',world:{id:'cargo.world'},locations:[{id:'cargo.room'}],items:[{id:'cargo.vial'}],simulation:{containers:[{id:'cargo.box',category:'storage'}]}};
 const defs=new Map([['cargo',d]]),state=packSaveState({schema:1,packs:{}},defs);
 const key=JSON.stringify({id:'cargo.vial'}),original={content_packs:state,locations:{},availabilities:{location:{},item:{}},inventories:{storage:{'cargo.box':{[key]:{count:1}},unrelated:{}}}};
 const parked=preparePackSave(original,new Map());assert.equal(parked.inventories.storage['cargo.box'],undefined);assert.deepEqual(parked.inventories.storage.unrelated,{});assert.equal(parked.content_packs.registered.cargo.native.inventories.storage['cargo.box'][key].count,1);
 const changed=new Map([['cargo',{...d,simulation:{containers:[{category:'storage',id:'cargo.other'}]}}]]);assert.throws(()=>preparePackSave(parked,changed),/migration/);
 const restored=preparePackSave(parked,defs);assert.deepEqual(restored.inventories,original.inventories);assert.equal(restored.content_packs.packs.cargo,undefined);
 const wrong=structuredClone(parked);wrong.content_packs.registered.cargo.native.inventories.storage.unrelated={};assert.throws(()=>preparePackSave(wrong,defs),/Unowned/);
});

test('explicit additive migration updates registered ids without granting items or changing parked state',()=>{
 const prior={schema:1,packs:{},registered:{add:{worldId:'add.world',locationIds:['add.old'],itemIds:['add.item.old']}}};
 const d={schema:2,id:'add',world:{id:'add.world'},locations:[{id:'add.old'},{id:'add.new'}],items:[{id:'add.item.old'},{id:'add.item.new'}],compatibility:{registrationAdditions:{locationIds:['add.new'],itemIds:['add.item.new']}}};
 const original={content_packs:prior,character:{money:42},inventories:{player:{kept:3}}};
 const migrated=preparePackSave(original,new Map([['add',d]]));
 assert.deepEqual(migrated.content_packs.registered.add.locationIds,['add.old','add.new']);
 assert.deepEqual(migrated.content_packs.registered.add.itemIds,['add.item.old','add.item.new']);
 assert.deepEqual(migrated.inventories,original.inventories);assert.deepEqual(original.content_packs,prior);
 assert.throws(()=>preparePackSave(original,new Map([['add',{...d,compatibility:{}}]])),/migration/);
 assert.throws(()=>preparePackSave(original,new Map([['add',{...d,locations:[{id:'add.renamed'},{id:'add.new'}]}]])),/migration/);
});

// Regressions for the 2026-11-13 stranded lead saves (lead core-flow audit G1; played check: tests/lead_saves_load.test.js).
test('a save registered before the Gu keeper pack gained items still restores',async()=>{
 const {guKeeperLife,KEEPER_ITEM_ADDITIONS:added}=await import('../src/world_packs/book_gu_keeper.js');
 assert.equal(guKeeperLife.compatibility.registrationAdditions,undefined,'declared beside the definition so its pinned hash holds');
 const now=guKeeperLife.items.map(i=>i.id);
 const before=now.filter(id=>!added.includes(id));
 assert.equal(before.length,8,'the registration every 2026-11-09 lead save carries');
 const save={content_packs:{schema:1,packs:{},registered:{[guKeeperLife.id]:{worldId:guKeeperLife.world.id,locationIds:guKeeperLife.locations.map(l=>l.id),itemIds:before}}}};
 assert.deepEqual(preparePackSave(save,new Map([[guKeeperLife.id,guKeeperLife]])).content_packs.registered[guKeeperLife.id].itemIds,now);
});

test('identity aliases map an acknowledged content hash and stay out of the hashed source',async()=>{
 const {structuredIdentitySource,structuredIdentityAliases,structuredContentHash}=await import('../src/structured_native_registration.js');
 const a='sha256:'+'a'.repeat(64),b='sha256:'+'b'.repeat(64),raw={id:'x',compatibility:{legacy:'preserve-dormant'},simulation:{commands:[]}};
 const declared={...raw,compatibility:{...raw.compatibility,identityAliases:[{from:a,to:b,reason:'same life, recompiled'}]}};
 assert.equal(await structuredContentHash(structuredIdentitySource(declared)),await structuredContentHash(raw));
 assert.equal(structuredIdentityAliases(declared).get(a),b);
 assert.equal(structuredIdentityAliases(raw).size,0);
 for(const bad of [[{from:a,to:a,reason:'r'}],[{from:a,to:b}],[{from:'nope',to:b,reason:'r'}],'x'])
  assert.throws(()=>structuredIdentityAliases({compatibility:{identityAliases:bad}}),/Invalid identity alias/);
 assert.throws(()=>structuredIdentityAliases({compatibility:{identityAliases:[{from:a,to:b,reason:'r'}]}},new Map([[a,'sha256:'+'c'.repeat(64)]])),/Invalid identity alias/);
});
