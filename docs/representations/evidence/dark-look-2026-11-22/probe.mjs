// DK1 and DK2 in Chromium on a rebuilt bundle: a fresh game opens in the darker Graphite; a save carrying an edited navy
// Luminous look moves to Graphite once, keeps the old look as "Kept look", and stays moved after save and reload.
//   node docs/representations/evidence/dark-look-2026-11-22/probe.mjs
import assert from 'node:assert/strict';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Session, buildBundle, serve} from '../../../../scripts/playtest/lib.mjs';

const out = dirname(fileURLToPath(import.meta.url)), WALL = Date.UTC(2026, 10, 22, 12);
const bundle = await buildBundle(), server = await serve(bundle.dir);
const look = p => p.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('save data') || '{}'), c = save.customization;
    const m = document.querySelector('.customization-module[data-component-theme]');
    return {theme: m?.dataset.componentTheme, page: getComputedStyle(document.body).backgroundColor, mark: save.customization_default,
        active: c?.active, profiles: c ? Object.keys(c.profiles) : null,
        button: (() => { const b = document.querySelector('#main_content .workspace-module button'); return b ? getComputedStyle(b).borderTopColor : null; })()};
});
try {
    const s = await new Session({url: server.url, seed: 5, wall: WALL}).start();
    let saved;
    try {
        await s.open();
        await s.step(5);
        const a = await look(s.page);
        console.log('fresh', JSON.stringify(a));
        assert.equal(a.theme, 'graphite');
        await s.page.screenshot({path: join(out, 'fresh-1920.png')});
        await s.page.setViewportSize({width: 1280, height: 800});
        await s.page.waitForTimeout(400);
        await s.page.screenshot({path: join(out, 'fresh-1280.png')});
        saved = await s.save();
    } finally {await s.close();}
    // An old save: an edited Luminous Default, saved before the mark.
    const old = JSON.parse(JSON.stringify(saved));
    old.customization_default = 'graphite';
    old.customization.profiles.Default.settings.componentTheme = 'luminous';
    old.customization.profiles.Default.settings.palette = {background: '#07162d', text: '#f1f2f5', accent: '#9bb4ae'};
    old.customization.profiles.Default.settings.spacing = 12;
    const s2 = await new Session({url: server.url, seed: 5, wall: WALL}).start();
    try {
        await s2.open(old);
        await s2.step(5);
        const b = await look(s2.page);
        console.log('old save, opened', JSON.stringify(b));
        assert.equal(b.theme, 'graphite');
        const kept = await s2.save();
        console.log('after save', JSON.stringify({mark: kept.customization_default, active: kept.customization.active, profiles: Object.keys(kept.customization.profiles), keptTheme: kept.customization.profiles['Kept look']?.settings.componentTheme}));
        assert.equal(kept.customization_default, 'graphite-dark-2026-11-22');
        assert.equal(kept.customization.profiles['Kept look']?.settings.componentTheme, 'luminous');
        await s2.page.reload();
        await s2.page.waitForFunction(() => !!window.simulationTestHooks, null, {timeout: 60000});
        await s2.page.waitForTimeout(800);
        const c = await look(s2.page);
        console.log('after reload', JSON.stringify(c));
        assert.equal(c.theme, 'graphite');
        await s2.page.screenshot({path: join(out, 'old-save-moved-1920.png')});
        const real = s2.errors.filter(e => e.kind === 'pageerror' || !/Failed to load resource/.test(e.text));
        assert.equal(real.length, 0, JSON.stringify(real));
    } finally {await s2.close();}
    console.log('PASS');
} finally {server.close(); await bundle.dispose();}
