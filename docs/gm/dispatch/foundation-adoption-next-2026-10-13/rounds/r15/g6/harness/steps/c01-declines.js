// Natural run C on another fresh profile: the decline branches (MG01 pass, MG04 low ceiling, MG08 refusal).
const c = await chromium.launchPersistentContext('/private/tmp/r15-g6-profile-c-' + Date.now(), {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}});
const p = c.pages()[0] || await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
const save = async () => {await p.locator('#save_button').click({noWaitAfter: true}); await p.waitForTimeout(300); return p.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
const click = async text => {await p.evaluate(() => {const el = document.getElementById('management_panel'); el.open = true; el.querySelectorAll('details').forEach(d => d.open = true);});
    const b = p.locator('#management_panel section button', {hasText: text}).filter({visible: true}); if (!await b.count() || await b.first().isDisabled()) throw Error('unavailable: ' + text); await b.first().click({noWaitAfter: true}); await p.waitForTimeout(250);};
const rowsP = () => p.evaluate(() => [...document.querySelectorAll('#management_panel section')].filter(s => !s.hidden && s.offsetParent).map(s => (s.querySelector('button').disabled ? '[x] ' : '') + s.querySelector('button').textContent));
await p.goto('http://127.0.0.1:19160/', {waitUntil: 'domcontentloaded'}); await p.waitForTimeout(2500);
const play = p.locator('#loading_screen_play_button'); if (await play.isVisible().catch(() => false)) await play.click({noWaitAfter: true}); await p.waitForTimeout(800);
await p.locator('input').filter({visible: true}).first().fill('R15 G6 natural C');
await p.getByText('Confirm', {exact: true}).click(); await p.waitForTimeout(1500);
await click('Visit the market courtyard');
const s0 = await save(), st0 = h.mgState(s0);
await click('Inspect Orin’s small enterprise'); await click('Pass on Orin’s offer');
await click('Inspect Mira’s damaged heirloom'); await click('Set a five-coin ceiling');
await click('Hear Sela’s request for help'); await click('Decline Sela’s request');
const s1 = await save(), st1 = h.mgState(s1), shown = await rowsP();
const r = {before: {money: st0.money, npc: Object.fromEntries(Object.entries(st0.npc).map(([k, v]) => [k, v.coins]))},
    after: {money: st1.money, npc: Object.fromEntries(Object.entries(st1.npc).map(([k, v]) => [k, v.coins])), facts: st1.facts, inventory: s1.inventories.person.main_character, miraLot: st1.npc['mg.mira'].stock['{"id":"Damaged courtyard heirloom"}']},
    closedRows: shown.filter(x => /share|advance|Pass on|ceiling|Lend|Give Sela|Decline|Collect Sela/.test(x)), errors: errs};
await c.close();
h.write('natural-C-declines.json', r);
expect(st1.money === 102 && JSON.stringify(r.before.npc) === JSON.stringify(r.after.npc), 'declines move no money');
expect(st1.facts['mg.capitalAgreement'] === 'passed' && st1.facts['mg.auctionResult'] === 'lost' && st1.facts['mg.selaAidTerms'] === 'refused', 'branches recorded');
expect(r.after.miraLot === 1 && !Object.keys(r.after.inventory).some(k => k.includes('heirloom')), 'lost lot stays with Mira');
expect(r.closedRows.every(x => x.startsWith('[x]')), 'all three offers closed');
return r;
