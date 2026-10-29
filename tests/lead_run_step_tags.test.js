import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveStepTags, agreementWithReviewed, kindOf, habitOf} from '../scripts/lead_run/derive_step_tags.mjs';
import {replayMetrics, familyByVolume} from '../scripts/lead_run/replay_metrics.mjs';

const registry = [{id:'p.lead',kind:'person',label:'Ada Fixture',aliases:['Ada']},{id:'p.other',kind:'person',label:'Boris Fixture',aliases:['Boris']}];
const scenes = [
  {beat:'s1',pov:'lead',weight:'great',steps:[{verb:'wake',object:'bed'},{verb:'think about the rent',object:'rent'},{verb:'Boris hands',object:'key'},{verb:'eat breakfast every morning',object:'bread'}]},
  {beat:'s2',pov:'p.other',steps:[{verb:'walk',object:'street'}]},
  {beat:'s3',pov:'p.lead',steps:[{verb:'ask',object:'clerk',actor:'p.lead'}]},
];

test('derives actor, kind, habit and family with a basis, and leaves the reader\'s actor alone',()=>{
  const tags = deriveStepTags(scenes,{registry,leadId:'p.lead'});
  const by = id => tags.find(t=>t.id===id);
  assert.equal(by('s1#1').actor,'lead'); assert.equal(by('s1#1').actorWeak,true); assert.equal(by('s1#1').actorBasis,'pov-default');
  assert.equal(by('s1#2').kind,'think'); assert.equal(by('s1#2').kindBasis,'verb-lexicon');
  assert.equal(by('s1#3').actor,'p.other'); assert.equal(by('s1#3').actorBasis,'subject-name');
  assert.equal(by('s1#4').habit,'routine');
  assert.equal(by('s2#1').actor,'p.other'); assert.equal(by('s2#1').actorBasis,'scene-pov');
  assert.equal(by('s3#1').source,'reader'); assert.equal(by('s3#1').actor,'p.lead');
  assert.equal(by('s1#1').kind,'act'); assert.equal(by('s1#1').kindWeak,true);
  assert.ok(tags.every(t=>t.family));
});

test('a weak default is not counted as a hit when agreeing with reviewed verdicts',()=>{
  const tags = deriveStepTags(scenes,{registry,leadId:'p.lead'});
  const reviewed = [{stepId:'s1#3',verdict:'gap',gapReason:'actor not the lead'},{stepId:'s1#1',verdict:'gap',gapReason:'actor not the lead'},
    {stepId:'s1#2',verdict:'gap',gapReason:'not an action'},{stepId:'s1#4',verdict:'row'}];
  const a = agreementWithReviewed(tags,reviewed);
  assert.equal(a.actor.notLead,2); assert.equal(a.actor.notLeadTaggedNonLead,1); assert.equal(a.actor.notLeadUnknown,1);
  assert.equal(a.kind.notAction,1); assert.equal(a.kind.notActionTaggedNonAct,1);
  assert.equal(a.kind.rowSteps,1); assert.equal(a.kind.rowStepsTaggedNonAct,0);
});

test('lexicons stay silent when the text is silent',()=>{
  assert.equal(habitOf({verb:'open',object:'door'}),null);
  assert.equal(kindOf({verb:'open'}).weak,true);
});

test('replay metrics count reachable share, great beats, fold loss and control kinds, and say what is not measured',()=>{
  const mappings = [{rows:[{id:'s1#1',scene:'s1',status:'clean_fold',controlKind:'journey',canonicalControl:'c1',sourceVolume:1},{id:'s1#2',scene:'s1',status:'gap',sourceVolume:1},
    {id:'s2#1',scene:'s2',status:'lossy_fold',sourceVolume:1}]}];
  const m = replayMetrics(mappings,[{beat:'s1',weight:'great'},{beat:'s2',weight:'routine'}]);
  assert.equal(m.steps,3); assert.equal(m.reachableShare,0.333); assert.equal(m.playableShareGreatBeats,0.5);
  assert.equal(m.greatBeats,1); assert.equal(m.greatBeatsFullyReached,0); assert.equal(m.foldLossCount,1);
  assert.deepEqual(m.controlKinds,{journey:1}); assert.ok(m.notMeasured.emergentCanonRate);
  const table = familyByVolume({segments:{lead:{volumes:{1:{families:{a:2}},2:{families:{a:1,b:4}}}}}});
  assert.deepEqual(table.map(r=>[r.family,r.total]),[['b',4],['a',3]]);
});

import {featuresOf, train, score, splitHalfAuc} from '../scripts/lead_run/rank_review_queue.mjs';
test('the review ranker scores a learnable pattern above chance and is deterministic',()=>{
  const rows=[];
  for(let i=0;i<40;i++) rows.push({x:featuresOf({present:Array(i%2?4:0),evidence:[{kind:'narration'}]},{class:'other',verb:i%2?'one two three four':'go',object:'x'}),y:Boolean(i%2)});
  const m=train(rows);
  assert.ok(score(m,rows[1].x)>score(m,rows[0].x));
  assert.equal(splitHalfAuc(rows),splitHalfAuc(rows));
  assert.ok(splitHalfAuc(rows)>0.9);
});

