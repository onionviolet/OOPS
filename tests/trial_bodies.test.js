import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';
import {syncTrialBody} from '../src/trial_bodies.js';
test('body replacement suppresses conditioning without erasing qualification; original body restores once without stacking',()=>{
 const at=P.settleOrdeal(P.stepOrdeal(P.beginOrdeal(P.fresh(),{kind:'precision',units:0,skills:{combat:1},at:0}),'steady',{combat:1},1),1).state;
 const a=syncTrialBody(at,'original'),b=syncTrialBody(a,'replacement');assert.equal(b.trial.stage,0);assert.equal(b.trial.quality,0);assert.equal(b.trial.bestStage,1);assert.equal(P.buckets(b,2).tempering,undefined);
 const back=syncTrialBody(b,'original');assert.equal(back.trial.stage,1);assert.equal(back.trial.quality,1);assert.deepEqual(P.buckets(back,2),P.buckets(a,2));assert.equal(syncTrialBody(back,'original'),back);P.validate(JSON.parse(JSON.stringify(back)));
});
