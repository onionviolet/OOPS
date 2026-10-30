// People variants (GALLERY_FORM_AUDIT_2026-10-30, "Round 2: people (R2-3)"): who knows what (GF9), family and lives (GF21, GF17),
// group standing (GF24). Three blocky, abstract Luminous drafts per aspect, read from the same fixtures the current figures use,
// so no fact moves. Proposals (AD32): nothing here touches a live view.
// Block vocabulary shared with the housing and places runs: a filled glowing block is known, close or had; a hairline outline is
// guessed or possible; a dim block is unknown or lost. No portraits, no drawn objects. Every block carries its full fact in its
// tooltip, and the text form sits behind "read as text" (L1). Invented names only (CLR3); nothing sealed is shown.
import {figureText} from '../../figure.js';
import {familyPeople} from '../../../family_figure.js';
import {livesFromView} from '../../lives_figure.js';
import {RELATIONSHIP_WEB_PEOPLE, RELATIONSHIP_WEB_FIXTURE, RUMOUR_RIPPLE_FIXTURE} from './relationship_web.js';
import {FAMILY_HOUSEHOLD_FIXTURE, FAMILY_STRANGER_FIXTURE, HOUSEHOLD_PROJECTION, STRANGER_PROJECTION} from './family_tree.js';
import {LIVES_FIXTURE, LIVES_VIEW} from './spacetime.js';
import {FIGURE_FIXTURES_ORGANIZATIONS} from './organizations.js';

const h = (host, tag, cls, text, attrs = {}) => {
    const n = host.ownerDocument.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
};
const first = name => { const w = String(name).split(/[ ,]/); return /^(Old|The)$/.test(w[0]) && w[1] ? w[1] : w[0]; };
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);

/** One block: the state is the whole message; the tooltip says it in full. */
const block = (host, state, tip, cls = '', label = '') => {
    const b = h(host, 'span', `ppl-b ${cls}`.trim(), label, {'data-state': state, title: tip, 'aria-label': tip});
    return b;
};
/** L1: the text form is one click away. */
function withText(host, root, text) {
    const more = h(host, 'details', 'rd-text');
    more.append(h(host, 'summary', '', 'read as text'), h(host, 'pre', 'fig-text', text));
    root.append(more);
    return root;
}
const shell = (host, cls) => h(host, 'div', `rd ppl ${cls}`);

// ---------------------------------------------------------------- who knows what (GF9)

const DEED_WORD = {'You paid the agreed coin': 'Coin', 'You carried her anvil block': 'Anvil', 'You broke the warehouse seal': 'Seal', 'You kept the ferry promise': 'Oath', 'You asked about the reed paths': 'Reeds'};
const heaviness = p => p.owes.length * 3 + p.saw.length + (p.manner ? 2 : 0) + (p.here ? 1 : 0);

/** The Ferry Row people read as facts per person: deeds they saw, debts either way, whether they only heard. */
export function whoKnowsData(people = RELATIONSHIP_WEB_PEOPLE) {
    const rows = people.map((p, order) => ({p, order})).sort((a, b) => heaviness(b.p) - heaviness(a.p) || a.order - b.order).map(({p}) => p);
    const deeds = [...new Set(people.flatMap(p => p.saw))].map(text => ({text, word: DEED_WORD[text] || cap(text.split(' ').slice(-1)[0])}));
    return {
        deeds,
        people: rows.map(p => ({
            id: p.id, name: first(p.name), full: p.name, here: !!p.here, saw: p.saw,
            heard: p.manner?.heard ? p.manner.line : '',
            warm: p.manner && !p.manner.heard ? p.manner.warm : null,
            owes: p.owes.map(o => ({by: o.by, label: o.label, settled: !!o.settled, strained: !!o.strained})),
        })),
        text: `${figureText(RELATIONSHIP_WEB_FIXTURE)}\n\n${figureText(RUMOUR_RIPPLE_FIXTURE)}`,
    };
}
const debtState = o => o.settled ? 'settled' : o.strained ? 'warn' : 'known';
const debtTip = (p, o) => `${p.full}: ${o.by === 'you' ? 'you owe' : 'owes you'} ${o.label}${o.settled ? ' (settled)' : o.strained ? ' (strained)' : ''}`;

