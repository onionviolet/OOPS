// Source-game pages (YAIR upstream, Proto23, Arkivia), book scenes (O2), mechanic-first readiness (O3)
// and the progress overview (O1). All read the batch snapshot through /data; nothing here writes.
import {boxCanvas, element as el} from '/canvas.mjs';
import {libraryWorlds, progressRow, PROGRESS_GROUP, batchLine, worldTitle} from '/library-views.mjs';

const MAX = 72; // the canvas reads well up to about this many boxes
const people = {key: 'people', icon: 'person', label: 'People here'};
const shop = {key: 'shop', icon: 'storefront', label: 'Trader or shop'};
const act = {key: 'act', icon: 'directions_run', label: 'Activities'};
const foe = {key: 'foe', icon: 'pets', label: 'Enemies'};
const gather = {key: 'gather', icon: 'grass', label: 'Gathering'};
const craft = {key: 'craft', icon: 'construction', label: 'Crafting'};
const inside = {key: 'inside', icon: 'unfold_more', label: 'Has places inside'};
const SOURCE_MARKS = [people, shop, act, foe, gather, craft, inside];
const STATE_LABEL = {absorbed: 'In OOPS too', source: 'Only in the source game', added: 'Added by OOPS', region: 'Region'};

export const SOURCE_GAMES = {
    yair: {label: 'Yet Another Idle RPG (upstream)', note: 'Upstream geography from git, compared with what OOPS registers today'},
    proto23: {label: 'Proto23 (original)', note: 'The original single-file game, read statically; OOPS keeps its own Proto23 reference places separately'},
    arkivia: {label: 'Arkivia', note: 'Proto23-inspired browser RPG; OOPS takes ideas from it, not places'},
};

function grid(items, cols, dx = 210, dy = 96) {
    return items.map((it, i) => ({...it, x: (i % cols) * dx, y: Math.floor(i / cols) * dy}));
}
// Order boxes by a walk over their links, so neighbours sit near each other.
function walkOrder(ids, links) {
    const seen = new Set(), out = [];
    for (const start of ids) {
        if (seen.has(start)) continue;
        const queue = [start];
        seen.add(start);
        for (const id of queue) {
            out.push(id);
            for (const n of links.get(id) || []) if (ids.includes(n) && !seen.has(n)) {seen.add(n); queue.push(n);}
        }
    }
    return out;
}

