import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,hostOver,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
import {WATCH_STORM_NOTE,WATCH_HANDOVER,DIRECTORY_STORM,stormWorkTerms} from '../src/book_world_lotm_watch_lead.js';
import {districtCommands,lotmWalkMinutes} from '../src/book_world_lotm_districts.js';
import {LOTM_LIBRARY_KEY,LOTM_LIBRARY_REQUIREMENTS,lotmLibraryStudy} from '../src/book_world_lotm_inquiry.js';
import {configureInquiry} from '../src/inquiry.js';
import {domainRegistry} from '../src/domain_registry.js';
import '../src/book_world_lotm_domain.js';
const start=()=>run(fresh(500,'probationer'),'report_in');
const pass=(p,n)=>{const target=p.state.clock+n;for(let i=0;p.state.clock<target&&i<50;i++)p=wait(p,target-p.state.clock);return p;};
const note=p=>p.state.simulation.knowledge.player?.[WATCH_STORM_NOTE];

test('copying and a cancelled watch grant no handover; a completed watch needs a present living Hale',()=>{
 let p=start(),o=hostOver(p);assert.throws(()=>o.host.act(WATCH_HANDOVER));
 p=pass(run(p,'merit_case_file_copy'),30);p=pass(run(p,'merit_case_file_copy'),30);
 assert.equal(note(p),undefined);assert.throws(()=>hostOver(p).host.act(WATCH_HANDOVER));
 o=hostOver(run(p,'merit_cold_room_watch'));o.box.p=pass(o.box.p,15);o.host.cancel(o.box.p.state.simulation.jobs[0].id);
 assert.throws(()=>o.host.act(WATCH_HANDOVER));assert.equal(note(o.box.p),undefined);
 o.box.p=pass(run(o.box.p,'merit_cold_room_watch'),60);
 o.box.p.state.simulation.people[I.supervisor].location=L.docks;
 assert.throws(()=>o.host.act(WATCH_HANDOVER));assert.equal(note(o.box.p),undefined);
 o.box.p.state.simulation.people[I.supervisor].location=L.workroom;o.box.p.state.simulation.people[I.supervisor].life='dead';
 assert.throws(()=>o.host.act(WATCH_HANDOVER));assert.equal(note(o.box.p),undefined);
 o.box.p.state.simulation.people[I.supervisor].life='alive';const money=o.box.p.external.money,clock=o.box.p.state.clock;
 o.host.act(WATCH_HANDOVER);assert.equal(o.box.p.state.clock,clock);assert.equal(o.box.p.external.money,money);
 assert.equal(note(o.box.p).basis.attributedTo,I.supervisor);assert.equal(note(o.box.p).stage,'understood');
 assert.throws(()=>o.host.act(WATCH_HANDOVER),'same contact is not issued twice');
});

test('watch contact leads through actual walking, endorsement and paid work; learning itself pays no coins',()=>{
 const o=hostOver(pass(run(start(),'merit_cold_room_watch'),60));o.host.act(WATCH_HANDOVER);
 const before=o.box.p.external.money,from=o.box.p.state.simulation.people.player.location;
 o.host.move('lotm.move.docks');o.box.p=pass(o.box.p,lotmWalkMinutes(from,L.docks));
 o.host.act('book.lotm.endorse_storm');assert.equal(o.box.p.external.money,before-24);
 o.host.act('book.lotm.errand_storm');o.box.p=pass(o.box.p,20);assert.equal(o.box.p.external.money,before-24+18);
 const restored=JSON.parse(JSON.stringify(o.box.p));assert.deepEqual(note(restored),note(o.box.p));
 assert.equal(hostOver(restored).host.view().merit.publicWork.terms.payPence,18);
 const without=hostOver(start());without.host.move('lotm.move.docks');without.box.p=pass(without.box.p,20);
 assert.ok(without.host.view().actions.find(a=>a.id==='book.lotm.endorse_storm').eligible,'existing route access does not require the new lead');
});

test('actual papers inquiry is an independent slower source, including saved prior research, without a Hale witness',()=>{
 const o=hostOver(start());o.box.p.state.simulation.people.player.location=L.university;
 o.box.p.state.simulation.people[I.supervisor].life='dead';
 assert.throws(()=>o.host.act(DIRECTORY_STORM));
 domainRegistry.initialize();domainRegistry.load({});
 configureInquiry({plan:m=>m?pass(o.box.p,m):structuredClone(o.box.p),commit:p=>{o.box.p=p;},writable:()=>true});
 const before=o.box.p.state.clock;lotmLibraryStudy();assert.throws(()=>o.host.act(DIRECTORY_STORM),'partial reading does not supply the directory');
 lotmLibraryStudy();assert.equal(o.box.p.state.clock-before,LOTM_LIBRARY_REQUIREMENTS.minutes);
 assert.equal(o.box.p.state.simulation.knowledge.player[LOTM_LIBRARY_KEY].stage,'understood');
 o.box.p=JSON.parse(JSON.stringify(o.box.p));o.host.act(DIRECTORY_STORM);o.box.p=pass(o.box.p,1);
 assert.equal(note(o.box.p).basis.attributedTo,'player');assert.match(note(o.box.p).value,/public service notice/);
 assert.equal(o.box.p.state.actors.player.completed['book.lotm.merit_cold_room_watch']||0,0);
 assert.equal(o.box.p.external.money,500,'research and the lead create no wage or fee waiver');
 const borrowed=hostOver(start());borrowed.box.p.state.simulation.people.player.location=L.university;
 (borrowed.box.p.state.simulation.knowledge.player||={})[LOTM_LIBRARY_KEY]={stage:'interpreted',at:0,cause:'note:study.lotm.tingen_papers',value:'A read city-papers write-up.'};
 borrowed.host.act(DIRECTORY_STORM);borrowed.box.p=pass(borrowed.box.p,1);assert.ok(note(borrowed.box.p),'the existing read-note channel can supply public directory facts too');
});

test('reported work terms follow the actual command definitions',()=>{
 const definitions=structuredClone(districtCommands);
 definitions.find(d=>d.id==='book.lotm.endorse_storm').costs.find(e=>e.key==='money').amount=-31;
 const errand=definitions.find(d=>d.id==='book.lotm.errand_storm');errand.duration=33;errand.effects.find(e=>e.key==='money').amount=29;
 assert.deepEqual(stormWorkTerms(definitions),{endorsementPence:31,minutes:33,payPence:29});
});
