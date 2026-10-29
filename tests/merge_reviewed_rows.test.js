import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeReviewedRows} from '../scripts/lead_run/merge_reviewed_rows.mjs';

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
