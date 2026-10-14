/** PI9 scoped, synthetic lexical admission. This is not semantic certification. */
import {admitPlain, digest, QA_LIMITS} from './invention_qa.js';
const hazards=['weapon','explosive','poison','drug','ambiguous-dual-use'];
const normalize=s=>s.normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'').toLowerCase();
const generic=/\b(reagent|precursor|concentration|ratio|purify|distill|synthesize|assemble|inject|detonate)\b/;
export function lintInventionContent(input,policy) {
    const findings=[], scannedSurfaces=[], unscannedSurfaces=[], contexts=new Map(), nodes=new Map();
    const revision=policy?.revision??'unspecified';
    const add=(ruleId,nodeId,surfaceId,contextId,severity='review')=>findings.push({ruleId,nodeId,surfaceId,contextId,severity,disposition:severity==='reject'?'reject':'review'});
    try {admitPlain(input);admitPlain(policy);}catch {return {status:'reject',policyRevision:revision,findings:[{ruleId:'Z4.SCHEMA',severity:'reject',disposition:'reject'}],scannedSurfaces,unscannedSurfaces};}
    if(!Array.isArray(input.nodes)||!Array.isArray(input.sidecar)||!Array.isArray(input.surfaces)||!Array.isArray(input.requiredSurfaces)||
        !Array.isArray(policy.reviewedTextDigests)||!Array.isArray(policy.restrictedTokens)||!Array.isArray(policy.exceptions)||
        policy.restrictedTokens.some(t=>typeof t!=='string')||policy.reviewedTextDigests.some(t=>typeof t!=='string')||
        new Set(input.sidecar.map(s=>s.nodeId)).size!==input.sidecar.length) {
        add('Z4.SCHEMA','input','schema','input','reject');return {status:'reject',policyRevision:revision,findings,scannedSurfaces,unscannedSurfaces};
    }
    for(const n of input.nodes??[]) {if(!n?.id||nodes.has(n.id))add('Z4.SCHEMA',n?.id??'input','schema','catalog','reject');else nodes.set(n.id,n);}
    const metadata=new Map((input.sidecar??[]).map(s=>[s.nodeId,s]));
    for(const [id,n] of nodes){const m=metadata.get(id);contexts.set(id,new Set());
        if(!m||!Array.isArray(m.hazardKinds)||!Array.isArray(m.textFields)||!Array.isArray(m.contextRefs)||!['ordinary','abstract-fiction'].includes(m.abstraction)||m.hazardKinds.some(h=>!hazards.includes(h))) {add('Z4.SCHEMA',id,'sidecar','catalog','reject');continue;}
        for(const h of m.hazardKinds)contexts.get(id).add(h);
        const cue=normalize(`${n.id} ${n.label??''} ${n.target?.function??''} ${(n.tags??[]).join(' ')}`);
        if(/weapon|explosive|poison|drug|release energy|\bharm\b/.test(cue)&&!m.hazardKinds.length)add('Z4.CONTEXT',id,'catalog','unannotated');
    }
    const queue=[...contexts].flatMap(([id,set])=>[...set].map(h=>[id,h]));let operations=0;
    // Dependency edges supplied from the original catalogs, including pruned ORs.
    for(let i=0;i<queue.length;i++) {const [id,h]=queue[i];if(++operations>QA_LIMITS.operations){add('Z4.BUDGET',id,'closure',h,'reject');break;}
        const n=nodes.get(id); const cs=n?.kind==='goal'?n.alternatives??[]:n?.requires??[];
        for(const c of cs) {if(!contexts.has(c)){add('Z4.SCHEMA',id,'reference',h,'reject');continue;}
            if(!contexts.get(c).has(h)){contexts.get(c).add(h);queue.push([c,h]);}}
    }
    const surfaces=[];
    function strings(value,path,nodeId){if(typeof value==='string')surfaces.push({id:`${nodeId}:${path}`,nodeId,text:value,path});
        else if(value&&typeof value==='object')for(const [k,v]of Object.entries(value))strings(v,`${path}.${k}`,nodeId);}
    for(const [id,n]of nodes)strings(n,'catalog',id);
    for(const s of input.surfaces??[]) {if(typeof s.id!=='string'||typeof s.text!=='string'||!nodes.has(s.nodeId))add('Z4.SCHEMA',s.nodeId??'input',s.id??'surface','render','reject');else surfaces.push(s);}
    const ids=new Set(surfaces.map(s=>s.id));
    for(const id of input.requiredSurfaces??[])if(!ids.has(id)){unscannedSurfaces.push(id);add('Z4.SURFACE','input',id,'coverage');}
    let textBytes=0;
    for(const s of surfaces){textBytes+=new TextEncoder().encode(s.text).length;if(textBytes>QA_LIMITS.rendered){add('Z4.BUDGET',s.nodeId,s.id,'render','reject');break;}
        scannedSurfaces.push(s.id);const m=metadata.get(s.nodeId), ctxs=[...(contexts.get(s.nodeId)??[])];if(!ctxs.length)ctxs.push('ordinary');
        const text=normalize(s.text), contentDigest=digest(s.text);
        for(const contextId of ctxs){const restricted=contextId!=='ordinary';
            const token=(policy.restrictedTokens??[]).find(t=>text.includes(normalize(t)));
            if(token) add('Z4.MATERIAL',s.nodeId,s.id,contextId,'reject');
            if(text.includes('synth_real_process')||text.includes('synth_step_'))add('Z4.PROCEDURE',s.nodeId,s.id,contextId,'reject');
            if(restricted&&(text.includes('synth_physical_quantity')||/\b\d+(?:\.\d+)?\s*(?:mg|g|kg|ml|liters?|celsius)\b/.test(text)||/\b\d+\s*:\s*\d+\b/.test(text)))add('Z4.QUANTITY',s.nodeId,s.id,contextId,'reject');
            if(restricted&&m?.abstraction!=='abstract-fiction')add('Z4.ABSTRACTION',s.nodeId,s.id,contextId,'reject');
            const rules=[];if(generic.test(text)&&restricted)rules.push('Z4.CUE');
            if(!policy.reviewedTextDigests.includes(contentDigest))rules.push('Z4.UNKNOWN_TEXT');
            for(const ruleId of rules){const exact=(policy.exceptions??[]).some(e=>e.ruleRevision===revision&&e.ruleId===ruleId&&e.contentDigest===contentDigest&&e.nodeId===s.nodeId&&e.surfaceId===s.id&&e.contextId===contextId&&e.spanDigest===digest(text)&&typeof e.reason==='string'&&e.reason&&e.reviewer&&e.date);
                if(!exact)add(ruleId,s.nodeId,s.id,contextId);}
        }
    }
    // Joined surfaces close synthetic token fragments split across a composition.
    const joined = new Map();
    for(const s of input.surfaces??[])for(const contextId of contexts.get(s.nodeId)??[]){
        const text=(joined.get(contextId)??'')+normalize(s.text);joined.set(contextId,text);
    }
    for(const [contextId,text]of joined){
        if((policy.restrictedTokens??[]).some(t=>text.includes(normalize(t))))add('Z4.COMPOSE','candidate','joined',contextId,'reject');
        if(text.includes('synth_real_process')||text.includes('synth_step_'))add('Z4.COMPOSE','candidate','joined',contextId,'reject');
    }
    // Closed hazard schema; fictional credit values cannot whitelist other fields.
    for(const [id,n]of nodes)if(contexts.get(id)?.size){
        const keys=new Set(['id','label','kind','scale','target','alternatives','operator','produces','requires','tags','when','available','missingReason','description','capacityType','costs']);
        if(Object.keys(n).some(k=>!keys.has(k)))add('Z4.ABSTRACT_SCHEMA',id,'catalog','closure','reject');
        if(n.capacityType!==undefined&&!policy.capacityTypes?.includes(n.capacityType))add('Z4.CAPACITY',id,'catalog','closure');
        if(n.costs!==undefined&&(!Array.isArray(n.costs)||n.costs.some(c=>Object.keys(c).sort().join(',')!=='kind,value'||!['game-credit','fictional-capacity'].includes(c.kind)||!Number.isFinite(c.value)||c.value<0)))add('Z4.COST',id,'costs','closure','reject');
    }
    if(input.language!=='en'||policy.language!=='en')add('Z4.LANGUAGE','input','language','coverage');
    if(!policy.revision||policy.edition!=='synthetic-v1')add('Z4.POLICY','input','policy','coverage');
    return {status:findings.some(f=>f.severity==='reject')?'reject':findings.length?'review':'pass',policyRevision:revision,findings,scannedSurfaces,unscannedSurfaces,
        coverage:{edition:policy.edition,language:input.language,operations,textBytes,semanticReview:'open',realVocabulary:'not-covered'}};
}
