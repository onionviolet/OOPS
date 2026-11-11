// Outside the ordinary unit glob (boots the whole game, about a minute per case). Run explicitly:
//   node --test tests/headless/away_bank_equivalence.test.js
// TMR4 / TMR5 / TMR8 / TMR11 (FRC40, Melvor's offline replay): spending banked time must give the same canonical save as
// playing the same minutes. One save and one seed, two paths: live (the engine stepper, minute by minute) and the real
// away-bank spend (`awayBank.spend` through `fastForward`). Both start from a save that holds the same bank slice, so the
// one allowed difference is the bank itself: live play leaves it alone, the spend debits what the clock consumed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {boot, canonicalSave, diffSaves} from '../../scripts/headless/runner.mjs';
import {ROUTE, progress} from '../../scripts/headless/village_route.mjs';
import {firewoodFixture, WOOD_KEY, carriedWood} from '../helpers/household_firewood_fixture.mjs';
import {stockFirewoodAction} from '../../src/absorb_p23/household/model.js';

const SEED = 19;
const clockOf = game => game.internals.expansionState.clock;
const withBank = (save, minutes) => ({...structuredClone(save), awayBank: {schema: 1, bankedMinutes: minutes, remainderMs: 0}});

/** Live play: single ticks until the root clock moves by `minutes` or stops moving (a waiting choice). Ticks never run after a freeze. */
async function playLive(game, minutes) {
    const target = clockOf(game) + minutes;
    for(let idle = 0; clockOf(game) < target && idle < 3;) {
        const before = clockOf(game);
        game.ticks(1); // one tick at a time: a sleeping tick covers several minutes, and the spend stops on the same rule
        idle = clockOf(game) === before ? idle + 1 : 0;
    }
    await game.settle(0);
    return game.snapshot();
}

/** The real bank spend. fastForward rests on real elapsed time through a virtual timer, so a bounded pump drives it. */
async function spendBank(game, minutes) {
    let done = false, result, failure;
    globalThis.simulationTestHooks.command('awayBank', 'spend', minutes).then(r => {result = r;}, e => {failure = e;}).finally(() => {done = true;});
    for(let i = 0; i < 400 && !done; i++) await game.settle(50);
    assert.ok(done, 'the bank spend did not finish within the pump bound');
    if(failure) throw failure;
    return result;
}

/** Runs both paths from one start save and returns what the assertions need. */
async function bothPaths(start, minutes, {bank = minutes} = {}) {
    const save = withBank(start, bank);
    const live = await boot(structuredClone(save), {seed: SEED, heroName: null});
    let liveSnap, liveMoved;
    try {const c0 = clockOf(live); liveSnap = await playLive(live, minutes); liveMoved = clockOf(live) - c0; assert.deepEqual(live.errors, []);} finally {live.close();}
    const spend = await boot(structuredClone(save), {seed: SEED, heroName: null});
    try {
        const c0 = clockOf(spend), receipt = await spendBank(spend, bank > minutes ? minutes : bank);
        const snap = spend.snapshot(), recap = globalThis.simulationTestHooks.project('awayBank');
        assert.deepEqual(spend.errors, []);
        return {startClock: c0, startSave: save, liveSnap, liveMoved, spendSnap: snap, receipt, recap, spentMoved: clockOf(spend) - c0};
    } finally {spend.close();}
}

/** The one allowed difference (TMR5): the debit. Everything else must be byte-equal after canonicalisation. */
function assertSamePlay(r, label) {
    assert.equal(r.spentMoved, r.liveMoved, `${label}: the spend moved the root clock by what live play moved it`);
    assert.equal(r.receipt.consumed, r.liveMoved, `${label}: the bank debit is what the clock consumed`);
    const diffs = diffSaves(canonicalSave(r.liveSnap), canonicalSave(r.spendSnap), 40);
    const bankStart = r.startSave.awayBank.bankedMinutes;
    assert.deepEqual(diffs.map(d => d.path), bankStart === r.receipt.consumed ? ['/awayBank/bankedMinutes'] : ['/awayBank/bankedMinutes'],
        `${label}: only the bank slice may differ, got ${JSON.stringify(diffs)}`);
    assert.equal(r.spendSnap.awayBank.bankedMinutes, bankStart - r.receipt.consumed, `${label}: bank is start minus consumed`);
}
const nonVacuous = (a, b, label) => assert.notEqual(a, b, `${label}: the routine changed its own slice, so equality is not trivial`);

