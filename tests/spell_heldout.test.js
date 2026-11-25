import test from 'node:test';
import assert from 'node:assert/strict';
import {HP_SPELL_ROWS, HP_SPELL_WORLD, HP_SPELL_NAME_WORDS} from '../src/spell_pack_hogwarts.js';
import {HP_CASE_SCENES} from '../src/world_packs/hp_effect_pack.js';
import {sentenceFromIntent, compareSentences} from '../src/spell_effects.js';
import {labelSpellRow} from '../src/spell_grammar.js';
import {splitSpells, fitSpells, scoreSpells, singletonIntentRows} from '../src/spell_heldout.js';
import {executeSpellRows, outcomeCase} from '../src/spell_heldout_cases.js';
import {runCaseData, spellHeldOut, BLIND_LEXICON} from '../scripts/coverage_report.mjs';
import fs from 'node:fs';

const blind = JSON.parse(fs.readFileSync(new URL(`../${BLIND_LEXICON}`, import.meta.url), 'utf8'));
const opts = {lexicon: {...blind.roots, ...blind.names}, nameWords: HP_SPELL_NAME_WORDS};
const split = splitSpells(HP_SPELL_ROWS);
const fit = fitSpells(split.tuned, HP_SPELL_WORLD);

test('the intent field is the label in disguise, and every computed case is keyed by its own row', () => {
    for (const r of HP_SPELL_ROWS) {
        const {parts, truth} = labelSpellRow(r, HP_SPELL_WORLD);
        assert.deepEqual(compareSentences(sentenceFromIntent(parts), truth), [], r.id);
        assert.ok(HP_CASE_SCENES[r.id], `${r.id} has its own scene`);
    }
    assert.equal(Object.keys(HP_CASE_SCENES).length, 108);
});

test('the split is fixed: one tuning row per family, no reserved or authored-label row tunes, nothing overlaps', () => {
    assert.deepEqual(split.tuned.map(r => r.id), ['apparition', 'anti-apparition', 'alarm', 'blasting', 'anapneo', 'lock']);
    assert.deepEqual(split.authoredLabel.map(r => r.id), ['salvio', 'cave', 'aparecium']);
    assert.equal(split.heldOut.length, 99);
    const held = new Set(split.heldOut.map(r => r.id));
    for (const r of split.tuned) assert.ok(!held.has(r.id));
    assert.ok(split.heldOut.some(r => r.reserved));
    assert.equal(singletonIntentRows(HP_SPELL_ROWS).length, 58);
});

test('a prediction reads identity only: bending a held-out row\'s intent, target, execution and truth moves nothing', () => {
    const base = scoreSpells(split.heldOut, fit, HP_SPELL_WORLD, opts);
    const bent = split.heldOut.map(r => ({...r, intent: 'heal', target: 'self', execution: 'lasting', truth: {...r.truth, verb: 'end', object: 'effect'}}));
    const after = scoreSpells(bent, fit, HP_SPELL_WORLD, opts);
    assert.deepEqual(after.rows.map(r => r.predicted), base.rows.map(r => r.predicted));
});

test('the fit never reads held-out rows', () => {
    const again = fitSpells(splitSpells(HP_SPELL_ROWS.map(r => split.heldOut.some(h => h.id === r.id) ? {...r, intent: 'heal', truth: {...r.truth, verb: 'end'}} : r)).tuned, HP_SPELL_WORLD);
    assert.deepEqual(again.fitted.weights, fit.fitted.weights);
});

test('measured held-out score (diagnostic, pinned at the measured result)', () => {
    const s = scoreSpells(split.heldOut, fit, HP_SPELL_WORLD, opts);
    assert.deepEqual([s.n, s.verbObject, s.outcome, s.targeting, s.time, s.sentence, s.both], [99, 48, 45, 33, 36, 12, 20]);
    // Pinned 2026-11-24 on blind lexicon v2 (v1 read 99, 33, 33, 22, 26, 9, 12); see docs/audits/GRAMMAR_CANON_MEASURE_2026-11-24.md.
    const kept = s.rows.filter(r => !singletonIntentRows(HP_SPELL_ROWS).includes(r.id));
    assert.deepEqual([kept.length, kept.filter(r => r.verbObject).length, kept.filter(r => r.targeting).length], [46, 21, 16]);
    const cats = {};
    for (const r of s.misses) cats[r.miss.category] = (cats[r.miss.category] ?? 0) + 1;
    assert.deepEqual(cats, {'wrong rule': 64, 'missing data': 12, 'undecidable default': 11});
});

const run = data => runCaseData(data, {id: 'held-out'});

test('engine probes: a wrong prediction is a world mismatch, an unrunnable pair is named, never forced', async () => {
    const t = {verb: 'remove', object: 'vitality', time: 'instant'};
    assert.match((await run(outcomeCase(t, t).data)).state, /^expressed-/);
    assert.equal((await run(outcomeCase({verb: 'move', object: 'position', time: 'instant'}, t).data)).state, 'blocked:runner-expect-mismatch');
    assert.match(outcomeCase(t, {verb: 'sense', object: 'mind', time: 'instant'}).cannot, /no generic world term/);
    assert.match(outcomeCase(null, t).cannot, /no prediction/);
});

test('engine execution score on the held-out rows, and the probes run on their own labels', async () => {
    const held = await spellHeldOut();
    const n = f => held.engineHeld.filter(f).length;
    assert.deepEqual([n(r => r.outcome === 'match'), n(r => r.outcome === 'mismatch'), n(r => r.outcome.startsWith('cannot'))], [21, 2, 76]);
    assert.deepEqual([held.selfRun.match, held.selfRun.n], [39, 39]);
    assert.deepEqual([held.bespoke.scenes, held.bespoke.exceptionCases, held.bespoke.built], [108, 3, 26]);
});
