import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,at,wait,holds,save,def,hostOver,ctx,lotmFacts,I,registry} from './lotm_helpers.js';
import {validateSimulationState} from '../src/simulation_contracts.js';
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
 for(const o of [a,b]){assert.ok(validateLotmState(o.box.p.state));assert.ok(validateLotmEnvelope(save(o.box.p)));validateSimulationState(o.box.p.state.simulation,o.box.p.state,registry.simulation);}
 assert.throws(()=>hostOver(bare()).host.enroll('nobody'));
});
test('an ordinary save begins Tingen from the Village and a refusal names the unmet condition',()=>{
 const o=hostOver(bare());
 assert.equal(o.host.view().startable,true);assert.deepEqual(o.host.view().startReasons,[]);
 at(o.box.p,'Wild willow stand');
 assert.equal(o.host.view().startable,false);assert.match(o.host.view().startReasons.join(' '),/Village/);
 assert.throws(()=>o.host.enroll('probationer'),/Return to the Village first/);
 at(o.box.p,'Village');o.host.enroll('probationer');
 assert.deepEqual(o.host.view().startable,undefined);assert.equal(o.host.view().profile,'probationer');
});
test('money does not cross: each life holds its own purse and the entry record keeps what stayed behind (WER9)',()=>{
 for(const [key,purse,method] of [['probationer',2*P.pound,'crossing'],['storm',2*P.pound,'crossing'],['civil',5*P.pound,'in_person']]){
  const {box}=begin(key,77);
  assert.equal(box.p.external.money,purse);
  assert.deepEqual(box.p.state.lotm.entry,{era:1349,method,host:'adult',leftBehind:{money:77}});
  assert.ok(validateLotmState(box.p.state));
 }
});
test('the start view answers the nine entry questions per life, and they match what enrolling does (WER3)',()=>{
 const v=hostOver(bare(77)).host.view();
 assert.deepEqual(v.axes.map(a=>a.id),['era','method','host']);
 for(const a of v.axes){assert.equal(a.options.filter(o=>o.available).length,1);for(const o of a.options.filter(o=>!o.available))assert.match(o.reason,/^Not written yet/);}
 for(const pr of v.profiles){
  assert.deepEqual(pr.answers.map(([q])=>q),['Body','Memories','Base cheat','Money and items','Name and papers','Language','Who notices','Your old life','What you owe']);
  const money=pr.answers.find(([q])=>q==='Money and items')[1],purse=LOTM_PROFILES[pr.key].cash/P.pound;
  assert.match(money,new RegExp(`${purse} pounds`));assert.match(money,/stays behind/);
 }
});
test('a save enrolled before the entry record still loads; a malformed record is refused',()=>{
 const {box}=begin('probationer');const old=structuredClone(box.p.state);delete old.lotm.entry;assert.ok(validateLotmState(old));
 const bad=structuredClone(box.p.state);bad.lotm.entry.method='teleport';assert.throws(()=>validateLotmState(bad),/entry record/);
 const extra=structuredClone(box.p.state);extra.lotm.surprise=1;assert.throws(()=>validateLotmState(extra),/Unsupported Tingen branch fields/);
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
 for(const key of ['probationer','civil']){
  let {box}=begin(key);let p=at(run(box.p,'report_in'),L.docks);const m0=p.external.money;p=run(p,'endorse_storm');assert.equal(p.external.money,m0-2*P.soli);
  refuses(p,'endorse_storm');
 }
});
test('opening means balance and both earned purses survive a serialized save without replaying enrollment',()=>{
 const civil=LOTM_PROFILES.civil;
 assert.equal(civil.opening.fundedPence-civil.paidBefore.papersPence-civil.paidBefore.clothesAndGoodsPence-civil.opening.passageLegs*civil.passage.perLegPence,civil.cash);
 assert.equal(civil.opening.debtPence,0);
 for(const key of ['probationer','civil']){
  let p=run(begin(key,77).box.p,'report_in');
  const entry=p.state.simulation.knowledge.player['book.lotm.entry'];
  assert.equal(entry.value,LOTM_PROFILES[key].blurb);
  if(key==='civil')p=run(run(p,'sign_contract'),'collect_pay');
  const before=p.external.money;p=wait(run(p,'errand_evernight'),20);
  assert.equal(p.external.money,before+12,'both lives earn through the timed errand owner');
  p=run(at(p,L.docks),'endorse_storm');
  const restored=JSON.parse(JSON.stringify(p)),snapshot=structuredClone(restored);
  assert.ok(validateLotmState(restored.state));assert.ok(validateLotmEnvelope(save(restored)));
  assert.equal(hostOver(restored).host.view().profile,key);
  assert.deepEqual(restored,snapshot,'reading and validating must not mint money or rewrite history');
  assert.equal(restored.external.money,key==='civil'?5*P.pound+3*P.pound+12-2*P.soli:2*P.pound+12-2*P.soli);
  if(key==='civil')refuses(restored,'collect_pay');
 }
});
test('a hand-edited civil save holding a dose or pathway is refused',()=>{
 let {box}=begin('civil');let p=run(box.p,'report_in');p.state.actors.player.facts['book.lotm.allocated']=true;assert.throws(()=>validateLotmState(p.state),/civil clerk holds no Beyonder/);
 let q=run(begin('probationer').box.p,'report_in');q.state.actors.player.facts['book.lotm.contract.signed']=true;assert.throws(()=>validateLotmState(q.state),/belongs to the civil clerk/);
});
