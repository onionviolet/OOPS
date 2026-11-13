import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runCase, runCaseData} from '../scripts/coverage_report.mjs';
import {coverageCase, MOONBLADE_COVERAGE_ID, PLATE_SHELTER_COVERAGE_ID,
    TELEPORT_ARRAY_COVERAGE_ID, CLEANSING_ARRAY_COVERAGE_ID, THREE_HEADS_COVERAGE_ID,
    FUTURE_TRAVEL_COVERAGE_ID} from '../src/world_packs/gu_move_coverage_cases.js';
import {beginWorking, quoteWorking, settleWorking} from '../src/kernel_working.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {GU_FORMATION_PLATE_LAW, guCleansingArrayPack, guFormationPlateMethod} from '../src/world_packs/gu_formation_plate.js';
import {GU_USE_AGREEMENT_PROPERTIES} from '../src/world_packs/gu_use_agreement.js';
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

test('the Storm ledger runs the live beat and detects a missing freeze', async () => {
    const row = moves.find(entry => entry.id === 'iceblade-storm');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const altered = structuredClone(coverageCase(row.id));
    const beat = altered.timeline[0].working.beat;
    beat.world.effects = beat.world.effects.filter(effect => effect.object !== 'heat');
    assert.deepEqual(await runCaseData(altered), {
        state: 'blocked:runner-expect-mismatch', detail: 'settle: the world did not change as step expect says',
    });
});

test('the Giant Hand ledger requires its paid support pair to move the slab', async () => {
    const row = moves.find(entry => entry.id === 'giant-hand-condensed-core');
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const weaker = structuredClone(coverageCase(row.id));
    weaker.world.holders.find(holder => holder.id === 'focused').properties.gu_gather_force = 2;
    assert.deepEqual(await runCaseData(weaker), {
        state: 'blocked:runner-expect-mismatch', detail: 'gather: the world did not change as step expect says',
    });
});

test('the prepared Giant Hand ledger checks expiry at the release boundary', async () => {
    const row = moves.find(entry => entry.id === 'giant-hand-stored-phantoms');
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const early = structuredClone(coverageCase(row.id));
    early.timeline.find(step => step.id === 'wait').advanceTo = 49;
    early.timeline.at(-1).advanceTo = 50;
    assert.deepEqual(await runCaseData(early), {
        state: 'blocked:runner-expect-mismatch', detail: 'expired: the expected working interruption did not occur',
    });
});

test('the assisted Moonblade ledger needs an open sightline after release', async () => {
    const row = moves.find(entry => entry.id === MOONBLADE_COVERAGE_ID);
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const shut = structuredClone(coverageCase(row.id));
    shut.timeline.splice(-1, 0, {id: 'shut-sightline', ops: [{op: 'link_set', id: 'far-line', state: 'closed'}]});
    assert.deepEqual(await runCaseData(shut), {
        state: 'blocked:runner-expect-mismatch', detail: 'assisted-contact: the world did not change as step expect says',
    });
});

test('the Formation Plate ledger requires the installed shelter to expire', async () => {
    const row = moves.find(entry => entry.id === PLATE_SHELTER_COVERAGE_ID);
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const prolonged = coverageCase(row.id);
    prolonged.timeline.find(step => step.id === 'install').working.options.duration = 5;
    assert.deepEqual(await runCaseData(prolonged), {
        state: 'blocked:runner-expect-mismatch', detail: 'after-expiry: the world did not change as step expect says',
    });
});

test('the teleport array survives loss of the setup plate and depends on the installed anchor', async () => {
    const row = moves.find(entry => entry.id === TELEPORT_ARRAY_COVERAGE_ID);
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const direct = coverageCase(row.id);
    direct.timeline = direct.timeline.filter(step => !step.restore && !step.id.startsWith('mid-'));
    assert.equal((await runCaseData(direct)).state, row.state);

    const drained = coverageCase(row.id);
    const restored = drained.timeline.findIndex(step => step.id === 'restore-crossing');
    drained.timeline.splice(restored, 0, {id: 'drain-water-marks', ops: [
        {op: 'property', holder: 'water-corpse', property: 'gu_anchor_water_marks', value: 0},
    ]});
    assert.deepEqual(await runCaseData(drained), {
        state: 'blocked:runner-working-interrupted', detail: 'outbound step 0: installed route unavailable',
    });
});

