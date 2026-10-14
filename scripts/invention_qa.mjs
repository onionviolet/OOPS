/** Synthetic fixtures only. All artifacts remain in the selected lane. */
import {readFileSync,writeFileSync,mkdirSync,realpathSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {spawn} from 'node:child_process';
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {performance} from 'node:perf_hooks';
import {inventionPackHome,homeWorld,magicWorld} from '../src/data/invention_pack_home.js';
import {runPlanner,QA_LIMITS,deterministicManifest,canonicalJSON,digest} from '../src/invention_qa.js';
import {lintInventionContent} from '../src/invention_danger_lint.js';
import {captureRoadmap,encodeReceipts,decodeReceipts,receiptQueries} from '../src/invention_receipts.js';
import {generatedCases,validateGenerated,matrixCases,mutantsSummary,hashFile,adversarialCase,goldenBundle,receiptInput,resolverV1,pi9Input} from '../tests/helpers/invention_qa.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const fixture='tests/fixtures/invention_qa/v1/';
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.ceil(p*values.length)-1];
function benchmark(){const results=[],baseHeap=process.memoryUsage().heapUsed;let observedPeakHeap=baseHeap;
    for(const size of [64,256,1024])for(const shape of ['long-chain','wide-and','many-or','diamond','scc-exit','hostile-chain'])for(const density of ['sparse','4096-entries']){
        const c=adversarialCase(shape,{size});if(density==='4096-entries')for(let i=c.pack.functions.length+c.pack.methods.length+c.pack.primitives.length;i<4096;i++)c.pack.primitives.push({id:`unused.${i}`,label:'Synthetic unused'});
        const expanded=runPlanner({...c,phase:'expand'}),graph=expanded.value;
        for(const phase of ['expand','compose','feasibility','view','estimate','five-api-bundle']){
            const call=()=>{if(phase==='five-api-bundle')return ['expand','compose','feasibility','view','estimate'].map(p=>runPlanner(['expand','compose'].includes(p)?{...c,phase:p,...(p==='compose'?{other:c.target}:{})}:{...(graph?{graph,world:c.world}:c),phase:p,knowledge:Object.fromEntries((graph?.nodes??[]).map(n=>[n.id,5]))}));
                return [runPlanner(['expand','compose'].includes(phase)?{...c,phase,...(phase==='compose'?{other:c.target}:{})}:{...(graph?{graph,world:c.world}:c),phase,knowledge:Object.fromEntries((graph?.nodes??[]).map(n=>[n.id,5]))})];};
            for(let i=0;i<10;i++){call();process.stdout.write('T16_CALL_DONE\n');}const timings=[],operations=[],statuses=new Set();
            for(let i=0;i<100;i++){const start=performance.now(),r=call();timings.push(performance.now()-start);process.stdout.write('T16_CALL_DONE\n');operations.push(r.reduce((n,x)=>n+(x.counters?.total??0),0));r.forEach(x=>statuses.add(x.status));observedPeakHeap=Math.max(observedPeakHeap,process.memoryUsage().heapUsed);}
            const p95=percentile(timings,.95),target=phase==='five-api-bundle'?500:size===1024?200:50;
            results.push({caseId:`bench.${shape}.${size}.${density}.${phase}`,fixtureDigest:deterministicManifest(c).digest,shape,requestedNodes:size,reachedNodes:graph?.nodes.length??null,catalogEntries:c.pack.functions.length+c.pack.methods.length+c.pack.primitives.length,phase,statuses:[...statuses].sort(),samples:100,warmups:10,medianMs:percentile(timings,.5),p95Ms:p95,maxMs:Math.max(...timings),operationMedian:graph?percentile(operations,.5):null,operationMax:graph?Math.max(...operations):null,countersCoverage:graph?'admitted-calls':'refused-preflight',targetMs:target,timingDisposition:p95<=target?'PASS':'REVIEW',admission:graph?'admitted':'censored'});
        }
    }
    const retention=[];let owner;for(let i=0;i<128;i++){const r=captureRoadmap({...receiptInput('lamp',`project.${i}`),...(owner?{owner}:{})});if(r.status!=='ok')throw Error('retention-failed');owner=r.owner;if([0,31,127].includes(i)){const text=encodeReceipts(owner);retention.push({projects:i+1,bundles:owner.bundles.length,utf8Bytes:Buffer.byteLength(text),utf16Units:text.length});}}
    return {status:'ok',results,retention,baseHeapBytes:baseHeap,observedPeakHeapBytes:observedPeakHeap,observedAddedHeapBytes:observedPeakHeap-baseHeap,heapMeasurement:'between-call observed peak plus external GC trace; transient peak is a review boundary',peakRssKiB:process.resourceUsage().maxRSS,concurrency:1,externalWorkloads:'none-authorized-by-T16',campaignDeadlineMs:300000,perCallDeadlineMs:2000};
}
function campaign(mode){const seeds=mode==='smoke'?[1,17,73,0xffffffff]:Array.from({length:32},(_,i)=>i+1),count=mode==='smoke'?250:2000,cases=generatedCases({seeds,count}),caseResults=[];
    for(const c of cases){const r=validateGenerated(c),replay=validateGenerated(structuredClone(c));if(canonicalJSON(r)!==canonicalJSON(replay))throw Error('nondeterministic');caseResults.push(r);if(!isMainThread)parentPort.postMessage({progress:true,caseId:c.id});}
    const matrix=matrixCases(),coverage=Object.fromEntries([...new Set(matrix.map(c=>c.status))].map(s=>[s,matrix.filter(c=>c.status===s).length]));
    const expected={'unsupported-target':120,'supported-solvable':4,'supported-unsolvable':4};if(canonicalJSON(coverage)!==canonicalJSON(expected))throw Error('matrix-mismatch');
    const mutants=mutantsSummary();if(mutants.some(m=>!m.mutant.some(f=>f.ruleId===`Z1.${m.kind}`)||m.control.length))throw Error('mutant-control-failed');
    const lintInput=read(fixture+'lint-input.json'),policy=read(fixture+'policy.json'),lint=lintInventionContent(lintInput,policy);if(lint.status!=='pass')throw Error('lint-admission-failed');
    const input=read(fixture+'input.json'),golden=read(fixture+'golden.json');if(canonicalJSON(goldenBundle(input))!==canonicalJSON(golden))throw Error('golden-drift');
    const r=captureRoadmap(receiptInput()),text=encodeReceipts(r.owner),restored=decodeReceipts(text,{resolverRegistry:resolverV1,currentPack:{id:'synthetic.v2'}});if(restored.status!=='ok'||canonicalJSON(receiptQueries(restored.owner))!==canonicalJSON(receiptQueries(r.owner)))throw Error('receipt-drift');
    const directIds=['alkali','glasswork','energy','coordinated-facilities','shared-theory','national-network','trained-teams','regional-production','learning-network','reliable-tools','standards','records'].map(target=>({caseId:`direct.${target}`,status:runPlanner({pack:inventionPackHome,world:homeWorld,target}).status}));
    return {status:'ok',mode,seeds,generated:{enumerated:count,attempted:caseResults.length,completed:caseResults.length,censored:0,exactReplay:true},matrix:{enumerated:128,attempted:128,completed:128,censored:0,coverage,cases:matrix.map(c=>({caseId:c.caseId,worldId:c.worldId,status:c.status}))},directIds,mutants,lint:{status:lint.status,scannedSurfaces:lint.scannedSurfaces.length,unscannedSurfaces:lint.unscannedSurfaces,coverage:lint.coverage},goldens:'PASS',receipts:'SOURCE_SYNTHETIC PASS',caseResults};
}
if(!isMainThread){parentPort.postMessage(campaign(workerData.mode));}
else if(process.argv.includes('--benchmark-child')){writeFileSync(resolve('docs/gm/dispatch/research-tech-2026-10-14/t9-build/benchmark-child.json'),canonicalJSON(benchmark())+'\n');console.log('T16_BENCHMARK_DONE');}
else {
    const args=process.argv.slice(2),arg=(k,f)=>args.includes(k)?args[args.indexOf(k)+1]:f,mode=arg('--mode','smoke');
    if(!['smoke','sweep','benchmark'].includes(mode))throw Error('Unknown mode');
    const lane=realpathSync('docs/gm/dispatch/research-tech-2026-10-14/t9-build'),output=resolve(arg('--output',`${lane}/${mode}.json`));
    if(relative(lane,output).startsWith('..')||!relative(lane,output))throw Error('Output outside lane');mkdirSync(dirname(output),{recursive:true});if(relative(lane,realpathSync(dirname(output))).startsWith('..'))throw Error('Output directory outside lane');
    const files=['src/invention_planner.js','src/invention_qa.js','src/invention_danger_lint.js','src/invention_receipts.js','src/data/invention_pack_home.js','tests/helpers/invention_qa.mjs','tests/helpers/invention_qa_worker.mjs','scripts/invention_qa.mjs',...['input.json','golden.json','manifest.json','policy.json','lint-input.json'].map(f=>fixture+f)];
    const manifest=deterministicManifest({mode,node:process.version,platform:process.platform,arch:process.arch,sourceDigests:Object.fromEntries(files.map(f=>[f,hashFile(f)])),packRevision:'T6-v1',packSemanticDigest:digest(inventionPackHome),worldSemanticDigests:{home:digest(homeWorld),magic:digest(magicWorld)},lawSemanticDigests:{home:digest(homeWorld.rules),magic:digest(magicWorld.rules)},policyRevision:'pi9.synthetic.1',limits:QA_LIMITS,isolation:{singleCallMs:2000,campaignMs:mode==='smoke'?60000:300000},seeds:mode==='sweep'?Array.from({length:32},(_,i)=>i+1):[1,17,73,0xffffffff],expectedCoverage:{cells:128,unsupported:120,solvable:4,unsolvable:4},consumerDisposition:'unbound-demo'});
    const start=performance.now();let result;
    if(mode==='benchmark')result=await new Promise(resolveResult=>{
        const child=spawn(process.execPath,['--trace-gc','--trace-gc-nvp',new URL(import.meta.url).pathname,'--benchmark-child'],{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';let callTimer=setTimeout(()=>{child.kill();},2000);const timer=setTimeout(()=>{child.kill();resolveResult({status:'timeout',diagnostic:'Z1.U'});},300000);
        child.stdout.on('data',b=>{stdout+=b;if(b.includes('T16_CALL_DONE')){clearTimeout(callTimer);callTimer=setTimeout(()=>child.kill(),2000);}});child.stderr.on('data',b=>stderr+=b);child.on('error',()=>{clearTimeout(timer);resolveResult({status:'crash'});});child.on('close',code=>{clearTimeout(timer);clearTimeout(callTimer);const lines=stdout.trim().split('\n');if(code||!stdout.includes('T16_BENCHMARK_DONE')){resolveResult({status:'crash',exitCode:code});return;}
            let r;try{r=read(resolve(lane,'benchmark-child.json'));}catch{resolveResult({status:'crash',diagnostic:'benchmark-capture-failed'});return;}const gcPeaks=[...stdout.matchAll(/total_size_before=(\d+)/g)].map(m=>Number(m[1]));r.gcObservedPeakHeapBytes=gcPeaks.length?Math.max(...gcPeaks):null;
            writeFileSync(resolve(lane,'benchmark-gc.log'),lines.filter(s=>!s.startsWith('{"')&&!s.startsWith('T16_CALL_DONE')).join('\n')+'\n'+stderr);resolveResult(r);});});
    else result=await new Promise(resolveResult=>{const w=new Worker(new URL(import.meta.url),{workerData:{mode}});let done=false;let callTimer=setTimeout(()=>finish({status:'timeout',diagnostic:'Z1.U',coverage:'censored'}),2000);const finish=r=>{if(done)return;done=true;clearTimeout(timer);clearTimeout(callTimer);w.terminate();resolveResult(r);};const timer=setTimeout(()=>finish({status:'timeout',diagnostic:'Z1.U',coverage:'censored'}),mode==='smoke'?60000:300000);w.on('message',r=>{if(r.progress){clearTimeout(callTimer);callTimer=setTimeout(()=>finish({status:'timeout',diagnostic:'Z1.U',coverage:'censored'}),2000);}else finish(r);});w.once('error',()=>finish({status:'crash',diagnostic:'QA-worker-failed'}));w.once('exit',()=>{if(!done)finish({status:'crash'});});});
    writeFileSync(output,canonicalJSON({manifest,elapsedMs:performance.now()-start,...result})+'\n');console.log(canonicalJSON({mode,status:result.status,completed:result.generated?.completed,artifact:relative(process.cwd(),output)}));if(result.status!=='ok')process.exitCode=1;
}
