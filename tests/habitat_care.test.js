import test from 'node:test';
import assert from 'node:assert/strict';
import {HABITAT as H,HAY_KEY as hay,WOOL_KEY as wool,planHabitatAction,projectHabitat,habitatFacts,validateHabitat} from '../src/habitat_care.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';
import {encodeSaveFile,decodeSaveFile,validateSaveEnvelope} from '../src/save_files.js';
const initial=()=>({owner:null,clock:100,money:100,inventory:{},location:H.location,world:H.world,ready:true});
function act(p,action){const q=planHabitatAction(p.owner,action,p),inventory={...p.inventory};for(const {key,amount}of q.items){inventory[key]=(inventory[key]||0)+amount;if(!inventory[key])delete inventory[key];}validateHabitat(q.state,p.clock);return {...p,owner:q.state,money:q.money,inventory};}
const housed=()=>act(act(initial(),'build'),'adopt');
const cared=()=>act(act(act(housed(),'buy_feed'),'feed'),'attend');
test('site and creature are actually paid, unique and bound to suitable player ownership',()=>{
    const p=initial();assert.throws(()=>act(p,'adopt'),/pen/);assert.throws(()=>act({...p,money:17},'build'),/18 coins/);
    const built=act(p,'build');assert.equal(built.money,82);assert.throws(()=>act(built,'build'),/already/);
    const own=act(built,'adopt');assert.equal(own.money,70);assert.equal(own.owner.animal.site,own.owner.site.id);assert.throws(()=>act(own,'adopt'),/already/);
    for(const change of [{ready:false},{location:'Shack'},{world:'pocket.other'}])assert.throws(()=>act({...own,...change},'buy_feed'),/Village/);
});
test('no inherited care, instant harm or stock; feeding spends real inventory once',()=>{
    let p=housed();assert.equal(habitatFacts(p.owner,500).welfare,'Safe in suitable shelter with clean water');assert.equal(projectHabitat(p.owner,500).progress,0);assert.deepEqual(p.inventory,{});
    assert.throws(()=>act(p,'feed'),/actual/);p=act(p,'buy_feed');assert.equal(p.inventory[hay],1);assert.equal(p.money,68);
    p=act(p,'feed');assert.equal(p.inventory[hay],undefined);assert.equal(p.owner.feeds,1);assert.throws(()=>act(p,'feed'),/ration/);
    assert.equal(projectHabitat(p.owner,106).progress,0);assert.throws(()=>act({...p,clock:106},'collect'),/not ready/);
});
test('attention alone produces nothing; both care orders support the same finite batch',()=>{
    for(const order of [['feed','attend'],['attend','feed']]){
        let p=act(housed(),'buy_feed');p=act(p,order[0]);assert.equal(projectHabitat(p.owner,105).progress,0);p=act({...p,clock:102},order[1]);
        assert.equal(habitatFacts(p.owner,107).ready,false);assert.equal(habitatFacts(p.owner,108).ready,true);
        const f=habitatFacts(p.owner,130);assert.equal(f.fed,false);assert.equal(f.attended,false);assert.equal(f.ready,true);assert.match(f.welfare,/Safe/);
        const done=act({...p,clock:130},'collect');assert.equal(done.inventory[wool],5);assert.equal(done.owner.collected,1);assert.throws(()=>act(done,'collect'),/not ready/);
        assert.equal(projectHabitat(done.owner,500).progress,0);assert.equal(projectHabitat(done.owner,500).collected,1);
    }
});
test('partial supported time pauses, survives persistence and resumes with new paid care',()=>{
    let p=act(act(housed(),'buy_feed'),'feed');p=act({...p,clock:110},'attend');
    assert.equal(projectHabitat(p.owner,120).progress,2);
    p=act({...p,clock:120},'buy_feed');p=act(p,'feed');p=act({...p,clock:122},'attend');
    p.owner=JSON.parse(JSON.stringify(p.owner));assert.equal(projectHabitat(p.owner,124).progress,6);
    assert.equal(act({...p,clock:124},'collect').inventory[wool],5);
});
test('save/reload/export-style roundtrip retains pending and collected states without rewards',()=>{
    let p=cared();for(const clock of [103,106]){
        const loaded=JSON.parse(JSON.stringify({...p,clock}));assert.deepEqual(loaded.inventory,p.inventory);assert.equal(habitatFacts(loaded.owner,clock).state.progress,clock-100);
        assert.deepEqual(projectHabitat(loaded.owner,clock),projectHabitat(p.owner,clock));
    }
    p=act({...p,clock:106},'collect');const saved=JSON.stringify(p);const loaded=JSON.parse(saved);
    assert.deepEqual(loaded,p);assert.throws(()=>act(loaded,'collect'));assert.equal(loaded.inventory[wool],5);
    assert.equal(validateHabitat(null),null);assert.equal(projectHabitat(null,100),null);
});
test('malformed ownership, future receipts, unsupported revisions and impossible harvest reject',()=>{
    const p=cared();for(const mutate of [s=>s.schema=2,s=>s.site.owner='stranger',s=>s.site.sheltered=false,s=>s.animal.site='other',s=>s.animal.owner='stranger',s=>s.fedAt=101,s=>s.progress=7,s=>s.collected=2]){
        const bad=structuredClone(p.owner);mutate(bad);assert.throws(()=>validateHabitat(bad,100));
    }
});
test('failed durable publication restores the exact native inventory, purse and care owner',()=>{
    const p=cared(),model={money:p.money,inventory:structuredClone(p.inventory)};let owner=p.owner;
    const before=structuredClone({model,owner});const tx=beginNativeCraftTransaction({owners:[model],bindings:[{get:()=>owner,set:v=>owner=v}]});
    const result=planHabitatAction(owner,'collect',{...p,clock:106});owner=result.state;model.inventory[wool]=5;
    tx.rollback();assert.deepEqual({model,owner},before);assert.equal(tx.status,'rolled-back');
});
test('real native save encoding accepts optional care and leaves old envelopes without it unchanged',()=>{
    const version='v0.5.5.30',old={'game version':version,'current time':{year:999,month:4,day:1,hour:8,minute:0},
        'current location':'Village',character:{name:'Hero',money:102,xp:{total_xp:0},inventory:{},equipment:{}},
        skills:{Literacy:{total_xp:0}},locations:{},activities:{},dialogues:{},traders:{}};
    assert.deepEqual(validateSaveEnvelope(old,version),old);assert.equal(Object.hasOwn(old,'meadow_pen'),false);
    const p=cared(),saved={...old,meadow_pen:p.owner};
    assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(saved)),version),saved);
    saved.meadow_pen.animal.owner='foreign';assert.throws(()=>decodeSaveFile(encodeSaveFile(JSON.stringify(saved)),version),/owned pen/);
});
