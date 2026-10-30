import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {readManifest, renderStylesheets} from '../scripts/stylesheet_manifest.mjs';

const hrefsIn = html => [...html.matchAll(/<link\b[^>]*rel\s*=\s*"stylesheet"[^>]*>/g)].map(m => m[0].match(/href\s*=\s*"([^"?]+)/)[1]);

test('each manifest stylesheet exists and is listed once', () => {
    const hrefs = readManifest();
    assert.deepEqual(hrefs.filter((h, i) => hrefs.indexOf(h) !== i), []);
    for (const h of hrefs) assert.ok(existsSync(h), `${h} is in styles/manifest.txt but missing on disk`);
});

test('index.html loads each manifest stylesheet once, in manifest order, and no others', () => {
    const html = readFileSync('index.html', 'utf8');
    assert.deepEqual(hrefsIn(html), readManifest());
});

test('rendering the manifest into the page is idempotent and keeps order', () => {
    const html = readFileSync('index.html', 'utf8');
    const once = renderStylesheets(html, readManifest(), () => 'v');
    assert.equal(renderStylesheets(once, readManifest(), () => 'v'), once);
    assert.deepEqual(hrefsIn(once), readManifest());
});

test('the figure gallery manifest names each fixture module once', () => {
    const src = readFileSync('src/ui/preview/fixtures/manifest.js', 'utf8');
    const paths = [...src.matchAll(/import\('(\.\/[\w]+\.js)'\)/g)].map(m => m[1]);
    assert.deepEqual(paths.filter((p, i) => paths.indexOf(p) !== i), []);
    for (const p of paths) assert.ok(existsSync(`src/ui/preview/fixtures/${p.slice(2)}`), p);
    const gallery = readFileSync('src/ui/preview/figure_gallery.js', 'utf8');
    assert.doesNotMatch(gallery, /import\s+(?:\{[^}]*\}\s+from\s+)?'\.\/fixtures\/(?!manifest)/);
});
