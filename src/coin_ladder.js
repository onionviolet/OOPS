// Pure leaf. A coin ladder splits one integer count of the smallest coin into larger coins for display only
// (storage stays one integer per holder, so exact arithmetic has one authority). The ladder comes from the world's
// data: [{one, many, size}] largest first, size in smallest coins. No names or rates live here.
export function validLadder(ladder) {
    return Array.isArray(ladder) && ladder.length > 0 && ladder.every((r, i) => typeof r?.one === 'string' && typeof r.many === 'string' && Number.isSafeInteger(r.size) && r.size >= 1
        && (i === 0 || r.size < ladder[i - 1].size)) && ladder.at(-1).size === 1;
}
export function ladderBreakdown(amount, ladder) {
    if (!validLadder(ladder) || !Number.isSafeInteger(amount) || amount < 0) throw Error('Amount or coin ladder is invalid.');
    const out = []; let rest = amount;
    for (const r of ladder) { const q = Math.floor(rest / r.size); if (q) { out.push({coin: r, count: q}); rest -= q * r.size; } }
    return out;
}
export function ladderLabel(amount, ladder, empty = 'nothing') {
    const parts = ladderBreakdown(amount, ladder);
    return parts.length ? parts.map(({coin, count}) => `${count} ${count === 1 ? coin.one : coin.many}`).join(' ') : empty;
}
export const ladderAmount = (counts, ladder) => ladder.reduce((sum, r) => sum + (counts[r.one] || 0) * r.size, 0);
