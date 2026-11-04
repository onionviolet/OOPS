// Display units for the existing Tingen native-money binding. No conversion or mutation.
import {penceLabel} from '../currency_subunits.js';
export function localMoneyLabel(amount, worldId) {
    if (worldId !== 'book.lotm.tingen') return null;
    return penceLabel(amount);
}
