// Recipient medicines use the same formulation law and each actual person's body.
import {bodyKey,consumeTablet,freshTreatment} from './craft_body_treatment.js';
import {productFromNativeKey} from './crafting_frontier_runtime.js';
const recipientNames={'home.manor.steward':'Rowan','home.manor.cook':'Iven','home.manor.keeper':'Toma','home.manor.tutor':'Sera'};
export const MEDICINE_PEOPLE=['home.manor.steward','home.manor.cook','home.manor.keeper','home.manor.tutor'];
export function householdTreatment(c,id){
 const body=c.people?.[id]?.body,r=c.staffResources?.[id]||{},f=c.staffFacts?.[id]||{},base=freshTreatment({body});
 if(!body||f['home.medicineBinding']!==bodyKey({body}))return base;
 const b={...base,conditioning:r['home.medicineConditioning']||0,impurity:r['home.medicineResidue']||0,capacity:20+(r['home.medicineCapacityBonus']||0)};
 if(b.conditioning<0||b.conditioning>200||b.impurity<0||b.impurity>b.capacity||b.capacity>50)throw Error('Home: invalid recipient medicine budget.');
 return b;
}
export const householdEnergyCap=(c,id)=>60+Math.floor(householdTreatment(c,id).conditioning/5);
export const householdLongevity=(c,id)=>Math.floor(householdTreatment(c,id).conditioning/20);
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
export function planHomeMedicine(s,r,c,out){
 if(!['medicine_dose','medicine_purge','medicine_capacity','medicine_cancel'].includes(r.type))return false;
 const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
 check(c.location==='Arlmere family manor'&&s.properties.manor?.access,'meet the recipient at the manor.');
 if(r.type==='medicine_cancel'){const j=c.jobs?.find(j=>j.id===r.job&&j.commandId.startsWith('home.medicine.'));check(j,'the medicinal appointment changed.');out.job={cancel:j.id,actor:j.actorId};out.message='The unfinished treatment returns reserved fuel and wages.';return true;}
 check(MEDICINE_PEOPLE.includes(r.actor)&&c.people?.[r.actor]?.life==='alive'&&c.people[r.actor].location===c.location,'choose an actual living household recipient here.');
 check(!c.jobs?.some(j=>(j.participants||[j.actorId]).includes(r.actor)),'finish or cancel this person’s actual work before treatment.');
 const b=householdTreatment(c,r.actor),raw=c.staffResources[r.actor]||{};
 if(r.type==='medicine_dose'){
  check((c.inventory[r.key]||0)>0&&!c.unspendable?.includes(r.key),'bring an actual owned usable preparation.');
  const p=productFromNativeKey(r.key);check(p?.outputs.permanent?.conditioning>0,'offer a real conditioning tablet.');
  const t=consumeTablet(b,p,{body:c.people[r.actor].body});
  out.items.push({key:r.key,amount:-1});
  out.simEffects.push({type:'fact',actor:r.actor,scope:'actor',key:'home.medicineBinding',value:t.body.binding},
   res(r.actor,'home.medicineConditioning',t.body.conditioning-(raw['home.medicineConditioning']||0)),res(r.actor,'home.medicineResidue',t.body.impurity-(raw['home.medicineResidue']||0)),res(r.actor,'home.medicineCapacityBonus',t.body.capacity-20-(raw['home.medicineCapacityBonus']||0)));
  out.message=`The recipient accepts the actual tablet: +${t.gain} bodily conditioning, +${t.residue} medicinal residue. Every five conditioning supports one extra work-energy capacity; every twenty supports one further year of this household body's ordinary lifespan. Current energy is not refilled.`;
 }else{
  check(c.staffFacts[r.actor]?.['home.medicineBinding']===b.binding,'give this body a real conditioning treatment before commissioning its residue work.');
  check(r.type==='medicine_purge'?b.impurity>0:b.capacity<50,r.type==='medicine_purge'?'this body has no residue to purge.':'this body has reached the current vessel’s capacity.');
  out.job={id:`home.medicine.${r.type==='medicine_purge'?'purge':'capacity'}.${r.actor}`,actor:r.actor};out.message='A funded medicinal appointment reserves this patient and your charcoal. Its existing body budget changes at completion; cancellation returns unearned costs.';
 }
 return true;
}
export function renderHomeMedicine({staff,view,el,action}){
 const c=view.context,tablets=Object.keys(c.inventory).filter(key=>{try{return productFromNativeKey(key)?.outputs.permanent?.conditioning>0;}catch{return false;}});
 for(const id of MEDICINE_PEOPLE){if(!c.people?.[id])continue;const b=householdTreatment(c,id),name=recipientNames[id];
  if(!tablets.length&&!b.conditioning&&!b.impurity)continue;
  staff.append(el('p',`${name}: conditioning ${b.conditioning}; medicinal residue ${b.impurity}/${b.capacity}; work-energy capacity ${householdEnergyCap(c,id)}; supported lifespan +${householdLongevity(c,id)} years. These belong to the actual recipient body.`));
  for(const key of tablets)action(staff,`medicine_dose:${id}:${key}`,'Offer '+name+' one carried conditioning tablet',{type:'medicine_dose',actor:id,key});
  action(staff,'medicine_purge:'+id,'Commission residue purge · 12 min, 2 Charcoal, 2 estate coins',{type:'medicine_purge',actor:id});
  action(staff,'medicine_capacity:'+id,'Commission expanded residue capacity · 24 min, 4 Charcoal, 3 estate coins',{type:'medicine_capacity',actor:id});
 }
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.medicine.'))){staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remain.`));action(staff,'medicine_cancel:'+j.id,'Cancel this medicinal appointment',{type:'medicine_cancel',job:j.id});}
}
