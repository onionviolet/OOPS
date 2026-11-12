// Fixture cases for tests/coverage_report.test.js. Plain data only (shape: scripts/coverage_report.mjs header).
const world = {clock: 0, holders: [
    {id: 'glade', kind: 'place', quantities: {temperature: 18}},
    {id: 'boar', kind: 'body', place: 'glade', quantities: {vitality: 12}, properties: {alive: true}}]};
const sentence = {verb: 'remove', object: 'vitality', target: 'line', time: 'instant', carrier: 'gu', cost: 'essence-primeval', limits: []};
const details = {target: {shape: 'holder', id: 'boar'}, amount: 5};

export function coverageCase(id) {
    if (id === 'cut') return {world, sentence, details, expect: [{holder: 'boar', quantity: 'vitality', direction: 'down', amount: 5}]};
    if (id === 'wrong-direction') return {world, sentence, details, expect: [{holder: 'boar', quantity: 'vitality', direction: 'up'}]};
    if (id === 'label') return {world, sentence, details, expect: [{holder: 'boar', verb: 'remove', object: 'vitality', direction: 'down'}]};
    if (id === 'working') return {world, working: {id: 'x'}, expect: [{holder: 'boar', quantity: 'vitality', direction: 'down'}]};
    if (id === 'needs-key') return {world, sentence: {...sentence, verb: 'add', object: 'light'}, details, expect: [{holder: 'glade', quantity: 'light:moon', direction: 'up'}]};
    if (id === 'throws') throw new Error('boom');
    throw new Error(`no case ${id}`);
}
