import test from "node:test";
import assert from "node:assert/strict";
import {compressText, decompressText, installSaveStorageCodec, STORED_PREFIX, COMPRESS_FROM} from "../src/save_storage_codec.js";
import {writeGuardedSave, checkSaveSize, encodeSaveFile, SAVE_STORAGE_BUDGET} from "../src/save_files.js";

// A class with prototype methods, like the browser's Storage, so the prototype patch is what runs.
const makeStorage = () => {
    class Store {
        constructor() {Object.defineProperty(this, 'm', {value: new Map()});}
        get length() {return this.m.size;}
        key(i) {return [...this.m.keys()][i] ?? null;}
        getItem(k) {return this.m.has(k) ? this.m.get(k) : null;}
        setItem(k, v) {this.m.set(k, String(v));}
    }
    return installSaveStorageCodec(new Store());
};
const life = n => JSON.stringify({knowledge: Array.from({length: n}, (_, i) => ({id: `entry.${i}`, text: `A repeated line of life ${i % 97} with some words`, tags: ['a', 'b', i % 7]}))});
const noise = n => {let x = 12345, s = ''; for(let i = 0; i < n; i++) {x = Math.imul(x, 1103515245) + 12345 | 0; s += String.fromCharCode(0x4e00 + ((x >>> 8) % 20000));} return s;};

test("codec round-trips edge strings and stays inside the safe character range", () => {
    const cases = ['', 'a', 'abcabcabcabc', '￿￿￿￿', '😀 pair and lone \ud800 and \udfff', '魏宝'.repeat(50),
        'x'.repeat(300000), noise(5000), life(3000)];
    for(const text of cases) {
        const packed = compressText(text);
        assert.ok(packed.startsWith(STORED_PREFIX));
        for(const ch of packed.slice(STORED_PREFIX.length)) {const c = ch.charCodeAt(0); assert.ok(c >= 0x20 && c <= 0x801f, 'safe range');}
        assert.equal(decompressText(packed), text);
    }
    assert.ok(compressText(life(3000)).length < life(3000).length / 4);
    assert.throws(() => decompressText(compressText('abcabcabc'.repeat(100)).slice(0, 14)));
});

test("a save over the old budget stores compressed and reads back identical", () => {
    const storage = makeStorage(), plain = life(60000);
    assert.ok(plain.length * 2 > SAVE_STORAGE_BUDGET, 'would not fit uncompressed');
    assert.throws(() => checkSaveSize(plain, {key: 'k'}), e => e.code === 'SAVE_STORAGE_FULL');
    writeGuardedSave(storage, 'save data', plain);
    assert.ok(storage.m.get('save data').startsWith(STORED_PREFIX));
    assert.ok(storage.m.get('save data').length * 2 < SAVE_STORAGE_BUDGET);
    assert.equal(storage.getItem('save data'), plain);
    assert.equal(encodeSaveFile(storage.getItem('save data')), encodeSaveFile(plain), 'export bytes unchanged');
    assert.equal(JSON.parse(storage.getItem('save data')).knowledge.length, 60000);
});

test("plain stored saves still read, small values stay plain, install is idempotent", () => {
    const storage = makeStorage(), proto = Object.getPrototypeOf(storage);
    storage.m.set('old', life(100)); storage.m.set('oldBig', life(20000));
    assert.equal(storage.getItem('old'), life(100)); assert.equal(storage.getItem('oldBig'), life(20000));
    storage.setItem('small', life(100)); assert.equal(storage.m.get('small'), life(100));
    const get = proto.getItem; installSaveStorageCodec(storage); assert.equal(proto.getItem, get);
    assert.ok(life(20000).length >= COMPRESS_FROM);
    assert.equal(storage.getItem('missing'), null);
});

test("the guard measures stored bytes of other keys and refuses when even compressed form is over budget", () => {
    const storage = makeStorage();
    storage.setItem('other', life(60000));
    const other = storage.m.get('other').length * 2;
    assert.equal(checkSaveSize(life(100), {storage, key: 'save data'}).originStorageBytes, life(100).length * 2 + 2 * 'save data'.length + 2 * ('other'.length) + other);
    const hostile = noise(Math.ceil(SAVE_STORAGE_BUDGET / 2) + 1000);
    assert.throws(() => writeGuardedSave(storage, 'save data', hostile), e => e.code === 'SAVE_STORAGE_FULL');
    assert.equal(storage.getItem('save data'), null);
});
