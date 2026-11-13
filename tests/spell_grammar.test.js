// Spell foundation (chat S phase 2): grammar of parts on P's contract, three
// worlds' canon rebuilt from parts, held-out families, spells as K workings,
// and beyond-canon spells through NV1 and NV3 with the five checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {canonTest, fitGrammar, assemble} from '../src/procedural_grammar.js';
import {settleWorking, beginWorking} from '../src/kernel_working.js';
import {defineSpellGrammar, labelSpellRow, compareSpell, inferIntent, incantationName} from '../src/spell_grammar.js';
import {sentenceFromIntent, describeSentence, sharedEffect} from '../src/spell_effects.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD, HP_ROOT_LEXICON} from '../src/spell_pack_hogwarts.js';
import {dndSpellRows, DND_SPELL_WORLD} from '../src/spell_pack_dnd.js';
import {MOL_SPELL_ROWS, MOL_SPELL_WORLD} from '../src/spell_pack_mol.js';
import {lotmDivinationSpellRows, LOTM_ABILITY_ROWS, LOTM_SPELL_WORLD} from '../src/spell_pack_lotm.js';
import {spellEffectMethod, quoteSpells} from '../src/spell_law.js';
import {recombine, transfer, keepSpread, spellCost, worldAllows} from '../src/spell_invention.js';

const grammar = defineSpellGrammar();
const srd = JSON.parse(fs.readFileSync(new URL('../src/data/srd521/spells.json', import.meta.url), 'utf8'));
const worlds = [
    ['hogwarts', HP_SPELL_ROWS, HP_SPELL_WORLD],
    ['dnd', dndSpellRows(srd), DND_SPELL_WORLD],
    ['cyoria', MOL_SPELL_ROWS, MOL_SPELL_WORLD],
    ['lotm', [...lotmDivinationSpellRows(), ...LOTM_ABILITY_ROWS], LOTM_SPELL_WORLD],
];
const partsOf = (row, world) => labelSpellRow(row, world).parts;
const hpFit = fitGrammar(grammar, HP_SPELL_ROWS.map(r => ({id: r.id, parts: partsOf(r, HP_SPELL_WORLD)})));
const levitation = HP_SPELL_ROWS.find(r => r.id === 'levitation');
const anchor = {sentence: sentenceFromIntent(partsOf(levitation, HP_SPELL_WORLD)), amount: 1};

test('canon spells of four worlds rebuild from their parts through one grammar', () => {
    for (const [world, rows, pack] of worlds) {
        // Each world's own dials (Hogwarts portraits have minds: mindedObjects).
        const report = canonTest(defineSpellGrammar({dials: pack.dials}), rows, {label: r => labelSpellRow(r, pack), compare: compareSpell, generated: 20});
        assert.equal(report.corpus.unlabelled, 0, world);
        assert.equal(report.rebuild.rate, 1, `${world}: ${JSON.stringify(report.missingRules)}`);
    }
});

test('generated Hogwarts spells use intent and target pairs the books show', () => {
    const report = canonTest(defineSpellGrammar({dials: HP_SPELL_WORLD.dials}), HP_SPELL_ROWS, {label: r => labelSpellRow(r, HP_SPELL_WORLD), compare: compareSpell,
        generated: 100, pairs: [['intent', 'target']]});
    assert.equal(report.range.pairs['intent+target'].supportedRate, 1);
    assert.equal(report.range.fallbacks, 0);
});

test('held-out families: roots plus the source-language lexicon recover the intent', () => {
    for (const family of ['wandlight', 'corpus']) {
        const fitted = fitGrammar(grammar, HP_SPELL_ROWS.filter(r => r.reserved !== family).map(r => ({id: r.id, parts: partsOf(r, HP_SPELL_WORLD)})));
        for (const row of HP_SPELL_ROWS.filter(r => r.reserved === family)) {
            const parts = partsOf(row, HP_SPELL_WORLD);
            assert.equal(inferIntent(fitted, parts, {lexicon: HP_ROOT_LEXICON}).best, row.intent, row.id);
        }
    }
    // Corpus roots alone, without a lexicon, miss the wand-light family: the rule the test found.
    const fitted = fitGrammar(grammar, HP_SPELL_ROWS.filter(r => r.reserved !== 'wandlight').map(r => ({id: r.id, parts: partsOf(r, HP_SPELL_WORLD)})));
    assert.equal(inferIntent(fitted, partsOf(HP_SPELL_ROWS.find(r => r.id === 'light'), HP_SPELL_WORLD)).best, null);
});

