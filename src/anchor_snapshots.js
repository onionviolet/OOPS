import {fnv1a} from './hash_rng.js';
function equal(a,b) {
    if(Object.is(a,b))return true;
    if(!a || !b || typeof a!=='object' || typeof b!=='object' || Array.isArray(a)!==Array.isArray(b))return false;
    const keys=Object.keys(a);
    return keys.length===Object.keys(b).length && keys.every(k=>Object.hasOwn(b,k) && equal(a[k],b[k]));
}
function time(world,at) {
    const n=typeof at==='number' ? at : world.anchors?.find(a=>a.id===at)?.at;
    if(!Number.isFinite(n))throw new Error(`Unknown anchor or invalid time: ${at}.`);
    return n;
}
function source(world) {return JSON.stringify([world.id,world.revision,world.base,world.events,world.anchors]);}
function changesFor(branch,seed) {
    if(!branch)return [];
    const changes=[...(branch.changes || [])];
    if(Object.hasOwn(branch,'divergeAt')) {
        if(!Number.isFinite(branch.divergeAt))throw new Error('Invalid branch divergence time.');
        changes.unshift({at:branch.divergeAt,set:branch.overrides || {}});
    }
    for(const change of changes) {
        if(!Number.isFinite(change.at))throw new Error('Invalid branch change time.');
        if(change.insert) {
            let insertedAt;
            try {insertedAt=eventTime(change.insert,seed,change.at);}
            catch {throw new Error('Inserted event has an invalid time or window.');}
            if(insertedAt<change.at)throw new Error('Inserted event must occur at or after its change.');
        }
    }
    return changes;
}
function failedRequirement(snapshot,event) {
    return (event.requires || []).find(r=>{
        const holder=Object.hasOwn(r,'knows') ? snapshot.knowledge?.[r.knows] : snapshot.facts;
        return !holder || !Object.hasOwn(holder,r.fact) ||
            (Object.hasOwn(r,'eq') && !equal(Object.hasOwn(r,'knows') ? holder[r.fact].value : holder[r.fact],r.eq));
    });
}
// Explicit at wins over descriptive window metadata in older authored graphs.
function eventTime(event,seed,fallback) {
    if(Number.isFinite(event.at))return event.at;
    if(event.at!==undefined)throw new Error(`Invalid event time: ${event.id}.`);
    if(event.window) {
        const {from,to}=event.window;
        if(!Number.isFinite(from) || !Number.isFinite(to) || from>to)throw new Error(`Invalid event window: ${event.id}.`);
        const hash=fnv1a(2166136261,JSON.stringify([seed,event.id]));
        if(Number.isInteger(from) && Number.isInteger(to))return from+hash%(to-from+1);
        return from+(to-from)*(hash/4294967296);
    }
    if(Number.isFinite(fallback))return fallback;
    throw new Error(`Missing event time: ${event.id}.`);
}
function applyEffects(result,effects,provenance) {
    const facts=result.snapshot.facts;
    for(const effect of effects || []) {
        for(const [key,value] of Object.entries(effect.set || {})) {
            facts[key]=structuredClone(value);result.provenance[key]=structuredClone(provenance);
        }
        for(const [key,n] of Object.entries(effect.add || {})) {
            facts[key]=(facts[key] ?? 0)+n;result.provenance[key]=structuredClone(provenance);
        }
        if(effect.tell) {
            const {to,facts:learned,channel}=effect.tell;
            result.snapshot.knowledge ??= {};
            result.snapshot.knowledge[to] ??= {};
            for(const [key,value] of Object.entries(learned || {}))
                result.snapshot.knowledge[to][key]={value:structuredClone(value),channel:structuredClone(channel),at:provenance.at};
        }
        if(Object.hasOwn(effect,'unset')) {
            delete facts[effect.unset];result.provenance[effect.unset]=structuredClone(provenance);
        }
    }
}
function advance(world,result,at,from=-Infinity) {
    let timeline=world.events.map(event=>({at:eventTime(event,result.seed),order:0,event}));
    for(const change of changesFor(result.branch,result.seed)) {
        timeline.push({at:change.at,order:1,change});
        if(change.insert)timeline.push({at:eventTime(change.insert,result.seed,change.at),order:2,event:change.insert,origin:change});
    }
    // Stable ties preserve authored event/change order. Canon precedes changes,
    // then inserted events run, so same-time changes can affect their requirements.
    timeline.sort((a,b)=>a.at-b.at || a.order-b.order);
    for(const item of timeline)if(item.event)result.resolvedAt[item.event.id]=item.at;
    for(let index=0;index<timeline.length;index++) {
        const item=timeline[index];
        if(item.at<=from || item.at>at)continue;
        if(item.change) {
            const change=item.change;
            if(change.reset) {
                const anchorAt=time(world,change.reset.to);
                if(!world.anchors?.some(a=>a.id===change.reset.to))throw new Error('Reset requires an anchor id.');
                const canon=deriveSnapshot(world,change.reset.to,{seed:result.seed});
                const retained={};
                for(const actor of change.reset.keepKnowledge || [])if(result.snapshot.knowledge?.[actor])
                    retained[actor]=structuredClone(result.snapshot.knowledge[actor]);
                result.snapshot=canon.snapshot;
                if(Object.keys(retained).length)result.snapshot.knowledge={...(result.snapshot.knowledge || {}),...retained};
                result.provenance=canon.provenance;
                result.cancelled=[];
                result.localOffset=change.at-anchorAt;
                // Discard pending scoped insertions and the old iteration's loop schedule.
                const pending=timeline.slice(index+1).filter(i=>!i.event?.loop && !(i.origin && i.origin.at<=change.at));
                for(const event of world.events.filter(e=>e.loop)) {
                    const local=eventTime(event,result.seed);
                    if(local<=anchorAt)continue;
                    const replayAt=change.at+local-anchorAt;
                    pending.push({at:replayAt,order:0,event,replayOffset:change.at-anchorAt});
                    result.resolvedAt[event.id]=replayAt;
                }
                pending.sort((a,b)=>a.at-b.at || a.order-b.order);
                timeline=timeline.slice(0,index+1).concat(pending);
            }
            applyEffects(result,[{set:change.set,tell:change.tell}],{by:'change',at:change.at,...(change.cause===undefined ? {} : {cause:change.cause})});
            if(change.cancel!==undefined && !result.cancelled.includes(change.cancel))result.cancelled.push(change.cancel);
            continue;
        }
        const event=item.event;
        if(result.cancelled.includes(event.id)) {
            result.skipped.push({id:event.id,reason:'Event cancelled by branch change.'});continue;
        }
        const failed=failedRequirement(result.snapshot,event);
        let selected=event;
        if(failed) {
            const reason=`Unmet requirement: ${failed.fact}.`;
            if(event.fixed)result.resisted.push({id:event.id,reason});
            else {
                selected=(event.alternatives || []).find(alt=>!failedRequirement(result.snapshot,alt));
                if(!selected) {result.skipped.push({id:event.id,reason});continue;}
                result.substituted.push({id:event.id,alt:selected.id});
            }
        }
        const provenance=item.origin
            ? {by:'change',id:selected.id,at:item.at,...(item.origin.cause===undefined ? {} : {cause:item.origin.cause})}
            : {by:'event',id:selected.id,at:item.at};
        applyEffects(result,selected.effects,provenance);
        result.applied.push(event.id);
        result.revealTimes.push({id:event.id,at:selected.reveal_at ?? event.reveal_at ?? item.at});
        // Authored reveal coordinates on replay templates use the same local axis.
        if((selected.reveal_at ?? event.reveal_at)!=null && item.replayOffset)
            result.revealTimes.at(-1).at+=item.replayOffset;
        if(selected.evidence)result.evidence.push({id:selected.id,label:structuredClone(selected.evidence.label),locator:structuredClone(selected.evidence.locator)});
    }
    result.revealed=[...new Set(result.revealTimes.filter(r=>r.at<=at).map(r=>r.id))];
    result.localAt=at-result.localOffset;
    result.at=at;return result;
}
export function deriveSnapshot(world,at,{branch,seed=world.id}={}) {
    at=time(world,at);
    changesFor(branch,seed);
    const facts=structuredClone(world.base?.facts || {});
    // Keep legacy empty snapshots identical; the knowledge ledger appears on base knowledge or first tell.
    const snapshot={facts};
    if(world.base?.knowledge)snapshot.knowledge=structuredClone(world.base.knowledge);
    return advance(world,{snapshot,seed:structuredClone(seed),resolvedAt:{},revealTimes:[],revealed:[],
        localOffset:0,localAt:at,applied:[],skipped:[],evidence:[],substituted:[],resisted:[],cancelled:[],
        provenance:Object.fromEntries(Object.keys(facts).map(key=>[key,{by:'base'}])),
        worldId:world.id,revision:world.revision,at,branch:branch ? structuredClone(branch) : null,source:source(world)},at);
}
// Includes unset provenance; a fact with no known writer returns undefined.
export function explainFact(result,key) {
    return Object.hasOwn(result.provenance || {},key) ? structuredClone(result.provenance[key]) : undefined;
}
export function deriveIncremental(world,previousResult,at) {
    if(previousResult.worldId!==world.id || previousResult.revision!==world.revision)throw new Error('Snapshot world or revision mismatch.');
    at=time(world,at);
    // Changed author data or a backwards request invalidates the cached prefix.
    // Reset branches rebuild their finite history so discarded schedules cannot leak from a cached prefix.
    if(!previousResult.revealTimes || !previousResult.provenance || previousResult.source!==source(world) || at<previousResult.at || changesFor(previousResult.branch,previousResult.seed).some(c=>c.reset))return deriveSnapshot(world,at,{branch:previousResult.branch,seed:previousResult.seed});
    return advance(world,structuredClone(previousResult),at,previousResult.at);
}
export function diffSnapshots(a,b) {
    const keys=[...new Set([...Object.keys(a.facts),...Object.keys(b.facts)])].sort();
    return keys.filter(k=>Object.hasOwn(a.facts,k)!==Object.hasOwn(b.facts,k) || !equal(a.facts[k],b.facts[k]))
        .map(key=>({key,from:structuredClone(a.facts[key]),to:structuredClone(b.facts[key])}));
}
export function lintWorld(world) {
    const known=new Set(Object.keys(world.base?.facts || {})),writes=[],out=[];
    const knowledge=new Set(Object.entries(world.base?.knowledge || {}).flatMap(([actor,facts])=>Object.keys(facts).map(fact=>JSON.stringify([actor,fact]))));
    for(const event of world.events)for(const effect of event.effects || []) {
        if(effect.tell)for(const fact of Object.keys(effect.tell.facts || {}))knowledge.add(JSON.stringify([effect.tell.to,fact]));
        for(const key of Object.keys(effect.add || {}))known.add(key);
        for(const [key,value] of Object.entries(effect.set || {})) {known.add(key);writes.push({event,key,value,present:true});}
        if(Object.hasOwn(effect,'unset'))writes.push({event,key:effect.unset,present:false});
    }
    for(const event of world.events)if((event.requires || []).some(r=>Object.hasOwn(r,'knows') ? !knowledge.has(JSON.stringify([r.knows,r.fact])) : !known.has(r.fact)))out.push({kind:'never-fires',ids:[event.id]});
    const seen=new Set();
    for(let i=0;i<writes.length;i++)for(const b of writes.slice(i+1)) {
        const a=writes[i];
        if(a.event===b.event || eventTime(a.event,world.id)!==eventTime(b.event,world.id) || a.key!==b.key || (a.present===b.present && equal(a.value,b.value)))continue;
        const ids=[a.event.id,b.event.id],key=JSON.stringify(ids);
        if(!seen.has(key)) {seen.add(key);out.push({kind:'same-time-conflict',ids});}
    }
    return out;
}
