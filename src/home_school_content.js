import {SUPPLIER} from './home_household_content.js';
// A small household school, using the existing people's reserved work queues.
import {QI_FIELD} from './cultivation_items.js';
export const SCHOOL_ROSTER=[['home.manor.keeper','Toma'],['home.manor.cook','Iven'],['home.manor.steward','Rowan'],['home.manor.tutor','Sera']];
export const SCHOOL_VISITOR=SUPPLIER;
export const SCHOOL_STUDENTS=[...SCHOOL_ROSTER,[SCHOOL_VISITOR,'Mara (visiting provisioner)']];
export const SCHOOL_ROOM='Arlmere family manor',SCHOOL_STEWARD='home.manor.steward';
const K='home.manor.keeper',S=SCHOOL_STEWARD;
const eq=(fact,value)=>({fact,op:'eq',value});
const atLeast=(fact,value)=>({fact,op:'gte',value});
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const ready={all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},atLeast('resource.home.energy',20)]};
const field={all:[eq('target.life','alive'),eq('target.location',SCHOOL_ROOM),atLeast(`target.condition.${QI_FIELD}`,1)]};
const job=(id,label,actorId,extra)=>({id:'home.school.'+id,revision:1,label,worldId:'base.frontier',group:'home_work',actorId,location:SCHOOL_ROOM,duration:30,cancellation:'refund',reservationReturns:1,completionFailure:'refund',costs:[],effects:[],...extra});
export const schoolCommands=[];
for(const [actor,name] of SCHOOL_STUDENTS){
 schoolCommands.push(job('study.'+actor,name+' studies circulation',actor,{targetId:K,requires:{all:[ready,field,{not:atLeast('resource.home.cultivationPractice',6)}]},completionRequires:field,
  costs:[res(actor,'home.energy',-20),res(S,'home.estateFunds',-2)],effects:[res(actor,'home.wages',2),res(actor,'home.cultivationPractice',1)]}));
 // Reporting surveys an actual finite syllabus, rather than respawning loot.
 for(const fast of [false,true])schoolCommands.push(job('survey.'+actor+(fast?'.qualified':''),name+' surveys the estate circulation stations',actor,{duration:fast?30:45,requires:{all:[ready,...(fast?[atLeast('resource.home.schoolRank',1)]:[]),{not:atLeast('resource.home.schoolReports',6)}]},completionRequires:eq('actor.home.employed',true),
  costs:[res(actor,'home.energy',-20),res(S,'home.estateFunds',-2),{type:'item',actor:'player',key:JSON.stringify({id:'Charcoal'}),amount:-1}],effects:[res(actor,'home.wages',2),res(actor,'home.schoolReports',1),res('player','home.cultivationContributions',1)]}));
 schoolCommands.push(job('lesson.'+actor,'Practice circulation with '+name,actor,{targetId:K,participants:[actor,'player'],participantsCoLocated:true,completionCoLocated:true,
  requires:{all:[ready,field,atLeast('resource.home.cultivationPractice',2),atLeast('resource.home.schoolRank',1)]},completionRequires:{all:[field,atLeast('resource.home.cultivationPractice',2)]},
  costs:[res(actor,'home.energy',-20),res(S,'home.estateFunds',-3),res('player','home.cultivationContributions',-1)],effects:[res(actor,'home.wages',3),{type:'unlock',actor:'player',kind:'skill',id:'Meditation'},{type:'xp',actor:'player',skill:'Meditation',amount:18},res(actor,'home.schoolLessons',1)]}));
}
schoolCommands.push(job('visit.'+SCHOOL_VISITOR,'Mara rests and joins the visiting circulation class',SCHOOL_VISITOR,{requires:{all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},{not:eq('actor.home.schoolVisitor',true)}]},completionRequires:{all:[eq('actor.home.employed',true),eq('actor.life','alive'),eq('location',SCHOOL_ROOM),{not:eq('actor.home.leave',true)}]},costs:[{type:'item',actor:'player',key:JSON.stringify({id:'Stale bread'}),amount:-1}],effects:[res(SCHOOL_VISITOR,'home.energy',{fact:'resource.home.energy',scale:-1,add:60,min:0,max:30}),{type:'fact',scope:'actor',actor:SCHOOL_VISITOR,key:'home.schoolVisitor',value:true}],description:'A real thirty-minute rest and one carried bread prepare the visiting provisioner for study, restoring up to thirty work effort within the ordinary sixty-effort budget. The appointment occupies Mara’s actual queue. It grants no circulation practice, teaching rank, combat instruction or filled combat vitals.'}));
// The player can do the same report personally. Delegation buys their time,
// and an earned qualification shortens work without changing its result.
schoolCommands.push(job('survey.player','Survey the estate circulation stations personally','player',{duration:45,requires:{all:[atLeast('body.hands',1),{not:atLeast('resource.home.schoolReports',6)}]},completionRequires:eq('location',SCHOOL_ROOM),
 costs:[{type:'item',actor:'player',key:JSON.stringify({id:'Charcoal'}),amount:-1}],effects:[res('player','home.schoolReports',1),res('player','home.cultivationContributions',1),{type:'event',actor:'home.manor.tutor',target:'player',eventId:'home.contacts.report_return',delay:1440}]}));
