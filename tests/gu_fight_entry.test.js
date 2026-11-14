// Gu fight slice (proposal; handoff A1/A2, CBD41, CBD63, FLR4): a contest whose
// fighters are built from the Gu each person keeps in the engine world, a typed
// line for every row including a move that was paid for and came to nothing,
// and a consequence that an existing working then reads from the same world.
// The world setup follows tests/gu_moonblade_contest.test.js. Each fight runs once.
import assert from 'node:assert/strict';
import test from 'node:test';
import {beginContest} from '../src/contest.js';
import {GU_CONTEST, GU_ESSENCE} from '../src/contest_packs/gu_world.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GU_MOONBLADE_GUARD, raiseJadeSkin, stepMoonbladeContest} from '../src/world_packs/gu_moonblade_contest.js';
import {sharedProperties, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {GU_FIGHT_LABELS, GU_FIGHT_MOVES, guEntrantFromWorld, guFightCarry, guFightMeans, guKept} from '../src/world_packs/gu_fight_entry.js';
import {FIGHT_ROW_TYPES, fightAccount, fightLines, fightResult, shownLine} from '../src/fight_text.js';

const config = {packs: ['c.contest', 'l.living_body'], host: {laws: [GU_MOONBLADE_GUARD]}, shared: {
    quantities: [GU_ESSENCE, WORLD_QUANTITIES.stock], properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES]}};
const body = (id, essence) => ({id, kind: 'body', as: ['operator'], place: 'ring', quantities: {vitality: 40, primeval_essence: essence}});
const gu = (id, kind, keeper, satiety = 30) => ({...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'ring', satiety}),
    properties: {alive: true, gu_kind: kind, gu_controller: keeper, gu_keeper: keeper}});
// The world's words for moves, means and parts; the caller adds the seat and the people in this fight.
const LABELS = Object.freeze({seat: 'artist', names: {rival: 'the rival'}, ...GU_FIGHT_LABELS});
const ENGINE_WORDS = /little_light|moonlight_gu|primeval_essence|surrender_accepted|undefined|null|\bNaN\b|artist|rival-moon/;
const stats = {attack: 1_000, evasion: 1}; // caller's numbers: no owner derives them from a body yet
const json = v => JSON.parse(JSON.stringify(v));

function world({essence = 8, moonFed = 30, lightKeeper = 'artist'} = {}) {
    return createEngineWorld({...config, holders: [{id: 'ring', kind: 'place'}, body('artist', essence), body('rival', 8),
        gu('moon', 'moonlight', 'artist', moonFed), gu('light', 'little-light', lightKeeper), gu('jade', 'jade-skin', 'artist'),
        gu('rival-moon', 'moonlight', 'rival')]});
}
function fight(options) {
    let engine = world(options);
    const before = engine.world;
    const entrants = [guEntrantFromWorld(engine.world, 'artist', stats), guEntrantFromWorld(engine.world, 'rival', stats)];
    let record = beginContest(GU_CONTEST, {id: 'ring', seed: 2, place: 'ring', entrants}, engine.world);
    engine = raiseJadeSkin(engine, {id: 'guard', operator: 'artist', guard: 'jade'});
    for (let n = 0; n < 60 && !record.result; n += 1) {
        const next = stepMoonbladeContest(record, engine, {startedAt: 0, ticksPerMinute: 6});
        assert.equal(next.pending, undefined);
        ({record, engine} = next);
    }
    assert.ok(record.result, 'the fight ends');
    return {before, engine, record, entrants};
}
const fed = fight(), hungry = fight({moonFed: 2});

test('fighters are built from the Gu each person keeps in the world', () => {
    const [artist, rival] = fed.entrants;
    assert.deepEqual(artist.moves, ['little_light_moonblade', 'moonlight_gu']);
    assert.deepEqual(artist.profile.gu.map(g => g.kind), ['jade-skin', 'little-light', 'moonlight']);
    assert.deepEqual(rival.moves, ['moonlight_gu']);
    // Controlled variation: the Little Light Gu is in someone else's keeping, so the combined move is not brought.
    const lent = world({lightKeeper: 'rival'}).world;
    assert.deepEqual(guEntrantFromWorld(lent, 'artist', stats).moves, ['moonlight_gu']);
    assert.deepEqual(guKept(lent, 'rival').map(h => h.id), ['light', 'rival-moon']);
    assert.throws(() => guEntrantFromWorld(world().world, 'artist', {attack: 1}), /attack and evasion/);
});

test('every row of the fight has a type and a line, and no engine word reaches a line', () => {
    for (const run of [fed, hungry]) {
        const account = fightAccount(run.record.log, LABELS);
        assert.equal(account.length, run.record.log.length);
        for (const row of account) {
            assert.ok(FIGHT_ROW_TYPES.includes(row.type), row.type);
            assert.ok(typeof row.text === 'string' && row.text.length > 0, `${row.type} has a line`);
            assert.doesNotMatch(row.text, ENGINE_WORDS);
        }
    }
    assert.deepEqual(fightAccount(fed.record.log, LABELS).map(r => r.type), ['blocked', 'hit', 'interrupted', 'out']);
    assert.deepEqual(fightLines(fed.record.log, LABELS).map(shownLine), [
        'The rival: moonblade blocked by you. 4 primeval essence spent.', 'You: little-light moonblade hits the rival.',
        'The rival: interrupted by you.', 'You: yielded.']);
    // He landed the blow and then had nothing left to follow it with: one essence, and no move that it buys.
    assert.equal(fed.record.result.outcomes.artist, 'yielded');
    assert.equal(fed.engine.world.holders.rival.quantities.vitality, 12);
});

