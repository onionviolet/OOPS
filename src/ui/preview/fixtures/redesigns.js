// Gallery-only redesign drafts (GALLERY_FORM_AUDIT_2026-10-30). Each draft draws the same facts as a current figure, as a
// bespoke object: a ledger page, a crossing ticket, a floor plan, a lantern stair, a face-off. Proposals (AD32) until Weibao accepts them.
// Liberties used: L1 text form behind a toggle, L2 type hierarchy, L3 bespoke object, L4 drawn assets, L5 say it once, L6 show what matters now.
// Invented names only (CLR3). Colour comes from tokens (styles/redesign_drafts.css); nothing here touches a live view or figure.js behaviour.
// Not spec-shaped on purpose: representation_contract registers any exported array of {id, title, rings|tracks|...} as a figure spec.
import {figureText} from '../../figure.js';
import {versusText} from '../../combat_versus.js';
import {OWED_TABLE_FIXTURE, THRESHOLD_FIXTURES} from './forms.js';
import {HOME_FIXTURES} from './homes.js';
import {ABILITY_FIXTURES} from './abilities.js';
import {VERSUS_FIXTURES} from './combat.js';

const NS = 'http://www.w3.org/2000/svg';
const h = (host, tag, cls, text) => { const n = host.ownerDocument.createElement(tag); if (cls) n.className = cls; if (text != null && text !== '') n.textContent = text; return n; };
const s = (host, tag, attrs = {}, text) => {
    const n = host.ownerDocument.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== undefined) n.setAttribute(k, String(v));
    if (text != null) n.textContent = text;
    return n;
};
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);
const pct = f => `${Math.round(Math.max(0, Math.min(1, f)) * 100)}%`;

/** L1: the text form is one click away, not printed. Same string the current figure prints, so no fact is lost. */
function withText(host, root, text) {
    const more = h(host, 'details', 'rd-text');
    more.append(h(host, 'summary', '', 'read as text'), h(host, 'pre', 'fig-text', text));
    root.append(more);
    return root;
}

// ---------------------------------------------------------------------------------------------------------------------
// 1. Owed ledger as a page from a pawnbroker's book (current: owed-table-mixed).
// ---------------------------------------------------------------------------------------------------------------------
const KIND_GLYPH = {Money: '金', Duty: '務', Grievance: '怨'};
const amountOf = row => {
    const [, what, kind] = row.cells;
    const n = /(\d+)/.exec(what);
    return {n: n ? Number(n[1]) : null, text: n ? n[1] : 'duty', kind, money: kind === 'Money' && !!n};
};
const whenOf = when => {
    if (when === 'overdue') return {stamp: 'overdue'};
    const due = /^due in (\d+) days?$/.exec(when);
    if (due) return {text: `${due[1]} days`};
    const eases = /^no date; eases by (\d+) a season$/.exec(when);
    return eases ? {text: `eases ${eases[1]} a season`} : {};
};

function ledgerPage(host, heading, rows, side) {
    const page = h(host, 'section', `rd-page rd-page--${side}`);
    page.append(h(host, 'h4', 'rd-page-head', heading));
    let total = 0;
    for (const row of rows) {
        const amount = amountOf(row), when = whenOf(row.cells[3]);
        const line = h(host, 'div', 'rd-line');
        line.dataset.state = row.state || 'plain';
        line.title = row.cells.join(' · ');
        const glyph = h(host, 'span', 'rd-glyph', KIND_GLYPH[amount.kind] || '·');
        glyph.setAttribute('aria-label', amount.kind);
        line.append(glyph, h(host, 'span', 'rd-who', cap(row.cells[0].replace(/^(To|From) the /, ''))), h(host, 'span', 'rd-leader'),
            h(host, 'span', amount.money ? 'rd-fig' : 'rd-fig rd-fig--note', amount.text));
        if (when.stamp) line.append(h(host, 'span', 'rd-stamp', when.stamp));
        else if (when.text) line.append(h(host, 'span', 'rd-when', when.text));
        if (row.bar !== undefined) { const burn = h(host, 'i', 'rd-burn'); burn.style.setProperty('--rd-term', pct(row.bar)); burn.dataset.gone = String(row.bar === 0); line.append(burn); }
        if (amount.money) total += amount.n;
        page.append(line);
    }
    if (total) {
        const foot = h(host, 'p', 'rd-total');
        foot.append(h(host, 'span', 'rd-glyph', '金'), h(host, 'b', 'rd-fig', String(total)));
        foot.setAttribute('aria-label', `${total} coins`);
        page.append(foot);
    }
    return page;
}

