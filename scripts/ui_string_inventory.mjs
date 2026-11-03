#!/usr/bin/env node
// Inventory of player-facing strings for the UI copy pass (2026-11-03).
// Static scan: tokenizes every src/**/*.js file and index.html, keeps string
// and template literals that read like player text, tags each with a surface
// guessed from its context and a world guessed from its file, and flags
// mechanical leads. Leads are drafting prompts, not defects or verdicts.
//
//   node scripts/ui_string_inventory.mjs            writes report + local JSON
//   node scripts/ui_string_inventory.mjs --json-only
//
// Sealed rule: files or keys that name sealed truths are skipped, and the
// committed report quotes only flagged lead samples, never whole tables.
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = resolve(root, 'docs/reviews/UI_STRING_INVENTORY_2026-11-03.md');
const jsonPath = resolve(root, 'docs/reviews/ui-string-inventory/strings.local.json');
const jsonOnly = process.argv.includes('--json-only');

// ---------- file walk ----------
function walk(dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith('.js')) out.push(path);
  }
  return out;
}
// Preview galleries and fixtures are not the game; sealed paths stay unread.
const files = walk(resolve(root, 'src')).filter(path => {
  const rel = relative(root, path);
  return !/sealed|secret/i.test(rel) && !/^src\/ui\/preview\//.test(rel) && !/fixture/i.test(rel);
});

// ---------- tokenizer ----------
// Enough JS lexing to find string literals: comments, strings, templates
// (with nested ${} expressions) and regex literals told apart by the
// previous significant token.
const REGEX_AFTER_WORDS = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);
function tokenize(src) {
  const tokens = [];
  let i = 0;
  let prev = null; // last significant token
  const braceStack = []; // 'template' marks a ${ opened inside a template
  const push = tok => { tokens.push(tok); prev = tok; };
  const regexAllowed = () => {
    if (!prev) return true;
    if (prev.type === 'punct') return !/^[)\]}]$/.test(prev.value);
    if (prev.type === 'word') return REGEX_AFTER_WORDS.has(prev.value);
    return false;
  };
  function readTemplate(start) {
    // i points just after the opening backtick or a closing } of ${}
    let text = '';
    let exprs = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === '\\') { text += src.slice(i, i + 2); i += 2; continue; }
      if (c === '`') { i++; return {text, exprs, end: true}; }
      if (c === '$' && src[i + 1] === '{') { i += 2; braceStack.push('template'); return {text: text + '${…}', exprs: exprs + 1, end: false}; }
      text += c; i++;
    }
    return {text, exprs, end: true};
  }
  let template = null; // {start, parts, exprs}
  const templates = [];
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { const j = src.indexOf('\n', i); i = j < 0 ? src.length : j; continue; }
    if (c === '/' && src[i + 1] === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? src.length : j + 2; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"' || c === "'") {
      const start = i; i++;
      let text = '';
      while (i < src.length && src[i] !== c && src[i] !== '\n') {
        if (src[i] === '\\') { text += unescape(src.slice(i, i + 2)); i += 2; } else { text += src[i]; i++; }
      }
      i++;
      push({type: 'string', value: text, start, quote: c});
      continue;
    }
    if (c === '`') {
      const start = i; i++;
      const part = readTemplate(start);
      if (part.end) push({type: 'string', value: part.text, start, quote: '`', exprs: part.exprs});
      else { templates.push({start, text: part.text, exprs: part.exprs, outer: template}); template = templates[templates.length - 1]; prev = {type: 'punct', value: '('}; }
      continue;
    }
    if (c === '}' && braceStack.length && braceStack[braceStack.length - 1] === 'template') {
      braceStack.pop(); i++;
      const part = readTemplate();
      template.text += part.text; template.exprs += part.exprs;
      if (part.end) {
        const done = template; template = done.outer;
        push({type: 'string', value: done.text, start: done.start, quote: '`', exprs: done.exprs});
      } else prev = {type: 'punct', value: '('};
      continue;
    }
    if (c === '/' && regexAllowed()) {
      i++;
      let inClass = false;
      while (i < src.length && src[i] !== '\n') {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') inClass = true;
        else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) break;
        i++;
      }
      i++;
      while (/[a-z]/i.test(src[i] || '')) i++;
      push({type: 'regex', value: ''});
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const start = i;
      while (/[\w$]/.test(src[i] || '')) i++;
      push({type: 'word', value: src.slice(start, i), start});
      continue;
    }
    if (/[0-9]/.test(c)) { while (/[\w.]/.test(src[i] || '')) i++; push({type: 'num', value: ''}); continue; }
    if (c === '{') braceStack.push('brace');
    if (c === '}') braceStack.pop();
    if (c === '?' && src[i + 1] === '.') { i += 2; push({type: 'punct', value: '?.'}); continue; }
    i++;
    push({type: 'punct', value: c});
  }
  return tokens;
}
function unescape(seq) {
  const map = {n: '\n', t: '\t', "'": "'", '"': '"', '\\': '\\'};
  return map[seq[1]] ?? seq[1] ?? '';
}

