import {keeperPotatoFruit, keeperPotatoTrial, keeperPropagation as id, keeperPropagationPit, keeperPropagationWorld} from '../gu_keeper_propagation.js';
import {thunderPotatoPropagation as rule} from '../gu_propagation.js';
import {keeperPotatoMarket, potatoMarketEffects, potatoMarketStore} from '../gu_keeper_potato_market.js';
import {keeperDrain, keeperDrainWear} from '../gu_keeper_drain.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const recess = `${id}.recess`;
const fuelId = `${id}.silver_dose`;
const fuel = JSON.stringify({id: fuelId});
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const loaned = eq(`${id}.loaned`);
const aperture = eq(`faculty.${kId('aperture')}.active`);
const energyId = kId('primeval');
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const move = location => ({type: 'relocate', actor: 'player', location});

function command(operation, label, location, needs, effects, costs = [], description = '') {
    return {
        id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperPropagationWorld, location, actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted, requires: all(ready, admitted, ...needs), costs, effects,
    };
}

function procedure(operation, label, location, needs = [], costs = [], description = '') {
    return command(operation, label, location, [eq(`${id}.can_${operation}`), ...needs],
        [{type: 'guPropagate', actor: 'player', operation}], costs, description);
}

const plantInputs = [aperture, ge(`item.${keeperPotatoFruit}`, 1), ge(`energy.${energyId}.reserve`, rule.plantingCost)];
const plantCost = [item(keeperPotatoFruit, -1), {type: 'energy', actor: 'player', energyId, operation: 'use', output: 1, control: 1}];
const loan = value => ({type: 'fact', actor: 'player', scope: 'actor', key: `${id}.loaned`, value});

export const guKeeperPropagation = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Cultivate Charred Thunder Potato Gu',
    description: 'Borrow a rank-three Mother Gu, sort the fruit and try a viable Gu in the steward’s test pit.',
    requires: ready,
    reason: 'Visit the steward at the Gu house.',
    items: [
        {id: fuelId, label: 'White-silver dose for the Mother Gu', value: 0, description: 'Two measures of stored rank-three essence.'},
        {id: `${id}.fruit`, label: 'Viable Charred Thunder Potato Gu', value: 0,
            description: 'A living rank-two fruit from the Mother Gu. Refine it before planting.'},
    ],
    locations: [
        {id: keeperPropagationPit, label: 'Thunder Potato test pit', underRoof: false,
            description: 'A fertile plot faces a clay plug. Roll a log down the slope to test a buried Gu.'},
        {id: recess, label: 'Cleared clay recess', underRoof: false,
            description: 'The blast cleared the clay plug. Beyond it is a small recess in the bank.'},
    ],
    commands: [
        command('borrow', 'Borrow the Thunder Potato Mother Gu', annex, [eq(`${id}.loaned`, false)], [loan(true)]),
        command('return_mother', 'Return the Thunder Potato Mother Gu', annex, [loaned], [loan(false)]),
        command('buy_silver', 'Buy a Mother Gu dose · 1 stone', annex, [ge(`item.${kKey('stone')}`, 1)],
            [item(fuel, 1)], [item(kKey('stone'), -1)]),
        procedure('produce', 'Grow a batch of fruit · 1 white-silver dose', annex,
            [loaned, ge(`item.${fuel}`, 1)], [item(fuel, -1)]),
        procedure('sort', 'Sort the Mother Gu’s fruit', annex),
        procedure('refine', 'Refine one viable fruit', annex),
        command('enter_pit', 'Go to the Thunder Potato test pit', annex, [], [move(keeperPropagationPit)]),
        command('leave_pit', 'Return to the Gu house', keeperPropagationPit, [], [move(annex)]),
        procedure('plant_shallow', 'Plant one Gu near the surface · 1 essence', keeperPropagationPit, plantInputs, plantCost),
        procedure('plant_deep', 'Plant one Gu deep · 1 essence', keeperPropagationPit, plantInputs, plantCost,
            'The soil shelters the Gu from light vibration. Give it ten minutes to grow.'),
        procedure('tap', 'Tap the soil from behind the bank', keeperPropagationPit),
        procedure('strike', 'Roll a log over the planted Gu', keeperPropagationPit),
        command('inspect_recess', 'Enter the recess exposed by the blast', keeperPropagationPit,
            [eq(`${id}.cleared`)], [move(recess)]),
        command('leave_recess', 'Climb back to the test pit', recess, [], [move(keeperPropagationPit)]),
    ],
};

const trial = keeperPotatoTrial;
const trialAdmitted = eq(extensionFact(trial));
const trialLoan = value => ({...loan(value), key: `${trial}.loaned`});
const trialLoaned = eq(`${trial}.loaned`);
const braceRecess = `${trial}.store`;

