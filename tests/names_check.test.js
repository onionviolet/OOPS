import test from 'node:test';
import assert from 'node:assert/strict';
import {scanSource, analyze, scanTree, checkTree, worldOf} from '../scripts/check_names.mjs';

const findings = (path, src) => analyze(scanSource(path, src));

test('worlds are attributed from file paths', () => {
    assert.equal(worldOf('src/book_world_lotm_cast.js'), 'lotm');
    assert.equal(worldOf('src/data/npcs.js'), 'frontier');
    assert.equal(worldOf('src/world_packs/book_shadow_slave_life.js'), 'shadow_slave');
    assert.equal(worldOf('src/ui_components.js'), 'shared');
});

test('a person named only by role is flagged, a named person is not', () => {
    const bad = findings('src/data/npcs.js', 'new NPC({name: "village elder"}); new NPC({name: "gate guard"});');
    assert.deepEqual(bad.filter(f => f.code === 'GEN').map(f => f.name).sort(), ['gate guard', 'village elder']);
    assert.equal(findings('src/data/npcs.js', 'new NPC({name: "Mara the miller"});').length, 0);
});

test('generic item and place names are flagged', () => {
    const f = findings('src/items.js', '{id:"a",name:"Iron sword"},{id:"b",name:"Hearth-iron kettle"}');
    assert.deepEqual(f.filter(x => x.code === 'GEN').map(x => x.name), ['Iron sword']);
    assert.equal(findings('src/data/locations.js', '{name: "Forest"}').filter(x => x.code === 'GEN').length, 1);
});

test('one name on two entities in a world is a duplicate; same id is not', () => {
    const dup = findings('src/home_contacts.js', "{id:'a',name:'Mara'}\n{id:'b',name:'Mara'}");
    assert.equal(dup.filter(f => f.code === 'DUP').length, 1);
    assert.equal(findings('src/home_contacts.js', "{id:'a',name:'Mara'}\n{id:'a',name:'Mara'}").filter(f => f.code === 'DUP').length, 0);
});

test('a spelling variant is flagged', () => {
    const g = findings('src/book_world_lotm_cast_days.js', "{id:'a',name:'Pallez Zoroast'}\n{id:'b',name:'Palez Zoroast'}");
    assert.equal(g.filter(x => x.code === 'VAR').length, 1);
    assert.equal(findings('src/book_world_lotm_cast_days.js', "{id:'a',name:'Dunn Smith'}\n{id:'b',name:'Old Neil'}").filter(x => x.code === 'VAR').length, 0);
});

test('a modern word in an original world is flagged; the same in a canon world is not', () => {
    assert.equal(findings('src/data/npcs.js', '{name: "Laptop repair"}').filter(f => f.code === 'REG').length, 1);
    assert.equal(findings('src/book_world_hp_people_source.js', '{name: "Muggle phone box"}').filter(f => f.code === 'REG').length, 0);
});

test('the allow comment skips a line', () => {
    assert.equal(findings('src/data/npcs.js', 'new NPC({name: "village elder"}); // names: allow upstream').length, 0);
});

test('the current tree passes against the baseline', () => {
    const t0 = Date.now();
    const {fresh} = checkTree();
    assert.deepEqual(fresh.map(f => `${f.code} ${f.file}:${f.line} ${f.detail}`), []);
    assert.ok(Date.now() - t0 < 5000, 'check stays under 5s');
    assert.ok(scanTree().length > 500);
});

test('VAR skips plural groups, directions, titles, street numbers, numbered lines and different given names', async () => {
    const {distinctPair, applySpellings} = await import('../scripts/check_names.mjs');
    for (const [a, b, kind] of [['General', 'Generals', 'person'], ['East Bailang', 'West Bailang', 'place'], ['Mr Thomas', 'Mrs Thomas', 'person'],
        ['160 Backlund Street', '100 Berkrund Street', 'place'], ['William Augustus I', 'William Augustus VI', 'person'], ['Arianna', 'Orianna', 'person'],
        ['Man next door', 'Woman next door', 'person']]) assert.equal(distinctPair(a, b, kind), true, `${a} / ${b}`);
    for (const [a, b, kind] of [['Pallez Zoroast', 'Palez Zoroast', 'person'], ['Lo Dilcha', 'Luo Dilcha', 'person'], ['Olava Island', 'Olavi Island', 'place'],
        ['160 Berklund Street', '160 Berkland Street', 'place']]) assert.equal(distinctPair(a, b, kind), false, `${a} / ${b}`);
    const f = [{code: 'VAR', world: 'lotm', names: ['Olava Island', 'Olavi Island']}, {code: 'VAR', world: 'lotm', names: ['Olava Island', 'Other Island']}];
    assert.equal(applySpellings(f, {lotm: {'Olavi Island': ['Olava Island']}}).length, 1);
});

test('canon private casts may name a minor figure by role (NMR1 dial)', () => {
    const e = [{file: 'private_packs/lotm-cast/cast.json', line: 0, field: 'name', kind: 'person', world: 'lotm', name: 'Bartender', id: 'x', weak: false}];
    assert.equal(analyze(e).filter(f => f.code === 'GEN').length, 1);
    assert.equal(analyze(e, {allowCanonGeneric: true}).filter(f => f.code === 'GEN').length, 0);
});

test('private distinct list: a decided VAR pair and a decided DUP name do not report; others still do', async () => {
    const {applySpellings} = await import('../scripts/check_names.mjs');
    const distinct = {lotm: {pairs: [{names: ['Steam Chapel', 'Storm Chapel'], why: 'two places'}], dups: [{kind: 'person', name: 'Clown', why: 'title beside holder'}]}};
    const f = [{code: 'VAR', world: 'lotm', names: ['Steam Chapel', 'Storm Chapel']}, {code: 'VAR', world: 'lotm', names: ['Steam Chapel', 'Steam Hall']},
        {code: 'DUP', world: 'lotm', kind: 'person', name: 'clown'}, {code: 'DUP', world: 'lotm', kind: 'place', name: 'Clown'}];
    assert.equal(applySpellings(f, {}, distinct).length, 2);
});
