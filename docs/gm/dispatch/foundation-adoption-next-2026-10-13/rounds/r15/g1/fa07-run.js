// FA07 full browser run, posted to the harness after helpers.js and fa07-defs.js.
// Writes fa07-evidence.json. Every leaf starts from a literal-file Import of the scraped checkpoint
// produced in step S (same origin, storage replaced by the importer).
const E = {bundle: log.bundle, steps: {}};
const ck = out + 'fixture/fa07-scraped-checkpoint-export.txt';
const brief = x => ({clock: x.clock, scraped: x.scraped ? `until ${x.scraped.expiresAt}` : null, jobs: x.jobs.map(j => `${j.cmd}@${j.due}`), balm: x.balm, effects: x.effects, receipt: x.receipt ? `${x.receipt.cause}@${x.receipt.at}` : null, done: x.done});
const clickDressNow = `(() => {const sec = [...document.querySelectorAll('details.notebook_preparation')].find(d => /Scraped-palm care/.test(d.textContent));
  [...sec.querySelectorAll('button')].find(n => /Dress scraped palms/.test(n.textContent) && n.offsetParent).click();})()`;

// S. Seeded fixture -> native scrape. Body record and rough kit are the game's own commands.
await page.goto('http://127.0.0.1:19110/', {waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
await importFrom(out + 'fixture/TEST-FIXTURE-R15-G1-FA07-balm.txt');
const s0 = await xs();
await practice();
await page.locator('#body_panel').getByRole('button', {name: 'Begin a body record'}).click();
await page.waitForTimeout(800);
await page.locator('#body_panel').getByRole('button', {name: /Shape a rough kit/}).click();
await page.waitForTimeout(4500);
const s1 = await xs();
await exportTo('fixture/fa07-scraped-checkpoint-export.txt');
const spam = () => page.evaluate(() => (document.body.innerText.match(/Finish your living-world work or decision first\./g) || []).length);
E.steps.S_scrape = {fixture: {name: (await snap()).name, balm: s0.balm, log: s0.log, money: s0.money}, afterRoughKit: {...brief(s1), log: s1.log, money: s1.money},
  unrequestedBusyReportsDuringJob: await spam()};

// P. Positive: dress, one played minute, effect from completion minute.
await importFrom(ck);
await openBalm();
const p0 = await xs(), f0 = await liveFx();
await dressBtn().click();
await page.waitForTimeout(2600);
const p1 = await xs(), f1 = await liveFx();
const rec = (await balmSection().innerText()).match(/Latest treatment:[^\n]*/)?.[0];
await page.screenshot({path: out + 'fa07-positive-completed.png'});
E.steps.P_positive = {before: brief(p0), liveBefore: f0, after: brief(p1), liveAfter: f1, latestTreatmentRecord: rec, unrequestedBusyReportsDuringJob: await spam()};

// R. Comparison: free three-minute hand rest from the same checkpoint.
await importFrom(ck);
await practice();
const r0 = await xs();
await page.locator('#body_panel').getByRole('button', {name: /Rest your hands/}).click();
await page.waitForTimeout(500);
const rStarted = await xs();
await page.waitForTimeout(3800);
E.steps.R_restComparison = {before: brief(r0), started: brief(rStarted), after: brief(await xs()), live: await liveFx()};

// C. Cancel before completion, then retry after reload.
await importFrom(ck);
await openBalm();
await page.evaluate(clickDressNow + ';' + HOLD);
const cRes = await xs();
await page.waitForTimeout(300);
await balmSection().locator('button').filter({hasText: /Cancel work/}).filter({visible: true}).first().click();
await page.waitForTimeout(500);
const cCan = await xs();
await page.reload({waitUntil: 'domcontentloaded'}); await waitPlay();
const cRel = await xs();
await openBalm(); await dressBtn().click(); await page.waitForTimeout(2600);
E.steps.C_cancel = {reserved: brief(cRes), afterCancel: brief(cCan), afterReload: brief(cRel), retried: brief(await xs())};

// X. Natural scrape expiry while pending: reserve at expiresAt-1.
await importFrom(ck);
await openBalm();
const xr = await page.evaluate(async () => {
  const read = () => {const s = JSON.parse(localStorage.getItem('save data')); const c = s.expansion.simulation.conditions?.player?.['body.scraped_hands']; return {clock: s.expansion.clock, expiresAt: c?.expiresAt ?? null, balm: s.inventories.person.main_character['{"id":"Healing balm"}']?.count, jobs: s.expansion.simulation.jobs.map(j => `${j.commandId}@${j.due}`)};};
  const target = read().expiresAt - 1;
  while (read().clock < target) await new Promise(r => setTimeout(r, 40));
  const sec = [...document.querySelectorAll('details.notebook_preparation')].find(d => /Scraped-palm care/.test(d.textContent));
  [...sec.querySelectorAll('button')].find(n => /Dress scraped palms/.test(n.textContent) && n.offsetParent).click();
  return {target, reserved: read()};
});
await page.waitForTimeout(3000);
E.steps.X_expiryWhilePending = {...xr, after: brief(await xs()), live: await liveFx()};

// W1. Failed durable write at reservation.
await importFrom(ck);
await openBalm();
const w1 = await page.evaluate(async (clickSrc) => {
  const orig = Storage.prototype.setItem; window.__r15Writes = 0;
  Storage.prototype.setItem = function () {window.__r15Writes++; throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');};
  window.__r15Restore = () => {Storage.prototype.setItem = orig;};
  eval(clickSrc);
  await new Promise(r => setTimeout(r, 50));
  return {writeAttempts: window.__r15Writes};
}, clickDressNow);
await page.waitForTimeout(2000);
w1.durable = brief(await xs()); w1.live = await liveFx();
await page.evaluate(() => window.__r15Restore());
await page.reload({waitUntil: 'domcontentloaded'}); await waitPlay();
w1.afterReload = brief(await xs());
await openBalm(); await dressBtn().click(); await page.waitForTimeout(2600);
w1.retried = brief(await xs());
E.steps.W1_failedWriteAtReservation = w1;

// W2. Failed durable write at completion.
await importFrom(ck);
await openBalm();
const w2 = {liveBefore: await liveFx()};
await page.evaluate(clickDressNow + `; (() => {const orig = Storage.prototype.setItem; window.__r15Writes = 0;
  Storage.prototype.setItem = function () {window.__r15Writes++; throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');};
  window.__r15Restore = () => {Storage.prototype.setItem = orig;};})()`);
await page.waitForTimeout(3500);
w2.writeAttempts = await page.evaluate(() => window.__r15Writes);
w2.durableDuringFailure = brief(await xs()); w2.liveDuringFailure = await liveFx();
await page.screenshot({path: out + 'fa07-failed-write-paused.png'});
await page.evaluate(() => window.__r15Restore());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
w2.restoredBeforePlay = brief(await xs());
await waitPlay(); await page.waitForTimeout(3000);
w2.afterRetry = brief(await xs()); w2.liveAfterRetry = await liveFx();
E.steps.W2_failedWriteAtCompletion = w2;

// PS. Pending Save + reload.
await importFrom(ck);
await openBalm();
await page.evaluate(clickDressNow + `; document.getElementById('save_button').click(); ` + HOLD);
const ps = {savedPending: brief(await xs())};
await page.waitForTimeout(2000);
ps.stillPendingAfter2s = brief(await xs());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
ps.afterReloadBeforePlay = brief(await xs());
await waitPlay(); await page.waitForTimeout(2600);
ps.afterPlay = brief(await xs());
E.steps.PS_pendingSaveReload = ps;

// PE. Pending Export + literal Import into a wiped origin.
await importFrom(ck);
await openBalm();
const dl = page.waitForEvent('download', {timeout: 10000});
await page.evaluate(clickDressNow + `; document.getElementById('save_to_file_button').click(); ` + HOLD.replace('clearTimeout(i); clearInterval(i);', 'if (i !== __id) {clearTimeout(i); clearInterval(i);}'));
const pe = {exportedPending: brief(await xs())};
const pendingFile = out + 'fa07-pending-export.txt';
await (await dl).saveAs(pendingFile);
await page.evaluate(() => localStorage.clear());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
pe.wipedOriginHasSave = await page.evaluate(() => !!localStorage.getItem('save data'));
await page.locator('#saved_file_input').setInputFiles(pendingFile);
await page.waitForFunction(() => !!localStorage.getItem('save data'), null, {timeout: 20000});
await page.waitForTimeout(2500);
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
pe.importedBeforePlay = brief(await xs());
await waitPlay(); await page.waitForTimeout(2600);
pe.afterPlay = brief(await xs());
E.steps.PE_pendingExportImport = pe;

// F. Completed treatment: Save + reload, Export, wipe, literal Import.
const f = {live: brief(await xs())};
await page.evaluate(`document.getElementById('save_button').click(); ` + HOLD);
f.saved = brief(await xs());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
f.reloaded = brief(await xs());
await waitPlay();
f.liveAfterReload = await liveFx();
const dl2 = page.waitForEvent('download', {timeout: 10000});
await page.evaluate(`document.getElementById('save_to_file_button').click(); ` + HOLD.replace('clearTimeout(i); clearInterval(i);', 'if (i !== __id) {clearTimeout(i); clearInterval(i);}'));
f.exported = brief(await xs());
const doneFile = out + 'fa07-completed-export.txt';
await (await dl2).saveAs(doneFile);
await page.evaluate(() => localStorage.clear());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
await page.locator('#saved_file_input').setInputFiles(doneFile);
await page.waitForFunction(() => !!localStorage.getItem('save data'), null, {timeout: 20000});
await page.waitForTimeout(2500);
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
f.imported = brief(await xs());
await waitPlay(); await page.waitForTimeout(1500);
f.liveAfterImport = await liveFx();
f.name = (await snap()).name;
E.steps.F_completedPersistence = f;
E.pageErrors = log.errors;
E.bundle = log.bundle; E.profile = 'fresh /private/tmp profile'; E.viewport = '1600x1100 headless Chrome';
fs.writeFileSync(out + 'fa07-evidence.json', JSON.stringify(E, null, 1) + '\n');
return E;
