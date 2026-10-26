import {baggageIdentity,portableEquipmentKey,equipmentBagReason,equipmentBagPreflight,transferEquipmentFacts,stripExportedEquipmentCopy,snapshotReservesCopy} from './continuation_equipment_baggage.js';
// A paid connection can physically move a small selected bag. Its shelved
// source loses exactly what the new life receives, through the same save plan.
import {check,natural} from './basics.js';
import {setSavedPurse} from './money.js';
import {assertNativeItemDisposition} from './native_gameplay_adapter.js';
const stock=save=>save.inventories?.person?.main_character||{};
const count=row=>typeof row==='number'?row:row?.count||0;
function plainKey(key){try{const x=JSON.parse(key);return key.length<=500&&typeof x.id==='string'&&x.id.length>0&&Object.keys(x).every(k=>['id','quality'].includes(k))&&(x.quality===undefined||Number.isFinite(x.quality)&&x.quality>=0);}catch{return false;}}
const portableKey=key=>plainKey(key)||portableEquipmentKey(key);
export const freshBaggage=()=>({slots:0,items:[],coins:0});
const used=b=>b.items.length+Math.ceil(b.coins/25);
export function validateBaggage(b){
 if(b===undefined)return;check(b&&Object.keys(b).sort().join(',')==='coins,items,slots'&&natural(b.slots)&&b.slots<=4&&Array.isArray(b.items)&&b.items.every(portableKey)&&natural(b.coins)&&b.coins%25===0&&used(b)<=b.slots,'Invalid connected baggage.');
}
export function baggageView(save,c){
 const b=c.baggage||freshBaggage();validateBaggage(b);
 const label=key=>{const piece=JSON.parse(key),name=save.naming?.named?.[baggageIdentity(key)]?.name;return `${name?name+' · ':''}${piece.id||'Assembled equipment'}${piece.quality===undefined?'':` · ${piece.quality}% quality`}`;};
 const candidates=Object.entries(stock(save)).filter(([key,row])=>portableKey(key)&&count(row)>0).map(([key,row])=>{let reason=equipmentBagReason(save,key);try{assertNativeItemDisposition(save.expansion,key);}catch(e){reason=e.message;}return {key,label:label(key),count:count(row),selected:b.items.filter(k=>k===key).length,reason};});
 const selectedItems=[...new Set(b.items)].map(key=>({key,label:label(key),count:b.items.filter(k=>k===key).length,available:count(stock(save)[key])}));
 return {...structuredClone(b),used:used(b),nextCost:150*2**b.slots,candidates,selectedItems};
}
export function planBaggage(save,c,action){
 check(!c.challenge,'Connected baggage stays inactive in an isolated challenge.');c.baggage ||= freshBaggage();const b=c.baggage;
 if(action==='buy'){
  const cost=150*2**b.slots;check(b.slots<4&&save.character.money>=cost,`A further connection slot needs ${cost} coins; this connection presently holds up to four.`);setSavedPurse(save,save.character.money-cost,'continuation.baggage_slot');b.slots++;
 }else if(action==='clear'){b.items=[];b.coins=0;}
 else if(action==='coins'){
  check(used(b)<b.slots&&save.character.money>=b.coins+25,'Keep a free purchased slot and 25 actual carried coins for it.');b.coins+=25;
 }else if(action.startsWith('item:')){
  const key=decodeURIComponent(action.slice(5));check(portableKey(key),'This item needs its own identity or world adapter before this connection can carry it.');assertNativeItemDisposition(save.expansion,key);const reason=equipmentBagReason(save,key);check(!reason,reason);
  check(used(b)<b.slots&&count(stock(save)[key])>b.items.filter(k=>k===key).length,'Choose an actual unallocated loose item and a free purchased slot.');b.items.push(key);
 }else check(false,'Unknown connected baggage choice.');validateBaggage(b);
}
export function transferBaggage(source,destination,c){
 const b=c.baggage;if(!b||!used(b))return;validateBaggage(b);check(!c.challenge,'Isolated challenges carry no physical baggage.');
 const from=stock(source);destination.inventories ||= {};destination.inventories.person ||= {};destination.inventories.person.main_character ||= {};const to=stock(destination);
 check(source.character.money>=b.coins,'The selected carried coins are no longer available.');
 const identities=[...new Set(b.items)].map(baggageIdentity).filter(Boolean);check(new Set(identities).size===identities.length,'Two selected keys cannot claim the same equipment copy. Review this bag.');
 const points=['initial','checkpoint','paused'].map(key=>c.lives[c.active][key]).filter(Boolean);
 for(const identity of identities)check(!snapshotReservesCopy(source,identity),'Finish or cancel this copy’s current reserved work before sending it through the physical connection.');
 for(const key of new Set(b.items))equipmentBagPreflight(source,destination,key);
 for(const key of new Set(b.items)){
  assertNativeItemDisposition(source.expansion,key);const n=b.items.filter(k=>k===key).length;check(count(from[key])>=n,'A selected loose item is no longer present. Review the connected bag.');
  transferEquipmentFacts(source,destination,key);const left=count(from[key])-n;if(left)from[key]={...from[key],count:left};else delete from[key];to[key]={...to[key],count:count(to[key])+n};
 }
 setSavedPurse(source,source.character.money-b.coins,'continuation.baggage_departure');setSavedPurse(destination,(destination.character.money||0)+b.coins,'continuation.baggage_arrival');
 const life=c.lives[c.active];if(identities.length)life.externalEquipment=[...new Set([...(life.externalEquipment||[]),...identities])];
 for(const point of points){
  for(const identity of identities)stripExportedEquipmentCopy(point,identity);
  for(const key of new Set(b.items.filter(k=>!baggageIdentity(k)))){const inventory=stock(point),left=Math.max(0,count(inventory[key])-b.items.filter(k=>k===key).length);if(left)inventory[key]={...inventory[key],count:left};else delete inventory[key];}
  if(b.coins)setSavedPurse(point,Math.max(0,(point.character.money||0)-b.coins),'continuation.external_baggage');
 }
 b.items=[];b.coins=0;
}

export function externalEquipmentReason(life,point){return point&&(life.externalEquipment||[]).some(id=>snapshotReservesCopy(point,id))?'This return point reserves a physical copy that has left this history. Choose a free return point, or bring back that piece through supported means.':'';}
export function validateExternalEquipment(life){if(life.externalEquipment!==undefined)check(Array.isArray(life.externalEquipment)&&new Set(life.externalEquipment).size===life.externalEquipment.length&&life.externalEquipment.every(id=>typeof id==='string'&&/^e2\.[1-9]\d*$/.test(id)&&Number.isSafeInteger(Number(id.slice(3)))),'Invalid external equipment history.');}
