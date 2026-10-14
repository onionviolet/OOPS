import {createMixtureState,validateMixtureState,resolveMixture,mixtureKey,productFromKey,mixtureExposure,INGREDIENTS,MIXTURE_ID} from './mixture_state.js';
const ingredientKey=id=>JSON.stringify({id});
const count=(inv,key)=>inv[key]?.count??inv[key]??0;
function change(inv,key,n){const next=count(inv,key)+n;if(!Number.isSafeInteger(next)||next<0)throw new Error('Ingredient shortage.');if(next)inv[key]={count:next};else delete inv[key];}
export function stageMixtureAction({owner,seed,inventory,money,clock,request}){
    const state=structuredClone(owner??createMixtureState(seed)),stock=Object.fromEntries(Object.entries(inventory).map(([k,v])=>[k,{count:count(inventory,k)}]));
    validateMixtureState(state);
    if(!Number.isSafeInteger(clock)||clock<0||!Number.isFinite(money)||money<0)throw new Error('Invalid native mixture context.');
    const plan={state,inventory:stock,money,effect:null,message:''};
    const reserve=product=>{for(const [id,n]of Object.entries(product.inputs))if(count(stock,ingredientKey(id))<n)throw new Error(`Shortage: ${id}.`);for(const [id,n]of Object.entries(product.inputs))change(stock,ingredientKey(id),-n);};
    if(request.type==='buy'){
        const i=INGREDIENTS.find(i=>i.id===request.id),n=request.count??1;if(!i||!Number.isSafeInteger(n)||n<1||n>99)throw new Error('Invalid counter purchase.');
        if(plan.money<i.price*n)throw new Error('Not enough coins.');plan.money-=i.price*n;change(stock,ingredientKey(i.id),n);plan.message=`Bought ${n} ${i.id}.`;
    }else if(request.type==='mix'){
        const p=resolveMixture(state,request.inputs,request.process);reserve(p);state.products[p.id]=p;change(stock,mixtureKey(p),1);plan.message='Mixture owned. Drink a dose to observe its properties.';
    }else if(request.type==='use'){
        const p=productFromKey(state,request.key);change(stock,request.key,-1);plan.effect=mixtureExposure(p,clock);
        state.knowledge[p.id]={observed:true,at:clock,source:'oral experiment'};state.lastObservation=p.id;
        plan.message='Experiment recorded: the dose and side effect are now known. You can save this method.';
    }else if(request.type==='learn'){
        const p=state.products[request.product];if(!p||!state.knowledge[p.id]?.observed)throw new Error('Observe a dose before saving a method.');
        state.methods[p.id]={revision:1,inputs:structuredClone(p.inputs),process:p.process};plan.message='Observed method saved.';
    }else if(request.type==='repeat'){
        if(state.job)throw new Error('One mixing vessel is already occupied.');const p=state.products[request.product];
        if(!p||!state.methods[p.id]||!Number.isSafeInteger(request.count)||request.count<1||request.count>999)throw new Error('Choose a learned method and 1–999 batches.');
        reserve(p);state.job={product:p.id,held:structuredClone(p.inputs),due:clock+3,remaining:request.count};plan.message='Inputs reserved. Each batch takes 3 game minutes.';
    }else if(request.type==='cancel'){
        if(!state.job)throw new Error('No reserved batch.');for(const [id,n]of Object.entries(state.job.held))change(stock,ingredientKey(id),n);state.job=null;plan.message='Cancelled; exact held inputs returned.';
    }else if(request.type==='advance'){
        if(!state.job||state.job.due>clock)return null;
        // Completion is exactly once. Later admission uses current stock, never substitutes.
        const j=state.job,p=state.products[j.product];change(stock,mixtureKey(p),1);state.job=null;plan.message='Timed batch completed.';
        if(j.remaining>1){try{reserve(p);state.job={product:p.id,held:structuredClone(p.inputs),due:clock+3,remaining:j.remaining-1};}catch(error){plan.message=`Timed batch completed. Repeat stopped: ${error.message}`;}}
    }else throw new Error('Unsupported mixture action.');
    state.sequence++;validateMixtureState(state);return plan;
}
// No live stock, knowledge, or exposure is published before one durable write.
export function commitMixturePlan(plan,{createSave,validateEnvelope,write,publish}){
    if(!plan)return false;
    const text=createSave();if(typeof text!=='string')throw new Error('Could not create mixture save.');const envelope=JSON.parse(text);
    envelope.mixtures=plan.state;envelope.inventories.person.main_character=plan.inventory;envelope.character.money=plan.money;
    if(plan.effect){envelope.active_effects??={};envelope.active_effects['Village mixture exposure']=plan.effect;}
    validateEnvelope(envelope);write(JSON.stringify(envelope));publish(plan);return true;
}
