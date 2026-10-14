const s = await stored();
return {clock: s.expansion.clock, loc: s['current location'], jobs: s.expansion.simulation.jobs.map(j => [j.commandId, j.due]),
  buttons: await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && !b.closest('#feature_expansion_panel')).map(b => b.textContent.trim().slice(0, 50)).slice(0, 40))};
