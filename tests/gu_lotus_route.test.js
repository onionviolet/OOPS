import test from 'node:test';
import assert from 'node:assert/strict';
import {keeperLotus, keeperLotusOptions, LOTUS_DIALS, LOTUS_SPRINGS, readKeeperLotus} from '../src/gu_keeper_lotus_route.js';
import {guKeeperLotusRoute} from '../src/world_packs/book_gu_keeper_lotus_route.js';
import {ENTRY_POINTS} from '../src/played_effects_domain.js';
import {landPlayed} from '../src/played_landing.js';
import {LOTUS_SENTENCE} from '../src/world_packs/gu_lotus_essence_case.js';

const state = () => ({clock: 0, worlds: {'book.ri.keeper.world': {facts: {}}},
    actors: {player: {completed: {}}}, simulation: {knowledge: {player: {}}, energies: {player: {
        'book.ri.keeper.primeval': {reserve: 8, policy: {capacity: 12}}}}}});

test('Lotus ledger starts with one steward-held living rank-three precursor and seven unspent sources', () => {
    const s = state(), row = readKeeperLotus(s), choices = keeperLotusOptions(s);
    assert.equal(row.world.gu[0].holder, 'book.ri.keeper.steward');
    assert.equal(row.world.gu[0].rank, 3);
    assert.equal(LOTUS_SPRINGS.length, 7);
    assert.equal(Object.values(row.springs).every(value => value === null), true);
    assert.equal(choices.buy_precursor, true);
    assert.equal(choices.begin, false);
    assert.equal(choices.use, false);
});

test('route commands expose the named price, duty, stage and daily cap dials', () => {
    const commands = guKeeperLotusRoute.commands;
    assert.equal(commands.filter(c => c.id.startsWith(`${keeperLotus}.draw_`)).length, 7);
    for (const spring of LOTUS_SPRINGS) {
        const command = commands.find(c => c.id === `${keeperLotus}.draw_${spring.id}`);
        assert.match(command.description, new RegExp(spring.custodian));
        assert.match(command.description, new RegExp(spring.obligation));
        assert.equal(command.duration, LOTUS_DIALS.springDutyMinutes);
        assert.deepEqual(command.costs, [{type: 'item', actor: 'player', key: '{"id":"book.ri.keeper.stone"}', amount: -1}]);
    }
    assert.equal(commands.filter(c => /\.stage_[1-7]$/.test(c.id)).length, 7);
    assert.match(commands.find(c => c.id === `${keeperLotus}.use`).description, /no stones/i);
});

test('a drained spring stays shut and a rank-one holder receives only the daily capped use', () => {
    const s = state(), row = readKeeperLotus(s);
    row.world.gu[0] = {...row.world.gu[0], kind: 'heavenly-essence-treasure-monarch-lotus',
        rank: 4, holder: 'player', uniqueKey: `${keeperLotus}.monarch`};
    row.springs.willow = 0;
    row.lastUseAt = 0;
    s.worlds['book.ri.keeper.world'].facts[`${keeperLotus}.ledger`] = JSON.stringify(row);
    s.clock = LOTUS_DIALS.useCadenceMinutes - 1;
    assert.equal(keeperLotusOptions(s).draw_willow, false);
    assert.equal(keeperLotusOptions(s).use, false);
    s.clock++;
    assert.equal(keeperLotusOptions(s).use, true);
    s.simulation.energies.player['book.ri.keeper.primeval'].reserve = 12;
    assert.equal(keeperLotusOptions(s).use, false);
});

test('the ledger row lands the Lotus case sentence', () => {
    const row = ENTRY_POINTS.find(entry => entry.ledgerKey === 'gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus');
    assert.deepEqual(row.build().steps[0].sentence, LOTUS_SENTENCE);
    assert.equal(landPlayed({entry: row.entry, law: row.law, ...row.build()}).landed, 1);
});
