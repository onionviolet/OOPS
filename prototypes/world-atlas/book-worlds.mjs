// Book worlds: containment canvas over the cast packs the game loads.
// Read-only. States come from pack fields: travel district and its provenance.
import {boxCanvas, element as el} from '/canvas.mjs';
import {sceneList} from '/atlas-views.mjs';
import {pickControl} from '/transfer-view.mjs';
import {readerDigest, inspectReaderPlace} from '/things-views.mjs';

const WORLD_NAMES = {lotm: 'Lord of the Mysteries', mol: 'Mother of Learning'};
const EVIDENCE = {T: 'Stated in text', S: 'Shown in a scene', I: 'Inferred', U: 'Unresolved'};
const MAX_SHOWN = 72;

export const bookMarks = [
    {key: 'walk', icon: 'directions_walk', label: 'Walkable · district from the book'},
    {key: 'fill', icon: 'help_outline', label: 'Walkable · provisional district'},
    {key: 'authored', icon: 'edit_location', label: 'Walkable · placed in the atlas'},
    {key: 'people', icon: 'group', label: 'People seen here'},
    {key: 'inside', icon: 'unfold_more', label: 'Has places inside'},
    {key: 'contains', label: 'Contains'},
    {key: 'selected', label: 'Selected'},
];

export function indexWorld(world) {
    const byId = new Map(world.places.map(p => [p.id, p]));
    const kids = Map.groupBy(world.places.filter(p => p.parent), p => p.parent);
    const sizes = new Map();
    const size = (id, seen = new Set()) => {
        if (sizes.has(id)) return sizes.get(id);
        if (seen.has(id)) return 0;
        seen.add(id);
        const n = 1 + (kids.get(id) || []).reduce((sum, k) => sum + size(k.id, seen), 0);
        sizes.set(id, n);
        return n;
    };
    for (const p of world.places) size(p.id);
    const people = new Map(world.people.map(p => [p.id, p]));
    return {world, byId, kids, size: id => sizes.get(id) || 1, people, usesDistricts: world.places.some(p => p.district)};
}

// Only a district the pack marks canon-derived counts as from the book; an authored
// district came from an atlas pick; fills and proposals without provenance are
// provisional. Packs with no districts walk elsewhere.
export function placeState(p, ix) {
    if (ix && !ix.usesDistricts) return 'host';
    if (!p.district) return 'unplaced';
    return p.provenance === 'canon-derived' ? 'walk' : p.provenance === 'authored' ? 'authored' : 'fill';
}

function marksFor(p, ix) {
    const marks = [];
    const state = placeState(p, ix);
    if (state === 'walk' || state === 'fill' || state === 'authored') marks.push(bookMarks.find(m => m.key === state));
    if (p.people.length) marks.push(bookMarks.find(m => m.key === 'people'));
    if (ix.kids.has(p.id)) marks.push(bookMarks.find(m => m.key === 'inside'));
    return marks;
}

const bucketId = kind => 'bucket:' + (kind || 'unknown');
const bucketLabel = kind => 'Loose ' + ({building: 'buildings', street: 'streets', region: 'regions', room: 'rooms', 'sub-place': 'sub-places'}[kind] || 'places');

// Children of the focus, or the world's top level grouped into buckets.
export function focusRows(ix, focus) {
    if (focus?.startsWith('bucket:')) {
        const kind = focus.slice(7);
        return ix.world.places.filter(p => !p.parent && !ix.kids.has(p.id) && (p.kind || 'unknown') === kind);
    }
    if (focus) return ix.kids.get(focus) || [];
    const roots = ix.world.places.filter(p => !p.parent);
    const nested = roots.filter(p => ix.kids.has(p.id));
    if (roots.length <= MAX_SHOWN) return roots;
    const loose = Map.groupBy(roots.filter(p => !ix.kids.has(p.id)), p => p.kind || 'unknown');
    return [...nested, ...[...loose].map(([kind, rows]) => ({
        id: bucketId(kind), name: bucketLabel(kind), bucket: rows.length, people: [], kind,
    }))];
}

export function bookDiagram(ix, focus) {
    const rows = focusRows(ix, focus).slice()
        .sort((a, b) => (b.bucket ?? ix.size(b.id)) - (a.bucket ?? ix.size(a.id)) || a.name.localeCompare(b.name));
    const shown = rows.slice(0, MAX_SHOWN);
    const columns = Math.max(3, Math.min(9, Math.ceil(Math.sqrt(shown.length * 1.8))));
    const head = focus && !focus.startsWith('bucket:') ? ix.byId.get(focus) : null;
    const top = head ? 1 : 0;
    const nodes = shown.map((p, i) => ({
        id: p.id, label: p.bucket ? p.name + ' · ' + p.bucket : p.name,
        x: (i % columns) * 150 - (columns - 1) * 75, y: (Math.floor(i / columns) + top) * 70 + (top ? 30 : 0),
        w: 136, h: 44, group: p.bucket ? 'bucket' : placeState(p, ix), marks: p.bucket ? [] : marksFor(p, ix),
    }));
    const edges = [];
    if (head) {
        nodes.unshift({id: head.id, label: head.name, x: 0, y: 0, w: 180, h: 46, group: placeState(head, ix), marks: marksFor(head, ix), current: false});
        for (const n of nodes.slice(1)) edges.push({from: head.id, to: n.id, kind: 'contains'});
    }
    return {nodes, edges, hidden: rows.length - shown.length};
}

