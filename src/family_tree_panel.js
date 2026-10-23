import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerChangeCounter} from './change_badges.js';
import {node, syncList, visibleRenderer, plural} from './reference_kit.js';
import {projectFamilyTree, familyTreeRows} from './family_tree.js';

// O5a: Family. The line of lives behind this one, read from the frozen lineage in the
// Chronicle. Hidden until a life has been inherited (nothing to show before then).
function readRows() {
    const tree = projectFamilyTree(readPort('expansion')?.chronicle, 'You');
    return tree.hasFamily ? familyTreeRows(tree) : [];
}
const anyone = () => readRows().length > 0;

function createFamilyPanel() {
    const panel = node('section', null, {id: 'family_tree_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const count = node('p', ''), list = node('ul', null, {'aria-label': 'Family tree'});
    panel.append(node('h2', 'Family'), count, list);
    const render = visibleRenderer(panel, readRows, rows => {
        count.textContent = rows.length ? plural(rows.length, 'person', 'people') : '';
        syncList(list, rows, 'Your line begins with you.');
        [...list.children].forEach((li, i) => { if(rows[i]) li.style.paddingLeft = `${rows[i].depth * 1.25}rem`; });
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'family', title: 'Family', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: anyone, eligible: anyone, emptyText: 'Inherit a life to see your line here'});
    return panel;
}

let panel = null;
registerDomain({id: 'family', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createFamilyPanel(); }]});
registerChangeCounter('family', {read: () => (readPort('expansion') ? readRows().map(r => r.key) : null), showing: () => !!panel?.checkVisibility?.()});
