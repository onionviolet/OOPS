import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inventionPackHome,homeWorld,magicWorld} from '../../src/data/invention_pack_home.js';
import {expandTarget,composeTargets,checkFeasibility,roadmapView,estimate} from '../../src/invention_planner.js';
import {canonicalJSON,digest,catalogMatrix,runPlanner,classify} from '../../src/invention_qa.js';
export {canonicalJSON,digest};
export const hashFile=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
export function deepFreeze(v){if(v&&typeof v==='object'){Object.freeze(v);Object.values(v).forEach(deepFreeze);}return v;}
export function reverseCatalog(pack){const p=structuredClone(pack);for(const k of ['functions','methods','primitives'])p[k]?.reverse();p.methods?.forEach(m=>m.requires.reverse());return p;}
export function permitted(m,w){return !Object.hasOwn(w.rules?.blockedMethods??{},m.id)&&!(m.tags??[]).some(t=>Object.hasOwn(w.rules?.blockedTags??{},t))&&Object.entries(m.when??{}).every(([k,v])=>w.rules?.flags?.[k]===v);}
export const available=(w,id)=>w.available?.[id]===true||w.available?.[id]?.available===true;
// Independent state-space BFS: never imports planner solving or SCC helpers.
export function oracleDerivable(c){const goals=[...(c.pack.functions??[]),...(c.world.functions??[])].map(g=>g.id);
    if(goals.length>8)return {status:'N/A'};
    const masks=new Map(goals.map((id,i)=>[id,1<<i])),methods=[...(c.pack.methods??[]),...(c.world.methods??[])].filter(m=>permitted(m,c.world));
    const roots=c.roots??[c.target],wanted=roots.reduce((m,id)=>m|masks.get(id),0),q=[0],seen=new Set(q);
    for(let i=0;i<q.length;i++){const s=q[i];if((s&wanted)===wanted)return {status:'exhaustive',solvable:true,states:seen.size};
        for(const m of methods)if(m.requires.every(id=>masks.has(id)?s&masks.get(id):available(c.world,id))){const next=s|masks.get(m.produces);if(!seen.has(next)){seen.add(next);q.push(next);}}}
    return {status:'exhaustive',solvable:false,states:seen.size};}
export function replayWitness(g,w,witness){assert.ok(witness);const map=new Map(g.nodes.map(n=>[n.id,n])),derived=new Set();
    assert.equal(new Set(witness.nodeIds).size,witness.nodeIds.length);assert.deepEqual(witness.roots,g.roots);
    for(const id of witness.primitives){assert.equal(map.get(id)?.kind,'primitive');assert.ok(available(w,id));derived.add(id);}
    const selected=new Set(witness.primitives);
    for(const s of witness.steps){const m=map.get(s.method),goal=map.get(s.id);assert.equal(goal?.kind,'goal');assert.ok(goal.alternatives.includes(s.method));assert.equal(m?.produces,s.id);assert.deepEqual(s.requires,m.requires);
        for(const id of s.requires)assert.ok(derived.has(id),`witness.${s.id}.${id}`);assert.ok(!derived.has(s.id));derived.add(s.id);selected.add(s.id);selected.add(s.method);}
    for(const id of g.roots)assert.ok(derived.has(id));assert.deepEqual([...selected].sort(),witness.nodeIds);assert.equal(estimate(g,Object.fromEntries(witness.steps.map(s=>[s.id,s.method]))).cyclic,false);}
export function assertKnownOnly(g,k){const view=roadmapView(g,k);const text=JSON.stringify(view);for(const field of ['available','missingReason','pruned','solvable'])assert.ok(!text.includes(`"${field}"`));
    for(const n of view.nodes)if(n.kind==='slot')assert.deepEqual(Object.keys(n).sort(),['fidelity','id','kind','label']);return view;}