test('the cleansing array wears down compatible restraints across paid pulses and restore', async () => {
    const row = moves.find(entry => entry.id === CLEANSING_ARRAY_COVERAGE_ID);
    assert.equal(row.status, 'proposed');
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const incompatible = coverageCase(row.id);
    incompatible.world.lawFields.find(field => field.id === 'personal').params.guCleansable = false;
    assert.deepEqual(await runCaseData(incompatible), {
        state: 'blocked:runner-expect-mismatch', detail: 'weakened: the world did not change as step expect says',
    });
    const reinforced = coverageCase(row.id);
    const midPulse = reinforced.timeline.findIndex(step => step.id === 'mid-pulse');
    reinforced.timeline.splice(midPulse + 1, 0, {id: 'reinforce-restraint', ops: [
        {op: 'law_params', id: 'personal', params: {guRestraintStrength: 2}},
    ]});
    assert.deepEqual(await runCaseData(reinforced), {
        state: 'blocked:runner-expect-mismatch', detail: 'cleansed: the world did not change as step expect says',
    });
    const direct = coverageCase(row.id);
    direct.timeline = direct.timeline.filter(step => !step.restore && step.id !== 'mid-pulse');
    assert.equal((await runCaseData(direct)).state, row.state);
});

test('scheduled Binding Thread upkeep holds the specimen across restore and releases it after interruption', async () => {
    const data = coverageCase(CLEANSING_ARRAY_COVERAGE_ID);
    const fuel = 'energy:immortal.essence';
    const balance = (holder, direction, to) => ({holder, quantity: fuel, direction, to});
    const fieldId = 'restraint.first-bind.0';
    const field = strength => ({scope: 'keeper', kind: 'block', until: 21, params: {
        verb: 'move', object: 'position', guCleansable: true, guRestraintStrength: strength,
        guRestraintSpecimen: 'thread', guRestraintCaster: 'rival',
    }});
    const observed = (strength, direction = 'changed') =>
        ({lawField: fieldId, direction, to: strength ? field(strength) : null});
    const heldBy = (to, direction = 'changed') => ({holder: 'thread', property: 'gu_use_working', direction, to});
    const work = (id, operation, bindings, schedule) =>
        ({id, working: {id, family: 'gu-formation-plate', options: {operation, ...schedule}, bindings}});
    const bind = (id, schedule) => work(id, 'restrain', {operator: {kind: 'operator', id: 'rival'},
        specimen: {kind: 'gu', id: 'thread'}, subject: {kind: 'body', id: 'keeper'}}, schedule);
    const cleanse = id => work(id, 'cleanse', {operator: {kind: 'operator', id: 'keeper'}, site: {kind: 'place', id: 'ford'}});
    const steps = Object.fromEntries(data.timeline.map(step => [step.id, step]));
    data.engine.shared.properties.push(...GU_USE_AGREEMENT_PROPERTIES);
    data.world.lawFields = data.world.lawFields.filter(row => row.id !== 'personal');
    data.world.holders.push(
        {id: 'rival', kind: 'body', as: ['operator'], place: 'ford', properties: {alive: true}, quantities: {[fuel]: 3}},
        {...guBodyHolder({id: 'binding-thread', needs: 'gu'}, {id: 'thread', place: 'ford', satiety: 20}),
            properties: {alive: true, gu_kind: 'binding-thread', gu_keeper: 'rival', gu_controller: 'rival'}},
    );
    steps.install.working.options.duration = 8;
    data.timeline = [
        bind('first-bind'), steps['wrong-layout'],
        {id: 'bound-by-thread', advanceTo: 1, expect: [balance('rival', 'down', 2), observed(2)]},
        steps.bound, steps.refused, steps.rewrite, steps.rewritten, steps.install, steps.installed, steps['retrieve-plate'],
        cleanse('first-pulse'),
        {id: 'weakened', advanceTo: 8, expect: [balance('keeper', 'down', 2), observed(1)]},
        cleanse('second-pulse'), bind('sustain', {renewals: 1, interval: 2}),
        {id: 'pending', restore: true},
        {id: 'reinforced', advanceTo: 9, expect: [balance('rival', 'down', 1), observed(2), heldBy('sustain')]},
        bind('competing-use'),
        {id: 'second-hit', advanceTo: 10, interruption: {working: 'competing-use', reason: 'gu-already-committed'},
            expect: [balance('keeper', 'down', 1), balance('rival', 'unchanged', 1), observed(1), heldBy('sustain', 'unchanged')]},
        steps['still-bound'], cleanse('last-pulse'),
        {id: 'pending-renewal', restore: true},
        {id: 'rival-retreats', ops: [{op: 'move', holder: 'rival', to: 'bank'}]},
        {id: 'failed-bind', advanceTo: 11, interruption: {working: 'sustain', reason: 'local binding thread unavailable'},
            expect: [balance('rival', 'unchanged', 1), observed(1, 'unchanged')]},
        {id: 'last-hit', advanceTo: 12, expect: [balance('keeper', 'down', 0), observed(null)]},
        steps.free,
    ];
    data.expect = [balance('keeper', 'down', 0), balance('rival', 'down', 1), ...steps.free.expect];
    assert.deepEqual(await runCaseData(data), {state: 'expressed-authored', detail: 'case module is library or test only'});

    const renewal = structuredClone(data);
    const retreat = renewal.timeline.find(step => step.id === 'rival-retreats');
    retreat.ops = [];
    const settled = renewal.timeline.find(step => step.id === 'failed-bind');
    delete settled.interruption;
    settled.expect = [balance('rival', 'down', 0), observed(2), heldBy(null)];
    renewal.timeline.at(-2).expect = [balance('keeper', 'down', 0), observed(1)];
    renewal.timeline[renewal.timeline.length - 1] = {...steps['still-bound'], id: 'bound-after-renewal'};
    renewal.expect = [balance('keeper', 'down', 0), balance('rival', 'down', 0), observed(1)];
    assert.deepEqual(await runCaseData(renewal), {state: 'expressed-authored', detail: 'case module is library or test only'});
    const direct = structuredClone(renewal);
    direct.timeline = direct.timeline.filter(step => !step.restore);
    assert.deepEqual(await runCaseData(direct), await runCaseData(renewal));

    const reuse = structuredClone(data);
    reuse.timeline.push(
        {id: 'bring-thread', ops: [{op: 'move', holder: 'thread', to: 'bank'}]},
        bind('reuse-thread'),
        {id: 'rebound', advanceTo: 13, expect: [balance('rival', 'down', 0), {
            lawField: 'restraint.reuse-thread.0', direction: 'changed', to: {...field(2), until: 33},
        }]},
    );
    reuse.expect = [balance('keeper', 'down', 0), balance('rival', 'down', 0), ...steps.free.expect];
    assert.deepEqual(await runCaseData(reuse), {state: 'expressed-authored', detail: 'case module is library or test only'});

    const released = structuredClone(renewal);
    const release = (id, actor) => work(id, 'release-thread', {
        operator: {kind: 'operator', id: actor}, specimen: {kind: 'gu', id: 'thread'},
    }, {working: 'sustain'});
    const releaseAt = released.timeline.findIndex(step => step.id === 'rival-retreats');
    released.timeline.splice(releaseAt, 2,
        {...release('foreign-release', 'keeper'), interruption: {working: 'foreign-release', reason: 'no matching binding thread hold'},
            expect: [heldBy('sustain', 'unchanged')]},
        {...release('owner-release', 'rival'), expect: [heldBy(null), balance('rival', 'unchanged', 1), observed(1, 'unchanged')]},
        bind('replacement-cast'),
        {id: 'old-renewal-refused', advanceTo: 11, interruption: {working: 'sustain', reason: 'held binding thread unavailable'},
            expect: [balance('rival', 'down', 0), observed(2)]},
    );
    assert.deepEqual(await runCaseData(released), {state: 'expressed-authored', detail: 'case module is library or test only'});
});

