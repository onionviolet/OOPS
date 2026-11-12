import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {composedPart} from '../src/kernel_compose.js';
import {beginQuotedWorking, beginWorking, quoteWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {compileGuMove} from '../src/gu_move_roles.js';
import {asBoundGu, guMoveMethod, guRef, guWorkingLaw} from '../src/gu_working_law.js';

const {moves} = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url)));
const move = id => moves.find(row => row.id === id);
const fire = move('xiao-yan-fire-set');
const operator = {kind: 'operator', id: 'keeper'};
const specimen = (id, kind) => asBoundGu({id, kind, rank: 1, fedThrough: 100, alive: true, holder: operator.id});

function fixture(record = fire) {
    const things = {[operator.id]: operator};
    const bindings = {operator};
    for (const {id, kind} of record.roles.filter(role => role.kind)) {
        things[id] = specimen(id, kind);
        bindings[id] = guRef(id);
    }
    const facts = {reserves: {keeper: {primeval: 10}}};
    const ports = {read: ref => Object.hasOwn(things, ref.id) ? things[ref.id] : null};
    return {things, args: {id: 'fixture', at: 0, bindings, ports, facts}};
}

test('Xiao Yan fire set quotes and settles through K in support order at the existing cost', () => {
    const {args} = fixture();
    const result = compileGuMove(fire, args);
    assert.equal(result.ok, true);
    const {law, method, bindings} = result;
    assert.equal(method.law, law.ref);
    assert.match(law.ref, /attack=gu\.move-role\.activation@1:gu\.red-fire\.activate@1/);
    const inputs = {...args, bindings};
    const quote = quoteWorking(law, method, inputs);
    const legacy = quoteWorking(guWorkingLaw, guMoveMethod(fire), args);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.steps.map(row => composedPart(row.op)), ['count', 'size', 'economy', 'attack']);
    assert.deepEqual(quote.costs, [1, 1, 1, 3].map(amount => ({quantity: 'essence.primeval', holder: 'keeper', amount})));
    assert.deepEqual(quote.effects, legacy.effects);
    assert.deepEqual(quote.facts, legacy.facts);
    assert.deepEqual(quote.effects.map(({kind, count, magnitude}) => [kind, count, magnitude]), [['flame', 2, 2]]);
    assert.equal(quote.facts.reserves.keeper.primeval, 4);
    assert.equal(args.facts.reserves.keeper.primeval, 10);

    const start = beginQuotedWorking(law, method, {...inputs, fingerprint: quote.fingerprint});
    assert.equal(start.stale, false);
    const first = settleWorking(law, start.record, {now: 0, maxSteps: 1, ports: args.ports});
    const restored = restoreWorking(law, serializeWorking(first.record));
    const done = settleWorking(law, restored, {now: 0, ports: args.ports});
    assert.equal(done.record.status, 'complete');
    assert.deepEqual(done.record.facts, quote.facts);
    assert.deepEqual(done.effects.map(row => row.effect), quote.effects);
    assert.deepEqual(done.record.receipts.flatMap(row => row.truth.costs), quote.costs);

    const oldSave = beginWorking(guWorkingLaw, guMoveMethod(fire), args);
    const oldResult = settleWorking(guWorkingLaw, restoreWorking(guWorkingLaw, serializeWorking(oldSave)),
        {now: 0, ports: args.ports});
    assert.equal(oldResult.record.status, 'complete');
    assert.deepEqual(oldResult.record.facts, quote.facts);
});

test('missing, wrong and unknown bindings refuse compilation before spending essence', () => {
    const {args, things} = fixture();
    delete args.bindings.attack;
    args.bindings.count = {kind: 'target', id: 'count'};
    args.bindings.size = guRef('absent');
    things.economy = specimen('economy', 'enlarge');
    assert.deepEqual(compileGuMove(fire, args), {ok: false, requirements: [
        {role: 'attack', type: 'gu', kind: 'red-fire', reason: 'missing-binding'},
        {role: 'count', type: 'gu', kind: 'duplicate', reason: 'wrong-binding-type'},
        {role: 'size', type: 'gu', kind: 'enlarge', reason: 'unknown-binding'},
        {role: 'economy', type: 'gu', kind: 'fire-source', reason: 'wrong-gu-kind'},
    ]});
    assert.deepEqual(args.facts.reserves, {keeper: {primeval: 10}});
});

test('a live specimen that changes kind after binding cannot run the frozen Gu filler', () => {
    const {args, things} = fixture();
    const {law, method, bindings} = compileGuMove(fire, args);
    const inputs = {...args, bindings};
    const quote = quoteWorking(law, method, inputs);
    things.count = specimen('count', 'enlarge');
    const start = beginQuotedWorking(law, method, {...inputs, fingerprint: quote.fingerprint});
    assert.equal(start.stale, true);
    assert.equal(start.quote.reason, 'gu-kind-changed');
    assert.deepEqual(start.quote.facts.reserves, args.facts.reserves);
    assert.deepEqual(start.quote.costs, []);
});

