// Aging and contact proof on a fresh localhost origin at 1920x1080. Run after npm run build with the repo served on YAIRPG_PROOF_URL.
const fs = require('node:fs');
const path = require('node:path');
const {launchChrome, withTestHooks} = require('./ui_helpers.cjs');
const output = process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-aging-proof';
const url = withTestHooks(process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18631/');
fs.mkdirSync(output, {recursive: true});
(async () => {
 const browser = await launchChrome(), errors = [], lines = [];
 const line = (name, ok, extra = '') => {lines.push(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`);console.log(lines.at(-1));};
 try {
  const open = async fixture => {
   const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
   if(fixture) await context.addInitScript(d => {if(!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(d));}, fixture);
   const page = await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror', e => errors.push(e.stack));
   for(let i = 0; i < 3; i++) {try {await page.goto(url);break;} catch(e) {if(i === 2) throw e;await page.waitForTimeout(1000);}}await page.waitForTimeout(300);
   await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(500);
   return {page, context};
  };
  const save = async page => {await page.evaluate(() => window.saveProgress());return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
  const shot = (page, name) => page.screenshot({path: path.join(output, name)});
  const notebook = async (page, view) => {
   await page.locator('select').filter({hasText: 'Notes, practice & people'}).first().selectOption('notebook');await page.waitForTimeout(300);
   await page.locator(`[data-notebook-view="${view}"]`).click();await page.waitForTimeout(300);
   const panel = page.locator('#aging_contact_panel');if(await panel.isVisible() && !(await panel.evaluate(n => n.open))) await panel.locator('summary').click();
  };
  const hp = page => page.evaluate(() => (document.body.innerText.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*hp/) || []).slice(1).map(Number));
  const ticks = async (page, n) => {for(let left = n; left > 0; left -= 500) await page.evaluate(k => advanceTicks(k), Math.min(500, left));};
  const text = page => page.locator('#aging_contact_panel').innerText();
  // 1 enroll through the real menus
  let {page, context} = await open();
  await page.getByRole('button', {name: 'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('#center_mode_back').click();
  await notebook(page, 'people');
  if(!(await page.locator('#chronicle_panel').evaluate(n => n.open))) await page.locator('#chronicle_panel summary').click();
  await page.locator('[data-chronicle="begin-mortal"]').click();
  await notebook(page, 'practice');
  const enrolled = await save(page);
  line('mortal chronicle enrolled through UI', enrolled.expansion.chronicle?.life.mode === 'mortal');
  line('aging_contact slice saved', enrolled.aging_contact?.schema === 1, `lifeKey=${enrolled.aging_contact?.lifeKey}`);
  line('panel visible in Notes > Practice at 1920x1080', await page.locator('#aging_contact_panel').isVisible(), (await text(page)).replace(/\n+/g, ' / ').slice(0, 160));
  const young = await hp(page);await shot(page, '01-young-practice.png');
  fs.writeFileSync(path.join(output, 'enrolled.json'), JSON.stringify(enrolled));
  await context.close();
  // 2 aged fixture: age 62 with two conditions, low contact, coins
  const aged = structuredClone(enrolled), key = aged.expansion.chronicle.enrolledAt;
  aged.expansion.chronicle.life.initialAge = 62;aged.character.money = 100;
  aged.aging_contact = {schema: 1, lifeKey: key, lastAge: 62, dial: null, conditions: {
   joints: {progress: 9, relief: 0, stance: 'ignore', treatedUntil: 0, diagnosed: false}, breath: {progress: 6, relief: 0, stance: 'ignore', treatedUntil: 0, diagnosed: false}},
   contact: {score: 30, seenMemory: 0, company: {day: -1, gains: 0}, letters: []}};
  ({page, context} = await open(aged));await notebook(page, 'practice');
  const old = await hp(page), body = await text(page);
  line('health ceiling fell with age and conditions', old[1] < young[1], `young max ${young[1]} -> aged max ${old[1]}`);
  line('reasons shown in parts', /Age 62/.test(body) && /Unexplained ache/.test(body) && /Withdrawn/.test(body), body.replace(/\n+/g, ' / ').slice(0, 260));
  line('symptom before diagnosis', /Your joints ache/.test(body) && !/Stiff joints/.test(body));
  await shot(page, '02-aged-62.png');
  const joints = page.locator('[data-aging-stance="joints:manage"]');await joints.click();
  let s = await save(page);line('manage choice saved and diagnoses', s.aging_contact.conditions.joints.stance === 'manage' && s.aging_contact.conditions.joints.diagnosed === true);
  const before = s.character.money;
  await page.locator('[data-aging-treat="joints"]').click();s = await save(page);
  line('treat spends coins and eases a stage', before - s.character.money === 24 && s.aging_contact.conditions.joints.relief === 1, `coins ${before}->${s.character.money}`);
  const afterTreat = await hp(page);line('ceiling recovers a little after treatment', afterTreat[1] >= old[1], `${old[1]} -> ${afterTreat[1]}`);
  await page.locator('[data-aging-company="villageElder"]').click();s = await save(page);
  line('company lifts contact at once', s.aging_contact.contact.score >= 49, `score ${s.aging_contact.contact.score}`);
  await page.locator('[data-aging-letter="villageElder"]').click();s = await save(page);
  line('letter costs a coin and goes pending', s.aging_contact.contact.letters[0]?.status === 'pending' && s.character.money === before - 24 - 1);
  const letterScore = s.aging_contact.contact.score;
  await ticks(page, 3 * 1440 + 30);s = await save(page);
  line('reply arrives after about three days', s.aging_contact.contact.letters[0].status === 'replied' && s.aging_contact.contact.score > letterScore - 5, `score ${letterScore} -> ${s.aging_contact.contact.score}`);
  await shot(page, '03-after-choices.png');
  // 3 reload keeps everything, then literal export and import
  const kept = JSON.stringify(s.aging_contact);
  await page.reload();await page.getByText('PLAY', {exact: true}).click();await page.waitForTimeout(500);
  s = await save(page);await notebook(page, 'practice');
  line('reload keeps slice and ceiling', JSON.stringify(s.aging_contact.conditions) === JSON.stringify(JSON.parse(kept).conditions) && Math.abs(s.aging_contact.contact.score - JSON.parse(kept).contact.score) < 3 && (await hp(page))[1] < young[1], `max hp ${(await hp(page))[1]}`);
  const encoded = await page.evaluate(() => window.save_to_file());
  await context.close();
  ({page, context} = await open());
  await page.locator('#saved_file_input').setInputFiles({name: 'aging.txt', mimeType: 'text/plain', buffer: Buffer.from(encoded)});
  await page.waitForTimeout(4000);
  await page.getByText('PLAY', {exact: true}).click();
  await page.waitForTimeout(500);s = await save(page);await notebook(page, 'practice');
  line('literal import restores slice', s.aging_contact?.conditions?.joints?.relief === 1 && (await hp(page))[1] < young[1], `max hp ${(await hp(page))[1]}`);
  await shot(page, '04-after-import.png');await context.close();
  // 4 fast-forward: ten years of age pass; wear catches up one year per played minute
  const ff = structuredClone(enrolled);ff.expansion.chronicle.life.initialAge = 54.5;ff.character.money = 100;
  ff.aging_contact = {schema: 1, lifeKey: key, lastAge: 44.5, dial: null, conditions: {}, contact: {score: 100, seenMemory: 0, company: {day: -1, gains: 0}, letters: []}};
  ({page, context} = await open(ff));await notebook(page, 'practice');
  const h0 = await hp(page);await ticks(page, 14);await page.waitForTimeout(300);s = await save(page);
  const h1 = await hp(page);
  line('ten years of age add chronic conditions and lower the ceiling', Object.keys(s.aging_contact.conditions).length >= 2 && h1[1] < h0[1], `conditions ${Object.keys(s.aging_contact.conditions)} max hp ${h0[1]} -> ${h1[1]}`);
  line('ceiling floors, health still refills (never below 60%)', h1[1] >= 0.6 * young[1] - 0.5);
  await shot(page, '05-fast-forward-10y.png');await context.close();
  // 5 ageless dial and isolation: score decays alone
  const iso = structuredClone(enrolled);iso.aging_contact = {...enrolled.aging_contact, contact: {score: 100, seenMemory: 0, company: {day: -1, gains: 0}, letters: []}};
  ({page, context} = await open(iso));
  await page.locator('select').filter({hasText: 'Notes, practice & people'}).first().selectOption('notebook');
  const a = (await save(page)).aging_contact.contact.score;await ticks(page, 2 * 1440);s = await save(page);
  line('contact decays with time in the village', s.aging_contact.contact.score < a - 2, `score ${a} -> ${s.aging_contact.contact.score}`);
  await context.close();
 } finally {await browser.close();}
 console.log(errors.length ? `PAGE ERRORS ${errors.length}\n${errors.slice(0, 2).join('\n')}` : 'no page errors');
 fs.writeFileSync(path.join(output, 'results.txt'), lines.join('\n') + '\n');
})().catch(e => {console.error(e);process.exit(1);});
