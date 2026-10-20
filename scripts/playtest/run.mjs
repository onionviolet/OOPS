// Scripted playtest bot (PT11) with gap detectors (PT17, PT18, PT20, PT21, PT46) and fault injection.
// Design: docs/AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md.
//   node scripts/playtest/run.mjs [--out dir] [--seed n] [--runs 2] [--inject throw|stall|save|nondet|overflow] [--shots]
//   node scripts/playtest/run.mjs --self-test [--out dir]   # clean run passes, each fault caught by its detector
// Plays scripts/headless/village_route.mjs (elder greeting, craftsman, woodcutting,
// trade, smelting) in headless Chrome with dev-stepped time. Writes trace.json
// (ops, timings, observation hashes; no raw save or snapshot contents, so sealed
// truths stay out of the files) and REPORT.md. --shots adds a 1920x1080 PNG per
// played op; screenshots can show sealed text, so they stay in the out dir.
// Exit 0 = every detector passed.
import {execFileSync} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {canonicalSave, diffSaves} from '../headless/runner.mjs';
import {ROUTE, PATCHES, SEED, WALL_START} from '../headless/village_route.mjs';
import {Session, buildBundle, serve, sha, stateHash} from './lib.mjs';

const STUCK_STREAK = 6; // ops in a row with no durable state change before "no progress"
export const DETECTORS = ['errors', 'stuck', 'roundtrip', 'determinism', 'ui'];
/** Which detector each injected fault must trip (the self-test matrix). */
export const FAULTS = {throw:'errors', stall:'stuck', save:'roundtrip', nondet:'determinism', overflow:'ui'};

// Faults are injected from outside the game; no source file changes.
const INJECT = {
    // An uncaught exception during play, after the elder greeting.
    throw: {afterOp:{index:4, run:page => page.evaluate(() => void setTimeout(() => {throw new Error('playtest injected fault');}))}},
    // A control that swallows its click: the elder's "where am i" line does nothing.
    stall: {beforeOpen:ctx => ctx.addInitScript(() => window.addEventListener('click', e => {if(e.target.closest?.('[data-textline="where am i"]')) e.stopImmediatePropagation();}, true))},
    // A loader that loses data: the reloaded copy drops the last inventory entry.
    save: {beforeOpen:(ctx, seedSave, phase) => phase === 'roundtrip' && ctx.addInitScript(() => {
        if(sessionStorage.getItem('broken')) return;
        const s = JSON.parse(localStorage.getItem('save data')), inv = s.inventories?.person?.main_character;
        const last = inv && Object.keys(inv).pop();
        if(last) delete inv[last];
        localStorage.setItem('save data', JSON.stringify(s)); sessionStorage.setItem('broken', '1');
    })},
    // A gameplay path on ambient randomness: the second run is not seeded.
    nondet: {unseededRun:1},
    // A panel wider than the desktop viewport: the page scrolls sideways.
    overflow: {beforeOpen:ctx => ctx.addInitScript(() => addEventListener('DOMContentLoaded', () => {const d = document.createElement('div'); d.style.cssText = 'width:2600px;height:4px'; document.body.append(d);}))},
};

/** UI detector: sideways page overflow fails; clipped text and unlabeled controls are notes, each reported once per run. */
async function uiPass(s, op, findings, notes, seen, run) {
    const u = await s.uiCheck().catch(() => null);
    if(!u) return;
    if(u.pageOverflow && !seen.has('overflow')) {seen.add('overflow'); findings.push({detector:'ui', kind:'page overflow', op, detail:`page is ${u.pageOverflow}px wider than the 1920px viewport`});}
    for(const [kind, list] of [['clipped text', u.clipped], ['unlabeled control', u.unlabeled]]) {
        const fresh = list.filter(x => !seen.has(kind + x));
        fresh.forEach(x => seen.add(kind + x));
        if(fresh.length) notes.push({run, detector:'ui', kind, op, detail:fresh.slice(0, 8).join(', ') + (fresh.length > 8 ? ` (+${fresh.length - 8})` : '')});
    }
}

