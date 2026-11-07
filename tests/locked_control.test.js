import test from 'node:test';
import assert from 'node:assert/strict';
import {setLocked, lockReason} from '../src/locked_control.js';

// Fake button: only what setLocked and lockReason touch.
const fake = () => { const attrs = new Map(), listeners = {}; return {dataset: {}, getAttribute: k => attrs.has(k) ? attrs.get(k) : null, setAttribute: (k, v) => attrs.set(k, String(v)), hasAttribute: k => attrs.has(k), removeAttribute: k => attrs.delete(k), addEventListener: (k, f) => { listeners[k] = f; }}; };

test('a locked control keeps its reason and unlocks cleanly (UIV1)', () => {
  const b = fake();
  setLocked(b, 'You are already at the latest message.');
  assert.equal(b.getAttribute('aria-disabled'), 'true');
  assert.equal(lockReason(b), 'You are already at the latest message.');
  setLocked(b, '');
  assert.equal(lockReason(b), '');
  assert.equal(b.hasAttribute('aria-disabled'), false);
});
