// PC8 and PC16: one host lands a settled K effect in a W world, and the runs check executes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeSubstrate, createWorld, advanceWorld, serializeWorld, restoreWorld, readQuantity} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';
import {settleWorking, beginWorking} from '../src/kernel_working.js';
import {spellEffectMethod} from '../src/spell_law.js';
import {sentenceFromIntent} from '../src/spell_effects.js';
import {lowerEffect} from '../src/effect_grammar.js';
import {landEffect} from '../src/effect_host.js';
import {checkEffect} from '../src/effect_checks.js';
import {effectWorlds} from '../scripts/grammar_canon_effects.mjs';
import {hpEffectRows, labelHpEffect} from './fixtures/procedural_grammar/effect_worlds.mjs';

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
    const strange = landEffect(rules, hall(rules), {sentence: {...hurt, object: 'harm'}, details: {}}, {cause: 'test:words'});
    assert.equal(strange.status, 'unmapped');
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
