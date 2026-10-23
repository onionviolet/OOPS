// Craft failure ledger (IM22) as a registered domain. It owns the namespaced `craftLedger` save slice and the
// adapter between the live Village crafting path and src/craft_failure_ledger.js. Absent slice = nothing failed yet.
import {registerDomain} from './domain_registry.js';
import {createFailureLedger,recordBatchAttempt,forecastFromLedger,validateFailureLedger} from './craft_failure_ledger.js';
import {catalogue,materialFromKey,craftingOwner} from './crafting_frontier_runtime.js';
import {knowsAxis} from './craft_state.js';
let ledger=createFailureLedger();
export const ledgerOwner=()=>ledger;
export function setLedgerOwner(value){ledger=value??createFailureLedger();}
// Called from the crafting commit with the resolved batch; a batch with outputs is ignored by the ledger.
export function noteBatch(result){ledger=recordBatchAttempt(ledger,result);}
export const ledgerStamp=()=>Object.values(ledger.pairs).reduce((n,e)=>n+e.count,0);
// request: the crafting request {inputs:[{key,qty}], process:[{op,level}]}. Reads the ledger only; hidden or
// unobserved axes never appear in the residue, and reaction ids are reduced to "reacted" (AR8, MR truth vs knowledge).
export function forecastCraft(request,owner=craftingOwner){
 const mats=(request.inputs??[]).map(i=>materialFromKey(i.key,owner)?.material).filter(Boolean);
 if(!mats.length)return {verdict:'untried',tries:0,reasons:[],residue:{}};
 const f=forecastFromLedger(ledger,{materials:mats.map(m=>m.id),process:(request.process??[]).map(p=>[p.op,p.level])});
 const known=axis=>!catalogue.axes[axis]?.hidden&&mats.some(m=>knowsAxis(owner??{knowledge:{}},'player')(m.id,axis));
 return {...f,reasons:[...new Set(f.reasons.map(r=>r.startsWith('reaction:')?'reacted':r))],residue:Object.fromEntries(Object.entries(f.residue).filter(([axis])=>known(axis)))};
}
registerDomain({id:'craftLedger',deps:['crafting'],initialState:()=>null,
 save:()=>Object.keys(ledger.pairs).length?structuredClone(ledger):undefined,
 validate:slice=>{if(slice!=null)validateFailureLedger(slice);},
 migrate:slice=>slice==null?createFailureLedger():structuredClone(validateFailureLedger(slice)),
 load:setLedgerOwner,commands:{forecast:forecastCraft}});
