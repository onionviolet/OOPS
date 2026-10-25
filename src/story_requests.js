import {natural as nat} from './basics.js';
import {addSavedPurse} from './money.js';
import {VILLAGE_ASKS,validateVillageGoal} from './village_traveler_asks.js';
import {readMaterialLineage} from './material_lineage.js';
import {heirloomKey} from './heirloom_items.js';
import {appendStoryOutcome,queryStoryOutcomes,validateLoreHistory} from './lore_history_state.js';
export const LEGACY_REQUEST_CONTRACT=Object.freeze({revision:1,place:'Village',routes:['take','deliver','decline'],items:['Stale bread','Rat pelt','Rat tail'],expiry:'played-time defer; no absence penalty'});
export const REQUEST_CONTRACT=Object.freeze({...LEGACY_REQUEST_CONTRACT,revision:2,items:[...new Set(Object.values(VILLAGE_ASKS).flat().map(a=>a.item))]});
const check=(ok,text='Invalid remembered request.')=>{if(!ok)throw Error(text);};
const pending=r=>['offered','accepted'].includes(r.status);
const UNIQUE_NOUNS=['lantern','signet ring','travel flute','map case','brass compass','wedding comb'];
export {heirloomKey};
const UNIQUE_STATES=['extant','lost','delivered','gone'];
function validateUnique(r,p,expansion) {
 const u=r.unique;
 check(u&&typeof u.uid==='string'&&typeof u.name==='string'&&UNIQUE_STATES.includes(u.state)&&[null,'early'].includes(u.credit)&&[null,'lost','stolen','destroyed'].includes(u.cause)&&nat(u.reclaims));
 check(u.key===heirloomKey({uid:u.uid,name:u.name,born:r.at})&&readMaterialLineage(u.key)&&r.item===u.name&&u.uid===`${p.id}:${r.id}`);
 check(r.needRef===`unique:${p.id}:${u.uid}`&&r.quantity===1&&r.needRevision===1&&nat(r.reward)&&r.reward>0&&nat(r.held)&&r.held===(pending(r)?r.reward:0));
 check(['offered','accepted','delivered','declined','failed'].includes(r.status)&&nat(r.at)&&(!expansion||r.at<=expansion.clock)&&r.expiryPolicy===REQUEST_CONTRACT.expiry);
 check((u.state==='delivered')===(r.status==='delivered')&&(u.state==='gone')===(r.status==='failed')&&(u.state!=='lost'||pending(r)&&['lost','stolen'].includes(u.cause)));
 check(pending(r)?r.receiptId===null:typeof r.receiptId==='string');
 if(expansion&&!pending(r)) {
  const receipt=queryStoryOutcomes(expansion,{id:r.receiptId})[0];
  check(receipt&&receipt.issuer===p.id&&receipt.targetObject===r.item&&receipt.result===r.status&&receipt.causeRefs.includes(r.id));
  if(expansion.loreHistory.consumerPins!=null)check(expansion.loreHistory.consumerPins[`p4.request:${r.id}`]?.includes(r.receiptId));
 }
}
export function validateStoryRequests(people,expansion=null) {
 const s=people?.storyRequests;if(s==null)return;
 check(s.schema===1&&s.enabled===true&&nat(s.nextId)&&s.nextId>0&&Array.isArray(s.requests)&&s.requests.length<=16);
 const ids=new Set(),needs=new Set();
 for(const r of s.requests) {
  const p=people.people.find(p=>p.id===r.issuer),revision=people.generationRevision??1,quantity=revision===1?1:p?.goal.quantity;
  if(r.kind==='unique') {check(p&&p.met&&typeof r.id==='string'&&!ids.has(r.id)&&r.id.startsWith('request:')&&r.revision===revision);ids.add(r.id);if(pending(r)){check(!needs.has(r.needRef));needs.add(r.needRef);}validateUnique(r,p,expansion);continue;}
  check(p&&p.met&&typeof r.id==='string'&&!ids.has(r.id)&&r.id.startsWith('request:')&&r.revision===revision&&r.needRef===`supply:${p.id}:${r.item}`);ids.add(r.id);if(pending(r)){check(!needs.has(r.needRef));needs.add(r.needRef);}
  check(r.needRevision===(revision===1?1:p.goal.needRevision)&&r.quantity===quantity&&(revision===1||validateVillageGoal(p.goal,p.templateId))&&r.item===p.goal.item&&(revision===1?LEGACY_REQUEST_CONTRACT:REQUEST_CONTRACT).items.includes(r.item)&&(revision===1||r.grade===p.goal.grade)&&r.reward===p.goal.reward&&nat(r.held)&&r.held===(pending(r)?r.reward:0));
  check(['offered','accepted','delivered','declined'].includes(r.status)&&nat(r.at)&&(!expansion||r.at<=expansion.clock)&&r.expiryPolicy===REQUEST_CONTRACT.expiry);
  check(!pending(r)||!p.goal.fulfilled&&!(p.possessions.supplies[r.item]||0));
  check(r.status!=='delivered'||p.goal.fulfilled&&p.possessions.supplies[r.item]===quantity);
  check(pending(r)?r.receiptId===null:typeof r.receiptId==='string');
  if(expansion&&!pending(r)) {
   const receipt=queryStoryOutcomes(expansion,{id:r.receiptId})[0];
   check(receipt&&receipt.issuer===p.id&&receipt.targetObject===r.item&&receipt.result===r.status&&receipt.causeRefs.includes(r.id));
   if(expansion.loreHistory.consumerPins!=null)check(expansion.loreHistory.consumerPins[`p4.request:${r.id}`]?.includes(r.receiptId));
  }
 }
 if(expansion)validateLoreHistory(expansion);
}
export function salientRequestPerson(people,expansion) {
 if(!people?.storyRequests)return null;
 return people.people.filter(p=>p.met&&p.status!=='on_road'&&p.arrivedAt<=people.lastMinute&&!p.goal.fulfilled&&!(p.possessions.supplies[p.goal.item]||0)&&p.possessions.coins>=p.goal.reward&&!people.storyRequests.requests.some(r=>r.issuer===p.id&&pending(r)))
 .map(p=>({p,score:queryStoryOutcomes(expansion,{targetPerson:p.id}).filter(r=>r.audience.includes('player')).length}))
 .sort((a,b)=>b.score-a.score||a.p.id.localeCompare(b.p.id))[0]?.p||null;
}
// One detached full envelope: P4 keeps person stock/purse and reservation;
// D8 stores actual history. Native publication occurs only after durable saving.
export function planStoryRequest(envelope,{action,id=null,itemKey=null,cause=null,expectedSequence=envelope.expansion?.sequence}) {
 const save=structuredClone(envelope),s=save.generated_people,state=save.expansion;
 check(s&&state&&state.sequence===expectedSequence,'This request changed. Read the current terms again.');validateStoryRequests(s,state);
 check(save['current location']==='Village'&&state.actors.player.worldId==='base.frontier','Meet the traveler in Village.');
 let reward=0,supplyKey=null,mintKey=null,cost=0;
 if(action==='enable') {
  check(!s.storyRequests,'Remembered requests are already enabled.');
  check(state.actors.player.facts['storylets.enabled']===true,'Begin Village encounters after speaking to the elder first.');
  s.storyRequests={schema:1,enabled:true,nextId:1,requests:[]};
 } else if(action==='raise'||action==='raise_unique') {
  check(s.storyRequests);
  if(s.storyRequests.requests.length>=16){const retired=s.storyRequests.requests.findIndex(r=>!pending(r));check(retired>=0,'Finish an active request before admitting another.');const [old]=s.storyRequests.requests.splice(retired,1);if(state.loreHistory?.consumerPins)delete state.loreHistory.consumerPins[`p4.request:${old.id}`];}
  if(action==='raise_unique') {
   const fee=p=>(p.goal?.reward??0)*2||4,p=s.people.filter(p=>p.met&&p.status!=='on_road'&&p.arrivedAt<=s.lastMinute&&p.possessions.coins>=fee(p)&&!s.storyRequests.requests.some(r=>r.issuer===p.id&&pending(r))).sort((a,b)=>a.id.localeCompare(b.id))[0];
   check(p,'Meet a traveler with a funded fee and no open request.');
   const reward=fee(p),n=s.storyRequests.nextId++,id=`request:${n}`,name=`${p.name}'s ${UNIQUE_NOUNS[n%UNIQUE_NOUNS.length]}`,uid=`${p.id}:${id}`;
   p.possessions.coins-=reward;
   s.storyRequests.requests.push({id,revision:s.generationRevision??1,kind:'unique',issuer:p.id,needRef:`unique:${p.id}:${uid}`,needRevision:1,item:name,quantity:1,reward,held:reward,at:state.clock,status:'offered',expiryPolicy:REQUEST_CONTRACT.expiry,receiptId:null,unique:{uid,name,key:heirloomKey({uid,name,born:state.clock}),state:'extant',credit:null,cause:null,reclaims:0}});
  } else {
  const p=salientRequestPerson(s,state);check(p,'Meet a traveler with an unmet supply need and a funded fee.');
  p.possessions.coins-=p.goal.reward;
  s.storyRequests.requests.push({id:`request:${s.storyRequests.nextId++}`,revision:s.generationRevision??1,issuer:p.id,needRef:`supply:${p.id}:${p.goal.item}`,needRevision:p.goal.needRevision??1,item:p.goal.item,quantity:p.goal.quantity??1,...((s.generationRevision??1)===2?{grade:p.goal.grade}: {}),reward:p.goal.reward,held:p.goal.reward,at:state.clock,status:'offered',expiryPolicy:REQUEST_CONTRACT.expiry,receiptId:null});
  }
 } else {
  const r=s.storyRequests?.requests.find(r=>r.id===id),p=s.people.find(p=>p.id===r?.issuer);
  check(r&&p&&pending(r),'This request has already settled or is unavailable.');check(p.status!=='on_road'&&p.arrivedAt<=s.lastMinute,'Wait for this traveler to return. The reserved fee stays safe.');
  const u=r.kind==='unique'?r.unique:null,stock=save.inventories?.person?.main_character,held=u?(stock?.[u.key]?.count||0):0;
  check(u||action!=='lose'&&action!=='reclaim'&&action!=='abandon','Only a named-object request can do that.');
  check(u||(!p.goal.fulfilled&&!(p.possessions.supplies[r.item]||0)),'This supply need changed.');
  if(action==='take'){check(r.status==='offered');r.status='accepted';if(u&&held>0)u.credit='early';}
  else if(action==='lose'&&cause!=='destroyed') {
   check(['lost','stolen'].includes(cause),'Say whether it was lost, stolen or destroyed.');check(held===0,'You still hold it.');
   u.cause=cause;u.state='lost';
  } else if(action==='reclaim') {
   check(r.status==='accepted'&&u.state==='lost'&&held===0,'Nothing to reclaim.');cost=Math.max(1,Math.ceil(r.reward/4));check(save.character.money>=cost,`Reclaiming costs ${cost} wood coins.`);
   addSavedPurse(save,-cost,'story request: reclaim');(save.inventories.person.main_character||={})[u.key]={count:1};mintKey=u.key;u.state='extant';u.cause=null;u.reclaims++;
  } else {
   check(['deliver','decline','abandon','lose'].includes(action));
   const fails=action==='abandon'||action==='lose';
   if(action==='abandon')check(u.state==='lost','Only a lost object can be given up.');
   if(action==='lose')check(held===0,'You still hold it.');
   if(fails){u.state='gone';u.cause=action==='lose'?'destroyed':u.cause;}
   if(action==='deliver'&&u) {
    check(r.status==='accepted','Take the request before delivering.');
    check(itemKey===u.key&&held>=1,'Bring the named object itself.');
    stock[u.key].count-=1;if(stock[u.key].count===0)delete stock[u.key];
    supplyKey=u.key;reward=r.held;addSavedPurse(save,reward,'story request: deliver');r.status='delivered';u.state='delivered';
   } else if(action==='deliver') {
    check(r.status==='accepted','Take the request before delivering.');
    check(itemKey===JSON.stringify({id:r.item}),'Bring the requested ordinary supply.');
    const stock=save.inventories?.person?.main_character;check(stock?.[itemKey]?.count>=r.quantity,`Bring ${r.quantity===1?'one':r.quantity} ${r.item} from your own inventory.`);
    stock[itemKey].count-=r.quantity;if(stock[itemKey].count===0)delete stock[itemKey];
    p.possessions.supplies[r.item]=r.quantity;p.goal.fulfilled=true;p.relationship='helped with supplies';reward=r.held;supplyKey=itemKey;addSavedPurse(save,reward,'story request: deliver');r.status='delivered';
   } else {p.possessions.coins+=r.held;r.status=fails?'failed':'declined';}
   const fee=r.held;r.held=0;
   const receipt=appendStoryOutcome(state,{operation:`${r.id}:settled`,worldId:'base.frontier',actor:'player',issuer:p.id,targetPerson:p.id,targetObject:r.item,targetPlace:'Village',action:action==='deliver'?'request.deliver':'request.decline',result:r.status,at:state.clock,producer:'P4.request',causeRefs:[r.needRef,r.id],historyCauses:[],audience:['player',p.id],known:{person:p.name,item:r.item,need:r.revision===1?'one missing journey supply':`${r.quantity} missing journey supplies`},applied:action==='deliver'?[{kind:'item',owner:'player',key:u?`heirloom:${u.uid}`:itemKey,delta:-r.quantity},{kind:'item',owner:p.id,key:u?`heirloom:${u.uid}`:itemKey,delta:r.quantity},{kind:'coin',owner:'player',key:'wood',delta:fee},{kind:'coin',owner:`escrow:${r.id}`,key:'wood',delta:-fee}]:[{kind:'coin',owner:p.id,key:'wood',delta:fee},{kind:'coin',owner:`escrow:${r.id}`,key:'wood',delta:-fee}]});
   r.receiptId=receipt.id;
  }
 }
 if(state.loreHistory){state.loreHistory.consumerPins||={};for(const r of s.storyRequests?.requests||[])if(r.receiptId)state.loreHistory.consumerPins[`p4.request:${r.id}`]=[r.receiptId];}
 state.sequence++;validateStoryRequests(s,state);return {envelope:save,reward,mintKey,cost,supplyKey,supplyQuantity:supplyKey?s.storyRequests.requests.find(r=>r.id===id).quantity:0};
}
export function publishStoryRequest(plan,{persist,publishSupply,publishReward,publishMint,publishCost}) {
 persist(JSON.stringify(plan.envelope));
 if(plan.mintKey)publishMint?.(plan.mintKey);if(plan.cost)publishCost?.(plan.cost,'story request: reclaim');
 if(plan.supplyKey)publishSupply(plan.supplyKey,plan.supplyQuantity);if(plan.reward)publishReward(plan.reward,'story request: deliver');
}
