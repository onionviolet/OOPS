// Narrow new-family hooks for the existing common scheduler and commit plan.
// Root calls retention before boundary selection/expiry, stamps accepted jobs,
// and calls completion before the generic job path. Nothing publishes here.
import {assert, copy, natural, meets} from './simulation_contracts.js';
import {applySimulationEffects, refundCosts} from './simulation_effects.js';
import {applySituationEffect} from './causal_situations.js';
import {LORE_PRACTICE_IDS as I, LORE_PRACTICE_KEYS as K, lorePracticeDefinitions as D, lorePracticeCommand, lorePracticeKnowledge} from './lore_practice_content.js';
import {lorePracticeFacts, lorePracticeLocalSupported, exactLorePracticeJob, lorePracticeSame} from './lore_practice_facts.js';

const world = state => state.worlds[I.world].facts;
const family = id => id?.startsWith('lore.work.') || id?.startsWith('lore.warning.');
const contextFor = (out, contexts, actor) => {
    const base = contexts[actor] || contexts.player || {}, s = out.state.simulation;
    return {...base, actorId: actor, busy: false, nativeBody: contexts.player?.nativeBody || base.nativeBody,
        nativeAlive: contexts.player?.nativeAlive ?? base.nativeAlive, nativeCareFrame: contexts.player?.nativeCareFrame || base.nativeCareFrame,
        external: out.external, gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment,
        facts: {...base.facts, location: actor === 'player' ? contexts.player?.facts?.location || s.people.player.location : s.people[actor]?.location}};
};
const apply = (out, effects, registry, context, cause) => applySimulationEffects(out, effects, context, registry, cause);
const nextCause = state => `simulation:${++state.sequence}`;
export function installLorePracticeControllers(state, registry) {
    if(state.schema !== 11 || state.auditRemainder?.schema !== 1 || !state.simulation) return;
    for(const d of D.controllers) {
        const id = d.id.startsWith('lore.work.') ? I.shift : I.rain;
        if(!state.simulation.situations?.[id] || state.simulation.people[d.actorId]?.life !== 'alive') continue;
        assert(lorePracticeSame(registry.simulation.controllers.get(d.id), d), 'Unsupported original local controller.');
        const existing = Object.entries(state.simulation.controllers).some(([key, c]) => (c.definitionId || key) === d.id && c.actorId === d.actorId);
        if(!existing) state.simulation.controllers[`${d.actorId}:${d.id}`] = {definitionId: d.id, actorId: d.actorId, interval: d.interval, due: state.clock + d.interval};
    }
}
export function lorePracticeControllerAllowed(state, definition) {
    if(!family(definition.id)) return true;
    return state.schema === 11 && state.auditRemainder?.schema === 1 && !!state.simulation?.situations?.[definition.id.startsWith('lore.work.') ? I.shift : I.rain];
}
export function lorePracticeSimulationContexts(state, contexts = {}) {
    const out = {...contexts};
    for(const id of [I.neri, I.orr, I.ressa]) if(state.simulation?.people?.[id]) out[id] = {...contexts.player, ...contexts[id], actorId: id, targetId: null, busy: false,
        nativeBody: contexts.player?.nativeBody, nativeAlive: contexts.player?.nativeAlive, nativeCareFrame: contexts.player?.nativeCareFrame,
        facts: {...contexts.player?.facts, ...contexts[id]?.facts, location: state.simulation.people[id].location}};
    return out;
}
export function retainLorePracticeWindows(state, from, through, contexts = {}) {
    assert(natural(from) && natural(through) && through >= from, 'Invalid lore retention interval.');
    if(!state.simulation || through === from) return;
    const context = contexts.player || contexts;
    if(lorePracticeLocalSupported(state, context)) return;
    const elapsed = through - from, w = world(state);
    for(const [id, prefix, terminal] of [[I.shift, 'lore.work', ['delivered', 'late', 'declined', 'withdrawn']], [I.rain, 'lore.warning', ['rained', 'closed']]]) {
        const r = state.simulation.situations?.[id];
        if(!r || terminal.includes(r.phase)) continue;
        assert(natural(w[`${prefix}.pauseMinutes`]), 'Retained lore deadline needs its existing typed pause record.');
        r.deadline += elapsed; w[`${prefix}.pauseMinutes`] += elapsed;
    }
    for(const j of state.simulation.jobs) if(family(j.commandId)) {
        assert(j.loreTiming?.schema === 1 && natural(j.loreTiming.paused), 'Unsupported lore job timing; preserve it for its matching reader.');
        j.due += elapsed; j.loreTiming.paused += elapsed;
    }
}
export function lorePracticeTimersSupported(state, contexts = {}) {return lorePracticeLocalSupported(state, contexts.player || contexts);}
export function nextLorePracticeBoundary(state, contexts = {}) {
    if(!lorePracticeTimersSupported(state, contexts)) return Infinity;
    const s = state.simulation;
    return Math.min(...[[I.shift, ['delivered', 'late', 'declined', 'withdrawn']], [I.rain, ['rained', 'closed']]].map(([id, terminal]) => {
        const r = s?.situations?.[id]; return r && !terminal.includes(r.phase) ? r.deadline : Infinity;
    }));
}

