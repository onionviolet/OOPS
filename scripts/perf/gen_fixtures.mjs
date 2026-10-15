// Regenerates the committed synthetic perf fixtures in tests/fixtures/perf/.
// Never reads a personal save: every fixture starts from a fresh origin.
//   fresh   - new game after PLAY, saved once.
//   mid     - fresh + native elder greeting and the systems workshop opening
//             (quest, commission, claim, method, lease, upgrade, teaching) through real buttons.
//   crowded - mid + engine APIs in Node: 64 hired route helpers run and collected,
//             512 settled history claims, every ordinary material template in
//             the inventory (the old engine_profile.cjs "crowded" workload).
// Usage: node scripts/perf/gen_fixtures.mjs   (builds the working tree into a temp dir)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {ROOT, FIXTURE_DIR, prepareTree, build, serve, launchChrome, openGame} from './lib.mjs';

const SW = 'systems_workshop';
// Fixed values so regenerating from the same source gives the same bytes where the game allows.
// last_rewarded_export is wall-clock: 0 pins the export reward to "available" so the
// page's work does not change hours after generation.
const normalize = save => { save.saved_at = '2026-10-14 00:00:00'; save.total_playtime = 0; save.last_rewarded_export = 0; return save; };

async function browserFixtures(url) {
  const browser = await launchChrome();
  try {
    let {context, page, errors} = await openGame(browser, url, null);
    const save = async () => { await page.evaluate(() => window.saveProgress()); return page.evaluate(() => JSON.parse(localStorage.getItem('save data'))); };
    const fresh = await save();
    // Native elder greeting, as in scripts/systems_workshop_browser.cjs.
    await page.getByText('Talk to someone', {exact: false}).click({noWaitAfter: true});
    await page.locator('[data-dialogue="villageElder"]').click({noWaitAfter: true});
    await page.locator('[data-textline="hello"]').click({noWaitAfter: true});
    for (const id of ['what happened', 'ask to leave 1', 'need to']) await page.locator(`[data-textline="${id}"]`).click({noWaitAfter: true});
    await page.locator('.end_dialogue_button').click({noWaitAfter: true});
    const panel = page.locator('#systems_workshop_panel');
    await panel.waitFor({state: 'attached'});
    if (await panel.isVisible() && !await panel.evaluate(n => n.open)) await page.locator('#systems_workshop_panel > summary').click({noWaitAfter: true});
    // The systems_workshop_browser.cjs SYS-R01 opening, without its assertions or reloads.
    for (const id of ['enroll', 'join', 'accept', 'work', 'buy_log', 'commission_craft', 'claim', 'learn', 'lease', 'buy_log', 'assist_pack', 'upgrade', 'upgrade_use', 'teach', 'ask_ren']) {
      const button = page.locator(`[data-systems="${id === 'enroll' ? id : SW + '.' + id}"]`);
      await button.waitFor({state: 'visible'});
      await page.waitForFunction(el => !el.disabled, await button.elementHandle());
      await button.click({noWaitAfter: true});
      await page.waitForFunction(() => { const s = JSON.parse(localStorage.getItem('save data')); return !s.expansion.simulation?.jobs.some(j => j.actorId === 'player' && j.commandId.startsWith('systems_workshop.')); }, null, {polling: 250, timeout: 120000});
    }
    const mid = await save();
    assert.deepEqual(errors, []);
    await context.close();
    return {fresh, mid};
  } finally { await browser.close(); }
}

async function crowdedFrom(mid) {
  const engine = await import(path.join(ROOT, 'src/expansion_engine.js'));
  const simulation = await import(path.join(ROOT, 'src/simulation.js'));
  const {expeditionRegistry: registry} = await import(path.join(ROOT, 'src/expedition_content.js'));
  const crowded = structuredClone(mid);
  const wood = JSON.stringify({id: 'Rough wood log'}), kit = JSON.stringify({id: 'Prepared survey kit'});
  let p = {state: crowded.expansion, external: {money: 1000}, gameplay: {player: {inventory: {[wood]: 1000}, skills: {}, reputation: {}}}};
  // Fixture-only qualification grant, as engine_profile.cjs always did.
  p.state.simulation.knowledge.player.workbench = {stage: 'understood', value: 'Generated benchmark qualification', at: p.state.clock, cause: 'fixture:qualification'};
  const ctx = () => ({actorId: 'player', external: p.external, gameplay: p.gameplay, facts: {location: 'Village', 'village.craftsmanMet': true},
    vitals: {player: {health: 60, max_health: 60, stamina: 40, max_stamina: 40}}});
  for (let i = 0; i < 64; i++) p = simulation.commitSimulationCommand(p.state, registry, {id: 'village.hire_helper'}, ctx());
  p = engine.advanceSimulation(p.state, registry, 12, p.external, p.gameplay, {player: ctx()});
  const helpers = Object.entries(p.state.simulation.people).filter(([, v]) => v.definitionId === 'village.route_helper').map(([id]) => id);
  assert.equal(helpers.length, 64);
  assert.ok(helpers.every(id => p.state.simulation.owners[id][kit] === 1));
  for (const id of helpers) p = simulation.commitSimulationCommand(p.state, registry, {id: 'village.collect_helper'}, {...ctx(), targetId: id});
  for (let i = 0; i < 512; i++) {
    const cause = 'fixture:history:' + i;
    p.state.simulation.causes[cause] = p.state.clock;
    p.state.simulation.claims['fixture.history_' + i] = {owner: 'player', status: 'settled', cause};
  }
  engine.validateExpansionState(p.state, registry);
  crowded.expansion = p.state;
  crowded.character.money = p.external.money;
  // Keep the envelope's native inventory and add the engine's player inventory on top.
  const inv = crowded.inventories.person.main_character;
  for (const [k, count] of Object.entries(p.gameplay.player.inventory)) inv[k] = {...(inv[k] || {}), count};
  // Only registered ordinary template IDs; no equipment/components are guessed.
  const materialIds = [...fs.readFileSync(path.join(ROOT, 'src/items.js'), 'utf8').matchAll(/item_templates\["([^"]+)"\]\s*=\s*new (?:Material|OtherItem|UsableItem)\(/g)].map(m => m[1]);
  for (const id of materialIds) inv[JSON.stringify({id})] ||= {count: 1};
  return crowded;
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-perf-fixtures-'));
const server = await serve(prepareTree('WORKTREE', path.join(dir, 'tree')));
try {
  await build(path.join(dir, 'tree'));
  const {fresh, mid} = await browserFixtures(server.url);
  const crowded = await crowdedFrom(mid);
  fs.mkdirSync(FIXTURE_DIR, {recursive: true});
  const sizes = {};
  for (const [name, save] of Object.entries({fresh, mid, crowded})) {
    const text = JSON.stringify(normalize(save));
    fs.writeFileSync(path.join(FIXTURE_DIR, name + '.json'), text);
    sizes[name] = {bytes: Buffer.byteLength(text), clock: save.expansion?.clock ?? null, actors: Object.keys(save.expansion?.actors || {}).length};
  }
  console.log(JSON.stringify(sizes, null, 1));
} finally {
  await server.close();
  fs.rmSync(dir, {recursive: true, force: true});
}
