// Whole-UI directions gallery (docs/audits/UI_DIRECTIONS_2026-10-30.md). Four static mocks of one game state:
// A panels refined, B day hub, C task-first, D desk (diegetic). Proposals only (AD32); no live shell file is imported.
// Same fixture, same builders, and the figure and scene card primitives where they fit. Drawn at 1920x1080.
import {applyCustomizationProfile, defaultCustomizationState} from '../../customization_profiles.js';
import {renderSceneCard, pickCurrentScene} from '../scene_card.js';
import {renderFigure} from '../figure.js';
import {FIXTURES, HUBS, ROUTES, COUNTS, VIEWS} from './fixtures/ui_directions.js';

export const DIRECTIONS = [
    {id: 'a', title: 'A. Panels, refined', tag: 'Lowest cost: today\'s workspace, six hubs, a next-step band and a return note.'},
    {id: 'b', title: 'B. Day hub', tag: 'Open on today: what is due, who wants you, one suggested move; drill in from there.'},
    {id: 'c', title: 'C. Task-first', tag: 'Verbs and search lead; views open on demand beside a short list of suggestions.'},
    {id: 'd', title: 'D. The desk', tag: 'Diegetic: notebook, map table and satchel; the world re-skins the desk.'},
];

const el = (tag, attrs = {}, text = '') => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
const add = (parent, ...kids) => { for (const k of kids) if (k) parent.append(k); return parent; };
const bar = (cur, max, kind) => { const b = el('div', {class: `ud-bar ud-bar-${kind}`, role: 'img', 'aria-label': `${cur} of ${max}`}); const i = el('i'); i.style.width = `${Math.round(100 * cur / max)}%`; b.append(i); return b; };
const panel = (title, kids, cls = '') => { const p = el('section', {class: `ud-panel ${cls}`}); const h = el('header'); add(h, el('strong', {}, title.name || title), title.meta ? el('span', {class: 'ud-meta'}, title.meta) : null); p.append(h); add(p, ...[].concat(kids)); return p; };
const rows = (items, fn) => { const ul = el('ul', {class: 'ud-rows'}); for (const it of items) { const li = el('li'); fn(li, it); ul.append(li); } return ul; };
const chip = (text, cls = '') => el('span', {class: `ud-chip ${cls}`}, text);
const btn = (text, cls = '') => el('button', {type: 'button', class: `ud-btn ${cls}`}, text);

function header(fx) {
    const h = el('div', {class: 'ud-header'});
    add(h, el('strong', {}, fx.place), el('span', {}, fx.weather), el('span', {}, fx.clock));
    return h;
}
function vitals(fx) {
    const v = fx.vitals, box = el('div', {class: 'ud-vitals'});
    add(box, el('p', {}, `You · Lv ${v.level}`), bar(v.xp[0], v.xp[1], 'xp'), el('small', {}, `${v.xp[0]} / ${v.xp[1]} xp`),
        bar(v.stamina[0], v.stamina[1], 'sta'), el('small', {}, `${v.stamina[0]}/${v.stamina[1]} stamina`), bar(v.hp[0], v.hp[1], 'hp'), el('small', {}, `${v.hp[0]}/${v.hp[1]} hp`));
    return box;
}
function actionRow(a, withTime = true) {
    const li = el('div', {class: `ud-action${a.blocked ? ' is-blocked' : ''}${a.pick ? ' is-pick' : ''}`});
    add(li, btn(a.label), withTime && (a.time || a.cost) ? el('small', {class: 'ud-quote'}, [a.time, a.cost].filter(Boolean).join(' · ')) : null, a.blocked ? el('small', {class: 'ud-blocked', 'data-reason': ''}, a.blocked) : null);
    return li;
}
function nextStepBand(fx) {
    const b = el('div', {class: 'ud-nextstep', 'data-next-step': ''});
    add(b, el('strong', {}, 'Next step'), el('span', {}, fx.nextStep.text), el('small', {}, fx.nextStep.how), btn('Show me'));
    return b;
}
function reportsPanel(fx, withNote) {
    const kids = [];
    if (withNote) kids.push(el('p', {class: 'ud-returnnote', 'data-return-note': ''}, fx.returnNote));
    kids.push(rows(fx.reports, (li, r) => li.append(el('span', {}, r))));
    return panel({name: 'Reports', meta: 'latest'}, kids, 'ud-reports');
}
function peopleList(fx, withWant = true) {
    return rows(fx.people, (li, p) => add(li, btn(p.name), el('small', {}, p.role), withWant && p.want ? chip(p.want, 'ud-want') : null));
}
function itemsList(fx) {
    return rows(fx.items, (li, i) => add(li, el('span', {}, `${i.name} x${i.count}`), el('small', {}, i.value)));
}

