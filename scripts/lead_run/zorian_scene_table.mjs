#!/usr/bin/env node
// Zorian S0/S1 scene table generator (proposal tooling, AD32). Deterministic over the merged lead-run
// reading (gitignored, in the main checkout) and the committed MoL pack. Rewrites only the blocks
// between `<!-- BEGIN generated:NAME -->` and `<!-- END generated:NAME -->` in the target doc; prose stays.
//
//   node scripts/lead_run/zorian_scene_table.mjs [--scenes PATH] [--doc PATH] [--json OUT]
//
// Sealed scenes (row.sealed non-empty) are emitted by beat id and counts only: no place, verb text,
// option text, people or command ids. Mapping rules below are hand-written judgments over verb text,
// class and place; they are labelled "rule" in the doc, not verified in the game.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SCENES = arg('--scenes', '/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/mother-of-learning/private/wb8-merged-2026-10-30/scenes.jsonl');
const DOC = arg('--doc', path.join(root, 'docs/worlds/mother-of-learning/ZORIAN_S0_S1_SCENE_TABLE_2026-11-03.md'));
const JSON_OUT = arg('--json', '');

const pack = (await import(path.join(root, 'src/world_packs/book_mol_pack.js'))).default;
const commandIds = new Set(pack.native.definitions.commands.map((c) => c.id));