// fixed: the shell already names the world, so the world tabs are left out.
// pick: the place to select once its parent is open (a search result).
export function bookWorlds({main, data, controls, finder, routeButtons, button, list, closeCanvas, worldId, focus, fixed = false, pick}) {
    main.replaceChildren();
    const worlds = Object.keys(data.books || {});
    const bar = controls();
    if (!worlds.length) {
        bar.append(el('p', 'No private cast packs are installed in this checkout.'));
        return;
    }
    const wid = worlds.includes(worldId) ? worldId : worlds[0];
    const ix = data.bookIndex[wid] ||= indexWorld(data.books[wid]);
    const open = (id, w = wid, target) => bookWorlds({main, data, controls, finder, routeButtons, button, list, closeCanvas, worldId: w, focus: id, fixed, pick: target});
    for (const w of fixed ? [] : worlds) {
        const tab = button(WORLD_NAMES[w] || w, () => open(undefined, w));
        tab.setAttribute('aria-pressed', String(w === wid));
        bar.append(tab);
    }
    const all = ix.world.places;
    const counts = {walk: 0, fill: 0, authored: 0, unplaced: 0, host: 0};
    for (const p of all) counts[placeState(p, ix)]++;
    bar.append(el('small', ix.usesDistricts
        ? `${all.length} cast-pack place records · ${counts.walk} in districts from the book${counts.authored ? ` · ${counts.authored} Atlas placements` : ''} · ${counts.fill} provisional districts · ${counts.unplaced} without a mapped route`
        : `${all.length} cast-pack place records · route definitions come from the world host`));
    const searchable = all.map(p => ({...p, label: p.name}));
    finder(bar, searchable, p => {
        const target = ix.byId.get(p.id);
        open(target.parent || undefined, wid, target.id);
    });

    const diagram = bookDiagram(ix, focus);
    const head = focus && ix.byId.get(focus);
    const title = head ? head.name : focus?.startsWith('bucket:') ? bucketLabel(focus.slice(7)) : WORLD_NAMES[wid] || wid;
    const captions = diagram.hidden ? [{label: diagram.hidden + ' more · search to reach them', x: 0, y: -40}] : [];
    boxCanvas({
        parent: main, title, nodes: diagram.nodes, edges: diagram.edges, marks: bookMarks, kind: 'book', captions,
        initial: [pick, focus].find(id => id && diagram.nodes.some(n => n.id === id)) || diagram.nodes[0]?.id, close: closeCanvas,
        select(id, side) {
            if (id.startsWith('bucket:')) {
                const rows = focusRows(ix, id);
                side.append(el('small', 'Group'), el('h2', bucketLabel(id.slice(7))),
                    el('p', rows.length + ' top-level places with nothing recorded inside them.'),
                    button('Open group', () => open(id)));
                return;
            }
            const p = ix.byId.get(id);
            const state = placeState(p, ix);
            const record = el('div');
            side.append(el('p',p.playStatus+' · '+p.playGap));
            side.append(record);
            const render = digest => {
                if (!record.isConnected) return;
                const reader = digest?.entities.find(e => e.col === 'places' && (e.id === p.indexId || e.id === p.id));
                record.replaceChildren();
                inspectReaderPlace(record, {...reader, id: reader?.id ?? p.id, label: p.name}, digest, wid, data, p);
            };
            render(null);
            readerDigest(wid).then(digest => {if (digest) render(digest);});
            const facts = el('details', null, 'canvas-facts');
            const rows = [
                ['Walk status', {walk: 'District from the book', fill: 'Provisional district', authored: 'Placed in the atlas', unplaced: 'No walk route yet', host: 'Handled by the world host'}[state]],
                ['Source evidence', p.evidence ? `${EVIDENCE[p.evidence] || p.evidence} (${p.evidence})` : null],
                ['First located', p.locator],
                ['Book id', p.indexId],
                ['Walk district', p.district ? p.district + (p.provenance ? ' · ' + p.provenance : '') : null],
                ['Lead knows it', p.known ? 'Yes, at the start' : null],
            ].filter(([, v]) => v);
            facts.append(el('summary', 'Map and source details'), list(rows.map(([k, v]) => k + ': ' + v)));
            side.append(facts);
            const parentPlace = p.parent && ix.byId.get(p.parent);
            if (parentPlace) side.append(el('h3', 'Inside'), routeButtons([{id: parentPlace.id, label: parentPlace.name, detail: parentPlace.kind || ''}], dest => open(ix.byId.get(dest).parent || undefined)));
            const inside = ix.kids.get(p.id) || [];
            if (inside.length && id !== focus) side.append(button(`Open inside · ${inside.length} places`, () => open(p.id)));
            if (p.scenes?.length) side.append(sceneList(p, list));
            if (ix.usesDistricts && state !== 'walk') side.append(pickControl(p, data));
        },
    });
}
