// E5b: an institution office. The pantry office belongs to the household, not to
// whoever holds it: its fund and standing policy move to a successor, while each
// person's wages, energy, skills and relationships stay their own.
import {STEWARD,COOK,KEEPER,OFFICE_HOLDERS} from './home_work_content.js';
import {SUPPLIER} from './home_household_content.js';
import {homeKey as k,HOME_PLACES as P} from './home_content.js';
import {staffReadiness} from './home_household.js';
export const OFFICE_TERMS=Object.freeze({establish:16,orderCost:8,threshold:2,meat:4,logs:2});
const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const fact=(actor,value)=>({type:'fact',scope:'actor',actor,key:'home.officeHolder',value});
const names={[STEWARD]:'Rowan',[KEEPER]:'Toma'};
export const officeHolder=c=>OFFICE_HOLDERS.find(id=>c.staffFacts?.[id]?.['home.officeHolder']===true)||null;
// The disclosed policy, evaluated from saved state only. 'order' means the root
// clock should start the holder's standing order now; anything else is shown.
export function officeDecision(c){
 const holder=officeHolder(c);if(!holder)return {status:'none',reason:'No pantry office is established.'};
 const who=names[holder],funds=c.staffResources?.[holder]?.['home.officeFunds']||0,meat=c.staffStock?.[COOK]?.[k('Rat meat chunks')]||0;
 const ready=staffReadiness(c,holder),floor=c.staffFacts?.[holder]?.['home.officeReserveFloor']||0;
 if(c.staffFacts?.[holder]?.['home.officeReviewRequired']===true)return {status:'paused',holder,reason:who+' must review the actual standing agreement before spending institutional funds.'};
 if(c.jobs?.some(j=>j.commandId.startsWith('home.office.restock.')||j.commandId==='home.household.pantry'))return {status:'waiting',holder,reason:'A provision delivery is already on its way.'};
 if(c.jobs?.some(j=>(j.participants||[j.actorId]).includes(holder)))return {status:'paused',holder,reason:who+' is occupied by another actual appointment; the standing order waits.'};
 if(meat>=OFFICE_TERMS.threshold)return {status:'idle',holder,reason:`The kitchen holds ${meat} meat chunks; ${who} orders when it falls below ${OFFICE_TERMS.threshold}.`};
 if(ready!=='willing to consider a funded request')return {status:'paused',holder,reason:`${who} is ${ready}; the standing order waits.`};
 if(funds<OFFICE_TERMS.orderCost+floor)return {status:'paused',holder,reason:`The office fund holds ${funds} of the ${OFFICE_TERMS.orderCost} coins an order costs, retaining a ${floor}-coin office reserve.`};
 const supplier=c.people?.[SUPPLIER],stock=c.staffStock?.[SUPPLIER]||{};
 if(supplier?.life!=='alive'||supplier.location!=='Village')return {status:'paused',holder,reason:'Mara must be back in Village before another order.'};
 if((stock[k('Rat meat chunks')]||0)<OFFICE_TERMS.meat||(stock[k('Rough wood log')]||0)<OFFICE_TERMS.logs)return {status:'paused',holder,reason:'Mara’s Village stock cannot fill a full order.'};
 return {status:'order',holder,reason:`${who} is placing the standing provision order.`,job:{id:`home.office.restock.${holder}`,actor:holder}};
}
export function planHomeOffice(s,r,c,out){
 if(!['office_cancel','office_earn','office_train','office_review','office_establish','office_close','office_succeed'].includes(r.type))return false;
 check(s.properties.manor?.access&&c.location===P.manor.location&&c.body.form==='human','meet the household at the manor with a supported body');
 const worker=c.playerFacts?.['home.institutionWorker']===true,officer=c.playerFacts?.['home.provisionOfficer']===true;
 const flag=(actor,key,value)=>({type:'fact',scope:'actor',actor,key:'home.'+key,value});
 const holder=officeHolder(c),busy=id=>c.jobs?.some(j=>(j.participants||[j.actorId]).includes(id));
 if(r.type==='office_cancel'){
  check(officer,'Meet the earned provision officer to withdraw an office appointment.');const job=c.jobs.find(j=>j.id===r.job&&j.commandId.startsWith('home.office.'));check(job,'The actual office appointment changed.');out.job={cancel:job.id,actor:job.actorId};out.message='The office withdraws the unfinished appointment. Exact unearned funds, goods and effort return to their actual owners.';
 }else if(r.type==='office_earn'){
  check(worker&&!officer&&c.playerFacts?.['home.familyDutyKept']===true&&(c.resources['home.readingPractice']||0)>=12,'Study the actual primer and complete the household ledger appointment before earning this office.');
  out.simEffects.push(flag('player','provisionOfficer',true));out.message='Your completed ledger work and primer study earn the provision office. You may appoint a qualified steward and fund its actual standing agreement; estate property remains the household’s.';
 }else if(r.type==='office_train'){
  check(officer,'Earn the provision office before commissioning steward instruction.');check(!c.staffFacts?.[KEEPER]?.['home.officeQualified'],'Toma already completed the steward instruction.');
  check(staffReadiness(c,STEWARD)==='willing to consider a funded request'&&staffReadiness(c,KEEPER)==='willing to consider a funded request','Rowan and Toma must both be available for the shared ledger instruction.');
  out.job={id:'home.office.instruction',actor:KEEPER};out.message='Rowan and Toma reserve ten played minutes to study this office’s actual stock, delivery and reserve terms. Completion qualifies Toma; no mastery, body or personal relationship is transferred.';
 }else if(r.type==='office_review'){
  check(holder&&c.staffFacts[holder]?.['home.officeReviewRequired']===true&&!busy(holder),'The current successor has no idle pending agreement to review.');
  check(staffReadiness(c,holder)==='willing to consider a funded request',staffReadiness(c,holder));
  out.simEffects.push(flag(holder,'officeReviewRequired',false),{type:'knowledge',actor:holder,key:'home.office.agreement',stage:'understood',value:'Reviewed standing terms: order four meat chunks and two logs for eight institutional coins when kitchen meat falls below two; retain four office coins. Pause for absence, rest, shortage or another delivery.'});
  out.message=names[holder]+' reviews and accepts the retained provision agreement. Automatic requests may resume subject to reserve, availability and finite supplier stock.';
 }else if(r.type==='office_establish'){
  check(!worker||officer,'Earn provision-office authority before assigning an institutional steward or budget.');
  check(!holder,'the pantry office already exists');check(staffReadiness(c,STEWARD)==='willing to consider a funded request',staffReadiness(c,STEWARD));
  check((c.staffResources?.[STEWARD]?.['home.estateFunds']||0)>=OFFICE_TERMS.establish,`the household treasury needs ${OFFICE_TERMS.establish} coins to fund the office`);
  out.simEffects.push(res(STEWARD,'home.estateFunds',-OFFICE_TERMS.establish),res(STEWARD,'home.officeFunds',OFFICE_TERMS.establish),fact(STEWARD,true));
  if(worker)out.simEffects.push(flag(STEWARD,'officeReserveFloor',4),flag(STEWARD,'officeReviewRequired',false),{type:'knowledge',actor:STEWARD,key:'home.office.agreement',stage:'understood',value:'Accepted provision-office terms: finite eight-coin orders; retain four office coins; review terms after succession.'});
  out.message=`Rowan takes the pantry office with ${OFFICE_TERMS.establish} household coins set aside. Whenever the kitchen falls below ${OFFICE_TERMS.threshold} meat chunks, he orders ${OFFICE_TERMS.meat} chunks and ${OFFICE_TERMS.logs} logs from Mara for ${OFFICE_TERMS.orderCost} office coins. He pauses when resting, on leave, short of funds or when Mara cannot supply.`;
 }else if(r.type==='office_close'){
  check(!worker||officer,'Only the earned provision officer can withdraw this mandate.');
  check(holder&&!busy(holder),'wait for the current standing order to finish');const funds=c.staffResources[holder]['home.officeFunds']||0;
  out.simEffects.push(res(holder,'home.officeFunds',-funds),res(STEWARD,'home.estateFunds',funds),fact(holder,false));
  out.message=`The pantry office closes. Its remaining ${funds} coins return to the household treasury.`;
 }else{
  check(!worker||officer,'Earn provision-office authority before changing its delegate.');
  check(holder,'establish the pantry office first');const next=OFFICE_HOLDERS.find(id=>id!==holder);
  check(worker||staffReadiness(c,holder)!=='willing to consider a funded request','the legacy family mandate changes when its holder is unavailable; the earned provision office also supports a voluntary handover.');
  check(!busy(holder),'wait for the current standing order to finish');
  check(!worker||c.staffFacts?.[next]?.['home.officeQualified']===true||next===STEWARD,'Complete shared ledger instruction before appointing this successor.');
  check(staffReadiness(c,next)==='willing to consider a funded request',`${names[next]} is ${staffReadiness(c,next)}`);
  const funds=c.staffResources[holder]['home.officeFunds']||0;
  out.simEffects.push(res(holder,'home.officeFunds',-funds),res(next,'home.officeFunds',funds),fact(holder,false),fact(next,true));
  if(worker)out.simEffects.push(flag(next,'officeReserveFloor',c.staffFacts[holder]?.['home.officeReserveFloor']||4),flag(next,'officeReviewRequired',true));
  out.message=`${names[next]} takes over the pantry office and its ${funds}-coin fund under the same disclosed policy. ${names[holder]}’s own wages and experience stay ${holder===STEWARD?'his':'theirs'}.`;
 }
 return true;
}
