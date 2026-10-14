import {appendStoryOutcome,queryStoryOutcomes,validateLoreHistory} from './lore_history_state.js';
export const REQUEST_CONTRACT=Object.freeze({revision:1,place:'Village',routes:['take','deliver','decline'],items:['Stale bread','Rat pelt','Rat tail'],expiry:'played-time defer; no absence penalty'});
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const check=(ok,text='Invalid remembered request.')=>{if(!ok)throw Error(text);};
const pending=r=>['offered','accepted'].includes(r.status);
export function validateStoryRequests(people,expansion=null) {
 const s=people?.storyRequests;if(s==null)return;
 check(s.schema===1&&s.enabled===true&&nat(s.nextId)&&s.nextId>0&&Array.isArray(s.requests)&&s.requests.length<=16);
 const ids=new Set(),needs=new Set();
 for(const r of s.requests) {
  const p=people.people.find(p=>p.id===r.issuer);
  check(p&&p.met&&typeof r.id==='string'&&!ids.has(r.id)&&r.id.startsWith('request:')&&r.revision===1&&r.needRef===`supply:${p.id}:${r.item}`);ids.add(r.id);if(pending(r)){check(!needs.has(r.needRef));needs.add(r.needRef);}
  check(r.needRevision===1&&r.quantity===1&&r.item===p.goal.item&&REQUEST_CONTRACT.items.includes(r.item)&&r.reward===p.goal.reward&&nat(r.held)&&r.held===(pending(r)?r.reward:0));
  check(['offered','accepted','delivered','declined'].includes(r.status)&&nat(r.at)&&(!expansion||r.at<=expansion.clock)&&r.expiryPolicy===REQUEST_CONTRACT.expiry);
  check(!pending(r)||!p.goal.fulfilled&&!(p.possessions.supplies[r.item]||0));
  check(r.status!=='delivered'||p.goal.fulfilled&&p.possessions.supplies[r.item]===1);
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
export function planStoryRequest(envelope,{action,id=null,itemKey=null,expectedSequence=envelope.expansion?.sequence}) {
 const save=structuredClone(envelope),s=save.generated_people,state=save.expansion;
 check(s&&state&&state.sequence===expectedSequence,'This request changed. Read the current terms again.');validateStoryRequests(s,state);
 check(save['current location']==='Village'&&state.actors.player.worldId==='base.frontier','Meet the traveler in Village.');
 let reward=0,supplyKey=null;
 if(action==='enable') {
  check(!s.storyRequests,'Remembered requests are already enabled.');
  check(state.actors.player.facts['storylets.enabled']===true,'Begin Village encounters after speaking to the elder first.');
  s.storyRequests={schema:1,enabled:true,nextId:1,requests:[]};
 } else if(action==='raise') {
  check(s.storyRequests);
  if(s.storyRequests.requests.length>=16){const retired=s.storyRequests.requests.findIndex(r=>!pending(r));check(retired>=0,'Finish an active request before admitting another.');const [old]=s.storyRequests.requests.splice(retired,1);if(state.loreHistory?.consumerPins)delete state.loreHistory.consumerPins[`p4.request:${old.id}`];}
  const p=salientRequestPerson(s,state);check(p,'Meet a traveler with an unmet supply need and a funded fee.');
  p.possessions.coins-=p.goal.reward;
  s.storyRequests.requests.push({id:`request:${s.storyRequests.nextId++}`,revision:1,issuer:p.id,needRef:`supply:${p.id}:${p.goal.item}`,needRevision:1,item:p.goal.item,quantity:1,reward:p.goal.reward,held:p.goal.reward,at:state.clock,status:'offered',expiryPolicy:REQUEST_CONTRACT.expiry,receiptId:null});
 } else {
  const r=s.storyRequests?.requests.find(r=>r.id===id),p=s.people.find(p=>p.id===r?.issuer);
  check(r&&p&&pending(r),'This request has already settled or is unavailable.');check(p.status!=='on_road'&&p.arrivedAt<=s.lastMinute,'Wait for this traveler to return. The reserved fee stays safe.');
  check(!p.goal.fulfilled&&!(p.possessions.supplies[r.item]||0),'This supply need changed.');
  if(action==='take'){check(r.status==='offered');r.status='accepted';}
  else {
   check(action==='deliver'||action==='decline');
   if(action==='deliver') {
    check(r.status==='accepted','Take the request before delivering.');
    check(itemKey===JSON.stringify({id:r.item}),'Bring the requested ordinary supply.');
    const stock=save.inventories?.person?.main_character;check(stock?.[itemKey]?.count>=r.quantity,`Bring one ${r.item} from your own inventory.`);
    stock[itemKey].count--;if(stock[itemKey].count===0)delete stock[itemKey];
    p.possessions.supplies[r.item]=1;p.goal.fulfilled=true;p.relationship='helped with supplies';reward=r.held;supplyKey=itemKey;save.character.money+=reward;r.status='delivered';
   } else {p.possessions.coins+=r.held;r.status='declined';}
   const held=r.held;r.held=0;
   const receipt=appendStoryOutcome(state,{operation:`${r.id}:settled`,worldId:'base.frontier',actor:'player',issuer:p.id,targetPerson:p.id,targetObject:r.item,targetPlace:'Village',action:action==='deliver'?'request.deliver':'request.decline',result:r.status,at:state.clock,producer:'P4.request',causeRefs:[r.needRef,r.id],historyCauses:[],audience:['player',p.id],known:{person:p.name,item:r.item,need:'one missing journey supply'},applied:action==='deliver'?[{kind:'item',owner:'player',key:itemKey,delta:-1},{kind:'item',owner:p.id,key:itemKey,delta:1},{kind:'coin',owner:'player',key:'wood',delta:held},{kind:'coin',owner:`escrow:${r.id}`,key:'wood',delta:-held}]:[{kind:'coin',owner:p.id,key:'wood',delta:held},{kind:'coin',owner:`escrow:${r.id}`,key:'wood',delta:-held}]});
   r.receiptId=receipt.id;
  }
 }
 if(state.loreHistory){state.loreHistory.consumerPins||={};for(const r of s.storyRequests?.requests||[])if(r.receiptId)state.loreHistory.consumerPins[`p4.request:${r.id}`]=[r.receiptId];}
 state.sequence++;validateStoryRequests(s,state);return {envelope:save,reward,supplyKey};
}
export function publishStoryRequest(plan,{persist,publishSupply,publishReward}) {
 persist(JSON.stringify(plan.envelope));
 if(plan.supplyKey)publishSupply(plan.supplyKey);if(plan.reward)publishReward(plan.reward);
}