async function household(game) {
    await game.step(1); await game.click('button[data-place-tab="options"]'); game.$('#p23_household_panel').open = true;
}
async function householdAction(game, id) {
    await game.click('button[data-place-tab="options"]'); game.$('#p23_household_panel').open = true;
    const button = game.$$('[data-household-action]').find(el => el.dataset.householdAction === id);
    assert.ok(button, `native action ${id} exists`); await game.click(button);
}
/** A lit, supplied hearth: the household routine burns logs while time passes. */
async function hearthStart() {
    const game = await boot(null, {seed: SEED, heroName: null});
    try {
        await game.load(firewoodFixture(await game.save())); await household(game);
        for(let i = 0; i < 3; i++) await householdAction(game, stockFirewoodAction());
        await householdAction(game, 'supply_on'); await householdAction(game, 'light');
        return await game.save();
    } finally {game.close();}
}
const hearthState = s => JSON.stringify([s.household?.hearth, carriedWood(s, WOOD_KEY)]);

test('household hearth routine: 200 played minutes equal 200 spent minutes (TMR4, TMR5)', async () => {
    const start = await hearthStart();
    const r = await bothPaths(start, 200);
    nonVacuous(hearthState(start), hearthState(r.spendSnap), 'hearth');
    assertSamePlay(r, 'hearth');
    assert.equal(r.recap.bankedMinutes, 0); assert.match(r.recap.lastSpend, /Spent 200 banked minutes/);
});

test('woodcutting routine: 120 played minutes equal 120 spent minutes, with its random draws (TMR4)', async () => {
    const stop = ROUTE.findIndex(s => s.op === 'step' && s.minutes === 60);
    const game = await boot(null, {seed: SEED, heroName: null});
    let start;
    try {
        let saved;
        for(const step of ROUTE.slice(0, stop)) {
            if(step.op === 'click') await game.click(step.sel);
            else if(step.op === 'step') await game.step(step.minutes);
            else if(step.op === 'save') saved = await game.save();
            else if(step.op === 'load') {game.storage.clear(); await game.load(progress(saved));}
        }
        assert.ok(game.internals.current_activity, 'woodcutting is running before the paths split');
        start = await game.save();
    } finally {game.close();}
    const r = await bothPaths(start, 120);
    const wood = s => JSON.stringify([s.inventories.person.main_character, s.levels.person.main_character]);
    nonVacuous(wood(start), wood(r.spendSnap), 'woodcutting');
    assertSamePlay(r, 'woodcutting');
});

test('a blocking choice that opens mid-run stops the spend with the rest banked, and frozen ticks change nothing (TMR8, TMR10, TMR11)', async () => {
    const start = await hearthStart();
    const at = start.expansion.clock + 30;
    start.expansion.opportunities.waiting = {definitionId: 'frontier.departure', context: {actorId: 'player', worldId: 'base.frontier'},
        status: 'scheduled', blocking: true, due: at, expires: at + 60};
    const r = await bothPaths(start, 120);
    assert.ok(r.receipt.consumed > 0 && r.receipt.consumed < 120, `stopped partway (${r.receipt.consumed} of 120)`);
    assert.equal(r.recap.bankedMinutes, 120 - r.receipt.consumed, 'the rest stays banked');
    assert.match(r.recap.lastSpend, new RegExp(`Stopped after ${r.receipt.consumed} of 120 minutes`));
    nonVacuous(hearthState(start), hearthState(r.spendSnap), 'stopped hearth');
    assertSamePlay(r, 'stopped hearth');
});

test('a sleeping routine: one tick may cover several minutes, so the spend is counted in minutes and never overdraws the bank (TMR5, TMR11)', async () => {
    const game = await boot(null, {seed: SEED, heroName: null});
    let start;
    try {
        await game.load(firewoodFixture(await game.save())); await game.step(1);
        await game.call('start_sleeping');
        assert.equal(game.internals.is_sleeping, true, 'the hero is asleep in the Shack before the paths split');
        start = await game.save();
    } finally {game.close();}
    const r = await bothPaths(start, 120);
    nonVacuous(JSON.stringify([start.character, start.expansion.clock]), JSON.stringify([r.spendSnap.character, r.spendSnap.expansion.clock]), 'sleep');
    assert.ok(r.spentMoved <= 120, `the spend never moves the clock past the 120 minutes requested (moved ${r.spentMoved})`);
    assertSamePlay(r, 'sleep');
});
