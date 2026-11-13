import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {sentenceFromIntent} from '../src/spell_effects.js';
import {cancelSpellCast, spellEffectMethod} from '../src/spell_law.js';
import {advanceStudentExchange, callDisarmDrill, castAtDuellingClub, DUELLING_CLUB_CONFIG, startDuellingClub,
    stopStudentExchange, withdrawFromDisarmDrill} from '../src/world_packs/hp_duelling_club.js';

const save = serializeEngineWorld;
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(save(engine))), DUELLING_CLUB_CONFIG);
const advance = (engine, at) => {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
};
const settle = (engine, at) => {
    const uninterrupted = advance(engine, at);
    let restored = restore(engine);
    for (let time = engine.world.clock + 1; time <= at; time++) restored = restore(advance(restored, time));
    assert.deepEqual(save(restored), save(uninterrupted));
    return uninterrupted;
};
const disarm = engine => castAtDuellingClub(engine, {id: 'disarm', actor: 'snape', spellId: 'disarm', target: 'lockhart'});
const shield = (engine, minutes) => castAtDuellingClub(engine, {
    id: 'protego', actor: 'lockhart', spellId: 'shield', target: 'lockhart', minutes,
});
const reply = (engine, minutes) => castAtDuellingClub(engine, {
    id: 'reply', actor: 'lockhart', spellId: 'tickle', target: 'snape', minutes,
});
const holder = (engine, id) => engine.world.holders[id];
const entry = (engine, id) => engine.records.workings[id];

test('Lockhart can abandon his reply and raise a shield before Expelliarmus arrives', () => {
    const windingUp = restore(reply(disarm(startDuellingClub())));
    assert.throws(() => shield(windingUp), /finish the current wand movement/i);
    const stopped = cancelSpellCast(windingUp, {id: 'reply', actor: 'lockhart'});
    assert.equal(stopped.ok, true);
    const protectedTarget = settle(shield(restore(stopped.engine)), 3);
    assert.match(entry(protectedTarget, 'disarm').landed[0].reason, /intercepted by protego/);
    assert.equal(entry(protectedTarget, 'reply').record.status, 'interrupted');
    assert.equal(holder(protectedTarget, 'lockhart-wand').place, 'east-platform');
    assert.equal(holder(protectedTarget, 'lockhart').quantities.stamina, 8);
    assert.equal(holder(settle(windingUp, 3), 'lockhart-wand').place, 'far-floor');
});

test('Chapter 11 demonstration: Expelliarmus takes Lockhart’s wand on the shared engine clock', () => {
    const end = settle(disarm(startDuellingClub()), 3);
    assert.deepEqual(entry(end, 'disarm').landed, [{step: 0, at: 2, status: 'landed'}]);
    assert.equal(holder(end, 'lockhart-wand').place, 'far-floor');
    assert.deepEqual(holder(end, 'lockhart-wand').properties.marks, []);
    assert.equal(holder(end, 'lockhart').quantities.vitality, 20);
    assert.equal(holder(end, 'snape').quantities.stamina, 7);
});

test('a shield that finishes early keeps Lockhart’s wand and allows his reply', () => {
    const shielding = shield(disarm(startDuellingClub()));
    assert.throws(() => reply(shielding), /finish the current wand movement/i);
    const inFlight = reply(settle(shielding, 1), 2);
    const defended = settle(inFlight, 2);
    assert.match(entry(defended, 'disarm').landed[0].reason, /intercepted by protego/);
    assert.deepEqual(holder(defended, 'lockhart-wand').properties.marks, ['grip:lockhart']);
    assert.equal(holder(defended, 'snape').quantities.stamina, 7);
    const end = settle(restore(defended), 3);
    assert.equal(entry(end, 'reply').landed[0].status, 'published');
    assert.equal(holder(end, 'snape').properties.mind_laughing, true);
    assert.equal(holder(end, 'lockhart').quantities.stamina, 6);
    assert.equal(settle(end, 5).world.holders.snape.properties.mind_laughing, false);
});

