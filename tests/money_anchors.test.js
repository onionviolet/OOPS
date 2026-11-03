import test from 'node:test';
import assert from 'node:assert/strict';
import {anchors, toNumber} from '../scripts/lead_run/money_anchors.mjs';

const pay = t => `## v1 ch9 T\nP001 ${t}\n`;
test('digits and spelled numbers convert to pence', () => {
  assert.equal(toNumber('twenty-five'), 25);
  assert.equal(anchors(pay('He paid five soli six pence for it.'))[0].totalPence, 66);
  assert.equal(anchors(pay('It cost 2 pounds.'))[0].totalPence, 480);
  // Known limit: "a pound" without a number is not parsed, so such paragraphs under-count; check the paragraph.
});
test('a conversion statement is flagged, not summed', () => {
  const a = anchors(pay('One pound equals twenty soli, and one soli equals twelve pence, as everyone knew.'));
  assert.equal(a.length, 1); assert.equal(a[0].rate, true); assert.equal(a[0].totalPence, null);
});
test('paragraphs without money are skipped and no text is stored', () => {
  assert.deepEqual(anchors(pay('Nothing here about coin.')), []);
  assert.ok(!JSON.stringify(anchors(pay('He paid five soli.'))).includes('He paid'));
});
