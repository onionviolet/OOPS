// ST2: household details inside the existing desktop Homes center panel.
import {HOUSEHOLD_PEOPLE,TUTOR,SUPPLIER,HOUSEHOLD_TERMS as TERMS} from './home_household_content.js';
import {staffReadiness} from './home_household.js';
import {HOME_STAFF} from './home_staff.js';
import {homeKey as k} from './home_content.js';
export function renderHouseholdLife({staff,view,el,action}){
 const c=view.context;
 staff.append(el('p','Staff recover one energy per idle played minute at home, up to 60. Each accepted service reserves 20 energy; below 20 they ask to rest. Leave suspends new requests. Cancellation returns reserved effort and unearned pay.'));
 for(const p of [...HOME_STAFF,HOUSEHOLD_PEOPLE[0]]){
  staff.append(el('p',`${p.name}: ${staffReadiness(c,p.id)} · energy ${c.staffResources[p.id]?.['home.energy']??'terms pending'}/60 · wages ${c.staffResources[p.id]?.['home.wages']||0} coins.`));
  action(staff,'leave:'+p.id,'Agree leave with '+p.name,{type:'staff_leave',actor:p.id});
  action(staff,'return:'+p.id,'Discuss resuming duties with '+p.name,{type:'staff_return',actor:p.id});
 }
 staff.append(el('p',`Sera’s primer: ${c.resources['home.readingPractice']||0}/${TERMS.lessonCap} practice XP covered. Each 20-minute lesson gives ${TERMS.lessonXP} actual Literacy XP and costs 4 household coins. Further teaching needs a fitting teacher and text.`));
 action(staff,'tutor','Study reading with Sera · 20 min, 4 household coins',{type:'tutor'});
 const duty=c.playerFacts?.['home.familyDutyKept']?'kept':c.playerFacts?.['home.familyDutyAccepted']?'agreed; ready when you both have time':'not agreed';
 staff.append(el('p','Family request: help Rowan check the provision ledger. Status: '+duty+'. You may decline or change an unfinished agreement. This request has no deadline; your room and hospitality remain available.'));
 action(staff,'family_accept','Agree to help with the provision ledger',{type:'family_accept'});
 action(staff,'family_decline','Decline this request for now',{type:'family_decline'});
 action(staff,'family_duty','Keep the agreed ledger appointment · 15 min',{type:'family_duty'});
 staff.append(el('p',`Mara is at ${c.people[SUPPLIER]?.location||'an unknown location'}. Available stock: ${c.staffStock[SUPPLIER]?.[k('Rat meat chunks')]||0} meat chunks, ${c.staffStock[SUPPLIER]?.[k('Rough wood log')]||0} logs. Stock and funds are finite; receiving a delivery creates no refill.`));
 action(staff,'pantry_return','Arrange Mara’s return to Village · 10 min',{type:'pantry_return'});
 action(staff,'pantry_order','Order 4 meat chunks + 2 logs · 8 household coins, 20 min delivery',{type:'pantry_order'});
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.household.'))){staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remaining.`));action(staff,'cancel_household:'+j.id,'Cancel this appointment or delivery',{type:'cancel_household',job:j.id});}
 staff.append(el('p','When a life ends, its heir can receive personally owned homes, fittings and belongings. Family rooms, staff service and communal stores need new agreements.'));
}