// A. Panels refined: today's workspace layout with six hubs instead of 13 routes plus a 56-entry list.
function buildA(fx, root) {
    const top = el('nav', {class: 'ud-nav', 'aria-label': 'Hubs'});
    for (const h of HUBS) { const b = btn(h.label, h.id === 'work' ? 'is-on' : ''); if (fx.discoveryDots.some(d => h.routes.includes(d))) b.append(el('i', {class: 'ud-dot', title: 'New here'})); top.append(b); }
    add(top, el('span', {class: 'ud-spacer'}), btn('Ctrl+K Jump'), btn('Layout'));
    const grid = el('div', {class: 'ud-grid-a'});
    const left = el('div', {class: 'ud-col'}), mid = el('div', {class: 'ud-col'}), right = el('div', {class: 'ud-col'});
    add(left, panel({name: 'You', meta: 'Stats & equipment'}, [vitals(fx), rows(fx.stats.slice(0, 4), (li, s) => add(li, el('span', {}, s[0]), el('b', {}, s[1])))]),
        panel({name: 'Around you', meta: `${fx.people.length} people · ${fx.services.length} places`}, [peopleList(fx, false), rows(fx.services.slice(0, 3), (li, s) => add(li, btn(s.name)))]));
    add(mid, nextStepBand(fx), panel({name: 'Local actions', meta: `${fx.actions.length} options`}, rows(fx.actions, (li, a) => li.append(actionRow(a)))),
        panel({name: 'Scene', meta: fx.place}, el('p', {class: 'ud-prose'}, 'Daylight falls across the path. Choose someone or something here to inspect.')));
    add(right, reportsPanel(fx, true), panel({name: 'Belongings', meta: fx.money}, itemsList(fx)), panel({name: 'Journal', meta: 'pinned'}, rows(fx.agenda.slice(0, 2), (li, a) => add(li, el('b', {}, a.at), el('span', {}, a.text)))));
    add(grid, left, mid, right); add(root, header(fx), top, grid);
}

// B. Day hub: one threshold page built from the scene card, the agenda, who wants you and the return note.
function buildB(fx, root) {
    const rail = el('aside', {class: 'ud-rail'});
    add(rail, vitals(fx), el('p', {class: 'ud-label'}, 'Hubs'), ...HUBS.map(h => btn(h.label, h.id === 'work' ? 'is-on' : '')));
    const page = el('main', {class: 'ud-day'});
    add(page, el('h2', {}, `Today · ${fx.clock.split(',')[0]}`), el('p', {class: 'ud-returnnote', 'data-return-note': ''}, fx.returnNote));
    const cardHost = el('div', {class: 'ud-scene'});
    const scene = {kind: 'day-hub', id: `day-${fx.id}`, header: {lead: 'Suggested', place: fx.place, title: fx.nextStep.text}, stakes: fx.nextStep.how,
        people: fx.people.slice(0, 2).map(p => ({id: p.id, name: p.name})),
        options: fx.actions.slice(0, 3).map(a => ({id: a.id, label: a.label, time: a.time, cost: a.cost, blocked: a.blocked})),
        onward: [{label: 'Everything else', time: '5 actions'}]};
    renderSceneCard(cardHost, pickCurrentScene([scene]).current);
    const agenda = panel({name: 'Due today', meta: `${fx.agenda.length}`}, rows(fx.agenda, (li, a) => { li.dataset.state = a.state; add(li, el('b', {}, a.at), el('span', {}, a.text)); }));
    const who = panel({name: 'Who wants you'}, peopleList(fx));
    const reports = reportsPanel(fx, false);
    const cols = el('div', {class: 'ud-two'}); add(cols, agenda, who);
    add(page, cardHost, cols, panel({name: 'Drill in', meta: 'opens as a drawer'}, add(el('div', {class: 'ud-chips'}), ...['Stats', 'Belongings', 'People', 'Journal', 'Map', 'Settings'].map(t => chip(t)))));
    const side = el('aside', {class: 'ud-side'}); add(side, reports, panel({name: 'Belongings', meta: fx.money}, itemsList(fx)));
    add(root, header(fx), add(el('div', {class: 'ud-grid-b'}), rail, page, side));
}

