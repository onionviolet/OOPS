// Static extractor for the Arkivia browser text RPG (game.js, v0.26.x).
// The downloaded script is only ever read as text and scanned with string and
// regex passes. It is never executed, imported, eval'd or run in a vm.
//
// Usage: node prototypes/world-atlas/source-arkivia.mjs [--raw <dir>]
// Output: JSON on stdout. Also exports extractArkivia(text).
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const SOURCE_URL = 'https://just-pointless.github.io/arkivia/';
const MAX_LABEL = 80;

// ---- small text helpers ---------------------------------------------------

const clip = s => (s.length > MAX_LABEL ? s.slice(0, MAX_LABEL - 1) + '…' : s);
const uniq = list => [...new Set(list.filter(Boolean))];
const humanize = id => id
    .replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, c => c.toUpperCase());
const GENERIC_LABEL = /^(leave|return|next|stop|enter|yes|no|cancel|escape|get up|claim|confirm|resign|begin|approach|follow|maybe later|walk towards)\b/i;

// First top-level declaration matching `re`, ended by the next line that starts
// at column 0 with a closer. Returns {start (0-based line), lines}.
function topBlock(lines, re) {
    const start = lines.findIndex(l => re.test(l));
    if (start < 0) return null;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
        if (/^[}\])]/.test(lines[i])) { end = i; break; }
    }
    return {start, lines: lines.slice(start + 1, end)};
}

// Entries inside a block, found by a regex whose group 1 is the key.
function entries(block, keyRe) {
    const out = [];
    if (!block) return out;
    block.lines.forEach((line, i) => {
        const m = keyRe.exec(line);
        if (m) out.push({key: m[1], line: block.start + 1 + i, from: i, to: block.lines.length});
    });
    out.forEach((e, i) => { if (out[i + 1]) e.to = out[i + 1].from; });
    out.forEach(e => { e.text = block.lines.slice(e.from, e.to).join('\n'); });
    return out;
}

function nameMap(block, keyRe = /^ {4}"([^"]+)": *\{/) {
    const map = new Map();
    for (const e of entries(block, keyRe)) {
        const m = /"name":\s*"([^"]*)"/.exec(e.text);
        map.set(e.key, m ? m[1] : humanize(e.key));
    }
    return map;
}

// ---- link parsing ---------------------------------------------------------

// Scene text embeds choices as {![icon.png]Label|scene|distance|fn(args)}.
function parseLinks(body, trainingFn) {
    let s = body;
    if (trainingFn) {
        s = s.replace(/\$\{genTrainingAreaText\("([^"]+)"\)\}/g,
            (_, target) => trainingFn.replace(/\$\{\w+\}/g, target));
    }
    s = s.replace(/\$\{[^{}]*\}/g, '');
    const links = [];
    const re = /\{([^{}|\n`]+)\|([A-Za-z_]\w*)((?:\|[^{}|\n`]*){0,2})\}/g;
    let m;
    while ((m = re.exec(s))) {
        const iconM = /!\[([^\]]*)\]/.exec(m[1]);
        const label = m[1].replace(/!\[[^\]]*\]/g, '').trim();
        if (!label) continue;
        const rest = m[3] ? m[3].slice(1).split('|') : [];
        const link = {label, icon: iconM ? iconM[1] : null, to: m[2]};
        const dm = /^\s*(\d+(?:\.\d+)?)\s*(?:\(([^)]*)\))?\s*$/.exec(rest[0] ?? '');
        if (dm) {
            link.distance = Number(dm[1]);
            if (dm[2]) link.override = dm[2].trim();
        }
        const fm = /^\s*(\w+)\s*(?:\(([^)]*)\))?\s*$/.exec(rest[1] ?? '');
        if (fm) { link.fn = fm[1]; link.args = fm[2] ? fm[2].split(',').map(a => a.trim()) : []; }
        links.push(link);
    }
    return links;
}

// ---- main extraction ------------------------------------------------------

