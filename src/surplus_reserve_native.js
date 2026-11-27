import {registerDomain,domainRegistry} from './domain_registry.js';
import {villageReserve as rule,emptyReserve,readReserve,reserveBonus,quoteReserve} from './surplus_reserve.js';

let ports, state=emptyReserve();
export function configureReserve(context) { ports=context; }
export function sleepReserveBonus() {
    const life=ports?.context();
    return life?.world===rule.world && life.id===state.life ? reserveBonus(rule,state.paid) : 0;
}
function projection(name) {
    if (name!=='growth' || !ports || ports.context().world!==rule.world) return;
    const quote=()=>quoteReserve(rule,state,ports.context().id,ports.context().money);
    const terms=quote();
    return {name:'Recovery reserve', id:'recovery-reserve', summary:'Fund your recovery for the rest of this life.',actions:[{
        label:'Fund recovery reserve', fact:`Spend ${terms.cost} coins. Extra health per sleep minute rises from ${terms.current.toFixed(3)} to ${terms.after.toFixed(3)}. Keep ${rule.keep} coins on hand.`,
        reason:terms.reason || (!ports.writable()?'Saving is unavailable.':undefined),
        run:()=>{
            if (!ports.writable() || ports.context().world!==rule.world) throw Error('The reserve is unavailable.');
            const offer=quote();
            if (offer.reason) throw Error(offer.reason);
            ports.commit(offer);
            state=offer.next;
            ports.report(`Spent ${offer.cost} coins on recovery. The reserve now adds up to ${offer.after.toFixed(3)} health per sleep minute.`);
            domainRegistry.refresh();
        }}]};
}
registerDomain({id:'surplus_reserve', initialState:emptyReserve, validate:readReserve,
    load:saved=>{state=readReserve(saved);}, save:()=>state.paid?{...state}:undefined, projection});
