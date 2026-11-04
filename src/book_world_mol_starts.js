import {MOL_IDS as I,MOL_LOCATIONS as L} from './book_world_mol_ids.js';
// Cyoria starts (G1/G3/G15 of the Zorian stage record, proposal under AD32). One world, one shared command
// registry, two starts. The commands stay start-neutral; what differs per start is named here:
//  - the fact supplier that derives mol.nativeBound, mol.playerSupported and mol.local.<world> (WA51),
//  - the study-access term (the visitor's guest permit; the student's enrolment),
//  - which residents are met and which visitor-premise commands are shown.
// Saved shape: motherOfLearning.entryProfile is the only stored start marker (AD45 note in docs/SAVES.md).
export const MOL_START_VISITOR='independent_nonmage_visitor';
export const MOL_START_ZORIAN='book.mol.zorian@1';
export const MOL_BEGIN_ZORIAN='book.mol.begin_zorian';
// The seat is the native `player` actor (the host's body, purse, inventory and passage owners all key on it;
// the LOTM be-seat does the same). The resolver below is the single place a different seat id would enter.
export const ZORIAN_SEAT_ACTOR='player';
// Placeholder (G4 owns the real family house, school and classes): the seat starts in the household place
// the pack already has, so no new native location owner or save envelope entry is introduced here.
export const MOL_ZORIAN_PLACES=Object.freeze({home:L.house});
export const MOL_ZORIAN_STUDENT='book.mol.studentStatus';
// G5: the cast count the text states (8 magic missiles, en b1 c2 p171). Policy row lives in the pack's energies.
export const MOL_ZORIAN_RESERVE='book.mol.zorian.reserve';
// Visitor premises that make no sense for a native student: arrival, passage, guest pass and room, the sponsor's return.
export const ZORIAN_HIDDEN_COMMANDS=Object.freeze(['book.mol.chart','book.mol.arrival','book.mol.guest_room','book.mol.guest_pass','book.mol.return_visit_life','book.mol.enroll','book.mol.enter','book.mol.return']);
export const molStartOf=state=>state?.motherOfLearning?.entryProfile??null;
export const isZorianStart=state=>molStartOf(state)===MOL_START_ZORIAN;
// Fields of a command row that name an actor. Everything else, including ids that merely contain "player", is untouched.
const ACTOR_KEYS=new Set(['actorId','actor','from','to','holder','owner','observerId','recipientId','attributedTo','targetId']);
export function resolveSeatActor(value,seat=ZORIAN_SEAT_ACTOR,key=null){
 if(Array.isArray(value))return value.map(v=>resolveSeatActor(v,seat,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,resolveSeatActor(v,seat,k)]));
 return value==='player'&&ACTOR_KEYS.has(key)?seat:value;
}
// Named suppliers. `a` is the start-independent evidence molFacts already computes.
const visitorSupplier=a=>{
 const here=a.visit?.endpoint.worldId===I.world&&a.state.actors?.player?.worldId===I.world&&Object.values(L).includes(a.person?.location);
 const supported=a.bound&&a.sameBody&&a.nativeAlive&&a.usable&&here;
 return {nativeBound:a.bound,playerSupported:supported,local:supported&&a.state.actors?.[a.actorId]?.worldId===I.world,extra:{}};
};
const zorianSupplier=a=>{
 const here=a.state.actors?.player?.worldId===I.world&&Object.values(L).includes(a.person?.location)&&!a.visit;
 const supported=a.bound&&a.sameBody&&a.nativeAlive&&a.usable&&here;
 const student=a.state.actors?.player?.facts?.[MOL_ZORIAN_STUDENT]==='enrolled';
 // The guest-permit term the shared rows read is answered by student status here; it is never stored as a permit.
 return {nativeBound:a.bound,playerSupported:supported,local:supported&&a.state.actors?.[a.actorId]?.worldId===I.world,
  extra:{'mol.zorianSeat':supported,'mol.studyAccess':student,'actor.book.mol.guestPermit':student}};
};
export const MOL_START_SUPPLIERS=Object.freeze({[MOL_START_VISITOR]:visitorSupplier,[MOL_START_ZORIAN]:zorianSupplier});
export const molSupplier=state=>MOL_START_SUPPLIERS[molStartOf(state)]||visitorSupplier;
// Study access for host gates: the permit for the visitor, enrolment for the student.
export const molStudyAccess=state=>isZorianStart(state)?state.actors?.player?.facts?.[MOL_ZORIAN_STUDENT]==='enrolled':!!state.actors?.player?.facts?.['book.mol.guestPermit'];
// A resident the start does not include (G15): the seat is Zorian, so the book's Zorian is not met as a person.
export const startExcludes=(state,personId)=>isZorianStart(state)&&personId===I.zorian;
