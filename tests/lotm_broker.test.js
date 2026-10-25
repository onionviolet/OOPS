import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,at,holds,save,hostOver,I,def,ctx,registry} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_PENCE as P} from '../src/book_world_lotm_ids.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {cutFor,BROKER_VERIFY_FEE,LOTM_LOTS,brokerQuote,brokerLotCommands} from '../src/book_world_lotm_broker.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
// LOTM Q5: the broker holds money and item until the buyer verifies. One trade completes, one fails verification, one barter swaps equal
// values; each leaves a record, and the money and items stay whole through failure and reload.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const money=p=>p.external.money,escrow=p=>p.state.actors[I.broker].resources['book.lotm.escrow']||0;
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const note=(p,k)=>p.state.simulation.knowledge.player[`book.lotm.${k}`]?.value;
const start=()=>at(run(fresh(500),'report_in'),L.docks);
test('a genuine lot: pay, the broker holds both, verify, settle; the cut and records follow',()=>{
 let p=start(),m0=money(p);refuses(at(run(fresh(),'report_in'),L.workroom),'lot_pay_frog');
 p=run(p,'lot_pay_frog');assert.equal(money(p),m0-3*P.soli);assert.equal(escrow(p),3*P.soli);assert.equal(holds(p,K.frog,I.broker),1,'the item stays with the broker');assert.equal(holds(p,K.frog),0);ok(p);
 refuses(p,'lot_settle_frog');refuses(p,'lot_pay_frog');
 p=run(p,'lot_verify_frog');assert.equal(money(p),m0-3*P.soli-BROKER_VERIFY_FEE);assert.match(note(p,'lot.frog.verdict'),/genuine/);
 p=run(p,'lot_settle_frog');assert.equal(holds(p,K.frog),1);assert.equal(holds(p,K.frog,I.broker),0);assert.equal(escrow(p),0);assert.match(note(p,'lot.frog.settled'),new RegExp(`${cutFor(3*P.soli)}-pence cut`));
 refuses(p,'lot_reject_frog');ok(p);
});
test('a forged lot fails verification: money comes back, the item never leaves, the check fee is the cost',()=>{
 let p=start(),m0=money(p);p=run(p,'lot_pay_hairs');assert.equal(escrow(p),4*P.soli);
 p=run(p,'lot_verify_hairs');assert.match(note(p,'lot.hairs.verdict'),/forgery/);refuses(p,'lot_settle_hairs');
 p=run(p,'lot_reject_hairs');assert.equal(money(p),m0-BROKER_VERIFY_FEE);assert.equal(escrow(p),0);assert.equal(holds(p,K.hairs),0);assert.equal(holds(p,K.hairs,I.broker),1);
 assert.match(note(p,'lot.hairs.rejected'),/forgery|appraiser's/);refuses(p,'lot_reject_hairs');ok(p);
});
test('barter at equal value: a frog for a jar, both held until verified, no money moves except the check',()=>{
 let p=start();refuses(p,'lot_pay_ink');
 p=run(p,'lot_pay_frog');p=run(p,'lot_verify_frog');p=run(p,'lot_settle_frog');const m=money(p);
 p=run(p,'lot_pay_ink');assert.equal(holds(p,K.frog),0);assert.equal(holds(p,K.frog,I.broker),1);assert.equal(money(p),m);ok(p);
 p=run(p,'lot_verify_ink');p=run(p,'lot_settle_ink');assert.equal(holds(p,K.ink),1);assert.equal(holds(p,K.frog,I.broker),1,'the broker keeps the frog for the seller');ok(p);
});
test('the broker is a place: away from the docks, or in a save from before the broker, no trade is offered',()=>{
 let p=at(start(),L.workroom);refuses(p,'lot_pay_frog');
 const old=start();delete old.state.simulation.people[I.broker];delete old.state.actors[I.broker];delete old.gameplay[I.broker];
 assert.ok(validateLotmState(old.state));assert.ok(validateLotmEnvelope(save(old)));assert.ok(!hostOver(old).host.view().actions.some(a=>/lot_/.test(a.id)));
});
test('a hand-edited save that loses money in escrow is refused',()=>{
 let p=run(start(),'lot_pay_frog');p.state.actors[I.broker].resources['book.lotm.escrow']=0;assert.throws(()=>validateLotmState(p.state),/escrow/);
});

test('posted barter values must match before an offer is executable; quotes do not mutate rows',()=>{
 const lot=structuredClone(LOTM_LOTS.find(l=>l.id==='ink')),before=structuredClone(lot);
 const quote=brokerQuote(lot);assert.equal(quote.equal,true);
 assert.equal(quote.offeredPence,3*P.soli);assert.equal(quote.requestedPence,3*P.soli);
 assert.equal(quote.feePence,BROKER_VERIFY_FEE);assert.deepEqual(lot,before);
 lot.payment.barter.valuePence--;assert.equal(brokerQuote(lot).equal,false);
 assert.throws(()=>brokerLotCommands(lot),/equal posted value/);
 lot.payment.barter.valuePence=0;assert.throws(()=>brokerQuote(lot),/positive integer/);
});
test('the payment and appraisal quotes require physical broker stock and recheck before spending',()=>{
 let p=start();const d=def('lot_pay_frog');
 assert.equal(previewSimulationCommand(p.state,registry,d.id,ctx(p,d.targetId)).eligible,true);
 delete p.gameplay[I.broker].inventory[K.frog];const before=structuredClone(p);
 refuses(p,'lot_pay_frog');assert.deepEqual(p,before);
 p=start();p=run(p,'lot_pay_frog');delete p.gameplay[I.broker].inventory[K.frog];
 const paid=structuredClone(p);refuses(p,'lot_verify_frog');assert.deepEqual(p,paid);
 assert.throws(()=>validateLotmEnvelope(save(p)),/open broker trade/);
 p=start();p.state.actors[I.broker].worldId='base.frontier';
 refuses(p,'lot_pay_frog');assert.equal(hostOver(p).host.view().broker,null);
});
test('broker projection shows pending and closed records without revealing unverified verdicts',()=>{
 let p=start();assert.deepEqual(hostOver(p).host.view().broker.trades,[]);
 p=run(p,'lot_pay_hairs');
 assert.equal(hostOver(p).host.view().broker.trades[0].status,'held; awaiting verification');
 p=run(p,'lot_verify_hairs');p=run(p,'lot_reject_hairs');
 p=run(p,'lot_pay_frog');p=run(p,'lot_verify_frog');p=run(p,'lot_settle_frog');
 const b=hostOver(p).host.view().broker;
 assert.equal(b.escrowPence,0);assert.deepEqual(b.trades.map(t=>t.status),['settled','rejected and refunded']);
 assert.equal(b.barters[0].equal,true);ok(p);
});
test('orphan and conflicting appraisal verdicts are invalid save state',()=>{
 let p=start();p.state.actors.player.facts['book.lotm.lot.frog.genuine']=true;
 assert.throws(()=>validateLotmState(p.state),/recorded verdict/);
 p=run(start(),'lot_pay_frog');p=run(p,'lot_verify_frog');
 p.state.actors.player.facts['book.lotm.lot.frog.forged']=true;
 assert.throws(()=>validateLotmState(p.state),/recorded verdict/);
});
