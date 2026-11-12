// PC98, PC32c, KW22-KW26, KW35-KW39: engine fixtures, proposal data.
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import * as B from '../src/binding.js';
import {beginWorking, defineWorkingLaw, settleWorking} from '../src/kernel_working.js';
import {dueOathBreaches} from '../src/kernel_oath.js';
import {addIdentity, changeFacets, createIdentities, identityReader} from '../src/kernel_identity.js';
import {acquireCreature, practiceWithCreature, restoreCreatureLifecycle, settleCohortStock, transferCreature} from '../src/creature_lifecycle.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {readQuantity} from '../src/world_substrate.js';
import {range, reader} from './kernel_contract_suite.mjs';

const F = {madeAt: 0, period: 10, gain: 2, loss: 3, standing: {start: 5, max: 9, strainAt: 4, lapseAt: 0, breachLoss: 2},
    end: 60, midway: 20, minutes: 1, harm: -6, num: 1, den: 2, health: 30, maxHealth: 100,
    fee: 3, buyout: 7, forced: 11, breakPrice: 13, practiceGap: 2, bondGain: 1, capacity: 3};
const cost = amount => [{kind: 'coin', amount}];
const price = (cause, amount, effects = []) => ({costs: cost(amount), effects, cause});
const base = (id, a = 'keeper', b = 'passenger', extra = {}) => B.defineBinding({id, sides: {a, b}, madeAt: F.madeAt,
    terms: [], upkeep: [], standing: F.standing, channel: {}, onDeath: {}, exits: [], ...extra});
const upkeep = (a = 'keeper', b = 'passenger') => [{id: 'meal', owes: 'a', every: F.period, gain: F.gain, loss: F.loss,
    match: {method: 'feed', roles: {actor: a, target: b}}}];
const exit = (id, kind, by, amount, extra = {}) => ({id, kind, by, consent: [], ...price(id, amount), ...extra});
const state = (b, now, receipts = [], log = []) => B.bindingState(b, {now, receipts, log});
const actionLaw = defineWorkingLaw({id: 'test.binding', revision: 1, operations: Object.fromEntries(['feed', 'tell', 'relay', 'wield', 'watch'].map(op =>
    [op, {roles: {actor: 'actor', target: 'thing'}, minutes: F.minutes,
        settle: ({bound}) => ({ok: true, effects: [{kind: op, target: bound.target.id}], ...(op === 'relay' ? {costs: cost(F.fee)} : {})})}]))});
