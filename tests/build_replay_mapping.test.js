import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {buildPackJoin} from '../scripts/lead_run/build_crosswalk.mjs';
import {buildGapCensus} from '../scripts/lead_run/gap_census.mjs';

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
  assert.equal(a.rows[0].packPlaceId,'lotm.place.flat');
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

test('volume-aware locator bounds distinguish repeated chapter numbers and implicit volume one',()=>{
  const scenes=[
    {beat:'v1',order:1,pov:'lead',evidence:[{locator:'zh 第1章 p1'}],steps:[{verb:'start',class:'other'}]},
    {beat:'v2',order:2,pov:'lead',evidence:[{locator:'zh b2 第1章 p1'}],steps:[{verb:'continue',class:'other'}]},
    {beat:'v3',order:3,pov:'lead',evidence:[{locator:'zh b3 第1章 p1'}],steps:[{verb:'later',class:'other'}]}
  ];
  const result=buildReplayMapping({scenes,crosswalk:{places:{}},fromLocator:'zh b2 第1章',toLocator:'zh b2 第1章'});
  assert.deepEqual(result.rows.map(r=>r.id),['v2#1']);
  assert.equal(result.rows[0].sourceVolume,2);
});

test('maps existing talk and movement controls from clear generic-class verbs only with resolvable anchors',()=>{
  const scenes=[
    {beat:'talk',order:1,pov:'lead',evidence:[{locator:'zh 第1章 p1'}],place:'Flat',present:['p1'],steps:[{verb:'greet the guest',class:'other'}]},
    {beat:'talk-plural',order:2,pov:'lead',evidence:[{locator:'zh 第1章 p1'}],place:'Flat',present:['p1'],steps:[{verb:'speaks to the guest',class:'other'}]},
    {beat:'walk',order:3,pov:'lead',evidence:[{locator:'zh 第1章 p2'}],place:'Market',present:[],steps:[{verb:'walk back to the market',class:'unknown'}]},
    {beat:'unknown-person',order:4,pov:'lead',evidence:[{locator:'zh 第1章 p3'}],place:'Flat',present:[],steps:[{verb:'chat',class:'other'}]},
    {beat:'unknown-place',order:5,pov:'lead',evidence:[{locator:'zh 第1章 p4'}],place:'Unmapped',present:[],steps:[{verb:'walk to an unknown place',class:'other'}]}
  ];
  const result=buildReplayMapping({scenes,crosswalk:{places:{Flat:'place.flat',Market:'place.market'}},fromChapter:1,toChapter:1,controlIndex:{walks:{'place.market':'walk.market'},talks:{p1:'talk.p1'}}});
  assert.equal(result.rows[0].canonicalControl,'talk.p1'); assert.equal(result.rows[0].class,'socialize');
  assert.equal(result.rows[1].canonicalControl,'talk.p1');
  assert.equal(result.rows[2].canonicalControl,'walk.market'); assert.equal(result.rows[2].class,'travel');
  assert.equal(result.rows[3].status,'gap'); assert.equal(result.rows[3].class,'socialize');
  assert.equal(result.rows[4].status,'gap'); assert.equal(result.rows[4].class,'travel');
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

test('censuses only gaps, ranks classes, normalizes phrases and keeps range failures visible',()=>{
  const census=buildGapCensus([{rows:[
    {status:'gap',class:'travel',sourceVolume:2,verb:'Walk to the door!',packPlaceId:null},
    {status:'gap',class:'travel',sourceVolume:2,verb:'walk-to the door',packPlaceId:null},
    {status:'gap',class:'socialize',sourceVolume:3,verb:'',peopleResolved:[]},
    {status:'clean_fold',class:'socialize',sourceVolume:3,verb:'talk with someone'}
  ]}],[{range:'volume-two',reason:'synthetic failure'}]);
  assert.equal(census.totalSteps,4); assert.equal(census.totalGaps,3);
  assert.equal(census.duplicateRowsOmitted,0);
  assert.deepEqual(census.gapsByClass.map(c=>[c.class,c.steps]),[['travel',2],['socialize',1]]);
  assert.deepEqual(census.gapsByClass[0].topVerbPhrases,[{phrase:'walk to the door',count:2}]);
  assert.deepEqual(census.reasonSplit,{'missing verb':1,'missing place/person':2,'missing UI path':0});
  assert.equal(census.gapsByVolume.find(v=>v.volume===3).gaps,1);
  assert.equal(census.rangeFailures.length,1);
});

test('census counts a source step once when chapter ranges overlap',()=>{
  const row={id:'same-step',status:'gap',class:'other',sourceVolume:2,verb:'hide'};
  const census=buildGapCensus([{rows:[row]},{rows:[{...row}]}]);
  assert.equal(census.totalSteps,1);
  assert.equal(census.totalGaps,1);
  assert.equal(census.duplicateRowsOmitted,1);
});
