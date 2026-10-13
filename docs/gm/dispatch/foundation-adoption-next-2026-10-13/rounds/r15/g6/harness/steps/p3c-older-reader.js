// P3 last clause: the pre-integration reader (base 4becff87 on 19162) must reject a courtyard save rather than drop it.
const c = await chromium.launchPersistentContext('/private/tmp/r15-g6-profile-p3c-' + Date.now(), {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}});
const p = c.pages()[0] || await c.newPage(); const errs = [], dialogs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => {dialogs.push(d.message().slice(0, 300)); d.accept();});
await p.goto('http://127.0.0.1:19162/', {waitUntil: 'domcontentloaded'}); await p.waitForTimeout(2500);
const before = await p.evaluate(() => localStorage.getItem('save data'));
await p.locator('#saved_file_input').setInputFiles(path.join(h.evidence, 'P2-completed-journey.txt')); await p.waitForTimeout(4000);
const after = await p.evaluate(() => localStorage.getItem('save data'));
const screen = await p.evaluate(() => document.body.innerText.slice(0, 600));
await c.close();
const r = {storedBefore: before, storedAfter: after ? 'written (' + after.length + ' chars)' : null, dialogs, errors: errs, screen: screen.replace(/\s+/g, ' ').slice(0, 400)};
h.write('P3-older-reader.json', r);
return r;
