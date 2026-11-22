// What the batch readers found, drawn: Progress › Reader findings (one row per read world, one column per row
// family), a world's Things (census entities, abilities, laws, services), and its Making tree (inputs → working →
// products, from reader rules or the game's recipe book). Read-only; digests come from /readers/<world>.
import {boxCanvas, element as el} from '/canvas.mjs';
import {worldTitle} from '/library-views.mjs';

const MAX = 72;
const MAKING = ['craft', 'potion', 'rite', 'spell'];
const cache = new Map();
export async function readerDigest(world) {
    if (!cache.has(world)) cache.set(world, fetch('/readers/' + world).then(r => r.ok ? r.json() : null).catch(() => null));
    return cache.get(world);
}
function grid(items, cols, dx = 210, dy = 80, y0 = 0) {
    return items.map((it, i) => ({...it, x: (i % cols) * dx, y: y0 + Math.floor(i / cols) * dy}));
}
const tabs = (main, options, current, pick) => {
    const nav = el('nav', null, 'canvas-index');
    nav.setAttribute('aria-label', 'Kinds');
    for (const [id, label] of options) {
        const b = el('button', label); b.type = 'button'; b.onclick = () => pick(id);
        b.setAttribute('aria-pressed', String(id === current)); nav.append(b);
    }
    main.append(nav);
};

// Which row families the atlas draws for a world. Scenes reach the atlas only through a cast pack.
const drawn = (col, world, data) => col === 'scenes' ? !!data.books?.[world] : true;
const NOT_DRAWN = 'Not drawn anywhere yet: the people pass (relationships and standing), texture and rules "other" rows, and fills (authored proposals for gaps).';

export function findingsView({main, data, controls}) {
    main.replaceChildren();
    const f = data.findings, bar = controls();
    if (!f) {bar.append(el('p', 'No reader findings in the snapshot. Run node prototypes/world-atlas/build.mjs.')); return;}
    const read = f.worlds.filter(w => w.read), waiting = f.worlds.filter(w => !w.read);
    bar.append(el('small', `${read.length} read worlds with reader rows · ${waiting.length} planned with no rows yet (hatched) · counts are distinct after deduplication: one canonical file per shard and pass, then by id`));
    const article = el('article', null, 'sheet findings-sheet');
    article.append(el('h2', 'Reader findings'), el('p', 'Each cell is the number of distinct things the batch readers recorded. Green cells are drawn in the atlas (Things, Making, or scenes through a cast pack). Amber cells have rows the atlas does not draw. Hatched rows are planned books whose readers have not run.'));
    const table = el('table', null, 'findings-matrix'), head = el('tr');
    head.append(el('th', 'World'), el('th', 'Shards read'));
    for (const c of f.columns) head.append(el('th', c.label));
    const thead = el('thead'); thead.append(head); table.append(thead);
    const body = el('tbody');
    for (const w of [...read.sort((a, b) => b.read - a.read), ...waiting.sort((a, b) => b.planned - a.planned)]) {
        const tr = el('tr'); tr.dataset.state = w.read ? 'read' : 'none';
        const name = el('th'); name.scope = 'row';
        if (w.read) {const a = el('a', worldTitle(w.world)); a.href = '#world/' + w.world + '/things'; name.append(a);} else name.textContent = worldTitle(w.world);
        tr.append(name, el('td', w.read ? `${w.registryRead}${w.planned && w.registryRead < w.planned ? ' of ' + w.planned : ''}${w.extraSlices ? ' + ' + w.extraSlices + ' lead-run slices' : ''}` : `0 of ${w.planned}`));
        for (const c of f.columns) {
            const n = w.counts[c.id]?.distinct || 0, td = el('td', w.read ? String(n) : '');
            td.dataset.state = !w.read ? 'none' : !n ? 'empty' : drawn(c.id, w.world, data) ? 'drawn' : 'rows';
            td.title = `${c.label}: ${w.counts[c.id]?.rows || 0} rows, ${n} distinct`;
            tr.append(td);
        }
        body.append(tr);
    }
    table.append(body);
    const scroller = el('div', null, 'findings-scroll'); scroller.append(table);
    article.append(scroller, el('p', NOT_DRAWN));
    main.append(article);
}

