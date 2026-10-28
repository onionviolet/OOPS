import test from 'node:test';
import assert from 'node:assert/strict';
import {parseShard, lintFills, lintHeader, lintScenes} from '../scripts/lead_run/lint_lead_run.mjs';
import {extractCandidates, buildGlossary, glossaryHits, auditShard} from '../scripts/lead_run/shard_tools.mjs';

// Invented fixture text, not source prose.
const text = '=== 第1章 测试 | member x\np1: 约翰·史密斯在七点钟出门。\np2: 面包九便士，走了三公里。\np3: 无关。';
const shard = parseShard(text);

test('candidates find money, time, measure and dotted names with locators', () => {
    const kinds = new Set(extractCandidates(shard).map(c => `${c.kind}@${c.locator}`));
    for (const k of ['name@zh 第1章 p1', 'time@zh 第1章 p1', 'money@zh 第1章 p2', 'measure@zh 第1章 p2']) assert.ok(kinds.has(k), k);
});

test('glossary prefers census ids over wiki labels and matches given names', () => {
    const g = buildGlossary({wikiPages: [{title: 'John Smith', text: '|chinese = 约翰.史密斯'}, {title: 'Episode 2', text: '|chinese = 面包'}],
        censusRows: [{zh: '面包', id: 'test.person.bread', label: 'Bread', kind: 'person'}]});
    const hits = glossaryHits(g, text);
    assert.ok(hits.some(h => h.label === 'John Smith' && h.source === 'wiki'));
    assert.ok(hits.some(h => h.id === 'test.person.bread' && h.label === 'Bread'));
    const merged = buildGlossary({wikiPages: [{title: 'John Smith', text: '|chinese = 约翰.史密斯'}],
        censusRows: [{zh: '约翰·史密斯', id: 'test.org.x', label: 'Yuehan', kind: 'person'}]});
    assert.equal(merged.get('约翰·史密斯').label, 'John Smith');
    assert.equal(merged.get('约翰·史密斯').id, 'test.organization.x');
    assert.ok(!buildGlossary({censusRows: [{zh: '九便士', id: 'test.price.bread', kind: 'price'}]}).has('九便士'));
    assert.ok(!buildGlossary({censusRows: [{zh: '卧室', id: 'test.place.someones-room', kind: 'place'}]}).has('卧室'));
});

test('fills and headers lint by schema 1.3', () => {
    const fill = {schema: 'fill/1.3', id: 'test.fill.hours', status: 'authored-proposal', basis: ['zh 第1章 p2'], layer: 'period', replaceableBy: 'later reading'};
    assert.deepEqual(lintFills([fill]), []);
    assert.ok(lintFills([{...fill, layer: 'stated'}]).some(i => i.code === 'fill-layer'));
    assert.ok(lintHeader({schema: 'shard-header/1.3'}).some(i => i.code === 'header-field'));
});

test('1.3 scenes need vocabulary motives, a pov and choice labels', () => {
    const scene = {schema: 'lead-run/1.3', beat: 'lr.test.v1.001', order: 1, pov: 'lead',
        date: {value: 'date-unsettled', label: 'U'}, place: 'x', weight: 'routine', steps: [{verb: 'buy', class: 'trade', label: 'S'}],
        motives: [{tag: 'thrift'}], choices: [{taken: 'wait', label: 'S', locator: 'zh 第1章 p2'}],
        evidence: [{label: 'S', locator: 'zh 第1章 p2', kind: 'narration'}]};
    assert.deepEqual(lintScenes([scene]), []);
    const codes = lintScenes([{...scene, pov: '', motives: [{tag: 'peckish'}], choices: [{label: 'wait', locator: 'zh 第1章 p2'}]}]).map(i => i.code);
    for (const c of ['pov', 'motive-tag', 'choice-label']) assert.ok(codes.includes(c), c);
});

test('audit grades: A needs a spot check, B tolerates small name misses, C on lint failure', () => {
    const census = [{schema: 'census/1.3', id: 'test.item.bread', label: 'Bread', zh: '面包', nameSource: 'repo', kind: 'item', rung: 'M1',
        whereabouts: [{place: 'p', era: 'v1', status: 'stated'}], firstMention: 'zh 第1章 p2', aliases: []}];
    assert.equal(auditShard({census, shardMap: shard, spotChecked: 5}).grade, 'A');
    assert.equal(auditShard({census, shardMap: shard}).grade, 'B');
    assert.equal(auditShard({census: [{...census[0], schema: 'census/9'}], shardMap: shard}).grade, 'C');
});