function currentSample(state) {
    const report = state.simulation.knowledge.player?.['lore.warning.sample'], r = state.simulation.situations[I.rain];
    assert(report && r && report.basis?.situationId === I.rain && report.basis.attributedTo === 'player', 'A warning requires an actual attributable local sample.');
    return {schema: 1, situationId: I.rain, situationCause: r.cause, sourceActor: 'player', sourceCause: report.cause,
        observedAt: report.at, location: 'Village', drainOpen: state.actors.player.facts['lore.warning.sampleDrainOpen']};
}
function relaySample(state) {
    const r = state.simulation.knowledge[I.orr]?.['lore.warning.relay_source'];
    assert(r, 'The relay needs Orr’s actual retained message source.');
    const value = JSON.parse(r.value);
    assert(value.schema === 1 && value.sourceActor === 'player' && value.situationId === I.rain, 'Unsupported private relay source.');
    return value;
}
export function stampLorePracticeJob(state, job, context = {}) {
    const d = lorePracticeCommand(job?.commandId);
    if(!d) return job;
    if(d.duration && !job.loreTiming) job.loreTiming = {schema: 1, startedAt: state.clock, duration: job.due - state.clock, paused: 0};
    if(d.id === I.exposure && !job.loreExposure) {
        assert(context.lorePracticeHost === true && context.loreExposureHost === true && context.loreExposureDescriptor, 'The internal material trial requires its trusted host-derived remaining-window descriptor.');
        job.loreExposure = copy(context.loreExposureDescriptor);
    }
    if(['lore.warning.signed', 'lore.warning.ask_relay'].includes(d.id) && !job.loreSample) job.loreSample = currentSample(state);
    if(d.id === 'lore.warning.orr_relay' && !job.loreSample) job.loreSample = relaySample(state);
    if(d.id === 'lore.work.orr_repair' && !job.loreOverlap) job.loreOverlap = {schema: 1, funded: ['shift1', 'shift2'].flatMap(name => {
        const receipt = state.simulation.knowledge.player?.[`remainder_livelihood.${name}.funding`];
        return receipt && state.actors.player.completed[`remainder_livelihood.fund_${name}`] === 1 && !state.actors[I.orr].completed[`remainder_livelihood.work_${name}`] ? [{name, cause: receipt.cause}] : [];
    })};
    return job;
}
export function lorePracticeAdmissionGuard(state, definition, context) {
    if(!family(definition?.id)) return;
    if(context.actorId === 'player') assert(context.lorePracticeHost === true, 'Choose the current attributed local-scene host quote.');
    if(definition.id === I.exposure) {
        const quote = lorePracticeExposureQuote(state, context);
        assert(context.lorePracticeHost === true && context.loreExposureHost === true && lorePracticeSame(context.loreExposureDescriptor, quote.descriptor) && definition.duration === quote.duration,
            'Only the actual retained positive remaining rain window may admit this internal material job.');
    }
}
export function lorePracticeExposureQuote(state, context = {}) {
    const r = state.simulation?.situations?.[I.rain], f = lorePracticeFacts(state, context), remaining = r?.deadline - state.clock;
    assert(f['lore.local'] && f['lore.warning.beforeRain'] && f['lore.warning.responseSettled'] && f['lore.warning.trialAccepted'] && natural(remaining) && remaining > 0 && remaining <= 20,
        'Entrust only a new stave after the recipient’s actual prior response and before the retained rain endpoint.');
    return {duration: remaining, descriptor: {schema: 1, situationId: I.rain, operation: 'expose_stave', ownerId: I.ressa, key: K.sound, count: 1,
        situationCause: r.cause, admittedAt: state.clock, remaining, pauseAtAdmission: world(state)['lore.warning.pauseMinutes']}};
}

