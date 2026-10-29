// Life profiles for the Tingen branch (Q3, WA13): a start profile is body, means, debts, access and knowledge.
// The local probationer (Q1) is on the Beyonder track under Warden Hale; a probationer life holds the host clerk's purse, not money carried in. The new-identity civil clerk
// arrives under an assumed name, with cash and no papers carried over, and is hired as civil staff: a contract
// (F7, F8, F17), not initiation. Source facts: papers 8 pounds, clothes and goods about 12 (R), cash left 5 pounds,
// third-class passage 4 pounds a leg, an ocean ticket needs an official certificate [494 p20, p53-p56]; civil staff
// pay 2 pounds 10 soli weekly plus 10 soli secrecy and risk allowance, 3 pounds, a usual five-year term and lifetime
// secrecy [15 p57, 83 p61]; old ties stay known to the church teams [494 p21-p22]. Everything else (the clerk's
// post, what the contract lets them do, the week length) is an authored proposal (WPR5). Pure data.
import {LOTM_PENCE as P,LOTM_IDS as I,LOTM_LOCATIONS as L} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,money,know,cmd} from './book_world_lotm_kit.js';
import {getPrivateLotmCast} from './book_world_lotm_cast_days.js';
import {districtById} from './book_world_lotm_districts.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
export const LOTM_WEEK_MINUTES=7*24*60;
// A probationer life wakes in a local clerk's body and keeps the clerk's purse (WER9, AD11). Proposed amount.
const HOST_PURSE=2*P.pound;
export function validLeadLife(pack){
 const life=pack?.leadLife,p=life?.profile;
 return !!(p?.id===BE_PROFILE_ID&&p.key==='be'&&typeof p.start==='string'&&Number.isSafeInteger(p.cash)&&p.cash>=0&&
  pack.people?.some(x=>x.id===life.actorId)&&pack.places?.some(x=>x.id===p.start)&&Array.isArray(life.history)&&Array.isArray(life.relations));
}
export const LOTM_PROFILES=Object.freeze({
 probationer:{id:'lotm.early_tingen.local_probationer@1',key:'probationer',label:'Begin as a Nighthawk probationer',beyonderTrack:true,cash:HOST_PURSE,home:'evernight',start:L.workroom,
  blurb:'You are a clerk of the supervised workroom in early Tingen, on the probationer branch under Warden Hale. The clerk\'s own purse of 2 pounds is yours; the money you held before crossing stays behind.'},
 machinery:{id:'lotm.early_tingen.machinery_probationer@1',key:'machinery',label:'Begin as a Machinery team probationer',beyonderTrack:true,cash:HOST_PURSE,home:'machinery',start:L.university,
  blurb:'You are a clerk of the Steam and Machinery church\'s team in the university quarter, on the probationer track under its records officer. The Nighthawks are another church\'s team and another district. The clerk\'s own purse of 2 pounds is yours; the money you held before crossing stays behind.'},
 storm:{id:'lotm.early_tingen.storm_probationer@1',key:'storm',label:'Begin as a Mandated Punisher probationer',beyonderTrack:true,cash:HOST_PURSE,home:'storm',start:L.docks,
  blurb:'You are a clerk of the Church of the Storm\'s Mandated Punishers at the docks, on the probationer track under the duty officer. The Nighthawks and the Machinery team hold other districts. The clerk\'s own purse of 2 pounds is yours; the money you held before crossing stays behind.'},
 civil:{id:'lotm.early_tingen.new_identity_civil@1',key:'civil',label:'Begin under a new identity as civil staff',beyonderTrack:false,cash:5*P.pound,home:'evernight',start:L.workroom,
  contract:{weeklyPence:3*P.pound,termYears:5,secrecy:'for life',allowancePence:10*P.soli},
  // Proposed start budget: 29 pounds funded before entry, 24 spent, 5 remaining, no outstanding loan.
  // One paid third-class leg is prehistory, not an executable travel purchase or a ticket in custody.
  opening:{fundedPence:29*P.pound,debtPence:0,passageLegs:1},
  passage:{perLegPence:4*P.pound,certificateRequired:true},
  paidBefore:{papersPence:8*P.pound,clothesAndGoodsPence:12*P.pound},
  blurb:'An adult human clerk under a bought name. Of 29 pounds funded before entry, papers cost 8, clothes and goods 12, and one third-class passage 4; 5 remain, with no money debt. The money you held before crossing stays behind. The Nighthawk office offers 3 pounds a week, a five-year term and lifetime secrecy. A post brings no potion; church teams know your old ties. Later ocean passage needs an official certificate.'},
 get beside(){return getPrivateLotmCast()?.host?.profile||{id:'lotm.early_tingen.canon_beside@1',key:'beside',label:'Cast unavailable',beyonderTrack:false,cash:HOST_PURSE,home:null,start:L.lodging,blurb:'Private cast pack absent.'};},
 get be(){const pack=getPrivateLotmCast();return validLeadLife(pack)?pack.leadLife.profile:{id:BE_PROFILE_ID,key:'be',label:'Cast unavailable',beyonderTrack:false,home:null,start:L.lodging,blurb:'Private cast pack absent.'};}});
