// Optional, original Village care proposals. Importing these definitions does
// not enroll the player, grant supplies, or add another clock.
import {all, any, eq} from './basics.js';
export const STATUS_CARE_IDS = Object.freeze({
    world: 'base.frontier',
    group: 'status_care',
    prefix: 'status.care.',
    warmed: 'status.care.warmed',
    lined: 'status.care.lined',
    steady: 'status.care.steady',
    tired: 'status.care.tired',
    focused: 'status.care.focused',
    begin: 'status.care.begin',
    readWeather: 'status.care.read_weather',
    dryOff: 'status.care.dry_off',
    stoke: 'status.care.stoke_warmth',
    lining: 'status.care.prepare_lining',
    grip: 'status.care.prepare_grip',
    slowPack: 'status.care.slow_pack',
    precisePack: 'status.care.precise_pack',
    shelteredPack: 'status.care.sheltered_pack',
    restHands: 'status.care.rest_hands',
    focusedBreak: 'status.care.focused_break',
});

const I = STATUS_CARE_IDS;
const key = id => JSON.stringify({id});
export const STATUS_CARE_KEYS = Object.freeze({
    log: key('Rough wood log'),
    pelt: key('Rat pelt'),
    rope: key('Survey rope'),
    kit: key('Prepared survey kit'),
});
const K = STATUS_CARE_KEYS;

const af = (name, value = true) => ({type: 'fact', scope: 'actor', key: I.prefix + name, value});
const item = (itemKey, amount, returned = false) => ({type: 'item', key: itemKey, amount, ...(returned ? {reservationReturn: true} : {})});
const money = amount => ({type: 'resource', native: true, key: 'money', amount, actor: 'player'});
const coins = amount => ({type: 'resource', key: 'coins', amount, actor: 'oldCraftsman'});
const stamina = amount => ({type: 'vital', key: 'stamina', amount, actor: 'player'});
const condition = (id, operation, duration) => ({type: 'condition', id, operation, ...(duration == null ? {} : {duration})});
const know = (name, value) => ({type: 'knowledge', key: I.prefix + name, stage: 'seen', value});

const enrolled = eq('statusCare.enrolled');
const local = eq('statusCare.local');
const body = eq('statusCare.supportedBody');
const hands = eq('statusCare.handsUsable');
const sheltered = eq('statusCare.sheltered');
const nativeWet = eq('statusCare.nativeWet');
const tired = eq('statusCare.tired');
const steady = eq('statusCare.steady');
const lined = eq('statusCare.lined');
const focused = eq('statusCare.focused');
const warmed = eq('statusCare.warmed');
const localBody = all(enrolled, local, body);
const handWork = all(localBody, hands);
const supported = requirements => ({completionRequires: all(localBody, requirements), completionFailure: 'refund'});
const command = d => ({
    revision: 1,
    worldId: I.world,
    group: I.group,
    actorId: 'player',
    costs: [],
    effects: [],
    ...d,
});
const timed = (id, duration, location, requires, costs, effects, description, extra = {}) => command({
    id,
    label: `${extra.label || id.split('.').at(-1).replaceAll('_', ' ')} · ${duration} min`,
    location,
    duration,
    cancellation: 'refund',
    reservationReturns: 1,
    visibleWhen: all(enrolled, requires),
    requires: all(localBody, requires),
    ...supported(requires),
    costs,
    effects,
    description,
    ...extra,
});

