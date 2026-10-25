'use strict';
// Disk mirror of the page's localStorage (A1, EL1/EL39). The page stays the
// only save writer (AR3); this only copies what it wrote into files under
// userData, so a wiped or corrupt browser profile is recoverable. Nothing here
// touches Electron, so it is testable alone.
//
// Layout under dir:
//   latest.json              newest snapshot, replaced atomically
//   history/<stamp>-<hash>.json.gz   rolling snapshots (bounded, see prune)
// A snapshot is { schema: 1, savedAt, reason, entries: { key: string } }, where
// entries is every localStorage key on the game origin.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const SAVE_KEY = 'save data';
const SCHEMA = 1;

const DEFAULTS = {
    // Newest history files always kept, plus the newest file of each of the
    // last `days` calendar days. History is written at most every `minGapMs`.
    keepRecent: 24,
    days: 14,
    minGapMs: 5 * 60 * 1000,
};

// Dumps the origin's storage; runs in the page via executeJavaScript.
const READ_STORAGE_SOURCE = `(() => {
    const entries = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        entries[key] = localStorage.getItem(key);
    }
    return entries;
})()`;

function hashEntries(entries) {
    const hash = crypto.createHash('sha256');
    for (const key of Object.keys(entries).sort()) hash.update(`${key.length}:${key}${entries[key].length}:${entries[key]}`);
    return hash.digest('hex');
}

// A snapshot is only worth keeping when it holds a real save; an empty or
// wiped origin must never replace a good mirror.
function hasSave(entries) {
    const raw = entries && entries[SAVE_KEY];
    if (typeof raw !== 'string' || raw.length < 2) return false;
    try { return JSON.parse(raw) !== null; } catch { return false; }
}

function writeFileAtomic(file, data) {
    const temp = `${file}.${process.pid}.tmp`;
    const fd = fs.openSync(temp, 'w');
    try {
        fs.writeSync(fd, data);
        fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
    fs.renameSync(temp, file);
}

const pad = n => String(n).padStart(2, '0');
function stamp(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
const dayOf = id => id.slice(0, 8);

function createMirror(dir, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const now = opts.now || Date.now;
    const historyDir = path.join(dir, 'history');
    let lastHash = null;
    let lastHistoryAt = 0;

    try {
        const latest = JSON.parse(fs.readFileSync(path.join(dir, 'latest.json'), 'utf8'));
        lastHash = hashEntries(latest.entries);
        lastHistoryAt = Math.max(0, ...listHistory().map(h => h.at));
    } catch { /* first run */ }

    function listHistory() {
        let names = [];
        try { names = fs.readdirSync(historyDir); } catch { return []; }
        return names
            .filter(n => /^\d{8}-\d{6}-[0-9a-f]{8}\.json\.gz$/.test(n))
            .map(n => {
                const id = n.replace(/\.json\.gz$/, '');
                const stats = fs.statSync(path.join(historyDir, n));
                return { id, at: stats.mtimeMs, bytes: stats.size };
            })
            .sort((a, b) => (a.id < b.id ? 1 : -1));
    }

    function prune() {
        const all = listHistory();
        const keep = new Set(all.slice(0, opts.keepRecent).map(h => h.id));
        const seenDays = new Set();
        for (const h of all) {
            const day = dayOf(h.id);
            if (seenDays.size < opts.days && !seenDays.has(day)) { seenDays.add(day); keep.add(h.id); }
        }
        for (const h of all) {
            if (!keep.has(h.id)) fs.rmSync(path.join(historyDir, `${h.id}.json.gz`), { force: true });
        }
    }

    // Returns { wrote, history } or { skipped: reason }. `force` bypasses the
    // history gap (restore, quit); it never bypasses the empty-save guard.
    function record(entries, { reason = 'poll', force = false } = {}) {
        if (!hasSave(entries)) return { skipped: 'no-save' };
        const hash = hashEntries(entries);
        if (hash === lastHash && !force) return { skipped: 'unchanged' };
        const at = now();
        const snapshot = { schema: SCHEMA, savedAt: new Date(at).toISOString(), reason, entries };
        fs.mkdirSync(historyDir, { recursive: true });
        let history = false;
        if (hash !== lastHash) {
            writeFileAtomic(path.join(dir, 'latest.json'), JSON.stringify(snapshot));
            lastHash = hash;
        }
        if (force || at - lastHistoryAt >= opts.minGapMs) {
            const id = `${stamp(at)}-${hash.slice(0, 8)}`;
            const file = path.join(historyDir, `${id}.json.gz`);
            if (!fs.existsSync(file)) writeFileAtomic(file, zlib.gzipSync(JSON.stringify(snapshot)));
            lastHistoryAt = at;
            history = true;
            prune();
        }
        return { wrote: true, history };
    }

    // Newest first. The latest.json copy is listed as id "latest".
    function list() {
        const out = listHistory().map(h => ({ id: h.id, bytes: h.bytes, savedAt: readHeader(h.id)?.savedAt || null, reason: readHeader(h.id)?.reason || null }));
        try {
            const latest = JSON.parse(fs.readFileSync(path.join(dir, 'latest.json'), 'utf8'));
            out.unshift({ id: 'latest', bytes: fs.statSync(path.join(dir, 'latest.json')).size, savedAt: latest.savedAt, reason: latest.reason });
        } catch { /* none yet */ }
        return out;
    }

    function readHeader(id) {
        try { const s = read(id); return { savedAt: s.savedAt, reason: s.reason }; } catch { return null; }
    }

    function read(id) {
        if (id !== 'latest' && !/^\d{8}-\d{6}-[0-9a-f]{8}$/.test(id)) throw new Error('bad snapshot id');
        const raw = id === 'latest'
            ? fs.readFileSync(path.join(dir, 'latest.json'), 'utf8')
            : zlib.gunzipSync(fs.readFileSync(path.join(historyDir, `${id}.json.gz`))).toString('utf8');
        const snapshot = JSON.parse(raw);
        if (snapshot.schema !== SCHEMA || !hasSave(snapshot.entries)) throw new Error('snapshot has no save');
        return snapshot;
    }

    return { record, list, read, dir };
}

module.exports = { createMirror, hasSave, hashEntries, READ_STORAGE_SOURCE, SAVE_KEY, DEFAULTS };
