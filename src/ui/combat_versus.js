// Versus row (combat situation card, round 2 default): your side on the left, one card per opponent on
// the right, each with small labelled chips. Input is `fightSituation(...).versus`. Every fact is in words;
// colour and marks only repeat it (UR37). Draws through host.ownerDocument so pop-out windows work.
import {FIGURE_STATES} from './figure.js';

const MARKS = {lethal: FIGURE_STATES.strained, heavy: FIGURE_STATES.filled, light: FIGURE_STATES.empty, unknown: FIGURE_STATES.unknown, down: FIGURE_STATES.broken};

const oddsText = odds => {
    const parts = [];
    if (odds.you != null) parts.push(`You hit ${odds.youWord} ${odds.you}%`);
    if (odds.them != null) parts.push(`It hits you ${odds.themWord} ${odds.them}%`);
    return parts.join(' · ');
};
const threatText = t => `${MARKS[t.level] || ''} ${t.word}${t.rung ? ` · reaches ${t.rung}` : ''}`.trim();

function youLine(you) {
    return `${you.name}${you.hp ? `, ${you.hp.text}` : ''}${you.allies > 0 ? `, +${you.allies} ${you.allies === 1 ? 'ally' : 'allies'}` : ''}`;
}
function opponentLine(o) {
    const bits = o.down ? [o.name, 'Down'] : [o.name, o.hp.text, `${o.threat.word}${o.threat.rung ? ` · reaches ${o.threat.rung}` : ''}`];
    if (o.intent) bits.push(o.intent.word);
    if (o.odds) { const t = oddsText(o.odds); if (t) bits.push(t); }
    if (o.target === 'unread') bits.push('Target unread');
    return bits.join('. ') + '.';
}

export function versusText(versus) {
    const lines = [`${youLine(versus.you)}.`, ...versus.opponents.map(opponentLine)];
    if (versus.together?.text) lines.push(versus.together.text);
    return lines.join('\n');
}

function make(doc, tag, className, text) {
    const n = doc.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
}
function meter(doc, className, label, fraction, text) {
    const bar = make(doc, 'div', className);
    const pct = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
    bar.setAttribute('role', 'meter');
    bar.setAttribute('aria-label', label);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(pct));
    bar.setAttribute('aria-valuetext', text);
    bar.style.setProperty('--versus-fill', `${pct}%`);
    bar.append(make(doc, 'span', 'versus-bar-fill'));
    return bar;
}
const chip = (doc, kind, text, extra = '') => make(doc, 'span', `versus-chip versus-chip--${kind}${extra ? ` ${extra}` : ''}`, text);

function youSide(doc, you) {
    const side = make(doc, 'section', 'versus-side versus-side--you');
    side.setAttribute('aria-label', 'Your side');
    side.append(make(doc, 'h4', 'versus-name', you.name));
    if (you.hp) {
        side.append(make(doc, 'p', 'versus-hp', you.hp.text));
        if (you.hp.max > 0) side.append(meter(doc, 'versus-bar versus-bar--you', `${you.name} hit points`, you.hp.current / you.hp.max, you.hp.text));
    }
    if (you.allies > 0) side.append(make(doc, 'p', 'versus-allies', `+${you.allies} ${you.allies === 1 ? 'ally' : 'allies'}`));
    return side;
}

function card(doc, o) {
    const c = make(doc, 'article', 'versus-card');
    c.dataset.threat = o.threat.level;
    c.dataset.known = String(o.known);
    c.dataset.down = String(!!o.down);
    c.dataset.combatSubject = o.id;
    c.setAttribute('aria-label', opponentLine(o));
    c.append(make(doc, 'h4', 'versus-name', o.name));
    c.append(make(doc, 'p', 'versus-hp', o.hp.text));
    if (o.hp.fraction !== null && o.hp.fraction !== undefined) c.append(meter(doc, 'versus-bar', `${o.name} hit points`, o.hp.fraction, o.hp.text));
    const chips = make(doc, 'div', 'versus-chips');
    chips.append(chip(doc, 'threat', threatText(o.threat), o.threat.level === 'lethal' ? 'fig-fx--pulse' : ''));
    if (o.intent) chips.append(chip(doc, 'intent', `${FIGURE_STATES.unknown} ${o.intent.word}`));
    if (o.odds) { const t = oddsText(o.odds); if (t) chips.append(chip(doc, 'odds', t)); }
    if (o.target === 'unread') chips.append(chip(doc, 'target', `${FIGURE_STATES.unknown} Target unread`));
    c.append(chips);
    return c;
}

export function renderVersusRow(host, versus) {
    const doc = host.ownerDocument;
    const root = make(doc, 'div', 'versus-row');
    root.dataset.opponents = String(versus.opponents.length);
    const sep = make(doc, 'span', 'versus-sep', 'vs');
    sep.setAttribute('aria-hidden', 'true');
    const them = make(doc, 'section', 'versus-side versus-side--them');
    them.setAttribute('aria-label', 'Opponents');
    for (const o of versus.opponents) them.append(card(doc, o));
    root.append(youSide(doc, versus.you), sep, them);
    host.replaceChildren(root);
    return root;
}
