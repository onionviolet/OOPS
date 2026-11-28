const natural=value=>Number.isSafeInteger(value)&&value>=0;

export function emptyAbilityLoadout(rule){
    return {revision:1,slots:structuredClone(rule.defaults),levels:{...rule.levels},pending:null,readyAt:0};
}

function validateSlots(rule,group,slots){
    const capacity=rule.groups[group]?.capacity;
    if(!Array.isArray(slots)||capacity===undefined||slots.length>capacity||new Set(slots).size!==slots.length||
        slots.some(id=>!rule.abilities.some(ability=>ability.id===id&&ability.groups.includes(group))))throw Error('Invalid ability slots.');
}

export function readAbilityLoadout(rule,saved=emptyAbilityLoadout(rule)){
    if(!saved||saved.revision!==1||!saved.slots||!saved.levels||!natural(saved.readyAt)||
        Object.keys(rule.defaults).some(group=>!Object.hasOwn(saved.slots,group)))throw Error('Invalid ability loadout revision.');
    for(const [group,slots] of Object.entries(saved.slots))validateSlots(rule,group,slots);
    for(const [id,level] of Object.entries(saved.levels)){
        if(!rule.abilities.some(ability=>ability.id===id)||!natural(level))throw Error('Invalid saved ability level.');
    }
    if(saved.pending!==null){
        const change=saved.pending;
        if(!change||!natural(change.ready)||change.ready>saved.readyAt)throw Error('Invalid pending ability swap.');
        validateSlots(rule,change.group,change.slots);
        if(change.removed && !abilitySlots(rule,{...saved,pending:null},change.group,0).includes(change.removed)){
            throw Error('Invalid removed ability.');
        }
    }
    return structuredClone(saved);
}

export function settleAbilityLoadout(rule,state,clock){
    if(!state.pending||clock<state.pending.ready)return state;
    const {group,slots,removed}=state.pending;
    const relearnAt=rule.groups[group].relearnAt;
    const levels=removed&&relearnAt!==undefined?{...state.levels,[removed]:relearnAt}:state.levels;
    return {...state,slots:{...state.slots,[group]:slots},levels,pending:null};
}

export function abilitySlots(rule,state,group,clock){
    const {slots}=settleAbilityLoadout(rule,state,clock);
    return slots[group]??slots[rule.groups[group]?.inherits]??[];
}

export function quoteAbilitySwap(rule,state,{group,id,replace,clock,donors=[],balance=0,learned}){
    const ability=rule.abilities.find(row=>row.id===id&&row.groups.includes(group));
    if(!ability||!natural(clock))return {reason:'Choose a valid ability slot.'};
    const live=settleAbilityLoadout(rule,state,clock),slots=abilitySlots(rule,live,group,clock);
    if(ability.donor&&!donors.includes(ability.donor))return {reason:'This ability needs its connected donor.'};
    if(learned&&!learned.includes(id))return {reason:'Learn this ability before slotting it.'};
    if(slots.includes(id))return {reason:'Already slotted.'};
    if(live.pending)return {reason:'The current swap is still in progress.',wait:live.pending.ready-clock};
    if(clock<live.readyAt)return {reason:'The swap is cooling down.',wait:live.readyAt-clock};
    if(replace&&!slots.includes(replace))return {reason:'That ability is no longer in this slot.'};
    if(slots.length>=rule.groups[group].capacity&&!replace)return {reason:'Choose an ability to replace.'};
    const cost=rule.groups[group].cost??{};
    if(balance<(cost.amount??0))return {reason:'Insufficient resources for this swap.'};
    const updated=replace?slots.map(slot=>slot===replace?id:slot):[...slots,id];
    const ready=clock+(cost.minutes??0);
    const pending={group,slots:updated,ready,removed:replace??null};
    const next={...live,readyAt:ready+(cost.cooldown??0),pending};
    return {next:settleAbilityLoadout(rule,next,clock),cost,removed:replace,ability,
        relearnAt:replace?rule.groups[group].relearnAt:undefined};
}

export function loadoutRecovery(rule,state,group,clock,stat,missing){
    const options=abilitySlots(rule,state,group,clock).map(id=>rule.abilities.find(row=>row.id===id));
    let left=Math.max(0,missing);
    const effects=[];
    for(const option of options){
        const amount=Math.min(left,option.effects?.[stat]??0);
        if(amount>0)effects.push({name:option.name,amount});
        left-=amount;
    }
    return effects;
}
