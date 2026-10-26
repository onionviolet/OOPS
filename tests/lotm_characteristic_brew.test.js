import test from 'node:test';import assert from 'node:assert/strict';
import {fresh,run,wait,at,ctx,registry,I,save,holds} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {rowById} from '../src/lotm_formula_rows.js';
import {INGREDIENT_BY_NAME,LOTM_CHARACTERISTIC as CORE,CORE_COMMITTED,characteristicMatchesFormula,characteristicBrewCommand} from '../src/book_world_lotm_bench.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
const row=rowById('visionary_9'),id='bf_core_visionary_9';
const checked=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));};
const base=()=>at(run(fresh(10000),'report_in'),L.docks);
const formula=p=>run(p,'bf_buy_visionary_9');
const acquire=p=>{for(const s of ['pay','verify','settle'])p=run(p,`lot_${s}_tc01`);return p;};
const ingredients=(p,role)=>{for(const s of row.slots.filter(s=>!role||s.role===role))p=run(p,`bf_ing_${INGREDIENT_BY_NAME[s.select.material].slug}`);return p;};
const ready=()=>at(ingredients(acquire(formula(base())),'aux'),L.workroom);
const preview=p=>previewSimulationCommand(p.state,registry,`book.lotm.${id}`,ctx(p,I.supervisor));
test('standard material and appraised characteristic routes produce the same lawful dose and use the same ingestion',()=>{
 let core=run(ready(),id);assert.equal(holds(core,CORE.key),0);checked(core);
 assert.throws(()=>run(core,'bf_collect_visionary_9'),'no early bottling');
 core=run(wait(core,row.minutes),'bf_collect_visionary_9');assert.equal(holds(core,row.product.key),1);checked(core);
 let main=at(ingredients(formula(base())),L.workroom);main=run(main,'bf_start_visionary_9');main=run(wait(main,row.minutes),'bf_collect_visionary_9');
 assert.equal(holds(main,row.product.key),holds(core,row.product.key));assert.equal(holds(main,CORE.key,I.broker),1,'unselected identity remains in broker custody');checked(main);
 for(let p of [main,core]){p=run(p,'drink_vi9');assert.equal(holds(p,row.product.key),0);assert.ok(p.state.actors.player.sources[I.spectator]);checked(p);}
});
test('missing auxiliary or a missing/unappraised core refuses without consuming any stock',()=>{
 let p=at(acquire(formula(base())),L.workroom);const before=structuredClone(p);assert.equal(preview(p).eligible,false);assert.throws(()=>run(p,id));assert.deepEqual(p,before);
 p=at(ingredients(formula(base()),'aux'),L.workroom);assert.equal(preview(p).eligible,false);assert.throws(()=>run(p,id));
 p=ready();delete p.state.actors.player.facts['book.lotm.lot.tc01.genuine'];assert.equal(preview(p).eligible,false);
});
test('core equivalence matches pathway and rank, keeping auxiliaries distinct from main materials',()=>{
 assert.equal(characteristicMatchesFormula(row,CORE),true);assert.equal(characteristicMatchesFormula(row,{...CORE,seq:8}),false);assert.equal(characteristicMatchesFormula(row,{...CORE,pathway:'Fool'}),false);
 assert.throws(()=>characteristicBrewCommand(rowById('fool_9')));
 const c=characteristicBrewCommand(row);assert.equal(c.costs.length,1+row.slots.filter(s=>s.role==='aux').length);
 for(const s of row.slots.filter(s=>s.role==='main'))assert.ok(!c.costs.some(e=>e.key===s.key));
});
test('a pending and completed core brew retain one destination and reject raw-core or dose duplication',()=>{
 let p=run(ready(),id);checked(p);const pending=JSON.parse(JSON.stringify(p));checked(pending);
 assert.equal(pending.state.actors.player.facts[`book.lotm.${CORE_COMMITTED}`],true);assert.equal(holds(pending,CORE.key),0);
 for(const owner of ['main_character',I.supervisor]){const duplicate=save(pending);duplicate.inventories.person[owner][CORE.key]={count:1};assert.throws(()=>validateLotmEnvelope(duplicate));}
 const wrong=structuredClone(pending.state);wrong.actors.player.facts['book.lotm.core.tc01.destination']='fool_9';assert.throws(()=>validateLotmState(wrong));
 p=run(wait(pending,row.minutes),'bf_collect_visionary_9');checked(p);assert.throws(()=>run(p,'bf_collect_visionary_9'));assert.equal(preview(p).eligible,false);
 const extra=save(p);extra.inventories.person.main_character[row.product.key].count++;assert.throws(()=>validateLotmEnvelope(extra));
});
test('an old-shaped save has no core grant on read or validation',()=>{
 const p=base();delete p.gameplay[I.broker].inventory[CORE.key];const before=structuredClone(p);checked(p);assert.deepEqual(p,before);assert.equal(preview(p).eligible,false);
});
