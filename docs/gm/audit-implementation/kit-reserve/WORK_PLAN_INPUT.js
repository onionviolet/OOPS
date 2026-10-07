// Optional finite itineraries are cursors over existing owners, not another
// scheduler. The common engine supplies every boundary and publishes one plan.
import {assert, record, stableId, natural, copy, validatePredicate, meets} from './simulation_contracts.js';
import {previewSimulationCommand, commitSimulationCommand, cancelSimulationJob, simulationFacts, simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';

export const WORK_PLAN_SCHEMA = 1;
const statuses = ['running', 'paused', 'complete', 'cancelled'];
const keysOnly = (value, keys) => assert(Object.keys(value).every(key => keys.includes(key)), 'The optional itinerary cursor cannot contain a copied context or unsupported fields.');
const stage = (state, context) => ({state: copy(state), external: copy(context.external || {}), gameplay: copy(context.gameplay || {}),
    gameplayBefore: copy(context.gameplay || {}), vitals: copy(context.vitals || {}), equipment: copy(context.equipment || {}), acquisitions: [], unlocks: []});
const root = state => state.simulation?.workPlans;
const actorLocation = (state, actorId, context) => context?.facts?.location || state.simulation.people[actorId]?.location;
const ctxFor = (out, actorId, contexts) => ({...contexts[actorId], actorId, worldId: out.state.actors[actorId]?.worldId,
    external: out.external, gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment});
const liveJob = (state, cursor) => cursor.accepted && state.simulation.jobs.find(j => j.id === cursor.accepted.jobId && j.actorId === cursor.actorId);
const knownCompletion = (state, step, actorId) => !!state.actors[actorId].completed[step.commandId];

function validateStep(step, commands) {
    assert(record(step) && stableId(step.id) && ['command','travel','wait'].includes(step.kind), 'Invalid mixed work-plan step.');
    if(step.kind === 'command') {
        keysOnly(step,['id','kind','commandId','revision','targetId']);
        assert(stableId(step.commandId) && natural(step.revision) && step.revision > 0 && (step.targetId == null || stableId(step.targetId)), 'Invalid planned command reference.');
        if(commands) {
            const d = commands.get(step.commandId);
            assert(d && d.revision === step.revision && !d.encounterId && (!d.actorId || d.actorId === 'player'), 'This itinerary needs its retained command revision. Remove its cursor to keep the rest of the save.');
            assert(!d.targetId || d.targetId === step.targetId, 'The itinerary target differs from its actual command.');
        }
    } else if(step.kind === 'travel') {keysOnly(step,['id','kind','location','label']); assert(typeof step.location === 'string' && step.location.length > 0 && typeof step.label === 'string', 'Invalid native travel boundary.');}
    else {
        keysOnly(step,['id','kind','requires','label','actorId','commandId','revision']);
        assert(typeof step.label === 'string' && step.requires != null && stableId(step.actorId) && stableId(step.commandId) && natural(step.revision) && step.revision > 0, 'Invalid known-work wait.');
        validatePredicate(step.requires);
        if(commands) {const d = commands.get(step.commandId); assert(d?.revision === step.revision && d.actorId === step.actorId, 'The waited-for resident command needs its retained revision.');}
    }
}

export function createWorkPlanRegistry(definitions, simulationRegistry) {
    const plans = new Map();
    for(const d of definitions || []) {
        assert(stableId(d.id) && !plans.has(d.id) && natural(d.revision) && d.revision > 0 && typeof d.label === 'string' &&
            d.actorId === 'player' && stableId(d.origin) && Array.isArray(d.steps) && d.steps.length > 0 && d.steps.length <= 32, 'Invalid finite mixed itinerary.');
        assert(new Set(d.steps.map(s => s.id)).size === d.steps.length, 'Duplicate mixed itinerary step.');
        validatePredicate(d.visibleWhen); validatePredicate(d.requires);
        if(d.goal != null) validatePredicate(d.goal);
        for(const step of d.steps) validateStep(step, simulationRegistry?.commands);
        assert(!simulationRegistry || simulationRegistry.commands.has(d.origin), 'Missing itinerary origin.');
        plans.set(d.id, copy(d));
    }
    return plans;
}

// Missing is inert. Only IDs/revisions and the one accepted job receipt survive
// save. Native context, inventory, facts, outputs and clock are never mirrored.
export function validateWorkPlans(value, state, simulationRegistry, planRegistry) {
    if(value == null) return;
    assert(record(value) && value.schema === WORK_PLAN_SCHEMA && record(value.cursors) && Object.keys(value.cursors).length <= 8, 'Unsupported optional workPlans schema. Remove only this cursor record to recover the save.');
    keysOnly(value,['schema','cursors']);
    for(const [actorId,c] of Object.entries(value.cursors)) {
        assert(record(c) && actorId === 'player' && c.actorId === actorId && state.simulation?.people[actorId], 'Invalid itinerary actor.');
        keysOnly(c,['id','definitionId','origin','revision','actorId','label','status','index','steps','startedAt','updatedAt','startedSequence','reason','accepted','goal']);
        if(c.goal != null) {
            assert([9,10].includes(state.schema) && state.referenceGameplay?.schema === 1, 'Goal-directed practice requires the reference gameplay reader.');
            validatePredicate(c.goal);
        }
        assert(stableId(c.id) && stableId(c.definitionId) && stableId(c.origin) && natural(c.revision) && c.revision > 0 && typeof c.label === 'string' &&
            statuses.includes(c.status) && natural(c.index) && Array.isArray(c.steps) && c.steps.length > 0 && c.steps.length <= 32 && c.index <= c.steps.length,
        'Invalid finite itinerary cursor.');
        assert(natural(c.startedAt) && c.startedAt <= state.clock && natural(c.updatedAt) && c.updatedAt >= c.startedAt && c.updatedAt <= state.clock &&
            natural(c.startedSequence) && c.startedSequence <= state.sequence && (c.reason == null || typeof c.reason === 'string'), 'Invalid itinerary receipt.');
        assert(c.status !== 'complete' || c.index === c.steps.length || c.goal != null && !c.accepted, 'Incomplete itinerary marked complete.');
        assert(c.index < c.steps.length || ['complete','cancelled'].includes(c.status), 'Finished itinerary is still running.');
        for(const step of c.steps) validateStep(step, simulationRegistry?.commands);
        assert(new Set(c.steps.map(s => s.id)).size === c.steps.length, 'Duplicate saved itinerary step.');
        if(planRegistry) {
            const d = planRegistry.get(c.definitionId);
            assert(d && d.revision === c.revision && d.origin === c.origin && d.label === c.label && JSON.stringify(d.steps) === JSON.stringify(c.steps) && JSON.stringify(d.goal ?? null) === JSON.stringify(c.goal ?? null),
                'This itinerary needs its retained definition. Remove only its optional cursor to keep the rest of the save.');
        }
        if(c.accepted != null) {
            const r = c.accepted, step = c.steps[c.index];
            assert(record(r), 'Invalid accepted itinerary commitment.');
            keysOnly(r,['commandId','revision','jobId','completedBefore','sequence','startedAt','due']);
            assert(record(r) && step?.kind === 'command' && r.commandId === step.commandId && r.revision === step.revision && stableId(r.jobId) &&
                natural(r.completedBefore) && natural(r.sequence) && r.sequence <= state.sequence && natural(r.startedAt) && r.startedAt <= state.clock &&
                natural(r.due) && r.due > r.startedAt && !['complete','cancelled'].includes(c.status), 'Invalid accepted itinerary commitment.');
            const job = state.simulation.jobs.find(j => j.id === r.jobId);
            if(job) assert(job.actorId === actorId && job.commandId === r.commandId && job.revision === r.revision && job.sequence === r.sequence && job.due === r.due,
                'Itinerary receipt differs from the real accepted job.');
        }
    }
}

export function workPlanNextBoundary(state) {
    // Accepted jobs already supply their due boundary through simulation.js.
    // A running unreserved cursor demands a single common played-minute check.
    return Object.values(root(state)?.cursors || {}).some(c => c.status === 'running' && !c.accepted) ? state.clock + 1 : Infinity;
}

function settleAccepted(out, cursor, registry) {
    if(!cursor.accepted || liveJob(out.state,cursor)) return false;
    const count = out.state.actors[cursor.actorId].completed[cursor.accepted.commandId] || 0;
    const label = registry.simulation.commands.get(cursor.accepted.commandId)?.label;
    const exact = out.state.simulation.log.some(entry => entry.cause === cursor.accepted.jobId && entry.text === `${label} completed.`);
    if(exact && count > cursor.accepted.completedBefore) {cursor.index++; cursor.reason = '';}
    else {cursor.status = 'paused'; cursor.reason = 'The accepted step stopped or was cancelled. Its actual reservation policy was applied; no itinerary result was awarded.';}
    cursor.accepted = null;
    cursor.updatedAt = out.state.clock;
    if(cursor.index === cursor.steps.length) cursor.status = 'complete';
    return true;
}

function mergeCommand(out, next) {
    const acquisitions = out.acquisitions ||= [], unlocks = out.unlocks ||= [], before = out.gameplayBefore;
    // The common scheduler retains references to these staged owners. Replace
    // their contents, not the containers, or its returned plan loses our work.
    for(const [key,value] of Object.entries(next)) {
        if(['acquisitions','unlocks','gameplayBefore'].includes(key)) continue;
        if(['state','external','gameplay','vitals','equipment'].includes(key) && record(out[key]) && record(value)) {
            const owner = out[key];
            for(const entry of Object.keys(owner)) delete owner[entry];
            Object.assign(owner,value);
        } else out[key] = value;
    }
    acquisitions.push(...(next.acquisitions || []));
    unlocks.push(...(next.unlocks || []));
    if(before) out.gameplayBefore = before;
}

function advanceOne(out, registry, contexts, actorId) {
    let cursor = root(out.state)?.cursors[actorId];
    if(!cursor || ['complete','cancelled'].includes(cursor.status)) return 0;
    let work = settleAccepted(out,cursor,registry) ? 1 : 0;
    if(cursor.status !== 'running' || cursor.accepted) return work;
    for(let budget = 0; budget < 32 && cursor.index < cursor.steps.length; budget++) {
        const step = cursor.steps[cursor.index], context = ctxFor(out,actorId,contexts);
        if(!contexts[actorId]) {cursor.status = 'paused'; cursor.reason = 'A current native context is required before the next step.'; break;}
        const facts = simulationFacts(out.state,context,registry);
        if(cursor.goal && meets(cursor.goal,facts)) {
            cursor.status = 'complete'; cursor.reason = 'The useful function is earned. No further practice is reserved.';
            cursor.updatedAt = out.state.clock; work++; break;
        }
        if(facts['society.clockSupported'] === false || context.busy || out.state.chronicle?.session || out.state.chronicle?.life.endedAt != null) {
            cursor.status = 'paused'; cursor.reason = 'Finish the current native activity or return to supported local contact, then resume.'; break;
        }
        if(step.kind === 'travel') {
            if(actorLocation(out.state,actorId,context) !== step.location) {cursor.status = 'paused'; cursor.reason = step.label; break;}
            cursor.index++; cursor.updatedAt = out.state.clock; work++; continue;
        }
        if(step.kind === 'wait') {
            if(!meets(step.requires,facts)) {
                if(facts['world.feature_society.closed'] === true) {cursor.status = 'paused'; cursor.reason = 'The agreed future work has been closed. Cancel this itinerary or choose an ordinary personal route.';}
                else if(out.state.clock > cursor.startedAt && !out.state.simulation.jobs.some(j => j.actorId === step.actorId && j.commandId === step.commandId)) {
                    cursor.status = 'paused'; cursor.reason = 'The resident has not accepted the next work. Current permission, funding, body or means do not support a new commitment; meet them or correct the agreed inputs, then resume.';
                } else cursor.reason = step.label;
                break;
            }
            cursor.index++; cursor.updatedAt = out.state.clock; work++; continue;
        }
        const definition = registry.simulation.commands.get(step.commandId);
        // Only authored once-only receipts may be skipped. Repeated useful work
        // must get a new real reservation, rather than reuse a historical count.
        if(definition?.once && knownCompletion(out.state,step,actorId)) {cursor.index++; cursor.updatedAt = out.state.clock; work++; continue;}
        if(simulationOccupiesActor(out.state,actorId) || out.state.pending.some(j => j.context.actorId === actorId) || activePractice(out.state.actors[actorId]) || out.state.simulation.programs[actorId]?.status === 'running') {
            cursor.status = 'paused'; cursor.reason = 'Finish or cancel the current work before this itinerary reserves its next step.'; break;
        }
        assert(definition && definition.revision === step.revision, 'The next command revision is unavailable; pause or remove this itinerary.');
        const ctx = {...context,targetId:step.targetId || null};
        const preview = previewSimulationCommand(out.state,registry,step.commandId,ctx);
        if(!preview.eligible) {cursor.status = 'paused'; cursor.reason = preview.visible ? preview.reasons.join(' ') : 'The next step needs information you have not learned.'; break;}
        const completedBefore = out.state.actors[actorId].completed[step.commandId] || 0;
        const next = commitSimulationCommand(out.state,registry,{id:step.commandId},ctx,out.state.sequence);
        mergeCommand(out,next);
        cursor = root(out.state).cursors[actorId];
        const job = out.state.simulation.jobs.find(j => j.actorId === actorId && j.commandId === step.commandId && j.sequence === out.state.sequence);
        cursor.updatedAt = out.state.clock; cursor.reason = ''; work++;
        if(job) {cursor.accepted = {jobId:job.id,commandId:job.commandId,revision:job.revision,sequence:job.sequence,
            startedAt:out.state.clock,due:job.due,completedBefore}; break;}
        cursor.index++;
    }
    if(cursor.index === cursor.steps.length && !cursor.accepted) {cursor.status = 'complete'; cursor.reason = '';}
    return work;
}

export function advanceWorkPlansBoundary(out, registry, contexts = {}) {
    if(!root(out.state)) return 0;
    let work = 0;
    for(const actorId of Object.keys(root(out.state).cursors).sort()) work += advanceOne(out,registry,contexts,actorId);
    validateWorkPlans(root(out.state),out.state,registry.simulation);
    return work;
}

export function startWorkPlan(state, registry, planRegistry, definitionId, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && state.simulation && context.actorId === 'player', 'This itinerary request is stale or unbound.');
    const d = planRegistry.get(definitionId); assert(d, 'Unknown finite itinerary.');
    const previous = root(state)?.cursors.player;
    assert(!previous || ['complete','cancelled'].includes(previous.status), 'Pause, finish or cancel your existing itinerary first.');
    const facts = simulationFacts(state,context,registry);
    assert(meets(d.visibleWhen,facts) && meets(d.requires,facts), 'Hear and accept this itinerary’s known origin first.');
    assert(!context.busy && !simulationOccupiesActor(state,'player') && !state.pending.some(j => j.context.actorId === 'player') &&
        !activePractice(state.actors.player) && state.simulation.programs.player?.status !== 'running', 'Finish your current native activity or routine first.');
    const out = stage(state,context), cause = `work-plan:${++out.state.sequence}`;
    out.state.simulation.workPlans ||= {schema: WORK_PLAN_SCHEMA,cursors:{}};
    out.state.simulation.workPlans.cursors.player = {id:cause,definitionId:d.id,revision:d.revision,actorId:'player',origin:d.origin,label:d.label,
        startedSequence:out.state.sequence,startedAt:state.clock,updatedAt:state.clock,steps:copy(d.steps),index:0,status:'running',accepted:null,reason:''};
    if(d.goal != null) {
        assert(out.state.referenceGameplay?.schema === 1, 'Enroll the reference gameplay record before goal-directed practice.');
        out.state.schema = out.state.bookWorldCampaign?10:9;
        out.state.simulation.workPlans.cursors.player.goal = copy(d.goal);
    }
    advanceOne(out,registry,{player:context},'player');
    validateWorkPlans(root(out.state),out.state,registry.simulation,planRegistry);
    return out;
}

