import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {buildPackJoin} from '../scripts/lead_run/build_crosswalk.mjs';

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

test('joins explicit reader IDs, aliases, containing-place components, and leaves unknowns unresolved',()=>{
  const crosswalk={places:{'Known alias':'generated.place.id'}};
  const registry=[
    {id:'reader.person.a',kind:'person',label:'Person A'},
    {id:'reader.place.home',kind:'place',label:'Flat',aliases:['Home alias']},
    {id:'reader.place.room',kind:'place',label:'Bedroom'}
  ];
  const pack={people:[{id:'pack.person.a',indexId:'reader.person.a'}],
    places:[{id:'pack.place.home',indexId:'reader.place.home',name:'Flat'}],
    placeAliases:[{id:'pack.place.room',indexId:'reader.place.room',place:'reader.place.home'}],
    idMap:{}};
  const join=buildPackJoin({crosswalk,registry,pack});
  assert.equal(join.resolvePerson('reader.person.a'),'pack.person.a');
  assert.deepEqual(join.resolvePlace('Home alias'),{id:'pack.place.home',rule:'exact-alias'});
  assert.deepEqual(join.resolvePlace('Bedroom, Flat'),{id:'pack.place.home',rule:'contained-component'});
  assert.equal(join.resolvePlace('Unknown location').id,null);
});

test('maps M4 string people and packs canonical containing-place ids on each step',()=>{
  const scenes=[{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Bedroom, Flat',present:['reader.person.a'],steps:[{verb:'walk to room',class:'travel'}]}];
  const mapping=buildReplayMapping({scenes,crosswalk:{places:{}},fromChapter:1,toChapter:1,controlIndex:{walks:{'pack.place.home':'move.home'}},registry:[{id:'reader.person.a',kind:'person',label:'A'},{id:'reader.place.home',kind:'place',label:'Flat'}],pack:{people:[{id:'pack.person.a',indexId:'reader.person.a'}],places:[{id:'pack.place.home',indexId:'reader.place.home',name:'Flat'}],placeAliases:[]}});
  assert.equal(mapping.rows[0].canonicalControl,'move.home');
  assert.equal(mapping.rows[0].peopleResolved[0].packId,'pack.person.a');
  assert.equal(mapping.rows[0].placeResolution,'contained-component');
});
