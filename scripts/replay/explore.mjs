#!/usr/bin/env node
// Branch explorer CLI for the expedition engine adapter.
//   node scripts/replay/explore.mjs --find-event --world-seed 1 --seeds 8 [--follow-minutes 1440] [--event occurrence:15] [--stat Perception=40] [--json]
//   node scripts/replay/explore.mjs --save save.json --seeds 8 ...
// --find-event plays the replay chooser from a new save until an event with two or more eligible responses is
// open, then runs every response of one event across the seeds (and stat variants). The input is never written.
import {readFileSync} from 'node:fs';
import './engine_adapter.mjs';
import {replayAdapter, createChooser} from './replay_core.mjs';
import {exploreBranches, formatReport, statVariant} from './branch_explorer.mjs';

const opt = {}, multi = [];
for(let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if(!a.startsWith('--')) throw Error(`Unexpected argument ${a}`);
    const k = a.slice(2);
    if(['find-event', 'json'].includes(k)) opt[k] = true;
    else if(k === 'stat') multi.push(process.argv[++i]);
    else opt[k] = process.argv[++i];
}
Math.random = () => {throw Error('Explorer used ambient Math.random.');};
const adapter = replayAdapter(opt.adapter || 'engine.expedition');
let save = opt.save ? JSON.parse(readFileSync(opt.save, 'utf8')) : adapter.save(adapter.load(adapter.newSave(Number(opt['world-seed'] ?? 1))));
let eventId = opt.event;
if(opt['find-event']) {
    let run = adapter.load(save);
    const choose = createChooser(Number(opt['world-seed'] ?? 1));
    for(let i = 0; i < 2000; i++) {
        const options = adapter.candidates(run, choose);
        const responses = options.filter(o => o.cmd.k === 'respond');
        const ids = [...new Set(responses.map(o => o.cmd.eventId))].filter(id => responses.filter(o => o.cmd.eventId === id).length >= 2);
        if(ids.length) {save = adapter.save(run); eventId ??= ids[0]; break;}
        try {run = adapter.apply(run, choose.weighted(options).cmd);} catch {}
    }
    if(!eventId) throw Error('No event with two or more responses within 2000 steps.');
}
const variants = [{label: 'base'}];
for(const spec of multi) {
    const [name, value] = spec.split('=');
    variants.push(statVariant(`gameplay.player.skills.${name}.xp`, Number(value), `${name} xp ${value}`));
}
const seeds = Array.from({length: Number(opt.seeds ?? 8)}, (_, i) => i + 1);
const t0 = performance.now();
const report = exploreBranches({adapter: adapter.id, save, seeds, variants,
    branch: {kind: 'choices', ...(eventId ? {eventId} : {})}, follow: opt['follow-minutes'] ? [{k: 'advance', minutes: Number(opt['follow-minutes'])}] : []});
const ms = Math.round(performance.now() - t0);
if(opt.json) console.log(JSON.stringify(report));
else console.log(`event ${eventId ?? '(all)'} at clock ${save.state.clock}; ${report.branches} branches in ${ms} ms\n` + formatReport(report));
