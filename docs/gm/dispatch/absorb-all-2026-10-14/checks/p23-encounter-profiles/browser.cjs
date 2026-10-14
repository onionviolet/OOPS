const fs = require('fs'), crypto = require('crypto'), http = require('http');
const {chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = __dirname;
const url = 'http://127.0.0.1:18835/';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const get = path => new Promise((resolve, reject) => http.get(url + path, {agent: false}, r => {const chunks = []; r.on('data', b => chunks.push(b)); r.on('end', () => resolve(Buffer.concat(chunks)));}).on('error', reject));
(async () => {
 const localHash = hash(fs.readFileSync('dist/bundle.js')), servedHash = hash(await get('dist/bundle.js'));
 if(localHash !== servedHash) throw Error('Served bundle mismatch');
 const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const context = await browser.newContext({viewport: {width: 1366, height: 768}});
 const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
 let baseline = 'OPEN';
 try {
  await page.goto(url);
  await page.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 30000});
  const confirm = page.locator('#hero_creation_panel_confirmation');
  await confirm.waitFor({state: 'visible', timeout: 5000}).catch(() => {});
  if(await confirm.isVisible()) await confirm.click();
  await page.locator('#location_actions_div .location_choice_dropdown').first().waitFor({state: 'visible', timeout: 15000});
  baseline = 'fresh native Village started';
 } catch(e) {baseline = e.message;}
 const contract = await page.evaluate(async () => {
  const m = await import('/src/absorb_p23/encounter_profiles/profile.js');
  const c = {worldId: m.WORLD_ID, locationId: m.AREA_ID, nativeEligible: true};
  const a = m.beginAttempt(undefined, {...c, seed: 7});
  return {level: a.pending.level, restored: JSON.stringify(m.readProfileState(JSON.parse(JSON.stringify(a)))) === JSON.stringify(a),
    stats: m.enemySpecification(a).stats, nativeIntegration: false};
 });
 await page.screenshot({path: root + '/desktop.png'});
 fs.writeFileSync(root + '/browser.json', JSON.stringify({viewport: {width: 1366, height: 768}, freshOrigin: true,
  localHash, servedHash, baseline, errors, moduleContract: contract,
  nativeChangedLoop: 'OPEN: P06/P00 registration, move, loot and save joins absent',
  pendingSaveReloadExportLiteralImport: 'OPEN: no native save field wired'}, null, 2));
 await browser.close();
 if(errors.length) process.exitCode = 1;
})().catch(e => {console.error(e); process.exitCode = 1;});
