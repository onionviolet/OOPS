import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadNativePlayEvidence,loadNativePlayRecord,NATIVE_EVIDENCE_CARDS} from '../prototypes/world-atlas/atlas-native-evidence.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const changedOnAdoption=new Set(['fang-first-night','taylor-backpack-bus']);
async function fixture(t){const root=await mkdtemp(join(tmpdir(),'atlas-native-evidence-'));t.after(()=>rm(root,{recursive:true,force:true}));await mkdir(join(root,'dist'));return root;}
const raw=bundle=>({ok:true,bundleSha256:bundle,servedBundleSha256:bundle,results:[],errors:[],route:'C:/private/save.json',privateSave:{secret:'not public'}});
async function install(root,proof,{format='dice',evidenceDate}={}){const bytes=JSON.stringify(proof);await writeFile(join(root,'proof.json'),bytes);return [{id:'one',title:'One',pov:'Fixture',where:'Native route',setup:'Named fixture',outcome:'Played result',relatedHref:'#library/cheats/CTC64',receipts:[{id:'one',path:'proof.json',fingerprint:sha(bytes),format,scope:'One decision',...(evidenceDate?{evidenceDate}:{})}]}];}

test('actual twenty-one machine receipts and separate authored records retain distinct build, date and entry scopes',async()=>{
 const root=fileURLToPath(new URL('..',import.meta.url)),out=await loadNativePlayEvidence(root);
 assert.equal(out.entries.length,11);assert.equal(out.entries.flatMap(x=>x.receipts).length,21);
 assert.deepEqual(out.entries.filter(x=>x.status==='unavailable').map(x=>x.id),[...changedOnAdoption]);
 assert.ok(out.entries.filter(x=>changedOnAdoption.has(x.id)).every(x=>x.playStatus==='Partial'&&!x.outcome&&!x.playReceipt));
 const dice=out.entries.find(x=>x.id==='loaded-dice');assert.match(dice.setup,/without an extra starting point.*Desktop.*queued HIGH.*did not measure loot.*headless continuation.*source guard failed.*not a passed whole-run/);
 assert.match(dice.where,/Village elder.*equip his sword.*Infested field.*Retain insight.*True Appraisal followed by Loaded Dice/);
 const acquisition=dice.receipts.find(x=>x.id==='loaded-dice-acquisition'),use=dice.receipts.find(x=>x.id==='loaded-dice');assert.equal(acquisition.evidenceDate,'2026-11-25');assert.equal(acquisition.testedBundleSha256,'b691073af3c1a5a3c1ccf49171c4d97175873f992e4b7d00e8d6b1c05eca9d2a');assert.notEqual(acquisition.testedBundleSha256,use.testedBundleSha256);
 const desktop=dice.receipts.find(x=>x.id==='loaded-dice-earned-development');assert.equal(desktop.evidenceDate,'2026-11-26');assert.equal(desktop.testedBundleSha256,'efcf175d46efe11d641dfa8025dffd86bb271a0e2e7238090663f98b0266df54');assert.match(desktop.scope,/desktop development and queued HIGH, without a measured loot outcome/);
 const consumption=dice.receipts.find(x=>x.id==='loaded-dice-earned-consumption');assert.equal(consumption.evidenceDate,'2026-11-26');assert.equal(consumption.testedBundleSha256,'df6cfe6cfb58ba0ce6d598910f98cf906d1c8f476ceaf3c5913c724d52c1709f');assert.notEqual(consumption.testedBundleSha256,desktop.testedBundleSha256);assert.match(consumption.scope,/case assertions passed.*exit1.*not browser acceptance/);assert.match(use.scope,/held-card fixture/);
 assert.match(dice.outcome,/No-call\/LOW\/HIGH.*75\/70\/80.*26.*scraps with 35 integrity.*did not undo battle damage.*older held-card comparison separately/);
 const local=out.entries.find(x=>x.id==='tingen-local');assert.equal(local.receipts[0].testedBundleSha256,'d8152afb60928749285da28f088c1750ac0ef2c2ba7e4efd7a13ab1100bb3b89');assert.match(local.receipts[0].scope,/exit1/);
 const bakery=local.receipts.find(x=>x.id==='tingen-local-bakery-notice');assert.equal(bakery.evidenceDate,'2026-11-26');assert.equal(bakery.testedBundleSha256,'efcf175d46efe11d641dfa8025dffd86bb271a0e2e7238090663f98b0266df54');assert.ok(local.receipts.slice(0,2).every(x=>x.evidenceDate==='2026-11-25'));assert.ok(local.receipts.slice(2).every(x=>x.evidenceDate==='2026-11-26'));assert.match(bakery.scope,/persistent window/);
 const customer=local.receipts.find(x=>x.id==='tingen-local-bakery-customer'),arrival=local.receipts.find(x=>x.id==='tingen-local-customer-arrival');assert.equal(customer.testedBundleSha256,'5b3851783584e7e701ad867d680b9337868bb8dbba01de6499ce39b79f2fa6b0');assert.equal(arrival.testedBundleSha256,'5880e9e702fd5392eac9b7a80cd4f592d13d273efcb920cad21c510addd02617');assert.match(arrival.scope,/no answer or persistence replay/);
 assert.match(local.where,/paid flyer round.*spare notice.*Wendy at Sline Bakery.*09:15–09:25.*Municipal Square.*10:00.*Finish walking/);assert.match(local.setup,/authored continuations.*separate earned lives with different prior jobs.*same-state regression/);assert.match(local.outcome,/bakery Save\/reload kept the answer.*unposted life.*no circus question.*withheld dialogue and actions until the walk finished/);
 const klein=out.entries.find(x=>x.id==='tingen-klein');assert.match(klein.setup,/not a whole-campaign replay/);
 const market=klein.receipts.find(x=>x.id==='tingen-klein-direct-market');assert.equal(market.evidenceDate,'2026-11-26');assert.equal(market.testedBundleSha256,'c3b5b3dbdb71ab16e9d6577d997aef43343be902b3a0f32a087c513f83d5733e');
 const returned=klein.receipts.find(x=>x.id==='tingen-klein-market-return');assert.equal(returned.evidenceDate,'2026-11-26');assert.equal(returned.testedBundleSha256,'ab3094e7e5684929fa0951142b856d184335acb186eb3ce5942358ea072bd300');assert.notEqual(returned.testedBundleSha256,market.testedBundleSha256);
 assert.ok(klein.receipts.filter(x=>x!==market&&x!==returned).every(x=>x.evidenceDate==='2026-11-25'));
 assert.match(klein.where,/bakery.*straight to market.*original tent route.*return to the tent.*Decline/);assert.match(klein.outcome,/07:06.*07:08.*07:13.*07:17/);
 assert.match(klein.setup,/refunds after a completed sale were not tested/);assert.match(klein.outcome,/Stop before completion.*Purchase-state Save\/reload.*unavailable before the draw.*interrupted reading.*ready to unpack/);
 assert.doesNotMatch(klein.where+klein.setup+klein.outcome,/c3b5|ab3094|SHA|hash-linked/);
 for(const entry of out.entries)for(const receipt of entry.receipts)assert.equal(receipt.buildComparison,receipt.status!=='verified'||!out.currentBundleSha256?'unavailable':receipt.testedBundleSha256===out.currentBundleSha256?'exact':'different');
 assert.doesNotMatch(JSON.stringify(out),/privateSave|\.json|C:\/private|docs\/representations/);
});

