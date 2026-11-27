// An authored Blackthorn lost-property case, over the existing interview, tarot
// and acting seams. Anchors: the company front and lost-object tarot (the learning
// owner's zh ch115 p78 occasion). This visitor, letter, answer, fee and times are
// gameplay defaults, not a newly claimed canon episode.
import {defineDivinations} from './cast_divination_adapter.js';
import {lotmBeInterpretEffects} from './lotm_be_acting.js';
import {beDivMethodRequires} from './book_world_lotm_divination_method.js';
import {beSeerUse} from './book_world_lotm_be_seer.js';
import {LOTM_IDS} from './book_world_lotm_ids.js';
import {registerBeClient,clientSessionEffects,clientRefuseEffects,clientSessionRequires} from './book_world_lotm_be_clients.js';
import {OFFICE_CHART_CLIENT} from './lotm_office_followup.js';
export {OFFICE_CHART_CLIENT} from './lotm_office_followup.js';

export const OFFICE_LETTER_ROW='lotm.div.office-letter';
export const OFFICE_LETTER_CONTACT='book.lotm.div.contact.office-letter';
export const OFFICE_LETTER_FEE=8;
export const OFFICE_LETTER_RETURNED='book.lotm.office.letter.returned';
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const observed=(key,value,situationId)=>({type:'knowledge',actor:'player',key,stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId}});
// Both office questions use the same established reading compiler and observer.
const officeReading=(row,requires,situationId)=>defineDivinations({queries:[row]},{worldId:LOTM_IDS.world,group:'book_lotm',situationId,
 requires:{all:[eq('lotm.profile.be'),...requires]},interpretEffects:lotmBeInterpretEffects});

export function officeLetterCommands({office,situationId,command}) {
 const contact=eq(`knowledge.${OFFICE_LETTER_CONTACT}.seen`,true,'Ask the visitor when and where they last had the letter.');
 const common={location:office,situationId,question:'Where did the visitor leave the letter?',method:'A visitor at Blackthorn',queryLabel:'The missing letter'};
 const interview=command('lotm.be.office.letter-interview',{...common,label:'Hear the visitor’s account of a missing letter',minutes:10,
  description:'A visitor has lost a sealed letter while visiting Blackthorn. Ask where they went and when they last held it. They offer eight pence if you recover it.',
  requires:[],effects:[{type:'fact',scope:'actor',actor:'player',key:OFFICE_LETTER_RETURNED,value:false},
   {type:'knowledge',actor:'player',key:OFFICE_LETTER_CONTACT,stage:'seen',
   value:'The visitor held the sealed letter on arrival, waited by the reception bench, then went upstairs. They have checked their pockets and the stairs.',
   basis:{kind:'observation',attributedTo:'player',situationId}}],
  report:'The visitor retraced their morning for you. The letter was still in their hand when they reached reception.'});
 const row={id:OFFICE_LETTER_ROW,targetId:'lotm.div.target.office-letter',question:common.question,method:'Tarot divination',
  label:'Read for the visitor’s letter',description:'Use the visitor’s account and a tarot spread to look for the missing letter.',place:office,
  means:beDivMethodRequires('tarot',{real:true}),contact,
  steps:[
   {id:'prepare',kind:'prepare',label:'Have the visitor shuffle and cut',description:'Let the visitor shuffle and cut the deck while keeping the letter in mind.',minutes:1,report:'The visitor shuffled and cut. You laid the spread on the reception desk.'},
   {id:'ask',kind:'attempt',label:'Turn the card for the missing letter',description:'Draw on your spirituality and turn the card for where the letter has gone.',minutes:1,
    costs:[beSeerUse()],status:'signal',signal:'The card suggests a pause on a journey, with the sought thing close at hand.',report:'You turned the card for the missing letter.'},
   {id:'interpret',kind:'interpret',label:'Tell the visitor where you would look',description:'Compare the card with the visitor’s stops. Explain where you would search first.',minutes:1,
    belief:'I think the letter slipped down beside the reception bench while the visitor waited.',report:'You suggested searching beside and beneath the reception bench.'}
  ]};
 const reading=officeReading(row,[contact,eq(`actor.${OFFICE_LETTER_RETURNED}`,false,'The visitor already has the letter back.')],situationId);
 const search=command('lotm.be.office.letter-search',{...common,label:'Search the reception bench and return the letter',minutes:15,
  description:'Search beside and beneath the bench, then return anything you find to the waiting visitor. They offered eight pence for the letter.',
  // Physical searching remains possible from the testimony, without a reading.
  requires:[contact],effects:[{type:'resource',actor:'player',key:'money',amount:OFFICE_LETTER_FEE,native:true},
   {type:'fact',scope:'actor',actor:'player',key:OFFICE_LETTER_RETURNED,value:true}],
  report:'Behind a bench leg you find the sealed letter. The visitor checks the address, takes it back and pays you eight pence.'});
 return [interview,...reading,search];
}

export const OFFICE_CHART_ROW='lotm.div.office-delivery';
export const OFFICE_CHART_CONTACT='book.lotm.div.contact.office-delivery';
export const OFFICE_CHART_GROUNDS='book.lotm.div.grounds.office-delivery';
registerBeClient({id:OFFICE_CHART_CLIENT,label:'The returning visitor',service:'event chart',referrer:'blackthorn',referrerLabel:'Blackthorn reception',
 quote:{amount:8,currency:'pence',basis:'assumed'}});

