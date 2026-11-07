#!/usr/bin/env node
// Continuity check (CTR1-CTR9, docs/CONTINUITY_RULES.md). The same fact is stated in several
// content files; this pulls comparable claims out of structured data and flags the ones that
// disagree: an id with two display names, one name with two ids in a world, one pair of places with
// two travel times, one item with two prices, a label price that is not the cost, a person in two
// places at once, a calendar date that does not match its day index.
//
// Sources: src/**/*.js (literal objects, parsed statically, nothing is imported) and, when present,
// private_packs/**/*.json (gitignored; skipped with one stdout line when absent). A hit that comes
// from a private pack is sealed-shaped: reports and the backlog show file, entity id and claim kind
// only, never labels or text (AGENTS.md sealed secrets).
//
// Ratchet: scripts/continuity_baseline.json lists known findings by key. Known findings pass, a new
// one fails, fixing one retires its entry. Entries whose source is missing never fail.
//
//   node scripts/check_continuity.mjs                  check (exit 1 on new findings)
//   node scripts/check_continuity.mjs --update-baseline
//   node scripts/check_continuity.mjs --backlog        write docs/continuity/CONTINUITY_BACKLOG.md
//   node scripts/check_continuity.mjs --no-private     ignore private_packs even if present
//   node scripts/check_continuity.mjs --show <ref>     print one finding in full (local terminal only; may name ids)
//
// Allow one src line with a trailing comment: // continuity: allow <why>
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = resolve(root, 'scripts/continuity_baseline.json');
const backlogPath = resolve(root, 'docs/continuity/CONTINUITY_BACKLOG.md');

// ---- Dials (CTR9). Every allowance lives here so a world can move it with a reason. ----
export const DIALS = {
  // Two claims about one number agree when they differ by at most this fraction or this many units.
  priceTolerance: {fraction: 0.1, units: 1},
  travelTolerance: {fraction: 0.2, minutes: 5},
  // Names agree when their word sets overlap at least this much (an alias, a short form, a title).
  nameOverlap: 0.5,
  // A name used by several ids in one world is flagged only when it has at least this many words
  // (one-word names such as "Tom" are often two different people).
  duplicateNameMinWords: 2,
  // Fields that say when or where a claim holds. A differing value moves the claim to its own key,
  // so a price at another merchant, an age in another year or a fare in another season is no conflict.
  contextKeys: ['merchant', 'vendor', 'shop', 'seller', 'provider', 'season', 'era', 'year', 'day', 'date',
    'asOf', 'at', 'scene', 'volume', 'wave', 'stage', 'phase', 'means', 'hours', 'currency', 'unit', 'form'],
  // Fields that vary by wave or slice by design. They are not facts about the entity.
  notFacts: ['tier', 'leadSceneCount', 'counts', 'notes', 'revision', 'indexId', 'locator'],
  // Evidence labels (cast data): only stated or timed rows can contradict each other.
  assertedLabels: ['S', 'T'],
  // Object keys that mark an action or option row rather than a definition. Their label is a verb phrase.
  actionKeys: ['costs', 'requires', 'effects', 'operation', 'group', 'duration', 'completionRequires', 'visibleWhen', 'once', 'cancellation'],
  // A volume record (a file with a top-level `volume`, such as lotm-abilities typed_vN.json) is history: its
  // `name` is what that volume's reading called the thing. It is compared only with the same volume (CTR1),
  // so per-volume wording is not read as a rename. Reason: rewriting extraction history loses provenance.
  volumeRecords: true,
  // CTR2 skips generic placeholder names, which stand for many different places (forward-anchor rows).
  placeholderNames: /^(unresolved forward address|forward anchor address)$/,
  // Private subtrees never read (sealed shape).
  sealedKeys: /seal|secret|truth|hidden|identity|knows|leadLife|wants|gaps/i,
  // Pence per unit for worlds that price in pounds, soli and pence (LOTM_PENCE in src/book_world_lotm_ids.js).
  lotmPence: {pound: 240, soli: 12, pence: 1, penny: 1},
  // Rank in the backlog: what the player meets first.
  rank: {'CTR1': 1, 'CTR3': 2, 'CTR4': 3, 'CTR5': 4, 'CTR6': 5, 'CTR7': 6, 'CTR2': 7, 'CTR8': 8},
};
export const CODES = {
  CTR1: 'id has two display names', CTR2: 'name has two ids in one world', CTR3: 'travel time disagrees',
  CTR4: 'price disagrees', CTR5: 'label price is not the cost', CTR6: 'fact value disagrees',
  CTR7: 'calendar date does not match its day', CTR8: 'person in two places at once',
};

