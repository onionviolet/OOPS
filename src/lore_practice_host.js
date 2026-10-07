// Native-facing controls return a single staged plan to the existing durable
// publisher. Same people, inventory owners and common clock throughout.
import {assert, copy} from './simulation_contracts.js';
import {commitSimulationCommand, cancelSimulationJob, previewSimulationCommand} from './simulation.js';
import {LORE_PRACTICE_IDS as I, lorePracticeDefinitions as D, lorePracticeCommand, lorePracticeGroups} from './lore_practice_content.js';
import {lorePracticeFacts, validateLorePractice} from './lore_practice_facts.js';
import {stampLorePracticeJob, installLorePracticeControllers, reconcileLorePractice, lorePracticeExposureQuote, recordLorePracticeCancellation} from './lore_practice_runtime.js';

export function lorePracticeContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...lorePracticeFacts(state, context, registry)}};
}
const stateContext = (out, context, actor = 'player', target = null) => ({...context, actorId: actor, targetId: target, external: out.external,
    gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment, facts: {...context.facts,
        location: actor === 'player' ? context.facts?.location || out.state.simulation.people.player.location : out.state.simulation.people[actor].location}});
const join = (before, after) => {
    after.acquisitions = [...(before.acquisitions || []), ...(after.acquisitions || [])];
    after.unlocks = [...(before.unlocks || []), ...(after.unlocks || [])];
    after.native ||= before.native; after.gameplayBefore = before.gameplayBefore;
    return after;
};
function situationFor(id) {return id.startsWith('lore.work.') ? I.shift : I.rain;}
export function lorePracticePublicCommandIds() {return Object.freeze(D.commands.filter(d => d.actorId === 'player').map(d => d.id));}
function assertToken(state, command) {
    if(['lore.work.begin', 'lore.warning.begin'].includes(command.id)) return;
    const r = state.simulation.situations?.[situationFor(command.id)];
    assert(r && command.situationCause === r.cause, 'This original local scene quote is stale. Review its actual current situation.');
    if(['lore.warning.signed', 'lore.warning.ask_relay'].includes(command.id))
        assert(command.sampleCause === state.simulation.knowledge.player?.['lore.warning.sample']?.cause, 'The warning quote used an outdated local observation.');
}
export function commitLorePracticeCommand(state, registry, command, context, expectedSequence = state.sequence) {
    assert(expectedSequence === state.sequence && context.actorId === 'player', 'This original local action is stale or belongs to another body.');
    assert(state.schema === 11 && state.referenceGameplay?.schema === 1 && state.auditRemainder?.schema === 1, 'Explicitly open the supported local project reader first.');
    if(command.type === 'cancel_job') {
        const job = state.simulation.jobs.find(j => j.id === command.id), d = lorePracticeCommand(job?.commandId);
        assert(d?.duration && command.situationCause === state.simulation.situations[situationFor(d.id)]?.cause,
            'Cancel only your actual current local commitment or the extra work you supplied.');
        const entitled = job.actorId === 'player' || d.id === I.exposure ||
            d.id === 'lore.work.neri_bind' && state.actors.player.completed['lore.work.fund_neri'] === 1 ||
            d.id === 'lore.work.orr_repair' && state.actors.player.completed['lore.work.ask_orr'] === 1 ||
            d.id === 'lore.warning.orr_relay' && state.actors.player.completed['lore.warning.ask_relay'] === 1 ||
            d.id === 'lore.warning.ressa_check' && state.actors.player.completed['lore.warning.fund_check'] === 1;
        assert(entitled && lorePracticeFacts(state, context)['lore.local'], 'Meet the actual supported local undertaking before cancelling its supplied work.');
        let out = cancelSimulationJob(state, registry, job.id, {...context, actorId: job.actorId}, expectedSequence);
        recordLorePracticeCancellation(out, job);
        const withdraw = {'lore.work.neri_bind': 'lore.work.withdraw_neri', 'lore.work.orr_repair': 'lore.work.withdraw_orr',
            'lore.warning.orr_relay': 'lore.warning.withdraw_relay', 'lore.warning.ressa_check': 'lore.warning.withdraw_check'}[d.id];
        if(withdraw) {
            const ctx = {...stateContext(out, context), lorePracticeHost: true};
            // Cancellation returned the actual worker reservations first. Only
            // the separately supplied unchanged stock/escrow now goes back.
            out = join(out, commitSimulationCommand(out.state, registry, {id: withdraw}, lorePracticeContext(out.state, registry, ctx), out.state.sequence));
        }
        reconcileLorePractice(state, out, registry, {player: stateContext(out, context)});
        validateLorePractice(out.state, registry); return out;
    }
    const d = lorePracticeCommand(command.id);
    assert(d?.actorId === 'player' && ['command', 'audit_remainder', 'lore_practice'].includes(command.type), 'Choose a known player local scene action.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose this command’s actual declared recipient.');
    assertToken(state, command);
    let current = lorePracticeContext(state, registry, {...context, targetId: d.targetId || null, lorePracticeHost: true});
    const exposure = d.id === 'lore.warning.entrust_stave' ? lorePracticeExposureQuote(state, current) : null;
    let out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    if(out.commitment) stampLorePracticeJob(out.state, out.state.simulation.jobs.find(j => j.id === out.commitment.id));
    if(exposure) {
        const internal = lorePracticeCommand(I.exposure), active = {...registry, simulation: {...registry.simulation, commands: new Map(registry.simulation.commands)}};
        active.simulation.commands.set(I.exposure, {...internal, duration: exposure.duration});
        current = lorePracticeContext(out.state, active, {...stateContext(out, context, I.ressa), lorePracticeHost: true, loreExposureHost: true, loreExposureDescriptor: exposure.descriptor});
        const reserved = commitSimulationCommand(out.state, active, {id: I.exposure}, current, out.state.sequence);
        const job = reserved.state.simulation.jobs.find(j => j.id === reserved.commitment?.id);
        assert(job, 'The entrusted material needs its actual remaining-window reservation.');
        stampLorePracticeJob(reserved.state, job, current); job.loreExposure = copy(exposure.descriptor); reserved.commitment = copy(job);
        out = join(out, reserved);
    }
    installLorePracticeControllers(out.state, registry);
    reconcileLorePractice(state, out, registry, {player: stateContext(out, context)});
    validateLorePractice(out.state, registry); return out;
}
export function lorePracticePresentation(state, registry, context = {}) {
    if(state.auditRemainder?.schema !== 1 || !state.simulation) return {visible: false, sections: []};
    const current = lorePracticeContext(state, registry, {...context, lorePracticeHost: true}), sections = [];
    for(const [prefix, situationId, label, description] of [['lore.work.', I.shift, 'Shutter, wages and overlapping shifts', 'One occupied room, one separate commission and a finite local inspection opportunity. Ordinary kit work remains available.'],
        ['lore.warning.', I.rain, 'A dated warning and one physical rain', 'Current observations, a willing independent recipient and one actual entrusted material outcome. Rain does not restore an expected story.']]) {
        const r = state.simulation.situations?.[situationId], actions = [], records = [];
        for(const d of D.commands.filter(d => d.actorId === 'player' && d.id.startsWith(prefix))) {
            if(d.once && state.actors.player.completed[d.id]) continue;
            const preview = previewSimulationCommand(state, registry, d.id, {...current, targetId: d.targetId || null});
            if(!preview.visible) continue;
            const command = {type: 'lore_practice', id: d.id, sequence:state.sequence, ...(d.targetId ? {targetId: d.targetId} : {}), ...(r ? {situationCause: r.cause} : {}),
                ...(['lore.warning.signed', 'lore.warning.ask_relay'].includes(d.id) ? {sampleCause: state.simulation.knowledge.player?.['lore.warning.sample']?.cause} : {})};
            actions.push({id: d.id, label: d.label, description: d.description || '', eligible: preview.eligible, reasons: preview.reasons, duration: preview.duration, command});
        }
        for(const [key, value] of Object.entries(state.simulation.knowledge.player || {})) if(key.startsWith(prefix)) records.push({id: key, text: value.value, at: value.at, basis: value.basis || null});
        if(r) records.unshift({id: `${prefix}public_window`, text: `${label}: ${['late', 'delivered', 'declined', 'withdrawn', 'rained', 'closed'].includes(r.phase) ? 'window closed' : `${Math.max(0, r.deadline - state.clock)} supported played minutes remain`}. Unsupported realm/body time retains this deadline; browser-closed time advances nothing.`, at: r.openedAt});
        for(const j of state.simulation.jobs.filter(j => j.commandId.startsWith(prefix))) {
            const d = lorePracticeCommand(j.commandId), canCancel = d.actorId === 'player' || ['lore.work.neri_bind', 'lore.work.orr_repair', 'lore.warning.orr_relay', 'lore.warning.ressa_check', I.exposure].includes(d.id);
            if(canCancel) actions.push({id: `${j.id}.cancel`, label: `Withdraw ${j.label.toLowerCase()} · exact reservation refund`, eligible: current.facts['lore.local'], reasons: current.facts['lore.local'] ? [] : ['Return to the actual supported local undertaking.'],
                command: {type: 'lore_practice', operation: 'cancel_job', id: j.id, sequence:state.sequence, situationCause: r.cause}});
        }
        if(actions.length || records.length) sections.push({id: prefix.slice(0, -1), label, description, actions, records});
    }
    return {visible: sections.length > 0, sections};
}

// Functional cross-packet predicates: the existing room remains real, and the
// new rain/site fact is current support for only explicitly authored new jobs.
export function lorePracticeSiteSupport(state, context = {}) {
    const f = lorePracticeFacts(state, context), w = state.worlds?.[I.world]?.facts || {};
    return {indoorSample: f['lore.work.indoorSupport'], rainOccurred: w['lore.warning.rainOccurred'] === true,
        lowShelfWet: w['lore.warning.siteWet'] === true, drainOpen: w['lore.warning.drainOpen'] === true,
        currentSample: f['lore.warning.currentSample']};
}