// Canon anchors are the existing event-chart and repeat-Glacis entries in the
// learning owner (zh ch62 p70, ch115 p54). This dispatch question, missing time,
// reception ledger, fee and visit remain authored. A second occasion, not a reset
// of the first visitor's reward. Incomplete evidence can produce an unclear chart.
export function officeDeliveryCommands({office,situationId,command}) {
 const contact=eq(`knowledge.${OFFICE_CHART_CONTACT}.seen`,true,'Hear what the returning visitor wants to know about the delivery.');
 const open=clientSessionRequires(OFFICE_CHART_CLIENT);
 const common={location:office,situationId,question:'Will the visitor’s delivery reach the afternoon appointment?',method:'A returning visitor',queryLabel:'The delivery appointment'};
 const interview=command('lotm.be.office.delivery-interview',{...common,label:'Hear the returning visitor’s delivery question',minutes:10,
  description:'The visitor whose letter you found returns with a delivery question. They offer eight pence for an event chart with complete dispatch times, but cannot recall the exact departure time.',
  requires:[eq(`actor.${OFFICE_LETTER_RETURNED}`,true,'Return the first visitor’s letter before this visit.'),open],
  effects:[observed(OFFICE_CHART_CONTACT,'The visitor wants to know whether the delivery will reach an afternoon appointment. The parties and deadline are known, but the departure time is uncertain.',situationId),
   {type:'fact',scope:'actor',actor:'player',key:'book.lotm.office.delivery.timed',value:false}],
  report:'The visitor thanks you for finding the letter, then describes the delivery and admits they cannot remember its departure time.'});
 const ledger=command('lotm.be.office.delivery-ledger',{...common,label:'Check the dispatch time in reception’s ledger',minutes:15,
  description:'Compare the visitor’s receipt with the reception entries to establish the delivery’s departure time before drawing the chart.',
  requires:[contact,open],effects:[observed(OFFICE_CHART_GROUNDS,'The dispatch receipt matches a dated reception entry. You now have the exact departure time, the parties and the appointment deadline.',situationId),
   {type:'fact',scope:'actor',actor:'player',key:'book.lotm.office.delivery.timed',value:true}],
  report:'You match the receipt to the reception ledger. The departure time is now clear.'});
 const row={id:OFFICE_CHART_ROW,targetId:'lotm.div.target.office-delivery',question:common.question,method:'Astrological chart divination',
  label:'Chart the visitor’s delivery',description:'Draw an event chart from the visitor’s delivery details and key times.',place:office,
  means:beDivMethodRequires('chart',{real:true}),contact,
  grounds:{fact:'actor.book.lotm.office.delivery.timed',source:'The delivery’s exact departure time'},
  steps:[
   {id:'prepare',kind:'prepare',label:'Set out the delivery details',description:'Set down the parties, deadline and the departure time you have for the delivery.',minutes:2,report:'You set out the delivery details for the event chart.'},
   {id:'ask',kind:'attempt',label:'Draw the delivery’s event chart',description:'Use your spirituality to draw the chart from the supplied times. An uncertain departure time may leave the answer unclear.',minutes:2,costs:[beSeerUse()],
    status:'signal',signal:'The chart suggests a delay before the delivery reaches its destination.',report:'You drew the event chart for the delivery.'},
   {id:'interpret',kind:'interpret',label:'Explain what you can read from the delivery chart',description:'Read the chart against the supplied times. Keep an unclear answer separate from advice the visitor can use.',minutes:2,
    belief:'I think the delivery will miss the afternoon appointment; the visitor should arrange a later handover.',report:'You explained your reading of the delivery chart.'}
  ]};
 const reading=officeReading(row,[contact,open],situationId);
 const interpreted=eq(`actor.divination.${OFFICE_CHART_ROW}.phase`,'interpret','Finish explaining the event chart first.');
 const grounded=value=>eq(`actor.divination.${OFFICE_CHART_ROW}.grounded`,value,value?'Check the dispatch time, then draw and explain a grounded chart first.':'You have already read a clear answer from this chart.');
 const settlement=(id,label,description,report,effects,rules)=>command(id,{...common,label,description,report,minutes:2,
  requires:[contact,open,interpreted,...rules],effects:effects.map(e=>e.type==='knowledge'?{...e,value:report}:e)});
 const paid=settlement('lotm.be.office.delivery-paid','Accept eight pence for the completed chart',
  'The departure time supports your reading. Accept the visitor’s agreed eight-pence fee for the chart.',
  'The visitor pays eight pence for the event chart and arranges to postpone the handover.',clientSessionEffects(OFFICE_CHART_CLIENT),[grounded(true)]);
 const courtesy=settlement('lotm.be.office.delivery-courtesy','Give the completed chart without a fee',
  'Waive the eight-pence fee. The visitor keeps your completed chart and remembers the help.',
  'You waive the fee. The visitor keeps the chart and thanks you for the help.',clientSessionEffects(OFFICE_CHART_CLIENT,{quote:{basis:'unknown'}}),[grounded(true)]);
 const decline=settlement('lotm.be.office.delivery-unclear','Explain the uncertainty and take no fee',
  'The departure time was uncertain. Explain that you cannot give a useful answer from this chart and take no fee.',
  'You explain that the missing departure time leaves the chart unclear. The visitor keeps their eight pence; you make no delivery recommendation.',clientRefuseEffects(OFFICE_CHART_CLIENT),[grounded(false)]);
 return [interview,ledger,...reading,paid,courtesy,decline];
}
