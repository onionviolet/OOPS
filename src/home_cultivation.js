import {domainRegistry} from './domain_registry.js';
import {QI_FIELD} from './cultivation_items.js';
import {CULTIVATION_KEEPER as K,CULTIVATION_ROOM,activeHouseholdField,cradleFilm,householdFieldPower} from './home_cultivation_content.js';
export function planHomeCultivation(s,r,c,out){
 if(r.type==='remove'&&r.slot==='qi'&&r.home==='manor'){
  if(c.jobs?.some(j=>j.commandId.startsWith('home.cultivation.')))throw Error('Home: finish or cancel the cradle appointment before removing it.');
  out.simEffects.push({type:'condition',actor:K,id:QI_FIELD,operation:'remove'});return false;
 }
 if(!['cultivation_order','cultivation_cancel'].includes(r.type))return false;
 const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
 check(c.location===CULTIVATION_ROOM&&s.properties.manor?.access&&c.body.form==='human','meet the household at its manor with a supported body.');
 if(r.type==='cultivation_cancel'){const j=c.jobs.find(j=>j.id===r.job&&j.commandId.startsWith('home.cultivation.'));check(j,'the appointment changed.');out.job={cancel:j.id,actor:K};out.message='The unfinished appointment returns its reserved goods, effort and pay.';return true;}
 check(s.properties.manor.fixtures.qi,'install a condensate cradle here first.');
 check(['release','clean','study','lesson','awakened_lesson'].includes(r.service),'choose a known circulation appointment.');
 check(c.people?.[K]?.life==='alive'&&c.people[K].location===CULTIVATION_ROOM,'meet Toma here.');
 if(r.service==='release')check(!activeHouseholdField(c),'the existing field is still active; let it run before spending another packet.');
 else if(r.service==='clean')check(cradleFilm(c)>=1,'the estate feed-space needs no residue cleaning.');
 else check(activeHouseholdField(c),'release an actual sealed packet into this cradle first.');
 if(r.service==='awakened_lesson'){check(!!domainRegistry.command('household_fortunes','observedAwakened')?.(K),'observe Toma’s actual awakening before requesting this finer curriculum.');check((c.resources['home.awakenedLessons']||0)<6,'this finer curriculum’s six lessons are complete.');out.simEffects.push({type:'resource',actor:'player',key:'home.awakenedLessons',amount:0});}
 if(['lesson','awakened_lesson'].includes(r.service))check((c.staffResources?.[K]?.['home.cultivationPractice']||0)>=2,'Toma needs two actual circulation studies before teaching.');
 out.job={id:'home.cultivation.'+r.service,actor:K};out.message='Toma considers one funded appointment. Actual stock, wages, rest, field expiry and other duties govern whether it can finish.';return true;
}
export function renderHomeCultivation({staff,view,el,action}){
 const c=view.context,h=view.homes.find(h=>h.id==='manor');if(!h?.fixtures.qi)return;
 const practice=c.staffResources?.[K]?.['home.cultivationPractice']||0,v=c.conditions?.[K]?.[QI_FIELD];
 staff.append(el('p',`Condensate cradle: ${activeHouseholdField(c)?Math.max(0,v.expiresAt-c.clock)+' played minutes of qi remain':'unpowered'}. Toma: ${practice}/6 circulation studies (${practice>=2?'qualified tutor':'apprentice'}). Your completed lessons: ${c.resources['home.cultivationContributions']||0}. One packet supplies four hours, through the existing household clock.`));
 staff.append(el('p',`Settled feed-space film ${cradleFilm(c)}. ${activeHouseholdField(c)?(householdFieldPower(c)*100).toFixed(1)+'% of clean transmission is reaching the room.':'Power the cradle to circulate its actual packet.'} Each newly released packet leaves one film, gradually reducing delivery. A charcoal service removes one film after the work finishes; packing the cradle leaves this room’s residue in place.`));
 action(staff,'cultivation_release','Release one sealed packet · 5 min, 2 estate coins',{type:'cultivation_order',service:'release'});
 action(staff,'cultivation_clean','Clean one feed-space film · 15 min, 1 charcoal, 2 estate coins',{type:'cultivation_order',service:'clean'});
 action(staff,'cultivation_study','Toma studies circulation · 30 min, 2 estate coins',{type:'cultivation_order',service:'study'});
 action(staff,'cultivation_awakened_lesson','Finer circulation lesson · 30 min, 3 estate coins, 18 Meditation XP',{type:'cultivation_order',service:'awakened_lesson'});
 action(staff,'cultivation_lesson','Study circulation together · 30 min, 3 estate coins, 12 Meditation XP',{type:'cultivation_order',service:'lesson'});
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.cultivation.'))){staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remain.`));action(staff,'cultivation_cancel:'+j.id,'Cancel this circulation appointment',{type:'cultivation_cancel',job:j.id});}
}