test('a function role requires explicit substitution evidence and a matching catalogue function', () => {
    // An authored open attack role. The canonical fire set pins Red Fire.
    const {args, things} = fixture();
    const attack = {id: 'attack', type: 'gu', function: 'attack',
        evidence: 'This bench accepts any attack. Catalogue parts record Red Fire and Moonlight as attacks.'};
    const record = {id: 'test-fire-function', ordered: true, grammar: 'gu-test@1', roles: [attack, ...fire.roles.slice(1)]};
    const result = compileGuMove(record, args);
    assert.equal(result.ok, true);
    const quote = quoteWorking(result.law, result.method, {...args, bindings: result.bindings});
    assert.equal(quote.ok, true);
    assert.equal(result.method.grammar, record.grammar);
    assert.deepEqual(quote.steps.map(row => composedPart(row.op)), ['attack', 'count', 'size', 'economy']);
    assert.equal(quote.effects[0].count, 1);
    assert.equal(quote.facts.reserves.keeper.primeval, 1);

    things.attack = specimen('attack', 'moonlight');
    const alternate = compileGuMove(record, args);
    assert.equal(alternate.ok, true);
    assert.notEqual(alternate.law.ref, result.law.ref);
    const alternateQuote = quoteWorking(alternate.law, alternate.method, {...args, bindings: alternate.bindings});
    assert.equal(alternateQuote.ok, true);
    assert.equal(alternateQuote.effects[0].kind, 'damage');
    assert.equal(alternateQuote.facts.reserves.keeper.primeval, 3);
    assert.equal(compileGuMove(fire, args).requirements[0].reason, 'wrong-gu-kind');

    things.attack = specimen('attack', 'fire-discharge');
    assert.equal(compileGuMove(record, args).requirements[0].reason, 'wrong-gu-function');
    assert.equal(compileGuMove({...record, roles: [{...attack, evidence: undefined}]}, args).requirements[0].reason,
        'gu-requirement-unknown');
});

test('context roles are bound and checked by K before the first paid activation', () => {
    const {args, things} = fixture();
    const roles = [{id: 'recipient', type: 'target'}, {id: 'site', type: 'place'}, {id: 'layout', type: 'formation'}];
    const record = {id: 'test-fire-context', roles: [...fire.roles, ...roles]};
    for (const {id, type} of roles) {
        things[id] = {kind: type, id};
        args.bindings[id] = things[id];
    }
    const result = compileGuMove(record, args);
    assert.equal(result.ok, true);
    const {law, method, bindings} = result;
    const inputs = {...args, bindings};
    const quote = quoteWorking(law, method, inputs);
    assert.equal(quote.ok, true);
    assert.equal(quote.steps[0].op, 'context/check');
    assert.equal(quote.effects[0].kind, 'flame');
    const start = beginQuotedWorking(law, method, {...inputs, fingerprint: quote.fingerprint});
    delete things.layout;
    const {record: done, effects} = settleWorking(law, start.record, {now: 0, ports: args.ports});
    assert.equal(done.status, 'interrupted');
    assert.equal(done.receipts[0].role, 'layout');
    assert.equal(done.receipts[0].reason, 'role-unavailable');
    assert.deepEqual(done.facts.reserves, args.facts.reserves);
    assert.deepEqual(effects, []);
});

test('Tai Qiu and Air Lock keep their typed context and world-field requirements explicit', () => {
    const {args, things} = fixture();
    for (const [recordId, id, type] of [['air-lock', 'area', 'world-field'], ['air-lock', 'affected-carrier', 'target'],
        ['lang-ya-tai-qiu-teleportation', 'site-substrate', 'target'], ['lang-ya-tai-qiu-teleportation', 'sub-formation', 'formation'],
        ['lang-ya-tai-qiu-teleportation', 'main-formation', 'formation'], ['lang-ya-tai-qiu-teleportation', 'travel-key', 'unknown']]) {
        args.bindings[id] = guRef('attack');
        const result = compileGuMove(move(recordId), args);
        const reason = type === 'world-field' ? 'world-field-required' : type === 'unknown' ? 'role-unresolved' : 'wrong-binding-type';
        assert.equal(result.ok, false);
        assert.ok(result.requirements.some(row => row.role === id && row.type === type && row.reason === reason), id);
    }
    things.eagle = {kind: 'target', id: 'eagle'};
    things.area = {kind: 'world-field', id: 'area'};
    args.bindings['affected-carrier'] = things.eagle;
    args.bindings.area = things.area;
    assert.deepEqual(compileGuMove(move('air-lock'), args).requirements,
        [{role: 'area', type: 'world-field', reason: 'world-field-required'}]);
    assert.ok(compileGuMove(move('lang-ya-tai-qiu-teleportation'), args).requirements
        .some(row => row.role === 'local-dao-marks' && row.reason === 'world-field-required'));
    assert.deepEqual(args.facts.reserves, {keeper: {primeval: 10}});
});
