import {FEATURE_HARNESS,FEATURE_KIT,FEATURE_LOG} from './feature_expansion_powers.js';
import {COHORT_MEMBERS,COHORT_COACHES,COHORT_ROOM} from './cohort_battle_facts.js';
import {cohortFrameFit,cohortFrameShape} from './cohort_gear_facts.js';
import {previewHomeJob,stageHomeJob} from './home_work.js';
const eq=(fact,value=true)=>({fact,op:'eq',value}),gte=(fact,value)=>({fact,op:'gte',value}),all=(...rules)=>({all:rules}),coach=COHORT_COACHES[0];
const res=(actor,key,amount)=>({type:'resource',actor,key,amount}),item=(actor,key,amount)=>({type:'item',actor,key,amount});
const consent=all(eq('actor.life','alive'),eq('actor.home.employed'),{not:eq('actor.home.leave')},eq('actor.cohort.willing'),eq('target.life','alive'));
const physical=all(consent,eq('body.form','human'),gte('body.hands',2),eq('body.mobile'),gte('resource.cohort.training',1));
const command=(actor,kind,extra)=>({id:`cohort.gear.${actor}.${kind}`,revision:1,actorId:actor,targetId:coach,worldId:'base.frontier',group:'cohort_gear',location:COHORT_ROOM,participants:[actor,coach],participantsCoLocated:true,completionCoLocated:true,cancellation:'refund',reservationReturns:1,completionFailure:'refund',costs:[],effects:[],...extra});
export const cohortGearCommands=COHORT_MEMBERS.flatMap(actor=>[
 command(actor,'build',{label:'Build and fit the member’s braced field harness',duration:30,requires:all(physical,eq('cohort.gearBuildReady'),gte('resource.home.energy',20)),completionRequires:physical,costs:[item('player',FEATURE_KIT,-2),item('player',FEATURE_LOG,-2),res(actor,'home.energy',-20),res('home.manor.steward','home.estateFunds',-4)],effects:[res(actor,'home.wages',2),res(coach,'coins',2),item(actor,FEATURE_HARNESS,1),{type:'equipment',actor,slot:'field_frame',key:FEATURE_HARNESS}],description:'The same two-kit/two-log frame is made with carried hand tools and fitted to this actual person over thirty minutes. Four estate coins pay two wages and two instruction fees. The real frame belongs to the member, stays in their equipment custody and supplies the same native two defense/four-strength block; their own physical control sets its block chance.'}),
 command(actor,'fit',{label:'Fit the member’s existing owned frame',duration:15,requires:all(physical,gte('item.'+FEATURE_HARNESS,1)),completionRequires:physical,costs:[res(actor,'home.energy',-5),res('home.manor.steward','home.estateFunds',-2)],effects:[res(actor,'home.wages',1),res(coach,'coins',1),{type:'equipment',actor,slot:'field_frame',key:FEATURE_HARNESS}],description:'Fifteen minutes and two estate coins adjust this member’s own actual frame for the present supported body. No new item or learned power is produced.'}),
 command(actor,'park',{label:'Unbuckle the member’s fitted frame',duration:2,requires:all(consent,eq('cohort.gearParkReady')),completionRequires:consent,effects:[{type:'equipment',actor,slot:'field_frame',key:null}],description:'Two actual minutes with the instructor unbuckle the frame. It stays in the member’s own inventory; native defense/block return to the body’s ordinary values.'})
]);
export function bookCohortGear(plan,registry,c,actor,kind,{preview=false}={}){
 const p=plan.state.simulation?.people[actor],a=plan.state.actors[actor];
 if(!COHORT_MEMBERS.includes(actor)||!p?.body||!a||!['build','fit','park'].includes(kind))throw Error('Choose the actual household member and a known frame appointment.');
 const s=plan.state.simulation,owns=(s.owners[actor]?.[FEATURE_HARNESS]||0)>0;
 if(kind==='build'&&owns)throw Error('Fit this member’s existing actual frame before making another.');
 if(kind==='fit'&&cohortFrameFit(plan.state,actor).active)throw Error('The actual frame is already fitted to this supported body.');
 p.body.frameBuild??='ordinary';
 p.body.cohortGearAnchor??=`${actor}:${plan.state.sequence}`;
 const request={id:`cohort.gear.${actor}.${kind}`,actor},context={...c,facts:{...c.facts,'cohort.gearBuildReady':!owns,'cohort.gearParkReady':s.equipment[actor]?.field_frame===FEATURE_HARNESS}};
 if(preview)return previewHomeJob(plan,request,registry,context);
 stageHomeJob(plan,request,registry,context);const j=plan.state.simulation.jobs.find(j=>j.commandId===request.id&&j.actorId===actor),body=plan.state.simulation.people[actor].body;
 if(kind!=='park'){
  j.completionSupport.requires=all(j.completionSupport.requires,eq('body.cohortGearAnchor',body.cohortGearAnchor),...['id','instanceId','form','hands','frameBuild'].filter(k=>['string','number','boolean'].includes(typeof body[k])).map(k=>eq('body.'+k,body[k])));
  j.effects.push({type:'fact',scope:'actor',actor,key:'cohort.frameShape',value:cohortFrameShape(plan.state.simulation.people[actor])});
 }
 return j;
}
