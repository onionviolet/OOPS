import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {guSecretWorking, GU_SECRET_LAW, guSecretPack} from '../src/world_packs/gu_obscured_secret.js';
import {GU_WARD_BREAK_LAW, guWardBreakWorking, guWardLayerReportWorking, guWardReportWorking} from '../src/world_packs/gu_ward_break.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {landEffect} from '../src/effect_host.js';

const reserve = 'energy:immortal', attention = 'energy:mental', layer = 'gu_secret_layer';
const counterFuel = 'energy:primeval.rank1';
const ref = (kind, id) => ({kind, id});
const trackLaw = defineWorkingLaw({id: 'trial.guard-watch', revision: 1, operations: {
    signal: {roles: {watcher: 'operator', site: 'place'}, settle({bound, options}) {
        const {watcher, site} = bound;
        const recognized = watcher.place === site.holder &&
            watcher.properties['sensed-presence']?.includes(site.holder + ':' + options.channel);
        if (!recognized) return {ok: false, reason: 'No contact on that channel.'};
        return {ok: true, effects: [{op: 'add', holder: site.holder, quantity: 'stock:reports', amount: 1}]};
    }},
}});
const config = {
    ownPacks: [guSecretPack], packs: ['l.living_body', 'n.presence', guSecretPack.id],
    shared: {quantities: sharedQuantities(['energy', 'stock']),
        properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
            {id: 'gu_rank', type: 'level', min: 1}]},
    host: {laws: [GU_SECRET_LAW, trackLaw, GU_WARD_BREAK_LAW]},
};
function opening() {
    const engine = createEngineWorld({...config, holders: [
        {id: 'hall', kind: 'place', quantities: {'stock:reports': 0}},
        {id: 'outside', kind: 'place'},
        {id: 'owner', kind: 'body', as: ['operator', 'creature'], place: 'hall', quantities: {[reserve]: 5}},
        {id: 'core', kind: 'body', as: ['gu'], place: 'hall', quantities: {satiety: 20},
            properties: {alive: true, gu_kind: 'heavenly-secret', gu_rank: 9, gu_keeper: 'owner', gu_controller: 'owner'}},
        {id: 'cutter', kind: 'body', as: ['gu'], place: 'hall', quantities: {satiety: 20},
            properties: {alive: true, gu_kind: 'ward-cutter', gu_keeper: 'watcher', gu_controller: 'watcher'}},
        ...['watcher', 'bystander'].map(id => ({id, kind: 'body', as: ['operator'], place: 'hall',
            quantities: {[attention]: 20, [counterFuel]: 2}, properties: {alive: true, senses: ['spirit', 'sight']}})),
    ]});
    return startEngineWorking(engine, {id: 'raise', law: GU_SECRET_LAW, method: guSecretWorking('raise'),
        bindings: {operator: ref('operator', 'owner'), specimen: ref('gu', 'core')}});
}
const scan = (engine, id, channel, force, observer = 'watcher', subject = 'owner') => startEngineWorking(engine, {
    id, law: GU_SECRET_LAW, method: guSecretWorking('probe', {channel, force}),
    bindings: {observer: ref('operator', observer), subject: ref('creature', subject)},
});
const signal = (engine, id, channel) => startEngineWorking(engine, {id, law: trackLaw,
    method: {id: 'trial.signal', law: trackLaw.ref, revision: 1, roles: {watcher: 'operator', site: 'place'},
        steps: [{op: 'signal', minutes: 2, bindings: {watcher: 'watcher', site: 'site'}, options: {channel}}]},
    bindings: {watcher: ref('operator', 'watcher'), site: ref('place', 'hall')}});
