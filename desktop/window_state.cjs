'use strict';
// Remembers the player's window size, position and maximized state (A7).
// Pure functions plus a small file store, so they test without Electron.
// Background runs never read or write it.
const fs = require('node:fs');
const path = require('node:path');

const MIN_WIDTH = 1366;
const MIN_HEIGHT = 768;
// At least this much of the window must sit on some display to count as seen.
const MIN_VISIBLE = 160;

function overlap(a, b) {
    const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? { w, h } : null;
}

// Returns bounds that fit on a connected display, or null when the saved ones
// are unusable (then the caller opens at its default size). A window saved on
// an unplugged monitor is dropped rather than opened off screen.
function clampBounds(saved, displays) {
    if (!saved || ![saved.x, saved.y, saved.width, saved.height].every(Number.isFinite)) return null;
    const areas = displays.map(d => d.workArea).filter(Boolean);
    if (!areas.length) return null;
    const onScreen = areas.some(a => {
        const o = overlap(saved, a);
        return o && o.w >= MIN_VISIBLE && o.h >= MIN_VISIBLE;
    });
    if (!onScreen) return null;
    const host = areas.reduce((best, a) => ((overlap(saved, a)?.w ?? 0) * (overlap(saved, a)?.h ?? 0) > (overlap(saved, best)?.w ?? 0) * (overlap(saved, best)?.h ?? 0) ? a : best), areas[0]);
    const width = Math.min(Math.max(saved.width, Math.min(MIN_WIDTH, host.width)), host.width);
    const height = Math.min(Math.max(saved.height, Math.min(MIN_HEIGHT, host.height)), host.height);
    const x = Math.min(Math.max(saved.x, host.x), host.x + host.width - width);
    const y = Math.min(Math.max(saved.y, host.y), host.y + host.height - height);
    return { x, y, width, height };
}

function readState(userData) {
    try {
        const state = JSON.parse(fs.readFileSync(path.join(userData, 'window-state.json'), 'utf8'));
        return state && typeof state === 'object' ? state : null;
    } catch { return null; }
}

function writeState(userData, state) {
    const file = path.join(userData, 'window-state.json');
    const temp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(state));
    fs.renameSync(temp, file);
}

module.exports = { clampBounds, readState, writeState, MIN_WIDTH, MIN_HEIGHT };
