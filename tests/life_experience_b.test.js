import test from 'node:test';
import assert from 'node:assert/strict';
import {createChronicle,commandChronicle,advanceChronicle,validateChronicle,createHeirChronicle,GAME_YEAR,responseCost} from '../src/chronicle.js';
import {lifeGrave,lifeLearningMultiplier} from '../src/life_experience.js';
import {buildLifeHeirSave} from '../src/life_experience_host.js';
import {createLifeRecord,lifeRecordView} from '../src/life_record.js';
import {deriveHeirLeftovers} from '../src/heir_inheritance.js';
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
const state=()=>({sequence:0,clock:0,chronicle:createChronicle(0,calendar,true),rng:7});
const ctx={location:'Village',calendar};
test('only a learned lesson can be written or taught; teaching spends five shared-clock minutes once',()=>{
 const s=state();assert.throws(()=>commandChronicle(s,{type:'reflect',lesson:'routeSignals'},ctx),/not learned/);
 s.chronicle.knowledge.routeSignals=true;assert.throws(()=>commandChronicle(s,{type:'teach',lesson:'routeSignals'},ctx),/elder/);
 s.chronicle.life.initialAge=70;const taught=commandChronicle(s,{type:'teach',lesson:'routeSignals'},ctx);
 assert.equal(taught.minutes,5);assert.equal(taught.state.chronicle.life.experience.bequest,'routeSignals');assert.equal(s.chronicle.life.experience,undefined);
 assert.throws(()=>commandChronicle(taught.state,{type:'teach',lesson:'routeSignals'},ctx),/already knows/);
 validateChronicle(taught.state.chronicle,0);
});
test('last-year warning and grave occur once at clock boundaries, and the epitaph remembers a real promise',()=>{
 let c=createChronicle(0,calendar,true);c.life.initialAge=78;c.relationships.villageElder.ties.dutyKept=true;
 c=advanceChronicle(c,GAME_YEAR);assert.equal(c.log.filter(m=>m.text.includes('seasons feel shorter')).length,1);
 c=advanceChronicle(c,GAME_YEAR+1);assert.equal(c.log.filter(m=>m.text.includes('seasons feel shorter')).length,1);
 c=advanceChronicle(c,GAME_YEAR*2);assert.equal(c.life.endedAt,GAME_YEAR*2);assert.match(c.life.experience.grave.epitaph,/kept a promise/);
 const after=advanceChronicle(c,GAME_YEAR*2);assert.deepEqual(after,c);assert.equal(lifeLearningMultiplier(c),1);
 assert.throws(()=>lifeGrave(createChronicle(0,calendar)),/still/);
});
test('a written lesson waits in the heir papers; studying it costs five minutes and then affects an existing paid response',()=>{
 const old=createChronicle(0,calendar,true);old.knowledge={guardLesson:true,routeSignals:true};old.life.experience={reflected:['guardLesson'],taught:[],bequest:'guardLesson'};
 old.relationships.villageElder.ties.dutyKept=true;const dead=advanceChronicle(old,62*GAME_YEAR);
 const leftovers=deriveHeirLeftovers({expansion:{chronicle:dead},character:{money:0}});
 const heir=createHeirChronicle(dead,0,calendar,'Predecessor',leftovers);assert.deepEqual(heir.knowledge,{});assert.equal(heir.life.initialAge,18);assert.equal(heir.life.endedAt,null);
 assert.equal(heir.relationships.villageElder.ties.dutyKept,undefined);assert.equal(heir.life.experience.inheritedFrom.name,'Predecessor');assert.deepEqual(heir.life.experience.inheritance.papers,['guardLesson']);
 validateChronicle(heir,0);
 assert.throws(()=>commandChronicle({sequence:0,clock:0,chronicle:heir,rng:7},{type:'study',lesson:'routeSignals'},ctx),/do not hold/);
 const studied=commandChronicle({sequence:0,clock:0,chronicle:heir,rng:7},{type:'study',lesson:'guardLesson'},ctx);assert.equal(studied.minutes,5);
 const h=studied.state.chronicle;assert.equal(h.knowledge.guardLesson,true);assert.throws(()=>commandChronicle(studied.state,{type:'study',lesson:'guardLesson'},ctx),/already know/);
 h.session={hero:{staminaMultiplier:1,strikeMultiplier:1}};assert.equal(responseCost(h,'guard'),3);h.session=null;
 assert.throws(()=>createHeirChronicle(old,0,calendar,'x',leftovers),/no ended/);
 assert.throws(()=>createHeirChronicle(dead,0,calendar,'x'),/not been counted/);
});
test('heir envelope keeps the pristine body and XP and adds what the life left: money, belongings and biography',()=>{
 const old=state();old.chronicle.knowledge.routeSignals=true;old.chronicle.life.experience={reflected:['routeSignals'],taught:[],bequest:'routeSignals'};old.chronicle=advanceChronicle(old.chronicle,62*GAME_YEAR);old.clock=62*GAME_YEAR;
 const previous={npc_lives:{schema:1,worldMarker:'kept'},options:{uniform_text_size_in_action:true},character:{name:'Ada',money:90000},levels:{person:{main_character:{total_xp:100000}}},'current time':calendar,expansion:old,life_record:createLifeRecord(),
  inventories:{person:{main_character:{bread:{count:2},'{"id":"Old combat manual"}':{count:1}}}}};
 const fresh={character:{name:'You',money:102},levels:{person:{main_character:{total_xp:0}}},'current time':calendar,expansion:{chronicle:null},inventories:{person:{main_character:{bread:{count:5}}}}};
 const before=structuredClone(previous),next=buildLifeHeirSave(previous,fresh);assert.deepEqual(next.npc_lives,previous.npc_lives);assert.deepEqual(next.options,previous.options);
 assert.equal(next.character.money,90102);assert.equal(next.levels.person.main_character.total_xp,0);assert.deepEqual(next.inventories.person.main_character,{bread:{count:7},'{"id":"Old combat manual"}':{count:1}});assert.deepEqual(previous,before);
 const oldEnvelope=structuredClone(previous);delete oldEnvelope.life_record;assert.equal(lifeRecordView(buildLifeHeirSave(oldEnvelope,fresh).life_record).recent[0].kind,'legacy');
 assert.deepEqual(next.expansion.chronicle.knowledge,{});assert.deepEqual(next.expansion.chronicle.life.experience.inheritance.papers,['routeSignals']);assert.equal(lifeRecordView(next.life_record).recent[0].kind,'legacy');validateChronicle(next.expansion.chronicle,0);
});

test('a pre-slice final-year save receives its warning now, without inventing an earlier journal entry',()=>{
 let c=createChronicle(0,calendar,true);c.life.initialAge=78;c=advanceChronicle(c,GAME_YEAR+12);
 delete c.life.experience;c.log=c.log.filter(m=>!m.text.includes('seasons feel shorter'));
 const savedAt=c.lastClock,next=advanceChronicle(c,savedAt+1);assert.equal(next.log.at(-1).at,savedAt);assert.equal(next.life.initialAge,78);
 validateChronicle(next,savedAt+1);
});
