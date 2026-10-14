// FA10 support-loss attempt: start a timed BOH job, then try to leave the Village.
const L = 'Bench clearance study'; await keyAct(L, 'Read the prepared manual');
const travel = await page.evaluate(() => [...document.querySelectorAll('[data-travel]')].map(b => ({t: b.dataset.travel, txt: b.textContent.slice(0, 60), dis: b.disabled || b.getAttribute('aria-disabled'), vis: !!b.offsetParent})));
const shack = page.locator('[data-travel="Shack"]').first(); let clicked = false;
if (await shack.count()) { try { await shack.click({timeout: 3000}); clicked = true; } catch (e) { clicked = 'err ' + e.message.slice(0, 80); } }
await page.waitForTimeout(800); const s = await stored(); const text = await page.locator('body').innerText();
const r = await record('travel-attempt-during-read', {travel, clicked});
return {travel, clicked, loc: s['current location'], jobs: s.expansion.simulation.jobs.map(j => j.commandId),
  msg: (text.match(/[^\n]*(Finish your current|attention is reserved|current work|cannot travel)[^\n]*/gi) || []).slice(0, 5)};
