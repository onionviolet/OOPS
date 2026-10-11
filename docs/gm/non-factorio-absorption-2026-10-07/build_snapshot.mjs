import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';

// Per-slice immutable preview. Other GMs can keep their own source reservations.
const root = process.cwd();
const label = process.argv[2];
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Supply a slice label.');
const output = `/tmp/yairpg-nonfactorio-${label}-20261007`;
if (fs.existsSync(output)) throw new Error('An existing preview must remain immutable; use a new label.');
fs.mkdirSync(output);
for (const file of ['src', 'assets', 'styles', 'stories', 'locales', 'resources', 'style.css', 'index.html', 'LICENSE',
    'docs/gm/feature-wave/ink', 'docs/gm/book-world-player-agency/contracts']) {
    if (fs.existsSync(file)) fs.cpSync(file, path.join(output, file), {recursive: true});
}
fs.mkdirSync(path.join(output, 'dist'));
for (const file of ['INKJS_NOTICE.txt', 'INKJS_AUTHORS.txt']) {
    fs.copyFileSync(path.join(root, 'dist', file), path.join(output, 'dist', file));
}
fs.symlinkSync(path.join(root, 'node_modules'), path.join(output, 'node_modules'));
await esbuild.build({absWorkingDir: output, entryPoints: ['src/main.js'], bundle: true,
    sourcemap: true, minify: true, outfile: 'dist/bundle.js', platform: 'browser',
    target: 'es2022', format: 'esm', logLevel: 'warning'});
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bundleHash = hash(path.join(output, 'dist/bundle.js'));
let html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
html = html.replace(/dist\/bundle\.js\?version=[^&"]+/, `dist/bundle.js?version=absorption-${bundleHash.slice(0,12)}`)
    .replace(/style\.css\?version=[^&"]+/, `style.css?version=${hash(path.join(output,'style.css')).slice(0,12)}`);
fs.writeFileSync(path.join(output, 'index.html'), html);
const map = JSON.parse(fs.readFileSync(path.join(output, 'dist/bundle.js.map'), 'utf8'));
const files = map.sources.map((source, i) => {
    const file = path.resolve(output, 'dist', source);
    if (!fs.existsSync(file) && source.includes('node_modules/')) {
        return {path: source, kind: 'vendor-embedded-source',
            sha256: createHash('sha256').update(map.sourcesContent[i]).digest('hex')};
    }
    if (fs.readFileSync(file, 'utf8') !== map.sourcesContent[i]) throw new Error(`Stale bundled source: ${source}`);
    return {path: path.relative(output, file), kind: 'filesystem-source', sha256: hash(file)};
});
const receipt = {label, previewRoot: output, bundleSha256: bundleHash, sources: files,
    sourceMapSha256: hash(path.join(output, 'dist/bundle.js.map')), indexSha256: hash(path.join(output, 'index.html'))};
fs.writeFileSync(`docs/gm/non-factorio-absorption-2026-10-07/${label}-BUILD.json`, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({previewRoot: output, bundle: bundleHash.slice(0,12), sources: files.length}));
