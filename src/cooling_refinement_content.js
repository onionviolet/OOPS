// Original, optional refinement of the existing measured-cooling method.
// Real ownership, paid costs, one frozen RNG draw, and timed conditions remain
// with the shared simulation owners.
import {all, deepFreezeUnlessFrozen as freezeDeep, eq, not} from './basics.js';
import {FEATURE_OBJECT_IDS} from './feature_expansion_objects.js';
import {REFERENCE_GAMEPLAY_IDS as I, REFERENCE_GAMEPLAY_KEYS as K} from './reference_gameplay_content.js';

const gte = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const item = (key, amount, returned = false) => ({type: 'item', key, amount, actor: 'player', ...(returned ? {reservationReturn: true} : {})});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const af = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key: `reference.coolingRefinement.${key}`, value});
const know = (key, value) => ({type: 'knowledge', actor: 'player', key: `reference.coolingRefinement.${key}`, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: 'player', situationId: FEATURE_OBJECT_IDS.situation}});
const resultText = receipt => `A paid three-minute cooling refinement completed ${receipt.result === 'success' ? 'successfully' : 'as a failure'}. ${receipt.result === 'failure' ? 'One actual salt packet and two stamina were spent. ' : ''}The accepted ${receipt.prepared ? 'prepared' : 'ordinary'} quote was ${(100 * receipt.successProbability).toFixed(0)}%, after ${receipt.retryCountBefore} completed failed ${receipt.retryCountBefore === 1 ? 'attempt' : 'attempts'}; the one frozen roll was ${receipt.roll.toFixed(6)}. ${receipt.result === 'success' ? 'This earns one attributed steadied-hook application, with no rank, free source, sleeve or quality bank.' : 'The completed failure adds one retry, capped at +15 percentage points, and five played minutes of soreness. No source, rank, application or quality bank was granted.'}`;

export function coolingRefinementReceiptEffects(receipt) {
    const effects = [{type: 'fact', scope: 'actor', actor: 'player', key: 'reference.coolingRefinement.lastAttempt', value: JSON.stringify(receipt)}];
    if(receipt.result === 'success') effects.push(
        {type: 'fact', scope: 'actor', actor: 'player', key: 'reference.coolingRefinement.failedAttempts', value: receipt.retryCountBefore},
        {type: 'fact', scope: 'actor', actor: 'player', key: 'reference.coolingRefinement.applicationAvailable', value: true},
        know('success', resultText(receipt)));
    else effects.push(
        {type: 'fact', scope: 'actor', actor: 'player', key: 'reference.coolingRefinement.failedAttempts', value: receipt.retryCountBefore + 1},
        {type: 'condition', actor: 'player', id: 'body.sore_hands', operation: 'apply', duration: 5},
        know('failure', resultText(receipt)));
    return effects;
}

const active = eq('reference.workshop.opened');
const live = all(active,
    eq('reference.workshop.supported', true, 'Return to the Village with your supported living native body and local clock.'),
    eq('reference.workshop.handsUsable', true, 'Recover your actual hands before handling a sleeve.'),
    eq('reference.coolingRefinement.nativeBodySupported', true, 'Use your actual living, controlled native body with working hands.'),
    gte('vital.health', 2));
const ready = all(live,
    eq('reference.workshop.functionReady', true, 'Complete the three actual paid cooling trials first.'),
    eq('reference.workshop.charged', true, 'Carry an owned, unequipped and unborrowed charged sleeve.'),
    eq('reference.coolingRefinement.calendarSupported', true, 'The saved Village calendar is unavailable for a disclosed quiet-window quote.'));
const refinementSupport = all(live,
    eq('reference.workshop.functionReady', true, 'Keep your acquired active cooling source and completed three-trial method.'),
    eq('reference.coolingRefinement.calendarSupported', true, 'Keep a supported saved Village calendar through completion.'));
const applyReady = all(live, eq('reference.workshop.functionReady'),
    eq('reference.workshop.charged', true, 'Carry an owned, unequipped and unborrowed charged sleeve.'));
