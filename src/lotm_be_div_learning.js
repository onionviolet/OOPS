// Klein's own life (Be Klein): where the chart and tarot methods and his club clients come from (OR1 consumer).
// PROPOSAL (AD5, AD56): canon-close, adjustable defaults; minutes, places and gates are authored, not source-stated.
// - Old Neil teaches mysticism to the new civilian staffer at the Blackthorn Security office (canon: Neil's lessons
//   in Klein's first Nighthawk weeks, zh 第19-21章; that he taught chart and tarot by name is not located, so it is a
//   proposal). One lesson per method, through beDivMethodLearnEffects (the lesson seam, lesson.js lessonEffects).
//   Gate: at the office. Dial: Neil's body as a participant. Reason it is off: his schedule rows end on day 7 and his
//   body stays wherever the last scene left him (the cargo deck after the harbor emergency), so a presence gate would
//   shut the lesson for the rest of the life. Dial: a window (his first weeks); off so a later save can still learn.
// - Club cases. Angelica, the club's receptionist, books members' readings for Klein (canon: "someone wants a divination
//   from you", en v1 ch54 P068-P070). Hanass Vincent is not the introducer: he is dead by Klein's later club afternoons
//   (Angelica has heard of his death, pack act kj3as.tea), and the earned saves stand after those afternoons.
//   1. Glacis's event chart for his iron-mine investment (the chart row, zh 第62章 p70). Canon has a later chart for the
//      same client (zh 第115章 p54), so it is a reading of its own beside the earlier astrolabe session.
//   2. A club member's lost object read by tarot (canon occasion zh 第115章 p78, LOTM_DIVINATION_OCCASIONS). Our data does
//      not name that client or the object; Edward, a canon club regular (en v1 ch54 P033-P038), and a keepsake stand in.
//      PROPOSAL, as are its signal and belief. Its row is compiled here so the acting hook counts it.
//   No case reopens the Bogda operation spread or Joyce's date numbers: those readings already happened as paid club
//   sessions in Klein's canon life (kj3ao, kj3aa); they count once there (lotm_be_acting.js ROW_CLIENT).
//   Each case's gate: from the Moretti flat, with its method learned (Angelica books a member only for what he reads);
//   the act carries Klein to the Divination Club as the canon carriage does, and a repeatable carriage act brings him home.
// These commands sit beside the reading rows (they render in the same "Rites and questions" list) because the pack's
// place acts are one ordered story (place_act_sequence.js offers only the next stage) and cast talks follow the schedule,
// which no longer places Neil or Glacis. Expected refactor: move them to a side-act seam when one exists.
// Pure data built from the loaded pack; no clock, no save slice (knowledge and the command receipt are the record).
import {beDivMethodLearnEffects,beDivMethodRequires} from './book_world_lotm_divination_method.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {defineDivinations} from './cast_divination_adapter.js';
import {lotmBeInterpretEffects} from './lotm_be_acting.js';
import {officeLetterCommands,officeDeliveryCommands} from './lotm_office_case.js';
import {officeFollowupCommands} from './lotm_office_followup.js';

const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const LESSONS=Object.freeze([
 {method:'chart',minutes:45,question:'How is an event chart drawn and read?',
  label:'Learn chart divination from Old Neil',
  description:'At the Blackthorn Security Company office, Old Neil shows you how to set the key times of a matter on paper as an event chart and read where it is heading.',
  value:'Old Neil taught you event charts: take the parties and the key times from the client, place them on paper, and read the drift of the matter from the finished chart.'},
 {method:'tarot',minutes:45,question:'How is a tarot spread laid and read?',
  label:'Learn tarot divination from Old Neil',
  description:'At the Blackthorn Security Company office, Old Neil has you shuffle, cut and lay an Intis spread, then read the card that stands for the outcome.',
  value:'Old Neil taught you the tarot: the client shuffles and cuts, you lay the spread, and the outcome card is read against the question.'}]);
export const BE_CLUB_CASE=Object.freeze({contact:'contact.iron-mine-investment',grounds:'grounds.astrological-chart'});
export const BE_LOST_OBJECT=Object.freeze({row:'lotm.div.tarot-lost-object',contact:'contact.club-lost-object'});

// The lost-object reading. Contact is read straight from the lead's knowledge (the div supply reports only the rows
// file's facts); no grounds rule, because the client's own account is the contact. The row shows only once Edward is
// booked: an absent knowledge key is an unknown fact, which no rule can name, so the booking act carries the explanation.
const lostObjectRow=club=>({id:BE_LOST_OBJECT.row,targetId:'lotm.div.target.tarot-lost-object',question:'Where is the keepsake Edward has lost?',
 method:'Tarot divination',label:'Read for the lost keepsake',description:'In the Topaz room, have Edward shuffle and cut the club deck, then lay the spread for where his keepsake went.',
 locator:'zh 第115章 p78',place:club,
 means:{fact:'actor.lotm.div.means.tarot',op:'eq',value:true,reason:'Have a tarot deck and the ability to read the spread.'},
 contact:{fact:`knowledge.book.lotm.div.${BE_LOST_OBJECT.contact}.seen`,op:'eq',value:true,reason:'Have Edward here with his account of when and where he last had the keepsake.'},
 steps:[
  {id:'prepare',kind:'prepare',label:'Have Edward shuffle and cut',description:'Hand Edward the deck to shuffle and cut, then lay the spread.',minutes:1,report:'You laid the spread after Edward shuffled and cut.'},
  {id:'ask',kind:'attempt',label:'Turn the card for the keepsake',description:'Turn over the card that stands for where the keepsake is now.',minutes:1,status:'signal',signal:'The card for the keepsake speaks of hearth and household.',report:'You turned the card for the keepsake.'},
  {id:'interpret',kind:'interpret',label:'Tell Edward where to look',description:'Read the card against his account and tell him where to look.',minutes:1,belief:'I read the keepsake as still in his own house, put away somewhere he does not usually look.',report:'You told Edward where to look for his keepsake.'}]});

