// One administrative event over actual reserved pair appointments. Jobs own
// due times and effort; institutional actor resources own both coin escrows.
import {check,natural} from './basics.js';
import {SCHOOL_ROSTER,SCHOOL_ROOM,SCHOOL_STEWARD as S} from './home_school_content.js';
const ids=SCHOOL_ROSTER.map(([id])=>id),pairs=[[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]].map(([a,b])=>[ids[a],ids[b]]);
const value=(c,id,key)=>c.staffResources?.[id]?.['home.'+key]||0,res=(actor,key,amount)=>({type:'resource',actor,key:'home.'+key,amount}),flag=(actor,key,value)=>({type:'fact',scope:'actor',actor,key:'home.'+key,value});
const command=(a,b)=>'home.school.tournament.'+a+'.'+b;
export function validateSchoolCircuit(t,clock){
 if(t===undefined)return;check(t&&Object.keys(t).sort().join(',')==='pending,results,startedAt,status'&&natural(t.startedAt)&&t.startedAt<=clock&&['active','done','closed'].includes(t.status)&&Array.isArray(t.results)&&t.results.length<=6,'Invalid school circuit.');
 for(const [i,r]of t.results.entries())check(r&&Object.keys(r).sort().join(',')==='a,b,sa,sb'&&r.a===pairs[i][0]&&r.b===pairs[i][1]&&natural(r.sa)&&r.sa<=6&&natural(r.sb)&&r.sb<=6,'Invalid actual pair result.');
 if(t.pending){const p=t.pending,[a,b]=pairs[t.results.length]||[];check(t.status==='active'&&Object.keys(p).sort().join(',')==='a,b,command,meetsA,meetsB,scoreA,scoreB'&&p.a===a&&p.b===b&&p.command===command(a,b)&&['scoreA','scoreB','meetsA','meetsB'].every(k=>natural(p[k])),'Invalid reserved circuit pair.');}
 check(t.status!=='done'||t.results.length===6&&!t.pending,'A completed circuit needs all six actual results.');check(t.status==='active'||!t.pending,'A closed circuit holds no appointment.');
}
export function circuitRanking(t){const points=Object.fromEntries(ids.map(id=>[id,0]));for(const r of t.results){points[r.a]+=r.sa>r.sb?2:r.sa===r.sb?1:0;points[r.b]+=r.sb>r.sa?2:r.sa===r.sb?1:0;}return ids.map(id=>({id,points:points[id],played:t.results.filter(r=>r.a===id||r.b===id).length,rank:t.results.some(r=>r.a===id||r.b===id)?1+Object.values(points).filter(p=>p>points[id]).length:null})).sort((a,b)=>b.points-a.points||ids.indexOf(a.id)-ids.indexOf(b.id));}
export function planSchoolCircuit(s,r,c,out){
 if(!r.type.startsWith('school_circuit_'))return false;const h=s.properties.manor;check(h?.access&&c.location===SCHOOL_ROOM,'Meet the actual household circuit at the manor.');
 const busy=id=>c.jobs.some(j=>(j.participants||[j.actorId]).includes(id));
 const ready=id=>c.people[id]?.life==='alive'&&c.people[id].location===SCHOOL_ROOM&&c.staffFacts[id]?.['home.employed']===true&&!c.staffFacts[id]?.['home.leave'];
 if(r.type==='school_circuit_start'){
  check(!h.circuit||h.circuit.status!=='active','Finish or close the current circuit.');check(c.clock>=(c.playerFacts['home.schoolCircuitReadyAt']||0),'The host needs a played week between circuits.');
  check(ids.every(id=>ready(id)&&!busy(id)&&value(c,id,'cultivationPractice')>=1&&value(c,id,'energy')>=20),'All four willing members need a completed circulation study, free time and twenty effort.');check(ids.every(id=>c.clock>=(c.staffFacts[id]?.['home.schoolMeetReadyAt']||0)),'A member already used today’s hosted-comparison booking.');
  check(value(c,S,'estateFunds')>=36,'Reserve 36 actual estate coins: 24 for six pair appointments and 12 for prizes.');check(!value(c,S,'schoolMatchFund')&&!value(c,S,'schoolPrizeFund'),'Close the prior event’s actual escrows first.');
  out.simEffects.push(res(S,'estateFunds',-36),res(S,'schoolMatchFund',24),res(S,'schoolPrizeFund',12),flag('player','schoolCircuitReadyAt',c.clock+7*1440),...ids.map(id=>flag(id,'schoolMeetReadyAt',c.clock+1440)));
  h.circuit={startedAt:c.clock,status:'active',results:[],pending:null};out.message='The four-person forms circuit opens with actual match and prize escrows. Each of six thirty-minute pair appointments reserves both people’s effort and pays two coins each from the match fund. Record each real result before the next pair. Hosting uses this week’s booking; participant bookings use their day.';return true;
 }
 const t=h.circuit;check(t?.status==='active','Open an actual forms circuit first.');const p=t.pending;
 if(r.type==='school_circuit_close'){
  check(!p||!c.jobs.some(j=>j.commandId===p.command),'Cancel the current actual appointment before closing the event.');
  const match=value(c,S,'schoolMatchFund'),prize=value(c,S,'schoolPrizeFund');out.simEffects.push(res(S,'schoolMatchFund',-match),res(S,'schoolPrizeFund',-prize),res(S,'estateFunds',match+prize));t.pending=null;t.status='closed';out.message='The event closes. Its actual unspent match and prize coins return to the estate. Completed appointments retain their earned wages and records; no unfinished circuit title or prize is minted. Host and participant bookings remain used.';return true;
 }
 if(r.type==='school_circuit_record'){
  check(p&&!c.jobs.some(j=>j.commandId===p.command),'Wait for the reserved actual comparison to finish.');
  check(value(c,p.a,'schoolCircuitMeets')===p.meetsA+1&&value(c,p.b,'schoolCircuitMeets')===p.meetsB+1,'A cancelled or interrupted appointment has no result. Retry it or close the event.');
  const result={a:p.a,b:p.b,sa:value(c,p.a,'schoolCircuitScore')-p.scoreA,sb:value(c,p.b,'schoolCircuitScore')-p.scoreB};check([result.sa,result.sb].every(n=>natural(n)&&n<=6),'The actual comparison receipt changed.');t.results.push(result);t.pending=null;
  if(t.results.length===6){
   const winners=circuitRanking(t).filter(r=>r.rank===1),fund=value(c,S,'schoolPrizeFund');check(fund===12&&value(c,S,'schoolMatchFund')===0,'Settle the six funded appointments before paying the reserved prizes.');const share=12/winners.length;out.simEffects.push(res(S,'schoolPrizeFund',-12));for(const {id}of winners){out.simEffects.push(res(id,'wages',share),res(id,'schoolCircuitWins',1));if(!c.staffFacts[id]?.['home.schoolCircuitWinner'])out.simEffects.push(flag(id,'schoolCircuitWinner',true),{type:'title',actor:id,id:'arlmere.circulation.circuit-winner',operation:'grant',issuer:S});}t.status='done';out.message='All six actual comparisons settle the circuit. Strict wins earn two standing points; equal performances earn one each. The highest tied tier divides the real twelve-coin prize equally, with once-keyed personal recognition. Participation wages stay earned by each person.';
  }else out.message='This actual pair result is recorded once. The next appointment reads its participants’ current real practice and freezes that performance at booking.';return true;
 }
 check(r.type==='school_circuit_next','Choose a known circuit action.');
 if(p)check(!c.jobs.some(j=>j.commandId===p.command)&&value(c,p.a,'schoolCircuitMeets')===p.meetsA&&value(c,p.b,'schoolCircuitMeets')===p.meetsB,'Record the completed pair, or finish/cancel the current appointment first.');
 const [a,b]=pairs[t.results.length];check([a,b].every(id=>ready(id)&&!busy(id)),'Both actual participants must be willing, here and free of conflicting work.');check(value(c,S,'schoolMatchFund')>=4,'This match needs its four reserved institutional coins.');
 t.pending={a,b,command:command(a,b),scoreA:value(c,a,'schoolCircuitScore'),scoreB:value(c,b,'schoolCircuitScore'),meetsA:value(c,a,'schoolCircuitMeets'),meetsB:value(c,b,'schoolCircuitMeets')};out.job={id:t.pending.command,actor:a};out.message='The next real pair reserves thirty played minutes, twenty effort each and four match coins. Their actual circulation practice is frozen into this appointment. Equal performances share standing; no hidden combat power is invented.';return true;
}
export function renderSchoolCircuit({panel,c,view,el,action}){
 const t=view.state.properties.manor?.circuit,box=el('details');box.append(el('summary','Household forms circuit'),el('p','Four actual members, six funded pair appointments. Reserve 36 estate coins: 24 participation wages and a 12-coin prize. Each member needs a real circulation study. Scores use the same actual practice as the pair appointment, frozen when booked. A win earns two standing points; a tie earns one each. Joint first place shares the prize. Host cooldown: one played week.'));panel.append(box);
 action(box,'school_circuit_start','Host the funded forms circuit',{type:'school_circuit_start'});
 if(!t)return;box.append(el('p',`${t.status}: ${t.results.length}/6 recorded pairs; match fund ${value(c,S,'schoolMatchFund')}, prize fund ${value(c,S,'schoolPrizeFund')}.`));
 for(const row of circuitRanking(t)){const name=SCHOOL_ROSTER.find(([id])=>id===row.id)[1];box.append(el('p',`${name}: ${row.points} standing points from ${row.played} actual pairs, ${row.rank===null?'unranked':(t.status==='done'?'final':'partial')+' tier '+row.rank}.`));}
 if(t.status==='active'){if(t.pending)box.append(el('p','The current pair must finish before recording. A cancelled appointment can be retried without granting a result. Use its ordinary cancellation control below before withdrawing the event.'));action(box,'school_circuit_next','Book or retry the next actual pair',{type:'school_circuit_next'});action(box,'school_circuit_record','Record the completed pair',{type:'school_circuit_record'});action(box,'school_circuit_close','Close and return actual unspent escrow',{type:'school_circuit_close'});}
}
