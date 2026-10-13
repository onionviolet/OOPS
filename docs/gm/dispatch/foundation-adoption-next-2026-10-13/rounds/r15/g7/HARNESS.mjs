// R15 G7 FA21 browser proof: live authored site editor on the rebuilt bundle.
// Usage: serve the worktree on 127.0.0.1:19170, then `node HARNESS.mjs`.
// Profiles live under /private/tmp/r15-g7-profile-* and are never committed.
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs'; import crypto from 'node:crypto';
const out = new URL('.', import.meta.url).pathname, shots = out + 'shots/', root = new URL('../../../../../../../', import.meta.url).pathname;
fs.mkdirSync(shots, {recursive: true});
const ORIGIN = 'http://127.0.0.1:19170/', stamp = Date.now();
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const results = [], log = (step, ok, detail = {}) => {results.push({step, ok, ...detail}); console.log((ok ? 'PASS ' : 'FAIL ') + step, JSON.stringify(detail).slice(0, 400));};
const launch = async name => {
    const context = await chromium.launchPersistentContext(`/private/tmp/r15-g7-profile-${name}-${stamp}`, {executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, viewport: {width: 1600, height: 1100}, acceptDownloads: true});
    const page = context.pages()[0] || await context.newPage(); page.setDefaultTimeout(8000);
    page.errors = []; page.on('pageerror', e => page.errors.push(e.message));
    page.bundle = null; page.on('response', async r => {if(r.url().includes('/dist/bundle.js?')) try {page.bundle = hash(await r.body());} catch {}});
    return {context, page};
};
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('dev save data') || localStorage.getItem('save data') || 'null'));
const shot = (page, name) => page.screenshot({path: shots + name + '.jpg', type: 'jpeg', quality: 60});
const field = (page, key) => page.locator('#authored_site_' + key);
const waitFor = async (fn, ms = 20000) => {const end = Date.now() + ms; while(Date.now() < end) {if(await fn()) return true; await new Promise(r => setTimeout(r, 250));} return false;};
const row = async page => (await saved(page))?.content_packs?.packs?.authored_site;
async function openGame(page) {
    await page.goto(ORIGIN, {waitUntil: 'domcontentloaded'});
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 30000});
    await page.locator('#loading_screen_play_button').click();
}
async function toAuthoring(page) {if(await page.getByRole('button', {name: 'Authoring', exact: true}).count()) await page.getByRole('button', {name: 'Authoring', exact: true}).click(); await page.locator('#authored_site_editor').waitFor({state: 'visible'});}
async function toPlay(page) {if(await page.getByRole('button', {name: 'Return to play', exact: true}).count()) await page.getByRole('button', {name: 'Return to play', exact: true}).click();}

