// Tingen districts as a region layer (Q2, SR1-SR24, institutions pass F1, F2, EF2). Jurisdiction in Tingen follows
// worship first and territory second: the Nighthawks (Evernight) hold the north and west, the Mandated Punishers
// (Storm) hold the docks, east and south, and the Machinery team (Steam and Machinery) holds the university
// quarter and outskirts [17 p79]. The district decides who supervises, what a visitor's endorsement costs, what
// an errand pays and who answers an incident. Teams, split and escalation are source-stated; the officers (original,
// unnamed roles), the endorsement fees and the errand pay are authored proposals (WPR5). Pure data and pure functions.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_PENCE as P} from './book_world_lotm_ids.js';
// Merged with the primary checkout's parallel Q2 (2026-10-23 reconciliation): that lane's district text, vouch rows, shift and travel minutes are kept as data
// under `alias` ('north','docks','university'); this lane's church, officer, endorsement and errand fields are the other half of each row.
const Q2_ROWS=Object.freeze({
 north:
 {id:'north',label:'North quarter',places:[L.workroom,L.lodging],team:'Nighthawks',church:'Evernight Church',doseHere:true,shift:null,vouch:{},
  claim:'Stated by the Nighthawks\' captain: the Nighthawks hold the north, the west and the Golden Plane area.',
  here:'The Nighthawks answer here. Warden Hale supervises your work in person, and this church issues and assesses its own doses.',
  why:'This is your own church\'s ground, so Hale supervises directly and nothing is vouched to anyone else.'},
 docks:{id:'docks',label:'Docks',places:[L.docks],team:'Mandated Punishers',church:'Storm Church',doseHere:false,shift:null,
  vouch:{act_laying_out:{cost:2,label:'Lay out a drowned body at the docks morgue, signed off by a Mandated Punisher · Hale vouches 2 of his attention, 25 min',
    reason:'The Mandated Punishers hold the docks and take the file on any body found there, so Hale must vouch for you to them in writing.'},
   act_reading:{cost:1,label:'Read for a dockside client under a Mandated Punisher\'s eye · 1 spirituality, Hale vouches 1 of his attention, 10 min',
    reason:'The Storm Church\'s Punishers watch the docks, so a reading for a stranger there has to be vouched for by your warden.'}},
  claim:'Stated by the Nighthawks\' captain: the Mandated Punishers (group 6) hold the docks, the east and the south.',
  here:'The Mandated Punishers answer here, not Warden Hale. Your acts need his written vouching, and this church does not issue or assess another church\'s doses.',
  why:'Jurisdiction follows worship, then territory: the docks belong to the Storm Church\'s team, so a Nighthawk probationer works there on a vouch.'},
 university:{id:'university',label:'University area',places:[L.university],team:'Machinery team',church:'Steam and Machinery Church',doseHere:false,shift:[0,960],
  vouch:{act_reading:{cost:1,label:'Read for a student or lecturer under the Machinery team\'s watch · 1 spirituality, Hale vouches 1 of his attention, 10 min',
    reason:'The Machinery team (group 5) holds the university area and its outskirts, and takes files only while its gatehouse is manned.'}},
  claim:'Stated by the Nighthawks\' captain: the Machinery team (group 5) holds the university area and the outskirts. The English gloss of the team\'s name varies in translation.',
  here:'The Machinery team answers here. Its gatehouse takes vouched files only on its day shift (the first 16 hours of each branch day, an authored span), and this church does not issue or assess another church\'s doses.',
  why:'Jurisdiction follows worship, then territory: the university area belongs to the Machinery team, so a Nighthawk probationer works there on a vouch and only while it is on shift.'}});
