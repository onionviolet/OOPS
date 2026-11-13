// FRC67 wave integration, HP lead life: the exam slice survives save, reload, Export and literal Import (the lane proof covered
// save and reload only). Route kind FIXTURE: scripts/headless/hp_exam_fixture.mjs (day 247, revision open); the revise presses are
// player buttons. Headless Chrome 1920x1080, bundle rebuilt from src, fresh origin per open.
//   node scripts/headless/hp_exam_fixture.mjs 247 <fixture.json> && node docs/gm/dispatch/wave-integration-2026-11-10/hp_kept.mjs <fixture.json> <evidence dir>
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {Session, buildBundle, serve} from '../../../../scripts/playtest/lib.mjs';

const [fixturePath, outArg] = process.argv.slice(2), out = resolve(outArg || 'docs/gm/dispatch/wave-integration-2026-11-10/evidence');
await mkdir(out, {recursive: true});
const W0 = Date.UTC(2026, 10, 10, 12), log = [], line = (k, v) => {const s = `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`; log.push(s); console.log(s);};
const bundle = await buildBundle(), server = await serve(bundle.dir), sessions = [];
const session = async seed => {const s = await new Session({url: server.url, seed: 7, wall: W0, opTimeout: 150000}).start(); sessions.push(s); await s.open(seed); return s;};
const ev = (s, fn, arg) => s.page.evaluate(fn, arg);
const exams = async s => {await s.page.locator('#workspace_navigation select').first().selectOption('hp').catch(() => {}); return ((await s.page.locator('#hp_panel').innerText()).split('End-of-year exams')[1] || '').replace(/\s+/g, ' ').slice(0, 400);};
const hpState = save => ({facts: Object.fromEntries(Object.entries(save.expansion.actors.player.facts).filter(([k]) => /hp\./.test(k))), completed: Object.fromEntries(Object.entries(save.expansion.actors.player.completed || {}).filter(([k]) => /exam|revis/.test(k))), clock: save.expansion.clock});
try {
    const s = await session(JSON.parse(await readFile(resolve(fixturePath), 'utf8')));
    let pressed = 0;
    for(let i = 0; i < 40 && pressed < 3; i++) {
        await s.page.locator('#workspace_navigation select').first().selectOption('hp').catch(() => {});
        const b = s.page.locator('[data-hp-revise="charms"] button:not([disabled])').first();
        if(await b.count()) {await b.click(); pressed++;}
        await ev(s, () => window.advanceTicks(95));
    }
    line('revise charms presses', pressed); assert.ok(pressed >= 1);
    const before = await exams(s); line('exams panel', before);
    const saved = await s.save(); const want = hpState(saved); line('hp exam facts', want);
    await s.page.reload(); await s.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 120000});
    if(await s.page.locator('#loading_screen_play_button').isVisible()) await s.page.locator('#loading_screen_play_button').click({force: true});
    await ev(s, () => window.simulationTestHooks.pause());
    line('reload: hp state equal', JSON.stringify(hpState(await s.save())) === JSON.stringify(want));
    line('reload: exams panel equal', (await exams(s)) === before);
    const encoded = await ev(s, () => window.save_to_file()), file = join(out, 'hp-export.txt');
    await writeFile(file, typeof encoded === 'string' ? encoded : JSON.stringify(encoded)); await s.close();
    const I = await session(null);
    await Promise.all([I.page.waitForNavigation({waitUntil: 'domcontentloaded'}), I.page.locator('#saved_file_input').setInputFiles(file)]);
    await I.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 120000});
    if(await I.page.locator('#loading_screen_play_button').isVisible()) await I.page.locator('#loading_screen_play_button').click({force: true});
    await ev(I, () => window.simulationTestHooks.pause());
    line('import: hp state equal', JSON.stringify(hpState(await I.save())) === JSON.stringify(want));
    line('import: exams panel equal', (await exams(I)) === before);
    await I.page.screenshot({path: join(out, 'hp-01-imported-1920.png'), timeout: 10000}).catch(e => line('screenshot skipped', e.message.split('\n')[0]));
    line('page errors', [...sessions.flatMap(x => x.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text)))]);
} catch(e) {console.error('FAIL', e.stack); line('FAIL', e.message); process.exitCode = 1;}
finally {await writeFile(join(out, 'hp-journey.log'), log.join('\n') + '\n'); for(const x of sessions) await x.close(); server.close(); await bundle.dispose();}
