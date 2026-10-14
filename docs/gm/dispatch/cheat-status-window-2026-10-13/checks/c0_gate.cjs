// C0 cheat save field gate. READ-ONLY for workers. Runs against REPO (default: the ui/cheats-c0 worktree).
// Prints "PASS|FAIL <item> <detail>". Exit 0 all pass, 1 any fail, 3 broken tooling.
// Harness fix 2026-10-13: Node 22 fetch (undici) can crash with assert(!this.paused) against python http.server; probe with plain http and no keep-alive.
const __probe = u => new Promise(res => { const req = require('http').get(u, {agent: false}, r => { r.resume(); res({ok: r.statusCode >= 200 && r.statusCode < 400}); }); req.on('error', () => res({ok: false})); req.setTimeout(3000, () => { req.destroy(); res({ok: false}); }); });
const fs = require('fs'), path = require('path'), os = require('os');
const {execFileSync} = require('child_process');
let chromium;
try { ({chromium} = require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); } catch { console.log('BROKEN playwright'); process.exit(3); }
const REPO = process.env.REPO || '/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/ui-cheats-c0';
const URL = process.env.URL || 'http://127.0.0.1:18321/';
const MAIN = '/Users/weiwei/code/yet-another-idle-rpg';
const OLD = fs.readFileSync(MAIN + '/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/precombat.save.txt', 'utf8');
const FIX = path.join(REPO, 'docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/held_system.save.txt');
const only = process.argv[2]; const results = [];
const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${typeof d === 'string' ? d : JSON.stringify(d)}`); };
const parse = s => { try { return JSON.parse(s); } catch { return null; } };

async function open(b, save) {
  const ctx = await b.newContext({viewport: {width: 1366, height: 768}, acceptDownloads: true});
  const p = await ctx.newPage(); p.setDefaultTimeout(15000); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
  await p.goto(URL + 'style.css'); await p.evaluate(s => { localStorage.clear(); if (s) localStorage.setItem('save data', s); }, save);
  await p.goto(URL, {waitUntil: 'domcontentloaded'});
  await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout: 8000}).catch(() => p.evaluate(() => document.getElementById('loading_screen_play_button').click()));
  await p.waitForTimeout(1200);
  if (await p.locator('#hero_creation_panel_confirmation').isVisible().catch(() => false)) { await p.locator('#hero_creation_panel_confirmation').click(); await p.waitForTimeout(800); }
  return {ctx, p};
}
const saveNow = async p => { await p.evaluate(() => localStorage.removeItem('save data')); await p.locator('#save_button').click(); for (let i = 0; i < 40; i++) { const s = await p.evaluate(() => localStorage.getItem('save data')); if (s) return s; await p.waitForTimeout(100); } return null; };

const checks = {
  async Z1_unit() {
    const bad = [];
    const f = path.join(REPO, 'src/cheat_cards.js');
    if (!fs.existsSync(f)) { rec('Z1_unit', false, 'src/cheat_cards.js missing'); return; }
    const script = `import(${JSON.stringify('file://' + f)}).then(m=>{const out={};
      const ok={id:'system-quests',family:'system',name:'Quest system',ui:'status-window',terms:'gift',hooks:[],state:{},stages:[],observers:[],sources:[]};
      try{m.validateCheatCard(ok);out.valid=true}catch(e){out.valid=String(e.message)}
      try{const x={...ok};delete x.id;m.validateCheatCard(x);out.missingId='accepted'}catch{out.missingId='rejected'}
      try{m.validateCheatCard({...ok,ui:'not-a-panel'});out.badUi='accepted'}catch{out.badUi='rejected'}
      try{m.validateCheatCard({...ok,extra:1});out.unknownKey='accepted'}catch{out.unknownKey='rejected'}
      out.def=JSON.stringify(m.defaultCheatState());
      try{m.validateCheatState({schema:1,held:{'system-quests':{card:ok,acquired:{route:'optional-start',at:{year:999}},messages:[]}},known:{}});out.state=true}catch(e){out.state=String(e.message)}
      try{m.validateCheatState({schema:2,held:{},known:{}});out.badSchema='accepted'}catch{out.badSchema='rejected'}
      console.log(JSON.stringify(out))}).catch(e=>{console.log(JSON.stringify({importError:String(e.message)}))})`;
    let o; try { o = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], {cwd: REPO}).toString().trim().split('\n').pop()); } catch (e) { rec('Z1_unit', false, 'module run failed: ' + String(e.message).slice(0, 120)); return; }
    if (o.importError) bad.push('import: ' + o.importError);
    if (o.valid !== true) bad.push('valid card rejected: ' + o.valid);
    if (o.missingId !== 'rejected') bad.push('missing id accepted');
    if (o.badUi !== 'rejected') bad.push('unknown ui accepted');
    if (o.unknownKey !== 'rejected') bad.push('unknown key accepted');
    if (o.def !== JSON.stringify({schema: 1, held: {}, known: {}})) bad.push('defaultCheatState ' + o.def);
    if (o.state !== true) bad.push('valid state rejected: ' + o.state);
    if (o.badSchema !== 'rejected') bad.push('schema 2 accepted');
    rec('Z1_unit', !bad.length, bad.length ? bad : 'card and state validators behave');
  },
  async Z2_old_save(b) {
    const {ctx, p} = await open(b, OLD); const bad = [];
    const s = parse(await saveNow(p));
    if (!s) bad.push('no save after load');
    else if (!s.cheats || s.cheats.schema !== 1 || Object.keys(s.cheats.held || {}).length) bad.push('old save did not gain empty cheats: ' + JSON.stringify(s.cheats));
    if (p.errs.length) bad.push('page errors ' + p.errs[0]);
    await ctx.close(); rec('Z2_old_save', !bad.length, bad.length ? bad : 'old save loads and saves with empty cheats');
  },
  async Z3_round_trip(b) {
    const bad = [];
    if (!fs.existsSync(FIX)) { rec('Z3_round_trip', false, 'fixture missing: ' + FIX); return; }
    const fix = fs.readFileSync(FIX, 'utf8'); const fo = parse(fix);
    if (!fo || !fo.cheats || !Object.keys(fo.cheats.held || {}).length) { rec('Z3_round_trip', false, 'fixture has no held card'); return; }
    if (!/TEST FIXTURE C0/.test(JSON.stringify(fo))) bad.push('fixture hero not named TEST FIXTURE C0');
    const heldIds = Object.keys(fo.cheats.held).sort().join(',');
    const a = await open(b, fix);
    const s1 = parse(await saveNow(a.p)); if (!s1 || Object.keys(s1.cheats?.held || {}).sort().join(',') !== heldIds) bad.push('save after load lost held cards');
    await a.p.reload({waitUntil: 'domcontentloaded'}); await a.p.locator('#loading_screen_play_button').click().catch(() => {}); await a.p.waitForTimeout(1200);
    const s2 = parse(await saveNow(a.p)); if (!s2 || Object.keys(s2.cheats?.held || {}).sort().join(',') !== heldIds) bad.push('reload lost held cards');
    const dl = a.p.waitForEvent('download', {timeout: 15000}); await a.p.locator('#save_to_file_button').click(); const d = await dl;
    const file = path.join(os.tmpdir(), 'c0-export-' + Date.now() + '.txt'); await d.saveAs(file);
    if (a.p.errs.length) bad.push('page errors ' + a.p.errs[0]); await a.ctx.close();
    // Literal-file import into a brand-new origin.
    const c = await open(b, null);
    await c.p.setInputFiles('#saved_file_input', file); await c.p.waitForTimeout(2500);
    await c.p.locator('#loading_screen_play_button').click().catch(() => {}); await c.p.waitForTimeout(1200);
    const s3 = parse(await c.p.evaluate(() => localStorage.getItem('save data')));
    if (!s3 || Object.keys(s3.cheats?.held || {}).sort().join(',') !== heldIds) bad.push('literal import lost held cards');
    if (c.p.errs.length) bad.push('import page errors ' + c.p.errs[0]); await c.ctx.close();
    rec('Z3_round_trip', !bad.length, bad.length ? bad : 'save, reload, export, literal import keep held cards: ' + heldIds);
  },
  async Z4_invalid_rejected(b) {
    if (!fs.existsSync(FIX)) { rec('Z4_invalid_rejected', false, 'fixture missing'); return; }
    const fo = parse(fs.readFileSync(FIX, 'utf8')); const id = Object.keys(fo.cheats.held)[0];
    delete fo.cheats.held[id].card.id;
    // Coordinator fix 2026-10-13: write the bad save in the game's own export encoding, and compare facts, not raw strings (autosave moves the clock).
    const file = path.join(os.tmpdir(), 'c0-bad-' + Date.now() + '.txt'); fs.writeFileSync(file, 'YAIR-UTF8-1:' + Buffer.from(JSON.stringify(fo), 'utf8').toString('base64'));
    const c = await open(b, OLD); const before = parse(await saveNow(c.p));
    await c.p.setInputFiles('#saved_file_input', file); await c.p.waitForTimeout(2000);
    const after = parse(await c.p.evaluate(() => localStorage.getItem('save data')));
    const msg = await c.p.evaluate(() => document.getElementById('message_box_div')?.innerText.slice(-400) || '');
    await c.ctx.close();
    const kept = !!after && !!before && JSON.stringify(after.character?.name ?? after.hero?.name ?? null) === JSON.stringify(before.character?.name ?? before.hero?.name ?? null) && !Object.keys(after.cheats?.held || {}).length && !/TEST FIXTURE C0/.test(JSON.stringify(after));
    const ok = kept && /reject|invalid|cheat|card/i.test(msg) && /cheat|card/i.test(msg);
    rec('Z4_invalid_rejected', ok, ok ? 'bad card refused, current save kept, message names the card' : {kept, msg: msg.slice(-160)});
  },
  async Z5_tests() {
    let out = ''; try { out = execFileSync('npm', ['test'], {cwd: REPO, stdio: ['ignore', 'pipe', 'pipe']}).toString(); } catch (e) { out = (e.stdout || '').toString(); }
    const fail = +(out.match(/^# fail (\d+)/m) || [])[1], pass = +(out.match(/^# pass (\d+)/m) || [])[1];
    const cheatTests = (out.match(/^ok \d+ - .*cheat.*$/gmi) || []).length;
    const ok = fail === 0 && pass > 0 && cheatTests >= 3;
    rec('Z5_tests', ok, {pass, fail, cheatTests});
  },
};
(async () => {
  let b; try { b = await chromium.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}); } catch { console.log('BROKEN chrome'); process.exit(3); }
  let up = false; for (let i = 0; i < 3 && !up; i++) { try { up = (await __probe(URL + 'index.html')).ok; } catch { await new Promise(r => setTimeout(r, 400)); } }
  if (!up) { console.log('BROKEN server ' + URL); await b.close(); process.exit(3); }
  for (const [id, fn] of Object.entries(checks)) { if (only && !id.startsWith(only)) continue; try { await fn(b); } catch (e) { rec(id, false, 'threw: ' + String(e.message).split('\n')[0]); } }
  await b.close(); process.exit(results.every(Boolean) ? 0 : 1);
})();