function act(op, actor, target, at, authority) {
    const roles = {actor: 'actor', target: 'thing'}, bindings = {actor: {kind: 'actor', id: actor}, target: {kind: 'thing', id: target}};
    const method = {id: op, revision: 1, law: actionLaw.ref, roles, steps: [{op, bindings: {actor: 'actor', target: 'target'}}]};
    const result = settleWorking(actionLaw, beginWorking(actionLaw, method, {id: `${op}.${actor}.${at}`, at: at - F.minutes, bindings}),
        {now: at, ports: {read: reader(Object.fromEntries(Object.values(bindings).map(r => [r.id, r]))), ...(authority ? {authority} : {})}});
    return {...result, receipts: result.record.receipts.map(r => ({...r, method: method.id, bindings}))};
}
// The host persists publication IDs beside its own receipts. Bindings save no status.
function proof(b, receipts = [], log = [], end = F.end) {
    const run = (times, reload) => {
        let current = b, records = log, published = [];
        for (const now of times) {
            if (reload && now === F.midway) {
                const past = records.filter(r => r.at <= now), future = records.filter(r => r.at > now);
                const saved = B.restoreBindings(JSON.parse(JSON.stringify(B.serializeBindings({bindings: [current], log: past}))));
                [current] = saved.bindings; records = [...saved.log, ...future];
            }
            published.push(...B.dueBindingEvents(current, {now, receipts, log: records, published}));
        }
        return {state: state(current, end, receipts, records), events: published};
    };
    const jump = run([end], false);
    for (const cuts of [range(0, end), [...range(0, end, 7), end].sort((a, b) => a - b)]) assert.deepEqual(run(cuts, false), jump);
    assert.deepEqual(run(range(0, end), true), jump);
    assert.deepEqual(B.dueBindingEvents(b, {now: end, receipts, log, published: jump.events}), []);
    return jump;
}
const worldConfig = {packs: ['c.contest'], shared: {quantities: [{id: 'health', unit: 'point', min: 0, max: F.maxHealth}]}};
function engine(a, b) {
    return createEngineWorld({...worldConfig, holders: [
        {id: 'den', kind: 'place'}, ...[a, b].map(id => ({id, kind: 'body', place: 'den', quantities: {health: F.health}})),
    ]});
}
const land = (world, effects) => applyEngineOps(world, effects.map(e => ({op: 'add', holder: e.target, quantity: 'health', amount: e.amount})), 'fixture-binding');
const channel = {senses: {a: ['health'], b: ['health']}, shares: [{id: 'pain', what: 'harm', from: 'a', to: 'b', num: F.num, den: F.den}]};
const readBody = w => (ref, at) => w.world.holders[ref] ? {health: readQuantity(w.world, ref, 'health')} : null;
// Replay host harm and due aftermath on the world clock, including a joint mid-run save.
function engineProof(b, receipts, log) {
    const run = (cuts, reload = false) => {
        let current = b, records = log, w = engine(b.sides.a, b.sides.b), published = [], harmed = false;
        for (const now of cuts) {
            const pending = B.dueBindingEvents(current, {now, receipts, log: records, published});
            if (!harmed && now >= 15) {
                const harm = {kind: 'harm', target: b.sides.a, amount: F.harm};
                pending.push({id: 'fixture-harm', at: 15, effects: [harm, ...B.sharedEffects(current, state(current, 15, receipts, records), harm)]});
                harmed = true;
            }
            pending.sort((a, z) => a.at - z.at || a.id.localeCompare(z.id));
            for (const row of pending) {
                w = advanceEngineWorld(w, row.at).engine;
                if (row.effects?.length) w = land(w, row.effects);
                if (row.id !== 'fixture-harm') published.push(row);
            }
            w = advanceEngineWorld(w, now).engine;
            if (reload && now === F.midway) {
                const saved = JSON.parse(JSON.stringify({world: serializeEngineWorld(w),
                    binding: B.serializeBindings({bindings: [current], log: records.filter(r => r.at <= now)}), published}));
                w = restoreEngineWorld(saved.world, worldConfig);
                const restored = B.restoreBindings(saved.binding);
                [current] = restored.bindings;
                records = [...restored.log, ...log.filter(r => r.at > now)]; published = saved.published;
            }
        }
        return {world: serializeEngineWorld(w), state: state(current, F.end, receipts, records), events: published};
    };
    const jump = run([F.end]);
    assert.deepEqual(run(range(0, F.end)), jump);
    assert.deepEqual(run([...range(0, F.end, 7), F.end]), jump);
    assert.deepEqual(run(range(0, F.end), true), jump);
    return jump;
}
let animalKeys;