// W1: a grid of blocks, people down, what each knows or holds across. Dim cells are unknown to you.
export function drawWhoGrid(host, d = whoKnowsData()) {
    const root = shell(host, 'ppl-w1');
    const cols = [...d.deeds.map(x => ({id: x.text, word: x.word, kind: 'deed', text: x.text})), {id: 'heard', word: 'Heard', kind: 'heard'}, {id: 'owed', word: 'They owe', kind: 'theirs'}, {id: 'owe', word: 'You owe', kind: 'yours'}];
    const grid = h(host, 'div', 'ppl-grid');
    grid.append(h(host, 'span', 'ppl-corner'));
    for (const c of cols) grid.append(h(host, 'span', `ppl-colhead ppl-colhead--${c.kind}`, c.word));
    for (const p of d.people) {
        const name = h(host, 'span', 'ppl-rowname', p.name);
        if (p.here) name.dataset.here = 'true';
        grid.append(name);
        for (const c of cols) {
            const cell = h(host, 'span', 'ppl-cell');
            if (c.kind === 'deed') cell.append(block(host, p.saw.includes(c.text) ? 'known' : 'unknown', p.saw.includes(c.text) ? `${p.full} saw: ${c.text}` : `${p.full}: not known to have seen this`));
            else if (c.kind === 'heard') cell.append(block(host, p.heard ? 'guessed' : 'unknown', p.heard ? `${p.full}: ${p.heard} Who told them is not known to you.` : `${p.full}: nothing known about what they have heard`));
            else {
                const debts = p.owes.filter(o => (o.by === 'you') === (c.kind === 'yours'));
                if (!debts.length) cell.append(block(host, 'unknown', `${p.full}: no debt that way`));
                for (const o of debts) cell.append(block(host, debtState(o), debtTip(p, o), 'ppl-b--mini'));
            }
            grid.append(cell);
        }
    }
    root.append(grid);
    host.replaceChildren(withText(host, root, d.text));
}

/** The rumour ripple read as lanes: one lane per chain of telling, one column per hop. */
export function rippleLanes(spec = RUMOUR_RIPPLE_FIXTURE) {
    const node = new Map(spec.nodes.map(n => [n.id, n]));
    const hops = spec.rings.map(r => r.id), deed = spec.nodes.find(n => n.at === 'center');
    const kids = id => spec.edges.filter(e => e.kind === 'told' && e.from === id).map(e => e.to);
    const lanes = [];
    const walk = (id, lane) => {
        lane.cells[hops.indexOf(node.get(id).ring)] = {node: node.get(id), edge: spec.edges.find(e => e.to === id && e.kind === 'told')};
        const next = kids(id);
        if (next[0]) walk(next[0], lane);
        for (const extra of next.slice(1)) { const l = {cells: []}; lanes.push(l); walk(extra, l); }
    };
    for (const e of spec.edges.filter(x => x.kind === 'saw')) { const l = {cells: []}; lanes.push(l); walk(e.to, l); }
    return {deed, hops: spec.rings, lanes};
}
const tellTip = c => `${c.node.label}${c.edge ? `: ${c.edge.label}${c.edge.state === 'unknown' ? ', a guess' : ''}` : ': saw it'}`;

// W2: telling lanes. The deed is one tall block; each hop is a column, each chain of telling a lane. Hairline = a guessed link.
export function drawTellingLanes(host, d = whoKnowsData()) {
    const root = shell(host, 'ppl-w2'), r = rippleLanes();
    const body = h(host, 'div', 'ppl-lanes');
    const deed = block(host, 'warn', `${r.deed.label}: the deed`, 'ppl-deed', 'Seal');
    const grid = h(host, 'div', 'ppl-lanegrid');
    for (const ring of r.hops) grid.append(h(host, 'span', 'ppl-colhead', ring.label.split(' ').slice(-1)[0] === 'it' ? 'Saw' : ring.id === 'heard' ? 'Heard' : 'Told on'));
    for (const lane of r.lanes) for (let i = 0; i < r.hops.length; i++) {
        const c = lane.cells[i], cell = h(host, 'span', 'ppl-lanecell');
        if (c) {
            const guess = c.edge?.state === 'unknown' || c.node.state === 'unknown';
            cell.append(block(host, guess ? 'guessed' : 'known', tellTip(c), 'ppl-link'), block(host, guess ? 'guessed' : 'known', tellTip(c), 'ppl-b--tok', c.node.glyph));
        } else if (lane.cells[i + 1] && !lane.cells.slice(0, i).some(Boolean)) cell.append(block(host, 'guessed', 'A guessed link: nobody named the teller', 'ppl-link ppl-link--wide'));
        grid.append(cell);
    }
    body.append(deed, grid);
    root.append(body);
    host.replaceChildren(withText(host, root, d.text));
}

