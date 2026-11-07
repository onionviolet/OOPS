#!/usr/bin/env node
// Names and world vocabulary lint (NMR1-NMR8, docs/NAMING_RULES.md). Extracts name-like
// fields (name, plus title/label in people and place files) from src/**/*.js, attributes each
// to a world, and flags:
//   GEN  generic filler as the only name ("Old man", "Iron sword", "Town")
//   DUP  one name on two different entities of the same world
//   XW   one person or place name used in more than one world
//   VAR  spelling variants of what looks like one name (punctuation, plural, edit distance 1-2)
//   REG  a modern or other-register word inside an original world's name
// Canon names from source books are correct by definition: book worlds skip REG.
//
// Ratchet: scripts/names_baseline.json lists today's finding keys. Known keys pass, a new
// one fails, a fixed one is reported as stale. Keys carry no line numbers, so edits elsewhere
// in a file do not disturb them.
//
//   node scripts/check_names.mjs                  check (exit 1 on new findings)
//   node scripts/check_names.mjs --update-baseline
//   node scripts/check_names.mjs --backlog        write docs/names/NAMES_BACKLOG.md
//   node scripts/check_names.mjs --sheets         write docs/names/WORLD_NAMING_SHEETS.md
//
// Allow one line with a trailing comment: // names: allow <why>
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = resolve(root, 'scripts/names_baseline.json');
const backlogPath = resolve(root, 'docs/names/NAMES_BACKLOG.md');
const sheetsPath = resolve(root, 'docs/names/WORLD_NAMING_SHEETS.md');
const argv = new Set(process.argv.slice(2));

// ---- worlds -------------------------------------------------------------------------------
// `canon`: names come from a source book, so REG is skipped. `opening`: weight in the backlog
// (what the player meets first). `modern`: modern words are in register there.
export const WORLDS = {
  frontier: {label: 'Frontier (base game, Village and wilds)', canon: false, opening: 10, modern: false,
    register: 'Plain English fantasy frontier. Places and people named for what they are or who runs them. Lower-case role names are the upstream convention (village elder, old craftsman).',
    currency: 'coins (wooden coins, copper, silver, gold in the upstream ladder)'},
  village: {label: 'Village life (original)', canon: false, opening: 10, modern: false,
    register: 'Small-village English, the same plain register as the Frontier. A person is a first name plus a trade or kin tie.',
    currency: 'coins, as the Frontier'},
  original_frontier: {label: 'Original Frontier campaign', canon: false, opening: 9, modern: false,
    register: 'Frontier English with short given names (Nea, Iver). One-syllable or two-syllable names, no titles.',
    currency: 'coins, as the Frontier'},
  proto23: {label: 'Proto23 village (reference)', canon: false, opening: 5, modern: false,
    register: 'A worked-out village reference; plain English, visitor point of view.', currency: 'coins'},
  mistglass: {label: 'Mistglass (original)', canon: false, opening: 5, modern: false,
    register: 'Original world; glass, mist and seed imagery. Invented names with an English noun feel.', currency: 'not yet settled'},
  lotm: {label: 'Tingen and Lord of the Mysteries', canon: true, opening: 9, modern: false,
    register: 'Victorian-industrial Loen: Mr/Mrs titles, surnames, Church and Nighthawk vocabulary, gaslight, cabs, parishes.',
    currency: 'pound, soli, penny/pence (halfpenny); 1 pound = 20 soli = 240 pence'},
  hp: {label: 'Hogwarts-era wizarding Britain', canon: true, opening: 6, modern: true,
    register: 'British, mundane first names beside coined magical words (Hogsmeade, Floo). Modern objects are normal.',
    currency: 'galleon, sickle, knut'},
  mol: {label: 'Mother of Learning (Cyoria)', canon: true, opening: 6, modern: false,
    register: 'Zorian-style invented continental names; academy and city-district nouns.', currency: 'crowns, silver, gold (per the book)'},
  paradise: {label: 'Paradise hub and Goa', canon: true, opening: 5, modern: false,
    register: 'Hub-and-lab register: station names, ecology and salt-works vocabulary.', currency: 'per-world; see sheet'},
  gu: {label: 'Gu worlds (Reverend Insanity)', canon: true, opening: 5, modern: false,
    register: 'Xianxia: Gu, aperture, primeval essence, clan and mountain names.',
    currency: 'primeval stones'},
  primordial: {label: 'Primordial worlds', canon: true, opening: 4, modern: false,
    register: 'Xianxia-adjacent credit and domain vocabulary.', currency: 'credit'},
  shadow_slave: {label: 'Shadow Slave', canon: true, opening: 5, modern: true,
    register: 'Awakened, Nightmare Spell, Memory, Echo, Shadow: capitalised proper nouns for powers, plain given names for people.',
    currency: 'fragments (soul shards and memories as trade goods)'},
  shadow_company: {label: 'Shadow Company', canon: true, opening: 4, modern: false,
    register: 'Soldier-company names, nicknames and ranks.', currency: 'per the book'},
  dnd: {label: 'Phandalin (D&D, example pack)', canon: true, opening: 3, modern: false,
    register: 'D&D 5e SRD fantasy.', currency: 'gp, sp, cp'},
  steam: {label: 'Steam game absorptions', canon: true, opening: 2, modern: true,
    register: 'Each absorbed game keeps its own nouns.', currency: 'per game'},
  factorio: {label: 'Factorio retort', canon: true, opening: 2, modern: true,
    register: 'Industrial and engineering nouns.', currency: 'items, no coin'},
  nethack: {label: 'NetHack fieldcraft', canon: true, opening: 2, modern: false,
    register: 'Dungeon-crawler item and monster names.', currency: 'zorkmids'},
  book_misc: {label: 'Other book worlds (Worm, Labyrinth, Legendary Mechanic, Omniscient Reader, and kin)', canon: true, opening: 3, modern: true,
    register: 'Canon names from each source.', currency: 'per book'},
  shared: {label: 'Shared systems (no single world)', canon: false, opening: 7, modern: false,
    register: 'Systems text: a name here should work in every world or be keyed to its world.', currency: 'n/a'},
};