export function sourceGamePage({main, controls, finder, list, button, closeCanvas, data, game, focus}) {
    main.replaceChildren();
    const src = data.sources?.[game], meta = SOURCE_GAMES[game];
    const bar = controls();
    if (!src) {bar.append(el('p', `No ${meta.label} extract in this checkout. Run node prototypes/world-atlas/build.mjs after the source is fetched.`)); return;}
    const places = [...src.places, ...(src.added || []).map(a => ({...a, state: 'added', routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: []}))];
    const group = (id, label) => ({id, label, state: 'region', routes: [], people: [], shops: [], activities: [], enemies: [], gather: [], craft: []});
    for (const r of src.regions || []) if (r?.id && !places.some(p => p.id === r.id)) places.push(group(r.id, r.label || r.id));
    // Sub-screens with no place of their own (difficulty pickers, dialogue pages) go in one box instead of the top level.
    const internal = places.filter(p => p.kind === 'internal' && !p.parent);
    if (internal.length) {places.push(group('group:internal', 'Internal screens')); for (const p of internal) p.parent = 'group:internal';}
    const byId = new Map(places.map(p => [p.id, p]));
    const kids = Map.groupBy(places.filter(p => p.parent && byId.has(p.parent)), p => p.parent);
    const top = id => {let p = byId.get(id), guard = 0; while (p?.parent && byId.has(p.parent) && p.parent !== focus && guard++ < 20) p = byId.get(p.parent); return p?.id;};
    const shown = (focus ? kids.get(focus) || [] : places.filter(p => !p.parent || !byId.has(p.parent)));
    const counts = Object.groupBy(src.places, p => p.state);
    bar.append(el('small', `${src.places.length} places in the source · ${counts.absorbed?.length || 0} also in OOPS · ${counts.source?.length || 0} only in the source` +
        (src.added?.length ? ` · ${src.added.length} added by OOPS on the Village walk` : '') + (src.gameOnly?.length ? ` · ${src.gameOnly.length} OOPS reference places with no source match` : '')));
    bar.append(el('small', 'Borders: green, also in OOPS · dashed blue, only in the source · violet, added by OOPS · gold, a region or group'));
    const open = id => sourceGamePage({main, controls, finder, list, button, closeCanvas, data, game, focus: id});
    if (focus) bar.append(button('Up one level', () => open(byId.get(focus)?.parent)));
    finder(bar, places, p => open(p.parent && byId.has(p.parent) ? p.parent : undefined));
    const ids = shown.map(p => p.id), set = new Set(ids);
    const links = new Map();
    const edgeKeys = new Set(), edges = [];
    for (const p of places) for (const r of p.routes || []) {
        const a = set.has(p.id) ? p.id : top(p.id), b = set.has(r.to) ? r.to : top(r.to);
        if (!a || !b || a === b || !set.has(a) || !set.has(b)) continue;
        (links.get(a) || links.set(a, []).get(a)).push(b);
        (links.get(b) || links.set(b, []).get(b)).push(a);
        const k = a + '>' + b;
        if (edgeKeys.has(k)) continue;
        edgeKeys.add(k);
        const back = edgeKeys.has(b + '>' + a);
        if (back) {const e = edges.find(x => x.from === b && x.to === a); if (e) e.both = true; continue;}
        edges.push({from: a, to: b});
    }
    const order = walkOrder(ids, links).slice(0, MAX);
    const nodes = grid(order.map(id => {
        const p = byId.get(id);
        const marks = [p.people?.length && people, p.shops?.length && shop, p.activities?.length && act, p.enemies?.length && foe, p.gather?.length && gather, p.craft?.length && craft, kids.has(id) && inside].filter(Boolean);
        return {id, label: p.label + (kids.has(id) ? ' · ' + kids.get(id).length : ''), w: 180, h: 54, group: p.state || 'source', marks};
    }), Math.ceil(Math.sqrt(order.length * 1.6)));
    const keep = new Set(order);
    const board = boxCanvas({parent: main, title: (focus ? byId.get(focus)?.label + ' · ' : '') + meta.label, nodes, kind: 'source',
        edges: edges.filter(e => keep.has(e.from) && keep.has(e.to)), marks: [...SOURCE_MARKS, {key: 'selected', label: 'Selected'}],
        captions: ids.length > MAX ? [{label: `${ids.length - MAX} more · search to reach them`, x: 0, y: -40}] : [], close: closeCanvas,
        select(id, side) {
            const p = byId.get(id);
            side.append(el('small', [p.kind, STATE_LABEL[p.state]].filter(Boolean).join(' · ')), el('h2', p.label));
            const facts = [`Source id: ${p.id}`, p.gameId ? `OOPS location: ${p.gameId}` : null, p.sourceLine ? `Source line: ${p.sourceLine}` : null,
                p.unlocked === false ? 'Locked at the start' : null].filter(Boolean);
            side.append(list(facts));
            if (kids.has(id)) side.append(button(`Open inside · ${kids.get(id).length} places`, () => open(id)));
            for (const [label, values] of [['People', p.people], ['Traders and shops', p.shops], ['Activities', p.activities], ['Enemies', p.enemies], ['Gathering', p.gather], ['Crafting', p.craft]]) {
                if (!values?.length) continue;
                const d = el('details'); d.open = values.length <= 8;
                d.append(el('summary', label + ' · ' + values.length), list(values.slice(0, 40)));
                side.append(d);
            }
            const out = (p.routes || []).filter(r => byId.has(r.to));
            if (out.length) {
                const d = el('details'); d.open = true;
                d.append(el('summary', 'Ways out · ' + out.length));
                for (const r of out.slice(0, 30)) {
                    const t = byId.get(r.to);
                    d.append(button(t.label + (r.minutes ? ' · ' + r.minutes + ' min' : r.distance ? ' · distance ' + r.distance : r.label ? ' · ' + r.label : ''), () => {
                        const parent = t.parent && byId.has(t.parent) ? t.parent : undefined;
                        if (parent === focus) board.select(t.id, true); else open(parent);
                    }));
                }
                side.append(d);
            }
        }});
    if (src.notes?.length) {
        const d = el('details', null, 'atlas-notes'); d.append(el('summary', 'Extractor notes · ' + src.notes.length), list(src.notes.slice(0, 20)));
        main.append(d);
    }
    if (src.gameOnly?.length) {
        const d = el('details', null, 'atlas-notes'); d.append(el('summary', 'OOPS places with no source match · ' + src.gameOnly.length), list(src.gameOnly.map(g => g.label + ' · ' + g.id)));
        main.append(d);
    }
}

