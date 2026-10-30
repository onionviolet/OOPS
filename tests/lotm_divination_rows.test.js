import test from 'node:test';
import assert from 'node:assert/strict';
import {defineDivinations, quoteDivinations} from '../src/cast_divination_adapter.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
import {LOTM_DIVINATION_ROWS, LOTM_DIVINATION_FACTS, LOTM_DIVINATION_GAPS, LOTM_DIVINATION_OCCASIONS} from '../src/lotm_divination_rows.js';

const binding = {worldId: LOTM_IDS.world, group: 'book_lotm', situationId: LOTM_IDS.situation};
const commands = defineDivinations(LOTM_DIVINATION_ROWS, binding);

test('each row names the fact its answer turns on, and an unsupported answer reads as unclear', () => {
    for (const row of LOTM_DIVINATION_ROWS.queries) {
        assert.match(row.grounds.fact, /^actor\.lotm\.div\.grounds\./);
        assert.equal(row.grounds.source, row.locator, 'the answer cites its source scene');
        const step = row.steps.find(x => x.kind === 'attempt');
        if (!step) continue; // a row with only unknown stages has no signal to ground
        const ask = commands.find(c => c.id === `${row.id}.${step.id}`), unclear = commands.find(c => c.id === `${row.id}.${step.id}.unclear`);
        assert.ok(ask && unclear, `${row.id} has supported and unclear attempts`);
        assert.ok(JSON.stringify(ask.requires).includes(`"fact":"${row.grounds.fact}","op":"eq","value":true`), 'supported needs the held fact');
        assert.ok(JSON.stringify(unclear.requires).includes(`"fact":"${row.grounds.fact}","op":"eq","value":false`), 'unclear needs the named state false, never an absent fact');
        const effect = unclear.effects.find(e => e.key === `divination.${row.id}.signal`);
        assert.match(effect.value, /nothing you know bears/);
        assert.equal(effect.basis.status, 'unanswered');
    }
});

test('source rows compile with distinct identities, indexed locators and host support facts', () => {
    for (const id of ['lotm.div.coin-divination', 'lotm.div.cane-dowsing', 'lotm.div.altar-search-divination']) assert.ok(LOTM_DIVINATION_ROWS.queries.some(row => row.id === id), `${id} keeps its published id`);
    assert.equal(commands.length, LOTM_DIVINATION_ROWS.queries.reduce((n, row) => n + row.steps.length + row.steps.filter(step => ['attempt', 'interpret'].includes(step.kind)).length, 0), 'every attempt and interpret step also has an unclear twin');
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
    assert.deepEqual(LOTM_DIVINATION_FACTS, [...new Set(LOTM_DIVINATION_ROWS.queries.flatMap(row => [row.means.fact, row.contact.fact, row.grounds.fact]))]);
    for (const command of commands) {
        assert.equal(command.worldId, LOTM_IDS.world);
        assert.equal(command.group, 'book_lotm');
        assert.deepEqual(command.costs, []);
    }
    const statuses = LOTM_DIVINATION_ROWS.queries.flatMap(row => row.steps.filter(step => step.kind === 'attempt').map(step => [row.id, step.status]));
    assert.deepEqual(statuses, [
        ['lotm.div.coin-divination', 'signal'], ['lotm.div.cane-dowsing', 'obscured'],
        ...['dream-divination', 'pendulum-divination', 'coin-divination-club', 'astrological-chart', 'tarot-divination', 'numerology'].map(slug => [`lotm.div.${slug}`, 'signal']),
    ]);
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
    for (const attempt of commands.filter(command => command.divination.kind === 'attempt')) {
        const signal = attempt.effects.find(effect => effect.key.endsWith('.signal'));
        state.simulation.knowledge.player = {[signal.key]: {value: signal.value}};
        const [quote] = quoteDivinations(state, [attempt], command => ({visible: true, eligible: true, costs: command.costs, reasons: []}));
        assert.equal(quote.signal, signal.value, 'the receiving observer can read the actual signal');
    }
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

test('unperformed methods, messenger and demonstration gaps stay outside the query set', () => {
    const required = ['lotm.rite.copper-whistle-summon', 'lotm.rite.copper-whistle-messenger', 'lotm.craft.pendulum-divination', 'lotm.rite.mirror-divination', 'lotm.craft.child-locating', 'lotm.rite.blood-kin-search'];
    const ids = new Set(LOTM_DIVINATION_ROWS.queries.map(row => row.id));
    for (const id of required) assert.ok(LOTM_DIVINATION_GAPS.some(gap => gap.id === id));
    for (const gap of LOTM_DIVINATION_GAPS) {
        assert.ok(gap.reason);
        assert.ok(!ids.has(gap.id));
    }
});

test('each added method has one performed query with a stated reading', () => {
    const added = LOTM_DIVINATION_ROWS.queries.slice(3);
    assert.equal(new Set(added.map(row => row.method)).size, added.length);
    for (const row of added) {
        assert.deepEqual(row.steps.map(step => step.kind), ['prepare', 'attempt', 'interpret']);
        const attempt = row.steps.find(step => step.kind === 'attempt');
        const interpretation = row.steps.find(step => step.kind === 'interpret');
        assert.ok(['signal', 'obscured'].includes(attempt.status));
        assert.ok(attempt.signal);
        assert.match(interpretation.belief, /^I /, 'the reading belongs to the lead rather than asserting hidden truth');
    }
    const club = added.find(row => row.id === 'lotm.div.coin-divination-club');
    assert.equal(club.locator, 'zh \u7b2c115\u7ae0 p21');
    assert.match(club.steps[1].signal, /face is not recorded/);
    assert.ok(!LOTM_DIVINATION_GAPS.some(gap => gap.id === 'lotm.craft.coin-divination.club'));
});

test('secondary occasions retain their query binding, source anchor and incomplete statuses', () => {
    const ids = new Set(LOTM_DIVINATION_ROWS.queries.map(row => row.id));
    const anchors = new Set();
    for (const occasion of LOTM_DIVINATION_OCCASIONS) {
        assert.deepEqual(Object.keys(occasion).sort(), ['locator', 'queryId', 'question', 'status']);
        assert.ok(ids.has(occasion.queryId));
        assert.match(occasion.locator, /^zh (?:b[2-8] )?\u7b2c\d+\u7ae0 p\d+$/);
        assert.ok(occasion.question);
        assert.ok(['signal', 'obscured', 'unanswered', 'unknown'].includes(occasion.status));
        const key = `${occasion.queryId}:${occasion.locator}`;
        assert.ok(!anchors.has(key));
        anchors.add(key);
        const query = LOTM_DIVINATION_ROWS.queries.find(row => row.id === occasion.queryId);
        assert.notEqual(occasion.locator, query.locator, 'the primary occasion is already represented by its runnable query');
    }
});
