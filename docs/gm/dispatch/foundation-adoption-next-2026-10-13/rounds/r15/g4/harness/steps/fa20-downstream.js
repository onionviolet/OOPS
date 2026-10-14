await page.locator('.location_choice_dropdown.choice_travel').first().click();await page.getByText('Go outside to [Village]',{exact:false}).click();
await h.click('Accept the association supply commission');await h.click('Read the ordinary-craft supply attempt terms');await h.click('Accept an ordinary-craft supply attempt');await h.record('fa15-ordinary-supply-accepted');
await h.click('Deliver 3 kits');await h.record('fa20-kit-downstream-fa15-supply-completed');
return await h.persist('fa20-final-fa15-supply');