// O2: book scenes anchored to places (beats, dated anchors, schedule slots, household acts) from the cast pack.
const SCENE_KIND = {beat: 'Story beat', anchor: 'Dated presence', schedule: 'Schedule slot', household: 'Household act'};
const sceneMarks = Object.entries(SCENE_KIND).map(([key, label], i) => ({key, label, icon: ['auto_stories', 'event', 'schedule', 'home'][i]}));
export function sceneList(p, list) {
    const d = el('details'); d.open = true;
    const by = Map.groupBy(p.scenes, s => s.kind);
    d.append(el('summary', 'Book scenes here · ' + p.scenes.length));
    for (const [kind, rows] of by) d.append(el('h4', SCENE_KIND[kind] + ' · ' + rows.length),
        list(rows.slice(0, 12).map(s => [s.day != null ? 'day ' + s.day : null, s.locator, s.id.split('.').at(-1).replace(/^cast-[0-9a-f]+/, '').replace(/^\W+/, '') || s.id].filter(Boolean).join(' · '))));
    return d;
}
export function scenesView({main, data, controls, finder, list, button, closeCanvas, worldId}) {
    main.replaceChildren();
    const cast = data.books?.[worldId], bar = controls();
    if (!cast) {bar.append(el('p', 'No cast pack for this world in this checkout.')); return;}
    const withScenes = cast.places.filter(p => p.scenes?.length).sort((a, b) => b.scenes.length - a.scenes.length);
    const total = withScenes.reduce((a, p) => a + p.scenes.length, 0);
    bar.append(el('small', `${total} book scenes at ${withScenes.length} of ${cast.places.length} places · generated near-detail scenes (scene layer) are not drawn: that layer has no runtime caller yet`));
    finder(bar, withScenes.map(p => ({...p, label: p.name})), p => board.select(p.id, true));
    const shown = withScenes.slice(0, MAX), names = new Map(cast.places.map(p => [p.id, p]));
    const nodes = grid(shown.map(p => ({id: p.id, label: `${p.name} · ${p.scenes.length}`, w: 190, h: 54, group: 'scenes',
        marks: sceneMarks.filter(m => p.scenes.some(s => s.kind === m.key))})), 6);
    const ids = new Set(shown.map(p => p.id));
    const edges = []; // a grid sorted by scene count; containment lives in the Places view
    void ids;
    const board = boxCanvas({parent: main, title: worldTitle(worldId) + ' · scenes by place', nodes, edges, kind: 'book', close: closeCanvas,
        captions: withScenes.length > MAX ? [{label: `${withScenes.length - MAX} more places with scenes · search to reach them`, x: 0, y: -40}] : [],
        marks: [...sceneMarks, {key: 'selected', label: 'Selected'}],
        select(id, side) {
            const p = names.get(id);
            side.append(el('small', 'Place' + (p.parent ? ' · inside ' + (names.get(p.parent)?.name || p.parent) : '')), el('h2', p.name));
            side.append(sceneList(p, list));
            side.append(button('Open in places', () => {location.hash = `world/${worldId}/places`;}));
        }});
}

