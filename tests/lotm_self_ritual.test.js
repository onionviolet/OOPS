import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,ctx,def,registry,I,save,lotmFacts} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {LOTM_PLACE_KEYS} from '../src/book_world_lotm_districts.js';
import {SELF_RITE} from '../src/book_world_lotm_ritual.js';
import {commitSimulationCommand,previewSimulationCommand,cancelSimulationJob} from '../src/simulation.js';
import {advanceSimulation} from '../src/expansion_engine.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
// M4 A5: the staged self-addressed rite. Learn, prepare, an unlit pause, departure expiry, the lit response and the recovery receipt.
const context=(p,target)=>{const c=ctx(p,target);return {...c,vitals:p.vitals||c.vitals,vitalsByActor:p.vitals||c.vitals};};
const act=(p,id)=>({...p,...commitSimulationCommand(p.state,registry,{id:def(id).id},context(p,def(id).targetId))});
const wait=(p,n)=>{const c=context(p),out=advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});const v=structuredClone(out.vitals||c.vitals);if(out.native){v.player.stamina=v.player.max_stamina-out.native.staminaToFull;v.player.health=v.player.max_health-out.native.hpToFull;}return {...p,...out,vitals:v};};
const preview=(p,id)=>previewSimulationCommand(p.state,registry,def(id).id,context(p,def(id).targetId));
const stop=p=>({...p,...cancelSimulationJob(p.state,registry,p.state.simulation.jobs[0].id,context(p,I.supervisor))});
const walk=(p,to)=>{const from=p.state.simulation.people.player.location,id=`walk_${LOTM_PLACE_KEYS[from]}_${LOTM_PLACE_KEYS[to]}`;p=act(p,id);p.state.simulation.people.player.location=to;return wait(p,def(id).duration);};
const attention=p=>p.state.actors[I.supervisor].resources['book.lotm.attention'];
const pressure=p=>p.state.actors.player.resources['book.lotm.pressure']||0;
const spirit=p=>p.state.simulation.energies.player[I.energy].reserve,strain=p=>p.state.simulation.energies.player[I.energy].strain;
const facts=p=>lotmFacts(p.state,context(p));
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const seer=()=>run(run(run(fresh(40000),'report_in'),'accept_allocation'),'ingest');
// Earned early pressure: a Corpse Collector drinks a broker's unmarked Sequence 8 dose before assessment (skip + rushed = 5).
const rushed=()=>{let p=run(run(run(fresh(40000),'report_in'),'accept_allocation_cc'),'ingest_cc');p.state.simulation.people.player.location=L.docks;
 for(const t of ['pay','verify','settle'])p=run(p,`lot_${t}_dose8_cc`);p=run(p,'drink_market_cc8');p.state.simulation.people.player.location=L.workroom;return p;};
const learned=p=>wait(act(p,'rit_self_learn'),SELF_RITE.learn);
const prepared=p=>wait(act(learned(p),'rit_self_prepare'),SELF_RITE.prepare);

test('zero pressure with recorded causes needs an actual completed recovery, and the causes stay recorded',()=>{
 let p=rushed();assert.equal(pressure(p),5);
 for(let i=0;i<5;i++)p=run(p,'steady');
 assert.equal(pressure(p),0);checked(p);assert.equal(p.state.actors.player.facts['book.lotm.cause.rushed'],true);
 const forged=structuredClone(p.state);delete forged.actors.player.completed['book.lotm.steady'];
 assert.throws(()=>validateLotmState(forged),/leaves pressure behind/);
});

test('Hale teaches the rite only to a supported pathway source, and the borrowed attention comes back',()=>{
 assert.equal(preview(run(fresh(),'report_in'),'rit_self_learn').eligible,false,'no source, no rite');
 let p=seer();const n=attention(p);p=act(p,'rit_self_learn');assert.equal(attention(p),n-1);checked(p);
 p=stop(p);assert.equal(attention(p),n);assert.equal(facts(p)['lotm.rit.self.known'],false);
 p=learned(p);assert.equal(attention(p),n);assert.equal(facts(p)['lotm.rit.self.known'],true);
 assert.equal(preview(p,'rit_self_learn').visible,false);checked(p);
});

test('preparation spends supplies only on completion, then waits unlit with no deadline until a walk away ends it',()=>{
 let p=learned(seer());const money=p.external.money,n=attention(p);
 p=act(p,'rit_self_prepare');assert.equal(p.external.money,money-SELF_RITE.supplies);assert.equal(attention(p),n-1);checked(p);
 p=stop(p);assert.equal(p.external.money,money);assert.equal(attention(p),n);assert.equal(facts(p)['lotm.rit.self.ready'],false);
 p=wait(act(p,'rit_self_prepare'),SELF_RITE.prepare);assert.equal(p.external.money,money-SELF_RITE.supplies);assert.equal(attention(p),n);
 assert.equal(facts(p)['lotm.rit.self.ready'],true);assert.equal(preview(p,'rit_self_prepare').eligible,false,'one circle at a time');
 p=wait(p,3*1440);assert.equal(facts(p)['lotm.rit.self.ready'],true,'waiting in place keeps it');checked(p);
 p=walk(walk(p,L.lodging),L.workroom);
 assert.equal(facts(p)['lotm.rit.self.ready'],false);assert.equal(facts(p)['lotm.rit.self.expired'],true,'returning does not revive it');
 assert.match(preview(p,'rit_self_light').reasons.join(' '),/walk away ends it/);assert.equal(facts(p)["lotm.rit.self.expired"],true);
 p=wait(act(p,'rit_self_prepare'),SELF_RITE.prepare);assert.equal(facts(p)['lotm.rit.self.ready'],true,'a newer preparation replaces it');checked(p);
});

