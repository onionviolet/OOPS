// Narrow joins into the incumbent scheduler. The root calls these from its
// actual start/success/advance paths; no parallel scheduler or publisher.
import {assert, copy, natural} from './simulation_contracts.js';
import {WORLD_COMPLETION_LEARNING_IDS as I, WORLD_COMPLETION_LEARNING_KEYS as K, worldCompletionLearningDefinitions as D, worldCompletionLearningCollectDefinition} from './world_completion_learning_content.js';
import {worldCompletionLearningEnrolled, validWorldCompletionLearningEvidence, worldCompletionLearningFacts, decodeWorldCompletionLearningRecord,
    worldCompletionLearningBodyId, exactWorldCompletionLearningJob} from './world_completion_learning_facts.js';
import {worldCompletionStripKey, worldCompletionStripStamp} from './world_completion_strip.js';

const P = I.prefix, ids = new Set(D.commands.map(d => d.id));
const lesson = id => [P + 'learn_player', P + 'learn_neri'].includes(id);
const measured = id => lesson(id) || [P + 'make_player', P + 'make_neri'].includes(id);
export function freezeWorldCompletionLearningJob(state, job, context = {}) {
    if(!ids.has(job.commandId) || !D.commands.find(d => d.id === job.commandId)?.duration) return;
    const bodyId = worldCompletionLearningBodyId(state, context, job.actorId);
    assert(bodyId, 'Datum work needs the actual accepting learner body.');
    job.worldCompletionLearningClock = {schema: 1, acceptedAt: state.clock, pausedMinutes: 0, bodyId};
    if(!measured(job.commandId)) return;
    const e = {schema: 1, sampleCause: context.facts?.['worldCompletion.sampleCause'], measuredCause: context.facts?.['worldCompletion.measuredCause'],
        teacherSourceCause: lesson(job.commandId) ? state.actors?.[I.eda]?.sources?.[I.teacherMethod]?.receiptId : null};
    assert(validWorldCompletionLearningEvidence(state, e, {lesson: lesson(job.commandId)}), 'Datum admission needs actual committed sample, measurement and teacher-source causes.');
    assert(Number(e.measuredCause.split(':')[1]) < job.sequence, 'A datum job follows its real completed measurement.');
    job.worldCompletionLearning = e;
}
export function retainWorldCompletionLearningWindow(state, from, through, context = {}) {
    assert(natural(from) && natural(through) && through >= from, 'Invalid supported datum interval.');
    if(!worldCompletionLearningEnrolled(state)) return false;
    const delta = through - from, supported = worldCompletionLearningFacts(state, {...context, actorId: 'player'})['worldCompletionLearning.local'];
    let changed = false;
    for(const job of state.simulation.jobs.filter(j => j.commandId?.startsWith(P))) {
        assert(exactWorldCompletionLearningJob(state, job), 'Retain only the exact accepted datum job.');
        if(job.due > from && !supported) {job.due += delta; job.worldCompletionLearningClock.pausedMinutes += delta; changed ||= delta > 0;}
    }
    if(!supported) for(const c of Object.values(state.simulation.controllers)) if(c.definitionId === I.controller && c.due > from) {c.due += delta; changed ||= delta > 0;}
    return changed;
}
export function recordWorldCompletionLearningCompletion(state, job) {
    if(!ids.has(job.commandId)) return;
    const actual = state.actors?.[job.actorId]?.completed?.[job.commandId];
    assert(natural(actual) && actual > 0, 'Record datum evidence only after actual successful common completion.');
    if(measured(job.commandId)) {
        const isLesson = lesson(job.commandId), e = {...copy(job.worldCompletionLearning), cause: job.id, at: state.clock, actorId: job.actorId};
        assert(validWorldCompletionLearningEvidence(state, e, {lesson: isLesson, complete: true}), 'Successful datum work lost its frozen actual causes.');
        const receipt = state.simulation?.knowledge?.[job.actorId]?.[P + (isLesson ? 'procedure' : 'made')];
        assert(receipt?.cause === job.id && receipt.at === state.clock, 'Datum evidence requires this exact completed procedure or material receipt.');
        state.actors[job.actorId].facts[P + (isLesson ? 'lessonEvidence' : 'madeEvidence')] = JSON.stringify(e);
    } else if(job.commandId === P + 'collect') {
        const e = decodeWorldCompletionLearningRecord(state.actors?.[I.neri]?.facts?.[P + 'madeEvidence']);
        assert(validWorldCompletionLearningEvidence(state, e, {complete: true}) && e.actorId === I.neri &&
            state.simulation?.knowledge?.player?.[P + 'collected']?.cause === job.id, 'Exact handover needs Neri’s own real strip-production receipt.');
        state.actors.player.facts[P + 'receivedEvidence'] = JSON.stringify(e);
    } else if([P + 'account_village', P + 'account_shack'].includes(job.commandId)) {
        const w = state.worlds[I.world].facts;
        state.actors.player.facts[P + 'publicAccount'] = JSON.stringify({schema: 1, response: w[P + 'response'] || 'unoffered', released: w[P + 'released'] === true,
            location: state.simulation.people[I.neri].location, cause: job.id, at: state.clock});
    }
}
// Call only after common completion succeeds and increments the command. The
// injected incumbent effect executor stages the one actual stamped output in
// this same plan. A cancelled/unsupported job never reaches this helper.
export function completeWorldCompletionLearningJob(out, job, registry, applyEffects) {
    if(!ids.has(job.commandId)) return false;
    recordWorldCompletionLearningCompletion(out.state, job);
    if([P + 'make_player', P + 'make_neri'].includes(job.commandId)) {
        const meta = job.worldCompletionLearning, stamp = {schema: 1, sampleCause: meta.sampleCause, measuredCause: meta.measuredCause, productionCause: job.id, makerId: job.actorId};
        const key = worldCompletionStripKey(stamp), productId = P + 'product.' + job.sequence;
        assert(!out.state.simulation.knowledge?.[job.actorId]?.[productId] && typeof applyEffects === 'function', 'Actual stamped strip production must stage once through the incumbent effect executor.');
        applyEffects(out, [{type: 'item', actor: job.actorId, key, amount: 1},
            {type: 'knowledge', actor: job.actorId, key: productId, stage: 'seen', value: JSON.stringify(stamp),
                basis: {kind: 'observation', attributedTo: job.actorId, situationId: I.situation}}], job.context, registry, job.id);
    }
    return true;
}
export function frozenWorldCompletionLearningRegistry(state, registry) {
    const e = decodeWorldCompletionLearningRecord(state.actors?.[I.neri]?.facts?.[P + 'madeEvidence']);
    const key = validWorldCompletionLearningEvidence(state, e, {complete: true}) ? worldCompletionStripKey({sampleCause: e.sampleCause, measuredCause: e.measuredCause, productionCause: e.cause, makerId: I.neri}) : null;
    const commands = new Map(registry.simulation.commands);
    commands.set(P + 'collect', worldCompletionLearningCollectDefinition(key));
    return {...registry, simulation: {...registry.simulation, commands}};
}
export function installWorldCompletionLearningControllers(state, registry) {
    if(!worldCompletionLearningEnrolled(state) || state.actors?.player?.completed?.[P + 'sponsor'] !== 1 || state.simulation?.people?.[I.neri]?.life !== 'alive') return;
    const d = registry.simulation.controllers.get(I.controller);
    assert(d?.actorId === I.neri && d.interval === 1, 'Sponsored instruction needs its exact declared Neri controller.');
    const exists = Object.entries(state.simulation.controllers).some(([id, c]) => c.actorId === I.neri && (c.definitionId || id) === I.controller);
    if(!exists) state.simulation.controllers[`${I.neri}:${I.controller}`] = {actorId: I.neri, definitionId: I.controller, interval: 1, due: state.clock + 1};
}
export function worldCompletionLearningControllerAllowed(state, definition) {
    return definition.id !== I.controller || worldCompletionLearningEnrolled(state) && state.actors?.player?.completed?.[P + 'sponsor'] === 1;
}
export function worldCompletionLearningSimulationContexts(state, contexts = {}) {
    if(!worldCompletionLearningEnrolled(state) || !state.simulation?.people?.[I.neri]) return contexts;
    const base = contexts[I.neri] || contexts.player || {};
    return {...contexts, [I.neri]: {...base, actorId: I.neri, targetId: null, busy: false,
        facts: {...base.facts, location: state.simulation.people[I.neri].location}}};
}
// Derive an actually carried full stamped key, including older stored/traded
// pieces. A template-only key cannot inherit a later measurement’s identity.
export function worldCompletionLearningStripEvidence(state, context = {}, owner = 'player') {
    if(!worldCompletionLearningEnrolled(state) || !['player', I.neri].includes(owner)) return null;
    const stock = owner === 'player' ? context.gameplay?.player?.inventory : state.simulation?.owners?.[owner];
    for(const [key, n] of Object.entries(stock || {}).sort(([a], [b]) => a.localeCompare(b))) {
        const stamp = worldCompletionStripStamp(key);
        if(n !== 1 || !stamp || stamp.sampleCause !== context.facts?.['worldCompletion.sampleCause'] || stamp.measuredCause !== context.facts?.['worldCompletion.measuredCause'] ||
            Object.values(state.simulation?.custody || {}).some(c => (c.owner === owner || c.holder === owner) && c.key === key) ||
            Object.values(context.equipment?.[owner] || state.simulation?.equipment?.[owner] || {}).includes(key)) continue;
        const product = state.simulation?.knowledge?.[stamp.makerId]?.[P + 'product.' + Number(stamp.productionCause.split(':')[1])];
        if(product?.cause !== stamp.productionCause || product.value !== JSON.stringify(stamp) || product.stage !== 'seen' || !natural(product.at) || product.at > state.clock ||
            product.basis?.kind !== 'observation' || product.basis.attributedTo !== stamp.makerId || product.basis.situationId !== I.situation ||
            Number(stamp.productionCause.split(':')[1]) > state.sequence) continue;
        return {schema: 1, sampleCause: stamp.sampleCause, measuredCause: stamp.measuredCause, teacherSourceCause: null,
            cause: stamp.productionCause, at: product.at, actorId: stamp.makerId, key};
    }
    return null;
}
export function worldCompletionLearningStripMatches(state, context = {}, owner = 'player') {
    const e = worldCompletionLearningStripEvidence(state, context, owner);
    return !!e && worldCompletionLearningFacts(state, context)['worldCompletionLearning.sample'] &&
        e.sampleCause === context.facts?.['worldCompletion.sampleCause'] && e.measuredCause === context.facts?.['worldCompletion.measuredCause'];
}

