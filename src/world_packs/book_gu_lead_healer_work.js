// A1/N2 authored village arrangement. Catalogue leaf treatment and the board's merit remain their own contracts.
import {extensionFact} from '../structured_pack_extensions.js';
import {RI_LEAD_DAY, RI_DAY_ITEMS} from '../ri_lead_day_facts.js';
import {RI_LEAF_TREATMENT, RI_LEAF_ITEM} from '../ri_leaf_treatment.js';
export const RI_HEALER_WORK = 'book.ri.lead.healer_work';
export const RI_HEALER_NOTE = `${RI_HEALER_WORK}.last`;
export const RI_HEALER_MINUTES = 45; // Authored local wage/time, not a canon figure.
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const item = (id, amount) => ({type: 'item', actor: 'player', key: JSON.stringify({id}), amount});
const admitted = eq(extensionFact(RI_HEALER_WORK), true);
const support = all(admitted, eq('actor.life', 'alive'), eq('native.ready', true), eq('native.alive', true),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile', true),
    eq('actor.location', 'book.ri.lead.academy', 'Return to the village healer by the clan academy.'));
function action(op, label, description, duration, needs, costs, line) {
    return {id: `${RI_HEALER_WORK}.${op}`, revision: 1, label, description, group: 'structured_local',
        worldId: 'book.ri.lead.world', actorId: 'player', location: 'book.ri.lead.academy', audience: ['$actor'],
        once: false, duration, visibleWhen: admitted, requires: all(support, ...needs),
        ...(duration ? {completionRequires: support, completionCoLocated: true, completionFailure: 'refund', cancellation: 'refund', reservationReturns: 1} : {}),
        costs, effects: [item(RI_LEAF_ITEM, 1), {type: 'knowledge', actor: 'player', key: RI_HEALER_NOTE, stage: 'understood', value: line}]};
}
export const guLeadHealerWork = {
    schema: 1, id: RI_HEALER_WORK, revision: 1,
    base: {id: 'book.ri.lead', revision: 1, contentHash: 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},
    dependsOn: [RI_LEAD_DAY, RI_LEAF_TREATMENT], label: 'The healer’s terms',
    description: 'The village healer takes a watch tally for a Vitality Leaf, or pays one for sorting herb bundles. A tally spent here cannot earn merit at the board.',
    requires: eq(extensionFact(RI_LEAF_TREATMENT), true), reason: 'Ask about a healing leaf first.',
    status: [{id: `${RI_HEALER_WORK}.status`, label: 'At the healer', knowledgeKey: RI_HEALER_NOTE}],
    commands: [
        action('tally', 'Trade a watch tally for a Vitality Leaf', 'The healer accepts the captain’s watch tally for a leaf. Give up its ten-merit board payout and keep your primeval stones.', 0,
            [{fact: `item.${JSON.stringify({id: RI_DAY_ITEMS.tally})}`, op: 'gte', value: 1, reason: 'Bring a watch tally back from a patrol, or work for the healer.'}],
            [item(RI_DAY_ITEMS.tally, -1)], 'The healer kept your watch tally and handed over a Vitality Leaf. That tally will earn no merit at the board.'),
        action('sort', 'Sort herb bundles for a Vitality Leaf', 'Match the healer’s dried herb bundles by their labels and tie them for storage. The healer pays a Vitality Leaf for the finished work.', RI_HEALER_MINUTES,
            [], [], 'You sorted and tied the healer’s herb bundles. The healer paid you a Vitality Leaf; your stones and watch tallies stayed with you.')
    ]
};
