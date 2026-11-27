// Library views: reading pipeline (O4), library shelves (O5) and mechanic readiness (O6).
// Read-only over counts; the one write is a reading request overlay sent to the dev server.
import {boxCanvas, element as el} from '/canvas.mjs';
import {appendTrackedReadings} from '/tracked-readings.mjs';
import {appendReadingReadiness} from '/reading-readiness-view.mjs';
import {registeredTravel} from '/registered-travel.mjs';

// Shelf membership follows the library build atlas table (LIBRARY_BUILD_ATLAS_2026-11-20.md).
// A world may sit on more than one shelf; shelves with no reading keys still show.
export const SHELVES = [
    {id: 'lead', label: 'Lead lives and everyday routines', worlds: ['lotm', 'ri', 'hp', 'mol']},
    {id: 'scenario', label: 'Scenario worlds, results and cheats', worlds: []},
    {id: 'powers', label: 'Powers, forms and encounters', worlds: ['worm', 'ss', 'coi', 'lotm', 'ri']},
    {id: 'institutions', label: 'Institutions, work and persistent places', worlds: ['asl', 'twi']},
    {id: 'making', label: 'Making, creatures and long play', worlds: ['ri', 'lotm']},
    {id: 'tabletop', label: 'Tabletop and modern-world procedures', worlds: []},
    {id: 'other', label: 'Other canon worlds and genre references', worlds: ['ttks1', 'ttks2', 'ttks3', 'ttks4', 'ttks5', 'yas', 'wus', 'gc', 'pr', 'sup', 'rtoc', 'motf', 'toa', 'rg', 'eld', 'stc', 'rak', 'pl', 'pge', 'wtc', 'mb', 'boc', 'sg', 'poa', 'mm', 'dc', 'dl', 'az', 'hwfwm', 'sth', 'vs', 'bdm', 'fod', 'rune', 'ark']},
];
const TITLES = {
    lotm: 'Lord of the Mysteries', ri: 'Reverend Insanity', hp: 'Harry Potter', mol: 'Mother of Learning', ss: 'Shadow Slave',
    coi: 'Circle of Inevitability', asl: 'A Soldier’s Life', worm: 'Worm', twi: 'The Wandering Inn',
    ttks1: 'Wizard, Hello, I’m an Imposter', ttks2: 'One Entry a Year, and a Simulated One Counts?', ttks3: 'Jujutsu Kaisen: Special-Grade Me Goes to Fight Sukuna',
    ttks4: 'Heir of All Humanity', ttks5: 'Wasteland Border Inspector', yas: 'You Are Summoned', wus: 'Wish Upon the Stars', gc: 'Godclads',
    pr: 'The Perfect Run', sup: 'Super Supportive', rtoc: 'A Regressor’s Tale of Cultivation', motf: 'Mark of the Fool', toa: 'Tree of Aeons',
    rg: 'The Legend of Randidly Ghosthound', eld: 'Elydes', stc: 'Street Cultivation', rak: 'The Books of the Raksura', pl: 'Pale Lights',
    pge: 'A Practical Guide to Evil', wtc: 'Worth the Candle', mb: '12 Miles Below', boc: 'Beware of Chicken', sg: 'The Stubborn Skill-Grinder in a Time Loop',
    poa: 'The Path of Ascension', mm: 'Mana Mirror', dc: 'Dungeon Core', dl: 'Dungeon Life', az: 'Azarinth Healer', hwfwm: 'He Who Fights with Monsters',
    sth: 'Small Town Hero', vs: 'Virtuous Sons', bdm: 'Beneath the Dragoneye Moons', fod: 'Forge of Destiny', rune: 'The Runesmith', ark: 'Ar’Kendrithyst',
};
// Where a world's reading reaches the game. Cast packs join by registry id; groups are registered locations.
// The key is also the atlas world id, so a reading world links straight to its world page.
const CONSUMERS = {lotm: {cast: 'lotm', group: 'Lord of the Mysteries'}, mol: {cast: 'mol', group: 'Mother of Learning'},
    hp: {group: 'Harry Potter'}, ri: {group: 'Reverend Insanity'}, ss: {group: 'Shadow Slave'}};
