// Original reversible ToME/KeeperRL/Rogue Legacy inspired Frontier choices.
// Plain content only: the existing simulation executor owns jobs and stock.
import {all, eq, not} from './basics.js';
export const REMAINDER_COMBAT_FIT_IDS = Object.freeze({
    world: 'base.frontier', group: 'remainder_combat_fit', type: 'audit_remainder',
    terms: 'remainder_combat_fit.terms', practice: 'remainder_combat_fit.grip_practice',
    bench: 'village.workbench', lio: 'partyPartner', shield: 'featureBattleShield', hook: 'featureBattleHook',
    grip: 'body.conditioned_grip', balance: 'body.natural_balance', guardSource: 'party.guard_control',
    sore: 'body.sore_hands', scraped: 'body.scraped_hands',
});
const I = REMAINDER_COMBAT_FIT_IDS, key = id => JSON.stringify({id});
export const REMAINDER_COMBAT_FIT_KEYS = Object.freeze({
    original: key('Braced field harness'), rigid: key('Rigid reinforced field harness'),
    flexible: key('Flexible lashed field harness'), kit: key('Prepared survey kit'),
    log: key('Rough wood log'), rope: key('Survey rope'), resin: key('Set repair resin'),
});
const K = REMAINDER_COMBAT_FIT_KEYS;
export const REMAINDER_COMBAT_FIT_PROFILES = Object.freeze({
    original: Object.freeze({id: 'original', key: K.original, label: 'Original braced fit', block: 4, guardExtra: 0, hookStaminaImmune: false, defense: 2, blockChance: .6}),
    rigid: Object.freeze({id: 'rigid', key: K.rigid, label: 'Rigid reinforced fit', block: 6, guardExtra: 1, hookStaminaImmune: false, defense: 2, blockChance: .6}),
    flexible: Object.freeze({id: 'flexible', key: K.flexible, label: 'Flexible lashed fit', block: 3, guardExtra: 0, hookStaminaImmune: true, defense: 2, blockChance: .6}),
});
export const REMAINDER_GRIP_PREPARATION_LIFETIME = 60;
export const remainderCombatFitItemSpecifications = Object.freeze([
    {id: 'Rigid reinforced field harness', name: 'Rigid reinforced field harness', value: 8, tags: {expedition: true},
        description: 'One real reinforced frame. Willing Lio wearing his owned supported frame in a newly enrolled sluice attempt blocks at six, but every ordinary frame guard costs one extra stamina. It grants no source or learned method.'},
    {id: 'Flexible lashed field harness', name: 'Flexible lashed field harness', value: 7, tags: {expedition: true},
        description: 'One real flexible frame. Willing Lio wearing his owned supported frame in a newly enrolled sluice attempt blocks at three and resists only a pole pull\'s extra stamina loss. Ordinary hit damage and wounds still apply.'},
]);
const af = (key, value = true) => ({type: 'fact', actor: 'player', scope: 'actor', key: `remainder_combat_fit.${key}`, value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const know = (key, value) => ({type: 'knowledge', actor: 'player', key: `remainder_combat_fit.${key}`, stage: 'understood', value});
const enrolled = eq('auditRemainder.enrolled', true, 'Accept the optional local audit additions first.');
const terms = eq('remainder.combatFit.terms', true, 'Review and accept these optional fit and body-use terms first.');
const living = eq('remainder.combatFit.workSupported', true, 'Use your current living native body in the Village, above one HP and free of another encounter.');
const hands = eq('remainder.combatFit.handsUsable', true, 'Recover your actual hands before this work.');
const bench = eq('remainder.combatFit.benchSupported', true, 'Use the existing actual dry Village workbench.');
const craft = all(enrolled, terms, living, hands, bench);
const lio = eq('remainder.combatFit.lioSupported', true, 'Lio needs present willingness, his own living usable body, active learned guard source and owned unborrowed kit.');
const fitting = all(enrolled, terms, living, hands, lio);
const command = d => ({revision: 1, worldId: I.world, actorId: 'player', location: 'Village', group: I.group,
    costs: [], effects: [], ...d});
const job = (duration, support) => ({duration, cancellation: 'refund', completionRequires: support, completionFailure: 'refund'});
const fits = ['rigid', 'flexible'];
const descriptions = {
    rigid: 'Rigid reinforcement spends two actual kits, two logs and one set resin, two stamina and eight played minutes for one owned native harness. In a new opted-in sluice attempt its six-strength block costs Lio one extra stamina per guard. It does not resist the hook or reduce ordinary unblocked hit damage.',
    flexible: 'Flexible lashing spends two actual kits, one log and one Survey rope, two stamina and six played minutes for one owned native harness. The rope stays in the frame and is consumed. In a new opted-in sluice attempt its three-strength block resists only the hook\'s extra stamina loss. Ordinary damage still applies.',
};
export const remainderCombatFitDefinitions = {
    commands: [
        command({id: I.terms, label: 'Review harness fits and earned body maneuvers · optional, free', once: true,
            visibleWhen: all(enrolled, eq('actor.party.met'), not(terms)), requires: all(enrolled, living, eq('actor.party.met')),
            effects: [af('terms'), af('termsRevision', 1), know('terms',
                'The original owned harness remains block four. Two optional paid native variants fit willing Lio: rigid blocks six with one extra stamina per ordinary frame guard; flexible blocks three and resists only pole-pull extra fatigue. Both retain ordinary damage. A recovered trained Conditioned grip permits four minutes and two stamina of brace practice, then twelve minutes of soreness; its one charge lasts sixty played minutes, expires on leaving Frontier or field renewal, and reserves only to your next explicitly enrolled new sluice attempt. After recovery one chosen ordinary self-guard spends one stamina instead of two. Unused reserved practice expires when that attempt ends. Actual active Natural balance offers a two-stamina/two-step escape, while trained grip with a real owned unborrowed Survey rope offers one stamina/one step without consuming the rope. Each maneuver uses its own paid means and cannot also spend a traversal preparation or defensive opening. Existing sessions, ordinary guarding/retreat and the drainage walk retain their terms.')],
            description: 'Accept the disclosed optional original local prototypes. This gives no gear, source, practice, stock, battle admission or reward.'}),
        ...fits.map(fit => command({id: `remainder_combat_fit.craft_${fit}`,
            label: fit === 'rigid' ? 'Build a rigid harness · 2 kits + 2 logs + 1 set resin + 2 stamina + 8 min' : 'Build a flexible harness · 2 kits + 1 log + 1 Survey rope + 2 stamina + 6 min',
            siteId: I.bench, visibleWhen: all(enrolled, terms), requires: craft, ...job(fit === 'rigid' ? 8 : 6, craft),
            costs: [item(K.kit, -2), item(K.log, fit === 'rigid' ? -2 : -1), item(fit === 'rigid' ? K.resin : K.rope, -1), stamina(-2)],
            effects: [item(K[fit], 1), {type: 'xp', skill: 'Woodworking', amount: 8}, know(`crafted_${fit}`, descriptions[fit])],
            description: `${descriptions[fit]} Completion rechecks current hands, living native body, location and dry actual bench. Cancellation or lost support refunds the exact paid reservations and creates no harness.`})),
        ...['original', ...fits].map(fit => {
            const stock = eq(`remainder.combatFit.playerOwn.${fit}`, true, 'Keep one actual unequipped, unborrowed owned harness until the fitting completes.');
            const support = all(fitting, stock);
            return command({id: `remainder_combat_fit.give_${fit}`, label: `Give and fit Lio your ${fit} harness · 1 stamina + 2 min`,
                targetId: I.lio, coLocated: true, participants: ['$target'], visibleWhen: all(enrolled, terms, eq('actor.party.met')),
                requires: support, ...job(2, support), completionCoLocated: true, costs: [stamina(-1)],
                effects: [{type: 'transfer', from: 'player', to: I.lio, key: K[fit], count: 1}, {type: 'equipment', actor: I.lio, slot: 'field_frame', key: K[fit]},
                    know(`fitted_${fit}`, `You transferred one actual player-owned ${fit} harness to willing Lio and fitted his owned frame after two played minutes. Any earlier frame stays in his own stock. Its declared fit is read from his real supported equipment only in a newly enrolled attempt.`)],
                description: 'The actual handoff happens only on successful supported completion. A missing/borrowed/equipped player object, lost consent, separation or unavailable body refunds effort and transfers nothing. No borrowed frame or existing owned variant is duplicated.'});
        }),
        ...['original', ...fits].map(fit => {
            const support = all(fitting, eq(`remainder.combatFit.lioOwn.${fit}`, true, 'Lio must retain his actual unborrowed owned frame.'));
            return command({id: `remainder_combat_fit.wear_${fit}`, label: `Fit Lio's retained ${fit} harness · 1 stamina + 2 min`,
                targetId: I.lio, coLocated: true, participants: ['$target'], visibleWhen: all(enrolled, terms, eq(`remainder.combatFit.lioOwn.${fit}`)),
                requires: support, ...job(2, support), completionCoLocated: true, costs: [stamina(-1)],
                effects: [{type: 'equipment', actor: I.lio, slot: 'field_frame', key: K[fit]}, know(`worn_${fit}`, `Willing Lio fitted his actual retained ${fit} frame after the paid two-minute fitting. All other owned frames remain his; fitting supplies no item, learned control or source.`)],
                description: 'Switch between actual retained fits. Completion uses Lio\'s present consent, body, source, co-location and exact unencumbered stock. Existing frozen sluice sessions keep their original combat semantics.'});
        }),
        command({id: I.practice, label: 'Prepare one conditioned self-guard · 2 stamina + 4 min, then sore hands',
            visibleWhen: all(enrolled, terms, eq('actor.body.gripLearned')), duration: 4, cancellation: 'forfeit',
            requires: all(enrolled, terms, living, hands, eq('remainder.combatFit.gripActive'), eq('remainder.combatFit.preparationAvailable', true, 'Use or expire the existing preparation before making another.')),
            completionRequires: all(enrolled, terms, living, hands, eq('remainder.combatFit.gripActive'), eq('remainder.combatFit.preparationAvailable')),
            completionFailure: 'forfeit', costs: [stamina(-2)],
            effects: [know('grip_practice', 'You completed four played minutes of brace practice with your actual active trained Conditioned grip and recovered supported hands. Two stamina were spent. Twelve minutes of soreness follow. One self-guard charge is ready for sixty played minutes; after recovery it can be reserved only to one explicitly enrolled new local sluice attempt, then selected on one ordinary self-guard for one stamina instead of two. Permanent trained grip remains unchanged.'),
                {type: 'condition', actor: 'player', id: I.sore, operation: 'apply', duration: 12}],
            description: 'Earned grip and recovery are actual prerequisites. Cancellation or lost completion support forfeits the two stamina, makes no preparation and grants no practice/source/XP. No stacking. Rest your hands before spending the preparation; the ordinary two-stamina guard stays available.'}),
    ],
};