export function matrixCases(){return catalogMatrix(inventionPackHome,[homeWorld,magicWorld]);}
export function generatedCases({seeds=[1,17,73,0xffffffff],count=250}={}) {
    const out=[];
    for(let i=0;i<count;i++){const seed=seeds[i%seeds.length]>>>0;let state=(seed^(Math.imul(i+1,2654435761)))>>>0;
        const rng=n=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state%n;};
        const ng=1+rng(8),np=1+rng(12),pack={id:'synthetic.v1',functions:[],primitives:[],methods:[]},world={id:'synthetic.world.v1',available:{},rules:{flags:{fiction:true},blockedMethods:{}}};
        for(let j=0;j<np;j++){pack.primitives.push({id:`p${j}`,label:`Synthetic capacity ${j}`});world.available[`p${j}`]=rng(3)!==0;}
        for(let j=0;j<ng;j++) {pack.functions.push({id:`g${j}`,label:`Synthetic goal ${j}`});for(let a=0;a<1+rng(3);a++){
            const m={id:`m${j}.${a}`,label:`Synthetic route ${j}.${a}`,produces:`g${j}`,requires:[]};const n=rng(4);for(let r=0;r<n;r++)m.requires.push(j&&rng(2)?`g${rng(j)}`:`p${rng(np)}`);pack.methods.push(m);if(rng(9)===0)world.rules.blockedMethods[m.id]='Synthetic world gate';}}
        const mode=i%6;if(mode===1)pack.methods.push({id:'loop',label:'Synthetic loop',produces:'g0',requires:['g0']});
        if(mode===2&&ng>1){pack.methods.push({id:'cross.a',label:'Synthetic cross A',produces:'g0',requires:['g1']},{id:'cross.b',label:'Synthetic cross B',produces:'g1',requires:['g0']});}
        if(mode===3)pack.methods=pack.methods.filter(m=>m.produces!==`g${ng-1}`);
        if(mode===4)pack.methods.push({id:'gift',label:'Synthetic approved gift',produces:`g${ng-1}`,requires:[]});
        const knowledge=Object.fromEntries([...pack.functions,...pack.methods,...pack.primitives].map(n=>[n.id,rng(6)]));
        out.push({id:`seed.${seed}.case.${i}`,seed,pack,world,target:`g${ng-1}`,knowledge});}
    return out;
}
export function validateGenerated(c){const before=structuredClone(c);deepFreeze(c);const g=expandTarget(c.pack,c.world,c.target),r=checkFeasibility(g,c.world),oracle=oracleDerivable(c);
    assert.equal(r.solvable,oracle.solvable);if(r.solvable)replayWitness(g,c.world,r.witness);assert.deepEqual(expandTarget(reverseCatalog(c.pack),c.world,c.target),g);
    assert.deepEqual(composeTargets(c.pack,c.world,c.target,c.target),g);assert.deepEqual(c,before);assertKnownOnly(g,c.knowledge);assert.equal(estimate(g).nodeCount,g.nodes.length);
    const adapter=runPlanner(c);assert.equal(adapter.status,r.solvable?'supported-solvable':'supported-unsolvable');
    const plus=structuredClone(c.world);for(const p of c.pack.primitives)plus.available[p.id]=true;assert.ok(!r.solvable||checkFeasibility(g,plus).solvable);
    const minus=structuredClone(c.world);minus.available={};assert.ok(r.solvable||!checkFeasibility(g,minus).solvable);
    const gift=structuredClone(c.pack);gift.methods.push({id:'metamorphic.gift',label:'Synthetic alternative',produces:c.target,requires:[]});assert.equal(checkFeasibility(expandTarget(gift,c.world,c.target),c.world).solvable,true);
    const pruned=structuredClone(c.world);pruned.rules.blockedMethods={...pruned.rules.blockedMethods,'metamorphic.gift':'Synthetic block'};const pg=expandTarget(gift,pruned,c.target);assert.ok(!pg.nodes.some(n=>n.id==='metamorphic.gift'));
    const altered=structuredClone(g);for(const n of altered.nodes)if(n.kind==='primitive'){n.available=!n.available;n.missingReason='Synthetic hidden change';}assert.deepEqual(roadmapView(altered,c.knowledge),roadmapView(g,c.knowledge));
    const double=composeTargets(c.pack,c.world,c.target,'g0');assert.deepEqual(double,composeTargets(c.pack,c.world,'g0',c.target));assert.equal(checkFeasibility(double,c.world).solvable,oracleDerivable({...c,roots:[c.target,'g0']}).solvable);
    return {caseId:c.id,status:adapter.status,oracleStates:oracle.states,operations:adapter.counters.total,digest:digest(c)};
}
export function mutantCase(kind,control=false){const c={id:`mutant.${kind}.${control}`,pack:{id:'synthetic',functions:[{id:'g',label:'Synthetic goal'}],primitives:[{id:'p',label:'Synthetic means'}],methods:[{id:'m',label:'Synthetic method',produces:'g',requires:['p']}]},world:{id:'synthetic',available:{p:true}},target:'g',knowledge:{}};
    const profile={expectedSolvable:true};
    if(kind==='I'){c.pack.methods=[];if(control)profile.expectedSolvable=false;}
    if(kind==='T'){c.pack.methods[0].requires=[];profile.requireMeans=true;if(control)profile.approvedGifts=['m'];}
    if(kind==='C'){c.pack.methods[0].requires=['g'];if(control)c.pack.methods.push({id:'exit',label:'Synthetic escape',produces:'g',requires:['p']});}
    if(kind==='U')return {case:adversarialCase('long-chain',{overLimit:!control}),profile};
    if(kind==='M'){profile.consumer=control?{status:'demo'}:{status:'playable',consumerId:'mock',consumerRevision:'1',reads:['function']};}
    return {case:c,profile};}
