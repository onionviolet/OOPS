'use strict';
// Sandboxed preload for the game page (AD39). Exposes only a narrow host
// object; the page never gets Node or Electron.
const { contextBridge, ipcRenderer } = require('electron');

const info = ipcRenderer.sendSync('yairpg:host-info');

contextBridge.exposeInMainWorld('yairpgHost', {
    desktop: true,
    background: info.background,
    build: info.build,
    capabilities: info.capabilities || [],
    prompt: (message, initial) => ipcRenderer.sendSync('yairpg:prompt', String(message), String(initial)),
    // Save backups (A1). An older main process has no handler, so a rejected
    // call reads as "no backups" instead of an error.
    mirrorList: () => ipcRenderer.invoke('yairpg:mirror-list').catch(() => []),
    // Something is waiting for the player (src/host.js). Fire and forget.
    attention: (count, label) => ipcRenderer.send('yairpg:attention', Number(count) || 0, String(label || '').slice(0, 120)),
    // Pop-out panels (A3, src/host.js). The game page sends projections; a
    // pop-out page listens and can ask for the latest one when it opens.
    projection: (name, data) => ipcRenderer.send('yairpg:projection', String(name), data),
    onProjection: callback => { ipcRenderer.on('yairpg:projection', (_event, name, data) => callback(name, data)); },
    projectionLatest: name => ipcRenderer.invoke('yairpg:projection-latest', String(name)).catch(() => null),
    mirrorRestore: id => ipcRenderer.invoke('yairpg:mirror-restore', String(id)).catch(() => false),
});

// Hang guard heartbeat (EL46): a page stuck in a busy loop cannot answer.
ipcRenderer.on('yairpg:ping', () => ipcRenderer.send('yairpg:pong'));

// Electron has no window.prompt. Background runs also cancel alert and confirm
// so a native dialog never appears over the player's screen.
contextBridge.executeInMainWorld({
    func: background => {
        window.prompt = (message = '', initial = '') => window.yairpgHost.prompt(message, initial);
        if (!background) return;
        window.alert = message => console.warn('[background alert]', message);
        window.confirm = message => { console.warn('[background confirm, cancelled]', message); return false; };
    },
    args: [info.background],
});

// Frozen builds (EL18): when the host has a newer snapshot, a small notice
// offers to save and reload. Nothing reloads until the player clicks. The
// notice is host chrome built here; saving goes through the game's own
// saveProgress, so the page stays the only save writer (AR3).
const NOTICE_ID = 'yairpg_host_build_notice';
let pendingBuild = null;

function buildNotice() {
    if (!pendingBuild || !document.body) return;
    let box = document.getElementById(NOTICE_ID);
    if (!box) {
        box = document.createElement('div');
        box.id = NOTICE_ID;
        box.setAttribute('role', 'status');
        box.style.cssText = [
            'position:fixed', 'left:12px', 'bottom:12px', 'z-index:2147483000',
            'display:flex', 'gap:8px', 'align-items:center', 'padding:6px 10px',
            'font:13px/1.3 system-ui,sans-serif',
            'color:var(--p23-notice,#e8e8e8)', 'background:var(--p23-message-fill,#1f1f1f)',
            'border:1px solid var(--p23-frame,#555)', 'box-shadow:0 2px 8px rgba(0,0,0,.4)',
        ].join(';');
        document.body.append(box);
    }
    const text = document.createElement('span');
    text.textContent = 'New build ready';
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.id = 'yairpg_host_build_reload';
    reload.textContent = 'Save and reload';
    reload.onclick = () => {
        reload.disabled = true;
        // The page also flushes saves on pagehide, so the reload keeps any
        // progress this manual save could not write.
        contextBridge.executeInMainWorld({ func: () => { window.saveProgress?.(); } });
        ipcRenderer.invoke('yairpg:adopt-build').then(ok => { if (!ok) box.remove(); });
    };
    const later = document.createElement('button');
    later.type = 'button';
    later.textContent = 'Later';
    later.onclick = () => { pendingBuild = null; box.remove(); };
    for (const b of [reload, later]) b.style.cssText = 'font:inherit;padding:2px 8px;cursor:pointer';
    box.replaceChildren(text, reload, later);
}

ipcRenderer.on('yairpg:build-ready', (_event, build) => {
    pendingBuild = build;
    if (document.body) buildNotice();
    else addEventListener('DOMContentLoaded', buildNotice, { once: true });
});
