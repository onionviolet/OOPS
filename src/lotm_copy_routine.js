// One authored retained-file duty over native jobs/programs, not a wage or a
// replacement for saved whole-file copying jobs (ACR6/7/11, AR3/6/10).
import {cmd,eq,all,af,know} from './book_world_lotm_kit.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
const P='book.lotm.copy_file.';
export const COPY_FILE=Object.freeze({begin:P+'begin',sheet:P+'sheet',ask:P+'ask',flag:P+'flag',submit:P+'submit',entrust:P+'entrust',resume:P+'resume',sheets:P+'sheets',minutes:10,total:3});
const C=COPY_FILE;
const mark=(key,value)=>af('copy_file.'+key,value);
const note=(key,text)=>know('copy_file.'+key,text);
export function copyFileCommands({gate,payment,practiceOutcomes}){
 const row=(id,label,options)=>cmd('copy_file.'+id,label,L.workroom,{once:false,...options});
 const active=all(gate,eq('lotm.copy.active'),eq('lotm.copy.closed',false));
 return [
  row('begin','Entrust one file copy · 30 min · earns 1 merit',{once:true,targetId:I.supervisor,duration:0,
   requires:all(gate,eq('lotm.copy.familiar'),eq('lotm.copy.active',false),eq('lotm.copy.closed',false)),
   effects:[mark('active',true),note('terms','Hale leaves you a three-sheet file. Copy it faithfully and mark anything unclear instead of guessing. Return the file for one merit. Finished sheets stay on the desk if you leave.')] }),
  row('sheet','Copy the next sheet · 10 min',{alone:true,automatable:true,duration:C.minutes,cancellation:'forfeit',
   visibleWhen:all(active,eq('lotm.copy.canWork')),requires:all(active,eq('lotm.copy.canWork')),
   effects:[{type:'resource',actor:'player',key:C.sheets,amount:1}],outcomes:[
    {id:'reference',weight:{fact:'lotm.copy.first.n'},effects:[note('question','One sheet is copied. On the next sheet, the file reference has been overwritten. Ask Hale to read the original, or mark the reference unclear and copy the readable remainder.')]},
    {id:'ordinary',weight:{fact:'lotm.copy.first.n',scale:-1,add:1},effects:[]}] }),
  row('ask','Ask Hale to read the original reference · 2 min',{targetId:I.supervisor,duration:2,cancellation:'refund',
   visibleWhen:all(active,eq('lotm.copy.question')),
   requires:all(active,eq('lotm.copy.question')),effects:[mark('resolution','clarified'),note('resolution','Hale reads the original reference aloud. You enter the reference he gives you and keep the completed sheet.')] }),
  row('flag','Mark the reference unclear and carry on',{alone:true,duration:0,requires:all(active,eq('lotm.copy.question')),
   effects:[mark('resolution','flagged'),note('resolution','You mark the overwritten reference as unclear rather than guessing it. The remaining readable sheets can still be copied; Hale will see the marked uncertainty in the returned file.')] }),
  row('submit','Return the copied file to Hale · earns 1 merit',{targetId:I.supervisor,once:true,duration:0,
   visibleWhen:all(active,eq('lotm.copy.ready')),
   requires:all(active,eq('lotm.copy.ready')),effects:[...payment,mark('closed',true),mark('active',false),note('accepted','Hale checks the three copied sheets, including how you handled the overwritten reference, and accepts the file. One merit is entered in your existing ledger.')],outcomes:practiceOutcomes()})
 ];
}
export function copyFileFacts(state,f){
 const a=state.actors?.player||{},facts=a.facts||{},sheets=a.resources?.[C.sheets]||0;
 const active=facts[P+'active']===true,closed=facts[P+'closed']===true,resolution=facts[P+'resolution'];
 f['lotm.copy.active']=active;f['lotm.copy.closed']=closed;f['lotm.copy.familiar']=(a.completed?.['book.lotm.merit_case_file_copy']||0)>0;
 f['lotm.copy.first.n']=sheets===0?1:0;f['lotm.copy.question']=active&&sheets>=1&&!resolution;
 f['lotm.copy.canWork']=active&&sheets<C.total&&(sheets===0||!!resolution);f['lotm.copy.ready']=active&&sheets===C.total&&!!resolution;
}
export function copyFileView(state,preview){
 const facts={};copyFileFacts(state,facts);const a=state.actors?.player||{},sheets=a.resources?.[C.sheets]||0;
 const active=facts['lotm.copy.active'],closed=facts['lotm.copy.closed'];
 if(!active&&!closed&&!facts['lotm.copy.familiar'])return null;
 const pending=state.simulation.jobs.find(j=>j.actorId==='player'),program=state.simulation.programs.player;
 const actions=[];let status;
 if(closed)status='Hale accepted your three-sheet file. Its merit and desk practice are recorded.';
 else if(!active){status='A familiar copying duty: three ten-minute sheets for one merit. Finished sheets stay if you stop. Mark doubtful references instead of guessing.';
  const q=preview(C.begin);if(q?.visible)actions.push({...q,id:C.entrust});}
 else if(pending)status=`${sheets} of 3 sheets finished. ${pending.commandId===C.sheet?'Work in progress; Stop keeps finished sheets and loses time spent on the unfinished sheet.':'Other work is in progress. Finished sheets stay if you stop.'}`;
 else if(facts['lotm.copy.question']){status=state.simulation.knowledge.player?.[P+'question']?.value||'The next reference is unclear. Finished sheets are kept.';actions.push(preview(C.ask),preview(C.flag));}
 else if(facts['lotm.copy.ready']){status='All three sheets are copied. Return the file to Hale for its agreed merit.';actions.push(preview(C.submit));}
 else {const remaining=C.total-sheets;status=`${sheets} of 3 sheets kept. ${a.facts[P+'resolution']==='flagged'?'The doubtful reference is marked unclear.':'Hale clarified the reference.'} Resume the remaining ${remaining} ${remaining===1?'sheet':'sheets'} (${remaining*C.minutes} min).`;
  const q=preview(C.sheet);actions.push({...q,id:C.resume,label:'Resume this file copy'});}
 return {status,actions:actions.filter(Boolean).filter(a=>a.visible!==false),active,closed,sheets,program:program?.commandId===C.sheet?program.status:null};
}
// No host.view(), job scan or other-life lookup belongs on the header refresh.
export function copyFileAttention(state){
 const actor=state?.actors?.player,program=state?.simulation?.programs?.player;
 if(actor?.worldId!==I.world||state?.lotm?.entryProfile!=='lotm.early_tingen.local_probationer@1'||
  actor.facts?.[P+'active']!==true||actor.facts?.[P+'closed']===true||actor.facts?.[P+'resolution']||
  !(actor.resources?.[C.sheets]>=1)||program?.commandId!==C.sheet||program.status!=='paused')return null;
 return {text:'Copying paused: the reference needs your answer.',label:'Review the copying reference'};
}
