// Compact search over admitted public Atlas projections, never raw reading inputs.
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
import {VISION_THEMES} from './vision-coverage.mjs';

const FIND_GROUPS = [['subjects', 'Subjects and places'], ['rules', 'World rules'], ['cheats', 'Cheat catalogue'],
    ['scenes', 'Reader scenes'], ['routes', 'Playable routes'], ['vision', 'Vision themes']];

function hidden(row) {
    if (!row || typeof row !== 'object') return false;
    return row.sealed === true || row.private === true || row.withheld === true ||
        (Array.isArray(row.sealed) && row.sealed.length > 0) ||
        ['sealed', 'private', 'withheld'].includes(row.visibility) ||
        ['sealed', 'private', 'withheld'].includes(row.status) ||
        ['sealed', 'private', 'withheld'].includes(row.scope);
}
function safe(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    if (/(?:[a-z]:[\\/]|\/Users\/|\/home\/|~\/|(?:^|\/)private\/)/i.test(value)) return null;
    return value.trim();
}
const text = value => (safe(value) || '').replace(/\s+/g, ' ');
const normal = value => text(value).normalize('NFKD').replace(/\p{M}/gu, '').replace(/[’‘]/g, "'").toLocaleLowerCase();
const plain = value => text(value).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|`/g, '');
const subjectHref = (world, id) => `#world/${encodeURIComponent(world)}/things/${encodeURIComponent(id)}`;
const subjectKey = row => (row.origin === 'reader-scene' ? 'scene|' : '') + row.world + '|' + row.id;
// Demonstrated dataset identities, not a general title/edition deduplicator.
const riDatasets=['ri','reverend-insanity'];
const kindScopes={gu:'Gu',person:'People',plant:'Plants',animal:'Animals',construct:'Constructs'};
export function findWorldChoices(worlds) {
    const choices=worlds.map(world=>({...world,label:world.id==='ri'?'Reverend Insanity · reader and play records':
        world.id==='reverend-insanity'?'Reverend Insanity · recorded rules':
        kindScopes[world.id]?'Living kinds · '+kindScopes[world.id]+' (cross-world)':world.label}));
    const members=riDatasets.filter(id=>choices.some(world=>world.id===id));
    if(members.length)choices.push({id:'title:ri',label:'Reverend Insanity · all indexed records',members});
    return choices.sort((a,b)=>a.label.localeCompare(b.label)||a.id.localeCompare(b.id));
}

export function projectFindSubjects({library = [], books = {}, digests = []} = {}) {
    const rows = new Map();
    function add(row) {
        if (!safe(row.id) || !safe(row.label) || !safe(row.world) || !row.href) return;
        const key = subjectKey(row);
        if (!rows.has(key) || row.origin === 'reader') rows.set(key, row);
    }
    for (const digest of digests) {
        if (hidden(digest)) continue;
        for (const entity of digest.entities || []) {
            if (hidden(entity)) continue;
            add({
                id: entity.id, label: entity.label, world: digest.world,
                kind: entity.col || entity.kind || 'subject', summary: text(entity.kind),
                status: 'Admitted reader record', origin: 'reader',
                href: subjectHref(digest.world, entity.id),
            });
        }
        // Digest admission is the source boundary. Index identity/locators only:
        // narrative detail, actors, choices and place names are not search titles.
        for (const scene of digest.scenes || []) {
            if (hidden(scene) || !safe(scene.id)) continue;
            const locators = [...new Set([scene.locator, ...(Array.isArray(scene.locators) ? scene.locators : [])]
                .filter(value => typeof value === 'string' && parseLocator(value)))];
            add({id:scene.id,label:locators.length?'Scene at '+locators[0]:'Reader scene '+scene.id,
                world:digest.world,kind:'Reader scene',summary:'Admitted source reading record. Game availability is not inferred.',
                status:'Source record; no playable proof inferred',origin:'reader-scene',terms:locators.join(' '),
                href:`#world/${encodeURIComponent(digest.world)}/reader-scenes/${encodeURIComponent(scene.id)}`});
        }
    }
    for (const [world, pack] of Object.entries(books)) {
        if (hidden(pack)) continue;
        for (const [kind, entries] of [['person', pack.people], ['place', pack.places]]) {
            for (const entry of entries || []) {
                if (hidden(entry)) continue;
                const id = entry.indexId || entry.id;
                const href = kind === 'place' ?
                    `#world/${encodeURIComponent(world)}/places/${encodeURIComponent(entry.id)}` :
                    subjectHref(world, id);
                add({
                    id, label: entry.name, world, kind, summary: 'Public cast projection',
                    status: 'Recorded cast identity; current whereabouts not inferred',
                    origin: 'cast', href,
                });
            }
        }
    }
    for (const entry of library) {
        if (hidden(entry)) continue;
        add({
            id: entry.id, label: entry.label, world: entry.world || 'native',
            kind: entry.group || 'subject', summary: 'Public registered Atlas record',
            status: 'Registered record; playable scope not inferred', origin: 'native',
            href: '#creatures/kinds/' + encodeURIComponent(entry.id),
        });
    }
    return [...rows.values()];
}

