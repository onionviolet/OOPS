import {hostedWolf as id, hostedWolfGlade, hostedWolfWorld, wolfExtractionCost} from '../gu_hosted_wolf.js';
import {wolfRidge, wolfShelf} from '../gu_wolf_ridge.js';
import {atRavine, eyeExtractionCost, wolfRavine, wolfScouting} from '../gu_wolf_scouting.js';
import {crownFlight, flightSites, shieldBank, shieldLedge, sparkScrub} from '../gu_crown_flight.js';
import {registerGuKeeperSmokePassage} from './book_gu_keeper_smoke.js';
import {registerGuKeeperStealth} from './book_gu_keeper_stealth.js';
import {defenseFarBank, defenseResearchOperations, defenseTrials, keeperDefense, keeperDefenseResearch} from '../gu_keeper_defense.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ge = (fact, value) => ({fact, op: 'gte', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const energyId = kId('primeval');
const aperture = eq(`faculty.${kId('aperture')}.active`);
const doseId = `${id}.silver_dose`;
const dose = JSON.stringify({id: doseId});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const move = location => ({type: 'relocate', actor: 'player', location});

function command(name, label, location, {needs = [], costs = [], effects = [], description = '', pack = id} = {}) {
    const permission = pack === id ? admitted : eq(extensionFact(pack));
    return {id: `${pack}.${name}`, revision: 1, label, duration: 0, description, group: 'structured_local',
        worldId: hostedWolfWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: permission,
        requires: all(ready, permission, ...needs), costs, effects};
}

function act(operation, label, {needs = [], ...options} = {}) {
    return command(operation, label, hostedWolfGlade, {...options, needs: [eq(`${id}.can_${operation}`), ...needs],
        effects: [{type: 'guHostedWolf', actor: 'player', operation}]});
}

function charge(amount) {
    return {needs: [aperture, ge(`energy.${energyId}.reserve`, amount)],
        costs: Array.from({length: amount}, () => ({type: 'energy', actor: 'player', energyId, operation: 'use', output: 1, control: 1}))};
}

export const guKeeperHostedWolf = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Follow a lightning wolf’s trail',
    description: 'A hunter has found a wounded lightning wolf in the glade. He can help hold it for a live extraction or finish the hunt.',
    requires: ready,
    reason: 'Speak to the hunter at the Gu house.',
    locations: [{id: hostedWolfGlade, label: 'Lightning wolf glade', underRoof: false,
        description: 'A screened shelter stands beside the game trail.'}],
    items: [{id: doseId, label: 'Thunderclap white-silver dose', value: 0,
        description: 'Two measures of stored rank-three essence for a Thunderclap Gu.'}],
    commands: [
        command('enter', 'Go to the lightning wolf glade', annex, {effects: [move(hostedWolfGlade)]}),
        command('leave', 'Return to the Gu house', hostedWolfGlade, {effects: [move(annex)]}),
        command('buy_silver', 'Buy a Thunderclap dose · 1 stone', annex, {
            needs: [ge(`item.${kKey('stone')}`, 1)], costs: [item(kKey('stone'), -1)], effects: [item(dose, 1)],
        }),
        act('find', 'Follow the wounded wolf’s tracks'),
        act('inspect', 'Watch the wolf from cover', {description: 'See what the wolf carries before you approach.'}),
        act('shelter', 'Guide the wolf into the screened shelter'),
        act('care', 'Tend the wolf’s injured leg', {description: 'The hunter dresses the leg. It takes twenty minutes to recover.'}),
        act('extract', 'Separate Thunderclap with Plunder · 2 essence', {
            ...charge(wolfExtractionCost.extract), description: 'The hunter lends Plunder and holds the wounded wolf steady.',
        }),
        act('extract_sound', 'Separate Thunderclap from the recovered wolf · 4 essence', {
            ...charge(wolfExtractionCost.extract_sound), description: 'The hunter lends Plunder and braces the stronger wolf.',
        }),
        act('release', 'Release the wolf from the shelter'),
        act('hunt', 'Let the hunter finish the wolf', {description: 'The hunter’s strike could kill the Gu along with the wolf.'}),
        act('refine', 'Refine control of Thunderclap · 1 essence', charge(1)),
        act('cast', 'Discharge Thunderclap at the target post · 1 dose', {
            needs: [ge(`item.${dose}`, 1)], costs: [item(dose, -1)],
        }),
    ],
};