test('the lit rite spends the caster\'s own reserve, eases one step, returns attention and cannot replay the same circle',()=>{
 let p=prepared(rushed());const n=attention(p),body=context(p).vitals.player.stamina,money=p.external.money;
 assert.equal(facts(p)['lotm.rit.self.body'],true,'a Corpse Collector has no measured spirituality pool');assert.equal(preview(p,'rit_self_light').visible,false);
 p=act(p,'rit_self_light_body');assert.equal(p.vitals.player.stamina,body-SELF_RITE.stamina);assert.equal(attention(p),n-1);assert.equal(pressure(p),5);checked(p);
 p=wait(p,SELF_RITE.rite);assert.equal(pressure(p),4);assert.equal(attention(p),n);assert.equal(p.vitals.player.stamina,body-SELF_RITE.stamina);
 assert.ok(p.state.simulation.knowledge.player['book.lotm.rit.self.response']);assert.equal(facts(p)['lotm.rit.self.ready'],false);
 assert.equal(preview(p,'rit_self_light_body').eligible,false,'the used circle cannot answer twice');checked(p);
 p=wait(act(p,'rit_self_prepare'),SELF_RITE.prepare);assert.equal(p.external.money,money-SELF_RITE.supplies);
 p=wait(act(p,'rit_self_light_body'),SELF_RITE.rite);assert.equal(pressure(p),3);checked(p);
 for(let i=0;i<2;i++)p=run(p,'steady');assert.equal(pressure(p),1);
 p=wait(act(wait(act(p,'rit_self_prepare'),SELF_RITE.prepare),'rit_self_light_body'),SELF_RITE.rite);
 assert.equal(pressure(p),0);checked(p);assert.equal(preview(wait(act(p,'rit_self_prepare'),SELF_RITE.prepare),'rit_self_light_body').eligible,false,'no pre-signs left to ease');
});

test('Stop and lost support refund the reserve and attention, leave pressure, and keep the circle',()=>{
 let p=prepared(rushed());const n=attention(p),body=context(p).vitals.player.stamina;
 p=stop(act(p,'rit_self_light_body'));assert.equal(p.vitals.player.stamina,body);assert.equal(attention(p),n);assert.equal(pressure(p),5);
 assert.equal(facts(p)['lotm.rit.self.ready'],true);checked(p);
 p=act(p,'rit_self_light_body');p.state.simulation.people[I.supervisor].location=L.lodging;p=wait(p,SELF_RITE.rite);
 assert.equal(pressure(p),5,'no relief without Hale present at completion');assert.equal(attention(p),n);assert.equal(p.vitals.player.stamina,body);
});

test('a Seer pays 1 spirituality; an empty reserve and the loss line refuse',()=>{
 // Synthetic early pressure for the Seer variant: no earned Seer route below the loss line exists yet (the only Seer cause, a Corpse Collector dose, is 6).
 let p=prepared(seer());p.state.actors.player.resources['book.lotm.pressure']=2;p.state.actors.player.facts['book.lotm.cause.rushed']=true;
 assert.equal(facts(p)['lotm.rit.self.spirit'],true);assert.equal(preview(p,'rit_self_light_body').visible,false);
 const e=spirit(p),held=structuredClone(p.state.simulation.energies.player[I.energy]);
 p.state.simulation.energies.player[I.energy].reserve=0;assert.equal(preview(p,'rit_self_light').eligible,false,'no spirituality, no rite');
 p.state.simulation.energies.player[I.energy]=held;
 const t=strain(p);p=act(p,'rit_self_light');assert.equal(spirit(p),e-1);assert.equal(strain(p),t+1);p=stop(p);assert.equal(spirit(p),e,'Stop returns the spirituality');assert.equal(strain(p),t);
 p=wait(act(p,'rit_self_light'),SELF_RITE.rite);assert.equal(spirit(p),e-1);assert.equal(strain(p),t+1,'the disclosed strain stays');assert.equal(pressure(p),1);checked(p);
 let q=prepared(seer());q.state.simulation.people.player.location=L.docks;for(const t of ['pay','verify','settle'])q=run(q,`lot_${t}_dose9_cc`);q=run(q,'drink_market_cc9');
 q=walk(q,L.workroom);q=wait(act(q,'rit_self_prepare'),SELF_RITE.prepare);
 assert.equal(facts(q)['lotm.lostControl'],true);assert.match(preview(q,'rit_self_light').reasons.join(' '),/loss line/);
});
