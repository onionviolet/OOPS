import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const baseUrl = 'http://127.0.0.1:18721/';
const candidate = '/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r1';
const evidenceDir = '/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r1/natural-prerequisite';
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const now = new Date().toISOString();
const transcript = [];
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const shaFile = file => digest(fs.readFileSync(file));

function record(step, data = {}) {
  const row = { at: new Date().toISOString(), step, ...data };
  transcript.push(row);
  console.log(JSON.stringify(row));
}

async function hashResponse(response) {
  return { status: response.status(), sha256: digest(await response.body()) };
}

const sourceHashes = Object.fromEntries(['src/data/dialogues.js', 'src/data/locations.js', 'src/items.js', 'src/main.js', 'index.html', 'dist/bundle.js'].map(file => [file, shaFile(path.join(candidate, file))]));
const responseHashes = {};
const responseHashTasks = [];
const errors = [];
const browser = await chromium.launch({ headless: true, executablePath: chromePath });
let page;
let lastCheckpoint = 'launch';
let saveCheckpoint = async () => {};
try {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.origin === 'http://127.0.0.1:18721' && (url.pathname === '/' || url.pathname === '/dist/bundle.js')) {
      responseHashTasks.push(hashResponse(response).then(hash => { responseHashes[url.pathname] = hash; }).catch(error => errors.push(`response hash ${url.pathname}: ${error}`)));
    }
  });
  await page.clock.install();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.readyState === 'complete');
  saveCheckpoint = async label => {
    lastCheckpoint = label;
    const entries = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
    const file = path.join(evidenceDir, `earned-state-${label}.json`);
    fs.writeFileSync(file, JSON.stringify({ label, at: new Date().toISOString(), url: page.url(), localStorage: entries }, null, 2) + '\n');
    record('earned-state-checkpoint', { label, file: path.basename(file), keys: Object.keys(entries) });
  };
  await page.screenshot({ path: path.join(evidenceDir, '00-fresh-start.png'), fullPage: true });
  record('fresh-disposable-origin', {
    url: page.url(),
    title: await page.title(),
    freshLocalStorage: await page.evaluate(() => Object.keys(localStorage)),
    setSpeedHook: await page.evaluate(() => typeof window.set_speed),
    clock: 'Playwright page.clock installed before app load; later runFor advances registered browser timers in bounded increments',
  });

  await page.getByText('PLAY', { exact: true }).click();
  await page.locator('#hero_creation_name_field').fill('R1 Natural');
  await page.getByText('Confirm', { exact: true }).click();
  await page.screenshot({ path: path.join(evidenceDir, '01-new-hero.png'), fullPage: true });
  record('hero-created', { name: 'R1 Natural', route: 'native PLAY and hero creation controls' });

  await page.locator('.location_choice_dropdown.choice_dialogue').click();
  await page.locator('.start_dialogue[data-dialogue="villageElder"]').click();
  for (const id of ['hello', 'what happened', 'ask to leave 1', 'need to', 'starting gear', 'axe']) {
    const line = page.locator(`.dialogue_textline[data-textline="${id}"]`);
    if (!(await line.count())) throw new Error(`Native elder route did not offer dialogue textline ${id}.`);
    const shown = await line.innerText();
    await line.click();
    record('elder-textline', { id, displayedText: shown });
  }

  const sword = page.locator('.character_item_control').filter({ has: page.locator('.item_name').filter({ hasText: /^Cheap iron axe$/ }) });
  if (!(await sword.count())) throw new Error('The elder axe was not present in the native inventory.');
  await sword.locator('.equip_item_button').click();
  record('starting-weapon-equipped', { item: 'Cheap iron axe', selector: '.character_item_control .item_name + .equip_item_button' });

  if (await page.locator('.end_dialogue_button').count()) await page.locator('.end_dialogue_button').click();
  const enterField = page.locator('.location_choice_dropdown.choice_travel');
  if (!(await enterField.count())) throw new Error('Village travel menu is unavailable.');
  await enterField.first().click();
  const fieldRoute = page.locator('.travel_combat.action_travel[data-travel="Infested field"]').first();
  if (!(await fieldRoute.count())) throw new Error('Native Infested field route is unavailable.');
  await fieldRoute.click();
  record('entered-field', { routeText: await fieldRoute.innerText().catch(() => 'Enter Infested field'), expectedGroupCount: 15 });
  await page.screenshot({ path: path.join(evidenceDir, '02-infested-field.png'), fullPage: true });

  const readCombat = async () => {
    const body = await page.locator('body').innerText();
    const hp = body.match(/(\d+)\/(\d+) hp/);
    const groups = body.match(/Enemy groups left:\s*(\d+)\s*\/\s*(\d+)/i);
    const clears = body.match(/Clears:\s*\[(\d+)\]/i);
    const location = await page.locator('#location_name_span').innerText().catch(() => null);
    return { body, hp: hp ? { current: Number(hp[1]), max: Number(hp[2]) } : null, groupsLeft: groups ? Number(groups[1]) : null, groupTotal: groups ? Number(groups[2]) : null, clears: clears ? Number(clears[1]) : null, location, inCombat: body.includes('Combat in progress') };
  };
  let finished = false;
  let chunks = 0;
  let lastSummary = '';
  while (!finished && chunks < 300) {
    chunks++;
    let state = await readCombat();
    if (state.inCombat && state.clears >= 1) {
      record('field-first-clear', { groupsRemainingAtNextEncounter: state.groupsLeft, hp: state.hp, clears: state.clears, note: 'Fifteenth native group produced the first clear; stopped the next encounter before a sixteenth group.' });
      await page.screenshot({ path: path.join(evidenceDir, '03-field-first-clear.png'), fullPage: true });
      finished = true;
      break;
    }
    if (state.inCombat && state.hp && state.hp.current <= 32) {
      const returnRoute = page.locator('.travel_normal.action_travel[data-travel="Village"]');
      if (!(await returnRoute.count())) throw new Error('The native return-to-Village route was unavailable during combat.');
      const before = state;
      await returnRoute.click();
      const after = await readCombat();
      record('retreated-to-rest', { before: { hp: before.hp, groupsLeft: before.groupsLeft, clears: before.clears }, afterLocation: after.location, cumulativeGroupsKilled: before.clears * 15 + (15 - before.groupsLeft) });
      await page.screenshot({ path: path.join(evidenceDir, `field-retreat-${chunks}.png`), fullPage: true });
      let rested = false;
      for (let restChunk = 0; restChunk < 30; restChunk++) {
        await page.clock.runFor(10000);
        const afterRest = await readCombat();
        if (afterRest.hp && afterRest.hp.current >= afterRest.hp.max - 1) { rested = true; record('village-rested', { hp: afterRest.hp, virtualTimerAdvanceMs: (restChunk + 1) * 10000 }); break; }
      }
      if (!rested) throw new Error('Native Village rest did not restore the hero before timeout.');
      await page.locator('.location_choice_dropdown.choice_travel').first().click();
      const nextField = page.locator('.travel_combat.action_travel[data-travel="Infested field"]').first();
      if (!(await nextField.count())) throw new Error('Infested field could not be re-entered after natural rest.');
      await nextField.click();
      record('returned-to-field', { routeText: await nextField.innerText().catch(() => 'Enter Infested field') });
      state = await readCombat();
    } else {
      await page.clock.runFor(30000);
      state = await readCombat();
      const summary = JSON.stringify({ location: state.location, hp: state.hp, groupsLeft: state.groupsLeft, clears: state.clears, inCombat: state.inCombat });
      if (summary !== lastSummary) {
        record('field-progress', { ...JSON.parse(summary), virtualTimersRunForMs: chunks * 30000 });
        lastSummary = summary;
      }
      if (!state.inCombat && state.location === 'Village' && state.clears === null) {
        // A natural defeat also returns to Village. Combat-group counters remain on the native location.
        const text = state.body;
        if (text.includes('lost consciousness')) record('native-unconsciousness', { hp: state.hp, note: 'Native recovery route returned the hero to Village.' });
        await page.clock.runFor(30000);
        const recovered = await readCombat();
        record('village-rest-after-return', { hp: recovered.hp });
        await page.locator('.location_choice_dropdown.choice_travel').first().click();
        const nextField = page.locator('.travel_combat.action_travel[data-travel="Infested field"]').first();
        if (!(await nextField.count())) throw new Error('The field route disappeared before first clear.');
        await nextField.click();
        record('re-entered-field-after-return', { routeText: await nextField.innerText().catch(() => 'Enter Infested field') });
      }
    }
  }
  if (!finished) throw new Error(`Field was not cleared within ${chunks} bounded timer advances.`);

  const postClear = await readCombat();
  if (postClear.location !== 'Infested field') throw new Error(`Expected to be at Infested field after its first clear, saw ${postClear.location}.`);
  const returnRoute = page.locator('.travel_normal.action_travel[data-travel="Village"]');
  if (await returnRoute.count()) await returnRoute.click();
  record('returned-to-village-after-clear', { location: (await readCombat()).location });

  await page.locator('.location_choice_dropdown.choice_dialogue').click();
  await page.locator('.start_dialogue[data-dialogue="villageElder"]').click();
  const cleared = page.locator('.dialogue_textline[data-textline="cleared field"]');
  const clearedAlt = page.locator('.dialogue_textline[data-textline="cleared field alt"]');
  const clearLine = await cleared.count() ? cleared : clearedAlt;
  if (!(await clearLine.count())) throw new Error('Elder cleared-field report did not unlock from the native clear.');
  const clearId = await clearLine.getAttribute('data-textline');
  const clearText = await clearLine.innerText();
  await clearLine.click();
  record('elder-cleared-field', { id: clearId, displayedText: clearText });
  await saveCheckpoint('field-cleared');
  await page.screenshot({ path: path.join(evidenceDir, '04-elder-cleared-field.png'), fullPage: true });
  if (await page.locator('.end_dialogue_button').count()) await page.locator('.end_dialogue_button').click();
  const dialogueMenu = page.locator('.location_choice_dropdown.choice_dialogue');
  if (await dialogueMenu.count()) await dialogueMenu.click();
  const craftsman = page.locator('.start_dialogue[data-dialogue="oldCraftsman"]');
  if (!(await craftsman.count())) throw new Error('The native old-craftsman dialogue did not unlock.');
  await craftsman.click();
  for (const id of ['hello', 'learn']) {
    const line = page.locator(`.dialogue_textline[data-textline="${id}"]`);
    if (!(await line.count())) throw new Error(`Craftsman route did not offer ${id}.`);
    const shown = await line.innerText();
    await line.click();
    record('craftsman-textline', { id, displayedText: shown });
  }
  await saveCheckpoint('craftsman-tools-earned');
  if (await page.locator('.end_dialogue_button').count()) await page.locator('.end_dialogue_button').click();
  await page.screenshot({ path: path.join(evidenceDir, '05-craftsman-tools.png'), fullPage: true });

  const toolsTab = page.getByText('Tools', { exact: true });
  if (await toolsTab.count()) await toolsTab.first().click();
  const oldAxe = page.locator('.character_item_control').filter({ has: page.locator('.item_name').filter({ hasText: /^Old axe$/ }) });
  if (!(await oldAxe.count())) throw new Error('Craftsman did not provide an actual Old axe.');
  await oldAxe.locator('.equip_item_button').click();
  record('old-axe-equipped', { item: 'Old axe', control: await oldAxe.getAttribute('data-character').catch(() => null) });

  const gatheringMenu = page.locator('.location_choice_dropdown.choice_gather');
  if (!(await gatheringMenu.count())) throw new Error('Native Gather resources menu did not unlock from the craftsman.');
  await gatheringMenu.click();
  const woodcut = page.locator('.start_activity[data-activity="woodcutting"], .location_choice[data-activity="woodcutting"]');
  if (!(await woodcut.count())) throw new Error('Native Village woodcutting action was not available with the equipped Old axe.');
  await woodcut.first().click();
  record('started-woodcutting', { action: 'Gather wood on the outskirts', axeEquipped: true });
  await page.screenshot({ path: path.join(evidenceDir, '06-woodcutting-started.png'), fullPage: true });

  const logCount = async () => {
    const name = page.locator('.character_item_control .item_name').filter({ hasText: /^Rough wood log$/ });
    if (!(await name.count())) return 0;
    const control = name.first().locator('xpath=ancestor::div[contains(@class,"character_item_control")]');
    return Number(await control.getAttribute('data-item_count') || 1);
  };
  let logs = await logCount();
  let woodChunks = 0;
  while (logs < 3 && woodChunks < 360) {
    woodChunks++;
    await page.clock.runFor(10000);
    logs = await logCount();
    if (woodChunks % 3 === 0 || logs >= 3) {
      const body = await page.locator('body').innerText();
      record('woodcutting-progress', { logs, hpText: body.match(/\d+\/\d+ hp/)?.[0] || null, virtualTimersRunForMs: woodChunks * 10000, activity: await page.locator('#action_status_div').innerText().catch(() => null) });
    }
  }
  if (logs < 3) throw new Error(`Woodcutting produced only ${logs} Rough wood logs within ${woodChunks} timer advances.`);
  if (await page.locator('#action_end_div').count()) await page.locator('#action_end_div').click();
  await saveCheckpoint('three-logs');
  const stoppedBody = await page.locator('body').innerText();
  record('woodcutting-stopped', { roughWoodLogs: logs, noWorkRunning: stoppedBody.includes('No work running.') });
  await page.screenshot({ path: path.join(evidenceDir, '07-two-logs-work-stopped.png'), fullPage: true });

  const savedClick = page.locator('#save_button');
  await savedClick.click();
  await page.waitForTimeout(150);
  record('manual-save', { button: '#save_button', statusText: (await page.locator('body').innerText()).match(/Saving available\.|Saving unavailable\./)?.[0] || null });
  const downloadWait = page.waitForEvent('download');
  await page.locator('#save_to_file_button').click();
  const download = await downloadWait;
  const exportedFile = path.join(evidenceDir, 'natural-prerequisite-save.txt');
  await download.saveAs(exportedFile);
  const finalState = await readCombat();
  const oldAxeVisible = await page.locator('.equipment_slot_div').evaluateAll(xs => xs.some(x => x.innerText.includes('Old axe'))).catch(() => false);
  record('exported-native-save', {
    suggestedFilename: download.suggestedFilename(),
    file: path.basename(exportedFile),
    sha256: shaFile(exportedFile),
    bytes: fs.statSync(exportedFile).size,
    location: finalState.location,
    hp: finalState.hp,
    activeCombat: finalState.inCombat,
    noWorkRunning: (await page.locator('body').innerText()).includes('No work running.'),
    roughWoodLogs: await logCount(),
    oldAxeEquipped: oldAxeVisible,
  });
  await page.screenshot({ path: path.join(evidenceDir, '08-final-save-exported.png'), fullPage: true });

  const bundleResponse = responseHashes['/dist/bundle.js'];
  const indexResponse = responseHashes['/'];
  await Promise.all(responseHashTasks);
  const manifestPath = '/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/execution/RECOVERY_INPUTS.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const binding = {
    startedAt: now,
    completedAt: new Date().toISOString(),
    candidate,
    base: manifest.base,
    branch: manifest.branch,
    manifestFilesChecked: Object.keys(manifest.files).length,
    knownSourceMapDifference: { file: 'dist/bundle.js.map', expectedSnapshot: manifest.files['dist/bundle.js.map'], candidate: shaFile(path.join(candidate, 'dist/bundle.js.map')), note: 'The separate sourcemap differs; candidate bundle bytes and sourcesContent were the baseline build inputs. Candidate dist was not modified by this run.' },
    sourceHashes,
    servedHashes: responseHashes,
    export: { file: path.basename(exportedFile), sha256: shaFile(exportedFile), bytes: fs.statSync(exportedFile).size },
    errors,
    transcript,
  };
  fs.writeFileSync(path.join(evidenceDir, 'natural-prerequisite-evidence.json'), JSON.stringify(binding, null, 2) + '\n');
} finally {
  if (page) {
    try { await saveCheckpoint(`failure-or-close-${lastCheckpoint}`); }
    catch (error) { errors.push(`final localStorage checkpoint failed: ${error}`); }
  }
  await browser.close();
}