const worldLink = (w, button) => w.consumer ? button('Open ' + w.label + ' in Worlds', () => {location.hash = 'world/' + w.id;}) : null;
export const ASPECT_LABELS = {procedures: 'Procedures and crafts', generation: 'Generation and chance', progression: 'Learning and progression',
    institutions: 'Institutions and law', economy: 'Money and trade', knowledge: 'Knowledge and secrets', life: 'Daily life and travel', conflict: 'Harm, combat and healing'};
export const STAGES = [
    {key: 'held', label: 'Held'}, {key: 'prepared', label: 'Prepared'}, {key: 'read', label: 'Read, all five passes'},
    {key: 'consumer', label: 'Used by the game'}, {key: 'inGame', label: 'In the game'}, {key: 'walkable', label: 'Registered travel'},
];
// O1: the progress atlas's proof and delivery columns continue the lane. They come from the latest dated
// docs/reports/progress-atlas-*.json, so they are only as fresh as that run; a world it never covered is unknown, not failed.
export const PROGRESS_STAGES = [{key: 'proven', label: 'Proven'}, {key: 'delivered', label: 'Delivered'}];
export const PROGRESS_GROUP = {yes: 'reached', partial: 'partial', no: 'missing', unknown: 'unknown', na: 'unknown'};
export function progressRow(data, id, list = 'worlds') {
    const row = data.progress?.[list]?.find(w => w.id === id);
    const cell = k => row?.[k] ? {state: row[k][0], text: row[k][1]} : {state: 'unknown', text: data.progress ? 'Not covered by the ' + data.progress.snapshot + ' progress atlas' : 'No progress atlas data'};
    return {row, proven: cell('proven'), delivered: cell('delivered'), built: cell('built'), integrated: cell('integrated')};
}
export const batchLine = (data, keys) => {
    const rows = (data.batches || []).filter(b => keys.includes(b.key));
    if (!rows.length) return 'No batch plans';
    const sum = k => rows.reduce((a, r) => a + r[k], 0);
    return `Batch reading: ${sum('plans')} plans, ${sum('estimated')} estimated ($${Math.round(rows.reduce((a, r) => a + r.usdEstimate, 0) * 100) / 100}), ${sum('submitted')} submitted, ${sum('collected')} collected`;
};

export const worldTitle = id => TITLES[id] || id;

// One row per reading world: reading counts plus how far it reaches into the game.
export function libraryWorlds(data) {
    const keys = Map.groupBy(data.reading?.keys || [], k => k.world);
    const groupCounts = Map.groupBy(data.others || [], r => r.group);
    return [...keys].map(([id, rows]) => {
        const shards = rows.reduce((s, k) => s + k.shards, 0);
        const observedOutputFiles = rows.reduce((s,k)=>s+(k.observedOutputFiles||0),0);
        const passTotal = rows.reduce((s, k) => s + Object.values(k.passes).reduce((a, b) => a + b, 0), 0);
        const aspects = {};
        for (const k of rows) for (const [a, n] of Object.entries(k.aspects)) aspects[a] = (aspects[a] || 0) + n;
        const consumer = CONSUMERS[id] || null, cast = consumer?.cast && data.books?.[consumer.cast];
        const located = (groupCounts.get(consumer?.group) || []).length;
        const castPlaces = cast ? cast.places.length : 0;
        const measured=data.registeredTravel?.status==='measured'&&data.registeredTravel.worlds.find(row=>row.group===consumer?.group);
        const hostRoutes=id==='lotm'?(data.places||[]).map(p=>({id:p.name,group:consumer.group,routes:p.routes})):[];
        const travel=measured||registeredTravel([...(data.others||[]),...hostRoutes],[]).find(row=>row.group===consumer?.group)||{directedEdges:0,nativeEdges:0,relocationEdges:0,commands:0,places:0};
        const reached = {
            held: rows.some(k => k.held), prepared: shards > 0, read: rows.length > 0 && rows.every(k => k.complete),
            consumer: Boolean(consumer), inGame: castPlaces + located > 0, walkable: travel.directedEdges > 0,
        };
        const stop = STAGES.find(s => !reached[s.key])?.key || 'done';
        const readState = reached.read ? 'complete' : passTotal ? 'partial' : 'none';
        return {id, label: worldTitle(id), keys: rows.map(k => k.key), held: rows.filter(k => k.held).length, shards,
            complete: rows.filter(k => k.complete).length, coverage: shards ? passTotal / (shards * 5) : 0, rows: rows.reduce((s, k) => s + k.rows, 0),
            aspects, consumer, castPlaces, located,travel,
            reached, stop, readState,observedOutputFiles};
    }).sort((a, b) => a.label.localeCompare(b.label));
}

