import {bodyFacts} from './body_progression.js';
import {techniqueFacts} from './techniques.js';

const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'}),rope=JSON.stringify({id:'Survey rope'});
// Recompute demanded current support inside the executor, including scheduler
// callers. A rendered or earlier quote cannot supply an actor's later consent.
export function originalFrontierFacts(state,context,registry) {
    const f={...bodyFacts(state)}, s=state.simulation, actor=state.actors[context.actorId || 'player'];
    const person=s?.people[context.actorId || 'player'], target=s?.people[context.targetId], ta=state.actors[context.targetId];
    const stock=context.gameplay?.player?.inventory || {};
    for(const [id,level] of Object.entries(context.nativeSkillLevels || {})) f[`native.skill.${id}.level`]=level;
    if(registry)Object.assign(f,techniqueFacts(actor,registry,context));
    f['originalFrontier.playerHandsUsable']=(s?.people.player?.body?.hands ?? 2)>=2&&!f['body.handsTender'];
    f['originalFrontier.unloadedBody']=!(stock[wood]||stock[kit]);
    f['originalFrontier.fieldParticipantSupported']=!!target&&target.life==='alive'&&ta?.worldId===actor.worldId&&
        target.location===(context.facts?.location||person?.location)&&(target.body?.hands||0)>=2&&target.vitals?.health>1&&
        ta.facts['original_frontier.control.willing']===true&&(s.owners[context.targetId]?.[rope]||0)>=1&&
        !Object.values(s.custody || {}).some(c=>c.holder===context.targetId&&c.key===rope);
    f['originalFrontier.frameKitAvailable']=!!target&&(s.owners[context.targetId]?.[kit]||0)>0&&!Object.values(s.custody || {}).some(c=>c.holder===context.targetId&&c.key===kit);
    const mira=s?.people['original_frontier.mira'], ma=state.actors['original_frontier.mira'];
    f['originalFrontier.homeParticipantSupported']=!!mira&&mira.life==='alive'&&ma?.worldId===actor.worldId&&mira.location==='Village'&&
        (mira.body?.hands||0)>=2&&mira.vitals?.health>1&&ma.facts['original_frontier.masteryTrialWilling']===true;
    const ef=state.actors.player.facts;
    const held=context.frontierContribution || s?.jobs.find(j=>j.actorId==='player'&&j.frontierContribution)?.frontierContribution;
    const reserved=held?.schema===1&&held.zone===ef['original_frontier.control.encounterZone']&&held.parent===ef['original_frontier.control.encounterParent']&&
        held.baseline===ef['original_frontier.control.encounterBaseline']&&held.count===ef['original_frontier.control.encounterCount']&&held.at===ef['original_frontier.control.encounterAt'];
    const expectedParent={'original_frontier.nea':'Forest road','original_frontier.iver':'Nearby cave'}[context.targetId];
    f['originalFrontier.nativeEncounterAccepted']=ef['original_frontier.control.encounterAccepted']===true;
    f['originalFrontier.nativeEncounterReady']=ef['original_frontier.control.encounterReady']===true&&(!ef['original_frontier.control.encounterConsumed']||reserved)&&
        (!expectedParent||expectedParent===ef['original_frontier.control.encounterParent']);
    f['originalFrontier.nativeEncounterAvailable']=!ef['original_frontier.control.encounterAccepted']||ef['original_frontier.control.encounterConsumed']===true;
    f['originalFrontier.clockSupported']=state.actors.player.worldId==='base.frontier'&&!state.realmPrototype?.activeVisitId;
    return f;
}

// Unsupported realm absence freezes this unaccepted local response window.
// Accepted prepaid work retains its frozen common-clock completion.
export function retainOriginalFrontierWindow(state,from,through){
    const situation=state.simulation?.situations?.['original_frontier.short_measure'];
    if(state.actors.player.worldId!=='base.frontier'&&situation?.phase==='posted'&&situation.deadline>from)situation.deadline+=through-from;
}
