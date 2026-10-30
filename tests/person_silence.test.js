import test from 'node:test';
import assert from 'node:assert/strict';
import {freshMemory, remember, decodeMemory, validateMemory, encodeMemory, readMemories, flagSilence, addClaim, decodeClaims, migrateMemory} from '../src/person_memory.js';
import {rememberEffect, gossipStep, silenceCase, silenceLine} from '../src/person_memory_effects.js';
import {silenceVerdict, silenceExplanation, compareClaims} from '../src/person_silence.js';
import {severityOf, scaledSeverity, lastStraw, SEVERITY_TABLE} from '../src/person_severity.js';
import {loyaltyOf, debtOf} from '../src/person_loyalty.js';
import {temperamentFromTraits} from '../src/person_temperament.js';

const DAY = 100, hold = 'a', asker = 'p', other = 'b';
const harmEffect = {holder: hold, subject: asker, cause: 'c1', axis: 'respect', amount: -1, text: 'Interrupted him while he was counting fittings. He asked for quiet.'};
const base = () => rememberEffect(freshMemory(), harmEffect, DAY);
const ask = (m, promised = false, cause = 'c2') => rememberEffect(m, {holder: hold, subject: asker, cause, axis: 'familiarity', amount: 1, text: 'Asked him to keep the interruption quiet.', silence: {topic: 'interruption', promised}}, DAY);
const pay = (m, cause = 'c3') => rememberEffect(m, {holder: hold, subject: asker, cause, axis: 'respect', amount: 2, text: 'Left a log so the interruption stays quiet.', silence: {topic: 'interruption', promised: false}}, DAY);

test('schema 1 saves are untouched; silence and claims need schema 2 and survive JSON', () => {
    const plain = base();
    assert.equal(plain.schema, 1); assert.equal(migrateMemory(plain, DAY).schema, 1);
    const asked = ask(plain, true);
    assert.equal(asked.schema, 2);
    const back = JSON.parse(JSON.stringify(asked));
    validateMemory(back, DAY);
    const secret = decodeMemory(back, DAY)[hold].find(e => e.silence);
    assert.deepEqual(secret.silence, {asker, promised: true});
    assert.equal(secret.kind, 'harmed');
    // a schema-1 label cannot smuggle the new tuple
    assert.throws(() => validateMemory({...back, schema: 1}, DAY));
    assert.throws(() => validateMemory({...plain, claims: []}, DAY));
    assert.deepEqual(decodeMemory(plain, DAY), decodeMemory(JSON.parse(JSON.stringify(plain)), DAY));
});

test('a later promise upgrades the flag and nothing downgrades it', () => {
    let m = ask(base(), false); m = ask(m, true, 'c4'); m = ask(m, false, 'c5');
    assert.equal(decodeMemory(m, DAY)[hold].filter(e => e.silence).every(e => e.silence.promised), true);
    assert.equal(flagSilence(m, hold, {about: asker, match: e => e.kind === 'harmed', asker, promised: false}, DAY), m);
});

test('claims sit beside facts and survive later remembering', () => {
    let m = base(); const fact = readMemories(m, hold, DAY)[0].fact;
    m = addClaim(m, {speaker: asker, fact, says: 'claim.only_passing', day: DAY}, DAY);
    m = remember(m, 'x', {kind: 'told', about: asker, fact: 'claim.only_passing', source: {teller: asker}, certainty: 60, feeling: -1, day: DAY, count: 1}, DAY);
    const claims = decodeClaims(JSON.parse(JSON.stringify(m)));
    assert.equal(m.schema, 2); assert.equal(claims.length, 1);
    assert.equal(readMemories(m, hold, DAY)[0].fact, fact, 'the fact itself is unchanged');
    const cmp = compareClaims(claims, fact, fact);
    assert.equal(cmp.conflict, true); assert.equal(cmp.lies.length, 1);
    assert.equal(compareClaims([{speaker: asker, fact, says: fact, day: 1}], fact, fact).conflict, false);
    assert.equal(addClaim(m, {speaker: asker, fact, says: 'claim.only_passing', day: DAY}, DAY), m, 'same claim is not duplicated');
});

