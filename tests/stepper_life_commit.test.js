import {rebaseFurnaceSave} from '../src/patient_furnace.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {observeLifeSave,createLifeRecord} from '../src/life_record.js';
import {advanceVillageLives,createVillageLives} from '../src/npc_lives.js';
import {createDurableSaveWriter} from '../src/save_files.js';

// Exercise the actual native owner, including the enrolled single-write branch.
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const owner=source.slice(source.indexOf('const lifeSaveStorage ='),source.indexOf('\nfunction nativeMistglassContext'));
// The owner ends before the next declaration; keep extraction independent of later helpers.
const definition=owner.slice(0,owner.indexOf('\n}};')+5);
const fixture=JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/absorb-all-2026-10-14/checks/sim-stepper/fixtures/opening.json',import.meta.url)));
function host({enrolled=false,fail=false,bootError=null}={}) {
    const writes=[],events=[];
    const write=(key,bytes)=>{events.push('write');if(fail)throw Error('quota');writes.push([key,bytes]);};
    const context=vm.createContext({JSON,structuredClone,domainRegistry:{command:()=>undefined},rebaseFurnaceSave,observeLifeSave,createLifeRecord,advanceVillageLives,
        authorityBootError:bootError,authorityBootPending:false,authorityEnrolled:()=>enrolled,
        nativeAuthority:{commitPreparedSave:bytes=>write('authority',bytes)},localStorage:{},writeGuardedSave:(_,key,bytes)=>write(key,bytes),
        // The real D3 writer over the same stub, so unchanged-write skipping is exercised too.
        durableSaves:createDurableSaveWriter({getItem:()=>null},(_,key,bytes)=>write(key,bytes)),
        // A visible tab (D4): panels render now; the panel list itself lives outside this owner.
        deferWhileHidden:()=>false,renderSavedPanels(){},
        nativeP23Transaction:{status:'pending',markDurable(){events.push('durable');this.status='durable';}},
        migrateVillageCareer:()=>{events.push('publish');return {};},migrateWorkLedger:x=>structuredClone(x),customizationFromSave:x=>structuredClone(x.customization),
        refreshCustomization(){},update_displayed_crafting_recipes(){},setCheatState:x=>{context.cheatState=x??{};},validateCheatState:x=>x,defaultCheatState:()=>({}),validatePackState:x=>x,emptyPackState:()=>({}),restoreGeneratedPeople(){},
        workLedger:structuredClone(fixture.work_ledger),villageCareer:{},customization:{},cheatState:{},optionalPackState:{},lifeRecord:null,npcLives:null,
        workLedgerPanel:null,optionalPackPanel:null,villageCareerControls:null,lifeRecordPanel:null,villageLivesPanel:null});
    vm.runInContext(definition+'\nglobalThis.storage=lifeSaveStorage;',context);
    return {storage:context.storage,writes,events,context};
}
function run(host,object,mutate=()=>{}) {
    const seed=structuredClone(fixture);seed.npc_lives=createVillageLives(seed['current time'].year);
    const plan={state:structuredClone(seed.expansion),external:{money:seed.character.money+7},gameplay:{},calendar:{...seed['current time'],year:seed['current time'].year+1}};
    mutate(plan);
    return persistExpansionPlan(plan,{createSave:()=>JSON.stringify(seed),storage:object?host.storage:{setItem:host.storage.setItem.bind(host.storage)},key:'test',validateEnvelope:()=>host.events.push('validate')});
}
for(const enrolled of [false,true])test(`object life commit equals string bytes and observations (enrolled=${enrolled})`,()=>{
    const a=host({enrolled}),b=host({enrolled});
    assert.equal(run(a,false),run(b,true));assert.deepEqual(a.writes,b.writes);assert.deepEqual(a.events,b.events);
    assert.equal(b.writes.length,1);assert.equal(b.writes[0][0],enrolled?'authority':'test');
    assert.deepEqual(b.events,['validate','write','durable','publish']);
    assert.equal(JSON.parse(b.writes[0][1]).npc_lives.lastYear,fixture['current time'].year+1);
});
test('both paths reject malformed envelopes and failed durable writes before publication',()=>{
    for(const object of [false,true]){
        const bad=host();assert.throws(()=>run(bad,object,p=>p.external.money=-1),/Invalid character/);assert.deepEqual(bad.events,[]);
        const failure=host({fail:true});assert.throws(()=>run(failure,object),/quota/);assert.deepEqual(failure.events,['validate','write']);assert.equal(failure.context.nativeP23Transaction.status,'pending');
        const blocked=host({bootError:Error('boot blocked')});assert.throws(()=>run(blocked,object),/boot blocked/);assert.deepEqual(blocked.events,['validate']);
    }
});
