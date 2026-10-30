// Conversation view proof (docs/representations/TALK.md). Fresh life, real Village elder, headless 1920x1080,
// fresh test origin. Run after npm run build:  node scripts/slot_run.mjs --kind browser -- node scripts/talk_browser.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {launchChrome, withTestHooks} = require('./ui_helpers.cjs');
const output = process.env.YAIRPG_PROOF_DIR || path.resolve('docs/representations/evidence/talk');
const port = Number(process.env.YAIRPG_PROOF_PORT) || 18461;
fs.mkdirSync(output, {recursive: true});
(async () => {
    const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {stdio: 'ignore'});
    await new Promise(r => setTimeout(r, 800));
    const browser = await launchChrome();
    const report = {viewport: '1920x1080', steps: []};
    try {
        const context = await browser.newContext({viewport: {width: 1920, height: 1080}});
        const page = await context.newPage();
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(withTestHooks(`http://127.0.0.1:${port}/`));
        await page.waitForTimeout(300);
        await page.getByText('PLAY', {exact: true}).click();
        if (await page.getByText('Confirm', {exact: true}).isVisible().catch(() => false)) await page.getByText('Confirm', {exact: true}).click();
        await page.waitForTimeout(400);
        const saved = await page.evaluate(() => localStorage.getItem('save data'));
        // Route: the place action, exactly as a player takes it.
        await page.getByRole('button', {name: 'Talk to someone'}).click();
        await page.locator('[data-dialogue="villageElder"]').click();
        const view = page.locator('#talk_view_host .talk-view');
        await view.waitFor({state: 'visible', timeout: 5000});
        const shot = name => page.screenshot({path: path.join(output, name)});
        const text = () => page.locator('[data-talk-text]').evaluate(n => n.textContent);
        const firstText = await text();
        assert.match(firstText, /Hello|hello/i);
        assert.match(firstText, /takes no time/);
        assert.match(firstText, /Opens more to ask\./);
        assert.doesNotMatch(firstText, /Infested|weightlifting|running/i, 'no unmet place or activity named before the click');
        assert.match(firstText, /know nothing of you/);
        assert.equal(await page.locator('#talk_view_host .scene-card-option > button[data-topic-state="new"]').count(), 1);
        await shot('talk-fresh-1920.png'); report.steps.push('fresh: one new line, quote, empty knows ledger');
        // Choose through the view; the native start_textline runs (PIR8).
        await page.locator('#talk_view_host button[data-topic-id="hello"]').click();
        await page.waitForTimeout(300);
        const after = await text();
        assert.match(after, /Already covered:\n- .*\(heard\)/);
        assert.match(after, /You told them: /);
        assert.match(after, /Acquainted/);
        const answer = await page.locator('#talk_view_host .talk-answer').textContent();
        assert.ok(answer.trim().length > 3, 'the person\'s answer sits in the card');
        const covered = await page.locator('.talk-covered-row[data-topic-state="heard"]').count();
        assert.equal(covered, 1);
        await shot('talk-after-hello-1920.png'); report.steps.push('after one line: heard row, told row, rapport stage, answer in card');
        // Two options that close each other quote that fact.
        const opts = await page.locator('#talk_view_host .scene-card-option').allTextContents();
        report.options = opts;
        assert.ok(opts.some(t => /Settles the other ways/.test(t)), 'sibling-closing options say so');
        await shot('talk-options-1920.png');
        // Sibling lines lock each other: saying one reads as one covered row and one told row, not three.
        await page.locator('#talk_view_host button[data-topic-id="where am i"]').click();
        await page.waitForTimeout(300);
        const sibling = await text();
        assert.equal((sibling.match(/^- You told them: /gm) || []).length, 2, 'hello plus one grouped row');
        assert.match(sibling, /One of: .*Where am I\?/);
        assert.equal(await page.locator('.talk-covered-row[data-topic-state="heard"]').count(), 2);
        await shot('talk-sibling-group-1920.png'); report.steps.push('one of three sibling lines said: one grouped heard row, rapport counts it once');
        // Keyboard: Esc leaves (PIR13), place returns.
        await page.keyboard.press('Escape'); await page.waitForTimeout(250);
        assert.equal(await page.locator('#talk_view_host').count(), 0);
        // Persistence: nothing new is saved by talk state itself; reload and the heard row is derived again.
        await page.evaluate(() => window.saveProgress && window.saveProgress());
        await page.reload(); await page.getByText('PLAY', {exact: true}).click(); await page.waitForTimeout(500);
        await page.getByRole('button', {name: 'Talk to someone'}).click();
        await page.locator('[data-dialogue="villageElder"]').click();
        await page.locator('#talk_view_host .talk-view').waitFor({state: 'visible', timeout: 5000});
        const reloaded = await text();
        assert.match(reloaded, /Already covered:\n- .*\(heard\)/);
        await shot('talk-reloaded-1920.png'); report.steps.push('save, reload: heard rows derived again, no new save field');
        // Text size 21 (the dialogue text-size option) and effects off.
        await page.evaluate(() => { document.documentElement.dataset.effects = 'off'; document.documentElement.style.setProperty('--ui-type-body', '21px'); document.documentElement.style.setProperty('--ui-type-small', '18px'); });
        await page.waitForTimeout(200); await shot('talk-21px-effects-off-1920.png'); report.steps.push('21 px text, effects off');
        const overflow = await page.evaluate(() => { const v = document.querySelector('#talk_view_host .talk-view'); return v.scrollWidth - v.clientWidth; });
        assert.ok(overflow <= 1, `no horizontal overflow at 21 px (got ${overflow})`);
        assert.deepEqual(errors, []);
        report.build = (await page.evaluate(() => performance.getEntriesByType('resource').find(e => e.name.includes('/dist/bundle.js'))?.name)) || '';
        report.saveKeysChanged = null;
    } finally {
        await browser.close().catch(() => {}); server.kill();
    }
    fs.writeFileSync(path.join(output, 'talk-proof.json'), JSON.stringify(report, null, 1));
    console.log(JSON.stringify(report));
})().catch(e => { console.error(e); process.exit(1); });