// ---- verb -> pack command rules. fit: match (same mechanism), near (same family, different content). ----
// cat is the gap category used by the roll-up when cmd is null.
const R = (re, cmd, fit, cat, cls) => ({ re, cmd, fit, cat, cls });
const RULES = [
  R(/\bbuy\b.*\b(paper|pens|envelopes)\b/, 'book.mol.paper', 'match', 'shop', null),
  R(/\bbuy\b.*\b(bread|bakery|bite)\b|\bquick bite\b/, 'book.mol.bread', 'match', 'shop', null),
  R(/sleeping potion|fireworks|lazing|wake|nightmare|breathe|shaking|bathroom|sleep through/, null, null, 'rest-wake', null),
  R(/\btrains?\b|platform|korsa|station|\bexit\b/, null, null, 'travel', null),
  R(/teleport/, null, null, 'teleport', null),
  R(/\b(eat|lunch|porridge|meal|breakfast)\b|follow zach out for a meal/, 'book.mol.meal', 'near', 'meal', null),
  R(/shelve|classification scheme|library assistant|check spell restrictions/, 'book.mol.catalog_shift', 'near', 'library-work', null),
  R(/ibery|kirithishli|librarian|information desk|book divinations|coded slip/, 'book.mol.library_meet', 'near', 'library-people', null),
  R(/zenomir|translation|language expert|chant/, null, null, 'language-expert', null),
  R(/time-travel (texts|mentions)|sift library|library texts|public sources|check out the books|neolu's list|restricted library/, 'book.mol.temporal_study', 'near', 'library-study', null),
  R(/time travel|time-travel|resets|loop|restart/, 'book.mol.temporal_study', 'near', 'loop-reasoning', ['study', 'research']),
  R(/plan goals in notebook/, 'book.mol.ongoing_research', 'near', 'notebook', null),
  R(/letters|postal|leftover paper|wait for any reaction/, null, null, 'letters-post', null),
  R(/cube|compressed|lamp cube|formula theory|spell formulas|spell formula\b.*(study|discuss)/, 'book.mol.study_formula', 'near', 'formula-study', null),
  R(/with kael|kael's luggage/, 'book.mol.kael_meet', 'near', 'kael', ['socialize', 'craft', 'travel']),
  R(/salve|purple creeper|reagent|glue|husks|alchemic|alchemy|oblia/, null, null, 'alchemy-craft', null),
  R(/fend off taiven|taiven.*out of|refuse.*(join|sewer)|refuses to join/, 'book.mol.decline', 'near', 'taiven', null),
  R(/receive taiven|hear her request/, 'book.mol.taiven_offer', 'near', 'taiven', null),
  R(/sewer|spiders|mind ward|taiven/, null, null, 'persuade-npc', ['socialize']),
  R(/feign|cover story|invented|claims prophetic|staged|warns|hint|provoke|question zach|talk with zach|admit/, null, null, 'deception-or-warning', ['socialize']),
  R(/lich|soul-altering|war trolls|invasion|fight|magic missile|spell rod|combat|nightmare vision|rain barrier|flamethrower|shield|dummy|dispel|ignite|de-illuminator|plates/, null, null, 'combat-or-ward-spell', null),
  R(/permit|mentor|transfer|ilsa/, 'book.mol.ilsa_meet', 'near', 'ilsa', ['socialize', 'study']),
  R(/pen exercise|variations book|ilsa's book/, 'book.mol.study_invocation', 'near', 'spell-study', ['study', 'research']),
  R(/levitat|pen\b|glow|shaping|basic three|marble|spinning|blindfold|mana-sensing|light orb|orb|apple|floating|scroll seal|push mana|mana along/, 'book.mol.control_drill', 'near', 'spell-practice', null),
  R(/\b(nap|settle into his room)\b/, 'book.mol.guest_room', 'near', 'rest-wake', null),
  R(/attend|lecture|\btest\b|\btests\b|exam|notes|assignment|placement|essay|class released|reading assignment/, null, null, 'class-lecture', ['study', 'rest', 'work']),
  R(/paperwork|housing|room 115|key keyed|certification|scroll|elective/, null, null, 'academy-admin', null),
  R(/textbooks|school supplies|kirielle|mother|fortov|family|household/, null, null, 'family-household', null),
  R(/avoid|drag|hurled|shelter/, null, null, 'hazard-avoidance', null),
  R(/walk|route|hill|wander|bridge|search for room/, null, null, 'travel', ['travel', 'other']),
  R(/zach|briam|akoja|benisek|neolu|byrn|gossip|dance|festival|first-year|classmates|stars|new arrivals/, null, null, 'peer-social-or-event', null),
];
function mapVerb(verb, cls) {
  const v = verb.toLowerCase();
  for (const r of RULES) {
    if (r.cls && !r.cls.includes(cls)) continue;
    if (r.re.test(v)) {
      if (r.cmd && !commandIds.has(r.cmd)) throw new Error(`rule names missing command ${r.cmd}`);
      return { cmd: r.cmd, fit: r.fit, cat: r.cat };
    }
  }
  return { cmd: null, fit: null, cat: `unruled-${cls}` };
}

// ---- actor detection ----
const NAMES = ['taiven', 'kirielle', 'kyron', 'ilsa', 'xvim', 'nora', 'kael', 'zach', 'briam', 'akoja', 'benisek', 'mother', 'fortov', 'ibery', 'kirithishli', 'zenomir', 'lich', 'byrn', 'neolu', 'kana'];
function actorOf(verb) {
  const first = verb.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  if (first === 'zorian') return { who: 'lead', text: verb.replace(/^Zorian\s+/i, '') };
  const nm = NAMES.find((n) => n === first);
  if (nm) return { who: nm, text: verb };
  return { who: 'lead', text: verb };
}
const short = (id) => String(id).replace(/^mol\.(person|creature|place)\./, '').split('-')[0];
const cid = (c) => c.replace(/^book\.mol\./, '');

// ---- load ----
const all = fs.readFileSync(SCENES, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const rows = all.filter((r) => /^lr\.mol\.main\.0(0[1-9]|1[0-3])\d\d$/.test(r.beat))
  .sort((a, b) => a.beat.localeCompare(b.beat));
const chap = (r) => +r.beat.slice(12, 15);
const stage = (r) => (chap(r) <= 4 ? 'S0' : 'S1');
const isSealed = (r) => Array.isArray(r.sealed) && r.sealed.length > 0;

// ---- per-scene analysis ----
const REACH = { match: 'exists-for-visitor', near: 'partial', none: 'gap' };
function analyse(r) {
  const verbs = r.steps.map((s) => {
    const a = actorOf(s.verb);
    const m = a.who === 'lead' ? mapVerb(a.text, s.class) : { cmd: null, fit: null, cat: 'npc-side-verb' };
    return { verb: s.verb, cls: s.class, actor: a.who, ...m };
  });
  const leadV = verbs.filter((v) => v.actor === 'lead');
  let reach;
  if (!leadV.length) reach = 'gap';
  else if (leadV.every((v) => v.fit === 'match')) reach = REACH.match;
  else if (leadV.some((v) => v.fit)) reach = REACH.near;
  else reach = REACH.none;
  const others = (r.present || []).filter((p) => !/zorian/.test(p));
  const acting = new Set(verbs.filter((v) => v.actor !== 'lead').map((v) => v.actor));
  const named = new Set(leadV.flatMap((v) => NAMES.filter((n) => new RegExp(`\\b${n}`, 'i').test(v.verb))));
  const locked = (r.options || []).filter((o) => !o.taken);
  return { r, verbs, leadV, reach, others, acting, named, locked };
}
const A = rows.map(analyse);

// ---- G12 option classification (rule, then judgment overrides keyed by beat|option) ----
const BUILD_RE = /fight|combat|lich|sewer|teleport|spell rod|rats|enter the city/i;
const DISC_RE = /tell (ilsa|zach|zenomir|taiven)|admit|reveal|confront zach|truth|everything now|stowaway|loop/i;
const LOOP_RE = /skip the month|get off at korsa|leave by train|take the train|skip the next class/i;
function classify(o) {
  const t = o.action;
  if (BUILD_RE.test(t) || ['fight', 'craft', 'ritual'].includes(o.class)) return { k: 'needs-build', why: 'combat, craft or place mechanism not in the pack' };
  if (LOOP_RE.test(t)) return { k: 'resolves-by-mechanism', why: 'travel and calendar plus loop row (G2, G6, G7)' };
  if (DISC_RE.test(t)) return { k: 'resolves-by-mechanism', why: 'knowledge and witness records (G7, G8) plus the NPC reply' };
  if (['study', 'practice', 'research'].includes(o.class)) return { k: 'resolves-by-mechanism', why: 'study or practice verb on the seat (G5)' };
  return { k: 'resolves-by-mechanism', why: 'ordinary social, rest, travel or work verb with an NPC reply (G4)' };
}
// Judgment overrides: [beat, substring of option text] -> { k, why }. Evidence: option text and needs, read.
const OVERRIDES = [
  ['lr.mol.main.00104', 'wade into the creek', { k: 'resolves-by-mechanism', why: 'ordinary work/travel verb with a wet-and-late consequence; no new system' }],
  ['lr.mol.main.00307', 'send Fortov to the apothecary', { k: 'resolves-by-mechanism', why: 'refusal plus an NPC reply; the salve is the only craft and it is not made in this branch' }],
  ['lr.mol.main.00402', 'run blindly', { k: 'resolves-by-mechanism', why: 'travel verb into a hazard; the outcome is the invasion-night death or survival, which the restart row (G7) settles' }],
  ['lr.mol.main.00512', 'alchemical accident excuse', { k: 'resolves-by-mechanism', why: 'a spoken excuse judged by the NPC; no craft is performed' }],
  ['lr.mol.main.00702', 'alchemical excuse', { k: 'resolves-by-mechanism', why: 'accepting an offered excuse is an NPC-reply verb' }],
  ['lr.mol.main.01007', 'incinerate the reading list', { k: 'resolves-by-mechanism', why: 'destroying an owned item with a spell the seat already practises; needs the flame spell row (G5 content)' }],
  ['lr.mol.main.01007', 'flame variations exercise', { k: 'resolves-by-mechanism', why: 'a spell-practice verb like the levitation exercises; needs the flame spell and study rows (G5 content)' }],
  ['lr.mol.main.00104', 'run from the rats', { k: 'resolves-by-mechanism', why: 'avoidance is a travel choice with a hazard row; taken in canon, listed only if untaken' }],
  ['lr.mol.main.00103', 'show magic to first-year', { k: 'resolves-by-mechanism', why: 'visible-magic reaction needs a witnesses/secrecy row; the verb is ordinary practice' }],
  ['lr.mol.main.00403', 'hold the teleport rod and leave', { k: 'needs-build', why: 'one-shot item with a scripted push (teleport rod); the item and its use need a row' }],
  ['lr.mol.main.00404', 'fight the lich alongside', { k: 'needs-build', why: 'lead combat against a scripted lich; the death/restart outcome (G7) is the mechanism, the fight is the build' }],
  ['lr.mol.main.01005', 'enter the city fight', { k: 'needs-build', why: 'invasion-night combat; off-path combat engine, outcome falls back to the restart row' }],
];
function classifyScene(a) {
  return a.locked.map((o) => {
    const ov = OVERRIDES.find(([b, s]) => b === a.r.beat && o.action.includes(s));
    const c = ov ? ov[2] : classify(o);
    return { ...o, ...c, judged: !!ov };
  });
}
A.forEach((a) => { a.lockedClass = classifyScene(a); });

// ---- G11 next-beat anchors ----
const loopNo = (r) => { const m = /^L(\d+|\?|>\d+|U)/.exec(r.date.value || ''); return m ? m[1] : '?'; };
const isSpan = (r) => /span|summarised|summarized/i.test(`${r.date.value} ${r.place}`);
function dayDelta(a, b) {
  if (a.date.label === 'U' || b.date.label === 'U') return 'unknown';
  const x = a.dateRef, y = b.dateRef;
  if (!x || !y || x.root !== y.root || typeof x.offsetDays !== 'number' || typeof y.offsetDays !== 'number') return 'root change';
  return String(y.offsetDays - x.offsetDays);
}
const plainDate = (r) => /^L[\d?]+-D[\d?]+$/.test(r.date.value || '');
const dateWord = (r) => `${isSealed(r) && !plainDate(r) ? '(text withheld)' : r.date.value} (${r.date.label})`;
const TIMEUNIT = /^(min|hour|day|week|month|year)/;
function nextAnchors(r) {
  return (r.anchors || []).filter((x) => TIMEUNIT.test(x.unit || '')).slice(0, 2).map((x) => `${x.fact}: ${x.value} ${x.unit}`);
}

// ---- generated blocks ----
const esc = (s) => String(s).replace(/\|/g, '/');
const blocks = {};

// counts
const nOpt = A.filter((a) => (a.r.options || []).length).length;
const nLockedScenes = A.filter((a) => a.locked.length).length;
const lockedAll = A.flatMap((a) => a.lockedClass.map((c) => ({ ...c, sealed: isSealed(a.r), s: stage(a.r), beat: a.r.beat })));
const tally = (arr, f) => arr.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const dateLabels = (s) => tally(A.filter((a) => stage(a.r) === s), (a) => a.r.date.label);

blocks.counts = [
  `| Count | S0 (c1-c4) | S1 (c5-c13) | Total |`, `|---|---|---|---|`,
  ...[
    ['Scenes', (s) => A.filter((a) => stage(a.r) === s).length],
    ['Sealed scenes', (s) => A.filter((a) => stage(a.r) === s && isSealed(a.r)).length],
    ['Scenes with non-empty `options`', (s) => A.filter((a) => stage(a.r) === s && (a.r.options || []).length).length],
    ['Scenes with at least one untaken ("Not how it happened") option', (s) => A.filter((a) => stage(a.r) === s && a.locked.length).length],
    ['Untaken options', (s) => lockedAll.filter((x) => x.s === s).length],
    ['Scenes with `date.label` I (inferred)', (s) => dateLabels(s).I || 0],
    ['Scenes with `date.label` U (unknown)', (s) => dateLabels(s).U || 0],
    ['Scenes with any other date label', (s) => A.filter((a) => stage(a.r) === s && !['I', 'U'].includes(a.r.date.label)).length],
    ['Scenes whose lead verbs all map to a pack command at "match"', (s) => A.filter((a) => stage(a.r) === s && a.reach === REACH.match).length],
    ['Scenes with partial reachability', (s) => A.filter((a) => stage(a.r) === s && a.reach === REACH.near).length],
    ['Scenes with gap reachability', (s) => A.filter((a) => stage(a.r) === s && a.reach === REACH.none).length],
    ['Steps (verbs) in the scenes', (s) => A.filter((a) => stage(a.r) === s).reduce((n, a) => n + a.verbs.length, 0)],
    ['Verbs performed by the lead', (s) => A.filter((a) => stage(a.r) === s).reduce((n, a) => n + a.leadV.length, 0)],
    ['Verbs performed by someone else (named subject)', (s) => A.filter((a) => stage(a.r) === s).reduce((n, a) => n + a.verbs.length - a.leadV.length, 0)],
    ['Lead verbs with a pack command (any fit)', (s) => A.filter((a) => stage(a.r) === s).reduce((n, a) => n + a.leadV.filter((v) => v.cmd).length, 0)],
    ['Lead verbs with no pack command (gap)', (s) => A.filter((a) => stage(a.r) === s).reduce((n, a) => n + a.leadV.filter((v) => !v.cmd).length, 0)],
  ].map(([label, f]) => `| ${label} | ${f('S0')} | ${f('S1')} | ${f('S0') + f('S1')} |`),
].join('\n');

// section 1 table
{
  const head = ['| Beat | Place | Lead verbs (class) | Others on screen (* acts) | Owner command per lead verb | Seat reach |', '|---|---|---|---|---|---|'];
  const lines = A.map((a) => {
    const r = a.r;
    if (isSealed(r)) {
      const cls = tally(a.verbs, (v) => v.cls);
      const lead = a.leadV.length, mapped = a.leadV.filter((v) => v.cmd).length;
      return `| ${r.beat} (sealed) | withheld | ${a.verbs.length} verbs: ${Object.entries(cls).map(([k, n]) => `${k} ${n}`).join(', ')} | ${a.others.length} present, ${a.acting.size} acting; names withheld | ${mapped} of ${lead} lead verbs map to a pack command; ids withheld | ${a.reach} |`;
    }
    const vcell = a.verbs.map((v, i) => `${i + 1}. ${esc(v.verb)} (${v.cls})${v.actor === 'lead' ? '' : ` [${v.actor}]`}`).join('<br>');
    const ocell = a.others.map((p) => `${short(p)}${a.acting.has(short(p)) ? '*' : ''}`).join(', ') + ([...a.acting].filter((n) => !a.others.some((p) => short(p) === n)).map((n) => `, ${n}*`).join(''));
    const ccell = a.verbs.map((v, i) => `${i + 1}. ${v.actor !== 'lead' ? 'gap (npc-side)' : v.cmd ? `${cid(v.cmd)} (${v.fit})` : `gap (${v.cat})`}`).join('<br>');
    return `| ${r.beat} | ${esc(r.place)} | ${vcell} | ${ocell || '-'} | ${ccell} | ${a.reach} |`;
  });
  blocks.table = [...head, ...lines].join('\n');
}

// G12 sections
{
  const head = ['| Beat | Untaken option (class) | Class | Why | Basis |', '|---|---|---|---|---|'];
  const lines = [];
  const sealedBy = {};
  for (const a of A) {
    if (!a.lockedClass.length) continue;
    if (isSealed(a.r)) { sealedBy[a.r.beat] = a.lockedClass; continue; }
    for (const c of a.lockedClass) lines.push(`| ${a.r.beat} | ${esc(c.action)} (${c.class}) | ${c.k} | ${esc(c.why)} | ${c.judged ? 'judgment' : 'rule'} |`);
  }
  for (const [b, cs] of Object.entries(sealedBy)) lines.push(`| ${b} (sealed) | ${cs.length} untaken, text withheld | ${Object.entries(tally(cs, (c) => c.k)).map(([k, n]) => `${k} ${n}`).join(', ')} | class-only rule | rule |`);
  blocks.g12 = [...head, ...lines].join('\n');
  const t = tally(lockedAll, (x) => x.k);
  const ts = tally(lockedAll.filter((x) => !x.sealed), (x) => x.k);
  blocks.g12tally = [
    '| Class | All untaken options | Of which non-sealed (text read) | Sealed (class-only rule) |', '|---|---|---|---|',
    ...['resolves-by-mechanism', 'needs-build', 'out-of-world'].map((k) => `| ${k} | ${t[k] || 0} | ${ts[k] || 0} | ${(t[k] || 0) - (ts[k] || 0)} |`),
    `| Total | ${lockedAll.length} | ${lockedAll.filter((x) => !x.sealed).length} | ${lockedAll.filter((x) => x.sealed).length} |`,
  ].join('\n');
}

// G11 table
{
  const head = ['| Beat | Date (label) | Next beat | Next place | Next date (label), time of day | Day delta | Next presence (non-lead) | Flags |', '|---|---|---|---|---|---|---|---|'];
  const lines = A.map((a, i) => {
    const r = a.r, n = A[i + 1] && A[i + 1].r;
    const flags = [];
    if (r.date.label === 'U') flags.push('date unknown');
    if (r.date.label === 'I') flags.push('date inferred');
    if (isSpan(r)) flags.push('span (replayed stretch)');
    if (n && loopNo(n) !== loopNo(r)) flags.push(`loop number ${loopNo(r)} to ${loopNo(n)}`);
    if (n && n.date.label !== 'S' && n.date.label !== 'E') flags.push(`next ${n.date.label === 'U' ? 'unknown' : 'inferred'}`);
    if (!n) return `| ${r.beat}${isSealed(r) ? ' (sealed)' : ''} | ${dateWord(r)} | end of c13 | - | - | - | - | ${flags.join('; ')}; next is c14, outside this table |`;
    const nsl = isSealed(n);
    const pres = nsl ? `sealed: ${(n.present || []).filter((p) => !/zorian/.test(p)).length} others, names withheld` : ((n.present || []).filter((p) => !/zorian/.test(p)).map(short).join(', ') || 'alone');
    const anch = nsl ? [] : nextAnchors(n);
    return `| ${r.beat}${isSealed(r) ? ' (sealed)' : ''} | ${dateWord(r)} | ${n.beat}${nsl ? ' (sealed)' : ''} | ${nsl ? 'withheld' : esc(n.place)} | ${dateWord(n)}, ${n.timeOfDay.value} | ${dayDelta(r, n)} | ${pres} | ${[...flags, ...anch.map((x) => `anchor ${esc(x)}`)].join('; ') || '-'} |`;
  });
  blocks.g11 = [...head, ...lines].join('\n');
  const unk = A.filter((a) => a.r.date.label === 'U' || a.r.date.label === 'I');
  blocks.g11count = [
    `Counted: ${A.filter((a) => a.r.date.label === 'I').length} scenes carry date label I (inferred), ${A.filter((a) => a.r.date.label === 'U').length} carry U (unknown), ${A.length - unk.length} carry neither.`,
    `Span scenes (value or place says a stretch is summarised): ${A.filter((a) => isSpan(a.r)).map((a) => a.r.beat).join(', ') || 'none'}.`,
    `Loop-number changes at a boundary (value prefix L\\d): ${A.slice(0, -1).filter((a, i) => loopNo(A[i + 1].r) !== loopNo(a.r)).map((a, i) => a.r.beat).length} of ${A.length - 1} boundaries.`,
    `Every \`dateRef.precision\` is "relative" and every \`dateRef.absolute\` is null (counted: ${A.filter((a) => a.r.dateRef.precision === 'relative' && a.r.dateRef.absolute == null).length} of ${A.length}).`,
  ].join('\n\n');
}

// roll-up
{
  const nonSealed = A.filter((a) => !isSealed(a.r));
  const gapRows = nonSealed.flatMap((a) => a.verbs.filter((v) => !v.cmd).map((v) => ({ cat: v.actor !== 'lead' ? 'npc-side-verb' : v.cat, beat: a.r.beat })));
  const byCat = {};
  for (const g of gapRows) { (byCat[g.cat] ||= { n: 0, beats: new Set() }); byCat[g.cat].n++; byCat[g.cat].beats.add(g.beat); }
  const rowsOut = Object.entries(byCat).sort((x, y) => y[1].n - x[1].n).map(([c, v]) => `| ${c} | ${v.n} | ${v.beats.size} | ${[...v.beats].slice(0, 4).map((b) => b.slice(12)).join(', ')}${v.beats.size > 4 ? ', ...' : ''} |`);
  blocks.rollup = ['| Gap category (verbs with no pack command) | Verbs | Scenes | First beats (CCCNN) |', '|---|---|---|---|', ...rowsOut].join('\n');
  const used = tally(nonSealed.flatMap((a) => a.leadV.filter((v) => v.cmd)), (v) => cid(v.cmd));
  blocks.cmdused = Object.entries(used).sort((x, y) => y[1] - x[1]).map(([c, n]) => `${c} ${n}`).join(', ');
  const sealedV = A.filter((a) => isSealed(a.r)).flatMap((a) => a.leadV);
  blocks.sealedline = `Sealed scenes (${A.filter((a) => isSealed(a.r)).length}): ${sealedV.length} lead verbs, ${sealedV.filter((v) => v.cmd).length} map to a pack command, ${sealedV.filter((v) => !v.cmd).length} do not; categories withheld.`;
  blocks.coverage = `Pack commands: ${commandIds.size} total in \`native.definitions.commands\`; ${Object.keys(used).length} are the owner of at least one non-sealed lead verb in this table (rule mapping). Unused by this table: ${[...commandIds].filter((c) => !used[cid(c)] && !new Set(nonSealed.flatMap((a) => a.leadV.map((v) => v.cmd))).has(c)).length}.`;
}

// ---- write blocks into doc ----
let doc = fs.existsSync(DOC) ? fs.readFileSync(DOC, 'utf8') : '';
for (const [name, text] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- BEGIN generated:${name} -->)[\\s\\S]*?(<!-- END generated:${name} -->)`);
  if (!re.test(doc)) { console.error(`marker missing: ${name}`); continue; }
  doc = doc.replace(re, (_, b, e) => `${b}\n${text}\n${e}`);
}
if (fs.existsSync(path.dirname(DOC))) fs.writeFileSync(DOC, doc);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ blocks, rows: A.map((a) => ({ beat: a.r.beat, reach: a.reach, sealed: isSealed(a.r), locked: a.lockedClass.map((c) => c.k) })) }, null, 1));
console.log(`rows=${A.length} sealed=${A.filter((a) => isSealed(a.r)).length} nonEmptyOptions=${nOpt} scenesWithLocked=${nLockedScenes} locked=${lockedAll.length}`);
