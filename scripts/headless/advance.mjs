#!/usr/bin/env node
// Advance a save by days, minutes or to the next simulation event, headlessly, on a copy.
//   node scripts/headless/advance.mjs --save in.json --days 30 --out out.json [--seed 1] [--chunk 60]
//   node scripts/headless/advance.mjs --save in.json --until event [--max-days 60] --out out.json
//   node scripts/headless/advance.mjs --fresh --days 3 --out out.json
// Uses the runner's real dev stepper (advanceTicks), so the result is byte-identical to stepping one
// tick at a time (RT8). It does not use the browser-only sliced fastForward(), which needs a real
// event loop. The input file is never written; --out must differ from --save. Prints a JSON receipt.
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {boot, canonicalSave} from './runner.mjs';

export const MINUTES_PER_DAY = 1440;

/** Minutes until the next simulation boundary, or null when nothing is scheduled. Reads the live state only. */
export async function minutesToNextEvent(game) {
    const state = game.internals.expansionState;
    if(!state) return null;
    // Loaded on demand: a frozen game build ships no src/, and plain minutes/days steps never need it.
    const {nextSimulationBoundary} = await import('../../src/simulation.js');
    const at = nextSimulationBoundary(state);
    return Number.isFinite(at) ? Math.max(1, Math.ceil(at - state.clock)) : null;
}

/**
 * Advance an already-booted game. Exactly one of days/minutes/untilEvent.
 * chunk is the dev time multiplier: game minutes per stepper call between invariant checks.
 */
export async function advanceGame(game, {days, minutes, untilEvent = false, chunk = 60, maxMinutes = 60 * MINUTES_PER_DAY} = {}) {
    const modes = [days != null, minutes != null, untilEvent].filter(Boolean).length;
    if(modes !== 1) throw new Error('Give exactly one of days, minutes or untilEvent.');
    const want = untilEvent ? await minutesToNextEvent(game) : minutes ?? days * MINUTES_PER_DAY;
    if(want == null) return {requested:null, advanced:0, reason:'no scheduled event', wallMs:0};
    if(!Number.isFinite(want) || want < 0) throw new RangeError('Advance amount must be finite and nonnegative.');
    const asked = Math.min(want, maxMinutes);
    const startCalendar = game.minutes(), t0 = performance.now(), cpu0 = process.cpuUsage();
    const clock0 = game.internals.expansionState?.clock;
    const r = asked ? await game.step(asked, {chunk}) : {minutes:0};
    const cpu = process.cpuUsage(cpu0);
    const wallMs = Math.round(performance.now() - t0);
    return {requested:want, capped:asked < want, advanced:r.minutes, startCalendar, endCalendar:game.minutes(),
        expansionClock:[clock0, game.internals.expansionState?.clock], wallMs,
        cpuMs:Math.round((cpu.user + cpu.system) / 1000), minPerWallS:wallMs ? Math.round(r.minutes / wallMs * 1000) : null};
}

if(import.meta.url === `file://${process.argv[1]}`) {
    const opt = {};
    for(let i = 2; i < process.argv.length; i++) {
        const a = process.argv[i];
        if(!a.startsWith('--')) throw new Error(`Unexpected argument ${a}`);
        const k = a.slice(2);
        opt[k] = ['fresh'].includes(k) ? true : process.argv[++i];
    }
    if(!opt.out) throw new Error('--out <file> is required.');
    if(opt.save && resolve(opt.save) === resolve(opt.out)) throw new Error('--out must differ from --save (input saves stay untouched).');
    if(!opt.save && !opt.fresh) throw new Error('Give --save <file> or --fresh.');
    const save = opt.save ? await readFile(opt.save, 'utf8') : null;
    const game = await boot(save, {seed:Number(opt.seed ?? 1)});
    let line;
    try {
        const amount = opt.until === 'event' ? {untilEvent:true} : opt.days != null ? {days:Number(opt.days)} : {minutes:Number(opt.minutes)};
        const receipt = await advanceGame(game, {...amount, chunk:Number(opt.chunk ?? 60),
            ...(opt['max-days'] ? {maxMinutes:Number(opt['max-days']) * MINUTES_PER_DAY} : {})});
        const out = game.snapshot();
        await writeFile(opt.out, JSON.stringify(out));
        line = JSON.stringify({...receipt, out:opt.out, saveBytes:canonicalSave(out).length});
    } finally {game.close();}
    console.log(line); // after close(): the runner captures console until then
}
