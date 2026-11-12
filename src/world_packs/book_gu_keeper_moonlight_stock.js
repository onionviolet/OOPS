import {moonlightStock as id} from '../gu_moonlight_stock.js';
import {moonlightTrial, moonlightTrialWorld} from '../gu_keeper_moonlight_trial.js';
import {moonlightBlade} from '../gu_ability_profiles.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const essence = kId('primeval');
const stone = kKey('stone');
const charge = units => Array.from({length: units}, () =>
    ({type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: 1, control: 1}));
const fuel = units => [eq(`faculty.${kId('aperture')}.active`), ge(`energy.${essence}.reserve`, units)];

function command(operation, label, description, {needs = [], costs = []} = {}) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: moonlightTrialWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, eq(`${id}.can_${operation}`), ...needs), costs,
        effects: [{type: 'guMoonlightTrial', actor: 'player', operation}]};
}

export const guKeeperMoonlightStock = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [moonlightTrial],
    label: 'Compare two Gu from the clan trays',
    description: 'The steward sets out two rank-one Moonlight Gu from the clan’s stock. Try them on the same paper.',
    requires: ready,
    reason: 'Take up the steward’s Moonlight Gu trial first.',
    commands: [
        command('survey', 'Inspect the clan trays', 'The steward sets aside two individual Gu for the trial.'),
        command('borrow_first', 'Borrow the first Moonlight Gu', 'Take the first Gu from the tray.'),
        command('borrow_second', 'Borrow the second Moonlight Gu', 'Take the second Gu from the tray.'),
        command('return_stock', 'Return the tray Gu', 'Put the Gu back in the steward’s tray. Its blade and earlier work will be there when you borrow it again.'),
        command('cast_stock', `Test the tray Gu’s blade · ${moonlightBlade.cost} essence`, 'Use a fresh stack of identical paper.',
            {needs: fuel(moonlightBlade.cost), costs: charge(moonlightBlade.cost)}),
        command('tune_stock', 'Refine the tray Gu’s focus · 1 stone, 1 essence', 'Tighten the held Gu’s blade at the same rank.', {
            needs: [...fuel(1), ge(`item.${stone}`, 1)], costs: [...charge(1), {type: 'item', actor: 'player', key: stone, amount: -1}],
        }),
    ],
};

export async function registerGuKeeperMoonlightStock(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperMoonlightStock, base);
    }
}
