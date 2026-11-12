// PC8 and PC16: one host lands a settled K effect in a W world, and the runs check executes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, advanceWorld, serializeWorld, restoreWorld, readQuantity} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {settleWorking, beginWorking} from '../src/kernel_working.js';
import {spellEffectMethod} from '../src/spell_law.js';
import {sentenceFromIntent, sharedEffect, EFFECT_VERBS as S_VERBS, EFFECT_OBJECTS as S_OBJECTS, P_VERB_OF, P_OBJECT_OF, NO_P_READING} from '../src/spell_effects.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../src/spell_pack_hogwarts.js';
import {lowerEffect, assembleEffect, EFFECT_VERBS, EFFECT_OBJECTS} from '../src/effect_grammar.js';
import {landEffect} from '../src/effect_host.js';
import {checkEffect} from '../src/effect_checks.js';
import {effectWorlds} from '../scripts/grammar_canon_effects.mjs';
import {hpEffectRows, labelHpEffect} from './fixtures/procedural_grammar/effect_worlds.mjs';
import {caseSentence, hpEffects, HP_KEYS} from '../src/world_packs/hp_effect_pack.js';
import {HP_PRIMITIVE_SCENES} from '../src/world_packs/hp_primitive_case_scenes.js';

const vocabulary = {id: 'w.vocabulary', quantities: Object.values(WQ), properties: Object.values(WP)};
// An owner for mind effects: it hears the kind, so a publish there is answered.
const owner = {id: 'test.mind-owner', reactors: [{id: 'listen', on: ['effect.transform.mind'], appliesTo: h => h.kind === 'place', react: () => []}]};
const rules = composeSubstrate({packs: [vocabulary, owner]});
const bare = composeSubstrate({packs: [vocabulary]});
const keys = {light: 'wand', essence: 'mana'};
const hall = r => createWorld(r, {clock: 0, holders: [
    {id: 'hall', kind: 'place', quantities: {temperature: 18, 'light:wand': 5}},
    {id: 'goblin', kind: 'body', place: 'hall', quantities: {vitality: 20}, properties: {alive: true}}]});

// Settle one spell through the Hogwarts-labelled spell vocabulary and take what the law published.
function settle(spells) {
    const {law, method, bindings} = spellEffectMethod(spells);
    const out = settleWorking(law, beginWorking(law, method, {id: 'cast', bindings, at: 0}), {now: 60});
    assert.equal(out.record.status, 'complete', out.record.receipts?.at(-1)?.reason);
    return out.effects.map(row => row.effect);
}
const lumos = sentenceFromIntent({intent: 'light', target: 'place', execution: 'sustained', carrier: 'wand', cost: 'stamina'});
const hurt = sentenceFromIntent({intent: 'hurt', target: 'creature', execution: 'instant', carrier: 'wand', cost: 'stamina'});

test('a settled Hogwarts spell changes a W world through the host, and keeps its old kind label beside the sentence', () => {
    const [light, harm] = settle([
        {sentence: lumos, target: {id: 'hall'}, minutes: 1, details: {target: {shape: 'holder', id: 'hall'}, amount: 4, minutes: 30}},
        {sentence: hurt, target: {id: 'goblin'}, minutes: 1, details: {target: {shape: 'holder', id: 'goblin'}, amount: 6}}]);
    assert.equal(light.kind, 'spell.add.light');
    assert.deepEqual(light.sentence, lumos);
    const w0 = hall(rules);
    const lit = landEffect(rules, w0, light, {cause: 'test:lumos', keys});
    assert.equal(lit.status, 'landed');
    assert.equal(readQuantity(lit.world, 'hall', 'light:wand'), 9);
    const hit = landEffect(rules, lit.world, harm, {cause: 'test:hurt', keys});
    assert.equal(readQuantity(hit.world, 'goblin', 'vitality'), 14);
    assert.equal(readQuantity(w0, 'hall', 'light:wand'), 5, 'the input world is not edited');
    // With no details the law targets the bound thing by id.
    const [bare1] = settle([{sentence: hurt, target: {id: 'goblin'}, minutes: 1}]);
    assert.deepEqual(bare1.details, {target: {shape: 'holder', id: 'goblin'}});
});

