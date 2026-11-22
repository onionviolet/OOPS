// Static extractor for the original Proto23 game (https://23html.github.io/).
// The downloaded JS is only ever scanned as text. It is never executed, imported or eval'd.
//
// Source shape (one inline script):
//   chss.<key> = new Chs()        a scene/location; its .sl function draws it
//     d_loc('Region, Place')      display name (first comma splits region from spot)
//     chs('"=> Go"',false)        a choice button; .addEventListener('click', ... smove(chss.<to>) ...) is travel
//     chs('Name: "..."',true)     narration, speaker prefix names a person
//     area_init(area.<key>)       starts a combat area (enemies in area.<key>.pop)
//     vendor.<key>                a shop (vendor.<key>.name)
//     .scout=[...]                scouting finds; giveQst(quest.<key>) hands out a quest
//   area.<key> = new Area()       combat area: .name .pop[{crt,lvlmin,lvlmax}] .onEnd .drop
//   rcp.<key> = new Recipe()      global recipes (not tied to a location)
//
// Usage: node prototypes/world-atlas/source-proto23.mjs [--raw <file>]
import {createHash} from 'node:crypto';
import {readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const URL_SRC = 'https://23html.github.io/';
const RECORDED = 'a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5';
const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_RAW = resolve(HERE, '../../private/atlas-sources/proto23/raw/index.html');
const MAX = 60;

// ---- static lexer: paren depth, string and comment flags ------------------
function lex(s) {
    const n = s.length, depth = new Int16Array(n + 1), mask = new Uint8Array(n + 1), strEnd = new Int32Array(n + 1);
    let d = 0, i = 0;
    while (i < n) {
        const c = s[i];
        if (c === '/' && s[i + 1] === '/') {
            let j = s.indexOf('\n', i); if (j < 0) j = n;
            for (let k = i; k < j; k++) { depth[k] = d; mask[k] = 2; } i = j; continue;
        }
        if (c === '/' && s[i + 1] === '*') {
            let j = s.indexOf('*/', i + 2); j = j < 0 ? n : j + 2;
            for (let k = i; k < j; k++) { depth[k] = d; mask[k] = 2; } i = j; continue;
        }
        if (c === '"' || c === "'" || c === '`') {
            let j = i + 1;
            while (j < n && s[j] !== c) { if (s[j] === '\\') j++; if (c !== '`' && s[j] === '\n') break; j++; }
            j = Math.min(j + 1, n);
            for (let k = i; k < j; k++) { depth[k] = d; mask[k] = 1; }
            strEnd[i] = j; i = j; continue;
        }
        depth[i] = d;
        if (c === '(') d++; else if (c === ')') d = Math.max(0, d - 1);
        i++;
    }
    return {s, depth, mask, strEnd};
}
const unq = raw => raw.slice(1, -1).replace(/\\(.)/g, (_, c) => c === 'n' ? ' ' : c);
const clean = v => v.replace(/<[^>]*>/g, '').replace(/&nbsp;?/g, ' ').replace(/\s+/g, ' ').trim();

// close paren index and top-level argument ranges for the call whose '(' is at open
function callArgs(L, open) {
    const want = L.depth[open] + 1, args = []; let st = open + 1, j = open + 1;
    for (; j < L.s.length; j++) {
        if (L.mask[j]) continue;
        if (L.s[j] === ',' && L.depth[j] === want) { args.push([st, j]); st = j + 1; }
        else if (L.s[j] === ')' && L.depth[j] === want) { args.push([st, j]); return {args, close: j}; }
    }
    return {args, close: j};
}
function firstString(L, a, b) {
    for (let j = a; j < b; j++) if (L.strEnd[j]) return unq(L.s.slice(j, L.strEnd[j]));
    return null;
}
function navLabel(v) {
    if (v == null) return undefined;
    let t = clean(v).replace(/^"+|"+$/g, '').replace(/^(?:\\?-\\?-\\?>|=>|<=|->)\s*/, '').replace(/\s*(?:=>|<=)$/, '').trim();
    t = t.replace(/\\/g, '');
    if (!t || !/[A-Za-z]{2}/.test(t)) return undefined;
    return t.length > MAX ? t.slice(0, MAX - 1) + '…' : t;
}
const short = t => t.length > MAX ? t.slice(0, MAX - 1) + '…' : t;
const uniq = a => [...new Set(a)];
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- table scans -----------------------------------------------------------
function lineOf(text, idx) { let n = 1; for (let i = text.indexOf('\n'); i >= 0 && i < idx; i = text.indexOf('\n', i + 1)) n++; return n; }

function nameMap(text, ns) {
    const m = new Map(), re = new RegExp(`^(${ns})\\.(\\w+)\\.name\\s*=\\s*(['"])`, 'gm');
    for (let r; (r = re.exec(text));) {
        const q = r[3], st = r.index + r[0].length - 1;
        let j = st + 1; while (j < text.length && text[j] !== q) { if (text[j] === '\\') j++; j++; }
        m.set(r[1] === 'item' || r[1] === 'creature' ? r[2] : r[1] + '.' + r[2], clean(unq(text.slice(st, j + 1))));
    }
    return m;
}
function bodyOf(text, from) { // text of the {...} that starts at/after from
    const o = text.indexOf('{', from); if (o < 0) return '';
    let d = 0, j = o;
    const L = lex(text.slice(o, o + 6000));
    for (j = 0; j < L.s.length; j++) {
        if (L.mask[j]) continue;
        if (L.s[j] === '{') d++; else if (L.s[j] === '}' && --d === 0) return L.s.slice(0, j + 1);
    }
    return L.s;
}

function parseAreas(text, creatureNames, itemNames) {
    const areas = new Map(), re = /^area\.(\w+)\s*=\s*new Area\(\)/gm, starts = [];
    for (let r; (r = re.exec(text));) starts.push([r[1], r.index]);
    const stop = text.indexOf('function z_bake');
    starts.forEach(([key, at], i) => {
        const end = i + 1 < starts.length ? starts[i + 1][1] : (stop > at ? stop : at + 4000);
        const b = text.slice(at, end);
        const nm = new RegExp(`area\\.${key}\\.name\\s*=\\s*(['"])`).exec(b);
        let name = key;
        if (nm) { const st = nm.index + nm[0].length - 1; let j = st + 1; while (j < b.length && b[j] !== nm[1]) { if (b[j] === '\\') j++; j++; } name = clean(unq(b.slice(st, j + 1))); }
        const enemies = [], lv = [];
        const pop = new RegExp(`area\\.${key}\\.pop\\s*=\\s*\\[(.*)\\]`).exec(b);
        if (pop) for (const e of pop[1].matchAll(/crt:creature\.(\w+)(?:,lvlmin:(\d+),lvlmax:(\d+))?/g)) {
            enemies.push(creatureNames.get(e[1]) || e[1]); if (e[2]) lv.push(+e[2], +e[3]);
        }
        const items = [];
        const ob = new RegExp(`area\\.${key}\\.onEnd\\s*=\\s*function`).exec(b);
        const scope = (ob ? bodyOf(b, ob.index) : '') + ' ' + (new RegExp(`area\\.${key}\\.drop\\s*=\\s*\\[(.*)\\]`).exec(b) || ['', ''])[1];
        for (const m of scope.matchAll(/\b(item|wpn|eqp|acc|sld)\.(\w+)/g)) {
            const nmv = itemNames.get(m[1] === 'item' ? m[2] : m[1] + '.' + m[2]); if (nmv) items.push(nmv);
        }
        areas.set(key, {name, enemies: uniq(enemies), lvl: lv.length ? [Math.min(...lv), Math.max(...lv)] : null, items: uniq(items), line: lineOf(text, at)});
    });
    return areas;
}

function parseVendors(text) {
    const m = new Map(), re = /^vendor\.(\w+)\.name\s*=\s*(['"])(.*?)\2/gm;
    for (let r; (r = re.exec(text));) m.set(r[1], r[3]);
    return m;
}
function parseQuests(text) {
    const m = new Map(), re = /^quest\.(\w+)\.name\s*=\s*(['"])(.*?)\2/gm;
    for (let r; (r = re.exec(text));) m.set(r[1], r[3]);
    return m;
}
function parseRecipes(text) {
    const out = [], re = /^rcp\.(\w+)\s*=\s*new Recipe\(\)/gm;
    for (let r; (r = re.exec(text));) {
        const nm = new RegExp(`^rcp\\.${r[1]}\\.name\\s*=\\s*(['"])(.*?)\\1`, 'm').exec(text.slice(r.index, r.index + 1500));
        const win = text.slice(r.index, r.index + 1500).split(/\nrcp\.\w+ = new Recipe/)[0];
        out.push({key: r[1], name: nm ? nm[2] : r[1], fire: /Nearby firesource/.test(win)});
    }
    return out;
}

// ---- scene blocks ----------------------------------------------------------
function parseScenes(text) {
    const starts = [], re = /^chss\.(\w+)\s*=\s*new Chs\(\)/gm;
    for (let r; (r = re.exec(text));) starts.push({key: r[1], at: r.index});
    return starts.map((st, i) => {
        let end = i + 1 < starts.length ? starts[i + 1].at : text.length;
        const tail = /^(?:function |\/\/\/\/|global\.text\.\w+\s*=)/m.exec(text.slice(st.at + 20, end));
        if (tail) end = st.at + 20 + tail.index;
        return {...st, end, block: text.slice(st.at, end), line: lineOf(text, st.at)};
    });
}

function readScene(sc, ctx) {
    const L = lex(sc.block), s = L.s;
    const code = re => [...s.matchAll(re)].filter(m => !L.mask[m.index]);
    const out = {key: sc.key, line: sc.line, routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: [], dloc: null, unknownTargets: 0};
    const idm = new RegExp(`chss\\.${sc.key}\\.id\\s*=\\s*(\\d+)`).exec(s); out.sourceId = idm ? +idm[1] : null;
    const dl = code(/\bd_loc\(/g)[0];
    if (dl) { const a = callArgs(L, dl.index + dl[0].length - 1).args[0]; out.dloc = a ? firstString(L, a[0], a[1]) : null; }

    // top-level choices and their handler extent
    const choices = [];
    for (const m of code(/\bchs\(/g)) {
        if (L.depth[m.index] !== 0) continue;
        const open = m.index + m[0].length - 1, c = callArgs(L, open);
        let ext = c.close;
        for (let rest = s.slice(ext + 1), r; (r = /^\s*\.\w+\(/.exec(rest));) {
            const o = ext + 1 + r[0].length - 1, cc = callArgs(L, o); ext = cc.close; rest = s.slice(ext + 1);
        }
        const flag = c.args[1] ? s.slice(c.args[1][0], c.args[1][1]).trim() : '';
        choices.push({start: m.index, end: ext, label: c.args[0] ? firstString(L, c.args[0][0], c.args[0][1]) : null, isChoice: flag === 'false', hasRoute: false});
    }
        for (const m of code(/\bsmove\(\s*chss\.(\w+)/g)) {
        const to = m[1]; if (to === sc.key) continue;
        if (!ctx.keys.has(to)) { out.unknownTargets++; continue; }
        const ch = choices.find(c => m.index >= c.start && m.index <= c.end);
        if (ch && ch.isChoice) ch.hasRoute = true;
        const label = ch && ch.isChoice ? navLabel(ch.label) : undefined;
        const ex = out.routes.find(r => r.to === to);
        if (ex) { if (!ex.label && label) ex.label = label; continue; }
        out.routes.push(label ? {to, label} : {to});
    }
    for (const c of choices) {
        if (!c.isChoice || c.hasRoute || c.label == null) continue;
        const raw = clean(c.label).replace(/^"+|"+$/g, '');
        if (/^<=|^=>/.test(raw)) continue;
        const t = navLabel(c.label);
        if (!t || (t.match(/[A-Za-z]/g) || []).length < 4 || /^(Purchase|Accept|Decline)$/i.test(t)) continue;
        out.activities.push(t);
    }
    // people: speaker prefixes in any chs()/msg() string
    for (const m of code(/\b(?:chs|msg)\(/g)) {
        const a = callArgs(L, m.index + m[0].length - 1).args[0]; if (!a) continue;
        const v = firstString(L, a[0], a[1]); if (!v) continue;
        const p = /^"?(?:<span[^>]*>)?\s*([A-Z][A-Za-z' ]{2,28}?)\s*(?:<\/span>)?\s*:(?:<\/span>)?\s/.exec(v);
        if (p && !/^(Name|Note|Notice|Warning|Reward|Level)$/i.test(p[1])) out.people.push(p[1]);
    }
    out.people = uniq(out.people);
    // shops
    for (const m of code(/\bvendor\.(\w+)/g)) if (ctx.vendors.has(m[1])) out.shops.push(ctx.vendors.get(m[1]));
    out.shops = uniq(out.shops);
    // combat areas
    for (const m of code(/\barea_init\(\s*area\.(\w+)/g)) {
        const a = ctx.areas.get(m[1]); if (!a || m[1] === 'nwh') continue;
        out.enemies.push(...a.enemies);
        out.activities.push(short('Fight: ' + a.name + (a.lvl ? ' (lv ' + a.lvl[0] + '-' + a.lvl[1] + ')' : '')));
        out.gather.push(...a.items);
    }
    // quests, scouting, work
    for (const m of code(/\bgiveQst\(\s*quest\.(\w+)/g)) out.activities.push(short('Quest: ' + (ctx.quests.get(m[1]) || m[1])));
    const scoutAt = code(/\.scout\s*=\s*\[/g)[0];
    if (scoutAt) {
        out.activities.push('Scout');
        const seg = s.slice(scoutAt.index, scoutAt.index + 1500).split(/\]\s*\n/)[0];
        for (const m of seg.matchAll(/\b(item|wpn|eqp|acc|sld)\.(\w+)/g)) {
            const nm = ctx.items.get(m[1] === 'item' ? m[2] : m[1] + '.' + m[2]); if (nm) out.gather.push(nm);
        }
    }
    if (code(/global\.flags\.work\s*=\s*true/g).length) out.activities.push('Work shift');
    if (/chss\.\w+\.shop\s*=\s*true/.test(s) && !out.shops.length) out.shops.push('Shop');
    if (/effect\.fplc|furniture\.frplc\.id\);\s*global\.lst_loc|Comfy fireplace/.test(s)) out.craft.push(...ctx.recipes.filter(r => r.fire).map(r => r.name));
    out.activities = uniq(out.activities); out.gather = uniq(out.gather); out.enemies = uniq(out.enemies); out.craft = uniq(out.craft);
    return out;
}

// ---- main ------------------------------------------------------------------
export function extractProto23(text, meta = {}) {
    const notes = [];
    const sha = createHash('sha256').update(text).digest('hex'), bytes = Buffer.byteLength(text);
    const creatureNames = nameMap(text, 'creature'), itemNames = nameMap(text, 'item|wpn|eqp|acc|sld');
    const areas = parseAreas(text, creatureNames, itemNames), vendors = parseVendors(text), quests = parseQuests(text), recipes = parseRecipes(text);
    const scenes = parseScenes(text), keys = new Set(scenes.map(s => s.key));
    const ctx = {keys, areas, vendors, quests, items: itemNames, recipes};
    const read = scenes.map(sc => readScene(sc, ctx));

    // names and containment
    const byKey = new Map(read.map(r => [r.key, r]));
    const fullToKey = new Map();
    for (const r of read) if (r.dloc) fullToKey.set(clean(r.dloc), r.key);
    const places = [], regions = new Map();
    const noComma = new Map(); // "Your Home" -> key
    for (const r of read) if (r.dloc && !r.dloc.includes(', ')) noComma.set(clean(r.dloc), r.key);
    const tails = new Map(); // "Marketplace" -> key of "Village Center, Marketplace"
    for (const r of read) if (r.dloc && r.dloc.includes(', ')) tails.set(clean(r.dloc.slice(r.dloc.indexOf(', ') + 2)), r.key);
    for (const r of read) {
        let label, parent, kind = r.shops.length ? 'shop' : r.activities.some(a => a.startsWith('Fight:')) ? 'combat' : 'spot';
        if (!r.dloc) { label = r.key; kind = 'internal'; }
        else if (!r.dloc.includes(', ')) { label = clean(r.dloc); kind = r.shops.length ? 'shop' : kind === 'spot' ? 'area' : kind; }
        else {
            const i = r.dloc.indexOf(', '), reg = clean(r.dloc.slice(0, i)); label = clean(r.dloc.slice(i + 2));
            if (noComma.has(reg) && noComma.get(reg) !== r.key) parent = noComma.get(reg);
            else if (tails.has(reg) && tails.get(reg) !== r.key) parent = tails.get(reg);
            else { const rid = 'region:' + slug(reg); regions.set(rid, reg); parent = rid; }
        }
        places.push({id: r.key, label, ...(parent ? {parent} : {}), kind, routes: r.routes, people: r.people, shops: r.shops, activities: r.activities, enemies: r.enemies, gather: r.gather, craft: r.craft, sourceLine: r.line, sourceId: r.sourceId});
    }
    for (const [id, label] of regions) places.push({id, label, kind: 'region', routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: [], sourceLine: 0, sourceId: null});

    const tops = places.filter(p => !p.parent && p.kind === 'region').map(p => p.label);
    const unknown = read.reduce((a, r) => a + r.unknownTargets, 0);
    const noName = read.filter(r => !r.dloc).map(r => r.key);
    notes.push(`${read.length} scenes (chss.* = new Chs()) parsed, ${regions.size} region nodes synthesized from d_loc prefixes, ${places.length} places total.`);
    notes.push(`${places.reduce((a, p) => a + p.routes.length, 0)} directed routes from smove(chss.X) calls; self-refreshes dropped, ${unknown} smove target(s) not a known scene.`);
    if (noName.length) notes.push(`No d_loc() display name, label falls back to the key and kind is internal: ${noName.join(', ')}.`);
    notes.push('Routes are every smove(chss.X) in the scene, including ones gated by flags, level, time, weather or chance in the source; the gate itself is not parsed.');
    notes.push('Scenes with no choice that routes onward, and routes whose smove sits in non-choice code (timers, area onEnd), carry no route label or are absent: area onEnd/onDeath smove targets are not attributed to a scene.');
    notes.push(`Combat areas: ${areas.size} defined; a scene only lists enemies for area_init(area.X) calls it contains, and enemy/loot names come from static name tables.`);
    notes.push(`Crafting is not location-bound in the source (${recipes.length} global recipes). Only recipes needing "Nearby firesource" are attached, to the fireplace scene.`);
    notes.push('Gather lists are scouting finds plus area onEnd/drop loot, not a complete resource model. Dialogue-only choices count as activities when they do not travel.');
    notes.push('People are speaker prefixes ("Name:") in chs()/msg() strings; unlabeled NPCs (the cat, nameless guards) can be missing.');
    notes.push('Catacombs (26 rooms, dark sector) define no enemies, shops or people in the source, only directional moves.');
    notes.push('Hand-rolled lexer (no regex-literal handling) so an unusual regex literal containing a quote could shift depth for the rest of its scene.');
    return {game: 'proto23', source: {url: URL_SRC, sha256: sha, bytes, fetchedAt: meta.fetchedAt ?? null, matchesRecorded: sha === RECORDED}, places, notes, regions: tops};
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    const i = process.argv.indexOf('--raw'), file = resolve(i >= 0 ? process.argv[i + 1] : DEFAULT_RAW);
    const out = extractProto23(readFileSync(file, 'utf8'), {fetchedAt: statSync(file).mtime.toISOString()});
    process.stdout.write(JSON.stringify(out, null, 1) + '\n');
}