// path regex -> world key, first match wins.
const WORLD_BY_PATH = [
  [/book_world_lotm|\/lotm_|lotm_|tingen|spell_adapter_lotm|world_packs\/lotm|ui\/lotm/, 'lotm'],
  [/book_world_hp|\/hp_|\bhp_|book_hp|spell_adapter_hp|hp_charm/, 'hp'],
  [/book_world_mol|book_mol|mol_zorian/, 'mol'],
  [/book_world_paradise/, 'paradise'],
  [/book_world_primordial/, 'primordial'],
  [/book_world_gu|book_gu|gu_house/, 'gu'],
  [/book_world_shadow_company|book_shadow_company/, 'shadow_company'],
  [/book_shadow_slave|ascension_paths_ss/, 'shadow_slave'],
  [/dnd_phandalin/, 'dnd'],
  [/mistglass/, 'mistglass'],
  [/proto23/, 'proto23'],
  [/steam_/, 'steam'],
  [/factorio_retort/, 'factorio'],
  [/nethack_fieldcraft/, 'nethack'],
  [/feature_expansion_book|book_world_player_agency|canon_pull/, 'book_misc'],
  [/original_frontier/, 'original_frontier'],
  [/village_/, 'village'],
  [/frontier|fork_fort|src\/data\/|src\/items\.js|src\/enemies\.js|src\/races\.js|src\/titles\.js|src\/activities\.js|src\/crafting_recipes\.js|src\/faction_rank\.js|src\/home_content\.js/, 'frontier'],
];
export const worldOf = path => { for (const [re, w] of WORLD_BY_PATH) if (re.test(path)) return w; return 'shared'; };

// ---- kinds --------------------------------------------------------------------------------
const PERSON_FILE = /npcs\.js|people|cast|persona|family|household|crush|companion|contacts|roster|character_sheet|npc_lives|home_staff|hired_hands|generated_people|traders|lead_line|lead_life|keeper_domain/;
const PLACE_FILE = /locations\.js|district|cities|city|places?\b|site|habitat|region|zone|building|pocket_location|drainage|mill|map\b/;
const ITEM_FILE = /items\.js|recipes?|craft|gear|equipment|material|ingredient|product|loot|inventory|kit\b|artifact|formula|potion|price_map|expedition_items|alloy/;
function kindOf(path, field) {
  if (/enemies\.js|creature|opponent/.test(path)) return 'creature';
  if (/titles\.js/.test(path)) return 'title';
  if (PERSON_FILE.test(path)) return 'person';
  if (PLACE_FILE.test(path)) return 'place';
  if (ITEM_FILE.test(path)) return 'item';
  return field === 'name' ? 'thing' : null;
}

