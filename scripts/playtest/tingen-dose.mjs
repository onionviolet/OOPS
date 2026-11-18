// Earned menu actions on a private rebuilt origin. Never reads a player profile.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'.');
const out=path.resolve(process.argv[3]||'work/tingen-dose-proof');
await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{
    let file=path.resolve(build,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(build+'/')){if(file!==build)throw Error('path');}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
const p=await context.newPage();p.setDefaultTimeout(20000);
const pageErrors = [];
p.on('pageerror',e=>pageErrors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click({timeout:60000});await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};

const open = () => p.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption('lotm');
const action = id => p.locator(`[data-lotm="${id}"]`);
const click = id => action(id).click();
const save = () => p.evaluate(() => { window.saveProgress(); return JSON.parse(localStorage.getItem('save data')); });
const step = minutes => p.evaluate(n => window.advanceTicks(n), minutes);
const mood = s => s.moodThoughts?.rows.filter(r => r.key === 'tingen-supervised-dose') ?? [];
const count = s => s.expansion.actors.player.completed['book.lotm.ingest'] ?? 0;
const receipt = {};
try {
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);
    await play();
    await open();
    for (const id of ['pick_probationer', 'enroll', 'book.lotm.report_in', 'book.lotm.accept_allocation']) await click(id);
    await p.locator('#lotm_panel [data-tab="here"]').click();
    const before = await save();
    assert.equal(count(before), 0);
    assert.deepEqual(mood(before), []);
    await click('book.lotm.ingest');
    const after = await p.evaluate(() => JSON.parse(localStorage.getItem('save data')));
    assert.equal(count(after), 1);
    assert.equal(mood(after).length, 1);
    assert.notEqual(mood(after)[0].magnitude, 0);
    const expected = mood(after);
    const condition = p.locator('#shell_condition [data-supervised-dose-condition]');
    const report = p.locator('#message_box_div :is(.log-original,.report-earlier)').filter({hasText: expected[0].line});
    const checkReceipt = async () => {
        const line = await condition.locator('span').textContent();
        assert.equal(line, expected[0].line);
        assert.equal(await report.count(), 1);
        assert.equal(await report.textContent(), line);
    };
    assert.equal(after.reports_dock.lines.filter(line => line === expected[0].line).length, 1);
    await checkReceipt();
    const liveReport = report.locator('..');
    if (await liveReport.isVisible()) await liveReport.screenshot({path: path.join(out, 'dose-report.png')});
    await step(1);
    const check = async () => {
        const state = await save();
        assert.equal(count(state), 1);
        assert.deepEqual(mood(state), expected);
        assert.equal(await action('book.lotm.ingest').count(), 0);
        await checkReceipt();
    };
    const roundTripText = () => p.evaluate(() => window.save_to_file());
    const importText = async literal => {
        await Promise.all([p.waitForEvent('load'), p.evaluate(text => window.load_progress(text), literal)]);
        await play();
        await open();
    };
    const preStep = await roundTripText();
    await step(600);
    await check();
    const long = await save();
    await importText(preStep);
    for (let i = 0; i < 6; i++) await step(100);
    await check();
    const short = await save();
    assert.equal(short.expansion.clock, long.expansion.clock);
    assert.deepEqual(short.storyEffects, long.storyEffects);
    assert(long.storyEffects.through >= 1);
    receipt.directorWindow = long.storyEffects.through;
    receipt.directorLandings = long.storyEffects.log;
    await condition.waitFor({state: 'visible'});
    await condition.screenshot({path: path.join(out, 'dose-condition.png')});
    await p.reload();
    await play();
    await open();
    await check();
    await importText(await roundTripText());
    await step(60);
    await check();
    await step(1440);
    {
        const expired = await save();
        assert.equal(count(expired), 1);
        assert(expired.expansion.clock >= expected[0].until);
        assert(!mood(expired).some(row => row.until > expired.expansion.clock));
        await condition.waitFor({state: 'hidden'});
        assert.equal(await report.count(), 1);
    }
    assert.deepEqual(pageErrors, []);
    receipt.bundleSha256 = createHash('sha256').update(await readFile(path.join(build, 'dist/bundle.js'))).digest('hex');
    receipt.sharedReceipt = expected[0].line;
    receipt.mood = expected[0];
    receipt.checks = ['earned allocation and ingestion', 'one immediately saved mood change and shared Reports/Condition receipt', '600-minute step and six 100-minute steps agree across director window', 'reload', 'literal Export/Import', 'expiry without replay'];
} catch (error) {
    receipt.error = error.stack;
    console.error(error);
    process.exitCode = 1;
    await p.screenshot({path: path.join(out, 'failure.png')}).catch(() => {});
} finally {
    await writeFile(path.join(out, 'result.json'), JSON.stringify(receipt, null, 2));
    await browser.close();
    server.close();
}
