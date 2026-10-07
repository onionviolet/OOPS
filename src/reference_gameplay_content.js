// Original reversible cooling workshop. Existing source, power, inventory,
// participant, reservation, condition and played-clock owners do all work.
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as OK} from './feature_expansion_objects.js';
export const REFERENCE_GAMEPLAY_IDS = Object.freeze({world: O.world, group: 'reference_gameplay', teacher: O.miri, site: O.site,
    cooling: 'reference_gameplay.cooling', open: 'reference_gameplay.open', practice: 'reference_gameplay.practice',
    plan: 'reference_gameplay.cooling_plan', hook: 'featureBattleHook', field: 'reference_gameplay.hook_cooled'});
const I = REFERENCE_GAMEPLAY_IDS, key = id => JSON.stringify({id});
export const REFERENCE_GAMEPLAY_KEYS = Object.freeze({charged: key('Charged cooling sleeve'), empty: key('Empty cooling sleeve'),
    salt: key('Cooling salt packet'), resin: key('Set repair resin'), sap: OK.sap, sound: OK.sound, kit: OK.kit, pole: key('Sluice hook pole')});
const K = REFERENCE_GAMEPLAY_KEYS;
export const referenceGameplayItemSpecifications = Object.freeze([
    {id: 'Charged cooling sleeve', description: 'An owned held sleeve carrying one measured cooling charge. Ordinary resin setting works without a learned power. Discharge returns the same empty sleeve.', value: 3},
    {id: 'Empty cooling sleeve', description: 'The conserved sleeve after its charge was spent. Recharge at Eda\'s bench with one real salt packet and effort.', value: 1},
    {id: 'Cooling salt packet', description: 'One finite measured salt input for sleeve recharge or a supervised test. Asking and revisiting do not replenish it.', value: 1},
    {id: 'Set repair resin', description: 'Actual sap set by a discharged cooling sleeve. Two sound staves and one resin make two native survey kits at the fitting bench.', value: 2},
]);
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const gte = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const item = (key, amount, actor = 'player', returned = false) => ({type: 'item', key, amount, actor, ...(returned ? {reservationReturn: true} : {})});
const stamina = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const money = amount => ({type: 'resource', native: true, actor: 'player', key: 'money', amount});
const coins = amount => ({type: 'resource', actor: I.teacher, key: 'coins', amount});
const fact = (key, value = true) => ({type: 'fact', scope: 'actor', key: `reference_gameplay.${key}`, value});
const know = (key, text, stage = 'seen', actor = 'player', attributedTo = I.teacher, kind = 'instruction') => ({type: 'knowledge', actor,
    key: `reference_gameplay.${key}`, stage, value: text, basis: {kind, attributedTo, situationId: O.situation}});
const opened = eq('reference.workshop.opened');
const live = all(eq('reference.workshop.supported', true, 'Return to the Village with your supported living native body and local clock.'),
    eq('reference.workshop.handsUsable', true, 'Recover your actual hands before handling a sleeve.'), gte('vital.health', 2));
const teacher = eq('reference.workshop.teacherSupported', true, 'Eda needs present willingness, her living body and the actual learned cooling source.');
const tool = eq('reference.workshop.charged', true, 'Carry an owned, unequipped and unborrowed charged sleeve.');
const learned = all(eq(`power.${I.cooling}.owned`), eq(`faculty.${I.cooling}.active`, true, 'Restore your acquired active cooling source.'),
    eq('knowledge.reference_gameplay.method.understood'));
const functionReady = all(learned, gte(`power.${I.cooling}.mastery`, 3, 'Three completed supervised trials unlock hook control.'));
const command = d => ({revision: 1, worldId: I.world, actorId: 'player', location: 'Village', group: I.group, costs: [], effects: [], ...d,
    requires: d.id === I.open ? d.requires : all(opened, d.requires)});
const job = requires => ({duration: 3, cancellation: 'refund', siteId: I.site, completionRequires: requires, completionFailure: 'refund'});
const service = requires => ({...job(all(requires, teacher)), targetId: I.teacher, participants: ['$target'], coLocated: true, completionCoLocated: true});
const discharge = [item(K.empty, 1, 'player', true)];
export const referenceGameplaySources = [{id: I.cooling, revision: 1, label: 'Learned measured cooling', kind: 'knowledge', grants: [],
    bioDetail: 'Eda\'s supervised method. Three paid trials unlock the narrow hook-control function; a charged sleeve and current body remain separate means.'}];
