// Emergence harness (chat E, PFP13, PFP15, MC16). Focused file: node --test tests/emergence_harness.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCase, runEquivalence, overBudget, seededRandom, HARNESS_DIALS} from '../scripts/emergence_harness.mjs';
import {EMERGENCE_CASES, PENDING_CHAINS, steamShellCase} from '../scripts/emergence_cases.mjs';
import {toyCase} from './fixtures/emergence/toy_packs.mjs';

const CC1 = EMERGENCE_CASES['cc1-steam-shell'], CC1D = EMERGENCE_CASES['cc1-steam-shell-depart'];
const SMOKE_CHAIN = 'b.brew_steam:batch>smoke | l.shell_regulator:startle>shell.pull | l.shell_regulator:inlet-link';
const STEAM_CHAIN = 'humidity{b.brew_steam,l.shell_regulator} ~ l.shell_regulator:shell>shell.pull | l.shell_regulator:inlet-link';

test('E1 CC1 run long: the brew and the shell form multi-domain chains through an effect and a quantity, with no join code', () => {
    const r = runCase(CC1, {seed: 1, mode: 'day'});
    assert.equal(r.gaps.length, 0, 'every effect record was harvested before the chain cap trimmed it');
    const smoke = r.chains.find(c => c.signature === SMOKE_CHAIN);
    assert.ok(smoke?.multiDomain && smoke.domains.join('') === 'bl', 'smoke from the brew startles the shell, whose pull the inlet follows');
    assert.ok(r.chains.find(c => c.signature === STEAM_CHAIN)?.count > 0, 'brew steam moves humidity the shell watches');
    const contact = r.contacts.find(c => c.holder === 'workshop' && c.quantity === 'humidity');
    assert.deepEqual(contact.writers, ['b.brew_steam', 'l.shell_regulator']);
    assert.ok(contact.multiDomain);
    // Without the brew the shell's own rhythm is single-domain: the steam tag needs the brew to have written in the window.
    const lonely = r.chains.find(c => c.signature === 'l.shell_regulator:shell>shell.pull | l.shell_regulator:inlet-link');
    assert.ok(lonely && !lonely.multiDomain);
    assert.deepEqual(r.newChains, [], 'every multi-domain chain is a known regression signature');
    // A case composes packs and schedules outside ops; it writes no law or reactor of its own.
    const source = readFileSync(new URL('../scripts/emergence_cases.mjs', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\b(reactors|laws|rates|watches|react)\s*:/, 'no join code in the cases');
    assert.doesNotMatch(readFileSync(new URL('../scripts/emergence_harness.mjs', import.meta.url), 'utf8'), /world_substrate_packs/);
});

test('E2 one jump, day cuts, odd cuts and reloads reach the same world and the same chains', () => {
    for (const c of [CC1, CC1D]) for (const seed of [1, 5]) {
        const eq = runEquivalence(c, {seed});
        assert.ok(eq.sameWorld, `${c.id} seed ${seed}: same final world`);
        assert.ok(eq.sameChains, `${c.id} seed ${seed}: same chains, contacts, loops and outcomes`);
    }
    const a = runCase(CC1, {seed: 1, mode: 'day'}), b = runCase(CC1, {seed: 2, mode: 'day'});
    assert.notEqual(a.fingerprint, b.fingerprint, 'the seed changes the scenario');
    assert.deepEqual(runCase(CC1, {seed: 2, mode: 'day'}).chainFingerprint, b.chainFingerprint, 'and the same seed repeats it');
});

test('E3 keeper carries the shell out mid-brew: the smoke lands unanswered, the inlet stops following, the stored heat works on', () => {
    for (const seed of [1, 3, 7]) {
        const stay = runCase(CC1, {seed, mode: 'day'}), gone = runCase(CC1D, {seed, mode: 'day'});
        assert.ok(gone.chains.some(c => c.signature === 'b.brew_steam:batch>smoke | -'), `seed ${seed}: smoke with nobody to answer it`);
        assert.ok(!stay.chains.some(c => c.signature === 'b.brew_steam:batch>smoke | -'));
        assert.ok(gone.chains.some(c => c.signature === 'outside:keeper.leaves>departed | l.shell_regulator:inlet-leave'));
        assert.ok(gone.chains.some(c => c.signature === 'outside:keeper.returns>departed | -'), 'the inlet no longer follows the shell');
        assert.notEqual(gone.fingerprint, stay.fingerprint);
        // pc1 gap, recorded: the brew does not read anything the regulator moves, so the batch
        // finishes the same. When B's law reads humidity or ambient heat, this becomes the pc1 regression.
        assert.deepEqual(gone.outcomes, stay.outcomes, 'batches finish the same with or without the shell (pc1 waits on B)');
    }
    assert.ok(PENDING_CHAINS.find(p => p.id === 'pc1-gu-leaves-mid-brew').waits.some(w => w.startsWith('B:')));
});

test('E4 loops: the harness flags damped cascades and repeats on a path, and tells runaway growth from a rhythm', () => {
    const echo = runCase(toyCase({cascadeDepth: 4}), {mode: 'day'});
    assert.equal(echo.loops.damped.length, 4, 'one echo each morning (the end minute is decided too), stopped by the cascade dial');
    assert.ok(echo.loops.repeats.length >= 4, 'ping and pong recur on one path');
    assert.ok(echo.chains.some(c => c.signature.endsWith('| damped') && c.domains.join('') === 'xy'));
    assert.ok(echo.newChains.length > 0, 'an unknown multi-domain chain is reported as new');
    assert.equal(echo.loops.runaways.length, 0);
    const deeper = runCase(toyCase({cascadeDepth: 8}), {mode: 'day'});
    assert.ok(deeper.records > echo.records, 'the depth dial sets how far the echo runs');
    const swarm = runCase(toyCase({swarm: true}), {mode: 'day'});
    assert.equal(swarm.loops.runaways.length, 1, 'a count that doubles every day is runaway');
    assert.deepEqual(swarm.loops.runaways[0].perDay, [0, 3, 6, 12]);
    assert.ok(swarm.loops.runaways[0].perDay.at(-1) >= HARNESS_DIALS.runawayFloor);
    // CC1 at default dials: the shell's open and close cycle is a steady rhythm, not a runaway.
    const cc1 = runCase(CC1, {seed: 1, mode: 'day'});
    assert.deepEqual([cc1.loops.damped.length, cc1.loops.runaways.length], [0, 0]);
    assert.ok(cc1.loops.rhythms.some(r => r.signature.includes('draft.opened')));
    // A low dial on CC1 damps the smoke chain: the inlet never hears the startled pull.
    const low = runCase(steamShellCase({cascadeDepth: 1}), {seed: 1, mode: 'day'});
    assert.ok(low.loops.damped.some(l => l.step.endsWith('>shell.pull')));
});

test('E5 MC16: far settlement stays inside its segments-per-day budget; a near run exceeds it', () => {
    const eq = runEquivalence(CC1, {seed: 1});
    assert.deepEqual(overBudget(eq.runs.jump, {segmentsPerDay: CC1.budget.segmentsPerDay}), [], `far: ${eq.cost.maxSegmentsPerDay} segments/day`);
    assert.ok(eq.cost.maxMsPerDay > 0 && eq.cost.maxMsPerDay < CC1.budget.msPerDay, 'wall time recorded, under the loose ceiling');
    const near = runCase(steamShellCase({detail: 'near'}), {seed: 1, mode: 'jump'});
    assert.deepEqual(near.outcomes, eq.runs.jump.outcomes, 'near and far settle the batches the same');
    assert.equal(near.cost.maxSegmentsPerDay, 1440, 'near settles minute by minute');
    assert.deepEqual(overBudget(near, CC1.budget).length, 1, 'the budget check fails a run that exceeds it');
});

test('E6 seeded draws are deterministic and stay out of the packs', () => {
    const a = seededRandom(9), b = seededRandom(9);
    assert.deepEqual(Array.from({length: 5}, () => a.int(0, 99)), Array.from({length: 5}, () => b.int(0, 99)));
    assert.equal(PENDING_CHAINS.length, 3, 'the three plan chains are named with what each waits on');
});