test('a composed spell is one kernel working: lift, summon, release settle in order and a ward stops one step', () => {
    const lift = sentenceFromIntent({intent: 'raise', target: 'object', execution: 'sustained', carrier: 'wand', cost: 'stamina'});
    const fetch = sentenceFromIntent({intent: 'fetch', target: 'object', execution: 'instant', carrier: 'wand', cost: 'stamina'});
    const drop = sentenceFromIntent({intent: 'lower', target: 'object', execution: 'instant', carrier: 'wand', cost: 'stamina'});
    const spells = [{sentence: lift, target: {id: 'board'}, minutes: 1}, {sentence: fetch, target: {id: 'weight'}, minutes: 1}, {sentence: drop, target: {id: 'board'}, minutes: 1}];
    const quote = quoteSpells(spells);
    assert.equal(quote.ok, true);
    assert.deepEqual(quote.effects.map(e => e.kind), ['spell.move.position', 'spell.move.position', 'spell.move.position']);
    const {law, method, bindings} = spellEffectMethod(spells);
    const record = beginWorking(law, method, {id: 'combo', bindings, at: 0});
    const warded = {read: ref => ref.id === 'weight' ? {...ref, blocks: ['position']} : ref};
    const out = settleWorking(law, record, {now: 3, ports: warded});
    assert.equal(out.record.status, 'interrupted');
    assert.equal(out.effects.length, 1);
    assert.match(out.record.receipts.at(-1).reason, /protected/);
    const heavy = quoteSpells([{sentence: lift, target: {id: 'board'}, massLimit: 5}], {ports: {read: ref => ({...ref, mass: 9})}});
    assert.equal(heavy.ok, false);
});

test('NV1 recombine: new spells pass the five checks, keep a spread and take names after their substance', () => {
    const judge = {world: 'hogwarts', anchor, lexicon: HP_ROOT_LEXICON, canonForms: HP_SPELL_ROWS.flatMap(r => r.forms), root: 'test'};
    const tried = recombine(hpFit, partsOf(levitation, HP_SPELL_WORLD), {...judge, at: 'levitation'});
    const passed = tried.filter(c => c.ok);
    assert.ok(passed.length >= 10, `only ${passed.length} passed`);
    assert.ok(tried.some(c => !c.ok), 'some recombinations fail a check');
    for (const c of passed) {
        assert.ok(c.cost >= 1 && Number.isInteger(c.cost));
        assert.match(c.explain, /^It /);
        assert.ok(c.name.name || c.name.reason);
        assert.equal(c.cause.kind, 'inventor');
    }
    const canon = HP_SPELL_ROWS.map(r => sentenceFromIntent(partsOf(r, HP_SPELL_WORLD)));
    const kept = keepSpread(passed, canon);
    assert.ok(kept.length >= 3);
    assert.equal(new Set(kept.map(c => c.sentence.verb)).size, kept.length);
    assert.ok(kept.every(c => c.score.novelty > 0));
    assert.deepEqual(recombine(hpFit, partsOf(levitation, HP_SPELL_WORLD), {...judge, at: 'levitation'}).map(c => c.id),
        tried.map(c => c.id), 'same address, same candidates');
});

