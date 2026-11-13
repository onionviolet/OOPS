import {armorSettleMinutes, cloakSettleMinutes, farScreen, farStoneRun, keeperScaleArmor, keeperStealth as id,
    stealthPlace, stoneHollow, stoneImpact} from './book_gu_keeper_refinement_trials.js';
import {wolfRidge} from '../gu_wolf_ridge.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:b520860860968b72719b27f105927783599479aa0fc0e10f0bd23744767fb562';
const hosted = kId('hosted_wolf');
const glade = `${hosted}.glade`;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const admitted = eq(extensionFact(id));
const stone = kKey('stone');
const eye = kKey('wolf_ridge.wolf_eye');
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const move = location => ({type: 'relocate', actor: 'player', location});
const flag = value => ({type: 'fact', actor: 'player', scope: 'actor', key: `${id}.retrieved`, value});
const energyId = kId('primeval');

function command(name, label, location, {needs = [], costs = [], effects = [], description = '', pack = id} = {}) {
    const permission = pack === id ? admitted : eq(extensionFact(pack));
    return {id: `${pack}.${name}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: kId('world'), location, actorId: 'player', audience: ['$actor'], visibleWhen: permission,
        requires: all(ready, permission, ...needs), costs, effects};
}
function act(operation, label, description, {needs = [], effects = [], ...options} = {}) {
    return command(operation, label, stealthPlace(operation), {...options, description,
        needs: [eq(`${id}.can_${operation}`), ...needs], effects: [{type: 'guHostedWolf', actor: 'player', operation}, ...effects]});
}
function charge(amount) {
    return {needs: [eq(`faculty.${kId('aperture')}.active`), ge(`energy.${energyId}.reserve`, amount)],
        costs: Array.from({length: amount}, () => ({type: 'energy', actor: 'player', energyId, operation: 'use', output: 1, control: 1}))};
}
export const guKeeperStealth = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [hosted, wolfRidge],
    label: 'Make a cloak from Stealth Rock and Fish Scale',
    description: 'The hunter knows where a stone monkey shelters and has a Fish Scale Gu to trade.',
    requires: ready, reason: 'First take up the wolf ridge trail.',
    locations: [
        {id: stoneHollow, label: 'Stone monkey hollow', underRoof: false, description: 'Fresh scratches run down the pale boulders.'},
        {id: farScreen, label: 'Far side of the watch screen', underRoof: false, description: 'The hunter’s bundle is behind the watcher.'},
    ],
    commands: [
        command('enter_hollow', 'Follow the stone monkey tracks', glade, {effects: [move(stoneHollow)]}),
        act('take_rock', 'Hunt the stone monkey and recover Stealth Rock · 2 stamina',
            'Hold the Gu as it slips from the fallen monkey.', {
                needs: [ge('vital.stamina', 2)], costs: [{type: 'vital', actor: 'player', key: 'stamina', amount: -2}], effects: [flag(false)],
            }),
        command('leave_hollow', 'Walk back to the glade', stoneHollow, {effects: [move(glade)]}),
        act('bind_rock', 'Refine control of Stealth Rock · 1 essence', 'Quiet the recovered Gu before you use it.', charge(1)),
        act('trade_fish', 'Trade a lightning wolf eye for Fish Scale', 'Exchange a real eye from your hunt for the living Gu.', {
            needs: [ge(`item.${eye}`, 1)], costs: [item(eye, -1)],
        }),
        act('buy_fish', 'Buy Fish Scale · 2 stones', 'Take the same Gu by paying the hunter’s price.', {
            needs: [ge(`item.${stone}`, 2)], costs: [item(stone, -2)],
        }),
        act('test_rock', 'Try Stealth Rock beside the watcher · 1 essence',
            'The watcher looks for you and the sash on your coat.', charge(1)),
        act('prepare_cloak', 'Align Stealth Rock and Fish Scale · 1 stone', `Keep both Gu at the bench for ${cloakSettleMinutes} minutes.`, {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)],
        }),
        act('cancel_cloak', 'Stop the Stealth Scales fusion', 'Both Gu survive. The preparation stone has been spent.'),
        act('finish_cloak', 'Finish the Stealth Scales fusion', 'The two living Gu become one rank-two Gu.'),
        act('test_scales', 'Try Stealth Scales beside the watcher and hound · 2 essence',
            'See what the watcher can spot and whether the hound can still smell you.', charge(2)),
        act('cross_screen', 'Slip past the watcher with Stealth Scales · 2 essence', 'Cross when the watcher is alone.', {
            ...charge(2), effects: [move(farScreen)],
        }),
        command('retrieve', 'Recover the hunter’s bundle · 2 petals', farScreen, {
            needs: [eq(`actor.${id}.retrieved`, false)], effects: [item(kKey('petals'), 2), flag(true)],
        }),
        command('return', 'Return to the glade', farScreen, {effects: [move(glade)]}),
    ],
};

const laminateId = `${keeperScaleArmor}.shell_laminate`;
const laminate = JSON.stringify({id: laminateId});
const armorCommand = (name, label, location, options) => command(name, label, location, {...options, pack: keeperScaleArmor});
function armorAct(operation, label, description, {needs = [], effects = [], ...options} = {}) {
    return armorCommand(operation, label, glade, {...options, description,
        needs: [eq(`${keeperScaleArmor}.can_${operation}`), ...needs],
        effects: [{type: 'guHostedWolf', actor: 'player', operation}, ...effects]});
}
export const guKeeperScaleArmor = {
    schema: 1, id: keeperScaleArmor, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [hosted, id],
    label: 'Try the Scale Armor branch', description: 'Use Fish Scale and a shell laminate to make a defensive Gu.',
    requires: ready, reason: 'First take up the Fish Scale lesson.',
    locations: [{id: farStoneRun, label: 'Far side of the stone run', underRoof: false,
        description: 'The ledge opens beyond the falling stones.'}],
    items: [{id: laminateId, label: 'Shell laminate', value: 0, description: 'Thin shell plates pressed together for the local armor recipe.'}],
    commands: [
        armorCommand('buy_laminate', 'Buy a shell laminate · 1 stone', glade, {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(laminate, 1)],
        }),
        armorAct('prepare_armor', 'Lay Fish Scale into the shell laminate', `Commit the living Gu for ${armorSettleMinutes} minutes.`, {
            needs: [ge(`item.${laminate}`, 1)], costs: [item(laminate, -1)],
        }),
        armorAct('cancel_armor', 'Stop the Scale Armor fusion', 'Fish Scale survives. The shell plates have already been used.'),
        armorAct('finish_armor', 'Finish the Scale Armor fusion', 'Settle the rank-two defensive Gu.'),
        armorCommand('plain_run', `Cross the falling stones unguarded · ${stoneImpact} health`, glade, {
            needs: [ge('vital.health', stoneImpact + 1)], costs: [{type: 'vital', actor: 'player', key: 'health', amount: -stoneImpact}],
            effects: [move(farStoneRun)], description: 'A loose stone will strike as you cross.',
        }),
        armorAct('guard_run', 'Cross under Scale Armor · 2 essence', 'Raise the armor as the same stone falls.', {
            ...charge(2), effects: [move(farStoneRun)],
        }),
        armorCommand('return', 'Walk back to the glade', farStoneRun, {effects: [move(glade)]}),
    ],
};

export async function registerGuKeeperStealth(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperStealth, base);
        await register.bundledInstantExtension(guKeeperScaleArmor, base);
    }
}
