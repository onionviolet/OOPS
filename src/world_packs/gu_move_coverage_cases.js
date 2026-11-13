import {icebladeStormWorldBeat} from './gu_coupled_move_rows.js';
import {guBodyHolder} from '../gu_living_body.js';
import {sharedProperties, sharedQuantities} from '../world_quantities.js';
import {GIANT_HAND_PROPERTIES} from './gu_giant_hand_working.js';
import {GU_FORMATION_PLATE_PROPERTIES, GU_TELEPORT_ARRAY_PROPERTIES} from './gu_formation_plate.js';

export const GU_MOVE_CASE_MODULE = 'src/world_packs/gu_move_coverage_cases.js';
export const MOONBLADE_COVERAGE_ID = 'little-light-moonblade';
export const PLATE_SHELTER_COVERAGE_ID = 'formation-plate-shelter';
export const TELEPORT_ARRAY_COVERAGE_ID = 'lang-ya-tai-qiu-teleportation';
export const CLEANSING_ARRAY_COVERAGE_ID = 'self-cleansing-formation-plate';
export const THREE_HEADS_COVERAGE_ID = 'three-heads-six-arms';
export const FUTURE_TRAVEL_COVERAGE_ID = 'future-self-phantom-travel';
const reserve = 'energy:primeval.rank1';
const binding = (kind, id) => ({kind, id});

export function coverageCase(id) {
    if (id === FUTURE_TRAVEL_COVERAGE_ID) return futureTravelCase();
    if (id === THREE_HEADS_COVERAGE_ID) return threeHeadsCase();
    if (id === TELEPORT_ARRAY_COVERAGE_ID) return teleportArrayCase();
    if (id === CLEANSING_ARRAY_COVERAGE_ID) return cleansingArrayCase();
    if (id === PLATE_SHELTER_COVERAGE_ID) return plateShelterCase();
    if (id === MOONBLADE_COVERAGE_ID) return moonbladeCase();
    if (id === 'giant-hand-condensed-core') return giantHandCase();
    if (id === 'giant-hand-stored-phantoms') return preparedHandCase();
    if (id !== 'iceblade-storm') throw Error('Unknown Gu move coverage case: ' + id);
    const beat = icebladeStormWorldBeat;
    const specimens = Object.fromEntries(beat.participants.map(({id, kind}) => [id, {
        ...guBodyHolder({id: kind, needs: 'gu'}, {id: 'live-' + id, place: 'bank', satiety: 6}),
        properties: {alive: true, gu_kind: kind, gu_keeper: 'keeper', gu_controller: 'keeper'},
    }]));
    const movement = ['keeper', ...Object.values(specimens).map(row => row.id)].map(holder =>
        ({holder, position: true, direction: 'changed', to: 'ford'}));
    const quantities = [
        {holder: 'keeper', quantity: reserve, direction: 'down', amount: 5},
        {holder: 'ford', quantity: 'temperature', direction: 'down', amount: 10, to: -4},
        {holder: 'bank', quantity: 'temperature', direction: 'unchanged', to: 6},
        {holder: 'rival', quantity: 'vitality', direction: 'down', amount: 4},
        {holder: 'bystander', quantity: 'vitality', direction: 'unchanged', to: 12},
    ];
    return {
        basis: 'authored',
        world: {holders: [
            ...['bank', 'ford'].map((name, index) => ({id: name, kind: 'place', properties: {track_position: 3 * index},
                quantities: {temperature: 6}})),
            {id: 'keeper', kind: 'body', as: ['operator'], place: 'bank', quantities: {[reserve]: 8, vitality: 12}},
            {id: 'rival', kind: 'body', as: ['creature'], place: 'ford', quantities: {vitality: 12}},
            {id: 'bystander', kind: 'body', place: 'bank', quantities: {vitality: 12}},
            ...Object.values(specimens),
        ]},
        engine: {packs: ['l.living_body'], shared: {quantities: sharedQuantities(['energy', 'temperature', 'vitality']),
            properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
                {id: 'track_position', type: 'level', min: 0}]}},
        timeline: [
            {id: 'cast', working: {family: 'gu-coupled', id: 'storm', beat, bindings: {
                operator: binding('operator', 'keeper'), origin: binding('place', 'bank'), place: binding('place', 'ford'),
                target: binding('creature', 'rival'),
                ...Object.fromEntries(Object.entries(specimens).map(([role, row]) => [role, binding('gu', row.id)])),
            }}},
            {id: 'prepare', advanceTo: 1, expect: [{holder: 'keeper', quantity: reserve, direction: 'unchanged', to: 8}]},
            {id: 'reload', restore: true},
            {id: 'settle', advanceTo: 2, expect: [...movement, ...quantities]},
            ...[3, 5].flatMap(at => [
                {id: 'clock-' + at, advanceTo: at},
                {id: 'counter-' + at, by: 'rival',
                    sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'body', cost: 'none', limits: []},
                    details: {target: {shape: 'holder', id: 'keeper'}, amount: 2},
                    expect: [{holder: 'keeper', quantity: 'vitality', direction: at === 3 ? 'unchanged' : 'down', to: at === 3 ? 12 : 10}]},
            ]),
        ],
        expect: [...movement, ...quantities, {holder: 'keeper', quantity: 'vitality', direction: 'down', amount: 2}],
    };
}

