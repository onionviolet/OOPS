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
