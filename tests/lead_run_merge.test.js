import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, readFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {cleanLabel, locatorKey, loadShards, mergeAll, resolveTimeline, resolveRate, affordanceMatrix} from '../scripts/lead_run/merge_shards.mjs';

// Invented fixture rows, not source prose.
const cen = (id, label, kind, over = {}) => ({schema: 'census/1.3', id, label, zh: label, nameSource: 'pinyin-unconfirmed', kind, rung: 'M0', whereabouts: [], firstMention: 'zh 第1章 p1', touchedByLead: false, aliases: [], claimant: 'narration', note: '', ...over});
const scene = (beat, over = {}) => ({schema: 'lead-run/1.3', beat, order: 1, pov: 'lead', date: {anchor: null, offsetDays: null, value: 'date-unsettled', label: 'U'}, timeOfDay: {value: 'evening'}, place: 't.place.inn', deps: [],
    steps: [{verb: 'x', class: 'trade', label: 'S'}], touched: [], present: [], options: [], footprint: null, evidence: [{label: 'S', locator: 'zh 第1章 p2', kind: 'narration'}], ...over});

function fixture() {
    const dir = mkdtempSync(join(tmpdir(), 'merge-'));
    const put = (prefix, header, census, scenes, fills = [], people = null) => {
        writeFileSync(join(dir, `${prefix}_header.json`), JSON.stringify(header));
        for (const [k, rows] of [['census', census], ['scenes', scenes], ['fills', fills]]) writeFileSync(join(dir, `${prefix}_${k}.jsonl`), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
        if (people) writeFileSync(join(dir, `${prefix.replace(/m$/, '')}_people.jsonl`), people.map(r => JSON.stringify(r)).join('\n') + '\n');
    };
    put('a1m', {chapters: '1-3', grade: 'B'},
        [cen('t.person.ann', 'Ann', 'person', {firstMention: 'zh 第3章 p9'}), cen('t.person.ann', 'Ann (sister)', 'person', {firstMention: 'zh 第2章 p4', rung: 'M2', touchedByLead: true}), cen('t.place.inn', 'Inn', 'place'), cen('t.person.mask', 'Masked man', 'person')],
        [scene('lr.t.1', {present: ['t.person.ann'], touched: [{kind: 'place', id: 't.place.inn'}], date: {anchor: null, offsetDays: null, value: '1349-07', label: 'S'}, evidence: [{label: 'S', locator: 'zh 第1章 p2', kind: 'dialogue:Ann'}]}),
         scene('lr.t.2', {date: {anchor: 'lr.t.1', offsetDays: 2, value: null, label: 'I'}, deps: [{id: 'lr.t.1', kind: 'after'}, {id: 'lr.gone.9', kind: 'after'}], options: [{action: 'a', class: 'trade', needs: ['t.price.p1', 't.fill.f1'], taken: true}]})],
        [{schema: 'fill/1.3', id: 't.fill.f1', for: 't.place.inn'}]);
    put('b2m', {chapters: '4-6', grade: 'B'},
        [cen('t.person.ann', 'Ann', 'person', {firstMention: 'zh 第5章 p1'}), cen('t.person.stranger', 'Stranger', 'person'), cen('t.person.mask', 'Mask', 'person')],
        [scene('lr.t.3', {present: ['t.person.stranger'], date: {anchor: 'lr.t.2', offsetDays: 1, value: null, label: 'I'}})], [],
        [{id: 't.person.stranger', reveals: [{same_as: 't.person.mask', label: 'I', locator: 'zh 第4章 p1'}]}]);
    put('c3m', {chapters: '7-9', grade: 'C', route: 'batch'}, [cen('t.person.zzz', 'Z', 'person')], []);
    return dir;
}

test('cleanLabel drops qualifiers and descriptions; locatorKey orders by chapter then paragraph', () => {
    assert.equal(cleanLabel("Benson, Klein's older brother"), 'Benson');
    assert.equal(cleanLabel('Tingen (city)'), 'Tingen');
    assert.ok(locatorKey('zh 第2章 p9') < locatorKey('zh 第10章 p1'));
});

test('loadShards skips batch-route variants unless asked, in chapter order', () => {
    const dir = fixture();
    assert.deepEqual(loadShards(dir).map(s => s.prefix), ['a1m', 'b2m']);
    assert.equal(loadShards(dir, {includeBatch: true}).length, 3);
});

test('merge: reveals are proposals for review, not applied (CL102)', () => {
    const r = mergeAll(fixture());
    assert.ok(r.registry.some(x => x.id === 't.person.stranger'), 'an unreviewed reveal keeps both ids');
    assert.deepEqual(r.proposed.reveals.map(x => [x.from, x.to]), [['t.person.stranger', 't.person.mask']]);
    assert.equal(r.report.revealsForReview, 1);
    assert.equal(r.report.redirected, 0);
});

test('merge: one row per id, one label, earliest mention, best rung, a reviewed reveal folds two ids into one', () => {
    const r = mergeAll(fixture(), {overlay: {redirect: {'t.person.stranger': 't.person.mask'}}});
    const ids = r.registry.map(x => x.id);
    assert.equal(new Set(ids).size, ids.length);
    const ann = r.registry.find(x => x.id === 't.person.ann');
    assert.equal(ann.label, 'Ann');
    assert.ok(ann.aliases.includes('Ann (sister)'));
    assert.equal(ann.firstMention, 'zh 第2章 p4');
    assert.equal(ann.rung, 'M2');
    assert.ok(!ids.includes('t.person.stranger'), 'redirected id is folded into the revealed one');
    const mask = r.registry.find(x => x.id === 't.person.mask');
    assert.ok(mask.aliases.includes('Stranger'));
    assert.deepEqual(r.scenes.find(s => s.beat === 'lr.t.3').present, ['t.person.mask']);
    assert.equal(r.report.redirected, 1);
});

test('overlay redirect and labels apply without editing shard files', () => {
    const dir = fixture();
    const r = mergeAll(dir, {overlay: {labels: {'t.place.inn': 'The Inn'}, redirect: {'t.person.mask': 't.person.ann'}}});
    assert.equal(r.registry.find(x => x.id === 't.place.inn').label, 'The Inn');
    assert.ok(!r.registry.some(x => x.id === 't.person.mask'));
    assert.ok(readFileSync(join(dir, 'a1m_census.jsonl'), 'utf8').includes('t.person.mask'));
});

test('timeline follows anchors to an absolute root and counts unresolved deps', () => {
    const r = mergeAll(fixture());
    const t = Object.fromEntries(r.scenes.map(s => [s.beat, s.dateRef]));
    assert.equal(t['lr.t.2'].absolute, '1349-07');
    assert.equal(t['lr.t.2'].offsetDays, 2);
    assert.equal(t['lr.t.3'].offsetDays, 3);
    assert.equal(r.report.timeline.deps, 2);
    assert.equal(r.report.timeline.depsResolved, 1);
    const cyc = [scene('c1', {date: {anchor: 'c2', offsetDays: 1, value: null}}), scene('c2', {date: {anchor: 'c1', offsetDays: 1, value: null}})];
    assert.doesNotThrow(() => resolveTimeline(cyc));
});

test('enrich: lead touch, whereabouts with time of day, evidence-kind claimants', () => {
    const r = mergeAll(fixture());
    const ann = r.registry.find(x => x.id === 't.person.ann');
    assert.equal(ann.whereabouts[0].place, 't.place.inn');
    assert.equal(ann.whereabouts[0].timeOfDay, 'evening');
    assert.equal(ann.claimants['dialogue:Ann'], 1);
    assert.ok(ann.touchedByLead);
});

test('affordance matrix counts place by action class; resolve rate counts fills and flags the gap', () => {
    const r = mergeAll(fixture());
    assert.equal(r.affordance.cells['t.place.inn'].trade.steps, 3);
    assert.equal(r.affordance.cells['t.place.inn'].trade.options, 1);
    assert.deepEqual(r.affordance.classes, ['trade']);
    // t.price.p1 does not exist; t.fill.f1 does.
    assert.equal(r.report.resolve.needs.refs, 2);
    assert.equal(r.report.resolve.needs.resolved, 1);
    assert.deepEqual(resolveRate([{shard: 'x', place: 't.a.b', present: [], touched: [], options: []}], new Set(['t.a.b'])).overall, 1);
    assert.equal(affordanceMatrix([], []).filledCells, 0);
});

test('proposed overlay folds proper names of one kind, sends common nouns and mixed kinds to review; role words never become aliases', async () => {
    const {proposeOverlay} = await import('../scripts/lead_run/merge_shards.mjs');
    const p = proposeOverlay([
        {proper: true, ids: [{id: 't.place.a', kind: 'place', rows: 1, first: 5}, {id: 't.place.a-city', kind: 'place', rows: 4, first: 9}]},
        {proper: true, ids: [{id: 't.item.rye-bread', kind: 'item', rows: 1, first: 1}, {id: 't.item.bread', kind: 'item', rows: 2, first: 1}]},
        {proper: true, ids: [{id: 't.place.u', kind: 'place', rows: 1, first: 1}, {id: 't.organization.u', kind: 'organization', rows: 1, first: 1}]},
    ]);
    assert.deepEqual(p.redirect, {'t.place.a': 't.place.a-city'});
    assert.equal(p.review.length, 2);
    const dir = fixture();
    writeFileSync(join(dir, 'a1m_census.jsonl'), JSON.stringify(cen('t.person.k', 'K', 'person', {aliases: ['哥哥', '警官', 'Kay']})) + '\n');
    const k = mergeAll(dir).registry.find(x => x.id === 't.person.k');
    assert.deepEqual(k.aliases, ['Kay']);
});

test('--match includes batch-route shards by prefix; texture places feed the affordance matrix; extras ids are redirected', () => {
    const dir = fixture();
    writeFileSync(join(dir, 'c3_places.jsonl'), JSON.stringify({id: 't.place.inn', affordances: [{class: 'rest', what: 'beds', needs: ['t.person.stranger']}]}) + '\n');
    const r = mergeAll(dir, {match: /^(a1m|b2m|c3m)$/, overlay: {redirect: {'t.person.stranger': 't.person.mask'}}});
    assert.equal(r.report.shards, 3);
    assert.equal(r.affordance.cells['t.place.inn'].rest.texture, 1);
    assert.deepEqual(r.extras.find(x => x.extra === 'places').affordances[0].needs, ['t.person.mask']);
    assert.equal(r.report.extras.places, 1);
});

test('a label derived from the id fills in only when no reader gave a real label', () => {
    const dir = fixture();
    writeFileSync(join(dir, 'a1m_census.jsonl'), [cen('t.person.ann', 'Ann', 'person'), cen('t.person.ann', 'Ann Row', 'person', {labelFrom: 'id', nameSource: 'wiki'}), cen('t.person.ann', 'Ann Row', 'person', {labelFrom: 'id'}),
        cen('t.person.bo', 'Bo', 'person', {labelFrom: 'id'})].map(r => JSON.stringify(r)).join('\n') + '\n');
    const reg = mergeAll(dir).registry;
    assert.equal(reg.find(x => x.id === 't.person.ann').label, 'Ann');
    assert.equal(reg.find(x => x.id === 't.person.bo').label, 'Bo');
});

test('rows read before the label fix: an evidence label is no label, so the id or printed name stands in', () => {
    const dir = fixture();
    writeFileSync(join(dir, 'a1m_census.jsonl'), [cen('t.person.old-man', 'S', 'person', {zh: '老人'}), cen('t.person.ann', 'S', 'person', {zh: 'Ann Smith'}), cen('t.person.ann', 'Ann', 'person')].map(r => JSON.stringify(r)).join('\n') + '\n');
    const reg = mergeAll(dir).registry;
    assert.equal(reg.find(x => x.id === 't.person.old-man').label, 'Old Man');
    assert.equal(reg.find(x => x.id === 't.person.ann').label, 'Ann');
    assert.ok(!reg.find(x => x.id === 't.person.ann').aliases.includes('S'));
});
