import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle,commandChronicle,advanceChronicle,validateChronicle,relationshipChange,chronicleFacts,GAME_YEAR} from '../src/chronicle.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {carryLedger,carryLedgerWorlds,CARRY_SCOPES,BOUNDARIES} from '../src/carry_ledger.js';
import {createDiscoveryCodex,recordDiscovered,discoveryCount,validateDiscoveryCodex,observeSaveDiscoveries} from '../src/discovery_codex.js';

const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const ctx={location:'Village',calendar};
const fresh=()=>({character:{name:'You',money:0,reputation:{Village:0,Slums:0,Town:0}},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,expansion:{chronicle:null},
    inventories:{person:{main_character:{}},storage:{player:{}}},availabilities:{location:{Shack:0,Village:1}}});
// The first-concession tie is seeded directly; the spar encounter that earns it is covered in chronicle.test.js.
function endedLife(conceded, codex) {
    let c=createChronicle(0,calendar,true);
    if(conceded)relationshipChange(c,'villageElder',{id:'test.concession',ties:{firstConcession:true},text:'Won the first concession.'},0);
    const end=62*GAME_YEAR;c=advanceChronicle(c,end);
    return {name:'Ada',character:{name:'Ada',money:0,reputation:{}},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,expansion:{chronicle:c,clock:end,rng:3},
        inventories:{person:{main_character:{'{"id":"Stale bread"}':{count:1}}},storage:{player:{}}},availabilities:{location:{Shack:0}},...(codex?{discovery_codex:codex}:{})};
}
const heirOf=prev=>buildLifeHeirSave(prev,fresh());
const offered=save=>{const c=save.expansion.chronicle;return chronicleFacts(c)['chronicle.remembersConcession'];};
const remember=c=>commandChronicle({sequence:0,clock:0,chronicle:c,rng:1},{type:'remember'},ctx);

test('IM11: remembers-gated greeting is offered in life 2 only when life 1 lived the scene, and survives reload',()=>{
    const lived=heirOf(endedLife(true)), unlived=heirOf(endedLife(false));
    assert.equal(offered(lived),true);assert.equal(offered(unlived),false);
    assert.throws(()=>remember(unlived.expansion.chronicle),/No earlier life/);
    const reloaded=JSON.parse(JSON.stringify(lived));validateChronicle(reloaded.expansion.chronicle,0);
    assert.equal(offered(reloaded),true);
    const out=remember(reloaded.expansion.chronicle);
    assert.equal(out.state.chronicle.relationships.villageElder.ties.rememberedConcession,true);
    assert.throws(()=>commandChronicle(out.state,{type:'remember'},ctx),/already greeted/);
    validateChronicle(JSON.parse(JSON.stringify(out.state.chronicle)),0);
});

test('IM11: the gate reads lived state, so a heir that only inherited the memory does not pass it on',()=>{
    const second=heirOf(endedLife(true));
    const c2=advanceChronicle(second.expansion.chronicle,62*GAME_YEAR);
    const third=heirOf({...endedLife(false),expansion:{chronicle:c2,clock:62*GAME_YEAR,rng:3},'current time':calendar});
    assert.equal(offered(third),false);
});

test('IM21: ledger lists every boundary with valid scopes for two worlds with different rules',()=>{
    const [a,b]=carryLedgerWorlds().map(carryLedger);
    assert.equal(carryLedgerWorlds().length,2);
    for(const ledger of [a,b]){
        assert.deepEqual(ledger.map(s=>s.boundary),[...BOUNDARIES]);
        for(const s of ledger)for(const r of s.rows)assert.ok(CARRY_SCOPES.includes(r.scope));
    }
    assert.notDeepEqual(a,b);
    assert.ok(a[1].rows.some(r=>r.scope==='last life')&&b[2].rows.some(r=>r.carries==='unavailable'));
    const unresolved=carryLedger('nowhere');
    assert.deepEqual(unresolved.map(section=>section.boundary),[...BOUNDARIES]);
    assert.ok(unresolved.every(section=>section.rows[0].carries==='unresolved'));
});

test('OG18: discovery codex counts ids across lives and passes through the heir save',()=>{
    let codex=recordDiscovered(createDiscoveryCodex(),'item',['Stale bread','Iron ore','Stale bread']);
    assert.equal(discoveryCount(codex,'item'),2);
    const prev=endedLife(true,observeSaveDiscoveries(codex,endedLife(true)));
    const heir=heirOf(prev);
    assert.equal(discoveryCount(heir.discovery_codex),discoveryCount(prev.discovery_codex));
    const grown=observeSaveDiscoveries(heir.discovery_codex,{...heir,inventories:{person:{main_character:{'{"id":"Old combat manual"}':{count:1}}},storage:{player:{}}}});
    assert.equal(discoveryCount(grown,'item'),3);
    validateDiscoveryCodex(JSON.parse(JSON.stringify(grown)));
    assert.equal(heirOf(endedLife(true)).discovery_codex,undefined,'older saves stay unchanged');
    assert.throws(()=>validateDiscoveryCodex({schema:1,seen:{item:['a','a']}}),/Invalid discovery/);
});

test('IM12 in the heir path: a processed good gains a passed line, other goods pass unchanged, and the law slice carries',async()=>{
    const {planProcessedMaterial,heirloomLines}=await import('../src/material_lineage.js');
    const {gradedKey}=await import('../src/harvest.js');
    const raw=gradedKey('Rat pelt',85,'damaged');
    const made=planProcessedMaterial({stock:{[raw]:2},inputs:[{item_key:raw,count:1}],output:{id:'Dried rat hide',family:'animal-hide',count:1},
        process:{id:'drying',revision:1,at:40,world_id:'base.frontier',parameters:{method:'rack'}},sourceFacts:{[raw]:{born:12,origin_world:'base.frontier'}}});
    const prev=endedLife(true);
    prev.inventories.person.main_character[made.item_key]={count:1};prev.inheritance_law={schema:1,law:'primogeniture'};
    const heir=heirOf(prev),keys=Object.keys(heir.inventories.person.main_character);
    const passedKey=keys.find(k=>heirloomLines(k).length);
    assert.ok(passedKey&&keys.includes('{"id":"Stale bread"}'));
    assert.deepEqual(heirloomLines(passedKey).map(l=>[l.kind,l.holder]),[['passed','the heir']]);
    assert.equal(heir.inheritance_law.law,'primogeniture');
});
