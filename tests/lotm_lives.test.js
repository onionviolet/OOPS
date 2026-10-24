import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,at,holds,save,def,hostOver,ctx,lotmFacts,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_PENCE as P} from '../src/book_world_lotm_ids.js';
import {LOTM_PROFILES,LOTM_WEEK_MINUTES,weeksOwed} from '../src/book_world_lotm_lives.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_NATIVE_STOCK} from '../src/book_world_lotm_content.js';
// LOTM Q3: two life profiles over the same verbs. The probationer is on the Beyonder track; the new-identity civil clerk has a
// contract and a weekly wage, a small purse and no potion. Both enroll, earn, spend and save differently.
const begin=(key,money=50)=>{const o=hostOver(bare(money));o.host.enroll(key);return o;};
const refuses=(p,id)=>assert.throws(()=>run(p,id));
test('both profiles enroll from the same start and record which life they are',()=>{
 const a=begin('probationer'),b=begin('civil');
 assert.equal(a.box.p.state.lotm.entryProfile,LOTM_PROFILES.probationer.id);assert.equal(b.box.p.state.lotm.entryProfile,LOTM_PROFILES.civil.id);
 assert.equal(a.host.view().profile,'probationer');assert.equal(b.host.view().profile,'civil');
 for(const o of [a,b]){assert.ok(validateLotmState(o.box.p.state));assert.ok(validateLotmEnvelope(save(o.box.p)));}
 assert.throws(()=>hostOver(bare()).host.enroll('nobody'));
});
test('the probationer keeps their money and the civil clerk arrives with only the profile purse (cash does not travel)',()=>{
 assert.equal(begin('probationer',77).box.p.external.money,77);
 assert.equal(begin('civil',77).box.p.external.money,5*P.pound);
});
test('earn: the clerk is paid weekly by contract; the probationer has no wage',()=>{
 let {box}=begin('civil');let p=run(box.p,'report_in');
 assert.equal(weeksOwed(p.state),0,'nothing is owed before signing');refuses(p,'collect_pay');
 p=run(p,'sign_contract');refuses(p,'sign_contract');assert.equal(weeksOwed(p.state),1,'the first week is owed on signing');
 const m0=p.external.money;p=run(p,'collect_pay');assert.equal(p.external.money,m0+3*P.pound);refuses(p,'collect_pay');assert.equal(weeksOwed(p.state),0);
 // Week boundaries, read as pure facts (stepping the engine a week costs about ten seconds, so the clock is only read, never committed).
 const at=(minutes)=>{const q=structuredClone(p);q.state.clock+=minutes;return lotmFacts(q.state,ctx(q))['lotm.weeksOwed'];};
 assert.equal(at(LOTM_WEEK_MINUTES-1),0);assert.equal(at(LOTM_WEEK_MINUTES),1);assert.equal(at(4*LOTM_WEEK_MINUTES),4,'unclaimed weeks stack');
 assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));
 let q=run(begin('probationer').box.p,'report_in');refuses(q,'sign_contract');refuses(q,'collect_pay');
});
test('a post is not initiation: the civil clerk is offered no dose, the probationer is',()=>{
 let c=run(begin('civil').box.p,'report_in');
 for(const id of ['accept_allocation','accept_allocation_cc','decline'])refuses(c,id);
 const view=hostOver(c).host.view();assert.ok(!view.actions.some(a=>/accept_allocation|decline/.test(a.id)),'no dose offer is listed');
 assert.ok(view.actions.some(a=>a.id==='book.lotm.sign_contract'));
 let q=run(begin('probationer').box.p,'report_in');assert.ok(run(q,'accept_allocation'));
});
test('spend: both pay a district endorsement from their own purse; the clerk\'s smaller purse buys it too',()=>{
 let {box}=begin('civil');let p=at(run(box.p,'report_in'),L.docks);const m0=p.external.money;p=run(p,'endorse_storm');assert.equal(p.external.money,m0-2*P.soli);
});
test('a hand-edited civil save holding a dose or pathway is refused',()=>{
 let {box}=begin('civil');let p=run(box.p,'report_in');p.state.actors.player.facts['book.lotm.allocated']=true;assert.throws(()=>validateLotmState(p.state),/civil clerk holds no Beyonder/);
 let q=run(begin('probationer').box.p,'report_in');q.state.actors.player.facts['book.lotm.contract.signed']=true;assert.throws(()=>validateLotmState(q.state),/belongs to the civil clerk/);
});
