import {REPOSITORY_ABSORPTION_IDS as IDS, REPOSITORY_ABSORPTION_ITEMS as ITEMS} from './repository_absorption_content.js';
import {repositoryAbsorptionFacts} from './repository_absorption_facts.js';
import {repositoryMethodChainView} from './repository_absorption_chains.js';
import {enrollSimulation, commitSimulationCommand, cancelSimulationJob, previewSimulationCommand, simulationFacts} from './simulation.js';
import {assert, meets} from './simulation_contracts.js';
import {defineRepositoryWorkItinerary, previewRepositoryWorkItinerary, defineRepositoryStockBand, previewRepositoryStockBand} from './repository_absorption_workplan.js';

// Current authority is reread for both player commitments and scheduler calls.
// Private facts can gate offered actions; views never return private state.
export function repositoryAbsorptionContext(state, registry, context) {
    return {...context,facts:{...context.facts,...repositoryAbsorptionFacts(state,context)}};
}

function playerContext(state, registry, context, targetId=null) {
    assert(context.actorId === 'player', 'This action belongs to the native player.');
    return repositoryAbsorptionContext(state,registry,{...context,targetId});
}

// Enrollment and this explicit opening share one caller-owned durable write.
export function beginRepositoryAbsorption(state, registry, context, expectedSequence=state.sequence) {
    assert(expectedSequence === state.sequence, 'This courier meeting is stale.');
    context=playerContext(state,registry,context);
    assert(context.facts.location === 'Village' && context.facts['village.elderMet'] && context.facts['repositories.clockSupported'] && !context.busy,
        'Meet the courier at the Village after meeting its elder, with no activity in progress.');
    const previous=state.simulation?{state,...context}:enrollSimulation(state,registry,context,expectedSequence);
    const next=commitSimulationCommand(previous.state,registry,{id:IDS.begin},playerContext(previous.state,registry,
        {...context,external:previous.external,gameplay:previous.gameplay,vitals:previous.vitals || context.vitals,equipment:previous.equipment || context.equipment}),previous.state.sequence);
    next.acquisitions=[...(previous.acquisitions || []),...next.acquisitions];
    next.unlocks=[...(previous.unlocks || []),...next.unlocks];
    return next;
}

export function commitRepositoryAbsorption(state, registry, command, context, expectedSequence=state.sequence) {
    const definition=registry.simulation.commands.get(command.id);
    assert(definition?.group === IDS.group && definition.actorId === 'player' && command.id !== IDS.begin, 'Unsupported courier action.');
    const targetId=definition.targetId || null;
    assert(command.targetId == null || command.targetId === targetId, 'Choose the declared courier participant.');
    return commitSimulationCommand(state,registry,command,playerContext(state,registry,context,targetId),expectedSequence);
}

export function cancelRepositoryAbsorption(state, registry, jobId, context, expectedSequence=state.sequence) {
    const job=state.simulation?.jobs.find(j=>j.id === jobId && j.actorId === 'player');
    assert(job && registry.simulation.commands.get(job.commandId)?.group === IDS.group, 'That courier commitment is unavailable.');
    return cancelSimulationJob(state,registry,jobId,playerContext(state,registry,context,job.targetId),expectedSequence);
}

export function commitRepositoryProjection(state, registry, command, context, expectedSequence=state.sequence) {
    assert(expectedSequence===state.sequence, 'This preparation request is stale.');
    const projections=projectionPreviews(state,registry,playerContext(state,registry,context));
    assert(['itinerary','stock'].includes(command.projectionKind), 'Unsupported preparation projection.');
    const selected=projections[command.projectionKind], request=selected?.request;
    assert(request&&selected.eligible, 'The next preparation step is unavailable.');
    for(const name of ['id','commandRevision','projectionId','projectionRevision','projectionIdentity','stepId','targetId'])
        assert(command.request?.[name]===request[name], 'The preparation identity, definition or participant changed.');
    // Quote only the live selected step again. No costs of later work reserve.
    return commitRepositoryAbsorption(state,registry,{id:request.id,targetId:request.targetId},context,expectedSequence);
}

const costLabel = e => {
    const holder=e.actor === IDS.actor ? 'Miri’s ' : 'your ';
    if(e.type === 'item') {let id='supplies';try{id=JSON.parse(e.key).id;}catch{}return `${-e.amount} ${holder}${id}`;}
    if(e.type === 'vital') return `${-e.amount} ${holder}${e.key}`;
    if(e.type === 'resource') return `${-e.amount} ${e.native?'your native coins':holder+e.key}`;
    return 'the declared owned input';
};
function publicReasons(quote) {
    return [...new Set((quote.reasons || []).map(reason=>
        /Insufficient coins|Insufficient water|No inventory binding|Unknown simulation participant/.test(reason)
            ? 'Miri cannot offer the agreed means right now.' : reason))];
}
function recordedBasis(basis) {
    if(!basis) return null;
    return {kind:basis.kind,sourceLabel:basis.attributedTo===IDS.actor?'Miri':basis.attributedTo==='player'?'Your own observation':'Recorded source',
        ...(basis.kind==='recollection'?{label:'Miri’s attributed account'}:{})};
}