// Opening history uses the existing knowledge owner. It records paid costs, not fresh charges or invented items.
export const lifeEntryEffects=key=>[{
 // The workroom situation begins at report-in, after enrollment. Opening history has no situation attribution.
 type:'knowledge',actor:'player',key:'book.lotm.entry',stage:'understood',value:LOTM_PROFILES[key].blurb
}];
// The pack owns the identity and content. The caller installs these effects in
// the existing player's knowledge store after the cast situation begins.
// Dates and locators remain on the attribution, not on a second memory store.
export function leadLifeEntryEffects(pack){
 const life=pack?.leadLife;if(!life)return [];
 const people=new Map((pack.people||[]).map(p=>[p.id,p]));
 if(!people.has(life.actorId)||!Array.isArray(life.history)||!Array.isArray(life.relations))throw Error('The book life needs its person and opening records.');
 const basis=(date,locator)=>({kind:'recollection',attributedTo:'player',situationId:'book.lotm.tingen.canon_beside',date,locator});
 const memories=life.history.map(row=>{
  if(!row.id||!row.value||!row.date||!row.locator)throw Error('An opening memory needs its date and source.');
  return {type:'knowledge',actor:'player',key:`book.lotm.history.${row.id}`,stage:'understood',value:row.value,basis:basis(row.date,row.locator)};
 });
 const known=life.relations.map(row=>{
  const person=people.get(row.person);
  if(!person?.name||!row.date||!row.locator)throw Error('An opening relation needs a person, date and source.');
  return {type:'knowledge',actor:'player',key:`book.lotm.cast.known.${row.person}`,stage:'understood',value:person.name,basis:basis(row.date,row.locator)};
 });
 return [...memories,...known];
}
export const PROFILE_IDS=Object.freeze(Object.values(LOTM_PROFILES).map(p=>p.id));
export const profileKeyOf=state=>Object.values(LOTM_PROFILES).find(p=>p.id===state.lotm?.entryProfile)?.key||null;
// Weeks of salary earned since the contract was signed and not yet collected. The signing time is the contract note's own timestamp.
export function weeksOwed(state){
 const note=state.simulation?.knowledge?.player?.['book.lotm.contract'],paid=state.actors?.player?.resources?.['book.lotm.weeks_paid']||0;
 if(!note)return 0;return Math.max(0,Math.floor((state.clock-note.at)/LOTM_WEEK_MINUTES)+1-paid);
}
const C=LOTM_PROFILES.civil.contract;
const U='understood';
export const lifeCommands=[
 // Each non-Nighthawk life reports to its own district's officer (the Nighthawk life reports to Hale with the original report_in).
 ...Object.values(LOTM_PROFILES).filter(p=>p.beyonderTrack&&p.home!=='evernight').map(pr=>{const d=districtById(pr.home);return cmd(`report_in_${pr.key}`,`Report to ${d.officerLabel} in the ${d.label.split(' (')[0].replace('Tingen ','')} and read the terms`,pr.start,{targetId:d.officerId,alone:true,
  visibleWhen:all(eq(`lotm.profile.${pr.key}`),eq('lotm.officerHere'),no('reportedIn')),requires:all(eq(`lotm.profile.${pr.key}`),no('reportedIn')),
  effects:[{type:'situation',situationId:I.situation,operation:'begin'},af('reportedIn')]});}),
 cmd('sign_contract',`Sign the civil clerk's contract: ${C.weeklyPence/P.pound} pounds a week, ${C.termYears} years, secrecy ${C.secrecy}`,L.workroom,{entry:true,targetId:'book.lotm.supervisor',
  visibleWhen:all(eq('lotm.profile.civil'),eq('lotm.ready'),no('contract.signed')),requires:all(eq('lotm.profile.civil'),has('reportedIn'),no('contract.signed')),
  effects:[af('contract.signed'),know('contract',`You signed the civil staff contract: ${C.weeklyPence/P.pound} pounds a week (2 pounds 10 soli plus a ${C.allowancePence/P.soli}-soli secrecy and risk allowance), a ${C.termYears}-year term, secrecy ${C.secrecy}, and limits on where you may travel. It is a post, not initiation: it brings no potion and no field membership. The Nighthawk teams know your old ties and keep a close eye on a new clerk.`,'player','player','instruction',U)]}),
 cmd('collect_pay',`Collect a week's salary · ${C.weeklyPence/P.pound} pounds`,L.workroom,{entry:true,once:false,targetId:'book.lotm.supervisor',
  visibleWhen:all(eq('lotm.profile.civil'),eq('lotm.ready'),has('contract.signed')),requires:all(has('contract.signed'),gte('lotm.weeksOwed',1)),
  effects:[money(C.weeklyPence),{type:'resource',actor:'player',key:'book.lotm.weeks_paid',amount:1},know('pay',`You collected a week's civil staff pay: ${C.weeklyPence/P.pound} pounds. It comes weekly from the Nighthawk office, whatever the week held.`,'player','player','observation',U)]})];
