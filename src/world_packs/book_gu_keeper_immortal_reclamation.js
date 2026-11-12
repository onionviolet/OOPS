import {keeperLuckSand, keeperReclamation as id, keeperRefinement, keeperRefinementMaterials,
    keeperRefinementWorld, refinementStageMinutes} from '../gu_keeper_refinement.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const admitted = eq(extensionFact(id));
const sand = keeperRefinementMaterials;

function command(operation, label, description) {
    const funds = operation === 'retry_start' ? [{fact: `item.${keeperLuckSand}`, op: 'gte', value: sand}] : [];
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperRefinementWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, eq(`${id}.can_${operation}`), ...funds),
        costs: funds.length ? [{type: 'item', actor: 'player', key: keeperLuckSand, amount: -sand}] : [],
        effects: [{type: 'guRefinement', actor: 'player', operation}],
    };
}

export const guKeeperImmortalReclamation = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperRefinement],
    label: 'Practice keeping and remaking Fortune Thread',
    description: 'The steward can keep your Fortune Thread. The furnace is also available for another attempt.',
    requires: all(ready, eq(`${id}.can_retry_start`)),
    reason: 'Finish or stop your first refinement attempt.',
    commands: [
        command('lend', 'Leave Fortune Thread with the steward', 'Move the living Gu into the steward’s care.'),
        command('recall', 'Take Fortune Thread back', 'Bring the same Gu back from the steward’s enclosure.'),
        command('destroy', 'Destroy Fortune Thread', 'Destroy the living Gu in your care. You would need to refine a new one.'),
        command('retry_start', `Begin another refinement · ${sand} luck sand`, `Set fresh sand in the furnace. It takes ${refinementStageMinutes} minutes to warm.`),
        command('retry_prepare', 'Prepare the fresh sand', `Work the first portion of sand, then let it settle for ${refinementStageMinutes} minutes.`),
        command('retry_finish', 'Finish the new refinement', 'Bring the fresh sand together at the last step.'),
        command('retry_cancel', 'Stop the new refinement', 'Let the furnace cool and take back the unspent sand.'),
    ],
};

export async function registerGuKeeperImmortalReclamation(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperImmortalReclamation, base);
    }
}
