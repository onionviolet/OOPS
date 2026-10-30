import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {BE_PROFILE_ID, SEATS, seatOf} from '../src/seat_profiles.js';
import {PERSPECTIVE_CONTROLS} from '../src/perspective_controls.js';
import {CONTROLLED_ACTOR_ID, observerForProfile, observerView} from '../src/observer_view.js';

// One fixture per seat. The unnamed "other" facts must never reach the observer.
const base = {
    actors: {player: {worldId: 'fixture.world', facts: {a: 1}, completed: {done: true}}},
    simulation: {knowledge: {player: {'fixture.key': {value: 'mine'}}, other: {'fixture.key': {value: 'theirs'}}}},
};
const fixtures = {
    be: {...base, lotm: {entryProfile: BE_PROFILE_ID}},
    beside: {...base, lotm: {entryProfile: 'lotm.early_tingen.fixture@1'}},
    // follow and bystander have no entry adapter yet; the seam must still give them the beside scope.
    ordinary: {...base},
};

test('each seat yields an observer with its own scope and no saved seat field', () => {
    for (const [seat, state] of Object.entries(fixtures)) {
        const view = observerView(state);
        assert.equal(view.seat, seat);
        assert.equal(view.seat, seatOf(state));
        assert.ok(SEATS.includes(view.seat));
        assert.equal(view.actorId, CONTROLLED_ACTOR_ID);
        assert.equal(view.worldId, 'fixture.world');
        assert.equal(Object.hasOwn(state, 'seat'), false);
    }
    assert.deepEqual(observerView(fixtures.be).audiences, ['world-general', 'seat-only', 'world-mechanism', 'harness']);
    assert.deepEqual(observerView(fixtures.beside).audiences, ['world-general']);
    assert.deepEqual(observerView(fixtures.beside).tags, ['in-world', 'system', 'crossing', 'other-seat']);
    assert.equal(observerView(fixtures.ordinary).audiences, null);
    assert.equal(observerView(fixtures.ordinary).tags, null);
    assert.ok(Object.isFrozen(observerView(fixtures.be)));
});

test('sees() matches the seat filter for every perspective control', () => {
    const be = observerView(fixtures.be), beside = observerView(fixtures.beside), ordinary = observerView(fixtures.ordinary);
    for (const row of PERSPECTIVE_CONTROLS) {
        assert.equal(ordinary.sees({control: row.id}), true, row.id);
        assert.equal(beside.sees({control: row.id}), true, row.id);
        if (['crossing', 'other-seat'].includes(row.tag)) assert.equal(be.sees({control: row.id}), false, row.id);
        if (row.tag === 'in-world') assert.equal(be.sees({control: row.id}), true, row.id);
    }
});

test('knowledge resolves against the controlled actor and never another actor', () => {
    for (const state of Object.values(fixtures)) {
        const view = observerView(state);
        assert.equal(view.knows('fixture.key').value, 'mine');
        assert.equal(view.knows('missing'), undefined);
        assert.deepEqual(view.facts(), {a: 1});
        assert.equal(view.completed('done'), true);
        assert.equal(view.completed('nope'), false);
    }
    const empty = observerView({});
    assert.equal(empty.seat, 'ordinary');
    assert.equal(empty.knows('fixture.key'), undefined);
    assert.deepEqual(empty.knowledge(), {});
    assert.equal(empty.worldId, null);
});

test('panel perspective follows the seat: the lead drops foreign and crossing panels, other seats keep all', () => {
    const panels = [{id: 'a', perspective: 'fixture.world'}, {id: 'b', perspective: 'system'}, {id: 'c', perspective: 'crossing'}, {id: 'd', perspective: 'fixture.other'}];
    assert.deepEqual(panels.filter(observerView(fixtures.be).seesPanel).map(p => p.id), ['a', 'b']);
    assert.deepEqual(panels.filter(observerView(fixtures.beside).seesPanel).map(p => p.id), ['a', 'b', 'c', 'd']);
    assert.deepEqual(panels.filter(observerView(fixtures.ordinary).seesPanel).map(p => p.id), ['a', 'b', 'c', 'd']);
    assert.equal(observerView(fixtures.be).perspectiveOf({id: 'x', perspective: 'current-world'}), 'fixture.world');
});

test('observerForProfile matches observerView on the same entry profile', () => {
    assert.equal(observerForProfile(BE_PROFILE_ID).seat, 'be');
    assert.equal(observerForProfile('lotm.early_tingen.fixture@1').seat, 'beside');
    assert.equal(observerForProfile(undefined).seat, 'ordinary');
});