const sha = s => createHash('sha256').update(String(s)).digest('hex').slice(0, 12);

// ---------------------------------------------------------------- static parser for src literals
const propRe = /(?:^|[,{\s(])([A-Za-z_$][\w$]*|'[^'\n]*'|"[^"\n]*")\s*:\s*('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|-?\d+(?:\.\d+)?)\s*(?=[,}\n)]|$)/g;
function propsOf(text) {
  const props = {};
  for (const m of text.matchAll(propRe)) {
    const k = m[1].replace(/^['"]|['"]$/g, ''), raw = m[2];
    if (!(k in props)) props[k] = /^['"]/.test(raw) ? raw.slice(1, -1) : Number(raw);
  }
  return props;
}
// Literal objects of a JS source: {line, props, kids, text, allowed}. Strings, comments and template
// literals are skipped so braces inside them do not count. kids are the direct child objects' props.
export function srcRecords(source) {
  const out = [], st = [], n = source.length;
  const ls = [0];
  for (let k = 0; k < n; k++) if (source.charCodeAt(k) === 10) ls.push(k + 1);
  const lineOf = idx => { let lo = 0, hi = ls.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (ls[m] <= idx) lo = m; else hi = m - 1; } return lo; };
  let i = 0;
  while (i < n) {
    const c = source.charCodeAt(i);
    if (c === 47 && source.charCodeAt(i + 1) === 47) { while (i < n && source.charCodeAt(i) !== 10) i++; continue; }
    if (c === 47 && source.charCodeAt(i + 1) === 42) { i = source.indexOf('*/', i + 2); if (i < 0) break; i += 2; continue; }
    if (c === 34 || c === 39) { let j = i + 1; while (j < n && source.charCodeAt(j) !== c) { if (source.charCodeAt(j) === 92) j++; else if (source.charCodeAt(j) === 10) break; j++; } i = j + 1; continue; }
    if (c === 96) { let j = i + 1, d = 0; while (j < n) { const cc = source.charCodeAt(j); if (cc === 92) { j += 2; continue; } if (cc === 96 && d === 0) break; if (cc === 36 && source.charCodeAt(j + 1) === 123) { d++; j += 2; continue; } if (cc === 125 && d > 0) d--; j++; } i = j + 1; continue; }
    if (c === 123) { const p = st[st.length - 1]; if (p) p.segs.push([p.cur, i]); st.push({start: i, segs: [], cur: i + 1, kids: []}); i++; continue; }
    if (c === 125) {
      const f = st.pop();
      if (f) {
        f.segs.push([f.cur, i]);
        const p = st[st.length - 1];
        if (p) p.cur = i + 1;
        const text = f.segs.map(([a, b]) => source.slice(a, b)).join(' {} ');
        if (text.length < 5000) {
          const rec = {line: lineOf(f.start) + 1, props: propsOf(text), text, kids: f.kids};
          if (p) p.kids.push(rec.props);
          out.push(rec);
        }
      }
      i++; continue;
    }
    i++;
  }
  const lines = source.split('\n');
  for (const r of out) r.allowed = /continuity:\s*allow/.test(lines[r.line - 1] || '');
  return out.filter(r => !r.allowed);
}

// ---------------------------------------------------------------- private JSON walker
function jsonRecords(json) {
  const out = [];
  (function visit(o, path, listKey) {
    if (Array.isArray(o)) { o.forEach((x, i) => visit(x, `${path}[${i}]`, listKey)); return; }
    if (!o || typeof o !== 'object') return;
    const props = {}, kids = [];
    for (const [k, v] of Object.entries(o)) {
      if (DIALS.sealedKeys.test(k)) continue;
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') props[k] = v;
      else if (k === 'travel' && v && typeof v === 'object') for (const [tk, tv] of Object.entries(v)) if (typeof tv !== 'object') props[`travel.${tk}`] = tv;
      else if (k === 'window' && v && Array.isArray(v.days)) props['window.days'] = v.days;
      else if (k === 'since' && v && Array.isArray(v.window)) props['window.days'] = v.window;
      else if (Array.isArray(v) && v.length && v.every(x => x && typeof x === 'object' && !Array.isArray(x)) && k === 'costs') for (const x of v) kids.push(x);
      else if (Array.isArray(v) && k === 'dayWindow') props['window.days'] = v;
    }
    out.push({where: path, props, kids, listKey});
    for (const [k, v] of Object.entries(o)) {
      if (DIALS.sealedKeys.test(k) || !v || typeof v !== 'object') continue;
      visit(v, `${path}.${k}`, Array.isArray(v) ? k : listKey);
    }
  })(json, '', '');
  return out;
}

// ---------------------------------------------------------------- claim helpers
const ID_RE = /^[A-Za-z][\w-]*(\.[\w:-]+)+$/;
export const worldOf = id => { const s = String(id).split('.'); return s[0] === 'book' && s.length > 2 ? `${s[0]}.${s[1]}` : s[0]; };
const CLASS_BY_SEG = {person: 'person', people: 'person', place: 'place', loc: 'place', item: 'item', ability: 'ability', npc: 'person'};
const CLASS_BY_LIST = {people: 'person', references: 'person', places: 'place', locations: 'place', placeAliases: 'alias', items: 'item', abilities: 'ability'};
export function classOf(id, listKey) {
  for (const seg of String(id).split('.').slice(1)) if (CLASS_BY_SEG[seg]) return CLASS_BY_SEG[seg];
  return CLASS_BY_LIST[listKey] || null;
}
export function normName(s) {
  return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\([^)]*\)/g, ' ')
    .replace(/'s\b/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/^(the|a|an) /, '').replace(/\s+/g, ' ').trim();
}
export function namesAgree(a, b, overlap = DIALS.nameOverlap) {
  const x = normName(a), y = normName(b);
  if (x === y || !x || !y) return true;
  const tx = new Set(x.split(' ')), ty = new Set(y.split(' '));
  const inter = [...tx].filter(t => ty.has(t)).length;
  if (inter === Math.min(tx.size, ty.size)) return true; // one is a short form of the other
  return inter / new Set([...tx, ...ty]).size >= overlap;
}
export const numbersAgree = (a, b, {fraction, units = 0, minutes = 0}) => Math.abs(a - b) <= Math.max(units, minutes, fraction * Math.max(Math.abs(a), Math.abs(b)));
const ctxOf = props => DIALS.contextKeys.filter(k => props[k] != null).map(k => `${k}=${props[k]}`).join(';');
const MONEY_KEY = /(coins?|crowns?|money|pence|soli|pounds?|gold|stones)$/i;
const LABEL_PRICE = /(\d+)\s*(coins?|crowns?|pence|pennies|soli|pounds?)\b/i;

// ---------------------------------------------------------------- claim emitters
// A claim: {kind, world, entity, attr, value, ctx, status, file, where, id, sealed, text?}
// `rec` is {props, kids, where|line, listKey?}; `src` is {file, sealed}.
export function emitClaims(rec, src, claims) {
  const p = rec.props, id = typeof p.id === 'string' && ID_RE.test(p.id) ? p.id : null;
  const where = rec.where ?? `line ${rec.line}`;
  const base = {file: src.file, where, sealed: src.sealed};
  const isAction = DIALS.actionKeys.some(k => k in p) || /\b(costs|requires|effects)\s*:/.test(rec.text || '') ;
  const status = DIALS.assertedLabels.includes(p.label) ? p.label : null;
  // CTR1/CTR2: display names of entities. name and label are different surfaces, compared like with like.
  if (id) {
    const cls = classOf(id, rec.listKey);
    if (cls && cls !== 'alias') {
      if (typeof p.name === 'string' && p.name.length > 1) claims.push({...base, kind: 'name', world: worldOf(id), entity: id, attr: 'name', value: p.name, cls});
      if (typeof p.label === 'string' && p.label.length > 1 && !isAction && rec.listKey) claims.push({...base, kind: 'name', world: worldOf(id), entity: id, attr: 'label', value: p.label, cls});
    }
    // CTR4: a defined price. Items carry `price`; item definitions in private packs carry `value`.
    const priceKey = ['price', 'buy', 'sell'].find(k => typeof p[k] === 'number') || (classOf(id, rec.listKey) === 'item' && !isAction && typeof p.value === 'number' ? 'value' : null);
    if (priceKey) claims.push({...base, kind: 'price', world: worldOf(id), entity: id, attr: priceKey, value: p[priceKey], ctx: ctxOf(p)});
    // CTR6: scalar facts about a person.
    for (const k of ['age', 'birthYear', 'born', 'role', 'occupation', 'job', 'rank', 'date', 'dateLabel']) {
      if (p[k] == null || DIALS.notFacts.includes(k) || typeof p[k] === 'boolean') continue;
      claims.push({...base, kind: 'fact', world: worldOf(id), entity: id, attr: k, value: p[k], ctx: ctxOf(p).replace(new RegExp(`(^|;)${k}=[^;]*`), '')});
    }
  }
  // A record that re-keys an entity keeps the old id in indexId; the two ids are one entity.
  if (id && typeof p.indexId === 'string' && ID_RE.test(p.indexId) && p.indexId !== id) claims.push({...base, kind: 'link', world: worldOf(id), entity: id, attr: 'indexId', value: p.indexId});
  // CTR3: travel time between two places, or a place's own travel minutes.
  if (typeof p.from === 'string' && typeof p.to === 'string' && typeof p.minutes === 'number' && p.from !== p.to) {
    const pair = [p.from, p.to].sort().join(' <> ');
    claims.push({...base, kind: 'travel', world: worldOf(p.from), entity: `${pair}${p.means ? ' by ' + p.means : ''}`, attr: 'minutes', value: p.minutes, ctx: ctxOf({...p, means: undefined}), id: pair});
  }
  if (id && typeof p['travel.minutes'] === 'number') claims.push({...base, kind: 'travel', world: worldOf(id), entity: id, attr: 'travel.minutes', value: p['travel.minutes'], ctx: String(p['travel.district'] ?? ''), id});
  // CTR5: the price in a label against the cost the row charges.
  const labelHit = typeof p.label === 'string' ? p.label.match(LABEL_PRICE) : null;
  if (labelHit && isAction) {
    let cost = 0, key = '';
    for (const k of rec.kids || []) if (typeof k.amount === 'number' && k.amount < 0 && (k.actor == null || k.actor === 'player') && MONEY_KEY.test(String(k.key ?? k.type ?? 'money'))) { cost += -k.amount; key = String(k.key ?? ''); }
    for (const m of (rec.text || '').matchAll(/\bmoney\(\s*-(\d+)\s*\)/g)) cost += Number(m[1]);
    if (cost > 0 && !/\b(receive|earn|sell|collect|reward|paid)\b/i.test(p.label)) {
      let shown = Number(labelHit[1]);
      const unit = labelHit[2].toLowerCase().replace(/s$/, '');
      if (/pence|penn/i.test(key) && DIALS.lotmPence[unit === 'pennie' ? 'penny' : unit]) shown *= DIALS.lotmPence[unit === 'pennie' ? 'penny' : unit];
      claims.push({...base, kind: 'labelprice', world: id ? worldOf(id) : 'src', entity: id || p.label, attr: 'cost', value: cost, shown, unit, id: id || sha(p.label)});
    }
  }
}

// A cast file's idMap resolves old ids to current ones ("new:hp.place.x (note)" or "hp.person.cast-... (note)").
export function emitIdMap(json, src, claims) {
  for (const [from, to] of Object.entries(json.idMap || {})) {
    const m = typeof to === 'string' ? to.match(/^(?:new:)?([a-z]+\.(?:person|place|ability|item)\.[\w-]+)/) : null;
    if (m && ID_RE.test(from) && m[1] !== from) claims.push({kind: 'link', file: src.file, where: `idMap.${from}`, sealed: src.sealed, world: worldOf(from), entity: from, attr: 'idMap', value: m[1]});
  }
}
// A links file's `distinct` list ([{ids: [a, b], why}]) says two ids sharing a name are different entities (CTR2 allow, with a reason).
export function emitDistinct(json, src, claims) {
  for (const d of Array.isArray(json.distinct) ? json.distinct : []) {
    const ids = (d.ids || []).filter(x => ID_RE.test(x));
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) claims.push({kind: 'distinct', file: src.file, where: `distinct.${ids[i]}`, sealed: src.sealed, world: worldOf(ids[i]), entity: ids[i], attr: 'distinct', value: ids[j]});
  }
}
// Private cast whereabouts: anchors, remote rows and schedule rows become place-in-window claims.
export function emitWhere(json, src, claims) {
  const alias = new Map((json.placeAliases || []).filter(a => a.id && a.place).map(a => [a.id, a.place]));
  const canon = p => alias.get(p) || p;
  const base = {file: src.file, sealed: src.sealed, kind: 'where'};
  const asserted = r => DIALS.assertedLabels.includes(r.label) && !r.claimed;
  (json.anchors || []).forEach((r, i) => { if (asserted(r) && r.actor && r.place) claims.push({...base, where: `anchors[${i}]`, world: worldOf(r.actor), entity: r.actor, attr: 'place', value: canon(r.place), days: r.dayWindow, mins: [0, 1440]}); });
  (json.remoteWhereabouts || []).forEach((r, i) => { const d = r.window?.days || r.since?.window; if (asserted(r) && r.actor && r.place && d) claims.push({...base, where: `remoteWhereabouts[${i}]`, world: worldOf(r.actor), entity: r.actor, attr: 'place', value: canon(r.place), days: d, mins: [0, 1440]}); });
  (json.schedule || []).forEach((r, i) => { const lab = r.contentLabel || r.label; if (DIALS.assertedLabels.includes(lab) && r.actor && r.place && r.recurrence !== 'irregular' && Number.isInteger(r.day) && Number.isInteger(r.from) && Number.isInteger(r.to)) claims.push({...base, where: `schedule[${i}]`, world: worldOf(r.actor), entity: r.actor, attr: 'place', value: canon(r.place), days: [r.day, r.until ?? r.day], mins: [r.from, r.to]}); });
}

