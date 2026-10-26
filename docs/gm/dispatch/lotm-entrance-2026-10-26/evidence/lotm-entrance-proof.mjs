// Headless proof for the LOTM ordinary entrance. Run from the lotm-entrance worktree root.
import {Session, buildBundle, serve, sha} from '/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/lotm-entrance/scripts/playtest/lib.mjs';
import {writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
const out = process.argv[2]; await mkdir(out, {recursive:true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const bundleHash = createHash('sha256').update(await readFile(bundle.dir + '/bundle.js')).digest('hex');
const s = await new Session({url:server.url, seed:7, wall:Date.UTC(2026, 9, 26, 8)}).start();
const log = [], ok = (c, m) => {log.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if(!c) process.exitCode = 1;};
try {
  await s.open();
  const p = s.page;
  ok(!(await p.evaluate(() => location.search)).includes('lotm_probe'), 'ordinary origin, no probe parameter: ' + server.url);
  ok((await p.locator('#location_name_span').innerText()).includes('Village'), 'fresh life starts in the Village');
  const panel = p.locator('#lotm_panel');
  const door = p.locator('#location_actions_div [data-lotm-door]');
  ok(await door.isVisible(), 'Village place actions show "Read the Tingen hiring notice"');
  ok(!(await panel.isVisible().catch(() => false)), 'the panel does not open by itself (no unrequested screen shift)');
  const boxBefore = await p.locator('#location_actions_div').boundingBox();
  await p.screenshot({path:out + '/village-door-1920.png'});
  await door.click(); await p.waitForTimeout(300);
  const visible = await panel.isVisible().catch(() => false);
  log.push(`INFO place-actions box before door click: ${JSON.stringify(boxBefore)}`);
  ok(visible, 'Tingen panel can be shown on an ordinary save in the Village');
  const text = await panel.innerText();
  ok(/foggy industrial city/.test(text) && /for good on this save/.test(text) && /Export first/.test(text), 'effect-first text states what a start does and its one-way cost');
  ok(!/disposable|test start|canon/i.test(text), 'no developer test wording in the panel');
  ok(/Your Frontier purse does not travel/.test(text), 'civil start shows its money cost as visible text, not only a hover title');
  await p.screenshot({path:out + '/tingen-village-1920.png'});
  const enroll = panel.locator('button[data-lotm="enroll"]');
  ok(await enroll.isEnabled(), 'Begin as a Nighthawk probationer is enabled');
  await enroll.click(); await p.waitForTimeout(500);
  const after = await panel.innerText();
  ok(!/foggy industrial city/.test(after), 'panel switched to the enrolled view');
  ok(!(await p.locator('#location_actions_div [data-lotm-door]').isVisible().catch(() => false)), 'the notice door is gone once enrolled');
  const loc = await p.locator('#location_name_span').innerText();
  log.push(`INFO location after begin: ${loc}`);
  await p.screenshot({path:out + '/tingen-enrolled-1920.png'});
  const saved = await s.save();
  ok(!!saved.expansion?.lotm || JSON.stringify(saved).includes('"lotm"'), 'ordinary save carries the lotm slice');
  // Reload: fresh context seeded with the saved data.
  await s.open(saved);
  const reloaded = await s.save();
  ok(JSON.stringify(reloaded).includes('entryProfile'), 'reload keeps the enrolled life');
  ok((await s.page.locator('#location_name_span').innerText()) === loc, 'reload keeps the Tingen location');
  // Export, then literal Import through the game's own routes.
  const exported = await s.page.evaluate(() => save_to_file());
  ok(typeof exported === 'string' && exported.length > 100, 'Export produced a save text');
  await Promise.all([s.page.waitForEvent('load'), s.page.evaluate(x => load_progress(x), exported)]);
  const play = s.page.locator('#loading_screen_play_button');
  await play.waitFor({state:'visible', timeout:60000}); await play.click(); await s.page.waitForTimeout(500);
  const imported = JSON.parse(await s.page.evaluate(() => {window.saveProgress(); return localStorage.getItem('save data');}));
  ok(JSON.stringify(imported).includes('entryProfile'), 'Import keeps the enrolled life');
  ok((await s.page.locator('#location_name_span').innerText()) === loc, 'Import keeps the Tingen location');
  const pre = await (async () => {await s.open(); return s.page.evaluate(() => document.querySelector('#lotm_panel button[data-lotm="enroll"]')?.disabled);})();
  log.push(`INFO fresh second life: enroll disabled = ${pre}`);
  ok(s.errors.length === 0, `no page or console errors (${s.errors.length})`);
  if(s.errors.length) log.push(JSON.stringify(s.errors.slice(0, 3)));
} catch(e) {log.push('ERROR ' + (e.stack || e.message).slice(0, 800)); process.exitCode = 1;}
finally {await s.close(); server.close(); await bundle.dispose();}
log.unshift(`bundle sha256 ${bundleHash}`, `viewport 1920x1080, headless Chrome, fresh context`);
await writeFile(out + '/result.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