const pct = x => Math.round(x * 100) + '%';
const readMark = {key: 'partial', icon: 'hourglass_bottom', label: 'Partly read'};
const gameMark = {key: 'game', icon: 'sports_esports', label: 'Used by the game'};
const askedMark = {key: 'asked', icon: 'bookmark_added', label: 'Reading requested'};

function worldFacts(w, side, list, data) {
    side.append(list([
        `Reading keys: ${w.keys.length} (${w.held} locally held, ${w.complete} through all five passes)`,
        `Prepared shards: ${w.shards} · pass coverage ${pct(w.coverage)}`,
        `Observed output files: ${w.observedOutputFiles} · file presence does not establish reading coverage`,
        `Prepared-shard pointer rows: ${w.rows}`,
        batchLine(data, w.keys),
        w.consumer ? `In the game: ${w.castPlaces ? w.castPlaces + ' cast-pack places' : ''}${w.castPlaces && w.located ? ' · ' : ''}${w.located ? w.located + ' registered locations' : ''}` : 'No game consumer yet',
        travelSummary(w),
        w.castPlaces ? `${w.castPlaces} cast-place projections; place presence does not establish travel.` : null,
    ].filter(Boolean)));
    const observed = data.reading.keys.find(key=>key.world===w.id&&key.observedOutputFiles);
    if(observed){const inspect=el('a','Inspect available batch outputs');inspect.href='#library/outputs/'+encodeURIComponent(observed.key);side.append(inspect);}
    if(w.observedOutputFiles&&!w.shards)side.append(el('p','Outputs are present without local prepared text. Chapter-range and aspect coverage are not inferred from file presence.'));
}

function travelSummary(w){
    return w.travel.directedEdges ? `${w.travel.directedEdges} registered directed movement edges across ${w.travel.places} native locations · ${w.travel.nativeEdges} native connections · ${w.travel.relocationEdges} explicit relocation paths`
        : 'No registered travel edges in the available projection; this does not establish that travel is absent.';
}

function readingRanges(side, data, world) {
    appendReadingReadiness(side,world,el);
    const books = data.reading.keys.filter(book => book.world === world);
    const select = el('select');
    const label = el('label', 'Reading pass ');
    const summary = el('div');
    const findings = data.findings?.worlds?.find(row => row.world === world && row.read);
    for (const pass of data.reading.passes) select.append(new Option(pass, pass));
    label.append(select);
    side.append(label, summary);
    function show() {
        summary.replaceChildren();
        const pass = select.value;
        for (const book of books) {
            const inventory = el('a', 'Inspect batch outputs');
            inventory.href = '#library/outputs/' + encodeURIComponent(book.key);
            if (!book.shards) {
                const empty = el('p', book.key + ' · ' + (book.observedOutputFiles ? book.observedOutputFiles + ' output files observed · ' : '') + 'No prepared ranges · ');
                empty.append(inventory);
                summary.append(empty);
                continue;
            }
            const detail = el('details');
            detail.append(el('summary', book.key + ' · ' + book.passes[pass] + '/' + book.shards + ' ranges collected'));
            if (book.ranges?.length) {
                for (const complete of [false, true]) {
                    const ranges = book.ranges.filter(range => range.complete.includes(pass) === complete);
                    if (!ranges.length) continue;
                    const group = el('p', (complete ? 'Collected' : 'Awaiting output') + ' · chapters ');
                    ranges.forEach((range, index) => {
                        if (index) group.append(', ');
                        if (pass === 'scenes' && complete && findings?.sceneRanges?.includes(range.prefix)) {
                            const link = el('a', range.chapters);
                            link.href = '#world/' + world + '/reader-scenes/' + encodeURIComponent('shard:' + range.prefix);
                            group.append(link);
                        } else group.append(range.chapters);
                    });
                    detail.append(group);
                }
            } else detail.append(el('p', 'Refresh reading data for chapter ranges.'));
            detail.append(inventory);
            summary.append(detail);
        }
        if (findings) {
            let view = 'things', title = 'Explore collected records';
            if (pass === 'scenes' && findings.sceneIndex) {
                view = 'reader-scenes';
                title = 'Open collected scenes';
            } else if (pass === 'people' && findings.counts.people?.distinct) {
                view = 'people';
                title = 'Open people records';
            }
            const link = el('a', title);
            link.href = '#world/' + world + '/' + view;
            summary.append(link);
        }
    }
    select.addEventListener('change', show);
    show();
}

