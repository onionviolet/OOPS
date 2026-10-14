// Support-loss attempt through ordinary controls: start BOH kit work, open Local actions, try to
// travel to the Shack while the job is pending.
const L = 'Bench clearance study';
const pre = await save();
await keyAct(L, 'Commission a clearance manual');
const pending = await stored();
const openLocal = page.getByRole('button', {name: 'Open Local actions'}); const openVisible = await openLocal.isVisible(); if (openVisible) await openLocal.click();
await page.waitForTimeout(500);
const vis = await page.evaluate(() => [...document.querySelectorAll('[data-travel]')].map(b => ({t: b.dataset.travel, txt: b.textContent.trim().slice(0, 50), vis: !!b.offsetParent})));
let clicked = 'not visible';
const shack = page.locator('[data-travel="Shack"]:visible').first();
if (await shack.count()) { try { await shack.click({timeout: 3000}); clicked = 'clicked'; } catch (e) { clicked = 'err ' + e.message.slice(0, 120); } }
await page.waitForTimeout(1500);
const after = await stored();
const text = await page.locator('body').innerText();
const msgs = (text.match(/[^\n]*(finish|reserved|busy|cannot|can't)[^\n]*/gi) || []).slice(0, 8);
await page.screenshot({path: path.join(dir, 'evidence', 'fa10c-travel-during-copy.png')});
const r = await record('travel-attempt-during-copy', {vis, clicked, msgs});
return {openVisible, pendingJobs: pending.expansion.simulation.jobs.map(j => [j.commandId, j.due]), vis, clicked, locAfter: after['current location'], jobsAfter: after.expansion.simulation.jobs.map(j => j.commandId), msgs};