test('earned consumption keeps guard rejection, actual headless identity and matched draw/cost boundaries',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/cheat-loaded-dice-normal-2026-11-25/earned-consumption-2026-11-26.json',import.meta.url),'utf8'));
 const options={format:'dice-earned-consumption',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 const valid=await loadNativePlayEvidence(root,{cards});assert.equal(valid.entries[0].status,'verified');assert.equal(valid.entries[0].receipts[0].testedBundleSha256,proof.headlessInitialBundleSha256);assert.notEqual(valid.entries[0].receipts[0].testedBundleSha256,proof.normalBundleSha256);
 for(const [label,change] of [
  ['unqualified pass',r=>{r.status='passed';}],['browser claim',r=>{r.browserUsed=true;}],['reference substituted for execution',r=>{r.headlessInitialBundleSha256=r.normalBundleSha256;}],
  ['unlinked HIGH export',r=>{r.results[2].sourceInputSha256=r.results[0].sourceInputSha256;}],['different target',r=>{r.results[1].firstDecision.key='another:specimen';}],
  ['free call',r=>{r.results[1].charges.used=0;}],['repaired damage',r=>{r.results[2].output.integrity=100;}],['better output claimed',r=>{r.results[2].output.quality=100;}],
  ['unequal work',r=>{r.results[0].fightTicks=9;}],['failed branch',r=>{r.results[1].errors=['failed'];}],
  ['missing relevant source comparison',r=>{r.sourceQualifications.relevantSourcesUnchanged=[];}],['undisclosed relevant drift',r=>{r.sourceQualifications.sourceDriftObservedAfterRun.push({file:'src/harvest.js'});}]
 ]){
  const invalid=structuredClone(proof);change(invalid);const definitions=await install(root,invalid,options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',label);assert.equal(out.entries[0].outcome,null);assert.equal(out.entries[0].receipts[0].testedBundleSha256,undefined);
 }
});

test('earned desktop evidence binds development cost and queued HIGH without inventing loot',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/cheat-loaded-dice-normal-2026-11-25/ordinary-acquisition-2026-11-26.json',import.meta.url),'utf8'));
 const options={format:'dice-earned-development',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].status,'verified');
 for(const patch of [
  {bundleSha256:sha('other build')},{inputSaveSha256:sha('unearned')},{exportSha256:sha('unlinked export')},
  {browser:{...proof.browser,unspentAfter:1}},{browser:{...proof.browser,card:'fate-ledger'}},
  {browser:{...proof.browser,direction:'low'}},{browser:{...proof.browser,chargesRemaining:2}},
  {browser:{...proof.browser,chargesUsed:0}},{browser:{...proof.browser,pendingValue:0}},{errors:['failed']}
 ]){
  const definitions=await install(root,{...proof,...patch},options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',JSON.stringify(patch));assert.equal(out.entries[0].outcome,null);
 }
});

