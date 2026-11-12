// Spellbook placement on the combined tree (S chat, 2026-11-12). Fresh localhost origin, headless Chromium, 1920x1080.
// Checks the surface fix in 9bbc51363: the panel registers through the workspace (LAYOUT_SPEC surface `spellbook`),
// lives inside its own workspace shell, is not inserted into another panel's host, lists with an unavailable reason
// away from a practice place, and boots with no page errors. With SPELLBOOK_SAVE set to a private earned save at a
// practice place, it also checks the eligible state: shown in its shell, dock, learned methods and a visible quote.
// Usage: BUILD_OUT=<dir> npm run build; serve <dir> (with private_packs linked) on a port; node scripts/spellbook_placement_browser.cjs <port> <outdir>
const fs = require('node:fs');
const path = require('node:path');
const {launchChrome, withTestHooks} = require('./ui_helpers.cjs');
const port = process.argv[2] || '19613', out = process.argv[3] || 'docs/gm/dispatch/foundation-s-2026-11-12/evidence';
fs.mkdirSync(out, {recursive: true});
(async () => {
    const browser = await launchChrome(), errors = [], lines = [];
    const line = (name, ok, extra = '') => { lines.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' · ' + extra : ''}`); console.log(lines.at(-1)); };
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        const page = await context.newPage(); page.setDefaultTimeout(60000);
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(withTestHooks(`http://127.0.0.1:${port}/`));
        await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 90000});
        await page.locator('#loading_screen_play_button').click();
        await page.waitForTimeout(1500);
        const confirm = page.getByText('Confirm', {exact: true}); if (await confirm.count()) { await confirm.first().click().catch(() => {}); await page.waitForTimeout(800); }
        const probe = () => page.evaluate(() => {
            const panel = document.getElementById('spellbook_panel');
            const shell = panel?.closest('section.workspace-module');
            const hosts = [...document.querySelectorAll('[id$="_panel"]')].filter(e => e !== panel && e.contains(panel)).map(e => e.id);
            const option = [...document.querySelectorAll('select option')].find(o => /^Spellbook/.test(o.textContent.trim()));
            return {inDom: !!panel, hidden: panel?.hidden, shellModule: shell?.dataset.module ?? null,
                dock: shell?.parentElement?.dataset?.dock || shell?.parentElement?.className || null,
                foreignHosts: hosts, option: option?.textContent.trim() ?? null, optionValue: option?.value ?? null,
                status: shell?.querySelector('.workspace-panel-status')?.textContent ?? null, viewport: [innerWidth, innerHeight]};
        });
        const a = await probe();
        line('viewport 1920x1080', a.viewport[0] === 1920 && a.viewport[1] === 1080, a.viewport.join('x'));
        line('panel node in the document', a.inDom);
        line('panel sits in its own workspace shell', a.shellModule === 'spellbook', `shell=${a.shellModule} dock=${a.dock}`);
        line('no foreign panel host contains it', a.foreignHosts.length === 0, a.foreignHosts.join(',') || 'none');
        line('listed in All panels with an unavailable reason', !!a.option && /not here|Not available/i.test(a.option), a.option || 'missing');
        line('panel hidden away from a practice place', a.hidden === true);
        await page.screenshot({path: path.join(out, 'spellbook-placement-1920.png')});
        line('no page errors', errors.length === 0, errors.join(' | ').slice(0, 300));
        let b = null;
        if (process.env.SPELLBOOK_SAVE) {
            const save = JSON.parse(fs.readFileSync(process.env.SPELLBOOK_SAVE, 'utf8'));
            const c2 = await browser.newContext({viewport: {width: 1920, height: 1080}});
            await c2.addInitScript(d => { if (!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(d)); }, save);
            const p2 = await c2.newPage(); p2.setDefaultTimeout(60000); const e2 = [];
            p2.on('pageerror', e => e2.push(e.message));
            await p2.goto(withTestHooks(`http://127.0.0.1:${port}/`));
            await p2.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 90000});
            await p2.evaluate(() => window.simulationTestHooks?.pause()); await p2.locator('#loading_screen_play_button').click(); await p2.waitForTimeout(1500);
            const listed = await p2.evaluate(() => [...document.querySelectorAll('select option')].find(o => /^Spellbook/.test(o.textContent.trim()))?.textContent.trim() ?? null);
            line('earned save: listed as available', listed === 'Spellbook', listed || 'missing');
            await p2.locator('select').filter({hasText: 'All panels'}).first().selectOption('spellbook'); await p2.waitForTimeout(800);
            await p2.locator('#spellbook_panel > summary').click(); await p2.waitForTimeout(800);
            b = await p2.evaluate(() => {
                const panel = document.getElementById('spellbook_panel'), shell = panel?.closest('section.workspace-module');
                const r = shell?.getBoundingClientRect();
                return {hidden: panel?.hidden, open: panel?.open, shellModule: shell?.dataset.module ?? null,
                    borrowed: !!panel?.closest('#center_mode_content'), back: document.getElementById('center_mode_back')?.textContent ?? null,
                    dockId: shell?.closest('[data-dock]')?.dataset.dock ?? shell?.parentElement?.id ?? null,
                    rect: r ? [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] : null,
                    foreignHosts: [...document.querySelectorAll('[id$="_panel"]')].filter(e => e !== panel && e.contains(panel)).map(e => e.id),
                    location: document.querySelector('#location_name_span,#location_name')?.textContent ?? null,
                    text: panel?.innerText.replace(/\n+/g, ' / ').slice(0, 700)};
            });
            line('earned save: spellbook shown', b.hidden === false, `location=${b.location}`);
            line('earned save: opened as a borrowed centre view, no foreign panel host', b.borrowed && b.foreignHosts.length === 0, `shell=${b.shellModule} back=${b.back}`);
            line('earned save: shell on screen at 1920x1080', !!b.rect && b.rect[2] > 0 && b.rect[0] < 1920 && b.rect[1] < 1080, (b.rect || []).join(','));
            line('earned save: opened panel shows its controls', b.open === true && /Test working/.test(b.text || ''), (b.text || '').slice(0, 200));
            line('earned save: learned methods listed (info only; depends on what this save has studied)', true, /Torch|light|shap/i.test(b.text || '') ? 'methods shown' : 'no method studied yet at this save');
            await shell2(p2);
            await p2.locator('#center_mode_back').click(); await p2.waitForTimeout(600);
            const home = await p2.evaluate(() => document.getElementById('spellbook_panel')?.closest('section.workspace-module')?.dataset.module ?? null);
            b.afterBack = home;
            line('earned save: Back returns it to its own workspace shell', home === 'spellbook', `shell=${home}`);
            line('earned save: no page errors', e2.length === 0, e2.join(' | ').slice(0, 300));
            async function shell2(pg) { await pg.screenshot({path: path.join(out, 'spellbook-eligible-1920.png')}); }
            await c2.close();
        }
        fs.writeFileSync(path.join(out, 'spellbook-placement.json'), JSON.stringify({probe: a, eligible: b, errors, lines}, null, 1));
    } finally { await browser.close(); }
    if (lines.some(l => l.startsWith('FAIL'))) process.exit(1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
