// The single-wolf patrol (ri.wolf.tide) in Fang Yuan's lead life, played in the live build: two moonblades, then capture.
import {readFile, mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {Session} from '/Users/weiwei/code/yet-another-idle-rpg/scripts/playtest/lib.mjs';
const [origin, out, tag, savePath] = process.argv.slice(2);
const url = new URL(origin); url.searchParams.set('test_hooks', '1');
await mkdir(out, {recursive: true});
const s = await new Session({url: url.href, seed: 7, wall: Date.UTC(2026,10,20), opTimeout: 20000,
  hooks:{beforeOpen:async (context, seed) => { if (seed) await context.addInitScript(()=>sessionStorage.setItem('layout-fixture','1')); await context.route('**/layout-lab/{layout.css,layout.mjs,rewind.mjs}', r => r.fulfill({body:'',contentType:r.request().url().endsWith('.css')?'text/css':'application/javascript'})); }}}).start();
try {
  await s.open(JSON.parse(await readFile(savePath, 'utf8')));
  const page = s.page; await page.setViewportSize({width:1920,height:1080});
  const opener = page.locator('[data-tempo="open:ri.wolf.tide"]');
  await page.waitForTimeout(3000);
  if (!await opener.first().isVisible()) {
    const nb = page.locator('[data-panel-path="notebook"]:visible').first();
    if (await nb.count()) await nb.click();
    await page.evaluate(()=>{const p=document.getElementById('tempo_fight_panel');if(p instanceof HTMLDetailsElement)p.open=true;});
  }
  console.log('opener', await opener.count(), await opener.first().getAttribute('title').catch(()=>null));
  console.log('opener disabled', await opener.first().isDisabled());
  await opener.first().dispatchEvent('click');
  const fight = page.locator('#fight_situation[data-fight-mode="tempo"]'); await fight.waitFor();
  const back = page.locator('button:has-text("Back to"):visible').first(); if (await back.count()) { await back.click(); await page.waitForTimeout(500); }
  const blade = page.locator('#fight_situation button[data-fight-option="jab"], #fight_situation button[data-fight-option="moonblade"]:enabled');
  for (let i = 0; i < 2; i++) { if (!await blade.count() || !await blade.first().isEnabled()) break; await blade.first().click(); await page.waitForTimeout(400); }
  for (const [w,h] of [[1920,1080],[1800,1072]]) { await page.setViewportSize({width:w,height:h}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(500);
    await page.screenshot({path: join(out, `${tag}-ri-${w}.png`), animations: 'disabled'}); }
  const m = await page.evaluate(() => ({essenceShown: [...document.querySelectorAll('#main_content *')].filter(n => n.children.length === 0 && /essence/i.test(n.textContent) && n.offsetParent).map(n => n.textContent.trim()).slice(0, 6),
    focus: document.getElementById('current_focus')?.innerText.slice(0, 300), moves: [...document.querySelectorAll('#fight_situation button[data-fight-option]')].map(b => b.textContent.trim())}));
  console.log(tag, JSON.stringify(m), 'pageerrors', JSON.stringify(s.errors.filter(e => e.kind === 'pageerror')));
} finally { await s.close(); }
