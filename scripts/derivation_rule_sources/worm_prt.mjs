export const order = 30;
export default async ({row, sha}) => (await import('../derive_worm_prt.mjs')).backtestRows(row, sha(['scripts/worm_prt_rules.mjs']));
