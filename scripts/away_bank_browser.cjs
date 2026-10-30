// Away time bank proof on a fresh localhost origin at 1920x1080. Run after npm run build with the repo served on YAIRPG_PROOF_URL.
const fs = require('node:fs');
const path = require('node:path');
const {launchChrome, withTestHooks} = require('./ui_helpers.cjs');
const output = process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-away-proof';
const url = withTestHooks(process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18777/');
fs.mkdirSync(output, {recursive: true});
(async () => {
 const browser = await launchChrome(), errors = [];
 const line = (name, ok, extra = '') => console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`);
 try {
  const open = async fixture => {
   const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
   if(fixture) await context.addInitScript(d => {if(!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(d));}, fixture);
   const page = await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror', e => errors.push(e.stack));
   await page.goto(url);await page.waitForTimeout(300);
   await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(800);
   return {page, context};
  };
  const save = async page => {await page.evaluate(() => window.saveProgress());return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
  const digest = page => page.locator('#return_digest');
  let {page, context} = await open();
  let s = await save(page);
  line('fresh save has an empty away bank slice', s.awayBank?.schema === 1 && s.awayBank.bankedMinutes === 0, JSON.stringify(s.awayBank));
  line('no bank row on a fresh game', !(await digest(page).isVisible()));
  await context.close();
  // 2 hours away: rewind lastSeen in the stored save, then open it as a returning player
  const away = structuredClone(s);away.awayBank.lastSeen = Date.now() - 125 * 60000;
  ({page, context} = await open(away));
  const row = digest(page);
  line('return shows banked time', await row.isVisible() && /Banked time: 12\d minutes/.test(await row.innerText()), (await row.innerText()).replace(/\n+/g, ' / ').slice(0, 220));
  await page.screenshot({path: path.join(output, '01-returned.png')});
  s = await save(page);
  line('saving rebases lastSeen and keeps the bank', s.awayBank.bankedMinutes >= 120 && Date.now() - s.awayBank.lastSeen < 60000, JSON.stringify(s.awayBank));
  const bankBefore = s.awayBank.bankedMinutes, clockBefore = s.expansion.clock;
  await page.locator('#away_bank_spend').click();await page.waitForTimeout(4000);
  s = await save(page);
  const used = bankBefore - s.awayBank.bankedMinutes, ran = s.expansion.clock - clockBefore;
  line('spending ran the native clock and debited what it consumed', used === 60 && ran >= used, `bank ${bankBefore}->${s.awayBank.bankedMinutes}, clock +${ran}`);
  await page.screenshot({path: path.join(output, '02-spent.png')});
  // reload keeps the bank without double credit
  const kept = s.awayBank.bankedMinutes;
  await page.reload();await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(800);
  s = await save(page);
  line('reload keeps the bank without double credit', Math.abs(s.awayBank.bankedMinutes - kept) <= 1, `${kept} -> ${s.awayBank.bankedMinutes}`);
  const encoded = await page.evaluate(() => window.save_to_file());
  await context.close();
  ({page, context} = await open());
  await page.locator('#saved_file_input').setInputFiles({name: 'away.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)});
  await page.waitForTimeout(4000);await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(800);
  s = await save(page);
  line('literal import restores the bank', Math.abs(s.awayBank.bankedMinutes - kept) <= 1 && await digest(page).isVisible(), `bank ${s.awayBank.bankedMinutes}`);
  await page.screenshot({path: path.join(output, '03-imported.png')});
  line('no page errors', errors.length === 0, errors[0] || '');
  await context.close();
 } finally {await browser.close();}
})().catch(e => {console.error(e);process.exit(1);});
