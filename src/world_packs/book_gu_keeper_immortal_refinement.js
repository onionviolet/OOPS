import {keeperLuckSand, keeperRefinement as id, keeperRefinementMaterials, keeperRefinementWorld, refinementStageMinutes} from '../gu_keeper_refinement.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const admitted = eq(extensionFact(id));
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function command(operation, label, {needs = [], costs = [], description} = {}) {
    const buying = operation === 'buy_sand';
    return {
        id: `${id}.${operation}`, revision: 1, label, ...(description && {description}), duration: 0,
        group: 'structured_local', worldId: keeperRefinementWorld, location: kId('annex'),
        actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...(buying ? [] : [eq(`${id}.can_${operation}`)]), ...needs),
        costs, effects: [buying ? item(keeperLuckSand, keeperRefinementMaterials) :
            {type: 'guRefinement', actor: 'player', operation}],
    };
}

export const guKeeperImmortalRefinement = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Try refining Fortune Thread',
    description: 'A visiting immortal lends you a furnace and supervises a rare luck-path recipe. You supply the sand and decide when to tend it.',
    requires: ready,
    reason: 'Speak to the visitor at the Gu house.',
    items: [{id: `${id}.luck_sand`, label: 'Luck sand', description: 'Sand for the Fortune Thread refinement.', value: 0}],
    commands: [
        command('buy_sand', `Buy ${keeperRefinementMaterials} measures of luck sand · 2 stones`, {
            needs: [ge(`item.${kKey('stone')}`, 2)], costs: [item(kKey('stone'), -2)],
        }),
        command('start', `Light the Fortune Thread furnace · ${keeperRefinementMaterials} luck sand`, {
            needs: [ge(`item.${keeperLuckSand}`, keeperRefinementMaterials)], costs: [item(keeperLuckSand, -keeperRefinementMaterials)],
            description: `Set the sand aside and let the furnace warm for ${refinementStageMinutes} minutes.`,
        }),
        command('prepare', 'Prepare the luck sand in the furnace', {
            description: `This step uses two measures. Let the sand settle for ${refinementStageMinutes} minutes.`,
        }),
        command('finish', 'Finish refining Fortune Thread', {description: 'Use the last three measures to finish the Gu.'}),
        command('cancel', 'Let the furnace go cold', {description: 'Take back the sand the furnace has yet to use.'}),
    ],
};

export async function registerGuKeeperImmortalRefinement(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperImmortalRefinement, base);
    }
}