const builtHash = hash(fs.readFileSync(root + 'dist/bundle.js'));
const {context, page} = await launch('main');
try {
    // 1. Fresh origin new game.
    await openGame(page);
    await page.locator('input').filter({hasText: ''}).first();
    const nameInput = page.locator('#hero_creation_name_field').first();
    if(await nameInput.count()) await nameInput.fill('TEST FIXTURE R15 FA21');
    await page.getByText('Confirm', {exact: true}).click();
    await page.waitForTimeout(1500);
    log('fresh origin new game on rebuilt bundle', page.bundle === builtHash, {served: page.bundle, built: builtHash});
    await page.locator('#save_button').click();
    await page.waitForTimeout(500);
    // Old-format baseline save export: no authored content.
    const baselineDl = page.waitForEvent('download'); await page.locator('#save_to_file_button').click();
    await (await baselineDl).saveAs(out + 'save-before-authoring.txt');
    const before = await saved(page);
    log('baseline save has no authored content', before && !before.content_packs?.authored, {money: before?.character?.money});

    // 2. Authoring surface.
    await toAuthoring(page); await shot(page, '01-authoring-default');
    log('editor visible in Authoring with default proposal', await field(page, 'siteName').inputValue() === 'Reed Hollow');

    // 3. Invalid draft rejected, game unchanged.
    await field(page, 'siteName').fill('');
    await field(page, 'minutes').fill('0');
    await field(page, 'inputCost').fill('9');
    await page.locator('#authored_site_apply').click();
    const errs = await page.locator('#authored_site_errors li').allInnerTexts();
    await shot(page, '02-invalid-rejected');
    const afterInvalid = await saved(page);
    log('invalid draft rejected with reasons and save unchanged', errs.length >= 2 && !afterInvalid.content_packs?.authored && !(await page.locator('#optional_content_panel').isVisible().catch(() => false)), {errs});

    // 4. Valid draft via keyboard: type in fields, Enter submits Apply.
    await field(page, 'siteName').focus(); await page.keyboard.type('Reed Hollow');
    await field(page, 'minutes').focus(); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.type('6');
    await field(page, 'inputCost').focus(); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.type('3');
    await field(page, 'gatherMinutes').focus(); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.type('4');
    await page.keyboard.press('Enter');
    await waitFor(async () => (await saved(page))?.content_packs?.authored);
    const applied = await saved(page);
    await shot(page, '03-applied');
    log('valid draft applied by keyboard and saved', applied.content_packs.authored?.draft?.minutes === 6 && applied.content_packs.authored.draft.siteName === 'Reed Hollow', {status: await page.locator('#authored_site_status').innerText(), errors: await page.locator('#authored_site_errors li').allInnerTexts(), minutes: await field(page, 'minutes').inputValue(), cost: await field(page, 'inputCost').inputValue()});

    // 5. Play: Go to site opens play with Optional worlds expanded; visit the site.
    await page.locator('#authored_site_open').click();
    const focused0 = await page.evaluate(() => document.activeElement?.textContent);
    await page.keyboard.press('Tab');
    const focused1 = await page.evaluate(() => document.activeElement?.textContent);
    log('Go to site opens play: panel summary focused, Tab reaches Visit', focused0 === 'Optional worlds' && focused1 === 'Visit Reed Hollow', {focused0, focused1});
    const visit = page.getByRole('button', {name: 'Visit Reed Hollow'});
    await visit.waitFor({state: 'visible'}); await visit.click();
    await waitFor(async () => (await row(page))?.active);
    await page.waitForTimeout(500); await shot(page, '04-visiting');
    const loc = (await saved(page))['current location'];
    log('visit moves player to authored site', loc === 'authored_site.site', {loc, values: (await row(page)).values});

    // 6. Perform activity to completion: cost, duration on native clock, product and coin.
    const money0 = (await saved(page)).character.money;
    await page.getByRole('button', {name: 'Weave a reed mat', exact: true}).click();
    await waitFor(async () => (await row(page))?.job);
    const started = await row(page);
    log('activity start debits material and starts timed work', started.values.input === 3 && started.job.remaining > 0, {values: started.values, job: started.job});
    await page.waitForTimeout(2500); await shot(page, '05-working');
    const bar = await page.locator('#workspace_current_work').innerText().catch(() => '');
    const spam = (await page.locator('#message_log_div').innerText()).split('Return from your optional world').length - 1;
    log('current-work bar names the site work; no occupation-message spam while visiting', /Weave a reed mat: \d+ min remaining/.test(bar) && spam === 0, {bar, spam});
    await waitFor(async () => {const r = await row(page); return r && !r.job;}, 30000);
    const done = await saved(page), doneRow = done.content_packs.packs.authored_site;
    log('settlement once: product +1 and native coin +8', doneRow.values.output === 1 && done.character.money === money0 + 8, {values: doneRow.values, money0, money: done.character.money});
    await page.waitForTimeout(3000);
    const later = await saved(page);
    log('no duplicate reward after more clock', later.character.money === money0 + 8 && later.content_packs.packs.authored_site.values.output === 1);
    await shot(page, '06-settled');

    // 7. Cancel mid-run.
    await page.getByRole('button', {name: 'Weave a reed mat', exact: true}).click();
    await waitFor(async () => (await row(page))?.job);
    const midInput = (await row(page)).values.input;
    await page.getByRole('button', {name: 'Cancel work'}).click();
    await waitFor(async () => {const r = await row(page); return r && !r.job;});
    await page.waitForTimeout(7000);
    const cancelled = await saved(page), cr = cancelled.content_packs.packs.authored_site;
    await shot(page, '07-cancelled');
    log('cancel refunds material, no product, no pay', midInput === 0 && cr.values.input === 3 && cr.values.output === 1 && cancelled.character.money === money0 + 8, {midInput, values: cr.values, money: cancelled.character.money});

    // 8. Editing is blocked while visiting; edit after returning changes eligibility.
    await toAuthoring(page);
    log('apply disabled while visiting the site', await page.locator('#authored_site_apply').isDisabled(), {applied: await page.locator('#authored_site_applied').innerText()});
    await toPlay(page);
    await page.getByRole('button', {name: 'Return to Village'}).click();
    await waitFor(async () => !(await row(page))?.active);
    await toAuthoring(page);
    await field(page, 'requiredInput').fill('5'); await field(page, 'activityName').fill('Weave a fine mat');
    await page.locator('#authored_site_apply').click();
    await waitFor(async () => (await saved(page))?.content_packs?.authored?.draft?.requiredInput === 5);
    await toPlay(page); await page.getByRole('button', {name: 'Visit Reed Hollow'}).click();
    await waitFor(async () => (await row(page))?.active);
    const weave = page.getByRole('button', {name: 'Weave a fine mat', exact: true});
    await weave.waitFor({state: 'visible'});
    const blocked = await weave.isDisabled(), blockerText = await page.locator('[data-pack-row="authored_site.work"]').innerText();
    await shot(page, '08-edited-eligibility');
    log('edited requirement blocks the activity at 3 material', blocked && /prerequisites are not met/.test(blockerText), {blockerText});
    await page.getByRole('button', {name: 'Gather Reeds', exact: true}).click();
    await waitFor(async () => {const r = await row(page); return r && !r.job && r.values.input === 5;}, 20000);
    log('gather settles on the clock and re-enables the activity', !(await weave.isDisabled()), {values: (await row(page)).values});
    await page.getByRole('button', {name: 'Return to Village'}).click();
    await waitFor(async () => !(await row(page))?.active);

    // 9. Export the authored draft file.
    await toAuthoring(page);
    const dl = page.waitForEvent('download'); await page.locator('#authored_site_export').click();
    const download = await dl; await download.saveAs(out + 'authored-site.json');
    const exported = JSON.parse(fs.readFileSync(out + 'authored-site.json', 'utf8'));
    log('export writes authored-site.json', exported.format === 'yairpg-authored-site' && exported.draft.requiredInput === 5, {exported: exported.draft.activityName});

    // 10. Reset to defaults.
    await page.locator('#authored_site_reset').click();
    await waitFor(async () => !(await saved(page))?.content_packs?.authored);
    const reset = await saved(page);
    await shot(page, '09-reset');
    await toPlay(page);
    log('reset removes site, its progress and registration; money kept', !reset.content_packs.packs.authored_site && !reset.content_packs.registered?.authored_site && !reset.expansion?.worlds?.['authored_site.world'] && reset.character.money === money0 + 8 && await page.getByRole('button', {name: 'Visit Reed Hollow'}).count() === 0, {packs: Object.keys(reset.content_packs.packs)});

    // 11. Rejected imports leave the draft; valid import then Apply.
    await toAuthoring(page);
    fs.writeFileSync('/private/tmp/r15-g7-future.json', JSON.stringify({...exported, version: 2}));
    await page.locator('#authored_site_import').setInputFiles('/private/tmp/r15-g7-future.json');
    await page.waitForTimeout(300);
    const futureErr = await page.locator('#authored_site_errors').innerText();
    log('future-version import rejected', /newer version/.test(futureErr) && !(await saved(page)).content_packs.authored, {futureErr});
    await page.locator('#authored_site_import').setInputFiles(out + 'authored-site.json');
    await page.waitForTimeout(300);
    log('import fills the draft from file', await field(page, 'activityName').inputValue() === 'Weave a fine mat');
    await page.locator('#authored_site_apply').click();
    await waitFor(async () => (await saved(page))?.content_packs?.authored?.draft?.activityName === 'Weave a fine mat');
    await shot(page, '10-imported-applied');
    await toPlay(page);
    await page.getByRole('button', {name: 'Visit Reed Hollow'}).click();
    await waitFor(async () => (await row(page))?.active);
    await page.getByRole('button', {name: 'Gather Reeds', exact: true}).click();
    await waitFor(async () => (await row(page))?.job);
    log('imported site runs: fresh progress after reset', (await row(page)).values.input === 6, {values: (await row(page)).values});

    // 12. Save, reload mid-work.
    await page.locator('#save_button').click(); await page.waitForTimeout(300);
    const preReload = await saved(page);
    await page.reload({waitUntil: 'domcontentloaded'});
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 30000}).catch(() => {});
    if(await page.locator('#loading_screen_play_button').isVisible()) await page.locator('#loading_screen_play_button').click();
    await page.getByRole('button', {name: 'Return to Village'}).waitFor({state: 'visible', timeout: 15000});
    const postReload = await saved(page);
    await shot(page, '11-after-reload');
    log('reload restores authored site, location and running work', postReload['current location'] === 'authored_site.site' && postReload.content_packs.authored.draft.activityName === 'Weave a fine mat' && !!postReload.content_packs.packs.authored_site.job, {job: postReload.content_packs.packs.authored_site.job, preJob: preReload.content_packs.packs.authored_site.job});
    await waitFor(async () => {const r = await row(page); return r && !r.job;}, 20000);
    log('work resumed after reload settles once', (await row(page)).values.input === 8, {values: (await row(page)).values});

    // 13. Export save file.
    await page.getByRole('button', {name: 'Return to Village'}).click();
    await waitFor(async () => !(await row(page))?.active);
    await page.locator('#save_button').click(); await page.waitForTimeout(300);
    const exportSave = page.waitForEvent('download'); await page.locator('#save_to_file_button').click();
    await (await exportSave).saveAs(out + 'save-with-authored.txt');
    const finalSave = await saved(page);
    log('exported save file written', fs.statSync(out + 'save-with-authored.txt').size > 1000);
    fs.writeFileSync(out + 'STATE_BEFORE_IMPORT.json', JSON.stringify({money: finalSave.character.money, location: finalSave['current location'], content_packs: finalSave.content_packs}, null, 2));
    log('no page errors in main profile', page.errors.length === 0, {errors: page.errors});
} catch(error) {
    log('harness exception', false, {error: error.stack}); await shot(page, 'ERROR-main');
} finally {await context.close();}

