// Explicit session intent, not a reservation or an automatic worker. Native craft
// remains the sole spender/RNG owner. Loading any save clears this display intent.
import {registerDomain} from './domain_registry.js';
export function createCraftBatchGoal() {
    let goal=null;
    return {
        read:()=>goal&&structuredClone(goal),
        clear:()=>{goal=null;},
        start(key,target){if(typeof key!=='string'||!key||!Number.isSafeInteger(target)||target<1)throw Error('Invalid craft goal.');goal={key,target,attempted:0,successful:0,made:0};return this.read();},
        settle(key,{attempted,successful,made}){if(!goal||goal.key!==key)throw Error('Craft goal changed.');if(!Number.isSafeInteger(attempted)||attempted<0||attempted>goal.target-goal.attempted||!Number.isSafeInteger(successful)||successful<0||successful>attempted||!Number.isSafeInteger(made)||made<0)throw Error('Invalid craft receipt.');goal.attempted+=attempted;goal.successful+=successful;goal.made+=made;return this.read();}
    };
}
export const craftBatchGoal=createCraftBatchGoal();
registerDomain({id:'crafting-intent',initialState:()=>null,load:()=>craftBatchGoal.clear()});