test('Loaded Dice acquisition binds ordinary earned play separately from the held-card comparison',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/cheat-starting-insight-normal-2026-11-25/ordinary-proof.json',import.meta.url),'utf8'));
 const options={format:'dice-acquisition'},cards=await install(root,proof,options);
 assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].status,'verified');
 for(const patch of [
  {bundleSha256:sha('other build')},{ok:false},{errors:['failed']},{result:{...proof.result,choice:'extra-insight'}},
  {result:{...proof.result,earnedBeforeSpending:1}},{result:{...proof.result,facets:1}},
  {result:{...proof.result,ordinaryElderSword:false}},{result:{...proof.result,actualFieldFightTicks:0}},
  {result:{...proof.result,openingAndUsedSaveReloadExportFreshImport:false}}
 ]){
  const definitions=await install(root,{...proof,...patch},options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',JSON.stringify(patch));assert.equal(out.entries[0].outcome,null);
 }
});

test('bakery evidence binds independent access, paper provenance, no extra pay and kept window',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/lotm-tent-incident-2026-11-25/bakery-notice-browser.json',import.meta.url),'utf8'));
 const options={format:'bakery-notice',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 const valid=await loadNativePlayEvidence(root,{cards});assert.equal(valid.entries[0].status,'verified');assert.equal(valid.entries[0].receipts[0].testedBundleSha256,proof.bundleSha256);
 for(const patch of [
  {bundleSha256:sha('another build')},{paidStartSha256:sha('unearned work')},{independentStartSha256:proof.paidStartSha256},{date:'2026-11-25'},
  {paidRoute:{...proof.paidRoute,stoppedBeforePosting:false}},{paidRoute:{...proof.paidRoute,sparesCollected:2}},
  {paidRoute:{...proof.paidRoute,displayed:2}},{paidRoute:{...proof.paidRoute,loosePaper:1}},{paidRoute:{...proof.paidRoute,purseAfter:484}},
  {independentRoute:{...proof.independentRoute,postingOffered:true}},{independentRoute:{...proof.independentRoute,visitCompletedMinute:522}},
  {windowAfterReload:false},{windowAfterNativeImport:false},{errors:['failed']}
 ]){
  const definitions=await install(root,{...proof,...patch},options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',JSON.stringify(patch));assert.equal(out.entries[0].outcome,null);assert.equal(out.entries[0].receipts[0].testedBundleSha256,undefined);
 }
});

test('customer observations keep lived histories separate from controlled paper and untested arrival/import claims',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/lotm-tent-incident-2026-11-25/bakery-customer-observations-2026-11-26.json',import.meta.url),'utf8'));
 const options={format:'bakery-customer-observations',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].status,'verified');
 for(const [label,change] of [
  ['different input',r=>{r.away.posted.inputSha256=sha('other');}],['browser pair called controlled',r=>{r.away.comparison='same-state-controlled';}],
  ['control confused with browser',r=>{r.controlledRegression.separateFromBrowserLives=false;}],['old early offer called verified',r=>{r.limitations.preArrivalOfferTimingVerified=true;}],
  ['import invented',r=>{r.limitations.customerNativeImportVerified=true;}],['spent action remains',r=>{r.present.directionsActionsAfterAnswer=1;}],
  ['no-paper question invented',r=>{r.away.unposted.circusQuestion=true;}],['reload not retained',r=>{r.present.saveReload.spentActionAbsent=false;}]
 ]){
  const invalid=structuredClone(proof);change(invalid);const definitions=await install(root,invalid,options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',label);assert.equal(out.entries[0].outcome,null);
 }
 assert.doesNotMatch(JSON.stringify(proof),/C:\\|\/Users\/|\/private\/|"(?:inventories|simulation|actors|privateSave)"\s*:/);
});

