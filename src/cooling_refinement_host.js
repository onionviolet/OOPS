// Optional host adapter. Root routes its definitions and facts through the
// current reference-gameplay publisher; this module never writes native state.
import {referenceGameplayContext} from './reference_gameplay_host.js';
import {coolingRefinementDefinitions, coolingRefinementReceiptEffects} from './cooling_refinement_content.js';
import {coolingRefinementCalendar, coolingRefinementFacts, validateCoolingRefinement} from './cooling_refinement_facts.js';
import {featureWorkControls, featureCostText} from './feature_expansion_host.js';
import {commitSimulationCommand, previewSimulationCommand} from './simulation.js';
import {assert, copy, validateSimulationEffect, validateSimulationState} from './simulation_contracts.js';

const PREFIX = 'reference.coolingRefinement.';
const FACT = suffix => `${PREFIX}${suffix}`;
const commandIds = new Set(coolingRefinementDefinitions.commands.map(d => d.id));
const refineIds = new Set(['reference_gameplay.refine_first', 'reference_gameplay.refine_second',
    'reference_gameplay.refine_third', 'reference_gameplay.refine_later']);
const check = (ok, message) => assert(ok, message);

function coolingContext(state, registry, context) {
    const base = referenceGameplayContext(state, registry, context);
    return {...base, facts: {...base.facts, ...coolingRefinementFacts(state, context)}};
}

function snapshot(state, job, facts, commandId, context) {
    const window = coolingRefinementCalendar(state, context);
    const prepared = facts['reference.coolingRefinement.prepared'] === true;
    const result = job.outcomeId.startsWith('success_') ? 'success' : 'failure';
    return {
        schema: 1, result, commandId, cause: job.id, acceptedAt: state.clock,
        acceptedSequence: job.sequence, calendarMinute: window.minute,
        quietWindowOpen: facts['reference.coolingRefinement.quietWindowOpen'] === true,
        quietWindowRemaining: facts['reference.coolingRefinement.quietWindowRemaining'] || 0,
        prepared, preparedByFocus: facts['reference.coolingRefinement.preparedByFocus'] === true,
        retryCountBefore: facts['reference.coolingRefinement.failedAttempts'] || 0,
        baseProbability: facts['reference.coolingRefinement.baseProbability'],
        successProbability: facts['reference.coolingRefinement.successProbability'],
        roll: job.roll, outcomeId: job.outcomeId,
    };
}

function completionEffects(state, job, facts, commandId, context) {
    const result = snapshot(state, job, facts, commandId, context);
    const effects = coolingRefinementReceiptEffects(result);
    effects.forEach(validateSimulationEffect);
    return effects;
}

export function coolingRefinementContext(state, registry, context = {}) {
    return coolingContext(state, registry, context);
}

export function previewCoolingRefinementCommand(state, registry, commandId, context = {}) {
    check(commandIds.has(commandId) && registry.simulation.commands.get(commandId)?.revision === 1,
        'Unsupported cooling-refinement preview.');
    return previewSimulationCommand(state, registry, commandId, coolingContext(state, registry, context));
}

export function commitCoolingRefinementCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const id = command.id;
    check(command.type === 'cooling_refinement' && command.sequence === expectedSequence && expectedSequence === state.sequence &&
        context.actorId === 'player' && commandIds.has(id) &&
        registry.simulation.commands.get(id)?.revision === 1,
        'This cooling-refinement action is stale or unsupported.');
    check(state.referenceGameplay?.schema === 1 && state.referenceGameplay.workshop?.schema === 1,
        'Open the existing measured-cooling workshop first.');
    const current = coolingContext(state, registry, {...context, targetId: null});
    const p = previewSimulationCommand(state, registry, id, current);
    check(p.eligible, p.reasons.join(' ') || 'This cooling-refinement action is unavailable.');
    const out = commitSimulationCommand(state, registry, {id}, current, expectedSequence);
    if(refineIds.has(id)) {
        const job = out.state.simulation.jobs.find(j => j.commandId === id && j.actorId === 'player');
        check(job && job.due === state.clock + 3 && job.roll != null && job.outcomeId,
            'The paid refinement did not create its frozen three-minute outcome.');
        const effects = completionEffects(state, job, current.facts, id, current);
        job.effects.push(...copy(effects));
        if(out.commitment?.id === job.id) out.commitment.effects.push(...copy(effects));
    }
    validateCoolingRefinement(out.state, registry);
    validateSimulationState(out.state.simulation, out.state, registry.simulation);
    return out;
}

