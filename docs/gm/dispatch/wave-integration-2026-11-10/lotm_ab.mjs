// FRC67 wave integration, LOTM (Tingen) life. Headless Chrome 1920x1080, bundle rebuilt from src, fresh origin per open.
//   node docs/gm/dispatch/wave-integration-2026-11-10/lotm_ab.mjs <checkpoint save> <evidence dir>
// Named fixture: a private earned checkpoint (the game MCP's lotm-kjw33 scenario file; needs private_packs/ linked locally).
// Mood (Dunn's thought rows), the story director's Tingen feed and the item-knowledge broker names all live in this life.
// Hand in the weekly application through the LOTM panel button, then path A plays N minutes and path B spends N banked
// minutes. TMR4: equal saves outside the bank and equal Events rows. Then save, reload, Export and literal Import.
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {Session, buildBundle, serve} from '../../../../scripts/playtest/lib.mjs';

const [fixturePath, outArg] = process.argv.slice(2);
const out = resolve(outArg || 'docs/gm/dispatch/wave-integration-2026-11-10/evidence');
await mkdir(out, {recursive: true});
const W0 = Date.UTC(2026, 10, 10, 12), MIN = 60000, N = 720; // twelve hours, two six-hour director windows (three days timed out under load 50)
const DUNN = 'lotm.person.cast-618f4df49af02c7da45e', FILE = '[data-lotm="duty_lotm.expense_claim"]';
const log = [], line = (k, v) => {const s = `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`; log.push(s); console.log(s);};
const seed = JSON.parse(await readFile(resolve(fixturePath), 'utf8'));
const bundle = await buildBundle(), server = await serve(bundle.dir);
line('bundle sha256/16', createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex').slice(0, 16));
const sessions = [];
const session = async (wall, s0) => {const s = await new Session({url: server.url, seed: 7, wall, opTimeout: 150000}).start(); sessions.push(s); await s.open(s0); return s;};
const ev = (s, fn, arg) => s.page.evaluate(fn, arg);
const clock = s => ev(s, () => window.simulationTestHooks.clock());
const shot = (s, path) => s.page.screenshot({path, timeout: 8000}).catch(e => line("screenshot skipped", e.message.split("\n")[0]));
const realErrors = s => s.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text));
const comparable = save => {const c = structuredClone(save); for(const k of ['awayBank', 'saved_at', 'save_id']) delete c[k]; return c;};
const paths = (a, b, at = '', out = []) => {if(JSON.stringify(a) === JSON.stringify(b)) return out; if(a && b && typeof a === 'object' && typeof b === 'object') {for(const k of new Set([...Object.keys(a), ...Object.keys(b)])) paths(a[k], b[k], `${at}.${k}`, out); return out;} out.push(`${at}: ${JSON.stringify(a)?.slice(0, 120)} -> ${JSON.stringify(b)?.slice(0, 120)}`); return out;};
const diffKeys = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
const feed = s => ev(s, () => [...document.querySelectorAll('#world_event_feed ol li')].map(li => `${li.textContent}${li.title ? ` [why: ${li.title}]` : ''}`));
const dunnRows = save => (save.moodThoughts?.rows || []).filter(r => r.holder === 'lotm.person.cast-618f4df49af02c7da45e');
try {
    const f = await session(W0, seed);
    line('world', await ev(f, () => window.simulationTestHooks.snapshot().expansion?.actors?.player?.worldId));
    line('clock at fixture', await clock(f));
    // Step until the weekly application can be handed in (at most a week), then hand it in through the visible panel button.
    let ready = false;
    for(let i = 0; i < 7 * 24 && !ready; i++) {
        ready = await ev(f, sel => {const b = document.querySelector(sel); return !!b && !b.disabled;}, FILE);
        if(!ready) await f.step(60);
    }
    line('application button ready', ready);
    const before = await f.save();
    line('Dunn rows before', dunnRows(before));
    if(ready) await ev(f, sel => document.querySelector(sel).click(), FILE);
    await f.step(1);
    const S0 = await f.save(); line('Dunn rows after hand-in', dunnRows(S0)); line('S0 clock', S0.expansion.clock);
    line('feed at S0 (last 4)', (await feed(f)).slice(-4));
    await shot(f, join(out, 'lotm-01-handed-in-1920.png'));
    const errF = realErrors(f); await f.close();

    const A = await session(W0 + 1000, S0); await A.step(N);
    const SA = await A.save(), feedA = await feed(A); line('A clock', SA.expansion.clock); line('A Dunn rows', dunnRows(SA));
    await shot(A, join(out, 'lotm-02-played-1920.png')); const errA = realErrors(A); await A.close();

    const B = await session(W0 + 1000 + N * MIN, S0);
    const bank0 = await ev(B, () => window.simulationTestHooks.project('awayBank')); line('B banked on return', bank0?.bankedMinutes);
    const c0 = S0.expansion.clock;
    let left = N - ((await clock(B)) - c0), stops = [];
    while(left > 0) {
        const r = await ev(B, n => window.simulationTestHooks.command('awayBank', 'spend', n), left);
        if(!r?.consumed) {stops.push('no progress'); break;}
        if(r.consumed < r.requested) stops.push(`${r.consumed}/${r.requested}`);
        left = N - ((await clock(B)) - c0);
    }
    line('B spend stops (waiting choices)', stops);
    const SB = await B.save(), feedB = await feed(B); line('B clock', SB.expansion.clock); line('B Dunn rows', dunnRows(SB));
    await shot(B, join(out, 'lotm-03-spent-1920.png'));
    const dk = diffKeys(comparable(SA), comparable(SB)); line('TMR4 differing save keys (A vs B, bank excluded)', dk);
    for(const k of dk) line(`  ${k} paths`, paths(SA[k], SB[k], k).slice(0, 25));
    await writeFile(join(out, 'lotm-SA.json'), JSON.stringify(SA)); await writeFile(join(out, 'lotm-SB.json'), JSON.stringify(SB));
    line('TMR4 Events rows equal', JSON.stringify(feedA) === JSON.stringify(feedB));
    line('feed after N (last 6)', feedB.slice(-6));
    line('mood slice present', SB.moodThoughts !== undefined);

    const saved = await B.save();
    await B.page.reload(); await B.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 240000});
    if(await B.page.locator('#loading_screen_play_button').isVisible()) await B.page.locator('#loading_screen_play_button').click({force: true});
    await ev(B, () => window.simulationTestHooks.pause());
    const re = await B.save(); line('reload: clock before/after', [saved.expansion.clock, re.expansion.clock]); line('reload: differing save keys', diffKeys(comparable(saved), comparable(re)).filter(k => k !== 'current time' && k !== 'total_playtime'));
    line('reload: Events rows equal', JSON.stringify(await feed(B)) === JSON.stringify(feedB));
    const encoded = await ev(B, () => window.save_to_file()); const file = join(out, 'lotm-export.txt');
    await writeFile(file, typeof encoded === 'string' ? encoded : JSON.stringify(encoded));
    const errB = realErrors(B); await B.close();
    const I = await session(W0 + 1000 + N * MIN);
    await Promise.all([I.page.waitForNavigation({waitUntil: 'domcontentloaded'}), I.page.locator('#saved_file_input').setInputFiles(file)]);
    await I.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 240000});
    if(await I.page.locator('#loading_screen_play_button').isVisible()) await I.page.locator('#loading_screen_play_button').click({force: true});
    await ev(I, () => window.simulationTestHooks.pause());
    const imp = await I.save(); line('import: clock', imp.expansion.clock); line('import: differing save keys', diffKeys(comparable(saved), comparable(imp)).filter(k => k !== 'current time' && k !== 'total_playtime'));
    line('import: Dunn rows equal', JSON.stringify(dunnRows(imp)) === JSON.stringify(dunnRows(saved)));
    line('import: Events rows equal', JSON.stringify(await feed(I)) === JSON.stringify(feedB));
    await shot(I, join(out, 'lotm-04-imported-1920.png'));
    line('page errors', {fixture: errF, A: errA, B: errB, import: realErrors(I)});
} catch(e) {console.error('FAIL', e.stack); line('FAIL', e.message); process.exitCode = 1;}
finally {await writeFile(join(out, 'lotm-journey.log'), log.join('\n') + '\n'); for(const s of sessions) await s.close(); server.close(); await bundle.dispose();}