export function shrinkCase(initial,predicate){let c=structuredClone(initial);const candidates=x=>{
    const result=[];for(let i=0;i<x.pack.methods.length;i++){const n=structuredClone(x);n.pack.methods.splice(i,1);result.push(n);}
    for(let i=0;i<x.pack.methods.length;i++)for(let j=0;j<x.pack.methods[i].requires.length;j++){const n=structuredClone(x);n.pack.methods[i].requires.splice(j,1);result.push(n);}
    for(const p of x.pack.primitives){if(x.pack.methods.some(m=>m.requires.includes(p.id)))continue;const n=structuredClone(x);n.pack.primitives=n.pack.primitives.filter(q=>q.id!==p.id);delete n.world.available[p.id];result.push(n);}
    return result;};let changed=true,attempts=0;while(changed&&attempts<1000){changed=false;for(const n of candidates(c)){attempts++;const r=runPlanner(n);if(!['invalid-input','budget-exceeded'].includes(r.status)&&predicate(n,r)){c=n;changed=true;break;}}}return {initialDigest:digest(initial),minimalDigest:digest(c),case:c,attempts};}
export function adversarialCase(kind,{overLimit=false,size=64}={}) {
    const n=overLimit?kind==='unused-catalog'?4097:kind==='huge-text'?2050:kind==='wide-and'?1100:200:size;
    const c={pack:{id:'synthetic.benchmark',functions:[{id:'g',label:'Synthetic root'}],primitives:[],methods:[]},world:{id:'synthetic.world',available:{}},target:'g',knowledge:{}};
    const primitive=id=>{c.pack.primitives.push({id,label:'Synthetic capacity'});c.world.available[id]=true;};
    if(kind==='huge-text'){primitive('p');c.pack.primitives[0].label='x'.repeat(n);c.pack.methods.push({id:'m',label:'Synthetic route',produces:'g',requires:['p']});}
    else if(kind==='unused-catalog'){primitive('p');c.pack.methods.push({id:'m',label:'Synthetic route',produces:'g',requires:['p']});for(let i=0;i<n;i++)c.pack.primitives.push({id:`u${i}`,label:'Synthetic unused'});}
    else if(kind==='long-chain'||kind==='hostile-chain'){primitive('p');const count=overLimit?n:Math.max(1,Math.floor((n-1)/2));
        const gid=i=>i===0?'g':kind==='long-chain'?`a${String((count-i)*2-1).padStart(4,'0')}`:`g${String(i).padStart(4,'0')}`;
        for(let i=0;i<count;i++){const id=gid(i);if(i)c.pack.functions.push({id,label:'Synthetic link'});c.pack.methods.push({id:kind==='long-chain'?`a${String((count-i)*2-2).padStart(4,'0')}`:`m${String(count-i).padStart(4,'0')}`,label:'Synthetic chain',produces:id,requires:[i===count-1?'p':gid(i+1)]});}
        if(!overLimit&&2*count+1<n){primitive('extra');c.pack.methods[0].requires.push('extra');}}
    else if(kind==='many-or'){primitive('p');for(let i=0;i<n-2;i++)c.pack.methods.push({id:`m${i}`,label:'Synthetic OR',produces:'g',requires:['p']});}
    else if(kind==='diamond'||kind==='scc-exit'){primitive('p');c.pack.functions.push({id:'shared',label:'Synthetic shared'});c.pack.methods.push({id:'shared.m',label:'Synthetic shared route',produces:'shared',requires:['p']});
        for(let i=0;i<n-(kind==='scc-exit'?5:4);i++)c.pack.methods.push({id:`m${i}`,label:'Synthetic shared alternative',produces:'g',requires:['shared']});if(kind==='scc-exit')c.pack.methods.push({id:'loop',label:'Synthetic optional cycle',produces:'shared',requires:['g']});}
    else {const requires=[];for(let i=0;i<n-2;i++){primitive(`p${i}`);requires.push(`p${i}`);}c.pack.methods.push({id:'m',label:'Synthetic AND',produces:'g',requires});}
    return c;
}
export function runIsolated(input,timeout=2000,action='planner') {return new Promise(resolve=>{let finished=false;const worker=new Worker(new URL('./invention_qa_worker.mjs',import.meta.url),{workerData:{input,action}});
    const finish=r=>{if(finished)return;finished=true;clearTimeout(timer);worker.terminate();resolve(r);};const timer=setTimeout(()=>finish({status:'timeout',diagnostic:'Z1.U'}),timeout);
    worker.once('message',finish);worker.once('error',()=>finish({status:'crash',diagnostic:'Z1.U'}));worker.once('exit',code=>{if(!finished)finish({status:'crash',exitCode:code});});});}
