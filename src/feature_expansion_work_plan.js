// Optional finite itineraries are cursors over existing owners, not another
// scheduler. The common engine supplies every boundary and publishes one plan.
import {assert, record, stableId, natural, copy, validatePredicate, meets} from './simulation_contracts.js';
import {previewSimulationCommand, commitSimulationCommand, cancelSimulationJob, simulationFacts, simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {AUDITED_KIT_RESERVE_IDS as KIT, AUDITED_KIT_RESERVE_POLICY as KIT_POLICY,
    AUDITED_KIT_RESERVE_TERMS as KIT_TERMS, planDefinitions as kitPlans} from './audited_kit_reserve_content.js';
import {auditedKitReserveFacts} from './audited_kit_reserve_facts.js';

export const WORK_PLAN_SCHEMA = 2;
export const LEGACY_WORK_PLAN_SCHEMA = 1;
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

function validateStockPolicy(policy) {
    assert(record(policy), 'Invalid optional stock policy.');
    keysOnly(policy,Object.keys(KIT_POLICY));
    assert(Object.entries(KIT_POLICY).every(([key,value]) => policy[key] === value),
        'Unsupported reserve policy. Retain the original save and remove only this optional cursor to recover it.');
}

function validateStockDefinition(d, commands) {
    validateStockPolicy(d.stockPolicy);
    const retained = kitPlans[0];
    assert(d.id === KIT.plan && d.revision === 1 && d.origin === KIT.origin && d.label === retained.label && d.actorId === 'player' && d.goal == null &&
        JSON.stringify(d.steps) === JSON.stringify(retained.steps), 'The reserve needs its exact finite revision-1 resin plan.');
    if(!commands) return;
    const route = commands.get(KIT.command), t = KIT_TERMS;
    assert(route?.revision === t.commandRevision && route.worldId === KIT.world && route.location === KIT.location && route.siteId === KIT.site &&
        route.actorId === 'player' && !route.once && !route.encounterId && !route.outcomes && route.duration === t.duration &&
        route.cancellation === 'refund' && route.completionFailure === 'refund' && route.completionRequires &&
        route.costs?.length === 3 && route.costs.every(e => e.actor === 'player') &&
        route.costs.some(e => e.type === 'item' && e.key === t.resinKey && e.amount === -t.resinCount) &&
        route.costs.some(e => e.type === 'item' && e.key === t.soundKey && e.amount === -t.soundCount) &&
        route.costs.some(e => e.type === 'vital' && e.key === 'stamina' && e.amount === -t.stamina) &&
        route.effects?.filter(e => e.type === 'item').length === 1 &&
        route.effects.some(e => e.type === 'item' && e.actor === 'player' && e.key === KIT_POLICY.key && e.amount === KIT_POLICY.batchOutput),
        'The reserve requires the retained resin route, exact costs, support/refunds and two native-kit output.');
}

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
        if(d.stockPolicy != null) validateStockDefinition(d,simulationRegistry?.commands);
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
    assert(record(value) && [LEGACY_WORK_PLAN_SCHEMA,WORK_PLAN_SCHEMA].includes(value.schema) && record(value.cursors) && Object.keys(value.cursors).length <= 8, 'Unsupported optional workPlans schema. Remove only this cursor record to recover the save.');
    keysOnly(value,['schema','cursors']);
    for(const [actorId,c] of Object.entries(value.cursors)) {
        assert(record(c) && actorId === 'player' && c.actorId === actorId && state.simulation?.people[actorId], 'Invalid itinerary actor.');
        keysOnly(c,['id','definitionId','origin','revision','actorId','label','status','index','steps','startedAt','updatedAt','startedSequence','reason','accepted','goal',
            ...(value.schema === WORK_PLAN_SCHEMA ? ['stockPolicy','stockHold','stockAcceptedBatches'] : [])]);
        if(c.stockPolicy != null) {
            assert(value.schema === WORK_PLAN_SCHEMA && [9,10,11].includes(state.schema) && state.referenceGameplay?.schema === 1 && c.goal == null,
                'The optional stock policy requires workPlans2 and the enrolled reference gameplay reader.');
            assert(state.referenceGameplay.workshop && state.actors?.player?.facts?.['reference_gameplay.opened'] === true &&
                state.actors.player.completed[KIT.origin] === 1 && c.startedSequence > 0 && c.id === `work-plan:${c.startedSequence}`,
                'The optional reserve requires its actual bench meeting and explicit accepted cursor receipt.');
            validateStockDefinition({...c,id:c.definitionId},simulationRegistry?.commands);
            assert(typeof c.stockHold === 'boolean' && natural(c.stockAcceptedBatches) && c.stockAcceptedBatches <= c.stockPolicy.maxAcceptedBatches &&
                c.stockAcceptedBatches >= c.index + (c.accepted ? 1 : 0) && (!c.accepted || !c.stockHold), 'Invalid finite reserve budget or hold state.');
        } else assert(!Object.hasOwn(c,'stockHold') && !Object.hasOwn(c,'stockAcceptedBatches'), 'A stock cursor lost its frozen policy.');
        if(c.goal != null) {
            assert([9,10,11].includes(state.schema) && state.referenceGameplay?.schema === 1, 'Goal-directed practice requires the reference gameplay reader.');
            validatePredicate(c.goal);
        }
        assert(stableId(c.id) && stableId(c.definitionId) && stableId(c.origin) && natural(c.revision) && c.revision > 0 && typeof c.label === 'string' &&
            statuses.includes(c.status) && natural(c.index) && Array.isArray(c.steps) && c.steps.length > 0 && c.steps.length <= 32 && c.index <= c.steps.length,
        'Invalid finite itinerary cursor.');
        assert(natural(c.startedAt) && c.startedAt <= state.clock && natural(c.updatedAt) && c.updatedAt >= c.startedAt && c.updatedAt <= state.clock &&
            natural(c.startedSequence) && c.startedSequence <= state.sequence && (c.reason == null || typeof c.reason === 'string'), 'Invalid itinerary receipt.');
        assert(c.status !== 'complete' || c.index === c.steps.length || c.goal != null && !c.accepted ||
            c.stockPolicy != null && c.stockAcceptedBatches === c.stockPolicy.maxAcceptedBatches && !c.accepted, 'Incomplete itinerary marked complete.');
        assert(c.index < c.steps.length || ['complete','cancelled'].includes(c.status), 'Finished itinerary is still running.');
        for(const step of c.steps) validateStep(step, simulationRegistry?.commands);
        assert(new Set(c.steps.map(s => s.id)).size === c.steps.length, 'Duplicate saved itinerary step.');
        if(planRegistry) {
            const d = planRegistry.get(c.definitionId);
            assert(d && d.revision === c.revision && d.origin === c.origin && d.label === c.label && JSON.stringify(d.steps) === JSON.stringify(c.steps) && JSON.stringify(d.goal ?? null) === JSON.stringify(c.goal ?? null) &&
                JSON.stringify(d.stockPolicy ?? null) === JSON.stringify(c.stockPolicy ?? null),
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
    // Stock routines reconsider at actual common played boundaries. They never
    // manufacture minute polling while waiting for the player to spend a kit.
    return Object.values(root(state)?.cursors || {}).some(c => c.status === 'running' && !c.accepted && !c.stockPolicy) ? state.clock + 1 : Infinity;
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
    if(cursor.index === cursor.steps.length) {
        cursor.status = 'complete';
        if(cursor.stockPolicy) cursor.reason = 'The finite three-accepted-batch reserve is complete. No later batch will be reserved.';
    }
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
        if(cursor.stockPolicy) {
            const stock = auditedKitReserveFacts(out.state,context,facts), policy = cursor.stockPolicy;
            if(!stock['auditedKitReserve.supported']) {
                cursor.status = 'paused'; cursor.reason = 'Reserve paused: return to Eda’s Village bench with your supported living body and usable hands, then resume.';
                cursor.updatedAt = out.state.clock; work++; break;
            }
            if(cursor.stockAcceptedBatches === policy.maxAcceptedBatches) {
                cursor.status = 'complete'; cursor.reason = 'All three accepted batches have been used. Refunded or cancelled commitments also count; no further work is reserved.';
                cursor.updatedAt = out.state.clock; work++; break;
            }
            const available = stock['auditedKitReserve.available'];
            if(available >= policy.upper || cursor.stockHold && available > policy.lower) {
                const reason = `Reserve holding: ${available} available owned kits. Restart at ${policy.lower} or fewer; holding spends no materials, stamina or work time.`;
                if(!cursor.stockHold || cursor.reason !== reason) {cursor.stockHold = true; cursor.reason = reason; cursor.updatedAt = out.state.clock; work++;}
                break;
            }
            // At intermediate stock a previously released routine stays released;
            // a held routine stays held. A two-kit batch can finish at five kits.
            cursor.stockHold = false;
            if(stock['auditedKitReserve.resinAvailable'] < KIT_TERMS.resinCount || stock['auditedKitReserve.soundAvailable'] < KIT_TERMS.soundCount) {
                cursor.status = 'paused'; cursor.reason = 'Reserve paused: carry 1 owned Set repair resin and 2 owned Sound repair staves, unequipped and outside custody, then resume. No inputs were reserved.';
                cursor.updatedAt = out.state.clock; work++; break;
            }
        }
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
        if(cursor.stockPolicy) {
            assert(job, 'A reserve batch requires the existing real three-minute job.');
            cursor.stockAcceptedBatches++;
        }
        if(job) {cursor.accepted = {jobId:job.id,commandId:job.commandId,revision:job.revision,sequence:job.sequence,
            startedAt:out.state.clock,due:job.due,completedBefore}; break;}
        cursor.index++;
    }
    if(cursor.index === cursor.steps.length && !cursor.accepted) {
        cursor.status = 'complete'; cursor.reason = cursor.stockPolicy ? 'The finite three-accepted-batch reserve is complete. No later batch will be reserved.' : '';
    }
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
    const currentFacts = simulationFacts(state,context,registry);
    const facts = {...currentFacts, ...auditedKitReserveFacts(state,context,currentFacts)};
    assert(meets(d.visibleWhen,facts) && meets(d.requires,facts), 'Hear and accept this itinerary’s known origin first.');
    assert(!context.busy && !simulationOccupiesActor(state,'player') && !state.pending.some(j => j.context.actorId === 'player') &&
        !activePractice(state.actors.player) && state.simulation.programs.player?.status !== 'running', 'Finish your current native activity or routine first.');
    const out = stage(state,context), cause = `work-plan:${++out.state.sequence}`;
    out.state.simulation.workPlans ||= {schema: LEGACY_WORK_PLAN_SCHEMA,cursors:{}};
    out.state.simulation.workPlans.cursors.player = {id:cause,definitionId:d.id,revision:d.revision,actorId:'player',origin:d.origin,label:d.label,
        startedSequence:out.state.sequence,startedAt:state.clock,updatedAt:state.clock,steps:copy(d.steps),index:0,status:'running',accepted:null,reason:''};
    if(d.goal != null) {
        assert(out.state.referenceGameplay?.schema === 1, 'Enroll the reference gameplay record before goal-directed practice.');
        out.state.schema = (out.state.auditRemainder||out.state.causalStories||out.state.motherOfLearning)?11:out.state.bookWorldCampaign?10:9;
        out.state.simulation.workPlans.cursors.player.goal = copy(d.goal);
    }
    if(d.stockPolicy != null) {
        validateStockDefinition(d,registry.simulation.commands);
        assert(out.state.referenceGameplay?.schema === 1 && [9,10,11].includes(out.state.schema), 'Enroll the reference gameplay before accepting a stock reserve.');
        out.state.simulation.workPlans.schema = WORK_PLAN_SCHEMA;
        const c = out.state.simulation.workPlans.cursors.player;
        c.stockPolicy = copy(d.stockPolicy); c.stockHold = false; c.stockAcceptedBatches = 0;
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

// Re-fit K1 (2026-10-22): the latest settled step beside current work, read from
// the common simulation log (capped at 100). No cursor field; nothing mirrors the job.
function lastSettledStep(state, registry, c, actorId) {
    const labels = [...new Set(c.steps.filter(s => s.kind === 'command').map(s => registry.simulation.commands.get(s.commandId)?.label).filter(Boolean))];
    const entry = (state.simulation.log || []).findLast(e => e.at >= c.startedAt && (!e.audience || e.audience.includes(actorId)) &&
        labels.some(l => e.text === `${l} completed.` || e.text.startsWith(`${l} stopped:`) || e.text.startsWith(`${l} cancelled;`)));
    if(!entry) return {text:'Last step result: none recorded since this itinerary began.', at:null, result:null};
    const result = entry.text.endsWith(' completed.') ? 'completed' : entry.text.includes(' stopped:') ? 'stopped' : 'cancelled';
    return {text:`Last step result: ${entry.text} ${Math.max(0,state.clock-entry.at)} game min ago.`, at:entry.at, result};
}

export function workPlanView(state, registry, planRegistry, context) {
    const c = root(state)?.cursors[context.actorId || 'player'];
    if(!c) return null;
    const job = liveJob(state,c), stockEnded = c.stockPolicy && (['complete','cancelled'].includes(c.status) ||
        c.stockAcceptedBatches === c.stockPolicy.maxAcceptedBatches && !job);
    const next = stockEnded ? null : c.steps[c.index];
    let quote = null;
    if(next?.kind === 'command' && !job) {
        const d = registry.simulation.commands.get(next.commandId);
        if(d?.revision === next.revision) quote = previewSimulationCommand(state,registry,next.commandId,{...context,targetId:next.targetId || null});
    }
    const stock = c.stockPolicy ? auditedKitReserveFacts(state,context) : null;
    const holding = c.stockPolicy && !['complete','cancelled'].includes(c.status) && !job &&
        (stock['auditedKitReserve.available'] >= c.stockPolicy.upper || c.stockHold && stock['auditedKitReserve.available'] > c.stockPolicy.lower);
    return {id:c.id,definitionId:c.definitionId,label:c.label,status:c.status,index:c.index,total:c.steps.length,reason:c.reason,
        ...(c.stockPolicy ? {stockPolicy:copy(c.stockPolicy),stockHold:c.stockHold,holding:!!holding,available:stock['auditedKitReserve.available'],
            acceptedBatches:c.stockAcceptedBatches,remainingBatches:c.stockPolicy.maxAcceptedBatches-c.stockAcceptedBatches} : {}),
        steps:c.steps.map((s,index) => ({id:s.id,kind:s.kind,label:s.kind === 'command' ? registry.simulation.commands.get(s.commandId)?.label || 'Retained work step' : s.label,
            status:index < c.index ? 'complete' : stockEnded ? 'unused' : index === c.index ? job ? 'accepted' : 'next' : 'future'})),
        next: next ? {id:next.id,kind:next.kind,label:quote?.label || next.label || 'Next known step',eligible:!!quote?.eligible && !holding && (!c.stockPolicy || c.stockAcceptedBatches < c.stockPolicy.maxAcceptedBatches),
            reasons:job ? [] : holding ? [c.reason || 'The reserve is holding. No next batch is reserved.'] : quote ? quote.visible ? quote.reasons : ['Requirements not yet known.'] : c.reason ? [c.reason] : [],
            duration:quote?.duration || 0,costs:quote?.eligible && !holding && (!c.stockPolicy || c.stockAcceptedBatches < c.stockPolicy.maxAcceptedBatches) ? quote.costs : [],targetId:next.targetId || null} : null,
        accepted:job ? {id:job.id,label:job.label,remaining:Math.max(0,job.due-state.clock),cancellation:job.cancellation} : null,
        canResume:c.status === 'paused',canPause:c.status === 'running',canCancel:!['complete','cancelled'].includes(c.status),
        canForget:!job,definitionRetained:!planRegistry || planRegistry.has(c.definitionId),lastResult:lastSettledStep(state,registry,c,context.actorId || 'player')};
}
