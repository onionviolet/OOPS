'use strict';
// Maps an app://yairpg/... request to a file under the game root (AD39).
// Pure so it can be tested without Electron.
const path = require('node:path');

// The origin keys localStorage, so saves live under it. Never rename it:
// a new scheme or host starts with an empty save.
const APP_SCHEME = 'app';
const APP_HOST = 'yairpg';
const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;

// Returns an absolute file path, or null for another host or a path that
// escapes root. Query strings (?version=...) and hashes are ignored.
function resolveAppPath(root, requestUrl) {
    let url;
    try { url = new URL(requestUrl); } catch { return null; }
    if (url.protocol !== `${APP_SCHEME}:` || url.host !== APP_HOST) return null;
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return null; }
    if (pathname.includes('\0')) return null;
    if (pathname === '/' || pathname === '') pathname = '/index.html';
    const base = path.resolve(root);
    const file = path.resolve(base, '.' + pathname);
    if (file !== base && !file.startsWith(base + path.sep)) return null;
    return file;
}

module.exports = { APP_SCHEME, APP_HOST, APP_ORIGIN, resolveAppPath };