export const referenceGameplayDefinitions = {
    powers: [{id: I.cooling, revision: 1, label: 'Measured cooling', model: 'practice', capacity: 1, worlds: [I.world], execution: all(live, learned),
        masteryBands: [{at: 3, capacity: 1}]}],
    conditions: [{id: I.field, revision: 1, label: 'Cooling sleeve on the hook grip'}],
    commands: [
        command({id: I.open, label: 'Ask Eda about measured cooling', once: true, targetId: I.teacher, coLocated: true, participants: ['$target'],
            visibleWhen: eq('actor.feature_objects.jointInspected'), requires: all(live, eq('actor.feature_objects.jointInspected'), eq('reference.workshop.edaPresent')),
            effects: [fact('opened'), item(K.charged, 2, I.teacher), item(K.salt, 8, I.teacher),
                {type: 'source', actor: I.teacher, sourceId: I.cooling, operation: 'grant', origin: 'trained', awakened: true, active: true},
                {type: 'power', actor: I.teacher, powerId: I.cooling, operation: 'learn'},
                know('offer', 'After your firsthand joint inspection, Eda offers her measured-cooling bench: two stocked sleeves at two coins each, eight one-coin salt packets, a one-coin lesson, and up to three one-coin trials. Ordinary resin setting needs no method. Asking accepts no purchase, practice or debt.'),
                know('offer_record', 'I offered my existing local cooling skill, two sleeves and eight measured salt packets after the traveler inspected the joint. These finite supplies will not renew on return.', 'seen', I.teacher, I.teacher)],
            description: 'Optional local service after real fitting inspection. Eda retains her existing body, consent, attention, bench and purse.'}),
        ...[['sleeve', K.charged, 2], ['salt', K.salt, 1]].map(([name, stock, price]) => command({id: `reference_gameplay.buy_${name}`,
            label: `Buy one actual ${name === 'sleeve' ? 'charged cooling sleeve' : 'salt packet'} · ${price} coin${price > 1 ? 's' : ''}`,
            targetId: I.teacher, coLocated: true, participants: ['$target'], visibleWhen: opened, requires: all(live, teacher),
            costs: [money(-price), {type: 'transfer', from: I.teacher, to: 'player', key: stock, count: 1}], effects: [coins(price),
                know(`buy_${name}`, `You paid Eda ${price} native coin${price > 1 ? 's' : ''} for one actual ${name}. Her finite stock decreased and her purse received the payment. Purchase grants no cooling knowledge.`)],
            description: 'Atomic paid stock transfer. No restock, loan appropriation, abstract material balance or new currency.'})),
        command({id: 'reference_gameplay.set_resin', label: 'Set one sap with an ordinary sleeve · 1 stamina + 3 min', visibleWhen: opened,
            requires: all(live, tool), ...job(live), costs: [item(K.charged, -1), item(K.sap, -1), stamina(-1)],
            effects: [...discharge, item(K.resin, 1), know('resin', 'You discharged one actual sleeve to set one Tree sap into one Set repair resin. The empty sleeve remains yours. No learned method or mastery was required.', 'seen', 'player', 'player', 'observation')],
            description: 'The physical charge performs this ordinary operation. Cancellation refunds actual reserved sleeve, sap and effort and creates no output.'}),
        command({id: 'reference_gameplay.resin_kits', label: 'Bind two sound staves with set resin · two survey kits + 3 min', visibleWhen: opened,
            requires: live, ...job(live), costs: [item(K.resin, -1), item(K.sound, -2), stamina(-1)], effects: [item(K.kit, 2),
                know('kits', 'You consumed one actual Set repair resin and two Sound repair staves to bind two native Prepared survey kits. Existing native preparation, trade and Eda\'s finite orders use these same kits.', 'seen', 'player', 'player', 'observation')],
            description: 'A practical consumer of cooled material. Produces the existing ordinary kit item, with no skill or power required.'}),
        command({id: 'reference_gameplay.recharge', label: 'Recharge your empty sleeve · 1 salt + 1 stamina + 3 min', visibleWhen: opened,
            requires: all(live, eq('reference.workshop.empty')), ...job(live), costs: [item(K.empty, -1), item(K.salt, -1), stamina(-1)],
            effects: [item(K.charged, 1, 'player', true), know('recharge', 'One actual salt packet and bench effort restored one empty sleeve to its charged variant. You kept the same owned sleeve; salt was consumed.', 'seen', 'player', 'player', 'observation')],
            description: 'Recharge conserves the sleeve and spends finite native salt. The method, Eda\'s ongoing attention and magical fuel are unnecessary.'}),
        command({id: 'reference_gameplay.learn', label: 'Learn measured cooling from Eda · 1 coin + 3 min', once: true,
            visibleWhen: all(opened, not(eq(`power.${I.cooling}.owned`))), requires: all(live, teacher, tool), ...service(all(live, tool)),
            costs: [money(-1), stamina(-1), stamina(-1, I.teacher)], effects: [coins(1),
                {type: 'source', sourceId: I.cooling, operation: 'grant', origin: 'trained', awakened: true, active: true},
                {type: 'power', powerId: I.cooling, operation: 'learn'},
                know('method', 'Eda taught you Measured cooling using your actual charged sleeve. You acquired the active source and method at mastery zero. Three paid supervised salt trials are needed for hook control; memory alone supplies neither tool nor charge.', 'understood'),
                know('lesson', 'I completed the traveler\'s paid cooling lesson using our own attention and stamina. The one native coin entered my purse. I promised no future free trials.', 'seen', I.teacher, I.teacher)],
            description: 'Completion rechecks body, current source, present consent, carried tool and co-location. Cancellation returns paid reservations and grants no learning.'}),
        command({id: I.practice, label: 'Practice one supervised cooling trial · 1 coin + 1 salt + 3 min', powerId: I.cooling,
            visibleWhen: all(opened, learned), requires: all(live, teacher, tool, learned, not(gte(`power.${I.cooling}.mastery`, 3))),
            ...service(all(live, tool, learned, not(gte(`power.${I.cooling}.mastery`, 3)))),
            costs: [money(-1), item(K.salt, -1), stamina(-1), stamina(-1, I.teacher)],
            effects: [coins(1), {type: 'power', powerId: I.cooling, operation: 'refine', amount: 1},
                know('practice', 'Eda supervised one paid measured-salt trial. Both people spent their own stamina, one salt packet was consumed and one coin entered Eda\'s purse. Your existing cooling mastery increased by one; no material product was made.', 'understood')],
            description: 'Practice consumes the separate test packet while the sleeve remains charged. Ends at mastery three. The finite plan reserves no later trial once that useful function is reached.'}),
        command({id: 'reference_gameplay.cool_hook', label: 'Cool Oren\'s exposed hook grip · charged sleeve + 2 stamina', powerId: I.cooling,
            targetId: I.hook, coLocated: true, visibleWhen: all(opened, eq('actor.feature.battle.seen'), learned),
            requires: all(live, functionReady, tool, eq('reference.workshop.hookSupported'), not(eq('reference.workshop.hookCooled'))),
            costs: [item(K.charged, -1), stamina(-2)], effects: [...discharge, {type: 'condition', actor: I.hook, id: I.field, operation: 'apply', duration: 4},
                know('hook', 'You used trained Measured cooling and a charged sleeve on Oren\'s actual exposed hook grip. The paid field lasts four played minutes. It prevents the special hook pull while his owned pole remains equipped; ordinary jab and guard still work.', 'seen', 'player', 'player', 'observation')],
            description: 'Use before the sluice encounter. The bounded field needs no continuing teacher consent or source fuel after payment. Its actual condition expires on the local played clock; it grants no strike, damage, passage or permanent weapon change.'}),
    ],
};
export const referenceGameplayWorkPlans = [{id: I.plan, revision: 1, label: 'Eda\'s finite hook-control practice', actorId: 'player', origin: 'reference_gameplay.learn',
    visibleWhen: all(opened, learned), requires: all(live, teacher, tool, learned), goal: gte(`power.${I.cooling}.mastery`, 3),
    steps: Array.from({length: 3}, (_, index) => ({id: `trial_${index + 1}`, kind: 'command', commandId: I.practice, revision: 1, targetId: I.teacher}))}];
export function registerReferenceGameplayItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('Cooling requires the existing native item owner.');
    for(const d of referenceGameplayItemSpecifications) {
        if(itemTemplates[d.id]) throw new Error(`Duplicate cooling item ${d.id}.`);
        itemTemplates[d.id] = new OtherItem({id: d.id, name: d.id, description: d.description, value: d.value, tags: {expedition: true}});
    }
}
