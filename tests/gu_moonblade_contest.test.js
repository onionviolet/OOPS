import assert from 'node:assert/strict';
import test from 'node:test';
import {beginContest, handoffContest, prepareContestHandoff, restoreContest, serializeContest} from '../src/contest.js';
import {GU_CONTEST, GU_ESSENCE} from '../src/contest_packs/gu_world.js';
import {applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {guBodyCase} from '../src/world_packs/gu_body_cases.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_MOONBLADE_GUARD, raiseJadeSkin, stepMoonbladeContest} from '../src/world_packs/gu_moonblade_contest.js';
import {sharedProperties, WORLD_QUANTITIES} from '../src/world_quantities.js';

const config = {packs: ['c.contest', 'l.living_body'], host: {laws: [GU_MOONBLADE_GUARD]}, shared: {
    quantities: [GU_ESSENCE, WORLD_QUANTITIES.stock], properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES],
}};
const body = (id, essence) => ({id, kind: 'body', as: ['operator'], place: 'ring',
    quantities: {vitality: 40, primeval_essence: essence}});
const gu = (id, kind, actor) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'ring', satiety: 30}),
    properties: {alive: true, gu_kind: kind, gu_controller: actor, gu_keeper: actor}});
const profile = (...specimens) => ({attack: 1_000, evasion: 1, gu: specimens.map(([id, kind]) => ({id, kind, rank: 1}))});
const artist = 'artist', rival = 'rival';
const combo = 'little_light_moonblade', ordinary = 'moonlight_gu';
const timed = {startedAt: 0, ticksPerMinute: 6};

function start({guarded = false} = {}) {
    const engine = createEngineWorld({...config, holders: [{id: 'ring', kind: 'place'},
        body(artist, 12), body(rival, 8), gu('moon', 'moonlight', artist), gu('light', 'little-light', artist),
        gu('rival-moon', 'moonlight', rival), gu('jade', 'jade-skin', artist)]});
    const entrants = [
        {id: artist, body: artist, side: artist, moves: [combo], profile: profile(['moon', 'moonlight'], ['light', 'little-light'])},
        {id: rival, body: rival, side: rival, moves: [ordinary], profile: profile(['rival-moon', 'moonlight'])},
    ];
    const record = beginContest(GU_CONTEST, {id: 'ring', seed: 2, place: 'ring', entrants}, engine.world);
    return {engine: guarded ? raiseJadeSkin(engine, {id: 'guard', operator: artist, guard: 'jade'}) : engine, record};
}

function until(state, condition, clock = timed) {
    for (let index = 0; index < 25; index++) {
        if (condition(state)) return state;
        assert.equal(state.record.result, null);
        state = stepMoonbladeContest(state.record, state.engine, clock);
        assert.equal(state.pending, undefined);
    }
    assert.fail('The exchange did not reach the expected step.');
}

const moveLog = (state, move) => state.record.log.find(row => row.move === move);
const amount = (state, who, quantity) => state.engine.world.holders[who].quantities[quantity];
const funds = (state, who) => amount(state, who, 'primeval_essence');
const health = (state, who) => amount(state, who, 'vitality');
const ready = state => state.record.entrants[artist].working?.cursor === 1;
const json = value => JSON.parse(JSON.stringify(value));
const restore = ({engine, record}) => ({engine: restoreEngineWorld(json(serializeEngineWorld(engine)), config),
    record: restoreContest(GU_CONTEST, json(serializeContest(record)))});

test('a faster Moonblade interrupts a prepared killer move, and timely Jade Skin preserves it', () => {
    const exposed = until(start(), state => moveLog(state, 'interrupted'));
    assert.equal(moveLog(exposed, 'interrupted').actor, artist);
    assert.equal(moveLog(exposed, ordinary).outcome, 'hit');
    assert.equal(health(exposed, artist), 26);
    assert.equal(funds(exposed, rival), 4);
    assert.equal(funds(exposed, artist), 12);
    assert.equal(moveLog(exposed, combo), undefined);

    const guarded = until(start({guarded: true}), ready);
    assert.equal(guarded.engine.world.clock, 1);
    const finish = state => until(state, candidate => moveLog(candidate, combo));
    const result = finish(restore(guarded));
    const straight = finish(guarded);
    assert.deepEqual(serializeEngineWorld(result.engine), serializeEngineWorld(straight.engine));
    assert.deepEqual(result.record, straight.record);
    assert.equal(moveLog(result, ordinary).outcome, 'blocked');
    assert.equal(moveLog(result, combo).outcome, 'hit');
    assert.equal(health(result, artist), 40);
    assert.equal(health(result, rival), 12);
    assert.equal(funds(result, artist), 5);
    assert.equal(funds(result, rival), 4);
});