// Authored travel minutes between districts (proposals); places in one district are 2 minutes apart.
export const LOTM_LINKS=Object.freeze({'north|docks':20,'north|university':25,'docks|university':35});
export const LOTM_SAME_DISTRICT_MINUTES=2;
const OWN=[
 {alias:'north',id:'evernight',label:'Evernight quarter (north and west)',church:'Evernight',team:'the Nighthawks',officerId:I.supervisor,officerLabel:'Warden Hale',places:[L.workroom,L.lodging],endorsementPence:3*P.soli,errandPence:12,errand:'Carry a sealed ledger between the Nighthawk offices'},
 {alias:'docks',id:'storm',label:'Tingen docks (east and south)',church:'Storm',team:'the Mandated Punishers',officerId:I.stormOfficer,officerLabel:'the Punishers\' duty officer',places:[L.docks],endorsementPence:2*P.soli,errandPence:18,errand:'Tally a sealed crate against the harbour manifest for the duty officer'},
 {alias:'university',id:'machinery',label:'Tingen university quarter',church:'Steam and Machinery',team:'the Machinery team',officerId:I.machineryOfficer,officerLabel:'the Machinery team\'s records officer',places:[L.university],endorsementPence:5*P.soli,errandPence:15,errand:'Copy a gear schedule for the records officer'}];
export const LOTM_DISTRICTS=Object.freeze(OWN.map(d=>{const q=Q2_ROWS[d.alias];return {...d,q2team:q.team,qlabel:q.label,doseHere:q.doseHere,shift:q.shift,vouch:q.vouch,claim:q.claim,here:q.here,why:q.why};}));
export const districtOfPlace=place=>LOTM_DISTRICTS.find(d=>d.places.includes(place))||null;
export const districtById=id=>LOTM_DISTRICTS.find(d=>d.id===id)||null;
export const homeDistrict=LOTM_DISTRICTS[0];
export const LOTM_PLACE_KEYS=Object.freeze(Object.fromEntries(Object.entries(L).map(([k,v])=>[v,k])));
export function lotmWalkMinutes(from,to){
 const a=districtOfPlace(from),b=districtOfPlace(to);if(!a||!b||from===to)return null;
 return a.id===b.id?LOTM_SAME_DISTRICT_MINUTES:LOTM_LINKS[`${a.alias}|${b.alias}`]??LOTM_LINKS[`${b.alias}|${a.alias}`]??null;
}
// The team on duty supervises only on shift (a district with no shift is always on duty).
export const onShift=(d,clock)=>!d.shift||(clock%1440>=d.shift[0]&&clock%1440<d.shift[1]);
// Facts under both id sets: this lane's (lotm.district.<id>, lotm.home.<id>) and the primary lane's aliases (lotm.district.<alias>.here/.supervised, lotm.district.doseOk).
export function districtFacts(state,enrolled){
 const f={},at=state.simulation?.people?.player?.location,here=enrolled?districtOfPlace(at):null;
 for(const d of LOTM_DISTRICTS){f[`lotm.district.${d.alias}.here`]=!!here&&here.id===d.id;f[`lotm.district.${d.alias}.supervised`]=!!here&&here.id===d.id&&onShift(d,state.clock);}
 f['lotm.district.doseOk']=!!here&&here.doseHere===true;
 return f;
}
// Who answers an incident (F2): affiliation first, territory second. The party's own church team answers; when the territory belongs to another
// church the territory's team is told and the case passes up to headquarters rather than being tried here. An unaffiliated party falls to territory.
export function respondersFor(districtId,partyChurch=null){
 const d=districtById(districtId);if(!d)return null;
 const home=partyChurch?LOTM_DISTRICTS.find(x=>x.church===partyChurch):null;
 if(!home||home.church===d.church)return {primary:d.team,informed:null,escalates:false,line:`${d.team} answer here, in their own district.`};
 return {primary:home.team,informed:d.team,escalates:true,line:`${home.team} answer for their own, ${d.team} are told, and a mixed case goes up to headquarters.`};
}
// Walks (the primary lane's mechanism, kept byte-for-byte for the canonical set so a save holding a walk job loads): a timed job whose arrival
// record names the district, its team and the attributed claim. The canonical text is the Nighthawk life's reading; the Machinery and Storm lives get
// their own life-neutral set (ids end in _<life>) because "not Warden Hale" and "another church's doses" would be false for them.
const sameDist=(a,b)=>districtOfPlace(a)?.id===districtOfPlace(b)?.id;
const hereFor=(d,home)=>d.id===home.id?`${cap(d.team)} answer here, in their own district. ${home.officerLabel[0].toUpperCase()+home.officerLabel.slice(1)} supervises you in person, and this church issues and assesses its own doses.`
 :`${cap(d.team)} answer here, not ${home.officerLabel}. A clerk of another church's team needs this district's endorsement (${d.endorsementPence} pence) before they are given work, and this church does not issue or assess another church's doses.`;