const ridgeCommand = (name, label, location, options) => command(name, label, location, {...options, pack: wolfRidge});
function ridgeAct(operation, label, {needs = [], effects = [], ...options} = {}) {
    return ridgeCommand(operation, label, hostedWolfGlade, {...options, needs: [eq(`${wolfRidge}.can_${operation}`), ...needs],
        effects: [{type: 'guHostedWolf', actor: 'player', operation}, ...effects]});
}
const hareId = `${wolfRidge}.hare`;
const eyeId = `${wolfRidge}.wolf_eye`;
const hare = JSON.stringify({id: hareId});
const eye = JSON.stringify({id: eyeId});
const stone = kKey('stone');
export const guKeeperWolfRidge = {
    schema: 1, id: wolfRidge, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [id],
    label: 'Watch the lightning wolves on the ridge',
    description: 'The hunter checks whether the first wolf returned and where the pack feeds.',
    requires: all(ready, eq(`${wolfRidge}.ready`)), reason: 'Finish the first wolf encounter and leave its shelter empty.',
    locations: [{id: wolfShelf, label: 'Ridge lookout shelf', underRoof: false,
        description: 'The shelf overlooks the hare runs. A steep footpath leads back to the glade.'}],
    items: [{id: hareId, label: 'Ridge hare', value: 0, description: 'A hare from the lightning wolves’ hunting ground.'},
        {id: eyeId, label: 'Lightning wolf eye', value: 0, description: 'The hunter pays for each wolf eye brought in from the ridge.'}],
    commands: [
        ridgeAct('watch_ridge', 'Count the ridge tracks', {description: 'Check the wolf and hare runs with the hunter.'}),
        ridgeAct('mark_wolf', 'Look for the wolf from the shelter', {description: 'Look for the same leg and coat on the returning trail.'}),
        ridgeAct('take_hare', 'Take a hare from the ridge', {description: 'The hunter sets his snare along the run.', effects: [item(hare, 1)]}),
        ridgeAct('fresh_trail', 'Follow a fresh wolf trail', {description: 'Watch the new wolf from cover and see whether it carries a Gu.'}),
        ridgeAct('returning_trail', 'Find the wolf you let go', {description: 'Look for the same coat and Gu after it returns.'}),
        ridgeAct('spare_wolf', 'Let the wolf leave the clearing', {description: 'The wolf stays on the ridge and its tracks will return after thirty minutes.'}),
        ridgeAct('hunt_ridge_wolf', 'Hunt the ridge wolf with the hunter', {description: 'A hunt takes the wolf out of the pack. The hunter preserves any Thunderwings.',
            effects: [item(eye, 1)]}),
        ridgeAct('refine_wings', 'Refine Thunderwings · 1 essence', {...charge(1), description: 'Settle control of the Gu recovered from the wolf.'}),
        ridgeAct('fly_shelf', 'Fly to the ridge shelf · 1 white-silver dose', {description: 'Let Thunderwings lift you to the lookout.',
            needs: [ge(`item.${dose}`, 1)], costs: [item(dose, -1)], effects: [move(wolfShelf)]}),
        ridgeCommand('sell_eye', 'Trade a wolf eye · 1 stone', hostedWolfGlade, {
            needs: [ge(`item.${eye}`, 1)], costs: [item(eye, -1)], effects: [item(stone, 1)],
        }),
        ridgeCommand('sell_hare', 'Trade a ridge hare · 1 stone', hostedWolfGlade, {
            needs: [ge(`item.${hare}`, 1)], costs: [item(hare, -1)], effects: [item(stone, 1)],
        }),
        ridgeCommand('walk_down', 'Walk down to the glade', wolfShelf, {effects: [move(hostedWolfGlade)]}),
    ],
};

const scoutingCommand = (name, label, location, options) => command(name, label, location, {...options, pack: wolfScouting});
function scout(operation, label, description, {needs = [], effects = [], ...options} = {}) {
    return scoutingCommand(operation, label, atRavine(operation) ? wolfRavine : hostedWolfGlade, {
        ...options, description, needs: [eq(`${wolfScouting}.can_${operation}`), ...needs],
        effects: [{type: 'guHostedWolf', actor: 'player', operation}, ...effects],
    });
}
export const guKeeperWolfScouting = {
    schema: 1, id: wolfScouting, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [id, wolfRidge],
    label: 'Scout the crown wolf', description: 'The hunter lends Stealth Scales. A pale-crested wolf has been seen near the pack.',
    requires: all(ready, eq(`${wolfScouting}.can_find_crown`)), reason: 'Count the ridge tracks and find room to follow a wolf.',
    locations: [{id: wolfRavine, label: 'Hare ravine', underRoof: false,
        description: 'A stone bank hides the lower trail from the ridge. Fresh hare tracks cross the stream.'}],
    commands: [
        scout('find_crown', 'Find the pale-crested wolf', 'Watch the larger wolf from a distance.'),
        scout('scout_plain', 'Approach the other wolf under Stealth Scales · 2 essence', 'Test the hunter’s concealment against an ordinary gaze.', charge(2)),
        scout('scout_crown', 'Approach the crown wolf under Stealth Scales · 2 essence', 'Test the same concealment against the larger wolf.', charge(2)),
        scoutingCommand('follow_ravine', 'Follow the crown wolf to the ravine', hostedWolfGlade, {
            needs: [eq(`${wolfScouting}.moved`)], effects: [move(wolfRavine)],
        }),
        scout('scout_ravine', 'Try Stealth Scales in the ravine · 2 essence', 'Approach the same wolf from the open stream.', charge(2)),
        scout('screened', 'Approach behind the stone bank', 'Use the lower trail while the bank blocks the wolf’s view.'),
        scout('extract_eye', `Separate Lightning Eye with Plunder · ${eyeExtractionCost} essence`,
            'Work with the hunter while the wolf rests by the bank.', charge(eyeExtractionCost)),
        scout('refine_eye', 'Refine Lightning Eye · 1 essence', 'Settle control of the Gu recovered from the wolf.', charge(1)),
        scout('reveal_cache', 'Find the concealed cache with Lightning Eye · 1 white-silver dose',
            'Look through the old concealment on the cache and recover two primeval stones.', {
                needs: [ge(`item.${dose}`, 1)], costs: [item(dose, -1)], effects: [item(stone, 2)],
            }),
        scoutingCommand('leave_ravine', 'Return to the glade', wolfRavine, {effects: [move(hostedWolfGlade)]}),
    ],
};

