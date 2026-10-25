// A local physical curriculum, booked through the same paid household jobs.
import {COHORT_MEMBERS,COHORT_COACHES,COHORT_ROOM} from './cohort_battle_facts.js';
import {previewHomeJob,stageHomeJob} from './home_work.js';
const eq=(fact,value=true)=>({fact,op:'eq',value}),gte=(fact,value)=>({fact,op:'gte',value}),all=(...rules)=>({all:rules});
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const supported=all(eq('actor.life','alive'),eq('actor.home.employed'),{not:eq('actor.home.leave')},eq('body.form','human'),eq('body.mobile'),gte('body.hands',2),eq('actor.cohort.willing'),eq('target.life','alive'));
const bread=JSON.stringify({id:'Stale bread'}),coach=COHORT_COACHES[0];
export const temperingId=(actor,stage,insured)=>`cohort.temper.${actor}.${stage}.${insured?'patient':'lean'}`;
export function temperingTerms(state,actor,insured=false){
 const a=state.actors[actor],p=state.simulation?.people[actor],stage=p?.body?.cohortTempering||0,learning=a?.resources['cohort.temperLearning']||0,strain=a?.resources['cohort.temperStrain']||0,practice=a?.resources['home.cultivationPractice']||0;
 const chance=insured?1:Math.max(.1,Math.min(.95,.65+.05*Math.min(4,learning)+.025*Math.min(6,practice)-.1*Math.min(5,strain)-.1*stage));
 return {stage,next:stage+1,chance,learning,strain,minutes:insured?60:30,bread:insured?5:1,fee:insured?8:4,health:20+8*(stage+1),stamina:12+4*(stage+1)};
}
const job=d=>({revision:1,worldId:'base.frontier',group:'cohort_tempering',location:COHORT_ROOM,targetId:coach,coLocated:true,participantsCoLocated:true,completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,costs:[],effects:[],...d});
export const cohortTemperingCommands=COHORT_MEMBERS.flatMap(actor=>[
 ...[1,2,3].flatMap(stage=>[false,true].map(insured=>job({id:temperingId(actor,stage,insured),actorId:actor,participants:[actor,coach],label:`Physical tempering ${stage} · ${insured?'patient provision':'lean provision'}`,duration:insured?60:30,requires:all(supported,eq('cohort.temperingReady'),eq('body.cohortTempering',stage-1),gte('resource.cohort.training',1),gte('resource.home.schoolRank',1),gte('resource.home.cultivationPractice',2),gte('resource.home.energy',20),gte('vital.health',6),gte('vital.stamina',4),gte('target.vital.health',2),gte('target.vital.stamina',1)),completionRequires:supported,
 costs:[res(actor,'home.energy',-20),res('home.manor.steward','home.estateFunds',insured?-8:-4),{type:'item',actor:'player',key:bread,amount:insured?-5:-1},{type:'vital',actor,key:'stamina',amount:-2},{type:'vital',actor:coach,key:'stamina',amount:-1}],
 effects:[res(actor,'home.wages',insured?4:2),res(coach,'coins',insured?4:2)],
 outcomes:[{id:'settled',weight:{fact:'cohort.temperingChance'},effects:[{type:'body',actor,key:'cohortTempering',value:stage},{type:'vital',actor,key:'health',amount:0,minimumCapacity:20+stage*8},{type:'vital',actor,key:'stamina',amount:0,minimumCapacity:12+stage*4},res(actor,'cohort.temperStrain',{fact:'resource.cohort.temperStrain',scale:-1})]},{id:'unsettled',weight:{fact:'cohort.temperingChance',scale:-1,add:1},effects:[res(actor,'cohort.temperLearning',1),res(actor,'cohort.temperStrain',1),{type:'vital',actor,key:'health',amount:-2}]}],description:'The disclosed chance uses this person’s circulation practice, prior lessons from failed attempts and accumulated strain. A lean failure leaves two health of soreness, one retained lesson and one strain; the stage stays unchanged. Patient provisioning pays for slower continuous care and removes this procedure’s failure risk. Success supports the stated health/stamina capacity in this actual body, without healing or reducing a stronger body.'}))),
 job({id:'cohort.calm.'+actor,actorId:actor,participants:[actor,coach],label:'Guided recovery from tempering strain',duration:30,requires:all(supported,gte('resource.cohort.temperStrain',1)),completionRequires:supported,costs:[res('home.manor.steward','home.estateFunds',-2),{type:'item',actor:'player',key:bread,amount:-1}],effects:[res(actor,'home.wages',1),res(coach,'coins',1),res(actor,'cohort.temperStrain',-1)],description:'One actual bread, two estate coins and thirty minutes of the person’s and instructor’s time ease one strain. Retained learning remains; this does not heal wounds or award a stage.'})
]);
export function prepareTempering(plan,actor){
 const p=plan.state.simulation?.people[actor],a=plan.state.actors[actor];
 if(!COHORT_MEMBERS.includes(actor)||!p?.body||!a)throw Error('Meet an actual physically instructed household member.');
 p.body.cohortTempering??=0;
 // The physical body's own marker is created only in the booking transaction.
 p.body.cohortTemperingAnchor??=`${actor}:${plan.state.sequence}`;
 for(const k of ['cohort.temperLearning','cohort.temperStrain'])a.resources[k]??=0;
}
export function temperingContext(plan,c,actor,insured){const t=temperingTerms(plan.state,actor,insured);return {...c,facts:{...c.facts,'cohort.temperingReady':true,'cohort.temperingChance':t.chance}};}
export function bookTempering(plan,registry,c,actor,insured,{preview=false}={}){
 prepareTempering(plan,actor);const t=temperingTerms(plan.state,actor,insured);
 if(t.stage>=3)throw Error('This local three-stage curriculum is complete; further methods need their own physical instruction.');
 const request={id:temperingId(actor,t.next,insured),actor},context=temperingContext(plan,c,actor,insured);
 if(preview)return previewHomeJob(plan,request,registry,context);
 stageHomeJob(plan,request,registry,context);
 const j=plan.state.simulation.jobs.find(j=>j.commandId===request.id&&j.actorId===actor),body=plan.state.simulation.people[actor].body;
 j.completionSupport.requires=all(j.completionSupport.requires,eq('body.cohortTemperingAnchor',body.cohortTemperingAnchor),eq('body.cohortTempering',t.stage),...['id','instanceId'].filter(k=>typeof body[k]==='string').map(k=>eq('body.'+k,body[k])));
 return j;
}