// Calendar rows with both `date: 'D Month'` and an integer `day`: the day index must follow the date.
const MONTHS = {january: 31, february: 28, march: 31, april: 30, may: 31, june: 30, july: 31, august: 31, september: 30, october: 31, november: 30, december: 31};
const dayOfYear = s => { const m = String(s).match(/^(\d{1,2})\s+([A-Za-z]+)$/); if (!m || !(m[2].toLowerCase() in MONTHS)) return null; let n = 0; for (const [k, v] of Object.entries(MONTHS)) { if (k === m[2].toLowerCase()) return n + Number(m[1]); n += v; } return null; };
export function calendarFindings(file, records) {
  const rows = records.filter(r => typeof r.props.date === 'string' && Number.isInteger(r.props.day) && dayOfYear(r.props.date) != null)
    .map(r => ({line: r.line, date: r.props.date, day: r.props.day, id: r.props.id || r.props.date, off: (((dayOfYear(r.props.date) - r.props.day) % 365) + 365) % 365}));
  if (rows.length < 2) return [];
  const tally = new Map(); for (const r of rows) tally.set(r.off, (tally.get(r.off) || 0) + 1);
  const modal = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const out = [];
  for (const r of rows) if (r.off !== modal) out.push({code: 'CTR7', world: 'src', entity: `${file}#${r.id}`, key: `CTR7|${file}|${r.id}|${r.date}|${r.day}`, file, where: `line ${r.line}`, sealed: false, ref: sha(`CTR7|${file}|${r.id}`).slice(0, 8),
    why: `Row "${r.id}" says ${r.date} but day ${r.day}; the other rows in this file fit one day-0 offset (${modal}), this one is off by ${(r.off - modal + 365) % 365} days.`});
  return out;
}