export function drawOwedLedger(host, spec = OWED_TABLE_FIXTURE) {
    const rows = spec.tables[0].rows;
    const root = h(host, 'div', 'rd rd-owed');
    const spread = h(host, 'div', 'rd-spread');
    spread.append(ledgerPage(host, 'You owe', rows.filter(r => !/^From /.test(r.cells[0])), 'owe'), ledgerPage(host, 'Owed you', rows.filter(r => /^From /.test(r.cells[0])), 'owed'));
    root.append(spread);
    host.replaceChildren(withText(host, root, figureText(spec)));
}

// ---------------------------------------------------------------------------------------------------------------------
// 2. Crossing threshold as a ticket with a perforation (current: threshold-lanternside-clerk).
// ---------------------------------------------------------------------------------------------------------------------
export function drawCrossingTicket(host, spec = THRESHOLD_FIXTURES[0]) {
    const card = spec.cards[0], group = id => card.groups.find(g => g.id === id) || {rows: []};
    const [, route, as] = spec.title.split(' · ');
    const [from, to] = route.split(' → ');
    const root = h(host, 'div', 'rd rd-ticket');
    const top = h(host, 'header', 'rd-ticket-head');
    top.append(h(host, 'span', 'rd-place', from), h(host, 'span', 'rd-arrow', '→'), h(host, 'span', 'rd-place', to), h(host, 'span', 'rd-as', as.replace(/^as /, '').replace(/^under /, '')));
    const tag = (row, mark) => {
        const d = h(host, 'details', 'rd-tag');
        d.title = row.text;
        const sum = h(host, 'summary', '', row.label);
        if (mark) sum.append(h(host, 'small', 'rd-mark', mark));
        d.append(sum, h(host, 'p', 'rd-detail', row.text));
        return d;
    };
    const body = h(host, 'div', 'rd-ticket-body');
    const left = h(host, 'div', 'rd-side rd-side--behind');
    for (const row of group('held').rows) left.append(tag(row, 'stays'));
    for (const row of group('pauses').rows) left.append(tag(row, 'paused'));
    const seam = h(host, 'div', 'rd-seam');
    for (const row of group('crosses').rows) seam.append(tag(row));
    const right = h(host, 'div', 'rd-side rd-side--ahead');
    for (const row of group('far').rows) right.append(tag(row));
    body.append(left, seam, right);
    root.append(top, body, h(host, 'p', 'rd-fine', 'Only tagged items cross.'));
    host.replaceChildren(withText(host, root, figureText(spec)));
}

// ---------------------------------------------------------------------------------------------------------------------
// 3. Home as a floor plan (current: home-strip-cottage).
// ---------------------------------------------------------------------------------------------------------------------
const ICONS = {
    Sleep: 'M3 18V8M3 14h18v4M3 18h18M5 11h5v3H5z',
    Hearth: 'M4 20V10q8-8 16 0v10zM12 18c-3-2-2-5 0-7 2 2 3 5 0 7z',
    Table: 'M3 9h18v3H3zM5 12v8M19 12v8',
    'Study and practice': 'M3 8h8v11H3zM13 8h8v11h-8z',
    Storage: 'M3 8h18v12H3zM3 12h18M10 11h4v3h-4z',
};
const SPOTS = {Sleep: [10, 10], Hearth: [42, 10], Table: [24, 24], 'Study and practice': [8, 36], Storage: [40, 36]};
const icon = (host, name, x, y, state) => {
    const g = s(host, 'g', {class: `rd-icon rd-icon--${state}`, transform: `translate(${x} ${y}) scale(.9)`});
    g.append(s(host, 'path', {d: ICONS[name] || ICONS.Storage}));
    return g;
};

