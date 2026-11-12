import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {beginWorking, quoteWorking, settleWorking} from '../src/kernel_working.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {compileGuMove} from '../src/gu_move_roles.js';
import {asBoundGu, derivedAbilityFrom, guAbility, guMethods, guMoveMethod, guRef, guWorkingLaw as law} from '../src/gu_working_law.js';

const ledger = name => readFileSync(new URL(`../docs/coverage/${name}.jsonl`, import.meta.url), 'utf8')
    .trim().split('\n').map(line => JSON.parse(line));
const labels = JSON.parse(readFileSync(new URL('../docs/coverage/gu_labels.json', import.meta.url), 'utf8'));
const withLabels = (rows, table) => rows.map(row => ({...table[row.id], ...row}));
const kinds = withLabels(ledger('gu_kinds'), labels.kinds);
const moves = withLabels(ledger('gu_moves'), labels.moves);
const states = /^(runs-canon|runs-authored|expressed-authored|catalogued|blocked:[a-z-]+|not-a-thing:[a-z-]+)$/;
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
            assert.ok(typeof row.source === 'string' && row.source && Array.isArray(row.mechanisms) && row.mechanisms.includes('G') && row.test && row.note, row.id);
            if (row.state.startsWith('runs')) assert.ok(row.mechanisms.length > 1, `${row.id} names the mechanism it runs on`);
        }
    }
    const checked = kinds.filter(row => row.layer === 'chapter');
    assert.equal(checked.length, 78);
    assert.ok(checked.every(row => row.state.startsWith('runs') || row.state === 'expressed-authored' || row.state === 'catalogued' || row.state.startsWith('blocked:') || row.state.startsWith('not-a-thing')));
});

test('legacy chapter-checked working rows still quote through the Gu working law', () => {
    for (const row of kinds.filter(entry => entry.layer === 'chapter' && (entry.state.startsWith('runs') || entry.note.includes('Former state: runs-authored.')))) {
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

test('every runs move quotes and settles through typed composition, and blocked moves name what they lack', () => {
    for (const row of moves) {
        if (!row.state.startsWith('runs')) {
            if (row.layer === 'chapter') assert.ok(row.roles.some(role => !role.kind || !guAbility(role.kind)), row.id);
            continue;
        }
        const specimens = Object.fromEntries(row.roles.map(role => [role.id, fed(role.id, role.kind, rankOf(role.kind))]));
        const bindings = {operator, ...Object.fromEntries(row.roles.map(role => [role.id, guRef(role.id)]))};
        const move = {id: row.id, roles: row.roles};
        const inputs = {id: `m.${row.id}`, at: 0, facts: plenty, bindings, ports: portsFor(specimens)};
        const legacy = quoteWorking(law, guMoveMethod(move), inputs);
        assert.equal(legacy.ok, true, `${row.id}: ${legacy.reason}`);
        const composed = compileGuMove(move, inputs);
        assert.equal(composed.ok, true, `${row.id}: ${JSON.stringify(composed.requirements)}`);
        const typedInputs = {...inputs, bindings: composed.bindings};
        const quote = quoteWorking(composed.law, composed.method, typedInputs);
        assert.equal(quote.ok, true, `${row.id}: ${quote.reason}`);
        assert.deepEqual(quote.effects, legacy.effects, row.id);
        assert.deepEqual(quote.facts.reserves, legacy.facts.reserves, row.id);
        const working = beginWorking(composed.law, composed.method, typedInputs);
        const settled = settleWorking(composed.law, working, {now: quote.endsAt, ports: inputs.ports});
        assert.equal(settled.record.status, 'complete', row.id);
        assert.deepEqual(settled.effects.map(row => row.effect), quote.effects, row.id);
        assert.deepEqual(settled.record.facts.reserves, quote.facts.reserves, row.id);
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
