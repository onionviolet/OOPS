// Ready rows from features that already compute their own readiness (direction D, PS57). Each source reads its owner's
// existing reader and adds no rule of its own (AR3):
//   crafting   the recipe rows' readiness marks (display.js update_item_recipe_row_status, UIC172/UIC185), the same marks
//              the tab counts read (crafting_visibility.js paintRecipeTabCounts)
//   gu-care    Fang Yuan's Gu meal windows (ri_lead_day_facts.js riDayNeed): a missed meal is urgent, with the food short
//              named; a meal that is merely due is the life panel's own Feed row, so it is not repeated here
//   spoilage   wolf meat from his patrols (ri_lead_day_facts.js riMeatState over spoilage.js): turning food is urgent
// The life panel's day actions register from their own panel (structured_pack_ui.js) under the id 'life-day'.
import {registerReady, readySources} from './ready_rows.js';
import {readPort} from './ui_ports.js';
import * as riDay from './ri_lead_day_facts.js';
import {wordsFor} from './spoilage.js';
import {expandWorkspaceModule} from './workspace_layout.js';

const openLife = () => expandWorkspaceModule('beginning');

// Crafting: one row per recipe whose row says ready or one material short. A row further off is counted, not listed.
// `namesFor(material)` lists the item names that satisfy a material type ("animal tooth" → "Rat fang", "Wolf fang"), so a
// line that names the item ("Rat fang x2") points at the recipe that asks for the type (PS55).
export function craftingRowsFrom(nodes, namesFor = () => []) {
    const rows = [];
    for (const mark of nodes) {
        const row = mark.closest('[data-crafting_category]') ? mark.parentElement : null;
        if (!row) continue;
        const name = (row.getAttribute('aria-label') || '').split(';')[0].trim();
        if (!name) continue;
        const text = mark.textContent.trim(), ready = mark.dataset.ready === 'true', short = /^needs (\d+) (.+)$/.exec(text);
        // Near means one named thing short ("needs 2 Wool"); "1 material short" names nothing to fetch, so it is further off.
        const state = ready ? 'ready' : short ? 'near' : 'rest';
        rows.push({id: name, label: `Make ${name}`, state, detail: ready ? text : '', gap: state === 'near' ? text : '', uses: short ? [short[2], ...namesFor(short[2])] : [],
            open: () => { window.openCraftingWindow?.(); requestAnimationFrame(() => { row.click?.(); row.scrollIntoView?.({block: 'nearest'}); }); }});
    }
    return rows;
}
// Item names per material type, from the item templates the records port already hands the reference panels.
const namesForType = type => Object.values(readPort('records')?.item_templates || {}).filter(t => t?.material_type === type && t.name).map(t => t.name);
const craftingRows = () => typeof document === 'undefined' ? [] : craftingRowsFrom(document.querySelectorAll('[data-crafting_subcategory] .recipe_readiness'), namesForType);

// Gu meals: only a missed meal, because a meal that is merely due is already the life panel's own ready row. Held counts are
// read where the life keeps its things: the hero's own pack (the ui port 'stock', as the "item." facts read a native inventory)
// or the life's simulation stock. A Gu not held is skipped.
const idOf = key => { try { return JSON.parse(key)?.id; } catch { return key; } };
export const heldIn = (carried, owners, id) => {
    let n = 0; for (const [key, count] of Object.entries(carried || {})) if (idOf(key) === id) n += Number(count) || 0;
    return n || Number(owners?.[JSON.stringify({id})] ?? 0) || 0;
};
export function guCareRows(state, carried = null, withLifeRows = () => readySources().some(s => s.id === 'life-day')) {
    if (state?.actors?.player?.worldId !== 'book.ri.lead.world') return [];
    const known = state.simulation?.knowledge?.player || {}, heldOf = (st, id) => heldIn(carried, st.simulation?.owners?.player, id);
    // While the life panel has not registered its own rows, its "Your day" block already offers Feed when food is held, so this
    // source names only the meals that are short of food (no second Feed button on Here). Once 'life-day' rows exist they merge.
    const lifeRows = withLifeRows();
    return riDay.RI_DAY_DIETS.filter(d => heldOf(state, d.gu) > 0).flatMap(d => {
        const need = riDay.riDayNeed(d, known[d.fed]?.at, state.clock);
        if (need.stage !== 'hungry' && need.stage !== 'starved') return [];
        const have = heldOf(state, d.food), enough = have >= d.perMeal;
        if (enough && !lifeRows) return [];
        return [{id: d.slot, label: `Feed the ${d.label}`, state: enough ? 'ready' : 'near', urgent: true,
            detail: need.stage === 'starved' ? 'gone without for days' : 'missed a meal',
            gap: enough ? '' : `needs ${d.perMeal} ${d.foodLabel}; you have ${have}`, uses: [d.foodLabel], open: openLife}];
    });
}
export function spoilageRows(state) {
    // riMeatState is daily-loops' reader (ri_lead_day_facts.js); read through the namespace so this row turns on when it lands.
    const meat = typeof riDay.riMeatState === 'function' ? riDay.riMeatState(state) : null;
    if (!meat || meat.state !== 'turning') return [];
    return [{id: 'wolf-meat', label: 'Use or sell the wolf meat', state: 'ready', urgent: true, detail: wordsFor(meat), uses: ['wolf meat'], open: openLife}];
}

let installed = false;
export function installReadySources() {
    if (installed) return; installed = true;
    registerReady({id: 'crafting', label: 'Crafting', rows: craftingRows});
    registerReady({id: 'gu-care', label: 'Your Gu', rows: () => guCareRows(readPort('expansion'), readPort('stock')?.carried)});
    registerReady({id: 'spoilage', label: 'Food', rows: () => spoilageRows(readPort('expansion'))});
}
