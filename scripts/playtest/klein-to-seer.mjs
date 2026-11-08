// W2b: continue Klein's own story tasks (same controls as klein-to-dunn.mjs) from the met-Dunn save (argv[3]; fresh run if absent)
// until the Seer potion is drunk: energy pool book.lotm.be_spirituality exists. Saves <outDir>/klein-seer.save.json (scratch; never commit).
// Usage: node scripts/playtest/klein-to-seer.mjs [outDir] [seedSave]
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, join} from 'node:path';
import {Session, buildBundle, serve} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';

const out = resolve(process.argv[2] || '/tmp/klein-to-seer');
await mkdir(out, {recursive: true});
const bundle = await buildBundle(), server = await serve(bundle.dir);
const bundleSha256 = createHash('sha256').update(await readFile(join(bundle.dir, 'bundle.js'))).digest('hex');
const KEY = 'book.lotm.cast.met.lotm.person.cast-618f4df49af02c7da45e';
const snap = p => p.evaluate(() => window.simulationTestHooks.snapshot().expansion);
const panel = (p, id) => p.locator('#workspace_navigation select[aria-label="Other known panels"]').selectOption(id);
const play = async p => {
    await p.waitForFunction(() => !!window.simulationTestHooks && (document.getElementById('loading_screen_play_button')?.checkVisibility() ||
        document.getElementById('loading_screen')?.style.visibility === 'hidden'), null, {timeout: 60000});
    await p.evaluate(() => window.simulationTestHooks.pause());
    const b = p.locator('#loading_screen_play_button'); if(await b.isVisible()) await b.click({force: true});
    await p.waitForTimeout(400);
};
const s = new Session({url: server.url, seed: 7, wall: Date.UTC(2026, 10, 7), opTimeout: 20000});
let result = {met: false}, exit = 1;
try {
    const seed = process.argv[3] ? JSON.parse(await readFile(process.argv[3], 'utf8')) : null;
    await s.start(); await s.open(seed); const p = s.page;
    if(!seed) {
        await panel(p, 'lotm');
        await p.getByRole('button', {name: 'Developer playthrough: Be Klein Moretti'}).click();
        await Promise.all([p.waitForEvent('load', {timeout: 60000}), p.getByRole('button', {name: 'Start this new life'}).click({noWaitAfter: true})]);
    }
    await play(p);
    const nc = new NativeContinuation(s, {panel: 'lotm', attrPrefix: 'lotm', stepLimit: 4000});
    const tab = async name => {await panel(p, 'lotm'); await p.locator('[data-workroom-tabs] button').filter({hasText: new RegExp(`^${name}$`)}).first().click(); await p.waitForTimeout(150);};
    const clock = async () => (await snap(p)).clock ?? null;
    const met = async () => !!(await snap(p)).simulation.energies?.player?.['book.lotm.be_spirituality'];
    const tasks = []; let cp = 0, moves = 0, waits = 0, last = null, same = 0;
    for(let i = 0; i < 1500 && !(await met()); i++) {
        console.error('iter', i, 'jobs?'); const v = await nc.view(); console.error('view ok', v.jobs.length, v.arc?.next?.id);
        if(tasks.length && tasks.length % 15 === 0 && cp !== tasks.length) {cp = tasks.length; await writeFile(join(out, 'klein-seer.checkpoint.json'), JSON.stringify(await s.save()));}
        if(v.jobs.length) {console.error('settling', v.jobs.length); await nc.settle(); continue;}
        const next = v.arc?.next;
        if(!next) {await s.step(60); waits++; continue;}
        if(next.id === last) {if(++same > 150) throw Error(`stalled at ${next.id} place=${next.place}`);} else {last = next.id; same = 0;}
        const sel = id => p.locator(`[data-lotm="${id}"]`).first();
        console.error('tab Here'); await tab('Here');
        let b = sel(next.id);
        if(await b.count() && !(await b.isDisabled())) {
            await b.click(); await p.waitForTimeout(150); await nc.settle(); tasks.push(next.id);
            console.error(`task ${next.id} clock=${await clock()}`); continue;
        }
        const mv = v.moves.find(m => m.to === next.place && m.eligible);
        if(mv) {
            const mb = sel(mv.id);
            if(await mb.count() && !(await mb.isDisabled())) {await mb.click(); await p.waitForTimeout(150); await nc.settle(); moves++; console.error(`move ${mv.id} clock=${await clock()}`); continue;}
        }
        // not ready (time-gated) or no walk: let time pass in small native steps
        console.error('stepping', next.readyAt, await clock()); await s.step(next.readyAt ? 30 : 15); waits++;
        if(waits <= 4 || waits % 10 === 1) {const sn = await snap(p); const pe = sn.simulation.people; const ob = v.objectActs.find(a => a.id === next.id); console.error('dbg', waits, 'clock', await clock(), 'btn', await b.count(), 'elig', ob?.eligible, JSON.stringify(ob?.reasons), 'player@', pe.player.location.slice(-8), 'sister@', pe['lotm.person.cast-9b97e46cd3d4802c78c3']?.location?.slice(-8));}
        if(waits % 10 === 0) console.error(`wait x${waits} for ${next.id} clock=${await clock()} ${JSON.stringify(v.objectActs?.filter(a => a.id === next.id).map(a => a.reasons))}`);
    }
    const ok = await met();
    const save = join(out, 'klein-seer.save.json');
    if(ok) await writeFile(save, JSON.stringify(await s.save()));
    result = {bundleSha256, tasks: tasks.length, moves, waits, clockMinutes: await clock(), met: ok, save: ok ? save : null, pageErrors: s.errors.length};
    if(s.errors.length) console.error(s.errors.slice(0, 5).map(e => e.text.slice(0, 200)).join('\n'));
    exit = ok ? 0 : 1;
} catch(e) {
    console.error('FAIL', e.message);
    try {const v = await s.page.evaluate(() => window.simulationTestHooks.project('lotm')); console.error(JSON.stringify({arc: v.arc?.next, moves: v.moves?.map(m => [m.id, m.to, m.eligible, m.reasons]), jobs: v.jobs?.length, act: v.objectActs?.filter(a => a.id === v.arc?.next?.id).map(a => [a.eligible, a.reasons]), actions: v.actions?.filter(a => a.id === v.arc?.next?.id).map(a => [a.eligible, a.reasons]), nact: v.objectActs?.length, now: v.now ?? v.clock ?? null, waits: v.waits?.map(w => [w.id, w.at]).slice(0, 6)}).slice(0, 1500));} catch {}
    result.error = e.message; result.pageErrors = s.errors.length;
} finally {server.close(); await bundle.dispose();}
console.log(JSON.stringify(result));
process.exit(exit);
