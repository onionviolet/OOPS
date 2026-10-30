// Cyoria access and loop panel proof on a fresh localhost origin at 1920x1080, from the named R15 G4 fixture (guest pass held, in Cyoria).
// Run after npm run build with the repo served on YAIRPG_PROOF_URL. Steps: panel shows an open pass; save writes mol_access; advancing past the
// term lapses it with the operator skill kept; reload keeps the stamp; Export then Import keeps it.
const fs = require('node:fs');
const path = require('node:path');
const {launchChrome, withTestHooks} = require('./ui_helpers.cjs');
const output = process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-mol-proof';
const url = withTestHooks(process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18632/');
const fixture = path.join(__dirname, '..', 'docs/gm/dispatch/other-systems-depth-2026-10-26/learning/evidence/TEST-FIXTURE-R15-G4-learning-house.txt');
fs.mkdirSync(output, {recursive: true});
(async () => {
 const browser = await launchChrome(), errors = [], lines = [];
 const line = (name, ok, extra = '') => {lines.push(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`);console.log(lines.at(-1));};
 try {
  const raw = JSON.parse(Buffer.from(fs.readFileSync(fixture, 'utf8').trim().split(':')[1], 'base64'));
  const openPanel = async page => {const sel = page.locator('select').filter({hasText: 'All panels'}).first();if(await sel.count()) await sel.selectOption('mol_access').catch(() => {});await page.waitForTimeout(600);};
  const open = async data => {
   const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
   if(data) await context.addInitScript(d => {if(!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(d));}, data);
   const page = await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror', e => errors.push(e.stack));
   for(let i = 0; i < 3; i++) {try {await page.goto(url);break;} catch(e) {if(i === 2) throw e;await page.waitForTimeout(1000);}}await page.waitForTimeout(300);
   await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(800);
   await openPanel(page);
   return {page, context};
  };
  const save = async page => {await page.evaluate(() => window.saveProgress());return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
  let {page, context} = await open(raw);
  const panel = page.locator('#mol_access_panel');
  line('panel mounted', await panel.count() === 1);
  const shown = await panel.isVisible();
  line('panel visible at 1920x1080 in Cyoria', shown);
  const t1 = await panel.innerText().catch(() => '');
  line('open pass with scope, exclusions and kept skill', /Open/.test(t1) && /Guest library reading/.test(t1) && /first-circle badge/i.test(t1) && /Keyed-lamp operator/.test(t1), t1.replace(/\n+/g, ' / ').slice(0, 200));
  line('restart readout names source', /Mother of Learning reset table/.test(t1) && /Resets/.test(t1) && /Carries over/.test(t1));
  await page.screenshot({path: path.join(output, '01-open.png')});
  const s1 = await save(page);
  line('slice mol_access saved', s1.mol_access?.schema === 1, JSON.stringify(s1.mol_access));
  fs.writeFileSync(path.join(output, 'saved.json'), JSON.stringify(s1));
  await context.close();
  // lapse: move the stamp 31 days into the past
  const lapsed = structuredClone(s1);lapsed.mol_access.issuedAt = Math.max(0, lapsed.mol_access.issuedAt - 31 * 1440);
  ({page, context} = await open(lapsed));
  const t2 = await page.locator('#mol_access_panel').innerText().catch(() => '');
  line('lapsed pass closes scope, keeps skill', /Lapsed/.test(t2) && /Closed while it is not open/.test(t2) && /Keyed-lamp operator/.test(t2), t2.replace(/\n+/g, ' / ').slice(0, 200));
  await page.screenshot({path: path.join(output, '02-lapsed.png')});
  const s2 = await save(page);
  line('reload keeps stamp', s2.mol_access?.issuedAt === lapsed.mol_access.issuedAt);
  // Export (literal save file), then Import through the app's own file input on a fresh origin
  const encoded = await page.evaluate(() => window.save_to_file());
  await Promise.all([page.waitForNavigation(), page.locator('#saved_file_input').setInputFiles({name: 'mol-access.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)})]);
  await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(800);await openPanel(page);
  const s3 = await save(page);
  line('Export then Import keeps the stamp', s3.mol_access?.issuedAt === lapsed.mol_access.issuedAt);
  const t3 = await page.locator('#mol_access_panel').innerText().catch(() => '');
  line('imported save still shows the lapsed pass', /Lapsed/.test(t3));
  await page.screenshot({path: path.join(output, '03-imported.png')});
  await context.close();
  line('no page errors', errors.length === 0, errors.join(' | ').slice(0, 300));
 } finally {
  fs.writeFileSync(path.join(output, 'result.txt'), lines.join('\n'));
  await browser.close();
 }
})().catch(e => {console.error(e);process.exit(1);});
