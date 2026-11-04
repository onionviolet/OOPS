import test from 'node:test';
import assert from 'node:assert/strict';
import {LOOP_RESETS,loopRule,loopPlan,validateLoopRows,endingEvent,loopKey,CARRY_CLASSES} from '../src/harm_loops.js';
import {loopReadout} from '../src/loop_table.js';
import {RESTART_SCOPES} from '../src/harm_restart_scope.js';
import '../src/book_world_mol_access.js';

const ZORIAN='book.mol.cyoria#zorian';

test('row v2 fields are optional: the four existing rows validate and plan as before',()=>{
 validateLoopRows();
 for(const id of ['default','book.lotm.tingen','loop.time-bound']){for(const k of ['triggers','budget','staleness'])assert.equal(LOOP_RESETS[id][k],undefined,`${id}.${k}`);}
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'death',lifeEnded:true}).command,'restart:initial');
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'death'}),null);
 assert.equal(loopPlan('book.lotm.tingen',{trigger:'date'}),null);
 assert.equal(loopPlan('loop.time-bound',{trigger:'date'}).command,'cycle');
 assert.equal(loopPlan('loop.perfect-run',{trigger:'death',lifeEnded:true,hasCheckpoint:true}).command,'restart:checkpoint');
 assert.equal(loopPlan('loop.perfect-run',{trigger:'death',lifeEnded:true}).fellBack,true);
 assert.equal(LOOP_RESETS['loop.perfect-run'].budget.unit,'tries');
});

test('validator rejects malformed v2 fields',()=>{
 const base=LOOP_RESETS[ZORIAN],bad=x=>assert.throws(()=>validateLoopRows({x:{...base,...x}}),/Invalid loop row/);
 bad({triggers:[]});bad({triggers:[{kind:'warp',anchor:'initial'}]});bad({triggers:[{kind:'death',anchor:'initial'}]});
 bad({carry:[{what:'x',class:'wish',reason:'r'}]});bad({carry:[{what:'x',class:'carried',reason:'r'}]});
 bad({budget:{remaining:3}});bad({witnesses:[{who:'a'}]});bad({staleness:{sourceKind:'f'}});bad({exit:[]});bad({exit:[{when:'x'}]});
 validateLoopRows({x:{...base,carry:[{what:'Skill',class:'multiplier',reason:'aptitude route'}]}});
 assert.ok(CARRY_CLASSES.includes('multiplier')&&CARRY_CLASSES.includes('soul-bound'));
});

test('R1: the earliest event wins, a tie is a date end, and a death before the last day is a death',()=>{
 assert.equal(endingEvent([{kind:'death',at:30},{kind:'date',at:30}]).kind,'date');
 assert.equal(endingEvent([{kind:'date',at:30},{kind:'death',at:30}]).kind,'date');
 assert.equal(endingEvent([{kind:'date',at:30},{kind:'death',at:29.5}]).kind,'death');
 assert.equal(endingEvent([{kind:'death',at:31},{kind:'date',at:30}]).kind,'date');
 assert.equal(endingEvent([]),null);
 const tie=loopPlan('book.mol.cyoria',{startId:'zorian',events:[{kind:'death',at:30},{kind:'date',at:30}]});
 assert.equal(tie.trigger,'date');assert.equal(tie.command,'restart:initial');
 const early=loopPlan('book.mol.cyoria',{startId:'zorian',events:[{kind:'date',at:30},{kind:'death',at:12}]});
 assert.equal(early.trigger,'death');assert.equal(early.command,'restart:initial');
 assert.equal(loopPlan('book.mol.cyoria',{startId:'zorian',trigger:'switch'}).trigger,'switch');
 assert.equal(loopPlan('book.mol.cyoria',{startId:'zorian',trigger:'player'}),null);
 assert.equal(loopPlan('book.mol.cyoria',{startId:'zorian',trigger:'death'}),null,'death needs the life to have ended');
});

test('per-start keys: the visitor start keeps no loop, the Zorian start gets the month loop',()=>{
 assert.equal(loopKey('book.mol.cyoria','zorian'),ZORIAN);assert.equal(loopKey('book.mol.cyoria'),'book.mol.cyoria');
 assert.equal(loopRule('book.mol.cyoria'),LOOP_RESETS.default);
 assert.equal(loopRule('book.mol.cyoria','visitor'),LOOP_RESETS.default);
 assert.equal(loopRule('book.mol.cyoria','zorian'),LOOP_RESETS[ZORIAN]);
 assert.equal(loopPlan('book.mol.cyoria',{trigger:'date'}),null);
 assert.equal(loopPlan('book.mol.cyoria',{trigger:'date',startId:'zorian'}).command,'restart:initial');
 assert.equal(loopRule('book.lotm.tingen','klein'),LOOP_RESETS['book.lotm.tingen']);
});

test('loop_table reads the same row for the Zorian start; the visitor table and the default are unchanged',()=>{
 const z=loopReadout('book.mol.cyoria',[],'zorian'),v=loopReadout('book.mol.cyoria',[]);
 const row=LOOP_RESETS[ZORIAN];
 assert.deepEqual(z.resets,row.carry.filter(c=>c.class==='reset').map(c=>c.what));
 assert.ok(z.carries.includes('What allies know of you (by notebook)')&&z.carries.includes('Memory of every run'));
 assert.deepEqual(z.triggers,['date','death','switch']);
 assert.equal(z.budget.remaining,52);assert.equal(z.witnesses[0].lapses.after,6);assert.equal(z.exits.length,3);assert.equal(z.mode,RESTART_SCOPES[ZORIAN].mode);
 assert.match(v.source,/Proposed Mother of Learning reset table/);assert.ok(v.resets.some(r=>/guest pass/.test(r)));assert.equal(v.triggers,undefined);
 assert.equal(loopReadout('book.mol.cyoria',[],'visitor').source,v.source);
 assert.match(loopReadout('book.lotm.tingen').source,/no reset table yet/);
});
