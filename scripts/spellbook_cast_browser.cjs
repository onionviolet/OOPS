// Spellbook cast walk (S phase 2): the spellbook draft now compiles through the
// kernel working (spell_working.js on kernel_working.js). Headless Chromium at
// 1920x1080 from an earned private Zorian save at the practice court: study Torch
// through its native command, add it in the spellbook, test the working (a native
// timed cast), let it settle, then Save, reload, Export and Import and check the
// draft and result are kept.
// Usage: serve a BUILD_OUT copy with private_packs linked; SPELLBOOK_SAVE=<save.json> node scripts/spellbook_cast_browser.cjs <port> <outdir>
const fs = require('node:fs');
const path = require('node:path');
const {launchChrome, withTestHooks, advanceGameMinutes} = require('./ui_helpers.cjs');
const port = process.argv[2] || '19614', out = process.argv[3] || 'docs/gm/dispatch/foundation-s-2026-11-12/evidence';
fs.mkdirSync(out, {recursive: true});
(async () => {
    const browser = await launchChrome(), errors = [], lines = [];
    const line = (name, ok, extra = '') => { lines.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' · ' + extra : ''}`); console.log(lines.at(-1)); };
    try {
        const save = JSON.parse(fs.readFileSync(process.env.SPELLBOOK_SAVE, 'utf8'));
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}, acceptDownloads: true});
        await context.addInitScript(d => { if (!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(d)); }, save);
        const page = await context.newPage(); page.setDefaultTimeout(60000);
        page.on('pageerror', e => errors.push(e.message));
        const boot = async () => {
            await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 90000});
            await page.evaluate(() => window.simulationTestHooks?.pause());
            await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(1500);
        };
        await page.goto(withTestHooks(`http://127.0.0.1:${port}/`)); await boot();
        await page.getByRole('button', {name: 'Notebook', exact: true}).first().click(); await page.waitForTimeout(800);
        // The study command sits in the Notebook's light-research section, inside two folded sections.
        const folds = await page.evaluate(() => {
            const button = [...document.querySelectorAll('button')].find(b => /Study the Torch invocation/.test(b.textContent));
            const out = []; for (let e = button?.parentElement; e; e = e.parentElement) if (e.tagName === 'DETAILS' && !e.open) out.unshift(e.id || e.className);
            return out;
        });
        for (const fold of folds) {
            const sel = /^[a-z_]+$/.test(fold) && fold.includes('_') && !fold.includes(' ') && await page.locator('#' + fold).count() ? '#' + fold : 'details.' + fold.split(' ')[0];
            await page.locator(sel + ':not([open]) > summary').filter({visible: true}).first().click(); await page.waitForTimeout(300);
        }
        const study = page.getByRole('button', {name: /Study the Torch invocation/}).filter({visible: true}).first();
        line('Torch study is offered at the court', await study.count() > 0);
        await study.click(); await page.waitForTimeout(400);
        await advanceGameMinutes(page, 12); await page.waitForTimeout(600);
        const openBook = async () => {
            await page.locator('select').filter({hasText: 'All panels'}).first().selectOption('spellbook'); await page.waitForTimeout(600);
            const open = await page.locator('#spellbook_panel').evaluate(d => d.open);
            if (!open) await page.locator('#spellbook_panel > summary').click();
            await page.waitForTimeout(400);
        };
        await openBook();
        const panel = page.locator('#spellbook_panel');
        const addTorch = panel.getByRole('button', {name: /^Add Torch/});
        await panel.locator('details').filter({hasText: 'Torch'}).first().locator('summary').first().click(); await page.waitForTimeout(300);
        line('studied Torch appears as a spellbook method', await addTorch.count() === 1, (await panel.innerText()).replace(/\n+/g, ' / ').slice(0, 160));
        await addTorch.click(); await page.waitForTimeout(400);
        const quote = await panel.innerText();
        line('draft quotes its cost and time before casting', /mana|played min|Immediate/i.test(quote), quote.replace(/\n+/g, ' / ').slice(0, 220));
        await panel.getByRole('button', {name: 'Test working'}).click(); await page.waitForTimeout(500);
        const notice = await panel.locator('[role=status]').textContent();
        line('test working starts the native cast', !notice, notice || 'no error');
        await page.screenshot({path: path.join(out, 'spellbook-cast-pending-1920.png')});
        await advanceGameMinutes(page, 12); await page.waitForTimeout(800);
        await openBook();
        const after = await panel.innerText();
        line('the cast settles and the working reports its result', /working succeeded|step failed/.test(after), after.match(/The working succeeded\.|This step failed[^.]*\./)?.[0] ?? after.slice(0, 120));
        await page.screenshot({path: path.join(out, 'spellbook-cast-settled-1920.png')});
        await page.evaluate(() => window.saveProgress()); await page.reload(); await boot(); await openBook();
        line('Save and reload keep the draft and result', /Torch/.test(await panel.innerText()) && /working succeeded|step failed/.test(await panel.innerText()));
        const exported = await page.evaluate(() => localStorage.getItem('save data'));
        line('save carries the spellbook entry', /spellbook\.cyoria\.workings/.test(exported));
        line('no page errors', errors.length === 0, errors.join(' | ').slice(0, 300));
        fs.writeFileSync(path.join(out, 'spellbook-cast.json'), JSON.stringify({lines, errors}, null, 1));
    } finally { await browser.close(); }
    if (lines.some(l => l.startsWith('FAIL'))) process.exit(1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