test('corrected customer arrival is separately bound and cannot invent an answer or persistence replay',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/lotm-tent-incident-2026-11-25/bakery-customer-arrival-2026-11-26.json',import.meta.url),'utf8'));
 const options={format:'bakery-customer-arrival',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].status,'verified');
 for(const [label,change] of [
  ['old build substituted',r=>{r.bundleSha256='5b3851783584e7e701ad867d680b9337868bb8dbba01de6499ce39b79f2fa6b0';}],
  ['early dialogue',r=>{r.before.edwinDialogue=true;}],['early action',r=>{r.before.directionsActions=1;}],
  ['walk still pending',r=>{r.after.remainingWalkMinutes=1;}],['no action after arrival',r=>{r.after.directionsActions=0;}],
  ['answer invented',r=>{r.limitations.answerReplayed=true;}],['persistence invented',r=>{r.limitations.persistenceReplayed=true;}]
 ]){
  const invalid=structuredClone(proof);change(invalid);const definitions=await install(root,invalid,options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',label);assert.equal(out.entries[0].outcome,null);
 }
});

test('market-return evidence binds its separate build and completed-reading boundary',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/lotm-tent-incident-2026-11-25/market-return-browser.json',import.meta.url),'utf8'));
 const options={format:'market-return',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 const valid=await loadNativePlayEvidence(root,{cards});assert.equal(valid.entries[0].status,'verified');assert.equal(valid.entries[0].receipts[0].testedBundleSha256,proof.bundleSha256);
 for(const patch of [
  {bundleSha256:'c3b5b3dbdb71ab16e9d6577d997aef43343be902b3a0f32a087c513f83d5733e'},
  {checkpointSha256:sha('another checkpoint')},{date:'2026-11-25'},{openingMinute:519},{firstReadingStoppedMinute:520},
  {readingCompletedMinute:521},{replyCompletedMinute:526},{replyBeforeDraw:true},{replyAfterInterruptedReading:true},
  {replyAfterCompletedReading:false},{paidFee:1},{nextHouseholdTask:'Prepare the invocations'},{errors:['failed']}
 ]){
  const definitions=await install(root,{...proof,...patch},options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',JSON.stringify(patch));assert.equal(out.entries[0].outcome,null);assert.equal(out.entries[0].receipts[0].testedBundleSha256,undefined);
 }
});

test('direct-market evidence rejects hash-matched contradictions to its public route and persistence claims',async t=>{
 const root=await fixture(t),proof=JSON.parse(await readFile(new URL('../docs/representations/evidence/lotm-tent-incident-2026-11-25/market-direct-browser.json',import.meta.url),'utf8'));
 const options={format:'market-direct',evidenceDate:'2026-11-26'},cards=await install(root,proof,options);
 const valid=await loadNativePlayEvidence(root,{cards});assert.equal(valid.entries[0].status,'verified');assert.equal(valid.entries[0].receipts[0].evidenceDate,'2026-11-26');
 for(const patch of [
  {bundleSha256:sha('another build')},{postBreadSha256:sha('unearned checkpoint')},{date:'2026-11-25'},
  {marketMinute:429},{purchaseMinute:434},{unpackMinute:438},{moneyReserved:15},{moneyRefunded:15},{moneyAfter:1},
  {stock:{...proof.stock,muttonLb:0}},{directPurchases:2},{readingCompletions:1},{newCastKnowledge:['unobserved']},
  {saveReload:false},{fileExportImport:false},{afterUnpacking:'Later reading completed'},{errors:['failed']}
 ]){
  const definitions=await install(root,{...proof,...patch},options),out=await loadNativePlayEvidence(root,{cards:definitions});
  assert.equal(out.entries[0].status,'unavailable',JSON.stringify(patch));assert.equal(out.entries[0].outcome,null);assert.equal(out.entries[0].receipts[0].testedBundleSha256,undefined);
 }
});

test('same, different and unavailable checkout builds do not change played evidence',async t=>{
 const root=await fixture(t),bundle=sha('current');await writeFile(join(root,'dist/bundle.js'),'current');const cards=await install(root,raw(bundle));
 const exact=await loadNativePlayEvidence(root,{cards});assert.equal(exact.entries[0].receipts[0].buildComparison,'exact');assert.equal(exact.entries[0].outcome,'Played result');
 await writeFile(join(root,'dist/bundle.js'),'later');const later=await loadNativePlayEvidence(root,{cards});assert.equal(later.entries[0].receipts[0].buildComparison,'different');assert.equal(later.entries[0].outcome,'Played result');
 await rm(join(root,'dist/bundle.js'));const absent=await loadNativePlayEvidence(root,{cards});assert.equal(absent.currentBundleSha256,null);assert.equal(absent.entries[0].receipts[0].buildComparison,'unavailable');assert.equal(absent.entries[0].outcome,'Played result');
 assert.doesNotMatch(JSON.stringify(exact),/privateSave|secret|private\/save/);
});

test('changed or missing receipts withhold outcome without replacing registered identity',async t=>{
 const root=await fixture(t),cards=await install(root,raw(sha('bundle'))),expected=cards[0].receipts[0].fingerprint;
 await writeFile(join(root,'proof.json'),JSON.stringify({...raw(sha('bundle')),injected:'changed'}));const changed=await loadNativePlayEvidence(root,{cards});
 assert.equal(changed.entries[0].outcome,null);assert.equal(changed.entries[0].receipts[0].status,'changed');assert.equal(changed.entries[0].receipts[0].expectedSha256,expected);assert.equal(changed.entries[0].receipts[0].testedBundleSha256,undefined);
 await rm(join(root,'proof.json'));const missing=await loadNativePlayEvidence(root,{cards});assert.equal(missing.entries[0].receipts[0].status,'unavailable');assert.equal(missing.entries[0].outcome,null);
});

test('hash-matched errors, contradictory served builds and oversized proofs are refused',async t=>{
 const root=await fixture(t),h=sha('bundle');
 for(const invalid of [{...raw(h),errors:['failure']},{...raw(h),servedBundleSha256:sha('other')},{...raw(h),bundleSha256:'bad'}]){const cards=await install(root,invalid);const out=await loadNativePlayEvidence(root,{cards});assert.equal(out.entries[0].receipts[0].status,'unavailable');assert.equal(out.entries[0].outcome,null);}
 const cards=await install(root,{...raw(h),extra:'x'.repeat(65536)});assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].receipts[0].status,'unavailable');
});

