// Shared hash and xorshift leaf (AR3, AR5). Imports nothing. Saved cursors and
// replay output depend on these exact bodies, so they stay byte-identical to the
// inline copies they replaced. seeded_streams.js re-exports them under their old names.

// FNV-1a over a string's code points, using each point's first UTF-16 unit
// (an astral character contributes only its high surrogate). Returns `seed`
// unchanged for the empty string and may return 0.
export function fnv1a(seed, text) {
    let n=seed; for(const ch of text) n=Math.imul(n ^ ch.charCodeAt(0),16777619) >>> 0;
    return n;
}
// The same hash, never 0 (0 would freeze an xorshift cursor).
export function hashStreamSeed(seed, id) {
    return fnv1a(seed,id) || 1;
}
// The one xorshift32 13/17/5 step.
export function xorshift32(n) {
    n^=n<<13;n^=n>>>17;n^=n<<5;return n>>>0;
}
export function mix32(n) {
    n=Math.imul(n ^ (n >>> 16),0x85ebca6b);
    n=Math.imul(n ^ (n >>> 13),0xc2b2ae35);
    return (n ^ (n >>> 16)) >>> 0;
}
