// Thin existing-executor bridge and read-only Notebook projection. This is not
// a native battle executor, inventory owner, timer or durable publisher.
import {commitSimulationCommand, previewSimulationCommand, cancelSimulationJob, simulationFacts} from './simulation.js';
import {meets} from './simulation_contracts.js';
import {previewFeatureBattleAdmission} from './feature_expansion_battle.js';
import {REMAINDER_COMBAT_FIT_IDS as I, REMAINDER_COMBAT_FIT_PROFILES as P,
    remainderCombatFitDefinitions} from './audit_remainder_combat_fit_content.js';
import {combatFitAssert as A, remainderCombatFitFacts, remainderCombatFitEnrolled, remainderCombatFitTermsAccepted,
    remainderCombatFitGripPreparation, remainderCombatFitCurrentHarness, validateRemainderCombatFit} from './audit_remainder_combat_fit_facts.js';
import {previewRemainderCombatFitAdmission, syncRemainderCombatFitCompletion} from './audit_remainder_combat_fit_hooks.js';

export function remainderCombatFitContext(state, context = {}, registry) {
    return {...context, facts: {...context.facts, 'auditRemainder.enrolled': remainderCombatFitEnrolled(state),
        ...remainderCombatFitFacts(state, context, registry)}};
}
export function commitRemainderCombatFitCommand(state, registry, command, context, expectedSequence = command.sequence ?? state.sequence) {
    if(command.type === 'cancel_job') {
        const job = state.simulation?.jobs?.find(j => j.id === command.jobId && j.actorId === 'player');
        A(registry.simulation?.commands?.get(job?.commandId)?.group === I.group && (context.actorId || 'player') === 'player', 'Cancel only your actual accepted combat-fit work.');
        const plan = cancelSimulationJob(state, registry, job.id, remainderCombatFitContext(state, context, registry), expectedSequence);
        const module = syncRemainderCombatFitCompletion(plan.state);
        if(module) {plan.state.auditRemainder.modules ||= {}; plan.state.auditRemainder.modules.combat_fit = module;}
        validateRemainderCombatFit(plan.state, registry); return plan;
    }
    const d = registry.simulation?.commands?.get(command.id);
    A(d?.group === I.group && d.actorId === 'player' && (context.actorId || 'player') === 'player', 'Unsupported combat-fit command owner.');
    A(!command.targetId || command.targetId === d.targetId, 'Use the actual declared fitting participant.');
    const current = remainderCombatFitContext(state, {...context, actorId: 'player', targetId: d.targetId || null}, registry);
    const plan = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    const module = syncRemainderCombatFitCompletion(plan.state);
    if(module) {plan.state.auditRemainder.modules ||= {}; plan.state.auditRemainder.modules.combat_fit = module;}
    validateRemainderCombatFit(plan.state, registry); return plan;
}
export function remainderCombatFitAdmissionRows(state, registry, context = {}) {
    if(!remainderCombatFitTermsAccepted(state) || state.simulation?.sessions?.player || remainderCombatFitGripPreparation(state)?.status !== 'ready') return [];
    const rows = [];
    for(const withHelper of [false, true]) {
        const ordinary = previewFeatureBattleAdmission(state, registry, context, {withHelper});
        const grip = previewRemainderCombatFitAdmission(state, context, {reserveGripPreparation: true});
        const reasons = [...ordinary.reasons, ...grip.reasons];
        rows.push({id: `remainder_combat_fit.start_prepared${withHelper ? '_lio' : ''}`,
            label: withHelper ? 'Challenge with prepared grip and Lio · 1 coin + 1 stamina' : 'Challenge with your prepared grip · 1 stamina',
            description: 'Start one new sluice challenge. This reserves your current paid preparation to that exact session without spending it. Select the one-stamina conditioned self-guard after recovery; an ordinary guard leaves the charge waiting. End or withdrawal expires an unused reservation.',
            eligible: ordinary.eligible && grip.eligible, reasons, terms: 'One actual admission; no old session upgrade or source acquisition.',
            command: {type: 'feature_command', id: 'feature_battle.start', withHelper, reserveGripPreparation: true, sequence: state.sequence}});
    }
    return rows;
}
export function remainderCombatFitPresentation(state, registry, context = {}) {
    if(!remainderCombatFitEnrolled(state)) return {visible: false, sections: []};
    const current = remainderCombatFitContext(state, context, registry), actions = [], actor = state.actors?.player;
    for(const d of remainderCombatFitDefinitions.commands) {
        if(d.once && actor?.completed?.[d.id]) continue;
        const ctx = {...current, targetId: d.targetId || null};
        if(!meets(d.visibleWhen, simulationFacts(state, ctx, registry))) continue;
        const p = previewSimulationCommand(state, registry, d.id, ctx);
        if(p.visible) actions.push({id: d.id, label: d.label, description: d.description, eligible: p.eligible,
            reasons: p.reasons, terms: `${d.duration || 0} played minutes · cancellation ${d.cancellation || 'none'}`,
            command: {type: I.type, id: d.id, targetId: d.targetId || null, sequence: state.sequence}});
    }
    actions.push(...remainderCombatFitAdmissionRows(state, registry, current));
    const known = remainderCombatFitTermsAccepted(state), records = [];
    if(known) {
        for(const p of Object.values(P)) records.push({id: `remainder_combat_fit.profile.${p.id}`,
            text: `${p.label}: native block ${p.block}, ordinary frame guard ${p.guardExtra ? '+1 stamina over Lio\'s own current guard cost' : 'uses Lio\'s own current guard cost'}${p.hookStaminaImmune ? '; resists only the landed hook\'s extra stamina loss' : ''}. Actual current supported owned equipment is required.`});
        const fit = remainderCombatFitCurrentHarness(state, I.lio), prep = remainderCombatFitGripPreparation(state);
        records.push({id: 'remainder_combat_fit.actual_lio', text: fit ? `Lio's currently supported actual equipped fit: ${fit.label}. The next explicit attempt freezes that profile; losing current gear/source/body support removes the benefit.` : 'Lio currently has no supported actual equipped field fit.'});
        if(prep) records.push({id: 'remainder_combat_fit.practice_state', text: `Paid grip practice: ${prep.status}${prep.sessionId ? ` for ${prep.sessionId}` : ''}${prep.status === 'ready' ? `; ${Math.max(0, prep.expiresAt - state.clock)} played minutes left, recover before reservation/use` : ''}${prep.status === 'spent' ? `; ordinary self-guard action ${prep.spentAction} spent the unique charge` : ''}. Permanent trained grip is separate.`});
    }
    for(const [id, r] of Object.entries(state.simulation?.knowledge?.player || {})) if(id.startsWith('remainder_combat_fit.')) records.push({id, text: r.value});
    const jobs = (state.simulation?.jobs || []).filter(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === I.group);
    for(const j of jobs) actions.push({id: `cancel:${j.id}`, label: 'Cancel this accepted fit/practice work', eligible: true, reasons: [],
        terms: `Cancellation ${j.cancellation}`, command: {type: 'cancel_job', jobId: j.id, sequence: state.sequence}});
    const visible = known || actions.length > 0 || jobs.length > 0;
    return {visible, sections: visible ? [{id: I.group, label: 'Harness fit and earned body use',
        description: 'Paid ordinary construction and existing innate/trained body sources change specific native choices. Original apparatus, ordinary self-guard/retreat and the drainage walk remain useful.',
        actions, records, ...(jobs.length ? {work: jobs.map(j => `${j.label}: ${Math.max(0, j.due - state.clock)} played minutes left; cancellation ${j.cancellation}.`).join(' ')} : {})}] : []};
}