function advance(engine, to) {
    const run = advanceEngineWorld(engine, to);
    assert.equal(run.pending, false);
    return run.engine;
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const amount = (engine, id, key) => engine.world.holders[id].quantities[key];
const contacts = (engine, id) => engine.world.holders[id].properties['sensed-presence'] ?? [];
const ordinarySense = engine => landEffect(engine.rules, engine.world, {
    sentence: {verb: 'sense', object: 'information', target: 'bound', time: 'instant',
        carrier: 'body', cost: 'none', limits: []},
    details: {target: {shape: 'holder', id: 'owner'}, channel: 'spirit', place: 'hall', presence: true},
}, {by: 'watcher', cause: 'fixture.ordinary-sense'}).outcomes[0];

test('investigation can outpace a recovering Gu layer and a guard acts on the resulting contact', () => {
    const raised = advance(restore(advance(opening(), 1)), 3);
    assert.equal(amount(raised, 'owner', reserve), 2);
    assert.equal(amount(raised, 'owner', layer), 6);
    assert.equal(ordinarySense(raised).skipped[0].reason, 'concealed');
    const weak = advance(signal(scan(raised, 'first', 'spirit', 4), 'no-contact', 'spirit'), 5);
    assert.equal(amount(weak, 'owner', layer), 3);
    assert.equal(amount(weak, 'watcher', attention), 16);
    assert.equal(weak.records.workings['no-contact'].record.status, 'interrupted');
    assert.deepEqual(contacts(weak, 'watcher'), []);
    const pending = signal(scan(weak, 'follow-up', 'spirit', 5), 'contact', 'spirit');
    const penetrated = advance(restore(pending), 7);
    assert.deepEqual(serializeEngineWorld(penetrated), serializeEngineWorld(advance(pending, 7)));
    assert.equal(amount(penetrated, 'watcher', attention), 11);
    assert.equal(amount(penetrated, 'hall', 'stock:reports'), 1);
    assert.deepEqual(contacts(penetrated, 'watcher'), ['hall:spirit']);
    assert.deepEqual(contacts(penetrated, 'bystander'), []);

    const rested = advance(weak, 8);
    assert.equal(amount(rested, 'owner', layer), 6);
    const after = advance(scan(rested, 'after-recovery', 'spirit', 5), 9);
    assert.deepEqual(contacts(after, 'watcher'), []);
    assert.equal(amount(after, 'owner', layer), 1);
});

test('a fully depleted layer briefly opens the ordinary sense path, then restores the screen', () => {
    const raised = advance(opening(), 3);
    const depleted = advance(scan(raised, 'exhaust', 'spirit', 6), 4);
    assert.equal(amount(depleted, 'owner', layer), 0);
    assert.deepEqual(contacts(depleted, 'watcher'), []);
    assert.equal(ordinarySense(depleted).observed[0].target, 'owner');
    const healed = advance(restore(depleted), 8);
    let minute = depleted;
    for (let at = 5; at <= 8; at++) minute = advance(minute, at);
    assert.deepEqual(serializeEngineWorld(healed), serializeEngineWorld(minute));
    assert.equal(amount(healed, 'owner', layer), 4);
    assert.equal(ordinarySense(healed).skipped[0].reason, 'concealed');
});

test('another channel bypasses this layer, a separate screen stops that channel, and no-sense refuses before spending', () => {
    const raised = advance(opening(), 3);
    const seen = advance(signal(scan(raised, 'look', 'sight', 1), 'sight-report', 'sight'), 5);
    assert.deepEqual(contacts(seen, 'watcher'), ['hall:sight']);
    assert.equal(amount(seen, 'owner', layer), 6);
    assert.equal(amount(seen, 'hall', 'stock:reports'), 1);
    const screened = applyEngineOps(raised, [{op: 'property', holder: 'owner', property: 'concealed', value: ['sight']}], 'fixture.screen');
    const blocked = advance(scan(screened, 'look', 'sight', 1), 4);
    assert.deepEqual(contacts(blocked, 'watcher'), []);
    assert.equal(amount(blocked, 'owner', layer), 6);
    const incapable = advance(scan(raised, 'smell', 'scent', 1), 4);
    assert.equal(incapable.records.workings.smell.record.status, 'interrupted');
    assert.equal(amount(incapable, 'watcher', attention), 20);
});

test('a severed screen needs to rebuild before it can hide the subject again', () => {
    const raised = advance(opening(), 3);
    const pending = startEngineWorking(raised, {id: 'sever', law: GU_WARD_BREAK_LAW, method: guWardBreakWorking('gu-secret.owner'),
        bindings: {operator: ref('operator', 'watcher'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner')}});
    const broken = advance(restore(pending), 4);
    assert.equal(amount(broken, 'watcher', counterFuel), 0);
    assert.equal(amount(broken, 'owner', layer), 0);
    assert.equal(ordinarySense(broken).observed[0].target, 'owner');
    const scanPending = scan(broken, 'probe-the-gap', 'spirit', 1);
    const during = advance(restore(scanPending), 5);
    assert.equal(amount(during, 'owner', layer), 1, 'the probe finds no screen to drain');
    assert.deepEqual(contacts(during, 'watcher'), ['hall:spirit']);
    assert.deepEqual(contacts(during, 'bystander'), []);
    const reported = advance(signal(during, 'report-the-gap', 'spirit'), 7);
    assert.equal(amount(reported, 'hall', 'stock:reports'), 1);
    assert.equal(amount(reported, 'owner', layer), 3);
    assert.equal(ordinarySense(reported).skipped[0].reason, 'concealed');
    assert.deepEqual(serializeEngineWorld(advance(restore(broken), 7)),
        serializeEngineWorld(advance(advance(advance(broken, 5), 6), 7)));
});

test('two paid sources can keep the same severed screen from rebuilding', () => {
    const raised = advance(opening(), 3);
    const hold = (engine, id, observer) => startEngineWorking(engine, {id, law: GU_SECRET_LAW, method: guSecretWorking('suppress'),
        bindings: {observer: ref('operator', observer), subject: ref('creature', 'owner')}});
    const intact = advance(hold(raised, 'intact', 'watcher'), 4);
    assert.equal(intact.records.workings.intact.record.status, 'interrupted');
    assert.equal(amount(intact, 'watcher', attention), 20);
    const sever = startEngineWorking(raised, {id: 'sever', law: GU_WARD_BREAK_LAW, method: guWardBreakWorking('gu-secret.owner'),
        bindings: {operator: ref('operator', 'watcher'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner')}});
    const broken = advance(sever, 4);
    const first = advance(hold(broken, 'first', 'watcher'), 5);
    const both = advance(hold(first, 'second', 'bystander'), 6);
    assert.equal(amount(both, 'owner', layer), 1);
    assert.equal(amount(both, 'watcher', attention), 18);
    assert.equal(amount(both, 'bystander', attention), 18);
    const left = applyEngineOps(both, [{op: 'move', holder: 'watcher', to: 'outside'}], 'fixture:left');
    const remaining = advance(restore(left), 9);
    assert.equal(amount(remaining, 'owner', layer), 1);
    assert.deepEqual(remaining.world.laws.filter(field => field.kind === 'gu.secret.pressure').map(field => field.params.source), ['bystander']);
    assert.equal(ordinarySense(remaining).observed[0].target, 'owner');
    const healed = advance(restore(remaining), 12);
    assert.deepEqual(serializeEngineWorld(healed), serializeEngineWorld(advance(left, 12)));
    assert.equal(amount(healed, 'owner', layer), 3);
    assert.equal(ordinarySense(healed).skipped[0].reason, 'concealed');
});

test('two paid drains can exhaust an intact screen while a departing source leaves it intact', () => {
    const raised = advance(opening(), 3);
    const drain = (engine, id, observer) => startEngineWorking(engine, {id, law: GU_SECRET_LAW,
        method: guSecretWorking('suppress', {drain: true}),
        bindings: {observer: ref('operator', observer), subject: ref('creature', 'owner')}});
    const pending = drain(drain(raised, 'first-drain', 'watcher'), 'second-drain', 'bystander');
    const midway = advance(pending, 6);
    assert.equal(amount(midway, 'owner', layer), 2);
    assert.equal(ordinarySense(midway).skipped[0].reason, 'concealed');
    const exhausted = advance(restore(midway), 7);
    assert.deepEqual(serializeEngineWorld(exhausted), serializeEngineWorld(advance(pending, 7)));
    assert.equal(amount(exhausted, 'owner', layer), 0);
    assert.equal(amount(exhausted, 'watcher', attention), 17);
    assert.equal(amount(exhausted, 'bystander', attention), 17);
    assert.deepEqual(contacts(exhausted, 'watcher'), []);
    assert.equal(ordinarySense(exhausted).observed[0].target, 'owner');
    const reknit = advance(exhausted, 11);
    assert.equal(amount(reknit, 'owner', layer), 3);
    assert.equal(ordinarySense(reknit).skipped[0].reason, 'concealed');

    const left = applyEngineOps(midway, [{op: 'move', holder: 'bystander', to: 'outside'}], 'fixture:drain-left');
    const intact = advance(restore(left), 7);
    assert.equal(amount(intact, 'owner', layer), 1);
    assert.equal(ordinarySense(intact).skipped[0].reason, 'concealed');
});

test('an outer spirit ward intercepts sustained drains until a paid counter cuts it', () => {
    const raised = advance(opening(), 3);
    const drain = engine => startEngineWorking(engine, {id: 'drain', law: GU_SECRET_LAW,
        method: guSecretWorking('suppress', {drain: true}),
        bindings: {observer: ref('operator', 'watcher'), subject: ref('creature', 'owner')}});
    const shielded = applyEngineOps(raised, [{op: 'law_add', field: {id: 'outer-ward', scope: 'owner', kind: 'conceal',
        params: {channel: 'spirit', probeLoss: 1}}}], 'fixture:outer-spirit-ward');
    const pending = drain(shielded);
    const held = advance(pending, 5);
    assert.equal(amount(held, 'watcher', attention), 17);
    assert.equal(amount(held, 'owner', layer), 6);
    assert.equal(amount(advance(restore(held), 8), 'owner', layer), 6);

    const cutting = startEngineWorking(held, {id: 'cut-outer', law: GU_WARD_BREAK_LAW,
        method: guWardBreakWorking('outer-ward'), bindings: {
            operator: ref('operator', 'watcher'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner'),
        }});
    const cut = advance(restore(cutting), 6);
    assert.equal(amount(cut, 'watcher', counterFuel), 0);
    assert.equal(amount(cut, 'owner', layer), 6);
    assert.equal(cut.world.laws.some(field => field.id === 'outer-ward'), false);
    const drained = advance(cut, 8);
    assert.deepEqual(serializeEngineWorld(drained), serializeEngineWorld(advance(cutting, 8)));
    assert.equal(amount(drained, 'owner', layer), 4);
    assert.equal(ordinarySense(drained).skipped[0].reason, 'concealed');
    assert.equal(amount(advance(drained, 10), 'owner', layer), 6);
});

test('routed pressure spends force on the live sightline and outer ward after restore', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        {op: 'move', holder: 'watcher', to: 'outside'},
        {op: 'link_add', link: {id: 'chosen', kind: 'sightline', from: 'outside', to: 'hall', cost: 1}},
        {op: 'link_add', link: {id: 'alternate', kind: 'sightline', from: 'outside', to: 'hall', cost: 1}},
        {op: 'law_add', field: {id: 'outer-ward', scope: 'owner', kind: 'conceal',
            params: {channel: 'spirit', probeLoss: 1}}},
    ], 'fixture:routed-pressure');
    const pending = startEngineWorking(raised, {id: 'drain', law: GU_SECRET_LAW,
        method: guSecretWorking('suppress', {drain: true, force: 4, throughSightlines: true, route: ['chosen']}),
        bindings: {observer: ref('operator', 'watcher'), subject: ref('creature', 'owner')}});
    const underway = advance(pending, 5);
    assert.equal(amount(underway, 'watcher', attention), 14);
    assert.equal(amount(underway, 'owner', layer), 4);
    const exhausted = advance(restore(underway), 7);
    assert.deepEqual(serializeEngineWorld(exhausted), serializeEngineWorld(advance(pending, 7)));
    assert.equal(amount(exhausted, 'owner', layer), 0);
    assert.deepEqual(contacts(exhausted, 'watcher'), []);
    assert.equal(ordinarySense(exhausted).skipped[0].reason, 'concealed');

    const closed = applyEngineOps(underway, [{op: 'link_set', id: 'chosen', state: 'closed'}], 'fixture:route-closes');
    const blocked = advance(restore(closed), 6);
    assert.equal(amount(blocked, 'watcher', attention), 14);
    assert.equal(amount(blocked, 'owner', layer), 5);
    const reopened = applyEngineOps(blocked, [{op: 'link_set', id: 'chosen', state: 'open'}], 'fixture:route-reopens');
    assert.equal(amount(advance(reopened, 7), 'owner', layer), 3);
});

test('sustained pressure wears down a finite outer ward before reaching the inner screen', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        {op: 'law_add', field: {id: 'finite-ward', scope: 'owner', kind: 'conceal',
            params: {channel: 'spirit', pressureReserve: 3}}},
    ], 'fixture:finite-ward');
    const pending = startEngineWorking(raised, {id: 'drain', law: GU_SECRET_LAW,
        method: guSecretWorking('suppress', {drain: true, force: 2}),
        bindings: {observer: ref('operator', 'watcher'), subject: ref('creature', 'owner')}});
    const charge = engine => engine.world.laws.find(field => field.id === 'finite-ward')?.params.pressureReserve;
    const first = advance(pending, 5);
    assert.equal(charge(first), 1);
    assert.equal(amount(first, 'owner', layer), 6);
    assert.equal(amount(first, 'watcher', attention), 16);
    const broken = advance(restore(first), 6);
    assert.equal(charge(broken), undefined);
    assert.equal(amount(broken, 'owner', layer), 5);
    const drained = advance(broken, 8);
    assert.equal(amount(drained, 'owner', layer), 1);
    assert.deepEqual(serializeEngineWorld(drained), serializeEngineWorld(advance(pending, 8)));

    const left = applyEngineOps(first, [{op: 'move', holder: 'watcher', to: 'outside'}], 'fixture:source-leaves');
    const spared = advance(restore(left), 8);
    assert.equal(charge(spared), 1);
    assert.equal(amount(spared, 'owner', layer), 6);
});

test('a keeper pays to replenish the exact surviving ward during a drain', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        {op: 'property', holder: 'owner', property: 'alive', value: true},
        {op: 'carry', holder: 'bystander', quantity: reserve, amount: 1},
        {op: 'law_add', field: {id: 'finite-ward', scope: 'owner', kind: 'conceal',
            params: {channel: 'spirit', pressureReserve: 5, pressureCapacity: 5, wardKeeper: 'owner'}}},
    ], 'fixture:replenishable-ward');
    const draining = startEngineWorking(raised, {id: 'drain', law: GU_SECRET_LAW,
        method: guSecretWorking('suppress', {drain: true, force: 2}),
        bindings: {observer: ref('operator', 'watcher'), subject: ref('creature', 'owner')}});
    const fill = (engine, keeper) => startEngineWorking(engine, {id: 'fill-' + keeper, law: GU_SECRET_LAW,
        method: guSecretWorking('replenish', {field: 'finite-ward'}),
        bindings: {keeper: ref('operator', keeper), subject: ref('creature', 'owner')}});
    const charge = engine => engine.world.laws.find(field => field.id === 'finite-ward')?.params.pressureReserve;
    const worn = advance(draining, 5);
    assert.equal(charge(worn), 3);
    const pending = fill(fill(worn, 'bystander'), 'owner');
    const restored = advance(restore(pending), 6);
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(advance(pending, 6)));
    assert.equal(charge(restored), 3);
    assert.equal(amount(restored, 'owner', reserve), 1);
    assert.equal(amount(restored, 'bystander', reserve), 1);
    assert.equal(amount(advance(restored, 7), 'owner', layer), 6);
    assert.equal(amount(advance(worn, 7), 'owner', layer), 5);
    const tooLate = advance(fill(advance(worn, 6), 'owner'), 7);
    assert.equal(charge(tooLate), undefined);
    assert.equal(amount(tooLate, 'owner', reserve), 2);
});

