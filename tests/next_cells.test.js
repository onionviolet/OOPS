// Next cells (PWC28): the creature, power and artifact ledgers built by scripts/next_cells.mjs. Offline: reads the committed
// ledgers and sidecars only. Checks the frozen denominator matches the rows, every row is classified, the split is the
// frozen rule, and the pure helpers behave.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {CELL_NAMES, cellOf, split, slug, scoreClass, SPLIT_RULE} from '../scripts/next_cells.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const STATE = /^(catalogued|blocked:[a-z0-9][\w.:-]*|not-a-thing:[a-z0-9][\w.:-]*)$/;
const built = CELL_NAMES.filter(n => fs.existsSync(`${root}docs/coverage/${cellOf(n).ledger}.jsonl`));

test('every built next-cell ledger matches its frozen denominator and has no unclassified row', () => {
    assert.ok(built.length > 0, 'no next-cell ledger is built');
    for (const name of built) {
        const c = cellOf(name);
        const rows = fs.readFileSync(`${root}docs/coverage/${c.ledger}.jsonl`, 'utf8').trim().split('\n').map(l => JSON.parse(l));
        const side = JSON.parse(fs.readFileSync(`${root}docs/coverage/${c.ledger}_labels.json`, 'utf8'));
        assert.equal(side.meta.split_rule, SPLIT_RULE, name);
        assert.equal(rows.length, side.meta.count, name);
        assert.deepEqual(rows.map(r => r.id), side.meta.ids, name);
        assert.deepEqual(Object.keys(side.sheets), side.meta.ids, name);
        for (const r of rows) {
            assert.match(r.state, STATE, `${name} ${r.id}`);
            assert.ok(r.source && r.note, `${name} ${r.id}`);
            assert.equal(side.sheets[r.id].split, split(r.id), `${name} ${r.id}`);
        }
    }
});

test('the split is deterministic and takes about a quarter of the rows as the tuning sample', () => {
    assert.equal(split('hp.creature.acromantula'), split('hp.creature.acromantula'));
    const ids = Array.from({length: 2000}, (_, i) => `x.${i}`);
    const tuned = ids.filter(id => split(id) === 'tuned').length;
    assert.ok(tuned > 400 && tuned < 600, `tuned ${tuned}`);
});

test('the lotm_powers rows link to existing lotm_potions ids and nothing else', () => {
    if (!built.includes('lotm_powers')) return;
    const potions = new Set(fs.readFileSync(`${root}docs/coverage/lotm_potions.jsonl`, 'utf8').trim().split('\n').map(l => JSON.parse(l).id));
    const side = JSON.parse(fs.readFileSync(`${root}docs/coverage/lotm_powers_labels.json`, 'utf8'));
    let linked = 0;
    for (const s of Object.values(side.sheets)) if (s.potion) { linked++; assert.ok(potions.has(s.potion), s.potion); }
    assert.ok(linked > 100, `only ${linked} rows link to a potion`);
});

test('scoreClass counts exact hits and the majority baseline on held-out labelled rows only', () => {
    const c = {classes: ['1', '2', '3'], ordinal: true, label: 'x'};
    const held = [], tuned = [];
    for (let i = 0; held.length < 6 || tuned.length < 1; i++) { const id = `t.${i}`; (split(id) === 'held-out' ? held : tuned).push(id); }
    const entries = [...held.slice(0, 6).map((id, k) => ({row: {id}, label: k < 4 ? '2' : '3', sheet: {class_guess: k % 2 ? '2' : '3'}})), {row: {id: tuned[0]}, label: '1', sheet: {class_guess: '1'}}];
    const s = scoreClass(c, entries);
    assert.equal(s.held_out.n, 6);
    assert.equal(s.held_out.baseline_class, '2');
    assert.equal(s.held_out.baseline, 4);
    assert.equal(s.held_out.exact, 3);
    assert.equal(s.tuned.n, 1);
    assert.equal(slug('The Sealed Artifact 1-29'), 'sealed_artifact_1_29');
});
