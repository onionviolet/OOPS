import {projectStructuredEquipment} from './structured_equipment_runtime.js';
// The exact worn consumer evaluates both snapshots. Context remains private;
// the UI receives physical contributions, never policy flag/claim identifiers.
export function compareWornEquipment(context,key,getItem){
 const item=getItem(key),slot=item?.equip_slot;if(!slot)return null;
 const previous=context.equipment[slot],baseline=previous?getItem(previous):null;
 if(!item.tags?.structuredEquipment&&!baseline?.tags?.structuredEquipment)return null;
 const afterEquipment={...context.equipment,[slot]:key};
 const before=projectStructuredEquipment(context),after=projectStructuredEquipment({...context,equipment:afterEquipment});
 const native=(equipment,stat,neutral=0)=>Object.values(equipment).filter(Boolean).reduce((n,k)=>{
  const i=getItem(k);return stat==='defense'?n+(i?.getDefense?.()||0):n*(i?.getStats?.().stamina_efficiency?.multiplier??1);
 },neutral);
 const value=(projection,stat)=>projection.effects['structured.equipment']?.effects.stats[stat];
 const rows=[['Equipment defense',native(context.equipment,'defense')+(value(before,'defense')?.flat||0),native(afterEquipment,'defense')+(value(after,'defense')?.flat||0)],
 ['Structured layer weight',before.weight,after.weight],['Equipment stamina factor',native(context.equipment,'stamina',1)*(value(before,'stamina_efficiency')?.multiplier??1),native(afterEquipment,'stamina',1)*(value(after,'stamina_efficiency')?.multiplier??1)],
 ['Structured rain protection',1-before.rainMultiplier,1-after.rainMultiplier],['Structured cold protection',before.coldProtection,after.coldProtection]];
 for(const region of Object.keys({...before.coverage,...after.coverage}))rows.push([`Structured ${region} coverage`,before.coverage[region]||0,after.coverage[region]||0]);
 return {baselineName:baseline?.getName?.()||baseline?.name||'Empty slot',slot,rows:rows.map(([label,current,worn])=>({label,current,worn,delta:worn-current})),note:'Current wearer, custody, fit, condition and weather. Equipment contributions, before other body/skill/encounter effects. Zero contribution does not prove an item impossible to use by other means.'};
}

export function readWornEquipment({definitions,equipment,state,body,actorFacts,temperature,sheltered,raining,wearByKey},key,getItem){
 const context={definitions,equipment,state,body,wearByKey,facts:Object.fromEntries(Object.entries(actorFacts).map(([k,v])=>['actor.'+k,v])),weather:{raining:!sheltered&&raining,hot:!sheltered&&temperature>25,cold:!sheltered&&temperature<5,rainPenalty:.1,coldPenalty:.1}};
 return key?compareWornEquipment(context,key,getItem):projectStructuredEquipment(context);
}
