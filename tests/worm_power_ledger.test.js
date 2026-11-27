// Worm power ledger (PWC1-PWC7): the committed ledger equals a build from the committed sidecar, every row is classified,
// the denominator and split hold, and every labelled field carries a locator and a speaker.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readCanonicalText} from '../scripts/canonical_text.mjs';
import {buildWormLedger, toLedgerText, readSidecar, summarize} from '../scripts/worm_power_ledger.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';
import {EFFECT_VERBS, EFFECT_OBJECTS, EFFECT_TARGETS, EFFECT_TIMES, VERB_ACCEPTS} from '../src/effect_grammar.js';

const text = readCanonicalText(new URL('../docs/coverage/worm_powers.jsonl', import.meta.url));
const rows = text.trim().split('\n').map(l => JSON.parse(l));
const side = readSidecar();
const SPEAKERS = ['narrator', 'character_claim', 'demonstration', 'wiki', 'unknown'];

test('committed ledger equals a fresh build from the sidecar and passes the shared validator', () => {
    assert.equal(text, toLedgerText(buildWormLedger(side)));
    assert.deepEqual(parseLedger(text, {name: 'worm_powers'}).problems, []);
    assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
    assert.equal(summarize(rows).unclassified, 0);
    assert.ok(!/—| -- /.test(text), 'no em dashes');
});

test('denominator: 279 rows, 15 devices, and every row of the 85-row cape table is matched', () => {
    assert.equal(rows.length, 279);
    assert.equal(rows.filter(r => r.id.startsWith('worm.device.')).length, 15);
    const tables = new Set(Object.values(side.rows).flatMap(r => r.sources).filter(s => s.startsWith('table:')).map(s => +s.slice(6)));
    for (let n = 1; n <= 85; n++) assert.ok(tables.has(n), `table row ${n}`);
    for (const r of rows) {
        assert.match(r.state, /^(catalogued|blocked:[a-z-]+)$/, r.id);
        assert.ok(r.source.length > 0 && r.note.length > 0, r.id);
        if (r.state.startsWith('blocked:')) assert.ok(r.note.includes(`Missing: ${r.state.slice(8)}`), `${r.id} names what is missing`);
    }
});

test('split is the frozen sha1 rule and the pre-registered score is recorded', () => {
    for (const [id, r] of Object.entries(side.rows)) assert.equal(r.heldOut, parseInt(createHash('sha1').update(id).digest('hex').slice(0, 2), 16) < 0x33, id);
    const {score} = side.meta;
    assert.equal(score.heldOut.n, Object.values(side.rows).filter(r => r.heldOut && r.rating && side.meta.classPredicts[r.rating.primary] && r.grammar).length);
    assert.equal(typeof side.meta.grammarFolded, 'boolean');
    for (const r of Object.values(side.rows)) if (r.grammar) assert.equal(r.grammar.checked, side.meta.grammarFolded);
});

test('sidecar fields are normalised: grammar parts fit the engine grammar, every value has a locator and a speaker', () => {
    for (const [id, r] of Object.entries(side.rows)) {
        for (const at of [r.grammar?.at, ...Object.values(r.fields ?? {}).map(f => f.at), r.combines?.at, r.counters?.at].filter(Boolean)) {
            assert.ok(SPEAKERS.includes(at.speaker), id);
            if (at.speaker !== 'unknown') assert.ok(at.locator, `${id} has a locator`);
        }
        if (!r.grammar) continue;
        const g = r.grammar;
        assert.ok(g.verb === 'none' || EFFECT_VERBS.includes(g.verb), id);
        assert.ok(g.object === 'none' || g.object in EFFECT_OBJECTS, id);
        assert.ok(EFFECT_TARGETS.includes(g.target) && EFFECT_TIMES.includes(g.time), id);
        assert.equal(g.valid, g.verb !== 'none' && g.object !== 'none' && VERB_ACCEPTS[g.verb].includes(EFFECT_OBJECTS[g.object]), id);
    }
});
