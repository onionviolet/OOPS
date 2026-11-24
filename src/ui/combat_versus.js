// Versus row (combat situation card, round 2 default): your side on the left, one card per opponent on
// the right, each with small labelled chips. Input is `fightSituation(...).versus`. Every fact is in words;
// colour and marks only repeat it (UR37). Draws through host.ownerDocument so pop-out windows work.
import {FIGURE_STATES} from './figure.js';
import {knownNumberNode} from './known_number.js';

const MARKS = {lethal: FIGURE_STATES.strained, heavy: FIGURE_STATES.filled, light: FIGURE_STATES.empty, unknown: FIGURE_STATES.unknown, down: FIGURE_STATES.broken};

const oddsText = odds => {
    const parts = [];
    if (odds.you != null) parts.push(`You hit ${odds.youWord} ${odds.you}%`);
    if (odds.them != null) parts.push(`It hits you ${odds.themWord} ${odds.them}%`);
    return parts.join(' · ');
};
// Damage types (COMBAT.md round 3): what you learned by sizing it up, or what a marked cheat revealed.
const typeText = t => `${t.glyph} ${t.word}${t.source === 'learned' ? '' : ` (◈ ${t.source})`}`;
const fmtHp = n => Number.isInteger(n) ? String(n) : n.toFixed(1);
const threatText = t => `${MARKS[t.level] || ''} ${t.word}${Number.isFinite(t.blow) ? ` · up to ${fmtHp(t.blow)} hp` : ''}${t.rung ? ` · reaches ${t.rung}` : ''}`.trim();
const BOUND_NOTE = 'The hardest normal hit after your defense. Crits, armor piercing or elements can add more.';