test('a failed probe can reveal the screen to its observer without finding the concealed subject', () => {
    const raised = advance(opening(), 3);
    const sever = (engine, id, operator = 'watcher') => startEngineWorking(engine, {id,
        law: GU_WARD_BREAK_LAW, method: guWardBreakWorking(),
        bindings: {operator: ref('operator', operator), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner')}});
    const blind = advance(sever(raised, 'blind'), 4);
    assert.equal(blind.records.workings.blind.record.status, 'interrupted');
    assert.equal(amount(blind, 'watcher', counterFuel), 2);

    const investigated = advance(scan(raised, 'feel-resistance', 'spirit', 2), 4);
    assert.deepEqual(contacts(investigated, 'watcher'), []);
    assert.equal(investigated.world.holders.bystander.properties.gu_seen_ward, undefined);
    assert.equal(investigated.world.holders.watcher.properties.gu_seen_ward, 'gu-secret.owner');
    const pending = sever(investigated, 'known');
    const cut = advance(restore(pending), 5);
    assert.deepEqual(serializeEngineWorld(cut), serializeEngineWorld(advance(pending, 5)));
    assert.equal(amount(cut, 'watcher', counterFuel), 0);
    assert.equal(ordinarySense(cut).observed[0].target, 'owner');

    const rebuilt = advance(cut, 8);
    const rearmed = applyEngineOps(rebuilt, [{op: 'set', holder: 'watcher', quantity: counterFuel, amount: 2}], 'fixture:refill');
    const stale = advance(sever(rearmed, 'stale'), 9);
    assert.equal(stale.records.workings.stale.landed[0].status, 'idle');
    assert.equal(amount(stale, 'watcher', counterFuel), 0);
    assert.equal(ordinarySense(stale).skipped[0].reason, 'concealed');
});

test('a paid report passes the exact ward address to a separate counter caster', () => {
    const investigated = advance(scan(advance(opening(), 3), 'feel-resistance', 'spirit', 2), 4);
    const supplied = applyEngineOps(investigated, ['gu_keeper', 'gu_controller'].map(property => ({
        op: 'property', holder: 'cutter', property, value: 'bystander',
    })), 'fixture:separate-caster');
    const pending = startEngineWorking(supplied, {id: 'report', law: GU_WARD_BREAK_LAW, method: guWardReportWorking,
        bindings: {observer: ref('operator', 'watcher'), recipient: ref('operator', 'bystander'), target: ref('creature', 'owner')}});
    const separated = applyEngineOps(pending, [{op: 'move', holder: 'bystander', to: 'outside'}], 'fixture:listener-left');
    const failed = advance(restore(separated), 5);
    assert.equal(failed.records.workings.report.record.status, 'interrupted');
    assert.equal(amount(failed, 'watcher', attention), 18);
    assert.equal(failed.world.holders.bystander.properties.gu_seen_ward, undefined);
    const told = advance(restore(pending), 5);
    assert.deepEqual(serializeEngineWorld(told), serializeEngineWorld(advance(pending, 5)));
    assert.equal(amount(told, 'watcher', attention), 17);
    assert.equal(told.world.holders.bystander.properties.gu_seen_ward, 'gu-secret.owner');
    assert.deepEqual(contacts(told, 'bystander'), []);
    const sever = (engine, id) => startEngineWorking(engine, {id, law: GU_WARD_BREAK_LAW, method: guWardBreakWorking(),
        bindings: {operator: ref('operator', 'bystander'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner')}});
    const cut = advance(restore(sever(told, 'reported-cut')), 6);
    assert.equal(amount(cut, 'bystander', counterFuel), 0);
    assert.equal(ordinarySense(cut).observed[0].target, 'owner');
    const rearmed = applyEngineOps(advance(cut, 9), [{op: 'set', holder: 'bystander', quantity: counterFuel, amount: 2}], 'fixture:refill');
    const stale = advance(sever(rearmed, 'stale-report'), 10);
    assert.equal(stale.records.workings['stale-report'].landed[0].status, 'idle');
    assert.equal(amount(stale, 'bystander', counterFuel), 0);
    assert.equal(ordinarySense(stale).skipped[0].reason, 'concealed');
});

test('a new observation preserves an older subject’s note and a report can select it after restore', () => {
    const initial = applyEngineOps(advance(opening(), 3), [
        {op: 'holder_add', value: {id: 'second:owner', kind: 'body', as: ['creature'], place: 'hall',
            properties: {gu_secret_active: true}, quantities: {[layer]: 6}}},
        {op: 'law_add', field: {id: 'gu-secret.second:owner', kind: 'conceal', scope: 'second:owner', params: {channel: 'spirit'}}},
        {op: 'property', holder: 'watcher', property: 'gu_seen_ward', value: 'gu-secret.owner'},
        {op: 'property', holder: 'watcher', property: 'gu_seen_ward_subject', value: 'owner'},
        ...['gu_keeper', 'gu_controller'].map(property => ({op: 'property', holder: 'cutter', property, value: 'bystander'})),
    ], 'fixture:two-screens');
    const probed = advance(restore(scan(initial, 'second-probe', 'spirit', 2, 'watcher', 'second:owner')), 4);
    assert.deepEqual(probed.world.holders.watcher.properties.gu_ward_notes,
        ['owner/gu-secret.owner', 'second:owner/gu-secret.second:owner']);
    const report = startEngineWorking(probed, {id: 'report-first', law: GU_WARD_BREAK_LAW, method: guWardReportWorking,
        bindings: {observer: ref('operator', 'watcher'), recipient: ref('operator', 'bystander'), target: ref('creature', 'owner')}});
    const told = advance(restore(report), 5);
    assert.equal(amount(told, 'watcher', attention), 17);
    const pending = startEngineWorking(told, {id: 'cut-first', law: GU_WARD_BREAK_LAW, method: guWardBreakWorking(),
        bindings: {operator: ref('operator', 'bystander'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner')}});
    const cut = advance(restore(pending), 6);
    assert.deepEqual(serializeEngineWorld(cut), serializeEngineWorld(advance(pending, 6)));
    assert.equal(amount(cut, 'bystander', counterFuel), 0);
    assert.equal(ordinarySense(cut).observed[0].target, 'owner');
    assert.ok(cut.world.laws.some(field => field.id === 'gu-secret.second:owner'));
});

test('a learned counter can select a named layer without cutting the other ward on that subject', () => {
    const outer = {id: 'sight-screen', kind: 'conceal', scope: 'owner', params: {channel: 'sight', wardLayer: 'sight'}};
    const raised = applyEngineOps(advance(opening(), 3), [{op: 'law_add', field: outer}], 'fixture:layered-ward');
    const spirit = advance(scan(raised, 'spirit-probe', 'spirit', 2), 4);
    const both = advance(restore(scan(spirit, 'sight-probe', 'sight', 1)), 5);
    assert.deepEqual(both.world.holders.watcher.properties.gu_ward_notes, ['owner/gu-secret.owner', 'owner/sight/sight-screen']);
    assert.deepEqual(contacts(both, 'watcher'), []);
    const report = startEngineWorking(both, {id: 'report-sight', law: GU_WARD_BREAK_LAW, method: guWardLayerReportWorking('sight'),
        bindings: {observer: ref('operator', 'watcher'), recipient: ref('operator', 'bystander'), target: ref('creature', 'owner')}});
    const told = advance(restore(report), 6);
    assert.deepEqual(told.world.holders.bystander.properties.gu_ward_notes, ['owner/sight/sight-screen']);
    const cut = (engine, id, layer) => startEngineWorking(engine, {id, law: GU_WARD_BREAK_LAW,
        method: guWardBreakWorking(undefined, {layer}), bindings: {
            operator: ref('operator', 'watcher'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner'),
        }});
    const unknown = advance(cut(told, 'unknown-layer', 'sound'), 7);
    assert.equal(unknown.records.workings['unknown-layer'].record.status, 'interrupted');
    assert.equal(amount(unknown, 'watcher', counterFuel), 2);
    const pending = cut(unknown, 'cut-sight', 'sight');
    const severed = advance(restore(pending), 8);
    assert.deepEqual(serializeEngineWorld(severed), serializeEngineWorld(advance(pending, 8)));
    assert.equal(amount(severed, 'watcher', counterFuel), 0);
    assert.equal(severed.world.laws.some(field => field.id === outer.id), false);
    assert.equal(ordinarySense(severed).skipped[0].reason, 'concealed');
    const sight = advance(scan(severed, 'look-through', 'sight', 1), 9);
    assert.deepEqual(contacts(sight, 'watcher'), ['hall:sight']);
});

test('a spirit probe reads the exposed ward of a stack and a paid cut reveals the next layer', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        ...[['z-outer', 'outer', 2], ['a-inner', 'inner', 1]].map(([id, wardLayer, wardOrder]) => ({op: 'law_add',
            field: {id, scope: 'owner', kind: 'conceal', params: {channel: 'spirit', wardLayer, wardOrder}}})),
        {op: 'set', holder: 'watcher', quantity: counterFuel, amount: 6},
    ], 'fixture:stacked-spirit-wards');
    const cut = (engine, id, layer) => startEngineWorking(engine, {id, law: GU_WARD_BREAK_LAW,
        method: guWardBreakWorking(undefined, {layer}), bindings: {
            operator: ref('operator', 'watcher'), specimen: ref('gu', 'cutter'), target: ref('creature', 'owner'),
        }});
    const probed = advance(scan(raised, 'first-probe', 'spirit', 2), 4);
    assert.deepEqual(probed.world.holders.watcher.properties.gu_ward_notes, ['owner/outer/z-outer']);
    const refused = advance(cut(probed, 'hidden-inner', 'inner'), 5);
    assert.equal(refused.records.workings['hidden-inner'].record.status, 'interrupted');
    assert.equal(amount(refused, 'watcher', counterFuel), 6);
    const outer = cut(refused, 'cut-outer', 'outer');
    const exposed = advance(restore(outer), 6);
    assert.deepEqual(serializeEngineWorld(exposed), serializeEngineWorld(advance(outer, 6)));
    assert.equal(ordinarySense(exposed).skipped[0].reason, 'concealed');
    assert.equal(amount(exposed, 'owner', layer), 6);

    const noted = advance(scan(exposed, 'second-probe', 'spirit', 2), 7);
    assert.deepEqual(noted.world.holders.watcher.properties.gu_ward_notes, ['owner/inner/a-inner', 'owner/outer/z-outer']);
    const coreExposed = advance(cut(noted, 'cut-inner', 'inner'), 8);
    assert.equal(ordinarySense(coreExposed).skipped[0].reason, 'concealed');
    const coreNoted = advance(scan(coreExposed, 'core-probe', 'spirit', 2), 9);
    assert.deepEqual(contacts(coreNoted, 'watcher'), []);
    const open = advance(restore(cut(coreNoted, 'cut-core')), 10);
    assert.equal(ordinarySense(open).observed[0].target, 'owner');
    assert.equal(amount(open, 'watcher', counterFuel), 0);
    assert.equal(amount(open, 'watcher', attention), 14);
});

test('a probe loses force across transmissive wards and spends only its remaining force on the core', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        ...[['z-outer', 'outer', 2, 3], ['a-inner', 'inner', 1, 2]].map(([id, wardLayer, wardOrder, probeLoss]) => ({
            op: 'law_add', field: {id, scope: 'owner', kind: 'conceal', params: {channel: 'spirit', wardLayer, wardOrder, probeLoss}},
        })),
    ], 'fixture:transmissive-wards');
    const spent = advance(scan(raised, 'stopped', 'spirit', 5), 4);
    assert.equal(amount(spent, 'owner', layer), 6);
    assert.equal(amount(spent, 'watcher', attention), 15);
    assert.deepEqual(spent.world.holders.watcher.properties.gu_ward_notes, ['owner/inner/a-inner', 'owner/outer/z-outer']);
    assert.deepEqual(contacts(spent, 'watcher'), []);

    const pending = scan(raised, 'through-both', 'spirit', 8);
    const through = advance(restore(pending), 4);
    assert.deepEqual(serializeEngineWorld(through), serializeEngineWorld(advance(pending, 4)));
    assert.equal(amount(through, 'owner', layer), 3);
    assert.equal(amount(through, 'watcher', attention), 12);
    assert.deepEqual(through.world.holders.watcher.properties.gu_ward_notes,
        ['owner/gu-secret.owner', 'owner/inner/a-inner', 'owner/outer/z-outer']);
    assert.deepEqual(contacts(through, 'watcher'), []);
    assert.equal(ordinarySense(through).skipped[0].reason, 'concealed');
    const penetrating = advance(scan(raised, 'through-core', 'spirit', 12), 4);
    assert.deepEqual(contacts(penetrating, 'watcher'), ['hall:spirit']);
    assert.deepEqual(contacts(penetrating, 'bystander'), []);
    assert.ok(penetrating.world.laws.some(field => field.id === 'z-outer'));
    assert.equal(ordinarySense(penetrating).skipped[0].reason, 'concealed');
});

test('a paid keeper adjustment changes which ward an already pending probe reaches first', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        {op: 'property', holder: 'owner', property: 'alive', value: true},
        {op: 'carry', holder: 'owner', quantity: attention, amount: 2},
        ...[['z-outer', 'outer', 2], ['a-inner', 'inner', 1]].map(([id, wardLayer, wardOrder]) => ({op: 'law_add',
            field: {id, scope: 'owner', kind: 'conceal', params: {channel: 'spirit', wardLayer, wardOrder, wardKeeper: 'owner'}}})),
    ], 'fixture:adjustable-wards');
    const adjust = (engine, keeper) => startEngineWorking(engine, {id: 'adjust', law: GU_SECRET_LAW,
        method: guSecretWorking('reorder', {first: 'z-outer', second: 'a-inner'}),
        bindings: {keeper: ref('operator', keeper), subject: ref('creature', 'owner')}});
    const probe = scan(raised, 'probe', 'spirit', 2);
    const unauthorized = advance(adjust(probe, 'bystander'), 4);
    assert.equal(amount(unauthorized, 'bystander', attention), 20);
    assert.equal(unauthorized.world.chain.some(row => row.kind === 'gu.secret.reordered'), false);
    assert.deepEqual(unauthorized.world.holders.watcher.properties.gu_ward_notes, ['owner/outer/z-outer']);

    const pending = adjust(probe, 'owner');
    const adjusted = advance(restore(pending), 4);
    assert.deepEqual(serializeEngineWorld(adjusted), serializeEngineWorld(advance(pending, 4)));
    assert.equal(amount(adjusted, 'owner', attention), 1);
    assert.equal(amount(adjusted, 'watcher', attention), 18);
    assert.deepEqual(adjusted.world.holders.watcher.properties.gu_ward_notes, ['owner/inner/a-inner']);
    assert.equal(ordinarySense(adjusted).skipped[0].reason, 'concealed');
});

test('live sightline entries change which ward a paid spirit probe reaches', () => {
    const raised = applyEngineOps(advance(opening(), 3), [
        {op: 'holder_add', value: {id: 'balcony', kind: 'place'}},
        {op: 'move', holder: 'watcher', to: 'outside'},
        {op: 'move', holder: 'bystander', to: 'balcony'},
        {op: 'link_add', link: {id: 'west', from: 'outside', to: 'hall', kind: 'sightline', cost: 1}},
        {op: 'link_add', link: {id: 'east', from: 'balcony', to: 'hall', kind: 'sightline', cost: 1}},
        {op: 'link_add', link: {id: 'detour', from: 'outside', to: 'balcony', kind: 'sightline', cost: 1, oneWay: true}},
        ...[['west-screen', 'west', {west: 2, east: 1}], ['east-screen', 'east', {west: 1, east: 2}]]
            .map(([id, wardLayer, wardApproaches]) => ({op: 'law_add', field: {id, kind: 'conceal', scope: 'owner',
                params: {channel: 'spirit', wardLayer, wardApproaches, probeLoss: 2}}})),
    ], 'fixture:probe-entries');
    const send = (engine, id, observer, force = 3, route) => startEngineWorking(engine, {id, law: GU_SECRET_LAW,
        method: guSecretWorking('probe', {channel: 'spirit', force, throughSightlines: true, ...(route && {route})}),
        bindings: {observer: ref('operator', observer), subject: ref('creature', 'owner')}});
    const pending = send(send(raised, 'west-probe', 'watcher'), 'east-probe', 'bystander');
    const closed = applyEngineOps(pending, [{op: 'link_set', id: 'west', state: 'closed'},
        {op: 'link_set', id: 'detour', state: 'closed'}], 'fixture:closed-sightline');
    const blocked = advance(restore(closed), 4);
    assert.equal(amount(blocked, 'watcher', attention), 17);
    assert.equal(blocked.world.holders.watcher.properties.gu_ward_notes, undefined);
    const read = advance(restore(pending), 4);
    assert.deepEqual(serializeEngineWorld(read), serializeEngineWorld(advance(pending, 4)));
    assert.deepEqual(read.world.holders.watcher.properties.gu_ward_notes, ['owner/west/west-screen']);
    assert.deepEqual(read.world.holders.bystander.properties.gu_ward_notes, ['owner/east/east-screen']);
    assert.equal(amount(read, 'owner', layer), 6);
    const through = advance(send(read, 'deep-west', 'watcher', 8), 5);
    assert.equal(amount(through, 'owner', layer), 3);
    assert.deepEqual(through.world.holders.watcher.properties.gu_ward_notes,
        ['owner/east/east-screen', 'owner/gu-secret.owner', 'owner/west/west-screen']);

    const chosen = send(raised, 'chosen-east', 'watcher', 3, ['detour', 'east']);
    const east = advance(restore(chosen), 4);
    assert.deepEqual(serializeEngineWorld(east), serializeEngineWorld(advance(chosen, 4)));
    assert.deepEqual(east.world.holders.watcher.properties.gu_ward_notes, ['owner/east/east-screen']);
    assert.equal(amount(east, 'watcher', attention), 17);
    const severed = applyEngineOps(chosen, [{op: 'link_set', id: 'detour', state: 'closed'}], 'fixture:closed-detour');
    const noFallback = advance(restore(severed), 4);
    assert.equal(amount(noFallback, 'watcher', attention), 17);
    assert.equal(noFallback.world.holders.watcher.properties.gu_ward_notes, undefined);
    const tooWeak = advance(send(raised, 'short-east', 'watcher', 2, ['detour', 'east']), 4);
    assert.equal(tooWeak.world.holders.watcher.properties.gu_ward_notes, undefined);
});
