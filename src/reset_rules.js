// null means the reading does not say. No unknown inventory or witness is
// implicitly carried, erased, or granted another character's memories.
export function quoteReset(row,{trigger,endedBy,holder}){
    const end=endedBy!=null&&row.ends?.includes(endedBy)===true;
    // A final trigger can still clear temporary gains. A separate exit ends future resets.
    if(!row.triggers.includes(trigger))return end?{offered:false,ended:true}:{offered:false};
    return {offered:true,ended:end,span:row.span,resets:[...row.resets],keeps:[...row.keeps],
        remembers:row.remembers==null?null:row.remembers.includes(holder),ends:row.ends};
}
export function resolveResetFields(quote,{current,anchor}){
    if(!quote.offered)return {};
    const fields={};
    for(const key of quote.resets)if(Object.hasOwn(anchor,key))fields[key]=structuredClone(anchor[key]);
    for(const key of quote.keeps)if(Object.hasOwn(current,key))fields[key]=structuredClone(current[key]);
    return fields;
}
