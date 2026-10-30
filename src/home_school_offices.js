import {activeHouseholdField} from './home_cultivation_content.js';
// Qualification belongs to the person; appointment and its finite stipend belong
// to this household. Ordinary simulation jobs own every reservation and due time.
import {SCHOOL_ROSTER,SCHOOL_STEWARD as S,SCHOOL_ROOM} from './home_school_content.js';
export const SCHOOL_MONTH=30*1440;
// Default one funded session per month; a booked month can be topped up for a fee (dial), and each extra pushes the next free one back by a third of a month.
export const EARLY_SESSION_COST=4,EARLY_SPREAD=3;
export const SCHOOL_OFFICES=Object.freeze([
 {id:'instruction',name:'Practice tutor',rank:1,reports:1,stipend:4},
 {id:'survey',name:'Survey convenor',rank:1,reports:2,stipend:4},
 {id:'records',name:'Records elder',rank:2,reports:2,stipend:5},
]);
const ids=SCHOOL_ROSTER.map(([id])=>id),fact=(actor,key,value)=>({type:'fact',scope:'actor',actor,key:'home.schoolOffice.'+key,value}),res=(actor,key,amount)=>({type:'resource',actor,key:'home.'+key,amount});
const flags=(c,id)=>c.staffFacts?.[id]||{},amount=(c,id,key)=>c.staffResources?.[id]?.['home.'+key]||0;
export const schoolOfficeHolder=(c,office)=>ids.find(id=>flags(c,id)['home.schoolOffice.'+office]===true)||null;
export function planSchoolOffice(r,c,out){
 if(!['school_appoint','school_dismiss','school_month'].includes(r.type))return false;
 const check=(v,m)=>{if(!v)throw Error('Home: '+m);},d=SCHOOL_OFFICES.find(o=>o.id===r.office),actor=r.actor;
 check(d&&ids.includes(actor),'Choose an actual school office and member.');
 const busy=id=>c.jobs.some(j=>(j.participants||[j.actorId]).includes(id));
 check(c.people[actor]?.life==='alive'&&c.people[actor].location===SCHOOL_ROOM&&flags(c,actor)['home.employed']===true&&!flags(c,actor)['home.leave'],'Meet this willing member in the school.');check(!busy(actor),'Finish or cancel this person’s actual appointment.');
 const holder=schoolOfficeHolder(c,d.id);
 if(r.type==='school_dismiss'){
  check(holder===actor,'This member does not hold that office.');out.simEffects.push(fact(actor,d.id,false),fact(actor,'appointmentReadyAt',c.clock+1440));out.message='The office is vacant. The former holder keeps their qualifications, earned wages and monthly booking history.';
 }else if(r.type==='school_appoint'){
  check(!holder,'This local office already has its actual holder.');check(!SCHOOL_OFFICES.some(o=>schoolOfficeHolder(c,o.id)===actor),'One local office per person leaves time for their existing household work.');
  check(c.clock>=(flags(c,actor)['home.schoolOffice.appointmentReadyAt']||0),'This member needs a played day after changing appointments.');
  check(amount(c,actor,'schoolRank')>=d.rank&&amount(c,actor,'schoolReports')>=d.reports,'This office requires its own teaching qualification and completed reports.');check(amount(c,S,'estateFunds')>=3,'The appointment costs three actual estate coins.');
  out.simEffects.push(res(S,'estateFunds',-3),res(actor,'wages',3),fact(actor,d.id,true),fact(actor,'appointmentReadyAt',c.clock+1440));out.message='The qualified member accepts this specific office and its disclosed funded monthly terms. The three-coin induction pay comes from the estate treasury.';
 }else{
  if(d.id==='instruction')check(activeHouseholdField(c),'The monthly practical lesson needs the actual powered field.');
  check(holder===actor,'Appoint this qualified member to the actual office first.');const early=c.clock<(flags(c,actor)['home.schoolOffice.monthReadyAt']||0);
  if(early)check(r.early===true,'This member has already booked this school month. An extra session can be paid for now ('+EARLY_SESSION_COST+' estate coins) by asking for the top-up.');
  if(early)check(amount(c,S,'estateFunds')>=EARLY_SESSION_COST,'An extra session costs '+EARLY_SESSION_COST+' estate coins and the estate has fewer.');
  if(early)out.simEffects.push(res(S,'estateFunds',-EARLY_SESSION_COST));
  out.simEffects.push(fact(actor,'monthReadyAt',Math.max(c.clock,flags(c,actor)['home.schoolOffice.monthReadyAt']||0)+(early?SCHOOL_MONTH/ EARLY_SPREAD:SCHOOL_MONTH)));out.job={id:'home.school.month.'+d.id+'.'+actor,actor};out.message='The monthly appointment reserves actual effort and the finite estate stipend for sixty played minutes. It grants its result only on completion. Cancellation refunds unearned pay and inputs; this person’s monthly booking remains used. There is no absent or unfunded monthly gain.';
 }
 return true;
}
export function renderSchoolOffices({panel,c,el,action}){
 panel.append(el('p','Three local school offices. Appointment costs 3 estate coins, one office per member, with a played day before reassignment. Each holder can book one 60-minute funded appointment per 30 played days; no missed-month catch-up.'));
 for(const d of SCHOOL_OFFICES){const holder=schoolOfficeHolder(c,d.id),name=SCHOOL_ROSTER.find(([id])=>id===holder)?.[1];const box=el('details');box.append(el('summary',d.name+' · '+(name||'vacant')),el('p',`Qualification ${d.rank}, ${d.reports} reports; monthly stipend ${d.stipend} estate coins. ${d.id==='instruction'?'A powered-field lesson spends 1 contribution and teaches 24 native Meditation XP.':d.id==='survey'?'One real charcoal supports one of the holder’s six station reports and earns 1 contribution.':'Maintaining the learned records earns 1 contribution; this is paid clerical work, with no copied bodily practice.'}`));panel.append(box);
  if(holder){action(box,'school_month:'+d.id,'Book this monthly appointment',{type:'school_month',office:d.id,actor:holder});action(box,'school_month_early:'+d.id,'Pay for an extra session now ('+EARLY_SESSION_COST+' coins)',{type:'school_month',office:d.id,actor:holder,early:true});action(box,'school_dismiss:'+d.id,'Vacate this school office',{type:'school_dismiss',office:d.id,actor:holder});box.append(el('p',`Next monthly booking at played minute ${flags(c,holder)['home.schoolOffice.monthReadyAt']||0}.`));}
  else for(const [id,n]of SCHOOL_ROSTER)action(box,'school_appoint:'+d.id+':'+id,'Appoint '+n,{type:'school_appoint',office:d.id,actor:id});
 }
}