function projectionPreviews(state, registry, context) {
    if(!state.simulation?.powers.player?.[IDS.power]?.owned) return {};
    const itinerary=defineRepositoryWorkItinerary({id:'repositories.sealing_itinerary',revision:1,label:'Known sealing practice',actorId:'player',
        steps:[{id:'single_batches',commandId:'repositories.seal_kit',count:3},{id:'matched_pair',commandId:'repositories.seal_pair',count:1}]},registry);
    const p=previewRepositoryWorkItinerary(state,registry,itinerary,{...context,targetId:null});
    const stock=defineRepositoryStockBand({id:'repositories.protected_stock',revision:1,label:'Your protection preparation',actorId:'player',
        commandId:'repositories.seal_kit',key:ITEMS.protectedKit,lower:1,upper:2,batchSize:1,maxStarts:6},registry);
    const band=previewRepositoryStockBand(state,registry,stock,{...context,targetId:null});
    return {itinerary:p,stock:band};
}
function workViews(state, registry, context) {
    const {itinerary:p,stock:band}=projectionPreviews(state,registry,context);
    if(!p)return {};
    return {
        itinerary:{label:p.label,text:`${p.remainingCount} known batch${p.remainingCount===1?'':'es'} remaining; ${p.workMinutes} work minutes if eligibility stays available. ${p.durationNote} Reserve only a chosen next job.`,
            rows:p.rows.map(r=>({id:r.id,label:r.id==='single_batches'?'Single sealing batches':'Matched pair after three practiced batches',text:`${r.completed}/${r.count} completed; ${r.status}.`}))},
        stock:{label:band.label,text:`Your bag holds ${band.stock} protected kit${band.stock===1?'':'s'}. ${band.status==='ready'?'The current stock band suggests one sealing job.':band.status==='working'?'One sealing job already holds its inputs.':band.status==='idle'?'No shortage starts a new stock suggestion.':band.status==='exhausted'?'The six-batch planning bound is reached; manual work stays available.':'The next suggested sealing job is unavailable.'} No future job is reserved.`},
        projectionActions:[['itinerary',p,'Start the next known sealing batch'],...(band.status==='idle'?[]:[['stock',band,'Prepare one suggested protected kit']])].map(([kind,view,label])=>({
            id:`repositories.${kind}.next`,type:'projection',projectionKind:kind,request:view.request,label,
            description:'Choose just the current legal step. The host rechecks its definition, participant, current sequence and actual means before accepting one ordinary job.',
            eligible:view.eligible,reasons:publicReasons(view),duration:view.quote?.duration || 0,cancellation:'refund',
            preview:[...(view.quote?.eligible?[`Reserved at acceptance: ${view.quote.costs.map(costLabel).join(', ')}.`]:[]),
                'Only this next job reserves inputs. Cancellation refunds its reserved means. Travel and waiting are outside the work-time estimate.'],
        })),
    };
}

// Return only the player's own record and disclosed action terms. No live NPC
// inventory, purse, body, hidden procedure or private log is returned.
export function repositoryAbsorptionPresentation(state, registry, context) {
    context=playerContext(state,registry,context);
    const s=state.simulation, introduced=!!s?.knowledge.player?.['repositories.opening'];
    const atVillage=context.facts.location === 'Village';
    const canBegin=!introduced && atVillage && !!context.facts['village.elderMet'] && !!context.facts['repositories.clockSupported'] && !context.busy;
    const job=s?.jobs.find(j=>j.actorId==='player' && registry.simulation.commands.get(j.commandId)?.group===IDS.group);
    const actions=[];
    if(introduced && atVillage) for(const d of registry.simulation.commands.values()) {
        if(d.group!==IDS.group || d.actorId!=='player' || d.id===IDS.begin || d.once && state.actors.player.completed[d.id] || d.claim && s.claims[d.claim]) continue;
        const ctx=playerContext(state,registry,context,d.targetId || null);
        const facts=simulationFacts(state,ctx,registry);
        if(!meets(d.visibleWhen,facts)) continue;
        const p=previewSimulationCommand(state,registry,d.id,ctx);
        if(!p.visible) continue;
        actions.push({id:d.id,label:d.label,description:d.description || '',targetId:d.targetId || null,eligible:p.eligible,reasons:publicReasons(p),
            duration:p.duration,cancellation:d.cancellation || 'none',preview:[
                ...(d.costs.length?[`Reserved at acceptance: ${d.costs.map(costLabel).join(', ')}.`]:['No input cost.']),
                `${d.duration || 0} played minutes. ${d.cancellation==='refund'?'Cancellation returns reserved inputs; elapsed time stays spent.':d.duration?'Accepted work cannot be cancelled.':'Immediate recorded action.'}`,
            ]});
    }
    const records=Object.entries(s?.knowledge.player || {}).filter(([id])=>id.startsWith('repositories.'))
        .map(([id,r])=>({id,text:r.value,basis:recordedBasis(r.basis),at:r.at}));
    const workProjection=introduced?workViews(state,registry,context):{};
    if(atVillage)actions.push(...(workProjection.projectionActions || []));
    delete workProjection.projectionActions;
    return {visible:!!(canBegin || introduced && atVillage || job),canBegin,actions,records,
        methodChain:repositoryMethodChainView(state),
        work:job?{id:job.id,label:job.label,remainingMinutes:Math.max(0,job.due-state.clock),cancellation:job.cancellation}:null,
        ...workProjection,
    };
}
