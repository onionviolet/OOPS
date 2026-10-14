// Probe text lint (WS2, WS4, MD225-MD234). READ-ONLY for workers. Exit 0 pass, 1 fail.
import {pathToFileURL} from 'node:url';
const WT = '/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg';
const R = await import(pathToFileURL(WT + '/src/start_records.js').href), W = await import(pathToFileURL(WT + '/src/data/start_layers_frontier.js').href);
const world = W.frontierStartWorld; const results = []; const rec = (id, ok, d) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} ${JSON.stringify(d)}`); };
const frags = []; for (const [axis, ls] of Object.entries(world.layers)) for (const l of ls) { for (const t of l.patch.text || []) frags.push({where: `${axis}/${l.id}/text`, t}); for (const [k, t] of Object.entries(l.patch.pockets || {})) frags.push({where: `${axis}/${l.id}/pocket/${k}`, t}); }
const long = frags.filter(f => f.t.length > 170 && !f.where.startsWith('entry/vanilla/text')).map(f => f.where);
rec('T1_length_budget', long.length === 0, long);
const dash = frags.filter(f => /—|–| -- /.test(f.t)).map(f => f.where); rec('T2_no_em_dashes', dash.length === 0, dash);
const sentences = frags.filter(f => !f.where.startsWith('entry/') && (f.t.match(/[.!?](\s|$)/g) || []).length > 2).map(f => f.where); rec('T3_layer_fragments_short', sentences.length === 0, sentences);
const rep = []; for (let i = 0; i < 80; i++) { const r = R.resolveStart(world, {entry: {mode: 'lock', layerId: 'vanilla'}}, 'lint' + i);
  const firsts = r.layers.flatMap(l => (l.patch.text || []).map(t => t.split(/\s+/).slice(0, 2).join(' ').toLowerCase())); const dup = firsts.find((w, j) => firsts.indexOf(w) !== j); if (dup) rep.push(`lint${i}:${dup}`); }
rec('T4_no_repeated_openers', rep.length === 0, rep.slice(0, 5));
const money = []; for (const ls of Object.values(world.layers)) for (const l of ls) if (l.patch.money && l.id !== 'vanilla') { const words = ['one', 'two', 'three', 'four', 'five', 'six']; const n = l.patch.money; const txt = (l.patch.text || []).join(' ').toLowerCase(); if (!(txt.includes(String(n)) || txt.includes(words[n - 1] || '#'))) money.push(l.id); }
rec('T5_money_text_honest', money.length === 0, money);
process.exit(results.every(Boolean) ? 0 : 1);
