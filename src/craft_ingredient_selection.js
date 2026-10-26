// Compare observer-projected choices, never material truth. The adapter owns
// physical allocation, quotations and commit; role assignments are not costs.
import {inspectMaterialEvidence} from './material_inspector.js';

const kinds = new Set(['reference', 'alternative', 'blend']);
const text = value => typeof value === 'string' && value.length > 0;
const amount = value => Number.isSafeInteger(value) && value > 0;

function stockRows(inputs, holdings, seen, disposition) {
    return inputs.map(input => {
        if(!text(input?.key) || !amount(input.qty)) throw Error('A physical ingredient row needs an exact key and positive whole quantity.');
        // Shared functions must have been collapsed by the allocation owner.
        if(seen.has(input.key)) throw Error('Duplicate exact ingredient key: supply canonical physical debits and retained rows, not function assignments.');
        seen.add(input.key);
        const held = holdings.get(input.key);
        const reason = !held ? 'This selected holding is no longer available. Choose again or clear it.'
            : held.available === false ? held.reason || 'This selected holding is not accessible. Review its custody before using it.'
            : input.qty > held.count ? 'The selected quantity is no longer available. Review this exact holding.' : '';
        return {key: input.key, qty: input.qty, disposition,
            name: held?.name ?? 'Unavailable selected holding', count: held?.count ?? 0,
            custody: held?.custody ?? 'unknown', stockAvailable: !reason, stockReason: reason,
            evidence: inspectMaterialEvidence(held?.evidence)};
    });
}

// holdings: public exact-stock handles, counts/custody/access and M3 evidence.
// candidates.inputs and optional retained: canonical physical rows from the
// allocation owner, not its per-function assignments. No automatic selection.
export function compareIngredientChoices({holdings = [], candidates = [], selected = null} = {}) {
    const held = new Map();
    for(const row of holdings) {
        if(!text(row?.key) || !text(row.name) || !Number.isSafeInteger(row.count) || row.count < 0)
            throw Error('A projected holding needs an exact key, public name and non-negative whole stock.');
        if(held.has(row.key)) throw Error('Duplicate projected holding key.');
        held.set(row.key, row);
    }
    const ids = new Set();
    const choices = candidates.map(candidate => {
        if(!text(candidate?.id) || !text(candidate.label) || !kinds.has(candidate.kind))
            throw Error('An ingredient choice needs an id, public label and comparison kind.');
        if(ids.has(candidate.id)) throw Error('Duplicate ingredient choice id.');
        ids.add(candidate.id);
        if(!Array.isArray(candidate.inputs) || !candidate.inputs.length) throw Error('A choice needs physical ingredient debits.');
        const seen = new Set();
        const debits = stockRows(candidate.inputs, held, seen, 'consumed');
        const retained = stockRows(candidate.retained ?? [], held, seen, 'retained');
        const stockReason = [...debits, ...retained].find(row => !row.stockAvailable)?.stockReason ?? '';
        return {id: candidate.id, label: candidate.label, kind: candidate.kind,
            selected: candidate.id === selected, debits, retained,
            stockAvailable: !stockReason, stockReason,
            evidence: inspectMaterialEvidence(candidate.evidence)};
    });
    const choice = choices.find(row => row.selected) ?? null;
    return {choices, selection: {id: selected, choice,
        stockAvailable: choice?.stockAvailable ?? false,
        stockReason: choice?.stockReason ?? (selected == null ? 'Choose an ingredient option.' : 'The selected option is no longer available. Choose again or clear it.')}};
}
