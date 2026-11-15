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
import {recipeStateWord, recipeRowSummary} from './crafting_visibility.js';
import * as riDay from './ri_lead_day_facts.js';
import {wordsFor} from './spoilage.js';
import {expandWorkspaceModule} from './workspace_layout.js';

const openLife = () => expandWorkspaceModule('beginning');

// Crafting: one row per recipe that is ready or one named material short. A row further off is counted, not listed.
// `namesFor(material)` lists the item names that satisfy a material type ("animal tooth" → "Rat fang", "Wolf fang"), so a
// line that names the item ("Rat fang x2") points at the recipe that asks for the type (PS55).
// Pure: `recipes` are {name, ready, text, open} with the recipe row's own short words (crafting_visibility.js
// recipeRowSummary: "3 ready", "needs 20 animal tooth", "short 5 of something unfamiliar").
export function craftingRowsFromStates(recipes, namesFor = () => []) {
    const rows = [];
    for (const r of recipes) {
        if (!r?.name) continue;
        const text = String(r.text || '').trim(), short = /^needs (\d+) (.+)$/.exec(text);
        // Near means one named thing short ("needs 2 Wool"); a gap that names nothing to fetch is further off.
        const state = r.ready ? 'ready' : short ? 'near' : 'rest';
        rows.push({id: r.name, label: `Make ${r.name}`, state, detail: r.ready ? text : '', gap: state === 'near' ? text : '', uses: short ? [short[2], ...namesFor(short[2])] : [], open: r.open});
    }
    return rows;
}
// The same from the recipe list's own marks, for when the recipe data has no reader yet (the list was opened).
export function craftingRowsFrom(nodes, namesFor = () => []) {
    const recipes = [];
    for (const mark of nodes) {
        const row = mark.closest('[data-crafting_category]') ? mark.parentElement : null;
        const name = row ? (row.getAttribute('aria-label') || '').split(';')[0].trim() : '';
        if (!name) continue;
        recipes.push({name, ready: mark.dataset.ready === 'true', text: mark.textContent,
            open: () => { window.openCraftingWindow?.(); requestAnimationFrame(() => { row.click?.(); row.scrollIntoView?.({block: 'nearest'}); }); }});
    }
    return craftingRowsFromStates(recipes, namesFor);
}
// Item names per material type, from the item templates the records port already hands the reference panels.
const namesForType = type => Object.values(readPort('records')?.item_templates || {}).filter(t => t?.material_type === type && t.name).map(t => t.name);
// UIC275: Ready now on a fresh Village read the recipe list's marks, which exist only once Crafting has been opened. The
// crafting owner (display.js) hands its recipe readiness here instead, from the same status the list paints.
let craftingReader = null;
// The crafting owner's reader: every learned item recipe through its own status (`status(category, recipe)`, itemRecipeStatus),
// worded as the row words it (recipeRowSummary). Blocked and far-off recipes are left out. Read about once a second by the
// hub, the band and Next links, so it keeps its answer for 800 ms.
export function craftingReadyReader({recipes, unlocked, status, open, now = () => performance.now()}) {
    let cache = {at: -Infinity, rows: []};
    return () => {
        const t = now();
        if (t - cache.at < 800) return cache.rows;
        const rows = [];
        if (unlocked()) for (const [category, pages] of Object.entries(recipes() || {})) for (const [recipe_id, recipe] of Object.entries(pages?.items || {})) {
            if (!recipe?.isUnlocked?.()) continue;
            const state = status(category, recipe), word = recipeStateWord(state);
            if (word === 'blocked' || word === 'far') continue;
            const selection = {category, subcategory: 'items', recipe_id};
            rows.push({name: recipe.name, ready: state.available, text: recipeRowSummary(state).short, open: () => open(selection)});
        }
        cache = {at: t, rows};
        return rows;
    };
}
export function setCraftingReader(fn) { craftingReader = typeof fn === 'function' ? fn : null; }
const craftingRows = () => {
    if (craftingReader) { try { return craftingRowsFromStates(craftingReader() || [], namesForType); } catch { return []; } }
    return typeof document === 'undefined' ? [] : craftingRowsFrom(document.querySelectorAll('[data-crafting_subcategory] .recipe_readiness'), namesForType);
};

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