const flightCommand = (name, label, location, options) => command(name, label, location, {...options, pack: crownFlight});
function flightAct(operation, label, description, {needs = [], effects = [], ...options} = {}) {
    return flightCommand(operation, label, flightSites[operation] ?? wolfRavine, {...options, description,
        needs: [eq(`${crownFlight}.can_${operation}`), ...needs],
        effects: [{type: 'guHostedWolf', actor: 'player', operation}, ...effects]});
}
function chase(name, label, location, destination, duration) {
    const admittedFlight = eq(extensionFact(crownFlight));
    const support = all(ready, admittedFlight, eq(`${crownFlight}.opened`));
    return {...flightCommand(name, label, location, {needs: [eq(`${crownFlight}.opened`)], effects: [move(destination)]}),
        duration, cancellation: 'refund', reservationReturns: 1, completionRequires: support, completionFailure: 'refund', completionCoLocated: true};
}
const tongsId = `${crownFlight}.tongs`;
const tongs = JSON.stringify({id: tongsId});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
export const guKeeperCrownFlight = {
    schema: 1, id: crownFlight, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [id, wolfScouting],
    label: 'Hunt the disarmed crown wolf', description: 'The hunter can finish the crown wolf once its Lightning Eye is out. Its other Gu may scatter.',
    requires: all(ready, eq(`${crownFlight}.can_start_flight`)), reason: 'First separate the crown wolf’s Lightning Eye in the ravine.',
    locations: [
        {id: sparkScrub, label: 'Ravine scrub', underRoof: false, description: 'A blue spark darts between the roots.'},
        {id: shieldLedge, label: 'Slate ledge', underRoof: false, description: 'A vein of lightning ore sparks across the ford.'},
        {id: shieldBank, label: 'Far bank below the ledge', underRoof: false, description: 'The stream crackles below. A footpath leads back.'},
    ],
    items: [{id: tongsId, label: 'Insulated tongs', value: 0, description: 'The hunter wraps the grips in thick dry hide.'}],
    commands: [
        flightCommand('buy_tongs', 'Buy insulated tongs · 1 stone', wolfRavine, {
            needs: [ge(`item.${stone}`, 1)], costs: [item(stone, -1)], effects: [item(tongs, 1)],
        }),
        flightAct('start_flight', 'Help the hunter finish the crown wolf', 'The wolf dies and its remaining Gu leave in different directions.'),
        chase('to_scrub', 'Follow the blue glint · 5 minutes', wolfRavine, sparkScrub, 5),
        chase('to_ledge', 'Follow the glassy Gu · 8 minutes', wolfRavine, shieldLedge, 8),
        chase('scrub_back', 'Return to the ravine · 5 minutes', sparkScrub, wolfRavine, 5),
        chase('ledge_back', 'Return to the ravine · 8 minutes', shieldLedge, wolfRavine, 8),
        flightAct('touch_spark', 'Reach for the blue Gu · 2 stamina', 'The Gu is already sparking at the roots.', {
            needs: [ge('vital.stamina', 2)], costs: [stamina(-2)],
        }),
        flightAct('tongs_spark', 'Catch the blue Gu with insulated tongs', 'Close the grips without touching the sparks.', {needs: [ge(`item.${tongs}`, 1)]}),
        flightAct('touch_shield', 'Reach for the glassy Gu', 'See what it does when your hand approaches.'),
        flightAct('pluck_shield', 'Hold Thunder Shield with Plunder · 4 essence', 'Hold the Gu while the hunter slips a pouch over it.', charge(4)),
        flightAct('refine_shield', 'Refine Thunder Shield · 1 essence', 'Settle control of the Gu from the ledge.', charge(1)),
        flightAct('shield_cross', 'Cross the sparking ford with Thunder Shield · 1 white-silver dose',
            'Raise the lightning shield as you cross to the far bank.', {
                needs: [ge(`item.${dose}`, 1)], costs: [item(dose, -1)], effects: [move(shieldBank)],
            }),
        chase('bank_back', 'Take the footpath to the ravine · 8 minutes', shieldBank, wolfRavine, 8),
    ],
};