function futureTravelCase() {
    const fuel = 'energy:immortal.borrowed';
    const kind = 'fixed-immortal-travel';
    const travel = (id, fromRiver = true) => ({id, working: {id, family: 'gu-fixed-travel',
        options: {borrowed: true, fromRiver}, bindings: {operator: binding('operator', 'traveller'),
            destination: binding('place', 'hill'), impression: binding('impression', 'notes'),
            anchor: binding('time-anchor', 'anchor'), ...(fromRiver && {river: binding('place', 'river')})}}});
    const position = (holder, direction, to) => ({holder, position: true, direction, to});
    const balance = (direction, to) => ({holder: 'anchor', quantity: fuel, direction, to});
    const essence = (direction, to) => ({holder: 'traveller', quantity: 'energy:immortal.green-grape', direction, to});
    const attune = id => ({id, working: {id, family: 'gu-fixed-travel', options: {attune: true}, bindings: {
        operator: binding('operator', 'traveller'), anchor: binding('time-anchor', 'anchor'), river: binding('place', 'river'),
    }}});
    const changeRiver = id => ({id, ops: [{op: 'property', holder: 'river', property: 'gu_river_course', value: 'new-course'}]});
    return {basis: 'authored', world: {holders: [
        {id: 'start', kind: 'place'}, {id: 'rival-aperture', kind: 'place'},
        {id: 'hill', kind: 'place', properties: {gu_travel_scene: 'observatory'}},
        {id: 'river', kind: 'place', properties: {gu_river_course: 'old-course'}},
        {id: 'traveller', kind: 'body', as: ['operator'], place: 'start',
            properties: {alive: true}, quantities: {'energy:immortal.green-grape': 3}},
        {...guBodyHolder({id: kind, needs: 'gu'}, {id: 'live-gu', place: 'rival-aperture', satiety: 20}),
            properties: {alive: true, gu_kind: kind, gu_keeper: 'rival'}},
        {id: 'notes', kind: 'thing', as: ['impression'], place: 'start',
            properties: {gu_impression_owner: 'traveller', gu_impression_site: 'hill', gu_travel_scene: 'observatory'}},
        {id: 'anchor', kind: 'thing', as: ['time-anchor'], place: 'start', quantities: {[fuel]: 0}},
    ]}, engine: {packs: ['l.living_body', 'g.travel-carry'], shared: {quantities: sharedQuantities(['energy']),
        properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper'].map(id => ({id, type: 'label'}))]}},
    timeline: [
        attune('attune'), attune('duplicate'),
        {id: 'attunement-pending', advanceTo: 1, expect: [balance('unchanged', 0), essence('unchanged', 3)]},
        {id: 'restore-attunement', restore: true},
        {id: 'attuned', advanceTo: 2, interruption: {working: 'duplicate', reason: 'blank local river anchor required'},
            expect: [balance('up', 2), essence('down', 1)]},
        travel('unbound', false),
        {id: 'anchor-required', advanceTo: 4, interruption: {working: 'unbound', reason: 'river-anchor-required'},
            expect: [balance('unchanged', 2)]},
        travel('first'),
        {id: 'first-pending', advanceTo: 5},
        {id: 'restore-first', restore: true},
        {id: 'first-arrival', advanceTo: 6, expect: [balance('down', 1), position('traveller', 'changed', 'hill'), essence('unchanged', 1)]},
        changeRiver('after-arrival'),
        {id: 'later', advanceTo: 7, expect: [position('traveller', 'unchanged', 'hill')]},
        {id: 'return-to-start', ops: [
            {op: 'move', holder: 'traveller', to: 'start'},
            {op: 'property', holder: 'river', property: 'gu_river_course', value: 'old-course'},
        ]},
        travel('second'),
        {id: 'second-pending', advanceTo: 8},
        {id: 'alter-course-again', ops: [{op: 'property', holder: 'river', property: 'gu_river_course', value: 'third-course'}]},
        {id: 'restore-second', restore: true},
        {id: 'refused', advanceTo: 9, interruption: {working: 'second', reason: 'river-course-changed'},
            expect: [balance('unchanged', 1), position('traveller', 'unchanged', 'start')]},
    ], expect: [balance('up', 1), position('live-gu', 'unchanged', 'rival-aperture'), essence('down', 1)]};
}

function threeHeadsCase() {
    const fuel = 'energy:primeval.formation';
    const operators = ['first', 'second', 'third'];
    const allocations = [5, 7, 6];
    const load = id => ({id, kind: 'thing', as: ['load'], place: 'yard',
        properties: {gu_load_threshold: 5}, quantities: {'stock:lifted': 0}});
    const holders = [{id: 'yard', kind: 'place'}, {id: 'outside', kind: 'place'}, load('gate'), load('second-gate')];
    const specimens = [];
    for (const [index, id] of operators.entries()) {
        holders.push({id, kind: 'body', as: ['operator'], place: 'yard', quantities: {[fuel]: allocations[index] * 2},
            properties: {alive: true, gu_coordination_ready: true}});
        for (let n = 0; n < allocations[index]; n++) {
            const specimen = id + '.gu' + (n + 1);
            holders.push({...guBodyHolder({id: 'formation-gu', needs: 'gu'}, {id: specimen, place: 'yard', satiety: 12}),
                properties: {alive: true, gu_rank: 3 + n % 3, gu_keeper: id, gu_controller: id}});
            specimens.push(binding('gu', specimen));
        }
    }
    const balances = direction => operators.map((holder, index) =>
        ({holder, quantity: fuel, direction, to: direction === 'down' ? 0 : allocations[index] * 2}));
    const lifted = (holder, to) => ({holder, quantity: 'stock:lifted', direction: to ? 'up' : 'unchanged', to});
    const work = (id, operation, bindings) => ({id, working: {id, family: 'gu-three-heads', operation, bindings}});
    const lead = binding('operator', 'first');
    const lift = (id, target) => work(id, 'lift', {lead, load: binding('load', target)});
    const combine = id => work(id, 'combine', {lead, left: binding('operator', 'second'), right: binding('operator', 'third'),
        ...Object.fromEntries(specimens.map((specimen, index) => ['gu' + (index + 1), specimen]))});
    return {basis: 'authored', world: {holders}, engine: {packs: ['l.living_body', 'g.three-heads'],
        shared: {quantities: sharedQuantities(['energy', 'stock']), properties: [...sharedProperties(['alive']),
            ...['gu_keeper', 'gu_controller', 'gu_use_working'].map(id => ({id, type: 'label'})),
            {id: 'gu_rank', type: 'level', min: 1}, {id: 'gu_use_working_until', type: 'level', min: 0}]}},
    timeline: [
        lift('ordinary', 'gate'),
        {id: 'unassisted', advanceTo: 1, expect: [lifted('gate', 0)]},
        combine('contended'),
        {id: 'commit-gu', ops: [
            {op: 'property', holder: 'third.gu1', property: 'gu_use_working', value: 'other-work'},
            {op: 'property', holder: 'third.gu1', property: 'gu_use_working_until', value: 3},
        ]},
        {id: 'refused', advanceTo: 3, interruption: {working: 'contended', reason: 'A Gu has lost its operator or is committed elsewhere.'},
            expect: balances('unchanged')},
        combine('combine'),
        {id: 'mid-combination', advanceTo: 4},
        {id: 'restore-combination', restore: true},
        {id: 'formed', advanceTo: 5, expect: balances('down')},
        lift('combined-lift', 'gate'),
        {id: 'lifted', advanceTo: 6, expect: [lifted('gate', 1)]},
        lift('interrupted-lift', 'second-gate'),
        {id: 'member-leaves', ops: [{op: 'move', holder: 'third', to: 'outside'}]},
        {id: 'separated', advanceTo: 7, expect: [lifted('second-gate', 0)]},
    ], expect: [...balances('down'), lifted('gate', 1), lifted('second-gate', 0)]};
}

function cleansingArrayCase() {
    const fuel = 'energy:immortal.essence';
    const operator = binding('operator', 'keeper');
    const site = binding('place', 'ford');
    const plate = binding('gu', 'plate');
    const working = (id, operation, options = {}) => ({id, working: {id, family: 'gu-formation-plate',
        options: {operation, ...options}, bindings: {operator, site, ...(operation !== 'cleanse' && {plate})}}});
    const balance = (direction, to) => ({holder: 'keeper', quantity: fuel, direction, to});
    const position = (direction, to) => ({holder: 'keeper', position: true, direction, to});
    const field = (lawField, direction, to) => ({lawField, direction, to});
    const depart = (id, direction, to) => ({id, by: 'keeper',
        sentence: {verb: 'move', object: 'position', target: 'bound', time: 'instant', carrier: 'body', cost: 'none', limits: []},
        details: {target: {shape: 'holder', id: 'keeper'}, to: 'bank'}, expect: [position(direction, to)]});
    const restraint = (id, scope) => ({id, scope, kind: 'block',
        params: {verb: 'move', object: 'position', guCleansable: true}});
    const personal = restraint('personal', 'keeper');
    personal.params.guRestraintStrength = 2;
    const weakened = {scope: personal.scope, kind: personal.kind, params: {...personal.params, guRestraintStrength: 1}};
    const other = restraint('other', 'visitor');
    const foreign = {id: 'foreign', scope: 'keeper', kind: 'block', params: {verb: 'remove', object: 'vitality'}};
    return {basis: 'authored', world: {holders: [
        ...['ford', 'bank', 'store'].map(id => ({id, kind: 'place'})),
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'ford', properties: {alive: true}, quantities: {[fuel]: 5}},
        {id: 'visitor', kind: 'body', place: 'ford'},
        {...guBodyHolder({id: 'formation-plate', needs: 'gu'}, {id: 'plate', place: 'ford', satiety: 20}),
            properties: {alive: true, gu_kind: 'formation-plate', gu_keeper: 'keeper', gu_controller: 'keeper', gu_formation_layout: 'teleport'}},
    ], lawFields: [personal, other, foreign]}, engine: {packs: ['l.living_body', 'gu.self-cleansing'],
        shared: {quantities: sharedQuantities(['energy']), properties: [...sharedProperties(['alive']),
            ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})), ...GU_FORMATION_PLATE_PROPERTIES]}},
    timeline: [
        depart('bound', 'unchanged', 'ford'),
        working('wrong-layout', 'install-cleansing', {duration: 5}),
        {id: 'refused', advanceTo: 2, interruption: {working: 'wrong-layout', reason: 'compatible cleansing layout unavailable'},
            expect: [balance('unchanged', 5)]},
        working('rewrite', 'inscribe', {layout: 'self-cleansing', previous: 'teleport'}),
        {id: 'rewritten', advanceTo: 4, expect: [balance('down', 4)]},
        working('install', 'install-cleansing', {duration: 6}),
        {id: 'installed', advanceTo: 6, expect: [balance('down', 3)]},
        {id: 'retrieve-plate', ops: [{op: 'move', holder: 'plate', to: 'store'}]},
        working('pulse', 'cleanse'),
        {id: 'weakened', advanceTo: 8, expect: [balance('down', 2), field('personal', 'changed', weakened)]},
        depart('still-bound', 'unchanged', 'ford'),
        working('finish-pulse', 'cleanse'),
        {id: 'mid-pulse', advanceTo: 9},
        {id: 'restore-pulse', restore: true},
        {id: 'cleansed', advanceTo: 10, expect: [balance('down', 1), field('personal', 'changed', null),
            field('foreign', 'unchanged'), field('other', 'unchanged')]},
        depart('free', 'changed', 'bank'),
        {id: 'return', ops: [{op: 'move', holder: 'keeper', to: 'ford'},
            {op: 'law_add', field: restraint('fresh-restraint', 'keeper')}]},
        working('late-pulse', 'cleanse'),
        {id: 'expired', advanceTo: 12, expect: [balance('down', 0), field('fresh-restraint', 'unchanged')]},
        depart('bound-again', 'unchanged', 'ford'),
    ], expect: [balance('down', 0), field('personal', 'changed', null), field('foreign', 'unchanged'), field('other', 'unchanged')]};
}

