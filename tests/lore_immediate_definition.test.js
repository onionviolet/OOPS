import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionRegistry as registry} from '../src/expedition_content.js';
import {lorePracticeCommand} from '../src/lore_practice_content.js';
import {prepareSimulationEffects} from '../src/simulation_resolution.js';
import {exactImmediateLorePracticeJob} from '../src/lore_practice_runtime.js';

const frozen=()=>{
 const d=lorePracticeCommand('lore.warning.begin');
 return {id:'simulation:10',commandId:d.id,revision:d.revision,actorId:d.actorId,targetId:d.targetId||null,
  costs:structuredClone(d.costs),effects:prepareSimulationEffects(d.effects,{},registry,'simulation:10')};
};
test('the actual warning accepts its shared-compiler frozen situation definition',()=>{
 const job=frozen();assert.ok(job.effects[0].definition);
 assert.equal(exactImmediateLorePracticeJob(job,registry),true);
});
test('immediate warning still rejects changed frozen content, effects, costs and participants',()=>{
 for(const change of [j=>j.effects[0].definition.deadline=999,j=>j.effects.push({type:'resource',key:'money',amount:99}),
  j=>j.costs.push({type:'resource',key:'money',amount:1}),j=>j.actorId='other',j=>j.targetId='other',j=>j.revision++]){
  const job=frozen();change(job);assert.equal(exactImmediateLorePracticeJob(job,registry),false);
 }
});
