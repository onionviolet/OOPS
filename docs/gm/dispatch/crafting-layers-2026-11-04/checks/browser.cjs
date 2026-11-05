// Run from repo root after isolated BUILD_OUT build. Disposable generated stock only.
const fs = require('node:fs'), assert = require('node:assert/strict'), path = require('node:path');
const root = process.cwd(), out = path.join(root, 'work/crafting-layers-20261104');
const {launchChrome} = require(path.join(root, 'scripts/ui_helpers.cjs'));
const {startFresh} = require(path.join(root, 'docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const seed = JSON.parse(fs.readFileSync('/tmp/crafting-layers-seed.json', 'utf8'));
fs.mkdirSync(out, {recursive:true});
(async () => {
 const browser = await launchChrome(), checks = [], errors = [];
 try {
  for(const px of [14, 21]) {
   const context = await browser.newContext({viewport:{width:1920, height:1080}});
   await context.route('**/private_packs/manifest.json', r => r.fulfill({json:{schema:1,packs:[]}}));
   await context.addInitScript(s => {if(!localStorage.getItem('save data')) localStorage.setItem('save data', JSON.stringify(s));}, seed);
   const page = await context.newPage(); page.setDefaultTimeout(15000);
   page.on('pageerror', e => errors.push(e.message));
   await page.goto('http://127.0.0.1:18765/?test_hooks=1', {waitUntil:'domcontentloaded'});
   await page.waitForFunction(() => window.simulationTestHooks, null, {timeout:60000});
   await startFresh(page);
   await page.evaluate(px => {simulationTestHooks.pause();openCraftingWindow();document.getElementById('location_related_div').style.fontSize=px+'px';}, px);
   const snap = () => page.evaluate(() => simulationTestHooks.snapshot());
   const stock = async () => JSON.stringify((await snap()).inventories.person.main_character);
   const category = id => page.locator(`.crafting_mainpage_button[data-crafting_category="${id}"]`).click();
   const select = id => page.locator(`#crafting_window .recipe_div[data-recipe_id="${id}"]`).click();
   const shot = name => page.screenshot({path:path.join(out, `${name}-${px}.png`)});
   const before = await stock();
   await category('alchemy'); await select('Healing balm');
   assert.match(await page.locator('#crafting_detail [data-craft-effects]').innerText(), /Hp regen: \+5/);
   assert.match(await page.locator('#crafting_detail').innerText(), /Simply apply it/);
   assert.equal(await page.locator('#crafting_detail [data-glance="quality"]').count(), 0);
   await page.locator('#crafting_detail .craft_detail_stock > summary').click();
   await page.evaluate(() => window.openCraftingWindow());
   assert.equal(await page.locator('#crafting_detail .craft_detail_stock').evaluate(n=>n.open),true);
   assert.equal(await stock(), before);
   const action = await page.locator('#crafting_detail [data-craft-commit]').boundingBox();
   assert.ok(action && action.y+action.height<=1080, 'fixed Craft stays visible');
   await page.mouse.move(1000,110);await page.waitForTimeout(150);await shot('fixed-balm');
   checks.push(`${px}px: known effects, meaning, inapplicable quality omitted, disclosure retained, inspection spends nothing`);
   if(px===14) {
    await page.locator('#crafting_detail [data-craft-commit]').click();
    assert.match(await page.locator('#crafting_detail [data-craft-receipt]').innerText(), /Made|Failed/);
    const after = await snap();assert.equal(after.inventories.person.main_character['{"id":"Oneberry"}'].count,20);
    checks.push('fixed recipe: one native attempt consumes its quoted ingredients and shows measured receipt');
   }
   const blocked = page.locator('#crafting_window .recipe_div:visible').filter({has:page.locator('.recipe_readiness[data-ready="false"]')}).first();
   await blocked.click(); const blockedStock = await stock();
   await page.locator('#crafting_detail [data-craft-commit]').focus();await page.keyboard.press('Enter');
   assert.equal(await stock(),blockedStock);assert.ok(await page.locator('#crafting_detail [data-craft-blocked-reason]').isVisible());
   checks.push(`${px}px: blocked command explains without spending`);
   await category('forging');await page.evaluate(()=>switchCraftingRecipesSubpage('components'));
   await page.locator('#crafting_window .recipe_div:visible .recipe_name').first().click();
   const nativeBefore=await stock();await page.locator('#crafting_window .selected_recipe .recipe_comp_name').first().click();
   assert.match(await page.locator('#crafting_detail [data-craft-selection-result]').innerText(),/Quality:/);
   assert.equal(await stock(),nativeBefore);await page.mouse.move(1000,110);await page.waitForTimeout(150);await shot('component');
   if(px===14) {
    await page.locator('.selected_recipe [data-material-craft="1"]').first().click();
    assert.notEqual(await stock(),nativeBefore);
    assert.match(await page.locator('#crafting_detail').innerText(),/Quality:/);
    checks.push('component: first exact selection populates stable result; native craft refreshes selected result');
   }
   await category('crafting');await page.evaluate(()=>switchCraftingRecipesSubpage('equipment'));
   await page.locator('#crafting_window .recipe_div:visible .recipe_name').first().click();
   const partsBefore=await stock();
   await page.locator('.selected_recipe .selectable_component').first().focus();await page.keyboard.press('Enter');
   await page.locator('.selected_recipe .selectable_component').last().focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#crafting_detail [data-craft-selection-result]').innerText(),/Quality:/);
   assert.equal(await stock(),partsBefore);await page.mouse.move(1000,110);await page.waitForTimeout(150);await shot('assembly');
   if(px===14) {await page.locator('.selected_recipe .recipe_creation_button').focus();await page.keyboard.press('Enter');assert.notEqual(await stock(),partsBefore);checks.push('assembly: keyboard selections inspect without spending; explicit Create consumes parts');}
   checks.push(`${px}px: material and part workflows retain native controls with stable quality/result inspection`);
   assert.ok(await page.locator('#center_mode_back').isVisible());
   const geometry=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
    outside:[...document.querySelectorAll('*')].filter(n=>getComputedStyle(n).position==='absolute'&&n.getBoundingClientRect().bottom>1080).map(n=>n.className)}));
   assert.ok(geometry.width<=1920,JSON.stringify(geometry));
   assert.ok(geometry.height<=1080&&geometry.outside.length===0,JSON.stringify(geometry));
   checks.push(`${px}px: task Back visible; page ${geometry.width}×${geometry.height}`);
   await context.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors,route:'fresh origin; declared native stock/recipe fixture',viewport:'1920x1080; actual task text 14/21 px'},null,2));
  console.log('PASS',checks.length,JSON.stringify(checks));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
