import {keeperRoamingWorm, keeperWild as id, keeperWildWorld, wormReturnMinutes} from '../gu_keeper_wild.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const status = `${id}.trail_note`;
const wine = JSON.stringify({id: `${id}.wine`});
const essenceId = kId('primeval');
const useEssence = amount => ({
    needs: [eq(`faculty.${kId('aperture')}.active`), ge(`energy.${essenceId}.reserve`, amount)],
    costs: Array.from({length: amount}, () => ({type: 'energy', actor: 'player', energyId: essenceId,
        operation: 'use', output: 1, control: 1})),
});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const note = value => ({type: 'knowledge', actor: 'player', key: status, stage: 'understood', value});

function command(operation, label, value, {needs = [], costs = []} = {}) {
    return {
        id: `${id}.${operation}`, revision: 1, label, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted,
            ...(operation === 'buy_wine' ? [] : [eq(`${id}.can_${operation}`)]), ...needs), costs,
        effects: [operation === 'buy_wine' ? item(wine, 1) : {type: 'guWild', actor: 'player', operation}, note(value)],
    };
}

export const guKeeperWildWorm = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Track a wild Liquor Worm',
    description: 'The steward points you toward a trail by the village border. Bring wine if you want the Gu to come close.',
    requires: ready,
    reason: 'Speak to the steward at the Gu house.',
    items: [{id: `${id}.wine`, label: 'Trail wine', description: 'A portion of wine for luring a wild Liquor Worm.', value: 0}],
    status: [{id: `${id}.trail_status`, label: 'Liquor Worm trail', knowledgeKey: status}],
    commands: [
        command('find', 'Look for the Liquor Worm trail', 'You spot a wild Liquor Worm at the village border.'),
        command('approach', 'Try to approach the Liquor Worm', 'The Gu darts away, leaving a trace through the grass.'),
        command('follow', 'Follow the trace to its refuge', 'You find the gap where the Liquor Worm hides.'),
        command('buy_wine', 'Buy trail wine · 1 stone', 'The steward sells you a portion of wine.', {
            needs: [ge(`item.${kKey('stone')}`, 1)], costs: [item(kKey('stone'), -1)],
        }),
        command('lure', 'Lure the Liquor Worm · 1 wine', 'The Liquor Worm creeps closer to drink.', {
            needs: [ge(`item.${wine}`, 1)], costs: [item(wine, -1)],
        }),
        command('capture', 'Capture the Liquor Worm · 2 essence', 'You catch the Gu. Its wild will still resists your control.', useEssence(2)),
        command('refine', 'Refine control of the wild Gu · 1 essence', 'The captured Gu now answers to your will.', useEssence(1)),
        command('release', 'Release the Liquor Worm at the border', `You let the Gu go. Give it ${wormReturnMinutes} minutes before looking for its trail.`),
    ],
};

export async function registerGuKeeperWildWorm(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperWildWorm, base);
        await register.bundledInstantExtension(guKeeperRoamingWorm, base);
    }
}

const roaming = keeperRoamingWorm;
const roamingAdmitted = eq(extensionFact(roaming));
function roamingCommand(operation, label, description, needs = [], costs = []) {
    return {id: `${roaming}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: roamingAdmitted, requires: all(ready, roamingAdmitted, eq(`${roaming}.can_${operation}`), ...needs),
        costs, effects: [{type: 'guWild', actor: 'player', operation}]};
}
const guKeeperRoamingWorm = {
    schema: 1, id: roaming, revision: 1, base: guKeeperWildWorm.base, dependsOn: [id],
    label: 'Watch where the Liquor Worm goes',
    description: 'The Worm can leave the border on its own. Set out wine to draw it back when it goes.',
    requires: ready, reason: 'Open the Liquor Worm trail first.',
    commands: [
        roamingCommand('watch_worm', 'Start a watch at the Worm’s trail', 'Keep track of the Worm while other work goes on.'),
        roamingCommand('leave_wine', 'Leave a cup at the border · 1 wine', 'The Worm can return for the scent when it is ready to drink.',
            [ge(`item.${wine}`, 1)], [item(wine, -1)]),
    ],
};
