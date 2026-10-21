// Selected author path, not a second pack schema or an execution capability list.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {beginStructuredCampaign,planStructuredSelection} from '../src/structured_pack_runtime.js';
import {validateSimulationEffect} from '../src/simulation_contracts.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {loadWorldPacks} from '../src/world_pack_loader.js';
import {createScenarioFacade} from '../src/scenario_facade.js';
import {workshop} from '../tests/fixtures/deep_engine_authoring/workshop.mjs';

const hash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function authorInstance(raw) {
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
    const compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
    // Same content/snapshot identity calculation used by native pack admission.
    const definition={...compiled.definition,contentHash:hash(raw),...(raw.starts?{starts:raw.starts.map(b=>{
        const snapshot={...b};delete snapshot.snapshotHash;return {...b,snapshotHash:hash(snapshot)};
    })}:{})};
    const context={registry,actorId:'player',worldId:'base.frontier',external:{money:100},
        gameplay:{player:{inventory:{},skills:{},reputation:{}}},
        vitals:{player:{health:20,max_health:20,stamina:10,max_stamina:20}},
        facts:{location:definition.locations[0].id},nativeBody:{id:'native.player.body',form:'human',ownerId:'player',controllerId:'player'},
        nativeReady:true,nativeAlive:true,busy:false};
    const initial=createExpansionState(11);
    const selected=raw.starts?planStructuredSelection(initial,definition,context):null;
    const begun=beginStructuredCampaign(selected?.plan.state||initial,definition,context,null,selected?.selection);
    return {registry,definition,context:{...context,worldId:definition.world.id},...begun};
}

// Synthetic native adapter inputs are explicit. The real command/effect reader
// owns all costs, caps, jobs and results. No reducer or saved string is evaluated.
export async function probeCommand(raw,id) {
    const f=authorInstance(raw);let current=f.plan;
    const context=()=>({...f.context,external:current.external,gameplay:current.gameplay,vitals:current.vitals});
    const read=()=>({money:current.external.money,stamina:current.vitals?.player?.stamina,
        jobs:current.state.simulation.jobs.map(j=>({commandId:j.commandId,revision:j.revision,due:j.due}))});
    const scenario=createScenarioFacade({identity:{packId:raw.id,revision:raw.revision,contentHash:f.definition.contentHash},
        quote:()=>previewSimulationCommand(current.state,f.registry,id,context()),
        execute:()=>{current=commitSimulationCommand(current.state,f.registry,{id},context());},
        inspect:read,advance:minutes=>{const next=advanceSimulation(current.state,f.registry,minutes,current.external,current.gameplay,
            {player:{...context(),vitals:current.vitals.player}});
            next.vitals??=structuredClone(current.vitals);
            for(const [deficit,key] of [['staminaToFull','stamina'],['hpToFull','health']])
                if(next.native?.[deficit]!=null)next.vitals.player[key]=next.vitals.player['max_'+key]-next.native[deficit];
            current=next;},
        // Probe has no persistence authority. Native verification exercises the
        // game's real persistence separately; never label this a save test.
        persistence:Object.fromEntries(['save','load','reload','exportFile','importFile'].map(k=>[k,()=>{throw Error('Use the native persistence journey.');}]))});
    const q=await scenario.quote({id});
    if(!q.value.eligible)return {status:'dormant',reason:q.value.reasons,coverage:'supported',nativeConnected:false};
    const execution=await scenario.execute(q);
    if(execution.status==='rejected')throw Error(execution.error.message);
    const duration=f.registry.simulation.commands.get(id).duration||0;
    const completion=duration?await scenario.advance(duration):null;
    if(completion?.status==='rejected')throw Error(completion.error.message);
    return {status:'executable',coverage:'supported',nativeConnected:false,execution,completion};
}

export async function checkContentAuthoring(raw,{source='<memory>',execute=true}={}) {
    const report={source,packId:raw?.id,revision:raw?.revision,diagnostics:[],commands:[],
        coverage:'unvalidated',nativeConnected:false,
        limits:'Executable probes use synthetic native adapter inputs, not a playable or browser verdict. References and other families retain their own validators.'};
    const problem=(path,code,error,subjectId=raw?.id)=>report.diagnostics.push({severity:'error',source,path,subjectId,code,message:error.message});
    // Reuse dormant-record diagnostics, including unsupported slot readers.
    let definition=raw;
    if(raw?.format==='yairpg.world-pack') {
        const registry=loadWorldPacks([raw]);
        report.diagnostics.push(...registry.diagnostics.map(d=>({...d,source,path:d.subjectId?`content/${d.subjectId}`:'/',})));
        definition=registry.packs.get(raw.id)?.pack.native;
        report.dormant=[...registry.dormantPacks,...[...registry.packs.values()].flatMap(p=>[...p.dormant])];
        report.coverage=definition?'catalogued':'dormant';
        if(!definition)return report;
    }
    // Contextualize existing validator errors without a duplicated operation set.
    function effects(value,path='$',subjectId=definition?.id) {
        if(!value||typeof value!=='object')return;
        if(value.id)subjectId=value.id;
        for(const [key,child] of Object.entries(value)) {
            const next=`${path}.${key}`;
            if(['effects','costs','onTick','onExpire','onComplete','settlement'].includes(key)&&Array.isArray(child))
                child.forEach((e,i)=>{try{validateSimulationEffect(e);}catch(error){problem(`${next}[${i}]`,'effect-invalid',error,subjectId);}});
            effects(child,next,subjectId);
        }
    }
    effects(definition);
    if(report.diagnostics.some(d=>d.severity==='error'))return report;
    try {compileStructuredPack(definition);report.coverage='supported';}
    catch(error){problem('$','definition-invalid',error);return report;}
    for(const [i,row] of (definition.simulation.commands||[]).entries()) {
        const path=`$.simulation.commands[${i}]`;
        try {
            const result=execute?await probeCommand(definition,row.id):{status:'supported',nativeConnected:false};
            report.commands.push({id:row.id,path,...result});
            if(result.status==='dormant')problem(path,'consumer-dormant',Error(result.reason.join(' ')),row.id);
        }
        catch(error){problem(path,'consumer-refused',error,row.id);}
    }
    return report;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
    const args=process.argv.slice(2),file=args.find(a=>!a.startsWith('--'));
    if(args.includes('--help'))console.log('node scripts/check_content_authoring.mjs [pack.json] [--validate-only]\nDefault: original synthetic workshop. Native proof: see P5_EVIDENCE/verify-native.mjs.');
    else {
        try {
            const raw=file?JSON.parse(await readFile(file,'utf8')):workshop();
            const report=await checkContentAuthoring(raw,{source:file||'tests/fixtures/deep_engine_authoring/workshop.mjs',execute:!args.includes('--validate-only')});
            console.log(JSON.stringify(report,null,2));
            if(report.diagnostics.some(d=>d.severity==='error'))process.exitCode=1;
        }catch(error){console.error(JSON.stringify({source:file,code:'author-input',message:error.message}));process.exitCode=1;}
    }
}