test('a law that emits only a label lands nothing, and a missing world key is named', () => {
    const label = landEffect(rules, hall(rules), {kind: 'spell.move.position', target: 'goblin'}, {cause: 'test:label'});
    assert.equal(label.status, 'label-only');
    assert.equal(label.changed, false);
    const keyless = landEffect(rules, hall(rules), {sentence: lumos, details: {target: {shape: 'holder', id: 'hall'}, amount: 1}}, {cause: 'test:nokey'});
    assert.deepEqual([keyless.status, keyless.needs], ['needs-key', ['light:<key>']]);
});

// PC81, the vocabulary fold: spell words reach W through the one map in src/spell_effects.js.
const spell = (intent, target = 'place', execution = 'instant') => sentenceFromIntent({intent, target, execution, carrier: 'wand', cost: 'stamina'});
const room = () => createWorld(rules, {clock: 0, holders: [
    {id: 'hall', kind: 'place', quantities: {temperature: 18, humidity: 40, noise: 10, 'light:wand': 5}},
    {id: 'door', kind: 'thing', place: 'hall', properties: {marks: ['seal']}},
    {id: 'goblin', kind: 'body', place: 'hall', quantities: {vitality: 20}, properties: {alive: true}}]});
const at = id => ({target: {shape: 'holder', id}});

test('spell words that were unmapped now land, and each lands the change its word means', () => {
    // Through the spell law first: the settled effect still carries spell words.
    const [fire] = settle([{sentence: spell('kindle'), target: {id: 'hall'}, minutes: 1, details: {...at('hall'), amount: 5}}]);
    assert.deepEqual([fire.kind, fire.sentence.object], ['spell.add.fire', 'fire']);
    const w0 = room();
    const read = (w, q) => readQuantity(w, 'hall', q);
    const land = (w, sentence, details, cause = 'test:fold') => landEffect(rules, w, {sentence, details}, {cause, keys, read: sharedEffect});
    const warm = landEffect(rules, w0, fire, {cause: 'test:kindle', keys, read: sharedEffect});
    // The host imports no domain: without the caller's reader a spell word stays unmapped.
    assert.equal(landEffect(rules, w0, fire, {cause: 'test:noreader', keys}).status, 'unmapped');
    assert.deepEqual([warm.status, read(warm.world, 'temperature')], ['landed', 23]);
    // Each word moves its own quantity and no other: a wrong row in the map would show here.
    assert.deepEqual(['humidity', 'noise', 'light:wand'].map(q => read(warm.world, q)), [40, 10, 5]);
    // Cold is heat taken away: adding cold lowers temperature, it does not raise it.
    assert.equal(read(land(w0, spell('chill'), {...at('hall'), amount: 5}).world, 'temperature'), 13);
    const wet = land(w0, spell('pour'), {...at('hall'), amount: 7}).world;
    assert.deepEqual([read(wet, 'humidity'), read(wet, 'temperature')], [47, 18]);
    assert.equal(read(land(w0, spell('amplify'), {...at('hall'), amount: 3}).world, 'noise'), 13);
    // A shield (block harm) guards vitality: the next hurt is blocked and the goblin keeps its 20.
    const shielded = land(w0, spell('shield', 'creature', 'sustained'), {...at('goblin'), minutes: 10});
    assert.equal(shielded.status, 'landed');
    const struck = land(shielded.world, hurt, {...at('goblin'), amount: 6});
    assert.deepEqual([struck.outcomes[0].blocked.length, readQuantity(struck.world, 'goblin', 'vitality')], [1, 20]);
    // Access is a mark on the thing: opening releases the seal, sealing binds it again.
    const opened = land(w0, spell('open', 'object'), {...at('door'), mark: 'seal'});
    assert.deepEqual([opened.status, opened.world.holders.door.properties.marks], ['landed', []]);
    assert.deepEqual(land(opened.world, spell('seal', 'object'), {...at('door'), mark: 'seal'}).world.holders.door.properties.marks, ['seal']);
    // A ward (alter_law access) is P's alter on a law: it adds a law field on the place.
    const ward = land(w0, spell('ward', 'place', 'lasting'), {...at('hall'), field: 'ward.hall', kind: 'access'});
    assert.deepEqual(ward.world.laws.map(f => [f.id, f.scope, f.kind]), [['ward.hall', 'hall', 'access']]);
    // Words whose object another owner holds publish for that owner and change nothing in W.
    const waits = sentence => { const r = land(w0, sentence, {...at('goblin'), place: 'hall'}); assert.deepEqual(r.world, w0); return [r.status, r.waiting.map(p => `${p.kind}:${p.owner}`)]; };
    assert.deepEqual(waits(spell('counter', 'effect')), ['waiting', ['effect.block.working:K']]);
    assert.deepEqual(waits(spell('compel', 'creature', 'sustained')), ['waiting', ['effect.bind.mind:A']]);
    assert.deepEqual(land(w0, spell('divine', 'self'), {...at('goblin'), channel: 'sight'}).waiting, [{kind: 'effect.sense.information', owner: 'N'}]);
});

