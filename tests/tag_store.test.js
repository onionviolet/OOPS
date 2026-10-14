import test from 'node:test';
import assert from 'node:assert/strict';
import {TagRegistry, TagStore, tagFacts} from '../src/tag_store.js';
import {evaluateRule} from '../src/rules.js';

const definitions = [
    {id: 'material', kind: 'category', revision: 1},
    {id: 'wood', kind: 'material', parents: ['material'], revision: 2},
    {id: 'oak', kind: 'material', parents: ['wood'], revision: 3},
    {id: 'pine', kind: 'material', parents: ['wood'], revision: 1},
    {id: 'wet', kind: 'state', revision: 1},
    {id: 'cursed', kind: 'magic', visible: 'hidden', revision: 4},
    {id: 'enchanted_oak', kind: 'magic', visible: 'hidden', parents: ['oak', 'cursed'], revision: 1},
];
const make = () => new TagStore(new TagRegistry(definitions));

test('transitive and multiple parents imply tags without adding explicit grants', () => {
    const store = make().add('staff', 'enchanted_oak');
    assert.deepEqual(store.tags('staff'), ['cursed', 'enchanted_oak', 'material', 'oak', 'wood']);
    assert.deepEqual(store.tags('staff', {implied: false}), ['enchanted_oak']);
    assert.equal(store.has('staff', 'wood'), true);
    assert.equal(store.has('staff', 'wet'), false);
    assert.deepEqual(store.tags('untracked'), []);
});

test('removal changes direct grants, preserving implications and independent grants', () => {
    const store = make().set('log', ['oak', 'pine', 'wood']);
    assert.equal(store.remove('log', 'wood'), true);
    assert.equal(store.has('log', 'wood'), true);
    store.remove('log', 'oak');
    assert.equal(store.has('log', 'wood'), true);
    store.remove('log', 'pine');
    assert.equal(store.has('log', 'wood'), false);
    assert.equal(store.remove('log', 'pine'), false);
    store.set('log', ['oak', 'wood']).remove('log', 'oak');
    assert.deepEqual(store.tags('log'), ['material', 'wood']);
});

test('registry accepts forward references and a diamond without duplicate implications', () => {
    const registry = new TagRegistry([
        {id: 'both', kind: 'test', revision: 1, parents: ['right', 'left']},
        {id: 'left', kind: 'test', revision: 1, parents: ['root']},
        {id: 'right', kind: 'test', revision: 1, parents: ['root']},
        {id: 'root', kind: 'test', revision: 1},
    ]);
    assert.deepEqual(registry.expand(['both']), ['both', 'left', 'right', 'root']);
});

test('self cycles, indirect cycles and unknown parents are rejected', () => {
    const def = (id, parents) => ({id, parents, kind: 'test', revision: 1});
    assert.throws(() => new TagRegistry([def('oak', ['oak'])]), /cycle/);
    assert.throws(() => new TagRegistry([def('a', ['b']), def('b', ['c']), def('c', ['a'])]), /cycle/);
    assert.throws(() => new TagRegistry([def('oak', ['typo'])]), /Unknown parent/);
});

test('registry validates IDs, kinds, revisions, duplicates and visibility', () => {
    for(const change of [{id: ''}, {kind: ''}, {revision: 0}, {revision: 1.5},
        {revision: Number.MAX_SAFE_INTEGER + 1}, {visible: 'typo'}, {parents: 'wood'}, {extra: true}]) {
        assert.throws(() => new TagRegistry([{id: 'wood', kind: 'material', revision: 1, ...change}]));
    }
    assert.throws(() => new TagRegistry([definitions[0], definitions[0]]), /Duplicate tag/);
});

test('registry and entity read views cannot mutate live tags', () => {
    const input = structuredClone(definitions), registry = new TagRegistry(input);
    input[1].parents.length = 0;
    assert.deepEqual(registry.get('wood').parents, ['material']);
    assert.throws(() => registry.get('wood').parents.push('wet'), TypeError);
    assert.throws(() => { registry.get('wood').revision = 99; }, TypeError);
    const store = new TagStore(registry).add('log', 'oak'), view = store.entity('log');
    assert.throws(() => view.tags.push('wet'), TypeError);
    store.add('log', 'wet');
    assert.equal(tagFacts(view)['actor.tag.wet'], false);
    assert.equal(store.tagFacts('log')['actor.tag.wet'], true);
});

