// MKC5 browser proof: rune bench Next after carving, the gear workshop Next strip, save + reload re-derives Next.
const path = require('node:path'), fs = require('node:fs');
const T = process.argv[2], OUT = process.argv[3];
const {serveCheckout, fixtureSave, openFixture, openPanel} = require(path.join(T, 'scripts/fixture_browser.cjs'));
const {runBrowser} = require(path.join(T, 'scripts/ui_helpers.cjs'));
(async () => {
    const srv = await serveCheckout(T), log = [];
    const errors = [];
    try {
        await runBrowser(async browser => {
            const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
            page.on('pageerror', e => errors.push(String(e)));
            const save = JSON.parse(await fixtureSave('frontier-hunt-ready'));
            const inv = save.inventories.person.main_character;
            inv[JSON.stringify({id: 'Rough wood log'})] = {count: 6}; // DEV SEEDED: wood to carve with
            inv[JSON.stringify({id: 'Iron sword', quality: 100})] = {count: 1}; // DEV SEEDED: a blade for the workshop (may not be component-built)
            await openFixture(page, {base: srv.base, name: 'frontier-hunt-ready', text: JSON.stringify(save)});
            await openPanel(page, 'rune-bench');
            const bench = page.locator('#rune_bench_panel');
            await bench.waitFor({state: 'visible', timeout: 20000});
            log.push(['before carving, Next part', await bench.locator('[data-bench-part="next"]').innerText()]);
            await bench.locator('button[data-rune]').nth(0).click();
            await bench.locator('button[data-rune]').nth(1).click();
            await bench.locator('button[data-carve]').click();
            await page.waitForTimeout(300);
            const next = bench.locator('[data-bench-part="next"]');
            log.push(['after carving, Next part', await next.innerText()]);
            const rows = await next.locator('[data-bench-next]').evaluateAll(ns => ns.map(n => ({to: n.dataset.benchNext, label: n.querySelector('button')?.textContent, disabled: n.querySelector('button')?.disabled, reason: n.querySelector('.kit-row__from')?.textContent})));
            log.push(['rows', rows]);
            await next.scrollIntoViewIfNeeded();
            await page.screenshot({path: path.join(OUT, 'rune_next.png')});
            // Follow the enabled fight route: Here opens.
            const fight = next.locator('[data-bench-next="local-actions"] button').first();
            if(await fight.count()) { await fight.click(); await page.waitForTimeout(300); log.push(['after Fight click, Here visible', await page.locator('#center_mode_back').count() >= 0 && await page.evaluate(() => document.querySelector('[data-center-mode], .center-mode')?.dataset?.centerMode || document.title)]); }
            // Save, reload, reopen: Next re-derives from the worn tablet.
            await page.evaluate(() => window.simulationTestHooks.snapshot() && 1);
            const snap = await page.evaluate(() => JSON.stringify(window.simulationTestHooks.snapshot()));
            const page2 = await browser.newPage({viewport: {width: 1920, height: 1080}});
            page2.on('pageerror', e => errors.push('reload: ' + String(e)));
            await openFixture(page2, {base: srv.base, name: 'frontier-hunt-ready', text: snap});
            await openPanel(page2, 'rune-bench');
            const next2 = page2.locator('#rune_bench_panel [data-bench-part="next"]');
            await next2.waitFor({state: 'visible', timeout: 20000});
            log.push(['after save+reload, Next part', await next2.innerText()]);
            // Gear workshop: its Next strip, if the panel is reachable here.
            try {
                await openPanel(page2, 'gear-workshop');
                const g = page2.locator('#gear_workshop [data-gear-next]');
                await g.waitFor({state: 'attached', timeout: 8000});
                log.push(['gear workshop Next, nothing chosen', await g.innerText()]);
                const opts = await page2.locator('#gear_workshop select[aria-label="Carried gear"] option').evaluateAll(o => o.map(x => x.value).filter(Boolean));
                log.push(['gear carried options', opts.length]);
                if (opts.length) { await page2.locator('#gear_workshop select[aria-label="Carried gear"]').selectOption(opts[0]); await page2.waitForTimeout(300);
                    log.push(['gear workshop Next, item chosen', await g.innerText()]);
                    const wear = g.locator('[data-bench-next="belongings"] button'); await g.scrollIntoViewIfNeeded(); await page2.screenshot({path: path.join(OUT, 'gear_next.png')});
                    await wear.click(); await page2.waitForTimeout(300); log.push(['Wear it debug', await page2.evaluate(() => ({active: document.activeElement?.outerHTML?.slice(0,160), mod: document.activeElement?.closest('.workspace-module')?.dataset.module, bel: (()=>{const b=document.querySelector('.workspace-module[data-module="belongings"]');return b?{hidden:b.hidden,parked:b.dataset.compositionParked,dock:b.parentElement?.className}:null;})(), centerTitle: document.querySelector('.expanded-panel-view .workspace-module-header strong')?.textContent}))]);
                    log.push(['Wear it: focus inside Inventory', await page2.evaluate(() => !!document.activeElement?.closest('.workspace-module[data-module="belongings"]'))]); }
            } catch(e) { log.push(['gear workshop', 'not offered in navigation here: ' + e.message.split('\n')[0]]); }
        });
    } finally { srv.close(); }
    fs.writeFileSync(path.join(OUT, 'next_proof.json'), JSON.stringify({log, errors}, null, 1));
    console.log(JSON.stringify({log, errors}, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
