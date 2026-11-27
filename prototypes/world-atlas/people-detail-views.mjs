// Uses injected record primitives so the same DOM can be checked without the atlas shell.
export const peopleEvidenceLabel = label => ({S: 'Shown', T: 'Stated', I: 'Inference', U: 'Unsettled'}[label] || 'Evidence label unstated');
export function personReaderDetailSections(person, {el, section, link, matched}) {
    const caption = row => el('small', [peopleEvidenceLabel(row.label), row.locator || 'Source reference not recorded'].join(' · '));
    const wants = (person.wants || []).map(row => [row.what, caption(row)]);
    const reactions = (person.reacts || []).map(row => {
        const details = [row.by ? ' · Acted by ' : null, row.by ? (matched(row.by) ? link(row.by) : `${row.by} (reference not matched)`) : null].filter(Boolean);
        return [row.to ? 'When ' + row.to : 'Condition not recorded', row.response ? ' → ' + row.response : ' · Response not recorded',
            ...details, ...[row.class ? 'Trigger: ' + row.class : null, row.responseClass ? 'Response: ' + row.responseClass : null].filter(Boolean).map(t => el('small', t)), caption(row)];
    });
    return [section('Wants and aims', wants, 'No wants recorded in the collected people rows.'),
        section('Reactions', reactions, 'No reaction conditions or outcomes recorded in the collected people rows.')];
}
