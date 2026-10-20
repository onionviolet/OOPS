'use strict';
// Sandboxed preload for the game page (AD39). Exposes only a narrow host
// object; the page never gets Node or Electron.
const { contextBridge, ipcRenderer } = require('electron');

const info = ipcRenderer.sendSync('yairpg:host-info');

contextBridge.exposeInMainWorld('yairpgHost', {
    desktop: true,
    background: info.background,
    prompt: (message, initial) => ipcRenderer.sendSync('yairpg:prompt', String(message), String(initial)),
});

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
