// R6 / PWC16 artifact ledgers: every row classified, unique, matches its denominator, carries a full power sheet in the
// sidecar with locators and speakers, and the frozen split and fold rule agree with the committed scores.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {CORPORA, SHEET_FIELDS, SPEAKER, BLOCKED, split, score} from '../scripts/artifact_ledgers.mjs';

const read = (name, ext) => readFileSync(new URL(`../docs/coverage/${name}.${ext}`, import.meta.url), 'utf8');

for (const [corpus, c] of Object.entries(CORPORA)) {
    test(`${c.ledger}: classified rows, full sheets, frozen split`, () => {
        const text = read(c.ledger, 'jsonl'), parsed = parseLedger(text, {name: c.ledger});
        assert.deepEqual(parsed.problems, []);
        const side = JSON.parse(read(`${c.ledger}_labels`, 'json'));
        assert.equal(parsed.rows.length, side.count);
        assert.equal(Object.keys(side.sheets).length, side.count);
        for (const row of parsed.rows) {
            assert.ok(row.id.startsWith(c.prefix), row.id);
            assert.match(row.state, /^(catalogued|blocked:[a-z-]+|not-a-thing:[a-z0-9-]+)$/, row.id);
            if (row.state.startsWith('blocked:')) assert.ok(BLOCKED.includes(row.state.slice(8)), `${row.id} names a known capability`);
            const entry = side.sheets[row.id];
            assert.equal(entry.split, split(row.id), `${row.id} split is the frozen hash`);
            for (const k of SHEET_FIELDS) {
                const field = entry.sheet[k];
                assert.ok(field && 'value' in field && 'locator' in field && SPEAKER.includes(field.speaker), `${row.id}.${k} has a locator and speaker`);
                if (field.value) assert.ok(field.locator, `${row.id}.${k} states a value, so it has a locator`);
            }
            assert.ok(entry.sheet.effect && SPEAKER.includes(entry.sheet.effect.speaker), `${row.id} effect`);
        }
        const entries = parsed.rows.map(r => ({label: side.sheets[r.id].label, split: side.sheets[r.id].split, sheet: {class_guess: side.sheets[r.id].sheet.class_guess ?? ''}}));
        if (side.fold.class_guess === 'folded') assert.ok(side.score.held_out.hit > side.score.held_out.baseline, 'fold only what beats the baseline');
        else assert.ok(Object.values(side.sheets).every(e => e.sheet.class_guess === undefined), 'an unfolded class is not in the sheets');
        assert.ok(side.score.held_out.n > 0);
        assert.equal(typeof score, 'function');
        assert.ok(entries.length === side.count);
    });
}
