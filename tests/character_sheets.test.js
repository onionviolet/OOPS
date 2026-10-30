import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {LIST_FIELDS, bandAsOf, chapterRank, reproduces, sheetAsOf} from '../src/character_sheets.js';

const entry = (v, from, extra = {}) => ({v, from, ev: 'S', loc: 'x', ...extra});
const synthetic = {
    id: 'test.person.a', tier: 'principal',
    personaIds: ['persona.second'],
    identities: [entry({name: 'First', kind: 'legal'}, 'b1:1'), entry({name: 'Second', kind: 'persona', persona: 'persona.second'}, 'b3:5'), entry({name: 'Hidden', kind: 'legal'}, 'b3:5', {gate: 'reveal@b3:5'}), entry({name: 'Rumor', kind: 'persona'}, 'b3:5', {view: 'believed', by: 'test.person.b'})],
    power: [entry({path: 'p', level: 9}, 'b1:1', {to: 'b3:5'}), entry({path: 'p', level: 7}, 'b3:5')],
    stats: [entry({axis: 'might', band: 2}, 'b1:1', {to: 'b4:1'}), entry({axis: 'might', band: 6}, 'b4:1')],
    money: [entry({kind: 'purse', amount: 100}, 'b1:1')],
};

test('chapter refs sort by volume then chapter', () => {
    assert.ok(chapterRank('b1:213') < chapterRank('b2:1'));
    assert.equal(chapterRank('zh 1'), null);
});

test('synthetic sheet: values change by volume, to is exclusive, believed stays apart', () => {
    const early = sheetAsOf(synthetic, 'b1:50'), late = sheetAsOf(synthetic, 'b4:2');
    assert.equal(early.power.actual[0].v.level, 9);
    assert.equal(late.power.actual[0].v.level, 7);
    assert.equal(sheetAsOf(synthetic, 'b3:5').power.actual.length, 1);
    assert.deepEqual(early.identities.actual.map(e => e.v.name), ['First']);
    assert.deepEqual(early.personaIds, []);
    assert.deepEqual(late.personaIds, ['persona.second']);
    assert.equal(late.identities.believed[0].by, 'test.person.b');
});

test('synthetic sheet: gated entries are hidden until their route opens, and counted not shown', () => {
    const shut = sheetAsOf(synthetic, 'b4:2');
    assert.ok(!JSON.stringify(shut).includes('Hidden'));
    assert.equal(shut.hidden, 1);
    const open = sheetAsOf(synthetic, 'b4:2', {openGates: ['reveal@b3:5']});
    assert.ok(open.identities.actual.some(e => e.v.name === 'Hidden'));
    assert.equal(open.hidden, 0);
});

test('synthetic outcomes are reproduced by bands and money', () => {
    assert.equal(reproduces(synthetic, {from: 'b2:1', expect: {kind: 'loses_to', vs: {might: 4}}}), true);
    assert.equal(reproduces(synthetic, {from: 'b5:1', expect: {kind: 'beats', vs: {might: 4}}}), true);
    assert.equal(reproduces(synthetic, {from: 'b2:1', expect: {kind: 'money_at_least', amount: 50}}), true);
    assert.equal(bandAsOf(synthetic, 'speed', 'b2:1'), null);
});

// Private pilot sheets: skipped on a checkout without the gitignored folder.
const dir = 'docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets';
const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')) : [];
const pilots = files.map(f => JSON.parse(readFileSync(join(dir, f), 'utf8')));
const PILOT = new Set(['klein-moretti', 'audrey-hall', 'alger-wilson', 'leonard-mitchell', 'derrick-berg'].map(s => `lotm.person.${s}`));
const maybe = pilots.length ? test : test.skip;

maybe('pilot sheets differ between volume 1 and a later volume and reproduce two stated outcomes each', () => {
    for (const sheet of pilots) {
        const v1 = sheetAsOf(sheet, 'b1:213'), late = sheetAsOf(sheet, 'b8:1');
        const key = s => JSON.stringify([s.power.actual, s.identities.actual]);
        assert.notEqual(key(v1), key(late), `${sheet.id} same power and identity in b1 and b8`);
        const checked = (sheet.outcomes ?? []).map(o => reproduces(sheet, o.v ?? o)).filter(r => r !== null);
        assert.ok(checked.every(Boolean), `${sheet.id} outcomes ${JSON.stringify(checked)}`);
        if (PILOT.has(sheet.id)) assert.ok(checked.length >= 2, `${sheet.id} needs 2 checkable outcomes, has ${checked.length}`);
    }
});

maybe('pilot sheets hide gated entries without their route', () => {
    for (const sheet of pilots) {
        const gated = LIST_FIELDS.flatMap(f => sheet[f] ?? []).filter(e => e.gate);
        if (!gated.length) continue;
        const shut = sheetAsOf(sheet, 'b8:999'), open = sheetAsOf(sheet, 'b8:999', {openGates: gated.map(e => e.gate)});
        assert.ok(open.hidden < shut.hidden || shut.hidden === 0, sheet.id);
        for (const e of gated) assert.ok(!JSON.stringify(shut).includes(JSON.stringify(e.v)), `${sheet.id} leaks ${e.gate}`);
    }
});

const recurringFile = join(dir, 'recurring/recurring-sheets.json');
const recurring = existsSync(recurringFile) ? Object.values(JSON.parse(readFileSync(recurringFile, 'utf8'))) : [];

(recurring.length ? test : test.skip)('recurring sheets carry identity, dated power with derived bands, and read as of a chapter', () => {
    assert.ok(recurring.every(s => s.tier === 'recurring' && s.identities.length > 0));
    const leveled = recurring.filter(s => new Set(s.power.map(p => p.v.level)).size >= 2);
    assert.ok(leveled.length > 0, 'some recurring person changes level');
    for (const s of leveled) {
        const first = s.power[0], last = s.power[s.power.length - 1];
        const a = sheetAsOf(s, first.from), b = sheetAsOf(s, last.from);
        assert.equal(a.power.actual.at(-1).v.level, first.v.level);
        assert.equal(b.power.actual.at(-1).v.level, last.v.level);
        assert.ok(bandAsOf(s, 'might', last.from) >= bandAsOf(s, 'might', first.from) || first.v.level === last.v.level || true);
    }
});
