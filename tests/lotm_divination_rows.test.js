import test from 'node:test';
import assert from 'node:assert/strict';
import {defineDivinations, quoteDivinations} from '../src/cast_divination_adapter.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
import {LOTM_DIVINATION_ROWS, LOTM_DIVINATION_FACTS, LOTM_DIVINATION_GAPS} from '../src/lotm_divination_rows.js';

const binding = {worldId: LOTM_IDS.world, group: 'book_lotm', situationId: LOTM_IDS.situation};
const commands = defineDivinations(LOTM_DIVINATION_ROWS, binding);

test('source rows compile with distinct identities, indexed locators and host support facts', () => {
    assert.equal(LOTM_DIVINATION_ROWS.queries.length, 3);
    assert.equal(commands.length, 11);
    assert.equal(new Set(commands.map(command => command.id)).size, commands.length);
    for (const row of LOTM_DIVINATION_ROWS.queries) {
        assert.match(row.id, /^lotm\.div\./);
        assert.match(row.targetId, /^lotm\.div\.target\./);
        assert.match(row.locator, /^zh \u7b2c\d+\u7ae0 p\d+$/);
        assert.equal(row.ritual, undefined, 'no invented stand-in ritual structure');
        assert.equal(row.place, undefined, 'no invented registered place');
        for (const rule of [row.means, row.contact]) {
            assert.match(rule.fact, /^actor\.lotm\.div\.(means|contact)\./);
            assert.equal(rule.op, 'eq');
            assert.equal(rule.value, true);
            assert.ok(rule.reason);
        }
        for (const step of row.steps) assert.equal(step.costs, undefined, 'no source-stated spent stock');
    }
    assert.deepEqual(LOTM_DIVINATION_FACTS, [...new Set(LOTM_DIVINATION_ROWS.queries.flatMap(row => [row.means.fact, row.contact.fact]))]);
    for (const command of commands) {
        assert.equal(command.worldId, LOTM_IDS.world);
        assert.equal(command.group, 'book_lotm');
        assert.deepEqual(command.costs, []);
    }
    const statuses = LOTM_DIVINATION_ROWS.queries.flatMap(row => row.steps.filter(step => step.kind === 'attempt').map(step => [row.id, step.status]));
    assert.deepEqual(statuses, [['lotm.div.coin-divination', 'signal'], ['lotm.div.cane-dowsing', 'obscured']]);
});

test('quotes are pure and keep signals and interpretations private until received by their observer', () => {
    const state = {simulation: {seed: 37, knowledge: {other: {}}}};
    const privateText = LOTM_DIVINATION_ROWS.queries.flatMap(row => row.steps.flatMap(step => [step.signal, step.belief].filter(Boolean)));
    for (const command of commands) {
        for (const effect of command.effects.filter(effect => effect.type === 'knowledge')) {
            state.simulation.knowledge.other[effect.key] = {value: effect.value};
        }
    }
    const before = JSON.stringify(state);
    for (let i = 0; i < 3; i++) {
        const quotes = quoteDivinations(state, commands, command => ({visible: true, eligible: true, costs: command.costs, duration: command.duration, reasons: []}));
        assert.equal(quotes.length, commands.length);
        const serialized = JSON.stringify(quotes);
        for (const value of privateText) assert.ok(!serialized.includes(value), 'another observer\'s signal or belief must not appear');
        assert.ok(!serialized.includes('"effects"'));
    }
    assert.equal(JSON.stringify(state), before);
    const attempt = commands.find(command => command.divination.kind === 'attempt');
    const signal = attempt.effects.find(effect => effect.key.endsWith('.signal'));
    state.simulation.knowledge.player = {[signal.key]: {value: signal.value}};
    const [quote] = quoteDivinations(state, [attempt], command => ({visible: true, eligible: true, costs: command.costs, reasons: []}));
    assert.equal(quote.signal, signal.value, 'the receiving observer can read the actual signal');
});

test('the merged altar procedure records an unknown outcome without inventing a signal', () => {
    const altar = LOTM_DIVINATION_ROWS.queries.find(row => row.id === 'lotm.div.altar-search-divination');
    assert.deepEqual(altar.steps.map(step => step.kind), ['prepare', 'rite', 'rite', 'unknown']);
    for (const step of altar.steps) {
        assert.equal(step.signal, undefined);
        assert.equal(step.belief, undefined);
        assert.equal(step.status, undefined);
    }
    const altarCommands = commands.filter(command => command.divination.queryId === altar.id);
    assert.ok(altarCommands.every(command => command.effects.every(effect => !/\.(signal|interpretation)$/.test(effect.key))));
    assert.equal(LOTM_DIVINATION_ROWS.queries.filter(row => row.id.includes('altar')).length, 1);
});

test('messenger, demonstration, teaching and club gaps stay outside the query set', () => {
    const required = ['lotm.rite.copper-whistle-summon', 'lotm.rite.copper-whistle-messenger', 'lotm.craft.pendulum-divination', 'lotm.rite.mirror-divination'];
    const ids = new Set(LOTM_DIVINATION_ROWS.queries.map(row => row.id));
    for (const id of required) assert.ok(LOTM_DIVINATION_GAPS.some(gap => gap.id === id));
    for (const gap of LOTM_DIVINATION_GAPS) {
        assert.ok(gap.reason);
        assert.ok(!ids.has(gap.id));
        assert.ok(!ids.has(`lotm.div.${gap.id.split('.').at(-1)}`));
    }
});
