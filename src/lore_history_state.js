// D8-A / P14 S1's optional typed outcome owner. Feed and biography remain views.
export const HISTORY_LIMIT=96;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const nat=v=>Number.isSafeInteger(v)&&v>=0;
const ref=v=>typeof v==='string'&&v.length>0&&v.length<=240;
const check=(ok)=>{if(!ok)throw Error('Invalid retained story outcome.');};
export function queryStoryOutcomes(state,filter={}) {
    return (state.loreHistory?.receipts||[]).filter(r=>Object.entries(filter).every(([key,value])=>r[key]===value)).map(r=>structuredClone(r));
}
export function historyPins(state,extra=[]) {
    const pins=new Set(extra);
    for(const r of state.loreHistory?.receipts||[])for(const id of r.historyCauses)pins.add(id);
    for(const e of Object.values(state.simulation?.events||{}))if(e.status==='open'&&e.historyRef)pins.add(e.historyRef);
    // Request settlement evidence is required for future callback predicates.
    for(const r of state.loreHistory?.receipts||[])if(r.action.startsWith('request.'))pins.add(r.id);
    return pins;
}
export function validateLoreHistory(state) {
    const h=state?.loreHistory;if(h==null)return;
    check(object(h)&&h.schema===1&&nat(h.nextId)&&h.nextId>0&&nat(h.enrolledAt)&&h.enrolledAt<=state.clock&&Array.isArray(h.receipts)&&h.receipts.length<=HISTORY_LIMIT&&nat(h.evicted));
    const ids=new Set(),ops=new Set();let last=0;
    for(const r of h.receipts) {
        check(object(r)&&ref(r.id)&&nat(r.ordinal)&&r.ordinal>last&&r.ordinal<h.nextId&&!ids.has(r.id)&&ref(r.operation)&&!ops.has(r.operation));
        check(r.worldId==='base.frontier'&&ref(r.actor)&&ref(r.issuer)&&[r.targetPerson,r.targetObject].every(v=>v===null||ref(v))&&r.targetPlace==='Village');
        check(['storylet.response','storylet.ambient','storylet.expired','request.deliver','request.decline','aftermath.response'].includes(r.action)&&ref(r.result)&&nat(r.at)&&r.at<=state.clock);
        check(ref(r.producer)&&r.revision===1&&Array.isArray(r.causeRefs)&&r.causeRefs.length>0&&r.causeRefs.length<=8&&r.causeRefs.every(ref)&&Array.isArray(r.historyCauses)&&r.historyCauses.length<=8&&r.historyCauses.every(id=>ids.has(id)));
        check(Array.isArray(r.audience)&&r.audience.length<=4&&r.audience.every(ref)&&object(r.known)&&Object.values(r.known).every(v=>typeof v==='string'&&v.length<=240));
        check(Array.isArray(r.applied)&&r.applied.length<=64&&r.applied.every(d=>object(d)&&ref(d.owner)&&ref(d.key)&&['item','coin','skill'].includes(d.kind)&&Number.isFinite(d.delta)&&d.delta!==0));
        ids.add(r.id);ops.add(r.operation);last=r.ordinal;
    }
    for(const e of Object.values(state.simulation?.events||{}))if(e.historyRef)check(ids.has(e.historyRef));
    return h;
}
export function appendStoryOutcome(state,record) {
    validateLoreHistory(state);
    const h=state.loreHistory ||= {schema:1,enrolledAt:state.clock,nextId:1,evicted:0,receipts:[]};
    const duplicate=h.receipts.find(r=>r.operation===record.operation);if(duplicate)return duplicate;
    if(h.receipts.length>=HISTORY_LIMIT) {
        const pins=historyPins(state,record.historyCauses||[]),index=h.receipts.findIndex(r=>!pins.has(r.id));
        if(index<0)throw Error('Story history is full of referenced outcomes. Finish current stories before admitting another.');
        h.receipts.splice(index,1);h.evicted++;
    }
    const ordinal=h.nextId++,r={...structuredClone(record),id:`story.outcome:${ordinal}`,ordinal,revision:1};h.receipts.push(r);validateLoreHistory(state);return r;
}
// Observe actual resolved native snapshot deltas, never infer them from prose.
export function appliedStoryDeltas(before,after) {
    const rows=[],put=(kind,owner,key,a=0,b=0)=>{if(b!==a)rows.push({kind,owner,key,delta:b-a});};
    put('coin','player','wood',before.external?.money,after.external?.money);
    for(const owner of new Set([...Object.keys(before.gameplay||{}),...Object.keys(after.gameplay||{})])) {
        const a=before.gameplay?.[owner]||{},b=after.gameplay?.[owner]||{};
        for(const key of new Set([...Object.keys(a.inventory||{}),...Object.keys(b.inventory||{})]))put('item',owner,key,a.inventory?.[key],b.inventory?.[key]);
        for(const key of new Set([...Object.keys(a.skills||{}),...Object.keys(b.skills||{})]))put('skill',owner,key,a.skills?.[key]?.xp,b.skills?.[key]?.xp);
    }
    return rows;
}
export function recordStoryletOutcome(out,event,{result,action,cause,before}) {
    if(!event.storylet)return;
    const applied=appliedStoryDeltas(before,out),item=applied.find(d=>d.kind==='item');
    appendStoryOutcome(out.state,{operation:`${event.id}:${action}`,worldId:'base.frontier',actor:event.actorId,issuer:event.targetId||event.definitionId,
        targetPerson:event.targetId,targetObject:item?.key||null,targetPlace:'Village',action: event.historyRef&&action==='storylet.response'?'aftermath.response':action,result,at:out.state.clock,
        producer:'P3',causeRefs:[event.id,cause],historyCauses:event.historyRef?[event.historyRef]:[],audience:[...event.discoveredBy],
        known:{label:event.label},applied});
}
