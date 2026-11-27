#!/usr/bin/env node
// PWC128: the headline count of effects that fire in ordinary play.
//   node scripts/effect_landing_count.mjs            play the season, print the count, write docs/coverage/effect_landings.json
//   node scripts/effect_landing_count.mjs --check    play it and fail if the committed receipt no longer matches
//   node scripts/effect_landing_count.mjs --start village [--minutes N] [--actions N]   one start, printed only
// It plays each start headless with the work policy (scripts/headless/trace.mjs) and counts `landEffect` results that
// changed the world, through the opt-in observer in src/effect_host.js, by law and by entry point. Capability runs, the
// workshop and every debug control are denied to the bot, and any landing made inside a capability run is counted in
// `excluded`, never in the headline. The coverage report (scripts/coverage_report.mjs) renders the receipt; it does not boot the game.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LAND_TAP} from '../src/effect_host.js';
import {ENTRY_POINTS} from '../src/played_effects_domain.js';
import {recordTrace} from './headless/trace.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RECEIPT = path.join(root, 'docs/coverage/effect_landings.json');
// A season (default, dial, reason). Default: 2 game days, 300 bot presses, seed 1. Dial: --minutes, --actions. Reason: long enough
// for chores, a brew and a fight to come up, short enough to replay (a headless day costs about seven minutes); the headline is a floor, not a play-time claim.
export const SEASON = Object.freeze({seed: 1, minutes: 2880, actions: 300, dt: 10, policy: 'work'});
// The default start and one book-world start (the Gu keeper: a fight, chores, a brew and a household in one life).
export const STARTS = Object.freeze(['village', 'book.ri.keeper']);
export const DENY = /capability_runs_open|data-capability-run|capability_runs_view|effects_workshop|test_hooks/;
const LEDGER_BY_ENTRY = new Map(ENTRY_POINTS.filter(row => row.ledgerKey).map(row => [`${row.law} / ${row.entry}`, row.ledgerKey]));

export function landingRecord(row) {
    const ledgerKey = LEDGER_BY_ENTRY.get(`${row.law} / ${row.entry}`);
    return ledgerKey === undefined ? row : {...row, ledgerKey};
}

export async function countStart(start, season = SEASON) {
    const rows = [];
    globalThis[LAND_TAP] = row => rows.push(landingRecord(row));
    let trace;
    try { trace = await recordTrace(start, {...season, deny: DENY}); } finally { delete globalThis[LAND_TAP]; }
    const fired = rows.filter(r => r.changed && r.entry !== 'capability-run');
    const bump = (map, key) => { map[key] = (map[key] ?? 0) + 1; };
    const byLaw = {}, byEntry = {}, byLawEntry = {};
    for (const r of fired) { bump(byLaw, r.law); bump(byEntry, r.entry); bump(byLawEntry, `${r.law} / ${r.entry}`); }
    const sort = map => Object.fromEntries(Object.entries(map).sort(([a], [b]) => a < b ? -1 : 1));
    const ledgerLandings = rows.filter(r => r.ledgerKey !== undefined && r.entry !== 'capability-run');
    return {start, landed: fired.length, attempted: rows.filter(r => r.entry !== 'capability-run').length,
        excluded: rows.filter(r => r.entry === 'capability-run').length, byLaw: sort(byLaw), byEntry: sort(byEntry), byLawEntry: sort(byLawEntry),
        ...(ledgerLandings.length && {ledgerLandings}),
        minutes: trace.end.minutes, presses: trace.end.actions, ended: trace.end.reason, errors: trace.end.errors};
}

export async function countAll(starts = STARTS, season = SEASON) {
    const results = [];
    for (const start of starts) results.push(await countStart(start, season));
    return {schema: 1, season, starts: results, landed: results.reduce((n, r) => n + r.landed, 0)};
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2), arg = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
    const only = arg('--start') ? [arg('--start')] : null;
    const season = {...SEASON, ...(arg('--minutes') && {minutes: +arg('--minutes')}), ...(arg('--actions') && {actions: +arg('--actions')})};
    const result = await countAll(only ?? STARTS, season);
    if (only) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }
    const text = JSON.stringify(result, null, 2) + '\n';
    if (args.includes('--check')) {
        const same = fs.existsSync(RECEIPT) && fs.readFileSync(RECEIPT, 'utf8') === text;
        console.log(same ? `effect landings match the receipt (${result.landed})` : `effect landings differ from ${path.relative(root, RECEIPT)}: now ${result.landed}`);
        process.exit(same ? 0 : 1);
    }
    fs.writeFileSync(RECEIPT, text);
    console.log(`effects landed in ordinary play: ${result.landed} (${result.starts.map(r => `${r.start} ${r.landed}`).join(', ')}); wrote ${path.relative(root, RECEIPT)}`);
}