test('loading is read-only and source locators stay in the server allowlist',async t=>{
 const root=await fixture(t),cards=await install(root,raw(sha('bundle'))),before=await readFile(join(root,'proof.json'));
 await loadNativePlayEvidence(root,{cards});assert.deepEqual(await readFile(join(root,'proof.json')),before);
 assert.ok(NATIVE_EVIDENCE_CARDS.flatMap(x=>x.receipts).every(x=>x.path.startsWith('docs/representations/evidence/')&&!x.path.includes('/private/')));
});


test('farm and Su Xiao cards keep execution scope separate from earned desktop continuations',async()=>{
 const out=await loadNativePlayEvidence(fileURLToPath(new URL('..',import.meta.url)));
 const farm=out.entries.find(x=>x.id==='farm-courtyard'),su=out.entries.find(x=>x.id==='su-xiao-recruitment');
 assert.match(farm.where,/Book the courtyard before harvesting.*household keep count.*reserve the next grain/);
 assert.match(farm.setup,/Fresh Village native controls.*desktop check imported.*earned stored-food checkpoint.*did not start fresh.*authored continuation/);
 assert.match(farm.outcome,/cancelling returned unserved food.*original carry-and-host.*Native Save\/reload.*Desktop at 1280/);
 assert.equal(farm.receipts[0].testedBundleSha256,'7bfb24cde35027e515ea30a019f975ef5bd4e78bc1fe3b8c96709011a6894cec');
 assert.equal(farm.receipts[1].testedBundleSha256,'71d4c2541833e955e0be8b5986c1c14229c0567f155f67f9a725a4372dec2c40');
 assert.match(su.where,/Beginning picker.*Su Xiao.*Confirm arrival.*treatment.*transfer/);
 assert.match(su.setup,/native opening began fresh.*desktop check reopened.*earned post-trial checkpoint.*did not replay recruitment/);
 assert.match(su.outcome,/4318 of 4320.*No completed mission, extraction or currency conversion/);
 assert.equal(su.receipts[0].testedBundleSha256,farm.receipts[0].testedBundleSha256);
 assert.equal(su.receipts[1].testedBundleSha256,'12d9760f32ceb47f1c15e040587350b892192baad778bb4112eea664913b2cc3');
 assert.deepEqual(out.entries.filter(x=>!['farm-courtyard','su-xiao-recruitment'].includes(x.id)).map(x=>x.id),['fang-first-night','ryan-wyvern-visit','taylor-backpack-bus','alden-bedside-choice','village-watch-relay','tingen-local','tingen-klein','starting-insight','loaded-dice']);
});

