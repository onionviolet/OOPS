import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeReviewedRows,resolveReviewedRows} from '../scripts/lead_run/merge_reviewed_rows.mjs';

const pack=()=>({schema:'lotm-cast/1',people:[],references:[],places:[],schedule:[],beats:[],remoteWhereabouts:[],anchors:[],placeAliases:[],clockClaims:[],topicTalks:{talks:[]},journeys:{journeys:[]},householdActs:{objects:[],acts:[]}});
const act={id:'fixture.act',sourceStepId:'scene#1',operation:'inspect',place:'fixture.room',minutes:1,label:'Inspect',description:'Inspect the room.',report:'You inspect the room.',knowledgeKey:'fixture.act.result'};
test('merges reviewed rows by kind, validates native definitions and is idempotent',()=>{
 const line={stepId:'scene#1',verdict:'row',kind:'act',row:act};
 const once=mergeReviewedRows(pack(),[[line]]);
 assert.deepEqual(once.added,{topic:0,journey:0,act:1,divination:0,making:0,inference:0});
 assert.equal(once.validated.acts,1);
 const twice=mergeReviewedRows(once.pack,[[line]]);
 assert.deepEqual(twice.added,{topic:0,journey:0,act:0,divination:0,making:0,inference:0});
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

test('synthetic reviewed divinations, making and inferences compile through live adapters and CLI',async t=>{
 const {mkdtemp,writeFile,readFile,rm}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const {execFileSync}=await import('node:child_process');
 const step={id:'ask',kind:'attempt',label:'Observe a pointer',description:'Ask and observe the held pointer.',minutes:1,report:'You watched the pointer.',status:'unanswered',signal:'No clear signal.'};
 const query={id:'fixture.query',sourceStepId:'scene#query',targetId:'fixture.target',question:'Which sample?',method:'A pointer',label:'Ask',description:'Ask with a held pointer.',means:{fact:'actor.fixture.pointer',op:'eq',value:true},contact:{fact:'actor.fixture.contact',op:'eq',value:true},steps:[step]};
 const making={id:'fixture.making',revision:1,sourceStepId:'scene#making',kind:'document',operation:'write',place:'fixture.room',minutes:1,label:'Write a note',description:'Write a held note.',report:'You wrote a note.',object:{key:'fixture.note.written',value:true}};
 const thought={id:'fixture.inference',sourceStepId:'scene#inference',label:'Consider a fragment',description:'Consider your own memory.',steps:[{id:'think',kind:'infer',label:'Think',description:'Form a tentative belief.',minutes:1,report:'I may need to ask.',uncertainty:'The memory is incomplete.',observation:{actor:'player',basis:'recalled',value:'I remember a fragment.'}}]};
 const lines=[['divination',query],['making',making],['inference',thought]].map(([kind,row])=>({kind,row,stepId:row.sourceStepId,verdict:'row'}));
 const result=mergeReviewedRows(pack(),[lines]);assert.deepEqual(result.added,{topic:0,journey:0,act:0,divination:1,making:1,inference:1});
 assert.deepEqual(result.validated,{talks:0,journeys:0,acts:0,divinations:1,making:1,inferences:1});
 assert.deepEqual(mergeReviewedRows(result.pack,[lines]).pack,result.pack);
 // The same source step may change mechanism after paragraph review.
 const replacement={...making,id:'fixture.replacement',sourceStepId:query.sourceStepId};
 const replaced=mergeReviewedRows(result.pack,[[{kind:'making',row:replacement,stepId:replacement.sourceStepId,verdict:'row'}]]);
 assert.equal(replaced.pack.divinations.queries.length,0);assert.equal(replaced.pack.making.rows.length,2);
 for(const [index,mutate] of [[0,r=>r.steps[0].effects=[{type:'relocate'}]],[1,r=>r.kind='equipment'],[2,r=>r.steps[0].observation.actor='fixture.other']]){
  const bad=structuredClone(lines);mutate(bad[index].row);assert.throws(()=>mergeReviewedRows(pack(),[bad]));
 }
 const collision=structuredClone(lines);collision[2].row.id=query.id;assert.throws(()=>mergeReviewedRows(pack(),[collision]),/ID collision/);
 const dir=await mkdtemp(join(tmpdir(),'ad2-merge-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await writeFile(join(dir,'pack.json'),JSON.stringify(pack()));await writeFile(join(dir,'reviewed.jsonl'),lines.map(JSON.stringify).join('\n'));
 const stdout=execFileSync(process.execPath,['scripts/lead_run/merge_reviewed_rows.mjs','--pack',join(dir,'pack.json'),'--reviewed',join(dir,'reviewed.jsonl'),'--out',join(dir,'merged.json')],{encoding:'utf8'});
 assert.deepEqual(JSON.parse(stdout).validated,result.validated);assert.deepEqual(JSON.parse(await readFile(join(dir,'merged.json'),'utf8')),result.pack);
});