test('an expired guard retains its cost and leaves the artist exposed at contact', () => {
    const result = until(start({guarded: true}), state => moveLog(state, 'interrupted'), {startedAt: 0, ticksPerMinute: 3});
    assert.equal(result.engine.world.clock, 3);
    assert.equal(result.engine.records.workings.guard.record.status, 'complete');
    assert.deepEqual(result.engine.world.laws, []);
    assert.equal(health(result, artist), 26);
    assert.equal(funds(result, artist), 10);
    assert.equal(funds(result, rival), 4);
});

test('a guard that loses its funding cannot protect a contest entrant', () => {
    const state = until(start({guarded: true}), candidate => candidate.record.entrants[artist].working?.status === 'running');
    state.engine = applyEngineOps(state.engine, [
        {op: 'set', holder: artist, quantity: 'primeval_essence', amount: 1},
    ], 'fixture:spent-elsewhere');
    const result = until(restore(state), candidate => moveLog(candidate, ordinary));
    assert.equal(result.engine.records.workings.guard.record.status, 'interrupted');
    assert.equal(moveLog(result, ordinary).outcome, 'hit');
    assert.equal(health(result, artist), 26);
    assert.equal(funds(result, artist), 1);
    assert.deepEqual(result.engine.world.laws, []);
});

test('a support Gu that goes hungry after preparation cannot power the release', () => {
    const state = start({guarded: true});
    state.engine = applyEngineOps(state.engine, [{op: 'set', holder: 'light', quantity: 'satiety', amount: 2}], 'fixture:short-ration');
    const prepared = until(state, ready);
    assert.equal(amount(prepared, 'light', 'satiety'), 1);
    const result = until(restore(prepared), candidate => moveLog(candidate, combo));
    assert.equal(amount(result, 'light', 'satiety'), 0);
    assert.equal(moveLog(result, ordinary).outcome, 'blocked');
    assert.equal(moveLog(result, combo).outcome, 'failed');
    assert.equal(health(result, rival), 40);
    assert.equal(funds(result, artist), 10);
});

test('feeding Moonlight Gu between contest steps saves the pending killer move', () => {
    const meal = guBodyCase('moonlight');
    const [petals] = meal.knownStock;
    const state = start({guarded: true});
    state.engine = applyEngineOps(state.engine, [
        {op: 'set', holder: 'moon', quantity: 'satiety', amount: 2},
        {op: 'holder_add', value: {id: 'pouch', kind: 'thing', place: 'ring', quantities: {[petals]: meal.mealAmount}}},
    ], 'fixture:short-ration');
    const prepared = until(state, ready);
    assert.equal(prepared.engine.world.clock, 1);
    assert.equal(amount(prepared, 'moon', 'satiety'), 1);
    const finish = state => until(state, candidate => moveLog(candidate, combo));
    const hungry = finish(restore(prepared));
    assert.equal(moveLog(hungry, combo).outcome, 'failed');
    assert.equal(amount(hungry, 'moon', 'satiety'), 0);
    assert.equal(amount(hungry, 'pouch', petals), meal.mealAmount);
    assert.equal(health(hungry, rival), 40);
    assert.equal(funds(prepared, artist), 10);
    assert.equal(funds(hungry, artist), 9);

    const feed = state => ({...state, engine: applyEngineOps(state.engine,
        meal.mealOps(state.engine.world, 'moon', 'pouch'), 'fixture:feed-between-steps')});
    const fed = finish(restore(feed(restore(prepared))));
    const direct = finish(feed(prepared));
    assert.deepEqual(fed.record, direct.record);
    assert.deepEqual(serializeEngineWorld(fed.engine), serializeEngineWorld(direct.engine));
    assert.equal(amount(fed, 'pouch', petals), 0);
    assert.equal(fed.engine.world.holders.moon.properties.gu_controller, artist);
    assert.equal(moveLog(fed, combo).outcome, 'hit');
    assert.equal(health(fed, rival), 12);
    assert.equal(funds(fed, artist), 5);
});

