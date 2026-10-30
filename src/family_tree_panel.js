import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerChangeCounter} from './change_badges.js';
import {node, syncList, visibleRenderer, plural} from './reference_kit.js';
import {projectFamilyTree, familyTreeRows, kinFromRelationships} from './family_tree.js';
import {familyFigureSpec} from './family_figure.js';
import {renderFigure} from './ui/figure.js';
import {observerView} from './observer_view.js';
import {lineageState} from './lineage_domain.js';
import {foundLine} from './lineage_traits.js';
import {heirLaw, resolveHeir, DEFAULT_HEIR_LAW} from './heir_inheritance.js';
import {parseHeirloomKey} from './heirloom_items.js';

// O5a: Family. RPX21 (docs/representations/FAMILY_TREE.md, proposal): generations drawn as a
// pedigree from the inherited_traits line, the played line as a track, the heir the current
// inheritance law would name, then the frozen line of lives as rows. Shown once a life chronicle
// exists, because that is when the line is founded (same seed, same parents).
function readRows() {
    const tree = projectFamilyTree(readPort('expansion')?.chronicle, 'You');
    return tree.hasFamily ? familyTreeRows(tree) : [];
}
const lawWord = id => id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
export function readFamilyProjection() {
    const state = readPort('expansion'), chronicle = state?.chronicle;
    if (!chronicle) return null;
    const x = chronicle.life?.experience;
    const kin = kinFromRelationships(chronicle).map((k, j) => ({id: `kin:${j}`, ...k}));
    const law = heirLaw(domainRegistry.project('inheritance_law')?.law || DEFAULT_HEIR_LAW);
    // The life-end resolution itself (heir_inheritance.js), so the drawn heir is the one who would inherit.
    const verdict = law.id === DEFAULT_HEIR_LAW ? null : resolveHeir(law, kin.filter(k => k.age != null));
    let items = {};
    try { items = readPort('character')?.getItems?.() || {}; } catch { items = {}; }
    return {
        selfName: 'You',
        // Until the qualities panel founds the slice, draw the line it will found from the same seed.
        line: lineageState() ?? foundLine(String(chronicle.enrolledAt)),
        lives: x?.lineage ? {...x.lineage, generation: x.generation || 1} : null,
        kin,
        succession: {law: lawWord(law.id), reason: law.reason, heirId: verdict?.heir?.id ?? null, heirName: verdict?.heir?.name ?? null, lifeEstate: verdict?.lifeEstate?.name ?? null},
        heirlooms: Object.keys(items).map(parseHeirloomKey).filter(Boolean).map(h => ({name: h.name})),
    };
}
const anyone = () => !!readPort('expansion')?.chronicle;

function createFamilyPanel() {
    const panel = node('section', null, {id: 'family_tree_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const figure = node('div', null, {class: 'family-figure', 'data-family-figure': ''});
    const count = node('p', ''), list = node('ul', null, {'aria-label': 'Line of lives'});
    panel.append(node('h2', 'Family'), figure, node('h3', 'Line of lives'), count, list);
    const render = visibleRenderer(panel, () => {
        const projection = readFamilyProjection(), state = readPort('expansion');
        const knows = key => observerView(state).knows(key);
        return {spec: projection ? familyFigureSpec(projection, {knows}) : null, rows: readRows()};
    }, ({spec, rows}) => {
        if (spec) renderFigure(figure, spec, {text: true}); else figure.replaceChildren(node('p', 'Begin a life chronicle in the People notebook to see your family.'));
        count.textContent = rows.length ? plural(rows.length, 'person', 'people') : '';
        syncList(list, rows, 'Your line begins with you.');
        [...list.children].forEach((li, i) => { if(rows[i]) li.style.paddingLeft = `${rows[i].depth * 1.25}rem`; });
    });
    panel.render = render;
    whenPortsReady(() => render(true));
    definePanel({id: 'family', title: 'Family', role: 'records', node: panel, home: document.getElementById('main_content'),
        discovered: anyone, eligible: anyone, emptyText: 'Begin a life chronicle to see your family here'});
    return panel;
}

let panel = null;
registerDomain({id: 'family', deps: [], initialState: () => null, refresh: () => panel?.render(false), panels: [() => { panel = createFamilyPanel(); }]});
registerChangeCounter('family', {read: () => (readPort('expansion') ? readRows().map(r => r.key) : null), showing: () => !!panel?.checkVisibility?.()});
