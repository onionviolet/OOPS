const L=require('./lib.cjs');const S=process.env.S;
(async()=>{await L.launch();const {p,ctx}=await L.open({w:1366,h:768});const o={};
 await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(400);o.authoring=await p.evaluate(()=>[document.getElementById('main_content').dataset.workspaceContext,document.querySelector('[data-workspace-action=context]').textContent]);
 await p.screenshot({path:S+'/shots/authoring_1366_a2.png'});
 await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(300);o.back=await p.evaluate(()=>document.getElementById('main_content').dataset.workspaceContext);
 // keyboard: open menu, Edit layout, focus records handle, ArrowDown, Escape menu
 await p.locator('.workspace-layout-menu > summary').focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);
 await p.locator('[data-workspace-action=edit-layout]').focus();await p.keyboard.press('Enter');await p.waitForTimeout(150);
 const before=await p.evaluate(()=>[...document.querySelectorAll('.workspace-dock[data-dock=right] > .workspace-module')].map(m=>m.dataset.module).slice(0,3));
 await p.locator('.workspace-module[data-module=records] .workspace-drag-handle').focus();await p.keyboard.press('ArrowDown');await p.waitForTimeout(150);
 const after=await p.evaluate(()=>[...document.querySelectorAll('.workspace-dock[data-dock=right] > .workspace-module')].map(m=>m.dataset.module).slice(0,3));
 o.reorder={before,after};o.stored=await p.evaluate(()=>!!localStorage.getItem('yairpg.workspace.v1.desktop'));
 await p.locator('.workspace-layout-menu > summary').click();await p.locator('[data-workspace-action=edit-layout]').click();await p.waitForTimeout(100);
 o.afterDone=await p.evaluate(()=>[...document.querySelectorAll('.workspace-drag-handle')].filter(e=>e.getBoundingClientRect().width>0).length);
 await p.keyboard.press('Escape');console.log(JSON.stringify(o));console.log('errs',p.errs);await L.browser.close();})();