export function goldenBundle(input){const out={};for(const id of ['soap','lamp','thermometer']){const graph=expandTarget(input.pack,input.home,id),feasibility=checkFeasibility(graph,input.home),choice=Object.fromEntries(feasibility.witness.steps.map(s=>[s.id,s.method]));
    out[id]={graph,feasibility,estimateAll:estimate(graph),estimateWitness:estimate(graph,choice),views:Object.fromEntries(Object.entries(input.knowledge[id]).map(([name,k])=>[name,roadmapView(graph,k)]))};}
    const magic=expandTarget(input.pack,input.magic,'lamp');out.magic={graph:magic,feasibility:checkFeasibility(magic,input.magic),estimate:estimate(magic)};
    const noWater=structuredClone(input.home);noWater.available.water={available:false,reason:'Synthetic water shortage'};
    const noRef=structuredClone(input.home);noRef.available.reference=false;
    for(const [name,target,w]of [['noWater','soap',noWater],['noReference','thermometer',noRef]]){const graph=expandTarget(input.pack,w,target);out[name]={graph,feasibility:checkFeasibility(graph,w)};}
    const composed=composeTargets(input.pack,input.home,'lamp','thermometer');out.composed={graph:composed,feasibility:checkFeasibility(composed,input.home),estimate:estimate(composed)};return out;}
export function pi9Input(pack=inventionPackHome,world=homeWorld){const nodes=[...(pack.functions??[]),...(world.functions??[])].map(n=>({...structuredClone(n),kind:'goal',alternatives:[...(pack.methods??[]),...(world.methods??[])].filter(m=>m.produces===n.id).map(m=>m.id)}));
    nodes.push(...[...(pack.methods??[]),...(world.methods??[])].map(n=>({...structuredClone(n),kind:'method'})),...[...(pack.primitives??[]),...(world.primitives??[])].map(n=>({...structuredClone(n),kind:'primitive'})));
    const map=new Map(nodes.map(n=>[n.id,n])),closure=new Set(),pending=map.has('energy')?['energy']:[];while(pending.length){const id=pending.pop();if(closure.has(id))continue;closure.add(id);const n=map.get(id);pending.push(...(n.alternatives??n.requires??[]));}
    const input={language:'en',nodes,sidecar:nodes.map(n=>({nodeId:n.id,hazardKinds:n.id==='energy'?['ambiguous-dual-use']:[],abstraction:closure.has(n.id)?'abstract-fiction':'ordinary',textFields:Object.keys(n),contextRefs:[]})),surfaces:[],requiredSurfaces:[]};return input;}