test('a shield still winding up when the wand is lost cannot release, and neither can the reply', () => {
    const shieldFailed = settle(shield(disarm(startDuellingClub()), 3), 3);
    const end = settle(reply(shieldFailed, 1), 4);
    for (const id of ['protego', 'reply']) {
        const cast = entry(end, id);
        assert.equal(cast.record.status, 'interrupted');
        assert.match(cast.record.receipts[0].reason, /out of your hand/);
        assert.deepEqual(cast.landed, []);
    }
    assert.equal(holder(end, 'lockhart').quantities.stamina, 10);
    assert.equal(holder(end, 'snape').properties.mind_laughing, false);
});

test('a shield raised too early can expire before the incoming release', () => {
    const defended = settle(shield(startDuellingClub()), 1);
    assert.ok(defended.world.laws.some(field => field.id === 'protego'));
    const end = settle(reply(disarm(restore(defended))), 4);
    assert.equal(entry(end, 'disarm').landed[0].status, 'landed');
    assert.equal(entry(end, 'reply').record.status, 'interrupted');
    assert.equal(holder(end, 'lockhart').quantities.stamina, 8);
});

test('a fast reply can stop Snape from completing his spoken disarm', () => {
    const end = settle(reply(disarm(startDuellingClub()), 1), 3);
    assert.equal(entry(end, 'reply').landed[0].status, 'published');
    assert.equal(entry(end, 'disarm').record.status, 'interrupted');
    assert.match(entry(end, 'disarm').record.receipts[0].reason, /cannot get the words out/);
    assert.equal(holder(end, 'snape').quantities.stamina, 10);
    assert.equal(holder(end, 'lockhart-wand').place, 'east-platform');
});

test('the released charm misses when the route closes during the wind-up', () => {
    const windingUp = settle(disarm(startDuellingClub()), 1);
    const closed = applyEngineOps(windingUp, [{op: 'link_set', id: 'platform', state: 'closed'}], 'cover-crossed');
    const end = settle(closed, 3);
    assert.match(entry(end, 'disarm').landed[0].reason, /no clear path/);
    assert.equal(holder(end, 'snape').quantities.stamina, 7);
    assert.equal(holder(end, 'lockhart-wand').place, 'east-platform');
});

const students = () => startDuellingClub({students: true});
const studentCast = (engine, id, actor, spellId, target) =>
    castAtDuellingClub(engine, {id, actor, spellId, target, minutes: 1});
const idle = (engine, at) => {
    const out = advanceStudentExchange(engine, at);
    assert.equal(out.pending, false);
    return out.engine;
};

test('the same disarm ends the supervised drill when called and leaves a physical escape in the other drill', () => {
    const start = disarmDrill => startDuellingClub({students: true, disarmDrill});
    const cast = engine => castAtDuellingClub(engine, {id: 'drop', actor: 'harry', spellId: 'disarm', target: 'draco'});
    const practice = start('practice');
    assert.throws(() => callDisarmDrill(practice), /needs the fallen wand/);
    const dropped = mode => settle(cast(mode), 2);
    const practiceDrop = dropped(practice);
    const escapeDrop = dropped(start('escape'));
    assert.deepEqual(entry(practiceDrop, 'drop'), entry(escapeDrop, 'drop'));
    assert.deepEqual(holder(practiceDrop, 'draco-wand'), holder(escapeDrop, 'draco-wand'));
    assert.equal(holder(escapeDrop, 'draco-wand').place, 'far-floor');
    assert.equal(holder(escapeDrop, 'harry').quantities.stamina, 7);
    assert.throws(() => callDisarmDrill(escapeDrop), /needs the fallen wand/);

    const stopped = restore(callDisarmDrill(restore(practiceDrop)));
    assert.deepEqual(holder(stopped, 'draco-wand').properties.marks, ['grip:snape']);
    assert.throws(() => cast(stopped), /proctor has ended/);
    assert.throws(() => withdrawFromDisarmDrill(stopped), /proctor has ended/);
    assert.deepEqual(save(callDisarmDrill(stopped)), save(stopped));

    const attempted = studentCast(restore(escapeDrop), 'retaliate', 'draco', 'tickle', 'harry');
    const closed = applyEngineOps(attempted, [{op: 'link_set', id: 'exit', state: 'closed'}], 'exit-blocked');
    const stranded = settle(withdrawFromDisarmDrill(closed), 3);
    assert.equal(holder(stranded, 'draco').place, 'east-platform');
    assert.equal(entry(stranded, 'retaliate').record.status, 'interrupted');
    assert.equal(holder(stranded, 'draco').quantities.stamina, 10);

    const open = applyEngineOps(restore(stranded), [{op: 'link_set', id: 'exit', state: 'open'}], 'exit-cleared');
    const escaped = settle(open, 4);
    assert.equal(holder(escaped, 'draco').place, 'doorway');
    assert.equal(holder(escaped, 'draco').quantities.vitality, 20);
    assert.deepEqual(holder(escaped, 'draco-wand').properties.marks, []);
});

