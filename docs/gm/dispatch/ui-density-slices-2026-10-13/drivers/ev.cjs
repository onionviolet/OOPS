// usage: node ev.cjs state w h 'js expr' [shotname] [fresh]
const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;
(async()=>{await L.launch();const [state,w,h,expr,shot,fresh]=process.argv.slice(2);
 const {p}=await L.open({w:+w,h:+h,save:fresh?null:fs.readFileSync(S+'/out/progressed.json','utf8')});
 await L.routes[state](p);const r=await p.evaluate(expr);console.log(typeof r==='string'?r:JSON.stringify(r,null,0));
 if(shot)await p.screenshot({path:S+'/shots/'+shot+'.png'});if(p.errs.length)console.log('ERRS',p.errs.slice(0,3));await L.browser.close();})();
