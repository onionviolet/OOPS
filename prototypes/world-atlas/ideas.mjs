// ROUTE CONTRACT (stable, agent-readable; the Ideas page uses these same routes, so browsing and agents read the same rows).
//   GET /ideas                        summary: {counts{boards,ideas,rules,families,collisions{families,codes,ideaVsRule,dupInBoard},panels,residueLines,residueBoards,
//                                     byStatus{...}}, boards[<=40 largest]{slug,file,title,kind,ideas,rules,families[]}, families[<=40 largest],
//                                     collisions[<=40], residue[<=30 boards]{board,lines}, sweep{docsScanned,docsCoded,unboarded,skipped}, builtFrom{hash,files}}
//   GET /ideas/rows?offset&limit&q&board&family&status&kind&links=<id>&local=hide|only
//                                     {total, offset, limit<=100, hash, rows:[row]}. board = slug; family = code prefix (WA, MKC, PS-AR);
//                                     status = proposal | sent | decided | accepted | built | retired | superseded | working-default;
//                                     kind = idea (reference, default) | idea-all (every board) | panel | all; q = substring of id, code, title, board, round, excerpt;
//                                     links = any link target: an idea id (`board#CODE`), a bare code, a rule code, a world id, a ledger key
//                                     (`gu_moves:ID`), a CTC id, a src path or a panel id; rows that link to it. A `#` in an id must be sent as %23.
//                                     local = hide | only: a single-letter prefix (F, T, W...) is a numbering local to one doc, flagged `local` on the row.
//   GET /ideas/row?id=<id>            {row, parent{brief}|null, children[brief], linkedFrom[brief<=50], linkedFromTotal}; 404 for an unknown id.
//   GET /ideas/families               {total, families:[{prefix, kind:idea|rule|mixed, local, boards[{board,kind,count}], ideas, rules,
//                                     flags[`shared-prefix`|`code-collision`|`idea-vs-rule`|`dup-in-board`], collidingCodes[{code,boards[]}]}]}
//   GET /ideas/boards?offset&limit&q&tier=reference|registered|all  {total, offset, limit<=100, boards:[{slug,file,title,kind,ideas,rules,families[],registers[],residue,rounds[<=60]{name,line,count}}]}
//   GET /ideas/residue?board=<slug>   {board, lines:[{line,reason,text}]}: lines that look like ideas (a code at the start) but did not parse. 404 for an unknown board.
//   idea row  {key, id:"<board-slug>#<CODE>", kind:"idea", boardKind, reference, code, family, local, title, board, boardTitle, locator{file,line,heading,anchor,link}, round, chain[],
//              format:"table"|"bold"|"list", parent:{kind:"idea",id}|{kind:"round",name,line,anchor}|null, children[id], dupInBoard,
//              status, statusLabel, statusSource:"stated"|"heading"|"default", statusRaw|null,
//              links{ideas[{code,ids[],ambiguous}], rules[{code,file,line|null,resolved}], worlds[], ledgers[], cheats[], src[], panels[]},
//              nextAction{kind:"adopt"|"route"|"retire"|"none", owner, register|null, text, gated}, excerpt}
//   panel row {key:"panel#<id>", id, kind:"panel", code:null, family:"panel", title, board:"src:definePanel", locator{file,line}, mentionedBy[idea id]}
// Identity: composite `<board-slug>#<CODE>` because codes collide across boards (WA is both an ideaboard and a rule set); a code defined twice inside
// one board gets `~2`, `~3` on the later ones and both rows say dupInBoard. Status is only what the board states: a Status column, a status word
// in the item's own bracket or parenthesis, or a section heading that opens with the word (statusSource says which). Nothing stated = "proposal (AD32)".
// Built is never inferred from prose. Rule codes (RULES_INDEX register families, defined in their owner rulebooks) are not idea rows: ideas link to
// them. nextAction is a pointer only: nothing here adopts, routes or retires anything, and `gated` marks steps that need Weibao's yes.
// Board kinds: idea-board, plan, considerations, backlog, rules, audit, run-output, research, other. docs/ideas/BOARD_KINDS.json overrides path heuristics.
// Reference = registered board, or a found idea-board, considerations, plan or backlog. `node prototypes/world-atlas/ideas.mjs search <query> [--family X] [--kind K] [--all] [--json]`
// prints composite id, status, title and source locator. Search defaults to the reference tier; --all includes every board.
// Discovery (rerun on every build, deterministic): a board is a docs/**/*.md file (not under private/ or docs/research/novels/) with at least 3 coded
// idea items, or any file that IDEA_INDEX or WRITEUP_REGISTER links and that has at least 1. Coded item formats: a table row whose code column
// (header Code/ID/#, else the first cell) is `CODE`, `CODE · title`, `CODE: title` or `CODE = ALIAS`; a bold paragraph `**CODE · title**`,
// `**CODE title.**` or `**CODE.** text`; a list item starting with a code, bold or plain. Residue = lines that start with a code but matched none.
//   node prototypes/world-atlas/ideas.mjs        prints the summary as JSON
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import {listDocs, parseCatalogue, slugify, CATALOGUE} from './cheats.mjs';