// O4: columns are the stage where each world's lane stops.
// fixed: shown inside a world page, so there is no way back to the all-worlds view here.
export function readingPipeline({main, data, controls, finder, list, button, closeCanvas, worldId, focus, fixed = false}) {
    main.replaceChildren();
    const worlds = libraryWorlds(data), byId = new Map(worlds.map(w => [w.id, w]));
    const bar = controls();
    const funnel = STAGES.map(s => `${worlds.filter(w => w.reached[s.key]).length} ${s.label.toLowerCase()}`).join(' · ');
    const findings = data.findings?.worlds;
    if (Array.isArray(findings)) {
        const indexed = findings.filter(row => row.read > 0);
        const total = indexed.reduce((n,row) => n + row.read,0);
        const selected = worldId && findings.find(row => row.world === worldId);
        const local = selected ? ` · ${worldTitle(worldId)}: ${selected.read.toLocaleString('en-US')}` : '';
        bar.append(el('p', `Indexed reading slices: ${total.toLocaleString('en-US')} across ${indexed.length} of ${worlds.length} worlds${local}`));
    }
    bar.append(el('small', `World counts by stage · ${funnel}`));
    if (worldId) appendTrackedReadings({parent: main, world: worldId, focus, element: el});
    const open = id => readingPipeline({main, data, controls, finder, list, button, closeCanvas, worldId: id, fixed});
    if (!fixed) finder(bar, worlds, w => open(w.id));
    if (worldId && byId.has(worldId)) {
        if (!fixed) bar.append(button('All reading worlds', () => open()));
        const w = byId.get(worldId);
        const prog = progressRow(data, w.id), lane = [...STAGES, ...PROGRESS_STAGES];
        const nodes = lane.map((s, i) => ({id: s.key, label: s.label, x: (i % 4) * 190, y: Math.floor(i / 4) * 110, w: 160, h: 50,
            group: prog[s.key] ? PROGRESS_GROUP[prog[s.key].state] : s.key === 'read' && w.readState === 'partial' ? 'partial' : w.reached[s.key] ? 'reached' : 'missing', marks: s.key === w.stop ? [{key: 'stop', icon: 'block', label: 'Lane stops here'}] : []}));
        const edges = lane.slice(1).map((s, i) => ({from: lane[i].key, to: s.key, kind: 'feeds'}));
        boxCanvas({parent: main, title: w.label, nodes, edges, kind: 'library', close: closeCanvas, initial: STAGES.some(s => s.key === w.stop) ? w.stop : 'walkable',
            marks: [{key: 'stop', icon: 'block', label: 'Lane stops here'}, {key: 'feeds', label: 'Feeds'}, {key: 'selected', label: 'Selected'}],
            select(id, side) {
                const s = lane.find(x => x.key === id);
                if (prog[id]) {
                    side.append(el('small', {yes: 'Reached', partial: 'Partly reached', no: 'Not reached', unknown: 'Unknown', na: 'Not applicable'}[prog[id].state]), el('h2', s.label), el('p', prog[id].text));
                    if (data.progress) side.append(el('p', `From the ${data.progress.snapshot} progress atlas (${data.progress.report}). Rerun /progress-atlas to refresh.`));
                    if (prog.row?.findings?.length) side.append(el('p', 'Findings: ' + prog.row.findings.join(', ')));
                    return;
                }
                const partial = id === 'read' && w.readState === 'partial';
                side.append(el('small', id==='walkable'?(w.reached.walkable?'Definitions available':'Not projected'):w.reached[id] ? 'Reached' : partial ? 'Partly read' : 'Not reached'), el('h2', s.label));
                const facts = {
                    held: `${w.held} of ${w.keys.length} source files present`,
                    prepared: `${w.shards} prepared shards`,
                    read: `${w.complete} of ${w.keys.length} keys through census, scenes, rules, people and texture · coverage ${pct(w.coverage)} · ${batchLine(data, w.keys)}`,
                    consumer: w.consumer ? `Feeds ${w.consumer.cast ? 'the ' + w.consumer.cast.toUpperCase() + ' cast pack and ' : ''}${w.consumer.group} locations` : 'No game system reads this world yet',
                    inGame: `${w.castPlaces} cast-place projections, ${w.located} registered native locations`,
                    walkable: travelSummary(w),
                }[id];
                side.append(el('p', facts));
                if (id === 'read') readingRanges(side, data, w.id);
                if (id === 'read' && data.findings?.worlds.some(world => world.world === w.id && world.read)) {
                    side.append(button('Open collected findings', () => {location.hash = `world/${w.id}/things`;}));
                }
                if (id === 'inGame' && w.consumer?.cast) side.append(button('Open places', () => {location.hash = `world/${w.id}/places`;}));
                if (id === 'inGame' && w.located) side.append(button('Open registered locations', () => {location.hash = `world/${w.id}/locations`;}));
                if (id === 'walkable') {
                    side.append(el('p','Registered definitions may be conditional, gated by the story, or use travel methods beyond walking. They do not establish current access or a played travel proof.'));
                    if(w.castPlaces)side.append(el('p',`${w.castPlaces} cast-place projections are listed separately; a district or host label is not an edge.`));
                    if(data.registeredTravel?.measuredAt)side.append(el('small','Definition projection: '+data.registeredTravel.measuredAt+' · '+data.registeredTravel.status));
                    if(w.located)side.append(button('Open registered locations',()=>{location.hash=`world/${w.id}/locations`;}));
                }
            }});
        return;
    }
    // Columns hold the worlds whose lane stops at each stage; long columns wrap at ten boxes.
    const columns = [...STAGES.map(s => s.key), 'done'].map(key => [key, worlds.filter(w => w.stop === key)]).filter(([, here]) => here.length);
    const nodes = [], captions = [];
    let x0 = 0;
    for (const [key, here] of columns) {
        const sub = Math.ceil(here.length / 10), label = key === 'done' ? 'Reaches every stage' : 'Stops at: ' + STAGES.find(s => s.key === key).label;
        captions.push({label: `${label} · ${here.length}`, x: x0 + (sub - 1) * 85, y: -40});
        here.forEach((w, i) => nodes.push({id: w.id, label: w.label, x: x0 + Math.floor(i / 10) * 170, y: (i % 10) * 54, w: 156, h: 42, group: w.readState,
            marks: [...(w.readState === 'partial' ? [readMark] : []), ...(w.consumer ? [gameMark] : [])]}));
        x0 += sub * 170 + 90;
    }
    boxCanvas({parent: main, title: 'Reading pipeline', nodes, edges: [], captions, kind: 'library', close: closeCanvas,
        marks: [readMark, gameMark, {key: 'selected', label: 'Selected'}],
        select(id, side) {
            const w = byId.get(id);
            side.append(el('small', w.stop === 'done' ? 'Reaches every stage' : 'Lane stops at: ' + STAGES.find(s => s.key === w.stop).label), el('h2', w.label));
            worldFacts(w, side, list, data);
            side.append(button('Open lane', () => open(id)));
            const link = worldLink(w, button);
            if (link) side.append(link);
        }});
}

