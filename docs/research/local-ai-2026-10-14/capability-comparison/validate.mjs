import fs from 'node:fs';
import {validateDraft, compileDraft} from '../../../../src/authored_site.js';
const p=new URL('./results.json',import.meta.url), records=JSON.parse(fs.readFileSync(p));
const checks=records.filter(x=>x.case==='site').map(x=>{try {const d=validateDraft(JSON.parse(x.answer));const pack=compileDraft(d);return {model:x.model,seed:x.seed,valid:true,closedNumbersMatch:JSON.stringify([d.inputStart,d.requiredInput,d.inputCost,d.minutes,d.outputGain,d.coinPay,d.gatherMinutes,d.gatherAmount])===JSON.stringify([6,3,3,30,1,8,20,2]),materialsMatch:d.inputName==='Reeds'&&d.outputName==='Mats',activities:pack.activities.length};}catch(e){return {model:x.model,seed:x.seed,valid:false,error:e.message};}});
fs.writeFileSync(new URL('./validator-results.json',import.meta.url),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
