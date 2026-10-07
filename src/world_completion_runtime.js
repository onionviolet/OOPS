import {worldCompletionContext,worldCompletionNativeContext} from './world_completion_facts.js';
import {worldCompletionEnrolled} from './world_completion_life_facts.js';
import {stampWorldCompletionLifeJob,retainWorldCompletionLifeWindows,recordWorldCompletionLifeCompletion} from './world_completion_life_runtime.js';
import {worldCompletionLensClockSupported} from './world_completion_lens_facts.js';
import {recordWorldCompletionLensJobCompletion,retainWorldCompletionLensWindow,nextWorldCompletionLensBoundary,advanceWorldCompletionLensBoundary} from './world_completion_lens_runtime.js';
import {freezeWorldCompletionLearningJob,completeWorldCompletionLearningJob,installWorldCompletionLearningControllers,retainWorldCompletionLearningWindow,worldCompletionLearningSimulationContexts} from './world_completion_learning_runtime.js';
import {retainWorldCompletionMaterialsWindows,reconcileWorldCompletionMaterials} from './world_completion_materials_runtime.js';
import {retainWorldCompletionCropBodyClock} from './world_completion_crop_clock.js';
const family=id=>id?.startsWith('world.completion.');
export function worldCompletionTimersSupported(state,contexts={}){
    if(!worldCompletionEnrolled(state))return true;
    return worldCompletionLensClockSupported(state,worldCompletionNativeContext(state,contexts.player||contexts))&&
        !state.featureDestination?.activeVisitId&&!state.nestedCampaign?.activeVisitId&&!state.bookWorldCampaign?.activeVisitId;
}
export function worldCompletionSimulationContexts(state,contexts={}){
    const joined=worldCompletionLearningSimulationContexts(state,contexts),result={...joined};
    for(const [id,source] of Object.entries(joined)){
        const normalized=worldCompletionContext(state,{...joined.player,...source,actorId:id,
            nativeBody:source.nativeBody||joined.player?.nativeBody,nativeAlive:source.nativeAlive??joined.player?.nativeAlive,
            facts:{...joined.player?.facts,...source.facts}});
        // Preserve flat native actor vitals for the incumbent initial snapshot.
        result[id]={...source,actorId:id,nativeBody:normalized.nativeBody,nativeAlive:normalized.nativeAlive,
            nativeCareFrame:source.nativeCareFrame||joined.player?.nativeCareFrame,facts:normalized.facts};
    }
    return result;
}
export function worldCompletionJobContext(state,job,context={}){
    return worldCompletionContext(state,{...context,actorId:job.actorId,targetId:job.targetId,
        ...(job.commandId.startsWith('world.completion.lens.')?{worldCompletionLensReservation:job}:{}),
        ...(job.commandId.startsWith('world.completion.learning.')?{worldCompletionLearningReservation:job}:{}),
        ...(job.commandId.startsWith('world.completion.materials.')?{worldCompletionMaterialsReservation:job}:{}),
        ...(job.commandId.startsWith('world.completion.life.')?{worldCompletionLifeReservation:job}:{})});
}
export function stampWorldCompletionAcceptedJob(state,job,context={}){
    if(job.commandId.startsWith('world.completion.learning.'))freezeWorldCompletionLearningJob(state,job,worldCompletionContext(state,context));
}
export function retainWorldCompletionWindows(state,from,through,contexts={}){
    if(!worldCompletionEnrolled(state)||through<=from)return;
    const player=worldCompletionContext(state,contexts.player||contexts);
    retainWorldCompletionLensWindow(state,from,through,player);
    retainWorldCompletionLearningWindow(state,from,through,player);
    retainWorldCompletionMaterialsWindows(state,from,through,{player});
    retainWorldCompletionLifeWindows(state,from,through,{player});
    retainWorldCompletionCropBodyClock(state,from,through,player);
}
export function nextWorldCompletionBoundary(state,contexts={}){
    if(!worldCompletionTimersSupported(state,contexts))return Infinity;
    const due=nextWorldCompletionLensBoundary(state,worldCompletionContext(state,contexts.player||contexts));
    return Number.isFinite(due)?due:Infinity;
}
export function recordWorldCompletionJobCompletion(before,out,job,registry,context,applyEffects){
    if(!family(job.commandId))return;
    if(job.commandId.startsWith('world.completion.lens.'))recordWorldCompletionLensJobCompletion(out,job,registry);
    if(job.commandId.startsWith('world.completion.learning.'))completeWorldCompletionLearningJob(out,job,registry,applyEffects);
    if(job.commandId.startsWith('world.completion.life.'))recordWorldCompletionLifeCompletion(out,job,registry,context,applyEffects);
    if(job.commandId.startsWith('world.completion.materials.')&&job.commandId==='world.completion.materials.discard'||
        job.commandId==='world.completion.materials.cover_offcuts'||job.commandId==='world.completion.materials.cover_measured'){
        const prior=before||{...out.state,simulation:{...out.state.simulation,jobs:[job]}};
        reconcileWorldCompletionMaterials(prior,out,registry,context,{drainEffects:()=>[{type:'world',worldId:'base.frontier',key:'lore.warning.drainOpen',value:false}]});
    }
}
export function reconcileWorldCompletionPlan(out,registry,contexts={}){
    if(!worldCompletionEnrolled(out.state))return;
    installWorldCompletionLearningControllers(out.state,registry);
    advanceWorldCompletionLensBoundary(out,worldCompletionContext(out.state,{...contexts.player||contexts,
        external:out.external,gameplay:out.gameplay,vitals:out.vitals,equipment:out.equipment}));
}
