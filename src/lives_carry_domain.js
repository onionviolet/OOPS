import {registerDomain} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {node, visibleRenderer, plural} from './reference_kit.js';
import {readPort} from './ui_ports.js';
import {carryLedger, carryLedgerWorlds} from './carry_ledger.js';
import {createDiscoveryCodex, validateDiscoveryCodex, observeSaveDiscoveries, discoveryCount} from './discovery_codex.js';
import {HEIR_LAWS, DEFAULT_HEIR_LAW, heirLaw} from './heir_inheritance.js';

// IM8 law dial, IM21 carry ledger and OG18 discovery codex, wired as two save
// slices (`discovery_codex`, `inheritance_law`) and one records panel. The
// codex is observed from the save at write time and never rolls events.
// Both slices are absent in older saves and load from their defaults.
let codex = createDiscoveryCodex(), law = DEFAULT_HEIR_LAW, panel = null;
const KIND_WORDS = {item: ['item', 'items'], lesson: ['lesson', 'lessons'], knowledge: ['known thing', 'known things']};

// Registry save hooks run before the envelope holds inventories or the
// chronicle, so the codex reads the carried items and chronicle through the
// UI ports (chest goods count once they have been carried).
const liveSave = () => ({
    inventories: {person: {main_character: readPort('character')?.getItems?.() ?? {}}},
    expansion: readPort('expansion')});
export const codexSummary = () => Object.fromEntries(Object.keys(KIND_WORDS).map(k => [k, discoveryCount(codex, k)]));
export const currentHeirLaw = () => law;
const WORLD_NAMES = {'base.frontier': 'Frontier', 'book.paradise.hub': 'Paradise hub'};

registerDomain({id: 'discovery_codex', initialState: createDiscoveryCodex,
    save: () => (codex = observeSaveDiscoveries(codex, liveSave())),
    validate: validateDiscoveryCodex,
    load: slice => {codex = slice ? structuredClone(slice) : createDiscoveryCodex();},
    refresh: () => panel?.render(false),
    projection: () => ({total: discoveryCount(codex), counts: codexSummary()})});

registerDomain({id: 'inheritance_law', initialState: () => ({schema: 1, law: DEFAULT_HEIR_LAW}),
    // The default is not written, so saves that never touch the dial stay as they were.
    save: () => (law === DEFAULT_HEIR_LAW ? undefined : {schema: 1, law}),
    validate: slice => {if(slice != null) {if(slice.schema !== 1 || typeof slice.law !== 'string') throw new Error('Invalid inheritance law.'); heirLaw(slice.law);}},
    load: slice => {law = slice?.law ?? DEFAULT_HEIR_LAW;},
    commands: {set: id => {heirLaw(id); law = id; panel?.render(true);}},
    refresh: () => panel?.render(false),
    projection: () => ({law, reason: HEIR_LAWS[law].reason, options: Object.values(HEIR_LAWS).map(l => ({id: l.id, reason: l.reason}))})});

registerDomain({id: 'carry_ledger',
    projection: worldId => carryLedger(worldId ?? 'base.frontier'),
    panels: [() => {panel = createPanel();}]});

function createPanel() {
    const root = node('section', null, {id: 'lives_carry_panel', class: 'reference-panel expedition_panel'});
    const codexLine = node('p'), lawSelect = node('select', null, {id: 'lives_carry_law', 'aria-label': 'Inheritance law'}),
        lawLabel = node('label', 'Inheritance law', {for: 'lives_carry_law'}), lawReason = node('p'), lawNote = node('p', '', {role: 'status', 'aria-live': 'polite'}), ledger = node('div');
    for(const l of Object.values(HEIR_LAWS)) lawSelect.append(node('option', l.id === DEFAULT_HEIR_LAW ? `${l.id} (default)` : l.id, {value: l.id}));
    lawSelect.addEventListener('change', () => {
        try {law = lawSelect.value; heirLaw(law); lawNote.textContent = 'Kept with your next save. It applies when this life ends.';} catch(e) {lawNote.textContent = e.message;}
        render(true);
    });
    root.append(node('h2', 'Lives & inheritance'),
        node('p', 'What each life hands on, and what crosses at each boundary. These are the defaults for each world; a world can change them for an in-world reason.'),
        codexLine, lawLabel, lawSelect, lawReason, lawNote, ledger);
    const render = visibleRenderer(root, () => ({codex: codexSummary(), law}), view => {
        const parts = Object.entries(KIND_WORDS).map(([k, [one, many]]) => plural(view.codex[k], one, many));
        codexLine.textContent = `Discovery codex, kept across every life: ${parts.join(', ')} (${Object.values(view.codex).reduce((a, b) => a + b, 0)} in all).`;
        if(lawSelect.value !== view.law) lawSelect.value = view.law;
        lawReason.textContent = `${view.law}: ${HEIR_LAWS[view.law].reason}${view.law === DEFAULT_HEIR_LAW ? '' : ' It needs recorded kin; with none, the usual successor takes over.'}`;
        ledger.replaceChildren(...carryLedgerWorlds().map((id, i) => {
            const d = node('details'); d.open = i === 0; d.append(node('summary', `What crosses · ${WORLD_NAMES[id] || id}`));
            for(const sec of carryLedger(id)) {
                const ul = node('ul', null, {'aria-label': `${WORLD_NAMES[id] || id}, ${sec.boundary}`});
                for(const r of sec.rows) ul.append(node('li', `${r.what}: ${r.carries}, ${r.scope}. ${r.note}`));
                d.append(node('h3', sec.boundary), ul);
            }
            return d;
        }));
    });
    definePanel({id: 'lives_carry', title: 'Lives & inheritance', role: 'records', node: root, home: document.getElementById('main_content'),
        discovered: () => true, eligible: () => true});
    return {render};
}
