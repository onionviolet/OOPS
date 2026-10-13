import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const candidate = '/Users/weiwei/.codex/candidates/yairpg-foundation-adoption-2026-10-13-r1';
const evidenceDir = '/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r1/natural-prerequisite';
const baseUrl = 'http://127.0.0.1:18721/';
const generated = JSON.parse(fs.readFileSync(path.join(evidenceDir, 'earned-state-final.json'), 'utf8'));
const nativeSave = generated.localStorage['save data'];
const nativeEnvelope = JSON.parse(nativeSave);
const playerInventory = nativeEnvelope.inventories.person.main_character['{"id":"Rough wood log"}'];
if (!playerInventory || playerInventory.count < 3) throw new Error(`Earned checkpoint inventory has fewer than three Rough wood logs: ${playerInventory?.count ?? 0}`);
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const shaFile = file => digest(fs.readFileSync(file));
const transcript = [];
const errors = [];
const record = (step, data = {}) => { const row = { at: new Date().toISOString(), step, ...data }; transcript.push(row); console.log(JSON.stringify(row)); };
const sourceHashes = Object.fromEntries(['src/data/dialogues.js', 'src/data/locations.js', 'src/items.js', 'src/main.js', 'index.html', 'dist/bundle.js'].map(file => [file, shaFile(path.join(candidate, file))]));
const responseHashes = {};
const responseTasks = [];
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let page;
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
  const play = page.locator('#loading_screen_play_button');
  if (await play.count() && await play.isVisible()) { await play.click(); await page.locator('#loading_screen').waitFor({ state: 'hidden' }); }
  const location = await page.locator('#location_name_span').innerText();
  if (location !== 'Village') throw new Error(`Expected earned prerequisite to be in Village; got ${location}`);
  const logName = page.locator('.character_item_control .item_name').filter({ hasText: /^Rough wood log$/ });
  const controls = await logName.evaluateAll(names => names.map(name => {
    let control = name;
    while (control && !(control.classList?.contains('character_item_control'))) control = control.parentElement;
    return { label: name.innerText, count: Number(control?.getAttribute('data-item_count') || 0), key: control?.getAttribute('data-character') };
  }));
  const displayedCount = controls.reduce((sum, item) => sum + item.count, 0);
  record('restored-earned-save-in-fresh-disposable-origin', { origin: page.url(), location, checkpointAt: generated.at, checkpointBytes: Buffer.byteLength(nativeSave), checkpointSHA256: digest(nativeSave), generatedInventoryCount: playerInventory.count, displayedLogControls: controls, displayedCount, currentActivity: nativeEnvelope.current_activity?.activity_id, savedActivityLogCount: nativeEnvelope.current_activity?.gathered_materials?.['Rough wood log'] ?? 0 });
  await page.screenshot({ path: path.join(evidenceDir, '07-earned-logs-before-stop.png'), fullPage: true });
  if (displayedCount < 3) throw new Error(`Native UI displayed only ${displayedCount} Rough wood logs, checkpoint has ${playerInventory.count}.`);
  const stopButton = page.locator('#action_end_div');
  if (await stopButton.count()) await stopButton.click();
  await page.waitForTimeout(200);
  const stoppedBody = await page.locator('body').innerText();
  const workStopped = !(await page.locator('#action_end_div').count());
  const currentActivityText = await page.locator('#action_status_div').innerText().catch(() => null);
  const hp = stoppedBody.match(/(\d+)\/(\d+) hp/);
  const activeCombat = stoppedBody.includes('Combat in progress');
  record('woodcutting-stopped', { displayedRoughWoodLogs: displayedCount, activityTextAfterStop: currentActivityText, stopButtonAbsent: workStopped, activeCombat, hp: hp ? { current: Number(hp[1]), max: Number(hp[2]) } : null });
  if (!workStopped) throw new Error('The native Stop woodcutting control remained visible after click.');
  if (activeCombat) throw new Error('Save is still in combat.');
  await page.screenshot({ path: path.join(evidenceDir, '08-final-state-work-stopped.png'), fullPage: true });
  await page.locator('#save_button').click();
  await page.waitForTimeout(150);
  const downloadWait = page.waitForEvent('download');
  await page.locator('#save_to_file_button').click();
  const download = await downloadWait;
  const exportFile = path.join(evidenceDir, 'natural-prerequisite-save.txt');
  await download.saveAs(exportFile);
  const exported = await page.evaluate(() => JSON.parse(localStorage.getItem('save data')));
  const exportedItemCount = exported.inventories.person.main_character['{"id":"Rough wood log"}']?.count ?? 0;
  record('exported-native-save', { suggestedFilename: download.suggestedFilename(), file: path.basename(exportFile), bytes: fs.statSync(exportFile).size, sha256: shaFile(exportFile), location: await page.locator('#location_name_span').innerText(), roughWoodLogsInSavedEnvelope: exportedItemCount, nativeStopButtonAbsent: !(await page.locator('#action_end_div').count()), oldAxeEquipped: Object.values(exported.character.equipment).some(item => item?.id === 'Old axe' || item?.name === 'Old axe') });
  await page.screenshot({ path: path.join(evidenceDir, '09-final-native-export.png'), fullPage: true });
  await Promise.all(responseTasks);
  const manifest = JSON.parse(fs.readFileSync('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/foundation-adoption-next-2026-10-13/execution/RECOVERY_INPUTS.json', 'utf8'));
  const evidence = {
    candidate, base: manifest.base, branch: manifest.branch, manifestFilesChecked: Object.keys(manifest.files).length,
    knownSourceMapDifference: { file: 'dist/bundle.js.map', expectedSnapshot: manifest.files['dist/bundle.js.map'], candidate: shaFile(path.join(candidate, 'dist/bundle.js.map')), note: 'Separate sourcemap differs; candidate bundle bytes and sourcesContent were baseline build inputs. Candidate dist was not modified.' },
    sourceHashes, servedHashes: responseHashes,
    naturalCheckpoint: { file: 'earned-state-final.json', rawGeneratedSaveSHA256: digest(nativeSave), savedActivity: nativeEnvelope.current_activity?.activity_id, activityGatheredLogCount: nativeEnvelope.current_activity?.gathered_materials?.['Rough wood log'] ?? 0, inventoryLogCount: playerInventory.count, fieldGroupsKilled: nativeEnvelope.locations['Infested field']?.enemy_groups_killed },
    timerMethod: 'Playwright page.clock.runFor(10000) advanced actual registered game timers in 360 bounded increments; no fastForward, speed setter, or state grants.',
    harnessCaveat: 'The earlier UI loop read only the first matching inventory element and its fallback count (1), although the saved native inventory had 95 Rough wood logs. This finalizer inspected all native inventory controls and the exported save envelope.',
    export: { file: path.basename(exportFile), sha256: shaFile(exportFile), bytes: fs.statSync(exportFile).size, roughWoodLogs: exportedItemCount }, errors, transcript,
  };
  fs.writeFileSync(path.join(evidenceDir, 'natural-prerequisite-evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
} finally {
  if (page) {
    try {
      const entries = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])));
      fs.writeFileSync(path.join(evidenceDir, 'earned-state-final-exported.json'), JSON.stringify({ at: new Date().toISOString(), url: page.url(), localStorage: entries }, null, 2) + '\n');
    } catch (error) { errors.push(`final generated-state snapshot failed: ${error}`); }
  }
  await browser.close();
}
