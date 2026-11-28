import {defineWorkingLaw,quoteWorking,beginQuotedWorking,settleWorking} from './kernel_working.js';

const law=defineWorkingLaw({id:'world.public-duty',revision:1,operations:{
    act:{roles:{},minutes:0,settle:({options})=>({ok:true,costs:options.costs,effects:options.consequences})},
}});
function inputs(row,observations){
    const method={id:row.id,law:law.ref,revision:1,roles:{},steps:[{op:'act',options:{costs:row.actionCosts ?? [],consequences:row.actionConsequences ?? []}}]};
    const authority=()=>{
        if(!observations[row.detection])return {ok:true};
        return {ok:true,costs:row.costs,cause:row.reason,breach:{rule:row.id,enforcer:row.enforcer,detection:row.detection},
            effects:[{kind:row.penalty},...row.consequences]};
    };
    return {method,args:{id:row.id,at:0,bindings:{},ports:{authority}}};
}
export function quoteWorldDuty(row,observations){
    const {method,args}=inputs(row,observations);
    return quoteWorking(law,method,args);
}
export function settleWorldDuty(row,observations,fingerprint){
    const {method,args}=inputs(row,observations);
    const start=beginQuotedWorking(law,method,{...args,fingerprint});
    if(start.stale)throw Error('The terms of the local duty changed. Review them again.');
    const settled=settleWorking(law,start.record,{now:args.at,ports:args.ports});
    return settled.record.receipts[0];
}
