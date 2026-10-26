import {createControlBox, controlBoxLabel} from './ui/control_box.js';

// UM5 (2026-10-22, proposal): Skills, Journal and Crafting use the shared control box (CTL1, UX24)
// instead of their own strips. As in shell_control_boxes.js, each box moves the panel's native
// controls into its popover and back, so every control keeps its owner and no state moves (CB5).
// Frequent categories stay inline (CB2): Skills/Stances/Magic, the Journal tabs and the crafting
// stations. Shell only (GU5): outside the parity shell every control returns to its native home.
// Leaf module: DOM only, no game imports.

// Label helpers (CB4): each names the choices that differ from the default.
export const skillsLabel = ({sort, hideMax}) => controlBoxLabel([{text: sort}, {text: 'Max level hidden', isDefault: !hideMax}], sort);
export const questsLabel = ({hideCompleted}) => controlBoxLabel([{text: 'Completed hidden', isDefault: !hideCompleted}], 'All quests');
export const craftingLabel = ({page, pages, makeable}) => controlBoxLabel([{text: page, isDefault: pages < 2}, {text: 'Makeable now', isDefault: !makeable}], 'All recipes');

const byId = id => document.getElementById(id);
const pressed = strip => strip?.querySelector('.active_selection_button')?.textContent.trim() || '';
const shown = node => !!node && node.style.display !== 'none' && !node.hidden;

export function mountShellStripBoxes() {
    const parity = () => byId('main_content')?.dataset.parity === 'r3';
    // Each entry: the box, the native nodes it holds (with a mark at each native home) and where
    // its button sits in the shell.
    const strips = [
        {box: createControlBox({id: 'skills', title: 'Skills view', triggerLabel: 'Sort / filter', placement: 'below'}), nodes: ['skill_sorting_buttons', 'skill_hiding_div'],
            host: () => document.querySelector('.workspace-module[data-module="skills"] > .workspace-module-header'),
            label() { const sort = pressed(byId('skill_sorting_buttons')).replace(/^Sort by /i, '') || 'name';
                const text = skillsLabel({sort: sort[0].toUpperCase() + sort.slice(1), hideMax: !!byId('options_hide_max_level_skills')?.checked});
                return [text, `${text}. Opens skill sorting and Hide max level skills.`]; }},
        {box: createControlBox({id: 'quests', title: 'Quests view', triggerLabel: 'Filter', placement: 'below'}), nodes: ['quest_hiding_div'],
            host: () => document.querySelector('.workspace-module[data-module="records"] > .workspace-module-header'),
            visible: () => byId('journal_show_quests')?.classList.contains('active_selection_button'),
            label() { const text = questsLabel({hideCompleted: !!byId('quest_hiding_button')?.checked}); return [text, `${text}. Opens Hide completed.`]; }},
        {box: createControlBox({id: 'crafting', title: 'Recipe view', triggerLabel: 'Filter', placement: 'below'}), nodes: ['crafting_subpage_buttons', 'crafting_makeable_filter'],
            row: true, host: () => byId('crafting_window'), before: () => byId('crafting_filter_empty'),
            label() { const pages = [...(byId('crafting_subpage_buttons')?.children || [])].filter(shown).length;
                const text = craftingLabel({page: pressed(byId('crafting_subpage_buttons')), pages, makeable: !!byId('crafting_makeable_filter')?.checked});
                return [text, `${text}. Opens recipe kinds and Makeable now.`]; }},
    ];
    for (const strip of strips) {
        // The Makeable checkbox moves with its label; the other ids are the strips themselves.
        strip.nodes = strip.nodes.map(id => { const n = byId(id); return n?.closest('label.crafting_filter') || n; }).filter(Boolean)
            .map(node => { const mark = document.createComment(`shell:${node.id || node.className}`); node.before(mark); return {node, mark}; });
        if (strip.row) { strip.wrap = document.createElement('div'); strip.wrap.className = 'shell-strip-row'; strip.wrap.append(strip.box.node); }
        strip.box.body.addEventListener('click', () => queueMicrotask(render));
        strip.box.body.addEventListener('change', render);
    }
    let wasParity = null;
    function restore() {
        for (const strip of strips) {
            strip.box.close({restore: false});
            for (const {node, mark} of strip.nodes) if (mark.nextSibling !== node) mark.after(node);
            (strip.wrap || strip.box.node).remove();
        }
    }
    function render() {
        if (!parity()) { if (wasParity !== false) restore(); wasParity = false; return; }
        wasParity = true;
        for (const strip of strips) {
            const host = strip.host(), node = strip.wrap || strip.box.node;
            if (host) {
                if (strip.row) { const before = strip.before?.(); if (before?.parentNode === host) { if (node.nextSibling !== before) before.before(node); } else if (node.parentNode !== host) host.append(node); }
                else if (node.parentNode !== host) host.append(node);
            }
            // Natives move only into a box that is in the page, so their owners always find them by ID.
            if (!node.isConnected) { for (const {node: native, mark} of strip.nodes) if (mark.nextSibling !== native) mark.after(native); continue; }
            for (const {node: native} of strip.nodes) if (native.parentNode !== strip.box.body) strip.box.body.append(native);
            const hidden = strip.visible ? !strip.visible() : false;
            if (node.hidden !== hidden) { node.hidden = hidden; if (hidden) strip.box.close({restore: false}); }
            const [label, description] = strip.label(); strip.box.setLabel(label, description);
        }
    }
    // Native owners change these strips by class and style (tabs, sort and recipe pages); watch
    // only those attributes so a tick that changes nothing writes nothing (UR52).
    const observer = new MutationObserver(() => render());
    for (const id of ['skill_sorting_buttons', 'journal_control_div', 'crafting_subpage_buttons']) { const n = byId(id); if (n) observer.observe(n, {subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden']}); }
    document.addEventListener('workspace-presentation-change', render);
    render();
    return {render, destroy() { observer.disconnect(); document.removeEventListener('workspace-presentation-change', render); restore(); strips.forEach(s => s.box.destroy()); }};
}
