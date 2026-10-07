// Narrow hooks for the one simulation/job/time publisher. These operate only
// on the staged plan after real costs/effects, never on a rendered preview.
import {WORLD_COMPLETION_LENS_IDS as I, WORLD_COMPLETION_LENS_POLICY as P, worldCompletionLensCommand,
    worldCompletionLensIsMeasurement, worldCompletionLensFrozenDefinition} from './world_completion_lens_content.js';
import {worldCompletionLensCurrentSample, worldCompletionLensLoan, worldCompletionLensClockSupported,
    worldCompletionLensBody, exactWorldCompletionLensJob, validateWorldCompletionLensState} from './world_completion_lens_facts.js';

const check = (ok, message) => {if(!ok) throw new Error(message);};
const natural = n => Number.isSafeInteger(n) && n >= 0;
const count = (state, id) => state.actors?.player?.completed?.[id] || 0;
export function frozenWorldCompletionLensRegistry(state, registry) {
    const loan = worldCompletionLensLoan(state), cause = loan?.cause ?? null;
    const commands = new Map(registry.simulation.commands);
    for(const [id, d] of commands) if(d.group === I.group)
        commands.set(id, worldCompletionLensFrozenDefinition(d, cause));
    return {...registry, simulation: {...registry.simulation, commands}};
}

// Host calls once after commitSimulationCommand and before final validation /
// publication. Timed metadata comes from the actual job and fresh source view;
// instant duty records come from the committed knowledge/custody pair.
export function recordWorldCompletionLensCommandCommit(before, out, commandId, context = {}) {
    const d = worldCompletionLensCommand(commandId);
    check(d, 'Unknown world-completion lens command.');
    const state = out.state, f = state.actors.player.facts;
    if(d.duration) {
        const job = state.simulation.jobs.find(j => j.commandId === commandId && j.actorId === 'player' && j.sequence > before.sequence);
        check(job && out.commitment?.id === job.id && count(state, commandId) === count(before, commandId), 'Lens metadata needs the actual newly accepted work.');
        const body = worldCompletionLensBody(before, context);
        check(body, 'Lens work needs the actual accepting human body.');
        job.worldCompletionLens = {schema: 1, commandId, acceptedAt: before.clock, pausedMinutes: 0, bodyId: body.id};
        if(worldCompletionLensIsMeasurement(commandId)) {
            const sample = worldCompletionLensCurrentSample(before, context);
            check(sample, 'A lens measurement needs the exact current committed sample.');
            Object.assign(job.worldCompletionLens, {sampleCause: sample.cause, sampleAt: sample.at});
            if(commandId.includes('measure_loan_')) {
                const loan = worldCompletionLensLoan(before);
                check(loan, 'Loan examination needs the current exact owner and deposit.');
                job.worldCompletionLens.loanCause = loan.cause;
            }
        }
        check(exactWorldCompletionLensJob(state, job), 'Accepted lens work lost its frozen contract.');
        out.commitment = structuredClone(job);
        return;
    }
    check(count(state, commandId) === count(before, commandId) + 1, 'Lens contact requires actual completed command effects.');
    if(commandId === I.borrow) {
        const custody = state.simulation.custody[I.loanId], receipt = state.simulation.knowledge.player[I.prefix + 'loan'];
        check(custody && custody.cause === receipt?.cause && custody.at === state.clock && state.actors.player.resources[I.deposit] === P.deposit,
            'Lens duty needs the actual conserved loan and deposit acceptance.');
        Object.assign(f, {[I.prefix + 'loanCause']: custody.cause, [I.prefix + 'loanAt']: custody.at,
            [I.prefix + 'loanDue']: state.clock + P.duration, [I.prefix + 'loanPause']: 0});
    } else if(commandId === I.prefix + 'return_village' || commandId === I.prefix + 'return_room') {
        const receipt = state.simulation.knowledge.player[I.prefix + 'return'];
        check(worldCompletionLensLoan(before) && !state.simulation.custody[I.loanId] && receipt?.at === state.clock &&
            state.actors.player.resources[I.deposit] === 0, 'A once refund requires the actual exact custody return.');
        Object.assign(f, {[I.prefix + 'returnCause']: receipt.cause, [I.prefix + 'returnAt']: receipt.at});
    }
}

