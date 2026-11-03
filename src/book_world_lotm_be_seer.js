// BE-seat Seer chain (AD48 brief B1): the lead life drinks the potion, steadies against the whispers
// and holds a spirituality pool. It sits beside the Tingen Seer ingest with its own source, energy and
// flag ids, so the Tingen invariants in book_world_lotm_state.js (one pathway per life, source pinned to
// the supervised ingest, one pool per source) are untouched and an older Tingen save holds none of it.
// Content slices grant it through place-act effects (the BE view lists no lotmCommands): drink, then
// steady, then cogitate/use. Pure data and one assertion function; no state, no clock, no save.
import {LOTM_IDS as I,LOTM_ENERGY} from './book_world_lotm_ids.js';
import {BE_PROFILE_ID} from './seat_profiles.js';
export const BE_SEER_SOURCE='book.lotm.be_seer',BE_SEER_ENERGY_ID='book.lotm.be_spirituality';
// Proposal (WPR5): the Tingen pool's shape, carried by its own id.
export const BE_SEER_ENERGY=Object.freeze({...LOTM_ENERGY,id:BE_SEER_ENERGY_ID});
export const BE_SEER_FLAGS=Object.freeze(['be.seer.ingested','be.seer.stabilized']);
const fact=(key,value=true)=>({type:'fact',scope:'actor',actor:'player',key:`book.lotm.${key}`,value});
// The potion is taken: source and pool arrive together (the pool exists exactly when the source does).
export const beSeerDrinkEffects=()=>[
 {type:'source',actor:'player',sourceId:BE_SEER_SOURCE,operation:'grant',origin:'acquired',awakened:true,active:true},
 {type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'learn',policy:BE_SEER_ENERGY},
 {type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'recover',amount:BE_SEER_ENERGY.capacity,cooling:0},
 fact('be.seer.ingested')];
// Holding one familiar object calms the whispers; only after the drink.
export const beSeerSteadyEffects=()=>[fact('be.seer.stabilized')];
export const beSeerCogitateEffects=(amount=BE_SEER_ENERGY.capacity)=>[{type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'recover',amount,cooling:BE_SEER_ENERGY.strainLimit}];
export const beSeerUse=()=>({type:'energy',energyId:BE_SEER_ENERGY_ID,operation:'use',output:BE_SEER_ENERGY.output,control:BE_SEER_ENERGY.control});
export const beSeerSources=[{id:BE_SEER_SOURCE,revision:1,label:'Seer source (the lead\'s own drink)',kind:'trait',origin:'acquired',grants:[],bioDetail:'One drunk Seer potion in the book life. Source ownership is separate from steadiness and from any method; none follows from it alone.'}];
export const beSeerFacts=(state,f,{enrolled,flag})=>{
 const src=state.actors?.player?.sources?.[BE_SEER_SOURCE],fac=state.simulation?.faculties?.player?.[BE_SEER_SOURCE];
 f['lotm.beSeer.supported']=enrolled&&!!src&&(src.expiresAt==null||src.expiresAt>state.clock)&&fac?.awakened===true&&fac.active===true&&!fac.suppressed;
 f['lotm.beSeer.pool']=state.simulation?.energies?.player?.[BE_SEER_ENERGY_ID]?.reserve??0;
};
export function beSeerAssertions(state,{a,has,assert}){
 const src=a.player.sources?.[BE_SEER_SOURCE],e=state.simulation?.energies?.player?.[BE_SEER_ENERGY_ID],ing=has('be.seer.ingested'),stab=has('be.seer.stabilized');
 const held=!!src||!!e||ing||stab;
 assert(!held||state.lotm.entryProfile===BE_PROFILE_ID,'The book life\'s Seer chain belongs to the book life.');
 assert(!!src===ing,'The book life\'s Seer source and its recorded drink go together.');
 assert(!stab||ing,'Steadying against the whispers needs the drink first.');
 assert(!!e===!!src,'The book life\'s spirituality pool exists exactly when its source does.');
 assert(!src||!a.player.sources?.[I.source],'The book life holds its own Seer source, not the Tingen one.');
}
