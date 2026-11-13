// FRC67 wave integration, Frontier life (WIN report, 2026-11-10). Headless Chrome at 1920x1080 on a bundle rebuilt from src,
// fresh origin per open, frozen wall clock and seeded randomness (scripts/playtest/lib.mjs).
//   node docs/gm/dispatch/wave-integration-2026-11-10/frontier_ab.mjs <evidence dir>
// One fixture life holds the hearth shelf (spoilage), the meadow pen (needs seam), both regional staple shelves (prices) and the
// away bank. From one save, path A plays N minutes and path B banks N wall minutes and spends them through the away-bank command
// (first hour through the visible button). TMR4: the two saves must match on every slice except the bank itself.
// Then: rot taken off the shelf and sold to the village keeper; combined save, reload, Export and literal Import.
import assert from 'node:assert/strict';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {Session, buildBundle, serve} from '../../../../scripts/playtest/lib.mjs';

const out = resolve(process.argv[2] || 'docs/gm/dispatch/wave-integration-2026-11-10/evidence');
await mkdir(out, {recursive: true});
const W0 = Date.UTC(2026, 10, 10, 12), MIN = 60000, N = 1500; // N > one cooked-potato life (1440) so the shelf turns over
const key = id => JSON.stringify({id}), POTATO = key('Cooked potato'), HAY = key('Meadow hay'), ROT = key('Spoiled food'), STALE = key('Stale bread');
const log = [], line = (k, v) => {const s = `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`; log.push(s); console.log(s);};
const bundle = await buildBundle(), server = await serve(bundle.dir);
line('bundle sha256/16', createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex').slice(0, 16));
const sessions = [];
const session = async (wall, seedSave) => {const s = await new Session({url: server.url, seed: 7, wall, opTimeout: 20000}).start(); sessions.push(s); await s.open(seedSave); return s;};
const ev = (s, fn, arg) => s.page.evaluate(fn, arg);
const cmd = (s, id, name, ...args) => s.page.evaluate(([id, name, args]) => window.simulationTestHooks.command(id, name, ...args), [id, name, args]);
const clock = s => ev(s, () => window.simulationTestHooks.clock());
const go = async (s, id) => {await ev(s, id => window.change_location({location_id: id}), id); await s.page.waitForFunction(id => window.simulationTestHooks.snapshot()['current location'] === id, id);};
const click = (s, sel) => ev(s, sel => {const n = document.querySelector(sel); if(!n) throw Error('missing ' + sel); if(n.disabled) throw Error('disabled ' + sel + ': ' + (n.title || n.nextSibling?.textContent)); n.click();}, sel);
const text = (s, sel) => ev(s, sel => document.querySelector(sel)?.innerText.replace(/\s+/g, ' ').trim() ?? null, sel);
const realErrors = s => s.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text));
// The readings TMR4 compares: every saved slice except the bank, the save stamp and the clock-free time fields.
const comparable = save => {const c = structuredClone(save); for(const k of ['awayBank', 'saved_at', 'save_id', 'is_dev']) delete c[k]; return c;};
const diffKeys = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
const readings = async s => {
    await go(s, 'Hearthside cottage');
    const shelf = await ev(s, () => window.simulationTestHooks.project('placeClocks') ?? null).catch(() => null);
    const larder = await text(s, '#place_clock_panel > div:nth-of-type(1)');
    await go(s, 'Village');
    const pen = await ev(s, () => [...document.querySelectorAll('#meadow_pen_panel [data-habitat-fact]')].map(p => p.textContent).join(' | '));
    await ev(s, () => window.startTrade('villageTrader')); await s.page.locator('#trade_price_notes:not([hidden])').waitFor({timeout: 10000});
    const notes = await text(s, '#trade_price_notes'); await ev(s, () => window.exitTrade());
    return {clock: await clock(s), larder, pen, notes};
};
try {
    // ---- fixture: a fresh life given coins, potatoes and hay; then earned steps through the real panels ----
    const f = await session(W0);
    const base = await f.save();
    base.character.money = 400; Object.assign(base.inventories.person.main_character, {[POTATO]: {count: 3}, [HAY]: {count: 6}});
    base.availabilities.location['Forest road'] |= 1;
    await f.open(base);
    assert.equal((await f.save()).character.money, 400); line('fixture', '400 coins, 3 Cooked potato, 6 Meadow hay, fresh origin');
    await click(f, '[data-home-action="acquire:cottage"]');
    await go(f, 'Hearthside cottage'); await f.step(1);
    await click(f, '#place_clock_panel [data-place-clock-action="store:Cooked potato"]');
    await click(f, '#place_clock_panel [data-place-clock-action="store:Cooked potato"]');
    line('hearth shelf', await text(f, '#place_clock_panel > div:nth-of-type(1)'));
    await go(f, 'Village');
    for(const a of ['build', 'adopt', 'feed']) await click(f, `#meadow_pen_panel [data-habitat="${a}"]`);
    line('meadow pen', await ev(f, () => [...document.querySelectorAll('#meadow_pen_panel [data-habitat-fact]')].map(p => p.textContent).join(' | ')));
    line('pen need (projection)', await ev(f, () => window.simulationTestHooks.project('meadow_pen')?.owner ? 'owner present' : 'no owner'));
    await ev(f, () => window.startTrade('villageTrader')); await f.page.locator('#trade_price_notes:not([hidden])').waitFor({timeout: 10000});
    line('village notes t0', (await text(f, '#trade_price_notes')).slice(0, 220)); await ev(f, () => window.exitTrade());
    await f.page.screenshot({path: join(out, 'frontier-01-fixture-1920.png')});
    const S0 = await f.save(), c0 = S0.expansion.clock; line('S0 clock', c0);
    assert.deepEqual(realErrors(f), [], JSON.stringify(realErrors(f)));
    await f.close();

    // ---- path A: N played minutes ----
    const A = await session(W0 + 1000, S0);
    await A.step(N);
    const rA = await readings(A), SA = await A.save();
    line('A clock', rA.clock); line('A larder', rA.larder); line('A pen', rA.pen); line('A village notes', rA.notes.slice(0, 220));
    await A.page.screenshot({path: join(out, 'frontier-02-played-1920.png')});
    const errA = realErrors(A); await A.close();

    // ---- path B: N wall minutes away, then spent through the bank (first hour by the visible button) ----
    const B = await session(W0 + 1000 + N * MIN, S0);
    const bank0 = await ev(B, () => window.simulationTestHooks.project('awayBank')); line('B banked on return', bank0.bankedMinutes);
    assert.ok(bank0.bankedMinutes >= N, 'the bank holds the wall time away');
    await B.page.locator('#away_bank_spend').waitFor({state: 'visible'});
    await B.page.screenshot({path: join(out, 'frontier-03-bank-before-1920.png')});
    await B.page.locator('#away_bank_spend').click();
    await B.page.waitForFunction(() => /Spent \d+|Stopped after/.test(window.simulationTestHooks.project('awayBank').lastSpend || ''), null, {timeout: 120000});
    line('B first spend (button)', (await ev(B, () => window.simulationTestHooks.project('awayBank'))).lastSpend);
    let left = N - ((await clock(B)) - c0);
    while(left > 0) {const r = await cmd(B, 'awayBank', 'spend', left); if(!r?.consumed) break; left = N - ((await clock(B)) - c0);}
    const rB = await readings(B), SB = await B.save();
    line('B clock', rB.clock); line('B larder', rB.larder); line('B pen', rB.pen); line('B village notes', rB.notes.slice(0, 220));
    await B.page.screenshot({path: join(out, 'frontier-04-spent-1920.png')});

    // ---- TMR4 comparison ----
    const dk = diffKeys(comparable(SA), comparable(SB));
    line('TMR4 clock A vs B', `${SA.expansion.clock} vs ${SB.expansion.clock}`);
    line('TMR4 differing save keys (A vs B, bank excluded)', dk);
    for(const k of dk) line(`  ${k}`, {A: JSON.stringify(SA[k]).slice(0, 300), B: JSON.stringify(SB[k]).slice(0, 300)});
    line('TMR4 larder words equal', rA.larder === rB.larder); line('TMR4 pen words equal', rA.pen === rB.pen); line('TMR4 notes equal', rA.notes === rB.notes);
    await writeFile(join(out, 'frontier-SA.json'), JSON.stringify(SA)); await writeFile(join(out, 'frontier-SB.json'), JSON.stringify(SB));

    // ---- crossing: rot off the shelf, sold to the village keeper ----
    await go(B, 'Hearthside cottage');
    await click(B, '#place_clock_panel [data-place-clock-action="take:Cooked potato"]');
    let s = await B.save(); const rot = s.inventories.person.main_character[ROT]?.count ?? 0; line('rot carried after take', rot);
    await go(B, 'Village');
    await ev(B, () => window.startTrade('villageTrader')); await B.page.locator('#trade_price_notes:not([hidden])').waitFor({timeout: 10000});
    const money0 = s.character.money;
    if(rot) {await ev(B, k => window.add_to_selling_list({item_key: k, count: 1}), ROT); await ev(B, () => window.accept_trade());}
    await ev(B, () => window.exitTrade()); s = await B.save();
    line('sold rot', {coins: s.character.money - money0, onShelf: s.inventories.trader.villageTrader?.[ROT]?.count ?? 0});

    // ---- combined save, reload, Export, literal Import ----
    const SLICES = ['placeClocks', 'meadow_pen', 'awayBank', 'economy_standing', 'homes'];
    const pick = save => Object.fromEntries([...SLICES.map(k => [k, save[k]]), ['traders', save.inventories?.trader], ['traderRefresh', Object.fromEntries(Object.entries(save.npcs || {}).filter(([, v]) => v?.trader).map(([k, v]) => [k, v.trader.last_refresh]))], ['pack', save.inventories?.person?.main_character], ['clock', save.expansion?.clock]]);
    const saved = await B.save(); line('slices present', SLICES.map(k => `${k}:${saved[k] === undefined ? 'absent' : 'present'}`).join(' '));
    await B.page.reload();
    await B.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 60000});
    if(await B.page.locator('#loading_screen_play_button').isVisible()) await B.page.locator('#loading_screen_play_button').click({force: true});
    await ev(B, () => window.simulationTestHooks.pause());
    const re = await B.save(); const reD = diffKeys(pick(saved), pick(re)); line('reload: differing slices', reD);
    const encoded = await ev(B, () => window.save_to_file());
    const file = join(out, 'frontier-export.txt'); await writeFile(file, typeof encoded === 'string' ? encoded : JSON.stringify(encoded));
    const errB = realErrors(B); await B.close();
    const I = await session(W0 + 1000 + N * MIN);
    await Promise.all([I.page.waitForNavigation({waitUntil: 'domcontentloaded'}), I.page.locator('#saved_file_input').setInputFiles(file)]);
    await I.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 60000});
    if(await I.page.locator('#loading_screen_play_button').isVisible()) await I.page.locator('#loading_screen_play_button').click({force: true});
    await ev(I, () => window.simulationTestHooks.pause());
    const imp = await I.save(); const impD = diffKeys(pick(saved), pick(imp)); line('import: differing slices', impD);
    for(const k of impD) line(`  ${k}`, {saved: JSON.stringify(pick(saved)[k]).slice(0, 200), imported: JSON.stringify(pick(imp)[k]).slice(0, 200)});
    await I.page.screenshot({path: join(out, 'frontier-05-imported-1920.png')});
    line('page errors', {A: errA, B: errB, import: realErrors(I)});
} catch(e) {console.error('FAIL', e.stack); line('FAIL', e.message); process.exitCode = 1;}
finally {await writeFile(join(out, 'frontier-journey.log'), log.join('\n') + '\n'); for(const s of sessions) await s.close(); server.close(); await bundle.dispose();}
