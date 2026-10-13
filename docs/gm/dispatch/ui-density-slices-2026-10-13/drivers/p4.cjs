const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;
(async()=>{await L.launch();const fx=JSON.parse(fs.readFileSync(S+'/out/persist/P4.json'));const ctx=await L.browser.newContext({viewport:{width:1366,height:768},storageState:fx.state});
const {p}=await L.open({ctx});await p.locator('[data-workspace-action=context]').click();await p.waitForTimeout(500);
const r=await p.evaluate(()=>({density:document.getElementById('main_content').dataset.density,context:document.getElementById('main_content').dataset.workspaceContext,stored:JSON.parse(localStorage.getItem('yairpg.workspace.v1.desktop.authoring')).density}));
console.log(JSON.stringify(r));await p.screenshot({path:S+'/shots/P4_authoring_a1.png'});await L.browser.close();})();
