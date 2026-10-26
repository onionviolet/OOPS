import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fresh,run,wait,at,holds,save,ctx,lotmFacts,hostOver,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {lotmPathView} from '../src/book_world_lotm_path.js';
import {generatedRows,spectatorRow,generatePathwayRow,SPECTATOR_SPEC,generatedCommands} from '../src/book_world_lotm_generated.js';
import {rowById} from '../src/lotm_formula_rows.js';
import {INGREDIENT_BY_NAME} from '../src/book_world_lotm_bench.js';
// DWF139: a generated pathway row (Visionary: Spectator, Telepathist) makes brewed doses drinkable. Proof tier (AD36 item 7): focused slice, not a browser claim.
const ok=p=>{assert.ok(validateLotmState(p.state));assert.ok(validateLotmEnvelope(save(p)));return p;};
const pass=(p,m)=>{const to=p.state.clock+m;for(let i=0;p.state.clock<to&&i<40;i++)p=wait(p,to-p.state.clock);return p;};
const f=p=>lotmFacts(p.state,ctx(p));
// Brew one dose of a bench formula; returns the player at the workroom holding it.
function brew(p,id){const row=rowById(id);p=at(p,L.docks);p=run(p,`bf_buy_${id}`);
 for(const s of row.slots)p=run(p,`bf_ing_${INGREDIENT_BY_NAME[s.select.material].slug}`);
 p=at(p,L.workroom);p=run(p,`bf_start_${id}`);return run(pass(p,row.minutes),`bf_collect_${id}`);}
