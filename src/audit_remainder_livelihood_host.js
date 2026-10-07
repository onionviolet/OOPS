// Optional native-facing host. Root routes this through audit_remainder and the
// existing durable publisher. Content/facts never import this executor module.
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand} from './simulation.js';
import {REMAINDER_LIVELIHOOD_IDS as I, REMAINDER_LIVELIHOOD_COMMISSIONS as C,
    remainderLivelihoodDefinitions, remainderLivelihoodCommand} from './audit_remainder_livelihood_content.js';
import {remainderLivelihoodFacts, remainderLivelihoodWindow, validateRemainderLivelihood} from './audit_remainder_livelihood_facts.js';
const key = suffix => `${I.prefix}.${suffix}`;
const assert = (ok, message) => {if(!ok) throw new Error(message);};
export const remainderLivelihoodContext = (state, context, registry) => ({...context,
    facts: {...context.facts, ...remainderLivelihoodFacts(state, context, registry)}});

export function commitRemainderLivelihoodCommand(state, registry, command, context, sequence = state.sequence) {
    assert(sequence === state.sequence && context.actorId === 'player' && state.auditRemainder?.schema === 1 &&
        context.facts?.['auditRemainder.enrolled'] === true, 'This explicit local livelihood action is stale or unenrolled.');
    context = remainderLivelihoodContext(state, context, registry);
    if(command.type === 'cancel_job') {
        const j = state.simulation?.jobs.find(j => j.id === command.id);
        const c = C.find(c => key(`work_${c.topic}`) === j?.commandId);
        assert(c && j.actorId === c.worker && state.actors.player.completed[key(`fund_${c.topic}`)] === 1 &&
            context.facts.location === 'Village' && context.facts['remainder.livelihood.local'],
            'Cancel only the actual independently accepted job you funded at this local meeting.');
        // The explicit UI control cancels and withdraws this sponsorship in one
        // published plan. Reserved effort/tools return to the worker first;
        // the separately registered withdrawal returns only supplied means.
        const cancelled = cancelSimulationJob(state, registry, j.id, {...context, actorId: c.worker}, sequence);
        const staged = {...context, external: cancelled.external, gameplay: cancelled.gameplay, vitals: cancelled.vitals,
            equipment: cancelled.equipment, actorId: 'player', targetId: c.worker};
        const withdrawn = commitSimulationCommand(cancelled.state, registry, {id: key(`withdraw_${c.topic}`)},
            remainderLivelihoodContext(cancelled.state, staged, registry), cancelled.state.sequence);
        withdrawn.acquisitions = [...(cancelled.acquisitions || []), ...(withdrawn.acquisitions || [])];
        withdrawn.unlocks = [...(cancelled.unlocks || []), ...(withdrawn.unlocks || [])];
        withdrawn.native ||= cancelled.native;
        validateRemainderLivelihood(withdrawn.state, registry);
        return withdrawn;
    }
    assert(['command', 'audit_remainder'].includes(command.type), 'Unsupported livelihood action.');
    const d = remainderLivelihoodCommand(command.id);
    assert(d && d.actorId === 'player' && (command.targetId == null || command.targetId === d.targetId),
        'Choose the declared player livelihood command and actual participant.');
    const out = commitSimulationCommand(state, registry, {id: d.id},
        remainderLivelihoodContext(state, {...context, targetId: d.targetId || null}, registry), sequence);
    validateRemainderLivelihood(out.state, registry);
    return out;
}

export function remainderLivelihoodPresentation(state, registry, context = {}) {
    context = remainderLivelihoodContext(state, context, registry);
    const enrolled = context.facts['auditRemainder.enrolled'] === true && state.auditRemainder?.schema === 1;
    if(!enrolled || !state.simulation) return {visible: false, actions: [], records: [], duties: [], shifts: [], commission: null};
    const p = state.actors.player, s = state.simulation, f = context.facts, actions = [];
    for(const d of remainderLivelihoodDefinitions.commands) {
        if(d.actorId !== 'player' || d.once && p.completed[d.id]) continue;
        const preview = previewSimulationCommand(state, registry, d.id, {...context, targetId: d.targetId || null});
        if(!preview.visible) continue;
        actions.push({id: d.id, type: 'audit_remainder', lane: 'livelihood', targetId: d.targetId || null,
            label: d.label, description: d.description || '', eligible: preview.eligible,
            reasons: preview.reasons, costs: preview.costs, duration: preview.duration});
    }
    const duties = C.filter(c => p.completed[key(`fund_${c.topic}`)]).map(c => {
        const job = s.jobs.find(j => j.commandId === key(`work_${c.topic}`) && j.actorId === c.worker);
        const phase = p.completed[key(`withdraw_${c.topic}`)] ? 'withdrawn' : p.completed[key(`${c.outputs ? 'collect' : 'report'}_${c.topic}`)] ? 'collected' :
            f[`remainder.livelihood.${c.topic}.complete`] ? 'completed, separate collection/report available' : job ? 'independently working' :
            c.worker === I.lio && state.actors[I.lio]?.completed[key('lio_refuse')] ? 'declined, supplied means available for withdrawal' : 'funded, awaiting actual eligible local work';
        return {id: c.topic, workerId: c.worker, phase, jobId: job?.id || null, remaining: job ? Math.max(0, job.due - state.clock) : null,
            cancellation: job ? {type: 'cancel_job', lane: 'livelihood', id: job.id, label: 'Cancel and withdraw sponsorship · return supplied stock and two coins'} : null};
    });
    const shifts = C.filter(c => c.topic.startsWith('shift')).map(c => ({id: c.topic,
        remaining: !s.claims[c.fundingClaim], status: duties.find(d => d.id === c.topic)?.phase ||
            (p.completed[key(`decline_${c.topic}`)] ? 'declined, no supplies spent' : 'one finite shift remains unfunded')}));
    const window = remainderLivelihoodWindow(state, context);
    const records = Object.entries(s.knowledge.player || {}).filter(([id]) => id.startsWith(`${I.prefix}.`)).map(([id, r]) => ({id, at: r.at, text: r.value}));
    return {visible: true, title: 'Finite resident shifts and toolkit allocation', actions, records, duties, shifts,
        schedule: {hours: '08:00–18:00', open: window.open, remaining: window.remaining, nextIn: window.nextIn,
            text: window.open ? `Local work window: ${window.remaining} played minutes remain.` : `Local work is closed${window.nextIn == null ? '; calendar support is unavailable.' : `; opens in ${window.nextIn} played minutes.`}`},
        commission: {remaining: !s.claims[key('allocation.funding')], selectedWorker: state.worlds[I.world].facts[key('allocationChoice')] || null},
        lio: {remaining: !s.claims[key('lio.funding')], status: duties.find(d => d.id === 'lio')?.phase ||
            (p.completed[key('keep_lio')] ? 'kept free for existing contest admission' : 'one finite offered shift remains')},
        terms: 'Opening this report creates no new stock, demand, wage or attention. Only an actual accepted independent job occupies its worker; collection uses current native-compatible owned stock.'};
}
