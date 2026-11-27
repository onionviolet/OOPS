// Authored ordinary-day experiment, not a new canon episode. The existing
// officecourier client receipt/favor is this visitor's durable remembered help.
// There is no new favor purse, client identity, calendar, reputation or case engine.
import {castCalendar} from './lotm_cast_calendar.js';

export const OFFICE_CHART_CLIENT='officecourier';
export const OFFICE_FOLLOWUP='book.lotm.office.delivery.followup';
export const OFFICE_FOLLOWUP_REFERENCE=`${OFFICE_FOLLOWUP}.reference`;
export const OFFICE_FOLLOWUP_DONE=`${OFFICE_FOLLOWUP}.corrected`;
export const OFFICE_FOLLOWUP_DIALS=Object.freeze({from:9,until:11,helpMinutes:5,ledgerMinutes:45,runnerMinutes:15,runnerPence:2});
const CLIENT=`book.lotm.be.client.${OFFICE_CHART_CLIENT}`;
const FACT='lotm.be.office.followup';
export function officeFollowupView(state) {
 const facts=state?.actors?.player?.facts||{},notes=state?.simulation?.knowledge?.player||{};
 const status=facts[CLIENT],settled=['paid','served_unpaid','refused'].includes(status);
 if(!settled||!Number.isSafeInteger(state?.lotm?.initializedAt)||!Number.isSafeInteger(state.clock))return null;
 const at=notes[`${CLIENT}.session`]?.at;
 const dated=Number.isSafeInteger(at)&&at>=state.lotm.initializedAt&&at<=state.clock;
 const now=castCalendar(state).calendar,then=dated?castCalendar({...state,clock:at}).calendar:null;
 const nextDay=!!then&&now.day_count===then.day_count+1;
 const afterDay=!then||now.day_count>then.day_count;
 const remembers=['paid','served_unpaid'].includes(status)&&(facts[`${CLIENT}.favor`]||0)>0;
 const {from,until}=OFFICE_FOLLOWUP_DIALS;
 const window=nextDay&&now.hour>=from&&now.hour<until;
 const done=facts[OFFICE_FOLLOWUP_DONE]===true,reference=!!notes[OFFICE_FOLLOWUP_REFERENCE];
 const reason=done?'The corrected dispatch order has gone out.'
  : reference?'You have the corrected address and docket number. A runner can carry the order for two pence.'
  : !dated?'The old client record has no visit date. The reception ledger can still trace the dispatch.'
  : !afterDay?'The visitor will return tomorrow, 09:00–11:00. The delivery log is reconciled then.'
  : !remembers?'No chart was completed for this visitor. You can trace the dispatch yourself in the reception ledger.'
  : window?'The visitor is back with their dispatch docket. They remember your help and will show it to you.'
  : nextDay&&now.hour<from?'The visitor returns today, 09:00–11:00. The reception ledger is already available.'
  : 'The visitor has left on their route. The reception ledger still holds the dispatch entry.';
 return {status,dated,nextDay,afterDay,remembers,window,done,reference,reason};
}
export function officeFollowupFacts(state) {
 const v=officeFollowupView(state);
 return Object.fromEntries(['settled','afterDay','remembers','window','reference','unresolved','missingReference'].map(key=>[`${FACT}.${key}`,
  key==='settled'?!!v:key==='unresolved'?!!v&&!v.done:key==='missingReference'?!!v&&!v.reference:!!v?.[key]]));
}
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
export function officeFollowupCommands({office,situationId,command}) {
 const d=OFFICE_FOLLOWUP_DIALS;
 const common={location:office,situationId,question:'How can the visitor’s delayed delivery be redirected?',method:'A dispatch follow-up',queryLabel:'The delayed delivery'};
 const settled=eq(`${FACT}.settled`,true,'Finish the returning visitor’s chart visit first.');
 const later=eq(`${FACT}.afterDay`,true,'The delivery log is reconciled the next day. Return to Blackthorn tomorrow.');
 const unresolved=eq(`${FACT}.unresolved`,true,'The corrected dispatch order has already gone out.');
 const missing=eq(`${FACT}.missingReference`,true,'You already have the dispatch reference. Send the corrected order.');
 const note=(key,value)=>({type:'knowledge',actor:'player',key,stage:'seen',value,basis:{kind:'observation',attributedTo:'player',situationId}});
 const reference='The dispatch docket names the wrong receiving desk. The corrected order belongs to the delivery counter at Blackthorn, under the original docket number.';
 const help=command('lotm.be.office.followup-visitor',{...common,label:'Ask the returning visitor for the dispatch docket',minutes:d.helpMinutes,
  description:'The same visitor returns the morning after the chart visit, from 09:00 to 11:00. Because they remember the completed reading, they offer the docket you need. It takes five minutes; the ledger provides another route if they cannot help.',
  requires:[settled,unresolved,missing,eq(`${FACT}.remembers`,true,'This visitor remembers that no chart was completed. Trace the delivery in the reception ledger instead.'),
   eq(`${FACT}.window`,true,'The visitor returns 09:00–11:00 on the day after the chart visit. Their route takes them away afterwards; the reception ledger stays available.')],
  effects:[note(OFFICE_FOLLOWUP_REFERENCE,reference),note(`${OFFICE_FOLLOWUP}.source`,'The returning visitor showed you their docket because they remember your completed reading.')],
  report:'The visitor remembers your help and opens their dispatch docket. You copy the corrected counter and original docket number.'});
 const ledger=command('lotm.be.office.followup-ledger',{...common,label:'Trace the delivery through reception’s ledger',minutes:d.ledgerMinutes,
  description:'After the chart visit’s day, compare the public reception entries with the dispatch copies yourself. Forty-five minutes finds the same corrected counter and docket number without the visitor’s help. No fee or favor is needed.',
  requires:[settled,later,unresolved,missing],effects:[note(OFFICE_FOLLOWUP_REFERENCE,reference),note(`${OFFICE_FOLLOWUP}.source`,'You compared the reception ledger with dispatch copies and found the corrected instruction yourself.')],
  report:'You work through the reception entries and dispatch copies. The corrected counter and original docket number match.'});
 const send=command('lotm.be.office.followup-send',{...common,label:'Send the corrected dispatch order · 2 pence',minutes:d.runnerMinutes,
  description:'Give the runner the corrected counter and original docket number. Two pence pays for the fifteen-minute errand; the signed return closes the delivery correction.',
  requires:[settled,later,unresolved,eq(`${FACT}.reference`,true,'Get the corrected counter and docket number from the visitor or reception’s ledger first.')],
  costs:[{type:'resource',actor:'player',key:'money',native:true,amount:-d.runnerPence}],
  costText:'Two pence to the runner.',
  effects:[{type:'fact',scope:'actor',actor:'player',key:OFFICE_FOLLOWUP_DONE,value:true},note(`${OFFICE_FOLLOWUP}.delivered`,'The runner returned the signed dispatch correction. The parcel is directed to the right Blackthorn delivery counter.')],
  report:'The runner carries your corrected order and brings back its signed receipt. The dispatch correction is complete.'});
 return [help,ledger,send];
}