test('dancing holds a disarmed Draco at the open exit until his legs are free', () => {
    const start = startDuellingClub({students: true, disarmDrill: 'escape'});
    const dropped = settle(studentCast(start, 'drop', 'harry', 'disarm', 'draco'), 1);
    const dancing = settle(studentCast(dropped, 'dance', 'harry', 'dance', 'draco'), 2);
    const running = withdrawFromDisarmDrill(restore(dancing));
    const stalled = settle(running, 6);
    assert.equal(holder(stalled, 'draco').properties.mind_compelled_steps, true);
    assert.equal(holder(stalled, 'draco').place, 'east-platform');
    assert.equal(holder(stalled, 'harry').quantities.stamina, 5);
    const escaped = settle(restore(stalled), 7);
    assert.equal(holder(escaped, 'draco').place, 'doorway');
    assert.deepEqual(save(settle(running, 7)), save(escaped));
});

test('after releasing a charm Draco can shield an incoming spell before his own lands', () => {
    const dance = castAtDuellingClub(students(), {id: 'outbound', actor: 'draco', spellId: 'dance',
        target: 'harry', minutes: 1, flightMinutes: 4});
    const defend = engine => studentCast(engine, 'defend', 'draco', 'shield', 'draco');
    assert.throws(() => defend(restore(dance)), /finish the current wand movement/i);
    const launched = restore(settle(dance, 1));
    const threatened = castAtDuellingClub(launched, {id: 'inbound', actor: 'harry', spellId: 'tickle',
        target: 'draco', minutes: 1, flightMinutes: 1});
    const undefended = settle(threatened, 5);
    assert.equal(entry(undefended, 'inbound').landed[0].status, 'published');
    const defended = settle(defend(restore(threatened)), 5);
    assert.match(entry(defended, 'inbound').landed[0].reason, /intercepted by defend/);
    assert.equal(entry(defended, 'outbound').landed[0].status, 'published');
    assert.equal(holder(defended, 'harry').properties.mind_compelled_steps, true);
    assert.equal(holder(defended, 'draco').properties.mind_laughing, false);
    assert.equal(holder(defended, 'harry').quantities.stamina, 8);
    assert.equal(holder(defended, 'draco').quantities.stamina, 6);
});