function trialCommand(operation, label, location, needs, effects, costs) {
    return {...command(operation, label, location, [], effects, costs), id: `${trial}.${operation}`,
        visibleWhen: trialAdmitted, requires: all(ready, trialAdmitted, ...needs)};
}

function trialProcedure(operation, label, location, needs = [], costs = []) {
    return trialCommand(operation, label, location, [eq(`${trial}.can_${operation}`), ...needs],
        [{type: 'guPropagate', actor: 'player', operation}], costs);
}

export const guKeeperPotatoTrial = {
    schema: 1, id: trial, revision: 1, base: guKeeperPropagation.base, dependsOn: [id],
    label: 'Compare two Thunder Potato Mother Gu',
    description: 'Feed the crested Mother Gu and compare its fruit with the first mother’s. Dress the soil for quicker growth, or try the ordinary bed.',
    requires: ready, reason: 'Open the Thunder Potato workbench first.',
    locations: [{id: braceRecess, label: 'Stone-braced store', underRoof: false,
        description: 'The blast broke the stone brace. An old cache lies beyond it.'}],
    commands: [
        trialCommand('borrow', 'Borrow the crested Mother Gu', annex, [eq(`${trial}.loaned`, false)], [trialLoan(true)]),
        trialCommand('return_crest', 'Return the crested Mother Gu', annex, [trialLoaned], [trialLoan(false)]),
        trialProcedure('feed_crest', 'Feed the crested Mother Gu · 1 petal', annex,
            [ge(`item.${kKey('petals')}`, 1)], [item(kKey('petals'), -1)]),
        trialProcedure('produce_crest', 'Grow crested fruit · 1 white-silver dose', annex,
            [ge(`item.${fuel}`, 1)], [item(fuel, -1)]),
        trialProcedure('refine_crest', 'Refine a viable crested fruit', annex),
        trialProcedure('plant_dressed', 'Plant deep in dressed soil · 1 essence and 1 petal', keeperPropagationPit,
            [...plantInputs, ge(`item.${kKey('petals')}`, 1)], [...plantCost, item(kKey('petals'), -1)]),
        trialProcedure('test_brace', 'Roll a log to test the stone brace', keeperPropagationPit),
        trialCommand('enter_store', 'Enter the store behind the broken brace', keeperPropagationPit,
            [eq(`${trial}.opened`)], [move(braceRecess)]),
        trialCommand('recover_cache', 'Recover the cache · 3 primeval stones', braceRecess,
            [eq(`${trial}.can_recover`)], [item(kKey('stone'), 3)]),
        trialCommand('leave_store', 'Return to the test pit', braceRecess, [], [move(keeperPropagationPit)]),
    ],
};

export async function registerGuKeeperPropagation(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperPropagation, base);
        await register.bundledInstantExtension(guKeeperPotatoTrial, base);
        await register.bundledInstantExtension(guKeeperPotatoMarket, base);
        await register.bundledInstantExtension(guKeeperDrainRig, base);
        await register.bundledInstantExtension(guKeeperWornRig, base);
    }
}

const market = keeperPotatoMarket;
const marketAdmitted = eq(extensionFact(market));
const marketCan = op => eq(`${market}.can_${op}`);
function marketCommand(op, label, location, needs, effects, description = '') {
    return {...command(op, label, location, [], effects, [], description), id: `${market}.${op}`,
        visibleWhen: marketAdmitted, requires: all(ready, marketAdmitted, ...needs)};
}

function marketProcedure(op, label, description, needs = []) {
    return marketCommand(op, label, annex, [marketCan(op), ...needs],
        [{type: 'guPropagate', actor: 'player', operation: op}, ...potatoMarketEffects(op)], description);
}

const guKeeperPotatoMarket = {
    schema: 1, id: market, revision: 1, base: guKeeperPropagation.base, dependsOn: [id, trial],
    label: 'Trade Thunder Potato fruit with the steward',
    description: 'The steward pays out of his own purse and can test the fruit you sell at his stone drain.',
    requires: ready, reason: 'Open the two Mother Gu comparison first.',
    locations: [{id: potatoMarketStore, label: 'Cleared stone drain', underRoof: false,
        description: 'The steward’s blast shifted the heavy stone. The drain runs clear again.'}],
    commands: [
        marketProcedure('sell_usual', 'Sell a usual Thunder Potato fruit · receive 1 stone', 'The steward buys a sorted fruit before refinement.'),
        marketProcedure('sell_crested', 'Sell a crested Thunder Potato fruit · receive 1 stone', 'The steward buys a sorted fruit before refinement.'),
        marketProcedure('buy_back', 'Buy back the same fruit · 1 stone', 'Buy it back before the steward plants it.', [ge(`item.${kKey('stone')}`, 1)]),
        marketProcedure('plant_sale', 'Have the steward plant the sold fruit', 'The steward refines the fruit and supplies his own essence to plant it.'),
        marketProcedure('test_sale', 'Have the steward test the sold fruit', 'The steward rolls a log to set off the mature fruit.'),
        marketCommand('enter', 'Inspect the cleared stone drain', annex, [marketCan('enter')], [move(potatoMarketStore)]),
        marketCommand('back', 'Return to the Gu house', potatoMarketStore, [], [move(annex)]),
    ],
};

