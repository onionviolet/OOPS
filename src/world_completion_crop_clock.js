import {statusCareSupportedBody} from './status_care_facts.js';
const ids=new Set(['world.completion.materials.cover_offcuts','world.completion.materials.cover_measured']);
export function hasWorldCompletionCropReservation(state){return state.simulation?.schema>=5&&state.simulation.jobs.some(j=>ids.has(j.commandId));}
// Old crop policies remain unchanged. Only a new accepted cover holds this
// same warning while its declared native-body clock is unsupported.
export function worldCompletionCropClockSupported(state,context={}){
    return !hasWorldCompletionCropReservation(state)||statusCareSupportedBody(state,context);
}
export function retainWorldCompletionCropBodyClock(state,from,through,context={}){
    if(through<=from||state.actors?.player?.worldId!=='base.frontier'||worldCompletionCropClockSupported(state,context))return;
    for(const c of Object.values(state.simulation.checks))if(['remainder_consequences.frost_warning','remainder_consequences.frost_settlement'].includes(c.definitionId))c.due+=through-from;
}