// ---- extraction ---------------------------------------------------------------------------
const fieldRe = /(?:^|[\s,{(\[])['"]?(name|title|label|displayName|npcName|placeName|locationName)['"]?\s*:\s*(["'`])((?:\\.|(?!\2)[^\\\n])*)\2/g;
const idRe = /\bid\s*:\s*(["'])([^"'\n]+)\1/;
const MIN = 2, MAX = 48;

export function scanSource(path, source) {
  const out = [];
  const lines = source.split('\n');
  const starts = [0];
  for (let i = 0; i < source.length; i++) if (source[i] === '\n') starts.push(i + 1);
  const lineOf = idx => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= idx) lo = mid; else hi = mid - 1; } return lo; };
  const world = worldOf(path);
  for (const m of source.matchAll(fieldRe)) {
    const field = m[1], name = m[3].trim();
    if (name.length < MIN || name.length > MAX || name.includes('${') || /[:?!]$/.test(name) || name.split(/\s+/).length > 6) continue;
    const kind = kindOf(path, field);
    if (!kind) continue;
    if (field !== 'name' && !(kind === 'person' || kind === 'place')) continue;
    const ln = lineOf(m.index);
    if (/names:\s*allow/.test(lines[ln])) continue;
    let id = '';
    for (const k of [ln, ln - 1, ln + 1]) { const im = lines[k]?.match(idRe); if (im) { id = im[2]; break; } }
    // Action-like labels and sentences are not names.
    if (field !== 'name' && (/^(talk|ask|go|travel|take|buy|sell|open|read|use|visit|return|wait|rest|work|start|find|move|check|see|view|show|look|listen|help|pay|sleep|eat|drink|train|study)\b/i.test(name) || /[.,;]/.test(name))) continue;
    if (kind === 'place' && /^[a-z]+$/.test(name) && name.length < 12 && path.endsWith('locations.js')) continue; // location modifiers (bright, narrow)
    out.push({file: path, line: ln + 1, field, kind, world, name, id, weak: field !== 'name'});
  }
  return out;
}

function walk(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = resolve(dir, f), s = statSync(p);
    if (s.isDirectory()) walk(p, acc); else if (f.endsWith('.js')) acc.push(p);
  }
  return acc;
}
export function scanTree() {
  const out = [];
  for (const p of walk(resolve(root, 'src')).sort()) {
    const rel = p.slice(root.length + 1);
    if (/\/(srd521|pf1)\/|\/fixtures\/|\/preview\//.test(rel)) continue; // vendored rules data and UI fixtures, not content
    out.push(...scanSource(rel, readFileSync(p, 'utf8')));
  }
  return out;
}

// ---- analysis -----------------------------------------------------------------------------
const norm = s => s.toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const stem = s => norm(s).replace(/\b(\w{3,})s\b/g, '$1');
function lev(a, b, cap) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let rowMin = i;
    for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); rowMin = Math.min(rowMin, cur[j]); }
    if (rowMin > cap) return cap + 1;
    prev = cur;
  }
  return prev[b.length];
}

const PERSON_ROLE_WORDS = new Set(('old young village town gate city suspicious unknown strange man woman boy girl guard merchant trader elder craftsman farmer miller millers cook tailor tanner scout chief supervisor ' +
  'proprietress stranger traveler traveller shopkeeper innkeeper priest soldier villager beggar child hunter fisherman healer blacksmith smith clerk worker local neighbour neighbor ' +
  'swampland nekomimi slums of the a an lady lord sir madam mister guide teacher student servant maid butler thief bandit knight peasant noble official officer captain sergeant ' +
  'doctor nurse sailor farmhand herbalist carpenter baker butcher brewer bartender waiter vendor seller buyer clerk').split(' '));
const ITEM_GENERIC = /^(?:(?:wooden|iron|steel|bronze|copper|stone|old|rusty|simple|basic|plain|small|large|common|cheap|broken|good|fine|leather|cloth|magic|magical|strong|sharp|new)\s+)?(?:sword|dagger|shield|armor|armour|helmet|axe|bow|staff|potion|ring|amulet|boots|gloves|hat|robe|spear|club|knife|book|scroll|gem|bag|box)s?$/i;
const PLACE_GENERIC = /^(?:the\s+)?(?:town|village|city|forest|cave|house|shop|store|inn|market|road|field|farm|castle|room|street|tavern|temple|church|home|place|building|area|hall|yard|garden|river|lake|mountain|hill)$/i;

