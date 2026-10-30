// RPX1/RPX2: the bench detail -> rite circle, making tracks and risk ledger. Invented names only (CLR3).
import test from 'node:test';
import assert from 'node:assert/strict';
import {riteCircleSpec, makingSpec, riskLedger, minutesText} from '../src/ui/rite_figure.js';
import {figureText, validateFigureSpec} from '../src/ui/figure.js';
import {BENCH_PREPARING, BENCH_BREWING, RITUAL_FIXTURES} from '../src/ui/preview/fixtures/rituals.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const base = {id: 'ash_7', name: 'Ash Reader', seq: 7, pathway: 'Ash', status: 'brewable', minutes: 60, via: null, ritual: null, rite: null,
    formulaKnown: false, brewing: false, ready: false, left: 0, doses: 0, slots: [{id: 'main', role: 'main material', name: 'Grey reed', need: 2, held: 1}]};
const steps = spec => spec.tracks.find(t => t.id === 'brew').steps.map(s => s.state);

test('each rite condition is a slot whose state word matches its grade, and the risk sits at the centre', () => {
    const text = figureText(riteCircleSpec(BENCH_PREPARING));
    assert.match(text, /1\. Under a silent bell \(filled\)/);
    assert.match(text, /2\. Before the first bird \(strained\)/);
    assert.match(text, /3\. Holding one breath \(empty\)/);
    assert.match(text, /62% risk \(strained\)/);
    assert.match(text, /62% chance of losing control if drunk now/);
    assert.ok(!/broken/.test(text), 'nothing is attempted, so nothing is broken');
});

test('the risk ledger ranks what each unmet condition adds and says what to fix first', () => {
    const ledger = riskLedger(BENCH_PREPARING);
    assert.deepEqual(ledger.rows.map(r => [r.id, r.share]), [['breath', 67], ['hour', 33], ['bell', 0]]);
    assert.match(ledger.advice, /Fix first: Holding one breath, about 67%/);
    assert.match(ledger.rows[1].text, /Stand-in: a shuttered room by day \(fit 0.5\)/);
    assert.match(ledger.rows[0].text, /Missing\. Wanted: you practised the long breath today/);
    assert.match(riskLedger(BENCH_BREWING).advice, /Nothing left to fix/);
    assert.equal(riskLedger(base), null);
});

test('a formula with no rite draws no circle; materials count as held', () => {
    assert.equal(riteCircleSpec(base), null);
    const spec = validateFigureSpec(makingSpec(base));
    assert.deepEqual(spec.tracks.map(t => t.id), ['materials', 'brew']);
    assert.match(figureText(spec), /Track Materials, 0 of 1 held: 1\. Grey reed 1\/2 \(empty\)/);
    assert.deepEqual(steps(spec), ['current', 'pending', 'pending', 'pending', 'pending']);
});

test('the brew track follows formula, materials, brewing, bottling and holding a dose', () => {
    const full = [{...base.slots[0], held: 2}];
    assert.deepEqual(steps(makingSpec({...base, formulaKnown: true})), ['done', 'current', 'pending', 'pending', 'pending']);
    assert.deepEqual(steps(makingSpec({...base, formulaKnown: true, slots: full})), ['done', 'done', 'current', 'pending', 'pending']);
    const brewing = makingSpec({...base, formulaKnown: true, brewing: true, left: 135});
    assert.deepEqual(steps(brewing), ['done', 'done', 'current', 'pending', 'pending']);
    assert.equal(brewing.tracks[1].steps[2].label, 'Brew · 2 h 15 min left');
    assert.equal(brewing.tracks[1].steps[2].effect, 'pulse');
    assert.deepEqual(steps(makingSpec({...base, formulaKnown: true, brewing: true, ready: true})), ['done', 'done', 'done', 'current', 'pending']);
    assert.deepEqual(steps(makingSpec({...base, formulaKnown: true, doses: 1})), ['done', 'done', 'done', 'done', 'current']);
    assert.deepEqual([45, 120, 1440].map(minutesText), ['45 min', '2 h', '24 h']);
});

test('inspect-only rows and main-route rows draw no brew track and claim no holdings', () => {
    const inspect = makingSpec({...base, status: 'inspect'});
    assert.deepEqual(inspect.tracks.map(t => t.id), ['materials']);
    assert.deepEqual(inspect.tracks[0].steps, [{label: 'Grey reed', role: 'material'}]);
    const via = makingSpec({...base, via: 'Brewed with the actions above.'});
    assert.deepEqual(via.tracks.map(t => t.id), ['materials']);
    assert.match(figureText(via), /Brewed with the actions above\./);
    assert.equal(makingSpec(null), null);
    assert.equal(makingSpec({...base, slots: [], status: 'inspect'}), null);
});

test('marks carry semantic roles; glow marks only met conditions; the gallery registers every fixture', () => {
    const circle = riteCircleSpec(BENCH_BREWING);
    assert.ok(circle.slots.every(s => s.role === 'condition' && s.state === 'filled' && s.effect === 'glow'));
    assert.ok(riteCircleSpec(BENCH_PREPARING).slots.filter(s => s.state !== 'filled').every(s => !s.effect));
    assert.equal(circle.nodes[0].role, 'risk');
    for(const spec of RITUAL_FIXTURES) { validateFigureSpec(spec); assert.ok(FIGURE_FIXTURES.includes(spec)); }
    assert.equal(new Set(RITUAL_FIXTURES.map(s => s.id)).size, RITUAL_FIXTURES.length);
});