// ---------- context and filters ----------
const lineOf = (src, offset) => src.slice(0, offset).split('\n').length;
const DEV_CALLS = new Set(['Error', 'TypeError', 'RangeError', 'log', 'warn', 'error', 'debug', 'info', 'assert', 'querySelector', 'querySelectorAll', 'getElementById', 'addEventListener', 'removeEventListener', 'createElement', 'getItem', 'setItem', 'removeItem', 'dispatchEvent', 'CustomEvent', 'startsWith', 'endsWith', 'includes', 'split', 'replace', 'replaceAll', 'join', 'indexOf', 'require', 'matches', 'closest', 'toggle', 'contains', 'remove', 'add', 'Symbol', 'getPropertyValue', 'setProperty', 'postMessage', 'fetch', 'import']);
const SKIP_KEYS = /^(id|ids|key|keys|kind|type|class|className|cls|tag|tagName|role|style|css|color|icon|src|href|url|path|file|module|mode|event|events|world|worldId|world_id|slot|stat|stats|field|fields|ref|refs|state|status|code|codes|unit|units|format|align|variant|tone|layout|selector|dataset|data|flag|flags|sealed|truth|truths|secret|secrets|sealedTruth|hiddenTruth|trueName|answer)$/;
const SURFACE_KEYS = [
  [/^(label|labels|buttonLabel|actionLabel|verb|verbLabel|cta|button|short|shortLabel|tab|tabLabel)$/i, 'label'],
  [/^(title|heading|header|caption|section|sectionTitle|name|displayName|noun|plural)$/i, 'name/heading'],
  [/^(tooltip|hover|hint|help|hoverText|tip|aria|ariaLabel|aria-label)$/i, 'tooltip/hint'],
  [/^(description|desc|blurb|flavour|flavor|detail|details|summary|body|prose|text|lines?|note|notes|meaning|effect|effects|explain|explanation|why)$/i, 'description'],
  [/^(reason|refusal|blocked|blocker|locked|lockedReason|unavailable|missing|requires|requirement|cannot|cant|denied|fail|failure|failText|error|errorText|warning)$/i, 'refusal/reason'],
  [/^(empty|emptyText|emptyState|none|placeholder|noneText)$/i, 'empty state'],
  [/^(message|msg|log|logText|report|entry|toast|notice|notification|announce|result|outcome|success|successText|done|doneText)$/i, 'log/report'],
  [/^(confirm|confirmText|prompt|question|ask|choice|choices|option|options)$/i, 'confirm/choice'],
];
const SURFACE_CALLS = [
  [/^(log_message|logMessage|addLog|pushLog|log_event|report|addReport|pushReport|toast|notify|announce|chronicle|record_line|add_message)$/i, 'log/report'],
  [/^(setAttribute)$/i, 'attribute'],
  [/^(confirm|prompt|alert)$/i, 'confirm/choice'],
  [/^(button|make_button|makeButton|createButton|actionButton)$/i, 'label'],
  [/^(refuse|refusal|blocked|deny|reject)$/i, 'refusal/reason'],
];
const SURFACE_ASSIGN = [
  [/^(textContent|innerText|innerHTML|placeholder|value)$/, 'dom text'],
  [/^(title)$/, 'tooltip/hint'],
];

