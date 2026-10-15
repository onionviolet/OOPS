// Compare backlog panel state (visibility, rows, enabled, terms, blockers) on one build at fixed moments.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.argv[2];
const dump=page=>page.evaluate(()=>Object.fromEntries(['backlog_opening_panel','backlog_expansion_panel'].map(id=>{const p=document.getElementById(id);if(!p)return [id,'missing'];
 return [id,{hidden:p.hidden,rows:[...p.querySelectorAll('.expedition_card')].filter(r=>!r.hidden).map(r=>{const b=r.querySelector('button'),ps=[...r.querySelectorAll('p')];return [b.dataset.backlogAction,b.disabled,ps.map(x=>x.hidden?'':x.textContent).join('|')];})}];})));
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const out={},errors=[];
try{const c=await b.newContext({viewport:{width:1366,height:768}});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
await p.goto(URL,{waitUntil:'load'});await p.waitForTimeout(1500);out.load=await dump(p);
await p.getByText('PLAY',{exact:true}).click({noWaitAfter:true});const cf=p.getByText('Confirm',{exact:true});if(await cf.isVisible().catch(()=>false))await cf.click({noWaitAfter:true});
await p.waitForTimeout(3000);out.play=await dump(p);
// Meet the elder through the native greeting so the main panel can open.
await p.getByText('Talk to someone',{exact:false}).click();await p.locator('[data-dialogue="villageElder"]').click();
await p.locator('[data-textline="hello"]').click();await p.waitForTimeout(1500);out.inDialogue=await dump(p);
await p.locator('.end_dialogue_button').click();
await p.waitForTimeout(3000);out.afterElder=await dump(p);await p.waitForTimeout(6000);out.later=await dump(p);
}finally{await b.close();}out.errors=errors;const vis=o=>Object.fromEntries(Object.entries(o).filter(([,v])=>v&&v.hidden===false));for(const k of ['load','play','inDialogue','afterElder','later'])out[k]=vis(out[k]||{});console.log(JSON.stringify(out));})();
