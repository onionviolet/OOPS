// Standalone proposal sizing. Writes only OUTPUT.json in this lane.
// No private saves; optional fresh game uses an isolated existing test helper.
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {SAVE_STORAGE_BUDGET, measureSaveSize, checkSaveSize, encodeSaveFile} from '../../../../../src/save_files.js';
import {createWorldInstance, validateWorldInstance} from '../../../../../src/world_instances.js';
import {GLASSHOUSE_DEFINITION} from '../../../../../src/realm_state.js';
import {FOLDED_GLASSHOUSE_IDS} from '../../../../../src/pocket_realm_content.js';

const root = new URL('../../../../../', import.meta.url);
const hash = s => createHash('sha256').update(s).digest('hex');
const files = ['src/main.js','src/save_files.js','src/chronicle.js','src/world_instances.js','src/realm_state.js',
  'src/pocket_realm_content.js','tests/realm_dormant_structured.test.js','tests/helpers/cheat_game.mjs',
  'docs/gm/dispatch/runs-and-endings-2026-10-14/r2/REPORT.md',
  'docs/gm/dispatch/runs-and-endings-2026-10-14/r5/REPORT.md',
  'docs/gm/dispatch/runs-and-endings-2026-10-14/r7/REPORT.md'];
const sourceHashes = Object.fromEntries(await Promise.all(files.map(async p => [p,hash(await readFile(new URL(p,root)))])));
const stamp = n => ({clockId:'run.1.joined',value:n,calendarMinute:n});
const worldRef = {ownerPath:'expansion.realmPrototype.instances',worldId:'example.world',instanceId:'example.instance.a',
  definitionId:'example.definition',definitionRevision:1,continuityId:'example.history.a',eraId:'example.present'};