export function drawFloorPlan(host, spec = HOME_FIXTURES[0]) {
    const fittings = spec.chips[0].items, rooms = spec.chips[1].items;
    const root = h(host, 'div', 'rd rd-plan');
    const svg = s(host, 'svg', {class: 'rd-plan-svg', viewBox: '0 0 150 64', role: 'img', 'aria-label': `${spec.title}. ${spec.summary}`});
    svg.append(s(host, 'rect', {class: 'rd-room rd-room--built', x: 4, y: 4, width: 62, height: 56}), s(host, 'path', {class: 'rd-door', d: 'M66 36v10'}));
    for (const f of fittings) {
        const [x, y] = SPOTS[f.label] || [30, 30], built = f.state === 'done';
        const g = icon(host, f.label, x, y, built ? 'fitted' : 'empty');
        g.append(s(host, 'title', {}, `${f.label}: ${f.note}`));
        svg.append(g);
        if (/^(\d+) of (\d+)/.test(f.note || '')) {
            const [, used, cap2] = /^(\d+) of (\d+)/.exec(f.note);
            svg.append(s(host, 'rect', {class: 'rd-gauge', x, y: y + 20, width: 22, height: 2.4}), s(host, 'rect', {class: 'rd-gauge-fill', x, y: y + 20, width: 22 * Number(used) / Number(cap2), height: 2.4}));
        }
    }
    svg.append(s(host, 'circle', {class: 'rd-here', cx: 12, cy: 55, r: 2.2}), s(host, 'text', {class: 'rd-here-label', x: 16, y: 56.6}, 'you'));
    const title = s(host, 'text', {class: 'rd-plan-name', x: 8, y: 10}, spec.title.split(':')[0]);
    svg.append(title);
    // Rooms beyond the first: the built one is solid, the rest are dashed outlines waiting at the wall.
    const spots = [[66, 18, 36, 42], [102, 2, 44, 20], [102, 22, 44, 20], [102, 42, 44, 20]];
    rooms.forEach((room, i) => {
        const [x, y, w, hgt] = spots[i], built = room.state === 'done';
        svg.append(s(host, 'rect', {class: `rd-room ${built ? 'rd-room--built' : 'rd-room--ghost'}`, x, y, width: w, height: hgt}));
        const name = room.label.replace(/^(Fit a |Restore )/, '');
        const t = s(host, 'text', {class: 'rd-room-name', x: x + 3, y: y + 8}, name);
        t.append(s(host, 'title', {}, `${room.label}: ${room.note}`));
        svg.append(t);
        if (!built) svg.append(s(host, 'path', {class: 'rd-plus', d: `M${x + w / 2 - 3} ${y + hgt / 2 + 3}h6M${x + w / 2} ${y + hgt / 2}v6`}));
    });
    root.append(svg);
    host.replaceChildren(withText(host, root, figureText(spec)));
}

// ---------------------------------------------------------------------------------------------------------------------
// 4. Ability ladder as a lantern stair (current: ladder-lantern-self; the compact, planned, records and insight variants are
//    the same stair with an overlay each). Short crossing labels would come from an optional `short` on the path's crossings.
// ---------------------------------------------------------------------------------------------------------------------
const SHORT = {'Acts in the Lantern-Reader role': 'Act the role', 'The harbour warden assesses you': 'Be assessed', 'Hold the wick draught, then drink it': 'Drink'};
const nameOf = label => label.split(' · ').pop();
const lantern = (host, state, fill) => {
    const svg = s(host, 'svg', {class: `rd-lantern rd-lantern--${state}`, viewBox: '0 0 32 40', 'aria-hidden': 'true'});
    svg.append(s(host, 'path', {class: 'rd-lantern-cage', d: 'M12 6h8M16 2v4M9 10h14l2 22H7zM9 10v22M23 10v22'}));
    if (['done', 'current', 'pending'].includes(state)) svg.append(s(host, 'path', {class: 'rd-flame', d: 'M16 29c-5-3-4-8 0-13 4 5 5 10 0 13z'}));
    if (state === 'current') svg.append(s(host, 'circle', {class: 'rd-ring', cx: 16, cy: 22, r: 18}), s(host, 'circle', {class: 'rd-ring-fill', cx: 16, cy: 22, r: 18, pathLength: 100, 'stroke-dasharray': `${Math.round((fill || 0) * 100)} 100`}));
    if (state === 'guessed' || state === 'unknown') svg.append(s(host, 'text', {class: 'rd-lantern-q', x: 16, y: 26}, state === 'guessed' ? '~' : '?'));
    return svg;
};

