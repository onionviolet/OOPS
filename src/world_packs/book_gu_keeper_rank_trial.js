import {moonglowBlade} from '../gu_ability_profiles.js';
import {quoteGuFuel} from '../gu_fuel.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const id = kId('rank_trial');
const key = name => `${id}.${name}`;
const itemKey = name => JSON.stringify({id: key(name)});
const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: key(name), stage: 'understood', value});
const condition = value => ({type: 'fact', scope: 'actor', actor: 'player', key: key('moonglow_sound'), value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'), eq('body.ownerId', 'player'),
    eq('body.controllerId', 'player'), eq(`faculty.${kId('aperture')}.active`));
const admitted = eq(extensionFact(id));
const loan = ge(`item.${itemKey('loan')}`, 1);
const sound = eq(`actor.${key('moonglow_sound')}`);
const aperture = quoteGuFuel(moonglowBlade, {rank: 2}, {family: 'primeval', pool: 'primeval', rank: 1, source: 'aperture'});
const stored = quoteGuFuel(moonglowBlade, {rank: 2}, {family: 'primeval', pool: 'red-steel', rank: 2, source: 'stored'});
const apertureCost = moonglowBlade.cost * aperture.factor;
const storedCost = moonglowBlade.cost * stored.factor;
const riskPercent = Math.round(aperture.funding.controlRisk * 100);
const hit = note('last_cast', 'The Moonglow blade cuts through the straw bundle.');

function command(name, label, needs, extra) {
    return {
        id: key(name), revision: 1, label, duration: 0, group: 'structured_local',
        worldId: kId('world'), location: kId('annex'), actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs), costs: [], effects: [], ...extra,
    };
}

export const guKeeperRankTrial = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Practice with rank-two Moonglow',
    description: 'The steward can lend you a Moonglow Gu for a trial. Try the stronger blade with your own essence or buy a dose of red-steel essence.',
    requires: all(ready, eq(`claim.${kId('moon_title')}.owner`, 'player')),
    reason: 'Take in your Moonlight Gu before asking for the stronger blade.',
    items: [
        {id: key('loan'), label: 'Moonglow Gu on loan', description: 'One rank-two Gu lent for the clan practice trial.', value: 0},
        {id: key('red_steel'), label: 'Red-steel essence dose', description: `A sealed dose of ${storedCost} units for one practice throw.`, value: 0},
    ],
    status: [
        {id: key('loan_status'), label: 'Moonglow loan', knowledgeKey: key('loan_note')},
        {id: key('cast_status'), label: 'Latest trial', knowledgeKey: key('last_cast')},
    ],
    commands: [
        command('borrow', 'Borrow the steward’s Moonglow Gu', [], {once: true,
            effects: [item(itemKey('loan'), 1), condition(true), note('loan_note', 'The steward lends you the clan’s practice Moonglow Gu.')]}),
        command('buy_dose', 'Buy a red-steel dose · 2 stones', [loan, ge(`item.${kKey('stone')}`, 2)], {
            costs: [item(kKey('stone'), -2)], effects: [item(itemKey('red_steel'), 1)],
        }),
        command('aperture_cast', `Cast Moonglow · ${apertureCost} essence · ${riskPercent}% recoil risk`, [loan, sound,
            ge(`energy.${kId('primeval')}.reserve`, apertureCost)], {
            costs: Array.from({length: apertureCost}, () => ({
                type: 'energy', actor: 'player', energyId: kId('primeval'), operation: 'use', output: 1, control: 1,
            })),
            outcomes: [
                {id: key('hit'), weight: 100 - riskPercent, effects: [hit]},
                {id: key('recoil'), weight: riskPercent, effects: [condition(false),
                    note('last_cast', 'The blade breaks apart. The recoil injures the Moonglow Gu.')]}
            ],
        }),
        command('stored_cast', 'Cast Moonglow with one red-steel dose', [loan, sound, ge(`item.${itemKey('red_steel')}`, 1)], {
            costs: [item(itemKey('red_steel'), -1)], effects: [hit],
        }),
        command('treat', 'Have the steward tend Moonglow · 1 stone', [loan, eq(`actor.${key('moonglow_sound')}`, false),
            ge(`item.${kKey('stone')}`, 1)], {
            costs: [item(kKey('stone'), -1)], effects: [condition(true), note('last_cast', 'The steward treats the same Moonglow Gu. It is ready to cast again.')],
        }),
    ],
};

export async function registerGuKeeperRankTrial(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperRankTrial, base);
    }
}
