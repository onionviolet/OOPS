// Ordered situations project native command receipts, without a second progress store.
export function placeActSequences(data) {
    const arcs=data?.sequences || (data?.sequence?[data.sequence]:[]);
    const ids=new Set(), rows=new Map((data?.acts||[]).map(r=>[r.id,r]));
    for(const arc of arcs){
        if(!arc.id||!arc.title||!Array.isArray(arc.stages)||!arc.stages.length)throw Error('Invalid place act sequence.');
        for(const s of arc.stages){if(ids.has(s.commandId)||!rows.has(s.commandId)||!s.label)throw Error('Invalid sequence stage.');ids.add(s.commandId);}
    }
    return arcs.map(a=>({...a,stages:a.stages.map(s=>({...s,place:rows.get(s.commandId).place,knowledgeKey:rows.get(s.commandId).knowledgeKey}))}));
}
export const placeActStages=data=>placeActSequences(data).flatMap(a=>a.stages);
export function sequencePrerequisites(data,commandId){
    const stages=placeActStages(data),index=stages.findIndex(s=>s.commandId===commandId);
    return index<0?[]:stages.slice(0,index).map(s=>({any:[
        {fact:`completed.${s.commandId}`,op:'eq',value:true,reason:`First: ${s.label}.`},
        {fact:`knowledge.${s.knowledgeKey}.seen`,op:'eq',value:true,reason:`First: ${s.label}.`}]}));
}
export function placeActSequenceView(state,data,actorId='player'){
    const arcs=placeActSequences(data);if(!arcs.length)return null;
    const known=state.simulation?.knowledge?.[actorId]||{},ledger=state.actors?.[actorId]?.completed||{};
    const done=s=>!!ledger[s.commandId]||!!known[s.knowledgeKey];
    const arc=arcs.find(a=>a.stages.some(s=>!done(s)))||arcs.at(-1),current=arc.stages.find(s=>!done(s)),completed=arc.stages.filter(done);
    return {id:arc.id,title:arc.title,completed:completed.length,total:arc.stages.length,done:!current,
        next:current?{id:current.commandId,label:current.label,place:current.place,readyAt:Number.isSafeInteger(current.readyOffset)&&state.lotm?state.lotm.initializedAt+current.readyOffset:null}:null,
        aftermath:completed.length?known[completed.at(-1).knowledgeKey]?.value??null:null,conclusion:current?null:arc.conclusion};
}
export function sequenceOffers(state,data,commands,actorId='player'){
    const stages=placeActStages(data);if(!stages.length)return commands;
    const known=state.simulation?.knowledge?.[actorId]||{},ledger=state.actors?.[actorId]?.completed||{},pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
    const next=stages.find(s=>!ledger[s.commandId]&&!known[s.knowledgeKey]);
    return commands.filter(c=>pending.has(c.id)||c.id===next?.commandId);
}