// W3: stacks. One column per person, heaviest first: debts at the base, deeds they saw above, a hairline cap when they only heard.
export function drawHolderStacks(host, d = whoKnowsData()) {
    const root = shell(host, 'ppl-w3'), row = h(host, 'div', 'ppl-stacks');
    for (const p of d.people) {
        const col = h(host, 'div', 'ppl-stack');
        const pile = h(host, 'div', 'ppl-pile');
        if (p.heard) pile.append(block(host, 'guessed', `${p.full}: ${p.heard}`, 'ppl-b--slab'));
        for (const s of p.saw) pile.append(block(host, 'known', `${p.full} saw: ${s}`, 'ppl-b--slab'));
        for (const o of p.owes) pile.append(block(host, debtState(o), debtTip(p, o), `ppl-b--slab ppl-b--${o.by}`));
        if (!pile.childElementCount) pile.append(block(host, 'unknown', `${p.full}: nothing known`, 'ppl-b--slab'));
        const name = h(host, 'span', 'ppl-rowname', p.name);
        if (p.here) name.dataset.here = 'true';
        col.append(pile, name);
        row.append(col);
    }
    root.append(row);
    host.replaceChildren(withText(host, root, d.text));
}

// ---------------------------------------------------------------- family and lives (GF21, GF17)

/** Family people placed on a four-column register by generation; lives read through the game's own adapter. */
export function familyData(projection = HOUSEHOLD_PROJECTION, options = {}) {
    const {people} = familyPeople(projection, options);
    const heirId = projection.succession?.heirId;
    const lives = livesFromView(LIVES_VIEW).lives.map(l => ({...l, num: Number((/(\d+)$/.exec(l.id) || [])[1])})).sort((a, b) => a.num - b.num);
    const mk = p => ({id: p.id, role: p.role, gen: p.gen, word: p.word, name: p.name ? first(p.name) : '', full: p.name ? `${p.word}: ${p.name}` : p.word, grade: p.grade, self: !!p.self, heir: p.id === heirId});
    const all = people.map(mk);
    return {people: all, lives, text: `${figureText(FAMILY_HOUSEHOLD_FIXTURE)}\n\n${figureText(FAMILY_STRANGER_FIXTURE)}\n\n${figureText(LIVES_FIXTURE)}`};
}
const gradeState = p => p.self ? 'you' : p.grade === 'known' ? 'known' : p.grade === 'guessed' ? 'guessed' : 'unknown';
const personTip = p => `${p.full}${p.grade === 'known' ? '' : ` (${p.grade})`}${p.heir ? ', would inherit' : ''}`;
const lifeState = l => l.active ? 'you' : l.reachable === false ? 'unknown' : 'known';
const lifeTip = l => `${l.label}${l.active ? ': the life you are in' : l.reachable === false ? ': paused, no route back' : ': paused, you can resume it'}`;
const pointState = (set, blocked) => blocked ? 'unknown' : set ? 'known' : 'guessed';

function lifeTokens(host, lives, cls = '') {
    const run = h(host, 'div', `ppl-lives ${cls}`.trim());
    for (const l of lives) run.append(block(host, lifeState(l), lifeTip(l), 'ppl-b--tok', String(l.num)));
    return run;
}
const placeBlock = (host, p, start, span) => {
    const b = block(host, gradeState(p), personTip(p), `ppl-col-${start} ppl-span-${span}${p.heir ? ' ppl-heir' : ''}`);
    if (p.name || p.heir) b.append(h(host, 'span', 'ppl-cap', p.heir ? 'heir' : p.name));
    return b;
};

