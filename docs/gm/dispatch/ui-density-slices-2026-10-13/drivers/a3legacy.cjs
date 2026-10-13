const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;
(async()=>{await L.launch();for(const n of ['P1','P2']){const fx=JSON.parse(fs.readFileSync(`${S}/out/persist/${n}.json`));const ctx=await L.browser.newContext({viewport:{width:1366,height:768},storageState:fx.state});
 const {p}=await L.open({ctx});await L.routes.combat(p);
 const r=await p.evaluate(()=>({center:[...document.querySelectorAll('.workspace-dock[data-dock=center] > .workspace-module')].filter(m=>!m.hidden).map(m=>m.dataset.module),left:[...document.querySelectorAll('.workspace-dock[data-dock=left] > .workspace-module')].filter(m=>!m.hidden).map(m=>m.dataset.module),stored:localStorage.getItem('yairpg.workspace.v1.desktop').includes('"combat"')}));
 console.log(n,JSON.stringify(r));await p.screenshot({path:`${S}/shots/${n}_combat_a3.png`});await ctx.close();}await L.browser.close();})();
