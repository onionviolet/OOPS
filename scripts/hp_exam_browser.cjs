// HP lead exams in headless Chrome at 1920x1080 from a fresh origin. Route kind: FIXTURE (scripts/headless/hp_exam_fixture.mjs sets at-school/house and
// the clock; dev/test only). From there everything is player buttons: revise, save, reload, sit seven papers, read marks, save, reload.
// Between phases the saved clock is moved forward (the engine runs about 40 s per game day here): dev/test only, no new save field.
// Usage: node scripts/hp_exam_browser.cjs <fixture.json> [port]   Evidence: docs/gm/dispatch/hp-exams-2026-11-10/
const fs = require('node:fs'), assert = require('node:assert/strict');
const {launchChrome} = require('./ui_helpers.cjs');
const out = 'docs/gm/dispatch/hp-exams-2026-11-10', fixture = process.argv[2], port = process.argv[3] || '5131';
fs.mkdirSync(out, {recursive: true});
const SUBJECTS = ['Transfiguration', 'Charms', 'Herbology', 'Potions', 'Astronomy', 'Defence Against the Dark Arts', 'History of Magic'];
(async () => {
    const browser = await launchChrome(), errors = [], log = [];
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        const page = await context.newPage(); page.setDefaultTimeout(20000);
        page.on('pageerror', e => errors.push(e.message));
        const url = `http://127.0.0.1:${port}/?test_hooks=1`;
        const boot = async () => {
            await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 60000});
            await page.evaluate(() => window.simulationTestHooks.pause());
            await page.locator('#loading_screen_play_button').click(); await page.waitForTimeout(600);
        };
        const say = m => console.log('step', m);
        const text = async () => { await page.locator('#workspace_navigation select').first().selectOption('hp').catch(() => {}); await page.waitForTimeout(200); return page.locator('#hp_panel').innerText(); };
        const exams = async () => (await text()).split('End-of-year exams')[1] || '';
        const step = async n => { await page.evaluate(n => window.advanceTicks(n), n); await page.waitForTimeout(200); };
        const shot = async n => { await page.locator('#hp_panel').scrollIntoViewIfNeeded().catch(() => {}); await page.screenshot({path: `${out}/${n}.png`}); };
        const save = () => page.evaluate(() => { window.saveProgress(); return localStorage.getItem('save data'); });
        const press = async sel => {
            for(let i = 0; i < 12; i++) {
                await page.locator('#workspace_navigation select').first().selectOption('hp').catch(() => {}); await page.waitForTimeout(150);
                const b = page.locator(sel + ':not([disabled])').first();
                if(await b.count()) { await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(150); return true; }
                await step(60);
            }
            return false;
        };
        const settle = async () => { for(let i = 0; i < 8; i++) { await step(30); } };
        const moveTo = async day => {
            const raw = await save(), s = JSON.parse(raw);
            s.expansion.clock = day * 1440 + 60; const t = s['current time'];
            t.day_count = day + 1; t.hour = 9; t.minute = 0; const m = 3 + Math.floor(day / 30); t.year = 999 + Math.floor(m / 12); t.month = 1 + m % 12; t.day = 1 + day % 30;
            await page.evaluate(v => { localStorage.setItem('save data', v); }, JSON.stringify(s));
            await page.reload(); await boot();
        };
        // Fresh origin: new context, the fixture is the only stored save.
        await page.goto(`http://127.0.0.1:${port}/robots.txt`);
        await page.evaluate(v => localStorage.setItem('save data', v), fs.readFileSync(fixture, 'utf8'));
        await page.goto(url); await boot();
        let t = await exams();
        assert.match(t, /The exams (are on|begin on)/); assert.match(t, /Revise Charms/); await shot('1-revision-open');
        log.push({step: 'revision open', text: t.slice(0, 400)});
        // Revision: six Charms sessions (the cap), three Potions; stamina is a real cost, so rest between presses when a button is shut.
        for(let i = 0; i < 6; i++) assert.ok(await press('[data-hp-revise="charms"] button'), 'revise charms ' + i), await step(95);
        for(let i = 0; i < 3; i++) assert.ok(await press('[data-hp-revise="potions"] button'), 'revise potions ' + i), await step(95);
        t = await exams(); assert.match(t, /Charms[\s\S]{0,200}6 of 6 sessions/); assert.match(t, /Potions[\s\S]{0,200}3 of 6 sessions/);
        assert.equal(await page.locator('[data-hp-revise="charms"] button:not([disabled])').count(), 0, 'past the cap the notes add nothing');
        log.push({step: 'revised', text: t.slice(0, 700)}); await shot('2-revised');
        say('Save and reload keeps');
        // Save and reload keeps the sessions.
        await save(); await page.reload(); await boot();
        t = await exams(); assert.match(t, /6 of 6 sessions/); log.push({step: 'after reload', text: t.slice(0, 300)});
        say('Exam day.');
        // Exam day.
        await moveTo(321);
        t = await exams(); assert.match(t, /Exam week/); assert.match(t, /Sit the Transfiguration paper/); await shot('3-exam-day');
        for(const label of SUBJECTS) {
            assert.match(await exams(), new RegExp(`Sit the ${label} paper`), 'next paper is ' + label);
            assert.ok(await press('[data-hp-paper] button'), 'paper ' + label); await step(100);
        }
        t = await exams(); assert.match(t, /All papers sat/); assert.doesNotMatch(t, /high marks|good marks|a pass|not a pass/, 'no band before the marks day'); await shot('4-papers-sat');
        log.push({step: 'papers sat', text: t.slice(0, 400)});
        say('Save/reload with the papers sat');
        // Save/reload with the papers sat, then the last day of term.
        await save(); await page.reload(); await boot(); assert.match(await exams(), /All papers sat/);
        await moveTo(329);
        assert.ok(await press('[data-hp-marks] button'), 'read the marks'); await step(20);
        t = await exams(); assert.match(t, /Overall: /); for(const label of SUBJECTS) assert.match(t, new RegExp(label + ': '));
        assert.match(t, /Next year|expect more|repeat|from where this one left you/); await shot('5-results');
        log.push({step: 'results', text: t.slice(0, 1200)});
        await save(); await page.reload(); await boot(); const again = await exams();
        assert.match(again, /Overall: /); assert.equal(again.match(/Overall: [^\n]*/)[0], t.match(/Overall: [^\n]*/)[0], 'the marks survive reload unchanged');
        await shot('6-results-after-reload');
        assert.deepEqual(errors, [], errors.join('|'));
        fs.writeFileSync(`${out}/run-log.json`, JSON.stringify({route: 'fixture', errors, log}, null, 1));
        console.log('OK'); console.log(t.slice(0, 1200));
    } finally { await browser.close(); }
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
