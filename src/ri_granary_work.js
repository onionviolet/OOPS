// Authored village work. Native jobs/items/essence own costs; saved observations
// and the existing clock own progress. The catalogue owns the hearing mechanism.
import {tryGuStep} from './gu_working_host.js';
export const RI_GRANARY='book.ri.lead.granary_work';
export const RI_EAR_GRASS='book.ri.lead.ear_grass.earth_ear_grass';
export const RI_EAR_ATTACHMENT='book.ri.lead.ear_grass.ear';
export const RI_GRANARY_FOUND=`${RI_GRANARY}.found`;
export const RI_GRANARY_PATCHED=`${RI_GRANARY}.patched`;
export const RI_GRANARY_PAID=`${RI_GRANARY}.paid`;
export const RI_GRANARY_DIALS=Object.freeze({listen:5,search:45,patch:20,petals:20,returnAfter:1440});
// A funded listening attempt, not a second resource ledger. Completion support
// checks the held/attached Gu; the native energy policy pays this returned cost.
export function riGranaryWorking(){
 return tryGuStep('earth-communication-ear-grass','activate',{at:0,
  specimen:{id:RI_EAR_GRASS,kind:'earth-communication-ear-grass',rank:2},
  facts:{reserves:{player:{primeval:1}}}});
}
const hearing=riGranaryWorking();
if(hearing.outcome!=='complete'||!hearing.effects.some(e=>e.kind==='ground-hearing'&&e.range>=8))throw Error('The nearby feed-store task needs grounded hearing.');
export const RI_GRANARY_ESSENCE=hearing.cost;
export function riGranaryFacts(state){
 if(state?.actors?.player?.worldId!=='book.ri.lead.world')return {};
 const notes=state.simulation?.knowledge?.player||{};
 const at=id=>Number.isSafeInteger(notes[id]?.at)?notes[id].at:-1;
 const found=at(RI_GRANARY_FOUND),patched=at(RI_GRANARY_PATCHED),paid=at(RI_GRANARY_PAID);
 const open=found<=patched&&patched<=paid&&(paid<0||state.clock-paid>=RI_GRANARY_DIALS.returnAfter);
 return {[`${RI_GRANARY}.open`]:open,[`${RI_GRANARY}.found`]:found>patched,
  [`${RI_GRANARY}.unpaid`]:patched>paid};
}
