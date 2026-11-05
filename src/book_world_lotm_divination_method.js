// Divination methods for the BE seat (AD48 briefs B5 and R1). A means (pendulum, dowsing, chart, tarot, scrying...) is
// held by what the lead has learned, and a learned method only works for real while the Seer source is held. Two facts per
// method, so a row chooses what it stages:
//   actor.lotm.div.method.<m>.learned  the lesson was taken (knowledge `book.lotm.div.method.<m>`): enough for a show or a drill.
//   actor.lotm.div.method.<m>.real     learned AND the BE Seer source is supported (B1): the working divination.
// Default: methods are taught, not granted by the potion; the potion alone teaches none. Dial: a world or scene may grant the
// knowledge from any lesson, book or club act, or a row may require only `.learned` (a staged show, ch54 P041). Reason: a Seer's
// divination is a craft that rides on the spirit, so craft without the spirit is theatre and spirit without craft is noise.
// Pure data and two functions; no state, no clock, no save. The cost of a working step is beSeerUse() (B4).
import {beSeerFacts} from './book_world_lotm_be_seer.js';
export const BE_DIV_METHODS=Object.freeze(['pendulum','dowsing','scrying','astrolabe','mirror','chart','tarot','numerology','dream-divination']);
export const BE_DIV_PREFIX='actor.lotm.div.method.';
export const beDivMethodKey=m=>`book.lotm.div.method.${m}`;
const known=m=>{if(!BE_DIV_METHODS.includes(m))throw Error(`Unknown divination method ${m}; add it to BE_DIV_METHODS with its lesson.`);return m;};
// Effects of the lesson (a club or teacher act). `value` is the in-world account and `situationId` the act's own situation
// (the cast situation for the BE seat), both supplied by the content act.
export const beDivMethodLearnEffects=(m,value,situationId)=>[{type:'knowledge',actor:'player',key:beDivMethodKey(known(m)),stage:'understood',value,
 basis:{kind:'instruction',attributedTo:'player',situationId}}];
export const beDivMethodRequires=(m,{real=false}={})=>({fact:`${BE_DIV_PREFIX}${known(m)}.${real?'real':'learned'}`,op:'eq',value:true,
 reason:real?'You haven\'t learned this method, or you don\'t have the Seer power behind it.':'You haven\'t learned this method.'});
// Facts for the host projection (one additive call in book_world_lotm_div_supply.js). Only a book life that holds the
// Seer source reads true for `.real`; the Tingen life keeps its own I.method path.
export function beDivMethodFacts(state,ctx,{enrolled}){
 const out={},seer={};beSeerFacts(state,seer,{enrolled,flag:()=>false});
 const kn=state.simulation?.knowledge?.player||{};
 for(const m of BE_DIV_METHODS){
  const learned=!!enrolled&&kn[beDivMethodKey(m)]?.stage==='understood';
  out[`${BE_DIV_PREFIX}${m}.learned`]=learned;out[`${BE_DIV_PREFIX}${m}.real`]=learned&&seer['lotm.beSeer.supported']===true;
 }
 return out;
}