/** Build stamp for traces (PT85): commit plus whether game sources differ from it. */
function buildStamp() {
    const git = (...a) => {try {return execFileSync('git', a, {cwd:new URL('../..', import.meta.url).pathname, encoding:'utf8'}).trim();} catch {return null;}};
    const dirty = git('status', '--porcelain', '--', 'src', 'index.html', 'styles');
    return {commit:git('rev-parse', '--short', 'HEAD'), sourcesDirty:dirty === null ? null : dirty.length > 0};
}

/** Policy: the scripted route. A later policy returns the next op from an observation. */
function* scriptedPolicy() {yield* ROUTE;}

/** Paths a reload removed, changed or added. Added zero, empty or false values count as defaults. */
export function classifyReload(before, after) {
    const lost = [], changed = [], added = [];
    const isDefault = v => v === 0 || v === '' || v === false || v === null || (Array.isArray(v) ? !v.length : v && typeof v === 'object' && !Object.keys(v).length);
    const walk = (x, y, path) => {
        if(JSON.stringify(x) === JSON.stringify(y)) return;
        if(x && y && typeof x === 'object' && typeof y === 'object' && Array.isArray(x) === Array.isArray(y)) {
            for(const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
                if(!(k in y)) lost.push(path + '/' + k);
                else if(!(k in x)) added.push({path:path + '/' + k, isDefault:isDefault(y[k])});
                else walk(x[k], y[k], path + '/' + k);
            }
        } else changed.push(path);
    };
    const a = JSON.parse(canonicalSave(before)), b = JSON.parse(canonicalSave(after));
    walk(a, b, '');
    return {lost, changed, added};
}

async function playRun({url, seed, runIndex, inject, shots}) {
    const fault = INJECT[inject] ?? {};
    let phase = 'play';
    const s = new Session({url, seed:fault.unseededRun === runIndex ? null : seed, wall:WALL_START,
        hooks:{beforeOpen:(ctx, seedSave) => fault.beforeOpen?.(ctx, seedSave, phase)}});
    const ops = [], saves = {}, findings = [], notes = [], uiSeen = new Set();
    await s.start();
    try {
        await s.open(null);
        let prev = await s.observe(), sameState = 0, i = 0;
        await uiPass(s, 'start', findings, notes, uiSeen, runIndex);
        for(const step of scriptedPolicy()) {
            s.op = i;
            const t0 = performance.now(), rec = {i, ...step};
            try {
                if(step.op === 'click') await s.page.locator(step.sel).first().click();
                else if(step.op === 'step') await s.step(step.minutes);
                else if(step.op === 'save') saves[step.name] = await s.save();
                else if(step.op === 'load') await s.open(PATCHES[step.patch](saves[step.from]));
                await s.page.waitForTimeout(300);
                if(fault.afterOp?.index === i) await fault.afterOp.run(s.page);
            } catch(e) {
                rec.error = e.message.split('\n')[0];
                findings.push({detector:'stuck', kind:'dead end', op:i, detail:`${step.op} ${step.sel ?? ''} failed: ${rec.error}`});
            }
            rec.ms = Math.round(performance.now() - t0);
            const obs = await s.observe().catch(e => ({error:e.message}));
            rec.obs = obs;
            ops.push(rec);
            if(!rec.error && step.op !== 'save' && obs.screen !== prev.screen) await uiPass(s, i, findings, notes, uiSeen, runIndex);
            if(shots && !rec.error && step.op !== 'save') await s.page.screenshot({path:join(shots, `run${runIndex}-op${String(i).padStart(2, '0')}.png`)}).catch(() => {});
            if(!rec.error && step.op === 'click' && obs.state === prev.state && obs.screen === prev.screen)
                findings.push({detector:'stuck', kind:'dead click', op:i, detail:`${step.sel} changed neither the screen nor the save`});
            sameState = obs.state === prev.state ? sameState + 1 : 0;
            if(sameState === STUCK_STREAK) findings.push({detector:'stuck', kind:'no progress', op:i, detail:`${STUCK_STREAK} ops without a durable state change`});
            prev = obs; i++;
            if(rec.error) break; // a scripted route cannot recover from a dead end
        }
        // Save round trip: load each save into a fresh context and save at once (B), then again (C).
        // Lost or changed values and a loader that keeps changing B fail; added defaults are notes.
        phase = 'roundtrip'; s.op = 'roundtrip';
        for(const [name, save] of Object.entries(saves)) {
            await s.open(save);
            const b = await s.save();
            await s.open(b);
            const c = await s.save();
            const {lost, changed, added} = classifyReload(save, b);
            if(lost.length || changed.length)
                findings.push({detector:'roundtrip', kind:'reload lost or changed data', op:name, detail:[...lost.map(p => 'lost ' + p), ...changed.map(p => 'changed ' + p)].slice(0, 6).join(', ')});
            if(canonicalSave(b) !== canonicalSave(c))
                findings.push({detector:'roundtrip', kind:'loader not idempotent', op:name, detail:diffSaves(b, c, 5).map(d => d.path).join(', ')});
            const real = added.filter(a => !a.isDefault);
            if(real.length) notes.push({run:runIndex, detector:'roundtrip', kind:'reload added data', op:name, detail:real.slice(0, 6).map(a => a.path).join(', ')});
            if(added.length > real.length) notes.push({run:runIndex, detector:'roundtrip', kind:'reload filled defaults', op:name, detail:`${added.length - real.length} zero/empty fields, e.g. ${added.find(a => a.isDefault).path}`});
        }
    } finally {await s.close();}
    for(const e of s.errors) findings.push({detector:'errors', kind:e.kind, op:e.op, detail:e.text});
    return {runIndex, seeded:fault.unseededRun !== runIndex, ops, findings, notes,
        saves:Object.fromEntries(Object.entries(saves).map(([k, v]) => [k, {state:stateHash(v), full:sha(canonicalSave(v))}])), raw:saves};
}