export function extractArkivia(text) {
    const lines = String(text).replace(/\r\n/g, '\n').split('\n');
    const notes = [];

    const versionM = /^\s*const\s+VERSION\s*=\s*["']([^"']+)["']/m.exec(text);
    const version = versionM ? versionM[1] : null;

    const itemNames = nameMap(topBlock(lines, /^(?:const|let|var)\s+itemData\s*=/));
    const enemyBlock = topBlock(lines, /^(?:const|let|var)\s+enemyData\s*=/);
    const enemyNames = nameMap(enemyBlock);
    const itemBlock = topBlock(lines, /^(?:const|let|var)\s+itemData\s*=/);
    const shopBlock = topBlock(lines, /^(?:const|let|var)\s+shopData\s*=/);
    const exploreBlock = topBlock(lines, /^(?:const|let|var)\s+explorePools\s*=/);
    const actionBlock = topBlock(lines, /^(?:const|let|var)\s+actionData\s*=/);
    const tickBlock = topBlock(lines, /^(?:const|let|var)\s+sceneTicks\s*=/);
    const regionBlock = topBlock(lines, /^(?:const|let|var)\s+sceneRegions\s*=/);
    const sceneClass = topBlock(lines, /^class\s+scenes\b/);
    const endClass = topBlock(lines, /^class\s+sceneEndFunctions\b/);
    const arenaBlock = topBlock(lines, /^(?:const|let|var)\s+arenaStatData\s*=/);

    if (!sceneClass) notes.push('class scenes not found: no places extracted');

    // Scene bodies, keyed by id, in source order.
    const sceneEntries = entries(sceneClass, /^ {4}(?:static\s+)?(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{\s*$/);
    const sceneIds = new Set(sceneEntries.map(e => e.key));
    const bodies = new Map(sceneEntries.map(e => [e.key, e]));

    // Regions: scene -> region.
    const sceneRegion = new Map();
    let regionLine = null;
    for (const e of entries(regionBlock, /^ {4}"(\w+)":\s*"\w+"/)) {
        const m = /:\s*"(\w+)"/.exec(e.text);
        if (m) sceneRegion.set(e.key, m[1]);
        regionLine ??= e.line + 1;
    }

    // Per-scene tick handlers.
    const ticks = new Map();
    for (const e of entries(tickBlock, /^ {4}\["(\w+)",\s*function/)) ticks.set(e.key, e);

    // Explore loot pools.
    const explore = new Map();
    for (const e of entries(exploreBlock, /^ {4}"(\w+)":\s*\{/)) {
        const lootM = /"loot":\s*\{([^}]*)\}/.exec(e.text);
        const keys = lootM ? [...lootM[1].matchAll(/"(\w+)":/g)].map(k => k[1]) : [];
        explore.set(e.key, keys.map(k => itemNames.get(k) ?? k));
    }

    // Shops: scene -> shop id (from sceneEndFunctions), stock from shopData.
    const shopScenes = new Map();
    for (const e of entries(endClass, /^ {4}(?:static\s+)?(\w+)\s*\([^)]*\)\s*\{\s*$/)) {
        const m = /generateShop\(\s*"(\w+)"\s*\)/.exec(e.text);
        if (m) shopScenes.set(e.key, m[1]);
    }
    const stock = new Map();
    for (const e of entries(shopBlock, /^ {4}"(\w+)":\s*\[/)) {
        stock.set(e.key, [...e.text.matchAll(/"name":\s*"(\w+)"/g)].map(m => itemNames.get(m[1]) ?? m[1]));
    }

    // Crafting: the scene reached by the Cancel link carrying cancelCrafting.
    const craftScenes = new Set();
    for (const m of text.matchAll(/\|([A-Za-z_]\w*)\|0\|cancelCrafting\b/g)) {
        if (sceneIds.has(m[1])) craftScenes.add(m[1]);
    }
    const recipes = [];
    for (const e of entries(itemBlock, /^ {4}"(\w+)":\s*\{/)) {
        if (!/^ {8}"crafting":\s*\{/m.test(e.text)) continue;
        const alchemy = /"type":\s*"alchemy"/.test(e.text);
        recipes.push(clip((itemNames.get(e.key) ?? humanize(e.key)) + (alchemy ? ' (alchemy)' : '')));
    }

    // Repeating gather actions bound to a scene (actions.push inside generateActions).
    const actionGather = new Map(); // scene -> [label]
    const actionNames = new Map();
    for (const e of entries(actionBlock, /^ {4}"(\w+)":\s*\{/)) {
        const nm = /"name":\s*"([^"]*)"/.exec(e.text)?.[1] ?? humanize(e.key);
        const loot = uniq([...e.text.matchAll(/changeInventory\("(\w+)"/g)].map(m => itemNames.get(m[1]) ?? m[1]));
        actionNames.set(e.key, loot.length ? `${nm}: ${loot.join(', ')}` : nm);
    }
    lines.forEach((line, i) => {
        const cm = /currentScene\s*===\s*"(\w+)"/.exec(line);
        if (!cm || !/^\s*if\b/.test(line)) return;
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
            const am = /actions\.push\("(\w+)"\)/.exec(lines[j]);
            if (am && actionNames.has(am[1])) {
                if (!actionGather.has(cm[1])) actionGather.set(cm[1], []);
                actionGather.get(cm[1]).push(clip(actionNames.get(am[1])));
                break;
            }
        }
    });

    // Template used by genTrainingAreaText, so its generated links can be read.
    const trainM = /function\s+genTrainingAreaText\(\w+\)\s*\{\s*return\s*`([^`]*)`/.exec(text);
    const trainingFn = trainM ? trainM[1] : null;

    // Base walking speed, for a distance -> minutes reading at skill level 0.
    const speedM = /function\s+getMovementSpeed\(\)[\s\S]*?return\s*\(\s*(\d+)\s*\+/.exec(text);
    const baseSpeed = speedM ? Number(speedM[1]) : null;
    if (baseSpeed === null) notes.push('base walking speed not found: route minutes omitted');

    // Arena rounds.
    const arenaRounds = arenaBlock ? (arenaBlock.lines.join('\n').match(/\{\s*"/g) ?? []).length : 0;

    // ---- first pass: links, kinds ----
    const info = new Map();
    for (const e of sceneEntries) {
        const links = parseLinks(e.text, trainingFn);
        const tick = ticks.get(e.key);
        const body = e.text;
        const firstTpl = /`([^`]*)/.exec(body)?.[1] ?? '';
        const isActivity = ticks.has(e.key) || /processingGen\(\)/.test(body) || explore.has(e.key);
        info.set(e.key, {id: e.key, line: e.line + 1, body, tick: tick?.text ?? '', links, firstTpl, isActivity});
    }

    function kindOf(id) {
        const i = info.get(id);
        if (shopScenes.has(id)) return 'shop';
        if (/^intro\d+$/.test(id)) return 'story';
        if (sceneRegion.has(id) && /processingGen\(\)/.test(i.body)
            && i.links.some(l => /^(stop|get up)/i.test(l.label))) return 'activity';
        if (sceneRegion.has(id)) {
            if (/arena/i.test(id)) return 'arena';
            if (trainingFn && /genTrainingAreaText\(/.test(i.body)) return 'gym';
            return 'place';
        }
        if (/^intro\d+$/.test(id)) return 'story';
        if (i.isActivity) return 'activity';
        if (/^\s*\\?"/.test(i.firstTpl)) return 'dialogue';
        return 'room';
    }
    for (const i of info.values()) i.kind = kindOf(i.id);
    for (const i of info.values()) {
        if (i.kind === 'room' && /arena/i.test(i.id)) i.kind = 'arena';
        if (i.kind === 'room' && trainingFn && /genTrainingAreaText\(/.test(i.body)) i.kind = 'gym';
    }

    // Owner: first inbound linker in source order (self links ignored).
    const inbound = new Map();
    for (const i of info.values()) {
        for (const l of i.links) {
            if (l.to === i.id || !info.has(l.to)) continue;
            if (!inbound.has(l.to)) inbound.set(l.to, []);
            inbound.get(l.to).push({from: i.id, link: l});
        }
    }
    const owner = new Map();
    for (const i of info.values()) {
        if (sceneRegion.has(i.id) && i.kind !== 'activity') continue;
        const ins = (inbound.get(i.id) ?? []).filter(x => !(i.kind === 'story' && !/^intro/.test(x.from)));
        const pref = ins.find(x => info.get(x.from).kind !== 'activity' && info.get(x.from).kind !== 'dialogue') ?? ins[0];
        if (pref) owner.set(i.id, pref.from);
    }
    // Break accidental cycles among owners.
    for (const id of owner.keys()) {
        const seen = new Set([id]);
        let cur = owner.get(id);
        while (cur && owner.has(cur)) {
            if (seen.has(cur)) { owner.delete(id); break; }
            seen.add(cur);
            cur = owner.get(cur);
        }
    }

    // Labels from inbound links.
    const labelFor = new Map();
    for (const i of info.values()) {
        const ins = inbound.get(i.id) ?? [];
        const override = ins.map(x => x.link.override).find(Boolean);
        const counts = new Map();
        for (const x of ins) {
            const lab = x.link.label;
            if (GENERIC_LABEL.test(lab)) continue;
            counts.set(lab, (counts.get(lab) ?? 0) + 1);
        }
        const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        labelFor.set(i.id, override ?? best ?? null);
    }
    const labelUse = new Map();
    for (const v of labelFor.values()) if (v) labelUse.set(v, (labelUse.get(v) ?? 0) + 1);
    const finalLabel = id => {
        const l = labelFor.get(id);
        return l && labelUse.get(l) === 1 ? clip(l) : clip(humanize(id));
    };

    // Host place: nearest ancestor-or-self that is not an activity, dialogue or story.
    const hosts = new Set(['activity', 'dialogue', 'story']);
    const hostOf = id => {
        let cur = id, guard = 0;
        while (cur && hosts.has(info.get(cur)?.kind) && guard++ < 50) cur = owner.get(cur);
        return cur && info.has(cur) ? cur : id;
    };

    // ---- build places ----
    const places = new Map();
    for (const i of info.values()) {
        places.set(i.id, {
            id: i.id, label: finalLabel(i.id), kind: i.kind,
            routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: [],
            sourceLine: i.line,
        });
        const parent = (i.kind === 'activity' ? owner.get(i.id) : null) ?? sceneRegion.get(i.id) ?? owner.get(i.id);
        if (parent) places.get(i.id).parent = parent;
    }
    const regionIds = uniq([...sceneRegion.values()]);
    for (const r of regionIds) {
        places.set(r, {
            id: r, label: humanize(r), kind: 'region',
            routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: [],
            sourceLine: regionLine ?? 0,
        });
    }

    const enemyLabel = id => clip(enemyNames.get(id) ?? humanize(id));
    const add = (id, field, value) => {
        if (value && places.has(id) && !places.get(id)[field].includes(value)) places.get(id)[field].push(value);
    };
    // Add on the scene itself, and on its host place when it is a sub-scene.
    const addBoth = (id, field, value) => {
        add(id, field, value);
        const h = hostOf(id);
        if (h !== id) add(h, field, value);
    };

    for (const i of info.values()) {
        const p = places.get(i.id);
        // routes
        for (const l of i.links) {
            if (l.to === i.id || !info.has(l.to)) continue;
            const r = {to: l.to, label: clip(l.label)};
            if (l.distance) {
                r.distance = l.distance;
                if (baseSpeed) r.minutes = Math.ceil(l.distance / baseSpeed);
            }
            if (!p.routes.some(x => x.to === r.to && x.label === r.label)) p.routes.push(r);
        }
        // people, activities, enemies from links
        for (const l of i.links) {
            const target = info.get(l.to);
            if (!target) continue;
            if (l.icon === 'chat.png' && !/^(ask|request|receive)\b/i.test(l.label)) {
                addBoth(i.id, 'people', clip(l.label.replace(/^talk to\s+/i, '')));
            }
            if (target.kind === 'activity' && l.to !== i.id && !/^(stop|cancel)/i.test(l.label)) {
                addBoth(i.id, 'activities', clip(l.label));
            }
            if (l.fn === 'generateEnemy' && l.args?.[0]) addBoth(i.id, 'enemies', enemyLabel(l.args[0]));
        }
        // enemies and gather from code
        for (const src of [i.body, i.tick]) {
            for (const m of src.matchAll(/generateEnemy\(\s*"(\w+)"/g)) addBoth(i.id, 'enemies', enemyLabel(m[1]));
            for (const m of src.matchAll(/"enemy":\s*"(\w+)"/g)) addBoth(i.id, 'enemies', enemyLabel(m[1]));
        }
        if (/arenaStatData/.test(i.body) && arenaBlock) {
            for (const m of arenaBlock.lines.join('\n').matchAll(/"enemyType":\s*"(\w+)"/g)) addBoth(i.id, 'enemies', enemyLabel(m[1]));
        }
        const proc = /startProcess\(\s*"(\w+)"/.exec(i.tick);
        const loot = uniq([...i.tick.matchAll(/changeInventory\(\s*"(\w+)"/g)].map(m => itemNames.get(m[1]) ?? m[1]));
        if (proc && loot.length) addBoth(i.id, 'gather', clip(`${humanize(proc[1])}: ${loot.join(', ')}`));
        if (explore.has(i.id)) addBoth(i.id, 'gather', clip(`Explore: ${explore.get(i.id).join(', ')}`));
        for (const g of actionGather.get(i.id) ?? []) addBoth(i.id, 'gather', g);
        if (/changeHealth\(/.test(i.tick)) {
            if (i.kind === 'activity') addBoth(i.id, 'activities', 'Healing');
            else add(i.id, 'activities', 'Healing');
        }
        if (shopScenes.has(i.id)) {
            const items = stock.get(shopScenes.get(i.id)) ?? [];
            add(i.id, 'shops', clip(items.length ? `${p.label}: ${items.join(', ')}` : p.label));
            add(i.id, 'people', p.label);
        }
        if (craftScenes.has(i.id)) for (const r of recipes) add(i.id, 'craft', r);
        if (arenaRounds && /theArenaEntrance/.test(i.id) && /Sunday/.test(i.body)) {
            add(i.id, 'activities', `Arena matches on Sundays (${arenaRounds} rounds)`);
        }
        if (i.kind === 'gym' && trainingFn) {
            // training links already produce activities; nothing extra
        }
    }

    // Region routes: cross-region scene links, shortest distance kept.
    const regionRoutes = new Map();
    for (const i of info.values()) {
        const from = sceneRegion.get(i.id);
        if (!from) continue;
        for (const l of i.links) {
            const to = sceneRegion.get(l.to);
            if (!to || to === from) continue;
            const key = `${from}>${to}`;
            const prev = regionRoutes.get(key);
            const d = l.distance ?? 0;
            if (!prev || d < prev.distance) regionRoutes.set(key, {from, to, distance: d, via: `${i.id} > ${l.to}`});
        }
    }
    for (const r of regionRoutes.values()) {
        const route = {to: r.to, label: clip(`via ${r.via}`)};
        if (r.distance) {
            route.distance = r.distance;
            if (baseSpeed) route.minutes = Math.ceil(r.distance / baseSpeed);
        }
        places.get(r.from).routes.push(route);
    }

    // ---- notes ----
    const list = [...places.values()];
    const scenesOnly = list.filter(p => p.kind !== 'region');
    const routeCount = list.reduce((n, p) => n + p.routes.length, 0);
    const placedEnemies = new Set(list.flatMap(p => p.enemies));
    const missingEnemies = [...enemyNames.entries()].filter(([, n]) => !placedEnemies.has(clip(n))).map(([, n]) => n);
    const unknownTargets = uniq([...info.values()].flatMap(i => i.links.map(l => l.to)).filter(t => !info.has(t)));
    const noParent = scenesOnly.filter(p => !p.parent).map(p => p.id);
    notes.push(`${scenesOnly.length} scenes and ${list.length - scenesOnly.length} regions, ${routeCount} routes (directed links, including region-level routes).`);
    notes.push(`Scene kinds: ${[...new Set(scenesOnly.map(p => p.kind))].map(k => `${k} ${scenesOnly.filter(p => p.kind === k).length}`).join(', ')}.`);
    notes.push('Parent is the sceneRegions entry where one exists; otherwise inferred from the first scene that links to it, so it is containment by approximation.');
    notes.push('Kinds are heuristics: shop (generateShop), arena (id), gym (genTrainingAreaText), activity (tick or progress bar), dialogue (quoted opening), story (introN), else room.');
    if (baseSpeed) notes.push(`Minutes are ceil(distance / ${baseSpeed}) at Walking level 0 and no load; the game scales speed by Walking, weight and energy.`);
    notes.push('Not parsed: link visibility conditions (quests, checks, day, time), random spawn weights, shop stock chances, quest text, enemy stats, per-scene prose, routes built at runtime.');
    notes.push('Enemies, gather and activities of an activity or dialogue sub-scene are listed on that sub-scene and repeated on its host place.');
    if (unknownTargets.length) notes.push(`Link targets with no scene definition: ${unknownTargets.join(', ')}.`);
    if (missingEnemies.length) notes.push(`Enemies defined but not tied to any scene by this scan: ${missingEnemies.join(', ')}.`);
    if (noParent.length) notes.push(`Scenes with no inferred parent (reached only by code): ${noParent.join(', ')}.`);
    if (!list.length) notes.push('Nothing extracted: the script shape did not match.');

    return {
        game: 'arkivia',
        source: {url: SOURCE_URL, version, files: [], fetchedAt: null},
        places: list,
        notes,
    };
}

// ---- CLI ------------------------------------------------------------------

function cli(argv) {
    const i = argv.indexOf('--raw');
    const here = dirname(fileURLToPath(import.meta.url));
    const raw = resolve(i >= 0 ? argv[i + 1] : join(here, '..', '..', 'private', 'atlas-sources', 'arkivia', 'raw'));
    const text = readFileSync(join(raw, 'game.js'), 'utf8');
    const out = extractArkivia(text);
    const files = readdirSync(raw).sort().map(name => {
        const buf = readFileSync(join(raw, name));
        return {name, sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.length};
    });
    out.source.files = files;
    out.source.fetchedAt = statSync(join(raw, 'game.js')).mtime.toISOString();
    process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) cli(process.argv.slice(2));