export async function readFindSubjects({readers, library, books}) {
    const nativeRows = projectFindSubjects({library, books});
    const rows = new Map(nativeRows.map(row => [subjectKey(row), row]));
    let unreadable = 0;
    let files = 0;
    let names;
    try {
        names = (await readdir(readers)).filter(file => /^[a-z0-9_-]+\.json$/.test(file)).sort();
    } catch {
        return {rows: nativeRows, files, unreadable: 1};
    }
    // Read one admitted digest at a time. Keep only compact result fields in memory.
    for (const file of names) {
        try {
            const digest = JSON.parse(await readFile(join(readers, file), 'utf8'));
            for (const row of projectFindSubjects({digests: [digest]})) {
                rows.set(subjectKey(row), row);
            }
            files++;
        } catch {
            unreadable++;
        }
    }
    return {rows: [...rows.values()], files, unreadable};
}

const routeWorlds={village:'Village',lotm:'Lord of the Mysteries',paradise:'Reincarnation Paradise',worm:'Worm',sup:'Super Supportive',pr:'The Perfect Run',ri:'Reverend Insanity'};
// This consumes only the bounded public evidence projection. Receipt checking belongs
// to its loader, once on the lazy index build, never to a search keystroke.
export function projectFindRoutes(report) {
    return (report?.entries||[]).flatMap(entry=>{
        if(hidden(entry)||!safe(entry.id)||!safe(entry.title)||!safe(entry.where))return [];
        const world=/^#world\/([^/]+)\//.exec(entry.relatedHref||'')?.[1]||'village';
        const checked=entry.status==='verified',documented=entry.status==='documented';
        const comparisons=new Set((entry.receipts||[]).map(row=>row.buildComparison));
        const status=checked?'Verified receipts · '+(comparisons.has('different')?'tested on another build':comparisons.has('unavailable')?'checkout comparison unavailable':'exact checkout build'):
            documented?'Documented play route · authored record; see scope':'Evidence unavailable · documented directions; played result withheld';
        return [{id:entry.id,label:entry.title,world,worldLabel:routeWorlds[world]||world,type:'routes',kind:'Native OOPS route',
            summary:entry.where,status,href:'#workbench/play-evidence/'+encodeURIComponent(entry.id),
            terms:[entry.pov,routeWorlds[world],entry.setup,checked||documented?entry.outcome:'',
                entry.id==='tingen-klein'?'Klein Moretti':''].map(text).join(' ')}];
    });
}

