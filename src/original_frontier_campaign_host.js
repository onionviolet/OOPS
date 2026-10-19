import {check} from './basics.js';
import {ORIGINAL_FRONTIER_IDS, originalFrontierEpisodeView, originalFrontierQuestView} from './original_frontier_campaign_content.js';
import {enrollSimulation, commitSimulationCommand, previewSimulationCommand, simulationFacts, previewSimulationResponse} from './simulation.js';
import {meets} from './simulation_contracts.js';
import {originalFrontierFacts} from './original_frontier_facts.js';
import {featureLegibilityRow, featureActionDisclosure} from './feature_expansion_legibility.js';
import {projectAcceptedWorkLegibility, projectSimulationAftermath} from './action_legibility.js';

const encounterPrefix = 'original_frontier.control.encounter';
const acceptedZones = {original_frontier_accept_cave: ['Cave room','Nearby cave'], original_frontier_accept_forest: ['Forest','Forest road']};
const acceptance = id => acceptedZones[id.replaceAll('.','_')];

// Plain native queries are supplied by main, never learned or initialized here.
export function originalFrontierContext(state, registry, context) {
    return {...context,facts:{...context.facts,...originalFrontierFacts(state,context,registry)}};
}

export function beginOriginalFrontier(state, registry, context, expectedSequence = state.sequence) {
    check(state.sequence === expectedSequence, 'This meeting is stale.');
    const enrolled = state.simulation ? {state, ...context} : enrollSimulation(state, registry, context, expectedSequence);
    // Opening costs nothing. Enrollment and explicit actor/stock opening share
    // one final persistExpansion call, including earlier enrollment effects.
    const next = commitSimulationCommand(enrolled.state, registry, {id:ORIGINAL_FRONTIER_IDS.begin},
        originalFrontierContext(enrolled.state, registry, {...context, external:enrolled.external, gameplay:enrolled.gameplay, vitals:enrolled.vitals || context.vitals}), enrolled.state.sequence);
    next.acquisitions = [...(enrolled.acquisitions || []), ...next.acquisitions];
    next.unlocks = [...(enrolled.unlocks || []), ...next.unlocks];
    return next;
}

export function commitOriginalFrontier(state, registry, command, context, expectedSequence = state.sequence) {
    const definition = registry.simulation.commands.get(command.id);
    check(definition?.group === 'original_frontier' && definition.actorId === 'player', 'Unsupported Frontier action.');
    check(!(state.actors.player.facts['original_frontier.travel.remaining']>0), 'Finish or cancel the remaining native journey first.');
    context = originalFrontierContext(state, registry, {...context,targetId:command.targetId || definition.targetId || null});
    const selected = acceptance(command.id);
    if(selected) check(context.facts[`native.zone.${selected[0]}.accessible`] && Number.isSafeInteger(context.nativeZoneCounts?.[selected[0]]), 'That native encounter is not currently accessible.');
    const out = commitSimulationCommand(state, registry, command, context, expectedSequence), f = out.state.actors.player.facts;
    if(selected) {
        check(!f[`${encounterPrefix}Ready`] || f[`${encounterPrefix}Consumed`], 'Use or release the previous encounter contribution first.');
        Object.assign(f,{[`${encounterPrefix}Zone`]:selected[0],[`${encounterPrefix}Parent`]:selected[1],
            [`${encounterPrefix}Baseline`]:context.nativeZoneCounts[selected[0]],[`${encounterPrefix}AcceptedAt`]:state.clock,
            [`${encounterPrefix}Accepted`]:true,[`${encounterPrefix}Ready`]:false,[`${encounterPrefix}Consumed`]:false});
    }
    if(['original_frontier.work_cave_protected','original_frontier.work_forest_protected'].includes(command.id)) {
        check(f[`${encounterPrefix}Ready`] && !f[`${encounterPrefix}Consumed`] && context.facts.location === f[`${encounterPrefix}Parent`], 'Return to the accepted safe parent with a new encounter contribution.');
        const job=out.state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId===command.id);
        check(job,'The contribution requires an accepted protected work commitment.');
        job.frontierContribution={schema:1,zone:f[`${encounterPrefix}Zone`],parent:f[`${encounterPrefix}Parent`],
            baseline:f[`${encounterPrefix}Baseline`],count:f[`${encounterPrefix}Count`],at:f[`${encounterPrefix}At`]};
        out.commitment=structuredClone(job);
        f[`${encounterPrefix}Consumed`] = true;
    }
    return out;
}

export function originalFrontierCareerQuestView(state){
    const f=state.actors.player.facts;
    if(!f['original_frontier.charter.signed'])return null;
    const closed=f['original_frontier.charter.settled']||f['original_frontier.charter.terminated'];
    return {id:'original_frontier.return_charter',name:'Return-lot terms',description:'Only individually accepted funded jobs reserve work. Signing did not promise all four orders.',
        objective:closed?'The chosen jobs and future quotes are settled. Keep your tested practice, arrange a funded handoff or make an actual native journey.':'Choose a known funded order, finish or cancel current work, then settle the chosen jobs or terminate under the disclosed terms.',completed:!!closed};
}

