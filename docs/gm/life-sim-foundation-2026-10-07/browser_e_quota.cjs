const fs=require('node:fs');const assert=require('node:assert/strict');const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try {
const context=await browser.newContext();const fixture=JSON.parse(fs.readFileSync('/tmp/yairpg-life-foundation-proof/fresh.json','utf8'));fixture.availabilities.textline['villageElder:hello']|=4;fixture.availabilities.person.villageElder|=1;fixture.availabilities.dialogue.villageElder|=1;await context.addInitScript(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);const page=await context.newPage();page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:18317');await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();

await page.evaluate(()=>window.saveProgress());const before=await page.evaluate(()=>localStorage.getItem('save data'));
await page.evaluate(()=>localStorage.setItem('foundation-pressure','x'.repeat(2100000)));
await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await page.locator('#chronicle_panel > summary').click();await page.locator('[data-chronicle="begin-open"]').click();
const proof=await page.evaluate(before=>({unchanged:localStorage.getItem('save data')===before,exportAvailable:!!window.save_to_file(),text:document.getElementById('message_box_div').innerText}),before);
assert.ok(proof.unchanged);assert.ok(proof.exportAvailable);assert.match(await page.locator('#chronicle_panel').innerText(),/no room|room to safely/);assert.deepEqual(errors,[]);
fs.writeFileSync('/tmp/yairpg-life-foundation-proof/E_QUOTA_TRANSACTION.json',JSON.stringify({unchanged:proof.unchanged,exportAvailable:proof.exportAvailable,errors},null,2));console.log('Quota transaction proof passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
