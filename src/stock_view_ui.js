import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerChangeCounter} from './change_badges.js';
import {node, visibleRenderer} from './reference_kit.js';
import {stockOwnerView} from './stock_view.js';

// O4: carried stock, the open chest and a companion's pack in one reading, with a reviewed
// hand-over and take-back. The transfer itself is the injected stock port (staged, durable).
const read = () => {
    const stock = readPort('stock'), state = readPort('expansion');
    return stock && state ? stockOwnerView({state, ...stock}) : null;
};
const anyone = () => (read()?.holders.length || 0) > 1;

function createStockPanel() {
    const panel = node('section', null, {id: 'stock_view_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const status = node('p', ''); status.setAttribute('role', 'status');
    const body = node('div', null, {class: 'stock-holders'});
    panel.append(node('h2', 'Stock'), node('p', 'Hand goods to a companion as a loan and take them back whole. Favorites and equipped gear stay carried.'), body, status);
    const run = request => {
        const ok = readPort('transferStock', request) === true;
        status.textContent = ok ? 'Moved together. Loans are recorded.' : 'Nothing moved. The stock, sequence or permission changed; look again.';
        panel.render(true);
    };
    const paint = view => {
        body.replaceChildren();
        if(!view) return;
        for(const h of view.holders) {
            const box = node('section', null, {class: 'stock-holder', 'data-stock-holder': h.id});
            box.append(node('h3', `${h.label} · ${h.rows.length}`));
            const list = node('ul', null, {'aria-label': h.label});
            for(const r of h.rows) {
                const li = node('li', null, {'data-stock-key': r.key});
                const notes = [r.favorite && 'favorite', r.equipped && 'equipped', ...r.lentTo.map(l => `${l.count} lent`), ...r.borrowedFrom.map(b => `${b.count} ${b.owner === 'player' ? 'yours, lent' : 'borrowed'}`)].filter(Boolean);
                li.append(node('span', `${r.name} × ${r.count}${notes.length ? ' · ' + notes.join(', ') : ''}`));
                const companion = view.holders.find(x => x.kind === 'companion');
                if(companion && h.id === 'player' && !r.favorite && !r.equipped && !r.borrowedFrom.length) {
                    const b = node('button', `Hand 1 to ${companion.label.replace('’s pack', '')}`, {type: 'button', 'data-stock-action': 'entrust'});
                    b.addEventListener('click', () => run({direction: 'entrust', companionId: companion.id, sequence: view.sequence, items: [{item_key: r.key, count: 1, expectedCount: r.count}]}));
                    li.append(b);
                }
                if(h.kind === 'companion') for(const b of r.borrowedFrom.filter(x => x.owner === 'player')) {
                    const btn = node('button', `Take back ${b.count}`, {type: 'button', 'data-stock-action': 'retrieve'});
                    btn.addEventListener('click', () => run({direction: 'retrieve', companionId: h.id, sequence: view.sequence, items: [{item_key: r.key, loanId: b.loanId, expectedCount: b.count}]}));
                    li.append(btn);
                }
                list.append(li);
            }
            if(!h.rows.length) list.append(node('li', 'Nothing here.'));
            box.append(list); body.append(box);
        }
    };
    panel.render = visibleRenderer(panel, () => read(), paint);
    whenPortsReady(() => panel.render(true));
    definePanel({id: 'stock_view', title: 'Stock', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: anyone, eligible: anyone, emptyText: 'Meet someone who joins you to share stock with them'});
    return panel;
}

let panel = null;
registerDomain({id: 'stock_view', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createStockPanel(); }]});
registerChangeCounter('stock_view', {read: () => { const v = read(); return v ? v.holders.map(h => `${h.id}:${h.rows.map(r => r.key + r.count).join()}`) : null; }, showing: () => !!panel?.checkVisibility?.()});
