// Native Node-DOM proof through actual import, Beginning controls and save IO.
// Test inputs are genuinely earned private exports, never user play saves.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {boot,bundleGame} from './runner.mjs';
const root=resolve('.'),out=resolve(process.argv[2]||'work/su-intruder-native-20261126');
const E='book.su.lead.intruder',M=E+'.visitor',B='book.su.lead',sha=x=>createHash('sha256').update(x).digest('hex');
const inputs=[{kind:'fresh-earned',file:resolve('work/su-gray-terminal-visitor-20261126/fresh-arrival-export.txt'),idle:0},
 {kind:'inherited-roof',file:resolve('../OOPS-candidates/paradise-roof-20261126/private-fixtures/after-roof-export.txt'),idle:3}];
await fs.mkdir(out,{recursive:true});const results=[];
for(const input of inputs.filter(i=>!process.argv[3]||i.kind===process.argv[3]))for(const branch of ['source','distance'].filter(b=>!process.argv[4]||b===process.argv[4])){
 const encoded=await fs.readFile(input.file,'utf8');let game;
 try{
  game=await boot(null,{seed:9});await game.importFile(encoded);
  const snapshot=()=>game.snapshot(),state=()=>snapshot().expansion;
  const known=(name,actor='player')=>state().simulation.knowledge[actor]?.[E+'.'+name];
  const condition=name=>{const c=state().simulation.conditions[M]?.[E+'.'+name];return !!c&&(c.expiresAt==null||c.expiresAt>state().clock);};
  const original={clock:state().clock,body:structuredClone(state().simulation.people.player.body),
   deadline:state().simulation.situations[B+'.trial_time'].deadline,
   contentHash:snapshot().content_packs.structured.contentHash,snapshotHash:snapshot().content_packs.structured.snapshotHash,
   pins:structuredClone(snapshot().content_packs.structured.extensions)};
  assert.equal(state().simulation.people.player.location,B+'.roof.opening');
  assert.equal(state().simulation.people[M],undefined);assert.equal(known('identity'),undefined);
  if(input.idle)await game.step(input.idle);
  assert.equal(state().clock,original.clock+input.idle);
  assert.equal(state().simulation.people[M],undefined);
  await game.clickText('Beginning');await game.click(`[data-structured-extension="${E}"]`);
  const act=async name=>{const selector=`[data-structured-action="${E}.${name}"]`;if(game.hiddenReason(game.$(selector)))await game.clickText('Beginning');return game.click(selector);};
  await act('face');assert.equal(known('identity'),undefined);
  assert.equal(state().simulation.people[M].location,B+'.house');
  await game.save();await game.reload();await game.clickText('Beginning');
  assert.equal(known('identity'),undefined);assert.equal(Object.keys(state().simulation.people).filter(id=>id===M).length,1);
  await act('pause');await game.step(1);assert.equal(state().clock,original.clock+input.idle+1);
  assert.equal(state().simulation.people[M].location,B+'.house');assert.equal(known('identity'),undefined);
  const beforeChoice=await game.exportFile(),prefix=input.kind+'-'+branch;
  await fs.writeFile(join(out,prefix+'-before-choice-export.txt'),beforeChoice);
  if(input.kind==='fresh-earned'&&branch==='distance')await fs.writeFile(join(out,'fresh-before-choice-export.txt'),beforeChoice);
  const uninjured=structuredClone(state().simulation.people[M]);
  if(branch==='source'){await act('drop');await act('subdue_question');}else await act('speak_above');
  assert.equal(state().simulation.jobs.length,1);assert.equal(known('identity'),undefined);assert.equal(condition('winded'),false);
  const pending=structuredClone(state().simulation.jobs[0]);
  await game.save();await game.reload();await game.clickText('Beginning');
  assert.deepEqual(state().simulation.jobs[0],pending);
  const pendingExport=await game.exportFile();await fs.writeFile(join(out,prefix+'-pending-export.txt'),pendingExport);
  await game.importFile(pendingExport);await game.clickText('Beginning');
  assert.deepEqual(state().simulation.jobs[0],pending);assert.equal(known('identity'),undefined);
  await game.step(1);assert.equal(state().simulation.jobs.length,0);
  assert.ok(known('identity'));assert.equal(known('claim').basis.attributedTo,M);
  assert.deepEqual(state().simulation.people.player.body,original.body);
  assert.equal(state().simulation.situations[B+'.trial_time'].deadline,original.deadline);
  assert.equal(snapshot().content_packs.structured.contentHash,original.contentHash);
  assert.equal(snapshot().content_packs.structured.snapshotHash,original.snapshotHash);
  assert.deepEqual(snapshot().content_packs.structured.extensions.slice(0,original.pins.length),original.pins);
  assert.equal(state().simulation.party.includes(M),false);
  if(branch==='source'){
   assert.equal(state().simulation.people.player.location,B+'.house');
   assert.equal(condition('held'),true);assert.equal(condition('winded'),true);assert.equal(condition('shaken'),true);
   assert.equal(state().simulation.relationships[M].player.axes['tie.trust'],-1);
  }else{
   assert.equal(state().simulation.people.player.location,B+'.roof.opening');
   assert.deepEqual(state().simulation.people[M],uninjured);
   assert.equal(condition('held'),false);assert.equal(condition('winded'),false);
   assert.equal(state().simulation.relationships[M]?.player,undefined);
  }
  const selected=()=>({person:state().simulation.people[M],conditions:state().simulation.conditions[M],
   npcKnowledge:state().simulation.knowledge[M],playerIdentity:known('identity'),claim:known('claim'),
   relationship:state().simulation.relationships[M],clock:state().clock,deadline:state().simulation.situations[B+'.trial_time'].deadline});
  const final=structuredClone(selected());await game.save();await game.reload();assert.deepEqual(selected(),final);
  const finalExport=await game.exportFile();await fs.writeFile(join(out,prefix+'-final-export.txt'),finalExport);
  await game.importFile(finalExport);assert.deepEqual(selected(),final);
  results.push({inputKind:input.kind,inputSha256:sha(encoded),branch,originalClock:original.clock,idleMinutes:input.idle,
   finalClock:state().clock,deadline:original.deadline,sameBody:true,sameBaseAndOldPins:true,
   anonymousReloadBeforeChoice:true,pendingSaveReloadExportImport:true,finalSaveReloadExportImport:true,
   noDuplicatePerson:true,noRewardOrPartyGrant:true,beforeChoiceExport:join(out,prefix+'-before-choice-export.txt'),final});
 }catch(error){await fs.writeFile(join(out,'failure.json'),JSON.stringify({inputKind:input.kind,branch,error:error.stack},null,2)+'\n');throw error;
 }finally{await game?.close();}
}
const bundle=await bundleGame();
const report={schema:'su-intruder-native/1',date:'2026-11-26',runtime:'Native Node DOM; not a browser proof',
 headlessBundleSha256:sha(await fs.readFile(bundle)),sourceIdentity:'actual primary source at proof time; frozen by owning lane',
 sourceScope:'Qualified held English MTL ch3p51–74; authored distance/wait/release, minutes and RPG condition/trust values',
 results,desktopOwner:'Coordinator root'};
const reportName=process.argv[3]?`proof-${process.argv[3]}-${process.argv[4]}.json`:'proof.json';
await fs.writeFile(join(out,reportName),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({headlessBundleSha256:report.headlessBundleSha256,runs:results.length,output:out,results:results.map(r=>({inputKind:r.inputKind,branch:r.branch,originalClock:r.originalClock,finalClock:r.finalClock,deadline:r.deadline}))}));
