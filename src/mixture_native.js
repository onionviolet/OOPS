import {RESPONSIVE_METHOD,villageRuleRoot,createVillageRuleOwner,quoteResponsiveMixture,freezeVillageLaw} from './mixture_rules.js';
import {address,hash64} from './gen_kit.js';
import {assertNativeItemDisposition} from './native_gameplay_adapter.js';
import {setSavedPurse} from './money.js';
import {stageProductAppearanceAcquisition} from './product_appearance_state.js';
import {createMixtureState,validateMixtureState,resolveMixture,mixtureKey,productFromKey,mixtureExposure,INGREDIENTS,MIXTURE_ID} from './mixture_state.js';
const ingredientKey=id=>JSON.stringify({id});
const count=(inv,key)=>inv[key]?.count??inv[key]??0;
function change(inv,key,n){const next=count(inv,key)+n;if(!Number.isSafeInteger(next)||next<0)throw new Error('Ingredient shortage.');if(next)inv[key]={count:next};else delete inv[key];}
// K2 hold reader: the native disposition owner decides per item key (borrowed custody,
// bound specimens and any later rule). A refused key is blocked whole, as in crafting detail.
export function blockedIngredients(expansion){const out={};if(!expansion)return out;for(const {id}of INGREDIENTS){try{assertNativeItemDisposition(expansion,ingredientKey(id));}catch{out[id]=true;}}return out;}
export function quoteMixtureAction({owner,seed,inventory={},money=0,request,expansion}){
    const state=owner??createMixtureState(seed),base=resolveMixture(state,request.inputs,request.process);
    if(request.method!=null&&request.method!==RESPONSIVE_METHOD&&request.method!=='ordinary@1')throw Error('Unsupported mixing method.');
    const quote=request.method===RESPONSIVE_METHOD?quoteResponsiveMixture(base,{owner:state.ruleLaws,root:villageRuleRoot(expansion,seed)}):{product:base};
    return {...quote,token:hash64('mixture.admission@1',address(quote.product.id,state.sequence,String(money),Object.keys(base.inputs).map(id=>[id,count(inventory,ingredientKey(id)),!!blockedIngredients(expansion)[id]])))};
}
export function stageMixtureAction({owner,seed,inventory,money,clock,request,expansion}){
    const state=structuredClone(owner??createMixtureState(seed)),stock=Object.fromEntries(Object.entries(inventory).map(([k,v])=>[k,{count:count(inventory,k)}]));
    validateMixtureState(state);
    if(!Number.isSafeInteger(clock)||clock<0||!Number.isFinite(money)||money<0)throw new Error('Invalid native mixture context.');
    const plan={state,inventory:stock,money,effect:null,message:''};
    let acquired=null;
    const quote=request=>quoteMixtureAction({owner:state,seed,inventory:stock,money:plan.money,request,expansion});
    const retain=(q)=>{if(!q.law)return;state.ruleLaws??=createVillageRuleOwner(villageRuleRoot(expansion,seed));freezeVillageLaw(state.ruleLaws,q.law,{clock,sequence:state.sequence+1,product:q.product});};
    const repeatCurrent=p=>{if(p.revision===1)return;const q=quote({inputs:p.inputs,process:p.process,method:RESPONSIVE_METHOD});if(q.product.id!==p.id)throw Error('Law revision changed. Mix and observe the current method before repeating.');};
    const blocked=blockedIngredients(expansion);
    const reserve=product=>{for(const id of Object.keys(product.inputs))if(blocked[id])throw new Error(`Held elsewhere: ${id}.`);for(const [id,n]of Object.entries(product.inputs))if(count(stock,ingredientKey(id))<n)throw new Error(`Shortage: ${id}.`);for(const [id,n]of Object.entries(product.inputs))change(stock,ingredientKey(id),-n);};
    if(request.type==='buy'){
        const i=INGREDIENTS.find(i=>i.id===request.id),n=request.count??1;if(!i||!Number.isSafeInteger(n)||n<1||n>99)throw new Error('Invalid counter purchase.');
        if(plan.money<i.price*n)throw new Error('Not enough coins.');plan.money-=i.price*n;change(stock,ingredientKey(i.id),n);plan.message=`Bought ${n} ${i.id}.`;
    }else if(request.type==='mix'){
        const q=quote(request),p=q.product;if(request.quote&&JSON.stringify(request.quote)!==JSON.stringify(q.token))throw Error('Mix quote changed. Review the current quote.');reserve(p);state.products[p.id]=p;retain(q);acquired=p;change(stock,mixtureKey(p),1);plan.message='Mixture owned. Drink a dose to observe its properties.';
        state.lastCompletion={kind:'mix',outcome:'single',product:p.id,consumed:structuredClone(p.inputs),at:clock,sequence:state.sequence+1};
    }else if(request.type==='use'){
        const p=productFromKey(state,request.key);change(stock,request.key,-1);plan.effect=mixtureExposure(p,clock);
        state.knowledge[p.id]={observed:true,at:clock,source:'oral experiment'};state.lastObservation=p.id;
        plan.message='Experiment recorded: the dose and side effect are now known. You can save this method.';
    }else if(request.type==='learn'){
        const p=state.products[request.product];if(!p||!state.knowledge[p.id]?.observed)throw new Error('Observe a dose before saving a method.');
        state.methods[p.id]={revision:p.revision,inputs:structuredClone(p.inputs),process:p.process};plan.message='Observed method saved.';
    }else if(request.type==='repeat'){
        if(state.job)throw new Error('One mixing vessel is already occupied.');const p=state.products[request.product];
        if(!p||!state.methods[p.id]||!Number.isSafeInteger(request.count)||request.count<1||request.count>999)throw new Error('Choose a learned method and 1–999 batches.');
        repeatCurrent(p);reserve(p);state.job={product:p.id,held:structuredClone(p.inputs),due:clock+3,remaining:request.count};plan.message='Inputs reserved. Each batch takes 3 game minutes.';
    }else if(request.type==='cancel'){
        if(!state.job)throw new Error('No reserved batch.');for(const [id,n]of Object.entries(state.job.held))change(stock,ingredientKey(id),n);state.job=null;plan.message='Cancelled; exact held inputs returned.';
    }else if(request.type==='advance'){
        if(!state.job||state.job.due>clock)return null;
        // Completion is exactly once. Later admission uses current stock, never substitutes.
        const j=state.job,p=state.products[j.product];change(stock,mixtureKey(p),1);acquired=p;
        if(p.revision===2)retain({product:p,law:state.ruleLaws.laws[p.lawLock.modules.find(m=>m.kind==='generated_law').revision-1].law});state.job=null;plan.message='Timed batch completed.';
        // The receipt records the completed batch's own held inputs, never the next reservation.
        const receipt={kind:'batch',outcome:j.remaining>1?'next reserved':'queue finished',product:p.id,consumed:structuredClone(j.held),at:clock,sequence:state.sequence+1};
        if(j.remaining>1){try{repeatCurrent(p);reserve(p);state.job={product:p.id,held:structuredClone(p.inputs),due:clock+3,remaining:j.remaining-1};}catch(error){plan.message=`Timed batch completed. Repeat stopped: ${error.message}`;receipt.outcome='repeat stopped';receipt.stopReason=error.message;}}
        state.lastCompletion=receipt;
    }else throw new Error('Unsupported mixture action.');
    state.sequence++;validateMixtureState(state);
    if(acquired)stageProductAppearanceAcquisition(plan,expansion,owner,acquired,clock);
    return plan;
}
// No live stock, knowledge, or exposure is published before one durable write.
export function commitMixturePlan(plan,{createSave,validateEnvelope,write,publish}){
    if(!plan)return false;
    const text=createSave();if(typeof text!=='string')throw new Error('Could not create mixture save.');const envelope=JSON.parse(text);
    if(plan.expansion)envelope.expansion=plan.expansion;
    envelope.mixtures=plan.state;envelope.inventories.person.main_character=plan.inventory;setSavedPurse(envelope,plan.money,'mixture');
    if(plan.effect){envelope.active_effects??={};envelope.active_effects['Village mixture exposure']=plan.effect;}
    validateEnvelope(envelope);write(JSON.stringify(envelope));publish(plan);return true;
}
