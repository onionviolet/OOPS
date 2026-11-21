// Library views: reading pipeline (O4), library shelves (O5) and mechanic readiness (O6).
// Read-only over counts; the one write is a reading request overlay sent to the dev server.
import {boxCanvas, element as el} from '/canvas.mjs';

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
    {key: 'consumer', label: 'Used by the game'}, {key: 'inGame', label: 'In the game'}, {key: 'walkable', label: 'Walkable'},
];

export const worldTitle = id => TITLES[id] || id;

// One row per reading world: reading counts plus how far it reaches into the game.
export function libraryWorlds(data) {
    const keys = Map.groupBy(data.reading?.keys || [], k => k.world);
    const groupCounts = Map.groupBy(data.others || [], r => r.group);
    return [...keys].map(([id, rows]) => {
        const shards = rows.reduce((s, k) => s + k.shards, 0);
        const passTotal = rows.reduce((s, k) => s + Object.values(k.passes).reduce((a, b) => a + b, 0), 0);
        const aspects = {};
        for (const k of rows) for (const [a, n] of Object.entries(k.aspects)) aspects[a] = (aspects[a] || 0) + n;
        const consumer = CONSUMERS[id] || null, cast = consumer?.cast && data.books?.[consumer.cast];
        const located = (groupCounts.get(consumer?.group) || []).length;
        const castPlaces = cast ? cast.places.length : 0;
        const onWalk = cast ? (cast.places.some(p => p.district) ? cast.places.filter(p => p.district).length : castPlaces) : 0;
        const reached = {
            held: rows.some(k => k.held), prepared: shards > 0, read: rows.length > 0 && rows.every(k => k.complete),
            consumer: Boolean(consumer), inGame: castPlaces + located > 0, walkable: onWalk > 0,
        };
        const stop = STAGES.find(s => !reached[s.key])?.key || 'done';
        const readState = reached.read ? 'complete' : passTotal ? 'partial' : 'none';
        return {id, label: worldTitle(id), keys: rows.map(k => k.key), held: rows.filter(k => k.held).length, shards,
            complete: rows.filter(k => k.complete).length, coverage: shards ? passTotal / (shards * 5) : 0, rows: rows.reduce((s, k) => s + k.rows, 0),
            aspects, consumer, castPlaces, located, onWalk, walkVia: cast && !cast.places.some(p => p.district) ? 'host' : 'districts',
            reached, stop, readState};
    }).sort((a, b) => a.label.localeCompare(b.label));
}

const pct = x => Math.round(x * 100) + '%';
const readMark = {key: 'partial', icon: 'hourglass_bottom', label: 'Partly read'};
const gameMark = {key: 'game', icon: 'sports_esports', label: 'Used by the game'};
const askedMark = {key: 'asked', icon: 'bookmark_added', label: 'Reading requested'};

function worldFacts(w, side, list) {
    side.append(list([
        `Reading keys: ${w.keys.length} (${w.held} held, ${w.complete} through all five passes)`,
        `Prepared shards: ${w.shards} · pass coverage ${pct(w.coverage)}`,
        `Extracted rows: ${w.rows}`,
        w.consumer ? `In the game: ${w.castPlaces ? w.castPlaces + ' cast-pack places' : ''}${w.castPlaces && w.located ? ' · ' : ''}${w.located ? w.located + ' registered locations' : ''}` : 'No game consumer yet',
        w.castPlaces ? (w.walkVia === 'host' ? 'Walked by its own host' : `${w.onWalk} places on a walk`) : null,
    ].filter(Boolean)));
}

// O4: columns are the stage where each world's lane stops.
// fixed: shown inside a world page, so there is no way back to the all-worlds view here.
export function readingPipeline({main, data, controls, finder, list, button, closeCanvas, worldId, fixed = false}) {
    main.replaceChildren();
    const worlds = libraryWorlds(data), byId = new Map(worlds.map(w => [w.id, w]));
    const bar = controls();
    const funnel = STAGES.map(s => `${worlds.filter(w => w.reached[s.key]).length} ${s.label.toLowerCase()}`).join(' → ');
    bar.append(el('small', `${worlds.length} reading worlds: ${funnel}`));
    const open = id => readingPipeline({main, data, controls, finder, list, button, closeCanvas, worldId: id, fixed});
    if (!fixed) finder(bar, worlds, w => open(w.id));
    if (worldId && byId.has(worldId)) {
        if (!fixed) bar.append(button('All reading worlds', () => open()));
        const w = byId.get(worldId);
        const nodes = STAGES.map((s, i) => ({id: s.key, label: s.label, x: i * 190, y: 0, w: 160, h: 50,
            group: w.reached[s.key] ? 'reached' : 'missing', marks: s.key === w.stop ? [{key: 'stop', icon: 'block', label: 'Lane stops here'}] : []}));
        const edges = STAGES.slice(1).map((s, i) => ({from: STAGES[i].key, to: s.key, kind: 'feeds'}));
        boxCanvas({parent: main, title: w.label, nodes, edges, kind: 'library', close: closeCanvas, initial: STAGES.some(s => s.key === w.stop) ? w.stop : 'walkable',
            marks: [{key: 'stop', icon: 'block', label: 'Lane stops here'}, {key: 'feeds', label: 'Feeds'}, {key: 'selected', label: 'Selected'}],
            select(id, side) {
                const s = STAGES.find(x => x.key === id);
                side.append(el('small', w.reached[id] ? 'Reached' : 'Not reached'), el('h2', s.label));
                const facts = {
                    held: `${w.held} of ${w.keys.length} source files present`,
                    prepared: `${w.shards} prepared shards`,
                    read: `${w.complete} of ${w.keys.length} keys through census, scenes, rules, people and texture · coverage ${pct(w.coverage)}`,
                    consumer: w.consumer ? `Feeds ${w.consumer.cast ? 'the ' + w.consumer.cast.toUpperCase() + ' cast pack and ' : ''}${w.consumer.group} locations` : 'No game system reads this world yet',
                    inGame: w.inGame ? `${w.castPlaces} cast-pack places, ${w.located} registered locations` : `${w.castPlaces + w.located} places in the game`,
                    walkable: w.walkVia === 'host' && w.castPlaces ? 'Walked by its own host' : `${w.onWalk} places on a walk`,
                }[id];
                side.append(el('p', facts));
                if (id === 'inGame' && w.consumer?.cast) side.append(button('Open places', () => {location.hash = `world/${w.id}/places`;}));
                if (id === 'inGame' && w.located) side.append(button('Open registered locations', () => {location.hash = `world/${w.id}/locations`;}));
                if (id === 'walkable' && !w.reached.walkable && w.consumer && !w.consumer.cast) side.append(el('p', 'Not established: these locations have no walk projection in the atlas yet.'));
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
            worldFacts(w, side, list);
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
                        ? `${rows.filter(w => w.readState === 'complete').length} read through, ${rows.filter(w => w.readState === 'partial').length} partly, ${rows.filter(w => w.readState === 'none').length} not read · ${rows.filter(w => w.consumer).length} used by the game`
                        : 'No reading keys yet. Holdings for this shelf are tracked in the library index.'));
                    return;
                }
                const w = byId.get(id);
                side.append(el('small', {complete: 'Read through', partial: 'Partly read', none: 'Prepared, not read'}[w.readState]), el('h2', w.label));
                worldFacts(w, side, list);
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
                worldFacts(w, side, list);
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
