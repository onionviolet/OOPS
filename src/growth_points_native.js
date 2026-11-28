import {domainRegistry,registerDomain} from './domain_registry.js';
import {VILLAGE_GROWTH_POINTS as rule} from './data/growth_points.js';
import {emptyGrowthPoints,growthPointBalance,growthPointModifiers,quoteGrowthPoints,quotePointRespec,
    readGrowthPoints,settlePointCrossing,settlePointRecovery} from './growth_points.js';

let state=emptyGrowthPoints(),ports;
const active=()=>ports?.context().world===rule.world;
export function configureGrowthPoints(config){ports=config;}

export function observePointLevel(track,before,after){
    if(!active()||!ports.writable())return;
    const next=settlePointCrossing(rule,state,{track,before,after});
    if(!next)return;
    const count=next.earned.recovery-(state.earned.recovery ?? 0);
    state=next;
    ports.report(`Sleeping earned ${count} recovery ${count===1?'point':'points'}. Bank or allocate in Growth.`,true);
    domainRegistry.refresh();
}

export function villagePointRecovery(missingHealth,staminaRecovery){
    return active()?settlePointRecovery(growthPointModifiers(rule,state),missingHealth,staminaRecovery):{health:0,upkeep:0};
}

function section(){
    if(!active()||!state.earned.recovery)return;
    const balance=growthPointBalance(rule,state,'recovery');
    const option=rule.options[0],count=state.allocated[option.id] ?? 0;
    const context=ports.context();
    const allocation=()=>quoteGrowthPoints(rule,state,option.id);
    const respec=()=>quotePointRespec(rule,state,ports.context());
    const commit=(quote,line)=>{
        if(!ports.writable())throw Error('Restore saving before changing your allocation.');
        const result=quote();
        if(result.reason)throw Error(result.reason);
        ports.persist(result.next);
        state=result.next;
        ports.report(line,true);
        domainRegistry.refresh();
    };
    return {id:'growth-points',name:'Recovery points',waiting:balance>0&&!allocation().reason,
        summary:`${balance} banked · ${count} allocated to ${option.name} · ${count*option.gain} extra health and up to ${count*option.upkeep.amount} less stamina recovered per sleep minute.`,
        actions:[
            {label:'Allocate to Deep rest',fact:`Costs 1 recovery point. Adds up to ${option.gain} health per sleep minute and reduces stamina recovery by up to ${option.upkeep.amount} for as long as it is allocated. Both scale with actual extra healing.`,
                reason:allocation().reason,run:()=>commit(allocation,'Allocated 1 recovery point to Deep rest.')},
            {label:'Reset at a bed',fact:'Returns every allocated recovery point to your bank.',reason:quotePointRespec(rule,state,context).reason,
                run:()=>commit(respec,'Returned allocated recovery points to the bank.')},
        ].map(action=>({...action,reason:action.reason || (!ports.writable()?'Saving is unavailable.':undefined)}))};
}

registerDomain({id:'growth_points',initialState:emptyGrowthPoints,
    validate:saved=>readGrowthPoints(rule,saved),load:saved=>{state=readGrowthPoints(rule,saved);},
    save:()=>Object.keys(state.earned).length?structuredClone(state):undefined,
    projection:name=>name==='growth'?section():undefined});
