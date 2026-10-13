// FA07 helpers, posted after helpers.js. Reads the durable save only (xs) or the live DOM (liveFx).
globalThis.practice = async () => {
  await page.locator('#adventure_notebook [aria-controls=notebook_view_practice]').click();
  const open = await page.locator('#body_panel').evaluate(n => n.open);
  if (!open) await page.locator('#body_panel summary').click();
};
globalThis.xs = async () => { const s = await saved(); const x = s.expansion; const c = x?.simulation?.conditions?.player || {};
  return {clock: x?.clock, seq: x?.sequence, scraped: c['body.scraped_hands'] || null, sore: c['body.sore_hands'] || null,
    jobs: (x?.simulation?.jobs || []).map(j => ({id: j.id, cmd: j.commandId, due: j.due})), balm: invCount(s, 'Healing balm'), log: invCount(s, 'Rough wood log'), money: s.character.money,
    effects: Object.fromEntries(Object.entries(s.active_effects || {}).map(([k, v]) => [k, v.duration])),
    receipt: x?.simulation?.knowledge?.player?.['contextual_balm.treatment'] || null, done: x?.actors?.player?.completed?.['contextual_balm.dress_scraped_palms'] || 0,
    location: s['current location']}; };
globalThis.liveFx = () => page.evaluate(() => ({balmRow: document.body.innerText.match(/Healing balm( x\d+)?\n/)?.[0]?.trim() || null,
  effectsList: document.getElementById('effects_tooltip')?.innerText?.slice(0, 120),
  notices: document.body.innerText.match(/[^\n]*(Progress paused|could not be completed|no room)[^\n]*/gi)?.slice(0, 4) || []}));
globalThis.balmSection = () => page.locator('details.notebook_preparation').filter({hasText: 'Scraped-palm care'});
globalThis.openBalm = async () => {
  await page.locator('#adventure_notebook [aria-controls=notebook_view_here]').click();
  for (let i = 0; i < 5; i++) {
    const fx = await page.locator('#feature_expansion_panel').evaluate(n => n.open);
    if (!fx) await page.locator('#feature_expansion_panel > summary').click();
    const open = await balmSection().evaluate(n => n.open).catch(() => null);
    if (open === false) await balmSection().locator(':scope > summary').click().catch(() => {});
    if (await balmSection().evaluate(n => n.open && n.closest('#feature_expansion_panel').open).catch(() => false)) {
      await page.waitForTimeout(150);
      if (await dressBtn().count() === 0 || await dressBtn().isVisible()) return true;
    }
    await page.waitForTimeout(200);
  }
  return false;
};
globalThis.dressBtn = () => balmSection().getByRole('button', {name: /Dress scraped palms/});
// Stops the current page's game-loop timer (as if the tab closed right then). Used only right after
// a Save/Export/reservation so a one-second tick cannot race the harness; a reload restarts the game.
globalThis.HOLD = 'const __id = setTimeout(() => {}, 0); for (let i = 0; i <= __id + 10; i++) {clearTimeout(i); clearInterval(i);}';
return 'fa07 defs ok';
