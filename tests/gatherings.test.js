import test from 'node:test';
import assert from 'node:assert/strict';
import {defineGathering, meetsOn, seatsOn, trade, leave} from '../src/gatherings.js';
import {emptyPersonas, addPersona, changeStanding} from '../src/persona_standing.js';
import {buildEventBook} from '../src/world_events.js';

const row = () => ({id: 'fixture.meeting', world: 'fixture', label: 'Masked exchange', schedule: {everyDays: 3, offset: 2, hour: 20},
    seats: [{id: 'north', personaId: 'mask.north'}, {id: 'south', personaId: 'mask.south', minStanding: {region: 'fixture.port', atLeast: 5}}]});
const deal = () => ({from: 'north', to: 'south', give: {kind: 'fact', key: 'route'}, take: {kind: 'item', key: 'token', qty: 2}});

test('meeting schedule and dated event windows both apply', () => {
    const g = defineGathering({...row(), eventId: 'window'});
    const book = buildEventBook([{id: 'window', key: 'fixture.window', kind: 'public_event', placement: 'dated', scope: 'public', evidence: 'S', when: {day: 4, endDay: 8}}]);
    assert.deepEqual(Array.from({length: 10}, (_, d) => d).filter(d => meetsOn(g, d)), [2, 5, 8]);
    assert.deepEqual(Array.from({length: 12}, (_, d) => d).filter(d => meetsOn(g, d, {book})), [5, 8]);
    assert.equal(meetsOn(defineGathering(row()), 2, {book}), true);
    assert.equal(meetsOn(defineGathering({...row(), eventId: 'missing'}), 5, {book}), false);
    assert.throws(() => meetsOn(g, -1));
});

test('seat views conceal identities and honor absence and persona standing', () => {
    const g = defineGathering(row());
    let personas = addPersona(emptyPersonas(), {id: 'mask.south', bodyId: 'body.south'});
    personas = changeStanding(personas, 'mask.south', 'fixture.port', 4);
    assert.deepEqual(seatsOn(g, 5), [{seatId: 'north', label: 'north'}]);
    assert.deepEqual(seatsOn(g, 5, {personas}), [{seatId: 'north', label: 'north'}]);
    personas = changeStanding(personas, 'mask.south', 'fixture.port', 1);
    const snapshot = structuredClone(personas);
    assert.deepEqual(seatsOn(g, 5, {personas}), [{seatId: 'north', label: 'north'}, {seatId: 'south', label: 'south'}]);
    assert.deepEqual(seatsOn(g, 5, {personas, absent: ['mask.south']}), [{seatId: 'north', label: 'north'}]);
    assert.deepEqual(personas, snapshot);
});

test('trades return receipts without exposure or input mutation; each seat may reveal its persona', () => {
    const g = defineGathering(row()), state = {inventory: ['token']}, input = deal();
    const snapshot = structuredClone({state, input});
    const result = trade(g, state, input);
    assert.deepEqual(result, {ok: true, reasons: [], exchanged: {from: [input.take], to: [input.give]}, exposed: []});
    result.exchanged.from[0].qty = 99;
    assert.deepEqual({state, input}, snapshot);
    assert.deepEqual(trade(g, state, {...input, give: {...input.give, reveal: true}}).exposed, [{seatId: 'north', personaId: 'mask.north'}]);
    assert.deepEqual(trade(g, state, {...input, take: {...input.take, reveal: true}}).exposed, [{seatId: 'south', personaId: 'mask.south'}]);
    assert.equal(trade(g, state, {...input, give: {kind: 'favour', key: 'escort'}}).ok, true);
    assert.equal(trade(defineGathering({...row(), dial: {secrecy: 0.75}}), state, input).risk, 0.25);
});

test('refusals carry reasons and neither exchange nor expose identities', () => {
    const g = defineGathering(row());
    for(const patch of [{from: 'missing'}, {to: 'missing'}, {to: 'north'}, {give: null}, {take: {}}, {give: []}, {take: {kind: 'item', key: 'token', qty: 0}}]) {
        const result = trade(g, {}, {...deal(), ...patch});
        assert.equal(result.ok, false);
        assert.ok(result.reasons.length > 0 && result.reasons.every(r => typeof r === 'string' && r));
        assert.deepEqual(result.exchanged, {from: [], to: []});
        assert.deepEqual(result.exposed, []);
    }
});

test('leaving conceals the body unless that seat was deliberately revealed', () => {
    const g = defineGathering(row()), revealed = ['south'];
    assert.deepEqual(leave(g, 'north'), {seatId: 'north', bodyRevealed: false});
    assert.deepEqual(leave(g, 'north', {revealed}), {seatId: 'north', bodyRevealed: false});
    assert.deepEqual(leave(g, 'south', {revealed}), {seatId: 'south', bodyRevealed: true});
    assert.deepEqual(revealed, ['south']);
});

test('definitions validate and deeply freeze a detached clone', () => {
    const input = row(), g = defineGathering(input);
    assert.equal(g.dial.secrecy, 1);
    assert.ok(Object.isFrozen(g) && Object.isFrozen(g.schedule) && Object.isFrozen(g.seats[1].minStanding) && Object.isFrozen(g.dial));
    input.seats[0].id = 'changed';
    assert.equal(g.seats[0].id, 'north');
    assert.equal(Object.isFrozen(input.seats), false);
    for(const patch of [{id: 'bad id'}, {world: ''}, {eventId: '?'}, {schedule: {everyDays: 0, offset: 0, hour: 0}},
        {schedule: {everyDays: 1, offset: -1, hour: 0}}, {schedule: {everyDays: 1, offset: 0, hour: 24}}, {dial: {secrecy: 2}},
        {seats: [{id: 'same', personaId: 'one'}, {id: 'same', personaId: 'two'}]},
        {seats: [{id: 'one', personaId: 'same'}, {id: 'two', personaId: 'same'}]},
        {seats: [{id: 'one', personaId: 'mask', minStanding: {region: 'port', atLeast: NaN}}]}]) assert.throws(() => defineGathering({...row(), ...patch}));
});
