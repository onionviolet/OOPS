import {planSchoolCircuit,renderSchoolCircuit} from './home_school_circuit.js';
import {planSchoolOffice,renderSchoolOffices} from './home_school_offices.js';
import {SCHOOL_ROSTER,SCHOOL_STUDENTS,SCHOOL_VISITOR,SCHOOL_ROOM,SCHOOL_STEWARD as S} from './home_school_content.js';
import {activeHouseholdField} from './home_cultivation_content.js';
const check=(v,m)=>{if(!v)throw Error('Home: '+m);};
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const fact=(actor,key,value)=>({type:'fact',scope:'actor',actor,key,value});
const ids=SCHOOL_STUDENTS.map(([id])=>id),value=(c,id,key)=>c.staffResources?.[id]?.['home.'+key]||0;
const flags=(c,id)=>id==='player'?c.playerFacts:c.staffFacts?.[id];
export function schoolRankQuote(c,id){
 const rank=value(c,id,'schoolRank'),practice=value(c,id,'cultivationPractice'),reports=value(c,id,'schoolReports'),contributions=c.resources['home.cultivationContributions']||0;
 const required=rank===0?{practice:2,reports:1,contributions:1,fee:4}:{practice:6,reports:2,contributions:3,fee:8};
 const reasons=[];if(rank>=2)reasons.push('This local school has awarded its highest teaching qualification.');
 if(practice<required.practice)reasons.push(`${required.practice} actual circulation studies needed.`);
 if(reports<required.reports)reasons.push(`${required.reports} completed station reports needed.`);
 if(contributions<required.contributions)reasons.push(`${required.contributions} retained school contributions needed.`);
 if((c.staffResources?.[S]?.['home.estateFunds']||0)<required.fee)reasons.push(`${required.fee} estate coins needed for the examination.`);
 return {rank,practice,reports,contributions,required,reasons};
}
export function planHomeSchool(s,r,c,out){
 if(!r.type.startsWith('school_'))return false;
 check(s.properties.manor?.access&&c.location===SCHOOL_ROOM&&c.body.form==='human','meet the household school in its actual room.');
 for(const id of [...ids,'player'])for(const key of ['cultivationPractice','schoolRank','schoolReports','schoolLessons','schoolMeetScore','schoolMeets'])if((id==='player'?c.resources:c.staffResources?.[id])?.['home.'+key]==null)out.simEffects.push(res(id,'home.'+key,0));
 if(planSchoolCircuit(s,r,c,out))return true;
 if(planSchoolOffice(r,c,out))return true;
 const busy=id=>c.jobs.some(j=>(j.participants||[j.actorId]).includes(id));
 if(r.type==='school_cancel'){const j=c.jobs.find(j=>j.id===r.job&&j.commandId.startsWith('home.school.'));check(j,'the school appointment changed.');out.job={cancel:j.id,actor:j.actorId};out.message='Unused effort, charcoal and examination pay return to their actual owners; no report or lesson is earned.';return true;}
 if(r.type==='school_fund'){check(Number.isSafeInteger(r.amount)&&r.amount>0&&r.amount<=c.money,'offer a whole amount of your actual carried coins.');out.money-=r.amount;out.simEffects.push(res(S,'home.estateFunds',r.amount));out.message='Your donation enters the existing estate treasury. Staff wages, reserved jobs and other household duties share that finite budget.';return true;}
 const actor=r.actor||'player';check(actor==='player'||ids.includes(actor),'choose an actual school member.');
 if(actor!=='player')check(c.people[actor]?.life==='alive'&&c.people[actor]?.location===SCHOOL_ROOM&&flags(c,actor)?.['home.employed']===true&&!flags(c,actor)?.['home.leave'],'meet this willing member here.');
 check(!busy(actor),'finish or cancel this person’s actual appointment first.');
 if(r.type==='school_visit'){
  check(actor===SCHOOL_VISITOR&&!flags(c,actor)?.['home.schoolVisitor'],'meet Mara for her uncompleted visiting-student agreement.');if(c.staffResources?.[actor]?.['home.energy']==null)out.simEffects.push(res(actor,'home.energy',0));out.job={id:'home.school.visit.'+actor,actor};out.message='Mara reserves thirty minutes and one actual carried bread to rest and join the visiting class. No study, rank or physical instruction is granted by enrollment.';return true;
 }
 if(actor===SCHOOL_VISITOR||r.other===SCHOOL_VISITOR)check(flags(c,SCHOOL_VISITOR)?.['home.schoolVisitor'],'Mara first needs her own visiting-class rest and agreement.');

 if(r.type==='school_promote'){
  check(actor!=='player','this examination awards the household teacher’s appointment.');const q=schoolRankQuote(c,actor);check(!q.reasons.length,q.reasons.join(' '));
  check(activeHouseholdField(c),'the practical examination needs the actual powered cradle.');
  out.simEffects.push(res(S,'home.estateFunds',-q.required.fee),res(S,'home.wages',q.required.fee),res(actor,'home.schoolRank',1));
  out.message=q.rank===0?'The completed studies and report earn an instructor’s qualification. Further school lessons can spend earned contribution credit.':'The experienced instructor earns the senior qualification. Their own work and wages remain with them.';return true;
 }
 if(r.type==='school_milestone'){
  check(actor!=='player'&&!flags(c,actor)?.['home.schoolMilestone']&&value(c,actor,'schoolRank')>=2&&value(c,actor,'schoolLessons')>=2,'a senior needs two completed lessons and must not have claimed this recognition.');
  out.simEffects.push(fact(actor,'home.schoolMilestone',true),{type:'title',actor,id:'arlmere.circulation.mentor',operation:'grant',issuer:S});out.message='The school records this person’s earned mentor milestone once, from their actual qualification and completed lessons.';return true;
 }
 if(r.type==='school_meet'){
  check(ids.includes(actor)&&ids.includes(r.other)&&ids.indexOf(actor)<ids.indexOf(r.other),'choose the displayed pair.');check(!busy(r.other),'the other member is occupied.');check(c.people[r.other]?.life==='alive'&&c.people[r.other]?.location===SCHOOL_ROOM&&flags(c,r.other)?.['home.employed']===true&&!flags(c,r.other)?.['home.leave'],'meet the other willing member here.');
  check(c.clock>=(flags(c,actor)?.['home.schoolMeetReadyAt']||0)&&c.clock>=(flags(c,r.other)?.['home.schoolMeetReadyAt']||0),'these members need a full played day between hosted comparisons.');
  out.simEffects.push(fact(actor,'home.schoolMeetReadyAt',c.clock+1440),fact(r.other,'home.schoolMeetReadyAt',c.clock+1440));
  out.job={id:'home.school.meet.'+actor+'.'+r.other,actor};out.message='Both people reserve one paid comparison. Their actual circulation practice is frozen into the receipt; cumulative mean scores show only the pairs that have met. Cancelling returns reserved effort/pay, but the host’s day-long booking stays used.';return true;
 }
 check(['school_study','school_survey','school_lesson'].includes(r.type),'choose a known school appointment.');
 if(r.type!=='school_survey')check(actor!=='player'&&activeHouseholdField(c),'a named teacher and the actual powered field are needed.');
 const kind=r.type.slice(7);out.job={id:'home.school.'+kind+'.'+actor+(kind==='survey'&&actor!=='player'&&value(c,actor,'schoolRank')>=1?'.qualified':''),actor};
 out.message='One appointment uses the existing shared queue, with exact effort, pay and input reservations. Its finite syllabus and live completion conditions govern what is earned.';return true;
}
export function renderHomeSchool({staff,view,el,action}){
 const c=view.context;if(!view.homes.some(h=>h.id==='manor'))return;
 const panel=el('details'),summary=el('summary','Household circulation school');panel.append(summary);staff.append(panel);
 panel.append(el('p',`Estate treasury ${c.staffResources?.[S]?.['home.estateFunds']||0} coins; your unspent contribution credit ${c.resources['home.cultivationContributions']||0}. Each station report spends one real charcoal, earns one credit, and covers one of six local observations. A qualified delegate needs 30 minutes; an apprentice or personal survey needs 45. Each person retains their own studies, reports and wages.`));
 action(panel,'school_fund','Donate 20 carried coins to the estate treasury',{type:'school_fund',amount:20});
 action(panel,'school_survey:player','Survey the stations personally · 45 min, 1 charcoal',{type:'school_survey',actor:'player'});
 for(const [id,name] of SCHOOL_STUDENTS){const d=el('details');d.append(el('summary',name+' · '+['apprentice','instructor','senior instructor'][value(c,id,'schoolRank')]));panel.append(d);const q=schoolRankQuote(c,id),meets=value(c,id,'schoolMeets');
  if(id===SCHOOL_VISITOR&&!flags(c,id)?.['home.schoolVisitor'])action(d,'school_visit:'+id,'Mara rests and joins the class · 30 min, 1 carried bread',{type:'school_visit',actor:id});
  d.append(el('p',`${q.practice}/6 studies; ${q.reports}/6 reports; ${value(c,id,'schoolLessons')} lessons taught. Hosted comparisons ${meets}, mean recorded practice ${meets?(value(c,id,'schoolMeetScore')/meets).toFixed(1):'unranked'}. ${q.reasons.join(' ')}`));
  action(d,'school_study:'+id,'Circulation study · 30 min, 2 estate coins',{type:'school_study',actor:id});
  action(d,'school_survey:'+id,'Delegate a station survey · 1 charcoal, 2 estate coins',{type:'school_survey',actor:id});
  action(d,'school_promote:'+id,`Practical examination · ${q.required.fee} estate coins`,{type:'school_promote',actor:id});
  action(d,'school_lesson:'+id,'Learn from this instructor · 30 min, 3 estate coins, 1 credit, 18 Meditation XP',{type:'school_lesson',actor:id});
  action(d,'school_milestone:'+id,'Record earned mentor recognition',{type:'school_milestone',actor:id});
 }
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)action(panel,'school_meet:'+i+':'+j,`Host ${SCHOOL_STUDENTS[i][1]} / ${SCHOOL_STUDENTS[j][1]} · 30 min, 4 estate coins`,{type:'school_meet',actor:ids[i],other:ids[j]});
 renderSchoolOffices({panel,c,el,action});
 renderSchoolCircuit({panel,c,view,el,action});
 for(const j of c.jobs.filter(j=>j.commandId.startsWith('home.school.'))){panel.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remain.`));action(panel,'school_cancel:'+j.id,'Cancel this school appointment',{type:'school_cancel',job:j.id});}
}
