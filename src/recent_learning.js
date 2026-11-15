// Session feedback lives on the levelable owner so native craft rollback restores
// it with the XP it describes. The existing save serializer omits it deliberately.
// No timer, save slice or discovery authority. Never record a restoration award.
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
const seen = new WeakMap();
let practice = null;
/** Called when an activity view opens: its label, the skills it trains and the node whose presence means it still runs. */
export function notePractice(label, skillIds, node, at) { practice = {label, skillIds: [...(skillIds || [])], node, at}; }

export function learningNowView(owner, readers, now) {
    const rows = projectRecentLearning(owner, readers);
    const marks = seen.get(owner) || new Map();
    seen.set(owner, marks);
    for(const r of rows) {
        const m = marks.get(r.skillId);
        if(!m) marks.set(r.skillId, {amount: r.amount, at: now, order: marks.size});
        else if(r.amount > m.amount) {m.amount = r.amount; m.at = now;}
    }
    const fresh = r => !Number.isFinite(now) || now - marks.get(r.skillId).at <= NOW_WINDOW;
    const order = (a, b) => marks.get(a.skillId).order - marks.get(b.skillId).order;
    const active = practice?.node?.isConnected ? practice : null;
    // Only skills the character knows: an undiscovered one may be gaining unseen, so silence about it proves nothing.
    const quiet = active && Number.isFinite(now) && now - active.at >= QUIET ? active.skillIds.filter(id => readers.visible(id)).filter(id => {
        const m = marks.get(id);
        return !m || m.at < active.at;
    }) : [];
    const why = quiet.map(id => `${readers.name(id)}${readers.capped?.(id) ? ' (at its highest level)' : ''}`);
    return {now: rows.filter(fresh).sort(order), earlier: rows.filter(r => !fresh(r)).sort(order),
        practice: why.length ? `${active.label}: no ${why.join(', ')} XP since you started.` : ''};
}

const line = r => `${r.name}: +${Math.round(r.amount*10)/10} XP (last award +${Math.round(r.last*10)/10})`;
export function renderRecentLearning(host, owner, readers) {
    const home = host.parentNode;
    if(!home) return;
    let view = home.querySelector(':scope > [data-recent-learning]');
    const v = learningNowView(owner, readers, readers.now?.());
    if(!v.now.length && !v.earlier.length && !v.practice) {view?.remove(); return;}
    if(!view) {view = host.ownerDocument.createElement('section'); view.dataset.recentLearning=''; home.insertBefore(view, host);}
    const text = [`Learning now · gains in the last game hour`, ...(v.now.length ? v.now.map(line) : ['Nothing gained in the last hour.']),
        ...(v.practice ? [v.practice] : []), ...(v.earlier.length ? [`Earlier this session · ${v.earlier.map(r => r.name).join(', ')}`] : [])].join('\n');
    if(view.textContent !== text) view.textContent = text;
    view.style.whiteSpace = 'pre-line';
    view.setAttribute('aria-live','off');
    view.title = 'Actual XP awarded this session, after bonuses and caps. These are gains, not progress to the next level. Reload starts a new session.';
}
