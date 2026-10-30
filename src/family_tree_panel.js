import {registerDomain, domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {readPort, whenPortsReady} from './ui_ports.js';
import {registerChangeCounter} from './change_badges.js';
import {node, syncList, visibleRenderer, plural} from './reference_kit.js';
import {projectFamilyTree, familyTreeRows, kinFromRelationships} from './family_tree.js';
import {familyFigureSpec, successionRows} from './family_figure.js';
import {renderFigure, figureText} from './ui/figure.js';
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
    // Ranked by asking the law again without each chosen heir, so the order is the law's own (round 2).
    const order = [];
    for (let pool = law.id === DEFAULT_HEIR_LAW ? [] : kin.filter(k => k.age != null); pool.length && order.length < 5;) {
        const v = resolveHeir(law, pool);
        if (!v?.heir) break;
        order.push({id: v.heir.id, name: v.heir.name, why: String(v.heir.rule || v.heir.relation).replace(/-/g, ' ')});
        pool = pool.filter(k => k.id !== v.heir.id);
    }
    const verdict = law.id === DEFAULT_HEIR_LAW ? null : resolveHeir(law, kin.filter(k => k.age != null));
    let items = {};
    try { items = readPort('character')?.getItems?.() || {}; } catch { items = {}; }
    return {
        selfName: 'You',
        // Until the qualities panel founds the slice, draw the line it will found from the same seed.
        line: lineageState() ?? foundLine(String(chronicle.enrolledAt)),
        lives: x?.lineage ? {...x.lineage, generation: x.generation || 1} : null,
        kin,
        succession: {law: lawWord(law.id), reason: law.reason, order, heirId: verdict?.heir?.id ?? null, heirName: verdict?.heir?.name ?? null, lifeEstate: verdict?.lifeEstate?.name ?? null},
        heirlooms: Object.keys(items).map(parseHeirloomKey).filter(Boolean).map(h => ({name: h.name})),
    };
}
// Succession as a ranked list (round 2: a ranked list answers "who next" better than a picture).
function paintSuccession(host, s) {
    if (!s) { host.replaceChildren(); return; }
    const rows = successionRows(s);
    const ol = node('ol', null, {'aria-label': 'Heirs in order'});
    for (const r of rows) ol.append(node('li', `${r.name} · ${r.why}`));
    host.replaceChildren(node('h3', 'Who would inherit'), node('p', `${s.law}: ${s.reason}`),
        rows.length ? ol : node('p', 'This law names no heir from your kin: the estate goes to a taught apprentice, else to the next of kin.'),
        ...(s.lifeEstate ? [node('p', `${s.lifeEstate} keeps the house for life.`)] : []));
}
const anyone = () => !!readPort('expansion')?.chronicle;

function createFamilyPanel() {
    const panel = node('section', null, {id: 'family_tree_panel', class: 'reference-panel expedition_panel'});
    panel.dataset.surfaceType = 'reference';
    const figure = node('div', null, {class: 'family-figure', 'data-family-figure': ''});
    const heirs = node('section', null, {'data-family-succession': '', 'aria-label': 'Who would inherit'});
    const textForm = node('details', null, {open: ''}), text = node('pre', '', {class: 'fig-text'});
    textForm.append(node('summary', 'Read as text'), text);
    const count = node('p', ''), list = node('ul', null, {'aria-label': 'Line of lives'});
    panel.append(node('h2', 'Family'), node('p', 'Your line as far as you know it, and who would inherit if this life ended now.'),
        heirs, figure, textForm, node('h3', 'Line of lives'), count, list);
    const render = visibleRenderer(panel, () => {
        const projection = readFamilyProjection(), state = readPort('expansion');
        const knows = key => observerView(state).knows(key);
        return {spec: projection ? familyFigureSpec(projection, {knows}) : null, succession: projection?.succession ?? null, rows: readRows()};
    }, ({spec, succession, rows}) => {
        paintSuccession(heirs, succession);
        if (spec) { renderFigure(figure, spec); text.textContent = figureText(spec); textForm.hidden = false; }
        else { figure.replaceChildren(node('p', 'Begin a life chronicle in the People notebook to see your family.')); textForm.hidden = true; }
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