export function drawLanternStair(host, spec = ABILITY_FIXTURES.find(f => f.id === 'ladder-lantern-self')) {
    const [rungs, next] = spec.tracks;
    const root = h(host, 'div', 'rd rd-stair');
    const climb = h(host, 'ol', 'rd-climb');
    const current = rungs.steps.findIndex(step => step.state === 'current');
    // Highest rung first, so the stair reads upward.
    [...rungs.steps.entries()].reverse().forEach(([i, step]) => {
        const li = h(host, 'li', `rd-rung rd-rung--${step.state}`);
        li.style.setProperty('--rd-step', String(i));
        li.title = [step.label, step.note].filter(Boolean).join(': ');
        const label = step.state === 'unknown' ? '' : nameOf(step.label);
        li.append(lantern(host, step.state, step.fill), h(host, 'span', 'rd-rung-name', label));
        if (step.state === 'guessed') li.append(h(host, 'small', 'rd-mark', step.note));
        climb.append(li);
        if (i === current + 1) {
            // The crossing into the next rung: three wicks to light, said in two words each.
            const wicks = h(host, 'li', 'rd-wicks');
            wicks.style.setProperty('--rd-step', String(i));
            next.steps.forEach(w => {
                const wick = h(host, 'span', `rd-wick rd-wick--${w.state}`);
                wick.title = [w.label, w.note].filter(Boolean).join(': ');
                if (w.fill !== undefined) wick.style.setProperty('--rd-fill', pct(w.fill));
                wick.append(h(host, 'i', 'rd-wick-flame'), h(host, 'span', '', SHORT[w.label] || w.label));
                if (w.note === 'irreversible') wick.append(h(host, 'small', 'rd-mark', 'no undo'));
                if (w.fill !== undefined && w.note) wick.append(h(host, 'small', 'rd-count', w.note.replace(' of ', '/')));
                wicks.append(wick);
            });
            climb.append(wicks);
        }
    });
    root.append(climb);
    const more = h(host, 'details', 'rd-text');
    more.append(h(host, 'summary', '', 'gifts and risk'));
    for (const note of spec.notes) more.append(h(host, 'p', note.state ? 'rd-note rd-note--warn' : 'rd-note', note.text));
    root.append(more);
    host.replaceChildren(withText(host, root, figureText(spec)));
}

// ---------------------------------------------------------------------------------------------------------------------
// 5. Versus row as a face-off (current: combat_versus.js; read only, the combat-surface lane owns that file).
// ---------------------------------------------------------------------------------------------------------------------
const hpNumbers = text => { const m = /^(\d+)\/(\d+)/.exec(text || ''); return m ? [m[1], m[2]] : null; };
const bar = (host, cls, fraction) => { const b = h(host, 'i', cls); b.style.setProperty('--rd-fill', pct(fraction)); return b; };

function foe(host, o) {
    const plate = h(host, 'article', 'rd-foe');
    plate.dataset.threat = o.threat.level;
    plate.dataset.down = String(!!o.down);
    plate.title = [o.name, o.hp.text, o.threat.word, o.intent && o.intent.word].filter(Boolean).join('. ');
    plate.append(h(host, 'h4', 'rd-name', o.name.replace(/^Mire hound /, 'Hound ')));
    const n = hpNumbers(o.hp.text);
    if (o.down) plate.append(h(host, 'p', 'rd-down', 'down'));
    else {
        plate.append(h(host, 'p', 'rd-hp', n ? `${n[0]}/${n[1]}` : '???'));
        if (o.hp.fraction != null) plate.append(bar(host, 'rd-bar', o.hp.fraction));
        const mark = h(host, 'p', 'rd-threat');
        mark.append(h(host, 'b', '', o.threat.level === 'unknown' ? '?' : '!'), h(host, 'span', '', o.threat.level === 'lethal' ? 'lethal' : o.threat.level === 'unknown' ? 'unsized' : o.threat.word.toLowerCase()));
        plate.append(mark);
    }
    return plate;
}
const arrow = (host, dir, value, word) => {
    const a = h(host, 'p', `rd-odds rd-odds--${dir}`);
    a.style.setProperty('--rd-fill', `${value}%`);
    a.title = word;
    a.append(h(host, 'i', 'rd-odds-bar'), h(host, 'b', '', `${value}%`));
    return a;
};

