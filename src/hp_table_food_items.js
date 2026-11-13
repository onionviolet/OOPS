// Data only, no imports: the food Harry can save from the house tables (book_world_hp_contact.js), registered as an optional item
// catalogue by items.js so the base lead-life definition (content-hashed, pinned by the school continuations) stays unchanged.
const P = 'book.hp.lead';
// Food from the house tables. The feast's puddings and the humbugs are on the table in book 1 ch. 7 (the start-of-term feast);
// taking one away in a pocket is an original act. Default: carry up to two of each; dial: carryMax. Reason: pockets.
export const HP_TABLE_FOOD = Object.freeze([
    Object.freeze({id: `${P}.food.treacle_tart`, name: 'Slice of treacle tart', phrase: 'a slice of treacle tart', tags: {food: true, sweet: true},
        description: 'A slice of treacle tart wrapped in a napkin from the house table.'}),
    Object.freeze({id: `${P}.food.jam_doughnut`, name: 'Jam doughnut', phrase: 'a jam doughnut', tags: {food: true, sweet: true},
        description: 'A jam doughnut from the pudding plates, a little squashed from your pocket.'}),
    Object.freeze({id: `${P}.food.peppermint_humbug`, name: 'Peppermint humbug', phrase: 'a peppermint humbug', tags: {food: true, sweet: true, mint: true},
        description: 'A striped peppermint humbug. They turn up on the table for no reason anyone gives.'})]);
// Optional catalogue rows for items.js (registerOptionalItems).
export const hpTableFoodItems = Object.freeze(HP_TABLE_FOOD.map(({phrase, ...row}) => ({...row, tags: {...row.tags}, value: 0})));

