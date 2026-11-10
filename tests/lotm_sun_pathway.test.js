import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fresh,run,wait,at,holds,save,ctx,lotmFacts,hostOver,registry} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {generatedRows,sunRow,spectatorRow,generatedCommands} from '../src/book_world_lotm_generated.js';
import {rowById} from '../src/lotm_formula_rows.js';
import {INGREDIENT_BY_NAME} from '../src/book_world_lotm_bench.js';
import {previewSimulationCommand} from '../src/simulation.js';
import {abilityRows,hostileAbilityCommands} from '../src/book_world_lotm_abilities.js';
import {channelsOf} from '../src/channels.js';
// LG1: Sun Sequences 9 (Bard) and 8 (Light Supplicant) on the generated factory, content only. Proof tier: focused node fixture (not a browser claim).
// Route: the same bench route as the Visionary row (buy formula and materials at the docks, brew at the workroom, drink), then acts, then the next dose.
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const pass=(p,m)=>{const to=p.state.clock+m;for(let i=0;p.state.clock<to&&i<40;i++)p=wait(p,to-p.state.clock);return p;};
const f=p=>lotmFacts(p.state,ctx(p));
function brew(p,id){const row=rowById(id);p=at(p,L.docks);p=run(p,`bf_buy_${id}`);
 for(const s of row.slots)p=run(p,`bf_ing_${INGREDIENT_BY_NAME[s.select.material].slug}`);
 p=at(p,L.workroom);p=run(p,`bf_start_${id}`);return run(pass(p,row.minutes),`bf_collect_${id}`);}
const begin=()=>run(fresh(40000),'report_in');
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const settled=p=>{for(let i=0;i<3;i++)p=pass(run(p,'act_praise'),20);return pass(run(p,'act_lift'),30);};
const prev=(p,id)=>previewSimulationCommand(p.state,registry,id,{...ctx(p),actorId:'player',facts:{...ctx(p).facts,location:p.state.simulation.people.player.location}});
test('the dose keys equal the bench product keys; every field is table, proposal or gap; the motto is the table wording',()=>{
 assert.equal(K.bardDose,rowById('sun_9').product.key);assert.equal(K.lightSupplicantDose,rowById('sun_8').product.key);
 assert.equal(sunRow.potion,'Bard');assert.equal(sunRow.next,'Light Supplicant');
 assert.ok(Object.values(sunRow.provenance).every(v=>/^(table|proposal|gap)/.test(v)));
 assert.equal(sunRow.provenance.principle8,'gap');assert.ok(sunRow.gaps.length>=3);
 assert.ok(sunRow.gaps.every(g=>!/Psychology|Spectator|Visionary/.test(g)),'no Visionary text leaks into the Sun row');
 const table=fs.readFileSync(new URL('../docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md',import.meta.url),'utf8');
 assert.ok(table.includes(sunRow.principle.text));assert.ok(table.includes('| 8 Light Supplicant |'));
 assert.deepEqual(rowById('sun_9').ritual,{...rowById('sun_9').ritual,needed:false});assert.equal(rowById('sun_8').ritual.needed,false);
});
test('the Visionary row is unchanged by the generalised generator',()=>{
 assert.ok(spectatorRow.gaps[1].includes('Psychology Alchemists'));assert.equal(spectatorRow.provenance.abilities,'gap');assert.equal(generatedRows.length,2);
 const ids=generatedRows.flatMap(generatedCommands).map(c=>c.id);assert.equal(new Set(ids).size,ids.length);
});
test('route: brew Bard, drink, act, judge by feel, brew Light Supplicant, drink; ledger and validators stay whole',()=>{
 let p=brew(begin(),'sun_9');assert.equal(holds(p,K.bardDose),1);ok(p);
 refuses(p,'drink_su9_foreign');refuses(p,'act_praise');
 p=run(p,'drink_su9');ok(p);assert.equal(holds(p,K.bardDose),0);assert.equal(p.state.actors.player.resources['book.lotm.bf.sun_9.drunk'],1);
 assert.equal(f(p)['lotm.suSupported'],true);assert.equal(f(p)['lotm.pathChosen'],true);
 for(const id of ['accept_allocation','accept_allocation_cc','drink_vi9'])refuses(p,id);
 refuses(p,'judge_su');
 p=settled(p);assert.equal(f(p)['lotm.su.digested'],true);ok(p);refuses(p,'act_praise');
 const v=lotmPathView(p.state,f(p));assert.equal(v.potion,'Bard');assert.equal(v.felt,'settled');
 p=run(p,'judge_su');ok(p);
 p=brew(p,'sun_8');p=run(p,'drink_su8');ok(p);
 assert.equal(f(p)['lotm.pressure'],0);assert.equal(f(p)['lotm.flag.su.promoted'],true);assert.equal(lotmPathView(p.state,f(p)).stage,'Sequence 8 · Light Supplicant');
});
test('stated causes apply to Sun: rushed Light Supplicant, and Bard on top of another pathway',()=>{
 let p=run(brew(begin(),'sun_9'),'drink_su9');
 let q=brew(p,'sun_8');refuses(q,'drink_su8');q=run(q,'drink_su8_rushed');ok(q);
 assert.equal(f(q)['lotm.pressure'],7.5);assert.equal(f(q)['lotm.presign'],true);assert.equal(f(q)['lotm.lostControl'],false);
 let s=run(run(begin(),'accept_allocation'),'ingest');s=brew(s,'sun_9');
 refuses(s,'drink_su9');s=run(s,'drink_su9_foreign');ok(s);assert.equal(f(s)['lotm.lostControl'],true);
});
test('the bench offers the Sun drink commands instead of the unwritten marker',()=>{
 const p=brew(begin(),'sun_9'),{host}=hostOver(p),d=host.view('sun_9').bench.selected;
 assert.equal(d.drink,null);assert.deepEqual(d.drinkOptions.map(o=>o.id),['book.lotm.drink_su9']);assert.equal(d.drinkOptions[0].eligible,true);
});
test('Sun abilities: the hymn needs the Bard source, the ward needs the Light Supplicant source; each costs and carries a drawback; channels are tagged',()=>{
 const rows=abilityRows.sun;assert.deepEqual(rows.map(a=>a.key),['sun_hymn','sun_ward']);
 for(const a of rows){assert.ok(a.costs.length&&a.drawback.price.length);assert.deepEqual(channelsOf(a),['impose_condition']);}
 let p=begin();assert.equal(prev(p,'book.lotm.ab.sun_hymn').eligible,false,'no source, no ability');
 p=run(brew(p,'sun_9'),'drink_su9');assert.equal(prev(p,'book.lotm.ab.sun_hymn').eligible,true);assert.equal(prev(p,'book.lotm.ab.sun_ward').eligible,false);
 p=run(brew(settled(p),'sun_8'),'drink_su8');assert.equal(prev(p,'book.lotm.ab.sun_ward').eligible,true);
 assert.ok(hostileAbilityCommands.some(c=>c.id.startsWith('book.lotm.ab.sun_hymn.')),'a hostile can bind the same row');
});