import {buildSceneCards, buildEventCards, sceneVolumeChapter} from '../scripts/lead_run/build_event_cards.mjs';
const cardScene = {beat:'c1',order:1,pov:'lead',place:'p.flat',present:['p.other'],date:{anchor:'a1',offsetDays:1,value:null},timeOfDay:{value:'morning'},
  evidence:[{locator:'zh 第3章 p10'}],
  steps:[{verb:'eat',object:'bread'},{verb:'plan',object:'shopping-list'},{verb:'hide',object:'revolver-in-drawer'}],
  outcomes:[{fact:'revolver hidden in drawer',value:'true',class:'changed'}],
  knowledge:[{fact:'shopping list agreed',change:'gained',from:'p.other',locator:'zh 第3章 p58'}],
  choices:[{taken:'hide revolver',options:['keep it','hide revolver']}]};
const rowsFor = (statuses) => new Map(cardScene.steps.map((s,i)=>[`c1#${i+1}`,{id:`c1#${i+1}`,status:statuses[i]||'gap',lockedOptions:['keep it']}]));

test('assigns scene outcomes to the step that names them and leftovers to the last eligible step',()=>{
  const {cards,gaps}=buildSceneCards(cardScene,rowsFor([]));
  const by=Object.fromEntries(cards.map(c=>[c.stepId,c]));
  assert.deepEqual(by['c1#3'].effects.filter(e=>e.type==='fact').map(e=>e.key),['revolver hidden in drawer']);
  assert.ok(by['c1#2'].effects.some(e=>e.type==='knowledge'),'knowledge naming the list lands on the planning step');
  assert.equal(by['c1#3'].choices.length,1);
  assert.deepEqual(by['c1#3'].lockedOptions,['keep it']);
  assert.deepEqual(gaps.map(g=>[g.stepId,g.reasons]),[['c1#1',['missing outcomes']]]);
});

test('a step with a control gets no card, and a scene with no time or place stays a gap with the reason',()=>{
  assert.equal(buildSceneCards(cardScene,rowsFor(['clean_fold'])).cards.some(c=>c.stepId==='c1#1'),false);
  const bare={...cardScene,place:null,date:null,timeOfDay:null};
  const r=buildSceneCards(bare,rowsFor([]));
  assert.equal(r.cards.length,0); assert.ok(r.gaps.every(g=>g.reasons.includes('missing place')&&g.reasons.includes('missing time')));
});

test('card building keeps to volume one chapters up to the limit and lead scenes',()=>{
  assert.deepEqual(sceneVolumeChapter(cardScene),{book:0,ch:3});
  const late={...cardScene,beat:'c2',evidence:[{locator:'zh 第30章 p1'}]};
  const out=buildEventCards([cardScene,late],[{rows:[...rowsFor([]).values()]}],{maxChapter:24});
  assert.ok(out.cards.every(c=>c.scene==='c1')); assert.equal(out.summary.scenes,1);
});

import {buildThreads, threadReport} from '../scripts/lead_run/build_event_threads.mjs';
const tScene = (beat, order, touched, extra = {}) => ({beat, order, pov:'lead', touched:touched.map(([id,kind])=>({id,kind})), present:[], steps:[{verb:'act',object:'x'}], date:{anchor:'a',offsetDays:order}, ...extra});

test('threads chain by needs, continues and rare shared ids, not by after deps or world-state ids',()=>{
  const scenes = [tScene('b1',1,[['i.key','item'],['d.god','deity']]), tScene('b2',2,[['i.key','item'],['d.god','deity']],{deps:[{id:'b1',kind:'after'}]}),
    tScene('b3',3,[['d.god','deity']],{deps:[{id:'b2',kind:'after'}]}), tScene('b4',4,[],{deps:[{id:'b1',kind:'needs'}]}), tScene('b5',5,[],{continues:'b3'})];
  scenes.push(...Array.from({length:12},(_,i)=>tScene(`f${i}`,10+i,[])));
  const {threads, threadOfScene} = buildThreads(scenes);
  assert.equal(threadOfScene.get('b1'), threadOfScene.get('b2'), 'shared item links');
  assert.equal(threadOfScene.get('b1'), threadOfScene.get('b4'), 'needs links');
  assert.equal(threadOfScene.get('b3'), threadOfScene.get('b5'), 'continues links');
  assert.notEqual(threadOfScene.get('b2'), threadOfScene.get('b3'), 'after deps and a deity do not chain');
  assert.ok(threads.every(t=>t.beats.length>=1) && threadOfScene.size===scenes.length);
});

test('a thread is a gap when a carried id has no home in its cards, and counts as reachable only when every step is',()=>{
  const scenes=[tScene('t1',1,[['i.key','item']]),tScene('t2',2,[['i.key','item']])];
  scenes.push(...Array.from({length:10},(_,i)=>tScene(`g${i}`,20+i,[])));
  const {threads}=buildThreads(scenes), tid=threads.find(t=>t.beats.includes('t1')).id;
  const card=(step,extra={})=>({stepId:step,threadId:tid,effects:[],inputs:[],outputs:[],gains:[],requires:[],...extra});
  const status=()=>'gap';
  const lost=threadReport(threads,scenes,[card('t1#1'),card('t2#1')],status,new Set(['t1#1','t2#1']));
  assert.equal(lost.threadFoldLossGaps,1); assert.deepEqual(lost.rows.find(r=>r.id===tid).homeless,['i.key']);
  const homed=threadReport(threads,scenes,[card('t1#1',{outputs:['key found']}),card('t2#1')],status,new Set(['t1#1','t2#1']));
  assert.equal(homed.threadFoldLossGaps,0); assert.equal(homed.rows.find(r=>r.id===tid).missingSteps,0); assert.equal(homed.multiBeatCarriedStateSurvives,1);
  const missing=threadReport(threads,scenes,[card('t1#1',{outputs:['key found']})],status,new Set(['t1#1']));
  assert.equal(missing.multiBeatFullyReachableInOrder,0);
});
