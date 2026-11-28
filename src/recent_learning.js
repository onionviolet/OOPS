// Session feedback lives on the levelable owner so native craft rollback restores
// it with the XP it describes. The existing save serializer omits it deliberately.
// No timer, save slice or discovery authority. Never record a restoration award.
import {panelSection, infoRow, chip, reasonLine} from './ui/panel_sections.js';
import {practiceCauseLines, practiceCause} from './practice_causes.js';
import {knownNumber} from './ui/known_number.js';

export function recordLearning(owner, skillId, amount, {loading = false} = {}) {
    if(loading || !Number.isFinite(amount) || amount <= 0) return;
    const recent = owner.recent_learning ||= [];
    const previous = recent.find(r => r.skillId === skillId);
    if(previous) {previous.amount += amount; previous.last = amount;}
    else recent.push({skillId, amount, last: amount});
    // Distinct native skill IDs bound this session record. Keep cumulative gains
    // for every awarded skill: unknown practice must never evict a visible row.
    // Discovery filtering belongs exclusively to the projection below.
}
export function projectRecentLearning(owner, {visible, name}) {
    return (owner.recent_learning || []).filter(r => visible(r.skillId)).map(r => ({
        skillId:r.skillId, name:name(r.skillId), amount:r.amount, last:r.last,
    }));
}
// PS146: "Learning now" holds the skills that gained within the last game hour, in the order they joined, so a skill does
// not drop out between two spaced gains; the rest of the session folds under "Earlier this session". The practice line
// says when the activity you chose has given one of its skills nothing since it started, and names a level cap when that
// is the reason. It states what was observed, never a guessed cause.
const NOW_WINDOW = 60, QUIET = 30;
const seen = new WeakMap(), levelUps = new WeakMap(); // session-only, never on the owner (saves must not carry them)
let practice = null;
/** Called when an activity view opens: its label, the skills it trains and the node whose presence means it still runs. */
export function notePractice(label, skillIds, node, at) { practice = {label, skillIds: [...(skillIds || [])], node, at}; }

export function learningNowView(owner, readers, now) {
    const rows = projectRecentLearning(owner, readers);
    const marks = seen.get(owner) || new Map();
    seen.set(owner, marks);
    const finite = Number.isFinite(now);
    for(const r of rows) {
        const m = marks.get(r.skillId), level = readers.level?.(r.skillId);
        if(!m) {marks.set(r.skillId, {amount: r.amount, at: now, order: marks.size, since: {at: now, amount: r.amount}, level}); continue;}
        if(r.amount > m.amount) {
            // PS204: a skill that rejoins after a quiet hour starts a new rate; one still gaining keeps its run.
            if(finite && now - m.at > NOW_WINDOW) m.since = {at: m.at, amount: m.amount};
            m.amount = r.amount; m.at = now;
        }
        if(Number.isFinite(level) && Number.isFinite(m.level) && level > m.level) levelUps.set(owner, {skillId: r.skillId, level, at: now});
        if(Number.isFinite(level)) m.level = level;
    }
    const fresh = r => !finite || now - marks.get(r.skillId).at <= NOW_WINDOW;
    const order = (a, b) => marks.get(a.skillId).order - marks.get(b.skillId).order;
    const active = practice?.node?.isConnected ? practice : null;
    // Rate per game hour over the run so far; under ten minutes of run it is not known yet ("?").
    const rate = r => {const m = marks.get(r.skillId), span = finite ? now - m.since.at : 0; return span >= 10 ? (m.amount - m.since.amount) / span * 60 : null;};
    const from = r => active && active.skillIds.includes(r.skillId) ? active.label : '';
    // Only skills the character knows: an undiscovered one may be gaining unseen, so silence about it proves nothing.
    const quiet = active && finite && now - active.at >= QUIET ? active.skillIds.filter(id => readers.visible(id)).filter(id => {
        const m = marks.get(id);
        return !m || m.at < active.at;
    }) : [];
    const why = quiet.map(id => `${readers.name(id)}${readers.capped?.(id) ? ' (at its highest level)' : ''}`);
    const up = levelUps.get(owner), upFresh = up && readers.visible(up.skillId) && (!finite || now - up.at <= NOW_WINDOW);
    return {now: rows.filter(fresh).sort(order).map(r => ({...r, rate: rate(r), from: from(r)})), earlier: rows.filter(r => !fresh(r)).sort(order),
        // PS168: a quiet skill whose known gate is shut says the cause after the observation (practice_causes.js).
        practice: why.length ? [`${active.label}: no ${why.length > 1 ? `${why.slice(0, -1).join(', ')} or ${why.at(-1)}` : why[0]} XP since you started.`, ...practiceCauseLines(quiet.filter(id => !readers.capped?.(id)), readers.practiceFacts?.(active) ?? {}, readers.name)].join(' ') : '',
        // One structured row per quiet skill: why, as far as the character can see (capped, a shut gate, or not known).
        stalls: quiet.map(id => {const capped = !!readers.capped?.(id), cause = capped ? '' : practiceCause(id, readers.practiceFacts?.(active) ?? {});
            return {skillId: id, name: readers.name(id), reason: capped ? 'capped' : cause ? 'gate' : 'unknown', cause: capped ? 'at its highest level' : cause};}),
        stalledIn: quiet.length ? active.label : '',
        practising: active ? active.skillIds.filter(id => readers.visible(id)) : [],
        levelUp: upFresh ? `${readers.name(up.skillId)} reached ${up.level}` : ''};
}

