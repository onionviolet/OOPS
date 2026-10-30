import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {worldFamily, worldLook, applyWorldLook, WORLD_FLOURISH} from '../src/world_look.js';
import {reportVoice, VOICED_FAMILIES} from '../src/world_report_voice.js';

test('world ids name their family; unlisted families fall back to no flourish (DSG12)', () => {
    assert.equal(worldFamily('book.lotm.tingen'), 'lotm');
    assert.equal(worldFamily('base.frontier'), 'frontier');
    assert.equal(worldFamily('book.mol.cyoria'), 'mol');
    assert.equal(worldFamily('hp.world'), 'hp');
    assert.equal(worldFamily('lotm.world'), 'lotm');
    assert.equal(worldFamily('pocket.folded_glasshouse'), 'folded_glasshouse');
    assert.equal(worldFamily(undefined), 'unknown');
    assert.deepEqual(worldLook('book.lotm.tingen'), {family: 'lotm', flourish: true, label: 'Tingen'});
    assert.deepEqual(worldLook('base.frontier'), {family: 'frontier', flourish: false, label: null});
});

test('the root hook writes family and flourish, and only when they change', () => {
    const writes = [], dataset = new Proxy({}, {set(t, k, v) { writes.push(k); t[k] = v; return true; }});
    const root = {dataset};
    applyWorldLook(root, 'book.lotm.tingen');
    assert.deepEqual({...dataset}, {worldFamily: 'lotm', worldFlourish: 'on'});
    applyWorldLook(root, 'book.lotm.tingen');
    assert.equal(writes.length, 2, 'a repeat tick writes nothing');
    applyWorldLook(root, 'base.frontier');
    assert.deepEqual({...dataset}, {worldFamily: 'frontier', worldFlourish: 'off'});
});

test('every flourished family has its token block, and the tokens stay in the token file (UR6)', () => {
    const tokens = readFileSync(new URL('../styles/ui_tokens.css', import.meta.url), 'utf8');
    for (const family of Object.keys(WORLD_FLOURISH)) assert.match(tokens, new RegExp(`:root\\[data-world-family="${family}"\\][^{]*\\{[^}]*--world-accent`));
    const rules = readFileSync(new URL('../styles/world_look.css', import.meta.url), 'utf8');
    assert.doesNotMatch(rules, /#[0-9a-f]{3,6}\b|rgb\(/i);
});

test('LOTM voices arrival with flavour plus the useful part; other worlds keep the generic line (DSG13)', () => {
    const office = reportVoice({family: 'lotm', kind: 'message_travel', text: '[ Entering Tingen supervised workroom ]'});
    assert.ok(office.flavour && office.useful);
    assert.match(office.useful, /Tingen workroom panel|Places and walks/);
    assert.equal(reportVoice({family: 'lotm', kind: 'message_travel', text: '[ Entering Some Tingen street ]'}), null, 'unchecked places stay generic');
    assert.equal(reportVoice({family: 'frontier', kind: 'message_travel', text: '[ Entering Village ]'}), null);
    assert.equal(reportVoice({family: 'lotm', kind: 'notification', text: 'Notebook is now available in navigation.'}), null);
    assert.equal(reportVoice({family: 'lotm', kind: 'message_travel', text: 'not an arrival'}), null);
    assert.deepEqual(VOICED_FAMILIES, ['lotm']);
});

test('voice text carries no canon labels, ids or developer words (RPT7, RPT11)', () => {
    const places = ['Tingen supervised workroom', 'Tingen probationer lodging', 'Tingen docks', 'Tingen university area'];
    for (const place of places) {
        const {flavour, useful} = reportVoice({family: 'lotm', kind: 'message_travel', text: `[ Entering ${place} ]`});
        for (const line of [flavour, useful]) assert.doesNotMatch(line, /book\.|canon|chapter|the book|proposal|\bid\b|sealed/i);
    }
});
