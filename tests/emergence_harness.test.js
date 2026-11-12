// Emergence harness (chat E, PFP13, PFP15, MC16). Focused file: node --test tests/emergence_harness.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCase, runEquivalence, overBudget, seededRandom, contextFit, HARNESS_DIALS} from '../scripts/emergence_harness.mjs';
import {EMERGENCE_CASES, PENDING_CHAINS, steamShellCase} from '../scripts/emergence_cases.mjs';
import {toyCase} from './fixtures/emergence/toy_packs.mjs';
import {contextCase, PLACES, corpusShare} from './fixtures/emergence/context_case.mjs';

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

const gl4 = generations => contextFit(generations, {expect: PLACES, base: Object.fromEntries(Object.values(PLACES).map(v => [v, corpusShare(v)])), partOf: g => g.parts.path});

test('E7 GL4 context: place-caused generation runs in a seeded world; on P v0 no place raises its path (the PGB5 gap), the overlay control does', () => {
    for (const seed of [1, 2, 3]) {
        const eq = runEquivalence(contextCase(), {seed});
        assert.ok(eq.sameWorld && eq.sameChains, `seed ${seed}: generation repeats after one jump, cuts and reloads (PR1)`);
        const r = eq.runs.day;
        assert.equal(r.generations.length, 48);
        assert.ok(r.generations.every(g => g.cause.kind === 'place' && g.cause.id === g.place && g.grammar === 'proof.gu-kind@2'));
        // Baseline recorded: P v0 draws ignore the place, so no place fits. When P's place
        // weights land (PGB5), this assertion turns into the GL4 regression.
        assert.equal(gl4(r.generations).fit, 0, `seed ${seed}: P v0 does not read the place`);
        const control = runCase(contextCase({placeOverlay: true}), {seed, mode: 'day'});
        assert.equal(gl4(control.generations).fit, 2, `seed ${seed}: a place-weighted grammar shows the lift the metric looks for`);
    }
});

test('E8 PR3 and MC16: generator searches are metered per simulated day and gated by a budget', () => {
    const c = contextCase(), r = runCase(c, {seed: 1, mode: 'jump'});
    assert.equal(r.cost.search.length, 4);
    for (const day of r.cost.search) {
        assert.equal(day.calls, 12, 'six kinds per place per dusk');
        assert.ok(day.trials >= 12 && day.by['p.generate'] === day.trials, 'trials are the draws the generator reports');
        assert.ok(day.ms >= 0);
    }
    assert.deepEqual(overBudget(r, c.budget), [], `${r.cost.maxSearchTrialsPerDay} draws/day within ${c.budget.searchTrialsPerDay}`);
    assert.deepEqual(overBudget(r, {searchTrialsPerDay: 10}).length, 1, 'a tighter budget fails');
    assert.equal(runCase(CC1, {seed: 1, mode: 'jump'}).cost.maxSearchTrialsPerDay, 0, 'a case with no generator reports zero');
});
