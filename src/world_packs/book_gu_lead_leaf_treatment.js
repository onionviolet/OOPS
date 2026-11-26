import {extensionFact} from '../structured_pack_extensions.js';
import {RI_LEAD_DAY, RI_DAY_ITEMS} from '../ri_lead_day_facts.js';
import {RI_LEAF_TREATMENT as ID, RI_LEAF_ITEM, RI_LEAF_NOTE, RI_LEAF_PRICE} from '../ri_leaf_treatment.js';
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const has = (id, value, reason) => ({fact: `item.${JSON.stringify({id})}`, op: 'gte', value, reason});
const item = (id, amount) => ({type: 'item', actor: 'player', key: JSON.stringify({id}), amount});
const note = (key, value) => ({type: 'knowledge', actor: 'player', key, stage: 'understood', value});
const admitted = eq(extensionFact(ID), true);
const support = all(admitted, eq('actor.life', 'alive'), eq('native.ready', true), eq('native.alive', true),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile', true),
    eq('actor.location', 'book.ri.lead.academy', 'Return to the clan academy.'));
function action(op, label, description, needs, costs, effects) {
    return {id: `${ID}.${op}`, revision: 1, label, description, group: 'structured_local',
        worldId: 'book.ri.lead.world', actorId: 'player', location: 'book.ri.lead.academy', audience: ['$actor'],
        once: false, duration: 0, visibleWhen: admitted, requires: all(support, ...needs), costs, effects};
}
export const guLeadLeafTreatment = {
    schema: 1, id: ID, revision: 1,
    base: {id: 'book.ri.lead', revision: 1, contentHash: 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},
    dependsOn: [RI_LEAD_DAY], label: 'A leaf for a wolf bite',
    description: 'Buy a Vitality Leaf Gu for a patrol cut, or keep your stones and bind the wound until it closes.',
    requires: eq(extensionFact(RI_LEAD_DAY), true), reason: 'Open your ordinary day first.',
    items: [{id: RI_LEAF_ITEM, label: 'Vitality Leaf Gu', description: 'A detached healing leaf. It is spent in treatment; another leaf needs an hour before it can help the same person.', value: 0}],
    status: [{id: `${ID}.status`, label: 'Treatment', knowledgeKey: RI_LEAF_NOTE}],
    commands: [
        action('buy', `Buy a Vitality Leaf Gu · ${RI_LEAF_PRICE} stones`, 'The village healer sells a detached leaf. Buying it keeps it in your hand until you need it.',
            [has(RI_DAY_ITEMS.stone, RI_LEAF_PRICE, `You need ${RI_LEAF_PRICE} primeval stones.`)],
            [item(RI_DAY_ITEMS.stone, -RI_LEAF_PRICE)], [item(RI_LEAF_ITEM, 1), note(`${ID}.bought`, 'You paid two primeval stones for a Vitality Leaf Gu.')]),
        action('treat', 'Press a Vitality Leaf Gu to the wound', 'Use up a leaf to close the wolf cut. It frees you for another patrol. The same person must wait an hour before another leaf can help.',
            [eq(`${RI_LEAD_DAY}.hurt`, true, 'You have no patrol wound to treat.'), has(RI_LEAF_ITEM, 1, 'You need a Vitality Leaf Gu.'),
                eq(`${ID}.ready`, true, 'The last leaf is still working. Wait an hour before using another.')],
            [item(RI_LEAF_ITEM, -1)], [{type: 'fact', actor: 'player', scope: 'actor', key: `${RI_LEAD_DAY}.injured`, value: false},
                note(RI_LEAF_NOTE, 'The Vitality Leaf dissolved against the wolf cut and closed it. You can take a watch again.')])
    ]
};
