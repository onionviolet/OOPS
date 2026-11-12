import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import test from 'node:test';
import {freshMemory} from '../src/person_memory.js';
import {derivedBond, rememberEffect} from '../src/person_memory_effects.js';
import {createObligations, obligation, readObligations, writeObligation} from '../src/obligations_ledger.js';
import {silenceVerdict} from '../src/person_silence.js';

function cli(args, input) {
    return JSON.parse(execFileSync(process.execPath, ['scripts/procedural_workshop.mjs', ...args], {encoding: 'utf8', input}));
}

test('a player can edit and replay spell and enclosure requests through the CLI', () => {
    const spell = cli(['--case', 'spell-experiment']);
    const combined = cli(['-'], JSON.stringify(spell));
    assert.deepEqual(combined.trace[0].operations.map(step => step.operation), ['fetch', 'lift']);
    assert.equal(combined.state.height, 1);
    const blocked = cli(['-'], JSON.stringify({...spell, obstructed: true}));
    assert.deepEqual(blocked.trace[0].operations.map(step => step.operation), ['fetch']);
    assert.equal(blocked.state.height, 0);
    const unfocused = cli(['-'], JSON.stringify({...spell, actions: [{...spell.actions[0], focused: false}]}));
    assert.equal(unfocused.trace[0].outcome, 'unresolved');
    assert.equal(unfocused.state.stamina, 12);
    assert.equal(cli(['spell-sequence']).trace.length, 2);
    assert.equal(cli(['spell-lift']).trace.at(-1).outcome, 'landed');
    assert.equal(cli(['enclosure-dagger']).petitionPerformed, true);
    assert.equal(cli(['enclosure-powder']).spent.powder, 1);
    const partial = cli(['-'], JSON.stringify({method: 'enclosure', route: 'powder', segments: ['north', 'east', 'south']}));
    assert.deepEqual([partial.spent.powder, partial.enclosed, partial.petitionPerformed], [1, false, false]);
});

test('different allocations change the native dose treatment rather than just its preview', () => {
    const results = ['reference', 'equivalent', 'tradeoff', 'blend'].map(name => cli([`substitution-${name}`]));
    assert.deepEqual(results.map(result => result.afterTreatment), [900, 900, 800, 900]);
    assert.deepEqual(results.map(result => result.spent.bonemeal), [0, 2, 0, 1]);
    assert.ok(results.every(result => result.dosesLeft === 2));
    const newAllocation = cli(['-'], JSON.stringify({method: 'abrasion', hornPreparation: 'fine', bonemeal: 2}));
    assert.equal(newAllocation.strength, 133);
    assert.equal(newAllocation.afterTreatment, 833);
});

test('relationship fit trial retains both histories and keeps restitution distinct from amends', () => {
    const holder = 'fixture.keeper', subject = 'fixture.player', day = 1;
    const record = (memory, cause, amount, text) => rememberEffect(memory, {holder, subject, cause, axis: 'trust', amount, text}, day);
    const priorHelp = record(freshMemory(), 'delivered', 3, 'Supplied the agreed materials.');
    const priorBreach = record(freshMemory(), 'breach', -3, 'Used the workbench without asking.');
    const afterOffer = memory => record(memory, 'same-aid', 1, 'Offered a replacement part.');
    const bond = (memory, baseline) => derivedBond({memory, holder, subject, axis: 'trust', baseline, day});
    assert.ok(bond(afterOffer(priorHelp), 4) > bond(afterOffer(priorBreach), -2));

    const debt = obligation({id: 'fixture.replacement', kind: 'duty', debtor: subject, creditor: holder,
        amount: 1, why: 'Replace the damaged tool.', source: 'fixture.bench'});
    const owed = writeObligation(createObligations(), debt);
    const amends = record(afterOffer(priorBreach), 'amends', 3, 'Apologized for the interruption and supplied an actual log for later work.');
    assert.ok(bond(amends, 1) > bond(afterOffer(priorBreach), -2));
    assert.equal(readObligations(owed, {debtor: subject, creditor: holder})[0].amount, 1);
    assert.deepEqual(readObligations(writeObligation(owed, {...debt, amount: 0}), {debtor: subject}), []);
    const boundary = {holder, secret: 'fixture.bench', listener: 'fixture.neighbor', day, root: 17};
    const open = silenceVerdict({...boundary, bondAsker: 1, promised: false});
    const promised = silenceVerdict({...boundary, bondAsker: 1, promised: true});
    assert.equal(promised.key, open.key);
    assert.equal(promised.chance - open.chance, 15);
});
