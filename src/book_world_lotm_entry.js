// How a life gets into early Tingen (WER2-WER9, WER12): era, crossing method, host and the
// nine answers shown before confirming. Pure data; the host records the chosen entry and the UI
// reads the answers. Written options are what this build runs; the rest are listed with the reason
// they cannot be chosen yet (UIV1), never hidden. Amounts and hosts are authored proposals (WPR5).
import {LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {LOTM_PROFILES} from './book_world_lotm_lives.js';
import {districtById} from './book_world_lotm_districts.js';

export const LOTM_ENTRY_ERA=1349;
// One line per axis: the written default first, then what is listed but not written.
export const LOTM_ENTRY_AXES=Object.freeze([
 {id:'era',label:'Year',options:[
  {id:'1349',label:'1349, early Tingen',available:true},
  {id:'1352',label:'1352 and later',available:false,reason:'Not written yet: later years need their own Tingen.'}]},
 {id:'method',label:'How you arrive',options:[
  {id:'crossing',label:'You wake in a local who has just died',available:true},
  {id:'design',label:'Brought over by someone\'s design, as in the books',available:false,reason:'Not written yet: that route carries pulls and claims this build has no rules for.'}]},
 {id:'host',label:'Host',options:[
  {id:'adult',label:'An adult clerk',available:true},
  {id:'young',label:'A child or teenager',available:false,reason:'Not written yet: the church teams hire adult clerks, and young hosts need lives of their own.'}]}]);

// What each life's crossing is (XM1 into a local clerk; the civil life arrives in person, XM3).
export const entryMethodOf=key=>key==='civil'?'in_person':'crossing';

const officerOf=key=>{const p=LOTM_PROFILES[key];return p.home==='evernight'?'Warden Hale':districtById(p.home).officerLabel;};
const pounds=pence=>`${pence/P.pound} pound${pence===P.pound?'':'s'}`;

// The nine questions every crossing answers (WER3), in plain words, matching what enroll does.
export function entryAnswers(key){
 const p=LOTM_PROFILES[key];if(!p)throw Error('Choose one of the Tingen starts.');
 const paused='Your Village life stops where you left it. No way back is written yet, so Export first if you want to keep playing it.';
 if(entryMethodOf(key)==='in_person')return [
  ['Body','Your own adult body. You arrive in person.'],
  ['Memories','Yours, whole. You carry no one else\'s.'],
  ['Base cheat','Comes with you, unchanged.'],
  ['Money and items',`Of 29 pounds funded before you came, papers, clothes and one passage took 24. You hold ${pounds(p.cash)}. The money you held before crossing stays behind.`],
  ['Name and papers','A bought name on 8-pound papers. The church teams know your old ties.'],
  ['Language','You speak Loenese well enough to pass as a clerk.'],
  ['Who notices','The Nighthawk office knows you are new and keeps a close eye on a new clerk.'],
  ['Your old life',paused],
  ['What you owe',`No money debt. The Nighthawk office offers a civil post: ${pounds(p.contract.weeklyPence)} a week, ${p.contract.termYears} years, secrecy ${p.contract.secrecy}. Later ocean passage needs an official certificate.`]];
 return [
  ['Body','An adult Tingen clerk who died in the night. You wake in their body, healthy enough to work.'],
  ['Memories','Yours carry whole. The clerk\'s come in fragments: faces, the office routine, the way home.'],
  ['Base cheat','Comes with you, unchanged.'],
  ['Money and items',`Nothing physical crosses. The money you held stays behind; the clerk\'s own purse, ${pounds(p.cash)}, is yours.`],
  ['Name and papers','The clerk\'s name, papers and post are yours, and their colleagues expect them at work.'],
  ['Language','The clerk\'s Loenese comes with the body.'],
  ['Who notices','No one, at first. Colleagues see a clerk who seems a little changed.'],
  ['Your old life',paused],
  ['What you owe',`The clerk\'s post: report to ${officerOf(key)} and serve a probation under church supervision.`]];
}

// The saved record of how this life got in. Optional on state.lotm: saves enrolled before it hold none.
export function entryRecord(key,leftBehindMoney){
 return {era:LOTM_ENTRY_ERA,method:entryMethodOf(key),host:'adult',leftBehind:{money:leftBehindMoney}};
}
export function validEntryRecord(e){
 return e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).length===4&&e.era===LOTM_ENTRY_ERA&&['crossing','in_person'].includes(e.method)&&e.host==='adult'
  &&e.leftBehind&&typeof e.leftBehind==='object'&&Object.keys(e.leftBehind).length===1&&Number.isSafeInteger(e.leftBehind.money)&&e.leftBehind.money>=0;
}
