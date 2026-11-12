const gate = require('../cultivation-spacing-2026-10-22/browser-helper.cjs');

gate('village-forged-axe', async ({p, boot, load, save, read, roundtrip, assert, gates}) => {
    await p.setViewportSize({width: 1920, height: 1080});
    const baseline = await boot();
    const inventory = save => save.inventories.person.main_character;
    const key = id => JSON.stringify({id});
    const stock = {'Iron ingot': 20, 'Charcoal': 4, 'Wooden medium handle': 6};
    for (const [id, count] of Object.entries(stock)) {
        inventory(baseline)[key(id)] = {count};
        baseline.item_log[id] = {id, number: count, quality_highest: 0, quality_lowest: 0};
    }
    baseline.global_flags.is_crafting_unlocked = true;
    baseline.levels.person.main_character.skill_xp.Forging = 100000;
    await load(baseline, 'fixture-ingots-handle-and-forging-admission');
    const open = async (category, subcategory, recipe) => {
        await p.evaluate(() => window.openCraftingWindow());
        await p.locator(`.crafting_mainpage_button[data-crafting_category="${category}"]`).click();
        if (subcategory !== 'items') {
            const subpage = p.locator(`#crafting_subpage_buttons [data-crafting_subcategory="${subcategory}"]`);
            if (!await subpage.isVisible()) await p.locator('[data-control-box="crafting"] button').first().click();
            await subpage.press('Enter');
            const close = p.getByRole('button', {name: 'Close Recipe view'});
            if (await close.isVisible()) await close.press('Enter');
        }
        return p.locator(`[data-crafting_category="${category}"][data-crafting_subcategory="${subcategory}"] [data-recipe_id="${recipe}"]`);
    };
    const forge = async () => {
        const row = await open('forging', 'components', 'Axe head');
        if (!await row.locator('.selectable_material').first().isVisible()) await row.locator('.recipe_name').press('Enter');
        const iron = row.locator(`.selectable_material[data-item_key='${key('Iron ingot')}']`);
        await iron.locator('.recipe_comp_name').press('Enter');
        await iron.locator('[data-material-craft="1"]').press('Enter');
    };
    for (let i = 0; i < 5; i++) await forge();
    const forged = inventory(await read());
    assert.equal(forged[key('Iron ingot')], undefined);
    const selectId = (inventory, id) => Object.keys(inventory).filter(key => JSON.parse(key).id === id);
    const offcuts = selectId(forged, 'Mixed forge offcuts');
    assert.equal(offcuts.reduce((sum, key) => sum + forged[key].count, 0), 5);
    assert.ok(selectId(forged, 'Iron axe head').every(key => JSON.parse(key).lineage.history[0].inputs[0].item_key === '{"id":"Iron ingot"}'));

    const assembly = await open('forging', 'items', 'Iron chopping axe');
    await assembly.click();
    await p.locator('#crafting_detail [data-craft-commit]').click();
    const assembled = inventory(await read());
    const [axe] = selectId(assembled, 'Iron chopping axe');
    assert.ok(axe);
    const parents = JSON.parse(axe).lineage.history[0].inputs;
    assert.ok(parents.some(row => JSON.parse(row.item_key).lineage?.family === 'axe-head'));

    const reclaim = await open('smelting', 'items', 'Reclaim forge offcuts');
    await reclaim.click();
    await p.locator('#crafting_detail [data-craft-commit]').click();
    const reclaimed = inventory(await read());
    assert.equal(selectId(reclaimed, 'Mixed forge offcuts').length, 0);
    assert.equal(selectId(reclaimed, 'Low quality iron ingot').length, 1);
    await roundtrip('forged-assembled-and-reclaimed', inventory);

    await p.evaluate(key => window.equip_item(key), axe);
    const equipped = await save();
    assert.ok(JSON.stringify(equipped.character).includes('assembled-axe'), 'equipped axe keeps the exact provenance');
    gates.push('Fixture supplies twenty ingots, six handles, charcoal and Forging admission. Native controls make the heads, assembly and reclaim, with the axe equipped through the native action.');
}, {deterministic: true}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
