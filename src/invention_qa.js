/** Pure headless admission/diagnostics. No native consumers or publication. */
import {expandTarget, composeTargets, checkFeasibility, roadmapView, estimate, measurePlannerCall} from './invention_planner.js';
export const QA_LIMITS = Object.freeze({bytes: 1048576, entries: 4096, references: 16384,
    string: 2048, nodes: 1024, edges: 4096, depth: 256, operations: 1000000, rendered: 262144, projects: 128});
const fail = code => { const e = new TypeError(code); e.code = code; throw e; };
export const canonicalJSON = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
// Dependency-free SHA-256 for immutable plain-data receipts; UTF-8, no clock/RNG.
export function digest(value) {
    const bytes = new TextEncoder().encode(typeof value === 'string' ? value : canonicalJSON(value));
    const primes = [], k = [], h = [];
    for (let n = 2; primes.length < 64; n++) if (!primes.some(p => n % p === 0)) {
        primes.push(n); k.push((Math.cbrt(n) * 4294967296) >>> 0);
        if (h.length < 8) h.push((Math.sqrt(n) * 4294967296) >>> 0);
    }
    const size = Math.ceil((bytes.length + 9) / 64) * 64, b = new Uint8Array(size); b.set(bytes); b[bytes.length] = 128;
    const d = new DataView(b.buffer); d.setUint32(size - 8, Math.floor(bytes.length / 536870912)); d.setUint32(size - 4, bytes.length * 8);
    const r = (x,n) => (x >>> n) | (x << (32-n));
    for (let pos = 0; pos < size; pos += 64) {
        const w = new Uint32Array(64);
        for (let i=0;i<16;i++) w[i]=d.getUint32(pos+i*4);
        for (let i=16;i<64;i++) { const a=w[i-15],c=w[i-2]; w[i]=(w[i-16]+(r(a,7)^r(a,18)^(a>>>3))+w[i-7]+(r(c,17)^r(c,19)^(c>>>10)))>>>0; }
        let [a,c,e,f,g,j,l,m]=h;
        for (let i=0;i<64;i++) { const t=(m+(r(g,6)^r(g,11)^r(g,25))+((g&j)^(~g&l))+k[i]+w[i])>>>0;
            const u=((r(a,2)^r(a,13)^r(a,22))+((a&c)^(a&e)^(c&e)))>>>0;
            m=l;l=j;j=g;g=(f+t)>>>0;f=e;e=c;c=a;a=(t+u)>>>0; }
        [a,c,e,f,g,j,l,m].forEach((v,i)=>h[i]=(h[i]+v)>>>0);
    }
    return h.map(v=>v.toString(16).padStart(8,'0')).join('');
}
export function admitPlain(value, limits = QA_LIMITS) {
    limits = {...QA_LIMITS, ...limits};
    const pending = [[value,0]], seen = new Set(); let work=0, bytes=0;
    while (pending.length) {
        const [v,depth] = pending.pop();
        if (++work > limits.operations || depth > limits.depth) fail('budget-exceeded');
        if (typeof v === 'string') { if (v.length > limits.string) fail('budget-exceeded'); bytes += new TextEncoder().encode(v).length + 2; }
        else if (typeof v === 'number') { if (!Number.isFinite(v)) fail('invalid-input'); bytes += 24; }
        else if (typeof v === 'boolean' || v === null) bytes += 5;
        else if (typeof v === 'object') {
            if(Array.isArray(v)&&v.length>Math.max(limits.entries,limits.references))fail('budget-exceeded');
            if (seen.has(v) || ![Object.prototype, Array.prototype, null].includes(Object.getPrototypeOf(v))) fail('invalid-input');
            seen.add(v);
            const descriptors = Object.getOwnPropertyDescriptors(v);
            if(Array.isArray(v)&&Object.keys(descriptors).length!==v.length+1)fail('invalid-input');
            if (Reflect.ownKeys(v).some(k=>typeof k !== 'string')) fail('invalid-input');
            bytes += 2;
            for (const [key,desc] of Object.entries(descriptors)) {
                if (Array.isArray(v) && key === 'length') continue;
                if (!Object.hasOwn(desc,'value') || !desc.enumerable || ['__proto__','constructor','prototype'].includes(key)) fail('invalid-input');
                pending.push([desc.value,depth+1]); bytes += key.length*3+4;
                if (key.length > limits.string || pending.length > limits.operations) fail('budget-exceeded');
            }
        } else fail('invalid-input');
        if (bytes > limits.bytes) fail('budget-exceeded');
    }
    return {work,bytesUpperBound:bytes};
}
const children = n => n.kind === 'goal' ? n.alternatives : n.kind === 'method' ? n.requires : [];
export function validateGraph(graph, limits = QA_LIMITS) {
    limits = {...QA_LIMITS,...limits}; const stats = admitPlain(graph,limits);
    if (graph.version !== 1 || !Array.isArray(graph.nodes) || !Array.isArray(graph.roots) || !Array.isArray(graph.pruned)) fail('invalid-input');
    if (graph.nodes.length > limits.nodes) fail('budget-exceeded');
    const map = new Map(); let edges=0;
    for (const n of graph.nodes) {
        if (typeof n.id !== 'string' || !n.id || n.id.startsWith('$') || map.has(n.id) || typeof n.label !== 'string' || !n.label ||
            !['goal','method','primitive'].includes(n.kind) || !['person','workshop','town','nation','civilization'].includes(n.scale)) fail('invalid-input');
        if (n.kind !== 'primitive' && (!Array.isArray(children(n)) || n.operator !== (n.kind === 'goal' ? 'OR' : 'AND'))) fail('invalid-input');
        edges += children(n).length; map.set(n.id,n);
    }
    if (edges > limits.edges) fail('budget-exceeded');
    if (!graph.roots.length || new Set(graph.roots).size !== graph.roots.length || graph.roots.some(id=>map.get(id)?.kind !== 'goal')) fail('invalid-input');
    for (const n of map.values()) {
        for (const id of children(n)) if (map.get(id)?.kind !== (n.kind === 'goal' ? 'method' : map.get(id)?.kind) || !map.has(id) ||
            (n.kind === 'method' && !['goal','primitive'].includes(map.get(id).kind))) fail('invalid-input');
        if (n.kind === 'method' && (map.get(n.produces)?.kind !== 'goal' || !map.get(n.produces).alternatives.includes(n.id))) fail('invalid-input');
        if (n.kind === 'goal' && n.alternatives.some(id=>map.get(id).produces !== n.id)) fail('invalid-input');
    }
    // All external nodes are checked, even unreachable ones. DFS discovery depth
    // bounds recursive work; DAG longest path checked separately below.
    const done = new Set(), active = new Set(), height = new Map(); let visits=stats.work,cyclic=false;const finished=[];
    for (const id of map.keys()) {
        if (done.has(id)) continue;
        const stack = [{id,next:0}]; active.add(id);
        while (stack.length) {
            if (++visits > limits.operations || stack.length-1 > limits.depth) fail('budget-exceeded');
            const f=stack.at(-1), cs=children(map.get(f.id));
            if (f.next < cs.length) { const c=cs[f.next++];
                if (active.has(c)){cyclic=true;continue;}
                else if (!done.has(c)) {active.add(c);stack.push({id:c,next:0});}
            } else {height.set(f.id,Math.max(0,...cs.map(c=>1+(height.get(c)??0))));active.delete(f.id);done.add(f.id);finished.push(f.id);stack.pop();}
        }
    }
    if(cyclic){
        // SCC condensation gives a safe upper bound on any simple dependency
        // path. It can conservatively refuse a large, densely connected SCC.
        const reverse=new Map([...map.keys()].map(id=>[id,[]]));
        for(const [id,n]of map)for(const c of children(n)){if(++visits>limits.operations)fail('budget-exceeded');reverse.get(c).push(id);}
        const component=new Map(),sizes=[];
        for(const id of finished.reverse()){if(component.has(id))continue;const ci=sizes.length,pending=[id];let size=0;component.set(id,ci);
            while(pending.length){const v=pending.pop();size++;for(const c of reverse.get(v)){if(++visits>limits.operations)fail('budget-exceeded');if(!component.has(c)){component.set(c,ci);pending.push(c);}}}sizes.push(size);}
        const arcs=sizes.map(()=>new Set()),indegree=sizes.map(()=>0),longest=[...sizes];
        for(const [id,n]of map)for(const c of children(n)){const a=component.get(id),b=component.get(c);if(a!==b&&!arcs[a].has(b)){arcs[a].add(b);indegree[b]++;}}
        const queue=indegree.flatMap((v,i)=>v?[]:[i]);for(let i=0;i<queue.length;i++)for(const c of arcs[queue[i]]){if(++visits>limits.operations)fail('budget-exceeded');longest[c]=Math.max(longest[c],longest[queue[i]]+sizes[c]);if(--indegree[c]===0)queue.push(c);}
        if(Math.max(0,...longest)-1>limits.depth)fail('budget-exceeded');
    }else if (Math.max(0,...height.values()) > limits.depth) fail('budget-exceeded');
    return {...stats,work:visits,edges};
}
function catalogPreflight(pack,world,limits) {
    const stats=admitPlain({pack,world},limits), entries=new Map(), methods=[];
    for (const owner of [pack,world]) for (const [field,kind] of [['functions','goal'],['primitives','primitive'],['methods','method']]) {
        if (owner[field] !== undefined && !Array.isArray(owner[field])) fail('invalid-input');
        for (const v of owner[field]??[]) { if (!v || typeof v.id !== 'string' || entries.has(v.id)) fail('invalid-input'); entries.set(v.id,{...v,kind});if(kind==='method')methods.push(v); }
    }
    if(entries.size>limits.entries || methods.reduce((n,m)=>n+(Array.isArray(m.requires)?m.requires.length:0),0)>limits.references) fail('budget-exceeded');
    const scales=['person','workshop','town','nation','civilization'];
    for(const e of entries.values()){
        if(!e.id||e.id.startsWith('$')||typeof e.label!=='string'||!e.label||e.scale!==undefined&&!scales.includes(e.scale))fail('invalid-input');
        if(e.target!==undefined&&(!e.target||!['function','magnitude','form'].every(k=>typeof e.target[k]==='string')))fail('invalid-input');
        if(e.kind==='method'){
            if(entries.get(e.produces)?.kind!=='goal'||!Array.isArray(e.requires)||e.requires.some(id=>!['goal','primitive'].includes(entries.get(id)?.kind)))fail('invalid-input');
            if(e.tags!==undefined&&(!Array.isArray(e.tags)||e.tags.some(t=>typeof t!=='string')))fail('invalid-input');
            if(e.when!==undefined&&(!e.when||typeof e.when!=='object'||Array.isArray(e.when)))fail('invalid-input');
        }
    }
    // Bound reachable topology before the planner clones the full catalog.
    return {entries,stats};
}
export function runPlanner(input, overrides = {}) {
    const limits={...QA_LIMITS,...overrides}; let counters;
    try {
        const phase=input.phase??'bundle'; let graph=input.graph, prep=admitPlain(input,limits).work;
        if (graph) prep+=validateGraph(graph,limits).work;
        else {
            const {entries,stats}=catalogPreflight(input.pack,input.world,limits);prep+=stats.work;
            const lookup=t=>typeof t==='string' ? [...entries.values()].filter(e=>e.id===t&&e.kind==='goal') : [...entries.values()].filter(e=>e.kind==='goal'&&['function','magnitude','form'].every(k=>e.target?.[k]===t?.[k]));
            for(const t of [input.target,...(input.other===undefined?[]:[input.other])]) {
                if (typeof t !== 'string' && (!t || !['function','magnitude','form'].every(k=>typeof t[k]==='string'))) fail('invalid-input');
                const found=lookup(t); if (!found.length) return {status:'unsupported-target',counters:{total:prep,phases:{admission:prep}}}; if(found.length!==1)fail('invalid-input');
            }
            // Iterative topology preview includes permitted branches only, no large clone.
            const byProduct=new Map();for(const e of entries.values())if(e.kind==='method') {const a=byProduct.get(e.produces)??[];a.push(e);byProduct.set(e.produces,a);}
            const roots=[...new Set([input.target,...(input.other===undefined?[]:[input.other])].map(t=>lookup(t)[0].id))];
            const pending=[...roots], ns=new Map();
            const permitted=m=>!Object.hasOwn(input.world.rules?.blockedMethods??{},m.id)&&!(m.tags??[]).some(t=>Object.hasOwn(input.world.rules?.blockedTags??{},t))&&Object.entries(m.when??{}).every(([k,v])=>input.world.rules?.flags?.[k]===v);
            while(pending.length){if(++prep>limits.operations)fail('budget-exceeded');const id=pending.pop();if(ns.has(id))continue;const e=entries.get(id);if(!e)fail('invalid-input');
                const n={id,kind:e.kind,label:e.label,scale:e.scale??'person'};
                if(e.kind==='goal'){n.operator='OR';n.alternatives=(byProduct.get(id)??[]).filter(permitted).map(m=>m.id);}
                if(e.kind==='method'){if(!Array.isArray(e.requires))fail('invalid-input');n.operator='AND';n.requires=[...new Set(e.requires)];n.produces=e.produces;}
                ns.set(id,n);if(ns.size>limits.nodes)fail('budget-exceeded');pending.push(...children(n));}
            prep+=validateGraph({version:1,roots,nodes:[...ns.values()],pruned:[]},limits).work;
        }
        if (prep>=limits.operations) fail('budget-exceeded');
        const measured=measurePlannerCall(()=>{
            graph??=input.other===undefined?expandTarget(input.pack,input.world,input.target):composeTargets(input.pack,input.world,input.target,input.other);
            if(phase==='expand'||phase==='compose')return graph;
            if(phase==='feasibility')return checkFeasibility(graph,input.world);
            if(phase==='view')return roadmapView(graph,input.knowledge??{});
            if(phase==='estimate')return estimate(graph,input.choice??{});
            if(phase!=='bundle')fail('invalid-input');
            const feasibility=checkFeasibility(graph,input.world), view=roadmapView(graph,input.knowledge??{}), estimateAll=estimate(graph);
            return {graph,feasibility,view,estimateAll};
        },limits.operations-prep);
        counters={total:measured.counters.total+prep,phases:{admission:prep,...measured.counters.phases}};
        const outputWork=admitPlain(measured.value,{...limits,bytes:limits.bytes,depth:limits.depth+16}).work;
        counters.phases.outputValidation=outputWork;counters.total+=outputWork;
        if(phase==='view'||phase==='bundle'){const viewWork=admitPlain(phase==='view'?measured.value:measured.value.view,{...limits,bytes:limits.rendered}).work;counters.total+=viewWork;counters.phases.outputValidation+=viewWork;}
        if(counters.total>limits.operations)fail('budget-exceeded');
        return {status:phase==='bundle'?(measured.value.feasibility.solvable?'supported-solvable':'supported-unsolvable'):'ok',... (phase==='bundle'?measured.value:{value:measured.value}),counters};
    } catch(e) {return {status:e.code==='budget-exceeded'?'budget-exceeded':'invalid-input',diagnostic:e.code==='budget-exceeded'?'Z1.U':'invalid-pack',...(counters||e.counters?{counters:counters??e.counters}:{})};}
}
export function consumerDisposition(sidecar,registry={}) {
    if (!sidecar || sidecar.status==='demo') return {status:'unbound-demo'};
    const contract=registry[`${sidecar.consumerId}@${sidecar.consumerRevision}`];
    return {status:contract && ['function','magnitude','form'].every(k=>sidecar.reads?.includes(k)&&contract.reads?.includes(k)) ? 'bound-synthetic' : 'missing-consumer'};
}
export function classify(result, profile={}) {
    const findings=[];const add=(ruleId,severity='hard',extra={})=>findings.push({ruleId,severity,...extra});
    if(result.status==='budget-exceeded')add('Z1.U');
    if(result.status==='invalid-input')add('invalid-pack');
    if(result.status==='supported-unsolvable'&&profile.expectedSolvable===true||profile.oracleSolvable!==undefined&&result.feasibility&&profile.oracleSolvable!==result.feasibility.solvable)add('Z1.I');
    if(result.feasibility){
        for(const c of result.feasibility.cycles)if(c.blocking&&!result.feasibility.solvable)add('Z1.C','hard',{nodeIds:c.nodeIds});
        for(const s of result.feasibility.witness?.steps??[])if(!s.requires.length&&!profile.approvedGifts?.includes(s.method))add('Z1.T',profile.requireMeans?'hard':'review',{methodId:s.method});
        if(profile.requiredPrimitive && !result.feasibility.witness?.primitives.includes(profile.requiredPrimitive)&&result.feasibility.solvable)add('Z1.T','hard');
    }
    if(consumerDisposition(profile.consumer,profile.registry).status==='missing-consumer')add('Z1.M');
    return findings;
}
export function catalogMatrix(pack,worlds) {
    const axes=['function','magnitude','form'].map(k=>[...new Set(pack.functions.flatMap(f=>f.target?[f.target[k]]:[]))].sort());const result=[];
    for(const world of worlds)for(const fn of axes[0])for(const magnitude of axes[1])for(const form of axes[2]) {
        const target={function:fn,magnitude,form},r=runPlanner({pack,world,target});result.push({caseId:`matrix.${result.length}`,worldId:world.id,target,status:r.status});}
    return result;
}
export function deterministicManifest(input) { admitPlain(input);return {schemaVersion:1,...structuredClone(input),digest:digest(input)}; }
