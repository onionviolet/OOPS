// Authored local continuation. English ch4 P060–076 supplies the bakery setting,
// not a canon connection between Wendy and circus employment.
import {compileCastSchedule} from './cast_schedule.js';
import {castCalendar} from './lotm_cast_calendar.js';
const prefix='book.lotm.circus_notice.';
export const CIRCUS_NOTICE=Object.freeze({spare:prefix+'spare',visit:prefix+'visit',post:prefix+'post',stock:prefix+'paper',posted:prefix+'posted'});
// Original authored handbill copy, not a transcription of a canon notice.
// The early tent/advertised circus references ground its subject; no price,
// performance date, programme or special admission terms are supplied here.
export const CIRCUS_HANDBILL=Object.freeze({title:'The circus',lines:Object.freeze([
 'Step out of the everyday.',
 'Ask at the tent for performance details.'
])});
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const fact=(key,value)=>({type:'fact',scope:'actor',actor:'player',key:prefix+key,value});
const paper=(actor,amount,key=CIRCUS_NOTICE.stock)=>({type:'resource',actor,key,amount});
export function circusNoticeData(pack,{place,reader,localProfile}){
 const bakery=pack?.places?.find(p=>p.indexId==='lotm.place.sline-bakery')?.id;
 const baker=pack?.people?.find(p=>p.indexId==='lotm.person.wendy-sline')?.id;
 if(!bakery||!baker)return null;
 const schedule=compileCastSchedule((pack.bindings?.schedule||[]).filter(s=>s.actor===baker));
 const row=(id,label,at,targetId,minutes,description,report,requires,effects=[],costs=[])=>({id,operation:'use',place:at,targetId,minutes,label,description,report,
  knowledgeKey:id+'.seen',cancellation:'refund',publicReasons:true,costLabel:id===CIRCUS_NOTICE.spare?'one spare notice from the circus; no fee':id===CIRCUS_NOTICE.post?'one circus notice; no fee':'no fee',
  source:{locator:'Authored local continuation; bakery setting English v1 ch4 P060–076',timing:'fill'},
  visibleWhen:eq('notice.visible.'+id.split('.').at(-1),true),requires:{all:[eq('notice.local',true,'This is a local work arrangement.'),...requires]},effects,costs});
 return {bakery,baker,reader,place,localProfile,schedule,
  objects:[{id:prefix+'spare-stock',resources:[paper(reader,1)]}],
  acts:[row(CIRCUS_NOTICE.spare,'Ask the reader for a spare circus notice',place,reader,2,
   'Ask for one spare from the circus after your paid flyer round. You can carry it to a shop and ask permission to display it. No extra pay is offered.',
   'The reader checks that your flyer round is finished and hands you one spare notice. “If a shop wants it, ask first. They needn’t put it up.” You keep the paper; there is no extra pay.',
   [eq('tent.readerHere',true,'The reader is not at the tent now.'),eq('tent.nextDay',true,'Ask during the circus work day.'),eq('tent.paid',true,'Finish your flyer round first.'),eq('notice.collected',false,'You have already taken the spare notice.')],
   [paper('player',1),fact('collected',true)],[paper(reader,-1)]),
  row(CIRCUS_NOTICE.visit,'Visit Wendy at the bakery',bakery,baker,2,
   'Stop by the bakery and greet Wendy while she is serving. You do not need circus work or a notice to visit.',
   'You step aside for a bread customer and greet Wendy. She asks you to keep the doorway clear while people are buying. You can visit without bringing anything from the circus.',
   [eq('notice.bakerHere',true,'Wendy is not serving at the bakery now.')]),
  row(CIRCUS_NOTICE.post,'Ask Wendy to display the circus notice',bakery,baker,3,
   'Show Wendy the spare notice from your flyer round and ask whether she wants it beside her window. If she agrees, you leave that paper with her. There is no fee or extra pay.',
   'You show Wendy the spare from your flyer round and ask before leaving it. “The people going past might stop for bread,” she says. “One beside the window, then. Keep the prices clear.” You hand her the paper and she puts it by the window. She offers no payment or promise of work.',
   [eq('notice.bakerHere',true,'Wendy is not serving at the bakery now.'),eq('notice.collected',true,'Ask the circus reader for a spare notice first.'),eq('notice.posted',false,'The notice is already displayed.')],
   [paper(baker,1,CIRCUS_NOTICE.posted),fact('posted',true)],[paper('player',-1)])]};
}
export function circusNoticeFacts(state,data){
 if(!data||!state?.lotm)return {};
 const local=state.lotm.entryProfile===data.localProfile,f=state.actors?.player?.facts||{},at=state.simulation?.people?.player?.location;
 const collected=f[prefix+'collected']===true,posted=f[prefix+'posted']===true;
 const bakerHere=data.schedule.whereabouts(data.baker,castCalendar(state)).place===data.bakery&&state.simulation?.people?.[data.baker]?.location===data.bakery;
 const canFinish=minutes=>data.schedule.whereabouts(data.baker,castCalendar({...state,clock:state.clock+minutes})).place===data.bakery;
 return {'notice.local':local,'notice.collected':collected,'notice.posted':posted,'notice.bakerHere':bakerHere,
  'notice.time.visit':canFinish(2),'notice.time.post':canFinish(3),
  'notice.visible.spare':local&&at===data.place&&!!f['book.lotm.tent.paid']&&!collected,
  'notice.visible.visit':local&&at===data.bakery,
  'notice.visible.post':local&&at===data.bakery&&collected&&!posted};
}
export function circusNoticeCommand(command){
 const action=command.id===CIRCUS_NOTICE.visit?'visit':command.id===CIRCUS_NOTICE.post?'post':null;
 return !action?command:{...command,requires:{all:[command.requires,eq('notice.time.'+action,true,'There is not enough time to finish before Wendy stops serving.')]}};
}
export function circusNoticePeople(state,data){
 if(!data||!state?.lotm||state.lotm.entryProfile!==data.localProfile||state.simulation?.people?.player?.location!==data.bakery)return [];
 return data.schedule.whereabouts(data.baker,castCalendar(state)).place===data.bakery?[data.baker]:[];
}
export function circusNoticeView(state,data){
 if(!data||!state?.lotm||state.lotm.entryProfile!==data.localProfile||state.simulation?.people?.player?.location!==data.bakery)return null;
 const displayed=(state.actors?.[data.baker]?.resources?.[CIRCUS_NOTICE.posted]||0)>0;
 return {title:'At Sline Bakery',status:displayed?'The circus notice you brought is still beside the window, clear of the bread prices.':
  'There is room beside the window, clear of the bread prices. Wendy serves here in the morning.',
  source:'The bakery setting is sourced; this visit and notice arrangement are authored continuations.',appointments:[]};
}
// Inspect the physical paper through its existing custody. Posting does not
// turn the player's earlier possession flag into a portable readable copy.
export function circusNoticePaperView(state,data){
 if(!data||!state?.lotm||state.lotm.entryProfile!==data.localProfile)return null;
 const carried=(state.actors?.player?.resources?.[CIRCUS_NOTICE.stock]||0)>0;
 const atWindow=state.simulation?.people?.player?.location===data.bakery&&
  (state.actors?.[data.baker]?.resources?.[CIRCUS_NOTICE.posted]||0)>0;
 if(!carried&&!atWindow)return null;
 return {...CIRCUS_HANDBILL,copy:carried?'carried':'posted',caption:carried?
  'A spare notice from your flyer round.':'The notice beside Wendy’s window.'};
}
