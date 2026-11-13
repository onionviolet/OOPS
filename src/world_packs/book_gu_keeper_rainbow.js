import {keeperRainbow as id, keeperRainbowWorld, quoteRainbow, rainbowDose, rainbowFlightMinutes, rainbowInterval} from './book_gu_keeper_sustained.js';
import {keeperGate} from '../gu_stargate.js';
import {keeperMoveTrial} from '../gu_keeper_move_trial.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const hill = `${keeperGate}.observatory`;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const active = eq(`${id}.active`);
const inactive = eq(`${id}.active`, false);
const loaned = eq(`${id}.loaned`);
const supported = eq(`${id}.supported`);

function command(name, label, needs, extra = {}) {
    return {
        id: `${id}.${name}`, revision: 1, label, duration: 0, group: 'structured_local',
        worldId: keeperRainbowWorld, location: annex, actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs), costs: [],
        effects: [{type: 'guRainbow', actor: 'player', operation: name}], ...extra,
    };
}

function start(name, label, support) {
    const cost = quoteRainbow(support);
    return command(name, `${label} · ${cost} white silver`,
        [inactive, loaned, ge(`${id}.reserve`, cost), ...(support ? [supported] : [])], {
            description: `Start the move for ${cost} measures. It draws the same amount every ${rainbowInterval} minutes while active.`,
        });
}

function flight(name, label, from, to) {
    return command(name, label, [active], {location: from, duration: rainbowFlightMinutes,
        description: 'Stay in light form until you reach the other end of the practice route.',
        completionRequires: all(ready, admitted, active), completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', reservationReturns: 1,
        effects: [{type: 'relocate', actor: 'player', location: to}],
    });
}

export const guKeeperRainbow = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [keeperGate, keeperMoveTrial],
    label: 'Practice sustained Rainbow Light',
    description: 'The steward lends a rank-three Rainbow Light Gu. Use stored white-silver essence to hold light form. Borrow Light Source from the Moonblade trial to reduce the draw.',
    requires: ready,
    reason: 'Set up the Stargates and take up Moonblade research first.',
    commands: [
        command('loan', 'Borrow Rainbow Light Gu', [eq(`${id}.loaned`, false)], {effects: [
            {type: 'fact', actor: 'player', scope: 'actor', key: `${id}.loan`, value: true},
        ]}),
        command('buy', `Buy ${rainbowDose} measures of white silver · 2 stones`, [ge(`item.${kKey('stone')}`, 2)], {
            costs: [{type: 'item', actor: 'player', key: kKey('stone'), amount: -2}],
        }),
        start('start_solo', 'Start Rainbow Light alone', false),
        start('start_supported', 'Start Rainbow Light with Light Source', true),
        flight('fly_out', `Fly to the hill observatory · ${rainbowFlightMinutes} min`, annex, hill),
        flight('fly_back', `Fly back to the Gu house · ${rainbowFlightMinutes} min`, hill, annex),
        command('stop', 'End Rainbow Light', [active], {location: null}),
    ],
};

export async function registerGuKeeperRainbow(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperRainbow, base);
    }
}