test('boolean item tags, arrays and Sets seed detached entity sets', () => {
    const store = make(), itemTags = {oak: true, wet: false};
    store.set('item', itemTags).set('set', new Set(['oak', 'oak']));
    itemTags.wet = true;
    assert.equal(store.has('item', 'wet'), false);
    assert.deepEqual(store.tags('item'), store.tags('set'));
    store.set('item', ['wet']);
    assert.deepEqual(store.tags('item'), ['wet']);
});

test('invalid live writes are atomic and do not silently accept unknown tags', () => {
    const store = make().add('log', 'oak'), before = store.serialize();
    assert.throws(() => store.set('log', ['wet', 'typo']), /Unknown tag/);
    assert.throws(() => store.add('new', 'typo'), /Unknown tag/);
    assert.throws(() => store.set('log', {wet: 1}), /booleans/);
    assert.throws(() => store.add('', 'wet'), /Entity ID/);
    assert.equal(store.serialize(), before);
});

test('all, any and nested not queries match implications and return sorted entity IDs', () => {
    const store = make().set('b', ['pine', 'wet']).set('a', ['oak']).set('empty', []);
    assert.deepEqual(store.query({all: ['wood', {not: 'wet'}]}), ['a']);
    assert.deepEqual(store.query({any: ['oak', 'wet']}), ['a', 'b']);
    assert.deepEqual(store.query({not: {any: ['wood', 'wet']}}), ['empty']);
    assert.deepEqual(store.query({all: []}), ['a', 'b', 'empty']);
    assert.deepEqual(store.query({any: []}), []);
    assert.equal(store.matches('a', {not: 'missing_definition'}), false);
});

test('malformed queries fail even on empty stores', () => {
    for(const query of [{}, {all: [], any: []}, {all: 'wood'}, {none: ['wood']}, {not: null}, '']) {
        assert.throws(() => make().query(query));
    }
    assert.throws(() => make().query('wood', {kinds: 'material'}), /array or Set/);
});

test('open tags and sense allow lists filter each implied tag independently', () => {
    const store = make().add('staff', 'enchanted_oak');
    assert.deepEqual(store.visibleTags('staff'), ['material', 'oak', 'wood']);
    assert.deepEqual(store.visibleTags('staff', {kinds: ['magic']}), ['cursed', 'enchanted_oak']);
    assert.deepEqual(store.visibleTags('staff', {tags: ['wood', 'cursed']}), ['cursed', 'wood']);
    assert.deepEqual(store.visibleTags('staff', {tags: [], kinds: []}), []);
    assert.deepEqual(store.visibleTags('staff', {tags: ['wet'], kinds: ['material']}), ['oak', 'wood']);
    assert.deepEqual(store.visibleTags('staff', {omniscient: true}), store.tags('staff'));
    assert.throws(() => store.visibleTags('staff', {omniscient: 'yes'}), /boolean/);
});

test('observed query negation cannot prove absence of a hidden tag', () => {
    const store = make().set('hidden', ['cursed']).set('plain', ['oak']);
    assert.deepEqual(store.query({not: 'cursed'}), ['plain']);
    assert.deepEqual(store.query({not: 'cursed'}, {}), []);
    assert.deepEqual(store.query({not: 'cursed'}, {kinds: ['magic']}), ['plain']);
    assert.equal(store.matches('plain', {any: ['oak', 'cursed']}, {}), true);
    assert.equal(store.matches('plain', {not: {all: ['wet', 'cursed']}}, {}), true);
});

test('tagFacts supplies flat rule facts, explicit visible false, and unknown hidden facts', () => {
    const store = make().set('log', {oak: true});
    const before = store.serialize(), facts = tagFacts(store.entity('log'));
    assert.equal(facts['actor.tag.wood'], true);
    assert.equal(facts['actor.tag.wet'], false);
    assert.equal(Object.hasOwn(facts, 'actor.tag.cursed'), false);
    const not = id => ({not: {fact: `actor.tag.${id}`, op: 'eq', value: true}});
    assert.equal(evaluateRule(not('wet'), facts).met, true);
    assert.deepEqual(evaluateRule(not('cursed'), facts).known, false);
    assert.equal(evaluateRule(not('cursed'), store.tagFacts('log', {tags: ['cursed']})).met, true);
    assert.deepEqual(store.tagFacts('log', {}, {prefix: 'target', tags: ['wood', 'wet', 'cursed']}),
        {'target.tag.wet': false, 'target.tag.wood': true});
    assert.deepEqual(tagFacts({registry: store.registry, tags: {oak: true}}, {}, {tags: ['wood']}),
        {'actor.tag.wood': true});
    assert.equal(store.serialize(), before);
});

