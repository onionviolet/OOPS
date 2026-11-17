// Shape of the Re:Zero power ledger (docs/research/power-catalogues-2026-11-16 PWC1-PWC7). Reads only the committed
// ledger and sidecar, never the private folder: every row is classified, every blocking slug is a named capability,
// every filled field carries a locator and a speaker, the held-out split is the frozen hash rule, no paraphrase is
// committed, and the fold rule holds.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {CAPABILITIES, predictAttribute, predictSin, ROUTES, KNOWERS} from '../scripts/rezero_power_frozen.mjs';
import {canonicalise} from '../scripts/rezero_power_canon.mjs';
import {tagsOf, scoreClass, adjacent} from '../scripts/rezero_power_build.mjs';
import {parseLedger} from '../scripts/coverage_report.mjs';

const read = name => readFileSync(new URL(`../docs/coverage/${name}`, import.meta.url), 'utf8');
const sidecar = JSON.parse(read('rezero_power_labels.json'));
const {rows, problems} = parseLedger(read('rezero_powers.jsonl'), {name: 'rezero_powers'});
const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;
const SPEAKERS = new Set(['narrator', 'character_claim', 'demonstration', 'wiki', 'inference', 'unknown', 'row-id']);

test('every row is well formed, classified once and has a label entry', () => {
    assert.deepEqual(problems, []);
    assert.equal(rows.length, Object.keys(sidecar.labels).length);
    for (const r of rows) {
        assert.ok(sidecar.labels[r.id], r.id);
        assert.ok(/^rz\.[a-z_]+\./.test(r.id), r.id);
        assert.notEqual(r.state, 'unclassified', r.id);
        if (r.state.startsWith('blocked:')) assert.ok(CAPABILITIES[r.state.slice(8)], `${r.id}: ${r.state} is not a named capability`);
        else assert.match(r.state, /^(catalogued|not-a-thing:[a-z-]+)$/, r.id);
    }
    assert.equal(rows.filter(r => r.state.startsWith('not-a-thing')).length, 26);
    assert.equal(rows.filter(r => !r.state.startsWith('not-a-thing')).length, 178);
});

test('every class the task names is present with real rows', () => {
    const live = Object.values(sidecar.labels).filter(l => !l.notAThing);
    for (const cls of ['authority', 'witch_factor', 'divine_protection', 'spell', 'curse', 'spirit_contract', 'return_by_death']) {
        assert.ok(live.some(l => l.class === cls), cls);
    }
    assert.equal(live.filter(l => l.class === 'witch_factor').length, 9, 'one Factor per sin');
    assert.ok(sidecar.labels['rz.return_by_death.return-by-death'], 'Return by Death has its own row');
    assert.equal(rows.find(r => r.id === 'rz.return_by_death.return-by-death').state, 'blocked:death-checkpoint-rewind');
});

test('the split is the frozen hash rule and held-out rows are the ones it names', () => {
    const live = Object.entries(sidecar.labels).filter(([, l]) => !l.notAThing);
    assert.deepEqual(sidecar.split.heldOut, live.filter(([id]) => heldOut(id)).map(([id]) => id).sort());
    for (const [id, l] of live) assert.equal(l.heldOut, heldOut(id), id);
});

