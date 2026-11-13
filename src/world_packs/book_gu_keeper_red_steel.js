import {keeperRedSteel as id, keeperRankTrialId, keeperMoonglowLoan} from './book_gu_keeper_lines.js';
import {keeperFourFlavors, keeperTrailWine, keeperWildWorld} from '../gu_keeper_wild.js';
import {fourFlavorsConversion as recipe} from '../gu_liquor_worm.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq(`faculty.${kId('aperture')}.active`));
const loan = ge(`item.${keeperMoonglowLoan}`, 1);
const doseId = `${id}.middle_dose`;
const dose = JSON.stringify({id: doseId});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function command(operation, label, description, needs, costs = [], effects = [{type: 'guWild', actor: 'player', operation}]) {
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperWildWorld, location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs), costs, effects,
    };
}

export const guKeeperRedSteel = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperFourFlavors, keeperRankTrialId],
    label: 'Refine red-steel essence with Four Flavors',
    description: 'Use the new Worm to raise a middle-stage rank-two dose to upper stage, then test it with the steward’s Moonglow Gu.',
    requires: all(ready, loan, eq(`${keeperFourFlavors}.held`)),
    reason: 'Complete the Four Flavors fusion and borrow the steward’s Moonglow Gu.',
    items: [{id: doseId, label: 'Middle-stage red-steel dose', value: 0,
        description: `A sealed rank-two dose containing ${recipe.cost} measures.`}],
    commands: [
        command('buy_middle', 'Buy middle-stage red steel · 2 stones',
            `Buy a rank-two dose containing ${recipe.cost} measures.`, [ge(`item.${kKey('stone')}`, 2)],
            [item(kKey('stone'), -2)], [item(dose, 1)]),
        command('feed_four', 'Feed Four Flavors · 1 wine', 'One portion keeps the Worm fed for a day.',
            [eq(`${id}.can_feed_four`), ge(`item.${keeperTrailWine}`, 1)], [item(keeperTrailWine, -1)]),
        command('concentrate_red', 'Raise the red-steel dose to upper stage',
            `Four Flavors turns ${recipe.cost} ${recipe.from}-stage measures into ${recipe.yield} ${recipe.stage}-stage measures, all at rank two.`,
            [eq(`${id}.can_concentrate_red`), ge(`item.${dose}`, 1)], [item(dose, -1)]),
        command('cast_upper', `Cast Moonglow with upper-stage red steel · ${recipe.yield} measures`,
            'Try the stronger blade against the straw bundles.', [eq(`${id}.can_cast_upper`), loan]),
    ],
};

export async function registerGuKeeperRedSteel(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperRedSteel, base);
    }
}