// F1: register. Generations are rows, a parent sits over its own two parents, no lines. Lives are numbered tokens beneath.
export function drawRegister(host, d = familyData()) {
    const root = shell(host, 'ppl-f1'), reg = h(host, 'div', 'ppl-reg');
    const at = (role) => d.people.find(p => p.role === role);
    const rowOf = (...cells) => cells.filter(c => c[0]).forEach(([p, start, span]) => reg.append(placeBlock(host, p, start, span)));
    rowOf([at('m.m'), 1, 1], [at('m.f'), 2, 1], [at('f.m'), 3, 1], [at('f.f'), 4, 1]);
    rowOf([at('m'), 1, 2], [at('f'), 3, 2]);
    rowOf([at('sibling'), 1, 1], [at('self'), 2, 2], [at('spouse'), 4, 1]);
    rowOf([at('child'), 2, 2]);
    const lives = h(host, 'div', 'ppl-lifeline');
    lives.append(h(host, 'span', 'ppl-colhead', 'Lives'), lifeTokens(host, d.lives));
    root.append(reg, lives);
    host.replaceChildren(withText(host, root, d.text));
}

// F2: brick wall. Same seven slots every time (you, two parents, four grandparents), so what you do not know shows as a gap in the wall.
export function drawBrickWall(host, d = familyData(STRANGER_PROJECTION, {knows: key => ({'family.raised': false, 'family.f.f': 'guessed'})[key]})) {
    const root = shell(host, 'ppl-f2'), wall = h(host, 'div', 'ppl-wall');
    const slot = (role, start, span) => {
        const p = d.people.find(x => x.role === role);
        return placeBlock(host, p, start, span);
    };
    for (const [role, start, span] of [['m.m', 1, 1], ['m.f', 2, 1], ['f.m', 3, 1], ['f.f', 4, 1], ['m', 1, 2], ['f', 3, 2], ['self', 1, 4]]) wall.append(slot(role, start, span));
    const stair = h(host, 'div', 'ppl-lifecol');
    stair.append(h(host, 'span', 'ppl-colhead', 'Lives'), lifeTokens(host, familyData().lives, 'ppl-lives--col'));
    root.append(h(host, 'div', 'ppl-f2body'), stair);
    root.firstChild.append(wall);
    host.replaceChildren(withText(host, root, d.text));
}

// F3: life stack. One floor per life, return points as two ticks; the life you are in carries your kin as a row of small blocks.
export function drawLifeStack(host, d = familyData()) {
    const root = shell(host, 'ppl-f3'), tower = h(host, 'div', 'ppl-tower');
    const kin = [...d.people].sort((a, b) => a.gen - b.gen || (a.role === 'self') - (b.role === 'self'));
    for (const l of d.lives) {
        const floor = h(host, 'div', 'ppl-floor');
        floor.append(block(host, lifeState(l), lifeTip(l), 'ppl-b--tok', String(l.num)));
        const slab = block(host, lifeState(l), lifeTip(l), 'ppl-slab');
        if (l.active) {
            let gen = null;
            for (const p of kin) {
                if (gen !== null && p.gen !== gen) slab.append(h(host, 'i', 'ppl-gap'));
                gen = p.gen;
                const k = block(host, gradeState(p), personTip(p), `ppl-b--kin${p.heir ? ' ppl-heir' : ''}`);
                slab.append(k);
            }
        }
        const ticks = h(host, 'span', 'ppl-ticks');
        const blocked = l.reachable === false || !!l.initialBlocked;
        ticks.append(block(host, pointState(!!l.initial, blocked), `${l.label}: start point${blocked ? ', no route back' : ''}`, 'ppl-tick'),
            block(host, pointState(!!l.checkpoint, blocked), `${l.label}: later point${l.checkpoint ? '' : ' not set yet'}`, 'ppl-tick'));
        floor.append(slab, ticks);
        tower.append(floor);
    }
    const key = h(host, 'p', 'ppl-note', 'start and later points');
    root.append(tower, key);
    host.replaceChildren(withText(host, root, d.text));
}

// ---------------------------------------------------------------- group standing (GF24)