function teleportArrayCase() {
    const fuel = 'energy:immortal.essence';
    const keeper = binding('operator', 'keeper');
    const plate = binding('gu', 'plate');
    const site = binding('place', 'tai-qiu');
    const endpoints = {site, array: binding('formation', 'outer-array'),
        terminus: binding('formation', 'main-array'), anchor: binding('thing', 'water-corpse')};
    const install = id => ({id, working: {id, family: 'gu-teleport-array', options: {install: true},
        bindings: {...endpoints, operator: keeper, plate}}});
    const cross = (id, actor, specimen, returning = false) => ({id, working: {id, family: 'gu-teleport-array',
        options: {returning}, bindings: {...endpoints, operator: binding('operator', actor), key: binding('gu', specimen)}}});
    const body = (id, kind, owner, place, properties = {}) => ({
        ...guBodyHolder({id: kind, needs: 'gu'}, {id, place, satiety: 500}),
        properties: {alive: true, gu_kind: kind, gu_keeper: owner, gu_controller: owner, ...properties},
    });
    const balance = (holder, direction, to) => ({holder, quantity: fuel, direction, to});
    const position = (holder, direction, to) => ({holder, position: true, direction, to});
    const connected = {holder: 'outer-array', property: 'gu_array_terminus', direction: 'changed', to: 'main-array'};
    const rewritten = {holder: 'plate', property: 'gu_formation_layout', direction: 'changed', to: 'shelter'};
    return {basis: 'authored', world: {holders: [
        ...['tai-qiu', 'lang-ya', 'store'].map(id => ({id, kind: 'place'})),
        {id: 'outer-array', kind: 'thing', as: ['formation'], place: 'tai-qiu', properties: {gu_array_intact: true}},
        {id: 'main-array', kind: 'thing', as: ['formation'], place: 'lang-ya', properties: {gu_array_intact: true}},
        {id: 'water-corpse', kind: 'thing', place: 'tai-qiu', properties: {gu_anchor_water_marks: 1}},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'tai-qiu', quantities: {[fuel]: 5}},
        {id: 'visitor', kind: 'body', as: ['operator'], place: 'lang-ya', quantities: {[fuel]: 2}},
        body('plate', 'formation-plate', 'keeper', 'tai-qiu', {gu_formation_layout: 'teleport'}),
        body('key', 'array-travel-key', 'keeper', 'tai-qiu', {gu_carried: true, gu_array_key_for: 'main-array'}),
        body('visitor-key', 'array-travel-key', 'visitor', 'lang-ya', {gu_carried: true, gu_array_key_for: 'main-array'}),
    ]}, engine: {packs: ['l.living_body', 'g.travel-carry'], shared: {quantities: sharedQuantities(['energy']),
        properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
            ...GU_FORMATION_PLATE_PROPERTIES, ...GU_TELEPORT_ARRAY_PROPERTIES]}}, timeline: [
        install('install'),
        {id: 'mid-installation', advanceTo: 180, expect: [balance('keeper', 'unchanged', 5)]},
        {id: 'restore-installation', restore: true},
        {id: 'installed', advanceTo: 360, expect: [balance('keeper', 'down', 4), connected]},
        {id: 'rewrite', working: {id: 'rewrite', family: 'gu-formation-plate',
            options: {operation: 'inscribe', previous: 'teleport', layout: 'shelter'}, bindings: {operator: keeper, plate, site}}},
        {id: 'rewritten', advanceTo: 362, expect: [balance('keeper', 'down', 3), rewritten]},
        {id: 'retrieve-plate', ops: [{op: 'move', holder: 'plate', to: 'store'}]},
        cross('outbound', 'keeper', 'key'),
        {id: 'mid-crossing', advanceTo: 364, expect: [position('keeper', 'unchanged', 'tai-qiu')]},
        {id: 'restore-crossing', restore: true},
        {id: 'arrived', advanceTo: 367, expect: [balance('keeper', 'down', 2), position('keeper', 'changed', 'lang-ya'),
            position('key', 'changed', 'lang-ya')]},
        cross('return', 'visitor', 'visitor-key', true),
        {id: 'visitor-arrived', advanceTo: 372, expect: [balance('visitor', 'down', 1), position('visitor', 'changed', 'tai-qiu'),
            position('visitor-key', 'changed', 'tai-qiu')]},
        cross('severed', 'visitor', 'visitor-key'),
        {id: 'sever-main-array', ops: [{op: 'property', holder: 'main-array', property: 'gu_array_intact', value: false}]},
        {id: 'refused', advanceTo: 377, interruption: {working: 'severed', reason: 'installed route unavailable'},
            expect: [balance('visitor', 'unchanged', 1), position('visitor', 'unchanged', 'tai-qiu')]},
    ], expect: [connected, rewritten, balance('keeper', 'down', 2), balance('visitor', 'down', 1),
        position('keeper', 'changed', 'lang-ya'), position('visitor', 'changed', 'tai-qiu'), position('plate', 'changed', 'store')]};
}

