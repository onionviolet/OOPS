// MG05 natural escorted dispatch, held at the persistence checkpoint P1 together with: owned/repaired room,
// paused workshop mandate, planted grain, owed loan with extension, booked and prepared exhibition, displayed object.
// Save -> reload -> compare; Export -> literal-file Import on a separate fresh profile -> compare; then completion on both.
const inv = s => s.inventories.person.main_character;
const crate = '{"id":"Courtyard wood crate"}';
const mgOnly = s => {const e = s.expansion, sim = e.simulation, pick = o => Object.fromEntries(Object.entries(o || {}).filter(([k]) => k.startsWith('mg.')));
    return {money: s.character.money, inventory: inv(s), facts: pick(e.actors.player.facts), completed: pick(e.actors.player.completed),
        actors: pick(e.actors), owners: pick(sim.owners), people: pick(sim.people), sites: pick(sim.sites),
        claims: Object.fromEntries(Object.entries(sim.claims).filter(([k]) => /^mg/.test(k))), knowledge: pick(sim.knowledge.player),
        jobs: sim.jobs.filter(j => j.commandId.startsWith('mg.')), programs: sim.programs};};
const diffKeys = (x, y) => Object.keys(x).filter(k => JSON.stringify(x[k]) !== JSON.stringify(y[k]));
const a = await snap('MG05 before');
expect(!(await has('Ship Courtyard wood crate')), 'no shipment before Bram authorizes one');
await h.mg('Hear Bram’s one-shipment offer');
await h.mg('Ship Courtyard wood crate · escorted shipment');
const held = await snap('P1 escorted shipment held');
expect(held.st.money === a.st.money - 2 && inv(held.s)[crate].count === inv(a.s)[crate].count - 1 && held.st.npc['mg.orin'].stamina === a.st.npc['mg.orin'].stamina - 2, 'manifest holds the crate, fee and Orin stamina');
const A = held.s;
// Reload.
await h.reload();
const beforePlay = await h.saved();
expect(JSON.stringify(mgOnly(beforePlay)) === JSON.stringify(mgOnly(A)), 'stored save untouched by reload');
await h.play();
const B = await h.save();
const reloadDiff = diffKeys(mgOnly(A), mgOnly(B));
// Export literal file.
const exported = await h.exportFile('P1-escorted-shipment-checkpoint.txt');
const fileSave = await h.saved();
const fileDiff = diffKeys(mgOnly(B), mgOnly(fileSave));
// Import on a separate fresh profile.
const prof = '/private/tmp/r15-g6-profile-import-' + Date.now();
const c2 = await chromium.launchPersistentContext(prof, {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}});
const p2 = c2.pages()[0] || await c2.newPage();
const e2 = []; p2.on('pageerror', e => e2.push(e.message)); p2.on('dialog', d => d.accept());
await p2.goto('http://127.0.0.1:19160/', {waitUntil: 'domcontentloaded'});
await p2.waitForTimeout(2500);
const emptyBefore = await p2.evaluate(() => localStorage.getItem('save data'));
await p2.locator('#saved_file_input').setInputFiles(exported.file);
await p2.waitForTimeout(4000);
const imported = await p2.evaluate(() => JSON.parse(localStorage.getItem('save data') || 'null'));
const importDiff = imported ? diffKeys(mgOnly(B), mgOnly(imported)) : ['no save'];
const play2 = p2.locator('#loading_screen_play_button');
if (await play2.isVisible().catch(() => false)) await play2.click({noWaitAfter: true});
await p2.waitForTimeout(9000);
await p2.locator('#save_button').click({noWaitAfter: true});
await p2.waitForTimeout(500);
const importedDone = await p2.evaluate(() => JSON.parse(localStorage.getItem('save data')));
const importedPanel = await p2.evaluate(() => {const el = document.getElementById('management_panel'); return el && !el.hidden && !!el.offsetParent;});
await c2.close();
// Original profile completes the same shipment once.
await idle();
const done = await snap('MG05 delivered');
const st2 = h.mgState(importedDone);
h.write('P1-persistence.json', {reloadDiff, fileDiff, importDiff, exportedSha256: exported.sha256, emptyBefore: emptyBefore === null, importErrors: e2, importedPanel,
    original: {money: done.st.money, bram: done.st.npc['mg.bram'], orin: done.st.npc['mg.orin'], jobs: done.st.jobs},
    importedAfterPlay: {money: st2.money, bram: st2.npc['mg.bram'], orin: st2.npc['mg.orin'], jobs: st2.jobs}, checkpoint: mgOnly(A)});
expect(!reloadDiff.length && !fileDiff.length && !importDiff.length, 'persistence diffs ' + JSON.stringify({reloadDiff, fileDiff, importDiff}));
expect(done.st.money === held.st.money + 12 && done.st.npc['mg.orin'].coins === held.st.npc['mg.orin'].coins + 2 && done.st.npc['mg.bram'].coins === held.st.npc['mg.bram'].coins - 12, 'escorted delivery paid once, fee to Orin');
expect(st2.money === done.st.money && st2.npc['mg.bram'].coins === done.st.npc['mg.bram'].coins, 'imported copy completes identically');
expect(!(await enabled('Ship Courtyard wood crate · local run')), 'one order only');
return {reloadDiff, fileDiff, importDiff, exported, importErrors: e2, importedPanel, money: [held.st.money, done.st.money, st2.money]};