function sampleValid(state, sample) {
    const r = state.simulation.situations?.[I.rain];
    return sample?.schema === 1 && sample.situationId === I.rain && sample.situationCause === r?.cause && sample.sourceActor === 'player' &&
        /^simulation:[1-9][0-9]*$/.test(sample.sourceCause || '') && natural(sample.observedAt) && sample.observedAt >= r.openedAt && sample.observedAt <= state.clock && sample.location === 'Village' &&
        typeof sample.drainOpen === 'boolean' && sample.drainOpen === world(state)['lore.warning.drainOpen'];
}
function stopJob(out, job, registry, context, cause) {
    apply(out, refundCosts(job.costs, true), registry, context, cause);
    if(job.claim) delete out.state.simulation.claims[job.claim];
    if(job.siteId) delete out.state.simulation.sites[job.siteId].reservations[job.id];
    if(job.commandId === I.exposure) world(out.state)['lore.warning.trialCancelled'] = true;
    const log = {at: out.state.clock, cause, text: `${job.label} stopped: current support was lost; exact reserved inputs returned without an output.`, audience: copy(job.audience || [job.actorId])};
    out.state.simulation.log.push(log); if(out.state.simulation.log.length > 100) out.state.simulation.log.shift();
}
function dynamicReceipts(out, job, registry, context) {
    const state = out.state, id = job.commandId, w = world(state);
    if(id === 'lore.warning.ask_relay') apply(out, [lorePracticeKnowledge('lore.warning.relay_source', JSON.stringify(job.loreSample), I.orr, 'player')], registry, context, job.id);
    if(['lore.warning.signed', 'lore.warning.orr_relay'].includes(id)) {
        const speaker = id === 'lore.warning.signed' ? 'player' : I.orr, sample = job.loreSample;
        apply(out, [lorePracticeKnowledge('lore.warning.received_source', JSON.stringify({...sample, ...(speaker === I.orr ? {sourceActor: I.orr, sourceCause: job.id} : {})}), I.ressa, speaker),
            lorePracticeKnowledge('lore.warning.received', `${speaker === 'player' ? 'The traveler signed and personally delivered' : 'Orr delivered without naming the sender'} a report from played minute ${sample.observedAt} at the Village notch. The observation found the notch ${sample.drainOpen ? 'open' : 'blocked'}. It predicts wetness only while a newly entrusted load is exposed and the notch remains blocked. Reception is not a performed response.`, I.ressa, speaker)], registry, context, job.id);
    }
    if(id === 'lore.work.collect_kit') {
        const shift = state.simulation.situations[I.shift];
        const timely = state.clock < shift.deadline;
        apply(out, [{type: 'world', worldId: I.world, key: 'lore.work.inspectionStatus', value: timely ? 'prepared_before_window' : 'missed'},
            lorePracticeKnowledge('lore.work.inspection_result', timely ? 'Collected the real extra kit before Orr’s declared local inspection window closed. The inspection is prepared; no field result or payment is claimed by this collection.' : 'Collected the actual kit after the local inspection window. The room and kit remain useful, but this missed inspection is not restored.', 'player', I.neri)], registry, context, job.id);
    }
    if(id === 'lore.work.account') apply(out, [lorePracticeKnowledge('lore.work.account', `Neri’s later account: shutter ${w['lore.work.shutterRepaired'] ? `installed by ${w['lore.work.repairWorker'] === 'player' ? 'you' : 'Orr'}` : 'not installed'}; extra binding ${w['lore.work.neriResponse'] || 'not funded'}; extra kit ${w['lore.work.kitCollected'] ? 'actually collected' : 'not collected'}; local inspection ${w['lore.work.inspectionStatus'] || (state.clock >= state.simulation.situations[I.shift].deadline ? 'missed' : 'still open')}. Existing residence and earlier property remain retained.`, 'player', I.neri)], registry, context, job.id);
    if(id === 'lore.work.orr_repair') apply(out, [lorePracticeKnowledge('lore.work.orr_overlap', job.loreOverlap.funded.length ?
        `During my actually admitted four-minute cover, my own body and kit were reserved. My separately funded ${job.loreOverlap.funded.map(f => f.name).join(' and ')} could not start overlapping work. Those retained shifts can later seek their own admission; no imaginary wage or debt was awarded for the delay.` :
        'My own body and kit were occupied by the actual four-minute cover. No already funded unfinished shift was present at admission, so no forgone job or wage is invented.', I.orr)], registry, context, job.id);
    if(id === 'lore.work.orr_account') {
        const overlap = state.simulation.knowledge[I.orr]?.['lore.work.orr_overlap'];
        apply(out, [lorePracticeKnowledge('lore.work.orr_account', `Orr’s account: ${w['lore.work.orrResponse'] ? `the extra cover is ${w['lore.work.orrResponse']}` : 'no extra cover was offered'}. ${overlap?.value || 'No completed cover or delayed funded-shift result is claimed.'}`, 'player', I.orr)], registry, context, job.id);
    }
    if(id === 'lore.warning.account') {
        const receipt = state.simulation.knowledge[I.ressa]?.['lore.warning.received'];
        apply(out, [lorePracticeKnowledge('lore.warning.account', `Ressa’s later account: ${receipt ? `received ${w['lore.warning.messageKind'] === 'signed' ? 'your signed report' : 'Orr’s report without a named sender'}` : 'no message received'}; response ${w['lore.warning.ressaResponse'] || 'not undertaken'}; rain ${w['lore.warning.rainOccurred'] ? 'actually occurred' : 'still ahead'}; drain currently ${w['lore.warning.drainOpen'] ? 'open' : 'blocked'}; ${w['lore.warning.trialResult'] ? `one actual ${w['lore.warning.trialResult']} trial stave ${w['lore.warning.wetBought'] ? 'sold to you' : 'remains mine'}` : w['lore.warning.trialCancelled'] ? 'the reserved trial was withdrawn; its sound stave remains mine' : 'no material result yet'}. My old supply request and purse were not reissued.`, 'player', I.ressa)], registry, context, job.id);
    }
}
function rain(out, registry, contexts, job) {
    const state = out.state, w = world(state), r = state.simulation.situations[I.rain], ctx = contextFor(out, contexts, I.ressa), cause = job?.id || nextCause(state);
    if(w['lore.warning.rainOccurred']) return;
    assert(state.clock >= r.deadline, 'The physical rain cannot precede its retained endpoint.');
    const sheltered = w['lore.warning.ressaResponse'] === 'sheltered', wet = w['lore.warning.drainOpen'] !== true && !sheltered;
    const effects = [{type: 'world', worldId: I.world, key: 'lore.warning.rainOccurred', value: true},
        {type: 'world', worldId: I.world, key: 'lore.warning.siteWet', value: w['lore.warning.drainOpen'] !== true},
        {type: 'world', worldId: I.world, key: 'lore.warning.rainAt', value: state.clock}];
    if(job) effects.push({type: 'item', actor: I.ressa, key: wet ? K.wet : K.sound, amount: 1, reservationReturn: true},
        {type: 'world', worldId: I.world, key: 'lore.warning.trialResult', value: wet ? 'wet' : 'sound'},
        {type: 'world', worldId: I.world, key: 'lore.warning.trialCause', value: cause},
        lorePracticeKnowledge('lore.warning.rain_result', `${wet ? 'The current blocked notch and my expressly exposed position wetted the one entrusted sound stave into one Wet repair stave.' : sheltered ? 'My preselected sheltered position preserved the one expressly entrusted Sound repair stave.' : 'The current open notch removed flood support and preserved the one expressly entrusted Sound repair stave.'} The one reserved count returned to my actual stock. No log, kit or offcut was created.`, I.ressa));
    apply(out, effects, registry, ctx, cause);
    applySituationEffect(state, {type: 'situation', operation: 'advance', situationId: I.rain, expected: [r.phase], phase: 'rained'}, registry.simulation, cause);
}
export function completeLorePracticeJob(out, job, registry, contexts = {}) {
    const d = lorePracticeCommand(job?.commandId);
    if(!d) return false;
    const state = out.state, ctx = {...contextFor(out, contexts, job.actorId), ...job.context, lorePracticeHost: true, lorePracticeReservation: job};
    if(d.duration) assert(exactLorePracticeJob(state, job, {popped: true}), 'This popped lore job lost its exact accepted definition/reservation.');
    else assert(lorePracticeSame(job.costs, d.costs) && lorePracticeSame(job.effects, d.effects) && job.revision === 1, 'Unsupported immediate lore command.');
    const f = lorePracticeFacts(state, ctx);
    const present = (job.participants || [job.actorId]).every(id => state.simulation.people[id]?.life === 'alive' && state.actors[id]?.worldId === I.world &&
        (!job.completionSupport?.coLocated || state.simulation.people[id].location === job.completionSupport.location || id === 'player' && contexts.player?.facts?.location === job.completionSupport.location));
    const sampleOkay = !job.loreSample || sampleValid(state, job.loreSample);
    if(d.duration && (!present || !f['lore.local'] || job.completionSupport && !meets(job.completionSupport.requires, f) || !sampleOkay)) {
        stopJob(out, job, registry, ctx, nextCause(state)); return true;
    }
    if(d.id === I.exposure) {
        if(!f['lore.ressaHands'] || state.simulation.people[I.ressa].location !== 'Village') {stopJob(out, job, registry, ctx, nextCause(state)); return true;}
        rain(out, registry, contexts, job);
    } else {apply(out, job.effects, registry, ctx, job.id); dynamicReceipts(out, job, registry, ctx);}
    if(job.claim && state.simulation.claims[job.claim]?.status === 'held') apply(out, [{type: 'claim', operation: 'settle', key: job.claim}], registry, ctx, job.id);
    state.actors[job.actorId].completed[job.commandId] = (state.actors[job.actorId].completed[job.commandId] || 0) + 1;
    if(job.siteId) delete state.simulation.sites[job.siteId].reservations[job.id];
    state.simulation.log.push({at: state.clock, cause: job.id, text: `${job.label} completed.`, ...(job.audience ? {audience: copy(job.audience)} : {})});
    if(state.simulation.log.length > 100) state.simulation.log.shift();
    return true;
}
export function reconcileLorePractice(before, out, registry, contexts = {}) {
    const state = out.state, s = state.simulation;
    if(!s || state.auditRemainder?.schema !== 1) return;
    installLorePracticeControllers(state, registry);
    const context = contextFor(out, contexts.player ? contexts : {player: contexts}, 'player');
    if(!lorePracticeLocalSupported(state, context)) return;
    const w = world(state), shift = s.situations?.[I.shift], r = s.situations?.[I.rain];
    const change = (id, phase) => {
        const current = s.situations[id];
        if(current.phase !== phase) applySituationEffect(state, {type: 'situation', operation: 'advance', situationId: id, expected: [current.phase], phase}, registry.simulation, nextCause(state));
    };
    if(shift && !['delivered', 'late', 'declined', 'withdrawn'].includes(shift.phase)) {
        if(w['lore.work.declined']) change(I.shift, 'declined');
        else if(state.clock >= shift.deadline) {w['lore.work.inspectionStatus'] ||= 'missed'; change(I.shift, 'late');}
        else if(w['lore.work.kitCollected']) change(I.shift, 'delivered');
        else if(w['lore.work.shutterRepaired']) change(I.shift, 'repaired');
        else if(w['lore.work.orrResponse'] === 'accepted' || w['lore.work.neriResponse'] === 'accepted') change(I.shift, 'agreed');
    }
    if(r && !w['lore.warning.rainOccurred']) {
        if(state.clock >= r.deadline && !(s.jobs || []).some(j => j.commandId === I.exposure)) rain(out, registry, contexts.player ? contexts : {player: contexts});
        else if(w['lore.warning.messageDelivered'] && r.phase === 'observed') change(I.rain, 'warned');
    }
}
export const advanceLoreWarning = reconcileLorePractice;
export function recordLorePracticeCancellation(out, job) {
    if(job?.commandId === I.exposure) world(out.state)['lore.warning.trialCancelled'] = true;
}
