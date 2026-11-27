import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {preparePackSave,packSaveState} from '../src/content_packs.js';
import {HP_DORMANT_PREDECESSOR as rule} from '../src/hp_dormant_registration.js';
import {migrateRegistrationPredecessor,registrationIsDormant} from '../src/pack_registration_predecessors.js';
import {withHpLeadCast,HP_LEAD_IDENTITY_ALIASES} from '../src/book_world_hp_lead_pack.js';
import {packNative} from '../src/world_pack_registry.js';
import {structuredContentHash,structuredIdentitySource} from '../src/structured_native_registration.js';

const P=rule.packId;
const definition=()=>({schema:2,id:P,world:{id:rule.to.worldId},contentHash:rule.contentHash,
    locations:rule.to.locationIds.map(id=>({id})),items:rule.to.itemIds.map(id=>({id})),
    simulation:{containers:[]},compatibility:{registrationAdditions:{
        locationIds:[`${P}.dormitory`,`${P}.w6.classroom`,`${P}.w6.dungeon`,`${P}.w6.cabin`],
        itemIds:[`${P}.item.practice_feather`]}}});
const defs=d=>new Map([[P,d]]);
const old=()=>({content_packs:{schema:1,packs:{},registered:{[P]:structuredClone(rule.from)}},
    character:{money:42},inventories:{player:{kept:3}},locations:{Village:{seen:1},[`${P}.cupboard`]:{seen:8}},
    availabilities:{location:{Village:{is_unlocked:true}},item:{}},
    capabilityRuns:{version:1,runs:{ryan:{untouched:'earned checkpoint sentinel'}}}});

test('the exact dormant uncompiled predecessor updates provenance only and leaves caller bytes alone',()=>{
    const input=old(),before=structuredClone(input),migrated=preparePackSave(input,defs(definition()));
    assert.deepEqual(migrated.content_packs.registered[P],rule.to);
    assert.deepEqual(migrated.content_packs.packs,{});
    for(const key of ['character','inventories','locations','availabilities','capabilityRuns'])assert.deepEqual(migrated[key],before[key]);
    assert.deepEqual(input,before);
    assert.deepEqual(packSaveState(input.content_packs,defs(definition())).registered[P],rule.to);
});

test('canonical installed full registrations and ongoing HP work remain unchanged without changing identity',()=>{
    const d=definition(),input=old();input.content_packs.registered[P]=structuredClone(rule.to);
    input.content_packs.packs[P]={worldId:rule.to.worldId,locationIds:[...rule.to.locationIds],active:true,
        values:{kept:true},job:{actionId:`${P}.existing_work`,remaining:7}};
    const before=structuredClone(input);
    assert.equal(migrateRegistrationPredecessor(input.content_packs.registered[P],d,false),input.content_packs.registered[P]);
    assert.deepEqual(preparePackSave(input,defs(d)),before);
    assert.deepEqual(packSaveState(input.content_packs,defs(d)),before.content_packs);
    assert.equal(d.contentHash,rule.contentHash);
});

test('unknown, partial, reordered or changed-target registrations cannot impersonate the exact predecessor',()=>{
    const mutations=[
        save=>save.content_packs.registered[P].locationIds.push(`${P}.car`),
        save=>save.content_packs.registered[P].locationIds.pop(),
        save=>save.content_packs.registered[P].locationIds.reverse(),
        save=>save.content_packs.registered[P].locationIds.push(`${P}.unknown`),
        save=>save.content_packs.registered[P].itemIds.pop(),
        save=>save.content_packs.registered[P].itemIds.reverse(),
        save=>save.content_packs.registered[P].itemIds.push(`${P}.unknown`),
    ];
    for(const mutate of mutations){const input=old();mutate(input);assert.throws(()=>preparePackSave(input,defs(definition())),/migration/);}
    for(const mutate of [d=>d.contentHash='sha256:'+'a'.repeat(64),d=>d.locations.pop(),d=>d.locations.reverse(),
        d=>d.items.pop(),d=>d.items.reverse(),d=>d.world.id=`${P}.other`,
        d=>d.simulation.containers.push({category:'storage',id:`${P}.unknown`})]){
        const d=definition();mutate(d);assert.throws(()=>preparePackSave(old(),defs(d)),/migration/);
    }
    const brokenFull=old();brokenFull.content_packs.registered[P]=structuredClone(rule.to);
    brokenFull.content_packs.registered[P].locationIds.splice(5,1);
    assert.throws(()=>preparePackSave(brokenFull,defs(definition())),/migration/);
    const missingItem=old();missingItem.content_packs.registered[P]=structuredClone(rule.to);
    missingItem.content_packs.registered[P].itemIds.pop();
    assert.throws(()=>preparePackSave(missingItem,defs(definition())),/migration/);
});

test('a visited or active old stub does not take the dormant transition',()=>{
    const input=old();input.content_packs.packs[P]={worldId:rule.from.worldId,locationIds:[...rule.from.locationIds],
        active:false,values:{},job:null};
    assert.throws(()=>preparePackSave(input,defs(definition())),/migration/);
    assert.equal(registrationIsDormant({packs:{},structured:{packId:P}},P),false);
    assert.equal(registrationIsDormant({packs:{},pendingStructured:{packId:P}},P),false);
    const row=structuredClone(rule.from);
    assert.equal(migrateRegistrationPredecessor(row,definition(),false),row);
});

test('installed HP content hash and historical aliases stay exactly as before the provenance declaration',async t=>{
    const file=new URL('../private_packs/hp-cast/cast.json',import.meta.url);
    if(!existsSync(file))return t.skip('private installed cast absent');
    const raw=withHpLeadCast(packNative(P),JSON.parse(readFileSync(file,'utf8')));
    const hash=await structuredContentHash(structuredIdentitySource(raw));
    assert.equal(hash,'sha256:101f60377981b022c185a4928219c10105e15025c394049b275235f8a14da08f');
    assert.equal(HP_LEAD_IDENTITY_ALIASES.find(row=>row.from===hash)?.to,rule.contentHash);
    assert.deepEqual(raw.locations.map(row=>row.id),rule.to.locationIds);
    assert.deepEqual(raw.items.map(row=>row.id),rule.to.itemIds);
});
