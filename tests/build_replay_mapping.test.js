import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';

test('builds deterministic place, time, talk and typed gap rows with option IDs',()=>{
  const scenes=[{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Flat',timeOfDay:{value:'dawn'},date:{label:'I'},
    present:[{kind:'person',id:'person.a'}],choices:[{options:[{id:'opt.taken',taken:true},{id:'opt.locked',taken:false}]}],
    steps:[{verb:'walk',class:'travel'},{verb:'talk to person',class:'social'},{verb:'hide an object',class:'other'}]},
    {beat:'s2',order:2,pov:'lead',evidence:[{locator:'第1章'}],place:'Flat',timeOfDay:{value:'evening'},date:{label:'I'},
      present:[],choices:[],steps:[{verb:'wait for the next scene',class:'rest'}]}];
  const crosswalk={places:{Flat:'lotm.place.flat'}};
  const controls={walks:{'lotm.place.flat':'lotm.move.lotm.place.flat'},talks:{'person.a':'cast_talk_a'},waitPrefix:'wait.until.'};
  const a=buildReplayMapping({scenes,crosswalk,fromChapter:1,toChapter:1,controlIndex:controls});
  const b=buildReplayMapping({scenes,crosswalk,fromChapter:1,toChapter:1,controlIndex:controls});
  assert.deepEqual(a,b); assert.equal(a.rows[0].canonicalControl,'lotm.move.lotm.place.flat');
  assert.match(a.rows[0].controlBuilder,/castMoves/);
  assert.equal(a.rows[1].canonicalControl,'cast_talk_a');
  assert.deepEqual(a.rows[2].lockedOptions,['opt.locked']); assert.equal(a.rows[2].class,'other');
  assert.equal(a.rows[3].routeMode,'wait'); assert.equal(a.rows[3].waitIntent,'evening');
});

test('filters by lead POV and chapter range without inventing a control',()=>{
  const scenes=[{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第2章'}],place:'Unknown',steps:[{verb:'fight',class:'conflict'}]},
    {beat:'s2',order:2,pov:'other',evidence:[{locator:'第2章'}],steps:[{verb:'talk'}]},
    {beat:'s3',order:3,pov:'lead',evidence:[{locator:'第3章'}],steps:[{verb:'go'}]}];
  const result=buildReplayMapping({scenes,crosswalk:{places:{}},fromChapter:1,toChapter:2});
  assert.deepEqual(result.rows.map(r=>r.id),['s1#1']); assert.equal(result.rows[0].status,'gap');
});
