import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {quoteWorking} from '../src/kernel_working.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {asBoundGu, derivedAbilityFrom, guAbility, guMethods, guMoveMethod, guRef, guWorkingLaw as law} from '../src/gu_working_law.js';

const ledger = name => readFileSync(new URL(`../docs/coverage/${name}.jsonl`, import.meta.url), 'utf8')
    .trim().split('\n').map(line => JSON.parse(line));
const kinds = ledger('gu_kinds');
const moves = ledger('gu_moves');
const states = /^(runs-canon|runs-authored|blocked:[a-z-]+|not-a-thing:[a-z-]+)$/;
const operator = {kind: 'operator', id: 'keeper'};
const plenty = {reserves: {keeper: {primeval: 1000, immortal: 1000, mental: 1000}}};
const fed = (id, kind, rank) => ({id, kind, rank, fedThrough: 1e9, alive: true, holder: 'keeper'});
const portsFor = specimens => ({read: ref => ref.kind === 'operator' ? ref : specimens[ref.id] ? asBoundGu(specimens[ref.id]) : null});
const rankOf = kind => guCatalogue[kind]?.parts?.value.rank[0] ?? 1;

test('both Gu ledgers cover their denominators with no unclassified row (MS1, CV2-CV4)', () => {
    assert.equal(kinds.length, 1466);
    assert.equal(moves.length, 23 + 753);
    for (const rows of [kinds, moves]) {
        assert.equal(new Set(rows.map(row => row.id)).size, rows.length, 'ids are unique');
        for (const row of rows) {
            assert.match(row.state, states, row.id);
            assert.ok(Array.isArray(row.source) && Array.isArray(row.mechanisms) && row.test && row.note, row.id);
            if (row.state.startsWith('runs')) assert.ok(row.mechanisms.length, `${row.id} names its mechanism`);
        }
    }
    const checked = kinds.filter(row => row.layer === 'chapter');
    assert.equal(checked.length, 78);
    assert.ok(checked.every(row => row.state.startsWith('runs') || row.state.startsWith('blocked:') || row.state.startsWith('not-a-thing')));
});

test('every chapter-checked runs row runs through the Gu working law from catalogue data', () => {
    for (const row of kinds.filter(entry => entry.layer === 'chapter' && entry.state.startsWith('runs'))) {
        const methods = guMethods(row.id);
        assert.ok(Object.keys(methods).length, row.id);
        if (methods.activate) {
            const quote = quoteWorking(law, methods.activate, {id: `k.${row.id}`, at: 0, facts: plenty,
                bindings: {gu: guRef('g'), operator}, ports: portsFor({g: fed('g', row.id, rankOf(row.id))})});
            assert.equal(quote.ok, true, `${row.id}: ${quote.reason}`);
        }
    }
});

test('every wiki-layer runs row runs on an ability derived from its labels', () => {
    const rows = kinds.filter(entry => entry.layer === 'wiki' && entry.state.startsWith('runs'));
    assert.ok(rows.length > 300);
    for (const row of rows) {
        const ability = derivedAbilityFrom(row);
        assert.ok(ability?.derived, row.id);
        const method = structuredClone(guMethods('moonglow').activate);
        method.steps[0].options = {ability};
        const quote = quoteWorking(law, method, {id: `w.${row.id}`.replaceAll(':', '.'), at: 0, facts: plenty,
            bindings: {gu: guRef('g'), operator}, ports: portsFor({g: fed('g', 'wiki-kind', row.rank)})});
        assert.equal(quote.ok, true, `${row.id}: ${quote.reason}`);
        assert.equal(quote.effects[0].kind, row.function);
    }
});

test('every runs move is a composed working that quotes, and blocked moves name what they lack', () => {
    for (const row of moves) {
        if (!row.state.startsWith('runs')) {
            if (row.layer === 'chapter') assert.ok(row.roles.some(role => !role.kind || !guAbility(role.kind)), row.id);
            continue;
        }
        const specimens = Object.fromEntries(row.roles.map(role => [role.id, fed(role.id, role.kind, rankOf(role.kind))]));
        const bindings = {operator, ...Object.fromEntries(row.roles.map(role => [role.id, guRef(role.id)]))};
        const quote = quoteWorking(law, guMoveMethod({id: row.id, roles: row.roles}), {id: `m.${row.id}`, at: 0,
            facts: plenty, bindings, ports: portsFor(specimens)});
        assert.equal(quote.ok, true, `${row.id}: ${quote.reason}`);
    }
    // The Red Fire record lists its core first; supports still settle before it and shape the flame.
    const fire = moves.find(row => row.id === 'xiao-yan-fire-set');
    const specimens = Object.fromEntries(fire.roles.map(role => [role.id, fed(role.id, role.kind, 1)]));
    const quote = quoteWorking(law, guMoveMethod({id: fire.id, roles: fire.roles}), {id: 'fire', at: 0,
        facts: {reserves: {keeper: {primeval: 10}}}, ports: portsFor(specimens),
        bindings: {operator, ...Object.fromEntries(fire.roles.map(role => [role.id, guRef(role.id)]))}});
    const flame = quote.effects.find(effect => effect.kind === 'flame');
    assert.deepEqual([flame.count, flame.magnitude, quote.facts.reserves.keeper.primeval], [2, 2, 4]);
});
