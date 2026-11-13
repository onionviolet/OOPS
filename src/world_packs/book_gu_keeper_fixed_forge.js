import {keeperFixedForge as id, keeperGuRestoration as restoreId, keeperFixedForgeWorld, fixedForgeDose,
    fixedForgeMinutes, keeperFixedWatch, markMinutes, restorationCareMinutes} from '../gu_keeper_fixed_forge.js';
import {keeperFixedTravel, fixedTravelAnnex, fixedTravelHill, fixedTravelCost, fixedTravelDose} from '../gu_keeper_immortal_travel.js';
import {keeperGate} from '../gu_stargate.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kKey} from './book_gu_keeper.js';
import {keeperTransitHouse as houseId, transitHouseCost, transitHouseMinutes} from '../gu_keeper_transit_house.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const stone = kKey('stone');
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const change = operation => ({type: 'guFixedForge', actor: 'player', operation});

function command(operation, label, description, {from = fixedTravelAnnex, needs = [], costs = [], effects, pack = id} = {}) {
    const access = pack === id ? admitted : eq(extensionFact(pack));
    return {id: `${pack}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperFixedForgeWorld, location: from, actorId: 'player', audience: ['$actor'],
        visibleWhen: access, requires: all(ready, access, ...needs), costs,
        effects: effects ?? [change(operation)]};
}

const can = operation => eq(`${id}.can_${operation}`);
const pay = operation => ({needs: [can(operation), ge(`item.${stone}`, 1)], costs: [item(stone, -1)]});
function crossing(operation, label, from, to) {
    return command(operation, label, 'Use the rank-seven Gu and a stored red date dose to reach the remembered landing.', {
        from, needs: [can(operation), ge(`item.${fixedForgeDose}`, fixedTravelCost)], costs: [item(fixedForgeDose, -fixedTravelCost)],
        effects: [change(operation), {type: 'relocate', actor: 'player', location: to}],
    });
}

export const guKeeperFixedForge = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperGate, keeperFixedTravel],
    label: 'Compare the Fixed Immortal Travel forge and loan',
    description: 'A distant refiner will try to make a rank-six Fixed Immortal Travel. The visiting immortal can raise the living loan Gu to rank seven.',
    requires: ready,
    reason: 'Take up the Fixed Immortal Travel loan first.',
    items: [{id: `${id}.red_date`, label: 'Red date essence for Fixed Immortal Travel', value: 0,
        description: 'A stored rank-seven dose for the raised Gu.'}],
    commands: [
        command('commission', 'Commission the distant rank-six refinement · 1 stone',
            `The distant refiner prepares fresh material. Ask for the result after ${fixedForgeMinutes} minutes.`, pay('commission')),
        command('raise', 'Raise the living loan Gu to rank seven · 1 stone',
            'The visiting immortal advances the same Gu in the supervised forge.', pay('raise')),
        command('settle', 'Ask for the distant furnace result', 'Hear whether the rank-six procedure succeeded.', {needs: [can('settle')]}),
        command('destroy', 'Destroy the held rank-seven Gu', 'End the life of the borrowed specimen. Any later Gu will be a new individual.',
            {needs: [can('destroy')]}),
        command('buy_dose', 'Buy a red date essence dose · 1 stone', 'Set aside fuel for the rank-seven Gu.', {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(fixedForgeDose, 1)],
        }),
        crossing('travel_out', 'Use rank-seven Fixed Immortal Travel to the hill · 1 red date dose', fixedTravelAnnex, fixedTravelHill),
        crossing('travel_back', 'Use rank-seven Fixed Immortal Travel to the Gu house · 1 red date dose', fixedTravelHill, fixedTravelAnnex),
    ],
};

function restorationCommand(operation, label, description, {needs = [], costs = []} = {}) {
    return command(operation, label, description, {pack: restoreId,
        needs: [eq(`${restoreId}.can_${operation}`), ...needs], costs});
}

export const guKeeperRestoration = {
    schema: 1, id: restoreId, revision: 1, base: guKeeperFixedForge.base, dependsOn: [id, keeperFixedTravel],
    label: 'Inspect an old mark on Fixed Immortal Travel',
    description: 'The steward has set up a Gu as Before formation. Examine the original loan Gu for an old refinement mark. Keep one green grape dose ready.',
    requires: ready, reason: 'Take up the loan and distant forge first.',
    commands: [
        restorationCommand('reveal_mark', 'Expose the old refinement mark',
            `The mark begins to flare as it is exposed. You have ${markMinutes} minutes before it destroys the Gu.`),
        restorationCommand('stabilize', 'Use Gu as Before · 1 green grape dose',
            'Strip the destructive mark while the Gu lives. The Gu will still need treatment.', {
                needs: [ge(`item.${fixedTravelDose}`, 1)], costs: [item(fixedTravelDose, -1)],
            }),
        restorationCommand('tend', 'Tend the stabilized Gu',
            `Let it rest for ${restorationCareMinutes} minutes after stabilization before tending the injury.`),
    ],
};

const freightId = `${houseId}.freight`;
const freight = JSON.stringify({id: freightId});
const houseCan = operation => eq(`${houseId}.can_${operation}`);
const houseCommand = (operation, label, description) => command(operation, label, description,
    {pack: houseId, needs: [houseCan(operation)]});
function houseCross(operation, label, brace, loaded = false) {
    const amount = transitHouseCost[brace];
    return command(operation, `${label} · ${amount} green grape ${amount === 1 ? 'dose' : 'doses'}`,
        loaded ? 'Carry the steward’s supply crate to the hill and receive one stone on delivery.' : 'Cross to the remembered hill terrace.', {
            pack: houseId, needs: [houseCan(operation), ge(`item.${fixedTravelDose}`, amount), ...(loaded ? [ge(`item.${freight}`, 1)] : [])],
            costs: [item(fixedTravelDose, -amount), ...(loaded ? [item(freight, -1)] : [])],
            effects: [change(operation), {type: 'relocate', actor: 'player', location: fixedTravelHill},
                ...(loaded ? [item(stone, 1)] : [])],
        });
}

export const guKeeperTransitHouse = {
    schema: 1, id: houseId, revision: 1, base: guKeeperFixedForge.base, dependsOn: [keeperGate, keeperFixedTravel, id],
    label: 'Assemble a Gu House for the hill crossing',
    description: 'Seat the living rank-six Fixed Immortal Travel in a transit frame. The anchor brace can carry freight. The lighter brace costs less to run.',
    requires: ready, reason: 'Take up the loan and distant forge first.',
    items: [{id: freightId, label: 'Hill supply crate', value: 0, description: 'Deliver this crate using the Gu House’s anchor brace.'}],
    commands: [
        houseCommand('open_frame', 'Lay out the transit frame', 'The steward sets out an Anchor Reed Gu and a Glide Reed Gu.'),
        houseCommand('fit_anchor', 'Fit the anchor brace', `Seat Anchor Reed Gu and let the frame set for ${transitHouseMinutes} minutes.`),
        houseCommand('fit_glide', 'Fit the glide brace', `Seat Glide Reed Gu and let the frame set for ${transitHouseMinutes} minutes.`),
        houseCommand('finish_frame', 'Finish fitting the Gu House', 'Secure the living core and brace in the settled frame.'),
        houseCommand('rush_frame', 'Force the frame before it sets', 'The brace will break. The steward shields the living core during the failure.'),
        houseCommand('unseat', 'Unseat the core and brace', 'Free the surviving Gu for use outside the frame.'),
        {...command('load_freight', 'Take the hill supply crate', 'The steward has one crate to send up the hill.', {
            pack: houseId, effects: [item(freight, 1)],
        }), once: true},
        houseCross('anchor_cross', 'Cross with the anchor brace', 'anchor'),
        houseCross('glide_cross', 'Cross with the glide brace', 'glide'),
        houseCross('freight_cross', 'Deliver the supply crate with the anchor brace', 'anchor', true),
    ],
};

const guKeeperFixedWatch = {
    schema: 1, id: keeperFixedWatch, revision: 1, base: guKeeperFixedForge.base, dependsOn: [keeperGate, id, restoreId],
    label: 'Watch the distant furnace from the hill',
    description: 'The distant refiner is looking for a chance at Fixed Immortal Travel. The hill overlooks the furnace.',
    requires: ready, reason: 'Take up the mark and distant forge first.',
    commands: [command('watch_smoke', 'Read the distant furnace from the hill',
        'Observe whether the refiner is working. The steward can confirm the outcome at the Gu house.', {
            pack: keeperFixedWatch, from: fixedTravelHill, needs: [eq(`${keeperFixedWatch}.can_watch_smoke`)],
        })],
};

export async function registerGuKeeperFixedForge(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperFixedForge, base);
        await register.bundledInstantExtension(guKeeperRestoration, base);
        await register.bundledInstantExtension(guKeeperTransitHouse, base);
        await register.bundledInstantExtension(guKeeperFixedWatch, base);
    }
}