export function controlWorkPlan(state, registry, command, context, expectedSequence = state.sequence) {
    assert(state.sequence === expectedSequence && context.actorId === 'player', 'This itinerary control is stale.');
    const saved = root(state)?.cursors.player;
    assert(saved && saved.id === command.cursorId, 'This itinerary cursor changed.');
    assert(['pause','resume','cancel','forget'].includes(command.action), 'Unsupported itinerary control.');
    const out = stage(state,context); let c = root(out.state).cursors.player;
    if(command.action === 'forget') {
        assert(!c.accepted || !liveJob(state,c), 'Cancel or finish the accepted job before removing this cursor.');
        delete root(out.state).cursors.player;
    } else if(command.action === 'cancel') {
        if(command.cancelCurrent === true && liveJob(state,c)) {
            const cancelled = cancelSimulationJob(out.state,registry,c.accepted.jobId,context,out.state.sequence);
            mergeCommand(out,cancelled); c = root(out.state).cursors.player;
        }
        // Stopping future steps leaves a currently accepted ordinary job owned
        // by its existing job queue, including its paid completion/refund rules.
        c.status = 'cancelled'; c.accepted = null; c.reason = 'Future steps cancelled. Any retained accepted job keeps its disclosed terms.';
    } else {
        assert(!['complete','cancelled'].includes(c.status), 'This itinerary has ended.');
        if(command.action === 'pause') {c.status = 'paused'; c.reason = 'Paused after any currently accepted work.';}
        else {c.status = 'running'; c.reason = ''; advanceOne(out,registry,{player:context},'player'); c = root(out.state).cursors.player;}
    }
    if(c) c.updatedAt = state.clock;
    out.state.sequence++;
    validateWorkPlans(root(out.state),out.state,registry.simulation);
    return out;
}

