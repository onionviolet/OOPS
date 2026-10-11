import test from 'node:test';import assert from 'node:assert/strict';
import {createVillageLives,advanceVillageLives,villageLivesView,validateVillageLives} from '../src/npc_lives.js';
test('one catch-up equals yearly lives, without replay or a per-minute loop',()=>{
    const start=createVillageLives(999,42);let stepped=start;for(let y=1000;y<=1119;y++)stepped=advanceVillageLives(stepped,y);
    const jumped=advanceVillageLives(start,1119);assert.deepEqual(jumped,stepped);assert.deepEqual(advanceVillageLives(jumped,1119),jumped);assert.equal(start.news.length,0);
    assert.ok(jumped.news.length<=16);assert.deepEqual(villageLivesView(jumped).people.map(p=>p.alive),[false,false,false,false,false,false]);
});
test('families remain hidden before their years, then age, marry and welcome children',()=>{
    const start=createVillageLives(999,42);const first=villageLivesView(start);assert.equal(first.people.length,3);assert.equal(first.people.find(p=>p.id==='lio').age,4);assert.equal(first.people.find(p=>p.id==='lio').spouse,null);
    const births=villageLivesView(advanceVillageLives(start,1002));assert.equal(births.people.find(p=>p.id==='neri').age,0);assert.deepEqual(births.people.find(p=>p.id==='neri').parents,['Maia','Oren']);assert.equal(births.news[0].kind,'birth');
    const grown=villageLivesView(advanceVillageLives(start,1023));assert.equal(grown.people.find(p=>p.id==='lio').age,28);assert.equal(grown.people.find(p=>p.id==='lio').spouse,'Rhea');assert.deepEqual(grown.people.find(p=>p.id==='nima').parents,['Lio','Rhea']);
});
test('saved schedules keep death dates stable across serialization and reload',()=>{
    const start=createVillageLives(999,99),r=JSON.parse(JSON.stringify(start));assert.deepEqual(validateVillageLives(r),start);assert.deepEqual(advanceVillageLives(r,1080),advanceVillageLives(start,1080));
    assert.throws(()=>advanceVillageLives(start,998));assert.throws(()=>validateVillageLives({...start,schema:2}));assert.throws(()=>validateVillageLives({...start,news:['unknown']}));
});
test('invalid or future household imports cannot replace the current save',async()=>{
    const {importSaveFile,encodeSaveFile}=await import('../src/save_files.js');
    const base={'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Hero',xp:{total_xp:0},equipment:{},inventory:{}},skills:{},locations:{},activities:{},dialogues:{},traders:{},npc_lives:createVillageLives(999,42)};
    for(const state of [{...base.npc_lives,schema:2},advanceVillageLives(base.npc_lives,1000)]) {
        let writes=0;await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify({...base,npc_lives:state})),{currentVersion:'v0.5.5.30',preflight:()=>assert.fail('must reject before real loader'),storage:{setItem(){writes++;}},key:'save'}));assert.equal(writes,0);
    }
});
