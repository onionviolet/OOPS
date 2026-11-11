// Gu house (surface: lower-center beginning panel, desktop first). Gauges, per-Gu feed timers and a stipend ledger,
// drawn from keeperHouseView(). Text is the whole form; the meters only repeat it (UR37). Every node carries a data-gu hook.
const span = minutes => minutes >= 1440 ? `${(minutes / 1440).toFixed(minutes % 1440 ? 1 : 0)} days` : minutes >= 60 ? `${Math.round(minutes / 60)} hours` : `${Math.max(0, minutes)} min`;
const signed = n => n > 0 ? `+${n}` : String(n);
export function renderGuHouse(parent, house) {
    const doc = parent.ownerDocument;
    const el = (tag, text, host = parent, attrs = {}) => { const n = doc.createElement(tag); if(text != null) n.textContent = String(text); for(const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); host.append(n); return n; };
    const root = el('section', null, parent, {class: 'gu-house', 'data-gu': 'root', 'aria-label': 'Gu house'});
    el('h4', 'Gu house', root);
    const g = house.gauge;
    if(g) {
        const wrap = el('div', null, root, {'data-gu': 'aperture'});
        el('p', `Aperture · ${g.text}`, wrap);
        const m = el('meter', null, wrap, {min: 0, max: g.max, value: g.now, 'aria-label': 'Primeval essence reserve', 'data-gu': 'essence-meter'});
        m.textContent = `${g.now} of ${g.max}`;
        el('p', g.now >= g.max ? 'The sea is full at your aptitude cap; more rest cannot raise it.' : `Next unit in ${span(g.nextRegenIn)}. A Gu activation costs ${g.perActivation}.`, wrap);
    }
    el('p', house.feedingCap.line, root, {'data-gu': 'feeding-cap', role: 'status'});
    const table = el('table', null, root, {class: 'gu-timers', 'data-gu': 'timers'});
    const head = el('tr', null, el('thead', null, table));
    for(const h of ['Gu', 'Condition', 'Larder', 'Next meal', 'Hunger', 'Work']) el('th', h, head, {scope: 'col'});
    const body = el('tbody', null, table);
    for(const r of house.gu) {
        const tr = el('tr', null, body, {'data-gu-row': r.id, ...(r.kept && r.alive && !r.willEat ? {'data-hungry': ''} : {})});
        const head = el('th', `${r.label}${r.refined ? ' (refined)' : ''}`, tr, {scope: 'row'});
        // CPR9/CPR10: grain, holder and custody from the shared being record, one home beside the care numbers.
        if(r.being) el('small', `${r.being.grain} · with ${r.being.holder} · ${r.being.tie.line}`, head, {'data-gu': 'being', title: r.being.custody.join(' ')});
        if(!r.kept) { const c = el('td', `In the clan house · ${r.price ? `${r.price} stones to take in` : 'issued free'} · eats ${r.meal} ${r.food} every ${r.everyDays} day${r.everyDays > 1 ? 's' : ''}`, tr, {colspan: 5}); c.dataset.gu = 'unheld'; continue; }
        if(!r.alive) { el('td', 'Dead', tr, {colspan: 5, 'data-gu': 'dead'}); continue; }
        const cond = el('td', null, tr); const m = el('meter', `${r.condition} of ${r.maxCondition}`, cond, {min: 0, max: r.maxCondition, low: 2, optimum: r.maxCondition, value: r.condition, 'aria-label': `${r.label} condition`}); el('span', ` ${r.condition}/${r.maxCondition}`, cond);
        el('td', `${r.stock} ${r.food}${r.altFood ? ` + ${r.altStock} ${r.altFood}` : ''} · ${r.mealsStocked} meal${r.mealsStocked === 1 ? '' : 's'}${r.order ? ` · standing order on (bag covers ${r.bagMeals})` : ''}`, tr);
        el('td', `${span(r.nextMealIn)} · eats ${r.meal}${r.willEat ? '' : ' (not enough: it will miss this meal)'}`, tr);
        el('td', r.condition <= 1 && !r.lethal ? 'Starved out now: feed it to recover' : `${r.lethal ? 'Dies' : 'Starved out'} in ${span(r.lethal ? r.starvesIn : r.starvedOutIn)} if unfed${r.sustained === false ? ' · beyond what the stipend feeds' : ''}`, tr, {'data-gu': 'starves-in'});
        el('td', `${r.ability} · ${r.yield} stone${r.yield > 1 ? 's' : ''} a window`, tr, {'data-gu': 'work'});
    }
    const led = el('section', null, root, {'data-gu': 'ledger', 'aria-label': 'Stipend and stone ledger'});
    const a = house.ledger.agreement;
    el('p', `Stones in hand: ${house.stones}. ${a.why}.${house.ledger.nextStipendIn == null ? '' : ` Next payment in ${span(house.ledger.nextStipendIn)}.`}`, led, {'data-gu': 'agreement'});
    // OPN2: the entry-by-entry ledger folds behind a disclosure; the agreement line above and the net below stay in view.
    const lines = el('details', null, led, {class: 'gu-ledger-details'}); el('summary', 'Ledger entries', lines);
    const lt = el('table', null, lines, {class: 'gu-ledger', 'data-gu': 'ledger-rows'});
    const lh = el('tr', null, el('thead', null, lt)); for(const h of ['Entry', 'Stones', 'Detail']) el('th', h, lh, {scope: 'col'});
    const lb = el('tbody', null, lt);
    for(const l of house.ledger.lines) { const tr = el('tr', null, lb); el('th', l.label, tr, {scope: 'row'}); el('td', signed(l.amount), tr); el('td', l.note, tr); }
    el('p', `Net since the start: ${signed(house.ledger.net)} stones.`, led, {'data-gu': 'net'});
    return root;
}
