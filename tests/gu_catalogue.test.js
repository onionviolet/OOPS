import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guCatalogue, guFunctions, guRoles} from '../src/gu_catalogue.js';
import {searchGuMoves} from '../src/gu_move_search.js';

const evidence = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url)));
const byKind = new Map(evidence.kinds.map(row => [row.id, row]));
const byMove = new Map(evidence.moves.map(row => [row.id, row]));

test('every playable Gu catalogue binding cites a checked chapter and identifies its tuning', () => {
    assert.equal(byKind.size, evidence.kinds.length, 'source identities must be unique');
    for (const [kind, bindings] of Object.entries(guCatalogue)) {
        const record = byKind.get(kind);
        assert.ok(record, `${kind} needs a checked identity`);
        const runtimeBindings = Object.entries(bindings).filter(([mechanism]) => mechanism !== 'body');
        for (const [mechanism, {chapters, observed, authored, value}] of runtimeBindings) {
            const label = `${kind} ${mechanism}`;
            assert.ok(chapters.length && chapters.every(chapter => record.chapters.includes(chapter)), label);
            assert.ok(observed.trim() && authored.trim(), label);
            assert.ok(Object.isFrozen(value), label);
        }
        // Body facts can cite feeding passages outside the identity's original behavior scenes.
        const {body} = bindings;
        assert.ok(Object.isFrozen(body), `${kind} body`);
        assert.ok(['stated', 'unknown'].includes(body.status), `${kind} diet status`);
        assert.ok(body.searchedChapters.length, `${kind} searched chapters`);
        assert.ok(record.chapters.every(chapter => body.searchedChapters.includes(chapter)), `${kind} starts from its citations`);
        assert.ok(body.searchedChapters.every(chapter => Number.isInteger(chapter) && chapter >= 1 && chapter <= 2334), kind);
        assert.equal(Boolean(body.diet), body.status === 'stated', `${kind} stated diet needs food evidence`);
        if (body.diet) assert.ok(body.diet.food.length && body.diet.food.every(food => typeof food === 'string' && food.trim()), kind);
        for (const field of ['diet', 'interval', 'ration', 'starves', 'notes']) {
            const fact = body[field];
            if (!fact) continue;
            assert.ok(Object.isFrozen(fact), `${kind} ${field}`);
            assert.ok(fact.observed.trim(), `${kind} ${field} paraphrase`);
            assert.ok(fact.chapters.length && fact.chapters.every(chapter => body.searchedChapters.includes(chapter)),
                `${kind} ${field} source`);
        }
    }
});

test('the Red Fire search retains count, force and fuel as separate tradeoffs', () => {
    const roles = byMove.get('xiao-yan-fire-set').roles;
    const attack = roles.find(role => role.id === 'attack');
    const supports = roles.filter(role => role.id !== 'attack').map(role => role.kind);
    const kinds = [...supports, attack.kind, 'fire-discharge'];
    const available = kinds.map(kind => ({gu: {id: kind, kind, rank: 1, fedThrough: 0},
        operator: 'keeper', ability: guCatalogue[kind].ability.value}));
    const reserves = {keeper: {primeval: 10}};
    const {options} = searchGuMoves({available, reserves, day: 0, effect: 'flame', maxSupports: 3});
    const outcomes = new Map(options.map(row => [[...row.supports].sort().join(','),
        [row.effects[0].count, row.effects[0].magnitude, 10 - row.remaining.keeper.primeval]]));
    assert.equal(options.length, 8);
    assert.deepEqual(outcomes.get(''), [1, 1, 6]);
    assert.deepEqual(outcomes.get('fire-source'), [1, 1, 4]);
    assert.deepEqual(outcomes.get('duplicate,fire-source'), [2, 1, 5]);
    assert.deepEqual(outcomes.get('enlarge,fire-source'), [1, 2, 5]);
    assert.deepEqual(outcomes.get('duplicate,enlarge,fire-source'), [2, 2, 6]);
    assert.ok(options.every(row => row.core === attack.kind && row.supports.every(kind => supports.includes(kind))));
    const travel = searchGuMoves({available, reserves, day: 0, effect: 'travel'});
    assert.deepEqual(travel.options.map(({core, supports}) => [core, supports]), [['fire-discharge', []]]);
});

test('unresolved ranks and the reported Immortal Worm recipe supply no playable defaults', () => {
    for (const kind of ['light-source', 'moon-scar', 'stone-scar']) {
        assert.deepEqual(byKind.get(kind).ranks, []);
        assert.ok(byKind.get(kind).openFields.includes('rank in the cited scene'));
        assert.equal(guCatalogue[kind]?.rank, undefined);
    }
    assert.equal(guCatalogue['stone-scar']?.ability, undefined);
    const legend = evidence.interpretations.find(row => row.kind === 'liquor-worm');
    assert.equal(legend.status, 'chapter-reported-legend');
    assert.deepEqual(legend.chapters, [1191]);
    assert.ok(legend.openFields.includes('living specimen or holder'));
    assert.deepEqual(byKind.get('liquor-worm').ranks, [1]);
    assert.equal(guCatalogue['liquor-worm'].conversion.value.rank, 1);
    assert.equal(guCatalogue['liquor-worm'].recipe, undefined);
});

test('every chapter-checked identity has grammar parts that keep chapter facts, wiki labels and gaps apart', () => {
    assert.ok(evidence.kinds.length >= 60);
    for (const record of evidence.kinds) {
        const parts = guCatalogue[record.id]?.parts;
        assert.ok(parts, `${record.id} needs a parts row`);
        const {value, open} = parts;
        const label = record.id;
        assert.deepEqual(value.rank, record.ranks, `${label} rank must be the chapter-backed ranks`);
        for (const gap of record.openFields ?? []) assert.ok(open.includes(gap), `${label} keeps open field ${gap}`);
        assert.ok(value.rank.length || open.some(gap => /rank/.test(gap)), `${label} names its open rank`);
        assert.ok(value.path || open.some(gap => /path/.test(gap)), `${label} names its open path`);
        assert.ok(value.function === null ? open.some(gap => /standalone|effect|operation|contribution/.test(gap))
            : guFunctions.includes(value.function), `${label} function`);
        assert.ok(value.roles.every(role => guRoles.includes(role)), `${label} roles`);
        assert.ok(['rank', 'path', 'type'].every(field => Array.isArray(value.wiki[field])), `${label} wiki layer`);
        for (const input of value.inputs ?? []) assert.ok(guCatalogue[input]?.parts, `${label} input ${input} is a catalogued kind`);
    }
});