test('check 2 and 3: bigger reach costs more by one curve, and a world law refuses with its reason', () => {
    const small = sentenceFromIntent({intent: 'kindle', target: 'object', execution: 'instant', carrier: 'wand', cost: 'stamina'});
    const wide = sentenceFromIntent({intent: 'kindle', target: 'area', execution: 'lasting', carrier: 'wand', cost: 'stamina'});
    assert.ok(spellCost(wide, {anchor}) > spellCost(small, {anchor}));
    const conjure = sentenceFromIntent({intent: 'conjure', target: 'place', execution: 'instant', carrier: 'wand', cost: 'stamina'});
    assert.equal(worldAllows('hogwarts', conjure).ok, true, 'flowers are fine');
    assert.equal(worldAllows('hogwarts', {...conjure, direction: 'food'}).law, 'gamp');
    assert.equal(worldAllows('hogwarts', {...conjure, direction: 'food'}, {}, {gamp: {reason: 'a house-elf larder', cost: 'the food is fetched, not made'}}).ok, true);
});

test('NV3 transfer: a Hogwarts summoning carried into Cyoria pays in mana and runs; into D&D it pays a slot', () => {
    const summoning = partsOf(HP_SPELL_ROWS.find(r => r.id === 'summoning'), HP_SPELL_WORLD);
    const molFit = fitGrammar(grammar, MOL_SPELL_ROWS.map(r => ({id: r.id, parts: partsOf(r, MOL_SPELL_WORLD)})));
    const toCyoria = transfer(molFit, summoning, MOL_SPELL_WORLD, {anchor: {sentence: sentenceFromIntent(partsOf(MOL_SPELL_ROWS[0], MOL_SPELL_WORLD)), amount: 2},
        lexicon: {}, root: 'test', at: 'nv3'});
    assert.equal(toCyoria.ok, true);
    assert.equal(toCyoria.costAccount, 'mana');
    assert.equal(toCyoria.sentence.verb, 'move');
    assert.equal(toCyoria.flags.filter(f => f.kind === 'rule-flag').length, 0);
    const toDnd = transfer(fitGrammar(grammar, dndSpellRows(srd).map(r => ({id: r.id, parts: partsOf(r, DND_SPELL_WORLD)}))), summoning, DND_SPELL_WORLD,
        {anchor: {sentence: anchor.sentence, amount: 1}, lexicon: {}, root: 'test', at: 'nv3'});
    assert.equal(toDnd.ok, true);
    assert.equal(toDnd.costAccount, 'slot');
});

test('assembly rejects a verb that cannot act on a running effect and explains a canon spell plainly', () => {
    const bad = assemble(hpFit, {...partsOf(levitation, HP_SPELL_WORLD), target: 'effect'});
    assert.equal(bad.ok, false);
    assert.ok(bad.receipt.violations.some(v => v.rule === 'target-fits-verb'));
    const mindless = assemble(hpFit, {...partsOf(levitation, HP_SPELL_WORLD), intent: 'stun'});
    assert.ok(mindless.receipt.violations.some(v => v.rule === 'living-target'));
    assert.equal(assemble(fitGrammar(defineSpellGrammar({dials: {mindedObjects: true}}), [{id: 'l', parts: partsOf(levitation, HP_SPELL_WORLD)}]),
        {...partsOf(levitation, HP_SPELL_WORLD), intent: 'stun'}).ok, true);
    assert.equal(describeSentence(anchor.sentence), 'It moves position (up) of an object, while you keep it up. Paid with stamina.');
    assert.equal(incantationName(['lev'], {canonForms: ['Leviosa']}).collides, false);
});

test('a D&D record that still needs a ruling does not run until a ruling resolves it', () => {
    const rows = dndSpellRows(srd);
    assert.equal(rows.filter(r => r.status === 'supported').length, 4);
    const fireBolt = rows.find(r => r.id === 'srd521.spell.fire_bolt');
    const sentence = sentenceFromIntent(partsOf(fireBolt, DND_SPELL_WORLD));
    const pending = quoteSpells([{sentence, target: {id: 'goblin'}, status: fireBolt.status, unmodeled: fireBolt.unmodeled}]);
    assert.equal(pending.ok, false);
    assert.match(pending.reason, /needs a ruling/);
    assert.equal(quoteSpells([{sentence, target: {id: 'goblin'}, status: fireBolt.status, ruling: {id: 'table', reason: 'objects ignite as the table rules'}}]).ok, true);
});

