// Presentation only (re-fit K2, 2026-10-22). One owned ingredient stock quoted for
// two real products side by side. Counts come from the actual hold owners: the
// mixing vessel's held batch and the native disposition owner (borrowed or bound keys). Each card
// carries its own native admission token; committing one makes the other stale.
import {quoteMixtureAction,blockedIngredients} from './mixture_native.js';
import {mixturePresentation} from './mixture_state.js';
import {mixtureFailureText} from './mixture_feedback.js';
const key=id=>JSON.stringify({id});
const carried=(inventory,id)=>inventory?.[key(id)]?.count??inventory?.[key(id)]??0;
export const MIXTURE_DESTINATIONS=['steep','boil'];
export function projectMixtureDestinations({frame,owner,request}) {
    const blocked=blockedIngredients(frame.expansion),held=owner?.job?.held??{};
    const destinations=MIXTURE_DESTINATIONS.map(process=>{
        try{
            const q=quoteMixtureAction({...frame,owner,request:{...request,process}}),p=q.product,view=mixturePresentation(owner,p);
            return {process,token:q.token,product:p.id,name:view.name,description:view.description,inputs:structuredClone(p.inputs),error:null};
        }catch(error){return {process,token:null,product:null,name:process==='steep'?'Steeped Village mixture':'Boiled Village mixture',description:'',inputs:null,error:mixtureFailureText(error.message)};}
    });
    const ids=[...new Set(destinations.flatMap(d=>Object.keys(d.inputs??{})))];
    const stock=ids.map(id=>{const inHand=carried(frame.inventory,id),b=blocked[id]?inHand:0,h=held[id]??0;
        return {id,carried:inHand,held:h,blocked:b,free:inHand-b};});
    for(const d of destinations){
        if(!d.inputs)continue;
        d.uses=Object.entries(d.inputs).map(([id,need])=>{const free=stock.find(r=>r.id===id).free;return {id,need,free,after:free-need,short:Math.max(0,need-free)};});
        d.vials=Math.min(...d.uses.map(u=>Math.floor(u.free/u.need)));
        if(!d.error&&d.uses.some(u=>u.short)){const id=d.uses.find(u=>u.short).id;d.error=blocked[id]?`${id} is borrowed or committed elsewhere. Return or release it first.`:`Not enough ${id} free after holds.`;}
    }
    const text=stock.length?`One stock, two products: ${stock.map(r=>`${r.id} ${r.carried} carried · ${r.held} held in vessel · ${r.blocked} blocked by other holds · ${r.free} free`).join('; ')}. Quotes reserve nothing; mixing one makes the other quote stale.`:
        'Choose a valid selection to compare products.';
    return {stock,destinations,text};
}