export async function playtest({seed = SEED, runs = 2, inject = null, out, url, shots = false} = {}) {
    let bundle, server;
    if(!url) {bundle = await buildBundle(); server = await serve(bundle.dir); url = server.url;}
    const t0 = performance.now(), results = [];
    const shotDir = shots && out ? join(out, 'shots') : null;
    if(shotDir) await mkdir(shotDir, {recursive:true});
    try {for(let r = 0; r < runs; r++) results.push(await playRun({url, seed, runIndex:r, inject, shots:shotDir}));}
    finally {server?.close(); await bundle?.dispose();}
    const findings = results.flatMap(r => r.findings.map(f => ({run:r.runIndex, ...f})));
    const notes = results.flatMap(r => r.notes);
    // Determinism: every named save identical across runs (canonical form, wall fields dropped).
    for(let r = 1; r < results.length; r++) for(const [name, save] of Object.entries(results[0].raw)) {
        const other = results[r].raw[name];
        if(!other) findings.push({run:r, detector:'determinism', kind:'missing save', op:name, detail:'save point not reached'});
        else if(canonicalSave(other) !== canonicalSave(save))
            findings.push({run:r, detector:'determinism', kind:'runs diverged', op:name, detail:diffSaves(save, other, 5).map(d => d.path).join(', ')});
    }
    const verdict = Object.fromEntries(DETECTORS.map(d => [d, runs < 2 && d === 'determinism' ? 'skipped' : findings.some(f => f.detector === d) ? 'FAIL' : 'pass']));
    // Speed KPIs (PT85): game minutes played and per wall second, per run.
    const speed = results.map(r => {
        const mins = r.ops.map(o => o.obs?.minute).filter(Number.isFinite), wall = r.ops.reduce((a, o) => a + o.ms, 0);
        const played = mins.length ? mins.at(-1) - mins[0] : 0;
        return {run:r.runIndex, gameMinutes:played, routeWallS:+(wall / 1000).toFixed(1), gameMinPerWallS:wall ? +(played / wall * 1000).toFixed(1) : 0};
    });
    const report = {seed, runs, inject, tier:'chrome dev-stepped', viewport:'1920x1080', build:buildStamp(), speed,
        ms:Math.round(performance.now() - t0), verdict, findings, notes,
        runs_detail:results.map(({raw, notes, ...r}) => r)};
    if(out) {
        await mkdir(out, {recursive:true});
        await writeFile(join(out, 'trace.json'), JSON.stringify(report, null, 2));
        await writeFile(join(out, 'REPORT.md'), markdown(report));
    }
    return report;
}