export function reviewedPolicy(input){const texts=[];const walk=v=>{if(typeof v==='string')texts.push(digest(v));else if(v&&typeof v==='object')Object.values(v).forEach(walk);};input.nodes.forEach(walk);input.surfaces.forEach(s=>walk(s.text));return {revision:'pi9.synthetic.1',edition:'synthetic-v1',language:'en',restrictedTokens:['SYNTH_RESTRICTED_MATERIAL'],capacityTypes:['fictional-capacity'],reviewedTextDigests:[...new Set(texts)].sort(),exceptions:[]};}
export function pi9Fixture(kind){const input=pi9Input();if(kind==='ordinary-soap'||kind==='abstract-energy')return input;
    const node=input.nodes.find(n=>n.id==='energy'),s={id:'candidate',nodeId:'energy',text:'Reviewed fictional capacity'};input.surfaces.push(s);input.requiredSurfaces=['candidate'];
    if(kind==='material')s.text='SYNTH_RESTRICTED_MATERIAL';if(kind==='unicode')s.text='ＳＹＮＴＨ＿ＲＥＳＴＲＩＣＴＥＤ＿ＭＡＴＥＲＩＡＬ';
    if(kind==='procedure')s.text='SYNTH_REAL_PROCESS';if(kind==='split')input.surfaces.push({id:'split',nodeId:'energy',text:'SYNTH_STEP_B'}),s.text='SYNTH_STEP_A';
    if(kind==='quantity')s.text='SYNTH_PHYSICAL_QUANTITY';if(kind==='belief'||kind==='error')s.id=kind,s.text='SYNTH_REAL_PROCESS';
    if(kind==='missing-annotation')input.sidecar=input.sidecar.filter(m=>m.nodeId!==node.id);
    if(kind==='language')input.language='und';if(kind==='coverage')input.requiredSurfaces.push('unscanned');
    if(kind==='schema')node.steps=['SYNTH_PLACEHOLDER'];if(kind==='credits')node.costs=[{kind:'game-credit',value:20}];
    return input;}
export function receiptInput(id='lamp',projectId='project.1'){const graph=expandTarget(inventionPackHome,homeWorld,id);return {projectId,manifest:{manifestId:'manifest.v1',plannerId:'planner',plannerRevision:'v1',plannerDigest:'synthetic-planner-v1',packId:inventionPackHome.id,packRevision:'v1',packDigest:digest(inventionPackHome),worldId:homeWorld.id,worldInstanceId:'synthetic.instance.1',lawRevision:'v1',lawDigest:digest(homeWorld.rules)},graph,world:structuredClone(homeWorld),knowledge:{'lamp':5,'lamp.oil':{wrong:true,label:'Remembered synthetic lamp'}},choices:{},consumer:{status:'demo'},danger:{status:'pass',policyRevision:'pi9.synthetic.1'}};}
export const resolverV1={'planner@v1':'synthetic-planner-v1'};
export function restoreIntoMemoryAtomically(memory,json,options,decode){const r=decode(json,options);if(r.status!=='ok')return r;if(options.failWrite||options.failHandler)return {status:'rejected',reason:options.failWrite?'mock-write-failed':'mock-handler-failed'};memory.owner=structuredClone(r.owner);return r;}
export function mutantsSummary(){return ['I','T','C','U','M'].map(kind=>{const m=mutantCase(kind),c=mutantCase(kind,true);return {kind,mutant:classify(runPlanner(m.case),m.profile),control:classify(runPlanner(c.case),c.profile)};});}
