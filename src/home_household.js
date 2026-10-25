import {householdEnergyCap} from './home_medicine.js';
import {HOME_PLACES as P,homeKey as k} from './home_content.js';
import {HOUSEHOLD_TERMS as TERMS,TUTOR,SUPPLIER} from './home_household_content.js';
const STEWARD='home.manor.steward',COOK='home.manor.cook',KEEPER='home.manor.keeper';
export const HOUSEHOLD_ACTORS=[STEWARD,COOK,KEEPER,TUTOR,SUPPLIER];
const staff=[STEWARD,COOK,KEEPER,TUTOR];
const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
const resource=(actor,key,amount)=>({type:'resource',actor,key,amount});
const fact=(actor,key,value)=>({type:'fact',scope:'actor',actor,key,value});
export function admitHousehold(out){
 for(const id of [TUTOR,SUPPLIER])out.simEffects.push({type:'spawn',personId:id,definitionId:id},fact(id,'home.employed',true));
 for(const id of staff)out.simEffects.push(resource(id,'home.energy',TERMS.energy),fact(id,'home.leave',false));
 out.simEffects.push(fact('player','home.familyDutyAccepted',false),fact('player','home.familyDutyKept',false));
 out.simEffects.push(fact(TUTOR,'home.teachesLiteracy',true),resource('player','home.readingPractice',0));
 for(const [id,n]of [['Rat meat chunks',12],['Rough wood log',8]])out.simEffects.push({type:'item',actor:SUPPLIER,key:k(id),amount:n});
 out.simEffects.push(resource(SUPPLIER,'home.wages',0));
}
// Recovery uses elapsed native played time and actual reserved job intervals.
// The enclosing root owns the interval; no home-side due time or offline clock.
export function settleHouseholdRest(plan,previous){
 if(!previous?.simulation)return;
 const start=previous.clock,end=plan.state.clock;if(end<=start)return;
 for(const id of HOUSEHOLD_ACTORS){const a=plan.state.actors[id],person=plan.state.simulation?.people[id];
  if(!a||person?.life!=='alive'||person.location!==P.manor.location||!Object.hasOwn(a.resources,'home.energy'))continue;
  const intervals=(previous.simulation.jobs||[]).filter(j=>(j.participants||[j.actorId]).includes(id)).map(j=>[Math.max(start,j.startedAt??start),Math.min(end,j.due)]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
  let occupied=0,last=start;for(const [a,b]of intervals){occupied+=Math.max(0,b-Math.max(last,a));last=Math.max(last,b);}
  a.resources['home.energy']=Math.min(householdEnergyCap({people:plan.state.simulation.people,staffResources:{[id]:a.resources},staffFacts:{[id]:a.facts}},id),a.resources['home.energy']+Math.max(0,end-start-occupied));
 }
}
export function staffReadiness(c,id){
 const person=c.people?.[id],r=c.staffResources?.[id]||{},f=c.staffFacts?.[id]||{};
 if(person?.life!=='alive'||person.location!==P.manor.location)return 'not here';
 if(f['home.employed']===false)return 'has ended this service agreement';
 if(f['home.leave']===true)return 'on agreed leave; discuss returning';
 if((r['home.energy']??TERMS.energy)<20)return 'resting; needs 20 energy to accept more work';
 return 'willing to consider a funded request';
}
export function planHouseholdLife(s,r,c,out){
 if(!['staff_leave','staff_return','tutor','cancel_household','pantry_order','pantry_return','family_accept','family_decline','family_duty'].includes(r.type))return false;
 check(s.properties.manor?.access&&c.location===P.manor.location&&c.body.form==='human','meet the household at the manor with a supported body');
 const idle=id=>check(!c.jobs?.some(j=>(j.participants||[j.actorId]).includes(id)),'finish or cancel the actual accepted work before changing this agreement');
 const available=id=>check(staffReadiness(c,id)==='willing to consider a funded request',staffReadiness(c,id));
 switch(r.type){
 case 'staff_leave': case 'staff_return':
  check(staff.includes(r.actor)&&c.people[r.actor]?.life==='alive','meet an actual household staff member');idle(r.actor);
  out.simEffects.push(fact(r.actor,'home.leave',r.type==='staff_leave'));
  if(r.type==='staff_return'&&!Object.hasOwn(c.staffResources?.[r.actor]||{},'home.energy'))out.simEffects.push(resource(r.actor,'home.energy',TERMS.energy));
  out.message=r.type==='staff_leave'?'You agree to suspend requests while this person takes leave. Their stock and earned wages remain theirs.':'The household member agrees to resume their existing duties, subject to rest, funding and actual supplies.';break;
 case 'tutor':
  available(TUTOR);check((c.body.hands||0)>0,'reading practice needs a usable means to handle this primer');
  check((c.resources['home.readingPractice']||0)<TERMS.lessonCap,'Sera has taught this primer’s full syllabus; use a more advanced teacher or text for further learning');
  out.job={id:'home.household.lesson',actor:TUTOR};out.message='Sera agrees to twenty minutes of shared reading practice, paid four coins from the household treasury. Both of you must remain present. The primer teaches actual Literacy, up to its syllabus limit.';break;
 case 'pantry_order':
  available(STEWARD);check(c.people[SUPPLIER]?.life==='alive'&&c.people[SUPPLIER]?.location==='Village','Mara must finish her actual return to Village before bringing another order');
  out.job={id:'home.household.pantry',actor:STEWARD};out.message='Rowan orders four meat chunks and two logs from Mara’s finite Village stock for eight household coins. Delivery takes twenty played minutes; goods and payment are reserved now. Cancellation returns both.';break;
 case 'pantry_return':
  check(c.people[SUPPLIER]?.life==='alive'&&c.people[SUPPLIER]?.location===P.manor.location,'Mara must actually be at the manor');
  out.job={id:'home.household.return',actor:SUPPLIER};out.message='Mara returns to Village over ten played minutes. Her remaining stock and wages stay hers; this journey generates no supplies.';break;
 case 'family_accept': case 'family_decline':
  idle('player');check(!c.playerFacts?.['home.familyDutyKept'],'this particular family request is already fulfilled');
  out.simEffects.push(fact('player','home.familyDutyAccepted',r.type==='family_accept'));
  out.message=r.type==='family_accept'?'You agree to help Rowan check this household’s provision ledger. There is no automatic deadline or penalty. Meet him here when both of you can give it fifteen minutes.':'You decline this ledger request for now. The family records your answer; housing and ordinary hospitality remain available. You may discuss it again.';break;
 case 'family_duty':
  available(STEWARD);check(c.playerFacts?.['home.familyDutyAccepted']===true&&!c.playerFacts?.['home.familyDutyKept'],'agree to the actual unfinished ledger request first');check((c.body.hands||0)>0,'the ledger needs a usable hand');
  out.job={id:'home.household.duty',actor:'player'};out.message='You and Rowan reserve fifteen minutes to reconcile the actual household accounts. Completion keeps this specific family promise; it creates no money or hereditary skill.';break;
 case 'cancel_household':{
  const job=c.jobs.find(j=>j.id===r.job&&j.commandId.startsWith('home.household.'));check(job,'the accepted household work has changed');out.job={cancel:job.id,actor:job.actorId};out.message='The accepted appointment or delivery is cancelled. Reserved wages, supplies and effort return under the disclosed terms; no lesson, delivery or kept promise is awarded.';break;}
 }
 return true;
}
