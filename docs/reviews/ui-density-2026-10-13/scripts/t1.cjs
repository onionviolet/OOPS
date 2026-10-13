const L=require('./lib.cjs');const measure=require('./measure.cjs');const fs=require('fs');const out=process.argv[2];
const vps=[[1366,768],[1440,900],[1920,1080]];
(async()=>{await L.launch();const res=[];
for(const b of ['original','v06','current'])for(const [w,h] of vps){const {p,ctx}=await L.open(b,{width:w,height:h});
 await p.screenshot({path:`${out}/T1_opening_${w}x${h}_${b}.png`});
 const m=await p.evaluate(`(${measure.toString()})()`);res.push({build:b,state:'T1',vp:`${w}x${h}`,zoom:1,m,errs:p.errs});await ctx.close();}
fs.writeFileSync(out+'/t1.json',JSON.stringify(res,null,1));
for(const r of res)console.log(r.build,r.vp,JSON.stringify(r.m.doc),'play',r.m.clickables.play,'chrome',r.m.clickables.chrome,'list',r.m.clickables.listTools,'chrome%',r.m.chromeAreaPct,'scrollers',r.m.scrollers.length,'nested',r.m.nestedScrollers);
await L.browser.close();})();