export function workPlanView(state, registry, planRegistry, context) {
    const c = root(state)?.cursors[context.actorId || 'player'];
    if(!c) return null;
    const next = c.steps[c.index], job = liveJob(state,c);
    let quote = null;
    if(next?.kind === 'command' && !job) {
        const d = registry.simulation.commands.get(next.commandId);
        if(d?.revision === next.revision) quote = previewSimulationCommand(state,registry,next.commandId,{...context,targetId:next.targetId || null});
    }
    return {id:c.id,definitionId:c.definitionId,label:c.label,status:c.status,index:c.index,total:c.steps.length,reason:c.reason,
        steps:c.steps.map((s,index) => ({id:s.id,kind:s.kind,label:s.kind === 'command' ? registry.simulation.commands.get(s.commandId)?.label || 'Retained work step' : s.label,
            status:index < c.index ? 'complete' : index === c.index ? job ? 'accepted' : 'next' : 'future'})),
        next: next ? {id:next.id,kind:next.kind,label:quote?.label || next.label || 'Next known step',eligible:!!quote?.eligible,
            reasons:job ? [] : quote ? quote.visible ? quote.reasons : ['Requirements not yet known.'] : c.reason ? [c.reason] : [],
            duration:quote?.duration || 0,costs:quote?.eligible ? quote.costs : [],targetId:next.targetId || null} : null,
        accepted:job ? {id:job.id,label:job.label,remaining:Math.max(0,job.due-state.clock),cancellation:job.cancellation} : null,
        canResume:c.status === 'paused',canPause:c.status === 'running',canCancel:!['complete','cancelled'].includes(c.status),
        canForget:!job,definitionRetained:!planRegistry || planRegistry.has(c.definitionId)};
}