test('tamed ewe: real feeding and practice, strain, independent leaving, and fed alternative', () => {
    const field = {id: 'field', capacity: F.capacity, supportedSpecies: ['sheep']};
    let life = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'flock', species: 'sheep', habitat: field, delta: 1});
    const acquired = acquireCreature(life, {revision: life.revision, cohortId: 'flock', destination: field, keeper: 'keeper'});
    life = practiceWithCreature(acquired.state, {revision: acquired.state.revision, id: acquired.id, actor: 'keeper',
        clock: F.practiceGap, minimumGap: F.practiceGap, bondGain: F.bondGain, skill: 'follow'});
    assert.equal(life.individuals[acquired.id].experience.keeper.training.follow, 1);
    const b = base('animal', 'keeper', acquired.id, {upkeep: upkeep('keeper', acquired.id)});
    animalKeys = Object.keys(b).sort();
    const meals = [act('feed', 'keeper', acquired.id, 5)].flatMap(r => r.receipts);
    assert.equal(state(b, 10, meals).standing, 7);
    const strained = state(b, 20, meals);
    assert.deepEqual([strained.status, strained.standing, B.boundSideOptions(b, strained, 'b').leaning], ['strained', 4, 'bargain']);
    assert.equal(B.boundSideOptions(b, strained, 'b', {pressed: true}).leaning, 'resist');
    const done = proof(b, meals);
    assert.deepEqual([done.state.status, done.state.standing, done.state.since], ['lapsed', 0, 40]);
    assert.equal(B.boundSideOptions(b, done.state, 'b').leaning, 'leave');
    const leaving = done.events.find(r => r.kind === 'lapsed');
    assert.equal(leaving.by, acquired.id);
    life = transferCreature(life, {revision: life.revision, id: leaving.by, fromKeeper: 'keeper', toKeeper: null, destination: field, clock: leaving.at});
    assert.equal(life.individuals[acquired.id].keeper, null);
    assert.equal(done.events.filter(r => r.kind === 'upkeep-missed').length, 3);
    assert.equal(B.bindingOaths(b, {until: F.end, receipts: meals}).length, 4);
    const boundaryMeal = act('feed', 'keeper', acquired.id, F.period).receipts;
    assert.equal(state(b, 2 * F.period, boundaryMeal).standing, 4);
    const fed = range(5, 55, F.period).flatMap(at => act('feed', 'keeper', acquired.id, at).receipts);
    assert.deepEqual([proof(b, fed).state.status, state(b, F.end, fed).standing], ['held', F.standing.max]);
    // Without a lapse dial, zero standing can recover; no hidden threshold.
    const recoverable = base('recoverable', 'keeper', acquired.id, {upkeep: upkeep('keeper', acquired.id), standing: {...F.standing, lapseAt: undefined}});
    assert.equal(state(recoverable, 20).status, 'strained');
    assert.equal(state(recoverable, 30, act('feed', 'keeper', acquired.id, 25).receipts).standing, F.gain);
});

test('familiar: engine quantities, sensing, shared harm, and one death aftermath across reload', () => {
    let w = engine('mage', 'familiar');
    const b = base('familiar-bond', 'mage', 'familiar', {channel, onDeath: {a: {effects: [{kind: 'harm', target: 'familiar', amount: F.harm}], cause: 'severed'}}});
    assert.deepEqual(B.senseThrough(b, state(b, 0), 'b', readBody(w), 0), {health: F.health});
    assert.equal(B.senseThrough(b, state(b, 0), 'b', () => null, 0), null);
    const harm = {kind: 'harm', target: 'mage', amount: F.harm};
    const shared = B.sharedEffects(b, state(b, 1), harm);
    assert.deepEqual(shared, [{...harm, target: 'familiar', amount: -3, cause: 'binding-share', binding: b.id}]);
    w = land(w, [harm, ...shared]);
    w = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(w))), worldConfig);
    assert.equal(readQuantity(w.world, 'familiar', 'health'), 27);
    const log = [{id: 'mage-death', binding: b.id, kind: 'death', side: 'a', at: 30}];
    const done = proof(b, [], log);
    assert.deepEqual([done.state.status, done.state.since], ['ended', 30]);
    assert.equal(done.events.length, 1);
    assert.deepEqual(engineProof(b, [], log).events, done.events);
    w = land(w, done.events[0].effects);
    assert.equal(readQuantity(w.world, 'familiar', 'health'), 21);
    assert.equal(B.senseThrough(b, done.state, 'b', readBody(w), 60), null);
    assert.deepEqual(B.sharedEffects(b, done.state, harm), []);
    const successor = base('inherited', 'mage', 'familiar', {onDeath: {a: {effects: [], cause: 'inherit', passesTo: 'heir'}}});
    const inherited = proof(successor, [], [{...log[0], binding: successor.id}]);
    assert.equal(inherited.state.sides.a, 'heir');
    assert.equal(inherited.state.status, 'held');
    assert.equal(inherited.events[0].kind, 'transfer');
});