const rig = keeperDrain;
const rigAdmitted = eq(extensionFact(rig));
const rigCan = op => eq(`${rig}.can_${op}`);
const [cord, grain, meal] = ['cord', 'grain', 'meal'].map(name => JSON.stringify({id: `${rig}.${name}`}));
function rigCommand(op, label, location, needs, effects, costs = [], description = '') {
    return {...command(op, label, location, [], effects, costs, description), id: `${rig}.${op}`,
        visibleWhen: rigAdmitted, requires: all(ready, rigAdmitted, ...needs)};
}

const releaseOperation = op => ({type: 'guPropagate', actor: 'player', operation: op});
const guKeeperDrainRig = {
    schema: 1, id: rig, revision: 1, base: guKeeperPropagation.base, dependsOn: [market],
    label: 'Set up a rolling log above the steward’s drain',
    description: 'Tether a log and cut its cord from cover. The drain’s old mill runs if the heavy stone shifts.',
    requires: ready, reason: 'Open the Thunder Potato trade first.',
    items: [
        {id: `${rig}.cord`, label: 'Hemp cord', value: 0, description: 'A fresh tether for the log.'},
        {id: `${rig}.grain`, label: 'Mill grain', value: 0, description: 'An old sack of grain from the dry mill bin.'},
        {id: `${rig}.meal`, label: 'Fresh ground meal', value: 0, description: 'Milled with the water flowing through the cleared drain.'},
    ],
    commands: [
        rigCommand('buy_cord', 'Buy hemp cord · 1 stone', annex, [ge(`item.${kKey('stone')}`, 1)],
            [item(cord, 1)], [item(kKey('stone'), -1)]),
        ...['light', 'heavy'].map(size => rigCommand(`rig_${size}`, `Tether the ${size} log · 1 cord`, annex,
            [rigCan(`rig_${size}`), ge(`item.${cord}`, 1)], [releaseOperation(`rig_${size}`)], [item(cord, -1)])),
        rigCommand('cut_tether', 'Cut the tether from cover · 4 essence', annex, [rigCan('cut_tether'), aperture],
            [releaseOperation('cut_tether')], [], 'The log rolls down the track in one minute.'),
        rigCommand('grain', 'Take the grain from the mill bin', potatoMarketStore, [rigCan('grain')], [item(grain, 1)]),
        {...rigCommand('mill', 'Grind grain with the waterwheel', potatoMarketStore, [rigCan('mill'), ge(`item.${grain}`, 1)],
            [item(meal, 1)], [item(grain, -1)]), duration: 4, cancellation: 'refund', reservationReturns: 1,
            completionRequires: all(ready, rigAdmitted, rigCan('mill')), completionCoLocated: true, completionFailure: 'refund'},
    ],
};

const wear = keeperDrainWear;
const wearAdmitted = eq(extensionFact(wear));
const wornCord = JSON.stringify({id: `${wear}.frayed_cord`});
function wearCommand(op, label, needs, effects, costs) {
    const action = command(op, label, annex, [], effects, costs);
    return {...action, id: `${wear}.${op}`, visibleWhen: wearAdmitted, requires: all(ready, wearAdmitted, ...needs)};
}

const guKeeperWornRig = {
    schema: 1, id: wear, revision: 1, base: guKeeperPropagation.base, dependsOn: [rig],
    label: 'Compare fresh and frayed log tethers',
    description: 'The steward has old cord. See whether it holds the light log and the heavy one.',
    requires: ready, reason: 'Open the rolling-log rig first.',
    items: [{id: `${wear}.frayed_cord`, label: 'Frayed cord', value: 0, description: 'An old tether with several broken strands.'}],
    commands: [
        wearCommand('get_cord', 'Swap one petal for frayed cord', [ge(`item.${kKey('petals')}`, 1)],
            [item(wornCord, 1)], [item(kKey('petals'), -1)]),
        ...['light', 'heavy'].map(size => {
            const op = `rig_worn_${size}`;
            return wearCommand(op, `Tether the ${size} log with frayed cord`, [eq(`${wear}.can_${op}`), ge(`item.${wornCord}`, 1)],
                [releaseOperation(op)], [item(wornCord, -1)]);
        }),
    ],
};