test('shard runner numbers paragraphs per chapter and keeps only the first run of chapter links', async () => {
    const {chapterLinks, shardText} = await import('../scripts/lead_run/prepare_shard.mjs');
    const nav = '<a href="../Text/c1.xhtml">第1章 甲</a><a href="../Text/c2.xhtml">第2章 乙</a><a href="../Text/p2.xhtml">部</a><a href="../Text/d1.xhtml">第1章 丙</a>';
    const links = chapterLinks(nav, 'OEBPS/Text');
    assert.equal(links.length, 3);
    assert.equal(links[0].member, 'OEBPS/Text/c1.xhtml');
    const {text, index} = shardText([{n: 1, title: '第1章 甲', member: 'm', xhtml: '<p>一</p><p></p><p>二 &amp; 三</p>'}]);
    assert.equal(text, '=== 第1章 甲 | member m\np1: 一\np2: 二 & 三');
    assert.deepEqual(index, [{chapter: 1, member: 'm', paragraphs: 2, chars: 6}]);
});

test('migration patches mechanical fields and lists what needs review', async () => {
    const {migrateScene, migrateCensus, migrateFill} = await import('../scripts/lead_run/migrate_shard.mjs');
    const review = [];
    const s = migrateScene({schema: 'lead-run/1.1', beat: 'lr.test.v1.001', date: {label: 'same night'},
        steps: [{verb: 'pocket'}], motives: [{tag: 'fear-of-unknown'}, {tag: 'whimsy'}], choices: [{label: 'eat first'}],
        touched: [{id: 'test.org.x'}]}, review);
    assert.equal(s.date.label, 'I');
    assert.equal(s.choices[0].label, 'I');
    assert.equal(s.motives[0].tag, 'fear');
    assert.equal(s.touched[0].id, 'test.organization.x');
    assert.deepEqual(review.map(r => r.need).sort(), ['action-class', 'motive']);
    assert.equal(migrateCensus({schema: 'census/1.1', id: 'test.org.x', kind: 'org'}).kind, 'organization');
    assert.equal(migrateFill({schema: 'fill/1.1'}).replaceableBy, 'later reading');
});

test('migration repairs string deps, foreign anchors, free-text evidence labels and unplaced M1 rows', async () => {
    const {migrateScene, migrateCensus} = await import('../scripts/lead_run/migrate_shard.mjs');
    const s = migrateScene({beat: 'lr.test.v1.002', deps: ['lr.test.v1.001'], date: {anchor: 'shard-start', offsetDays: 0, label: 'I'},
        evidence: [{label: 'narration', locator: 'zh 第1章 p1', kind: 'narration'}]}, [], new Set(['lr.test.v1.001', 'lr.test.v1.002']));
    assert.deepEqual(s.deps, [{id: 'lr.test.v1.001', kind: 'after'}]);
    assert.equal(s.date.value, 'date-unsettled');
    assert.equal(s.evidence[0].label, 'I');
    assert.equal(migrateCensus({id: 'test.item.x', rung: 'M1', whereabouts: []}).rung, 'M0');
    const review = [];
    assert.equal(migrateScene({beat: 'lr.test.v1.003', weight: 'great', footprint: null}, review).weight, 'routine');
    assert.equal(review[0].need, 'great-without-footprint');
});

test('glossary shows the printed dot form and migration wraps a free-text footprint window', async () => {
    const g = buildGlossary({wikiPages: [{title: 'John Smith', text: '|chinese = 约翰·史密斯'}]});
    assert.equal(glossaryHits(g, 'p1: 约翰.史密斯来了')[0].zh, '约翰.史密斯');
    const {migrateScene} = await import('../scripts/lead_run/migrate_shard.mjs');
    const s = migrateScene({beat: 'lr.test.v1.004', weight: 'great', footprint: {places: 'x', window: 'that night'}}, []);
    assert.deepEqual(s.footprint, {places: ['x'], window: {note: 'that night'}, hazards: [], roles: []});
});

test('idiomatic 一点 and 一时 are not time candidates; 一点钟 is', () => {
    const m = parseShard('=== 第1章 测试 | member x\np1: 慢一点，一时没想到。\np2: 一点钟见。');
    const times = extractCandidates(m).filter(c => c.kind === 'time').map(c => c.locator);
    assert.deepEqual(times, ['zh 第1章 p2']);
});

test('fractional money amounts are one candidate', () => {
    const m = parseShard('=== 第1章 测试 | member x\np1: 找回四分之一便士。');
    assert.deepEqual(extractCandidates(m).filter(c => c.kind === 'money').map(c => c.value), ['四分之一便士']);
});

test('migration moves a first mention to where the name is printed, and flags names absent from the shard', async () => {
    const {relocateFirstMention} = await import('../scripts/lead_run/migrate_shard.mjs');
    const review = [];
    assert.equal(relocateFirstMention({id: 'a', zh: '面包', firstMention: 'zh 第1章 p9'}, shard, review).firstMention, 'zh 第1章 p2');
    assert.equal(relocateFirstMention({id: 'b', zh: '不存在', firstMention: 'zh 第1章 p1'}, shard, review).firstMention, 'zh 第1章 p1');
    assert.deepEqual(review, [{id: 'b', need: 'name-not-in-shard'}]);
});

test('wiki template remnants are stripped from glossary names', () => {
    const g = buildGlossary({wikiPages: [{title: 'Some Name', text: '|chinese = 洛耀·莱汀}}'}]});
    assert.ok(g.has('洛耀·莱汀'));
});
