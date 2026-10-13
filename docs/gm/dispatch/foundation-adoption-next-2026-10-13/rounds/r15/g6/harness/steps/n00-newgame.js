// Natural start: fresh origin, PLAY, default hero creation, Village. Then open the courtyard summary and visit.
await page.waitForTimeout(2500);
await h.play();
await page.locator('input').filter({visible: true}).first().fill('R15 G6 natural');
await page.getByText('Confirm', {exact: true}).click();
await page.waitForTimeout(1500);
const before = await h.courtyard();
expect(before && !before.hidden && before.rows.length === 1, 'only the free charter is offered before visiting');
await page.locator('#management_panel > summary').click();
await h.mg('Visit the market courtyard');
const after = await snap('charter');
expect(after.st.money === 102 && after.st.facts['mg.opened'] === true, 'charter grants no money');
return {loaded: h.loaded, errors: h.errors, before, rows: (await h.courtyard()).rows.length, st: after.st};