// Called only by the native victory callback, before its counter is published.
// The new count and this contribution are saved together. Native loot/XP stays
// under its existing owner; this callback awards neither.
export function recordOriginalFrontierEncounter(state, context, zoneId, nextCount) {
    const f = state.actors.player.facts;
    if(!f[`${encounterPrefix}Accepted`] || f[`${encounterPrefix}Ready`] || f[`${encounterPrefix}Consumed`] ||
        f[`${encounterPrefix}Zone`] !== zoneId || nextCount <= f[`${encounterPrefix}Baseline`]) return null;
    const out = {state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),acquisitions:[],unlocks:[]};
    const cause = `native-frontier:${++out.state.sequence}`, facts = out.state.actors.player.facts;
    Object.assign(facts,{[`${encounterPrefix}Ready`]:true,[`${encounterPrefix}Count`]:nextCount,[`${encounterPrefix}At`]:state.clock});
    out.state.simulation.knowledge.player ||= {};
    out.state.simulation.knowledge.player['original_frontier.control.native_result'] = {stage:'seen',value:`You completed the accepted new encounter in ${zoneId}. Return to ${f[`${encounterPrefix}Parent`]} before consenting to one supervised edge observation. This does not clear the whole zone.`,at:state.clock,cause};
    out.nativePatch = {[`locations/${zoneId}/enemy_groups_killed`]:nextCount};
    return out;
}

export function originalFrontierPresentation(state, registry, context) {
    context = originalFrontierContext(state, registry, context);
    const episode = originalFrontierEpisodeView(state), s = state.simulation, a = state.actors.player;
    const canBegin = !episode.introduced && !context.busy && context.facts['village.elderMet'] && context.facts['originalFrontier.townAccessible'] && context.facts.location === 'Village';
    const job = s?.jobs.find(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === 'original_frontier');
    const savedProgram = s?.programs.player, program = savedProgram && registry.simulation.commands.get(savedProgram.commandId)?.group === 'original_frontier' ? {...savedProgram} : null;
    const session = s?.sessions.player, active = session && registry.simulation.commands.get(session.commandId)?.group === 'original_frontier' ? session : null;
    const actions = [];
    if(episode.introduced) for(const d of registry.simulation.commands.values()) {
        if(d.group !== 'original_frontier' || d.actorId !== 'player' || d.id === ORIGINAL_FRONTIER_IDS.begin || d.once && a.completed[d.id] || d.claim && s.claims[d.claim]) continue;
        const ctx = originalFrontierContext(state,registry,{...context,targetId:d.targetId || null});
        if(!meets(d.visibleWhen, simulationFacts(state,ctx,registry))) continue;
        const p = previewSimulationCommand(state,registry,d.id,{...ctx,busy:ctx.busy || a.facts['original_frontier.travel.remaining']>0});
        if(!p.visible) continue;
        const legibility=featureLegibilityRow(state,registry,ctx,d.id,p);
        actions.push({id:d.id,label:d.label,description:d.description || '',targetId:d.targetId || null,eligible:p.eligible,legibility,
            reasons:legibility?.blockers?.map(r=>r.text) || p.reasons,duration:p.duration,cancellation:d.cancellation || 'none',automatable:!!d.automatable});
    }
    // Only the player's retained ledger qualifies an account. No pending job
    // outcome or private NPC state is inspected to explain its cause.
    const aftermath = projectSimulationAftermath({state,observerId:'player',prefix:'original_frontier.'});
    const records = aftermath;
    const workDefinition = job && registry.simulation.commands.get(job.commandId);
    const workContext = job ? {...context,targetId:job.targetId || null} : context;
    const workLegibility = job ? projectAcceptedWorkLegibility({job,clock:state.clock,
        label:workDefinition?.label || 'Your accepted local work',context:workContext,
        disclosure:workDefinition?.revision === job.revision ? featureActionDisclosure(state,registry,workContext,workDefinition) : {}})
        : a.facts['original_frontier.travel.remaining']>0 ? projectAcceptedWorkLegibility({
            job:{id:'native-journey',actorId:'player',due:state.clock+a.facts['original_frontier.travel.remaining'],costs:[],cancellation:'forfeit'},
            clock:state.clock,label:`Journey to ${a.facts['original_frontier.travel.to']}`,context}) : null;
    const quest = originalFrontierCareerQuestView(state) || originalFrontierQuestView(state);
    const contestContext=active?originalFrontierContext(state,registry,{...context,targetId:active.targetId}):context;
    const contest = active ? {cue:active.turns[active.turn].cue,responses:active.turns[active.turn].responses.filter(r=>meets(r.visibleWhen,simulationFacts(state,contestContext,registry))).map(r => {
        const p = previewSimulationResponse(state,registry,{kind:'encounter',responseId:r.id},contestContext);
        return {id:r.id,label:r.label,eligible:p.eligible,reasons:p.eligible ? [] : ['Your current source, effort or support does not allow this response.']};
    })} : null;
    return {visible:!!(canBegin || episode.introduced || job || active),canBegin,actions,records,aftermath,workLegibility,contest,program,
        work:job ? {id:job.id,label:registry.simulation.commands.get(job.commandId)?.label || job.label,remainingMinutes:Math.max(0,job.due-state.clock),cancellation:job.cancellation} : a.facts['original_frontier.travel.remaining']>0 ? {id:'native-journey',label:`Journey to ${a.facts['original_frontier.travel.to']}`,remainingMinutes:a.facts['original_frontier.travel.remaining'],cancellation:'forfeit'} : null,
        quest:quest ? {label:quest.name,stage:quest.completed ? 'Recorded result retained' : 'Chosen local work',details:quest.objective} : null};
}