// O3: start from a mechanic. Missing ones are the coverage ledgers' blocked slugs; running ones are named law owners.
export function mechanicsView({main, data, controls, finder, list, button, closeCanvas, mechanic}) {
    main.replaceChildren();
    const m = data.mechanics, bar = controls();
    if (!m) {bar.append(el('p', 'No mechanics projection in the snapshot.')); return;}
    const rows = m.mechanics, byId = new Map(rows.map(r => [r.id, r]));
    const law = rows.filter(r => r.kind === 'law'), missing = rows.filter(r => r.kind !== 'law');
    bar.append(el('small', `${missing.length} missing mechanisms (blocked slugs) · ${law.length} running law owners · from the coverage ledgers`));
    const open = id => mechanicsView({main, data, controls, finder, list, button, closeCanvas, mechanic: id});
    finder(bar, rows.map(r => ({...r, label: r.id})), r => open(r.id));
    const names = m.worldNames || {};
    const progressFor = id => (data.progress?.mechanics || []).find(p => p.laws?.includes(id));
    if (mechanic && byId.has(mechanic)) {
        bar.append(button('All mechanics', () => open()));
        const r = byId.get(mechanic);
        const worlds = r.worlds.slice(0, MAX - 1);
        const hub = {id: 'mech', label: r.id, w: 220, h: 60, x: 0, y: -130, group: r.kind === 'law' ? 'law' : 'missing-mech', marks: []};
        const nodes = [hub, ...grid(worlds.map(w => ({id: 'w:' + w.id, label: `${names[w.id] || w.id} · ${w.runs + w.expressed + w.blocked}`, w: 190, h: 50,
            group: w.runs ? 'law' : w.expressed ? 'partial' : 'missing-mech', marks: []})), 6).map(n => ({...n, x: n.x - 525}))];
        boxCanvas({parent: main, title: r.id, nodes, edges: worlds.map(w => ({from: 'mech', to: 'w:' + w.id})), kind: 'library', close: () => open(),
            marks: [{key: 'selected', label: 'Selected'}],
            select(id, side) {
                if (id === 'mech') {
                    side.append(el('small', r.kind === 'law' ? 'Running law owner' : 'Missing mechanism (blocked slug)'), el('h2', r.id),
                        list([`${r.total} ledger rows across ${r.worlds.length} worlds`, ...r.ledgers.slice(0, 6).map(([l, n]) => `${l} · ${n}`)]));
                    if (r.tests.length) side.append(el('h3', 'Tests'), list(r.tests));
                    const prog = progressFor(r.id);
                    if (prog) side.append(el('h3', 'Progress atlas (' + data.progress.snapshot + ')'), list(['built', 'proven', 'integrated', 'delivered'].map(k => `${k}: ${prog[k][0]}${prog[k][1] ? ' · ' + prog[k][1] : ''}`)));
                    if (r.kind !== 'law') side.append(el('p', 'Rows blocked on this mechanism wait for an engine owner; building it would unblock every world listed here.'));
                    return;
                }
                const w = r.worlds.find(x => 'w:' + x.id === id);
                side.append(el('small', 'World'), el('h2', names[w.id] || w.id),
                    list([`Runs: ${w.runs}`, `Expressed: ${w.expressed}`, `Blocked on this: ${w.blocked}`]));
            }});
        return;
    }
    const pick = [...law.slice(0, 18), ...missing.slice(0, MAX - Math.min(18, law.length))];
    const nodes = [...grid(law.slice(0, 18).map(r => ({id: r.id, label: `${r.id} · ${r.total}`, w: 200, h: 46, group: 'law', marks: progressFor(r.id) ? [{key: 'prog', icon: 'flag', label: 'In the progress atlas'}] : []})), 6),
        ...grid(missing.slice(0, MAX - 18).map(r => ({id: r.id, label: `${r.id} · ${r.total}`, w: 200, h: 46, group: 'missing-mech', marks: []})), 6).map(n => ({...n, y: n.y + 380}))];
    boxCanvas({parent: main, title: 'Mechanics', nodes, edges: [], kind: 'library', close: closeCanvas,
        captions: [{label: 'Running law owners', x: 0, y: -40}, {label: 'Missing mechanisms, by rows they block', x: 0, y: 340}],
        marks: [{key: 'prog', icon: 'flag', label: 'In the progress atlas'}, {key: 'selected', label: 'Selected'}],
        select(id, side) {
            const r = byId.get(id);
            side.append(el('small', r.kind === 'law' ? 'Running law owner' : 'Missing mechanism'), el('h2', r.id),
                list([`${r.total} rows · ${r.worlds.length} worlds`, 'Top: ' + r.worlds.slice(0, 4).map(w => names[w.id] || w.id).join(', ')]));
            side.append(button('Open mechanic', () => open(id)));
        }});
    void pick;
}

// O1 progress, two levels. Top: one box per lead world and mechanic, with built, proven, integrated and delivered
// as a compact readout. Open one: its sub-progress, from live projections (reading, batch, places, scenes, coverage
// laws) beside the progress atlas's own columns. Recorded columns carry their snapshot date; live parts are current.
const COLS = ['built', 'proven', 'integrated', 'delivered'];
const GLYPH = {yes: '●', partial: '◐', no: '○', unknown: '?', na: '–'};
const readout = r => COLS.map(c => c[0].toUpperCase() + GLYPH[r[c]?.[0] || 'unknown']).join(' ');
const weakest = r => {
    const states = COLS.map(c => r[c]?.[0] || 'unknown');
    return states.every(s => s === 'yes') ? 'reached' : states.includes('no') || states.includes('partial') ? 'partial' : 'unknown';
};
const stateOf = (yes, some) => yes ? 'reached' : some ? 'partial' : 'missing';

