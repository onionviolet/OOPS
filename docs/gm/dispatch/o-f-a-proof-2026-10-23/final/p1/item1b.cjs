// Item 1 (viewport part): 1536x864 at UI font 14px and 21px via the Settings "Text size N" preset buttons (real clicks).
// Usage: node item1b.cjs <14|21>   (from worktree root)
const fs=require('node:fs'),path=require('node:path');
const {run,out,realClick,root}=require('./lib.cjs');
const px=process.argv[2]||'14';const results={px};
run('i1b-'+px,async({page,url,say,shot})=>{
 const nav=async label=>{const direct=page.locator(`button:text-is("${label}")`).locator('visible=true').first();
  if(await direct.count()){return realClick(page,direct,say,'nav '+label);}
  const more=page.locator('button:has-text("More"):not(select)').locator('visible=true').filter({hasText:/^More \d+/}).first();
  await realClick(page,more,say,'nav fold button (for '+label+')');await page.waitForTimeout(400);
  const item=page.locator('[class*=control-box],[role=dialog],div').locator(`button:text-is("${label}"), a:text-is("${label}"), li:text-is("${label}"), *:text-is("${label}")`).locator('visible=true').last();
  return realClick(page,item,say,'folded nav item '+label);};
 await page.goto(url+'&structured_candidate=warmhand');await page.waitForFunction(()=>window.simulationTestHooks);
 await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(1500);
 await nav('Settings');await page.waitForTimeout(700);
 const preset=page.locator(`[data-text-size-preset="${px}"]`);say('preset count',await preset.count(),'disabled',await preset.first().isDisabled().catch(()=>null));
 await realClick(page,preset.first(),say,'Text size '+px);await page.waitForTimeout(1000);
 results.bodyFont=await page.evaluate(()=>({custom:getComputedStyle(document.documentElement).getPropertyValue('--custom-size'),body:getComputedStyle(document.body).fontSize,main:getComputedStyle(document.getElementById('main_content')||document.body).fontSize}));say('font',results.bodyFont);
 await shot('0-settings');
 await nav('Beginning');await page.waitForTimeout(600);await shot('1-begin');
 results.begin=await realClick(page,page.locator('[data-structured-begin]'),say,'Begin');await page.waitForTimeout(1000);await shot('2-begun');
 if(!await page.locator('#character_show_bio').isVisible())await nav('Stats');
 await page.waitForTimeout(400);await realClick(page,page.locator('#character_show_bio'),say,'Bio tab');await page.waitForTimeout(400);
 for(const s of ['description','heritage']){const d=page.locator(`[data-bio-section="${s}"]`);if(await d.isVisible()&&!await d.evaluate(n=>n.open))await realClick(page,d.locator('summary'),say,'Bio '+s);}
 await page.waitForTimeout(300);await shot('3-bio');
 await nav('Notebook');await page.waitForTimeout(800);await shot('4-notebook');
 results.overflow=await page.evaluate(()=>({docScrollW:document.documentElement.scrollWidth,innerW:innerWidth,docScrollH:document.documentElement.scrollHeight,innerH:innerHeight}));say('overflow',results.overflow);
 fs.writeFileSync(path.join(out,`i1b-${px}-results.json`),JSON.stringify(results,null,1));
},{width:1536,height:864});