function looksPlayerFacing(text) {
  const plain = text.replace(/\$\{…\}/g, ' X ').replace(/<[^>]+>/g, ' ').trim();
  const words = text.replace(/\$\{…\}/g, ' ').replace(/<[^>]+>/g, ' ').trim();
  if (plain.length < 3) return false;
  if (!/[A-Za-z]{2}/.test(words)) return false; // only interpolations and separators
  if (!/\s/.test(words.trim()) && /[._\/]/.test(text)) return false; // keys like a.${…}.b or tab_${…}
  if (/^[\w$.\-/:#@[\]]+$/.test(plain) && !/^[A-Z][a-z]+$/.test(plain)) return false; // ids, paths, selectors, keys
  if (/^(https?:|data:|\.\/|\.\.\/|#|\.|--)/.test(plain)) return false;
  if (/^[\s\w-]+$/.test(plain) && /^([a-z0-9]+[-_])+[a-z0-9]+(\s+([a-z0-9]+[-_])*[a-z0-9]+)*$/.test(plain)) return false; // class lists
  if (/[{};]\s*$/.test(plain) || /^\s*[.#]?[\w-]+\s*\{/.test(plain)) return false; // css
  if (/^[a-z]+(-[a-z]+)*:\s*[^ ]/.test(plain) && plain.includes(';')) return false; // inline style
  if (/^(rgba?|hsla?|var|calc|translate|scale)\(/.test(plain)) return false;
  if (/^[\d\s.,%xpxemrd()+-]+$/.test(plain)) return false;
  // A single lowercase word is usually a token; a capitalised word or any
  // phrase with a space reads as player text.
  if (!/\s/.test(plain) && !/^[A-Z]/.test(plain)) return false;
  return true;
}

function contextOf(tokens, index) {
  // Walk back over the expression head to find a key, call or assignment.
  let depth = 0;
  for (let j = index - 1; j >= 0 && j >= index - 40; j--) {
    const t = tokens[j];
    if (t.type === 'punct' && (t.value === ')' || t.value === ']')) depth++;
    else if (t.type === 'punct' && (t.value === '(' || t.value === '[')) {
      if (depth === 0) {
        const callee = tokens[j - 1];
        if (callee && callee.type === 'word') return {call: callee.value};
        return {};
      }
      depth--;
    } else if (depth === 0 && t.type === 'punct' && t.value === ':') {
      const k = tokens[j - 1];
      if (k && (k.type === 'word' || k.type === 'string')) {
        // a ternary ':' has no key directly before it in object position;
        // accept only when the token before the key is { or , or (
        const before = tokens[j - 2];
        if (!before || (before.type === 'punct' && /^[{,(]$/.test(before.value))) return {key: k.value};
      }
    } else if (depth === 0 && t.type === 'punct' && t.value === '=') {
      const k = tokens[j - 1];
      const prevOp = tokens[j + 1];
      if (prevOp && prevOp.type === 'punct' && prevOp.value === '=') continue; // == / ===
      if (k && k.type === 'word') return {assign: k.value};
      return {};
    } else if (depth === 0 && t.type === 'punct' && /^[{;]$/.test(t.value)) return {};
    else if (depth === 0 && t.type === 'word' && (t.value === 'return')) return {ret: true};
    else if (depth === 0 && t.type === 'word' && t.value === 'import') return {call: 'import'};
    else if (depth === 0 && t.type === 'word' && t.value === 'from') return {call: 'import'};
  }
  return {};
}

function surfaceFor(ctx, text) {
  if (ctx.key) {
    if (SKIP_KEYS.test(ctx.key)) return null;
    for (const [re, s] of SURFACE_KEYS) if (re.test(ctx.key)) return s;
  }
  if (ctx.call) {
    if (DEV_CALLS.has(ctx.call)) return null;
    for (const [re, s] of SURFACE_CALLS) if (re.test(ctx.call)) return s;
  }
  if (ctx.assign) for (const [re, s] of SURFACE_ASSIGN) if (re.test(ctx.assign)) return s;
  if (/^(No |Nothing|None )/.test(text)) return 'empty state';
  if (/\b(can't|cannot|can not|need|needs|requires|not enough|too |locked|unavailable)\b/i.test(text) && text.length < 140) return 'refusal/reason';
  return 'other text';
}

const WORLD_HINTS = [
  [/lotm|tingen|backlund|beyonder|tarot|mysteries/i, 'LOTM'],
  [/circle_of_inev|coi_/i, 'Circle of Inevitability'],
  [/(^|[_/])hp[_.]|hogwarts|potter|wizard/i, 'Harry Potter'],
  [/(^|[_/])mol[_.]|cyoria|mother_of_learning/i, 'Mother of Learning'],
  [/shadow_slave|(^|[_/])ss[_.]|nightmare/i, 'Shadow Slave'],
  [/gu_|reverend|(^|[_/])ri[_.]/i, 'Reverend Insanity'],
  [/paradise|reincarnation/i, 'Reincarnation Paradise'],
  [/orv|omniscient/i, "Omniscient Reader's Viewpoint"],
  [/regressor/i, "Regressor's Tale"],
  [/fanren|mortal/i, 'Fanren'],
  [/mistglass/i, 'Mistglass'],
  [/steam_oni|oni/i, 'Steam Oni'],
  [/srd521|dnd|srd/i, 'SRD'],
  [/frontier|village/i, 'Frontier'],
];
const worldFor = rel => {
  if (/^src\/(data|components|models)\//.test(rel) || /^index\.html$/.test(rel)) return 'upstream YAIR shell';
  for (const [re, w] of WORLD_HINTS) if (re.test(rel)) return w;
  return 'shared';
};

// ---------- lead checks ----------
const JARGON = /\b(read model|consumer|projection|registry|schema|payload|undefined|null|NaN|\[object|native current|worldId|actorId|fixture|debug|TODO|FIXME|lorem)\b/;
const SNAKE_IN_PROSE = /(^|\s)[a-z]+_[a-z_]+(\s|$|[.,])/;
// Design-document words that read as spec voice when they reach a player:
// the audit and rule vocabulary of the docs leaking into game text.
const SPEC_VOICE = /\b(actual|supplied|qualified|native|bindings?|canonical|owning|seam|counterpart|retained|explicitly|enrolled|baseline|observer|provenance|applicability|authored|not stated|once[- ]completed|first-novel|row|rows|ledger entry|read-only|proposal|proposed)\b/i;
const leadsFor = row => {
  const leads = [];
  const t = row.text;
  if (SPEC_VOICE.test(t)) leads.push('spec voice');
  if (/^[a-z]/.test(t) && /[.!?]$/.test(t) && t.split(/\s+/).length >= 4 && row.surface !== 'other text') leads.push('sentence starts lowercase');
  if (/[A-Z]{4,} [A-Z]{2,} [A-Z]{2,}/.test(t)) leads.push('all caps');
  if (JARGON.test(t) || /\b[a-z]+[A-Z][a-zA-Z]+\b/.test(t.replace(/\$\{…\}/g, ''))) leads.push('jargon');
  if (SNAKE_IN_PROSE.test(t.replace(/\$\{…\}/g, ''))) leads.push('snake_case in text');
  if (/\$\{…\} [a-z]+s\b/.test(t) && !/\(s\)/.test(t)) leads.push('plural without count check');
  if (/ \(s\)|\(es\)/.test(t)) leads.push('(s) plural');
  if (/\.\.\.(?!\$)/.test(t)) leads.push('three dots, not …');
  if (/!/.test(t) && row.surface !== 'other text' && !/!==|!=/.test(t)) leads.push('exclamation');
  if (row.surface === 'refusal/reason' && t.split(/\s+/).length <= 3) leads.push('refusal with no reason or next step');
  if (row.surface === 'label' && /\.$/.test(t.trim())) leads.push('label ends with period');
  if (/  /.test(t.replace(/\n\s*/g, ' '))) leads.push('double space');
  if (/\b(\w+) \1\b/i.test(t.replace(/\$\{…\}/g, ''))) leads.push('repeated word');
  return leads;
};
const caseStyle = text => {
  const words = text.replace(/\$\{…\}/g, '').trim().split(/\s+/).filter(w => /^[A-Za-z]/.test(w));
  if (words.length < 2) return null;
  const tail = words.slice(1).filter(w => w.length > 3);
  if (!tail.length) return null;
  const caps = tail.filter(w => /^[A-Z]/.test(w)).length;
  if (caps === tail.length) return 'Title Case';
  if (caps === 0) return 'Sentence case';
  return null;
};

// ---------- scan ----------
const rows = [];
const precision = {};
const hash = createHash('sha256');
for (const path of files) {
  const src = readFileSync(path, 'utf8');
  const rel = relative(root, path);
  hash.update(rel).update('\0').update(src).update('\0');
  for (const m of src.matchAll(/toFixed\((\d)\)/g)) precision[m[1]] = (precision[m[1]] || 0) + 1;
  let tokens;
  try { tokens = tokenize(src); } catch { continue; }
  tokens.forEach((tok, index) => {
    if (tok.type !== 'string') return;
    const next = tokens[index + 1];
    if (next && next.type === 'punct' && next.value === ':' && tok.quote !== '`') {
      const before = tokens[index - 1];
      if (!before || (before.type === 'punct' && /^[{,]$/.test(before.value))) return; // object key
    }
    const text = tok.value.replace(/\s+/g, ' ').trim();
    if (!looksPlayerFacing(text)) return;
    const ctx = contextOf(tokens, index);
    const surface = surfaceFor(ctx, text);
    if (!surface) return;
    const row = {file: rel, line: lineOf(src, tok.start), world: worldFor(rel), surface, context: ctx.key || ctx.call || ctx.assign || (ctx.ret ? 'return' : ''), text};
    row.leads = leadsFor(row);
    rows.push(row);
  });
}

// index.html static text between tags
{
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  hash.update('index.html').update(html);
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of body.matchAll(/>([^<>]+)</g)) {
    const text = m[1].replace(/\s+/g, ' ').trim();
    if (!looksPlayerFacing(text)) continue;
    const row = {file: 'index.html', line: lineOf(body, m.index), world: 'shared', surface: 'html text', context: '', text};
    row.leads = leadsFor(row);
    rows.push(row);
  }
  for (const m of body.matchAll(/\b(title|placeholder|aria-label)="([^"]+)"/g)) {
    const text = m[2].trim();
    if (!looksPlayerFacing(text)) continue;
    const row = {file: 'index.html', line: lineOf(body, m.index), world: 'shared', surface: m[1] === 'placeholder' ? 'empty state' : 'tooltip/hint', context: m[1], text};
    row.leads = leadsFor(row);
    rows.push(row);
  }
}

mkdirSync(dirname(jsonPath), {recursive: true});
writeFileSync(jsonPath, JSON.stringify({generated: new Date().toISOString(), sourceSha256: hash.digest('hex'), rows}, null, 1));
if (jsonOnly) { console.log(`${rows.length} strings -> ${relative(root, jsonPath)}`); process.exit(0); }

// ---------- report ----------
const count = (list, f) => list.reduce((m, r) => { for (const k of [].concat(f(r))) m[k] = (m[k] || 0) + 1; return m; }, {});
const table = (obj, head, limit = 50) => {
  const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit);
  return [`| ${head} | Count |`, '| --- | ---: |', ...entries.map(([k, v]) => `| ${k} | ${v} |`)].join('\n');
};
const bySurface = count(rows, r => r.surface);
const byWorld = count(rows, r => r.world);
const byLead = count(rows.filter(r => r.leads.length), r => r.leads);
const surfaces = Object.keys(bySurface).sort();
const worlds = Object.entries(byWorld).sort((a, b) => b[1] - a[1]).map(([w]) => w);
const matrix = [
  `| World | ${surfaces.join(' | ')} | Total |`,
  `| --- | ${surfaces.map(() => '---:').join(' | ')} | ---: |`,
  ...worlds.map(w => `| ${w} | ${surfaces.map(s => rows.filter(r => r.world === w && r.surface === s).length).join(' | ')} | ${byWorld[w]} |`),
].join('\n');

// Files with the most strings: where a rewrite slice would start.
const byFile = count(rows, r => r.file);

// Label verbs: first word of label rows, to spot synonym clusters.
const labelRows = rows.filter(r => r.surface === 'label');
const verbs = count(labelRows, r => (r.text.replace(/\$\{…\}/g, '').trim().split(/\s+/)[0] || '').replace(/[^A-Za-z']/g, '') || '(template)');
const SYNONYMS = [
  ['Study', 'Practice', 'Train', 'Learn', 'Read'],
  ['Go', 'Travel', 'Walk', 'Move', 'Visit', 'Head'],
  ['Buy', 'Purchase', 'Acquire'],
  ['Make', 'Craft', 'Build', 'Brew', 'Forge', 'Create'],
  ['Close', 'Cancel', 'Back', 'Dismiss', 'Leave'],
  ['Talk', 'Speak', 'Chat', 'Ask'],
  ['Rest', 'Sleep', 'Wait'],
  ['Use', 'Apply', 'Consume', 'Eat', 'Drink'],
];
const synonymLines = SYNONYMS.map(set => {
  const present = set.filter(v => verbs[v]).map(v => `${v} ${verbs[v]}`);
  return present.length > 1 ? `| ${set[0]} family | ${present.join(', ')} |` : null;
}).filter(Boolean);

const caseCount = count(rows.filter(r => r.surface === 'label' || r.surface === 'name/heading'), r => caseStyle(r.text) || 'n/a');

// Samples prefer rows with a known surface, spread across files.
const sample = (lead, n = 8) => {
  const hits = rows.filter(r => r.leads.includes(lead));
  const known = hits.filter(r => r.surface !== 'other text');
  const seen = new Set();
  const picked = [];
  for (const r of [...known, ...hits]) {
    if (picked.length >= n) break;
    if (seen.has(r.file)) continue;
    seen.add(r.file); picked.push(r);
  }
  return picked
  .map(r => `- \`${r.file}:${r.line}\` (${r.surface}): “${r.text.length > 110 ? r.text.slice(0, 107) + '…' : r.text}”`).join('\n');
};
const specWords = count(rows.filter(r => r.leads.includes('spec voice')), r => [...new Set((r.text.match(new RegExp(SPEC_VOICE.source, 'gi')) || []).map(w => w.toLowerCase()))]);
const specBySurface = count(rows.filter(r => r.leads.includes('spec voice')), r => r.surface);

const report = `# UI string inventory (generated 2026-11-03)

Generated by \`node scripts/ui_string_inventory.mjs\`. Source SHA-256 (src JS + index.html): \`${JSON.parse(readFileSync(jsonPath, 'utf8')).sourceSha256}\`.

Status: **inventory and drafting leads, not defects or accepted decisions.** It feeds the copy style sheet ([proposal](../ui/COPY_STYLE_SHEET.md)) and later rewrite slices under DSG3, UR70-UR74 and RPT12-RPT14. Nothing here is a shipped UI change.

## Method and limits

- Static scan of ${files.length} \`src/**/*.js\` files plus \`index.html\`. A small tokenizer finds string and template literals (\`\${…}\` marks an interpolation) and keeps those that read like player text: a phrase with a space, or a capitalised word. IDs, CSS, selectors, paths, object keys, imports, thrown errors and console output are dropped.
- **Surface** comes from context: the object key the string sits under (\`label:\`, \`description:\`, \`reason:\`…), the call it is passed to, or the DOM property it is assigned to. Strings with no telling context are "other text"; strings starting "No/Nothing" become empty states and short "can't/needs/requires" lines become refusals.
- **World** comes from the file path, so shared files count as "shared" even when a row is world-specific.
- Misses: strings built from fragments across lines, text in ink files, data JSON, optional private packs, and words that exist just at runtime. False keeps: some internal labels that look like prose. Rebuilt play is still needed to see what actually reaches the screen (AGENTS verification).
- Sealed rule: paths naming \`sealed\` or \`secret\` and keys such as \`truth\` or \`secret\` are skipped. This report quotes just short lead samples. The full row list is written locally to \`${relative(root, jsonPath)}\` (gitignored) for rewrite lanes.

## Totals

**${rows.length} candidate strings** in ${Object.keys(byFile).length} files; ${rows.filter(r => r.leads.length).length} carry at least one lead.

${table(bySurface, 'Surface')}

## World by surface

${matrix}

## Files with the most strings (top 25)

A rewrite slice starts from a surface, but these files hold the bulk.

${table(byFile, 'File', 25)}

## Leads

Mechanical leads only. Each is a prompt for a human or lane to look, not a verdict.

${table(byLead, 'Lead')}

### Spec voice: which words, which surfaces

The largest lead. Design and audit vocabulary (from the rulebooks) reaching player text. Some hits are fine in context ("the actual coin"); the count shows where the habit lives.

${table(specWords, 'Word', 25)}

${table(specBySurface, 'Surface')}

### Samples

${Object.keys(byLead).sort((a, b) => byLead[b] - byLead[a]).map(lead => `#### ${lead}\n\n${sample(lead)}`).join('\n\n')}

## Label verbs

Top first words of label strings (${labelRows.length} labels).

${table(verbs, 'First word', 30)}

Possible synonym clusters (same action, different verb; check whether they really differ):

| Family | Found |
| --- | --- |
${synonymLines.join('\n') || '| none | |'}

## Capitalisation of labels and headings

${table(caseCount, 'Style')}

## Number precision (\`toFixed(n)\` calls in src)

${table(Object.fromEntries(Object.entries(precision).map(([k, v]) => [`toFixed(${k})`, v])), 'Call')}

Each call is a local precision choice; the style sheet proposes one rule per kind of number (ER11-N in the [micro-feel audit](../research/UI_MICRO_FEEL_AUDIT_2026-10-14.md)).
`;
writeFileSync(reportPath, report);
console.log(`${rows.length} strings, ${rows.filter(r => r.leads.length).length} with leads -> ${relative(root, reportPath)}`);