test('every spell word maps to a P word or is listed with its reason; a word with no reading is named', () => {
    for (const v of S_VERBS) assert.ok(EFFECT_VERBS.includes(P_VERB_OF[v]) !== (NO_P_READING[v]?.part === 'verb'), `verb ${v}`);
    for (const o of S_OBJECTS) assert.ok((P_OBJECT_OF[o] in EFFECT_OBJECTS) !== (NO_P_READING[o]?.part === 'object'), `object ${o}`);
    for (const no of Object.values(NO_P_READING)) assert.ok(no.reason && no.rows.length);
    const w0 = room();
    const animated = landEffect(rules, w0, {sentence: spell('animate', 'object', 'sustained'),
        details: {...at('door'), properties: {form: 'moving-statue'}}}, {cause: 'test:animate', read: sharedEffect});
    assert.equal(animated.status, 'landed');
    assert.equal(animated.world.holders.door.properties.form, 'moving-statue');
    const stray = landEffect(rules, w0, {sentence: {...hurt, object: 'karma'}, details: at('goblin')}, {cause: 'test:stray', read: sharedEffect});
    assert.deepEqual([stray.status, stray.word], ['unmapped', 'object karma']);
    // The spellbook rows all read through the map, including created holders and animation.
    // Before the fold the host read 30 of them, by object name alone.
    const count = {};
    for (const row of HP_SPELL_ROWS) {
        const shared = sharedEffect(sentenceFromIntent({intent: row.intent, target: row.target, execution: row.execution, carrier: HP_SPELL_WORLD.carrier, cost: HP_SPELL_WORLD.cost}));
        const kind = shared.gap ?? (lowerEffect(shared, {keys}).acts.length ? 'acts' : 'publish');
        count[kind] = (count[kind] ?? 0) + 1;
    }
    assert.deepEqual(count, {acts: 66, publish: 14});
});

test('luck and soul are P objects that wait for their owners, and no canon sentence assembles differently for them', async () => {
    assert.deepEqual([EFFECT_OBJECTS.luck, EFFECT_OBJECTS.soul], ['quantity', 'thing']);
    const w0 = hall(bare), base = {target: 'bound', time: 'sustained', carrier: 'spoken-spell', cost: 'stamina', limits: []};
    for (const [verb, object, owner] of [['add', 'luck', 'P'], ['move', 'soul', 'L'], ['block', 'luck', 'P'], ['bind', 'soul', 'L']]) {
        const run = landEffect(bare, w0, {sentence: {...base, verb, object}, details: {target: {shape: 'holder', id: 'goblin'}, amount: 3, place: 'hall'}}, {cause: 'test:owners'});
        assert.deepEqual([run.status, run.acts, run.waiting], ['waiting', [], [{kind: `effect.${verb}.${object}`, owner}]], `${verb} ${object}`);
        assert.deepEqual(run.world, w0);
    }
    // The canon sentences of both fixture worlds assemble as before (55 of 57 Gu, 104 of 109 Hogwarts): none uses a new object.
    const assembled = {};
    for (const w of await effectWorlds()) {
        assert.ok(w.canon.every(c => !['luck', 'soul'].includes(c.parts.object)));
        assembled[w.id] = `${w.canon.filter(c => assembleEffect(w.grammar, c.parts).ok).length} of ${w.canon.length}`;
    }
    assert.deepEqual(assembled, {gu: '55 of 57', hogwarts: '104 of 109'});
});