test('serialization is canonical across input order and round trips revisions and empty sets', () => {
    const one = make().set('b', ['wet', 'oak', 'oak']).set('a', []);
    const reversed = structuredClone(definitions).reverse();
    reversed.find(tag => tag.id === 'enchanted_oak').parents.reverse();
    const two = new TagStore(new TagRegistry(reversed)).set('a', []).set('b', ['oak', 'wet']);
    assert.equal(one.serialize(), two.serialize());
    const {store, diagnostics} = TagStore.deserialize(one.serialize());
    assert.equal(store.serialize(), one.serialize());
    assert.deepEqual(diagnostics, []);
    assert.equal(store.registry.get('oak').revision, 3);
    assert.deepEqual(store.query('wood'), ['b']);
    assert.deepEqual(store.query({all: []}), ['a', 'b']);
});

test('unknown loaded tags are retained, reported, removable and hidden by default', () => {
    const snapshot = JSON.parse(make().set('b', ['oak']).set('a', []).serialize());
    snapshot.entities[0].tags.push('retired');
    snapshot.entities[1].tags.push('retired');
    const before = structuredClone(snapshot);
    const {store, diagnostics} = TagStore.deserialize(snapshot);
    assert.deepEqual(diagnostics, [{code: 'unknown-tag', id: 'retired', entities: ['a', 'b']}]);
    assert.equal(store.has('a', 'retired'), true);
    assert.deepEqual(store.visibleTags('a'), []);
    assert.equal(Object.hasOwn(store.tagFacts('a'), 'actor.tag.retired'), false);
    assert.equal(store.tagFacts('a', {omniscient: true})['actor.tag.retired'], true);
    assert.deepEqual(TagStore.deserialize(store.serialize()).diagnostics, diagnostics);
    assert.equal(TagStore.deserialize(store.serialize()).store.serialize(), store.serialize());
    assert.deepEqual(snapshot, before);
    assert.equal(store.remove('a', 'retired'), true);
});

test('current content changes are reported while saved revisions and semantics remain readable', () => {
    const old = make().add('staff', 'enchanted_oak'), saved = old.serialize();
    const current = new TagRegistry([
        {id: 'oak', kind: 'material', revision: 10},
        {id: 'material', kind: 'category', revision: 1},
        {id: 'wood', kind: 'material', revision: 2, parents: ['material']},
        {id: 'pine', kind: 'material', revision: 1, parents: ['wood']},
        {id: 'wet', kind: 'state', revision: 1},
    ]);
    const {store, diagnostics} = TagStore.deserialize(saved, {currentRegistry: current});
    assert.equal(store.serialize(), saved);
    assert.equal(store.registry.get('oak').revision, 3);
    assert.equal(store.has('staff', 'wood'), true);
    assert.deepEqual(diagnostics, [
        {code: 'unknown-tag', id: 'cursed', entities: ['staff']},
        {code: 'unknown-tag', id: 'enchanted_oak', entities: ['staff']},
        {code: 'revision-mismatch', id: 'oak', savedRevision: 3, currentRevision: 10},
    ]);
});

test('deserialize rejects unsupported schemas, cycles, duplicates and malformed data', () => {
    const valid = JSON.parse(make().add('log', 'oak').serialize());
    for(const edit of [snapshot => {snapshot.schema = 2;},
        snapshot => {snapshot.entities.push(snapshot.entities[0]);},
        snapshot => {snapshot.entities[0].tags = 'oak';},
        snapshot => {snapshot.registry[0].parents = [snapshot.registry[0].id];},
        snapshot => {snapshot.registry[0].revision = 0;},
        snapshot => {snapshot.future = true;},
        snapshot => {delete snapshot.registry;}]) {
        const snapshot = structuredClone(valid); edit(snapshot);
        assert.throws(() => TagStore.deserialize(snapshot));
    }
    assert.throws(() => TagStore.deserialize('{broken'));
    assert.throws(() => TagStore.deserialize(valid, {currentRegistry: {}}), /TagRegistry/);
});