test('the referee stops an obedient wind-up while a paid charm still lands after restore', () => {
    const start = startDuellingClub({students: true, disarmDrill: 'practice'});
    const flying = settle(castAtDuellingClub(start, {id: 'released', actor: 'draco', spellId: 'dance',
        target: 'harry', minutes: 1, flightMinutes: 3}), 1);
    const dropped = settle(studentCast(flying, 'drop', 'harry', 'disarm', 'draco'), 2);
    const replying = castAtDuellingClub(dropped, {id: 'wind-up', actor: 'harry', spellId: 'tickle',
        target: 'draco', minutes: 1});
    const proctorShield = castAtDuellingClub(replying, {id: 'proctor-shield', actor: 'snape', spellId: 'shield',
        target: 'snape'});
    assert.equal(entry(settle(proctorShield, 3), 'wind-up').landed[0].status, 'published');
    const stopped = callDisarmDrill(restore(proctorShield));
    assert.equal(entry(stopped, 'wind-up').record.status, 'interrupted');
    assert.equal(entry(stopped, 'released').record.status, 'running');
    assert.equal(entry(stopped, 'proctor-shield').record.status, 'running');
    assert.equal(holder(stopped, 'harry').quantities.stamina, 7);

    const impact = settle(stopped, 4);
    assert.deepEqual(save(idle(restore(stopped), 4)), save(impact));
    assert.equal(entry(impact, 'released').landed[0].status, 'published');
    assert.equal(holder(impact, 'harry').properties.mind_compelled_steps, true);
    assert.equal(holder(impact, 'draco').quantities.stamina, 8);
    assert.equal(holder(impact, 'harry').quantities.stamina, 7);
    assert.equal(holder(impact, 'snape').quantities.stamina, 8);
});

test('Harry and Draco trade charms and one Finite ends both named effects; idle and restore match', () => {
    let manual = studentCast(students(), 'students.tickle', 'harry', 'tickle', 'draco');
    manual = advance(manual, 1);
    assert.equal(holder(manual, 'draco').properties.mind_laughing, true);
    manual = studentCast(manual, 'students.dance', 'draco', 'dance', 'harry');
    const both = advance(manual, 2);
    assert.equal(holder(both, 'draco').properties.mind_laughing, true);
    assert.equal(holder(both, 'harry').properties.mind_compelled_steps, true);
    assert.equal(holder(both, 'draco').quantities.stamina, 8);
    const stopping = stopStudentExchange(both);
    const end = settle(stopping, 3);
    assert.equal(holder(end, 'draco').properties.mind_laughing, false);
    assert.equal(holder(end, 'harry').properties.mind_compelled_steps, undefined);
    assert.deepEqual(entry(end, 'students.finite').landed.map(r => [r.at, r.status]), [[3, 'published'], [3, 'published']]);
    assert.equal(holder(end, 'snape').quantities.stamina, 8);
    assert.throws(() => studentCast(end, 'extra', 'harry', 'tickle', 'draco'), /proctor has ended/);

    assert.deepEqual(save(idle(students(), 8)), save(advance(end, 8)));
    let resumed = students();
    for (const at of [0, 1, 2, 3, 8]) resumed = restore(idle(resumed, at));
    assert.deepEqual(save(resumed), save(advance(end, 8)));
});

test('if Draco is hit with Dancing Feet, he loses a planted shield but can still aim his wand', () => {
    const dancing = settle(studentCast(students(), 'reversed.dance', 'harry', 'dance', 'draco'), 1);
    assert.equal(holder(dancing, 'draco').properties.mind_compelled_steps, true);
    const failed = settle(studentCast(dancing, 'draco.shield', 'draco', 'shield', 'draco'), 2);
    assert.equal(entry(failed, 'draco.shield').record.status, 'interrupted');
    assert.match(entry(failed, 'draco.shield').record.receipts[0].reason, /cannot plant/);
    assert.equal(holder(failed, 'draco').quantities.stamina, 10);
    const reply = settle(studentCast(failed, 'draco.reply', 'draco', 'tickle', 'harry'), 3);
    assert.equal(holder(reply, 'harry').properties.mind_laughing, true);
    const later = settle(reply, 6);
    const recovered = settle(studentCast(later, 'draco.recovered', 'draco', 'shield', 'draco'), 7);
    assert.equal(entry(recovered, 'draco.recovered').landed[0].status, 'landed');
});

