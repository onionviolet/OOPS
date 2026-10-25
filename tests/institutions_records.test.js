import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveWorldHistory,upgradeWorldEvents,validateLoreHistory,validateWorldHistory,appendStoryOutcome,standingAt} from '../src/lore_history_state.js';
import {freshSkillRecords,observeSkills,rustBonuses,rustCeiling,dialFor,lifeSummary,validateSkillRecords} from '../src/skill_records.js';
const W='base.frontier',dial=dialFor(W);
test('G62 events are deterministic, validated and each carries a cause',()=>{
 const a=deriveWorldHistory({clock:1,rng:7},{}),b=deriveWorldHistory({clock:1,rng:7},{});
 assert.deepEqual(a.events,b.events);assert.ok(a.events.length>0);
 for(const e of a.events)assert.ok(e.cause.kind&&e.year>=0);
 for(const e of a.events.filter(e=>e.kind==='schism'))assert.ok(!a.factions.some(f=>f.id===e.child)&&e.share>0);
});
test('G62 an old-shape history validates, upgrades once and keeps its wars',()=>{
 const st={clock:5,rng:3};const w=deriveWorldHistory(st,{});const events=w.events;
 delete st.loreHistory.worldHistories[W].events;const wars=structuredClone(w.wars);
 validateLoreHistory(st);
 const up=upgradeWorldEvents(st,W);assert.deepEqual(up.events,events);assert.deepEqual(up.wars,wars);
 assert.equal(upgradeWorldEvents(st,W).events,up.events);
 assert.throws(()=>validateWorldHistory({...up,events:[{id:'x',kind:'pact',year:1,a:'zz',b:'zzz',from:'ally',to:'enemy',cause:{kind:'x'}}]}));
 // story recording still works with events present
 appendStoryOutcome(st,{operation:'o1',worldId:W,actor:'player',issuer:'i',targetPerson:null,targetObject:null,targetPlace:'Village',action:'storylet.ambient',result:'r',at:1,producer:'P3',causeRefs:['c'],historyCauses:[],audience:[],known:{},applied:[]});
 assert.equal(st.loreHistory.receipts.length,1);
});
test('G62 standing folds events over the year-0 relations',()=>{
 const w=deriveWorldHistory({clock:1,rng:11},{}),b=w.events.find(e=>e.kind==='breach');
 if(b){assert.equal(standingAt(w,b.a,b.b),b.to);assert.equal(standingAt(w,b.a,b.b,b.year-1)!==undefined,true);}
});
const row=(o={})=>({id:'Swords',level:10,totalXp:500,xp:10,toNext:100,...o});
test('G27 rust is off unless the player turns the world dial on; native xp is never touched',()=>{
 let r=freshSkillRecords();
 r=observeSkills(r,[row()],dial.grace+5*dial.step,{worldId:W});assert.deepEqual(rustBonuses(r),{});
 r.rustOn[W]=true;r=observeSkills(r,[row()],0,{worldId:W});
 assert.ok(rustBonuses(r).Swords<0);
});
test('G27 rust stops at the floor, practice wins levels back faster, turning the dial off lifts it',()=>{
 let r=freshSkillRecords();r.rustOn[W]=true;
 r=observeSkills(r,[row()],1,{worldId:W});
 r=observeSkills(r,[row()],dial.grace+100*dial.step,{worldId:W});
 assert.equal(-rustBonuses(r).Swords,rustCeiling(10,dial));assert.equal(10-rustCeiling(10,dial),Math.ceil(10*dial.floor));
 r=observeSkills(r,[row({totalXp:520})],10,{worldId:W});assert.equal(-rustBonuses(r).Swords,rustCeiling(10,dial)-dial.regain);
 r.rustOn[W]=false;r=observeSkills(r,[row({totalXp:520})],10,{worldId:W});assert.deepEqual(rustBonuses(r),{});
 assert.equal(observeSkills(freshSkillRecords(),[row()],dial.grace*9,{worldId:'other.world'}).tracked.Swords.rust,0);
});
test('G27 a skill stalled just short of its level records one near miss; low peaks do not rust',()=>{
 let r=freshSkillRecords();const near=row({xp:92,toNext:100});
 r=observeSkills(r,[near],1,{worldId:W,clock:50});r=observeSkills(r,[near],1500,{worldId:W,clock:60});r=observeSkills(r,[near],1500,{worldId:W,clock:70});
 assert.deepEqual(r.nearMisses,[{skill:'Swords',level:10,short:8,at:60,cause:'stalled'}]);validateSkillRecords(r);
 let low=freshSkillRecords();low.rustOn[W]=true;low=observeSkills(low,[row({level:2})],1,{worldId:W});low=observeSkills(low,[row({level:2})],dial.grace*20,{worldId:W});
 assert.deepEqual(rustBonuses(low),{});
});
test('G27 life summary lists paths not taken from discovered, unpracticed categories and declined requests',()=>{
 const s=lifeSummary(freshSkillRecords(),{worldId:W,discovered:[{id:'A',label:'Archery',category:'Combat',totalXp:0},{id:'S',label:'Smithing',category:'Crafting',totalXp:9},{id:'F',label:'Forging',category:'Crafting',totalXp:0}],declined:['rope for Tam','rope for Tam']});
 assert.deepEqual(s.untaken,[{category:'Combat',skills:['Archery']}]);assert.deepEqual(s.declined,['rope for Tam']);assert.equal(s.rustAvailable,true);
});
test('G62 event lines name a war by its year, never a raw id',async()=>{
 const {eventLines}=await import('../src/story_insight_domain.js');
 const lines=[1,2,3,7,11,5,9].map(rng=>deriveWorldHistory({clock:1,rng},{})).flatMap(eventLines).filter(l=>l.kind==='breach'||l.kind==='pact');
 assert.ok(lines.length>0);for(const l of lines)assert.match(l.line,/the war of Year \d+\./);assert.ok(!lines.some(l=>/war:\d/.test(l.line)));
});