const commands = [
    command({
        id: I.begin,
        label: 'Begin an optional record of local care',
        location: 'Village',
        once: true,
        visibleWhen: all(eq('village.elderMet'), eq('statusCare.supportedBody'), eq('statusCare.local')),
        requires: all(eq('village.elderMet'), eq('statusCare.supportedBody'), eq('statusCare.local')),
        description: 'Start an optional local care record after meeting the Village elder. This is free and grants no item, status, body change, or recurring obligation.',
        effects: [af('enrolled')],
    }),
    timed(I.readWeather, 1, 'Village', all(localBody), [], [
        {...know('weather', 'You inspected your clothing and the local shelter, and worked out how to fit a pelt lining with your rope. The lining slows future wetness; it does not dry clothes already soaked.'), stage:'understood'},
    ], 'A minute to inspect your exposure and understand the rain-lining procedure. This teaches the preparation; it produces no lining or weather change.', {label: 'Read the local weather'}),
    timed(I.dryOff, 3, 'Shack', all(nativeWet, sheltered), [], [
        af('dryReceipt'),
        know('dry_off', 'Three played minutes under the Shack roof dried your clothes. Wetness and accumulated rain exposure are cleared; existing cold keeps its own recovery.'),
    ], 'Dry wet clothes under the Shack roof for three minutes. Clears Wet and accumulated rain exposure. Cold is separate, and later rain can soak you again.', {
        label: 'Dry off in the Shack', completionRequires: all(localBody, sheltered),
    }),
    timed(I.stoke, 4, 'Shack', all(handWork, sheltered), [item(K.log, -1), stamina(-1)], [
        condition(I.warmed, 'apply', 20),
        know('warmth', 'One actual Rough wood log and one stamina fueled four played minutes of sheltered warmth. You feel warmed for twenty played minutes; no heat source or log was created.'),
    ], 'Spend one actual Rough wood log and one stamina in the sheltered Shack to feel warmed for twenty played minutes.', {label: 'Stoke a little warmth · 1 log + 1 stamina'}),
    timed(I.lining, 4, 'Village', all(handWork, eq('knowledge.status.care.weather.understood')),  [item(K.pelt, -1), item(K.rope, -1), stamina(-1)], [
        item(K.rope, 1, true),
        condition(I.lined, 'apply', 18),
        know('lining', 'You used one real Rat pelt, one stamina and four played minutes to prepare a lining. Your exact Survey rope returned once; the lining lasts eighteen played minutes.'),
    ], 'Use one actual Rat pelt, one held-returned Survey rope and one stamina to prepare temporary rain lining. The pelt is consumed and the same rope returns once.', {label: 'Prepare rain lining · 1 pelt + held rope + 1 stamina'}),
    timed(I.grip, 3, 'Village', all(handWork, eq('village.craftsmanMet'), eq('village.craftsmanPresent'),
        eq('statusCare.craftsmanWilling', true, 'Wait for the craftsman to finish his work or settle the interruption before shared practice.')), [money(-1), item(K.rope, -1), stamina(-1)], [
        item(K.rope, 1, true),
        coins(1),
        condition(I.steady, 'apply', 18),
        condition(I.tired, 'remove'),
        know('grip', 'You practiced a careful grip with the present Village craftsman for three played minutes, spent one native coin and one stamina, and returned the exact Survey rope once. One coin entered his existing purse; the steady grip lasts eighteen played minutes.'),
    ], 'After meeting the craftsman, practice with him while actually co-located. Pay one native coin, spend one stamina, and hold-return one real Survey rope. Completion pays his existing purse, grants a temporary steady grip, and clears temporary tiredness.', {
        label: 'Practice a careful grip · 1 coin + held rope + 1 stamina',
        targetId: 'oldCraftsman',
        coLocated: true,
        participants: ['$target'],
        completionRequires: all(localBody, hands, eq('village.craftsmanMet'), eq('village.craftsmanPresent'), eq('statusCare.craftsmanWilling')),
        completionCoLocated: true,
    }),
    timed(I.slowPack, 5, 'Village', handWork, [item(K.log, -1), money(-1), stamina(-3)], [
        item(K.kit, 1),
        condition(I.tired, 'apply', 12),
        condition(I.steady, 'remove'),
        know('slow_pack', 'One actual Rough wood log, one native coin, three stamina and five played minutes became one ordinary Prepared survey kit through careful slow packing. You feel tired for twelve played minutes.'),
    ], 'Make one Prepared survey kit with a log, one coin for fittings and three stamina. Slow work takes five minutes and leaves your hands tired for twelve; ordinary kit use remains available.', {label: 'Pack a survey kit slowly · 1 log + 1 coin + 3 stamina'}),
    timed(I.precisePack, 3, 'Village', all(handWork, steady), [item(K.log, -1), money(-1), stamina(-2), item(K.rope, -1)], [
        item(K.rope, 1, true),
        item(K.kit, 1),
        know('precise_pack', 'Your steady grip lasted through three played minutes of precise packing. One actual log, one native coin, two stamina and the held-returned Survey rope became one existing native Prepared survey kit; no tiredness was added.'),
    ], 'With a steady grip, make one Prepared survey kit in three minutes for a log, one fittings coin and two stamina. Hold your rope during work and get it back afterward. The grip must last through completion.', {label: 'Pack precisely · 1 log + 1 coin + 2 stamina + held rope'}),
    timed(I.shelteredPack, 4, 'Village', all(handWork, lined), [item(K.log, -1), money(-1), stamina(-2)], [
        item(K.kit, 1),
        know('sheltered_pack', 'Your prepared lining remained active through four played minutes of sheltered packing. One actual log, one native coin and two stamina became one existing native Prepared survey kit; the lining remains in effect.'),
    ], 'Use your prepared lining while making one Prepared survey kit in four minutes for a log, one fittings coin and two stamina. The lining must remain active through the work.', {label: 'Pack under prepared lining · 1 log + 1 coin + 2 stamina'}),
    timed(I.restHands, 3, 'Village', all(localBody, any(tired, eq('body.handsTender'))), [], [
        condition(I.tired, 'remove'),
        condition('body.sore_hands', 'remove'),
        condition('body.scraped_hands', 'remove'),
        know('rest_hands', 'You spent three played minutes resting your hands. Temporary tiredness, soreness and scraped palms eased; lasting marks remain. Rest created no stamina or attention.'),
    ], 'Take three played minutes to recover tired or tender hands. It removes temporary tiredness, soreness and scrapes while leaving lasting body marks intact; it creates no stamina or attention.', {label: 'Rest your hands · 3 min'}),
    timed(I.focusedBreak, 3, 'Shack', all(sheltered, eq('statusCare.noNativeBattle')), [stamina(-1)], [
        condition(I.focused, 'apply', 12),
        know('focused_break', 'You spent one stamina and three played minutes in the sheltered Shack taking a focused break. The resulting focus lasts twelve played minutes.'),
    ], 'Take a three-minute quiet break in the Shack for one stamina. Settled focus improves your intuition for twelve played minutes.', {label: 'Take a focused break · 1 stamina'}),
];

const conditions = [
    [I.warmed, 'Warmed', 'A brief sheltered warmth that supports cold tolerance.'],
    [I.lined, 'Rain lining prepared', 'Temporary prepared lining halves native rain accumulation while active.'],
    [I.steady, 'Steady grip', 'A practiced temporary grip supports careful native dexterity work.'],
    [I.tired, 'Tired', 'Temporary exertion reduces careful dexterity and stamina efficiency until it passes or you rest.'],
    [I.focused, 'Focused', 'A quiet sheltered break supports a brief increase in intuition.'],
].map(([id, label, bioDetail]) => ({id, revision: 1, label, stacking: 'max', bioVisible: true, bioDetail}));

export const statusCareDefinitions = {conditions, commands};
export function statusCareCommand(id) {
    return commands.find(commandDefinition => commandDefinition.id === id) || null;
}