// Words out of register for an original world's names.
const MODERN = /\b(supermarket|laptop|smartphone|phone|computer|internet|wifi|email|app|robot|plastic|cafe|café|pizza|burger|selfie|gps|bluetooth|usb|startup|startups|hashtag|okay|ok|bro|dude|cyber|neon|nano|pixel|download|upload|login|online|offline|boss level)\b/i;
const OTHER_REGISTER = {
  xianxia: /\b(sect|dao|qi|jade emperor|spirit stone|immortal|cultivator|ascendant|heavenly)\b/i,
  victorian: /\b(nighthawk|nighthawks|gaslight|constable|soli|pence|parish|hansom)\b/i,
};
const ORIGINAL_KEYS = Object.entries(WORLDS).filter(([, w]) => !w.canon).map(([k]) => k);

// VAR false positives (NMR5 dial): pairs that differ by something other than spelling.
const OPPOSITES = new Set('man woman boy girl he she east west north south upper lower inner outer mr mrs miss ms sir lady lord king queen old new young first second third saint st'.split(' '));
const tokens = s => norm(s).split(' ').filter(Boolean);
export function distinctPair(x, y, kind) {
  const ta = tokens(x), tb = tokens(y);
  // different street or house numbers are a series, not a misspelling
  const na = ta.filter(w => /^\d+$/.test(w)).join(), nb = tb.filter(w => /^\d+$/.test(w)).join();
  if (na && nb && na !== nb) return true;
  // a plural last word names a group, the singular a member (General / Generals)
  const la = ta[ta.length - 1], lb = tb[tb.length - 1];
  if (ta.length === tb.length && la !== lb && (la + 's' === lb || lb + 's' === la) && ta.slice(0, -1).join(' ') === tb.slice(0, -1).join(' ')) return true;
  if (la !== lb && (/^[ivx]+$/.test(la) || /^[ivx]+$/.test(lb)) && (ta.length >= 2 && tb.length >= 2)) return true; // William Augustus I / VI: a numbered line
  if (ta.length === tb.length) {
    const diff = ta.map((w, i) => [w, tb[i]]).filter(([p, q]) => p !== q);
    // direction, title or rank words that differ: two things (East Bailang / West Bailang, Mr / Mrs Thomas)
    if (diff.some(([p, q]) => OPPOSITES.has(p) && OPPOSITES.has(q))) return true;
    // one differing person token with a different first letter (Arianna / Orianna): two people, since a
    // transliteration variant keeps its first letter (Lo / Luo, Dawn / Daonn)
    if (kind === 'person' && diff.length === 1 && diff[0][0][0] !== diff[0][1][0] && Math.min(diff[0][0].length, diff[0][1].length) >= 4) return true;
  }
  return false;
}
export function analyze(entries, opts = {}) {
  const findings = [];
  const add = (code, e, detail, keyPart) => findings.push({code, world: e.world, kind: e.kind, name: e.name, file: e.file, line: e.line, detail, key: `${code}:${e.world}:${keyPart}`});
  const seen = new Set();
  const uniq = entries.filter(e => { const k = `${e.world}|${e.kind}|${e.name}|${e.id}|${e.file}`; if (seen.has(k)) return false; seen.add(k); return true; });

  // GEN, REG
  for (const e of uniq) {
    const n = norm(e.name);
    if (e.weak) { /* label/title: too loose for GEN */ }
    else if (opts.allowCanonGeneric && WORLDS[e.world]?.canon && /^private_packs\//.test(e.file)) { /* NMR1 dial: a book names some minor figures and places by role or type; the source's own naming stands */ }
    else if (e.kind === 'person') {
      const words = n.split(' ').filter(Boolean);
      if (words.length && words.every(w => PERSON_ROLE_WORDS.has(w))) add('GEN', e, `a person named only by role: "${e.name}"`, `person:${n}`);
    } else if (e.kind === 'item' && ITEM_GENERIC.test(n)) add('GEN', e, `an item named only by its type: "${e.name}"`, `item:${n}`);
    else if (e.kind === 'place' && PLACE_GENERIC.test(n)) add('GEN', e, `a place named only by its type: "${e.name}"`, `place:${n}`);
    if (ORIGINAL_KEYS.includes(e.world) && ['person', 'place', 'item', 'thing'].includes(e.kind)) {
      if (MODERN.test(e.name) && !WORLDS[e.world].modern) add('REG', e, `modern word in an original world's name: "${e.name}"`, `${e.kind}:${n}:modern`);
      for (const [reg, re] of Object.entries(OTHER_REGISTER)) if (re.test(e.name) && e.world !== 'shared') add('REG', e, `${reg} word in ${e.world}: "${e.name}"`, `${e.kind}:${n}:${reg}`);
    }
  }

  // DUP: same world, same kind, same name, two ids
  const byKey = new Map();
  for (const e of uniq) {
    if (!['person', 'place', 'item'].includes(e.kind) || !e.id || e.weak) continue;
    const k = `${e.world}|${e.kind}|${norm(e.name)}`;
    (byKey.get(k) || byKey.set(k, []).get(k)).push(e);
  }
  for (const [k, list] of byKey) {
    const ids = new Set(list.map(e => e.id));
    if (ids.size > 1) add('DUP', list[0], `"${list[0].name}" names ${ids.size} entities: ${[...ids].slice(0, 4).join(', ')}`, `${list[0].kind}:${norm(list[0].name)}`);
  }

  // XW: person or place names that appear in two or more worlds (shared is not a world here)
  const byName = new Map();
  for (const e of uniq) {
    if (!['person', 'place', 'item'].includes(e.kind) || e.world === 'shared' || e.weak) continue;
    const n = norm(e.name);
    if (n.length < 4) continue;
    (byName.get(`${e.kind}|${n}`) || byName.set(`${e.kind}|${n}`, []).get(`${e.kind}|${n}`)).push(e);
  }
  for (const [k, list] of byName) {
    const ws = [...new Set(list.map(e => e.world))].sort();
    if (ws.length > 1) add('XW', list[0], `"${list[0].name}" used in ${ws.join(', ')}`, `${k}:${ws.join('+')}`);
  }

  // VAR: variants inside one world and kind
  const buckets = new Map();
  for (const e of uniq) {
    if (!['person', 'place', 'creature', 'item'].includes(e.kind) || e.weak) continue;
    const k = `${e.world}|${e.kind}`;
    (buckets.get(k) || buckets.set(k, new Map()).get(k)).set(e.name, e);
  }
  for (const [, names] of buckets) {
    const list = [...names.values()];
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      if (a.name === b.name) continue;
      const sa = stem(a.name), sb = stem(b.name);
      if (!sa || !sb) continue;
      if (/\d|\b[ivx]+\b/.test(sa + sb) && sa.replace(/[\d ivx]/g, '') === sb.replace(/[\d ivx]/g, '') && sa !== sb) continue; // numbered series
      if (distinctPair(a.name, b.name, a.kind)) continue;
      let d;
      if (sa === sb) d = a.name.toLowerCase() === b.name.toLowerCase() ? -1 : 0; // case only: -1 (ignored), punctuation or plural: 0
      else d = lev(sa, sb, 2);
      if (d === -1) continue;
      const cap = a.kind === 'item' || a.kind === 'creature' ? 0 : Math.min(sa.length, sb.length) >= 12 ? 2 : Math.min(sa.length, sb.length) >= 7 ? 1 : 0;
      if (d > cap) continue;
      const [x, y] = [a.name, b.name].sort();
      add('VAR', a, `"${x}" and "${y}" look like one name spelled two ways`, `${a.kind}:${norm(x)}|${norm(y)}`);
      findings[findings.length - 1].names = [x, y];
    }
  }
  const dedup = new Map();
  for (const f of findings) if (!dedup.has(f.key)) dedup.set(f.key, f);
  return [...dedup.values()];
}