function command(id,{label,description,location,minutes,requires,effects,question,method,queryLabel,report,situationId,once=true,costs=[],costText}){
 const receiptKey=`divination.${id}`,base=eq('lotm.profile.be');
 const all={all:[base,...requires]};
 return {id,revision:1,label,description,worldId:I.world,actorId:'player',group:'book_lotm',location,once,duration:minutes,
  cancellation:'refund',visibleWhen:base,requires:all,completionRequires:all,completionCoLocated:true,completionFailure:'refund',costs,
  effects:[...effects,{type:'knowledge',actor:'player',key:receiptKey,stage:'seen',value:report,basis:{kind:'observation',attributedTo:'player',situationId}}],
  divination:{queryId:id,question,targetId:id,method,label:queryLabel,kind:'prepare',receiptKey,phaseKey:`divination.${id}.phase`,...(costText?{costText}:{}),ritual:null,dial:null}};
}
// Commands for the loaded pack, or none when the pack lacks the office, flat or club (fixtures, other casts).
export function lotmBeDivLearning(pack,situationId){
 const place=index=>pack?.places?.find(p=>p.indexId===index)?.id;
 const office=place('lotm.place.night-watch-reception'),flat=place('lotm.place.flat'),club=place('lotm.place.divination-club');
 if(!office||!flat||!club)return [];
 const lessons=LESSONS.map(l=>command(`lotm.be.lesson.${l.method}`,{label:l.label,description:l.description,location:office,minutes:l.minutes,requires:[],
  effects:beDivMethodLearnEffects(l.method,l.value,situationId),question:l.question,method:'Mysticism lesson',queryLabel:'Old Neil\'s lessons',
  report:`You finished Old Neil's lesson. ${l.value}`,situationId}));
 const know=(name,value,at)=>({type:'knowledge',actor:'player',key:`book.lotm.div.${name}`,stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId,at}});
 const ride={type:'relocate',actor:'player',location:club},club2={question:'Who wants a reading from you?',method:'Club introduction',queryLabel:'The Divination Club',location:flat,minutes:40,situationId};
 const glacis=command('lotm.be.club.glacis-chart',{...club2,label:'Take the carriage to the club for Glacis\'s chart',
  description:'From the Moretti flat, ride the public carriage to Howes Street and climb to the Divination Club, where Angelica says Glacis is asking for you: he wants an event chart drawn for his iron-mine investment.',
  requires:[{...beDivMethodRequires('chart'),reason:'Angelica books chart clients only for members who draw charts. Learn chart divination from Old Neil first.'}],
  effects:[ride,
   know(BE_CLUB_CASE.contact,'Glacis described the iron-mine investment, the parties to it and the key times you need for an event chart.','zh 第62章 p70'),
   know(BE_CLUB_CASE.grounds,'Glacis told you how the investment was put to him and when; a chart has something real to stand on.','zh 第62章 p70')],
  report:'At the Divination Club, Angelica showed Glacis in. He gave you the details and key times of his iron-mine investment and asked for a chart.'});
 const lost=command('lotm.be.club.lost-object',{...club2,label:'Take the carriage to the club for Edward\'s lost keepsake',
  description:'From the Moretti flat, ride the public carriage to Howes Street. At the Divination Club, Angelica says Edward, a regular, wants a tarot reading for a keepsake he has lost.',
  requires:[{...beDivMethodRequires('tarot'),reason:'Angelica books tarot clients only for members who read the cards. Learn tarot divination from Old Neil first.'}],
  effects:[ride,know(BE_LOST_OBJECT.contact,'Edward told you what the keepsake is, when he last had it and where he has already looked.','zh 第115章 p78')],
  report:'At the Divination Club, Angelica showed Edward into the Topaz room. He told you about the keepsake he has lost and asked for the cards.'});
 const reading=defineDivinations({queries:[lostObjectRow(club)]},{worldId:I.world,group:'book_lotm',situationId,requires:{all:[eq('lotm.profile.be'),lostObjectRow(club).contact]},interpretEffects:lotmBeInterpretEffects});
 // The way back: the club is not on the walking map (canon reaches it by public carriage), so a case would otherwise
 // leave Klein there until a later story scene moves him. Repeatable; 25 minutes like the canon ride out (kj3ac.ride).
 const home=command('lotm.be.club.home',{label:'Take the public carriage home',description:'Leave the Divination Club and ride the public carriage back from Howes Street to the Moretti flat.',
  location:club,minutes:25,requires:[],effects:[{type:'relocate',actor:'player',location:flat}],question:'Where next?',method:'Public carriage',queryLabel:'The Divination Club',
  report:'You rode the public carriage home from Howes Street.',situationId,once:false});
 return [...lessons,glacis,lost,...reading,home,...officeLetterCommands({office,situationId,command}),...officeDeliveryCommands({office,situationId,command}),...officeFollowupCommands({office,situationId,command})];
}