// C. Task-first: a palette over a quiet screen. Results come from every view; the verb chips filter them.
function buildC(fx, root) {
    const query = fx.id === 'village' ? 'tal' : 'wat';
    const pool = [...fx.actions.map(a => ({kind: a.verb, label: a.label, hint: [a.time, a.cost].filter(Boolean).join(' · '), blocked: a.blocked})),
        ...fx.people.map(p => ({kind: 'Talk', label: `Talk to ${p.name}`, hint: p.role})), ...fx.services.map(s => ({kind: 'Place', label: s.name, hint: s.note})),
        ...VIEWS.slice(0, 5).map(v => ({kind: 'View', label: v[0], hint: `${v[1]} hub`})), ...fx.items.map(i => ({kind: 'Item', label: i.name, hint: `x${i.count}`}))];
    const hits = pool.filter(r => r.label.toLowerCase().includes(query)).concat(pool.filter(r => !r.label.toLowerCase().includes(query)).slice(0, 5)).slice(0, 8);
    const quiet = el('div', {class: 'ud-quiet'});
    add(quiet, header(fx), el('p', {class: 'ud-prose ud-dim'}, 'Daylight falls across the village path.'), vitals(fx), reportsPanel(fx, true));
    const pal = el('section', {class: 'ud-palette', role: 'dialog', 'aria-label': 'Jump or do'});
    add(pal, el('div', {class: 'ud-search'}, `› ${query}`), add(el('div', {class: 'ud-chips'}), ...['All', 'Talk', 'Work', 'Make', 'Travel', 'Study', 'Inspect', 'Views'].map((t, i) => chip(t, i === 0 ? 'is-on' : ''))));
    const list = rows(hits, (li, r) => { li.className = r.blocked ? 'is-blocked' : ''; add(li, chip(r.kind), el('span', {}, r.label), el('small', {}, r.blocked || r.hint)); });
    add(pal, list, el('p', {class: 'ud-foot'}, 'Enter does it · Tab opens its view beside this one · Esc closes · ? lists every verb'));
    const sug = panel({name: 'Suggested now', meta: 'from Next step'}, [el('p', {}, fx.nextStep.text), btn('Do it', 'ud-primary')], 'ud-suggest');
    add(root, add(el('div', {class: 'ud-grid-c'}), quiet, pal, sug));
}

