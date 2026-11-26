// Fang's patrol cut is an authored two-point wound, separate from battle HP.
// Reuse the catalogue treatment law for the consumed leaf and its hour-long
// interval; native command costs and the existing patrol injury remain owners.
import {tryGuStep} from './gu_working_host.js';

export const RI_LEAF_TREATMENT = 'book.ri.lead.leaf_treatment';
export const RI_LEAF_ITEM = `${RI_LEAF_TREATMENT}.leaf`;
export const RI_LEAF_NOTE = `${RI_LEAF_TREATMENT}.treated`;
export const RI_LEAF_PRICE = 2; // Proposal: local seller's price, not a canon quotation.
export function riLeafQuote(clock, treatedAt) {
    return tryGuStep('vitality-leaf', 'treat', {at: clock,
        specimen: {id: RI_LEAF_ITEM, kind: 'vitality-leaf'},
        facts: {treatedAt: Number.isFinite(treatedAt) ? {player: treatedAt} : {}}});
}
