import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReplayMapping} from '../scripts/lead_run/build_replay_mapping.mjs';
import {buildPackJoin} from '../scripts/lead_run/build_crosswalk.mjs';
import {buildGapCensus} from '../scripts/lead_run/gap_census.mjs';
import {validateMapping} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

test('uses a reviewed wait with a valid bound scene window, and rejects missing review or malformed windows',()=>{
  const scenes=[{beat:'sample',pov:'lead',evidence:[{locator:'zh 第1章 p2'}],place:'Room',steps:[{verb:'wait'}]}];
  const args={scenes,crosswalk:{places:{}},fromChapter:1,toChapter:1,controlIndex:{waitPrefix:'wait.until.'},
    pack:{bindings:{days:[{scene:'sample',day:2,from:600,to:660}]}},waitEvidence:{'sample#1':{locator:'zh 第1章 p2'}}};
  const row=buildReplayMapping(args).rows[0];
  assert.equal(row.controlKind,'wait'); assert.deepEqual([row.time.day,row.time.from,row.time.to],[2,600,660]);
  assert.equal(buildReplayMapping({...args,waitEvidence:{}}).rows[0].status,'gap');
  assert.equal(buildReplayMapping({...args,waitEvidence:{'sample#1':{locator:'zh 第1章 p3'}}}).rows[0].status,'gap');
  assert.equal(buildReplayMapping({...args,pack:{bindings:{days:[{scene:'sample',day:2,from:660,to:600}]}}}).rows[0].status,'gap');
});

