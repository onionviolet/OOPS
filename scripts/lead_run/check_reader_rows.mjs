#!/usr/bin/env node
// Deterministic checks for a row/seam reader's JSON against its payload (see BOOK_ABSORPTION_WORKFLOW "Standing checks").
// Catches what past reads got wrong: locators that do not exist or sit outside the window, fields over the word limit,
// verbatim quotation, and money figures in a row that appear nowhere in the paragraphs it cites.
// Hard problems (locators, verbatim runs) fail; soft ones (word limit, unmatched money) are listed for the checker. It cannot tell a locator that exists from one that points at the right paragraph; sample those against the text.
// Run: node scripts/lead_run/check_reader_rows.mjs <out.json> <payload.txt> [--limit 30] [--json]
import {readFileSync} from 'node:fs';

export const parsePayload = text => {
  const chapters = new Map(); let ch = null;
  for (const line of text.split('\n')) {
    const h = /^## v\d+ ch(\d+)\b/.exec(line);
    if (h) { ch = +h[1]; chapters.set(ch, new Map()); continue; }
    const p = /^P(\d{3})\s(.*)$/.exec(line);
    if (p && ch !== null) chapters.get(ch).set(+p[1], p[2]);
  }
  return chapters;
};
const LOC = /ch(\d+)\s+P(\d+)(?:\s*-\s*(?:ch(\d+)\s+)?P(\d+))?/g;
export const locators = s => [...String(s).matchAll(LOC)].map(m => ({ch: +m[1], from: +m[2], toCh: m[3] ? +m[3] : +m[1], to: m[4] ? +m[4] : +m[2]}));
const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
const strings = (v, path, out) => {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
};
const MONEY = /\b(\d+(?:\.\d+)?)\s*(pounds?|soli|pence|penny|pennies|coppers?|halfpence)\b/gi;

export function checkReader(out, payloadText, {limit = 30} = {}) {
  const chapters = parsePayload(payloadText), problems = [];
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
  const bodies = [...chapters.values()].flatMap(m => [...m.values()]).map(norm);
  const textJoined = bodies.join(' ');
  const paraText = (ch, a, b) => { const m = chapters.get(ch); if (!m) return ''; let t = ''; for (let i = a; i <= b; i++) t += ' ' + (m.get(i) || ''); return t; };
  const items = [['rows', out.rows || []], ['seams', out.seams || []], ['mechanisms', out.mechanisms || []], ['plants', out.plants || []]];
  const first = Math.min(...chapters.keys()), last = Math.max(...chapters.keys());
  for (const [kind, list] of items) list.forEach((it, i) => {
    const id = `${kind}[${i}]${it.id ? ' ' + it.id : ''}`;
    const loc = it.loc;
    if (!loc) problems.push({id, type: 'no-locator'});
    for (const l of locators(loc || '')) {
      const m = chapters.get(l.ch);
      if (!m) { problems.push({id, type: 'locator-chapter-outside-window', detail: `ch${l.ch} not in ch${first}-${last}`}); continue; }
      for (const n of [l.from, l.ch === l.toCh ? l.to : l.from]) if (!m.has(n)) problems.push({id, type: 'locator-paragraph-missing', detail: `ch${l.ch} P${String(n).padStart(3, '0')}`});
      if (l.ch === l.toCh && l.to < l.from) problems.push({id, type: 'locator-reversed', detail: loc});
    }
    for (const [path, s] of strings(it, '', [])) {
      if (path === '.loc' || path === '.id') continue;
      if (words(s) > limit) problems.push({id, type: 'over-limit', soft: true, detail: `${path} ${words(s)} words`});
      const w = norm(s).split(' ').filter(Boolean);
      for (let a = 0; a + 8 <= w.length; a++) if (textJoined.includes(w.slice(a, a + 8).join(' '))) { problems.push({id, type: 'verbatim-run', detail: `${path}: 8-word run matches the text`}); break; }
    }
    const cited = locators(loc || '').map(l => paraText(l.ch, l.from, l.ch === l.toCh ? l.to : l.from)).join(' ');
    const claimed = strings({s: it.summary, a: it.actual_change, n: it.net?.money?.change, w: it.what}, '', []).map(x => x[1]).join(' ');
    for (const m of claimed.matchAll(MONEY)) {
      const num = m[1], spelled = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 20: 'twenty', 30: 'thirty'}[num];
      const inCited = new RegExp(`\\b(${num}${spelled ? '|' + spelled : ''})\\b`, 'i').test(cited);
      if (cited && !inCited) problems.push({id, type: 'money-figure-unmatched', soft: true, detail: `${m[0]} not found in the cited paragraphs (may be a derived sum or a spelled number; check the paragraph)`});
    }
  });
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [outPath, payloadPath] = process.argv.slice(2).filter(a => !a.startsWith('--'));
  const li = process.argv.indexOf('--limit'), limit = li > 0 ? +process.argv[li + 1] : 30;
  const problems = checkReader(JSON.parse(readFileSync(outPath, 'utf8')), readFileSync(payloadPath, 'utf8'), {limit});
  const byType = {}; for (const p of problems) byType[p.type] = (byType[p.type] || 0) + 1;
  const hard = problems.filter(p => !p.soft);
  if (process.argv.includes('--json')) console.log(JSON.stringify(problems, null, 1));
  else { for (const p of problems.slice(0, 40)) console.log(`${p.id}: ${p.type}${p.detail ? ' ' + p.detail : ''}`); if (problems.length > 40) console.log(`... ${problems.length - 40} more`); }
  console.log(problems.length ? `${hard.length} hard, ${problems.length - hard.length} soft: ${JSON.stringify(byType)}` : 'PASS reader rows');
  process.exit(hard.length ? 1 : 0);
}