test('severity is relative to the holder, intent and context, and small slights add up then fade', () => {
    const e = {feeling: -2};
    const rung = r => severityOf(e, r).id;
    assert.equal(rung({wealth: 1}), 'serious'); assert.equal(rung({wealth: 10}), 'trivial', 'ten coins is trivial to a merchant');
    assert.equal(rung({wealth: 1, intent: 'accident'}), 'minor'); assert.ok(scaledSeverity(e, {publicly: true}) > scaledSeverity(e, {}));
    assert.ok(scaledSeverity(e, {friendBond: 5}) > scaledSeverity(e, {friendBond: 0}), 'a friend\'s harm is betrayal');
    assert.equal(rung({wealth: 1, provoked: true}), 'minor');
    const slights = [0, 1, 2, 3].map(i => ({kind: 'harmed', about: asker, fact: `fx1|respect|-1|x|t|${i}`, source: 'saw', certainty: 100, feeling: -1, day: DAY - i, count: 1}));
    assert.equal(lastStraw({rows: slights.slice(0, 1), subject: asker, day: DAY, relative: {}}).crossed, false);
    assert.equal(lastStraw({rows: slights, subject: asker, day: DAY, relative: {}}).crossed, true);
    assert.equal(lastStraw({rows: slights, subject: asker, day: DAY + 2000, relative: {}}).crossed, false, 'time pulls the sum back under');
});

test('loyalty grows with diminishing returns, is capped by opposed goals, and is a guess until tested', () => {
    const fav = (i, day = DAY - i) => ({kind: 'helped', about: asker, fact: `fx1|respect|2|x|t|${i}`, source: 'saw', certainty: 100, feeling: 2, day, count: 1});
    const L = rows => loyaltyOf({rows, subject: asker, day: DAY});
    const one = L([fav(0, DAY)]).value, two = L([fav(0, DAY), fav(1, DAY)]).value, five = L([0, 1, 2, 3, 4].map(i => fav(i, DAY))).value;
    assert.ok(two > one && two - one < one, 'second favour adds less than the first');
    assert.ok(five - two < 3 * (two - one) * 1.5);
    assert.equal(L([fav(0, DAY)]).tested, false); assert.equal(L([fav(0, DAY)]).shown, 'a guess');
    const kept = {...fav(9, DAY), kind: 'helped', fact: 'fx1|trust|4|kept_quiet|t|k', feeling: 4};
    const withKept = L([fav(0, DAY), kept]);
    assert.equal(withKept.tested, true); assert.equal(typeof withKept.shown, 'number'); assert.ok(withKept.value > two);
    const opposed = loyaltyOf({rows: [fav(0, DAY), kept], subject: asker, day: DAY, opposed: [{strength: 19.9}]});
    assert.ok(opposed.value <= 0.1 + 1e-9 && opposed.cap < withKept.cap, 'opposed goals cap loyalty');
    const betrayed = L([fav(0, DAY), kept, {kind: 'betrayed', about: asker, fact: 'fx1|trust|-4|broke_confidence|t|b', source: 'saw', certainty: 100, feeling: -4, day: DAY, count: 1}]);
    assert.ok(betrayed.value < withKept.value && betrayed.betrayed);
});

test('debt is felt, repaid by returning help, and sours when left', () => {
    const owed = [{kind: 'helped', about: asker, fact: 'fx1|respect|3|favour|t|d', source: 'saw', certainty: 100, feeling: 3, day: DAY - 70, count: 1}];
    const fresh = debtOf({rows: owed.map(e => ({...e, day: DAY})), holder: hold, subject: asker, day: DAY});
    assert.ok(fresh.owed > 0 && fresh.resentment === 0);
    const sour = debtOf({rows: owed, holder: hold, subject: asker, day: DAY - 10, temperament: temperamentFromTraits(['loyal'])});
    assert.ok(sour.resentment > 0, 'a debt left unpaid sours into resentment');
    const repaid = debtOf({rows: owed, theirRows: [{kind: 'helped', about: hold, fact: 'z', source: 'saw', certainty: 100, feeling: 9, day: DAY, count: 1}], holder: hold, subject: asker, day: DAY - 10});
    assert.equal(repaid.owed, 0); assert.equal(repaid.repaid, true);
});

