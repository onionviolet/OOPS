import test from 'node:test';
import assert from 'node:assert/strict';
import {changeDiscipline,disciplineView,freshDiscipline,validateDiscipline} from '../src/absorb_p23/world_adaptation/discipline.js';
import {freshCultivation} from '../src/absorb_p23/world_adaptation/techniques.js';
const base=()=>({...freshCultivation(),discipline:{...freshDiscipline(),nodes:{flow:2,still:2,bridge:0}}});
test('ring arrangement changes real discipline outputs without creating nodes or reserve and rejects unavailable copies',()=>{
 let t=base();const before=disciplineView(t.discipline),nodes=structuredClone(t.discipline.nodes);t=changeDiscipline(t,'layout:balance',0).next;const after=disciplineView(t.discipline);assert.ok(after.ratePermille>before.ratePermille);assert.equal(after.geometry.resonance,3);assert.deepEqual(t.discipline.nodes,nodes);validateDiscipline(t.discipline);
 assert.throws(()=>changeDiscipline(t,'layout:slot:7:flow',0),/arrangement/);const saved=changeDiscipline(t,'layout:save',0).next;t=changeDiscipline(saved,'layout:clear',0).next;assert.equal(disciplineView(t.discipline).ratePermille,before.ratePermille);t=changeDiscipline(t,'layout:apply',0).next;assert.deepEqual(t.discipline.geometry.slots,saved.discipline.geometry.slots);
 const corrupt=structuredClone(t.discipline);corrupt.geometry.slots[7]='bridge';assert.throws(()=>validateDiscipline(corrupt),/arrangement/);
});
test('batch fusion conserves exact pairs, previews actual residue, clears consumed positions and cannot replay stale presets',()=>{
 let t=changeDiscipline(base(),'layout:balance',0).next;t=changeDiscipline(t,'layout:save',0).next;const q=disciplineView(t.discipline).fusion;t=changeDiscipline(t,'fuse:all',0).next;assert.deepEqual(t.discipline.nodes,q.after);assert.equal(t.discipline.impurity,q.impurity);assert.equal(t.discipline.geometry.slots.filter(Boolean).length,0);assert.equal(t.discipline.nodes.bridge,2);
 assert.throws(()=>changeDiscipline(t,'layout:apply',0),/no longer held/);assert.throws(()=>changeDiscipline(t,'fuse:all',0),/at least one/);const loaded=JSON.parse(JSON.stringify(t));validateDiscipline(loaded.discipline);assert.deepEqual(loaded,t);
});
