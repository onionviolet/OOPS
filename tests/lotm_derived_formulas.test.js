// LOTM derived formulas (PWC21, proposal): the derived tier brews through the existing law, stays apart from stated tiers and
// cites a rule row; the frozen split matches the one the wiki-tier labels used.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {derivedBrewRow, derivedSpec} from '../src/lotm_derived_formulas.js';
import {coverageCase} from '../src/world_packs/lotm_derived_cases.js';
import {heldOut, rulesFile} from '../scripts/derive_lotm_formulas.mjs';

const read = p => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const ledger = readFileSync(new URL('../docs/coverage/lotm_potions.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const derived = ledger.filter(r => r.derived);

test('every derived row cites a rule row, a case and its inputs, and no stated tier is overwritten', () => {
    const rules = read('docs/coverage/lotm_rules.json');
    const ids = new Set(rules.rules.map(r => r.id));
    assert.equal(derived.length, 161);
    for (const r of derived) {
        assert.equal(r.state, 'expressed-derived', r.id);
        assert.ok(ids.has(r.derived.rule), r.id);
        assert.ok(r.derived.inputs.length >= 2, r.id);
        assert.equal(r.case.module, 'src/world_packs/lotm_derived_cases.js');
        assert.ok(rules.rules.find(x => x.id === r.derived.rule).derives.includes(r.id.replace('lotm.potion.', '')), r.id);
    }
    const states = ledger.filter(r => !r.derived).map(r => r.state);
    assert.ok(!states.includes('blocked:formula-in-notes'));
    assert.ok(ledger.filter(r => r.state === 'blocked:formula-wiki-unchecked').length >= 12, 'wiki-tier rows keep their own state');
    assert.deepEqual(rules, rulesFile(derived.map(r => r.id.replace('lotm.potion.', ''))));
});

test('a derived row brews through the brew law into a bottled potency, and the runner counts it as derived', async () => {
    const {runCaseData} = await import('../scripts/coverage_report.mjs');
    for (const id of ['error_9', 'chained_2', 'wheel_of_fortune_0']) {
        const out = await runCaseData(coverageCase(`lotm.derived.${id}`), {id, typedState: 'expressed-derived'});
        assert.equal(out.state, 'expressed-derived', `${id}: ${out.detail}`);
    }
    for (const [pathway, seq] of [['Error', 9], ['Chained', 2], ['Wheel of Fortune', 0]]) {
        const row = derivedBrewRow(pathway, seq);
        assert.ok(row.slots.some(s => s.role === 'main' && /characteristic|Uniqueness/.test(s.material)), row.id);
        assert.equal(row.offered, false, 'a derived row is never offered at a bench');
    }
    assert.equal(derivedSpec('Wheel of Fortune', 0).slots.filter(s => s.role === 'main').length, 2);
});

test('the held-out split is the GKM429 split the wiki tier used', () => {
    const wiki = read('docs/coverage/wiki_tier_labels.json').lotm_potions;
    for (const [id, v] of Object.entries(wiki)) assert.equal(heldOut(id), v.heldOut, id);
});
