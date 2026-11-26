// Source: held English Worm, Gestation 1.1 P051; 1.2 P004–007.
// Times and the untaken return bus are authored defaults. No fare is inferred.
import {extensionFact} from '../structured_pack_extensions.js';
import {WORM_LEAD, wormLeadId as baseId} from './book_worm_lead_life.js';
export const WORM_BUS = baseId('bus');
export const wormBusId = name => `${WORM_BUS}.${name}`;
const id = wormBusId;
export const soakedBackpackKey = JSON.stringify({id: id('backpack')});
const world = baseId('world');
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const carried = {fact: `item.${soakedBackpackKey}`, op: 'gte', value: 1, reason: 'Bring your soaked backpack within reach.'};
const emptyHanded = eq(`item.${soakedBackpackKey}`, 0);
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'));
const admitted = eq(extensionFact(WORM_BUS));
const support = all(ready, admitted);
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: id(name), stage: 'understood', value});
const bagPlace = place => ({type: 'fact', scope: 'actor', key: id('bag_place'), value: place});
const item = amount => ({type: 'item', actor: 'player', key: soakedBackpackKey, amount});
const move = location => ({type: 'relocate', actor: 'player', location});
const parkable = [
    [baseId('washroom'), 'washroom'], [baseId('corridor'), 'corridor'],
    [id('school_stop'), 'school_stop'], [id('home_stop'), 'home_stop']
];
function act(name, label, location, duration, needs, description, effects, once = false) {
    const requires = all(support, ...needs);
    return {id: id(name), revision: 1, label, description, group: 'structured_local', worldId: world,
        actorId: 'player', location, audience: ['$actor'], once, duration,
        requires, completionRequires: requires, completionCoLocated: true, cancellation: 'refund',
        completionFailure: 'refund', reservationReturns: 1, costs: [], effects};
}
export const wormLeadBus = {
    schema: 1, id: WORM_BUS, revision: 1,
    base: {id: WORM_LEAD, revision: 1, contentHash: 'sha256:a6f920b8f1f3d77345e4ac73dbc44bce0ab126e4b10f154dfafacc84b5bcc338'},
    label: 'the way home',
    description: 'Your backpack is still where you left it in the washroom. You can take it with you, check what the juice reached, or leave it there for now.',
    requires: all(ready, eq(`knowledge.${baseId('aftermath')}.seen`)),
    reason: 'Continue from the school washroom with your belongings still to collect.',
    items: [{id: id('backpack'), label: 'Your soaked backpack',
        description: 'The backpack you brought to school. Juice has soaked into it.', value: 0}],
    locations: [
        {id: id('school_stop'), label: 'Bus stop near school', underRoof: false,
            description: 'Buses pass on the road outside school. The washroom and your unfinished school day are behind you.'},
        {id: id('homebound'), label: 'Bus toward home', underRoof: true,
            description: 'You have boarded a bus heading in the general direction of home.'},
        {id: id('home_stop'), label: 'Bus stop near home', underRoof: false,
            description: 'Your house is a block away. You are still wearing your damp school clothes.'},
        {id: id('schoolbound'), label: 'Bus back toward school', underRoof: true,
            description: 'You have chosen to go back toward school.'}
    ],
    status: [{id: id('bag_status'), label: 'Backpack', knowledgeKey: id('collected')},
        {id: id('inspection_status'), label: 'What you found', knowledgeKey: id('inspection')},
        {id: id('arrival_status'), label: 'Journey', knowledgeKey: id('arrival')}],
    commands: [
        act('collect', 'Pick up your soaked backpack', baseId('washroom'), 1, [emptyHanded],
            'Pick up the backpack you left in the washroom. Keep it with you as you go.',
            [item(1), bagPlace('held'), note('collected', 'You pick up your soaked backpack. The juice has soaked into the fabric.')], true),
        act('leave_school', 'Walk to the bus stop', baseId('corridor'), 2, [],
            'Head out of school to the road where buses pass.',
            [move(id('school_stop'))]),
        act('return_school', 'Go back inside school', id('school_stop'), 2, [],
            'Return to the corridor outside the washroom.', [move(baseId('corridor'))]),
        act('board_home', 'Board a bus toward home', id('school_stop'), 1, [],
            'Get on a bus heading in the general direction of home.', [move(id('homebound'))]),
        act('step_off', 'Step off before the bus leaves', id('homebound'), 1, [],
            'Step back onto the pavement before setting off.', [move(id('school_stop'))]),
        act('ride_home', 'Ride toward home', id('homebound'), 10, [],
            'Stay on the bus until the stop near home.',
            [move(id('home_stop')), note('arrival', 'You get off the bus a block from home. Your clothes are still damp.')]),
        act('inspect_ride', 'Check your backpack on the ride home', id('homebound'), 10, [carried],
            'Open your backpack beside you and check what the juice reached while you ride toward home.',
            [move(id('home_stop')), note('inspection', 'Your school books are wet and the project box is crushed. Your private practice notebook has purple, warped pages and blurred ink. Some of your notes may be hard to recover.'),
                note('arrival', 'You get off the bus a block from home. Your clothes are still damp.')]),
        ...[...parkable, [id('homebound'), 'homebound'], [id('schoolbound'), 'schoolbound']].map(([place, suffix]) =>
            act(`inspect_${suffix}`, 'Check your soaked backpack', place, 2, [carried],
                'Open the bag within reach and check what the juice reached.',
                [note('inspection', 'Your school books are wet and the project box is crushed. Your private practice notebook has purple, warped pages and blurred ink. Some of your notes may be hard to recover.')])
        ),
        act('board_return', 'Board a bus back toward school', id('home_stop'), 1, [],
            'Choose to go back toward school.', [move(id('schoolbound'))]),
        act('ride_return', 'Ride back toward school', id('schoolbound'), 10, [],
            'Stay on the bus until the stop near school.', [move(id('school_stop'))]),
        ...parkable.flatMap(([place, suffix]) => [
            act(`put_${suffix}`, 'Set your backpack down', place, 1,
                [carried, eq(`actor.${id('bag_place')}`, 'held')],
                'Set your backpack down here. Its contents stay inside it.', [item(-1), bagPlace(place)]),
            act(`take_${suffix}`, 'Pick your backpack back up', place, 1,
                [emptyHanded, eq(`actor.${id('bag_place')}`, place, 'Your backpack is not here.')],
                'Pick up the backpack you set down here.', [item(1), bagPlace('held')])
        ])
    ]
};
export async function registerWormLeadBus(register, base) {
    if(!register.bundledInstantExtension || base.contentHash !== wormLeadBus.base.contentHash)return null;
    return register.bundledInstantExtension(wormLeadBus, base);
}
