// Display units for the existing Tingen native-money binding. No conversion or mutation.
import {penceLabel} from '../currency_subunits.js';
export function localMoneyLabel(amount, worldId) {
    if (worldId !== 'book.lotm.tingen') return null;
    return penceLabel(amount);
}

// PS31: a world whose money is a thing you hold names it on the purse line (Fang Yuan's primeval stones), read from the pack.
// The native coins a lead still carries are not this world's money, so they follow as a note rather than as the purse.
// A default per world; add a row to name another world's held money.
export const LOCAL_PURSES = Object.freeze({
    'book.ri.lead.world': Object.freeze({item: 'book.ri.lead.refinement.primeval_stone', one: 'primeval stone', many: 'primeval stones'}),
});
export function localPurseLabel(worldId, {money = 0, held = () => 0} = {}) {
    const purse = LOCAL_PURSES[worldId];
    if (!purse) return null;
    const n = Number(held(purse.item)) || 0, own = `${n} ${n === 1 ? purse.one : purse.many}`;
    return money > 0 ? `${own} · ${money} Village coin${money === 1 ? '' : 's'}` : own;
}
// Whether the native coin prices mean anything in this world: not where the money is a held thing and coins are not taken.
export const coinPricesHere = worldId => !LOCAL_PURSES[worldId];
