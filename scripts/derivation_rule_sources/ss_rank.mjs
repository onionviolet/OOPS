export const order = 20;
export default async ({row, sha}) => (await import('../ss_rank_rules.mjs')).ssRankRows(row, sha);