const begin=()=>run(fresh(40000),'report_in');
const refuses=(p,id)=>assert.throws(()=>run(p,id));
const settled=p=>{for(let i=0;i<3;i++)p=pass(run(p,'act_watch'),20);return pass(run(p,'act_abstain'),30);};
test('the dose keys equal the bench product keys, and every generated field is marked table, proposal or gap',()=>{
 assert.equal(K.spectatorDose,rowById('visionary_9').product.key);assert.equal(K.telepathistDose,rowById('visionary_8').product.key);
 assert.equal(spectatorRow.potion,'Spectator');assert.equal(spectatorRow.next,'Telepathist');
 assert.ok(Object.values(spectatorRow.provenance).every(v=>/^(table|proposal|gap)/.test(v)));
 assert.ok(spectatorRow.gaps.length>=3,'unwritten parts are listed, not hidden');
 const table=fs.readFileSync(new URL('../docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md',import.meta.url),'utf8');
 assert.ok(table.includes(spectatorRow.principle.text),'the Sequence 9 acting principle is the table\'s wording');
 assert.ok(table.includes('| 8 Telepathist |'),'sequence names come from the table');
});
test('a row with a rite is refused by the generator; the ritual mechanism owns it',()=>{
 assert.throws(()=>generatePathwayRow({...SPECTATOR_SPEC,baseFormula:'fool_5'}),/has a rite/);
 assert.throws(()=>generatePathwayRow({...SPECTATOR_SPEC,nextFormula:'visionary_7'}),/brewable/);
});
test('brewed Spectator: drink, act, feel the digestion, then Telepathist; ledger and validators stay whole',()=>{
 let p=brew(begin(),'visionary_9');assert.equal(holds(p,K.spectatorDose),1);ok(p);
 refuses(p,'drink_vi9_foreign');refuses(p,'act_watch');
 p=run(p,'drink_vi9');ok(p);assert.equal(holds(p,K.spectatorDose),0);assert.equal(p.state.actors.player.resources['book.lotm.bf.visionary_9.drunk'],1);
 assert.equal(f(p)['lotm.viSupported'],true);assert.equal(f(p)['lotm.pathChosen'],true);
 for(const id of ['accept_allocation','accept_allocation_cc'])refuses(p,id);
 refuses(p,'judge_vi');
 p=settled(p);assert.equal(f(p)['lotm.vi.digested'],true);ok(p);refuses(p,'act_watch');
 const v=lotmPathView(p.state,f(p));assert.equal(v.potion,'Spectator');assert.equal(v.felt,'settled');
 p=run(p,'judge_vi');ok(p);
 p=brew(p,'visionary_8');p=run(p,'drink_vi8');ok(p);
 assert.equal(f(p)['lotm.pressure'],0);assert.equal(f(p)['lotm.flag.vi.promoted'],true);assert.equal(lotmPathView(p.state,f(p)).stage,'Sequence 8 · Telepathist');
});
test('stated causes apply: Telepathist before the potion settles, and Spectator on top of another pathway',()=>{
 let p=brew(begin(),'visionary_9');p=run(p,'drink_vi9');
 let q=brew(p,'visionary_8');refuses(q,'drink_vi8');q=run(q,'drink_vi8_rushed');ok(q);
 assert.equal(f(q)['lotm.pressure'],5);assert.equal(f(q)['lotm.presign'],true);assert.equal(f(q)['lotm.lostControl'],false);
 let s=run(begin(),'accept_allocation');s=run(s,'ingest');s=brew(s,'visionary_9');
 refuses(s,'drink_vi9');s=run(s,'drink_vi9_foreign');ok(s);assert.equal(f(s)['lotm.lostControl'],true);
});
test('a held brewed dose does not block the Seer dose; a civil clerk cannot drink',()=>{
 let p=brew(begin(),'visionary_9');assert.equal(f(p)['lotm.block.seer.wrongPotion'],false);ok(run(p,'accept_allocation'));
 let c=fresh(40000,'civil');c.gameplay.player.inventory[K.spectatorDose]=1;refuses(c,'drink_vi9');
});
test('every generated drink command and act is data from the row; save without the new keys loads',()=>{
 const ids=generatedRows.flatMap(generatedCommands).map(c=>c.id);assert.equal(new Set(ids).size,ids.length);
 const p=ok(begin());assert.equal(p.state.actors.player.resources['book.lotm.bf.visionary_9.drunk'],undefined);
});
test('the bench offers the generated drink commands instead of the unwritten marker, and only the ones that apply',()=>{
 const p=brew(begin(),'visionary_9'),{host}=hostOver(p),d=host.view('visionary_9').bench.selected;
 assert.equal(d.drink,null);assert.deepEqual(d.drinkOptions.map(o=>o.id),['book.lotm.drink_vi9']);assert.equal(d.drinkOptions[0].eligible,true);
 const t=host.view('visionary_8').bench.selected;assert.equal(t.doses,0);assert.deepEqual(t.drinkOptions,null);
});
test('skipping the free feel check is not rushing: a settled potion drinks the next dose cleanly',()=>{
 let p=brew(begin(),'visionary_9');p=settled(run(p,'drink_vi9'));
 p=brew(p,'visionary_8');refuses(p,'drink_vi8_rushed');p=run(p,'drink_vi8');ok(p);
 assert.equal(f(p)['lotm.pressure'],0);assert.equal(f(p)['lotm.flag.vi.assessed'],true);
});
test('a brew in progress at Hale\'s bench plus a switching Spectator drink still saves and validates',()=>{
 let p=begin();delete p.gameplay[I.broker].inventory[K.frog];p.gameplay.player.inventory[K.frog]=1;p=run(run(p,'buy_formula_cc'),'brew_start_cc');
 p=brew(p,'visionary_9');assert.equal(f(p)['lotm.pathChosen'],true);refuses(p,'drink_vi9');
 p=run(p,'drink_vi9_foreign');ok(p);assert.equal(f(p)['lotm.lostControl'],true);
});
test('a self-brewed drink grants no Nighthawk clearance: nobody issued it',()=>{
 let p=brew(begin(),'visionary_9');assert.equal(f(p)['lotm.roleName'],'probationer');
 p=run(p,'drink_vi9');assert.equal(f(p)['lotm.roleName'],'probationer');
 let s=run(run(begin(),'accept_allocation'),'ingest');assert.equal(f(s)['lotm.roleName'],'formal_member');
});
