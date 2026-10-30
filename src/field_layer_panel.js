import {definePanel} from './panel_kit.js';
import {LEVELS} from './field_layer.js';
import {subscribeChange} from './ui_change_signal.js';
import {labelControl} from './ui/panel_sections.js';
const node = (tag, text) => { const n = document.createElement(tag); if (text != null) n.textContent = text; return n; };
// Place service panel (UR1): the levels of the room you stand in, and quoted spill, light, douse and
// sweep commands. Reads the domain projection only; never owns state (AR8).
export function createFieldPanel({read, quote, execute, discovered}) {
    const panel = node('section'); panel.id = 'fields_panel'; panel.className = 'expedition_panel'; panel.dataset.surfaceType = 'place-service';
    const intro = node('p'), table = node('div'), controls = node('div'), notice = node('p');
    notice.setAttribute('role', 'status');
    panel.append(node('h2', 'Spills and smoke'), intro, table, controls, notice);
    let signature = '';
    const run = req => { try { execute(quote(req)); notice.textContent = ''; } catch (e) { notice.textContent = e.message; } render(); };
    function button(label, req, attr) {
        const b = node('button', label), q = quote(req()); b.type = 'button'; b.dataset[attr] = ''; b.disabled = !q.eligible; b.title = q.reason; b.onclick = () => run(req()); return b;
    }
    function render() {
        const v = read(), next = JSON.stringify([v, notice.textContent, controls.querySelector('select')?.value]);
        if (next === signature) return; signature = next;
        intro.textContent = v.here ? 'Loose stock and gas stay where they fall in this room. Smoke rises, fumes sink, and open air clears both.'
            : 'Spill a mixture vial or ingredient pack here to see how it behaves.';
        table.replaceChildren();
        if (v.here) for (const l of [...v.here.levels].reverse()) {
            const row = node('div', `${l.level}: ${l.fallen ? 'fallen in · ' : ''}${l.fire ? 'burning · ' : ''}stock ${l.stock}${l.flammable ? ' (will burn)' : l.damp ? ' (too damp to burn)' : ''} · smoke ${l.smoke} · fumes ${l.fume}`);
            row.dataset.fieldLevel = l.level; row.dataset.fire = String(l.fire); table.append(row);
        }
        if (v.here) for (const e of v.here.edges) if (e.blocked) { const row = node('div', `hatch ${e.between}: barred (${e.sources.join(', ')})`); row.dataset.fieldEdge = e.between; table.append(row); }
        if (v.burningElsewhere.length) table.append(node('p', `Still burning in ${v.burningElsewhere.join(', ')}.`));
        const keepMaterial = controls.querySelector('[data-field-material]')?.value, keepLevel = controls.querySelector('[data-field-level-select]')?.value;
        const focused=document.activeElement?.dataset;
        const focusMaterial=focused&&Object.hasOwn(focused,'fieldMaterial'),focusLevel=focused&&Object.hasOwn(focused,'fieldLevelSelect');
        controls.replaceChildren();
        const material = node('select'); material.dataset.fieldMaterial = '';
        material.setAttribute('aria-label','Stock to spill');material.disabled=!v.materials.length;
        if(!v.materials.length){const empty=node('option','No spillable stock carried');empty.value='';material.append(empty);}
        for (const m of v.materials) { const o = node('option', `${m.name || 'Stock'} (${m.count})`); o.value = m.key; material.append(o); }
        const level = node('select'); level.dataset.fieldLevelSelect = '';
        level.setAttribute('aria-label','Room level');
        LEVELS.forEach((name, i) => { const o = node('option', name); o.value = String(i); level.append(o); });
        if (keepMaterial && [...material.options].some(o => o.value === keepMaterial)) material.value = keepMaterial;
        if (keepLevel) level.value = keepLevel;
        level.onchange = material.onchange = () => { signature = ''; render(); };
        const pourBtn = node('button', 'Spill one'); pourBtn.type = 'button'; pourBtn.dataset.fieldPour = '';
        pourBtn.disabled = !v.materials.length; pourBtn.onclick = () => run({kind: 'pour', key: material.value, level: Number(level.value)});
        pourBtn.title=v.materials.length?'':'Carry a mixture vial or ingredient pack to spill.';
        const pickers=node('div');pickers.className='ui-field-grid';pickers.append(labelControl(material,'Stock to spill'),labelControl(level,'Room level'));
        const actions=node('div');actions.className='ui-quoted-actions';
        actions.append(pourBtn,
            button('Light it with your lamp', () => ({kind: 'light'}), 'fieldLight'),
            button('Douse that level with spring water', () => ({kind: 'douse', level: Number(level.value)}), 'fieldDouse'),
            button('Bar the hatch above that level', () => ({kind: 'seal', level: Number(level.value)}), 'fieldSeal'),
            button('Lift the bar', () => ({kind: 'unseal', level: Number(level.value)}), 'fieldUnseal'),
            button('Sweep up', () => ({kind: 'sweep'}), 'fieldSweep'));
        controls.append(pickers,actions);
        if(focusMaterial)material.focus({preventScroll:true});else if(focusLevel)level.focus({preventScroll:true});
    }
    definePanel({id: 'fields', title: 'Spills and smoke', role: 'actions', node: panel, home: document.getElementById('main_content'),
        discovered, eligible: () => true, unavailableReason: () => 'Carry a mixture or ingredient to spill it here'});
    // Stock and place come from other owners: re-read when the pack or the place changes (declared pending in the spec).
    subscribeChange({id: 'fields', pending: ['inventory', 'place'], refresh: () => render()});
    render(); return {render, reset() { signature = ''; notice.textContent = ''; }};
}