function rulesFor(d, kinds) {return d.rules.filter(r => kinds ? kinds.includes(r.kind) : true);}
// Item index over a set of workings: who makes it, who uses it.
function itemIndex(rules, entities = []) {
    const known = new Map(entities.map(e => [e.id, e])), items = new Map();
    const get = x => items.get(x.id) || items.set(x.id, {id: x.id, label: x.label, matched: x.matched !== false, kind: known.get(x.id)?.kind, madeBy: [], usedIn: []}).get(x.id);
    for (const r of rules) {for (const x of r.inputs) get(x).usedIn.push(r.id); for (const x of r.products) get(x).madeBy.push(r.id);}
    return items;
}
const role = it => it.madeBy.length && it.usedIn.length ? 'intermediate' : it.madeBy.length ? 'product' : 'raw';
const ROLE_GROUP = {raw: 'source', intermediate: 'partial', product: 'reached'};
const ROLE_LABEL = {raw: 'Raw material: used, never made here', intermediate: 'Intermediate: made and used', product: 'Product: made, not used again'};
const ruleLine = r => [r.worldKind || r.kind, r.seen > 1 ? `seen in ${r.seen} slices` : null, r.locator].filter(Boolean).join(' · ');
function ruleFacts(r, list) {
    const amt = x => (x.qty != null ? x.qty + (x.unit ? ' ' + x.unit : '') + ' × ' : '') + x.label + (x.role && x.role !== 'main' ? ` (${x.role})` : '') + (x.matched === false ? ' · not in the census' : '');
    return list([
        `Kind: ${r.kind}${r.worldKind ? ' · ' + r.worldKind : ''}${r.category ? ' · ' + r.category : ''}`,
        r.inputs.length ? 'Takes: ' + r.inputs.map(amt).join(', ') : 'Takes: nothing recorded',
        r.products.length ? 'Makes: ' + r.products.map(amt).join(', ') : 'Makes: nothing recorded',
        r.costs?.length ? 'Costs: ' + r.costs.map(c => c.amount + ' ' + c.unit).join(', ') : null,
        r.minutes ? `Takes ${r.minutes} minutes` : null, r.ritual ? 'Needs a ritual' : null,
        r.steps ? `${r.steps} recorded steps` : null, r.who ? `${r.who} people seen doing it` : null,
        r.state ? {absorbed: 'In upstream YAIR and OOPS', added: 'Added by OOPS', source: 'Upstream only'}[r.state] : null,
        r.line ? `src/crafting_recipes.js line ${r.line}` : r.locator ? 'First locator: ' + r.locator : null,
    ].filter(Boolean));
}

