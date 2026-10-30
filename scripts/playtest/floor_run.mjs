// Scripted browser floor (AD43): runs a scenario of clicks and waits in headless Chrome at 1920x1080
// on a fresh origin against a freshly built bundle, with a save/reload/Export/Import roundtrip,
// page-error capture, screenshots and a short JSON receipt.
// Usage: node scripts/slot_run.mjs --kind browser -- node scripts/playtest/floor_run.mjs <scenario.json> [--out dir]
// Screenshots can show sealed text: the default out dir is under $TMPDIR and is never committed.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {canonicalSave} from '../headless/runner.mjs';
import {buildBundle, serve, Session, sha, stateHash} from './lib.mjs';
import {classifyReload} from './run.mjs';
import {receiptLine, refSelector, summarizeReceipt, validateScenario} from './floor_receipt.mjs';

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const out = path.resolve(outFlag >= 0 ? args.splice(outFlag, 2)[1] : path.join(tmpdir(), 'yairpg-floor'));
const file = args[0];
if(!file) {console.error('usage: floor_run.mjs <scenario.json> [--out dir]'); process.exit(2);}
const scenario = JSON.parse(await fs.readFile(file, 'utf8'));
const problems = validateScenario(scenario);
if(problems.length) {console.error('scenario problems:\n- ' + problems.join('\n- ')); process.exit(2);}

const evidence = path.join(out, scenario.name);
await fs.rm(evidence, {recursive:true, force:true});
await fs.mkdir(evidence, {recursive:true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const bundleHash = sha(await fs.readFile(path.join(bundle.dir, 'bundle.js')));
const s = await new Session({
    url: server.url, opTimeout: scenario.opTimeoutMs ?? 30000, seed: scenario.seed ?? 7, wall: scenario.wall ?? Date.UTC(2026, 9, 30),
    // Private packs are machine-local: blocked unless the scenario sets privatePacks (the be seat needs the cast pack).
    hooks: {beforeOpen: async c => {if(!scenario.privatePacks) await c.route('**/private_packs/manifest.json', r => r.fulfill({json:{schema:1, packs:[]}}));}},
}).start();

const pause = (ms = scenario.pauseMs ?? 350) => s.page.waitForTimeout(ms);
const nav = async id => {
    await s.page.keyboard.press('Escape');
    await s.page.locator('#workspace_navigation select').first().selectOption(id);
    await pause();
};
const locate = st => {
    const scope = st.within ? s.page.locator(st.within) : s.page;
    if(st.selector) return scope.locator(st.selector).nth(st.nth ?? 0);
    if(st.ref) return scope.locator(refSelector(st.ref)).nth(st.nth ?? 0);
    const re = st.textRe ? new RegExp(st.textRe) : undefined;
    return scope.locator('button, [role=button], a, summary, .sl_button, label', {hasText: re ?? st.text}).nth(st.nth ?? 0);
};

// Same rules as run.mjs: a reload may add defaults but must not lose or change data, and a second
// reload must not change anything (idempotent loader). Import of the exported file must load to the same state as a reload.
async function roundtrip() {
    const r = {reload: false, export: false, import: false, notes: []};
    const original = await s.save();
    const [download] = await Promise.all([s.page.waitForEvent('download', {timeout: 10000}), s.page.locator('#save_to_file_button').click()]);
    const exported = await fs.readFile(await download.path(), 'utf8');
    await fs.writeFile(path.join(evidence, 'export.txt'), exported);
    r.export = exported.length > 0;
    await s.open(original);
    const b = await s.save();
    await s.open(b);
    const c = await s.save();
    const {lost, changed, added} = classifyReload(original, b);
    r.reload = !lost.length && !changed.length && canonicalSave(b) === canonicalSave(c);
    if(!r.reload) r.notes.push([...lost.map(x => 'lost ' + x), ...changed.map(x => 'changed ' + x)].slice(0, 6).join(', ') || 'loader not idempotent');
    const real = added.filter(x => !x.isDefault);
    if(real.length) r.notes.push('reload added ' + real.slice(0, 4).map(x => x.path).join(', '));
    await s.page.locator('#saved_file_input').setInputFiles({name: 'export.txt', mimeType: 'text/plain', buffer: Buffer.from(exported)});
    await pause(1500);
    const imported = await s.save();
    r.import = stateHash(imported) === stateHash(b);
    if(!r.import) r.notes.push('import state differs from reload state');
    r.stateHash = stateHash(b);
    return r;
}

const steps = [];
let rt = null;
try {
    await s.open();
    await s.page.setViewportSize({width: 1920, height: 1080});
    for(const [i, st] of scenario.steps.entries()) {
        s.op = i;
        const rec = {i, op: st.op, ok: false};
        steps.push(rec);
        try {
            if(st.op === 'nav') await nav(st.id);
            else if(st.op === 'click') {
                if(st.reload) { // the click starts a new life through a page reload: wait for it, then press Play again
                    await Promise.all([s.page.waitForEvent('load', {timeout: st.timeoutMs ?? 60000}), locate(st).click()]);
                    const play = s.page.locator('#loading_screen_play_button');
                    await play.waitFor({state: 'visible', timeout: 60000});
                    await s.page.evaluate(() => window.simulationTestHooks.pause());
                    await play.click();
                    const confirm = s.page.locator('#hero_creation_panel_confirmation');
                    if(await confirm.isVisible().catch(() => false)) await confirm.click();
                }
                else await locate(st).click();
                await pause(st.pauseMs);
            }
            else if(st.op === 'wait') {
                if(st.ms !== undefined) await pause(st.ms);
                else await locate(st).waitFor({state: 'visible', timeout: st.timeoutMs});
            } else if(st.op === 'expect') {
                const loc = locate(st);
                if(st.absent) assert.equal(await loc.count(), 0, 'expected absent');
                else if(st.matches) {
                    // Poll textContent: some status spans are not "visible" in Playwright's sense but hold the fact.
                    const re = new RegExp(st.matches), end = Date.now() + (st.timeoutMs ?? 5000);
                    let text = '';
                    while(Date.now() < end && !re.test(text = await loc.textContent({timeout: 1000}).catch(() => '') ?? '')) await s.page.waitForTimeout(200);
                    assert.match(text, re);
                } else await loc.waitFor({state: 'visible', timeout: st.timeoutMs ?? 5000});
            } else if(st.op === 'step') {await s.step(st.minutes); await pause();}
            else if(st.op === 'shot') await s.page.screenshot({path: path.join(evidence, `${st.name}.png`)});
            else if(st.op === 'roundtrip') {rt = await roundtrip(); assert.ok(rt.export && rt.reload && rt.import, `roundtrip ${JSON.stringify(rt)}`);}
            rec.ok = true;
        } catch(e) {
            rec.error = String(e.message).split('\n')[0].slice(0, 300);
            await s.page.screenshot({path: path.join(evidence, `fail-step-${i}.png`)}).catch(() => {});
            break;
        }
    }
} finally {
    var receipt = summarizeReceipt({scenario: scenario.name, bundle: bundleHash, steps, errors: s.errors, roundtrip: rt, evidence});
    await fs.writeFile(path.join(evidence, 'receipt.json'), JSON.stringify(receipt, null, 1) + '\n');
    await s.close(); server.close(); await bundle.dispose();
}
console.log(receiptLine(receipt));
process.exit(receipt.ok ? 0 : 1);