// ---- baseline, backlog, sheets --------------------------------------------------------------
const loadBaseline = () => existsSync(baselinePath) ? new Set(JSON.parse(readFileSync(baselinePath, 'utf8')).keys) : new Set();
export function checkTree(findings = analyze(scanTree())) {
  const base = loadBaseline();
  const fresh = findings.filter(f => !base.has(f.key));
  const live = new Set(findings.map(f => f.key));
  return {findings, fresh, stale: [...base].filter(k => !live.has(k))};
}

const CODE_WEIGHT = {DUP: 5, XW: 4, REG: 4, VAR: 3, GEN: 3};
const KIND_WEIGHT = {person: 5, place: 4, item: 2, creature: 2, title: 1, thing: 1};
const FIRST_HOUR = /first_hour|fresh_life_start|village_|data\/npcs|data\/locations|data\/traders|frontier_|original_frontier|foundation_start|character_creation/;
const score = f => (WORLDS[f.world]?.opening ?? 1) * 10 + (FIRST_HOUR.test(f.file) ? 25 : 0) + CODE_WEIGHT[f.code] * 3 + (KIND_WEIGHT[f.kind] ?? 1);

function writeBacklog(findings) {
  const ranked = [...findings].sort((a, b) => score(b) - score(a) || a.key.localeCompare(b.key));
  const byCode = {}; for (const f of findings) byCode[f.code] = (byCode[f.code] || 0) + 1;
  const byWorld = {}; for (const f of findings) byWorld[f.world] = (byWorld[f.world] || 0) + 1;
  const out = ['# Names backlog', '',
    'Generated by `node scripts/check_names.mjs --backlog`. Do not edit by hand. Rules: [NAMING_RULES](../NAMING_RULES.md), sheets: [WORLD_NAMING_SHEETS](WORLD_NAMING_SHEETS.md).', '',
    `Findings in the current tree: ${findings.length}. By code: ${Object.entries(byCode).map(([k, v]) => `${k} ${v}`).join(', ')}.`, '',
    'Ranked by what the player meets first: opening worlds and first-hour files, then person and place names, then items. Canon names are correct; a finding on one is a collision or a spelling split, not a wrong name.', '',
    '## By world', '', '| World | Findings |', '|---|---|',
    ...Object.entries(byWorld).sort((a, b) => b[1] - a[1]).map(([w, n]) => `| ${WORLDS[w]?.label ?? w} | ${n} |`), '',
    '## Top 60', '', '| # | Code | World | Kind | Finding | Where |', '|---|---|---|---|---|---|',
    ...ranked.slice(0, 60).map((f, i) => `| ${i + 1} | ${f.code} | ${f.world} | ${f.kind} | ${f.detail.replace(/\|/g, '/')} | ${f.file}:${f.line} |`), '',
    '## Rest, grouped by file', ''];
  const byFile = new Map();
  for (const f of ranked.slice(60)) (byFile.get(f.file) || byFile.set(f.file, []).get(f.file)).push(f);
  for (const [file, list] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
    out.push(`### ${file} (${list.length})`, '');
    for (const f of list.slice(0, 15)) out.push(`- ${f.code} line ${f.line}: ${f.detail}`);
    if (list.length > 15) out.push(`- and ${list.length - 15} more`);
    out.push('');
  }
  mkdirSync(dirname(backlogPath), {recursive: true});
  writeFileSync(backlogPath, out.join('\n'));
}

