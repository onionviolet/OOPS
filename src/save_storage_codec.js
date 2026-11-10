// Stored-save codec (2026-11-09). Big values in localStorage are kept as a prefixed,
// LZ77-compressed string; getItem always returns the plain string and setItem accepts
// the plain string, so every reader and every byte comparison sees today's JSON.
// Exported save files are built from the plain string and never touch this module.
// A leaf: no imports. Output characters stay in 0x20..0x801F (no NUL, no surrogates),
// so JSON, serde and browser storage all accept the stored form.
export const STORED_PREFIX = 'yairpg-lz1:';
export const COMPRESS_FROM = 256 * 1024; // characters; smaller values stay plain
const MIN_MATCH = 4, HASH_BITS = 18, CHAIN = 12;
const pack = out => ({
    bits: 0, count: 0,
    put(value, n) {
        if (n > 15) { this.put(Math.floor(value / 32768), n - 15); n = 15; value &= 0x7fff; }
        this.bits = (this.bits << n) | value; this.count += n;
        while (this.count >= 15) { this.count -= 15; out.push(((this.bits >>> this.count) & 0x7fff) + 32); }
        this.bits &= (1 << this.count) - 1;
    },
    end() { if (this.count) this.put(0, 15 - this.count); },
});
const bitLength = n => 32 - Math.clz32(n);
// Plain string -> prefixed stored string.
export function compressText(text) {
    const n = text.length, src = new Uint16Array(n), out = [];
    for (let i = 0; i < n; i++) src[i] = text.charCodeAt(i);
    const w = pack(out);
    w.put(n >>> 16, 16); w.put(n & 0xffff, 16);
    const head = new Int32Array(1 << HASH_BITS).fill(-1), prev = new Int32Array(n);
    const hash = i => (Math.imul(src[i] | (src[i + 1] << 16), 0x9e3779b1) ^ Math.imul(src[i + 2] | (src[i + 3] << 16), 0x85ebca6b)) >>> (32 - HASH_BITS);
    const insert = i => { if (i + MIN_MATCH <= n) { const h = hash(i); prev[i] = head[h]; head[h] = i; } };
    let i = 0;
    while (i < n) {
        let bestLen = 0, bestDist = 0;
        if (i + MIN_MATCH <= n) {
            let cand = head[hash(i)];
            for (let depth = 0; cand >= 0 && depth < CHAIN; depth++, cand = prev[cand]) {
                let len = 0;
                while (i + len < n && src[cand + len] === src[i + len]) len++;
                if (len > bestLen) { bestLen = len; bestDist = i - cand; }
            }
        }
        if (bestLen >= MIN_MATCH) {
            const x = bestLen - MIN_MATCH + 1, xb = bitLength(x), db = bitLength(bestDist);
            if (2 + 2 * xb - 1 + 5 + db - 1 < 9 * bestLen) {
                w.put(2, 2);
                for (let z = xb - 1; z > 0; z -= 8) w.put(0, Math.min(8, z)); // unary part of the length
                w.put(x, xb);
                w.put(db, 5); if (db > 1) w.put(bestDist & ((1 << (db - 1)) - 1), db - 1);
                for (let k = 0; k < bestLen; k++) insert(i + k);
                i += bestLen; continue;
            }
        }
        const c = src[i];
        if (c < 256) w.put(c, 9); else { w.put(3, 2); w.put(c, 16); }
        insert(i++);
    }
    w.end();
    let body = '';
    for (let k = 0; k < out.length; k += 8192) body += String.fromCharCode.apply(null, out.slice(k, k + 8192));
    return STORED_PREFIX + body;
}
// Prefixed stored string -> plain string. Throws on damaged input.
export function decompressText(stored) {
    const s = stored, base = STORED_PREFIX.length, limit = s.length;
    let pos = base, acc = 0, have = 0;
    const get = n => {
        if (n > 15) return get(n - 15) * 32768 + get(15);
        while (have < n) {
            if (pos >= limit) throw new Error('Stored save is truncated.');
            acc = (acc << 15) | ((s.charCodeAt(pos++) - 32) & 0x7fff); have += 15;
        }
        have -= n; const v = (acc >>> have) & ((1 << n) - 1); acc &= (1 << have) - 1; return v;
    };
    const n = get(16) * 65536 + get(16), out = new Uint16Array(n);
    let o = 0;
    while (o < n) {
        if (get(1) === 0) { out[o++] = get(8); continue; }
        if (get(1) === 1) { out[o++] = get(16); continue; }
        let xb = 1; while (get(1) === 0) { xb++; if (xb > 24) throw new Error('Stored save is damaged.'); }
        const len = (xb > 1 ? (1 << (xb - 1)) | get(xb - 1) : 1) + MIN_MATCH - 1, db = get(5);
        const dist = db > 1 ? (1 << (db - 1)) | get(db - 1) : db;
        if (!db || dist > o || o + len > n) throw new Error('Stored save is damaged.');
        for (let k = 0; k < len; k++, o++) out[o] = out[o - dist];
    }
    let text = '';
    for (let k = 0; k < n; k += 8192) text += String.fromCharCode.apply(null, out.subarray(k, Math.min(n, k + 8192)));
    return text;
}