function plateShelterCase() {
    const fuel = 'energy:immortal.essence';
    const bindings = {operator: binding('operator', 'keeper'), plate: binding('gu', 'plate'), site: binding('place', 'ford')};
    const work = (id, options) => ({id, working: {id, family: 'gu-formation-plate', options, bindings}});
    const erect = {operation: 'erect', layout: 'shelter', duration: 4};
    const balance = (direction, to) => ({holder: 'keeper', quantity: fuel, direction, to});
    const vitality = (direction, to) => ({holder: 'keeper', quantity: 'vitality', direction, to});
    const strike = (id, direction, to) => ({id, by: 'rival',
        sentence: {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'body', cost: 'none', limits: []},
        details: {target: {shape: 'holder', id: 'keeper'}, amount: 4}, expect: [vitality(direction, to)]});
    const layout = {holder: 'plate', property: 'gu_formation_layout', direction: 'changed', to: 'shelter'};
    return {basis: 'authored', world: {holders: [
        {id: 'ford', kind: 'place'},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'ford', quantities: {[fuel]: 3, vitality: 12}},
        {id: 'rival', kind: 'body', place: 'ford'},
        {...guBodyHolder({id: 'formation-plate', needs: 'gu'}, {id: 'plate', place: 'ford', satiety: 20}),
            properties: {alive: true, gu_kind: 'formation-plate', gu_keeper: 'keeper', gu_controller: 'keeper', gu_formation_layout: 'teleport'}},
    ]}, engine: {packs: ['l.living_body'], shared: {quantities: sharedQuantities(['energy', 'vitality']), properties: [
        ...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
        ...GU_FORMATION_PLATE_PROPERTIES,
    ]}}, timeline: [
        work('wrong-layout', erect),
        {id: 'refused', advanceTo: 2, interruption: {working: 'wrong-layout', reason: 'compatible shelter layout unavailable'},
            expect: [balance('unchanged', 3)]},
        work('rewrite', {operation: 'inscribe', previous: 'teleport', layout: 'shelter'}),
        {id: 'mid-inscription', advanceTo: 3},
        {id: 'restore-inscription', restore: true},
        {id: 'inscribed', advanceTo: 4, expect: [balance('down', 2), layout]},
        work('install', erect),
        {id: 'installed', advanceTo: 6, expect: [balance('down', 1)]},
        strike('inside-shelter', 'unchanged', 12),
        {id: 'expiry', advanceTo: 10},
        strike('after-expiry', 'down', 8),
    ], expect: [layout, balance('down', 1), vitality('down', 8)]};
}

