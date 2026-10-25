import {readVillageObtainability} from '../scripts/village_supply_tables.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreams} from '../src/seeded_streams.js';
import {deriveWorldHistory} from '../src/lore_history_state.js';
import {worldHistoryFacts,villageHistoryContext,historyMural,ensureWorldHistory} from '../src/world_history_consumers.js';
import {createGeneratedPeople,validateGeneratedPeople,generatedPeopleView,interactGeneratedPerson} from '../src/generated_people.js';
import {createChronicle,commandChronicle,validateChronicle} from '../src/chronicle.js';
const world=seed=>({clock:0,streams:createStreams(seed)});
const withWars=()=>{for(let seed=1;seed<400;seed++){const s=world(seed);ensureWorldHistory(s);if(s.loreHistory.worldHistories['base.frontier'].wars.length>=2)return s;}throw Error('no seed with two wars');};
test('G5 getter, village realization and mural read the same stored history, stable across reload',()=>{
 const s=withWars(),h=s.loreHistory.worldHistories['base.frontier'];
 const facts=worldHistoryFacts(s),ctx=villageHistoryContext(s);
 assert.deepEqual(facts.wars,h.wars);assert.ok(facts.questSources.length>=2);assert.ok(facts.factions.some(f=>f.posture==='embattled'||f.posture==='at_war'));
 // reload: JSON round trip, then idempotent re-derive and a fresh-state derive agree with the stored value
 const reloaded=JSON.parse(JSON.stringify(s));assert.deepEqual(deriveWorldHistory(reloaded),h);assert.deepEqual(villageHistoryContext(reloaded),ctx);
 assert.equal(worldHistoryFacts({}),null);
 // generated people: more than 3, refugees cite real wars, old 3-person shape unchanged
 const people=createGeneratedPeople(42,1000,[],null,{revision:2,index:readVillageObtainability(),context:{history:ctx}});
 assert.equal(people.people.length,3+Math.min(2,h.wars.length));
 for(const p of people.people.filter(p=>p.origin.kind==='refugee'))assert.ok(h.wars.some(w=>w.id===p.origin.war));
 assert.deepEqual(validateGeneratedPeople(JSON.parse(JSON.stringify(people))),people);
 const base=createGeneratedPeople(42,1000,[],null,{revision:2,index:readVillageObtainability()});assert.equal(base.people.length,3);assert.ok(base.people.every(p=>!('origin' in p)));
 assert.deepEqual(people.people.slice(0,3).map(p=>({...p,origin:undefined,arrivedAt:0})),base.people.map(p=>({...p,arrivedAt:0,origin:undefined})));
 const met=interactGeneratedPerson(people,'traveler_1','meet').state;assert.ok(generatedPeopleView(met).find(p=>p.id==='traveler_1').origin);
 // mural line names a real war
 const m=historyMural(s,'base.frontier',0);assert.ok(m.text.includes(`year ${h.wars[0].year}`)&&m.warId===h.wars[0].id);
 assert.equal(historyMural(world(1),'base.frontier'),null);
 // chronicle: typed, capped, once per mural
 const c={...JSON.parse(JSON.stringify(s)),clock:0,sequence:0,chronicle:createChronicle(0,{year:1,month:1,day:1,hour:0,minute:0,day_count:0})};
 const ctxC={location:'Village'},out=commandChronicle(c,{type:'read_mural',warId:m.warId},ctxC).state;
 assert.ok(out.chronicle.log.at(-1).text===m.text&&out.chronicle.knowledge[`mural.${m.warId}`]);validateChronicle(out.chronicle,out.clock);
 assert.throws(()=>commandChronicle(out,{type:'read_mural',warId:m.warId},ctxC),/already/);
 assert.throws(()=>commandChronicle(c,{type:'read_mural',warId:'war:99'},ctxC),/mural/);
});