const evidence = id => ({ownerPath:'run_system.outcomes',recordId:id,revision:1});
const carry = {domain:'knowledge',recordRef:evidence('outcome.1'),disposition:'kept',carrierId:'example.body.1',destinationRef:worldRef,reasonKey:'supported.carrier'};
function generated(n) {
  return {id:`quest.${n}`,templateId:'local.repair',templateRevision:1,worldRef,runId:'run.1',issuerId:'example.issuer',seed:42+n,
    slots:{siteId:'example.bridge',materialId:'wood'},definition:{name:'Repair the local bridge',
      description:'Deliver timber to repair the crossing. The issuer supplies the tools.',repeatable:false,
      tasks:[{index:0,description:'Deliver three timber pieces',hidden:false,conditions:{all:{give:{wood:{target:3,current:0,requirements:{},restrictions:{}}}}}}],
      taskRewards:[{}],questRewards:{money:25}},registeredQuestId:`quest.${n}`,settlementId:null};
}
function offer(n, terminal=false) {
  return {id:`offer.${n}`,questId:`quest.${n}`,runId:'run.1',worldRef,sourceReceiptId:`action.${n}`,
    trigger:{kind:'count',targetId:'wood',observed:n+3,threshold:3},status:terminal?'expired':'offered',
    offeredAt:stamp(n),expiresAt:stamp(n+60),clockPolicyId:'played.freeze',goalTags:['goal.repair'],outcomeId:terminal?`outcome.${n}`:null};
}
function outcome(n) {
  return {id:`outcome.${n}`,sequence:n,subjectId:`offer.${n}`,kind:'expired',at:stamp(n+60),actorId:'example.issuer',
    observerIds:['player'],evidenceRefs:[{ownerPath:'world.events',recordId:`event.${n}`,revision:1}]};
}
function segment(n) {
  return {id:`segment.${n}`,kind:'life_end',reasonKey:'end.old_age',worldRef,endedAt:stamp(n*1000),
    outcomeRefs:[evidence(`outcome.${n}`)],endingIds:[`ending.${n}`],goalIds:['goal.repair'],carryRows:[carry],unresolvedRefs:[]};
}
// Read the exact three published R5 examples, with no invented schema fields.
const r5 = await readFile(new URL('docs/gm/dispatch/runs-and-endings-2026-10-14/r5/REPORT.md',root),'utf8');
const r5Records = [...r5.matchAll(/```json\n([\s\S]*?)\n```/g)].map(m=>JSON.parse(m[1]));
assert.equal(r5Records.length,3,'R5 shape changed; re-audit before sizing');
const [life,trace,fork] = r5Records;
// K400-K415 include transient and data-only records. Size examples explicitly,
// without pretending transient packets are a durable second event queue.
const shapes = {
  K400:generated(1), K401:offer(1),
  K402:{id:'goal.repair',runId:'run.1',ownerActorId:'player',text:'Repair the bridge',origin:'written',suggestionReceiptId:null,status:'active',createdAt:stamp(1),parentGoalId:null,
    steps:[{id:'step.1',templateId:'local.repair',questId:'quest.1',knowledge:'known',evidenceRefs:[]},{id:'step.2',templateId:null,questId:null,knowledge:'unknown',evidenceRefs:[]}],terminalOutcomeId:null},
  K403:{quest_event_type:'give',quest_event_target:'wood',quest_event_count:3,additional_quest_tags:{},receiptId:'action.1'},
  K404:{allowed:true,reasons:[],bindingRevision:1},
  K405:{id:'posted.1',runId:'run.1',worldRef,templateId:'local.delivery',templateRevision:1,issuerId:'player',takerId:'example.taker',status:'taken',offeredAt:stamp(1),jobId:'job.1',escrowRef:evidence('escrow.1'),outcomeId:null,settlementId:null},
  K406:null, K407:{summaryCursor:1000,outcomes:{'outcome.1':outcome(1)}},
  K408:{'region.local.control':'example.guild','region.local.prosperity':50,'region.local.threat':2},
  K409:{ending:{closure:'setting',continuityId:'example.history.a',sourceRevision:'pack.1',sequel:{status:'none',continuityId:null},routeId:null,adaptationId:null,disputeOverlayIds:[],frontiers:{published:null,captured:null,read:null,adapted:null}}},
  K410:{id:'ending.1',runId:'run.1',worldRef,eventId:'event.1',eventRevision:1,scope:'arc',resolution:'resolved',outcomeRef:evidence('outcome.1'),role:'helper',settledAt:stamp(10),knownFactRefs:[],provenanceRef:null},
  K411:{provenance:{kind:'original',sourceRevision:'pack.1',frontierLocator:null,frontierStage:'adapted',pastCanon:true}},
  K412:segment(1),
  K413:{provenance:{kind:'branch',forkedFromInstanceId:'example.instance.a',forkedAt:stamp(10)},display:{publicName:'Example branch',renamed:false,driftBand:'unknown',basisReceiptIds:[]}},
  K414:{resume:{worldRef,endpoint:{worldId:worldRef.worldId,instanceId:worldRef.instanceId,regionId:'example.region',layerId:'material'},nativeLocationId:'Village',suspendedAt:stamp(10),ownerRevisions:{instance:1}}},
  K415:{deed:{id:'deed.1',runId:'run.1',worldRef,kind:'help',occurrenceId:'episode.1',evidenceRefs:[evidence('outcome.1')],at:stamp(10),quantity:2,policyId:'deeds.local',policyRevision:1},
    settlement:{id:'settlement.1',runId:'run.1',policyId:'deeds.local',policyRevision:1,deedIds:['deed.1'],at:stamp(10),resetKind:'prestige',nextRunId:'run.2',carryRows:[carry]}},
  T22:life,T24:trace,T25:fork
};
const rows=[];
function size(id,value,note) {
  const s=JSON.stringify(value),m=measureSaveSize(s);
  const row={id,...m,budgetPercent:Number((m.storageBytes/SAVE_STORAGE_BUDGET*100).toFixed(5)),note};rows.push(row);return row;
}
for(const [k,v] of Object.entries(shapes)) {
  if(v===null) rows.push({id:k,utf8Bytes:0,storageBytes:0,budgetPercent:0,note:'Derived sorting; no added durable record.'});
  else size(k,v,'Synthetic sample of proposed shape; not admitted gameplay.');
}
size('one_offer_metadata',offer(1),'K401 alone.');
size('one_offer_bundle',{generated:{'quest.1':generated(1)},offers:{'offer.1':offer(1)}} ,'K400 frozen definition plus K401, no native progress copy.');
const before={generated:{},offers:{},outcomes:{}};
const logOnly={log:[]},safeCompact={log:[],terminalReceipts:{}};
for(let n=1;n<=1000;n++) {
  before.generated[`quest.${n}`]=generated(n);before.offers[`offer.${n}`]=offer(n,true);before.outcomes[`outcome.${n}`]=outcome(n);
  const line={at:n+60,text:`Repair offer ${n} expired without acceptance.`};logOnly.log.push(line);safeCompact.log.push(line);
  // Retain the durable K401 idempotence tuple and full Outcome, including refs.
  safeCompact.terminalReceipts[`offer.${n}`]={runId:'run.1',sourceReceiptId:`action.${n}`,templateId:'local.repair',issuerId:'example.issuer',questId:`quest.${n}`,outcome:outcome(n)};
}
size('expired_1000_before',before,'1000 unique unaccepted offers, definitions and terminal outcomes.');
size('expired_1000_log_only',logOnly,'Requested lower bound; loses receipt/observer/dedup facts, unsafe as sole archive.');
size('expired_1000_safe_compact',safeCompact,'Proposed compact tombstones plus log lines; retain identities and Outcomes. Assumes no live dependency needs discarded definition.');
size('one_run_segment',segment(1),'K412 with one outcome, ending, goal and carry row.');
const hall={schema:1,lives:{},traces:{},runs:{}};
for(let n=1;n<=100;n++) {
  const l=structuredClone(life),t=structuredClone(trace),s=segment(n);
  l.id=`life.${n}`;l.predecessorLifeId=n===1?null:`life.${n-1}`;l.identity.actorId=`example.person.${n}`;l.identity.bodyId=`example.body.${n}`;l.biographyRef.id=l.id;
  l.entry.selectionReceiptId=`selection.${n}`;l.entry.advanceReceiptId=`advance.${n}`;l.end={receiptId:`end.life.${n}`};
  t.id=`trace.life.${n}`;t.lifeId=l.id;t.endReceiptId=`end.life.${n}`;t.estateRef.id=`estate.life.${n}`;t.remains.bodyRef.id=l.identity.bodyId;
  hall.lives[l.id]=l;hall.traces[t.id]=t;
  hall.runs[`run.${n}`]={id:`run.${n}`,actorId:l.identity.actorId,status:'ended',startedAt:stamp((n-1)*1000),worldRefs:[worldRef],segments:[s],counterBaseline:{},legacy:false};
}
size('hall_100_lives',hall,'100 T22/T24 headers and K412 archived runs. Referenced biography/estate/advance/end/owner payloads excluded; history-only sizing, not exact resume.');
const ledger={schema:1,formulaVersion:'N5.alpha0.65.v1',cumulativeEffectiveDeeds:0,issuedCurrencyMicros:0,spentCurrencyMicros:0,remainderMicros:0,
  outcomeReceipts:{},deeds:{},parentBudgets:{},familyRepeatCounts:{},settlements:{},eligibleOptionIds:['boon.known'],ownedOptionIds:[],selectedOptionIds:[],committedBoonOffers:[],stream:{id:'prestige.boons',state:42}};