// O5: shelves, then the worlds on a shelf coloured by reading state.
export function libraryShelves({main, data, controls, finder, list, button, closeCanvas, shelfId}) {
    main.replaceChildren();
    const worlds = libraryWorlds(data), byId = new Map(worlds.map(w => [w.id, w]));
    const shelved = new Set(SHELVES.flatMap(s => s.worlds));
    const shelves = [...SHELVES, {id: 'unshelved', label: 'Not on a shelf yet', worlds: worlds.map(w => w.id).filter(id => !shelved.has(id))}]
        .filter(s => s.id !== 'unshelved' || s.worlds.length);
    const bar = controls();
    bar.append(el('small', `${shelves.length} shelves · ${worlds.length} reading worlds · reading depth shown is extraction only (L1); L2 to L4 need a dossier`));
    const open = id => libraryShelves({main, data, controls, finder, list, button, closeCanvas, shelfId: id});
    finder(bar, worlds, w => open(shelves.find(s => s.worlds.includes(w.id))?.id));
    const marks = [readMark, gameMark, {key: 'contains', label: 'On this shelf'}, {key: 'selected', label: 'Selected'}];
    const shelf = shelves.find(s => s.id === shelfId);
    if (shelf) {
        bar.append(button('All shelves', () => open()));
        const rows = shelf.worlds.map(id => byId.get(id)).filter(Boolean);
        const cols = Math.max(3, Math.min(7, Math.ceil(Math.sqrt(rows.length * 1.8))));
        const nodes = [{id: 'shelf:' + shelf.id, label: shelf.label, x: 0, y: 0, w: 260, h: 46, group: 'shelf'},
            ...rows.map((w, i) => ({id: w.id, label: w.label, x: (i % cols) * 170 - (cols - 1) * 85, y: 100 + Math.floor(i / cols) * 66, w: 156, h: 44,
                group: w.readState, marks: [...(w.readState === 'partial' ? [readMark] : []), ...(w.consumer ? [gameMark] : [])]}))];
        const edges = rows.map(w => ({from: 'shelf:' + shelf.id, to: w.id, kind: 'contains'}));
        boxCanvas({parent: main, title: shelf.label, nodes, edges, marks, kind: 'library', close: closeCanvas,
            select(id, side) {
                if (id.startsWith('shelf:')) {
                    side.append(el('small', 'Shelf'), el('h2', shelf.label), el('p', rows.length
                        ? `${rows.filter(w => w.readState === 'complete').length} complete prepared-range coverage, ${rows.filter(w => w.readState === 'partial').length} partial, ${rows.filter(w => w.readState === 'none').length} without confirmed range coverage · ${rows.filter(w => w.consumer).length} used by the game`
                        : 'No reading keys yet. Holdings for this shelf are tracked in the library index.'));
                    return;
                }
                const w = byId.get(id);
                side.append(el('small', {complete: 'Prepared-range passes complete', partial: 'Partial prepared-range coverage',
                    none:w.shards?'Prepared, output coverage unconfirmed':w.observedOutputFiles?'Outputs present without prepared ranges':'No local prepared ranges'}[w.readState]), el('h2', w.label));
                worldFacts(w, side, list, data);
                const others = SHELVES.filter(s => s.id !== shelf.id && s.worlds.includes(id));
                if (others.length) side.append(el('p', 'Also on: ' + others.map(s => s.label).join(' · ')));
                const link = worldLink(w, button);
                if (link) side.append(link);
            }});
        return;
    }
    const cols = 4;
    const nodes = shelves.map((s, i) => {
        const rows = s.worlds.map(id => byId.get(id)).filter(Boolean);
        return {id: s.id, label: `${s.label} · ${rows.length}`, x: (i % cols) * 250, y: Math.floor(i / cols) * 90, w: 228, h: 56,
            group: rows.length ? (rows.every(w => w.readState === 'complete') ? 'complete' : rows.some(w => w.readState !== 'none') ? 'partial' : 'none') : 'empty',
            marks: rows.some(w => w.consumer) ? [gameMark] : []};
    });
    boxCanvas({parent: main, title: 'Library shelves', nodes, edges: [], marks, kind: 'library', close: closeCanvas,
        select(id, side) {
            const s = shelves.find(x => x.id === id), rows = s.worlds.map(w => byId.get(w)).filter(Boolean);
            side.append(el('small', 'Shelf'), el('h2', s.label));
            side.append(el('p', rows.length ? `${rows.length} reading worlds, ${rows.reduce((n, w) => n + w.keys.length, 0)} keys, ${rows.reduce((n, w) => n + w.shards, 0)} prepared shards`
                : 'No reading keys yet. Holdings for this shelf are tracked in the library index.'));
            if (rows.length) side.append(button('Open shelf', () => open(id)));
        }});
}