test('a sentence whose object lowers to nothing waits for its owner and changes nothing', () => {
    const w0 = hall(bare), mind = {verb: 'transform', object: 'mind', target: 'bound', time: 'instant', carrier: 'spoken-spell', cost: 'stamina', limits: []};
    const run = landEffect(bare, w0, {sentence: mind, details: {target: {shape: 'holder', id: 'goblin'}, place: 'hall'}}, {cause: 'test:calm'});
    assert.equal(run.status, 'waiting');
    assert.deepEqual(run.acts, []);
    assert.deepEqual(run.waiting, [{kind: 'effect.transform.mind', owner: 'A'}]);
    assert.deepEqual(run.world, w0);
    // Where a loaded owner hears the kind, the publish is delivered and counts as an answer.
    const heard = landEffect(rules, hall(rules), {sentence: mind, details: {place: 'hall'}}, {cause: 'test:calm'});
    assert.deepEqual([heard.status, heard.changed, heard.waiting], ['published', true, []]);
    // Sensing runs on W's channel and still waits for N to record what was learned.
    const sense = landEffect(bare, w0, {sentence: {...mind, verb: 'sense', object: 'information'}, details: {target: {shape: 'holder', id: 'goblin'}, channel: 'sight'}}, {cause: 'test:look'});
    assert.equal(sense.waiting.length, 1);
    assert.deepEqual(sense.acts, [{verb: 'sense'}]);
});

test('a landed sustained effect is the same in one jump or several, and after save and restore', () => {
    const guard = {verb: 'block', object: 'vitality', target: 'self', time: 'sustained', carrier: 'spoken-spell', cost: 'stamina', limits: []};
    const landed = landEffect(rules, hall(rules), {sentence: guard, details: {target: {shape: 'holder', id: 'goblin'}, minutes: 10}}, {cause: 'test:ward'});
    assert.equal(landed.changed, true);
    const jump = advanceWorld(rules, landed.world, 40).world;
    let steps = landed.world;
    for (const t of [3, 11, 12, 29, 40]) steps = advanceWorld(rules, steps, t).world;
    assert.deepEqual(steps, jump);
    const restored = restoreWorld(rules, serializeWorld(landed.world));
    assert.deepEqual(advanceWorld(rules, restored, 40).world, jump);
    assert.equal(jump.laws.length, 0, 'the ward lapsed at its minute');
});

