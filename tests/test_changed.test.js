import test from 'node:test';
import assert from 'node:assert/strict';
import {isDoc, reachGraph, selectTests, slowTier, smallSelection, stripComments} from '../scripts/test_changed.mjs';

const pick = (changed, graph, texts = {}, tests = [...graph.keys()].filter(f => f.endsWith('.test.js'))) =>
    selectTests({changed, tests, graph, readText: f => texts[f] ?? ''});

test('a change selects tests that import it directly or through other imports, and says why', () => {
    const graph = new Map([
        ['tests/a.test.js', ['src/a.js']], ['src/a.js', ['src/b.js']], ['src/b.js', []],
        ['tests/other.test.js', ['src/other.js']], ['src/other.js', []]]);
    const {mode, why} = pick(['src/b.js'], graph);
    assert.equal(mode, 'changed');
    assert.deepEqual([...why.keys()], ['tests/a.test.js']);
    assert.match(why.get('tests/a.test.js')[0], /reaches src\/b\.js through its imports/);
});

test('a changed test runs itself; package files run everything; docs-only marks the doc checks', () => {
    const graph = new Map([['tests/a.test.js', []], ['tests/b.test.js', []]]);
    assert.deepEqual([...pick(['tests/b.test.js'], graph).why.keys()], ['tests/b.test.js']);
    assert.equal(pick(['package.json'], graph).mode, 'full');
    assert.equal(pick(['package.json'], graph).why.size, 2);
    const docs = pick(['docs/X.md', 'PROJECT.md'], graph);
    assert.equal(docs.docsOnly, true);
    assert.equal(docs.why.size, 0);
    assert.ok(isDoc('AGENTS.md') && isDoc('docs/a/b.json') && !isDoc('docs/gm/check.mjs') && !isDoc('src/x.js'));
});

test('named paths count as whole tokens outside comments; folder walkers see game files only', () => {
    const graph = new Map([['tests/read.test.js', []], ['tests/walk.test.js', []], ['tests/near.test.js', []]]);
    const texts = {
        'tests/read.test.js': "readFileSync(new URL('../docs/T.md', import.meta.url))",
        'tests/near.test.js': "// see docs/T.md\nimport('./src/combat_items.js')",
        'tests/walk.test.js': "for (const f of readdirSync('src')) {}",
    };
    assert.deepEqual([...pick(['docs/T.md'], graph, texts).why.keys()], ['tests/read.test.js']);
    assert.deepEqual([...pick(['src/items.js'], graph, texts).why.keys()], ['tests/walk.test.js']);
    assert.deepEqual([...pick(['scripts/tool.mjs'], graph, texts).why.keys()], []);
    assert.equal(stripComments("a // b\nc 'https://x' /* d */"), "a \nc 'https://x' ");
});

test('on the real repo, a helper and a module select their known dependents', async () => {
    const tests = ['tests/accessory_utility.test.js', 'tests/authority.test.js', 'tests/slot_run.test.js'];
    const {graph, unparsed} = await reachGraph(tests);
    assert.deepEqual(unparsed, []);
    const helper = pick(['tests/helpers/native_loader.mjs'], graph, {}, tests);
    assert.deepEqual([...helper.why.keys()], ['tests/accessory_utility.test.js']);
    const heat = pick(['src/heat.js'], graph, {}, tests);
    assert.ok(heat.why.has('tests/authority.test.js'), 'authority.test.js imports src/heat.js');
    assert.ok(!heat.why.has('tests/slot_run.test.js'));
    // loadNative('...from "./src/items.js"') is followed as an edge, not only as text.
    assert.ok(graph.get('tests/accessory_utility.test.js').some(f => f.startsWith('src/')));
});

test('only a selection of at most a tenth of the suite may use the second heavy slot', () => {
    assert.ok(smallSelection(84, 840));
    assert.ok(!smallSelection(430, 840));
    assert.ok(smallSelection(1, 5));
});

test('slow-tier files keep explicit transitive dependencies and defer broad folder matches', () => {
    const graph = new Map([['tests/play.test.js', ['src/a.js']], ['src/a.js', ['src/b.js']], ['src/b.js', []]]);
    const slow = slowTier({files: {'tests/play.test.js': {ms: 60000, tier: 'slow', why: 'plays the game'}}});
    const far = selectTests({changed: ['src/b.js'], tests: ['tests/play.test.js'], graph, readText: () => '', slow});
    assert.match(far.why.get('tests/play.test.js')[0], /reaches src\/b\.js/);
    const near = selectTests({changed: ['src/a.js'], tests: ['tests/play.test.js'], graph, readText: () => '', slow});
    assert.ok(near.why.has('tests/play.test.js'));
    const self = selectTests({changed: ['tests/play.test.js'], tests: ['tests/play.test.js'], graph, readText: () => '', slow});
    assert.ok(self.why.has('tests/play.test.js'));
    const broad = selectTests({changed: ['src/other.js'], tests: ['tests/play.test.js'], graph, readText: () => 'readdirSync(dir)', slow});
    assert.match(broad.deferred.get('tests/play.test.js')[0], /walks folders/);
});