function worldParts(data, id) {
    const w = libraryWorlds(data).find(x => x.id === id);
    const cast = data.books?.[id];
    const batches = (data.batches || []).filter(b => w?.keys.includes(b.key));
    const sum = k => batches.reduce((a, b) => a + b[k], 0);
    const scenes = cast ? cast.places.reduce((a, p) => a + (p.scenes?.length || 0), 0) : 0;
    const walk = cast ? cast.places.filter(p => p.district).length : 0;
    const parts = [];
    if (w) parts.push(
        {id: 'held', group: 'Reading', label: `Held · ${w.held}/${w.keys.length}`, state: stateOf(w.held === w.keys.length, w.held), text: `${w.held} of ${w.keys.length} source files present`},
        {id: 'shards', group: 'Reading', label: `Prepared · ${w.shards} shards`, state: stateOf(w.shards > 0, false), text: `${w.shards} prepared shards`},
        {id: 'passes', group: 'Reading', label: `Read · ${Math.round(w.coverage * 100)}%`, state: stateOf(w.reached.read, w.coverage > 0), text: `${w.complete} of ${w.keys.length} keys through all five passes`},
        {id: 'batch', group: 'Reading', label: `Batch · ${sum('collected')}/${sum('plans')}`, state: batches.length ? stateOf(sum('collected') === sum('plans'), sum('collected')) : 'unknown', text: batchLine(data, w.keys)});
    if (cast) parts.push(
        {id: 'places', group: 'In the game', label: `Places · ${cast.places.length}`, state: 'reached', text: `${cast.places.length} cast-pack places`},
        {id: 'walk', group: 'In the game', label: walk ? `Walkable · ${walk}` : 'Walked by its host', state: walk ? stateOf(walk === cast.places.length, walk) : 'reached', text: walk ? `${walk} of ${cast.places.length} places on a walk` : 'This world walks through its own host'},
        {id: 'scenes', group: 'In the game', label: `Book scenes · ${scenes}`, state: stateOf(scenes > 0, false), text: `${scenes} beats, anchors, schedule slots and household acts tied to places`},
        {id: 'people', group: 'In the game', label: `People · ${cast.people.length}`, state: 'reached', text: `${cast.people.length} people in the cast pack`});
    else if (w?.located) parts.push({id: 'located', group: 'In the game', label: `Registered · ${w.located}`, state: 'reached', text: `${w.located} registered locations`});
    return parts;
}
function mechanicParts(data, row) {
    const parts = (row.parts || []).map(p => ({id: 'part:' + p.id, group: 'Parts', label: p.label, state: PROGRESS_GROUP[p.built?.[0] || 'unknown'],
        text: COLS.map(c => `${c}: ${p[c]?.[0] || 'unknown'}${p[c]?.[1] ? ' · ' + p[c][1] : ''}`).join('\n')}));
    for (const id of row.laws || []) {
        const m = data.mechanics?.mechanics.find(x => x.id === id);
        if (!m) {parts.push({id: 'law:' + id, group: 'Running laws', label: id, state: 'unknown', text: 'Not found in the coverage ledgers'}); continue;}
        const runs = m.worlds.reduce((a, w) => a + w.runs, 0), expressed = m.worlds.reduce((a, w) => a + w.expressed, 0);
        parts.push({id: 'law:' + id, group: 'Running laws', label: `${id} · ${runs} run`, state: stateOf(runs > 0, expressed > 0),
            text: `${runs} rows run and ${expressed} are expressed, across ${m.worlds.length} worlds. Tests: ${m.tests.slice(0, 4).join(', ') || 'none'}`, mechanic: id});
    }
    return parts;
}