const NEXT_ASK = {'org-courtyard-standing': {need: 50, have: 12, say: '12 of 50'}, 'org-sect-ranks': {need: 0, have: 0, say: 'technique, voucher'}};

/** The three organization fixtures read as groups: two ladders with a current rung, and a crew roster. */
export function standingData(fixtures = FIGURE_FIXTURES_ORGANIZATIONS) {
    const groups = [];
    for (const f of fixtures) {
        if (f.tracks) {
            const steps = f.tracks[0].steps, at = steps.findIndex(s => s.state === 'current');
            groups.push({id: f.id, kind: 'ladder', name: f.id === 'org-courtyard-standing' ? 'Village' : 'Orchard', steps, at, here: steps[at].label, next: steps[at + 1]?.label || '', ask: NEXT_ASK[f.id] || {}, note: f.notes?.[0]?.text || ''});
        } else {
            const crew = f.nodes.filter(n => n.id !== 'you').map(n => ({id: n.id, who: first(n.label), role: n.label.split(', ')[1] || '', state: n.state === 'strained' ? 'warn' : n.state === 'unknown' ? 'unknown' : 'known', label: n.label}));
            groups.push({id: f.id, kind: 'crew', name: 'Ash Lane', crew, note: f.notes?.[0]?.text || ''});
        }
    }
    return {groups, text: fixtures.map(f => figureText(f)).join('\n\n')};
}
const rungTip = (g, s, i) => `${g.name}: ${s.label}${i === g.at ? ', where you stand' : i < g.at ? ', reached' : i === g.at + 1 ? `, next${g.ask.say ? ` (${g.ask.say})` : ''}` : ', further on'}`;
const rungState = (g, i) => i < g.at ? 'known' : i === g.at ? 'you' : 'guessed';
const crewTip = c => `${c.label}${c.state === 'warn' ? ': strained, owed a cut' : c.state === 'unknown' ? ': not known' : ''}`;

// S1: rung bars. One bar per group, one block per rung: filled up to where you stand, you glowing, the next rung a hairline with its fill so far.
export function drawRungBars(host, d = standingData()) {
    const root = shell(host, 'ppl-s1');
    for (const g of d.groups) {
        const row = h(host, 'div', 'ppl-rung');
        if (g.kind === 'ladder') {
            row.append(h(host, 'p', 'ppl-gname', `${g.name} · ${g.here}`));
            const bar = h(host, 'div', 'ppl-bar');
            g.steps.forEach((s, i) => {
                const b = block(host, rungState(g, i), rungTip(g, s, i), 'ppl-seg');
                if (i === g.at + 1 && g.ask.need) b.style.setProperty('--ppl-fill', `${Math.round(100 * g.ask.have / g.ask.need)}%`);
                bar.append(b);
            });
            row.append(bar);
            if (g.next) row.append(h(host, 'p', 'ppl-next', `next ${g.next}${g.ask.say ? ` · ${g.ask.say}` : ''}`));
        } else {
            row.append(h(host, 'p', 'ppl-gname', `${g.name} crew`));
            const bar = h(host, 'div', 'ppl-bar');
            bar.append(block(host, 'you', 'You: the boss', 'ppl-seg'), h(host, 'i', 'ppl-gapb'));
            let role = null;
            for (const c of g.crew) { const r = c.role.split(' ')[0]; if (role !== null && r !== role) bar.append(h(host, 'i', 'ppl-gapb')); role = r; bar.append(block(host, c.state, crewTip(c), 'ppl-seg')); }
            row.append(bar);
        }
        root.append(row);
    }
    host.replaceChildren(withText(host, root, d.text));
}