test('contract: a priced breach, another route, buyout, and a transferred deadline', () => {
    const penalty = price('contract-price', F.fee, [{kind: 'debt', target: 'alice'}]);
    const b = base('contract', 'alice', 'bob', {terms: [
        {id: 'secret', owes: 'a', kind: 'forbid', match: {method: 'tell', roles: {actor: 'alice'}}, penalty},
        {id: 'duty', owes: 'a', kind: 'require', match: {method: 'watch', roles: {actor: 'alice'}}, by: 50},
    ], exits: [exit('buy', 'buyout', 'a', F.buyout, {consent: ['b']}), exit('assign', 'transfer', 'a', F.fee, {to: 'carol'})]});
    const broken = act('tell', 'alice', 'secret', 10, B.bindingAuthority([b]));
    assert.equal(broken.record.status, 'complete');
    assert.deepEqual(broken.receipts[0].truth.costs, cost(F.fee));
    assert.deepEqual(broken.receipts[0].truth.effects.at(-1), penalty.effects[0]);
    assert.equal(broken.receipts[0].truth.breach.vower, 'alice');
    proof(b, broken.receipts);
    const again = act('tell', 'alice', 'secret', 20, B.bindingAuthority([b], {receipts: broken.receipts}));
    assert.equal(again.receipts[0].truth.breach, undefined);
    const relay = act('relay', 'broker', 'secret', 10, B.bindingAuthority([b]));
    assert.deepEqual(relay.receipts[0].truth.costs, cost(F.fee));
    assert.equal(relay.receipts[0].truth.breach, undefined);
    assert.equal(relay.record.status, 'complete');
    assert.deepEqual(B.takeExit(b, state(b, 20), {exit: 'buy', by: 'alice', at: 20}).missing, ['b']);
    const buy = B.takeExit(b, state(b, 20), {exit: 'buy', by: 'alice', at: 20, consents: ['bob']});
    assert.deepEqual(buy.costs, cost(F.buyout));
    assert.equal(act('tell', 'alice', 'secret', 30, B.bindingAuthority([b], {log: [buy.event]})).receipts[0].truth.breach, undefined);
    assert.equal(proof(b, [], [buy.event]).state.status, 'ended');
    const assigned = B.takeExit(b, state(b, 20), {exit: 'assign', by: 'alice', at: 20});
    assert.deepEqual(assigned.costs, cost(F.fee));
    assert.equal(B.bindingSides(b, [assigned.event], 19).a, 'alice');
    assert.equal(B.bindingSides(b, [assigned.event], 20).a, 'carol');
    const due = dueOathBreaches(B.bindingOaths(b, {log: [assigned.event], until: 60}), {now: 60, receipts: []});
    assert.deepEqual(due.map(r => r.vower), ['carol']);
    const assignedProof = proof(b, [], [assigned.event]);
    assert.equal(assignedProof.events.find(r => r.kind === 'duty-missed').vower, 'carol');
    const paidDuty = act('watch', 'carol', 'ward', 40).receipts;
    assert.equal(proof(b, paidDuty, [assigned.event]).events.length, 0);
    const duties = base('duties', 'alice', 'bob', {terms: [20, 40].map(by => ({id: `duty${by}`, owes: 'a', kind: 'require',
        by, match: {method: 'watch', roles: {actor: 'alice', target: `ward${by}`}}}))});
    const fulfilled = [20, 40].flatMap(at => act('watch', 'alice', `ward${at}`, at).receipts);
    assert.equal(proof(duties, fulfilled).events.length, 0);
    assert.equal(proof(duties, fulfilled.slice(1)).events[0].at, 20);
    const absolute = base('absolute', 'alice', 'bob', {standing: {...F.standing, breachLoss: 'all'}, terms: [b.terms[0]]});
    const first = act('tell', 'alice', 'secret', 10, B.bindingAuthority([absolute], {inner: () => ({ok: true, costs: cost(F.buyout)})}));
    assert.deepEqual(first.receipts[0].truth.costs, [...cost(F.buyout), ...cost(F.fee)]);
    assert.equal(proof(absolute, first.receipts).state.status, 'broken');
    const unchanged = base('unchanged', 'alice', 'bob', {terms: [
        {id: 'later-duty', owes: 'b', kind: 'require', by: 50, match: {method: 'watch', roles: {actor: 'bob'}}},
        {id: 'silence', owes: 'b', kind: 'forbid', match: {method: 'tell', roles: {actor: 'bob'}}},
    ], exits: [exit('assign', 'transfer', 'a', F.fee, {to: 'carol'})]});
    const speech = act('tell', 'bob', 'secret', 10, B.bindingAuthority([unchanged]));
    const handover = B.takeExit(unchanged, state(unchanged, 20, speech.receipts), {exit: 'assign', by: 'alice', at: 20});
    const after = act('tell', 'bob', 'secret', 30, B.bindingAuthority([unchanged], {log: [handover.event], receipts: speech.receipts}));
    assert.equal(after.receipts[0].truth.breach, undefined);
    assert.equal(proof(unchanged, speech.receipts, [handover.event]).state.standing, 3);
    const unrelated = base('unrelated', 'alice', 'bob');
    const layered = act('tell', 'alice', 'secret', 10, B.bindingAuthority([b, unrelated]));
    assert.deepEqual(layered.receipts[0].truth.costs, cost(F.fee));
    const expires = base('short', 'alice', 'bob', {endsAt: 25, upkeep: upkeep('alice', 'bob'), standing: {...F.standing, lapseAt: undefined}});
    assert.equal(proof(expires).events.at(-1).kind, 'expired');
    assert.equal(B.bindingOaths(expires, {until: 60}).length, 2);
});

