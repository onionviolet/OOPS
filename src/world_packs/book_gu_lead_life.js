// Returned lead, volume 1 chapters 2–7. The ceremony fixes the body's aptitude for
// this seat. It does not initialize a transferable Gu, a prior-life inventory or a reset.
export const GU_LEAD = 'book.ri.lead';
export const riLeadId = name => `${GU_LEAD}.${name}`;
const id = riLeadId;
const world = id('world');
const elder = id('academy_elder');
const aperture = id('aperture');
const essence = id('primeval');
const attendance = id('academy_roll');
const capacity = 44;
const steps = 27;

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: id(name), stage: 'understood', value});
const move = (place, actor = 'player') => ({type: 'relocate', actor, location: id(place)});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'));
const supervised = {targetId: elder, coLocated: true, participants: ['$target']};

function act(name, label, place, duration, requires, description, effects, extra = {}) {
    return {
        id: id(name), revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: id(place), audience: ['$actor'],
        once: true, duration, requires, completionRequires: requires, completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', costs: [], effects, ...extra
    };
}

const called = all(ready, eq(`completed.${id('muster')}`, true, 'Go to the morning roll call first.'));
const supervisedPractice = all(ready,
    eq(`faculty.${aperture}.active`, true, 'Open your aperture at the ceremony first.'),
    eq(`claim.${attendance}.owner`, 'player', 'The elder admits the pupils who awakened.'),
    eq(`claim.${attendance}.held`, true, 'The elder must have your name on the roll.'));
const practice = all(supervisedPractice,
    {fact: `energy.${essence}.reserve`, op: 'gte', value: 1, reason: 'Your aperture needs essence for this exercise.'});
const circulation = {type: 'energy', energyId: essence, operation: 'use', output: 1, control: 1};

export const guLeadLife = {
    schema: 2, id: GU_LEAD, revision: 1,
    title: 'Reverend Insanity · the returned clan youth',
    description: 'Wake in the clan village with memories of another lifetime. Face the Awakening Ceremony in the body you have now.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['jobs'],
    world: {id: world, label: 'Reverend Insanity · the returned clan youth'},
    locations: [
        {id: id('home'), label: 'Guardians’ house', underRoof: true,
            description: 'The rain has passed. The wooden stairs creak as your brother goes down ahead of you.'},
        {id: id('spring'), label: 'Ceremony cavern', underRoof: true,
            description: 'The academy elder calls names from the riverbank. Pale flowers grow on the far side of the water.'},
        {id: id('academy'), label: 'Clan academy', underRoof: true,
            description: 'Pupils who opened their apertures sit at low desks. The elder shows the class how to sense the sea and move its essence.'}
    ],
    sources: [{id: aperture, revision: 1, label: 'Opened Rank-one aperture', kind: 'trait', origin: 'acquired', grants: [],
        bioDetail: 'Your aperture holds green-copper primeval essence. At C grade, the sea fills 44 of the aperture’s 100 parts.'}],
    starts: [{id: id('start'), locationId: id('home'),
        description: 'You woke at fifteen with memories of another lifetime. You remember the clan’s ceremony and the weight of the water.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'child', hands: 2, mobile: true},
        effects: []}],
    simulation: {
        people: [{id: elder, revision: 1, label: 'Academy elder', worldId: world, location: id('spring'),
            inventory: 'simulation', provision: false}],
        energies: [{id: essence, revision: 1, label: 'Green-copper primeval essence', capacity, output: capacity, control: 1,
            efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0}],
        commands: [
            act('muster', 'Answer the morning roll · 2 min', 'home', 2, ready,
                'Go to the clan pavilion and follow the elder down to the river. He calls the youths up one at a time.',
                [move('spring'), note('elder_known', 'The academy elder keeps the roll and calls each youth across the river.')]),
            act('cross', 'Walk into the flower field · 5 min', 'spring', 5, called,
                'Wade across when the elder calls you. Beyond the water, walk against the spring’s pressure as far as you can. The elder records the result and takes the youths who awaken to the academy.',
                [{type: 'source', sourceId: aperture, operation: 'grant', origin: 'acquired', awakened: true, active: true},
                    {type: 'energy', energyId: essence, operation: 'learn'},
                    {type: 'energy', energyId: essence, operation: 'recover', amount: capacity},
                    {type: 'claim', key: attendance, operation: 'acquire'},
                    note('awakening', `Hope Gu gather under your navel. At step ${steps}, their light opens your aperture. The green-copper sea fills ${capacity}% of it, a C-grade reserve.`),
                    note('elder_known', 'The elder calls C grade and puts you on the academy roll.'),
                    move('academy'), move('academy', elder)], supervised),
            act('circulate', 'Practice circulating essence · 5 min, 1 part in use', 'academy', 5, practice,
                'Find your primeval sea and set one part of its green-copper essence in motion under the elder’s eye. The essence returns to the sea when you finish or stop.',
                [{...circulation, operation: 'refund'},
                    note('first_lesson', 'You found the primeval sea and moved its essence at will. The part you drew has returned to the sea.'),
                    note('elder_known', 'The elder marks your first exercise complete.')],
                {...supervised, costs: [circulation], completionRequires: supervisedPractice})
        ]
    },
    presentation: {
        people: {[elder]: {introductionKnowledgeKey: id('elder_known')}},
        status: [{id: id('awakening_status'), label: 'Awakening', knowledgeKey: id('awakening')},
            {id: id('lesson_status'), label: 'First academy exercise', knowledgeKey: id('first_lesson')}]
    }
};