const scene = (memory, root) => ({memory, root, day: DAY, listener: other, simulation: {seed: root, clock: DAY, causes: {}, people: {[hold]: {life: 'alive', location: 'V'}, [other]: {life: 'alive', location: 'V'}, },
    relationships: {[hold]: {[other]: {axes: {familiarity: 2}}, [asker]: {axes: {respect: -1}}}}}, actors: {[hold]: {worldId: 'w'}, [other]: {worldId: 'w'}}});
const verdict = (memory, root) => { const s = scene(memory, root), secret = readMemories(memory, hold, DAY).find(e => e.silence);
    return silenceCase({memory, secret, holder: hold, listener: other, day: DAY, root, baselineOf: (h, o) => s.simulation.relationships[h]?.[o]?.axes || {}}); };

test('the keep-or-break verdict is replayable, explained, and moves with bond, promise and bribe', () => {
    const asked = ask(base()), promised = ask(base(), true), paid = pay(ask(base(), true));
    const chance = m => verdict(m, 5).chance;
    assert.deepEqual(verdict(asked, 5), verdict(asked, 5));
    assert.ok(chance(promised) > chance(asked), 'a promise raises the chance');
    assert.ok(chance(paid) > chance(promised), 'a bribe raises it again');
    const v = verdict(paid, 5);
    assert.match(silenceExplanation(v), /likely to keep it quiet/); assert.match(silenceExplanation(v), /promise|paid|word/);
    // closeness to the one who would hear it pulls the other way
    const near = silenceVerdict({holder: hold, secret: 's', listener: other, day: DAY, root: 5, promised: true, bondListener: 8});
    assert.ok(near.chance < silenceVerdict({holder: hold, secret: 's', listener: other, day: DAY, root: 5, promised: true, bondListener: 0}).chance);
    // a reserved holder keeps more, a sociable one less
    const tel = t => silenceVerdict({holder: hold, secret: 's', listener: other, day: DAY, root: 5, telling: t}).chance;
    assert.ok(tel(0.1) > tel(1) && tel(1) > tel(1.5));
    // only the changed factor moves the keyed draw's address
    assert.equal(verdict(asked, 5).key, verdict(promised, 5).key);
});

test('gossip keeps or breaks a flagged secret for stated reasons and records the test for the asker', t => {
    const roots = Array.from({length: 60}, (_, i) => i + 1);
    const run = (memory, root) => gossipStep({memory, ...scene(memory, root)}).memory;
    const told = (m) => readMemories(m, other, DAY).some(e => e.source?.teller === hold && e.kind === 'harmed');
    const unflagged = roots.filter(r => told(run(base(), r)));
    assert.equal(unflagged.length, roots.length, 'an unflagged secret is told');
    const full = pay(ask(base(), true));
    const keptRoots = roots.filter(r => !told(run(full, r))), weak = ask(base());
    const brokenWeak = roots.filter(r => told(run(weak, r)));
    t.diagnostic(JSON.stringify([keptRoots.length, brokenWeak.length, verdict(full,5).factors, verdict(weak,5).chance, verdict(full,5).chance]));
    assert.ok(keptRoots.length / roots.length > (roots.length - brokenWeak.length) / roots.length, 'bribe+promise keeps more than a bare request');
    // outcomes write the test into the asker's memory
    const r1 = keptRoots[0], after = run(full, r1);
    assert.ok(readMemories(after, asker, DAY).some(e => e.kind === 'helped' && e.fact.includes('kept_quiet')));
    const r2 = brokenWeak[0], afterBreak = run(weak, r2);
    assert.ok(readMemories(afterBreak, asker, DAY).some(e => e.kind === 'betrayed' && e.fact.includes('broke_confidence')));
    assert.equal(readMemories(afterBreak, other, DAY).find(e => e.source?.teller === hold).silence.promised, false, 'a told secret is flagged for the listener without a promise');
    // same history, same outcome
    assert.deepEqual(run(full, r1), run(full, r1));
    assert.match(silenceLine({memory: full, holder: hold, subject: asker, listener: other, day: DAY, root: 5}), /^About \d+%/);
});

test('encoding is lossless and compact for flagged episodes', () => {
    const m = pay(ask(base(), true)), again = encodeMemory(decodeMemory(m, DAY), DAY, undefined, decodeClaims(m));
    assert.deepEqual(again, m);
});
