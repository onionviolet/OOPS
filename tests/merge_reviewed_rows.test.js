import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeReviewedRows,resolveReviewedRows} from '../scripts/lead_run/merge_reviewed_rows.mjs';

const pack=()=>({schema:'lotm-cast/1',people:[],references:[],places:[],schedule:[],beats:[],remoteWhereabouts:[],anchors:[],placeAliases:[],clockClaims:[],topicTalks:{talks:[]},journeys:{journeys:[]},householdActs:{objects:[],acts:[]}});
const act={id:'fixture.act',sourceStepId:'scene#1',operation:'inspect',place:'fixture.room',minutes:1,label:'Inspect',description:'Inspect the room.',report:'You inspect the room.',knowledgeKey:'fixture.act.result'};
test('merges reviewed rows by kind, validates native definitions and is idempotent',()=>{
 const line={stepId:'scene#1',verdict:'row',kind:'act',row:act};
 const once=mergeReviewedRows(pack(),[[line]]);
 assert.deepEqual(once.added,{topic:0,journey:0,act:1});
 assert.equal(once.validated.acts,1);
 const twice=mergeReviewedRows(once.pack,[[line]]);
 assert.deepEqual(twice.added,{topic:0,journey:0,act:0});
 assert.deepEqual(twice.pack,once.pack);
});
test('fails loudly on conflicting ids and malformed JSON values',()=>{
 const different={...act,label:'Different'};
 assert.throws(()=>mergeReviewedRows({...pack(),householdActs:{objects:[],acts:[act]}},[[{stepId:'scene#1',verdict:'row',kind:'act',row:different}]]),/ID collision/);
 assert.throws(()=>mergeReviewedRows(pack(),[[{stepId:'scene#1',verdict:'row',kind:'act',row:{...act,description:undefined}}]]),/Undefined value/);
});
test('reviewed source disposition replaces an older control for the same step',()=>{
 const existing={...act,id:'generated.old'};
 const result=mergeReviewedRows({...pack(),householdActs:{objects:[],acts:[existing]}},[[{stepId:'scene#1',verdict:'row',kind:'act',row:act}]]);
 assert.deepEqual(result.pack.householdActs.acts.map(row=>row.id),['fixture.act']);
});

test('reviewed conflicts prefer rows over gaps and the later shard for equal verdicts',()=>{
 const gap={stepId:'scene#1',verdict:'gap',gapReason:'no mechanism'};
 const row={stepId:'scene#1',verdict:'row',kind:'act',row:act};
 const laterGap={...gap,gapReason:'not an action'};
 const second={stepId:'scene#2',verdict:'gap',gapReason:'no mechanism'};
 const secondLater={...second,gapReason:'not an action'};
 const resolved=resolveReviewedRows([[gap,second],[row,secondLater],[laterGap]]);
 assert.equal(resolved.conflicts,3);
 assert.equal(resolved.entries.find(x=>x.line.stepId==='scene#1').line.verdict,'row');
 assert.equal(resolved.entries.find(x=>x.line.stepId==='scene#2').line.gapReason,'not an action');
 const merged=mergeReviewedRows(pack(),[[gap],[row],[laterGap]]);
 assert.equal(merged.added.act,1);assert.equal(merged.byShard[1].act,1);
});

test('reviewed operations use the same stock, custody and clock validators as runtime',()=>{
 const input=pack();input.householdActs.objects=[{id:'fixture.stock',resources:[{actor:'player',key:'fixture.grain',amount:1}],actorFacts:[{actor:'player',key:'fixture.owned',value:true}]}];
 const variants=[['read',{}],['prepare',{costs:[{type:'resource',actor:'player',key:'fixture.grain',amount:-1}],effects:[{type:'fact',scope:'world',key:'fixture.prepared',value:true}]}],['wake',{}],['check time',{clock:{fact:'fixture.clock',value:'07:15'}}],['sit',{}],['settle',{}],['secure',{objectId:'fixture.stock',secure:{ownedFact:'fixture.owned',custodyFact:'fixture.custody',concealedFact:'fixture.concealed',container:'fixture.drawer'}}],['wait here',{}]];
 const lines=variants.map(([operation,extra],i)=>({stepId:`scene#${i+1}`,kind:'act',verdict:'row',row:{...act,...extra,id:`fixture.act.${i}`,sourceStepId:`scene#${i+1}`,operation}}));
 const result=mergeReviewedRows(input,[lines]);assert.equal(result.validated.acts,8);
 assert.deepEqual(mergeReviewedRows(result.pack,[lines]).pack,result.pack);
 const broken=structuredClone(input);broken.householdActs.objects=[];
 assert.throws(()=>mergeReviewedRows(broken,[[lines[1]]]),/seeded resource/);
});