test('a local ally takes over a live contest with their own Gu and essence', () => {
    const prepared = until(start(), ready);
    const ally = {id: 'ally', body: 'ally', side: artist, moves: [ordinary], profile: profile(['ally-moon', 'moonlight'])};
    const tryHandoff = (state, incoming = ally) => handoffContest(GU_CONTEST, state.record, state.engine.world,
        {outgoing: artist, incoming});
    assert.equal(tryHandoff(prepared).record, prepared.record);
    prepared.engine = applyEngineOps(prepared.engine, [
        {op: 'holder_add', value: body('ally', 8)},
        {op: 'holder_add', value: gu('ally-moon', 'moonlight', 'ally')},
    ], 'fixture:local-ally');
    assert.equal(tryHandoff(prepared, {...ally, side: rival}).record, prepared.record);
    const swapped = {...prepared, ...tryHandoff(prepared)};
    assert.equal(swapped.record.clock, prepared.record.clock);
    assert.equal(swapped.record.entrants[artist].status, 'out');
    assert.equal(swapped.record.entrants[artist].working.status, 'interrupted');
    assert.deepEqual(swapped.record.entrants[rival].working, prepared.record.entrants[rival].working);
    const finish = state => until(state, candidate => candidate.record.log.some(row =>
        row.actor === 'ally' && row.move === ordinary && row.outcome === 'hit'));
    const direct = finish(swapped);
    const restored = finish(restore(swapped));
    assert.deepEqual(restored.record, direct.record);
    assert.deepEqual(serializeEngineWorld(restored.engine), serializeEngineWorld(direct.engine));
    const rivalCast = restored.record.log.find(row => row.actor === rival && row.move === ordinary);
    assert.equal(rivalCast.target, artist);
    assert.equal(rivalCast.outcome, 'wasted');
    assert.equal(moveLog(restored, combo), undefined);
    assert.equal(health(restored, artist), 40);
    assert.equal(health(restored, rival), 26);
    assert.equal(funds(restored, artist), funds(prepared, artist));
    assert.equal(funds(restored, 'ally'), 4);
});

test('a timed handoff can be interrupted by the rival or complete under Jade Skin', () => {
    const ally = {id: 'ally', body: 'ally', side: artist, moves: [ordinary], profile: profile(['ally-moon', 'moonlight'])};
    const prepare = guarded => {
        const state = until(start({guarded}), ready);
        const engine = applyEngineOps(state.engine, [
            {op: 'holder_add', value: body('ally', 8)},
            {op: 'holder_add', value: gu('ally-moon', 'moonlight', 'ally')},
            {op: 'holder_add', value: {id: 'outside', kind: 'place'}},
        ], 'fixture:relief');
        const relief = prepareContestHandoff(GU_CONTEST, state.record, engine.world,
            {outgoing: artist, incoming: ally, ticks: 4});
        assert.equal(relief.reason, undefined);
        assert.equal(relief.record.entrants.ally, undefined);
        return {engine, record: relief.record};
    };
    const exposed = until(restore(prepare(false)), state => moveLog(state, 'interrupted'));
    assert.equal(health(exposed, artist), 26);
    assert.equal(exposed.record.entrants.ally, undefined);
    assert.equal(funds(exposed, 'ally'), 8);

    const guarded = prepare(true);
    const finish = state => until(state, candidate => candidate.record.log.some(row => row.actor === 'ally' && row.outcome === 'hit'));
    const success = finish(restore(guarded));
    const direct = finish(guarded);
    assert.deepEqual(success.record, direct.record);
    assert.deepEqual(serializeEngineWorld(success.engine), serializeEngineWorld(direct.engine));
    assert.equal(moveLog(success, ordinary).outcome, 'blocked');
    assert.equal(health(success, artist), 40);
    assert.equal(health(success, rival), 26);
    assert.equal(funds(success, artist), 10);
    assert.equal(funds(success, 'ally'), 4);

    const absent = {...guarded, engine: applyEngineOps(guarded.engine, [
        {op: 'move', holder: 'ally', to: 'outside'},
    ], 'fixture:ally-leaves')};
    const failed = until(restore(absent), state => state.record.log.some(row => row.move === 'handoff' && row.outcome === 'unavailable'));
    assert.equal(failed.record.entrants[artist].status, 'in');
    assert.equal(failed.record.entrants.ally, undefined);
    assert.equal(funds(failed, 'ally'), 8);
});
