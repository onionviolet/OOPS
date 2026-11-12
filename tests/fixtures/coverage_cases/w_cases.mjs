// Fixture cases for tests/coverage_report.test.js. Plain data only (shape: scripts/coverage_report.mjs header).
const world = {clock: 0, holders: [
    {id: 'glade', kind: 'place', quantities: {temperature: 18}},
    {id: 'boar', kind: 'body', place: 'glade', quantities: {vitality: 12}, properties: {alive: true}}]};
const sentence = {verb: 'remove', object: 'vitality', target: 'line', time: 'instant', carrier: 'gu', cost: 'essence-primeval', limits: []};
const details = {target: {shape: 'holder', id: 'boar'}, amount: 5};

// Neither pack's quantities are in the explicit shared vocabulary. The configured
// good exists only when the market pack reads its settings.
export const configured = {
    engine: {
        packs: ['l.living_body', 'm.market'],
        settings: {'m.market': {goods: ['herb']}},
        shared: {quantities: [
            {id: 'vitality', unit: 'vitality', min: 0, max: 20},
            {id: 'rainwater', unit: 'cup', max: 10},
        ], properties: [{id: 'ready', type: 'flag'}], effectKinds: ['fixture.checked']},
        dials: {chainCap: 3},
    },
    world: {holders: [
        {id: 'stall', kind: 'place', quantities: {'stock.herb': 2, rainwater: 1}},
        {id: 'boar', kind: 'body', place: 'stall', quantities: {vitality: 12, satiety: 3}, properties: {ready: true}},
    ]},
    sentence, details,
    expect: [
        {holder: 'boar', quantity: 'vitality', direction: 'down', to: 7},
        {holder: 'boar', quantity: 'satiety', direction: 'unchanged', to: 3},
        {holder: 'stall', quantity: 'stock.herb', direction: 'unchanged', to: 2},
    ],
};

export function coverageCase(id) {
    if (id === 'configured') return structuredClone(configured);
    if (id === 'cut') return {world, sentence, details, expect: [{holder: 'boar', quantity: 'vitality', direction: 'down', amount: 5}]};
    if (id === 'wrong-direction') return {world, sentence, details, expect: [{holder: 'boar', quantity: 'vitality', direction: 'up'}]};
    if (id === 'label') return {world, sentence, details, expect: [{holder: 'boar', verb: 'remove', object: 'vitality', direction: 'down'}]};
    if (id === 'working') return {world, working: {id: 'x'}, expect: [{holder: 'boar', quantity: 'vitality', direction: 'down'}]};
    if (id === 'needs-key') return {world, sentence: {...sentence, verb: 'add', object: 'light'}, details, expect: [{holder: 'glade', quantity: 'light:moon', direction: 'up'}]};
    if (id === 'throws') throw new Error('boom');
    throw new Error(`no case ${id}`);
}