export async function registerGuKeeperHostedWolf(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperHostedWolf, base);
        await register.bundledInstantExtension(guKeeperWolfRidge, base);
        await register.bundledInstantExtension(guKeeperWolfScouting, base);
        await register.bundledInstantExtension(guKeeperCrownFlight, base);
        await registerGuKeeperSmokePassage(register, base);
        await registerGuKeeperStealth(register, base);
        await register.bundledInstantExtension(guKeeperDefense, base);
        await register.bundledInstantExtension(guKeeperDefenseResearch, base);
    }
}

const defenseLabels = {
    bare_blast: ['Face the blast without a Gu defense', 'Use the hunter’s test post from the low platform. Both the blast and the landing can hurt.'],
    jade_blast: ['Face the blast with White Jade', 'White Jade hardens your body against the current. The landing can still hurt.'],
    shield_blast: ['Raise Water Shield and White Jade', 'The hunter lends Water Shield. The outer shield takes the blast before White Jade catches the remaining current.'],
    braced_blast: ['Raise both shields and brace with Scale Armor', 'Fit the Scale Armor you made so it can soften the landing.'],
};
const defenseFact = key => eq(`${keeperDefense}.${key}`);
const guKeeperDefense = {
    schema: 1, id: keeperDefense, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash}, dependsOn: [id],
    label: 'Try Thunderclap against layered defenses',
    description: 'The hunter sets up a low practice platform and lends a Water Shield. Bring your own White Jade or Scale Armor.',
    requires: all(ready, defenseFact('ready')), reason: 'First recover Thunderclap and refine control of it.',
    commands: Object.entries(defenseTrials).map(([operation, guards]) => {
        const [label, description] = defenseLabels[operation], essence = guards.length * 2;
        const apertureCost = essence ? charge(essence) : {needs: [], costs: []};
        return command(operation, `${label} · 1 white-silver dose${essence ? `, ${essence} essence` : ''}`, hostedWolfGlade, {
            pack: keeperDefense, description,
            needs: [defenseFact('ready'), defenseFact('shot_ready'), ge(`item.${dose}`, 1), ...apertureCost.needs,
                ...(guards.includes('white-jade') ? [defenseFact('jade_ready')] : []),
                ...(guards.includes('water-shield') ? [defenseFact('water_ready')] : []),
                ...(guards.includes('scale-armor') ? [defenseFact('armor_ready')] : [])],
            costs: [item(dose, -1), ...apertureCost.costs],
            effects: [{type: 'guHostedWolf', actor: 'player', operation}],
        });
    }),
};

const guardNames = {'water-shield': 'Water Shield', 'white-jade': 'White Jade', 'scale-armor': 'Scale Armor'};
const guKeeperDefenseResearch = {
    schema: 1, id: keeperDefenseResearch, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [id, keeperDefense], requires: all(ready, defenseFact('ready')),
    label: 'Plan a crossing through the blast lane',
    description: 'Find a combination of ready Gu that keeps the lightning and landing within the hunter’s practice limit.',
    reason: 'Recover Thunderclap and take up the layered-defense lesson.',
    locations: [{id: defenseFarBank, label: 'Far bank of the blast lane', underRoof: false,
        description: 'You have crossed the platform and reached the bank. A footpath leads back around the blast lane.'}],
    commands: [
        ...Object.entries(defenseResearchOperations).map(([operation, guards]) => {
            const supported = eq(`${keeperDefenseResearch}.${operation}`);
            const action = command(operation, `Cross with ${guards.map(kind => guardNames[kind]).join(' and ')} · 1 dose`, hostedWolfGlade, {
                pack: keeperDefenseResearch, description: 'Raise the listed Gu as the hunter fires. The estimate in the Gu house shows essence and expected harm.',
                needs: [supported, defenseFact('shot_ready'), aperture, ge(`item.${dose}`, 1)],
                costs: [item(dose, -1)],
                effects: [{type: 'guHostedWolf', actor: 'player', operation}, move(defenseFarBank)],
            });
            return {...action, visibleWhen: all(action.visibleWhen, supported)};
        }),
        command('back', 'Take the footpath around the blast lane', defenseFarBank, {
            pack: keeperDefenseResearch, effects: [move(hostedWolfGlade)],
        }),
    ],
};
