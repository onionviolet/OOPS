import test from 'node:test';
import assert from 'node:assert/strict';
import {LOTM_DIVINATION_ROWS, LOTM_DIVINATION_FACTS} from '../src/lotm_divination_rows.js';
import {LOTM_SUMMONS_ROWS, LOTM_SUMMONS_FACTS} from '../src/lotm_summons_rows.js';
import {LOTM_AID_PREPARATIONS, LOTM_POTION_RULES, LOTM_POTION_RULE_FACTS} from '../src/lotm_potion_rule_rows.js';
import {LOTM_CRAFT_ROWS, LOTM_CRAFT_FACTS} from '../src/lotm_craft_rows.js';
import {LOTM_RITE_ROWS, LOTM_RITE_FACTS} from '../src/lotm_rite_rows.js';

// The rite, summons, potion, craft and divination row files share one wiring seam, so their ids and host fact names must not collide.
const files = {
  divination: LOTM_DIVINATION_ROWS.queries,
  summons: LOTM_SUMMONS_ROWS.rows,
  aids: LOTM_AID_PREPARATIONS.rows,
  potionRules: LOTM_POTION_RULES.rows,
  crafts: LOTM_CRAFT_ROWS.rows,
  rites: LOTM_RITE_ROWS.rows,
};
const locator = /^zh (?:b[2-8] )?第\d+章 p\d+$/;

test('row ids are unique across every L4 row file', () => {
  const all = Object.values(files).flat().map(row => row.id);
  assert.equal(new Set(all).size, all.length);
});

test('host fact names are well formed and each belongs to one namespace', () => {
  const facts = [...LOTM_DIVINATION_FACTS, ...LOTM_SUMMONS_FACTS, ...LOTM_POTION_RULE_FACTS, ...LOTM_CRAFT_FACTS, ...LOTM_RITE_FACTS];
  for (const fact of facts) assert.match(fact, /^actor\.lotm\.(div|summon|potion|craft|rite)\.[a-z0-9.-]+$/, fact);
  for (const [name, list] of [['div', LOTM_DIVINATION_FACTS], ['summon', LOTM_SUMMONS_FACTS], ['potion', LOTM_POTION_RULE_FACTS], ['craft', LOTM_CRAFT_FACTS], ['rite', LOTM_RITE_FACTS]])
    for (const fact of list) assert.ok(fact.startsWith(`actor.lotm.${name}.`), `${fact} sits in the ${name} namespace`);
});

test('every row carries only source-index locators, at most one volume prefix form', () => {
  for (const [name, rows] of Object.entries(files))
    for (const row of rows) for (const l of row.locators ?? [row.locator]) assert.match(l, locator, `${name}:${row.id}`);
});