const failureCount = 'reference.coolingRefinement.failedAttempts';
const outcome = (id, label, fact) => ({id, label, weight: {fact}, effects: []});

const retries = [
    {suffix: 'first', min: 0, max: 0},
    {suffix: 'second', min: 1, max: 1},
    {suffix: 'third', min: 2, max: 2},
    {suffix: 'later', min: 3, max: null},
];
const refinementCommands = retries.map(({suffix, min, max}) => {
    const retryRule = max == null ? gte(failureCount, min) : eq(failureCount, min);
    const id = `reference_gameplay.refine_${suffix}`;
    return {
        id, revision: 1, worldId: I.world, actorId: 'player', group: 'cooling_refinement', location: 'Village',
        label: `Attempt ${suffix === 'first' ? 'a' : 'another'} paid cooling refinement · 1 salt + 2 stamina + 3 min`,
        visibleWhen: all(active, eq('reference.workshop.functionReady'), retryRule,
            not(eq('reference.coolingRefinement.applicationAvailable', true))),
        requires: all(ready, retryRule, not(eq('reference.coolingRefinement.applicationAvailable', true))), costs: [item(K.salt, -1), stamina(-2)],
        duration: 3, cancellation: 'refund', siteId: I.site, reservationReturns: 1,
        completionRequires: all(refinementSupport, retryRule, not(eq('reference.coolingRefinement.applicationAvailable', true))), completionFailure: 'refund',
        automatable: false,
        description: 'A completed success or failure spends one actual salt packet and two stamina. Cancellation or lost support returns both reserved costs and records no result. The quote freezes the current calendar window, preparation, retry count, probability and one roll.',
        outcomes: [
            outcome('success_prepared', 'Prepared success', 'reference.coolingRefinement.weight.successPrepared'),
            outcome('failure_prepared', 'Prepared failure', 'reference.coolingRefinement.weight.failurePrepared'),
            outcome('success_ordinary', 'Ordinary success', 'reference.coolingRefinement.weight.successOrdinary'),
            outcome('failure_ordinary', 'Ordinary failure', 'reference.coolingRefinement.weight.failureOrdinary'),
        ],
    };
});

export const coolingRefinementDefinitions = freezeDeep({
    conditions: [],
    commands: [
        ...refinementCommands,
        {
            id: 'reference_gameplay.steady_hook', revision: 1, worldId: I.world, actorId: 'player', group: 'cooling_refinement',
            label: 'Apply steadied cooling to Oren’s hook grip · charged sleeve + 2 stamina',
            visibleWhen: all(active, eq('actor.feature.battle.seen'), eq('reference.coolingRefinement.applicationAvailable')),
            requires: all(applyReady, eq('reference.coolingRefinement.applicationAvailable', true, 'Complete one successful paid refinement first.'),
                eq('reference.workshop.hookSupported', true, 'Oren must be living, present and holding his actual native hook pole.'),
                eq('reference.workshop.hookCooled', false, 'The hook already has an active cooling field.')),
            costs: [item(K.charged, -1), stamina(-2)],
            effects: [af('applicationAvailable', false), item(K.empty, 1, true), {type: 'condition', actor: I.hook, id: I.field, operation: 'apply', duration: 5},
                know('steady_hook', 'You used your one attributed steadied-cooling application and an actual charged sleeve on Oren’s exposed hook grip. This paid field lasts five played minutes. It prevents the special hook pull while his owned pole remains equipped; ordinary jab and guard still work. The same empty sleeve returned to you.')],
            description: 'Consumes one earned application, the same owned charged sleeve and two stamina. The same empty sleeve returns. The existing hook-control condition protects against the special pull for five played minutes; it grants no strike, damage, passage or permanent weapon change.',
        },
    ],
});

export const coolingRefinementCommands = coolingRefinementDefinitions.commands;
export const COOLING_REFINEMENT_DEFINITION_MAP = Object.freeze(Object.fromEntries(
    coolingRefinementDefinitions.commands.map(definition => [definition.id, definition])));
