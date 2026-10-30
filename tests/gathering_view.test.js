import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {gatheringModel, gatheringFigureSpec, durationWords, oddsWord} from '../src/gathering_model.js';
import {renderGatheringView} from '../src/ui/gathering_view.js';
import {figureText, validateFigureSpec} from '../src/ui/figure.js';
import {villageGatherView} from '../src/gathering_panel.js';
import {GATHER_BLOOM_VIEW, GATHER_FALL_VIEW, GATHER_PLAIN_VIEW, GATHER_INSIGHT_FULL_VIEW, GATHER_INSIGHT_LIMITED_VIEW, GATHERING_FIXTURES} from '../src/ui/preview/fixtures/gathering.js';

const host = () => { const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>'); return dom.document.getElementById('host'); };
const site = (m, id) => m.sites.find(s => s.id === id);

test('bloom: stock regrows from the owner, gates are in words, an ungathered site keeps its yield unknown', () => {
    const m = gatheringModel(GATHER_BLOOM_VIEW);
    assert.equal(site(m, 'reed-bank').stockWords, '9 of 12 left');
    assert.match(site(m, 'reed-bank').regrow, /regrows 6 a day, full in about 12 hours/);
    assert.deepEqual(site(m, 'reed-bank').yields.find(y => y.id === 'dawn-dew').gates, ['only 4:00 to 8:00']);
    assert.equal(site(m, 'salt-crust').gathered, false);
    assert.match(site(m, 'salt-crust').gives, /unknown/);
    assert.deepEqual(site(m, 'salt-crust').yields, [], 'no yield name leaks before the first gather');
});

test('fall: depleted and out-of-season rows say why, and the quote reason is shown as given', () => {
    const m = gatheringModel(GATHER_FALL_VIEW);
    assert.match(site(m, 'reed-bank').now, /^Depleted: regrows 6 a day, full in about 2 days/);
    assert.equal(site(m, 'blossom-bed').now, 'Waiting: only in spring');
    const spec = gatheringFigureSpec(m);
    assert.ok(spec.notes.some(n => /cut to the root/.test(n.text)));
    assert.match(m.glance, /you cannot gather now/);
});

test('season band: drawn only when the world has seasons; a season-gated yield gets its own lane (AD46)', () => {
    const withBand = gatheringFigureSpec(gatheringModel(GATHER_BLOOM_VIEW));
    assert.equal(withBand.bands.length, 1);
    assert.equal(withBand.bands[0].spans.filter(s => s.lane === undefined).length, 4);
    assert.equal(withBand.bands[0].spans.find(s => s.state === 'current').label, 'Bloom');
    assert.ok(withBand.bands[0].lanes.some(l => /^Blossom root$/.test(l)));
    const plain = gatheringFigureSpec(gatheringModel(GATHER_PLAIN_VIEW));
    assert.equal(plain.bands.length, 0);
    assert.doesNotMatch(figureText(plain), /season/i, 'a world without seasons says nothing about seasons');
    const unmapped = gatheringModel({...GATHER_BLOOM_VIEW, season: {id: null, list: []}});
    assert.equal(unmapped.season, null);
});

test('odds are words by default and numbers only in the insight view, marked as a cheat reveal; rare row follows the seat (UR80)', () => {
    const plain = figureText(gatheringFigureSpec(gatheringModel(GATHER_BLOOM_VIEW)));
    assert.doesNotMatch(plain, /of finds|a find|permille/);
    assert.equal(oddsWord(700), 'often');
    const full = gatheringFigureSpec(gatheringModel(GATHER_INSIGHT_FULL_VIEW));
    assert.match(full.bars[0].label, /revealed by cheat/);
    assert.ok(full.bars[0].rows.some(r => /rare find/.test(r.label)));
    const limited = gatheringFigureSpec(gatheringModel(GATHER_INSIGHT_LIMITED_VIEW));
    assert.equal(limited.bars[0].rows.some(r => /rare find/.test(r.label)), false);
});

test('freshness rows only for things with a shelf life, and spoiled is said', () => {
    const fresh = gatheringFigureSpec(gatheringModel(GATHER_INSIGHT_FULL_VIEW)).bars.find(b => b.label === 'Freshness');
    assert.match(fresh.rows[0].words, /about 4 hours of freshness left/);
    assert.equal(fresh.rows[1].words, 'spoiled');
    assert.equal(gatheringModel({...GATHER_BLOOM_VIEW, larder: [{name: 'Stone', spent: 5, life: 0}]}).fresh.length, 0);
    assert.equal(durationWords(0), '1 minute');
});

test('every fixture validates and keeps each fact in its text form', () => {
    for (const spec of GATHERING_FIXTURES) { validateFigureSpec(spec); assert.match(figureText(spec), /Table Sites here/); }
});

test('the view draws the figure and hands off without acting', () => {
    const node = host();
    let opened = 0;
    renderGatheringView(node, gatheringModel(GATHER_BLOOM_VIEW), {onOpen: () => { opened++; }});
    assert.ok(node.querySelector('[data-gather-figure] svg'));
    assert.match(node.querySelector('[data-gather-glance]').textContent, /3 sites here · Bloom/);
    node.querySelector('[data-open-gathering]').click();
    assert.equal(opened, 1);
    renderGatheringView(node, {empty: 'Nothing here can be gathered.', sites: []});
    assert.match(node.textContent, /Nothing here can be gathered/);
});

test('live village adapter: reads the one verge, no season band, weather does not gate, the quote decides eligibility', () => {
    const ctx = {world: 'base.frontier', location: 'Village', clock: 600, skill: 0};
    const view = villageGatherView({owner: null, context: ctx, quote: () => ({eligible: false, reason: 'Finish your current activity first.'}), observer: null});
    const m = gatheringModel(view);
    assert.equal(m.sites.length, 1);
    assert.equal(m.season, null);
    assert.equal(m.sites[0].stockWords, '12 of 12 left');
    const spec = gatheringFigureSpec(m);
    assert.equal(spec.bands.length, 0);
    assert.ok(spec.notes.some(n => /Weather does not change/.test(n.text)));
    assert.ok(spec.notes.some(n => /Finish your current activity/.test(n.text)));
    assert.equal(gatheringModel(villageGatherView({owner: null, context: {...ctx, location: 'Elsewhere'}, quote: () => ({}), observer: null})).empty, 'Your gathering places are elsewhere.');
});