const kinds=['arc','arc','arc','arc','arc','arc','arc','arc','arc','ending','discovery','help'];
const weights=[4,6,10,4,6,10,4,6,10,40,4,2]; // 106 base deeds/cycle, not R7's 124-deed scenario.
for(let c=1;c<=10;c++) {
  const deedIds=[];const repeat=0.35+0.65/Math.sqrt(c);
  for(let j=0;j<12;j++) {
    const id=`deed.${c}.${j}`,oid=`outcome.${c}.${j}`,family=`family.${j}`,value=weights[j]*repeat;deedIds.push(id);
    ledger.deeds[id]={...structuredClone(shapes.K415.deed),id,runId:`run.${c}`,kind:kinds[j],occurrenceId:`episode.${c}.${j}`,evidenceRefs:[evidence(oid)],at:stamp(c*1000+j),quantity:weights[j],
      credited:{formulaVersion:ledger.formulaVersion,effectiveDeeds:value,familyId:family,repeatIndex:c,contribution:1,outcomeFraction:1}};
    ledger.outcomeReceipts[oid]={...outcome(c*12+j),id:oid,kind:'completed',subjectId:id};
    ledger.familyRepeatCounts[family]=c;ledger.cumulativeEffectiveDeeds+=value;
  }
  for(let a=0;a<3;a++)ledger.parentBudgets[`arc.${c}.${a}`]={budget:20,stageIds:deedIds.slice(a*3,a*3+3),shares:[0.2,0.3,0.5],repeatIndex:c,policyRevision:1};
  const entitled=10*((1+ledger.cumulativeEffectiveDeeds/20)**0.65-1),micros=entitled*1e6,issued=Math.floor(micros);
  ledger.settlements[`settlement.${c}`]={...structuredClone(shapes.K415.settlement),id:`settlement.${c}`,runId:`run.${c}`,nextRunId:`run.${c+1}`,deedIds,at:stamp(c*1000+12),
    issuance:{currencyMicros:issued-ledger.issuedCurrencyMicros,totalIssuedMicros:issued,formulaVersion:ledger.formulaVersion}};
  ledger.issuedCurrencyMicros=issued;ledger.remainderMicros=micros-issued;
  ledger.committedBoonOffers.push({id:`boon.draw.${c}`,seed:42+c,templateRevision:1,eligiblePoolRevision:c,optionIds:['boon.known'],selectedId:null});
}
size('deeds_after_10_prestiges',ledger,'120 deed/outcome pairs, 30 staged arcs, 12 repeated families, 10 settlements/draws. Proposed RN11/N20 extension; JS float size example, not numeric determinism proof.');
const base=createWorldInstance(GLASSHOUSE_DEFINITION,{id:FOLDED_GLASSHOUSE_IDS.instanceId,continuityId:'frontier.glasshouse.branch',eraId:'frontier.present',playedAt:0,parentInstanceId:'frontier.main',actorIds:[]});
const child=structuredClone(base);child.id='glasshouse.branch.1';child.continuityId='frontier.glasshouse.branch.1';child.revision++;
const siteId=Object.keys(child.sites)[0];child.sites[siteId].open=!child.sites[siteId].open;validateWorldInstance(child,GLASSHOUSE_DEFINITION);
const patches=Object.entries(child).filter(([k,v])=>JSON.stringify(v)!==JSON.stringify(base[k])).map(([k,value])=>({op:'replace',path:`/${k}`,value}));
const delta={schema:1,anchorRef:{id:'anchor.glasshouse.1',revision:1,digest:hash(JSON.stringify(base))},patches};
const restored=structuredClone(base);for(const p of patches)restored[p.path.slice(1)]=structuredClone(p.value);assert.deepEqual(restored,child);
size('current_world_instance',base,'Actual schema-1 constructor and revision-2 GLASSHOUSE_DEFINITION used in tests/realm_dormant_structured.test.js. Bounded workshop example, not representative whole-world inventory.');
size('branch_diff_payload',delta,'Replaces identity, revision and entire sites field. Requires retained base. No native bodies/jobs copied.');
size('branch_full_payload',child,'Same child state as diff, full world-instance JSON only.');
size('T25_branch_diff', {fork,payload:delta},'Same R5 fork header plus delta. References still require dependency closure.');
size('T25_branch_full', {fork,payload:child},'Same fork header plus full child.');
size('T25_diff_with_anchor',{fork,anchor:base,payload:delta},'Portable one-branch self-contained instance anchor plus delta; other promised native owners excluded.');
let fresh={status:'skipped',reason:'Run with --fresh to use existing isolated test helper.'};
if(process.argv.includes('--fresh')) {
  let game;
  try {
    const {cheatGame}=await import('../../../../../tests/helpers/cheat_game.mjs');game=await cheatGame();
    // Existing helper starts fresh on random localhost port/new browser context.
    const serialized=await game.page.evaluate(()=>globalThis.__cheatTest.create_save());
    assert.equal(typeof serialized,'string');assert.ok(serialized.length);
    const envelope=JSON.parse(serialized);const m=measureSaveSize(serialized);
    fresh={status:'measured',...m,exportBytes:Buffer.byteLength(encodeSaveFile(serialized),'utf8'),
      fieldCount:Object.keys(envelope).length,heroCreated:envelope.global_flags?.is_hero_created??null,pageErrors:game.errors};
    size('fresh_save',envelope,'Real create_save from existing helper, start none, fresh isolated origin; no private save.');
    const combined={...envelope,run_system:{schema:1,revision:1,nextId:1001,activeRunId:'run.101',generated:before.generated,offers:before.offers,outcomes:before.outcomes,runs:hall.runs,deeds:ledger.deeds,settlements:ledger.settlements},timeline_history:hall,prestige_ledger:ledger};
    // Deliberately duplicate sample ledgers here as a pessimistic integration stress,
    // not a recommended ownership model. Real budget also includes other origin keys.
    size('fresh_plus_pessimistic_samples',combined,'Synthetic stress with duplicate deed/run data; not an admitted save/schema.');
    fresh.guardedSingleKey=checkSaveSize(serialized,{key:'synthetic_save'});
    const {runs,...timelineHeaders}=hall;
    const {deeds,outcomeReceipts,settlements,...ledgerTotals}=ledger;
    function combinedUnique(offers) {return {...envelope,
      run_system:{schema:1,revision:1,nextId:1001,activeRunId:'run.101',...offers,runs,deeds,settlements},
      timeline_history:timelineHeaders,prestige_ledger:{...ledgerTotals,outcomeReceipts}};}
    const uniqueBefore=combinedUnique(before),uniqueAfter=combinedUnique(safeCompact);
    for(const [id,value] of [['fresh_plus_unique_uncompacted',uniqueBefore],['fresh_plus_unique_compacted',uniqueAfter]]) {
      size(id,value,'One owner per sample ledger/run; includes headers only, no referenced native archive payloads or other origin keys.');
      try {checkSaveSize(JSON.stringify(value),{key:'synthetic_save'});fresh[id+'Guard']='fits single key';}
      catch(e) {assert.equal(e.code,'SAVE_STORAGE_FULL');fresh[id+'Guard']=e.code;}
    }
    const afterText=JSON.stringify(uniqueAfter),backupStorage={length:1,key:()=> 'synthetic_backup',getItem:()=>afterText};
    try {fresh.compactedWithFullBackup=checkSaveSize(afterText,{storage:backupStorage,key:'synthetic_save'}).originStorageBytes;}
    catch(e) {fresh.compactedWithFullBackup=e.code;}
  } catch(e) {fresh={status:'unavailable',reason:e.message};}
  finally {await game?.close();}
}
const drift=[];for(const p of files)if(hash(await readFile(new URL(p,root)))!==sourceHashes[p])drift.push(p);
const output={measurementVersion:1,budgetStorageBytes:SAVE_STORAGE_BUDGET,
  method:'Minified JSON.stringify; UTF-16 storageBytes = JS string.length * 2 via current measureSaveSize. Does not include localStorage key/other entries unless explicitly noted.',
  assumptions:{offers:1000,offerTasks:1,lifeCount:100,prestigeCycles:10,deedsPerCycle:12,expiredCompaction:'only unaccepted terminal offers; full Outcomes and dedup identity retained in safe variant',branchChangedSites:1},
  rows,fresh,sourceHashes,sourceDriftDuringRun:drift,checks:['R5 JSON examples parsed','current world constructor validated','child validated','diff restores same child']};
await writeFile(new URL('OUTPUT.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));
