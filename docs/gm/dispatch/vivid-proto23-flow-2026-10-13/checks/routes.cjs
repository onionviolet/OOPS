// Reusable Playwright routes for the vivid-proto23 gate scripts.
// Every function takes a Playwright page. Fixtures live in ./fixtures.
const URL = process.env.URL || 'http://127.0.0.1:18251/';

const actions = p => p.locator('#location_actions_div');
const locName = p => p.locator('#location_name_span').innerText().then(t => t.trim()).catch(() => '');

async function waitLocation(p, name, timeout = 15000) {
  await p.waitForFunction(n => {
    const s = document.getElementById('location_name_span');
    return s && s.textContent.trim().startsWith(n);
  }, name, { timeout });
}

// PLAY, then confirm the hero creation panel if it appears (fresh origins only).
async function startFresh(p) {
  await p.locator('#loading_screen_play_button:not(.none_display)').click({ timeout: 15000 });
  const confirm = p.locator('#hero_creation_panel_confirmation');
  const village = p.locator('#location_actions_div .location_choice_dropdown').first();
  await Promise.race([
    confirm.waitFor({ state: 'visible', timeout: 15000 }),
    village.waitFor({ state: 'visible', timeout: 15000 }),
  ]);
  if (await confirm.isVisible().catch(() => false)) await confirm.click();
  await village.waitFor({ state: 'visible', timeout: 15000 });
}

// Village elder: hello -> "What happened?" -> "I think I should go there" -> "But I want to leave".
// The last line ("need to") unlocks Infested field travel. No combat is entered.
async function unlockCombatRoute(p) {
  const a = actions(p);
  await a.getByText('Talk to someone', { exact: false }).first().click();
  await a.getByText('Talk to village elder', { exact: false }).first().click();
  for (const key of ['hello', 'what happened', 'ask to leave 1', 'need to']) {
    const line = a.locator(`.dialogue_textline[data-textline="${key}"]`);
    await line.waitFor({ state: 'visible' });
    await line.click();
    await line.waitFor({ state: 'detached' }); // each of these lines locks itself after use
  }
  await a.locator('.end_dialogue_button').click();
  await a.getByText('Move somewhere else', { exact: false }).first().waitFor({ state: 'visible' });
}

// Travel to Infested field and wait until enemy HP changes (fight is actually ticking).
async function enterCombat(p, { fightMs = 0 } = {}) {
  const a = actions(p);
  await a.getByText('Move somewhere else', { exact: false }).first().click();
  await a.locator('.action_travel[data-travel="Infested field"]').click();
  await waitLocation(p, 'Infested field');
  const cd = p.locator('#combat_div');
  await cd.waitFor({ state: 'visible' });
  await cd.getByText(/\d+\/\d+ hp/).first().waitFor({ state: 'visible' });
  const before = await cd.innerText();
  await p.waitForFunction(b => {
    const t = document.getElementById('combat_div').innerText;
    return t !== b;
  }, before, { timeout: 20000 });
  if (fightMs) await p.waitForTimeout(fightMs);
}

// Return to the Village. If the hero died and was already sent back, this is a no-op.
async function leaveCombat(p) {
  if ((await locName(p)).startsWith('Village')) return;
  await actions(p).locator('.action_travel[data-travel="Village"]').click();
  await waitLocation(p, 'Village');
  await actions(p).getByText('Talk to someone', { exact: false }).first().waitFor({ state: 'visible' });
}

async function saveText(p) {
  await p.evaluate(() => localStorage.removeItem('save data'));
  await p.locator('#save_button').click();
  await p.waitForFunction(() => !!localStorage.getItem('save data'), null, { timeout: 10000 });
  return p.evaluate(() => localStorage.getItem('save data'));
}

module.exports = { URL, startFresh, unlockCombatRoute, enterCombat, leaveCombat, saveText, waitLocation };
