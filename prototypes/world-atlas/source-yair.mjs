// Upstream Yet Another Idle RPG geography, read statically from git (never imported: upstream modules touch the DOM).
//   node prototypes/world-atlas/source-yair.mjs [--ref upstream/master]
// Prints {game, source, places, notes}. Places carry ids and short labels only.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Index just past the block that opens at `open` ('(' '{' or '['), skipping strings, templates and comments.
export function blockEnd(text, open) {
    const pairs = {'(': ')', '{': '}', '[': ']'};
    const stack = [];
    for (let i = open; i < text.length; i++) {
        const c = text[i];
        if (c === '/' && text[i + 1] === '/') { i = text.indexOf('\n', i); if (i < 0) return text.length; continue; }
        if (c === '/' && text[i + 1] === '*') { i = text.indexOf('*/', i + 2) + 1; continue; }
        if (c === '"' || c === "'" || c === '`') {
            for (i++; i < text.length && text[i] !== c; i++) if (text[i] === '\\') i++;
            continue;
        }
        if (pairs[c]) stack.push(pairs[c]);
        else if (c === stack.at(-1)) { stack.pop(); if (!stack.length) return i + 1; }
    }
    return text.length;
}

const strings = s => [...s.matchAll(/["']([^"'\n]{1,80})["']/g)].map(m => m[1]);
function arrayAfter(block, key) {
    const m = new RegExp(`\\b${key}\\s*:\\s*\\[`).exec(block);
    return m ? block.slice(m.index + m[0].length - 1, blockEnd(block, m.index + m[0].length - 1)) : '';
}
function objectAfter(block, key) {
    const m = new RegExp(`\\b${key}\\s*:\\s*\\{`).exec(block);
    return m ? block.slice(m.index + m[0].length - 1, blockEnd(block, m.index + m[0].length - 1)) : '';
}
const unique = a => [...new Set(a)];
const lineOf = (text, i) => text.slice(0, i).split('\n').length;

export function extractYair(text) {
    const places = new Map();
    const head = /locations\["([^"]+)"\]\s*=\s*new\s+(Location|Combat_zone|Challenge_zone)\s*\(/g;
    for (let m; (m = head.exec(text));) {
        const start = m.index + m[0].length - 1, end = blockEnd(text, start), block = text.slice(start, end);
        const conn = arrayAfter(block, 'connected_locations');
        const routes = [...conn.matchAll(/location:\s*locations\["([^"]+)"\][^}]*?(?:travel_time:\s*(\d+))?\s*\}/g)].map(r => ({to: r[1], minutes: r[2] ? Number(r[2]) : undefined}));
        const parent = /parent_location:\s*locations\["([^"]+)"\]/.exec(block)?.[1];
        const crafting = Object.keys(Object.fromEntries([...objectAfter(objectAfter(block, 'crafting'), 'tiers').matchAll(/(\w+)\s*:\s*\d/g)].map(x => [x[1], 1])));
        places.set(m[1], {id: m[1], label: /\bname:\s*"([^"]{1,80})"/.exec(block)?.[1] || m[1], kind: m[2] === 'Location' ? 'place' : 'combat',
            parent, routes, people: strings(arrayAfter(block, 'dialogues')), shops: strings(arrayAfter(block, 'traders')),
            activities: unique([...block.matchAll(/activity_name:\s*"([^"]+)"/g)].map(x => x[1])),
            enemies: unique(strings(arrayAfter(block, 'enemies_list'))), gather: [], craft: crafting,
            unlocked: !/is_unlocked:\s*false/.test(block.slice(0, 4000)), sourceLine: lineOf(text, m.index)});
        head.lastIndex = end;
    }
    // Links added after both ends exist.
    for (const m of text.matchAll(/locations\["([^"]+)"\]\.connected_locations\.push\(\s*\{\s*location:\s*locations\["([^"]+)"\]([^}]*)\}/g)) {
        const p = places.get(m[1]);
        if (p && !p.routes.some(r => r.to === m[2])) p.routes.push({to: m[2], minutes: Number(/travel_time:\s*(\d+)/.exec(m[3])?.[1]) || undefined});
    }
    const notes = [];
    const dangling = [...places.values()].flatMap(p => p.routes.filter(r => !places.has(r.to)).map(r => p.id + ' -> ' + r.to));
    if (dangling.length) notes.push(`${dangling.length} route(s) point outside the parsed set: ${dangling.slice(0, 5).join('; ')}`);
    return {places: [...places.values()], notes};
}

if (import.meta.main) {
    const i = process.argv.indexOf('--ref'), ref = i > 0 ? process.argv[i + 1] : 'upstream/master';
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const git = (...a) => execFileSync('git', a, {cwd: root, encoding: 'utf8', maxBuffer: 64e6});
    const commit = git('rev-parse', ref).trim(), date = git('log', '-1', '--format=%cs', ref).trim();
    const out = extractYair(git('show', `${ref}:src/locations.js`));
    process.stdout.write(JSON.stringify({game: 'yair', source: {ref, commit, date, file: 'src/locations.js'}, ...out}));
}