function moonbladeCase() {
    const cast = (id, supported) => ({id, working: {id, family: 'gu-moonblade-contact', supported, bindings: {
        operator: binding('operator', 'keeper'), blade: binding('gu', 'moon'), target: binding('creature', 'rival'),
        ...(supported && {light: binding('gu', 'light')}),
    }}});
    const paid = (amount, to) => ({holder: 'keeper', quantity: reserve, direction: 'down', amount, to});
    const health = (holder, direction, to) => ({holder, quantity: 'vitality', direction, to});
    const harm = health('rival', 'down', 18);
    const untouched = health('bystander', 'unchanged', 20);
    return {
        basis: 'authored', world: {holders: [
            ...['bank', 'near', 'far'].map(id => ({id, kind: 'place'})),
            {id: 'keeper', kind: 'body', as: ['operator'], place: 'bank', quantities: {[reserve]: 9}, properties: {alive: true}},
            ...['rival', 'bystander'].map(id => ({id, kind: 'body', as: ['creature'], place: 'far',
                quantities: {vitality: 20}, properties: {alive: true}})),
            ...[['moon', 'moonlight'], ['light', 'little-light']].map(([id, kind]) => ({
                ...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'bank', satiety: 10}),
                properties: {alive: true, gu_kind: kind, gu_keeper: 'keeper', gu_controller: 'keeper'},
            })),
        ], links: [
            {id: 'near-line', kind: 'sightline', from: 'bank', to: 'near', cost: 10},
            {id: 'far-line', kind: 'sightline', from: 'near', to: 'far', cost: 10},
        ]},
        engine: {packs: ['l.living_body'], shared: {quantities: sharedQuantities(['energy', 'vitality']),
            properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))]}},
        timeline: [
            cast('plain', false),
            {id: 'plain-contact', advanceTo: 2, expect: [paid(4, 5), health('rival', 'unchanged', 20)]},
            cast('assisted', true),
            {id: 'support-paid', advanceTo: 3, expect: [paid(1, 4)]},
            {id: 'released', advanceTo: 4, expect: [paid(4, 0), health('rival', 'unchanged', 20)]},
            {id: 'restore-flight', restore: true},
            {id: 'assisted-contact', advanceTo: 5, expect: [harm, untouched]},
        ], expect: [paid(9, 0), harm, untouched],
    };
}

