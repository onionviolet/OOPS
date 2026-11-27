// English v1 ch4 P077–100/ch5 P002–43: free stand-in reading, interrupted by
// the actual reader, then an optional paid interpretation. The next-day work,
// its availability, minutes, pay and regard are authored continuations.
import {TENT_REFUSAL,TENT_READING,directGroceriesAvailable,directGroceriesDone,tentReadingObserved,tentReadingRefused,tentSequenceData} from './lotm_tent_refusal.js';
import {placeActStages,sequencePrerequisites} from './place_act_sequence.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
import {definePlaceActs} from './place_acts.js';
import {compileCastSchedule} from './cast_schedule.js';
import {castCalendar} from './lotm_cast_calendar.js';
import {circusNoticeData,circusNoticeFacts,circusNoticePeople,circusNoticeCommand,circusNoticeView,circusNoticePaperView} from './lotm_circus_notice.js';
import {bakeryCustomerData,bakeryCustomerFacts,bakeryCustomerHere,bakeryCustomerStatus,bakeryCustomerSquareView,BAKERY_CUSTOMER} from './lotm_bakery_customer.js';
const presenceIndexes=new WeakMap();
export const TENT = Object.freeze({prefix:'book.lotm.tent.',open:520,close:540,nextDay:1960,workClose:2460,
 watchMinutes:5,clarifyMinutes:3,leaveMinutes:1,referralMinutes:5,inquiryMinutes:20,workMinutes:15,pence:2});