test('every filled field has a locator or says it lost one, and a known speaker; every row names its name source and edition', () => {
    for (const [id, l] of Object.entries(sidecar.labels)) {
        assert.ok(l.nameSources.length > 0, `${id} has a name source`);
        assert.match(l.editions, /^(LN|WN|LN\+WN|unknown)$/, id);
        if (l.notAThing) continue;
        for (const k of ['effect', 'who_may', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters', 'where_from', 'knowledge']) {
            const f = l[k];
            if (!f) continue;
            assert.ok(f.locator || f.locatorMissing || (k === 'knowledge' && f.who === 'unknown'), `${id}.${k}`);
            assert.ok(SPEAKERS.has(f.speaker), `${id}.${k} speaker ${f.speaker}`);
            for (const key of Object.keys(f)) assert.ok(['tags', 'locator', 'speaker', 'who', 'locatorMissing', 'note'].includes(key), `${id}.${k}.${key}`);
        }
        assert.ok(ROUTES.includes(l.route), id);
        if (l.knowledge) assert.ok(KNOWERS.includes(l.knowledge.who), id);
        assert.ok(l.routeToPlayer.text, id);
    }
});

test('no paraphrase or prose is committed: values are enums, tags, locators and short notes', () => {
    const text = JSON.stringify(sidecar);
    assert.ok(!/ — |—/.test(text), 'no em dash');
    for (const l of Object.values(sidecar.labels)) for (const k of ['effect', 'who_may', 'go_wrong', 'mind', 'left_behind', 'combines', 'counters']) {
        if (l[k]) assert.equal(l[k].value, undefined, `${l.name}.${k} must not carry a value`);
    }
});

test('the fold rule: grammar folds only with two agreeing readers and, for held-out classes, a score that beats the baseline', () => {
    for (const [id, l] of Object.entries(sidecar.labels)) {
        if (!l.grammar) continue;
        if (l.grammarFold === 'grammar') {
            assert.ok(l.secondReader?.agrees, `${id} folded without agreement`);
            if (l.class === 'spell') assert.ok(sidecar.score.attribute.beats, id);
            if (['witch_factor', 'authority'].includes(l.class)) assert.ok(sidecar.score.sin.beats, id);
            assert.ok(!l.review, id);
        } else assert.equal(l.grammarFold, 'grammarGuess', id);
    }
});

test('a stated label is checked against its own line and a Factor row states its own sin', () => {
    for (const [id, l] of Object.entries(sidecar.labels)) {
        if (l.notAThing) continue;
        if (l.class === 'witch_factor') assert.equal(l.stated.sin, id.split('.').pop(), id);
        else if (l.stated) assert.ok(l.stated.locator, `${id} states a label without a locator`);
    }
});

test('frozen tables map grammar to labels in their stated order', () => {
    assert.equal(predictAttribute({verb: 'add', object: 'heat', target: 'area', time: 'instant'}), 'fire');
    assert.equal(predictAttribute({verb: 'add', object: 'vitality', target: 'touched', time: 'instant'}), 'water');
    assert.equal(predictAttribute({verb: 'sense', object: 'information', target: 'self', time: 'instant'}), 'yin');
    assert.equal(predictAttribute({verb: 'none', object: 'none', target: 'none', time: 'none'}), 'none');
    assert.equal(predictSin({verb: 'remove', object: 'memory', target: 'touched', time: 'instant'}), 'gluttony');
    assert.equal(predictSin({verb: 'alter', object: 'time', target: 'area', time: 'sustained'}), 'greed');
    const s = scoreClass([{heldOut: false, grammar: {verb: 'x'}, truth: 'a'}, {heldOut: true, grammar: {verb: 'x'}, truth: 'a'}], () => 'b');
    assert.deepEqual(s.held, {n: 1, agree: 0, baseline: 1, mode: 'a'});
    assert.equal(s.beats, false);
});

test('Luna and Haiku tags normalise and a stated label must sit beside the power name', () => {
    assert.deepEqual(tagsOf('left_behind', 'It passes to a new holder after death'), ['transfers']);
    assert.ok(adjacent('Wind: Fula, Ul Fula. Earth: Dona', ['Dona'], 'earth', 60));
    assert.ok(!adjacent('A vast amount of water filled the library while El Shiha struck', ['El Shiha'], 'water', 5));
    assert.ok(adjacent('| Gluttony | WIKI Daphne | Name eating, Lunar Eclipse', ['Lunar Eclipse'], 'gluttony', 20));
});

test('the merge joins light-novel and web-novel names for one power and keeps both editions', () => {
    const names = {
        a: {edition: 'LN', reply: {powers: [{name: 'Fiend Manipulation', class: 'divine_protection', aliases: [], line: 1, edition_note: ''}]}},
        b: {edition: 'WN', reply: {powers: [{name: 'Demon Manipulation', class: 'divine_protection', aliases: [], line: 2, edition_note: ''}, {name: 'Water', class: 'spell', aliases: [], line: 3, edition_note: ''}, {name: 'Water', class: 'divine_protection', aliases: [], line: 4, edition_note: ''}]}},
    };
    const out = canonicalise(names, {});
    const demon = out.find(r => r.id === 'rz.divine_protection.demon-manipulation');
    assert.equal(demon.editions, 'LN+WN');
    assert.equal(demon.nameSources.length, 2);
    assert.equal(out.find(r => r.id === 'rz.spell.water').notAThing, 'attribute-word');
    assert.equal(out.find(r => r.id === 'rz.divine_protection.water').notAThing, undefined, "Ferris's blessing is a real row");
});