// O6: start from a mechanic aspect; a reading request is the writeback.
export function mechanicReadiness({main, data, controls, finder, list, button, closeCanvas, aspect}) {
    main.replaceChildren();
    const worlds = libraryWorlds(data);
    const aspects = data.reading?.aspects || [];
    const requests = data.readingRequests ||= [];
    const asked = (w, a) => requests.some(r => r.world === w && r.aspect === a);
    const bar = controls();
    const open = a => mechanicReadiness({main, data, controls, finder, list, button, closeCanvas, aspect: a});
    bar.append(el('small', `Start from a mechanic. Counts are keyword pointers in extracted rows, not findings. ${requests.length} reading requests saved.`));
    finder(bar, aspects.map(a => ({id: a, label: ASPECT_LABELS[a] || a})), r => open(r.id));
    const state = (w, a) => w.consumer ? (w.aspects[a] ? 'backed' : 'gap') : (w.aspects[a] ? 'unused' : 'none');
    const marks = [gameMark, askedMark, {key: 'contains', label: 'Has pointers'}, {key: 'selected', label: 'Selected'}];
    if (aspect && aspects.includes(aspect)) {
        bar.append(button('All mechanics', () => open()));
        const rows = worlds.filter(w => w.consumer || w.aspects[aspect]).sort((a, b) => (b.aspects[aspect] || 0) - (a.aspects[aspect] || 0)).slice(0, 48);
        const cols = Math.max(3, Math.min(7, Math.ceil(Math.sqrt(rows.length * 1.8))));
        const nodes = [{id: 'aspect', label: ASPECT_LABELS[aspect], x: 0, y: 0, w: 240, h: 46, group: 'aspect'},
            ...rows.map((w, i) => ({id: w.id, label: `${w.label} · ${w.aspects[aspect] || 0}`, x: (i % cols) * 170 - (cols - 1) * 85, y: 100 + Math.floor(i / cols) * 66,
                w: 156, h: 44, group: state(w, aspect), marks: [...(w.consumer ? [gameMark] : []), ...(asked(w.id, aspect) ? [askedMark] : [])]}))];
        const edges = rows.filter(w => w.aspects[aspect]).map(w => ({from: 'aspect', to: w.id, kind: 'contains'}));
        boxCanvas({parent: main, title: ASPECT_LABELS[aspect], nodes, edges, marks, kind: 'library', close: closeCanvas, initial: rows[0]?.id ?? 'aspect',
            select(id, side) {
                if (id === 'aspect') {
                    side.append(el('small', 'Mechanic'), el('h2', ASPECT_LABELS[aspect]),
                        el('p', `${rows.filter(w => state(w, aspect) === 'backed').length} worlds in the game with pointers · ${rows.filter(w => state(w, aspect) === 'gap').length} in the game without · ${rows.filter(w => state(w, aspect) === 'unused').length} with pointers but no game use yet`));
                    return;
                }
                const w = worlds.find(x => x.id === id), s = state(w, aspect);
                side.append(el('small', {backed: 'In the game, with source pointers', gap: 'In the game, no source pointers yet', unused: 'Source pointers, no game use yet', none: 'Nothing yet'}[s]), el('h2', w.label));
                side.append(el('p', `${w.aspects[aspect] || 0} rows point at ${ASPECT_LABELS[aspect].toLowerCase()}.`));
                worldFacts(w, side, list, data);
                const link = worldLink(w, button);
                if (link) side.append(link);
                const done = requests.filter(r => r.world === id && r.aspect === aspect);
                if (done.length) side.append(el('p', `Requested · ${done[0].route}: ${done[0].next}`));
                else {
                    const status = el('p');
                    side.append(button('Request reading for this mechanic', async () => {
                        const res = await fetch('/reading-request', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({world: id, aspect})});
                        if (!res.ok) {status.textContent = 'Not saved: ' + await res.text(); return;}
                        data.readingRequests = await res.json();
                        open(aspect);
                    }), status);
                }
            }});
        return;
    }
    const nodes = aspects.map((a, i) => {
        const backed = worlds.filter(w => state(w, a) === 'backed').length, gaps = worlds.filter(w => state(w, a) === 'gap').length;
        return {id: a, label: `${ASPECT_LABELS[a]} · ${backed} backed`, x: (i % 4) * 240, y: Math.floor(i / 4) * 90, w: 220, h: 54,
            group: gaps ? 'gap' : 'backed', marks: requests.some(r => r.aspect === a) ? [askedMark] : []};
    });
    boxCanvas({parent: main, title: 'Mechanic readiness', nodes, edges: [], marks, kind: 'library', close: closeCanvas,
        select(id, side) {
            const rows = worlds.filter(w => w.aspects[id]).sort((a, b) => b.aspects[id] - a.aspects[id]);
            side.append(el('small', 'Mechanic'), el('h2', ASPECT_LABELS[id]),
                el('p', `${rows.length} reading worlds have pointers; ${worlds.filter(w => state(w, id) === 'gap').length} game worlds have none.`),
                list(rows.slice(0, 6).map(w => `${w.label} · ${w.aspects[id]}${w.consumer ? ' · in the game' : ''}`)),
                button('Open mechanic', () => open(id)));
            const mine = requests.filter(r => r.aspect === id);
            if (mine.length) side.append(el('h3', 'Requests'), list(mine.map(r => `${worldTitle(r.world)} · ${r.route}`)));
        }});
}
