import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PERSPECTIVE_CONTROLS} from '../src/perspective_controls.js';

const read = path => readFile(new URL(path, import.meta.url), 'utf8');

test('perspective control inventory covers shell routes and LOTM block families', async () => {
  const rows = PERSPECTIVE_CONTROLS;
  const ids = rows.map(row => row.id);
  assert.equal(new Set(ids).size, ids.length, 'control ids are unique');
  for (const row of rows) {
    assert.ok(['menu', 'panel-block', 'header-line', 'report-kind', 'pane'].includes(row.kind), `${row.id} has a known kind`);
    assert.ok(['in-world', 'system', 'crossing', 'other-seat'].includes(row.tag), `${row.id} has a known perspective`);
    assert.ok(row.anchor && row.basis, `${row.id} names its anchor and basis`);
  }

  const navigation = await read('../src/layout_spec.js');
  const routeIds = [...navigation.matchAll(/\{id:\s*'([^']+)',\s*label:/g)].map(match => match[1]);
  for (const route of routeIds) assert.ok(rows.some(row => row.anchor === `[data-route-id="${route}"]`), `navigation route ${route} is tagged`);

  const panel = await read('../src/book_world_lotm_ui.js');
  const families = new Set([...panel.matchAll(/dataset\.(lotm[A-Z]\w*)/g)].map(match => match[1].replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '')));
  for (const family of families) assert.ok(rows.some(row => row.anchor === `[data-${family}]`), `LOTM data family data-${family} is tagged`);
  for (const family of ['topic-person', 'topic', 'journeys', 'inferences']) {
    assert.equal(rows.find(row => row.anchor === `[data-lotm-${family}]`)?.tag, 'in-world', `${family} belongs to this life`);
  }
  assert.ok(rows.some(row => row.anchor === '[data-lotm]'), 'dynamic LOTM command controls are tagged');
});
