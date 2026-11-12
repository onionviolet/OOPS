import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {advanceWorld, applyWorldOps, substratePort} from '../src/world_substrate.js';
import {ENGINE_PACKS, serializeEngineWorld, restoreEngineWorld} from '../src/engine_world.js';
import {settleWorking, serializeWorking, restoreWorking} from '../src/kernel_working.js';
import {landEffect} from '../src/effect_host.js';
import {advanceStoredWorkings, serializeStored, restoreStored} from '../src/stored_working.js';
import {config, engine, n, rowRecords, moveSchedule, strikeLaw, strikeWorking, expected, stripReading} from './fixtures/stored_workings/rows.mjs';

function run(row, stops = [n.end], reload = false) {
    let current = engine(), records = rowRecords(row), working = strikeWorking();
    const receipts = [], hits = [];
    const advance = (world, to) => {
        const times = [...new Set([to, ...moveSchedule.map(s => s.at), ...n.strikeTimes])]
            .filter(t => t > world.clock && t <= to).sort((a, b) => a - b);
        for (const at of times) {
            world = advanceWorld(current.rules, world, at).world;
            if (row === 'ward') for (const event of moveSchedule.filter(s => s.at === at))
                world = applyWorldOps(current.rules, world, event.ops, 'traveler');
            if (n.strikeTimes.includes(at) && ['held', 'draught'].includes(row)) {
                const settled = settleWorking(strikeLaw, working, {now: at, ports: {read: substratePort(world)}});
                working = settled.record;
                for (const {effect} of settled.effects) {
                    const hit = landEffect(current.rules, world, effect, {cause: 'strike', by: 'visitor'});
                    world = hit.world; hits.push({at, outcomes: hit.outcomes});
                }
            }
        }
        return {world};
    };
    for (const to of stops) {
        const out = advanceStoredWorkings({rules: current.rules, world: current.world, records, to, advance,
            ports: {stimuli: (_world, record, at) => row === 'strip' && at === n.pulse ? [{kind: 'touch', by: 'person'}] : []}});
        current = {...current, world: out.world}; records = out.records; receipts.push(...out.receipts);
        if (reload) {
            current = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(current))), config);
            records = records.map(record => restoreStored(JSON.parse(JSON.stringify(serializeStored(record)))));
            working = restoreWorking(strikeLaw, JSON.parse(JSON.stringify(serializeWorking(working))));
        }
    }
    return {engine: serializeEngineWorld(current), records, receipts, working, hits,
        events: current.world.chain};
}

for (const row of ['strip', 'ward', 'draught', 'held']) {
    test(`${row}: one clock agrees with partitions and engine plus stored save/restore`, () => {
        const jump = run(row);
        assert.deepEqual(run(row, n.parts), jump);
        assert.deepEqual(run(row, [n.reload, n.end], true), jump);
        const {world} = jump.engine;
        assert.ok(jump.receipts.length);
        if (row === 'strip') {
            assert.ok(stripReading.discords > 0, 'the UNNAMED breath/veil pair reads as discord');
            assert.equal(world.holders.room.quantities.temperature, expected.stripHeat);
            assert.equal(world.holders.room.quantities.noise, expected.stripNoise);
            assert.equal(jump.records[0].status, 'spent');
        } else if (row === 'ward') {
            assert.equal(world.holders.room.quantities.temperature, expected.wardRepeatedHeat);
            assert.equal(world.holders.empty.quantities.temperature, expected.wardHeat);
            assert.equal(jump.receipts[0].status, 'bypassed');
            const unattended = jump.records.find(r => r.carrier === 'empty').receipts[0];
            assert.equal(unattended.by, null);
            assert.equal(unattended.at, n.strikeTimes[0]);
            assert.equal(Object.values(world.holders).filter(h => h.kind === 'body' && h.place === 'empty').length, 0);
            assert.ok(Object.keys(world.holders.empty.ledger.humidity).some(k => k.startsWith('b.brew_steam')));
        } else if (row === 'draught') {
            assert.equal(world.holders.person.quantities.vitality, expected.draughtVitality, JSON.stringify(jump.records.map(r => r.receipts)));
            assert.ok(jump.records.every(r => r.status === 'spent'));
            assert.ok(jump.events.some(r => r.kind === 'effect.remove' && r.detail.object === 'vitality' && r.detail.amount < 0));
            assert.equal(jump.records[0].status, 'spent', 'the saved event detail matches the carrier after reload');
        } else {
            assert.equal(jump.working.status, 'complete');
            assert.ok(jump.hits[0].outcomes[0].blocked.length, 'held guard protects the kernel step at its deadline');
            assert.ok(jump.hits[1].outcomes[0].applied.length, 'the later kernel step lands after upkeep lapses');
            assert.equal(world.holders.person.quantities.vitality, expected.heldVitality);
            assert.equal(world.holders.person.quantities['energy:stamina'], 0);
            assert.equal(jump.records[0].receipts.find(r => r.status === 'dormant').at, expected.heldLapse);
            assert.equal(world.laws.length, 0);
        }
    });
}

