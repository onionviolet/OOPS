'use strict';
// The game window's size and position (A7); not kept for background runs.
const { app, screen } = require('electron');
const { clampBounds, readState, writeState } = require('./window_state.cjs');
const { background } = require('./host_context.cjs');

function windowOptions() {
    const { workAreaSize } = screen.getPrimaryDisplay();
    const base = { width: Math.min(1920, workAreaSize.width), height: Math.min(1080, workAreaSize.height) };
    if (background) return { base, state: null };
    const state = readState(app.getPath('userData'));
    const bounds = clampBounds(state?.bounds, screen.getAllDisplays());
    return { base: bounds || base, state: bounds ? state : null };
}

function trackWindowState(win, maximized) {
    if (background) return;
    const userData = app.getPath('userData');
    let timer = null;
    const save = () => {
        if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
        try { writeState(userData, { bounds: win.getNormalBounds(), maximized: win.isMaximized() }); } catch { /* best effort */ }
    };
    const later = () => { clearTimeout(timer); timer = setTimeout(save, 500); };
    win.on('resize', later);
    win.on('move', later);
    win.on('close', save);
    if (maximized) win.maximize();
}

module.exports = { windowOptions, trackWindowState };