// S2: stairs. Each ladder is a stair you stand on; steps above you are outlines. The crew is a pyramid with the boss on top.
export function drawStairs(host, d = standingData()) {
    const root = shell(host, 'ppl-s2'), set = h(host, 'div', 'ppl-stairs');
    for (const g of d.groups) {
        const col = h(host, 'div', 'ppl-stair');
        const treads = h(host, 'div', g.kind === 'ladder' ? 'ppl-treads' : 'ppl-tiers');
        if (g.kind === 'ladder') {
            g.steps.forEach((s, i) => treads.append(block(host, rungState(g, i), rungTip(g, s, i), `ppl-tread ppl-h${i + 1}`)));
        } else {
            const byRole = r => g.crew.filter(c => c.role.startsWith(r));
            for (const tier of [[{id: 'you', label: 'You: the boss', state: 'you'}], byRole('captain'), [...byRole('runner'), ...byRole('lookout')]]) {
                const row = h(host, 'div', 'ppl-tier');
                for (const c of tier) row.append(block(host, c.state, crewTip(c), 'ppl-b--kin'));
                treads.append(row);
            }
        }
        col.append(treads, h(host, 'span', 'ppl-colhead', g.kind === 'ladder' ? `${g.name} · ${g.here}` : `${g.name} crew`));
        set.append(col);
    }
    root.append(set);
    host.replaceChildren(withText(host, root, d.text));
}

// S3: rank cards. One card per group: the rank as a big numeral, a pip row, and what the next rung asks in a few words.
export function drawRankCards(host, d = standingData()) {
    const root = shell(host, 'ppl-s3');
    for (const g of d.groups) {
        const card = h(host, 'div', 'ppl-card');
        card.append(h(host, 'span', 'ppl-gname', g.name));
        if (g.kind === 'ladder') {
            card.append(h(host, 'b', 'ppl-rank', String(g.at + 1)), h(host, 'span', 'ppl-say', g.here));
            const pips = h(host, 'span', 'ppl-pips');
            g.steps.forEach((s, i) => pips.append(block(host, rungState(g, i), rungTip(g, s, i), 'ppl-b--pip')));
            card.append(pips);
            if (g.next) card.append(h(host, 'span', 'ppl-ask', `${g.next}: ${g.ask.say || 'ask at the door'}`));
        } else {
            card.append(h(host, 'b', 'ppl-rank', String(g.crew.length + 1)), h(host, 'span', 'ppl-say', 'in the crew'));
            const pips = h(host, 'span', 'ppl-pips');
            pips.append(block(host, 'you', 'You: the boss', 'ppl-b--pip'));
            for (const c of g.crew) pips.append(block(host, c.state, crewTip(c), 'ppl-b--pip'));
            card.append(pips, h(host, 'span', 'ppl-ask', 'Dunn: owed a cut'));
        }
        root.append(card);
    }
    host.replaceChildren(withText(host, root, d.text));
}

export const PEOPLE_ASPECTS = [
    {id: 'people-who', title: 'Who knows what: current, then W1 to W3', note: 'Same people, deeds and debts as the Ferry Row web and the rumour ripple. Dim means nothing known to you; a hairline is a guess.',
        current: [RELATIONSHIP_WEB_FIXTURE, RUMOUR_RIPPLE_FIXTURE],
        variants: [{id: 'W1', title: 'W1: who-knows grid', draw: drawWhoGrid}, {id: 'W2', title: 'W2: telling lanes (unusual)', draw: drawTellingLanes}, {id: 'W3', title: 'W3: holder stacks', draw: drawHolderStacks}]},
    {id: 'people-family', title: 'Family and lives: current, then F1 to F3', note: 'The Ashdown household, the half-remembered family and the lives list as the current figures show them. A hairline is a guess, dim is unknown.',
        current: [FAMILY_HOUSEHOLD_FIXTURE, FAMILY_STRANGER_FIXTURE, LIVES_FIXTURE],
        variants: [{id: 'F1', title: 'F1: register', draw: drawRegister}, {id: 'F2', title: 'F2: brick wall of ancestors', draw: drawBrickWall}, {id: 'F3', title: 'F3: life stack (unusual)', draw: drawLifeStack}]},
    {id: 'people-standing', title: 'Group standing: current, then S1 to S3', note: 'The courtyard and orchard ladders and the Ash Lane crew from the organization fixtures. A filled block is reached or held, a hairline is ahead.',
        current: FIGURE_FIXTURES_ORGANIZATIONS,
        variants: [{id: 'S1', title: 'S1: rung bars', draw: drawRungBars}, {id: 'S2', title: 'S2: stairs (unusual)', draw: drawStairs}, {id: 'S3', title: 'S3: rank cards', draw: drawRankCards}]},
];