// Called only on the successful completion branch, after applied effects and
// the completion counter, while the original site reservation still exists.
// The shared executor must pass the popped job into its live support context.
export function recordWorldCompletionLensJobCompletion(out, job, registry) {
    const d = worldCompletionLensCommand(job?.commandId);
    if(!d?.duration) return false;
    check(exactWorldCompletionLensJob(out.state, job) && job.due <= out.state.clock && count(out.state, d.id) > 0,
        'Lens completion requires exact actually popped paid work.');
    if(worldCompletionLensIsMeasurement(d.id)) {
        const state = out.state, f = state.actors.player.facts, meta = job.worldCompletionLens;
        const r = state.simulation.knowledge.player[I.prefix + 'measurement'];
        check(r?.cause === job.id && r.at === state.clock, 'No observed sample may precede its committed examination.');
        Object.assign(r.basis, {sampleCause: meta.sampleCause, sampleAt: meta.sampleAt, bodyId: meta.bodyId, commandId: d.id});
        Object.assign(f, {[I.prefix + 'sampleCause']: meta.sampleCause, [I.prefix + 'sampleAt']: meta.sampleAt,
            [I.prefix + 'measurementCause']: job.id, [I.prefix + 'measurementAt']: state.clock,
            [I.prefix + 'measurementCommand']: d.id, [I.prefix + 'measurementBodyId']: meta.bodyId});
    }
    return true;
}

// Call once for each joined from→through interval before deadline consumers.
// Each accepted job preserves its original acceptance and accumulates a typed
// pause while its exact accepting body/home clock is unsupported. Lost required
// room rights, sample or consenting participant still refunds at completion.
export function retainWorldCompletionLensWindow(state, from, through, context = {}) {
    check(natural(from) && natural(through) && through >= from, 'Invalid lens retention interval.');
    const f = state.actors?.player?.facts, loan = worldCompletionLensLoan(state);
    const delta = through - from, supported = worldCompletionLensClockSupported(state, context), body = worldCompletionLensBody(state, context);
    let changed = false;
    for(const job of state.simulation?.jobs || []) {
        if(!job.commandId?.startsWith(I.prefix)) continue;
        check(exactWorldCompletionLensJob(state, job), 'Retain only exact accepted lens work.');
        if(job.due > from && (!supported || body?.id !== job.worldCompletionLens.bodyId)) {
            job.due += delta; job.worldCompletionLens.pausedMinutes += delta; changed ||= delta > 0;
        }
    }
    if(loan && f[I.prefix + 'overdue'] !== true && f[I.prefix + 'loanDue'] > from && !supported) {
        f[I.prefix + 'loanDue'] += delta; f[I.prefix + 'loanPause'] += delta; changed ||= delta > 0;
    }
    return changed;
}
export function nextWorldCompletionLensBoundary(state, context = {}) {
    if(!worldCompletionLensLoan(state) || state.actors.player.facts[I.prefix + 'overdue'] === true || !worldCompletionLensClockSupported(state, context)) return null;
    return Math.max(state.clock, state.actors.player.facts[I.prefix + 'loanDue']);
}
export function advanceWorldCompletionLensBoundary(out, context = {}) {
    const state = out.state, f = state.actors?.player?.facts, loan = worldCompletionLensLoan(state);
    if(!loan || f[I.prefix + 'overdue'] === true || f[I.prefix + 'loanDue'] > state.clock || !worldCompletionLensClockSupported(state, context)) return false;
    const cause = I.prefix + `overdue:${++state.sequence}`;
    Object.assign(f, {[I.prefix + 'overdue']: true, [I.prefix + 'overdueAt']: state.clock, [I.prefix + 'overdueCause']: cause});
    // The obligation is the player's accepted public contract. Vela's actual
    // refusal account is disclosed only by the separate present-contact action.
    state.simulation.log.push({at: state.clock, text: 'The agreed amber-lens return is overdue. The exact prism and original deposit still need return.',
        cause, audience: ['player']});
    state.simulation.log = state.simulation.log.slice(-100);
    return true;
}
export function worldCompletionLensMeasuredSample(state, sampleCause) {
    const f = state.actors?.player?.facts || {}, r = state.simulation?.knowledge?.player?.[I.prefix + 'measurement'];
    return typeof sampleCause === 'string' && !!r && r.basis?.sampleCause === sampleCause && f[I.prefix + 'sampleCause'] === sampleCause &&
        f[I.prefix + 'measurementCause'] === r.cause && f[I.prefix + 'measurementAt'] === r.at &&
        worldCompletionLensIsMeasurement(r.basis?.commandId) && count(state, r.basis.commandId) > 0;
}
export function finishWorldCompletionLensPlan(out, registry) {
    validateWorldCompletionLensState(out.state, registry);
    return out;
}
