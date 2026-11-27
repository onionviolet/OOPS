const natural = value => Number.isSafeInteger(value) && value >= 0;

export const emptyGrowthPoints = () => ({revision:1,earned:{},allocated:{}});

export function readGrowthPoints(rule,saved=emptyGrowthPoints()) {
    if (!saved || saved.revision !== 1 || !saved.earned || !saved.allocated) throw Error('Invalid growth point revision.');
    for (const [pool,count] of Object.entries(saved.earned)) {
        if (!rule.awards.some(award => award.pool === pool) || !natural(count)) throw Error('Invalid growth point pool.');
    }
    for (const [id,count] of Object.entries(saved.allocated)) {
        const option=rule.options.find(option => option.id === id);
        if (!option || !natural(count) || count > (option.cap ?? Infinity)) throw Error('Invalid growth point allocation.');
    }
    for (const {pool} of rule.awards) if (growthPointBalance(rule,saved,pool)<0) throw Error('Growth point allocation exceeds earnings.');
    return structuredClone(saved);
}

export function growthPointBalance(rule,state,pool) {
    return (state.earned[pool] ?? 0) - rule.options.reduce((total,option) =>
        total + (option.pool === pool ? state.allocated[option.id] ?? 0 : 0),0);
}

export function settlePointCrossing(rule,state,{track,before,after}) {
    if (!natural(before) || !natural(after) || after<=before) return;
    const next=structuredClone(state);
    for (const award of rule.awards) {
        if (award.track !== track) continue;
        const count=(Math.floor(after/(award.every ?? 1))-Math.floor(before/(award.every ?? 1)))*award.amount;
        if (count) next.earned[award.pool]=(next.earned[award.pool] ?? 0)+count;
    }
    return Object.keys(next.earned).some(pool=>next.earned[pool]!==state.earned[pool]) ? next : undefined;
}

export function quoteGrowthPoints(rule,state,id,count=1) {
    const option=rule.options.find(option=>option.id===id);
    if (!option || !natural(count) || count===0) return {reason:'Choose a valid allocation.'};
    const next=structuredClone(state);
    const used=state.allocated[id] ?? 0;
    if (count>growthPointBalance(rule,state,option.pool)) return {reason:'Bank more points before allocating.'};
    if (used+count>(option.cap ?? Infinity)) return {reason:'This allocation is full.'};
    next.allocated[id]=used+count;
    const pair=option.pair && next.allocated[option.pair];
    const warning=option.pair && Math.abs(next.allocated[id]-(pair ?? 0))>(rule.safeSpread ?? 0) ? rule.warning : undefined;
    return {next,option,warning};
}

export function quotePointRespec(rule,state,context) {
    if (!rule.respec || !context[rule.respec.at] || !Object.values(state.allocated).some(Boolean)) {
        return {reason:rule.respec?.reason ?? 'This rule has no respec.'};
    }
    return {next:{...state,allocated:{}}};
}

export function growthPointModifiers(rule,state) {
    const stats={};
    for (const {id,stat,gain,upkeep} of rule.options) {
        const count=state.allocated[id] ?? 0;
        if (!count) continue;
        stats[stat]=(stats[stat] ?? 0)+gain*count;
        if (upkeep) stats[upkeep.stat]=(stats[upkeep.stat] ?? 0)-upkeep.amount*count;
    }
    return stats;
}

export function settlePointRecovery(stats,missingHealth,staminaRecovery) {
    const capacity=stats.sleepHealth ?? 0;
    const health=Math.min(capacity,Math.max(0,missingHealth));
    const scale=capacity ? health/capacity : 0;
    return {health,upkeep:Math.min(Math.max(0,staminaRecovery),-(stats.sleepStamina ?? 0)*scale)};
}
