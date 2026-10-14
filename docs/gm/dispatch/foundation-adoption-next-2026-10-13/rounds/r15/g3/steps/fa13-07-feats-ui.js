// FA13: player-visible feat rows after the run (post Import). Searches every notebook section.
await page.screenshot({path: path.join(dir, 'evidence', 'fa13-final.png')});
const text = await page.evaluate(() => { const p = document.getElementById('feature_expansion_panel'); p.open = true;
  for (const d of p.querySelectorAll('details')) d.open = true; return p.innerText; });
return (text.match(/[^\n]*(bench substance|two uses for reed oil|real stock with Rill)[^\n]*/gi) || []);