function preparedHandCase() {
    const data = giantHandCase();
    const immortal = 'energy:immortal.red-date';
    const {holders} = data.world;
    const keeper = holders.find(row => row.id === 'keeper');
    keeper.quantities = {[reserve]: 8, [immortal]: 4};
    const core = holders.find(row => row.id === 'core');
    core.properties.gu_kind = 'self-strength';
    holders.push({
        ...guBodyHolder({id: 'older-strength-supports', needs: 'gu'}, {id: 'steady', place: 'bank', satiety: 30}),
        properties: {...core.properties, gu_kind: 'older-strength-supports', gu_rank: 1},
    }, {id: 'second-slab', kind: 'thing', place: 'bank', properties: {gu_slab_load: 5}});
    for (const row of holders.filter(row => row.as?.includes('gu'))) row.quantities.satiety = 70;
    const {bindings} = data.timeline[0].working;
    const action = (id, method, bindings) => ({id, working: {family: 'gu-revised-giant-hand', id, method, bindings}});
    const prepare = id => action(id, 'prepare', {operator: bindings.operator, core: bindings.core, support: binding('gu', 'steady')});
    const {core: _core, ...release} = bindings;
    const paid = (quantity, amount, to) => ({holder: 'keeper', quantity, direction: 'down', amount, to});
    const slabMoved = {holder: 'slab', position: true, direction: 'changed', to: 'ford'};
    const still = {holder: 'second-slab', position: true, direction: 'unchanged', to: 'bank'};
    const reserveIntact = {holder: 'keeper', quantity: reserve, direction: 'unchanged', to: 3};
    return {...data, timeline: [
        prepare('prepare-first'),
        {id: 'steady', advanceTo: 1, expect: [paid(reserve, 1, 7)]},
        {id: 'prepared', advanceTo: 10, expect: [paid(immortal, 2, 2)]},
        {id: 'reload-phantoms', restore: true},
        action('release-first', 'release', release),
        {id: 'first-hit', advanceTo: 11, expect: [slabMoved, paid(reserve, 3, 4)]},
        prepare('prepare-second'),
        {id: 'second-batch', advanceTo: 21, expect: [paid(reserve, 1, 3), paid(immortal, 2, 0)]},
        {id: 'wait', advanceTo: 50},
        action('release-expired', 'release', {...release, slab: binding('thing', 'second-slab')}),
        {id: 'expired', advanceTo: 51, interruption: {working: 'release-expired', reason: 'No prepared phantoms remain.'}, expect: [still, reserveIntact]},
    ], expect: [slabMoved, still, paid(immortal, 4, 0), paid(reserve, 5, 3)]};
}

