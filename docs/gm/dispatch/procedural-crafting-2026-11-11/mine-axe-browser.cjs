const gate = require('../cultivation-spacing-2026-10-22/browser-helper.cjs');

gate('village-mined-axe', async ({p, boot, load, read, save, until, roundtrip, assert, gates}) => {
    await p.setViewportSize({width: 1920, height: 1080});
    const baseline = await boot();
    const bag = s => s.inventories.person.main_character;
    const key = id => JSON.stringify({id});
    const makeHandle = process.env.NATIVE_HANDLE === '1';
    const handleAdmission = makeHandle ? ['Steel chopping axe', 1] : ['Wooden medium handle', 3];
    for (const [id, count] of [['Charcoal', 8], handleAdmission, ['Iron pickaxe', 1]]) {
        bag(baseline)[key(id)] = {count};
        baseline.item_log[id] = {id, number: count, quality_highest: 0, quality_lowest: 0};
    }
    baseline.global_flags.is_crafting_unlocked = true;
    baseline.global_flags.is_gathering_unlocked = true;
    Object.assign(baseline.levels.person.main_character.skill_xp, {Forging: 100000, Mining: 1000000, Smelting: 100000});
    baseline.locations['Nearby cave'] = {is_unlocked: true, activities: {mining2: {is_unlocked: true}}};
    if (makeHandle) {
        baseline.locations['Forest road'] = {is_unlocked:true,activities:{woodcutting:{is_unlocked:true}}};
        Object.assign(baseline.levels.person.main_character.skill_xp, {Woodcutting:1000000, Woodworking:100000});
    }
    await load(baseline, 'fixture-cave-and-skill-admission-without-ore');

    const snapshot = () => p.evaluate(() => simulationTestHooks.snapshot());
    const advance = minutes => p.evaluate(n => advanceTicks(n), minutes);
    const travel = async location => {
        await p.evaluate(location => change_location({location_id: location}), location);
        await advance(60);
        await until(s => s['current location'] === location, 'Arrive at ' + location);
    };
    const keys = (s, id) => Object.keys(bag(s)).filter(key => JSON.parse(key).id === id);
    const stock = (s, id) => keys(s, id).reduce((sum, key) => sum + bag(s)[key].count, 0);
    assert.equal(stock(await snapshot(), 'Iron ore'), 0);
    const [pickaxe] = keys(await snapshot(), 'Iron pickaxe');
    await p.evaluate(key => equip_item(key), pickaxe);
    assert.ok((await snapshot()).character.equipment.pickaxe);
    await travel('Nearby cave');
    await p.evaluate(() => start_activity('mining2'));
    for (let i = 0; i < 30 && stock(await snapshot(), 'Iron ore') < 25; i++) await advance(25);
    await p.evaluate(() => end_activity());
    const mined = await save();
    assert.ok(stock(mined, 'Iron ore') >= 25);
    assert.ok(keys(mined, 'Iron ore').every(key => JSON.parse(key).lineage.history[0].parameters.location === 'Nearby cave'));
    await travel('Village');

    const open = async (category, recipe, components = false) => {
        await p.evaluate(() => openCraftingWindow());
        await p.locator(`.crafting_mainpage_button[data-crafting_category="${category}"]`).click();
        if (components) {
            const button = p.locator('#crafting_subpage_buttons [data-crafting_subcategory="components"]');
            if (!await button.isVisible()) await p.locator('[data-control-box="crafting"] button').first().click();
            await button.press('Enter');
            const close = p.getByRole('button', {name: 'Close Recipe view'});
            if (await close.isVisible()) await close.press('Enter');
        }
        return p.locator(`[data-crafting_category="${category}"][data-crafting_subcategory="${components ? 'components' : 'items'}"] [data-recipe_id="${recipe}"]`);
    };
    if (makeHandle) {
        assert.equal(stock(await snapshot(), 'Wooden medium handle'), 0);
        const [priorAxe] = keys(await snapshot(), 'Steel chopping axe');
        await p.evaluate(key => equip_item(key), priorAxe);
        await travel('Forest road');
        await p.evaluate(() => start_activity('woodcutting'));
        for (let i=0; i<8 && stock(await snapshot(),'Wood log')===0; i++) await advance(30);
        await p.evaluate(() => end_activity());
        assert.ok(stock(await save(),'Wood log')>0);
        await travel('Village');

        await (await open('woodworking', 'Processed wood')).click();
        await p.locator('#crafting_detail [data-craft-commit]').click();
        const handleRow = await open('woodworking', 'Medium handle', true);
        await handleRow.locator('.recipe_name').press('Enter');
        const wood = handleRow.locator('.selectable_material').filter({hasText:/^Wooden medium handle/}).first();
        await wood.locator('.recipe_comp_name').press('Enter');
        await wood.locator('[data-material-craft="1"]').press('Enter');
        const [handle] = keys(await read(),'Wooden medium handle');
        assert.ok(handle?.includes('woodworking.prepare-log'));
    }

    await (await open('smelting', 'Iron ingot')).click();
    for (let i = 0; i < 5 && stock(await read(), 'Iron ingot') < 4; i++) {
        await p.locator('#crafting_detail [data-craft-commit]').click();
    }
    const smelted = await read();
    const ingots = keys(smelted, 'Iron ingot');
    assert.ok(ingots.length >= 4, 'separate native smelts produce four traceable ingot cohorts');
    assert.ok(stock(smelted, 'Iron smelting slag') > 0);
    assert.ok(ingots.every(key => JSON.parse(key).lineage.history[0].inputs.some(row => JSON.parse(row.item_key).lineage?.family === 'iron-ore')));

    const forge = await open('forging', 'Axe head', true);
    await forge.locator('.recipe_name').press('Enter');
    const lot = forge.locator('.selectable_material').filter({hasText: /Iron axe head/}).first();
    assert.ok(ingots.includes(await lot.getAttribute('data-item_key')));
    await lot.locator('.recipe_comp_name').press('Enter');
    await lot.locator('[data-material-craft="1"]').press('Enter');
    const forged = await read();
    const [head] = keys(forged, 'Iron axe head');
    assert.equal(JSON.parse(head).lineage.history[0].inputs.length, 4);
    await (await open('forging', 'Iron chopping axe')).click();
    await p.locator('#crafting_detail [data-craft-commit]').click();
    const [axe] = keys(await read(), 'Iron chopping axe');
    assert.ok(axe);
    assert.ok(axe.includes('mining.iron'));
    if (makeHandle) assert.ok(axe.includes('woodworking.prepare-log'));
    await p.evaluate(key => equip_item(key), axe);
    const before = await save();
    assert.equal(before.character.equipment.axe.inventory_key, axe);
    await p.evaluate(() => start_activity('woodcutting'));
    for (let i = 0; i < 8 && stock(await snapshot(), 'Rough wood log') <= stock(before, 'Rough wood log'); i++) await advance(30);
    await p.evaluate(() => end_activity());
    assert.ok(stock(await save(), 'Rough wood log') > stock(before, 'Rough wood log'));
    await roundtrip('equipped-mined-iron-axe', s => ({equipment:s.character.equipment,inventory:bag(s)}));
    gates.push(makeHandle
        ? 'Fixture supplies admission, a pickaxe, an existing steel axe and fuel. The new axe uses harvested ore and wood, then chops its own wood.'
        : 'Fixture supplies admission, a pickaxe, fuel and handles. Actual mining, smelting, forging, assembly, equip and chopping use the native activity and crafting routes.');
}, {deterministic:true}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