test('open-ended Binding Thread upkeep renews the same hold until release or a missed payment', () => {
    const {engine: {shared}} = coverageCase(CLEANSING_ARRAY_COVERAGE_ID);
    const fuel = 'energy:immortal.essence';
    const config = {shared, packs: ['l.living_body', 'a.mind', guCleansingArrayPack.id], ownPacks: [guCleansingArrayPack],
        host: {laws: [GU_FORMATION_PLATE_LAW]}};
    const initial = createEngineWorld({...config, holders: [
        {id: 'ford', kind: 'place'},
        {id: 'caster', kind: 'body', as: ['operator'], place: 'ford', properties: {alive: true, mind_awake: true}, quantities: {[fuel]: 4}},
        {id: 'target', kind: 'body', place: 'ford', properties: {alive: true, mind_awake: true}},
        {...guBodyHolder({id: 'binding-thread', needs: 'gu'}, {id: 'thread', place: 'ford', satiety: 20}),
            properties: {alive: true, gu_kind: 'binding-thread', gu_keeper: 'caster', gu_controller: 'caster'}},
    ]});
    const operator = {kind: 'operator', id: 'caster'};
    const specimen = {kind: 'gu', id: 'thread'};
    const start = (engine, id, options) => startEngineWorking(engine, {id, law: GU_FORMATION_PLATE_LAW,
        method: guFormationPlateMethod(options), bindings: {operator, specimen,
            ...(options.operation === 'restrain' && {subject: {kind: 'body', id: 'target'}})}});
    const advance = (engine, to) => {
        const result = advanceEngineWorld(engine, to);
        assert.equal(result.pending, false);
        return result.engine;
    };
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const essence = engine => engine.world.holders.caster.quantities[fuel];
    const thread = engine => engine.world.holders.thread.properties;
    const stopped = engine => engine.world.chain.filter(row => row.kind === 'gu.restraint.upkeep-stopped');
    const pending = start(initial, 'sustain', {operation: 'restrain', sustain: true, interval: 2});
    const sustained = advance(pending, 5);
    assert.equal(essence(sustained), 1);
    assert.equal(thread(sustained).gu_use_working, 'sustain');
    assert.equal(thread(sustained).gu_use_working_until, 7);
    assert.equal(sustained.world.laws.find(field => field.scope === 'target').params.guRestraintStrength, 2);

    const blocked = advance(start(restore(sustained), 'blocked', {operation: 'restrain'}), 6);
    assert.equal(blocked.records.workings.blocked.record.receipts.at(-1).reason, 'gu-already-committed');
    assert.equal(essence(blocked), 1);

    const exhausted = advance(restore(sustained), 9);
    assert.deepEqual(serializeEngineWorld(exhausted), serializeEngineWorld(advance(pending, 9)));
    assert.equal(essence(exhausted), 0);
    assert.equal(thread(exhausted).gu_use_working, undefined);
    assert.deepEqual(stopped(exhausted).map(row => [row.at, row.detail.reason]), [[9, 'essence-unavailable']]);

    const released = advance(start(restore(sustained), 'release', {operation: 'release-thread', working: 'sustain'}), 5);
    assert.equal(thread(released).gu_use_working, undefined);
    assert.equal(essence(advance(released, 7)), 1);
    assert.equal(essence(advance(start(released, 'replacement', {operation: 'restrain'}), 6)), 0);

    const stun = (engine, id) => applyEngineOps(engine, [{op: 'publish', kind: 'effect.bind.mind', place: 'ford',
        detail: {parts: {time: 'timed'}, application: {targets: [id], mind: {faculty: 'awareness'}, minutes: 1}}}],
    'fixture:stun');
    const unrelated = stun(sustained, 'target');
    assert.equal(thread(unrelated).gu_use_working, 'sustain');
    const interrupted = stun(restore(unrelated), 'caster');
    assert.equal(interrupted.world.clock, 5);
    assert.equal(thread(interrupted).gu_use_working, undefined);
    assert.deepEqual(stopped(interrupted).map(row => [row.at, row.detail.reason]), [[5, 'focus-lost']]);
    assert.deepEqual(interrupted.world.laws, sustained.world.laws);
    const recovered = advance(restore(interrupted), 7);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(stun(unrelated, 'caster'), 7)));
    assert.equal(recovered.world.holders.caster.properties.mind_awake, true);
    assert.equal(essence(recovered), 1);
    assert.equal(essence(advance(start(recovered, 'recast', {operation: 'restrain'}), 8)), 0);
});

