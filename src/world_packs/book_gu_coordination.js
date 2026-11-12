import {coordinationActors, coordinationEnergy, coordinationHall, coordinationId, coordinationWorld} from '../gu_coordination_trial.js';

const id = name => `${coordinationId}.${name}`;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const team = eq(id('team_present'));
const merged = eq(id('formed'));
const flag = (name, value) => ({type: 'fact', actor: 'player', scope: 'actor', key: id(name), value});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: id(name), stage: 'understood', value});
const energy = (actor, operation, extra = {}) => ({type: 'energy', actor, energyId: coordinationEnergy, operation, ...extra});
const healReserve = actor => energy(actor, 'recover', {amount: 13});
const actors = coordinationActors.slice(1);

function command(name, label, needs, effects, extra = {}) {
    return {id: id(name), revision: 1, label, duration: 0, group: 'structured_local',
        worldId: coordinationWorld, location: coordinationHall, actorId: 'player', audience: ['$actor'],
        requires: all(ready, ...needs), costs: [], effects, ...extra};
}

export const guCoordinationTrial = {
    schema: 2, id: coordinationId, revision: 1, title: 'Reverend Insanity · Three Heads Six Arms rehearsal',
    description: 'An original rehearsal of the Liu brothers’ synchronized transformation.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'jobs'],
    world: {id: coordinationWorld, label: 'Reverend Insanity · formation rehearsal'},
    locations: [
        {id: coordinationHall, label: 'Formation hall', underRoof: true, description: 'The three brothers rehearse on a stone floor beside a weighted gate.'},
        {id: id('yard'), label: 'Practice yard', underRoof: false, description: 'You reached the other side of the weighted gate.'},
    ],
    starts: [{id: id('start'), locationId: coordinationHall,
        description: 'Play Liu Wen Wu in an original rehearsal with Ouyang Bi Sang and Mo Shi Kuang.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [
            ...coordinationActors.flatMap(({id, initial}) => [energy(id, 'learn'), energy(id, 'recover', {amount: initial})]),
            flag('cue', false),
            note('opening', 'Eighteen Gu must answer together. Each brother needs twelve essence for the draw. Liu starts with thirteen, Ouyang with twelve, and Mo with eleven.'),
            note('cue_note', 'Marking the cue costs Liu one essence. Each brother can gather his own essence before you try.'),
        ],
    }],
    simulation: {
        people: actors.map(({id, label}) => ({
            id, revision: 1, label, worldId: coordinationWorld, location: coordinationHall, inventory: 'simulation', provision: false,
            body: {id: `${id}.body`, ownerId: id, controllerId: id, form: 'human', hands: 2, mobile: true},
            vitals: {health: 100, max_health: 100, stamina: 100, max_stamina: 100},
        })),
        energies: [{id: coordinationEnergy, revision: 1, label: 'Rehearsal primeval essence', capacity: 13, output: 12,
            control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0}],
        events: [],
        commands: [
            command('cue', 'Mark the shared cue · 1 essence', [team, eq(id('formed'), false), eq(`actor.${id('cue')}`, false),
                {fact: `energy.${coordinationEnergy}.reserve`, op: 'gte', value: 1}], [flag('cue', true)], {
                    costs: [energy('player', 'use', {output: 1, control: 1})],
                }),
            ...coordinationActors.map(({id: actor, label}, index) => command(`recover_${index}`, `Gather essence · ${label}`,
                [team, eq(id('formed'), false)], [healReserve(actor), note('cue_note', `${label} has gathered thirteen essence.`)])),
            command('merge', 'Attempt Three Heads Six Arms', [team, eq(id('formed'), false), eq(`actor.${id('cue')}`)], [
                {type: 'guCoordinate', actor: 'player'},
            ], {description: 'Eighteen Gu draw together. A successful form lasts ten minutes.'}),
            command('lift', 'Lift the weighted gate together', [team, merged], [
                {type: 'relocate', actor: 'player', location: id('yard')},
                note('result', 'The six arms lift the weighted gate. You reach the practice yard.'),
            ]),
            command('return', 'Return to the formation hall', [], [{type: 'relocate', actor: 'player', location: coordinationHall}],
                {location: id('yard')}),
        ],
    },
    presentation: {
        people: Object.fromEntries(actors.map(({id: actor}) => [actor, {introductionKnowledgeKey: id('opening')}])),
        status: [
            {id: id('opening_status'), label: 'Formation', knowledgeKey: id('opening')},
            {id: id('cue_status'), label: 'Preparation', knowledgeKey: id('cue_note')},
            {id: id('result_status'), label: 'Latest attempt', knowledgeKey: id('result')},
        ],
    },
};
