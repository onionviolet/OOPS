const fs = require('node:fs');
const {chromium} = require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
const {pathToFileURL} = require('node:url');
exports.key = id => JSON.stringify({id});
exports.count = (save, id) => save.inventories.person.main_character[exports.key(id)]?.count || 0;
exports.put = (save, id, count) => {save.inventories.person.main_character[exports.key(id)] = {count};};
exports.create = async (url, name) => {
    const output = `/tmp/yairpg-nonfactorio-proof/${name}`;
    fs.mkdirSync(output, {recursive: true});
    const errors = [], findings = [], resourceErrors = []; let currentPage;
    const browser = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--disable-gpu', '--use-angle=swiftshader', `--yairpg-test-lane=nonfactorio-${name}`]});
    const record = finding => {findings.push(finding); fs.writeFileSync(`${output}/progress.json`, JSON.stringify({url, findings, errors, resourceErrors}, null, 2)); console.log(finding);};
    const save = async page => {await page.evaluate(() => window.saveProgress()); return page.evaluate(() => JSON.parse(localStorage.getItem('save data')));};
    const card = (page, title) => page.locator('#feature_expansion_panel details').filter({has: page.locator('summary').filter({hasText: title})});
    const here = async (page, title) => {
        if (!await page.locator('#notebook_box_div').isVisible()) await page.locator('#journal_show_notebook').click();
        await page.locator('[data-notebook-view="here"]').click();
        const panel = page.locator('#feature_expansion_panel');
        if (!await panel.evaluate(n => n.open)) await panel.locator(':scope > summary').click();
        const section = card(page, title);
        await section.locator(':scope > summary').waitFor();
        if (!await section.evaluate(n => n.open)) await section.locator(':scope > summary').click();
        return section;
    };
    const play = async page => {const button = page.locator('#loading_screen_play_button:not(.none_display)'); await button.waitFor(); if ((await button.innerText()).trim() !== 'PLAY') throw new Error('Save loading failed: ' + await page.locator('#loading_screen').innerText()); await button.click(); if (await page.getByText('Confirm', {exact: true}).isVisible()) await page.getByText('Confirm', {exact: true}).click();};
    const open = async fixture => {
        const context = await browser.newContext({viewport: {width: 1500, height: 1050}});
        if (fixture) await context.addInitScript(data => {if (!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(data));}, fixture);
        const page = currentPage = await context.newPage(); page.setDefaultTimeout(90000); page.setDefaultNavigationTimeout(120000);
        page.on('pageerror', e => errors.push(e.message)); page.on('requestfailed', r => resourceErrors.push({url:r.url(),failure:r.failure()?.errorText})); page.on('console', m => {if (m.type() === 'error') {if(!m.text().startsWith('Failed to load resource:'))errors.push(m.text()); console.log('Browser console: ' + m.text());}});
        console.log(`Opening ${name} generated fixture`);
        await page.goto(url, {waitUntil: 'domcontentloaded'}); await play(page);
        return {page, context};
    };
    const waitDone = (page, id, prior = 0) => page.waitForFunction(({id, prior}) => {
        window.saveProgress(); return JSON.parse(localStorage.getItem('save data')).expansion.actors.player.completed[id] > prior;
    }, {id, prior}, {timeout: 180000, polling: 1000});
    const reload = async page => {await page.reload({waitUntil: 'domcontentloaded'}); await play(page);};
    const importSave = async (page, fixture) => {
        const {encodeSaveFile} = await import(pathToFileURL(process.cwd() + '/src/save_files.js'));
        const loaded = page.waitForEvent('domcontentloaded', {timeout: 120000});
        await page.locator('#saved_file_input').setInputFiles({name: `generated-${name}.txt`, mimeType: 'text/plain', buffer: Buffer.from(encodeSaveFile(JSON.stringify(fixture)))});
        await loaded; await play(page);
    };
    const finish = async limits => {fs.writeFileSync(`${output}/result.json`, JSON.stringify({url, findings, errors, resourceErrors, limits}, null, 2)); await browser.close();};
    const fail = async error => {fs.writeFileSync(`${output}/failure.txt`, error.stack); if(currentPage && !currentPage.isClosed()) {await currentPage.screenshot({path: `${output}/failure.png`, timeout: 15000}).catch(() => {}); const visible = await currentPage.locator('body').innerText({timeout: 15000}).catch(() => 'unavailable'); fs.writeFileSync(`${output}/failure-ui.txt`, visible);} await browser.close().catch(() => {});};
    return {browser, errors, resourceErrors, output, record, save, card, here, open, waitDone, reload, importSave, finish, fail};
};
