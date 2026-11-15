import test from 'node:test';
import assert from 'node:assert/strict';
import {formatDecimal, formatPercent, formatMultiplier, formatRatio, formatDuration, moneyParts, formatMoneyText} from '../src/number_format.js';

test('one format per quantity (UR117, element audit UIC102)', () => {
    assert.equal(formatPercent(0.05), '5%');
    assert.equal(formatPercent(0.125), '12.5%');
    assert.equal(formatMultiplier(1.3), '×1.3');
    assert.equal(formatDecimal(31.623, 1), '31.6');
    assert.equal(formatRatio(0, 10, 'xp'), '0/10 xp');
    assert.equal(formatDuration(45), '45 min');
    assert.equal(formatDuration(60), '1 h');
    assert.equal(formatDuration(90), '1 h 30 min');
    assert.equal(formatDuration(1440 * 2 + 180), '2 days 3 h');
});

test('money text matches the purse denominations', () => {
    assert.deepEqual(moneyParts(104), [[10, 'C'], [4, 'W']]);
    assert.equal(formatMoneyText(104), '10C 4W');
    assert.equal(formatMoneyText(104, {denominations: false}), '104 coins');
    assert.equal(formatMoneyText(1), '1W');
    assert.equal(formatMoneyText(0), 'nothing');
    assert.equal(formatMoneyText(123456), '1G 23S 45C 6W');
    assert.equal(formatMoneyText(-30), '-3C');
});

test('formatGlance rounds for a list and keeps one of a thing singular (UIC148)', async () => {
    const {formatGlance} = await import('../src/number_format.js');
    assert.equal(formatGlance(31.623, 'AP'), '31.6 AP');
    assert.equal(formatGlance(1.234, 'damage'), '1.23 damage');
    assert.equal(formatGlance(1, 'points'), '1 point');
    assert.equal(formatGlance(1, 'hits'), '1 hit');
    assert.equal(formatGlance(12, 'points'), '12 points');
    assert.equal(formatGlance(0, 'hp/s'), '0 hp/s');
    assert.equal(formatGlance(NaN, 'AP'), '?');
});

test('shortOfText names how many materials a recipe lacks (UIC172)', async () => {
    const {shortOfText} = await import('../src/crafting_visibility.js');
    assert.equal(shortOfText([{missing: true}, {missing: false}, {missing: false}]), 'short 1 of something unfamiliar');
    assert.equal(shortOfText([{missing: true, known: true, need: 3, have: 1, material: {material_id: 'Wool'}}, {missing: false}]), 'needs 2 Wool');
    assert.equal(shortOfText([{missing: true, known: false, need: 1, have: 0, material: {material_id: 'Strange ore'}}, {missing: false}]), 'short 1 of something unfamiliar');
    assert.equal(shortOfText([{missing: true}, {missing: true}, {missing: false}]), '2 of 3 materials short');
    assert.equal(shortOfText([{missing: true, known: true, need: 1, have: 0, material: {material_id: 'Fine wool cloth of the north'}}]), 'needs 1 Fine wool cloth of the north', 'PS101: a long known name is still named');
});

test('PS103: one state word per recipe row', async () => {
    const {recipeStateWord} = await import('../src/crafting_visibility.js');
    const req = m => ({missing: m});
    assert.equal(recipeStateWord({available: true, reasons: [], requirements: [req(false)]}), 'ready');
    assert.equal(recipeStateWord({available: false, reasons: ['missing 1 material'], requirements: [req(true), req(false)]}), 'near');
    assert.equal(recipeStateWord({available: false, reasons: ['missing 2 materials'], requirements: [req(true), req(true)]}), 'far');
    assert.equal(recipeStateWord({available: false, reasons: ['no station here', 'missing 1 material'], requirements: [req(true)]}), 'blocked');
    assert.equal(recipeStateWord({available: false, reasons: ['a material is reserved or you are busy'], requirements: [req(false)]}), 'blocked');
});

test('recipeRowSummary gives one short word and one spoken line per status (UIC172)', async () => {
    const {recipeRowSummary} = await import('../src/crafting_visibility.js');
    assert.deepEqual(recipeRowSummary({available: true, amount: 2, reasons: [], requirements: []}), {short: '2 ready', explanation: '2 attempts ready; results may vary'});
    assert.equal(recipeRowSummary({available: false, amount: 0, reasons: ['no station here'], requirements: [{missing: true}]}).short, 'No station');
    assert.equal(recipeRowSummary({available: false, amount: 0, reasons: ['missing 1 material'], requirements: [{missing: true}, {missing: false}]}).short, 'short 1 of something unfamiliar');
    assert.equal(recipeRowSummary({available: false, amount: 0, reasons: ['x'], requirements: []}).short, 'Unavailable');
});

test('paintRecipeTabCounts marks a skill tab with how many recipes are ready (UIC172)', async () => {
    const {paintRecipeTabCounts} = await import('../src/crafting_visibility.js');
    const tab = category => ({dataset: {crafting_category: category}, title: ''});
    const tabs = [tab('cooking'), tab('forging')], ready = {cooking: 2, forging: 0};
    const doc = {querySelectorAll: selector => selector.startsWith('.crafting_mainpage_button') ? tabs
        : {length: ready[selector.match(/data-crafting_category="([^"]+)"/)[1]]}};
    const frames = []; const original = globalThis.requestAnimationFrame; globalThis.requestAnimationFrame = fn => frames.push(fn);
    try {
        paintRecipeTabCounts(doc); paintRecipeTabCounts(doc);
        assert.equal(frames.length, 1, 'many repaints queue one pass');
        frames[0]();
        assert.equal(tabs[0].dataset.readyCount, '2'); assert.equal(tabs[0].title, '2 recipes ready to make');
        assert.equal(tabs[1].dataset.readyCount, undefined); assert.equal(tabs[1].title, 'Nothing ready to make here yet');
    } finally { globalThis.requestAnimationFrame = original; }
});

test('a gathering period reads time, real time, then each chance and yield (PS142)', async () => {
    const {gatherLine} = await import('../src/ui/gather_line.js');
    assert.equal(gatherLine({gathering_time_needed: 6, gained_resources: [{name: 'herb', chance: 0.4, count: [1, 2]}]}, n => n.toUpperCase()), 'Every 6 min (about 6 s real) · 40% · 1–2 HERB');
    assert.equal(gatherLine({gathering_time_needed: 90, gained_resources: [{name: 'a', chance: 1, count: [1, 1]}, {name: 'b', chance: 0.05, count: [2, 3]}]}), 'Every 1 h 30 min (about 1 min 30 s real) · 100% · 1 a; 5% · 2–3 b');
    assert.equal(gatherLine({gathering_time_needed: 5, gained_resources: [{name: 'c', chance: 0.002, count: [1, 1]}]}), 'Every 5 min (about 5 s real) · <1% · 1 c');
    assert.equal(gatherLine({}), '');
});

test('Stop says what it keeps and what it loses, by activity type (PS141)', async () => {
    const {stopOutcome} = await import('../src/ui/gather_line.js');
    assert.equal(stopOutcome('GATHERING', 28), 'Stop keeps what you found; the current 28 min search is lost.');
    assert.equal(stopOutcome('JOB', 120), '', 'a job says it in its own pay line');
    assert.equal(stopOutcome('TRAINING', 1), 'Stop keeps all practice so far.');
    assert.equal(stopOutcome('SLEEP', 1), '');
});
