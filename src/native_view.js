// Narrow read operations provided by native owners. No state, clock or write authority.
export let readLocalWeatherWords;
export let get_current_book;
export let get_context;
export let canConsumeNativeCraftingItem;
export let nativeWorkLedgerChance;
export let nativeWorkLedgerQuality;
export let readVillageLedgerSentence;
export let get_current_combat;
export function bindNativeView(readers) {
    readLocalWeatherWords = readers.readLocalWeatherWords;
    get_current_book = readers.get_current_book;
    get_context = readers.get_context;
    canConsumeNativeCraftingItem = readers.canConsumeNativeCraftingItem;
    nativeWorkLedgerChance = readers.nativeWorkLedgerChance;
    nativeWorkLedgerQuality = readers.nativeWorkLedgerQuality;
    readVillageLedgerSentence = readers.readVillageLedgerSentence;
    get_current_combat = readers.get_current_combat;
}
