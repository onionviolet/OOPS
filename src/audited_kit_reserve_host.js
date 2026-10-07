import {AUDITED_KIT_RESERVE_IDS as I, AUDITED_KIT_RESERVE_POLICY as P,
    AUDITED_KIT_RESERVE_TERMS as T} from './audited_kit_reserve_content.js';
import {auditedKitReserveFacts} from './audited_kit_reserve_facts.js';
import {startWorkPlan, controlWorkPlan, workPlanView} from './feature_expansion_work_plan.js';
import {simulationFacts, simulationOccupiesActor, previewSimulationCommand} from './simulation.js';
import {assert, meets} from './simulation_contracts.js';
import {activePractice} from './techniques.js';

export function auditedKitReserveContext(state, registry, context = {}) {
    const support = state.simulation ? simulationFacts(state,context,registry) : context.facts || {};
    return {...context, facts: {...context.facts, ...auditedKitReserveFacts(state,context,support)}};
}

export function startAuditedKitReserve(state, registry, context, expectedSequence = state.sequence) {
    assert(context.actorId === 'player' && state.referenceGameplay?.schema === 1, 'Enroll the existing reference gameplay before accepting a reserve.');
    return startWorkPlan(state,registry,registry.workPlans,I.plan,auditedKitReserveContext(state,registry,context),expectedSequence);
}
export const auditedKitReserveStart = startAuditedKitReserve;

export function controlAuditedKitReserve(state, registry, command, context, expectedSequence = state.sequence) {
    const c = state.simulation?.workPlans?.cursors.player;
    assert(c?.definitionId === I.plan && c.stockPolicy?.version === 1, 'This finite survey-kit reserve changed.');
    return controlWorkPlan(state,registry,command,auditedKitReserveContext(state,registry,context),expectedSequence);
}
export const auditedKitReserveControl = controlAuditedKitReserve;

export function auditedKitReservePresentation(state, registry, context) {
    const ctx = auditedKitReserveContext(state,registry,context), f = ctx.facts;
    const cursor = state.simulation?.workPlans?.cursors.player;
    const ownsCursor = cursor?.definitionId === I.plan;
    if(!f['auditedKitReserve.opened'] && !ownsCursor) return {visible: false, sections: []};
    const plan = registry.workPlans?.get(I.plan);
    const view = ownsCursor ? workPlanView(state,registry,registry.workPlans,ctx) : null;
    const available = f['auditedKitReserve.available'], supported = f['auditedKitReserve.supported'];
    const occupied = !!cursor && !['complete','cancelled'].includes(cursor.status);
    const free = supported && !context.busy && !simulationOccupiesActor(state,'player') &&
        !state.pending.some(j => j.context.actorId === 'player') && !activePractice(state.actors.player) &&
        state.simulation.programs.player?.status !== 'running';
    const actions = [];
    if(plan && !occupied && meets(plan.visibleWhen,f)) {
        const ready = free && meets(plan.requires,f);
        actions.push({id: I.plan, label: 'Keep a finite survey-kit reserve · at most 3 accepted resin batches',
            command: {type: 'audited_kit_reserve_start'}, eligible: ready,
            reasons: ready ? [] : ['Finish current work and return to Eda’s supported Village bench with your living body and usable hands.'],
            terms: `${T.text} Hold at ${P.upper}; restart at ${P.lower} or fewer. Cancellation or lost support still uses an accepted batch.`,
            automatable: false});
    }
    if(view) for(const [action,show] of [['pause',view.canPause],['resume',view.canResume],['cancel',view.canCancel],
        ['forget',view.canForget && ['complete','cancelled'].includes(view.status)]]) if(show) {
        const ready = action !== 'resume' || supported && !context.busy;
        actions.push({id: `audited_kit_reserve.${action}`, label: action === 'forget' ? 'Remove ended kit reserve' :
            action === 'cancel' ? 'Stop future reserve batches; accepted work keeps its terms' : `${action[0].toUpperCase()+action.slice(1)} kit reserve`,
            command: {type: 'audited_kit_reserve_control',action,cursorId:view.id},eligible:ready,
            reasons: ready ? [] : ['Return to the supported Village bench and finish the current native activity before resuming.'],automatable:false});
    }
    if(view?.accepted) actions.push({id:'audited_kit_reserve.cancel_current',label:'Cancel reserve and refund the accepted resin batch',
        command:{type:'audited_kit_reserve_control',action:'cancel',cursorId:view.id,cancelCurrent:true},eligible:true,reasons:[],
        terms:'The existing job refunds its actual reserved inputs and effort; its accepted batch remains used. No kits are produced.',automatable:false});
    let nextQuote = null;
    if(supported && !view?.accepted && !view?.holding && (!view || view.remainingBatches > 0))
        nextQuote = previewSimulationCommand(state,registry,I.command,ctx);
    const projected = nextQuote?.eligible && available < P.upper ? available + P.batchOutput : null;
    const overshoot = projected == null ? 0 : Math.max(0,projected-P.upper);
    const work = view ? [`${view.label}: ${view.status}${view.holding ? ' (holding)' : ''}.`,
        `${view.acceptedBatches}/${P.maxAcceptedBatches} accepted batches used; ${view.remainingBatches} remain.`,view.reason,
        view.accepted ? `${view.accepted.label}: ${view.accepted.remaining} played minutes remain; cancellation ${view.accepted.cancellation}.` : ''].filter(Boolean).join(' ') : '';
    const records = [
        {id:'audited_kit_reserve.stock',text:`${available} available owned Prepared survey kits carried now. Chest stock, other people’s stock, equipment, custody goods and earlier outputs do not count.`},
        {id:'audited_kit_reserve.terms',text:`${T.text} Available carried inputs: ${f['auditedKitReserve.resinAvailable']} resin, ${f['auditedKitReserve.soundAvailable']} sound staves. Each commitment requotes and reserves only that batch.`},
        {id:'audited_kit_reserve.policy',text:`Hold at ${P.upper} kits; resume at ${P.lower} or fewer. Between those thresholds retain the prior hold state. Up to ${P.maxAcceptedBatches} accepted batches; holding spends nothing. Departure or failed support pauses the reserve for an explicit resume.`},
    ];
    if(projected != null) records.push({id:'audited_kit_reserve.next',text:`Next supported batch: ${available} → ${projected} available kits if stock remains unchanged.${overshoot ? ` This overshoots the four-kit hold threshold by ${overshoot}; the full two-kit batch is kept.` : ''}`});
    return {visible:true, available, policy:{...P},cursor:view,nextQuote,projected,overshoot,sections:[{
        id:'audited.kit_reserve',label:'Finite survey-kit reserve',
        description:'Opt into a small reserve for the next few outings using Eda’s existing resin route. The routine reconsiders at actual supported played boundaries and expires after three accepted batches.',
        work,actions,records}]};
}
