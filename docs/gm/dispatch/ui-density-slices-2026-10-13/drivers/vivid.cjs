const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;
const bg=(p,sel)=>p.evaluate(s=>{const e=document.querySelector(s);return e?getComputedStyle(e).backgroundColor:null;},sel);
(async()=>{await L.launch();const save=fs.readFileSync(S+'/out/progressed.json','utf8');const ctx=await L.browser.newContext({viewport:{width:1366,height:768}});
 const {p}=await L.open({ctx,save});const o={};
 o.standard={scheme:await p.evaluate(()=>document.documentElement.dataset.colorScheme),actions:await bg(p,'#location_related_div'),shell:await bg(p,'.workspace-module[data-module=local-actions]')};
 await p.locator('.workspace-layout-menu > summary').click();await p.selectOption('select[data-workspace-action=colors]','vivid');await p.locator('.workspace-layout-menu > summary').click();await p.waitForTimeout(200);
 o.vivid={scheme:await p.evaluate(()=>document.documentElement.dataset.colorScheme),actions:await bg(p,'#location_related_div'),vitals:await bg(p,'#basic_character_info_div'),stored:await p.evaluate(()=>localStorage.getItem('yairpg.colors.v1'))};
 await p.reload({waitUntil:'domcontentloaded'});await L.doPlay(p);o.afterReload={scheme:await p.evaluate(()=>document.documentElement.dataset.colorScheme),select:await p.locator('select[data-workspace-action=colors]').inputValue()};
 // Real Appearance palette: Authoring > Background colour > Apply and save, then back to play.
 await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(500);
 await p.locator('input[aria-label="Background"]').first().fill('#5a1010');await p.locator('input[aria-label="Background"]').first().dispatchEvent('change');await p.waitForTimeout(100);
 await p.getByRole('button',{name:'Apply and save'}).first().click();await p.waitForTimeout(800);
 o.applyStatus=await p.locator('.customization-draft-status').first().innerText();
 await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(600);
 o.custom={marker:await p.evaluate(()=>document.getElementById('location_related_div').dataset.customPalette),actions:await bg(p,'#location_related_div')};
 await p.screenshot({path:S+'/shots/vivid_custompalette_1366.png'});
 // contrast of key text on vivid surfaces
 console.log(JSON.stringify(o,null,1));console.log('errs',p.errs);await L.browser.close();})();
