// Probe: native stamina bar read synchronously around a stamina-costing courtyard click.
await idle();
await h.openAll();
return await page.evaluate(() => {
    const bar = () => [...document.querySelectorAll('div,span')].filter(d => /stamina/.test(d.innerText || '') && d.children.length === 0).map(d => d.innerText)[0];
    const b = [...document.querySelectorAll('#management_panel section button')].find(b => b.offsetParent && !b.disabled && b.textContent.includes('Tend the planted crop'));
    const before = bar();
    if (!b) return {before, none: [...document.querySelectorAll('#management_panel section button')].filter(b => b.offsetParent).map(b => b.textContent)};
    b.click();
    return {before, after: bar(), notice: document.querySelector('#management_panel [role=status]').textContent};
});