// PS204/PS146: the section sits in the room under the Skills list and shows only with something to say: what is practising
// now (with its rate and the activity it comes from), why a chosen practice is not paying, and one quiet line for a level
// just reached. Built from the shared kit rows (panel_sections.js) and knownNumber, so the Skills box keeps one grammar.
// PS280 (asked by UI cohesion): the skill rows of the practice running now carry data-practising; their CSS gives them the
// accent. Set while it runs, cleared when it stops. The rows are display.js's `.skill_div[data-skill]`.
function markPractising(doc, ids) {
    const want = new Set(ids);
    for(const row of doc.querySelectorAll('.skill_div[data-practising]')) if(!want.has(row.dataset.skill)) delete row.dataset.practising;
    for(const row of doc.querySelectorAll('.skill_div[data-skill]')) if(want.has(row.dataset.skill) && !('practising' in row.dataset)) row.dataset.practising = '';
}
export function renderRecentLearning(host, owner, readers) {
    const home = host.parentNode;
    if(!home) return;
    const doc = host.ownerDocument;
    let view = home.querySelector(':scope > [data-recent-learning]');
    const v = learningNowView(owner, readers, readers.now?.());
    markPractising(doc, v.practising);
    if(!v.now.length && !v.practice && !v.levelUp) {view?.remove(); return;}
    const key = JSON.stringify([v.now.map(r => [r.skillId, r.name, r.rate == null ? null : Math.round(r.rate * 10), r.from]), v.practice, v.stalls, v.levelUp]);
    if(view && view.dataset.key === key && view.previousElementSibling === host) return;
    const {node, body} = panelSection('Learning now', {className: 'learning-now'});
    node.dataset.recentLearning = ''; node.dataset.key = key; node.setAttribute('aria-live', 'off');
    for(const r of v.now) {
        const rate = knownNumber(r.rate, {digits: 1});
        const chips = [chip(`${rate} XP an hour`, {guess: rate === '?', title: rate === '?' ? 'XP an hour: not known yet; it shows after ten minutes of practice' : 'XP an hour over this run of practice, after bonuses and caps'})];
        if(r.from) chips.push(chip(`from ${r.from}`));
        body.append(infoRow({label: r.name, chips}));
    }
    // Learning now stall reasons: the observation once, then each quiet skill as its own row with its reason as a chip.
    if(v.stalls.length) {
        body.append(reasonLine(`${v.stalledIn}: no XP since you started for`));
        for(const st of v.stalls) {
            const row = infoRow({label: st.name, chips: [chip(st.cause || 'cause not known', {guess: !st.cause,
                title: st.cause ? '' : 'Only a cause the skill itself names is shown; nothing it states is holding it back here.'})]});
            row.dataset.stall = st.reason; body.append(row);
        }
    }
    if(v.levelUp) {const p = doc.createElement('p'); p.className = 'learning-now-level'; p.textContent = v.levelUp; body.append(p);}
    if(view) view.replaceWith(node); else host.after(node);
}
