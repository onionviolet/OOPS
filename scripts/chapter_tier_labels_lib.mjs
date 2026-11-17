// Shared by scripts/chapter_tier_labels.mjs and scripts/second_readers_score.mjs (importing the former would rewrite its output).
// Rank: the lowest stated rank, as in the wiki tier ("at least N" is a lower bound; a value with "?" or "unknown" gives none).
export function normaliseRank(text) {
    const t = (text ?? '').trim();
    if (!t) return null;
    const lower = /\bat least (?:rank )?([1-9])\b/i.exec(t);
    if (lower) return {rank: Number(lower[1]), basis: 'chapter-lower-bound'};
    if (/\?|unknown|uncertain|unclear/i.test(t)) return null;
    const nums = [...t.matchAll(/(?<![\d.])([1-9])(?![\d.])/g)].map(m => Number(m[1]));
    if (!nums.length) return null;
    return {rank: Math.min(...nums), basis: nums.length > 1 ? 'chapter-lowest' : 'chapter-stated'};
}