test('a move that was paid for and came to nothing says so, with its cost', () => {
    assert.equal(hungry.engine.world.holders.moon.quantities.satiety, 0, 'the Moonlight Gu went hungry before the release');
    const failed = fightAccount(hungry.record.log, LABELS).find(r => r.type === 'failed');
    assert.equal(failed.text, 'You: little-light moonblade fails. 1 primeval essence spent.');
    assert.deepEqual(failed.spent, {primeval_essence: 1});
    assert.equal(hungry.record.result.outcomes.artist, 'yielded');
    const result = fightResult({place: 'The ring', seconds: hungry.record.result.at / 10, outcomes: hungry.record.result.outcomes,
        rows: hungry.record.log, means: guFightMeans(hungry.before, hungry.engine.world, 'artist')}, LABELS);
    assert.equal(result.head, 'The ring. 1.2 seconds. You: yielded.');
    assert.equal(Object.fromEntries(result.items).Spent, 'Primeval essence 3 of 8.');
});

test('the fight leaves typed consequences in the world, and the next working reads them', () => {
    const carry = guFightCarry(fed.record, fed.before, fed.engine.world);
    assert.deepEqual(carry.filter(r => r.who === 'artist' && r.kind !== 'hungrier'), [
        {kind: 'ended', who: 'artist', outcome: 'yielded'},
        {kind: 'spent', who: 'artist', quantity: 'primeval_essence', amount: 7, left: 1}]);
    assert.deepEqual(carry.find(r => r.who === 'rival' && r.kind === 'hurt'), {kind: 'hurt', who: 'rival', quantity: 'vitality', amount: 28, left: 12});
    assert.ok(guFightCarry(hungry.record, hungry.before, hungry.engine.world).some(r => r.kind === 'hungrier' && r.gu === 'moon' && r.starved));
    // An existing consumer: the Jade Skin working, which funded a guard before this fight, now refuses for lack of essence.
    const raise = engine => advanceEngineWorld(raiseJadeSkin(engine, {id: 'guard-after', operator: 'artist', guard: 'jade'}), engine.world.clock + 3).engine;
    const after = raise(fed.engine);
    assert.equal(after.records.workings['guard-after'].record.status, 'interrupted');
    assert.match(json(after.records.workings['guard-after'].record.receipts).map(r => r.reason).join(' '), /not enough essence to raise Jade Skin/);
    const unfought = raise(world());
    assert.equal(unfought.records.workings['guard-after'].record.status, 'complete');
});

test('the consequences survive a save and reload of the world', () => {
    const restored = restoreEngineWorld(json(serializeEngineWorld(fed.engine)), config);
    assert.deepEqual(guFightCarry(fed.record, fed.before, restored.world), guFightCarry(fed.record, fed.before, fed.engine.world));
    assert.equal(restored.world.holders.artist.quantities.primeval_essence, 1);
    const fedAgain = applyEngineOps(restored, [{op: 'set', holder: 'artist', quantity: 'primeval_essence', amount: 8}], 'fixture:rested');
    assert.equal(fedAgain.world.holders.artist.quantities.primeval_essence, 8);
});

test('the world names every Gu move it can bring, and a result can take an engine\'s own turning lines', () => {
    for (const row of GU_FIGHT_MOVES) assert.equal(typeof GU_FIGHT_LABELS.moves[row.move], 'string', row.move);
    // Waiting, backing off and yielding are the engine's own moves in every world; fight_text.js words those by type.
    for (const id of Object.keys(GU_CONTEST.moves).filter(id => !['wait', 'withdraw', 'yield'].includes(id)))
        assert.equal(typeof GU_FIGHT_LABELS.moves[id], 'string', `${id} has a player word`);
    // The tempo fight keeps sentences, not typed rows: it passes its own lines and no rows.
    const result = fightResult({place: 'Iron Cross Street', outcomes: {player: 'stood'}, rows: [], asked: 2,
        means: [{id: 'health', before: 30, after: 12.6}, {id: 'loaded', before: 2, after: 1}],
        turning: ['Your chambers are empty.', 'Your chambers are empty.']},
    {seat: 'player', life: 'health', names: {}, moves: {}, means: {health: 'Health', loaded: 'Rounds loaded'}, parts: {}});
    assert.equal(result.head, 'Iron Cross Street. You: standing.');
    assert.deepEqual(result.items, [['Spent', 'Rounds loaded 1 of 2.'], ['Hurt', 'Health 12.6 of 30.'], ['Asked', '2 decisions.']]);
    assert.deepEqual(result.turning, ['Your chambers are empty.']);
});