test('new receipt formats reject hash-matched wrong builds and unsupported outcomes',async t=>{
 const root=await fixture(t);
 for(const card of NATIVE_EVIDENCE_CARDS.filter(x=>['farm-courtyard','su-xiao-recruitment'].includes(x.id)))for(const def of card.receipts){
  const proof=JSON.parse(await readFile(new URL('../'+def.path,import.meta.url),'utf8'));
  const cards=await install(root,proof,{format:def.format,evidenceDate:def.evidenceDate});
  assert.equal((await loadNativePlayEvidence(root,{cards})).entries[0].status,'verified',def.id);
  const badBuild=structuredClone(proof),key=def.format==='farm-native'?'executedNativeBundle':def.format==='paradise-continuity'?'candidateBundleSha256':'bundleSha256';
  badBuild[key]=sha('different execution');
  let altered=await install(root,badBuild,{format:def.format});assert.equal((await loadNativePlayEvidence(root,{cards:altered})).entries[0].status,'unavailable',def.id+' build');
  const bad=structuredClone(proof);
  if(def.format==='farm-native')bad.results.find(x=>x.mode==='manual').cash=104;
  else if(def.format==='farm-desktop')bad.setup.outcomeEdited=true;
  else if(def.format==='paradise-opening')bad.observed.noCompletedMissionClaim=false;
  else bad.observed[2]='Trial restarted after loading';
  altered=await install(root,bad,{format:def.format});const rejected=await loadNativePlayEvidence(root,{cards:altered});assert.equal(rejected.entries[0].outcome,null,def.id+' outcome');
 }
});

test('changed and unavailable farm receipt withholds its outcome without changing other cards',async t=>{
 const root=await fixture(t);
 for(const card of NATIVE_EVIDENCE_CARDS)for(const def of card.receipts){
  await mkdir(join(root,...def.path.split('/').slice(0,-1)),{recursive:true});await writeFile(join(root,def.path),await readFile(new URL('../'+def.path,import.meta.url)));
 }
 for(const card of NATIVE_EVIDENCE_CARDS)for(const ref of card.references||[]){await mkdir(join(root,...ref.path.split('/').slice(0,-1)),{recursive:true});await writeFile(join(root,ref.path),await readFile(new URL('../'+ref.path,import.meta.url)));}
 await writeFile(join(root,'dist/bundle.js'),'a later checkout');
 const farm=NATIVE_EVIDENCE_CARDS.find(x=>x.id==='farm-courtyard'),target=join(root,farm.receipts[0].path);
 const baseline=(await loadNativePlayEvidence(root)).entries.filter(x=>x.id!==farm.id);
 for(const changed of [true,false]){
  if(changed)await writeFile(target,'{}');else await rm(target);
  const out=await loadNativePlayEvidence(root),entry=out.entries.find(x=>x.id===farm.id);
  assert.equal(entry.status,'unavailable');assert.equal(entry.outcome,null);assert.equal(entry.receipts[0].status,changed?'changed':'unavailable');assert.equal(entry.receipts[0].testedBundleSha256,undefined);
  assert.deepEqual(out.entries.filter(x=>x.id!==farm.id),baseline);
  assert.ok(out.entries.flatMap(x=>x.receipts).filter(x=>x.status==='verified').every(x=>x.buildComparison==='different'));
 }
 await rm(join(root,'dist/bundle.js'));const absent=await loadNativePlayEvidence(root);assert.equal(absent.currentBundleSha256,null);assert.ok(absent.entries.flatMap(x=>x.receipts).every(x=>x.buildComparison==='unavailable'));
});


