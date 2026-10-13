import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const candidate = '/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r1';
const evidenceDir = '/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r1/natural-prerequisite';
const baseUrl = 'http://127.0.0.1:18721/';
const checkpoint = JSON.parse(fs.readFileSync(path.join(evidenceDir, 'earned-state-field-cleared.json'), 'utf8'));
const nativeSave = checkpoint.localStorage['save data'];
if (!nativeSave) throw new Error('No generated save data in field-cleared checkpoint.');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const shaFile = file => digest(fs.readFileSync(file));
const transcript = [];
const record = (step, data = {}) => { const row = { at: new Date().toISOString(), step, ...data }; transcript.push(row); console.log(JSON.stringify(row)); };
const sourceHashes = Object.fromEntries(['src/data/dialogues.js', 'src/data/locations.js', 'src/items.js', 'src/main.js', 'index.html', 'dist/bundle.js'].map(file => [file, shaFile(path.join(candidate, file))]));
const errors = [];
const responseHashes = {};
const responseTasks = [];
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let page;
let finalSave;
try {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(save => localStorage.setItem('save data', save), nativeSave);
  page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.origin === 'http://127.0.0.1:18721' && (url.pathname === '/' || url.pathname === '/dist/bundle.js')) responseTasks.push(response.body().then(body => { responseHashes[url.pathname] = { status: response.status(), sha256: digest(body) }; }).catch(error => errors.push(`response ${url.pathname}: ${error}`)));
  });
  await page.clock.install();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.waitForTimeout(250);
  const playOverlay = page.locator('#loading_screen_play_button');
  if (await playOverlay.count() && await playOverlay.isVisible()) {
    await playOverlay.click();
    await page.locator('#loading_screen').waitFor({ state: 'hidden' });
  }
  const currentLocation = await page.locator('#location_name_span').innerText();
  const initialBody = await page.locator('body').innerText();
  if (currentLocation !== 'Village' || !initialBody.includes('Saving available.')) throw new Error(`Checkpoint load did not resume in Village with writable save: ${currentLocation}`);
  record('resume-from-earned-field-cleared-checkpoint', { generatedSaveBytes: Buffer.byteLength(nativeSave), origin: page.url(), currentLocation, checkpointAt: checkpoint.at, checkpointSHA256: digest(nativeSave) });

  await page.locator('.location_choice_dropdown.choice_dialogue').click();
  await page.locator('.start_dialogue[data-dialogue="villageElder"]').click();
  const choices = await page.locator('.dialogue_textline[data-textline]').evaluateAll(xs => xs.map(x => ({ id: x.getAttribute('data-textline'), text: x.innerText })));
  const clearLine = page.locator('.dialogue_textline[data-textline="cleared field"]');
  if (await clearLine.count()) {
    const text = await clearLine.innerText();
    await clearLine.click();
    record('elder-cleared-field', { id: 'cleared field', displayedText: text, choicesBefore: choices.map(x => x.id) });
  } else {
    const askLeave3 = page.locator('.dialogue_textline[data-textline="ask to leave 3"]');
    if (!(await askLeave3.count())) throw new Error(`Elder follow-up route unavailable. Current dialogue choices: ${JSON.stringify(choices)}`);
    const text = await askLeave3.innerText();
    await askLeave3.click();
    record('elder-followup-opens-craftsman', { id: 'ask to leave 3', displayedText: text });
  }
  await page.locator('#save_button').click();
  await page.waitForTimeout(100);
  const checkpointEntries = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
  fs.writeFileSync(path.join(evidenceDir, 'earned-state-elder-cleared-confirmed.json'), JSON.stringify({ at: new Date().toISOString(), localStorage: checkpointEntries }, null, 2) + '\n');
  if (await page.locator('.end_dialogue_button').count()) await page.locator('.end_dialogue_button').click();
  const dialogueMenu = page.locator('.location_choice_dropdown.choice_dialogue');
  if (await dialogueMenu.count()) await dialogueMenu.click();
  const craftsman = page.locator('.start_dialogue[data-dialogue="oldCraftsman"]');
  if (!(await craftsman.count())) throw new Error(`Craftsman dialogue missing after elder follow-up; body: ${(await page.locator('body').innerText()).slice(-700)}`);
  await craftsman.click();
  for (const id of ['hello', 'learn']) {
    const line = page.locator(`.dialogue_textline[data-textline="${id}"]`);
    if (!(await line.count())) throw new Error(`Craftsman route did not offer ${id}.`);
    const displayedText = await line.innerText();
    await line.click();
    record('craftsman-textline', { id, displayedText });
  }
  await page.screenshot({ path: path.join(evidenceDir, '05-craftsman-tools.png'), fullPage: true });
  if (await page.locator('.end_dialogue_button').count()) await page.locator('.end_dialogue_button').click();

  const toolsTab = page.getByText('Tools', { exact: true });
  if (await toolsTab.count()) await toolsTab.first().click();
  const oldAxe = page.locator('.character_item_control').filter({ has: page.locator('.item_name').filter({ hasText: /^Old axe$/ }) });
  if (!(await oldAxe.count())) throw new Error('Craftsman did not provide an actual Old axe.');
  await oldAxe.locator('.equip_item_button').click();
  record('old-axe-equipped', { item: 'Old axe' });
  const gatherMenu = page.locator('.location_choice_dropdown.choice_gather');
  if (!(await gatherMenu.count())) throw new Error('Gather resources menu did not unlock from the craftsman.');
  await gatherMenu.click();
  const woodcut = page.locator('.start_activity[data-activity="woodcutting"], .location_choice[data-activity="woodcutting"]');
  if (!(await woodcut.count())) throw new Error('Village woodcutting was not available after equipping Old axe.');
  await woodcut.first().click();
  record('started-woodcutting', { activity: 'woodcutting', tool: 'Old axe', nativeActionText: 'Gather wood on the outskirts' });
  await page.screenshot({ path: path.join(evidenceDir, '06-woodcutting-started.png'), fullPage: true });

  const readLogs = async () => {
    const itemName = page.locator('.character_item_control .item_name').filter({ hasText: /^Rough wood log$/ });
    if (!(await itemName.count())) return 0;
    const control = itemName.first().locator('xpath=ancestor::div[contains(@class,"character_item_control")]');
    return Number(await control.getAttribute('data-item_count') || 1);
  };
  let logs = await readLogs();
  let ticks = 0;
  while (logs < 3 && ticks < 360) {
    ticks++;
    await page.clock.runFor(10000);
    logs = await readLogs();
    if (ticks % 3 === 0 || logs >= 3) record('woodcutting-progress', { logs, virtualTimerAdvanceMs: ticks * 10000, clockControl: 'Playwright page.clock.runFor(10000), actual registered game timers' });
  }
  if (logs < 3) throw new Error(`Only ${logs} Rough wood logs after ${ticks} bounded timer advances.`);
  if (await page.locator('#action_end_div').count()) await page.locator('#action_end_div').click();
  const finalBody = await page.locator('body').innerText();
  const readHp = finalBody.match(/(\d+)\/(\d+) hp/);
  const oldAxeEquipped = await page.locator('.equipment_slot_div').evaluateAll(xs => xs.some(x => x.innerText.includes('Old axe'))).catch(() => false);
  record('woodcutting-stopped', { roughWoodLogs: logs, noWorkRunning: finalBody.includes('No work running.'), activeCombat: finalBody.includes('Combat in progress'), hp: readHp ? { current: Number(readHp[1]), max: Number(readHp[2]) } : null, oldAxeEquipped });
  await page.screenshot({ path: path.join(evidenceDir, '07-three-logs-work-stopped.png'), fullPage: true });

  await page.locator('#save_button').click();
  await page.waitForTimeout(150);
  const downloadWait = page.waitForEvent('download');
  await page.locator('#save_to_file_button').click();
  const download = await downloadWait;
  finalSave = path.join(evidenceDir, 'natural-prerequisite-save.txt');
  await download.saveAs(finalSave);
  record('exported-native-save', { suggestedFilename: download.suggestedFilename(), file: path.basename(finalSave), sha256: shaFile(finalSave), bytes: fs.statSync(finalSave).size, location: await page.locator('#location_name_span').innerText(), roughWoodLogs: await readLogs(), noWorkRunning: (await page.locator('body').innerText()).includes('No work running.'), oldAxeEquipped });
  await page.screenshot({ path: path.join(evidenceDir, '08-final-save-exported.png'), fullPage: true });

  await Promise.all(responseTasks);
  const manifest = JSON.parse(fs.readFileSync('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/execution/RECOVERY_INPUTS.json', 'utf8'));
  const evidence = {
    candidate, base: manifest.base, branch: manifest.branch, manifestFilesChecked: Object.keys(manifest.files).length,
    knownSourceMapDifference: { file: 'dist/bundle.js.map', expectedSnapshot: manifest.files['dist/bundle.js.map'], candidate: shaFile(path.join(candidate, 'dist/bundle.js.map')), note: 'Separate sourcemap differs; candidate bundle bytes and sourcesContent were baseline build inputs. Candidate dist was not modified.' },
    sourceHashes, servedHashes: responseHashes, restoredPriorNativeCheckpoint: { file: 'earned-state-field-cleared.json', sha256: digest(nativeSave), at: checkpoint.at },
    export: { file: path.basename(finalSave), sha256: shaFile(finalSave), bytes: fs.statSync(finalSave).size }, errors, continuationTranscript: transcript,
  };
  fs.writeFileSync(path.join(evidenceDir, 'natural-prerequisite-evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
} finally {
  if (page) {
    try {
      const entries = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
      fs.writeFileSync(path.join(evidenceDir, 'earned-state-final.json'), JSON.stringify({ at: new Date().toISOString(), url: page.url(), localStorage: entries }, null, 2) + '\n');
    } catch (error) { errors.push(`final checkpoint failed: ${error}`); }
  }
  await browser.close();
}
