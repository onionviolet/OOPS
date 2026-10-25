import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,wait,at,holds,save,def,I} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {LOTM_KEYS as K,LOTM_LOCATIONS as L} from '../src/book_world_lotm_ids.js';
import {CC_BREW} from '../src/book_world_lotm_brew.js';
// Potion pathways S1: brewing the Corpse Collector Sequence 9 dose. Engine level; the browser journey is s1-brew-browser.cjs.
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const money=p=>p.external.money;
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
const frog=p=>{p=at(p,L.docks);for(const t of ['pay','verify','settle'])p=run(p,`lot_${t}_frog`);return at(p,L.workroom);};
const ready=()=>run(fresh(5000),'report_in');
const formula=p=>run(p,'buy_formula_cc');
const started=()=>run(formula(frog(ready())),'brew_start_cc');
const bottled=()=>run(wait(started(),CC_BREW.minutes),'brew_collect_cc');

test('brew from a fresh enrolled state: formula, frog, bench, time, then the same dose',()=>{
 let p=ready();const m0=money(p);
 p=formula(p);assert.equal(money(p),m0-CC_BREW.formulaPence);
 p=frog(p);assert.equal(holds(p,K.frog),1);ok(p);
 p=run(p,'brew_start_cc');assert.equal(holds(p,K.frog),0,'the frog is consumed');ok(p);
 refuses(p,'brew_collect_cc');
 p=wait(p,CC_BREW.minutes-1);refuses(p,'brew_collect_cc');
 p=wait(p,1);p=run(p,'brew_collect_cc');
 assert.equal(holds(p,K.corpseDose),1,'the same item key as the issued dose');assert.equal(holds(p,K.frog),0);ok(p);
 refuses(p,'brew_collect_cc');refuses(p,'accept_allocation_cc');
 p=run(p,'ingest_cc');assert.equal(holds(p,K.corpseDose),0);assert.ok(p.state.actors.player.sources[I.corpse]);ok(p);
});
test('the brewed dose runs the existing acts, assessment and promotion',()=>{
 let p=run(bottled(),'ingest_cc');
 for(let i=0;i<3;i++)p=wait(run(p,'act_laying_out'),25);
 p=wait(run(p,'act_vigil'),60);p=run(p,'request_assessment_cc');p=wait(run(p,'request_exam_cc'),60);ok(p);p=run(p,'ingest_gravedigger');
 assert.ok(p.state.actors.player.sources[I.gravedigger]);ok(p);
});
test('refusals: no formula, no frog, no money, no Hale, wrong order',()=>{
 let p=ready();refuses(p,'brew_start_cc');p=frog(p);refuses(p,'brew_start_cc');
 assert.throws(()=>run(run(fresh(100),'report_in'),'buy_formula_cc'));
 p=formula(frog(ready()));refuses(at(structuredClone(p),L.docks),'brew_start_cc');
 const noFrog=formula(ready());refuses(noFrog,'brew_start_cc');
 refuses(run(p,'brew_start_cc'),'brew_start_cc');
 refuses(fresh(5000),'buy_formula_cc');
});
test('another pathway: allocated or ingested probationers cannot brew, and a brew closes every other dose',()=>{
 for(const id of ['accept_allocation','accept_allocation_cc']){let p=run(ready(),id);refuses(p,'buy_formula_cc');p=frog(p);refuses(p,'brew_start_cc');}
 let p=formula(frog(ready()));p=run(p,'brew_start_cc');
 for(const id of ['accept_allocation','accept_allocation_cc','accept_allocation_sv','accept_allocation_sa'])refuses(p,id);
 refuses(run(ready(),'accept_allocation'),'brew_start_cc');
 p=run(ready(),'accept_allocation');p=run(p,'ingest');refuses(p,'brew_start_cc');
});
test('save and validate mid-brew keep the stage, the frog accounting and the clock',()=>{
 let p=started();const s=structuredClone(save(p));ok({...p,state:s.expansion});
 const note=s.expansion.simulation.knowledge.player['book.lotm.brew.cc.started'];assert.ok(note&&note.at<=s.expansion.clock);
 const q={...p,state:structuredClone(p.state)};refuses(q,'brew_collect_cc');
 const done=run(wait(q,CC_BREW.minutes),'brew_collect_cc');assert.equal(holds(done,K.corpseDose),1);ok(done);
});
test('the envelope balances: a held frog beside a started brew, a dose beside a brew in progress, and a double dose are refused',()=>{
 const p=started(),s=save(p);
 s.inventories.person.main_character[K.frog]={count:1};assert.throws(()=>validateLotmEnvelope(s),/consumed frog/);
 const dose=save(p);dose.inventories.person.main_character[K.corpseDose]={count:1};assert.throws(()=>validateLotmEnvelope(dose));
 const b=bottled(),twice=save(b);twice.inventories.person.main_character[K.corpseDose]={count:2};assert.throws(()=>validateLotmEnvelope(twice));
 const forged=structuredClone(p.state);forged.actors.player.facts['book.lotm.cc.allocated']=true;assert.throws(()=>validateLotmState(forged));
 const noFormula=structuredClone(p.state);delete noFormula.actors.player.facts['book.lotm.cc.formula'];assert.throws(()=>validateLotmState(noFormula));
});
test('the slot shape is selector-compatible and resolves the exact frog key only',()=>{
 assert.deepEqual(CC_BREW.slots.map(s=>Object.keys(s.select)),[['material']]);assert.equal(CC_BREW.slots[0].key,K.frog);assert.equal(def('brew_start_cc').costs[0].key,K.frog);
});
