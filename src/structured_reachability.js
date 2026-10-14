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
    return hints;
}