export function coolingRefinementPresentation(state, registry, context = {}) {
    if(state.referenceGameplay?.schema !== 1 || !state.referenceGameplay.workshop) return {visible: false, sections: []};
    const current = coolingContext(state, registry, context), facts = current.facts, actions = [];
    for(const d of coolingRefinementDefinitions.commands) {
        const preview = previewSimulationCommand(state, registry, d.id, current);
        if(!preview.visible) continue;
        const costs = featureCostText(preview.costs || d.costs);
        const terms = [costs, `${Math.max(0, preview.duration || 0)} played minutes`];
        if(preview.duration) terms.push('Cancel to return reserved inputs.');
        actions.push({id: d.id, label: d.label, description: d.description || '', terms: terms.filter(Boolean).join(' · '),
            eligible: preview.eligible, reasons: preview.reasons || [],
            command: {type: 'cooling_refinement', id: d.id, sequence: state.sequence},
            outcomes: preview.weights && d.outcomes ? d.outcomes.map((o, index) => ({id: o.id, label: o.label, probability: preview.weights[index]})) : undefined});
    }
    const quoteVisible = facts['reference.workshop.functionReady'] === true && facts['reference.coolingRefinement.calendarSupported'] === true;
    const quote = quoteVisible ? {
        saltPackets: 1, stamina: 2, playedMinutes: 3,
        quietWindow: '06:00–08:00 Village game time', quietWindowOpen: facts['reference.coolingRefinement.quietWindowOpen'],
        quietWindowRemaining: facts['reference.coolingRefinement.quietWindowRemaining'],
        preparation: facts['reference.coolingRefinement.prepared'] ? 'prepared' : 'ordinary',
        preparedByFocus: facts['reference.coolingRefinement.preparedByFocus'],
        failedAttempts: facts['reference.coolingRefinement.failedAttempts'], retryBonus: facts['reference.coolingRefinement.retryBonus'],
        baseProbability: facts['reference.coolingRefinement.baseProbability'], successProbability: facts['reference.coolingRefinement.successProbability'],
    } : null;
    const last = state.actors?.player?.facts?.[FACT('lastAttempt')];
    let lastAttempt = null;
    if(typeof last === 'string') {try {lastAttempt = JSON.parse(last);} catch {lastAttempt = null;}}
    const job = state.simulation?.jobs?.find(j => refineIds.has(j.commandId) && j.actorId === 'player');
    const work = featureWorkControls(state, registry, ['cooling_refinement'], referenceGameplayContext(state, registry, context));
    const acceptedText = job ? (() => {
        const raw = job.effects.find(e => e.type === 'fact' && e.key === FACT('lastAttempt'))?.value;
        try {
            const accepted = JSON.parse(raw);
            return `Accepted frozen quote: ${accepted.prepared ? 'prepared' : 'ordinary'} ${Math.round(accepted.successProbability * 100)}% success; ${accepted.retryCountBefore} earlier completed failures; calendar minute ${accepted.calendarMinute}; one roll ${accepted.roll.toFixed(6)} (${accepted.outcomeId}).`;
        } catch {return 'Accepted frozen quote is unavailable.';}
    })() : '';
    const quoteText = quote ? `Current quote: ${quote.preparation}, ${Math.round(quote.successProbability * 100)}% success from a ${Math.round(quote.baseProbability * 100)}% base plus ${Math.round(quote.retryBonus * 100)} retry points after ${quote.failedAttempts} completed failures. Costs one actual salt packet, two stamina and three played minutes. The 06:00–08:00 quiet window is ${quote.quietWindowOpen ? `open for ${quote.quietWindowRemaining} minutes` : 'closed'}.` : '';
    const lastText = lastAttempt ? `Last paid result: ${lastAttempt.result}; accepted ${Math.round(lastAttempt.successProbability * 100)}% ${lastAttempt.prepared ? 'prepared' : 'ordinary'} quote, one roll ${Number(lastAttempt.roll).toFixed(6)} (${lastAttempt.outcomeId}).` : '';
    const visible = !!quoteVisible || !!lastAttempt || !!job || facts['reference.coolingRefinement.applicationAvailable'];
    if(!visible) return {visible: false, sections: []};
    const records = Object.entries(state.simulation?.knowledge?.player || {}).filter(([key]) => key.startsWith(PREFIX))
        .map(([id, entry]) => ({id, text: `${entry.value} · minute ${entry.at}`}));
    if(lastText) records.unshift({id: FACT('lastAttempt'), text: lastText});
    const section = {id: 'reference.cooling.refinement', label: 'Optional paid cooling refinement',
        description: [quoteText, facts['reference.coolingRefinement.applicationAvailable'] ? 'One attributed steadied-hook application is available.' : '',
            lastText].filter(Boolean).join(' '),
        work: [work.work, acceptedText].filter(Boolean).join(' · '), actions: [...actions, ...work.actions], records,
        quote: quote ? {...quote, acceptedText} : null};
    return {visible: true, sections: [section]};
}

export function validateCoolingRefinementState(state, registry) {
    validateCoolingRefinement(state, registry);
    const app = state.actors?.player?.facts?.[FACT('applicationAvailable')];
    check(app == null || typeof app === 'boolean', 'Invalid cooling-refinement application reader result.');
}