test('the combined body ledger depends on live participation at the later lift', async () => {
    const row = moves.find(entry => entry.id === THREE_HEADS_COVERAGE_ID);
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const stays = coverageCase(row.id);
    stays.timeline = stays.timeline.filter(step => step.id !== 'member-leaves');
    assert.deepEqual(await runCaseData(stays), {
        state: 'blocked:runner-expect-mismatch', detail: 'separated: the world did not change as step expect says',
    });
});

test('the Future Self ledger requires a live river course change to stop the second crossing', async () => {
    const row = moves.find(entry => entry.id === FUTURE_TRAVEL_COVERAGE_ID);
    assert.equal(row.state, 'expressed-authored');
    assert.equal((await runCase(row, {reachable: new Set()})).state, row.state);
    const unchanged = coverageCase(row.id);
    unchanged.timeline = unchanged.timeline.filter(step => step.id !== 'alter-course-again');
    assert.deepEqual(await runCaseData(unchanged), {
        state: 'blocked:runner-expect-mismatch', detail: 'refused: the expected working interruption did not occur',
    });
});

test('both Gu ledgers cover their denominators with no unclassified row (MS1, CV2-CV4)', () => {
    assert.equal(kinds.length, 1466);
    assert.equal(moves.length, 23 + 753 + 2);
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
            if (row.state.startsWith('blocked:') && row.layer === 'chapter') {
                assert.ok(row.roles.some(role => !role.kind || !guAbility(role.kind)), row.id);
            }
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
