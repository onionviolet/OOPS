import {renderPersonalLegacy} from './home_personal_legacy.js';
import {renderHomeContacts} from './home_contacts.js';
import {renderHomeSchool} from './home_school.js';
import {renderHouseholdBrood} from './household_brood_ui.js';
import {renderHomeMedicine,householdEnergyCap} from './home_medicine.js';
import {renderHomeCultivation} from './home_cultivation.js';
// ST2: household details inside the existing desktop Homes center panel.
import {HOUSEHOLD_PEOPLE,TUTOR,SUPPLIER,HOUSEHOLD_TERMS as TERMS} from './home_household_content.js';
import {staffReadiness} from './home_household.js';
import {HOME_STAFF} from './home_staff.js';
import {homeKey as k} from './home_content.js';
import {officeDecision,officeHolder,OFFICE_TERMS} from './home_office.js';
import {panelSection} from './ui/panel_sections.js';
import {createMeterBar} from './meter_bar.js';
import {homeWorkDefinitions,staffQuote,COOK} from './home_work_content.js';
import {projectAcceptedWorkLegibility} from './action_legibility.js';

// These commissioned services disclose their agreed inputs and destination.
// The pending job owns costs/cancellation; its private outcome is never read.
export function householdAcceptedWork(job,c){
 const d=homeWorkDefinitions.commands.find(d=>d.id===job.commandId);
 if(!d||!(d.id.startsWith('home.staff.')||d.id==='home.household.pantry'||d.id.startsWith('home.office.restock.')))return null;
 const people=Object.fromEntries([...HOME_STAFF,...HOUSEHOLD_PEOPLE].map(p=>[p.id,{known:true,termsKnown:true,label:p.name}]));
 const items=Object.fromEntries([...d.costs,...d.effects].filter(e=>e.type==='item').map(e=>[e.key,{known:true,label:JSON.parse(e.key).id}]));
 const destination=id=>id==='player'?'your carried inventory':id===COOK?'Iven’s kitchen stock':people[id]?`${people[id].label}’s household stock`:null;
 const output=staffQuote(d.id).yields.filter(y=>destination(y.holder)).map(y=>`${y.count} ${JSON.parse(y.key).id} → ${destination(y.holder)}`);
 return projectAcceptedWorkLegibility({job,clock:c.clock,actorId:job.actorId,observerId:'player',label:d.label,
  disclosure:{people,items,resources:{'home.estateFunds':{known:true,label:'household coins'},'home.officeFunds':{known:true,label:'office coins'},'home.energy':{known:true,label:'effort'},money:{known:true,label:'carried coins'}},
   completion:output.length?[{known:true,text:'On supported completion: '+output.join('; ')+'.'}]:[]}});
}
export function renderHouseholdWorkReceipt({host,job,c,el}){
 const v=householdAcceptedWork(job,c);if(!v)return false;
 const receipt=el('div');receipt.dataset.householdWorkReceipt=job.id;
 receipt.append(el('p',`${v.label}: ${v.remainingText}`));
 if(v.costs.length)receipt.append(el('p','Reserved inputs: '+v.costs.map(r=>r.text).join(' ')));
 if(v.reservations.length)receipt.append(el('p',v.reservations.map(r=>r.text).join(' ')));
 for(const r of v.completion)receipt.append(el('p',r.text));
 receipt.append(el('p',v.cancellation.text));host.append(receipt);return true;
}
export function renderHouseholdLife({staff,view,el,action}){
 const c=view.context;
 renderHomeCultivation({staff,view,el,action});
 renderHomeSchool({staff,view,el,action});
 renderPersonalLegacy({staff,view,el,action});
 renderHomeContacts({staff,view,el,action});
 renderHouseholdBrood({staff,view,el,action});
 const group=title=>{const g=panelSection(title);staff.append(g.node);return g.body;};
 const people=group('People and readiness');
 people.append(el('p','Staff recover one energy per idle played minute at home, up to 60. Each accepted service reserves 20 energy; below 20 they ask to rest. Leave suspends new requests. Cancellation returns reserved effort and unearned pay.'));
 for(const p of [...HOME_STAFF,HOUSEHOLD_PEOPLE[0]]){
  const person=panelSection(p.name,{description:staffReadiness(c,p.id)});people.append(person.node);
  const energy=c.staffResources[p.id]?.['home.energy'];
  if(Number.isFinite(energy)){const meter=createMeterBar();meter.update({id:'household-energy-'+p.id,kind:'pool',label:'Available effort',value:energy,max:60,note:'One energy recovers per idle played minute at home. A service reserves 20.',stock:{free:energy,unit:'energy'}});person.body.append(meter.node);}
  person.body.append(el('p',`Wages held: ${c.staffResources[p.id]?.['home.wages']||0} coins.`));
  action(person.body,'leave:'+p.id,'Agree leave with '+p.name,{type:'staff_leave',actor:p.id});
  action(person.body,'return:'+p.id,'Discuss resuming duties with '+p.name,{type:'staff_return',actor:p.id});
 }
 const teaching=group('Teaching');
 teaching.append(el('p',`Sera’s primer: ${c.resources['home.readingPractice']||0}/${TERMS.lessonCap} practice XP covered. Each 20-minute lesson gives ${TERMS.lessonXP} actual Literacy XP and costs 4 household coins. Further teaching needs a fitting teacher and text.`));
 action(teaching,'tutor','Study reading with Sera · 20 min, 4 household coins',{type:'tutor'});
 const family=group('Family request');
 const duty=c.playerFacts?.['home.familyDutyKept']?'kept':c.playerFacts?.['home.familyDutyAccepted']?'agreed; ready when you both have time':'not agreed';
 family.append(el('p','Family request: help Rowan check the provision ledger. Status: '+duty+'. You may decline or change an unfinished agreement. This request has no deadline; your room and hospitality remain available.'));
 action(family,'family_accept','Agree to help with the provision ledger',{type:'family_accept'});
 action(family,'family_decline','Decline this request for now',{type:'family_decline'});
 action(family,'family_duty','Keep the agreed ledger appointment · 15 min',{type:'family_duty'});
 const pantry=group('Pantry and deliveries');
 pantry.append(el('p',`Mara is at ${c.people[SUPPLIER]?.location||'an unknown location'}. Available stock: ${c.staffStock[SUPPLIER]?.[k('Rat meat chunks')]||0} meat chunks, ${c.staffStock[SUPPLIER]?.[k('Rough wood log')]||0} logs. Stock and funds are finite; receiving a delivery creates no refill.`));
 action(pantry,'pantry_return','Arrange Mara’s return to Village · 10 min',{type:'pantry_return'});
 action(pantry,'pantry_order','Order 4 meat chunks + 2 logs · 8 household coins, 20 min delivery',{type:'pantry_order'});
 const office=group('Provision office');
 if(c.playerFacts?.['home.institutionWorker']){office.append(el('p',c.playerFacts['home.provisionOfficer']?'Provision office: earned. The delegate controls institutional funds under an actual agreement.':'Provision worker and student: finish the primer lesson and ledger appointment to earn office authority.'));if(!c.playerFacts['home.provisionOfficer'])action(office,'office_earn','Accept the earned provision office',{type:'office_earn'});if(!c.staffFacts?.['home.manor.keeper']?.['home.officeQualified'])action(office,'office_train','Train Toma for stewardship · 10 shared min',{type:'office_train'});if(officeHolder(c)&&c.staffFacts[officeHolder(c)]?.['home.officeReviewRequired'])action(office,'office_review','Review the successor’s actual standing agreement',{type:'office_review'});}
 {const o=officeDecision(c),holder=officeHolder(c),who=HOME_STAFF.find(p=>p.id===holder)?.name;
  office.append(el('p',holder?`Pantry office: held by ${who} · fund ${c.staffResources[holder]?.['home.officeFunds']||0} coins · reserve floor ${c.staffFacts[holder]?.['home.officeReserveFloor']||0} coins · ${o.reason}`:`Pantry office: not established. Funding it sets ${OFFICE_TERMS.establish} household coins aside for a standing provision order whenever the kitchen falls below ${OFFICE_TERMS.threshold} meat chunks.`));
  if(!holder)action(office,'office_establish',`Ask Rowan to take the pantry office · ${OFFICE_TERMS.establish} household coins`,{type:'office_establish'});
  else{action(office,'office_succeed','Hand the office to an available successor',{type:'office_succeed'});action(office,'office_close','Close the pantry office and return its fund',{type:'office_close'});}}
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.office.'))){if(!renderHouseholdWorkReceipt({host:staff,job:j,c,el}))staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remaining.`));action(staff,'office_cancel:'+j.id,'Cancel this office appointment',{type:'office_cancel',job:j.id});}
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.household.'))){if(!renderHouseholdWorkReceipt({host:staff,job:j,c,el}))staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remaining.`));action(staff,'cancel_household:'+j.id,'Cancel this appointment or delivery',{type:'cancel_household',job:j.id});}
 staff.append(el('p','When a life ends, its heir can receive personally owned homes, fittings and belongings. Family rooms, staff service and communal stores need new agreements.'));
}
