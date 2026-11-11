// Gu moves (surface: inside the Gu house, lower-center beginning panel, desktop first, 1920x1080). One row per move recipe:
// whether you know it, each role with the Gu that can fill it and how ready that Gu is, and the forms you can cast now with
// their cost, time and yield. Text is the whole form (UR37); the cast buttons stay in the panel's action list, which quotes
// and refuses with the engine's own reasons. Every node carries a data-gu hook.
export function renderGuMoves(parent, moves) {
    const doc = parent.ownerDocument;
    const el = (tag, text, host, attrs = {}) => { const n = doc.createElement(tag); if(text != null) n.textContent = String(text); for(const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); host.append(n); return n; };
    const root = el('section', null, parent, {class: 'gu-moves', 'data-gu': 'moves', 'aria-label': 'Gu moves'});
    el('h4', 'Moves', root);
    el('p', 'A move drives several Gu at once: one blade at its core, others bending it. Any of your Gu that fits a role can fill it, each costs its own essence, and a hungry one makes the move backfire on the blade.', root);
    const table = el('table', null, root, {class: 'gu-moves-table', 'data-gu': 'moves-table'});
    const head = el('tr', null, el('thead', null, table));
    for(const h of ['Move', 'You', 'Roles and the Gu that fill them', 'Cast now']) el('th', h, head, {scope: 'col'});
    const body = el('tbody', null, table);
    for(const m of moves) {
        const tr = el('tr', null, body, {'data-gu-move': m.id});
        const name = el('th', m.label, tr, {scope: 'row'});
        el('small', m.origin === 'canon' ? ' · as the clan drives it' : ' · your own variation', name, {title: m.reason ?? m.locator ?? ''});
        el('td', m.knowingWord, tr, {'data-gu': 'knowing'});
        const roles = el('td', null, tr); const ul = el('ul', null, roles, {class: 'gu-move-roles'});
        for(const r of m.roles) {
            const li = el('li', `${r.label}${r.optional ? ' (optional)' : ''}: `, ul, {'data-gu-role': r.id});
            const held = r.fillers.filter(x => x.held);
            if(!held.length) el('span', `no Gu of yours fits (${r.fillers.map(x => x.label).join(', ') || 'none in this house'})`, li, {'data-gu': 'no-filler'});
            else el('span', held.map(x => `${x.label}, ${x.word}`).join('; '), li, {'data-gu': 'fillers', ...(held.some(x => x.shortfall) ? {'data-hungry': ''} : {})});
        }
        const forms = el('td', null, tr, {'data-gu': 'forms'});
        if(m.knowing === 'open') { el('span', m.id === 'little_light_moonblade' ? 'Not known: the steward can tell you the pairing.' : m.origin === 'original' ? 'Not known: work it out once you know the pairing and hold the jade.' : 'Hold the Gu to use it.', forms); continue; }
        if(!m.forms.length) { el('span', 'None of your Gu can fill its roles yet.', forms); continue; }
        // GKM15: each form names its fuel route, the rank gap, the typed essence it spends and its backlash odds.
        const fuel = f => f.cost.map(l => l.source === 'stored' ? `a stored rank-${l.grade} vial` : `${l.amount} of your essence${l.gap ? ` (${l.gap} rank${l.gap > 1 ? 's' : ''} under the Gu)` : ''}`);
        const sum = f => { const own = f.cost.filter(l => l.source !== 'stored' && !l.gap).reduce((n, l) => n + l.amount, 0); return [own ? `${own} essence` : null, ...fuel({cost: f.cost.filter(l => l.source === 'stored' || l.gap)})].filter(Boolean).join(' + '); };
        for(const f of m.forms) el('p', `${f.gu.join(' + ')}: ${sum(f)}, ${f.minutes} min, ${f.magnitude} boar${f.magnitude > 1 ? 's' : ''} · ${f.state}${f.wasted.length ? ` · ${f.wasted.join(', ')} adds nothing` : ''}`, forms, {'data-gu-form': f.commandId, 'data-gu-fuel': f.plan, ...(f.state.startsWith('ready') ? {} : {'data-blocked': ''})});
    }
    return root;
}
