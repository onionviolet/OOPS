import fs from 'node:fs';
import {validateDraft,compileDraft,AUTHORED_WORK_ID,AUTHORED_GATHER_ID,AUTHORED_PACK_ID,exportAuthoredFile,parseAuthoredFile} from '../../../../src/authored_site.js';
import {emptyPackState,enterPack,actPack,advancePackSettlement,packSaveState,preparePackSave} from '../../../../src/content_packs.js';
const P=new URL('./',import.meta.url), records=[...JSON.parse(fs.readFileSync(new URL('results.json',P))),...(fs.existsSync(new URL('revision-results.json',P))?JSON.parse(fs.readFileSync(new URL('revision-results.json',P))):[])],checks=[];
for(const r of records.filter(r=>['site','source_to_slice','source_to_slice_revised'].includes(r.case))){
 const c={model:r.model,case:r.case};
 try {
  const x=JSON.parse(r.answer),draft=validateDraft(r.case==='site'?x:x.draft),d=compileDraft(draft);c.valid=true;
  c.exactNumbers=JSON.stringify([draft.inputStart,draft.requiredInput,draft.inputCost,draft.minutes,draft.outputGain,draft.coinPay,draft.gatherMinutes,draft.gatherAmount])===JSON.stringify([6,3,3,30,1,8,20,2]);
  c.draftTextRoundTrip=JSON.stringify(parseAuthoredFile(exportAuthoredFile(draft)))===JSON.stringify(draft);
  if(r.case.startsWith('source_to_slice')){
   let state=enterPack(emptyPackState(),d),coins=0,minutes=0;const definitions=new Map([[d.id,d]]),trace=[];
   for(const step of x.witness.sequence){const id=step==='gather'?AUTHORED_GATHER_ID:AUTHORED_WORK_ID,a=d.activities.find(a=>a.id===id);state=actPack(state,d,id);const s=advancePackSettlement(state,definitions,a.duration);state=s.state;coins+=s.pay;minutes+=a.duration;trace.push({step,minutes,coins,values:state.packs[d.id].values});}
   const values=state.packs[d.id].values;c.actual={inputRemaining:values.input,mats:values.output,coins,minutes};c.witnessMatches=JSON.stringify(c.actual)===JSON.stringify({inputRemaining:x.witness.inputRemaining,mats:x.witness.mats,coins:x.witness.coins,minutes:x.witness.minutes});c.minimumWitness=c.actual.mats===3&&minutes===130&&coins===24&&values.input===1;
   const saved=packSaveState(state,definitions),restored=preparePackSave({content_packs:JSON.parse(JSON.stringify(saved))},definitions);c.sourceStateRoundTrip=JSON.stringify(saved)===JSON.stringify(restored.content_packs);c.rumorLabel=x.claims.some(c=>c.source==='S4'&&c.status==='unverified_rumor');c.publicSecretLeak=/salt\s*water|saline|brine|salted water/i.test(x.publicLine);c.trace=trace;
   fs.writeFileSync(new URL('world-'+r.model.replaceAll('/','_').replaceAll(':','_')+'-'+r.case+'.json',P),JSON.stringify({generated:x,compiled:d,sourceTrace:trace},null,2));
  }
 }catch(e){c.valid=false;c.error=e.message;}
 checks.push(c);
}
fs.writeFileSync(new URL('validation.json',P),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