const cap=t=>t[0].toUpperCase()+t.slice(1);
const walkSet=home=>Object.values(L).flatMap(from=>Object.values(L).filter(to=>to!==from).map(to=>{
 const dd=districtOfPlace(to),m=lotmWalkMinutes(from,to),text=home?hereFor(dd,districtById(home)):dd.here;
 return cmd(`walk_${LOTM_PLACE_KEYS[from]}_${LOTM_PLACE_KEYS[to]}${home?`_${home}`:''}`,`Walk to ${to} · ${m} min`,from,{alone:true,once:false,duration:m,cancellation:'none',
  effects:[know('arrived',`You reach ${to}${sameDist(from,to)?'':` (${dd.qlabel.toLowerCase()})`}. ${text} ${dd.claim}`)]});}));
// Commands (Q2). Walking is a timed job started by the host; the host never lists the walk commands as buttons (the places list does).
// An endorsement is the visiting clerk's clearance in another church's district (F2: worship first, territory second); an errand is the
// paid ordinary work each district offers and its rate is the district's own. All fees and rates are authored proposals.
import {eq,gte,all,any,af,has,no,money,know,attention,cmd} from './book_world_lotm_kit.js';
const KEYS=Object.entries(L);
export const lotmWalkKeys=KEYS.map(([k])=>k);
const note='observation';
export const districtCommands=[
 ...walkSet(null),...walkSet('storm'),...walkSet('machinery'),
 ...LOTM_DISTRICTS.map(d=>cmd(`endorse_${d.id}`,`Present your papers at the ${d.team.replace('the ','')} office · ${d.endorsementPence} pence endorsement`,d.places[0],{targetId:d.officerId,officer:true,visibleWhen:all(eq('lotm.readyAtOfficer'),eq(`lotm.district.${d.id}`),eq(`lotm.home.${d.id}`,false),no(`endorsed.${d.id}`)),
  requires:all(eq(`lotm.home.${d.id}`,false),no(`endorsed.${d.id}`)),costs:[money(-d.endorsementPence)],effects:[af(`endorsed.${d.id}`),
   know(`endorsed.${d.id}`,`${d.officerLabel[0].toUpperCase()+d.officerLabel.slice(1)} endorsed your papers for ${d.label}. It covers errands in this district only; your own captain's clearance does not travel (jurisdiction follows worship first, territory second).`,'player','player','instruction','understood')]})),
 ...LOTM_DISTRICTS.map(d=>cmd(`errand_${d.id}`,`${d.errand} · ${d.errandPence} pence, 20 min`,d.places[0],{targetId:d.officerId,officer:true,once:false,
  visibleWhen:all(eq('lotm.readyAtOfficer'),eq(`lotm.district.${d.id}`),any(eq(`lotm.home.${d.id}`),has(`endorsed.${d.id}`))),
  requires:any(eq(`lotm.home.${d.id}`),has(`endorsed.${d.id}`)),duration:20,cancellation:'forfeit',
  effects:[money(d.errandPence),know(`errand.${d.id}`,`You finished an errand for ${d.team} and were paid ${d.errandPence} pence. This district pays its own rate; ${d.officerLabel} signed it off.`,'player','player',note,'understood')]}))];
