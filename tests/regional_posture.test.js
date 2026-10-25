import test from 'node:test';
import assert from 'node:assert/strict';
import {freshJournal,writeJournal,validateJournal} from '../src/personal_journal.js';
import {chooseRegionPosture,regionPosture} from '../src/regional_posture.js';
import {reflectionMessage,renderMemory,validateMemoryMessage} from '../src/memory_messages.js';
import {appendLifeMilestone,createLifeRecord} from '../src/life_record.js';
const region={world:'base.frontier',place:'Village',posture:'curious'};
test('regional attitude remains separate from literal prose, actual places and other worlds',()=>{
 const text='今天\n  My words 🪷\n',old=writeJournal(text),j=chooseRegionPosture(old,region);assert.equal(j.text,text);assert.equal(old.regions,undefined);assert.equal(regionPosture(j,region.world,region.place),'curious');assert.equal(regionPosture(j,'other.world','Village'),null);assert.equal(regionPosture(j,region.world,'Shack'),null);assert.equal(writeJournal(text+'next',j).regions[0].posture,'curious');assert.equal(writeJournal(text+'next',j).text,text+'next');validateJournal(JSON.parse(JSON.stringify(j)));assert.deepEqual(chooseRegionPosture(j,{...region,posture:null}),old);
 assert.throws(()=>chooseRegionPosture(j,{...region,posture:'omniscient'}),/actual current place/);assert.throws(()=>validateJournal({...j,regions:[...j.regions,...j.regions]}),/regional/);
 let bounded=freshJournal();for(let n=0;n<260;n++)bounded=chooseRegionPosture(bounded,{...region,place:'Known '+n});assert.equal(bounded.regions.length,256);assert.equal(bounded.regions[0].place,'Known 4');
});
test('subsequent keyed reflections read the chosen actual region in both languages without changing older memories',()=>{
 const save={'current location':'Village',expansion:{actors:{player:{worldId:'base.frontier'}}},personal_journal:chooseRegionPosture(freshJournal(),region),pledges:{trial:{quality:2}},life_record:createLifeRecord()};const a=reflectionMessage(save,'Village');assert.equal(a.payload.posture,'curious');assert.match(renderMemory(a),/small details/);assert.match(renderMemory(a,'chinese'),/细节/);assert.match(renderMemory(a),/2 trial quality/);validateMemoryMessage(a);
 const other=reflectionMessage({...save,'current location':'Shack'},'Shack');assert.equal(other.payload.posture,undefined);assert.doesNotMatch(renderMemory(other),/small details/);
 const old=structuredClone(a);delete old.payload.posture;assert.doesNotMatch(renderMemory(old),/small details/);validateMemoryMessage(old);const bad=structuredClone(a);bad.payload.posture='future';assert.throws(()=>validateMemoryMessage(bad),/reflection/);
 const long={...save,'current location':'L'.repeat(160),personal_journal:chooseRegionPosture(freshJournal(),{...region,place:'L'.repeat(160),posture:'company'})};const m=reflectionMessage(long,'L'.repeat(160));assert.ok(m.text.length<=240);appendLifeMilestone(createLifeRecord(),{year:0,at:0,worldId:'base.frontier',kind:'memory',...m});
});
import {configurePersonalJournal} from '../src/personal_journal_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
test('posture-only journals persist atomically, retain words and keep post-durable choices',()=>{
 const d=domainRegistry.list().find(d=>d.id==='personal_journal');let fail=true,after=false,place='Village';configurePersonalJournal({writable:()=>true,world:()=>region.world,location:()=>place,persist:cb=>{if(fail)throw Error('quota');cb();if(after)throw Error('post-durable display');}});d.load(writeJournal('  exact words\n'));
 const choose=domainRegistry.command('personal_journal','posture'),write=domainRegistry.command('personal_journal','write');assert.throws(()=>choose('curious'),/quota/);assert.deepEqual(d.save(),writeJournal('  exact words\n'));fail=false;choose('curious');assert.equal(d.save().regions[0].place,'Village');assert.equal(d.save().text,'  exact words\n');write('new words');assert.equal(d.save().regions[0].posture,'curious');place='Shack';choose('quiet');assert.equal(d.save().regions.length,2);after=true;assert.throws(()=>choose('company'),/post-durable/);assert.equal(regionPosture(d.save(),region.world,'Shack'),'company');
 d.load(freshJournal());after=false;choose('quiet');assert.ok(d.save().regions.length);assert.equal(d.save().text,'');
});
