/** Detached v1 receipts. Read-only roadmap meaning; no execution/stock/save owner. */
import {admitPlain,validateGraph,digest,canonicalJSON,QA_LIMITS,runPlanner} from './invention_qa.js';
const reject=reason=>({status:'rejected',reason});
const meaningful=b=>({graph:b.graph,world:b.world,choices:b.choices,consumer:b.consumer});
const presentation=b=>({graph:b.graph,knowledge:b.knowledge});
const key=m=>`${m.plannerId}@${m.plannerRevision}`;
function validate(owner,registry,limits={}) {
    const cap={...QA_LIMITS,...limits};let work=admitPlain(owner,cap).work;
    if(owner.schemaVersion!==1||!Array.isArray(owner.manifests)||!Array.isArray(owner.bundles)||!Array.isArray(owner.projects)||Object.keys(owner).sort().join(',')!=='bundles,manifests,projects,schemaVersion')throw Error('invalid-schema');
    if(owner.projects.length>cap.projects||new TextEncoder().encode(canonicalJSON(owner)).length>cap.bytes)throw Error('budget-exceeded');
    const unique=(list,id)=>{const m=new Map();for(const x of list){if(typeof x[id]!=='string'||!x[id]||m.has(x[id]))throw Error('duplicate-id');m.set(x[id],x);}return m;};
    const manifests=unique(owner.manifests,'manifestId'),bundles=unique(owner.bundles,'bundleId');unique(owner.projects,'projectId');
    for(const m of manifests.values()) {
        const fields=['manifestId','plannerId','plannerRevision','plannerDigest','packId','packRevision','packDigest','worldId','worldInstanceId','lawRevision','lawDigest'];
        if(fields.some(f=>typeof m[f]!=='string'||!m[f]))throw Error('invalid-manifest');
        if(registry && registry[key(m)]!==m.plannerDigest)throw Error('unsupported-revision');
    }
    for(const b of bundles.values()) {
        const m=manifests.get(b.manifestId);if(!m||b.world.id!==m.worldId)throw Error('dangling-reference');
        work+=validateGraph(b.graph,cap).work;
        for(const phase of ['estimate','view']){
            const r=runPlanner({graph:b.graph,world:b.world,knowledge:b.knowledge,choice:b.choices,phase},{...cap,operations:cap.operations-work});
            if(r.status!=='ok')throw Error(r.status);work+=r.counters.total;
        }
        const {bundleId,...retained}=b;if(bundleId!==`bundle.${digest(retained)}`)throw Error('bad-bundle-digest');
        if(b.semanticDigest!==digest(meaningful(b))||b.presentationDigest!==digest(presentation(b)))throw Error('bad-digest');
        if(b.danger?.status!=='pass'||typeof b.danger.policyRevision!=='string')throw Error('danger-review');
        if(b.consumer?.status!=='demo')throw Error('unsupported-product');
        // Every knowledge entry is checked, including currently hidden entries.
        for(const entry of Object.values(b.knowledge)){const f=typeof entry==='number'?entry:entry.fidelity??(entry.wrong?2:0);
            if(!Number.isInteger(f)||f<0||f>5||entry?.label!==undefined&&typeof entry.label!=='string')throw Error('invalid-knowledge');}

    }
    for(const p of owner.projects)if(!bundles.has(p.bundleId)||!manifests.has(p.manifestId)||bundles.get(p.bundleId).manifestId!==p.manifestId||p.status!=='roadmap'||p.recordRevision!==1)throw Error('dangling-reference');
    return owner;
}
export function captureRoadmap(input) {
    try {
        admitPlain(input);const owner=input.owner?structuredClone(input.owner):{schemaVersion:1,manifests:[],bundles:[],projects:[]};
        const manifest=structuredClone(input.manifest), b={manifestId:manifest.manifestId,graph:structuredClone(input.graph),world:structuredClone(input.world),knowledge:structuredClone(input.knowledge??{}),choices:structuredClone(input.choices??{}),consumer:structuredClone(input.consumer??{status:'demo'}),danger:structuredClone(input.danger)};
        b.semanticDigest=digest(meaningful(b));b.presentationDigest=digest(presentation(b));b.bundleId=`bundle.${digest(b)}`;
        const project={projectId:input.projectId,manifestId:manifest.manifestId,bundleId:b.bundleId,status:'roadmap',recordRevision:1};
        const old=owner.projects.find(p=>p.projectId===input.projectId);if(old&&canonicalJSON(old)!==canonicalJSON(project))return reject('project-id-collision');
        const oldM=owner.manifests.find(m=>m.manifestId===manifest.manifestId);if(oldM&&canonicalJSON(oldM)!==canonicalJSON(manifest))return reject('manifest-id-collision');
        if(!oldM)owner.manifests.push(manifest);if(!owner.bundles.some(x=>x.bundleId===b.bundleId))owner.bundles.push(b);if(!old)owner.projects.push(project);
        for(const [field,id]of [['manifests','manifestId'],['bundles','bundleId'],['projects','projectId']])owner[field].sort((a,c)=>a[id]<c[id]?-1:a[id]>c[id]?1:0);
        validate(owner,input.resolverRegistry,input.limits);return {status:'ok',owner};
    }catch(e){return reject(e.code??e.message);}
}
export function encodeReceipts(owner) {validate(owner);return canonicalJSON(owner);}
export function decodeReceipts(json,{resolverRegistry,limits={}}={}) {
    if(json===undefined||json===null)return {status:'absent'};
    try {if(typeof json!=='string')throw Error('invalid-input');if(new TextEncoder().encode(json).length>(limits.bytes??QA_LIMITS.bytes))throw Error('budget-exceeded');
        const owner=JSON.parse(json);validate(owner,resolverRegistry??{},limits);return {status:'ok',owner:structuredClone(owner)};
    }catch(e){return reject(e.code??e.message);}
}
export function migrateReceipts(owner,migration,options={}) {
    // Retention is the first supported migration. New packs never rewrite pins.
    if(migration.kind!=='retain-v1')return reject('unsupported-migration');
    try{return decodeReceipts(encodeReceipts(owner),options);}catch(e){return reject(e.code??e.message);}
}
export function receiptQueries(owner) {
    validate(owner);return structuredClone(owner.projects.map(p=>{const b=owner.bundles.find(x=>x.bundleId===p.bundleId),m=owner.manifests.find(x=>x.manifestId===p.manifestId);
        return {projectId:p.projectId,targetMeaning:{roots:b.graph.roots,targets:b.graph.nodes.filter(n=>n.target).map(n=>({id:n.id,target:n.target,scale:n.scale})),worldId:m.worldId,worldInstanceId:m.worldInstanceId,lawRevision:m.lawRevision},requirements:b.graph,selectedTerms:b.choices,knownRoadmap:runPlanner({graph:b.graph,world:b.world,knowledge:b.knowledge,phase:'view'}).value,consumer:b.consumer,generation:'N/A',settlement:'N/A'};}));
}
export function projectKnownRoadmap(owner,projectId,knowledge) {
    validate(owner);const p=owner.projects.find(x=>x.projectId===projectId);if(!p)return reject('unknown-project');
    const b=owner.bundles.find(x=>x.bundleId===p.bundleId);admitPlain(knowledge??b.knowledge);const r=runPlanner({graph:b.graph,world:b.world,knowledge:knowledge??b.knowledge,phase:'view'});return r.status==='ok'?structuredClone(r.value):reject(r.status);
}
