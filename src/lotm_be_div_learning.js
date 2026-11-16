// Klein's own life (Be Klein): where the chart and tarot methods and his chart client come from (OR1 consumer).
// PROPOSAL (AD5, AD56): canon-close, adjustable defaults; minutes, places and gates are authored, not source-stated.
// - Old Neil teaches mysticism to the new civilian staffer at the Blackthorn Security office (canon: Neil's lessons
//   in Klein's first Nighthawk weeks, zh 第19-21章; that he taught chart and tarot by name is not located, so it is a
//   proposal). One lesson per method, through beDivMethodLearnEffects (the lesson seam, lesson.js lessonEffects).
//   Gate: at the office. Dial: Neil's body as a participant. Reason it is off: his schedule rows end on day 7 and his
//   body stays wherever the last scene left him (the cargo deck after the harbor emergency), so a presence gate would
//   shut the lesson for the rest of the life. Dial: a window (his first weeks); off so a later save can still learn.
// - The club case: Hanass Vincent passes Glacis, a club member, to Klein for an event chart of his iron-mine investment
//   (the chart row, zh 第62章 p70; canon has a later chart for the same client, zh 第115章 p54). Completing it writes the
//   chart row's contact and grounds knowledge. Gate: from the Moretti flat, with chart divination learned (the club sends
//   chart clients to members who draw charts); the act carries Klein to the Divination Club as the canon carriage does.
// These commands sit beside the reading rows (they render in the same "Rites and questions" list) because the pack's
// place acts are one ordered story (place_act_sequence.js offers only the next stage) and cast talks follow the schedule,
// which no longer places Neil or Glacis. Expected refactor: move them to a side-act seam when one exists.
// Pure data built from the loaded pack; no clock, no save slice (knowledge and the command receipt are the record).
import {beDivMethodLearnEffects,beDivMethodRequires} from './book_world_lotm_divination_method.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';

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

function command(id,{label,description,location,minutes,requires,effects,question,method,queryLabel,report,situationId}){
 const receiptKey=`divination.${id}`,base=eq('lotm.profile.be');
 const all={all:[base,...requires]};
 return {id,revision:1,label,description,worldId:I.world,actorId:'player',group:'book_lotm',location,once:true,duration:minutes,
  cancellation:'refund',visibleWhen:base,requires:all,completionRequires:all,completionCoLocated:true,completionFailure:'refund',costs:[],
  effects:[...effects,{type:'knowledge',actor:'player',key:receiptKey,stage:'seen',value:report,basis:{kind:'observation',attributedTo:'player',situationId}}],
  divination:{queryId:id,question,targetId:id,method,label:queryLabel,kind:'prepare',receiptKey,phaseKey:`divination.${id}.phase`,ritual:null,dial:null}};
}
// Commands for the loaded pack, or none when the pack lacks the office, flat or club (fixtures, other casts).
export function lotmBeDivLearning(pack,situationId){
 const place=index=>pack?.places?.find(p=>p.indexId===index)?.id;
 const office=place('lotm.place.night-watch-reception'),flat=place('lotm.place.flat'),club=place('lotm.place.divination-club');
 if(!office||!flat||!club)return [];
 const lessons=LESSONS.map(l=>command(`lotm.be.lesson.${l.method}`,{label:l.label,description:l.description,location:office,minutes:l.minutes,requires:[],
  effects:beDivMethodLearnEffects(l.method,l.value,situationId),question:l.question,method:'Mysticism lesson',queryLabel:'Old Neil\'s lessons',
  report:`You finished Old Neil's lesson. ${l.value}`,situationId}));
 const know=(name,value)=>({type:'knowledge',actor:'player',key:`book.lotm.div.${name}`,stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId,at:'zh 第62章 p70'}});
 const intro=command('lotm.be.club.glacis-chart',{label:'Take the carriage to the club for Hanass Vincent\'s client',
  description:'From the Moretti flat, ride the public carriage to Howes Street and climb to the Divination Club, where Hanass Vincent introduces Glacis, a member who wants an event chart drawn for his iron-mine investment.',
  location:flat,minutes:40,requires:[{...beDivMethodRequires('chart'),reason:'The club sends chart clients to members who draw charts. Learn chart divination from Old Neil first.'}],
  effects:[{type:'relocate',actor:'player',location:club},
   know(BE_CLUB_CASE.contact,'Glacis described the iron-mine investment, the parties to it and the key times you need for an event chart.'),
   know(BE_CLUB_CASE.grounds,'Glacis told you how the investment was put to him and when; a chart has something real to stand on.')],
  question:'Who wants a reading from you?',method:'Club introduction',queryLabel:'The Divination Club',
  report:'At the Divination Club, Hanass Vincent introduced Glacis, who gave you the details and key times of his iron-mine investment and asked for a chart.',situationId});
 return [...lessons,intro];
}
