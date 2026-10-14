// Original presentation of native, already disclosed facts. No catalog scans.
export function formatKnownNumber(value, mode = 'exact') {
    if (!Number.isFinite(value)) throw new TypeError('A finite known value is required.');
    const exact = String(value);
    if (mode === 'exact' || Math.abs(value) < 10000) return {text: exact, exact};
    if (mode === 'scientific') return {text: value.toExponential(2), exact};
    if (mode !== 'compact') throw new TypeError('Unsupported number format.');
    return {text: new Intl.NumberFormat('en', {notation: 'compact', maximumSignificantDigits: 3}).format(value), exact};
}
const knownText = fact => fact?.known === true && typeof fact.text === 'string' ? fact.text : '';

// Rarity is authored method metadata, never inferred from personal mastery.
export function methodRarityWords(fact) { return knownText(fact); }

// Consume skillExpansionPresentation, whose native preview already owns gates.
// Hidden descendants and action IDs never come from the full skill catalogue.
export function projectKnownMethodChains(view) {
    return (view?.families || []).filter(f => f.learned === true).map(f => ({
        id: f.id, label: f.row.label, mastery: f.mastery,
        rarity: methodRarityWords(f.rarity),
        milestones: (f.milestones || []).map(m => ({at: m.at, label: m.label, met: m.met === true})),
        actions: (f.actions || []).map(a => ({id: a.id, label: a.row.label,
            ready: a.row.control.enabled === true,
            terms: [...(a.row.surfaces.preview || [])], reasons: [...(a.row.reasons || [])]}))
    }));
}

// Only player-observed creature/drop facts may enter this projection. Global
// item recognition alone never proves an association with a particular creature.
export function projectObservedDrops(facts = []) {
    return facts.filter(f => f?.known === true && f.recipientId === 'player' && f.observed === true)
        .map(f => ({id: f.id, label: knownText(f.label), count: f.count,
            rank: knownText(f.rank), chance: knownText(f.chance)}))
        .filter(f => typeof f.id === 'string' && f.label && Number.isSafeInteger(f.count) && f.count > 0);
}

export function mountKnownMethodChains(host, read) {
    const section = document.createElement('section');
    section.setAttribute('aria-label', 'Known mastery and readiness');
    host.append(section);
    function render() {
        const chains = projectKnownMethodChains(read());
        section.hidden = !chains.length;
        section.replaceChildren();
        for (const chain of chains) {
            const title = document.createElement('h4');
            title.textContent = `${chain.label} · mastery ${chain.mastery}${chain.rarity ? ' · Method rarity: ' + chain.rarity : ''}`;
            const list = document.createElement('ol');
            for (const milestone of chain.milestones) {
                const row = document.createElement('li');
                row.textContent = `${milestone.met ? 'Reached' : 'At mastery ' + milestone.at}: ${milestone.label}`;
                list.append(row);
            }
            for (const action of chain.actions) {
                const row = document.createElement('li');
                row.textContent = `${action.ready ? 'Ready' : 'Blocked'}: ${action.label}. ${[...action.terms, ...action.reasons].join(' ')}`;
                list.append(row);
            }
            section.append(title, list);
        }
    }
    render();
    return {element: section, render, destroy: () => section.remove()};
}

// Keyboard-accessible exact value, including when the optional display is short.
export function mountKnownNumber(host, value, mode = 'exact') {
    const formatted = formatKnownNumber(value, mode);
    const details = document.createElement('details'), summary = document.createElement('summary');
    summary.textContent = formatted.text;
    summary.setAttribute('aria-label', `${formatted.text}; expand for exact value`);
    const exact = document.createElement('p'); exact.textContent = `Exact value: ${formatted.exact}`;
    details.append(summary, exact); host.append(details);
    return {element: details, destroy: () => details.remove()};
}