export function buildFindIndex({subjects = [], rules = {records: [], worlds: []}, cheats = [], playEvidence} = {}) {
    const rows = subjects.map(row => ({...row, type: row.origin === 'reader-scene' ? 'scenes' : 'subjects'}));
    rows.push(...projectFindRoutes(playEvidence));
    for (const {id, label, status, summary, terms} of VISION_THEMES) {
        rows.push({id, label, status, summary, terms, type:'vision', kind:'Vision theme', world:'oops-vision',
            worldLabel:'OOPS vision', href:`#progress/vision/${id}`});
    }
    for (const rule of rules.records) {
        rows.push({
            id: rule.id, label: rule.name, world: rule.world, type: 'rules',
            kind: rule.sourceKind === 'interpretation' ? 'Interpretation / proposal' : 'Source paraphrase',
            summary: rule.statement,
            status: rule.implementation.state ? 'Recorded ledger: ' + rule.implementation.state :
                'No current playable proof checked',
            href: `#library/rules/${encodeURIComponent(rule.world)}/${rule.key}`,
            terms: [...rule.sources.books, ...rule.sources.locators].join(' '),
        });
    }
    for (const section of cheats) {
        for (const cheat of section.cheats || []) {
            const comparison = (section.examples || []).find(example =>
                /^(?:\*\*)?(CTC\d+)\b/.exec(example.ordinary)?.[1] === cheat.id);
            rows.push({
                id: cheat.id, label: cheat.name, world: 'cheat-catalogue', type: 'cheats',
                kind: section.name || 'Cheat design',
                summary: [cheat.effect, comparison?.advantage].filter(Boolean).join('. '),
                status: cheat.status || 'Design catalogue entry',
                href: '#library/cheats/' + cheat.id,
                terms: [cheat.backing, cheat.worlds, cheat.hooks, cheat.source,
                    comparison?.ordinary, comparison?.advantage, comparison?.evidence].map(text).join(' '),
            });
        }
    }
    const admitted = [];
    for (const row of rows) {
        if (hidden(row) || !safe(row.label) || !safe(row.id) || !safe(row.world)) continue;
        const search = normal((row.type === 'scenes' ? [row.id,row.label,row.terms] :
            [row.id, row.label, row.summary, row.world, row.kind, row.terms,riDatasets.includes(row.world)?'Reverend Insanity':'']).join(' '));
        const {terms, ...publicRow} = row;
        const summary = plain(row.summary);
        admitted.push({
            ...publicRow, search, labelSearch: normal(row.label),
            summary: row.type === 'rules' ? summary : row.type==='routes'&&summary.length>220 ? summary.slice(0,220).replace(/\s+\S*$/,'')+'…' : summary.slice(0, 220), status: plain(row.status),
        });
    }
    const worlds = [...new Set(admitted.map(row => row.world))].sort().map(id => ({
        id, label: id === 'cheat-catalogue' ? 'Cross-world cheat designs' :
            rules.worlds.find(world => world.id === id)?.label || admitted.find(row=>row.world===id&&row.worldLabel)?.worldLabel || id,
    }));
    return {rows: admitted, worlds:findWorldChoices(worlds)};
}

export function searchAtlas(index, {q = '', type = 'all', world = '', page = 1, limit = 8} = {}) {
    if (typeof q !== 'string' || q.length > 160 || (type !== 'all' && !FIND_GROUPS.some(group => group[0] === type)) ||
        !Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 20) {
        throw Error('Invalid Find query.');
    }
    q = q.trim();
    const query = normal(q);
    const words = query.split(/\s+/).filter(Boolean);
    const matches = [];
    const memberWorlds=index.worlds.find(choice=>choice.id===world)?.members||[world];
    if (words.length) {
        for (const row of index.rows) {
            if (type !== 'all' && row.type !== type) continue;
            if (world && !memberWorlds.includes(row.world)) continue;
            if (!words.every(word => row.search.includes(word))) continue;
            let score = words.filter(word => row.labelSearch.includes(word)).length * 20;
            if (normal(row.id) === query) score = 1000;
            else if (row.labelSearch === query) score = 900;
            else if (row.labelSearch.startsWith(query)) score = 800;
            matches.push({row, score});
        }
    }
    matches.sort((a, b) => b.score - a.score || a.row.label.localeCompare(b.row.label) ||
        a.row.world.localeCompare(b.row.world) || a.row.id.localeCompare(b.row.id));
    const groups = [];
    for (const [id, label] of FIND_GROUPS) {
        if (type !== 'all' && type !== id) continue;
        const all = matches.filter(match => match.row.type === id);
        const rows = all.slice((page - 1) * limit, page * limit).map(({row}) => {
            const {search, labelSearch, ...publicRow} = row;
            return publicRow;
        });
        groups.push({id, label, total: all.length, rows});
    }
    return {
        query: q, type, world, page, limit, total: matches.length, groups, worlds: index.worlds,
        pages: Math.max(1, ...groups.map(group => Math.ceil(group.total / limit))),
        scope: 'Search covers public subjects, places, recorded rules, cheat designs, reader scenes, playable route evidence and vision themes.',
    };
}
