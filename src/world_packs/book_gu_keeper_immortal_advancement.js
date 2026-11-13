import {advancementQuenchRisk, advancementSettleMinutes, keeperAdvancement as id, keeperAdvancementMaterials,
    keeperLuckSand, keeperRefinement, keeperRefinementWorld} from '../gu_keeper_refinement.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const race = eq(extensionFact(keeperRefinement));
const canStart = eq(`${id}.can_advance_start`);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function command(operation, label, description, {needs = [], costs = []} = {}) {
    const buying = operation === 'buy_sand';
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperRefinementWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, race, buying ? canStart : eq(`${id}.can_${operation}`), ...needs),
        costs, effects: [buying ? item(keeperLuckSand, keeperAdvancementMaterials) :
            {type: 'guRefinement', actor: 'player', operation}],
    };
}

export const guKeeperImmortalAdvancement = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Advance Fortune Thread to rank seven',
    description: 'The visiting immortal offers to help raise your Fortune Thread in the same furnace.',
    requires: all(ready, race, canStart),
    reason: 'Refine a Fortune Thread of your own first.',
    commands: [
        command('buy_sand', `Buy ${keeperAdvancementMaterials} measures of luck sand · 1 stone`, 'Set aside fresh sand for the rank-seven attempt.', {
            needs: [ge(`item.${kKey('stone')}`, 1)], costs: [item(kKey('stone'), -1)],
        }),
        command('advance_start', `Begin raising Fortune Thread · ${keeperAdvancementMaterials} luck sand`,
            `Give the furnace ${advancementSettleMinutes} minutes to settle before you finish.`, {
                needs: [ge(`item.${keeperLuckSand}`, keeperAdvancementMaterials)], costs: [item(keeperLuckSand, -keeperAdvancementMaterials)],
            }),
        command('advance_finish', 'Finish raising Fortune Thread', 'Raise the Gu to rank seven after the furnace settles.'),
        command('advance_quench', 'Quench Fortune Thread early', `You can finish before the furnace settles. There is a ${advancementQuenchRisk * 100}% chance the Gu will be destroyed.`),
        command('advance_cancel', 'Stop the rank-seven attempt', 'Return Fortune Thread to its enclosure and take back the unused sand.'),
    ],
};

export async function registerGuKeeperImmortalAdvancement(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperImmortalAdvancement, base);
    }
}
