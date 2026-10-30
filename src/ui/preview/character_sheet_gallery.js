// Character sheet gallery section (figure-gallery.html). The player's sheet beside one met person's,
// with the observer's reads as toggles so one can watch rough reads become exact ones.
// ?only=character-sheet hides the figure fixtures; ?reads=appraise,soul preselects reads for headless evidence; ?theme=neutral switches the theme; ?layout=narrow shows the docked disclosure style.
import {characterSheetView} from '../../character_sheet.js';
import {observerView} from '../../observer_view.js';
import {renderCharacterSheet} from '../character_sheet_view.js';
import {applyCustomizationProfile, defaultCustomizationState, neutralPresentationSettings} from '../../customization_profiles.js';
import {SHEET_PLAYER, SHEET_PERSON, SHEET_READS, SHEET_SELF_READS} from './fixtures/character_sheet.js';

export function mountCharacterSheetGallery(main) {
    const doc = main.ownerDocument;
    const el = (tag, attrs = {}, text = '') => { const n = doc.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); if (text) n.textContent = text; return n; };
    const params = new URLSearchParams(doc.defaultView.location.search);
    const chosen = new Set((params.get('reads') || '').split(',').filter(Boolean));
    const selfChosen = new Set((params.get('self') || '').split(',').filter(Boolean));
    const observer = observerView({});
    const section = el('section', {class: 'fig-gallery-section cs-gallery', 'data-fixture': 'character-sheet'});
    section.append(el('h2', {}, 'Character sheet: you, and someone you met'));
    const controls = el('fieldset', {class: 'cs-gallery-reads'});
    controls.append(el('legend', {}, 'How you are looking at her (combine reads)'));
    const toggles = [];
    for (const r of SHEET_READS.filter(r => r.read)) {
        const label = el('label'), box = el('input', {type: 'checkbox', 'data-read': r.id});
        box.checked = chosen.has(r.id); label.append(box, ` ${r.label}`); controls.append(label); toggles.push([box, r.read]);
    }
    const selfControls = el('fieldset', {class: 'cs-gallery-reads'});
    selfControls.append(el('legend', {}, 'Your own reads'));
    const selfToggles = [];
    for (const r of SHEET_SELF_READS.filter(r => r.read)) {
        const label = el('label'), box = el('input', {type: 'checkbox', 'data-self-read': r.id});
        box.checked = selfChosen.has(r.id); label.append(box, ` ${r.label}`); selfControls.append(label); selfToggles.push([box, r.read]);
    }
    const themes = params.get('theme') === 'neutral' ? ['neutral'] : params.get('theme') === 'luminous' ? ['luminous'] : ['luminous', 'neutral'];
    const cells = [];
    const grid = el('div', {class: 'cs-gallery-grid'});
    for (const theme of themes) {
        const state = defaultCustomizationState();
        if (theme === 'neutral') { state.profiles.Default.settings = neutralPresentationSettings(); delete state.profiles.Default.modules.messages; }
        for (const who of ['self', 'other']) {
            const cell = el('div', {class: 'fig-gallery-cell'}), host = el('div', {class: 'theme-preview'}), module = el('div', {'data-theme-cell': theme, 'data-sheet-cell': who});
            host.append(module); cell.append(el('h3', {}, `${theme === 'luminous' ? 'Luminous Gothic' : 'Neutral'} · ${who === 'self' ? 'You' : 'Met person'}`), host);
            grid.append(cell);
            applyCustomizationProfile(state, {moduleNodes: {vitals: module}});
            // ?size=21 checks the large-text case (player text size setting).
            const size = Number(params.get('size'));
            if (size) { module.style.setProperty('--custom-size', `${size}px`); module.style.setProperty('--custom-small-size', `${Math.round(size * 6 / 7)}px`); }
            cells.push({who, module});
        }
    }
    section.append(controls, selfControls, grid);
    main.append(section);
    // ?only=character-sheet shows this section alone, for 1920×1080 evidence.
    if (params.get('only') === 'character-sheet') for (const other of main.querySelectorAll('.fig-gallery-section:not(.cs-gallery)')) other.hidden = true;
    let last = new Map();
    function draw() {
        const reads = toggles.filter(([box]) => box.checked).map(([, read]) => read);
        const selfReads = selfToggles.filter(([box]) => box.checked).map(([, read]) => read);
        for (const {who, module} of cells) {
            const view = who === 'self' ? characterSheetView(SHEET_PLAYER, observer, selfReads)
                : characterSheetView(SHEET_PERSON, observer, reads, {compareTo: SHEET_PLAYER});
            renderCharacterSheet(module, view, {layout: params.get('layout') === 'narrow' ? 'narrow' : 'wide', text: true});
            // Flourish: rows whose state firmed since the last draw settle once (UR38; off under reduced).
            const before = last.get(module) || {};
            const now = {};
            for (const row of module.querySelectorAll('.cs-row[data-row]')) {
                now[row.dataset.row + row.closest('[data-section]').dataset.section] = row.dataset.state;
                const prior = before[row.dataset.row + row.closest('[data-section]').dataset.section];
                if (last.has(module) && prior !== row.dataset.state) row.dataset.firmed = '';
            }
            last.set(module, now);
        }
    }
    for (const [box] of [...toggles, ...selfToggles]) box.addEventListener('change', draw);
    draw();
}
