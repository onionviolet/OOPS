import {meets} from './simulation_contracts.js';
// Read-only proposal. Only already-visible actions get public category hints;
// never print predicate IDs, counters, hidden alternatives or outcomes.
export function structuredReachabilityHints(definition, command, facts) {
    const hints=[];
    const ability=definition.abilities?.find(a=>a.commandId===command.id);
    if(ability && !meets(ability.control,facts)) {
        const leaves=r=>r?.all?r.all.flatMap(leaves):[r];
        const numeric=leaves(ability.control).filter(r=>r?.op==='gte' && Number.isFinite(facts[r.fact]) && !meets(r,facts));
        hints.push(numeric.length?numeric.map(r=>`Practice control: ${facts[r.fact]} / ${r.value} required.`).join(' '):'Practice the held method’s control before using it.');
    }
    for(const site of definition.expeditions||[]) {
        if(command.id===site.prepareId && facts['actor.'+site.injuryKey]>0)
            hints.push('Treat the current expedition injury before preparing another attempt.');
    }
    for(const cost of command.costs||[]) {
        if(cost.actor!=null&&!['player','$actor'].includes(cost.actor))continue;
        if(cost.type!=='item'||!Number.isFinite(cost.amount)||cost.amount>=0)continue;
        let item;try{item=definition.items?.find(i=>i.id===JSON.parse(cost.key).id);}catch{continue;}
        const held=facts['item.'+cost.key]||0;
        if(item && held < -cost.amount)hints.push(`Carried stock: ${held} / ${-cost.amount} × ${item.label} required. Retrieve or acquire the quoted input first.`);
    }
    return hints;
}
