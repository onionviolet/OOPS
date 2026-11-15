// D4 (SFC15, drafts 2026-11-15, "build both"): Fang Yuan's Gu as the Skills box's Gu tab. An aperture head (his primeval
// essence reserve) and one row per Gu he holds: how hungry it is, what it eats, what he has of it and when it next wants
// a meal. Reads daily-loops' diets and need reader (ri_lead_day_facts.js) and the energy he already has; writes nothing.
import * as riDay from './ri_lead_day_facts.js';
import {heldIn} from './ready_sources.js';
import {formatDuration} from './number_format.js';

const STAGE_WORD = {fed: 'fed', due: 'wants a meal', hungry: 'missed a meal', starved: 'gone without for days'};

export function riGuTabModel(state, carried = null) {
    if (state?.actors?.player?.worldId !== 'book.ri.lead.world') return null;
    const known = state.simulation?.knowledge?.player || {}, owners = state.simulation?.owners?.player;
    const rows = riDay.RI_DAY_DIETS.filter(d => heldIn(carried, owners, d.gu) > 0).map(d => {
        const fedAt = known[d.fed]?.at, need = riDay.riDayNeed(d, fedAt, state.clock);
        const nextIn = Number.isFinite(fedAt) ? fedAt + d.interval - state.clock : null;
        return {id: d.slot, label: d.label, stage: need.stage, words: STAGE_WORD[need.stage] || need.stage,
            eats: `${d.perMeal} ${d.foodLabel}`, have: heldIn(carried, owners, d.food), perMeal: d.perMeal,
            next: nextIn == null ? 'not fed yet' : nextIn <= 0 ? 'now' : `in ${formatDuration(nextIn)}`};
    });
    const sea = Object.entries(state.simulation?.energies?.player || {}).find(([id]) => /primeval/.test(id))?.[1];
    const aperture = sea && Number.isFinite(sea.reserve) ? {now: sea.reserve, max: sea.policy?.capacity} : null;
    return rows.length || aperture ? {rows, aperture} : null;
}

export function renderRiGuTab(parent, model) {
    const doc = parent.ownerDocument, el = (tag, text, host, cls) => { const n = doc.createElement(tag); if (text != null) n.textContent = text; if (cls) n.className = cls; host.append(n); return n; };
    const root = el('section', null, parent, 'ri-gu-tab');
    root.dataset.riGuTab = '';
    if (model.aperture) {
        const head = el('div', null, root, 'ri-gu-tab__aperture');
        el('p', `Aperture · ${model.aperture.now}${Number.isFinite(model.aperture.max) ? `/${model.aperture.max}` : ''} primeval essence`, head);
        if (Number.isFinite(model.aperture.max)) { const m = el('meter', null, head); m.min = 0; m.max = model.aperture.max; m.value = model.aperture.now; m.setAttribute('aria-label', 'Primeval essence'); }
    }
    if (!model.rows.length) { el('p', 'No Gu in hand yet.', root); return root; }
    const table = el('table', null, root), head = el('tr', null, table);
    for (const h of ['Gu', 'Hunger', 'Eats', 'You have', 'Next meal']) el('th', h, head);
    for (const r of model.rows) {
        const tr = el('tr', null, table); tr.dataset.stage = r.stage;
        for (const t of [r.label, r.words, r.eats, `${r.have}${r.have < r.perMeal ? ' (short)' : ''}`, r.next]) el('td', t, tr);
    }
    return root;
}
