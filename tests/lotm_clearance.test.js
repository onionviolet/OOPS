import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,at,holds,save,def,hostOver,ctx,lotmFacts,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {defineClearance,clearanceFor} from '../src/clearance.js';
import {LOTM_CLEARANCE} from '../src/book_world_lotm_clearance.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {registry} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
// LOTM Q4: church team roles and sealed-item clearance on a world-neutral leaf. Grade 2 needs a bishop or a team captain; grade 3 needs a
// group of three with formal-member clearance; custody is the vault's until a cleared group signs it out.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const withoutExaminer=p=>{p.state.simulation.people[I.evernightDeacon].location=L.lodging;return p;};
const member=()=>{let p=run(fresh(),'report_in');p=run(p,'accept_allocation');return run(p,'ingest');};
test('the rule table reads grades 2 and 3 as the source states them, and says why not',()=>{
 assert.equal(clearanceFor(LOTM_CLEARANCE,2,{role:'formal_member'}).ok,false);
 assert.equal(clearanceFor(LOTM_CLEARANCE,2,{role:'captain'}).ok,true);assert.equal(clearanceFor(LOTM_CLEARANCE,2,{role:'bishop'}).ok,true);
 assert.match(clearanceFor(LOTM_CLEARANCE,2,{role:'probationer'}).reasons[0],/captain or bishop clearance/);
 assert.equal(clearanceFor(LOTM_CLEARANCE,3,{role:'formal_member',present:['captain']}).ok,false,'two is not a group of three');
 assert.equal(clearanceFor(LOTM_CLEARANCE,3,{role:'formal_member',present:['captain','formal_member']}).ok,true);
 assert.equal(clearanceFor(LOTM_CLEARANCE,3,{role:'probationer',present:['captain','formal_member','captain']}).ok,false,'a probationer does not count toward the group nor hold clearance');
 assert.match(clearanceFor(LOTM_CLEARANCE,3,{role:'civil_staff',present:[]},).reasons.join(),/formal member clearance/);
 assert.equal(clearanceFor(LOTM_CLEARANCE,3,{role:'probationer',known:false}).reasons[0],'The vault will not hand an item to one clerk.','an unknown rule shows the vague line, not the numbers');
});
test('the seam is world-neutral: a second world\'s rows (fixture) run through the same leaf',()=>{
 const sect=defineClearance({id:'fixture.sect',roles:['outer','inner','elder'],grades:{1:{needs:{atLeast:'inner',group:{min:2,atLeast:'inner'}},line:'Two inner disciples may open the scripture room.',vague:'The door wants a pair.'}}});
 assert.equal(clearanceFor(sect,1,{role:'inner',present:['outer']}).ok,false);assert.equal(clearanceFor(sect,1,{role:'inner',present:['elder']}).ok,true);
 assert.throws(()=>defineClearance({id:'fixture.bad',roles:['a','b'],grades:{1:{needs:{atLeast:'zzz'},line:'x',vague:'y'}}}));
});
test('one clerk cannot take the grade 3 item; formal membership with the captain and a member present can; custody and reload hold',()=>{
 let p=run(fresh(),'report_in');
 refuses(p,'request_sealed_3');assert.equal(holds(p,K.sealed3,I.supervisor),1);
 p=member();assert.equal(lotmFacts(p.state,ctx(p))['lotm.role.formal_member'],true);
 // Hale and the member are both at the workroom: three formal members with the player.
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.clearance.3'],true);
 p=run(p,'request_sealed_3');assert.equal(holds(p,K.sealed3),1);assert.equal(holds(p,K.sealed3,I.supervisor),0);
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)),'custody saved once, with the player');
 refuses(p,'request_sealed_3');
 p=run(p,'return_sealed_3');assert.equal(holds(p,K.sealed3),0);assert.equal(holds(p,K.sealed3,I.supervisor),1);assert.ok(validateLotmEnvelope(save(p)));
});
test('the group is real: if the member is elsewhere, or the player is only a probationer, the vault stays shut',()=>{
 let p=withoutExaminer(member());p.state.simulation.people[I.member].location=L.lodging;refuses(p,'request_sealed_3');
 assert.equal(hostOver(p).host.view().clearance.find(g=>g.grade===3).ok,false);
 let q=run(fresh(),'report_in');assert.equal(hostOver(q).host.view().role,'probationer');
 const cs=hostOver(q).host.view().clearance;assert.match(cs.find(g=>g.grade===3).reasons.join(),/formal member clearance/);assert.match(cs.find(g=>g.grade===2).reasons.join(),/captain or bishop/);
});
test('a save from before the vault (no member, no item) loads and views',()=>{
 let p=withoutExaminer(member());delete p.state.simulation.people[I.member];delete p.state.actors[I.member];delete p.gameplay[I.supervisor].inventory[K.sealed3];
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
 refuses(p,'request_sealed_3');
 assert.equal(hostOver(p).host.view().clearance.find(g=>g.grade===3).ok,false);
});

test('a stale group quote revalidates world, presence and life before transferring custody',()=>{
 const p=withoutExaminer(member()),d=def('request_sealed_3');
 const preview=()=>previewSimulationCommand(p.state,registry,d.id,ctx(p,d.targetId));
 assert.equal(preview().eligible,true);
 const original=structuredClone(p);
 // A matching location string in another world supplies no participant to this vault group.
 p.state.actors[I.member].worldId='base.frontier';
 assert.equal(preview().eligible,false);refuses(p,'request_sealed_3');
 assert.equal(holds(p,K.sealed3,I.supervisor),1);assert.equal(holds(p,K.sealed3),0);
 p.state.actors[I.member].worldId=I.world;
 p.state.simulation.people[I.member].life='dead';
 assert.equal(preview().eligible,false);refuses(p,'request_sealed_3');
 p.state.simulation.people[I.member]=original.state.simulation.people[I.member];
 p.state.simulation.people[I.member].location=L.lodging;
 const before=structuredClone(p);
 refuses(p,'request_sealed_3');assert.deepEqual(p,before,'failed commit changes no state or stock');
});