// ---------------------------------------------------------------- compare step (the dials above)
const showVal = (c, hide) => hide ? `${typeof c.value === 'number' ? c.value : '(text withheld)'}` : JSON.stringify(c.value);
const place = c => `${c.file}${c.where ? ':' + c.where : ''}`;
function finding(code, group, why) {
  const sealed = group.some(c => c.sealed);
  const valueKey = group.map(c => sha(c.value ?? c.shown)).sort().join('+');
  const plain = `${group[0].world}|${group[0].entity}|${group[0].attr || ''}|${valueKey}`;
  // Sealed-shaped (private pack) findings carry only a hash in the key and the ref: ids can name a person or a twist.
  const key = sealed ? `${code}|${sha(plain)}` : `${code}|${plain}`;
  return {code, world: group[0].world, entity: group[0].entity, sealed, why, files: [...new Set(group.map(c => c.file))].sort(), where: group.map(place), key, ref: sha(key).slice(0, 8)};
}
const byKey = (claims, kind, keyFn) => { const m = new Map(); for (const c of claims) if (c.kind === kind) { const k = keyFn(c); (m.get(k) || m.set(k, []).get(k)).push(c); } return m; };

export function compareClaims(claims) {
  const out = [];
  // CTR1: one id, one field, definitions in different places that disagree.
  for (const [, g] of byKey(claims, 'name', c => `${c.world}|${c.entity}|${c.attr}`)) {
    const hide = g.some(c => c.sealed);
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      if (g[i].file === g[j].file || namesAgree(g[i].value, g[j].value)) continue;
      if ((g[i].volume != null || g[j].volume != null) && g[i].volume !== g[j].volume) continue; // volume record: history
      out.push(finding('CTR1', [g[i], g[j]], `${g[i].entity} is given as ${showVal(g[i], hide)} (${place(g[i])}) and ${showVal(g[j], hide)} (${place(g[j])}) in the same field "${g[i].attr}"; the word sets overlap under ${DIALS.nameOverlap}, so it reads as two different names, not a short form.`));
      i = g.length; break;
    }
  }
  // CTR2: one name, several ids in one world.
  const names = new Map();
  for (const c of claims) if (c.kind === 'name' && c.attr === 'name' && c.cls) { const n = normName(c.value); if (n.split(' ').length < DIALS.duplicateNameMinWords || DIALS.placeholderNames.test(n)) continue; const k = `${c.world}|${c.cls}|${n}`; (names.get(k) || names.set(k, []).get(k)).push(c); }
  const distinct = new Set(claims.filter(c => c.kind === 'distinct').flatMap(c => [`${c.entity}|${c.value}`, `${c.value}|${c.entity}`]));
  for (const [, g] of names) { const ids = [...new Set(g.map(c => c.entity))]; if (ids.length < 2) continue;
    if (ids.every((a, i) => ids.slice(i + 1).every(b => distinct.has(`${a}|${b}`)))) continue; // CTR2 allow: every pair judged a different entity
    const hide = g.some(c => c.sealed);
    out.push(finding('CTR2', g, `One ${g[0].cls} name${hide ? ' (withheld)' : ` "${g[0].value}"`} is defined under ${ids.length} ids in ${g[0].world}: ${ids.join(', ')}. Same person or place with two ids, or two things sharing a name, and nothing says which.`)); }
  // CTR3: travel.
  for (const [, g] of byKey(claims, 'travel', c => `${c.world}|${c.entity}|${c.ctx}`)) {
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      if (g[i].file === g[j].file && g[i].where === g[j].where) continue;
      if (numbersAgree(g[i].value, g[j].value, DIALS.travelTolerance)) continue;
      out.push(finding('CTR3', [g[i], g[j]], `${g[i].entity}: ${g[i].value} min (${place(g[i])}) against ${g[j].value} min (${place(g[j])}); the gap is beyond ${DIALS.travelTolerance.minutes} min and ${DIALS.travelTolerance.fraction * 100}%, same means and season.`)); i = g.length; break;
    }
  }
  // CTR4: item prices.
  for (const [, g] of byKey(claims, 'price', c => `${c.world}|${c.entity}|${c.attr}|${c.ctx}`)) {
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      if (g[i].file === g[j].file && g[i].where === g[j].where) continue;
      if (numbersAgree(g[i].value, g[j].value, DIALS.priceTolerance)) continue;
      out.push(finding('CTR4', [g[i], g[j]], `${g[i].entity} costs ${g[i].value} (${place(g[i])}) and ${g[j].value} (${place(g[j])}) with no merchant, season or era to tell them apart.`)); i = g.length; break;
    }
  }
  // CTR5: label price against charged cost.
  for (const c of claims) if (c.kind === 'labelprice' && c.shown !== c.value) out.push(finding('CTR5', [c], `${c.entity}: the label says ${c.shown} ${c.unit} but the row charges ${c.value}.`));
  // CTR6: scalar facts about a person or event, same context.
  for (const [, g] of byKey(claims, 'fact', c => `${c.world}|${c.entity}|${c.attr}|${c.ctx}`)) {
    const hide = g.some(c => c.sealed);
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      if (g[i].file === g[j].file && g[i].where === g[j].where) continue;
      const a = g[i].value, b = g[j].value;
      if (typeof a === 'number' && typeof b === 'number' ? a === b : normName(a) === normName(b) || namesAgree(a, b, 0.75)) continue;
      out.push(finding('CTR6', [g[i], g[j]], `${g[i].entity} ${g[i].attr}: ${showVal(g[i], hide)} (${place(g[i])}) against ${showVal(g[j], hide)} (${place(g[j])}), same context.`)); i = g.length; break;
    }
  }
  // CTR8: asserted places that overlap in days and minutes.
  const actors = byKey(claims, 'where', c => `${c.file}|${c.entity}`);
  for (const [, g] of actors) for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
    const a = g[i], b = g[j];
    if (a.value === b.value || a.days[0] > b.days[1] || b.days[0] > a.days[1] || a.mins[0] >= b.mins[1] || b.mins[0] >= a.mins[1]) continue;
    out.push(finding('CTR8', [a, b], `${a.entity} is placed at two different places in overlapping days ${a.days.join('-')} and ${b.days.join('-')} (${a.where}, ${b.where}); both rows are stated or timed and neither is a rumour.`));
  }
  const seen = new Set();
  return out.filter(f => !seen.has(f.key) && seen.add(f.key));
}

