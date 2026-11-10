// Qing Mao, volume two chapters 101–103.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_ESTATE_CLAIM} from './book_gu_lead_estate_claim.js';
import {GU_LEAD_WHITE_JADE} from './book_gu_lead_white_jade.js';

export const GU_LEAD_ESTATE_HANDOVER = id('estate_handover');
const local = name => `${GU_LEAD_ESTATE_HANDOVER}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const predecessorHash = 'sha256:a02691c81ea521f414989080fb63c434a31850eab8cbc6ef4fd9e123a16ca1de';
const world = id('world');
const academy = id('academy');
const day = 1440;
const all = (...rules) => ({all: rules});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const done = name => eq(`completed.${local(name)}`);
const field = (name, value) => eq(`actor.${local(name)}`, value);
const set = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: local(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: local(name), stage: 'understood', value});
const status = (name, label) => ({id: local(name + '_status'), label, knowledgeKey: local(name)});
const key = id => JSON.stringify({id});
const stock = (id, value = 1) => ({fact: `item.${key(id)}`, op: 'gte', value});
const item = (id, amount) => ({type: 'item', actor: 'player', key: key(id), amount});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`claim.${id('academy_roll')}.held`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`faculty.${id('aperture')}.active`), eq('actor.location', academy));
const predecessor = all(eq(extensionFact(GU_LEAD_WHITE_JADE)),
    eq(`completed.${GU_LEAD_WHITE_JADE}.return_with_wine`),
    eq(`actor.${GU_LEAD_WHITE_JADE}.return`, 'uncle_at_rented_house'),
    eq(`actor.${GU_LEAD_ESTATE_CLAIM}.claim`, 'honey_wine_assignment'));
const admitted = eq(extensionFact(GU_LEAD_ESTATE_HANDOVER));
const wine = `${GU_LEAD_WHITE_JADE}.golden_bee_wine`;
const wineForHall = 5;
const deeds = local('estate_deeds');
const grass = local('unrefined_vitality_grass');

function act(name, label, duration, previous, description, effects, {needs = [], atStart = [], costs = [], reason} = {}) {
    const visibleWhen = all(admitted, previous);
    const support = all(ready, visibleWhen, ...needs);
    return {
        id: local(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location: academy, audience: ['$actor'], once: true, duration, visibleWhen,
        requires: {...all(support, ...atStart), reason: reason || 'Finish the previous step and stay near the academy.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1, costs, effects
    };
}

export const guLeadEstateHandover = {
    schema: 1, id: GU_LEAD_ESTATE_HANDOVER, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Fang Yuan takes possession of the estate',
    description: 'Carry your wine past your uncle to the hall. Read the record and find out what the family left you.',
    requires: all(ready, predecessor, stock(wine, wineForHall)),
    reason: 'Return to your rented house with all five liang of honey wine.',
    items: [
        {id: deeds, label: 'Fang family deeds', description: 'The hall’s papers for the farmland, three bamboo houses and the tavern.', value: 0},
        {id: grass, label: 'Nine Leaf Vitality Grass · unrefined', description: 'The healing Gu conveyed with the family estate. Its leaves can be prepared separately after refinement.', value: 0}
    ],
    status: [status('offer', 'Your uncle’s offer'), status('hall', 'The inheritance record'),
        status('estate', 'The Fang estate'), status('grass', 'Nine Leaf Vitality Grass'),
        status('tavern', 'The east-gate tavern'), status('rentals', 'The bamboo houses')],
    commands: [
        act('refuse_the_offer', 'Show your uncle what is in the water sack', 15, predecessor,
            'Listen to your uncle’s account of his injury and the connections he built afterward. He offers a thousand stones if you drop the claim. Open the sack for him, then keep walking even as he raises the offer.',
            [set('offer', 'refused'), note('offer', 'Your uncle follows you to the hall. He offers twenty-five hundred stones, then threatens you. You keep the wine and take nothing from him.')],
            {needs: [stock(wine, wineForHall)], reason: 'Bring the full water sack to answer your uncle.'}),
        act('hand_over_wine', 'Give the clerk all five liang of wine', 10, done('refuse_the_offer'),
            'Tell the clerk you brought it alone. Say a bear broke into the hive while you were scouting. Let the clerk put your account in writing.',
            [set('hall', 'wine_delivered'), note('hall', 'The clerk takes the wine and records your account. He tells you the hall will recover the family property from your uncle and aunt in three days.')],
            {atStart: [stock(wine, wineForHall)], costs: [item(wine, -wineForHall)], reason: 'The clerk needs all five liang before he can close the assignment.'}),
        act('read_the_record', 'Read the clerk’s record before you leave', 5, done('hand_over_wine'),
            'Ask to check the entry while you are still standing at the desk. The clan’s rules allow the person who did the work to read the record.',
            [set('hall', 'record_checked'), note('hall', 'The entry matches what you told him. The assessment reads Good. The hall has accepted the wine and must now collect the property on the inventory.')],
            {needs: [field('hall', 'wine_delivered')]}),
        act('collect_the_deeds', 'Come back for the family deeds in three days', 3 * day, done('read_the_record'),
            'Wait for the hall to recover the estate. Check what it hands over against the list before taking possession.',
            [item(deeds, 1), item(grass, 1), set('estate', 'conveyed'), set('rented_houses', 3), set('estate_servants', 8),
                note('estate', 'The hall gives you the deeds to more than ten mu of farmland, three bamboo houses and a wine tavern. Eight servants are listed in the papers. You have taken no rent or tavern income today.'),
                note('grass', 'Among the holdings is a Rank Two healing Gu, Nine Leaf Vitality Grass. You could grow new leaves with essence once it is yours to command. For now it is unrefined.')],
            {needs: [field('hall', 'record_checked')], reason: 'Confirm the clerk’s entry before coming back for the deeds.'}),
        act('read_tavern_books', 'Ask for the tavern’s account books', 35, done('collect_the_deeds'),
            'Walk through the tavern at the east gate. Ask the shopkeeper to bring the books and check the last page against what he tells you.',
            [set('tavern', 'books_checked'), note('tavern', 'The last page shows your uncle already took this month’s takings. The shopkeeper says he came himself. There is nothing from that month to collect now.')],
            {needs: [stock(deeds), field('estate', 'conveyed')], reason: 'Collect the deeds before asking to inspect the tavern’s books.'}),
        act('raise_tavern_wages', 'Keep the staff and raise their wages', 10, done('read_tavern_books'),
            'Leave the last month’s accounts where they stand. Tell the waiters they will earn twenty percent more and tell the shopkeeper his pay will rise forty percent.',
            [set('tavern', 'staff_retained'), set('waiter_raise_percent', 20), set('keeper_raise_percent', 40),
                note('tavern', 'The shopkeeper and waiters keep their jobs. The higher wages start from now. Your uncle already took the previous takings.')],
            {needs: [field('tavern', 'books_checked'), stock(deeds)], reason: 'Read the tavern’s books before changing the wages.'}),
        act('inspect_the_houses', 'Walk through the three bamboo houses', 40, done('raise_tavern_wages'),
            'Most of the rooms are already let. Check the rents and leave the arrangements in place. From the upper railing you can see beyond the village roofs.',
            [set('rentals', 'terms_retained'), set('return', 'fang_zheng_below'),
                note('rentals', 'Keep the existing rents. Below the railing, Fang Zheng calls up and asks to speak to you.')],
            {needs: [stock(deeds), field('rented_houses', 3)], reason: 'Bring the estate deeds to check which houses and rents came with them.'})
    ]
};

let installed;
export async function registerGuLeadEstateHandover(register, base) {
    installed = null;
    if (!register.extension || base.contentHash !== baseHash ||
        !base.extensions?.some(e => e.id === GU_LEAD_WHITE_JADE && e.revision === 1 && e.contentHash === predecessorHash)) return null;
    installed = await register.extension(guLeadEstateHandover, base);
    return installed;
}

const longJobs = guLeadEstateHandover.commands.filter(command => command.duration >= 120).map(command => command.id);
export function guLeadEstateHandoverClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if (!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.life !== 'alive' || pupil.location !== academy || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_ESTATE_HANDOVER);
    if (!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && longJobs.includes(j.commandId));
    if (!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const command = extension.commands.find(c => c.id === job.commandId);
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= command.duration ? Math.min(120, remaining) : null;
}
