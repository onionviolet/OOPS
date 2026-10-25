import {loadNative,STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyFurnace,accrueFurnace,rebaseFurnaceSave,stageFurnaceStep,runPatientFurnace,FURNACE_DEFAULTS} from '../src/patient_furnace.js';
import {createHarvest,drawSpecimen,addCarcass,setHarvestRoutine} from '../src/harvest.js';
import {initializeExpedition,expeditionRegistry} from '../src/expedition_content.js';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {createChronicle} from '../src/chronicle.js';
const calendar={year:999,month:4,day:1,hour:8,minute:0,day_count:1};
function fixture(){const harvest=createHarvest();addCarcass(harvest,drawSpecimen({species:'Wolf rat',key:'furnace',clock:0},()=>.4),{clock:0});setHarvestRoutine(harvest,1,0);const state=initializeExpedition(createExpansionState(7));return {state,external:{money:1},gameplay:{player:{inventory:{},skills:{Butchering:{enabled:false,xp:0}},reputation:{}}},harvest,cheats:{held:{'patient-furnace':{card:{state:{away:{...emptyFurnace(),assigned:true,world:'base.frontier',anchor:1000,bank:20}}}}}},context:{clock:0,skill:0,tool:100},world:'base.frontier',clock:0,reason:''};}
function advance(s){return advanceSimulation(s.state,expeditionRegistry,1,s.external,s.gameplay,{player:{facts:{location:'Village'},vitals:{health:30,max_health:30,stamina:30,max_stamina:30}}});}
test('Furnace spends real native time and exact finite supplies, grants native output/XP, preserves unused bank',()=>{
 let live=fixture(),notes=[];
 const spent=runPatientFurnace({read:()=>live,advance:()=>advance(live),commit:p=>{live={...live,...p,clock:p.state.clock,context:{...live.context,clock:p.state.clock},harvest:p.nativePatch.harvest,cheats:p.nativePatch.cheats};},note:n=>notes.push(n)});
 assert.equal(spent,5,'one start tick plus actual four-minute tool work');assert.equal(live.state.clock,5);assert.equal(live.harvest.processed,1);assert.equal(live.harvest.routine.status,'complete');assert.equal(live.cheats.held['patient-furnace'].card.state.away.bank,15);assert.equal(live.gameplay.player.skills.Butchering.xp,8);assert.equal(Object.values(live.gameplay.player.inventory).reduce((a,b)=>a+b,0),4);assert.match(notes.at(-1),/complete/);
});
test('Furnace native waiting choices stop clock and linked gains; bank is unchanged',()=>{
 let s=fixture();s.state.opportunities.waiting={definitionId:[...expeditionRegistry.opportunities.keys()][0],context:{actorId:'player',worldId:'base.frontier'},status:'available',blocking:true,due:0,expires:10};
 let notes=[],commits=0;runPatientFurnace({read:()=>s,advance:()=>advance(s),commit:()=>commits++,note:n=>notes.push(n)});assert.equal(commits,0);assert.equal(s.cheats.held['patient-furnace'].card.state.away.bank,20);assert.match(notes[0],/choice|boundary/);
});
test('staged native envelope fails without publishing clock, output or debit; successful retry has identical plan',()=>{
 const s=fixture(),before=structuredClone(s),p=stageFurnaceStep(advance(s),s);let bytes;
 const options={createSave:()=>JSON.stringify({character:{money:1},inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}},expansion:s.state,cheats:s.cheats,harvest:s.harvest}),key:'test',bindings:{player:{category:'person',id:'main_character'}},storage:{setItem:()=>{throw Error('quota');}}};
 assert.throws(()=>persistExpansionPlan(p,options),/quota/);assert.deepEqual(s,before);persistExpansionPlan(p,{...options,storage:{setItem:(_,b)=>{bytes=b;}}});const saved=JSON.parse(bytes);assert.equal(saved.expansion.clock,1);assert.equal(saved.cheats.held['patient-furnace'].card.state.away.bank,19);assert.equal(saved.harvest.job.remaining,4);
});
test('away accrual is loaded once, online durable rebase prevents duplicate credit, unused time has no expiry',()=>{
 const s=fixture(),now=11000,a=accrueFurnace(s.cheats,now);assert.equal(a.held['patient-furnace'].card.state.away.bank,20+10000/FURNACE_DEFAULTS.realMsPerMinute);assert.deepEqual(accrueFurnace(a,now),a);
 const save={cheats:a};rebaseFurnaceSave(save,now+5000);assert.deepEqual(accrueFurnace(save.cheats,now+5000),save.cheats);assert.equal(s.cheats.held['patient-furnace'].card.state.away.anchor,1000);
});

test('native locked skill can quote a prepared unlock without mutating its availability',async()=>{
 const {character,skills,fill_availability_methods}=await loadNative(`export {character} from './src/data/character.js';export {skills} from './src/data/skills.js';export {fill_availability_methods} from './src/component_management.js';`,{stubs:STANCE_LOCATION_STUBS,prefix:'d4-furnace-'});fill_availability_methods();const skill=skills.Butchering;
 assert.equal(!!skill.canGainXP({character}),false);assert.equal(!!skill.canGainXP({character},{preparedUnlock:true}),true);const a=skill.getDefaultSkillXP(),b=skill.getDefaultSkillXP();skill.add_xp({skillXP:a,xp_to_add:8,track_dependencies:false});assert.equal(a.total_xp,0);
 skill.add_xp({skillXP:b,xp_to_add:8,track_dependencies:false,preparedUnlock:true});assert.equal(b.total_xp,8);assert.equal(skill.isUnlocked(),false,'quote leaves actual unlock to native durable publication');
});
