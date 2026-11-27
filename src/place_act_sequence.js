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
// Each stage requires the stage before it. Earlier stages follow by induction: every one of them needed its own
// predecessor before it could finish. Listing every earlier stage on every act grew with the square of the act
// count (1,532 acts made about 1.2 million entries and several hundred megabytes at boot; atlas LAYX228).
// Dial: a state seeded past a stage it never did (a fixture, or a stage inserted by a later pack revision) is held
// to order by sequenceOffers, which offers only the earliest unfinished stage.
const prerequisite=s=>({any:[
    {fact:`completed.${s.commandId}`,op:'eq',value:true,reason:`First: ${s.label}.`},
    {fact:`knowledge.${s.knowledgeKey}.seen`,op:'eq',value:true,reason:`First: ${s.label}.`},
    ...(s.resolvedBy||[]).map(id=>({fact:`completed.${id}`,op:'eq',value:true,reason:`First: ${s.label}.`}))]});
/** One pass over the stages: commandId -> its prerequisite rules. Callers that bind many acts use this, not the per-act form. */
export function sequencePrerequisiteIndex(data){
    const stages=placeActStages(data);
    return new Map(stages.map((s,i)=>[s.commandId,i?[prerequisite(stages[i-1])]:[]]));
}
export function sequencePrerequisites(data,commandId){
    return sequencePrerequisiteIndex(data).get(commandId)||[];
}
export function placeActSequenceView(state,data,actorId='player'){
    const arcs=placeActSequences(data);if(!arcs.length)return null;
    const known=state.simulation?.knowledge?.[actorId]||{},ledger=state.actors?.[actorId]?.completed||{};
    const done=s=>!!ledger[s.commandId]||!!known[s.knowledgeKey];
    const bypassed=s=>!done(s)&&(s.resolvedBy||[]).some(id=>!!ledger[id]);
    const resolved=s=>done(s)||bypassed(s);
    const arc=arcs.find(a=>a.stages.some(s=>!resolved(s)))||arcs.at(-1),current=arc.stages.find(s=>!resolved(s)),completed=arc.stages.filter(done);
    const resultKeys=new Set(completed.map(s=>s.knowledgeKey));
    for(const s of arc.stages)for(const id of s.resolvedBy||[]){
        if(ledger[id]&&data.resolutionKnowledge?.[id])resultKeys.add(data.resolutionKnowledge[id]);
    }
    // Actual receipt times outrank source-stage order. Ties retain knowledge
    // stored key order for observations recorded at the same minute.
    let latest=null;
    for(const [key,record] of Object.entries(known))if(resultKeys.has(key)){
        if(!latest||(record.at??-Infinity)>=(latest.at??-Infinity))latest=record;
    }
    return {id:arc.id,title:arc.title,completed:completed.length,skipped:arc.stages.filter(bypassed).length,total:arc.stages.length,done:!current,
        next:current?{id:current.commandId,label:current.label,place:current.place,readyAt:Number.isSafeInteger(current.readyOffset)&&state.lotm?state.lotm.initializedAt+current.readyOffset:null}:null,
        aftermath:latest?.value??null,aftermathAt:latest?.at??null,conclusion:current?null:arc.conclusion};
}
export function sequenceOffers(state,data,commands,actorId='player'){
    const stages=placeActStages(data);if(!stages.length)return commands;
    const known=state.simulation?.knowledge?.[actorId]||{},ledger=state.actors?.[actorId]?.completed||{},pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
    const next=stages.find(s=>!ledger[s.commandId]&&!known[s.knowledgeKey]&&!(s.resolvedBy||[]).some(id=>!!ledger[id]));
    return commands.filter(c=>pending.has(c.id)||c.id===next?.commandId||c.procedure?.parentId===next?.commandId);
}