function faceOff(host, versus) {
    const root = h(host, 'div', 'rd-face');
    const you = h(host, 'section', 'rd-you');
    const yn = hpNumbers(versus.you.hp.text);
    you.append(h(host, 'h4', 'rd-name', versus.you.name), h(host, 'p', 'rd-hp rd-hp--big', yn ? yn[0] : ''), h(host, 'p', 'rd-hp-max', yn ? `of ${yn[1]}` : ''), bar(host, 'rd-bar rd-bar--you', versus.you.hp.current / versus.you.hp.max));
    const mid = h(host, 'div', 'rd-mid');
    const [first] = versus.opponents;
    if (versus.opponents.length === 1 && first.odds) mid.append(arrow(host, 'out', first.odds.you, `You hit ${first.odds.youWord}`), arrow(host, 'in', first.odds.them, `It hits you ${first.odds.themWord}`));
    else mid.append(h(host, 'span', 'rd-vs', 'vs'));
    const them = h(host, 'div', 'rd-foes');
    for (const o of versus.opponents) them.append(foe(host, o));
    root.append(you, mid, them);
    const wrap = h(host, 'div', 'rd-faceoff');
    wrap.append(root);
    if (versus.together) {
        // The combined danger: the sized-up blows stacked against what you have left.
        const blows = versus.opponents.filter(o => !o.down && o.threat.blow).reduce((sum, o) => sum + o.threat.blow, 0), hp = versus.you.hp.current;
        const scale = Math.max(blows, hp) * 1.25;
        const gauge = h(host, 'div', 'rd-together');
        gauge.title = versus.together.text;
        gauge.style.setProperty('--rd-hp', pct(hp / scale));
        gauge.style.setProperty('--rd-blows', pct(blows / scale));
        gauge.append(h(host, 'i', 'rd-together-blows'), h(host, 'i', 'rd-together-hp'), h(host, 'b', '', `${Math.round(blows * 10) / 10} ≥ ${hp}`));
        wrap.append(gauge);
    }
    return wrap;
}

export function drawFaceOff(host, versuses = VERSUS_FIXTURES) {
    const root = h(host, 'div', 'rd rd-versus');
    for (const v of versuses) root.append(faceOff(host, v));
    host.replaceChildren(withText(host, root, versuses.map(versusText).join('\n\n')));
}

/** Each draft sits beside its current version in the gallery (redesign_gallery.js). `current` names what the left column draws. */
export const REDESIGNS = [
    {id: 'redesign-owed', title: 'Redesign: Owed ledger as a pawnbroker\'s page', gf: 'GF-Owed', liberties: ['L1', 'L2', 'L3', 'L5'], current: {kind: 'figure', spec: OWED_TABLE_FIXTURE}, draw: drawOwedLedger},
    {id: 'redesign-threshold', title: 'Redesign: Crossing threshold as a ticket', gf: 'GF-Threshold', liberties: ['L1', 'L3', 'L5', 'L6'], current: {kind: 'figure', spec: THRESHOLD_FIXTURES[0]}, draw: drawCrossingTicket},
    {id: 'redesign-home', title: 'Redesign: Home as a floor plan', gf: 'GF-Home', liberties: ['L1', 'L3', 'L4', 'L5'], current: {kind: 'figure', spec: HOME_FIXTURES[0]}, draw: drawFloorPlan},
    {id: 'redesign-ladder', title: 'Redesign: Ability ladder as a lantern stair', gf: 'GF-Ladder', liberties: ['L1', 'L3', 'L4', 'L6'], current: {kind: 'figure', spec: ABILITY_FIXTURES.find(f => f.id === 'ladder-lantern-self')}, draw: drawLanternStair},
    {id: 'redesign-versus', title: 'Redesign: Versus row as a face-off', gf: 'GF-Versus', liberties: ['L1', 'L2', 'L3', 'L5'], current: {kind: 'versus', versus: VERSUS_FIXTURES}, draw: drawFaceOff},
];