// ---------------------------------------------------------------- tree scan
function walk(dir, ext, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|\.git)$/.test(e.name)) walk(p, ext, acc); } else if (e.name.endsWith(ext) && !/\.bak|bak-/.test(p)) acc.push(p);
  }
  return acc.sort();
}
export function scanTree({withPrivate = true} = {}) {
  const claims = [], extra = [];
  for (const f of walk(resolve(root, 'src'), '.js')) {
    const rel = relative(root, f), records = srcRecords(readFileSync(f, 'utf8'));
    for (const r of records) emitClaims(r, {file: rel, sealed: /seal/i.test(rel)}, claims);
    extra.push(...calendarFindings(rel, records));
  }
  let privateSeen = 0;
  const privDir = resolve(root, 'private_packs');
  if (withPrivate && existsSync(privDir)) {
    for (const f of walk(privDir, '.json')) {
      let json; try { json = JSON.parse(readFileSync(f, 'utf8')); } catch { continue; }
      privateSeen++;
      const src = {file: relative(root, f), sealed: true};
      const volume = DIALS.volumeRecords && json && !Array.isArray(json) && Number.isInteger(json.volume) && Array.isArray(json.rows) ? json.volume : null;
      const before = claims.length;
      for (const r of jsonRecords(json)) emitClaims(r, src, claims);
      if (volume != null) for (let i = before; i < claims.length; i++) claims[i].volume = volume;
      if (json && !Array.isArray(json)) { emitWhere(json, src, claims); emitIdMap(json, src, claims); emitDistinct(json, src, claims); }
    }
  }
  // A cast file's idMap resolves old ids to current ones; claims under both ids are one entity.
  return {claims, findings: [...compareClaims(applyIdMaps(claims)), ...extra], privateSeen};
}
// Union-find over link claims: claims under either id of a re-keyed entity merge under one.
export function applyIdMaps(claims) {
  const parent = new Map();
  const find = x => { while (parent.has(x) && parent.get(x) !== x) x = parent.get(x); return x; };
  for (const c of claims) if (c.kind === 'link') { const a = find(c.entity), b = find(c.value); if (a !== b) parent.set(a, b); }
  if (!parent.size) return claims;
  return claims.filter(c => c.kind !== 'link').map(c => { const e = find(c.entity); const v = c.kind === 'distinct' ? find(c.value) : c.value; return e === c.entity && v === c.value ? c : {...c, entity: e, value: v, world: worldOf(e)}; });
}

