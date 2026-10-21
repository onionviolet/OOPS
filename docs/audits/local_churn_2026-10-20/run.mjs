#!/usr/bin/env node
// Slow serial local-model churn. Resumable: a task whose out/<id>.md exists is skipped.
//   node run.mjs [--only id] [--model name]   (Ollama at localhost:11434, one request at a time)
// Output is machine-drafted brainstorm, never accepted direction. Triage happens in the frontier pass.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..');
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const model = arg('--model') || 'qwen3.8:27b', only = arg('--only');
const tasks = JSON.parse(fs.readFileSync(path.join(here, 'tasks.json'), 'utf8'));
const outline = (file, cap) => {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  const heads = text.split('\n').filter(l => /^#{1,3} /.test(l)).join('\n');
  return `FILE ${file} (headings only)\n${heads}`.slice(0, cap);
};
const RULES = `You are brainstorming for a single-player life-sim idle RPG whose worlds come from books, games and original settings. Rules: plain words, no em dashes. Write constraints as default, dial and reason, never "always" or "never". Do not claim anything about the repository beyond the headings shown; label such claims "unverified". Do not copy copyrighted text; describe in your own words. Give 8 to 12 numbered items. Each item: a short title, one sentence on what is missing or could go wrong, one sentence on how a builder would check it, and a guess at effort (S, M, L).`;
const post = async body => {
  const r = await fetch('http://localhost:11434/api/chat', {method: 'POST', body: JSON.stringify(body)});
  if (!r.ok) throw new Error(`ollama ${r.status}`);
  return r.json();
};
for (const t of tasks) {
  if (only && t.id !== only) continue;
  const out = path.join(here, 'out', `${t.id}.md`);
  if (fs.existsSync(out)) continue;
  const context = t.files.map(f => outline(f, 2600)).join('\n\n');
  const started = Date.now();
  try {
    const res = await post({model, stream: false, think: false, keep_alive: '5m',
      options: {num_ctx: 8192, num_predict: 1800, temperature: 0.8},
      messages: [{role: 'system', content: RULES}, {role: 'user', content: `TOPIC: ${t.topic}\nLENS: ${t.lens}\n\nWhat the design docs already cover:\n${context}\n\nList what is still missing or under-considered through this lens.`}]});
    const secs = Math.round((Date.now() - started) / 1000);
    fs.writeFileSync(out, `<!-- machine-drafted by ${model}, ${new Date().toISOString()}, ${secs}s, ${res.eval_count} tokens; unreviewed brainstorm, not accepted direction -->\n# ${t.id}: ${t.topic} / ${t.lens}\n\n${res.message.content}\n`);
    console.log(`${t.id} done ${secs}s`);
  } catch (e) { console.log(`${t.id} failed: ${e.message}`); }
}
console.log('queue finished');
