#!/usr/bin/env node
// Lists every money amount a payload states, by locator, in pence, with no source text (AD49 anchor candidates).
// A candidate is not an anchor until a person checks the paragraph. It parses digits and spelled numbers with
// pound/soli/penny words; it does not follow derived sums, implied currencies or "a pound" with no number. Loen: 1 pound = 20 soli = 240 pence,
// 1 soli = 12 pence (stated at ch26 P079). Run: node scripts/lead_run/money_anchors.mjs <payload.txt> [--json]
import {readFileSync} from 'node:fs';
import {parsePayload} from './check_reader_rows.mjs';

const ONES = {zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19};
const TENS = {twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90};
const UNIT = {pound: 240, pounds: 240, soli: 12, penny: 1, pence: 1, pennies: 1, halfpenny: .5, halfpence: .5};
const NUM = `(?:\\d+(?:\\.\\d+)?|(?:${Object.keys(TENS).join('|')})(?:[- ](?:${Object.keys(ONES).join('|')}))?|${Object.keys(ONES).join('|')}|a half|half|one and a half)`;
const RE = new RegExp(`\\b(${NUM})(?:\\s+and\\s+a\\s+half)?\\s+(pounds?|soli|pence|penny|pennies|halfpence|halfpenny)\\b`, 'gi');
export const toNumber = w => {
  w = w.toLowerCase().trim();
  if (/^\d/.test(w)) return parseFloat(w);
  if (w === 'a half' || w === 'half') return .5;
  if (w === 'one and a half') return 1.5;
  const [t, o] = w.split(/[- ]/);
  if (TENS[t] !== undefined) return TENS[t] + (o ? ONES[o] ?? 0 : 0);
  return ONES[w];
};
export function anchors(payloadText) {
  const found = [];
  for (const [ch, paras] of parsePayload(payloadText)) for (const [p, text] of paras) {
    const items = [];
    for (const m of text.matchAll(RE)) {
      const n = toNumber(m[1]); if (n === undefined || Number.isNaN(n)) continue;
      const half = /and a half/i.test(m[0]) && !/one and a half/i.test(m[1]) ? .5 : 0;
      items.push({amount: n + half, unit: m[2].toLowerCase(), pence: (n + half) * UNIT[m[2].toLowerCase()]});
    }
    const has = (n, u) => items.some(i => i.amount === n && i.unit.startsWith(u));
    const rate = (has(1, 'pound') && has(20, 'soli')) || (has(1, 'soli') && has(12, 'pen'));
    if (items.length) found.push({loc: `ch${ch} P${String(p).padStart(3, '0')}`, items, ...(rate ? {rate: true, totalPence: null} : {totalPence: items.reduce((a, b) => a + b.pence, 0)})});
  }
  return found;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv.slice(2).find(a => !a.startsWith('--'));
  const list = anchors(readFileSync(file, 'utf8'));
  if (process.argv.includes('--json')) console.log(JSON.stringify(list, null, 1));
  else for (const a of list) console.log(`${a.loc}\t${a.items.map(i => `${i.amount} ${i.unit}`).join(' + ')}\t${a.rate ? 'RATE STATEMENT (conversion, not an amount)' : `= ${a.totalPence} pence`}`);
  console.log(`${list.length} paragraph(s) state money`);
}
