import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pinAddress, freshPins, readPin, setCheat, clearCheat, validate, migrate, isFresh, listPins, manifestDrift, registerManifest} from '../src/pin_store.js';
import {guRankAddress, deriveGuRankPrecursor} from '../src/gu_rank_pins.js';

const exceptions = JSON.parse(readFileSync(new URL('../docs/coverage/gu_rank_exceptions.json', import.meta.url))).exceptions;

test('a cheat pin returns its value and survives a JSON round trip of the slice', () => {
    const addr = pinAddress('test.space', 'thing', 3);
    const s = setCheat(freshPins(), addr, {rank: 4, tags: ['a']}, 'try');
    const back = migrate(validate(JSON.parse(JSON.stringify(s))));
    assert.deepEqual(readPin(back, addr).value, {rank: 4, tags: ['a']});
    assert.equal(readPin(back, addr).layer, 'cheat');
    assert.equal(isFresh(freshPins()), true);
    assert.equal(isFresh(s), false);
    assert.equal(readPin(clearCheat(back, addr), addr), null);
});
test('a canon exception holds its address and carries its reason; a cheat cannot take it', () => {
    const e = exceptions[0], addr = guRankAddress(e.id);
    const pin = readPin(freshPins(), addr);
    assert.equal(pin.kind, 'exception'); assert.equal(pin.value, e.canon); assert.match(pin.reason, /authored:/);
    assert.equal(pin.reasonStatus, 'class-only');
    assert.throws(() => setCheat(freshPins(), addr, 1), /canon pin holds/);
    assert.equal(listPins(freshPins()).filter(p => p.layer === 'manifest').length, exceptions.length);
});
test('gu.rank.precursor reads the pin before its rule and keeps the plain rule elsewhere', () => {
    const e = exceptions[0], read = addr => readPin(freshPins(), addr);
    const pinned = deriveGuRankPrecursor({id: e.id, inputRanks: [e.derived - 1]}, read);
    assert.equal(pinned.rank, e.canon); assert.equal(pinned.derived, e.derived); assert.equal(pinned.basis, 'pinned:exception'); assert.ok(pinned.reason);
    const plain = deriveGuRankPrecursor({id: 'candidate:not-an-exception', inputRanks: [2, 4]}, read);
    assert.deepEqual([plain.rank, plain.basis], [5, 'derived:precursor']);
    assert.equal(deriveGuRankPrecursor({id: 'candidate:x', inputRanks: []}, read).basis, 'abstain');
    const cheat = setCheat(freshPins(), guRankAddress('candidate:x'), 7);
    assert.equal(deriveGuRankPrecursor({id: 'candidate:x', inputRanks: [1]}, a => readPin(cheat, a)).basis, 'pinned:cheat');
});
test('bad slices and addresses are refused, newer schemas are not guessed at, drift is visible', () => {
    assert.throws(() => validate({schema: 1, revision: 0, cheats: {'not json': {value: 1, note: '', revision: 1}}, manifests: {}}), /Not a pin address/);
    assert.throws(() => migrate({schema: 2}), /newer game version/);
    assert.throws(() => setCheat(freshPins(), pinAddress('a.b', 'c'), undefined), /JSON/);
    const s = {...freshPins(), manifests: {'gu.rank.exceptions': 'old'}};
    assert.equal(manifestDrift(s)[0].saved, 'old');
    assert.throws(() => registerManifest('m', [{address: pinAddress('a', 'b'), value: 1, kind: 'exception', reason: '', reasonStatus: 'read'}]), /reason/);
});
