const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='/Users/weiwei/code/yet-another-idle-rpg/docs/reviews/ui-experience-2026-10-12';
const targets=[['shared','http://127.0.0.1:18612/'],['workspace','http://127.0.0.1:18571/'],['customization','http://127.0.0.1:18582/']];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[];
 try {for(const [kind,url] of targets)for(const [width,height] of [[1440,900],[1512,982],[1920,1080]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);
  const row={kind,url,width,height,generatedFreshHero:true,errors};results.push(row);
  try{
   await page.goto(url);await page.getByText('PLAY',{exact:true}).click();const confirm=page.getByText('Confirm',{exact:true});if(await confirm.isVisible())await confirm.click();
   await page.locator('#location_actions_div').waitFor({state:'visible'});await page.waitForTimeout(1200);
   const capture=async name=>{
    await page.screenshot({path:path.join(out,`${kind}-${width}-${name}.png`)});
    return page.evaluate(()=>{
     const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
     const visible=n=>!!(n?.getClientRects().length)&&getComputedStyle(n).visibility!=='hidden';
     const ids=['basic_character_info_div','location_actions_div','inventory_div','message_box_div','journal_div','skill_list','workspace_current_work','customization_panel','work_ledger_panel'];
     const panels=ids.map(id=>document.getElementById(id)).filter(visible).map(n=>({id:n.id,...rect(n),scrollTop:n.scrollTop,clientHeight:n.clientHeight,scrollHeight:n.scrollHeight}));
     const controls=[...document.querySelectorAll('button,[onclick],input,select,textarea')].filter(visible).map(n=>{
      const r=n.getBoundingClientRect();let clipped=r.bottom>innerHeight||r.top<0||r.right>innerWidth||r.left<0;
      for(let p=n.parentElement;p;p=p.parentElement){const s=getComputedStyle(p),pr=p.getBoundingClientRect();if(/auto|scroll|hidden/.test(s.overflowY)&&(r.bottom>pr.bottom||r.top<pr.top))clipped=true;}
      return {id:n.id,tag:n.tagName,label:(n.innerText||n.getAttribute('aria-label')||n.value||'').slice(0,90),...rect(n),clipped,tabIndex:n.tabIndex};
     });
     return {documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,scrollY,panels,controls};
    });
   };
   row.bundle=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?'))?.name);
   row.opening=await capture('opening');
   if(kind==='customization'&&width===1440){
    row.editingOpen=[];
    for(const label of ['Original customization','Presentation profiles','Original rules authoring']){
     const summary=page.locator('summary').filter({hasText:label}).first();if(await summary.count()){await summary.scrollIntoViewIfNeeded();if(!await summary.evaluate(n=>n.parentElement.open))await summary.click();row.editingOpen.push(label);}
    }
    row.editing=await capture('editing');
   }
   if(width===1440){
    const talk=page.getByText('Talk to someone',{exact:false}).first();await talk.click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
    row.afterConversation=await capture('conversation');
   }
   console.log(JSON.stringify({kind,width,openingWidth:row.opening.documentWidth,openingHeight:row.opening.documentHeight,clipped:row.opening.controls.filter(c=>c.clipped).length,errors}));
  }catch(e){row.failure=e.message;console.log(JSON.stringify({kind,width,failure:e.message}));}
  await context.close();fs.writeFileSync(path.join(out,'EVIDENCE.json'),JSON.stringify({date:'2026-10-12',scope:'Fresh public opening, elder greeting, and customization disclosure only. No private packs or personal saves. Candidate binaries reviewed, not rebuilt by audit.',results},null,2));
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