// Exact additive contributions for the root’s older Neri home conservation
// validator. Old frozen binding jobs and original two attention stay unchanged.
export function worldCompletionLearningNeriConservation(state) {
    const completed = state.actors?.[I.neri]?.completed || {}, player = state.actors?.player?.completed || {};
    const pending = (state.simulation?.jobs || []).filter(j => j.actorId === I.neri && j.commandId?.startsWith(P));
    const spent = id => (completed[P + id] || 0) + pending.filter(j => j.commandId === P + id).length;
    const funded = player[P + 'sponsor'] || 0, learned = completed[P + 'learn_neri'] || 0, made = completed[P + 'make_neri'] || 0;
    const withdrawn = (player[P + 'withdraw_village'] || 0) + (player[P + 'withdraw_shack'] || 0), collected = player[P + 'collect'] || 0;
    const e = decodeWorldCompletionLearningRecord(state.actors?.[I.neri]?.facts?.[P + 'madeEvidence']);
    const stripKey = validWorldCompletionLearningEvidence(state, e, {complete: true}) ? worldCompletionStripKey({sampleCause: e.sampleCause, measuredCause: e.measuredCause, productionCause: e.cause, makerId: I.neri}) : null;
    return {attentionSpent: spent('learn_neri'), staminaSpent: spent('walk_to_bench') + spent('learn_neri') + spent('make_neri') + spent('return_home'),
        escrow: 2 * (funded - spent('learn_neri') - withdrawn), offcut: funded - withdrawn - spent('make_neri') - pending.filter(j => j.commandId === P + 'learn_neri').length,
        strip: made - collected, sourceAllowed: learned === 1, location: completed[P + 'walk_to_bench'] && !completed[P + 'return_home'] ? 'Village' : 'Shack',
        stripKey, stockKeys: [K.offcut, ...(stripKey ? [stripKey] : [])], resourceKeys: [P + 'escrow'], methodId: I.method};
}
