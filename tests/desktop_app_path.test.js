// AD39 desktop host: app:// requests map only to files under the game root.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';

const { resolveAppPath, APP_ORIGIN } = createRequire(import.meta.url)('../desktop/app_path.cjs');
const root = path.resolve('/game/root');

test('maps app paths under root and ignores version queries', () => {
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/`), path.join(root, 'index.html'));
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/dist/bundle.js?version=v0.6-abc#x`), path.join(root, 'dist/bundle.js'));
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/resources/img/a%20b.png`), path.join(root, 'resources/img/a b.png'));
});

test('refuses other hosts, schemes and escapes from root', () => {
    assert.equal(resolveAppPath(root, 'app://other/index.html'), null);
    assert.equal(resolveAppPath(root, 'https://yairpg/index.html'), null);
    // The URL parser folds dot segments first, so this one stays inside root.
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/%2e%2e/%2e%2e/etc/passwd`), path.join(root, 'etc/passwd'));
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/..%2F..%2Fetc%2Fpasswd`), null);
    assert.equal(resolveAppPath(root, `${APP_ORIGIN}/a%00b`), null);
});
