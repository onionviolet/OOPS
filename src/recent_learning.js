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
export function renderRecentLearning(host, owner, readers) {
    const home = host.parentNode;
    if(!home) return;
    let view = home.querySelector(':scope > [data-recent-learning]');
    const rows = projectRecentLearning(owner, readers);
    if(!rows.length) {view?.remove(); return;}
    if(!view) {view = host.ownerDocument.createElement('section'); view.dataset.recentLearning=''; home.insertBefore(view, host);}
    const text = `Recent learning · since this session started or loaded\n${rows.map(r => `${r.name}: +${Math.round(r.amount*10)/10} XP (last award +${Math.round(r.last*10)/10})`).join('\n')}`;
    if(view.textContent !== text) view.textContent = text;
    view.style.whiteSpace = 'pre-line';
    view.setAttribute('aria-live','off');
    view.title = 'Actual XP awarded this session, after bonuses and caps. These are gains, not progress to the next level. Reload starts a new session.';
}
