import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,hostOver} from './lotm_helpers.js';
import {positionsOf,registerPositionSource,POSITION_TERM_TYPES} from '../src/positions.js';
import {lotmPositionsFromView,lotmPositionLine} from '../src/book_world_lotm_positions.js';
import {LOTM_PENCE as P} from '../src/book_world_lotm_ids.js';

const begin=key=>{const o=hostOver(bare(50));o.host.enroll(key);return o;};

test('a civil clerk has no civil-staff row until the contract is signed, then one contracted five-year row',()=>{
 const o=begin('civil'),p=o.box.p;
 assert.deepEqual(positionsOf(p.state),[]);
 assert.deepEqual(lotmPositionsFromView(o.host.view()),[]);
 let q=run(p,'report_in');
 assert.deepEqual(positionsOf(q.state),[],'reporting in is not signing');
 q=run(q,'sign_contract');
 o.box.p=q;
 const rows=positionsOf(q.state);
 assert.equal(rows.length,1);
 assert.equal(rows[0].term.type,'contracted');assert.equal(rows[0].term.years,5);
 assert.deepEqual(rows[0].pay,{amount:3*P.pound,unit:'pence',period:'week'});
 assert.ok(POSITION_TERM_TYPES.includes(rows[0].term.type));
 assert.deepEqual(lotmPositionsFromView(o.host.view()),rows,'the panel view yields the same rows as the state');
 assert.equal(lotmPositionLine(rows),'Civil staff, Nighthawks: contract, 3 pounds a week, five years');
});
test('a probationer holds one enrolled track row and no pay',()=>{
 const o=begin('probationer'),rows=positionsOf(o.box.p.state);
 assert.equal(rows.length,1);assert.equal(rows[0].term.type,'enrolled');assert.equal(rows[0].pay,undefined);
 assert.equal(rows[0].institution,'Nighthawks');
});
test('projecting positions writes nothing: no new save key or fact',()=>{
 for(const key of ['civil','probationer']){
  const p=begin(key).box.p,before=JSON.stringify(p.state);
  positionsOf(p.state);positionsOf(p.state);
  assert.equal(JSON.stringify(p.state),before);assert.equal('positions' in p.state,false);
 }
});
test('a source returning a malformed row is refused',()=>{
 registerPositionSource('bad_test',()=>[{id:'x'}]);
 assert.throws(()=>positionsOf({}),/malformed/);
 registerPositionSource('bad_test',()=>[]);
});
