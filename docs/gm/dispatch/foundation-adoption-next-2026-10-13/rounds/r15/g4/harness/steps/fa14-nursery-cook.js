await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-nursery-cooking.txt'));await h.play();
await page.locator('.choice_craft').click();return {recipes:await page.getByText('Goat stew',{exact:true}).count(),body:(await h.text('#crafting_window')).slice(0,1100)};
