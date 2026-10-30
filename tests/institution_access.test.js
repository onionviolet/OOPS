import test from 'node:test';
import assert from 'node:assert/strict';
import {defineGrant, accessStatus} from '../src/institution_access.js';
const grant = () => defineGrant({id: 'g', issuer: 'Ilsa', subject: 'player', label: 'Guest pass', issuedAt: 100, expiresAt: 1540, warnWithin: 1440,
    scope: [{id: 'library', label: 'Guest library'}], notScope: ['First-circle badge']});
test('an open grant lists what it opens and what it never did', () => {
    const s = accessStatus(grant(), 200);
    assert.equal(s.state, 'expiring'); assert.deepEqual(s.opens.map(x => x.id), ['library']); assert.deepEqual(s.closed, ['First-circle badge']);
});
test('after expiry or suspension everything closes and personal skill is untouched', () => {
    const skill = [{id: 'operator', label: 'Lamp operator', mastery: 1}];
    for(const g of [grant(), defineGrant({...grant(), expiresAt: null, suspendedAt: 150})]) {
        const s = accessStatus(g, 1600, skill);
        assert.ok(['expired', 'suspended'].includes(s.state)); assert.deepEqual(s.opens, []);
        assert.ok(s.closed.includes('Guest library')); assert.deepEqual(s.retained, skill);
    }
});
test('malformed grants refuse', () => {
    assert.throws(() => defineGrant({id: 'g', issuer: 'I', subject: 's', label: 'x', issuedAt: 1, scope: []}));
    assert.throws(() => defineGrant({id: 'g', issuer: 'I', subject: 's', label: 'x', issuedAt: -1, scope: [{id: 'a', label: 'a'}]}));
});