test('the runs check executes: it rejects what nothing can land and says when it only looked a name up', async () => {
    const [, hp] = await effectWorlds();
    const sentence = {verb: 'remove', object: 'vitality', target: 'bound', time: 'instant', carrier: 'spoken-spell', cost: 'stamina', limits: []};
    const probe = {rules, world: hall(rules), keys, details: {target: {shape: 'holder', id: 'goblin'}, amount: 2}};
    const runs = c => c.checks.find(x => x.id === 'runs');
    const ok = checkEffect(hp.fitted, {id: 'a', parts: sentence}, {...hp.checks, probe});
    assert.deepEqual([runs(ok).pass, runs(ok).executed], [true, true]);
    // A body that carries no vitality: the act is skipped, nothing lands, so the check fails even though the law name exists.
    const empty = {...probe, world: createWorld(rules, {clock: 0, holders: [{id: 'hall', kind: 'place'}, {id: 'goblin', kind: 'body', place: 'hall'}]})};
    const none = checkEffect(hp.fitted, {id: 'b', parts: sentence}, {...hp.checks, probe: empty});
    assert.equal(hp.checks.laws.has('remove|quantity'), true);
    assert.equal(runs(none).pass, false);
    assert.match(runs(none).reason, /nothing landed/);
    // A mind effect passes only where an owner answers it.
    const mind = {...sentence, verb: 'transform', object: 'mind'};
    const place = {target: {shape: 'holder', id: 'goblin'}, place: 'hall'};
    assert.equal(runs(checkEffect(hp.fitted, {id: 'c', parts: mind}, {...hp.checks, probe: {...probe, details: place}})).pass, true);
    assert.equal(runs(checkEffect(hp.fitted, {id: 'c', parts: mind}, {...hp.checks, probe: {rules: bare, world: hall(bare), details: place}})).pass, false);
    // No probe world: the old lookup stands and its reason says nothing ran.
    const lookup = runs(checkEffect(hp.fitted, {id: 'd', parts: sentence}, hp.checks));
    assert.equal(lookup.executed, false);
    assert.match(lookup.reason, /lookup only/);
});

test('the Hogwarts effect corpus lowers: acts, publishes for other owners, and keys a world must supply', () => {
    const count = {};
    for (const row of hpEffectRows()) {
        const {parts} = labelHpEffect(row);
        if (!parts) { count.unlabelled = (count.unlabelled ?? 0) + 1; continue; }
        const l = lowerEffect(parts);
        const kind = l.needs.length ? 'needs-key' : l.acts.length && l.publish.length ? 'acts-and-publish' : l.acts.length ? 'acts' : 'publish';
        count[kind] = (count[kind] ?? 0) + 1;
        // The host agrees with lowering on what waits for an owner.
        if (!l.needs.length && !l.acts.length) assert.equal(landEffect(bare, hall(bare), {sentence: parts, details: {}}, {cause: 'test:corpus'}).status, 'waiting', row.id);
    }
    // PC7 said 68 land alone, 37 publish (17 of them with an act too) and 4 need a key, of 109 labelled.
    assert.deepEqual(count, {acts: 68, 'acts-and-publish': 17, publish: 20, 'needs-key': 4, unlabelled: 8});
});

test('physical spell cases express their scene outcomes through the one effect host', () => {
    assert.equal(Object.keys(HP_PRIMITIVE_SCENES).length, 15);
    for (const [id, scene] of Object.entries(HP_PRIMITIVE_SCENES)) {
        const row = HP_SPELL_ROWS.find(row => row.id === id);
        const sentence = caseSentence(row);
        assert.deepEqual(assembleEffect(hpEffects, sentence).receipt.violations, [], id);
        const before = createWorld(bare, {holders: scene.holders});
        // Exercise both the pack's shared sentence and the original spell
        // vocabulary that a settled working carries into the same host.
        for (const input of [sentence, row.truth]) {
            const landed = landEffect(bare, before, {sentence: input, details: scene.details},
                {cause: `case:${id}`, keys: HP_KEYS, read: sharedEffect});
            assert.equal(landed.status, 'landed', id);
            assert.deepEqual([landed.waiting, landed.published], [[], []], id);
            for (const e of scene.expect) {
                const read = w => {
                    const holder = w.holders[e.holder];
                    if (e.exists) return holder !== undefined;
                    if (e.quantity) return holder?.quantities[e.quantity];
                    if (e.property) return holder?.properties[e.property];
                    return holder?.place;
                };
                const prior = read(before), after = read(landed.world);
                if (e.direction === 'unchanged') assert.deepEqual(after, prior, id);
                else {
                    assert.notDeepEqual(after, prior, id);
                    assert.deepEqual(after, e.to, id);
                }
                if (e.direction === 'up' || e.direction === 'down') {
                    assert.equal(after - prior, e.direction === 'up' ? e.amount : -e.amount, id);
                }
            }
        }
    }
});
