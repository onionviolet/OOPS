// Story director (STY10, STY11, STY30): pacing over already-caused candidates, keyed, rechecked, receipts, no saved state.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {directWindow, runDirector, validateDirector, quietWeight, whyLine} from '../src/story_director.js';
import {tingenDirected, tingenDraws, TINGEN_DIRECTOR, slotFacts} from '../src/book_world_lotm_deck.js';
import {eventFeed} from '../src/event_feed.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition} from '../src/expedition_content.js';
import {createStreams} from '../src/seeded_streams.js';

const spec = validateDirector({id: 't', quiet: 2, tensionQuiet: .5, cooldown: 3, attempts: 2, dry: {after: 2, relief: .5, floor: .2},
    categories: {texture: {weight: 3, hold: 0, tension: -.8, comfort: 1}, pressure: {weight: 1, hold: 1, tension: 8}}});
const born = w => [{id: `tex${w % 5}`, category: 'texture', weight: 1}, {id: `prs${w % 3}`, category: 'pressure', weight: 1}];
const none = {heat: () => null, positions: () => []};
const tingen = (seed = 7, days = 20, heat = 0) => {
    const s = initializeExpedition(createExpansionState(seed));
    s.actors.player.worldId = 'book.lotm.tingen'; s.streams = createStreams(seed); s.lotm = {initializedAt: 1000}; s.clock = 1000 + days * 1440 + 600;
    return s;
};
const share = (tension, sig) => { const out = runDirector(spec, 9, 399, born, () => ({tension}), sig).filter(o => o.surfaced); return out.filter(o => o.surfaced.category === 'pressure').length / out.length; };

test('keyed: same seed and windows replay the same run, a different seed does not', () => {
    const ids = (seed, sig) => runDirector(spec, seed, 80, born, () => ({tension: .3}), sig).map(o => o.surfaced?.id ?? null);
    assert.deepEqual(ids(4, 'a'), ids(4, 'b'));
    assert.notDeepEqual(ids(4, 'c'), ids(5, 'd'));
    assert.ok(ids(4, 'a').some(Boolean) && ids(4, 'a').some(x => x === null));
});
test('tension raises pressure share and lowers quiet (timing dial, not a new cause)', () => {
    assert.ok(share(1, 'hi') > share(0, 'lo') + .2);
    assert.ok(quietWeight(spec, 1, 0) < quietWeight(spec, 0, 0));
});
test('recheck at surfacing: a failed recheck spends nothing, starts no cooldown and is receipted', () => {
    const pool = [{id: 'x', category: 'texture', weight: 1, recheck: () => false}];
    const spec1 = {...spec, quiet: 0, attempts: 1};
    const r = directWindow(spec1, 3, 0, pool, {});
    assert.equal(r.surfaced, null);
    assert.deepEqual(r.receipt.rejected.map(x => x.id), ['x']);
    const run = runDirector({...spec1, id: 'rc'}, 3, 5, w => w === 0 ? pool : [], () => ({tension: 0}), 'rc');
    assert.ok(run.every(o => !o.surfaced));
});
test('a candidate cooled down after surfacing is not offered again inside the window', () => {
    const run = runDirector({...spec, id: 'cd', quiet: 0}, 2, 30, () => [{id: 'same', category: 'texture', weight: 1}], () => ({tension: 0}), 'cd');
    const at = run.filter(o => o.surfaced).map(o => o.window);
    for(let i = 1; i < at.length; i++) assert.ok(at[i] - at[i - 1] >= spec.cooldown);
});
test('held candidates may surface late; texture is of the moment', () => {
    const run = runDirector({...spec, id: 'hd', quiet: 6}, 11, 200, w => w % 7 === 0 ? [{id: `p${w}`, category: 'pressure', weight: 1}, {id: `t${w}`, category: 'texture', weight: 1}] : [], () => ({tension: 0}), 'hd');
    const late = run.filter(o => o.receipt.late);
    assert.ok(late.length > 0 && late.every(o => o.surfaced.category === 'pressure'));
    assert.equal(run.filter(o => o.surfaced?.category === 'texture' && o.surfaced.born !== o.window).length, 0);
});
test('validation and plain-words reading', () => {
    assert.throws(() => validateDirector({id: 'x'}));
    assert.equal(whyLine(null), '');
    assert.match(whyLine({surfaced: 'a', tension: .9, comfort: 0}), /on edge/);
});
test('Tingen: the director only surfaces cards the deck drew, heat shifts the mix, the feed carries a why line, nothing is saved', () => {
    const s = tingen(7, 60), drawn = new Set(tingenDraws(s, none).map((d, i) => d.cardId && `${d.cardId}@${i}`));
    const calm = tingenDirected(s, none), tense = tingenDirected(s, {heat: () => ({heat: [{level: 3}]}), positions: () => []});
    for(const o of calm) if(o.surfaced) assert.ok(drawn.has(`${o.surfaced.id}@${o.surfaced.born}`));
    const prs = run => run.filter(o => o.surfaced?.category === 'pressure').length, shown = run => run.filter(o => o.surfaced).length;
    assert.ok(prs(tense) / shown(tense) >= prs(calm) / shown(calm));
    assert.ok(shown(calm) < drawn.size - 1, 'the director thins the deck, it does not just echo it');
    const before = JSON.stringify(s), news = eventFeed(s).news;
    assert.equal(JSON.stringify(s), before);
    assert.ok(news.some(n => n.id.startsWith('tingen:deck') && n.why));
    assert.equal(TINGEN_DIRECTOR.id, 'tingen.director');
});
test('kind and per-category cooldown: repeated occurrences of one kind sit out together, other categories keep their own', () => {
    const sp = validateDirector({...spec, id: 'kc', quiet: 0, cooldown: 0, categories: {texture: {weight: 1, hold: 0, cooldown: 3}, pressure: {weight: 1, hold: 0}}});
    const run = runDirector(sp, 5, 40, w => [{id: `m${w}`, kind: 'meal', category: 'texture', weight: 1}], () => ({tension: 0}), 'kc');
    const at = run.filter(o => o.surfaced).map(o => o.window);
    assert.ok(at.length > 3);
    for(let i = 1; i < at.length; i++) assert.ok(at[i] - at[i - 1] >= 3);
    assert.throws(() => validateDirector({...sp, categories: {texture: {weight: 1, hold: 0, cooldown: -1}}}));
});
test('Tingen paces the same after the second-world words change (golden captured before it, 2026-11-10)', () => {
    const s = tingen(7, 60), hot = {heat: () => ({heat: [{level: 3}]}), positions: () => []};
    const rows = r => r.map(o => o.surfaced ? `${o.window}:${o.surfaced.id}@${o.surfaced.born}/${o.surfaced.category}|${whyLine(o.receipt)}` : `${o.window}:-`).join('\n');
    const out = rows(tingenDirected(s, none)) + '\n#\n' + rows(tingenDirected(s, hot));
    assert.equal(createHash('sha256').update(out).digest('hex').slice(0, 16), 'e5f4dc98f4189502');
    assert.equal(whyLine({surfaced: 'a', tension: 0, comfort: 0, late: true}, {calm: 'Calm.', late: 'Late.'}), 'Calm. Late.');
});