function markdown(r) {
    const lines = [`# Playtest report`, '', `Route: scripts/headless/village_route.mjs, ${ROUTE.length} ops. Seed ${r.seed}, ${r.runs} run(s), fault: ${r.inject ?? 'none'}, ${(r.ms / 1000).toFixed(1)} s wall.`,
        `Tier: ${r.tier} at ${r.viewport}. Build: ${r.build.commit ?? 'unknown'}${r.build.sourcesDirty ? ' plus uncommitted game-source edits' : ''}. Speed: ${r.speed.map(x => `run ${x.run} ${x.gameMinutes} game min in ${x.routeWallS} s`).join('; ')}.`, '',
        '| Detector | Verdict | Findings |', '| --- | --- | --- |',
        ...DETECTORS.map(d => `| ${d} | ${r.verdict[d]} | ${r.findings.filter(f => f.detector === d).length} |`), ''];
    if(r.findings.length) lines.push('## Findings', '', ...r.findings.slice(0, 40).map(f => `- run ${f.run}, op ${f.op}, ${f.detector} (${f.kind}): ${String(f.detail).replace(/\s+/g, ' ').slice(0, 240)}`), '');
    if(r.notes.length) lines.push('## Notes (reported, not failing)', '', ...r.notes.slice(0, 20).map(f => `- run ${f.run}, ${f.op}, ${f.detector} (${f.kind}): ${String(f.detail).slice(0, 240)}`), '');
    lines.push('## Save points', '', '| Run | Seeded | ' + Object.keys(r.runs_detail[0]?.saves ?? {}).join(' | ') + ' |', '| --- | --- |' + ' --- |'.repeat(Object.keys(r.runs_detail[0]?.saves ?? {}).length),
        ...r.runs_detail.map(x => `| ${x.runIndex} | ${x.seeded} | ` + Object.values(x.saves).map(v => v.full).join(' | ') + ' |'), '',
        'Trace (trace.json) holds op timings and observation hashes only. Hashes are sha256 prefixes of canonical saves.', '');
    return lines.join('\n');
}

if(import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2), arg = (k, d) => {const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d;};
    const out = arg('--out', join(tmpdir(), 'yairpg-playtest'));
    if(args.includes('--self-test')) {
        // One bundle and server for all five cases.
        const bundle = await buildBundle(), server = await serve(bundle.dir), rows = [];
        try {
            for(const inject of [null, ...Object.keys(FAULTS)]) {
                const runs = inject === null || inject === 'nondet' ? 2 : 1;
                const r = await playtest({inject, runs, url:server.url, out:join(out, inject ?? 'clean')});
                const expect = inject ? FAULTS[inject] : null;
                const failed = DETECTORS.filter(d => r.verdict[d] === 'FAIL');
                const ok = inject ? failed.includes(expect) : failed.length === 0;
                rows.push({case:inject ?? 'clean', expect:expect ?? 'all pass', failed:failed.join(', ') || 'none', ok, s:(r.ms / 1000).toFixed(1)});
                process.stderr.write(`${ok ? 'ok ' : 'BAD'} ${inject ?? 'clean'}: failed=[${failed}] ${r.ms} ms\n`);
            }
        } finally {server.close(); await bundle.dispose();}
        const md = ['# Playtest self-test', '', '| Case | Expected | Detectors that failed | Result | Wall s |', '| --- | --- | --- | --- | --- |',
            ...rows.map(x => `| ${x.case} | ${x.expect} | ${x.failed} | ${x.ok ? 'ok' : 'WRONG'} | ${x.s} |`), ''].join('\n');
        await writeFile(join(out, 'SELF_TEST.md'), md);
        process.stdout.write(md + `\nWritten to ${out}\n`);
        process.exitCode = rows.every(x => x.ok) ? 0 : 1;
    } else {
        const r = await playtest({seed:Number(arg('--seed', SEED)), runs:Number(arg('--runs', 2)), inject:arg('--inject', null), out, shots:args.includes('--shots')});
        process.stdout.write(JSON.stringify({verdict:r.verdict, findings:r.findings.length, ms:r.ms, out}, null, 2) + '\n');
        process.exitCode = Object.values(r.verdict).includes('FAIL') ? 1 : 0;
    }
}