// A world's Making tree. Overview: raw materials, intermediates and products ranked by how many workings touch them.
// Focus an item: workings that make it (left, with their inputs) and workings that use it (right, with their products).
export async function makingView(shared) {
    const {main, data, controls, finder, list, button, closeCanvas, worldId, game, focus, kind} = shared;
    main.replaceChildren();
    const bar = controls();
    let rules, entities = [], title, kinds;
    if (game) {
        if (!data.recipes) {bar.append(el('p', 'No recipe extract in the snapshot.')); return;}
        rules = data.recipes.recipes; title = game === 'yair' ? 'Upstream YAIR recipe book' : 'YAIR-format recipe book in OOPS (crafting_recipes.js)';
        if (game === 'yair') rules = rules.filter(r => r.state !== 'added');
        kinds = [...new Set(rules.map(r => r.kind))];
        bar.append(el('small', `${data.recipes.oops} OOPS recipes (component recipes count once per material) · ${data.recipes.upstream} upstream · ${data.recipes.recipes.filter(r => r.state === 'added').length} added by OOPS · read statically from ${data.recipes.source} · not drawn here: the making domain (craft_resolver, cast making), LOTM brewing and charms, HP brewing, Gu refinement, native material catalogues`));
    } else {
        const d = await readerDigest(worldId);
        if (!d) {bar.append(el('p', 'No reader digest for this world. Run node prototypes/world-atlas/build.mjs.')); return;}
        entities = d.entities; kinds = MAKING; title = worldTitle(worldId) + ' · making';
        rules = rulesFor(d, MAKING);
        const refs = rules.flatMap(r => [...r.inputs, ...r.products]);
        bar.append(el('small', `${rules.length} workings the readers recorded (crafts, potions, rites, spells) · ${rules.filter(r => r.inputs.length && r.products.length).length} name both inputs and products · ${Math.round(100 * refs.filter(x => x.matched).length / Math.max(1, refs.length))}% of their items match a census entry; the rest are hatched`));
    }
    const shown = kind ? rules.filter(r => r.kind === kind) : rules;
    const again = extra => makingView({...shared, ...extra});
    tabs(main, [[null, 'All · ' + rules.length], ...kinds.map(k => [k, `${k} · ${rules.filter(r => r.kind === k).length}`])], kind || null, k => again({kind: k, focus: null}));
    const items = itemIndex(shown, entities), ruleById = new Map(shown.map(r => [r.id, r]));
    finder(bar, [...items.values()].map(it => ({...it, label: it.label})), it => again({focus: it.id}));
    const itemBox = (it, extra = {}) => ({id: 'i:' + it.id, label: `${it.label} · ${it.madeBy.length}↑ ${it.usedIn.length}↓`, w: 200, h: 50,
        group: it.matched ? ROLE_GROUP[role(it)] : 'unknown', marks: [], ...extra});
    const ruleBox = (r, extra = {}) => ({id: 'r:' + r.id, label: r.name, w: 200, h: 50, group: game ? r.state : 'law', marks: [], ...extra});
    const inspect = (id, side, select) => {
        if (id.startsWith('r:')) {
            const r = ruleById.get(id.slice(2));
            side.append(el('small', 'Working'), el('h2', r.name), ruleFacts(r, list));
            for (const x of [...r.inputs, ...r.products]) side.append(button('Center on ' + x.label, () => again({focus: x.id})));
            return;
        }
        const it = items.get(id.slice(2));
        side.append(el('small', it.matched ? ROLE_LABEL[role(it)] : 'Not in the census: the readers named it only inside a working'), el('h2', it.label),
            list([`${it.madeBy.length} workings make it`, `${it.usedIn.length} workings use it`, it.kind ? 'Census kind: ' + it.kind : null, 'Id: ' + it.id].filter(Boolean)));
        if (focus !== it.id) side.append(button('Center the tree here', () => again({focus: it.id})));
        void select;
    };
    if (focus && items.has(focus)) {
        bar.append(button('All materials', () => again({focus: null})));
        const it = items.get(focus), nodes = [itemBox(it, {x: 0, y: 0, w: 240, h: 60})], edges = [], seen = new Set(['i:' + focus]);
        const add = n => {if (!seen.has(n.id)) {seen.add(n.id); nodes.push(n);}};
        const side = (ids, dir) => {
            const rs = ids.slice(0, 8).map(id => ruleById.get(id));
            let y = -((rs.length - 1) * 70) / 2;
            for (const r of rs) {
                add(ruleBox(r, {x: dir * 440, y}));
                edges.push(dir < 0 ? {from: 'r:' + r.id, to: 'i:' + focus} : {from: 'i:' + focus, to: 'r:' + r.id});
                const next = (dir < 0 ? r.inputs : r.products).filter(x => x.id !== focus).slice(0, 4);
                next.forEach((x, i) => {
                    add(itemBox(items.get(x.id), {x: dir * 880, y: y + (i - (next.length - 1) / 2) * 56, w: 190, h: 46}));
                    edges.push(dir < 0 ? {from: 'i:' + x.id, to: 'r:' + r.id} : {from: 'r:' + r.id, to: 'i:' + x.id});
                });
                y += Math.max(70, next.length * 56 + 14);
            }
            return rs.length < ids.length ? ids.length - rs.length : 0;
        };
        const moreL = side(it.madeBy, -1), moreR = side(it.usedIn, 1);
        const captions = [{label: 'What makes it, from what', x: -660, y: -60 - it.madeBy.slice(0, 8).length * 36}, {label: 'What it goes into, making what', x: 660, y: -60 - it.usedIn.slice(0, 8).length * 36}];
        if (moreL || moreR) captions.push({label: [moreL && `${moreL} more makers`, moreR && `${moreR} more uses`].filter(Boolean).join(' · ') + ' not drawn', x: 0, y: 90});
        boxCanvas({parent: main, title: it.label + ' · making tree', nodes, edges, captions, kind: 'library', initial: 'i:' + focus, close: () => again({focus: null}),
            marks: [{key: 'selected', label: 'Selected'}], select: inspect});
        return;
    }
    const all = [...items.values()];
    const rank = (r, key) => all.filter(it => role(it) === r).sort((a, b) => b[key].length - a[key].length || b.madeBy.length + b.usedIn.length - a.madeBy.length - a.usedIn.length);
    const raw = rank('raw', 'usedIn'), mid = rank('intermediate', 'usedIn'), prod = rank('product', 'madeBy');
    const per = 24, nodes = [
        ...grid(raw.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 0),
        ...grid(mid.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 360),
        ...grid(prod.slice(0, per).map(it => itemBox(it)), 6, 210, 70, 720)];
    const captions = [{label: `Raw materials · ${raw.length} (most used first)`, x: 0, y: -46}, {label: `Intermediates · ${mid.length}`, x: 0, y: 314}, {label: `Products · ${prod.length} (most often made first)`, x: 0, y: 674}];
    boxCanvas({parent: main, title, nodes, edges: [], captions, kind: 'library', close: closeCanvas,
        marks: [{key: 'selected', label: 'Selected'}], select: inspect});
}

// A world's Things: census entities by kind, rule families as lists, and services, customs and news.
const ENTITY_TABS = ['items', 'creatures', 'groups', 'people', 'places', 'documents', 'money', 'time'];
const TAB_LABEL = {items: 'Items and materials', creatures: 'Creatures', groups: 'Groups and gods', people: 'People', places: 'Places', documents: 'Documents',
    money: 'Prices and measures', time: 'Clocks and calendars', abilities: 'Abilities', order: 'Laws and institutions', life: 'Services, customs, news'};
