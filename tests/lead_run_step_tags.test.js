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
