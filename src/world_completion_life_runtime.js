import {check} from './basics.js';
import {WORLD_COMPLETION_LIFE_IDS as I,worldCompletionLifeDefinitions as D,worldCompletionLifeFrozenDefinition} from './world_completion_life_content.js';
import {worldCompletionEnrolled,exactWorldCompletionLifeJob} from './world_completion_life_facts.js';
import {worldCompletionBridgeContext,worldCompletionDrainEffects} from './world_completion_bridge.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';
export function worldCompletionLifeRuntimeRegistry(state,registry,context={}){
    const original=registry.simulation.commands.get(I.measuredLine),key=context.facts?.['worldCompletion.measuredStripKey'];
    if(!original||!worldCompletionStripStamp(key))return registry;
    const commands=new Map(registry.simulation.commands);commands.set(I.measuredLine,worldCompletionLifeFrozenDefinition(original,key));
    return {...registry,simulation:{...registry.simulation,commands}};
}
export function stampWorldCompletionLifeJob(state,job,context={}){
    const d=D.commands.find(d=>d.id===job?.commandId);if(!d?.duration)return;
    const measured=d.id===I.measuredLine,m={schema:1,acceptedAt:state.clock,pausedMinutes:0,bodyId:context.nativeBody?.id,
        sampleCause:measured?context.facts?.['worldCompletion.sampleCause']:null,
        measuredCause:measured?context.facts?.['worldCompletion.measuredCause']:null,
        stripKey:measured?context.facts?.['worldCompletion.measuredStripKey']:null};
    job.worldCompletionLife=m;check(exactWorldCompletionLifeJob(state,job),'Accept only the exact supported chapter work and physical strip.');
}
export function retainWorldCompletionLifeWindows(state,from,through,contexts={}){
    if(!worldCompletionEnrolled(state)||through<=from)return;
    const context=contexts.player||contexts,current=worldCompletionBridgeContext(state,context);
    for(const job of state.simulation.jobs.filter(j=>j.commandId.startsWith(I.prefix+'life.'))){
        check(exactWorldCompletionLifeJob(state,job),'Retain only the actual frozen chapter job.');
        if(current.facts['worldCompletion.local']&&current.facts['worldCompletion.supportedBody']&&job.worldCompletionLife.bodyId===context.nativeBody?.id)continue;
        job.due+=through-from;job.worldCompletionLife.pausedMinutes+=through-from;
    }
}
export function recordWorldCompletionLifeCompletion(out,job,registry,context={},applyEffects){
    if(![I.loadedDrain,I.measuredLine].includes(job.commandId))return;
    check(exactWorldCompletionLifeJob(out.state,job)&&out.state.actors.player.completed[job.commandId]===1,
        'Apply a drain result only after the exact successful paid chapter work.');
    const operation=job.commandId===I.loadedDrain?'loaded':'measured',key=I.prefix+'life.'+(operation==='loaded'?'loadedDrainApplied':'measuredLineApplied');
    check(!out.state.actors.player.facts[key],'This drain result is already applied.');
    check(typeof applyEffects==='function','Use the existing shared effect publisher for the drain result.');
    const current=worldCompletionBridgeContext(out.state,{...context,actorId:'player',external:out.external,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment});
    applyEffects(out,[...worldCompletionDrainEffects(out.state,current,operation),{type:'fact',scope:'actor',actor:'player',key,value:true}],current,registry,job.id);
}
