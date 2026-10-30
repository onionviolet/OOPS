import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,bare,run,wait,at,holds,save,def,hostOver,lotmFacts,ctx,registry,I} from './lotm_helpers.js';
import {lotmWalkMinutes} from '../src/book_world_lotm_districts.js';
import {LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
import {LOTM_DISTRICTS,districtOfPlace,respondersFor} from '../src/book_world_lotm_districts.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
// LOTM Q2: Tingen districts as a region layer. Jurisdiction (worship first, territory second) changes who supervises,
// what a visitor's endorsement costs, what an errand pays and who answers an incident.
const money=p=>p.external.money;
// A walk is a timed job: start it through the host, then let its minutes run.
const go=(o,key)=>{const from=o.box.p.state.simulation.people.player.location,to=L[key];o.host.move(`lotm.move.${key}`);o.box.p=wait(o.box.p,lotmWalkMinutes(from,to));};
const refuses=(p,id)=>assert.throws(()=>run(p,id));
test('every place belongs to one district, split by faith as the source states',()=>{
 assert.deepEqual(LOTM_DISTRICTS.map(d=>[d.id,d.church,d.team]),[['evernight','Evernight','the Nighthawks'],['storm','Storm','the Mandated Punishers'],['machinery','Steam and Machinery','the Machinery team']]);
 for(const place of Object.values(L))assert.ok(districtOfPlace(place),place);
 assert.equal(districtOfPlace(L.docks).id,'storm');assert.equal(districtOfPlace(L.university).id,'machinery');
});
test('three sample incidents route to the right team (affiliation first, territory second, escalation when mixed)',()=>{
 assert.equal(respondersFor('storm','Storm').primary,'the Mandated Punishers');assert.equal(respondersFor('storm','Storm').escalates,false);
 const mixed=respondersFor('storm','Evernight');assert.equal(mixed.primary,'the Nighthawks');assert.equal(mixed.informed,'the Mandated Punishers');assert.equal(mixed.escalates,true);
 const none=respondersFor('machinery',null);assert.equal(none.primary,'the Machinery team');assert.equal(none.escalates,false);
});
test('walking to a foreign district changes who supervises, records the arrival and the officer, not Hale, is the one present',()=>{
 let p=run(fresh(),'report_in');const {host,box}=hostOver(p);
 assert.equal(host.view().district.id,'evernight');assert.equal(host.view().supervisorHere,true);
 const o={host,box};assert.equal(host.view().places.length,Object.keys(L).length,'a plain places list');
 host.move('lotm.move.docks');assert.equal(box.p.state.simulation.jobs.length,1,'the walk is a job');assert.throws(()=>host.move('lotm.move.university'),/Finish or stop/);
 box.p=wait(box.p,lotmWalkMinutes(L.workroom,L.docks));
 const v=host.view();assert.equal(v.at,L.docks);assert.equal(v.district.id,'storm');assert.equal(v.supervisorHere,false,'Hale is not here');assert.equal(v.district.officerHere,true);
 assert.match(v.records.map(r=>r.text).join('\n'),/Mandated Punishers answer here, not Warden Hale.*Stated by the Nighthawks' captain/);
 assert.match(v.district.responders,/Nighthawks answer for their own.*headquarters/);
 assert.ok(validateLotmState(box.p.state));assert.ok(validateLotmEnvelope(save(box.p)));
 go(o,'university');assert.equal(host.view().district.id,'machinery');
 go(o,'workroom');assert.equal(host.view().district.id,'evernight');assert.equal(host.view().supervisorHere,true);
});
test('a foreign district asks an endorsement before it gives work; each district pays its own rate; money moves',()=>{
 let p=at(run(fresh(),'report_in'),L.docks);
 refuses(p,'errand_storm');
 const before=money(p);p=run(p,'endorse_storm');assert.equal(money(p),before-24,'the visitor pays the district fee');refuses(p,'endorse_storm');
 const paid=money(p);p=wait(run(p,'errand_storm'),20);assert.equal(money(p),paid+18);
 p=wait(run(p,'errand_storm'),20);assert.equal(money(p),paid+36,'repeatable, at the district rate');
 assert.ok(validateLotmState(p.state));
 // The home district needs no endorsement and pays its own, lower rate; the university charges more and pays between.
 let h=run(fresh(),'report_in');const m0=money(h);h=wait(run(h,'errand_evernight'),20);assert.equal(money(h),m0+12,'home needs no endorsement');refuses(h,'endorse_evernight');
 let u=at(run(fresh(),'report_in'),L.university);const u0=money(u);u=run(u,'endorse_machinery');assert.equal(money(u),u0-60);u=wait(run(u,'errand_machinery'),20);assert.equal(money(u),u0-60+15);
});
test('Hale-gated work needs Hale: away from the workroom the Hale commands are unavailable',()=>{
 let p=at(run(fresh(),'report_in'),L.docks);
 refuses(p,'accept_allocation');refuses(p,'accept_allocation_cc');refuses(p,'act_laying_out');
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.supervisorHere'],false);
});
test('a save made before the districts (no officer entities) still loads, views and walks',()=>{
 const p=run(fresh(),'report_in');
 for(const id of [I.stormOfficer,I.machineryOfficer]){delete p.state.simulation.people[id];delete p.state.actors[id];}
 assert.ok(validateLotmState(p.state));
 const {host,box}=hostOver(p);
 const v=host.view();assert.ok(!v.actions.some(a=>/errand_storm|endorse_storm/.test(a.id)),'commands needing an absent officer are not offered');
 const o={host,box};go(o,'docks');assert.equal(host.view().district.officerHere,false);
 assert.ok(validateLotmEnvelope(save(box.p)));
});
test('a life reads its own district as home: no endorsement owed, and its own team answers; elsewhere it is a visit',()=>{
 const storm=run(fresh(500,'storm'),'report_in_storm'),v=hostOver(storm).host.view();
 assert.equal(v.district.id,'storm');assert.equal(v.district.home,true);assert.equal(v.district.endorsed,true);assert.match(v.district.responders,/Mandated Punishers answer here/);
 const m=hostOver(run(fresh(500,'machinery'),'report_in_machinery'));go(m,'docks');const w=m.host.view().district;
 assert.equal(w.home,false);assert.equal(w.endorsed,false);assert.match(w.responders,/Machinery team answer for their own.*Mandated Punishers are told/);
 const home=hostOver(run(fresh(),'report_in')).host.view().district;assert.equal(home.endorsed,true);assert.match(home.responders,/Nighthawks answer here/);
});
// Browser start state: enrolled through the host, Hale not yet reported to. The arrival record cites the workroom situation, which begins at report_in,
// so a walk before it used to throw "Knowledge needs its actual situation context." from the saved-state check.
test('a walk before reporting in is refused with a reason, and works once the situation has begun',()=>{
 const {host,box}=hostOver(bare());host.enroll('probationer');
 const docks=host.view().moves.find(m=>m.id==='lotm.move.docks');
 assert.equal(docks.eligible,false);assert.match(docks.reasons.join(' '),/./);
 assert.doesNotMatch(docks.reasons.join(' '),/situation context/);
 assert.throws(()=>host.move('lotm.move.docks'),e=>!/situation context/.test(e.message));
 host.act('book.lotm.report_in');host.move('lotm.move.docks');
 box.p=wait(box.p,lotmWalkMinutes(L.workroom,L.docks));
 assert.equal(host.view().at,L.docks);assert.ok(validateLotmState(box.p.state));
});
