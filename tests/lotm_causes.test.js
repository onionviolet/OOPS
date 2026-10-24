import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,at,holds,save,hostOver,ctx,lotmFacts,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {LOTM_CAUSES,LOTM_PRESSURE} from '../src/book_world_lotm_causes.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
// B3: the stated causes of loss of control are rows that add pressure; the acts are possible (through a broker's unmarked dose) and costly.
// An ordinary day adds none; pre-signs ease with guided attention; the loss line ends the branch.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const pressure=p=>p.state.actors.player.resources['book.lotm.pressure']||0;
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const buy=(p,lot)=>{p=at(p,L.docks);for(const t of ['pay','verify','settle'])p=run(p,`lot_${t}_${lot}`);return p;};
const seer=()=>{let p=run(fresh(40000),'report_in');p=run(p,'accept_allocation');return run(p,'ingest');};
const cc=()=>{let p=run(fresh(40000),'report_in');p=run(p,'accept_allocation_cc');return run(p,'ingest_cc');};
test('an ordinary day adds no pressure: the whole legitimate Seer and Corpse Collector journeys leave it at zero',()=>{
 assert.equal(pressure(ok(seer())),0);assert.equal(pressure(ok(cc())),0);
 assert.equal(lotmFacts(cc().state,ctx(cc()))['lotm.lostControl'],false);
});
test('the five stated causes are rows; four are modelled and temptation is honestly not',()=>{
 assert.deepEqual(LOTM_CAUSES.map(c=>c.id),['skip','wrong_pathway','switching','rushed','temptation']);
 assert.deepEqual(LOTM_CAUSES.filter(c=>!c.modelled).map(c=>c.id),['temptation']);
});
test('a wrong-pathway potion on top of another pathway is switching: both causes land, pressure reaches the loss line, and the branch is over',()=>{
 let p=buy(seer(),'dose9_cc');assert.equal(holds(p,K.marketCc9),1);
 p=at(p,L.docks);p=run(p,'drink_market_cc9');
 assert.equal(p.state.actors.player.facts['book.lotm.cause.wrong_pathway'],true);assert.equal(p.state.actors.player.facts['book.lotm.cause.switching'],true);
 assert.ok(pressure(p)>=LOTM_PRESSURE.loss);ok(p);
 assert.equal(lotmFacts(p.state,ctx(p))['lotm.lostControl'],true);
 const {host}=hostOver(p);assert.match(host.view().cause.line,/lost control/);assert.throws(()=>host.act('book.lotm.steady'),/lost control/);
});
test('skipping and rushing: a bought Sequence 8 dose drunk before the assessment adds pressure and pre-signs that guided attention eases',()=>{
 let p=buy(cc(),'dose8_cc');
 refuses(seer(),'drink_market_cc8');
 p=at(p,L.docks);p=run(p,'drink_market_cc8');assert.equal(pressure(p),5);ok(p);
 const f=lotmFacts(p.state,ctx(p));assert.equal(f['lotm.presign'],true);assert.equal(f['lotm.lostControl'],false);
 p=at(p,L.workroom);p=run(p,'steady');assert.equal(pressure(p),4);p=run(p,'steady');assert.equal(pressure(p),3);ok(p);
 refuses(p,'request_assessment_cc');
 assert.ok(p.state.actors.player.sources[I.gravedigger]);
});
test('a save holding two pathways without the switching cause is still refused',()=>{
 let p=buy(seer(),'dose9_cc');p=at(p,L.docks);p=run(p,'drink_market_cc9');p.state.actors.player.facts['book.lotm.cause.switching']=false;
 assert.throws(()=>validateLotmState(p.state),/both pathways/);
});
test('the unmarked doses cannot be drunk by someone with nothing to switch from, nor early without the cause',()=>{
 let p=buy(run(fresh(40000),'report_in'),'dose9_cc');refuses(at(p,L.docks),'drink_market_cc9');
});
test('the primary lane\'s loc.<cause> record flags mean the same cause as cause.<id>',()=>{
 let p=buy(seer(),'dose9_cc');p=at(p,L.docks);p=run(p,'drink_market_cc9');
 for(const [a,b] of [['cause.switching','loc.switching'],['cause.wrong_pathway','loc.wrongPotion']]){p.state.actors.player.facts[`book.lotm.${a}`]=false;p.state.actors.player.facts[`book.lotm.${b}`]=true;}
 assert.ok(validateLotmState(p.state),'a save flagged the primary way still validates');
 p.state.actors.player.facts['book.lotm.loc.switching']=false;assert.throws(()=>validateLotmState(p.state),/both pathways/);
});