function youLine(you) {
    return `${you.name}${you.hp ? `, ${you.hp.text}` : ''}${you.allies > 0 ? `, +${you.allies} ${you.allies === 1 ? 'ally' : 'allies'}` : ''}${you.mix ? `, strikes ${you.mix}` : ''}`;
}
function opponentLine(o) {
    const bits = o.down ? [o.name, 'Down'] : [o.name, o.hp.text, `${o.threat.word}${o.threat.rung ? ` · reaches ${o.threat.rung}` : ''}`];
    if (o.opening) bits.push('Opening');
    if (o.intent) bits.push(o.intent.word);
    if (o.odds) { const t = oddsText(o.odds); if (t) bits.push(t); }
    if (o.target === 'unread') bits.push('Target unread');
    for (const t of o.types || []) bits.push(typeText(t));
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
function meter(doc, className, label, fraction, text, inside = null) {
    const bar = make(doc, 'div', className);
    // A fraction of null is not known: an empty track with "?" inside, never a meter at zero (unknown is not empty).
    const pct = fraction == null ? 0 : Math.round(Math.max(0, Math.min(1, fraction)) * 100);
    if (fraction != null) for (const [k, v] of [['role', 'meter'], ['aria-label', label], ['aria-valuemin', '0'], ['aria-valuemax', '100'], ['aria-valuenow', String(pct)], ['aria-valuetext', text]]) bar.setAttribute(k, v);
    bar.style.setProperty('--versus-fill', `${pct}%`);
    bar.append(make(doc, 'span', 'versus-bar-fill'));
    // PS297: YAIR's bar form, the words inside the bar (the hp text on the You box and the Opponent box).
    if (inside != null) { const t = make(doc, 'span', 'versus-bar-text'); if (typeof inside === 'string') t.textContent = inside; else t.append(...inside); bar.append(t); bar.dataset.versusInside = ''; }
    return bar;
}
// The attack timer (DU10): how close a fighter is to acting, as a thin bar whose words say the same. Feel-finish owns its look (styles/feel_finish.css).
export const readyWord = r => r >= 1 ? 'acts next' : r >= .6 ? 'acts soon' : r >= .3 ? 'winding up' : 'a while yet';
const timer = (doc, name, ready) => Number.isFinite(ready) ? meter(doc, 'versus-bar versus-bar--timer', `${name}: time to act`, ready, readyWord(ready)) : null;
// DU37 (D6, proposal): a seeded sigil beside each name, so two foes of one kind are told apart at a glance by shape; colour comes from the
// card's own tokens and only repeats it (UR37, UR99: cheap materials, no art). Drawn only where the document makes SVG.
const SVG = 'http://www.w3.org/2000/svg';
const tenth = n => Math.round(n * 10) / 10; // SVG geometry, not a number anyone reads (outside number_format.js by design)
export function sigilPoints(name) {
    let x = 0; for (const c of String(name)) x = (x * 31 + c.charCodeAt(0)) >>> 0;
    const n = 3 + (x % 4), turn = (x % 7) / 7;
    return Array.from({length: n}, (_, i) => { const a = (i / n) * Math.PI * 2 + turn, r = 6 + ((x >>> (i * 3)) % 4); return `${tenth(12 + r * Math.cos(a))},${tenth(12 + r * Math.sin(a))}`; }).join(' ');
}
function sigil(doc, name) {
    if (typeof doc.createElementNS !== 'function') return null;
    const svg = doc.createElementNS(SVG, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('class', 'versus-sigil'); svg.setAttribute('aria-hidden', 'true');
    const poly = doc.createElementNS(SVG, 'polygon'); poly.setAttribute('points', sigilPoints(name));
    const dot = doc.createElementNS(SVG, 'circle'); dot.setAttribute('cx', '12'); dot.setAttribute('cy', '12'); dot.setAttribute('r', '1.6');
    svg.append(poly, dot); return svg;
}
function named(doc, name) {
    const h = make(doc, 'h4', 'versus-name', name), mark = sigil(doc, name);
    if (mark && typeof h.prepend === 'function') h.prepend(mark);
    return h;
}
const chip = (doc, kind, text, extra = '') => make(doc, 'span', `versus-chip versus-chip--${kind}${extra ? ` ${extra}` : ''}`, text);

// PS222: under each card, its own latest line, when Display > Look > Fight log says "On each card".
const lastLine = (doc, text) => { const p = make(doc, 'p', 'versus-last', text); p.dataset.versusLast = ''; return p; };
function youSide(doc, you, showLast = false, compact = false) {
    const side = make(doc, 'section', 'versus-side versus-side--you');
    side.setAttribute('aria-label', 'Your side');
    if (!compact) side.append(make(doc, 'h4', 'versus-name', you.name));
    if (!compact && you.hp) {
        if (you.hp.max > 0) side.append(meter(doc, 'versus-bar versus-bar--you versus-bar--hp', `${you.name} hit points`, you.hp.current / you.hp.max, you.hp.text, you.hp.text));
        else side.append(make(doc, 'p', 'versus-hp', you.hp.text));
    }
    // Stamina under health, as upstream YAIR's two bars (tempo fights only pass it).
    if (!compact && you.stamina?.max > 0) side.append(meter(doc, 'versus-bar versus-bar--stamina', `${you.name} stamina`, you.stamina.current / you.stamina.max, you.stamina.text, you.stamina.text));
    if (Number.isFinite(you.ready)) {
        if (compact) side.append(make(doc, 'p', 'versus-means', `Readiness · ${readyWord(you.ready)}`));
        side.append(timer(doc, you.name, you.ready));
    }
    if (you.means) side.append(make(doc, 'p', 'versus-means', you.means));
    if (you.allyCards?.length) {
        // D6: allies stand on your side, each its own small card under "Beside you" (the same words as the old one-line list).
        side.append(make(doc, 'h5', 'versus-heading', 'Beside you'));
        for (const a of you.allyCards) {
            const c = make(doc, 'article', 'versus-card versus-card--ally'); c.dataset.combatSubject = a.id;
            c.append(named(doc, a.name), make(doc, 'p', 'versus-hp', a.order ? `${a.hurt}, told: ${a.order}` : a.hurt));
            side.append(c);
        }
    } else if (you.allies > 0) side.append(make(doc, 'p', 'versus-allies', you.alliesText ? `Beside you: ${you.alliesText}` : `+${you.allies} ${you.allies === 1 ? 'ally' : 'allies'}`));
    if (you.mix) side.append(make(doc, 'p', 'versus-mix', `Strikes: ${you.mix}`));
    if (showLast && you.last) side.append(lastLine(doc, you.last));
    return side;
}

function card(doc, o, showLast = false, inspection = null) {
    const c = make(doc, 'article', 'versus-card');
    c.dataset.threat = o.threat.level;
    c.dataset.known = String(o.known);
    c.dataset.down = String(!!o.down);
    c.dataset.combatSubject = o.id;
    c.setAttribute('aria-label', opponentLine(o));
    const name = named(doc, o.name);
    if (inspection) {
        c.classList.add('combat-opponent-row');
        c.dataset.inspected = String(inspection.selected);
        if (inspection.choose) {
            const button = make(doc, 'button', 'versus-inspect', o.name);
            button.type = 'button';
            button.dataset.fightInspect = o.id;
            button.setAttribute('aria-pressed', String(inspection.selected));
            button.setAttribute('aria-label', `Inspect opponent ${inspection.label}`);
            button.onclick = inspection.choose;
            name.replaceChildren(button);
        }
    }
    if (o.opening) name.append(make(doc, 'span', 'fight-opening', 'Opening'));
    c.append(name);
    const details = inspection?.details ?? c;
    let hpInside = null;
    // Numbers as the character knows them (PS130): "Atk ? · ?/? hp" until seen; the hp line keeps only its words (Fresh, Down), one home per fact.
    if (o.numbers && !o.down) {
        // PS237: an unknown names a way to learn it, never the answer.
        const ROUTE = {attack: 'Watch it fight: once it lands a blow you will know how hard it hits.', health: 'Study one, or ask a hunter who has.', 'most health': 'Study one, or ask a hunter who has.'};
        const n = make(doc, 'p', 'versus-numbers'), num = (v, field, how = {}) => { const k = knownNumberNode(v, how, {field: `${o.name}: ${field}`, doc}); if (k.dataset.known === 'unknown' && ROUTE[field]) { k.title = `${k.title}. ${ROUTE[field]}`; k.dataset.learnRoute = ''; } return k; };
        n.dataset.versusNumbers = '';
        const t = text => make(doc, 'span', null, text);
        const atk = num(o.numbers.atk, 'attack', o.numbers.atkEstimated ? {known: false} : {});
        if (o.numbers.heardFrom) { atk.title = `${o.name}: attack, from a rumour: ${o.numbers.heardFrom} It may be wrong.`; atk.dataset.heard = ''; }
        // PS238: what you believed, struck through beside what you learned, so the correction shows.
        const was = Number.isFinite(o.numbers.wasHeard) && Math.round(o.numbers.wasHeard) !== Math.round(o.numbers.atk) ? make(doc, 'span', 'versus-was', `~${Math.round(o.numbers.wasHeard)}`) : null;
        if (was) { was.title = 'What the rumour said.'; }
        n.append(t('Atk '), ...(was ? [was, t(' ')] : []), atk, ...(o.numbers.heardFrom ? [t(', from a rumour')] : []));
        // PS297: health as YAIR draws it, its numbers inside the bar (still "?" until known); attack stays a line of its own above it.
        if (!o.hp.qualitative) hpInside = [num(o.numbers.hp, 'health'), t('/'), num(o.numbers.maxHp, 'most health'), t(' hp')];
        details.append(n);
        if (o.sense) { const w = make(doc, 'p', 'versus-sense', `It ${o.sense}.`); w.dataset.versusSense = ''; details.append(w); }
    }
    const known = o.hp.fraction !== null && o.hp.fraction !== undefined, inside = hpInside || (known && !o.down ? o.hp.text : null);
    if (inspection && o.hp.qualitative) {
        const condition = make(doc, 'p', 'versus-hp versus-condition');
        condition.append(make(doc, 'span', '', 'Condition'), make(doc, 'strong', '', o.hp.text));
        c.append(condition);
    } else if (o.down || (o.numbers ? !/\d|\?\?\?/.test(o.hp.text) : !inside)) c.append(make(doc, 'p', 'versus-hp', o.hp.text));
    if (known || hpInside) { const bar = meter(doc, 'versus-bar versus-bar--hp', `${o.name} hit points`, known ? o.hp.fraction : null, o.hp.text, inside); bar.dataset.healthKnown = String(known); c.append(bar); }
    if (o.stamina?.max > 0) details.append(meter(doc, 'versus-bar versus-bar--stamina', `${o.name} stamina`, o.stamina.current / o.stamina.max, o.stamina.text, o.stamina.text));
    { const t = !o.down && timer(doc, o.name, o.ready); if (t) c.append(t); }
    if (o.means) details.append(make(doc, 'p', 'versus-means', o.means));
    if (o.wants) { const w = make(doc, 'p', 'versus-wants', o.wants); w.dataset.versusWants = ''; details.append(w); }
    const chips = make(doc, 'div', 'versus-chips');
    const threat = chip(doc, 'threat', threatText(o.threat), o.threat.level === 'lethal' ? 'fig-fx--pulse' : '');
    if (Number.isFinite(o.threat.blow)) threat.setAttribute('title', BOUND_NOTE);
    chips.append(threat);
    if (o.intent) chips.append(chip(doc, 'intent', `${FIGURE_STATES.unknown} ${o.intent.word}`));
    if (o.odds) { const t = oddsText(o.odds); if (t) chips.append(chip(doc, 'odds', t)); }
    if (o.target === 'unread') chips.append(chip(doc, 'target', `${FIGURE_STATES.unknown} Target unread`));
    for (const t of o.types || []) {
        const c2 = chip(doc, 'type', typeText(t), t.source === 'learned' ? '' : 'versus-chip--revealed');
        c2.dataset.damageType = t.type; c2.dataset.source = t.source; chips.append(c2);
    }
    details.append(chips);
    if (showLast && o.last) c.append(lastLine(doc, o.last));
    return c;
}

export function renderVersusRow(host, versus, {playerHost, inspectedId, onInspect} = {}) {
    const doc = host.ownerDocument;
    const root = make(doc, 'div', 'versus-row');
    root.dataset.opponents = String(versus.opponents.length);
    const sep = make(doc, 'span', 'versus-sep', 'vs');
    sep.setAttribute('aria-hidden', 'true');
    const them = make(doc, 'section', 'versus-side versus-side--them');
    them.setAttribute('aria-label', 'Opponents');
    // D6: the other side is named and counted; fallen foes keep their cards (DU11), so the count is who still stands.
    const standing = versus.opponents.filter(o => !o.down).length;
    const count = `${standing}${standing < versus.opponents.length ? ` of ${versus.opponents.length}` : ''}`;
    them.append(make(doc, 'h5', 'versus-heading versus-heading--them', `${playerHost ? 'Opponents' : 'Against you'} · ${count}`));
    if (playerHost) {
        const inspected = versus.opponents.find(o => o.id === inspectedId) || versus.opponents.find(o => !o.down) || versus.opponents[0];
        const selectedDetails = make(doc, 'section', 'versus-opponent-details');
        for (const [i, o] of versus.opponents.entries()) {
            const selected = o === inspected;
            them.append(card(doc, o, !!versus.showLast, {
                selected,
                details: selected ? selectedDetails : doc.createDocumentFragment(),
                label: `${o.name}, ${i + 1} of ${versus.opponents.length}`,
                choose: versus.opponents.length > 1 && onInspect ? () => onInspect(o.id) : null,
            }));
        }
        if (inspected) {
            selectedDetails.setAttribute('aria-label', `${inspected.name} details`);
            them.append(selectedDetails);
        }
    } else {
        for (const o of versus.opponents) them.append(card(doc, o, !!versus.showLast));
    }
    // PS297: every fighter's box is the same width: your side takes one share, theirs one per card (up to three a row).
    const cols = Math.max(1, Math.min(3, versus.opponents.length));
    root.style.setProperty('--versus-them', `${cols}fr`); them.style.setProperty('--versus-cols', String(cols));
    if (playerHost) {
        playerHost.replaceChildren(youSide(doc, versus.you, !!versus.showLast, true));
        root.classList.add('versus-row--opponents-only');
        root.append(them);
    } else root.append(youSide(doc, versus.you, !!versus.showLast), sep, them);
    host.replaceChildren(root);
    return root;
}
