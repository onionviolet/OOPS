// An import is measured the way a normal save is stored (2026-11-16): a late Klein life (about 2.1 million characters of JSON)
// saves through the storage codec but was rejected on import, because the import's storage handle had no storedLength and the
// size guard measured the plain text against the 4 MB budget. The handle now passes the codec's measure through (main.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkSaveSize, SAVE_STORAGE_BUDGET} from '../src/save_files.js';
import {installSaveStorageCodec} from '../src/save_storage_codec.js';

class Store {constructor() {this.m = new Map();} get length() {return this.m.size;} key(i) {return [...this.m.keys()][i] ?? null;}
    getItem(k) {return this.m.has(k) ? this.m.get(k) : null;} setItem(k, v) {this.m.set(k, String(v));} removeItem(k) {this.m.delete(k);}}

test('a large, repetitive save fits once measured in its stored form, and not as plain text', () => {
    const big = JSON.stringify({rows: Array.from({length: 60000}, (_, i) => ({id: `book.lotm.cast.known.person${i % 50}`, at: i, stage: 'seen'}))});
    assert.ok(big.length * 2 > SAVE_STORAGE_BUDGET, 'the plain text is over the budget');
    assert.throws(() => checkSaveSize(big, {storage: {}, key: 'save data'}), /no room/, 'measured as plain text it is refused');
    const local = installSaveStorageCodec(new Store());
    const handle = {get length() {return local.length;}, key: i => local.key(i), getStoredItem: k => local.getStoredItem?.(k) ?? local.getItem(k), storedLength: v => local.storedLength?.(v) ?? String(v).length};
    assert.ok(checkSaveSize(big, {storage: handle, key: 'save data'}).originStorageBytes < SAVE_STORAGE_BUDGET, 'measured as stored it fits');
});

test('the import handle in main.js passes the codec measure and the other keys through', () => {
    const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    assert.match(main, /const lifeSaveStorage = \{get length\(\)\{return localStorage\.length;\},key:i=>localStorage\.key\(i\),getStoredItem:[^,]+,storedLength:v=>localStorage\.storedLength\?\.\(v\)/);
});
