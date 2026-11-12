// The world host supplies current local means and stages their debit alongside
// inventory. Settlement owns no separate save, clocks, mana, or custody.
import {bookCraftWorkshops,quoteBookCraftWorking} from './book_craft_workings.js';
import {createCraftState,learnCraftWorking,recordWorkingTrial} from './craft_state.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';

function prepareTrial(working,lots,native) {
    const context=native.read();
    const {world,clock}=context;
    const result=quoteBookCraftWorking(working,context,lots);
    const {consumed,retained}=result;
    const means=native.quoteMeans({world,working:result.working,consumed,retained});
    if(!means?.eligible)throw Error(means?.reason||'The local support is unavailable.');
    return {quote:{world,clock,working:result.working,lots:structuredClone(lots),consumed,retained,means},
        product:result.batch.product};
}

export function quoteBookCraftTrial(working,lots,native) {
    return prepareTrial(working,lots,native).quote;
}

export function settleBookCraftTrial(quoted,native,{learn=false}={}) {
    const {quote:current,product}=prepareTrial(quoted.working,quoted.lots,native);
    if(JSON.stringify(current)!==JSON.stringify(quoted))throw Error('The working changed. Review it again.');
    const {world,clock,working,consumed,retained,means}=current;
    const {law,result}=bookCraftWorkshops[world];
    const success=(product.outputs[result.route]?.[result.effect]??0)>0;
    for(const row of consumed)native.assertSpend(row.key);
    const transaction=beginNativeCraftTransaction({owners:native.itemOwners(),bindings:[
        ...native.meansBindings(),{get:native.getCraftState,set:native.setCraftState}
    ]});
    try {
        native.spendMeans(means);
        for(const {key,qty} of consumed)native.removeItem(key,qty);
        const effects=success?[{route:result.route,effect:result.effect}]:[];
        if(success)native.publishResult({world,key:result.key,product,retained});
        let state=recordWorkingTrial(native.getCraftState()??createCraftState({world:'base.frontier'}),product,
            {observer:'player',at:clock,effects});
        if(success&&learn)state=learnCraftWorking(state,law,working,{observer:'player',product:product.id,...effects[0]});
        native.setCraftState(state);
        native.persist(()=>transaction.markDurable());
        return {success,product:product.id,learned:success&&learn};
    } catch(error) {
        if(transaction.status==='pending')transaction.rollback();
        throw error;
    }
}
