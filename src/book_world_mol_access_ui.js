import {definePanel} from './panel_kit.js';
import {node, visibleRenderer, minutesText} from './reference_kit.js';
// Surface type: records panel in the main workspace (UR1), desktop 1920x1080 first, mobile deferred. Read-only: it reports; Ilsa's desk and the
// library commands own every action. Opens only inside Cyoria.
export function createMolAccessPanel({read, eligible}) {
    const root = node('section', null, {id: 'mol_access_panel', class: 'reference-panel expedition_panel', 'data-surface-type': 'records'});
    const access = node('div'), loop = node('div');
    root.append(node('h2', 'Cyoria · access and loops'), access, loop);
    const list = (title, rows) => { const d = node('div'); d.append(node('h4', title)); const ul = node('ul'); for(const r of rows) ul.append(node('li', r)); d.append(ul); return d; };
    const render = visibleRenderer(root, read, v => {
        const a = v.access;
        access.replaceChildren(node('h3', 'Academy access'));
        if(!a.granted) access.append(node('p', 'You hold no academy pass. Ilsa at the guest desk issues the guest pass; it opens the guest library and supervised reconstruction, not the academy itself.', {'data-mol-access': 'none'}));
        else {
            const word = {active: 'Open', expiring: 'Open, lapsing soon', expired: 'Lapsed', suspended: 'Suspended'}[a.state];
            access.append(node('p', `${a.label} from ${a.issuer}: ${word}.${a.state === 'active' ? '' : ' ' + a.why}`, {'data-mol-access': a.state}),
                node('p', `Term: ${minutesText(a.term.value)} from issue (${a.term.reason})`, {class: 'expedition_preview'}),
                list(a.opens.length ? 'This pass opens' : 'Closed while it is not open', a.opens.length ? a.opens.map(s => s.label) : a.closed.slice(0, 3)),
                list('It never covered', a.opens.length ? a.closed : a.closed.slice(3)),
                list('Your own skill, kept either way', a.retained.length ? a.retained.map(r => `${r.label} (${r.detail})`) : ['Nothing trained yet; the pass does not teach, you do.']));
        }
        const l = v.loop;
        loop.replaceChildren(node('h3', 'If this life restarts'), node('p', `${l.source}. ${l.reason}`, {'data-mol-loop': l.mode}),
            list('Resets', l.resets), list('Carries over', l.carries));
    });
    definePanel({id: 'mol_access', title: 'Cyoria access and loops', role: 'records', node: root, home: document.getElementById('main_content'),
        discovered: () => eligible(), eligible: () => eligible(), unavailableReason: () => 'Visible while you are in Cyoria.'});
    return {render};
}
