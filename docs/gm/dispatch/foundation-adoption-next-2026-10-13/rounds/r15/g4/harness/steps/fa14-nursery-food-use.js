await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-nursery-cooking.txt'));await h.play();
await page.locator('.location_choice_dropdown.choice_travel').first().click();await page.getByText('Go outside to [Village]',{exact:false}).click();await page.locator('.choice_craft').click();
await page.locator('#crafting_window').getByText('Cooking',{exact:true}).click();await h.record('fa14-nursery-before-cooking');
await page.locator('#crafting_window [data-recipe_id="Goat stew"] .recipe_item_name').click();await h.record('fa14-nursery-goat-stew-crafted');
await page.locator('#crafting_window').getByText('Exit',{exact:true}).click();
const row=page.locator('[data-character_item=\'{"id":"Goat stew"}\']');await row.hover();await row.locator('.item_use_button').click();
await h.record('fa14-nursery-food-used');h.write('fa14-nursery-food-effects.json',(await h.saved()).active_effects);return await h.persist('fa14-nursery-food-final');