test('every Hogwarts spellbook row runs through the spell law', async () => {
    const {HP_SPELL_LEDGER_EXCEPTIONS} = await import('../src/spell_pack_hogwarts.js');
    const ledger = fs.readFileSync(new URL('../docs/coverage/hp_spells.jsonl', import.meta.url), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    assert.equal(ledger.length, 117);
    assert.equal(ledger.filter(r => r.state === 'unclassified').length, 0);
    const rows = new Map(HP_SPELL_ROWS.map(r => [r.id, r]));
    for (const entry of ledger) {
        const exception = HP_SPELL_LEDGER_EXCEPTIONS[entry.id];
        if (exception?.case) {
            assert.ok(!rows.has(entry.id));
            assert.deepEqual(entry.case, exception.case);
            assert.equal(entry.state, exception.state);
            continue;
        }
        // A row with a coverage case is typed expressed-* (PC10); it is still a pack row under the spell law.
        if (/^(runs|expressed)-/.test(entry.state)) {
            const row = rows.get(entry.id);
            assert.ok(row, `${entry.id} runs but has no pack row`);
            const sentence = sentenceFromIntent(partsOf(row, HP_SPELL_WORLD));
            const quote = quoteSpells([{sentence, target: {id: `practice.${entry.id}`}}]);
            assert.equal(quote.ok, true, `${entry.id}: ${quote.reason}`);
            assert.equal(quote.effects[0].kind, `spell.${row.truth.verb}.${row.truth.object}`);
        } else {
            assert.ok(!rows.has(entry.id), `${entry.id} is ${entry.state} but has a pack row`);
            assert.equal(HP_SPELL_LEDGER_EXCEPTIONS[entry.id].state, entry.state);
        }
    }
});

test('GL2 effect layer: Hogwarts effects predicted from identity alone with blind glosses (floor, not target)', async () => {
    const {HP_SPELL_NAME_WORDS} = await import('../src/spell_pack_hogwarts.js');
    const {effectLayerTest} = await import('../src/spell_grammar.js');
    const blind = JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/foundation-s-2026-11-12/evidence/blind_root_lexicon.json', import.meta.url), 'utf8'));
    let holdingOutLight = false;
    let lightAttempts = 0;
    const report = effectLayerTest(grammar, HP_SPELL_ROWS, HP_SPELL_WORLD, {
        lexicon: {...blind.roots, ...blind.names},
        nameWords: HP_SPELL_NAME_WORDS,
        fitGrammar(grammar, training) {
            holdingOutLight = !training.some(row => row.id === 'light');
            return fitGrammar(grammar, training);
        },
        assemble(fitted, parts) {
            if (holdingOutLight) lightAttempts++;
            return assemble(fitted, parts);
        },
    });
    assert.equal(report.rows, HP_SPELL_ROWS.length);
    // Measured 2026-11-12 after the source check moved 14 rows out: 33 verb and object, 12 full sentences. The plan's target is 70% (dial); these floors catch regressions.
    assert.ok(report.verbObject >= 33, `verb and object ${report.verbObject}`);
    assert.ok(report.sentence >= 12, `full sentence ${report.sentence}`);
    assert.deepEqual(report.missingRules.map(m => m.rule).sort(), ['intent-from-identity', 'no-identity-evidence', 'target-from-intent', 'time-from-intent']);
    // The blind gloss names light without supplying a runnable intent.
    assert.ok(report.missingRules.find(m => m.rule === 'no-identity-evidence').ids.includes('light'));
    assert.equal(lightAttempts, 0);
});

test('new agents, animated things and commands read as different mechanisms', () => {
    const read = id => sharedEffect(HP_SPELL_ROWS.find(row => row.id === id).truth);
    for (const id of ['bird', 'serpent', 'patronus']) {
        const {verb, object} = read(id);
        assert.deepEqual([verb, object], ['add', 'thing']);
    }
    assert.deepEqual(read('animate'), {verb: 'transform', object: 'thing', time: 'sustained'});
    assert.deepEqual(read('oppugno'), {verb: 'bind', object: 'mind', time: 'instant'});
});