test('sworn sword: custody is separate, thief pays, holder benefits, forced transfer and break cost', () => {
    const reg = addIdentity(createIdentities(), {id: 'sword', at: 0, cause: 'forged', facets: {item: {owner: 'inventory', key: 'blade'}}});
    let custody = 'alice';
    const read = identityReader(reg, {inventory: () => ({holder: custody, count: 1})});
    const b = base('item-bond', 'sword', 'alice', {channel: {answers: [{id: 'answer', match: {method: 'wield', roles: {target: 'sword'}},
        role: 'actor', to: 'b', bonus: [{kind: 'strength', target: 'sword'}], otherwise: {...price('unwelcome', F.fee), enforce: 'penalize'}}]},
    exits: [exit('force', 'transfer', 'thief', F.forced, {side: 'b', to: 'thief'}), exit('break', 'break', 'b', F.breakPrice)]});
    custody = 'thief';
    assert.equal(read({kind: 'item', id: 'sword'}, 10).holder, 'thief');
    assert.equal(state(b, 10).sides.b, 'alice');
    const thief = act('wield', 'thief', 'sword', 10, B.bindingAuthority([b]));
    assert.equal(thief.record.status, 'complete');
    assert.deepEqual(thief.receipts[0].truth.costs, cost(F.fee));
    const holder = act('wield', 'alice', 'sword', 10, B.bindingAuthority([b]));
    assert.equal(holder.receipts[0].truth.effects.at(-1).kind, 'strength');
    const forced = B.takeExit(b, state(b, 20), {exit: 'force', by: 'thief', at: 20});
    assert.deepEqual(forced.costs, cost(F.forced));
    assert.equal(state(b, 20, [], [forced.event]).sides.b, 'thief');
    assert.equal(proof(b, thief.receipts, [forced.event]).state.sides.b, 'thief');
    const rebond = act('wield', 'thief', 'sword', 25, B.bindingAuthority([b], {log: [forced.event]}));
    assert.equal(rebond.receipts[0].truth.effects.at(-1).kind, 'strength');
    const broken = B.takeExit(b, state(b, 30, [], [forced.event]), {exit: 'break', by: 'thief', at: 30});
    assert.deepEqual(broken.costs, cost(F.breakPrice));
    assert.equal(proof(b, thief.receipts, [forced.event, broken.event]).state.status, 'broken');
    assert.equal(act('wield', 'thief', 'sword', 40, B.bindingAuthority([b], {log: [forced.event, broken.event]})).receipts[0].truth.costs, undefined);
    const prevent = B.defineBinding({...b, id: 'stops', channel: {answers: [{...b.channel.answers[0], otherwise: {...b.channel.answers[0].otherwise, enforce: 'prevent'}}]}});
    assert.equal(act('wield', 'thief', 'sword', 10, B.bindingAuthority([prevent])).record.receipts[0].reason, 'binding-answers-another');
    assert.equal(B.takeExit(prevent, state(prevent, 10), {exit: 'break', by: 'alice', at: 10}).ok, true);
    const strict = base('strict', 'alice', 'bob', {enforce: 'prevent', terms: [{id: 'silence', owes: 'a', kind: 'forbid', match: {method: 'tell'}}],
        exits: [exit('break', 'break', 'a', F.breakPrice)]});
    assert.equal(act('tell', 'alice', 'secret', 10, B.bindingAuthority([strict])).record.status, 'interrupted');
    const escape = B.takeExit(strict, state(strict, 20), {exit: 'break', by: 'alice', at: 20});
    assert.equal(act('tell', 'alice', 'secret', 30, B.bindingAuthority([strict], {log: [escape.event]})).record.status, 'complete');
});