export async function thingsView(shared) {
    const {main, controls, finder, list, button, closeCanvas, worldId, tab = 'items', focus} = shared;
    main.replaceChildren();
    const bar = controls(), d = await readerDigest(worldId);
    if (!d) {bar.append(el('p', 'No reader rows for this world yet. Its readers have not run, or the snapshot is older than the build.')); return;}
    const again = extra => thingsView({...shared, ...extra});
    tabs(main, [...ENTITY_TABS, 'abilities', 'order', 'life'].filter(t => d.counts[t]?.distinct).map(t => [t, `${TAB_LABEL[t]} · ${d.counts[t].distinct}`]), tab, t => again({tab: t, focus: null}));
    bar.append(el('small', `${d.shards} shards read · distinct records after deduplication by id · ranked by how many slices mention them`));
    const making = rulesFor(d, MAKING), uses = itemIndex(making, d.entities);
    if (tab === 'life') {
        const article = el('article', null, 'sheet');
        for (const [k, rows] of Map.groupBy(d.life, r => r.kind)) {
            const det = el('details'); det.open = true;
            det.append(el('summary', `${{services: 'Services', customs: 'Customs', news: 'News'}[k] || k} · ${rows.length}`), list(rows.slice(0, 150).map(r => r.what + (r.at ? ' · ' + r.at : ''))));
            if (rows.length > 150) det.append(el('small', `${rows.length - 150} more not listed`));
            article.append(det);
        }
        main.append(article);
        return;
    }
    if (tab === 'abilities' || tab === 'order') {
        const rows = d.rules.filter(r => r.col === tab), byId = new Map(rows.map(r => [r.id, r]));
        finder(bar, rows.map(r => ({...r, label: r.name})), r => board.select(r.id, true));
        const nodes = grid(rows.slice(0, MAX).map(r => ({id: r.id, label: r.name, w: 200, h: 50, group: 'law', marks: []})), 6);
        const board = boxCanvas({parent: main, title: worldTitle(worldId) + ' · ' + TAB_LABEL[tab], nodes, edges: [], kind: 'library', close: closeCanvas,
            captions: rows.length > MAX ? [{label: `${rows.length - MAX} more · search to reach them`, x: 0, y: -40}] : [],
            marks: [{key: 'selected', label: 'Selected'}],
            select(id, side) {const r = byId.get(id); side.append(el('small', ruleLine(r)), el('h2', r.name), ruleFacts(r, list));}});
        return;
    }
    const rows = d.entities.filter(e => e.col === tab), byId = new Map(rows.map(e => [e.id, e]));
    const pick = focus && byId.has(focus) ? [byId.get(focus), ...rows.filter(e => e.id !== focus)] : rows;
    finder(bar, rows, e => again({focus: e.id}));
    const craftMark = {key: 'craft', icon: 'construction', label: 'Used or made in a working'}, leadMark = {key: 'lead', icon: 'person', label: 'The lead meets it'};
    const nodes = grid(pick.slice(0, MAX).map(e => ({id: e.id, label: `${e.label} · ${e.seen}`, w: 200, h: 50, group: e.lead ? 'reached' : 'registered',
        marks: [uses.has(e.id) && craftMark, e.lead && leadMark].filter(Boolean)})), 6);
    boxCanvas({parent: main, title: worldTitle(worldId) + ' · ' + TAB_LABEL[tab], nodes, edges: [], kind: 'library', initial: focus || undefined, close: closeCanvas,
        captions: rows.length > MAX ? [{label: `${rows.length - MAX} more · search to reach them`, x: 0, y: -40}] : [],
        marks: [craftMark, leadMark, {key: 'selected', label: 'Selected'}],
        select(id, side) {
            const e = byId.get(id), u = uses.get(id);
            side.append(el('small', `${e.kind}${e.lead ? ' · the lead meets it' : ''}`), el('h2', e.label),
                list([`Mentioned in ${e.seen} slices`, e.first ? 'First mention: ' + e.first : null, e.aliases?.length ? 'Also called: ' + e.aliases.join(', ') : null,
                    e.places?.length ? 'Seen at: ' + e.places.join(', ') : null, 'Id: ' + e.id].filter(Boolean)));
            if (u) {
                side.append(el('h3', 'In workings'), list([...u.madeBy.map(r => 'Made by ' + making.find(x => x.id === r)?.name), ...u.usedIn.map(r => 'Used in ' + making.find(x => x.id === r)?.name)].slice(0, 12)));
                side.append(button('Open its making tree', () => {location.hash = `world/${worldId}/making/${encodeURIComponent(id)}`;}));
            }
        }});
}
