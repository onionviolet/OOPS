import test from 'node:test';
import assert from 'node:assert/strict';
import {foundLine,validateLineage} from '../src/lineage_traits.js';
import {drawCultivationRoot,validateCultivationRoot,rootRateBonus} from '../src/cultivation_root.js';
import {freshCultivation,cultivationView,advanceCultivation} from '../src/absorb_p23/world_adaptation/techniques.js';
test('birth-seeded inherited affinity stays latent until tested and disclosure does not change actual matched practice',()=>{
 const line=foundLine('affinity-life'),r=drawCultivationRoot(line);assert.deepEqual(drawCultivationRoot(JSON.parse(JSON.stringify(line))),r);assert.equal(r.tested,false);validateCultivationRoot(r);validateLineage({...line,cultivationRoot:r});assert.throws(()=>validateLineage({...line,cultivationRoot:{...r,flow:5}}),/root/);
 const t={...freshCultivation(),selected:'breath'},untested=cultivationView(t,false,r),tested=cultivationView(t,false,{...r,tested:true});assert.equal(untested.rate,tested.rate);assert.equal(untested.rate,Math.floor(100*(1000+10*r.flow)/1000));
 assert.equal(cultivationView(freshCultivation(),false,r).rate,125,'open mist has no matching circulation drill');
});
test('affinity accrual stays partition independent across real practice stages and an absent root preserves old saves',()=>{
 const t={...freshCultivation(),selected:'breath'},root={flow:4,still:1,tested:false};const coarse=advanceCultivation(t,60,root);let next=t,earned=0n;for(let i=0;i<60;i++){const p=advanceCultivation(next,1,root);next=p.next;earned+=p.earned;}assert.equal(coarse.earned,earned);assert.deepEqual(coarse.next,next);assert.ok(coarse.earned>advanceCultivation(t,60).earned);assert.equal(t.cultivationRoot,undefined);
});

test('calibrated retuning redistributes tested body expression without rerolling genes or creating free potential',async()=>{
 const {retuneCultivationRoot}=await import('../src/cultivation_root.js');const r={flow:1,still:3,tested:true},next=retuneCultivationRoot(r,'flow');assert.deepEqual(next,{flow:2,still:2,tested:true});assert.deepEqual(r,{flow:1,still:3,tested:true});assert.equal(next.flow+next.still,r.flow+r.still);assert.deepEqual(retuneCultivationRoot(next,'still'),r);assert.throws(()=>retuneCultivationRoot({...r,tested:false},'flow'),/Measure/);assert.throws(()=>retuneCultivationRoot({flow:4,still:0,tested:true},'flow'),/calibration/);assert.ok(rootRateBonus(next,'breath')>rootRateBonus(r,'breath'));
});