test('carried Gu: identity reads host, body feeds, senses, harm, death and priced removal', () => {
    const b = base('carried', 'body', 'gu', {upkeep: upkeep('body', 'gu'), channel,
        onDeath: {a: {effects: [{kind: 'harm', target: 'gu', amount: F.harm}], cause: 'host-died'}},
        exits: [exit('remove', 'remove', 'b', F.buyout)]});
    assert.deepEqual(Object.keys(b).sort(), animalKeys);
    let reg = addIdentity(createIdentities(), {id: 'gu', at: 0, cause: 'found', facets: {item: {owner: 'inventory', key: 'gu'}}});
    reg = changeFacets(reg, 'gu', {remove: ['item'], add: {carried: {owner: 'binding', key: b.id}}, at: 0, cause: 'entered-body'});
    const meals = range(5, 55, F.period).flatMap(at => act('feed', 'body', 'gu', at).receipts);
    const log = [{id: 'host-death', binding: b.id, kind: 'death', side: 'a', at: 35}];
    const read = identityReader(reg, {binding: B.carriedReader([b], {log, receipts: meals})});
    assert.equal(read({kind: 'carried', id: 'gu'}, 20).host, 'body');
    assert.equal(read({kind: 'carried', id: 'gu'}, 35), null);
    let w = engine('body', 'gu');
    assert.deepEqual(B.senseThrough(b, state(b, 20, meals), 'b', readBody(w), 20), {health: F.health});
    const harm = {kind: 'harm', target: 'body', amount: F.harm};
    w = land(w, [harm, ...B.sharedEffects(b, state(b, 20, meals), harm)]);
    w = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(w))), worldConfig);
    const done = proof(b, meals, log);
    assert.equal(done.state.status, 'ended');
    assert.equal(done.events.length, 1);
    assert.deepEqual(engineProof(b, meals, log).events, done.events);
    w = land(w, done.events[0].effects);
    assert.equal(readQuantity(w.world, 'gu', 'health'), 21);
    const removed = B.takeExit(b, state(b, 20, meals), {exit: 'remove', by: 'gu', at: 20});
    assert.deepEqual(removed.costs, cost(F.buyout));
    assert.equal(proof(b, meals, [removed.event]).state.status, 'ended');
    assert.equal(B.carriedReader([b], {log: [removed.event], receipts: meals})(b.id, 25), null);
});

test('shared law names no world, freezes data, validates malformed saves and has no em dash', () => {
    const source = readFileSync(new URL('../src/binding.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /gu|sheep|hogwarts|lotm|snape|sword|\u2014/i);
    const b = base('plain');
    assert.equal(Object.isFrozen(b.channel), true);
    assert.throws(() => {b.sides.a = 'changed';}, TypeError);
    assert.throws(() => B.defineBinding({...b, upkeep: [{...upkeep()[0], every: 0}]}), /upkeep/);
    assert.throws(() => B.defineBinding({...b, channel: {shares: [{id: 'x', what: 'harm', from: 'a', to: 'b', num: 1, den: 0}]}}), /share/);
    assert.throws(() => B.defineBinding({...b, status: 'held'}), /Unknown/);
    assert.equal(B.defineBinding({...b, schema: undefined}).schema, B.BINDING_SCHEMA);
    assert.throws(() => B.restoreBindings({schema: 'kernel.binding@99', bindings: [b], log: []}), /Unsupported/);
    assert.throws(() => B.restoreBindings({schema: B.BINDING_SCHEMA, bindings: [b], log: [{binding: b.id, at: -1, kind: 'death', side: 'a'}]}), /event/);
    assert.deepEqual(proof(b).events, []);
});