// 14. Literal-file import into a fresh origin profile and state comparison.
for(const [label, file, expectAuthored] of [['import-authored', 'save-with-authored.txt', true], ['import-old', 'save-before-authoring.txt', false]]) {
    if(!fs.existsSync(out + file)) {log(label + ' skipped: no file', false); continue;}
    const {context, page} = await launch(label);
    try {
        await openGame(page);
        const name = page.locator('#hero_creation_name_field').first();
        if(await name.count()) await name.fill('TEST FIXTURE R15 FA21 import');
        await page.getByText('Confirm', {exact: true}).click(); await page.waitForTimeout(1000);
        const nav = page.waitForEvent('load', {timeout: 90000});
        await page.locator('#saved_file_input').setInputFiles(out + file);
        await nav;
        await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 30000}).catch(() => {});
        if(await page.locator('#loading_screen_play_button').isVisible()) await page.locator('#loading_screen_play_button').click();
        await page.waitForTimeout(1500);
        const s = await saved(page);
        if(expectAuthored) {
            const want = JSON.parse(fs.readFileSync(out + 'STATE_BEFORE_IMPORT.json', 'utf8'));
            const got = {money: s.character.money, location: s['current location'], content_packs: s.content_packs};
            fs.writeFileSync(out + 'STATE_AFTER_IMPORT.json', JSON.stringify(got, null, 2));
            const same = JSON.stringify(want) === JSON.stringify(got);
            await page.getByRole('button', {name: 'Visit Reed Hollow', includeHidden: true}).waitFor({state: 'attached'});
            await shot(page, '12-imported-save');
            log('literal-file import restores identical authored state and site', same, same ? {} : {want: JSON.stringify(want).slice(0, 300), got: JSON.stringify(got).slice(0, 300)});
        } else {
            await shot(page, '13-old-save-import');
            const msgs = await page.locator('#message_log_div').innerText().catch(() => '');
            log('old save without authored content imports unchanged; no site', !s.content_packs?.authored && await page.getByRole('button', {name: /Visit/}).count() === 0 && s.character.name === 'TEST FIXTURE R15 FA21', {name: s.character.name, msgs: msgs.slice(0, 400)});
        }
        log(`no page errors (${label})`, page.errors.length === 0, {errors: page.errors});
    } catch(error) {log(label + ' exception', false, {error: error.stack}); await shot(page, 'ERROR-' + label);}
    finally {await context.close();}
}
fs.writeFileSync(out + 'RESULT.json', JSON.stringify({bundleSha256: builtHash, viewport: '1600x1100', origin: ORIGIN, label: 'natural (fresh new game, all steps through the UI; no seeded save)', results}, null, 2));
console.log(results.filter(r => !r.ok).length ? 'SOME FAILED' : 'ALL PASS');