export function progressView({main, data, controls, finder, list, button, closeCanvas, focus}) {
    main.replaceChildren();
    const bar = controls(), p = data.progress;
    if (!p) {bar.append(el('p', 'No progress atlas data. Run /progress-atlas; it writes docs/reports/progress-atlas-<date>.json.')); return;}
    const rows = [...p.worlds.map(w => ({...w, kind: 'world', label: worldTitle(w.id) + (w.lead ? ' · ' + w.lead : '')})), ...p.mechanics.map(m => ({...m, kind: 'mechanic'}))];
    const open = id => progressView({main, data, controls, finder, list, button, closeCanvas, focus: id});
    const legend = `● yes  ◐ partial  ○ no  ? unknown (hatched, not failed) · B built, P proven, I integrated, D delivered`;
    if (!focus) {
        bar.append(el('small', `Recorded columns from the ${p.snapshot} progress atlas (${p.commit}) · ${legend}`));
        const col = (list, x) => list.map((r, i) => ({id: r.id, label: `${r.label}   ${readout(r)}`, x, y: i * 76, w: 330, h: 54, group: weakest(r), marks: r.findings?.length ? [{key: 'finding', icon: 'flag', label: 'Has open findings'}] : []}));
        const nodes = [...col(rows.filter(r => r.kind === 'world'), 0), ...col(rows.filter(r => r.kind === 'mechanic'), 420)];
        boxCanvas({parent: main, title: 'Progress', nodes, edges: [], kind: 'library', close: closeCanvas,
            captions: [{label: 'Lead worlds', x: 0, y: -46}, {label: 'Mechanics', x: 420, y: -46}],
            marks: [{key: 'finding', icon: 'flag', label: 'Has open findings'}, {key: 'selected', label: 'Selected'}],
            select(id, side) {
                const r = rows.find(x => x.id === id);
                side.append(el('small', r.kind === 'world' ? 'Lead world' : 'Mechanic'), el('h2', r.label),
                    list(COLS.map(c => `${c}: ${r[c][0]}${r[c][1] ? ' · ' + r[c][1] : ''}`)));
                if (r.findings?.length) side.append(el('p', 'Findings: ' + r.findings.join(', ')));
                side.append(button('Open sub-progress', () => open(id)));
            }});
        return;
    }
    const r = rows.find(x => x.id === focus);
    bar.append(button('All progress', () => open()), el('small', `${legend} · recorded columns: ${p.snapshot}; parts marked live are computed now`));
    const parts = r.kind === 'world' ? worldParts(data, r.id) : mechanicParts(data, r);
    const recorded = COLS.map(c => ({id: 'col:' + c, group: 'Recorded (' + p.snapshot + ')', label: `${c[0].toUpperCase() + c.slice(1)} ${GLYPH[r[c][0]]}`, state: PROGRESS_GROUP[r[c][0]], text: r[c][1] || r[c][0]}));
    const groups = Map.groupBy([...recorded, ...parts], x => x.group);
    const nodes = [{id: 'head', label: r.label, x: -320, y: 0, w: 260, h: 60, group: weakest(r), marks: []}], edges = [], captions = [];
    let y = -((groups.size - 1) * 120) / 2;
    for (const [g, items] of groups) {
        captions.push({label: g.startsWith('Recorded') ? g : g === 'Parts' ? `Parts (named under Built, ${p.snapshot})` : g + ' · live', x: 0, y: y - 40});
        items.forEach((it, i) => nodes.push({id: it.id, label: it.label, x: i * 200, y, w: 180, h: 50, group: it.state, marks: []}));
        edges.push({from: 'head', to: items[0].id});
        items.slice(1).forEach((it, i) => edges.push({from: items[i].id, to: it.id}));
        y += 120;
    }
    const byId = new Map([...recorded, ...parts].map(x => [x.id, x]));
    boxCanvas({parent: main, title: r.label + ' · sub-progress', nodes, edges, captions, kind: 'library', close: () => open(),
        marks: [{key: 'selected', label: 'Selected'}],
        select(id, side) {
            if (id === 'head') {
                side.append(el('small', r.kind === 'world' ? 'Lead world' : 'Mechanic'), el('h2', r.label), list(COLS.map(c => `${c}: ${r[c][0]}`)));
                if (r.owner) side.append(el('p', 'Owner: ' + r.owner));
                if (r.findings?.length) side.append(el('p', 'Findings: ' + r.findings.join(', ')));
                if (r.kind === 'world') side.append(button('Open the world', () => {location.hash = 'world/' + r.id;}));
                return;
            }
            const it = byId.get(id);
            side.append(el('small', it.group), el('h2', it.label));
            for (const line of String(it.text).split('\n')) side.append(el('p', line));
            if (it.mechanic) side.append(button('Open mechanic', () => mechanicsView({main, data, controls, finder, list, button, closeCanvas, mechanic: it.mechanic})));
            if (r.kind === 'world' && ['held', 'shards', 'passes', 'batch'].includes(id)) side.append(button('Open reading lane', () => {location.hash = `world/${r.id}/reading`;}));
            if (r.kind === 'world' && ['places', 'walk', 'people'].includes(id)) side.append(button('Open places', () => {location.hash = `world/${r.id}/places`;}));
            if (id === 'scenes') side.append(button('Open scenes', () => {location.hash = `world/${r.id}/scenes`;}));
        }});
}
