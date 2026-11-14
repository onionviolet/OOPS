// One owner for how player-facing numbers read (UR117, UR74; element audit UIC102). A quantity that shows
// in two places goes through the same function here, so it reads the same in both. Pure: no DOM, no state.
// Adoption is surface by surface; the audit's measured mismatches (purse, critical chance and damage,
// ratios, durations) use it first.

const trim = text => text.includes('.') ? text.replace(/\.?0+$/, '') : text;

/** A number with up to `digits` decimals and no trailing zeros: 5, 12.5, 0.125. */
export function formatDecimal(value, digits = 1) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '?';
    return trim(n.toFixed(digits));
}

/** UIC148: a value with its unit for a list read at a glance: 31.623 AP → "31.6 AP", 1 points → "1 point". Exact figures stay one step away. */
export function formatGlance(value, unit = '') {
    const n = Number(value);
    if (!Number.isFinite(n)) return '?';
    const text = String(Number(n.toFixed(Math.abs(n) >= 10 ? 1 : n !== 0 && Math.abs(n) < .01 ? 6 : 2)));
    const word = n === 1 ? ({points: 'point', hits: 'hit'})[unit] ?? unit : unit;
    return word ? `${text} ${word}` : text;
}

/** A whole count with thousands separators: 456011 → "456,011". */
export function formatCount(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '?';
    return Math.round(n).toLocaleString('en-US');
}

/** A fraction as a percentage: 0.05 → "5%", 0.125 → "12.5%". */
export function formatPercent(fraction, digits = 1) {
    return `${formatDecimal(Number(fraction) * 100, digits)}%`;
}

/** A multiplier: 1.3 → "×1.3". */
export function formatMultiplier(value, digits = 2) {
    return `×${formatDecimal(value, digits)}`;
}

/** Current of maximum with its unit, one style everywhere: "60/60 hp", "0/10 xp". */
export function formatRatio(current, max, unit = '') {
    return `${current}/${max}${unit ? ` ${unit}` : ''}`;
}

/** Played minutes in one style: "45 min", "1 h", "1 h 30 min", "2 days", "2 days 3 h". */
export function formatDuration(minutes) {
    const m = Math.max(0, Math.round(Number(minutes) || 0));
    if (m < 60) return `${m} min`;
    if (m < 1440) { const h = Math.floor(m / 60), r = m % 60; return r ? `${h} h ${r} min` : `${h} h`; }
    const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
    return `${d} day${d === 1 ? '' : 's'}${h ? ` ${h} h` : ''}`;
}

/** The home world's coin denominations, largest first, as [amount, letter] pairs (G, S, C, W). */
export function moneyParts(amount) {
    let n = Math.abs(Math.trunc(Number(amount) || 0));
    const parts = [];
    if (n > 99999) parts.push([Math.floor(n / 100000), 'G']);
    if (n > 999 && Math.floor(n / 1000) % 100) parts.push([Math.floor(n / 1000) % 100, 'S']);
    if (n > 9 && Math.floor(n / 10) % 100) parts.push([Math.floor(n / 10) % 100, 'C']);
    if (n % 10) parts.push([n % 10, 'W']);
    return parts;
}

/** Money as plain text in the same denominations the purse shows: "10C 4W"; "104 coins" before denominations are known. */
export function formatMoneyText(amount, {denominations = true} = {}) {
    const n = Math.trunc(Number(amount) || 0);
    if (!denominations) return `${n} coin${Math.abs(n) === 1 ? '' : 's'}`;
    if (n === 0) return 'nothing';
    return `${n < 0 ? '-' : ''}${moneyParts(n).map(([a, u]) => `${a}${u}`).join(' ')}`;
}
