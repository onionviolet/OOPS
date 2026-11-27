// Authored ordinary local, not a canon person or encounter. The bakery setting
// is grounded in English v1 ch4 P060–076; the visit and its times are fill.
import {castCalendar} from './lotm_cast_calendar.js';
import {CIRCUS_NOTICE} from './lotm_circus_notice.js';
const P='book.lotm.bakery_customer.';
export const BAKERY_CUSTOMER=Object.freeze({id:'lotm.person.edwin-cole',visit:P+'bread',read:P+'notice',directions:P+'directions',answer:P+'answer',answerSquare:P+'answer_square',from:555,to:565,squareUntil:600});
const C=BAKERY_CUSTOMER;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const note=(actor,key,value)=>({type:'knowledge',actor,key,stage:'seen',value,basis:{kind:'observation',attributedTo:actor,situationId:'book.lotm.tingen.canon_beside',provenance:'emergent'}});
export function bakeryCustomerPack(pack){
 if(!pack.places?.some(p=>p.indexId==='lotm.place.sline-bakery')||pack.people.some(p=>p.id===C.id))return pack;
 return {...pack,people:[...pack.people,{id:C.id,indexId:C.id,name:'Edwin Cole',tier:'role',source:'fill'}]};
}
export function bakeryCustomerData(pack,notice){
 if(!notice||!pack.people.some(p=>p.id===C.id))return null;
 // Use the existing walkable square, rather than the duplicate source-only
 // "City Square" record that has no native travel route.
 const square=pack.places.find(p=>p.indexId==='lotm.place.civic-square')?.id;
 const schedule=[{id:P+'stop',actor:C.id,place:notice.bakery,day:2,until:2,from:C.from,to:C.to,recurrence:'once',source:'fill',label:'I',locator:'Authored bread errand independent of the circus notice.'},
  ...(square?[{id:P+'departure',actor:C.id,place:square,day:2,until:2,from:C.to,to:C.squareUntil,recurrence:'once',source:'fill',label:'I',locator:'Authored walk through Municipal Square after the bread errand.'}]:[])];
 const answer=(id,place,until)=>({id,operation:'use',place,targetId:C.id,minutes:1,label:'Tell Edwin where to enquire about the circus',
  description:`If you asked the reader about work, tell Edwin where you made your enquiry. He can decide whether to go. This takes one minute and costs nothing. Edwin leaves here at ${until}.`,
  report:'“I asked the reader at the tent,” you tell Edwin. “That is where I would enquire.” He thanks you and keeps hold of his bread. Whether he visits is his own decision.',
  knowledgeKey:id+'.seen',costLabel:'no fee',publicReasons:true,cancellation:'refund',
  source:{locator:'Authored local conversation at the sourced bakery',timing:'fill'},
  visibleWhen:eq('bakery.customer.interested',true),requires:{all:[eq('notice.local',true),eq('bakery.customer.here',true,'Edwin is no longer here.'),eq('bakery.customer.time',true,'Edwin is about to leave with his bread.'),eq('bakery.customer.canAnswer',true,'Ask the circus reader about work before offering directions.'),eq('bakery.customer.answered',false,'You already told Edwin where you enquired.')]},
  effects:[note(C.id,C.directions,'The flyer worker says they asked the reader at the circus tent about work.')]});
 return {notice,square,schedule,acts:[answer(C.answer,notice.bakery,'09:25'),...(square?[answer(C.answerSquare,square,'10:00')]:[])]};
}
const known=(state,id,key)=>state.simulation?.knowledge?.[id]?.[key];
function conversationPlace(state,data){
 if(!data||state.lotm?.entryProfile!==data.notice.localProfile)return null;
 const c=castCalendar(state).calendar,minute=c.hour*60+c.minute;
 if(c.day_count!==2)return null;
 return minute>=C.from&&minute<C.to?data.notice.bakery:minute>=C.to&&minute<C.squareUntil?data.square:null;
}
export function bakeryCustomerHere(state,data){
 if(!data||state.lotm?.entryProfile!==data.notice.localProfile)return false;
 const c=castCalendar(state).calendar,minute=c.hour*60+c.minute;
 return c.day_count===2&&minute>=C.from&&minute<C.to&&state.simulation?.people?.[C.id]?.location===data.notice.bakery;
}
// Cast walks reserve their destination when they start. Local observations and
// conversations begin when the walking time has actually elapsed.
function playerHasArrived(state,place){
 const sim=state.simulation;
 return !!place&&sim?.people?.player?.location===place&&!sim.jobs?.some(job=>
  job.actorId==='player'&&job.due>state.clock&&job.commandId?.startsWith('book.lotm.cast_walk_'));
}
export function bakeryCustomerFacts(state,data){
 const place=conversationPlace(state,data),here=!!place&&state.simulation?.people?.[C.id]?.location===place;
 const at=playerHasArrived(state,place);
 const canFinish=here&&conversationPlace({...state,clock:state.clock+1},data)===place;
 const facts=state.actors?.player?.facts||{};
 return {'bakery.customer.here':here,'bakery.customer.time':canFinish,
  'bakery.customer.interested':at&&here&&!!known(state,C.id,C.read)&&!known(state,C.id,C.directions),
  'bakery.customer.canAnswer':facts['book.lotm.tent.hired']===true,
  'bakery.customer.answered':!!known(state,C.id,C.directions)};
}
export function bakeryCustomerDue(state,data){
 return bakeryCustomerHere(state,data)&&(!known(state,C.id,C.visit)||
  !known(state,C.id,C.read)&&(state.actors?.[data.notice.baker]?.resources?.[CIRCUS_NOTICE.posted]||0)>0);
}
// Called at a real schedule arrival or posted-paper completion, not from a view.
// The existing knowledge writer owns persistence; old saves receive no backlog.
export function settleBakeryCustomer(state,data,write){
 if(!bakeryCustomerDue(state,data))return false;
 const effects=[];
 if(!known(state,C.id,C.visit))effects.push(note(C.id,C.visit,'I stopped at Sline Bakery for bread.'));
 if(!known(state,C.id,C.read)&&(state.actors?.[data.notice.baker]?.resources?.[CIRCUS_NOTICE.posted]||0)>0){
  effects.push(note(C.id,C.read,'The notice at Sline Bakery advertises a circus. I might enquire at the tent.'));
  if(playerHasArrived(state,data.notice.bakery))effects.push(note('player',C.read+'.witness','Edwin pauses over the circus notice while Wendy wraps his bread. “Perhaps I should ask at the tent.”'));
 }
 write(effects,P+'stop');return true;
}
export function bakeryCustomerStatus(state,data){
 if(!playerHasArrived(state,data?.notice.bakery))return '';
 if(!bakeryCustomerHere(state,data))return '';
 if(known(state,C.id,C.directions))return 'Edwin Cole folds his bread wrapper. You have already told him where you enquired. He leaves the bakery at 09:25.';
 return known(state,C.id,C.read)?'Edwin Cole waits for his bread beside the circus notice. “Perhaps I should ask at the tent.” He leaves the bakery at 09:25.':
  'Edwin Cole waits while Wendy wraps his bread. He keeps clear of the doorway and leaves at 09:25.';
}
export function bakeryCustomerSquareView(state,data){
 if(!data?.square||conversationPlace(state,data)!==data.square||!playerHasArrived(state,data.square)||state.simulation?.people?.[C.id]?.location!==data.square)return null;
 const interest=known(state,C.id,C.directions)?' You have already told him where you enquired.':known(state,C.id,C.read)?' “There was a circus notice at the bakery,” he says. “Perhaps I should ask at the tent.”':'';
 return {title:'At Municipal Square',status:'Edwin Cole is passing through with his bread. He plans to leave the square at 10:00.'+interest,
  source:'Edwin’s bread errand and conversation are authored local continuations.',appointments:[]};
}