// M4 A4: a source-qualified Sailor faculty now changes an actual docks outcome.
// Alger's account (local Chinese EPUB 0006) supports equipment-free diving for at
// least ten minutes. This single lost manifest, five-minute task and 24-pence fee
// are authored proposals, not canon. The existing ability owns cost and aftermath.
const recoverySupport=all(eq('faculty.book.lotm.sailor.active'),gte('condition.book.lotm.long_breath',1),eq('lotm.officerHere'));
const recovery=cmd('recover_dock_manifest','Recover the submerged harbour manifest · prepare Long breath first (2 stamina, scales linger), 1 duty-officer attention, 5 min, earns 24 pence',L.docks,{
 officer:true,targetId:I.stormOfficer,
 visibleWhen:all(eq('lotm.enrolled'),eq('lotm.district.storm'),has('reportedIn')),
 costs:[attention(-1,I.stormOfficer)],requires:recoverySupport,duration:5,cancellation:'refund',completionRequires:recoverySupport,completionCoLocated:true,completionFailure:'refund',
 effects:[money(24),know('work.submerged_manifest','You recovered the harbour manifest from beneath the quay and the duty officer paid 24 pence. Your Sailor breath made the submerged work possible; preparing it spent stamina and left the scales behind. This particular manifest is back in the office.','player','player','observation','understood')]});
recovery.requires.reason='Need Sailor, breath & duty officer.';
districtCommands.push(recovery);

// M4 A2: ordinary completed work can supply an in-role experience. Reflection
// consumes the latest notebook outcome once, not a timer or a backlog of jobs.
// Acting principles come from the existing pathway rows; this cadence is authored.
export const LOTM_ROLE_OUTCOMES=[
 {key:'sv',source:I.savant,job:'errand_machinery',note:'errand.machinery',place:L.university,
  label:'Reflect on applying your studies to the completed gear schedule',text:'You reviewed the gear schedule you copied and understood how its parts work together. Applying your studies in real office work settles the Savant potion a little.'},
 {key:'sa',source:I.sailor,job:'recover_dock_manifest',note:'work.submerged_manifest',place:L.docks,
  label:'Reflect on the completed underwater manifest recovery',text:'You recalled moving beneath the quay and returning with the manifest. Using your Sailor faculties for actual underwater work settles the potion a little.'}];
const reflected=r=>`role.reflected.${r.key}`;
export const roleOutcomeCommands=LOTM_ROLE_OUTCOMES.map(r=>{
 const c=cmd(`reflect_work_${r.key}`,r.label+' · one in-role act',r.place,{alone:true,once:false,
  visibleWhen:all(eq('lotm.enrolled'),eq(`lotm.${r.key}Supported`),gte(`lotm.roleOutcome.${r.key}.completed`,1)),
  requires:eq(`lotm.roleOutcome.${r.key}.ready`),effects:[{type:'resource',actor:'player',key:`book.lotm.${r.key}.acting`,amount:1},know(reflected(r),r.text,'player','player','observation','understood')]});
 c.requires.reason='Need fresh work & an unsettled potion.';return c;
});
districtCommands.push(...roleOutcomeCommands);
export function roleOutcomeFacts(state,f){
 const a=state.actors?.player||{},known=state.simulation?.knowledge?.player||{};
 for(const r of LOTM_ROLE_OUTCOMES){
  const done=a.completed?.[`book.lotm.${r.job}`]||0,note=known[`book.lotm.${r.note}`],used=known[`book.lotm.${reflected(r)}`],src=a.sources?.[r.source];
  f[`lotm.roleOutcome.${r.key}.completed`]=done;
  f[`lotm.roleOutcome.${r.key}.ready`]=done>0&&!!note&&!!src&&note.at>src.acquiredAt&&(!used||used.at<note.at)&&f[`lotm.${r.key}Supported`]===true&&f[`lotm.${r.key}.digested`]===false&&a.facts?.[`book.lotm.${r.key}.promoted`]!==true;
 }
}
export function roleOutcomeAssertions(state,{assert,natural}){
 const a=state.actors?.player||{};
 for(const r of LOTM_ROLE_OUTCOMES){const n=a.completed?.[`book.lotm.reflect_work_${r.key}`]||0;
  assert(natural(n)&&n<=(a.completed?.[`book.lotm.${r.job}`]||0)&&n<=(a.resources?.[`book.lotm.${r.key}.acting`]||0),'A reflected role outcome needs completed work and its actual acting credit.');}
}
