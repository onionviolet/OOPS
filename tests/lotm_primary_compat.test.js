import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {wait,registry,ctx,lotmFacts,I,hostOver} from './lotm_helpers.js';
import {lotmCommands} from '../src/book_world_lotm_actions.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope,migrateLotmPlaces} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
// Reconciliation checks (2026-10-24): saves and commands written by the primary checkout's parallel Q2/B2 lane, and by this lane's earlier candidate
// (university place id 'Tingen university quarter'), must load on the combined build with their progress intact. Primary fixtures come from
// dump_primary_q2_fixtures.mjs (the primary's own code run in a scratch overlay); old-candidate fixtures from dump_old_candidate_fixture.mjs.
const dir='docs/gm/dispatch/lotm-lives-regions-2026-10-23/fixtures/';
const read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8'));
const toRun=save=>({state:save.expansion,external:{money:50},gameplay:Object.fromEntries(Object.entries(save.inventories.person).map(([o,inv])=>[o==='main_character'?'player':o,{inventory:Object.fromEntries(Object.entries(inv).map(([k,v])=>[k,v.count])),skills:{},reputation:{}}]))});
const know=(p,k)=>p.state.simulation.knowledge.player[`book.lotm.${k}`]?.value;
const saveOf=p=>({expansion:p.state,'current location':p.state.simulation.people.player.location,inventories:{person:{main_character:Object.fromEntries(Object.entries(p.gameplay.player.inventory).map(([k,n])=>[k,{count:n}])),...Object.fromEntries(Object.entries(p.gameplay).filter(([k])=>k.startsWith('book.lotm.')).map(([k,v])=>[k,Object.fromEntries(Object.entries(v.inventory||{}).map(([a,n])=>[a,{count:n}]))]))}}});
test('every command the primary lane defines is present here with the same job-relevant definition (a saved job cannot disagree)',()=>{
 const mine=new Map(lotmCommands.map(c=>[c.id,c])),pick=c=>JSON.stringify({id:c.id,revision:c.revision,actorId:c.actorId,duration:c.duration,cancellation:c.cancellation,costs:c.costs,effects:c.effects,claim:c.claim});
 const theirs=read('primary_commands');assert.equal(theirs.length,40);
 // Q6 deliberately revises immediate Nighthawk assessments; only timed commands can be saved jobs.
 for(const c of theirs.filter(c=>c.duration>0))assert.equal(pick(mine.get(c.id)||{id:'MISSING '+c.id}),pick(c),c.id);
 assert.ok(theirs.filter(c=>/walk_|_docks$|_university$/.test(c.id)&&c.duration>0).length>=15);
});
test('primary saves load unchanged: pre-Q2 phases, a walk in flight, arrived, and district acts in flight, and the jobs finish on this build',()=>{
 const names=['primary_pre_q2_seer_taught','primary_pre_q2_seer_promoted','primary_pre_q2_cc_stabilized','primary_pre_q2_cc_promoted','primary_walk_midjob_docks','primary_arrived_docks','primary_docks_laying_midjob','primary_docks_laid','primary_university_reading_midjob'];
 for(const n of names){const s=read(n);assert.equal(migrateLotmPlaces(s),false,n+' needs no place rename');assert.ok(validateLotmState(s.expansion),n);assert.ok(validateLotmEnvelope(s),n);}
 // A walk in flight finishes and writes the arrival record, with the body already at the destination.
 let p=toRun(read('primary_walk_midjob_docks'));assert.equal(p.state.simulation.jobs.length,1);assert.equal(p.state.simulation.people.player.location,L.docks);
 p=wait(p,20);assert.equal(p.state.simulation.jobs.length,0);assert.match(know(p,'arrived'),/Mandated Punishers answer here, not Warden Hale/);assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(saveOf(p)));
 const f=lotmFacts(p.state,ctx(p));assert.equal(f['lotm.district.docks.here'],true);assert.equal(f['lotm.district.docks.supervised'],true);assert.equal(f['lotm.district.doseOk'],false);assert.equal(f['lotm.district.storm'],true,'and this lane\'s own fact agrees');
 // A vouched act in flight: attention was spent at start, the act counts at the end.
 p=toRun(read('primary_docks_laying_midjob'));const att=p.state.actors[I.supervisor].resources['book.lotm.attention'];p=wait(p,25);
 assert.equal(p.state.actors.player.resources['book.lotm.cc.acting'],1);assert.equal(p.state.actors[I.supervisor].resources['book.lotm.attention'],att);assert.match(know(p,'district.act'),/Hale vouched for you and spent 2 of his attention/);assert.ok(validateLotmState(p.state));
 p=toRun(read('primary_university_reading_midjob'));p=wait(p,10);assert.equal(p.state.actors.player.resources['book.lotm.acting'],1);assert.match(know(p,'district.act'),/Machinery team supervise at the university area/);assert.ok(validateLotmState(p.state));
 // The pathway view reads the primary's phases the same way.
 const v=s=>lotmPathView(s.expansion,lotmFacts(s.expansion,{gameplay:{player:{inventory:Object.fromEntries(Object.entries(s.inventories.person.main_character).map(([k,x])=>[k,x.count]))}}}));
 assert.equal(v(read('primary_pre_q2_cc_promoted')).stage,'Sequence 8 · Gravedigger');assert.equal(v(read('primary_pre_q2_seer_taught')).stage,'Sequence 9 · Seer');
});
test('old-candidate saves (university place id "quarter") are renamed at the import seam, keep their location and job progress, and nothing else changes',()=>{
 for(const n of ['candidate_old_quarter_machinery_reported','candidate_old_quarter_machinery_midjob']){
  const raw=read(n);assert.throws(()=>validateLotmEnvelope(raw),'unmigrated, the old id is refused (no relaxed validation)');
  const s=read(n),before=JSON.stringify(s);assert.equal(migrateLotmPlaces(s),true,n);
  assert.equal(s['current location'],L.university);assert.equal(s.expansion.simulation.people.player.location,L.university);assert.equal(s.expansion.simulation.people[I.machineryOfficer].location,L.university);
  assert.ok(validateLotmState(s.expansion),n);assert.ok(validateLotmEnvelope(s),n);
  const strip=x=>JSON.stringify(x).split('Tingen university quarter').join('Tingen university area');assert.equal(JSON.stringify(s),strip(JSON.parse(before)),'only the place id changed');
  assert.equal(migrateLotmPlaces(s),false,'idempotent');
 }
 let p=toRun((()=>{const s=read('candidate_old_quarter_machinery_midjob');migrateLotmPlaces(s);return s;})());assert.equal(p.state.simulation.jobs.length,1,'the study act is still in flight');
 p=wait(p,30);assert.equal(p.state.actors.player.resources['book.lotm.sv.acting'],1,'job progress survives the rename');assert.ok(validateLotmState(p.state));
});
test('the native-map keys are renamed too, an ambiguous save is refused, and a non-LOTM save is never touched',()=>{
 const s=read('candidate_old_quarter_machinery_reported');
 s.locations={'Tingen university quarter':{a:1},'Village':{b:2}};s.availabilities={location:{'Tingen university quarter':{c:3}}};s.absorb_local_life={lastLocation:'Tingen university quarter'};
 s.continuation={lives:{'life-1':{initial:{locations:{'Tingen university quarter':{d:4}},availabilities:{location:{'Tingen university quarter':{e:5}}}}}}};
 assert.equal(migrateLotmPlaces(s),true);assert.deepEqual(Object.keys(s.locations),['Tingen university area','Village']);assert.deepEqual(s.locations['Tingen university area'],{a:1});
 assert.deepEqual(s.availabilities.location,{'Tingen university area':{c:3}});assert.equal(s.absorb_local_life.lastLocation,'Tingen university area');
 assert.deepEqual(Object.keys(s.continuation.lives['life-1'].initial.locations),['Tingen university area']);assert.deepEqual(s.continuation.lives['life-1'].initial.availabilities.location,{'Tingen university area':{e:5}});
 const both=read('candidate_old_quarter_machinery_reported');both.locations={'Tingen university quarter':1,'Tingen university area':2};assert.throws(()=>migrateLotmPlaces(both),/holds both/);
 const plain={'current location':'Tingen university quarter',expansion:{simulation:{people:{player:{location:'Tingen university quarter'}}}}};const keep=JSON.stringify(plain);assert.equal(migrateLotmPlaces(plain),false);assert.equal(JSON.stringify(plain),keep);
});
test('the primary lane\'s block facts, cause table and loc flags resolve to this lane\'s equivalents',()=>{
 const s=read('primary_pre_q2_seer_taught'),p=toRun(s),f=lotmFacts(p.state,ctx(p));
 for(const id of ['seer','corpse','savant','sailor']){assert.equal(typeof f[`lotm.block.${id}.switching`],'boolean',id);assert.equal(typeof f[`lotm.block.${id}.wrongPotion`],'boolean',id);}
 assert.equal(f['lotm.block.corpse.switching'],true,'a Seer holder is blocked from switching to Corpse Collector');assert.equal(f['lotm.block.seer.switching'],false);
 assert.equal(hostOver(p).host.view().cause.pressure,0);
});
