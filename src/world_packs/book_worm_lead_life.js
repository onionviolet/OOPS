// Source scope: Worm, Gestation 1.1, paragraphs 43–51 (held EPUB).
// The grouped actor represents the gathered insects, not a numerical population.
export const WORM_LEAD = 'book.worm.lead';
export const wormLeadId = name => `${WORM_LEAD}.${name}`;
const id = wormLeadId;
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const ready = {all: [eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile')]};
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: id(name), stage: 'understood', value});
const move = (place, actor = 'player') => ({type: 'relocate', actor, location: id(place)});
function action(name, label, place, description, effects, extra = {}) {
    return {id: id(name), revision: 1, label, description, group: 'structured_local',
        worldId: id('world'), actorId: 'player', location: id(place), audience: ['$actor'],
        duration: 1, requires: ready, completionRequires: ready, completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', costs: [], effects, ...extra};
}
export const wormLeadLife = {
    schema: 2, id: WORM_LEAD, revision: 1,
    title: 'Worm · Taylor Hebert',
    description: 'The girls have gone. Your clothes are soaked, your glasses are streaked, and insects crowd the washroom around you. You can feel each of them.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory', identityAliases: [
        {from: 'sha256:78e668161998c8e8d77f02a69b26cdceb19474dd963b696bc5caed6b67b00086',
            to: 'sha256:a6f920b8f1f3d77345e4ac73dbc44bce0ab126e4b10f154dfafacc84b5bcc338', preserveCurrent: true,
            reason: 'Reviewed player-prose correction; original jobs, effects, body, places and receipts are unchanged.'},
        {from: 'sha256:41f262e01a3bf7de9ec5045f17e361f0452ba8cd949c48ea82a213293271b179',
            to: 'sha256:ed278d9fd710152a78248af723d626b4e01abc80f188326c70f372cf8413b01d',
            reason: 'The same starting body and effects; arrival description now stays in Taylor’s day.'}
    ]}, capabilities: ['jobs'],
    world: {id: id('world'), label: 'Worm · Taylor Hebert'},
    locations: [
        {id: id('washroom'), label: 'Third-floor girls’ washroom', underRoof: true,
            description: 'Your clothing is wet and your glasses remain streaked. This was where the insects gathered around you.'},
        {id: id('corridor'), label: 'School corridor', underRoof: true,
            description: 'The washroom door is behind you. You can go back before leaving school.'},
        {id: id('outside'), label: 'Beyond the washroom window', underRoof: false,
            description: 'The insects can leave through the window and the small gaps in the room.'}
    ],
    sources: [],
    starts: [{id: id('start'), locationId: id('washroom'),
        description: 'You are Taylor Hebert. You came here to eat your lunch in peace. Now your clothes are soaked and insects cover the room. For three months you have practiced directing them in private. The door is in front of you.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adolescent', hands: 2, mobile: true},
        effects: [note('insects_known', 'The insects gathered here respond to your direction.'), note('practice', 'You have practiced directing insects privately for three months. You can direct individuals or select a group.'),
            note('aftermath', 'The girls have left. Your clothes are soaked; cleaning your glasses has left streaks. Your bag may be damaged.')] }],
    simulation: {
        people: [{id: id('insects'), revision: 1, label: 'Gathered insects', worldId: id('world'),
            location: id('washroom'), inventory: 'simulation', provision: false}],
        energies: [],
        commands: [
            action('disperse', 'Send the insects out', 'washroom',
                'Send the insects out through the window and gaps. Stand by the door while they leave.',
                [move('outside', id('insects')), note('dispersed', 'You hold the doorway as the insects leave through the window and gaps. The gathered insects are outside now.')],
                {once: true, targetId: id('insects'), coLocated: true, participants: ['$target']}),
            action('leave', 'Step into the corridor', 'washroom',
                'Step out without sending the insects away. They will remain in the washroom while you go into the corridor.',
                [move('corridor'), note('corridor_visit', 'You step into the corridor. The washroom door is behind you. You can still go back.')]),
            action('return', 'Go back into the washroom', 'corridor',
                'Return to the room. Leaving did not send the insects away for you.', [move('washroom')])
        ]
    },
    presentation: {
        people: {[id('insects')]: {introductionKnowledgeKey: id('insects_known')}},
        status: [{id: id('practice_status'), label: 'Private practice', knowledgeKey: id('practice')},
            {id: id('dispersal_status'), label: 'Insects sent outside', knowledgeKey: id('dispersed')},
            {id: id('corridor_status'), label: 'Leaving the room', knowledgeKey: id('corridor_visit')}]
    }
};
