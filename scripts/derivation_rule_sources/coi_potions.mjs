export const order = 40;
export default async ({row, verdictOf}) => (await import('../derive_coi_potions.mjs')).coiRuleRows(row, verdictOf);