// ---------------------------------------------------------------- baseline and backlog
const readBaseline = () => existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, 'utf8')) : {version: 1, findings: {}};
const isPrivate = f => f.files.some(x => x.startsWith('private_packs/'));
function writeBacklog(findings, privateSeen) {
  const rankOf = f => DIALS.rank[f.code] ?? 9;
  const sorted = [...findings].sort((a, b) => rankOf(a) - rankOf(b) || a.world.localeCompare(b.world) || a.entity.localeCompare(b.entity));
  const counts = {}; for (const f of findings) counts[f.code] = (counts[f.code] || 0) + 1;
  const out = ['# Continuity backlog', '',
    `Generated by \`node scripts/check_continuity.mjs --backlog\`. ${findings.length} claims that disagree across ${new Set(findings.flatMap(f => f.files)).size} files ([CTR](../CONTINUITY_RULES.md)). Ranked by what the player meets first: names, travel, prices, calendar, people. A fix changes the owning content row only; saved observations keep their wording (UR74). Findings from private packs show file and entity id only (sealed shape). Regenerate after each pass; the baseline ratchet keeps new disagreements out.`, '',
    '## Counts', '', '| Code | Meaning | Findings |', '| --- | --- | --- |',
    ...Object.entries(CODES).map(([k, v]) => `| ${k} | ${v} | ${counts[k] || 0} |`), '',
    privateSeen ? '' : '_Private packs were absent when this was generated; their findings are not listed._', ''];
  let code = '';
  for (const f of sorted) {
    if (f.code !== code) { code = f.code; out.push(`## ${code}: ${CODES[code]}`, ''); }
    if (f.sealed || isPrivate(f)) out.push(`- \`${f.ref}\` ${f.world}: ${f.files.join(', ')} (values withheld; \`--show ${f.ref}\` prints them locally)`);
    else out.push(`- ${f.world}: ${f.why}`);
  }
  mkdirSync(dirname(backlogPath), {recursive: true});
  writeFileSync(backlogPath, out.join('\n') + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = new Set(process.argv.slice(2));
  const t0 = Date.now();
  const {findings, privateSeen} = scanTree({withPrivate: !args.has('--no-private')});
  const baseline = readBaseline();
  const showAt = process.argv.indexOf('--show');
  if (showAt > 0) { const f = findings.find(x => x.ref === process.argv[showAt + 1]); console.log(f ? `[${f.code}] ${f.world} ${f.entity}\n${f.why}\n${f.where.join('\n')}` : 'no such ref'); process.exit(0); }
  if (!privateSeen) console.log('continuity: private packs absent or skipped; only src claims checked');
  if (args.has('--update-baseline')) {
    const next = {version: 1, note: 'Known continuity findings (ratchet). Private-pack entries carry a hash, files and a ref only.', findings: {}};
    const keep = privateSeen ? {} : Object.fromEntries(Object.entries(baseline.findings).filter(([, v]) => v.private));
    for (const f of findings) next.findings[f.key] = isPrivate(f) ? {code: f.code, world: f.world, files: f.files, ref: f.ref, private: true} : {code: f.code, world: f.world, entity: f.entity, files: f.files};
    Object.assign(next.findings, keep);
    writeFileSync(baselinePath, JSON.stringify(next, null, 1) + '\n');
    console.log(`continuity: baseline updated, ${Object.keys(next.findings).length} entries`);
  } else {
    const fresh = findings.filter(f => !(f.key in baseline.findings));
    if (args.has('--backlog')) { writeBacklog(findings, privateSeen); console.log(`continuity: backlog written (${findings.length} findings)`); }
    if (fresh.length) {
      console.error(`continuity: ${fresh.length} new finding(s) not in the baseline:`);
      for (const f of fresh.slice(0, 40)) console.error(`  [${f.code}] ${f.sealed || isPrivate(f) ? `ref ${f.ref} ${f.world} in ${f.files.join(', ')} (${CODES[f.code]}; values withheld, run --show ${f.ref})` : f.why}`);
      process.exitCode = 1;
    } else console.log(`continuity: ok, ${findings.length} known findings, ${Date.now() - t0} ms`);
  }
}