// D. The desk: notebook (journal, time), map table (places, people tokens), satchel (items), letters (reports).
function buildD(fx, root) {
    root.dataset.world = fx.world;
    const desk = el('div', {class: 'ud-desk'});
    const book = el('section', {class: 'ud-notebook', 'aria-label': 'Notebook'});
    add(book, el('h2', {}, 'Notebook'), el('p', {class: 'ud-hand'}, fx.nextStep.text), el('p', {class: 'ud-hand ud-dim'}, fx.nextStep.how),
        el('h3', {}, 'Today'), rows(fx.agenda, (li, a) => { li.dataset.state = a.state; add(li, el('b', {}, a.at), el('span', {}, a.text)); }), el('p', {class: 'ud-returnnote', 'data-return-note': ''}, fx.returnNote));
    const table = el('section', {class: 'ud-table', 'aria-label': 'Map table'});
    const fig = {id: 'ud-places', size: 640, title: `${fx.place} and nearby`, summary: 'Places by travel time from here.', rings: [{id: 'near', label: 'Near', radius: .5, slots: fx.places.length}],
        slots: fx.places.map((p, i) => ({id: p.id, ring: 'near', index: i, label: p.here ? `${p.name} (you)` : `${p.name} · ${p.time}`, state: p.here ? 'active' : 'empty', effect: p.here ? 'glow' : undefined}))};
    const figHost = el('div', {class: 'ud-figure'}); try { renderFigure(figHost, fig); } catch { figHost.append(el('p', {}, fig.summary)); }
    const cards = el('div', {class: 'ud-cards'}); for (const p of fx.people) add(cards, add(el('div', {class: 'ud-card'}), el('strong', {}, p.name), el('small', {}, p.role), p.want ? el('em', {}, p.want) : null));
    add(table, el('h2', {}, `Map table · ${fx.place}`), figHost, cards, add(el('div', {class: 'ud-actions-row'}), ...fx.actions.map(a => actionRow(a))));
    const letters = el('section', {class: 'ud-letters', 'aria-label': 'Letters'}); add(letters, el('h2', {}, 'Letters'), ...fx.reports.map(r => el('p', {class: 'ud-letter'}, r)));
    const satchel = el('section', {class: 'ud-satchel', 'aria-label': 'Satchel'}); add(satchel, el('strong', {}, `Satchel · ${fx.money}`), ...fx.items.map(i => chip(`${i.name} x${i.count}`)), el('span', {class: 'ud-spacer'}), vitals(fx));
    add(desk, book, table, letters, satchel); add(root, header(fx), desk);
}

const BUILDERS = {a: buildA, b: buildB, c: buildC, d: buildD};
export function buildScreen(direction, fixtureId, options = {}) {
    const fx = FIXTURES[fixtureId] || FIXTURES.village;
    const screen = el('article', {class: 'ud-screen', 'data-direction': direction, 'data-fixture': fx.id, 'data-size': String(options.size || 14)});
    const host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': 'luminous', class: 'ud-root'});
    host.append(module); screen.append(host);
    const state = defaultCustomizationState(); const px = `${options.size || 14}px`;
    BUILDERS[direction](fx, module);
    try { applyCustomizationProfile(state, {moduleNodes: {vitals: module}}); } catch { /* the tokens still resolve from ui_tokens.css */ }
    // Set after the profile applies so the text size is the one the gallery asked for (14 or 21 px).
    for (const node of [screen, host, module]) { node.style.setProperty('--custom-size', px); node.style.setProperty('--ud-text', px); }
    screen.style.fontSize = px; module.style.fontSize = px;
    return screen;
}
// Text form of a screen for the render test and the evidence log: what a reader without the visuals gets.
export const screenText = (screen) => screen.innerText ?? screen.textContent;

export function mountGallery(host, params = new URLSearchParams(location.search)) {
    const size = [14, 21].includes(Number(params.get('size'))) ? Number(params.get('size')) : 14;
    const fixtureId = FIXTURES[params.get('fixture')] ? params.get('fixture') : 'village';
    const only = DIRECTIONS.find(d => d.id === params.get('dir'));
    const effects = ['full', 'reduced', 'off'].includes(params.get('effects')) ? params.get('effects') : 'full';
    document.documentElement.dataset.effects = effects;
    for (const d of only ? [only] : DIRECTIONS) {
        const wrap = el('section', {class: 'ud-wrap', 'data-wrap': d.id});
        add(wrap, el('h1', {}, d.title), el('p', {class: 'ud-tag'}, d.tag), buildScreen(d.id, fixtureId, {size}));
        host.append(wrap);
    }
    return {size, fixtureId, effects, counts: COUNTS, routes: ROUTES.length};
}
