import fs from 'node:fs';
import {compileDraft,exportAuthoredFile,AUTHORED_WORK_ID,AUTHORED_GATHER_ID} from '../../../../src/authored_site.js';
import {emptyPackState,enterPack,actPack,advancePackSettlement} from '../../../../src/content_packs.js';
const P=new URL('./',import.meta.url),O=new URL('file:///Users/weiwei/Documents/Codex/2026-10-14/weibao-explicitly-requested-a-new-chat/outputs/');
const records=JSON.parse(fs.readFileSync(new URL('revision-results.json',P))),ledger=[];
for(const r of records){const x=JSON.parse(r.answer),reviewed=structuredClone(x),changes=[];
 const set=(path,value)=>{const parts=path.split('.');let o=reviewed;for(const k of parts.slice(0,-1))o=o[k];const k=parts.at(-1);if(JSON.stringify(o[k])!==JSON.stringify(value)){changes.push({path,before:o[k],after:value});o[k]=value;}};
 set('witness.sequence',['gather','gather','work','work','work']);set('witness.inputRemaining',1);set('witness.minutes',130);
 if(/enough/i.test(reviewed.publicLine))set('publicLine','I can gather reeds and weave mats for the ferry, though I do not know how that stone gate opens.');
 const d=compileDraft(reviewed.draft),definitions=new Map([[d.id,d]]);let state=enterPack(emptyPackState(),d),coins=0,minutes=0;const trace=[];
 for(const step of reviewed.witness.sequence){const id=step==='gather'?AUTHORED_GATHER_ID:AUTHORED_WORK_ID,a=d.activities.find(x=>x.id===id);state=actPack(state,d,id);const s=advancePackSettlement(state,definitions,a.duration);state=s.state;coins+=s.pay;minutes+=a.duration;trace.push({step,minutes,coins,values:state.packs[d.id].values});}
 const values=state.packs[d.id].values,passed=values.input===1&&values.output===3&&coins===24&&minutes===130;
 if(!passed)throw Error('Reviewed source trace failed');
 const slug=r.model.replaceAll('/','_').replaceAll(':','_');fs.writeFileSync(new URL('reviewed-'+slug+'.json',P),JSON.stringify({reviewed,changes,trace},null,2));fs.writeFileSync(new URL('Duskfen_Reviewed_'+slug+'.json',O),exportAuthoredFile(reviewed.draft));
 ledger.push({model:r.model,phase:'explicit-contract revised source task',fieldEdits:changes.length,changes,sourceTracePass:passed,nativeBrowserVerified:false,humanEditingMinutes:null});
}
fs.writeFileSync(new URL('repair-ledger.json',P),JSON.stringify(ledger,null,2));console.log(JSON.stringify(ledger));
