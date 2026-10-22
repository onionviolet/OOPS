'use strict';
// Frozen player builds (EL18). The player's window serves a copy of the page
// files under userData/builds/<version>-<fingerprint>/, so an agent's
// `npm run build` never changes what an open game loads. Plain Node, no
// Electron: `npm run desktop:snapshot` and the host both use it.
//
// builds/latest.json  newest snapshot made; the host watches it.
// builds/current.json the snapshot the player adopted; the host serves it.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

// Everything the page loads at runtime. Directories copy whole. Source maps
// are kept so stack traces from a frozen build still read.
const SNAPSHOT_FILES = [
    'index.html', 'style.css', 'favicon.ico', 'help.html', 'changelog.html',
    'dist/bundle.js', 'dist/bundle.js.map', 'dist/INKJS_NOTICE.txt', 'dist/INKJS_AUTHORS.txt',
    // changelog.html imports it directly for the version label.
    'src/game_version.js',
];
const SNAPSHOT_DIRS = ['styles', 'resources', 'assets', 'locales', 'stories'];
const REQUIRED = ['index.html', 'dist/bundle.js'];
// Old snapshots beyond these, other than current and latest, are pruned.
const KEEP = 3;

const buildsDir = userData => path.join(userData, 'builds');
const ID_PATTERN = /^[A-Za-z0-9._-]+$/;

// Electron's default userData is appData/<productName or name>; the npm
// script has no Electron app object, so it derives the same path.
function defaultUserData(root) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const name = pkg.productName || pkg.name;
    const home = os.homedir();
    if (process.platform === 'darwin') return path.join(home, 'Library', 'Application Support', name);
    if (process.platform === 'win32') return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), name);
    return path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), name);
}

function listFiles(root) {
    const files = [];
    for (const rel of SNAPSHOT_FILES) {
        if (fs.existsSync(path.join(root, rel))) files.push(rel);
        else if (REQUIRED.includes(rel)) throw new Error(`Snapshot source is missing ${rel}; run npm run build first.`);
    }
    const walk = (rel, ancestors = new Set()) => {
        // Local font/content directories may be linked into an isolated build.
        // Freeze their bytes too, rather than silently dropping linked assets.
        const real = fs.realpathSync(path.join(root, rel));
        if (ancestors.has(real)) throw new Error(`Snapshot directory link cycle: ${rel}`);
        const next = new Set(ancestors).add(real);
        for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
            const child = path.posix.join(rel, entry.name);
            const type = entry.isSymbolicLink() ? fs.statSync(path.join(root, child)) : entry;
            if (type.isDirectory()) walk(child, next);
            else if (type.isFile() && entry.name !== '.DS_Store') files.push(child);
        }
    };
    for (const dir of SNAPSHOT_DIRS) if (fs.existsSync(path.join(root, dir))) walk(dir);
    // Optional private content packs (src/content_packs.js): the manifest and
    // each listed pack's folder, so a frozen build keeps the player's packs.
    const manifest = 'private_packs/manifest.json';
    if (fs.existsSync(path.join(root, manifest))) {
        files.push(manifest);
        let packs = [];
        try { packs = JSON.parse(fs.readFileSync(path.join(root, manifest), 'utf8')).packs || []; } catch { /* the page reports a bad manifest */ }
        for (const pack of new Set(packs.filter(p => typeof p === 'string' && /^[a-z0-9_-]+\/pack\.json$/i.test(p)).map(p => p.split('/')[0]))) {
            if (fs.existsSync(path.join(root, 'private_packs', pack))) walk(`private_packs/${pack}`);
        }
    }
    return [...new Set(files)].sort();
}

function gameVersion(root) {
    try {
        const text = fs.readFileSync(path.join(root, 'src', 'game_version.js'), 'utf8');
        return text.match(/game_version\s*=\s*"([^"]+)"/)?.[1] || 'dev';
    } catch { return 'dev'; }
}

// Any served file changing gives a new id, not only the bundle.
function fingerprint(root, files) {
    const hash = crypto.createHash('sha256');
    for (const rel of files) {
        hash.update(rel + '\0');
        hash.update(fs.readFileSync(path.join(root, rel)));
        hash.update('\0');
    }
    return hash.digest('hex').slice(0, 12);
}

function readPointer(userData, name) {
    try {
        const id = JSON.parse(fs.readFileSync(path.join(buildsDir(userData), name), 'utf8')).id;
        if (typeof id === 'string' && ID_PATTERN.test(id) && fs.existsSync(path.join(buildsDir(userData), id, 'index.html'))) return id;
    } catch { /* missing or torn pointer reads as none */ }
    return null;
}

function writePointer(userData, name, id, extra = {}) {
    const file = path.join(buildsDir(userData), name);
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, JSON.stringify({ id, at: new Date().toISOString(), ...extra }, null, 1));
    fs.renameSync(temp, file);
}

const snapshotRoot = (userData, id) => path.join(buildsDir(userData), id);

function prune(userData) {
    const dir = buildsDir(userData);
    const keep = new Set([readPointer(userData, 'latest.json'), readPointer(userData, 'current.json')].filter(Boolean));
    const builds = fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => e.isDirectory() && !e.name.startsWith('.') && !keep.has(e.name))
        .map(e => ({ name: e.name, mtime: fs.statSync(path.join(dir, e.name)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime);
    for (const old of builds.slice(Math.max(0, KEEP - keep.size))) fs.rmSync(path.join(dir, old.name), { recursive: true, force: true });
}

// Copies the page files from root into a new snapshot and points latest at
// it. The folder appears whole (temp copy, then rename) before the pointer.
function makeSnapshot(root, userData) {
    const files = listFiles(root);
    const id = `${gameVersion(root)}-${fingerprint(root, files)}`;
    const dir = buildsDir(userData);
    const target = path.join(dir, id);
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(path.join(target, 'index.html'))) {
        const temp = path.join(dir, `.tmp-${id}-${process.pid}`);
        fs.rmSync(temp, { recursive: true, force: true });
        for (const rel of files) {
            const to = path.join(temp, rel);
            fs.mkdirSync(path.dirname(to), { recursive: true });
            fs.copyFileSync(path.join(root, rel), to);
        }
        fs.rmSync(target, { recursive: true, force: true });
        fs.renameSync(temp, target);
    }
    writePointer(userData, 'latest.json', id, { files: files.length });
    prune(userData);
    return { id, root: target, files: files.length };
}

module.exports = { SNAPSHOT_FILES, SNAPSHOT_DIRS, defaultUserData, listFiles, makeSnapshot, readPointer, writePointer, snapshotRoot, buildsDir };

// `npm run desktop:snapshot [--from <root>]` writes to YAIRPG_USER_DATA or
// the player's own profile. Agent runs must pass YAIRPG_USER_DATA.
if (require.main === module) {
    const args = process.argv.slice(2);
    const from = args.includes('--from') ? path.resolve(args[args.indexOf('--from') + 1]) : path.resolve(__dirname, '..');
    if (!process.env.YAIRPG_USER_DATA && (process.env.YAIRPG_HIDDEN === '1' || process.env.YAIRPG_INACTIVE === '1')) {
        console.error('Background run without YAIRPG_USER_DATA: refusing to write the player\'s profile.');
        process.exit(2);
    }
    const userData = process.env.YAIRPG_USER_DATA ? path.resolve(process.env.YAIRPG_USER_DATA) : defaultUserData(path.resolve(__dirname, '..'));
    const result = makeSnapshot(from, userData);
    console.log(`Snapshot ${result.id} (${result.files} files) in ${result.root}`);
}
