// Bounded household parcels use native inventory. Counts mean labelled batches,
// not invented individual vegetable/spice quantities or a general nutrition law.
export const HOUSEHOLD_MEAL_ITEMS=[
 ['mutton','Mutton parcel','One pound of mutton retained for the household meal.'],
 ['vegetables','Household vegetables','The remaining purchased vegetables; individual quantities are not counted.'],
 ['recipe_vegetables','Vegetables for the stew','A selected batch of peas, potatoes, carrots and onion for this recipe.'],
 ['vegetables_left','Remaining vegetables','The vegetables not selected for this recipe, including the unused cabbage.'],
 ['pantry','Pantry recipe allocation','One bounded cooking allocation of water, fuel, salt, pepper and lard; not the whole pantry.'],
 ['prepared','Prepared mutton batch','Washed, cut and seasoned mutton, with the reserved supplies for the remaining recipe.'],
 ['base','Mutton stew base','The mutton has simmered; the vegetable batch has not yet been added.'],
 ['stew','Mutton and vegetable stew','One finished shared dish of mutton, peas, potatoes, carrots and onion.'],
].map(([suffix,name,description])=>({id:`household.meal.${suffix}`,name,description:`${description} No sale price is established for this household allocation.`,value:0,tags:{expedition:true,book_world_lotm:true,household_meal:true}}));
