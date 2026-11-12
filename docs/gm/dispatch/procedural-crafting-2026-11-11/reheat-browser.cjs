const gate = require('../cultivation-spacing-2026-10-22/browser-helper.cjs');

gate('village-reheat', async ({p, boot, load, save, played, roundtrip, assert, gates}) => {
    await p.setViewportSize({width: 1920, height: 1080});
    const baseline = await boot();
    const gear = JSON.stringify({components: {head: 'Cheap iron short blade', handle: 'Simple wooden short handle'}, quality: 100});
    const charcoal = '{"id":"Charcoal"}', oil = '{"id":"Lamp oil"}';
    const inventory = save => save.inventories.person.main_character;
    Object.assign(inventory(baseline), {[gear]: {count: 1}, [charcoal]: {count: 3}, [oil]: {count: 1}});
    baseline.availabilities.dialogue.oldCraftsman = 1;
    await load(baseline, 'fixture-existing-dagger-and-fuel');

    const panel = p.locator('#gear_workshop');
    const commit = panel.locator('[data-gear-commit]');
    const choose = async (action, key) => {
        await p.evaluate(() => {
            const menu = document.querySelector('[aria-label="Other known panels"]');
            menu.value = 'gear-workshop';
            menu.dispatchEvent(new Event('change', {bubbles: true}));
        });
        await panel.getByRole('combobox', {name: 'Carried gear', exact: true}).selectOption(key);
        await panel.getByRole('combobox', {name: 'Gear process', exact: true}).selectOption(action);
        if (action === 'quench') await panel.getByRole('combobox', {name: 'Process material', exact: true}).selectOption(oil);
    };
    const worked = async () => Object.keys(inventory(await save())).find(key => JSON.parse(key).gearwork);
    const run = async (action, key) => {
        await choose(action, key);
        assert.equal(await commit.isEnabled(), true, await panel.innerText());
        await commit.press('Enter');
        const result = await worked();
        assert.ok(result);
        return result;
    };

    const heated = await run('heat', gear);
    const shaped = await run('shape', heated);
    await played(6);
    await choose('quench', shaped);
    assert.equal(await commit.isEnabled(), false);
    assert.match(await panel.innerText(), /cooled/);
    await roundtrip('cooled-shaped-dagger', inventory);

    const reheated = await run('heat', shaped);
    assert.equal(JSON.parse(reheated).e2_instance, JSON.parse(shaped).e2_instance);
    assert.equal(JSON.parse(reheated).gearwork.treatment.stage, 'shaped');
    assert.equal(inventory(await save())[charcoal].count, 1);
    await choose('shape', reheated);
    assert.equal(await commit.isEnabled(), false);
    assert.match(await panel.innerText(), /already been shaped/);

    const quenched = await run('quench', reheated);
    assert.equal(JSON.parse(quenched).gearwork.treatment.stage, 'quenched');
    assert.equal(inventory(await save())[oil], undefined);
    await roundtrip('reheated-and-quenched-dagger', inventory);
    gates.push('Fixture supplies the original dagger and fuel. Paid heat, shape, cooling, reheat and quench use native controls.');
}, {deterministic: true}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