export const TENT_COMMANDS=Object.freeze(Object.fromEntries(['watch','clarify','leave','referral','inquire','flyers'].map(k=>[k,TENT.prefix+k])));
export function defineTentIncidentCommands(data,options){
 const timed=new Set([...Object.values(TENT_COMMANDS),TENT_REFUSAL]);
 const commands= definePlaceActs(data,options).map(d=>!timed.has(d.id)?circusNoticeCommand(d):({...d,requires:{all:[d.requires,{fact:'tent.elapsed',op:'lte',
  value:([TENT_COMMANDS.watch,TENT_COMMANDS.clarify,TENT_COMMANDS.leave,TENT_REFUSAL].includes(d.id)?TENT.close:TENT.workClose)-1-d.duration,
  reason:'There is not enough time to finish before the staff close this offer.'}]}}));
 for(const d of commands)if(d.id===TENT_REFUSAL){
  for(const e of d.effects)if(e.type==='knowledge')e.basis.provenance='divergent';
 }
 return commands;
}
export function tentLatestStartReason(state,id){
 const name=id===TENT_REFUSAL?'refuse':Object.keys(TENT_COMMANDS).find(k=>TENT_COMMANDS[k]===id);
 if(!name)return null;
 const first=['watch','clarify','leave','refuse'].includes(name),minutes=name==='refuse'?1:TENT[name==='inquire'?'inquiryMinutes':name==='flyers'?'workMinutes':name+'Minutes'];
 return state.clock-state.lotm.initializedAt>(first?TENT.close:TENT.workClose)-1-minutes?
  `There is not enough time to finish before ${first?'9:00 on the first day':'17:00 on the work day'}.`:null;
}
const key=k=>TENT.prefix+k;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const fact=(k,value)=>({type:'fact',scope:'actor',actor:'player',key:key(k),value});
const note=(k,value)=>({type:'knowledge',actor:'player',key:key(k),stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside',provenance:'emergent'}});
export function tentIncidentData(pack){
 const place=pack?.places?.find(p=>p.indexId==='lotm.place.fortune-tent')?.id;
 const reader=pack?.people?.find(p=>p.indexId==='lotm.person.circus-fortune-teller')?.id;
 const trainer=pack?.people?.find(p=>p.indexId==='lotm.person.animal-trainer-fortune-teller')?.id;
 if(!place||!reader||!trainer)return null;
 const schedule=[reader,trainer].map(actor=>({id:key('work-presence.'+actor),actor,place,day:2,until:2,from:520,to:1020,recurrence:'once',label:'I',source:'fill',locator:'Authored staff availability before the advertised evening performance.'}));
 const row=(id,label,minutes,description,requires,effects=[],costs=[])=>({id:TENT_COMMANDS[id],operation:'use',place,targetId:reader,minutes,label,description,
  knowledgeKey:key(id+'.seen'),report:description,publicReasons:true,cancellation:'refund',
  costLabel:id==='flyers'?'2 pence paid on completion from the circus purse':'no fee',requires:{all:[eq('tent.readerHere',true,'The reader is not at the tent now.'),...requires]},costs,effects,
  visibleWhen:eq('tent.visible.'+id,true),source:{locator:'Authored continuation of English v1 ch4 P077–100/ch5 P002–43',timing:'fill'}});
 const open=eq('tent.open',true,'The free-reading exchange lasts from 8:40 to 9:00 on the first day.');
 const unset=eq('tent.resolved',false,'You have already answered the reader.');
 const next=eq('tent.nextDay',true,'The circus takes work inquiries on the following day, from 8:40 until 17:00.');
 const unhired=eq('tent.hired',false,'Your work arrangement is already made.');
 const data={place,reader,trainer,schedule,sourceStages:placeActStages(pack.householdActs),readingKnowledgeKey:pack.householdActs?.acts?.find(r=>r.id===TENT_READING)?.knowledgeKey,localProfile:pack.host?.profile?.id,
  objects:[{id:key('circus-float'),resources:[{actor:reader,key:key('purse'),amount:TENT.pence}]}],
  acts:[
   row('watch','Watch the exchange at the tent',TENT.watchMinutes,
    'Stay by the entrance. The reader calls the stand-in an animal trainer and sends her back to her post. She offers the customer an interpretation; he asks whether it is free and leaves when she says no.',
    [open,eq('tent.local',true),eq('tent.witness',false,'You already heard the exchange.')],[fact('witness',true)]),
   row('clarify','Clarify the free promise calmly',TENT.clarifyMinutes,
    'Point out that the cards were offered free while interpretation is a separate offer. The reader agrees: nobody owes a fee for the cards. She thanks you for clearing that up and says to find her tomorrow if you want an introduction to the flyer round.',
    [open,unset,eq('tent.witness',true,'Hear the exchange first.')],[fact('response','clarified'),
     {type:'relationship',actor:reader,target:'player',axis:'trust',amount:1,text:'You calmly distinguished the free offer from her paid work.'},
     note('reader-response','The reader asks you to find her tomorrow if you want a short introduction to the circus work queue.')]),
   row('leave','Leave the tent without intervening',TENT.leaveMinutes,
    'Keep your time and leave the disagreement to the circus staff. No fee changes hands. You can still ask for ordinary work tomorrow.',
    [open,unset,eq('tent.witness',true,'Hear the exchange first.')],[fact('response','left')]),
   row('referral','Ask the reader for her introduction',TENT.referralMinutes,
    'The reader remembers how you handled the free offer. She introduces you to the flyer round without the longer work inquiry. The paid round itself still takes fifteen minutes.',
    [next,unhired,eq('tent.trusted',true,'The reader has not offered you an introduction.')],[fact('hired',true)]),
   row('inquire','Ask about the ordinary flyer round',TENT.inquiryMinutes,
    'Ask the circus staff about available work and go through the ordinary inquiry. You need no prior encounter or introduction. The flyer round pays two pence for fifteen minutes after this inquiry.',
    [next,unhired],[fact('hired',true)]),
   row('flyers','Distribute the circus flyers',TENT.workMinutes,
    'Take the agreed round near the square. Finish fifteen minutes of flyer distribution for two pence. If you stop, the reserved pay returns to the circus purse and you can try again.',
    [next,eq('tent.hired',true,'Arrange the work first.'),eq('tent.paid',false,'You have already completed this flyer round.')],
    [fact('paid',true),{type:'resource',actor:'player',key:'money',amount:TENT.pence,native:true}],
    [{type:'resource',actor:reader,key:key('purse'),amount:-TENT.pence}])
  ]};
 const reading=pack.householdActs?.acts?.find(r=>r.id===TENT_READING);
 if(reading){
  const prerequisites=sequencePrerequisites(tentSequenceData(pack.householdActs),TENT_READING);
  data.acts.push({id:TENT_REFUSAL,operation:'use',place,targetId:trainer,minutes:1,
   label:'Decline the free reading and continue shopping',
   description:'Tell the woman offering the cards, “No, thank you. I still have shopping to do.” No card is drawn and no fee changes hands.',
   report:'You thank her and keep hold of the bread. The market is your next stop.',
   knowledgeKey:TENT_REFUSAL+'.seen',costLabel:'no fee',cancellation:'refund',publicReasons:true,
   visibleWhen:eq('tent.visible.refuse',true),
   requires:{all:[open,eq('tent.canRefuse',true,'The free reading is no longer waiting for your answer.'),...prerequisites]},
   effects:[{type:'fact',scope:'actor',actor:'player',key:key('readingDeparture'),value:'divergent'}],
   source:{locator:'Authored refusal of the offer in English v1 ch4 P077–100/ch5 P002–043',timing:'fill'}});
 }
 const notice=circusNoticeData(pack,data);
 if(notice){data.notice=notice;data.acts.push(...notice.acts);data.objects.push(...notice.objects);}
 const customer=bakeryCustomerData(pack,notice);
 if(customer){data.customer=customer;data.acts.push(...customer.acts);data.schedule.push(...customer.schedule);}
 presenceIndexes.set(data,compileCastSchedule([...(pack.bindings?.schedule||[]).filter(r=>r.actor===reader||r.actor===trainer),...schedule]));
 return data;
}
export function tentIncidentFacts(state,data){
 if(!data||!state?.lotm)return {};
 const a=state.actors?.player||{},f=a.facts||{},done=a.completed||{},elapsed=state.clock-state.lotm.initializedAt;
 const be=state.lotm.entryProfile===BE_PROFILE_ID,local=state.lotm.entryProfile===data.localProfile;
 const refused=tentReadingRefused(state),shoppingFirst=directGroceriesDone(state);
 const witnessedCard=!!(state.simulation?.knowledge?.player?.['cast.learned.1766b665ffe50890ed9c']||state.simulation?.knowledge?.player?.['book.lotm.excursion.reading.seen']);
 const waitingStage=(data.sourceStages||[]).find(s=>!done[s.commandId]&&!state.simulation?.knowledge?.player?.[s.knowledgeKey]);
 const canRefuse=be&&!shoppingFirst&&!refused&&!done[TENT_READING]&&!witnessedCard&&waitingStage?.commandId===TENT_READING;
 const readingObserved=tentReadingObserved(state,data.readingKnowledgeKey);
 const witness=!!f[key('witness')]||be&&readingObserved;
 const resolved=!!f[key('response')]||be&&!!done['book.lotm.excursion.decline'];
 const at=state.simulation?.people?.player?.location===data.place,open=elapsed>=TENT.open&&elapsed<TENT.close;
 const next=elapsed>=TENT.nextDay&&elapsed<TENT.workClose;
 const hired=f[key('hired')]===true,paid=f[key('paid')]===true;
 const readerHere=presenceIndexes.get(data)?.whereabouts(data.reader,castCalendar(state)).place===data.place&&state.simulation?.people?.[data.reader]?.location===data.place;
 const trusted=(state.simulation?.relationships?.[data.reader]?.player?.axes?.trust||0)>=1&&f[key('response')]==='clarified';
 const canShopDirect=directGroceriesAvailable(state);
 const optionalReadingOpen=!shoppingFirst||(open&&readerHere);
 return {'tent.readingObserved':readingObserved,'tent.canUseOriginalMarket':!shoppingFirst,'tent.canShopDirect':canShopDirect,'tent.optionalReadingOpen':optionalReadingOpen,'tent.canRefuse':canRefuse,'tent.refused':refused,'tent.visible.refuse':at&&canRefuse&&open,'tent.readerHere':readerHere,'tent.elapsed':elapsed,'tent.local':local,'tent.open':open,'tent.nextDay':next,'tent.witness':witness,'tent.resolved':resolved,'tent.hired':hired,'tent.paid':paid,'tent.trusted':trusted,
  'tent.visible.watch':at&&local&&elapsed<=TENT.close&&!witness,
  'tent.visible.clarify':at&&(be||local)&&witness&&!resolved&&elapsed<=TENT.close,
  'tent.visible.leave':at&&local&&witness&&!resolved&&elapsed<=TENT.close,
  'tent.visible.referral':at&&(be||local)&&trusted&&!hired,
  'tent.visible.inquire':at&&(be||local)&&!hired,
  'tent.visible.flyers':at&&(be||local)&&hired&&!paid,...circusNoticeFacts(state,data.notice),...bakeryCustomerFacts(state,data.customer)};
}
export function tentIncidentPeople(state,data){
 const noticePeople=circusNoticePeople(state,data?.notice);
 if(noticePeople.length)return [...noticePeople,...(bakeryCustomerHere(state,data?.customer)?[BAKERY_CUSTOMER.id]:[])];
 if(!data||!state?.lotm||state.simulation?.people?.player?.location!==data.place)return [];
 const elapsed=state.clock-state.lotm.initializedAt;
 return [data.reader,data.trainer].filter(id=>presenceIndexes.get(data)?.whereabouts(id,castCalendar(state)).place===data.place);
}
export function tentIncidentView(state,data){
 const paper=circusNoticePaperView(state,data?.notice);
 const bakery=circusNoticeView(state,data?.notice);
 if(bakery)return {...bakery,status:[bakery.status,bakeryCustomerStatus(state,data.customer)].filter(Boolean).join(' '),paper};
 const customer=bakeryCustomerSquareView(state,data?.customer);
 if(customer)return {...customer,paper};
 if(!data||!state?.lotm||state.simulation?.people?.player?.location!==data.place)return paper?
  {title:'The notice you carry',status:'You have a spare circus notice.',paper,appointments:[]}:null;
 const f=tentIncidentFacts(state,data),elapsed=state.clock-state.lotm.initializedAt;
 const title='At the circus tent';
 const status=f['tent.refused']?'You kept to the shopping errand. The market is your next stop. You can ask about ordinary circus work tomorrow.':f['tent.paid']?'Your flyer round is finished. You were paid two pence.':
  elapsed>=TENT.workClose?'The circus work day has ended. No unfinished round is paid. Earlier observations and your response remain recorded.':
  elapsed>=TENT.nextDay&&!f['tent.readerHere']?'The reader is not at the tent now. Your earlier observations and response remain recorded.':
  elapsed>=TENT.nextDay?(f['tent.hired']?'Your flyer round is arranged. Finish the fifteen-minute round before 17:00 to collect two pence.':f['tent.trusted']?'The reader can give you her five-minute introduction now. The ordinary inquiry takes twenty minutes.':'You can ask about ordinary circus work now. No earlier encounter or introduction is required.'):
  elapsed>=TENT.close&&!f['tent.witness']?'The free-reading exchange has ended without your involvement. You can still ask about ordinary circus work on the following day.':
  f['tent.trusted']?'The reader remembers your help. Tomorrow her introduction takes five minutes; the ordinary inquiry takes twenty.':
  f['tent.witness']?'You heard the exchange. No paid interpretation or proven prediction followed.':
  'The circus offers a free reading here on the first morning. You can come out of curiosity; no invitation is needed.';
 return {title,status,paper,source:'The free reading, interruption and tomorrow’s advertised circus are sourced. Work, pay, availability and response are authored continuations.',
  local:!!f['tent.local'],readerPresent:!!f['tent.readerHere'],sharedClock:{open:TENT.open,close:TENT.close,nextDay:TENT.nextDay},
  appointments:[...(elapsed<TENT.open?[{known:true,at:state.lotm.initializedAt+TENT.open,label:'The circus tent opens'}]:[]),...(elapsed<TENT.nextDay?[{known:true,at:state.lotm.initializedAt+TENT.nextDay,label:'Ask the circus about tomorrow’s work'}]:[])],
  };
}
