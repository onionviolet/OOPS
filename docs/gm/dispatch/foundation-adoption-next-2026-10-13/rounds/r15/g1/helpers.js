// Posted once to the harness control port; defines persistence helpers on globalThis.
// Snapshot reads only the stored save (what Save/reload/Import actually restore).
globalThis.dir = out;
globalThis.inv = (s, id) => s?.inventories?.person?.main_character?.[JSON.stringify({id})]?.count ?? s?.character?.inventory?.[id]?.count ?? 0;
globalThis.snap = async () => {
    const s = await saved();
    const x = s?.expansion_state || s?.expansionState || null;
    return {name: s?.character?.name, money: s?.character?.money, time: s?.['current time'],
        localLife: s?.absorb_local_life, bread: invCount(s, 'Stale bread'), balm: invCount(s, 'Healing balm'),
        effects: s?.active_effects, location: s?.['current location']};
};
globalThis.invCount = (s, id) => {
    const key = JSON.stringify({id});
    const holders = [s?.inventories?.person?.main_character, s?.character?.inventory];
    for (const h of holders) if (h && h[key]) return h[key].count ?? 1;
    for (const h of holders) if (h && h[id]) return h[id].count ?? 1;
    return 0;
};
globalThis.waitPlay = async () => {
    await page.locator('#loading_screen_play_button').waitFor({state: 'visible', timeout: 20000});
    for (let i = 0; i < 5; i++) {
        if (!(await page.locator('#loading_screen').isVisible())) break;
        await page.locator('#loading_screen_play_button').click({timeout: 3000}).catch(() => {});
        await page.waitForTimeout(800);
    }
};
globalThis.saveReload = async () => {
    await page.locator('#save_button').click();
    await page.waitForTimeout(300);
    const before = await saved();
    await page.reload({waitUntil: 'domcontentloaded'});
    await waitPlay();
    return before;
};
globalThis.exportTo = async name => {
    const [dl] = await Promise.all([page.waitForEvent('download', {timeout: 10000}), page.locator('#save_to_file_button').click()]);
    const file = out + name;
    await dl.saveAs(file);
    return file;
};
globalThis.importFrom = async file => {
    const nav = page.waitForEvent('framenavigated', {timeout: 30000});
    await page.locator('#saved_file_input').setInputFiles(file);
    await nav;
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    await waitPlay();
};
globalThis.panel = async () => {
    const open = await page.locator('#local_life_panel').evaluate(n => n.open);
    if (!open) await page.locator('#local_life_panel summary').click();
    return page.locator('#local_life_panel').innerText();
};
return 'helpers ok';