function giantHandCase() {
    const immortal = 'energy:immortal.red-date';
    const gu = (id, kind, rank, properties = {}) => ({
        ...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'bank', satiety: 6}),
        properties: {alive: true, gu_kind: kind, gu_rank: rank, gu_keeper: 'keeper', gu_controller: 'keeper', ...properties},
    });
    const redDatePaid = {holder: 'keeper', quantity: immortal, direction: 'down', amount: 1, to: 0};
    const supportPaid = {holder: 'keeper', quantity: reserve, direction: 'down', amount: 3, to: 0};
    const slabMoved = {holder: 'slab', position: true, direction: 'changed', to: 'ford'};
    return {
        basis: 'authored', world: {holders: [
            {id: 'bank', kind: 'place'}, {id: 'ford', kind: 'place'},
            {id: 'keeper', kind: 'body', as: ['operator'], place: 'bank', properties: {alive: true}, quantities: {[reserve]: 3, [immortal]: 1}},
            {id: 'slab', kind: 'thing', place: 'bank', properties: {gu_slab_load: 5}},
            gu('core', 'myriad-self', 7), gu('plain', 'group-strength', 1),
            gu('focused', 'group-strength', 1, {gu_gather_force: 3, gu_gather_cost: 2}),
        ]},
        engine: {packs: ['l.living_body'], shared: {quantities: sharedQuantities(['energy']), properties: [
            ...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
            {id: 'gu_rank', type: 'level', min: 1}, ...GIANT_HAND_PROPERTIES,
        ]}},
        timeline: [
            {id: 'cast', working: {family: 'gu-revised-giant-hand', id: 'hand', bindings: {
                operator: binding('operator', 'keeper'), core: binding('gu', 'core'), left: binding('gu', 'plain'),
                right: binding('gu', 'focused'), slab: binding('thing', 'slab'), rest: binding('place', 'ford'),
            }}},
            {id: 'summon', advanceTo: 1, expect: [redDatePaid, {holder: 'keeper', quantity: reserve, direction: 'unchanged', to: 3}]},
            {id: 'reload', restore: true},
            {id: 'gather', advanceTo: 2, expect: [supportPaid, slabMoved]},
        ],
        expect: [redDatePaid, supportPaid, slabMoved],
    };
}