test('a blow published before restore triggers from its saved detail at the next pulse', () => {
    const current = engine(), records = rowRecords('draught').slice(0, 1);
    // Put the pulse at minute 2: the blow lands at 3 and is read at 4.
    records[0].pulse = 2;
    records[0].watch.next = 2;
    let working = strikeWorking();
    const advance = (world, to) => {
        const times = [...new Set([to, ...n.strikeTimes])].filter(t => t > world.clock && t <= to).sort((a, b) => a - b);
        for (const at of times) {
            world = advanceWorld(current.rules, world, at).world;
            if (n.strikeTimes.includes(at)) {
                const settled = settleWorking(strikeLaw, working, {now: at, ports: {read: substratePort(world)}});
                working = settled.record;
                for (const {effect} of settled.effects) world = landEffect(current.rules, world, effect, {cause: 'strike', by: 'visitor'}).world;
            }
        }
        return {world};
    };
    const beforePulse = advanceStoredWorkings({rules: current.rules, world: current.world, records, to: 3, advance, ports: {}});
    const hit = beforePulse.world.chain.find(r => r.kind === 'effect.remove');
    assert.deepEqual(hit.detail, {target: 'person', object: 'vitality', amount: -n.harm});
    assert.equal(beforePulse.receipts.length, 0);
    const saved = JSON.parse(JSON.stringify(serializeEngineWorld({...current, world: beforePulse.world})));
    const restored = restoreEngineWorld(saved, config);
    const restoredRecords = beforePulse.records.map(record => restoreStored(JSON.parse(JSON.stringify(serializeStored(record)))));
    const out = advanceStoredWorkings({rules: restored.rules, world: restored.world, records: restoredRecords, to: 4,
        advance: (world, to) => ({world: advanceWorld(restored.rules, world, to).world}), ports: {}});
    assert.equal(out.receipts.length, 1, 'the restored chain detail triggers the draught');
    assert.equal(out.records[0].status, 'spent');

    const wrongRecord = restoreStored(JSON.parse(JSON.stringify(serializeStored(restoredRecords[0]))));
    wrongRecord.trigger.where['detail.target'] = 'visitor';
    const wrong = advanceStoredWorkings({rules: restored.rules, world: restored.world, records: [wrongRecord], to: 4,
        advance: (world, to) => ({world: advanceWorld(restored.rules, world, to).world}), ports: {}});
    assert.equal(wrong.receipts.length, 0, 'a different target does not trigger');
    assert.equal(wrong.records[0].status, 'armed', 'the unmatched working remains untriggered and held');
});

test('mutation guard: pulse receipts use event boundaries even when the call ends later', () => {
    const runToEnd = run('ward');
    const pulse = runToEnd.records.find(r => r.carrier === 'empty').receipts[0];
    assert.equal(pulse.at, n.strikeTimes[0]);
    assert.notEqual(pulse.at, n.end);
    const mutated = structuredClone(runToEnd);
    mutated.records.find(r => r.carrier === 'empty').receipts[0].at = n.end;
    assert.notDeepEqual(mutated, run('ward', n.parts), 'a call-time mutant loses partition equivalence');
});

test('cross-domain mechanism contains no trigger quantity, pack id or engine import', () => {
    const source = readFileSync(new URL('../src/stored_working.js', import.meta.url), 'utf8');
    assert.ok(!source.includes('humidity'));
    for (const pack of ENGINE_PACKS) assert.ok(!source.includes(pack.id));
    assert.ok(!source.includes('engine_world'));
});
