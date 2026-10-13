// FA18 natural run, posted to the harness after helpers.js on a fresh profile. Writes fa18-evidence.json.
const E = {label: 'natural', hero: 'TEST FIXTURE R15 G1 FA18 natural', steps: {}};
const pick = s => ({time: `${String(s.time.hour).padStart(2, '0')}:${String(s.time.minute).padStart(2, '0')}`, money: s.money, issued: s.localLife.runnerMealsIssued, used: s.localLife.runnerMealsUsed,
  helped: s.localLife.helped, declined: s.localLife.declined, encounter: s.localLife.encounter, hubMisses: s.localLife.hubMisses, bread: s.bread,
  effects: Object.fromEntries(Object.entries(s.effects || {}).map(([k, v]) => [k, v.duration]))});
const perc = async () => (await saved())?.levels?.person?.main_character?.skill_xp?.Perception ?? 0;
const btn = id => page.locator(`#local_life_panel button[data-local-life-action="${id}"]`);

await page.goto('http://127.0.0.1:19110/', {waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').click({timeout: 15000});
await page.locator('#hero_creation_name_field').fill(E.hero);
await page.locator('#hero_creation_panel_confirmation').click();
const wait = []; const start = Date.now();
while (Date.now() - start < 300000) {
  await page.waitForTimeout(5000);
  const s = pick(await snap());
  if (!wait.length || wait.at(-1).hubMisses !== s.hubMisses || s.encounter) wait.push(s);
  if (s.encounter) break;
}
E.steps.contact = wait;
if (!wait.at(-1)?.encounter) {fs.writeFileSync(out + 'fa18-evidence.json', JSON.stringify(E, null, 1)); return E;}

await saveReload();
E.steps.pendingContactSaveReload = {after: pick(await snap()), panelButtons: await (await panel(), page.locator('#local_life_panel button').allInnerTexts())};

const p0 = await perc();
await btn('help').click();
await page.waitForTimeout(500);
E.steps.help = {status: await page.locator('#local_life_panel [role=status]').innerText(), after: pick(await snap()), perception: [p0, await perc()],
  helpButtonGone: await btn('help').count() === 0, ticketButton: await btn('runner_meal').innerText()};
await page.screenshot({path: out + 'fa18-ticket-issued.png'});

await saveReload();
const heldReload = pick(await snap());
const heldFile = await exportTo('fa18-ticket-held-export.txt');
await page.evaluate(() => localStorage.clear());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
await page.locator('#saved_file_input').setInputFiles(heldFile);
await page.waitForFunction(() => !!localStorage.getItem('save data'), null, {timeout: 20000});
await page.waitForTimeout(2500);
await waitPlay();
E.steps.ticketHeldPersistence = {afterSaveReload: heldReload, afterWipeAndLiteralImport: pick(await snap()),
  ticketButtonAfterImport: await (await panel(), btn('runner_meal').innerText()), helpButtonAbsent: await btn('help').count() === 0};

const idle0 = pick(await snap());
await page.waitForTimeout(30000);
await page.locator('#save_button').click();
E.steps.idleThirtyMinutes = {before: idle0, after: pick(await snap())};

await panel();
await btn('runner_meal').click();
await page.waitForTimeout(500);
E.steps.redeem = {status: await page.locator('#local_life_panel [role=status]').innerText(), after: pick(await snap()), ticketButtonGone: await btn('runner_meal').count() === 0,
  inventoryLine: (await page.locator('body').innerText()).match(/Stale bread x\d+/)?.[0]};

const row = page.locator('.inventory_item_div, [class*=inventory_item]').filter({hasText: 'Stale bread'}).first();
await row.getByText('[use]').click();
await page.waitForTimeout(600);
await page.locator('#save_button').click();
E.steps.eatBread = {after: pick(await snap()), effectsList: await page.evaluate(() => document.getElementById('effects_tooltip')?.innerText?.slice(0, 160))};
await page.screenshot({path: out + 'fa18-after-bread-use.png'});

await saveReload();
const finalReload = pick(await snap());
const finalFile = await exportTo('fa18-final-export.txt');
await page.evaluate(() => localStorage.clear());
await page.reload({waitUntil: 'domcontentloaded'});
await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
await page.locator('#saved_file_input').setInputFiles(finalFile);
await page.waitForFunction(() => !!localStorage.getItem('save data'), null, {timeout: 20000});
await page.waitForTimeout(2500);
await waitPlay();
E.steps.finalPersistence = {afterSaveReload: finalReload, afterWipeAndLiteralImport: pick(await snap()), ticketButtonCount: await (await panel(), btn('runner_meal').count()),
  name: (await snap()).name};
E.bundle = log.bundle; E.profile = 'fresh /private/tmp profile'; E.viewport = '1600x1100 headless Chrome'; E.pageErrors = log.errors;
fs.writeFileSync(out + 'fa18-evidence.json', JSON.stringify(E, null, 1) + '\n');
return E;