test('builds deterministic place, time, talk and typed gap rows with option IDs',()=>{
  const scenes=[{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Flat',timeOfDay:{value:'dawn'},date:{label:'I'},
    present:[{kind:'person',id:'person.a'}],choices:[{options:[{id:'opt.taken',taken:true},{id:'opt.locked',taken:false}]}],
    steps:[{verb:'walk to Flat',class:'travel'},{verb:'talk to person',class:'social'},{verb:'hide an object',class:'other'}]},
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

test('reviewed rows override generated controls and reviewed gaps retain typed reasons',()=>{
 const scenes=[{beat:'sample',pov:'lead',evidence:[{locator:'第1章'}],place:'Flat',steps:[{verb:'walk to Flat',class:'travel'},{verb:'read',class:'study'},{verb:'remember',class:'other'}]}];
 const reviewed=[
  {stepId:'sample#1',verdict:'row',kind:'journey',row:{id:'journey.reviewed',from:'place.a',to:'place.b'}},
  {stepId:'sample#2',verdict:'gap',gapReason:'not an action'},
  {stepId:'sample#3',verdict:'gap',gapReason:'no mechanism'}
 ];
 const result=buildReplayMapping({scenes,crosswalk:{places:{Flat:'place.flat'}},fromChapter:1,toChapter:1,
  controlIndex:{walks:{'place.flat':'generated.walk'}},pack:{},reviewed});
 assert.equal(result.rows[0].canonicalControl,'journey.reviewed');
 assert.equal(result.rows[0].anchors.destination,'place.b');
 assert.equal(result.rows[1].status,'gap');assert.equal(result.rows[1].reviewedGapReason,'not an action');
 assert.equal(result.rows[1].excludedCandidate,true);
 assert.equal(result.rows[2].reviewedGapReason,'no mechanism');
});

test('CLI reviewed overlay preserves every selected source step and binds the source file',()=>{
 const dir=mkdtempSync(join(tmpdir(),'mapping-overlay-'));
 try {
  const scenes=[
   {beat:'opening',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Room',steps:[{verb:'inspect'},{verb:'wait'}]},
   {beat:'later-family',order:2,pov:'lead',evidence:[{locator:'第2章'}],place:'Room',steps:[{verb:'read'},{verb:'listen'}]}
  ];
  const files={scenes:join(dir,'scenes.jsonl'),crosswalk:join(dir,'crosswalk.json'),controls:join(dir,'controls.json'),registry:join(dir,'registry.jsonl'),pack:join(dir,'pack.json'),reviewed:join(dir,'reviewed.jsonl')};
  writeFileSync(files.scenes,scenes.map(x=>JSON.stringify(x)).join('\n')+'\n');
  for(const key of ['crosswalk','controls','pack'])writeFileSync(files[key],JSON.stringify(key==='crosswalk'?{places:{}}:{}));
  writeFileSync(files.registry,'');
  writeFileSync(files.reviewed,[{stepId:'opening#1',verdict:'row',kind:'act',row:{id:'fixture.act',place:'fixture.room'}},{stepId:'opening#2',verdict:'gap',gapReason:'not an action'}].map(x=>JSON.stringify(x)).join('\n')+'\n');
  const run=(name,review)=>{
   const out=join(dir,name),args=['scripts/lead_run/build_replay_mapping.mjs','--scenes',files.scenes,'--crosswalk',files.crosswalk,'--controls',files.controls,'--registry',files.registry,'--pack',files.pack,'--from','1','--to','2','--out',out];
   if(review)args.push('--reviewed',files.reviewed);
   const result=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
   return JSON.parse(readFileSync(out,'utf8'));
  };
  const plain=run('plain.json',false),reviewed=run('reviewed.json',true);
  assert.deepEqual(reviewed.rows.map(r=>r.id),plain.rows.map(r=>r.id));
  assert.deepEqual(reviewed.rows.slice(2),plain.rows.slice(2));
  assert.equal(reviewed.rows[0].canonicalControl,'fixture.act');
  assert.equal(reviewed.rows[1].reviewedGapReason,'not an action');
  assert.equal(reviewed.inputHashes['scenes.jsonl'],createHash('sha256').update(readFileSync(files.scenes)).digest('hex'));
  assert.deepEqual(validateMapping(reviewed,scenes),{scenes:2,steps:4});
 } finally {rmSync(dir,{recursive:true,force:true});}
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

test('replay order follows volume and chapter before shard-local order',()=>{
  const scenes=[{beat:'later',order:1,pov:'lead',evidence:[{locator:'zh b2 第1章 p1'}],steps:[{verb:'wait'}]},
    {beat:'earlier',order:9,pov:'lead',evidence:[{locator:'zh 第8章 p1'}],steps:[{verb:'wait'}]}];
  const result=buildReplayMapping({scenes,crosswalk:{places:{}},fromLocator:'zh 第1章',toLocator:'zh b2 第2章'});
  assert.deepEqual(result.rows.map(row=>row.id),['earlier#1','later#1']);
});

test('maps existing talk and movement controls from clear generic-class verbs only with resolvable anchors',()=>{
  const scenes=[
    {beat:'talk',order:1,pov:'lead',evidence:[{locator:'zh 第1章 p1'}],place:'Flat',present:['p1'],steps:[{verb:'greet the guest',class:'other'}]},
    {beat:'talk-plural',order:2,pov:'lead',evidence:[{locator:'zh 第1章 p1'}],place:'Flat',present:['p1'],steps:[{verb:'speaks to the guest',class:'other'}]},
    {beat:'walk',order:3,pov:'lead',evidence:[{locator:'zh 第1章 p2'}],place:'Market',present:[],steps:[{verb:'walk back to Market',class:'unknown'}]},
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
  const scenes=[{beat:'s1',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Bedroom, Flat',present:['reader.person.a'],steps:[{verb:'walk to Flat',class:'travel'}]}];
  const mapping=buildReplayMapping({scenes,crosswalk:{places:{}},fromChapter:1,toChapter:1,controlIndex:{walks:{'pack.place.home':'move.home'}},registry:[{id:'reader.person.a',kind:'person',label:'A'},{id:'reader.place.home',kind:'place',label:'Flat'}],pack:{people:[{id:'pack.person.a',indexId:'reader.person.a'}],places:[{id:'pack.place.home',indexId:'reader.place.home',name:'Flat'}],placeAliases:[]}});
  assert.equal(mapping.rows[0].canonicalControl,'move.home');
  assert.equal(mapping.rows[0].peopleResolved[0].packId,'pack.person.a');
  assert.equal(mapping.rows[0].placeResolution,'contained-component');
});

test('censuses gaps by actor, family and volume while preserving unknown actors and failures',()=>{
  const census=buildGapCensus([{rows:[
    {id:'a',actorRole:'lead',status:'gap',class:'travel',sourceVolume:2,verb:'Walk to the door!',packPlaceId:null,availableControls:{walkInventory:true}},
    {id:'b',actorRole:'lead',status:'gap',class:'travel',sourceVolume:2,verb:'walk-to the door',packPlaceId:null,availableControls:{walkInventory:true}},
    {id:'c',actorRole:'non-lead',status:'gap',class:'socialize',sourceVolume:3,verb:'',peopleResolved:[]},
    {id:'d',status:'clean_fold',class:'socialize',sourceVolume:3,verb:'talk with someone'}
  ]}],[{range:'volume-two',reason:'synthetic failure'}]);
  assert.equal(census.totalSteps,4); assert.equal(census.totalGaps,3);
  assert.equal(census.duplicateRowsOmitted,0);
  assert.equal(census.segments.lead.gaps,2); assert.equal(census.segments['non-lead'].gaps,1); assert.equal(census.segments.unknown.steps,1);
  assert.deepEqual(census.segments.lead.topVerbPhrases.travel,[{phrase:'walk to the door',count:2}]);
  assert.equal(census.segments.lead.families[0].family,'travel or move');
  assert.equal(census.segments.lead.reasons['control exists but place/person/item unresolved'],2);
  assert.equal(census.segments['non-lead'].volumes['3'].gaps,1);
  assert.equal(census.rangeFailures.length,1);
});

test('step actor is distinct from scene POV and missing actor stays unknown',()=>{
  const scenes=[{beat:'s',order:1,pov:'lead',evidence:[{locator:'第1章'}],steps:[
    {actor:'lead',verb:'read'}, {actor:'non-lead',verb:'read'}, {pov:'lead',verb:'read'}, {actor:'person.unresolved',verb:'read'}]}];
  const mapping=buildReplayMapping({scenes,crosswalk:{places:{}},fromChapter:1,toChapter:1});
  assert.deepEqual(mapping.rows.map(row=>row.actorRole),['lead','non-lead','unknown','unknown']);
});

test('does not fold an unrelated first action into a walk or a topic into a greeting',()=>{
  const scenes=[{beat:'s',order:1,pov:'lead',evidence:[{locator:'第1章'}],place:'Flat',present:['p1','p2'],steps:[
    {verb:'read a note',class:'study'}, {verb:'talk to a guest about a contract',class:'socialize'},
    {verb:'greet a guest',class:'socialize'}]}];
  const mapping=buildReplayMapping({scenes,crosswalk:{places:{Flat:'place.flat'}},fromChapter:1,toChapter:1,
    controlIndex:{walks:{'place.flat':'walk.flat'},talks:{p1:'talk.p1',p2:'talk.p2'}}});
  assert.deepEqual(mapping.rows.map(row=>row.status),['gap','gap','gap']);
});

test('census counts a source step once when chapter ranges overlap',()=>{
  const row={id:'same-step',status:'gap',class:'other',sourceVolume:2,verb:'hide'};
  const census=buildGapCensus([{rows:[row]},{rows:[{...row}]}]);
  assert.equal(census.totalSteps,1);
  assert.equal(census.totalGaps,1);
  assert.equal(census.duplicateRowsOmitted,1);
});

test('family classification requires a supported object type for reading and abilities',()=>{
  const rows=[{id:'a',actorRole:'lead',status:'gap',verb:'use a door'},
    {id:'b',actorRole:'lead',status:'gap',verb:'use a charm'},
    {id:'c',actorRole:'lead',status:'gap',verb:'read a diary'},
    {id:'d',actorRole:'lead',status:'gap',verb:'read a facial expression'}];
  const s=buildGapCensus([{rows}]).segments.lead;
  assert.deepEqual(Object.fromEntries(s.families.map(x=>[x.family,x.steps])),{'needs mechanism review: unknown':2,'read a text':1,'use an ability':1});
});

test('coverage counts exact controls by family and volume and groups only single missing resolutions',()=>{
  const rows=[{id:'a',actorRole:'unknown',status:'clean_fold',canonicalControl:'act.a',controlKind:'place act',sourceVolume:2,verb:'read a diary'},
    {id:'b',actorRole:'unknown',status:'gap',sourceVolume:2,verb:'read a diary'},
    {id:'c',actorRole:'lead',status:'gap',sourceVolume:3,verb:'read a diary'}];
  const reports=[{builder:'acts',rejectedRows:[{stepId:'b',missing:[{kind:'place',value:'Unknown room'}]},
    {stepId:'c',missing:[{kind:'place',value:'Unknown room'},{kind:'object',value:null}]}]}];
  const census=buildGapCensus([{rows}],[],reports),family=census.coverage.families.find(x=>x.family==='read a text');
  assert.equal(family.steps,3);assert.equal(family.exactControls,1);assert.equal(family.byControl['place act'],1);
  assert.equal(family.byVolume['2'].steps,2);assert.equal(family.byVolume['2'].exactControls,1);
  assert.deepEqual(census.missingResolution.stepCounts,{person:0,place:2,object:1});
  assert.deepEqual(census.missingResolution.byFamily['read a text'],{place:2,object:1});
  assert.equal(census.missingResolution.top30[0].steps,1);
});
