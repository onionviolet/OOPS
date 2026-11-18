// Pin store (GA5, PSA29): one address space, one read, two layers. A manifest layer holds canon pins and named
// exceptions (content, loaded from reviewed files, never saved); a cheat layer holds values set from the debug view
// (saved in the `pins` slice). Default: a canon or exception pin wins, and a cheat cannot take its address (dial: a
// world that lets a cheat bend canon would add an explicit override here, with a cost). Pure; the domain owns state.
import {address, drawU32} from './gen_kit.js';

export const PIN_SCHEMA = 1, MAX_CHEATS = 200, MAX_VALUE_CHARS = 2000;
export const MANIFEST_KINDS = ['canon', 'exception'];
const plain = v => v !== null && typeof v === 'object' && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);

// space = a dotted namespace such as "gu.rank"; parts = the ids inside it. Same canonical form as gen_kit draws.
export function pinAddress(space, ...parts) {
    if (typeof space !== 'string' || !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/.test(space)) throw TypeError('A pin space is a dotted lowercase name.');
    if (!parts.length) throw TypeError('A pin address needs at least one id after its space.');
    return address(space, ...parts);
}
export function parseAddress(text) {
    let parts;
    try { parts = JSON.parse(text); } catch { throw TypeError('Not a pin address.'); }
    if (!Array.isArray(parts) || parts.length < 2 || typeof parts[0] !== 'string') throw TypeError('Not a pin address.');
    return parts;
}
// JSON data only, no undefined, no non-finite numbers, bounded, returned as an independent copy.
export function cleanValue(value) {
    const text = JSON.stringify(value);
    if (text === undefined || text.length > MAX_VALUE_CHARS) throw RangeError('A pin value is JSON data up to 2000 characters.');
    return JSON.parse(text);
}

const manifests = new Map();
// pins: [{address, value, kind:'canon'|'exception', reason, reasonStatus:'read'|'class-only', source}]. An exception names
// why the rule misses; reasonStatus 'class-only' says the in-world reason is not yet read from the source.
export function registerManifest(name, pins) {
    if (typeof name !== 'string' || !name) throw TypeError('A manifest needs a name.');
    const byAddress = new Map();
    for (const pin of pins) {
        parseAddress(pin.address);
        if (!MANIFEST_KINDS.includes(pin.kind)) throw TypeError(`Unknown pin kind ${pin.kind}.`);
        if (typeof pin.reason !== 'string' || !pin.reason) throw TypeError('A manifest pin names its reason.');
        if (!['read', 'class-only'].includes(pin.reasonStatus)) throw TypeError('reasonStatus is read or class-only.');
        if (byAddress.has(pin.address)) throw TypeError(`Duplicate pin ${pin.address}.`);
        byAddress.set(pin.address, {...pin, value: cleanValue(pin.value), manifest: name});
    }
    const revision = String(drawU32(1, JSON.stringify([...byAddress.values()].sort((a, b) => a.address < b.address ? -1 : 1))));
    manifests.set(name, {revision, pins: byAddress});
    return revision;
}
export const manifestRevisions = () => Object.fromEntries([...manifests].map(([name, m]) => [name, m.revision]));
const manifestPin = addr => { for (const [, m] of manifests) if (m.pins.has(addr)) return {...m.pins.get(addr), revision: m.revision}; return null; };

export const freshPins = () => ({schema: PIN_SCHEMA, revision: 0, cheats: {}, manifests: {}});
export const isFresh = state => !Object.keys(state.cheats).length;

// One read for every use. Layers: 'manifest' (canon or exception) first, then 'cheat'. null when nothing is pinned.
export function readPin(state, addr) {
    const held = manifestPin(addr);
    if (held) return {address: addr, layer: 'manifest', kind: held.kind, value: structuredClone(held.value), reason: held.reason,
        reasonStatus: held.reasonStatus, source: held.source ?? null, manifest: held.manifest, revision: held.revision};
    const cheat = state.cheats[addr];
    return cheat ? {address: addr, layer: 'cheat', kind: 'cheat', value: structuredClone(cheat.value), reason: cheat.note || 'set from the debug view',
        reasonStatus: 'cheat', source: null, manifest: null, revision: String(cheat.revision)} : null;
}
export function setCheat(state, addr, value, note = '') {
    parseAddress(addr);
    if (manifestPin(addr)) throw Error('A canon pin holds this address; a cheat cannot take it.');
    if (typeof note !== 'string' || note.length > 200) throw RangeError('A cheat note is up to 200 characters.');
    if (!Object.hasOwn(state.cheats, addr) && Object.keys(state.cheats).length >= MAX_CHEATS) throw RangeError('Too many cheat pins.');
    const revision = state.revision + 1;
    return {...state, revision, cheats: {...state.cheats, [addr]: {value: cleanValue(value), note, revision}}, manifests: manifestRevisions()};
}
export function clearCheat(state, addr) {
    if (!Object.hasOwn(state.cheats, addr)) return state;
    const cheats = {...state.cheats}; delete cheats[addr];
    return {...state, revision: state.revision + 1, cheats};
}
export function listPins(state) {
    const rows = [];
    for (const [, m] of manifests) for (const addr of m.pins.keys()) rows.push(readPin(state, addr));
    for (const addr of Object.keys(state.cheats)) rows.push(readPin(state, addr));
    return rows;
}
// Saved manifests whose content changed since the save: a visible note, never a silent swap.
export const manifestDrift = state => Object.entries(state.manifests).filter(([name, rev]) => manifests.get(name)?.revision !== rev)
    .map(([name, saved]) => ({name, saved, current: manifests.get(name)?.revision ?? null}));

export function validate(slice) {
    if (!plain(slice) || slice.schema !== PIN_SCHEMA || !Number.isSafeInteger(slice.revision) || slice.revision < 0) throw TypeError('Invalid pins slice.');
    if (!plain(slice.cheats) || !plain(slice.manifests)) throw TypeError('Invalid pins slice.');
    if (Object.keys(slice.cheats).length > MAX_CHEATS) throw RangeError('Too many cheat pins.');
    for (const [addr, c] of Object.entries(slice.cheats)) {
        parseAddress(addr);
        if (!plain(c) || typeof c.note !== 'string' || !Number.isSafeInteger(c.revision)) throw TypeError('Invalid cheat pin.');
        cleanValue(c.value);
    }
    for (const [name, rev] of Object.entries(slice.manifests)) if (typeof rev !== 'string' || !name) throw TypeError('Invalid manifest ref.');
    return slice;
}
// Slices before this store do not exist, so null is a fresh store. A slice from a newer schema is refused, not guessed at.
export function migrate(slice) {
    if (slice == null) return freshPins();
    if (plain(slice) && slice.schema > PIN_SCHEMA) throw Error('This save has pins from a newer game version.');
    return slice;
}