/** Markdown to plain text for item bodies. Unlike cheats.plain it keeps underscores inside words, so `gu_moves:ID` and `deeds_ui.js` survive. */
const plain = s => String(s ?? '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|~~|[*`]/g, '').replace(/(?<![A-Za-z0-9])_+|_+(?![A-Za-z0-9])/g, '').replace(/\s+/g, ' ').trim();

const root = fileURLToPath(new URL('../../', import.meta.url));
export const MAX_PAGE = 100;
export const MIN_ITEMS = 3;
export const SWEEP_DOC = 'docs/audits/IDEA_REGISTRY_SWEEP_2026-11-24.md'; // the report on this registry is not a board (its count tables would index themselves)
export const IDEA_INDEX = 'docs/IDEA_INDEX.md', WRITEUP_REGISTER = 'docs/gm/WRITEUP_REGISTER.md', RULES_INDEX = 'docs/RULES_INDEX.md';
export const DEFAULT_STATUS = 'proposal (AD32)';
export const STATUSES = ['proposal', 'sent', 'decided', 'accepted', 'built', 'retired', 'superseded', 'working-default'];
export const BOARD_KINDS = ['idea-board', 'plan', 'considerations', 'backlog', 'rules', 'audit', 'run-output', 'research', 'other'];
const REFERENCE_KINDS = new Set(['idea-board', 'plan', 'considerations', 'backlog']);
export const isReferenceBoard = b => b.tier === 'registered' || REFERENCE_KINDS.has(b.kind);
export function boardKind(file, title, overrides = {}) {
    const override = overrides[file];
    if (override && BOARD_KINDS.includes(override.kind)) return override.kind;
    const path = file.toLowerCase(), name = file.split('/').at(-1).toLowerCase(), t = title.toLowerCase();
    if (/(?:^|\/)runs?\/|\/dispatch\/.*\/(?:r\d+|tw-[a-z])\//.test(path) || /(?:^|[_-])(output|report|dedupe|receipt|checkpoint|census|result)(?:[_.-]|$)/.test(name)) return 'run-output';
    if (/(?:^|\/)(?:audits?|reviews?)\//.test(path) || /(?:^|[_-])(audit|coverage|inventory|sweep|reconciliation)(?:[_.-]|$)/.test(name) || /\baudit\b/i.test(t)) return 'audit';
    if (/(?:^|[_-])(rules?|rulebook)(?:[_.-]|$)/.test(name) || /\brulebook\b/i.test(t)) return 'rules';
    if (/(?:^|[_-])backlog(?:[_.-]|$)/.test(name) || /\bbacklog\b/i.test(t)) return 'backlog';
    if (/(?:^|[_-])considerations?(?:[_.-]|$)/.test(name) || /\bconsiderations?\b/i.test(t)) return 'considerations';
    if (/(?:^|[_-])(?:ideas?|ideaboard|idea_board)(?:[_.-]|$)/.test(name) || /\bideaboard\b/i.test(t)) return 'idea-board';
    if (/(?:^|[_-])plan(?:[_.-]|$)/.test(name) || /\bplan\b/i.test(t)) return 'plan';
    if (/^docs\/research\//.test(path)) return 'research';
    if (/^docs\/worlds\/(?:world-depth|world-core-kit)\//.test(path) || /^docs\/worlds\//.test(path) && /\bproposals?\b/i.test(t)) return 'considerations';
    if (/\bproposals?\b/i.test(t)) return 'considerations';
    return 'other';
}

// ---- codes ----
const CODE_SRC = String.raw`[A-Z]{1,6}(?:-[A-Z]{1,5})?\d{1,4}[a-z]?(?:\.\d{1,2})?`;
const CODE_END = String.raw`(?![A-Za-z0-9_])`;
const CODE_FULL = new RegExp(`^${CODE_SRC}$`);
const CODE_HEAD = new RegExp(`^(${CODE_SRC})${CODE_END}`);
export const prefixOf = code => /^[A-Z]{1,6}(?:-[A-Z]{1,5})?/.exec(code)[0];
export const baseOf = code => code.replace(/[a-z]$/, '').replace(/\.\d{1,2}$/, '');
export const boardSlug = file => file.split('/').pop().replace(/\.md$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- status ----
const STATUS_RES = [['proposal', /^(?:proposals?|proposed)\b/i], ['sent', /^sent\b/i], ['decided', /^decided\b/i], ['accepted', /^accepted\b/i], ['built', /^built\b/i],
    ['retired', /^retired\b/i], ['superseded', /^superseded\b/i], ['working-default', /^working[ -]default\b/i]];
export const statusWord = text => {const t = plain(text).replace(/^[([\s]+/, ''); for (const [w, re] of STATUS_RES) if (re.test(t)) return w; return null;};
const WORD_ALT = '(proposals?|proposed|sent|decided|accepted|built|retired|superseded|working[ -]default)';
const STATED_RES = [new RegExp(`\\bstatus\\s*[:=]\\s*${WORD_ALT}\\b`, 'i'), new RegExp(`\\[${WORD_ALT}\\b[^\\]]*\\](?!\\()`, 'i'), new RegExp(`\\(${WORD_ALT}\\b[^)]*\\)`, 'i')];
const STATED_SPAN = 90;
/** A status the item states itself, only in its first line: `status: built`, `[sent 2026-11-20]`, `(accepted ...)`. Bare prose never counts. */
export function statedStatus(firstLine) {
    const span = firstLine.slice(0, STATED_SPAN);
    for (const re of STATED_RES) {const m = re.exec(span); if (m) return statusWord(m[1]);}
    return null;
}

// ---- scan one doc ----
const MAX_BODY_LINES = 30;
const HEADING_CODE = new RegExp(`^(?:\\*\\*)?(${CODE_SRC})${CODE_END}(?:\\*\\*)?(.*)$`), ALIAS_CODE = new RegExp(`(?<![A-Za-z0-9_])(${CODE_SRC})${CODE_END}`, 'g');
const LEAD_CODE = new RegExp(`^(?:\\*\\*)?${CODE_SRC}${CODE_END}`), PLAIN_ITEM = new RegExp(`^(${CODE_SRC})${CODE_END}\\s*[:·.]\\s+(\\S.*)$`);
const LINE_CODE = new RegExp(`^\\s*(?:>\\s*)?(?:[-*+]\\s+|\\d+[.)]\\s+)?(?:\\*\\*|~~|_)?${CODE_SRC}${CODE_END}`);
const CELL_CODE = new RegExp(`^(${CODE_SRC})${CODE_END}\\s*(?:(?:=|·|:|—|–|-|\\.|,)\\s*(.*)|\\s+(.*))?$`);
const TITLE_HEAD = /^(idea|title|name|proposal|what|item|summary|description|rule|card|feature)\b/i;
const sentence = (s, n = 140) => {
    const t = plain(s).replace(/^[\s·:—–.-]+/, '');
    const cut = /^(.{8,}?[.!?])(?:\s|$)/.exec(t);
    const out = cut && cut[1].length <= n ? cut[1] : t;
    return (out.length > n ? out.slice(0, n - 1) + '…' : out).replace(/[.:]+$/, '').trim();
};

/**
 * One pass over a doc. Returns {headings, items, residue, title}. Items: {code, title, line, format, indent, aliases, statusCell, text(body), heading, chain, parentLine}.
 * Residue: lines that begin like an idea (a code at the start, after a list/bold/table/heading marker) but were not parsed.
 */
export function scanIdeas(text) {
    const lines = text.split('\n'), headings = [], items = [], residue = [], seen = new Map(), stack = [];
    let fence = false, header = null, tableOpen = false, listStack = [];
    const headOf = () => stack.at(-1) || null, chainOf = () => stack.map(s => s.text);
    const claimed = new Set();
    const push = it => {items.push({...it, heading: headOf(), chain: chainOf(), chainLines: stack.map(s => s.line)}); claimed.add(it.line);};
    const noteResidue = (i, reason) => residue.push({line: i + 1, reason, text: plain(lines[i]).slice(0, 160), heading: headOf()?.text || null});
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*(```|~~~)/.test(line)) {fence = !fence; continue;}
        if (fence) continue;
        const h = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
        if (h) {
            const level = h[1].length, t = plain(h[2]);
            while (stack.length && stack.at(-1).level >= level) stack.pop();
            const entry = {level, text: t, line: i + 1, slug: slugify(h[2], seen)};
            stack.push(entry); headings.push(entry); header = null; tableOpen = false; listStack = [];
            const hm = HEADING_CODE.exec(h[2].trim());
            if (hm) {
                const rest = hm[2].replace(/\*\*/g, '');
                if (/^\s*(?:[–—-]|,|\/)\s*[A-Z]{1,6}(?:-[A-Z]{1,5})?\d/.test(rest) || !rest.trim()) noteResidue(i, rest.trim() ? 'code-range-or-list' : 'heading-bare-code');
                else push({code: hm[1], title: sentence(rest.replace(/^\s*[·:—–.-]+\s*/, ''), 160), line: i + 1, format: 'heading', indent: 0, aliases: [], statusCell: null, text: '', firstLine: plain(line), parentLine: null});
            }
            continue;
        }
        // Tables.
        if (line.startsWith('|')) {
            const cells = line.replace(/^\||\|\s*$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
            if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
            const next = lines[i + 1] || '';
            if (!tableOpen && /^\|[\s:|-]+\|?\s*$/.test(next) && /-{3}/.test(next)) {header = cells; tableOpen = true; continue;}
            if (!tableOpen) continue;
            const codeI = Math.max(0, header.findIndex(c => /^(code|id|#|no\.?)$/i.test(plain(c))));
            const cell = plain(cells[codeI] ?? '');
            const m = CELL_CODE.exec(cell);
            const rest = m ? (m[2] ?? m[3] ?? '') : '';
            if (m && (/=/.test(cell) || (!/^[A-Z]{1,6}(?:-[A-Z]{1,5})?\d/.test(rest.split(/[\s,;]/)[0] ?? '') && !/^[/+&]/.test(rest)))) {
                const aliases = [...cell.matchAll(ALIAS_CODE)].map(x => x[1]).filter(c => c !== m[1]);
                const titleI = header.findIndex((c, k) => k !== codeI && TITLE_HEAD.test(plain(c)));
                const statusI = header.findIndex(c => /^(status|state)\b/i.test(plain(c)));
                const titleCell = titleI >= 0 ? plain(cells[titleI]) : '';
                const candidate = titleCell || cells.map((c, k) => k !== codeI && k !== statusI ? plain(c) : '').find(Boolean) || '';
                // A code in another column is a link/reference, not a new table idea.
                const codeOnly = s => !!s && /^(?:[A-Z]{1,6}(?:-[A-Z]{1,5})?\d{1,4}[a-z]?(?:\.\d{1,2})?(?:\s*\([^)]*\))?)(?:\s*[/+,;&-]\s*[A-Z]{1,6}(?:-[A-Z]{1,5})?\d{1,4}[a-z]?(?:\.\d{1,2})?)*$/.test(s);
                if (!candidate || codeOnly(candidate)) continue;
                let title = /=/.test(cell) || /^\(/.test(rest) ? '' : plain(rest);
                if (!title || codeOnly(title)) title = candidate;
                push({code: m[1], title: sentence(title, 160), line: i + 1, format: 'table', indent: 0, aliases, statusCell: statusI >= 0 ? plain(cells[statusI] ?? '') : null,
                    text: cells.map(plain).join(' · '), firstLine: cells.map(plain).join(' · '), parentLine: null});
            } else if (LEAD_CODE.test(cell)) noteResidue(i, 'table-cell-not-single-code');
            continue;
        }
        tableOpen = false; header = null;
        if (!line.trim()) continue;
        // Bold paragraph and list item.
        const lm = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/.exec(line);
        const bm = !lm && /^ {0,3}\*\*(.*)$/.exec(line);
        const content = lm ? lm[2] : bm ? '**' + bm[1] : null;
        const indent = lm ? lm[1].length : 0;
        if (!lm && !/^\s/.test(line)) listStack = [];
        if (content != null) {
            const bold = content.startsWith('**');
            const c2 = bold ? content.slice(2) : content;
            const cm = CODE_HEAD.exec(c2);
            if (cm) {
                const code = cm[1], rest = c2.slice(code.length);
                let title = '', fmt = bold ? 'bold' : 'list', ok = true;
                if (/^\s*(?:[–—-]|,|\/)\s*(?:[A-Z]{1,6}(?:-[A-Z]{1,5})?\d)/.test(rest) || /^\s*(?:and|&)\s+[A-Z]{1,6}\d/.test(rest)) {ok = false; noteResidue(i, 'code-range-or-list');}
                else if (bold) {
                    const close = rest.indexOf('**');
                    if (close >= 0) {
                        title = rest.slice(0, close).replace(/^\s*[·:—–.,-]+\s*|^\s+/, '');
                        if (!title.trim()) title = sentence(rest.slice(close + 2));
                    } else title = sentence(rest);
                    if (!/^[\s·:—–.,*-]|^$/.test(rest) && !/^\*\*/.test(rest)) {ok = false; noteResidue(i, 'bold-code-no-separator');}
                } else {
                    if (!/^\s*[:·—–.,-]|^\s+\S/.test(rest) || !rest.trim()) {ok = false; noteResidue(i, 'list-code-without-text');}
                    else {
                        const r = rest.replace(/^\s*[:·—–.,-]+\s*/, '').replace(/^\s+/, '');
                        title = /^\*\*(.+?)\*\*/.exec(r)?.[1] ?? r;
                    }
                }
                if (ok) {
                    while (listStack.length && listStack.at(-1).indent >= indent) listStack.pop();
                    const parentLine = fmt === 'list' || lm ? listStack.at(-1)?.line ?? null : null;
                    push({code, title: sentence(title, 160), line: i + 1, format: fmt, indent, aliases: [], statusCell: null, text: '', firstLine: plain(line), parentLine});
                    if (lm) listStack.push({indent, line: i + 1});
                }
                continue;
            }
        }
        // A plain line `CODE: text` (no bullet, no bold) is an item too.
        const pm = PLAIN_ITEM.exec(line);
        if (pm && !/^[A-Z]{1,6}(?:-[A-Z]{1,5})?\d/.test(pm[2].split(/[\s,;]/)[0])) {
            push({code: pm[1], title: sentence(pm[2], 160), line: i + 1, format: 'plain', indent: 0, aliases: [], statusCell: null, text: '', firstLine: plain(line), parentLine: null});
            continue;
        }
        // Residue: a code leads the line but nothing above claimed it.
        if (LINE_CODE.test(line)) noteResidue(i, /^\s*(?:[-*+]|\d+[.)])\s/.test(line) ? 'list-code-unparsed' : 'plain-paragraph-code');
    }
    // Bodies: bold and list items run to the blank line, the next coded item, a heading, a table, or a sibling bullet.
    const startLines = new Set(items.map(it => it.line));
    for (const it of items) {
        if (it.format === 'table') continue;
        const parts = [lines[it.line - 1]];
        for (let j = it.line; j < lines.length && parts.length < MAX_BODY_LINES; j++) {
            const l = lines[j];
            if (it.format === 'heading') {if (/^#{1,6}\s/.test(l) || /^\s*(```|~~~)/.test(l) || startLines.has(j + 1)) break; if (l.trim()) parts.push(l); if (parts.length >= 6) break; continue;}
            if (!l.trim() || /^#{1,6}\s/.test(l) || l.startsWith('|') || /^\s*(```|~~~)/.test(l) || startLines.has(j + 1)) break;
            if (it.format === 'list' && /^(\s*)(?:[-*+]|\d+[.)])\s/.test(l) && /^(\s*)/.exec(l)[1].length <= it.indent) break;
            if (it.format === 'heading' && /^#{1,6}\s/.test(l)) break;
            parts.push(l);
        }
        it.text = plain(parts.join(' '));
    }
    return {headings, items, residue, title: headings[0]?.text || ''};
}

// ---- register readers ----
/** RULES_INDEX register: prefix -> owner file, plus reserved prefixes. Rule codes are not ideas; ideas link to them. */
export function parseRuleRegister(text, base = 'docs') {
    const prefixes = new Map(), reserved = new Set();
    for (const line of text.split('\n')) {
        if (!line.startsWith('|')) continue;
        const c = line.replace(/^\||\|\s*$/g, '').split(/(?<!\\)\|/).map(x => x.trim());
        if (c.length < 5 || /^(set|-{3,}|:?-+:?)$/i.test(c[0])) continue;
        const owner = [...c[c.length - 1].matchAll(/\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g)].map(m => posix.normalize(posix.join(base, m[1])))[0] || null;
        for (const m of c[1].matchAll(/(?<![A-Za-z0-9_])([A-Z]{2,6})(?:-[A-Z]{1,5})?\d/g)) if (!prefixes.has(m[1])) prefixes.set(m[1], owner);
    }
    const r = /## Reserved prefixes[\s\S]*?The prefixes of the[\s\S]*?are reserved:([\s\S]*?)(?:plus|\.\s)/.exec(text);
    if (r) for (const m of r[1].matchAll(/\b([A-Z]{2,6})\b/g)) reserved.add(m[1]);
    return {prefixes, reserved, owners: new Set([...prefixes.values()].filter(Boolean))};
}
/** Doc links in a register: path -> true. Resolved against the register's own folder. */
export function linkedDocs(text, registerFile) {
    const out = new Set(), base = posix.dirname(registerFile);
    for (const m of text.matchAll(/\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g)) {if (/^[a-z]+:/i.test(m[1])) continue; out.add(posix.normalize(posix.join(base, m[1])));}
    return out;
}

const SKIP_PATH = p => /(^|\/)private\//.test(p) || p.startsWith('docs/research/novels/');
const alnum = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const WORLD_ALIAS = {lotm: ['LOTM'], 'mother-of-learning': ['MoL'], 'reverend-insanity': ['Fang Yuan']};
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function worldMatcher(worlds) {
    const byName = new Map();
    for (const w of worlds) {
        const names = new Set();
        const name = plain(String(w.name || '')).replace(/\s*\([^)]*\)/g, '').trim();
        if (name.length >= 5) names.add(name);
        if (w.id.length >= 5 && w.id.includes('-')) names.add(w.id);
        for (const a of WORLD_ALIAS[w.id] || []) names.add(a);
        for (const n of names) if (!byName.has(n)) byName.set(n, w.id);
    }
    if (!byName.size) return () => [];
    const names = [...byName.keys()].sort((a, b) => b.length - a.length), re = new RegExp(`(?<![A-Za-z0-9])(${names.map(esc).join('|')})(?![A-Za-z0-9])`, 'g');
    return text => [...new Set([...text.matchAll(re)].map(m => byName.get(m[1])))];
}

/** Every `definePanel({id: 'x', title: 'y'` call outside the declaration in panel_kit.js. A computed id is recorded as null, not guessed. */
export function scanPanels(file, text) {
    const out = [];
    if (/(^|\/)panel_kit\.js$/.test(file)) return out;
    for (const m of text.matchAll(/\bdefinePanel\s*\(/g)) {
        const after = text.slice(m.index + m[0].length, m.index + m[0].length + 400);
        const id = /^\s*\{\s*id\s*:\s*['"`]([^'"`$]+)['"`]/.exec(after)?.[1] ?? null;
        const title = /\btitle\s*:\s*['"`]([^'"`$]+)['"`]/.exec(after)?.[1] ?? null;
        out.push({file, id, title, line: text.slice(0, m.index).split('\n').length});
    }
    return out;
}

// ---- assemble ----
const fileTitle = (scan, file) => scan.title || file.split('/').pop();
const briefOf = r => ({id: r.id, code: r.code, title: r.title, status: r.status, board: r.board});
const short = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;

function nextActionOf(row, board, registers) {
    const owner = board.file, register = registers.writeup ? WRITEUP_REGISTER : registers.index ? IDEA_INDEX : null;
    const via = register ? ` Routing sits in ${register}.` : '';
    if (row.status === 'retired' || row.status === 'superseded') return {kind: 'none', owner, register, gated: false, text: `Stated as ${row.status} in ${owner}. Nothing to do unless Weibao reopens it.`};
    if (row.status === 'built') return {kind: 'route', owner, register, gated: false, text: `The board says built. The owner (${owner}) or the code it names confirms it; the atlas does not.${via}`};
    if (row.status === 'accepted' || row.status === 'decided' || row.status === 'working-default')
        return {kind: 'route', owner, register, gated: false, text: `Stated as ${row.status}. Route it to its owning rulebook through ${RULES_INDEX} and the board (${owner}).${via}`};
    if (row.status === 'sent') return {kind: 'route', owner, register, gated: true, text: `Stated as sent. The reply lands in ${owner}; Weibao's answer decides adopt or retire.${via}`};
    return {kind: 'adopt', owner, register, gated: true, text: `Proposal under AD32. Adopt, route or retire it through ${owner} on Weibao's yes; nothing is performed here.${via}`};
}

/**
 * Assemble the registry. `read(path)` returns text or null; `files` lists docs paths; `srcFiles` is [{file,text}] for src/**.js (panels);
 * `exists(path)` answers for src/ links; `worlds` is [{id,name}]; `ledgerIds(name)` returns a Set of ids or null. Pure given those, so tests pass fixtures.
 */
export function assembleIdeas({read, files, srcFiles = [], exists = () => false, worlds = [], ledgerNames = [], ledgerIds = () => null, minItems = MIN_ITEMS, stamp = null, scanCache = null}) {
    let overrides = {};
    try {overrides = JSON.parse(read('docs/ideas/BOARD_KINDS.json') || '{}');} catch { /* malformed overrides do not block the registry */ }
    const rulesText = read(RULES_INDEX) || '', reg = parseRuleRegister(rulesText);
    const ruleOwners = new Set([...reg.owners, RULES_INDEX]);
    const registerLinks = {index: linkedDocs(read(IDEA_INDEX) || '', IDEA_INDEX), writeup: linkedDocs(read(WRITEUP_REGISTER) || '', WRITEUP_REGISTER)};
    const stats = {docsScanned: 0, docsCoded: 0, unboarded: 0, skipped: 0, unboardedItems: 0};
    // 1. Scan every doc once.
    const scans = [];
    for (const file of files) {
        if (SKIP_PATH(file) || file === SWEEP_DOC) {stats.skipped++; continue;}
        const key = stamp ? stamp(file) : null, hit = key && scanCache?.get(file);
        if (hit && hit.key === key) {stats.docsScanned++; if (hit.scan) scans.push({file, scan: hit.scan}); continue;}
        const text = read(file); if (text == null) continue;
        stats.docsScanned++;
        if (!/^(?:\s*(?:>\s*)?(?:[-*+]|\d+[.)]|#{1,6})\s+)?(?:\*\*|~~|_)?\|?\s*(?:\*\*)?[A-Z]{1,6}(?:-[A-Z]{1,5})?\d{1,4}/m.test(text)) {if (key) scanCache?.set(file, {key, scan: null}); continue;} // cheap gate before the full pass: any line that starts with a code, whatever its marker
        const scan = scanIdeas(text);
        if (!scan.items.length && !scan.residue.length) {if (key) scanCache?.set(file, {key, scan: null}); continue;}
        if (key) scanCache?.set(file, {key, scan});
        scans.push({file, scan});
    }
    // 2. Which files are boards, and what is a rule item.
    const isRule = (file, code) => ruleOwners.has(file) && reg.prefixes.has(prefixOf(code).split('-')[0]) || (file === RULES_INDEX && reg.reserved.has(prefixOf(code)));
    const boards = [], taken = new Map();
    const slugs = new Map();
    for (const {file} of scans) (slugs.get(boardSlug(file)) || slugs.set(boardSlug(file), []).get(boardSlug(file))).push(file);
    const slugOf = new Map();
    for (const [base, list] of slugs) {
        if (list.length === 1) {slugOf.set(list[0], base); continue;}
        for (const f of list) {
            const parts = f.replace(/\.md$/i, '').split('/'); let k = 2, s;
            do {s = alnum(parts.slice(-k).join('-')); k++;} while (list.some(o => o !== f && alnum(o.replace(/\.md$/i, '').split('/').slice(-(k - 1)).join('-')) === s) && k <= parts.length);
            slugOf.set(f, s);
        }
    }
    void taken;
    const ruleIndex = new Map(), ideaRowsByBoard = new Map();
    const codedBoards = [];
    for (const {file, scan} of scans) {
        const rules = scan.items.filter(it => isRule(file, it.code)), ideas = scan.items.filter(it => !rules.includes(it));
        for (const it of rules) if (!ruleIndex.has(it.code)) ruleIndex.set(it.code, {file, line: it.line, heading: it.heading?.text || null});
        const linked = registerLinks.index.has(file) || registerLinks.writeup.has(file);
        const qualifies = ideas.length >= minItems || (linked && ideas.length >= 1) || rules.length > 0;
        if (!qualifies) {if (ideas.length) {stats.unboarded++; stats.unboardedItems += ideas.length;} continue;}
        stats.docsCoded++;
        codedBoards.push({file, scan, ideas, rules, linked});
    }
    // 3. Idea rows per board.
    const rows = [], byId = new Map();
    const codeIndex = new Map(); // code -> [{board,id}]
    const boardMeta = [];
    for (const b of codedBoards) {
        const slug = slugOf.get(b.file), seenCode = new Map(), mine = [];
        const registers = {index: registerLinks.index.has(b.file), writeup: registerLinks.writeup.has(b.file)};
        const rowOfLine = new Map();
        for (const it of b.ideas) {
            const n = (seenCode.get(it.code) || 0) + 1; seenCode.set(it.code, n);
            const id = `${slug}#${it.code}${n > 1 ? '~' + n : ''}`;
            const heading = it.heading;
            const stated = it.format === 'table' ? (it.statusCell ? statusWord(it.statusCell) : null) : statedStatus(it.firstLine.slice(it.firstLine.indexOf(it.code) + it.code.length));
            const headWord = h => h.split(/\s+/).length <= 5 ? statusWord(h) : null; // only a short section title can state a status
            const headStatus = !stated && it.chain.some(headWord) ? headWord([...it.chain].reverse().find(headWord)) : null;
            const status = stated || headStatus || 'proposal';
            const row = {key: id, id, kind: 'idea', code: it.code, family: prefixOf(it.code), local: prefixOf(it.code).length === 1, title: it.title || it.code, board: slug, boardTitle: fileTitle(b.scan, b.file),
                locator: {file: b.file, line: it.line, heading: heading?.text || null, anchor: heading?.slug || null, link: b.file + (heading ? '#' + heading.slug : '')},
                round: heading?.text || null, chain: it.chain, format: it.format, parent: null, children: [], dupInBoard: false,
                status, statusLabel: stated || headStatus ? status : DEFAULT_STATUS, statusSource: stated ? 'stated' : headStatus ? 'heading' : 'default',
                statusRaw: it.statusCell && !stated ? short(it.statusCell, 120) : null, aliases: it.aliases,
                links: {ideas: [], rules: [], worlds: [], ledgers: [], cheats: [], src: [], panels: []}, nextAction: null, excerpt: short(it.text, 240), _text: it.text, _parentLine: it.parentLine};
            if (n === 2) {const first = byId.get(`${slug}#${it.code}`); if (first) first.dupInBoard = true;}
            if (n > 1) row.dupInBoard = true;
            rows.push(row); byId.set(id, row); mine.push(row); rowOfLine.set(it.line, row);
            (codeIndex.get(it.code) || codeIndex.set(it.code, []).get(it.code)).push({board: slug, id});
        }
        // Parent: nesting, then X40a -> X40, then the round heading.
        const firstOf = new Map(), itemAt = new Map(b.ideas.map(x => [x.line, x]));
        for (const r of mine) if (!firstOf.has(r.code)) firstOf.set(r.code, r);
        for (const r of mine) {
            const nested = r._parentLine != null ? rowOfLine.get(r._parentLine) : null;
            const base = baseOf(r.code) !== r.code ? firstOf.get(baseOf(r.code)) : null;
            const hostLine = [...(itemAt.get(r.locator.line)?.chainLines || [])].reverse().find(l => l !== r.locator.line && rowOfLine.has(l));
            const host = hostLine ? rowOfLine.get(hostLine) : null;
            const p = nested || (base && base !== r ? base : null) || (host && host !== r ? host : null);
            if (p) {r.parent = {kind: 'idea', id: p.id}; p.children.push(r.id);}
            else if (r.round) {const h = b.scan.headings.find(x => x.text === r.round && x.slug === r.locator.anchor); r.parent = {kind: 'round', name: r.round, line: h?.line ?? null, anchor: r.locator.anchor};}
        }
        const rounds = new Map();
        for (const r of mine) {const k = r.round || '(no heading)'; const o = rounds.get(k) || {name: k, line: b.scan.headings.find(x => x.slug === r.locator.anchor)?.line ?? null, count: 0}; o.count++; rounds.set(k, o);}
        ideaRowsByBoard.set(slug, mine);
        const title = fileTitle(b.scan, b.file);
        const kind = boardKind(b.file, title, overrides);
        for (const row of mine) {row.boardKind = kind; row.reference = registers.index || registers.writeup || REFERENCE_KINDS.has(kind);}
        boardMeta.push({slug, file: b.file, tier: registers.index || registers.writeup ? 'registered' : 'found', reference: registers.index || registers.writeup || REFERENCE_KINDS.has(kind), title, kind, ideas: mine.length, rules: b.rules.length,
            families: [...new Set([...mine.map(r => r.family), ...b.rules.map(r => prefixOf(r.code))])].sort(), registers: [registers.index && 'IDEA_INDEX', registers.writeup && 'WRITEUP_REGISTER'].filter(Boolean),
            residue: b.scan.residue, rounds: [...rounds.values()].slice(0, 60), _registers: registers, _ruleItems: b.rules});
    }
    const metaBySlug = new Map(boardMeta.map(m => [m.slug, m]));
    // 4. Panels.
    const panels = [];
    const panelIds = new Map();
    for (const f of srcFiles) for (const p of scanPanels(f.file, f.text)) {
        const base = p.id ?? `${f.file.split('/').pop().replace(/\.js$/, '')}:${p.line}`;
        const n = (panelIds.get(base) || 0) + 1; panelIds.set(base, n);
        const id = `panel#${base}${n > 1 ? '~' + n : ''}`;
        panels.push({key: id, id, kind: 'panel', code: null, family: 'panel', local: false, title: p.title || p.id || '(computed id)', board: 'src:definePanel', boardTitle: 'definePanel homes in src/',
            locator: {file: p.file, line: p.line, heading: null, anchor: null, link: p.file}, panelId: p.id, status: null, statusLabel: null, statusSource: null, statusRaw: null, round: null, chain: [], format: 'src',
            parent: null, children: [], links: {ideas: [], rules: [], worlds: [], ledgers: [], cheats: [], src: [p.file], panels: []}, nextAction: null, excerpt: `${p.file}:${p.line}`, mentionedBy: [], computedId: p.id == null});
    }
    const panelsByFile = new Map(), panelsById = new Map();
    for (const p of panels) {(panelsByFile.get(p.locator.file) || panelsByFile.set(p.locator.file, []).get(p.locator.file)).push(p); if (p.panelId) (panelsById.get(p.panelId) || panelsById.set(p.panelId, []).get(p.panelId)).push(p);}
    // 5. Links.
    const worldsIn = worldMatcher(worlds);
    const cat = read(CATALOGUE) ? new Set(parseCatalogue(read(CATALOGUE)).map(c => c.id)) : null;
    const ledgerRe = ledgerNames.length ? new RegExp(`(?<![A-Za-z0-9_])(${ledgerNames.map(esc).join('|')}):([A-Za-z0-9][A-Za-z0-9_.-]*)`, 'g') : null;
    const ledgerCache = new Map();
    const hasLedgerRow = (l, id) => {if (!ledgerCache.has(l)) ledgerCache.set(l, ledgerIds(l)); return ledgerCache.get(l)?.has(id) ?? false;};
    const codeRe = new RegExp(`(?<![A-Za-z0-9_])(${CODE_SRC})${CODE_END}`, 'g');
    const ruleOwnerOf = code => reg.prefixes.get(prefixOf(code).split('-')[0]) ?? null;
    const slugByStem = new Map(boardMeta.map(m => [m.slug, m]));
    for (const r of rows) {
        const text = r._text, L = r.links, seenCodes = new Set(), self = ideaRowsByBoard.get(r.board);
        const sameBoard = new Map(); for (const s of self) if (!sameBoard.has(s.code)) sameBoard.set(s.code, s);
        for (const m of text.matchAll(codeRe)) {
            const code = m[1], stem = m.index > 1 && text[m.index - 1] === '#' ? /([A-Za-z0-9_-]{3,80})$/.exec(text.slice(Math.max(0, m.index - 81), m.index - 1))?.[1] : null;
            if (code === r.code && !stem) continue;
            if (/^CTC\d+$/.test(code)) continue;
            const key = (stem || '') + '#' + code; if (seenCodes.has(key)) continue; seenCodes.add(key);
            if (L.ideas.length + L.rules.length >= 40) break;
            if (stem) {
                const target = slugByStem.get(alnum(stem)) || slugByStem.get(stem.toLowerCase());
                const hit = target && byId.get(`${target.slug}#${code}`);
                if (hit && hit.id !== r.id) {L.ideas.push({code, ids: [hit.id], ambiguous: false}); continue;}
            }
            if (sameBoard.has(code)) {if (sameBoard.get(code) !== r) L.ideas.push({code, ids: [sameBoard.get(code).id], ambiguous: false}); continue;}
            if (ruleIndex.has(code)) {const rr = ruleIndex.get(code); L.rules.push({code, file: rr.file, line: rr.line, resolved: true}); continue;}
            const others = codeIndex.get(code);
            if (others && prefixOf(code).length > 1) {L.ideas.push({code, ids: others.slice(0, 3).map(o => o.id), ambiguous: others.length > 1}); continue;} // single-letter codes are local to a board: never resolved across boards
            if (others) continue;
            if (reg.prefixes.has(prefixOf(code).split('-')[0]) && ruleOwnerOf(code)) L.rules.push({code, file: ruleOwnerOf(code), line: null, resolved: false});
        }
        L.worlds = worldsIn(text);
        L.cheats = [...new Set([...(r.code.startsWith('CTC') ? [r.code] : []), ...[...text.matchAll(/(?<![A-Za-z0-9_])CTC\d+(?![A-Za-z0-9_])/g)].map(m => m[0])])].filter(c => !cat || cat.has(c));
        if (ledgerRe) {ledgerRe.lastIndex = 0; for (const m of text.matchAll(ledgerRe)) {const id = m[2].replace(/[.-]+$/, ''), key = `${m[1]}:${id}`; if (hasLedgerRow(m[1], id) && !L.ledgers.includes(key)) L.ledgers.push(key);}}
        L.src = [...new Set([...text.matchAll(/(?<![A-Za-z0-9_./-])(src\/[A-Za-z0-9_./-]+\.(?:m?js))(?![A-Za-z0-9_])/g)].map(m => m[1]))].filter(exists);
        const pan = new Set();
        for (const f of L.src) for (const p of panelsByFile.get(f) || []) pan.add(p.id);
        for (const m of text.matchAll(/`([a-z][a-z0-9]*[_-][a-z0-9_-]{1,40})`/g)) for (const p of panelsById.get(m[1]) || []) pan.add(p.id); // a bare word such as `deeds` or `lotm` is mostly another id
        L.panels = [...pan];
        for (const pid of L.panels) panels.find(p => p.id === pid)?.mentionedBy.push(r.id);
        r.nextAction = nextActionOf(r, metaBySlug.get(r.board), metaBySlug.get(r.board)._registers);
    }
    for (const r of rows) {delete r._text; delete r._parentLine;}
    for (const p of panels) p.nextAction = {kind: 'none', owner: p.locator.file, register: null, gated: false, text: 'A definePanel home in src/. Listed so ideas can point at it; the UI grammar inventory owns the list.'};
    // 6. Families and collisions.
    const fam = new Map();
    const famOf = prefix => fam.get(prefix) || fam.set(prefix, {prefix, boards: new Map(), ideas: 0, rules: 0, codes: new Map(), ruleCodes: new Set(), local: !prefix.includes('-') && prefix.length === 1, dup: false}).get(prefix);
    for (const m of boardMeta) {
        for (const r of ideaRowsByBoard.get(m.slug)) {
            const f = famOf(r.family); f.ideas++; f.boards.set(m.slug, (f.boards.get(m.slug) || {board: m.slug, kind: 'idea', count: 0})); f.boards.get(m.slug).count++;
            (f.codes.get(r.code) || f.codes.set(r.code, new Set()).get(r.code)).add(m.slug);
            if (r.dupInBoard) f.dup = true;
        }
        for (const it of m._ruleItems) {
            const f = famOf(prefixOf(it.code)); f.rules++; const k = m.slug + ':rule';
            if (!f.boards.has(k)) f.boards.set(k, {board: m.slug, kind: 'rule', count: 0});
            f.boards.get(k).count++; f.ruleCodes.add(it.code);
        }
    }
    const families = [...fam.values()].map(f => {
        const boardList = [...f.boards.values()].sort((a, b) => b.count - a.count || a.board.localeCompare(b.board));
        const colliding = [...f.codes].filter(([, s]) => s.size > 1).map(([code, s]) => ({code, boards: [...s].sort()})).sort((a, b) => a.code.localeCompare(b.code, 'en', {numeric: true}));
        const ideaVsRule = f.ideas > 0 && f.rules > 0;
        const flags = [];
        if (f.local) return {prefix: f.prefix, kind: 'idea', local: true, boards: boardList, ideas: f.ideas, rules: f.rules, flags: ['local'], collidingCodes: []};
        if (new Set(boardList.map(b => b.board)).size > 1) flags.push('shared-prefix');
        if (colliding.length) flags.push('code-collision');
        if (ideaVsRule) flags.push('idea-vs-rule');
        if (f.dup) flags.push('dup-in-board');
        return {prefix: f.prefix, kind: ideaVsRule ? 'mixed' : f.rules ? 'rule' : 'idea', local: f.local, boards: boardList, ideas: f.ideas, rules: f.rules, flags, collidingCodes: colliding};
    }).sort((a, b) => b.ideas + b.rules - a.ideas - a.rules || a.prefix.localeCompare(b.prefix));
    const residueLines = boardMeta.reduce((n, m) => n + m.residue.length, 0);
    const unboardedResidue = scans.filter(s => !codedBoards.some(b => b.file === s.file)).reduce((n, s) => n + s.scan.residue.length, 0);
    return {rows, panels, boards: boardMeta, families, ruleIndex: Object.fromEntries(ruleIndex), stats: {...stats, residueLines, unboardedResidue}, rulePrefixes: [...reg.prefixes.keys()]};
}

// ---- projections ----
const publicBoard = m => ({slug: m.slug, tier: m.tier, reference: m.reference, file: m.file, title: m.title, kind: m.kind, ideas: m.ideas, rules: m.rules, families: m.families.slice(0, 30), familyCount: m.families.length, registers: m.registers, residue: m.residue.length, rounds: m.rounds});
export function summarize(data, inputs = null) {
    const byStatus = {}; for (const r of data.rows) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    const colliding = data.families.filter(f => f.flags.includes('code-collision')), dupFams = data.families.filter(f => f.flags.includes('dup-in-board')), ivr = data.families.filter(f => f.flags.includes('idea-vs-rule'));
    const compact = f => ({prefix: f.prefix, kind: f.kind, local: f.local, ideas: f.ideas, rules: f.rules, boards: f.boards.length, flags: f.flags});
    return {
        counts: {boards: data.boards.length, registeredBoards: data.boards.filter(b => b.tier === 'registered').length, referenceBoards: data.boards.filter(b => b.reference).length, referenceRows: data.rows.filter(r => r.reference).length, boardsByKind: Object.fromEntries(BOARD_KINDS.map(k => [k, data.boards.filter(b => b.kind === k).length])), ideaBoards: data.boards.filter(b => b.ideas > 0).length, ideas: data.rows.length, rules: data.boards.reduce((n, b) => n + b.rules, 0), families: data.families.length,
            collisions: {families: colliding.length + ivr.filter(f => !colliding.includes(f)).length, codes: data.families.reduce((n, f) => n + f.collidingCodes.length, 0), ideaVsRule: ivr.length, dupInBoard: data.rows.filter(r => r.dupInBoard).length, dupFamilies: dupFams.length},
            panels: data.panels.length, residueLines: data.stats.residueLines, residueBoards: data.boards.filter(b => b.residue.length).length, byStatus},
        boards: data.boards.slice().sort((a, b) => (a.tier === 'registered' ? 0 : 1) - (b.tier === 'registered' ? 0 : 1) || b.ideas + b.rules - a.ideas - a.rules || a.slug.localeCompare(b.slug)).slice(0, 40).map(m => ({tier: m.tier, slug: m.slug, file: m.file, title: m.title, kind: m.kind, ideas: m.ideas, rules: m.rules, families: m.families.slice(0, 12), familyCount: m.families.length})),
        families: data.families.slice(0, 40).map(compact),
        collisions: data.families.filter(f => f.flags.some(x => x !== 'shared-prefix' && x !== 'local')).slice(0, 40).map(f => ({...compact(f), collidingCodes: f.collidingCodes.slice(0, 6)})),
        residue: data.boards.filter(b => b.residue.length).map(b => ({board: b.slug, lines: b.residue.length})).sort((a, b) => b.lines - a.lines || a.board.localeCompare(b.board)).slice(0, 30),
        sweep: data.stats, builtFrom: inputs,
    };
}
const norm = s => String(s ?? '').toLowerCase();
const hayCache = new WeakMap(), targetCache = new WeakMap();
const hay = r => hayCache.get(r) ?? (hayCache.set(r, norm([r.id, r.code, r.title, r.board, r.round, r.excerpt, r.locator.file].join('\n'))), hayCache.get(r));
const linkTargets = r => targetCache.get(r) ?? (targetCache.set(r, linkTargetsOf(r)), targetCache.get(r));
const linkTargetsOf = r => {
    const L = r.links, out = new Set();
    for (const i of L.ideas) {out.add(i.code); for (const id of i.ids) out.add(id);}
    for (const x of L.rules) out.add(x.code);
    for (const w of L.worlds) out.add(w);
    for (const l of L.ledgers) out.add(l);
    for (const c of L.cheats) out.add(c);
    for (const s of L.src) out.add(s);
    for (const p of L.panels) out.add(p);
    return out;
};
export function pageIdeas(data, {offset = 0, limit = MAX_PAGE, q = '', board = '', family = '', status = '', kind = 'idea', boardKind: boardKindFilter = '', links = '', local = ''} = {}) {
    const lim = Math.min(Math.max(Math.trunc(Number(limit)) || MAX_PAGE, 1), MAX_PAGE), off = Math.max(Math.trunc(Number(offset)) || 0, 0);
    const needle = norm(String(q || '').trim()), want = String(status || '').trim().toLowerCase(), k = String(kind || 'idea');
    const pool = k === 'panel' ? data.panels : k === 'all' ? [...data.rows, ...data.panels] : data.rows;
    const hits = pool.filter(r => {
        if (k === 'idea' && !r.reference) return false;
        if (boardKindFilter && r.boardKind !== boardKindFilter) return false;
        if (board && r.board !== board) return false;
        if (family && r.family !== family) return false;
        if (local === 'hide' && r.local) return false;
        if (local === 'only' && !r.local) return false;
        if (want && r.status !== want) return false;
        if (links && !linkTargets(r).has(links)) return false;
        return !needle || hay(r).includes(needle);
    });
    return {total: hits.length, offset: off, limit: lim, rows: hits.slice(off, off + lim)};
}
export function rowDetail(data, id) {
    const all = [...data.rows, ...data.panels], r = all.find(x => x.id === id);
    if (!r) return null;
    const byId = new Map(all.map(x => [x.id, x]));
    const linkedFrom = data.rows.filter(x => x.id !== id && linkTargets(x).has(id));
    const parentRow = r.parent?.kind === 'idea' ? byId.get(r.parent.id) : null;
    return {row: r, parent: parentRow ? briefOf(parentRow) : null, children: r.children.map(c => byId.get(c)).filter(Boolean).map(briefOf),
        linkedFrom: linkedFrom.slice(0, 50).map(briefOf), linkedFromTotal: linkedFrom.length};
}
export function pageBoards(data, {offset = 0, limit = MAX_PAGE, q = '', tier = '', kind = ''} = {}) {
    const lim = Math.min(Math.max(Math.trunc(Number(limit)) || MAX_PAGE, 1), MAX_PAGE), off = Math.max(Math.trunc(Number(offset)) || 0, 0), needle = norm(String(q || '').trim());
    const hits = data.boards.filter(b => (tier === 'all' || (tier === 'registered' ? b.tier === 'registered' : b.reference)) && (!kind || b.kind === kind) && (!needle || norm([b.slug, b.file, b.title, b.families.join(' ')].join('\n')).includes(needle)))
        .sort((a, b) => (a.tier === 'registered' ? 0 : 1) - (b.tier === 'registered' ? 0 : 1) || b.ideas + b.rules - a.ideas - a.rules || a.slug.localeCompare(b.slug));
    return {total: hits.length, offset: off, limit: lim, boards: hits.slice(off, off + lim).map(publicBoard)};
}
export const familiesOf = data => ({total: data.families.length, families: data.families});
export function residueOf(data, board) {
    const b = data.boards.find(x => x.slug === board);
    return b ? {board, lines: b.residue.map(({line, reason, text}) => ({line, reason, text}))} : null;
}

// ---- IO ----
function readWorlds(dir) {
    try {return readFileSync(join(dir, 'docs/coverage/worlds.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(w => w.id);} catch {return [];}
}
function walkSrc(dir) {
    const out = [], d = join(dir, 'src');
    const walk = rel => {
        let ents; try {ents = readdirSyncSafe(join(dir, rel));} catch {return;}
        for (const e of ents) {
            const p = rel + '/' + e.name;
            if (e.isDirectory()) {if (e.name !== 'node_modules') walk(p);} else if (e.name.endsWith('.js')) out.push(p);
        }
    };
    if (existsSync(d)) walk('src');
    return out.sort();
}
const readdirSyncSafe = p => readdirSync(p, {withFileTypes: true});
const cache = {sig: null, data: null}, scanCache = new Map();
/** Full rows for the server. Cached on a cheap stat signature of every input (path, size, mtime). */
export function readIdeas(dir = root) {
    const files = listDocs(dir), srcPaths = walkSrc(dir);
    const h = createHash('sha1'), stamps = new Map(), stat = f => {const t = statSync(join(dir, f)); stamps.set(f, t.size + ':' + t.mtimeMs); h.update(f + t.size + ':' + t.mtimeMs + '\n');};
    for (const f of files) stat(f);
    for (const f of srcPaths) stat(f);
    for (const f of ['docs/coverage/worlds.jsonl', 'docs/ideas/BOARD_KINDS.json']) if (existsSync(join(dir, f))) stat(f);
    const sig = h.digest('hex').slice(0, 12);
    if (dir === root && cache.sig === sig) return cache.data;
    const srcFiles = srcPaths.map(f => ({file: f, text: readFileSync(join(dir, f), 'utf8')}));
    const read = p => {try {return readFileSync(join(dir, p), 'utf8');} catch {return null;}};
    const cov = join(dir, 'docs/coverage');
    const ledgerNames = existsSync(cov) ? readdirSync(cov).filter(f => f.endsWith('.jsonl')).map(f => f.slice(0, -6)).filter(n => !['worlds', 'interaction_oracle', 'gu_move_slots'].includes(n)).sort() : [];
    const ledgerIds = name => {
        try {const ids = new Set(); for (const l of readFileSync(join(cov, name + '.jsonl'), 'utf8').split('\n')) {if (!l.trim()) continue; try {const r = JSON.parse(l); if (r?.id != null) ids.add(String(r.id));} catch { /* validator's */ }} return ids;} catch {return null;}
    };
    const srcSet = new Set(srcPaths);
    const data = {...assembleIdeas({read, files, srcFiles, exists: p => srcSet.has(p), worlds: readWorlds(dir), ledgerNames, ledgerIds, stamp: dir === root ? f => stamps.get(f) : null, scanCache}), hash: sig, files: files.length};
    if (dir === root) Object.assign(cache, {sig, data});
    return data;
}
/** Build part: summary only (no row text rides in the snapshot). */
export function buildIdeas(dir = root) {
    const data = readIdeas(dir);
    return summarize(data, {hash: data.hash, files: data.files});
}

export function searchIdeas(data, query, {family = '', kind = '', all = false} = {}) {
    const needle = norm(String(query || '').trim());
    return data.rows.filter(r => (all || r.reference) && (!family || r.family.toLowerCase() === family.toLowerCase()) && (!kind || r.boardKind === kind) &&
        (!needle || hay(r).includes(needle)));
}

if (import.meta.main) {
    const args = process.argv.slice(2);
    if (args[0] === 'search') {
        const query = args[1];
        if (!query || query.startsWith('--')) {process.stderr.write('Usage: node prototypes/world-atlas/ideas.mjs search <query> [--family X] [--kind K] [--all] [--json]\n'); process.exitCode = 2;}
        else {
            const opts = {all: args.includes('--all')};
            for (const flag of ['--family', '--kind']) {const at = args.indexOf(flag); if (at >= 0) opts[flag.slice(2)] = args[at + 1] || '';}
            if (opts.kind && !BOARD_KINDS.includes(opts.kind)) {process.stderr.write('Unknown board kind: ' + opts.kind + '\n'); process.exitCode = 2;}
            else {
                const hits = searchIdeas(readIdeas(), query, opts).map(r => ({id: r.id, status: r.statusLabel, title: r.title, kind: r.boardKind, locator: `${r.locator.file}:${r.locator.line}`}));
                process.stdout.write(args.includes('--json') ? JSON.stringify(hits, null, 2) + '\n' : hits.map(r => `${r.id}\t${r.status}\t${r.title}\t${r.locator}`).join('\n') + (hits.length ? '\n' : ''));
            }
        }
    } else process.stdout.write(JSON.stringify(buildIdeas()));
}
