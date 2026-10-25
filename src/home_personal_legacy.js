// Personal bequests live on the actual actor. Unclassified goods, estate treasury and office funds
// belong to their institution and never enter this transfer.
import {SCHOOL_ROSTER,SCHOOL_ROOM} from './home_school_content.js';
const ids=SCHOOL_ROSTER.map(([id])=>id),res=(actor,key,amount)=>({type:'resource',actor,key,amount}),fact=(actor,key,value)=>({type:'fact',scope:'actor',actor,key:'home.legacy.'+key,value});
const eq=(fact,value)=>({fact,op:'eq',value}),ready={all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},{fact:'resource.home.energy',op:'gte',value:10}]};
export const legacyCommands=[];
for(const [actor,name]of SCHOOL_ROSTER)for(const [next,nextName]of SCHOOL_ROSTER)if(actor!==next)legacyCommands.push({id:'home.legacy.agreement.'+actor+'.'+next,revision:1,label:name+' and '+nextName+' record a personal bequest',worldId:'base.frontier',group:'home_work',actorId:actor,targetId:next,location:SCHOOL_ROOM,duration:15,participants:[actor,next],participantsCoLocated:true,completionCoLocated:true,cancellation:'refund',reservationReturns:1,completionFailure:'refund',
 requires:{all:[ready,eq('target.life','alive'),eq('target.actor.home.employed',true),{not:eq('target.actor.home.leave',true)},{fact:'target.resource.home.energy',op:'gte',value:10}]},completionRequires:{all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},eq('target.actor.home.employed',true),{not:eq('target.actor.home.leave',true)},eq('target.life','alive')]},
 costs:[res(actor,'home.energy',-10),res(next,'home.energy',-10)],effects:[fact(actor,'beneficiary',next),{type:'relationship',actor,target:next,axis:'familiarity',amount:1,text:'They jointly recorded an agreed personal bequest. Institutional stock and office funds remain separate.'}]});
export function planPersonalLegacy(s,r,c,out){
 if(!['legacy_agree','legacy_cancel'].includes(r.type))return false;
 const check=(v,m)=>{if(!v)throw Error('Home: '+m);};check(s.properties.manor?.access&&c.location===SCHOOL_ROOM,'Meet the actual household in the manor.');
 if(r.type==='legacy_cancel'){const j=c.jobs.find(j=>j.id===r.job&&j.commandId.startsWith('home.legacy.'));check(j,'This actual appointment has changed.');out.job={cancel:j.id,actor:j.actorId};out.message='The unfinished agreement is withdrawn. Reserved effort returns; an earlier completed bequest remains the person’s actual instruction.';return true;}
 check(ids.includes(r.actor)&&ids.includes(r.next)&&r.actor!==r.next,'Choose two different actual household members.');
 check(!c.staffFacts?.[r.actor]?.['home.legacy.settled'],'This person’s personal estate has already settled.');
 check(c.staffFacts?.[r.actor]?.['home.legacy.beneficiary']!==r.next,'This agreed instruction already names that beneficiary.');
 out.job={id:'home.legacy.agreement.'+r.actor+'.'+r.next,actor:r.actor};out.message='Both willing people reserve fifteen minutes and ten effort each to record the personal bequest. Completion replaces that person’s instruction. Death leaves their own earned wage purse to this living recipient; institutional funds and qualified offices keep their existing owners. An absent or dead beneficiary leaves the personal estate held.';return true;
}
export function stagePersonalLegacies(plan,c,apply){
 if(c.world!=='base.frontier')return;
 const effects=[],s=plan.state.simulation;if(!s)return;
 for(const actor of ids){
  const owner=plan.state.actors[actor],next=owner?.facts['home.legacy.beneficiary'];if(!ids.includes(next)||owner.facts['home.legacy.settled']||s.people[actor]?.life!=='dead')continue;
  if(s.people[actor].location!==SCHOOL_ROOM||s.people[next]?.life!=='alive'||s.people[next].location!==SCHOOL_ROOM||plan.state.actors[next]?.worldId!=='base.frontier')continue;
  if(s.jobs.some(j=>(j.participants||[j.actorId]).includes(actor))||Object.values(s.custody||{}).some(row=>row.holder===actor))continue;
  const wages=owner.resources['home.wages']||0;if(wages)effects.push(res(actor,'home.wages',-wages),res(next,'home.wages',wages));
  effects.push(fact(actor,'settled',true),{type:'knowledge',actor:next,key:'home.legacy.receipt.'+actor,stage:'understood',value:`The agreed personal estate from ${SCHOOL_ROSTER.find(([id])=>id===actor)[1]} settled: ${wages} earned coins. Stock held for household work, institutional budgets and offices stayed with their existing owners.`});
 }
 if(effects.length)apply(effects);
}
export function renderPersonalLegacy({staff,view,el,action}){
 const c=view.context;if(!view.homes.some(h=>h.id==='manor'))return;const box=el('details');box.append(el('summary','Personal bequests'),el('p','Each willing member can name another person through a shared 15-minute appointment. Their own wages and unencumbered private goods pass after death when the living beneficiary is at the manor. Offices, estate funds, qualifications and bodies keep their own rules. Busy or absent estates remain held.'));staff.append(box);
 for(const [id,name]of SCHOOL_ROSTER){const flags=c.staffFacts?.[id]||{},next=SCHOOL_ROSTER.find(([n])=>n===flags['home.legacy.beneficiary'])?.[1];box.append(el('p',`${name}: ${flags['home.legacy.settled']?'personal estate settled':next?'agreed beneficiary '+next:'no personal bequest recorded'}.`));if(c.people?.[id]?.life==='alive')for(const [other,n]of SCHOOL_ROSTER)if(other!==id)action(box,'legacy_agree:'+id+':'+other,`${name} names ${n}`,{type:'legacy_agree',actor:id,next:other});}
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.legacy.')))action(box,'legacy_cancel:'+j.id,'Withdraw unfinished bequest appointment',{type:'legacy_cancel',job:j.id});
}