// ---- Lint: UI modules read the seat through observer_view.js ----------------
// Two kinds of direct lead assumption, each ratcheted by an allowlist. Counts
// may only go down: lowering a file's real count below its entry fails the test
// until the entry is lowered too, so the list shrinks as sites migrate.
const root = path.resolve(import.meta.dirname, '..');
const uiFiles = [];
for (const f of fs.readdirSync(path.join(root, 'src'))) if (/_ui\.js$/.test(f)) uiFiles.push(`src/${f}`);
(function walk(dir) {
    for (const e of fs.readdirSync(path.join(root, dir), {withFileTypes: true})) {
        const rel = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(rel); else if (rel.endsWith('.js')) uiFiles.push(rel);
    }
})('src/ui');

// A: the lead's identity or the seat adapter, read directly.
const LEAD_IDENTITY = /BE_PROFILE_ID|entryProfile|lotmBe\b|\bseatOf\b|seat_profiles|book\.lead\./;
// B: the controlled actor's id hard-coded as "the player" in a read.
const HARD_PLAYER = /(?:actors|knowledge|sessions)\??\.player\b|(?:actorId|createdBy)\s*[=!]==\s*['"]player['"]|['"]player['"]\s*[=!]==\s*\w+\.actorId|\.includes\(\s*['"]player['"]\s*\)/;

// The picker reads a candidate start's profile id to preview that seat; it is not a seat comparison.
const ALLOW_LEAD_IDENTITY = {'src/book_world_lotm_ui.js': 1};
// Seeded 2026-10-29 (77 lines). Migrate a file to observerView(), then lower its entry.
const ALLOW_HARD_PLAYER = {
    'src/body_ui.js': 2,
    'src/exchange_ui.js': 3,
    'src/expedition_ui.js': 3,
    'src/feature_expansion_nested_ink_ui.js': 2,
    'src/feature_expansion_ui.js': 1,
    'src/field_ui.js': 9,
    'src/field_works_ui.js': 4,
    'src/frontier_campaign_ui.js': 2,
    'src/observation_ui.js': 2,
    'src/party_ui.js': 4,
    'src/promise_ui.js': 5,
    'src/pursuit_ui.js': 4,
    'src/simulation_ui.js': 13,
    'src/storylet_ui.js': 3,
    'src/systems_workshop_ui.js': 8,
    'src/technique_ui.js': 4,
    'src/town_ui.js': 4,
    'src/village_ui.js': 4,
};

function counts(pattern) {
    const out = {};
    for (const file of uiFiles) {
        let n = 0;
        for (const line of fs.readFileSync(path.join(root, file), 'utf8').split('\n')) if (pattern.test(line)) n++;
        if (n) out[file] = n;
    }
    return out;
}
const total = map => Object.values(map).reduce((a, b) => a + b, 0);

function ratchet(name, actual, allowed, allowedTotal) {
    for (const [file, n] of Object.entries(actual)) {
        assert.ok(n <= (allowed[file] ?? 0), `${name}: ${file} has ${n} direct reads (allowed ${allowed[file] ?? 0}). Read the seat through observerView() in src/observer_view.js.`);
    }
    for (const [file, n] of Object.entries(allowed)) {
        assert.ok((actual[file] ?? 0) >= n, `${name}: ${file} is down to ${actual[file] ?? 0}; lower its allowlist entry from ${n}.`);
    }
    assert.equal(total(actual), allowedTotal, `${name}: total ${total(actual)} must equal ${allowedTotal}; lower the total with the entries.`);
}

test('UI modules do not compare against the lead identity directly (ratchet)', () => {
    ratchet('lead identity', counts(LEAD_IDENTITY), ALLOW_LEAD_IDENTITY, total(ALLOW_LEAD_IDENTITY));
});

test('UI modules do not hard-code the controlled actor as "player" (ratchet)', () => {
    ratchet('hard-coded player', counts(HARD_PLAYER), ALLOW_HARD_PLAYER, total(ALLOW_HARD_PLAYER));
});

test('the migrated sites read through the seam', () => {
    for (const file of ['src/book_world_lotm_ui.js', 'src/workspace_navigation.js', 'src/observation_ui.js', 'src/pocket_realm_ui.js']) {
        assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /observer_view\.js/, file);
    }
});