// Stored form of a plain value: compressed when large and smaller, else unchanged.
export function storedForm(value) {
    if (typeof value !== 'string' || value.length < COMPRESS_FROM || value.startsWith(STORED_PREFIX)) return value;
    const packed = compressText(value);
    return packed.length < value.length * 0.9 ? packed : value;
}
export const readStored = stored => {
    if (typeof stored !== 'string' || !stored.startsWith(STORED_PREFIX)) return stored;
    try { return decompressText(stored); } catch { return stored; } // damaged bytes stay visible to the caller's own checks
};
// A small memo of recent plain/stored pairs, so the guard's measure, the write and a
// compare-after-read each pay for the codec once.
const memo = [];
const remember = (plain, stored) => { memo.unshift({plain, stored}); memo.length = Math.min(memo.length, 3); };
const encode = plain => { const hit = memo.find(m => m.plain === plain); if (hit) return hit.stored; const stored = storedForm(plain); if (stored !== plain) remember(plain, stored); return stored; };
const decode = stored => { if (typeof stored !== 'string' || !stored.startsWith(STORED_PREFIX)) return stored; const hit = memo.find(m => m.stored === stored); if (hit) return hit.plain; const plain = readStored(stored); if (plain !== stored) remember(plain, stored); return plain; };
const PATCHED = Symbol.for('yairpg.saveStorageCodec');
// Patches the storage class prototype once (never the instance: assigning a property
// on a Storage would create a stored key). Returns the storage so a call can wrap its use.
// Any earlier wrapper (the desktop host's setItem hook) stays in the chain.
export function installSaveStorageCodec(storage) {
    const proto = storage && Object.getPrototypeOf(storage);
    if (!proto || proto[PATCHED] || typeof proto.getItem !== 'function' || typeof proto.setItem !== 'function') return storage;
    const get = proto.getItem, set = proto.setItem;
    Object.defineProperties(proto, {
        [PATCHED]: {value: true},
        getItem: {configurable: true, writable: true, value: function getItem(key) { return decode(get.call(this, key)); }},
        setItem: {configurable: true, writable: true, value: function setItem(key, value) { return set.call(this, key, encode(String(value))); }},
        // Raw stored string, for hosts that mirror bytes and for the size guard.
        getStoredItem: {configurable: true, writable: true, value: function getStoredItem(key) { return get.call(this, key); }},
        // Characters a plain value will occupy once stored.
        storedLength: {configurable: true, writable: true, value: function storedLength(value) { return encode(String(value)).length; }},
    });
    return storage;
}
