import {smokeAnnex, smokeBend, smokeExit, smokeMouth, smokePassage as id, smokeRoutes,
    smokeSteward, smokeStewardDestinations} from '../gu_smoke_passage.js';
import {wolfScouting} from '../gu_wolf_scouting.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const permission = eq(extensionFact(id));
const signed = eq(`${id}.signed`);
const atAnnex = eq(`${id}.at_annex`);
const reserve = ge(`${id}.reserve`, 1);
const stone = kKey('stone');
const dose = kKey('hosted_wolf.silver_dose');
const hasDose = ge(`item.${dose}`, 1);
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const move = location => ({type: 'relocate', actor: 'player', location});
const stewardMove = operation => ({type: 'relocate', actor: smokeSteward, location: smokeStewardDestinations[operation]});
const flag = value => ({type: 'fact', actor: 'player', scope: 'actor', key: `${id}.reward`, value});
const conduct = operation => ({type: 'guHostedWolf', actor: 'player', operation});
const ally = (leg, value = true) => eq(`${id}.${leg}_ally`, value);

function command(name, label, location, {needs = [], costs = [], effects = [], description = ''} = {}) {
    return {id: `${id}.${name}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: kId('world'), location, actorId: 'player', audience: ['$actor'], visibleWhen: permission,
        requires: all(ready, permission, ...needs), costs, effects};
}
function legCommands(leg, route) {
    const here = (name, label, options) => command(`${leg}_${name}`, label, route.site, options);
    const sense = (mode, label, description, {needs = [], costs = []} = {}) => here(mode, label, {
        needs: [signed, ...needs], costs, description, effects: [conduct(`${leg}_${mode}`)],
    });
    const safe = route.safe === 'side' ? 'Take the side trail' : 'Take the straight trail';
    const wrong = route.safe === 'side' ? 'Take the straight trail' : 'Take the side trail';
    return [
        sense('look', 'Look ahead with Lightning Eye · 1 white-silver dose', 'Read the near ground through the smoke.', {
            needs: [hasDose], costs: [item(dose, -1)],
        }),
        sense('listen', 'Have the steward listen through the ground', 'Hear movement well beyond the visible trail.', {
            needs: [ally(leg), reserve],
        }),
        sense('combine', 'Look and listen together · 1 white-silver dose', 'Use your Eye while the steward places the roots against the ground.', {
            needs: [ally(leg), reserve, hasDose], costs: [item(dose, -1)],
        }),
        here(route.safe, safe, {needs: [signed, ally(leg)], effects: [move(route.destination), stewardMove(`${leg}_${route.safe}`)]}),
        here(`${route.safe}_alone`, safe, {needs: [signed, ally(leg, false)], effects: [move(route.destination)]}),
        here('wrong', wrong, {needs: [signed, ge('vital.stamina', 3)], costs: [{type: 'vital', actor: 'player', key: 'stamina', amount: -3}],
            effects: [conduct(`${leg}_wrong`)]}),
        here('send_back', 'Send the steward back to the Gu house', {needs: [signed, ally(leg)], effects: [stewardMove(`${leg}_send_back`)]}),
        here('rally', 'Call the steward back to your signal rope', {needs: [signed, atAnnex], effects: [stewardMove(`${leg}_rally`)]}),
        here('retreat', 'Follow the rope back to the Gu house', {needs: [signed, ally(leg)], effects: [move(smokeAnnex), stewardMove(`${leg}_retreat`)]}),
        here('retreat_alone', 'Follow the rope back to the Gu house', {needs: [signed, ally(leg, false)], effects: [move(smokeAnnex)]}),
    ];
}

export const guKeeperSmokePassage = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [wolfScouting],
    label: 'Scout the smoke with the steward', description: 'Bring Lightning Eye. The steward brings Earth Communication Ear Grass.',
    requires: all(ready, eq(`${id}.eye`)), reason: 'Recover and refine the crown wolf’s Lightning Eye.',
    locations: [
        {id: smokeMouth, label: 'Smoke passage entrance', underRoof: false, description: 'The rope leads to a fork in the smoke.'},
        {id: smokeBend, label: 'Smoke passage bend', underRoof: false, description: 'A channel crosses the trail ahead.'},
        {id: smokeExit, label: 'Clearing beyond the smoke', underRoof: false, description: 'The courier’s sack lies on a dry stone.'},
    ],
    commands: [
        command('start', 'Pay for the steward’s supplies and enter · 1 stone', smokeAnnex, {
            needs: [eq(`${id}.signed`, false), atAnnex, ge(`item.${stone}`, 1)], costs: [item(stone, -1)],
            effects: [move(smokeMouth), stewardMove('start'), flag(false)],
            description: 'The steward carries two doses for the Ear Grass. Bring white silver for Lightning Eye.',
        }),
        command('replenish', 'Restock two listening doses · 1 stone', smokeAnnex, {
            needs: [signed, atAnnex, ge(`item.${stone}`, 1)], costs: [item(stone, -1)],
        }),
        command('reenter', 'Return to the smoke with the steward', smokeAnnex, {
            needs: [signed, atAnnex], effects: [move(smokeMouth), stewardMove('reenter')],
        }),
        ...Object.entries(smokeRoutes).flatMap(([leg, route]) => legCommands(leg, route)),
        command('recover', 'Recover the courier’s sack · 3 stones', smokeExit, {
            needs: [signed, eq(`actor.${id}.reward`, false)], effects: [item(stone, 3), flag(true)],
        }),
        command('return', 'Take the outer path to the Gu house', smokeExit, {needs: [signed], effects: [move(smokeAnnex), stewardMove('return')]}),
    ],
};

export async function registerGuKeeperSmokePassage(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) await register.bundledInstantExtension(guKeeperSmokePassage, base);
}
