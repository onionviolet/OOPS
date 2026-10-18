// Reusable Playwright routes for the crafting-screen gate. Every function takes a Playwright page.
// Re-exports the vivid-proto23 routes (startFresh, saveText, ...). URL defaults to port 18291.
process.env.URL = process.env.URL || 'http://127.0.0.1:18291/';
const V = require('../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const fs = require('fs'), path = require('path');
const FX = path.join(__dirname, 'fixtures');
const actions = p => p.locator('#location_actions_div');

const readFixture = name => fs.readFileSync(path.join(FX, name), 'utf8');

// Seed localStorage with a save (and optional extra keys) before the game loads, then PLAY.
async function loadSave(p, saveText, storage = {}) {
  await p.goto(V.URL + 'style.css');
  await p.evaluate(([s, st]) => { localStorage.clear(); localStorage.setItem('save data', s); for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); }, [saveText, storage]);
  await p.goto(V.URL, {waitUntil: 'domcontentloaded'});
  await V.startFresh(p);
}

// Click a sequence of dialogue lines with one NPC (by visible NPC label), then end the dialogue.
async function talk(p, npcLabel, keys) {
  const a = actions(p);
  await a.getByText('Talk to someone', {exact: false}).first().click();
  await a.getByText(npcLabel, {exact: false}).first().click();
  for (const key of keys) {
    const line = a.locator(`.dialogue_textline[data-textline="${key}"]`);
    await line.waitFor({state: 'visible'});
    await line.click();
  }
  await a.locator('.end_dialogue_button').click();
  await a.getByText('Talk to someone', {exact: false}).first().waitFor({state: 'visible'});
}

// From a save where the elder's "cleared field" line is available: elder -> craftsman hello -> learn.
// The craftsman's "learn" reward sets is_crafting_unlocked/is_gathering_unlocked and gives the four Old tools.
async function learnCrafting(p) {
  await talk(p, 'Talk to village elder', ['cleared field']);
  await talk(p, 'Talk to old craftsman', ['hello', 'learn']);
  await p.locator('.choice_craft').first().waitFor({state: 'visible'});
}

// Opens the crafting view from the Village actions. Optionally switch category ('butchering', 'crafting', ...).
async function openCrafting(p, category = null) {
  await p.locator('.choice_craft').first().click();
  await p.locator('#crafting_window').waitFor({state: 'visible'});
  if (category) await p.locator(`.crafting_mainpage_button[data-crafting_category="${category}"]`).click();
  await p.locator('.crafting_recipe_list:visible .recipe_div').first().waitFor({state: 'visible'});
}

// Visible page (category+subcategory) of the open crafting view.
const recipePage = p => p.locator('.crafting_recipe_list:visible');

// Select (today: hover, which reveals the hover tooltip; items recipes have no other selection)
// a recipe row by recipe id or name. Does NOT craft: items rows craft on click of the name span.
async function selectRecipe(p, name) {
  const row = recipePage(p).locator(`.recipe_div[data-recipe_id="${name}"]`).or(recipePage(p).locator('.recipe_div', {hasText: name})).first();
  await row.scrollIntoViewIfNeeded();
  await row.hover();
  return row;
}

// Crafts one item from an items-subpage recipe (current native control: click the name span).
async function craftOnce(p, name) {
  const row = await selectRecipe(p, name);
  await row.locator('.recipe_item_name').click();
  return row;
}

async function closeCrafting(p) {
  await p.locator('#exit_crafting_button').click();
  await p.locator('#crafting_window').waitFor({state: 'hidden'});
}

module.exports = {...V, readFixture, loadSave, talk, learnCrafting, openCrafting, recipePage, selectRecipe, craftOnce, closeCrafting, FX};
