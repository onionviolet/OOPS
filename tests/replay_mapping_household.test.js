import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';

const scene = (verb, object, place='Home') => [{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第1章'}],place,steps:[{verb,object,class:'other'}]}];
const pack = {places:[{id:'pack.home',indexId:'reader.home',name:'Home'}],placeAliases:[],people:[],
  householdActs:{acts:[{id:'synthetic.household_pay',operation:'pay',place:'pack.home',label:'Pay the meter',description:'Put a coin in the meter.'}]}};
const inputs = (verb, object, householdPack=pack) => ({scenes:scene(verb,object),crosswalk:{places:{}},fromChapter:1,toChapter:1,
  registry:[{id:'reader.home',kind:'place',label:'Home'}],pack:householdPack});

test('maps a household act from pack data and carries its place and source object',()=>{
  const mapping=buildReplayMapping(inputs('pay','gas-meter'));
  assert.equal(mapping.rows[0].canonicalControl,'synthetic.household_pay');
  assert.deepEqual(mapping.rows[0].route,[{actionId:'synthetic.household_pay',place:'pack.home',object:'gas-meter'}]);
  assert.equal(mapping.rows[0].householdActId,'synthetic.household_pay');
});

test('leaves unmatched household-looking steps typed and without a control',()=>{
  const mapping=buildReplayMapping(inputs('take','the key'));
  assert.equal(mapping.rows[0].status,'gap');
  assert.equal(mapping.rows[0].canonicalControl,null);
  assert.equal(mapping.rows[0].householdGap,'no act for verb at place');
  assert.match(mapping.rows[0].reason,/No pack act supports/);
});

test('a pack without household acts preserves prior mapping output',()=>{
  const mapping=buildReplayMapping({...inputs('pay','gas-meter'),pack:{...pack,householdActs:undefined}});
  const row=mapping.rows[0];
  assert.equal(row.status,'gap');
  assert.equal(row.gapKind,'missing verb');
  assert.equal(row.canonicalControl,null);
  assert.deepEqual(row.route,[]);
  assert.equal(row.reason,'No mapped be-seat control for verb class other.');
  assert.equal('householdActId' in row,false);
});