test('Taylor and Alden keep changed native pins distinct from signed-off desktop records',async()=>{
 const out=await loadNativePlayEvidence(fileURLToPath(new URL('..',import.meta.url))),taylor=out.entries.find(x=>x.id==='taylor-backpack-bus'),alden=out.entries.find(x=>x.id==='alden-bedside-choice');
 assert.equal(taylor.status,'unavailable');assert.equal(taylor.playStatus,'Partial');assert.equal(taylor.receipts.length,2);assert.ok(taylor.receipts.every(x=>x.status==='changed'));
 assert.match(taylor.setup,/fresh route.*without a supplied save.*separate native route.*earned corridor.*earlier held-bag.*not relabeled/i);assert.match(taylor.where,/leave it at school.*return bus/);assert.equal(taylor.outcome,null);
 assert.equal(alden.status,'documented');assert.equal(alden.evidenceKind,'authored-record');assert.deepEqual(alden.receipts,[]);assert.equal(alden.references[0].status,'verified');assert.equal(alden.references[0].testedBundleSha256,undefined);
 assert.equal(alden.playStatus,'Playable');assert.equal(alden.playReceipt.life,'Alden Thorn');assert.match(alden.playReceipt.action,/refuse/);
 assert.match(alden.setup,/not a registered machine-readable native receipt.*c7a58589.*Later.*8a430b38.*does not re-test/);assert.match(alden.outcome,/desktop refusal.*downstairs.*separately support admission.*not claimed as a desktop replay/);
 assert.doesNotMatch(JSON.stringify({taylor,alden}),/C:\\|\/private\/|\"(?:inventory|simulation|actors|privateSave)\"\s*:/);
});

test('Taylor machine receipts reject wrong builds, unearned lineage and invented bag outcomes',async t=>{
 const root=await fixture(t),card=NATIVE_EVIDENCE_CARDS.find(x=>x.id==='taylor-backpack-bus');
 for(const def of card.receipts){const raw=JSON.parse(await readFile(new URL('../'+def.path,import.meta.url),'utf8'));
  for(const change of [r=>{r.bundleSha256=sha('other build');},r=>{r.errors=['failed'];},r=>{if(r.results)r.results.bagCount=2;else r.setup='held bag fixture';},r=>{if(r.results)r.inputSha256=sha('unearned');else r.steps=[];}]){
   const bad=structuredClone(raw);change(bad);const cards=await install(root,bad,{format:def.format});const out=await loadNativePlayEvidence(root,{cards});assert.equal(out.entries[0].status,'unavailable');assert.equal(out.entries[0].outcome,null);
  }
 }
});

test('authored record links are hash checked, expose no raw prose, and fail without inventing a native build',async t=>{
 const root=await fixture(t),alden=NATIVE_EVIDENCE_CARDS.find(x=>x.id==='alden-bedside-choice'),ref=alden.references[0],path=join(root,ref.path);await mkdir(join(root,...ref.path.split('/').slice(0,-1)),{recursive:true});await writeFile(path,await readFile(new URL('../'+ref.path,import.meta.url)));
 const valid=await loadNativePlayEvidence(root,{cards:[alden]});assert.equal(valid.entries[0].status,'documented');assert.equal(valid.entries[0].references[0].href,'/native-play-record/alden');assert.equal(valid.entries[0].references[0].path,undefined);assert.doesNotMatch(JSON.stringify(valid),/Wummy|paragraph|pre-copy-native-export/);
 await writeFile(path,'changed record');let out=await loadNativePlayEvidence(root,{cards:[alden]});assert.equal(out.entries[0].status,'unavailable');assert.equal(out.entries[0].outcome,null);assert.equal(out.entries[0].references[0].status,'changed');
 await rm(path);out=await loadNativePlayEvidence(root,{cards:[alden]});assert.equal(out.entries[0].references[0].status,'unavailable');assert.equal(out.entries[0].receipts.length,0);
});

test('named world links focus the right evidence card and authored records have their own UI label',async()=>{
 const [{NATIVE_WORLD_ENTRIES},index,view,serve]=await Promise.all([import('../prototypes/world-atlas/world-entry-inventory.mjs'),readFile(new URL('../prototypes/world-atlas/index.html',import.meta.url),'utf8'),readFile(new URL('../prototypes/world-atlas/atlas-native-evidence-view.mjs',import.meta.url),'utf8'),readFile(new URL('../prototypes/world-atlas/serve.mjs',import.meta.url),'utf8')]);
 for(const[id,card]of[['worm','taylor-backpack-bus'],['sup','alden-bedside-choice'],['pr','ryan-wyvern-visit'],['ri','fang-first-night']])assert.equal(NATIVE_WORLD_ENTRIES.find(x=>x.id===id).evidenceHref,'#workbench/play-evidence/'+card);
 assert.match(index,/if\(w.nativeEntry\?\.evidenceHref\)side.append\(worldEvidenceLink/);assert.match(view,/No machine-readable native playtest receipt is registered/);assert.match(view,/reference.status==='verified'.*a.href=reference.href/);
 assert.match(serve,/'\/native-play-record\/taylor'/);assert.match(serve,/'\/native-play-record\/alden'/);
});


test('direct public-record HTTP endpoints return only scoped projections, never source Markdown or private paths',async t=>{
 const {createServer}=await import('node:http'),root=fileURLToPath(new URL('..',import.meta.url));
 const server=createServer(async(req,res)=>{try{const record=await loadNativePlayRecord(root,req.url);res.writeHead(record?200:404,{'Content-Type':'application/json'}).end(JSON.stringify(record));}catch{res.writeHead(500).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 for(const[route,id]of[['taylor','taylor-backpack-bus'],['alden','alden-bedside-choice'],['ryan','ryan-wyvern-visit'],['fang','fang-first-night']]){
  const response=await fetch('http://127.0.0.1:'+server.address().port+'/native-play-record/'+route),body=await response.text();assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/json/);const record=JSON.parse(body);assert.equal(record.schema,'atlas-native-play-record/1');assert.equal(record.id,id);assert.equal(Boolean(record.outcome),!changedOnAdoption.has(id));assert.equal(record.references[0].path,undefined);
  assert.doesNotMatch(body,/C:\\|\/Users\/|\/private\/|SSH alias|shard_|pre-copy-native-export|work\/|\.epub\b/i);
  assert.doesNotMatch(body,/# Agent|## Reading and source qualification|Paragraphs|Source Library short identity/);
 }
 assert.equal((await fetch('http://127.0.0.1:'+server.address().port+'/native-play-record/../../docs')).status,404);
 const serve=await readFile(new URL('../prototypes/world-atlas/serve.mjs',import.meta.url),'utf8');assert.match(serve,/await loadNativePlayRecord/);assert.doesNotMatch(serve,/'\/native-play-record\/(?:taylor|alden)':\[/);
});


test('direct world and world-items URLs render one named play link above replaceable content; overview has none',async()=>{
 const [{NATIVE_WORLD_ENTRIES},{createDom},index]=await Promise.all([import('../prototypes/world-atlas/world-entry-inventory.mjs'),import('../scripts/headless/dom.mjs'),readFile(new URL('../prototypes/world-atlas/index.html',import.meta.url),'utf8')]);
 const routeSource='function route(){'+index.match(/function route\(\)\{([\s\S]*?)\r?\n}\r?\nconst trail/)[1]+'\n}',showSource=index.slice(index.indexOf('function showPage(){'),index.indexOf('\nfunction worldView')),linkSource=index.match(/function worldEvidenceLink\(entry\)\{[^\n]+/)[0];
 for(const hash of ['#world/worm','#world/worm/things','#world/sup','#world/sup/things','#world/pr','#world/pr/things','#world/ri','#world/ri/things','#worlds']){
  const {document}=createDom(),el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;},nav=el('nav'),trail=el('section'),main=el('main');
  const worldById=new Map(NATIVE_WORLD_ENTRIES.map(e=>[e.id,{id:e.id,label:e.label,views:['things','making','reading'],nativeEntry:e}])),SECTIONS=[{id:'worlds',label:'Worlds'}],location={hash};
  const route=Function('location','worldById','LEGACY','SECTIONS','history',routeSource+';return route();')(location,worldById,{},SECTIONS,{replaceState(){}});
  const scope={route:()=>route,nav,trail,main,el,SECTIONS,VIEW_LABELS:{things:'Items and materials',making:'Making',reading:'Reading'},crumb:(label)=>el('button',label),button:(label)=>el('button',label),go(){},data:{},controls(){},finder(){},listOf(){},routeButtons(){},closeCanvas(){},atlasFindView(){},nativePlayEvidenceView(){},worldView(){main.replaceChildren(el('article','Items and materials'));},worldsIndex(){}};
  scope.worldEvidenceLink=Function('el',linkSource+';return worldEvidenceLink;')(el);
  Function(...Object.keys(scope),showSource+';showPage();')(...Object.values(scope));
  const links=trail.querySelectorAll('a');assert.equal(links.length,hash==='#worlds'?0:1,hash);
  if(route.world){assert.equal(links[0].href,route.world.nativeEntry.evidenceHref);assert.equal(links[0].textContent,route.world.nativeEntry.evidenceLabel);assert.match(links[0].textContent,/playable choices and evidence/);assert.equal(main.textContent,'Items and materials');}
 }
});
