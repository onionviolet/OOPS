import test from 'node:test';
import assert from 'node:assert/strict';
import {initialStructuredBeginning} from '../src/structured_beginning_choice.js';

test('installed manifest head is reachable before the public fallback', () => {
    const current = {id: 'installed.current'}, previous = {id: 'installed.previous'}, fallback = {id: 'public'};
    const definitions = new Map([[current.id, current], [previous.id, previous], [fallback.id, fallback]]);
    assert.equal(initialStructuredBeginning(definitions), current);
    assert.deepEqual([...definitions.values()], [current, previous, fallback]);
    assert.equal(initialStructuredBeginning(definitions), current);
});

test('public fallback and explicit local QA probe work without installed content', () => {
    const fallback = {id: 'public'}, probe = {id: 'probe'};
    assert.equal(initialStructuredBeginning(new Map([[fallback.id, fallback]])), fallback);
    const definitions = new Map([[fallback.id, fallback], [probe.id, probe]]);
    assert.equal(initialStructuredBeginning(definitions, probe.id), probe);
    assert.equal(initialStructuredBeginning(definitions, 'absent'), fallback);
    assert.equal(initialStructuredBeginning(new Map()), undefined);
});

import {createStructuredBeginningChoices} from '../src/structured_beginning_choice.js';
const fixture=()=>{
 const school={id:'school',starts:[{}],contentHash:'school.v1'},trade={id:'trade',starts:[{}],contentHash:'trade.v1'};
 const definitions=new Map([['fallback',{id:'fallback'}],[school.id,school],[trade.id,trade]]);
 const choices=createStructuredBeginningChoices(definitions);
 for(const d of [school,trade])choices.register({packId:d.id,label:d.id,arrival:'Original arrival',means:'Declared stock'});
 return {choices,definitions,context:{worldId:'base.frontier',facts:{location:'Village'},busy:false}};
};
test('both typed lives preview and cancel without changing the durable opening',()=>{
 const {choices,context}=fixture(),state={},before=JSON.stringify(state);
 assert.equal(choices.definition().id,'fallback');
 for(const packId of ['school','trade']){
  assert.equal(choices.handle({type:'select-beginning',packId},state,context),true);
  const view=choices.preview({},state);assert.equal(view.selectedBeginning,packId);
  assert.equal(choices.require({type:'begin',packId,contentHash:view.beginningHash},state),true);
  assert.equal(JSON.stringify(state),before);
  choices.handle({type:'cancel-beginning'},state,context);
  assert.equal(choices.definition().id,'fallback');
  assert.throws(()=>choices.require({type:'begin',packId,contentHash:view.beginningHash},state),/out of date/);
 }
});
test('active and pending origins, stale previews and busy/wrong places refuse entry selection',()=>{
 const {choices,definitions,context}=fixture();
 for(const state of [{structured:{packId:'school'}},{pendingStructured:{packId:'school'}}]){
  assert.equal(choices.preview({},state).choices,undefined);
  assert.throws(()=>choices.handle({type:'select-beginning',packId:'trade'},state,context),/already chosen/);
  assert.throws(()=>choices.require({type:'begin',packId:'trade'},state),/saved beginning/);
 }
 for(const ctx of [{...context,busy:true},{...context,worldId:'other'},{...context,facts:{location:'elsewhere'}}])
  assert.throws(()=>choices.handle({type:'select-beginning',packId:'school'},{},ctx),/unoccupied/);
 choices.handle({type:'select-beginning',packId:'school'},{},context);
 assert.throws(()=>choices.require({type:'begin',packId:'trade',contentHash:'trade.v1'},{}),/out of date/);
 definitions.get('school').contentHash='school.v2';
 assert.throws(()=>choices.require({type:'begin',packId:'school',contentHash:'school.v1'},{}),/out of date/);
 assert.throws(()=>choices.handle({type:'select-beginning',packId:'missing'},{},context),/unavailable/);
});