const CURRENCY_WORDS = ['pence', 'penny', 'soli', 'pound', 'galleon', 'knut', 'coin', 'primeval stone', 'spirit stone', 'zorkmid'];
function writeSheets(entries, files) {
  const out = ['# World naming sheets', '',
    'Generated by `node scripts/check_names.mjs --sheets`. Register and currency lines are the script\'s curated table; sample names, counts and currency-word counts are measured from `src/`. Rules: [NAMING_RULES](../NAMING_RULES.md).', ''];
  for (const [key, w] of Object.entries(WORLDS)) {
    const es = entries.filter(e => e.world === key);
    const pick = kind => [...new Set(es.filter(e => e.kind === kind).map(e => e.name))].sort().slice(0, 10);
    const counts = {}; for (const e of es) counts[e.kind] = (counts[e.kind] || 0) + 1;
    out.push(`## ${w.label} (\`${key}\`)`, '',
      `- Register: ${w.register}`,
      `- Canon names: ${w.canon ? 'yes, source names are correct by definition (NMR6)' : 'no, original names; the checks apply in full'}`,
      `- Currency and units: ${w.currency}`,
      `- Names found: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
    for (const kind of ['person', 'place', 'item']) { const p = pick(kind); if (p.length) out.push(`- Sample ${kind} names: ${p.join('; ')}`); }
    const text = (files[key] || '').toLowerCase();
    const cw = CURRENCY_WORDS.map(c => [c, text.split(c).length - 1]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (cw.length) out.push(`- Currency words in this world's source files (count): ${cw.map(([c, n]) => `${c} ${n}`).join(', ')}`);
    out.push(`- Banned as a sole name: role words for people (${[...PERSON_ROLE_WORDS].slice(0, 12).join(', ')} ...), bare type words for items (sword, potion, book ...) and places (town, forest, cave ...). A role may follow a name ("Mara the miller"), never stand in for it.`, '');
  }
  mkdirSync(dirname(sheetsPath), {recursive: true});
  writeFileSync(sheetsPath, out.join('\n'));
}

function filesByWorld() {
  const m = {};
  for (const p of walk(resolve(root, 'src'))) { const rel = p.slice(root.length + 1); if (/\/(srd521|pf1)\//.test(rel)) continue; const w = worldOf(rel); m[w] = (m[w] || '') + readFileSync(p, 'utf8'); }
  return m;
}

// ---- private packs (local only) -------------------------------------------------------------
// private_packs/*/cast.json holds the book casts (git-ignored). `--private` scans their people,
// places and items so canon-world names get the same checks. Findings and baseline stay out of
// the repo: private/names_baseline_private.json and private/names_private_report.md.
const PRIVATE_DIR = resolve(root, 'private_packs');
const privateBaselinePath = resolve(root, 'private/names_baseline_private.json');
const PRIVATE_WORLD = {'lotm-cast': 'lotm', 'mol-cast': 'mol', 'hp-cast': 'hp', 'hp-lead': 'hp'};
export function scanPrivate() {
  const out = [];
  if (!existsSync(PRIVATE_DIR)) return out;
  for (const [dir, world] of Object.entries(PRIVATE_WORLD)) {
    for (const f of ['cast.json', 'cast-built.json']) {
      const p = resolve(PRIVATE_DIR, dir, f);
      if (!existsSync(p)) continue;
      let d; try { d = JSON.parse(readFileSync(p, 'utf8')); } catch { continue; }
      // Rows judged one entity (pack idMap plus the checker-only continuity-links.json) count once for DUP.
      const links = {...(d.idMap || {})};
      const lp = resolve(PRIVATE_DIR, dir, 'continuity-links.json');
      if (existsSync(lp)) { try { Object.assign(links, JSON.parse(readFileSync(lp, 'utf8')).idMap || {}); } catch {} }
      const canon = id => { let c = id, n = 0; while (links[c] && n++ < 8) c = String(links[c]).split(' ')[0]; return c; };
      for (const [arr, kind] of [['people', 'person'], ['places', 'place'], ['locations', 'place'], ['items', 'item']]) {
        for (const x of Array.isArray(d[arr]) ? d[arr] : []) {
          const name = typeof x.name === 'string' && x.name.length > 1 && x.name !== 'S' ? x.name.trim() : (typeof x.label === 'string' && x.label.length > 2 ? x.label.trim() : '');
          if (!name || name.length > MAX || /[.;]/.test(name)) continue;
          out.push({file: `private_packs/${dir}/${f}`, line: 0, field: 'name', kind, world, name, id: x.id ? canon(x.id) : (x.indexId || ''), weak: false, tier: x.tier || ''});
        }
      }
    }
  }
  return out;
}

// Decided spellings (private/naming/<world>_spellings.json: {spellings: {canonical: [variants]}}). A VAR
// finding whose two names sit in one decided entry is settled and does not report.
export function loadSpellings(dir = resolve(root, 'private/naming')) {
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const m = f.match(/^(.+)_spellings\.json$/); if (!m) continue;
    try { out[m[1]] = JSON.parse(readFileSync(resolve(dir, f), 'utf8')).spellings || {}; } catch {}
  }
  return out;
}
// Decided distinct (same file): {distinct: [{names: [a, b], why}], distinctDup: [{kind, name, why}]}. A VAR pair listed
// in `distinct` is two entities (or one entity with two deliberate names) and does not report; a DUP name listed in
// `distinctDup` is a shared name on different entities (a title beside its holder, role-only names) and does not report.
export function loadDistinct(dir = resolve(root, 'private/naming')) {
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const m = f.match(/^(.+)_spellings\.json$/); if (!m) continue;
    try { const j = JSON.parse(readFileSync(resolve(dir, f), 'utf8')); out[m[1]] = {pairs: j.distinct || [], dups: j.distinctDup || []}; } catch {}
  }
  return out;
}
export function applySpellings(findings, spellings, distinct = {}) {
  return findings.filter(f => {
    if (f.code === 'VAR' && f.names) {
      const entries = Object.entries(spellings[f.world] || {});
      if (entries.some(([c, vs]) => { const set = new Set([c, ...vs]); return f.names.every(n => set.has(n)); })) return false;
      if ((distinct[f.world]?.pairs || []).some(p => f.names.every(n => p.names.includes(n)))) return false;
    }
    if (f.code === 'DUP' && (distinct[f.world]?.dups || []).some(p => p.kind === f.kind && p.name.toLowerCase() === String(f.name).toLowerCase())) return false;
    return true;
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = Date.now();
  const entries = scanTree();
  const findings = analyze(entries);
  if (argv.has('--update-baseline')) {
    writeFileSync(baselinePath, JSON.stringify({generated: new Date().toISOString().slice(0, 10), keys: findings.map(f => f.key).sort()}, null, 1) + '\n');
    console.log(`names: baseline updated, ${findings.length} entries`);
  }
  if (argv.has('--backlog')) { writeBacklog(findings); console.log(`names: wrote ${backlogPath}`); }
  if (argv.has('--sheets')) { writeSheets(entries, filesByWorld()); console.log(`names: wrote ${sheetsPath}`); }
  if (argv.has('--private')) {
    const pe = scanPrivate(), pf = applySpellings(analyze([...entries.filter(e => e.world !== 'shared' && ['lotm', 'mol', 'hp'].includes(e.world)), ...pe], {allowCanonGeneric: true}), loadSpellings(), loadDistinct()).filter(f => /^private_packs/.test(f.file) || ['DUP', 'XW', 'VAR'].includes(f.code));
    const pbase = existsSync(privateBaselinePath) ? new Set(JSON.parse(readFileSync(privateBaselinePath, 'utf8')).keys) : new Set();
    if (argv.has('--update-baseline')) { mkdirSync(dirname(privateBaselinePath), {recursive: true}); writeFileSync(privateBaselinePath, JSON.stringify({keys: pf.map(f => f.key).sort()}, null, 1) + '\n'); }
    const pfresh = pf.filter(f => !pbase.has(f.key));
    const pc = {}; for (const f of pf) pc[f.code] = (pc[f.code] || 0) + 1;
    console.log(`names (private): ${pe.length} cast names, ${pf.length} findings (${Object.entries(pc).map(([k, v]) => `${k} ${v}`).join(', ')}), ${pfresh.length} not in the private baseline`);
    if (argv.has('--backlog')) {
      mkdirSync(dirname(privateBaselinePath), {recursive: true});
      writeFileSync(resolve(root, 'private/names_private_report.md'), ['# Private cast names report (local, git-ignored)', '', ...pf.sort((a, b) => score(b) - score(a)).map(f => `- ${f.code} ${f.world} ${f.kind}: ${f.detail} (${f.file})`)].join('\n') + '\n');
    }
    if (pfresh.length && !argv.has('--update-baseline')) { for (const f of pfresh.slice(0, 20)) console.log(`  ${f.code} ${f.detail}`); process.exitCode = 1; }
  }
  const {fresh, stale} = checkTree(findings);
  const byCode = {}; for (const f of findings) byCode[f.code] = (byCode[f.code] || 0) + 1;
  console.log(`names: ${entries.length} names, ${findings.length} findings (${Object.entries(byCode).map(([k, v]) => `${k} ${v}`).join(', ')}), ${fresh.length} new, ${stale.length} stale, ${Date.now() - t0}ms`);
  if (stale.length) console.log(`names: ${stale.length} baseline entries no longer match; run --update-baseline to retire them.`);
  if (fresh.length) {
    for (const f of fresh.slice(0, 30)) console.log(`  ${f.code} ${f.file}:${f.line} ${f.detail}`);
    console.log('names: fix the name (docs/NAMING_RULES.md) or add `// names: allow <why>`.');
    process.exit(1);
  }
}
