// Item card renderer (ITEMS.md proposal). Draws a model from src/item_card_model.js into the node it is
// given, never the global document (MDL13). Every mark has words beside it (UR37): the band is a word,
// a delta is "+2 better", an unknown facet reads "Unknown to you", never zero. The tilde mark is reserved for a guess (shared with the sheet grammar). Roles, not looks, are named in
// data attributes so a later motif pack can restyle them (item 20).
const el = (doc, tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const GLYPH = {better: '▲', worse: '▼', same: '＝'};

export function renderItemCard(host, model, {idPrefix = 'item-card'} = {}) {
    const doc = host.ownerDocument, root = el(doc, 'article', 'item-card');
    root.dataset.role = 'item'; root.dataset.appraisal = model.level;
    root.setAttribute('aria-label', `${model.name} item card`);

    // Header: kind chips. Quality is a word and a number; condition and count sit beside it.
    const head = el(doc, 'header', 'item-card-head');
    const chips = el(doc, 'div', 'item-card-chips');
    const chip = (role, text, extra = {}) => { const c = el(doc, 'span', 'item-card-chip', text); c.dataset.role = role; Object.assign(c.dataset, extra); chips.append(c); return c; };
    chip('slot', model.slot.replaceAll('_', ' '));
    if (model.facets.band === 'known' && model.band) chip('band', model.facets.quality === 'known' && model.quality != null ? `${model.band} · ${model.quality}%` : model.band, {band: model.band});
    else if (model.facets.band === 'unknown') chip('band', 'quality unknown', {state: 'unknown'});
    if (model.condition) chip('condition', model.condition.text, {state: model.condition.factor >= .7 ? 'ok' : 'low'});
    if (model.count > 1) chip('stack', `×${model.count}`);
    head.append(chips);
    root.append(head);

    // Against what you wear: one sentence first, then the rows.
    const versus = el(doc, 'p', 'item-card-versus');
    versus.textContent = model.worn
        ? `Compared with your ${model.worn.name}${model.worn.quality != null ? ` (${model.worn.quality}%)` : ''}.`
        : `Nothing worn in ${model.slot.replaceAll('_', ' ')}: this would be your first.`;
    versus.dataset.worn = String(!!model.worn);
    if (model.facets.stats === 'known') root.append(versus);

    if (model.facets.stats === 'unknown') {
        root.append(el(doc, 'p', 'item-card-unknown', 'Unknown to you: its numbers are beyond what you can read from here.'));
    } else if (model.rows.length) {
        const table = el(doc, 'table', 'item-card-rows');
        table.setAttribute('aria-label', 'What this item contributes');
        const body = el(doc, 'tbody');
        for (const r of model.rows) {
            const tr = el(doc, 'tr', 'item-card-row'); tr.dataset.direction = r.direction;
            const unit = r.unit || '';
            tr.append(el(doc, 'th', null, r.label),
                el(doc, 'td', 'item-card-value', `${unit}${r.value}`),
                el(doc, 'td', 'item-card-delta', `${GLYPH[r.direction]} ${r.words}`));
            body.append(tr);
        }
        table.append(body); root.append(table);
    } else root.append(el(doc, 'p', 'item-card-note', model.note || 'No numbers this item adds to what you wear.'));

    // Provenance trail: where it has been. Absent records say so instead of inventing a past.
    if (model.facets.provenance === 'known') {
        const trail = el(doc, 'section', 'item-card-trail'); trail.dataset.role = 'provenance';
        trail.append(el(doc, 'h4', null, 'Where it has been'));
        if (model.trailRecorded) { const ol = el(doc, 'ol'); for (const t of model.trail) { const li = el(doc, 'li', null, t.text); li.dataset.kind = t.kind; ol.append(li); } trail.append(ol); }
        else trail.append(el(doc, 'p', 'item-card-note', 'No maker or past is recorded for this one.'));
        root.append(trail);
    } else root.append(el(doc, 'p', 'item-card-unknown', 'Unknown to you: where it came from.'));

    if (model.value && model.facets.value === 'known') root.append(el(doc, 'p', 'item-card-worth', `Worth ${model.value}`));
    host.replaceChildren(root);
    return root;
}
