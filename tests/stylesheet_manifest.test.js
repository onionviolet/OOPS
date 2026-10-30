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

// A styles/*.css file that is not in the manifest is not loaded by the game page, so it must be listed here with a reason.
const NOT_LOADED_ON_PURPOSE = {
    'styles/palette_feedback.css': 'loaded through the @import at the top of style.css',
    'styles/palette_reports.css': 'loaded through the @import at the top of style.css',
    'styles/figure_gallery.css': 'only figure-gallery.html and item-card-gallery.html link it',
    'styles/ui_preview.css': 'only ui-preview.html links it',
};

test('every styles/*.css file is in the manifest or on the not-loaded-on-purpose list', () => {
    const manifest = new Set(readManifest());
    const unlisted = readdirSync('styles').filter(f => f.endsWith('.css')).map(f => `styles/${f}`)
        .filter(f => !manifest.has(f) && !(f in NOT_LOADED_ON_PURPOSE));
    assert.deepEqual(unlisted, [], 'add each to styles/manifest.txt, or to NOT_LOADED_ON_PURPOSE with a reason');
    for (const [f, why] of Object.entries(NOT_LOADED_ON_PURPOSE)) {
        assert.ok(existsSync(f), `${f} is gone; drop it from the list`);
        assert.ok(!manifest.has(f), `${f} is in the manifest (${why}); drop it from the list`);
    }
});

test('the @import sheets named above really are imported by style.css', () => {
    const css = readFileSync('style.css', 'utf8');
    for (const [f, why] of Object.entries(NOT_LOADED_ON_PURPOSE)) {
        if (why.includes('@import')) assert.ok(css.includes(f), `${f} is not imported by style.css`);
    }
});
