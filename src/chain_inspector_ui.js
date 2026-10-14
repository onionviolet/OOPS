import {projectChains} from './chain_inspector.js';

// Mounted by the existing harvest developer surface. Only disclosure toggles;
// there are no game commands, storage calls or mutable owner bindings here.
export function createChainInspector({container, read, developer = false}) {
    if (developer !== true) return {render(){}};
    const panel = document.createElement('details');
    panel.id = 'harvest_inspector';
    panel.style.cssText = 'padding:8px;border:1px solid var(--border-color,#888);margin:6px 0;font-size:13px;background:var(--panel-bg,#20242a);color:var(--text-color,#eee);';
    const title = document.createElement('summary');
    title.textContent = 'Developer chain inspector · retained truth · read only';
    const content = document.createElement('div');
    panel.append(title, content);
    let signature = '';
    function render() {
        if (!panel.isConnected) container.append(panel);
        if (!panel.open) return;
        const chains = projectChains(read(), {developer});
        const next = JSON.stringify(chains);
        if (next === signature) return;
        signature = next;
        const expanded = new Map([...content.querySelectorAll('details')].map(n => [n.dataset.chain,n.open]));
        content.replaceChildren();
        const note = document.createElement('p');
        note.textContent = 'M1 semantic roles over existing owners. Developer truth can include undiscovered facts. Closing or opening this lens changes no game state. Scroll inside to inspect each chain.';
        content.append(note);
        const columns = document.createElement('div');
        columns.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr));gap:12px;';
        for (const chain of chains) {
            const section = document.createElement('details');
            section.dataset.chain = chain.id;
            section.open = expanded.get(chain.id) ?? true;
            const summary = document.createElement('summary');
            summary.textContent = chain.label;
            summary.style.cssText = 'font-weight:bold;padding:6px 0;';
            section.append(summary);
            for (const row of chain.rows) {
                const line = document.createElement('div');
                line.dataset.chainRole = row.role;
                line.style.cssText = 'border-top:1px solid #777;padding:6px 0;overflow-wrap:anywhere;white-space:pre-wrap;line-height:1.4;';
                const heading = document.createElement('strong');
                heading.textContent = row.role + ' · ' + row.ref;
                const detail = document.createElement('div'); detail.textContent = row.detail;
                line.append(heading,detail);
                if (row.why) {const why=document.createElement('div');why.textContent='Why: '+row.why;line.append(why);}
                section.append(line);
            }
            columns.append(section);
        }
        content.append(columns);
    }
    panel.addEventListener('toggle', () => {
        // Use the desktop screen for debug data while keeping the same disclosure.
        panel.style.position = panel.open ? 'fixed' : '';
        panel.style.inset = panel.open ? '6vh 4vw auto' : '';
        panel.style.maxHeight = panel.open ? '84vh' : '';
        panel.style.overflow = panel.open ? 'auto' : '';
        panel.style.zIndex = panel.open ? '10000' : '';
        render();
    });
    container.append(panel);
    return {render};
}
