// Display units for the existing Tingen native-money binding. No conversion or mutation.
export function localMoneyLabel(amount, worldId) {
    if (worldId !== 'book.lotm.tingen') return null;
    return `${amount} ${Math.abs(amount) === 1 ? 'penny' : 'pence'}`;
}