// Pair meetings are deterministic partial tournaments. Scores are frozen at
// entry by the simulation's ordinary numeric-effect resolver. No fake fighter.
for(let i=0;i<SCHOOL_STUDENTS.length;i++)for(let j=i+1;j<SCHOOL_STUDENTS.length;j++){
 const [a,an]=SCHOOL_STUDENTS[i],[b,bn]=SCHOOL_STUDENTS[j];
 schoolCommands.push(job('meet.'+a+'.'+b,an+' and '+bn+' compare circulation forms',a,{targetId:b,participants:[a,b],participantsCoLocated:true,completionCoLocated:true,duration:30,
  requires:{all:[ready,eq('target.life','alive'),atLeast('target.resource.home.energy',20)]},completionRequires:{all:[eq('actor.home.employed',true),eq('target.life','alive')]},
  costs:[res(a,'home.energy',-20),res(b,'home.energy',-20),res(S,'home.estateFunds',-4)],
  effects:[res(a,'home.wages',2),res(b,'home.wages',2),res(a,'home.schoolMeetScore',{fact:'resource.home.cultivationPractice',min:0,max:6}),res(b,'home.schoolMeetScore',{fact:'target.resource.home.cultivationPractice',min:0,max:6}),res(a,'home.schoolMeets',1),res(b,'home.schoolMeets',1)]}));
}

// Monthly office work is an attended, funded appointment, not a second clock.
for(const [actor,name]of SCHOOL_ROSTER)for(const [office,rank,stipend]of [['instruction',1,4],['survey',1,4],['records',2,5]]){
 const instruction=office==='instruction',survey=office==='survey';
 schoolCommands.push(job('month.'+office+'.'+actor,name+' completes the '+office+' office appointment',actor,{duration:60,
  ...(instruction?{targetId:K,participants:[actor,'player'],participantsCoLocated:true,completionCoLocated:true}:{}),
  requires:{all:[ready,eq('actor.home.schoolOffice.'+office,true),atLeast('resource.home.schoolRank',rank),...(instruction?[field]:[]),...(survey?[{not:atLeast('resource.home.schoolReports',6)}]:[])]},
  completionRequires:{all:[eq('actor.home.employed',true),eq('actor.home.schoolOffice.'+office,true),...(instruction?[field]:[])]},
  costs:[res(actor,'home.energy',-20),res(S,'home.estateFunds',-stipend),...(instruction?[res('player','home.cultivationContributions',-1)]:[]),...(survey?[{type:'item',actor:'player',key:JSON.stringify({id:'Charcoal'}),amount:-1}]:[])],
  effects:[res(actor,'home.wages',stipend),res(actor,'home.schoolMonths',1),...(instruction?[{type:'unlock',actor:'player',kind:'skill',id:'Meditation'},{type:'xp',actor:'player',skill:'Meditation',amount:24}]:[res('player','home.cultivationContributions',1)]),...(survey?[res(actor,'home.schoolReports',1)]:[])]}));
}

// Circuit appointments retain the same actual pair performance resolver. Only
// their institutional payer and cumulative receipt keys differ.
for(const original of schoolCommands.filter(d=>d.id.startsWith('home.school.meet.')&&SCHOOL_ROSTER.some(([id])=>id===d.actorId)&&SCHOOL_ROSTER.some(([id])=>id===d.targetId))){const d=structuredClone(original);d.id=d.id.replace('home.school.meet.','home.school.tournament.');d.label+=' · forms circuit';for(const e of d.costs)if(e.key==='home.estateFunds')e.key='home.schoolMatchFund';for(const e of d.effects){if(e.key==='home.schoolMeetScore')e.key='home.schoolCircuitScore';if(e.key==='home.schoolMeets')e.key='home.schoolCircuitMeets';}d.completionRequires={all:[d.completionRequires,{not:eq('actor.home.leave',true)},eq('target.actor.home.employed',true),{not:eq('target.actor.home.leave',true)}]};schoolCommands.push(d);}
