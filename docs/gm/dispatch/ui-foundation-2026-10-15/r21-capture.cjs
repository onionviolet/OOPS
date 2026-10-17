// R21 capture over the MB7 target set: screenshot plus chrome rows (top nav, bottom bar, one bar),
// panel control rows (Inventory, Reports), visible inventory rows and log lines, page overflow.
// Usage: R4_URL=http://127.0.0.1:19490 node r21-capture.cjs <label> [populated,combat]
const T=require('./target-set.cjs');const {L}=T;const {fs,path}=L;
const label=process.argv[2]||'run';const E=path.join(__dirname,'evidence/r21',label);
const FIX={populated:L.save,combat:fs.readFileSync(path.join(__dirname,'evidence/parity-r9/populated-three.save.txt'),'utf8')};
const pick=(process.argv[3]||'populated,combat').split(',');
const measure=p=>p.evaluate(()=>{
    const vis=n=>!!n&&n.checkVisibility()&&n.getBoundingClientRect().height>0;
    const h=n=>vis(n)?Math.round(n.getBoundingClientRect().height):0;
    const q=s=>document.querySelector(s);
    const inv=q('#inventory_content_div'),ir=inv?.getBoundingClientRect();
    const invRows=inv&&vis(inv)?[...inv.querySelectorAll(':scope > [data-character_item]')].filter(n=>{const b=n.getBoundingClientRect();return n.checkVisibility()&&b.top>=ir.top-1&&b.bottom<=ir.bottom+1;}).length:0;
    const log=q('#message_log_div')||q('[data-region=log]'),lr=log?.getBoundingClientRect();
    const logLines=log?[...log.querySelectorAll('.message_common')].filter(n=>{const b=n.getBoundingClientRect();return n.checkVisibility()&&b.top>=lr.top-1&&b.bottom<=lr.bottom+1;}).length:0;
    // Rows above the inventory list inside its region, and log controls, are "control rows".
    const invRegion=q('.parity-region[data-region=inventory]'),logRegion=q('.parity-region[data-region=log]');
    const above=(region,list)=>region&&list&&vis(list)?Math.round(list.getBoundingClientRect().top-region.getBoundingClientRect().top):null;
    const logTools=q('[data-module=shell-log-tools]');
    const bar=q('#game_bar');
    return{nav:h(q('#workspace_navigation')),bottom:h(q('#bottom_panel_div')),bar:h(bar),
        invControls:above(invRegion,inv),logControls:h(logTools),invRows,logLines,
        regions:Object.fromEntries([...document.querySelectorAll('.parity-region')].filter(vis).map(n=>{const r=n.getBoundingClientRect();return[n.dataset.region,{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}];})),
        page:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,vw:innerWidth,vh:innerHeight}};});
(async()=>{const b=await T.launch();const all=[];
try{for(const fx of pick){const res=await T.forTargets(b,async(p,t)=>{await p.mouse.move(t.w-3,t.h-3);const m=await measure(p);await T.shot(p,path.join(E,`${fx}-${T.tag(t)}.png`));return{fixture:fx,...m,errors:p.errors};},{data:FIX[fx]});
    for(const r of res){all.push(r);if(r.fail)continue;console.log(fx,r.target,'nav',r.nav,'bottom',r.bottom,'bar',r.bar,'invCtl',r.invControls,'logCtl',r.logControls,'inv',r.invRows,'log',r.logLines,'page',r.page.h<=r.page.vh&&r.page.w<=r.page.vw?'ok':'OVERFLOW',r.errors.length?'ERR '+r.errors[0]:'');}}}
finally{await b.close();}
fs.mkdirSync(E,{recursive:true});fs.writeFileSync(path.join(E,'capture.json'),JSON.stringify(all,null,1));console.log('wrote',E);})();