test('Dancing Feet landing during a shield wind-up changes the release after restore', () => {
    const incoming = castAtDuellingClub(students(), {
        id: 'incoming.dance', actor: 'harry', spellId: 'dance', target: 'draco', flightMinutes: 1,
    });
    const windingUp = castAtDuellingClub(incoming, {
        id: 'draco.shield', actor: 'draco', spellId: 'shield', target: 'draco', minutes: 3,
    });
    const inFlight = restore(advance(windingUp, 1));
    assert.equal(holder(inFlight, 'draco').properties.mind_compelled_steps, undefined);
    assert.equal(entry(inFlight, 'draco.shield').record.status, 'running');

    const exposed = settle(inFlight, 3);
    assert.deepEqual(entry(exposed, 'incoming.dance').landed.map(r => [r.at, r.status]), [[2, 'published']]);
    assert.equal(entry(exposed, 'draco.shield').record.status, 'interrupted');
    assert.match(entry(exposed, 'draco.shield').record.receipts[0].reason, /cannot plant/);
    assert.equal(holder(exposed, 'draco').quantities.stamina, 10);

    const covered = applyEngineOps(inFlight, [{op: 'link_set', id: 'platform', state: 'closed'}], 'cover-crossed');
    const defended = settle(covered, 3);
    assert.match(entry(defended, 'incoming.dance').landed[0].reason, /no clear path/);
    assert.equal(entry(defended, 'draco.shield').landed[0].status, 'landed');
    assert.equal(holder(defended, 'draco').quantities.stamina, 8);
});

test('Finite releases the two selected effects and preserves an unrelated working', () => {
    let engine = studentCast(students(), 'other.dance', 'harry', 'dance', 'draco');
    engine = idle(advance(engine, 1), 4);
    assert.equal(holder(engine, 'harry').properties.mind_compelled_steps, undefined);
    assert.equal(holder(engine, 'draco').properties.mind_laughing, false);
    assert.equal(holder(engine, 'draco').properties.mind_compelled_steps, true);
});

test('a short Shield Charm expires before the disarm and leaves the reply without a wand', () => {
    const shieldCast = {
        sentence: sentenceFromIntent({intent: 'shield', target: 'self', execution: 'sustained', carrier: 'wand', cost: 'stamina'}),
        target: {id: 'lockhart'}, grip: {caster: 'lockhart', implement: 'lockhart-wand'},
        minutes: 1, odds: 0, partialMinutes: 1,
        details: {field: 'protection', minutes: 3, cost: 2, params: {verb: '*', object: 'spell-contact'}},
    };
    assert.throws(() => spellEffectMethod([{...shieldCast, partialMinutes: 3}]), /shorter positive duration/);
    const run = odds => startEngineWorking(disarm(startDuellingClub()), {
        ...spellEffectMethod([{...shieldCast, odds}]), id: 'protego', payer: 'lockhart',
    });
    const short = settle(run(0), 1), full = settle(run(1000), 1);
    assert.equal(short.world.laws.find(field => field.id === 'protection').until, 2);
    assert.equal(full.world.laws.find(field => field.id === 'protection').until, 4);
    assert.equal(entry(short, 'protego').record.receipts[0].truth.draw.hit, false);
    assert.equal(holder(short, 'lockhart').quantities.stamina, 8);
    assert.equal(holder(full, 'lockhart').quantities.stamina, 8);
    const shortEnd = settle(reply(restore(short), 2), 3);
    const fullEnd = settle(reply(restore(full), 2), 3);
    assert.equal(holder(shortEnd, 'lockhart-wand').place, 'far-floor');
    assert.match(entry(fullEnd, 'disarm').landed[0].reason, /intercepted by protection/);
    assert.equal(entry(shortEnd, 'reply').record.status, 'interrupted');
    assert.equal(holder(shortEnd, 'lockhart').quantities.stamina, 8);
    assert.equal(entry(fullEnd, 'reply').landed[0].status, 'published');
    assert.equal(holder(fullEnd, 'lockhart').quantities.stamina, 6);
});
