// The existing exact descriptor validator, separated from the runtime host so
// static definitions/import readers do not initialize the entire executor.
// Behavior and frozen causal revision meanings are unchanged.
import {check, object} from './basics.js';
import {CAUSAL_STORY_ENGINE_SCHEMA,CAUSAL_STORY_DEFINITION_REVISION,CAUSAL_STORY_LOCATION as LOCATION,
    CAUSAL_STORY_PEOPLE as P,causalStoryId} from './causal_story_ids.js';
import {causalStoryDefinitions} from './causal_story_content.js';
export function validateCausalStoryJob(job,state,registry) {
    if(job.causalStory==null) return true; // Full causal validation rejects a saved missing descriptor.
    const d=job.causalStory,p=d.proofId;
    check(state.schema===CAUSAL_STORY_ENGINE_SCHEMA && state.causalStories && object(d) &&
        Object.keys(d).length===4 && d.schema===1 && d.policyRevision===1 && d.operation==='sever' && ['covenant','anchor'].includes(p) &&
        state.causalStories.proofs[p] && job.commandId===causalStoryId(p,'sever_job') && job.actorId==='player' && job.targetId===P[p] &&
        job.revision===CAUSAL_STORY_DEFINITION_REVISION && job.reservationReturns===1 && job.cancellation==='refund' &&
        job.effects.length===0 && job.siteId==='causal.story.research' && job.participants.includes(P.keeper) && job.participants.includes(P[p]) &&
        job.completionSupport?.failure==='refund' && registry?.commands?.has(job.commandId)!==false,'Unsupported timed causal operation.');
    const expected=causalStoryDefinitions.commands.find(c=>c.id===job.commandId);
    check(expected && JSON.stringify(job.costs)===JSON.stringify(expected.costs) &&
        JSON.stringify(job.completionSupport.requires)===JSON.stringify(expected.completionRequires) &&
        job.completionSupport.coLocated===true && job.completionSupport.location===LOCATION,
        'Causal counter payment or current completion policy differs from its supported authored revision.');
    return true;
}
