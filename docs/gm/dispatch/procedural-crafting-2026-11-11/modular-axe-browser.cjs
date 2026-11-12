const gate = require('../cultivation-spacing-2026-10-22/browser-helper.cjs');

gate('village-modular-axe', async ({p, boot, load, read, save, roundtrip, assert, gates}) => {
    await p.setViewportSize({width:1920,height:1080});
    const {planProcessedMaterial} = await import('../../../../src/material_lineage.js');
    const baseline = await boot();
    const inventory = s => s.inventories.person.main_character;
    const key = id => JSON.stringify({id});
    const part = (id, family, quality, material) => {
        const source = key(material);
        return planProcessedMaterial({
            stock:{[source]:1}, inputs:[{item_key:source,count:1}],
            output:{id,family,quality,count:1},
            process:{id:'fixture.prepare-component',revision:1,at:1,world_id:'base.frontier'}
        }).item_key;
    };
    const head = part('Iron axe head','axe-head',90,'Iron ingot');
    const handle = part('Simple wooden medium handle','wooden-handle',60,'Processed rough wood');
    const ash = part('Ash wood medium handle','wooden-handle',100,'Processed ash wood');
    for (const item of [head,handle,ash]) {
        const {id,quality}=JSON.parse(item);
        inventory(baseline)[item]={count:1};
        baseline.item_log[id]={id,number:1,quality_highest:quality,quality_lowest:quality};
    }
    baseline.global_flags.is_crafting_unlocked=true;
    baseline.availabilities.dialogue.oldCraftsman=1;
    baseline.equipment_durability={schema:1,enabled:false,nextId:1,condition:{}};
    await load(baseline,'fixture-three-traced-components');
    const assemble = async selectedParts => {
        await p.evaluate(()=>openCraftingWindow());
        await p.locator('.crafting_mainpage_button[data-crafting_category="crafting"]').click();
        const equipment = p.locator('#crafting_subpage_buttons [data-crafting_subcategory="equipment"]');
        if (!await equipment.isVisible()) await p.locator('[data-control-box="crafting"] button').first().click();
        await equipment.press('Enter');
        const close = p.getByRole('button',{name:'Close Recipe view'});
        if(await close.isVisible()) await close.press('Enter');
        const row = p.locator('[data-crafting_category="crafting"][data-crafting_subcategory="equipment"] [data-recipe_id="Axe"]');
        await row.locator('.recipe_name').press('Enter');
        for (const [index,selected] of selectedParts.entries()) {
            const selection = row.locator('.crafting_selection').nth(index);
            await selection.click();
            const part = row.locator('.selectable_component').filter({hasText:JSON.parse(selected).id}).first();
            assert.equal(await part.getAttribute('data-item_key'),selected);
            await part.press('Enter');
        }
        await row.locator('.recipe_creation_button').press('Enter');
    };
    await assemble([head,handle]);
    let assembled = Object.keys(inventory(await read())).find(k=>JSON.parse(k).componentLineage?.head===head);
    assert.ok(assembled);
    assert.equal(JSON.parse(assembled).componentLineage.handle,handle);
    await roundtrip('assembled-component-lineage',inventory);
    assert.ok(inventory(await save())[assembled],'the live loader restores the complete equipment key');
    await p.evaluate(key=>equip_item(key),assembled);
    const equipped = s => s.character.equipment.weapon.inventory_key;
    assert.equal(equipped(await save()),assembled);
    await roundtrip('equipped-without-durability-instance',equipped);
    assert.equal(equipped(await save()),assembled);
    await p.evaluate(()=>unequip_item('weapon'));
    assert.ok(inventory(await save())[assembled]);

    const panel=p.locator('#gear_workshop');
    const openWorkshop=()=>p.evaluate(()=>{
        const menu=document.querySelector('[aria-label="Other known panels"]');
        menu.value='gear-workshop';
        menu.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await openWorkshop();
    const choose=(name,value)=>panel.getByRole('combobox',{name,exact:true}).selectOption(value);
    await choose('Carried gear',assembled);
    await choose('Gear process','swap');
    await choose('Structural component','handle');
    await choose('Process material',ash);
    const commit=panel.locator('[data-gear-commit]');
    assert.equal(await commit.isEnabled(),true,await panel.innerText());
    await commit.press('Enter');
    const swapped=inventory(await save());
    const refitted=Object.keys(swapped).find(k=>JSON.parse(k).componentLineage?.handle===ash);
    assert.ok(refitted);
    assert.equal(swapped[assembled],undefined);
    assert.ok(Object.keys(swapped).some(k=>JSON.parse(k).lineage?.history[0].inputs[0].item_key===handle));
    await choose('Carried gear',refitted);
    await choose('Gear process','salvage');
    await commit.press('Enter');
    const recovered=inventory(await save());
    assert.equal(recovered[refitted],undefined);
    for(const prior of [head,ash]) {
        assert.ok(Object.keys(recovered).some(k=>JSON.parse(k).lineage?.history[0].inputs[0].item_key===prior));
    }
    await roundtrip('salvaged-component-lineage',inventory);
    assert.deepEqual(inventory(await save()),recovered);
    const recoveredHead=Object.keys(recovered).find(key=>JSON.parse(key).lineage?.history[0].inputs[0].item_key===head);
    const recoveredAsh=Object.keys(recovered).find(key=>JSON.parse(key).lineage?.history[0].inputs[0].item_key===ash);
    await assemble([recoveredHead,recoveredAsh]);
    const rebuilt=Object.keys(inventory(await read())).find(key=>JSON.parse(key).componentLineage?.head===recoveredHead);
    assert.ok(rebuilt);
    await openWorkshop();
    await choose('Carried gear',rebuilt);
    await choose('Gear process','salvage');
    await commit.press('Enter');
    const twice=inventory(await save());
    const secondHead=Object.keys(twice).find(key=>JSON.parse(key).id==='Iron axe head');
    const history=JSON.parse(secondHead).lineage.history;
    assert.equal(history.length,2);
    assert.equal(history[0].inputs[0].item_key,head);
    assert.equal(history[1].inputs[0].facts.quality,JSON.parse(recoveredHead).quality);
    await roundtrip('repeat-recovery-history',inventory);
    assert.deepEqual(inventory(await save()),twice);
    gates.push('Fixture supplies three traced parts and workshop admission. Native assembly, handle replacement and destructive salvage preserve their exact material histories.');
},{deterministic:true}).catch(error=>{
    console.error(error);
    process.exitCode=1;
});
